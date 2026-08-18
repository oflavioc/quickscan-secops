/* ============================================================================
   HARNESS M41 · v2 (patch final aprovado) — Regressão funcional V3.1.3 ↔ V3.2
   Uso:
     Gerar baseline:   node harness_m41_v313.js <html> --out <snapshot.json>
     Regressão:        node harness_m41_v313.js <html> --compare <baseline.json> [--out <novo.json>]
   Oracle: o snapshot esperado é a verdade. QUALQUER divergência = regressão
   (exit != 0) e deve ser investigada ANTES de qualquer mudança de regra.
   Nenhuma regra da V3.1.3 pode ser alterada para fazer o teste passar.
   ============================================================================ */
const fs = require("fs");
const vm = require("vm");
const crypto = require("crypto");

/* ---------------- CLI ---------------- */
const argv = process.argv.slice(2);
const htmlPath = argv.find(a => !a.startsWith("--")) || "quickscan_secops_soccmm_v3_1_3.html";
const flag = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const outPath = flag("--out") || (argv.includes("--compare") ? null : "v3_1_3_functional_snapshot.json");
const comparePath = flag("--compare");

/* ---------------- extração robusta do engine (item 5) ---------------- */
/* Tolerante a atributos e a múltiplos <script>; identificação inequívoca do
   engine por marcadores estruturais. Erro se 0 ou >1 blocos qualificarem.  */
const html = fs.readFileSync(htmlPath, "utf8");
const blocks = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const MARKERS = ["const QS", "function computeFindings", "function buildTiers", "function dataSufficiency"];
const engines = blocks.filter(b => MARKERS.every(mk => b.includes(mk)));
if (engines.length !== 1) {
  console.error(`FAIL: extração do engine — ${engines.length} bloco(s) <script> com os marcadores ` +
    `${JSON.stringify(MARKERS)} (esperado exatamente 1; total de scripts no arquivo: ${blocks.length})`);
  process.exit(1);
}
let src = engines[0];

/* ---------------- stub de DOM permissivo ---------------- */
function stubEl() {
  const el = {
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    style: {}, dataset: {}, children: [], innerHTML: "", textContent: "", value: "",
    appendChild(c){ this.children.push(c); return c; }, removeChild(){},
    setAttribute(){}, getAttribute(){ return null; }, addEventListener(){},
    removeEventListener(){}, focus(){}, blur(){}, scrollIntoView(){}, click(){},
    querySelector(){ return stubEl(); }, querySelectorAll(){ return []; }, closest(){ return null; }
  };
  ["onclick","oninput","onchange","onkeydown"].forEach(p =>
    Object.defineProperty(el, p, { set(){}, get(){ return null; } }));
  return el;
}
const ctx = {
  document: { querySelector(){ return stubEl(); }, querySelectorAll(){ return []; },
    getElementById(){ return stubEl(); }, createElement(){ return stubEl(); },
    addEventListener(){}, removeEventListener(){}, body: stubEl(), title: "" },
  window: { addEventListener(){}, removeEventListener(){}, print(){}, scrollTo(){} },
  console: { log(){}, error(){}, warn(){} },
  setTimeout(){ return 0; }, clearTimeout(){}, requestAnimationFrame(){ return 0; },
  navigator: { userAgent: "harness" }, location: { href: "harness" }
};
vm.createContext(ctx);

