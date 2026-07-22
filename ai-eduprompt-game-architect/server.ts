/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { DEFAULT_PROMPTS } from './src/templates.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Shared Prompts Directory & File paths
const DATA_DIR = path.join(__dirname, 'data');
const PROMPTS_FILE = path.join(DATA_DIR, 'prompts.json');

// Ensure directory and database exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read database
function getPromptsFromDb() {
  try {
    if (!fs.existsSync(PROMPTS_FILE)) {
      fs.writeFileSync(PROMPTS_FILE, JSON.stringify(DEFAULT_PROMPTS, null, 2), 'utf-8');
      return DEFAULT_PROMPTS;
    }
    const content = fs.readFileSync(PROMPTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading prompts file:', error);
    return DEFAULT_PROMPTS;
  }
}

// Helper to write database
function savePromptsToDb(prompts: any[]) {
  try {
    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to prompts file:', error);
    return false;
  }
}

// Gemini API Client Configuration
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// GET all prompts
app.get('/api/prompts', (req, res) => {
  const prompts = getPromptsFromDb();
  res.json(prompts);
});

// POST a new shared prompt
app.post('/api/prompts', (req, res) => {
  try {
    const newPrompt = req.body;
    if (!newPrompt.title || !newPrompt.generatedPrompt) {
      return res.status(400).json({ error: 'Missing required prompt parameters.' });
    }

    const prompts = getPromptsFromDb();
    const id = `prompt-${Date.now()}`;
    const sharedPrompt = {
      id,
      title: newPrompt.title,
      description: newPrompt.description || '',
      config: newPrompt.config,
      generatedPrompt: newPrompt.generatedPrompt,
      createdAt: new Date().toISOString(),
      teacherName: newPrompt.config?.teacherName || 'Anonymous',
      subject: newPrompt.config?.subject || 'General',
      topic: newPrompt.config?.topic || 'General Topic',
    };

    prompts.unshift(sharedPrompt);
    savePromptsToDb(prompts);
    res.json(sharedPrompt);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST to enhance/upgrade a prompt with Gemini API
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { config, customPrompt, customApiKey } = req.body;
    
    // Choose API key: custom key from client OR server-side environment key
    const currentApiKey = customApiKey || process.env.GEMINI_API_KEY;
    
    if (!currentApiKey) {
      return res.status(400).json({ 
        error: 'No API Key provided. Please add a GEMINI_API_KEY to Secrets (under Settings) or specify your API Key in the settings panel.' 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: currentApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptDetails = `
Subject: ${config.subject === 'Custom' ? config.customSubject : config.subject}
Teacher: ${config.teacherName}
Topic: ${config.topic}
CEFR / Target Learners: ${config.cefrLevel}
Number of Students: ${config.studentsCount}
Learning Styles: ${config.learningStyles.join(', ')}
Target Skills: ${config.targetSkills.join(', ')}

Pedagogical Goals:
- Primary Learning Goal: ${config.primaryGoal}
- Sub-objectives: ${config.subObjectives}
- Core Actions of the Game: ${config.coreActions}

Game Patterns & Mechanics:
- Pattern: ${config.gamePattern}
- Elements: ${config.gameElements.join(', ')}

UI & Design Preference:
- Color Palette: ${config.colorPalette}
- Typography: ${config.typography}
- Illustration Style: ${config.visualStyle}
- Animations: ${config.animations}
- Game Language: ${config.gameLanguage}

Production Details:
- Production Level: ${config.productionLevel}
- Extra Tech/Audio Add-ons: ${config.addons.join(', ')}
    `;

    const userInstructions = customPrompt 
      ? `Additionally, tailor and refine the design based on this specific teacher request: "${customPrompt}"`
      : 'Generate an elite, fully realized game prompt spec.';

    const systemInstruction = `You are "PRISM Game Architect", a master AI educator and prompt engineer specialized in the Learning Mechanics - Game Mechanics (LM-GM) framework (Arnab et al., 2015).
Your job is to expand the teacher's educational game parameters into an elite, highly-structured prompt specification that can be pasted directly into Claude, ChatGPT, or Gemini to run a fully interactive, text-based educational prompt game directly inside that AI chat window.

The generated prompt should turn the target AI into a "Game Master" (GM). The prompt must instruct the GM to run the game turn-by-turn (waiting for player input, never auto-advancing, evaluating answers with pedagogical scaffolding, and displaying a text status dashboard).

Structure your response into a complete, professional, ready-to-copy Markdown prompt. It must include:
1. # ROLE & CORE DIRECTIVE: Instructions to act as "${config.teacherName || 'Kru Somjet'}", the educational Game Master, running an interactive text game on "${config.topic}".
2. ## Core Pedagogy & LM-GM Alignment: Instruct the AI on how to map player actions (answering questions, solving problems, choosing story paths) to educational goals, and how to give constructive learning feedback after each turn.
3. ## Game Mechanics, Rules & Scoring: Detail exactly how levels progress (following the curriculum sequence), how score/XP is calculated, how items/inventory or currency works, and how achievements/badges are unlocked.
4. ## Atmosphere, Vibe & Aesthetic Narration: Direct the AI to use the specified Color Palette (${config.colorPalette}), Illustration Style (${config.visualStyle}), and Animation/Pacing style (${config.animations}) metaphorically in its text descriptions, emojis, and storytelling style.
5. ## Status Dashboard Structure: Give the AI a strict, elegant Markdown layout (using emojis) to display at the end of every response, showing Level, Score/XP, Active Quest, and Inventory/Achievements.
6. ## Playthrough Flow & Step-by-Step Levels: Outline each level based on the curriculum sequence. Provide 3-5 concrete mock scenarios, questions, or challenges tailored to the subject (${config.subject}) and topic (${config.topic}) that the GM can draw from.
7. ## Start Instructions: Explicitly instruct the AI to begin with a captivating introductory screen, explain the goal, and ask the player to type "START" or state their name.

Make sure the resulting Prompt is highly descriptive, engaging, and tailored exactly to the subject (${config.subject}) and topic (${config.topic}). Use inspiring educational terms. It must be a ready-to-use, comprehensive prompt-game master template.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { text: promptDetails },
        { text: userInstructions }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'An unexpected error occurred during prompt enhancement.' });
  }
});

// Configure Vite or Static Asset Serving
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  app.use(vite.middlewares);
} else {
  // Serve static assets in production
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start Server on Hardcoded Port 3000 if not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export default app;
