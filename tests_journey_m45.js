/* TESTES · PHASE 4.5 — Maturity Journey & Executive Narrative (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";

T("N1-N2","Journey usa os stages canônicos; marker ATUAL = stageOf(score)",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  const L=w.__DEV.stagesView();
  const names=Array.from(d.querySelectorAll("#ux-journey .jn-name")).map(e=>txt(e));
  const snap=w.__DEV.buildNarrativeSnapshot();
  const curName=txt(d.querySelector("#ux-journey .jn-cur .jn-name"));
  return names.join("|")===L.map(s=>s.pt).join("|") && curName===snap.maturity.stage.pt &&
    /* Phase 5.1/UAT-05: o rótulo passou a "Perfil atual" (caixa alta fica a
       cargo do CSS). A propriedade — rótulo do perfil atual no nó atual — é a
       mesma; a comparação deixa de depender de tipografia. */
    /PERFIL ATUAL/i.test(txt(d.querySelector(".jn-cur .jn-label")));
});
T("N3","insufficient: sem current fabricado; Posicionamento n/d",()=>{
  const {w,d}=boot();["mandate","logs","endpoint","automation","training"].forEach(id=>w.__DEV.setAnswerById(id,1));
  w.__DEV.setArq(0);w.__DEV.showResults();
  const j=q(d,"#ux-journey");
  return !j.querySelector(".jn-cur") && txt(j).includes("Posicionamento atual: n/d") &&
    txt(j).includes("Não há evidência suficiente") &&
    /* a ausência do PRÓXIMO ESTÁGIO é medida nos RÓTULOS dos nós, não no texto
       inteiro: a nota explicativa do bloco cita "próximo estágio" em prosa e
       não é um marcador de estado. */
    !Array.from(j.querySelectorAll(".jn-label")).some(e=>/PR[ÓO]XIMO EST[ÁA]GIO/i.test(txt(e)));
});
T("N4-N5","next é imediatamente posterior; top stage não cria sexto nível",()=>{
  const {w,d}=boot();answerAll(w,1);w.__DEV.showResults();
  const m1=w.__DEV.journeyModel(w.__DEV.buildNarrativeSnapshot());
  const B=boot();IDS.forEach(id=>B.w.__DEV.setAnswerById(id,3));B.w.__DEV.setArq(0);B.w.__DEV.showResults();
  const m2=B.w.__DEV.journeyModel(B.w.__DEV.buildNarrativeSnapshot());
  const jn=txt(B.d.querySelector("#ux-journey"));
  return m1.next===m1.cur+1 && m2.top===true && m2.next===-1 &&
    m2.stages.length===w.__DEV.stagesView().length &&
    jn.includes("Estágio mais elevado do modelo") && jn.includes("Foco de evolução");
});
T("N6-N7","sem TARGET → sem marker; target suficiente → marker no stage exato",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  const none=!d.querySelector("#ux-journey .jn-tgt");
  IDS.forEach(id=>{ if(id!=="logs") w.__DEV.setTarget(id,3); });
  w.__DEV.setTarget("logs",3);w.__DEV.showResults();
  const snap=w.__DEV.buildNarrativeSnapshot();
  const tgtName=txt(d.querySelector("#ux-journey .jn-tgt .jn-name"));
  return none && tgtName===snap.target.stage.pt &&
    /CEN[ÁA]RIO-ALVO/i.test(txt(d.querySelector(".jn-tgt .jn-label")));
});
T("N8-N9","target no mesmo stage não vira avanço; target >1 stage independe de NEXT",()=>{
  const {w}=boot();answerAll(w,1);w.__DEV.setTarget("logs",2);w.__DEV.showResults?.();
  const m=w.__DEV.journeyModel(w.__DEV.buildNarrativeSnapshot());
  const same=(m.tgt===m.cur);
  const B=boot();answerAll(B.w,1);IDS.forEach(id=>B.w.__DEV.setTarget(id,3));
  const m2=B.w.__DEV.journeyModel(B.w.__DEV.buildNarrativeSnapshot());
  return same && m2.tgt>m2.next && m2.next===m2.cur+1;
});
T("N10+N12+N35","Journey+narrative não alteram state; ctx byte-idêntico",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  w.__DEV.showResults();w.__DEV.showResults();
  return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre;
});
T("N11","narrativa determinística byte a byte",()=>{
  const {w}=boot();answerAll(w,1,{logs:0,knowledge:2});w.__DEV.setPriorities(["logs"]);
  ["ref-metrics","ref-lessons"].forEach((id,i)=>w.__DEV.setRefinementAnswer(id,i));
  const a=JSON.stringify(w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot()));
  const b=JSON.stringify(w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot()));
  return a===b && a.length>200;
});
T("N13-N14","P1 usa só maturity/domínios; insufficient não afirma estágio",()=>{
  const {w}=boot();answerAll(w,1,{logs:0});
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const okS=n.trace[0].sources.every(s=>/^maturity\.|^domainScores\./.test(s));
  const B=boot();["mandate","logs","endpoint","automation","training"].forEach(id=>B.w.__DEV.setAnswerById(id,1));B.w.__DEV.setArq(0);
  const n2=B.w.__DEV.buildExecutiveNarrative(B.w.__DEV.buildNarrativeSnapshot());
  return okS && n2.paragraphs[0].includes("ainda não são suficientes") &&
    !/posiciona a operação em (Inicial|Gerenciado|Definido|Em otimização)/.test(n2.paragraphs[0]) &&
    n2.paragraphs[2].includes("completar e validar as evidências");
});
T("N15-N16","prioridades na ordem declarada; ausência não cria prioridade implícita",()=>{
  const {w}=boot();answerAll(w,1,{logs:0,"incident-response":0});
  w.__DEV.setPriorities(["incident-response","logs"]);
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const p2=n.paragraphs[1];
  const ordered=p2.indexOf("incidentes")<p2.indexOf("logs")||p2.indexOf("Resposta")<p2.indexOf("Centralização");
  const B=boot();answerAll(B.w,1,{logs:0});
  const n2=B.w.__DEV.buildExecutiveNarrative(B.w.__DEV.buildNarrativeSnapshot());
  return p2.includes("Considerando as prioridades declaradas pelo negócio") && ordered &&
    n2.paragraphs[1].includes("Nenhuma prioridade específica foi declarada") &&
    !n2.paragraphs[1].includes("As principais prioridades");
});
T("N17-N18","refinement null fora da narrativa; nunca tratado como score",()=>{
  const {w}=boot();answerAll(w,2);
  w.__DEV.setRefinementAnswer("ref-metrics",1);          /* lessons/hunting null */
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const all=n.paragraphs.join(" ");
  return all.includes("métricas") && !all.includes("pós-incidente") && !/hunting/i.test(all) &&
    !/score de threat hunting|maturidade do refinement/i.test(all);
});
T("N19-N20","Landscape UNSET não afirma ausência; operational só quando existente",()=>{
  const {w}=boot();answerAll(w,1,{logs:0});
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const unset=n.paragraphs[2].includes("não foi informado nesta sessão") &&
    n.paragraphs[2].includes("evita inferir presença ou ausência");
  return unset && !n.trace[2].sources.includes("landscape.operational");
});
T("N21-N22","target: linguagem condicional; mesmo stage explicitado",()=>{
  const {w,d}=boot();answerAll(w,1);
  w.__DEV.setTarget("logs",2);
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const same=n.paragraphs[2].includes("permanece dentro do mesmo estágio indicativo");
  const B=boot();answerAll(B.w,1);IDS.forEach(id=>B.w.__DEV.setTarget(id,3));
  const n2=B.w.__DEV.buildExecutiveNarrative(B.w.__DEV.buildNarrativeSnapshot());
  return same && n2.paragraphs[2].includes("caso as práticas selecionadas sejam efetivamente implementadas") &&
    !/chegará ao nível/.test(n2.paragraphs[2]);
});
T("N23-N24","itens citados ⊆ Recommendation Context; nada criado",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const pre=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  const snap=w.__DEV.buildNarrativeSnapshot();
  const n=w.__DEV.buildExecutiveNarrative(snap);
  const named=snap.recommendationContext.candidateNames.filter(nm=>n.paragraphs.join(" ").includes(nm));
  return named.every(nm=>pre.includes(nm)) &&
    JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre;
});
T("N26-N28","themes máx 3, priority-first, sem produto; Journey sem produto",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0,"incident-response":0,endpoint:0,knowledge:0,automation:0});
  w.__DEV.setPriorities(["endpoint"]);w.__DEV.showResults();
  const th=w.__DEV.evolutionThemes(w.__DEV.buildNarrativeSnapshot());
  const jn=txt(q(d,"#ux-journey"));
  return th.length===3 && th[0].id==="endpoint" &&
    !/Forti|EDR|SIEM|SOAR/i.test(jn.replace(/FORTINET/i,""));
});
T("N29","trace cobre as afirmações variáveis principais",()=>{
  const {w}=boot();answerAll(w,1,{logs:0});w.__DEV.setPriorities(["logs"]);
  w.__DEV.setRefinementAnswer("ref-metrics",0);
  IDS.forEach(id=>w.__DEV.setTarget(id,3));
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  const all=n.trace.flatMap(t=>t.sources);
  return n.trace.length===3 && all.includes("maturity.stage") && all.includes("priorities.order") &&
    all.includes("refinement.metrics") && all.some(s=>/^target\./.test(s)) && all.includes("evolution.themes");
});
T("N30-N32","screen e PDF com a MESMA narrativa; PDF insufficient não fabrica stage",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const pz=q(d,"#v32-pres-security-analytics");pz.value="NONE";pz.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const scr=Array.from(d.querySelectorAll("#ux-journey .jn-narrative p")).map(p=>txt(p)).join("|");
  w.__DEV.preparePrint();
  const pdf=Array.from(d.querySelectorAll("#pr-journey .jn-narrative p")).map(p=>txt(p)).join("|");
  const hasJn=!!q(d,"#pr-journey .jn-track");
  w.__DEV.finishPrint();
  const B=boot();["mandate","logs","endpoint","automation","training"].forEach(id=>B.w.__DEV.setAnswerById(id,1));
  B.w.__DEV.setArq(0);B.w.__DEV.showResults();
  B.d.querySelector("#v32cta").click();
  const pz2=B.d.querySelector("#v32-pres-security-analytics");pz2.value="NONE";pz2.dispatchEvent(new B.w.Event("change"));
  B.d.querySelector("#v32save").click();
  B.w.__DEV.preparePrint();
  const pj=txt(B.d.querySelector("#pr-journey"));
  B.w.__DEV.finishPrint();
  return scr===pdf && scr.length>200 && hasJn &&
    pj.includes("Posicionamento atual: n/d") &&
    !Array.from(B.d.querySelectorAll("#pr-journey .jn-label")).some(e=>/PERFIL ATUAL/i.test(txt(e)));
});
T("N33-N34","mobile sem régua comprimida (coluna); distinção sem cor (shapes+labels)",()=>{
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const {w,d}=boot();answerAll(w,1);IDS.forEach(id=>w.__DEV.setTarget(id,3));w.__DEV.showResults();
  const marks=Array.from(d.querySelectorAll("#ux-journey .jn-mark")).map(e=>txt(e));
  /* Phase 5.1/UAT-05: os glifos ○ • ● ◎ ◆ foram substituídos por uma régua de
     seis nós de mesma geometria, em que a distinção SEM COR passa a ser feita
     por número (0–5), forma do marcador declarada em `data-jn-state` e rótulo
     textual. A propriedade auditada continua sendo "distinguir sem depender de
     cor" — e agora é verificada de forma mais forte, exigindo os três sinais. */
  const estados=Array.from(d.querySelectorAll("#ux-journey .jn-node")).map(e=>e.getAttribute("data-jn-state"));
  const numeros=Array.from(d.querySelectorAll("#ux-journey .jn-num")).map(e=>txt(e));
  return /max-width:720px\)\{\s*\n?\s*\.jn-track\{ flex-direction:column/.test(css) &&
    estados.includes("current") && estados.includes("target") &&
    numeros.join(",")==="0,1,2,3,4,5" && marks.length===6 &&
    /PERFIL ATUAL/i.test(txt(q(d,"#ux-journey"))) && /CEN[ÁA]RIO-ALVO/i.test(txt(q(d,"#ux-journey")));
});

/* ===== [4.5.0.1] ===== */
T("N36","all-core=3 → 5.0/5 sem 'estrutura inicial'/'sem execução uniforme'",()=>{
  const {w}=boot();IDS.forEach(id=>w.__DEV.setAnswerById(id,3));w.__DEV.setArq(0);
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  return n.paragraphs[0].includes("(5.0/5)") && n.paragraphs[0].includes("perfil relativamente equilibrado") &&
    !/estrutura inicial|sem execução uniforme/.test(n.paragraphs.join(" "));
});
T("N37","zero findings → ausência declarada; nunca '0 gaps impactam'",()=>{
  const {w}=boot();answerAll(w,3);
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  return n.paragraphs[1].includes("não foram observados gaps altos ou moderados") &&
    !/0 (gaps? )?altos?.*impactar|tendem a impactar/.test(n.paragraphs[1]) &&
    n.trace[1].sources.includes("findings.none");
});
T("N38","P1 segue rastreado só a maturity/domain data",()=>{
  const {w}=boot();answerAll(w,1,{logs:0});
  const n=w.__DEV.buildExecutiveNarrative(w.__DEV.buildNarrativeSnapshot());
  return n.trace[0].sources.every(s=>/^maturity\.|^domainScores\./.test(s));
});
T("N39","ordem DOM: grid2 → Journey → primeira seção de prioridades/gaps",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  const app=q(d,"#app");
  const grid=app.querySelector(".grid2"), jn=app.querySelector("#ux-journey");
  const firstPrio=Array.from(app.querySelectorAll(".section-title")).find(s=>/Prioridades declaradas|Gaps observados/i.test(s.textContent));
  const F=w.Node.DOCUMENT_POSITION_FOLLOWING;
  return grid && jn && firstPrio &&
    (grid.compareDocumentPosition(jn)&F)===F &&
    (jn.compareDocumentPosition(firstPrio)&F)===F &&
    grid.nextElementSibling===jn;
});
T("N40","exatamente uma 'Leitura executiva' na tela; legado = 'Síntese do resultado'",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  const n=Array.from(d.querySelectorAll("#app .eyebrow,#app h3")).filter(e=>e.textContent.trim()==="Leitura executiva").length;
  const s=Array.from(d.querySelectorAll("#app h3")).some(e=>e.textContent.trim()==="Síntese do resultado");
  return n===1 && s;
});
T("N41","print: um único título Journey e um único Leitura executiva",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const pz=q(d,"#v32-pres-security-analytics");pz.value="NONE";pz.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.preparePrint();
  const pj=q(d,"#pr-journey");
  const jt=(pj.innerHTML.match(/<h2>Jornada de maturidade<\/h2>/g)||[]).length;
  const lt=(pj.innerHTML.match(/<h2>Leitura executiva<\/h2>/g)||[]).length;
  const noDup=!pj.querySelector(".section-title");
  w.__DEV.finishPrint();
  return jt===1 && lt===1 && noDup;
});
T("N42","print CSS controla largura/quebra dos nodes (gate de pixels executado via WeasyPrint na rodada)",()=>{
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  return /\.jn-node\{ min-width:0; flex:0 1 110px; \}/.test(css) &&
    /\.jn-name\{ max-width:110px; white-space:normal; overflow-wrap:anywhere/.test(css);
});
T("N43","refinement baixo só completa slots livres; nunca substitui priority/finding; alto não vira tema",()=>{
  const {w}=boot();answerAll(w,1,{logs:0,"incident-response":0,endpoint:0,knowledge:0});
  w.__DEV.setPriorities(["endpoint"]);
  w.__DEV.setRefinementAnswer("ref-metrics",0);
  const full=w.__DEV.evolutionThemes(w.__DEV.buildNarrativeSnapshot());
  const B=boot();answerAll(B.w,3,{logs:1});
  B.w.__DEV.setRefinementAnswer("ref-metrics",1);B.w.__DEV.setRefinementAnswer("ref-lessons",3);
  const fb=B.w.__DEV.evolutionThemes(B.w.__DEV.buildNarrativeSnapshot());
  return full.length===3 && full.every(t=>t.id!=="ref-metrics") && full[0].id==="endpoint" &&
    fb.some(t=>t.id==="ref-metrics") && !fb.some(t=>t.id==="ref-lessons") && fb.length<=3;
});


/* ===== [4.5.0.2] ICON CONSISTENCY ===== */
function iconRich(){
  const {w,d}=boot();answerAll(w,1,{logs:0,knowledge:0,endpoint:0});
  w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const g3=d.querySelector('details[data-gid="g3"]'); if(g3) g3.open=true;
  ["security-analytics","knowledge-management","endpoint-detection"].forEach(cid=>{
    const p=q(d,"#v32-pres-"+cid); if(p){p.value="NONE";p.dispatchEvent(new w.Event("change"));}});
  q(d,"#v32save").click();
  ["logs","knowledge","endpoint","mandate"].forEach(id=>w.__DEV.setTarget(id,3));
  w.__DEV.showResults();
  return {w,d};
}
T("N44","cards principais: todo candidate/service com exatamente uma representação de ícone",()=>{
  const {w,d}=iconRich();
  const rows=Array.from(d.querySelectorAll("#v32support .v32-cand, #v32support .v32-svc"));
  return rows.length>3 && rows.every(r=>r.querySelectorAll(".v32-icon,.v32-icon-fb").length===1);
});
T("N45","todo habilitador do target com exatamente uma representação de ícone",()=>{
  const {w,d}=iconRich();
  const en=Array.from(d.querySelectorAll(".ux-tgt-enabler"));
  return en.length>=3 && en.every(e=>e.querySelectorAll(".v32-icon,.v32-icon-fb").length===1);
});
T("N46+K","mesmo resolver: markup de ícone idêntico entre card e enabler (oficial e fallback)",()=>{
  const {w,d}=iconRich();
  const pairs=Array.from(d.querySelectorAll(".ux-tgt-enabler")).map(e=>{
    const id=e.dataset.eid;
    const name=txt(e.querySelector(".ux-tgt-enabler-name"));
    const card=Array.from(d.querySelectorAll("#v32support .v32-cand,#v32support .v32-svc"))
      .find(r=>txt(r).includes(name));
    if(!card) return null;
    const a=e.querySelector(".v32-icon,.v32-icon-fb"), b=card.querySelector(".v32-icon,.v32-icon-fb");
    return a.outerHTML===b.outerHTML;
  }).filter(x=>x!==null);
  const hasFb=!!d.querySelector(".ux-tgt-enabler .v32-icon-fb");
  const hasSvg=!!d.querySelector(".ux-tgt-enabler .v32-icon");
  return pairs.length>=2 && pairs.every(Boolean) && hasSvg && hasFb;
});
T("N47","registry congelado no estado 4.6: hashes travados; delta autorizado = 3 assets oficiais (ICON_ASSET_DECISIONS_V32.md)",()=>{
  const crypto=require("crypto");
  const H={"ui_icons_v32.js":"32aabc3445571d447189edf4b486239c9256aa9bd0bc6bdab00635a65aa42151","generate_icons_v32.py":"1acfe25c2f3ac3e4d76ce42eeb7ceec3108c1d3471c27e8f788e0168b8225bf7","icons_v32_manifest.json":"1ee9f7b8a47ada527d1a9096837f0a7cfb2190f755070d58df97b9872692b4ea"};
  return Object.entries(H).every(([f,h])=>
    crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,f))).digest("hex")===h) &&
    fs.readdirSync(path.join(__dirname,"icons_v32_source")).filter(f=>f.endsWith(".svg")).length===26;
});
T("N48","identidade semântica: id/name/mode/ordem iguais; ctx byte-idêntico",()=>{
  const {w,d}=iconRich();
  const pre=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  const dom=Array.from(d.querySelectorAll(".ux-tgt-enabler")).map(e=>
    e.dataset.eid+"|"+txt(e.querySelector(".ux-tgt-enabler-name"))+"|"+txt(e.querySelector(".ux-tgt-mode")));
  const ctx=JSON.parse(pre).contexts;
  const expected=[];
  ["logs","knowledge","endpoint","mandate"].forEach(qid=>{
    Object.keys(w.__DEV.V32.CAPABILITIES).filter(cid=>(w.__DEV.V32.CAPABILITIES[cid].questionIds||[]).includes(qid))
      .forEach(cid=>{ const c=ctx[cid]; if(!c) return;
        (c.candidates||[]).forEach(x=>expected.push(x.itemId));
        (c.services||[]).forEach(s=>expected.push(s.serviceId)); });});
  return dom.map(s=>s.split("|")[0]).join(",")===expected.join(",") &&
    JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre;
});
T("N49","responsivo/print: dimensionamento contextual + wrap + sem overflow (A4 validado na rodada)",()=>{
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  return /\.ux-tgt-enabler \.v32-icon, \.ux-tgt-enabler \.v32-icon-fb\{ width:18px; height:18px/.test(css) &&
    /\.ux-tgt-enablers\{ display:flex; flex-wrap:wrap/.test(css) &&
    /@media print\{ \.ux-tgt-enabler \.v32-icon, \.ux-tgt-enabler \.v32-icon-fb\{ width:14px/.test(css) &&
    !/\.v32-icon\{[^}]*width:18px/.test(css);
});

const fail=results.filter(r=>!r.ok);
console.log("\nJOURNEY 4.5: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
