'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { JobState } from '@/hooks/use-tool-job';
import { FiLoader, FiCheckCircle, FiXCircle, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { ResultViewer } from '@/components/tools/ResultViewer';

interface Props {
  jobState: JobState;
  onReset: () => void;
  title?: string;
}

export const JobProgressModal = ({ jobState, onReset, title = 'Job Processing' }: Props) => {
  if (jobState.status === 'IDLE') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              {jobState.status === 'PROCESSING' || jobState.status === 'PENDING' ? (
                <FiLoader className="animate-spin text-primary" size={20} />
              ) : jobState.status === 'COMPLETED' ? (
                <FiCheckCircle className="text-emerald-500" size={20} />
              ) : (
                <FiXCircle className="text-rose-500" size={20} />
              )}
              {title}
            </h3>
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
              {jobState.status}
            </span>
          </div>

          {(jobState.status === 'PROCESSING' || jobState.status === 'PENDING') && (
            <div className="space-y-3 my-6">
              <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-zinc-400">
                <span>Executing Docker VPS Engine...</span>
                <span>{jobState.progress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${jobState.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {jobState.status === 'COMPLETED' && (
            <div className="my-6 space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm">
                Job completed successfully!
              </div>

              {jobState.outputFile && (
                <a
                  href={`/api/tools/jobs/${jobState.id}/download`}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  <FiDownload size={18} /> Download Generated Output
                </a>
              )}

              {jobState.resultData && <ResultViewer data={jobState.resultData} />}
            </div>
          )}

          {jobState.status === 'FAILED' && (
            <div className="my-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm">
              <p className="font-bold">Job Execution Failed</p>
              <p className="text-xs mt-1 font-mono">{jobState.error || 'Unknown error occurred'}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 transition-colors"
            >
              <FiRefreshCw size={14} /> Close & Reset
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
