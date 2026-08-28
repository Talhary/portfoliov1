"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Eye,
  RefreshCw,
  Award
} from 'lucide-react';

export function CvBuilderWidget() {
  const [generalTags, setGeneralTags] = useState<string[]>(['senior', 'fullstack']);
  const [skillTags, setSkillTags] = useState<string[]>([
    'golang',
    'typescript',
    'docker',
    'kubernetes',
    'distributed-systems',
    'react',
    'nextjs',
  ]);
  const [projectTags, setProjectTags] = useState<string[]>([
    'container-engine',
    'browser-pool',
    'media-pipeline',
  ]);

  const [customTagInput, setCustomTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableSkills = [
    'golang', 'typescript', 'docker', 'kubernetes', 'distributed-systems',
    'react', 'nextjs', 'nodejs', 'postgresql', 'redis', 'graphql',
    'microservices', 'grpc', 'cloudflare', 'linux', 'ci-cd', 'system-design'
  ];

  const availableRoles = [
    'senior', 'fullstack', 'backend', 'cloud-architect', 'systems-engineer', 'devops-lead'
  ];

  const availableProjects = [
    'container-engine', 'browser-pool', 'media-pipeline', 'lead-scraper', 'blog-ai-engine'
  ];

  const toggleTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const handleGeneratePdf = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generalTags,
          skillTags,
          projectTags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compile ATS vector PDF resume.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error compiling dynamic CV.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDirect = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Talha_Riaz_CV_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-8">
      {/* Builder Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Award size={14} /> Go Vector PDF Compiler
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Dynamic Go ATS Resume / CV PDF Builder
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Customize skill matrices and project tags to compile an ATS-optimized, high-resolution vector PDF resume dynamically.
              </p>
            </div>

            {pdfUrl && (
              <button
                onClick={handleDownloadDirect}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 shrink-0"
              >
                <Download size={15} /> Download PDF
              </button>
            )}
          </div>

          {/* Tag Selectors */}
          <div className="space-y-5">
            {/* General Role Tags */}
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2.5">
                Target Role & Seniority Profile
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((tag) => {
                  const isSelected = generalTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(generalTags, setGeneralTags, tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-102'
                          : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-primary'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2.5">
                Technical Stack & Systems Skillset
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((tag) => {
                  const isSelected = skillTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(skillTags, setSkillTags, tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-102'
                          : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-500'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Tags */}
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2.5">
                Featured Engineering Project Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {availableProjects.map((tag) => {
                  const isSelected = projectTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(projectTags, setProjectTags, tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-102'
                          : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-2">
              <button
                onClick={handleGeneratePdf}
                disabled={loading}
                className="w-full sm:w-auto h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Compiling High-Res Vector PDF...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Tailored Resume PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* PDF Preview */}
          {pdfUrl && (
            <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye size={16} className="text-primary" /> Live PDF Vector Preview
                </h3>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                >
                  Open in New Tab <ExternalLink size={13} />
                </a>
              </div>

              <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-800 bg-zinc-900 shadow-inner">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-none"
                  title="Compiled ATS Vector Resume"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
