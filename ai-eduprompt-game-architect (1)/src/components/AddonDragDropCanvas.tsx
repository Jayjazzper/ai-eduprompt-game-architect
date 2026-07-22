import React, { useState } from 'react';
import { 
  Check, Trash2, HelpCircle, Layers, Star, 
  Sparkles, Music, Volume2, Gamepad2, Info
} from 'lucide-react';
import { GamePromptConfig } from '../types';

interface AddonDragDropCanvasProps {
  config: GamePromptConfig;
  onChange: (updatedAddons: string[]) => void;
  lang: 'th' | 'en';
}

interface AddonItem {
  id: string;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  defaultZone: 'background' | 'logic' | 'audio' | 'style';
  icon: string;
  color: string;
}

const ADDONS_INFO: AddonItem[] = [
  {
    id: '3D animated background',
    nameTh: 'ฉากหลัง 3D เคลื่อนไหว',
    nameEn: '3D Animated Background',
    descTh: 'จำลองกราฟิกสามมิติเวกเตอร์ขยับด้านหลัง',
    descEn: 'Simulated 3D vector-grid background movement',
    defaultZone: 'background',
    icon: '🌐',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'Pro smooth animations',
    nameTh: 'แอนิเมชันพรีเมียม (GSAP)',
    nameEn: 'Pro Smooth Animations',
    descTh: 'ตัวละครและการ์ดลอยขึ้นลงลื่นไหลนุ่มนวล',
    descEn: 'Buttery smooth floating avatar & cards animation',
    defaultZone: 'logic',
    icon: '✨',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'Depth & parallax scrolling',
    nameTh: 'เลเยอร์พารัลแลกซ์เชิงลึก',
    nameEn: 'Depth & Parallax Scrolling',
    descTh: 'ฉากเทือกเขาซ้อนกัน เลื่อนความเร็วตามมิติ',
    descEn: 'Multi-layered parallax mountains scroll effect',
    defaultZone: 'background',
    icon: '⛰️',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'Physics & motion',
    nameTh: 'ฟิสิกส์วัตถุกระทบ',
    nameEn: 'Physics & Motion',
    descTh: 'ลูกเต๋าและเหรียญมีแรงโน้มถ่วง เด้งกระทบกัน',
    descEn: 'Simulated gravity bounces on active game items',
    defaultZone: 'logic',
    icon: '⚽',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'Sound effects & music',
    nameTh: 'เพลงและเอฟเฟกต์เสียงกด',
    nameEn: 'Sound Effects & Music',
    descTh: 'ซาวด์แทร็กคลอเบาๆ และเสียงกดสุดสัมผัส',
    descEn: 'Tactile sound clicks and retro ambient background track',
    defaultZone: 'audio',
    icon: '🎵',
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'Voice narration',
    nameTh: 'เสียง AI ครูบรรยายโจทย์',
    nameEn: 'Voice Narration',
    descTh: 'ครูผู้ช่วยพูดอ่านคำถามและเฉลยโจทย์',
    descEn: 'Text-to-speech AI reading question prompts aloud',
    defaultZone: 'audio',
    icon: '🗣️',
    color: 'from-violet-500 to-indigo-500'
  },
  {
    id: 'Confetti & particle bursts',
    nameTh: 'เอฟเฟกต์สะเก็ดฉลองชัย',
    nameEn: 'Confetti & Particle Bursts',
    descTh: 'พลุกระดาษเฉลิมฉลองระเบิดพรูพราย',
    descEn: 'Confetti particle explosions when scoring',
    defaultZone: 'background',
    icon: '🎉',
    color: 'from-fuchsia-500 to-pink-500'
  },
  {
    id: 'Custom game fonts',
    nameTh: 'ฟอนต์เกมพิเศษสุดเจ๋ง',
    nameEn: 'Custom Game Fonts',
    descTh: 'ตัวอักษรสไตล์พิกเซลอาร์ตและเหลี่ยมเกมมิ่ง',
    descEn: 'Fun gaming monospace typography overrides',
    defaultZone: 'style',
    icon: '🔤',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'Glassmorphism & gradients',
    nameTh: 'ดีไซน์กระจกฝ้าหรูหรา',
    nameEn: 'Glassmorphism & Gradients',
    descTh: 'กล่องข้อมูลโปร่งใสเบลอหลัง ขอบสะท้อนแสง',
    descEn: 'Frosted transparent panels with neon glowing borders',
    defaultZone: 'style',
    icon: '🔮',
    color: 'from-indigo-500 to-fuchsia-500'
  }
];

