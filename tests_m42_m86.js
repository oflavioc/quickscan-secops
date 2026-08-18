/* ============================================================================
   TESTES M42–M86 · Engine V3.2 (funções puras; sem UI)
   Fixture da Camada 1: réplica exata da semântica V3.1.3 —
   resposta 0 → sev 2 · resposta 1 → sev 1 · respostas 2/3 → sev 0 (todas as 15).
   ============================================================================ */
const path = require("path"), fs = require("fs"), crypto = require("crypto");
const V = require(path.join(__dirname, "engine_v32.js"));
const QIDS = ["mandate","governance","policies","team-capacity","training","knowledge",
  "incident-response","detection-lifecycle","automation","logs","endpoint",
  "network-visibility","monitoring-coverage","external-surface","vulnerability-management"];

let ANS = {}, PRIO = [], SUFF = true;
V.configure({
  answerOf: q => (q in ANS ? ANS[q] : null),
  sevOf: (q, a) => (a===0 ? 2 : a===1 ? 1 : 0),
  priorityIds: () => PRIO.slice(),
  assessmentSufficient: () => SUFF
});
function setup(o){
  o = o || {};
  V.resetLandscapeToUnset();
  ANS = {}; QIDS.forEach(q => ANS[q] = 2);                 /* base madura */
  SUFF = (o.suff !== undefined) ? o.suff : true;
  Object.assign(ANS, o.ans || {});
  PRIO = o.prio || [];
  if (o.land) Object.entries(o.land).forEach(([k,v]) => Object.assign(V.TECH_LANDSCAPE[k], v));
  if (o.arch) Object.assign(V.ARCHITECTURE_CONTEXT, o.arch);
  if (o.sig)  Object.entries(o.sig).forEach(([k,v]) => V.SESSION_SIGNALS[k] = v);
  if (o.plat) V.PLATFORM_CONTEXT.declaredPlatforms = o.plat;
}
const R = () => V.buildRecommendationContext();
const results = [];
function T(id, label, fn){
  let ok=false, err="";
  try { ok = !!fn(); } catch(e){ ok=false; err=" ["+e.message+"]"; }
  results.push({id, ok, label});
  console.log((ok?"PASS":"FAIL")+"  "+id+" — "+label+err);
}
const has = (arr, pred) => (arr||[]).some(pred);

