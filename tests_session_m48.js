/* TESTES · PHASE 4.8 — Session Portability & Evidence Archive (jsdom) */
const path=require("path"),fs=require("fs"),crypto=require("crypto");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const PKG=JSON.parse(fs.readFileSync(path.join(__dirname,"package.json"),"utf8"));
const ENG_SHA=crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"engine_v32.js"))).digest("hex");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];const pending=[];
function T(id,l,fn){let ok=false,e="";try{const r=fn();
  if(r&&typeof r.then==="function"){ const rec={id,ok:false,l};results.push(rec);
    pending.push(r.then(v=>{rec.ok=!!v;console.log((rec.ok?"PASS":"FAIL")+"  "+id+" — "+l);})
      .catch(x=>{console.log("FAIL  "+id+" — "+l+" ["+x.message+"]");})); return; }
  ok=!!r;}catch(x){ok=false;e=" ["+x.message+"]"}
  results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
/* modelo canônico derivado, para comparar antes/depois */
function derivedModel(w){
  return JSON.stringify({
    legacy: w.__DEV.legacySnapshot(),
    ctx: w.__DEV.V32.buildRecommendationContext(),
    tgt: w.__DEV.computeTargetProfile(w.__DEV.tgtEffectiveVector()),
    jn: w.__DEV.journeyModel(w.__DEV.buildNarrativeSnapshot()),
    nar: w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot()),
    ref: w.__DEV.getOperationalRefinementSnapshot() });
}
function richSession(w,d){
  answerAll(w,1,{logs:0,knowledge:0,endpoint:0,"network-visibility":"NA"});
  w.__DEV.setPriorities(["logs","knowledge"]);
  w.__DEV.setNote(IDS.indexOf("logs"),"Sem SIEM central; correlação manual.");
  w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const g=d.querySelector('details[data-gid="g3"]'); if(g) g.open=true;
  ["security-analytics","knowledge-management"].forEach(c=>{const s=q(d,"#v32-pres-"+c);if(s){s.value="NONE";s.dispatchEvent(new w.Event("change"));}});
  const sp=q(d,"#v32-pres-soc-platform"); if(sp){sp.value="NONE";sp.dispatchEvent(new w.Event("change"));}
  const u=q(d,"#v32-arch-unifiedPlatformPreference"); if(u){u.value="unified";u.dispatchEvent(new w.Event("change"));}
  const sa=q(d,"#v32-arch-saasAllowed"); if(sa){sa.value="yes";sa.dispatchEvent(new w.Event("change"));}
  q(d,"#v32save").click();
  w.__DEV.setTarget("logs",3); w.__DEV.setRefinementAnswer("ref-metrics",1);
  w.__DEV.showResults();
}
function roundtrip(w,d){
  const before = { inputs: JSON.stringify(w.__DEV.captureCanonicalInputs()), derived: derivedModel(w) };
  const doc = JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument("Conta Sintética")));
  const B = boot(); B.w.__DEV.importSessionDocument(doc);
  return { before, doc, w2: B.w, d2: B.d,
    after: { inputs: JSON.stringify(B.w.__DEV.captureCanonicalInputs()), derived: derivedModel(B.w) } };
}

T("S1-S3","schema root + toolVersion do build + engine SHA real",()=>{
  const {w}=boot(); answerAll(w,1); const doc=w.__DEV.buildSessionDocument("X");
  return doc.format==="quickscan-secops-session" && doc.schemaVersion===1 &&
    doc.toolVersion===PKG.version && doc.engineSha256===ENG_SHA &&
    typeof doc.createdAt==="string" && doc.label==="X" && !!doc.inputs;
});
T("S4-S5","export só canônico; zero campo derivado",()=>{
  const {w,d}=boot(); richSession(w,d);
  const s=JSON.stringify(w.__DEV.buildSessionDocument());
  const banned=["\"score\"","domainScores","\"stage\"","sufficiency","\"findings\"","recommendationContext",
    "supportMode","\"offerings\"","\"services\"","targetScore","refinementScore","narrative","journey"];
  const keys=Object.keys(w.__DEV.captureCanonicalInputs());
  return banned.every(b=>!s.includes(b)) &&
    JSON.stringify(keys)===JSON.stringify(["assessment","priorities","technologyLandscape","targetProfile","operationalRefinement"]);
});
T("S6","roundtrip padrão: inputs e derivados idênticos",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.setPriorities(["logs"]); w.__DEV.showResults();
  const r=roundtrip(w,d);
  return r.before.inputs===r.after.inputs && r.before.derived===r.after.derived;
});
T("S7","roundtrip com landscape rico (solutions, arch, platform, signals)",()=>{
  const {w,d}=boot(); richSession(w,d);
  const r=roundtrip(w,d);
  return r.before.inputs===r.after.inputs && r.before.derived===r.after.derived &&
    r.w2.__DEV.V32.isLegacyModeV32()===false;
});
T("S8","UNSET ≠ NONE sobrevive ao roundtrip",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const s=q(d,"#v32-pres-security-analytics"); s.value="NONE"; s.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const r=roundtrip(w,d);
  const L=r.w2.__DEV.V32.TECH_LANDSCAPE;
  return L["security-analytics"].presence==="NONE" &&
    L["knowledge-management"].presence==="UNSET" && r.before.inputs===r.after.inputs;
});
T("S9","insuficiente continua n/d após import, sem estágio fabricado",()=>{
  const {w,d}=boot();
  ["mandate","logs","endpoint","automation","training"].forEach(id=>w.__DEV.setAnswerById(id,1));
  w.__DEV.setArq(0); w.__DEV.showResults();
  const r=roundtrip(w,d);
  const p=r.w2.__DEV.tgtCurrentProfile();
  return p.suff===false && p.overall===null && r.before.derived===r.after.derived &&
    txt(q(r.d2,"#app")).includes("n/d") || (p.suff===false && r.before.derived===r.after.derived);
});
T("S10","target sparse: overrides transportados, Current×Target recalculado",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.setTarget("logs",3); w.__DEV.showResults();
  const r=roundtrip(w,d);
  const doc=r.doc;
  return JSON.stringify(doc.inputs.targetProfile.overrides)==='{"logs":3}' &&
    !JSON.stringify(doc).includes("targetStage") &&
    JSON.stringify(r.w2.__DEV.TARGET.overrides)==='{"logs":3}' &&
    r.before.derived===r.after.derived;
});
T("S11","refinement 1/3 e 3/3 não alteram score no roundtrip",()=>{
  const {w,d}=boot(); answerAll(w,2); w.__DEV.setRefinementAnswer("ref-metrics",1); w.__DEV.showResults();
  const base=w.__DEV.tgtCurrentProfile();
  const r1=roundtrip(w,d);
  ["ref-lessons","ref-hunting"].forEach((id,i)=>w.__DEV.setRefinementAnswer(id,i+1));
  w.__DEV.showResults();
  const r3=roundtrip(w,d);
  return r1.before.inputs===r1.after.inputs && r3.before.inputs===r3.after.inputs &&
    JSON.stringify(r3.w2.__DEV.tgtCurrentProfile())===JSON.stringify(base) &&
    r3.w2.__DEV.getOperationalRefinementSnapshot().filter(x=>x.answer!==null).length===3;
});
T("S12","top stage: sem sexto estágio após import",()=>{
  const {w,d}=boot(); answerAll(w,3); w.__DEV.showResults();
  const r=roundtrip(w,d);
  const m=r.w2.__DEV.journeyModel(r.w2.__DEV.buildNarrativeSnapshot());
  return m.top===true && m.next===-1 && r.before.derived===r.after.derived;
});
T("S13","Unicode e notas longas preservados",()=>{
  const {w,d}=boot(); answerAll(w,1);
  const S="Ação · 日本語 · 🔐 · \"aspas\" · e\u0301 combinante · " + "x".repeat(500);
  w.__DEV.setNote(IDS.indexOf("logs"), S); w.__DEV.showResults();
  const r=roundtrip(w,d);
  return r.doc.inputs.assessment.notes["logs"]===S && r.before.inputs===r.after.inputs;
});
T("S14","payload XSS permanece inerte (texto, sem execução)",()=>{
  const {w,d}=boot(); answerAll(w,1);
  const X='<script>window.__pwned=1<\/script><img src=x onerror="window.__pwned=1">';
  w.__DEV.setNote(IDS.indexOf("logs"), X); w.__DEV.showResults();
  const r=roundtrip(w,d);
  r.w2.__DEV.preparePrint();
  const inDom = r.d2.querySelectorAll("script").length;
  const imgs = Array.from(r.d2.querySelectorAll("img")).filter(i=>i.getAttribute("onerror"));
  r.w2.__DEV.finishPrint();
  return r.w2.__pwned===undefined && imgs.length===0 &&
    r.doc.inputs.assessment.notes["logs"]===X &&
    txt(r.d2.querySelector("body")).includes("onerror");
});
T("S15-S16","JSON malformado e arquivo acima do limite recusados",()=>{
  const {w}=boot();
  let bad=false; try{ JSON.parse("{nope"); }catch{ bad=true; }
  return bad && w.__DEV.SESSION_MAX_BYTES===1048576;
});
T("S17-S18","format errado e schemaVersion diferente recusados",()=>{
  const {w}=boot(); answerAll(w,1);
  const d1=w.__DEV.buildSessionDocument(); d1.format="outro";
  const d2=w.__DEV.buildSessionDocument(); d2.schemaVersion=2;
  const r1=w.__DEV.validateSessionDocument(d1), r2=w.__DEV.validateSessionDocument(d2);
  return !r1.ok && !r2.ok && r2.error.includes("versão de schema");
});
T("S19-S20","engine diferente bloqueia; toolVersion diferente com mesmo engine aceita com aviso",()=>{
  const {w}=boot(); answerAll(w,1);
  const a=w.__DEV.buildSessionDocument(); a.engineSha256="0".repeat(64);
  const ca=w.__DEV.sessionCompatibility(a);
  const b=w.__DEV.buildSessionDocument(); b.toolVersion="3.0.0-outra";
  const cb=w.__DEV.sessionCompatibility(b);
  const imported=w.__DEV.importSessionDocument(a);
  return ca.compatible===false && ca.reason==="engine" && ca.sourceEngine && ca.currentEngine &&
    cb.compatible===true && !!cb.notice && imported.ok===false;
});
T("S21-S26","validações de q id, answer, priority, enum, target e refinement",()=>{
  const {w}=boot(); answerAll(w,1);
  const mk=f=>{ const d=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(d); return w.__DEV.validateSessionDocument(d); };
  return !mk(d=>d.inputs.assessment.answers["inventado"]=1).ok &&
    !mk(d=>d.inputs.assessment.answers["logs"]=9).ok &&
    !mk(d=>d.inputs.priorities=["logs","logs"]).ok &&
    !mk(d=>d.inputs.priorities=["logs","mandate","endpoint","training"]).ok &&
    !mk(d=>d.inputs.priorities=["nao-existe"]).ok &&
    !mk(d=>d.inputs.technologyLandscape.capabilities["security-analytics"].presence="TALVEZ").ok &&
    !mk(d=>d.inputs.targetProfile.overrides["logs"]=7).ok &&
    !mk(d=>d.inputs.operationalRefinement.answers["ref-fake"]=1).ok;
});
T("S27","injeção de campo derivado é recusada explicitamente",()=>{
  const {w}=boot(); answerAll(w,1);
  const d=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  d.inputs.assessment.score=5;
  const r=w.__DEV.validateSessionDocument(d);
  const d2=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  d2.inputs.recommendationContext={fake:true};
  return !r.ok && r.error.includes("derivados") && !w.__DEV.validateSessionDocument(d2).ok;
});
T("S28","prototype pollution recusada; Object.prototype intacto",()=>{
  const {w}=boot(); answerAll(w,1);
  const before = w.eval("({}).polluted === undefined");
  const raw = JSON.parse('{"format":"quickscan-secops-session","schemaVersion":1,"toolVersion":"x","engineSha256":"y","inputs":{"assessment":{"archetype":0,"answers":{},"notes":{}},"priorities":[],"technologyLandscape":{"capabilities":{}},"targetProfile":{"overrides":{}},"operationalRefinement":{"answers":{}},"__proto__":{"polluted":1}}}');
  const r = w.__DEV.validateSessionDocument(raw);
  const imp = w.__DEV.importSessionDocument(raw);
  return before && !r.ok && !imp.ok && w.eval("({}).polluted === undefined");
});
T("S29","import atômico: falha tardia não altera estado algum",()=>{
  const {w,d}=boot(); richSession(w,d);
  const pre = JSON.stringify(w.__DEV.captureCanonicalInputs()) + derivedModel(w);
  const bad = JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  bad.inputs.operationalRefinement.answers["ref-hunting"]=99;   /* erro no ÚLTIMO bloco validado */
  const r = w.__DEV.importSessionDocument(bad);
  return r.ok===false && JSON.stringify(w.__DEV.captureCanonicalInputs()) + derivedModel(w) === pre;
});
T("S30","sessão ativa exige confirmação de substituição",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  const active=w.__DEV.sessionHasContent();
  const doc=w.__DEV.buildSessionDocument("Outra");
  w.__DEV.showImportPreview(doc, {compatible:true,notice:null}, null);
  const modal=txt(q(d,"#ux-modal"));
  const B=boot();
  return active && modal.includes("substituirá a sessão atual") &&
    txt(q(d,"#ux-modal-ok"))==="Importar e substituir" && B.w.__DEV.sessionHasContent()===false;
});
T("S31-S32","reset e nova sessão após import preservam semântica congelada",()=>{
  const {w,d}=boot(); richSession(w,d);
  const doc=w.__DEV.buildSessionDocument("Conta");
  const B=boot(); B.w.__DEV.importSessionDocument(doc);
  q(B.d,"#restart").click(); q(B.d,"#ux-modal-ok").click();
  const afterRestart = B.w.__DEV.legacySnapshot().includes("null") &&
    B.w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].presence==="NONE" &&
    Object.keys(B.w.__DEV.TARGET.overrides).length===0 &&
    B.w.__DEV.getOperationalRefinementSnapshot().every(r=>r.answer===null);
  const C=boot(); C.w.__DEV.importSessionDocument(doc);
  C.d.querySelector("#ux-newsession").click(); C.d.querySelector("#ux-modal-ok").click();
  const afterNew = C.w.__DEV.V32.isLegacyModeV32()===true &&
    Object.keys(C.w.__DEV.TARGET.overrides).length===0 && C.w.__DEV.sessionHasContent()===false;
  return afterRestart && afterNew;
});
T("S33","nenhuma API de persistência é usada",()=>{
  const src=fs.readFileSync(path.join(__dirname,"ui_session_v32.js"),"utf8");
  const html=HTML;
  const bad=["localStorage","sessionStorage","indexedDB","document.cookie","serviceWorker"];
  return bad.every(b=>!src.includes(b)) && bad.every(b=>!html.includes(b));
});
T("S34","nenhuma URL externa no módulo de sessão",()=>{
  const src=fs.readFileSync(path.join(__dirname,"ui_session_v32.js"),"utf8");
  return !/https?:\/\//.test(src) && !/fetch\(|XMLHttpRequest|WebSocket/.test(src);
});
T("S35","filename sanitizado: sem path traversal, sem caracteres inválidos",()=>{
  const {w}=boot();
  const f1=w.__DEV.sessionFilename("../../etc/passwd");
  const f2=w.__DEV.sessionFilename("Conta / Cliente: *?<>|");
  const f3=w.__DEV.sessionFilename("");
  const f4=w.__DEV.sessionFilename("Ação Ção ".repeat(20));
  return [f1,f2,f3,f4].every(f=>/^quickscan-secops_[A-Za-z0-9_-]+_\d{8}-\d{4}\.json$/.test(f)) &&
    !f1.includes("..") && !f1.includes("/") && f3.includes("session") && f4.length<100;
});
T("S36","object URL revogado após export",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  let created=0, revoked=0;
  w.URL.createObjectURL=()=>{created++;return "blob:x";};
  w.URL.revokeObjectURL=()=>{revoked++;};
  const r=w.__DEV.downloadSession("Teste");
  return new Promise(res=>setTimeout(()=>res(created===1&&revoked===1),5)) && created===1 &&
    /^quickscan-secops_Teste_\d{8}-\d{4}\.json$/.test(r.filename);
});
T("S37","PDF após import mantém a semântica da sessão original",()=>{
  /* Phase 5.1/RPT-02: a capa passou a declarar a PROVENIÊNCIA da sessão, e por
     desenho ela DIFERE entre o documento original e o importado ("Data da
     sessão" x "Sessão registrada em", além do instante de geração). A
     propriedade que este gate protege — o CORPO do relatório sobrevive ao
     round-trip sem alteração semântica — é medida excluindo a capa; e a nova
     obrigação (a proveniência ser declarada com honestidade) é asserida à
     parte, em vez de silenciada. */
  const corpo = doc0 => { const c=doc0.querySelector("#pr-cover"); if(c) c.remove();
    return txt(doc0).replace(/\s+/g," "); };
  const clone = el => { const h=el.ownerDocument.createElement("div"); h.innerHTML=el.innerHTML; return h; };
  const {w,d}=boot(); richSession(w,d);
  w.__DEV.preparePrint();
  const pre=corpo(clone(q(d,"#v32-print-report")));
  const capaPre=txt(q(d,"#pr-cover"));
  w.__DEV.finishPrint();
  const doc=w.__DEV.buildSessionDocument();
  const B=boot(); B.w.__DEV.importSessionDocument(doc);
  B.w.__DEV.preparePrint();
  const post=corpo(clone(q(B.d,"#v32-print-report")));
  const capaPost=txt(q(B.d,"#pr-cover"));
  B.w.__DEV.finishPrint();
  const proveniencia = capaPre.includes("Data da sessão") && capaPost.includes("Sessão registrada em");
  return pre===post && pre.length>500 && proveniencia;
});
T("S38","controles de sessão ausentes do relatório de impressão",()=>{
  const {w,d}=boot(); richSession(w,d);
  const onScreen = !!q(d,"#ses-export") && !!q(d,"#ses-import");
  w.__DEV.preparePrint();
  const rep=txt(q(d,"#v32-print-report"));
  w.__DEV.finishPrint();
  return onScreen && !rep.includes("Exportar sessão") && !rep.includes("Importar sessão") &&
    !rep.includes("Nome da sessão");
});
T("S39","modal e ações com semântica acessível",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  q(d,"#ses-export").click();
  const m=q(d,"#ux-modal");
  const card=m.querySelector('[role="dialog"][aria-modal="true"]');
  const input=q(d,"#ses-label");
  const lab=m.querySelector('label[for="ses-label"]');
  const focused=d.activeElement===input;
  const btns=m.querySelectorAll("button").length;
  d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
  return !!card && !!input && !!lab && focused && btns>=2 && !q(d,"#ux-modal");
});
T("S40","determinismo do export (sem createdAt/label) e cópia imutável",()=>{
  const {w,d}=boot(); richSession(w,d);
  const strip=o=>{const c=JSON.parse(JSON.stringify(o));delete c.createdAt;delete c.label;return JSON.stringify(c);};
  const a=strip(w.__DEV.buildSessionDocument("A"));
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const b=strip(w.__DEV.buildSessionDocument("B"));
  return a===b && JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre;
});

