/* ============ PHASE 4.5 · MATURITY JOURNEY & EXECUTIVE NARRATIVE (interpretativa; engine intocado) ============ */
/* [C] representação read-only derivada da fonte canônica stageOf() — sem thresholds independentes */
function stagesView(){
  const seen=[], out=[];
  for(let v=0; v<=5.001; v+=0.1){ const s=stageOf(Math.round(v*10)/10);
    if(s && !seen.includes(s.pt)){ seen.push(s.pt); out.push({en:s.en, pt:s.pt}); } }
  return out;
}
function stageIndexOf(stage, list){ return stage? list.findIndex(s=>s.pt===stage.pt) : -1; }
const JOURNEY_NEXT_NOTE = "O próximo estágio representa a próxima faixa do modelo de maturidade. A transição depende da evolução consistente das práticas e das evidências correspondentes.";
const JOURNEY_TGT_NOTE = "O cenário-alvo representa práticas explicitamente selecionadas nesta sessão e não constitui previsão de resultado.";
const PRACTICE_PHRASES = {
  /* PHASE 5.2 · REV B (COPY-B §5.1): "mandato" sai da linguagem apresentada ao
     usuário e ao cliente. O tema é o mesmo; muda a palavra. */
  mandate:"Formalizar direcionamento, responsabilidades e critérios de decisão.",
  governance:"Estruturar governança e acompanhamento executivo da operação.",
  policies:"Consolidar políticas e padrões operacionais.",
  "team-capacity":"Dimensionar e sustentar a capacidade do time.",
  training:"Estruturar desenvolvimento e treinamento contínuos.",
  knowledge:"Consolidar e validar o conhecimento operacional.",
  "incident-response":"Ampliar consistência dos processos de detecção e resposta.",
  "detection-lifecycle":"Gerenciar o ciclo de vida das detecções como casos de uso.",
  automation:"Evoluir automação e orquestração das rotinas operacionais.",
  logs:"Consolidar centralização, correlação e retenção de eventos.",
  endpoint:"Ampliar cobertura e gestão da proteção de endpoint.",
  "network-visibility":"Ampliar visibilidade de rede e tráfego.",
  "monitoring-coverage":"Ampliar cobertura e continuidade do monitoramento.",
  "external-surface":"Estruturar a gestão da superfície externa.",
  "vulnerability-management":"Sistematizar a gestão de vulnerabilidades."
};
/* [I] snapshot read-only — somente dados já calculados */
function buildNarrativeSnapshot(){
  const stats=DOMS.map((_,i)=>domStat(i));
  const suff=dataSufficiency(stats);
  const scored=stats.filter(s=>s.score!==null);
  const overall=suff&&scored.length?Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10:null;
  const {findings}=computeFindings();
  const ctx=V32.buildRecommendationContext();
  const tgtOv=Object.keys(TARGET_PROFILE.overrides).length;
  const tgt=tgtOv?computeTargetProfile(tgtEffectiveVector()):null;
  return {
    maturity:{ score:overall, stage:overall===null?null:stageOf(overall), sufficient:suff,
      domainScores:DOMS.map((dm,i)=>({dom:dm.pt, score:stats[i].score, n:stats[i].n})) },
    archetype: ARQ[arq??0]? ARQ[arq??0].t||ARQ[arq??0].name||null : null,
    priorities:[...businessPriority],
    findings:{ high:findings.filter(f=>f.sev===2).map(f=>f.id), moderate:findings.filter(f=>f.sev===1).map(f=>f.id) },
    technologyContext:{ informed:!ctx.legacyMode,
      classifications:Object.values(ctx.contexts||{}).map(c=>c.classification) },
    recommendationContext:{ candidateNames:Object.values(ctx.contexts||{}).flatMap(c=>(c.candidates||[]).map(x=>(V32.OFFERINGS[x.itemId]||{}).name)).filter(Boolean) },
    target:{ exists:tgtOv>0, sufficient:!!(tgt&&tgt.suff), score:tgt?tgt.overall:null,
      stage:tgt&&tgt.overall!==null?tgt.stage:null },
    operationalRefinement:getOperationalRefinementSnapshot().filter(r=>r.answer!==null)
  };
}
/* [C/E/F] modelo do journey */
function journeyModel(snap){
  const L=stagesView();
  const cur=snap.maturity.sufficient? stageIndexOf(snap.maturity.stage,L) : -1;
  const next=(cur>=0 && cur<L.length-1)? cur+1 : -1;
  /* ==========================================================================
     ERRATA FINAL · ALTO-1 · o marcador `Cenário-alvo` da régua é PUBLICAÇÃO DE
     ESTÁGIO DO ALVO, e a régua é a mesma comparação em outra superfície.
     Respondia só a `snap.target.sufficient` (o gate do vetor efetivo do alvo),
     enquanto `cur` já exigia `snap.maturity.sufficient`. Com o gate canônico
     FECHADO e alvos declarados em quantidade suficiente, a régua imprimia o
     losango verde sobre um estágio nomeado, na mesma página em que declara
     "Posicionamento atual: n/d — não há evidência suficiente". Passa a exigir
     a MESMA decisão do perfil atual, como todas as demais superfícies.
     ========================================================================== */
  const tgtIdx=(snap.maturity.sufficient && snap.target.exists && snap.target.sufficient && snap.target.stage)? stageIndexOf(snap.target.stage,L) : -1;
  return { stages:L, cur, next, tgt:tgtIdx, top:(cur===L.length-1) };
}
/* [G] temas de evolução — determinístico, máx 3, priority-first, sem produtos */
function evolutionThemes(snap){
  const seen=new Set(), out=[];
  const push=id=>{ if(out.length<3 && PRACTICE_PHRASES[id] && !seen.has(id)){ seen.add(id); out.push({id, phrase:PRACTICE_PHRASES[id]}); } };
  snap.priorities.forEach(id=>{ if(snap.findings.high.includes(id)||snap.findings.moderate.includes(id)) push(id); });
  snap.findings.high.forEach(push); snap.findings.moderate.forEach(push);
  const REF_FALLBACK={"ref-metrics":"Integrar métricas ao ciclo de melhoria contínua.",
    "ref-lessons":"Estruturar o aprendizado pós-incidente e o acompanhamento das ações.",
    "ref-hunting":"Tornar a atuação proativa e o threat hunting mais recorrentes."};
  ["ref-metrics","ref-lessons","ref-hunting"].forEach(rid=>{                 /* [4.5.0.1-F] só fallback, só nível baixo */
    const r=snap.operationalRefinement.find(x=>x.id===rid);
    if(out.length<3 && r && r.answer<=1 && !seen.has(rid)){ seen.add(rid); out.push({id:rid, phrase:REF_FALLBACK[rid]}); } });
  return out;
}
/* [M] força relativa com empate plural e threshold explícito (0.5) */
function domainExtremes(snap){
  const ds=snap.maturity.domainScores.filter(d=>d.n>=2 && d.score!==null);
  if(!ds.length) return null;
  const max=Math.max(...ds.map(d=>d.score)), min=Math.min(...ds.map(d=>d.score));
  return { hi:ds.filter(d=>d.score===max).map(d=>d.dom), lo:ds.filter(d=>d.score===min).map(d=>d.dom),
    spread:Math.round((max-min)*10)/10, max, min };
}
const joinPt=a=>a.length<=1?a[0]:a.slice(0,-1).join(", ")+" e "+a[a.length-1];
/* [H/J/K/L/N/O/P/Q/R/X] narrativa pura e determinística, com trace */
function buildExecutiveNarrative(snap){
  const trace=[], P=[];
  const model=journeyModel(snap);
  /* P1 — posição atual */
  let p1, s1=[];
  const ex=domainExtremes(snap);
  if(snap.maturity.sufficient){
    p1=`O Quickscan posiciona a operação em ${snap.maturity.stage.pt} (${snap.maturity.score.toFixed(1)}/5)`;
    s1.push("maturity.stage","maturity.score");
    if(ex && ex.spread>=0.5){
      p1+=`, com maior consistência relativa em ${joinPt(ex.hi)} e oportunidades mais relevantes de evolução em ${joinPt(ex.lo)}`;
      s1.push("domainScores.extremes");
      p1+=`. A distribuição mostra que a evolução não é uniforme entre os domínios avaliados.`;
    } else if(ex){ p1+=`. Os domínios apresentam resultados próximos entre si, indicando um perfil relativamente equilibrado dentro do estágio atual.`; s1.push("domainScores.homogeneous"); }
    else p1+=`.`;
  } else {
    p1=`As respostas disponíveis ainda não são suficientes para posicionar a operação em um estágio de maturidade com segurança.`;
    s1.push("maturity.insufficient");
    const gapsN=snap.findings.high.length+snap.findings.moderate.length;
    if(gapsN){ p1+=` Ainda assim, o Quickscan identifica sinais relevantes nos gaps já confirmados durante a sessão.`; s1.push("findings.confirmed"); }
  }
  P.push(p1); trace.push({paragraph:1, sources:s1});
  /* P2 — implicação operacional */
  let p2="", s2=[];
  if(snap.priorities.length){
    const labels=snap.priorities.slice(0,3).map(id=>{ const k=QS.findIndex(q=>q.id===id); return k>=0?QS[k].lbl:id; });
    p2+=`Considerando as prioridades declaradas pelo negócio — ${joinPt(labels)} —, `;
    s2.push("priorities.order");
  } else { p2+=`Nenhuma prioridade específica foi declarada nesta sessão; `; s2.push("priorities.none"); }
  const nh=snap.findings.high.length, nm=snap.findings.moderate.length;
  if(nh+nm===0){ p2+=`não foram observados gaps altos ou moderados entre as práticas confirmadas nesta sessão.`; s2.push("findings.none"); }
  else { p2+=`foram observados ${nh} gap${nh===1?"":"s"} alto${nh===1?"":"s"} e ${nm} moderado${nm===1?"":"s"}, que concentram os principais pontos de evolução identificados nesta sessão.`; s2.push("findings.counts"); }
  snap.operationalRefinement.forEach(r=>{
    if(r.id==="ref-metrics"&&r.answer<=1){ p2+=` O aprofundamento indica que o uso de métricas ainda possui baixa integração com o ciclo de melhoria.`; s2.push("refinement.metrics"); }
    if(r.id==="ref-metrics"&&r.answer>=2){ p2+=` O aprofundamento indica que métricas já orientam parte das decisões de melhoria.`; s2.push("refinement.metrics"); }
    if(r.id==="ref-lessons"&&r.answer>=2){ p2+=` A prática declarada de aprendizado pós-incidente já oferece uma base favorável para evolução contínua.`; s2.push("refinement.lessons"); }
    if(r.id==="ref-lessons"&&r.answer<=1){ p2+=` O aprendizado pós-incidente ainda ocorre de forma pontual, segundo o aprofundamento.`; s2.push("refinement.lessons"); }
    if(r.id==="ref-hunting"){ p2+=` A atuação proativa declarada é um sinal qualitativo ${r.answer>=2?"favorável":"ainda incipiente"} para a evolução da detecção.`; s2.push("refinement.hunting"); }
  });
  P.push(p2); trace.push({paragraph:2, sources:s2});
  /* P3 — direção de evolução */
  /* ==========================================================================
     009 · C6/C7 — FIM DA REPETIÇÃO EM PROSA DOS PRÓXIMOS PASSOS.
     O P3 reenumerava os temas em minúscula e sem ponto, duplicando a lista
     "Para avançar" (`journeyHTML`, `.jn-themes`), que continua sendo a ÚNICA
     enumeração. Agora o P3 APONTA para o rótulo canônico dessa lista.
     Três ramos, e nenhum inventa lista:
       · suficiência aberta + tema  → só o ponteiro;
       · suficiência fechada + tema → a frase canônica de validação de
         evidências (regressão N13-N14 de `tests_journey_m45.js`) e o ponteiro
         "em paralelo";
       · sem tema → NÃO existe `.jn-themes`, logo não existe ponteiro; vale a
         frase de sustentação/otimização já existente.
     `trace[2].sources` mantém `evolution.themes` onde há tema: a frase existe
     porque os temas existem, e a rastreabilidade não some com a enumeração.
     ========================================================================== */
  let p3="", s3=[];
  const themes=evolutionThemes(snap);
  if(!snap.maturity.sufficient){ p3+=`O próximo passo mais consistente é completar e validar as evidências pendentes, em vez de perseguir um estágio artificial.`; s3.push("evolution.validate");
    if(themes.length){ p3+=` Em paralelo, os temas de evolução já identificados estão reunidos na lista “Para avançar”.`; s3.push("evolution.themes"); } }
  else if(themes.length){ p3+=`Os próximos passos mais consistentes desta leitura estão reunidos na lista “Para avançar”.`; s3.push("evolution.themes"); }
  else { p3+=`O conjunto avaliado não apresenta gaps confirmados relevantes; a evolução tende a se concentrar em sustentação e otimização das práticas existentes.`; s3.push("evolution.none"); }
  if(snap.technologyContext.informed){
    const ops=snap.technologyContext.classifications.some(c=>/OPERATIONAL|ADOPTION|COVERAGE/.test(c||""));
    if(ops){ p3+=` O contexto tecnológico declarado indica que parte das capacidades já possui tecnologia associada, portanto algumas oportunidades parecem mais relacionadas à adoção, cobertura ou operação do que à ausência de ferramenta.`; s3.push("landscape.operational"); }
    else { p3+=` O contexto tecnológico declarado foi considerado na leitura das oportunidades.`; s3.push("landscape.informed"); }
  } else { p3+=` O contexto tecnológico não foi informado nesta sessão; por isso, a leitura evita inferir presença ou ausência de ferramentas.`; s3.push("landscape.unset"); }
  if(snap.target.exists && snap.target.sufficient && snap.target.stage && snap.maturity.stage){
    if(snap.target.stage.pt===snap.maturity.stage.pt){
      p3+=` Embora o cenário-alvo eleve o score para ${snap.target.score.toFixed(1)}/5, ele permanece dentro do mesmo estágio indicativo, sugerindo uma evolução relevante dentro do nível atual antes da transição seguinte.`;
      s3.push("target.sameStage");
    } else {
      p3+=` O cenário-alvo definido projeta ${snap.target.stage.pt} (${snap.target.score.toFixed(1)}/5) caso as práticas selecionadas sejam efetivamente implementadas e operacionalizadas.`;
      s3.push("target.conditional");
    }
  }
  if(snap.recommendationContext.candidateNames.length){
    p3+=` As soluções e serviços identificados devem ser tratados como possíveis habilitadores das práticas priorizadas.`;
    s3.push("recommendations.enablers");
  }
  P.push(p3); trace.push({paragraph:3, sources:s3});
  return { paragraphs:P, trace };
}
/* [E/T/U] renderização do journey */
function journeyHTML(snap, forPrint){
  const m=journeyModel(snap);
  /* UAT-05 · régua de seis estágios com geometria uniforme.
     Antes: glifos ○ • ● ◎ ◆ de tamanhos diferentes, sem número e sem estado
     legível — os estágios não se distinguiam. Agora cada nó tem a MESMA
     geometria e área visual, carrega sempre o número 0–5 e o nome do estágio,
     e o estado vai num atributo (`data-jn-state`) + rótulo textual, de modo
     que forma e texto — não apenas cor — carregam o significado.
     `n/d` nunca vira estágio zero: sem suficiência, nenhum nó é "current". */
  const nodes=m.stages.map((s,i)=>{
    const estados=[];
    if(m.cur>=0 && i<m.cur) estados.push("past");
    if(i===m.cur) estados.push("current");
    if(i===m.next && !m.top) estados.push("next");
    if(i===m.tgt) estados.push("target");
    if(!estados.length) estados.push(m.cur<0 ? "undetermined" : "future");
    const principal = estados.indexOf("current")>=0 ? "current"
                    : estados.indexOf("target")>=0 ? "target"
                    : estados.indexOf("next")>=0 ? "next"
                    : estados[0];
    const labels=[];
    if(estados.indexOf("current")>=0) labels.push("Perfil atual");
    if(estados.indexOf("next")>=0) labels.push("Próximo estágio");
    if(estados.indexOf("target")>=0) labels.push("Cenário-alvo");
    /* As classes LEGADAS (`jn-cur`, `jn-next`, `jn-tgt`, `jn-past`) são mantidas
       de forma aditiva: as suítes congeladas JOURNEY 4.5 e o gate visual V8
       selecionam por elas, e a Phase 5.1 não tem motivo para quebrar contratos
       de seleção — o que ela muda é a APRESENTAÇÃO do nó, não a sua identidade. */
    const LEGADO = { current:"jn-cur", next:"jn-next", target:"jn-tgt",
                     past:"jn-past", future:"jn-past", undetermined:"jn-past" };
    const legadas = estados.map(e=>LEGADO[e]).filter((v,i,a)=>v && a.indexOf(v)===i);
    const cls=["jn-node","jn-"+principal].concat(legadas).concat(estados.map(e=>"jn-is-"+e)).join(" ");
    return `<div class="${cls}" data-jn-state="${principal}" data-jn-index="${i}"${
        estados.indexOf("target")>=0?' data-jn-target="true"':""}>
      <span class="jn-mark" aria-hidden="true"><span class="jn-num">${i}</span></span>
      <span class="jn-name">${esc32(s.pt)}</span>
      ${labels.length?`<span class="jn-label">${labels.map(x=>esc32(x)).join(" · ")}</span>`:""}</div>`;
  }).join(`<span class="jn-link" aria-hidden="true"></span>`);
  const head = m.cur<0
    ? `<div class="jn-nd"><b>Posicionamento atual: n/d</b><br>Não há evidência suficiente neste Quickscan para posicionar a operação com segurança em um estágio de maturidade.</div>`
    : (m.top? `<div class="ux-micro">Estágio mais elevado do modelo · Foco de evolução: sustentação e otimização das práticas.</div>`:"");
  const themes=evolutionThemes(snap);
  const themesHTML=themes.length?`<div class="jn-themes"><div class="eyebrow">Para avançar</div><ul>${themes.map(t=>`<li>${esc32(t.phrase)}</li>`).join("")}</ul></div>`:"";
  const notes=`<div class="ux-micro jn-note">${esc32(JOURNEY_NEXT_NOTE)}${snap.target.exists?" "+esc32(JOURNEY_TGT_NOTE):""}</div>`;
  return `${forPrint?"":`<div class="section-title"><div class="eyebrow">Jornada de maturidade</div></div>`}
    <div class="${forPrint?"pr-card":"v32-block"} jn-wrap">${head}<div class="jn-track" role="img"
      aria-label="Jornada de maturidade: estágios do modelo com perfil atual${m.tgt>=0?", próximo estágio e cenário-alvo":m.next>=0?" e próximo estágio":""}.">${nodes}</div>${themesHTML}${notes}</div>`;
}
/* ============================================================================
   009 · C4 — IDENTIDADE DO DOMÍNIO NA LEITURA EXECUTIVA.
   Pós-processamento de RENDERIZAÇÃO, no precedente dos eixos do radar
   (`ui_ux_v32.js:190-192`): a identidade entra no nó, nunca na fonte.
   `buildExecutiveNarrative` continua devolvendo string PURA (INV-7) e o
   `textContent` do parágrafo é idêntico ao de antes da marcação — a marcação
   é aplicada DEPOIS do `esc32`, de modo que o único markup do parágrafo é o
   `<span>` desta função e nenhum texto de narrativa pode virar tag.
   Só ocorrência EXATA, sensível a maiúsculas e de PALAVRA INTEIRA do nome
   canônico `DOMS[i].pt`: "serviços" e "tecnológico" em minúscula aparecem no
   mesmo texto com outro sentido e não podem ser marcados.
   A cor vem do CSS pelo mapa único `[data-dom] → --dom-accent`, com canal
   NÃO-CROMÁTICO na regra de `.jn-dom` (a marcação chega ao papel pela mesma
   função, e no papel o peso sozinho preserva o significado). NENHUM hex de
   domínio entra neste arquivo.
   ========================================================================== */
