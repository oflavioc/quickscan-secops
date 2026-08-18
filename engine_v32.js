/* ============================================================================
   QUICKSCAN SECOPS · SOC-CMM — ENGINE V3.2 (capability-first)
   Fase 2 · SEM UI. Arquitetura congelada: Rev2-final + Errata 1 + Errata 1.1.
   Camada 1 (V3.1.3: QS/scoring/findings/suficiência/prioridades) É INTOCÁVEL —
   este módulo só LÊ a Camada 1 via adapter (configure) e deriva contexto.
   legacyMode (Landscape UNSET + arquitetura default + sinais vazios +
   PLATFORM_CONTEXT vazio) ⇒ o engine não interfere em NADA (M41).
   Nota de implementação declarada (não-silenciosa): TECH_LANDSCAPE.solutions
   ganha o campo OPCIONAL `deployment` (enum) — necessário ao M84 (elegibilidade
   MDR por deployment da base declarada). Sem esse campo, deployment = unknown.
   Segunda extensão declarada [P2.1-C]: TECH_LANDSCAPE.solutions ganha o campo
   OPCIONAL `coveredCapabilities` (IDs de capabilities) — única via para plataforma
   de TERCEIRO suprimir point products; nada é inferido.
   ============================================================================ */
(function (root) {
"use strict";
const V32 = {};

/* ---------------------------- ENUMS (E2/E13) ---------------------------- */
const ENUMS = {
  entityType: ["family","solution-area","offering","component","variant","bundle","commercial-program"],
  deliveryType: ["platform","product","appliance","software","saas","suite","managed-service",
                 "expert-service","security-subscription","embedded-capability","licensing-program"],
  deployment: ["appliance","vm","saas","cloud","on-prem","air-gapped","agente","hybrid"],
  relation: ["primary","partial","supporting","embedded","contextual"],
  recommendationPolicy: ["direct-when-gap-and-whitespace","contextual-only","architecture-only",
                         "landscape-only","managed-service-option","adjacent-control","never-direct"],
  serviceType: ["assessment","advisory","readiness-subscription","exercise","training","reactive-service","managed-service"],
  lifecycle: ["prepare","assess","respond","operate"],
  eligibility: ["confirmed","not-applicable","unknown"],
  presence: ["UNSET","NONE","PARTIAL","PRESENT","UNKNOWN"],
  solutionStatus: ["evaluation","contracted","deploying","partial-production","production","broad-production"],
  techState: ["UNSET","NONE","UNKNOWN","DECLARED_UNSPECIFIED","EVALUATING","IN_FLIGHT","PARTIAL_OPERATIONAL","OPERATIONAL"],
  classification: ["TECHNOLOGY_WHITESPACE","OPERATIONAL_GAP","ADOPTION_GAP","COVERAGE_GAP",
                   "EVALUATION_IN_PROGRESS","TECH_STATUS_UNVERIFIED","MATURE_WITH_TECH","TECH_TRANSITION",
                   "POSSIBLE_CONTEXT_DIVERGENCE","NEEDS_VALIDATION","CONTEXT_NOT_INFORMED","UNASSESSED_CAPABILITY"]
};

/* ------------------------- CAPABILITIES (25 — B) ------------------------- */
const CAP = (name, scope, coverage, qids, land, extra) =>
  Object.assign({ name, scope, assessmentCoverage: coverage, questionIds: qids||[], landscapeEnabled: !!land, modes: null }, extra||{});
const CAPABILITIES = {
  "soc-governance":       CAP("Governança do SOC","core-soc","direct",["mandate","governance","policies"],false),  /* [3.2.1-4] matriz aprovada: landscape N/A */
  "soc-staffing":         CAP("Capacidade do time","core-soc","direct",["team-capacity"],false),
  "soc-skills":           CAP("Competências e desenvolvimento","core-soc","direct",["training"],false),
  "knowledge-management": CAP("Gestão de conhecimento","core-soc","direct",["knowledge"],true),
  "incident-management":  CAP("Gestão e resposta a incidentes","core-soc","direct",["incident-response"],true),
  "detection-engineering":CAP("Engenharia de detecção","core-soc","direct",["detection-lifecycle"],true),
  "security-analytics":   CAP("Analytics de segurança (SIEM/data lake)","core-soc","direct",["logs"],true),
  "security-automation":  CAP("Automação de segurança (SOAR)","core-soc","direct",["automation"],true),
  "continuous-monitoring":CAP("Monitoramento contínuo","core-soc","direct",["monitoring-coverage"],true),
  "soc-platform":         CAP("Plataforma de SOC unificada","core-soc","none",[],true),
  "threat-intelligence":  CAP("Threat Intelligence operacional","core-soc","none",[],true),
  "soc-ai-assistance":    CAP("Assistência de IA ao SOC","core-soc","none",[],true),
  "endpoint-detection":   CAP("Detecção e resposta em endpoint","secops","direct",["endpoint"],true),
  "network-detection":    CAP("Network Detection & Response","secops","direct",["network-visibility"],true),
  "external-exposure":    CAP("Gestão de exposição externa (EASM/DRPS)","secops","direct",["external-surface"],true),
  "vulnerability-management": CAP("Gestão contínua de vulnerabilidades","secops","direct",["vulnerability-management"],true),
  "deception":            CAP("Deception","secops","none",[],true),
  "malware-analysis":     CAP("Análise de malware / sandbox","secops","none",[],true),
  "email-threat-protection": CAP("Proteção de e-mail e workspace","secops","none",[],true,{modes:["SEG","ICES","browser","collaboration"]}),
  "insider-risk":         CAP("Risco interno","secops","none",[],true),
  "data-loss-prevention": CAP("Prevenção de perda de dados","adjacent-control","none",[],true),
  "identity-access":      CAP("Identidade e acesso","adjacent-control","none",[],true),
  "privileged-access":    CAP("Acesso privilegiado (PAM)","adjacent-control","none",[],true),
  "human-risk":           CAP("Risco humano (awareness/phishing)","adjacent-control","none",[],true),
  "ai-runtime-security":  CAP("Segurança de runtime de IA/LLM","adjacent-control","none",[],true)
};

/* ----------------------- SOLUTION AREAS (O/FortiAI) ---------------------- */
const SOLUTION_AREAS = {
  "fortiai":          { entityType:"family",        name:"FortiAI", parent:null, recommendationPolicy:"never-direct" },
  "fortiai-assist":   { entityType:"solution-area", name:"FortiAI-Assist",   parent:"fortiai" },
  "fortiai-protect":  { entityType:"solution-area", name:"FortiAI-Protect",  parent:"fortiai" },
  "fortiai-secureai": { entityType:"solution-area", name:"FortiAI-SecureAI", parent:"fortiai" }
};

/* ------------------------------ OFFERINGS (J) ---------------------------- */
const O = (name, et, dt, o) => Object.assign({ name, entityType:et, deliveryType:dt,
  family:null, variantOf:null, architectureRole:"point-solution",
  capabilityRelations:[], solutionAreaRelations:[], deployment:[],
  architectureRequires:null, recommendationPolicy:"landscape-only",
  requiredSignals:[], contextAnchor:false, commercialOptions:[], url:"" }, o||{});
const CR = (capability, relation, scopeNote) => scopeNote ? {capability, relation, scopeNote} : {capability, relation};
const OFFERINGS = {
  /* famílias (nós de hierarquia) */
  "endpoint-family": O("Fortinet Endpoint Security","family","product",{ capabilityRelations:[CR("endpoint-detection","primary")] }),
  "fortimail-family":O("FortiMail (Email & Workspace Security)","family","product",{ capabilityRelations:[CR("email-threat-protection","primary")] }),
  "ndr-family":      O("FortiNDR","family","product",{ capabilityRelations:[CR("network-detection","primary")] }),
  "soc-platform-family": O("Fortinet SecOps Platform","family","platform",{ capabilityRelations:[CR("soc-platform","primary")] }),
  "identity-family": O("Fortinet Identity","family","product",{ capabilityRelations:[CR("identity-access","primary")] }),
  /* plataformas/produtos */
  "fortisoc": O("FortiSOC","offering","platform",{ family:"soc-platform-family", architectureRole:"unified-platform",
    deployment:["saas"], recommendationPolicy:"architecture-only",
    capabilityRelations:[CR("soc-platform","primary"),CR("security-analytics","embedded"),CR("security-automation","embedded"),
      CR("incident-management","embedded"),CR("threat-intelligence","embedded"),CR("soc-ai-assistance","embedded")],
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"embedded"}],
    url:"https://www.fortinet.com/products/fortisoc" }),
  "fortianalyzer": O("FortiAnalyzer","offering","platform",{ family:"soc-platform-family", deployment:["appliance","vm","cloud"],
    recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("security-analytics","primary"),CR("soc-ai-assistance","embedded")],
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"embedded"}],
    url:"https://www.fortinet.com/products/management/fortianalyzer" }),
  "fortisiem": O("FortiSIEM","offering","product",{ family:"soc-platform-family", deployment:["appliance","vm"],
    recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("security-analytics","primary"),
      {capability:"detection-engineering",relation:"supporting",contextTrigger:true}],   /* [3.2.3-C] */
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"embedded"}],
    url:"https://www.fortinet.com/products/siem/fortisiem" }),
  "fortisiem-cloud": O("FortiSIEM Cloud","variant","saas",{ family:"soc-platform-family", variantOf:"fortisiem",
    deployment:["saas"], architectureRequires:{ saasAllowed:"yes" }, recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("security-analytics","primary")] }),
  "fortisoar": O("FortiSOAR","offering","product",{ family:"soc-platform-family", deployment:["vm","saas"],
    recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("security-automation","primary"),CR("incident-management","primary"),
      {capability:"knowledge-management",relation:"supporting",contextTrigger:true}],   /* [3.2.3-C] CTX congelada */
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"embedded"}],
    url:"https://www.fortinet.com/products/fortisoar" }),
  /* endpoint (P — R2b) */
  "fortiendpoint": O("FortiEndpoint","offering","platform",{ family:"endpoint-family", deployment:["saas"],
    architectureRequires:{ saasAllowed:"yes" }, recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("endpoint-detection","primary"),CR("vulnerability-management","partial","camada endpoint")],
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"embedded"}],
    url:"https://www.fortinet.com/products/fortiendpoint" }),
  "fortiedr": O("FortiEDR","offering","product",{ family:"endpoint-family", deployment:["cloud","on-prem","air-gapped"],
    architectureRequires:{ anyOf:[{localProcessingRequired:"yes"},{saasAllowed:"no"},{edrSpecificNeed:true}] },
    recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("endpoint-detection","primary")],
    url:"https://www.fortinet.com/products/endpoint-security/fortiedr" }),
  "forticlient": O("FortiClient","component","software",{ family:"endpoint-family", deployment:["agente"],
    capabilityRelations:[CR("endpoint-detection","supporting")],
    url:"https://www.fortinet.com/products/endpoint-security/forticlient" }),
  "fortixdr": O("FortiXDR","variant","embedded-capability",{ family:"endpoint-family", variantOf:"fortiedr",
    recommendationPolicy:"contextual-only",
    capabilityRelations:[CR("endpoint-detection","partial","correlação estendida multivetor")],
    url:"https://www.fortinet.com/products/fortixdr" }),
  /* NDR (T) */
  "fortindr-cloud": O("FortiNDR Cloud","variant","saas",{ family:"ndr-family", variantOf:"ndr-family",
    deployment:["saas"], architectureRequires:{ saasAllowed:"yes" }, recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("network-detection","primary")] }),
  "fortindr-onprem": O("FortiNDR (On-Premises)","variant","product",{ family:"ndr-family", variantOf:"ndr-family",
    deployment:["appliance","vm","air-gapped"], architectureRequires:{ anyOf:[{localProcessingRequired:"yes"},{otIsolated:"yes"},{saasAllowed:"no"}] },
    recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("network-detection","primary")] }),
  /* email (Q — R1) */
  "fortimail": O("FortiMail","offering","platform",{ family:"fortimail-family", deployment:["appliance","vm","cloud"],
    capabilityRelations:[CR("email-threat-protection","primary")], requiredSignals:["becConcern","emailSecurityConcern"] }),
  "fortimail-wss": O("FortiMail Workspace Security","offering","suite",{ family:"fortimail-family", deployment:["saas"],
    capabilityRelations:[CR("email-threat-protection","primary")], requiredSignals:["becConcern","emailSecurityConcern"],
    url:"https://www.fortinet.com/products/fortimail-workspace-security" }),
  "fortimail-cloud-saas": O("FortiMail Cloud SaaS","component","saas",{ family:"fortimail-family", variantOf:"fortimail-wss",
    deployment:["saas"], capabilityRelations:[CR("email-threat-protection","primary")], requiredSignals:["becConcern","emailSecurityConcern"] }),
  /* demais */
  "fortirecon": O("FortiRecon","offering","saas",{ deployment:["saas"], recommendationPolicy:"direct-when-gap-and-whitespace",
    capabilityRelations:[CR("external-exposure","primary"),
      CR("vulnerability-management","partial","complementa o programa; não representa sozinho todo o ciclo"),
      CR("threat-intelligence","supporting")],
    url:"https://www.fortinet.com/products/fortirecon" }),
  "fortideceptor": O("FortiDeceptor","offering","product",{ deployment:["appliance","vm","cloud"],
    capabilityRelations:[CR("deception","primary")] }),
  "fortisandbox": O("FortiSandbox","offering","product",{ deployment:["appliance","vm","saas","cloud"],
    architectureRole:"integrated-component", capabilityRelations:[CR("malware-analysis","primary")],
    solutionAreaRelations:[{solutionArea:"fortiai-protect",relation:"supporting"}] }),
  "fortidlp": O("FortiDLP","offering","product",{ deployment:["saas","agente"],
    architectureRole:"adjacent-control",
    capabilityRelations:[CR("data-loss-prevention","primary"),CR("insider-risk","primary")],
    /* E15: graus de relação = decisão de modelagem nossa sustentada por fonte oficial */
    solutionAreaRelations:[{solutionArea:"fortiai-protect",relation:"primary"},{solutionArea:"fortiai-secureai",relation:"supporting"}],
    requiredSignals:["dataLeakageConcern","insiderRiskConcern","complianceDataProtection","shadowAIConcern","aiUsageRisk"] }),
  "fortiaigate": O("FortiAIGate","offering","product",{ deployment:["on-prem","cloud"],
    architectureRole:"adjacent-control",
    capabilityRelations:[CR("ai-runtime-security","primary"),CR("data-loss-prevention","supporting")],
    solutionAreaRelations:[{solutionArea:"fortiai-secureai",relation:"primary"}],
    requiredSignals:["organizationBuildsAIApps","usesPrivateLLMs","usesAgenticAI","aiRuntimeSecurityConcern","promptInjectionConcern","llmDataLeakageConcern"],
    url:"https://www.fortinet.com/products/fortiaigate" }),
  "fortisat": O("FortiSAT","offering","saas",{ deployment:["saas"], architectureRole:"adjacent-control",
    capabilityRelations:[CR("human-risk","primary")], url:"https://www.fortinet.com/products/fortisat" }),
  "fortiauthenticator": O("FortiAuthenticator","offering","product",{ family:"identity-family",
    deployment:["appliance","vm","cloud"], architectureRole:"adjacent-control", recommendationPolicy:"adjacent-control",
    capabilityRelations:[CR("identity-access","primary")], requiredSignals:["identityRiskConcern"] }),
  "fortipam": O("FortiPAM","offering","product",{ family:"identity-family", deployment:["appliance","vm","cloud"],
    architectureRole:"adjacent-control", recommendationPolicy:"adjacent-control",
    capabilityRelations:[CR("privileged-access","primary")], requiredSignals:["pamRequirement"] }),
  "fortiai-assist": O("FortiAI-Assist","component","embedded-capability",{
    capabilityRelations:[CR("soc-ai-assistance","primary"),
      {capability:"detection-engineering",relation:"supporting",contextTrigger:true},   /* [3.2.3-C] */
      CR("soc-staffing","supporting")],
    solutionAreaRelations:[{solutionArea:"fortiai-assist",relation:"primary"}] }),
  /* E4: âncora de contexto */
  "fortigate": O("FortiGate","offering","product",{ deployment:["appliance","vm","cloud"],
    contextAnchor:true, recommendationPolicy:"never-direct", capabilityRelations:[],
    commercialOptions:[{program:"fortiflex", eligibility:"confirmed", note:"página oficial FortiFlex: soluções virtualizadas e serviços p/ FortiGate"}] })
};