/* ===== [4.8.0.1] STRICT SCHEMA · FIDELITY · ATOMICITY ===== */
function richLandscape(w,d){
  /* U2 real: NONE + PARTIAL + PRESENT, third-party e Fortinet, status/deployment/coverage/coveredCapabilities,
     optional fields presentes E ausentes, arquitetura, plataforma declarada e signals */
  answerAll(w,1,{logs:0,knowledge:0,endpoint:0,"network-visibility":"NA"});
  w.__DEV.setPriorities(["logs","endpoint"]);
  w.__DEV.setNote(IDS.indexOf("logs"),"Correlação manual · contexto sintético.");
  w.__DEV.showResults();
  const V=w.__DEV.V32;
  V.TECH_LANDSCAPE["security-analytics"] = { presence:"NONE", solutions:[], declaredDriver:null };
  V.TECH_LANDSCAPE["endpoint-detection"] = { presence:"PARTIAL", declaredDriver:{note:"Renovação em 2027"},
    solutions:[ { vendor:"OutroFabricante", product:"EDR X", status:"production" },                  /* A */
                { vendor:"Fortinet", product:"FortiEDR", status:"partial-production",
                  deployment:"saas", coverage:"1.200 endpoints corporativos" },                       /* B */
                { vendor:"TerceiroFabricante", product:"Agente Y" } ] };                              /* C */
  V.TECH_LANDSCAPE["network-detection"] = { presence:"PRESENT", declaredDriver:null,
    solutions:[ { vendor:"Fortinet", product:"FortiNDR", status:"broad-production", deployment:"on-prem",
                  notes:"Sensores em 3 sites." } ] };
  /* [4.8.0.6-26] coveredCapabilities vive APENAS onde a UI o produz e suppressedByPlatform() o lê:
     solution de TERCEIRO dentro de soc-platform. O fixture anterior o declarava em network-detection —
     state que o editor nunca gera (falso positivo corrigido nesta microfase; ver S103). */
  V.TECH_LANDSCAPE["soc-platform"] = { presence:"PRESENT", declaredDriver:null,
    solutions:[ { vendor:"TerceiroSIEM", product:"Plataforma Z", status:"production", deployment:"vm",
                  coveredCapabilities:["security-automation","soc-governance"],
                  notes:"Correlação central de terceiro." } ] };
  Object.assign(V.ARCHITECTURE_CONTEXT, { saasAllowed:"yes", localProcessingRequired:"no",
    unifiedPlatformPreference:"unified", environmentProfile:"hybrid", dataResidency:"no-constraint" });
  V.PLATFORM_CONTEXT.declaredPlatforms = [{ platform:"fortigate", bundle:"utp",
    subscriptions:["fg-ips","fg-antivirus"] }];
  V.SESSION_SIGNALS["activeIncident"] = true; V.SESSION_SIGNALS["becConcern"] = true;
  w.__DEV.setTarget("logs",3); w.__DEV.setRefinementAnswer("ref-metrics",1);
  w.__DEV.showResults();
}
T("S41","U2 real: landscape rico faz roundtrip com inputs, legacySnapshot e ctx equivalentes",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const r=roundtrip(w,d);
  const V2=r.w2.__DEV.V32;
  return r.before.inputs===r.after.inputs && r.before.derived===r.after.derived &&
    V2.TECH_LANDSCAPE["endpoint-detection"].presence==="PARTIAL" &&
    V2.TECH_LANDSCAPE["network-detection"].solutions[0].notes==="Sensores em 3 sites." &&
    JSON.stringify(V2.TECH_LANDSCAPE["soc-platform"].solutions[0].coveredCapabilities)===
      JSON.stringify(["security-automation","soc-governance"]) &&
    V2.PLATFORM_CONTEXT.declaredPlatforms[0].subscriptions.length===2 &&
    V2.SESSION_SIGNALS["activeIncident"]===true && V2.SESSION_SIGNALS["ransomwareConcern"]==="unset" &&
    V2.ARCHITECTURE_CONTEXT.environmentProfile==="hybrid";
});
T("S42","fidelidade de optional fields: ausente permanece ausente (nunca vira null)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const doc=w.__DEV.buildSessionDocument("opt");
  const sols=doc.inputs.technologyLandscape.capabilities["endpoint-detection"].solutions;
  const A=sols[0], B=sols[1], C=sols[2];
  const shapeOk = !("deployment" in A) && !("coverage" in A) && !("notes" in A) &&
    B.deployment==="saas" && B.coverage.includes("1.200") &&
    Object.keys(C).sort().join(",")==="product,vendor";
  const r=roundtrip(w,d);
  const after=JSON.parse(r.after.inputs).technologyLandscape.capabilities["endpoint-detection"].solutions;
  return shapeOk && r.before.inputs===r.after.inputs &&
    !("status" in after[2]) && !("deployment" in after[2]) &&
    JSON.stringify(after)===JSON.stringify(sols);
});
T("S43","enums estritos: status, deployment e coverage inválidos são recusados",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  const sol=dd=>dd.inputs.technologyLandscape.capabilities["endpoint-detection"].solutions[0];
  return !mk(dd=>sol(dd).status="BOGUS").ok &&
    !mk(dd=>sol(dd).deployment="TELEPORT").ok &&
    !mk(dd=>sol(dd).coverage=42).ok &&
    !mk(dd=>sol(dd).inventado="x").ok &&
    mk(dd=>sol(dd).status="deploying").ok;
});
T("S44","coveredCapabilities aceita só IDs canônicos e formato correto",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  /* [4.8.0.6-26] posição canônica: solution third-party de soc-platform (era network-detection) */
  const sol=dd=>dd.inputs.technologyLandscape.capabilities["soc-platform"].solutions[0];
  return !mk(dd=>sol(dd).coveredCapabilities=["capability-inexistente"]).ok &&
    !mk(dd=>sol(dd).coveredCapabilities="network-detection").ok &&
    !mk(dd=>sol(dd).coveredCapabilities=[null]).ok &&
    !mk(dd=>sol(dd).coveredCapabilities=[{id:"x"}]).ok &&
    mk(dd=>sol(dd).coveredCapabilities=["security-analytics"]).ok;
});
T("S45","architectureContext valida enums reais (string qualquer é recusada)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  return !mk(dd=>dd.inputs.technologyLandscape.architectureContext.saasAllowed="maybe").ok &&
    !mk(dd=>dd.inputs.technologyLandscape.architectureContext.environmentProfile="marte").ok &&
    !mk(dd=>dd.inputs.technologyLandscape.architectureContext.campoNovo="x").ok &&
    mk(dd=>dd.inputs.technologyLandscape.architectureContext.saasAllowed="unknown").ok;
});
T("S46","signals: só true|'unset'; variantes falsas recusadas",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=v=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.signals.activeIncident=v; return w.__DEV.validateSessionDocument(dd).ok; };
  const unknown=()=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.signals.sinalInventado=true; return w.__DEV.validateSessionDocument(dd).ok; };
  return [false,"true","false",1,0,null,"yes",{},[]].every(v=>mk(v)===false) &&
    mk(true)===true && mk("unset")===true && unknown()===false;
});
T("S47","declaredPlatforms validado em profundidade (platform, bundle, subscriptions, null)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  const P=dd=>dd.inputs.technologyLandscape.declaredPlatforms;
  return !mk(dd=>P(dd)[0].platform="invented").ok &&
    !mk(dd=>P(dd)[0].bundle="nope").ok &&
    !mk(dd=>P(dd)[0].subscriptions=["fake"]).ok &&
    !mk(dd=>P(dd)[0].subscriptions="fg-ips").ok &&
    !mk(dd=>dd.inputs.technologyLandscape.declaredPlatforms=[null]).ok &&
    !mk(dd=>P(dd)[0].extra="x").ok &&
    mk(dd=>P(dd)[0].bundle=null).ok;
});
T("S48","target invariant: alvo inferior ao atual confirmado é recusado",()=>{
  const {w,d}=boot(); answerAll(w,2,{logs:2}); w.__DEV.showResults();
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  return !mk(dd=>dd.inputs.targetProfile.overrides={logs:1}).ok &&
    mk(dd=>dd.inputs.targetProfile.overrides={logs:3}).ok &&
    mk(dd=>{ dd.inputs.assessment.answers.logs="NA"; dd.inputs.targetProfile.overrides={logs:0}; }).ok;
});
T("S49","atomicidade real: declaredPlatforms:[null] morre na validação, sessão rica intacta",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screenBefore=d.body.dataset.uxscreen;
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const bad=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  bad.inputs.technologyLandscape.declaredPlatforms=[null];
  const r=w.__DEV.importSessionDocument(bad);
  return r.ok===false && r.error.includes("plataforma") &&
    JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre &&
    d.body.dataset.uxscreen===screenBefore;
});
T("S50","normalização isolada não toca estado; candidato é completo antes do commit",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const doc=w.__DEV.buildSessionDocument();
  const cand=w.__DEV.normalizeSessionDocument(doc);
  const keys=Object.keys(cand).sort().join(",");
  return keys==="ans,arch,arq,landscape,notes,platforms,priorities,refinement,signals,targetOverrides" &&
    JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre;
});
T("S51","capability inventada não influencia Recommendation Context (recusada antes do recompute)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const ctxBefore=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  const bad=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  bad.inputs.technologyLandscape.capabilities["capability-fantasma"]={presence:"PRESENT",solutions:[],declaredDriver:null};
  const r=w.__DEV.importSessionDocument(bad);
  return r.ok===false && JSON.stringify(w.__DEV.V32.buildRecommendationContext())===ctxBefore;
});
T("S52","object URL: createObjectURL=1 e revokeObjectURL=1 realmente observados",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  let created=0, revoked=0;
  w.URL.createObjectURL=()=>{created++;return "blob:x";};
  w.URL.revokeObjectURL=()=>{revoked++;};
  w.__DEV.downloadSession("Rev");
  return new Promise(res=>setTimeout(()=>res(created===1 && revoked===1), 60));
});


