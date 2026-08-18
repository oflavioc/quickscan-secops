/* ============================================================================
   TESTES DE UI · PHASE 3.2 — Recommendation Context UI (jsdom)
   Não substituem as suítes congeladas; consomem apenas o DOM gerado a partir
   do RECOMMENDATION_CONTEXT do engine congelado.
   ============================================================================ */
const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");
const HTML = fs.readFileSync(path.join(__dirname, "quickscan_secops_soccmm_v3_2_dev.html"), "utf8");
const IDS = ["mandate","governance","policies","team-capacity","training","knowledge",
  "incident-response","detection-lifecycle","automation","logs","endpoint",
  "network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){
  const dom = new JSDOM(HTML, { runScripts:"dangerously", pretendToBeVisual:true, url:"https://l.test/" });
  const w = dom.window;
  return { w, d: w.document };
}
function answerAll(w, v, over){
  IDS.forEach(id => w.__DEV.setAnswerById(id, (over && id in over) ? over[id] : v));
  w.__DEV.setArq(0);
}
function saveLand(w, d, edits){
  d.querySelector("#v32cta").click();
  Object.entries(edits).forEach(([cap, spec])=>{
    const g3 = d.querySelector('details[data-gid="g3"]'); if (g3) g3.open = true;
    const pres = d.querySelector("#v32-pres-"+cap); pres.value = spec.presence;
    pres.dispatchEvent(new w.Event("change"));
    (spec.solutions||[]).forEach((s,i)=>{
      d.querySelector("#v32-add-"+cap).click();
      Object.entries(s).forEach(([f,val])=>{
        const el = d.querySelector(`#v32-sol-${cap}-${i}-${f}`); if (el) el.value = val;
      });
    });
  });
  return d;
}
const results = [];
function T(id, label, fn){
  let ok=false, err="";
  try { ok = !!fn(); } catch(e){ ok=false; err=" ["+e.message+"]"; }
  results.push({id, ok});
  console.log((ok?"PASS":"FAIL")+"  "+id+" — "+label+err);
}
const q=(d,s)=>d.querySelector(s), txt=el=>el?el.textContent:"";

