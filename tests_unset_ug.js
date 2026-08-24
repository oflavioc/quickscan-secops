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

/* ==========================================================================
   MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · B-01
   (parecer SHA-256 f5a9f70e7a5ee658ef86775d8dab93ce2cb15974604a7ed7f1dcd99e13b58dae)

   FATO ESTRUTURAL descoberto ao corrigir B-01, e que explica as três migrações
   deste arquivo: a regra canônica de suficiência é
       confirmedCount() >= 10  E  todo domínio com n >= 2.
   Um domínio sem score tem n = 0, logo QUALQUER sessão com domínio `n/d` tem o
   gate FECHADO. Portanto o radar de `#pr-maturity` com vértice omitido por
   UNSET DE DOMÍNIO só existia quando a publicação era proibida — ele era o
   próprio B-01, medido de outro ângulo.

   O que UG4 afirmava, linha a linha:
     nPts(poly)===4        → quatro vértices de score publicados com o gate FECHADO
     marks.length===1      → um marcador de eixo n/d nesse mesmo radar
     dashedAxes.length===1 → um eixo pontilhado nesse mesmo radar
     nText===5             → cinco rótulos (invariante P22 C)

   As três primeiras afirmavam publicação sob gate fechado e foram substituídas
   pela asserção correta: NADA de score por domínio é publicado. A quarta —
   a invariante P22 (C) de cinco rótulos — não foi removida: passou para o
   CONTROLE POSITIVO, executado no único estado em que o radar pode existir
   (gate aberto), onde a geometria UNSET continua provada no nível de PRÁTICA
   (UG8) e o zero confirmado continua plotável (UG7).
   ========================================================================== */
T("UG4","radar do PDF sob gate fechado: nenhum vértice de score é fabricado; com o gate aberto o radar mantém 5 <text> (invariante P22 C)",()=>{
  const {w,d}=boot();
  /* (a) NEGATIVO — domínio 4 inteiro n/d ⇒ n=0 ⇒ gate canônico FECHADO */
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  declareCtx(w,d);
  w.__DEV.preparePrint();
  const svgFechado=d.querySelector("#pr-maturity .pr-radar");
  const celulas=Array.from(d.querySelectorAll("#pr-maturity .pr-doms td")).map(t=>txt(t).trim());
  const nota=d.querySelector("#pr-nopub");
  w.__DEV.finishPrint();
  const fechadoOk = svgFechado===null &&
    celulas.length===5 && celulas.every(c=>c==="n/d") &&
    !!nota && /Evid[êe]ncia insuficiente/.test(txt(nota));

  /* (b) CONTROLE POSITIVO — gate ABERTO: o radar existe, tem os cinco vértices
         e mantém exatamente cinco <text>. Sem isto o gate passaria por ausência
         de conteúdo, e não por correção. */
  const {w:w2,d:d2}=boot();
  apply(w2,IDS.map(()=>1));
  declareCtx(w2,d2);
  w2.__DEV.preparePrint();
  const svgAberto=d2.querySelector("#pr-maturity .pr-radar");
  const polyAberto=svgAberto?svgAberto.querySelector("polygon[stroke='#DA291C']"):null;
  const nTextAberto=svgAberto?svgAberto.querySelectorAll("text").length:0;
  w2.__DEV.finishPrint();
  const abertoOk = !!svgAberto && nPts(polyAberto)===5 && nTextAberto===5;

  return fechadoOk && abertoOk;
});