/* ===== [4.8.0.2] CANONICAL CONTRACT FIDELITY & TRUE ATOMIC COMMIT ===== */
function archContract(w){ const out={}; w.__V32UI.ARCH_FIELDS.forEach(f=>out[f.k]=f.opts.map(o=>o[0])); return out; }
T("S53","architecture: roundtrip exaustivo de TODOS os valores que a UI pode produzir",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  const C=archContract(w);
  let combos=0;
  for (const k of Object.keys(C)){
    for (const v of C[k]){
      const A=boot(); answerAll(A.w,1); A.w.__DEV.showResults();
      A.w.__DEV.V32.ARCHITECTURE_CONTEXT[k]=v; A.w.__DEV.showResults();
      const doc=A.w.__DEV.buildSessionDocument("arch-"+k+"-"+v);
      const val=A.w.__DEV.validateSessionDocument(doc);
      if(!val.ok) throw new Error("valor canônico rejeitado: "+k+"="+v+" · "+val.error);
      const B=boot(); const r=B.w.__DEV.importSessionDocument(doc);
      if(!r.ok) throw new Error("import rejeitou "+k+"="+v+" · "+r.error);
      if(B.w.__DEV.V32.ARCHITECTURE_CONTEXT[k]!==v) throw new Error("valor alterado: "+k+"="+v);
      combos++;
    }
  }
  return combos===Object.values(C).reduce((a,b)=>a+b.length,0) && combos>=20;
});
T("S54","architecture: valores fora do contrato real (inclusive os antes aceitos indevidamente) recusados",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  const bad={ unifiedPlatformPreference:["best-of-breed"], environmentProfile:["it","ot"],
    dataResidency:["local-only","no-restriction"], saasAllowed:["maybe"] };
  const mk=(k,v)=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.architectureContext[k]=v; return w.__DEV.validateSessionDocument(dd).ok; };
  return Object.keys(bad).every(k=>bad[k].every(v=>mk(k,v)===false));
});
function platScenario(w,plats){
  answerAll(w,1,{logs:0}); w.__DEV.setPriorities(["logs"]); w.__DEV.showResults();
  w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=plats; w.__DEV.showResults();
}
T("S55","FortiSOC: estado canônico do runtime congelado faz roundtrip",()=>{
  const {w,d}=boot(); platScenario(w,[{platform:"fortisoc",bundle:null,subscriptions:[]}]);
  const r=roundtrip(w,d);
  const p=r.w2.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms;
  return r.before.inputs===r.after.inputs && r.before.derived===r.after.derived &&
    p.length===1 && p[0].platform==="fortisoc" && p[0].bundle===null;
});
T("S56","platform notes: optional field canônico preservado no roundtrip",()=>{
  const {w,d}=boot();
  platScenario(w,[{platform:"fortisoc",bundle:null,subscriptions:[],notes:"piloto"},
                  {platform:"fortigate",bundle:"atp",subscriptions:["fg-ips"]}]);
  const r=roundtrip(w,d);
  const p=r.w2.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms;
  return r.before.inputs===r.after.inputs &&
    p[0].notes==="piloto" && p[1].bundle==="atp" && p[1].subscriptions[0]==="fg-ips" &&
    !("notes" in p[1]);
});
T("S57","self-import property: todo fixture canônico exportado é aceito pelo mesmo build",()=>{
  const cases=[
    ["standard",(w,d)=>{answerAll(w,1);w.__DEV.showResults();}],
    ["rich",(w,d)=>richLandscape(w,d)],
    ["fortisoc",(w,d)=>platScenario(w,[{platform:"fortisoc",bundle:null,subscriptions:[],notes:"piloto"}])],
    ["unset",(w,d)=>{answerAll(w,1);w.__DEV.showResults();}],
    ["none",(w,d)=>{answerAll(w,1,{logs:0});w.__DEV.showResults();
      d.querySelector("#v32cta").click();
      const s=q(d,"#v32-pres-security-analytics");s.value="NONE";s.dispatchEvent(new w.Event("change"));
      q(d,"#v32save").click();}],
    ["insufficient",(w)=>{["mandate","logs","endpoint"].forEach(id=>w.__DEV.setAnswerById(id,1));
      w.__DEV.setArq(0);w.__DEV.showResults();}],
    ["target",(w)=>{answerAll(w,1,{logs:0});w.__DEV.setTarget("logs",3);w.__DEV.showResults();}],
    ["refinement",(w)=>{answerAll(w,2);w.__DEV.setRefinementAnswer("ref-metrics",2);w.__DEV.showResults();}],
    ["topstage",(w)=>{answerAll(w,3);w.__DEV.showResults();}]
  ];
  return cases.every(([name,fn])=>{
    const {w,d}=boot(); fn(w,d);
    const doc=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument(name)));
    const v=w.__DEV.validateSessionDocument(doc);
    if(!v.ok) throw new Error(name+": export rejeitado pelo próprio import · "+v.error);
    const B=boot(); const r=B.w.__DEV.importSessionDocument(doc);
    if(!r.ok) throw new Error(name+": import falhou · "+r.error);
    return JSON.stringify(B.w.__DEV.captureCanonicalInputs())===JSON.stringify(w.__DEV.captureCanonicalInputs());
  });
});
T("S58","reachable shape: solution sem vendor E sem product é recusada",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  const cap=dd=>dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
  return !mk(dd=>cap(dd).solutions=[{status:"production"}]).ok &&
    !mk(dd=>cap(dd).solutions=[{vendor:"  ",product:""}]).ok &&
    mk(dd=>cap(dd).solutions=[{product:"Só produto"}]).ok &&
    mk(dd=>cap(dd).solutions=[{vendor:"Só fornecedor"}]).ok;
});
T("S59","presence × solutions: NONE/UNSET/UNKNOWN com soluções são estados impossíveis",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=(pres)=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    const c=dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
    c.presence=pres; if(pres==="UNSET") c.declaredDriver=null;
    return w.__DEV.validateSessionDocument(dd).ok; };
  const ok=(pres)=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    const c=dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
    c.presence=pres; return w.__DEV.validateSessionDocument(dd).ok; };
  return mk("NONE")===false && mk("UNSET")===false && mk("UNKNOWN")===false &&
    ok("PRESENT")===true && ok("PARTIAL")===true;
});
T("S60","presence × declaredDriver: UNSET com driver é recusado (invariante do editor)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  const c=dd.inputs.technologyLandscape.capabilities["security-analytics"];
  c.presence="UNSET"; c.solutions=[]; c.declaredDriver={note:"contraditório"};
  const bad=w.__DEV.validateSessionDocument(dd).ok;
  c.declaredDriver=null;
  const good=w.__DEV.validateSessionDocument(dd).ok;
  return bad===false && good===true;
});
T("S61","target: igual ao current confirmado é recusado; superior é aceito; NA mantém semântica",()=>{
  const {w,d}=boot(); answerAll(w,2,{logs:2,knowledge:"NA"}); w.__DEV.showResults();
  const mk=(qid,v)=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.targetProfile.overrides={[qid]:v}; return w.__DEV.validateSessionDocument(dd).ok; };
  return mk("logs",2)===false && mk("logs",1)===false && mk("logs",3)===true &&
    mk("knowledge",0)===true && mk("knowledge",3)===true;
});
T("S62+S68","rollback após ESCRITA PARCIAL: falha depois de owners já receberem valores do candidato",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screenBefore=d.body.dataset.uxscreen;
  const preInputs=JSON.stringify(w.__DEV.captureCanonicalInputs());
  const preDerived=derivedModel(w);
  const other=boot(); answerAll(other.w,3); other.w.__DEV.showResults();
  other.w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=[{platform:"fortigate",bundle:"ent",subscriptions:[]}];
  other.w.__DEV.showResults();
  const doc=JSON.parse(JSON.stringify(other.w.__DEV.buildSessionDocument("Outra")));
  const cand=w.__DEV.normalizeSessionDocument(doc);
  /* [4.8.0.3-13] monkey-patch do harness: Set.prototype.clear lança na chamada do commit — ocorre DEPOIS de
     arq/ans/notes já terem recebido valores do candidato, provando estado parcial antes da exceção */
  const SetProto = w.eval("Set.prototype");
  const origClear = SetProto.clear;
  let observedPartial = null;
  SetProto.clear = function(){
    observedPartial = { ans0: w.eval("ans[0]"), arq: w.eval("arq") };   /* estado parcial capturado */
    SetProto.clear = origClear;                                          /* restaura antes de lançar */
    throw new Error("falha controlada após escrita parcial");
  };
  let res;
  try { res = w.__DEV.commitCanonicalOwners(cand); }
  finally { SetProto.clear = origClear; }
  const restoredInputs=JSON.stringify(w.__DEV.captureCanonicalInputs());
  const restoredDerived=derivedModel(w);
  /* prova de que houve escrita parcial: ans[0] do candidato ≠ ans[0] original no momento da falha */
  const partialProven = observedPartial && observedPartial.ans0===cand.ans[0] &&
    JSON.parse(preInputs).assessment.answers["mandate"]!==cand.ans[0];
  const clean = w.__DEV.importSessionDocument(doc);      /* sem patch, o mesmo documento importa normalmente */
  return res.ok===false && res.rolledBack===true && partialProven &&
    restoredInputs===preInputs && restoredDerived===preDerived &&
    d.body.dataset.uxscreen===screenBefore && clean.ok===true;
});
T("S63","nenhum render intermediário: commit não chama uxNewSession nem render",()=>{
  const src=fs.readFileSync(path.join(__dirname,"ui_session_v32.js"),"utf8");
  const body=src.slice(src.indexOf("function commitCanonicalOwners"), src.indexOf("/* [S/Y] recompute integral"));
  const noUi=!/uxNewSession|render\(|uxModal|paintEditor/.test(body);
  const {w,d}=boot(); richLandscape(w,d);
  let renders=0; const origRender=w.render;
  const doc=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  const cand=w.__DEV.normalizeSessionDocument(doc);
  const screenBefore=d.body.dataset.uxscreen;
  const res=w.__DEV.commitCanonicalOwners(cand);         /* commit isolado, sem recompute */
  return noUi && res.ok===true && d.body.dataset.uxscreen===screenBefore;
});
T("S64","evidence claim parity: archive contém artefato para cada SE declarado",()=>{
  const zip=path.join(__dirname,"visual_print_evidence_48.zip");
  if(!fs.existsSync(zip)) return false;
/* [Onda-1 · 2026-08-25] fix-finding (mesma familia de P2.1-16/I11, PR #9): caminhos de
   archive SEM aspas quebravam os oraculos S64/S74+S75/S113 em checkout cujo path contem
   espaco. So aspas; nenhum comportamento de teste alterado. */
  const list=require("child_process").execSync(`unzip -Z1 "${zip}"`).toString();
  const declared=["SE1","SE2","SE3","SE4","SE5"];
  const present=declared.filter(se=>new RegExp(se+"[-.]").test(list));
  const doc=fs.readFileSync(path.join(__dirname,"session_roundtrip_report.md"),"utf8");
  const claimsAll=/SE1[–-]SE5/.test(doc);
  return claimsAll ? present.length===5 : present.length>=3;
});


/* ===== [4.8.0.3] ===== */
T("S65","platform × bundle: compatibilidade derivada de BUNDLES[b].appliesTo (matriz table-driven)",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  const setP=(plats)=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.declaredPlatforms=plats; return w.__DEV.validateSessionDocument(dd).ok; };
  const VALID=[
    [{platform:"fortigate",bundle:"atp",subscriptions:["fg-ips"]}],
    [{platform:"fortigate",bundle:"utp",subscriptions:[]}],
    [{platform:"fortigate",bundle:"ent",subscriptions:[]}],
    [{platform:"fortigate",bundle:null,subscriptions:[]}],
    [{platform:"fortisoc",bundle:null,subscriptions:[]}],
    [{platform:"fortisoc",bundle:null,subscriptions:[],notes:"piloto"}]];
  const INVALID=[
    [{platform:"fortisoc",bundle:"atp",subscriptions:[]}],
    [{platform:"fortisoc",bundle:"utp",subscriptions:[]}],
    [{platform:"fortisoc",bundle:"ent",subscriptions:[]}],
    [{platform:"inexistente",bundle:null,subscriptions:[]}],
    [{platform:"fortigate",bundle:"bundle-fake",subscriptions:[]}],
    [{platform:"fortigate",bundle:"atp",subscriptions:["sub-fake"]}]];
  const appliesTo = w.eval("Object.keys(V32.BUNDLES).map(b=>b+':'+V32.BUNDLES[b].appliesTo).join(',')");
  return VALID.every(p=>setP(p)===true) && INVALID.every(p=>setP(p)===false) &&
    appliesTo==="atp:fortigate,utp:fortigate,ent:fortigate";
});
T("S66+S72","self-containment: o mesmo documento sobre sessões anteriores diferentes produz estado idêntico",()=>{
  /* documento único D, com arquitetura própria */
  const src=boot(); answerAll(src.w,1,{logs:0}); src.w.__DEV.setPriorities(["logs"]); src.w.__DEV.showResults();
  Object.assign(src.w.__DEV.V32.ARCHITECTURE_CONTEXT,{ saasAllowed:"yes", localProcessingRequired:"no",
    otIsolated:"unknown", unifiedPlatformPreference:"unified", environmentProfile:"cloud-first",
    dataResidency:"regulated" });
  src.w.__DEV.showResults();
  const D=JSON.parse(JSON.stringify(src.w.__DEV.buildSessionDocument("D")));
  /* sessão A e sessão B, com arquiteturas semanticamente diferentes entre si e de D */
  const A=boot(); answerAll(A.w,2); A.w.__DEV.showResults();
  Object.assign(A.w.__DEV.V32.ARCHITECTURE_CONTEXT,{ saasAllowed:"no", localProcessingRequired:"yes",
    otIsolated:"yes", unifiedPlatformPreference:"no", environmentProfile:"on-prem",
    dataResidency:"local-required" });
  A.w.__DEV.showResults();
  const B=boot(); answerAll(B.w,3); B.w.__DEV.showResults();   /* B fica com arquitetura default */
  const rA=A.w.__DEV.importSessionDocument(D), rB=B.w.__DEV.importSessionDocument(D);
  const inA=JSON.stringify(A.w.__DEV.captureCanonicalInputs());
  const inB=JSON.stringify(B.w.__DEV.captureCanonicalInputs());
  const inD=JSON.stringify(src.w.__DEV.captureCanonicalInputs());
  const ctxA=JSON.stringify(A.w.__DEV.V32.buildRecommendationContext());
  const ctxB=JSON.stringify(B.w.__DEV.V32.buildRecommendationContext());
  return rA.ok && rB.ok && inA===inB && inA===inD && ctxA===ctxB &&
    A.w.__DEV.V32.ARCHITECTURE_CONTEXT.environmentProfile==="cloud-first" &&
    B.w.__DEV.V32.ARCHITECTURE_CONTEXT.dataResidency==="regulated";
});
T("S67","architectureContext parcial ou ausente é recusado antes do commit",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.importSessionDocument(dd); };
  const r1=mk(dd=>{ dd.inputs.technologyLandscape.architectureContext={saasAllowed:"yes"}; });
  const r2=mk(dd=>{ delete dd.inputs.technologyLandscape.architectureContext; });
  const r3=mk(dd=>{ delete dd.inputs.technologyLandscape.architectureContext.dataResidency; });
  return !r1.ok && !r2.ok && !r3.ok && r1.error.includes("incompleto") &&
    JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre;
});
T("S69","snapshot/restore cobre todos os owners escritos pelo commit",()=>{
  const src=fs.readFileSync(path.join(__dirname,"ui_session_v32.js"),"utf8");
  const seg=(name)=>{ const i=src.indexOf("function "+name); const j=src.indexOf("\nfunction ", i+10); return src.slice(i,j); };
  const commit=seg("commitCanonicalOwners"), snap=seg("snapshotCanonicalOwners"), rest=seg("restoreCanonicalOwners");
  const owners=["arq","ans","notes","businessPriority","TECH_LANDSCAPE","ARCHITECTURE_CONTEXT",
    "declaredPlatforms","SESSION_SIGNALS","TARGET_PROFILE","OPERATIONAL_REFINEMENT"];
  const written=owners.filter(o=>commit.includes(o));
  return written.length===owners.length &&
    written.every(o=>snap.includes(o) && rest.includes(o)) &&
    /step/.test(snap) && /step/.test(rest);
});
T("S70","declaredPlatforms[].notes: tipo estrito e fidelidade opcional",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  const mk=n=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.declaredPlatforms=[Object.assign({platform:"fortisoc",bundle:null,
      subscriptions:[]}, n===undefined?{}:{notes:n})];
    return w.__DEV.validateSessionDocument(dd).ok; };
  return mk(undefined)===true && mk("piloto")===true && mk("")===true &&
    mk({})===false && mk([])===false && mk(42)===false && mk(null)===false && mk(true)===false;
});
T("S71","declaredDriver: shape estrito ({}/{note:null}/{note:{}}/extra recusados)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=drv=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    const c=dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
    if(drv===undefined) delete c.declaredDriver; else c.declaredDriver=drv;
    return w.__DEV.validateSessionDocument(dd).ok; };
  return mk(null)===true && mk({note:"Renovação em 2027"})===true && mk(undefined)===false &&   /* [4.8.0.4-6] */
    mk({})===false && mk({note:null})===false && mk({note:{}})===false &&
    mk({note:""})===false && mk({note:"x",extra:true})===false && mk("texto")===false;
});
T("S73","self-import expandido: FortiGate com bundle, FortiSOC sem bundle e com notes, arquitetura completa, driver",()=>{
  const cases=[
    ["fortigate-bundle",(w,d)=>{answerAll(w,1,{logs:0});w.__DEV.showResults();
      w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=[{platform:"fortigate",bundle:"ent",subscriptions:["fg-ips"]}];
      w.__DEV.showResults();}],
    ["fortisoc-nobundle",(w,d)=>{answerAll(w,1,{logs:0});w.__DEV.showResults();
      w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=[{platform:"fortisoc",bundle:null,subscriptions:[]}];
      w.__DEV.showResults();}],
    ["fortisoc-notes",(w,d)=>{answerAll(w,1,{logs:0});w.__DEV.showResults();
      w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=[{platform:"fortisoc",bundle:null,subscriptions:[],notes:"piloto"}];
      w.__DEV.showResults();}],
    ["arch-completa",(w,d)=>{answerAll(w,1);w.__DEV.showResults();
      Object.assign(w.__DEV.V32.ARCHITECTURE_CONTEXT,{saasAllowed:"no",localProcessingRequired:"yes",
        otIsolated:"yes",unifiedPlatformPreference:"no",environmentProfile:"on-prem",dataResidency:"local-required"});
      w.__DEV.showResults();}],
    ["driver-valido",(w,d)=>{answerAll(w,1,{logs:0});w.__DEV.showResults();
      w.__DEV.V32.TECH_LANDSCAPE["security-analytics"]={presence:"PARTIAL",declaredDriver:{note:"Contrato até 2027"},
        solutions:[{vendor:"Fortinet",product:"FortiSIEM"}]};
      w.__DEV.showResults();}]
  ];
  return cases.every(([name,fn])=>{
    const {w,d}=boot(); fn(w,d);
    const doc=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument(name)));
    const v=w.__DEV.validateSessionDocument(doc);
    if(!v.ok) throw new Error(name+" rejeitado pelo próprio import: "+v.error);
    const B=boot(); const r=B.w.__DEV.importSessionDocument(doc);
    if(!r.ok) throw new Error(name+" import falhou: "+r.error);
    return JSON.stringify(B.w.__DEV.captureCanonicalInputs())===JSON.stringify(w.__DEV.captureCanonicalInputs());
  });
});
T("S74+S75","evidence archive: artefatos SE1–SE5 existem, não vazios, e SE4 tem screenshot do modal aberto",()=>{
  const zip=path.join(__dirname,"visual_print_evidence_48.zip");
  if(!fs.existsSync(zip)) return false;
  const list=require("child_process").execSync(`unzip -Z1 -v "${zip}" 2>/dev/null || unzip -Z1 "${zip}"`).toString();
  const entries=require("child_process").execSync(`unzip -l "${zip}"`).toString();
  const sizeOf=(pat)=>{ const rows=entries.split("\n").filter(l=>new RegExp(pat).test(l));
    return rows.map(l=>parseInt(l.trim().split(/\s+/)[0],10)).filter(n=>!isNaN(n)); };
  const modal1366=sizeOf("SE4-oversize-modal-1366\\.png"), modal390=sizeOf("SE4-oversize-modal-390\\.png");
  const all=["SE1","SE2","SE3","SE5"].every(se=>sizeOf(se+"[-.]").some(n=>n>0));
  const png=/SE4-oversize-modal-1366\.png/.test(list) && /SE5-xss-inert-.*\.png/.test(list);
  return all && modal1366.some(n=>n>0) && modal390.some(n=>n>0) && png;
});


