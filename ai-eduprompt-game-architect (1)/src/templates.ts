/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GamePromptConfig, SharedPrompt } from './types';

export const COLOR_PALETTES = [
  {
    id: 'Pixar Vibrant',
    nameTh: 'Pixar Vibrant (สดใสแบบพิกซาร์)',
    nameEn: 'Pixar Vibrant',
    descTh: 'สดใส สนุกสนาน และดูเป็นมืออาชีพ',
    descEn: 'Bright, playful, and professional',
    colors: ['bg-[#00BCD4]', 'bg-[#FF9800]', 'bg-[#673AB7]', 'bg-[#FFEB3B]'],
    hexColors: ['#00BCD4', '#FF9800', '#673AB7', '#FFEB3B']
  },
  {
    id: 'Ocean Blue',
    nameTh: 'Ocean Blue (สีน้ำทะเล)',
    nameEn: 'Ocean Blue',
    descTh: 'สงบ เป็นมืออาชีพ และน่าเชื่อถือ',
    descEn: 'Calm, professional, and trustworthy',
    colors: ['bg-[#01579B]', 'bg-[#03A9F4]', 'bg-[#00BCD4]', 'bg-[#E1F5FE]'],
    hexColors: ['#01579B', '#03A9F4', '#00BCD4', '#E1F5FE']
  },
  {
    id: 'Forest Green',
    nameTh: 'Forest Green (สีเขียวป่า)',
    nameEn: 'Forest Green',
    descTh: 'ธรรมชาติ เติบโต และสดชื่น',
    descEn: 'Natural, growth-oriented, and fresh',
    colors: ['bg-[#1B5E20]', 'bg-[#4CAF50]', 'bg-[#8BC34A]', 'bg-[#E8F5E9]'],
    hexColors: ['#1B5E20', '#4CAF50', '#8BC34A', '#E8F5E9']
  },
  {
    id: 'Sunset Warm',
    nameTh: 'Sunset Warm (สีพระอาทิตย์ตก)',
    nameEn: 'Sunset Warm',
    descTh: 'อบอุ่น ทรงพลัง และน่าดึงดูด',
    descEn: 'Warm, energetic, and engaging',
    colors: ['bg-[#E65100]', 'bg-[#FF5722]', 'bg-[#F89797]', 'bg-[#FFF9C4]'],
    hexColors: ['#E65100', '#FF5722', '#F89797', '#FFF9C4']
  },
  {
    id: 'Purple Magic',
    nameTh: 'Purple Magic (สีม่วงเวทมนตร์)',
    nameEn: 'Purple Magic',
    descTh: 'สร้างสรรค์ มีจินตนาการ และพรีเมียม',
    descEn: 'Creative, imaginative, and premium',
    colors: ['bg-[#673AB7]', 'bg-[#9575CD]', 'bg-[#EDE7F6]', 'bg-[#BA68C8]'],
    hexColors: ['#673AB7', '#9575CD', '#EDE7F6', '#BA68C8']
  }
];

export const GAME_PATTERNS = [
  {
    id: 'Puzzle & Challenge',
    nameTh: 'Puzzle & Challenge (ปริศนาและท้าทาย)',
    nameEn: 'Puzzle & Challenge',
    descTh: 'เน้นตรรกะและการแก้ปัญหาเพื่อก้าวข้ามอุปสรรค',
    descEn: 'Focus on logic and problem-solving to overcome obstacles',
    bloom: 'HOTS (Higher-Order Thinking Skills)',
    alignmentTh: 'การไขปริศนาท้าทายความคิดระดับสูง (HOTS) กระตุ้นให้นักเรียนใช้การวิเคราะห์เชิงตรรกะ ประเมินทางเลือก และทดลองกลยุทธ์ต่าง ๆ เพื่อแก้ปัญหาที่ซับซ้อนในด่านทดสอบ',
    alignmentEn: 'Solving puzzles demands Higher-Order Thinking Skills (HOTS) by prompting students to analyze logical patterns, evaluate alternatives, and experiment with strategies to solve complex challenges.'
  },
  {
    id: 'Role-Play & Narrative',
    nameTh: 'Role-Play & Narrative (บทบาทสมมติและเรื่องราว)',
    nameEn: 'Role-Play & Narrative',
    descTh: 'สมมติบทบาท ดำเนินเนื้อเรื่องเพื่อความอินในบทเรียน',
    descEn: 'Adopt roles and drive narratives for deep immersion',
    bloom: 'MIXED (Cognitive & Affective domains)',
    alignmentTh: 'การสวมบทบาทผสานโลกความรู้ (Cognitive) และความรู้สึกร่วมใจ (Affective) ช่วยให้นักเรียนประยุกต์ใช้ความรู้ในสถานการณ์จริง พร้อมพัฒนาความเข้าใจทางอารมณ์และสังคมผ่านเรื่องราวที่ดำเนินไป',
    alignmentEn: 'Role-playing bridges cognitive knowledge and affective empathy. It allows students to apply academic skills in real-world contexts while developing social-emotional growth through story immersion.'
  },
  {
    id: 'Simulation & Practice',
    nameTh: 'Simulation & Practice (การจำลองและฝึกปฏิบัติ)',
    nameEn: 'Simulation & Practice',
    descTh: 'จำลองสถานการณ์จริงเพื่อฝึกทักษะเฉพาะด้านซ้ำ ๆ',
    descEn: 'Simulate real scenarios to practice specific skills repeatedly',
    bloom: 'LOTS to HOTS (Application & Analysis)',
    alignmentTh: 'เชื่อมโยงทักษะพื้นฐาน (LOTS) สู่ขั้นสูง (HOTS) เริ่มต้นจากการจำลองสถานการณ์และกระทำซ้ำเพื่อความแม่นยำ จากนั้นจึงฝึกฝนการวิเคราะห์และประยุกต์ใช้เมื่อเจอตัวแปรที่หลากหลาย',
    alignmentEn: 'Transitions from Lower-Order (LOTS) to Higher-Order (HOTS) thinking. It starts with structured repetition for automaticity, then challenges students to analyze and adapt to dynamic situational variables.'
  },
  {
    id: 'Progression & Mastery',
    nameTh: 'Progression & Mastery (ความก้าวหน้าและการเชี่ยวชาญ)',
    nameEn: 'Progression & Mastery',
    descTh: 'ไต่ระดับด่านความยากเพื่อพัฒนาความเชี่ยวชาญ',
    descEn: 'Climb difficulty levels to cultivate core mastery',
    bloom: 'HOTS (Creation & Synthesis)',
    alignmentTh: 'มุ่งเน้นความคิดขั้นสูง (HOTS) ในด้านการต่อยอดและสังเคราะห์ เมื่อนักเรียนก้าวผ่านด่านที่มีความยากสะสม พวกเขาจะบูรณาการความรู้ทั้งหมดเพื่อสร้างรูปแบบแนวทางการแก้ปัญหาของตนเองได้',
    alignmentEn: 'Promotes the highest levels of HOTS (Synthesis & Creation). As students achieve deep mastery through progressive levels, they are empowered to synthesize concepts and construct original solutions.'
  }
];

