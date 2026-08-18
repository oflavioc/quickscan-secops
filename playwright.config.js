// PHASE 4.7 · Chromium Visual & Print Automation  [4.7.0.1-A] resolução portável de browser
const { defineConfig } = require('@playwright/test');
const fs = require('fs');

const explicit = process.env.CHROME_PATH;                 // 1 · override explícito
const localChrome = '/opt/google/chrome/chrome';          // 2 · só se realmente existir
const executablePath = explicit || (fs.existsSync(localChrome) ? localChrome : null);
                                                          // 3 · senão, Chromium gerenciado pelo Playwright
const launchOptions = { args: ['--no-sandbox', '--disable-dev-shm-usage'] };
if (executablePath) launchOptions.executablePath = executablePath;

const BP = { d1920: [1920, 1080], d1440: [1440, 900], d1366: [1366, 768], m390: [390, 844] };

module.exports = defineConfig({
  testDir: './tests_visual',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: { headless: true, launchOptions },
  projects: Object.entries(BP).map(([name, [width, height]]) => ({ name, use: { viewport: { width, height } } })),
});
module.exports.BREAKPOINTS = BP;
module.exports.RESOLVED_BROWSER = executablePath || 'playwright-managed';
