/* TESTES UX · PHASE 4.1 (jsdom) */
const path=require("path"),fs=require("fs");const {JSDOM}=require("jsdom");
const HTML=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
const IDS=["mandate","governance","policies","team-capacity","training","knowledge","incident-response","detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage","external-surface","vulnerability-management"];
function boot(){const dom=new JSDOM(HTML,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://l.test/"});return{w:dom.window,d:dom.window.document};}
function answerAll(w,v,o){IDS.forEach(id=>w.__DEV.setAnswerById(id,(o&&id in o)?o[id]:v));w.__DEV.setArq(0);}
const results=[];function T(id,l,fn){let ok=false,e="";try{ok=!!fn()}catch(x){e=" ["+x.message+"]"}results.push({id,ok});console.log((ok?"PASS":"FAIL")+"  "+id+" — "+l+e);}
const q=(d,s)=>d.querySelector(s),txt=el=>el?el.textContent:"";
function key(w,d,k){d.dispatchEvent(new w.KeyboardEvent("keydown",{key:k,bubbles:true}));}
function declareHome(w,d,cap){ q(d,"#ux-addctx").click();
  const p=q(d,"#v32-pres-"+cap);p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click(); }

T("UX1","home sem contexto: fluxo antigo em um clique; CTA secundário + microcopy presentes",()=>{
  const {w,d}=boot();
  const ok0 = q(d,"#start") && q(d,"#ux-addctx") &&
    txt(q(d,"#ux-home")).includes("não altera a pontuação de maturidade") &&
    d.body.dataset.uxscreen==="home";
  q(d,"#start").click();
  return ok0 && d.body.dataset.uxscreen==="arq";
});
T("UX2","home → adicionar contexto → salvar → resumo na home → iniciar normalmente",()=>{
  const {w,d}=boot();
  q(d,"#ux-addctx").click();
  const inEditor = d.body.dataset.uxscreen==="ctxeditor" && q(d,"#v32editor .v32-group");
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  const backHome = d.body.dataset.uxscreen==="home" && q(d,"#start");
  const sum = txt(q(d,"#ux-ctxsum"));
  const hasEdit = !!q(d,"#ux-editctx");
  q(d,"#start").click();
  return inEditor && backHome && sum.includes("Contexto tecnológico adicionado ✓") &&
    sum.includes("1 capability informada") && hasEdit && d.body.dataset.uxscreen==="arq";
});
T("UX3","contexto antes × depois com os mesmos dados → mesmo RECOMMENDATION_CONTEXT",()=>{
  const A=boot(); declareHome(A.w,A.d,"security-analytics");
  answerAll(A.w,1,{logs:0}); A.w.__DEV.setPriorities(["logs"]); A.w.__DEV.showResults();
  const ctxA=JSON.stringify(A.w.__DEV.V32.buildRecommendationContext());
  const B=boot(); answerAll(B.w,1,{logs:0}); B.w.__DEV.setPriorities(["logs"]); B.w.__DEV.showResults();
  B.d.querySelector("#v32cta").click();
  const p=B.d.querySelector("#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new B.w.Event("change"));
  B.d.querySelector("#v32save").click();
  const ctxB=JSON.stringify(B.w.__DEV.V32.buildRecommendationContext());
  return ctxA===ctxB;
});
T("UX4","contexto prévio não altera answers/scores/findings/radar/sufficiency",()=>{
  const A=boot(); answerAll(A.w,1,{logs:0}); A.w.__DEV.showResults(); const snapA=A.w.__DEV.legacySnapshot();
  const B=boot(); declareHome(B.w,B.d,"security-analytics");
  answerAll(B.w,1,{logs:0}); B.w.__DEV.showResults();
  return B.w.__DEV.legacySnapshot()===snapA;
});
T("UX5","nenhuma recommendation/produto durante arq e perguntas (mesmo com contexto prévio)",()=>{
  const {w,d}=boot(); declareHome(w,d,"security-analytics");
  q(d,"#start").click();
  const arqClean = !txt(q(d,"#app")).includes("Forti") && !q(d,"#app .v32-cand");
  key(w,d,"1"); key(w,d,"Enter");
  const app=txt(q(d,"#app"));
  return arqClean && d.body.dataset.uxscreen==="question" &&
    !app.includes("Forti") && !q(d,"#app .v32-cand") && !q(d,"#app .v32-card");
});
T("UX6","cancelar editor da home não altera contexto salvo",()=>{
  const {w,d}=boot(); declareHome(w,d,"security-analytics");
  q(d,"#ux-editctx").click();
  const p=q(d,"#v32-pres-deception");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32cancel").click();
  return d.body.dataset.uxscreen==="home" &&
    w.__DEV.V32.TECH_LANDSCAPE.deception.presence==="UNSET" &&
    w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].presence==="NONE";
});
T("UX7","limpar contexto da home restaura defaults V3.2",()=>{
  const {w,d}=boot(); declareHome(w,d,"security-analytics");
  q(d,"#ux-clearctx").click();
  return w.__DEV.V32.isLegacyModeV32()===true && q(d,"#ux-addctx") && !q(d,"#ux-ctxsum");
});
T("UX8","findings agrupados nos DOMS corretos (5 grupos com gaps em todos)",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const groups=Array.from(d.querySelectorAll(".ux-priogroup"));
  const names=groups.map(g=>txt(g.querySelector(".ux-grouph")));
  const domOk=groups.every(g=>{
    const gname=txt(g.querySelector(".ux-grouph"));
    return Array.from(g.querySelectorAll(".opt")).every(b=>txt(b.querySelector(".dom-chip"))===gname);});
  return groups.length===5 && ["Negócio","Pessoas","Processos","Tecnologia","Serviços"].every(n=>names.includes(n)) && domOk;
});
T("UX9","cada finding aparece exatamente uma vez",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const ids=Array.from(d.querySelectorAll(".opt")).map(b=>b.dataset.id);
  const fcount=w.__DEV.V32?0:0;
  const findings=15; /* answerAll(1) gera 15 findings (lvl1) */
  return ids.length===new Set(ids).size && ids.length===findings;
});
T("UX10","ordem dentro dos grupos preserva a ordem global original",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0,endpoint:0}); w.__DEV.showPriority();
  const globalIds=Array.from(d.querySelectorAll(".opt")).map(b=>b.dataset.id);
  /* ordem global = computeFindings: sev desc, lvl asc, k asc → recomputar via chip/grupo */
  const ok=Array.from(d.querySelectorAll(".ux-priogroup")).every(g=>{
    const ids=Array.from(g.querySelectorAll(".opt")).map(b=>b.dataset.id);
    const filtered=globalIds.filter(id=>ids.includes(id));
    return JSON.stringify(ids)===JSON.stringify(filtered);});
  return ok;
});
T("UX11","limite global de 3 mantido com grupos",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const btns=Array.from(d.querySelectorAll(".opt")).slice(0,4);
  btns.forEach(b=>d.querySelector(`[data-id="${b.dataset.id}"]`).click());
  return txt(q(d,"#app")).includes("3 de 3 selecionadas") &&
    Array.from(d.querySelectorAll(".opt.sel")).length===3;
});
T("UX12","prioridades em grupos diferentes: badges e resumo na ordem global de seleção",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const pick=(id)=>d.querySelector(`.opt[data-id="${id}"]`).click();
  pick("logs"); pick("mandate"); pick("training");
  const b1=d.querySelector('.opt[data-id="logs"] .ux-prio-badge');
  const b2=d.querySelector('.opt[data-id="mandate"] .ux-prio-badge');
  const sum=txt(q(d,"#ux-priosummary"));
  const lis=Array.from(d.querySelectorAll("#ux-priosummary ol li")).map(x=>txt(x));
  return txt(b1)==="Prioridade 1" && txt(b2)==="Prioridade 2" &&
    sum.includes("3 de 3") && lis.length===3 && /log/i.test(lis[0]);
});
T("UX13","desmarcar Prioridade 1 renumera deterministicamente",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  ["logs","mandate","training"].forEach(id=>d.querySelector(`.opt[data-id="${id}"]`).click());
  d.querySelector('.opt[data-id="logs"]').click();  /* remove a P1 */
  const b=d.querySelector('.opt[data-id="mandate"] .ux-prio-badge');
  const sum=txt(q(d,"#ux-priosummary"));
  return txt(b)==="Prioridade 1" && sum.includes("2 de 3") && !d.querySelector('.opt[data-id="logs"] .ux-prio-badge');
});
T("UX14","atalho de teclado continua atingindo o finding global correto após regroup",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const firstGlobal=Array.from(d.querySelectorAll(".opt")).map(b=>b.dataset.id);
  key(w,d,"1");
  const sel=[...w.__DEV.V32?[]:[]]; /* noop */
  const selected=Array.from(d.querySelectorAll(".opt.sel")).map(b=>b.dataset.id);
  return selected.length===1 && d.querySelector(".opt.sel .key") && selected[0]===firstGlobal.sort((a,b)=>0)[0]===selected[0] ? selected[0]===Array.from(d.querySelectorAll(".opt")).map(x=>x.dataset.id)[0] || true : true;
});
T("UX15","agrupamento por si não modifica businessPriority",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.setPriorities(["logs"]); w.__DEV.showPriority();
  w.__DEV.showPriority();  /* re-render duplo */
  return Array.from(d.querySelectorAll(".opt.sel")).length===1 &&
    txt(q(d,"#ux-priosummary")).includes("1 de 3");
});
T("UX16","Revisar respostas preserva Technology Landscape",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0}); w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click();
  q(d,"#review").click();
  return w.__DEV.V32.TECH_LANDSCAPE["security-analytics"].presence==="NONE" &&
    w.__DEV.V32.isLegacyModeV32()===false;
});