export const SUBJECT_PRESETS = [
  { id: 'English', nameTh: 'ภาษาอังกฤษ (English)', nameEn: 'English Language', skills: ['Listening', 'Speaking', 'Reading', 'Writing', 'Grammar', 'Vocabulary', 'ESP (English for Specific Purposes)', 'Pronunciation'] },
  { id: 'Mathematics', nameTh: 'คณิตศาสตร์ (Mathematics)', nameEn: 'Mathematics', skills: ['Calculation (การคำนวณ)', 'Logical Reasoning (ตรรกศาสตร์)', 'Problem Solving (การแก้โจทย์)', 'Geometry & Shapes (เรขาคณิต)', 'Data & Graphs (ข้อมูลและสถิติ)'] },
  { id: 'Science', nameTh: 'วิทยาศาสตร์ (Science)', nameEn: 'Science', skills: ['Scientific Inquiry (การสืบเสาะ)', 'Hypothesis Testing (การตั้งสมมติฐาน)', 'Observation (การสังเกต)', 'Data Analysis (การวิเคราะห์)', 'Physical Concepts (ฟิสิกส์)', 'Biological Concepts (ชีววิทยา)'] },
  { id: 'Social Studies', nameTh: 'สังคมศึกษา (Social Studies)', nameEn: 'Social Studies', skills: ['Critical Thinking (การคิดวิเคราะห์)', 'History & Time (ประวัติศาสตร์)', 'Geography (ภูมิศาสตร์)', 'Civics & Ethics (หน้าที่พลเมือง)', 'Cultural Literacy (ความเข้าใจวัฒนธรรม)'] },
  { id: 'Thai', nameTh: 'ภาษาไทย (Thai)', nameEn: 'Thai Language', skills: ['หลักภาษาและการสะกด (Grammar)', 'การอ่านจับใจความ (Reading)', 'วรรณคดีและวรรณกรรม (Literature)', 'การคัดลายมือและการเขียน (Writing)', 'ทักษะการฟังและการพูด (Speech)'] },
  { id: 'Arts', nameTh: 'ศิลปะและดนตรี (Arts & Music)', nameEn: 'Arts & Music', skills: ['Creativity (ความคิดสร้างสรรค์)', 'Visual Design (การออกแบบ)', 'Rhythm & Melody (จังหวะและทำนอง)', 'Cultural Appreciation (สุนทรียศาสตร์)'] },
  { id: 'Computing & Tech', nameTh: 'วิทยาการคำนวณและเทคโนโลยี (Computing)', nameEn: 'Computing & Tech', skills: ['Coding Logic (การคิดเชิงคำนวณ)', 'Digital Literacy (ทักษะดิจิทัล)', 'Information Search (การค้นหาข้อมูล)', 'Security & Safety (ความปลอดภัยไซเบอร์)'] },
  { id: 'Custom', nameTh: 'วิชาอื่น ๆ / กำหนดเอง (Custom)', nameEn: 'Other / Custom Subject', skills: ['Critical Thinking', 'Collaboration', 'Problem Solving', 'Creativity'] }
];

export const CORE_COMPETENCIES = [
  { id: 'Communication', textTh: 'ความสามารถในการสื่อสาร', textEn: 'Communication Capacity', descTh: 'รับ-ส่งสาร ถ่ายทอดความคิด และเลือกรับข้อมูลอย่างมีเหตุผล', descEn: 'Receiving/sending messages, expressing ideas rationally' },
  { id: 'Thinking', textTh: 'ความสามารถในการคิด', textEn: 'Thinking Capacity', descTh: 'คิดวิเคราะห์ สังเคราะห์ และสร้างสรรค์อย่างเป็นระบบ', descEn: 'Analytical, synthetic, and creative thinking' },
  { id: 'ProblemSolving', textTh: 'ความสามารถในการแก้ปัญหา', textEn: 'Problem-Solving Capacity', descTh: 'เผชิญและแก้ไขอุปสรรคได้อย่างถูกต้องเหมาะสมบนพื้นฐานของเหตุผล', descEn: 'Overcoming obstacles based on reasoning' },
  { id: 'LifeSkills', textTh: 'ความสามารถในการใช้ทักษะชีวิต', textEn: 'Life Skills Capacity', descTh: 'ปรับตัวทำงานร่วมกับผู้อื่น เรียนรู้ด้วยตนเองและพัฒนาอย่างต่อเนื่อง', descEn: 'Adapting, collaborating, and continuous learning' },
  { id: 'Technology', textTh: 'ความสามารถในการใช้เทคโนโลยี', textEn: 'Technology Application Capacity', descTh: 'เลือกใช้เทคโนโลยีเพื่อการเรียนรู้ สื่อสาร และแก้ปัญหาอย่างสร้างสรรค์', descEn: 'Using technology for communication and learning' }
];