T("V1","whitespace analytics → card DIRECT com FortiSIEM/FortiAnalyzer; FortiSOC ausente",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  saveLand(w,d,{ "security-analytics":{presence:"NONE"} });
  q(d,"#v32save").click();
  const direct = txt(q(d,"#v32direct"));
  return direct.includes("FortiSIEM") && direct.includes("FortiAnalyzer") &&
    direct.includes("aquisição candidata") && !txt(q(d,"#v32support")).includes("FortiSOC");
});
T("V2","capability priorizada aparece na seção de prioridades, antes das demais",()=>{
  const {w,d} = boot(); answerAll(w,1,{endpoint:0, logs:0});
  w.__DEV.setPriorities(["endpoint"]); w.__DEV.showResults();
  saveLand(w,d,{ "endpoint-detection":{presence:"NONE"}, "security-analytics":{presence:"NONE"} });
  q(d,"#v32save").click();
  const prio = q(d,"#v32prio"), sup = txt(q(d,"#v32support"));
  const prioHasEndpoint = prio && txt(prio).includes("endpoint") || (prio && txt(prio).includes("Detecção e resposta em endpoint"));
  const order = sup.indexOf("Detecção e resposta em endpoint") < sup.indexOf("Analytics de segurança");
  return prio && prioHasEndpoint && txt(prio).includes("prioridade declarada") && order;
});
T("V3","gap de incidentes → serviços de Preparação com tag FortiPoints confirmada",()=>{
  const {w,d} = boot(); answerAll(w,1,{"incident-response":0}); w.__DEV.showResults();
  saveLand(w,d,{ "incident-management":{presence:"NONE"} });
  q(d,"#v32save").click();
  const sup = txt(q(d,"#v32support"));
  return sup.includes("Incident Response Plan Development") && sup.includes("Preparação") &&
    sup.includes("FortiPoints · elegibilidade confirmada") &&
    !sup.includes("Digital Forensics");
});
T("V4","nota arquitetural: Rota B com SaaS ok; apenas Rota A com SaaS proibido",()=>{
  const mk = saas => {
    const {w,d} = boot(); answerAll(w,1,{logs:0, automation:0}); w.__DEV.showResults();
    d.querySelector("#v32cta").click();
    ["security-analytics","security-automation"].forEach((cap,ix)=>{
      const pres = d.querySelector("#v32-pres-"+cap); pres.value="PRESENT";
      pres.dispatchEvent(new w.Event("change"));
      d.querySelector("#v32-add-"+cap).click();
      d.querySelector(`#v32-sol-${cap}-0-vendor`).value = ix ? "VendorB" : "VendorA";
      d.querySelector(`#v32-sol-${cap}-0-product`).value = ix ? "SOAR-B" : "SIEM-A";
      d.querySelector(`#v32-sol-${cap}-0-status`).value = "production";
    });
    d.querySelector("#v32-arch-unifiedPlatformPreference").value = "unified";
    d.querySelector("#v32-arch-saasAllowed").value = saas;
    d.querySelector("#v32save").click();
    return txt(q(d,"#v32arch-note"));
  };
  const withB = mk("yes"), onlyA = mk("no");
  return withB.includes("Rota B") && withB.includes("FortiSOC") &&
    onlyA.includes("Rota A") && !onlyA.includes("Rota B");
});
T("V5","FortiSOC declarado: card de automation sem FortiSOAR, com nota de plataforma",()=>{
  const {w,d} = boot(); answerAll(w,1,{automation:0}); w.__DEV.showResults();
  saveLand(w,d,{ "soc-platform":{presence:"PRESENT", solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]},
                 "security-automation":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="security-automation");
  return card && !txt(card).includes("FortiSOAR") && txt(card).includes("plataforma unificada declarada");
});
T("V6","camada comercial terminal: FortiFlex NÃO afirmado no card do FortiSIEM",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  saveLand(w,d,{ "security-analytics":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="security-analytics");
  return card && txt(card).includes("FortiSIEM") && !txt(card).includes("FortiFlex");
});
T("V7","sinal declarado: FortiDLP como 'habilitado por sinal', nunca aquisição direta",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const g3 = d.querySelector('details[data-gid="g3"]'); g3.open = true;
  const pres = d.querySelector("#v32-pres-data-loss-prevention"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  const sg = d.querySelector('details[data-gid="sig"]'); sg.open = true;
  d.querySelector("#v32-sig-dataLeakageConcern").checked = true;
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="data-loss-prevention");
  return card && txt(card).includes("FortiDLP") && txt(card).includes("habilitado por sinal") &&
    !txt(card).includes("aquisição candidata");
});

