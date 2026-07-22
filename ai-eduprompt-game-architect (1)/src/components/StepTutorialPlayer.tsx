import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Tv, Sparkles, Languages, Check, ArrowRight,
  Info, Minimize2, Maximize2, Cpu, ExternalLink, HelpCircle
} from 'lucide-react';
import { GamePromptConfig } from '../types';

interface StepTutorialPlayerProps {
  currentStep: number;
  lang: 'th' | 'en';
  onApplyPreset?: (presetConfig: Partial<GamePromptConfig>) => void;
}

interface CaptionTrack {
  start: number;
  end: number;
  textTh: string;
  textEn: string;
}

// Structured captions for each step, tailored to teach the user exactly how to configure the section
const TUTORIAL_CAPTIONS: Record<number, CaptionTrack[]> = {
  1: [
    { start: 0, end: 5, textTh: "ยินดีต้อนรับสู่ขั้นตอนที่ 1: การกำหนดบริบท เริ่มต้นจากใส่ชื่อผู้สอนและเลือกอวตาร์ของคุณ", textEn: "Welcome to Step 1: Context definition. Start by entering your educator name and choosing an avatar." },
    { start: 5, end: 12, textTh: "เลือกกลุ่มวิชาหรือระบุวิชาหลัก เช่น คณิตศาสตร์ วิทยาศาสตร์ ภาษาอังกฤษ หรือพิมพ์วิชาที่คุณต้องการเอง", textEn: "Select a primary subject preset (Math, Science, English, etc.) or enter your custom classroom subject." },
    { start: 12, end: 19, textTh: "กำหนดหัวข้อหลักของคาบเรียนและสเกลจำลองระดับ CEFR เพื่อให้ตรงกลุ่มเป้าหมายผู้เรียน", textEn: "Specify your main lesson topic and the target student's proficiency level or CEFR scale." },
    { start: 19, end: 26, textTh: "ปรับเปลี่ยนจำนวนนักเรียนต่อกลุ่มเพื่อให้ระบบคำนวณอุปกรณ์และเตรียมการจัดกลุ่มเกมได้อย่างสมดุล", textEn: "Configure the student group size so the AI can balance the card counts and meeple distribution." },
    { start: 26, end: 30, textTh: "คุณสามารถลองกดใช้เทมเพลตเริ่มต้นยอดนิยมด้านบนเพื่อทดสอบและเรียนรู้วิธีการเขียนได้อย่างรวดเร็ว", textEn: "Tip: Click any of the Starter Templates above to instantly populate the form with high-quality presets!" }
  ],
  1.5: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 1.5: ลำดับการเรียนรู้และระดับในเกม สำหรับจัดวางโครงสร้างเนื้อหาของแต่ละคาบเรียน", textEn: "Step 1.5: Learning Sequence & Game Levels. Organize your modular curriculum stages." },
    { start: 6, end: 14, textTh: "คุณสามารถลากและวางเพื่อสลับความยากง่ายของเนื้อหา หรือใช้ปุ่มลูกศรเพื่อเลื่อนบทเรียนก่อนหลังได้อย่างง่ายดาย", textEn: "Simply drag and drop learning sequence blocks, or use the arrow buttons to quickly shift lesson priorities." },
    { start: 14, end: 22, textTh: "เลือกสมรรถนะแกนหลักและทักษะ 3R8C ที่ต้องการเสริม เช่น การคิดเชิงวิเคราะห์ หรือการทำงานร่วมกันเป็นทีม", textEn: "Select core competencies and target 3R8C soft skills (like critical thinking or team collaboration) to embed." },
    { start: 22, end: 30, textTh: "ระบบจะนำทักษะและแผนบทเรียนเหล่านี้ไปออกแบบเป็นเลเวลความท้าทายในเกมระบบพรอมต์แชท AI ต่อไปโดยอัตโนมัติ", textEn: "The generator will utilize these levels and skills to structure appropriate game master prompts." }
  ],
  2: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 2: วัตถุประสงค์และกลยุทธ์เกม มาตั้งเป้าหมายหลักของการสร้างบทเรียนนี้กัน", textEn: "Step 2: Objectives & Strategies. Define what victory means in both your classroom and the game." },
    { start: 6, end: 13, textTh: "เขียนวัตถุประสงค์หลักเชิงพฤติกรรม เช่น 'สามารถอธิบายปฏิกิริยาเคมีขั้นพื้นฐานได้หลังจบเกม'", textEn: "Input the primary learning objective, e.g., 'Mastering basic chemical reactions and balancing equations'." },
    { start: 13, end: 21, textTh: "กำหนดพฤติกรรมการเล่นที่ต้องการให้เกิดขึ้น เช่น การแลกเปลี่ยนการ์ด การประมูล หรือการบุกยึดพื้นที่ร่วมกัน", textEn: "Specify the core player actions—like card trading, secret auctions, or cooperative area control." },
    { start: 21, end: 30, textTh: "ข้อมูลเป้าหมายนี้เป็นหัวใจสำคัญที่กระตุ้นให้ผู้เรียนเกิดการเรียนรู้ผ่านกลไกความสนุกสนานอย่างลงตัว", textEn: "These objectives are the heart of the design, ensuring play leads directly to curriculum goals." }
  ],
  3: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 3: เลือกรูปแบบแนวเกมพรอมต์แชท เลือกแม่แบบการเล่นที่แมตช์กับเป้าหมายการเรียนการสอนของคุณ", textEn: "Step 3: Select Prompt Game Pattern. Pick a structured template that matches your subject style." },
    { start: 6, end: 13, textTh: "เรามีแพทเทิร์นสำเร็จรูป เช่น RPG ตะลุยด่าน, Deck Builder จัดการ์ด, Worker Placement บริหารทรัพยากร และอื่นๆ", textEn: "Presets include RPG Quest, Deck Builders, Resource Worker Placement, Trivia Battle, or Trading Cards." },
    { start: 13, end: 21, textTh: "พิจารณาเกณฑ์ความยาก อายุผู้เรียนที่เหมาะสม และระยะเวลาการเล่นประกอบการตัดสินใจในแต่ละรายการ", textEn: "Examine difficulty levels, recommended player age, and typical game duration on each card's overview." },
    { start: 21, end: 30, textTh: "คลิกเลือกแพทเทิร์นที่สนใจเพื่อให้ระบบเซ็ตอัปโครงสร้างสถาปัตยกรรมกติกาพื้นฐานให้ทันที", textEn: "Click to select a pattern, and the system will automatically pre-load optimized interactive game structures." }
  ],
  4: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 4: องค์ประกอบของเกม กำหนดรายการและชื่ออุปกรณ์ทางกายภาพที่จะใช้ออกแบบจริง", textEn: "Step 4: Core Game Elements. Set physical items like cards, token chips, dice, or custom meeples." },
    { start: 6, end: 13, textTh: "คุณสามารถตั้งปริมาณการ์ด จำนวนหมากผู้เล่น และตั้งชื่อเหรียญคะแนนในเกมให้สมจริงเข้ากับธีมบทเรียนได้", textEn: "Adjust card count, select the dice type, and customize token labels (e.g., 'Element Chips' or 'Gold Coins')." },
    { start: 13, end: 22, textTh: "กำหนดกฎการแพ้ชนะหรือคะแนนสะสมที่ใช้ เพื่อให้เด็กๆ ทราบเส้นทางแห่งการบรรลุชัยชนะในการเล่น", textEn: "Specify exact winning conditions and resource targets so students clearly understand the path to victory." },
    { start: 22, end: 30, textTh: "การระบุองค์ประกอบเหล่านี้อย่างรัดกุมช่วยให้ได้คู่มือเกมที่สามารถนำไปจัดพิมพ์หรือสร้างขึ้นเล่นได้ง่าย", textEn: "Defining clear elements helps the AI generate precise layouts you can easily prototype or print." }
  ],
  5: [
    { start: 0, end: 7, textTh: "ขั้นตอนที่ 5: การออกแบบสไตล์ภาพและ UI ปรับลุคแอนด์ฟีลของตัวเกมให้มีความเป็นมืออาชีพ", textEn: "Step 5: Visual Style & UI Design. Make your game look appealing, professional, and visually unified." },
    { start: 7, end: 14, textTh: "เลือกจานสีสำเร็จรูป เช่น 'Cyberpunk Neon' หรือ 'Retro Pixel' เพื่อกำหนดแนวทางการบรรยายฉากของเกมพรอมต์", textEn: "Select color presets like 'Neon Cyberpunk' or 'Forest Natural' to automatically guide the interactive theme." },
    { start: 14, end: 22, textTh: "ลากแอดออนเสริมสุดว้าวจากด็อกฝั่งซ้าย ไปหย่อนลงในช่องพื้นที่พรีวิวจำลองหน้าจอด้านขวาเพื่อจัดวางตำแหน่ง", textEn: "Drag high-fidelity addons from the left dock and drop them into the simulator zones on the right!" },
    { start: 22, end: 30, textTh: "สามารถเพิ่ม แอนิเมชัน พารัลแลกซ์ หรือปุ่มเอฟเฟกต์เสียงเพื่อให้ได้รูปแบบสกรีนการทำงานที่สวยเด่นยิ่งขึ้น", textEn: "Mix and match smooth animations, custom fonts, and parallax scroll modules to preview screen positioning." }
  ],
  6: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 6: เอฟเฟกต์และเทคโนโลยี เลือกเพิ่มระดับความพรีเมียมให้กติกาน่าตื่นเต้นขึ้น", textEn: "Step 6: Visual Effects & Technology. Select immersive capabilities to hook your students." },
    { start: 6, end: 13, textTh: "เลือกระดับการผลิตงานสร้าง ตั้งแต่ 'ร่างกติกาอย่างง่าย' ไปจนถึง 'แอปจำลองแบบโต้ตอบลื่นไหลระดับโปร'", textEn: "Select production standards, ranging from a raw paper draft up to a fully interactive digital prototype." },
    { start: 13, end: 21, textTh: "เปิดใช้งานเอฟเฟกต์แอนิเมชัน ระบบเสียงซาวด์แทร็กแบ็กกราวนด์ และเสียงสังเคราะห์อ่านโจทย์คำถามวิชาการ", textEn: "Toggle responsive visual feedback, premium ambient music, or text-to-speech voice narrations." },
    { start: 21, end: 30, textTh: "ระบบจะผนวกฟังก์ชันระดับเทพเหล่านี้เข้าไปในสคริปต์โค้ดที่พร้อมนำไปใช้พัฒนาจริงได้อย่างสมบูรณ์", textEn: "The generator will weave these production parameters directly into your ready-to-deploy specifications." }
  ],
  7: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 7: ตรวจสอบแผนการออกแบบ ตรวจทานข้อมูลรวมทั้งหมดที่คุณได้ปรับแต่งมาอย่างละเอียด", textEn: "Step 7: Review Design. Audit your structured blueprint before sending it to the AI." },
    { start: 6, end: 13, textTh: "เช็กเกจวัดความซับซ้อนของหลักสูตร เพื่อประเมินระดับภาระการรับรู้และความยากต่อครูและผู้เล่น", textEn: "Check the Complexity Meter to inspect cognitive load, instructional density, and game rules balance." },
    { start: 13, end: 21, textTh: "คุณสามารถคัดลอกลิงก์แชร์โครงการให้ผู้สอนท่านอื่น หรือส่งออกไฟล์ตั้งค่า JSON ไปจัดเก็บสำรองได้", textEn: "Generate custom share links to collaborate with fellow teachers, or export the raw design JSON." },
    { start: 21, end: 30, textTh: "หากทุกอย่างเรียบร้อย คลิกปุ่มขั้นตอนถัดไปเพื่อนำพิมพ์เขียวนี้ไปสังเคราะห์เขียนเป็น Prompt ที่สมบูรณ์แบบ!", textEn: "When satisfied, continue to the final step to compile these specifications into an advanced prompt!" }
  ],
  8: [
    { start: 0, end: 6, textTh: "ขั้นตอนที่ 8: พรอมต์คำสั่งสังเคราะห์ นำเสนอสคริปต์กติกาที่อัดแน่นด้วยโครงสร้างทางวิชาการและกลไกเกม", textEn: "Step 8: Complete AI Prompt. Your high-fidelity engineered curriculum prompt is ready." },
    { start: 6, end: 14, textTh: "คลิกปุ่มสีม่วง 'เพิ่มประสิทธิภาพด้วย Gemini' ระบบจะนำโมเดล AI มาขัดเกลาบทเรียนและรายละเอียดให้สมบูรณ์ขึ้น", textEn: "Click the 'Enhance with Gemini' button to refine learning loops and expand mechanics with state-of-the-art AI." },
    { start: 14, end: 22, textTh: "ตรวจประเมินร่างผลลัพธ์ดราฟต์แรก ให้คะแนนผลผลิต หรือป้อนคำแนะนำสั่งแก้ไขเพิ่มเติมเพื่อให้ได้ความเป๊ะที่ต้องการ", textEn: "Analyze the output, rate the quality with up/down votes, or submit custom revision instructions." },
    { start: 22, end: 30, textTh: "จากนั้นคลิกปุ่ม 'คัดลอกพรอมต์' นำไปวางในเครื่องมือปัญญาประดิษฐ์เพื่อเริ่มเล่นและทดสอบเกมจริงของคุณทันที!", textEn: "Finally, click 'Copy Prompt' to run it in your favorite LLM or export to start playtesting immediately!" }
  ]
};