/* ==========================================================================
   MIGRAÇÃO DE GATE · ERRATA FINAL · ALTO-1
   (parecer SHA-256 70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120)

   O que UG5 afirmava, linha a linha:
     !!t                        → o overlay do alvo EXISTE no radar de tela
     nPts(t)===4                → com quatro vértices, sob gate canônico FECHADO
     stroke-dasharray presente  → encoding tracejado exclusivo do alvo. PRESERVADO.
     stroke === "#3CB17E"       → cor exclusiva do alvo.                PRESERVADO.

   As duas primeiras afirmavam PUBLICAÇÃO GEOMÉTRICA do cenário-alvo com o gate
   canônico fechado — a mesma classe de ALTO-1, medida no radar de tela. Vale
   aqui o mesmo FATO ESTRUTURAL de UG4/UG6: um domínio sem score tem n = 0, logo
   o overlay de quatro vértices só existia quando a publicação era proibida.

   O parecer classificou esse overlay como "hoje inofensivo" porque a superfície
   legada de tela está oculta por CSS. Esta errata NÃO aceita esse fundamento: a
   §5.1 da instrução proíbe expressamente "depender de CSS sem corrigir a decisão
   na origem da publicação". A decisão passou para a origem, e o gate acompanha.

   As duas asserções de ENCODING não foram removidas: passaram para o CONTROLE
   POSITIVO, executado no único estado em que o overlay pode existir (gate
   aberto). A omissão de vértice por UNSET continua provada no nível de PRÁTICA
   por UG1 e UG8, e o zero confirmado continua plotável por UG7.
   ========================================================================== */
T("UG5","overlay de alvo (tela): sob gate canônico fechado nenhum polígono do alvo é criado; com gate aberto existe com 5 vértices e encoding tracejado verde exclusivo",()=>{
  /* (a) NEGATIVO — Serviços inteiro n/d ⇒ n=0 ⇒ gate canônico FECHADO */
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  w.__DEV.setTarget("logs",3); w.__DEV.showResults();
  const fechadoOk = d.querySelector(".ux-target-shape")===null &&
    d.querySelector("#ux-tgt-radarlegend")===null &&
    /perfil atual/i.test(d.querySelector("svg.radar").getAttribute("aria-label")||"") &&
    !/cen[áa]rio-alvo/i.test(d.querySelector("svg.radar").getAttribute("aria-label")||"") &&
    Object.keys(w.__DEV.TARGET.overrides).length===1;      /* o alvo continua SALVO */

  /* (b) CONTROLE POSITIVO — gate ABERTO: o overlay existe, com cinco vértices
         e o encoding exclusivo preservado byte a byte. Sem isto o gate passaria
         por ausência de conteúdo, e não por correção. */
  const {w:w2,d:d2}=boot();
  apply(w2,IDS.map(()=>1));
  w2.__DEV.setTarget("logs",3); w2.__DEV.showResults();
  const t=d2.querySelector(".ux-target-shape");
  const abertoOk = !!t && nPts(t)===5 && !!t.getAttribute("stroke-dasharray") &&
    t.getAttribute("stroke")==="#3CB17E" &&
    /cen[áa]rio-alvo/i.test(d2.querySelector("svg.radar").getAttribute("aria-label")||"");

  return fechadoOk && abertoOk;
});

/* MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA · B-01 (mesma causa de UG4).
   O que UG6 afirmava, linha a linha:
     nPts(cur)===4   → quatro vértices do perfil ATUAL publicados com o gate FECHADO
     nPts(tgt)===4   → quatro vértices do cenário-alvo, cujo vetor efetivo TAMBÉM
                       tem o gate fechado (o domínio Serviços continua sem resposta:
                       n = 0 nos dois perfis)
     stroke-dasharray no alvo  → encoding exclusivo do alvo. PRESERVADO.
     note contém "Serviços"    → a omissão é explicada em texto. PRESERVADO em
                                 forma mais forte: a nota passa a dizer POR QUE.

   As duas primeiras afirmavam publicação por domínio sob gate fechado e foram
   invertidas. As duas últimas continuam asseridas. O controle positivo, com o
   gate ABERTO nos dois perfis, garante que o gate não passa por ausência de
   conteúdo: ali os dois polígonos têm de existir, com cinco vértices cada. */