/* ===== [3.2.1] Conformance ===== */
T("V8","VALIDATE nunca some: evidência insuficiente → card em 'A validar', zero produto",()=>{
  const {w,d} = boot();
  ["mandate","logs","endpoint","automation","training"].forEach((id,i)=>w.__DEV.setAnswerById(id, id==="logs"?0:1));
  w.__DEV.setArq(0); w.__DEV.showResults();          /* só 5 respostas → suficiência falsa */
  saveLand(w,d,{ "security-analytics":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('#v32validate .v32-card'))
    .find(c=>c.getAttribute("data-cap")==="security-analytics");
  return card && txt(card).includes("evidência de maturidade insuficiente") &&
    !txt(card).includes("aquisição candidata") && !txt(card).includes("FortiSIEM");
});
T("V9","VALIDATE nunca some: tecnologia UNKNOWN → card visível em 'A validar'",()=>{
  const {w,d} = boot(); answerAll(w,1,{"network-visibility":0}); w.__DEV.showResults();
  saveLand(w,d,{ "network-detection":{presence:"UNKNOWN"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('#v32validate .v32-card'))
    .find(c=>c.getAttribute("data-cap")==="network-detection");
  return card && txt(card).includes("Precisa ser validado");
});
T("V10","prioridade nunca desaparece: logs priorizado + analytics UNSET + FortiSAT PRESENT → Leitura base",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0});
  w.__DEV.setPriorities(["logs"]); w.__DEV.showResults();
  saveLand(w,d,{ "human-risk":{presence:"PRESENT", solutions:[{vendor:"Fortinet",product:"FortiSAT",status:"production"}]} });
  q(d,"#v32save").click();
  const prio = q(d,"#v32prio");   /* [3.2.2-A] prioridade vive no primeiro bloco */
  const card = prio && Array.from(prio.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")==="security-analytics");
  return card && txt(card).includes("prioridade declarada") &&
    txt(card).includes("nenhum produto é inferido sem contexto") &&
    !txt(card).includes("FortiSIEM") && !q(d,"#v32direct");
});
T("V11","registry fix: Governança do SOC não aparece no editor de Landscape",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  return !q(d,"#v32-pres-soc-governance") &&
    !Object.keys(w.__DEV.V32.TECH_LANDSCAPE).includes("soc-governance");
});
T("V12","ofertas e serviços separados por subtítulos quando ambos existem",()=>{
  const {w,d} = boot(); answerAll(w,1,{"incident-response":0}); w.__DEV.showResults();
  saveLand(w,d,{ "incident-management":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="incident-management");
  const subs = Array.from(card.querySelectorAll(".v32-subhead")).map(s=>txt(s).trim());
  return subs.includes("TECNOLOGIA — OFERTAS".toUpperCase()) || subs.some(s=>/ofertas/i.test(s)) ?
    (subs.some(s=>/ofertas/i.test(s)) && subs.some(s=>/serviços/i.test(s)) &&
     txt(card).includes("FortiSOAR") && txt(card).includes("Incident Response Plan Development")) : false;
});
T("V13","enums/IDs internos localizados: sem 'confirmed'/'dataLeakageConcern' cru; PT presente",()=>{
  const {w,d} = boot(); answerAll(w,1,{"incident-response":0}); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const pres = d.querySelector("#v32-pres-incident-management"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  const sg = d.querySelector('details[data-gid="sig"]'); sg.open = true;
  d.querySelector("#v32-sig-activeIncident").checked = true;
  q(d,"#v32save").click();
  const sup = txt(q(d,"#v32support"));
  return sup.includes("elegibilidade confirmada") && !sup.includes("confirmed") &&
    sup.includes("Incidente ativo") && !sup.includes("activeIncident");
});
T("V14","'Por que apareceu' determinístico: origem, prioridade, tecnologia e classificação",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0});
  w.__DEV.setPriorities(["logs"]); w.__DEV.showResults();
  saveLand(w,d,{ "security-analytics":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="security-analytics");
  const why = card && card.querySelector(".v32-why");
  const wt = txt(why);
  const hl = w.__DEV.qLabel("logs").slice(0,25);
  return why && wt.includes(hl) && !/pergunta\(s\) logs/.test(wt) && wt.includes("gap alto") &&
    wt.includes("Prioridade declarada pelo negócio") && !wt.includes("negócio (logs)") &&
    wt.includes("ausência confirmada") && wt.includes("whitespace");
});


