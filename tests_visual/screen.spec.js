/* PHASE 4.7 · GATES DE TELA (V1–V11) */
const { test, expect } = require('@playwright/test');
const { open, F, IDS, assertBrowserAvailable } = require('./fixtures');
const path = require('path');
const EV = path.join(__dirname, '..', 'visual_evidence');
const W = () => test.info().project.use.viewport.width;
test.beforeAll(async () => { await assertBrowserAvailable(); });
const shot = async (page, name) => page.screenshot({ path: path.join(EV, `${name}-${W()}.png`), fullPage: true });

/* V1 · radar REAL (gate transferido pela 4.3.0.2) */
test('V1 radar getBoundingClientRect', async ({ page }) => {
  await open(page); await F.F4_legacy(page);
  const w = await page.evaluate(()=>document.querySelector('svg.radar').getBoundingClientRect().width);
  const vw = W();
  const exp = vw >= 1500 ? 460 : vw >= 1200 ? 420 : null;
  if (exp) expect(Math.abs(w - exp), `radar ${w}px vs ${exp}px`).toBeLessThanOrEqual(8);
  else { expect(w).toBeGreaterThan(240); expect(w).toBeLessThanOrEqual(vw); }
  await shot(page, 'V1-radar');
});

/* V2 · zero overflow horizontal em todas as telas */
test('V2 zero overflow horizontal', async ({ page }) => {
  const sink = {}; await open(page, sink);
  const noOv = async (label) => {
    const r = await page.evaluate(()=>({s:document.documentElement.scrollWidth, c:document.documentElement.clientWidth}));
    expect(r.s, `${label}: scrollWidth ${r.s} > clientWidth ${r.c}`).toBeLessThanOrEqual(r.c + 1);
  };
  await noOv('home');
  await page.click('#start'); await noOv('arq');                       // [4.7.0.1-B] tela de ponto de partida real
  await page.keyboard.press('1'); await page.keyboard.press('Enter');
  await noOv('question');
  await F.F1_questions(page, 5); await noOv('question-dom5');
  /* branch real: responder a 15ª e avançar */
  await page.evaluate(()=>{ const I=["mandate","governance","policies","team-capacity","training","knowledge",
    "incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility",
    "monitoring-coverage","external-surface","vulnerability-management"];
    I.forEach(id=>window.__DEV.setAnswerById(id,1)); window.__DEV.gotoStep(15); });
  await page.click('.opts .opt:nth-child(2)'); await page.click('#next');
  await noOv('branch');
  await F.F2_priority(page); await noOv('priority');
  await F.F3_rich(page); await noOv('results-rich');
  await page.click('#v32cta'); await noOv('editor'); await page.click('#v32cancel');
  await page.click('#restart'); await noOv('modal');
  await page.click('#ux-modal-cancel').catch(()=>page.keyboard.press('Escape'));
  await F.F8_refinement(page); await noOv('results-refinement');
  await page.click('#ux-ref-open'); await noOv('refinement-question');
});

/* V3 · zero erro inesperado no console (allowlist vazia) */
test('V3 zero console/pageerror', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page); await F.F7_target_up(page); await F.F8_refinement(page);
  await page.click('#ux-ref-open'); await page.click('#ref-result').catch(()=>{});
  expect(sink.errors, 'erros inesperados: ' + JSON.stringify(sink.errors)).toEqual([]);
});

/* V11 · zero runtime network externa [ajuste 1] */
test('V11 zero rede externa', async ({ page }) => {
  const sink = {}; await open(page, sink);
  await F.F3_rich(page); await F.F7_target_up(page);
  const ext = sink.requests.filter(u => /^(https?|wss?):/i.test(u));
  expect(ext, 'requests externas: ' + JSON.stringify(ext)).toEqual([]);
  const allowed = sink.requests.every(u => /^(file:|data:|blob:|about:)/i.test(u));
  expect(allowed, 'esquemas: ' + JSON.stringify([...new Set(sink.requests.map(u=>u.split(':')[0]))])).toBe(true);
});