T("UG6","radar de alvo (PDF): sob gate fechado nenhum perfil publica score por domínio — INCLUSIVE com o vetor-alvo suficiente (caso B); com gate aberto a comparação volta completa",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  declareCtx(w,d);
  w.__DEV.setTarget("logs",3); w.__DEV.showResults();
  w.__DEV.preparePrint();
  const sec=d.querySelector("#pr-target");
  const polys=Array.from(sec.querySelectorAll("svg.pr-radar polygon")).filter(p=>p.getAttribute("stroke"));
  const cur=polys.find(p=>p.getAttribute("stroke")==="#307FE2");
  const tgt=polys.find(p=>p.getAttribute("stroke")==="#3CB17E");
  const note=sec.querySelector('[data-pr-nopub="target"]');
  const celulas=Array.from(sec.querySelectorAll(".pr-doms td")).map(t=>txt(t).trim());
  /* coluna 2 de cada linha é o ATUAL: nenhuma pode ser numérica */
  const atuais=[]; for(let i=0;i<celulas.length;i+=5) atuais.push(celulas[i+1]);
  w.__DEV.finishPrint();
  const fechadoOk = nPts(cur)===0 && nPts(tgt)===0 && !!tgt.getAttribute("stroke-dasharray") &&
    !!note && /Evid[êe]ncia insuficiente/.test(txt(note)) &&
    atuais.length===5 && atuais.every(c=>c==="n/d");

  /* ==========================================================================
     ERRATA FINAL · ALTO-1 · CASO B, o quadrante que faltava.

     O caso negativo acima mantém o vetor-alvo TAMBÉM insuficiente (Serviços
     com n = 0 nos dois perfis), de modo que `nPts(tgt)===0` passava por
     ausência de conteúdo. Era exatamente esse o ponto cego apontado pelo
     parecer 70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120
     (§10 ALTO-1, tabela "Ponto cego de gate").

     Aqui o vetor efetivo do alvo é DELIBERADAMENTE SUFICIENTE — cinco alvos
     sobre práticas nunca respondidas, um por domínio, levando o alvo a 10
     confirmadas e n = 2 em todos os domínios — enquanto o perfil ATUAL
     permanece com cinco confirmadas e o gate FECHADO. A suficiência do alvo é
     asserida ANTES das demais verificações: sem ela o caso seria vacuoso.
     ========================================================================== */
  const {w:wB,d:dB}=boot();
  const VEC_B=[1,null,null,1,null,null,1,null,null,1,null,null,1,null,null];
  apply(wB,VEC_B);
  declareCtx(wB,dB);
  [["governance",3],["training",2],["detection-lifecycle",3],["endpoint",2],["external-surface",3]]
    .forEach(([qid,v])=>{ if(wB.__DEV.setTarget(qid,v)!==true) throw new Error("setTarget recusou "+qid); });
  wB.__DEV.showResults();
  /* GUARDA DE NÃO-VACUIDADE: o gate do ALVO tem de estar materialmente ABERTO,
     e o do ATUAL materialmente FECHADO. Oracle recalculado aqui, sem chamar a
     decisão de publicação sob teste. */
  const curB=wB.__DEV.tgtCurrentProfile();
  const tgtB=wB.__DEV.computeTargetProfile(wB.__DEV.tgtEffectiveVector());
  const oracleB=domScores(VEC_B.map((v,k)=>{
    const ov={governance:3,training:2,"detection-lifecycle":3,endpoint:2,"external-surface":3}[IDS[k]];
    return ov===undefined? v : ov; }));
  const cenarioB = curB.suff===false && tgtB.suff===true && tgtB.overall!==null &&
    oracleB.every(x=>x!==null);
  wB.__DEV.preparePrint();
  const secB=dB.querySelector("#pr-target");
  const polysB=Array.from(secB.querySelectorAll("svg.pr-radar polygon")).filter(p=>p.getAttribute("stroke"));
  const curPB=polysB.find(p=>p.getAttribute("stroke")==="#307FE2");
  const tgtPB=polysB.find(p=>p.getAttribute("stroke")==="#3CB17E");
  const celB=Array.from(secB.querySelectorAll(".pr-doms td")).map(t=>txt(t).trim());
  const kpisB=Array.from(secB.querySelectorAll(".pr-kpi")).map(k=>txt(k).trim());
  const notaB=txt(secB.querySelector('[data-pr-nopub="target"]'));
  const linhasB=[]; for(let i=0;i<celB.length;i+=5) linhasB.push(celB.slice(i,i+5));
  wB.__DEV.finishPrint();
  const kpiAlvoB=kpisB.find(x=>/Cen[áa]rio-alvo/.test(x))||"";
  const casoB = cenarioB &&
    linhasB.length===5 &&
    linhasB.every(l=>l[1]==="n/d") &&                       /* coluna ATUAL */
    linhasB.every(l=>l[3]==="n/d") &&                       /* coluna ALVO  */
    linhasB.every(l=>l[4]==="n/d") &&                       /* GAP          */
    linhasB.every(l=>l[2]==="") &&                          /* nenhuma SETA */
    nPts(curPB)===0 && nPts(tgtPB)===0 &&
    !/\d[.,]\d/.test(kpiAlvoB) &&                           /* nenhum score de alvo */
    !/Inexistente|Inicial|Definido|Gerenciado|Otimiz/i.test(kpiAlvoB) &&   /* nenhum ESTÁGIO */
    /cen[áa]rio-alvo está salvo/i.test(notaB) &&             /* mensagem neutra e honesta */
    !/previs[ãa]o|resultado validado/i.test(notaB) &&
    Object.keys(wB.__DEV.TARGET.overrides).length===5;       /* o alvo continua SALVO e íntegro */

  /* CONTROLE POSITIVO · gate ABERTO: os dois polígonos existem, com 5 vértices. */
  const {w:w2,d:d2}=boot();
  apply(w2,IDS.map(()=>1));
  declareCtx(w2,d2);
  w2.__DEV.setTarget("logs",3); w2.__DEV.showResults();
  w2.__DEV.preparePrint();
  const sec2=d2.querySelector("#pr-target");
  const p2=Array.from(sec2.querySelectorAll("svg.pr-radar polygon")).filter(p=>p.getAttribute("stroke"));
  const cur2=p2.find(p=>p.getAttribute("stroke")==="#307FE2");
  const tgt2=p2.find(p=>p.getAttribute("stroke")==="#3CB17E");
  const cel2=Array.from(sec2.querySelectorAll(".pr-doms td")).map(t=>txt(t).trim());
  const linhas2=[]; for(let i=0;i<cel2.length;i+=5) linhas2.push(cel2.slice(i,i+5));
  w2.__DEV.finishPrint();
  /* sob gate ABERTO a comparação volta completa: setas presentes e valores
     numéricos dos dois lados — o gate não pode passar por supressão geral. */
  const abertoOk = nPts(cur2)===5 && nPts(tgt2)===5 &&
    linhas2.length===5 && linhas2.every(l=>l[2]==="→") &&
    linhas2.every(l=>/^\d\.\d$/.test(l[1])) && linhas2.every(l=>/^\d\.\d$/.test(l[3]));
  return fechadoOk && casoB && abertoOk;
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
  const expected=SCORES[2];                                /* 3.3 — média das confirmadas, sem zero fantasma */
  /* [ERRATA UG8 · 5.0.4] O oráculo de ausência de "n/d" governa o EIXO DE
     DOMÍNIO/RADAR congelado — a propriedade real deste gate: nenhuma sessão
     suficiente publica "n/d" onde os cinco domínios têm score. A expressão
     anterior coletava `#app` INTEIRO, o que era proxy adequado enquanto não
     existia um eixo POR PERGUNTA dentro de `#app`. A Camada 5 acrescenta esse
     segundo eixo, no qual `UI-016a`/A-8/§12.2 exigem literalmente "n/d" para
     perguntas ainda não respondidas — estado legítimo numa sessão globalmente
     suficiente. A coleta passa a ser NOMINAL sobre a superfície congelada;
     nenhuma asserção foi removida ou relaxada. UG9 continua sendo a regressão
     canônica de "n/d" quando um DOMÍNIO está realmente UNSET. */
  const domRows=Array.from(d.querySelectorAll("#app .grid2 .panel .dom"));
  const radar=q(d,"#app svg.radar");
  /* cardinalidade estrutural: ausência da superfície é FAIL, nunca PASS vacuoso */
  if(domRows.length!==5) throw new Error("UG8: eixo de domínio com "+domRows.length+" linhas (esperadas 5)");
  if(!radar) throw new Error("UG8: radar congelado #app svg.radar ausente");
  if(!shape) throw new Error("UG8: polígono do radar ausente");
  /* "n/d" tem de estar ausente NESTA superfície, linha a linha e no radar */
  domRows.forEach((r,i)=>{ if((txt(r)||"").includes("n/d"))
    throw new Error("UG8: 'n/d' no eixo congelado de domínio, linha "+i+": "+(txt(r)||"").replace(/\s+/g," ").trim()); });
  if((txt(radar)||"").includes("n/d")) throw new Error("UG8: 'n/d' no radar congelado");
  /* os CINCO valores observáveis são o score esperado — não uma ocorrência solta */
  const shown=domRows.map(r=>{const s=r.querySelector(".lbl > span");return s?txt(s).trim():null;});
  shown.forEach((v,i)=>{ if(v===null) throw new Error("UG8: valor de domínio ausente na linha "+i);
    if(v.indexOf(expected.toFixed(1))!==0)
      throw new Error("UG8: domínio "+i+" exibe '"+v+"' e não o score esperado "+expected.toFixed(1)); });
  return sc.every(s=>s===expected) && nPts(shape)===5 &&
    !d.querySelector("svg.radar .unset-mark");
});

