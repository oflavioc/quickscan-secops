/* TESTES UI · PHASE 3.3.2 — Print/PDF V3.2 (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
function save(w,d,edits){d.querySelector("#v32cta").click();Object.entries(edits).forEach(([cap,s])=>{
  const g3=d.querySelector('details[data-gid="g3"]');if(g3)g3.open=true;
  const p=d.querySelector("#v32-pres-"+cap);p.value=s.presence;p.dispatchEvent(new w.Event("change"));
  (s.solutions||[]).forEach((sol,i)=>{d.querySelector("#v32-add-"+cap).click();
    Object.entries(sol).forEach(([f,val])=>{const el=d.querySelector(`#v32-sol-${cap}-${i}-${f}`);if(el)el.value=val;});});});
  d.querySelector("#v32save").click();}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
const rep=d=>q(d,"#v32-print-report");

/* ==========================================================================
   MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · B-02
   (parecer SHA-256 f5a9f70e7a5ee658ef86775d8dab93ce2cb15974604a7ed7f1dcd99e13b58dae)

   O P1 anterior era, LINHA A LINHA:

     return r.legacy===true                                   (a)
         && rep(d).innerHTML===""                             (b)
         && !d.body.classList.contains("v32-print-mode");     (c)

   (a) continua verdadeiro e continua sendo asserido: `preparePrint()` segue
       informando que o contexto tecnológico não foi declarado.
   (b) afirmava que o relatório NÃO era montado sem contexto. Era exatamente o
       blocker B-02: o documento entregue ao cliente perdia capa, metadados,
       legenda, régua, jornada e anexo.
   (c) afirmava que `v32-print-mode` NÃO era aplicado. Era a causa material de
       B-03: sem essa classe, `.wrap` continua visível em `@media print` e a
       superfície de aplicação — cujos valores contraditórios só são
       neutralizados em `@media screen` — chegava ao papel.

   (b) e (c) foram INVERTIDOS, porque o comportamento que afirmavam foi
   declarado defeituoso pela auditoria externa e corrigido por autorização
   explícita da errata. Nenhuma asserção foi REMOVIDA: cada uma das três tem
   substituta no mesmo ponto do fluxo, e o gate ficou mais forte — passa a
   exigir a estrutura completa do relatório e a separação correta entre o que
   depende e o que não depende de contexto.
   ========================================================================== */
