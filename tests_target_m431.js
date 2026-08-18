/* TESTES · PHASE 4.3.1 — Current vs Target Maturity Scenario (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
function base(w,d,o){answerAll(w,1,o||{logs:0});w.__DEV.setPriorities(["logs"]);w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();}
function setTgt(w,d,pairs){q(d,"#ux-tgt-open")?q(d,"#ux-tgt-open").click():q(d,"#ux-tgt-edit").click();
  Object.entries(pairs).forEach(([qid,v])=>{const s=q(d,`select[data-qid="${qid}"]`);if(s)s.value=String(v);});
  q(d,"#ux-tgt-save").click();}

T("T1","nenhum target criado automaticamente ao abrir results",()=>{
  const {w,d}=boot();base(w,d);
  return Object.keys(w.__DEV.TARGET.overrides).length===0 &&
    txt(q(d,"#ux-target")).includes("Nenhum cenário-alvo foi definido") &&
    !q(d,"#ux-tgt-cmp") && !d.querySelector(".ux-target-shape");
});
T("T2","TARGET_PROFILE armazena somente overrides explícitos (esparso)",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:2,mandate:3});
  const ov=w.__DEV.TARGET.overrides;
  return Object.keys(ov).sort().join(",")==="logs,mandate" && ov.logs===2 && ov.mandate===3;
});
T("T3","target confirmado nunca inferior ao atual (select filtrado + guard)",()=>{
  const {w,d}=boot();base(w,d,{logs:0,mandate:2});
  q(d,"#ux-tgt-open").click();
  const s=q(d,'select[data-qid="mandate"]');
  const vals=Array.from(s.options).map(o=>o.value).filter(Boolean).map(Number);
  const guard=w.__DEV.setTarget("mandate",1)===false && !("mandate" in w.__DEV.TARGET.overrides);
  return vals.length && Math.min(...vals)===3 && guard && w.__DEV.setTarget("mandate","NA")===false;
});
T("T4","ausência de override mantém a resposta atual (targetAnswer)",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  return w.__DEV.targetAnswer("mandate")===1 && w.__DEV.targetAnswer("logs")===3;
});
T("T5","effective==current → perfil idêntico ao atual (gate crítico do calculador puro)",()=>{
  const {w,d}=boot();answerAll(w,1,{logs:0,knowledge:"NA",training:null});w.__DEV.showResults();
  const cur=w.__DEV.tgtCurrentProfile();
  const eff=w.__DEV.tgtEffectiveVector();
  const t=w.__DEV.computeTargetProfile(eff);
  return JSON.stringify(t)===JSON.stringify(cur);
});
T("T6","editar target nunca altera ans",()=>{
  const {w,d}=boot();base(w,d);
  const pre=w.__DEV.legacySnapshot();
  setTgt(w,d,{logs:3,mandate:2});
  return w.__DEV.legacySnapshot()===pre;
});
T("T7","editar target nunca altera findings/priorities (snapshot integral)",()=>{
  const {w,d}=boot();base(w,d);
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON();
  setTgt(w,d,{logs:3});
  return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()===pre;
});
T("T8","Recommendation Context byte-idêntico após target",()=>{
  const {w,d}=boot();base(w,d);
  const pre=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  setTgt(w,d,{logs:3,mandate:3});
  return JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre &&
    JSON.stringify(w.__DEV.ctx())===pre;
});
T("T9","mesma regra de suficiência (>=10 confirmadas && n>=2 por domínio)",()=>{
  const {w}=boot();
  const mk=n=>IDS.map((_,i)=>i<n?1:null);
  const nine=w.__DEV.computeTargetProfile(mk(9));
  const eleven=w.__DEV.computeTargetProfile(mk(11));  /* 11 primeiras: domínio Serviços fica n<2 */
  const full=w.__DEV.computeTargetProfile(mk(15));
  return nine.suff===false && eleven.suff===false && full.suff===true && full.overall!==null;
});
T("T10","target insuficiente → n/d, sem estágio fabricado",()=>{
  const {w,d}=boot();
  ["mandate","logs","endpoint","automation","training"].forEach(id=>w.__DEV.setAnswerById(id,1));
  w.__DEV.setArq(0);w.__DEV.showResults();
  setTgt(w,d,{mandate:3});
  const t=txt(q(d,"#ux-tgt-cmp"));
  return t.includes("n/d") && !/Definido|Gerenciado|otimização/.test(txt(q(d,".ux-tgt-kpi-t")));
});
T("T11","current NA permite target explícito com 'Baseline atual não validado' e delta local n/d",()=>{
  const {w,d}=boot();base(w,d,{logs:0,knowledge:"NA"});
  q(d,"#ux-tgt-open").click();
  const note=Array.from(d.querySelectorAll(".ux-tgt-row")).find(r=>r.querySelector('select[data-qid="knowledge"]'));
  const hasNote=txt(note).includes("Baseline atual não validado");
  const s=q(d,'select[data-qid="knowledge"]');
  const zeroOk=Array.from(s.options).some(o=>o.value==="0");
  s.value="2"; q(d,"#ux-tgt-save").click();
  const ov=txt(Array.from(d.querySelectorAll(".ux-tgt-ov")).find(x=>x.dataset.qid==="knowledge"));
  return hasNote && zeroOk && ov.includes("Baseline atual não validado — delta local n/d") && !/\+\d/.test(ov.split("Baseline")[1].slice(0,40));
});
T("T12","radar current mantém exatamente os pontos atuais após overlay",()=>{
  const {w,d}=boot();base(w,d);
  const p1=d.querySelector("svg.radar .shape").getAttribute("points");
  setTgt(w,d,{logs:3});
  return d.querySelector("svg.radar .shape").getAttribute("points")===p1 &&
    d.querySelector(".ux-target-shape");
});
T("T13","target radar deriva somente dos effective answers (determinístico)",()=>{
  const {w,d}=boot();base(w,d);
  setTgt(w,d,{logs:2}); const a=d.querySelector(".ux-target-shape").getAttribute("points");
  setTgt(w,d,{logs:3}); const b=d.querySelector(".ux-target-shape").getAttribute("points");
  setTgt(w,d,{logs:2}); const c=d.querySelector(".ux-target-shape").getAttribute("points");
  return a!==b && a===c;
});
T("T14","current Blue sólido · target Green tracejado + legenda textual + aria",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  const t=d.querySelector(".ux-target-shape");
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  return t.getAttribute("stroke")==="#3CB17E" && t.getAttribute("stroke-dasharray") &&
    /body\[data-uxscreen="results"\] \.radar \.shape\{ stroke:var\(--ftnt-blue\)/.test(css) &&
    txt(q(d,"#ux-tgt-radarlegend")).includes("Perfil atual") &&
    d.querySelector("svg.radar").getAttribute("aria-label").includes("tracejada verde");
});
T("T15","cada override aparece exatamente uma vez no resumo",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3,mandate:2,governance:3});
  const qids=Array.from(d.querySelectorAll(".ux-tgt-ov")).map(x=>x.dataset.qid).sort();
  return qids.join(",")==="governance,logs,mandate" && new Set(qids).size===3;
});
T("T16","habilitadores ⊆ itens já presentes no Recommendation Context",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  const en=txt(Array.from(d.querySelectorAll(".ux-tgt-ov")).find(x=>x.dataset.qid==="logs"));
  const ctx=w.__DEV.V32.buildRecommendationContext().contexts["security-analytics"];
  const names=ctx.candidates.map(c=>(w.__DEV.V32.OFFERINGS[c.itemId]||{}).name);
  return names.every(n=>en.includes(n)) && en.includes("Possíveis habilitadores já identificados");
});
T("T17","target nunca cria candidate/service (contagem do ctx estável)",()=>{
  const {w,d}=boot();base(w,d);
  const count=JSON.stringify(w.__DEV.ctx()).length;
  setTgt(w,d,{mandate:3,governance:3,logs:3});
  return JSON.stringify(w.__DEV.V32.buildRecommendationContext()).length===count;
});
T("T18","target nunca muda DIRECT/CONTEXTUAL/VALIDATE",()=>{
  const {w,d}=boot();base(w,d);
  const m1=Object.entries(w.__DEV.ctx().contexts).map(([k,c])=>k+":"+c.supportMode).join("|");
  setTgt(w,d,{logs:3,mandate:3});
  const m2=Object.entries(w.__DEV.V32.buildRecommendationContext().contexts).map(([k,c])=>k+":"+c.supportMode).join("|");
  return m1===m2;
});
T("T19","limpar target não altera assessment/context/recommendations",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  q(d,"#ux-tgt-clear").click(); q(d,"#ux-modal-ok").click();
  return Object.keys(w.__DEV.TARGET.overrides).length===0 &&
    txt(q(d,"#ux-target")).includes("Nenhum cenário-alvo") &&
    w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre;
});
T("T20","Reiniciar avaliação limpa target e preserva Technology Landscape",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  q(d,"#restart").click(); q(d,"#ux-modal-ok").click();
  return Object.keys(w.__DEV.TARGET.overrides).length===0 &&
    w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].presence==="NONE";
});
T("T21","Nova sessão limpa target",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  q(d,"#ux-newsession").click(); q(d,"#ux-modal-ok").click();
  return Object.keys(w.__DEV.TARGET.overrides).length===0 && w.__DEV.V32.isLegacyModeV32()===true;
});
T("T22","current revisado ≥ target invalida só o override conflitante, com aviso",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{mandate:2,logs:3});
  w.__DEV.setAnswerById("mandate",2);          /* revisão: atual alcança o alvo */
  w.__DEV.showResults();
  const ov=w.__DEV.TARGET.overrides;
  return !("mandate" in ov) && ov.logs===3 &&
    txt(q(d,"#ux-target")).includes("O alvo desta prática foi redefinido");
});
T("T23","PDF inclui comparação somente com target explícito",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  w.__DEV.preparePrint();
  const sec=q(d,"#pr-target");
  const ok=sec && txt(sec).includes("Cenário-alvo") && sec.querySelector("svg.pr-radar polygon[stroke-dasharray]") &&
    txt(sec).includes("práticas-alvo alteradas");
  w.__DEV.finishPrint();
  return ok;
});
T("T24","PDF sem target permanece sem seção target",()=>{
  const {w,d}=boot();base(w,d);
  w.__DEV.preparePrint();
  const none=!q(d,"#pr-target");
  w.__DEV.finishPrint();
  return none;
});
T("T25","disclaimer metodológico aparece no screen e no PDF",()=>{
  const {w,d}=boot();base(w,d);setTgt(w,d,{logs:3});
  const scr=txt(q(d,"#ux-tgt-cmp")).includes("A adoção de tecnologia, isoladamente, não altera a maturidade");
  w.__DEV.preparePrint();
  const pdf=txt(q(d,"#pr-target")).includes("A adoção de tecnologia, isoladamente, não altera a maturidade");
  w.__DEV.finishPrint();
  return scr && pdf;
});
T("T26","details/select/focus no editor sem salvar não alteram estado fora do TARGET_PROFILE",()=>{
  const {w,d}=boot();base(w,d);
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.TARGET.overrides);
  q(d,"#ux-tgt-open").click();
  const det=d.querySelector("details.ux-tgt-grp"); if(det){det.open=true;det.open=false;}
  const s=q(d,'select[data-qid="mandate"]'); s.value="3"; s.focus();
  q(d,"#ux-tgt-cancel").click();
  return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.TARGET.overrides)===pre;
});

