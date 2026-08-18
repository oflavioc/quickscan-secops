/* ============================================================================
   QUICKSCAN V3.2 · TECHNOLOGY LANDSCAPE UI — MILESTONE 3.1
   Camada exclusivamente de INTERFACE sobre as APIs congeladas do engine V3.2.
   NENHUMA função do engine ou da Camada 1 é alterada; o único acoplamento é o
   wrapper de apresentação sobre renderResults (pós-render, aditivo).
   Invariante M43 verificada EM RUNTIME a cada salvamento.
   ============================================================================ */
(function(){
"use strict";

/* ---------------- rótulos (nunca enums crus) ---------------- */
const PRESENCE_LABELS = { UNSET:"Não informado", NONE:"Não existe / não utilizamos",
  PARTIAL:"Existe parcialmente", PRESENT:"Existe", UNKNOWN:"Precisa ser validado" };
const STATUS_LABELS = { "":"Não informado", "evaluation":"Em avaliação", "contracted":"Contratado",
  "deploying":"Em implantação", "partial-production":"Produção parcial", "production":"Produção",
  "broad-production":"Produção ampla" };
const CLASS_LABELS = {
  TECHNOLOGY_WHITESPACE:"Ausência confirmada de tecnologia (whitespace)",
  OPERATIONAL_GAP:"Gap operacional com tecnologia existente",
  ADOPTION_GAP:"Gap de adoção (tecnologia contratada/em implantação)",
  COVERAGE_GAP:"Gap de cobertura (tecnologia parcial/segmentada)",
  EVALUATION_IN_PROGRESS:"Avaliação de tecnologia em curso",
  TECH_STATUS_UNVERIFIED:"Tecnologia declarada — status a validar",
  MATURE_WITH_TECH:"Capability madura com tecnologia operacional",
  TECH_TRANSITION:"Capability madura com mudança tecnológica em curso",
  POSSIBLE_CONTEXT_DIVERGENCE:"Possível divergência a validar (maturidade alta sem tecnologia)",
  NEEDS_VALIDATION:"Requer validação",
  CONTEXT_NOT_INFORMED:"Contexto tecnológico não informado",
  UNASSESSED_CAPABILITY:"Capability não avaliada pelo quickscan" };
const NEUTRAL_TEXT = {
  TECHNOLOGY_WHITESPACE:"Gap de maturidade com ausência confirmada — candidato a conversa de aquisição na próxima etapa.",
  OPERATIONAL_GAP:"A tecnologia existe; a leitura aponta para operacionalização, nunca substituição.",
  ADOPTION_GAP:"Tecnologia contratada/em implantação; apoio em enablement e integração.",
  COVERAGE_GAP:"Tecnologia operacional com cobertura parcial; apoio em expansão de cobertura.",
  EVALUATION_IN_PROGRESS:"Avaliação em curso; apoio em critérios de avaliação/PoC.",
  TECH_STATUS_UNVERIFIED:"Tecnologia declarada sem status — validar estágio operacional antes de conclusões.",
  MATURE_WITH_TECH:"Sem ação recomendada.",
  TECH_TRANSITION:"Nota informativa: mudança tecnológica em curso sobre base madura.",
  POSSIBLE_CONTEXT_DIVERGENCE:"Maturidade declarada alta sem tecnologia — validar em aprofundamento.",
  NEEDS_VALIDATION:"Evidência insuficiente para classificar — validar em aprofundamento.",
  CONTEXT_NOT_INFORMED:"Sem contexto declarado; leitura V3.1.3 preservada.",
  UNASSESSED_CAPABILITY:"Registrada apenas como contexto; não afeta a maturidade." };
const ARCH_FIELDS = [
  { k:"saasAllowed", t:"SaaS permitido?", opts:[["unknown","Não informado"],["yes","Sim"],["no","Não"]] },
  { k:"localProcessingRequired", t:"Processamento local obrigatório?", opts:[["unknown","Não informado"],["yes","Sim"],["no","Não"]] },
  { k:"otIsolated", t:"Ambiente OT/isolado?", opts:[["unknown","Não informado"],["yes","Sim"],["no","Não"]] },
  { k:"unifiedPlatformPreference", t:"Preferência por plataforma unificada?", opts:[["undefined","Não informado"],["unified","Sim, consolidar"],["no","Não — manter stack atual"]] },
  { k:"environmentProfile", t:"Perfil do ambiente", opts:[["uninformed","Não informado"],["cloud-first","Cloud-first"],["hybrid","Híbrido"],["on-prem","Predominantemente on-premises"]] },
  { k:"dataResidency", t:"Residência/localidade de dados", opts:[["uninformed","Não informado"],["local-required","Residência local exigida"],["regulated","Setor regulado"],["no-constraint","Sem restrição declarada"]] }
];
const SIGNAL_GROUPS = [
  { t:"Incidente / SOC", ids:["activeIncident","suspectedCompromise","ransomwareConcern","wantsIRReadiness","wantsSOCAssessment","wantsSOCDevelopment"] },
  { t:"E-mail / Dados",  ids:["becConcern","emailSecurityConcern","dataLeakageConcern","insiderRiskConcern","complianceDataProtection"] },
  { t:"IA",              ids:["shadowAIConcern","aiUsageRisk","organizationBuildsAIApps","usesPrivateLLMs","usesAgenticAI","aiRuntimeSecurityConcern","promptInjectionConcern","llmDataLeakageConcern"] },
  { t:"Identidade / Endpoint", ids:["identityRiskConcern","pamRequirement","edrSpecificNeed"] }
];
const SIGNAL_FIELDS = [
  ["activeIncident","Incidente ativo"], ["suspectedCompromise","Suspeita de comprometimento"],
  ["ransomwareConcern","Preocupação com ransomware"], ["dataLeakageConcern","Vazamento de dados"],
  ["insiderRiskConcern","Insider risk"], ["shadowAIConcern","Shadow AI"],
  ["usesPrivateLLMs","Uso de LLM privado"], ["organizationBuildsAIApps","Aplicações/agentes de IA"],
  ["aiRuntimeSecurityConcern","Segurança de runtime de IA"], ["wantsSOCAssessment","Interesse em SOC Assessment"]
];
const LIFECYCLE_LABELS = { prepare:"Preparação", assess:"Avaliação", respond:"Resposta", operate:"Operação" };
const KIND_LABELS = {
  "offering":"aquisição candidata", "family":"modalidade a definir", "family-of-variants":"modalidade a definir",
  "contextual-extension":"extensão contextual da base instalada", "contextual-by-signal":"habilitado por sinal declarado", "contextual-support":"apoio contextual (relação de suporte)" };
const ELIG_LABELS = { confirmed:"confirmada", unknown:"a validar" };
const MSTATE_LABELS = { "gap-high":"gap alto", "gap-moderate":"gap moderado",
  "needs-validation":"a validar", "mature":"maduro", "not-assessed":"não avaliada" };
const TSTATE_LABELS = { UNSET:"não informado", NONE:"ausência confirmada", UNKNOWN:"a validar",
  DECLARED_UNSPECIFIED:"declarada sem status", EVALUATING:"em avaliação", IN_FLIGHT:"contratada/em implantação",
  PARTIAL_OPERATIONAL:"parcialmente operacional", OPERATIONAL:"operacional" };
const SIG_LABELS = { activeIncident:"Incidente ativo", suspectedCompromise:"Suspeita de comprometimento",
  ransomwareConcern:"Preocupação com ransomware", dataLeakageConcern:"Vazamento de dados",
  insiderRiskConcern:"Insider risk", shadowAIConcern:"Shadow AI", usesPrivateLLMs:"Uso de LLM privado",
  organizationBuildsAIApps:"Aplicações/agentes de IA", aiRuntimeSecurityConcern:"Segurança de runtime de IA",
  wantsSOCAssessment:"Interesse em SOC Assessment", becConcern:"Preocupação com BEC",
  emailSecurityConcern:"Segurança de e-mail", complianceDataProtection:"Compliance de proteção de dados",
  identityRiskConcern:"Risco de identidade", pamRequirement:"Requisito de PAM",
  wantsSOCDevelopment:"Desenvolvimento de SOC", wantsIRReadiness:"Prontidão de IR",
  aiUsageRisk:"Risco de uso de IA", usesAgenticAI:"Agentes de IA",
  promptInjectionConcern:"Prompt injection", llmDataLeakageConcern:"Vazamento via LLM",
  edrSpecificNeed:"Necessidade específica de EDR" };
const sigPT = k => SIG_LABELS[k] || k;
function qLabel(qid){
  const item = QS.find(x=>x.id===qid);
  if (!item) return qid;
  const t = item.q || qid;
  return t.length>72 ? t.slice(0,69).replace(/\s+\S*$/,"")+"…" : t;
}
const PROGRAM_EXPLAIN = {
  fortipoints:"Créditos consolidados utilizados no ecossistema FortiMarketplace; quando aplicável, podem ser transferidos para FortiFlex Points.",
  fortiflex:"Modelo de licenciamento baseado em pontos para ofertas suportadas.",
  fortimarketplace:"Portal de consumo; contexto comercial, não uma capability SecOps." };
function commercialHTML(opts){
  if (!opts || !opts.length) return "";
  return `<div class="v32-comm"><div class="v32-comm-t">Opções de consumo/licenciamento</div>
    ${opts.map(o=>{ const p=V32.COMMERCIAL_PROGRAMS[o.program]||{};
      return `<div class="v32-comm-item"><b>${esc32(p.name||o.program)}</b> · elegibilidade ${esc32(ELIG_LABELS[o.eligibility]||o.eligibility)}
        ${p.mechanism?`<div class="v32-scopenote v32-mech">mecanismo: ${esc32(p.mechanism)}</div>`:""}
        ${PROGRAM_EXPLAIN[o.program]?`<div class="v32-scopenote v32-explain">${esc32(PROGRAM_EXPLAIN[o.program])}</div>`:""}
        ${o.note?`<div class="v32-scopenote v32-commnote">${esc32(o.note)}</div>`:""}</div>`;}).join("")}
  </div>`;
}
const SUPPORT_TITLES = { DIRECT:"Apoio direto — ausência confirmada de tecnologia",
  CONTEXTUAL:"Apoio contextual — operacionalização e serviços", VALIDATE:"A validar em aprofundamento" };
const HIDE_EYEBROWS = ["Como a Fortinet pode apoiar nas prioridades declaradas",
  "Como a Fortinet pode apoiar agora", "Pode fazer sentido — após validação"];

/* ---------------- grupos derivados do REGISTRY (sem lista hardcoded) ---------------- */
function landscapeGroups(){
  const ids = Object.keys(V32.CAPABILITIES).filter(id => V32.CAPABILITIES[id].landscapeEnabled);
  return [
    { id:"g1", t:"SOC & Operations", open:true,  caps: ids.filter(id => V32.CAPABILITIES[id].scope==="core-soc") },
    { id:"g2", t:"Detection & Telemetry", open:true, caps: ids.filter(id => V32.CAPABILITIES[id].scope==="secops") },
    { id:"g3", t:"Advanced / Adjacent Controls", open:false, caps: ids.filter(id => V32.CAPABILITIES[id].scope==="adjacent-control") }
  ];
}

/* ---------------- snapshot legado (invariante M43) ---------------- */
function legacySnapshot(){
  const stats = DOMS.map((_,i)=>domStat(i));
  const suff = dataSufficiency(stats);
  const scored = stats.filter(s=>s.score!==null);
  const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;
  const {findings, validate} = computeFindings();
  return JSON.stringify({ ans: ans.slice(), prio: Array.from(businessPriority),
    domains: stats.map(s=>({score:s.score,conf:s.conf,n:s.n,nNA:s.nNA})), suff, overall,
    findings: findings.map(f=>({id:f.id,sev:f.sev,lvl:f.lvl})), validate });
}

/* ---------------- estado do controller ---------------- */
let draft = null;            /* cópia de trabalho; só vira estado no Salvar */
let lastCtx = null;          /* resultado de buildRecommendationContext() */

function newDraft(){
  return {
    land: JSON.parse(JSON.stringify(V32.TECH_LANDSCAPE)),
    arch: Object.assign({}, V32.ARCHITECTURE_CONTEXT),
    plat: JSON.parse(JSON.stringify(V32.PLATFORM_CONTEXT)),
    sig:  Object.assign({}, V32.SESSION_SIGNALS)
  };
}

/* ---------------- render: blocos pós-resultado ---------------- */
function ensurePanel(app){
  let p = document.getElementById("v32panel");
  if(!p){
    p = document.createElement("div");
    p.id = "v32panel";
    const screen = app.querySelector("section.screen") || app;
    const actions = screen.querySelector(".result-actions, #review") ?
      (screen.querySelector("#review") ? screen.querySelector("#review").parentElement : null) : null;
    if (actions) screen.insertBefore(p, actions); else screen.appendChild(p);
  }
  return p;
}
function hideLegacyRecommendation(app, hide){
  /* [3.1.1-E] esconde APENAS os blocos deliberadamente definidos: os 3 títulos de
     recomendação legada e o conteúdo imediato deles (apoio-block / t-list / details.t-details).
     Qualquer outro nó (.actions, .next, "Capabilities a validar", botões) interrompe o
     escopo e permanece visível. Comportamento temporário de Print/PDF e "Próximo passo":
     seguem visíveis; a recomendação legada oculta também não sai no print (display:none). */
  const screen = app.querySelector("section.screen"); if(!screen) return;
  let hiding = false;
  Array.from(screen.children).forEach(node=>{
    if (node.id==="v32panel"){ hiding=false; return; }
    const isTitle = node.classList && node.classList.contains("section-title");
    if (isTitle){
      const t = node.querySelector(".eyebrow") ? node.querySelector(".eyebrow").textContent.trim() : "";
      hiding = HIDE_EYEBROWS.includes(t);
      node.classList.toggle("v32-hidden", hide && hiding);
      return;
    }
    const allowed = node.classList && (node.classList.contains("apoio-block") ||
      node.classList.contains("t-list") || node.classList.contains("t-details") ||
      node.classList.contains("prio-decl") && false);
    if (hiding && allowed) node.classList.toggle("v32-hidden", hide);
    else { if (hiding && !allowed) hiding = false; node.classList.remove("v32-hidden"); }
  });
}
function renderBlocks(app){
  const p = ensurePanel(app);
  const legacy = V32.isLegacyModeV32();
  if (legacy){
    hideLegacyRecommendation(app, false);
    p.innerHTML = `
      <div class="v32-cta-box">
        <button class="btn2" id="v32cta" aria-expanded="false">Adicionar contexto tecnológico</button>
        <div class="v32-sub">Opcional · refine a interpretação dos gaps informando tecnologias e serviços já existentes.</div>
      </div>
      <div id="v32editor" class="v32-hidden" aria-live="off"></div>`;
  } else {
    lastCtx = V32.buildRecommendationContext();   /* [3.1.1-D] sem cache stale: reflete respostas/prioridades atuais */
    const ctxs = lastCtx.contexts;
    const declared = Object.keys(V32.TECH_LANDSCAPE)
      .filter(id => V32.TECH_LANDSCAPE[id].presence !== "UNSET")
      .map(id => {
        const L = V32.TECH_LANDSCAPE[id];
        const techs = (L.solutions||[]).filter(s=>s.product||s.vendor)
          .map(s => esc([s.vendor, s.product].filter(Boolean).join(" ")) +
            (s.status ? " · " + esc(STATUS_LABELS[s.status]||s.status) : "")).join("; ");
        return `<div class="v32-decl-row"><strong>${esc(V32.CAPABILITIES[id].name)}</strong>
          <span class="v32-state v32-state-${L.presence.toLowerCase()}">${PRESENCE_LABELS[L.presence]}</span>
          ${techs ? `<span class="v32-techs">${techs}</span>` : ""}</div>`;
      }).join("");
    const interp = Object.keys(ctxs).filter(id => {
        const c = ctxs[id];
        if (!c.classification) return false;
        if (c.classification==="CONTEXT_NOT_INFORMED") return false;
        if (c.classification==="UNASSESSED_CAPABILITY" && V32.TECH_LANDSCAPE[id] && V32.TECH_LANDSCAPE[id].presence==="UNSET") return false;
        return true;
      }).map(id => {
        const c = ctxs[id];
        let extra = "";
        (c.candidates||[]).forEach(cd => {
          if (cd.itemKind==="family" || cd.itemKind==="family-of-variants")
            extra += ` · ${esc((V32.OFFERINGS[cd.itemId]||{}).name || cd.itemId)} · modalidade a definir`;
        });
        return `<div class="v32-interp-row">
          <strong>${esc(V32.CAPABILITIES[id].name)}</strong>
          <span class="v32-class">${esc(CLASS_LABELS[c.classification]||c.classification)}</span>
          <span class="v32-neutral">${esc(NEUTRAL_TEXT[c.classification]||"")}${extra}</span></div>`;
      }).join("");
    hideLegacyRecommendation(app, true);
    const sigsOn = V32.SIGNAL_IDS.filter(k=>V32.SESSION_SIGNALS[k]===true);
    const fgt = (V32.PLATFORM_CONTEXT.declaredPlatforms||[]).find(x=>x&&x.platform==="fortigate");
    const sigBlock = sigsOn.length ? `<div class="section-title"><div class="eyebrow">Requisitos e preocupações declarados</div></div>
      <div class="v32-block" id="v32sigs">${sigsOn.map(k=>`<span class="v32-tag">${esc32(sigPT(k))}</span>`).join(" ")}</div>` : "";
    const entBlock = fgt ? `<div class="section-title"><div class="eyebrow">Plataformas e licenciamento declarados</div></div>
      <div class="v32-block" id="v32ent"><b>FortiGate declarado</b>
        <div class="v32-neutral">Bundle: ${fgt.bundle&&V32.BUNDLES[fgt.bundle]?esc32(V32.BUNDLES[fgt.bundle].name):"não informado"}</div>
        ${(fgt.subscriptions||[]).length?`<div class="v32-neutral">Subscriptions adicionais declaradas: ${fgt.subscriptions.map(s=>esc32((V32.SECURITY_SUBSCRIPTIONS[s]||{}).name||s)).join("; ")}</div>`:""}
        <div class="v32-scopenote">Entitlement é contexto para evitar recompra e orientar adoção — não prova implementação, cobertura ou maturidade.</div></div>` : "";
    p.innerHTML = sigBlock + entBlock + `
      <div class="section-title"><div class="eyebrow">Contexto tecnológico declarado</div></div>
      <div class="v32-block" id="v32decl">${declared || '<div class="v32-neutral">Nenhuma capability declarada.</div>'}</div>
      <div class="section-title"><div class="eyebrow">Interpretação do contexto</div></div>
      <div class="v32-block" id="v32interp">${interp || '<div class="v32-neutral">Sem itens a interpretar.</div>'}</div>
      <div id="v32support">${buildSupportHTML(lastCtx)}</div>
      <div class="v32-cta-box">
        <button class="btn2" id="v32cta" aria-expanded="false">Editar contexto tecnológico</button>
        <button class="btn2" id="v32clear">Limpar contexto tecnológico</button>
      </div>
      <div id="v32editor" class="v32-hidden"></div>`;
    const clr = document.getElementById("v32clear");
    if (clr) clr.onclick = ()=>{ V32.resetLandscapeToUnset(); lastCtx=null; renderBlocks(app); if (window.__uxDecor) window.__uxDecor(app); };
  }
  const cta = document.getElementById("v32cta");
  if (cta) cta.onclick = ()=>{ openEditor(app); cta.setAttribute("aria-expanded","true"); };
}

/* ---------------- editor ---------------- */
function escAttr(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;")
  .replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function esc32(s){ return escAttr(s); }   /* seguro para texto E atributos */
function solRow(capId, i, s){
  const statusOpts = Object.entries(STATUS_LABELS).map(([v,l])=>
    `<option value="${v}"${(s.status||"")===v?" selected":""}>${l}</option>`).join("");
  const depOpts = [""].concat(V32.ENUMS.deployment).map(v=>
    `<option value="${v}"${(s.deployment||"")===v?" selected":""}>${v||"Não informado"}</option>`).join("");
  const isSocPlat = capId==="soc-platform";
  const thirdParty = isSocPlat && !( /fortisoc/i.test(s.product||"") );
  const cov = thirdParty ? `
    <details class="v32-cov"><summary>Cobertura da plataforma</summary>
      <div class="v32-cov-q">Quais capacidades esta plataforma efetivamente entrega?</div>
      <div class="v32-cov-grid">${Object.keys(V32.CAPABILITIES).filter(c=>c!=="soc-platform").map(c=>
        `<label><input type="checkbox" data-cov="${c}" id="v32-sol-${capId}-${i}-cov-${c}"
          ${(s.coveredCapabilities||[]).includes(c)?" checked":""}> ${esc32(V32.CAPABILITIES[c].name)}</label>`).join("")}
      </div></details>` : "";
  return `<div class="v32-solrow" data-cap="${capId}" data-i="${i}">
    <label>Fabricante <input type="text" id="v32-sol-${capId}-${i}-vendor" value="${esc32(s.vendor)}" placeholder="qualquer fabricante"></label>
    <label>Produto / solução <input type="text" id="v32-sol-${capId}-${i}-product" value="${esc32(s.product)}" placeholder="campo livre"></label>
    <label>Status <select id="v32-sol-${capId}-${i}-status">${statusOpts}</select></label>
    <label>Cobertura / escopo <input type="text" id="v32-sol-${capId}-${i}-coverage" value="${esc32(s.coverage)}"></label>
    <label>Deployment <select id="v32-sol-${capId}-${i}-deployment">${depOpts}</select></label>
    <label>Notas <input type="text" id="v32-sol-${capId}-${i}-notes" value="${esc32(s.notes)}"></label>
    ${cov}
    <button class="btn2 v32-rm" data-cap="${capId}" data-i="${i}" type="button" aria-label="Remover tecnologia">Remover</button>
  </div>`;
}
function capEditor(capId){
  const L = draft.land[capId];
  const presOpts = Object.entries(PRESENCE_LABELS).map(([v,l])=>
    `<option value="${v}"${L.presence===v?" selected":""}>${l}</option>`).join("");
  const showSols = L.presence==="PRESENT" || L.presence==="PARTIAL";
  return `<div class="v32-cap" id="v32-cap-${capId}">
    <div class="v32-cap-head">
      <span class="v32-cap-name">${esc32(V32.CAPABILITIES[capId].name)}</span>
      <label class="v32-pres">Situação declarada
        <select id="v32-pres-${capId}" data-cap="${capId}">${presOpts}</select></label>
    </div>
    ${L.presence==="NONE" ? `<div class="v32-micro" role="note">Use esta opção somente quando a ausência da capacidade/tecnologia tiver sido confirmada.</div>` : ""}
    ${L.presence!=="UNSET" ? `<label class="v32-driver-lab">Motivo declarado para aprofundamento · opcional
      <input type="text" id="v32-driver-${capId}" value="${escAttr((L.declaredDriver&&L.declaredDriver.note)||"")}"></label>` : ""}
    ${showSols ? `<div class="v32-sols" id="v32-sols-${capId}">
        ${(L.solutions||[]).map((s,i)=>solRow(capId,i,s)).join("")}
        <button class="btn2 v32-add" id="v32-add-${capId}" data-cap="${capId}" type="button">Adicionar tecnologia</button>
      </div>` : ""}
  </div>`;
}
let editorOrigin = "results";
function closeEditorToOrigin(app){
  if (editorOrigin === "home"){ editorOrigin = "results"; draft = null; step = -1; render(); return true; }
  return false;
}
function openEditor(app, origin){
  editorOrigin = origin || "results";
  draft = newDraft();
  paintEditor(app);
  const ed = document.getElementById("v32editor");
  ed.classList.remove("v32-hidden");
  const first = ed.querySelector("select, input, button"); if (first) first.focus();
}
function paintEditor(app){
  const ed = document.getElementById("v32editor"); if(!ed) return;
  const prevOpen = {};
  ed.querySelectorAll("details.v32-group[data-gid]").forEach(dt=>{ prevOpen[dt.getAttribute("data-gid")] = dt.open; });
  const isOpen = (gid, def) => (gid in prevOpen) ? prevOpen[gid] : def;
  const groups = landscapeGroups().map(g => `
    <details class="v32-group" data-gid="${g.id}"${isOpen(g.id,g.open)?" open":""}><summary>${g.t}</summary>
      ${g.caps.map(capEditor).join("")}
    </details>`).join("");
  const arch = `<details class="v32-group" data-gid="arch"${isOpen("arch",false)?" open":""}><summary>Restrições e preferências de arquitetura</summary>
    <div class="v32-arch">${ARCH_FIELDS.map(f=>`
      <label>${f.t}<select id="v32-arch-${f.k}">${f.opts.map(([v,l])=>
        `<option value="${v}"${draft.arch[f.k]===v?" selected":""}>${l}</option>`).join("")}</select></label>`).join("")}
    </div></details>`;
  const declared = (draft.plat.declaredPlatforms||[]).find(p => p && p.platform==="fortigate") || null;   /* [3.3.3.1-A] */
  const bundle = declared ? (declared.bundle||"") : "";
  const plat = `<details class="v32-group" data-gid="plat"${isOpen("plat",false)?" open":""}><summary>Plataformas e licenciamento já existentes</summary>
    <fieldset class="v32-plat"><legend>FortiGate</legend>
      <label><input type="checkbox" id="v32-plat-fgt"${declared?" checked":""}> FortiGate declarado no ambiente</label>
      <fieldset class="v32-bundles"><legend>Bundle de serviços FortiGuard (se conhecido)</legend>
        ${[["","Nenhum bundle informado"],["atp","ATP"],["utp","UTP"],["ent","Enterprise Protection"]].map(([v,l])=>
          `<label><input type="radio" name="v32-bundle" value="${v}"${bundle===v?" checked":""}> ${l}</label>`).join("")}
      </fieldset>
      <fieldset class="v32-subs"><legend>Serviços FortiGuard / subscriptions conhecidos</legend>
        <div class="v32-micro">Marque apenas o que foi explicitamente declarado. "Incluído pelo bundle" é informativo e não grava declaração. Subscription não listada NÃO significa ausente.</div>
        <div class="v32-signals">${Object.entries(V32.SECURITY_SUBSCRIPTIONS).map(([sid,sub])=>{
          const inBundle = bundle && V32.BUNDLES[bundle] && V32.BUNDLES[bundle].includesSubscriptions.includes(sid);
          const checked = declared && Array.isArray(declared.subscriptions) && declared.subscriptions.includes(sid);
          return `<label><input type="checkbox" id="v32-sub-${sid}"${checked?" checked":""}> ${esc32(sub.name)}${inBundle?' <span class="v32-tag v32-bundletag">incluído pelo bundle</span>':""}</label>`;}).join("")}
        </div>
      </fieldset>
    </fieldset></details>`;
  const sig = `<details class="v32-group" data-gid="sig"${isOpen("sig",false)?" open":""}><summary>Requisitos ou preocupações específicas</summary>
    <div class="v32-micro">Opcionais · registram contexto da conversa; marcar um sinal NÃO significa gap SOC-CMM e nunca altera score, radar ou findings.</div>
    ${SIGNAL_GROUPS.map((g,gi)=>`<details class="v32-siggroup" data-gid="sig-${gi}"${isOpen("sig-"+gi,false)?" open":""}><summary>${g.t}</summary>
      <div class="v32-signals">${g.ids.map(k=>
        `<label><input type="checkbox" id="v32-sig-${k}"${draft.sig[k]===true?" checked":""}> ${esc32(sigPT(k))}</label>`).join("")}
      </div></details>`).join("")}</details>`;
  ed.innerHTML = `
    <div class="v32-editor-title">Contexto tecnológico · por capability</div>
    <div class="v32-editor-sub">Declare a situação por capacidade — qualquer fabricante, qualquer produto.</div>
    ${groups}${arch}${plat}${sig}
    <div class="v32-errors v32-hidden" id="v32errors" role="alert" aria-live="polite"></div>
    <div class="v32-actions">
      <button class="cta" id="v32save" type="button">Salvar contexto</button>
      <button class="btn2" id="v32cancel" type="button">Cancelar</button>
    </div>`;
  wireEditor(app);
}
function readDraftFromDom(){
  Object.keys(draft.land).forEach(capId=>{
    const L = draft.land[capId];
    if (!Array.isArray(L.solutions)) return;      /* [3.1.1-C] draft malformado não quebra a leitura;
                                                      o valor inválido segue para o save transacional/validador */
    L.solutions.forEach((s,i)=>{
      const g = f => { const el = document.getElementById(`v32-sol-${capId}-${i}-${f}`); return el ? el.value : (s[f]||""); };
      s.vendor = g("vendor").trim(); s.product = g("product").trim();
      const st = g("status"); if (st) s.status = st; else delete s.status;
      const cov = g("coverage").trim(); if (cov) s.coverage = cov; else delete s.coverage;
      const dep = g("deployment"); if (dep) s.deployment = dep; else delete s.deployment;
      const nt = g("notes").trim(); if (nt) s.notes = nt; else delete s.notes;
      if (capId==="soc-platform" && !/fortisoc/i.test(s.product||"")){
        const checks = document.querySelectorAll(`#v32-cap-soc-platform [id^="v32-sol-${capId}-${i}-cov-"]`);
        const covCaps = Array.from(checks).filter(c=>c.checked).map(c=>c.getAttribute("data-cov"));
        if (covCaps.length) s.coveredCapabilities = covCaps; else delete s.coveredCapabilities;
      }
    });
    if (Array.isArray(L.solutions)) L.solutions = L.solutions.filter(s => (s.vendor||s.product));
    const drv = document.getElementById("v32-driver-"+capId);
    if (L.presence==="UNSET") L.declaredDriver = null;               /* [3.3.3-4] nunca driver órfão */
    else if (drv) L.declaredDriver = drv.value.trim() ? { note: drv.value.trim() } : null;
  });
  ARCH_FIELDS.forEach(f=>{ const el = document.getElementById("v32-arch-"+f.k); if (el) draft.arch[f.k]=el.value; });
  const fgt = document.getElementById("v32-plat-fgt");
  const all = draft.plat.declaredPlatforms || [];
  const others = all.filter(p => !(p && p.platform==="fortigate"));   /* [3.1.1-H] entradas não editadas preservadas */
  const existing = all.find(p => p && p.platform==="fortigate") || null;
  if (fgt && fgt.checked){
    const b = document.querySelector('input[name="v32-bundle"]:checked');
    const subs = Object.keys(V32.SECURITY_SUBSCRIPTIONS)
      .filter(sid => { const el=document.getElementById("v32-sub-"+sid); return el && el.checked; });
    const entry = Object.assign({}, existing || { platform:"fortigate" },
                                { bundle:(b && b.value) ? b.value : null,
                                  subscriptions: subs });   /* [3.3.3-1] só declarações EXPLÍCITAS; badge nunca grava */
    draft.plat.declaredPlatforms = others.concat([entry]);
  } else draft.plat.declaredPlatforms = others;
  V32.SIGNAL_IDS.forEach(k=>{ const el = document.getElementById("v32-sig-"+k);
    if (el) draft.sig[k] = el.checked ? true : "unset"; });   /* [3.3.3-3] todos os 22; unchecked = unset, nunca false */
}
function wireEditor(app){
  const ed = document.getElementById("v32editor");
  ed.querySelectorAll('input[name="v32-bundle"]').forEach(r=>{
    r.onchange = ()=>{ readDraftFromDom(); paintEditor(app); };   /* badges seguem o bundle; explícitas preservadas */
  });
  ed.querySelectorAll("select[id^='v32-pres-']").forEach(sel=>{
    sel.onchange = ()=>{ readDraftFromDom();
      const capId = sel.getAttribute("data-cap");
      draft.land[capId].presence = sel.value;
      /* [3.1.1-B] transições PRESENT/PARTIAL → NONE|UNSET|UNKNOWN limpam solutions:
         estado contraditório (ex.: "não existe" + tecnologia em produção) é impossível */
      if (sel.value==="PRESENT"||sel.value==="PARTIAL"){
        if (!(draft.land[capId].solutions||[]).length) draft.land[capId].solutions = [];
      } else draft.land[capId].solutions = [];
      paintEditor(app); document.getElementById("v32-pres-"+capId).focus(); };
  });
  ed.querySelectorAll(".v32-add").forEach(btn=>{
    btn.onclick = ()=>{ readDraftFromDom();
      const capId = btn.getAttribute("data-cap");
      draft.land[capId].solutions = (draft.land[capId].solutions||[]).concat([{vendor:"",product:""}]);
      paintEditor(app); };
  });
  ed.querySelectorAll(".v32-rm").forEach(btn=>{
    btn.onclick = ()=>{ readDraftFromDom();
      const capId = btn.getAttribute("data-cap"), i = +btn.getAttribute("data-i");
      draft.land[capId].solutions.splice(i,1); paintEditor(app); };
  });
  const cancel = document.getElementById("v32cancel");
  if (cancel) cancel.onclick = ()=>{ if (closeEditorToOrigin(app)) return;
    draft=null; ed.classList.add("v32-hidden"); ed.innerHTML="";
    const cta=document.getElementById("v32cta"); if(cta){cta.setAttribute("aria-expanded","false"); cta.focus();} };
  const save = document.getElementById("v32save");
  if (save) save.onclick = ()=>{
    readDraftFromDom();
    const pre = legacySnapshot();                              /* invariante M43 */
    /* [3.1.1-C] SAVE TRANSACIONAL: snapshot completo do estado live; erro ⇒ rollback integral */
    const backup = {
      land: JSON.parse(JSON.stringify(V32.TECH_LANDSCAPE)),
      arch: Object.assign({}, V32.ARCHITECTURE_CONTEXT),
      plat: JSON.parse(JSON.stringify(V32.PLATFORM_CONTEXT.declaredPlatforms)),
      sig:  Object.assign({}, V32.SESSION_SIGNALS)
    };
    Object.keys(V32.TECH_LANDSCAPE).forEach(id=>{
      const d = draft.land[id];
      const keepSols = (d.presence==="PRESENT"||d.presence==="PARTIAL");     /* [3.1.1-B] normalização na gravação */
      V32.TECH_LANDSCAPE[id].presence = d.presence;
      V32.TECH_LANDSCAPE[id].solutions = keepSols ? (d.solutions||[]) : [];
      V32.TECH_LANDSCAPE[id].declaredDriver = (d.presence==="UNSET") ? null : (d.declaredDriver||null);
    });
    Object.assign(V32.ARCHITECTURE_CONTEXT, draft.arch);
    V32.PLATFORM_CONTEXT.declaredPlatforms = draft.plat.declaredPlatforms;
    Object.keys(draft.sig).forEach(k=>{ V32.SESSION_SIGNALS[k]=draft.sig[k]; });
    const errs = V32.validateConfigV32();
    const box = document.getElementById("v32errors");
    if (errs.length){
      Object.keys(V32.TECH_LANDSCAPE).forEach(id=>{ V32.TECH_LANDSCAPE[id] = backup.land[id]; });
      Object.assign(V32.ARCHITECTURE_CONTEXT, backup.arch);
      V32.PLATFORM_CONTEXT.declaredPlatforms = backup.plat;
      Object.keys(backup.sig).forEach(k=>{ V32.SESSION_SIGNALS[k]=backup.sig[k]; });
      box.classList.remove("v32-hidden");
      box.innerHTML = "<strong>Dados inválidos — nada foi salvo. Revise:</strong><ul>" +
        errs.slice(0,10).map(e=>`<li>${esc32(e)}</li>`).join("") + "</ul>";
      return;                                                  /* estado live INTACTO; editor aberto */
    }
    lastCtx = V32.buildRecommendationContext();
    if (legacySnapshot() !== pre) console.error("V3.2 UI: invariante M43 violada — camada 1 alterada");
    draft = null;
    if (closeEditorToOrigin(app)) return;
    renderBlocks(app);
    if (window.__uxDecor) window.__uxDecor(app);
    const cta2 = document.getElementById("v32cta"); if (cta2) cta2.setAttribute("aria-expanded","false");
    const decl = document.getElementById("v32decl");
    if (decl) decl.setAttribute("aria-live","polite");
  };
}

/* ---------------- [3.2] Recommendation Context UI ---------------- */
function iconFor(itemId, name){
  const key = (typeof ICON_MAP_V32!=="undefined") ? ICON_MAP_V32[itemId] : null;
  const src = key ? (((typeof ICONS_V32!=="undefined") && ICONS_V32[key]) ||
                     ((typeof ICONS!=="undefined") && ICONS[key]) || null) : null;   /* [3.3.1.1-A] baseline ICONS */
  if (src) return `<img class="v32-icon" alt="" data-icon="${escAttr(key)}" src="${src}">`;
  const base = String(name||itemId).replace(/^Forti/i,"").replace(/[^A-Za-z]/g,"");
  const ini = (base.slice(0,2) || String(itemId).slice(0,2)).toUpperCase();
  return `<span class="v32-icon-fb" aria-hidden="true" data-icon="fallback">${esc32(ini)}</span>`;
}
function candidateHTML(c){
  const name = (V32.OFFERINGS[c.itemId]||{}).name || c.itemId;
  const kind = KIND_LABELS[c.relation] || KIND_LABELS[c.itemKind] || c.relation;
  const vr = c.variantResolution && /a definir/.test(c.variantResolution)
    ? ` <em class="v32-vr">${esc32(c.variantResolution)}</em>` : "";
  const sn = c.scopeNote ? `<div class="v32-scopenote">${esc32(c.scopeNote)}</div>` : "";
  const sig = c.signals && c.signals.length ? `<div class="v32-scopenote">sinal: ${esc32(c.signals.map(sigPT).join(", "))}</div>` : "";
  const co = (c.commercialOptions||[]).map(o=>{
    const pn = (V32.COMMERCIAL_PROGRAMS[o.program]||{}).name || o.program;
    return `<span class="v32-tag">${esc32(pn)} · elegibilidade ${esc32(ELIG_LABELS[o.eligibility]||o.eligibility)}</span>`; }).join("");
  return `<li class="v32-cand">${iconFor(c.itemId, name)}<strong>${esc32(name)}</strong> <span class="v32-kind">${esc32(kind)}</span>${vr}${sn}${sig}${commercialHTML(c.commercialOptions)}</li>`;
}
function serviceHTML(s){
  const svc = V32.SERVICES[s.serviceId]||{};
  const co = (s.commercialOptions||[]).map(o=>{
    const pn = (V32.COMMERCIAL_PROGRAMS[o.program]||{}).name || o.program;
    return `<span class="v32-tag">${esc32(pn)} · elegibilidade ${esc32(ELIG_LABELS[o.eligibility]||o.eligibility)}</span>`; }).join("");
  const trg = (s.triggeredBy||[]).filter(t=>t!=="capability-gap");
  const elig = s.note && /validar/i.test(s.note)
    ? `<div class="v32-scopenote v32-elig">Elegibilidade técnica: ${esc32(s.note.replace(/^elegível — /,""))}</div>` : "";
  return `<li class="v32-svc">${iconFor(s.serviceId, svc.name)}<strong>${esc32(svc.name||s.serviceId)}</strong>
    <span class="v32-kind">${esc32(LIFECYCLE_LABELS[s.lifecycle]||s.lifecycle)}</span>
    ${trg.length?`<span class="v32-scopenote">gatilho: ${esc32(trg.map(sigPT).join(", "))}</span>`:""}${elig}${commercialHTML(s.commercialOptions)}</li>`;
}
function whyHTMLOf(id, c){
  const m = c.maturity || {};
  const why = [];
  if (m.state) why.push("Maturidade: " + (MSTATE_LABELS[m.state]||m.state) +
    ((m.stateSourceFindingIds||[]).length ? " — origem: \u201c" + m.stateSourceFindingIds.map(qLabel).join("\u201d; \u201c") + "\u201d" : ""));
  if (c.businessPriority && c.businessPriority.flag)
    why.push("Prioridade declarada pelo negócio: \u201c" + c.businessPriority.priorityQuestionIds.map(qLabel).join("\u201d; \u201c") + "\u201d");
  why.push("Tecnologia: " + (TSTATE_LABELS[c.techState]||c.techState||"—") +
    " · Classificação: " + (CLASS_LABELS[c.classification]||c.classification||"—"));
  return `<details class="v32-why"><summary>Por que apareceu</summary>
    <ul>${why.map(x=>`<li>${esc32(x)}</li>`).join("")}</ul></details>`;
}
function capCardHTML(id, c){
  const cands = (c.candidates||[]).map(candidateHTML).join("");
  const svcs  = (c.services||[]).map(serviceHTML).join("");
  const notes = (c.notes||[]).map(n=>`<div class="v32-neutral">${esc32(n)}</div>`).join("");
  /* [3.2.1-1] VALIDATE nunca desaparece: explica o que validar a partir de classification/flags/techState */
  let validateBody = "";
  if (c.supportMode==="VALIDATE" && !cands && !svcs){
    const reasons = [];
    if (c.flags && c.flags.insufficientEvidence) reasons.push("evidência de maturidade insuficiente na sessão (confiança abaixo do mínimo)");
    if (c.techState==="UNKNOWN") reasons.push("tecnologia marcada como \u201cPrecisa ser validado\u201d no Landscape");
    if (c.flags && c.flags.statusUnverified) reasons.push("tecnologia declarada sem status operacional");
    if (c.maturity && c.maturity.hasUnknowns) reasons.push("respostas em branco/NA nas perguntas de origem");
    if (!reasons.length) reasons.push("classificação requer validação em aprofundamento");
    validateBody = `<div class="v32-neutral">O que validar: ${esc32(reasons.join("; "))}.</div>`;
  }
  const whyHTML = whyHTMLOf(id, c);   /* [3.2.1-3 → 3.2.2-D] labels humanos, reutilizável */
  return `<div class="v32-card" data-cap="${escAttr(id)}">
    <div class="v32-card-head"><strong>${esc32(V32.CAPABILITIES[id].name)}</strong>
      <span class="v32-class">${esc32(CLASS_LABELS[c.classification]||"")}</span>
      ${c.businessPriority && c.businessPriority.flag ? '<span class="v32-tag v32-prio-tag">prioridade declarada</span>' : ""}</div>
    ${cands?`<div class="v32-subhead">Tecnologia — ofertas</div><ul class="v32-list">${cands}</ul>`:""}
    ${svcs?`<div class="v32-subhead">Serviços</div><ul class="v32-list">${svcs}</ul>`:""}
    ${(V32.TECH_LANDSCAPE[id]&&V32.TECH_LANDSCAPE[id].declaredDriver&&V32.TECH_LANDSCAPE[id].declaredDriver.note)?`<div class="v32-scopenote v32-driver"><i>Motivo declarado:</i> ${esc32(V32.TECH_LANDSCAPE[id].declaredDriver.note)}</div>`:""}
    ${validateBody}${notes}${whyHTML}</div>`;
}
function baseCardHTML(id, c, kind){
  const svcs = (c.services||[]).map(serviceHTML).join("");
  const neutral = kind==="maturity"
    ? "Apoio baseado na maturidade — Landscape tecnológico não se aplica a esta capability."
    : `Leitura V3.1.3 preservada (maturidade: ${esc32(MSTATE_LABELS[(c.maturity||{}).state]||"")}). Informe o contexto desta capability para interpretação V3.2 — nenhum produto é inferido sem contexto.`;
  return `<div class="v32-card" data-cap="${escAttr(id)}">
    <div class="v32-card-head"><strong>${esc32(V32.CAPABILITIES[id].name)}</strong>
      <span class="v32-class">${esc32(kind==="maturity" ? "Apoio baseado na maturidade" : CLASS_LABELS.CONTEXT_NOT_INFORMED)}</span>
      ${c.businessPriority && c.businessPriority.flag ? '<span class="v32-tag v32-prio-tag">prioridade declarada</span>' : ""}</div>
    <div class="v32-neutral">${neutral}</div>
    ${svcs?`<div class="v32-subhead">Serviços</div><ul class="v32-list">${svcs}</ul>`:""}
    ${whyHTMLOf(id, c)}</div>`;
}
function presentationOf(id, c){
  if (!c) return null;
  if (c.supportMode==="VALIDATE") return "card";
  if (["DIRECT","CONTEXTUAL"].includes(c.supportMode) &&
      ((c.candidates||[]).length || (c.services||[]).length || (c.notes||[]).length)) return "card";
  if (c.classification==="CONTEXT_NOT_INFORMED" &&
      ((c.maturity && (c.maturity.state==="gap-high"||c.maturity.state==="gap-moderate")) ||
       (c.businessPriority && c.businessPriority.flag) || (c.services||[]).length))
    return V32.CAPABILITIES[id].landscapeEnabled ? "base" : "maturity";
  return null;
}
function neutralPrioCardHTML(id, c){
  /* [3.2.3-B] prioridade NUNCA desaparece: card neutro, zero produto inventado */
  return `<div class="v32-card" data-cap="${escAttr(id)}">
    <div class="v32-card-head"><strong>${esc32(V32.CAPABILITIES[id].name)}</strong>
      <span class="v32-class">${esc32(CLASS_LABELS[c.classification]||c.classification||"")}</span>
      <span class="v32-tag v32-prio-tag">prioridade declarada</span></div>
    <div class="v32-neutral">Não há oferta direta mapeada para esta capability nesta etapa — nenhum produto é inferido. A prioridade permanece registrada para o aprofundamento.</div>
    ${whyHTMLOf(id, c)}</div>`;
}
function renderCap(id, c, pres){
  if (pres===null) return neutralPrioCardHTML(id, c);
  return pres==="card" ? capCardHTML(id,c) : baseCardHTML(id,c,pres);
}
function buildSupportHTML(res){
  const ctxs = res.contexts;
  /* [3.2.2-A] priority-first REAL: vale para TODOS os supportModes/apresentações */
  const prioOrder = [];
  Array.from(businessPriority).forEach(qid=>{
    Object.keys(V32.CAPABILITIES).forEach(id=>{
      if ((V32.CAPABILITIES[id].questionIds||[]).includes(qid) && !prioOrder.includes(id)) prioOrder.push(id); });
  });
  const prioCaps = prioOrder.filter(id => presentationOf(id, ctxs[id]) !== null ||
    (ctxs[id] && ctxs[id].businessPriority && ctxs[id].businessPriority.flag));   /* [3.2.3-B] sem exceção */
  const rest = Object.keys(ctxs).filter(id => !prioCaps.includes(id));
  let html = "";
  if (prioCaps.length)
    html += `<div class="section-title"><div class="eyebrow">Apoio nas prioridades declaradas · contexto V3.2</div></div>
      <div class="v32-block" id="v32prio">${prioCaps.map(id=>renderCap(id, ctxs[id], presentationOf(id, ctxs[id]))).join("")}</div>`;
  const byMode = m => rest.filter(id => presentationOf(id, ctxs[id])==="card" && ctxs[id].supportMode===m);
  [["DIRECT","v32direct"],["CONTEXTUAL","v32contextual"],["VALIDATE","v32validate"]].forEach(([m,bid])=>{
    const ids = byMode(m); if(!ids.length) return;
    html += `<div class="section-title"><div class="eyebrow">${SUPPORT_TITLES[m]}</div></div>
      <div class="v32-block" id="${bid}">${ids.map(id=>capCardHTML(id,ctxs[id])).join("")}</div>`;
  });
  const baseIds = rest.filter(id => presentationOf(id, ctxs[id])==="base");
  if (baseIds.length)
    html += `<div class="section-title"><div class="eyebrow">Leitura base — contexto tecnológico não informado</div></div>
      <div class="v32-block" id="v32base">${baseIds.map(id=>baseCardHTML(id, ctxs[id], "base")).join("")}</div>`;
  const matIds = rest.filter(id => presentationOf(id, ctxs[id])==="maturity");
  if (matIds.length)
    html += `<div class="section-title"><div class="eyebrow">Apoio baseado na maturidade</div></div>
      <div class="v32-block" id="v32maturity">${matIds.map(id=>baseCardHTML(id, ctxs[id], "maturity")).join("")}</div>`;
  /* [3.2.1-2] mantido; [3.2.2-A] prioridades excluídas das seções subsequentes */
  const an = res.architectureNote;
  if (an && an.show){
    html += `<div class="section-title"><div class="eyebrow">Leitura arquitetural</div></div>
      <div class="v32-block" id="v32arch-note">
        <div class="v32-neutral">${an.basis.coreGaps.length} gaps confirmados em capabilities core de plataforma; ${an.basis.socPlatformNone?"ausência confirmada de plataforma SOC":"fragmentação declarada na stack"}.</div>
        <div class="v32-route"><strong>Rota A</strong> — ${esc32(an.optionA)}</div>
        ${an.optionB?`<div class="v32-route"><strong>Rota B</strong> — ${esc32(an.optionB)}</div>`:""}
      </div>`;
  }
  return html || `<div class="v32-block v32-neutral">Sem itens de apoio derivados do contexto declarado.</div>`;
}


/* ================= [3.3.2] V3.2 PRINT/PDF REPORT ================= */
function ensurePrintContainer(){
  let el = document.getElementById("v32-print-report");
  if (!el){ el = document.createElement("div"); el.id = "v32-print-report"; document.body.appendChild(el); }
  return el;
}
function fullStateJSON(){
  return JSON.stringify({ arq: (typeof arq!=="undefined"?arq:null), notes: (typeof notes!=="undefined"?notes.slice():[]),
    l: V32.TECH_LANDSCAPE, a: V32.ARCHITECTURE_CONTEXT,
    p: V32.PLATFORM_CONTEXT.declaredPlatforms, s: V32.SESSION_SIGNALS, leg: legacySnapshot() });
}
const PR_DOM_HEX = ["#9063CD","#3CB17E","#2CCCD3","#307FE2","#A2B2C8"];   /* [4.3-B] mesmo mapa; PDF */
function prRadarSVG(stats){
  const pts = stats.map(s=>s.score);
  if (!pts.some(s=>s!==null)) return "";
  const cx=150, cy=118, R=84, N=stats.length;
  const ang = i => -Math.PI/2 + i*2*Math.PI/N;
  const P = (i,r)=>`${(cx+r*Math.cos(ang(i))).toFixed(1)},${(cy+r*Math.sin(ang(i))).toFixed(1)}`;
  const grid = [1,2,3,4,5].map(k=>`<polygon points="${stats.map((_,i)=>P(i,R*k/5)).join(" ")}" fill="none" stroke="#ccc" stroke-width="0.6"/>`).join("");
  const axes = stats.map((_,i)=>`<line x1="${cx}" y1="${cy}" x2="${P(i,R).split(",")[0]}" y2="${P(i,R).split(",")[1]}" stroke="#ddd" stroke-width="0.6"/>`).join("");
  const poly = stats.map((s,i)=>P(i, R*((s.score===null?0:s.score)/5))).join(" ");
  const labels = stats.map((s,i)=>{const [x,y]=P(i,R+11).split(",");
    const c = Math.cos(ang(i));
    const anchor = c > 0.25 ? "start" : (c < -0.25 ? "end" : "middle");     /* [3.3.2.2-C] anchors por lado */
    const dy = Math.sin(ang(i)) > 0.6 ? 8 : (Math.sin(ang(i)) < -0.6 ? -2 : 3);
    return `<circle cx="${x}" cy="${(parseFloat(y)+dy-2.6).toFixed(1)}" r="2.2" fill="${PR_DOM_HEX[i]}" opacity="0"></circle><text x="${x}" y="${(parseFloat(y)+dy).toFixed(1)}" font-size="8.5" text-anchor="${anchor}" fill="#444">${esc32(DOMS[i].pt)} ${s.score===null?"n/d":s.score.toFixed(1)}</text>`;}).join("");
  return `<svg viewBox="0 0 300 244" class="pr-radar" role="img" aria-label="Radar de maturidade por domínio">
    ${grid}${axes}<polygon points="${poly}" fill="rgba(218,41,28,.15)" stroke="#DA291C" stroke-width="1.6"/>${labels}</svg>`;
}
function prWhy(id, c){
  const inner = whyHTMLOf(id, c).replace(/<\/?details[^>]*>/g,"").replace(/<summary>[\s\S]*?<\/summary>/,"");
  return `<div class="pr-why"><div class="pr-why-t">Por que apareceu</div>${inner}</div>`;
}
function prCards(ids, ctxs, pres){
  return ids.map(id=>{
    const c = ctxs[id];
    const body = (pres==="card") ? capCardHTML(id,c) : baseCardHTML(id,c,pres===null?"maturity":pres);
    /* substitui o <details> do why por versão sempre visível */
    return body.replace(/<details class="v32-why">[\s\S]*?<\/details>/, prWhy(id,c));
  }).join("");
}
function buildPrintReport(){
  const ctxRes = V32.buildRecommendationContext();               /* recompute — nunca cache */
  const ctxs = ctxRes.contexts;
  const stats = DOMS.map((_,i)=>domStat(i));
  const suff = dataSufficiency(stats);
  const scored = stats.filter(s=>s.score!==null);
  const overall = suff && scored.length ? (scored.reduce((a,s)=>a+s.score,0)/scored.length) : null;
  const {findings, validate} = computeFindings();
  const prios = [...businessPriority].map(qid=>findings.find(f=>f.id===qid)).filter(Boolean);
  let h = `<div class="pr-head"><div class="pr-brand">Fortinet · Quickscan SecOps · SOC-CMM</div>
    <div class="pr-disc">Screening indicativo de alto nível — não substitui assessment formal.</div></div>`;
  /* B — resumo de maturidade */
  h += `<div class="pr-sec" id="pr-maturity"><h2>Resumo de maturidade</h2>
    <div class="pr-kpis">
      <div class="pr-kpi"><b>${overall!==null ? overall.toFixed(1)+" / 5" : "n/d"}</b><span>Score geral indicativo</span></div>
      ${(suff && overall!==null) ? `<div class="pr-kpi"><b>${esc32(stageOf(overall).pt)}</b><span>Estágio indicativo</span></div>` : `<div class="pr-kpi"><b>—</b><span>Estágio: suficiência de dados não atingida</span></div>`}
      <div class="pr-kpi"><b>${suff ? "adequada" : "insuficiente"}</b><span>Suficiência da sessão</span></div>
      ${typeof arq==="number" && ARQ[arq] ? `<div class="pr-kpi"><b>${esc32(ARQ[arq].t)}</b><span>Arquétipo declarado</span></div>` : ""}
    </div>
    <table class="pr-doms"><tr>${stats.map((s,i)=>`<th><span class="pr-domsw" style="background:${PR_DOM_HEX[i]}"></span>${esc32(DOMS[i].pt)}</th>`).join("")}</tr>
    <tr>${stats.map(s=>`<td>${s.score===null?"n/d":s.score.toFixed(1)}</td>`).join("")}</tr></table>
    ${prRadarSVG(stats)}</div>`;
  /* C — prioridades */
  if (prios.length) h += `<div class="pr-sec" id="pr-prios"><h2>Prioridades declaradas pelo negócio</h2>
    ${prios.map((f,i)=>`<div class="pr-card"><b>${i+1}. ${esc32(qLabel(f.id))}</b></div>`).join("")}</div>`;
  /* D — findings */
  if (findings.length) h += `<div class="pr-sec" id="pr-findings"><h2>Gaps de maturidade observados</h2>
    ${findings.map(f=>{ const q = QS[f.k];
      const sev = f.sev===2 ? "Gap alto de maturidade" : "Gap moderado de maturidade";
      const opt = q.opts && q.opts[f.lvl] ? q.opts[f.lvl] : {t:"",d:""};
      const cap = (MAP[f.id] && MAP[f.id].cap) ? MAP[f.id].cap : "";
      const obs = (typeof notes!=="undefined" && notes[f.k] && String(notes[f.k]).trim())
        ? `<div class="pr-mut pr-obs"><i>Observações da sessão:</i> ${esc32(notes[f.k])}</div>` : "";
      return `<div class="pr-card"><span class="pr-state pr-sev${f.sev}">${sev}</span>
        <b>${esc32(q.lbl)}</b> <span class="pr-mut">· domínio ${esc32(DOMS[q.dom].pt)}</span>
        <div><i class="pr-lab">Evidência declarada:</i> ${esc32(opt.t)}${opt.d?` — <span class="pr-mut">${esc32(opt.d)}</span>`:""}</div>
        ${cap?`<div><i class="pr-lab">Capability a desenvolver:</i> ${esc32(cap)}</div>`:""}
        ${obs}</div>`;}).join("")}</div>`;
  if (ctxRes.legacyMode){ h += `<div class="pr-foot">Relatório V3.1.3 · contexto tecnológico não informado nesta sessão.</div>`; return { html:h, ctxRes }; }
  /* E — contexto declarado */
  const decl = Object.keys(V32.TECH_LANDSCAPE).filter(id=>V32.TECH_LANDSCAPE[id].presence!=="UNSET");
  h += `<div class="pr-sec" id="pr-landscape"><h2>Contexto tecnológico declarado</h2>
    ${decl.length? decl.map(id=>{ const L=V32.TECH_LANDSCAPE[id];
      const rows=(L.solutions||[]).map(s=>`<div class="pr-tech">${["vendor","product","status","coverage","deployment","notes"]
        .filter(f=>s[f]).map(f=>`<span class="pr-kv"><i>${f==="status"?"status":f}</i> ${esc32(f==="status"?(STATUS_LABELS[s[f]]||s[f]):s[f])}</span>`).join(" · ")}</div>`).join("");
      return `<div class="pr-card"><b>${esc32(V32.CAPABILITIES[id].name)}</b>
        <span class="pr-state">${PRESENCE_LABELS[L.presence]}</span>${rows}</div>`;}).join("") : `<div class="pr-mut">Nenhuma capability declarada.</div>`}</div>`;
  /* [3.3.3-9] plataformas/licenciamento + sinais — nada default/unset ocupa espaço */
  const fgt = (V32.PLATFORM_CONTEXT.declaredPlatforms||[]).find(x=>x&&x.platform==="fortigate");
  if (fgt) h += `<div class="pr-sec" id="pr-entitlements"><h2>Plataformas e licenciamento declarados</h2>
    <div class="pr-card"><b>FortiGate declarado</b>
      <div>Bundle: ${fgt.bundle&&V32.BUNDLES[fgt.bundle]?esc32(V32.BUNDLES[fgt.bundle].name):"não informado"}</div>
      ${(fgt.subscriptions||[]).length?`<div>Subscriptions explícitas: ${fgt.subscriptions.map(s=>{
        const inB = fgt.bundle&&V32.BUNDLES[fgt.bundle]&&V32.BUNDLES[fgt.bundle].includesSubscriptions.includes(s);
        return esc32((V32.SECURITY_SUBSCRIPTIONS[s]||{}).name||s)+(inB?" (também incluído pelo bundle)":"");}).join("; ")}</div>`:""}
    </div></div>`;
  const sigsOn = V32.SIGNAL_IDS.filter(k=>V32.SESSION_SIGNALS[k]===true);
  if (sigsOn.length) h += `<div class="pr-sec" id="pr-signals"><h2>Requisitos e preocupações específicas</h2>
    <div class="pr-card">${sigsOn.map(k=>esc32(sigPT(k))).join(" · ")}</div></div>`;
  /* F — interpretação */
  const interpIds = Object.keys(ctxs).filter(id=>{const c=ctxs[id];
    return c.classification && c.classification!=="CONTEXT_NOT_INFORMED" &&
      !(c.classification==="UNASSESSED_CAPABILITY" && V32.TECH_LANDSCAPE[id] && V32.TECH_LANDSCAPE[id].presence==="UNSET");});
  h += `<div class="pr-sec" id="pr-interp"><h2>Interpretação do contexto</h2>
    ${interpIds.map(id=>`<div class="pr-card"><b>${esc32(V32.CAPABILITIES[id].name)}</b>
      <span class="pr-state">${esc32(CLASS_LABELS[ctxs[id].classification])}</span>
      <div class="pr-mut">${esc32(NEUTRAL_TEXT[ctxs[id].classification]||"")}</div></div>`).join("")}</div>`;
  /* G — apoio (semântica congelada; why sempre visível) */
  const prioOrder=[]; Array.from(businessPriority).forEach(qid=>Object.keys(V32.CAPABILITIES).forEach(id=>{
    if ((V32.CAPABILITIES[id].questionIds||[]).includes(qid) && !prioOrder.includes(id)) prioOrder.push(id);}));
  const prioCaps = prioOrder.filter(id=>presentationOf(id,ctxs[id])!==null || (ctxs[id]&&ctxs[id].businessPriority.flag));
  const rest = Object.keys(ctxs).filter(id=>!prioCaps.includes(id));
  const byMode = m => rest.filter(id=>presentationOf(id,ctxs[id])==="card" && ctxs[id].supportMode===m);
  h += `<div class="pr-sec" id="pr-support"><h2>Como a Fortinet pode apoiar — contexto declarado</h2>`;
  if (prioCaps.length) h += `<h3>Apoio nas prioridades declaradas</h3><div id="pr-sup-prio">${prCards(prioCaps.map(x=>x),ctxs,null) && prioCaps.map(id=>{const p=presentationOf(id,ctxs[id]);const b=(p==="card")?capCardHTML(id,ctxs[id]):(p===null?neutralPrioCardHTML(id,ctxs[id]):baseCardHTML(id,ctxs[id],p));return b.replace(/<details class="v32-why">[\s\S]*?<\/details>/,prWhy(id,ctxs[id]));}).join("")}</div>`;
  [["DIRECT","pr-sup-direct"],["CONTEXTUAL","pr-sup-contextual"],["VALIDATE","pr-sup-validate"]].forEach(([m,bid])=>{
    const ids = byMode(m); if(!ids.length) return;
    h += `<h3>${SUPPORT_TITLES[m]}</h3><div id="${bid}">${prCards(ids,ctxs,"card")}</div>`;});
  const baseIds = rest.filter(id=>presentationOf(id,ctxs[id])==="base");
  if (baseIds.length) h += `<h3>Leitura base — contexto tecnológico não informado</h3><div id="pr-sup-base">${prCards(baseIds,ctxs,"base")}</div>`;
  const matIds = rest.filter(id=>presentationOf(id,ctxs[id])==="maturity");
  if (matIds.length) h += `<h3>Apoio baseado na maturidade</h3><div id="pr-sup-maturity">${prCards(matIds,ctxs,"maturity")}</div>`;
  h += `</div>`;
  /* H — leitura arquitetural */
  const an = ctxRes.architectureNote;
  if (an && an.show) h += `<div class="pr-sec" id="pr-arch"><h2>Leitura arquitetural</h2>
    <div class="pr-card"><div class="pr-mut">${an.basis.coreGaps.length} gaps confirmados em capabilities core; ${an.basis.socPlatformNone?"ausência confirmada de plataforma SOC":"fragmentação declarada"}.</div>
    <div><b>Rota A</b> — ${esc32(an.optionA)}</div>
    ${an.optionB?`<div><b>Rota B</b> — ${esc32(an.optionB)}</div>`:""}</div></div>`;
  h += (typeof window!=="undefined" && window.__uxJourneyPrintHTML) ? window.__uxJourneyPrintHTML() : "";   /* [4.5-W] */
  h += (typeof window!=="undefined" && window.__uxRefinementPrintHTML) ? window.__uxRefinementPrintHTML() : "";   /* [4.4-O] */
  h += (typeof window!=="undefined" && window.__uxTargetPrintHTML) ? window.__uxTargetPrintHTML() : "";   /* [4.3.1-Q] */
  /* J — anexo */
  h += `<div class="pr-sec pr-annex" id="pr-annex"><h2>Anexo — respostas da sessão</h2>
    ${QS.map((qq,k)=>{ const a=ans[k];
      const resp = a===null ? "— sem resposta"
                 : (a==="NA" ? "Não sei / precisa validar"
                 : (qq.opts && qq.opts[a] ? qq.opts[a].t : "— sem resposta"));      /* [3.3.2.2-A] nunca índice cru */
      const note = (a!==null&&a!=="NA"&&qq.opts&&qq.opts[a]&&qq.opts[a].d)?`<div class="pr-mut">${esc32(qq.opts[a].d)}</div>`:"";
      const obs = (typeof notes!=="undefined" && notes[k] && String(notes[k]).trim())
        ? `<div class="pr-mut pr-obs"><i>Observações da sessão:</i> ${esc32(notes[k])}</div>` : "";   /* [3.3.2.1-B] */
      return `<div class="pr-card"><b>${k+1}. ${esc32(qq.q)}</b><div>${esc32(resp)}</div>${note}${obs}</div>`;}).join("")}</div>`;
  h += `<div class="pr-foot">Quickscan SecOps · SOC-CMM · Fortinet — relatório contextual V3.2</div>`;
  return { html:h, ctxRes };
}
let __printPre = null;
function preparePrint(){
  const el = ensurePrintContainer();
  if (draft !== null){                                   /* [3.3.2-5] draft não salvo bloqueia */
    el.innerHTML = `<div class="pr-blocked">Salve ou cancele as alterações do contexto tecnológico antes de gerar o relatório.</div>`;
    document.body.classList.add("v32-print-blocked");
    return { blocked:true };
  }
  __printPre = fullStateJSON();
  if (V32.isLegacyModeV32()){ el.innerHTML=""; document.body.classList.remove("v32-print-mode"); return { legacy:true }; }
  const { html } = buildPrintReport();
  el.innerHTML = html;
  document.body.classList.add("v32-print-mode");
  return { blocked:false, legacy:false };
}
function finishPrint(){
  document.body.classList.remove("v32-print-mode","v32-print-blocked");
  if (__printPre !== null && fullStateJSON() !== __printPre)
    console.error("V3.2 PRINT: invariante violada — estado alterado pelo print");
  __printPre = null;
}
function safePrint(){
  if (draft !== null){
    preparePrint();                                    /* monta a página de aviso */
    const box = document.getElementById("v32errors");
    if (box){ box.classList.remove("v32-hidden");
      box.innerHTML = "<strong>Salve ou cancele as alterações do contexto tecnológico antes de gerar o relatório.</strong>"; }
    return false;                                      /* NÃO invoca print nativo */
  }
  window.print();
  return true;
}
function wireSafePrint(app){
  (app||document).querySelectorAll("button").forEach(b=>{
    if (/Imprimir \/ salvar em PDF/.test(b.textContent||"")){
      b.removeAttribute("onclick"); b.onclick = safePrint;   /* [3.3.2.1-D] rota segura */
    }});
}
window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", finishPrint);

/* ---------------- wrapper de apresentação (aditivo; legado intocado) ---------------- */
const __legacyRenderResults = renderResults;
renderResults = function(app){
  __legacyRenderResults(app);
  try { renderBlocks(app); wireSafePrint(app); if (window.__uxDecor) window.__uxDecor(app); } catch(e){ console.error("V3.2 UI:", e.message); }
};

/* ---------------- API de teste (build DEV) ---------------- */
window.__V32UI = { openEditor, esc32, iconFor, ARCH_FIELDS };   /* [4.8.0.2-3] contrato real de arquitetura */   /* [4.5.0.2-B] mesma função exposta; zero resolver paralelo */
window.__DEV = {
  V32,
  setAnswerById: (qid, v) => { const k = QS.findIndex(q=>q.id===qid); if (k>=0) ans[k]=v; },
  setArq: i => { arq = i; },
  setPriorities: ids => { businessPriority.clear(); ids.forEach(id=>businessPriority.add(id)); },
  showResults: () => { step = RESULTS_STEP; render(); },
  legacySnapshot,
  ctx: () => lastCtx,
  qLabel,
  preparePrint, finishPrint, buildPrintReport, safePrint, fullStateJSON, commercialHTML,
  setNote: (k,txt)=>{ if (typeof notes!=="undefined") notes[k]=txt; },
  icons: () => ({ map: ICON_MAP_V32, assets: Object.keys(ICONS_V32).concat(typeof ICONS!=="undefined"?Object.keys(ICONS):[]) }),
  _setDraft: fn => { if (draft) fn(draft); },
  _stateJSON: () => JSON.stringify({ land:V32.TECH_LANDSCAPE, arch:V32.ARCHITECTURE_CONTEXT,
    plat:V32.PLATFORM_CONTEXT.declaredPlatforms, sig:V32.SESSION_SIGNALS })
};
})();