/* V4/V5 · progress por domínio, segmento de Prioridade e refinement */
test('V4+V5 progress semantics', async ({ page }) => {
  await open(page);
  await page.evaluate(()=>{ const I=["mandate","governance","policies","team-capacity","training","knowledge",
    "incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility",
    "monitoring-coverage","external-surface","vulnerability-management"];
    I.forEach(id=>window.__DEV.setAnswerById(id,1)); window.__DEV.setArq(0); });
  await F.F1_questions(page, 15);                      // todos os grupos done/cur
  const doms = await page.evaluate(()=>Array.from(document.querySelectorAll('#segs span'))
    .filter(s=>s.dataset.dom!==undefined).map(s=>s.dataset.dom));
  expect(doms.join('')).toBe('000111222333444');
  /* [4.7.0.1-C] cada grupo resolve para o token oficial congelado (expectativa lida do runtime) */
  const colors = await page.evaluate(()=>{
    const root = getComputedStyle(document.documentElement);
    const norm = v => { const d=document.createElement('div'); d.style.color=v.trim();
      document.body.appendChild(d); const c=getComputedStyle(d).color; d.remove(); return c; };
    const tokens = { 0:'--ftnt-purple', 1:'--ftnt-green', 2:'--ftnt-teal', 3:'--ftnt-blue', 4:'--ftnt-silver' };
    const expected = {}; Object.entries(tokens).forEach(([k,t])=>expected[k]=norm(root.getPropertyValue(t)));
    const actual = {};
    document.querySelectorAll('#segs span[data-dom]').forEach(sp=>{
      if (sp.classList.contains('done') || sp.classList.contains('cur'))
        (actual[sp.dataset.dom] = actual[sp.dataset.dom] || []).push(getComputedStyle(sp).backgroundColor);
    });
    return { expected, actual, tokens };
  });
  const seen = Object.keys(colors.actual);
  expect(seen.length, 'nenhum segmento done/cur medido').toBeGreaterThan(0);
  for (const dom of seen)
    for (const got of colors.actual[dom])
      expect(got, `domínio ${dom} (${colors.tokens[dom]}) resolveu ${got}, esperado ${colors.expected[dom]}`)
        .toBe(colors.expected[dom]);
  // branch: Prioridade FUTURO + label próprio (4.4.0.1)
  await page.evaluate(()=>{ const I=["mandate","governance","policies","team-capacity","training","knowledge",
    "incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility",
    "monitoring-coverage","external-surface","vulnerability-management"];
    I.forEach(id=>window.__DEV.setAnswerById(id,1)); window.__DEV.gotoStep(15); });
  await page.click('.opts .opt:nth-child(2)'); await page.click('#next');
  expect(await page.textContent('#ptext')).toBe('Core concluído · aprofundamento opcional');
  expect(await page.evaluate(()=>{ const p=document.querySelector('#segs .ux-seg-prio');
    return p.classList.contains('cur')||p.classList.contains('done'); })).toBe(false);
  await page.click('#ref-go');
  expect(await page.evaluate(()=>getComputedStyle(document.querySelector('.progressbox')).display)).toBe('none');
  expect(await page.textContent('.ux-ref-prog')).toContain('1 de 3');
  await shot(page, 'V5-refinement');
});

/* V6 · teclado e foco (básico, sem WCAG) */
test('V6 keyboard + focus-visible', async ({ page }) => {
  await open(page);
  await page.click('#start'); await page.keyboard.press('1'); await page.keyboard.press('Enter');
  expect(await page.evaluate(()=>document.body.dataset.uxscreen)).toBe('question');
  await page.keyboard.press('2');
  expect(await page.evaluate(()=>!!document.querySelector('.opt.sel'))).toBe(true);
  await F.F2_priority(page);
  await page.keyboard.press('Tab');
  const fv = await page.evaluate(()=>{ const a=document.activeElement;
    return { ok: !!a && a !== document.body, visible: !!a && a.matches(':focus-visible'), tag: a && a.tagName }; });
  expect(fv.ok).toBe(true);
  expect(fv.visible, `activeElement (${fv.tag}) sem :focus-visible após Tab`).toBe(true);   // [4.7.0.1-D]
  await F.F4_legacy(page);                       // #restart existe na tela de resultados
  await page.evaluate(()=>{ const t=document.getElementById('restart'); t.dataset.uxtrigger='1'; t.focus(); });
  await page.click('#restart');
  expect(await page.evaluate(()=>!!document.getElementById('ux-modal'))).toBe(true);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>!document.getElementById('ux-modal'))).toBe(true);
  const restored = await page.evaluate(()=>{ const a=document.activeElement;
    return { isTrigger: !!a && a.dataset && a.dataset.uxtrigger === '1', id: a && a.id }; });
  expect(restored.isTrigger, `foco voltou para "${restored.id}" em vez do trigger #restart`).toBe(true);
});

