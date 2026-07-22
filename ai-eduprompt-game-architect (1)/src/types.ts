/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurriculumTreeNode {
  id: string;
  label: string;
  parents: string[]; // List of parent IDs
}

export interface GamePromptConfig {
  teacherName: string;
  subject: string;
  customSubject?: string;
  topic: string;
  cefrLevel: string;
  studentsCount: number;
  learningStyles: string[];
  targetSkills: string[];
  coreCompetencies: string[];
  skills3r8c: string[];
  conceptSummary: string;
  primaryGoal: string;
  subObjectives: string;
  coreActions: string;
  gamePattern: string;
  gameElements: string[];
  colorPalette: string;
  typography: string;
  visualStyle: string;
  animations: string;
  gameLanguage: string;
  productionLevel: string;
  addons: string[];
  curriculumSequence?: string[];
  curriculumSequenceTree?: CurriculumTreeNode[];
  layoutDensity?: 'standard' | 'comfortable' | 'compact';
  teacherAvatar?: string;
}

export interface SharedPrompt {
  id: string;
  title: string;
  description: string;
  config: GamePromptConfig;
  generatedPrompt: string;
  createdAt: string;
  teacherName: string;
  subject: string;
  topic: string;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  config: GamePromptConfig;
  prompt: string;
  type: 'basic' | 'enhanced';
  subjectName: string;
  topic: string;
}

export interface GamificationActivity {
  id: string;
  timestamp: string;
  points: number;
  descriptionTh: string;
  descriptionEn: string;
}

export interface TeacherProfileStats {
  xp: number;
  level: number;
  badges: string[];
  activities: GamificationActivity[];
}