/* ===== [3.2.2] Final conformance ===== */
T("V15 (A)","priority-first universal: Logs (priorizada, UNSET) antes de Automação (NONE)",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0, automation:0});
  w.__DEV.setPriorities(["logs"]); w.__DEV.showResults();
  saveLand(w,d,{ "security-automation":{presence:"NONE"} });
  q(d,"#v32save").click();
  const prio = q(d,"#v32prio");
  const inPrio = prio && Array.from(prio.querySelectorAll(".v32-card")).some(c=>c.getAttribute("data-cap")==="security-analytics");
  const sup = txt(q(d,"#v32support"));
  const order = sup.indexOf("Analytics de segurança") < sup.indexOf("Automação de segurança");
  const notDup = !q(d,"#v32base") || !Array.from(q(d,"#v32base").querySelectorAll(".v32-card")).some(c=>c.getAttribute("data-cap")==="security-analytics");
  const hasWhy = prio && prio.querySelector(".v32-why");
  return inPrio && order && notDup && hasWhy;
});
T("V16 (B)","Governança (sem Landscape): SOC Assessment renderizado; nunca pede contexto",()=>{
  const {w,d} = boot(); answerAll(w,1,{mandate:0}); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const sg = d.querySelector('details[data-gid="sig"]'); sg.open = true;
  d.querySelector("#v32-sig-wantsSOCAssessment").checked = true;
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="soc-governance");
  return card && txt(card).includes("FortiGuard SOC Assessment") &&
    txt(card).includes("não se aplica a esta capability") &&
    !txt(card).includes("Informe o contexto");
});
T("V17 (B)","Competências (sem Landscape): IR Training renderizado; sem pedido de Landscape",()=>{
  const {w,d} = boot(); answerAll(w,1,{training:0}); w.__DEV.showResults();
  saveLand(w,d,{ "deception":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="soc-skills");
  return card && txt(card).includes("Incident Response Training") &&
    txt(card).includes("não se aplica") && !txt(card).includes("Informe o contexto");
});
T("V18 (B)","Staffing: SOCaaS como managed-service contextual; MDR ausente sem base",()=>{
  const {w,d} = boot(); answerAll(w,1,{"team-capacity":0}); w.__DEV.showResults();
  saveLand(w,d,{ "deception":{presence:"NONE"} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="soc-staffing");
  return card && txt(card).includes("FortiGuard SOCaaS") && !txt(card).includes("MDR") &&
    !q(d,"#v32-pres-soc-staffing");
});
T("V19 (C)","MDR com deployment não informado: 'Elegibilidade técnica: validar deployment' separada do FortiPoints",()=>{
  const {w,d} = boot(); answerAll(w,1,{endpoint:0}); w.__DEV.showResults();
  saveLand(w,d,{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production"}]} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="endpoint-detection");
  const elig = card && card.querySelector(".v32-elig");
  return card && txt(card).includes("FortiGuard MDR") && elig &&
    txt(elig).includes("validar deployment da base") &&
    !txt(elig).includes("FortiPoints");
});
T("V20 (C)","contraprova: FortiEDR on-prem → MDR ausente do card",()=>{
  const {w,d} = boot(); answerAll(w,1,{endpoint:0}); w.__DEV.showResults();
  saveLand(w,d,{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"on-prem"}]} });
  q(d,"#v32save").click();
  const card = Array.from(d.querySelectorAll('.v32-card')).find(c=>c.getAttribute("data-cap")==="endpoint-detection");
  return card && !txt(card).includes("FortiGuard MDR");
});


/* ===== [3.2.3] Semantics closure ===== */
T("V21 (B)","knowledge gap-high priorizado + NONE → 1º bloco; whitespace; zero 'aquisição candidata'",()=>{
  const {w,d} = boot(); answerAll(w,1,{knowledge:0});
  w.__DEV.setPriorities(["knowledge"]); w.__DEV.showResults();
  saveLand(w,d,{ "knowledge-management":{presence:"NONE"} });
  q(d,"#v32save").click();
  const prio = q(d,"#v32prio");
  const card = prio && Array.from(prio.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")==="knowledge-management");
  const cls = w.__DEV.ctx().contexts["knowledge-management"].classification;
  return card && cls==="TECHNOLOGY_WHITESPACE" && txt(card).includes("prioridade declarada") &&
    !txt(card).includes("aquisição candidata") &&
    txt(card).includes("apoio contextual (relação de suporte)") && txt(card).includes("FortiSOAR") &&
    card.querySelector(".v32-why");
});
T("V22 (B/C)","contraprova detection-lifecycle: prioridade preservada; FortiSIEM/FortiAI-Assist só CTX",()=>{
  const {w,d} = boot(); answerAll(w,1,{"detection-lifecycle":0});
  w.__DEV.setPriorities(["detection-lifecycle"]); w.__DEV.showResults();
  saveLand(w,d,{ "detection-engineering":{presence:"NONE"} });
  q(d,"#v32save").click();
  const prio = q(d,"#v32prio");
  const card = prio && Array.from(prio.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")==="detection-engineering");
  return card && !txt(card).includes("aquisição candidata") &&
    txt(card).includes("FortiSIEM") && txt(card).includes("FortiAI-Assist") &&
    txt(card).includes("apoio contextual (relação de suporte)") &&
    w.__DEV.ctx().contexts["detection-engineering"].classification==="TECHNOLOGY_WHITESPACE";
});


/* ===== [3.2.4] CTX routing ===== */
T("V23","knowledge gap + NONE sem prioridade → FortiSOAR SOMENTE em #v32contextual",()=>{
  const {w,d} = boot(); answerAll(w,1,{knowledge:0}); w.__DEV.showResults();
  saveLand(w,d,{ "knowledge-management":{presence:"NONE"} });
  q(d,"#v32save").click();
  const inCtx = q(d,"#v32contextual") && Array.from(q(d,"#v32contextual").querySelectorAll(".v32-card"))
    .some(c=>c.getAttribute("data-cap")==="knowledge-management" && txt(c).includes("FortiSOAR"));
  const notDirect = !q(d,"#v32direct") || !Array.from(q(d,"#v32direct").querySelectorAll(".v32-card"))
    .some(c=>c.getAttribute("data-cap")==="knowledge-management");
  return inCtx && notDirect &&
    w.__DEV.ctx().contexts["knowledge-management"].classification==="TECHNOLOGY_WHITESPACE";
});
T("V24","detection-lifecycle gap + NONE sem prioridade → FortiSIEM/FortiAI-Assist SOMENTE em #v32contextual",()=>{
  const {w,d} = boot(); answerAll(w,1,{"detection-lifecycle":0}); w.__DEV.showResults();
  saveLand(w,d,{ "detection-engineering":{presence:"NONE"} });
  q(d,"#v32save").click();
  const ctxBlock = q(d,"#v32contextual");
  const card = ctxBlock && Array.from(ctxBlock.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")==="detection-engineering");
  const notDirect = !q(d,"#v32direct") || !Array.from(q(d,"#v32direct").querySelectorAll(".v32-card"))
    .some(c=>c.getAttribute("data-cap")==="detection-engineering");
  return card && txt(card).includes("FortiSIEM") && txt(card).includes("FortiAI-Assist") && notDirect;
});
T("V25","contraprovas: endpoint NONE+cloud e analytics NONE permanecem em Apoio direto",()=>{
  const {w,d} = boot(); answerAll(w,1,{endpoint:0, logs:0}); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  ["endpoint-detection","security-analytics"].forEach(cap=>{
    const pres = d.querySelector("#v32-pres-"+cap); pres.value="NONE";
    pres.dispatchEvent(new w.Event("change"));
  });
  d.querySelector("#v32-arch-saasAllowed").value = "yes";
  q(d,"#v32save").click();
  const direct = q(d,"#v32direct");
  const caps = direct ? Array.from(direct.querySelectorAll(".v32-card")).map(c=>c.getAttribute("data-cap")) : [];
  return caps.includes("endpoint-detection") && caps.includes("security-analytics") &&
    txt(direct).includes("aquisição candidata");
});

const fail = results.filter(r=>!r.ok);
console.log("\nUI 3.2: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
