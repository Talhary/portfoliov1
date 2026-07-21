const fs = require('fs');
const path = require('path');
const { RESULTS_DIR, BASE_URL } = require('./config');

/**
 * Ensures results directory exists
 */
function ensureResultsDir() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
}

/**
 * Print terminal report, generate JSON summary & HTML dashboard
 */
function generateReport(results, metadata = {}) {
  ensureResultsDir();

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const warnings = results.reduce((acc, r) => acc + (r.warnings ? r.warnings.length : 0), 0);
  const totalDurationMs = results.reduce((acc, r) => acc + r.durationMs, 0);
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

  const categoryStats = {};
  results.forEach(r => {
    if (!categoryStats[r.category]) {
      categoryStats[r.category] = { total: 0, passed: 0, failed: 0, durationMs: 0 };
    }
    categoryStats[r.category].total += 1;
    if (r.passed) categoryStats[r.category].passed += 1;
    else categoryStats[r.category].failed += 1;
    categoryStats[r.category].durationMs += r.durationMs;
  });

  // 1. TERMINAL SUMMARY PRINT
  console.log('\n' + '='.repeat(70));
  console.log(` 📊  AUTOMATED TOOL TESTING REPORT`);
  console.log(` 🌐 Target Domain: ${BASE_URL}`);
  console.log(` ⏱️  Total Duration: ${(totalDurationMs / 1000).toFixed(2)}s`);
  console.log('='.repeat(70));
  console.log(` TOTAL TOOLS TESTED : ${total}`);
  console.log(` ✅ PASSED           : ${passed} (${passRate}%)`);
  console.log(` ❌ FAILED           : ${failed}`);
  console.log(` ⚠️  WARNINGS         : ${warnings}`);
  console.log('='.repeat(70));

  console.log('\n📁 CATEGORY BREAKDOWN:');
  Object.keys(categoryStats).forEach(cat => {
    const s = categoryStats[cat];
    const catRate = ((s.passed / s.total) * 100).toFixed(0);
    const statusIcon = s.failed === 0 ? '✅' : '⚠️';
    console.log(` ${statusIcon} ${cat.padEnd(22)}: ${s.passed}/${s.total} Passed (${catRate}%) [${(s.durationMs / 1000).toFixed(1)}s]`);
  });

  if (failed > 0) {
    console.log('\n❌ FAILED TOOLS DETAILED FINDINGS:');
    results.filter(r => !r.passed).forEach((r, idx) => {
      console.log(`\n ${idx + 1}. [${r.category}/${r.slug}] ${r.title}`);
      console.log(`    Error: ${r.error}`);
      if (r.screenshot) {
        console.log(`    Screenshot: ${r.screenshot}`);
      }
    });
  } else {
    console.log('\n🎉 ALL TOOLS PASSED SUCCESSFULLY WITH 0 ERRORS!');
  }
  console.log('='.repeat(70) + '\n');

  // 2. SAVE JSON REPORT
  const jsonReportPath = path.join(RESULTS_DIR, 'report.json');
  const reportData = {
    targetUrl: BASE_URL,
    timestamp: new Date().toISOString(),
    summary: {
      total,
      passed,
      failed,
      passRate: parseFloat(passRate),
      warnings,
      totalDurationMs,
    },
    categoryStats,
    results,
  };

  fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2));
  console.log(`📄 Saved JSON Report: ${jsonReportPath}`);

  // 3. SAVE HTML REPORT DASHBOARD
  const htmlReportPath = path.join(RESULTS_DIR, 'report.html');
  const htmlContent = generateHtmlDashboard(reportData);
  fs.writeFileSync(htmlReportPath, htmlContent);
  console.log(`🌐 Saved HTML Dashboard: ${htmlReportPath}\n`);

  return reportData;
}

/**
 * Generates an interactive HTML dashboard
 */