export default function StepTutorialPlayer({ currentStep, lang, onApplyPreset }: StepTutorialPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCC, setShowCC] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDuration = 30; // 30 seconds tutorial video loop

  // Get current caption
  const captions = TUTORIAL_CAPTIONS[currentStep] || [];
  const currentCaption = captions.find(c => currentTime >= c.start && currentTime < c.end);

  // Interval for updating video progress based on speed
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 100 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= maxDuration) {
            return 0; // loop
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Reset progress when step changes
  useEffect(() => {
    setCurrentTime(0);
    // Auto play once when expanding or changing step if user wants to see
  }, [currentStep]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const skipTime = (amount: number) => {
    setCurrentTime(prev => {
      const next = prev + amount;
      if (next < 0) return 0;
      if (next > maxDuration) return maxDuration;
      return Math.round(next * 10) / 10;
    });
  };

  // Preset payload generator matching the active tutorial demonstration to help user instantly copy ideas!
  const getTutorialPreset = (): Partial<GamePromptConfig> | null => {
    switch (currentStep) {
      case 1:
        return {
          teacherName: lang === 'th' ? 'ครูสมชาย ณ แสนรัก' : 'Kru Somchai',
          subject: 'Science',
          customSubject: '',
          topic: lang === 'th' ? 'การสังเคราะห์แสงและการทำงานของใบไม้' : 'Photosynthesis and Leaf Biology',
          cefrLevel: 'A2',
          studentsCount: 30,
          gameLanguage: 'th'
        };
      case 1.5:
        return {
          learningStyles: ['Visual', 'Social/Interpersonal'],
          coreCompetencies: ['Critical Thinking', 'Communication'],
          skills3r8c: ['Critical Thinking', 'Collaboration', 'Compassion']
        };
      case 2:
        return {
          conceptSummary: lang === 'th' ? 'เกมผจญภัยในเซลล์พืชเพื่อประกอบอาหารจากการสังเคราะห์แสง' : 'A cooperative race inside a plant cell to capture light and produce glucose.',
          primaryGoal: lang === 'th' ? 'เข้าใจปัจจัยสี่ของการสังเคราะห์แสงพืชอย่างถูกต้อง' : 'Understand the four core inputs and outputs of photosynthesis.',
          subObjectives: lang === 'th' ? 'แยกแยะก๊าซคาร์บอนไดออกไซด์ และการทำงานของคลอโรฟิลล์' : 'Distinguish carbon dioxide molecules from oxygen output.',
          coreActions: lang === 'th' ? 'แลกเปลี่ยนโมเลกุลน้ำ หลบหลีกแมลงศัตรูพืช และเปิดการ์ดแสงแดด' : 'Trade water molecules, dodge shadow pests, and collect light tokens.'
        };
      case 3:
        return {
          gamePattern: 'Cooperative / Team-vs-Team'
        };
      case 4:
        return {
          gameElements: [
            lang === 'th' ? 'การ์ดภารกิจ 60 ใบ' : '60 Challenge Cards',
            lang === 'th' ? 'เหรียญพลังงานกลูโคส 45 ชิ้น' : '45 Glucose Energy Coins',
            lang === 'th' ? 'หมากผู้เล่น 4 ตัว' : '4 Player Meeples',
            lang === 'th' ? 'กระดานพืชวงกลมและลูกเต๋า D6' : 'Circular Plant Board & D6 Dice',
            lang === 'th' ? 'เงื่อนไขชนะ: รวบรวมน้ำตาลครบ 5 หน่วยก่อนหนอนทำลายใบไม้' : 'Win Condition: Collect 5 glucose units before pests destroy the leaf'
          ]
        };
      case 5:
        return {
          colorPalette: 'nature-harmony',
          typography: 'FC Iconic / Rounded Playful',
          visualStyle: 'Semi-realistic watercolor plant diagrams',
          addons: ['3D animated background', 'Depth & parallax scrolling', 'Confetti & particle bursts']
        };
      case 6:
        return {
          productionLevel: 'interactive-high',
          animations: 'Responsive spring physics using GSAP',
          addons: ['Sound effects & music', 'Voice narration']
        };
      default:
        return null;
    }
  };

  const handleApplyPreset = () => {
    const preset = getTutorialPreset();
    if (preset && onApplyPreset) {
      onApplyPreset(preset);
    }
  };

  // Helper values for rendering cursor and highlighting items based on currentTime
  // This calculates coordinates for the mouse cursor inside the simulated video frame
  const getCursorCoordinates = () => {
    // Return x%, y% inside the simulated window
    if (currentStep === 1) {
      if (currentTime < 6) return { x: 30, y: 35, clicking: false }; // hovering over name input
      if (currentTime >= 6 && currentTime < 10) return { x: 35, y: 35, clicking: true }; // typing name
      if (currentTime >= 10 && currentTime < 18) return { x: 65, y: 55, clicking: false }; // heading to Math preset
      if (currentTime >= 18 && currentTime < 22) return { x: 65, y: 58, clicking: true }; // clicking Science preset
      return { x: 50, y: 80, clicking: false }; // sliding students count
    }
    if (currentStep === 1.5) {
      if (currentTime < 8) return { x: 25, y: 40, clicking: false }; // hover on card
      if (currentTime >= 8 && currentTime < 16) return { x: 25, y: 55, clicking: true }; // dragging card
      return { x: 70, y: 65, clicking: true }; // checking soft skills
    }
    if (currentStep === 5) {
      if (currentTime < 10) return { x: 20, y: 45, clicking: false }; // hover colors
      if (currentTime >= 10 && currentTime < 20) return { x: 15, y: 70, clicking: true }; // drag-and-drop 3D background addon
      return { x: 60, y: 50, clicking: false }; // drop on canvas
    }
    // Default circular hover pattern
    const radius = 25;
    const angle = (currentTime / 30) * Math.PI * 8; // circles around
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.6,
      clicking: Math.sin(angle * 2) > 0.8
    };
  };

  const cursor = getCursorCoordinates();

  return (
    <div className="mb-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
      
      {/* Top Banner Button: Expand/Collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-950/60 hover:bg-slate-950/90 transition-all text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <span>{lang === 'th' ? '💡 แนะนำการกรอกทีละขั้นตอน (วิดีโออนิเมชันจำลอง)' : '💡 Walkthrough Tutorial Video Simulator'}</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-black tracking-wider animate-pulse">
                {lang === 'th' ? 'สอนฟรี' : 'Free Guide'}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
              {lang === 'th' 
                ? 'ชมวิธีกรอกข้อมูลที่ถูกต้องเพื่อพรอมต์ที่ดีที่สุด พร้อมปุ่มกดใช้ตัวอย่างทันที!' 
                : 'Watch how to effectively fill out this step to engineering an epic syllabus prompt!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-indigo-400 text-xs font-black">
          <span>{isExpanded ? (lang === 'th' ? 'ซ่อน' : 'Collapse') : (lang === 'th' ? 'เล่นวิดีโอ' : 'Play Walkthrough')}</span>
          <div className={`p-1 bg-indigo-950 rounded-lg transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </button>

      {/* Expanded Interactive Video Tutorial Player */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/40">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Player Viewport (16:9 Screen Simulation) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div 
                className="w-full aspect-[16/9] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-3 select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                
                {/* 1. SCREEN HEADER (MOCK APP CHASSIS) */}
                <div className="flex items-center justify-between relative z-30">
                  <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/80 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                      PRISM LABS SIMULATOR V1
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800/80 shadow-md">
                    <Cpu className="w-3 h-3 text-fuchsia-400" />
                    <span className="text-[9px] font-black text-slate-300">
                      {lang === 'th' ? `สาธิตด่านที่ ${currentStep}` : `Demo Step ${currentStep}`}
                    </span>
                  </div>
                </div>

                {/* 2. MAIN SIMULATION INTERFACE CANVAS (BASED ON STEP) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-slate-200">
                  
                  {/* Step 1 Simulation: Avatar and Topic inputs */}
                  {currentStep === 1 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2.5 text-left text-[10px] shadow-lg relative">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-sm">👩‍🏫</span>
                        <span className="font-extrabold text-slate-200">Step 1: Classroom Setup</span>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Teacher & Designer Name</span>
                        <div className="h-6 px-2 bg-slate-950 border border-slate-800 rounded-md flex items-center text-indigo-300 font-mono text-[9px]">
                          {currentTime >= 6 ? (currentTime >= 10 ? 'Kru Somchai' : 'Kru Somch_') : ''}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <div className={`p-1 rounded border text-center transition-all ${currentTime >= 18 ? 'border-slate-800 bg-slate-950 opacity-40' : 'border-indigo-900 bg-indigo-950/20 text-indigo-300'}`}>
                          Math Preset
                        </div>
                        <div className={`p-1 rounded border text-center transition-all ${currentTime >= 18 ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-slate-800 bg-slate-950'}`}>
                          Science
                        </div>
                        <div className="p-1 rounded border border-slate-800 bg-slate-950 text-center text-slate-600">
                          English
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black text-slate-500">
                          <span>CLASSROOM STUDENTS COUNT</span>
                          <span className="text-indigo-400">{currentTime >= 22 ? '30 Learners' : '20 Learners'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full relative">
                          <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full transition-all" style={{ width: currentTime >= 22 ? '65%' : '40%' }} />
                          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 transition-all shadow" style={{ left: currentTime >= 22 ? '65%' : '40%' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1.5 Simulation: Learning sequence cards */}
                  {currentStep === 1.5 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2.5 text-left text-[10px] shadow-lg relative">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Curriculum Sequence Blocks</span>
                      
                      <div className="space-y-1.5">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[8px] font-extrabold text-slate-400">
                          <span>🎯 Introduction to Ecosystems</span>
                          <span className="text-[7px] bg-slate-800 px-1 rounded">Difficulty: 1</span>
                        </div>
                        
                        {/* Interactive Drag Effect */}
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between text-[8px] font-extrabold transition-all duration-300 ${
                          currentTime >= 8 && currentTime < 16
                            ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 translate-y-3 rotate-1 scale-95 shadow-lg'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}>
                          <span>⚡ Chemical Reactions Core Concept</span>
                          <span className="text-[7px] bg-indigo-900/30 px-1 rounded text-indigo-400">Difficulty: 3</span>
                        </div>

                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[8px] font-extrabold text-slate-400">
                          <span>🏆 Boss Battle Challenge: Synthesize Glucose</span>
                          <span className="text-[7px] bg-slate-800 px-1 rounded">Difficulty: 5</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <div className={`px-2 py-0.5 rounded text-[8px] border font-black transition-all ${currentTime >= 16 ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                          ✓ Critical Thinking
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[8px] border font-black transition-all ${currentTime >= 19 ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                          ✓ Collaboration
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Simulation: Goals writing inputs */}
                  {currentStep === 2 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2.5 text-left text-[10px] shadow-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Strategic Learning Intent</span>
                      <div className="space-y-2">
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-slate-400 font-bold">PRIMARY LEARNING GOAL</label>
                          <div className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[8px] font-mono min-h-6">
                            {currentTime >= 6 ? 'Master basic chemical reactions and balancing equations' : ''}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[8px] text-slate-400 font-bold">CORE BOARD GAME ACTIONS</label>
                          <div className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[8px] font-mono min-h-6">
                            {currentTime >= 15 ? 'Trade elements to form compounds & gain bonus points' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Simulation: Game Pattern Cards */}
                  {currentStep === 3 && (
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                      <div className={`p-2 rounded-xl border text-left space-y-1 bg-slate-900/40 border-slate-800`}>
                        <div className="flex justify-between items-center">
                          <span className="text-base">⚔️</span>
                          <span className="text-[6px] bg-slate-800 px-1 rounded uppercase">Medium</span>
                        </div>
                        <h4 className="text-[8px] font-black text-slate-300">RPG Dungeon Crawl</h4>
                        <p className="text-[6px] text-slate-500">Fight pests & solve tasks on pathways.</p>
                      </div>

                      <div className={`p-2 rounded-xl border text-left space-y-1 transition-all duration-300 ${
                        currentTime >= 12 ? 'border-indigo-500 bg-indigo-950/30 text-white ring-2 ring-indigo-500/20' : 'border-slate-800 bg-slate-900/40'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-indigo-400">🃏</span>
                          <span className="text-[6px] bg-indigo-500/20 text-indigo-300 px-1 rounded uppercase font-bold">High Skill</span>
                        </div>
                        <h4 className="text-[8px] font-black text-indigo-300">Cooperative Deck-builder</h4>
                        <p className="text-[6px] text-slate-400">Trade element cards & balance bonds.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Simulation: Core elements counters */}
                  {currentStep === 4 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2.5 text-left text-[10px] shadow-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Board Game Element Balancing</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-1 rounded bg-slate-950 border border-slate-800">
                          <span className="font-bold">🃏 Card Deck Size</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 font-extrabold">-</span>
                            <span className="text-indigo-400 font-mono font-bold">{currentTime >= 12 ? '60 Cards' : '40 Cards'}</span>
                            <span className="text-indigo-400 font-extrabold">+</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-1 rounded bg-slate-950 border border-slate-800">
                          <span className="font-bold">🪙 Token Name Label</span>
                          <div className="text-indigo-300 font-mono text-[8px]">
                            {currentTime >= 18 ? 'Glucose Energy Coins' : 'Gold Coins'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5 Simulation: Visual theme layout drag-and-drop */}
                  {currentStep === 5 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-left text-[10px] shadow-lg flex gap-3 relative">
                      <div className="w-1/3 space-y-1 border-r border-slate-800 pr-2">
                        <span className="text-[6px] font-black text-slate-500 uppercase">Addons Dock</span>
                        <div className={`p-1 rounded text-[7px] text-center font-bold border transition-all ${
                          currentTime >= 12 ? 'border-dashed border-slate-800 bg-slate-950 text-slate-700 scale-90' : 'border-indigo-500 bg-indigo-950/20 text-indigo-400'
                        }`}>
                          🌐 3D Background
                        </div>
                        <div className="p-1 rounded text-[7px] border border-slate-800 bg-slate-950 text-slate-500 text-center">
                          🎉 Particle Bursts
                        </div>
                      </div>

                      <div className="w-2/3 space-y-1.5 flex flex-col justify-between">
                        <span className="text-[6px] font-black text-slate-400 uppercase">Interactive Screen Preview</span>
                        <div className="border border-dashed border-slate-800 rounded h-12 flex items-center justify-center relative bg-slate-950 overflow-hidden">
                          {currentTime >= 15 ? (
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-fuchsia-900/20 flex flex-col items-center justify-center text-[7px] text-indigo-400 font-black animate-pulse">
                              <span>🌐 Grid Canvas Render Active</span>
                            </div>
                          ) : (
                            <span className="text-[6px] text-slate-600">Drag & Drop zone here</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 6 Simulation: Tech Stack toggles */}
                  {currentStep === 6 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2 text-left text-[10px] shadow-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Production Level Switches</span>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300">🎵 Background Music & FX</span>
                          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${currentTime >= 10 ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${currentTime >= 10 ? 'translate-x-4' : ''}`} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300">🗣️ AI Voice Narration</span>
                          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${currentTime >= 18 ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${currentTime >= 18 ? 'translate-x-4' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 7 Simulation: Review Gauges & metrics */}
                  {currentStep === 7 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2 text-left text-[10px] shadow-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Complexity Gauge</span>
                        <h4 className="text-[10px] font-black text-slate-200">Medium Difficulty</h4>
                        <p className="text-[6px] text-slate-500 leading-normal">Balanced player learning curve.</p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center relative rotate-45 animate-spin-slow">
                        <span className="text-[8px] font-extrabold text-indigo-400 rotate-[-45deg]">65%</span>
                      </div>
                    </div>
                  )}

                  {/* Step 8 Simulation: Gemini Prompts enhance animation */}
                  {currentStep === 8 && (
                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left text-[10px] shadow-lg relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1.5">
                        <span className="text-[8px] font-black text-indigo-400">GENERATE ACTIVE BOARD GAME SYLLABUS</span>
                        <span className="text-[6px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 rounded text-indigo-300 font-bold">Copy Ready</span>
                      </div>
                      <div className="bg-slate-950 p-2 border border-slate-800 rounded font-mono text-[7px] text-slate-400 h-16 overflow-hidden leading-relaxed">
                        {currentTime >= 10 ? (
                          <span className="text-white">
                            <span className="text-indigo-400 font-bold"># OPTIMIZED BY GEMINI 1.5 PRO:</span> [Role: Academic Boardgame Designer] We are designing a photosynthesis cooperative strategy deckbuilder curriculum matching Kru Somchais needs...
                          </span>
                        ) : (
                          'We are creating a board game syllabus layout. Teacher Name: Kru Somchai. Subject: Science. Topic: Photosynthesis...'
                        )}
                      </div>
                      {currentTime >= 8 && currentTime < 14 && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                          <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                          <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Enhancing Prompt...</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* 3. SIMULATED FLOATING CURSOR */}
                <div 
                  className="absolute pointer-events-none transition-all duration-100 ease-out z-40 select-none"
                  style={{ 
                    left: `${cursor.x}%`, 
                    top: `${cursor.y}%`,
                  }}
                >
                  <svg className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24" fill="none">
                    <path d="M4 3l14 8.5-6 2.5 4 6.5-2.5 1.5-4-6.5-5.5 5.5v-18z" fill="white" stroke="black" strokeWidth="1.5" />
                  </svg>
                  {/* Click ripples */}
                  {cursor.clicking && (
                    <span className="absolute -left-1 -top-1 w-7 h-7 rounded-full bg-indigo-500/40 border border-indigo-500/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* 4. SUBTITLES / CAPTION BAR OVERLAY (Optional) */}
                {showCC && currentCaption && (
                  <div className="absolute bottom-2 inset-x-2 z-30 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-xl text-center shadow-lg">
                    <p className="text-[10px] md:text-xs font-bold leading-relaxed text-slate-200">
                      {lang === 'th' ? currentCaption.textTh : currentCaption.textEn}
                    </p>
                  </div>
                )}

              </div>

              {/* VIDEO PLAYER BOTTOM CONTROLS CHASSIS */}
              <div className="mt-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/50 flex flex-col gap-2 relative z-30">
                
                {/* Time slider track progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-slate-500 font-mono">
                    0:{currentTime.toFixed(0).padStart(2, '0')}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={maxDuration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none outline-none"
                  />
                  <span className="text-[9px] font-bold text-slate-500 font-mono">
                    0:{maxDuration}
                  </span>
                </div>

                {/* Buttons container */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                  
                  {/* Playback Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md active:scale-95 cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => skipTime(-5)}
                      className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="Back 5s"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-800" />

                    {/* Captions toggle */}
                    <button
                      type="button"
                      onClick={() => setShowCC(!showCC)}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border cursor-pointer ${
                        showCC 
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                      title="Toggle Captions"
                    >
                      CC
                    </button>

                    {/* Speed selector */}
                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 text-slate-400">
                      <span className="text-[8px] font-bold">Speed:</span>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="bg-transparent text-[8px] font-black text-indigo-400 border-none outline-none cursor-pointer focus:ring-0"
                      >
                        <option value="0.5" className="bg-slate-950 text-slate-300">0.5x</option>
                        <option value="1" className="bg-slate-950 text-slate-300">1.0x</option>
                        <option value="1.5" className="bg-slate-950 text-slate-300">1.5x</option>
                        <option value="2" className="bg-slate-950 text-slate-300">2.0x</option>
                      </select>
                    </div>
                  </div>

                  {/* Volume, Audio options */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider bg-slate-900/50 px-2 py-0.5 rounded-md">
                      Auto-generated Walkthrough
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* Tutorial Preset Info Sidebar & Quick Apply Panel */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800/60 text-left relative z-20 overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {lang === 'th' ? 'สาระสำคัญและเคล็ดลับ' : 'Interactive Quick-Apply'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-white">
                    {lang === 'th' ? 'สูตรความสำเร็จในการกรอก' : 'Successful Configuration Tips'}
                  </h4>
                  <ul className="space-y-1.5 text-[9px] text-slate-400 font-semibold list-disc pl-3">
                    {currentStep === 1 && (
                      <>
                        <li>{lang === 'th' ? 'ระบุชื่อจริงหรือฉายาครูผู้สอนเพื่อสร้างความเป็นส่วนตัว' : 'Provide your real educator name to humanize the design.'}</li>
                        <li>{lang === 'th' ? 'การเลือกวิชาหลักจะปรับคลังคำศัพท์เฉพาะของแต่ละวิชาโดยอัตโนมัติ' : 'Subject selections tailor domain terminology.'}</li>
                        <li>{lang === 'th' ? 'จำนวนนักเรียนช่วยถ่วงดุลน้ำหนักขนาดบอร์ดและจำนวนอุปกรณ์ต่อวง' : 'Student count influences the game board sizing scale.'}</li>
                      </>
                    )}
                    {currentStep === 1.5 && (
                      <>
                        <li>{lang === 'th' ? 'จัดทักษะนิ่ม (Soft Skills) ร่วมกับทักษะวิชาการเพื่อส่งมอบการเรียนรู้รอบด้าน' : 'Incorporate 3R8C soft-skills alongside standard learning milestones.'}</li>
                        <li>{lang === 'th' ? 'ขยับลำดับเนื้อหาให้ไต่ความยากขึ้นเรื่อยๆ เสมือนด่านสเตจในตัวเกมแชท AI' : 'Order blocks logically from fundamental learning to final boss tests.'}</li>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <li>{lang === 'th' ? 'เขียนเป้าหมายหลักให้กระชับ ครอบคลุมพฤติกรรมสุดท้ายที่เด็กต้องทำได้จริง' : 'Keep goals concise, specifying what actions prove mastery.'}</li>
                        <li>{lang === 'th' ? 'กำหนดพฤติกรรมการแลกเปลี่ยนหรือวางแผนร่วมกันเพื่อกระตุ้นจิตวิญญาณผู้เล่น' : 'Inject mechanics like trading, cooperation, or bidding.'}</li>
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <li>{lang === 'th' ? 'ดูความยากและอายุที่แนะนำ หากกลุ่มเด็กเล็ก แนะนำรูปแนวเกมตอบคำถาม (Trivia)' : 'Match pattern complexity to your students\' gaming familiarity.'}</li>
                        <li>{lang === 'th' ? 'ระบบแบบร่วมมือกันเล่น (Cooperative) เสริมเรื่องมนุษยสัมพันธ์และการสื่อสารร่วมทีม' : 'Cooperative models build outstanding communication.'}</li>
                      </>
                    )}
                    {currentStep === 4 && (
                      <>
                        <li>{lang === 'th' ? 'ปรับปริมาณอุปกรณ์ให้อะไหล่พอเหมาะกับการพิมพ์ เช่น ขนาดการ์ด 40-60 ใบเหมาะที่สุด' : 'Maintain realistic component counts (e.g., 40-60 cards total).'}</li>
                        <li>{lang === 'th' ? 'เงื่อนไขการชนะที่เด่นชัด ช่วยผลักดันความตั้งใจของกลุ่มผู้เล่นในสนามอย่างยอดเยี่ยม' : 'Clear winning guidelines drive high student engagement.'}</li>
                      </>
                    )}
                    {currentStep === 5 && (
                      <>
                        <li>{lang === 'th' ? 'จานสีสไตล์ภาพที่กลมกลืน ช่วยเพิ่มพลังความดื่มด่ำในการจำลองระบบการเล่น' : 'Art style matching is key to establishing visual atmosphere.'}</li>
                        <li>{lang === 'th' ? 'ลองหย่อนแอดออนเด่นๆ เช่น เลเยอร์สามมิติ หรือเอฟเฟกต์พลุ เพื่อความสนุกรอบด้าน' : 'Drop rich modules (e.g. 3D layer, ambient tracks) for premium design.'}</li>
                      </>
                    )}
                    {currentStep === 6 && (
                      <>
                        <li>{lang === 'th' ? 'เปิดการอ่านโจทย์สังเคราะห์ด้วยเสียงครู เพื่อสนับสนุนเด็กพิเศษที่เข้าไม่ถึงตัวอักษร' : 'Enable voice synthesizers to support accessibility needs.'}</li>
                        <li>{lang === 'th' ? 'แอนิเมชันความลื่นไหลระดับสูงช่วยสร้างความติดตรึงใจตลอดช่วงคาบเรียน' : 'GSAP motion springs reduce fatigue and hook attention.'}</li>
                      </>
                    )}
                    {currentStep === 7 && (
                      <>
                        <li>{lang === 'th' ? 'ตรวจเช็กค่าระดับคะแนนเกจความซับซ้อน ไม่ให้เกมยากเกินเวลาคาบเรียน 50 นาที' : 'Verify gauge levels to prevent exceeding typical 50-minute blocks.'}</li>
                        <li>{lang === 'th' ? 'ดาวน์โหลดกติการอบร่างแรกนี้เก็บไว้เพื่อส่งออกหรือทดลองเล่นพรีวิวได้ทันใจ' : 'Download JSON drafts early to easily restore in the future.'}</li>
                      </>
                    )}
                    {currentStep === 8 && (
                      <>
                        <li>{lang === 'th' ? 'ใช้โมเดลระดับท็อปในการสร้าง เช่น Gemini 1.5 Pro หรือ Claude 3.5' : 'Copy prompt to ultra-capable LLMs for rich syllabus output.'}</li>
                        <li>{lang === 'th' ? 'การกดปุ่ม Optimize ช่วยปรับปรุงความรัดกุมในการร่างโจทย์ได้ดีเยี่ยม' : 'Gemini Optimization refines rulebooks to avoid logical loopholes.'}</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Quick action button to copy the tutorial's demo configuration preset instantly! */}
              {getTutorialPreset() && onApplyPreset && (
                <div className="pt-4 border-t border-slate-800/50 mt-3">
                  <button
                    type="button"
                    onClick={handleApplyPreset}
                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'th' ? 'กดใช้ตัวอย่างการตั้งค่านี้ทันที' : 'Apply Demo Config Preset'}
                    </span>
                  </button>
                  <p className="text-[8px] text-slate-500 text-center font-medium mt-1">
                    {lang === 'th' ? 'ป้อนข้อมูลจำลองข้างต้นลงแบบฟอร์มของคุณในคลิกเดียว' : 'Overwrites current screen values with the tutorial preset.'}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