/* ---------------- M42–M52 (rodada Rev1/intermediária) ---------------- */
T("M42","2 soluções em produção reconhecidas; OPERATIONAL_GAP; sem substituição",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"Microsoft",product:"Sentinel",status:"production"},{vendor:"Fortinet",product:"FortiAnalyzer",status:"production"}]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="OPERATIONAL_GAP" && c.supportMode==="CONTEXTUAL" && c.candidates.length===0 &&
    V.TECH_LANDSCAPE["security-analytics"].solutions.length===2;
});
T("M43","maturidade imune a edições do Landscape (proxy do engine; parte de UI pendente)",()=>{
  setup({ ans:{logs:0} });
  const before = JSON.stringify(V.maturityStateOf("security-analytics"));
  Object.assign(V.TECH_LANDSCAPE["security-analytics"], {presence:"PRESENT",
    solutions:[{vendor:"X",product:"Y",status:"production"}]});
  return JSON.stringify(V.maturityStateOf("security-analytics"))===before;
});
T("M44","NDR: gap + NONE + arquitetura unknown → família 'a definir', nenhuma variante",()=>{
  setup({ ans:{"network-visibility":0}, land:{ "network-detection":{presence:"NONE"} }});
  const c = R().contexts["network-detection"];
  return c.classification==="TECHNOLOGY_WHITESPACE" &&
    has(c.candidates, x=>x.itemId==="ndr-family" && /a definir/.test(x.variantResolution)) &&
    !has(c.candidates, x=>x.itemId==="fortindr-cloud"||x.itemId==="fortindr-onprem");
});
T("M45","validateConfig detecta erros semeados (órfãs, policy, enum, unified DIRECT)",()=>{
  setup({});
  V.OFFERINGS.__bad = { name:"Bad", entityType:"offering", deliveryType:"product", family:"nao-existe",
    variantOf:null, architectureRole:"unified-platform", deployment:["marte"],
    capabilityRelations:[{capability:"nao-existe",relation:"primary"}], solutionAreaRelations:[],
    architectureRequires:null, recommendationPolicy:"direct-when-gap-and-whitespace",
    requiredSignals:["sinal-fantasma"], contextAnchor:false, commercialOptions:[] };
  const errs = V.validateConfigV32();
  delete V.OFFERINGS.__bad;
  const hits = ["family órfã","deployment fora do enum","capability órfã","sinal inexistente","unified-platform com policy DIRECT"];
  return hits.every(h => errs.some(e => e.includes(h))) && V.validateConfigV32().length===0;
});
T("M46","gap priorizado + PARTIAL/evaluation → avaliação em curso; aquisição suprimida",()=>{
  setup({ ans:{logs:0}, prio:["logs"], land:{ "security-analytics":{presence:"PARTIAL",
    solutions:[{vendor:"V",product:"SIEM-X",status:"evaluation"}]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="EVALUATION_IN_PROGRESS" && c.candidates.length===0 &&
    c.businessPriority.flag===true;
});
T("M47","FortiSOC PRESENT + gap automation → FortiSOAR standalone suprimido (M22)",()=>{
  setup({ ans:{automation:0}, land:{
    "soc-platform":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]},
    "security-automation":{presence:"NONE"} }});
  const c = R().contexts["security-automation"];
  return !has(c.candidates,x=>x.itemId==="fortisoar") && c.supportMode==="CONTEXTUAL" &&
    c.notes.some(n=>/plataforma/.test(n));
});
T("M48","human-risk: FortiSAT PRESENT → registro; sem recomendação; maturidade not-assessed",()=>{
  setup({ land:{ "human-risk":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSAT",status:"production"}]}}});
  const c = R().contexts["human-risk"];
  return c.classification==="UNASSESSED_CAPABILITY" && c.candidates.length===0 &&
    c.maturity.state==="not-assessed";
});
T("M49","base FortiEDR VERBATIM; gap → OPERATIONAL_GAP; nova aquisição suprimida",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production"}]}}});
  const c = R().contexts["endpoint-detection"];
  return V.TECH_LANDSCAPE["endpoint-detection"].solutions[0].product==="FortiEDR" &&
    c.classification==="OPERATIONAL_GAP" && !has(c.candidates,x=>x.itemId==="fortiendpoint");
});
T("M50","FortiEDR prod + gap → FortiXDR só como extensão contextual; nunca 'compre FortiEndpoint'",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production"}]}}});
  const c = R().contexts["endpoint-detection"];
  return has(c.candidates,x=>x.itemId==="fortixdr" && x.itemKind==="contextual-extension") &&
    !has(c.candidates,x=>x.itemId==="fortiendpoint");
});
T("M51","WSS: componentes não confirmados não geram gap/inferência (engine)",()=>{
  setup({ land:{ "email-threat-protection":{presence:"PARTIAL",
    solutions:[{vendor:"Fortinet",product:"FortiMail Cloud SaaS",status:"production",coverage:"ICES"}]}}});
  const c = R().contexts["email-threat-protection"];
  return c.classification==="UNASSESSED_CAPABILITY" && c.candidates.length===0 && c.maturity.state==="not-assessed";
});
T("M52","TI = NONE (+ external-surface madura) → UNASSESSED; nenhum estado via external-surface",()=>{
  setup({ ans:{"external-surface":3}, land:{ "threat-intelligence":{presence:"NONE"} }});
  const c = R().contexts["threat-intelligence"];
  return c.classification==="UNASSESSED_CAPABILITY" && c.maturity.state==="not-assessed" && c.candidates.length===0;
});

/* ---------------- M53–M77 (spec Rev2-final) ---------------- */
T("M53","FortiEDR production verbatim; sem forçar FortiEndpoint (idem M49/M50)",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production"}]}}});
  const c = R().contexts["endpoint-detection"];
  return c.classification==="OPERATIONAL_GAP" && !has(c.candidates,x=>x.itemId==="fortiendpoint");
});
T("M54","gap+NONE+on-prem/air-gap (saas=no, local=yes) → FortiEDR avaliável; FortiEndpoint excluído",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} },
    arch:{ saasAllowed:"no", localProcessingRequired:"yes" }});
  const c = R().contexts["endpoint-detection"];
  return has(c.candidates,x=>x.itemId==="fortiedr") && !has(c.candidates,x=>x.itemId==="fortiendpoint");
});
T("M55","gap+NONE+cloud/unified (saas=yes) → FortiEndpoint candidato",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} }, arch:{ saasAllowed:"yes" }});
  const c = R().contexts["endpoint-detection"];
  return has(c.candidates,x=>x.itemId==="fortiendpoint" && x.variantResolution==="atende");
});
T("M56","Sentinel production + segundo SIEM deploying → OPERATIONAL_GAP (nunca ADOPTION)",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"Microsoft",product:"Sentinel",status:"production"},{vendor:"V2",product:"SIEM-B",status:"deploying"}]}}});
  return R().contexts["security-analytics"].classification==="OPERATIONAL_GAP";
});
T("M57","2 tecnologias em segmentos distintos → PARTIAL/COVERAGE mesmo PRESENT",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"A",product:"EDR-A",status:"production",coverage:"datacenter"},
               {vendor:"B",product:"EDR-B",status:"production",coverage:"filiais"}]}}});
  return R().contexts["endpoint-detection"].classification==="COVERAGE_GAP";
});
T("M58","IM gap + activeIncident=false → readiness/plan/playbook/TTX sim; DFIR não",()=>{
  setup({ ans:{"incident-response":0}, sig:{ activeIncident:false }});
  const s = R().contexts["incident-management"].services;
  return ["ir-readiness-subscription","ir-plan-development","ir-playbook-development","ttx"]
    .every(id=>has(s,x=>x.serviceId===id)) && !has(s,x=>x.serviceId==="dfir");
});
T("M59","activeIncident=true → DFIR avaliável",()=>{
  setup({ ans:{"incident-response":0}, sig:{ activeIncident:true }});
  return has(R().contexts["incident-management"].services, x=>x.serviceId==="dfir");
});
T("M60","suspectedCompromise=true → Compromise Assessment contextualizado",()=>{
  setup({ sig:{ suspectedCompromise:true }});
  return has(R().contexts["detection-engineering"].services, x=>x.serviceId==="compromise-assessment");
});
T("M61","ransomwareConcern=true sem incidente → RRA sim; DFIR não",()=>{
  setup({ sig:{ ransomwareConcern:true }});
  const s = R().contexts["incident-management"].services;
  return has(s,x=>x.serviceId==="ransomware-readiness-assessment") && !has(s,x=>x.serviceId==="dfir");
});
T("M62","DLP Service licenciado (ENT) + concern → adoção/configuração; sem recompra",()=>{
  setup({ sig:{ dataLeakageConcern:true }, land:{ "data-loss-prevention":{presence:"NONE"} },
    plat:[{platform:"fortigate", bundle:"ent"}]});
  const r = R(); const c = r.contexts["data-loss-prevention"];
  return r.licensedContext["data-loss-prevention"].includes("fg-dlp-service") &&
    c.candidates.length===0 && c.notes.some(n=>/M62/.test(n));
});
T("M63","FortiDLP PRESENT → Landscape registra; maturidade inalterada (not-assessed)",()=>{
  setup({ land:{ "data-loss-prevention":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiDLP",status:"production"}]}}});
  const c = R().contexts["data-loss-prevention"];
  return c.maturity.state==="not-assessed" && c.classification==="UNASSESSED_CAPABILITY";
});
T("M64","DLP NONE sem sinal → nenhuma recomendação (inventário)",()=>{
  setup({ land:{ "data-loss-prevention":{presence:"NONE"} }});
  const c = R().contexts["data-loss-prevention"];
  return c.supportMode==="INVENTORY" && c.candidates.length===0;
});
T("M65","DLP NONE + dataLeakageConcern → contextualização por sinal; nunca DIRECT",()=>{
  setup({ sig:{ dataLeakageConcern:true }, land:{ "data-loss-prevention":{presence:"NONE"} }});
  const c = R().contexts["data-loss-prevention"];
  return c.supportMode==="CONTEXTUAL" &&
    has(c.candidates,x=>x.itemId==="fortidlp" && x.relation==="contextual-by-signal") &&
    c.supportMode!=="DIRECT";
});
T("M66","FortiFlex/FortiPoints só APÓS recomendação técnica; nunca cria contexto",()=>{
  setup({ ans:{"incident-response":0}, sig:{ activeIncident:true }, land:{ "data-loss-prevention":{presence:"NONE"} }});
  const r = R();
  const svc = r.contexts["incident-management"].services.find(x=>x.serviceId==="dfir");
  const dlp = r.contexts["data-loss-prevention"];
  return svc && has(svc.commercialOptions||[], o=>o.program==="fortipoints" && o.eligibility==="confirmed") &&
    dlp.supportMode==="INVENTORY" && dlp.candidates.length===0;
});
T("M67","elegibilidade FortiFlex não confirmada → não afirmada no candidato",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }});
  const c = R().contexts["security-analytics"];
  const siem = c.candidates.find(x=>x.itemId==="fortisiem");
  return siem && !(siem.commercialOptions||[]).some(o=>o.program==="fortiflex");
});
T("M68","wantsSOCAssessment=true → SOC Assessment como next step; maturidade intacta",()=>{
  setup({ ans:{mandate:0}, sig:{ wantsSOCAssessment:true }});
  const c = R().contexts["soc-governance"];
  return has(c.services,x=>x.serviceId==="soc-assessment") && c.maturity.state==="gap-high";
});
T("M69","FortiAI-Assist nunca é SKU de aquisição (policy landscape-only)",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }});
  const c = R().contexts["security-analytics"];
  return V.OFFERINGS["fortiai-assist"].recommendationPolicy!=="direct-when-gap-and-whitespace" &&
    !has(c.candidates,x=>x.itemId==="fortiai-assist");
});
T("M70","shadowAIConcern → FortiDLP/Protect contextualizados; sem finding SOC-CMM",()=>{
  setup({ sig:{ shadowAIConcern:true }, land:{ "data-loss-prevention":{presence:"NONE"} }});
  const c = R().contexts["data-loss-prevention"];
  return c.supportMode==="CONTEXTUAL" && has(c.candidates,x=>x.itemId==="fortidlp") &&
    c.maturity.state==="not-assessed";
});
T("M71","usesPrivateLLMs + aiRuntimeSecurityConcern → FortiAIGate contextual",()=>{
  setup({ sig:{ usesPrivateLLMs:true, aiRuntimeSecurityConcern:true },
    land:{ "ai-runtime-security":{presence:"NONE"} }});
  const c = R().contexts["ai-runtime-security"];
  return c.supportMode==="CONTEXTUAL" && has(c.candidates,x=>x.itemId==="fortiaigate" && x.relation==="contextual-by-signal");
});
T("M72","FortiAIGate ausente + nenhum AI signal → nenhuma recomendação",()=>{
  setup({ land:{ "ai-runtime-security":{presence:"NONE"} }});
  const c = R().contexts["ai-runtime-security"];
  return c.candidates.length===0 && c.supportMode==="INVENTORY";
});
T("M73","FortiAIGate PRESENT → registro; SOC maturity inalterada",()=>{
  setup({ land:{ "ai-runtime-security":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiAIGate",status:"production"}]}}});
  const c = R().contexts["ai-runtime-security"];
  return c.maturity.state==="not-assessed" && c.classification==="UNASSESSED_CAPABILITY";
});
T("M74","FortiDLP: 1 entrada, múltiplas solutionAreaRelations; sem duplicação de candidato",()=>{
  setup({ sig:{ dataLeakageConcern:true }, land:{ "data-loss-prevention":{presence:"NONE"} }});
  const rels = V.OFFERINGS.fortidlp.solutionAreaRelations;
  const c = R().contexts["data-loss-prevention"];
  return rels.length===2 && rels.some(r=>r.solutionArea==="fortiai-protect"&&r.relation==="primary") &&
    rels.some(r=>r.solutionArea==="fortiai-secureai"&&r.relation==="supporting") &&
    c.candidates.filter(x=>x.itemId==="fortidlp").length===1;
});
T("M75","FortiSOC PRESENT: supressão machine-readable + gap operacional explicável",()=>{
  setup({ ans:{logs:0,automation:0}, land:{
    "soc-platform":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]},
    "security-analytics":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]},
    "security-automation":{presence:"NONE"} }});
  const r = R();
  const an = r.contexts["security-analytics"], au = r.contexts["security-automation"];
  return an.classification==="OPERATIONAL_GAP" && an.notes.some(n=>/M75|plataforma/.test(n)) &&
    au.candidates.length===0;
});
T("M76","prioridades múltiplas convergem: capability consolida sem apagar fontes",()=>{
  setup({ ans:{mandate:1,policies:1}, prio:["mandate","policies"], land:{ "knowledge-management":{presence:"NONE"} } });  /* sai do legacy p/ observar a projeção */
  const bp = R().contexts["soc-governance"].businessPriority;
  return bp.flag===true && bp.priorityFindingIds.join(",")==="mandate,policies";
});
T("M77","precedência maturityStateOf (high+moderate+mature) com fontes preservadas",()=>{
  setup({ ans:{mandate:0, governance:1, policies:2} });
  const m = V.maturityStateOf("soc-governance");
  return m.state==="gap-high" && m.stateSourceFindingIds.join(",")==="mandate" &&
    m.allFindingIds.join(",")==="mandate,governance" && m.hasUnknowns===false;
});