/* ===================== REGRESSÃO — rótulo "n/d" byte-idêntico ===================== */

/* MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA · B-01 (mesma causa de UG4).
   O que UG9 afirmava, linha a linha:
     radarVals[4]==="n/d" · domLbls[4]==="n/d" · prCell[4]==="n/d"
        → o rótulo canônico `n/d` é o MESMO nos três meios. PRESERVADO.
     radarVals[0]==="1.7" · domLbls[0].startsWith("1.7") · prRadar contém "n/d"
        → publicação numérica do domínio 0 no radar de tela e na caixa de
          domínio, com o gate FECHADO. Estas afirmavam B-01 no DOM legado.

   A afirmação sobre o rótulo canônico é a razão de ser do gate e continua
   integral — agora nos CINCO domínios e nos três meios, que é o que o parecer
   exige por coerência tela × papel. As afirmações de publicação numérica sob
   gate fechado foram substituídas pelo seu oposto verificável no PAPEL (a
   superfície que chega ao cliente) e por um controle positivo com o gate
   ABERTO, onde `1.7` DEVE aparecer nos três meios. */
T("UG9","rótulo canônico 'n/d' preservado byte a byte em tela, régua e PDF; sob gate fechado o papel não publica score por domínio",()=>{
  const {w,d}=boot();
  apply(w,IDS.map((_,k)=>DOM_OF[k]===4?null:1));
  const radarVals=Array.from(d.querySelectorAll("svg.radar text.v")).map(t=>txt(t).trim());
  const domLbls=Array.from(d.querySelectorAll(".panel .dom .lbl > span")).map(t=>txt(t).trim());
  declareCtx(w,d);
  w.__DEV.preparePrint();
  const prCell=Array.from(d.querySelectorAll("#pr-maturity .pr-doms td")).map(t=>txt(t).trim());
  const nota=d.querySelector("#pr-nopub");
  w.__DEV.finishPrint();
  const fechadoOk =
    radarVals.length===5 && radarVals[4]==="n/d" &&        /* rótulo canônico: PRESERVADO */
    domLbls[4]==="n/d" &&                                   /* rótulo canônico: PRESERVADO */
    prCell.length===5 && prCell.every(c=>c==="n/d") &&      /* papel: nenhum score publicado */
    !!nota && /n\/d/.test(txt(nota));                       /* e o papel explica por quê */

  /* CONTROLE POSITIVO · gate ABERTO: `1.7` aparece nos três meios, byte a byte. */
  const {w:w2,d:d2}=boot();
  apply(w2,IDS.map(()=>1));
  const rv2=Array.from(d2.querySelectorAll("svg.radar text.v")).map(t=>txt(t).trim());
  const dl2=Array.from(d2.querySelectorAll(".panel .dom .lbl > span")).map(t=>txt(t).trim());
  declareCtx(w2,d2);
  w2.__DEV.preparePrint();
  const pc2=Array.from(d2.querySelectorAll("#pr-maturity .pr-doms td")).map(t=>txt(t).trim());
  w2.__DEV.finishPrint();
  return fechadoOk && rv2[0]==="1.7" && dl2[0].startsWith("1.7") && pc2[0]==="1.7";
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

/* ===================== LAYOUT — medido no Chromium (UG13) =====================
   jsdom não faz layout: bounding box exige browser real. O gate roda DENTRO desta suíte para não
   tocar tests_visual/ (fora da boundary autorizada). Sem browser resolvível o gate é declarado
   NÃO EXECUTADO — nunca PASS silencioso —, preservando o invariante congelado de que `test:all`
   passa sem browser instalado (VISUAL_GATES_V32.md). */
function resolveBrowser(){                                   /* mesma ordem de playwright.config.js */
  const explicit=process.env.CHROME_PATH;
  const local="/opt/google/chrome/chrome";
  return explicit || (fs.existsSync(local) ? local : null);
}
async function ug13(){
  let chromium;
  try{ ({chromium}=require("@playwright/test")); }
  catch(e){ console.log("SKIP  UG13 — layout da nota no Chromium — NÃO EXECUTADO (@playwright/test ausente)");
    return {skipped:true}; }
  const exe=resolveBrowser();
  const opts={args:["--no-sandbox","--disable-dev-shm-usage"]};
  if(exe) opts.executablePath=exe;
  let b;
  try{ b=await chromium.launch(opts); }
  catch(e){ console.log("SKIP  UG13 — layout da nota no Chromium — NÃO EXECUTADO (browser indisponível: "+e.message.split("\n")[0]+")");
    return {skipped:true}; }
  try{
    const p=await b.newPage({viewport:{width:1440,height:900}});
    const url="file://"+path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html");
    /* (a) com UNSET: a nota existe e NÃO sobrepõe nenhum rótulo do radar */
    await p.goto(url);
    await p.evaluate(IDS=>{ IDS.forEach((id,k)=>window.__DEV.setAnswerById(id, k>=12?null:1));
      window.__DEV.setArq(0); window.__DEV.showResults(); }, IDS);
    const m=await p.evaluate(()=>{
      const note=document.querySelector(".radar-unset-note");
      if(!note) return {note:null};
      const r=e=>{const b=e.getBoundingClientRect();return {l:b.left,t:b.top,r:b.right,b:b.bottom,w:b.width,h:b.height};};
      const labels=Array.from(document.querySelectorAll("svg.radar text[data-dom]")).map(r);
      const values=Array.from(document.querySelectorAll("svg.radar text.v")).map(r);
      return {note:r(note), labels, values};
    });
    const disjoint=(a,z)=>a.r<=z.l||z.r<=a.l||a.b<=z.t||z.b<=a.t;   /* 0 px de tolerância */
    const okA = !!m.note && m.note.h>0 && m.labels.length===5 &&
      m.labels.every(x=>disjoint(m.note,x)) && m.values.every(x=>disjoint(m.note,x));
    /* (b) sem UNSET: a nota não existe */
    await p.goto(url);
    await p.evaluate(IDS=>{ IDS.forEach(id=>window.__DEV.setAnswerById(id,1));
      window.__DEV.setArq(0); window.__DEV.showResults(); }, IDS);
    const noNote=await p.evaluate(()=>!document.querySelector(".radar-unset-note"));
    const ok=okA&&noNote;
    results.push({id:"UG13",ok});
    console.log((ok?"PASS":"FAIL")+"  UG13 — layout: nota de UNSET não sobrepõe rótulos do radar (bbox disjuntos, Chromium); sem UNSET, nota ausente"+
      (ok?"":` [note=${JSON.stringify(m.note)} labels=${JSON.stringify(m.labels)} noNote=${noNote}]`));
    return {skipped:false};
  } finally { await b.close(); }
}

(async()=>{
  const r13=await ug13();
  const fail=results.filter(x=>!x.ok).length;
  const skipped=r13.skipped?1:0;
  console.log(`\nUNSET GEOMETRY (UG): ${results.length-fail} PASS · ${fail} FAIL de ${results.length}` +
    (skipped?` · ${skipped} NÃO EXECUTADO (UG13 requer Chromium)`:""));
  process.exit(fail?1:0);
})();
