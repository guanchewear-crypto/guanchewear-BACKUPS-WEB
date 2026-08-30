import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = 'http://localhost:3000';
const outputDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log('Launching Chrome:', chromePath);

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'shell',
  ignoreDefaultArgs: ['--disable-extensions'],
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
  ],
});

const port = browser.wsEndpoint().split('/').pop().split(':')[1];
console.log('Chrome launched. WsPort:', port);

console.log('Running Lighthouse audit...');

const results = await lighthouse(url, {
  port: Number(port),
  logLevel: 'info',
  onlyCategories: {
    performance: true,
    accessibility: true,
    'best-practices': true,
    seo: true,
  },
}, {});

// Write JSON report
const reportPath = path.join(outputDir, 'lighthouse-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results.lhr, null, 2));

console.log('\n═══════════════════════════════════════');
console.log('Lighthouse Results');
console.log('═══════════════════════════════════════');

for (const [category, data] of Object.entries(results.lhr.categories)) {
  const score = Math.round(data.score * 100);
  const icon = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
  console.log(`${icon} ${category.toUpperCase()}: ${score}/100`);
}

console.log('═══════════════════════════════════════');
console.log('Report saved to:', reportPath);

// Write HTML report
fs.writeFileSync(path.join(outputDir, 'lighthouse-report.html'), results.report);
console.log('HTML report also saved to:', path.join(outputDir, 'lighthouse-report.html'));

await browser.close();
console.log('Chrome closed.');