/* ---------------- M78–M86 (Errata 1 + 1.1) ---------------- */
T("M78","PRESENT sem status → TECH_STATUS_UNVERIFIED; sem candidatos; pedido de status",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT", solutions:[]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="TECH_STATUS_UNVERIFIED" && c.flags.statusUnverified===true &&
    c.candidates.length===0 && c.supportMode==="VALIDATE";
});
T("M79","gap + só evaluation → EVALUATION_IN_PROGRESS (não ADOPTION_GAP)",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"V",product:"SIEM-X",status:"evaluation"}]}}});
  return R().contexts["security-analytics"].classification==="EVALUATION_IN_PROGRESS";
});
T("M80","maduro + contracted → TECH_TRANSITION (não MATURE_WITH_TECH)",()=>{
  setup({ land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"V",product:"SIEM-Y",status:"contracted"}]}}});
  return R().contexts["security-analytics"].classification==="TECH_TRANSITION";
});
T("M81","PLATFORM_CONTEXT deriva licensedContext (ENT → fg-dlp-service); sem bundle no Landscape",()=>{
  setup({ plat:[{platform:"fortigate", bundle:"ent"}] });
  const lic = V.deriveLicensedContext();
  return lic["data-loss-prevention"].includes("fg-dlp-service") &&
    lic["malware-analysis"].includes("fg-sandbox-saas") &&
    !("declaredBundle" in V.TECH_LANDSCAPE["data-loss-prevention"]);
});
T("M82","validador: deliveryType composto · bundle inválido · labs-advisory nunca candidato · relations vazias",()=>{
  setup({});
  V.OFFERINGS.__c1 = Object.assign({}, V.OFFERINGS.fortisiem, { name:"C1", deliveryType:"product/saas" });
  V.OFFERINGS.__c2 = Object.assign({}, V.OFFERINGS.fortisiem, { name:"C2", capabilityRelations:[], contextAnchor:false });
  V.BUNDLES.__b = { entityType:"bundle", name:"B", appliesTo:"fortigate", includesSubscriptions:["nao-existe"] };
  const errs = V.validateConfigV32();
  delete V.OFFERINGS.__c1; delete V.OFFERINGS.__c2; delete V.BUNDLES.__b;
  const notCandidate = !Object.keys(V.SERVICES).includes("fortiguard-labs-advisory") &&
    !!V.SERVICE_FAMILIES["fortiguard-labs-advisory"];
  return errs.some(e=>e.includes("deliveryType inválido/composto")) &&
    errs.some(e=>e.includes("subscription inexistente")) &&
    errs.some(e=>e.includes("capabilityRelations vazia")) && notCandidate &&
    V.validateConfigV32().length===0;
});
T("M83","stateSourceFindingIds ≠ allFindingIds (cf. M77) e distinção preservada no contexto",()=>{
  setup({ ans:{mandate:0, governance:1, policies:2}, land:{ "knowledge-management":{presence:"NONE"} } });
  const m = R().contexts["soc-governance"].maturity;
  return m.stateSourceFindingIds.length===1 && m.allFindingIds.length===2 &&
    m.stateSourceFindingIds[0]==="mandate";
});
T("M84","FortiEDR on-prem/air-gapped → FortiGuard MDR NÃO elegível; razão explicável",()=>{
  setup({ ans:{endpoint:0,"monitoring-coverage":0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"on-prem"}]}}});
  const el = V.serviceEligibility("fortiguard-mdr");
  const s = R().contexts["endpoint-detection"].services;
  return el.eligible===false && /não elegíveis/.test(el.reason) && !has(s,x=>x.serviceId==="fortiguard-mdr");
});
T("M84b","FortiEDR cloud → MDR elegível (contraprova)",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"cloud"}]}}});
  return V.serviceEligibility("fortiguard-mdr").eligible===true &&
    has(R().contexts["endpoint-detection"].services, x=>x.serviceId==="fortiguard-mdr");
});
T("M85","condição quádrupla: PLATFORM_CONTEXT declarado sai do legacy; default é legacy",()=>{
  setup({});
  const legacyDefault = V.isLegacyModeV32()===true && R().legacyMode===true;
  setup({ plat:[{platform:"fortigate", bundle:"atp"}] });
  return legacyDefault && V.isLegacyModeV32()===false && R().legacyMode===false;
});
T("M86","validador: family com serviceType · reactive sem sinais · exclude fora do enum · E13 no motor",()=>{
  setup({});
  V.SERVICE_FAMILIES["fortiguard-labs-advisory"].serviceType = "advisory";
  V.SERVICES.__r = { name:"R", serviceType:"reactive-service", lifecycle:"respond",
    engagementModel:"service-points", requiredSignals:[], eligibilityRequires:{baseOffering:["fortiedr"],baseDeploymentExcludes:["lua"]},
    capabilityRelations:[], commercialOptions:[] };
  const errs = V.validateConfigV32();
  delete V.SERVICE_FAMILIES["fortiguard-labs-advisory"].serviceType;
  delete V.SERVICES.__r;
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT", solutions:[]}}});
  const e13 = R().contexts["security-analytics"].classification!=="OPERATIONAL_GAP";
  return errs.some(e=>e.includes("family com serviceType")) &&
    errs.some(e=>e.includes("reactive-service sem requiredSignals")) &&
    errs.some(e=>e.includes("exclude fora do enum")) && e13 &&
    V.validateConfigV32().length===0;
});