export const SKILLS_3R8C = [
  // 3R
  { id: '3R-Reading', category: '3R', textTh: 'Reading (อ่านออก)', textEn: 'Reading', descTh: 'อ่านออกและจับใจความสำคัญของเรื่องได้', descEn: 'Read and comprehend key concepts' },
  { id: '3R-Writing', category: '3R', textTh: 'Writing (เขียนได้)', textEn: 'Writing', descTh: 'เขียนและสื่อสารให้ผู้อื่นเข้าใจได้อย่างถูกต้อง', descEn: 'Write and communicate effectively' },
  { id: '3R-Arithmetics', category: '3R', textTh: 'Arithmetics (คิดเลขเป็น)', textEn: 'Arithmetics', descTh: 'มีทักษะการคำนวณและคิดเชิงสัญลักษณ์เชิงคณิตศาสตร์', descEn: 'Mathematical computation and abstract reasoning' },
  // 8C
  { id: '8C-CriticalThinking', category: '8C', textTh: 'Critical Thinking & Problem Solving', textEn: 'Critical Thinking', descTh: 'การคิดวิเคราะห์ การคิดอย่างมีวิจารณญาณ และการแก้ปัญหา', descEn: 'Analytical thinking and decision making' },
  { id: '8C-Creativity', category: '8C', textTh: 'Creativity & Innovation', textEn: 'Creativity', descTh: 'การคิดเชิงสร้างสรรค์และการสร้างนวัตกรรมใหม่', descEn: 'Creative thinking and innovative design' },
  { id: '8C-CrossCultural', category: '8C', textTh: 'Cross-cultural Understanding', textEn: 'Cross-cultural', descTh: 'ความเข้าใจความแตกต่างทางวัฒนธรรมและกระบวนการคิดข้ามวัฒนธรรม', descEn: 'Empathy and global cultural understanding' },
  { id: '8C-Collaboration', category: '8C', textTh: 'Collaboration, Teamwork & Leadership', textEn: 'Collaboration', descTh: 'ความร่วมมือ การทำงานเป็นทีม และการแสดงภาวะผู้นำ', descEn: 'Teamwork, sharing, and constructive leadership' },
  { id: '8C-Communication', category: '8C', textTh: 'Communications, Information & Media Literacy', textEn: 'Communication', descTh: 'ทักษะการสื่อสาร สารสนเทศ และการรู้เท่าทันสื่อ', descEn: 'Media, digital literacy, and expressive skills' },
  { id: '8C-Computing', category: '8C', textTh: 'Computing & ICT Literacy', textEn: 'Computing & ICT', descTh: 'ทักษะความเข้าใจและการใช้เทคโนโลยีคอมพิวเตอร์และดิจิทัล', descEn: 'Programming logic, computing and IT mastery' },
  { id: '8C-Career', category: '8C', textTh: 'Career & Learning Skills', textEn: 'Career & Learning', descTh: 'ทักษะทางอาชีพ การเรียนรู้ด้วยตนเอง และความยืดหยุ่นในการทำงาน', descEn: 'Adaptability, life-long learning and vocational skills' },
  { id: '8C-Compassion', category: '8C', textTh: 'Compassion (คุณธรรม จริยธรรม)', textEn: 'Compassion', descTh: 'ความมีเมตตากรุณา มีคุณธรรม มีระเบียบวินัย และจริยธรรม', descEn: 'Moral grounding, empathy, and classroom citizenship' }
];

export const DEFAULT_CONFIG: GamePromptConfig = {
  layoutDensity: 'standard',
  teacherAvatar: 'preset-1',
  teacherName: 'ครูสมเจตน์',
  subject: 'English',
  customSubject: '',
  topic: 'ordering-food',
  cefrLevel: 'B1 - Intermediate',
  studentsCount: 30,
  learningStyles: ['Visual', 'Kinesthetic'],
  targetSkills: ['Vocabulary', 'Speaking', 'Grammar'],
  coreCompetencies: ['Communication', 'Thinking'],
  skills3r8c: ['3R-Reading', '8C-Collaboration', '8C-Communication'],
  conceptSummary: 'การสื่อสารในชีวิตประจำวันเกี่ยวกับการสั่งอาหารเป็นพื้นฐานสำคัญของการใช้ภาษาอังกฤษในบริบทสังคมจริง นักเรียนจำเป็นต้องเข้าใจคำศัพท์เกี่ยวกับการบอกปริมาณ โครงสร้างประโยคขอร้องที่สุภาพ และการตอบรับเพื่อการใช้ภาษาได้อย่างถูกต้องและเหมาะสมตามวัฒนธรรม',
  primaryGoal: 'นักเรียนสามารถสื่อสารสั่งอาหารและโต้ตอบในร้านอาหารภาษาอังกฤษได้อย่างคล่องแคล่ว',
  subObjectives: 'จดจำคำศัพท์ประเภทอาหาร, ฝึกโครงสร้างประโยคสุภาพ Would you like..., พัฒนาความมั่นใจในการพูดโต้ตอบ',
  coreActions: 'จับคู่บัตรภาพอาหาร, ทายเมนูจากคำใบ้, ทำเควสสวมบทบาทลูกค้าร้านอาหารจำลอง, แลกเปลี่ยนเหรียญรางวัล',
  gamePattern: 'Role-Play & Narrative',
  gameElements: ['Leaderboard', 'Achievement Badges', 'Feedback System'],
  colorPalette: 'Pixar Vibrant',
  typography: 'Modern Rounded',
  visualStyle: 'Pixar Cartoon',
  animations: 'Smooth & Bouncy',
  gameLanguage: 'EN/TH',
  productionLevel: 'Polished',
  addons: ['Pro smooth animations', 'Sound effects & music', 'Custom game fonts'],
  curriculumSequence: [
    'Level 1: Basic Food Vocabulary Match',
    'Level 2: Common Ordering Phrases & Asking for Prices',
    'Level 3: Listening & Order Taking Dialogues',
    'Level 4: Full Interactive Restaurant Simulation & Checkout'
  ]
};

