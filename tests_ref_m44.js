/* TESTES · PHASE 4.4 — Time Expectations & Operational Refinement (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
function key(w,d,k){d.dispatchEvent(new w.KeyboardEvent("keydown",{key:k,bubbles:true}));}
function toBranch(w,d){answerAll(w,1,{logs:0});w.__DEV.gotoStep(IDS.length);d.querySelectorAll(".opt")[1].click();const nx=d.querySelector("#next");if(nx)nx.click();} /* última pergunta + resposta → branch */
function fullSnap(w){return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+
  JSON.stringify(w.__DEV.TARGET.overrides)+JSON.stringify(w.__DEV.V32.buildRecommendationContext());}

T("R1","QS.length continua exatamente 15",()=>{const {w}=boot();return w.eval("QS.length")===15;});
T("R2","registry de refinement contém exatamente 3 perguntas (ids/domínios corretos)",()=>{
  const {w}=boot();const R=w.__DEV.REF_QS;
  return R.length===3 && R.map(x=>x.id).join(",")==="ref-metrics,ref-lessons,ref-hunting" &&
    R[0].domain===2 && R[1].domain===2 && R[2].domain===3 && R.every(x=>x.opts.length===4);
});
T("R3","abrir refinement não cria respostas automaticamente",()=>{
  const {w,d}=boot();toBranch(w,d);q(d,"#ref-go").click();
  return Object.values(w.__DEV.REF.answers).every(v=>v===null) && d.body.dataset.uxscreen==="refinement";
});
T("R4","answers aceitam somente 0..3|null",()=>{
  const {w}=boot();
  return w.__DEV.setRefinementAnswer("ref-metrics",2)===true &&
    w.__DEV.setRefinementAnswer("ref-metrics",4)===false &&
    w.__DEV.setRefinementAnswer("ref-metrics","NA")===false &&
    w.__DEV.setRefinementAnswer("ref-metrics",null)===true &&
    w.__DEV.setRefinementAnswer("inexistente",1)===false &&
    w.__DEV.REF.answers["ref-metrics"]===null;
});
T("R5","refinement nunca escreve em ans",()=>{
  const {w,d}=boot();answerAll(w,1);const pre=w.__DEV.legacySnapshot();
  ["ref-metrics","ref-lessons","ref-hunting"].forEach(id=>w.__DEV.setRefinementAnswer(id,3));
  return w.__DEV.legacySnapshot()===pre;
});
T("R6-R12","gate absoluto: maturity/domains/suff/stage/findings/ctx/TARGET/Current×Target byte-idênticos",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.setTarget("logs",3);w.__DEV.showResults();
  const cur=JSON.stringify(w.__DEV.tgtCurrentProfile())+JSON.stringify(w.__DEV.computeTargetProfile(w.__DEV.tgtEffectiveVector()));
  const pre=fullSnap(w)+cur;
  ["ref-metrics","ref-lessons","ref-hunting"].forEach((id,i)=>w.__DEV.setRefinementAnswer(id,i+1));
  w.__DEV.showResults();
  const cur2=JSON.stringify(w.__DEV.tgtCurrentProfile())+JSON.stringify(w.__DEV.computeTargetProfile(w.__DEV.tgtEffectiveVector()));
  return fullSnap(w)+cur2===pre;
});
T("R13","null não é interpretado como opção 0 (resumo e PDF distinguem)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.setRefinementAnswer("ref-metrics",0);w.__DEV.showResults();
  const sum=txt(q(d,"#ux-refsum"));
  return sum.includes("1 de 3 temas aprofundados") && sum.includes("Não medimos de forma estruturada") &&
    !sum.includes("Aprendizado pós-incidente");
});
T("R14","progress principal mantém o contrato atual (16/16 core; refinement fora dele)",()=>{
  const {w,d}=boot();toBranch(w,d);
  const segs=d.querySelectorAll("#segs span").length;   /* 16 core + 1 prioridade */
  q(d,"#ref-go").click();
  return segs===17 && !txt(q(d,"#app")).includes("16 de") && txt(q(d,"#app")).includes("1 de 3");
});
T("R15","refinement progress próprio 1/3 → 2/3 → 3/3",()=>{
  const {w,d}=boot();toBranch(w,d);q(d,"#ref-go").click();
  const p1=txt(q(d,".ux-ref-prog"));
  q(d,'.opt[data-ref="1"]').click();
  const p2=txt(q(d,".ux-ref-prog"));
  q(d,"#ref-skip").click();
  const p3=txt(q(d,".ux-ref-prog"));
  return p1.includes("1 de 3") && p2.includes("2 de 3") && p3.includes("3 de 3");
});
T("R16","Continuar sem aprofundamento leva ao fluxo normal (priority)",()=>{
  const {w,d}=boot();toBranch(w,d);
  const branch=txt(q(d,"#app")).includes("Seu perfil-base está pronto");
  q(d,"#ref-skip-all").click();
  return branch && d.body.dataset.uxscreen==="priority" && d.querySelector(".ux-priogroup");
});
T("R17","refinement parcial é permitido (Pular mantém null; avanço livre)",()=>{
  const {w,d}=boot();toBranch(w,d);q(d,"#ref-go").click();
  q(d,'.opt[data-ref="2"]').click();          /* R1 respondida */
  q(d,"#ref-skip").click();                    /* R2 pulada */
  q(d,"#ref-result").click();                  /* sai na R3 */
  const a=w.__DEV.REF.answers;
  return a["ref-metrics"]===2 && a["ref-lessons"]===null && a["ref-hunting"]===null &&
    d.body.dataset.uxscreen==="priority";
});
T("R18","resumo do resultado mostra somente respostas informadas + contagem",()=>{
  const {w,d}=boot();answerAll(w,2);
  w.__DEV.setRefinementAnswer("ref-metrics",2);w.__DEV.setRefinementAnswer("ref-hunting",1);
  w.__DEV.showResults();
  const sum=txt(q(d,"#ux-refsum"));
  return sum.includes("2 de 3 temas aprofundados") && sum.includes("Métricas orientam melhorias") &&
    sum.includes("Investigações proativas acontecem pontualmente") && !sum.includes("Aprendizado pós-incidente");
});
T("R19","Editar aprofundamento preserva respostas e retorna ao resultado",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.setRefinementAnswer("ref-metrics",2);w.__DEV.showResults();
  q(d,"#ux-ref-open").click();
  const kept=q(d,'.opt[data-ref="2"]').classList.contains("sel");
  q(d,"#ref-result").click();
  return kept && d.body.dataset.uxscreen==="results" && w.__DEV.REF.answers["ref-metrics"]===2 &&
    txt(q(d,"#ux-refsum")).includes("Editar aprofundamento");
});
T("R20","Reiniciar avaliação limpa refinement e preserva Landscape",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.setRefinementAnswer("ref-metrics",3);w.__DEV.showResults();
  q(d,"#restart").click();q(d,"#ux-modal-ok").click();
  return w.__DEV.REF.answers["ref-metrics"]===null && w.__DEV.refStage()==="unseen" &&
    w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].presence==="NONE";
});
T("R21","Nova sessão limpa refinement",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.setRefinementAnswer("ref-lessons",1);w.__DEV.showResults();
  q(d,"#ux-newsession").click();q(d,"#ux-modal-ok").click();
  return Object.values(w.__DEV.REF.answers).every(v=>v===null);
});
T("R22","Limpar cenário-alvo NÃO limpa refinement",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  w.__DEV.setRefinementAnswer("ref-metrics",2);
  w.__DEV.setTarget("logs",3);w.__DEV.showResults();
  q(d,"#ux-tgt-clear").click();q(d,"#ux-modal-ok").click();
  return w.__DEV.REF.answers["ref-metrics"]===2 && Object.keys(w.__DEV.TARGET.overrides).length===0;
});
T("R23","Limpar contexto tecnológico NÃO limpa refinement",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0});w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.setRefinementAnswer("ref-hunting",3);w.__DEV.showResults();
  q(d,"#v32clear").click();
  return w.__DEV.REF.answers["ref-hunting"]===3 && w.__DEV.V32.isLegacyModeV32()===true;
});
T("R24","PDF inclui refinement somente quando informado (tema+resposta+interpretação)",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.setRefinementAnswer("ref-metrics",2);w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const pz=q(d,"#v32-pres-security-analytics");pz.value="NONE";pz.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  w.__DEV.preparePrint();
  const sec=q(d,"#pr-refinement");
  const ok=sec && txt(sec).includes("1 de 3 temas aprofundados") &&
    txt(sec).includes("Métricas orientam melhorias") && txt(sec).includes("revisados periodicamente") &&
    !txt(sec).includes("Threat hunting");
  w.__DEV.finishPrint();
  return ok;
});
T("R25","PDF sem refinement permanece sem seção vazia",()=>{
  const {w,d}=boot();answerAll(w,2);w.__DEV.showResults();
  w.__DEV.preparePrint();const none=!q(d,"#pr-refinement");w.__DEV.finishPrint();
  return none;
});
T("R26","home: '~8–12 min · 15 perguntas' + supporting + microcopy do refinement",()=>{
  const {w,d}=boot();const t=txt(q(d,".ux-time-core"));
  return t.includes("Tempo estimado: ~8–12 min · 15 perguntas") &&
    t.includes("Negócio, Pessoas, Processos, Tecnologia e Serviços") &&
    t.includes("refinar o diagnóstico com 3 perguntas adicionais");
});
T("R27+R28","contexto: '~5–10 min · preencha apenas o que souber' + UNSET≠NONE explícito",()=>{
  const {w,d}=boot();const t=txt(q(d,"#ux-home"));
  return t.includes("Tempo estimado: ~5–10 min · preencha apenas o que souber") &&
    t.includes("tecnologias, arquitetura, restrições e requisitos") &&
    t.includes("não altera a pontuação de maturidade") &&
    t.includes("Você não precisa preencher tudo. Campos não informados permanecem como contexto não declarado.");
});
T("R29","branch mostra '+3 perguntas · ~2–4 min' sem linguagem coercitiva",()=>{
  const {w,d}=boot();toBranch(w,d);const t=txt(q(d,"#app"));
  return t.includes("Refinar diagnóstico · +3 perguntas · ~2–4 min") &&
    t.includes("Continuar sem aprofundamento") &&
    !/Completar avaliação|Finalizar perguntas restantes|Melhorar score/i.test(t);
});
T("R30","nenhuma string chama refinement de score ou o incorpora à maturidade",()=>{
  const {w,d}=boot();answerAll(w,2);
  w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const pz=q(d,"#v32-pres-security-analytics");pz.value="NONE";pz.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  ["ref-metrics","ref-lessons","ref-hunting"].forEach(id=>w.__DEV.setRefinementAnswer(id,2));
  w.__DEV.showResults();w.__DEV.preparePrint();
  const scr=txt(q(d,"#ux-refsum")), pdf=txt(q(d,"#pr-refinement"));
  w.__DEV.finishPrint();
  return !/refinementScore|maturidade do refinement|score do aprofundamento/i.test(scr+pdf) &&
    scr.includes("sem efeito na pontuação") && pdf.includes("não altera a pontuação de maturidade");
});

