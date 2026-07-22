import React, { useMemo } from 'react';
import { Sparkles, Check, RefreshCw, AlertCircle, Bookmark, Compass } from 'lucide-react';
import { GamePromptConfig } from '../types';
import { CORE_COMPETENCIES, SKILLS_3R8C } from '../templates';

interface SmartContextProps {
  config: GamePromptConfig;
  setConfig: React.Dispatch<React.SetStateAction<GamePromptConfig>>;
  lang: 'th' | 'en';
  setAlertMsg: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error' | 'info'; text: string } | null>>;
}

export default function SmartContext({ config, setConfig, lang, setAlertMsg }: SmartContextProps) {
  const subject = config.subject || 'Custom';
  const topic = config.topic || '';

  // Analysis result based on Subject and Topic keywords
  const analysis = useMemo(() => {
    const topicLower = topic.toLowerCase();
    
    // Core Competency suggestions
    let recommendedComps: string[] = [];
    // 3R x 8C skills suggestions
    let recommended3r8c: string[] = [];
    // Justification in Thai & English
    let reasonTh = '';
    let reasonEn = '';

    // Mathematics keywords
    const isMath = subject === 'Mathematics' || 
                   topicLower.includes('math') || 
                   topicLower.includes('คณิต') || 
                   topicLower.includes('เลข') || 
                   topicLower.includes('fraction') || 
                   topicLower.includes('decimal') || 
                   topicLower.includes('เศษส่วน') || 
                   topicLower.includes('ทศนิยม') ||
                   topicLower.includes('equation') || 
                   topicLower.includes('สมการ') || 
                   topicLower.includes('คำนวณ') ||
                   topicLower.includes('logic');

    // English keywords
    const isEnglish = subject === 'English' || 
                      topicLower.includes('english') || 
                      topicLower.includes('vocab') || 
                      topicLower.includes('grammar') || 
                      topicLower.includes('speaking') || 
                      topicLower.includes('conversation') || 
                      topicLower.includes('tense') || 
                      topicLower.includes('ภาษาอังกฤษ') || 
                      topicLower.includes('สนทนา') ||
                      topicLower.includes('ศัพท์');

    // Science keywords
    const isScience = subject === 'Science' || 
                      topicLower.includes('science') || 
                      topicLower.includes('physic') || 
                      topicLower.includes('chem') || 
                      topicLower.includes('bio') || 
                      topicLower.includes('lab') || 
                      topicLower.includes('วิทย์') || 
                      topicLower.includes('ฟิสิกส์') || 
                      topicLower.includes('เคมี') || 
                      topicLower.includes('ชีวะ') || 
                      topicLower.includes('ทดลอง') ||
                      topicLower.includes('inquiry');

    // Social studies keywords
    const isSocial = subject === 'Social Studies' || 
                     topicLower.includes('social') || 
                     topicLower.includes('history') || 
                     topicLower.includes('geography') || 
                     topicLower.includes('egypt') || 
                     topicLower.includes('สังคม') || 
                     topicLower.includes('ประวัติศาสตร์') || 
                     topicLower.includes('ภูมิศาสตร์') || 
                     topicLower.includes('วัฒนธรรม');

    // Thai language keywords
    const isThai = subject === 'Thai' || 
                   topicLower.includes('ภาษาไทย') || 
                   topicLower.includes('ไทย') || 
                   topicLower.includes('วรรณคดี') || 
                   topicLower.includes('สะกด') || 
                   topicLower.includes('แต่งประโยค');

    // Arts / Music keywords
    const isArts = subject === 'Arts' || 
                   topicLower.includes('art') || 
                   topicLower.includes('music') || 
                   topicLower.includes('paint') || 
                   topicLower.includes('ดนตรี') || 
                   topicLower.includes('ศิลปะ') || 
                   topicLower.includes('เพลง');

    // Computing keywords
    const isTech = subject === 'Computing & Tech' || 
                   topicLower.includes('comput') || 
                   topicLower.includes('tech') || 
                   topicLower.includes('code') || 
                   topicLower.includes('program') || 
                   topicLower.includes('digital') || 
                   topicLower.includes('คอมพิวเตอร์') || 
                   topicLower.includes('โค้ด') || 
                   topicLower.includes('เทคโนโลยี');

    if (isMath) {
      recommendedComps = ['Thinking', 'ProblemSolving'];
      recommended3r8c = ['3R-Arithmetics', '8C-CriticalThinking', '8C-Collaboration'];
      reasonTh = 'หัวข้อคณิตศาสตร์สอดคล้องกับมาตรฐานสาระการเรียนรู้ที่เน้นทักษะการคำนวณเชิงปริมาณ การให้เหตุผลเชิงสัญลักษณ์ และการวิเคราะห์ขั้นตอนเพื่อแก้สมการทางตรรกะ';
      reasonEn = 'Mathematics topics highly align with standard curriculum focuses on quantitative calculation, symbol reasoning, and systematic step-by-step logic and equation solving.';
    } else if (isEnglish) {
      recommendedComps = ['Communication', 'LifeSkills'];
      recommended3r8c = ['3R-Reading', '8C-Communication', '8C-Collaboration'];
      reasonTh = 'หัวข้อภาษาอังกฤษเน้นทักษะการส่งสารและรับสาร การออกเสียงเพื่อสื่อสารในชีวิตประจำวัน และการทำงานร่วมกันเพื่อจำลองสถานการณ์ทางสังคม (Role-Play)';
      reasonEn = 'English topics emphasize dynamic messaging, verbal communication in real life, and collaborative scenario exploration to reinforce vocabulary and polite structures.';
    } else if (isScience) {
      recommendedComps = ['Thinking', 'ProblemSolving', 'Technology'];
      recommended3r8c = ['8C-CriticalThinking', '8C-Computing', '8C-Collaboration'];
      reasonTh = 'การเรียนการสอนวิทยาศาสตร์มุ่งพัฒนาการตั้งสมมติฐาน การสังเกตและประมวลผลข้อมูล (Scientific Inquiry) และความเข้าใจในเครื่องมือแล็บจำลองและเทคโนโลยี';
      reasonEn = 'Science learning focuses on testing hypotheses, detailed observation, structured data logging (Scientific Inquiry), and managing digital lab tools or parameters safely.';
    } else if (isSocial) {
      recommendedComps = ['Thinking', 'LifeSkills'];
      recommended3r8c = ['3R-Reading', '8C-CrossCultural', '8C-Communication'];
      reasonTh = 'วิชาสังคมศึกษาและประวัติศาสตร์ช่วยส่งเสริมความเข้าใจในความแตกต่างทางวัฒนธรรม ตระหนักถึงความเกี่ยวโยงของเหตุการณ์ และวิเคราะห์เชิงภูมิศาสตร์และประชากรวิทยา';
      reasonEn = 'Social Studies and History foster cross-cultural appreciation, situational awareness, and analytical investigation of historical times, geography, and citizen duties.';
    } else if (isThai) {
      recommendedComps = ['Communication', 'Thinking'];
      recommended3r8c = ['3R-Reading', '3R-Writing', '8C-Communication'];
      reasonTh = 'วิชาภาษาไทยเน้นความคล่องแคล่วในการอ่านออก เขียนได้ การถอดความวรรณคดีอย่างสร้างสรรค์ และการสื่อสารอย่างถูกกาลเทศะตามบรรทัดฐานสังคม';
      reasonEn = 'Thai Language instruction centers around fluent reading, contextual spelling, writing, and interpreting literature while emphasizing correct cultural communication and expressions.';
    } else if (isArts) {
      recommendedComps = ['Thinking', 'LifeSkills'];
      recommended3r8c = ['8C-Creativity', '8C-CrossCultural'];
      reasonTh = 'กลุ่มสาระศิลปะและดนตรีส่งเสริมกระบวนการคิดนอกกรอบ จินตนาการ และการสัมผัสสุนทรียศาสตร์ รวมถึงการชื่นชมความแตกต่างของงานศิลป์แต่ละยุคสมัย';
      reasonEn = 'Arts and Music promote out-of-the-box thinking, creative expression, rhythm appreciation, and empathy for aesthetic movements in different historical eras.';
    } else if (isTech) {
      recommendedComps = ['Technology', 'ProblemSolving', 'Thinking'];
      recommended3r8c = ['8C-Computing', '8C-CriticalThinking', '8C-Creativity'];
      reasonTh = 'วิทยาการคำนวณเน้นตรรกะการคิดอย่างเป็นขั้นตอน การวิเคราะห์ระบบเทคโนโลยี และการรู้เท่าทันสื่อความปลอดภัยในระบบสารสนเทศ';
      reasonEn = 'Computing topics emphasize procedural thinking, code logic, evaluating digital tools, and navigating digital privacy and safety rules effectively.';
    } else {
      // Default fallback based on what we have
      recommendedComps = ['Thinking', 'Communication'];
      recommended3r8c = ['3R-Reading', '8C-CriticalThinking', '8C-Collaboration'];
      reasonTh = 'เป้าหมายสากลสนับสนุนทักษะการคิดวิเคราะห์ การทำงานเป็นทีมเพื่อความเท่าเทียม และการสื่อสารอย่างมีขั้นตอนในห้องเรียนแบบ Active Learning';
      reasonEn = 'Standard active learning benchmarks support critical thinking development, group communication, and cohesive teamwork to build lifelong inquiry skills.';
    }

    return {
      recommendedComps,
      recommended3r8c,
      reasonTh,
      reasonEn,
      subjectName: subject,
      topicName: topic || (lang === 'th' ? '(ยังไม่ได้ระบุหัวข้อ)' : '(No topic specified)')
    };
  }, [subject, topic, lang]);

  // Apply all recommended competencies and 3R x 8C skills
  const applyAllRecommendations = () => {
    setConfig(prev => ({
      ...prev,
      coreCompetencies: analysis.recommendedComps,
      skills3r8c: analysis.recommended3r8c
    }));

    setAlertMsg({
      type: 'success',
      text: lang === 'th'
        ? `ปรับใช้อัตโนมัติเรียบร้อย! ได้เลือกสมรรถนะ (${analysis.recommendedComps.length}) และทักษะศตวรรษที่ 21 (${analysis.recommended3r8c.length}) ที่สอดคล้องกับมาตรฐานหลักสูตรเรียบร้อยแล้ว`
        : `Smart Context Applied! Selected (${analysis.recommendedComps.length}) competencies and (${analysis.recommended3r8c.length}) 21st Century Skills aligned with standards.`
    });
  };

  // Check if current config matches recommendations
  const isAlreadyApplied = useMemo(() => {
    const currentComps = config.coreCompetencies || [];
    const current3r8c = config.skills3r8c || [];

    const hasAllComps = analysis.recommendedComps.every(id => currentComps.includes(id)) && currentComps.length === analysis.recommendedComps.length;
    const hasAll3r8c = analysis.recommended3r8c.every(id => current3r8c.includes(id)) && current3r8c.length === analysis.recommended3r8c.length;

    return hasAllComps && hasAll3r8c;
  }, [config.coreCompetencies, config.skills3r8c, analysis]);

  return (
    <div id="smart-context-section" className="bg-[#FAF9FF] border border-[#673AB7]/15 rounded-2xl p-4.5 mb-5 shadow-sm transition-all animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#673AB7]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#673AB7]/10 text-[#673AB7] rounded-lg">
            <Sparkles className="w-4 h-4 text-[#673AB7] animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Smart Context Assistant</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                AI Suggestion
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === 'th' ? 'จับคู่เป้าหมายหลักสูตรตามหัวข้อการสอนทันที' : 'Real-time curriculum standards mapper.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={applyAllRecommendations}
          disabled={isAlreadyApplied}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
            isAlreadyApplied
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
              : 'bg-[#673AB7] hover:bg-[#5E35B1] text-white cursor-pointer hover:shadow-md active:scale-95'
          }`}
        >
          {isAlreadyApplied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{lang === 'th' ? 'ปรับใช้เรียบร้อยแล้ว' : 'Aligned & Applied'}</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>{lang === 'th' ? 'ปรับใช้คำแนะนำตามหลักสูตร' : 'Apply Curriculum Recommendations'}</span>
            </>
          )}
        </button>
      </div>

      {/* Target Subject / Topic Info */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5 text-[10px] font-bold">
        <span className="text-slate-400">{lang === 'th' ? 'วิชา:' : 'Subject:'}</span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">{analysis.subjectName}</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-400">{lang === 'th' ? 'หัวข้อ:' : 'Topic:'}</span>
        <span className="px-2 py-0.5 rounded-md bg-[#ECE4FF] text-[#673AB7] truncate max-w-[180px]">
          {analysis.topicName}
        </span>
      </div>

      {/* Recommended items detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Core Competencies Suggested */}
        <div className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-2 shadow-inner">
          <h5 className="text-[10px] font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-purple-500 rounded-sm"></span>
            {lang === 'th' ? 'สมรรถนะหลักของแกนกลางที่สอดคล้อง' : 'Recommended Core Competencies'}
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {analysis.recommendedComps.map(id => {
              const comp = CORE_COMPETENCIES.find(c => c.id === id);
              if (!comp) return null;
              const isSelected = (config.coreCompetencies || []).includes(id);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => {
                    const current = config.coreCompetencies || [];
                    const updated = current.includes(id)
                      ? current.filter(x => x !== id)
                      : [...current, id];
                    setConfig({ ...config, coreCompetencies: updated });
                  }}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-purple-50 border-purple-200 text-[#673AB7]'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-[#673AB7] stroke-[3]" />}
                  <span>{lang === 'th' ? comp.textTh : comp.textEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 21st Century Skills Suggested */}
        <div className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-2 shadow-inner">
          <h5 className="text-[10px] font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-indigo-500 rounded-sm"></span>
            {lang === 'th' ? 'ทักษะศตวรรษที่ 21 (3R x 8C) ที่สอดคล้อง' : 'Recommended 3R x 8C Skills'}
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {analysis.recommended3r8c.map(id => {
              const skill = SKILLS_3R8C.find(s => s.id === id);
              if (!skill) return null;
              const isSelected = (config.skills3r8c || []).includes(id);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => {
                    const current = config.skills3r8c || [];
                    const updated = current.includes(id)
                      ? current.filter(x => x !== id)
                      : [...current, id];
                    setConfig({ ...config, skills3r8c: updated });
                  }}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-indigo-700 stroke-[3]" />}
                  <span>{lang === 'th' ? skill.textTh.split(' (')[0] : skill.textEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rationale & Standards justification block */}
      <div className="mt-3 p-3 bg-[#673AB7]/5 border border-[#673AB7]/10 rounded-xl flex items-start gap-2">
        <Bookmark className="w-3.5 h-3.5 text-[#673AB7] shrink-0 mt-0.5" />
        <div>
          <h6 className="text-[9px] font-extrabold text-[#673AB7] uppercase tracking-wider">
            {lang === 'th' ? 'เหตุผลสอดรับหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน' : 'National Standard Alignment Rationale'}
          </h6>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
            {lang === 'th' ? analysis.reasonTh : analysis.reasonEn}
          </p>
        </div>
      </div>
    </div>
  );
}