/* --------------------------- SERVICES (K + E14) --------------------------- */
const S = (name, serviceType, lifecycle, o) => Object.assign({ name, serviceType, lifecycle,
  engagementModel:"service-points", requiredSignals:[], eligibilityRequires:null,
  capabilityRelations:[], commercialOptions:[{program:"fortipoints", eligibility:"confirmed",
    note:"pontos de serviços avançados/IR cobertos pelo FortiPoints (fonte oficial)"}], url:"" }, o||{});
const SERVICES = {
  "fortiguard-socaas": S("FortiGuard SOCaaS","managed-service","operate",{ engagementModel:"subscription",
    capabilityRelations:[CR("continuous-monitoring","primary"),
      {capability:"soc-staffing",relation:"supporting",gapTrigger:true}],   /* [3.2.2-B] managed-service option contextual p/ gap de staffing */
    url:"https://www.fortinet.com/products/socaas" }),
  "fortiguard-mdr": S("FortiGuard MDR","managed-service","operate",{ engagementModel:"subscription",
    capabilityRelations:[CR("endpoint-detection","primary"),
      {capability:"continuous-monitoring",relation:"supporting",gapTrigger:true},   /* [3.2.3-A] */
      {capability:"soc-staffing",relation:"supporting",gapTrigger:true}],           /* [3.2.3-A] */
    eligibilityRequires:{ baseOffering:["fortiedr","fortixdr","fortiendpoint"], baseDeploymentExcludes:["on-prem","air-gapped"] },
    url:"https://www.fortinet.com/solutions/enterprise-midsize-business/mdr" }),
  "ir-readiness-subscription": S("FortiGuard Incident Readiness Subscription","readiness-subscription","prepare",{
    capabilityRelations:[CR("incident-management","primary"),CR("soc-governance","supporting")] }),
  "ir-plan-development": S("Incident Response Plan Development","advisory","prepare",{
    capabilityRelations:[CR("incident-management","primary")] }),
  "ir-playbook-development": S("Incident Response Playbook Development","advisory","prepare",{
    capabilityRelations:[CR("incident-management","primary"),CR("knowledge-management","supporting")] }),
  "ttx": S("Cybersecurity Tabletop Exercise","exercise","prepare",{
    capabilityRelations:[CR("incident-management","primary"),CR("soc-skills","supporting")] }),
  "ir-training": S("Incident Response Training","training","prepare",{
    capabilityRelations:[CR("soc-skills","primary")] }),
  "dfir": S("Digital Forensics & Incident Response","reactive-service","respond",{
    requiredSignals:["activeIncident"], capabilityRelations:[CR("incident-management","primary")] }),
  "compromise-assessment": S("Compromise Assessment","assessment","assess",{
    requiredSignals:["suspectedCompromise"],
    capabilityRelations:[CR("detection-engineering","supporting"),CR("incident-management","supporting")] }),
  "ransomware-readiness-assessment": S("Ransomware Readiness Assessment","assessment","prepare",{
    requiredSignals:["ransomwareConcern"], capabilityRelations:[CR("incident-management","primary")] }),
  "soc-assessment": S("FortiGuard SOC Assessment","assessment","assess",{
    requiredSignals:["wantsSOCAssessment"],
    capabilityRelations:[CR("soc-governance","supporting"),CR("incident-management","supporting"),CR("detection-engineering","supporting")] }),
  "soc-development-service": S("FortiGuard SOC Development Service","advisory","prepare",{
    requiredSignals:["wantsSOCDevelopment"], capabilityRelations:[CR("soc-governance","supporting"),CR("soc-staffing","supporting")] }),
  "vulnerability-assessment": S("Vulnerability Assessment","assessment","assess",{
    capabilityRelations:[CR("vulnerability-management","primary")] }),
  "ad-security-assessment": S("Active Directory Security Assessment","assessment","assess",{
    requiredSignals:["identityRiskConcern"], capabilityRelations:[CR("identity-access","supporting")] }),
  "penetration-testing": S("Penetration Testing","assessment","assess",{
    capabilityRelations:[CR("vulnerability-management","supporting")] }),
  "red-team-assessment": S("Red Team Assessment","assessment","assess",{
    capabilityRelations:[CR("detection-engineering","supporting"),CR("incident-management","supporting")] })
};
const SERVICE_FAMILIES = {
  "fortiguard-labs-advisory": { name:"FortiGuard Labs Advisory Service (umbrella)",
    mechanism:"assinatura anual → service points (⊂ FortiPoints)",
    members:["ir-readiness-subscription","ir-plan-development","ir-playbook-development","ttx","ir-training",
             "dfir","compromise-assessment","ransomware-readiness-assessment","soc-assessment",
             "vulnerability-assessment","ad-security-assessment","soc-development-service",
             "penetration-testing","red-team-assessment"] }
};

