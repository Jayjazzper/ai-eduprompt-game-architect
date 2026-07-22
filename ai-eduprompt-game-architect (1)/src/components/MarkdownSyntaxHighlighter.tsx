import React, { useMemo } from 'react';

interface MarkdownSyntaxHighlighterProps {
  code: string;
}

export default function MarkdownSyntaxHighlighter({ code }: MarkdownSyntaxHighlighterProps) {
  const lines = useMemo(() => code.split('\n'), [code]);

  // Helper function to parse inline bolding and code blocks
  const parseInline = (text: string) => {
    // Matches **bold** or `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanText = part.slice(2, -2);
        return (
          <span key={index} className="text-[#FF7B72] font-bold">
            {cleanText}
          </span>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={index} className="bg-slate-800 text-[#E1E4E8] px-1.5 py-0.5 rounded font-mono text-[10px] md:text-[11px] border border-slate-700 font-semibold">
            {cleanText}
          </span>
        );
      }
      return <span key={index} className="text-[#E1E4E8]">{part}</span>;
    });
  };

  const renderLineContent = (line: string) => {
    if (line.trim() === '') {
      return <span className="block h-4">&nbsp;</span>;
    }

    // Main Header (H1)
    if (line.startsWith('# ')) {
      return (
        <span className="block font-bold">
          <span className="text-[#F97583] font-mono mr-1.5 font-extrabold">#</span>
          <span className="text-[#79B8FF] text-xs md:text-sm tracking-tight font-extrabold">{line.slice(2)}</span>
        </span>
      );
    }

    // Subheader (H2)
    if (line.startsWith('## ')) {
      return (
        <span className="block font-bold mt-1.5">
          <span className="text-[#F97583] font-mono mr-1.5 font-extrabold">##</span>
          <span className="text-[#B392F0] text-[11px] md:text-xs tracking-tight font-extrabold">{line.slice(3)}</span>
        </span>
      );
    }

    // Sub-subheader (H3)
    if (line.startsWith('### ')) {
      return (
        <span className="block font-bold mt-1">
          <span className="text-[#F97583] font-mono mr-1.5 font-extrabold">###</span>
          <span className="text-[#9ECBFF] text-[10px] md:text-xs font-bold">{line.slice(4)}</span>
        </span>
      );
    }

    // List item (e.g., "- item")
    const listMatch = line.match(/^(\s*)([-*])\s(.*)$/);
    if (listMatch) {
      const spaces = listMatch[1];
      const bullet = listMatch[2];
      const rest = listMatch[3];
      return (
        <span>
          <span className="text-slate-500 font-mono whitespace-pre">{spaces}</span>
          <span className="text-[#F97583] font-mono font-bold mr-1.5 md:mr-2">{bullet}</span>
          <span className="leading-relaxed font-semibold text-[11px] md:text-xs">{parseInline(rest)}</span>
        </span>
      );
    }

    // Regular line content
    return <span className="leading-relaxed font-semibold text-[11px] md:text-xs">{parseInline(line)}</span>;
  };

  return (
    <div id="syntax-codeblock" className="w-full bg-[#0d1117] rounded-b-2xl border border-slate-900/60 overflow-hidden font-mono text-xs shadow-inner max-h-[520px] overflow-y-auto scrollbar-thin select-text">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="hover:bg-slate-900/30 group/row transition-colors">
              {/* Line Numbers Column */}
              <td className="w-10 text-right pr-3 pl-2.5 text-slate-600 select-none border-r border-slate-800/40 font-mono text-[9px] md:text-[10px] leading-relaxed align-top py-0.5 bg-slate-950/20">
                {i + 1}
              </td>
              {/* Highlighted Code Line Content Column */}
              <td className="pl-4 pr-3 py-0.5 font-mono leading-relaxed break-words whitespace-pre-wrap align-top text-slate-300">
                {renderLineContent(line)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
