/* PHASE 4.8 · AJ · E2E real de Session Portability + AA/Z/AB/AC */
const { test, expect } = require('@playwright/test');
const { open, F } = require('./fixtures');
const path = require('path'), fs = require('fs'), os = require('os');
const EV = path.join(__dirname, '..', 'visual_evidence');
const W = () => test.info().project.use.viewport.width;
test.skip(() => !['d1366','m390'].includes(test.info().project.name), 'AC: gates novos em 1366 e 390');

test('SE1 E2E: sessão → export real → nova sessão → import real → Results', async ({ page }) => {
  const sink = {}; await open(page, sink);
  /* sessão completa por interação real */
  await page.click('#start'); await page.keyboard.press('1'); await page.keyboard.press('Enter');
  for (let i=0;i<15;i++){ await page.keyboard.press('2'); await page.keyboard.press('Enter'); }
  await page.click('#ref-skip-all');
  await page.click('.ux-priogroup .opt'); await page.click('#next');
  await expect(page.locator('body')).toHaveAttribute('data-uxscreen','results');
  const before = await page.evaluate(()=>({
    inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
    legacy: window.__DEV.legacySnapshot(),
    ctx: JSON.stringify(window.__DEV.V32.buildRecommendationContext()) }));
  /* export real com download do browser */
  const dl = page.waitForEvent('download');
  await page.click('#ses-export');
  await page.fill('#ses-label', 'Conta Sintética');
  await page.click('#ux-modal-ok');
  const download = await dl;
  const file = path.join(os.tmpdir(), 'qs-session-e2e.json');
  await download.saveAs(file);
  expect(download.suggestedFilename()).toMatch(/^quickscan-secops_Conta-Sintetica_\d{8}-\d{4}\.json$/);
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(doc.format).toBe('quickscan-secops-session');
  expect(JSON.stringify(doc)).not.toMatch(/"score"|domainScores|recommendationContext|refinementScore/);
  /* nova sessão */
  await page.click('#ux-newsession'); await page.click('#ux-modal-ok');
  expect(await page.evaluate(()=>window.__DEV.sessionHasContent())).toBe(false);
  /* import real via file chooser */
  await page.click('#ses-import-home');
  await page.setInputFiles('input[type=file]', file);
  await expect(page.locator('#ux-modal')).toContainText('Respostas core');
  await page.click('#ux-modal-ok');
  await expect(page.locator('body')).toHaveAttribute('data-uxscreen','results');
  const after = await page.evaluate(()=>({
    inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
    legacy: window.__DEV.legacySnapshot(),
    ctx: JSON.stringify(window.__DEV.V32.buildRecommendationContext()) }));
  expect(after.inputs).toBe(before.inputs);
  expect(after.legacy).toBe(before.legacy);
  expect(after.ctx).toBe(before.ctx);
  /* Z · nenhuma persistência · AA · nenhuma rede */
  const persisted = await page.evaluate(()=>({ ls: localStorage.length, ss: sessionStorage.length, ck: document.cookie }));
  expect(persisted).toEqual({ ls: 0, ss: 0, ck: '' });
  expect(sink.requests.filter(u=>/^(https?|wss?):/i.test(u))).toEqual([]);
  expect(sink.errors).toEqual([]);
  await page.screenshot({ path: path.join(EV, `SE1-imported-${W()}.png`), fullPage: true });
});

