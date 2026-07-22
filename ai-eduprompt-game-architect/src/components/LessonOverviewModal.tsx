import React, { useRef } from 'react';
import { 
  X, Printer, Award, BookOpen, Compass, Brain, 
  Layers, Users, Sliders, Palette, CheckSquare
} from 'lucide-react';
import { GamePromptConfig } from '../types';

interface LessonOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GamePromptConfig;
  lang: 'th' | 'en';
  renderAvatar: (avatarKeyOrData: string | undefined, sizeClass?: string) => React.ReactNode;
}

export default function LessonOverviewModal({ 
  isOpen, 
  onClose, 
  config, 
  lang,
  renderAvatar
}: LessonOverviewModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Print function
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Simple window.print with scoped contents
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Lesson Plan - ${config.topic || 'Educational Game'}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { padding: 20px; color: #1e293b; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div>${printContent}</div>
          </body>
        </html>
      `);
      doc.close();
      
      // Delay to allow images & styles to load in iframe
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 500);
    }
  };

  const getSubjectName = () => {
    if (config.subject === 'Custom') return config.customSubject || (lang === 'th' ? 'ระบุเอง' : 'Custom');
    return config.subject;
  };

  return (
    <div id="lesson-overview-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header (Stay fixed above scroll area) */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-[#673AB7] rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                {lang === 'th' ? 'แผนการจัดการเรียนรู้กึ่งเกมพรอมต์แชท AI' : 'AI Prompt Game Integrated Lesson Plan'}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">
                {lang === 'th' ? 'สรุปเนื้อหาหลักสูตร สำหรับนำเสนอผู้เรียนและผู้ปกครอง' : 'A simplified overview formatted for student, teacher, or parent presentation.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#673AB7] hover:border-[#673AB7] hover:bg-[#FAF9FF] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title={lang === 'th' ? 'สั่งพิมพ์แผนการสอน' : 'Print Lesson Plan'}
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'th' ? 'พิมพ์แผน' : 'Print'}</span>
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Container */}
        <div className="overflow-y-auto p-6" ref={printRef}>
          <div className="space-y-6 max-w-2xl mx-auto py-2">
            
            {/* Elegant Presentable Header Badge */}
            <div className="border border-slate-100 bg-gradient-to-br from-[#673AB7]/5 to-[#8B5CF6]/5 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-[#673AB7]/10 text-[#673AB7] uppercase inline-block">
                  {lang === 'th' ? 'แผนเสนอการเรียนรู้หลักสูตรใหม่' : 'EDUCATIONAL SYLLABUS OVERVIEW'}
                </span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {config.topic || (lang === 'th' ? 'กิจกรรมพัฒนาผู้เรียนด้วยเกมพรอมต์แชท AI' : 'Active Learning via AI Prompt Game')}
                </h1>
                <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                  <span>{lang === 'th' ? 'วิชา:' : 'Subject:'} {getSubjectName()}</span>
                  <span>•</span>
                  <span>{lang === 'th' ? 'ระดับระดับความยาก (CEFR):' : 'CEFR Level:'} {config.cefrLevel}</span>
                </p>
              </div>

              {/* Developer / Teacher profile badge */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                {renderAvatar(config.teacherAvatar, "w-10 h-10")}
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                    {lang === 'th' ? 'ครูผู้ออกแบบกิจกรรม' : 'DESIGNED BY TEACHER'}
                  </span>
                  <span className="text-xs font-black text-slate-800 block">
                    {config.teacherName || 'Anonymous'}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Concept summary card */}
              <div className="border border-slate-100 bg-white rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-800 pb-1.5 border-b border-slate-50">
                  <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold">{lang === 'th' ? 'แนวคิดและที่มาของเกมพรอมต์ (Concept)' : 'Game Learning Concept'}</span>
                </div>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {config.conceptSummary || (lang === 'th' ? 'เกมพรอมต์จำลองสถานการณ์เพื่อกระตุ้นให้ผู้เรียนคิดและแก้ปัญหาแบบมีเป้าหมายผ่านแชท AI' : 'Interactive prompt game designed to foster experiential learning and collaborative problem solving via AI chat.')}
                </p>
              </div>

              {/* Primary Goals card */}
              <div className="border border-slate-100 bg-white rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-800 pb-1.5 border-b border-slate-50">
                  <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold">{lang === 'th' ? 'เป้าหมายและจุดประสงค์หลัก (Objectives)' : 'Primary Objective'}</span>
                </div>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {config.primaryGoal || (lang === 'th' ? 'เพื่อให้ผู้เรียนเข้าใจทักษะอย่างลึกซึ้งผ่านการละเล่นและการตัดสินใจในสถานการณ์จำลอง' : 'Enable students to fully master educational competencies via structured active choices and play mechanics.')}
                </p>
              </div>

            </div>

            {/* Skills Acquired & Competency Grid */}
            <div className="border border-slate-100 bg-white rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-50">
                <div className="p-1.5 bg-pink-50 text-pink-500 rounded-lg">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold">{lang === 'th' ? 'ทักษะและสมรรถนะเป้าหมายที่ผู้เรียนจะได้รับ (Skills & Competencies)' : 'Target Skills & Learning Competencies'}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {config.targetSkills && config.targetSkills.length > 0 ? (
                  config.targetSkills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-pink-50/60 text-pink-600 border border-pink-100/50 flex items-center gap-1"
                    >
                      <span>✨</span>
                      <span>{skill}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    {lang === 'th' ? 'ไม่มีการกำหนดทักษะเพิ่มเติม' : 'No core skills specified.'}
                  </span>
                )}
              </div>
            </div>

            {/* Curriculum Scaffold & Stages */}
            <div className="border border-slate-100 bg-white rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-50">
                <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold">{lang === 'th' ? 'ด่านการเรียนรู้และลำดับกิจกรรมสอน (Curriculum Progression)' : 'Curriculum Progression & Levels'}</span>
              </div>

              <div className="space-y-2.5">
                {config.curriculumSequence && config.curriculumSequence.length > 0 ? (
                  config.curriculumSequence.map((stage, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-sm">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase block">
                          STAGE {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-700 leading-normal">{stage}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {lang === 'th' ? 'ไม่ได้ระบุลำดับด่าน' : 'No scaffold progression configured.'}
                  </p>
                )}
              </div>
            </div>

            {/* Visual Specs and Presentation Details */}
            <div className="border border-slate-100 bg-white rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-50">
                <div className="p-1.5 bg-violet-50 text-violet-500 rounded-lg">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold">{lang === 'th' ? 'รายละเอียดงานออกแบบเกมพรอมต์ (Design & Vibe Specs)' : 'AI Prompt Game Design & Vibe'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { labelTh: 'สไตล์ภาพประจำเกม', labelEn: 'Artwork Style', value: config.visualStyle },
                  { labelTh: 'จานสีหลัก', labelEn: 'Color Palette', value: config.colorPalette },
                  { labelTh: 'ฟอนต์และตัวอักษร', labelEn: 'Typography pairing', value: config.typography },
                  { labelTh: 'รูปแบบแผนกลไกเกม', labelEn: 'Gameplay Mechanics', value: config.gamePattern },
                  { labelTh: 'ภาษาหลักสูตรหลัก', labelEn: 'Game Language', value: config.gameLanguage },
                  { labelTh: 'แอนิเมชันและเสียง', labelEn: 'Sensory Level', value: config.productionLevel }
                ].map((spec, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none mb-1">
                      {lang === 'th' ? spec.labelTh : spec.labelEn}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 block">
                      {spec.value || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Presentation Guidelines for Parent / Student */}
            <div className="border border-slate-100 bg-indigo-950 text-indigo-50 rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/60">
                <div className="p-1.5 bg-indigo-900/50 text-indigo-300 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold">{lang === 'th' ? 'คำแนะนำเสริมสำหรับนำเสนอ (Presentation Note)' : 'Suggested Presentation Tips'}</span>
              </div>

              <ul className="text-xs space-y-2 text-indigo-200/90 font-medium list-disc list-inside leading-relaxed">
                {lang === 'th' ? (
                  <>
                    <li>👨‍👩‍👧 <strong>สำหรับผู้ปกครอง:</strong> เน้นย้ำเป้าหมายกิจกรรมที่เป็นการกระตุ้นสมรรถนะคิดวิเคราะห์ของลูกแบบเชิงรุก ไม่ใช่การเล่นเกมไปวันๆ</li>
                    <li>🎒 <strong>สำหรับนักเรียน:</strong> ชวนเข้าสู่กิจกรรมโดยกระตุ้น "การประจัญบานทางปัญญา" ท้าทายด้วยเอฟเฟกต์ความลับของธีมภาพที่เราเลือก</li>
                    <li>🏫 <strong>สำหรับโรงเรียน:</strong> นำหน้าสรุปแผนการสอนนี้ยื่นควบคู่ไปกับแผนหน่วยการเรียนรู้หลักในการประกอบผลงานครูยุคใหม่</li>
                  </>
                ) : (
                  <>
                    <li>👨‍👩‍👧 <strong>For Parents:</strong> Emphasize how game-based mechanics improve cognitive decision-making and practical skills compared to passive learning.</li>
                    <li>🎒 <strong>For Students:</strong> Introduce the visual theme and sensory style early to build deep classroom engagement and friendly peer competition.</li>
                    <li>🏫 <strong>For Administration:</strong> Print this sleek, compact blueprint as supplementary proof of interactive gamified scaffolding inside your syllabus.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Humble signature */}
            <p className="text-[9px] text-slate-400 font-bold text-center pt-2">
              {lang === 'th' 
                ? 'สร้างสรรค์ผ่านเครื่องมืออัจฉริยะ AI EduPrompt Game Architect' 
                : 'Generated via AI EduPrompt Game Architect'}
            </p>

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer"
          >
            {lang === 'th' ? 'ตกลงและปิดหน้าต่าง' : 'Close Overview'}
          </button>
        </div>

      </div>
    </div>
  );
}
