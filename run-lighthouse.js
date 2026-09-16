const puppeteer = require('puppeteer-core');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

(async () => {
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const url = 'http://localhost:3000';
  const outputDir = path.join(__dirname, 'dist');

  // Ensure dist exists
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
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  console.log('Chrome launched, running Lighthouse audit...');

  try {
    const results = await lighthouse(url, {
      port: browser.wsEndpoint().replace('ws://', '').split(':')[1],
      logLevel: 'info',
      onlyCategories: {
        performance: true,
        accessibility: true,
        'best-practices': true,
        seo: true,
      },
      chromeSettings: {
        throttlingMethod: 'provided',
      },
    }, {
      // Pass the WS port from puppeteer
      port: browser.wsEndpoint().split('/').pop().split(':')[1],
    });

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
    console.log('═══════════════════════════════════════');
    
    // Write HTML report too
    const htmlReport = results.report;
    fs.writeFileSync(path.join(outputDir, 'lighthouse-report.html'), htmlReport);
    console.log('HTML report also saved to:', path.join(outputDir, 'lighthouse-report.html'));
    
  } catch (error) {
    console.error('Lighthouse error:', error.message);
    // Fallback: try direct chrome-flags approach
    console.log('\nTrying fallback approach...');
  }

  await browser.close();
  console.log('Chrome closed.');
  process.exit(0);
})().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