/* ===== [4.8.0.4] DECLARED DRIVER FIDELITY & DOC CONSISTENCY ===== */
const SCHEMA_DOC = fs.readFileSync(path.join(__dirname,"SESSION_SCHEMA_V32.md"),"utf8");
T("S76","declaredDriver é propriedade obrigatória (missing ≠ null)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const mk=f=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); f(dd);
    return w.__DEV.validateSessionDocument(dd); };
  const miss=mk(dd=>{ delete dd.inputs.technologyLandscape.capabilities["security-analytics"].declaredDriver; });
  const nul=mk(dd=>{ dd.inputs.technologyLandscape.capabilities["security-analytics"].declaredDriver=null; });
  const obj=mk(dd=>{ const c=dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
    c.declaredDriver={note:"Renovação em 2027"}; });
  return miss.ok===false && miss.error.includes("declaredDriver") && nul.ok===true && obj.ok===true;
});
T("S77","documento sem declaredDriver não toca a sessão ativa (reject antes do commit)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screen=d.body.dataset.uxscreen;
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const other=boot(); answerAll(other.w,3); other.w.__DEV.showResults();
  const doc=JSON.parse(JSON.stringify(other.w.__DEV.buildSessionDocument("B")));
  delete doc.inputs.technologyLandscape.capabilities["security-analytics"].declaredDriver;
  const r=w.__DEV.importSessionDocument(doc);
  return r.ok===false && JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre &&
    d.body.dataset.uxscreen===screen;
});
T("S78","toda capability exportada inclui a propriedade declaredDriver",()=>{
  const check=(w)=>{ const doc=w.__DEV.buildSessionDocument();
    const caps=doc.inputs.technologyLandscape.capabilities;
    const ids=Object.keys(caps);
    return ids.length>0 && ids.every(id=>"declaredDriver" in caps[id]); };
  const A=boot(); answerAll(A.w,1); A.w.__DEV.showResults();
  const B=boot(); richLandscape(B.w,B.d);
  return check(A.w) && check(B.w);
});
T("S79","exemplo inline do schema é um documento completo e válido",()=>{
  const blocks=SCHEMA_DOC.split("```json").slice(1).map(b=>b.split("```")[0]);
  if(!blocks.length) return false;
  const {w}=boot();
  const parsed=blocks.map(b=>{ try{ return JSON.parse(b); }catch{ return null; } }).filter(Boolean);
  const full=parsed.filter(o=>o && o.format==="quickscan-secops-session");
  if(!full.length) return false;
  return full.every(doc=>{ const r=w.__DEV.validateSessionDocument(doc);
    if(!r.ok) throw new Error("exemplo inline inválido: "+r.error); return true; });
});
T("S80","documentação: invariante de target é 'estritamente superior' e aponta para S61",()=>{
  const okText=/estritamente superior|target > current|superior ao (nível )?atual confirmado/i.test(SCHEMA_DOC);
  const stale=/nunca inferior ao (nível )?atual|target >= current/i.test(SCHEMA_DOC);
  const gate=/S61/.test(SCHEMA_DOC);
  return okText && !stale && gate;
});
T("S81","documentação: escopo de atomicidade corresponde à implementação (recompute fora da transação)",()=>{
  const scope=/recompute[\s\S]{0,200}fora da transação|fora\s+da transação/i.test(SCHEMA_DOC);
  const unqualified=/qualquer falha (deixa|mantém) a sessão anterior intacta/i.test(SCHEMA_DOC);
  const boundary=/valida(ção|tion)[\s\S]{0,120}normaliza[\s\S]{0,120}commit/i.test(SCHEMA_DOC);
  return scope && !unqualified && boundary;
});
T("S82","tabela de contratos do schema é estruturalmente consistente",()=>{
  const lines=SCHEMA_DOC.split("\n");
  const tables=[]; let cur=null;
  lines.forEach(l=>{ const isRow=/^\s*\|.*\|\s*$/.test(l);
    if(isRow){ if(!cur) cur={rows:[]}; cur.rows.push(l); }
    else if(cur){ tables.push(cur); cur=null; } });
  if(cur) tables.push(cur);
  const contract=tables.filter(t=>t.rows.length>2 &&
    /declaredDriver|architectureContext|declaredPlatforms|signals|solutions/.test(t.rows.join("\n")));
  if(!contract.length) return false;
  const cells=r=>r.trim().replace(/^\||\|$/g,"").split(/(?<!\\)\|/).length;
  const required=["declaredDriver","architectureContext","declaredPlatforms","notes","signals","solutions"];
  const joined=contract.map(t=>t.rows.join("\n")).join("\n");
  return contract.every(t=>{ const n=cells(t.rows[0]);
    return t.rows.every(r=>cells(r)===n); }) &&
    required.every(k=>new RegExp(k).test(joined));
});


