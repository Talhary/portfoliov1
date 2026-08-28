'use client';

import React from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { CloudSandboxWidget } from '@/components/portfolio-tools/CloudSandboxWidget';
import { UniversalMediaDownloaderWidget } from '@/components/portfolio-tools/UniversalMediaDownloaderWidget';
import { GooglePlacesStreamWidget } from '@/components/portfolio-tools/GooglePlacesStreamWidget';
import { GoContactScraperWidget } from '@/components/portfolio-tools/GoContactScraperWidget';
import { CvBuilderWidget } from '@/components/portfolio-tools/CvBuilderWidget';
import { CodeRunnerWidget } from '@/components/portfolio-tools/CodeRunnerWidget';
import { AiBlogGeneratorWidget } from '@/components/portfolio-tools/AiBlogGeneratorWidget';
import { DuckSearchWidget } from '@/components/portfolio-tools/DuckSearchWidget';
import { BrowserCdpWidget } from '@/components/portfolio-tools/BrowserCdpWidget';
import { SystemSuggestionsWidget } from '@/components/portfolio-tools/SystemSuggestionsWidget';

export function CloudSystemsModule({ tool }: { tool: ToolDefinition }) {
  switch (tool.slug) {
    case 'cloud-sandbox':
    case 'docker-launcher':
      return <CloudSandboxWidget />;
    case 'media-downloader':
      return <UniversalMediaDownloaderWidget />;
    case 'places-stream':
      return <GooglePlacesStreamWidget />;
    case 'contact-scraper':
      return <GoContactScraperWidget />;
    case 'cv-builder':
      return <CvBuilderWidget />;
    case 'code-runner':
      return <CodeRunnerWidget />;
    case 'ai-blog-generator':
      return <AiBlogGeneratorWidget />;
    case 'duck-search':
      return <DuckSearchWidget />;
    case 'browser-cdp':
      return <BrowserCdpWidget />;
    case 'system-suggestions':
      return <SystemSuggestionsWidget />;
    default:
      return <CloudSandboxWidget />;
  }
}