/* ===== [4.4.0.1] FLOW & COPY SEMANTICS ===== */
T("R31","home: 15 core + 1 ponto de partida, sem ambiguidade 15 vs 16",()=>{
  const {w,d}=boot(); const home=txt(q(d,"#app"));
  return home.includes("15 perguntas de maturidade em conversa guiada, além de um ponto de partida inicial") &&
    home.includes("15 + 1") && home.includes("perguntas + ponto de partida") &&
    !home.includes("16 perguntas") && !/~10 minutos/i.test(home) &&
    home.includes("Tempo estimado: ~8–12 min · 15 perguntas");
});
T("R32","branch: sem PRIORIDADE DO NEGÓCIO; Priority não marcada ativa; label próprio",()=>{
  const {w,d}=boot(); toBranch(w,d);
  const pt=txt(q(d,"#ptext"));
  const pz=d.querySelector("#segs .ux-seg-prio");
  return pt==="Core concluído · aprofundamento opcional" && !/PRIORIDADE DO NEGÓCIO/i.test(pt) &&
    pz && !pz.classList.contains("cur") && !pz.classList.contains("done") &&
    txt(q(d,"#ux-progress-mobile"))==="Core concluído · aprofundamento opcional";
});
T("R33","refinement 1/3..3/3: apenas progress próprio (principal oculto por CSS; sem Etapa final)",()=>{
  const {w,d}=boot(); toBranch(w,d); q(d,"#ref-go").click();
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  const hid=/body\[data-uxscreen="refinement"\] \.progressbox\{ display:none !important; \}/.test(css) &&
            /body\[data-uxscreen="refinement"\] #ux-progress-mobile\{ display:none !important; \}/.test(css);
  const own1=txt(q(d,".ux-ref-prog")).includes("1 de 3");
  q(d,"#ref-skip").click(); const own2=txt(q(d,".ux-ref-prog")).includes("2 de 3");
  q(d,"#ref-skip").click(); const own3=txt(q(d,".ux-ref-prog")).includes("3 de 3");
  return hid && own1 && own2 && own3 && !txt(q(d,"#app")).includes("PRIORIDADE DO NEGÓCIO");
});
T("R34","CTA de saída: 'Continuar para a etapa final →' no fluxo; 'Voltar ao resultado →' na edição",()=>{
  const {w,d}=boot(); toBranch(w,d); q(d,"#ref-go").click();
  const flow=txt(q(d,"#ref-result"));
  q(d,"#ref-result").click();                       /* → priority */
  w.__DEV.showResults();
  q(d,"#ux-ref-open").click();                      /* edição a partir do resultado */
  const edit=txt(q(d,"#ref-result"));
  return flow==="Continuar para a etapa final →" && !/resultado/i.test(flow) &&
    edit==="Voltar ao resultado →";
});
T("R35","rota preservada: saída do refinement → Priority → só depois Results",()=>{
  const {w,d}=boot(); toBranch(w,d); q(d,"#ref-go").click();
  q(d,'.opt[data-ref="1"]').click(); q(d,"#ref-result").click();
  const pr=d.body.dataset.uxscreen==="priority" && !!d.querySelector(".ux-priogroup");
  const pz=d.querySelector("#segs .ux-seg-prio");
  const active=pz && pz.classList.contains("cur");
  d.querySelector('.opt[data-id="logs"]')?.click();
  w.__DEV.showResults();
  return pr && active && d.body.dataset.uxscreen==="results";
});

const fail=results.filter(r=>!r.ok);
console.log("\nREF 4.4: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
