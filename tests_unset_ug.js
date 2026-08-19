/* TESTES · MICRO-FASE UNSET GEOMETRY CORRECTION (pré-5.0) — namespace próprio UG (jsdom)
   Invariante sob teste: UNSET (domínio sem resposta pontuável) NUNCA é desenhado como zero
   geométrico. O rótulo canônico "n/d" permanece byte-idêntico e o desenho é equivalente ao
   legado quando não há UNSET. Oracle independente da implementação: a geometria esperada é
   recalculada aqui, a partir de DOMS/SCORES/respostas, sem chamar radarSVG/prRadarSVG. */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response",
  "detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage",
  "external-surface","vulnerability-management"];
const DOM_OF=[0,0,0,1,1,1,2,2,2,3,3,3,4,4,4];      /* q.dom congelado, na ordem de IDS */
const SCORES=[0,1.7,3.3,5];
const results=[];
function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});
  console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});
  return{w:dom.window,d:dom.window.document};}
const q=(d,s)=>d.querySelector(s), txt=el=>el?el.textContent:"";
/* aplica um vetor de 15 respostas (null | 0..3 | "NA") */
function apply(w,vec){IDS.forEach((id,k)=>w.__DEV.setAnswerById(id,vec[k]));w.__DEV.setArq(0);w.__DEV.showResults();}
const vecAll=v=>IDS.map(()=>v);
/* declara contexto tecnológico pelo editor real — sem isso o build entra em legacyMode e o
   relatório de print não é montado (comportamento congelado, não relaxado aqui). */
function declareCtx(w,d,cap){cap=cap||"security-analytics";
  d.querySelector("#v32cta").click();
  const g3=d.querySelector('details[data-gid="g3"]'); if(g3) g3.open=true;
  const p=d.querySelector("#v32-pres-"+cap); p.value="NONE"; p.dispatchEvent(new w.Event("change"));
  d.querySelector("#v32save").click();}
/* ---- oracle independente: score por domínio a partir do vetor ---- */
function domScores(vec){
  return [0,1,2,3,4].map(i=>{
    const vals=vec.map((v,k)=>({v,k})).filter(o=>DOM_OF[o.k]===i && o.v!==null && o.v!=="NA").map(o=>SCORES[o.v]);
    return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10 : null;
  });
}
/* geometria legada do radar de tela (fórmula ANTES da correção) — usada só na equivalência UG10 */
function legacyScreenPoints(scores){
  const cx=170,cy=160,R=110,N=5;
  return scores.map((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/N,r=R*Math.max(s??0,0.15)/5;
    return [cx+r*Math.cos(a),cy+r*Math.sin(a)].join(",");}).join(" ");
}
const nPts=el=>{const p=(el.getAttribute("points")||"").trim();return p?p.split(/\s+/).length:0;};

/* ===================== POSITIVOS — UNSET nunca é zero geométrico ===================== */

T("UG1","radar de tela: vértice do domínio UNSET é OMITIDO (não plotado em zero)",()=>{
  const {w,d}=boot();
  const vec=IDS.map((_,k)=>DOM_OF[k]===4?null:1);          /* Serviços inteiro UNSET */
  apply(w,vec);
  const sc=domScores(vec);
  const shape=q(d,"svg.radar .shape");
  const cx=170,cy=160;
  const pts=(shape.getAttribute("points")||"").trim().split(/\s+/).filter(Boolean);
  const noCenter=pts.every(p=>{const [x,y]=p.split(",").map(Number);
    return Math.hypot(x-cx,y-cy)>1;});                     /* nenhum vértice colapsado no centro */
  return sc[4]===null && nPts(shape)===4 && noCenter;
});