/* ===== [4.3.1.1] SESSION STATE CLOSURE ===== */
function makeNotice(w,d){ base(w,d); setTgt(w,d,{mandate:2,logs:3});
  w.__DEV.setAnswerById("mandate",2); w.__DEV.showResults();
  return txt(q(d,"#ux-target")).includes("redefinido"); }
T("T27","notice + Reiniciar avaliação → nova avaliação SEM .ux-tgt-notice",()=>{
  const {w,d}=boot(); const had=makeNotice(w,d);
  q(d,"#restart").click(); q(d,"#ux-modal-ok").click();
  answerAll(w,1,{logs:0}); w.__DEV.showResults();
  return had && Object.keys(w.__DEV.TARGET.overrides).length===0 &&
    !d.querySelector(".ux-tgt-notice") && txt(q(d,"#ux-target")).includes("Nenhum cenário-alvo");
});
T("T28","notice + Nova sessão → nova avaliação SEM mensagem da sessão anterior",()=>{
  const {w,d}=boot(); const had=makeNotice(w,d);
  q(d,"#ux-newsession").click(); q(d,"#ux-modal-ok").click();
  answerAll(w,2); w.__DEV.showResults();
  return had && !d.querySelector(".ux-tgt-notice") && !txt(q(d,"#ux-target")).includes("redefinido");
});
T("T29","Limpar cenário-alvo elimina override+notice sem tocar assessment/context/recommendations",()=>{
  const {w,d}=boot(); makeNotice(w,d);
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  q(d,"#ux-tgt-clear").click(); q(d,"#ux-modal-ok").click();
  return Object.keys(w.__DEV.TARGET.overrides).length===0 && !d.querySelector(".ux-tgt-notice") &&
    w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()+JSON.stringify(w.__DEV.V32.buildRecommendationContext())===pre;
});
T("T30","revisão na MESMA avaliação mantém notice até ação explícita (4.3.1 preservada)",()=>{
  const {w,d}=boot(); const had=makeNotice(w,d);
  w.__DEV.gotoStep(3); w.__DEV.showResults();                    /* navegação/revisão sem ação no target */
  const still=txt(q(d,"#ux-target")).includes("redefinido");
  q(d,"#ux-tgt-edit").click();                                   /* ação explícita limpa */
  q(d,"#ux-tgt-cancel").click();
  return had && still && !d.querySelector(".ux-tgt-notice");
});

const fail=results.filter(r=>!r.ok);
console.log("\nTARGET 4.3.1: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