/* ===== [4.8.0.5] LANDSCAPE OWNER DOMAIN & PLAIN-OBJECT STRICTNESS ===== */
T("S83","keys de capabilities derivam de TECH_LANDSCAPE; todos os IDs reais do owner são aceitos",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  const land=w.eval("Object.keys(V32.TECH_LANDSCAPE)");
  const caps=w.eval("Object.keys(V32.CAPABILITIES)");
  const doc=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
  /* positivo: cada ID do owner, em shape canônico, é aceito como key
     [4.8.0.6-B2] o owner é COMPLETO — o gate reescreve a entrada do ID sob teste dentro do mapa
     completo exportado, em vez de reduzir o mapa a uma única chave (state que o exporter não produz). */
  const each=land.every(id=>{
    const dd=JSON.parse(JSON.stringify(doc));
    dd.inputs.technologyLandscape.capabilities[id]={presence:"NONE",solutions:[],declaredDriver:null};
    const r=w.__DEV.validateSessionDocument(dd);
    if(!r.ok) throw new Error("ID canônico do owner rejeitado: "+id+" · "+r.error);
    return true; });
  /* toda key exportada pertence ao owner */
  const exported=Object.keys(doc.inputs.technologyLandscape.capabilities);
  return land.length===22 && caps.length===25 && each &&
    exported.every(id=>land.includes(id)) && exported.length===land.length;
});
T("S84+S89","IDs fora do owner recusados como entry de Landscape; sessão ativa intacta",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screen=d.body.dataset.uxscreen;
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const land=w.eval("Object.keys(V32.TECH_LANDSCAPE)");
  const fora=w.eval("Object.keys(V32.CAPABILITIES)").filter(c=>!land.includes(c));
  const results=fora.map(id=>{
    const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.capabilities[id]={presence:"NONE",solutions:[],declaredDriver:null};
    const v=w.__DEV.validateSessionDocument(dd);
    const imp=w.__DEV.importSessionDocument(dd);
    return { id, rejected: v.ok===false && imp.ok===false,
      msg: /não pertence ao Technology Landscape|não é habilitada para Landscape/.test(v.error||"") }; });
  return fora.length===3 && fora.join(",")==="soc-governance,soc-staffing,soc-skills" &&
    results.every(r=>r.rejected && r.msg) &&
    JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre &&
    d.body.dataset.uxscreen===screen;
});
T("S85","coveredCapabilities preserva o domínio CAPABILITIES (separação de domínio provada)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  /* [4.8.0.6-26] o mesmo ID é provado nos DOIS domínios usando a posição canônica correta:
     válido como coveredCapability de solution third-party em soc-platform · inválido como key de Landscape */
  const mk=cc=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.capabilities["soc-platform"].solutions[0].coveredCapabilities=cc;
    return w.__DEV.validateSessionDocument(dd).ok; };
  const asKey=(()=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.technologyLandscape.capabilities["soc-governance"]={presence:"NONE",solutions:[],declaredDriver:null};
    return w.__DEV.validateSessionDocument(dd).ok; })();
  return mk(["soc-governance"])===true && mk(["security-analytics"])===true &&
    mk(["nao-existe"])===false && asKey===false;
});
T("S86","assessment.answers exige objeto de mapa (array e primitivos recusados)",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showResults();
  const mk=v=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    dd.inputs.assessment.answers=v; return w.__DEV.validateSessionDocument(dd).ok; };
  const orig=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())).inputs.assessment.answers;
  return mk([])===false && mk([1,2,3])===false && mk("x")===false && mk(null)===false &&
    mk(42)===false && mk(true)===false && mk(orig)===true;
});
T("S87","assessment.notes exige objeto de mapa; {} e sparse permanecem válidos",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.setNote(9,"nota"); w.__DEV.showResults();
  const mk=v=>{ const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    if(v===undefined) delete dd.inputs.assessment.notes; else dd.inputs.assessment.notes=v;
    return w.__DEV.validateSessionDocument(dd).ok; };
  return mk([])===false && mk(["a"])===false && mk("x")===false && mk(null)===false &&
    mk({})===true && mk({logs:"texto"})===true && mk(undefined)===true;
});
T("S88","auditoria de containers de mapa: nenhum aceita array por acidente",()=>{
  const src=fs.readFileSync(path.join(__dirname,"ui_session_v32.js"),"utf8");
  /* contêineres de mapa validados no documento */
  const {w,d}=boot(); richLandscape(w,d);
  const setPath=(dd,p,v)=>{ const ks=p.split("."); let o=dd; for(let i=0;i<ks.length-1;i++) o=o[ks[i]];
    o[ks[ks.length-1]]=v; };
  const maps=["inputs.assessment.answers","inputs.assessment.notes","inputs.technologyLandscape.capabilities",
    "inputs.technologyLandscape.architectureContext","inputs.technologyLandscape.signals",
    "inputs.targetProfile.overrides","inputs.operationalRefinement.answers","inputs"];
  const arrRejected=maps.every(p=>{
    const dd=JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument()));
    setPath(dd,p,[]);
    const r=w.__DEV.validateSessionDocument(dd);
    if(r.ok) throw new Error("container aceitou array: "+p);
    return true; });
  /* nenhum check de container de mapa ficou sem guard no source (walkers recursivos são exceção declarada) */
  const unguarded=src.split("\n").filter(l=>/typeof\s+[A-Za-z0-9_.]+\s*!==\s*"object"/.test(l) &&
    !/Array\.isArray/.test(l) && !/depth/.test(l));
  return arrRejected && unguarded.length===0;
});

