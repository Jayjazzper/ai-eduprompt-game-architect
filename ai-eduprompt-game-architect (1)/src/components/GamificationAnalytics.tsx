import React, { useMemo, useState } from 'react';
import { 
  Award, Flame, Layers, Users, Clock, MessageSquare, 
  TrendingUp, Sparkles, AlertTriangle, CheckCircle2, 
  HelpCircle, Lightbulb, Zap, RefreshCw, BarChart3, Info
} from 'lucide-react';
import { GamePromptConfig } from '../types';

interface GamificationAnalyticsProps {
  config: GamePromptConfig;
  onChangeConfig?: (updatedConfig: GamePromptConfig) => void;
  lang: 'th' | 'en';
  onSandboxExplore?: () => void;
}

export default function GamificationAnalytics({ config, onChangeConfig, lang, onSandboxExplore }: GamificationAnalyticsProps) {

  const [sandboxMode, setSandboxMode] = useState(false);
  const [sandboxElements, setSandboxElements] = useState<string[]>(config.gameElements);
  const [sandboxPattern, setSandboxPattern] = useState<string>(config.gamePattern);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  // Sync sandbox with real config if not in sandbox mode
  const activeElements = sandboxMode ? sandboxElements : config.gameElements;
  const activePattern = sandboxMode ? sandboxPattern : config.gamePattern;

  // 1. Calculate Real-Time Metrics & Score
  const metrics = useMemo(() => {
    // A: Pillar Calculations (out of 100 each)
    
    // Pillar 1: Challenge & Focus (Competitiveness)
    // Points from: Leaderboard, Time-Based Challenges, Difficulty Levels, Puzzle & Challenge pattern, Simulation & Practice pattern
    let challengeScore = 20; // base
    if (activeElements.includes('Leaderboard')) challengeScore += 25;
    if (activeElements.includes('Time-Based Challenges')) challengeScore += 25;
    if (activeElements.includes('Difficulty Levels')) challengeScore += 15;
    if (activePattern === 'Puzzle & Challenge') challengeScore += 15;
    if (activePattern === 'Simulation & Practice') challengeScore += 10;
    challengeScore = Math.min(100, challengeScore);

    // Pillar 2: Progression & Autonomy
    // Points from: Achievement Badges, Difficulty Levels, Progression & Mastery pattern, curriculum sequence length
    let progressionScore = 20; // base
    if (activeElements.includes('Achievement Badges')) progressionScore += 30;
    if (activeElements.includes('Difficulty Levels')) progressionScore += 20;
    if (activePattern === 'Progression & Mastery') progressionScore += 20;
    const levelCount = config.curriculumSequence?.length || 0;
    if (levelCount > 0) {
      progressionScore += Math.min(10, levelCount * 3) + 10;
    }
    progressionScore = Math.min(100, progressionScore);

    // Pillar 3: Social & Story Connection (Relatedness)
    // Points from: Multiplayer Mode, Role-Play & Narrative pattern, learning styles containing Auditory or Kinesthetic
    let socialScore = 15; // base
    if (activeElements.includes('Multiplayer Mode')) socialScore += 40;
    if (activePattern === 'Role-Play & Narrative') socialScore += 30;
    if (config.learningStyles.includes('Kinesthetic')) socialScore += 10;
    if (config.learningStyles.includes('Auditory')) socialScore += 5;
    socialScore = Math.min(100, socialScore);

    // Pillar 4: Immediate Feedback & Sound
    // Points from: Feedback System, addons (like Sound FX, etc.)
    let feedbackScore = 25; // base
    if (activeElements.includes('Feedback System')) feedbackScore += 45;
    if (config.addons?.some(a => a.toLowerCase().includes('sound') || a.toLowerCase().includes('music'))) {
      feedbackScore += 20;
    }
    if (activePattern === 'Simulation & Practice') feedbackScore += 10;
    feedbackScore = Math.min(100, feedbackScore);

    // B: Total Weighted Engagement Score (0-100)
    // Weights: Challenge (25%), Progression (30%), Social (25%), Feedback (20%)
    const weightedScore = Math.round(
      challengeScore * 0.25 + 
      progressionScore * 0.30 + 
      socialScore * 0.25 + 
      feedbackScore * 0.20
    );

    // C: Learning Styles Compatibility Ratings (0-100)
    const styleCompatibility = {
      Visual: Math.round(
        (activeElements.includes('Leaderboard') ? 30 : 0) +
        (activeElements.includes('Achievement Badges') ? 30 : 0) +
        (config.visualStyle ? 25 : 10) +
        (config.learningStyles.includes('Visual') ? 15 : 0)
      ),
      Auditory: Math.round(
        (config.addons?.some(a => a.toLowerCase().includes('sound') || a.toLowerCase().includes('music')) ? 50 : 10) +
        (activePattern === 'Role-Play & Narrative' ? 30 : 10) +
        (config.learningStyles.includes('Auditory') ? 20 : 0)
      ),
      Kinesthetic: Math.round(
        (activeElements.includes('Time-Based Challenges') ? 25 : 0) +
        (activeElements.includes('Multiplayer Mode') ? 35 : 0) +
        (activePattern === 'Simulation & Practice' ? 25 : 10) +
        (config.learningStyles.includes('Kinesthetic') ? 15 : 0)
      ),
      ReadWrite: Math.round(
        (activePattern === 'Puzzle & Challenge' ? 40 : 15) +
        (config.curriculumSequence && config.curriculumSequence.length > 0 ? 30 : 10) +
        (config.learningStyles.includes('Read/Write') ? 30 : 0)
      )
    };

    // Ensure style caps at 100
    styleCompatibility.Visual = Math.min(100, styleCompatibility.Visual);
    styleCompatibility.Auditory = Math.min(100, styleCompatibility.Auditory);
    styleCompatibility.Kinesthetic = Math.min(100, styleCompatibility.Kinesthetic);
    styleCompatibility.ReadWrite = Math.min(100, styleCompatibility.ReadWrite);

    return {
      challengeScore,
      progressionScore,
      socialScore,
      feedbackScore,
      weightedScore,
      styleCompatibility
    };
  }, [activeElements, activePattern, config.curriculumSequence, config.learningStyles, config.addons, config.visualStyle, sandboxMode]);

  // Determine Grade / Level of engagement
  const { grade, description, colorClass, borderClass, bgLightClass } = useMemo(() => {
    const score = metrics.weightedScore;
    if (score >= 90) {
      return {
        grade: lang === 'th' ? 'ระดับ S (ยอดเยี่ยมที่สุด)' : 'S-Tier (Hyper-Engaged)',
        description: lang === 'th' 
          ? 'เกมระบบพรอมต์แชท AI มีการผสมผสานกลไกจูงใจที่สมดุลและทรงพลังอย่างยิ่ง นักเรียนจะจดจ่อและเพลิดเพลินได้ยาวนาน!' 
          : 'Outstanding gamification loop. High level of intrinsic and extrinsic drive elements. Perfect balance!',
        colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        borderClass: 'border-emerald-500',
        bgLightClass: 'bg-emerald-50/30'
      };
    } else if (score >= 75) {
      return {
        grade: lang === 'th' ? 'ระดับ A (มีส่วนร่วมสูง)' : 'A-Tier (Highly Engaging)',
        description: lang === 'th' 
          ? 'กลไกเกมน่าสนใจและครอบคลุมความหลากหลายได้ดี มีระบบกระตุ้นและแรงจูงใจที่ชัดเจน' 
          : 'Very solid design. Students will feel clear goals and meaningful choices. Great pedagogical alignment.',
        colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-150',
        borderClass: 'border-indigo-500',
        bgLightClass: 'bg-indigo-50/20'
      };
    } else if (score >= 50) {
      return {
        grade: lang === 'th' ? 'ระดับ B (ระดับมาตรฐาน)' : 'B-Tier (Moderately Active)',
        description: lang === 'th' 
          ? 'เกมทำงานได้ดีแต่อาจขาดความท้าทายหรือโจทย์สังคมไปบ้าง ลองเพิ่มโหมดแข่งขันหรือด่านเวลาเพื่อความมันส์' 
          : 'Good foundations but has room for more spark. Consider adding multiplayer features or time pressure.',
        colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
        borderClass: 'border-amber-500',
        bgLightClass: 'bg-amber-50/20'
      };
    } else {
      return {
        grade: lang === 'th' ? 'ระดับ C (เริ่มต้นสร้างแรงขับ)' : 'C-Tier (Casual Gamification)',
        description: lang === 'th' 
          ? 'ระบบมีองค์ประกอบเกมเบื้องต้นเท่านั้น เหมาะสำหรับบทเรียนสั้น ๆ แต่อาจไม่สามารถตรึงความสนใจในระยะยาวได้' 
          : 'Minimal gamified elements. Works fine for quick drills, but might fail to retain focus during longer periods.',
        colorClass: 'text-rose-600 bg-rose-50 border-rose-200',
        borderClass: 'border-rose-500',
        bgLightClass: 'bg-rose-50/10'
      };
    }
  }, [metrics.weightedScore, lang]);

  // Dynamic recommendations based on what's missing
  const recommendations = useMemo(() => {
    const list = [];
    
    if (!activeElements.includes('Feedback System')) {
      list.push({
        elementId: 'Feedback System',
        icon: MessageSquare,
        textTh: 'เพิ่ม ระบบข้อมูลย้อนกลับ (Feedback System) เพื่อลดภาระทางปัญญาและให้คำใบ้เมื่อติดขัด',
        textEn: 'Add Feedback System to give immediate visual/audio guide for corrections (+15 pts)',
        impact: '+15'
      });
    }
    if (!activeElements.includes('Difficulty Levels')) {
      list.push({
        elementId: 'Difficulty Levels',
        icon: Layers,
        textTh: 'เพิ่ม ระดับความยาก (Difficulty Levels) เพื่อรักษาสภาวะลื่นไหล (Flow State) ไม่ให้น่าเบื่อเกินไป',
        textEn: 'Add Difficulty Levels to sustain students Flow State and challenge progression (+12 pts)',
        impact: '+12'
      });
    }
    if (!activeElements.includes('Multiplayer Mode')) {
      list.push({
        elementId: 'Multiplayer Mode',
        icon: Users,
        textTh: 'เปิด โหมดหลายผู้เล่น (Multiplayer Mode) เพื่อสร้างความร่วมมือและการทลายกำแพงความเงียบเหงา',
        textEn: 'Enable Multiplayer Mode to foster team cooperation and healthy classroom rivalry (+15 pts)',
        impact: '+15'
      });
    }
    if (!activeElements.includes('Achievement Badges')) {
      list.push({
        elementId: 'Achievement Badges',
        icon: Flame,
        textTh: 'เพิ่ม เหรียญรางวัลความเชี่ยวชาญ (Achievement Badges) เพื่อแสดงพัฒนาการอย่างเป็นรูปธรรม',
        textEn: 'Incorporate Achievement Badges to offer a sense of aesthetic competence and mastery (+10 pts)',
        impact: '+10'
      });
    }
    if (!activeElements.includes('Leaderboard')) {
      list.push({
        elementId: 'Leaderboard',
        icon: Award,
        textTh: 'เปิด อันดับคะแนน (Leaderboard) เพื่อเพิ่มแรงจูงใจภายนอกและการแข่งขันเชิงบวก',
        textEn: 'Implement Leaderboards to satisfy status and competitive social comparisons (+10 pts)',
        impact: '+10'
      });
    }
    if (!activeElements.includes('Time-Based Challenges')) {
      list.push({
        elementId: 'Time-Based Challenges',
        icon: Clock,
        textTh: 'เพิ่ม การท้าทายตามเวลา (Time-Based Challenges) เพื่อสร้างความตื่นเต้นตื่นตัวในคาบเรียน',
        textEn: 'Add Time-Based Challenges to raise excitement, focus, and playful urgency (+10 pts)',
        impact: '+10'
      });
    }
    if (!config.curriculumSequence || config.curriculumSequence.length === 0) {
      list.push({
        elementId: 'Curriculum',
        icon: Zap,
        textTh: 'ออกแบบ ลำดับด่านการสอน (Curriculum Sequence) ในด่านที่ 3 เพื่อให้ระบบจัดระดับได้ลงตัว',
        textEn: 'Map out a Curriculum Sequence in Step 3 to establish structural conceptual levels (+15 pts)',
        impact: '+15'
      });
    }

    return list;
  }, [activeElements, config.curriculumSequence]);

  const handleApplySandbox = () => {
    if (onChangeConfig && !sandboxMode) return;
    if (onChangeConfig) {
      onChangeConfig({
        ...config,
        gameElements: sandboxElements,
        gamePattern: sandboxPattern
      });
      setSandboxMode(false);
    }
  };

  const handleToggleSandboxElement = (id: string) => {
    setSandboxElements(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const pillarDetails = {
    challenge: {
      titleTh: 'ความท้าทายและการมีเป้าหมาย',
      titleEn: 'Challenge & Competitiveness',
      descTh: 'การสร้างความตื่นเต้นผ่านตัวจับเวลา ด่านทดสอบความยากที่ค่อยเป็นค่อยไป และอันดับการดวลคะแนน',
      descEn: 'Driven by countdown stress, progressive skill testing, and leaderboard prestige.'
    },
    progression: {
      titleTh: 'ความก้าวหน้าและการเติบโต',
      titleEn: 'Progression & Autonomy',
      descTh: 'ความภูมิใจเมื่อได้รับเหรียญตรา ปลดล็อกระดับความยากใหม่ และผ่านด่านตามเนื้อหาการสอน',
      descEn: 'Earned through status badges, leveling milestones, and clear map journey steps.'
    },
    social: {
      titleTh: 'ปฏิสัมพันธ์สังคมและเนื้อเรื่อง',
      titleEn: 'Social & Narrative Relatedness',
      descTh: 'การจำลองบทบาทสมมติ เรื่องราวรอบตัว และการจัดกลุ่มร่วมมือช่วยเหลือกันผ่านอุปสรรค',
      descEn: 'Fueled by roles, thematic lore, and peer collaboration or tournament matchups.'
    },
    feedback: {
      titleTh: 'ระบบป้อนกลับทันที',
      titleEn: 'Immediate Feedback loop',
      descTh: 'การชี้แนะทันท่วงทีเมื่อนักเรียนตอบผิด-ถูก เพื่อลดความท้อถอยและสร้างวงจรการเรียนรู้แบบลื่นไหล',
      descEn: 'Sustained by prompt dynamic hints, error correction slides, and positive audio reinforcement.'
    }
  };

  return (
    <div id="gamification-analytics-card" className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5">
      
      {/* Dashboard Title & Language Aware Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <span>{lang === 'th' ? 'แดชบอร์ดประเมินการกระตุ้น (Gamification Analytics)' : 'Gamification Design Dashboard'}</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-600 text-white font-black tracking-wider uppercase">
                AI Engine v2
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === 'th' ? 'คำนวณคะแนนการดึงดูดใจและความเข้ากันได้ของรูปแบบเกมนวัตกรรม' : 'Real-time structural health, engagement scores, and pedagogical loops.'}
            </p>
          </div>
        </div>

        {/* Sandbox Mode Switcher */}
        <button
          type="button"
          onClick={() => {
            if (!sandboxMode) {
              setSandboxElements(config.gameElements);
              setSandboxPattern(config.gamePattern);
              onSandboxExplore?.();
            }
            setSandboxMode(!sandboxMode);
          }}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
            sandboxMode 
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/70' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${sandboxMode ? 'animate-spin' : ''}`} />
          <span>
            {sandboxMode 
              ? (lang === 'th' ? 'โหมดทดลองปรับ (Sandbox On)' : 'Sandbox On') 
              : (lang === 'th' ? 'เปิดโหมดทดลองบอร์ด (Sandbox)' : 'Try Sandbox')
            }
          </span>
        </button>
      </div>

      {/* Sandbox Control Bar if Active */}
      {sandboxMode && (
        <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-2xl flex flex-col gap-3.5 animate-scale-up">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-extrabold">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{lang === 'th' ? 'กระดานทดสอบกลไกเสมือน (Gamification Sandbox)' : 'Interactive Mechanics Sandbox'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSandboxMode(false)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                {lang === 'th' ? 'ยกเลิก' : 'Discard'}
              </button>
              <button
                type="button"
                onClick={handleApplySandbox}
                className="px-2.5 py-1 text-[10px] font-black text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
              >
                {lang === 'th' ? 'นำไปใช้จริง' : 'Apply to App'}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
            {lang === 'th' 
              ? 'กดติ๊กเลือกกลไกเพื่อจำลองคะแนน Engagement Score ด้านล่าง โดยไม่ส่งผลกระทบต่อหน้าจอกลาง จนกว่าจะกด "นำไปใช้จริง"' 
              : 'Interact freely with the toggles to see instant impact on behavioral driving scores.'}
          </p>

          {/* Sandbox Element Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {[
              { id: 'Leaderboard', label: lang === 'th' ? '🏆 อันดับคะแนน' : '🏆 Leaderboard' },
              { id: 'Achievement Badges', label: lang === 'th' ? '🎖️ เหรียญรางวัล' : '🎖️ Badges' },
              { id: 'Difficulty Levels', label: lang === 'th' ? '📶 ระดับความยาก' : '📶 Difficulty' },
              { id: 'Multiplayer Mode', label: lang === 'th' ? '👥 โหมดหลายผู้เล่น' : '👥 Multiplayer' },
              { id: 'Time-Based Challenges', label: lang === 'th' ? '⏱️ ท้าทายตามเวลา' : '⏱️ Timer' },
              { id: 'Feedback System', label: lang === 'th' ? '💬 ระบบป้อนกลับ' : '💬 Feedback' },
            ].map(el => {
              const checked = sandboxElements.includes(el.id);
              return (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => handleToggleSandboxElement(el.id)}
                  className={`px-3 py-2 rounded-xl border text-left text-[10px] font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                    checked
                      ? 'bg-amber-100/50 border-amber-300 text-amber-900 shadow-sm'
                      : 'bg-white border-slate-150 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span>{el.label}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${checked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'}`}>
                    {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sandbox Gameplay Pattern Select */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] font-extrabold text-amber-800">{lang === 'th' ? 'รูปแบบเกมหลัก:' : 'Core Style:'}</span>
            {['Puzzle & Challenge', 'Role-Play & Narrative', 'Simulation & Practice', 'Progression & Mastery'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setSandboxPattern(p)}
                className={`px-2 py-1 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                  sandboxPattern === p 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm' 
                    : 'bg-white border-slate-150 text-slate-600 hover:border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Score Radial & Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radial Score Indicator */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 relative overflow-hidden group">
          
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-25 transition-opacity">
            <TrendingUp className="w-20 h-20 text-indigo-600" />
          </div>

          {/* Radial SVG Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Back Circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#E2E8F0"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress Circle with gradient effect */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#673AB7"
                strokeWidth="7.5"
                fill="transparent"
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (263.8 * metrics.weightedScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                {metrics.weightedScore}
              </span>
              <span className="text-[9px] font-black tracking-widest text-indigo-600 uppercase mt-0.5">
                {lang === 'th' ? 'คะแนนการมีส่วนร่วม' : 'ENGAGEMENT'}
              </span>
            </div>
          </div>

          {/* Engagement Tier Descriptor */}
          <div className="text-center mt-4 z-10">
            <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold inline-block border ${colorClass} shadow-sm`}>
              {grade}
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-2 px-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Four Engagement Pillars List */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <span>{lang === 'th' ? 'เสาหลักกลไกพฤติกรรม (4 Behavioral Pillars)' : '4 Behavioral Pillars'}</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help" onClick={() => setShowExplanation(showExplanation === 'pillars' ? null : 'pillars')} />
          </h4>

          {showExplanation === 'pillars' && (
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 text-[10px] font-medium text-indigo-950 leading-relaxed rounded-xl">
              {lang === 'th' 
                ? 'ระบบคำนวณคะแนนพฤติกรรมอิงตาม Octalysis Framework เพื่อให้มั่นใจว่าการจัดด่านและองค์ประกอบเกมตอบโจทย์ความภูมิใจ การแก้ปัญหา ปฏิสัมพันธ์กลุ่ม และการป้องกันความล้มเหลว' 
                : 'Pillar ratings measure specific human core drives like competence, social alignment, immediate reinforcement, and competitive agency.'}
            </div>
          )}

          <div className="space-y-3">
            {[
              { id: 'challenge', label: lang === 'th' ? pillarDetails.challenge.titleTh : pillarDetails.challenge.titleEn, desc: lang === 'th' ? pillarDetails.challenge.descTh : pillarDetails.challenge.descEn, score: metrics.challengeScore, color: 'bg-rose-500' },
              { id: 'progression', label: lang === 'th' ? pillarDetails.progression.titleTh : pillarDetails.progression.titleEn, desc: lang === 'th' ? pillarDetails.progression.descTh : pillarDetails.progression.descEn, score: metrics.progressionScore, color: 'bg-emerald-500' },
              { id: 'social', label: lang === 'th' ? pillarDetails.social.titleTh : pillarDetails.social.titleEn, desc: lang === 'th' ? pillarDetails.social.descTh : pillarDetails.social.descEn, score: metrics.socialScore, color: 'bg-sky-500' },
              { id: 'feedback', label: lang === 'th' ? pillarDetails.feedback.titleTh : pillarDetails.feedback.titleEn, desc: lang === 'th' ? pillarDetails.feedback.descTh : pillarDetails.feedback.descEn, score: metrics.feedbackScore, color: 'bg-indigo-500' },
            ].map(p => (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-700 flex items-center gap-1">{p.label}</span>
                  <span className="text-slate-800 font-extrabold">{p.score}%</span>
                </div>
                {/* Score bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${p.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-medium leading-normal">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Learning Styles Compatibility Index */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span>{lang === 'th' ? 'ดัชนีรองรับสไตล์การเรียนรู้ (Learning Styles Compatibility)' : 'Learning Style Compatibility'}</span>
          <Info className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help" onClick={() => setShowExplanation(showExplanation === 'styles' ? null : 'styles')} />
        </h4>

        {showExplanation === 'styles' && (
          <div className="p-3 bg-indigo-50/50 border border-indigo-100 text-[10px] font-medium text-indigo-950 leading-relaxed rounded-xl">
            {lang === 'th' 
              ? 'คำนวณว่าการออกแบบเกมนวัตกรรมนี้ สามารถรองรับลักษณะผู้เรียนประเภทต่าง ๆ (Visual, Auditory, Kinesthetic, Read/Write) ได้มีประสิทธิภาพเพียงใด' 
              : 'Evaluates how effectively your mechanics suit different VARK profiles. High compatibility ensures equal learning opportunity for all student styles.'}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: lang === 'th' ? '👁️ การมองเห็น (Visual)' : '👁️ Visual Learner', score: metrics.styleCompatibility.Visual, descTh: 'อันดับ แบรนเนอร์ เหรียญสีสัน', descEn: 'Visual badge indicators' },
            { label: lang === 'th' ? '🎧 การฟัง (Auditory)' : '🎧 Auditory Learner', score: metrics.styleCompatibility.Auditory, descTh: 'เสียงประกอบ ดนตรี และบทสนทนา', descEn: 'Voiceover & audio triggers' },
            { label: lang === 'th' ? '🏃 การปฏิบัติ (Kinesthetic)' : '🏃 Kinesthetic Learner', score: metrics.styleCompatibility.Kinesthetic, descTh: 'สลับด่าน แข่งขัน และจำลอง', descEn: 'Tactile challenge & runs' },
            { label: lang === 'th' ? '✍️ การอ่านเขียน (Read/Write)' : '✍️ Read/Write Learner', score: metrics.styleCompatibility.ReadWrite, descTh: 'ไขปริศนา วางแผน และบันทึกคำ', descEn: 'Journals, puzzle boards' },
          ].map((style, idx) => {
            let compatibilityColor = 'text-amber-600 bg-amber-50';
            if (style.score >= 80) compatibilityColor = 'text-emerald-600 bg-emerald-50';
            else if (style.score < 40) compatibilityColor = 'text-rose-600 bg-rose-50';

            return (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between gap-1 shadow-sm">
                <span className="text-[10px] font-black text-slate-800 leading-tight block">
                  {style.label}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black text-slate-800 leading-none">
                    {style.score}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">%</span>
                </div>
                {/* Micro compatibility tag */}
                <div className={`mt-1 py-0.5 px-2 rounded-lg text-[8px] font-black text-center ${compatibilityColor}`}>
                  {style.score >= 80 
                    ? (lang === 'th' ? 'สอดคล้องยอดเยี่ยม' : 'Excellent') 
                    : style.score >= 40 
                    ? (lang === 'th' ? 'ปานกลาง' : 'Moderate') 
                    : (lang === 'th' ? 'ต้องการตัวเลือกเพิ่ม' : 'Weak Support')
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations engine */}
      {recommendations.length > 0 && metrics.weightedScore < 100 && (
        <div className="bg-[#F9F7FF] border border-[#ECE4FF] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-[#673AB7] text-xs font-black">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span>
              {lang === 'th' 
                ? 'คำแนะนำเพื่อยกระดับเกมพรอมต์แชท AI ของคุณ (Gamification Actionable Tips)' 
                : 'Smart Design Recommendations to boost score'}
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {recommendations.slice(0, 3).map((rec, index) => {
              const RecIcon = rec.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-start gap-3 transition-colors group"
                >
                  <div className="p-1.5 bg-[#F9F7FF] text-[#673AB7] rounded-lg border border-[#ECE4FF] shrink-0 mt-0.5">
                    <RecIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 leading-relaxed">
                      {lang === 'th' ? rec.textTh : rec.textEn}
                    </p>
                    {sandboxMode && (
                      <button
                        type="button"
                        onClick={() => {
                          if (rec.elementId === 'Curriculum') {
                            setSandboxMode(false);
                            // Just close sandbox so they can go to step 3
                          } else {
                            handleToggleSandboxElement(rec.elementId);
                          }
                        }}
                        className="text-[9px] font-extrabold text-[#673AB7] hover:underline mt-1 block cursor-pointer"
                      >
                        {rec.elementId === 'Curriculum' 
                          ? (lang === 'th' ? '→ ไปอัปเดตขั้นตอนสร้างบทเรียน' : '→ Update steps in wizard')
                          : (lang === 'th' ? '✦ คลิกจำลองใส่ระบบทันที' : '✦ Click to simulate this element')
                        }
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 shrink-0 select-none">
                    {rec.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Checklist and confirmation info */}
      <div className="text-[9px] text-slate-400 font-bold flex flex-wrap items-center justify-between gap-2 border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>
            {lang === 'th' 
              ? 'ระบบคำนวณแบบพลวัตอัปเดตแบบเรียลไทม์ทุกครั้งที่คุณติ๊กเลือกองค์ประกอบ' 
              : 'Pedagogical index aligns with Bloom\'s taxonomy, CEFR Levels, and standard child psychology models.'
            }
          </span>
        </div>
      </div>

    </div>
  );
}
