import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GamePromptConfig, CurriculumTreeNode } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Sparkles, 
  Layers, 
  Bookmark,
  Check,
  RotateCcw,
  GitBranch,
  GitMerge,
  GitPullRequest,
  HelpCircle,
  Network,
  List,
  Edit2,
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

interface CurriculumSequenceProps {
  config: GamePromptConfig;
  setConfig: React.Dispatch<React.SetStateAction<GamePromptConfig>>;
  lang: 'th' | 'en';
}

export default function CurriculumSequence({ config, setConfig, lang }: CurriculumSequenceProps) {
  // Toggle between flat list editor and branching skill tree editor
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  
  // List Editor State
  const [items, setItems] = useState<string[]>(() => {
    return config.curriculumSequence || [];
  });
  const [newItemText, setNewItemText] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Skill Tree Editor State
  const [treeNodes, setTreeNodes] = useState<CurriculumTreeNode[]>(() => {
    if (config.curriculumSequenceTree && config.curriculumSequenceTree.length > 0) {
      return config.curriculumSequenceTree;
    }
    // Convert flat list to linear tree
    const list = config.curriculumSequence || [];
    return list.map((item, idx) => ({
      id: `node-${idx}`,
      label: item,
      parents: idx > 0 ? [`node-${idx - 1}`] : []
    }));
  });

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isEditingLabel, setIsEditingLabel] = useState<string | null>(null);
  const [showTreeHelp, setShowTreeHelp] = useState(false);

  // Topological sorting helper for the tree DAG
  const topologicalSort = (nodes: CurriculumTreeNode[]): CurriculumTreeNode[] => {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: CurriculumTreeNode[] = [];

    const visit = (nodeId: string) => {
      if (temp.has(nodeId)) return; // Cycle guard
      if (visited.has(nodeId)) return;
      temp.add(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        node.parents.forEach(pId => visit(pId));
      }
      
      temp.delete(nodeId);
      visited.add(nodeId);
      if (node) result.push(node);
    };

    nodes.forEach(node => visit(node.id));
    return result;
  };

  // Sync state between flat list and tree graph based on viewMode
  useEffect(() => {
    if (viewMode === 'list') {
      // If user modified list, recreate straight-line tree nodes
      const newTreeNodes = items.map((item, idx) => ({
        id: `node-${idx}`,
        label: item,
        parents: idx > 0 ? [`node-${idx - 1}`] : []
      }));
      setTreeNodes(newTreeNodes);
      setConfig(prev => ({
        ...prev,
        curriculumSequence: items,
        curriculumSequenceTree: newTreeNodes
      }));
    } else {
      // If user modified tree, sort topologically to flatten into a clean sequence
      const sorted = topologicalSort(treeNodes);
      const flatLabels = sorted.map(node => node.label);
      setItems(flatLabels);
      setConfig(prev => ({
        ...prev,
        curriculumSequence: flatLabels,
        curriculumSequenceTree: treeNodes
      }));
    }
  }, [items, treeNodes, viewMode, setConfig]);

  // Handle adding a new level in List mode
  const handleAddListItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems(prev => [...prev, newItemText.trim()]);
    setNewItemText('');
  };

  // Handle deleting in List mode
  const handleDeleteListItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Move items in List mode
  const moveListItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
  };

  // List Drag and drop HTML5 handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...items];
    const itemToMove = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, itemToMove);
    setDraggedIndex(index);
    setItems(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // AUTO-GENERATE TEMPLATE PRESETS (Branching Scheme)
  const applyBranchingPreset = (type: 'linear' | 'dual' | 'triple') => {
    const subject = config.subject || 'General';
    const topic = config.topic || (lang === 'th' ? 'หัวข้อนวัตกรรม' : 'Innovative Topic');

    let nodes: CurriculumTreeNode[] = [];

    if (type === 'linear') {
      nodes = [
        {
          id: 'node-l1',
          label: lang === 'th' ? 'ระดับที่ 1: ปูพื้นฐานแนวคิด (Conceptual Foundation)' : 'Level 1: Conceptual Foundation',
          parents: []
        },
        {
          id: 'node-l2',
          label: lang === 'th' ? 'ระดับที่ 2: ฝึกฝนการนำไปใช้ (Guided Skill Application)' : 'Level 2: Guided Skill Application',
          parents: ['node-l1']
        },
        {
          id: 'node-l3',
          label: lang === 'th' ? 'ระดับที่ 3: บูรณาการแก้ไขปริศนา (Integrated Cognitive Puzzles)' : 'Level 3: Integrated Cognitive Puzzles',
          parents: ['node-l2']
        },
        {
          id: 'node-l4',
          label: lang === 'th' ? 'ระดับที่ 4: เควสและด่านบอสสุดท้าย (Final Mastery Quest)' : 'Level 4: Final Mastery Quest',
          parents: ['node-l3']
        }
      ];
    } else if (type === 'dual') {
      nodes = [
        {
          id: 'node-d1',
          label: lang === 'th' ? 'ระดับที่ 1: จุดเริ่มต้นสำรวจร่วมกัน (Foundational Gateway)' : 'Level 1: Foundational Gateway',
          parents: []
        },
        {
          id: 'node-d2a',
          label: lang === 'th' ? 'ระดับที่ 2A: เน้นทฤษฎีและคำศัพท์ (Branch A: Theory & Syntax)' : 'Level 2A: Theory & Key Syntax (Branch A)',
          parents: ['node-d1']
        },
        {
          id: 'node-d2b',
          label: lang === 'th' ? 'ระดับที่ 2B: เน้นประยุกต์ปฏิบัติ (Branch B: Practical Experiment)' : 'Level 2B: Hands-On Practice (Branch B)',
          parents: ['node-d1']
        },
        {
          id: 'node-d3',
          label: lang === 'th' ? 'ระดับที่ 3: บทเรียนวิเคราะห์แบบผสานกำลัง (Synthesized Integration)' : 'Level 3: Synthesized Integration',
          parents: ['node-d2a', 'node-d2b']
        },
        {
          id: 'node-d4',
          label: lang === 'th' ? 'ระดับที่ 4: เควสท้าทายความเชี่ยวชาญสูงสุด (Autonomous Capstone Summit)' : 'Level 4: Autonomous Capstone Summit',
          parents: ['node-d3']
        }
      ];
    } else if (type === 'triple') {
      nodes = [
        {
          id: 'node-t1',
          label: lang === 'th' ? 'ระดับที่ 1: แกนความรู้หลักสูตร (Core Concepts Core)' : 'Level 1: Core Concepts Core',
          parents: []
        },
        {
          id: 'node-t2a',
          label: lang === 'th' ? 'ระดับที่ 2A: ทักษะวิเคราะห์ (Analytical Focus Track)' : 'Level 2A: Analytical Focus Track',
          parents: ['node-t1']
        },
        {
          id: 'node-t2b',
          label: lang === 'th' ? 'ระดับที่ 2B: ความคิดสร้างสรรค์ (Creative Design Track)' : 'Level 2B: Creative Design Track',
          parents: ['node-t1']
        },
        {
          id: 'node-t2c',
          label: lang === 'th' ? 'ระดับที่ 2C: ทักษะการสื่อสาร (Communication Track)' : 'Level 2C: Communication Track',
          parents: ['node-t1']
        },
        {
          id: 'node-t3',
          label: lang === 'th' ? 'ระดับที่ 3: สรุปหัวข้อย่อยและประยุกต์องค์รวม (Collaborative Synthesis Arena)' : 'Level 3: Collaborative Synthesis Arena',
          parents: ['node-t2a', 'node-t2b', 'node-t2c']
        },
        {
          id: 'node-t4',
          label: lang === 'th' ? 'ระดับที่ 4: การสาธิตความเข้าใจระดับปรมาจารย์ (Mastery Showcase)' : 'Level 4: Mastery Showcase',
          parents: ['node-t3']
        }
      ];
    }

    setTreeNodes(nodes);
  };

  // Reset to original linear defaults
  const handleResetSequence = () => {
    applyBranchingPreset('linear');
  };

  // --- TREE INTERACTIVE ACTIONS ---

  // Add child to a node (Branching)
  const handleAddChild = (parentId: string) => {
    const newId = `node-${Date.now()}`;
    const parentNode = treeNodes.find(n => n.id === parentId);
    const parentLabel = parentNode ? parentNode.label.split(':')[0] : 'Parent';
    
    const newNode: CurriculumTreeNode = {
      id: newId,
      label: lang === 'th' 
        ? `สาขาย่อยจาก ${parentLabel} (New Branch Level)` 
        : `Branch level from ${parentLabel}`,
      parents: [parentId]
    };

    setTreeNodes(prev => [...prev, newNode]);
    setActiveNodeId(newId);
    setIsEditingLabel(newId);
  };

  // Create an entirely new independent Root node
  const handleAddRoot = () => {
    const newId = `node-${Date.now()}`;
    const newNode: CurriculumTreeNode = {
      id: newId,
      label: lang === 'th' ? 'ระดับพื้นฐานใหม่ (New Root Level)' : 'New Root Level',
      parents: []
    };
    setTreeNodes(prev => [...prev, newNode]);
    setActiveNodeId(newId);
    setIsEditingLabel(newId);
  };

  // Delete node from tree
  const handleDeleteNode = (nodeId: string) => {
    setTreeNodes(prev => {
      // Remove node itself
      const filtered = prev.filter(n => n.id !== nodeId);
      // Clean parent references for other nodes
      return filtered.map(node => ({
        ...node,
        parents: node.parents.filter(pId => pId !== nodeId)
      }));
    });
    if (activeNodeId === nodeId) {
      setActiveNodeId(null);
    }
  };

  // Check if adding relation creates a loop
  const checkCycle = (descendantId: string, ancestorId: string, currentNodes: CurriculumTreeNode[]): boolean => {
    if (descendantId === ancestorId) return true;
    
    const descNode = currentNodes.find(n => n.id === descendantId);
    if (!descNode) return false;
    
    if (descNode.parents.includes(ancestorId)) return true;
    
    return descNode.parents.some(pId => checkCycle(pId, ancestorId, currentNodes));
  };

  // Add dependency (merge link)
  const handleAddParentRelation = (childId: string, parentId: string) => {
    if (childId === parentId) return;
    
    // Cycle check
    if (checkCycle(parentId, childId, treeNodes)) {
      alert(lang === 'th' ? '❌ ไม่สามารถจับคู่ได้ เนื่องจากจะทำให้เกิดวงจรปิดเสื่อมประสิทธิภาพ (Cycle Loop Detected!)' : '❌ Cannot link nodes: Cycle loop detected!');
      return;
    }

    setTreeNodes(prev => prev.map(node => {
      if (node.id === childId) {
        if (node.parents.includes(parentId)) return node;
        return { ...node, parents: [...node.parents, parentId] };
      }
      return node;
    }));
  };

  // Remove dependency relation
  const handleRemoveParentRelation = (childId: string, parentId: string) => {
    setTreeNodes(prev => prev.map(node => {
      if (node.id === childId) {
        return { ...node, parents: node.parents.filter(pId => pId !== parentId) };
      }
      return node;
    }));
  };

  // Edit in-place node label
  const handleSaveLabel = (id: string, newLabel: string) => {
    setTreeNodes(prev => prev.map(node => {
      if (node.id === id) {
        return { ...node, label: newLabel.trim() };
      }
      return node;
    }));
    setIsEditingLabel(null);
  };

  // --- TOPOLOGICAL RANK LAYOUT CALCULATION ---
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<Record<string, { x: number; y: number }>>({});

  // Topological rankings
  const nodeRanks = useMemo(() => {
    const ranks: Record<string, number> = {};
    
    // Default rank
    treeNodes.forEach(n => ranks[n.id] = 0);
    
    // Solve ranks iteratively
    let changed = true;
    for (let i = 0; i < 15 && changed; i++) {
      changed = false;
      treeNodes.forEach(node => {
        let maxParentRank = -1;
        node.parents.forEach(pId => {
          const pRank = ranks[pId];
          if (pRank !== undefined && pRank > maxParentRank) {
            maxParentRank = pRank;
          }
        });
        const newRank = maxParentRank + 1;
        if (ranks[node.id] !== newRank) {
          ranks[node.id] = newRank;
          changed = true;
        }
      });
    }

    return ranks;
  }, [treeNodes]);

  // Group nodes by rank
  const nodesByRank = useMemo(() => {
    const grouped: Record<number, CurriculumTreeNode[]> = {};
    treeNodes.forEach(node => {
      const rank = nodeRanks[node.id] || 0;
      if (!grouped[rank]) grouped[rank] = [];
      grouped[rank].push(node);
    });
    return grouped;
  }, [treeNodes, nodeRanks]);

  // Layout positions calculator for drawing connective SVG lines
  useEffect(() => {
    const container = boardContainerRef.current;
    if (!container || viewMode !== 'tree') return;

    const measureCoords = () => {
      const containerRect = container.getBoundingClientRect();
      const coords: Record<string, { x: number; y: number }> = {};

      treeNodes.forEach(node => {
        const el = document.getElementById(`tree-node-${node.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          coords[node.id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
          };
        }
      });

      setCoordinates(coords);
    };

    measureCoords();

    // Responsive listening
    const observer = new ResizeObserver(measureCoords);
    observer.observe(container);

    const timer = setTimeout(measureCoords, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [treeNodes, nodeRanks, viewMode]);

  return (
    <div className="space-y-6 animate-fade-in" id="curriculum-sequence-wizard">
      
      {/* Dynamic Keyframe Injection for the flowing dashes */}
      <style>{`
        @keyframes treeDash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .tree-flowing-line {
          stroke-dasharray: 6 3;
          animation: treeDash 1.2s linear infinite;
        }
      `}</style>

      {/* Title & Introduction Banner */}
      <div className="bg-[#FAF9FF] border border-[#673AB7]/15 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-[#673AB7]/10 text-[#673AB7] rounded-2xl shrink-0">
            <Network className="w-5 h-5 text-[#673AB7] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>{lang === 'th' ? 'โครงสร้างหลักสูตรและแผนผังด่านเกมพรอมต์ AI' : 'AI Prompt Game Progression & Levels'}</span>
              <span className="text-[9px] font-bold bg-[#673AB7]/10 text-[#673AB7] px-2 py-0.5 rounded-full">
                {viewMode === 'tree' ? 'Graph Tree View' : 'Linear List View'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
              {lang === 'th' 
                ? 'ออกแบบเส้นทางความก้าวหน้าและการปลดล็อกด่านในเกม (Scaffolding) ทั้งแบบทิวทัศน์เส้นตรงหรือแบบแตกแขนงทางเลือกให้ผู้เรียนตัดสินใจ'
                : 'Structure and visualizes progressive game milestones. You can organize linear levels or custom branching tracks for personalized choices.'
              }
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          {/* Editor Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'tree' 
                  ? 'bg-white text-[#673AB7] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'แผนผังต้นไม้' : 'Skill Tree'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-[#673AB7] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'รายการด่าน' : 'Flat List'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetSequence}
            title="Reset to default sequence"
            className="p-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-0.5 text-xs">
          <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
            {lang === 'th' ? 'หัวข้อหลักการสอน' : 'Main Teaching Lesson'}
          </span>
          <span className="font-extrabold text-slate-800 text-xs truncate">
            {config.topic || (lang === 'th' ? '(ยังไม่ได้ระบุ)' : '(Unspecified)')}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-0.5 text-xs">
          <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
            {lang === 'th' ? 'วิชาหลัก' : 'Active Subject'}
          </span>
          <span className="font-extrabold text-slate-800 text-xs">
            {config.subject} {config.customSubject ? `(${config.customSubject})` : ''}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-0.5 text-xs">
          <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
            {lang === 'th' ? 'เป้าหมายเกมหลัก' : 'Primary Game Goal'}
          </span>
          <span className="font-extrabold text-slate-800 text-xs truncate">
            {config.primaryGoal || (lang === 'th' ? '(ยังไม่ได้ระบุ)' : '(Unspecified)')}
          </span>
        </div>
      </div>

      {/* BRANCHING SKILL TREE EDITOR PANEL */}
      {viewMode === 'tree' && (
        <div className="space-y-4">
          
          {/* Skill tree top controllers & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black">
              <span className="text-slate-400 uppercase">{lang === 'th' ? 'สัญลักษณ์ด่าน:' : 'LEGENDS:'}</span>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-600">{lang === 'th' ? 'ด่านเริ่มต้น / รากเหง้า' : 'Gateway / Root'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#673AB7]" />
                <span className="text-slate-600">{lang === 'th' ? 'ด่านท้าทายกลางทาง' : 'Intermediate Track'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-600">{lang === 'th' ? 'ด่านบอสสุดท้าย / สำเร็จกาล' : 'Capstone Summit / Boss'}</span>
              </div>
            </div>

            {/* Quick Templates Injection */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">{lang === 'th' ? 'เลือกแผนผังด่วน:' : 'Templates:'}</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    applyBranchingPreset(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#673AB7]"
              >
                <option value="">{lang === 'th' ? '-- เลือกรูปแบบแผนผัง --' : '-- Choose Scheme --'}</option>
                <option value="linear">{lang === 'th' ? '📊 เส้นทางเรียงลำดับเส้นตรง (Standard Scaffolding)' : 'Linear Sequential Path'}</option>
                <option value="dual">{lang === 'th' ? '🔀 ทางเลือกสองเลนประยุกต์ (Dual-Branch Track)' : 'Dual Specialized Branches'}</option>
                <option value="triple">{lang === 'th' ? '🛡️ แผนผังสามมิติวิทยฐานะ (Triple Specialization)' : 'Triple Focus Framework'}</option>
              </select>
            </div>
          </div>

          {/* MAIN GRAPH CANVAS */}
          <div className="border border-slate-150 rounded-3xl bg-slate-50/20 relative overflow-hidden p-6 shadow-inner min-h-[500px]">
            
            {/* SVG Overlay Container for Dependency Paths */}
            <div ref={boardContainerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <svg className="w-full h-full">
                {/* Glow Filter */}
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw connective paths */}
                {treeNodes.map(child => {
                  return child.parents.map(parentId => {
                    const start = coordinates[parentId];
                    const end = coordinates[child.id];
                    if (!start || !end) return null;

                    // Smooth visual bezier curve with top-to-bottom gravity control points
                    const midY = (start.y + end.y) / 2;
                    const pathD = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

                    const isHighlighted = activeNodeId === child.id || activeNodeId === parentId;

                    return (
                      <g key={`${parentId}-${child.id}`} className="pointer-events-auto">
                        {/* Shadow path */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isHighlighted ? '#D1C4E9' : '#ECEFF1'}
                          strokeWidth={isHighlighted ? 6 : 4}
                          strokeLinecap="round"
                        />
                        {/* Glowing flowing dash path */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isHighlighted ? '#7E57C2' : '#90CAF9'}
                          strokeWidth={isHighlighted ? 3 : 2}
                          strokeLinecap="round"
                          className={isHighlighted ? 'tree-flowing-line' : ''}
                          style={{
                            transition: 'stroke 0.3s, stroke-width 0.3s'
                          }}
                        />
                      </g>
                    );
                  });
                })}
              </svg>
            </div>

            {/* Tree Nodes Renderer arranged in Topological Columns */}
            <div className="relative z-10 flex flex-col gap-16 justify-center items-center h-full">
              {treeNodes.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
                  <Bookmark className="w-12 h-12 text-slate-300 animate-bounce" />
                  <p className="text-xs text-slate-400 font-bold max-w-sm">
                    {lang === 'th' ? 'ยังไม่มีด่านระดับในผังต้นไม้ กดปุ่มสร้างปฐมรากฐานด้านล่างเพื่อเริ่มออกแบบเกมพรอมต์แชท AI' : 'No game levels present. Click below to introduce the initial gateway root level.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddRoot}
                    className="mt-2 py-2 px-4 bg-[#673AB7] hover:bg-[#5E35B1] text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'เพื่มรากฐานแรก (+ Root)' : 'Create Initial Gateway Level'}</span>
                  </button>
                </div>
              ) : (
                Object.keys(nodesByRank)
                  .sort((a, b) => Number(a) - Number(b))
                  .map(rankStr => {
                    const rank = Number(rankStr);
                    const rankNodes = nodesByRank[rank] || [];
                    
                    return (
                      <div key={rank} className="flex flex-row justify-center items-stretch gap-6 w-full flex-wrap">
                        {rankNodes.map(node => {
                          const isActive = activeNodeId === node.id;
                          const isEditing = isEditingLabel === node.id;
                          
                          // Determine color accents based on its hierarchy ranking
                          const isRoot = node.parents.length === 0;
                          const hasChildren = treeNodes.some(n => n.parents.includes(node.id));
                          const isSummit = !hasChildren && !isRoot;
                          
                          let nodeColorAccent = 'border-slate-200 bg-white hover:border-[#673AB7]';
                          let dotColor = 'bg-indigo-400';
                          if (isActive) {
                            nodeColorAccent = 'border-[#673AB7] bg-[#FAF9FF] ring-2 ring-[#ECE4FF]';
                          } else if (isRoot) {
                            nodeColorAccent = 'border-indigo-200 bg-white hover:border-indigo-400';
                            dotColor = 'bg-indigo-500';
                          } else if (isSummit) {
                            nodeColorAccent = 'border-emerald-200 bg-white hover:border-emerald-400';
                            dotColor = 'bg-emerald-500';
                          } else {
                            nodeColorAccent = 'border-purple-200 bg-white hover:border-purple-400';
                            dotColor = 'bg-[#673AB7]';
                          }

                          return (
                            <div
                              key={node.id}
                              id={`tree-node-${node.id}`}
                              onClick={() => {
                                if (!isEditing) {
                                  setActiveNodeId(isActive ? null : node.id);
                                }
                              }}
                              className={`p-4 rounded-2xl border w-full max-w-[240px] text-left transition-all duration-300 shadow-sm relative cursor-pointer select-none flex flex-col justify-between gap-3 ${nodeColorAccent}`}
                            >
                              
                              {/* Card Header Label */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                    <span>
                                      {isRoot ? (lang === 'th' ? 'รากฐาน' : 'GATEWAY') : isSummit ? (lang === 'th' ? 'ด่านบอส' : 'SUMMIT') : (lang === 'th' ? `ลำดับ ${rank + 1}` : `RANK ${rank + 1}`)}
                                    </span>
                                  </span>
                                  
                                  {/* Delete Node mini cross button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNode(node.id);
                                    }}
                                    title="Delete node"
                                    className="p-1 hover:bg-rose-50 rounded-md text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Text Label Editor */}
                                {isEditing ? (
                                  <div className="pt-1" onClick={e => e.stopPropagation()}>
                                    <input
                                      type="text"
                                      defaultValue={node.label}
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveLabel(node.id, e.currentTarget.value);
                                        } else if (e.key === 'Escape') {
                                          setIsEditingLabel(null);
                                        }
                                      }}
                                      onBlur={(e) => handleSaveLabel(node.id, e.target.value)}
                                      className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-[#673AB7] rounded-lg px-2 py-1 outline-none"
                                    />
                                    <span className="text-[7px] text-[#673AB7] font-black block mt-0.5">{lang === 'th' ? '⏎ กดปุ่ม Enter เพื่อบันทึก' : '⏎ Press Enter to save'}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-1 group pt-1">
                                    <span className="text-xs font-black text-slate-800 leading-snug">
                                      {node.label}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditingLabel(node.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-[#673AB7] transition-all rounded"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Dependencies tags display */}
                              {node.parents.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block">{lang === 'th' ? 'ต้องผ่านด่านย่อย:' : 'PREREQUISITES:'}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {node.parents.map(pId => {
                                      const parentNode = treeNodes.find(n => n.id === pId);
                                      if (!parentNode) return null;
                                      return (
                                        <div key={pId} className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-600 border border-slate-200/50">
                                          <span className="truncate max-w-[50px]">{parentNode.label}</span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveParentRelation(node.id, pId);
                                            }}
                                            className="text-slate-400 hover:text-rose-500 transition-colors font-black"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Card Bottom Quick Toolbar (Active State only) */}
                              <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddChild(node.id);
                                  }}
                                  className="text-[9px] text-[#673AB7] hover:text-[#5E35B1] font-black flex items-center gap-1 bg-[#673AB7]/5 px-2 py-1 rounded-lg hover:bg-[#673AB7]/10 transition-colors cursor-pointer"
                                >
                                  <GitBranch className="w-3 h-3 rotate-180" />
                                  <span>{lang === 'th' ? 'แตกกิ่งก้าน' : 'Add Branch'}</span>
                                </button>

                                {/* Trigger Dependency Picker Button */}
                                {treeNodes.length > 1 && (
                                  <div className="relative" onClick={e => e.stopPropagation()}>
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleAddParentRelation(node.id, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                      className="bg-slate-100 border border-slate-200 text-[8px] font-bold rounded-lg text-slate-600 py-1 px-1.5 outline-none hover:bg-slate-200 transition-colors cursor-pointer"
                                    >
                                      <option value="">🔗 {lang === 'th' ? 'เชื่อมโยงกับ' : 'Link parent'}</option>
                                      {treeNodes
                                        .filter(other => other.id !== node.id && !node.parents.includes(other.id))
                                        .map(other => (
                                          <option key={other.id} value={other.id}>
                                            {other.label}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })
              )}
            </div>

            {/* Tree Add-On Global Button */}
            {treeNodes.length > 0 && (
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  type="button"
                  onClick={handleAddRoot}
                  className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-lg"
                >
                  <PlusCircle className="w-4 h-4 text-[#673AB7]" />
                  <span>{lang === 'th' ? 'เพิ่มด่านอิสระใหม่ (+ Root)' : 'Create Independent Level'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRADITIONAL LIST REORDER WORKSPACE */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
              <span>{lang === 'th' ? 'รายการลำดับการเล่นแบบเส้นตรง' : 'Active Game Levels / Learning Sequence (Linear Mode)'}</span>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                {items.length} {lang === 'th' ? 'ลำดับทั้งหมด' : 'Steps Total'}
              </span>
            </label>

            {items.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center flex flex-col items-center justify-center gap-2">
                <Bookmark className="w-8 h-8 text-slate-300" />
                <p className="text-xs text-slate-400 font-bold">
                  {lang === 'th' ? 'ยังไม่มีลำดับการเรียนรู้ กดเลือกรูปแบบในส่วนแผนผังต้นไม้ หรือป้อนข้อมูลใหม่ด้านล่าง' : 'No sequence steps yet. Add custom step levels below.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between p-3.5 bg-white border rounded-xl shadow-sm transition-all ${
                      draggedIndex === idx 
                        ? 'border-indigo-500 bg-indigo-50/40 opacity-70 scale-[0.99] shadow-inner' 
                        : 'border-slate-150 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <span className="w-5.5 h-5.5 rounded-full bg-[#673AB7]/10 text-[#673AB7] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx] = e.target.value;
                          setItems(updated);
                        }}
                        className="flex-1 text-xs text-slate-800 font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-[#673AB7] focus:outline-none py-0.5 transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => moveListItem(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-all ${
                          idx === 0 ? 'text-slate-200 cursor-default' : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveListItem(idx, 'down')}
                        disabled={idx === items.length - 1}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-all ${
                          idx === items.length - 1 ? 'text-slate-200 cursor-default' : 'text-slate-400 hover:text-slate-700 cursor-pointer'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <span className="h-4 w-[1px] bg-slate-200 mx-1"></span>

                      <button
                        type="button"
                        onClick={() => handleDeleteListItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Input to add custom level */}
          <form onSubmit={handleAddListItem} className="flex gap-2.5">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={lang === 'th' ? 'ระบุระดับถัดไป (เช่น ด่านที่ 5: แผนผังประโยคสลับซับซ้อน)...' : 'Add custom level description (e.g. Stage 5: Advanced Dialogue Simulation)...'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#673AB7] focus:outline-none text-xs font-bold shadow-sm transition-colors"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                newItemText.trim()
                  ? 'bg-[#673AB7] hover:bg-[#5E35B1] text-white cursor-pointer shadow-md'
                  : 'bg-slate-100 text-slate-300 cursor-default'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'th' ? 'เพิ่มด่าน' : 'Add Level'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Pedogogical explanations & Help accordion info */}
      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-start gap-3.5">
        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>{lang === 'th' ? 'ประโยชน์ของกระบวนการวิถี Scaffolding แตกแขนง' : 'Pedagogical Benefit of Branching Game Trees'}</span>
            <button 
              type="button" 
              onClick={() => setShowTreeHelp(!showTreeHelp)} 
              className="text-[#673AB7] hover:underline cursor-pointer"
            >
              {showTreeHelp ? (lang === 'th' ? '[ซ่อนคำแนะนำ]' : '[Hide guide]') : (lang === 'th' ? '[แสดงวิธีออกแบบเพิ่มเติม]' : '[Show guide]')}
            </button>
          </h4>
          
          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
            {lang === 'th' 
              ? 'การจัดด่านการเล่นแบบแตกแขนง (Branching Skill Tree) จะป้อนข้อมูลความเกี่ยวพัน (Dependencies) เพื่อให้ระบบส่งรหัส AI นวัตกรรมเขียนโครงสร้างกระดานเกมให้มีความเลือกได้ มีสายการประเมินแยกย่อยตามกลุ่มทักษะ VARK/Bloom ให้ผู้เรียนค่อย ๆ ดื่มด่ำและทลายขีดจำกัดอย่างเป็นธรรมชาติ'
              : 'Branching structures allow the generated game prompt to build dynamic checkpoints where pupils make choice-driven path splits based on specialized VARK modules or Bloom Cognitive skills.'
            }
          </p>

          {showTreeHelp && (
            <div className="mt-3 pt-3 border-t border-slate-200/50 space-y-2 text-[11px] font-bold text-[#673AB7] leading-relaxed">
              <p className="font-extrabold">🎮 {lang === 'th' ? 'วิธีใช้ตัวเขียนผังต้นไม้ประยุกต์:' : 'How to modify the Skill Tree:'}</p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                <li>{lang === 'th' ? 'กดที่การ์ดด่าน เพื่อเปิดดูหรือจัดการลำดับ' : 'Click any node to select it.'}</li>
                <li>{lang === 'th' ? 'กดที่ไอคอนรูปปากกา ✏️ เพื่อแก้ไขข้อความบรรยายบทเรียนตรงตามตัวด่าน' : 'Click the pen icon ✏️ to edit the label text directly.'}</li>
                <li>{lang === 'th' ? 'กด "แตกกิ่งก้าน" (Add Branch) เพื่อสร้างด่านย่อยใหม่ที่สืบทอดเงื่อนไขจากด่านนั้น' : 'Click "Add Branch" to generate a descendant sub-level.'}</li>
                <li>{lang === 'th' ? 'เลือกหัวข้อในดรอปดาวน์ "เชื่อมโยงกับ" (Link parent) เพื่อเพิ่มความสอดคล้อง/ความเกี่ยวพันใหม่ (เช่น การรวมหลายกิ่งเข้าด้วยกัน!)' : 'Select a level from the "Link parent" dropdown to merge multiple tracks together.'}</li>
                <li>{lang === 'th' ? 'ลบความเกี่ยวพันได้โดยกดกากบาท (×) ถัดจากชื่อด่านพรีเรควิสิตในการ์ดตัวด่าน' : 'Remove links easily by clicking the cross (×) near the prerequisite tags.'}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
