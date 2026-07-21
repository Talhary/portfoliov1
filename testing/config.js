const path = require('path');
const fs = require('fs');

// Default target URL to the live production domain
const BASE_URL = process.env.TEST_BASE_URL || 'https://talhacodes.site';
// Headless set to false so browser is visually visible during test execution
const HEADLESS = process.env.TEST_HEADLESS === 'true' ? true : false;
const CONCURRENCY = parseInt(process.env.TEST_CONCURRENCY || '2', 10);
const TIMEOUT = parseInt(process.env.TEST_TIMEOUT || '20000', 10);

const RESULTS_DIR = path.join(__dirname, 'results');
const SCREENSHOTS_DIR = path.join(RESULTS_DIR, 'screenshots');

/**
 * Parses ALL_TOOLS array from lib/tools/registry.ts without requiring ts-node
 */
function loadToolsFromRegistry() {
  const registryPath = path.join(__dirname, '..', 'lib', 'tools', 'registry.ts');
  if (!fs.existsSync(registryPath)) {
    throw new Error(`Registry file not found at ${registryPath}`);
  }

  const content = fs.readFileSync(registryPath, 'utf8');

  // Extract objects in ALL_TOOLS array
  const toolsMatch = content.match(/export const ALL_TOOLS: ToolDefinition\[\] = \[\s*([\s\S]*?)\n\];/);
  if (!toolsMatch) {
    throw new Error('Could not parse ALL_TOOLS array from registry.ts');
  }

  const toolsBlock = toolsMatch[1];
  const tools = [];
  
  // Match each object literal in the array
  const objectRegex = /\{\s*id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*category:\s*'([^']+)',\s*description:\s*'([^']*)'/g;
  
  let match;
  while ((match = objectRegex.exec(toolsBlock)) !== null) {
    const isAsync = toolsBlock.substring(match.index, match.index + 200).includes('isAsync: true');
    const isNew = toolsBlock.substring(match.index, match.index + 200).includes('isNew: true');

    tools.push({
      id: match[1],
      slug: match[2],
      title: match[3],
      category: match[4],
      description: match[5],
      isAsync,
      isNew
    });
  }

  return tools;
}

module.exports = {
  BASE_URL,
  HEADLESS,
  CONCURRENCY,
  TIMEOUT,
  RESULTS_DIR,
  SCREENSHOTS_DIR,
  loadToolsFromRegistry,
};