/* --------------------- SECURITY SUBSCRIPTIONS + BUNDLES (E6/M) --------------------- */
const SUB = (name, o) => Object.assign({ name, entityType:"offering", deliveryType:"security-subscription",
  consumedBy:["fortigate"], capabilityRelations:[] }, o||{});
const SECURITY_SUBSCRIPTIONS = {
  "fg-ips": SUB("FortiGuard IPS"), "fg-antivirus": SUB("FortiGuard Antivirus"),
  "fg-sandbox-saas": SUB("FortiSandbox SaaS (serviço)",{ capabilityRelations:[CR("malware-analysis","partial","análise inline no FortiGate")] }),
  "fg-appcontrol": SUB("FortiGuard Application Control"), "fg-inline-casb": SUB("FortiGuard Inline CASB"),
  "fg-dns-filtering": SUB("FortiGuard DNS Filtering"), "fg-url-filtering": SUB("FortiGuard URL Filtering"),
  "fg-video-filtering": SUB("FortiGuard Video Filtering"), "fg-antibotnet-c2": SUB("FortiGuard Anti-Botnet/C2"),
  "fg-dlp-service": SUB("FortiGuard DLP Service",{ capabilityRelations:[CR("data-loss-prevention","partial","enforcement de rede")] }),
  "fg-attack-surface-security": SUB("FortiGuard Attack Surface Security",{ capabilityRelations:[CR("external-exposure","supporting")] }),
  "fg-iot-detection-vuln-correlation": SUB("FortiGuard IoT Detection + Vulnerability Correlation",{ capabilityRelations:[CR("vulnerability-management","supporting")] }),
  "fg-inline-malware-prevention": SUB("FortiGuard AI-based Inline Malware Prevention"),
  "fg-ot-security": SUB("FortiGuard OT Security Service")
};
const ATP = ["fg-ips","fg-antivirus","fg-sandbox-saas","fg-appcontrol","fg-inline-casb"];
const UTP = ATP.concat(["fg-dns-filtering","fg-url-filtering","fg-video-filtering","fg-antibotnet-c2"]);
const ENT = UTP.concat(["fg-dlp-service","fg-attack-surface-security","fg-inline-malware-prevention","fg-iot-detection-vuln-correlation"]);
const BUNDLES = {
  atp: { entityType:"bundle", name:"ATP — Advanced Threat Protection", appliesTo:"fortigate", includesSubscriptions:ATP },
  utp: { entityType:"bundle", name:"UTP — Unified Threat Protection",  appliesTo:"fortigate", includesSubscriptions:UTP },
  ent: { entityType:"bundle", name:"ENT — Enterprise Protection",      appliesTo:"fortigate", includesSubscriptions:ENT }
};
const COMMERCIAL_PROGRAMS = {
  fortipoints:     { entityType:"commercial-program", deliveryType:"licensing-program", name:"FortiPoints",
    mechanism:"pontos universais (FortiFlex, FortiSIEM points, advanced/IR service points, contratos anuais)" },
  fortiflex:       { entityType:"commercial-program", deliveryType:"licensing-program", name:"FortiFlex",
    mechanism:"licenciamento usage-based por pontos" },
  fortimarketplace:{ entityType:"commercial-program", deliveryType:"licensing-program", name:"FortiMarketplace",
    mechanism:"portal self-service; transferência FortiPoints→FortiFlex points" }
};

