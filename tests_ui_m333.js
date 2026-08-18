/* TESTES UI · PHASE 3.3.3 — Entitlements & Commercial Detail (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");const crypto=require("crypto");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
function openPlat(d){q(d,"#v32cta").click();const pl=d.querySelector('details[data-gid="plat"]');pl.open=true;
  const fg=q(d,"#v32-plat-fgt");if(!fg.checked){fg.checked=true;}return pl;}
const cardOf=(d,cap)=>Array.from(d.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")===cap);

T("C1","subscriptions do registry renderizadas; badge de bundle informativo; badge nunca grava",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="utp"]').checked=true;
  d.querySelector('input[name="v32-bundle"][value="utp"]').dispatchEvent(new w.Event("change"));
  const ids=Object.keys(w.__DEV.V32.SECURITY_SUBSCRIPTIONS);
  const allRendered=ids.every(sid=>q(d,"#v32-sub-"+sid));
  const ipsLab=q(d,"#v32-sub-fg-ips").parentElement;
  const badge=/incluído pelo bundle/.test(txt(ipsLab));
  q(d,"#v32save").click();
  const p=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms.find(x=>x.platform==="fortigate");
  return allRendered && badge && p.bundle==="utp" && Array.isArray(p.subscriptions) && p.subscriptions.length===0;
});
T("C2","explícita ≠ badge: fg-ot-security marcado grava; incluídas do bundle não",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="ent"]').checked=true;
  d.querySelector('input[name="v32-bundle"][value="ent"]').dispatchEvent(new w.Event("change"));
  const ot=q(d,"#v32-sub-fg-ot-security");
  const otBadge=/incluído pelo bundle/.test(txt(ot.parentElement));
  ot.checked=true;
  q(d,"#v32save").click();
  const p=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms.find(x=>x.platform==="fortigate");
  return otBadge===false && p.subscriptions.join(",")==="fg-ot-security" &&
    txt(q(d,"#v32ent")).includes("FortiGuard OT Security");
});
T("C3","explícitas sobrevivem a mudança e remoção de bundle",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  q(d,"#v32-sub-fg-dlp-service").checked=true;
  d.querySelector('input[name="v32-bundle"][value="atp"]').checked=true;
  d.querySelector('input[name="v32-bundle"][value="atp"]').dispatchEvent(new w.Event("change"));   /* repaint */
  const stillChecked=q(d,"#v32-sub-fg-dlp-service").checked;
  d.querySelector('input[name="v32-bundle"][value=""]').checked=true;
  d.querySelector('input[name="v32-bundle"][value=""]').dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const p=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms.find(x=>x.platform==="fortigate");
  return stillChecked && p.bundle===null && p.subscriptions.includes("fg-dlp-service");
});
T("C4","licensedContext consistente: ent + fg-dlp-service explícita → sem duplicidade; M62 mantém",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="ent"]').checked=true;
  d.querySelector('input[name="v32-bundle"][value="ent"]').dispatchEvent(new w.Event("change"));
  q(d,"#v32-sub-fg-dlp-service").checked=true;
  const sg=d.querySelector('details[data-gid="sig"]');sg.open=true;
  d.querySelector('details[data-gid="sig-1"]').open=true;
  q(d,"#v32-sig-dataLeakageConcern").checked=true;
  const dl=d.querySelector('details[data-gid="g3"]');dl.open=true;
  const pres=q(d,"#v32-pres-data-loss-prevention");pres.value="NONE";pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const lic=w.__DEV.V32.deriveLicensedContext();
  const c=w.__DEV.ctx().contexts["data-loss-prevention"];
  return lic["data-loss-prevention"].filter(x=>x==="fg-dlp-service").length===1 &&
    c.candidates.length===0 && c.notes.some(n=>/M62/.test(n));
});
T("C5","estado inicial: nenhuma subscription pré-marcada; unset não polui resultado",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  const none=Object.keys(w.__DEV.V32.SECURITY_SUBSCRIPTIONS).every(sid=>!q(d,"#v32-sub-"+sid).checked);
  q(d,"#v32cancel").click();
  return none && !q(d,"#v32ent") && !q(d,"#v32sigs");
});
T("C6","SIGNAL_GROUPS cobre exatamente os 22 SIGNAL_IDS; 4 subgrupos; unchecked=unset",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  q(d,"#v32cta").click();
  const sg=d.querySelector('details[data-gid="sig"]');sg.open=true;
  const groups=d.querySelectorAll(".v32-siggroup");
  const rendered=Array.from(d.querySelectorAll('[id^="v32-sig-"]')).map(x=>x.id.replace("v32-sig-",""));
  const all=w.__DEV.V32.SIGNAL_IDS;
  const cover=all.every(k=>rendered.includes(k)) && rendered.length===all.length;
  d.querySelector('details[data-gid="sig-3"]').open=true;
  q(d,"#v32-sig-edrSpecificNeed").checked=true;
  q(d,"#v32save").click();
  const ok = w.__DEV.V32.SESSION_SIGNALS.edrSpecificNeed===true 
    && all.filter(k=>k!=="edrSpecificNeed").every(k=>w.__DEV.V32.SESSION_SIGNALS[k]==="unset");
  return groups.length===4 && cover && ok;
});
T("C7","becConcern → email-threat-protection contextual (FortiMail family, nunca DIRECT)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  q(d,"#v32cta").click();
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-1"]').open=true;
  q(d,"#v32-sig-becConcern").checked=true;
  const pres=q(d,"#v32-pres-email-threat-protection");pres.value="NONE";pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const c=w.__DEV.ctx().contexts["email-threat-protection"];
  return c.supportMode==="CONTEXTUAL" &&
    c.candidates.every(x=>x.relation==="contextual-by-signal") &&
    c.candidates.some(x=>/fortimail/.test(x.itemId)) &&
    txt(q(d,"#v32sigs")).includes("Preocupação com BEC");
});
T("C8","identityRiskConcern → AD Security Assessment elegível; pamRequirement → FortiPAM contextual",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  q(d,"#v32cta").click();
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-3"]').open=true;
  q(d,"#v32-sig-identityRiskConcern").checked=true;
  q(d,"#v32-sig-pamRequirement").checked=true;
  const g3=d.querySelector('details[data-gid="g3"]');g3.open=true;
  ["identity-access","privileged-access"].forEach(cap=>{
    const p=q(d,"#v32-pres-"+cap);p.value="NONE";p.dispatchEvent(new w.Event("change"));});
  q(d,"#v32save").click();
  const ia=w.__DEV.ctx().contexts["identity-access"], pa=w.__DEV.ctx().contexts["privileged-access"];
  return ia.services.some(s=>s.serviceId==="ad-security-assessment") &&
    pa.candidates.some(x=>x.itemId==="fortipam" && x.relation==="contextual-by-signal") &&
    pa.supportMode!=="DIRECT";
});
T("C9","edrSpecificNeed habilita rota FortiEDR; maturidade byte-idêntica",()=>{
  const {w,d}=boot();answerAll(w,1,{endpoint:0});w.__DEV.showResults();
  const pre=w.__DEV.legacySnapshot();
  q(d,"#v32cta").click();
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-3"]').open=true;
  q(d,"#v32-sig-edrSpecificNeed").checked=true;
  const p=q(d,"#v32-pres-endpoint-detection");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const c=w.__DEV.ctx().contexts["endpoint-detection"];
  return c.candidates.some(x=>x.itemId==="fortiedr") && w.__DEV.legacySnapshot()===pre;
});
T("C10","declaredDriver: campo só com presença; persiste; visível escapado em card e PDF",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const noField=!q(d,"#v32-driver-security-analytics");
  const pres=q(d,"#v32-pres-security-analytics");pres.value="NONE";pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-driver-security-analytics").value='auditoria pediu <b>"deception"</b> & honeypots';
  q(d,"#v32save").click();
  const drv=w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].declaredDriver;
  const card=cardOf(d,"security-analytics");
  w.__DEV.preparePrint();
  const pdfOk=txt(q(d,"#v32-print-report")).includes('auditoria pediu <b>"deception"</b> & honeypots');
  w.__DEV.finishPrint();
  return noField && drv && drv.note.includes('auditoria pediu') &&
    card && txt(card).includes('auditoria pediu <b>"deception"</b>') && !card.querySelector(".v32-driver b") && pdfOk;
});
T("C11","presence=UNSET nunca mantém driver órfão (invisível ao legacy é proibido)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  q(d,"#v32cta").click();
  let pres=q(d,"#v32-pres-deception");pres.value="PRESENT";pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32-driver-deception").value="motivo x";
  pres=q(d,"#v32-pres-deception");pres.value="UNSET";pres.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  return w.__DEV.V32.TECH_LANDSCAPE.deception.declaredDriver===null &&
    w.__DEV.V32.isLegacyModeV32()===true;
});
T("C12","bloco comercial: FortiPoints com terminologia oficial, separado da elegibilidade técnica",()=>{
  const {w,d}=boot();answerAll(w,1,{endpoint:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const p=q(d,"#v32-pres-endpoint-detection");p.value="PRESENT";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-endpoint-detection").click();
  q(d,"#v32-sol-endpoint-detection-0-product").value="FortiEDR";
  q(d,"#v32-sol-endpoint-detection-0-status").value="production";
  q(d,"#v32save").click();
  const card=cardOf(d,"endpoint-detection");
  const comm=card.querySelector(".v32-comm");
  const elig=card.querySelector(".v32-elig");
  return comm && txt(comm).includes("Opções de consumo/licenciamento") &&
    txt(comm).includes("FortiMarketplace") && txt(comm).includes("FortiFlex Points") &&
    elig && !elig.contains(comm) && !comm.contains(elig) &&
    !/R\$|\d+ ?pontos|SKU/.test(txt(comm));
});
T("C13","FortiFlex só onde confirmado no catálogo; FortiMarketplace nunca vira card",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const card=cardOf(d,"security-analytics");
  const candNoComm=Array.from(card.querySelectorAll(".v32-cand")).every(li=>!li.querySelector(".v32-comm"));
  const noFlexProgram=Array.from(d.querySelectorAll(".v32-comm-item b")).every(b=>!/FortiFlex/.test(txt(b)));
  return candNoComm && noFlexProgram &&
    !Array.from(d.querySelectorAll(".v32-card strong")).some(s=>/FortiMarketplace/.test(txt(s)));
});
T("C14","resumo de entitlements neutro no resultado (não prova implementação)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="ent"]').checked=true;
  q(d,"#v32save").click();
  const t=txt(q(d,"#v32ent"));
  return t.includes("Enterprise Protection") && t.includes("não prova implementação, cobertura ou maturidade");
});
T("C15","PDF: seções de entitlements e sinais só quando declarados; bundle+explícitas com anotação",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="ent"]').checked=true;
  d.querySelector('input[name="v32-bundle"][value="ent"]').dispatchEvent(new w.Event("change"));
  q(d,"#v32-sub-fg-ips").checked=true;
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-0"]').open=true;
  q(d,"#v32-sig-ransomwareConcern").checked=true;
  q(d,"#v32save").click();
  w.__DEV.preparePrint();
  const r=q(d,"#v32-print-report");
  const ok=q(d,"#pr-entitlements") && txt(q(d,"#pr-entitlements")).includes("também incluído pelo bundle") &&
    q(d,"#pr-signals") && txt(q(d,"#pr-signals")).includes("ransomware") &&
    !txt(r).includes("unset");
  w.__DEV.finishPrint();
  return ok;
});
T("C16","PDF sem declarações: seções de entitlements/sinais ausentes (nada default ocupa espaço)",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.preparePrint();
  const ok=!q(d,"#pr-entitlements") && !q(d,"#pr-signals");
  w.__DEV.finishPrint();
  return ok;
});
T("C17","sinais no PDF com labels PT (nunca IDs internos)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  q(d,"#v32cta").click();
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-2"]').open=true;
  q(d,"#v32-sig-promptInjectionConcern").checked=true;
  q(d,"#v32save").click();
  w.__DEV.preparePrint();
  const t=txt(q(d,"#pr-signals"));
  w.__DEV.finishPrint();
  return t.includes("Prompt injection") && !t.includes("promptInjectionConcern");
});
T("C18","engine byte-idêntico: bloco V32 do HTML == engine_v32.js congelado",()=>{
  const html=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const m=html.match(/\/\* V32_ENGINE_BEGIN \*\/\n([\s\S]*?)\n\/\* V32_ENGINE_END \*\//);
  const a=crypto.createHash("sha256").update(m[1]).digest("hex");
  const b=crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"engine_v32.js"))).digest("hex");
  return a===b && a.startsWith("9a4a2e67");
});
T("C19","M43 integral após edição de entitlements/sinais/driver",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  const pre=w.__DEV.legacySnapshot();
  openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="utp"]').checked=true;
  q(d,"#v32-sub-fg-ot-security").checked=true;
  d.querySelector('details[data-gid="sig"]').open=true;
  d.querySelector('details[data-gid="sig-0"]').open=true;
  q(d,"#v32-sig-activeIncident").checked=true;
  const p=q(d,"#v32-pres-deception");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32-driver-deception").value="drv";
  q(d,"#v32save").click();
  return w.__DEV.legacySnapshot()===pre && w.__DEV.V32.isLegacyModeV32()===false;
});
T("C20","Limpar contexto zera plataformas, sinais e drivers (legacy total)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();openPlat(d);
  d.querySelector('input[name="v32-bundle"][value="atp"]').checked=true;
  q(d,"#v32save").click();
  q(d,"#v32clear").click();
  const P=w.__DEV.V32;
  return P.PLATFORM_CONTEXT.declaredPlatforms.length===0 &&
    P.SIGNAL_IDS.every(k=>P.SESSION_SIGNALS[k]==="unset") &&
    Object.values(P.TECH_LANDSCAPE).every(L=>L.presence==="UNSET"&&L.declaredDriver===null) &&
    P.isLegacyModeV32()===true;
});