export const DEFAULT_PROMPTS: SharedPrompt[] = [
  {
    id: 'default-1',
    title: 'English Bistro Challenge 🍔',
    description: 'เกมสวมบทบาทเป็นลูกค้าร้านอาหารและบริกรในโลกพิกซาร์ เพื่อฝึกการสนทนาภาษาอังกฤษและการสะสมแต้ม',
    teacherName: 'ครูจิรายุ',
    subject: 'English',
    topic: 'Ordering Food & Dialogues',
    createdAt: '2026-07-20T10:00:00Z',
    config: {
      ...DEFAULT_CONFIG,
      teacherName: 'ครูจิรายุ',
      subject: 'English',
      topic: 'Ordering Food in English',
      gamePattern: 'Role-Play & Narrative',
    },
    generatedPrompt: `# ELT Serious Game Design Specification - English Bistro

## 1. Teacher & Course Context
- **Teacher Name**: ครูจิรายุ
- **Course**: English Language Communication
- **Topic**: Ordering Food & Customer Service Dialogues
- **Target Audience**: B1 - Intermediate | 30 Students
- **Learning Styles**: Visual, Kinesthetic
- **Target Skills**: Vocabulary, Speaking, Grammar

## 2. Learning Strategies & Objectives
- **Primary Goal**: Students can independently and politely order food and serve customers using polite English expressions.
- **Sub-objectives**:
  1. Learn and retain vocabulary for menus, ingredients, and pricing.
  2. Master polite grammatical structures (e.g., "I would like to order...", "Could I have...", "Certainly, sir.").
  3. Build conversational confidence and fluency through simulated real-time interaction.
- **Core Game Loop**:
  - Receive customers -> Show menu -> Take order using correct grammar -> Deliver correct items -> Earn coins & unlock badges.

## 3. Game Pattern & Architecture
- **Framework Mapping**: LM-GM (Learning Mechanics - Game Mechanics)
- **Pattern**: Role-Play & Narrative (Immersive food truck / bistro simulator)
- **Bloom's Taxonomy Level**: Application and Analysis

## 4. Game Elements & Mechanics
- **Time-Based Challenges**: Customers leave if not served within 45 seconds, adding urgency and pressure to speak quickly.
- **Achievement Badges**: Unlock "Polite Patron" (using 'please' 5 times), "Master Chef" (serving 10 plates correctly).
- **Feedback System**: Instant text and emoji feedback indicating whether the grammar was polite and the item order was correct.

## 5. UI/UX & Art Style
- **Visual Palette**: Pixar Vibrant (Teal #00BCD4, Orange #FF9800, Violet #673AB7)
- **Typography**: Modern Rounded (Prompt / Kanit font pairings)
- **Illustration Style**: 3D-styled Pixar Cartoons
- **Language**: English with Thai helper tooltips (EN/TH)

## 6. Development & Implementation Plan
- **Production Level**: Polished with native WebGL/Canvas styling.
- **Technology Stack**: HTML5 Canvas, Tailwind CSS, GSAP for smooth animations, and Howler.js for interactive audio feedbacks.`
  },
  {
    id: 'default-2',
    title: 'Math Space Fraction Odyssey 🚀',
    description: 'เกมตะลุยอวกาศและแก้ปริศนาเศษส่วนเพื่อผ่านด่านและปลดล็อกชิ้นส่วนยานอวกาศ',
    teacherName: 'ครูอารี',
    subject: 'Mathematics',
    topic: 'Fractions & Equivalence',
    createdAt: '2026-07-21T02:30:00Z',
    config: {
      ...DEFAULT_CONFIG,
      teacherName: 'ครูอารี',
      subject: 'Mathematics',
      topic: 'Fractions & Equivalence',
      gamePattern: 'Puzzle & Challenge',
      colorPalette: 'Ocean Blue',
      gameElements: ['Leaderboard', 'Difficulty Levels', 'Time-Based Challenges'],
      targetSkills: ['Problem Solving (การแก้โจทย์)', 'Logical Reasoning (ตรรกศาสตร์)']
    },
    generatedPrompt: `# Educational Game Design Specification - Fraction Space Odyssey

## 1. Teacher & Course Context
- **Teacher Name**: ครูอารี
- **Subject**: Mathematics
- **Topic**: Fractions & Equivalent Fractions
- **Learner Level**: Grade 5 - Intermediate (CEFR B1 Equivalent) | 30 Students
- **Learning Styles**: Visual, Logical-Mathematical

## 2. Learning Strategies & Objectives
- **Primary Goal**: Students develop an intuitive understanding of equivalent fractions and fraction addition.
- **Sub-objectives**:
  1. Identify equal fractional regions visually.
  2. Simplify fractions to their lowest terms.
  3. Compare fractions with different denominators.
- **Core Game Loop**:
  - Steer the spaceship -> Analyze fraction energy nodes -> Select equivalent values to absorb energy -> Maintain flight speed.

## 3. Game Pattern & Architecture
- **Pattern**: Puzzle & Challenge (Space Odyssey)
- **Bloom's Taxonomy**: Analyze & Apply (HOTS)

## 4. Game Elements & Mechanics
- **Difficulty Levels**: Dynamic scaling from simple shapes (1/2, 2/4) to complex equations.
- **Time-Based Challenges**: Complete calculations before fuel runs out.
- **Feedback System**: Clear visual animation of fraction pies merging.

## 5. UI/UX & Art Style
- **Palette**: Ocean Blue (Deep cosmic space blue and cyan accent)
- **Typography**: Space-tech mono and modern rounded fonts
- **Technology**: Polished CSS3/Tailwind, Web Audio API, Canvas particle effects.`
  }
];