/* ----------------------- ESTADO DAS CAMADAS (defaults) ----------------------- */
const TECH_LANDSCAPE = {};
Object.keys(CAPABILITIES).forEach(id => { if (CAPABILITIES[id].landscapeEnabled)
  TECH_LANDSCAPE[id] = { presence:"UNSET", solutions:[], declaredDriver:null }; });
const ARCHITECTURE_CONTEXT = { saasAllowed:"unknown", localProcessingRequired:"unknown", otIsolated:"unknown",
  unifiedPlatformPreference:"undefined", environmentProfile:"uninformed", dataResidency:"uninformed" };
const PLATFORM_CONTEXT = { declaredPlatforms: [] };
const SIGNAL_IDS = ["activeIncident","suspectedCompromise","ransomwareConcern","wantsIRReadiness","wantsSOCAssessment",
  "wantsSOCDevelopment","becConcern","emailSecurityConcern","dataLeakageConcern","insiderRiskConcern",
  "complianceDataProtection","shadowAIConcern","aiUsageRisk","organizationBuildsAIApps","usesPrivateLLMs",
  "usesAgenticAI","aiRuntimeSecurityConcern","promptInjectionConcern","llmDataLeakageConcern",
  "identityRiskConcern","pamRequirement","edrSpecificNeed"];
const SESSION_SIGNALS = {};
SIGNAL_IDS.forEach(s => SESSION_SIGNALS[s] = "unset");

function resetLandscapeToUnset(){
  Object.keys(TECH_LANDSCAPE).forEach(id => { TECH_LANDSCAPE[id] = { presence:"UNSET", solutions:[], declaredDriver:null }; });
  Object.assign(ARCHITECTURE_CONTEXT, { saasAllowed:"unknown", localProcessingRequired:"unknown", otIsolated:"unknown",
    unifiedPlatformPreference:"undefined", environmentProfile:"uninformed", dataResidency:"uninformed" });
  PLATFORM_CONTEXT.declaredPlatforms = [];
  SIGNAL_IDS.forEach(s => SESSION_SIGNALS[s] = "unset");
}
function isLegacyModeV32(){
  const landUnset = Object.values(TECH_LANDSCAPE).every(v => v.presence === "UNSET");
  const archDefault = Object.values(ARCHITECTURE_CONTEXT).every(v => v==="unknown"||v==="undefined"||v==="uninformed"||v===null);
  const sigsEmpty = Object.values(SESSION_SIGNALS).every(v => v === "unset" || v === null || v === undefined);
  const platEmpty = PLATFORM_CONTEXT.declaredPlatforms.length === 0;
  return landUnset && archDefault && sigsEmpty && platEmpty;
}
const signalOn = id => SESSION_SIGNALS[id] === true;

/* --------------------------- licensedContext (13) --------------------------- */
function deriveLicensedContext(){
  const lic = {};   /* capabilityId -> [subscriptionIds] */
  PLATFORM_CONTEXT.declaredPlatforms.forEach(p => {
    const subIds = new Set();
    if (p.bundle && BUNDLES[p.bundle]) BUNDLES[p.bundle].includesSubscriptions.forEach(s => subIds.add(s));
    (p.subscriptions||[]).forEach(s => subIds.add(s));
    subIds.forEach(sid => {
      const sub = SECURITY_SUBSCRIPTIONS[sid]; if (!sub) return;
      sub.capabilityRelations.forEach(r => { (lic[r.capability] = lic[r.capability] || []).push(sid); });
    });
  });
  return lic;
}

/* ------------------------- adapter da Camada 1 (V3.1.3) ------------------------- */
let ENV = null;
/* env = { answerOf(questionId) -> null|0..3|"NA", sevOf(questionId, lvl) -> 0|1|2,
           priorityIds() -> [questionIds priorizados],
           assessmentSufficient() -> boolean  (dataSufficiency da Camada 1 — SOMENTE leitura) } */
function configure(env){ ENV = env; }

/* --------------------------- maturityStateOf (D/E9) --------------------------- */
function maturityStateOf(capId){
  const cap = CAPABILITIES[capId];
  if (!cap || cap.assessmentCoverage === "none")
    return { state:"not-assessed", hasUnknowns:false, stateSourceFindingIds:[], allFindingIds:[], sourceQuestionIds:[], evidenceSources:[] };
  const rows = cap.questionIds.map(q => {
    const a = ENV.answerOf(q);
    const sev = (a===null || a==="NA") ? null : ENV.sevOf(q, a);
    return { q, a, sev };
  });
  const gapsHigh = rows.filter(r => r.sev === 2);
  const gapsMod  = rows.filter(r => r.sev === 1);
  const unknowns = rows.filter(r => r.a === null || r.a === "NA");
  const state = gapsHigh.length ? "gap-high" : gapsMod.length ? "gap-moderate"
              : unknowns.length ? "needs-validation" : "mature";
  const stateSource = state==="gap-high" ? gapsHigh : state==="gap-moderate" ? gapsMod
                    : state==="needs-validation" ? unknowns : rows;
  return {
    state, hasUnknowns: unknowns.length > 0,
    stateSourceFindingIds: stateSource.map(r=>r.q),
    allFindingIds: rows.filter(r=>r.sev>0).map(r=>r.q),
    sourceQuestionIds: cap.questionIds.slice(),
    evidenceSources: rows.map(r=>({questionId:r.q, answer:r.a}))
  };
}

/* --------------------------- deriveTechState (E/E7) --------------------------- */
function deriveTechState(L){
  if (!L || L.presence === "UNSET") return { st:"UNSET" };
  if (L.presence === "UNKNOWN")     return { st:"UNKNOWN" };
  if (L.presence === "NONE")        return { st:"NONE" };
  const sols = L.solutions || [];
  const operational = sols.filter(s => s.status==="production" || s.status==="broad-production");
  const partialProd = sols.filter(s => s.status==="partial-production");
  const inFlight    = sols.filter(s => s.status==="contracted" || s.status==="deploying");
  const evaluating  = sols.filter(s => s.status==="evaluation");
  const covSet      = new Set(sols.map(s => (s.coverage||"").trim().toLowerCase()).filter(Boolean));
  const segmented   = sols.length >= 2 && sols.every(s => (s.coverage||"").trim().length > 0) &&
                      covSet.size >= 2 &&        /* [3.1.1-G] segmentação exige coberturas DISTINTAS */
                      !sols.some(s => s.status==="broad-production");
  if (L.presence === "PARTIAL"){
    if (operational.length) return { st:"PARTIAL_OPERATIONAL", operational, inFlight };
    if (inFlight.length)    return { st:"IN_FLIGHT", inFlight };
    if (evaluating.length)  return { st:"EVALUATING", evaluating };
    return { st:"PARTIAL_OPERATIONAL" };
  }
  /* PRESENT */
  if (sols.length === 0) return { st:"DECLARED_UNSPECIFIED" };          /* E7 */
  if (operational.length) return { st: segmented ? "PARTIAL_OPERATIONAL" : "OPERATIONAL", operational, partialProd, inFlight };
  if (partialProd.length) return { st:"PARTIAL_OPERATIONAL", partialProd, inFlight };
  if (inFlight.length)    return { st:"IN_FLIGHT", inFlight };
  if (evaluating.length)  return { st:"EVALUATING", evaluating };
  return { st:"DECLARED_UNSPECIFIED" };                                  /* solutions sem status */
}

