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
  // EA-38: sob GITHUB_ACTIONS + evento pull_request, o runner faria
  // `git fetch origin <pull_request.base.sha> --depth=1` para metadados de
  // commit/diff do relatório — se o base.sha já é ancestral raso do
  // checkout (caso do piso do fecho), o fetch grava `.git/shallow` e trunca
  // a cadeia first-parent que o stage `fecho` precisa caminhar inteira.
  // Sem HTML/JSON reporter neste repo (só `list`), não há consumidor desses
  // metadados a perder — desligar é seguro. Pinado: repin em commit próprio.
  captureGitInfo: { commit: false, diff: false },
  use: { headless: true, launchOptions },
  projects: Object.entries(BP).map(([name, [width, height]]) => ({ name, use: { viewport: { width, height } } })),
});
module.exports.BREAKPOINTS = BP;
module.exports.RESOLVED_BROWSER = executablePath || 'playwright-managed';