/* V7 · regiões de suporte legíveis sem cor */
test('V7 support regions sem cor', async ({ page }) => {
  await open(page); await F.F3_rich(page);
  const badges = await page.evaluate(()=>Array.from(document.querySelectorAll('.ux-modebadge')).map(b=>b.textContent.trim()));
  for (const l of ['APOIO DIRETO','APOIO CONTEXTUAL','VALIDAR NO APROFUNDAMENTO','LEITURA ARQUITETURAL'])
    expect(badges.filter(b=>b===l).length, l).toBe(1);                       // [4.7.0.1-E] ARCH incluído
  const arch = await page.evaluate(()=>{ const b=Array.from(document.querySelectorAll('.ux-modebadge'))
      .find(x=>x.textContent.trim()==='LEITURA ARQUITETURAL');
    const block=document.querySelector('.v32-block[data-mode="ARCH"]');
    return { badgeMode: b && b.dataset.mode, hasBlock: !!block }; });
  expect(arch.badgeMode).toBe('ARCH'); expect(arch.hasBlock).toBe(true);
  await page.addStyleTag({ content: '*{color:#000 !important;background:#fff !important;border-color:#000 !important}' });
  const still = await page.evaluate(()=>Array.from(document.querySelectorAll('.ux-modebadge')).map(b=>b.textContent.trim()));
  expect(still).toEqual(badges);
  for (const l of ['APOIO DIRETO','APOIO CONTEXTUAL','VALIDAR NO APROFUNDAMENTO','LEITURA ARQUITETURAL'])
    expect(still, 'sem cor: ' + l).toContain(l);
  await shot(page, 'V7-nocolor');
});

/* V8 · Journey — expectativa derivada da configuração congelada [ajuste 3] */
test('V8 journey nodes', async ({ page }) => {
  await open(page); await F.F7_target_up(page);
  const model = await page.evaluate(()=>{
    const snap = window.__DEV.buildNarrativeSnapshot();
    const m = window.__DEV.journeyModel(snap);
    return { names: m.stages.map(s=>s.pt), cur: m.cur, next: m.next, tgt: m.tgt, top: m.top };
  });
  const dom = await page.evaluate(()=>Array.from(document.querySelectorAll('#ux-journey .jn-node')).map(n=>({
    name: n.querySelector('.jn-name').textContent.trim(),
    label: (n.querySelector('.jn-label')||{}).textContent || '',
    box: n.getBoundingClientRect().toJSON() })));
  expect(dom.map(d=>d.name)).toEqual(model.names);              // nomes vêm de stageOf(), não do teste
  /* Phase 5.1/UAT-05: o rótulo passou a 'Perfil atual' (a caixa alta é do
     CSS). A propriedade — rótulo certo no nó certo — não mudou. */
  expect(dom[model.cur].label).toMatch(/PERFIL ATUAL/i);
  if (model.tgt >= 0) expect(dom[model.tgt].label).toMatch(/CEN[ÁA]RIO-ALVO/i);
  if (model.next >= 0) expect(dom[model.next].label, 'label de PRÓXIMO ESTÁGIO').toMatch(/PR[ÓO]XIMO EST[ÁA]GIO/i);
  else expect(dom.map(d=>d.label).join(' '), 'top stage não fabrica próximo').not.toMatch(/PR[ÓO]XIMO EST[ÁA]GIO/i);
  if (W() > 720) {
    const sorted = [...dom].sort((a,b)=>a.box.x-b.box.x);
    for (let i=1;i<sorted.length;i++)
      expect(sorted[i-1].box.x + sorted[i-1].box.width, `nó ${i} sobrepõe ${i-1}`).toBeLessThanOrEqual(sorted[i].box.x + 1);
  } else {
    /* [4.7.0.1-F] ladder: ordem vertical coerente e bboxes consecutivas sem overlap */
    const byOrder = dom.map(d=>d.box);
    for (let i=1;i<byOrder.length;i++) {
      expect(byOrder[i].y, `nó ${i} acima do anterior`).toBeGreaterThan(byOrder[i-1].y);
      expect(byOrder[i-1].y + byOrder[i-1].height, `nó ${i-1} sobrepõe ${i} no ladder`)
        .toBeLessThanOrEqual(byOrder[i].y + 1);
    }
  }
  await shot(page, 'V8-journey');
  /* top stage: sem sexto estágio, sem próximo fabricado */
  await open(page); await F.F9_top_stage(page);
  const top = await page.evaluate(()=>{
    const m = window.__DEV.journeyModel(window.__DEV.buildNarrativeSnapshot());
    const labels = Array.from(document.querySelectorAll('#ux-journey .jn-node .jn-label')).map(l=>l.textContent);
    return { top: m.top, next: m.next, nodes: document.querySelectorAll('#ux-journey .jn-node').length, labels };
  });
  if (top.top) { expect(top.next).toBe(-1);
    expect(top.labels.join(' ')).not.toMatch(/PR[ÓO]XIMO EST[ÁA]GIO/i);
    expect(top.nodes).toBe(model.names.length); }
  await shot(page, 'V8-top-stage');
});

