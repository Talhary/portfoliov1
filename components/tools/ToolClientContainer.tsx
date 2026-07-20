'use client';

import { ToolDefinition } from '@/lib/tools/registry';

// Category Module Imports
import { CalculatorsModule } from '@/components/tools/modules/CalculatorsModule';
import { ImageToolModule } from '@/components/tools/modules/ImageToolModule';
import { TextToolModule } from '@/components/tools/modules/TextToolModule';
import { ColorToolModule } from '@/components/tools/modules/ColorToolModule';
import { DeveloperToolModule } from '@/components/tools/modules/DeveloperToolModule';
import { DateTimeModule } from '@/components/tools/modules/DateTimeModule';
import { ConverterModule } from '@/components/tools/modules/ConverterModule';
import { SecurityModule } from '@/components/tools/modules/SecurityModule';
import { SeoModule } from '@/components/tools/modules/SeoModule';
import { FileToolModule } from '@/components/tools/modules/FileToolModule';

export function ToolClientContainer({ tool }: { tool: ToolDefinition }) {
  switch (tool.category) {
    case 'calculators':
      return <CalculatorsModule tool={tool} />;
    case 'image-tools':
      return <ImageToolModule tool={tool} />;
    case 'text-tools':
      return <TextToolModule tool={tool} />;
    case 'color-tools':
      return <ColorToolModule tool={tool} />;
    case 'developer-utilities':
      return <DeveloperToolModule tool={tool} />;
    case 'date-time':
      return <DateTimeModule tool={tool} />;
    case 'converters':
      return <ConverterModule tool={tool} />;
    case 'security-utilities':
      return <SecurityModule tool={tool} />;
    case 'seo-tools':
      return <SeoModule tool={tool} />;
    case 'file-tools':
      return <FileToolModule tool={tool} />;
    default:
      return <DeveloperToolModule tool={tool} />;
  }
}
