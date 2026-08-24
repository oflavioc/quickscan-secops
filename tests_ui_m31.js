/* ============================================================================
   TESTES DE UI/CONTROLLER · MILESTONE 3.1 (jsdom sobre o HTML DEV real)
   Não substituem nem alteram a suíte congelada Phase 2.1.1.
   ============================================================================ */
const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");
const HTML = fs.readFileSync(path.join(__dirname, "quickscan_secops_soccmm_v3_2_dev.html"), "utf8");
const IDS = ["mandate","governance","policies","team-capacity","training","knowledge",
  "incident-response","detection-lifecycle","automation","logs","endpoint",
  "network-visibility","monitoring-coverage","external-surface","vulnerability-management"];

function boot(){
  const dom = new JSDOM(HTML, { runScripts:"dangerously", pretendToBeVisual:true,
    url:"https://local.test/quickscan" });
  const w = dom.window;
  if (!w.__DEV) throw new Error("__DEV ausente — UI não carregou");
  return { dom, w, d: w.document };
}
function answerAll(w, v, over){
  IDS.forEach(id => w.__DEV.setAnswerById(id, (over && id in over) ? over[id] : v));
  w.__DEV.setArq(0);
}
const results = [];
function T(id, label, fn){
  let ok=false, err="";
  try { ok = !!fn(); } catch(e){ ok=false; err=" ["+e.message+"]"; }
  results.push({id, ok});
  console.log((ok?"PASS":"FAIL")+"  "+id+" — "+label+err);
}
const q = (d,s)=>d.querySelector(s);
const txt = el => (el ? el.textContent : "");

/* U1 — posição/legacy: nada preenchido = V3.1.3 intacta + CTA correto */
T("U1","legacy: CTA presente com textos exatos; blocos V3.2 ausentes; apoio legado visível; legacyMode true",()=>{
  const {w,d} = boot(); answerAll(w,1); w.__DEV.showResults();
  const cta = q(d,"#v32cta");
  const sub = q(d,".v32-sub");
  const apoioVisible = Array.from(d.querySelectorAll(".section-title .eyebrow"))
    .some(e=>e.textContent.includes("Como a Fortinet pode apoiar") && !e.closest(".v32-hidden"));
  return cta && cta.textContent==="Adicionar contexto tecnológico" &&
    sub && sub.textContent.includes("Opcional · refine a interpretação") &&
    !q(d,"#v32decl") && !q(d,"#v32interp") && apoioVisible &&
    w.__DEV.V32.isLegacyModeV32()===true;
});

/* U2 — M43 fim-a-fim: editar Landscape via DOM não altera NADA da Camada 1 */
T("U2 (M43)","editar+salvar Landscape pela UI: snapshot legado idêntico; blocos V3.2 aparecem; legado de recomendação oculto + aviso",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  const pre = w.__DEV.legacySnapshot();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-security-analytics").click();
  q(d,"#v32-sol-security-analytics-0-vendor").value = "Microsoft";
  q(d,"#v32-sol-security-analytics-0-product").value = "Sentinel";
  q(d,"#v32-sol-security-analytics-0-status").value = "production";
  q(d,"#v32save").click();
  const post = w.__DEV.legacySnapshot();
  const interp = txt(q(d,"#v32interp"));
  const hiddenApoio = Array.from(d.querySelectorAll(".section-title"))
    .filter(t=>txt(t).includes("Como a Fortinet pode apoiar"))
    .every(t=>t.classList.contains("v32-hidden"));
  return pre===post && q(d,"#v32decl") && interp.includes("Gap operacional") &&
    hiddenApoio && q(d,"#v32support") &&
    w.__DEV.V32.isLegacyModeV32()===false;
});