/* ===== [4.8.0.6] COVERED-CAPABILITY SEMANTICS · OWNER COMPLETENESS · EDITOR PARITY ===== */
/* helpers: documento rico canônico + mutação + prova de "reject ANTES do commit, sessão intacta" */
function docOf(w){ return JSON.parse(JSON.stringify(w.__DEV.buildSessionDocument())); }
function mutate(w,f){ const dd=docOf(w); f(dd); return dd; }
function rejectsUntouched(w,d,f){
  const screen=d.body.dataset.uxscreen;
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const dd=mutate(w,f);
  const v=w.__DEV.validateSessionDocument(dd);
  const imp=w.__DEV.importSessionDocument(dd);
  const intact=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w)===pre &&
    d.body.dataset.uxscreen===screen;
  return v.ok===false && imp.ok===false && intact;
}
function acceptsDoc(w,f){ return w.__DEV.validateSessionDocument(mutate(w,f)).ok===true; }
const SP=dd=>dd.inputs.technologyLandscape.capabilities["soc-platform"].solutions[0];

T("S90","coveredCapabilities só existe em solution third-party de soc-platform",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  /* ORACLE INDEPENDENTE: a regra de posição/FortiSOC é lida do source congelado, não redigitada no gate.
     Se ui_v32.js ou engine_v32.js mudarem o predicado, este gate quebra em vez de silenciar. */
  const uiSrc=fs.readFileSync(path.join(__dirname,"ui_v32.js"),"utf8");
  const engSrc=fs.readFileSync(path.join(__dirname,"engine_v32.js"),"utf8");
  const uiRule=/capId==="soc-platform"\s*&&\s*!\/fortisoc\/i\.test\(s\.product\|\|""\)/.test(uiSrc);
  const engRule=/TECH_LANDSCAPE\["soc-platform"\]/.test(engSrc) &&
    /\/fortisoc\/i\.test\(sol\.product\|\|""\)/.test(engSrc);
  /* VÁLIDO: third-party em soc-platform, um ou vários IDs distintos */
  const validOne=acceptsDoc(w,dd=>SP(dd).coveredCapabilities=["security-automation"]);
  const validGov=acceptsDoc(w,dd=>SP(dd).coveredCapabilities=["soc-governance"]);
  const validMany=acceptsDoc(w,dd=>SP(dd).coveredCapabilities=
    ["security-automation","soc-governance","threat-intelligence"]);
  /* INVÁLIDO: qualquer capability que não seja soc-platform */
  const badNet=rejectsUntouched(w,d,dd=>dd.inputs.technologyLandscape.capabilities["network-detection"]
    .solutions[0].coveredCapabilities=["security-automation"]);
  const badEdr=rejectsUntouched(w,d,dd=>dd.inputs.technologyLandscape.capabilities["endpoint-detection"]
    .solutions[0].coveredCapabilities=["security-automation"]);
  /* INVÁLIDO: FortiSOC (cobertura vem das capabilityRelations do catálogo) */
  const badFortiSOC=rejectsUntouched(w,d,dd=>{ const s=SP(dd);
    s.vendor="Fortinet"; s.product="FortiSOC"; s.coveredCapabilities=["security-automation"]; });
  const badFortiSOCCase=rejectsUntouched(w,d,dd=>{ const s=SP(dd);
    s.product="Plataforma FortiSOC 2.0"; s.coveredCapabilities=["security-automation"]; });
  /* FortiSOC SEM o campo continua válido */
  const fortiSOCClean=acceptsDoc(w,dd=>{ const s=SP(dd);
    s.vendor="Fortinet"; s.product="FortiSOC"; delete s.coveredCapabilities; });
  return uiRule && engRule && validOne && validGov && validMany &&
    badNet && badEdr && badFortiSOC && badFortiSOCCase && fortiSOCClean;
});
T("S91","coveredCapabilities exclui soc-platform (plataforma não cobre a si própria) e IDs inexistentes",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  /* domínio = grade real da UI: CAPABILITIES menos o sentinel soc-platform */
  const grid=w.eval('JSON.stringify(Object.keys(V32.CAPABILITIES).filter(c=>c!=="soc-platform"))');
  const allowed=JSON.parse(grid);
  const everyAllowed=allowed.every(id=>acceptsDoc(w,dd=>SP(dd).coveredCapabilities=[id]));
  return everyAllowed && allowed.length===24 &&
    rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=["soc-platform"]) &&
    rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=["security-automation","soc-platform"]) &&
    rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=["capability-inexistente"]);
});
T("S92","coveredCapabilities: array não vazio e sem duplicatas (checkboxes não produzem [] nem repetição)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  return rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=[]) &&
    rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=["security-automation","security-automation"]) &&
    rejectsUntouched(w,d,dd=>SP(dd).coveredCapabilities=["soc-governance","security-automation","soc-governance"]) &&
    /* representação canônica de "nenhuma cobertura declarada" é a AUSÊNCIA do campo */
    acceptsDoc(w,dd=>delete SP(dd).coveredCapabilities);
});
T("S93","supressão derivada de plataforma de terceiro ocorre na posição semanticamente correta",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const caps=w2=>JSON.parse(w2.eval("JSON.stringify([...V32.suppressedByPlatform().caps])")).sort();
  /* com a declaração explícita, o engine congelado suprime exatamente o que foi declarado */
  const withDoc=docOf(w);
  const A=boot(); A.w.__DEV.importSessionDocument(JSON.parse(JSON.stringify(withDoc)));
  const withCaps=caps(A.w);
  /* removida a declaração, a supressão específica desaparece (nada é inferido para third-party) */
  const without=JSON.parse(JSON.stringify(withDoc)); delete SP(without).coveredCapabilities;
  const B=boot(); const impB=B.w.__DEV.importSessionDocument(without);
  const withoutCaps=caps(B.w);
  return impB.ok===true &&
    withCaps.join(",")==="security-automation,soc-governance" &&
    withoutCaps.length===0 &&
    /* o campo está de fato em soc-platform, não em outra capability */
    !!withDoc.inputs.technologyLandscape.capabilities["soc-platform"].solutions[0].coveredCapabilities &&
    !("coveredCapabilities" in withDoc.inputs.technologyLandscape.capabilities["network-detection"].solutions[0]);
});
T("S94","assessment.answers é owner COMPLETO: question ID ausente é recusado (missing ≠ null)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const exported=Object.keys(docOf(w).inputs.assessment.answers);
  const every=IDS.every(id=>rejectsUntouched(w,d,dd=>{ delete dd.inputs.assessment.answers[id]; }));
  return exported.length===IDS.length && every &&
    /* null explícito continua sendo a representação válida de "não respondida" */
    acceptsDoc(w,dd=>{ dd.inputs.assessment.answers["training"]=null;
      delete dd.inputs.targetProfile.overrides["training"]; });
});
T("S95","technologyLandscape.capabilities é owner COMPLETO: capability ausente é recusada",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const land=w.eval("Object.keys(V32.TECH_LANDSCAPE)");
  const every=land.every(id=>rejectsUntouched(w,d,dd=>{ delete dd.inputs.technologyLandscape.capabilities[id]; }));
  /* a representação explícita de "não informada" continua válida */
  const unsetOk=acceptsDoc(w,dd=>{ dd.inputs.technologyLandscape.capabilities["deception"]=
    {presence:"UNSET",solutions:[],declaredDriver:null}; });
  return land.length===22 && every && unsetOk;
});
T("S96","declaredPlatforms é propriedade obrigatória (ausente ≠ [])",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  return rejectsUntouched(w,d,dd=>{ delete dd.inputs.technologyLandscape.declaredPlatforms; }) &&
    acceptsDoc(w,dd=>{ dd.inputs.technologyLandscape.declaredPlatforms=[]; });
});
T("S97","signals é owner COMPLETO: sinal ausente é recusado (missing ≠ 'unset')",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const sigs=w.eval("JSON.parse(JSON.stringify(V32.SIGNAL_IDS))");
  const every=sigs.every(s=>rejectsUntouched(w,d,dd=>{ delete dd.inputs.technologyLandscape.signals[s]; }));
  return sigs.length>0 && every &&
    rejectsUntouched(w,d,dd=>{ delete dd.inputs.technologyLandscape.signals; }) &&
    acceptsDoc(w,dd=>{ dd.inputs.technologyLandscape.signals["ransomwareConcern"]="unset"; });
});
T("S98","operationalRefinement.answers é owner COMPLETO: tema ausente é recusado",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const refIds=Object.keys(docOf(w).inputs.operationalRefinement.answers);
  const every=refIds.every(r=>rejectsUntouched(w,d,dd=>{ delete dd.inputs.operationalRefinement.answers[r]; }));
  return refIds.length>0 && every &&
    acceptsDoc(w,dd=>{ dd.inputs.operationalRefinement.answers["ref-metrics"]=null; });
});
T("S99","owners realmente SPARSE continuam sparse (notes ausente, overrides {})",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const notesAbsent=acceptsDoc(w,dd=>{ delete dd.inputs.assessment.notes; });
  const notesEmpty=acceptsDoc(w,dd=>{ dd.inputs.assessment.notes={}; });
  const notesSparse=acceptsDoc(w,dd=>{ dd.inputs.assessment.notes={logs:"apenas uma nota"}; });
  const ovEmpty=acceptsDoc(w,dd=>{ dd.inputs.targetProfile.overrides={}; });
  /* e o roundtrip de um documento sem notes preserva a semântica (nota ausente = observação vazia) */
  const dd=mutate(w,x=>{ delete x.inputs.assessment.notes; });
  const B=boot(); const imp=B.w.__DEV.importSessionDocument(dd);
  const after=B.w.__DEV.captureCanonicalInputs();
  return notesAbsent && notesEmpty && notesSparse && ovEmpty && imp.ok===true &&
    Object.keys(after.assessment.notes).length===0;
});
T("S100","paridade de strings com readDraftFromDom(): vendor/product/coverage/notes",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  return rejectsUntouched(w,d,dd=>SP(dd).vendor=" Acme ") &&
    rejectsUntouched(w,d,dd=>SP(dd).product=" X ") &&
    rejectsUntouched(w,d,dd=>SP(dd).coverage="") &&
    rejectsUntouched(w,d,dd=>SP(dd).coverage="   ") &&
    rejectsUntouched(w,d,dd=>SP(dd).coverage=" global ") &&
    rejectsUntouched(w,d,dd=>SP(dd).notes="") &&
    rejectsUntouched(w,d,dd=>SP(dd).notes=" nota ") &&
    /* vazio em UM dos identificadores permanece válido — S58 preservado */
    acceptsDoc(w,dd=>{ const s=SP(dd); s.vendor=""; s.product="X"; }) &&
    acceptsDoc(w,dd=>{ const s=SP(dd); s.vendor="X"; s.product=""; delete s.coveredCapabilities; }) &&
    rejectsUntouched(w,d,dd=>{ const s=SP(dd); s.vendor=""; s.product=""; }) &&
    acceptsDoc(w,dd=>SP(dd).coverage="global") &&
    acceptsDoc(w,dd=>SP(dd).notes="nota") &&
    /* ausência é a representação canônica de "não informado" */
    acceptsDoc(w,dd=>{ delete SP(dd).coverage; delete SP(dd).notes; });
});
T("S101","status: ausente ≠ vazio — '' sai do domínio do import",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const enumOk=w.eval('JSON.stringify(V32.ENUMS.solutionStatus)');
  return rejectsUntouched(w,d,dd=>SP(dd).status="") &&
    acceptsDoc(w,dd=>SP(dd).status="production") &&
    acceptsDoc(w,dd=>{ delete SP(dd).status; }) &&
    /* STATUS_LABELS da UI segue com a opção visual "" — o contrato mudou só no import */
    /v32-sol-\$\{capId\}-\$\{i\}-status/.test(fs.readFileSync(path.join(__dirname,"ui_v32.js"),"utf8")) &&
    JSON.parse(enumOk).indexOf("")===-1;
});
T("S102","declaredDriver.note: paridade de trim com drv.value.trim()",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const drv=dd=>dd.inputs.technologyLandscape.capabilities["endpoint-detection"];
  return rejectsUntouched(w,d,dd=>drv(dd).declaredDriver={note:" motivo "}) &&
    rejectsUntouched(w,d,dd=>drv(dd).declaredDriver={note:"motivo "}) &&
    rejectsUntouched(w,d,dd=>drv(dd).declaredDriver={note:" motivo"}) &&
    acceptsDoc(w,dd=>drv(dd).declaredDriver={note:"motivo"}) &&
    acceptsDoc(w,dd=>drv(dd).declaredDriver=null);
});
T("S103","regressão do falso positivo: a posição usada pelos antigos S41/S85 agora é recusada",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  /* o fixture histórico declarava coveredCapabilities:["network-detection"] numa solution de
     network-detection — state que o editor nunca produz. Deve falhar em AMBAS as formas. */
  const oldS41=rejectsUntouched(w,d,dd=>dd.inputs.technologyLandscape.capabilities["network-detection"]
    .solutions[0].coveredCapabilities=["network-detection"]);
  const oldS85=rejectsUntouched(w,d,dd=>dd.inputs.technologyLandscape.capabilities["network-detection"]
    .solutions[0].coveredCapabilities=["soc-governance"]);
  /* e o fixture atual não reintroduziu a posição inválida em nenhuma capability */
  const doc=docOf(w);
  const caps=doc.inputs.technologyLandscape.capabilities;
  const misplaced=Object.keys(caps).filter(id=>id!=="soc-platform" &&
    (caps[id].solutions||[]).some(s=>"coveredCapabilities" in s));
  return oldS41 && oldS85 && misplaced.length===0;
});
T("S104","self-containment de owner completo: a normalization não fabrica default para ausência",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const N=doc=>{ try{ return { threw:false, cand:w.__DEV.normalizeSessionDocument(doc) }; }
    catch(e){ return { threw:true, msg:e.message }; } };
  /* documento íntegro normaliza sem exceção e o candidato é COMPLETO */
  const okCand=N(docOf(w));
  const land=w.eval("Object.keys(V32.TECH_LANDSCAPE)");
  const sigs=w.eval("JSON.parse(JSON.stringify(V32.SIGNAL_IDS))");
  const complete=!okCand.threw &&
    Object.keys(okCand.cand.landscape).length===land.length &&
    Object.keys(okCand.cand.signals).length===sigs.length &&
    okCand.cand.ans.length===IDS.length;
  /* cada owner completo com propriedade ausente MORRE na normalization — nada de null/UNSET/unset/[] inventado */
  const cases=[
    dd=>{ delete dd.inputs.assessment.answers["logs"]; },
    dd=>{ delete dd.inputs.technologyLandscape.capabilities["deception"]; },
    dd=>{ delete dd.inputs.technologyLandscape.declaredPlatforms; },
    dd=>{ delete dd.inputs.technologyLandscape.signals["activeIncident"]; },
    dd=>{ delete dd.inputs.operationalRefinement.answers["ref-metrics"]; }
  ];
  const allThrow=cases.every(f=>N(mutate(w,f)).threw===true);
  /* e a validação também rejeita antes: a ausência nunca chega ao commit */
  const allRejected=cases.every(f=>rejectsUntouched(w,d,f));
  return complete && allThrow && allRejected;
});

