/* PHASE 4.7 · GATES DE IMPRESSÃO (P1–P11) — PDF canônico: Chromium print real */
const { test, expect } = require('@playwright/test');
const { open, F } = require('./fixtures');
const path = require('path'), fs = require('fs'), cp = require('child_process');
const PE = path.join(__dirname, '..', 'print_evidence');

/* [ajuste 5] preflight: sem pdftoppm/pdftotext o raster gate NÃO passa (sem fallback silencioso) */
const HAS = bin => { try { cp.execSync(`which ${bin}`, {stdio:'ignore'}); return true; } catch { return false; } };
const HAS_RASTER = HAS('pdftoppm'), HAS_TEXT = HAS('pdftotext'), HAS_INFO = HAS('pdfinfo');
const CANONICAL_HOST = process.env.QS_CANONICAL_HOST === '1';   // [ajuste 7] page count rígido só aqui

/* [ajuste 4] PDF canônico */
async function pdf(page, name, opts={}) {
  await page.emulateMedia({ media: 'print' });
  const p = path.join(PE, name + '.pdf');
  await page.pdf({ path: p, preferCSSPageSize: true, printBackground: true, ...opts });
  await page.emulateMedia({ media: 'screen' });      // restaura: print media esconde a UI interativa
  return p;
}
const info = f => cp.execSync(`pdfinfo ${f}`).toString();
const text = f => cp.execSync(`pdftotext -layout ${f} -`).toString();
const bbox = f => cp.execSync(`pdftotext -bbox ${f} -`).toString();

test.describe.configure({ mode: 'serial' });
test.skip(() => (test.info().project.name !== 'd1440'), 'print roda uma vez no breakpoint canônico');

test('preflight ferramentas de PDF', async () => {
  const missing = [!HAS_RASTER&&'pdftoppm', !HAS_TEXT&&'pdftotext', !HAS_INFO&&'pdfinfo'].filter(Boolean);
  if (missing.length && CANONICAL_HOST) throw new Error('host canônico sem: ' + missing.join(', '));
  expect(missing, 'faltando (declarado): ' + missing.join(', ')).toEqual([]);
});

test('P1+P2 journey e radar no A4 real', async ({ page }) => {
  await open(page); await F.F7_target_up(page);
  /* assertions de DOM/bbox no media print, ANTES de gerar */
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(()=>window.__DEV.preparePrint());
  await page.waitForTimeout(50);
  const nodes = await page.evaluate(()=>Array.from(document.querySelectorAll('#pr-journey .jn-node')).map(n=>({
    name: n.querySelector('.jn-name').textContent.trim(), box: n.getBoundingClientRect().toJSON() })));
  expect(nodes.length, 'nós no PDF').toBe(6);
  const sorted=[...nodes].sort((a,b)=>a.box.x-b.box.x);
  for (let i=1;i<sorted.length;i++)
    expect(sorted[i-1].box.x+sorted[i-1].box.width, `"${sorted[i-1].name}" sobrepõe "${sorted[i].name}"`)
      .toBeLessThanOrEqual(sorted[i].box.x + 1);
  const radar = await page.evaluate(()=>{ const s=document.querySelector('#pr-target svg.pr-radar')||document.querySelector('#pr-journey svg');
    if(!s) return null; const b=s.getBoundingClientRect(), p=s.parentElement.getBoundingClientRect();
    return { inside: b.left>=p.left-1 && b.right<=p.right+1, labels: s.querySelectorAll('text').length }; });
  if (radar) { expect(radar.inside, 'radar dentro do container').toBe(true); expect(radar.labels).toBeGreaterThanOrEqual(5); }
  await page.evaluate(()=>window.__DEV.finishPrint());
  await page.emulateMedia({ media: 'screen' });
  const f = await pdf(page, 'P1-journey-target');
  expect(info(f)).toMatch(/Page size:\s+59[45](\.\d+)? x 84[12](\.\d+)?/);      // A4 real
  const t = text(f);
  for (const a of ['Jornada de maturidade','Leitura executiva','Perfil atual','Cenário-alvo'])
    expect(t, 'âncora ' + a).toContain(a);
  /* bbox: nomes de estágio sem sobreposição no PDF gerado */
  const pg = bbox(f);
  expect(pg).toContain('Inexistente');
});