export const TRANSLATIONS = {
  th: {
    appName: 'PRISM Game Architect',
    tagline: 'ENGINE 02 · LM-GM FRAMEWORK',
    titleMain: 'Game',
    titleAccent: 'Architect',
    description: 'ออกแบบเกมจริงจังสำหรับการสอนในรายวิชาต่าง ๆ ทีละขั้นตอน — ตามกรอบ LM-GM (Arnab et al., 2015)',
    backBtn: '← ก่อนหน้า',
    nextBtn: 'ถัดไป →',
    createPromptBtn: 'สร้าง AI Prompt ✦',
    step1: 'บริบท',
    'step1.5': 'ลำดับเนื้อหา',
    step2: 'กลยุทธ์',
    step3: 'รูปแบบ',
    step4: 'องค์ประกอบ',
    step5: 'ดีไซน์',
    step6: 'เอฟเฟกต์',
    step7: 'ทบทวน',
    step8: 'PROMPT',
    stepTitle1: 'บริบทครูและวิชา',
    'stepTitle1.5': 'ลำดับการเรียนรู้และระดับในเกม',
    stepTitle2: 'กลยุทธ์เกมและวัตถุประสงค์',
    stepTitle3: 'เลือกรูปแบบเกม',
    stepTitle4: 'องค์ประกอบของเกม',
    stepTitle5: 'การออกแบบ UI และสไตล์ภาพ',
    stepTitle6: 'เอฟเฟกต์ภาพและเทคโนโลยี',
    stepTitle7: 'การตรวจสอบและทบทวน',
    stepTitle8: 'Prompt AI ที่สมบูรณ์',
    subTitle1: 'บอกเราเกี่ยวกับสภาพแวดล้อมการสอนและวัตถุประสงค์การเรียนรู้ของคุณ',
    'subTitle1.5': 'กำหนดลำดับเนื้อหาหรือด่านในเกมเพื่อเป็นแนวทางการเรียนรู้อย่างเป็นขั้นตอนสู่เป้าหมายหลัก (ลากและวางหรือใช้ปุ่มปรับเพื่อสลับลำดับความยากง่ายได้)',
    subTitle2: 'กำหนดเป้าหมายการเรียนรู้และกลไกเกมของคุณ',
    subTitle3: 'เลือกรูปแบบเกมที่เหมาะสมกับวัตถุประสงค์การเรียนรู้ของคุณ',
    subTitle4: 'เลือกองค์ประกอบของเกมที่จะรวม',
    subTitle5: 'เลือกจานสีและการออกแบบภาพของคุณ',
    subTitle6: 'เลือกความตระการตาของเกม — เลือกระดับการผลิต แล้วเพิ่มลูกเล่นเสริม',
    subTitle7: 'ทบทวนการออกแบบเกมของคุณก่อนสร้าง prompt',
    subTitle8: 'คัดลอก prompt นี้ไปยัง Claude, Gemini หรือ ChatGPT เพื่อสร้างเกมที่สมบูรณ์ของคุณ',
    teacherNameLabel: 'ชื่อครู',
    avatarLabel: 'รูปประจำตัวครูผู้สอน / ดีไซเนอร์',
    avatarUpload: 'อัปโหลดภาพ (ลากวางหรือคลิก)',
    avatarSelect: 'เลือกอวตาร์ของฉัน',
    subjectLabel: 'ชื่อวิชา',
    customSubjectPlaceholder: 'ระบุวิชาของคุณ...',
    topicLabel: 'หัวข้อการสอน / บทเรียน',
    cefrLabel: 'ระดับผู้เรียน / CEFR',
    studentsCountLabel: 'จำนวนนักเรียน',
    learningStylesLabel: 'รูปแบบการเรียนรู้ของนักเรียน',
    targetSkillsLabel: 'ทักษะเป้าหมายที่ต้องการพัฒนา',
    coreCompetenciesLabel: 'สมรรถนะสำคัญของผู้เรียน (หลักสูตรแกนกลาง)',
    skills3r8cLabel: 'ทักษะศตวรรษที่ 21 (3R x 8C)',
    conceptSummaryLabel: 'สาระสำคัญ (แนวคิดหลักของบทเรียน)',
    conceptSummaryPlaceholder: 'ระบุแนวคิดหลักหรือหัวใจสำคัญของเรื่องที่นักเรียนต้องเรียนรู้และเข้าใจในคาบเรียนนั้น...',
    primaryGoalLabel: 'เป้าหมายการเรียนรู้วัตถุประสงค์หลัก',
    subObjectivesLabel: 'วัตถุประสงค์ย่อย (คั่นด้วยจุลภาค)',
    coreActionsLabel: 'การกระทำหลักของเกม (คั่นด้วยจุลภาค)',
    bloomLevel: 'ระดับ Bloom',
    paletteLabel: 'จานสี',
    typographyLabel: 'ตัวอักษร',
    visualStyleLabel: 'สไตล์ภาพ',
    animationsLabel: 'ภาพเคลื่อนไหว',
    gameLanguageLabel: 'ภาษาของเกม',
    productionLevelLabel: 'ระดับการผลิต',
    addonsLabel: 'ลูกเล่นภาพและเสียงเสริม (เลือกได้)',
    layoutDensityLabel: 'ความหนาแน่นของเลย์เอาต์ (Layout Density / Compact Mode)',
    layoutComfortable: 'สบายตา (Comfortable - ขยายระยะห่าง)',
    layoutStandard: 'มาตรฐาน (Standard - ดีต่อสายนารีทั่วไป)',
    layoutCompact: 'กะทัดรัด (Compact - ลดระยะห่างเพื่อให้อ่านจบในหน้าเดียว)',
    reviewSubjectInfo: 'ข้อมูลวิชาและบริบท',
    reviewGoalsInfo: 'เป้าหมายและกลยุทธ์การเรียนรู้',
    reviewDesignInfo: 'รายละเอียดการดีไซน์และเทคโนโลยี',
    copySuccess: 'คัดลอก Prompt สำเร็จแล้ว!',
    downloadSuccess: 'ดาวน์โหลดไฟล์ .txt สำเร็จ!',
    aiEnhanceHeader: '✦ ยกระดับด้วย AI — prompt พร้อมใช้งานจริง',
    aiEnhanceDesc: 'PRISM จะขยายข้อกำหนดของคุณเป็น prompt แบบละเอียดพร้อมใช้จริง: ตรรกเกม, ลำดับหน้าจอ, กติกาคะแนน และการเชื่อมโยงทฤษฎีเกม',
    aiEnhanceBtn: 'ยกระดับ prompt ของฉัน 🪄',
    aiCustomPlaceholder: 'ปรับแต่งเพิ่มเติม: เช่น เปลี่ยนเป็นธีมผจญภัยอวกาศ, เพิ่มบอสทุก 5 ข้อ...',
    aiCustomBtn: 'ปรับแต่ง',
    nextStepHeader: 'ขั้นตอนถัดไป',
    nextStep1: '1. คัดลอก prompt ด้านบน (เวอร์ชันยกระดับจะช่วยให้ AI เข้าใจดีที่สุด)',
    nextStep2: '2. เปิด claude.ai (Artifacts), gemini.google.com (Canvas) หรือ ChatGPT',
    nextStep3: '3. วาง prompt ในข้อความเดียวแล้วกดส่งเพื่อให้ AI เขียนแอปเกมของคุณให้ทันที',
    nextStep4: '4. ทดสอบความถูกต้องของคำศัพท์และตรรกะเกม จากนั้นสั่งปรับแต่งเพิ่มเติมได้ตามต้องการ',
    communityHubTitle: 'คลัง Prompt เกมศึกษา',
    communityHubDesc: 'แชร์แรงบันดาลใจและแบ่งปันไอเดียกับผู้สอนคนอื่น ๆ ทั่วประเทศ',
    savedPromptsTab: 'Saved Prompts (ของฉัน)',
    publicPromptsTab: 'Public Library (คลังสาธารณะ)',
    saveToLibraryBtn: '💾 บันทึก Prompt นี้',
    shareToPublicBtn: '🌐 แชร์ไปคลังสาธารณะ',
    saveModalTitle: 'บันทึก Prompt ของคุณ',
    shareModalTitle: 'แชร์ไปที่คลังสาธารณะ',
    promptTitleLabel: 'ชื่อสั้นจำง่ายสำหรับเกมของคุณ',
    promptDescLabel: 'คำอธิบายสั้น ๆ (เช่น เกมจำลองทำฟาร์มคูณเลข)',
    cancelBtn: 'ยกเลิก',
    confirmSaveBtn: 'บันทึก',
    confirmShareBtn: 'แชร์เลย',
    loadTemplateSuccess: 'โหลดเทมเพลตเรียบร้อยแล้ว!',
    loadedFromShare: '🚀 โหลดรายละเอียดโปรเจกต์จากลิงก์แชร์เรียบร้อยแล้ว!',
    myApiKeyLabel: 'API Key ของฉัน',
    apiKeyDesc: 'ใช้ API Key ของคุณเพื่อทดสอบยกระดับ prompt ด้วยโมเดล Gemini 3.5 Flash',
    apiKeyPlaceholder: 'ใส่ Gemini API Key (หากมี)',
    savedLocalSuccess: 'บันทึกเรียบร้อยแล้ว!',
    sharedGlobalSuccess: 'แชร์ลงคลังสาธารณะสำเร็จ!',
    useThisTemplateBtn: 'ใช้เทมเพลตนี้ 🛠️',
    recentHistoryTitle: 'ประวัติล่าสุด (Recent History)',
    recentHistoryDesc: 'บันทึกสูงสุด 5 เวอร์ชันล่าสุดที่คุณสร้างในเซสชันนี้ กดเพื่อดึงข้อมูลกลับคืนได้ทันที',
    historyEmpty: 'ไม่มีประวัติย้อนหลัง',
    historyEmptyDesc: 'ระบบจะจัดเก็บประวัติให้อัตโนมัติเมื่อคุณเข้าสู่ขั้นตอนที่ 8 (PROMPT)',
    historyBasicTag: 'พื้นฐาน',
    historyEnhancedTag: 'ยกระดับ AI',
    revertBtn: 'คืนค่า',
    starterTemplatesTitle: 'เทมเพลตเกมตั้งต้นสำหรับคุณครู (Starter Templates)',
    starterTemplatesDesc: 'เลือกโครงสร้างรูปแบบเกมยอดนิยมเพื่อจัดตั้งค่าพื้นฐานสำหรับห้องเรียนได้ทันที ช่วยลดเวลาการตั้งค่าและยึดโยงเป้าหมายการสอนอย่างสมบูรณ์แบบ',
    starterTemplateBadge: 'เทมเพลตตั้งต้น'
  },
  en: {
    appName: 'PRISM Game Architect',
    tagline: 'ENGINE 02 · LM-GM FRAMEWORK',
    titleMain: 'Game',
    titleAccent: 'Architect',
    description: 'Design Serious Educational Games step-by-step using the LM-GM Framework (Arnab et al., 2015)',
    backBtn: '← Back',
    nextBtn: 'Next →',
    createPromptBtn: 'Generate AI Prompt ✦',
    step1: 'Context',
    'step1.5': 'Sequence',
    step2: 'Strategy',
    step3: 'Pattern',
    step4: 'Elements',
    step5: 'Design',
    step6: 'Effects',
    step7: 'Review',
    step8: 'PROMPT',
    stepTitle1: 'Teacher & Subject Context',
    'stepTitle1.5': 'Curriculum Sequence & Levels',
    stepTitle2: 'Game Strategies & Objectives',
    stepTitle3: 'Select Game Pattern',
    stepTitle4: 'Core Game Elements',
    stepTitle5: 'UI Design & Visual Style',
    stepTitle6: 'Visual Effects & Tech Stack',
    stepTitle7: 'Review Game Design',
    stepTitle8: 'Complete AI Prompt',
    subTitle1: 'Tell us about your teaching environment and educational objectives.',
    'subTitle1.5': 'Define a logical flow of sub-topics or game levels to progressively build mastery towards the goal. Drag & drop or click buttons to rearrange.',
    subTitle2: 'Define the learning goals and mechanics of your game.',
    subTitle3: 'Choose a gameplay format best suited to your learning targets.',
    subTitle4: 'Select components to incorporate into your game design.',
    subTitle5: 'Choose your color theme and art styles.',
    subTitle6: 'Choose visual fidelity: select output production quality and add-ons.',
    subTitle7: 'Review your game architectural details before prompting.',
    subTitle8: 'Copy this prompt to Claude, Gemini, or ChatGPT to generate your complete educational game.',
    teacherNameLabel: "Teacher's Name",
    avatarLabel: 'Teacher / Designer Avatar',
    avatarUpload: 'Upload photo (drag & drop or click)',
    avatarSelect: 'Choose preset avatar',
    subjectLabel: 'Subject Name',
    customSubjectPlaceholder: 'Specify your subject...',
    topicLabel: 'Lesson Topic / Title',
    cefrLabel: 'Learner Level / CEFR',
    studentsCountLabel: 'Number of Students',
    learningStylesLabel: 'Student Learning Styles',
    targetSkillsLabel: 'Target Skills to Improve',
    coreCompetenciesLabel: 'Core Student Competencies (National Curriculum)',
    skills3r8cLabel: '21st Century Skills (3R x 8C)',
    conceptSummaryLabel: 'Core Concept Summary / Key Idea',
    conceptSummaryPlaceholder: 'Specify the core concept or key takeaway students must understand in this lesson...',
    primaryGoalLabel: 'Primary Learning Objective/Goal',
    subObjectivesLabel: 'Sub-objectives (comma-separated)',
    coreActionsLabel: 'Core Game Actions (comma-separated)',
    bloomLevel: "Bloom's Level",
    paletteLabel: 'Palette',
    typographyLabel: 'Typography',
    visualStyleLabel: 'Visual Style',
    animationsLabel: 'Animations',
    gameLanguageLabel: 'Game Language',
    productionLevelLabel: 'Production Level',
    addonsLabel: 'Visual & Sound Add-ons (Optional)',
    layoutDensityLabel: 'Layout Density / Compact Mode',
    layoutComfortable: 'Comfortable (Generous spacing)',
    layoutStandard: 'Standard (Default density)',
    layoutCompact: 'Compact (See more on screen without scrolling)',
    reviewSubjectInfo: 'Subject & Context Details',
    reviewGoalsInfo: 'Learning Objectives & Strategies',
    reviewDesignInfo: 'Visual Design & Technology',
    copySuccess: 'Prompt copied successfully!',
    downloadSuccess: 'Downloaded .txt file successfully!',
    aiEnhanceHeader: '✦ Upgrade with AI — Fully Usable Prompt',
    aiEnhanceDesc: 'PRISM expands your parameters into a highly-detailed system prompt covering game logic, screens, scoring, accessibility, and LM-GM mapping.',
    aiEnhanceBtn: 'Enhance My Prompt 🪄',
    aiCustomPlaceholder: 'Customize further: e.g., make it space exploration, add boss level every 5 questions...',
    aiCustomBtn: 'Customize',
    nextStepHeader: 'Next Steps',
    nextStep1: '1. Copy the prompt above (the enhanced version works best)',
    nextStep2: '2. Open claude.ai (with Artifacts), gemini.google.com (Canvas), or ChatGPT',
    nextStep3: '3. Paste the prompt in a single turn and watch the AI build your game instantly',
    nextStep4: '4. Test vocabularies and game loops, then prompt with follow-up instructions',
    communityHubTitle: 'Educational Game Prompt Hub',
    communityHubDesc: 'Share inspirations and exchange ready-made game prompts with teachers nationwide.',
    savedPromptsTab: 'My Saved Prompts',
    publicPromptsTab: 'Public Prompt Library',
    saveToLibraryBtn: '💾 Save Prompt',
    shareToPublicBtn: '🌐 Share to Public Hub',
    saveModalTitle: 'Save Your Prompt',
    shareModalTitle: 'Share to Public Library',
    promptTitleLabel: 'Game Name / Short Title',
    promptDescLabel: 'Short Description (e.g. Multiplication Farm simulator)',
    cancelBtn: 'Cancel',
    confirmSaveBtn: 'Save',
    confirmShareBtn: 'Share Now',
    loadTemplateSuccess: 'Template loaded successfully!',
    loadedFromShare: '🚀 Loaded project configurations from share link successfully!',
    myApiKeyLabel: 'My API Key',
    apiKeyDesc: 'Provide your custom Gemini API key to run client-side prompt enhancement via Gemini 3.5 Flash.',
    apiKeyPlaceholder: 'Enter Gemini API Key (optional)',
    savedLocalSuccess: 'Saved successfully!',
    sharedGlobalSuccess: 'Shared to Public Library successfully!',
    useThisTemplateBtn: 'Use Template 🛠_',
    recentHistoryTitle: 'Recent History',
    recentHistoryDesc: 'Saves up to 5 of your latest prompt versions generated this session. Revert configuration instantly.',
    historyEmpty: 'No history yet',
    historyEmptyDesc: 'History will be saved automatically when you complete Step 8 (PROMPT).',
    historyBasicTag: 'Basic',
    historyEnhancedTag: 'AI Enhanced',
    revertBtn: 'Revert',
    starterTemplatesTitle: 'Teacher Starter Templates',
    starterTemplatesDesc: 'Fast-track your design by selecting a popular educational game preset. Pre-populates contextual configurations instantly.',
    starterTemplateBadge: 'Starter Template'
  }
};