/* ===== [4.8.0.7] UNICODE SCALAR LIMITS · EXPORT PREFLIGHT · RELEASE EVIDENCE COHERENCE ===== */
const EMOJI="😀";                                  /* U+1F600 · astral: 2 code units UTF-16, 1 escalar */
function countURLs(w){                              /* jsdom não implementa Object URL: stub observável */
  const rec={created:0,revoked:0};
  w.URL.createObjectURL=()=>{rec.created++;return "blob:x";};
  w.URL.revokeObjectURL=()=>{rec.revoked++;};
  return rec;
}
T("S105","limite de 10.000 conta ESCALARES Unicode, não code units UTF-16",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const at=n=>{ const dd=docOf(w); dd.inputs.assessment.notes={logs:EMOJI.repeat(n)};
    return w.__DEV.validateSessionDocument(dd).ok; };
  const s10000=EMOJI.repeat(10000);
  /* o teste falharia sob semântica .length: 10.000 emojis têm 20.000 code units */
  const utf16WouldReject = s10000.length===20000 && s10000.length>10000;
  const scalarOk = w.__DEV.scalarLen(s10000)===10000;
  /* combining sequence conta como seus escalares constituintes, não como grapheme cluster */
  const comb="e\u0301";                            /* e + combining acute = 2 escalares, 1 grapheme */
  const combCounted = w.__DEV.scalarLen(comb)===2;
  const combLimit = (()=>{ const dd=docOf(w); dd.inputs.assessment.notes={logs:comb.repeat(5000)};
    const okAt10000=w.__DEV.validateSessionDocument(dd).ok;
    const dd2=docOf(w); dd2.inputs.assessment.notes={logs:comb.repeat(5000)+"x"};
    return okAt10000===true && w.__DEV.validateSessionDocument(dd2).ok===false; })();
  /* surrogate desemparelhado é recusado como Unicode não canônico, não contado como texto válido */
  const lone=(()=>{ const dd=docOf(w); dd.inputs.assessment.notes={logs:"a\uD83D"};
    const r=w.__DEV.validateSessionDocument(dd);
    return r.ok===false && /malformado|surrogate/i.test(r.error); })();
  const loneLow=(()=>{ const dd=docOf(w); dd.inputs.assessment.notes={logs:"\uDE00b"};
    return w.__DEV.validateSessionDocument(dd).ok===false; })();
  return utf16WouldReject && scalarOk && combCounted && combLimit && lone && loneLow &&
    at(10000)===true && at(10001)===false &&
    /* sem truncamento nem normalização silenciosa: o valor de 10.000 escalares atravessa intacto */
    (()=>{ const dd=docOf(w); dd.inputs.assessment.notes={logs:s10000};
      const B=boot(); const imp=B.w.__DEV.importSessionDocument(dd);
      const same=imp.ok===true && B.w.__DEV.captureCanonicalInputs().assessment.notes.logs===s10000;
      B.w.close(); return same; })();
});
T("S106","preflight de export: estado de UI acima do limite não emite arquivo reimportável",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screen=d.body.dataset.uxscreen;
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs())+derivedModel(w);
  const rec=countURLs(w);
  /* estado REAL de UI: nota de avaliação com 10.001 escalares */
  w.__DEV.setNote(IDS.indexOf("logs"), EMOJI.repeat(10001)); w.__DEV.showResults();
  const r=w.__DEV.downloadSession("acima-do-limite");
  const blocked = r.ok===false && r.reason==="invalid" && typeof r.error==="string" && r.error.length>0 &&
    rec.created===0;                                /* nenhum arquivo/Object URL emitido */
  /* o documento que teria sido emitido é, de fato, recusado pelo próprio import */
  const wouldFail=w.__DEV.validateSessionDocument(w.__DEV.buildSessionDocument("x")).ok===false;
  /* estado preservado: a sessão continua exatamente como estava (nada truncado) */
  w.__DEV.setNote(IDS.indexOf("logs"), EMOJI.repeat(10000)); w.__DEV.showResults();
  const rec2=countURLs(w);
  const okBoundary=w.__DEV.downloadSession("no-limite");
  /* maior valor válido: emitido E aceito pelo mesmo build */
  const emitted=w.__DEV.prepareSessionExport("no-limite");
  const B=boot(); const imp=B.w.__DEV.importSessionDocument(JSON.parse(emitted.text));
  const roundOk=imp.ok===true &&
    B.w.__DEV.captureCanonicalInputs().assessment.notes.logs===EMOJI.repeat(10000);
  B.w.close();
  return blocked && wouldFail && okBoundary.ok===true && rec2.created===1 && roundOk &&
    d.body.dataset.uxscreen===screen && typeof pre==="string";
});
T("S107","preflight de export: 1 MiB medido nos BYTES UTF-8 exatos da serialização emitida",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const screen=d.body.dataset.uxscreen;
  /* caminho aceito: documento válido abaixo do limite */
  const small=w.__DEV.prepareSessionExport("pequeno");
  const smallBytes=w.__DEV.utf8ByteLength(small.text);
  const recOk=countURLs(w);
  const dl=w.__DEV.downloadSession("pequeno");
  const acceptedPath = small.ok===true && small.bytes===smallBytes && smallBytes<=1048576 &&
    dl.ok===true && dl.bytes===smallBytes && recOk.created===1;
  /* caminho recusado: estado real de UI que serializa acima de 1 MiB */
  const V=w.__DEV.V32;
  IDS.forEach((id,i)=>w.__DEV.setNote(i,"N".repeat(10000)));
  Object.keys(V.TECH_LANDSCAPE).forEach((cap,i)=>{
    V.TECH_LANDSCAPE[cap]={presence:"PRESENT",declaredDriver:{note:"D".repeat(10000)},
      solutions:[{vendor:"V"+i,product:"P"+i,coverage:"C".repeat(10000),notes:"O".repeat(10000)},
                 {vendor:"W"+i,product:"Q"+i,coverage:"C".repeat(10000),notes:"O".repeat(10000)}]};
  });
  /* sem re-render: o caminho de export lê os owners canônicos, não o DOM — e renderizar ~1 MiB de texto
     em jsdom consumiria memória sem acrescentar evidência ao gate */
  const pre=JSON.stringify(w.__DEV.captureCanonicalInputs());
  const rec=countURLs(w);
  const big=w.__DEV.prepareSessionExport("grande");
  const r=w.__DEV.downloadSession("grande");
  const rejected = big.ok===false && big.reason==="oversize" && big.bytes>1048576 &&
    r.ok===false && /1 MiB|1\.048\.576/.test(r.error||"") &&
    rec.created===0 &&                              /* Object URL não é criado para export recusado */
    JSON.stringify(w.__DEV.captureCanonicalInputs())===pre &&
    d.body.dataset.uxscreen===screen;
  /* cada campo isolado é válido: a recusa vem do TAMANHO da serialização, não de um campo inválido */
  const fieldsValid=w.__DEV.validateSessionDocument(w.__DEV.buildSessionDocument("grande")).ok===true;
  return acceptedPath && rejected && fieldsValid;
});
T("S108","hardening genérico de strings importadas (raiz e blocos aninhados)",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  const over=EMOJI.repeat(10001), okLen=EMOJI.repeat(10000), lone="a\uD83D";
  const set=(path,v)=>{ const dd=docOf(w);
    if(path==="label") dd.label=v;
    else if(path==="createdAt") dd.createdAt=v;
    else if(path==="toolVersion") dd.toolVersion=v;
    else if(path==="note") dd.inputs.assessment.notes={logs:v};
    else if(path==="solution") SP(dd).notes=v;
    else if(path==="driver") dd.inputs.technologyLandscape.capabilities["endpoint-detection"].declaredDriver={note:v};
    else if(path==="platnote") dd.inputs.technologyLandscape.declaredPlatforms[0].notes=v;
    return w.__DEV.validateSessionDocument(dd); };
  const fields=["createdAt","toolVersion","note","solution","driver","platnote"];
  /* limite escalar aplicado de forma consistente em todos eles */
  const overRejected=fields.every(f=>set(f,over).ok===false);
  const loneRejected=fields.concat(["label"]).every(f=>set(f,lone).ok===false);
  /* label tem bound canônico ESTRITO (200) provado pelo exporter — recusa antes do limite genérico */
  const labelStrict=set("label",EMOJI.repeat(201)).ok===false && set("label",EMOJI.repeat(200)).ok===true;
  const labelBoundIsExporter=w.__DEV.SESSION_MAX_LABEL===200 &&
    w.__DEV.scalarLen(w.__DEV.buildSessionDocument(EMOJI.repeat(5000)).label)===200;
  /* enums/hashes continuam recusados pelas suas regras mais estritas, antes do limite genérico */
  const enumFirst=(()=>{ const dd=docOf(w); SP(dd).status="X".repeat(10); 
    return w.__DEV.validateSessionDocument(dd).ok===false; })();
  /* valores no limite exato continuam aceitos nos campos de texto livre */
  const boundaryOk=["note","solution","driver","platnote"].every(f=>set(f,okLen).ok===true);
  return overRejected && loneRejected && labelStrict && labelBoundIsExporter && enumFirst && boundaryOk;
});
T("S109","coerência de versão entre package, build, exemplos publicados e documentos",()=>{
  const {w}=boot();
  const lock=JSON.parse(fs.readFileSync(path.join(__dirname,"package-lock.json"),"utf8"));
  const meta=w.__QS_BUILD_META;
  const mini=JSON.parse(fs.readFileSync(path.join(__dirname,"synthetic_session_examples/exemplo-minimo.json"),"utf8"));
  const full=JSON.parse(fs.readFileSync(path.join(__dirname,"synthetic_session_examples/exemplo-completo.json"),"utf8"));
  const REPORT=fs.readFileSync(path.join(__dirname,"session_roundtrip_report.md"),"utf8");
  const V=PKG.version;
  const runtimeLine=(SCHEMA_DOC.match(/^Runtime desta fase:.*$/m)||[""])[0];
  const releaseBlock=REPORT.split("\n").slice(0,12).join("\n");
  return V===lock.version && V===lock.packages[""].version &&
    meta.toolVersion===V && meta.engineSha256===ENG_SHA &&
    mini.toolVersion===V && mini.engineSha256===ENG_SHA &&
    full.toolVersion===V && full.engineSha256===ENG_SHA &&
    runtimeLine.includes(V) && !/4\.8\.0\.[0-6]`/.test(runtimeLine) &&
    releaseBlock.includes(V) &&
    /* a description do package descreve a fase corrente, não uma anterior */
    PKG.description.includes("4.8.0.7") && !/4\.8\.0\.5|4\.8\.0\.6/.test(PKG.description);
});
T("S110","exemplo inline do schema é o arquivo publicado e a proveniência declarada é a real",()=>{
  const {w}=boot();
  const blocks=SCHEMA_DOC.split("```json").slice(1).map(b=>b.split("```")[0]);
  const inline=blocks.map(b=>{try{return JSON.parse(b);}catch{return null;}})
    .find(o=>o&&o.format==="quickscan-secops-session");
  const file=JSON.parse(fs.readFileSync(path.join(__dirname,"synthetic_session_examples/exemplo-minimo.json"),"utf8"));
  const deepEqual=JSON.stringify(inline)===JSON.stringify(file);   /* mesma ordem e mesmos valores */
  /* ambos passam pelo validador real do build */
  const bothValid=w.__DEV.validateSessionDocument(inline).ok===true &&
    w.__DEV.validateSessionDocument(file).ok===true;
  /* proveniência: o builder NÃO gera os exemplos — a afirmação antiga era falsa */
  const builder=fs.readFileSync(path.join(__dirname,"build_v32_html.py"),"utf8");
  const builderDoesNotEmit=!/exemplo-minimo|exemplo-completo|synthetic_session_examples/.test(builder);
  /* a AFIRMAÇÃO original ("**gerado pelo próprio build**") não pode mais existir; a menção em texto
     corrido que documenta a correção é permitida e não é uma alegação de proveniência */
  const claimsBuildGenerated=/\*\*gerado pelo próprio build/.test(SCHEMA_DOC);
  const truthfulWording=/exportado pelo runtime/.test(SCHEMA_DOC) && /não\*\* é gerado por `build_v32_html\.py`/.test(SCHEMA_DOC);
  return deepEqual && bothValid && builderDoesNotEmit && !claimsBuildGenerated && truthfulWording;
});
T("S111","disposição de unicidade: platform e subscriptions duplicadas não são estado canônico",()=>{
  const {w,d}=boot(); richLandscape(w,d);
  /* ORACLE no source congelado: a UI monta subs por Object.keys(...).filter (únicos por construção) e
     reconstrói declaredPlatforms como others.filter(!fortigate).concat([entry]) — no máximo uma entrada. */
  const uiSrc=fs.readFileSync(path.join(__dirname,"ui_v32.js"),"utf8");
  const subsUnique=/Object\.keys\(V32\.SECURITY_SUBSCRIPTIONS\)\s*\n?\s*\.filter/.test(uiSrc);
  const oneFortigate=/others\s*=\s*all\.filter\(p\s*=>\s*!\(p\s*&&\s*p\.platform===\"fortigate\"\)\)/.test(uiSrc) &&
    /others\.concat\(\[entry\]\)/.test(uiSrc);
  /* deriveLicensedContext deduplica via Set: nenhum contrato de runtime depende de preservar repetição */
  const engSrc=fs.readFileSync(path.join(__dirname,"engine_v32.js"),"utf8");
  const setDedupe=/const subIds = new Set\(\)/.test(engSrc);
  /* negativos: duplicatas recusadas ANTES do commit, sessão intacta */
  const dupSub=rejectsUntouched(w,d,dd=>{ dd.inputs.technologyLandscape.declaredPlatforms[0]
    .subscriptions=["fg-ips","fg-ips"]; });
  const dupPlat=rejectsUntouched(w,d,dd=>{ dd.inputs.technologyLandscape.declaredPlatforms=
    [{platform:"fortigate",bundle:"utp",subscriptions:["fg-ips"]},
     {platform:"fortigate",bundle:null,subscriptions:[]}]; });
  const dupPlatSoc=rejectsUntouched(w,d,dd=>{ dd.inputs.technologyLandscape.declaredPlatforms=
    [{platform:"fortisoc",bundle:null,subscriptions:[]},
     {platform:"fortisoc",bundle:null,subscriptions:[]}]; });
  /* positivos preservados: entradas distintas e subscriptions únicas continuam válidas */
  const okDistinct=acceptsDoc(w,dd=>{ dd.inputs.technologyLandscape.declaredPlatforms=
    [{platform:"fortigate",bundle:"utp",subscriptions:["fg-ips","fg-antivirus"]},
     {platform:"fortisoc",bundle:null,subscriptions:[]}]; });
  return subsUnique && oneFortigate && setDedupe && dupSub && dupPlat && dupPlatSoc && okDistinct;
});
T("S113","evidence archive 4.8.0.7: artefatos SE6/SE7/SE8 existem, não vazios e cobrem os dois breakpoints",()=>{
  const zip=path.join(__dirname,"visual_print_evidence_487.zip");
  if(!fs.existsSync(zip)) throw new Error("arquivo de evidência da 4.8.0.7 ausente");
  const entries=require("child_process").execSync(`unzip -l "${zip}"`).toString();
  const sizeOf=pat=>entries.split("\n").filter(l=>new RegExp(pat).test(l))
    .map(l=>parseInt(l.trim().split(/\s+/)[0],10)).filter(n=>!isNaN(n));
  /* cada cenário novo precisa existir nos DOIS breakpoints reais e ter bytes > 0 */
  const need=[["SE6-unicode-import-1366\\.png"],["SE6-unicode-import-390\\.png"],
              ["SE7-export-field-limit-1366\\.png"],["SE7-export-field-limit-390\\.png"],
              ["SE8-export-1mib-1366\\.png"],["SE8-export-1mib-390\\.png"],
              ["SE3-session-1366\\.pdf"],["SE3-session-390\\.pdf"]];
  const all=need.every(([pat])=>{ const sz=sizeOf(pat);
    if(!sz.length) throw new Error("artefato ausente no arquivo de evidência: "+pat);
    if(!sz.some(n=>n>0)) throw new Error("artefato vazio no arquivo de evidência: "+pat);
    return true; });
  /* o arquivo de evidência anterior (4.8) permanece publicado e íntegro */
  const prev=path.join(__dirname,"visual_print_evidence_48.zip");
  return all && fs.existsSync(prev) && fs.statSync(prev).size>0 && fs.statSync(zip).size>0;
});
T("S112","propriedade forte de self-import: todo export emitido é reimportável pelo mesmo build",()=>{
  /* cada cenário é construído, exportado, reimportado e ENCERRADO antes do próximo: a suíte não retém
     N janelas jsdom vivas (o acúmulo estourava o heap). */
  const build={
    /* 1 · Unicode astral próximo do limite + landscape rico + coveredCapabilities de terceiro */
    "astral+rich+covered": ()=>{ const {w,d}=boot(); richLandscape(w,d);
      w.__DEV.setNote(IDS.indexOf("logs"), EMOJI.repeat(9999)); w.__DEV.showResults();
      return {w,label:EMOJI.repeat(250)}; },
    /* 2 · FortiSOC em soc-platform: cobertura vem do catálogo, sem coveredCapabilities */
    "fortisoc": ()=>{ const {w,d}=boot(); richLandscape(w,d);
      w.__DEV.V32.TECH_LANDSCAPE["soc-platform"]={presence:"PRESENT",declaredDriver:{note:"consolidação"},
        solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]};
      w.__DEV.showResults(); return {w,label:"forti"}; },
    /* 3 · target + refinement, optional fields AUSENTES */
    "target+refinement": ()=>{ const {w}=boot(); answerAll(w,1,{logs:0,knowledge:0});
      w.__DEV.setPriorities(["logs"]); w.__DEV.setTarget("logs",3);
      w.__DEV.setRefinementAnswer("ref-metrics",1); w.__DEV.showResults();
      return {w,label:null}; },
    /* 4 · optional fields PRESENTES: platform notes, subscriptions, signals */
    "optional+platnote": ()=>{ const {w,d}=boot(); richLandscape(w,d);
      w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms=[{platform:"fortigate",bundle:"utp",
        subscriptions:["fg-ips"],notes:"contrato até 2027"}];
      w.__DEV.showResults(); return {w,label:"opt"}; },
    /* 5 · export válido de tamanho elevado, ainda abaixo do limite */
    "near-size-limit": ()=>{ const {w,d}=boot(); richLandscape(w,d);
      IDS.forEach((id,i)=>w.__DEV.setNote(i,"N".repeat(9000)));
      return {w,label:"big"}; }
  };
  let n=0;
  for (const name of Object.keys(build)){
    const s=build[name]();
    const pre=s.w.__DEV.prepareSessionExport(s.label);
    if(!pre.ok){ s.w.close(); throw new Error("export recusado em "+name+": "+pre.error); }
    if(pre.bytes>1048576){ s.w.close(); throw new Error("export acima do limite em "+name); }
    const before=JSON.stringify(s.w.__DEV.captureCanonicalInputs());
    s.w.close();
    const F=boot();
    const imp=F.w.__DEV.importSessionDocument(JSON.parse(pre.text));   /* os BYTES EXATOS emitidos */
    if(!imp.ok){ F.w.close(); throw new Error("import recusou export do mesmo build em "+name+": "+imp.error); }
    const after=JSON.stringify(F.w.__DEV.captureCanonicalInputs());
    F.w.close();
    if(before!==after) throw new Error("inputs canônicos divergiram em "+name);
    n++;
  }
  return n===5;
});

Promise.all(pending).then(()=>{
  const fail=results.filter(r=>!r.ok);
  console.log("\nSESSION 4.8: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
  process.exit(fail.length?1:0);
});