test('SE2 UI de sessão: overflow, teclado, engine mismatch, long label', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F4_legacy(page);
  const noOv = async l => { const r = await page.evaluate(()=>({s:document.documentElement.scrollWidth,c:document.documentElement.clientWidth}));
    expect(r.s, l).toBeLessThanOrEqual(r.c + 1); };
  await noOv('results com controles');
  await page.click('#ses-export');
  await page.fill('#ses-label', 'Conta '.repeat(30));
  await noOv('modal export com label longo');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>!document.getElementById('ux-modal'))).toBe(true);
  expect(await page.evaluate(()=>document.activeElement.id)).toBe('ses-export');
  /* engine mismatch com arquivo real */
  const bad = path.join(os.tmpdir(), 'qs-session-badengine.json');
  const doc = await page.evaluate(()=>{ const d = window.__DEV.buildSessionDocument('X'); d.engineSha256='0'.repeat(64); return d; });
  fs.writeFileSync(bad, JSON.stringify(doc, null, 2));
  await page.click('#ses-import');
  await page.setInputFiles('input[type=file]', bad);
  await expect(page.locator('#ux-modal')).toContainText('outro engine de maturidade');
  expect(await page.locator('#ux-modal').textContent()).not.toContain('Forçar');
  await noOv('modal engine mismatch');
  await page.click('#ux-modal-ok');
  expect(sink.errors).toEqual([]);
  await page.screenshot({ path: path.join(EV, `SE2-session-ui-${W()}.png`), fullPage: true });
});

test('SE3 AB · controles de sessão ausentes do PDF Chromium', async ({ page }) => {
  await open(page); await F.F3_rich(page);
  await page.emulateMedia({ media: 'print' });
  const p = path.join(__dirname, '..', 'print_evidence', `SE3-session-${W()}.pdf`);
  await page.pdf({ path: p, preferCSSPageSize: true, printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  const txt = require('child_process').execSync(`pdftotext -layout ${p} -`).toString();
  for (const s of ['Exportar sessão','Importar sessão','Nome da sessão'])
    expect(txt, `"${s}" não deve aparecer no PDF`).not.toContain(s);
});

test('SE4 · [19] oversize real > 1 MiB recusado sem parse nem commit', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page);
  const before = await page.evaluate(()=>({
    inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
    ctx: JSON.stringify(window.__DEV.V32.buildRecommendationContext()),
    screen: document.body.dataset.uxscreen }));
  const big = path.join(os.tmpdir(), 'qs-session-oversize.json');
  const doc = await page.evaluate(()=>window.__DEV.buildSessionDocument('Grande'));
  doc.inputs.assessment.notes.logs = 'A'.repeat(1024*1024 + 4096);   // documento real acima do limite
  fs.writeFileSync(big, JSON.stringify(doc));
  expect(fs.statSync(big).size).toBeGreaterThan(1024*1024);
  await page.click('#ses-import');
  await page.setInputFiles('input[type=file]', big);
  await expect(page.locator('#ux-modal')).toContainText('limite de 1 MiB');
  /* [4.8.0.3-23] evidência COM o modal aberto — prova visual da rejeição */
  await page.screenshot({ path: path.join(EV, `SE4-oversize-modal-${W()}.png`), fullPage: false });
  await page.click('#ux-modal-ok');
  const after = await page.evaluate(()=>({
    inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
    ctx: JSON.stringify(window.__DEV.V32.buildRecommendationContext()),
    screen: document.body.dataset.uxscreen }));
  expect(after).toEqual(before);
  expect(sink.errors).toEqual([]);
  await page.screenshot({ path: path.join(EV, `SE4-oversize-state-preserved-${W()}.png`), fullPage: false });
});

