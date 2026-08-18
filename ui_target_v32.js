/* ============ PHASE 4.3.1 · CURRENT vs TARGET MATURITY SCENARIO (camada prospectiva; engine intocado) ============ */
const TARGET_PROFILE = { overrides: {} };
let tgtNotices = [];                     /* persistem até ação explícita do usuário (mesma avaliação) */                       /* [A] estado esparso, fora do engine */
const TGT_DISCLAIMER = "Cenário indicativo, não uma previsão. A adoção de tecnologia, isoladamente, não altera a maturidade. A evolução depende da implementação e adoção operacional das práticas-alvo, incluindo processos, pessoas, governança e evidências correspondentes.";
const tgtKOf = qid => QS.findIndex(q=>q.id===qid);
function targetAnswer(qid){                                     /* [B] override explícito OU resposta atual */
  const k = tgtKOf(qid);
  return (qid in TARGET_PROFILE.overrides) ? TARGET_PROFILE.overrides[qid] : ans[k];
}
function tgtEffectiveVector(){ return QS.map(q=>targetAnswer(q.id)); }
function tgtHasOverrides(){ return Object.keys(TARGET_PROFILE.overrides).length>0; }
function setTarget(qid, v){                                     /* [C] nunca inferior ao atual confirmado */
  const k = tgtKOf(qid); if(k<0) return false;
  if (v===null || v===undefined || v===""){ delete TARGET_PROFILE.overrides[qid]; return true; }
  v = +v;
  if (!(v>=0 && v<=3)) return false;                            /* "NA" jamais é target */
  const cur = ans[k];
  if (cur!==null && cur!=="NA" && v < cur) return false;
  TARGET_PROFILE.overrides[qid] = v;
  return true;
}
function clearTargetProfile(){ TARGET_PROFILE.overrides = {}; tgtNotices = []; }   /* [4.3.1.1-A] rota ÚNICA: limpeza real elimina notices */
/* [D] calculador PURO — espelha byte a byte a matemática legada (SCORES/DOMS/média/suficiência/stageOf) */
function computeTargetProfile(eff){
  const stats = DOMS.map((_,i)=>{
    const idx = QS.map((q,k)=>({q,k})).filter(o=>o.q.dom===i).map(o=>o.k);
    const vals = idx.filter(k=>eff[k]!==null && eff[k]!=="NA").map(k=>SCORES[eff[k]]);
    const n = vals.length;
    return { n, score: n>0 ? Math.round(vals.reduce((a,b)=>a+b,0)/n*10)/10 : null };
  });
  const confirmed = eff.filter(v=>v!==null && v!=="NA").length;
  const suff = confirmed>=10 && stats.every(s=>s.n>=2);
  const scored = stats.filter(s=>s.score!==null);
  const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;
  return { stats, suff, overall, stage: overall===null? null : stageOf(overall) };
}
function tgtCurrentProfile(){ return computeTargetProfile(QS.map((_,k)=>ans[k])); }
function revalidateTargets(){                                   /* [O] current revisado ≥ target → remove só o conflitante */
  const removed=[];
  Object.keys(TARGET_PROFILE.overrides).forEach(qid=>{
    const k=tgtKOf(qid), cur=ans[k];
    if (cur!==null && cur!=="NA" && cur >= TARGET_PROFILE.overrides[qid]){
      delete TARGET_PROFILE.overrides[qid]; removed.push(QS[k].lbl);
    }
  });
  removed.forEach(l=>{ if(!tgtNotices.includes(l)) tgtNotices.push(l); });
  return removed;
}
/* ---------------- UI ---------------- */
function tgtSection(app){
  let sec=document.getElementById("ux-target");
  if(!sec){ sec=document.createElement("div"); sec.id="ux-target";
    const foot=app.querySelector(".actions,.navrow"); app.appendChild(sec); }
  revalidateTargets();
  const notice = tgtNotices.length? `<div class="ux-tgt-notice">O alvo desta prática foi redefinido porque o nível atual revisado já o alcança ou supera: ${tgtNotices.map(esc32).join("; ")}.</div>` : "";
  if(!tgtHasOverrides()){
    sec.innerHTML = `<div class="section-title"><div class="eyebrow">Cenário-alvo de maturidade</div></div>
      <div class="v32-block">${notice}<div class="ux-micro">Nenhum cenário-alvo foi definido.<br>Defina níveis de prática desejados para visualizar uma trajetória indicativa de evolução.</div>
      <button class="btn2" id="ux-tgt-open" type="button">Definir cenário-alvo</button></div>`;
    sec.querySelector("#ux-tgt-open").onclick = ()=>{ tgtNotices=[]; tgtEditor(app); };
    return;
  }
  const cur=tgtCurrentProfile(), tgt=computeTargetProfile(tgtEffectiveVector());
  const nOv=Object.keys(TARGET_PROFILE.overrides).length;
  const fmt=v=>v===null?"n/d":v.toFixed(1);
  const stg=p=>p.stage?esc32(p.stage.pt):"n/d";
  const delta=(cur.overall!==null&&tgt.overall!==null)?` <span class="ux-tgt-delta">${tgt.overall>=cur.overall?"+":""}${(tgt.overall-cur.overall).toFixed(1)}</span>`:"";
  const rows=DOMS.map((dm,i)=>{
    const c=cur.stats[i].score,t=tgt.stats[i].score;
    const d=(c!==null&&t!==null)?`${t>=c?"+":""}${(t-c).toFixed(1)}`:"n/d";
    return `<tr data-dom="${i}"><td class="ux-tgt-dom">${esc32(dm.pt)}</td><td>${fmt(c)}</td><td>→</td><td>${fmt(t)}</td><td class="ux-tgt-delta">${d}</td></tr>`;}).join("");
  const ovList=Object.keys(TARGET_PROFILE.overrides).map(qid=>{
    const k=tgtKOf(qid), cur0=ans[k], t=TARGET_PROFILE.overrides[qid];
    const base=(cur0===null||cur0==="NA")?`<span class="ux-mut">Baseline atual não validado — delta local n/d.</span>`
      :`${esc32(QS[k].opts[cur0].t)} · ${SCORES[cur0].toFixed(1)} → `;
    return `<li class="ux-tgt-ov" data-qid="${esc32(qid)}"><b>${esc32(QS[k].lbl)}</b><br>${base}${esc32(QS[k].opts[t].t)} · ${SCORES[t].toFixed(1)}${(cur0!==null&&cur0!=="NA")?` <span class="ux-tgt-delta">+${(SCORES[t]-SCORES[cur0]).toFixed(1)}</span>`:""}${tgtEnablersHTML(qid)}</li>`;}).join("");
  sec.innerHTML = `<div class="section-title"><div class="eyebrow">Perfil atual × Cenário-alvo de maturidade</div></div>
    <div class="v32-block" id="ux-tgt-cmp">${notice}
      <div class="ux-tgt-kpis">
        <div class="ux-tgt-kpi"><span>Atual</span><b>${fmt(cur.overall)}${cur.overall!==null?" / 5":""}</b><i>${stg(cur)}</i></div>
        <div class="ux-tgt-kpi ux-tgt-kpi-t"><span>Cenário-alvo</span><b>${fmt(tgt.overall)}${tgt.overall!==null?" / 5":""}${delta}</b><i>${stg(tgt)}</i></div>
        <div class="ux-tgt-kpi"><span>Práticas-alvo alteradas</span><b>${nOv}</b><i>explícitas</i></div>
      </div>
      <div class="ux-tgt-legend">— Perfil atual&nbsp;&nbsp;&nbsp;- - Cenário-alvo</div>
      <table class="ux-tgt-table"><tbody>${rows}</tbody></table>
      <div class="ux-tgt-ovs"><div class="eyebrow">Práticas-alvo definidas</div><ul>${ovList}</ul></div>
      <div class="ux-tgt-disc">${esc32(TGT_DISCLAIMER)}</div>
      <div class="ux-ctxactions">
        <button class="btn2" id="ux-tgt-edit" type="button">Editar cenário-alvo</button>
        <button class="btn2" id="ux-tgt-clear" type="button">Limpar cenário-alvo</button>
      </div></div>`;
  sec.querySelector("#ux-tgt-edit").onclick=()=>{ tgtNotices=[]; tgtEditor(app); };
  sec.querySelector("#ux-tgt-clear").onclick=()=>uxModal({title:"Limpar cenário-alvo?",
    body:"Somente o cenário-alvo será removido. Avaliação, prioridades, contexto tecnológico e recomendações permanecem.",
    confirmLabel:"Limpar cenário-alvo", origin:sec.querySelector("#ux-tgt-clear"),
    onConfirm:()=>{ clearTargetProfile(); tgtSection(app); tgtRadarOverlay(app); }});
  tgtRadarOverlay(app);
}
function tgtEnablersHTML(qid){                                  /* [L] SOMENTE itens já existentes no ctx atual */
  const caps=Object.keys(V32.CAPABILITIES).filter(id=>(V32.CAPABILITIES[id].questionIds||[]).includes(qid));
  const ctx=V32.buildRecommendationContext().contexts;          /* mesmo payload congelado (byte-idêntico, testado) */
  const MODE_PT={DIRECT:"apoio direto",CONTEXTUAL:"apoio contextual",VALIDATE:"validar"};
  const items=[];
  caps.forEach(cid=>{ const c=ctx[cid]; if(!c) return;
    (c.candidates||[]).forEach(x=>items.push({id:x.itemId, n:(V32.OFFERINGS[x.itemId]||{}).name||x.itemId, m:MODE_PT[c.supportMode]||"contexto", kind:"candidate"}));
    (c.services||[]).forEach(s=>items.push({id:s.serviceId, n:(V32.SERVICES[s.serviceId]||{}).name||s.serviceId, m:"serviço", kind:"service"}));});
  if(!items.length) return `<div class="ux-tgt-en ux-mut">Nenhum habilitador tecnológico específico foi identificado pelo contexto atual. A evolução desta prática pode depender principalmente de processo, pessoas, governança ou de aprofundamento adicional.</div>`;
  return `<div class="ux-tgt-en"><i>Possíveis habilitadores já identificados neste Quickscan:</i><div class="ux-tgt-enablers">${items.map(it=>`<span class="ux-tgt-enabler" data-eid="${esc32(it.id)}">${window.__V32UI.iconFor(it.id, it.n)}<span class="ux-tgt-enabler-name">${esc32(it.n)}</span><span class="ux-tgt-mode">${esc32(it.m)}</span></span>`).join("")}</div></div>`;
}
function tgtRadarOverlay(app){                                  /* [I] geometria EXATA extraída dos eixos legados */
  const svg=app.querySelector("svg.radar"); if(!svg) return;
  const old=svg.querySelector(".ux-target-shape"); if(old) old.remove();
  const lg=document.getElementById("ux-tgt-radarlegend"); if(lg) lg.remove();
  if(!tgtHasOverrides()){ svg.setAttribute("aria-label","Radar de maturidade — perfil atual"); return; }
  const axes=Array.from(svg.querySelectorAll("line.axis")); if(axes.length!==5) return;
  const tgt=computeTargetProfile(tgtEffectiveVector());
  const pts=axes.map((ax,i)=>{
    const cx=+ax.getAttribute("x1"), cy=+ax.getAttribute("y1");
    const x2=+ax.getAttribute("x2"), y2=+ax.getAttribute("y2");
    const s=tgt.stats[i].score===null?0:tgt.stats[i].score/5;
    return `${(cx+(x2-cx)*s).toFixed(2)},${(cy+(y2-cy)*s).toFixed(2)}`;}).join(" ");
  const p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
  p.setAttribute("class","ux-target-shape"); p.setAttribute("points",pts);
  p.setAttribute("fill","rgba(60,177,126,.10)"); p.setAttribute("stroke","#3CB17E");
  p.setAttribute("stroke-width","2"); p.setAttribute("stroke-dasharray","6 5");
  svg.appendChild(p);
  svg.setAttribute("aria-label","Radar comparativo: perfil atual (linha sólida azul) e cenário-alvo (linha tracejada verde), escala 0 a 5.");
  const leg=document.createElement("div"); leg.id="ux-tgt-radarlegend"; leg.className="ux-tgt-legend";
  leg.textContent="— Perfil atual · - - Cenário-alvo";
  svg.parentNode.insertAdjacentElement("afterend", leg);
}
function tgtEditor(app){
  const sec=document.getElementById("ux-target");
  const prios=new Set(businessPriority);
  const groups=[["Práticas relacionadas às prioridades declaradas",q=>prios.has(q.id)],
                ["Outras práticas com oportunidade de evolução",q=>!prios.has(q.id) && (ans[tgtKOf(q.id)]===null||ans[tgtKOf(q.id)]==="NA"||ans[tgtKOf(q.id)]<3)],
                ["Demais práticas",q=>true]];
  const usadas=new Set();
  const rowOf=q=>{ const k=tgtKOf(q.id), cur=ans[k];
    const ov=TARGET_PROFILE.overrides[q.id];
    const confirmed=(cur!==null&&cur!=="NA");
    const curLbl=confirmed?`${esc32(q.opts[cur].t)} · ${SCORES[cur].toFixed(1)}`:(cur==="NA"?"Não sei / precisa validar":"— sem resposta");
    const minOpt=confirmed?cur+1:0;
    const opts=[`<option value="">Manter atual</option>`].concat(
      q.opts.map((o,i)=>i>=minOpt?`<option value="${i}"${ov===i?" selected":""}>${esc32(o.t)} · ${SCORES[i].toFixed(1)}</option>`:"").filter(Boolean));
    const note=!confirmed?`<div class="ux-mut ux-tgt-basenote">Baseline atual não validado.</div>`:"";
    const maxed=confirmed&&cur===3;
    return `<div class="ux-tgt-row" data-dom="${q.dom}"><label for="ux-tgt-${escAttr32(q.id)}"><b>${esc32(q.lbl)}</b><br>
      <span class="ux-mut">Atual: ${curLbl}</span></label>${note}
      ${maxed?`<div class="ux-mut">Nível máximo já praticado.</div>`
        :`<select id="ux-tgt-${escAttr32(q.id)}" data-qid="${escAttr32(q.id)}">${opts.join("")}</select>`}</div>`; };
  const escAttr32=s=>String(s).replace(/"/g,"&quot;");
  window.escAttr32=escAttr32;
  const html=groups.map(([t,fn],gi)=>{
    const qs=QS.filter(q=>fn(q)&&!usadas.has(q.id)); qs.forEach(q=>usadas.add(q.id));
    if(!qs.length) return "";
    const byDom=DOMS.map((dm,i)=>{ const dq=qs.filter(q=>q.dom===i); if(!dq.length) return "";
      return `<div class="ux-tgt-domgrp" data-dom="${i}"><h4 class="ux-grouph">${esc32(dm.pt)}</h4>${dq.map(rowOf).join("")}</div>`;}).join("");
    return gi<2? `<div class="ux-tgt-grp"><div class="eyebrow">${t}</div>${byDom}</div>`
               : `<details class="ux-tgt-grp"><summary>${t}</summary>${byDom}</details>`;}).join("");
  sec.innerHTML=`<div class="section-title"><div class="eyebrow">Cenário-alvo de maturidade · edição</div></div>
    <div class="v32-block" id="ux-tgt-editor">${html}
      <div class="ux-tgt-disc">${esc32(TGT_DISCLAIMER)}</div>
      <div class="ux-ctxactions"><button class="cta" id="ux-tgt-save" type="button">Salvar cenário-alvo</button>
      <button class="btn2" id="ux-tgt-cancel" type="button">Cancelar</button></div></div>`;
  sec.querySelector("#ux-tgt-save").onclick=()=>{
    sec.querySelectorAll("select[data-qid]").forEach(s=>setTarget(s.dataset.qid, s.value===""?null:s.value));
    tgtSection(app); tgtRadarOverlay(app); };
  sec.querySelector("#ux-tgt-cancel").onclick=()=>{ tgtSection(app); tgtRadarOverlay(app); };
  const f=sec.querySelector("select,button"); if(f) f.focus();
}
/* [Q] hook de PDF: retorna "" sem target (nenhuma seção vazia) */
window.__uxTargetPrintHTML = function(){
  if(!tgtHasOverrides()) return "";
  const cur=tgtCurrentProfile(), tgt=computeTargetProfile(tgtEffectiveVector());
  const fmt=v=>v===null?"n/d":v.toFixed(1);
  const cxp=135, cyp=110, Rp=80, ang=i=>-Math.PI/2+i*2*Math.PI/5;
  const P=(i,r)=>`${(cxp+r*Math.cos(ang(i))).toFixed(1)},${(cyp+r*Math.sin(ang(i))).toFixed(1)}`;
  const poly=st=>st.map((s,i)=>P(i,Rp*((s.score===null?0:s.score)/5))).join(" ");
  const grid=[1,2,3,4,5].map(k=>`<polygon points="${DOMS.map((_,i)=>P(i,Rp*k/5)).join(" ")}" fill="none" stroke="#ccc" stroke-width="0.6"/>`).join("");
  const labels=DOMS.map((dm,i)=>{const [x,y]=P(i,Rp+12).split(",");
    return `<text x="${x}" y="${y}" font-size="8" text-anchor="middle" fill="#444">${esc32(dm.pt)}</text>`;}).join("");
  const rows=DOMS.map((dm,i)=>{const c=cur.stats[i].score,t=tgt.stats[i].score;
    const d=(c!==null&&t!==null)?`${t>=c?"+":""}${(t-c).toFixed(1)}`:"n/d";
    return `<tr><td>${esc32(dm.pt)}</td><td>${fmt(c)}</td><td>→</td><td>${fmt(t)}</td><td>${d}</td></tr>`;}).join("");
  const ovs=Object.keys(TARGET_PROFILE.overrides).map(qid=>{const k=tgtKOf(qid),c0=ans[k],t=TARGET_PROFILE.overrides[qid];
    return `<div class="pr-card"><b>${esc32(QS[k].lbl)}</b><div>${(c0!==null&&c0!=="NA")?esc32(QS[k].opts[c0].t)+" → ":"<i>Baseline atual não validado</i> → "}${esc32(QS[k].opts[t].t)}</div>${tgtEnablersHTML(qid)}</div>`;}).join("");
  return `<div class="pr-sec" id="pr-target"><h2>Perfil atual × Cenário-alvo de maturidade</h2>
    <div class="pr-kpis"><div class="pr-kpi"><b>${fmt(cur.overall)}${cur.overall!==null?" / 5":""}</b><span>Atual · ${cur.stage?esc32(cur.stage.pt):"n/d"}</span></div>
    <div class="pr-kpi"><b>${fmt(tgt.overall)}${tgt.overall!==null?" / 5":""}</b><span>Cenário-alvo · ${tgt.stage?esc32(tgt.stage.pt):"n/d"}</span></div>
    <div class="pr-kpi"><b>${Object.keys(TARGET_PROFILE.overrides).length}</b><span>práticas-alvo alteradas</span></div></div>
    <svg viewBox="0 0 270 225" class="pr-radar" role="img" aria-label="Radar comparativo atual e cenário-alvo">${grid}
      <polygon points="${poly(cur.stats)}" fill="rgba(48,127,226,.14)" stroke="#307FE2" stroke-width="1.6"/>
      <polygon points="${poly(tgt.stats)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>${labels}</svg>
    <div class="pr-mut" style="text-align:center">— Perfil atual (azul) · - - Cenário-alvo (verde)</div>
    <table class="pr-doms"><tbody>${rows}</tbody></table>${ovs}
    <div class="pr-card"><i>${esc32(TGT_DISCLAIMER)}</i></div></div>`;
};
if (window.__DEV) Object.assign(window.__DEV, {
  TARGET: TARGET_PROFILE, targetAnswer, setTarget, clearTargetProfile, computeTargetProfile,
  tgtEffectiveVector, revalidateTargets, tgtCurrentProfile
});