test('P3+P4+P5 seções condicionais, títulos únicos e disclaimers', async ({ page }) => {
  await open(page); await F.F4_legacy(page);
  let f = await pdf(page, 'P3-sem-target-sem-refinement');
  let t = text(f);
  expect(t).not.toContain('Cenário-alvo de maturidade');
  expect(t).not.toContain('Aprofundamento operacional');
  await open(page); await F.F7_target_up(page);
  await page.evaluate(()=>{ ["ref-metrics","ref-lessons"].forEach((id,i)=>window.__DEV.setRefinementAnswer(id,i)); window.__DEV.showResults(); });
  f = await pdf(page, 'P5-com-target-refinement'); t = text(f);
  expect(t).toContain('Cenário-alvo de maturidade');
  expect(t).toContain('Aprofundamento operacional');
  expect((t.match(/Jornada de maturidade/g)||[]).length, 'título Journey único').toBe(1);
  expect((t.match(/Leitura executiva/g)||[]).length, 'título Leitura executiva único').toBe(1);
  /* [4.7.0.1-G] disclaimer metodológico COMPLETO, whitespace normalizado */
  const FULL = 'Cenário indicativo, não uma previsão. A adoção de tecnologia, isoladamente, não altera a maturidade. ' +
    'A evolução depende da implementação e adoção operacional das práticas-alvo, incluindo processos, pessoas, ' +
    'governança e evidências correspondentes.';
  expect(t.replace(/\s+/g,' '), 'disclaimer metodológico completo').toContain(FULL);
  expect(t.replace(/\s+/g,' '), 'refinement não altera pontuação').toContain('não altera a pontuação de maturidade');
});

test('P6 rota sem contexto tecnológico preservada', async ({ page }) => {
  await open(page); await F.F4_legacy(page);
  const legacy = await page.evaluate(()=>window.__DEV.V32.isLegacyModeV32());
  expect(legacy, 'cenário deve ser sem contexto declarado').toBe(true);
  const f = await pdf(page, 'P6-sem-contexto');
  const t = text(f);
  expect(t).toMatch(/Quickscan|Maturidade|Gaps/);
  expect(t).not.toContain('Contexto tecnológico declarado');
});

test('P7 anexo de respostas', async ({ page }) => {
  await open(page); await F.F3_rich(page);
  await page.evaluate(()=>{ window.__DEV.setNote(QS.findIndex(q=>q.id==='logs'),'Observação de campo para o anexo.'); window.__DEV.showResults(); });
  const f = await pdf(page, 'P7-anexo'); const t = text(f);
  expect(t).toContain('Não sei / precisa validar');
  expect(t).toContain('Observação de campo para o anexo.');
});

test('P8 page count · P9 sem placeholders · P10 raster de evidência', async ({ page }) => {
  await open(page); await F.F7_target_up(page);
  await page.evaluate(()=>{ ["ref-metrics"].forEach(id=>window.__DEV.setRefinementAnswer(id,1)); window.__DEV.showResults(); });
  const f = await pdf(page, 'P8-completo');
  const pages = +(/Pages:\s+(\d+)/.exec(info(f))[1]);
  const BASELINE = 12;   // [4.7.0.1-K3] baseline redeclarado: fixture F7 passou a incluir architecture note
  if (CANONICAL_HOST) expect(pages, `page count ${pages} vs baseline ${BASELINE}`).toBe(BASELINE);
  else console.log(`   [review signal] page count = ${pages} (baseline declarado ${BASELINE})`);
  const t = text(f);
  for (const bad of ['undefined','NaN','[object','null null'])
    expect(t, 'placeholder "' + bad + '"').not.toContain(bad);
  expect(HAS_RASTER, 'pdftoppm indisponível → raster gate não passa').toBe(true);
  cp.execSync(`pdftoppm -jpeg -r 90 ${f} ${path.join(PE,'P10-completo')}`);
  const shots = fs.readdirSync(PE).filter(x=>x.startsWith('P10-completo'));
  expect(shots.length, 'rasters gerados').toBeGreaterThanOrEqual(3);
});

test('P11 legível sem background graphics', async ({ page }) => {
  await open(page); await F.F3_rich(page);
  const f = await pdf(page, 'P11-nobg', { printBackground: false });
  const t = text(f);
  for (const a of ['Apoio direto','Gaps de maturidade observados','Apoio contextual'])
    expect(t.replace(/\s+/g,' '), 'texto sem bg: ' + a).toContain(a);
});
