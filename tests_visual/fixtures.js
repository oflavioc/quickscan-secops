/* [4.7-C] fixtures: __DEV preenche SOMENTE inputs canônicos (respostas, arq, prioridades, landscape,
   target overrides, refinement). Nada de score/findings/recommendations/Journey/Narrative/DOM injetado —
   todo derivado passa pelo recompute e pelo render normal. */
const path = require('path');
const FILE = 'file://' + path.join(__dirname, '..', 'quickscan_secops_soccmm_v3_2_dev.html');
const IDS = ["mandate","governance","policies","team-capacity","training","knowledge","incident-response",
  "detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage",
  "external-surface","vulnerability-management"];

async function open(page, consoleSink) {
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  const reqs = [];
  page.on('request', r => reqs.push(r.url()));
  await page.goto(FILE);
  if (consoleSink) { consoleSink.errors = errs; consoleSink.requests = reqs; }
  return { errors: errs, requests: reqs };
}
const CANON = ['setAnswerById','setArq','setPriorities','setTarget','setRefinementAnswer','setNote'];

async function answers(page, v, overrides = {}) {
  await page.evaluate(({IDS, v, overrides}) => {
    IDS.forEach(id => window.__DEV.setAnswerById(id, id in overrides ? overrides[id] : v));
    window.__DEV.setArq(0);
  }, {IDS, v, overrides});
}
async function landscapeNone(page, caps) {          // via editor real (UI), não injeção de estado derivado
  await page.evaluate(()=>window.__DEV.showResults());
  await page.click('#v32cta');
  await page.evaluate((caps)=>{
    const g=document.querySelector('details[data-gid="g3"]'); if(g) g.open=true;
    caps.forEach(c=>{ const s=document.getElementById('v32-pres-'+c);
      if(s){ s.value='NONE'; s.dispatchEvent(new Event('change')); } });
  }, caps);
  await page.click('#v32save');
}
const F = {
  async F1_questions(page, step=1){ await answers(page,1); await page.evaluate(s=>window.__DEV.gotoStep(s), step); },
  async F2_priority(page){ await answers(page,1);
    await page.evaluate(()=>{ window.__DEV.setPriorities(["logs","incident-response","team-capacity"]); window.__DEV.showPriority(); }); },
  async F3_rich(page){ await answers(page,1,{logs:0,knowledge:0,endpoint:0,"incident-response":0,"network-visibility":"NA"});
    await page.evaluate(()=>window.__DEV.setPriorities(["logs","incident-response"]));
    /* landscape via editor real + condições canônicas da architecture note (soc-platform NONE + preferência unificada) */
    await page.evaluate(()=>window.__DEV.showResults());
    await page.click('#v32cta');
    await page.evaluate(()=>{
      const g=document.querySelector('details[data-gid="g3"]'); if(g) g.open=true;
      ['security-analytics','knowledge-management','endpoint-detection','deception','soc-platform'].forEach(c=>{
        const s=document.getElementById('v32-pres-'+c);
        if(s){ s.value = (c==="deception") ? "UNKNOWN" : "NONE"; s.dispatchEvent(new Event('change')); } });
      const u=document.getElementById('v32-arch-unifiedPlatformPreference'); if(u){ u.value='unified'; u.dispatchEvent(new Event('change')); }
      const sa=document.getElementById('v32-arch-saasAllowed'); if(sa){ sa.value='yes'; sa.dispatchEvent(new Event('change')); }
    });
    await page.click('#v32save'); },
  async F4_legacy(page){ await answers(page,1,{logs:0}); await page.evaluate(()=>window.__DEV.showResults()); },
  async F5_insufficient(page){
    await page.evaluate(()=>{ ["mandate","logs","endpoint","automation","training"].forEach(id=>window.__DEV.setAnswerById(id,1));
      window.__DEV.setArq(0); window.__DEV.showResults(); }); },
  async F6_target_same(page){ await answers(page,1,{logs:0});
    await page.evaluate(()=>{ window.__DEV.setTarget("logs",2); window.__DEV.showResults(); }); },
  async F7_target_up(page){ await answers(page,1,{logs:0,knowledge:0,endpoint:0});
    await page.evaluate(()=>window.__DEV.setPriorities(["logs"]));
    await landscapeNone(page,['security-analytics','knowledge-management','endpoint-detection']);
    await page.evaluate((IDS)=>{ IDS.forEach(id=>window.__DEV.setTarget(id,3)); window.__DEV.showResults(); }, IDS); },
  async F8_refinement(page, n=3){ await answers(page,2);
    await page.evaluate((n)=>{ ["ref-metrics","ref-lessons","ref-hunting"].slice(0,n)
      .forEach((id,i)=>window.__DEV.setRefinementAnswer(id,i)); window.__DEV.showResults(); }, n); },
  async F9_top_stage(page){ await answers(page,3); await page.evaluate(()=>window.__DEV.showResults()); },
};
module.exports = { open, answers, F, IDS, FILE, CANON };

/* [4.7.0.1-A] mensagem útil quando não há browser disponível */
async function assertBrowserAvailable() {
  const { RESOLVED_BROWSER } = require('../playwright.config.js');
  if (RESOLVED_BROWSER === 'playwright-managed') {
    const { chromium } = require('@playwright/test');
    let p = null;
    try { p = chromium.executablePath(); } catch (e) { p = null; }
    if (!p || !require('fs').existsSync(p)) {
      throw new Error('Nenhum browser disponível para a suíte visual.\n' +
        '  Instale o Chromium gerenciado:  npx playwright install chromium\n' +
        '  Ou aponte um Chrome/Chromium do sistema:  CHROME_PATH=/caminho/para/chrome npm run test:visual');
    }
  }
}
module.exports.assertBrowserAvailable = assertBrowserAvailable;
