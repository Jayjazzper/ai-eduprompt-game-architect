/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Globe, Key, Check, ChevronRight, ChevronLeft, 
  Copy, Download, Printer, Save, Share2, HelpCircle, 
  Layers, Palette, Type, Video, Monitor, MessageSquare, 
  Volume2, Music, Zap, Award, Flame, Users, Clock, 
  RotateCcw, BookOpen, User, Star, Database, CheckCircle,
  X, AlertCircle, Plus, History, Trash2, Brain, Compass,
  ArrowLeftRight, Upload, ThumbsUp, ThumbsDown
} from 'lucide-react';

import { GamePromptConfig, SharedPrompt, PromptHistoryItem, TeacherProfileStats, GamificationActivity } from './types';
import { COLOR_PALETTES, GAME_PATTERNS, SUBJECT_PRESETS, DEFAULT_CONFIG, TRANSLATIONS, CORE_COMPETENCIES, SKILLS_3R8C, STARTER_TEMPLATES } from './templates';
import MarkdownSyntaxHighlighter from './components/MarkdownSyntaxHighlighter';
import AssessmentRubric from './components/AssessmentRubric';
import SmartContext from './components/SmartContext';
import CurriculumSequence from './components/CurriculumSequence';
import PromptDiffViewer from './components/PromptDiffViewer';
import GamificationAnalytics from './components/GamificationAnalytics';
import GuidedTour from './components/GuidedTour';
import ComplexityMeter from './components/ComplexityMeter';
import LessonOverviewModal from './components/LessonOverviewModal';
import VoiceDictationButton from './components/VoiceDictationButton';
import AddonDragDropCanvas from './components/AddonDragDropCanvas';
import StepTutorialPlayer from './components/StepTutorialPlayer';
import TeacherGamification from './components/TeacherGamification';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_PRESETS = [
  { id: 'preset-1', emoji: '👩‍🏫', labelTh: 'คุณครูผู้หญิง', labelEn: 'Female Teacher' },
  { id: 'preset-2', emoji: '👨‍🏫', labelTh: 'คุณครูผู้ชาย', labelEn: 'Male Teacher' },
  { id: 'preset-3', emoji: '🧑‍💻', labelTh: 'นักพัฒนาเกม', labelEn: 'Developer' },
  { id: 'preset-4', emoji: '🧙‍♂️', labelTh: 'พ่อมดเวทมนตร์', labelEn: 'Wizard' },
  { id: 'preset-5', emoji: '🚀', labelTh: 'นักสำรวจ', labelEn: 'Explorer' },
  { id: 'preset-6', emoji: '🎨', labelTh: 'ดีไซเนอร์ศิลปะ', labelEn: 'Art Designer' },
  { id: 'preset-7', emoji: '🦄', labelTh: 'นักคิดสร้างสรรค์', labelEn: 'Creative' },
  { id: 'preset-8', emoji: '🤖', labelTh: 'ผู้ช่วย AI', labelEn: 'AI Assistant' },
];

function getAvatarEmoji(id: string | undefined): string {
  const found = AVATAR_PRESETS.find(a => a.id === id);
  return found ? found.emoji : '👩‍🏫';
}

function renderAvatar(avatarKeyOrData: string | undefined, sizeClass: string = "w-10 h-10") {
  if (avatarKeyOrData && avatarKeyOrData.startsWith('data:image/')) {
    return (
      <img 
        src={avatarKeyOrData} 
        alt="Avatar" 
        className={`${sizeClass} rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0`}
        referrerPolicy="no-referrer"
      />
    );
  }
  const emoji = getAvatarEmoji(avatarKeyOrData);
  return (
    <div className={`${sizeClass} rounded-full bg-[#F5F2FF] border border-[#ECE4FF] flex items-center justify-center text-lg shadow-sm shrink-0`}>
      {emoji}
    </div>
  );
}

const STEPS_LIST = [1, 1.5, 2, 3, 4, 5, 6, 7, 8];

