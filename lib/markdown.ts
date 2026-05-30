export function parseMarkdown(md: string): string {
  if (!md) return "";
  let html = md;

  // Preserve code blocks before parsing other markdown elements
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    // Clean code content to prevent basic tag injection, but allow rendering inside <code>
    const cleanCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    codeBlocks.push(`<pre class="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-zinc-300"><code>${cleanCode.trim()}</code></pre>`);
    return placeholder;
  });

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-white">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-white">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#e49505] hover:underline">$1</a>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-[#e49505]">$1</code>');

  // Lists (Unordered and Ordered)
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc ml-6 my-1">$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="list-decimal ml-6 my-1">$1</li>');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Paragraphs split by double newlines
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map(p => {
      // If the paragraph starts with list items, group them
      if (p.includes('<li class="list-')) {
        const isUnordered = p.includes('list-disc');
        const tag = isUnordered ? 'ul' : 'ol';
        return `<${tag} class="my-4 space-y-1">${p}</${tag}>`;
      }
      // If it contains block level tags, don't wrap in p
      if (/^\s*<(h[1-3]|pre|ul|ol|li)/i.test(p)) {
        return p;
      }
      if (!p.trim()) return '';
      return `<p class="my-3 leading-relaxed">${p.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return html;
}