T("UG2","radar de tela: eixo UNSET pontilhado + marcador vazado, sem usar o encoding do alvo",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  const axes=Array.from(d.querySelectorAll("svg.radar line.axis"));
  const unsetAxis=axes[4], setAxis=axes[0];
  const mark=d.querySelector('svg.radar .unset-mark[data-unsetdom="4"]');
  const css=HTML;
  const dashRule=/\.radar \.axis\.unset\{stroke-dasharray:3 3/.test(css);
  const markRule=/\.radar \.unset-mark\{fill:none/.test(css);
  /* encoding do alvo (tracejado verde #3CB17E) permanece exclusivo do cenário-alvo */
  const noGreen=!(mark && (mark.getAttribute("stroke")||"").toUpperCase().includes("3CB17E"));
  return axes.length===5 && unsetAxis.getAttribute("class")==="axis unset" &&
    setAxis.getAttribute("class")==="axis" && !!mark && dashRule && markRule && noGreen;
});

T("UG3","régua de domínio: UNSET não gera .fill; gera .ruler.unset com marcador e nome acessível",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  const rulers=Array.from(d.querySelectorAll(".panel .dom .ruler"));
  const un=rulers[4], set=rulers[0];
  const na=un.querySelector(".ruler-na");
  return rulers.length===5 &&
    un.classList.contains("unset") && !un.querySelector(".fill") &&
    !!na && txt(na).trim()==="—" && na.getAttribute("aria-label")==="não avaliado" &&
    !set.classList.contains("unset") && !!set.querySelector(".fill") &&
    set.querySelector(".fill").getAttribute("style").includes("width:34%");   /* 1.7/5 */
});

T("UG4","radar do PDF: vértice UNSET omitido e SVG mantém exatamente 5 <text> (invariante P22 C)",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  declareCtx(w,d);
  w.__DEV.preparePrint();
  const svg=d.querySelector("#pr-maturity .pr-radar");
  const poly=svg.querySelector("polygon[stroke='#DA291C']");
  const marks=svg.querySelectorAll("circle[stroke='#999']");
  const dashedAxes=Array.from(svg.querySelectorAll("line")).filter(l=>l.getAttribute("stroke-dasharray"));
  const nText=svg.querySelectorAll("text").length;
  w.__DEV.finishPrint();
  return nPts(poly)===4 && marks.length===1 && dashedAxes.length===1 && nText===5;
});

T("UG5","overlay de alvo (tela): eixo sem alvo efetivo é omitido do polígono do cenário-alvo",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  w.__DEV.setTarget("logs",3); w.__DEV.showResults();
  const t=d.querySelector(".ux-target-shape");
  return !!t && nPts(t)===4 && !!t.getAttribute("stroke-dasharray") &&
    t.getAttribute("stroke")==="#3CB17E";
});

T("UG6","radar de alvo (PDF): ambos os polígonos omitem UNSET; tracejado do alvo preservado",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  declareCtx(w,d);
  w.__DEV.setTarget("logs",3); w.__DEV.showResults();
  w.__DEV.preparePrint();
  const sec=d.querySelector("#pr-target");
  const polys=Array.from(sec.querySelectorAll("svg.pr-radar polygon")).filter(p=>p.getAttribute("stroke"));
  const cur=polys.find(p=>p.getAttribute("stroke")==="#307FE2");
  const tgt=polys.find(p=>p.getAttribute("stroke")==="#3CB17E");
  const note=sec.querySelector(".pr-radar-nd");
  w.__DEV.finishPrint();
  return nPts(cur)===4 && nPts(tgt)===4 && !!tgt.getAttribute("stroke-dasharray") &&
    !!note && txt(note).includes("Serviços");
});

/* ===================== NEGATIVO — NONE/zero confirmado continua sendo zero ===================== */

T("UG7","zero confirmado (nível 0 em todas as práticas) continua plotado: 5 vértices, score 0.0",()=>{
  const {w,d}=boot();
  apply(w,vecAll(0));
  declareCtx(w,d);
  const sc=domScores(vecAll(0));
  const shape=q(d,"svg.radar .shape");
  const rulers=Array.from(d.querySelectorAll(".panel .dom .ruler"));
  w.__DEV.preparePrint();
  const prPoly=d.querySelector("#pr-maturity .pr-radar polygon[stroke='#DA291C']");
  const nText=d.querySelectorAll("#pr-maturity .pr-radar text").length;
  w.__DEV.finishPrint();
  return sc.every(s=>s===0) && nPts(shape)===5 && nPts(prPoly)===5 && nText===5 &&
    rulers.every(r=>!r.classList.contains("unset") && !!r.querySelector(".fill")) &&
    !d.querySelector("svg.radar .unset-mark") && !d.querySelector(".radar-unset-note");
});

/* ===================== ADVERSARIAL — suficiência com práticas UNSET ===================== */