/* ---------------- runner injetado no escopo do engine ---------------- */
const scenarioRunner = `
;globalThis.__H = (function(){
  function reset(){
    arq = null; step = -1;
    for (let i=0;i<QS.length;i++){ ans[i]=null; notes[i]=""; }
    businessPriority.clear(); prioLimitHit=false;
    /* V3.2: zerar camadas para a rota legacy, se existirem */
    if (typeof resetLandscapeToUnset === "function") resetLandscapeToUnset();
  }
  function apply(sc){
    reset();
    arq = sc.arq ?? 0;
    QS.forEach((q,k)=>{ if (sc.answers && q.id in sc.answers) ans[k]=sc.answers[q.id]; });
    (sc.priorities||[]).forEach(id=>businessPriority.add(id));
    if (sc.notes) QS.forEach((q,k)=>{ if(q.id in sc.notes) notes[k]=sc.notes[q.id]; });
  }
  /* item 6: verificação da ROTA LEGACY.
     - V3.1.3 (camadas inexistentes): legacy por definição da baseline.
     - V3.2 (camadas existentes): exige TECH_LANDSCAPE todo UNSET + ARCHITECTURE_CONTEXT
       default + SESSION_SIGNALS vazio + PLATFORM_CONTEXT vazio — verificado de fato. */
  function legacyCheck(){
    const hasLayers = (typeof TECH_LANDSCAPE !== "undefined");
    if (!hasLayers) return { legacyMode: true, source: "baseline-v3.1.3" };
    const landUnset = Object.values(TECH_LANDSCAPE).every(v => !v || v.presence === "UNSET");
    const archDefault = (typeof ARCHITECTURE_CONTEXT === "undefined") ||
      Object.values(ARCHITECTURE_CONTEXT).every(v => v==="unknown" || v==="undefined" || v==="uninformed" || v===null);
    const sigsEmpty = (typeof SESSION_SIGNALS === "undefined") ||
      Object.values(SESSION_SIGNALS).every(v => v === undefined || v === null || v === "unset");
    const platEmpty = (typeof PLATFORM_CONTEXT === "undefined") ||
      !PLATFORM_CONTEXT.declaredPlatforms || PLATFORM_CONTEXT.declaredPlatforms.length === 0;
    return { legacyMode: landUnset && archDefault && sigsEmpty && platEmpty, source: "v3.2-verified" };
  }
  function snapshot(name){
    const lc = legacyCheck();
    const stats = DOMS.map((_,i)=>domStat(i));
    const suff = dataSufficiency(stats);
    const scored = stats.filter(s=>s.score!==null);
    const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;
    const st = overall===null ? null : stageOf(overall);
    const {findings, validate} = computeFindings();
    const tiers = buildTiers(findings, validate);
    const t1 = []; tiers.acc.forEach((e,p)=>{ if(e.tier===1) t1.push({p, reasons:e.reasons, whys:e.whys}); });
    return {
      scenario: name,
      legacyMode: lc.legacyMode,
      answers: QS.map((q,k)=>({id:q.id, a:ans[k]})),
      priorities: Array.from(businessPriority),
      confirmed: confirmedCount(),
      toValidate: ans.filter(v=>v==="NA").length,
      domains: DOMS.map((d,i)=>({dom:d.en, score:stats[i].score, conf:stats[i].conf, basis:stats[i].basis, n:stats[i].n, nNA:stats[i].nNA})),
      sufficiency: suff, overall, stage: st,
      findings: findings.map(f=>({id:f.id, sev:f.sev, lvl:f.lvl})),
      validate: validate.map(k=>QS[k].id),
      tiers: { t1, t2: tiers.t2.map(e=>({p:e.p, reasons:e.reasons, whys:e.whys})), t3: tiers.t3 }
    };
  }
  function candidatesMatrix(){
    const out = {};
    QS.forEach(q=>{ out[q.id] = candidatesOf(q.id).map(c=>c.p); });
    return out;
  }
  return { apply, snapshot, candidatesMatrix,
           legacySource: ()=>legacyCheck().source,
           configErrors: ()=>CONFIG_ERRORS.slice() };
})();`;

try { vm.runInContext(src + "\n" + scenarioRunner, ctx, { filename: "quickscan-engine.js" }); }
catch (e) { console.error("FAIL: erro ao executar o engine —", e.message); process.exit(1); }
const H = ctx.__H;

/* ---------------- cenários (S1–S9) ----------------
   Ordem das perguntas/domínios (V3.1.3):
   Business[mandate,governance,policies] · People[team-capacity,training,knowledge]
   Process[incident-response,detection-lifecycle,automation] · Technology[logs,endpoint,network-visibility]
   Services[monitoring-coverage,external-surface,vulnerability-management] */