/* ===== [3.3.3.1] ===== */
function seedPlats(w, arr){ w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms = arr; }
T("C21 (A)","só FortiSOC declarado → checkbox FortiGate desmarcado; salvar não cria FortiGate e preserva FortiSOC",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  seedPlats(w,[{platform:"fortisoc",bundle:null,subscriptions:[]}]);
  q(d,"#v32cta").click();
  const pl=d.querySelector('details[data-gid="plat"]');pl.open=true;
  const un=!q(d,"#v32-plat-fgt").checked;
  q(d,"#v32save").click();
  const plats=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms;
  return un && plats.length===1 && plats[0].platform==="fortisoc";
});
T("C22 (A)","FortiSOC primeiro + FortiGate segundo → editor representa o FortiGate correto (bundle ENT + sub)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  seedPlats(w,[{platform:"fortisoc",bundle:null,subscriptions:[]},
               {platform:"fortigate",bundle:"ent",subscriptions:["fg-ot-security"]}]);
  q(d,"#v32cta").click();
  const pl=d.querySelector('details[data-gid="plat"]');pl.open=true;
  return q(d,"#v32-plat-fgt").checked &&
    d.querySelector('input[name="v32-bundle"][value="ent"]').checked &&
    q(d,"#v32-sub-fg-ot-security").checked &&
    /incluído pelo bundle/.test(txt(q(d,"#v32-sub-fg-ips").parentElement));
});
T("C23 (A)","salvar atualiza só a entrada FortiGate; FortiSOC preservado byte-idêntico e primeiro",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  const soc={platform:"fortisoc",bundle:null,subscriptions:[],notes:"piloto"};
  seedPlats(w,[soc,{platform:"fortigate",bundle:"atp",subscriptions:[]}]);
  const socJson=JSON.stringify(soc);
  q(d,"#v32cta").click();
  const pl=d.querySelector('details[data-gid="plat"]');pl.open=true;
  d.querySelector('input[name="v32-bundle"][value="utp"]').checked=true;
  q(d,"#v32save").click();
  const plats=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms;
  const fg=plats.find(p=>p.platform==="fortigate");
  return plats[0].platform==="fortisoc" && JSON.stringify(plats[0])===socJson &&
    fg && fg.bundle==="utp";
});
T("C24 (A)","desmarcar FortiGate remove só o FortiGate; demais plataformas permanecem",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  seedPlats(w,[{platform:"fortisoc",bundle:null,subscriptions:[]},
               {platform:"fortigate",bundle:"ent",subscriptions:[]}]);
  q(d,"#v32cta").click();
  const pl=d.querySelector('details[data-gid="plat"]');pl.open=true;
  q(d,"#v32-plat-fgt").checked=false;
  q(d,"#v32save").click();
  const plats=w.__DEV.V32.PLATFORM_CONTEXT.declaredPlatforms;
  return plats.length===1 && plats[0].platform==="fortisoc";
});
T("C25 (B)","FortiPoints: mecanismo E explicação exibidos separadamente + note do item",()=>{
  const {w,d}=boot();answerAll(w,1,{endpoint:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const p=q(d,"#v32-pres-endpoint-detection");p.value="PRESENT";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32-add-endpoint-detection").click();
  q(d,"#v32-sol-endpoint-detection-0-product").value="FortiEDR";
  q(d,"#v32-sol-endpoint-detection-0-status").value="production";
  q(d,"#v32save").click();
  const comm=cardOf(d,"endpoint-detection").querySelector(".v32-comm");
  const mech=comm.querySelector(".v32-mech"), expl=comm.querySelector(".v32-explain");
  return mech && txt(mech).includes("pontos universais") &&
    expl && txt(expl).includes("FortiFlex Points") && mech!==expl;
});
T("C26 (B)","FortiFlex confirmado (catálogo real): mecanismo + explicação; sem options → sem bloco; ctx byte-idêntico",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  q(d,"#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const before=JSON.stringify(w.__DEV.ctx());
  const flex=w.__DEV.commercialHTML(w.__DEV.V32.OFFERINGS.fortigate.commercialOptions);
  const empty=w.__DEV.commercialHTML([])==="" && w.__DEV.commercialHTML(undefined)==="";
  const after=JSON.stringify(w.__DEV.ctx());
  const fresh=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  return /FortiFlex/.test(flex) && flex.includes("licenciamento usage-based por pontos") &&
    flex.includes("Modelo de licenciamento baseado em pontos") && flex.includes("elegibilidade confirmada") &&
    empty && before===after && after===fresh;
});

const fail=results.filter(r=>!r.ok);
console.log("\nUI 3.3.3: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