export const STARTER_TEMPLATES = [
  {
    id: 'math-escape',
    titleTh: 'ห้องปริศนาคณิตศาสตร์และตรรกะ',
    titleEn: 'Math Logic Escape Room',
    descTh: 'เกมไขรหัสถอดสลักและปริศนาคณิตศาสตร์เพื่อเปิดประตูทางผ่าน เหมาะสำหรับฝึกการคิดคำนวณและตรรกศาสตร์ขั้นสูง',
    descEn: 'Crack number codes and solve mathematical puzzles to unlock exit doors. Ideal for calculation and advanced logic.',
    emoji: '🧩',
    config: {
      teacherName: 'ครูธัญญ์',
      subject: 'Mathematics',
      customSubject: '',
      topic: 'fractions-and-decimals',
      cefrLevel: 'A2 - Elementary',
      studentsCount: 30,
      learningStyles: ['Logical', 'Visual'],
      targetSkills: ['Calculation (การคำนวณ)', 'Logical Reasoning (ตรรกศาสตร์)', 'Problem Solving (การแก้โจทย์)'],
      coreCompetencies: ['Thinking', 'ProblemSolving'],
      skills3r8c: ['3R-Arithmetics', '8C-CriticalThinking'],
      conceptSummary: 'การทำความเข้าใจความสัมพันธ์และการแปลงค่าระหว่างเศษส่วนและทศนิยมผ่านโจทย์ปัญหาในชีวิตประจำวัน เช่น การแบ่งสิ่งของ การวัดขนาด และการคำนวณสัดส่วน',
      primaryGoal: 'นักเรียนสามารถแก้สมการ เปรียบเทียบ และแปลงค่าระหว่างเศษส่วนกับทศนิยมได้อย่างถูกต้องเพื่อปลดรหัสผ่านด่านต่างๆ',
      subObjectives: 'วิเคราะห์สัดส่วนเศษส่วน, แปลงเศษส่วนเป็นทศนิยมและกลับกัน, ทำงานร่วมกันคิดแก้ปัญหากลุ่มในเวลาจำกัด',
      coreActions: 'ถอดรหัสเซฟตัวเลข, แลกเปลี่ยนเบาะแสเศษส่วนกับเพื่อน, ปลดล็อกห้องปริศนา 4 ด่าน, ทำภารกิจย่อยแข่งขันชิงแสตมป์คะแนน',
      gamePattern: 'Puzzle & Challenge',
      gameElements: ['Leaderboard', 'Quest System', 'Feedback System', 'Timer & Countdown'],
      colorPalette: 'Ocean Blue',
      typography: 'Modern Rounded',
      visualStyle: 'Sci-Fi Clean',
      animations: 'Smooth & Bouncy',
      gameLanguage: 'EN/TH',
      productionLevel: 'Polished',
      addons: ['Pro smooth animations', 'Custom game fonts']
    }
  },
  {
    id: 'english-cafe',
    titleTh: 'คาเฟ่บทบาทสมมติภาษาอังกฤษ',
    titleEn: 'English Cafe Role-Play',
    descTh: 'เกมบทบาทสมมติเพื่อพัฒนาทักษะการสั่งอาหาร การบริการลูกค้า และการสื่อสารอย่างสุภาพในสถานการณ์จำลองร้านอาหารจริง',
    descEn: 'Adopt customer or staff roles to practice polite ordering, real-time responses, and situational English in a cafe.',
    emoji: '☕',
    config: {
      teacherName: 'ครูมณีกานต์',
      subject: 'English',
      customSubject: '',
      topic: 'ordering-at-cafe',
      cefrLevel: 'B1 - Intermediate',
      studentsCount: 25,
      learningStyles: ['Kinesthetic', 'Social/Verbal'],
      targetSkills: ['Vocabulary', 'Speaking', 'Grammar'],
      coreCompetencies: ['Communication', 'LifeSkills'],
      skills3r8c: ['3R-Reading', '8C-Collaboration', '8C-Communication'],
      conceptSummary: 'การพัฒนาทักษะการสนทนาโต้ตอบแบบทันทีในสถานการณ์จำลองร้านอาหาร สั่งเครื่องดื่ม เบเกอรี่ และการใช้โครงสร้างประโยคขอร้องและประเมินระดับความสุภาพ (Polite Expressions)',
      primaryGoal: 'นักเรียนสามารถสั่งอาหารและรับออร์เดอร์ภาษาอังกฤษด้วยประโยคที่สุภาพและเหมาะสมตามวัฒนธรรมได้อย่างมั่นใจ',
      subObjectives: 'จดจำและออกเสียงคำศัพท์อาหารประเภทต่าง ๆ ได้ถูกต้อง, ใช้โครงสร้างประโยค I would like... และ Could I have... ได้คล่องแคล่ว, ตอบสนองต่อสถานการณ์ไม่คาดฝันได้เหมาะสม',
      coreActions: 'เลือกเมนูเครื่องดื่มและอาหาร, แสดงบทบาทสมมติเป็นแคชเชียร์หรือลูกค้า, เก็บสะสมทิปจากคะแนนความพอใจ, สุ่มเจอการ์ดเหตุการณ์พิเศษสุดป่วน',
      gamePattern: 'Role-Play & Narrative',
      gameElements: ['Feedback System', 'Achievement Badges', 'Custom Currencies', 'Avatar Customization'],
      colorPalette: 'Pixar Vibrant',
      typography: 'Playful Handdrawn',
      visualStyle: 'Pixar Cartoon',
      animations: 'Smooth & Bouncy',
      gameLanguage: 'EN/TH',
      productionLevel: 'Polished',
      addons: ['Pro smooth animations', 'Sound effects & music']
    }
  },
  {
    id: 'science-sim',
    titleTh: 'แล็บทดลองสารเคมีจำลอง',
    titleEn: 'Science Lab Safety Simulator',
    descTh: 'จำลองห้องปฏิบัติการเคมีเพื่อจำแนกสัญลักษณ์ความปลอดภัย และเรียนรู้ปฏิกิริยาเคมีจากการสลับรวมสารสารพัดประเภท',
    descEn: 'Identify hazard icons and simulate safe chemical mixing under precise heat and pressure controls to observe reactions.',
    emoji: '🧪',
    config: {
      teacherName: 'ครูสิรินทร์',
      subject: 'Science',
      customSubject: '',
      topic: 'lab-safety-chemical-reactions',
      cefrLevel: 'B2 - Upper Intermediate',
      studentsCount: 32,
      learningStyles: ['Kinesthetic', 'Visual'],
      targetSkills: ['Scientific Inquiry (การสืบเสาะ)', 'Hypothesis Testing (การตั้งสมมติฐาน)', 'Observation (การสังเกต)'],
      coreCompetencies: ['Thinking', 'ProblemSolving', 'Technology'],
      skills3r8c: ['8C-CriticalThinking', '8C-Computing'],
      conceptSummary: 'การรักษากฎความปลอดภัยในห้องปฏิบัติการเคมี การระบุชนิดของสารอันตราย และปฏิกิริยาการรวมตัว/สลายตัวของสารเบื้องต้นภายใต้การควบคุมอุณหภูมิ',
      primaryGoal: 'นักเรียนสามารถจำแนกสัญลักษณ์เตือนภัยและทดลองผสมสารเคมีในระบบจำลองเพื่อเรียนรู้ปฏิกิริยาเคมีได้อย่างปลอดภัย',
      subObjectives: 'จำแนกสัญลักษณ์เตือนความปลอดภัยบนขวดสารเคมี, ออกแบบชุดผสมสารควบคุมอุณหภูมิ, วางแผนแก้ไขปัญหาแก๊สรั่วและอุบัติเหตุจำลอง',
      coreActions: 'สลับสับเปลี่ยนหลอดทดลองเคมี, หมุนปรับแรงดันท่อส่งแก๊ส, ผสมสารเพื่อเปลี่ยนสีฟองอากาศ, ตรวจสอบความถูกต้องผ่านเครื่องสแกนสถิติ',
      gamePattern: 'Simulation & Practice',
      gameElements: ['Progress Bars', 'Feedback System', 'Quest System', 'Sound FX and Alert Indicator'],
      colorPalette: 'Forest Green',
      typography: 'Modern Rounded',
      visualStyle: 'Cyberpunk Tech',
      animations: 'Minimal & Clean',
      gameLanguage: 'EN/TH',
      productionLevel: 'Polished',
      addons: ['Sound effects & music', 'Pro smooth animations']
    }
  },
  {
    id: 'egypt-trivia',
    titleTh: 'สำรวจสุสานอียิปต์โบราณ',
    titleEn: 'Ancient Egypt History Trivia',
    descTh: 'เกมผจญภัยสำรวจประวัติศาสตร์ วัฒนธรรมอียิปต์ ค้นหารหัสผ่านอักษรเฮียโรกลิฟิก และวิเคราะห์แผนภูมิลุ่มแม่น้ำไนล์',
    descEn: 'Quiz combat and historic map exploration. Crack Egyptian hieroglyphs and study Nile river geographical advantages.',
    emoji: '🏺',
    config: {
      teacherName: 'ครูพงศธร',
      subject: 'Social Studies',
      customSubject: '',
      topic: 'ancient-egyptian-civilization',
      cefrLevel: 'B1 - Intermediate',
      studentsCount: 30,
      learningStyles: ['Visual', 'Auditory'],
      targetSkills: ['Critical Thinking (การคิดวิเคราะห์)', 'History & Time (ประวัติศาสตร์)', 'Geography (ภูมิศาสตร์)'],
      coreCompetencies: ['Thinking', 'LifeSkills'],
      skills3r8c: ['3R-Reading', '8C-CrossCultural'],
      conceptSummary: 'การเรียนรู้อารยธรรมโบราณลุ่มแม่น้ำไนล์ สถาปัตยกรรมพีระมิด ความเชื่อเรื่องโลกหลังความตาย และความสำคัญของการค้าและการชลประทานโบราณ',
      primaryGoal: 'นักเรียนเรียนรู้ประวัติศาสตร์ วัฒนธรรม และอักษรภาพเฮียโรกลิฟิกจำลองผ่านการตอบคำถามแข่งขันและไขปริศนาอารยธรรม',
      subObjectives: 'เรียงลำดับเวลาเหตุการณ์สำคัญของอียิปต์โบราณได้ถูกต้อง, แปลความหมายอักษรภาพสัญลักษณ์เบื้องต้น, อธิบายความเกี่ยวข้องของแม่น้ำไนล์กับการกสิกรรม',
      coreActions: 'หมุนวงล้ออารยธรรมตอบควิซดวลบอสประจำด่าน, ทายภาพปริศนาอักษรเฮียโรกลิฟิก, สะสมชิ้นส่วนสมบัติอาร์ติแฟกต์โบราณ, เปิดแผนที่เดินสำรวจตามเข็มทิศ',
      gamePattern: 'Progression & Mastery',
      gameElements: ['Progress Bars', 'Achievement Badges', 'Leaderboard', 'Item Inventory'],
      colorPalette: 'Sunset Warm',
      typography: 'Elegant Serif',
      visualStyle: 'Medieval Fantasy',
      animations: 'Minimal & Clean',
      gameLanguage: 'EN/TH',
      productionLevel: 'Polished',
      addons: ['Custom game fonts', 'Pro smooth animations']
    }
  }
];