/* ------------------------------ classify (F/E7/E8/E13) ------------------------------ */
function classify(capId){
  const cap = CAPABILITIES[capId];
  if (cap.assessmentCoverage === "none")
    return { c:"UNASSESSED_CAPABILITY", flags:{} };
  const m = maturityStateOf(capId);
  const T = deriveTechState(TECH_LANDSCAPE[capId]);
  if (m.state === "needs-validation" || T.st === "UNKNOWN") return { c:"NEEDS_VALIDATION", flags:{}, T, m };
  if (m.state === "gap-high" || m.state === "gap-moderate"){
    switch (T.st){
      case "UNSET": return { c:"CONTEXT_NOT_INFORMED", flags:{}, T, m };
      case "NONE":  return ENV.assessmentSufficient()
                        ? { c:"TECHNOLOGY_WHITESPACE", flags:{}, T, m }
                        : { c:"NEEDS_VALIDATION", flags:{insufficientEvidence:true}, T, m };  /* regra congelada: whitespace exige evidência suficiente */
      case "DECLARED_UNSPECIFIED": return { c:"TECH_STATUS_UNVERIFIED", flags:{statusUnverified:true}, T, m };  /* E13 */
      case "PARTIAL_OPERATIONAL":  return { c:"COVERAGE_GAP", flags:{}, T, m };
      case "OPERATIONAL":          return { c:"OPERATIONAL_GAP", flags:{}, T, m };
      case "IN_FLIGHT":            return { c:"ADOPTION_GAP", flags:{}, T, m };
      case "EVALUATING":           return { c:"EVALUATION_IN_PROGRESS", flags:{}, T, m };                        /* E7 */
    }
  }
  /* mature */
  if (T.st==="OPERATIONAL" || T.st==="PARTIAL_OPERATIONAL") return { c:"MATURE_WITH_TECH", flags:{}, T, m };
  if (T.st==="DECLARED_UNSPECIFIED") return { c:"MATURE_WITH_TECH", flags:{statusUnverified:true}, T, m };
  if (T.st==="IN_FLIGHT" || T.st==="EVALUATING") return { c:"TECH_TRANSITION", flags:{}, T, m };                 /* E8 */
  if (T.st==="NONE") return { c:"POSSIBLE_CONTEXT_DIVERGENCE", flags:{}, T, m };
  return { c:null, flags:{}, T, m };
}

/* --------------- variants / architecture constraints (18 — K/P/T) --------------- */
function archSatisfied(req){
  if (!req) return "ok";
  const check = cond => Object.entries(cond).every(([k,v]) =>
    k==="edrSpecificNeed" ? signalOn("edrSpecificNeed") === v : ARCHITECTURE_CONTEXT[k] === v);
  const known = cond => Object.keys(cond).every(k =>
    k==="edrSpecificNeed" ? SESSION_SIGNALS.edrSpecificNeed !== "unset"
      : !["unknown","undefined","uninformed"].includes(ARCHITECTURE_CONTEXT[k]));
  if (req.anyOf){
    if (req.anyOf.some(check)) return "ok";
    if (req.anyOf.every(known)) return "violated";
    return "unknown";
  }
  if (check(req)) return "ok";
  return known(req) ? "violated" : "unknown";
}
function resolveCandidates(capId){
  /* candidatos DIRECT: relation primary + policy direct; partial entra com scopeNote (K).
     [P2.1-A] fit unknown JAMAIS vira candidato direto — agrupa por variantOf (antes) ou family
     e só gera placeholder "a definir" se NENHUM candidato resolvido cobrir o mesmo grupo. */
  const out = [];
  const unresolved = new Map();     /* groupKey -> [offeringIds] */
  Object.entries(OFFERINGS).forEach(([id,o])=>{
    if (o.contextAnchor) return;
    if (o.recommendationPolicy !== "direct-when-gap-and-whitespace") return;
    const rel = o.capabilityRelations.find(r => r.capability===capId && (r.relation==="primary"||r.relation==="partial"));
    if (!rel) return;
    const fit = archSatisfied(o.architectureRequires);
    if (fit === "violated") return;
    if (fit === "unknown"){
      const group = o.variantOf || o.family || id;
      unresolved.set(group, (unresolved.get(group)||[]).concat(id));
      return;
    }
    out.push({ itemId:id, itemKind:"offering", relation:rel.relation, scopeNote:rel.scopeNote||null, variantResolution:"atende" });
  });
  unresolved.forEach((vars, group) => {
    const covered = out.some(c => {
      const co = OFFERINGS[c.itemId] || {};
      return c.itemId===group || co.variantOf===group || co.family===group;
    });
    if (covered) return;
    out.push({ itemId:group, itemKind: (OFFERINGS[group] && OFFERINGS[group].entityType==="family") ? "family" : "family-of-variants",
      relation:"primary", scopeNote:null,
      variantResolution: group==="endpoint-family" ? "oferta a definir no aprofundamento"
                                                   : "modalidade/variante a definir (contexto arquitetural insuficiente)",
      variants: vars });
  });
  return out;
}

/* ------------------ service eligibility / requiredSignals (19) ------------------ */
function serviceEligibility(svcId){
  const svc = SERVICES[svcId];
  if (!svc) return { eligible:false, reason:"serviço inexistente" };
  if (svc.requiredSignals.length && !svc.requiredSignals.some(signalOn))
    return { eligible:false, reason:"sinal requerido ausente: "+svc.requiredSignals.join("|") };
  if (svc.eligibilityRequires){
    const er = svc.eligibilityRequires;
    const base = [];
    Object.values(TECH_LANDSCAPE).forEach(L => (L.solutions||[]).forEach(s => {
      const prod = (s.product||"").toLowerCase().replace(/\s+/g,"");
      if (er.baseOffering.some(b => prod.includes(b.replace(/-/g,"")))) base.push(s);
    }));
    if (!base.length) return { eligible:false, reason:"base requerida ausente ("+er.baseOffering.join("/")+")" };
    const allExcluded = base.every(s => s.deployment && er.baseDeploymentExcludes.includes(s.deployment));
    if (allExcluded) return { eligible:false, reason:"base declarada apenas em deployments não elegíveis ("+er.baseDeploymentExcludes.join("/")+") — OG oficial" };
    const someUnknown = base.some(s => !s.deployment);
    return { eligible:true, reason: someUnknown ? "elegível — validar deployment da base" : "base compatível" };
  }
  return { eligible:true, reason:"sem restrições" };
}

