import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Compass, HelpCircle, Sparkles, Zap, Key, BarChart3, AlertCircle } from 'lucide-react';

interface GuidedTourProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  lang: 'th' | 'en';
  onClose: () => void;
}

interface TourStep {
  targetId: string;
  titleEn: string;
  titleTh: string;
  descEn: string;
  descTh: string;
  icon: React.ComponentType<any>;
  wizardStep?: number; // Automatically switch the wizard tab to this step to showcase it!
}

export default function GuidedTour({ currentStep, setCurrentStep, lang, onClose }: GuidedTourProps) {
  const [tourIndex, setTourIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const tourSteps = useMemo<TourStep[]>(() => [
    {
      targetId: 'wizard-container',
      titleEn: 'Welcome to PRISM Build! ✦',
      titleTh: 'ยินดีต้อนรับสู่ PRISM Build! ✦',
      descEn: 'We will show you how to generate fully pedagogical educational prompt-based game specifications using our 8-step structured framework. Let\'s begin!',
      descTh: 'เราขอแนะนำการใช้งานโปรแกรมสร้างเกมระบบพรอมต์แชท AI เพื่อการเรียนรู้ทีละขั้นตอน เพื่อช่วยคุณสร้างโครงสร้างเกมที่สอดคล้องกับตัวชี้วัดภายใน 3 นาที!',
      icon: Compass
    },
    {
      targetId: 'step-node-1',
      titleEn: 'Step 1: Teaching Context',
      titleTh: 'ขั้นตอนที่ 1: บริบทคุณครูและวิชา',
      descEn: 'Specify teacher details, subjects, grade levels, and lesson topics to ground your game inside actual classroom reality.',
      descTh: 'ระบุชื่อผู้สอน ชั้นเรียน กลุ่มสาระวิชา และเนื้อหาการเรียนรู้หลัก เพื่อให้ AI เข้าใจกลุ่มเป้าหมายนักเรียนของคุณได้อย่างถูกต้อง',
      icon: HelpCircle,
      wizardStep: 1
    },
    {
      targetId: 'step-node-1_5',
      titleEn: 'Step 1.5: Curriculum Scaffolding',
      titleTh: 'ขั้นตอนที่ 1.5: ออกแบบลำดับด่าน',
      descEn: 'Define specific Levels or Missions with progressive difficulty. Scaffolding ensures students master easier tasks before attempting hard ones.',
      descTh: 'แบ่งระดับหัวข้อย่อยและด่านการเล่นจากง่ายไปยาก เพื่อสร้างการเรียนรู้แบบมีนั่งร้านช่วยเหลือ (Scaffolding) ให้เหมาะกับนักเรียนทุกคน',
      icon: Zap,
      wizardStep: 1.5
    },
    {
      targetId: 'step-node-2',
      titleEn: 'Step 2: Objectives & Core Actions',
      titleTh: 'ขั้นตอนที่ 2: วัตถุประสงค์และกริยาผู้เล่น',
      descEn: 'Define your Primary Educational Goals, Sub-objectives, and the Core game loop actions (what the students actively do in each round).',
      descTh: 'กำหนดเป้าหมายหลักของการเรียนรู้ และกริยาหลักในการเล่นเกม (Core Actions) เช่น การถอดรหัส การเปิดหน้าไพ่ หรือการดวลคำศัพท์ในเวลาที่จำกัด',
      icon: Sparkles,
      wizardStep: 2
    },
    {
      targetId: 'step-node-3',
      titleEn: 'Step 3: Gamification Style & Pattern',
      titleTh: 'ขั้นตอนที่ 3: สไตล์และแนวทางเกมพรอมต์',
      descEn: 'Select standard gameplay patterns (Puzzle & Challenge, Role-Play, Simulations, or Progression & Mastery) that match your lesson dynamics.',
      descTh: 'เลือกสไตล์การเล่นหลัก (เกมปริศนา, แสดงบทบาทสมมติ, เกมสวมวิญญาณจำลอง หรือการตะลุยด่านสะสมแต้ม) ที่ตอบโจทย์พฤติกรรมในชั้นเรียน',
      icon: Compass,
      wizardStep: 3
    },
    {
      targetId: 'step-node-4',
      titleEn: 'Step 4: Interactive Game Elements',
      titleTh: 'ขั้นตอนที่ 4: กลไกและองค์ประกอบเกม',
      descEn: 'Add elements like Timer Countdowns, Multiplayer modes, Badges, or Feedback Loops to boost engagement scores.',
      descTh: 'เลือกสวมใส่กลไกเกมเสริม เช่น ระบบจับเวลาถอยหลัง, โหมดช่วยเหลือเล่นเป็นกลุ่ม, การจัดอันดับลีดเดอร์บอร์ด หรือระบบรับของรางวัล',
      icon: Zap,
      wizardStep: 4
    },
    {
      targetId: 'step-node-5',
      titleEn: 'Step 5: Assessment & Rubrics',
      titleTh: 'ขั้นตอนที่ 5: เกณฑ์การให้คะแนนและรูบริกส์',
      descEn: 'Formulate qualitative scoring matrices (Rubrics) or performance checkpoints to evaluate students during and after gameplay.',
      descTh: 'ระบุเกณฑ์การวัดประเมินผลเชิงพฤติกรรม (Rubric Scores) และน้ำหนักตัวแปรความยากเพื่อการตัดคะแนนหลังจบรอบการแข่งขัน',
      icon: AlertCircle,
      wizardStep: 5
    },
    {
      targetId: 'step-node-6',
      titleEn: 'Step 6: Visual & Typography Theme',
      titleTh: 'ขั้นตอนที่ 6: ตกแต่งโทนสีและธีมสายตา',
      descEn: 'Customize the aesthetic vibe (Sci-Fi, Playful, Medieval, Retro) and selected color palettes to ensure high-contrast visual clarity.',
      descTh: 'ตกแต่งบรรยากาศและการบรรยายฉากของเกมพรอมต์ (แนวอวกาศย้อนยุค การ์ตูนพิกซาร์ หรือแฟนตาซีโบราณ) พร้อมเลือกชุดคู่สีและฟอนต์จำลองเพื่อกระตุ้นจินตนาการ',
      icon: Sparkles,
      wizardStep: 6
    },
    {
      targetId: 'step-node-7',
      titleEn: 'Step 7: Rationale & AI Prompt Check',
      titleTh: 'ขั้นตอนที่ 7: ตรวจสอบตรรกะความเชี่ยวชาญ',
      descEn: 'Review the educational design justification. You can modify rules manually or trigger smart contextual rewrites.',
      descTh: 'ระบบจะสรุปเหตุผลเชิงจิตวิทยาและการรองรับเด็กที่มีความบกพร่อง คุณสามารถปรับแต่งรายละเอียดแนวคิดเพิ่มเติมตรงนี้ได้ตลอดเวลา',
      icon: HelpCircle,
      wizardStep: 7
    },
    {
      targetId: 'step-node-8',
      titleEn: 'Step 8: Master Prompt Generation',
      titleTh: 'ขั้นตอนที่ 8: รับพร้อมต์คำสั่งระดับสูง',
      descEn: 'Generate the final engineered prompt. Copy to clipboard or export as a file to guide Gemini, ChatGPT, or Claude to run the game.',
      descTh: 'รับชุดคำสั่งสำเร็จรูปที่มีวิศวกรรมระดับสูง (Prompt Specification) คุณสามารถนำไปคัดลอกส่งเข้าช่องแชต AI เพื่อเริ่มรันกิจกรรมด่านแรกได้ทันที',
      icon: Zap,
      wizardStep: 8
    },
    {
      targetId: 'gamification-analytics-card',
      titleEn: 'Gamification Analytics Dashboard',
      titleTh: 'แดชบอร์ดวัดดัชนีคะแนนการกระตุ้น',
      descEn: 'Our live AI tracks your choices and calculates a weighted Engagement Score, behavioral driving pillars, and VARK learning style compatibility.',
      descTh: 'ระบบจะวิเคราะห์ความคุ้มค่าของการใส่กลไก คำนวณคะแนนมีส่วนร่วมเป็นเปอร์เซ็นต์ พร้อมสรุปว่าเหมาะสมกับกลุ่มเด็กหัดฟัง ดู หรือลงมือทำอย่างไร',
      icon: BarChart3
    },
    {
      targetId: 'btn-api-key',
      titleEn: 'Enhance with Gemini AI',
      titleTh: 'ปลดล็อกการเขียนด้วยปัญญาประดิษฐ์',
      descEn: 'Input your Google Gemini API key to trigger real-time AI prompt enrichment at Step 7/8. Highly recommended!',
      descTh: 'ติ๊กปุ่มนี้เพื่อใส่รหัส Google Gemini Key ซึ่งจะช่วยให้ปุ่มเสริมไอเดียด้วย AI ปลดล็อกการเขียนที่สวยหรูขึ้น 3 เท่าตัวแบบเรียลไทม์',
      icon: Key
    }
  ], [lang]);

  const activeStep = tourSteps[tourIndex];

  // Monitor target elements and update target box geometry
  useEffect(() => {
    const handleUpdate = () => {
      if (!activeStep) return;

      // Handle automatic wizard step switching if defined in tour step config
      if (activeStep.wizardStep !== undefined && currentStep !== activeStep.wizardStep) {
        setCurrentStep(activeStep.wizardStep);
      }

      // Small delay to allow react to finish rendering the newly switched step view
      setTimeout(() => {
        const el = document.getElementById(activeStep.targetId);
        if (el) {
          // Scroll targeted element into view nicely
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = el.getBoundingClientRect();
          setHighlightRect(rect);
        } else {
          // Element not found on DOM, render centered highlight or clear it
          setHighlightRect(null);
        }
      }, 100);
    };

    handleUpdate();

    // Listen to resize and scroll
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [tourIndex, activeStep, currentStep, setCurrentStep]);

  // Listen for window resize to handle tooltip dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex(tourIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (tourIndex > 0) {
      setTourIndex(tourIndex - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  // Determine relative position for the tooltip card
  const tooltipStyles = useMemo(() => {
    if (!highlightRect) {
      // Fallback center of the screen
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        width: 'min(440px, 92vw)',
      };
    }

    const margin = 16;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Check if there is space below the target
    const spaceBelow = windowSize.height - highlightRect.bottom;
    const spaceAbove = highlightRect.top;

    let top = 0;
    let left = Math.max(margin, Math.min(highlightRect.left + (highlightRect.width - 440) / 2, windowSize.width - 440 - margin));

    if (spaceBelow > 220 || spaceBelow >= spaceAbove) {
      // Place below
      top = highlightRect.bottom + scrollY + margin;
    } else {
      // Place above
      top = highlightRect.top + scrollY - 220 - margin;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'absolute' as const,
      width: 'min(440px, 92vw)',
    };
  }, [highlightRect, windowSize]);

  const StepIcon = activeStep ? activeStep.icon : Compass;

  return (
    <div id="guided-tour-overlay" className="fixed inset-0 z-[100] pointer-events-auto select-none font-sans">
      
      {/* SVG Mask overlay with nice hollow cutting */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'opacity(0.7)' }}>
        <defs>
          <mask id="tour-mask">
            {/* Base background covers everything (white = solid mask) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Transparent hollow box cutout for target element (black = transparent hole) */}
            {highlightRect && (
              <rect
                x={highlightRect.left - 8}
                y={highlightRect.top - 8}
                width={highlightRect.width + 16}
                height={highlightRect.height + 16}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Render actual dark dim background */}
        <rect x="0" y="0" width="100%" height="100%" fill="#0F172A" mask="url(#tour-mask)" />
      </svg>

      {/* Interactive highlight click guard / border */}
      {highlightRect && (
        <div
          className="absolute border-4 border-indigo-400 rounded-[20px] pointer-events-none transition-all duration-300 animate-pulse shadow-[0_0_24px_rgba(99,102,241,0.4)]"
          style={{
            top: `${highlightRect.top + window.scrollY - 10}px`,
            left: `${highlightRect.left - 10}px`,
            width: `${highlightRect.width + 20}px`,
            height: `${highlightRect.height + 20}px`,
          }}
        />
      )}

      {/* Floating Floating Tooltip Dialog */}
      <div
        ref={tooltipRef}
        style={tooltipStyles}
        className="bg-white text-slate-800 p-5 rounded-3xl shadow-2xl border border-slate-150 pointer-events-auto z-[101] flex flex-col gap-4 animate-scale-up"
      >
        {/* Header Indicator */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <StepIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
              {lang === 'th' ? `ขั้นแนะนำที่ ${tourIndex + 1}/${tourSteps.length}` : `TOUR STEP ${tourIndex + 1}/${tourSteps.length}`}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
            title="Close Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-1 select-text">
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
            {lang === 'th' ? activeStep.titleTh : activeStep.titleEn}
          </h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {lang === 'th' ? activeStep.descTh : activeStep.descEn}
          </p>
        </div>

        {/* Bottom controls bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-1">
          {/* Skip / Exit button */}
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-bold hover:underline cursor-pointer"
          >
            {lang === 'th' ? 'ข้ามทัวร์' : 'Skip'}
          </button>

          {/* Prev/Next Navigation Controls */}
          <div className="flex items-center gap-2">
            {tourIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'th' ? 'ย้อนกลับ' : 'Back'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-black shadow-md transition-all flex items-center gap-1 cursor-pointer scale-100 active:scale-95"
            >
              <span>{tourIndex === tourSteps.length - 1 ? (lang === 'th' ? 'เสร็จสิ้น ✦' : 'Finish ✦') : (lang === 'th' ? 'ถัดไป' : 'Next')}</span>
              {tourIndex < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