export default function App() {
  // Navigation tabs: 'builder' | 'community'
  const [activeTab, setActiveTab] = useState<'builder' | 'community'>('builder');
  
  // App Language: 'th' | 'en'
  const [lang, setLang] = useState<'th' | 'en'>('th');

  // Guided Tour state
  const [showTour, setShowTour] = useState(false);

  // Auto start tour for first-time users
  useEffect(() => {
    const isCompleted = localStorage.getItem('prism_tour_completed');
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Multi-step Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [config, setConfig] = useState<GamePromptConfig>(() => {
    // Try to load state from localStorage or use defaults
    const saved = localStorage.getItem('prism_builder_config');
    return saved ? JSON.parse(saved) : { ...DEFAULT_CONFIG };
  });

  const [lastCheckpointConfig, setLastCheckpointConfig] = useState<GamePromptConfig>(() => {
    const saved = localStorage.getItem('prism_builder_config');
    return saved ? JSON.parse(saved) : { ...DEFAULT_CONFIG };
  });
  const [revertWarningItem, setRevertWarningItem] = useState<PromptHistoryItem | null>(null);

  // Save config to localStorage on change
  useEffect(() => {
    localStorage.setItem('prism_builder_config', JSON.stringify(config));
  }, [config]);

  // Modals and API Overlay State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('prism_custom_api_key') || '');
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLessonOverviewModal, setShowLessonOverviewModal] = useState(false);
  
  const [saveTitle, setSaveTitle] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [shareDesc, setShareDesc] = useState('');

  // Generated & Optimized Prompts
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [aiStep, setAiStep] = useState(0);
  const [promptRating, setPromptRating] = useState<'up' | 'down' | null>(null);

  const [lastSaved, setLastSaved] = useState<string>('');

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const saved = localStorage.getItem('prism_builder_config');
    if (saved) {
      setLastSaved(lang === 'th' ? 'กู้คืนเซสชันล่าสุดเรียบร้อยแล้ว' : 'Previous session restored');
    }
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('prism_builder_config', JSON.stringify(configRef.current));
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(lang === 'th' ? `บันทึกอัตโนมัติเมื่อ ${timeString}` : `Auto-saved at ${timeString}`);
    }, 30000);

    return () => clearInterval(interval);
  }, [lang]);

  // Reset prompt rating when the prompt itself changes
  useEffect(() => {
    setPromptRating(null);
  }, [generatedPrompt, enhancedPrompt]);

  // Recent History of Prompt configurations generated during the session
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>(() => {
    const saved = localStorage.getItem('prism_prompt_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Library Lists
  const [savedPrompts, setSavedPrompts] = useState<SharedPrompt[]>([]);
  const [publicPrompts, setPublicPrompts] = useState<SharedPrompt[]>([]);
  const [librarySubTab, setLibrarySubTab] = useState<'saved' | 'public'>('public');

  // Custom target skills support for multiple subjects
  const [newSkillInput, setNewSkillInput] = useState('');
  const [customSkills, setCustomSkills] = useState<string[]>([]);

  // System status / UI alerts
  const [copied, setCopied] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Teacher Gamification State & Persist
  const [gamificationStats, setGamificationStats] = useState<TeacherProfileStats>(() => {
    const saved = localStorage.getItem('prism_teacher_gamification');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse gamification stats', e);
      }
    }
    return {
      xp: 120, // Nice starting points
      level: 1,
      badges: [],
      activities: [
        {
          id: 'onboarding-join',
          timestamp: new Date().toISOString(),
          points: 120,
          descriptionTh: 'เริ่มการเดินทางสถาปนิกเกมนวัตกรรมกับ PRISM (+120 XP)',
          descriptionEn: 'Joined PRISM Educational Game Architect community (+120 XP)'
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('prism_teacher_gamification', JSON.stringify(gamificationStats));
  }, [gamificationStats]);

  const addXPPoints = (points: number, descriptionTh: string, descriptionEn: string, customId?: string) => {
    setGamificationStats(prev => {
      const targetId = customId || `xp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const isDuplicate = prev.activities.some(act => act.id === targetId);
      if (isDuplicate) return prev;

      const newActivity = {
        id: targetId,
        timestamp: new Date().toISOString(),
        points,
        descriptionTh,
        descriptionEn
      };

      const newXP = prev.xp + points;
      
      let newLevel = 1;
      if (newXP < 150) newLevel = 1;
      else if (newXP < 450) newLevel = 2;
      else if (newXP < 900) newLevel = 3;
      else if (newXP < 1600) newLevel = 4;
      else newLevel = 5;

      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        setAlertMsg({
          type: 'success',
          text: lang === 'th'
            ? `🎉 ยินดีด้วย! คุณเลเวลอัพเป็น Level ${newLevel} (${newLevel === 2 ? 'Apprentice Architect' : newLevel === 3 ? 'Active Innovator' : newLevel === 4 ? 'Educational Hero' : 'Master Architect'})!`
            : `🎉 Level Up! You are now Level ${newLevel} (${newLevel === 2 ? 'Apprentice Architect' : newLevel === 3 ? 'Active Innovator' : newLevel === 4 ? 'Educational Hero' : 'Master Architect'})!`
        });
      } else {
        setAlertMsg({
          type: 'success',
          text: lang === 'th'
            ? `✨ ได้รับ +${points} XP: ${descriptionTh}`
            : `✨ Earned +${points} XP: ${descriptionEn}`
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        activities: [...prev.activities, newActivity]
      };
    });
  };

  // Scroll to top of form container on step change
  const formRef = useRef<HTMLDivElement>(null);

  // Layout density calculation based on config
  const density = config.layoutDensity || 'standard';
  const densityStyles = {
    containerPadding: density === 'compact' ? 'p-4 md:p-5' : density === 'comfortable' ? 'p-8 md:p-10' : 'p-6 md:p-8',
    headerSpacing: density === 'compact' ? 'pb-2.5 mb-3.5 border-b border-slate-100' : density === 'comfortable' ? 'pb-6 mb-8 border-b border-slate-100' : 'border-b border-slate-100 pb-5 mb-6',
    stepSpacing: density === 'compact' ? 'space-y-4' : density === 'comfortable' ? 'space-y-8' : 'space-y-6',
    itemPadding: density === 'compact' ? 'p-2.5 rounded-xl' : density === 'comfortable' ? 'p-5 rounded-[24px]' : 'p-3.5 rounded-2xl',
    gridGap: density === 'compact' ? 'gap-2' : density === 'comfortable' ? 'gap-5' : 'gap-3',
    textSizeTitle: density === 'compact' ? 'text-lg' : density === 'comfortable' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
    textSizeDesc: density === 'compact' ? 'text-[11px] leading-snug' : density === 'comfortable' ? 'text-sm md:text-base leading-relaxed' : 'text-xs md:text-sm mt-1 font-medium',
    textLabel: density === 'compact' ? 'text-[11px] font-bold' : density === 'comfortable' ? 'text-sm font-bold' : 'text-xs font-bold'
  };

  // Prompt comparison state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [activeComparison, setActiveComparison] = useState<{ oldItem: PromptHistoryItem, newItem: PromptHistoryItem } | null>(null);

  const handleStartComparison = () => {
    if (selectedCompareIds.length !== 2) return;
    
    const items = promptHistory.filter(item => selectedCompareIds.includes(item.id));
    if (items.length !== 2) return;
    
    // Sort items by index in history.
    // promptHistory is ordered newer first.
    // So the item with the LARGER index in promptHistory is the OLDER item.
    const index0 = promptHistory.findIndex(x => x.id === items[0].id);
    const index1 = promptHistory.findIndex(x => x.id === items[1].id);
    
    const [newItem, oldItem] = index0 < index1 ? [items[0], items[1]] : [items[1], items[0]];
    
    setActiveComparison({ oldItem, newItem });
  };

  // Load share link on mount if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('share');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        if (decoded && decoded.subject) {
          setConfig(decoded);
          setCurrentStep(7); // Jump directly to Review Step
          setAlertMsg({ type: 'success', text: t('loadedFromShare') });
          // Clean URL parameters without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse share parameter', e);
      }
    }
  }, []);

  // Fetch lists
  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/prompts');
      if (res.ok) {
        const data = await res.json();
        setPublicPrompts(data);
      }
    } catch (e) {
      console.error('Error fetching prompts:', e);
    }
  };

  useEffect(() => {
    fetchPrompts();
    // Load local saved prompts
    const local = localStorage.getItem('prism_saved_prompts');
    if (local) {
      setSavedPrompts(JSON.parse(local));
    }
  }, []);

  // Translate helper
  const t = (key: keyof typeof TRANSLATIONS.th) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.th[key] || '';
  };

  // Synchronize custom skills based on what is in config.targetSkills but not in standard presets
  useEffect(() => {
    const selectedPreset = SUBJECT_PRESETS.find(p => p.id === config.subject) || SUBJECT_PRESETS[7];
    const presetSkills = selectedPreset.skills;
    const nonPresetSelectedSkills = config.targetSkills.filter(s => !presetSkills.includes(s));
    
    if (nonPresetSelectedSkills.length > 0) {
      setCustomSkills(prev => {
        const combined = [...prev, ...nonPresetSelectedSkills];
        return Array.from(new Set(combined));
      });
    }
  }, [config.subject, config.targetSkills]);

  const handleAddCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    
    if (!customSkills.includes(trimmed)) {
      setCustomSkills(prev => [...prev, trimmed]);
    }
    
    if (!config.targetSkills.includes(trimmed)) {
      setConfig(prev => ({
        ...prev,
        targetSkills: [...prev.targetSkills, trimmed]
      }));
    }
    
    setNewSkillInput('');
    setAlertMsg({ type: 'success', text: lang === 'th' ? `เพิ่มทักษะ "${trimmed}" เรียบร้อย!` : `Added skill "${trimmed}"!` });
  };

  // Dynamically update skills when subject changes
  const handleSubjectChange = (subjectId: string) => {
    const selectedPreset = SUBJECT_PRESETS.find(p => p.id === subjectId);
    if (selectedPreset) {
      setConfig(prev => ({
        ...prev,
        subject: subjectId,
        targetSkills: selectedPreset.skills.slice(0, 3) // Select first 3 as default
      }));
    }
  };

  // Toggle skills badges
  const handleToggleSkill = (skill: string) => {
    setConfig(prev => {
      const current = prev.targetSkills;
      const index = current.indexOf(skill);
      let updated = [];
      if (index > -1) {
        updated = current.filter(s => s !== skill);
      } else {
        updated = [...current, skill];
      }
      return { ...prev, targetSkills: updated };
    });
  };

  // Handle lists toggle selection
  const handleToggleArray = (field: 'learningStyles' | 'gameElements' | 'addons', value: string) => {
    setConfig(prev => {
      const current = prev[field] as string[];
      const index = current.indexOf(value);
      let updated = [];
      if (index > -1) {
        updated = current.filter(item => item !== value);
      } else {
        updated = [...current, value];
      }
      return { ...prev, [field]: updated };
    });
  };

  // Dynamic Skills list based on subject
  const currentSubjectPreset = SUBJECT_PRESETS.find(p => p.id === config.subject) || SUBJECT_PRESETS[7];
  const subjectSkills = currentSubjectPreset.skills;

  // Render Prompt local generation script
  const generateLocalPrompt = (cfg: GamePromptConfig) => {
    const subjectName = cfg.subject === 'Custom' ? cfg.customSubject : (SUBJECT_PRESETS.find(s => s.id === cfg.subject)?.nameEn || cfg.subject);
    
    const selectedCompetencies = (cfg.coreCompetencies || []).map(id => {
      const found = CORE_COMPETENCIES.find(c => c.id === id);
      return found ? `${found.textTh} - ${found.descTh}` : id;
    }).join('\n  - ');

    const selectedSkills3r8c = (cfg.skills3r8c || []).map(id => {
      const found = SKILLS_3R8C.find(s => s.id === id);
      return found ? `${found.textTh} (${found.category}) - ${found.descTh}` : id;
    }).join('\n  - ');

    return `# ROLE & CORE DIRECTIVE
You are "${cfg.teacherName || 'Kru Somjet'}", acting as an elite, interactive AI Educational Game Master (GM). Your job is to run a highly engaging, text-based educational roleplay and prompt-based game directly inside this chat thread to teach and test the player on the specified lesson topic.

Do NOT dump all levels or questions at once. You must run the game step-by-step, turn-by-turn. Present a scenario or question, wait for the player to respond, evaluate their answer with constructive feedback, update the stats, and then proceed to the next event.

## 1. Teacher & Course Context
- **Teacher/Game Master Name**: ${cfg.teacherName}
- **Subject**: ${subjectName}
- **Lesson Topic**: ${cfg.topic}
- **Learner Level / CEFR**: ${cfg.cefrLevel}
- **Expected Classroom Size**: ${cfg.studentsCount} Students (designed for solo/group interactive chat play)
- **Target Learning Styles**: ${cfg.learningStyles.join(', ')}
- **Target Skills Focus**: ${cfg.targetSkills.join(', ')}
- **Core Student Competencies (สมรรถนะสำคัญของผู้เรียน)**:
  - ${selectedCompetencies || 'None selected'}
- **21st Century Skills Focus (ทักษะศตวรรษที่ 21 - 3R x 8C)**:
  - ${selectedSkills3r8c || 'None selected'}

## 2. Learning Strategies & Pedagogical Objectives (LM-GM Framework)
- **Core Concept Summary (สาระสำคัญ/แนวคิดหลัก)**: ${cfg.conceptSummary || 'None specified'}
- **Primary Educational Goal**: ${cfg.primaryGoal}
- **Sub-objectives**: ${cfg.subObjectives}
- **Core Game Loop / Player Actions**: ${cfg.coreActions}
- **Game Progression & Levels (ลำดับด่านการเล่น/เนื้อหา)**:
  - ${cfg.curriculumSequence && cfg.curriculumSequence.length > 0 ? cfg.curriculumSequence.join('\n  - ') : 'None defined'}

## 3. Game Pattern & Playstyle
- **Selected Gameplay Style**: ${cfg.gamePattern}
- **Pedagogical Bloom Taxonomy Level**: ${GAME_PATTERNS.find(p => p.id === cfg.gamePattern)?.bloom || 'Cognitive Application'}

## 4. Integrated Game Elements & Mechanics
- **Active Game Mechanics**: ${cfg.gameElements.join(', ')}
- **Status Dashboard**: At the end of every message/turn, display an elegant text-based status bento box (using rich emojis) showing:
  * [Level/Stage]: Current progression
  * [Score]: Points gained (scaling with accuracy & speed)
  * [Active Quest]: Current task/challenge
  * [Inventory / Badges]: Unlocked achievements or items

## 5. Atmosphere, Theme & Narrative Style
- **Color Palette Theme & Vibe**: ${cfg.colorPalette} (Metaphorically paint the scene with these colors in descriptions)
- **Typography & Formatting**: Use beautiful, clean Markdown headings, bold keywords, lists, and quotes to make text highly readable.
- **Illustration & Artwork Style**: ${cfg.visualStyle} (Narrate the world, characters, and events using this visual style)
- **Micro-interactions / Story pacing**: ${cfg.animations} (Define if narration is bouncy & playful or smooth & cinematic)
- **Game Language**: ${cfg.gameLanguage}

## 6. How to Play & Run
1. **Introduction**: Start by introducing yourself as "${cfg.teacherName || 'Kru Somjet'}", welcome the player to the educational prompt-game, set the stage using the "${cfg.visualStyle}" aesthetic, list the primary goal, and ask the player to type "START" or specify their character name to begin.
2. **Turn-by-turn Execution**: Present one challenge, encounter, or question at a time. Do not answer for the player or auto-advance. Wait for the player's reply.
3. **Scaffolding & Feedback**: When the player replies, evaluate their answer. Give immediate, constructive educational feedback. Explain *why* the answer is correct or how to improve, awarding points/badges accordingly.
4. **Conclusion**: Once all levels of the curriculum sequence are finished, present a final summary report card showing total score, learning accomplishments, and a master badge!

*Let's start! Output the introduction screen and wait for the user to respond.*`;
  };

  // Re-run prompt generator when config change
  useEffect(() => {
    setGeneratedPrompt(generateLocalPrompt(config));
    // Clear enhanced prompt if configs changed, to enforce re-enhancing
    setEnhancedPrompt('');
  }, [config]);

  // Helper to save version to history (max 5 versions)
  const addToHistory = (cfg: GamePromptConfig, promptText: string, type: 'basic' | 'enhanced') => {
    if (!promptText || !promptText.trim()) return;

    const subjectPreset = SUBJECT_PRESETS.find(s => s.id === cfg.subject);
    const subjectName = cfg.subject === 'Custom' 
      ? cfg.customSubject 
      : (lang === 'th' ? subjectPreset?.nameTh : subjectPreset?.nameEn) || cfg.subject;

    setPromptHistory(prev => {
      // Prevent consecutive duplicates of the same prompt text
      if (prev.length > 0 && prev[0].prompt === promptText) {
        return prev;
      }
      
      const newItem: PromptHistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        config: JSON.parse(JSON.stringify(cfg)), // Deep copy of config
        prompt: promptText,
        type,
        subjectName: subjectName || (lang === 'th' ? 'วิชาเรียน' : 'Subject'),
        topic: cfg.topic || (lang === 'th' ? 'หัวข้อเรียน' : 'Topic')
      };

      const updated = [newItem, ...prev].slice(0, 5);
      localStorage.setItem('prism_prompt_history', JSON.stringify(updated));
      return updated;
    });
    setLastCheckpointConfig(JSON.parse(JSON.stringify(cfg)));
  };

  // Trigger addToHistory whenever the user completes Step 8 view
  useEffect(() => {
    if (currentStep === 8) {
      const promptToSave = enhancedPrompt || generatedPrompt;
      if (promptToSave) {
        addToHistory(config, promptToSave, enhancedPrompt ? 'enhanced' : 'basic');
        
        // Award XP for creating the prompt!
        const topicId = `prompt-complete-${config.topic.toLowerCase().trim()}`;
        if (config.topic.trim()) {
          addXPPoints(
            100,
            `ออกแบบเกมนวัตกรรมสำเร็จสำหรับหัวข้อ: ${config.topic} (+100 XP)`,
            `Completed interactive game specification for topic: ${config.topic} (+100 XP)`,
            topicId
          );
        }
      }
    }
  }, [currentStep, generatedPrompt, enhancedPrompt]);

  // Revert configuration and prompt state to a history checkpoint
  const handleRevertHistory = (item: PromptHistoryItem) => {
    setConfig(item.config);
    setLastCheckpointConfig(JSON.parse(JSON.stringify(item.config)));
    if (item.type === 'enhanced') {
      setEnhancedPrompt(item.prompt);
    } else {
      setGeneratedPrompt(item.prompt);
      setEnhancedPrompt('');
    }
    setCurrentStep(8); // Go straight to prompt step to show reverted version
    setAlertMsg({
      type: 'success',
      text: lang === 'th' 
        ? `ย้อนคืนค่าข้อมูลของเกมระบบพรอมต์แชท AI (${item.subjectName}: ${item.topic}) สำเร็จ!` 
        : `Successfully reverted to configuration (${item.subjectName}: ${item.topic})!`
    });
  };

  // Delete a history item
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger revert click
    setPromptHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('prism_prompt_history', JSON.stringify(updated));
      return updated;
    });
    setAlertMsg({
      type: 'info',
      text: lang === 'th' ? 'ลบประวัติการออกแบบแล้ว' : 'Removed from history.'
    });
  };

  // Handle Gemini Prompt Enhancement Call
  const handleEnhancePrompt = async (e?: React.FormEvent, isCustom: boolean = false) => {
    if (e) e.preventDefault();
    setIsEnhancing(true);
    setAiStep(0);
    
    // Animate fake AI steps for delightful feedback
    const interval = setInterval(() => {
      setAiStep(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          customPrompt: isCustom ? customAiPrompt : '',
          customApiKey: customApiKey || undefined
        }),
      });

      const data = await response.json();
      
      clearInterval(interval);
      if (response.ok && data.text) {
        setEnhancedPrompt(data.text);
        setAiStep(4);
        setAlertMsg({ type: 'success', text: 'Prompt optimized successfully!' });
      } else {
        throw new Error(data.error || 'Failed to generate enhanced prompt.');
      }
    } catch (error: any) {
      console.error(error);
      setAlertMsg({ 
        type: 'error', 
        text: error.message || 'Error communicating with Gemini. Please verify your internet connection or API Key.' 
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Save custom API key
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('prism_custom_api_key', customApiKey);
    setShowApiKeyModal(false);
    setAlertMsg({ type: 'success', text: t('savedLocalSuccess') });
  };

  // Share Prompt globally to public directory
  const handleShareToPublic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareTitle) return;

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: shareTitle,
          description: shareDesc,
          config,
          generatedPrompt: enhancedPrompt || generatedPrompt
        }),
      });

      if (res.ok) {
        const shared = await res.json();
        setPublicPrompts(prev => [shared, ...prev]);
        setShowShareModal(false);
        setShareTitle('');
        setShareDesc('');
        setAlertMsg({ type: 'success', text: t('sharedGlobalSuccess') });
        
        // Award XP!
        const shareId = `share-public-${shareTitle.toLowerCase().trim()}`;
        addXPPoints(
          250,
          `แบ่งปันผลงานออกแบบเกม Prompt ลงสู่ชุมชน: ${shareTitle} (+250 XP)`,
          `Shared game design prompt to public community hub: ${shareTitle} (+250 XP)`,
          shareId
        );
      } else {
        throw new Error('Failed to save to database');
      }
    } catch (error: any) {
      setAlertMsg({ type: 'error', text: 'Error sharing prompt: ' + error.message });
    }
  };

  // Save Prompt locally
  const handleSaveLocally = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle) return;

    const newSaved: SharedPrompt = {
      id: `local-${Date.now()}`,
      title: saveTitle,
      description: saveDesc,
      config,
      generatedPrompt: enhancedPrompt || generatedPrompt,
      createdAt: new Date().toISOString(),
      teacherName: config.teacherName || 'Anonymous',
      subject: config.subject,
      topic: config.topic
    };

    const updated = [newSaved, ...savedPrompts];
    setSavedPrompts(updated);
    localStorage.setItem('prism_saved_prompts', JSON.stringify(updated));
    setShowSaveModal(false);
    setSaveTitle('');
    setSaveDesc('');
    setAlertMsg({ type: 'success', text: t('savedLocalSuccess') });
  };

  // Load Prompt preset from templates/saved lists
  const handleLoadTemplate = (p: SharedPrompt) => {
    setConfig(p.config);
    setLastCheckpointConfig(JSON.parse(JSON.stringify(p.config)));
    setGeneratedPrompt(p.generatedPrompt);
    setEnhancedPrompt('');
    setCurrentStep(7); // Go directly to review
    setActiveTab('builder');
    setAlertMsg({ type: 'success', text: t('loadTemplateSuccess') });
  };

  // Generate shareable URL link
  const handleCopyShareLink = () => {
    try {
      const encoded = btoa(JSON.stringify(config));
      const url = `${window.location.origin}/?share=${encoded}`;
      navigator.clipboard.writeText(url);
      setAlertMsg({ type: 'success', text: 'คัดลอกลิงก์แชร์โครงการนี้แล้ว! คุณสามารถส่งต่อให้ผู้อื่นกดเปิดได้ทันที' });
      
      // Award XP!
      const copyId = `copy-share-${config.topic.toLowerCase().trim() || 'default'}`;
      addXPPoints(
        50,
        `สร้างลิงก์และแชร์โครงการออกแบบการเรียนรู้ (+50 XP)`,
        `Created and copied secure project sharing URL link (+50 XP)`,
        copyId
      );
    } catch (e) {
      setAlertMsg({ type: 'error', text: 'ไม่สามารถสร้างลิงก์แชร์ได้' });
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setAlertMsg({ type: 'success', text: t('copySuccess') });
  };

  // Download prompt as file
  const handleDownloadTxt = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${config.topic || 'prism-prompt'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setAlertMsg({ type: 'success', text: t('downloadSuccess') });
  };

  // Print prompt
  const handlePrint = () => {
    window.print();
  };

  // Reset all steps
  const handleResetForm = () => {
    if (window.confirm('คุณต้องการรีเซ็ตโครงสร้างเกมและเริ่มออกแบบใหม่ทั้งหมดใช่หรือไม่?')) {
      setConfig({ ...DEFAULT_CONFIG });
      setLastCheckpointConfig({ ...DEFAULT_CONFIG });
      setCurrentStep(1);
      setEnhancedPrompt('');
      localStorage.removeItem('prism_builder_config');
    }
  };

  const handleApplyPreset = (preset: Partial<GamePromptConfig>) => {
    setConfig(prev => ({ ...prev, ...preset }));
    setAlertMsg({
      type: 'success',
      text: lang === 'th'
        ? '💡 นำเข้าตัวอย่างการตั้งค่าสำเร็จ! คุณสามารถทดลองแก้ไขเพิ่มเติมได้ทันที'
        : '💡 Successfully applied walkthrough tutorial preset! You can customize it now.'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 font-sans antialiased pb-20 selection:bg-[#ECE4FF]">
      
      {/* Alert Notification Toast */}
      {alertMsg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-xl max-w-md animate-fade-in transition-all duration-300 border ${
          alertMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          alertMsg.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          {alertMsg.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
          {alertMsg.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {alertMsg.type === 'info' && <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />}
          <div className="text-sm font-medium">{alertMsg.text}</div>
          <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-slate-600 ml-auto p-0.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          {/* PRISM Stylized Triangle SVG */}
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_6px_rgba(103,58,183,0.2)]">
              <defs>
                <linearGradient id="prism-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="prism-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Outer Triangle */}
              <polygon points="50,5 95,85 5,85" fill="url(#prism-gradient-1)" opacity="0.85" />
              {/* Inner Refracting Prism Triangle */}
              <polygon points="50,25 80,80 20,80" fill="url(#prism-gradient-2)" opacity="0.65" />
              {/* Light rays refracting */}
              <line x1="50" y1="50" x2="10" y2="60" stroke="#FFF" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="50" y1="50" x2="90" y2="70" stroke="#FFF" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              PRISM <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">BUILD</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Educational Architect</span>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="hidden md:flex items-center gap-2">
          <button 
            id="nav-home"
            onClick={() => { setActiveTab('builder'); setCurrentStep(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'builder' && currentStep === 1
                ? 'bg-slate-50 text-slate-900' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Home
          </button>
          
          <button 
            id="nav-builder"
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-[#ECE4FF] text-[#673AB7]' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {lang === 'th' ? 'ออกแบบเกม Prompt เพื่อการศึกษา' : 'Prompt Game Architect'}
          </button>

          <button 
            id="nav-community"
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-sky-50 text-sky-700' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            {t('communityHubTitle')}
          </button>
        </nav>

        {/* Global Options */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('th')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === 'th' ? 'bg-[#673AB7] shadow-sm text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              ไทย
            </button>
          </div>

          {/* Guided Tour launcher button */}
          <button 
            id="btn-guided-tour"
            onClick={() => setShowTour(true)}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 hover:border-[#673AB7] hover:text-[#673AB7] rounded-xl text-sm font-semibold text-slate-600 bg-white shadow-sm transition-all cursor-pointer"
            title={lang === 'th' ? 'เริ่มต้นแนะนำการใช้งานทีละขั้นตอน' : 'Start interactive step-by-step guided tour'}
          >
            <Compass className="w-4 h-4 text-[#673AB7] shrink-0" />
            <span className="hidden sm:inline">{lang === 'th' ? 'คู่มือแนะนำ' : 'Guided Tour'}</span>
          </button>

          {/* API Key settings modal */}
          <button 
            id="btn-api-key"
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white shadow-sm transition-all"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${customApiKey ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-slate-300'}`} />
            <Key className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">My API Key</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {activeTab === 'builder' ? (
          /* =======================================
             BUILDER ARCHITECT TAB
             ======================================= */
          <div>
            {/* HERO HERO TITLE */}
            <div className="text-center mb-8 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#673AB7] bg-[#ECE4FF] px-3.5 py-1.5 rounded-full mb-3 inline-block">
                {t('tagline')}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {t('titleMain')} <span className="text-[#673AB7]">{t('titleAccent')}</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto mt-3 font-medium leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* PROGRESS WIZARD STEP TRACKER */}
            <div className="mb-10 max-w-4xl mx-auto px-2 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[750px] py-4 relative">
                {/* Connection bar background */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
                
                {/* Active connection bar overlay */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-[#673AB7] -translate-y-1/2 z-0 transition-all duration-500 rounded-full" 
                  style={{ width: `${(STEPS_LIST.indexOf(currentStep) / (STEPS_LIST.length - 1)) * 100}%` }}
                />

                {STEPS_LIST.map((step) => {
                  const stepIndex = STEPS_LIST.indexOf(step);
                  const currentStepIndex = STEPS_LIST.indexOf(currentStep);
                  const isCompleted = stepIndex < currentStepIndex;
                  const isActive = step === currentStep;
                  
                  return (
                    <button
                      key={step}
                      id={`step-node-${step.toString().replace('.', '_')}`}
                      onClick={() => setCurrentStep(step)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-white border-[#673AB7] text-[#673AB7]' 
                          : isActive 
                            ? 'bg-[#673AB7] border-[#673AB7] text-white shadow-[0_0_12px_rgba(103,58,183,0.5)] scale-110' 
                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : (step === 1.5 ? '1.5' : step)}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 transition-colors duration-300 ${
                        isActive ? 'text-[#673AB7] font-extrabold' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        {t(`step${step}` as any)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BUILDER LAYOUT WITH INTEGRATED SIDEBAR RECENT HISTORY PANEL */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Side: Progress Wizard Form */}
              <div className="lg:col-span-3">
                <div ref={formRef} id="wizard-container" className={`bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] ${densityStyles.containerPadding} transition-all duration-300`}>
              
              {/* Form step Header */}
              <div className={densityStyles.headerSpacing}>
                <span className="text-[10px] font-extrabold text-[#673AB7] tracking-widest uppercase block mb-1">
                  Step {currentStep === 1.5 ? '1.5' : `0${currentStep}`} of 08
                </span>
                <h2 id="step-title" className={`${densityStyles.textSizeTitle} font-extrabold text-slate-950 flex items-center gap-2.5`}>
                  {currentStep === 1 && <User className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 1.5 && <Compass className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 2 && <Zap className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 3 && <Layers className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 4 && <Award className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 5 && <Palette className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 6 && <Video className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 7 && <CheckCircle className="w-6 h-6 text-[#673AB7]" />}
                  {currentStep === 8 && <Sparkles className="w-6 h-6 text-[#673AB7]" />}
                  {t(`stepTitle${currentStep}` as any)}
                </h2>
                <p id="step-subtitle" className={`text-slate-400 ${densityStyles.textSizeDesc}`}>
                  {t(`subTitle${currentStep}` as any)}
                </p>
              </div>

              {/* Step Forms Content */}
              <div className={densityStyles.stepSpacing}>
                
                {/* How-to-use Interactive Tutorial Video Player */}
                <StepTutorialPlayer 
                  currentStep={currentStep} 
                  lang={lang} 
                  onApplyPreset={handleApplyPreset} 
                />

                <AnimatePresence mode="wait">
                  {/* STEP 1: CONTEXT */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="space-y-5"
                    >
                    
                    {/* STARTER TEMPLATES SECTION */}
                    <div id="starter-templates-section" className="bg-[#FAF9FF] border border-[#ECE4FF] rounded-2xl p-4 md:p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#673AB7]/10 rounded-xl text-[#673AB7] shrink-0 mt-0.5">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                            {t('starterTemplatesTitle' as any)}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                            {t('starterTemplatesDesc' as any)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                        {STARTER_TEMPLATES.map((tpl) => {
                          const isSelected = config.topic === tpl.config.topic && config.subject === tpl.config.subject;
                          return (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                setConfig(JSON.parse(JSON.stringify(tpl.config)));
                                setLastCheckpointConfig(JSON.parse(JSON.stringify(tpl.config)));
                                setAlertMsg({
                                  type: 'success',
                                  text: lang === 'th' 
                                    ? `โหลดเทมเพลต "${tpl.titleTh}" เรียบร้อยแล้ว! แนะนำให้ทบทวนแต่ละหน้าจอเพื่อปรับแต่งตามต้องการ`
                                    : `Loaded "${tpl.titleEn}" starter template! Feel free to review each step to customize.`
                                });
                              }}
                              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-300 relative overflow-hidden group ${
                                isSelected
                                  ? 'border-[#673AB7] bg-white ring-2 ring-[#ECE4FF]'
                                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                              }`}
                            >
                              <div className="text-2xl p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                                {tpl.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-extrabold text-[#673AB7] bg-[#ECE4FF] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    {t('starterTemplateBadge' as any)}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-extrabold text-xs text-slate-800 mt-1.5 group-hover:text-[#673AB7] transition-colors leading-snug">
                                  {lang === 'th' ? tpl.titleTh : tpl.titleEn}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1 line-clamp-2">
                                  {lang === 'th' ? tpl.descTh : tpl.descEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Teacher/Designer Profile Customization Section */}
                    <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Teacher name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">{t('teacherNameLabel')}</label>
                          <div className="flex items-center gap-3">
                            {renderAvatar(config.teacherAvatar, "w-11 h-11")}
                            <input 
                              type="text"
                              value={config.teacherName}
                              onChange={(e) => setConfig({ ...config, teacherName: e.target.value })}
                              onBlur={() => {
                                if (config.teacherName && config.teacherName.trim()) {
                                  addXPPoints(50, `ระบุชื่อนักออกแบบการเรียนรู้: ${config.teacherName} (+50 XP)`, `Set your designer identity: ${config.teacherName} (+50 XP)`, 'profile-customizer-name');
                                }
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-white hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                              placeholder={lang === 'th' ? "ระบุชื่อผู้สอน / ผู้ออกแบบเกม" : "Specify teacher / designer name"}
                            />
                          </div>
                        </div>

                        {/* Subject select presets */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">{t('subjectLabel')}</label>
                          <select 
                            value={config.subject}
                            onChange={(e) => handleSubjectChange(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-white hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                          >
                            {SUBJECT_PRESETS.map((p) => (
                              <option key={p.id} value={p.id}>
                                {lang === 'th' ? p.nameTh : p.nameEn}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Avatar Selection Controls */}
                      <div className="border-t border-slate-200/50 pt-3 flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-slate-700 block">{t('avatarLabel')}</label>
                        
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                          {/* Presets Grid */}
                          <div className="flex-1">
                            <span className="text-[10px] text-slate-400 font-bold block mb-1.5">{t('avatarSelect')}</span>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                              {AVATAR_PRESETS.map((avatar) => {
                                const isSelected = config.teacherAvatar === avatar.id;
                                return (
                                  <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => {
                                      setConfig({ ...config, teacherAvatar: avatar.id });
                                      addXPPoints(50, 'ปรับแต่งตัวตนผู้สอนและรูปอวาตาร์ (+50 XP)', 'Customized your educator identity and avatar preset (+50 XP)', 'profile-customizer-avatar');
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer border ${
                                      isSelected 
                                        ? 'border-[#673AB7] bg-[#FAF9FF] ring-2 ring-[#ECE4FF] scale-110 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:scale-105'
                                    }`}
                                    title={lang === 'th' ? avatar.labelTh : avatar.labelEn}
                                  >
                                    {avatar.emoji}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom upload area */}
                          <div className="lg:w-60 flex flex-col justify-end shrink-0">
                            <span className="text-[10px] text-slate-400 font-bold block mb-1.5">{t('avatarUpload')}</span>
                            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#673AB7] rounded-xl p-2.5 bg-white hover:bg-slate-50/50 cursor-pointer transition-all text-center relative min-h-[44px]">
                              <input 
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setConfig({ ...config, teacherAvatar: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div className="flex items-center gap-1.5 justify-center">
                                <Upload className="w-4 h-4 text-[#673AB7]" />
                                <span className="text-[10px] font-bold text-slate-500">
                                  {lang === 'th' ? 'อัปโหลดภาพถ่ายประจำตัว' : 'Upload custom photo'}
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Integrated Gamification Profile Badge */}
                      <div className="mt-2.5 pt-3.5 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-[#673AB7] flex items-center justify-center font-black text-xs shrink-0 border border-purple-100">
                            🏆 LV {gamificationStats.level}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{lang === 'th' ? 'ระดับเกียรติยศผู้สอน' : 'Educator Honor Class'}</span>
                            <span className="text-xs font-black text-slate-700">
                              {gamificationStats.xp} XP • {gamificationStats.activities.length} {lang === 'th' ? 'กิจกรรมสะสม' : 'activities'}
                            </span>
                          </div>
                        </div>

                        {/* Badges Quick Display */}
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-150 shadow-sm shrink-0">
                          <Award className="w-4 h-4 text-amber-500 fill-amber-100" />
                          <span className="text-[10px] font-black text-slate-700">
                            {gamificationStats.activities.filter(act => act.points >= 250).length} {lang === 'th' ? 'เหรียญเกียรติยศ' : 'Honor Badges'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById('teacher-gamification-card');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[9px] text-[#673AB7] hover:underline font-bold ml-1 cursor-pointer"
                          >
                            {lang === 'th' ? 'ดูความสำเร็จ →' : 'Achievements →'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Custom subject field if selected */}
                    {config.subject === 'Custom' && (
                      <div className="flex flex-col gap-1.5 animate-slide-down">
                        <label className="text-xs font-bold text-slate-700">{t('customSubjectPlaceholder')}</label>
                        <input 
                          type="text"
                          value={config.customSubject}
                          onChange={(e) => setConfig({ ...config, customSubject: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800 animate-fade-in"
                          placeholder="เช่น ฟิสิกส์พื้นฐาน ม.4"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Topic */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('topicLabel')}</label>
                        <input 
                          type="text"
                          value={config.topic}
                          onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                          placeholder="เช่น เศษส่วนอย่างต่ำ หรือ Present Simple"
                        />
                      </div>

                      {/* Learner levels */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('cefrLabel')}</label>
                        <select 
                          value={config.cefrLevel}
                          onChange={(e) => setConfig({ ...config, cefrLevel: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        >
                          <option value="A1 - Beginner">A1 - Beginner (ประถมต้น / เริ่มต้น)</option>
                          <option value="A2 - Elementary">A2 - Elementary (ประถมปลาย)</option>
                          <option value="B1 - Intermediate">B1 - Intermediate (มัธยมต้น / ปานกลาง)</option>
                          <option value="B2 - Upper Intermediate">B2 - Upper Intermediate (มัธยมปลาย)</option>
                          <option value="C1 - Advanced">C1 - Advanced (มหาวิทยาลัย / ก้าวหน้า)</option>
                          <option value="C2 - Mastery">C2 - Mastery (ระดับเชี่ยวชาญ)</option>
                        </select>
                      </div>
                    </div>

                    {/* Students count */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">{t('studentsCountLabel')}</label>
                      <input 
                        type="number"
                        value={config.studentsCount || ''}
                        onChange={(e) => setConfig({ ...config, studentsCount: parseInt(e.target.value) || 0 })}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800 max-w-[150px]"
                        placeholder="30"
                      />
                    </div>

                    {/* Smart Context Curriculum Standards Alignment suggestions */}
                    <SmartContext 
                      config={config} 
                      setConfig={setConfig} 
                      lang={lang} 
                      setAlertMsg={setAlertMsg} 
                    />

                    {/* Learning Styles multiple checkables */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">{t('learningStylesLabel')}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'Visual', icon: Monitor, textTh: 'มองเห็นภาพ', textEn: 'Visual' },
                          { id: 'Auditory', icon: Volume2, textTh: 'การฟังเสียง', textEn: 'Auditory' },
                          { id: 'Reading/Writing', icon: BookOpen, textTh: 'อ่าน/เขียน', textEn: 'Read/Write' },
                          { id: 'Kinesthetic', icon: Zap, textTh: 'ลงมือทำจริง', textEn: 'Kinesthetic' },
                        ].map((style) => {
                          const IconComp = style.icon;
                          const isSelected = config.learningStyles.includes(style.id);
                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => handleToggleArray('learningStyles', style.id)}
                              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#673AB7] bg-[#F9F7FF] text-[#673AB7] shadow-sm' 
                                  : 'border-slate-100 hover:border-slate-200 bg-white text-slate-500'
                              }`}
                            >
                              <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#673AB7]' : 'text-slate-400'}`} />
                              <span className="text-[11px] font-bold">
                                {lang === 'th' ? style.textTh : style.textEn}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target skills custom subject badge system */}
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-slate-700">{t('targetSkillsLabel')}</label>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const availableSkills = Array.from(new Set([...subjectSkills, ...customSkills]));
                          return availableSkills.map((skill) => {
                            const isSelected = config.targetSkills.includes(skill);
                            const isCustom = !subjectSkills.includes(skill);
                            return (
                              <div key={skill} className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSkill(skill)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSelected 
                                      ? 'border-[#673AB7] bg-[#ECE4FF] text-[#673AB7]' 
                                      : 'border-slate-100 hover:border-slate-200 bg-white text-slate-500'
                                  } ${isCustom ? 'border-dashed border-indigo-300' : ''}`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                  <span>{skill}</span>
                                </button>
                                {isCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCustomSkills(prev => prev.filter(s => s !== skill));
                                      setConfig(prev => ({
                                        ...prev,
                                        targetSkills: prev.targetSkills.filter(s => s !== skill)
                                      }));
                                    }}
                                    className="w-5 h-5 bg-slate-100 hover:bg-slate-200 hover:text-rose-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 cursor-pointer transition-all shrink-0"
                                    title="ลบทักษะนี้"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Custom skill input form */}
                      <div className="flex items-center gap-2 mt-1 max-w-md">
                        <input
                          type="text"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSkill();
                            }
                          }}
                          placeholder={lang === 'th' ? "ระบุทักษะอื่น ๆ เช่น การฟัง, การคูณเลข, ทักษะตรรกะ..." : "Enter other skills..."}
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-white text-xs font-semibold text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          className="px-4 py-2 bg-[#673AB7] hover:bg-[#5E35B1] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'th' ? 'เพิ่มทักษะ' : 'Add Skill'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Core Competencies (สมรรถนะสำคัญของผู้เรียน) */}
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Award className="w-4.5 h-4.5 text-[#673AB7]" />
                        <span>{t('coreCompetenciesLabel' as any)}</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CORE_COMPETENCIES.map((comp) => {
                          const isSelected = (config.coreCompetencies || []).includes(comp.id);
                          return (
                            <button
                              key={comp.id}
                              type="button"
                              onClick={() => {
                                const current = config.coreCompetencies || [];
                                const updated = current.includes(comp.id)
                                  ? current.filter(id => id !== comp.id)
                                  : [...current, comp.id];
                                setConfig({ ...config, coreCompetencies: updated });
                              }}
                              className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#673AB7] bg-[#F9F7FF] ring-1 ring-[#ECE4FF]' 
                                  : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isSelected ? 'border-[#673AB7] bg-[#673AB7] text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className={`text-xs font-bold ${isSelected ? 'text-[#673AB7]' : 'text-slate-800'}`}>
                                  {lang === 'th' ? comp.textTh : comp.textEn}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                  {lang === 'th' ? comp.descTh : comp.descEn}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 21st Century Skills (3R x 8C) */}
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Zap className="w-4.5 h-4.5 text-[#673AB7]" />
                        <span>{t('skills3r8cLabel' as any)}</span>
                      </label>
                      
                      <div className="space-y-4">
                        {/* 3R Section */}
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/80">
                          <h4 className="text-[11px] font-bold text-[#673AB7] uppercase tracking-wider mb-2.5 flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-[#673AB7] rounded-sm inline-block"></span>
                            3R (ทักษะพื้นฐาน / Hard Skills)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {SKILLS_3R8C.filter(s => s.category === '3R').map((skill) => {
                              const isSelected = (config.skills3r8c || []).includes(skill.id);
                              return (
                                <button
                                  key={skill.id}
                                  type="button"
                                  onClick={() => {
                                    const current = config.skills3r8c || [];
                                    const updated = current.includes(skill.id)
                                      ? current.filter(id => id !== skill.id)
                                      : [...current, skill.id];
                                    setConfig({ ...config, skills3r8c: updated });
                                  }}
                                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'border-[#673AB7] bg-[#F9F7FF] ring-1 ring-[#ECE4FF]' 
                                      : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                                  }`}
                                  title={lang === 'th' ? skill.descTh : skill.descEn}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isSelected ? 'border-[#673AB7] bg-[#673AB7] text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-slate-800">
                                      {lang === 'th' ? skill.textTh : skill.textEn}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium leading-tight">
                                      {lang === 'th' ? skill.descTh : skill.descEn}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 8C Section */}
                        <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/30">
                          <h4 className="text-[11px] font-bold text-[#673AB7] uppercase tracking-wider mb-2.5 flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-[#673AB7] rounded-sm inline-block"></span>
                            8C (ทักษะด้านอารมณ์และการทำงาน / Soft Skills)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {SKILLS_3R8C.filter(s => s.category === '8C').map((skill) => {
                              const isSelected = (config.skills3r8c || []).includes(skill.id);
                              return (
                                <button
                                  key={skill.id}
                                  type="button"
                                  onClick={() => {
                                    const current = config.skills3r8c || [];
                                    const updated = current.includes(skill.id)
                                      ? current.filter(id => id !== skill.id)
                                      : [...current, skill.id];
                                    setConfig({ ...config, skills3r8c: updated });
                                  }}
                                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'border-[#673AB7] bg-[#F9F7FF] ring-1 ring-[#ECE4FF]' 
                                      : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                                  }`}
                                  title={lang === 'th' ? skill.descTh : skill.descEn}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isSelected ? 'border-[#673AB7] bg-[#673AB7] text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-slate-800">
                                      {lang === 'th' ? skill.textTh : skill.textEn}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium leading-tight">
                                      {lang === 'th' ? skill.descTh : skill.descEn}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  )}

                  {/* STEP 1.5: CURRICULUM SEQUENCE */}
                  {currentStep === 1.5 && (
                    <motion.div
                      key="step-1.5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <CurriculumSequence 
                        config={config} 
                        setConfig={setConfig} 
                        lang={lang} 
                      />
                    </motion.div>
                  )}

                {/* STEP 2: STRATEGY */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    {/* Concept Summary / สาระสำคัญ */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">{t('conceptSummaryLabel' as any)}</label>
                        <VoiceDictationButton
                          value={config.conceptSummary || ''}
                          onChange={(val) => setConfig({ ...config, conceptSummary: val })}
                          lang={lang}
                          onStatusChange={setAlertMsg}
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={config.conceptSummary || ''}
                        onChange={(e) => setConfig({ ...config, conceptSummary: e.target.value })}
                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800 leading-relaxed"
                        placeholder={t('conceptSummaryPlaceholder' as any)}
                      />
                    </div>

                    {/* Primary Objective text */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">{t('primaryGoalLabel')}</label>
                        <VoiceDictationButton
                          value={config.primaryGoal}
                          onChange={(val) => setConfig({ ...config, primaryGoal: val })}
                          lang={lang}
                          onStatusChange={setAlertMsg}
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={config.primaryGoal}
                        onChange={(e) => setConfig({ ...config, primaryGoal: e.target.value })}
                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800 leading-relaxed"
                        placeholder="เช่น ผู้เรียนสามารถจำจดคำศัพท์เรื่องการสั่งอาหาร สะกดคำประโยค Would you like... ได้อย่างถูกต้อง"
                      />
                    </div>

                    {/* Sub-objectives */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">{t('subObjectivesLabel')}</label>
                        <VoiceDictationButton
                          value={config.subObjectives}
                          onChange={(val) => setConfig({ ...config, subObjectives: val })}
                          lang={lang}
                          onStatusChange={setAlertMsg}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={config.subObjectives}
                        onChange={(e) => setConfig({ ...config, subObjectives: e.target.value })}
                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        placeholder="เข้าใจหลักภาษา, ออกเสียงถูกต้องตามสำเนียง, พัฒนาทักษะความจำและการเขียน"
                      />
                    </div>

                    {/* Core game actions of learners */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">{t('coreActionsLabel')}</label>
                        <VoiceDictationButton
                          value={config.coreActions}
                          onChange={(val) => setConfig({ ...config, coreActions: val })}
                          lang={lang}
                          onStatusChange={setAlertMsg}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={config.coreActions}
                        onChange={(e) => setConfig({ ...config, coreActions: e.target.value })}
                        className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        placeholder="จับคู่คำศัพท์ใน 20 วินาที, สะกดประโยคคำใบ้, เดินสำรวจตอบสนองเควสบริกร"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: GAME PATTERNS */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {GAME_PATTERNS.map((pattern) => {
                        const isSelected = config.gamePattern === pattern.id;
                        return (
                          <button
                            key={pattern.id}
                            type="button"
                            onClick={() => setConfig({ ...config, gamePattern: pattern.id })}
                            className={`p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[#673AB7] bg-[#F9F7FF] ring-2 ring-[#ECE4FF] shadow-sm' 
                                : 'border-slate-100 hover:border-slate-200 bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                                isSelected ? 'bg-[#ECE4FF] text-[#673AB7]' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {pattern.bloom}
                              </span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#673AB7] bg-[#673AB7]' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-extrabold text-sm text-slate-900">
                                {lang === 'th' ? pattern.nameTh : pattern.nameEn}
                              </h3>
                              <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                                {lang === 'th' ? pattern.descTh : pattern.descEn}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Pedagogical Alignment Card */}
                    {(() => {
                      const selectedPattern = GAME_PATTERNS.find(p => p.id === config.gamePattern);
                      if (!selectedPattern) return null;
                      return (
                        <div className="p-4 rounded-2xl border border-indigo-100 bg-[#F5F2FF] flex items-start gap-3.5 shadow-sm mt-2 animate-fade-in">
                          <div className="p-2 bg-white rounded-xl text-[#673AB7] border border-indigo-50 shrink-0">
                            <BookOpen className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 flex-wrap">
                              <span>{lang === 'th' ? 'การจัดวางตำแหน่งการสอน (Pedagogical Alignment)' : 'Pedagogical Alignment'}</span>
                              <span className="px-2 py-0.5 rounded bg-white text-[#673AB7] text-[10px] font-bold border border-indigo-50">
                                {selectedPattern.bloom}
                              </span>
                            </h4>
                            <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-0.5">
                              {lang === 'th' ? (selectedPattern as any).alignmentTh : (selectedPattern as any).alignmentEn}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {/* STEP 4: GAME ELEMENTS */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[
                      { id: 'Leaderboard', icon: Award, textTh: 'Leaderboard (อันดับคะแนน)', textEn: 'Leaderboard', descTh: 'แสดงผู้เล่นที่ดีที่สุดและการจัดอันดับแบบเรียลไทม์', descEn: 'Real-time score dashboard and player rankings' },
                      { id: 'Achievement Badges', icon: Flame, textTh: 'Achievement Badges (เหรียญรางวัล)', textEn: 'Achievement Badges', descTh: 'ปลดล็อกเหรียญตราพิเศษเมื่อทำภารกิจสำเร็จ', descEn: 'Unlock rewards on specific goals and masteries' },
                      { id: 'Difficulty Levels', icon: Layers, textTh: 'Difficulty Levels (ระดับความยาก)', textEn: 'Difficulty Levels', descTh: 'ความยากที่ค่อย ๆ ไต่ระดับเพิ่มความท้าทาย', descEn: 'Incremental challenges that scale with performance' },
                      { id: 'Multiplayer Mode', icon: Users, textTh: 'Multiplayer Mode (โหมดหลายผู้เล่น)', textEn: 'Multiplayer Mode', descTh: 'เล่นแข่งขัน หรือช่วยกันผ่านด่านเป็นกลุ่ม', descEn: 'Collaborative or competitive gameplay support' },
                      { id: 'Time-Based Challenges', icon: Clock, textTh: 'Time-Based Challenges (ท้าทายตามเวลา)', textEn: 'Time-Based Challenges', descTh: 'ตัวจับเวลาเพิ่มความตื่นเต้นท้าทายการตอบ', descEn: 'Time multipliers and countdown pressures' },
                      { id: 'Feedback System', icon: MessageSquare, textTh: 'Feedback System (ระบบข้อมูลย้อนกลับ)', textEn: 'Feedback System', descTh: 'คำชมเชยหรือคำใบ้ตัวช่วยทันทีเมื่อตอบถูกผิด', descEn: 'Instant visual/sound corrections and guides' },
                    ].map((el) => {
                      const IconComp = el.icon;
                      const isSelected = config.gameElements.includes(el.id);
                      return (
                        <button
                          key={el.id}
                          type="button"
                          onClick={() => handleToggleArray('gameElements', el.id)}
                          className={`p-4 rounded-2xl border text-left flex gap-3 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#673AB7] bg-[#F9F7FF] shadow-sm' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center h-10 w-10 ${
                            isSelected ? 'bg-[#ECE4FF] border-[#673AB7] text-[#673AB7]' : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-extrabold text-xs md:text-sm text-slate-900">
                                {lang === 'th' ? el.textTh : el.textEn}
                              </h3>
                              <div className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center ${
                                isSelected ? 'border-[#673AB7] bg-[#673AB7]' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-slate-400 text-[10px] md:text-xs mt-1 leading-relaxed font-medium">
                              {lang === 'th' ? el.descTh : el.descEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* STEP 5: DESIGN UI */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    {/* Color palette selector bubbles */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">{t('paletteLabel')}</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {COLOR_PALETTES.map((pal) => {
                          const isSelected = config.colorPalette === pal.id;
                          return (
                            <button
                              key={pal.id}
                              type="button"
                              onClick={() => setConfig({ ...config, colorPalette: pal.id })}
                              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#673AB7] bg-[#F9F7FF] shadow-sm' 
                                  : 'border-slate-100 hover:border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-xs">
                                  {lang === 'th' ? pal.nameTh : pal.nameEn}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {lang === 'th' ? pal.descTh : pal.descEn}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {pal.colors.map((c, idx) => (
                                  <div key={idx} className={`w-3.5 h-3.5 rounded-full ${c} border border-white`} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Typography font */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('typographyLabel')}</label>
                        <select 
                          value={config.typography}
                          onChange={(e) => setConfig({ ...config, typography: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        >
                          <option value="Modern Rounded">Modern Rounded (สมัยใหม่โค้งมน - Kanit / Prompt)</option>
                          <option value="Professional Serif">Professional Serif (เซริฟหรูหรามีสไตล์ - Sarabun)</option>
                        </select>
                      </div>

                      {/* Visual style */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('visualStyleLabel')}</label>
                        <select 
                          value={config.visualStyle}
                          onChange={(e) => setConfig({ ...config, visualStyle: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        >
                          <option value="Pixar Cartoon">Pixar Cartoon (การ์ตูนพิกซาร์สีสันสดใสสามมิติ)</option>
                          <option value="Flat Minimalist">Flat Minimalist (มินิมัลแบนเรียบหรูดูแพง)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Animations */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('animationsLabel')}</label>
                        <select 
                          value={config.animations}
                          onChange={(e) => setConfig({ ...config, animations: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        >
                          <option value="Smooth & Bouncy">Smooth & Bouncy (ลื่นไหลละมุนและมีชีวิตชีวา)</option>
                          <option value="Minimal">Minimal (แอนิเมชันน้อยที่สุด สบายตา)</option>
                        </select>
                      </div>

                      {/* Game Language */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">{t('gameLanguageLabel')}</label>
                        <select 
                          value={config.gameLanguage}
                          onChange={(e) => setConfig({ ...config, gameLanguage: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-slate-50/50 hover:bg-slate-50 transition-all font-semibold text-sm text-slate-800"
                        >
                          <option value="EN/TH">Bilingual สองภาษา (EN/TH - แนะนำ)</option>
                          <option value="English Only">English Only (ภาษาอังกฤษล้วน)</option>
                          <option value="Thai Only">Thai Only (ภาษาไทยล้วน)</option>
                        </select>
                      </div>
                    </div>

                    {/* Layout Density & Compact Mode Selector */}
                    <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {t('layoutDensityLabel' as any)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {lang === 'th' ? 'ปรับระยะห่างและการแสดงผลตามสไตล์คุณ' : 'Tweak interface density, margins, and spacing'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Badge indicator */}
                        <span className="px-2 py-0.5 rounded text-[8px] bg-indigo-600 text-white font-black tracking-wider uppercase">
                          {density === 'compact' ? 'COMPACT ON' : density === 'comfortable' ? 'SPACIOUS' : 'STANDARD'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'comfortable', icon: '🍃', label: t('layoutComfortable' as any), desc: lang === 'th' ? 'ผ่อนคลาย' : 'Spacious' },
                          { id: 'standard', icon: '⚖️', label: t('layoutStandard' as any), desc: lang === 'th' ? 'มาตรฐาน' : 'Standard' },
                          { id: 'compact', icon: '⚡', label: t('layoutCompact' as any), desc: lang === 'th' ? 'กะทัดรัดพิเศษ' : 'Compact UI' }
                        ].map((item) => {
                          const isSelected = density === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setConfig({ ...config, layoutDensity: item.id as any })}
                              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#673AB7] bg-white shadow-sm text-[#673AB7] ring-1 ring-[#673AB7]'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-extrabold text-[10px] leading-tight block">
                                {item.label.split(' (')[0]}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium leading-none">
                                {item.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Info Tips for Compact Mode */}
                      {density === 'compact' && (
                        <p className="text-[10px] text-indigo-600 font-bold leading-normal bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 animate-scale-up">
                          {lang === 'th'
                            ? '⚡ เปิดโหมดกะทัดรัด (Compact Mode): ปรับลด padding และขนาดแบบอักษรลง 25% เพื่อลดการเลื่อนหน้าจอและนำเสนอข้อมูลสำคัญได้ในคลิกเดียว!'
                            : '⚡ Compact Mode Activated: Reduces layout padding and font sizing by 25% to maximize viewable screen space and eliminate scrolling.'
                          }
                        </p>
                      )}
                    </div>

                    {/* Visual Add-on Drag and Drop Layout Canvas */}
                    <AddonDragDropCanvas
                      config={config}
                      onChange={(updatedAddons) => setConfig({ ...config, addons: updatedAddons })}
                      lang={lang}
                    />
                  </motion.div>
                )}

                {/* STEP 6: EFFECTS & TECH */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    {/* Production fidelity selection level */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">{t('productionLevelLabel')}</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { id: 'Simple', titleTh: 'Simple (เรียบง่าย)', titleEn: 'Simple', descTh: 'HTML5 และ CSS ใช้งานง่าย โค้ดเบาสบายตา', descEn: 'Standard robust HTML5 / CSS, ideal for speed' },
                          { id: 'Polished', titleTh: 'Polished (ขัดเกลา)', titleEn: 'Polished', descTh: 'แอนิเมชัน GSAP ตระการตา เสียงประกอบลื่นไหล', descEn: 'GSAP, sound effects, beautiful transitions' },
                          { id: 'Stunning 3D', titleTh: 'Stunning 3D (ตื่นตา 3D)', titleEn: 'Stunning 3D', descTh: 'โมเดลฉาก 3D ลึก พารัลแลกซ์เคลื่อนไหวสมจริง', descEn: 'WebGL, parallax layers, 3D particles' },
                        ].map((prod) => {
                          const isSelected = config.productionLevel === prod.id;
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => setConfig({ ...config, productionLevel: prod.id })}
                              className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#673AB7] bg-[#F9F7FF] ring-2 ring-[#ECE4FF] shadow-sm' 
                                  : 'border-slate-100 hover:border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-xs text-slate-900">
                                  {lang === 'th' ? prod.titleTh : prod.titleEn}
                                </span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#673AB7] bg-[#673AB7]' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                </div>
                              </div>
                              <p className="text-slate-400 text-[10px] leading-relaxed font-medium">
                                {lang === 'th' ? prod.descTh : prod.descEn}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Checkbox option list for Add-ons */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700">{t('addonsLabel')}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {[
                          { id: '3D animated background', name: 'ฉากหลัง 3D เคลื่อนไหว (Three.js)' },
                          { id: 'Pro smooth animations', name: 'แอนิเมชันพรีเมียม (GSAP)' },
                          { id: 'Depth & parallax scrolling', name: 'พารัลแลกซ์เลเยอร์เชิงลึก' },
                          { id: 'Physics & motion', name: 'ฟิสิกส์การกระทบ (Matter.js)' },
                          { id: 'Sound effects & music', name: 'ดนตรีและซาวด์เอฟเฟกต์ตอบกลับ' },
                          { id: 'Voice narration', name: 'เสียง AI บรรยายโจทย์ (ElevenLabs)' },
                          { id: 'Confetti & particle bursts', name: 'เอฟเฟกต์สะเก็ดกระดาษฉลองชัย' },
                          { id: 'Custom game fonts', name: 'ฟอนต์เกมพิเศษโดดเด่น' },
                          { id: 'Glassmorphism & gradients', name: 'ดีไซน์กระจกฝ้าหรูหราอินเทรนด์' },
                        ].map((add) => {
                          const isSelected = config.addons.includes(add.id);
                          return (
                            <button
                              key={add.id}
                              type="button"
                              onClick={() => handleToggleArray('addons', add.id)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#673AB7] bg-[#ECE4FF] text-[#673AB7]' 
                                  : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                              }`}
                            >
                              <span>{add.name}</span>
                              <div className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center ml-2 ${
                                isSelected ? 'border-[#673AB7] bg-[#673AB7]' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 7: REVIEW */}
                {currentStep === 7 && (
                  <motion.div
                    key="step-7"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-6"
                  >
                    
                    {/* Review Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Box 1: Context */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="font-bold text-xs text-[#673AB7] tracking-wider uppercase">{t('reviewSubjectInfo')}</h3>
                          <button onClick={() => setCurrentStep(1)} className="text-[10px] font-bold text-slate-400 hover:text-[#673AB7] underline">Edit</button>
                        </div>
                        <ul className="text-xs space-y-1.5 text-slate-600 font-semibold">
                          <li className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100/80">
                            {renderAvatar(config.teacherAvatar, "w-8 h-8")}
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase tracking-widest leading-none mb-0.5">Teacher</span>
                              <span className="text-slate-800 font-extrabold leading-tight">{config.teacherName}</span>
                            </div>
                          </li>
                          <li><span className="text-slate-400">Subject:</span> {config.subject === 'Custom' ? config.customSubject : config.subject}</li>
                          <li><span className="text-slate-400">Topic:</span> {config.topic}</li>
                          <li><span className="text-slate-400">Level:</span> {config.cefrLevel}</li>
                          <li><span className="text-slate-400">Size:</span> {config.studentsCount} Students</li>
                          <li><span className="text-slate-400">Competencies:</span> {(config.coreCompetencies || []).length} Selected</li>
                          <li><span className="text-slate-400">21st Century Skills:</span> {(config.skills3r8c || []).length} Selected</li>
                        </ul>
                      </div>

                      {/* Box 2: Objectives */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="font-bold text-xs text-[#673AB7] tracking-wider uppercase">{t('reviewGoalsInfo')}</h3>
                          <button onClick={() => setCurrentStep(2)} className="text-[10px] font-bold text-slate-400 hover:text-[#673AB7] underline">Edit</button>
                        </div>
                        <ul className="text-xs space-y-1.5 text-slate-600 font-semibold">
                          <li className="line-clamp-2"><span className="text-slate-400">Concept:</span> {config.conceptSummary || 'None'}</li>
                          <li className="line-clamp-2"><span className="text-slate-400">Main Goal:</span> {config.primaryGoal}</li>
                          <li className="line-clamp-2"><span className="text-slate-400">Pattern:</span> {config.gamePattern}</li>
                          <li className="line-clamp-2"><span className="text-slate-400">Elements:</span> {config.gameElements.join(', ') || 'None'}</li>
                        </ul>
                      </div>

                      {/* Box 3: Graphics & Tech */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="font-bold text-xs text-[#673AB7] tracking-wider uppercase">{t('reviewDesignInfo')}</h3>
                          <button onClick={() => setCurrentStep(5)} className="text-[10px] font-bold text-slate-400 hover:text-[#673AB7] underline">Edit</button>
                        </div>
                        <ul className="text-xs space-y-1.5 text-slate-600 font-semibold">
                          <li><span className="text-slate-400">Palette:</span> {config.colorPalette}</li>
                          <li><span className="text-slate-400">Font:</span> {config.typography}</li>
                          <li><span className="text-slate-400">Production:</span> {config.productionLevel}</li>
                          <li className="line-clamp-1"><span className="text-slate-400">Addons:</span> {config.addons.length} Active</li>
                        </ul>
                      </div>

                    </div>

                    {/* Assessment Rubric Module */}
                    <AssessmentRubric config={config} lang={lang} />

                    {/* Create Prompt button in central focus */}
                    <div className="pt-4 text-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(8)}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#673AB7] to-[#8B5CF6] text-white text-base font-extrabold shadow-lg hover:shadow-xl hover:from-[#5E35B1] hover:to-[#7C4DFF] transform active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        {t('createPromptBtn')}
                      </button>
                    </div>

                  </motion.div>
                )}

                {/* STEP 8: FINAL PROMPT */}
                {currentStep === 8 && (
                  <motion.div
                    key="step-8"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-6"
                  >
                    
                    {/* Prompt Output Container Box */}
                    <div className="relative group">
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyToClipboard(enhancedPrompt || generatedPrompt)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                        
                        {/* Download button */}
                        <button
                          onClick={() => handleDownloadTxt(enhancedPrompt || generatedPrompt)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Download as .txt"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Print button */}
                        <button
                          onClick={handlePrint}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Print prompt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Display Header */}
                      <div className="bg-slate-900 px-4 py-3 rounded-t-2xl border-b border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#9575CD] tracking-widest uppercase">
                          {enhancedPrompt ? '🪄 OPTIMIZED SYSTEM PROMPT (GEMINI)' : '📝 SYSTEM PROMPT (BASIC SPEC)'}
                        </span>
                        {enhancedPrompt && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                            AI Enhanced
                          </span>
                        )}
                      </div>

                      {/* Text editor box */}
                      <MarkdownSyntaxHighlighter code={enhancedPrompt || generatedPrompt} />
                    </div>

                    {/* Prompt Rating/Feedback component */}
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 bg-violet-50 text-violet-600 rounded-lg shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {lang === 'th' ? 'ช่วยประเมินคุณภาพผลลัพธ์พร้อมต์ของระบบ?' : 'How is the quality of this system prompt?'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">
                            {lang === 'th' ? 'ความคิดเห็นของคุณจะช่วยปรับปรุงคุณภาพของ AI ให้ดียิ่งขึ้น' : 'Your anonymous rating helps improve future prompt templates.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {promptRating === null ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setPromptRating('up');
                                setAlertMsg({ type: 'success', text: lang === 'th' ? 'ขอบคุณสำหรับคะแนนประเมินระดับดีเยี่ยม! 🙏' : 'Thank you for your highly positive feedback! 🙏' });
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-bold bg-white"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{lang === 'th' ? 'ยอดเยี่ยม (Good)' : 'Good'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPromptRating('down');
                                setAlertMsg({ type: 'info', text: lang === 'th' ? 'ได้รับข้อมูลติชมเพื่อนำไปปรับปรุงแล้ว ขอบคุณครับ! 🛠️' : 'Feedback received to improve future generations. Thanks! 🛠️' });
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-bold bg-white"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>{lang === 'th' ? 'ควรปรับปรุง (Needs Work)' : 'Needs Work'}</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white border border-slate-150 px-3 py-1.5 rounded-xl animate-fade-in shadow-inner">
                            {promptRating === 'up' ? (
                              <>
                                <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="text-emerald-600">{lang === 'th' ? 'ประเมินแล้ว: ยอดเยี่ยม!' : 'Rated: Highly Satisfied!'}</span>
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="text-rose-600">{lang === 'th' ? 'ประเมินแล้ว: ควรปรับปรุง' : 'Rated: Needs Improvement'}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Complexity Meter Component */}
                    <ComplexityMeter config={config} promptText={enhancedPrompt || generatedPrompt} lang={lang} />

                    {/* Local persistence and share controllers */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSaveTitle(`${config.subject}: ${config.topic}`);
                            setShowSaveModal(true);
                          }}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-slate-400" />
                          {t('saveToLibraryBtn')}
                        </button>
                        
                        <button
                          onClick={() => {
                            setShareTitle(`${config.subject}: ${config.topic}`);
                            setShowShareModal(true);
                          }}
                          className="px-4 py-2 text-xs font-bold text-[#673AB7] hover:text-[#5E35B1] border border-purple-200 hover:border-purple-300 bg-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5 text-purple-400" />
                          {t('shareToPublicBtn')}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowLessonOverviewModal(true)}
                          className="px-4 py-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {lang === 'th' ? 'แสดงแผนการจัดการเรียนรู้' : 'Show Lesson Plan Overview'}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyShareLink}
                          className="px-4 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          สร้างลิงก์แชร์โครงการ
                        </button>
                      </div>
                    </div>

                    {/* AI ENHANCER GLOWING COMPONENT (EXACT SCREENSHOT STYLE) */}
                    <div className="border border-purple-100 bg-gradient-to-r from-[#F6F2FF] to-white p-5 md:p-6 rounded-3xl shadow-[0_10px_20px_rgba(103,58,183,0.02)] space-y-4 relative overflow-hidden">
                      {/* Purple glow background sparkles decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-[60px] opacity-25" />
                      
                      <div className="flex items-start gap-3.5 relative z-10">
                        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#673AB7] to-[#8B5CF6] text-white shrink-0 shadow-md">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm md:text-base text-slate-900">
                            {t('aiEnhanceHeader')}
                          </h3>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                            {t('aiEnhanceDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Loading Animation Area */}
                      {isEnhancing && (
                        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3 animate-fade-in relative z-10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-4.5 h-4.5 border-3 border-[#673AB7] border-t-transparent rounded-full animate-spin shrink-0" />
                            <span className="text-xs font-bold text-[#673AB7]">PRISM AI is optimizing your game specification...</span>
                          </div>
                          
                          {/* Stepped process list */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400 pl-7">
                            <span className={aiStep >= 1 ? 'text-emerald-600 flex items-center gap-1 font-bold' : ''}>
                              {aiStep >= 1 && '✓'} 1. Mapping LM-GM Alignment
                            </span>
                            <span className={aiStep >= 2 ? 'text-emerald-600 flex items-center gap-1 font-bold' : ''}>
                              {aiStep >= 2 && '✓'} 2. Structuring Score Rules
                            </span>
                            <span className={aiStep >= 3 ? 'text-emerald-600 flex items-center gap-1 font-bold' : ''}>
                              {aiStep >= 3 && '✓'} 3. Injecting Code Framework
                            </span>
                            <span className={aiStep >= 4 ? 'text-emerald-600 flex items-center gap-1 font-bold' : ''}>
                              {aiStep >= 4 && '✓'} 4. Final Polish & Proofing
                            </span>
                          </div>
                        </div>
                      )}

                      {/* AI action bar */}
                      {!isEnhancing && (
                        <div className="flex flex-col gap-3 relative z-10">
                          {/* Main optimize button */}
                          <button
                            onClick={(e) => handleEnhancePrompt(e, false)}
                            className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-[#673AB7] to-[#8B5CF6] hover:from-[#5E35B1] hover:to-[#7C4DFF] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            {t('aiEnhanceBtn')}
                          </button>

                          {/* Custom constraint form */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customAiPrompt}
                              onChange={(e) => setCustomAiPrompt(e.target.value)}
                              placeholder={t('aiCustomPlaceholder')}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7] bg-white"
                            />
                            <button
                              onClick={(e) => handleEnhancePrompt(e, true)}
                              disabled={!customAiPrompt}
                              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                            >
                              {t('aiCustomBtn')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Next Steps Card Guide */}
                    <div className="border border-slate-100 p-5 rounded-3xl space-y-3 bg-[#FCFDFE]">
                      <h4 className="font-extrabold text-slate-900 text-sm">{t('nextStepHeader')}</h4>
                      <ol className="space-y-2.5 pl-1.5">
                        {[1, 2, 3, 4].map((stepNo) => (
                          <li key={stepNo} className="text-slate-500 text-xs font-medium leading-relaxed">
                            {t(`nextStep${stepNo}` as any)}
                          </li>
                        ))}
                      </ol>
                    </div>

                  </motion.div>
                )}
                </AnimatePresence>

              </div>

              {/* Form Bottom Navigation Footer Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 mt-8 pt-5">
                {currentStep > 1 ? (
                  <button
                    onClick={() => {
                      const idx = STEPS_LIST.indexOf(currentStep);
                      if (idx > 0) {
                        setCurrentStep(STEPS_LIST[idx - 1]);
                      }
                    }}
                    className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('backBtn')}
                  </button>
                ) : (
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 border border-slate-100 hover:border-slate-200 bg-white text-slate-400 hover:text-slate-500 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Design
                  </button>
                )}

                {currentStep < 7 ? (
                  <button
                    onClick={() => {
                      const idx = STEPS_LIST.indexOf(currentStep);
                      if (idx < STEPS_LIST.length - 1) {
                        setCurrentStep(STEPS_LIST[idx + 1]);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    {t('nextBtn')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : currentStep === 7 ? (
                  <button
                    onClick={() => setCurrentStep(8)}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#673AB7] to-[#8B5CF6] hover:from-[#5E35B1] hover:to-[#7C4DFF] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    {t('createPromptBtn')}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    ออกแบบเกม Prompt ใหม่
                  </button>
                )}
              </div>

            </div>

            {/* Gamification Analytics Dashboard */}
            <div className="mt-6">
              <GamificationAnalytics 
                config={config} 
                onChangeConfig={setConfig} 
                lang={lang} 
              />
            </div>

          </div>

          {/* Right Side: Recent History Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#F9F7FF] rounded-xl text-[#673AB7] shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                      {t('recentHistoryTitle' as any)}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {lang === 'th' ? 'เซสชันนี้' : 'This session'}
                    </p>
                  </div>
                </div>

                {promptHistory.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompareMode(!isCompareMode);
                      setSelectedCompareIds([]);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border flex items-center gap-1 cursor-pointer ${
                      isCompareMode
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                        : 'bg-[#F9F7FF] border-[#ECE4FF] text-[#673AB7] hover:bg-[#F0EAFF]'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{isCompareMode ? (lang === 'th' ? 'ยกเลิก' : 'Cancel') : (lang === 'th' ? 'เปรียบเทียบ' : 'Compare')}</span>
                  </button>
                )}
              </div>

              {isCompareMode ? (
                <div className="bg-indigo-50/60 border border-indigo-100/50 p-3 rounded-2xl text-[10px] font-bold text-slate-700 flex flex-col gap-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[#673AB7] font-extrabold">
                    <ArrowLeftRight className="w-4 h-4 animate-pulse" />
                    <span>{lang === 'th' ? 'เลือกประวัติ 2 รายการเพื่อเปรียบเทียบ' : 'Select exactly 2 versions to compare'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-slate-500 bg-white border border-slate-150 px-2 py-0.5 rounded-lg font-extrabold">
                      {selectedCompareIds.length}/2 {lang === 'th' ? 'เลือกแล้ว' : 'selected'}
                    </span>
                    <button
                      type="button"
                      disabled={selectedCompareIds.length !== 2}
                      onClick={handleStartComparison}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0 ${
                        selectedCompareIds.length === 2
                          ? 'bg-[#673AB7] hover:bg-[#5E35B1] text-white shadow-md cursor-pointer scale-100 active:scale-95'
                          : 'bg-slate-100 text-slate-300 cursor-default'
                      }`}
                    >
                      <span>{lang === 'th' ? 'เริ่มเปรียบเทียบ ✦' : 'Compare Selected ✦'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  {t('recentHistoryDesc' as any)}
                </p>
              )}

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {promptHistory.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-100 flex flex-col items-center gap-2 bg-slate-50/50">
                    <Clock className="w-8 h-8 text-slate-300" />
                    <span className="text-xs font-bold text-slate-800">{t('historyEmpty' as any)}</span>
                    <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {t('historyEmptyDesc' as any)}
                    </span>
                  </div>
                ) : (
                  promptHistory.map((item) => {
                    const isCurrent = config.topic === item.config.topic && config.subject === item.config.subject;
                    const isSelected = selectedCompareIds.includes(item.id);
                    
                    const handleItemClick = () => {
                      if (isCompareMode) {
                        setSelectedCompareIds(prev => {
                          if (prev.includes(item.id)) {
                            return prev.filter(id => id !== item.id);
                          } else if (prev.length < 2) {
                            return [...prev, item.id];
                          } else {
                            return [prev[1], item.id];
                          }
                        });
                      } else {
                        const isDirty = JSON.stringify(config) !== JSON.stringify(lastCheckpointConfig);
                        if (isDirty) {
                          setRevertWarningItem(item);
                        } else {
                          handleRevertHistory(item);
                        }
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={handleItemClick}
                        className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer relative group/item ${
                          isSelected
                            ? 'border-[#673AB7] bg-indigo-50/40 ring-2 ring-[#673AB7]/30 shadow-md'
                            : isCurrent && !isCompareMode
                            ? 'border-[#673AB7] bg-[#F9F7FF] ring-1 ring-[#ECE4FF]' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            {isCompareMode && (
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                isSelected 
                                  ? 'bg-[#673AB7] border-[#673AB7] text-white' 
                                  : 'border-slate-300 bg-white hover:border-slate-400'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            )}
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              item.type === 'enhanced' 
                                ? 'bg-[#ECE4FF] text-[#673AB7] border border-purple-100' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {item.type === 'enhanced' ? t('historyEnhancedTag' as any) : t('historyBasicTag' as any)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold">{item.timestamp}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHistory(item.id, e);
                              }}
                              className="text-slate-300 hover:text-red-500 p-0.5 rounded transition-colors"
                              title="Remove from history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderAvatar(item.config?.teacherAvatar || 'preset-1', "w-7 h-7")}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight line-clamp-1">
                              {item.subjectName}
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                              {item.topic}
                            </p>
                          </div>
                        </div>

                        <div className="text-[8px] font-bold text-slate-400 flex flex-wrap gap-x-1.5 gap-y-0.5 border-t border-slate-50 pt-1.5 mt-0.5">
                          <span>• {item.config.cefrLevel}</span>
                          <span>• {item.config.gamePattern}</span>
                          <span>• {item.config.colorPalette}</span>
                        </div>

                        {!isCompareMode && (
                          <div className="absolute inset-0 bg-[#673AB7]/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1 bg-[#673AB7] text-white text-[10px] font-extrabold rounded-lg shadow-sm">
                              {t('revertBtn' as any)}
                            </span>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Educator Achievements & Gamification */}
            <div id="teacher-gamification-card">
              <TeacherGamification
                stats={gamificationStats}
                config={config}
                publicPromptsCount={publicPrompts.length}
                savedPromptsCount={savedPrompts.length}
                historyCount={promptHistory.length}
                lang={lang}
                onClaimReward={(points, descriptionTh, descriptionEn, badgeId) => {
                  addXPPoints(points, descriptionTh, descriptionEn, badgeId);
                }}
              />
            </div>
          </div>

        </div>
      </div>
    ) : (
          /* =======================================
             COMMUNITY HUB TAB / PROMPT LIBRARY
             ======================================= */
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header Title */}
            <div className="text-center space-y-1 mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                PRISM COMMUNITY
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
                {t('communityHubTitle')}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                {t('communityHubDesc')}
              </p>
            </div>

            {/* Hub tabs selector */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setLibrarySubTab('public')}
                className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  librarySubTab === 'public' 
                    ? 'border-[#673AB7] text-[#673AB7]' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                {t('publicPromptsTab')}
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {publicPrompts.length}
                </span>
              </button>
              
              <button
                onClick={() => setLibrarySubTab('saved')}
                className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  librarySubTab === 'saved' 
                    ? 'border-[#673AB7] text-[#673AB7]' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Save className="w-4 h-4" />
                {t('savedPromptsTab')}
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {savedPrompts.length}
                </span>
              </button>
            </div>

            {/* List entries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* If Public database */}
              {librarySubTab === 'public' && (
                publicPrompts.length > 0 ? (
                  publicPrompts.map((p) => (
                    <div key={p.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#673AB7] bg-[#ECE4FF] px-2.5 py-1 rounded-full uppercase">
                            {p.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="font-extrabold text-sm md:text-base text-slate-900 line-clamp-1">{p.title}</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">{p.description}</p>
                        
                        <div className="flex items-center gap-2 pt-1">
                          {renderAvatar(p.config?.teacherAvatar || 'preset-1', "w-6 h-6")}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span className="font-bold text-slate-750">{p.teacherName}</span>
                            <span className="text-slate-300">|</span>
                            <span className="font-medium">Topic: {p.topic}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLoadTemplate(p)}
                        className="w-full py-2 bg-[#673AB7] hover:bg-[#5E35B1] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {t('useThisTemplateBtn')}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-slate-400 font-medium text-sm">
                    ไม่พบข้อมูลคลังสาธารณะในขณะนี้...
                  </div>
                )
              )}

              {/* If Local saved list */}
              {librarySubTab === 'saved' && (
                savedPrompts.length > 0 ? (
                  savedPrompts.map((p) => (
                    <div key={p.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 animate-fade-in">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
                            {p.subject}
                          </span>
                          <button
                            onClick={() => {
                              const updated = savedPrompts.filter(item => item.id !== p.id);
                              setSavedPrompts(updated);
                              localStorage.setItem('prism_saved_prompts', JSON.stringify(updated));
                              setAlertMsg({ type: 'info', text: 'ลบ Prompt จากประวัติบันทึกแล้ว' });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <h3 className="font-extrabold text-sm md:text-base text-slate-900 line-clamp-1">{p.title}</h3>
                        <p className="text-slate-400 text-xs font-medium line-clamp-2">{p.description}</p>
                      </div>

                      <button
                        onClick={() => handleLoadTemplate(p)}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {t('useThisTemplateBtn')}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-slate-400 font-medium text-sm">
                    คุณยังไม่ได้บันทึก Prompt ใด ๆ ไว้ในประวัติส่วนตัว สามารถกดบันทึกได้หลังจากออกแบบเสร็จสิ้น
                  </div>
                )
              )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-100 text-center text-xs text-slate-400 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-400">
            {lang === 'th' ? '© 2026 PRISM Build • ระบบออกแบบ Prompt เกมเพื่อการศึกษา (LM-GM Framework)' : '© 2026 PRISM Build • Educational Prompt Game Architect (LM-GM Framework)'}
          </p>
        </div>
        {lastSaved && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-100/50 px-3 py-1 rounded-full shadow-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lastSaved}</span>
          </div>
        )}
      </footer>

      {/* MODALS OVERLAYS */}

      {/* Modal 0: Unsaved changes warning when loading history */}
      {revertWarningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-rose-100 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-950">
                  {lang === 'th' ? 'พบการเปลี่ยนแปลงที่ยังไม่บันทึก' : 'Unsaved Changes Detected'}
                </h3>
                <p className="text-[10px] text-rose-500 font-extrabold tracking-wider uppercase mt-0.5">
                  {lang === 'th' ? 'คำเตือน: ข้อมูลเดิมจะสูญหาย' : 'Warning: Progress Overwrite'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              {lang === 'th' 
                ? 'คุณมีการปรับแต่งระบบออกแบบเกม Prompt ในปัจจุบันที่ยังไม่ได้เซฟเป็นรุ่นเวอร์ชันประวัติล่าสุด หากคุณยืนยันที่จะย้อนกลับไปเปิดเวอร์ชันเก่า ข้อมูลที่แก้ไขอยู่ขณะนี้จะสูญหายทันที' 
                : 'You have made modifications to the current prompt game configuration that are not yet saved into your history checkpoints. Opening this older version will completely discard your current unsaved progress.'}
            </p>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                {lang === 'th' ? 'เวอร์ชันที่กำลังจะโหลด' : 'Older Version to Load'}
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">
                {revertWarningItem.subjectName} : {revertWarningItem.topic}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                  {revertWarningItem.type === 'enhanced' ? 'AI Enhanced' : 'Standard'}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">{revertWarningItem.timestamp}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button" 
                onClick={() => setRevertWarningItem(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                {lang === 'th' ? 'ยกเลิก (แก้ไขต่อ)' : 'Cancel & Continue Editing'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleRevertHistory(revertWarningItem);
                  setRevertWarningItem(null);
                }}
                className="px-4 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-xl shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                {lang === 'th' ? 'ดำเนินการต่อและทับข้อมูล' : 'Proceed & Overwrite'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: My API Key settings */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#673AB7]" />
                {t('myApiKeyLabel')}
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {t('apiKeyDesc')}
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <input 
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder={t('apiKeyPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ECE4FF] focus:border-[#673AB7]"
              />

              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  {t('cancelBtn')}
                </button>
                <button 
                  type="submit"
                  className="px-4.5 py-2 text-xs font-extrabold text-white bg-[#673AB7] hover:bg-[#5E35B1] rounded-xl transition-all shadow-sm"
                >
                  {t('confirmSaveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Save Prompt Locally */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2 animate-fade-in">
                <Save className="w-5 h-5 text-[#673AB7]" />
                {t('saveModalTitle')}
              </h3>
              <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocally} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">{t('promptTitleLabel')}</label>
                <input 
                  type="text"
                  required
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ECE4FF]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">{t('promptDescLabel')}</label>
                  <VoiceDictationButton
                    value={saveDesc}
                    onChange={setSaveDesc}
                    lang={lang}
                    onStatusChange={setAlertMsg}
                  />
                </div>
                <textarea 
                  rows={2}
                  value={saveDesc}
                  onChange={(e) => setSaveDesc(e.target.value)}
                  className="p-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ECE4FF]"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  {t('cancelBtn')}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                >
                  {t('confirmSaveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Share Prompt Globally */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#673AB7]" />
                {t('shareModalTitle')}
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Game Preview Verification Card */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-150 p-4 space-y-3 shadow-inner">
              <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                <span className="px-2 py-0.5 rounded text-[8px] bg-[#673AB7] text-white font-black tracking-wider uppercase">
                  {lang === 'th' ? 'พรีวิวข้อมูลเกม' : 'GAME SPEC PREVIEW'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {lang === 'th' ? 'ตรวจสอบข้อมูลก่อนแชร์ลงคลังสาธารณะ' : 'Verify game specifications before publishing'}
                </span>
              </div>

              {/* Game concept summary */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{lang === 'th' ? 'คำอธิบายแนวคิดเกม (Concept Summary)' : 'Game Concept Summary'}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed bg-white border border-slate-100 p-2.5 rounded-xl max-h-[80px] overflow-y-auto">
                  {config.conceptSummary || config.topic || (lang === 'th' ? 'ยังไม่ได้ระบุรายละเอียดแนวคิด' : 'No summary specified')}
                </p>
              </div>

              {/* Primary goal */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{lang === 'th' ? 'เป้าหมายหลักของการเรียนรู้ (Primary Goal)' : 'Primary Learning Goal'}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed bg-white border border-slate-100 p-2.5 rounded-xl">
                  {config.primaryGoal || (lang === 'th' ? 'ยังไม่ได้ระบุเป้าหมายหลัก' : 'No primary goal specified')}
                </p>
              </div>

              {/* Target skills */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Brain className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>{lang === 'th' ? 'ทักษะเป้าหมายที่ได้รับ (Target Skills)' : 'Target Skills Learned'}</span>
                </div>
                <div className="flex flex-wrap gap-1 bg-white border border-slate-100 p-2.5 rounded-xl min-h-[36px]">
                  {config.targetSkills && config.targetSkills.length > 0 ? (
                    config.targetSkills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-pink-50 text-pink-600 border border-pink-100/60"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium italic">
                      {lang === 'th' ? 'ไม่มีการระบุทักษะเป้าหมาย' : 'No target skills listed'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleShareToPublic} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">{t('promptTitleLabel')}</label>
                <input 
                  type="text"
                  required
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ECE4FF]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">{t('promptDescLabel')}</label>
                  <VoiceDictationButton
                    value={shareDesc}
                    onChange={setShareDesc}
                    lang={lang}
                    onStatusChange={setAlertMsg}
                  />
                </div>
                <textarea 
                  rows={2}
                  value={shareDesc}
                  onChange={(e) => setShareDesc(e.target.value)}
                  className="p-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ECE4FF]"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  {t('cancelBtn')}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#673AB7] hover:bg-[#5E35B1] rounded-xl transition-all shadow-sm"
                >
                  {t('confirmShareBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonOverviewModal && (
        <LessonOverviewModal
          isOpen={showLessonOverviewModal}
          onClose={() => setShowLessonOverviewModal(false)}
          config={config}
          lang={lang}
          renderAvatar={renderAvatar}
        />
      )}

      {activeComparison && (
        <PromptDiffViewer
          versionA={activeComparison.oldItem}
          versionB={activeComparison.newItem}
          onClose={() => setActiveComparison(null)}
          lang={lang}
        />
      )}

      {showTour && (
        <GuidedTour
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lang={lang}
          onClose={() => {
            localStorage.setItem('prism_tour_completed', 'true');
            setShowTour(false);
          }}
        />
      )}

    </div>
  );
}