/* U3 — M11 UI: NDR gap + NONE + arquitetura unknown → texto visível "modalidade a definir" */
T("U3 (M11)","interpretação exibe 'FortiNDR · modalidade a definir'",()=>{
  const {w,d} = boot(); answerAll(w,2,{"network-visibility":0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-network-detection"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const interp = txt(q(d,"#v32interp"));
  return interp.includes("FortiNDR") && interp.includes("modalidade a definir");
});

/* U4 — M15 UI: FortiSAT declarado aparece no contexto declarado; maturidade intocada */
T("U4 (M15)","FortiSAT declarado no Landscape aparece no bloco declarado sem alterar maturidade",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  const pre = w.__DEV.legacySnapshot();
  q(d,"#v32cta").click();
  const g3 = Array.from(d.querySelectorAll(".v32-group")).find(g=>txt(g).includes("Advanced"));
  g3.open = true;
  const pres = q(d,"#v32-pres-human-risk"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-human-risk").click();
  q(d,"#v32-sol-human-risk-0-vendor").value="Fortinet";
  q(d,"#v32-sol-human-risk-0-product").value="FortiSAT";
  q(d,"#v32-sol-human-risk-0-status").value="production";
  q(d,"#v32save").click();
  const decl = txt(q(d,"#v32decl"));
  return decl.includes("FortiSAT") && decl.includes("Risco humano") &&
    w.__DEV.legacySnapshot()===pre;
});

/* U5 — M28 UI: prioridades na ordem declarada no primeiro nível */
T("U5 (M28)","'Prioridades declaradas pelo negócio' lista na ordem declarada",()=>{
  const {w,d} = boot(); answerAll(w,1); 
  w.__DEV.setPriorities(["policies","mandate","monitoring-coverage"]);
  w.__DEV.showResults();
  const names = Array.from(d.querySelectorAll(".prio-decl h4")).map(h=>h.textContent.trim());
  const t = names.join(" | ").toLowerCase();
  /* PHASE 5.2 · REV B (COPY-B §5.1): "mandato" saiu da linguagem apresentada ao
     usuário e ao cliente; a prioridade `mandate` é exibida como
     "Direcionamento e objetivos". A ORDEM continua sendo o que este gate mede,
     e ele passa a reprovar também se o jargão reaparecer. */
  if (/mandato|charter/.test(t)) throw new Error("jargão de volta na lista de prioridades: " + t);
  return names.length===3 &&
    t.indexOf("polí") < t.indexOf("direcionamento") &&
    t.indexOf("direcionamento") < t.indexOf("monitoramento");
});

/* U6 — UNSET ≠ NONE: default 'Não informado'; microcopy só quando NONE escolhido */
T("U6","presence inicia UNSET ('Não informado'); microcopy de NONE só após escolha deliberada",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const sels = Array.from(d.querySelectorAll("select[id^='v32-pres-']"));
  const allUnset = sels.every(s=>s.value==="UNSET");
  const noMicro = !q(d,".v32-micro[role='note']");
  const pres = q(d,"#v32-pres-deception"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  const micro = txt(q(d,"#v32-cap-deception .v32-micro"));
  return allUnset && noMicro && micro.includes("somente quando a ausência");
});

/* U7 — Limpar contexto: retorna ao legacy e restaura blocos V3.1.3 */
T("U7","'Limpar contexto tecnológico' restaura legacyMode e o apoio legado visível",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  if (w.__DEV.V32.isLegacyModeV32()) return false;
  q(d,"#v32clear").click();
  const apoioVisible = Array.from(d.querySelectorAll(".section-title"))
    .filter(t=>txt(t).includes("Como a Fortinet pode apoiar"))
    .every(t=>!t.classList.contains("v32-hidden"));
  return w.__DEV.V32.isLegacyModeV32()===true && apoioVisible && !q(d,"#v32decl");
});

/* U8 — coveredCapabilities: só em soc-platform + terceiro; FortiSOC não exibe */
T("U8","'Cobertura da plataforma' só para plataforma de TERCEIRO em soc-platform; sem pré-seleção",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  let pres = q(d,"#v32-pres-soc-platform"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-soc-platform").click();
  q(d,"#v32-sol-soc-platform-0-product").value = "Splunk Mission Control";
  q(d,"#v32-add-soc-platform").click();          /* repaint com produto persistido */
  const covThird = q(d,"#v32-cap-soc-platform .v32-cov");
  const noneChecked = covThird && Array.from(covThird.querySelectorAll("input[type=checkbox]")).every(c=>!c.checked);
  /* segunda row: FortiSOC → sem cobertura */
  q(d,"#v32-sol-soc-platform-1-product").value = "FortiSOC";
  q(d,"#v32-add-soc-platform").click();
  const rows = d.querySelectorAll("#v32-cap-soc-platform .v32-solrow");
  const fortiRow = rows[1];
  const noCovForForti = fortiRow && !fortiRow.querySelector(".v32-cov");
  /* outra capability nunca exibe */
  const presE = q(d,"#v32-pres-endpoint-detection"); presE.value="PRESENT";
  presE.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-endpoint-detection").click();
  const noCovEndpoint = !q(d,"#v32-cap-endpoint-detection .v32-cov");
  return covThird && noneChecked && noCovForForti && noCovEndpoint;
});

/* U9 — status 'Não informado' preserva DECLARED_UNSPECIFIED via UI */
T("U9","tecnologia sem status → interpretação 'status a validar' (DECLARED_UNSPECIFIED preservado)",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-security-analytics").click();
  q(d,"#v32-sol-security-analytics-0-product").value = "SIEM Legado";
  q(d,"#v32save").click();
  const c = w.__DEV.ctx().contexts["security-analytics"];
  return c.classification==="TECH_STATUS_UNVERIFIED" &&
    txt(q(d,"#v32interp")).includes("status a validar");
});