/* ---------------- FortiSOC suppression / architecture note (21 — S/L) ---------------- */
function declaredUnifiedPlatform(){
  const L = TECH_LANDSCAPE["soc-platform"];
  if (!L || L.presence!=="PRESENT") return null;
  const sol = (L.solutions||[]).find(s => /fortisoc/i.test(s.product||""));
  return sol ? { offeringId:"fortisoc", solution:sol } : { offeringId:null, solution:(L.solutions||[])[0]||null };
}
function suppressedByPlatform(){
  /* [P2.1-C] FortiSOC: cobertura via capabilityRelations do catálogo.
     Plataforma de TERCEIRO: NENHUMA cobertura inferida — apenas capabilities
     explicitamente declaradas em solutions[].coveredCapabilities suprimem point products.
     Extensão de schema declarada (como solution.deployment): solutions[].coveredCapabilities?:[capabilityIds]. */
  const L = TECH_LANDSCAPE["soc-platform"];
  if (!L || L.presence!=="PRESENT") return { caps:new Set(), plat:null };
  const caps = new Set();
  let plat = null;
  (L.solutions||[]).forEach(sol => {
    if (/fortisoc/i.test(sol.product||"")){
      plat = { offeringId:"fortisoc", solution:sol };
      OFFERINGS.fortisoc.capabilityRelations
        .filter(r=>r.relation==="embedded"||r.relation==="primary")
        .forEach(r=>caps.add(r.capability));
    } else {
      plat = plat || { offeringId:null, solution:sol };
      (sol.coveredCapabilities||[]).forEach(c=>caps.add(c));
    }
  });
  return { caps, plat };
}
function architectureNote(contexts){
  /* [P2.1-B] Opção B (FortiSOC) SOMENTE quando:
     (1) >=2 gaps CONFIRMADOS de maturidade em analytics/automation/incident-mgmt/detection-eng
         (continuous-monitoring NÃO conta);
     (2) fragmentação declarada no Landscape OU soc-platform.presence===NONE;
     (3) unifiedPlatformPreference !== "no" (consolidação não rejeitada);
     (4) Landscape relevante NÃO totalmente UNSET;
     Opção B exige ainda saasAllowed !== "no" e localProcessingRequired !== "yes" —
     violado isso, a nota (se existir) apresenta APENAS a rota A. */
  const coreIds = ["security-analytics","security-automation","incident-management","detection-engineering"];
  const coreGaps = coreIds.filter(id => contexts[id] && contexts[id].maturity &&
    (contexts[id].maturity.state==="gap-high" || contexts[id].maturity.state==="gap-moderate"));
  const relevant = coreIds.concat(["soc-platform"]);
  const relevantInformed = relevant.some(id => TECH_LANDSCAPE[id] && TECH_LANDSCAPE[id].presence !== "UNSET");
  const vendors = new Set();
  coreIds.forEach(id => (TECH_LANDSCAPE[id] && TECH_LANDSCAPE[id].solutions || []).forEach(s => s.vendor && vendors.add(s.vendor.toLowerCase())));
  const fragmentation = vendors.size >= 2;
  const socNone = TECH_LANDSCAPE["soc-platform"] && TECH_LANDSCAPE["soc-platform"].presence === "NONE";
  const show = coreGaps.length >= 2 && (fragmentation || socNone) &&
               ARCHITECTURE_CONTEXT.unifiedPlatformPreference !== "no" && relevantInformed;
  if (!show) return { show:false };
  const saasOk = ARCHITECTURE_CONTEXT.saasAllowed !== "no" && ARCHITECTURE_CONTEXT.localProcessingRequired !== "yes";
  return { show:true,
    optionA:"evoluir a stack atual por capability",
    optionB: saasOk ? "FortiSOC (plataforma SOC unificada, SaaS) como opção arquitetural" : null,
    basis:{ coreGaps, fragmentation, socPlatformNone: !!socNone } };
}

/* --------------- recommendation context capability-first (20 — G) --------------- */
function buildRecommendationContext(){
  if (isLegacyModeV32()) return { legacyMode:true, contexts:{}, architectureNote:{show:false}, licensedContext:{} };
  const lic = deriveLicensedContext();
  const sup = suppressedByPlatform();
  const priorities = ENV ? ENV.priorityIds() : [];
  const contexts = {};
  Object.keys(CAPABILITIES).forEach(capId => {
    const cls = classify(capId);
    const cap = CAPABILITIES[capId];
    const prioQ = (cap.questionIds||[]).filter(q => priorities.includes(q));
    const ctx = {
      capability: capId,
      maturity: cls.m || maturityStateOf(capId),
      businessPriority: { flag: prioQ.length>0, priorityFindingIds: prioQ, priorityQuestionIds: prioQ, prioritySources: prioQ.map(q=>({questionId:q, source:"business-priority-step"})) },
      techState: cls.T ? cls.T.st : deriveTechState(TECH_LANDSCAPE[capId]).st,
      classification: cls.c, flags: cls.flags,
      supportMode: null, candidates: [], services: [], notes: [], commercialOptions: []
    };
    switch (cls.c){
      case "TECHNOLOGY_WHITESPACE":
        ctx.supportMode = "DIRECT";
        ctx.candidates = resolveCandidates(capId);
        if (sup.caps.has(capId)){
          ctx.candidates = [];
          ctx.supportMode = "CONTEXTUAL";
          ctx.notes.push("capability coberta pela plataforma unificada declarada — foco em operacionalização, não em nova aquisição");
        }
        break;
      case "OPERATIONAL_GAP": case "COVERAGE_GAP": case "ADOPTION_GAP":
        ctx.supportMode = "CONTEXTUAL";
        ctx.notes.push(cls.c==="ADOPTION_GAP" ? "tecnologia contratada/em implantação — apoio em enablement/integração"
          : cls.c==="COVERAGE_GAP" ? "tecnologia operacional com cobertura parcial — apoio em expansão de cobertura"
          : "tecnologia operacional — apoio em operacionalização (nunca substituição)");
        if (sup.caps.has(capId)) ctx.notes.push("plataforma unificada declarada cobre esta capability — gap é operacional, explicável (M75)");
        if (capId==="endpoint-detection"){
          const base = (TECH_LANDSCAPE[capId].solutions||[]).some(s=>/forti(edr|endpoint)/i.test((s.product||"").replace(/\s+/g,"")));
          if (base) ctx.candidates.push({ itemId:"fortixdr", itemKind:"contextual-extension",
            relation:"contextual", scopeNote:"extensão de correlação sobre a base EDR instalada — nunca nova aquisição standalone (M50)" });
        }
        break;
      case "EVALUATION_IN_PROGRESS":
        ctx.supportMode = "CONTEXTUAL";
        ctx.notes.push("avaliação em curso — apoio em critérios de avaliação/PoC; sem candidatos de aquisição");
        break;
      case "TECH_STATUS_UNVERIFIED":
        ctx.supportMode = "VALIDATE";
        ctx.notes.push("tecnologia declarada sem status — validar estágio operacional antes de qualquer leitura de gap tecnológico");
        break;
      case "NEEDS_VALIDATION":
        ctx.supportMode = "VALIDATE"; break;
      case "CONTEXT_NOT_INFORMED":
        ctx.supportMode = "LEGACY-LABELLED"; break;
      case "UNASSESSED_CAPABILITY": {
        const adherent = [];
        Object.entries(OFFERINGS).forEach(([id,o])=>{
          const rel = o.capabilityRelations.find(r=>r.capability===capId && r.relation==="primary");
          if (rel && o.requiredSignals.length && o.requiredSignals.some(signalOn))
            adherent.push({ itemId:id, itemKind:"offering", relation:"contextual-by-signal",
              signals:o.requiredSignals.filter(signalOn) });
        });
        const L = TECH_LANDSCAPE[capId];
        if (adherent.length && L && (L.presence==="NONE"||L.presence==="UNSET"||L.presence==="PARTIAL")){
          ctx.supportMode = "CONTEXTUAL";
          ctx.candidates = adherent;                     /* contextualização, nunca DIRECT (G) */
          ctx.notes.push("habilitado por sinal explícito — conversa contextual/deep-dive; a recomendação nasce do sinal + contexto, jamais da ausência");
        } else if (L && L.declaredDriver){
          ctx.supportMode = "INVENTORY";
          ctx.notes.push("sinal registrado para aprofundamento: "+(L.declaredDriver.note||""));
        } else ctx.supportMode = "INVENTORY";
        /* licenciado em bundle (M62): concern + subscription já licenciada */
        if (lic[capId] && adherent.length){
          ctx.candidates = [];
          ctx.supportMode = "CONTEXTUAL";
          ctx.notes.push("capacidade já licenciada via "+lic[capId].join(", ")+" — apoio em adoção/configuração/cobertura, nunca recompra (M62)");
        }
        break;
      }
      case "MATURE_WITH_TECH": ctx.supportMode = "NONE"; break;
      case "TECH_TRANSITION":  ctx.supportMode = "NONE"; ctx.notes.push("capability madura com mudança tecnológica em curso — nota informativa"); break;
      case "POSSIBLE_CONTEXT_DIVERGENCE": ctx.supportMode = "VALIDATE"; ctx.notes.push("maturidade declarada alta sem tecnologia — validar divergência"); break;
      default: ctx.supportMode = "NONE";
    }
    /* [3.2.3-C] CTX de supporting relations marcadas: apoio contextual, nunca aquisição */
    if (ctx.maturity && (ctx.maturity.state==="gap-high"||ctx.maturity.state==="gap-moderate") &&
        ["TECHNOLOGY_WHITESPACE","OPERATIONAL_GAP","COVERAGE_GAP","ADOPTION_GAP"].includes(cls.c) &&
        !sup.caps.has(capId)){
      Object.entries(OFFERINGS).forEach(([oid,o])=>{
        const r = o.capabilityRelations.find(x=>x.capability===capId && x.contextTrigger===true);
        if (r && !ctx.candidates.some(x=>x.itemId===oid))
          ctx.candidates.push({ itemId:oid, itemKind:"contextual-support", relation:"contextual",
            scopeNote:"apoio contextual via relação de suporte — não é aquisição direta" });
      });
      /* [3.2.4-1] roteamento: whitespace SEM candidato DIRECT real (offering/family) e APENAS
         contextual-support → supportMode CONTEXTUAL; classification permanece TECHNOLOGY_WHITESPACE.
         Com >=1 candidato DIRECT real, permanece DIRECT. Supporting genérico jamais promovido. */
      if (cls.c==="TECHNOLOGY_WHITESPACE" && ctx.supportMode==="DIRECT"){
        const hasDirectReal = ctx.candidates.some(x=>["offering","family","family-of-variants"].includes(x.itemKind));
        const hasCtxSupport = ctx.candidates.some(x=>x.itemKind==="contextual-support");
        if (!hasDirectReal && hasCtxSupport) ctx.supportMode = "CONTEXTUAL";
      }
    }
    /* serviços aderentes (14/19) */
    Object.entries(SERVICES).forEach(([sid,svc])=>{
      const rel = svc.capabilityRelations.find(r=>r.capability===capId);
      if (!rel) return;
      const mm = cls.m || (cap.assessmentCoverage!=="none" ? maturityStateOf(capId) : null);
      const hasGap = !!(mm && (mm.state==="gap-high" || mm.state==="gap-moderate"));
      const el = serviceEligibility(sid);
      if (!el.eligible) return;
      if (svc.requiredSignals.length){                       /* gatilhado por sinal */
        ctx.services.push({ serviceId:sid, lifecycle:svc.lifecycle, triggeredBy:svc.requiredSignals.filter(signalOn), note:el.reason });
      } else if (hasGap && (rel.relation==="primary" || rel.gapTrigger===true)){  /* [3.2.2-B] gapTrigger machine-readable */
        ctx.services.push({ serviceId:sid, lifecycle:svc.lifecycle, triggeredBy:["capability-gap"], note:el.reason });
      }
    });
    /* camada comercial TERMINAL (22): só sobre itens já presentes */
    const withCommercial = ids => ids.map(c => {
      const item = OFFERINGS[c.itemId] || SERVICES[c.serviceId];
      const opts = (item && item.commercialOptions || []).filter(o=>o.eligibility!=="not-applicable");
      return opts.length ? Object.assign({}, c, { commercialOptions: opts }) : c;
    });
    ctx.candidates = withCommercial(ctx.candidates);
    ctx.services   = withCommercial(ctx.services);
    contexts[capId] = ctx;
  });
  return { legacyMode:false, contexts, architectureNote: architectureNote(contexts), licensedContext: lic };
}