test('SE5 · [20] XSS real: payloads hostis permanecem inertes após import', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await page.evaluate(()=>{ window.__pwned = undefined; });
  const XSS = '<script>window.__pwned=1<\/script><img src=x onerror="window.__pwned=1"><svg/onload=alert(1)>';
  const file = path.join(os.tmpdir(), 'qs-session-xss.json');
  const doc = await page.evaluate((X)=>{
    const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response",
      "detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage",
      "external-surface","vulnerability-management"];
    IDS.forEach(id=>window.__DEV.setAnswerById(id,1)); window.__DEV.setArq(0);
    window.__DEV.setNote(9, X);
    window.__DEV.V32.TECH_LANDSCAPE["security-analytics"] = { presence:"PARTIAL", declaredDriver:{note:X},
      solutions:[{ vendor:X, product:X, notes:X }] };
    window.__DEV.showResults();
    return window.__DEV.buildSessionDocument(X);
  }, XSS);
  fs.writeFileSync(file, JSON.stringify(doc, null, 2));
  await page.click('#ux-newsession'); await page.click('#ux-modal-ok');
  await page.click('#ses-import-home');
  await page.setInputFiles('input[type=file]', file);
  await page.click('#ux-modal-ok');
  await expect(page.locator('body')).toHaveAttribute('data-uxscreen','results');
  const probe = await page.evaluate(()=>({
    pwned: window.__pwned,
    scripts: document.querySelectorAll('#app script').length,
    handlers: document.querySelectorAll('#app [onerror],#app [onload],#app [onclick]').length,
    svg: document.querySelectorAll('#app svg[onload]').length,
    asText: document.getElementById('app').textContent.includes('onerror') }));
  expect(probe.pwned).toBeUndefined();
  expect(probe.scripts).toBe(0);
  expect(probe.handlers).toBe(0);
  expect(probe.svg).toBe(0);
  expect(probe.asText, 'payload deve aparecer como texto inerte').toBe(true);
  /* também no relatório de impressão */
  await page.emulateMedia({ media:'print' });
  await page.evaluate(()=>window.__DEV.preparePrint());
  const printProbe = await page.evaluate(()=>({ s: document.querySelectorAll('#v32-print-report script').length,
    h: document.querySelectorAll('#v32-print-report [onerror],#v32-print-report [onload]').length }));
  await page.evaluate(()=>window.__DEV.finishPrint());
  await page.emulateMedia({ media:'screen' });
  expect(printProbe).toEqual({ s:0, h:0 });
  expect(sink.errors).toEqual([]);
  await page.screenshot({ path: path.join(EV, `SE5-xss-inert-${W()}.png`), fullPage: true });
});

/* ===== [4.8.0.7] PREFLIGHT DE EXPORT EM CHROMIUM REAL ===== */
const EMOJI = '\u{1F600}';                       /* U+1F600 · astral: 1 escalar, 2 code units UTF-16 */

test('SE6 · boundary Unicode: export real → download → nova sessão → import real → Results', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page);
  /* nota com exatamente 10.000 ESCALARES astrais (20.000 code units UTF-16) */
  await page.evaluate((E)=>{ window.__DEV.setNote(9, E.repeat(10000)); window.__DEV.showResults(); }, EMOJI);
  const before = await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()));
  const dl = page.waitForEvent('download');
  await page.click('#ses-export');
  await page.fill('#ses-label', 'Unicode ' + EMOJI.repeat(20));
  await page.click('#ux-modal-ok');
  const download = await dl;
  const file = path.join(os.tmpdir(), `qs-unicode-${W()}.json`);
  await download.saveAs(file);
  /* os bytes realmente emitidos preservam os 10.000 escalares, sem truncar nem normalizar */
  const raw = fs.readFileSync(file, 'utf8');
  const doc = JSON.parse(raw);
  expect(Buffer.byteLength(raw, 'utf8')).toBeLessThanOrEqual(1048576);
  expect([...doc.inputs.assessment.notes.logs].length).toBe(10000);
  /* nova sessão → import real pelo seletor de arquivos → preview → confirmação → Results */
  await page.click('#ux-newsession'); await page.click('#ux-modal-ok');
  expect(await page.evaluate(()=>window.__DEV.sessionHasContent())).toBe(false);
  await page.click('#ses-import-home');
  await page.setInputFiles('input[type=file]', file);
  await expect(page.locator('#ux-modal')).toContainText('Respostas core');
  await page.click('#ux-modal-ok');
  await expect(page.locator('body')).toHaveAttribute('data-uxscreen','results');
  const after = await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()));
  expect(after).toBe(before);
  const persisted = await page.evaluate(()=>({ ls: localStorage.length, ss: sessionStorage.length, ck: document.cookie }));
  expect(persisted).toEqual({ ls: 0, ss: 0, ck: '' });
  expect(sink.requests.filter(u=>/^(https?|wss?):/i.test(u))).toEqual([]);
  expect(sink.errors).toEqual([]);
  await page.screenshot({ path: path.join(EV, `SE6-unicode-import-${W()}.png`), fullPage: true });
});