let JN_DOM_RE=null;
function jnDomMark(escaped){
  if(!JN_DOM_RE) JN_DOM_RE=new RegExp("(?<![\\p{L}\\p{N}_])("+
    DOMS.map(d=>String(d.pt).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+
    ")(?![\\p{L}\\p{N}_])","gu");
  return String(escaped).replace(JN_DOM_RE, m=>{
    const i=DOMS.findIndex(d=>d.pt===m);
    return i<0? m : `<span class="jn-dom" data-dom="${i}">${m}</span>`;
  });
}
function narrativeHTML(snap, forPrint){
  const n=buildExecutiveNarrative(snap);
  return `${forPrint?"":`<div class="section-title"><div class="eyebrow">Leitura executiva</div></div>`}
    <div class="${forPrint?"pr-card":"v32-block"} jn-narrative">${n.paragraphs.map(p=>`<p>${jnDomMark(esc32(p))}</p>`).join("")}</div>`;
}
function journeySection(app){
  const old=document.getElementById("ux-journey"); if(old) old.remove();
  const grid=app.querySelector(".grid2");
  const row=document.getElementById("ux-execrow");
  const anchor=grid||row; if(!anchor) return;
  const snap=buildNarrativeSnapshot();
  const div=document.createElement("div"); div.id="ux-journey";
  div.innerHTML = journeyHTML(snap,false) + narrativeHTML(snap,false);
  if(grid) grid.insertAdjacentElement("afterend", div);          /* [4.5.0.1-B] resumo → Jornada → narrativa → prioridades */
  else row.parentNode.insertBefore(div, row);
}
/* [W] PDF: Journey + narrativa, mesma semântica, print-safe */
window.__uxJourneyPrintHTML = function(){
  const snap=buildNarrativeSnapshot();
  return `<div class="pr-sec" id="pr-journey"><h2>Jornada de maturidade</h2>${journeyHTML(snap,true)}
    <h2>Leitura executiva</h2>${narrativeHTML(snap,true)}</div>`;
};
if (window.__DEV) Object.assign(window.__DEV, {
  stagesView, journeyModel, buildNarrativeSnapshot, buildExecutiveNarrative, evolutionThemes, domainExtremes
});