T("UG8","sessão SUFICIENTE com 5 práticas UNSET: 5 vértices, nenhum score diluído por zero",()=>{
  const {w,d}=boot();
  /* 10 confirmadas, 2 por domínio (gate canônico atendido); a 3ª de cada domínio fica UNSET */
  const vec=IDS.map((_,k)=>(k%3===2)?null:2);
  apply(w,vec);
  const sc=domScores(vec);
  const shape=q(d,"svg.radar .shape");
  const app=txt(q(d,"#app"));
  const expected=SCORES[2];                                /* 3.3 — média das confirmadas, sem zero fantasma */
  return sc.every(s=>s===expected) && nPts(shape)===5 &&
    !d.querySelector("svg.radar .unset-mark") &&
    !app.includes("n/d") && app.includes("3.3");
});

/* ===================== REGRESSÃO — rótulo "n/d" byte-idêntico ===================== */

T("UG9","rótulo canônico 'n/d' preservado byte a byte em tela, régua e PDF",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  const radarVals=Array.from(d.querySelectorAll("svg.radar text.v")).map(t=>txt(t).trim());
  const domLbls=Array.from(d.querySelectorAll(".panel .dom .lbl > span")).map(t=>txt(t).trim());
  declareCtx(w,d);
  w.__DEV.preparePrint();
  const prCell=Array.from(d.querySelectorAll("#pr-maturity .pr-doms td")).map(t=>txt(t).trim());
  const prRadar=txt(d.querySelector("#pr-maturity .pr-radar"));
  w.__DEV.finishPrint();
  return radarVals.length===5 && radarVals[4]==="n/d" && radarVals[0]==="1.7" &&
    domLbls[4]==="n/d" && domLbls[0].startsWith("1.7") &&
    prCell[4]==="n/d" && prRadar.includes("n/d");
});

T("UG10","EQUIVALÊNCIA: sem UNSET, a geometria é byte-idêntica à fórmula legada",()=>{
  const {w,d}=boot();
  const vec=IDS.map((_,k)=>k%4);                            /* mistura de níveis, nenhum UNSET */
  apply(w,vec);
  const sc=domScores(vec);
  const shape=q(d,"svg.radar .shape").getAttribute("points");
  const aria=q(d,"svg.radar")?q(d,"svg.radar").getAttribute("aria-label"):"";
  return sc.every(s=>s!==null) && shape===legacyScreenPoints(sc) &&
    !d.querySelector(".radar-unset-note") &&
    aria==="Radar indicativo de maturidade por domínio";
});

/* ===================== LIMITES — assessment em branco ===================== */

T("UG11","assessment em branco: nenhum vértice, 5 marcadores, nota textual, zero erro de console",()=>{
  const errs=[];
  const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/",
    virtualConsole:new (require("jsdom").VirtualConsole)().on("jsdomError",e=>errs.push(e.message))});
  const w=dom.window,d=w.document;
  w.__DEV.setArq(0); w.__DEV.showResults();
  const shape=q(d,"svg.radar .shape");
  const marks=d.querySelectorAll("svg.radar .unset-mark");
  const note=q(d,".radar-unset-note");
  const rulers=Array.from(d.querySelectorAll(".panel .dom .ruler"));
  return nPts(shape)===0 && marks.length===5 && !!note &&
    rulers.length===5 && rulers.every(r=>r.classList.contains("unset") && !r.querySelector(".fill")) &&
    errs.length===0;
});

T("UG12","nota textual nomeia exatamente os domínios não avaliados (sem depender de cor)",()=>{
  const {w,d}=boot();
  const vec=IDS.map((_,k)=>(DOM_OF[k]===2||DOM_OF[k]===4)?null:1);
  apply(w,vec);
  const note=txt(q(d,".radar-unset-note"));
  const aria=q(d,"svg.radar").getAttribute("aria-label");
  return note.includes("Processos") && note.includes("Serviços") &&
    !note.includes("Negócio") && !note.includes("Pessoas") && !note.includes("Tecnologia") &&
    note.includes("n/d") && aria.includes("Processos, Serviços");
});

const fail=results.filter(r=>!r.ok).length;
console.log(`\nUNSET GEOMETRY (UG): ${results.length-fail} PASS · ${fail} FAIL de ${results.length}`);
process.exit(fail?1:0);