/* U10 — grupos: 3º inicia recolhido; capabilities fora do registry não renderizam */
T("U10","grupo Advanced inicia recolhido; soc-staffing/soc-skills não aparecem no editor",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const groups = Array.from(d.querySelectorAll(".v32-group"));
  const g3 = groups.find(g=>txt(g.querySelector("summary")).includes("Advanced"));
  return g3 && !g3.open && !q(d,"#v32-pres-soc-staffing") && !q(d,"#v32-pres-soc-skills");
});


/* ================= [3.1.1] Testes dos oito pontos da auditoria ================= */
T("U11 (A)","injeção de atributo/handler via campo livre é neutralizada",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-security-analytics").click();
  const evil = '" onmouseover="window.__pwn=1" data-x="';
  q(d,"#v32-sol-security-analytics-0-vendor").value = evil;
  q(d,"#v32-sol-security-analytics-0-product").value = "SIEM<script>";
  q(d,"#v32-add-security-analytics").click();                 /* repaint: valor volta via template */
  const inp = q(d,"#v32-sol-security-analytics-0-vendor");
  const noAttr = !inp.hasAttribute("onmouseover") && !inp.hasAttribute("data-x") && inp.value===evil;
  q(d,"#v32save").click();
  const declOk = txt(q(d,"#v32decl")).includes('onmouseover="window.__pwn=1');   /* como TEXTO */
  return noAttr && declOk && w.__pwn===undefined && !q(d,"#v32decl script");
});
T("U12 (B)","PRESENT+tech → NONE limpa solutions; declarado nunca mostra 'não existe' + tecnologia",()=>{
  const {w,d} = boot(); answerAll(w,1,{endpoint:0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  let pres = q(d,"#v32-pres-endpoint-detection"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-endpoint-detection").click();
  q(d,"#v32-sol-endpoint-detection-0-product").value = "FortiEDR";
  pres = q(d,"#v32-pres-endpoint-detection"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  const rowsGone = !q(d,"#v32-sols-endpoint-detection");
  q(d,"#v32save").click();
  const L = w.__DEV.V32.TECH_LANDSCAPE["endpoint-detection"];
  const decl = txt(q(d,"#v32decl"));
  return rowsGone && L.presence==="NONE" && L.solutions.length===0 &&
    decl.includes("Não existe") && !decl.includes("FortiEDR");
});
T("U12b (B)","transições PRESENT→UNSET e PRESENT→UNKNOWN também limpam solutions",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  ["UNSET","UNKNOWN"].forEach(target=>{
    let pres = q(d,"#v32-pres-deception"); pres.value="PRESENT";
    pres.dispatchEvent(new w.Event("change"));
    q(d,"#v32-add-deception").click();
    q(d,"#v32-sol-deception-0-product").value="X";
    pres = q(d,"#v32-pres-deception"); pres.value=target;
    pres.dispatchEvent(new w.Event("change"));
  });
  return w.__DEV._setDraft(dft=>{ if(dft.land.deception.solutions.length) throw new Error("solutions não limpas"); })===undefined;
});
T("U13 (C)","save transacional: erro faz rollback integral; Cancelar preserva o estado pré-Save",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  const pre = w.__DEV._stateJSON();
  q(d,"#v32cta").click();
  w.__DEV._setDraft(dft=>{ dft.land.deception.presence="INEXISTENTE"; dft.land["malware-analysis"].solutions="corrupto"; });
  q(d,"#v32save").click();
  const errVisible = !q(d,"#v32errors").classList.contains("v32-hidden") &&
    txt(q(d,"#v32errors")).includes("nada foi salvo");
  const stateIntact = w.__DEV._stateJSON()===pre && w.__DEV.V32.isLegacyModeV32()===true &&
    Array.isArray(w.__DEV.V32.TECH_LANDSCAPE["malware-analysis"].solutions) &&
    w.__DEV.V32.TECH_LANDSCAPE.deception.presence==="UNSET";
  q(d,"#v32cancel").click();
  return errVisible && stateIntact && w.__DEV._stateJSON()===pre;
});
T("U14 (D)","alterar resposta SOC-CMM muda o contexto sem reabrir o editor (sem cache stale)",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-security-analytics").click();
  q(d,"#v32-sol-security-analytics-0-product").value="Sentinel";
  q(d,"#v32-sol-security-analytics-0-status").value="production";
  q(d,"#v32save").click();
  const before = txt(q(d,"#v32interp"));
  w.__DEV.setAnswerById("logs", 2);
  w.__DEV.showResults();
  const after = txt(q(d,"#v32interp"));
  return before.includes("Gap operacional") && !after.includes("Gap operacional") &&
    after.includes("madura com tecnologia");
});
T("U15 (E)","fronteiras do hiding: ações, 'Próximo passo' e 'Capabilities a validar' seguem visíveis",()=>{
  const {w,d} = boot(); answerAll(w,1,{logs:0, knowledge:"NA"});
  w.__DEV.setPriorities(["mandate"]);
  w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-security-analytics"); pres.value="NONE";
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const visible = sel => { const el=q(d,sel); return el && !el.closest(".v32-hidden") && !el.classList.contains("v32-hidden"); };
  const validarTitle = Array.from(d.querySelectorAll(".section-title"))
    .find(t=>txt(t).includes("Capabilities a validar"));
  const HIDE = ["Como a Fortinet pode apoiar nas prioridades declaradas",
                "Como a Fortinet pode apoiar agora","Pode fazer sentido — após validação"];
  const all = Array.from(d.querySelectorAll(".section-title"));
  const inHideRendered = all.filter(x=>HIDE.includes(txt(x).trim()));
  const hiddenOk = inHideRendered.length>=1 && inHideRendered.every(x=>x.classList.contains("v32-hidden"));
  const noOverreach = all.filter(x=>x.classList.contains("v32-hidden"))
    .every(x=>HIDE.includes(txt(x).trim()));
  return visible("#review") && visible("#restart") &&
    validarTitle && !validarTitle.classList.contains("v32-hidden") &&
    hiddenOk && noOverreach;
});
T("U16 (F)","accordions preservam open entre repaints; sem aria-expanded estático em summary",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  q(d,"#v32cta").click();
  const g3 = d.querySelector('details[data-gid="g3"]'); g3.open = true;
  const pres = q(d,"#v32-pres-human-risk"); pres.value="PRESENT";
  pres.dispatchEvent(new w.Event("change"));                    /* repaint */
  const g3b = d.querySelector('details[data-gid="g3"]');
  const noAria = Array.from(d.querySelectorAll("#v32editor summary")).every(s=>!s.hasAttribute("aria-expanded"));
  return g3b.open===true && noAria;
});
T("U17 (H)","editor FortiGate não destrói subscriptions/notes não editadas",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms = [
    { platform:"fortigate", bundle:"ent", subscriptions:["fg-ips"], notes:"pré-existente" }];
  w.__DEV.showResults();                                        /* re-render com estado não-legacy */
  q(d,"#v32cta").click();
  const utp = d.querySelector('input[name="v32-bundle"][value="utp"]'); utp.checked = true;
  q(d,"#v32save").click();
  const p = w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms.find(x=>x.platform==="fortigate");
  return p && p.bundle==="utp" && Array.isArray(p.subscriptions) && p.subscriptions[0]==="fg-ips" &&
    p.notes==="pré-existente";
});
T("U18 (H)","declaredDriver e sinais sem checkbox são preservados ao salvar",()=>{
  const {w,d} = boot(); answerAll(w,2); w.__DEV.showResults();
  w.__DEV.V32.TECH_LANDSCAPE["data-loss-prevention"].presence = "PRESENT";   /* [3.3.3-4] driver exige presença declarada */
  w.__DEV.V32.TECH_LANDSCAPE["data-loss-prevention"].declaredDriver = { note:"BEC ativo" };
  w.__DEV.V32.SESSION_SIGNALS.becConcern = true;
  w.__DEV.showResults();
  q(d,"#v32cta").click();
  const pres = q(d,"#v32-pres-deception"); pres.value="NONE";   /* edição não relacionada */
  pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  return w.__DEV.V32.TECH_LANDSCAPE["data-loss-prevention"].declaredDriver.note==="BEC ativo" &&
    w.__DEV.V32.SESSION_SIGNALS.becConcern===true;
});

const fail = results.filter(r=>!r.ok);
console.log("\nUI M3.1: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
