'use client';

import { useState, useEffect, useRef } from 'react';

export interface JobState {
  id: string | null;
  status: 'IDLE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  resultData: any | null;
  outputFile: string | null;
  error: string | null;
}

export function useToolJob(toolId: string) {
  const [jobState, setJobState] = useState<JobState>({
    id: null,
    status: 'IDLE',
    progress: 0,
    resultData: null,
    outputFile: null,
    error: null,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startJob = async (params: Record<string, any>) => {
    clearPolling();
    setJobState({
      id: null,
      status: 'PENDING',
      progress: 5,
      resultData: null,
      outputFile: null,
      error: null,
    });

    try {
      const res = await fetch('/api/tools/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, params }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit job');
      }

      setJobState((prev) => ({
        ...prev,
        id: data.jobId,
        status: data.status || 'PENDING',
      }));

      // Start polling status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/tools/jobs/${data.jobId}`);
          const statusData = await statusRes.json();

          if (!statusRes.ok || statusData.error) {
            throw new Error(statusData.error || 'Status check failed');
          }

          setJobState({
            id: statusData.id,
            status: statusData.status,
            progress: statusData.progress || 0,
            resultData: statusData.resultData,
            outputFile: statusData.outputFile,
            error: statusData.error,
          });

          if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED') {
            clearPolling();
          }
        } catch (err: any) {
          clearPolling();
          setJobState((prev) => ({
            ...prev,
            status: 'FAILED',
            error: err.message || 'Polling error',
          }));
        }
      }, 1200);
    } catch (err: any) {
      setJobState((prev) => ({
        ...prev,
        status: 'FAILED',
        error: err.message || 'Job submission failed',
      }));
    }
  };

  const resetJob = () => {
    clearPolling();
    setJobState({
      id: null,
      status: 'IDLE',
      progress: 0,
      resultData: null,
      outputFile: null,
      error: null,
    });
  };

  useEffect(() => {
    return () => clearPolling();
  }, []);

  return {
    jobState,
    startJob,
    resetJob,
    isProcessing: jobState.status === 'PENDING' || jobState.status === 'PROCESSING',
  };
}