function generateHtmlDashboard(report) {
  const { summary, categoryStats, results, targetUrl, timestamp } = report;

  const toolRowsHtml = results.map((r, i) => `
    <tr class="tool-row ${r.passed ? 'passed' : 'failed'}" data-category="${r.category}" data-status="${r.passed ? 'pass' : 'fail'}">
      <td class="font-mono text-xs text-stone-400">${i + 1}</td>
      <td>
        <div class="font-bold text-stone-900 dark:text-white">${escapeHtml(r.title)}</div>
        <div class="text-xs font-mono text-stone-500">${escapeHtml(r.category)}/${escapeHtml(r.slug)}</div>
      </td>
      <td>
        ${r.passed 
          ? `<span class="badge badge-pass">PASSED</span>` 
          : `<span class="badge badge-fail">FAILED</span>`}
      </td>
      <td class="font-mono text-xs text-stone-600 dark:text-zinc-300">${(r.durationMs / 1000).toFixed(2)}s</td>
      <td class="text-xs text-stone-600 dark:text-zinc-400">
        ${r.error ? `<div class="text-red-500 font-semibold mb-1">${escapeHtml(r.error)}</div>` : '<span class="text-emerald-500">No runtime errors</span>'}
        ${r.warnings && r.warnings.length ? `<div class="text-amber-500 text-[11px]">${r.warnings.length} warning(s)</div>` : ''}
      </td>
      <td>
        ${r.screenshot ? `<a href="${escapeHtml(r.screenshot)}" target="_blank" class="text-blue-500 hover:underline text-xs font-bold">View Screenshot</a>` : '-'}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Automated Tool Testing Dashboard - ${escapeHtml(targetUrl)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .badge { padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pass { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-fail { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
  </style>
</head>
<body class="bg-stone-950 text-stone-100 min-h-screen p-6 font-sans">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight">Automated Tool Testing Findings</h1>
        <p class="text-sm text-stone-400 mt-1">Target: <a href="${escapeHtml(targetUrl)}" class="text-sky-400 underline font-mono" target="_blank">${escapeHtml(targetUrl)}</a> | Executed: ${new Date(timestamp).toLocaleString()}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-4 py-2 bg-stone-900 rounded-xl border border-stone-800 text-xs font-bold text-stone-300">
          ⏱️ Total Time: ${(summary.totalDurationMs / 1000).toFixed(1)}s
        </span>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-stone-900 border border-stone-800 rounded-2xl p-5">
        <div class="text-xs uppercase font-bold text-stone-400">Total Tools Tested</div>
        <div class="text-3xl font-black text-white mt-1">${summary.total}</div>
      </div>
      <div class="bg-stone-900 border border-stone-800 rounded-2xl p-5">
        <div class="text-xs uppercase font-bold text-emerald-400">Passed</div>
        <div class="text-3xl font-black text-emerald-400 mt-1">${summary.passed} <span class="text-sm font-normal text-stone-400">(${summary.passRate}%)</span></div>
      </div>
      <div class="bg-stone-900 border border-stone-800 rounded-2xl p-5">
        <div class="text-xs uppercase font-bold text-rose-400">Failed</div>
        <div class="text-3xl font-black text-rose-400 mt-1">${summary.failed}</div>
      </div>
      <div class="bg-stone-900 border border-stone-800 rounded-2xl p-5">
        <div class="text-xs uppercase font-bold text-amber-400">Warnings</div>
        <div class="text-3xl font-black text-amber-400 mt-1">${summary.warnings}</div>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-stone-800 flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Tool Test Results</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-stone-800 text-xs font-bold text-stone-400 uppercase bg-stone-950/50">
              <th class="p-4">#</th>
              <th class="p-4">Tool</th>
              <th class="p-4">Status</th>
              <th class="p-4">Latency</th>
              <th class="p-4">Findings & Errors</th>
              <th class="p-4">Artifact</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-800 text-sm">
            ${toolRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  generateReport,
};