export default function AddonDragDropCanvas({ config, onChange, lang }: AddonDragDropCanvasProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeZoneOver, setActiveZoneOver] = useState<'background' | 'logic' | 'audio' | 'style' | null>(null);
  const [showHelperBoundaries, setShowHelperBoundaries] = useState(true);

  const activeAddons = config.addons || [];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setActiveZoneOver(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: 'background' | 'logic' | 'audio' | 'style') => {
    e.preventDefault();
    if (activeZoneOver !== zone) {
      setActiveZoneOver(zone);
    }
  };

  const handleDragLeave = () => {
    setActiveZoneOver(null);
  };

  const handleDrop = (e: React.DragEvent, zone: 'background' | 'logic' | 'audio' | 'style') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      if (!activeAddons.includes(id)) {
        onChange([...activeAddons, id]);
      }
    }
    setActiveZoneOver(null);
    setDraggedId(null);
  };

  const toggleAddon = (id: string) => {
    if (activeAddons.includes(id)) {
      onChange(activeAddons.filter(a => a !== id));
    } else {
      onChange([...activeAddons, id]);
    }
  };

  const clearAllAddons = () => {
    onChange([]);
  };

  // Determine if specific addon categories are active
  const hasBgEffect = activeAddons.includes('3D animated background');
  const hasParallax = activeAddons.includes('Depth & parallax scrolling');
  const hasConfetti = activeAddons.includes('Confetti & particle bursts');
  const hasAnimations = activeAddons.includes('Pro smooth animations');
  const hasPhysics = activeAddons.includes('Physics & motion');
  const hasAudio = activeAddons.includes('Sound effects & music');
  const hasNarration = activeAddons.includes('Voice narration');
  const hasFonts = activeAddons.includes('Custom game fonts');
  const hasGlass = activeAddons.includes('Glassmorphism & gradients');

  return (
    <div id="addon-drag-drop-container" className="space-y-4 bg-slate-950 text-white rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-500/20 text-indigo-400 uppercase">
              {lang === 'th' ? 'สถาปนิกจัดวางองค์ประกอบเกม' : 'GAME ADD-ON LAYOUT ARCHITECT'}
            </span>
            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <h3 className="text-sm font-extrabold text-white mt-1 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            {lang === 'th' ? 'จัดวางเอฟเฟกต์และเทคโนโลยีบนหน้าจอ' : 'Visual Game Add-ons Layout'}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {lang === 'th' 
              ? 'ลากแอดออนจากด็อกซ้ายมือ ไปวางที่โซนบนหน้าจอกล่องพรีวิว หรือเพียงแค่คลิกเพื่อเปิดใช้งานทันที!'
              : 'Drag add-ons from the left dock onto the interactive game board preview zones, or tap to toggle!'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <button
            type="button"
            onClick={() => setShowHelperBoundaries(!showHelperBoundaries)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
              showHelperBoundaries 
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{lang === 'th' ? 'แสดงเส้นไกด์โซน' : 'Show Guide Zones'}</span>
          </button>

          {activeAddons.length > 0 && (
            <button
              type="button"
              onClick={clearAllAddons}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{lang === 'th' ? 'ล้างทั้งหมด' : 'Clear All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Panel: Available Add-on Dock */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">
            {lang === 'th' ? '📥 คลังแอดออนเสริมที่เปิดใช้งาน' : '📥 Available Add-ons Dock'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {ADDONS_INFO.map((add) => {
              const isActive = activeAddons.includes(add.id);
              return (
                <div
                  key={add.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, add.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => toggleAddon(add.id)}
                  className={`group p-2.5 rounded-xl border text-left transition-all duration-200 cursor-grab active:cursor-grabbing flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-indigo-950/50 border-indigo-500/50 text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] shadow-indigo-500/10'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${add.color} flex items-center justify-center text-sm shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                      {add.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black truncate ${isActive ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {lang === 'th' ? add.nameTh : add.nameEn}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold truncate leading-normal mt-0.5">
                        {lang === 'th' ? add.descTh : add.descEn}
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all ${
                    isActive 
                      ? 'border-indigo-500 bg-indigo-500 text-white' 
                      : 'border-slate-700 bg-slate-950 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-3 flex items-start gap-2.5 text-[9px] text-slate-400 leading-normal font-medium">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              {lang === 'th'
                ? '💡 ลากแผงแอดออนด้านบนไปหย่อนลงในช่องพื้นที่จำลอง (โซนที่มีขอบประจุดสีแดง) หรือเพียงแตะปุ่มเพื่อเปิดปิดได้ทันใจตามต้องการ'
                : '💡 Drag any item from this panel and hover/drop inside the preview canvas zones, or simply click to add/remove.'}
            </p>
          </div>
        </div>

        {/* Right Panel: Interactive Layout Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">
              {lang === 'th' ? '🖥️ พื้นที่จำลองหน้าจอแชทเกม' : '🖥️ Interactive Chat Game Interface'}
            </span>
            <span className="text-[9px] text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/50">
              {activeAddons.length} {lang === 'th' ? 'รายการขยับอยู่' : 'Active Addons'}
            </span>
          </div>

          {/* SIMULATED GAME SCREEN */}
          <div 
            className={`w-full aspect-[16/10] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl flex flex-col justify-between p-3 select-none ${
              hasFonts ? 'font-mono' : 'font-sans'
            }`}
          >
            
            {/* ZONE 1: BACKGROUND LAYER (3D & PARALLAX) */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'background')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'background')}
              className={`absolute inset-0 z-0 transition-all duration-300 flex items-center justify-center ${
                activeZoneOver === 'background' ? 'bg-indigo-600/20 ring-4 ring-indigo-500 ring-inset' : ''
              }`}
            >
              
              {/* Starfield simulation if 3D Background active */}
              {hasBgEffect && (
                <div className="absolute inset-0 bg-slate-950 opacity-90 overflow-hidden">
                  {/* Glowing custom SVG grid movement or floating particle layers */}
                  <svg className="w-full h-full opacity-40 animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path d="M 0,10 L 100,10 M 0,20 L 100,20 M 0,30 L 100,30 M 0,40 L 100,40 M 0,50 L 100,50 M 0,60 L 100,60 M 0,70 L 100,70 M 0,80 L 100,80 M 0,90 L 100,90" stroke="url(#grid-grad)" strokeWidth="0.5" />
                    <path d="M 10,0 L 10,100 M 20,0 L 20,100 M 30,0 L 30,100 M 40,0 L 40,100 M 50,0 L 50,100 M 60,0 L 60,100 M 70,0 L 70,100 M 80,0 L 80,100 M 90,0 L 90,100" stroke="url(#grid-grad)" strokeWidth="0.5" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/20 animate-spin-slow pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-fuchsia-500/10 animate-spin-reverse pointer-events-none" />
                </div>
              )}

              {/* Parallax Mountains if parallax active */}
              {hasParallax && (
                <div className="absolute bottom-0 inset-x-0 h-1/2 flex flex-col justify-end pointer-events-none opacity-80 overflow-hidden">
                  {/* Layer 3 - Deepest */}
                  <div className="w-full h-12 bg-indigo-950/40 translate-y-2 relative animate-pulse" style={{ clipPath: 'polygon(0% 100%, 15% 40%, 30% 70%, 45% 20%, 65% 80%, 80% 30%, 100% 100%)' }} />
                  {/* Layer 2 - Mid */}
                  <div className="w-full h-10 bg-indigo-900/60 translate-y-1 relative" style={{ clipPath: 'polygon(0% 100%, 10% 50%, 25% 25%, 40% 60%, 55% 45%, 75% 70%, 90% 15%, 100% 100%)' }} />
                  {/* Layer 1 - Front */}
                  <div className="w-full h-8 bg-slate-900 relative" style={{ clipPath: 'polygon(0% 100%, 5% 60%, 20% 40%, 35% 70%, 50% 30%, 70% 50%, 85% 35%, 100% 100%)' }} />
                </div>
              )}

              {/* Confetti particles if active */}
              {hasConfetti && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => {
                    const colorClasses = ['bg-rose-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-cyan-400', 'bg-indigo-400', 'bg-amber-400'];
                    const colorClass = colorClasses[i % colorClasses.length];
                    const delays = ['0s', '1.5s', '0.7s', '2.2s', '1.1s'];
                    const delay = delays[i % delays.length];
                    return (
                      <div 
                        key={i} 
                        className={`absolute w-1.5 h-1.5 rounded-full ${colorClass} opacity-75 animate-bounce-slow`}
                        style={{
                          left: `${(i * 9) + 4}%`,
                          top: `${(i * 7) + 12}%`,
                          animationDelay: delay,
                          transform: `scale(${1 + (i % 3) * 0.2}) rotate(${i * 30}deg)`
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Boundary Helper Guide lines */}
              {showHelperBoundaries && (
                <div className="absolute inset-2 border-2 border-dashed border-indigo-500/10 rounded-xl pointer-events-none flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-indigo-500/30 uppercase tracking-widest bg-slate-950/20 px-1.5 py-0.5 rounded">
                    Zone 1: Background & VFX
                  </span>
                </div>
              )}
            </div>

            {/* ZONE 2: STYLE / HUD LAYOUT LAYER (Glassmorphism & Fonts) */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'style')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'style')}
              className={`relative z-20 flex justify-between items-start transition-all duration-300 p-2 rounded-xl ${
                activeZoneOver === 'style' ? 'bg-fuchsia-600/20 ring-4 ring-fuchsia-500 ring-inset' : ''
              }`}
            >
              {/* Score HUD Item */}
              <div 
                className={`p-2 rounded-xl border transition-all ${
                  hasGlass 
                    ? 'bg-slate-950/40 backdrop-blur-md border-indigo-500/30 shadow-lg text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Score Board</span>
                </div>
                <p className={`text-sm font-black leading-none mt-1 ${hasFonts ? 'tracking-wider text-cyan-400 font-mono' : 'text-white'}`}>
                  9,850 PTS
                </p>
              </div>

              {/* Quest Target Card */}
              <div 
                className={`p-2 rounded-xl border transition-all ${
                  hasGlass 
                    ? 'bg-slate-950/40 backdrop-blur-md border-fuchsia-500/30 shadow-lg text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block leading-none">Goal Progress</span>
                <span className="text-[10px] font-bold block mt-1 text-fuchsia-400">Level 4 / 6</span>
              </div>

              {/* Boundary Helper Guide lines */}
              {showHelperBoundaries && (
                <div className="absolute inset-0 border border-dashed border-fuchsia-500/20 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[8px] font-black text-fuchsia-500/40 uppercase tracking-widest bg-slate-950/50 px-1.5 py-0.5 rounded">
                    Zone 2: HUD Styles & Fonts
                  </span>
                </div>
              )}
            </div>

            {/* ZONE 3: ACTIVE GAME BOARD & PIECES LAYER (Smooth Motion & Physics) */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'logic')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'logic')}
              className={`relative z-10 my-auto h-24 rounded-xl flex items-center justify-center gap-4 transition-all duration-300 ${
                activeZoneOver === 'logic' ? 'bg-amber-600/20 ring-4 ring-amber-500 ring-inset' : ''
              }`}
            >
              {/* Left Board Item: Interactive Card */}
              <div 
                className={`w-14 h-16 rounded-lg border border-slate-700 bg-slate-900/90 flex flex-col items-center justify-center p-1 relative shadow-lg ${
                  hasAnimations ? 'animate-bounce-slow duration-1000' : ''
                } ${hasGlass ? 'bg-slate-900/60 backdrop-blur-md border-indigo-500/40' : ''}`}
              >
                <div className="w-6 h-6 rounded-md bg-indigo-600/20 flex items-center justify-center mb-1">
                  <Star className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-[8px] font-bold text-slate-300 block text-center leading-tight">Card A</span>
              </div>

              {/* Central Player Avatar */}
              <div 
                className={`w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-0.5 shadow-xl shrink-0 flex items-center justify-center relative ${
                  hasAnimations ? 'animate-bounce-slow' : ''
                }`}
              >
                <span className="text-xl">🧙‍♂️</span>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <span className="text-[7px] text-white font-black">✔</span>
                </div>
              </div>

              {/* Right Board Item: Bouncing Physics Coin */}
              <div 
                className={`w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg relative ${
                  hasPhysics ? 'animate-spin-slow rotate-45' : ''
                }`}
              >
                <span className="text-sm">🪙</span>
                {hasPhysics && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-[6px] font-bold px-1 rounded text-white uppercase animate-pulse">
                    g-force
                  </span>
                )}
              </div>

              {/* Boundary Helper Guide lines */}
              {showHelperBoundaries && (
                <div className="absolute inset-0 border border-dashed border-amber-500/20 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-widest bg-slate-950/50 px-1.5 py-0.5 rounded">
                    Zone 3: Core Board & Physics
                  </span>
                </div>
              )}
            </div>

            {/* ZONE 4: AUDIO HUD & VOICE BAR LAYER (Music & Narration Voice HUD) */}
            <div 
              onDragOver={(e) => handleDragOver(e, 'audio')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'audio')}
              className={`relative z-20 bg-slate-950/90 border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-3 transition-all duration-300 ${
                activeZoneOver === 'audio' ? 'bg-rose-600/20 ring-4 ring-rose-500 ring-inset' : ''
              } ${hasGlass ? 'bg-slate-950/50 backdrop-blur-md border-indigo-500/20' : ''}`}
            >
              
              {/* Dialogue text/Subtitles */}
              <div className="min-w-0">
                <span className="text-[7px] text-slate-400 font-extrabold uppercase tracking-widest block">System Narration</span>
                <p className="text-[9px] text-slate-300 truncate font-semibold leading-normal mt-0.5">
                  {hasNarration 
                    ? '"Welcome, Let\'s learn the board game quest!" 🗣️' 
                    : lang === 'th' ? 'จำลองด่านการเล่นผ่านพรอมต์แชท...' : 'Simulating prompt chat levels...'}
                </p>
              </div>

              {/* Sound visualizers */}
              <div className="flex items-center gap-1.5 shrink-0">
                {hasAudio ? (
                  <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-900/30 px-2 py-0.5 rounded-md">
                    <Music className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                    <span className="text-[7px] text-rose-300 font-bold uppercase tracking-wider">Audio On</span>
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-rose-400 h-2 animate-pulse" />
                      <span className="w-0.5 bg-rose-400 h-3 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-rose-400 h-1 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 opacity-40">
                    <Volume2 className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Muted</span>
                  </div>
                )}
              </div>

              {/* Boundary Helper Guide lines */}
              {showHelperBoundaries && (
                <div className="absolute inset-0 border border-dashed border-rose-500/20 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[8px] font-black text-rose-500/40 uppercase tracking-widest bg-slate-950/50 px-1.5 py-0.5 rounded">
                    Zone 4: Voice & Soundtrack
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Active Add-on Badge List below canvas */}
          <div className="flex flex-wrap gap-1.5 mt-1 bg-slate-900/30 border border-slate-900 p-2 rounded-xl">
            {activeAddons.length === 0 ? (
              <span className="text-[10px] text-slate-500 font-bold italic w-full text-center">
                {lang === 'th' ? 'ไม่มีแอดออนเปิดใช้งานขณะนี้ (ลากหรือแตะรายการเพื่อเพิ่ม)' : 'No active add-ons. Drag or click items to place them.'}
              </span>
            ) : (
              activeAddons.map((act) => {
                const spec = ADDONS_INFO.find(a => a.id === act);
                if (!spec) return null;
                return (
                  <span 
                    key={act}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:border-rose-500/50 hover:text-rose-300 transition-all cursor-pointer shadow-sm group"
                    onClick={() => toggleAddon(act)}
                    title={lang === 'th' ? 'คลิกเพื่อลบออก' : 'Click to remove'}
                  >
                    <span>{spec.icon}</span>
                    <span>{lang === 'th' ? spec.nameTh : spec.nameEn}</span>
                    <span className="text-slate-500 group-hover:text-rose-400 font-black ml-0.5 text-[8px]">×</span>
                  </span>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