/* ================= MAPA M1–M40 · casos ENGINE implementados agora =================
   LEGACY (cobertos pelo harness M41/snapshot): M1, M2, M29.
   UI-only (pendentes p/ fase de UI): M11(string de exibição — lógica testada), M15(exibição no
   Landscape — registro testado), M28(ordenação do 1º nível na tela — projeção testada em M76).
   Todos os demais: ENGINE, abaixo, com IDs originais preservados. */
T("M3","logs ruins + SIEM UNSET → CONTEXT_NOT_INFORMED (não whitespace)",()=>{
  setup({ ans:{logs:0}, sig:{ wantsSOCAssessment:false } });  /* sai do legacy sem tocar landscape core */
  return R().contexts["security-analytics"].classification==="CONTEXT_NOT_INFORMED";
});
T("M4","logs ruins + SIEM NONE (+evidência suficiente) → TECHNOLOGY_WHITESPACE",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }});
  return R().contexts["security-analytics"].classification==="TECHNOLOGY_WHITESPACE";
});
T("M5","logs ruins + Sentinel produção → OPERATIONAL_GAP; sem substituição",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"Microsoft",product:"Sentinel",status:"production"}]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="OPERATIONAL_GAP" && c.candidates.length===0;
});
T("M6","logs ruins + FortiSIEM presente → gap operacional; sem recompra",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiSIEM",status:"production"}]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="OPERATIONAL_GAP" && !has(c.candidates,x=>x.itemId==="fortisiem");
});
T("M7","automação ruim + Cortex XSOAR → sem troca automática por FortiSOAR",()=>{
  setup({ ans:{automation:0}, land:{ "security-automation":{presence:"PRESENT",
    solutions:[{vendor:"Palo Alto",product:"Cortex XSOAR",status:"production"}]}}});
  const c = R().contexts["security-automation"];
  return c.classification==="OPERATIONAL_GAP" && !has(c.candidates,x=>x.itemId==="fortisoar");
});
T("M8","automação ruim + FortiSOAR contratado → ADOPTION_GAP",()=>{
  setup({ ans:{automation:0}, land:{ "security-automation":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiSOAR",status:"contracted"}]}}});
  return R().contexts["security-automation"].classification==="ADOPTION_GAP";
});
T("M9","NDR ruim + NONE + SaaS permitido → FortiNDR Cloud candidato",()=>{
  setup({ ans:{"network-visibility":0}, land:{ "network-detection":{presence:"NONE"} }, arch:{ saasAllowed:"yes" }});
  return has(R().contexts["network-detection"].candidates, x=>x.itemId==="fortindr-cloud");
});
T("M10","NDR ruim + NONE + processamento local/OT → FortiNDR On-Premises candidato",()=>{
  setup({ ans:{"network-visibility":0}, land:{ "network-detection":{presence:"NONE"} },
    arch:{ localProcessingRequired:"yes", otIsolated:"yes", saasAllowed:"no" }});
  const c = R().contexts["network-detection"].candidates;
  return has(c,x=>x.itemId==="fortindr-onprem") && !has(c,x=>x.itemId==="fortindr-cloud");
});
T("M12","NDR madura + NONE → POSSIBLE_CONTEXT_DIVERGENCE; sem recomendação",()=>{
  setup({ land:{ "network-detection":{presence:"NONE"} }});
  const c = R().contexts["network-detection"];
  return c.classification==="POSSIBLE_CONTEXT_DIVERGENCE" && c.candidates.length===0;
});
T("M14","deception NONE sem sinal → sem FortiDeceptor (inventário)",()=>{
  setup({ land:{ "deception":{presence:"NONE"} }});
  const c = R().contexts["deception"];
  return c.supportMode==="INVENTORY" && c.candidates.length===0;
});
T("M15","FortiDeceptor presente → registrado; score inalterado (not-assessed)",()=>{
  setup({ land:{ "deception":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiDeceptor",status:"production"}]}}});
  const c = R().contexts["deception"];
  return c.maturity.state==="not-assessed" && V.TECH_LANDSCAPE["deception"].solutions[0].product==="FortiDeceptor";
});
T("M17","FortiAuthenticator/FortiToken presentes → registro; SOC maturity inalterada",()=>{
  setup({ land:{ "identity-access":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiAuthenticator",status:"production"},{vendor:"Fortinet",product:"FortiToken",status:"production"}]}}});
  const c = R().contexts["identity-access"];
  return c.classification==="UNASSESSED_CAPABILITY" && c.maturity.state==="not-assessed";
});
T("M18","SEG existente → sem inferência de necessidade de ICES",()=>{
  setup({ land:{ "email-threat-protection":{presence:"PRESENT",
    solutions:[{vendor:"Proofpoint",product:"Proofpoint SEG",status:"production",coverage:"SEG"}]}}});
  const c = R().contexts["email-threat-protection"];
  return c.candidates.length===0 && c.classification==="UNASSESSED_CAPABILITY";
});
T("M19","ICES existente → sem inferência de necessidade de SEG",()=>{
  setup({ land:{ "email-threat-protection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiMail Cloud SaaS",status:"production",coverage:"ICES"}]}}});
  return R().contexts["email-threat-protection"].candidates.length===0;
});
T("M20","gaps core + fragmentação + plataforma desejada → nota B com FortiSOC",()=>{
  setup({ ans:{logs:0, automation:0},
    land:{ "security-analytics":{presence:"PRESENT",solutions:[{vendor:"VendorA",product:"SIEM-A",status:"production"}]},
           "security-automation":{presence:"PRESENT",solutions:[{vendor:"VendorB",product:"SOAR-B",status:"production"}]}},
    arch:{ unifiedPlatformPreference:"unified", saasAllowed:"yes" }});
  const n = R().architectureNote;
  return n.show===true && /FortiSOC/.test(n.optionB||"");
});
T("M21","mesmo cenário + consolidação rejeitada → FortiSOC não é empurrado",()=>{
  setup({ ans:{logs:0, automation:0},
    land:{ "security-analytics":{presence:"PRESENT",solutions:[{vendor:"VendorA",product:"SIEM-A",status:"production"}]},
           "security-automation":{presence:"PRESENT",solutions:[{vendor:"VendorB",product:"SOAR-B",status:"production"}]}},
    arch:{ unifiedPlatformPreference:"no", saasAllowed:"yes" }});
  return R().architectureNote.show===false;
});
T("M23","FortiSandbox ausente + necessidade não avaliada → sem recomendação",()=>{
  setup({ land:{ "malware-analysis":{presence:"NONE"} }});
  const c = R().contexts["malware-analysis"];
  return c.candidates.length===0 && c.supportMode==="INVENTORY";
});
T("M24","vendor terceiro atende capability madura → sem substituição (MATURE_WITH_TECH)",()=>{
  setup({ land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"Splunk",product:"Splunk ES",status:"production"}]}}});
  const c = R().contexts["security-analytics"];
  return c.classification==="MATURE_WITH_TECH" && c.candidates.length===0;
});
T("M25","gap + tecnologia parcial → COVERAGE_GAP",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PARTIAL",
    solutions:[{vendor:"V",product:"SIEM",status:"production"}]}}});
  return R().contexts["security-analytics"].classification==="COVERAGE_GAP";
});
T("M26","gap + tecnologia contratada → ADOPTION_GAP",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"V",product:"SIEM",status:"contracted"}]}}});
  return R().contexts["security-analytics"].classification==="ADOPTION_GAP";
});
T("M30","gap + UNKNOWN → NEEDS_VALIDATION (não whitespace)",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"UNKNOWN"} }});
  return R().contexts["security-analytics"].classification==="NEEDS_VALIDATION";
});
T("M31","gap + UNSET → CONTEXT_NOT_INFORMED (não ausência)",()=>{
  setup({ ans:{logs:0}, land:{ "security-automation":{presence:"NONE"} }});  /* automation sai do legacy; logs fica UNSET */
  return R().contexts["security-analytics"].classification==="CONTEXT_NOT_INFORMED";
});
T("M32","madura + produção → MATURE_WITH_TECH; sem substituto",()=>{
  setup({ land:{ "network-detection":{presence:"PRESENT",solutions:[{vendor:"V",product:"NDR-X",status:"production"}]}}});
  const c = R().contexts["network-detection"];
  return c.classification==="MATURE_WITH_TECH" && c.candidates.length===0;
});
T("M33","madura + Fortinet presente → nenhuma recomendação artificial",()=>{
  setup({ land:{ "security-automation":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSOAR",status:"production"}]}}});
  const c = R().contexts["security-automation"];
  return c.classification==="MATURE_WITH_TECH" && c.candidates.length===0 && c.services.length===0;
});
T("M34","madura + concorrente presente → reconhecer; sem substituição",()=>{
  setup({ land:{ "endpoint-detection":{presence:"PRESENT",solutions:[{vendor:"CrowdStrike",product:"Falcon",status:"production"}]}}});
  const c = R().contexts["endpoint-detection"];
  return c.classification==="MATURE_WITH_TECH" && c.candidates.length===0;
});
T("M35","DLP NONE + priority genérica de privacy → sem FortiDLP sem evidência específica",()=>{
  setup({ prio:["policies"], ans:{policies:1}, land:{ "data-loss-prevention":{presence:"NONE"} }});
  const c = R().contexts["data-loss-prevention"];
  return c.candidates.length===0 && c.supportMode==="INVENTORY";
});
T("M36","FortiSAT ausente → ausência não cria finding",()=>{
  setup({ land:{ "human-risk":{presence:"NONE"} }});
  const c = R().contexts["human-risk"];
  return c.maturity.state==="not-assessed" && c.candidates.length===0 && c.maturity.allFindingIds.length===0;
});
T("M37","FortiAuthenticator ausente → sem finding SOC",()=>{
  setup({ land:{ "identity-access":{presence:"NONE"} }});
  const c = R().contexts["identity-access"];
  return c.maturity.allFindingIds.length===0 && c.candidates.length===0;
});
T("M38","FortiPAM ausente → sem finding SOC",()=>{
  setup({ land:{ "privileged-access":{presence:"NONE"} }});
  const c = R().contexts["privileged-access"];
  return c.maturity.allFindingIds.length===0 && c.candidates.length===0;
});
T("M39","SIEM+SOAR maduros e integrados → FortiSOC não recomendado por existir",()=>{
  setup({ land:{ "security-analytics":{presence:"PRESENT",solutions:[{vendor:"Splunk",product:"ES",status:"production"}]},
                 "security-automation":{presence:"PRESENT",solutions:[{vendor:"Splunk",product:"SOAR",status:"production"}]}}});
  const r = R();
  return r.architectureNote.show===false &&
    Object.values(r.contexts).every(c=>!has(c.candidates,x=>x.itemId==="fortisoc"));
});
T("M40","gaps core + Landscape core UNSET → sem nota; FortiSOC nunca whitespace",()=>{
  setup({ ans:{logs:0, automation:0, "incident-response":0},
    land:{ "human-risk":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSAT",status:"production"}]}}});
  const r = R();
  return r.architectureNote.show===false &&
    Object.values(r.contexts).every(c=>!has(c.candidates,x=>x.itemId==="fortisoc"));
});

/* ================= REGRESSÕES P2.1 (conformance patch) ================= */
T("P2.1-01","endpoint gap+NONE + arquitetura unknown → SOMENTE endpoint-family 'a definir'",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} }});
  const c = R().contexts["endpoint-detection"].candidates;
  return c.length===1 && c[0].itemId==="endpoint-family" &&
    c[0].variantResolution==="oferta a definir no aprofundamento" &&
    !has(c,x=>x.itemId==="fortiendpoint") && !has(c,x=>x.itemId==="fortiedr");
});
T("P2.1-02","endpoint cloud (saas=yes) → FortiEndpoint; sem placeholder",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} }, arch:{ saasAllowed:"yes" }});
  const c = R().contexts["endpoint-detection"].candidates;
  return has(c,x=>x.itemId==="fortiendpoint") && !has(c,x=>x.itemId==="endpoint-family");
});
T("P2.1-03","endpoint local (saas=no, local=yes) → FortiEDR; sem FortiEndpoint",()=>{
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} },
    arch:{ saasAllowed:"no", localProcessingRequired:"yes" }});
  const c = R().contexts["endpoint-detection"].candidates;
  return has(c,x=>x.itemId==="fortiedr") && !has(c,x=>x.itemId==="fortiendpoint") && !has(c,x=>x.itemId==="endpoint-family");
});
T("P2.1-04","FortiSIEM Cloud unresolved NÃO cria soc-platform-family espúria",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }});
  const c = R().contexts["security-analytics"].candidates;
  return has(c,x=>x.itemId==="fortisiem") && !has(c,x=>x.itemId==="soc-platform-family") &&
    !has(c,x=>x.itemId==="fortisiem-cloud");
});
T("P2.1-05","2 gaps core + soc-platform NONE → Architecture Note com opção B",()=>{
  setup({ ans:{logs:0, automation:0}, land:{ "soc-platform":{presence:"NONE"} },
    arch:{ unifiedPlatformPreference:"unified", saasAllowed:"yes" }});
  const n = R().architectureNote;
  return n.show===true && /FortiSOC/.test(n.optionB||"") && n.basis.socPlatformNone===true;
});
T("P2.1-06","gaps core + Landscape relevante todo UNSET → nota NÃO aparece",()=>{
  setup({ ans:{logs:0, automation:0}, sig:{ wantsSOCAssessment:false }});
  return R().architectureNote.show===false;
});
T("P2.1-07","preference=no → nota não aparece",()=>{
  setup({ ans:{logs:0, automation:0}, land:{ "soc-platform":{presence:"NONE"} },
    arch:{ unifiedPlatformPreference:"no", saasAllowed:"yes" }});
  return R().architectureNote.show===false;
});
T("P2.1-08","SaaS=no → nota pode existir, mas SEM opção B (só rota A)",()=>{
  setup({ ans:{logs:0, automation:0}, land:{ "soc-platform":{presence:"NONE"} },
    arch:{ unifiedPlatformPreference:"unified", saasAllowed:"no" }});
  const n = R().architectureNote;
  return n.show===true && n.optionB===null && !!n.optionA;
});
T("P2.1-09","plataforma de TERCEIRO sem coveredCapabilities → NÃO suprime FortiSOAR",()=>{
  setup({ ans:{automation:0}, land:{
    "soc-platform":{presence:"PRESENT",solutions:[{vendor:"Splunk",product:"Splunk Mission Control",status:"production"}]},
    "security-automation":{presence:"NONE"} }});
  return has(R().contexts["security-automation"].candidates, x=>x.itemId==="fortisoar");
});
T("P2.1-10","terceiro com automation em coveredCapabilities → suprime/contextualiza",()=>{
  setup({ ans:{automation:0}, land:{
    "soc-platform":{presence:"PRESENT",solutions:[{vendor:"Splunk",product:"Splunk Mission Control",status:"production",
      coveredCapabilities:["security-automation"]}]},
    "security-automation":{presence:"NONE"} }});
  const c = R().contexts["security-automation"];
  return !has(c.candidates,x=>x.itemId==="fortisoar") && c.supportMode==="CONTEXTUAL";
});
T("P2.1-11","gap + NONE + evidência INSUFICIENTE → NEEDS_VALIDATION sem candidato",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }, suff:false });
  const c = R().contexts["security-analytics"];
  return c.classification==="NEEDS_VALIDATION" && c.flags.insufficientEvidence===true && c.candidates.length===0;
});
T("P2.1-12","mesmo cenário com evidência suficiente → TECHNOLOGY_WHITESPACE",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"NONE"} }, suff:true });
  return R().contexts["security-analytics"].classification==="TECHNOLOGY_WHITESPACE";
});
T("P2.1-13","GATE DE SYNC: engine_v32.js idêntico ao bloco V32 embutido no HTML",()=>{
  const eng = fs.readFileSync(path.join(__dirname,"engine_v32.js"),"utf8");
  const html = fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const m = html.match(/\/\* V32_ENGINE_BEGIN \*\/\n([\s\S]*?)\n\/\* V32_ENGINE_END \*\//);
  if (!m) return false;
  return crypto.createHash("sha256").update(m[1]).digest("hex") ===
         crypto.createHash("sha256").update(eng).digest("hex");
});


/* ===== [P2.1.1] Rastreabilidade: IDs originais explícitos (contrato de testes completo) ===== */
T("M13","DLP NONE não avaliada → não recomendar FortiDLP (id explícito; regra também coberta por M64)",()=>{
  setup({ land:{ "data-loss-prevention":{presence:"NONE"} }});
  const c = R().contexts["data-loss-prevention"];
  return c.candidates.length===0 && c.classification==="UNASSESSED_CAPABILITY";
});
T("M16","FortiSAT presente → Human Risk registrado; People score inalterado (id explícito; cf. M48)",()=>{
  setup({ land:{ "human-risk":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSAT",status:"production"}]}}});
  const c = R().contexts["human-risk"];
  return c.maturity.state==="not-assessed" && c.candidates.length===0 &&
    V.TECH_LANDSCAPE["human-risk"].solutions[0].product==="FortiSAT";
});
T("M22","FortiSOC presente → point products duplicativos não recomendados (id explícito; cf. M47/M75)",()=>{
  setup({ ans:{automation:0, logs:0}, land:{
    "soc-platform":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSOC",status:"production"}]},
    "security-automation":{presence:"NONE"}, "security-analytics":{presence:"NONE"} }});
  const r = R();
  return !has(r.contexts["security-automation"].candidates,x=>x.itemId==="fortisoar") &&
         !has(r.contexts["security-analytics"].candidates,x=>x.itemId==="fortisiem"||x.itemId==="fortianalyzer");
});
T("M27","capability não avaliada + tecnologia presente → UNASSESSED; zero efeito no score (id explícito; cf. M63/M73)",()=>{
  setup({ land:{ "malware-analysis":{presence:"PRESENT",solutions:[{vendor:"Fortinet",product:"FortiSandbox",status:"production"}]}}});
  const c = R().contexts["malware-analysis"];
  return c.classification==="UNASSESSED_CAPABILITY" && c.maturity.state==="not-assessed" && c.maturity.allFindingIds.length===0;
});

/* ===== [P2.1.1] Validador exception-safe (entrada malformada → erro, nunca exceção) ===== */
T("P2.1-14","coveredCapabilities como string → erro de validação, sem exceção",()=>{
  setup({ land:{ "soc-platform":{presence:"PRESENT",
    solutions:[{vendor:"X",product:"Plat",status:"production",coveredCapabilities:"security-automation"}]}}});
  let errs; try { errs = V.validateConfigV32(); } catch(e){ return false; }
  const ok = errs.some(e=>e.includes("coveredCapabilities deve ser array"));
  V.resetLandscapeToUnset();
  return ok && V.validateConfigV32().length===0;
});
T("P2.1-15","solutions não-array e declaredPlatforms não-array → erros, sem exceção",()=>{
  setup({});
  V.TECH_LANDSCAPE["deception"].solutions = "FortiDeceptor";
  V.PLATFORM_CONTEXT.declaredPlatforms = "fortigate";
  let errs; try { errs = V.validateConfigV32(); } catch(e){ return false; }
  V.resetLandscapeToUnset();
  return errs.some(e=>e.includes("solutions deve ser array")) &&
         errs.some(e=>e.includes("declaredPlatforms deve ser array")) &&
         V.validateConfigV32().length===0;
});
T("P2.1-16","REPRODUTIBILIDADE: builder em temporário gera HTML idêntico ao publicado",()=>{
  const { execSync } = require("child_process");
  const os = require("os");
  const tmp = path.join(os.tmpdir(), "v32_rebuild_"+Date.now()+".html");
  execSync("python3 "+path.join(__dirname,"build_v32_html.py")+" "+tmp);
  const a = crypto.createHash("sha256").update(fs.readFileSync(tmp)).digest("hex");
  const b = crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"))).digest("hex");
  fs.unlinkSync(tmp);
  return a === b;
});


T("P3.1-G","duas soluções production com a MESMA cobertura 'global' → OPERATIONAL (não COVERAGE_GAP)",()=>{
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"A",product:"SIEM-A",status:"production",coverage:"global"},
               {vendor:"B",product:"SIEM-B",status:"production",coverage:"global"}]}}});
  const same = R().contexts["security-analytics"].classification;
  setup({ ans:{logs:0}, land:{ "security-analytics":{presence:"PRESENT",
    solutions:[{vendor:"A",product:"SIEM-A",status:"production",coverage:"datacenter"},
               {vendor:"B",product:"SIEM-B",status:"production",coverage:"filiais"}]}}});
  const distinct = R().contexts["security-analytics"].classification;
  return same==="OPERATIONAL_GAP" && distinct==="COVERAGE_GAP";
});