/* V9 · Current×Target overlay */
test('V9 target overlay', async ({ page }) => {
  await open(page); await F.F4_legacy(page);
  const before = await page.evaluate(()=>({ shape: document.querySelector('.radar .shape').getAttribute('points'),
    overlay: !!document.querySelector('.ux-target-shape') }));
  expect(before.overlay).toBe(false);
  await F.F6_target_same(page);
  const after = await page.evaluate(()=>{ const t=document.querySelector('.ux-target-shape');
    return { shape: document.querySelector('.radar .shape').getAttribute('points'),
      stroke: t && t.getAttribute('stroke'), dash: t && !!t.getAttribute('stroke-dasharray'),
      legend: !!document.getElementById('ux-tgt-radarlegend') }; });
  expect(after.shape).toBe(before.shape);
  expect(after.stroke).toBe('#3CB17E'); expect(after.dash).toBe(true); expect(after.legend).toBe(true);
  await shot(page, 'V9-target');
});

/* V10 · screenshots nomeados (evidência) */
test('V10 evidência por fixture', async ({ page }) => {
  const cases = [['F1',()=>F.F1_questions(page,8)],['F2',()=>F.F2_priority(page)],['F3',()=>F.F3_rich(page)],
    ['F4',()=>F.F4_legacy(page)],['F5',()=>F.F5_insufficient(page)],['F6',()=>F.F6_target_same(page)],
    ['F7',()=>F.F7_target_up(page)],['F8',()=>F.F8_refinement(page)],['F9',()=>F.F9_top_stage(page)]];
  for (const [name, fn] of cases) { await open(page); await fn(); await shot(page, 'V10-'+name); }
});

/* jornada real por interação, sem __DEV */
test('V12 fluxo real ponta a ponta', async ({ page }) => {
  const sink={}; await open(page, sink);
  await page.click('#start'); await page.keyboard.press('1'); await page.keyboard.press('Enter');
  for (let i=0;i<15;i++){ await page.keyboard.press('2'); await page.keyboard.press('Enter'); }
  expect(await page.evaluate(()=>document.body.dataset.uxscreen)).toBe('refbranch');
  await page.click('#ref-go');
  await page.click('.opts .opt:nth-child(3)'); await page.click('#ref-skip'); await page.click('#ref-result');
  expect(await page.evaluate(()=>document.body.dataset.uxscreen)).toBe('priority');
  await page.click('.ux-priogroup .opt');
  await page.click('#next');
  expect(await page.evaluate(()=>document.body.dataset.uxscreen)).toBe('results');
  expect(sink.errors).toEqual([]);
  await shot(page, 'V12-fluxo-real');
});