const IDS = ["mandate","governance","policies","team-capacity","training","knowledge",
  "incident-response","detection-lifecycle","automation","logs","endpoint",
  "network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
const all = v => Object.fromEntries(IDS.map(id => [id, v]));

const SCENARIOS = [
  { name:"S1_maduro_total",  arq:0, answers: all(2) },
  { name:"S2_critico_total", arq:1, answers: all(0) },
  { name:"S3_misto_com_prioridades", arq:2,
    answers: Object.assign(all(1), {mandate:0, policies:0, logs:2, endpoint:3, "monitoring-coverage":1, training:2}),
    priorities:["mandate","policies","monitoring-coverage"],
    notes:{ mandate:"sem mandato formal — reporte difuso", endpoint:"EDR de terceiro em produção" } },
  { name:"S4_insuficiente", arq:0,
    answers:{ mandate:1, governance:1, policies:"NA", "team-capacity":0, knowledge:"NA" } },
  { name:"S5_na_pesado", arq:3,
    answers: Object.assign(all(2), {endpoint:"NA", "network-visibility":"NA", automation:"NA", logs:1}) },
  { name:"S6_moderado_total",  arq:0, answers: all(1) },
  { name:"S7_otimizado_total", arq:0, answers: all(3) },
  /* item 2: EXATAMENTE 10 confirmadas · EXATAMENTE 2 por domínio · 5 NA (1 por domínio) */
  { name:"S8_limite_suficiencia", arq:0,
    answers:{ mandate:2, governance:1, policies:"NA",
              "team-capacity":2, training:1, knowledge:"NA",
              "incident-response":2, "detection-lifecycle":1, automation:"NA",
              logs:2, endpoint:1, "network-visibility":"NA",
              "monitoring-coverage":2, "external-surface":1, "vulnerability-management":"NA" } },
  /* item 3 */
  { name:"S9_all_na", arq:0, answers: all("NA") }
];

const results = {
  meta: {
    baseline: htmlPath,
    generatedAt: new Date().toISOString(),
    legacyModeSource: null,   /* preenchido abaixo; volátil entre versões — fora da comparação */
    purpose: "M41/E11 — payload funcional da V3.1.3; V3.2 em rota legacy deve reproduzi-lo integralmente",
    legacyModeCondition: "TECH_LANDSCAPE UNSET + ARCHITECTURE_CONTEXT default + SESSION_SIGNALS vazio + PLATFORM_CONTEXT vazio"
  },
  configErrors: H.configErrors(),
  candidatesMatrix: H.candidatesMatrix(),
  scenarios: []
};
for (const sc of SCENARIOS) { H.apply(sc); results.scenarios.push(H.snapshot(sc.name)); }
results.meta.legacyModeSource = H.legacySource();

/* ---------------- asserts de sanidade (oracle interna da baseline) ---------------- */
let pass = true;
const assert = (cond, label) => { const ok = !!cond; console.log((ok?"PASS":"FAIL")+"  "+label); if(!ok) pass=false; };
const g = n => results.scenarios.find(s=>s.scenario===n);

assert(results.configErrors.length===0, "H0: validateConfig sem erros");
assert(results.scenarios.every(s=>s.legacyMode===true), "HL: TODOS os cenários executam a rota legacy (item 6)");
assert(g("S1_maduro_total").sufficiency===true && g("S1_maduro_total").overall===3.3, "H1: S1 suficiente, overall 3.3");
assert(g("S1_maduro_total").findings.length===0 && g("S1_maduro_total").tiers.t3.length>0, "H2: S1 sem findings; t3 povoado");
assert(g("S2_critico_total").findings.every(f=>f.sev===2) && g("S2_critico_total").tiers.t1.length>0, "H3: S2 só sev2; Tier 1 povoado");
assert(g("S4_insuficiente").sufficiency===false && g("S4_insuficiente").overall===null && g("S4_insuficiente").stage===null, "H4: S4 sem overall/estágio");
assert(g("S5_na_pesado").validate.includes("endpoint") && !g("S5_na_pesado").tiers.t2.some(e=>e.p==="FortiEndpoint"), "H5: NA→validar; NA não alimenta Tier 2");
assert(!g("S5_na_pesado").tiers.t3.some(e=>e.p==="FortiEndpoint"), "H6: t3 exclui produto com NA relacionado (FortiEndpoint)");
assert(!g("S5_na_pesado").tiers.t3.some(e=>e.p==="FortiSOAR") && !g("S5_na_pesado").tiers.t3.some(e=>e.p==="FortiXDR"),
  "H6b: automation=NA ⇒ FortiSOAR e FortiXDR fora do t3 (item 4)");
assert(g("S3_misto_com_prioridades").priorities.length===3, "H7: 3 prioridades preservadas");
assert(g("S3_misto_com_prioridades").tiers.t2.some(e=>e.reasons.some(r=>r.includes("prioridade declarada"))), "H8: marcador de prioridade (sev1) no Tier 2");
assert(!g("S3_misto_com_prioridades").tiers.t1.some(e=>e.reasons.some(r=>r.includes("prioridade declarada"))), "H8b: marcador restrito a sev1");
assert(g("S6_moderado_total").tiers.t1.length===0, "H9: S6 sem Tier 1");
assert(g("S7_otimizado_total").overall===5 && g("S7_otimizado_total").stage.en==="Optimizing", "H10: S7 = 5.0 Optimizing");
const s8 = g("S8_limite_suficiencia");
assert(s8.confirmed===10, "H11: S8 confirmed === 10 (exato)");
assert(s8.domains.every(d=>d.n>=2), "H12: S8 todos os domínios com n >= 2");
assert(s8.sufficiency===true, "H12b: S8 sufficiency === true (limite exato da regra)");
assert(s8.toValidate===5, "H12c: S8 com exatamente 5 NA");
const s9 = g("S9_all_na");
assert(s9.confirmed===0 && s9.toValidate===15, "H13: S9 confirmed=0, toValidate=15");
assert(s9.sufficiency===false && s9.overall===null && s9.stage===null, "H14: S9 sem suficiência/overall/estágio");
assert(s9.findings.length===0 && s9.validate.length===15, "H15: S9 sem findings; 15 em validar");
assert(s9.tiers.t1.length===0 && s9.tiers.t2.length===0 && s9.tiers.t3.length===0, "H16: S9 t1/t2/t3 vazios");

/* ---------------- comparação de regressão (item 1) ---------------- */
function stableStringify(x){
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return "[" + x.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(x).sort().map(k => JSON.stringify(k)+":"+stableStringify(x[k])).join(",") + "}";
}
function functionalPayload(r){   /* exclui APENAS metadados voláteis */
  return { configErrors: r.configErrors, candidatesMatrix: r.candidatesMatrix, scenarios: r.scenarios };
}
function deepDiff(exp, act, path, out){
  if (exp === act) return;
  const te = exp===null?"null":Array.isArray(exp)?"array":typeof exp;
  const ta = act===null?"null":Array.isArray(act)?"array":typeof act;
  if (te !== ta || (te!=="object" && te!=="array")) {
    if (JSON.stringify(exp) !== JSON.stringify(act))
      out.push({ path, expected: exp, actual: act });
    return;
  }
  if (te === "array") {
    const n = Math.max(exp.length, act.length);
    if (exp.length !== act.length) out.push({ path: path+".length", expected: exp.length, actual: act.length });
    for (let i=0;i<n;i++) deepDiff(exp[i], act[i], path+"["+i+"]", out);
    return;
  }
  const keys = new Set([...Object.keys(exp), ...Object.keys(act)]);
  keys.forEach(k => deepDiff(exp[k], act[k], path+"."+k, out));
}

const payload = functionalPayload(results);
const sha = crypto.createHash("sha256").update(stableStringify(payload)).digest("hex");

if (comparePath) {
  const baseline = JSON.parse(fs.readFileSync(comparePath, "utf8"));
  const diffs = [];
  deepDiff(functionalPayload(baseline), payload, "$", diffs);
  if (diffs.length) {
    console.log("\nREGRESSÃO DETECTADA — " + diffs.length + " divergência(s):");
    diffs.slice(0, 80).forEach(d => {
      const scen = (d.path.match(/scenarios\[(\d+)\]/) || [])[1];
      const label = scen !== undefined && baseline.scenarios[scen] ? baseline.scenarios[scen].scenario : "-";
      console.log(`  cenário=${label} campo=${d.path}\n    expected=${JSON.stringify(d.expected)}\n    actual  =${JSON.stringify(d.actual)}`);
    });
    if (diffs.length > 80) console.log("  ... +" + (diffs.length-80) + " divergências omitidas");
    console.log("\nOracle: o snapshot esperado é a verdade — tratar como regressão antes de qualquer mudança de regra.");
    process.exit(1);
  }
  console.log("\nCOMPARAÇÃO: PASS — payload funcional idêntico ao baseline (" + comparePath + ")");
}

if (outPath) fs.writeFileSync(outPath, JSON.stringify(results, null, 1));
console.log((pass ? "\nSANIDADE: OK" : "\nSANIDADE: FALHAS") +
  (outPath ? " · snapshot: " + outPath : "") +
  " · cenários: " + results.scenarios.length +
  "\nSHA-256 (payload funcional canonicalizado): " + sha);
process.exit(pass ? 0 : 1);