test('SE7 · campo acima do limite: nenhum download, erro visível, estado intacto', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page);
  await page.evaluate((E)=>{ window.__DEV.setNote(9, E.repeat(10001)); window.__DEV.showResults(); }, EMOJI);
  const before = await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()));
  /* observa Object URL real do browser: nenhum deve ser criado para um export recusado */
  await page.evaluate(()=>{ window.__urls = 0; const c = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b)=>{ window.__urls++; return c(b); }; });
  let downloaded = false;
  page.on('download', ()=>{ downloaded = true; });
  await page.click('#ses-export');
  await page.fill('#ses-label', 'acima-do-limite');
  await page.click('#ux-modal-ok');
  await expect(page.locator('#ux-modal')).toContainText('Não foi possível exportar');
  await expect(page.locator('.ses-err')).toBeVisible();
  await page.click('#ux-modal-ok');
  await page.waitForTimeout(400);
  expect(downloaded).toBe(false);
  expect(await page.evaluate(()=>window.__urls)).toBe(0);
  expect(await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()))).toBe(before);
  await expect(page.locator('body')).toHaveAttribute('data-uxscreen','results');
  await page.screenshot({ path: path.join(EV, `SE7-export-field-limit-${W()}.png`), fullPage: true });
});

test('SE8 · export acima de 1 MiB: nenhum download, limite exibido, estado intacto', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page);
  await page.evaluate(()=>{
    const V = window.__DEV.V32;
    window.__DEV.QS_IDS_FALLBACK = null;
    for (let i=0;i<15;i++) window.__DEV.setNote(i, 'N'.repeat(10000));
    Object.keys(V.TECH_LANDSCAPE).forEach((cap,i)=>{
      V.TECH_LANDSCAPE[cap] = { presence:'PRESENT', declaredDriver:{ note:'D'.repeat(10000) },
        solutions:[{ vendor:'V'+i, product:'P'+i, coverage:'C'.repeat(10000), notes:'O'.repeat(10000) },
                   { vendor:'W'+i, product:'Q'+i, coverage:'C'.repeat(10000), notes:'O'.repeat(10000) }] };
    });
  });
  const before = await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()));
  /* o documento é válido campo a campo: a recusa vem do TAMANHO da serialização emitida */
  const pre = await page.evaluate(()=>{ const p = window.__DEV.prepareSessionExport('grande');
    return { ok:p.ok, reason:p.reason, bytes:p.bytes,
      fieldsValid: window.__DEV.validateSessionDocument(window.__DEV.buildSessionDocument('grande')).ok }; });
  expect(pre.ok).toBe(false);
  expect(pre.reason).toBe('oversize');
  expect(pre.bytes).toBeGreaterThan(1048576);
  expect(pre.fieldsValid).toBe(true);
  await page.evaluate(()=>{ window.__urls = 0; const c = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b)=>{ window.__urls++; return c(b); }; });
  let downloaded = false;
  page.on('download', ()=>{ downloaded = true; });
  await page.click('#ses-export');
  await page.fill('#ses-label', 'grande');
  await page.click('#ux-modal-ok');
  await expect(page.locator('#ux-modal')).toContainText('Não foi possível exportar');
  await expect(page.locator('.ses-err')).toContainText('1 MiB');
  await page.click('#ux-modal-ok');
  await page.waitForTimeout(400);
  expect(downloaded).toBe(false);
  expect(await page.evaluate(()=>window.__urls)).toBe(0);
  expect(await page.evaluate(()=>JSON.stringify(window.__DEV.captureCanonicalInputs()))).toBe(before);
  await page.screenshot({ path: path.join(EV, `SE8-export-1mib-${W()}.png`), fullPage: true });
});