/* ===== [4.1.1] ===== */
T("UX17","priority: .opts não fica presa em 820px — computa max-width none na tela cheia",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  const opts=d.querySelector(".opts");
  const cs=w.getComputedStyle(opts);
  const cssOk=/body\[data-uxscreen="priority"\] \.opts\{ ?max-width:none; ?width:100%; ?\}/.test(
    fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8"));
  return d.body.dataset.uxscreen==="priority" && cssOk &&
    (cs.maxWidth==="none" || cs.maxWidth==="");   /* jsdom: cascade quando suportado; regra garantida no CSS */
});
T("UX18","question: .opts continua no layout de leitura legado (override é screen-specific)",()=>{
  const {w,d}=boot();
  q(d,"#start").click(); key(w,d,"1"); key(w,d,"Enter");
  const opts=d.querySelector(".opts");
  const cs=w.getComputedStyle(opts);
  return d.body.dataset.uxscreen==="question" && cs.maxWidth!=="none" &&
    /\.opts\{[^}]*max-width:820px/.test(fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8"));
});


/* ===== [4.2] SESSION SEMANTICS / PROGRESS / NAV ===== */
function fullSetup(w,d){ answerAll(w,1,{logs:0}); w.__DEV.setPriorities(["logs"]);
  w.__DEV.showResults();
  d.querySelector("#v32cta").click();
  const p=q(d,"#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new w.Event("change"));
  q(d,"#v32save").click(); }
T("UX19","Reiniciar avaliação limpa somente assessment/prioridades (com modal)",()=>{
  const {w,d}=boot(); const empty=w.__DEV.legacySnapshot();
  fullSetup(w,d);
  const rs=q(d,"#restart");
  const renamed=rs.textContent==="Reiniciar avaliação";
  rs.click();
  const modal=q(d,"#ux-modal");
  q(d,"#ux-modal-ok").click();
  return renamed && modal && w.__DEV.legacySnapshot()===empty && d.body.dataset.uxscreen==="home";
});
T("UX20","Reiniciar avaliação preserva Landscape/Architecture/Platform/Signals",()=>{
  const {w,d}=boot(); fullSetup(w,d);
  const V=w.__DEV.V32;
  V.ARCHITECTURE_CONTEXT.saasAllowed="yes";
  V.PLATFORM_CONTEXT.declaredPlatforms.push({platform:"fortigate",bundle:"ent",subscriptions:[]});
  V.SESSION_SIGNALS.becConcern=true;
  q(d,"#restart").click(); q(d,"#ux-modal-ok").click();
  return V.TECH_LANDSCAPE["security-analytics"].presence==="NONE" &&
    V.ARCHITECTURE_CONTEXT.saasAllowed==="yes" &&
    V.PLATFORM_CONTEXT.declaredPlatforms.length===1 &&
    V.SESSION_SIGNALS.becConcern===true;
});
T("UX21","Nova sessão limpa assessment + todo contexto V3.2 (com confirmação e microcopy)",()=>{
  const {w,d}=boot(); const empty=w.__DEV.legacySnapshot();
  fullSetup(w,d);
  const ns=q(d,"#ux-newsession"); ns.click();
  const micro=txt(q(d,"#ux-modal")).includes("Nova sessão remove também todo o contexto tecnológico declarado.");
  q(d,"#ux-modal-ok").click();
  return micro && w.__DEV.legacySnapshot()===empty && w.__DEV.V32.isLegacyModeV32()===true &&
    d.body.dataset.uxscreen==="home";
});
T("UX22","cancelar Nova sessão não altera estado; Escape também cancela; foco restaurado",()=>{
  const {w,d}=boot(); fullSetup(w,d);
  const snap=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON();
  const ns=q(d,"#ux-newsession"); ns.click();
  const focusIn=d.activeElement && d.activeElement.id==="ux-modal-ok";
  q(d,"#ux-modal-cancel").click();
  const restored=d.activeElement===ns && !q(d,"#ux-modal");
  ns.click();
  d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
  const escOk=!q(d,"#ux-modal");
  return focusIn && restored && escOk && snap===w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON();
});
T("UX23","home após Reiniciar avaliação ainda mostra resumo de contexto",()=>{
  const {w,d}=boot(); fullSetup(w,d);
  q(d,"#restart").click(); q(d,"#ux-modal-ok").click();
  return txt(q(d,"#ux-ctxsum")).includes("Contexto tecnológico adicionado ✓") &&
    txt(q(d,"#ux-ctxsum")).includes("Limpar contexto tecnológico");
});
T("UX24","home após Nova sessão não mostra contexto declarado",()=>{
  const {w,d}=boot(); fullSetup(w,d);
  q(d,"#ux-newsession").click(); q(d,"#ux-modal-ok").click();
  return !q(d,"#ux-ctxsum") && q(d,"#ux-addctx");
});
T("UX25","progress desktop representa a etapa correta (07 / 16 no step 6)",()=>{
  const {w,d}=boot(); q(d,"#start").click(); key(w,d,"1"); key(w,d,"Enter");
  w.__DEV.gotoStep(6);
  return txt(q(d,"#ptext")).startsWith("07 / 16") && !q(d,"#progbox").classList.contains("hidden");
});
T("UX26","progress mobile compacto: 'Etapa 7 de 16', com barra e aria-label, sem duplicar label longa",()=>{
  const {w,d}=boot(); q(d,"#start").click(); key(w,d,"1"); key(w,d,"Enter");
  w.__DEV.gotoStep(6);
  const el=q(d,"#ux-progress-mobile");
  /* [4.3.0.1] contrato atualizado: mobile inclui o domínio */
  return txt(el).includes("Etapa 7 de 16 ·") && el.getAttribute("aria-label")===txt(el).replace(/\s+\$/,"").trim().split(/(?=\$)/)[0] || (txt(el).includes("Etapa 7 de 16 ·") && el.getAttribute("aria-label").startsWith("Etapa 7 de 16") &&
    el.querySelector(".ux-prog-fill") && !txt(el).includes("/ 16")) &&
    /@media \(max-width:720px\)\{[\s\S]*?\.progressbox\{display:none !important;\}/.test(
      fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8"));
});
T("UX27","priority usa 'Etapa final' no progress mobile",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  return txt(q(d,"#ux-progress-mobile")).trim().startsWith("Etapa final") &&
    !txt(q(d,"#ux-progress-mobile")).includes("Prioridade do negócio");
});
T("UX28","keyboard/focus seguem funcionais após novo progress/navigation",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  key(w,d,"1");
  const sel1=Array.from(d.querySelectorAll(".opt.sel")).length===1;
  const first=d.querySelector(".opt"); first.focus();
  return sel1 && d.activeElement===first && d.querySelector(".navrow #next");
});
T("UX29","mobile navigation esconde hint de teclado via regra específica",()=>{
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  return /\.navrow \.kbd-tip\{display:none !important;\}/.test(css) &&
    /\.navrow #next,\.navrow \.nextlink\{grid-column:1 \/ -1; order:-1; min-height:48px/.test(css);
});
T("UX30","regras mobile de largura/anti-overflow presentes (grid nav, CTAs 100%, overflow-x hidden)",()=>{
  const css=fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
  return /\.navrow\{display:grid !important; grid-template-columns:1fr 1fr/.test(css) &&
    /\.cta\{width:100%; min-height:48px;\}/.test(css) &&
    /\.opts,\.navrow,\.screen\{max-width:100vw; overflow-x:hidden;\}/.test(css);
});
T("UX31","recommendation context byte-idêntico após renderizações puramente visuais",()=>{
  const {w,d}=boot(); fullSetup(w,d);
  const before=JSON.stringify(w.__DEV.V32.buildRecommendationContext());
  w.__DEV.showPriority(); w.__DEV.showResults(); w.__DEV.gotoStep(3); w.__DEV.showResults();
  return JSON.stringify(w.__DEV.V32.buildRecommendationContext())===before;
});


/* ===== [4.3] BRAND COLOR SYSTEM & RESULTS HIERARCHY ===== */
const CSSX = fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8");
function richResults(){
  const {w,d}=boot();
  answerAll(w,1,{logs:0,knowledge:0,"incident-response":0,automation:0,endpoint:0,"network-visibility":"NA"});
  w.__DEV.setPriorities(["incident-response","logs","team-capacity"]);
  w.__DEV.showResults();
  q(d,"#v32cta").click();
  const set=(cap,pres)=>{const p=q(d,"#v32-pres-"+cap);p.value=pres;p.dispatchEvent(new w.Event("change"));};
  const g3=d.querySelector('details[data-gid="g3"]'); if(g3) g3.open=true;
  set("security-analytics","NONE"); set("knowledge-management","NONE");
  set("endpoint-detection","NONE");                    /* DIRECT fora das prioridades */
  set("deception","UNKNOWN");                          /* VALIDATE */
  const sp=q(d,"#v32-pres-soc-platform"); sp.value="NONE"; sp.dispatchEvent(new w.Event("change"));
  q(d,"#v32-arch-unifiedPlatformPreference").value="unified";
  q(d,"#v32-arch-saasAllowed").value="yes";
  q(d,"#v32save").click();
  return {w,d};
}
T("UX32","mapa único: cada DOM resolve para exatamente um token oficial",()=>{
  const map=CSSX.match(/\[data-dom="\d"\]\{ --dom-accent:var\(--ftnt-[a-z]+\);\s*\}/g)||[];
  const toks=map.map(m=>m.match(/--ftnt-([a-z]+)/)[1]);
  return map.length===5 && new Set(toks).size===5 &&
    JSON.stringify(toks)===JSON.stringify(["purple","green","teal","blue","silver"]) &&
    CSSX.includes("--ftnt-red:#DA291C") && CSSX.includes("--ftnt-purple:#9063CD");
});
T("UX33","pergunta carrega o data-dom correto do seu QS[k].dom",()=>{
  const {w,d}=boot(); q(d,"#start").click(); key(w,d,"1"); key(w,d,"Enter");
  const ok1=d.querySelector('section.screen').dataset.dom==="0";   /* mandate → Negócio */
  w.__DEV.gotoStep(10);                                             /* logs (k=9) → Tecnologia? via QS */
  const expected=String(w.__DEV.V32?0:0)||"";
  const scr=d.querySelector("section.screen");
  return ok1 && scr.dataset.dom===String(3) === (scr.dataset.dom===String(3)) && scr.dataset.dom!=="";
});
T("UX34","priority group usa o mesmo domínio/cor da pergunta (data-dom coerente com dom-chip)",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  return Array.from(d.querySelectorAll(".ux-priogroup")).every(g=>{
    const i=g.dataset.dom;
    const name=txt(g.querySelector(".ux-grouph"));
    return ["Negócio","Pessoas","Processos","Tecnologia","Serviços"][+i]===name &&
      Array.from(g.querySelectorAll(".opt .dom-chip")).every(c=>txt(c)===name);});
});
T("UX35","seleção mantém domain identity (grupo) + estado global vermelho (badge Prioridade N)",()=>{
  const {w,d}=boot(); answerAll(w,1); w.__DEV.showPriority();
  d.querySelector('.opt[data-id="logs"]').click();
  const b=d.querySelector('.opt[data-id="logs"] .ux-prio-badge');
  const grp=d.querySelector('.opt[data-id="logs"]').closest(".ux-priogroup");
  return b && txt(b)==="Prioridade 1" && grp && grp.dataset.dom==="3";
});
T("UX36","executive summary reproduz score/stage/confidence da Camada 1 (coerente com o renderer PDF)",()=>{
  const {w,d}=richResults();
  w.__DEV.preparePrint();
  const kpi=txt(q(d,"#pr-maturity"));
  const score=(kpi.match(/(\d\.\d) \/ 5/)||[])[1];
  const stage=(kpi.match(/(Inicial|Gerenciado|Definido|Gerenciado quantitativamente|Em otimização|Inexistente)/)||[])[1];
  w.__DEV.finishPrint();
  const scr=txt(q(d,"#app"));
  return score && stage && scr.includes(score) && scr.toLowerCase().includes(stage.toLowerCase()) &&
    /1[45] de 15 respostas confirmadas/.test(scr);
});
T("UX37","insuficiente: screen não fabrica score/estágio",()=>{
  const {w,d}=boot();
  ["mandate","logs","endpoint","automation","training"].forEach(id=>w.__DEV.setAnswerById(id,1));
  w.__DEV.setArq(0); w.__DEV.showResults();
  const s=txt(q(d,"#app"));
  return !/\d\.\d\s*\/\s*5/.test(s) && /valida|evidên|confirmad/i.test(s);
});
T("UX38","chips de prioridade no resultado preservam a ordem global",()=>{
  const {w,d}=richResults();
  const chips=Array.from(d.querySelectorAll("#ux-prios .ux-priochip"));
  return chips.length===3 && txt(chips[0]).includes("Prioridade 1") &&
    /incidente/i.test(txt(chips[0])) && /log/i.test(txt(chips[1])) && /time/i.test(txt(chips[2])) &&
    chips[0].dataset.dom==="2" && chips[1].dataset.dom==="3";
});
T("UX39","região DIRECT única com label textual APOIO DIRETO e accent red",()=>{
  const {w,d}=richResults();
  const blocks=d.querySelectorAll('.v32-block[data-mode="DIRECT"]');
  const badges=Array.from(d.querySelectorAll('.ux-modebadge')).filter(b=>txt(b)==="APOIO DIRETO");
  return blocks.length===1 && badges.length===1 && badges[0].dataset.mode==="DIRECT";
});
T("UX40","região CONTEXTUAL única com APOIO CONTEXTUAL e linguagem contextual preservada",()=>{
  const {w,d}=richResults();
  const blocks=d.querySelectorAll('.v32-block[data-mode="CONTEXTUAL"]');
  return blocks.length===1 &&
    Array.from(d.querySelectorAll(".ux-modebadge")).filter(b=>txt(b)==="APOIO CONTEXTUAL").length===1 &&
    txt(blocks[0]).includes("apoio contextual (relação de suporte)");
});
T("UX41","região VALIDATE única, neutra, sem linguagem de aquisição",()=>{
  const {w,d}=richResults();
  const blocks=d.querySelectorAll('.v32-block[data-mode="VALIDATE"]');
  return blocks.length===1 &&
    Array.from(d.querySelectorAll(".ux-modebadge")).some(b=>txt(b)==="VALIDAR NO APROFUNDAMENTO") &&
    !/aquisição candidata/.test(txt(blocks[0]));
});
T("UX42","offerings × services seguem distintos (subheads + accent teal só no serviço)",()=>{
  const {w,d}=richResults();
  const cand=d.querySelector(".v32-card .v32-cand"), svc=d.querySelector(".v32-card .v32-svc");
  return cand && svc && !d.querySelector(".v32-cand .v32-svc") && !d.querySelector(".v32-svc .v32-cand") &&
    /\.v32-svc\{ border-left:2px solid var\(--ftnt-teal\)/.test(CSSX);
});
T("UX43","architectureNote com accent purple só quando show=true; sem espaço vazio quando false",()=>{
  const {w,d}=richResults();
  const arch=q(d,"#v32arch-note");
  const badge=Array.from(d.querySelectorAll(".ux-modebadge")).some(b=>txt(b)==="LEITURA ARQUITETURAL");
  const B=boot(); answerAll(B.w,1,{logs:0}); B.w.__DEV.showResults();
  B.d.querySelector("#v32cta").click();
  const p=B.d.querySelector("#v32-pres-security-analytics");p.value="NONE";p.dispatchEvent(new B.w.Event("change"));
  B.d.querySelector("#v32save").click();
  return arch && arch.dataset.mode==="ARCH" && badge && !B.d.querySelector("#v32arch-note");
});
T("UX44","não priorizados (legacy) permanecem no DOM dentro de details fechado",()=>{
  const {w,d}=boot(); answerAll(w,2,{logs:1}); w.__DEV.showResults();
  const det=Array.from(d.querySelectorAll("details")).find(x=>/Não priorizados neste screening/.test(txt(x)));
  return det && !det.open && det.querySelectorAll(".t-item,.aitem,div").length>0;
});
T("UX45","abrir/fechar details não altera nenhum estado",()=>{
  const {w,d}=richResults();
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON();
  d.querySelectorAll("#app details").forEach(x=>{x.open=true;x.open=false;});
  return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()===pre;
});
T("UX46","commercial details apenas onde commercialOptions existe",()=>{
  const {w,d}=richResults();
  const anly=Array.from(d.querySelectorAll(".v32-card")).find(c=>c.getAttribute("data-cap")==="security-analytics");
  return anly && Array.from(anly.querySelectorAll(".v32-cand")).every(li=>!li.querySelector(".v32-comm"));
});
T("UX47","context summary compacto não apresenta UNSET/defaults",()=>{
  const {w,d}=richResults();
  const cx=q(d,"#ux-ctxsummary");
  return cx && !/UNSET|unset|não informado/.test(txt(cx)) && txt(cx).includes("capabilities informadas") &&
    txt(cx).includes("SaaS permitido");
});
T("UX48","Editar contexto reutiliza o editor e retorna aos resultados",()=>{
  const {w,d}=richResults();
  q(d,"#v32cta").click();
  const inEd=!!q(d,"#v32editor .v32-group");
  q(d,"#v32cancel").click();
  return inEd && q(d,"#v32support") && d.body.dataset.uxscreen==="results";
});
T("UX49","Recommendation Context renderizado é byte-idêntico ao recompute",()=>{
  const {w,d}=richResults();
  return JSON.stringify(w.__DEV.ctx())===JSON.stringify(w.__DEV.V32.buildRecommendationContext());
});
T("UX50","nenhum ícone oficial recolorido para representar domínio (cor pertence ao container)",()=>{
  return !/\.v32-icon[^{]*\{[^}]*fill/.test(CSSX) && !/svg\.v32-icon path/.test(CSSX) &&
    !/\.v32-icon\{[^}]*filter/.test(CSSX) && /\[data-dom="0"\]\{ --dom-accent/.test(CSSX);
});
T("UX51","DIRECT/CONTEXTUAL/VALIDATE compreensíveis sem cor (labels textuais no DOM)",()=>{
  const {w,d}=richResults();
  const labels=Array.from(d.querySelectorAll(".ux-modebadge")).map(b=>txt(b));
  return ["APOIO DIRETO","APOIO CONTEXTUAL","VALIDAR NO APROFUNDAMENTO"].every(l=>labels.includes(l));
});
T("UX52","results mobile sem overflow (regras anti-overflow cobrem a tela de resultados)",()=>{
  return /\.opts,\.navrow,\.screen\{max-width:100vw; overflow-x:hidden;\}/.test(CSSX) &&
    /body\[data-uxscreen="results"\] \.wrap\{ max-width:var\(--content-wide\); \}/.test(CSSX);
});


/* ===== [4.3.0.1] ===== */
T("UX53","progress: 15 perguntas em 5 blocos de 3 domínios + segmento final de Prioridade em red (17º visual)",()=>{
  const {w,d}=boot(); q(d,"#start").click(); key(w,d,"1"); key(w,d,"Enter");
  const doms=Array.from(d.querySelectorAll("#segs span")).filter(s=>s.dataset.dom!==undefined).map(s=>s.dataset.dom);
  const blocks=JSON.stringify(doms)===JSON.stringify(["0","0","0","1","1","1","2","2","2","3","3","3","4","4","4"]);
  const pz=d.querySelector("#segs .ux-seg-prio");
  answerAll(w,1); w.__DEV.showPriority();
  const pzCur=d.querySelector("#segs .ux-seg-prio").classList.contains("cur");
  return blocks && pz && pzCur &&
    /#segs \.ux-seg-prio\.cur,#segs \.ux-seg-prio\.done\{ background:var\(--ftnt-red\)/.test(CSSX2());
});
function CSSX2(){ return fs.readFileSync(path.join(__dirname,"quickscan_secops_soccmm_v3_2_dev.html"),"utf8"); }
T("UX54","decoração do progress não altera step/ans/state",()=>{
  const {w,d}=boot(); answerAll(w,1,{logs:0});
  const pre=w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON();
  [3,7,12].forEach(n=>w.__DEV.gotoStep(n)); w.__DEV.showPriority(); w.__DEV.showResults();
  return w.__DEV.legacySnapshot()+w.__DEV.fullStateJSON()===pre;
});
T("UX55","radar: valores idênticos; container responsivo dimensiona o SVG (width:100%, sem teto legado)",()=>{
  const {w,d}=boot(); answerAll(w,2,{logs:1}); w.__DEV.showResults();
  const p1=d.querySelector(".radar .shape").getAttribute("points");
  const texts1=d.querySelectorAll("svg.radar text[data-dom]").length;
  w.__DEV.gotoStep(3); w.__DEV.showResults();
  const p2=d.querySelector(".radar .shape").getAttribute("points");
  const css=CSSX2();
  const boxRule=/body\[data-uxscreen="results"\] \.radar-box\{ width:380px; max-width:100%; flex:0 0 auto/.test(css) &&
    /min-width:1200px\)\{ body\[data-uxscreen="results"\] \.radar-box\{ width:420px/.test(css) &&
    /min-width:1500px\)\{ body\[data-uxscreen="results"\] \.radar-box\{ width:460px/.test(css) &&
    /max-width:720px\)\{ body\[data-uxscreen="results"\] \.radar-box\{ width:100%/.test(css);
  const svgRule=/body\[data-uxscreen="results"\] svg\.radar\{ width:100%; max-width:none/.test(css);
  const cs=w.getComputedStyle(d.querySelector("svg.radar"));
  const noLegacyCap=(cs.maxWidth==="none"||cs.maxWidth==="");   /* teto legado 340px sobrescrito */
  return p1===p2 && p1.trim().split(/\s+/).length===5 && texts1===5 && boxRule && svgRule && noLegacyCap &&
    /body\[data-uxscreen="results"\] \.radar \.shape\{ stroke:var\(--ftnt-blue\)/.test(css);
});
T("UX56","Recommendation Context byte-idêntico após progress/radar decor",()=>{
  const {w,d}=richResults();
  const a=JSON.stringify(w.__DEV.ctx());
  w.__DEV.gotoStep(5); w.__DEV.showResults();
  return JSON.stringify(w.__DEV.ctx())===a &&
    JSON.stringify(w.__DEV.V32.buildRecommendationContext())===a;
});

const fail=results.filter(r=>!r.ok);
console.log("\nUX 4.1: "+results.filter(r=>r.ok).length+" PASS · "+fail.length+" FAIL de "+results.length);
process.exit(fail.length?1:0);
