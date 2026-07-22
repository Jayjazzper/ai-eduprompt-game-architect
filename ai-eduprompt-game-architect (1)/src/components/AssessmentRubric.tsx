import React, { useState, useMemo } from 'react';
import { Award, Table, CreditCard, Copy, Check, FileText, Settings, Sparkles } from 'lucide-react';
import { GamePromptConfig } from '../types';
import { CORE_COMPETENCIES } from '../templates';

interface AssessmentRubricProps {
  config: GamePromptConfig;
  lang: 'th' | 'en';
}

interface RubricRow {
  criterionTh: string;
  criterionEn: string;
  source: 'competency' | 'skill';
  sourceNameTh: string;
  sourceNameEn: string;
  levelsTh: string[]; // [4, 3, 2, 1]
  levelsEn: string[]; // [4, 3, 2, 1]
}

export default function AssessmentRubric({ config, lang }: AssessmentRubricProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [copied, setCopied] = useState(false);
  const [maxLevels, setMaxLevels] = useState<3 | 4>(4); // Customizable scoring scale (3 levels vs 4 levels)

  // Pre-defined mapping for Core Competency Rubrics
  const competencyRubrics: Record<string, { criterionTh: string; criterionEn: string; levelsTh: string[]; levelsEn: string[] }> = {
    Communication: {
      criterionTh: 'ความสามารถในการสื่อสารและถ่ายทอดข้อมูล',
      criterionEn: 'Communication & Information Delivery',
      levelsTh: [
        'สื่อสารได้คล่องแคล่ว มีความสุภาพ ชัดเจน และรับฟังผู้อื่นอย่างตั้งใจตลอดกิจกรรม',
        'สื่อสารได้เข้าใจดี มีความผิดพลาดเล็กน้อยที่ไม่บดบังความหมาย และรับฟังคู่สนทนาส่วนใหญ่',
        'สื่อสารได้จำกัด ต้องการคำชี้แนะเป็นระยะ และมีส่วนร่วมในการฟังน้อยครั้ง',
        'ไม่ยินยอมหรือหลีกเลี่ยงการสื่อสารเพื่อร่วมกิจกรรม และไม่ยอมรับฟังผู้อื่นเลย'
      ],
      levelsEn: [
        'Communicates fluently, politely, and clearly; actively and respectfully listens to peers.',
        'Communicates well with minor errors; participates as an attentive listener most of the time.',
        'Limited communication, needs periodic guidance; rarely shows signs of active listening.',
        'Avoids or refuses communication during activities; completely ignores peers.'
      ]
    },
    Thinking: {
      criterionTh: 'ความสามารถในการคิดวิเคราะห์และการคิดสร้างสรรค์',
      criterionEn: 'Analytical & Creative Thinking',
      levelsTh: [
        'คิดวิเคราะห์ข้อมูล วางแผนอย่างเป็นระบบ และเสนอแนะแนวทางแปลกใหม่ที่สร้างสรรค์',
        'คิดเชื่อมโยงและเสนอไอเดียตามแนวทางมาตรฐานได้อย่างสมเหตุสมผลดี',
        'คิดตามกรอบที่กำหนดไว้ค่อนข้างจำกัด ต้องพึ่งพาการดัดแปลงรูปแบบเดิมอย่างง่ายเท่านั้น',
        'ไม่สามารถคิดวิเคราะห์หรือระบุความเชื่อมโยงของข้อมูลใดๆ ได้ด้วยตนเอง'
      ],
      levelsEn: [
        'Thinks analytically, plans systematically, and proposes highly innovative/creative ideas.',
        'Connects concepts logically and proposes standard ideas in a reasonable manner.',
        'Thinking is heavily constrained by rules; relies only on basic replication of existing patterns.',
        'Unable to analyze information or connect concepts independently.'
      ]
    },
    ProblemSolving: {
      criterionTh: 'ความสามารถในการแก้ปัญหาและฝ่าฟันอุปสรรค',
      criterionEn: 'Problem Solving & Resilience',
      levelsTh: [
        'ระบุปัญหาอย่างรวดเร็ว วางแผนแก้ไขเป็นลำดับขั้นตอน และยืดหยุ่นปรับวิธีแก้เมื่อเจอความท้าทายใหม่',
        'ระบุปัญหาและดำเนินการแก้ไขได้สำเร็จลุล่วงด้วยวิธีการมาตรฐานที่มีความเพียรพยายาม',
        'พยายามแก้ไขปัญหาแต่เน้นการเดาสุ่ม ขาดการวางแผนล่วงหน้า หรือละทิ้งภารกิจได้ง่ายเมื่อเจอปัญหา',
        'หลีกเลี่ยงการเผชิญหน้ากับปัญหา และไม่พยายามทดลองแนวทางแก้ไขใดๆ'
      ],
      levelsEn: [
        'Swiftly identifies obstacles, designs step-by-step solutions, and adapts flexibly to new challenges.',
        'Identifies problems and successfully completes tasks using standard methods and perseverance.',
        'Attempts to solve problems but relies on random trial-and-error; gives up easily under pressure.',
        'Avoids facing problems and shows zero initiative in searching for any solution.'
      ]
    },
    LifeSkills: {
      criterionTh: 'ความสามารถในการใช้ทักษะชีวิตและการทำงานร่วมกับผู้อื่น',
      criterionEn: 'Life Skills & Collaboration',
      levelsTh: [
        'ปรับตัวเข้ากับกลุ่มได้ยอดเยี่ยม ช่วยเหลือและสวมบทบาทเป็นผู้นำ/ผู้ตามอย่างเคารพกติกา',
        'มีปฏิสัมพันธ์ที่ดี ทำงานที่ได้รับมอบหมายในกลุ่มสำเร็จ และรักษาความสัมพันธ์อย่างสร้างสรรค์',
        'มีส่วนร่วมในกลุ่มเป็นบางช่วง บางครั้งแยกตัวออกห่าง หรือต้องอาศัยการเตือนเป็นพิเศษ',
        'ปฏิเสธการร่วมมือกับกลุ่ม หรือแสดงพฤติกรรมเชิงลบที่รบกวนสมาธิและความร่วมมือของเพื่อน'
      ],
      levelsEn: [
        'Adapts beautifully, supports teammates, and gracefully balances leadership and followership roles.',
        'Maintains positive relationships, completes assigned group roles, and communicates constructively.',
        'Participates with the team occasionally; displays disengagement or requires extra peer prompting.',
        'Refuses to cooperate with the group or exhibits disruptive behavior that hinders overall team progress.'
      ]
    },
    Technology: {
      criterionTh: 'ความสามารถในการประยุกต์และใช้งานเทคโนโลยี/ระบบดิจิทัล',
      criterionEn: 'Technology & Digital Application',
      levelsTh: [
        'เลือกใช้ฟังก์ชันและเครื่องมือดิจิทัลในเกมได้อย่างคล่องแคล่ว ปลอดภัย และสร้างสรรค์เต็มที่',
        'ใช้งานเครื่องมือดิจิทัลและปฏิบัติตามกฎกติกาการส่งงานผ่านระบบได้สำเร็จลุล่วง',
        'เข้าถึงระบบเทคโนโลยีได้ แต่พบความสับสนในขั้นตอนสำคัญ หรือต้องพึ่งเพื่อนร่วมกลุ่มคอยช่วยชี้แนะบ่อยครั้ง',
        'ไม่เข้าใจและไม่สามารถสั่งการสื่อสารหรือเครื่องมือดิจิทัลที่ระบุในกิจกรรมได้'
      ],
      levelsEn: [
        'Uses digital platforms and game systems fluently, safely, and highly creatively.',
        'Operates technology tools and complies with submission rules on the system successfully.',
        'Accesses digital tools but frequently gets confused by key steps; relies heavily on peer guidance.',
        'Fails to comprehend or operate any of the digital platforms/tools required in activities.'
      ]
    }
  };

  // Pre-defined mapping for Target Skill Rubrics
  const getSkillRubric = (skillName: string): { criterionTh: string; criterionEn: string; levelsTh: string[]; levelsEn: string[] } => {
    const sLower = skillName.toLowerCase();

    if (sLower.includes('vocab') || sLower.includes('ศัพท์')) {
      return {
        criterionTh: `ความเชี่ยวชาญด้านคำศัพท์ (${skillName})`,
        criterionEn: `Vocabulary Mastery (${skillName})`,
        levelsTh: [
          'เข้าใจและจดจำความหมายของคำศัพท์เป้าหมายได้ครบถ้วน และเขียนสะกดประยุกต์แต่งประโยคได้ถูกต้องสมบูรณ์',
          'เข้าใจความหมายส่วนใหญ่ และใช้แต่งประโยคหรือเลือกความหมายได้ถูกต้องเป็นส่วนใหญ่',
          'จำคำศัพท์ได้จำกัด สะกดผิดหลายจุด หรือสับสนบริบทความหมายในการนำไปใช้',
          'ไม่สามารถจำหรือระบุความหมายคำศัพท์เป้าหมายได้เลย และเขียนผิดพลาดทั้งหมด'
        ],
        levelsEn: [
          'Recalls all target vocabulary meanings flawlessly; spells and applies them perfectly in original contexts.',
          'Understands most vocabulary meanings; uses them correctly in general scenarios with minor errors.',
          'Recalls limited words; makes frequent spelling mistakes or exhibits confusion regarding correct context.',
          'Unable to recognize or define any target vocabulary; output is completely incorrect.'
        ]
      };
    }

    if (sLower.includes('speaking') || sLower.includes('พูด') || sLower.includes('conversation')) {
      return {
        criterionTh: `การสื่อสารและการพูดโต้ตอบ (${skillName})`,
        criterionEn: `Oral Communication & Speaking (${skillName})`,
        levelsTh: [
          'ออกเสียงอักขระได้แม่นยำ ใช้น้ำเสียงสอดคล้องกับอารมณ์ และพูดโต้ตอบได้อย่างคล่องแคล่วดึงดูดใจ',
          'ออกเสียงและโต้ตอบได้ตรงตามประเด็นหลัก มีข้อผิดพลาดเล็กน้อยแต่สามารถเข้าใจความต้องการได้ชัดเจน',
          'พูดได้ล่าช้า ออกเสียงคำผิดพลาดค่อนข้างมาก สื่อสารด้วยถ้อยคำตะกุกตะกักจนผู้ฟังต้องถามย้ำ',
          'ปฏิเสธการพูดโต้ตอบ หรือส่งเสียงไม่เป็นประโยคที่ไม่สามารถเข้าใจความหมายได้เลย'
        ],
        levelsEn: [
          'Pronounces perfectly, uses tone appropriately to match emotions, and converses with high fluency and charisma.',
          'Pronounces and responds on-topic; minor errors exist but do not obscure overall communication.',
          'Speaks slowly with frequent mispronunciations; exhibits stuttering that requires constant repetition.',
          'Refuses to speak, or fails to produce understandable spoken phrases entirely.'
        ]
      };
    }

    if (sLower.includes('grammar') || sLower.includes('ไวยากรณ์')) {
      return {
        criterionTh: `ความถูกต้องตามหลักไวยากรณ์ (${skillName})`,
        criterionEn: `Grammatical Accuracy (${skillName})`,
        levelsTh: [
          'ใช้โครงสร้างไวยากรณ์และเรียบเรียงประโยคได้อย่างถูกต้องสมบูรณ์แบบ มีรูปแบบประโยคที่ซับซ้อนสร้างสรรค์',
          'ใช้ไวยากรณ์ในการเขียนหรือพูดได้ถูกต้องดี มีความคลาดเคลื่อนบ้างแต่ยังสื่อสารรู้เรื่อง',
          'โครงสร้างไวยากรณ์ผิดพลาดอย่างเห็นได้ชัดบ่อยครั้ง สื่อสารสับสนและต้องการความช่วยเหลือตลอด',
          'ไม่มีความเข้าใจในโครงสร้างภาษาที่เรียนเลย สื่อความหมายผิดพลาดและสลับตำแหน่งคำจนสับสน'
        ],
        levelsEn: [
          'Applies targeted grammatical structures and rules flawlessly; employs elegant, diverse sentence structures.',
          'Employs target grammar rules correctly in most instances; message remains clear despite minor slips.',
          'Shows frequent major grammatical errors that impede comprehension; needs constant correction.',
          'Has zero comprehension of target grammatical structures; mixes word orders and renders messages incomprehensible.'
        ]
      };
    }

    if (sLower.includes('calculation') || sLower.includes('คำนวณ') || sLower.includes('arithmetic')) {
      return {
        criterionTh: `ทักษะการคำนวณและความแม่นยำด้านคณิตศาสตร์ (${skillName})`,
        criterionEn: `Mathematical Calculation & Accuracy (${skillName})`,
        levelsTh: [
          'คำนวณตัวเลข หาคำตอบ และเปรียบเทียบสัดส่วนตามกติกาได้อย่างรวดเร็ว แม่นยำ 100% ไร้ข้อบกพร่อง',
          'คำนวณโจทย์ได้ผลลัพธ์ถูกต้องเกือบทั้งหมด มีส่วนเผเรอบางจุดที่สามารถตรวจสอบแก้ไขได้ด้วยตนเอง',
          'คำนวณได้คำตอบช้า มีขั้นตอนสับสนบ่อยครั้ง และมักคำนวณพลาดหากไม่ได้รับการนำทาง',
          'ไม่สามารถเขียนสมการหรือได้คำตอบจากตัวเลขง่ายๆ และผลลัพธ์ผิดพลาดทั้งหมด'
        ],
        levelsEn: [
          'Performs calculations and compares quantitative factors swiftly and with 100% absolute accuracy.',
          'Computes problems correctly in most instances; overlooks minor details but is capable of self-correcting.',
          'Calculates slowly; demonstrates confusion in calculation steps and fails frequently without prompting.',
          'Fails to compute even basic numbers or symbol equations; outputs are completely incorrect.'
        ]
      };
    }

    if (sLower.includes('logical') || sLower.includes('ตรรกะ') || sLower.includes('reasoning')) {
      return {
        criterionTh: `การคิดเชิงตรรกะและการวิเคราะห์ความสัมพันธ์ (${skillName})`,
        criterionEn: `Logical Reasoning & Relations (${skillName})`,
        levelsTh: [
          'เชื่อมโยงสถานการณ์ที่มีความซับซ้อนอย่างสมเหตุสมผลสูงสุด มีขั้นตอนคิดอ้างอิงหลักการเป็นระบบ',
          'อธิบายความสัมพันธ์เชิงเหตุและผลและเลือกตัดสินใจตามหลักเกณฑ์ที่ถูกต้องเหมาะสม',
          'อ้างอิงเหตุผลได้เป็นบางช่วง แต่บางส่วนยังสับสน คาดคะเนจากการเดาสุ่มมากกว่าหลักตรรกะ',
          'ไม่เข้าใจกฎเกณฑ์ความสัมพันธ์เชิงตรรกะ และดำเนินการกิจกรรมโดยไร้เป้าหมายหรือทฤษฎีอ้างอิง'
        ],
        levelsEn: [
          'Links complex scenarios logically; processes information systematically based on clear structured evidence.',
          'Explains cause-and-effect relationships clearly and makes reasonable decisions based on criteria.',
          'Applies logical links occasionally, but is often sidetracked by guessing rather than analyzing facts.',
          'Fails to comprehend relational logic or rules; acts arbitrarily without goal-oriented reasoning.'
        ]
      };
    }

    if (sLower.includes('scientific') || sLower.includes('สืบเสาะ') || sLower.includes('inquiry') || sLower.includes('experiment')) {
      return {
        criterionTh: `กระบวนการสืบเสาะและระเบียบวิธีวิทยาศาสตร์ (${skillName})`,
        criterionEn: `Scientific Inquiry & Methodology (${skillName})`,
        levelsTh: [
          'ตั้งสมมติฐาน ออกแบบขั้นตอนทดสอบ เก็บรวบรวมหลักฐานรอบด้าน และวิเคราะห์สรุปได้สมบูรณ์ตามหลักวิทยาศาสตร์',
          'ดำเนินขั้นตอนการทดสอบและสังเกตผลได้ถูกต้องตามระเบียบ สามารถจำแนกตัวแปรพื้นฐานได้',
          'สังเกตและจดบันทึกได้ค่อนข้างสะเปะสะปะ หรือไม่มีข้อสรุปผลลัพธ์ที่เป็นขั้นเป็นตอนตามสมมติฐาน',
          'ไม่ใส่ใจในระเบียบวิธีสืบเสาะ คาดเดาอย่างเลื่อนลอยโดยปราศจากการทดลองสังเกตจริง'
        ],
        levelsEn: [
          'Formulates sound hypotheses, plans systematic testing, logs multidirectional data, and concludes flawlessly.',
          'Executes scientific procedures and records outcomes correctly; identifies basic control variables.',
          'Observations and logging are unstructured; fails to link experimental evidence with the hypothesis.',
          'Disregards structured inquiry entirely; guesses randomly without any factual investigation.'
        ]
      };
    }

    if (sLower.includes('observ') || sLower.includes('สังเกต')) {
      return {
        criterionTh: `ความละเอียดถี่ถ้วนและทักษะการสังเกต (${skillName})`,
        criterionEn: `Observation & Attention to Detail (${skillName})`,
        levelsTh: [
          'ตรวจจับและระบุรายละเอียดปลีกย่อยของวัตถุหรือเหตุการณ์ในเกมได้ทันที ครบถ้วนรวดเร็วและระบุจุดผิดปกติได้คมชัด',
          'สังเกตและจำแนกความแตกต่างหลักๆ ได้ถูกต้อง บันทึกผลได้ถูกต้องตามเงื่อนไขของกิจกรรม',
          'มองข้ามความเปลี่ยนแปลงย่อยๆ หลายจุด หรือสับสนรูปแบบความแตกต่างจนภารกิจช้าลง',
          'ไม่ใส่ใจในเบาะแสหรือวัตถุใดๆ ในเกม สังเกตคลาดเคลื่อนหรือไม่เห็นภาพรวมความเปลี่ยนแปลงเลย'
        ],
        levelsEn: [
          'Identifies tiny visual/situational patterns instantly and maps core anomalies with stellar detail.',
          'Observes and distinguishes major variations correctly; logs key points according to assignment instructions.',
          'Overlooks multiple minor patterns or gets confused between differences, delaying progression.',
          'Completely oblivious to cues or key objects; records nothing of substance or reports inaccurate details.'
        ]
      };
    }

    // Generic fallbacks
    return {
      criterionTh: `ทักษะเฉพาะด้าน: ${skillName}`,
      criterionEn: `Target Skill Mastery: ${skillName}`,
      levelsTh: [
        `ปฏิบัติและประยุกต์ทักษะ ${skillName} ได้อย่างโดดเด่น ไร้ที่ติ มีความคล่องตัวและสร้างสรรค์สูงสุด`,
        `แสดงออกทักษะ ${skillName} ได้ดีและถูกต้องตามกติกา สามารถปฏิบัติตามจุดประสงค์หลักได้ครบถ้วน`,
        `มีพัฒนาการของทักษะ ${skillName} อยู่บ้างในกิจกรรม แต่ยังต้องการการช่วยประคองชี้แนะบ่อยครั้ง`,
        `ไม่แสดงให้เห็นทักษะ ${skillName} หรือผลงานไม่มีคุณภาพและต้องการความช่วยเหลือเพื่อพัฒนาใหม่ทั้งหมด`
      ],
      levelsEn: [
        `Demonstrates and applies ${skillName} outstandingly and flawlessly; displays exceptional autonomy and creativity.`,
        `Demonstrates ${skillName} correctly according to task parameters; fulfills all main objectives successfully.`,
        `Shows minor progress in ${skillName}, but requires continuous coaching and scaffolding from peers or teachers.`,
        `Fails to demonstrate ${skillName} during activity; performance requires comprehensive remedial support.`
      ]
    };
  };

  // Generate Rubric Rows
  const rubricRows = useMemo<RubricRow[]>(() => {
    const rows: RubricRow[] = [];

    // Core Competency Rows
    if (config.coreCompetencies && config.coreCompetencies.length > 0) {
      config.coreCompetencies.forEach(compId => {
        const standardComp = CORE_COMPETENCIES.find(c => c.id === compId);
        const mappedRubric = competencyRubrics[compId];
        if (mappedRubric && standardComp) {
          rows.push({
            criterionTh: mappedRubric.criterionTh,
            criterionEn: mappedRubric.criterionEn,
            source: 'competency',
            sourceNameTh: standardComp.textTh,
            sourceNameEn: standardComp.textEn,
            levelsTh: mappedRubric.levelsTh,
            levelsEn: mappedRubric.levelsEn
          });
        }
      });
    }

    // Target Skill Rows
    if (config.targetSkills && config.targetSkills.length > 0) {
      config.targetSkills.forEach(skill => {
        const mappedRubric = getSkillRubric(skill);
        rows.push({
          criterionTh: mappedRubric.criterionTh,
          criterionEn: mappedRubric.criterionEn,
          source: 'skill',
          sourceNameTh: lang === 'th' ? 'ทักษะเฉพาะวิชา' : 'Subject Skill',
          sourceNameEn: 'Subject Skill',
          levelsTh: mappedRubric.levelsTh,
          levelsEn: mappedRubric.levelsEn
        });
      });
    }

    return rows;
  }, [config.coreCompetencies, config.targetSkills, lang]);

  // Copy Markdown Format function
  const copyAsMarkdown = () => {
    if (rubricRows.length === 0) return;

    let md = '';
    if (lang === 'th') {
      md += `### เกณฑ์การประเมินรูบริก (Assessment Rubric) - ${config.subject}: ${config.topic}\n\n`;
      if (maxLevels === 4) {
        md += `| เกณฑ์การประเมิน (Criterion) | ยอดเยี่ยม (4) | ดี (3) | พอใช้ (2) | ต้องปรับปรุง (1) |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- |\n`;
        rubricRows.forEach(row => {
          md += `| **${row.criterionTh}**<br>_(${row.sourceNameTh})_ | ${row.levelsTh[0]} | ${row.levelsTh[1]} | ${row.levelsTh[2]} | ${row.levelsTh[3]} |\n`;
        });
      } else {
        md += `| เกณฑ์การประเมิน (Criterion) | ยอดเยี่ยม (3) | ดี/พอใช้ (2) | ต้องปรับปรุง (1) |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        rubricRows.forEach(row => {
          md += `| **${row.criterionTh}**<br>_(${row.sourceNameTh})_ | ${row.levelsTh[0]} | ${row.levelsTh[1]} | ${row.levelsTh[3]} |\n`;
        });
      }
    } else {
      md += `### Assessment Rubric - ${config.subject}: ${config.topic}\n\n`;
      if (maxLevels === 4) {
        md += `| Assessment Criterion | Excellent (4) | Good (3) | Fair (2) | Needs Improvement (1) |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- |\n`;
        rubricRows.forEach(row => {
          md += `| **${row.criterionEn}**<br>_(${row.sourceNameEn})_ | ${row.levelsEn[0]} | ${row.levelsEn[1]} | ${row.levelsEn[2]} | ${row.levelsEn[3]} |\n`;
        });
      } else {
        md += `| Assessment Criterion | Excellent (3) | Satisfactory (2) | Needs Improvement (1) |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        rubricRows.forEach(row => {
          md += `| **${row.criterionEn}**<br>_(${row.sourceNameEn})_ | ${row.levelsEn[0]} | ${row.levelsEn[1]} | ${row.levelsEn[3]} |\n`;
        });
      }
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="assessment-rubric-module" className="bg-white border border-indigo-100 rounded-3xl p-5 md:p-6 shadow-[0_8px_24px_rgba(103,58,183,0.04)] flex flex-col gap-5 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#F9F7FF] rounded-xl text-[#673AB7] shrink-0">
            <Award className="w-5.5 h-5.5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'th' ? 'เกณฑ์การประเมินรูบริกอัตโนมัติ' : 'Generated Assessment Rubric'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ECE4FF] text-[#673AB7] text-[10px] font-bold">
                {lang === 'th' ? `${rubricRows.length} มิติ` : `${rubricRows.length} Dimensions`}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              {lang === 'th' 
                ? 'คำนวณและสร้างตามสมรรถนะหลักและทักษะที่คุณเลือกเพื่อนำไปใช้วัดผลในชั้นเรียนจริง' 
                : 'Constructed dynamically based on your selected core competencies and target skills.'}
            </p>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Scoring Scale Configurator */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setMaxLevels(3)}
              className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all ${
                maxLevels === 3 
                  ? 'bg-white text-[#673AB7] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              3 Levels
            </button>
            <button
              type="button"
              onClick={() => setMaxLevels(4)}
              className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all ${
                maxLevels === 4 
                  ? 'bg-white text-[#673AB7] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              4 Levels (Standard)
            </button>
          </div>

          {/* Table/Card Layout Toggle */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-[#673AB7] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table view"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card' ? 'bg-white text-[#673AB7] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card view"
            >
              <CreditCard className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Markdown Rubric button */}
          <button
            type="button"
            onClick={copyAsMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold transition-all shadow-sm cursor-pointer ml-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') : (lang === 'th' ? 'คัดลอกตาราง (Markdown)' : 'Copy Table Markdown')}</span>
          </button>

        </div>
      </div>

      {rubricRows.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-slate-100 bg-slate-50 flex flex-col items-center gap-2">
          <Settings className="w-8 h-8 text-slate-300 animate-spin" />
          <h4 className="text-xs font-bold text-slate-800">
            {lang === 'th' ? 'ไม่พบข้อมูลเป้าหมาย' : 'No Competencies or Skills Selected'}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">
            {lang === 'th' 
              ? 'กรุณากลับไปที่ขั้นตอนที่ 1 หรือ 2 เพื่อร่วมกำหนดเป้าหมายและทักษะที่ต้องการพัฒนา' 
              : 'Go back to Step 1 or 2 to select competencies/skills to generate a rubric.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        
        /* TABLE VIEW (Optimal for Desktop) */
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 shadow-inner scrollbar-thin">
          <table className="w-full border-collapse text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF9FF] border-b border-slate-100">
                <th className="py-3 px-4 font-extrabold text-[#673AB7] w-[20%]">
                  {lang === 'th' ? 'เกณฑ์ประเมิน (Criterion)' : 'Criterion'}
                </th>
                {maxLevels === 4 ? (
                  <>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[20%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 font-extrabold">🏆</span>
                        <span>{lang === 'th' ? 'ยอดเยี่ยม (4 คะแนน)' : 'Excellent (4 pts)'}</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[20%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500 font-extrabold">⭐</span>
                        <span>{lang === 'th' ? 'ดี (3 คะแนน)' : 'Good (3 pts)'}</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[20%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-500 font-extrabold">✏️</span>
                        <span>{lang === 'th' ? 'พอใช้ (2 คะแนน)' : 'Fair (2 pts)'}</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[20%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-extrabold">⚠️</span>
                        <span>{lang === 'th' ? 'ปรับปรุง (1 คะแนน)' : 'Needs Improvement (1 pt)'}</span>
                      </div>
                    </th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[26.6%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 font-extrabold">🏆</span>
                        <span>{lang === 'th' ? 'ดีเยี่ยม (3 คะแนน)' : 'Excellent (3 pts)'}</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[26.6%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500 font-extrabold">⭐</span>
                        <span>{lang === 'th' ? 'ผ่านเกณฑ์ (2 คะแนน)' : 'Satisfactory (2 pts)'}</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-700 w-[26.6%] border-l border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-extrabold">⚠️</span>
                        <span>{lang === 'th' ? 'ปรับปรุง (1 คะแนน)' : 'Needs Improvement (1 pt)'}</span>
                      </div>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {rubricRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      row.source === 'competency' 
                        ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {row.source === 'competency' 
                        ? (lang === 'th' ? 'สมรรถนะ' : 'Competency') 
                        : (lang === 'th' ? 'ทักษะวิชา' : 'Subject Skill')}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-[11px] md:text-xs mt-1.5 leading-snug">
                      {lang === 'th' ? row.criterionTh : row.criterionEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">
                      {lang === 'th' ? row.sourceNameTh : row.sourceNameEn}
                    </p>
                  </td>
                  {maxLevels === 4 ? (
                    <>
                      <td className="py-3.5 px-4 align-top text-slate-600 leading-relaxed border-l border-slate-100/50">
                        {lang === 'th' ? row.levelsTh[0] : row.levelsEn[0]}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-600 leading-relaxed border-l border-slate-100/50 bg-slate-50/20">
                        {lang === 'th' ? row.levelsTh[1] : row.levelsEn[1]}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-600 leading-relaxed border-l border-slate-100/50">
                        {lang === 'th' ? row.levelsTh[2] : row.levelsEn[2]}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-500 leading-relaxed border-l border-slate-100/50 bg-red-50/5">
                        {lang === 'th' ? row.levelsTh[3] : row.levelsEn[3]}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3.5 px-4 align-top text-slate-600 leading-relaxed border-l border-slate-100/50">
                        {lang === 'th' ? row.levelsTh[0] : row.levelsEn[0]}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-600 leading-relaxed border-l border-slate-100/50 bg-slate-50/20">
                        {lang === 'th' ? row.levelsTh[1] : row.levelsEn[1]}
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-500 leading-relaxed border-l border-slate-100/50 bg-red-50/5">
                        {lang === 'th' ? row.levelsTh[3] : row.levelsEn[3]}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* CARD VIEW (Highly Adaptive for Mobile) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rubricRows.map((row, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:border-[#673AB7]/30 hover:shadow-sm transition-all bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    row.source === 'competency' 
                      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {row.source === 'competency' 
                      ? (lang === 'th' ? 'สมรรถนะ' : 'Competency') 
                      : (lang === 'th' ? 'ทักษะวิชา' : 'Subject Skill')}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-xs mt-1.5 leading-snug">
                    {lang === 'th' ? row.criterionTh : row.criterionEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {lang === 'th' ? row.sourceNameTh : row.sourceNameEn}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-1 border-t border-slate-50 pt-3">
                {maxLevels === 4 ? (
                  <>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-amber-500 shrink-0">🏆 Level 4:</span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[0] : row.levelsEn[0]}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-blue-500 shrink-0">⭐ Level 3:</span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[1] : row.levelsEn[1]}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-emerald-500 shrink-0">✏️ Level 2:</span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[2] : row.levelsEn[2]}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-red-400 shrink-0">⚠️ Level 1:</span>
                      <span className="text-slate-500 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[3] : row.levelsEn[3]}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-amber-500 shrink-0">🏆 Level 3:</span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[0] : row.levelsEn[0]}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-blue-500 shrink-0">⭐ Level 2:</span>
                      <span className="text-slate-600 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[1] : row.levelsEn[1]}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[11px] items-start">
                      <span className="font-bold text-red-400 shrink-0">⚠️ Level 1:</span>
                      <span className="text-slate-500 font-medium leading-relaxed">
                        {lang === 'th' ? row.levelsTh[3] : row.levelsEn[3]}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip Box */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 mt-1">
        <Sparkles className="w-4 h-4 text-[#673AB7] shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
          {lang === 'th' 
            ? 'คำแนะนำ: คุณสามารถคัดลอกเกณฑ์ประเมินเหล่านี้ในรูปแบบตาราง Markdown เพื่อไปวางในแฟ้มแผนการจัดกิจกรรมการเรียนรู้ หรือมอบหมายรูบริกใน Google Classroom ได้ทันที'
            : 'Tip: Copy this rubric as a Markdown table to quickly insert into your lesson plans, spreadsheets, or Google Classroom assignments.'}
        </p>
      </div>

    </div>
  );
}