T("P1","sem contexto declarado, o print é o relatório estruturado com o contexto marcado como não informado",()=>{
  const {w,d}=boot();answerAll(w,1);w.__DEV.showResults();
  const r=w.__DEV.preparePrint();
  const R=rep(d);
  const foot=R.querySelector(".pr-foot");
  const ok =
    r.legacy===true && r.blocked===false &&                       /* (a) preservado */
    R.innerHTML.length>2000 &&                                    /* (b) invertido  */
    d.body.classList.contains("v32-print-mode") &&                /* (c) invertido  */
    /* estrutura que NÃO depende de contexto: presente nas duas condições */
    !!q(d,"#pr-cover") && !!q(d,"#pr-howto") && !!q(d,"#pr-stage-ruler") &&
    !!q(d,"#pr-maturity") && !!q(d,"#pr-journey") && !!q(d,"#pr-annex") &&
    /* o contexto é DECLARADO como não informado, não simplesmente omitido */
    !!q(d,"#pr-landscape") && /não informado/i.test(txt(q(d,"#pr-landscape"))) &&
    !!foot && /contexto tecnológico não informado nesta sessão/i.test(txt(foot)) &&
    /* seções realmente dependentes de contexto continuam suprimidas */
    !q(d,"#pr-interp") && !q(d,"#pr-support") && !q(d,"#pr-arch");
  w.__DEV.finishPrint();
  return ok;
});
/* cenário V3.2 rico reutilizado em P2/P3/P4/P5/P7/P8/P10/P14 */
function richScenario(){
  const {w,d}=boot();answerAll(w,1,{logs:0,knowledge:0,endpoint:0,"incident-response":0});
  w.__DEV.setPriorities(["incident-response","logs"]);w.__DEV.showResults();
  save(w,d,{ "security-analytics":{presence:"NONE"},
             "knowledge-management":{presence:"NONE"},
             "endpoint-detection":{presence:"NONE"},
             "incident-management":{presence:"PRESENT",solutions:[{vendor:'Acme "X" <s>alert</s>',product:"CasePlat",status:"production",coverage:"global",deployment:"saas",notes:"nota & obs"}]} });
  const r=w.__DEV.preparePrint();
  return {w,d,r};
}
const S=richScenario();
T("P2","report V3.2 contém maturity+priorities+landscape+interpretação+support",()=>{
  const t=txt(rep(S.d));
  return S.r.blocked===false && q(S.d,"#pr-maturity") && q(S.d,"#pr-prios") && q(S.d,"#pr-landscape") &&
    q(S.d,"#pr-interp") && q(S.d,"#pr-support") && q(S.d,"#pr-annex") && t.includes("Screening indicativo");
});
T("P3","editor/CTA/actions/controles ausentes do conteúdo imprimível",()=>{
  const r=rep(S.d);
  return !r.querySelector("button,select,input,textarea,#v32editor,#v32cta,#review,#restart");
});
T("P4","'Por que apareceu' sempre visível no report (sem <details>)",()=>{
  const r=rep(S.d);
  return r.querySelectorAll(".pr-why").length>=3 && !r.querySelector("#pr-support details") &&
    txt(r).includes("Por que apareceu") && txt(r).includes("origem:");
});
T("P5","prioridades na ordem declarada (incident-response antes de logs)",()=>{
  const t=txt(q(S.d,"#pr-prios"));const sup=txt(q(S.d,"#pr-sup-prio"));
  const iIR=t.indexOf("1."), okList=t.indexOf("incidentes")>=0||true;
  return t.indexOf("incidente")>-1 && t.indexOf("incidente") < t.indexOf("logs") &&
    sup.indexOf("Gestão e resposta a incidentes") < sup.indexOf("Analytics de segurança");
});
T("P6","vendor/product/status/coverage/deployment/notes literais e ESCAPADOS",()=>{
  const r=rep(S.d);const t=txt(q(S.d,"#pr-landscape"));
  return t.includes('Acme "X" <s>alert</s>') && t.includes("CasePlat") && t.includes("Produção") &&
    t.includes("global") && t.includes("saas") && t.includes("nota & obs") &&
    !q(S.d,"#pr-landscape s");
});
T("P7","DIRECT/CONTEXTUAL nas categorias corretas no report",()=>{
  const dset=txt(q(S.d,"#pr-sup-direct")||{textContent:""}), cset=txt(q(S.d,"#pr-sup-contextual")||{textContent:""});
  return dset.includes("Analytics de segurança")===false /* analytics priorizada → bloco prio */ &&
    txt(q(S.d,"#pr-sup-prio")).includes("FortiSIEM") &&
    cset.includes("Gestão de conhecimento") && cset.includes("FortiSOAR");
});
T("P8","contextual-support nunca como aquisição no report",()=>{
  const c=txt(q(S.d,"#pr-sup-contextual"));
  return c.includes("apoio contextual (relação de suporte)") &&
    !/Gestão de conhecimento[\s\S]{0,400}aquisição candidata/.test(c);
});
T("P10","ícone conhecido (FortiSIEM) e fallback (endpoint-family) sobrevivem no report",()=>{
  const r=rep(S.d);
  return r.querySelector('img.v32-icon[data-icon="FortiSIEM"]') &&
    r.querySelector('.v32-icon-fb[data-icon="fallback"]');
});
T("P14","opções comerciais existentes aparecem; programa FortiFlex nunca anunciado sem catálogo",()=>{
  const r=rep(S.d);const t=txt(r);
  const noFlexProgram=Array.from(r.querySelectorAll(".v32-comm-item b")).every(b=>!/FortiFlex/.test(txt(b)));
  return t.includes("FortiPoints") && t.includes("elegibilidade confirmada") && noFlexProgram;
});   /* [3.3.3] asserção ajustada: terminologia oficial FortiPoints cita "FortiFlex Points" por exigência */
T("P12","before/after print preservam estado byte-a-byte; details da tela intocados",()=>{
  const pre=S.w.__DEV._stateJSON()+S.w.__DEV.legacySnapshot();
  const openStates=Array.from(S.d.querySelectorAll("#app details")).map(x=>x.open).join(",");
  S.w.__DEV.finishPrint();
  const again=S.w.__DEV.preparePrint();S.w.__DEV.finishPrint();
  return again.blocked===false && S.w.__DEV._stateJSON()+S.w.__DEV.legacySnapshot()===pre &&
    Array.from(S.d.querySelectorAll("#app details")).map(x=>x.open).join(",")===openStates &&
    !S.d.body.classList.contains("v32-print-mode");
});
T("P9","Architecture Note só quando engine mostra; Rota A/B corretas",()=>{
  const t0=rep(S.d);const noNote=!S.d.querySelector("#pr-arch");
  const {w,d}=boot();answerAll(w,1,{logs:0,automation:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=d.querySelector("#v32-pres-soc-platform");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  d.querySelector("#v32-arch-unifiedPlatformPreference").value="unified";
  d.querySelector("#v32-arch-saasAllowed").value="yes";
  d.querySelector("#v32save").click();
  w.__DEV.preparePrint();
  const a=txt(q(d,"#pr-arch"));w.__DEV.finishPrint();
  return noNote && a.includes("Rota A") && a.includes("Rota B") && a.includes("FortiSOC");
});
T("P11","insuficiência: score n/d, sem estágio fabricado",()=>{
  const {w,d}=boot();
  ["mandate","logs","endpoint","automation","training"].forEach(id=>w.__DEV.setAnswerById(id,1));
  w.__DEV.setArq(0);w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const t=txt(q(d,"#pr-maturity"));w.__DEV.finishPrint();
  return t.includes("n/d") && t.includes("insuficiente") && t.includes("suficiência de dados não atingida");
});
T("P13","draft não salvo bloqueia print com mensagem; estado intacto",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  const pre=w.__DEV._stateJSON();
  d.querySelector("#v32cta").click();
  const p=d.querySelector("#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  const r=w.__DEV.preparePrint();
  const msg=txt(rep(d));w.__DEV.finishPrint();
  return r.blocked===true && msg.includes("Salve ou cancele as alterações") &&
    w.__DEV._stateJSON()===pre && w.__DEV.V32.isLegacyModeV32()===true;
});

/* ===== [3.3.2.1] ===== */
T("P15 (A)","estágio real PT + cinco domínios nomeados; nenhum header vazio",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const t=txt(q(d,"#pr-maturity"));
  const ths=Array.from(d.querySelectorAll(".pr-doms th")).map(x=>txt(x).trim());
  w.__DEV.finishPrint();
  return /Inicial|Gerenciado|Definido|quantitativamente|otimização|Inexistente/.test(t) &&
    ["Negócio","Pessoas","Processos","Tecnologia","Serviços"].every(n=>ths.includes(n)) &&
    ths.every(x=>x.length>0) && txt(d.querySelector(".pr-radar")).includes("Negócio");
});
T("P16 (B)","anexo preserva notes[k] escapadas, coexistindo com a descrição da alternativa",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  w.__DEV.setNote(9, 'cliente citou SIEM legado <em>"x"</em> & upgrade');
  save(w,d,{ "security-analytics":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const annex=q(d,"#pr-annex");
  const ok=txt(annex).includes('cliente citou SIEM legado <em>"x"</em> & upgrade') &&
    !annex.querySelector("em") && annex.querySelectorAll(".pr-obs").length===1 &&
    txt(annex).includes("Observações da sessão");
  w.__DEV.finishPrint();
  return ok;
});
T("P17 (C)","v32-print-mode oculta a .wrap inteira via CSS; report não contém annex/footer legados",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  save(w,d,{ "security-analytics":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const rule=/body\.v32-print-mode \.wrap, body\.v32-print-blocked \.wrap\{display:none !important;\}/.test(css);
  const clean=!rep(d).querySelector("#annex") && !rep(d).querySelector(".top") && !rep(d).querySelector("footer");
  const mode=d.body.classList.contains("v32-print-mode");
  w.__DEV.finishPrint();
  return rule && clean && mode;
});
T("P18 (D)","safePrint: com draft NÃO chama print nativo; sem draft chama uma vez",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  let calls=0; w.print=()=>{calls++;};
  d.querySelector("#v32cta").click();
  const p=d.querySelector("#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  const btn=Array.from(d.querySelectorAll("button")).find(b=>/Imprimir \/ salvar em PDF/.test(b.textContent));
  btn.click();
  const blockedOk = calls===0 && txt(q(d,"#v32errors")).includes("Salve ou cancele") &&
    txt(rep(d)).includes("Salve ou cancele");
  d.querySelector("#v32cancel").click();
  btn.click();
  return blockedOk && calls===1;
});
T("P19 (E)","invariante cobre arq e notes: mutação entre prepare/finish é detectada",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  save(w,d,{ "security-analytics":{presence:"NONE"} });
  const s1=w.__DEV.fullStateJSON();
  w.__DEV.setNote(0,"mudou"); const s2=w.__DEV.fullStateJSON();
  w.__DEV.setArq(2); const s3=w.__DEV.fullStateJSON();
  return s1!==s2 && s2!==s3 && s2.includes("mudou");
});


/* ===== [3.3.2.2] ===== */
T("P20 (A)","anexo: label humano de opts[1] + descrição; NA exato; null; sem índice cru",()=>{
  const {w,d}=boot();answerAll(w,1,{knowledge:"NA"});
  w.__DEV.setAnswerById("training",null);
  w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const cards=Array.from(d.querySelectorAll("#pr-annex .pr-card"));
  const byQ=lbl=>cards.find(c=>txt(c).includes(lbl));
  const mand=byQ("mandato")||byQ("objetivos")||cards[0];
  const idxOnly=cards.some(c=>{const lines=txt(c).split("\n").map(s=>s.trim()).filter(Boolean);
    return lines.some(l=>/^[0-3]$/.test(l));});
  const w1 = w.__DEV; const q0 = null;
  const opt1t = (()=>{const html=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
    return true;})();
  const naOk = cards.some(c=>txt(c).includes("Não sei / precisa validar"));
  const nullOk = cards.some(c=>txt(c).includes("— sem resposta"));
  const hasDesc = txt(mand).length > 40 && !/\b[0-3]\b(?=\s*$)/.test(txt(mand).trim());
  w.__DEV.finishPrint();
  return !idxOnly && naOk && nullOk && hasDesc;
});
T("P20b (A)","resposta index 1 imprime opts[1].t e opts[1].d reais do QS (mandate)",()=>{
  const {w,d}=boot();answerAll(w,1);w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const src=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_1_3.html"),"utf8");
  const m=src.match(/id:"mandate"[\s\S]*?opts:\[[\s\S]*?\{t:"([^"]+)",\s*d:"([^"]+)"\},\s*\{t:"([^"]+)",\s*d:"([^"]+)"\}/);
  const t1=m[3], d1=m[4];                       /* segunda entrada do opts = index 1 */
  const card=Array.from(d.querySelectorAll("#pr-annex .pr-card")).find(c=>txt(c).includes("mandato")||txt(c).includes(t1));
  const ok=card && txt(card).includes(t1) && txt(card).includes(d1) && !/(^|\s)1(\s|$)/.test(txt(card).replace(/1\./,""));
  w.__DEV.finishPrint();
  return ok;
});
T("P21 (B)","findings: gap alto e moderado com lbl, domínio, evidência (t+d), capability e nota",()=>{
  const {w,d}=boot();answerAll(w,2,{logs:0, mandate:1});
  w.__DEV.setNote(0,"nota do gap <b>x</b>");
  w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const sec=q(d,"#pr-findings"); const t=txt(sec);
  const hi=Array.from(sec.querySelectorAll(".pr-card")).find(c=>txt(c).includes("Gap alto"));
  const mod=Array.from(sec.querySelectorAll(".pr-card")).find(c=>txt(c).includes("Gap moderado"));
  const ok = hi && mod &&
    txt(hi).includes("domínio") && txt(hi).includes("Evidência declarada") &&
    txt(hi).includes("Capability a desenvolver") &&
    txt(mod).includes("Mandato e objetivos") && txt(mod).includes("Negócio") &&
    txt(mod).includes("Observações da sessão") && txt(mod).includes("nota do gap <b>x</b>") &&
    !sec.querySelector("b i, .pr-obs b") && !t.includes("undefined");
  w.__DEV.finishPrint();
  return ok;
});
T("P22 (C)","radar: 5 labels dentro da área com anchors laterais corretos",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  save(w,d,{ "deception":{presence:"NONE"} });
  w.__DEV.preparePrint();
  const svg=d.querySelector(".pr-radar");
  const texts=Array.from(svg.querySelectorAll("text"));
  const vb=svg.getAttribute("viewBox").split(" ").map(Number);
  const inBounds=texts.every(tx=>{const x=+tx.getAttribute("x"), y=+tx.getAttribute("y");
    return x>=0 && x<=vb[2] && y>=8 && y<=vb[3];});
  const anchors=texts.map(tx=>tx.getAttribute("text-anchor"));
  const names=texts.map(tx=>txt(tx));
  w.__DEV.finishPrint();
  return texts.length===5 && inBounds &&
    ["Negócio","Pessoas","Processos","Tecnologia","Serviços"].every(n=>names.some(m=>m.includes(n))) &&
    anchors.includes("start") && anchors.includes("end") && anchors.includes("middle");
});

const fail=results.filter(r=>!r.ok);
console.log("\nUI 3.3.2 (PDF): "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
