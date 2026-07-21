const path = require('path');
const { 
  loadToolsFromRegistry, 
  BASE_URL, 
  HEADLESS, 
  CONCURRENCY 
} = require('./config');
const { launchBrowser, testTool } = require('./utils/browser');
const { generateReport } = require('./reporter');

// Import Category Test Modules
const testCalculators = require('./modules/testCalculators');
const testTextTools = require('./modules/testTextTools');
const testColorTools = require('./modules/testColorTools');
const testDeveloperTools = require('./modules/testDeveloperTools');
const testDateTime = require('./modules/testDateTime');
const testConverters = require('./modules/testConverters');
const testSecurity = require('./modules/testSecurity');
const testSeo = require('./modules/testSeo');
const testImageTools = require('./modules/testImageTools');
const testFileTools = require('./modules/testFileTools');

const CATEGORY_MODULE_MAP = {
  'calculators': testCalculators,
  'text-tools': testTextTools,
  'color-tools': testColorTools,
  'developer-utilities': testDeveloperTools,
  'date-time': testDateTime,
  'converters': testConverters,
  'security-utilities': testSecurity,
  'seo-tools': testSeo,
  'image-tools': testImageTools,
  'file-tools': testFileTools,
};

// Parse CLI Flags
const args = process.argv.slice(2);
let categoryFilter = null;
let slugFilter = null;
let customUrl = null;
let isHeadless = HEADLESS;
let concurrency = CONCURRENCY;

args.forEach(arg => {
  if (arg.startsWith('--category=')) {
    categoryFilter = arg.split('=')[1];
  } else if (arg.startsWith('--slug=')) {
    slugFilter = arg.split('=')[1];
  } else if (arg.startsWith('--url=')) {
    customUrl = arg.split('=')[1];
  } else if (arg === '--headless=false') {
    isHeadless = false;
  } else if (arg.startsWith('--concurrency=')) {
    concurrency = parseInt(arg.split('=')[1], 10) || 1;
  }
});

async function main() {
  console.log(`🚀 Starting Automated Tool Testing Suite...`);
  
  // Load all 106 tools from registry
  let allTools = loadToolsFromRegistry();
  console.log(`📋 Loaded ${allTools.length} tools from registry.`);

  // Apply filters if provided
  if (categoryFilter) {
    allTools = allTools.filter(t => t.category === categoryFilter);
    console.log(`🔍 Filtered by Category "${categoryFilter}": ${allTools.length} tool(s) selected.`);
  }

  if (slugFilter) {
    allTools = allTools.filter(t => t.slug === slugFilter);
    console.log(`🎯 Filtered by Slug "${slugFilter}": ${allTools.length} tool(s) selected.`);
  }

  if (allTools.length === 0) {
    console.error(`❌ No tools matched the specified filters.`);
    process.exit(1);
  }

  // Launch browser
  const browser = await launchBrowser({ headless: isHeadless });
  const results = [];

  console.log(`🌐 Target Base URL: ${customUrl || BASE_URL}`);
  console.log(`⚡ Running tests with concurrency: ${concurrency}\n`);

  // Process tools in batches according to concurrency
  for (let i = 0; i < allTools.length; i += concurrency) {
    const batch = allTools.slice(i, i + concurrency);
    const batchPromises = batch.map(tool => {
      const moduleHandler = CATEGORY_MODULE_MAP[tool.category] || testDeveloperTools;
      process.stdout.write(` Running [${i + 1}/${allTools.length}] ${tool.category}/${tool.slug}... `);
      
      return testTool(browser, tool, moduleHandler).then(res => {
        if (res.passed) {
          console.log(`✅ PASS (${res.durationMs}ms)`);
        } else {
          console.log(`❌ FAIL (${res.durationMs}ms): ${res.error}`);
        }
        return res;
      });
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  await browser.close();

  // Generate final findings report (Console, JSON, HTML)
  generateReport(results);
}

main().catch(err => {
  console.error('Fatal error running tool tests:', err);
  process.exit(1);
});
