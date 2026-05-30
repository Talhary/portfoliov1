"use client";

import React, { useState } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, List, Heading1, Heading2, Heading3, ListOrdered } from 'lucide-react';

interface MarkdownEditorProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

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
    codeBlocks.push(`<pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-zinc-300"><code>${cleanCode.trim()}</code></pre>`);
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

export default function MarkdownEditor({ id, value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById(id) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || 'text') + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 0);
  };

  const previewHtml = parseMarkdown(value);

  return (
    <div className="w-full border border-stone-250 dark:border-zinc-800 rounded-xl overflow-hidden bg-white/[0.02] dark:bg-black/25">
      {/* Editor Tabs & Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-250 dark:border-zinc-800 bg-white/[0.03] dark:bg-zinc-900/40 p-2 gap-2">
        <div className="flex bg-white/5 dark:bg-black/20 p-1 rounded-lg w-fit border border-stone-200/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'write'
                ? 'bg-[#e49505] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-[#e49505] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Toolbar - Only visible when in Write tab */}
        {activeTab === 'write' && (
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => insertText('**', '**')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('# ')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('## ')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('### ')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <span className="w-[1px] h-4 bg-zinc-800 mx-1" />
            <button
              type="button"
              onClick={() => insertText('[', '](url)')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('```\n', '\n```')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('- ')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Unordered List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('1. ')}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-[#e49505] transition-colors"
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="relative w-full min-h-[250px]">
        {activeTab === 'write' ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Describe the project features, architecture, and tech details..."}
            className="w-full min-h-[250px] bg-transparent border-0 shadow-none py-3.5 px-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-b-xl resize-y font-normal leading-relaxed"
          />
        ) : (
          <div className="w-full min-h-[250px] p-6 text-zinc-200 overflow-y-auto max-h-[400px]">
            {previewHtml ? (
              <div 
                className="prose prose-invert prose-headings:text-white prose-a:text-[#e49505] prose-strong:text-white max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="text-zinc-500 italic text-xs">Nothing to preview yet. Write some markdown content first.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
