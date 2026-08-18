/* ============ PHASE 4.4 · TIME EXPECTATIONS & OPERATIONAL REFINEMENT (camada qualitativa; engine intocado) ============ */
const OPERATIONAL_REFINEMENT = { answers: { "ref-metrics": null, "ref-lessons": null, "ref-hunting": null } };
let refStage = "unseen";           /* "unseen" | 0|1|2 | "done" */
let refReturn = null;              /* null=fluxo normal (priority) | "results" */
const OPERATIONAL_REFINEMENT_QUESTIONS = [
 { id:"ref-metrics", domain:2, title:"Métricas e melhoria contínua",
   prompt:"Como a operação mede sua efetividade e utiliza os resultados para evoluir continuamente?",
   opts:[
    {t:"Não medimos de forma estruturada", d:"Métricas operacionais são inexistentes ou usadas apenas de forma pontual."},
    {t:"Algumas métricas são acompanhadas", d:"Indicadores como volume, tempos ou backlog são acompanhados, mas com pouca ligação com decisões de melhoria."},
    {t:"Métricas orientam melhorias", d:"Indicadores de cobertura, qualidade, eficiência e resposta são revisados periodicamente e usados para priorizar melhorias."},
    {t:"Melhoria contínua é sistemática", d:"Métricas, tendências e resultados operacionais alimentam um ciclo formal de revisão, priorização, implementação e validação de melhorias."}]},
 { id:"ref-lessons", domain:2, title:"Aprendizado pós-incidente",
   prompt:"O que acontece depois que um incidente relevante é encerrado?",
   opts:[
    {t:"Normalmente o trabalho termina com o encerramento", d:"Não existe revisão estruturada do que funcionou, falhou ou precisa mudar."},
    {t:"Revisões acontecem pontualmente", d:"Alguns incidentes geram discussões ou lessons learned, mas sem processo consistente de acompanhamento."},
    {t:"Lições aprendidas geram melhorias", d:"Incidentes relevantes são revisados e podem atualizar playbooks, detecções, controles, procedimentos ou treinamento."},
    {t:"O aprendizado fecha o ciclo operacional", d:"Post-incident reviews são sistemáticos, ações possuem responsáveis e prazos e sua implementação e efetividade são acompanhadas."}]},
 { id:"ref-hunting", domain:3, title:"Atuação proativa e threat hunting",
   prompt:"A operação procura ameaças de forma proativa além dos alertas gerados pelos controles existentes?",
   opts:[
    {t:"A atuação é predominantemente reativa", d:"O trabalho começa principalmente a partir de alertas, tickets ou incidentes reportados."},
    {t:"Investigações proativas acontecem pontualmente", d:"Analistas realizam buscas ou investigações específicas quando há tempo, inteligência ou suspeita relevante."},
    {t:"Threat hunting é uma prática recorrente", d:"Hipóteses são formuladas e investigadas periodicamente utilizando telemetria e inteligência disponível."},
    {t:"Hunting alimenta continuamente a detecção", d:"Hunting é estruturado, mede resultados e transforma achados em novas detecções, melhorias de cobertura e conhecimento operacional."}]}
];
function setRefinementAnswer(id, v){                            /* [R4] somente 0..3|null */
  if (!(id in OPERATIONAL_REFINEMENT.answers)) return false;
  if (v===null){ OPERATIONAL_REFINEMENT.answers[id]=null; return true; }
  v=+v; if(!(v>=0 && v<=3)) return false;
  OPERATIONAL_REFINEMENT.answers[id]=v; return true;
}
function clearOperationalRefinement(){                          /* [L] helper ÚNICO */
  Object.keys(OPERATIONAL_REFINEMENT.answers).forEach(k=>OPERATIONAL_REFINEMENT.answers[k]=null);
  refStage="unseen"; refReturn=null;
}
function refAnsweredCount(){ return Object.values(OPERATIONAL_REFINEMENT.answers).filter(v=>v!==null).length; }
function getOperationalRefinementSnapshot(){                    /* [P] read-only p/ Phase 4.5 */
  return OPERATIONAL_REFINEMENT_QUESTIONS.map(rq=>({ id:rq.id, answer:OPERATIONAL_REFINEMENT.answers[rq.id],
    label:rq.title, domain:rq.domain }));
}
/* ---------- interceptação: SOMENTE na transição natural pergunta 15 → priority ---------- */
let __refPrevStep = null;
const __renderCore44 = render;
render = function(){
  const cameFromLastQ = (__refPrevStep === QS.length);
  __refPrevStep = step;
  if (typeof refStage === "number"){ renderRefQuestion(); return; }   /* estado dominante: branch OU edição pós-resultado */
  if (step === PRIORITY_STEP && refStage === "unseen" && cameFromLastQ){ renderRefBranch(); return; }
  __renderCore44();
};
function renderRefBranch(){                                     /* [D] decisão explícita, sem hierarquia coercitiva */
  document.body.dataset.uxscreen = "refbranch";                  /* [4.4.0.1-B] antes dos helpers: Priority não fica ativa */
  renderProgress();
  try{ uxProgressDomains(); uxProgressMobile(); }catch(e){}
  const pt=document.getElementById("ptext"); if(pt) pt.textContent="Core concluído · aprofundamento opcional";
  const pm=document.getElementById("ux-progress-mobile"); if(pm){ pm.textContent="Core concluído · aprofundamento opcional"; pm.setAttribute("aria-label","Core concluído · aprofundamento opcional"); }
  $("#app").innerHTML = `<section class="screen">
    <div class="eyebrow">Seu perfil-base está pronto</div>
    <h1 class="ux-ref-h1">As 15 perguntas principais foram concluídas.</h1>
    <p class="lead">Você pode seguir para a etapa final ou responder 3 perguntas adicionais para refinar a leitura operacional.</p>
    <div class="ux-ref-meta">Refinar diagnóstico · +3 perguntas · ~2–4 min</div>
    <div class="ux-ctxactions">
      <button class="cta" id="ref-go" type="button">Refinar diagnóstico</button>
      <button class="btn2" id="ref-skip-all" type="button">Continuar sem aprofundamento</button>
    </div></section>`;
  $("#ref-go").onclick = ()=>{ refStage=0; render(); };
  $("#ref-skip-all").onclick = ()=>{ refStage="done"; render(); };
}
function refFinish(){
  refStage="done";
  if (refReturn==="results"){ refReturn=null; step=RESULTS_STEP; render(); }
  else render();                                                 /* fluxo normal → priority */
}
function renderRefQuestion(){                                    /* [H/I/Q] tela dedicada, progress próprio 1..3 */
  const i=refStage, rq=OPERATIONAL_REFINEMENT_QUESTIONS[i];
  document.body.dataset.uxscreen = "refinement";                 /* [4.4.0.1-C] progress principal oculto via CSS */
  const cur=OPERATIONAL_REFINEMENT.answers[rq.id];
  $("#app").innerHTML = `<section class="screen" data-dom="${rq.domain}">
    <div class="eyebrow">Refinamento do diagnóstico</div>
    <div class="qnum">3 perguntas · ~2–4 min</div>
    <div class="ux-ref-prog" role="status" aria-label="Pergunta ${i+1} de 3">${i+1} de 3</div>
    <fieldset class="ux-ref-fs"><legend class="question">${esc32(rq.title)} — ${esc32(rq.prompt)}</legend>
    <p class="hint">Estas respostas aprofundam a interpretação operacional e não alteram sua pontuação de maturidade.</p>
    <div class="opts">${rq.opts.map((o,ix)=>`
      <button class="opt${cur===ix?" sel":""}" type="button" data-ref="${ix}" aria-pressed="${cur===ix}">
        <span class="key">${cur===ix?"✓":ix+1}</span>
        <span><span class="t">${esc32(o.t)}</span><div class="d">${esc32(o.d)}</div></span>
      </button>`).join("")}</div></fieldset>
    <div class="navrow">
      <button class="back" id="ref-back" type="button">← Voltar</button>
      <button class="back" id="ref-skip" type="button">Pular</button>
      <button class="nextlink" id="ref-result" type="button">${refReturn==="results"?"Voltar ao resultado →":"Continuar para a etapa final →"}</button>
    </div></section>`;
  $("#app").querySelectorAll(".opt").forEach(b=>{
    b.onclick = ()=>{ setRefinementAnswer(rq.id, +b.dataset.ref);
      if (i<2){ refStage=i+1; render(); } else refFinish(); };
  });
  $("#ref-back").onclick = ()=>{ if(i>0){ refStage=i-1; render(); }
    else if(refReturn==="results"){ refReturn=null; refFinish(); }
    else { refStage="unseen"; step=QS.length; render(); } };
  $("#ref-skip").onclick = ()=>{ if(i<2){ refStage=i+1; render(); } else refFinish(); };
  $("#ref-result").onclick = refFinish;
  const f=$("#app").querySelector(".opt"); if(f) f.focus();
}
/* teclas numéricas NUNCA vazam para o togglePriority legado durante branch/refinement */
document.addEventListener("keydown", function(e){
  const scr=document.body.dataset.uxscreen;
  const refActive = (typeof refStage==="number") || scr==="refbranch" || scr==="refinement";
  if (!refActive) return;   /* nunca intercepta a priority real */
  if (/^[0-9]$/.test(e.key)){ e.stopImmediatePropagation();
    if (typeof refStage==="number"){ const n=+e.key;
      if(n>=1&&n<=4){ const b=$("#app").querySelector(`.opt[data-ref="${n-1}"]`); if(b) b.click(); } } }
}, true);
/* ---------- [J/M] resumo no resultado ---------- */
function refSummaryBlock(app){
  const old=document.getElementById("ux-refsum"); if(old) old.remove();
  const row=document.getElementById("ux-execrow"); if(!row) return;
  const n=refAnsweredCount();
  const div=document.createElement("div"); div.id="ux-refsum"; div.className="ux-prios ux-refsum";
  if(!n){
    div.innerHTML=`<div class="eyebrow">Aprofundamento operacional</div>
      <div class="ux-micro">Refinamento qualitativo opcional — não altera sua pontuação de maturidade.</div>
      <button class="btn2" id="ux-ref-open" type="button">Refinar diagnóstico · 3 perguntas</button>`;
  } else {
    const items=OPERATIONAL_REFINEMENT_QUESTIONS
      .filter(rq=>OPERATIONAL_REFINEMENT.answers[rq.id]!==null)
      .map(rq=>`<div class="ux-refitem" data-dom="${rq.domain}"><b>${esc32(rq.title)}</b><br>
        <span class="ux-mut">${esc32(rq.opts[OPERATIONAL_REFINEMENT.answers[rq.id]].t)}</span></div>`).join("");
    div.innerHTML=`<div class="eyebrow">Aprofundamento operacional</div>
      <div class="ux-micro">${n} de 3 temas aprofundados · leitura qualitativa, sem efeito na pontuação.</div>
      ${items}<button class="btn2" id="ux-ref-open" type="button">Editar aprofundamento</button>`;
  }
  row.insertAdjacentElement("afterend", div);
  div.querySelector("#ux-ref-open").onclick=()=>{ refReturn="results"; refStage=0; render(); };
}
/* ---------- [O] PDF: bloco pequeno, só quando informado ---------- */
window.__uxRefinementPrintHTML = function(){
  const n=refAnsweredCount(); if(!n) return "";
  const cards=OPERATIONAL_REFINEMENT_QUESTIONS
    .filter(rq=>OPERATIONAL_REFINEMENT.answers[rq.id]!==null)
    .map(rq=>{ const a=OPERATIONAL_REFINEMENT.answers[rq.id];
      return `<div class="pr-card"><b>${esc32(rq.title)}</b><div>${esc32(rq.opts[a].t)}</div>
        <div class="pr-mut">${esc32(rq.opts[a].d)}</div></div>`;}).join("");
  return `<div class="pr-sec" id="pr-refinement"><h2>Aprofundamento operacional</h2>
    <div class="pr-mut">${n} de 3 temas aprofundados — leitura qualitativa; não altera a pontuação de maturidade.</div>${cards}</div>`;
};
if (window.__DEV) Object.assign(window.__DEV, {
  REF: OPERATIONAL_REFINEMENT, REF_QS: OPERATIONAL_REFINEMENT_QUESTIONS,
  setRefinementAnswer, clearOperationalRefinement, getOperationalRefinementSnapshot,
  refStage: ()=>refStage
});