/* ------------------------------ validateConfig 2.0 (14/U) ------------------------------ */
function validateConfigV32(){
  const errs = [];
  const err = m => errs.push(m);
  /* [P2.1.1] exception-safe: entrada malformada gera ERRO DE VALIDAÇÃO, nunca exceção —
     essencial porque a próxima fase terá UI escrevendo em TECH_LANDSCAPE/PLATFORM_CONTEXT. */
  const isArr = Array.isArray;
  try {
  const inEnum = (v, e) => ENUMS[e].includes(v);
  const composite = v => typeof v==="string" && /[\/()]/.test(v);
  /* capabilities */
  const capIds = Object.keys(CAPABILITIES);
  const qidsSeen = new Set();
  capIds.forEach(id => {
    const c = CAPABILITIES[id];
    if (!["core-soc","secops","adjacent-control"].includes(c.scope)) err("CAP "+id+": scope inválido");
    if (!["direct","partial","none"].includes(c.assessmentCoverage)) err("CAP "+id+": coverage inválido");
    if (c.assessmentCoverage==="none" && c.questionIds.length) err("CAP "+id+": coverage none com questionIds");
    c.questionIds.forEach(q => { if (qidsSeen.has(q)) err("CAP: questionId em duas capabilities — "+q); qidsSeen.add(q); });
  });
  /* offerings */
  Object.entries(OFFERINGS).forEach(([id,o])=>{
    if (!inEnum(o.entityType,"entityType") || composite(o.entityType)) err("OFF "+id+": entityType inválido/composto");
    if (!inEnum(o.deliveryType,"deliveryType") || composite(o.deliveryType)) err("OFF "+id+": deliveryType inválido/composto");
    o.deployment.forEach(d => { if (!inEnum(d,"deployment")) err("OFF "+id+": deployment fora do enum — "+d); });
    if (!inEnum(o.recommendationPolicy,"recommendationPolicy")) err("OFF "+id+": policy inválida");
    if (o.family && !OFFERINGS[o.family]) err("OFF "+id+": family órfã — "+o.family);
    if (o.variantOf && !OFFERINGS[o.variantOf]) err("OFF "+id+": variantOf órfão — "+o.variantOf);
    if (o.entityType==="variant" && !(o.family||o.variantOf)) err("OFF "+id+": variante sem família");
    if (o.architectureRole==="unified-platform" && o.recommendationPolicy==="direct-when-gap-and-whitespace")
      err("OFF "+id+": unified-platform com policy DIRECT (proibido)");
    if (!o.capabilityRelations.length && !o.contextAnchor) err("OFF "+id+": capabilityRelations vazia sem context-anchor");
    o.capabilityRelations.forEach(r=>{
      if (!CAPABILITIES[r.capability]) err("OFF "+id+": capability órfã — "+r.capability);
      if (!inEnum(r.relation,"relation")) err("OFF "+id+": relation inválida — "+r.relation);
      if (r.contextTrigger !== undefined && typeof r.contextTrigger !== "boolean") err("OFF "+id+": contextTrigger deve ser boolean");
    });
    o.solutionAreaRelations.forEach(r=>{
      if (!SOLUTION_AREAS[r.solutionArea]) err("OFF "+id+": solutionArea órfã — "+r.solutionArea);
      if (!inEnum(r.relation,"relation")) err("OFF "+id+": solutionArea relation inválida");
    });
    o.requiredSignals.forEach(s=>{ if (!SIGNAL_IDS.includes(s)) err("OFF "+id+": sinal inexistente — "+s); });
    o.commercialOptions.forEach(co=>{
      if (!COMMERCIAL_PROGRAMS[co.program]) err("OFF "+id+": programa comercial inexistente — "+co.program);
      if (!inEnum(co.eligibility,"eligibility")) err("OFF "+id+": eligibility inválida");
    });
  });
  /* solution areas: umbrella nunca direta; area não é SKU */
  Object.entries(SOLUTION_AREAS).forEach(([id,a])=>{
    if (a.parent && !SOLUTION_AREAS[a.parent]) err("AREA "+id+": parent órfão");
    if (a.recommendationPolicy && a.recommendationPolicy!=="never-direct") err("AREA "+id+": umbrella deve ser never-direct");
  });
  /* services */
  Object.entries(SERVICES).forEach(([id,s])=>{
    if (!inEnum(s.serviceType,"serviceType") || composite(s.serviceType)) err("SVC "+id+": serviceType inválido/composto");
    if (!inEnum(s.lifecycle,"lifecycle") || composite(s.lifecycle)) err("SVC "+id+": lifecycle inválido/composto");
    if (s.serviceType==="reactive-service" && !s.requiredSignals.length) err("SVC "+id+": reactive-service sem requiredSignals");
    s.requiredSignals.forEach(x=>{ if (!SIGNAL_IDS.includes(x)) err("SVC "+id+": sinal inexistente — "+x); });
    s.capabilityRelations.forEach(r=>{
      if (!CAPABILITIES[r.capability]) err("SVC "+id+": capability órfã — "+r.capability);
      if (!inEnum(r.relation,"relation")) err("SVC "+id+": relation inválida");
      if (r.gapTrigger !== undefined && typeof r.gapTrigger !== "boolean") err("SVC "+id+": gapTrigger deve ser boolean");
    });
    if (s.eligibilityRequires){
      s.eligibilityRequires.baseOffering.forEach(b=>{ if (!OFFERINGS[b]) err("SVC "+id+": baseOffering órfã — "+b); });
      s.eligibilityRequires.baseDeploymentExcludes.forEach(d=>{ if (!inEnum(d,"deployment")) err("SVC "+id+": exclude fora do enum — "+d); });
    }
    if (s.serviceType!==undefined && SERVICE_FAMILIES[id]) err("SVC "+id+": id colide com family");
  });
  /* service families (E14) */
  Object.entries(SERVICE_FAMILIES).forEach(([id,f])=>{
    if (SERVICES[id]) err("FAMSVC "+id+": family não pode existir também em SERVICES");
    if (f.serviceType || f.lifecycle) err("FAMSVC "+id+": family com serviceType/lifecycle (proibido)");
    f.members.forEach(m=>{ if (!SERVICES[m]) err("FAMSVC "+id+": member inexistente — "+m); });
  });
  /* subscriptions + bundles */
  Object.entries(SECURITY_SUBSCRIPTIONS).forEach(([id,s])=>{
    if (s.deliveryType!=="security-subscription") err("SUB "+id+": deliveryType deve ser security-subscription");
    s.consumedBy.forEach(c=>{ if (!OFFERINGS[c]) err("SUB "+id+": consumedBy órfão — "+c); });
    s.capabilityRelations.forEach(r=>{ if (!CAPABILITIES[r.capability]) err("SUB "+id+": capability órfã"); });
  });
  Object.entries(BUNDLES).forEach(([id,b])=>{
    if (!OFFERINGS[b.appliesTo]) err("BUNDLE "+id+": appliesTo órfão");
    b.includesSubscriptions.forEach(s=>{ if (!SECURITY_SUBSCRIPTIONS[s]) err("BUNDLE "+id+": subscription inexistente — "+s); });
    if (CAPABILITIES[id]) err("BUNDLE "+id+": bundle nunca vira capability");
  });
  ["atp","utp","ent"].reduce((prev,cur)=>{
    if (prev && !BUNDLES[prev].includesSubscriptions.every(s=>BUNDLES[cur].includesSubscriptions.includes(s)))
      err("BUNDLE: composição não respeita "+cur.toUpperCase()+" ⊇ "+prev.toUpperCase());
    return cur; }, null);
  /* commercial programs (17/U) */
  Object.entries(COMMERCIAL_PROGRAMS).forEach(([id,p])=>{
    if (p.deliveryType!=="licensing-program") err("PROG "+id+": deliveryType deve ser licensing-program");
  });
  Object.values(OFFERINGS).forEach(o=>{
    if (ENUMS.recommendationPolicy.includes("fortiflex")) err("PROG: programa como policy (impossível por enum)");
  });
  /* platform context */
  if (!isArr(PLATFORM_CONTEXT.declaredPlatforms)){ err("PLAT: declaredPlatforms deve ser array"); }
  (isArr(PLATFORM_CONTEXT.declaredPlatforms) ? PLATFORM_CONTEXT.declaredPlatforms : []).forEach((p,i)=>{
    if (!p || typeof p !== "object"){ err("PLAT["+i+"]: entrada malformada"); return; }
    if (p.subscriptions !== undefined && !isArr(p.subscriptions)){ err("PLAT["+i+"]: subscriptions deve ser array"); return; }
    if (!OFFERINGS[p.platform]) err("PLAT["+i+"]: platform órfã — "+p.platform);
    if (p.bundle && !BUNDLES[p.bundle]) err("PLAT["+i+"]: bundle inexistente — "+p.bundle);
    if (p.bundle && BUNDLES[p.bundle] && BUNDLES[p.bundle].appliesTo!==p.platform) err("PLAT["+i+"]: bundle incompatível com platform");
    (p.subscriptions||[]).forEach(s=>{ if (!SECURITY_SUBSCRIPTIONS[s]) err("PLAT["+i+"]: subscription inexistente — "+s); });
  });
  /* landscape */
  Object.entries(TECH_LANDSCAPE).forEach(([id,L])=>{
    if (!L || typeof L !== "object"){ err("LAND "+id+": entrada malformada (esperado objeto)"); return; }
    if (!CAPABILITIES[id] || !CAPABILITIES[id].landscapeEnabled) err("LAND "+id+": capability não habilitada");
    if (!ENUMS.presence.includes(L.presence)) err("LAND "+id+": presence fora do enum");
    if (L.solutions !== undefined && !isArr(L.solutions)){ err("LAND "+id+": solutions deve ser array"); return; }
    (L.solutions||[]).forEach(s=>{
      if (!s || typeof s !== "object"){ err("LAND "+id+": solution malformada (esperado objeto)"); return; }
      if (s.coveredCapabilities !== undefined && !isArr(s.coveredCapabilities)){
        err("LAND "+id+": coveredCapabilities deve ser array de capability IDs"); return; }
      if (s.status && !ENUMS.solutionStatus.includes(s.status)) err("LAND "+id+": status fora do enum — "+s.status);
      if (s.deployment && !ENUMS.deployment.includes(s.deployment)) err("LAND "+id+": deployment fora do enum — "+s.deployment);
      (s.coveredCapabilities||[]).forEach(cc=>{ if (!CAPABILITIES[cc]) err("LAND "+id+": coveredCapabilities com capability órfã — "+cc); });
    });
  });
  /* FortiAI (U) */
  if (SOLUTION_AREAS.fortiai.recommendationPolicy!=="never-direct") err("FORTIAI: umbrella deve ser never-direct");
  const aig = OFFERINGS.fortiaigate;
  if (!aig.capabilityRelations.some(r=>r.capability==="ai-runtime-security" && r.relation==="primary"))
    err("FORTIAIGATE: deve ter ai-runtime-security primary");
  } catch(e){ err("VALIDATOR: exceção inesperada capturada — "+e.message+" (configuração malformada; corrigir entrada)"); }
  return errs;
}

/* ------------------------------- exports ------------------------------- */
Object.assign(V32, { ENUMS, CAPABILITIES, SOLUTION_AREAS, OFFERINGS, SERVICES, SERVICE_FAMILIES,
  SECURITY_SUBSCRIPTIONS, BUNDLES, COMMERCIAL_PROGRAMS,
  TECH_LANDSCAPE, ARCHITECTURE_CONTEXT, PLATFORM_CONTEXT, SESSION_SIGNALS, SIGNAL_IDS,
  resetLandscapeToUnset, isLegacyModeV32, deriveLicensedContext, configure,
  maturityStateOf, deriveTechState, classify, archSatisfied, resolveCandidates,
  serviceEligibility, suppressedByPlatform, architectureNote, buildRecommendationContext,
  validateConfigV32 });
root.V32 = V32;
if (typeof module !== "undefined" && module.exports) module.exports = V32;
})(typeof globalThis !== "undefined" ? globalThis : this);