T("P3.2-B","gapTrigger: team-capacity gap → SOCaaS como managed-service contextual; MDR só com base elegível",()=>{
  setup({ ans:{"team-capacity":0}, land:{ "deception":{presence:"NONE"} }});
  const s = R().contexts["soc-staffing"].services;
  const socaas = has(s,x=>x.serviceId==="fortiguard-socaas");
  const noMdr = !has(s,x=>x.serviceId==="fortiguard-mdr");
  const errs = V.validateConfigV32();
  return socaas && noMdr && errs.length===0;
});


T("P3.2.3-A1","team-capacity gap sem base EDR → SOCaaS sim, MDR não",()=>{
  setup({ ans:{"team-capacity":0}, land:{ "deception":{presence:"NONE"} }});
  const s = R().contexts["soc-staffing"].services;
  return has(s,x=>x.serviceId==="fortiguard-socaas") && !has(s,x=>x.serviceId==="fortiguard-mdr");
});
T("P3.2.3-A2","team-capacity gap + FortiEDR cloud → SOCaaS + MDR",()=>{
  setup({ ans:{"team-capacity":0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"cloud"}]}}});
  const s = R().contexts["soc-staffing"].services;
  return has(s,x=>x.serviceId==="fortiguard-socaas") && has(s,x=>x.serviceId==="fortiguard-mdr");
});
T("P3.2.3-A3","team-capacity gap + FortiEDR on-prem → SOCaaS sim, MDR não",()=>{
  setup({ ans:{"team-capacity":0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"on-prem"}]}}});
  const s = R().contexts["soc-staffing"].services;
  return has(s,x=>x.serviceId==="fortiguard-socaas") && !has(s,x=>x.serviceId==="fortiguard-mdr");
});
T("P3.2.3-A4","monitoring-coverage gap + FortiEDR cloud → SOCaaS + MDR",()=>{
  setup({ ans:{"monitoring-coverage":0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"cloud"}]}}});
  const s = R().contexts["continuous-monitoring"].services;
  return has(s,x=>x.serviceId==="fortiguard-socaas") && has(s,x=>x.serviceId==="fortiguard-mdr");
});
T("P3.2.3-A5","monitoring-coverage gap sem base (ou on-prem) → MDR não",()=>{
  setup({ ans:{"monitoring-coverage":0}, land:{ "deception":{presence:"NONE"} }});
  const s1 = R().contexts["continuous-monitoring"].services;
  setup({ ans:{"monitoring-coverage":0}, land:{ "endpoint-detection":{presence:"PRESENT",
    solutions:[{vendor:"Fortinet",product:"FortiEDR",status:"production",deployment:"air-gapped"}]}}});
  const s2 = R().contexts["continuous-monitoring"].services;
  return !has(s1,x=>x.serviceId==="fortiguard-mdr") && !has(s2,x=>x.serviceId==="fortiguard-mdr");
});
T("P3.2.3-C","contextTrigger: CTX congeladas aparecem como contextual-support; supporting genérico NÃO",()=>{
  setup({ ans:{knowledge:0}, land:{ "knowledge-management":{presence:"NONE"} }});
  const kc = R().contexts["knowledge-management"]; const k = kc.candidates;
  setup({ ans:{"detection-lifecycle":0}, land:{ "detection-engineering":{presence:"NONE"} }});
  const dec = R().contexts["detection-engineering"]; const de = dec.candidates;
  setup({ ans:{endpoint:0}, land:{ "endpoint-detection":{presence:"NONE"} }, arch:{ saasAllowed:"yes" }});
  const ep = R().contexts["endpoint-detection"].candidates;
  const errs = V.validateConfigV32();
  return has(k,x=>x.itemId==="fortisoar" && x.itemKind==="contextual-support") &&
    !has(k,x=>x.itemKind==="offering") &&
    has(de,x=>x.itemId==="fortisiem" && x.itemKind==="contextual-support") &&
    has(de,x=>x.itemId==="fortiai-assist" && x.itemKind==="contextual-support") &&
    kc.supportMode==="CONTEXTUAL" && dec.supportMode==="CONTEXTUAL" &&      /* [3.2.4-1] */
    kc.classification==="TECHNOLOGY_WHITESPACE" && dec.classification==="TECHNOLOGY_WHITESPACE" &&
    !has(ep,x=>x.itemId==="forticlient") && errs.length===0;
});

/* ---------------- matriz final ---------------- */
const fail = results.filter(r=>!r.ok);
console.log("\nMATRIZ (M1–M40 ENGINE + M42–M86 + P2.1): "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length+" testes");
if (fail.length){ fail.forEach(f=>console.log("  FAIL: "+f.id+" — "+f.label)); process.exit(1); }
process.exit(0);
