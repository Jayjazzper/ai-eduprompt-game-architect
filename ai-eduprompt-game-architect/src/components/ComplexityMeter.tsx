import React, { useMemo } from 'react';
import { 
  Zap, Clock, Code, ShieldAlert, CheckCircle, 
  HelpCircle, Settings, Layers, Users, Sparkles, Sliders
} from 'lucide-react';
import { GamePromptConfig } from '../types';

interface ComplexityMeterProps {
  config: GamePromptConfig;
  promptText: string;
  lang: 'th' | 'en';
}

export default function ComplexityMeter({ config, promptText, lang }: ComplexityMeterProps) {
  // Calculate dynamic metrics based on prompt details & chosen configs
  const analysis = useMemo(() => {
    let score = 25; // Base complexity
    const reasons: { key: string; textTh: string; textEn: string; points: number }[] = [];

    // 1. Production Level complexity
    if (config.productionLevel === 'Polished') {
      score += 15;
      reasons.push({
        key: 'production',
        textTh: 'ความสวยงามระดับ Polished (เพิ่มเอฟเฟกต์เสียงและ GSAP)',
        textEn: 'Polished production level (requires GSAP animation & sound logic)',
        points: 15
      });
    } else if (config.productionLevel === 'Stunning 3D') {
      score += 35;
      reasons.push({
        key: 'production',
        textTh: 'กราฟิก Stunning 3D (ต้องการ WebGL / Three.js หรือพารัลแลกซ์หนัก)',
        textEn: 'Stunning 3D requirements (requires WebGL, Three.js or complex parallax)',
        points: 35
      });
    } else {
      reasons.push({
        key: 'production',
        textTh: 'ความละเอียดระดับ Simple (โครงสร้างเว็บพื้นฐาน HTML/CSS)',
        textEn: 'Simple production level (standard HTML5 & CSS structures)',
        points: 5
      });
    }

    // 2. Core Game Elements complexity
    const elementCount = config.gameElements.length;
    if (elementCount > 0) {
      const elementPoints = elementCount * 5;
      score += elementPoints;
      reasons.push({
        key: 'elements_count',
        textTh: `เลือกกลไกเกมเสริม ${elementCount} รายการ (กลไกละ +5)`,
        textEn: `Active game elements: ${elementCount} selected (+5 each)`,
        points: elementPoints
      });
    }

    if (config.gameElements.includes('Multiplayer Mode')) {
      score += 15; // Additional multiplier for multiplayer
      reasons.push({
        key: 'multiplayer',
        textTh: 'ระบบหลายผู้เล่น (ต้องจำลอง State แชร์หน้าจอหรือ Peer connection)',
        textEn: 'Multiplayer Mode active (requires shared screen state or peer socket logic)',
        points: 15
      });
    }

    if (config.gameElements.includes('Leaderboard')) {
      score += 8;
      reasons.push({
        key: 'leaderboard',
        textTh: 'ระบบกระดานผู้นำ (ต้องคำนวณอันดับคะแนนและบันทึกผู้ชนะ)',
        textEn: 'Leaderboards active (requires ranking tables & win-state tracking)',
        points: 8
      });
    }

    // 3. Curriculum levels / scaffolding
    const levelCount = config.curriculumSequence?.length || 0;
    if (levelCount > 0) {
      const scaffoldPoints = Math.min(15, levelCount * 3);
      score += scaffoldPoints;
      reasons.push({
        key: 'levels',
        textTh: `ลำดับการสอนทีละขั้น ${levelCount} ด่าน (ระดับการสอนแบบนั่งร้านแบบก้าวหน้า)`,
        textEn: `Scaffolded curriculum with ${levelCount} stages (+3 each)`,
        points: scaffoldPoints
      });
    }

    // 4. Addons complexity
    const addonCount = config.addons.length;
    if (addonCount > 0) {
      const addonPoints = addonCount * 4;
      score += addonPoints;
      reasons.push({
        key: 'addons',
        textTh: `ลูกเล่นเสียง/สีสวมใส่เพิ่ม ${addonCount} ชนิด`,
        textEn: `Visual/Audio Add-ons: ${addonCount} items active`,
        points: addonPoints
      });
    }

    // 5. Prompt content length analyzer
    const wordCount = promptText ? promptText.split(/\s+/).length : 0;
    if (wordCount > 600) {
      score += 10;
      reasons.push({
        key: 'prompt_length',
        textTh: 'ขนาดคำสั่งละเอียดสูง (พร้อมต์ยาวมากกว่า 600 คำกระตุ้นบริบทลึก)',
        textEn: 'High prompt specification resolution (word count exceeds 600)',
        points: 10
      });
    } else if (wordCount > 300) {
      score += 5;
    }

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(10, score));

    // Calculate implementation duration estimate
    let timeEstimateTh = '1 - 2 ชั่วโมง';
    let timeEstimateEn = '1 - 2 Hours';
    let difficultyTierTh = 'ระดับเริ่มต้น (Beginner)';
    let difficultyTierEn = 'Beginner Friendly';
    let difficultyColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    let difficultyProgressColor = 'bg-emerald-500';

    if (finalScore >= 80) {
      timeEstimateTh = '1 - 2 วัน (หรือ AI ช่วยพัฒนาต่อยอด)';
      timeEstimateEn = '1 - 2 Days (or continuous AI iterations)';
      difficultyTierTh = 'ระดับเชี่ยวชาญ (Expert System)';
      difficultyTierEn = 'Expert Implementation';
      difficultyColor = 'text-rose-600 bg-rose-50 border-rose-200';
      difficultyProgressColor = 'bg-rose-500';
    } else if (finalScore >= 55) {
      timeEstimateTh = '4 - 8 ชั่วโมง';
      timeEstimateEn = '4 - 8 Hours';
      difficultyTierTh = 'ระดับกลางสูง (Advanced Framework)';
      difficultyTierEn = 'Advanced Sandbox';
      difficultyColor = 'text-amber-600 bg-amber-50 border-amber-200';
      difficultyProgressColor = 'bg-amber-500';
    } else if (finalScore >= 35) {
      timeEstimateTh = '2 - 3 ชั่วโมง';
      timeEstimateEn = '2 - 3 Hours';
      difficultyTierTh = 'ระดับใช้งานทั่วไป (Intermediate)';
      difficultyTierEn = 'Intermediate Dev';
      difficultyColor = 'text-indigo-600 bg-indigo-50 border-indigo-150';
      difficultyProgressColor = 'bg-indigo-500';
    }

    return {
      score: finalScore,
      reasons,
      timeEstimateTh,
      timeEstimateEn,
      difficultyTierTh,
      difficultyTierEn,
      difficultyColor,
      difficultyProgressColor,
      wordCount
    };
  }, [config, promptText]);

  // Actionable tips to reduce complexity
  const optimizationTips = useMemo(() => {
    const tips = [];
    if (config.productionLevel !== 'Simple') {
      tips.push({
        textTh: '💡 เปลี่ยนระดับการผลิตเป็น "Simple" ในขั้นตอนที่ 6 จะช่วยลดความซับซ้อนของโค้ดลงได้ถึง 25%',
        textEn: '💡 Changing Production Level to "Simple" in Step 6 reduces overall code complexity by ~25%.'
      });
    }
    if (config.gameElements.includes('Multiplayer Mode')) {
      tips.push({
        textTh: '👥 เอา "Multiplayer Mode" ออกในขั้นตอนที่ 4 หากคุณต้องการสร้างเกมเล่นคนเดียวที่ไม่ซับซ้อน',
        textEn: '👥 Deselecting "Multiplayer Mode" in Step 4 makes state sync logic significantly easier.'
      });
    }
    if (config.gameElements.length > 3) {
      tips.push({
        textTh: '🧩 เลือกกลไกหลักไม่เกิน 2-3 อย่าง เพื่อป้องกันไม่ให้นักเรียนรับภาระทางข้อมูลหนักเกินไป',
        textEn: '🧩 Keeping game elements to 2-3 prevents student cognitive overload and keeps specs lightweight.'
      });
    }
    if (tips.length === 0) {
      tips.push({
        textTh: '✨ โครงสร้างเกมพรอมต์ของคุณเรียบง่ายและเสร็จสมบูรณ์รวดเร็วเป็นพิเศษ พร้อมใช้งานได้ทันที!',
        textEn: '✨ Your current prompt-game setup is highly optimal and lightweight! Ready to run immediately.'
      });
    }
    return tips;
  }, [config]);

  return (
    <div id="complexity-meter-panel" className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-violet-500/10 text-violet-600 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <span>{lang === 'th' ? 'มาตรวัดความซับซ้อนของคำสั่ง (Complexity Meter)' : 'Implementation Complexity Meter'}</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-violet-600 text-white font-black tracking-wider uppercase">
                ANALYSIS
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === 'th' ? 'ประเมินความซับซ้อนและตรรกะของเกมระบบพรอมต์จากข้อกำหนดระบบ' : 'Estimated narrative complexity and interactive depth for the AI game.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual score ring & quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Meter Radial/Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 relative overflow-hidden">
          <div className="relative w-36 h-24 flex items-center justify-center overflow-hidden">
            {/* Semicircle gauge */}
            <svg className="w-36 h-36 absolute -bottom-10" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F1F5F9"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="125.6 251.2"
                strokeLinecap="round"
                transform="rotate(-180 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#8B5CF6"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="125.6 251.2"
                strokeDashoffset={125.6 - (125.6 * analysis.score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                transform="rotate(-180 50 50)"
              />
            </svg>

            {/* Gauge score text */}
            <div className="absolute bottom-1 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                {analysis.score}%
              </span>
              <span className="text-[9px] font-black tracking-widest text-violet-600 uppercase mt-1">
                {lang === 'th' ? 'ระดับความยาก' : 'COMPLEXITY'}
              </span>
            </div>
          </div>

          <div className="text-center z-10 w-full mt-2">
            <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold inline-block border ${analysis.difficultyColor} shadow-sm`}>
              {lang === 'th' ? analysis.difficultyTierTh : analysis.difficultyTierEn}
            </div>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Stat Box 1 */}
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-white text-amber-500 rounded-lg shadow-sm border border-slate-100 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  {lang === 'th' ? 'เวลาพัฒนาโดยประมาณ' : 'Estimated Build Time'}
                </span>
                <span className="text-xs font-black text-slate-800">
                  {lang === 'th' ? analysis.timeEstimateTh : analysis.timeEstimateEn}
                </span>
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-white text-indigo-500 rounded-lg shadow-sm border border-slate-100 shrink-0">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  {lang === 'th' ? 'คำบริบทรวมพร้อมต์' : 'Total Word Count'}
                </span>
                <span className="text-xs font-black text-slate-800">
                  {analysis.wordCount} {lang === 'th' ? 'คำ' : 'words'}
                </span>
              </div>
            </div>
          </div>

          {/* Sizing Indicator bars */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              {lang === 'th' ? 'สัดส่วนตัวแปรก่อความยาก' : 'Complexity Drivers Weight'}
            </h4>
            
            <div className="space-y-1.5">
              {[
                { label: lang === 'th' ? 'ความหรูหราของระบบหน้าจอ (Production Level)' : 'UI & Animation Level', val: config.productionLevel === 'Stunning 3D' ? 95 : config.productionLevel === 'Polished' ? 60 : 25, color: 'bg-indigo-500' },
                { label: lang === 'th' ? 'กลไกแฝงและลีดเดอร์บอร์ด (Mechanics & Sync)' : 'Active Mechanics Count', val: Math.min(100, config.gameElements.length * 15 + (config.gameElements.includes('Multiplayer Mode') ? 30 : 0)), color: 'bg-violet-500' },
                { label: lang === 'th' ? 'จำนวนด่านลำดับการเรียนรู้ (Curriculum Stages)' : 'Curriculum Length', val: Math.min(100, (config.curriculumSequence?.length || 0) * 15), color: 'bg-emerald-500' }
              ].map((driver, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                    <span>{driver.label}</span>
                    <span>{driver.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${driver.color} rounded-full`} style={{ width: `${driver.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown Checklist of Specific Drivers */}
      <div className="space-y-2 bg-slate-50/50 rounded-2xl border border-slate-150 p-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span>{lang === 'th' ? 'ปัจจัยคำนวณรายละเอียด (Calculated Complexity Factors)' : 'Detailed Analysis Breakdown'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
          {analysis.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <div className="p-1 bg-violet-50 text-violet-600 rounded-lg shrink-0 mt-0.5">
                <CheckCircle className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-700 leading-normal">
                  {lang === 'th' ? reason.textTh : reason.textEn}
                </p>
              </div>
              <span className="text-[9px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded shrink-0">
                +{reason.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable recommendations for simplifying design */}
      <div className="bg-[#FAF9FF] border border-[#ECE4FF] rounded-2xl p-4 flex flex-col gap-2.5">
        <h4 className="text-[11px] font-black text-[#673AB7] uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-amber-500" />
          <span>{lang === 'th' ? 'วิธีลดความซับซ้อน (Actionable Optimization Tips)' : 'Tips to Simplify or Scale'}</span>
        </h4>
        <div className="space-y-1.5">
          {optimizationTips.map((tip, idx) => (
            <p key={idx} className="text-[10px] text-slate-600 font-semibold leading-relaxed">
              {lang === 'th' ? tip.textTh : tip.textEn}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
