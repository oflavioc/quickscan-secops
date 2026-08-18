/* ============ PHASE 4.1 · JOURNEY & LAYOUT FOUNDATION (camada UX; engine intocado) ============ */
const esc32 = window.__V32UI.esc32;
function uxScreenOf(){ return step===-1?"home":(step===0?"arq":(step<=QS.length?"question":(step===PRIORITY_STEP?"priority":"results"))); }
const __renderCore41 = render;
render = function(){ __renderCore41(); try{ uxAfterRender(); }catch(e){ console.error("UX 4.1:", e.message); } };
function uxAfterRender(){
  document.body.dataset.uxscreen = uxScreenOf();
  const app = $("#app");
  if (step === -1) uxHome(app);
  if (step === PRIORITY_STEP) uxPriority(app);
  if (uxScreenOf() === "question") uxQuestionDecor(app);
  if (uxScreenOf() === "results"){ uxSessionControls(); uxResultsDecor(app); }
  uxProgressMobile();
  uxProgressDomains();
}
/* ---------- [4.2-A] semântica de sessão ---------- */
function uxResetAssessment(){
  if (typeof clearTargetProfile==="function") clearTargetProfile();
  if (typeof clearOperationalRefinement==="function") clearOperationalRefinement();   /* [4.4-L] */   /* [4.3.1-O] sem baseline não há cenário */
  ans.fill(null); notes.fill(""); businessPriority.clear(); prioLimitHit=false; arq=null;
  step=-1; render();                                   /* Landscape/arch/platform/sinais PRESERVADOS */
}
function uxNewSession(opts){
  const __silent = !!(opts && opts.silent);
  if (typeof clearTargetProfile==="function") clearTargetProfile();
  if (typeof clearOperationalRefinement==="function") clearOperationalRefinement();
  ans.fill(null); notes.fill(""); businessPriority.clear(); prioLimitHit=false; arq=null;
  V32.resetLandscapeToUnset();                          /* limpa TODO o contexto V3.2 */
  step=-1; render();
}
function uxModal(o){
  const old=document.getElementById("ux-modal"); if(old) old.remove();
  const m=document.createElement("div"); m.id="ux-modal"; m.className="ux-modal";
  m.innerHTML=`<div class="ux-modal-card" role="dialog" aria-modal="true" aria-labelledby="ux-modal-t">
    <h3 id="ux-modal-t">${esc32(o.title)}</h3>${o.bodyHTML ? o.bodyHTML : `<p class="ux-micro">${esc32(o.body||"")}</p>`}
    <div class="ux-ctxactions">
      <button class="cta ux-modal-cta" id="ux-modal-ok" type="button">${esc32(o.confirmLabel)}</button>
      <button class="btn2" id="ux-modal-cancel" type="button">Cancelar</button>
    </div></div>`;
  document.body.appendChild(m);
  const esch=e=>{ if(e.key==="Escape"){ e.stopPropagation(); close(true); } };
  function close(restore){ m.remove(); document.removeEventListener("keydown",esch,true);
    if(restore && o.origin && o.origin.isConnected) o.origin.focus(); }
  document.addEventListener("keydown",esch,true);
  m.querySelector("#ux-modal-cancel").onclick=()=>close(true);
  m.querySelector("#ux-modal-ok").onclick=()=>{ close(false); o.onConfirm(); };
  const __f = o.focusSelector && m.querySelector(o.focusSelector);
  (__f || m.querySelector("#ux-modal-ok")).focus();
}
function uxSessionControls(){
  const rs=document.getElementById("restart");
  if(!rs || rs.dataset.ux) return;
  rs.dataset.ux="1"; rs.textContent="Reiniciar avaliação";
  rs.onclick=()=>uxModal({ title:"Reiniciar avaliação?",
    body:"Respostas, observações e prioridades serão limpas. O contexto tecnológico declarado será preservado.",
    confirmLabel:"Reiniciar avaliação", origin:rs, onConfirm:uxResetAssessment });
  const ns=document.createElement("button");
  ns.className="btn2"; ns.id="ux-newsession"; ns.type="button"; ns.textContent="Nova sessão";
  rs.insertAdjacentElement("afterend", ns);
  ns.onclick=()=>uxModal({ title:"Iniciar nova sessão?",
    body:"Nova sessão remove também todo o contexto tecnológico declarado.",
    confirmLabel:"Nova sessão", origin:ns, onConfirm:uxNewSession });
}
/* ---------- [4.3.0.1-A] progress: 5 blocos de domínio + segmento de Prioridade ---------- */
function uxProgressDomains(){
  const segs=document.getElementById("segs"); if(!segs) return;
  Array.from(segs.children).forEach((s,i)=>{
    if (s.classList.contains("ux-seg-prio")) return;
    if (i>=1 && i<=QS.length) s.dataset.dom = QS[i-1].dom;
  });
  let pz=segs.querySelector(".ux-seg-prio");
  if(!pz){ pz=document.createElement("span"); pz.className="ux-seg-prio";
    pz.setAttribute("title","Prioridade do negócio"); segs.appendChild(pz); }
  pz.classList.toggle("cur", step===PRIORITY_STEP && document.body.dataset.uxscreen==="priority");
  pz.classList.toggle("done", step>PRIORITY_STEP);
}
/* ---------- [4.2-C] progress mobile ---------- */
function uxProgressMobile(){
  let el=document.getElementById("ux-progress-mobile");
  const top=document.querySelector(".top");
  if(!top) return;
  if(!el){ el=document.createElement("div"); el.id="ux-progress-mobile"; el.className="ux-progress-mobile";
    el.setAttribute("role","status"); top.insertAdjacentElement("afterend", el); }
  const TOT=QS.length+1;
  let lab=null, pct=0;
  if(step>=0 && step<=QS.length){ const dn = step>0 ? " · "+DOMS[QS[step-1].dom].pt : "";
    lab=`Etapa ${step+1} de ${TOT}${dn}`; pct=Math.round(((step+1)/(TOT+1))*100); }
  else if(step===PRIORITY_STEP){ lab="Etapa final"; pct=96; }
  if(!lab){ el.classList.add("hidden"); el.innerHTML=""; el.removeAttribute("aria-label"); return; }
  el.classList.remove("hidden");
  el.setAttribute("aria-label", lab);
  el.innerHTML=`<span class="ux-prog-lab">${esc32(lab)}</span><span class="ux-prog-bar"><span class="ux-prog-fill" style="width:${pct}%"></span></span>`;
}
const uxQById = id => QS.find(q=>q.id===id);
function uxCtxDeclared(){ return V32.isLegacyModeV32() === false; }
function uxSummaryBits(){
  const caps = Object.values(V32.TECH_LANDSCAPE).filter(l=>l.presence!=="UNSET").length;
  const bits = [ caps + (caps===1?" capability informada":" capabilities informadas") ];
  if ((V32.PLATFORM_CONTEXT.declaredPlatforms||[]).some(p=>p&&p.platform==="fortigate")) bits.push("FortiGate declarado");
  const s = V32.ARCHITECTURE_CONTEXT.saasAllowed;
  if (s==="yes") bits.push("SaaS permitido"); else if (s==="no") bits.push("SaaS não permitido");
  const sg = V32.SIGNAL_IDS.filter(k=>V32.SESSION_SIGNALS[k]===true).length;
  if (sg) bits.push(sg + (sg===1?" sinal declarado":" sinais declarados"));
  return bits.join(" · ");
}
function uxHome(app){
  const scr = app.querySelector("section.screen"); if(!scr || document.getElementById("ux-home")) return;
  const has = uxCtxDeclared();
  const div = document.createElement("div"); div.id="ux-home"; div.className="ux-home";
  div.innerHTML = (has ? `
    <div class="ux-ctxsum" id="ux-ctxsum"><b>Contexto tecnológico adicionado ✓</b>
      <div class="ux-ctxbits">${esc32(uxSummaryBits())}</div>
      <div class="ux-ctxactions">
        <button class="btn2" id="ux-editctx" type="button">Editar contexto</button>
        <button class="btn2" id="ux-clearctx" type="button">Limpar contexto tecnológico</button>
      </div></div>` : `
    <button class="btn2 ux-addctx" id="ux-addctx" type="button">Adicionar contexto tecnológico · opcional</button>`) +
  `<div class="ux-time ux-time-ctx"><b>Tempo estimado: ~5–10 min · preencha apenas o que souber</b><br>Informe tecnologias, arquitetura, restrições e requisitos conhecidos para contextualizar o resultado.</div>
  <p class="ux-micro">O contexto tecnológico não altera a pontuação de maturidade. Ele é utilizado somente para contextualizar o resultado e evitar recomendações incompatíveis com o ambiente existente.<br>Você não precisa preencher tudo. Campos não informados permanecem como contexto não declarado.</p>`;
  /* [4.4.0.1-A] 15 core + 1 ponto de partida — sem ambiguidade 15 vs 16 */
  scr.querySelectorAll(".eyebrow").forEach(e=>{ if(/~10 minutos/i.test(e.textContent)) e.textContent="Quickscan SOC-CMM · SecOps"; });
  scr.querySelectorAll("p.lead").forEach(p=>{ if(/16 perguntas respondidas/.test(p.textContent))
    p.innerHTML=p.innerHTML.replace(/16 perguntas respondidas em conversa guiada/,
      "15 perguntas de maturidade em conversa guiada, além de um ponto de partida inicial"); });
  scr.querySelectorAll("div").forEach(dv=>{ const b=dv.querySelector(":scope > b");
    if(b && b.textContent.trim()==="16" && /perguntas guiadas/.test(dv.textContent)){
      b.textContent="15 + 1"; dv.childNodes.forEach(nn=>{ if(nn.nodeType===3 && /perguntas guiadas/.test(nn.textContent)) nn.textContent="perguntas + ponto de partida"; });
      if(!/ponto de partida/.test(dv.textContent)) dv.appendChild(document.createTextNode("perguntas + ponto de partida"));
    }});
  const st=scr.querySelector("#start");
  if (st && !scr.querySelector(".ux-time-core")){
    const tc=document.createElement("div"); tc.className="ux-time ux-time-core";
    tc.innerHTML=`<b>Tempo estimado: ~8–12 min · 15 perguntas</b><br>Avalie práticas de Negócio, Pessoas, Processos, Tecnologia e Serviços.<br><span class="ux-mut">Ao final, você poderá refinar o diagnóstico com 3 perguntas adicionais.</span>`;
    st.insertAdjacentElement("afterend", tc);
  }
  scr.appendChild(div);
  if (window.__sesDecor) window.__sesDecor(app, "home");
  const add=document.getElementById("ux-addctx"), edt=document.getElementById("ux-editctx"), clr=document.getElementById("ux-clearctx");
  if(add) add.onclick = uxOpenHomeEditor;
  if(edt) edt.onclick = uxOpenHomeEditor;
  if(clr) clr.onclick = ()=>{ V32.resetLandscapeToUnset(); render(); };   /* ação explícita "Limpar contexto tecnológico" */
}
function uxOpenHomeEditor(){
  const app = $("#app");
  app.innerHTML = `<section class="screen">
    <div class="eyebrow">Contexto tecnológico · opcional</div>
    <div class="qnum">Não altera perguntas, opções nem pontuação — apenas contextualiza o resultado.</div>
    <div id="v32errors" class="v32-errors v32-hidden" role="alert"></div>
    <div id="v32editor" class="v32-block"></div>
  </section>`;
  document.body.dataset.uxscreen = "ctxeditor";
  window.__V32UI.openEditor(app, "home");
}
function uxPriority(app){
  const opts = app.querySelector(".opts"); if(!opts || opts.classList.contains("ux-grouped")) return;
  const findings = computeFindings().findings;
  const btnOf = {}; opts.querySelectorAll("button.opt").forEach(b=>{ btnOf[b.dataset.id]=b; });
  const byDom = DOMS.map(()=>[]);
  findings.forEach(f=>byDom[QS[f.k].dom].push(f.id));            /* derivado de DOMS + QS[f.k].dom; sem hardcode */
  const layout=document.createElement("div"); layout.className="ux-priolayout";
  const grid=document.createElement("div"); grid.className="ux-priogrid";
  byDom.forEach((ids,i)=>{ if(!ids.length) return;               /* só grupos com findings */
    const sec=document.createElement("section"); sec.className="ux-priogroup";
    const h=document.createElement("h3"); h.className="ux-grouph"; h.textContent=DOMS[i].pt; sec.appendChild(h);
    const body=document.createElement("div"); body.className="ux-groupbody";
    ids.forEach(id=>{ if(btnOf[id]) body.appendChild(btnOf[id]); });   /* nós ORIGINAIS movidos: handlers/aria intactos */
    sec.dataset.dom = i;   /* [4.3-E] identidade do domínio */
    sec.appendChild(body); grid.appendChild(sec); });
  const aside=document.createElement("aside"); aside.className="ux-priosummary"; aside.id="ux-priosummary";
  const order=[...businessPriority];
  aside.innerHTML = `<div class="ux-sumt">Prioridades escolhidas · ${order.length} de 3</div>` +
    (order.length? `<ol>${order.map(id=>`<li>${esc32(uxQById(id).lbl)}</li>`).join("")}</ol>`
                 : `<div class="ux-micro">Nenhuma prioridade selecionada ainda.</div>`);
  layout.appendChild(grid); layout.appendChild(aside);
  opts.classList.add("ux-grouped"); opts.appendChild(layout);
  order.forEach((id,ix)=>{ const b=btnOf[id]; if(b){ const s=document.createElement("span");
    s.className="ux-prio-badge"; s.textContent="Prioridade "+(ix+1); b.querySelector("span:last-child").appendChild(s); } });
}

