import React, { useMemo, useState } from 'react';
import { X, ArrowLeftRight, Check, AlertCircle, Copy, FileText, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { PromptHistoryItem } from '../types';

interface PromptDiffViewerProps {
  versionA: PromptHistoryItem; // Left (older)
  versionB: PromptHistoryItem; // Right (newer)
  onClose: () => void;
  lang: 'th' | 'en';
}

interface AlignedDiffRow {
  left?: {
    lineNo: number;
    text: string;
    type: 'removed' | 'unchanged';
  };
  right?: {
    lineNo: number;
    text: string;
    type: 'added' | 'unchanged';
  };
}

// LCS-based line-by-line diff alignment algorithm
function generateAlignedDiff(oldStr: string, newStr: string): AlignedDiffRow[] {
  // Normalize line endings and split
  const oldLines = oldStr.replace(/\r\n/g, '\n').split('\n');
  const newLines = newStr.replace(/\r\n/g, '\n').split('\n');
  
  const m = oldLines.length;
  const n = newLines.length;
  
  // DP Table for LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  const alignedRows: AlignedDiffRow[] = [];
  let i = m;
  let j = n;
  
  // Backtrack to find alignment
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      alignedRows.unshift({
        left: { lineNo: i, text: oldLines[i - 1], type: 'unchanged' },
        right: { lineNo: j, text: newLines[j - 1], type: 'unchanged' }
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Added on the right
      alignedRows.unshift({
        right: { lineNo: j, text: newLines[j - 1], type: 'added' }
      });
      j--;
    } else {
      // Removed on the left
      alignedRows.unshift({
        left: { lineNo: i, text: oldLines[i - 1], type: 'removed' }
      });
      i--;
    }
  }
  
  return alignedRows;
}

export default function PromptDiffViewer({ versionA, versionB, onClose, lang }: PromptDiffViewerProps) {
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);

  const alignedRows = useMemo(() => {
    return generateAlignedDiff(versionA.prompt, versionB.prompt);
  }, [versionA.prompt, versionB.prompt]);

  // Statistics
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    
    alignedRows.forEach(row => {
      if (row.left && !row.right) removed++;
      else if (!row.left && row.right) added++;
      else unchanged++;
    });
    
    return { added, removed, unchanged };
  }, [alignedRows]);

  const copyToClipboard = (text: string, isLeft: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLeft) {
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } else {
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    }
  };

  // Filtered rows if user wants to see only modifications (and a few unchanged buffer lines)
  const displayedRows = useMemo(() => {
    if (!showOnlyChanges) return alignedRows;

    // Show rows that are changes, or within 3 lines of a change
    const windowSize = 3;
    const shouldShow = new Array(alignedRows.length).fill(false);

    for (let idx = 0; idx < alignedRows.length; idx++) {
      const row = alignedRows[idx];
      const isChange = (row.left && !row.right) || (!row.left && row.right);
      if (isChange) {
        const start = Math.max(0, idx - windowSize);
        const end = Math.min(alignedRows.length - 1, idx + windowSize);
        for (let k = start; k <= end; k++) {
          shouldShow[k] = true;
        }
      }
    }

    // Map rows, inserting a dummy spacer row where gaps occur
    const result: (AlignedDiffRow | { isSpacer: true })[] = [];
    let inSpacer = false;

    for (let idx = 0; idx < alignedRows.length; idx++) {
      if (shouldShow[idx]) {
        inSpacer = false;
        result.push(alignedRows[idx]);
      } else {
        if (!inSpacer) {
          result.push({ isSpacer: true });
          inSpacer = true;
        }
      }
    }

    return result;
  }, [alignedRows, showOnlyChanges]);

  return (
    <div id="diff-viewer-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300">
      <div className="bg-white w-full max-w-7xl h-[85vh] md:h-[90vh] rounded-3xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden animate-scale-up">
        
        {/* Header bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                <span>{lang === 'th' ? 'เปรียบเทียบเวอร์ชัน AI Prompt' : 'Compare Prompt Iterations'}</span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500 text-white font-black uppercase tracking-wider">
                  Split Diff View
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                {lang === 'th' ? 'ดูความแตกต่างของการออกแบบรายบรรทัดระหว่าง 2 ประวัติการสร้าง' : 'Line-by-line split analysis of modifications across generated templates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Show only changes filter toggle */}
            <button
              type="button"
              onClick={() => setShowOnlyChanges(!showOnlyChanges)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border flex items-center gap-1.5 ${
                showOnlyChanges
                  ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{lang === 'th' ? 'แสดงเฉพาะบรรทัดที่เปลี่ยน' : 'Show Only Changes'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${showOnlyChanges ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diff Statistics strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-150 flex flex-wrap items-center justify-between gap-4 text-xs font-bold shrink-0">
          <div className="flex items-center gap-4 text-slate-600">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">{lang === 'th' ? 'สถิติการแก้ไข:' : 'Modifications:'}</span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              <span>+{stats.added} {lang === 'th' ? 'บรรทัดเพิ่ม' : 'additions'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2 h-2 rounded bg-rose-500" />
              <span>-{stats.removed} {lang === 'th' ? 'บรรทัดลบ' : 'deletions'}</span>
            </span>
            <span className="text-slate-400">
              • {stats.unchanged} {lang === 'th' ? 'บรรทัดคงเดิม' : 'unchanged lines'}
            </span>
          </div>

          <div className="text-[10px] text-slate-400">
            {lang === 'th' ? 'เปรียบเทียบซ้าย (เวอร์ชันเก่ากว่า) ไป ขวา (เวอร์ชันใหม่กว่า)' : 'Left shows Old version → Right shows New version'}
          </div>
        </div>

        {/* Split Screen Panel titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100 shrink-0">
          {/* Left panel metadata */}
          <div className="p-4 bg-rose-50/20 border-r border-slate-100 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">{lang === 'th' ? 'เวอร์ชันดั้งเดิม (ซ้าย)' : 'ORIGINAL VERSION (LEFT)'}</span>
                <span className="text-[10px] text-slate-400 font-bold">({versionA.timestamp})</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800 truncate mt-1">
                {versionA.subjectName} • <span className="font-semibold text-slate-500">{versionA.topic}</span>
              </h4>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(versionA.prompt, true)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              {copiedLeft ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLeft ? (lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!') : (lang === 'th' ? 'คัดลอก' : 'Copy')}</span>
            </button>
          </div>

          {/* Right panel metadata */}
          <div className="p-4 bg-emerald-50/20 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">{lang === 'th' ? 'เวอร์ชันใหม่กว่า (ขวา)' : 'REVISED VERSION (RIGHT)'}</span>
                <span className="text-[10px] text-slate-400 font-bold">({versionB.timestamp})</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800 truncate mt-1">
                {versionB.subjectName} • <span className="font-semibold text-slate-500">{versionB.topic}</span>
              </h4>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(versionB.prompt, false)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              {copiedRight ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRight ? (lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!') : (lang === 'th' ? 'คัดลอก' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Split Screen Body */}
        <div className="flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 p-2 select-text selection:bg-[#673AB7]/30">
          <div className="min-w-[800px] divide-y divide-slate-900/50">
            {displayedRows.map((row, idx) => {
              if ('isSpacer' in row) {
                return (
                  <div key={`spacer-${idx}`} className="grid grid-cols-2 bg-slate-900/40 text-center py-2 text-slate-500 border-y border-slate-900 text-[10px] tracking-widest font-black select-none">
                    <div className="border-r border-slate-900">••• GAP OMITTED •••</div>
                    <div>••• GAP OMITTED •••</div>
                  </div>
                );
              }

              const leftRow = row.left;
              const rightRow = row.right;

              // Row background styling
              let leftBg = 'bg-transparent';
              let leftTextCol = 'text-slate-400';
              let leftSign = ' ';
              if (leftRow) {
                if (leftRow.type === 'removed') {
                  leftBg = 'bg-rose-950/40 border-r border-rose-900/50';
                  leftTextCol = 'text-rose-200 font-semibold';
                  leftSign = '-';
                } else {
                  leftBg = 'border-r border-slate-900';
                  leftTextCol = 'text-slate-400';
                }
              } else {
                leftBg = 'bg-slate-900/10 border-r border-slate-900';
              }

              let rightBg = 'bg-transparent';
              let rightTextCol = 'text-slate-300';
              let rightSign = ' ';
              if (rightRow) {
                if (rightRow.type === 'added') {
                  rightBg = 'bg-emerald-950/40';
                  rightTextCol = 'text-emerald-200 font-semibold';
                  rightSign = '+';
                } else {
                  rightBg = 'bg-transparent';
                  rightTextCol = 'text-slate-400';
                }
              } else {
                rightBg = 'bg-slate-900/10';
              }

              return (
                <div key={idx} className="grid grid-cols-2 hover:bg-slate-900/30 transition-colors group/row">
                  {/* Left (Old) Cell */}
                  <div className={`flex items-start ${leftBg} py-0.5 px-3 min-w-0`}>
                    {/* Line number */}
                    <span className="w-8 shrink-0 text-right pr-2 text-slate-600 text-[10px] select-none border-r border-slate-900/60 mr-2 group-hover/row:text-slate-400 transition-colors">
                      {leftRow ? leftRow.lineNo : ''}
                    </span>
                    {/* Change indicator sign */}
                    <span className={`w-4 shrink-0 text-center font-bold text-[10px] select-none ${leftRow?.type === 'removed' ? 'text-rose-400' : 'text-slate-600'}`}>
                      {leftSign}
                    </span>
                    {/* Code block */}
                    <pre className={`flex-1 overflow-x-auto whitespace-pre-wrap leading-relaxed break-all ${leftTextCol}`}>
                      {leftRow ? leftRow.text : ''}
                    </pre>
                  </div>

                  {/* Right (New) Cell */}
                  <div className={`flex items-start ${rightBg} py-0.5 px-3 min-w-0`}>
                    {/* Line number */}
                    <span className="w-8 shrink-0 text-right pr-2 text-slate-600 text-[10px] select-none border-r border-slate-900/60 mr-2 group-hover/row:text-slate-400 transition-colors">
                      {rightRow ? rightRow.lineNo : ''}
                    </span>
                    {/* Change indicator sign */}
                    <span className={`w-4 shrink-0 text-center font-bold text-[10px] select-none ${rightRow?.type === 'added' ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {rightSign}
                    </span>
                    {/* Code block */}
                    <pre className={`flex-1 overflow-x-auto whitespace-pre-wrap leading-relaxed break-all ${rightTextCol}`}>
                      {rightRow ? rightRow.text : ''}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>
              {lang === 'th' 
                ? 'คำแนะนำ: คุณสามารถคัดลอกส่วนใดก็ได้ในเวอร์ชันปรับแก้ด้านขวาเพื่อนำไปใช้งานได้อย่างเต็มระบบ'
                : 'Pro-tip: Scroll inside the viewer to view all alignments. You can copy raw text from either pane.'
              }
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {lang === 'th' ? 'ปิดหน้าต่างเปรียบเทียบ' : 'Close Diff Viewer'}
          </button>
        </div>

      </div>
    </div>
  );
}
