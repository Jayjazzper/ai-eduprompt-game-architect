import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Sparkles, BookOpen, Palette, Zap, Users,
  CheckCircle, Lock, Trophy, TrendingUp, HelpCircle, Flame,
  Compass, ArrowRight, Star, Heart, Check, Clock, Plus, Share2
} from 'lucide-react';
import { GamePromptConfig, TeacherProfileStats } from '../types';

interface TeacherGamificationProps {
  stats: TeacherProfileStats;
  config: GamePromptConfig;
  publicPromptsCount: number;
  savedPromptsCount: number;
  historyCount: number;
  lang: 'th' | 'en';
  onClaimReward: (points: number, descriptionTh: string, descriptionEn: string, badgeId?: string) => void;
}

export default function TeacherGamification({
  stats,
  config,
  publicPromptsCount,
  savedPromptsCount,
  historyCount,
  lang,
  onClaimReward
}: TeacherGamificationProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'quests' | 'activities'>('badges');
  const [showXPExplanation, setShowXPExplanation] = useState(false);

  // Level thresholds & naming
  // Level 1: 0 - 150 XP
  // Level 2: 151 - 450 XP
  // Level 3: 451 - 900 XP
  // Level 4: 901 - 1600 XP
  // Level 5: 1601+ XP
  const levelInfo = useMemo(() => {
    const xp = stats.xp;
    if (xp < 150) {
      return {
        level: 1,
        titleTh: 'ผู้เริ่มต้นสร้างสรรค์เกม (Novice Game Crafter)',
        titleEn: 'Novice Game Crafter',
        minXP: 0,
        maxXP: 150,
        color: 'from-amber-500 to-amber-600',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50'
      };
    } else if (xp < 450) {
      return {
        level: 2,
        titleTh: 'ผู้ช่วยสถาปนิกเกมพรอมต์ (Apprentice Architect)',
        titleEn: 'Apprentice Architect',
        minXP: 150,
        maxXP: 450,
        color: 'from-blue-500 to-blue-600',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50'
      };
    } else if (xp < 900) {
      return {
        level: 3,
        titleTh: 'นักประยุกต์เกมนวัตกรรม (Active Innovator)',
        titleEn: 'Active Innovator',
        minXP: 450,
        maxXP: 900,
        color: 'from-purple-500 to-purple-600',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50'
      };
    } else if (xp < 1600) {
      return {
        level: 4,
        titleTh: 'ผู้สร้างสรรค์การเรียนรู้ (Educational Hero)',
        titleEn: 'Educational Hero',
        minXP: 900,
        maxXP: 1600,
        color: 'from-teal-500 to-teal-600',
        textColor: 'text-teal-700',
        bgColor: 'bg-teal-50'
      };
    } else {
      return {
        level: 5,
        titleTh: 'สถาปนิกระดับปรมาจารย์ (Master Architect)',
        titleEn: 'Master Architect',
        minXP: 1600,
        maxXP: 10000, // cap
        color: 'from-indigo-500 to-indigo-600',
        textColor: 'text-indigo-700',
        bgColor: 'bg-indigo-50'
      };
    }
  }, [stats.xp]);

  const levelProgressPercent = useMemo(() => {
    if (levelInfo.level === 5) return 100;
    const numerator = stats.xp - levelInfo.minXP;
    const denominator = levelInfo.maxXP - levelInfo.minXP;
    return Math.min(100, Math.max(0, Math.round((numerator / denominator) * 100)));
  }, [stats.xp, levelInfo]);

  // Badges structure
  const badgesList = useMemo(() => {
    return [
      {
        id: 'badge-innovator',
        nameTh: 'นักนวัตกรรมการศึกษา',
        nameEn: 'Educational Innovator',
        descTh: 'แชร์ผลงานเกมพรอมต์ต้นแบบอย่างน้อย 1 ครั้งให้กับชุมชนนักเรียนและเพื่อนครูทั่วโลก',
        descEn: 'Share at least 1 game prompt globally to the public community hub.',
        icon: Sparkles,
        color: 'text-amber-500 border-amber-200 bg-amber-50',
        unlockedColor: 'bg-amber-500 text-white',
        requirementTh: 'แชร์ผลงานลงคลังสาธารณะ 1 ครั้ง',
        requirementEn: 'Share 1 prompt to the community hub',
        currentVal: publicPromptsCount,
        targetVal: 1,
        isUnlocked: publicPromptsCount >= 1
      },
      {
        id: 'badge-architect',
        nameTh: 'สุดยอดสถาปนิกเกม',
        nameEn: 'Master Architect',
        descTh: 'สะสมค่าประสบการณ์ความเชี่ยวชาญการออกแบบเพื่อการศึกษาถึง 500 XP',
        descEn: 'Earn 500 XP or more through building and refining high-quality instructional prompts.',
        icon: Award,
        color: 'text-indigo-500 border-indigo-200 bg-indigo-50',
        unlockedColor: 'bg-indigo-500 text-white',
        requirementTh: 'สะสมค่าประสบการณ์ครบ 500 XP',
        requirementEn: 'Reach 500 XP',
        currentVal: stats.xp,
        targetVal: 500,
        isUnlocked: stats.xp >= 500
      },
      {
        id: 'badge-vark',
        nameTh: 'ผู้บุกเบิกความหลากหลาย',
        nameEn: 'VARK Pioneer',
        descTh: 'ออกแบบเกมที่ครอบคลุมรูปแบบการรับรู้อย่างรอบด้าน (VARK) ตั้งแต่ 3 สไตล์ขึ้นไป',
        descEn: 'Create a game prompt configuration that accommodates 3 or more VARK learning styles.',
        icon: Users,
        color: 'text-emerald-500 border-emerald-200 bg-emerald-50',
        unlockedColor: 'bg-emerald-500 text-white',
        requirementTh: 'ติ๊กสไตล์การเรียนรู้ตั้งแต่ 3 สไตล์ขึ้นไป',
        requirementEn: 'Enable 3+ learning styles',
        currentVal: config.learningStyles.length,
        targetVal: 3,
        isUnlocked: config.learningStyles.length >= 3
      },
      {
        id: 'badge-pedagogy',
        nameTh: 'ปรมาจารย์โครงสร้างเนื้อหา',
        nameEn: 'Pedagogical Master',
        descTh: 'วางแผนสเต็ปขั้นตอนหลักสูตรและลำดับด่านย่อยการสอนในขั้นตอนที่ 3 ตั้งแต่ 3 ด่านขึ้นไป',
        descEn: 'Structure a detailed Curriculum Sequence with 3 or more distinct conceptual levels.',
        icon: BookOpen,
        color: 'text-rose-500 border-rose-200 bg-rose-50',
        unlockedColor: 'bg-rose-500 text-white',
        requirementTh: 'สร้างลำดับด่านบทเรียน 3 ด่านขึ้นไป',
        requirementEn: 'Add 3+ curriculum sequence levels',
        currentVal: config.curriculumSequence?.length || 0,
        targetVal: 3,
        isUnlocked: (config.curriculumSequence?.length || 0) >= 3
      },
      {
        id: 'badge-visionary',
        nameTh: 'นักคิดค้นเปี่ยมวิสัยทัศน์',
        nameEn: 'Creative Visionary',
        descTh: 'ปรับแต่งความหนาแน่น เลย์เอาต์ โทนสี หรือสไตล์ความงามของเกมให้โดดเด่นน่าสนใจ',
        descEn: 'Customize UI layout density, custom color palette, or visual styles for a cohesive thematic feel.',
        icon: Palette,
        color: 'text-violet-500 border-violet-200 bg-violet-50',
        unlockedColor: 'bg-violet-500 text-white',
        requirementTh: 'ปรับปรุงเลย์เอาต์ โทนสี หรือสไตล์เกมนวัตกรรม',
        requirementEn: 'Select custom color palette, visual theme, or custom density',
        currentVal: (config.colorPalette !== 'default' || config.visualStyle !== 'standard' || config.layoutDensity !== 'standard') ? 1 : 0,
        targetVal: 1,
        isUnlocked: config.colorPalette !== 'default' || config.visualStyle !== 'standard' || config.layoutDensity !== 'standard'
      },
      {
        id: 'badge-scholar',
        nameTh: 'คลังความรู้แห่งนวัตกรรม',
        nameEn: 'Prolific Scholar',
        descTh: 'สะสมเกมและประวัติการออกแบบแผนการสอนไว้ในเครื่องเพื่อหยิบไปใช้ซ้ำอย่างน้อย 3 แผน',
        descEn: 'Build your localized instructional repertoire with 3 or more saved game specifications.',
        icon: Zap,
        color: 'text-sky-500 border-sky-200 bg-sky-50',
        unlockedColor: 'bg-sky-500 text-white',
        requirementTh: 'บันทึกเซสชันหรือมีประวัติสร้างงานครบ 3 ชิ้น',
        requirementEn: 'Have 3+ saved game designs or history records',
        currentVal: Math.max(savedPromptsCount, historyCount),
        targetVal: 3,
        isUnlocked: (savedPromptsCount >= 3 || historyCount >= 3)
      }
    ];
  }, [publicPromptsCount, stats.xp, config, savedPromptsCount, historyCount]);

  // Dynamic Badges count
  const unlockedBadgesCount = useMemo(() => {
    return badgesList.filter(b => b.isUnlocked).length;
  }, [badgesList]);

  // Quests & claim rewards (like daily planning challenge or mock claims)
  const questsList = useMemo(() => {
    return [
      {
        id: 'quest-daily-inspire',
        titleTh: '💡 รับแรงบันดาลใจการออกแบบรายวัน',
        titleEn: '💡 Daily Instructional Inspiration',
        descTh: 'รับข้อแนะนำกลไกเกมแปลกใหม่สำหรับการสอนวันนี้ เพื่อกระตุ้นความคิดสร้างสรรค์',
        descEn: 'Click to fetch a creative educational mechanic idea to spark your curriculum design.',
        points: 25,
        type: 'button',
        claimedId: 'claimed-daily-inspire-' + new Date().toISOString().slice(0, 10)
      },
      {
        id: 'quest-vark-check',
        titleTh: '🏃‍♂️ ออกแบบแผนแบบกระตุ้น 3 มิติ',
        titleEn: '🏃‍♂️ Three-Dimensional VARK Plan',
        descTh: 'ตั้งค่าเกมให้รองรับวิชาของคุณโดยมีสไตล์ VARK 3 สไตล์ขึ้นไป เพื่อตอบสนองความเท่าเทียม',
        descEn: 'Apply a game spec that incorporates at least 3 learning styles to reach more diverse students.',
        points: 75,
        type: 'auto',
        isCompleted: config.learningStyles.length >= 3,
        claimedId: 'claimed-quest-vark'
      },
      {
        id: 'quest-curriculum-check',
        titleTh: '🗺️ วาดแผนที่หลักสูตร 3 ลำดับขั้น',
        titleEn: '🗺️ Three-Tier Curriculum Mapping',
        descTh: 'กำหนดลำดับด่านบทเรียนย่อยในขั้นตอนที่ 3 เพื่อให้ระบบ AI ประเมินการจำลองและออกเกณฑ์ได้ชัดเจน',
        descEn: 'Map a continuous curriculum mapping flow with 3 levels in Step 3 of the designer.',
        points: 100,
        type: 'auto',
        isCompleted: (config.curriculumSequence?.length || 0) >= 3,
        claimedId: 'claimed-quest-curriculum'
      }
    ];
  }, [config]);

  // Internal trigger for daily inspiration ideas
  const [dailyIdea, setDailyIdea] = useState<{ th: string, en: string } | null>(null);
  const triggerDailyIdea = () => {
    const ideas = [
      {
        th: 'ลองใช้ "กลไกประมูลคำถาม" (Bidding Mechanics) โดยให้นักเรียนแบ่งปันแต้มพลังงานในการชิงเลือกคำถามระดับสูง',
        en: 'Try "Question Bidding" where teams budget energy points to bid on choosing high-yield exam topics.'
      },
      {
        th: 'สร้าง "ตารางธาตุผู้พิทักษ์" (Element Guardians) ที่ธาตุแต่ละหมู่มีความสามารถเศษกระดาษปราบอุปสรรคต่างกัน',
        en: 'Draft "Element Guardians" where chemical groups behave like characters with unique synergies.'
      },
      {
        th: 'ใช้กติกา "ผู้คุมเวลาทรายแป้ง" (Flour Hour Sandbox) ที่นักเรียนทำงานประสานกันภายใต้การตอบคำถามใน 30 วินาที',
        en: 'Implement "Sandglass Co-op" where teams rotate roles dynamically under rapid 30-second query sprints.'
      },
      {
        th: 'ทำ "กระดานสืบสวนคดีวิจารณ์วรรณกรรม" (Literary Clue Mystery) เพื่อฝึกฝนการอ่านจับใจความและดึงคุณสมบัติเด่น',
        en: 'Deploy a "Literary Crime Scene" mystery board to teach structural analysis and character motives.'
      }
    ];
    const randomIndex = Math.floor(Math.random() * ideas.length);
    setDailyIdea(ideas[randomIndex]);
    onClaimReward(25, 'รับข้อเสนอแรงบันดาลใจออกแบบรายวัน: ' + ideas[randomIndex].th, 'Claimed daily inspiration design tip: ' + ideas[randomIndex].en);
  };

  return (
    <div id="teacher-gamification-card" className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] p-5 flex flex-col gap-5 relative overflow-hidden">
      
      {/* Background flare decorations */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header & Profile Stats Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-purple-500/10 text-[#673AB7] rounded-xl shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'th' ? 'ระดับผู้สอนและรางวัลสะสม (Teacher Gamification)' : 'Educator Architecture Level & Badges'}</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#673AB7] text-white font-black uppercase tracking-wider">
                PRISM Mastery
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === 'th' ? 'สะสมแต้มความดีความชอบและการพัฒนาเนื้อหาการเรียนการสอนของคุณ' : 'Collect expertise XP & claim exclusive status badges.'}
            </p>
          </div>
        </div>

        {/* Global Level Indicator Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 ${levelInfo.bgColor} ${levelInfo.textColor} border border-slate-100`}>
            <Star className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>LV. {levelInfo.level}</span>
          </div>
        </div>
      </div>

      {/* PROFILE GAUGE: Level Progress bar & XP breakdown */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100/60 p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              {lang === 'th' ? 'ระดับเกียรติยศผู้สอน' : 'Educator Honor Class'}
            </span>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              {lang === 'th' ? levelInfo.titleTh : levelInfo.titleEn}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-slate-800 tracking-tight">
              {stats.xp} <span className="text-[10px] text-slate-400">XP</span>
            </span>
            {levelInfo.level < 5 ? (
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                {lang === 'th' ? `ต้องการอีก ${levelInfo.maxXP - stats.xp} XP เพื่อผ่านด่าน` : `Need ${levelInfo.maxXP - stats.xp} XP to Level ${levelInfo.level + 1}`}
              </p>
            ) : (
              <p className="text-[9px] font-bold text-[#673AB7] mt-0.5">
                {lang === 'th' ? 'ระดับความเชี่ยวชาญสูงสุดแล้ว! 🎉' : 'Maximum Architecture Honor reached! 🎉'}
              </p>
            )}
          </div>
        </div>

        {/* Custom Smooth Progress Gauge */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/40 relative">
            <motion.div 
              className={`h-full rounded-full bg-gradient-to-r ${levelInfo.color} shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${levelProgressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
            <span>LV.{levelInfo.level} ({levelInfo.minXP} XP)</span>
            <span>{levelProgressPercent}% {lang === 'th' ? 'ความสำเร็จระดับถัดไป' : 'next step'}</span>
            <span>{levelInfo.level === 5 ? 'MAX' : `LV.${levelInfo.level + 1} (${levelInfo.maxXP} XP)`}</span>
          </div>
        </div>

        {/* Mini Counters Banner */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100/50">
          <div className="text-center p-1.5 bg-white rounded-xl border border-slate-100">
            <span className="text-[8px] text-slate-400 font-bold block uppercase">{lang === 'th' ? 'เหรียญรางวัล' : 'Badges'}</span>
            <span className="text-xs font-black text-[#673AB7]">{unlockedBadgesCount}/{badgesList.length}</span>
          </div>
          <div className="text-center p-1.5 bg-white rounded-xl border border-slate-100">
            <span className="text-[8px] text-slate-400 font-bold block uppercase">{lang === 'th' ? 'เผยแพร่สู่ชุมชน' : 'Shared Global'}</span>
            <span className="text-xs font-black text-sky-600">{publicPromptsCount}</span>
          </div>
          <div className="text-center p-1.5 bg-white rounded-xl border border-slate-100">
            <span className="text-[8px] text-slate-400 font-bold block uppercase">{lang === 'th' ? 'คลังส่วนตัว' : 'Saved Drafts'}</span>
            <span className="text-xs font-black text-emerald-600">{savedPromptsCount}</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION FOR STATS DETAILS */}
      <div className="flex border-b border-slate-100">
        {[
          { id: 'badges', labelTh: '🎖️ เหรียญตราเกียรติยศ', labelEn: '🎖️ Honor Badges' },
          { id: 'quests', labelTh: '⚡ ภารกิจพัฒนาทักษะ', labelEn: '⚡ Skill Quests' },
          { id: 'activities', labelTh: '⏳ ประวัติการได้แต้ม', labelEn: '⏳ Activity Log' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 pb-2.5 text-center text-[10px] font-black transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id 
                ? 'border-[#673AB7] text-[#673AB7]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {lang === 'th' ? tab.labelTh : tab.labelEn}
          </button>
        ))}
      </div>

      {/* TAB CONTENT WITH ANIMATION */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BADGES SHOWCASE GRID */}
          {activeTab === 'badges' && (
            <motion.div 
              key="badges-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {badgesList.map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border transition-all relative flex flex-col gap-2.5 ${
                      badge.isUnlocked 
                        ? 'bg-white border-slate-200 shadow-sm' 
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    {/* Badge top line info */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${badge.isUnlocked ? badge.color : 'bg-slate-200 text-slate-400'}`}>
                        <BadgeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                          {lang === 'th' ? badge.nameTh : badge.nameEn}
                        </h4>
                        <span className={`text-[8px] font-black uppercase tracking-wider block mt-0.5 px-1.5 py-0.5 rounded-md inline-block ${badge.isUnlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          {badge.isUnlocked ? (lang === 'th' ? '✓ ปลดล็อกแล้ว' : 'Unlocked') : (lang === 'th' ? '🔒 ล็อกอยู่' : 'Locked')}
                        </span>
                      </div>
                    </div>

                    {/* Badge Description */}
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                      {lang === 'th' ? badge.descTh : badge.descEn}
                    </p>

                    {/* Badge Progress bar details */}
                    <div className="mt-auto pt-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 mb-1">
                        <span>{lang === 'th' ? 'เงื่อนไข:' : 'Progress:'}</span>
                        <span>{badge.currentVal} / {badge.targetVal}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${badge.isUnlocked ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          style={{ width: `${Math.min(100, Math.round((badge.currentVal / badge.targetVal) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 2: SKILL QUESTS & DAILY TIPS */}
          {activeTab === 'quests' && (
            <motion.div 
              key="quests-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {/* Daily Action trigger box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50/30 border border-purple-100 flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-purple-100 text-[#673AB7] rounded-lg shrink-0 mt-0.5">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#673AB7] leading-none">
                      {lang === 'th' ? 'โจทย์ลับเกมพรอมต์อัจฉริยะประจําวัน' : 'Daily Prompt Game Inspiration Secret Card'}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                      {lang === 'th' 
                        ? 'คลิกเพื่อรับไอเดียการจัดการเรียนรู้โดยใช้เกมนวัตกรรมใหม่ และสะสม 25 XP' 
                        : 'Click to open a customized game idea for your classroom today and earn +25 XP.'}
                    </p>
                  </div>
                </div>

                {dailyIdea && (
                  <div className="p-2.5 bg-white border border-purple-150/70 rounded-xl text-[10px] font-bold text-[#673AB7] leading-normal animate-fade-in flex items-start gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lang === 'th' ? dailyIdea.th : dailyIdea.en}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={triggerDailyIdea}
                  disabled={!!dailyIdea}
                  className={`w-full py-2 px-4 text-xs font-bold rounded-xl text-center shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    dailyIdea 
                      ? 'bg-purple-100 text-purple-400 border border-purple-200 shadow-inner' 
                      : 'bg-[#673AB7] hover:bg-[#5E35B1] text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{dailyIdea ? (lang === 'th' ? 'รับพลังความร้อนแรงแล้ว! (+25 XP)' : 'Claimed successfully (+25 XP)') : (lang === 'th' ? 'เปิดรับแนวคิดทันที (+25 XP)' : 'Claim Daily Inspiration (+25 XP)')}</span>
                </button>
              </div>

              {/* Automatic tasks progression */}
              {questsList.filter(q => q.type === 'auto').map((quest) => {
                const isClaimed = stats.activities.some(act => act.id.startsWith(quest.id));
                return (
                  <div 
                    key={quest.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      quest.isCompleted 
                        ? 'bg-emerald-50/20 border-emerald-100' 
                        : 'bg-slate-50/50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${quest.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        {quest.isCompleted ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-800 leading-tight">
                          {lang === 'th' ? quest.titleTh : quest.titleEn}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-bold leading-normal mt-0.5">
                          {lang === 'th' ? quest.descTh : quest.descEn}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <div className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-150 text-[#673AB7] text-[8px] font-black rounded-lg">
                        +{quest.points} XP
                      </div>
                      {quest.isCompleted && !isClaimed ? (
                        <button
                          type="button"
                          onClick={() => onClaimReward(quest.points, lang === 'th' ? `ทำภารกิจสำเร็จ: ${quest.titleTh}` : `Completed quest: ${quest.titleEn}`, lang === 'th' ? `ทำภารกิจสำเร็จ: ${quest.titleTh}` : `Completed quest: ${quest.titleEn}`)}
                          className="px-2 py-0.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[8px] font-bold rounded-lg cursor-pointer"
                        >
                          {lang === 'th' ? 'เคลมแต้ม' : 'Claim'}
                        </button>
                      ) : isClaimed ? (
                        <span className="text-[8px] text-slate-400 font-bold">{lang === 'th' ? 'รับแล้ว' : 'Claimed'}</span>
                      ) : (
                        <span className="text-[8px] text-slate-400 font-bold">{lang === 'th' ? 'ยังไม่สำเร็จ' : 'Active'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 3: HISTORY ACTIVITY LOG */}
          {activeTab === 'activities' && (
            <motion.div 
              key="activities-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-2 max-h-[220px] overflow-y-auto pr-1"
            >
              {stats.activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold text-xs flex flex-col items-center justify-center gap-2">
                  <Flame className="w-8 h-8 text-slate-200" />
                  <p>{lang === 'th' ? 'ยังไม่มีกิจกรรมที่ประเมินได้รับค่า XP' : 'No XP activity events found in your journal'}</p>
                </div>
              ) : (
                [...stats.activities].reverse().map((act) => (
                  <div 
                    key={act.id}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100/75 border border-slate-100 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-700 leading-normal">
                        {lang === 'th' ? act.descriptionTh : act.descriptionEn}
                      </p>
                      <span className="text-[8px] text-slate-400 font-medium block mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="px-2 py-0.5 bg-emerald-50 border border-emerald-150 text-emerald-600 text-[10px] font-black rounded-lg shrink-0">
                      +{act.points} XP
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER INFO DISCLOSURE */}
      <div className="text-[9px] text-slate-400 font-semibold flex items-center justify-between border-t border-slate-50 pt-2">
        <button
          type="button"
          onClick={() => setShowXPExplanation(!showXPExplanation)}
          className="text-[#673AB7] hover:underline cursor-pointer flex items-center gap-1 font-bold"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{lang === 'th' ? 'วิธีกระดมแต้มความรู้และเกียรติบัตรครู' : 'How does Educator Mastery work?'}</span>
        </button>

        <span>PRISM RPG Engine v1.0</span>
      </div>

      {showXPExplanation && (
        <div className="p-3 bg-[#F9F7FF] border border-[#ECE4FF] text-[10px] font-bold text-slate-600 leading-relaxed rounded-xl animate-fade-in space-y-1.5">
          <p className="text-[#673AB7] font-black">🌟 {lang === 'th' ? 'วิธีได้รับค่าประสบการณ์ (XP):' : 'Educator XP Distribution Guide:'}</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>{lang === 'th' ? 'สร้างโครงสร้างแผนเกมพรอมต์ / สรุปความรู้อภิปราย (ขั้นตอนที่ 8) : +100 XP' : 'Generate basic/enhanced system prompt (Step 8): +100 XP'}</li>
            <li>{lang === 'th' ? 'แชร์แนวคิดและคู่มือการเรียนขึ้นห้องสมุดชุมชน : +250 XP' : 'Publish your finished game draft globally to community: +250 XP'}</li>
            <li>{lang === 'th' ? 'อัปเดตปรับแก้ชื่อและเลือกสัญญะผู้สอน (สเต็ป 1) : +50 XP' : 'Update profile avatar preset or teacher identity (Step 1): +50 XP'}</li>
            <li>{lang === 'th' ? 'สร้างลิงก์สำหรับส่งต่อหรือท้าทายโครงการ : +50 XP' : 'Copy temporary secure project share-links: +50 XP'}</li>
            <li>{lang === 'th' ? 'ใช้งานระบบจำลองพฤติกรรมผู้เล่น (Sandbox) : +75 XP' : 'Trigger the interactive Sandbox analyzer: +75 XP'}</li>
          </ul>
        </div>
      )}

    </div>
  );
}