/* ===== [4.3-D] pergunta com identidade do domínio ===== */
function uxQuestionDecor(app){
  const scr=app.querySelector("section.screen"); if(!scr) return;
  const k=step-1; if(k>=0 && k<QS.length) scr.dataset.dom = QS[k].dom;
}
/* ===== [4.3-F/I/J/H/K/G] resultados ===== */
window.__uxDecor = (app)=>{ try{ if (uxScreenOf()==="results"){ uxSessionControls(); uxResultsDecor(app||$("#app")); } }catch(e){ console.error("UX decor:", e.message); } };
function uxResultsDecor(app){
  const old=document.getElementById("ux-execrow"); if(old) old.remove();   /* idempotente: refaz após edits */
  /* radar: eixos com identidade (match textual determinístico; nunca só cor) */
  app.querySelectorAll("svg.radar text").forEach(t=>{
    DOMS.forEach((dm,i)=>{ if ((t.textContent||"").trim().startsWith(dm.pt)||(t.textContent||"").trim().startsWith(dm.en)) t.dataset.dom=i; });
  });
  /* regiões do support: data-mode + badge textual (engine decide o grupo; UX só rotula) */
  const MODE_OF = [["Apoio direto","DIRECT","APOIO DIRETO"],["Apoio contextual","CONTEXTUAL","APOIO CONTEXTUAL"],
    ["A validar em aprofundamento","VALIDATE","VALIDAR NO APROFUNDAMENTO"],["arquitetural","ARCH","LEITURA ARQUITETURAL"]];
  app.querySelectorAll(".section-title .eyebrow").forEach(ey=>{
    const hit=MODE_OF.find(([m])=>ey.textContent.includes(m)); if(!hit) return;
    const block=ey.closest(".section-title").nextElementSibling;
    if(block && block.classList.contains("v32-block")) block.dataset.mode=hit[1];
    if(!ey.querySelector(".ux-modebadge")){
      const b=document.createElement("span"); b.className="ux-modebadge"; b.dataset.mode=hit[1]; b.textContent=hit[2];
      ey.prepend(b);
    }
  });
  /* executive strip: prioridades declaradas + contexto compacto, antes dos gaps */
  const anchor=Array.from(app.querySelectorAll(".section-title")).find(s=>/Gaps observados/i.test(s.textContent));
  if(!anchor) return;
  const row=document.createElement("div"); row.className="ux-execrow"; row.id="ux-execrow";
  const findings=computeFindings().findings;
  const order=[...businessPriority];
  const prios=document.createElement("div"); prios.className="ux-prios"; prios.id="ux-prios";
  prios.innerHTML=`<div class="eyebrow">O que mais importa · prioridades declaradas pelo negócio</div>`+
    (order.length? order.map((id,ix)=>{ const qq=uxQById(id);
      return `<div class="ux-priochip" data-dom="${qq.dom}"><span class="pnum">Prioridade ${ix+1}</span><span>${esc32(qq.lbl)}</span></div>`;}).join("")
    : `<div class="ux-micro">Nenhuma prioridade foi selecionada nesta sessão — o negócio pode declará-las em uma próxima conversa.</div>`);
  row.appendChild(prios);
  if (V32.isLegacyModeV32()===false){
    const bits=[];
    const caps=Object.entries(V32.TECH_LANDSCAPE).filter(([,l])=>l.presence!=="UNSET");
    bits.push(`${caps.length} capabilities informadas`);
    const prods=caps.flatMap(([,l])=>(l.solutions||[]).map(s=>[s.vendor,s.product].filter(Boolean).join(" "))).filter(Boolean).slice(0,4);
    prods.forEach(p=>bits.push(p));
    const fgt=(V32.PLATFORM_CONTEXT.declaredPlatforms||[]).find(p=>p&&p.platform==="fortigate");
    if(fgt) bits.push("FortiGate"+(fgt.bundle&&V32.BUNDLES[fgt.bundle]?` · ${V32.BUNDLES[fgt.bundle].name}`:""));
    const A=V32.ARCHITECTURE_CONTEXT;
    if(A.saasAllowed==="yes") bits.push("SaaS permitido"); if(A.saasAllowed==="no") bits.push("SaaS não permitido");
    if(A.dataResidencyLocalOnly==="yes") bits.push("Dados on-prem/local");
    const sg=V32.SIGNAL_IDS.filter(k=>V32.SESSION_SIGNALS[k]===true).length;
    if(sg) bits.push(`${sg} ${sg===1?"sinal declarado":"sinais declarados"}`);
    const cx=document.createElement("div"); cx.className="ux-ctxsummary"; cx.id="ux-ctxsummary";
    cx.innerHTML=`<div class="eyebrow">Contexto tecnológico declarado</div>`+
      bits.map(b=>`<span class="ux-ctxbit">${esc32(b)}</span>`).join("");
    row.appendChild(cx);
  }
  anchor.parentNode.insertBefore(row, anchor);
  try{ tgtSection(app); }catch(e){ console.error("UX target:", e.message); }
  try{ refSummaryBlock(app); }catch(e){ console.error("UX ref:", e.message); }
  try{ journeySection(app); }catch(e){ console.error("UX journey:", e.message); }
  if (window.__sesDecor) window.__sesDecor(app, "results");   /* [4.8-AE] hook único de sessão */
  app.querySelectorAll(".grid2 h3, .panel h3").forEach(h=>{                  /* [4.5.0.1-C] título único na tela */
    if(h.textContent.trim().toLowerCase()==="leitura executiva") h.textContent="Síntese do resultado"; });
}
if (window.__DEV) Object.assign(window.__DEV, {
  showPriority: ()=>{ step = PRIORITY_STEP; render(); },
  uxScreen: ()=> document.body.dataset.uxscreen,
  goHome: ()=>{ step=-1; render(); },
  gotoStep: (n)=>{ step=n; render(); }
});
try{ if (typeof step!=="undefined") uxAfterRender(); }catch(e){}
