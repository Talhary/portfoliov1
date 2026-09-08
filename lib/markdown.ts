import hljs from 'highlight.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function parseMarkdown(md: string): string {
  if (!md) return "";
  let html = md;

  // 1. Clean up unrendered LaTeX notation if present
  html = html
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\left\\lfloor\s*/g, 'floor(')
    .replace(/\\right\\rfloor/g, ')')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\times/g, '×')
    .replace(/\\bmod|\\mod/g, 'mod')
    .replace(/\\\$/g, '$');

  // 2. Preserve and style code blocks
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, blockContent) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    
    const lines = blockContent.split('\n');
    let lang = '';
    let code = blockContent;
    
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (/^[a-zA-Z0-9_+\-#]+$/.test(firstLine) && lines.length > 1) {
        lang = firstLine;
        code = lines.slice(1).join('\n');
      }
    }

    const trimmedCode = code.trim();
    const targetLang = lang ? lang.toLowerCase() : '';
    
    if (targetLang === 'mermaid') {
      const encoded = encodeURIComponent(trimmedCode);
      codeBlocks.push(
        `<div class="mermaid-block my-6 p-4 sm:p-6 rounded-2xl bg-[#0a0a0c] border border-red-500/30 shadow-[0_10px_35px_rgba(255,27,28,0.1)] overflow-x-auto"><div class="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80"><div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500"><span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></span><span>System Architecture &amp; Dataflow Flowchart</span></div><span class="text-[10px] font-semibold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Live Diagram</span></div><div class="mermaid-diagram flex justify-center items-center w-full min-h-[220px] overflow-x-auto" data-mermaid="${encoded}"><div class="text-zinc-400 text-xs flex items-center gap-2 py-8 animate-pulse"><svg class="w-4 h-4 animate-spin text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Rendering interactive architecture flowchart...</div></div></div>`
      );
      return placeholder;
    }

    let highlightedCode = '';
    if (targetLang && hljs.getLanguage(targetLang)) {
      try {
        highlightedCode = hljs.highlight(trimmedCode, { language: targetLang }).value;
      } catch (e) {
        highlightedCode = escapeHtml(trimmedCode);
      }
    } else {
      try {
        highlightedCode = hljs.highlight(trimmedCode, { language: 'plaintext' }).value;
      } catch (e) {
        highlightedCode = escapeHtml(trimmedCode);
      }
    }

    codeBlocks.push(
      `<div class="my-5 rounded-xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] shadow-xl">
        <div class="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span>
            <span class="ml-2 font-semibold text-zinc-300 uppercase">${targetLang || 'terminal'}</span>
          </div>
        </div>
        <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-zinc-300 hljs"><code class="language-${targetLang}">${highlightedCode}</code></pre>
      </div>`
    );
    return placeholder;
  });

  // 3. Parse Markdown Tables (| col | col |)
  const tableRegex = /((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\r?\n|$))+)/gm;
  html = html.replace(tableRegex, (match) => {
    const rawLines = match.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length < 2) return match;

    const parseRow = (line: string) => {
      return line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(c => c.trim());
    };

    const headerCells = parseRow(rawLines[0]);
    // Line 1 is the separator (| --- | --- |)
    const bodyLines = rawLines.slice(2);

    let theadHtml = '<thead class="bg-zinc-100 dark:bg-zinc-800/90 border-b border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-wider text-[11px] sm:text-xs"><tr>';
    headerCells.forEach(cell => {
      theadHtml += `<th class="px-4 py-3.5">${cell}</th>`;
    });
    theadHtml += '</tr></thead>';

    let tbodyHtml = '<tbody class="divide-y divide-zinc-200/70 dark:divide-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">';
    bodyLines.forEach((rowLine, rIdx) => {
      const rowCells = parseRow(rowLine);
      const rowBg = rIdx % 2 === 0 ? 'bg-transparent' : 'bg-zinc-50/50 dark:bg-zinc-900/30';
      tbodyHtml += `<tr class="${rowBg} hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">`;
      rowCells.forEach((cell, cIdx) => {
        const isFirst = cIdx === 0;
        const fontStyle = isFirst ? 'font-semibold text-zinc-900 dark:text-zinc-100' : '';
        tbodyHtml += `<td class="px-4 py-3 align-top ${fontStyle}">${cell}</td>`;
      });
      tbodyHtml += '</tr>';
    });
    tbodyHtml += '</tbody>';

    return `__TABLE_BLOCK__<div class="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 shadow-sm"><table class="w-full text-left border-collapse">${theadHtml}${tbodyHtml}</table></div>__TABLE_BLOCK__`;
  });

  // 4. Headings
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base sm:text-lg font-bold mt-6 mb-2 text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><span class="w-1.5 h-4 rounded-full bg-[var(--project-color,#ef4444)] inline-block"></span>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg sm:text-xl font-extrabold mt-8 mb-4 text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-200 dark:border-zinc-800/80">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-xl sm:text-2xl font-extrabold mt-10 mb-4 text-zinc-900 dark:text-zinc-100">$1</h1>');

  // 5. Blockquotes
  html = html.replace(/^\s*>\s+(.*?)$/gm, '<blockquote class="border-l-4 border-[var(--project-color,#ef4444)] bg-zinc-100/60 dark:bg-zinc-900/60 px-4 py-3 rounded-r-xl my-4 text-sm text-zinc-700 dark:text-zinc-300 italic font-medium">$1</blockquote>');

  // 6. Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-zinc-900 dark:text-zinc-100">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // 7. Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--project-color,#ef4444)] hover:underline font-medium inline-flex items-center gap-1">$1</a>');

  // 8. Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-200/70 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-200 px-1.5 py-0.5 rounded text-xs font-mono border border-zinc-300/50 dark:border-zinc-700/50 font-semibold">$1</code>');

  // 9. Lists (Unordered and Ordered)
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc ml-5 my-1 text-zinc-700 dark:text-zinc-300 leading-relaxed">$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="list-decimal ml-5 my-1 text-zinc-700 dark:text-zinc-300 leading-relaxed">$1</li>');

  // 10. Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // 11. Clean paragraph grouping without introducing broken double lines
  const sections = html.split(/\n\n+/);
  html = sections
    .map(sec => {
      const trimmed = sec.trim();
      if (!trimmed) return '';
      if (trimmed.includes('__TABLE_BLOCK__')) {
        return trimmed.replace(/__TABLE_BLOCK__/g, '');
      }
      if (trimmed.includes('<li class="list-')) {
        const isUnordered = trimmed.includes('list-disc');
        const tag = isUnordered ? 'ul' : 'ol';
        return `<${tag} class="my-3 space-y-1.5">${trimmed}</${tag}>`;
      }
      if (/^\s*<(h[1-3]|div|pre|blockquote|table|ul|ol)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p class="my-2.5 leading-relaxed text-zinc-700 dark:text-zinc-350">${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .join('');

  return html;
}

