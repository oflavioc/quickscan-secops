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
/* ==========================================================================
   ERRATA DA AUDITORIA EXTERNA · B-01 · ponte para a decisão canônica.
   `ui_v32.js` é uma IIFE: `publishableStats()` é servida por `window.__V32UI`,
   a mesma ponte que já serve `iconFor()` e `ARCH_FIELDS`. Este módulo NÃO
   reimplementa a regra. Se a ponte não existir, ele FALHA — publicar sem gate
   é pior do que não publicar.
   ========================================================================== */
function tgtPublishable(stats, suff){
  const f = (typeof window!=="undefined" && window.__V32UI) ? window.__V32UI.publishableStats : null;
  if (typeof f !== "function")
    throw new Error("V3.2 TARGET: publishableStats indisponível — publicação por domínio bloqueada");
  return f(stats, suff);
}
/* ==========================================================================
   ERRATA FINAL · ALTO-1 · A COMPARAÇÃO É INDIVISÍVEL.

   Reprovação do parecer independente 70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120
   (§8.2, §9.2, §10 ALTO-1): a coluna Alvo respondia ao SEU próprio gate
   (`tgt.suff`, calculado por `computeTargetProfile()` sobre o vetor efetivo).
   Bastava o facilitador declarar alvos suficientes para que a comparação
   publicasse metade de si mesma sob gate canônico FECHADO — score por domínio,
   agregado e NOME DE ESTÁGIO — em tela e no papel, com polígono materialmente
   pintado no PDF, enquanto a nota da mesma página negava a publicação.

   Regra normativa desta errata:

       comparisonPublishable = current.suff === true

   `target.suff` não abre a comparação sozinho. Esta função NÃO reimplementa a
   regra de suficiência: consome `cur.suff`, produzido por `computeTargetProfile()`
   sobre o vetor de respostas ATUAIS — a mesma aritmética canônica que governa
   `#pr-maturity` e a Camada 5. É a decisão ÚNICA de todas as superfícies da
   comparação: KPI, estágio, tabela por domínio, gaps, radar de tela, radar de
   papel, árvore acessível e PDF.

   O cálculo permanece intocado: `computeTargetProfile()` continua puro e
   byte-idêntico, o cenário-alvo continua salvo em `TARGET_PROFILE.overrides`,
   editável, e nada de current/suficiência/findings é modificado.
   ========================================================================== */
function tgtComparisonPublishable(cur){ return !!cur && cur.suff === true; }
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
  /* ==========================================================================
     ERRATA DA AUDITORIA EXTERNA · B-01 · publicabilidade também aqui.
     A comparação Atual × Alvo publica SCORE POR DOMÍNIO. Ela consumia
     `cur.stats`/`tgt.stats` crus e, com o gate canônico FECHADO, imprimia
     números que a caixa de domínios da mesma tela recusa a publicar. Passa a
     consumir `publishableStats()` — a mesma decisão do relatório e da tela.
     O cálculo não muda: `computeTargetProfile()` continua puro e byte-idêntico,
     e Target continua sem contaminar Current.
     ========================================================================== */
  /* ERRATA FINAL · ALTO-1 · uma decisão só, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);
  const rows=DOMS.map((dm,i)=>{
    const c=curPub[i].score,t=tgtPub[i].score;
    const d=(c!==null&&t!==null)?`${t>=c?"+":""}${(t-c).toFixed(1)}`:"n/d";
    /* sob gate fechado não há seta: seta é sinal de comparação, e não há comparação a publicar */
    return `<tr data-dom="${i}"><td class="ux-tgt-dom">${esc32(dm.pt)}</td><td>${fmt(c)}</td><td>${cmpPub?"→":""}</td><td>${fmt(t)}</td><td class="ux-tgt-delta">${d}</td></tr>`;}).join("");
  /* ERRATA FINAL · ALTO-1 · KPI, estágio e delta seguem a MESMA decisão da tabela:
     nenhuma metade da comparação publica agregado ou nome de estágio com o gate
     canônico do PERFIL ATUAL fechado. */
  const pubO=v=>cmpPub?v:null, pubS=p=>(cmpPub&&p.stage)?esc32(p.stage.pt):"n/d";
  const curO=pubO(cur.overall), tgtO=pubO(tgt.overall);
  const delta=(curO!==null&&tgtO!==null)?` <span class="ux-tgt-delta">${tgtO>=curO?"+":""}${(tgtO-curO).toFixed(1)}</span>`:"";
  const gateNote=cmpPub?"":`<div class="ux-mut ux-tgt-nopub" data-p52-nopub="target">O cenário-alvo está salvo. A comparação será apresentada quando o perfil atual tiver evidência suficiente. Evidência insuficiente: até o gate canônico abrir, nenhum score, estágio, valor por domínio ou delta é publicado nesta comparação, de nenhum dos dois lados. As práticas-alvo declaradas continuam listadas, uma a uma, abaixo.</div>`;
  /* [D009 · B5] o conjunto de práticas sem contexto declarado é derivado NO MESMO
     PASSE que a lista renderizada — nunca por segunda varredura e nunca do DOM;
     alvo removido por `revalidateTargets` não deixa órfão no aviso. */
  const semCtx=[];
  const ovList=Object.keys(TARGET_PROFILE.overrides).map(qid=>{
    const k=tgtKOf(qid), cur0=ans[k], t=TARGET_PROFILE.overrides[qid];
    const base=(cur0===null||cur0==="NA")?`<span class="ux-mut">Baseline atual não validado — delta local n/d.</span>`
      :`${esc32(QS[k].opts[cur0].t)} · ${SCORES[cur0].toFixed(1)} → `;
    return `<li class="ux-tgt-ov" data-qid="${esc32(qid)}"><b>${esc32(QS[k].lbl)}</b><br>${base}${esc32(QS[k].opts[t].t)} · ${SCORES[t].toFixed(1)}${(cur0!==null&&cur0!=="NA")?` <span class="ux-tgt-delta">+${(SCORES[t]-SCORES[cur0]).toFixed(1)}</span>`:""}${tgtEnablersHTML(qid,semCtx)}</li>`;}).join("");
  const absNote=tgtAbsenceHTML(semCtx,true);
  sec.innerHTML = `<div class="section-title"><div class="eyebrow">Perfil atual × Cenário-alvo de maturidade</div></div>
    <div class="v32-block" id="ux-tgt-cmp">${notice}
      <div class="ux-tgt-kpis">
        <div class="ux-tgt-kpi"><span>Atual</span><b>${fmt(curO)}${curO!==null?" / 5":""}</b><i>${pubS(cur)}</i></div>
        <div class="ux-tgt-kpi ux-tgt-kpi-t"><span>Cenário-alvo</span><b>${fmt(tgtO)}${tgtO!==null?" / 5":""}${delta}</b><i>${pubS(tgt)}</i></div>
        <div class="ux-tgt-kpi"><span>Práticas-alvo alteradas</span><b>${nOv}</b><i>explícitas</i></div>
      </div>
      <div class="ux-tgt-legend">— Perfil atual&nbsp;&nbsp;&nbsp;- - Cenário-alvo</div>
      ${gateNote}
      <table class="ux-tgt-table"><tbody>${rows}</tbody></table>
      ${absNote}
      <div class="ux-tgt-ovs"><div class="eyebrow">Práticas-alvo definidas</div><ul>${ovList}</ul></div>
      <div class="ux-tgt-disc">${esc32(TGT_DISCLAIMER)}</div>
      <div class="ux-ctxactions">
        <button class="btn2" id="ux-tgt-edit" type="button">Editar cenário-alvo</button>
        <button class="btn2" id="ux-tgt-clear" type="button">Limpar cenário-alvo</button>
      </div></div>`;
  sec.querySelector("#ux-tgt-edit").onclick=()=>{ tgtNotices=[]; tgtEditor(app); };
  /* [D009 · C14] o aviso é acionável na TELA: delega ao controle CANÔNICO do
     editor de contexto (`#v32cta`, de `ui_v32.js`) em vez de reimplementar a
     rota. Ausente o controle, o aviso permanece informativo — nunca inventa
     caminho próprio. */
  const absCta=sec.querySelector("#ux-tgt-absctx");
  if(absCta) absCta.onclick=()=>{
    const cta=document.getElementById("v32cta"); if(!cta) return;
    if(typeof cta.scrollIntoView==="function") cta.scrollIntoView({block:"center"});
    cta.click();
  };
  sec.querySelector("#ux-tgt-clear").onclick=()=>uxModal({title:"Limpar cenário-alvo?",
    body:"Somente o cenário-alvo será removido. Avaliação, prioridades, contexto tecnológico e recomendações permanecem.",
    confirmLabel:"Limpar cenário-alvo", origin:sec.querySelector("#ux-tgt-clear"),
    onConfirm:()=>{ clearTargetProfile(); tgtSection(app); tgtRadarOverlay(app); }});
  tgtRadarOverlay(app);
}
/* ==========================================================================
   DEMANDA 009 · §5 · O CARD DE PRÁTICA-ALVO TEM QUATRO ESTADOS, NÃO UM.

   `tgtEnablersHTML()` cobria com UMA frase estados que não são o mesmo: quem
   declarou o contexto e nada aderiu, quem não declarou nada, e quem não tem
   contexto algum a declarar. O estado é decidido sobre o MODELO CANÔNICO
   (`V32.CAPABILITIES` · `V32.TECH_LANDSCAPE`) — nunca sobre texto renderizado,
   nunca sobre atributo escrito por outro módulo (R9 §3):

     S1 · há habilitadores ............ a linha de hoje, INTOCADA
     S2 · sem habilitadores, landscape aplicável e `presence === "UNSET"`
          ............................. a linha NÃO renderiza e a prática entra
                                        no aviso único de ausência
     S3 · sem habilitadores, contexto INFORMADO
          ............................. mantém a frase substantiva de hoje
     S4 · sem habilitadores e capability com `landscapeEnabled: false`
          (`soc-governance`, `soc-staffing`, `soc-skills` — `mandate`,
          `governance`, `policies`, `team-capacity`, `training`)
          ............................. mantém a frase de S3 e NUNCA entra no
                                        aviso: não há contexto a informar

   Contexto não informado não é ausência de tecnologia. Sob S2 o relatório se
   CALA — não afirma que falta ferramenta e não conclui sobre processo, pessoas
   ou governança. É a mesma disciplina de INV-2: dado ausente não vira medida.
   ========================================================================== */
function tgtEnablerState(qid, nItems){
  if (nItems > 0) return "S1";
  const caps=Object.keys(V32.CAPABILITIES).filter(id=>(V32.CAPABILITIES[id].questionIds||[]).includes(qid));
  if (caps.length !== 1) return "S3";                           /* fora do modelo canônico: jamais alega "não informado" */
  if (V32.CAPABILITIES[caps[0]].landscapeEnabled !== true) return "S4";
  const L=V32.TECH_LANDSCAPE[caps[0]];
  return (!L || L.presence==="UNSET") ? "S2" : "S3";
}
/* [D009 · C14] AVISO ÚNICO de ausência — um nó por render, dentro do card de
   comparação e antes da lista de práticas. `qids` chega pronto do mesmo passe
   da lista (B5). Declara que o contexto não foi informado, QUANTAS e QUAIS
   práticas ficaram sem refino. Na TELA acompanha o caminho para o editor de
   contexto; no PAPEL é a MESMA frase, sem controle. */
/* [D009 · rodada 2 · ESCOPO DA ABERTURA] A frase tinha um só ramo e abria sempre
   em escopo de SESSÃO ("não foi informado nesta sessão"). Isso é verdade quando
   NADA foi declarado e FALSO no caso parcial — lá o contexto foi informado, só
   não para as práticas nomeadas, e o próprio relatório desmente a frase duas
   seções abaixo, onde `#v32decl` lista as capabilities declaradas. É o mesmo
   defeito que esta demanda corrige em `:166`, um degrau acima: afirmar mais do
   que a sessão sustenta.
   O predicado do ramo é o MESMO de `#v32decl` (`ui_v32.js:246`): há declaração
   quando alguma capability sai de UNSET. Estado canônico do engine, lido — não
   recalculado nem redefinido aqui. Os dois ramos continuam declarando
   não-informação (a regra que `D009-UNS1` mede); o que muda é o ALCANCE. */
function tgtCtxDeclaradoNaSessao(){
  const L=V32.TECH_LANDSCAPE||{};
  return Object.keys(L).some(id=>L[id] && L[id].presence!=="UNSET");
}
function tgtAbsenceHTML(qids, isScreen){
  if (!qids || !qids.length) return "";
  const nomes=qids.map(qid=>tgtKOf(qid)).filter(k=>k>=0).map(k=>esc32(QS[k].lbl));
  if (!nomes.length) return "";
  const n=nomes.length, uma=n===1;
  const frase=tgtCtxDeclaradoNaSessao()
    ? `O contexto tecnológico não foi informado para ${n} ${uma?"prática-alvo":"práticas-alvo"}. Por isso ${uma?"ela ficou":"elas ficaram"} sem refino por habilitadores já identificados: ${nomes.join("; ")}.`
    : `O contexto tecnológico não foi informado nesta sessão. Por isso ${n} ${uma?"prática-alvo ficou":"práticas-alvo ficaram"} sem refino por habilitadores já identificados: ${nomes.join("; ")}.`;
  if (!isScreen) return `<div class="pr-mut" data-ux-absence="target-enablers">${frase}</div>`;
  /* [D009 · rodada 2 · RÓTULO DERIVADO] o caminho da TELA já delegava o CLIQUE ao
     controle canônico (`#v32cta`, de `ui_v32.js`); o RÓTULO estava fixo em
     "Editar…". Numa sessão limpa o aviso mandava "Editar" logo acima de um botão
     que dizia "Adicionar" (`ui_v32.js:240` × `:294`) — atrito na exata rota de
     conversão que o aviso existe para abrir. Agora o rótulo vem do mesmo nó a
     que o clique é delegado; o dono do rótulo continua sendo `ui_v32.js`.
     Sob guarda: sem controle (ou sem rótulo) NÃO nasce botão e o aviso permanece
     informativo — nunca inventa caminho nem rótulo próprio. */
  const cta=(typeof document!=="undefined") ? document.getElementById("v32cta") : null;
  const rotulo=cta ? String(cta.textContent||"").replace(/\s+/g," ").trim() : "";
  const caminho=rotulo ? ` <button class="btn2" id="ux-tgt-absctx" type="button">${esc32(rotulo)}</button>` : "";
  return `<div class="ux-mut" data-ux-absence="target-enablers"><span>${frase}</span>${caminho}</div>`;
}
function tgtEnablersHTML(qid, semCtx){                          /* [L] SOMENTE itens já existentes no ctx atual */
  const caps=Object.keys(V32.CAPABILITIES).filter(id=>(V32.CAPABILITIES[id].questionIds||[]).includes(qid));
  const ctx=V32.buildRecommendationContext().contexts;          /* mesmo payload congelado (byte-idêntico, testado) */
  const MODE_PT={DIRECT:"apoio direto",CONTEXTUAL:"apoio contextual",VALIDATE:"validar"};
  const items=[];
  caps.forEach(cid=>{ const c=ctx[cid]; if(!c) return;
    (c.candidates||[]).forEach(x=>items.push({id:x.itemId, n:(V32.OFFERINGS[x.itemId]||{}).name||x.itemId, m:MODE_PT[c.supportMode]||"contexto", kind:"candidate"}));
    (c.services||[]).forEach(s=>items.push({id:s.serviceId, n:(V32.SERVICES[s.serviceId]||{}).name||s.serviceId, m:"serviço", kind:"service"}));});
  if(!items.length){
    /* [D009 · §5] S2 se cala e delega ao aviso único; S3 e S4 mantêm a frase. */
    if (tgtEnablerState(qid, 0)==="S2"){ if (semCtx) semCtx.push(qid); return ""; }
    return `<div class="ux-tgt-en ux-mut">Nenhum habilitador tecnológico específico foi identificado pelo contexto atual. A evolução desta prática pode depender principalmente de processo, pessoas, governança ou de aprofundamento adicional.</div>`;
  }
  return `<div class="ux-tgt-en"><i>Possíveis habilitadores já identificados neste Quickscan:</i><div class="ux-tgt-enablers">${items.map(it=>`<span class="ux-tgt-enabler" data-eid="${esc32(it.id)}">${window.__V32UI.iconFor(it.id, it.n)}<span class="ux-tgt-enabler-name">${esc32(it.n)}</span><span class="ux-tgt-mode">${esc32(it.m)}</span></span>`).join("")}</div></div>`;
}
function tgtRadarOverlay(app){                                  /* [I] geometria EXATA extraída dos eixos legados */
  const svg=app.querySelector("svg.radar"); if(!svg) return;
  const old=svg.querySelector(".ux-target-shape"); if(old) old.remove();
  const lg=document.getElementById("ux-tgt-radarlegend"); if(lg) lg.remove();
  if(!tgtHasOverrides()){ svg.setAttribute("aria-label","Radar de maturidade — perfil atual"); return; }
  /* ERRATA FINAL · ALTO-1 · o overlay é a mesma comparação, em outra superfície.
     Sob gate canônico fechado ele não é criado. Não se apoia em CSS: hoje a
     superfície legada de tela está oculta por `body.v32-print-mode .wrap`, e uma
     proteção que dependesse disso deixaria a decisão fora da origem da publicação. */
  const curOv=tgtCurrentProfile();
  if(!tgtComparisonPublishable(curOv)){ svg.setAttribute("aria-label","Radar de maturidade — perfil atual"); return; }
  const axes=Array.from(svg.querySelectorAll("line.axis")); if(axes.length!==5) return;
  const tgt=computeTargetProfile(tgtEffectiveVector());
  /* [UNSET-GEOM] eixo sem alvo efetivo (current UNSET e sem override) não vira vértice zero:
     o ponto é OMITIDO do polígono do cenário-alvo, como no perfil atual. */
  const pts=axes.map((ax,i)=>{
    if(tgt.stats[i].score===null) return null;
    const cx=+ax.getAttribute("x1"), cy=+ax.getAttribute("y1");
    const x2=+ax.getAttribute("x2"), y2=+ax.getAttribute("y2");
    const s=tgt.stats[i].score/5;
    return `${(cx+(x2-cx)*s).toFixed(2)},${(cy+(y2-cy)*s).toFixed(2)}`;}).filter(p=>p!==null).join(" ");
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
  /* [UNSET-GEOM] mesma regra no PDF, para os DOIS polígonos (atual e alvo): domínio sem score
     não recebe vértice. O tracejado verde continua sendo encoding exclusivo do cenário-alvo. */
  const poly=st=>st.map((s,i)=>s.score===null?null:P(i,Rp*(s.score/5))).filter(p=>p!==null).join(" ");
  /* ERRATA DA AUDITORIA EXTERNA · B-01 · o papel usa a MESMA decisão da tela.
     ERRATA FINAL · ALTO-1 · e essa decisão é a do PERFIL ATUAL, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);
  const pubO=v=>cmpPub?v:null;
  const curO=pubO(cur.overall), tgtO=pubO(tgt.overall);
  const ndT=DOMS.map((dm,i)=>(curPub[i].score===null||tgtPub[i].score===null)?dm.pt:null).filter(Boolean);
  const ndNote=!cmpPub
    ? `<div class="pr-mut pr-radar-nd" data-pr-nopub="target">O cenário-alvo está salvo. A comparação será apresentada quando o perfil atual tiver evidência suficiente. Evidência insuficiente: até o gate canônico abrir, nenhum score, estágio, valor por domínio ou delta é publicado nesta comparação, de nenhum dos dois lados. As práticas-alvo declaradas continuam listadas uma a uma. n/d significa não avaliado, nunca zero.</div>`
    : (ndT.length?`<div class="pr-mut pr-radar-nd">Sem ponto no radar por ausência de avaliação (n/d): ${esc32(ndT.join(" · "))}</div>`:"");
  const grid=[1,2,3,4,5].map(k=>`<polygon points="${DOMS.map((_,i)=>P(i,Rp*k/5)).join(" ")}" fill="none" stroke="#ccc" stroke-width="0.6"/>`).join("");
  const labels=DOMS.map((dm,i)=>{const [x,y]=P(i,Rp+12).split(",");
    return `<text x="${x}" y="${y}" font-size="8" text-anchor="middle" fill="#444">${esc32(dm.pt)}</text>`;}).join("");
  const rows=DOMS.map((dm,i)=>{const c=curPub[i].score,t=tgtPub[i].score;
    const d=(c!==null&&t!==null)?`${t>=c?"+":""}${(t-c).toFixed(1)}`:"n/d";
    return `<tr><td>${esc32(dm.pt)}</td><td>${fmt(c)}</td><td>${cmpPub?"→":""}</td><td>${fmt(t)}</td><td>${d}</td></tr>`;}).join("");
  /* [D009 · B5] mesmo passe da lista, também no papel. */
  const semCtx=[];
  const ovs=Object.keys(TARGET_PROFILE.overrides).map(qid=>{const k=tgtKOf(qid),c0=ans[k],t=TARGET_PROFILE.overrides[qid];
    return `<div class="pr-card"><b>${esc32(QS[k].lbl)}</b><div>${(c0!==null&&c0!=="NA")?esc32(QS[k].opts[c0].t)+" → ":"<i>Baseline atual não validado</i> → "}${esc32(QS[k].opts[t].t)}</div>${tgtEnablersHTML(qid,semCtx)}</div>`;}).join("");
  const absNote=tgtAbsenceHTML(semCtx,false);                   /* [D009 · C14] a MESMA frase da tela, sem controle */
  return `<div class="pr-sec" id="pr-target"><h2>Perfil atual × Cenário-alvo de maturidade</h2>
    <div class="pr-kpis"><div class="pr-kpi"><b>${fmt(curO)}${curO!==null?" / 5":""}</b><span>Atual · ${(cmpPub&&cur.stage)?esc32(cur.stage.pt):"n/d"}</span></div>
    <div class="pr-kpi"><b>${fmt(tgtO)}${tgtO!==null?" / 5":""}</b><span>Cenário-alvo · ${(cmpPub&&tgt.stage)?esc32(tgt.stage.pt):"n/d"}</span></div>
    <div class="pr-kpi"><b>${Object.keys(TARGET_PROFILE.overrides).length}</b><span>práticas-alvo alteradas</span></div></div>
    <svg viewBox="0 0 270 225" class="pr-radar" role="img" aria-label="Radar comparativo atual e cenário-alvo">${grid}
      <polygon points="${poly(curPub)}" fill="rgba(48,127,226,.14)" stroke="#307FE2" stroke-width="1.6"/>
      <polygon points="${poly(tgtPub)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>${labels}</svg>
    <div class="pr-mut" style="text-align:center">— Perfil atual (azul) · - - Cenário-alvo (verde)</div>
    ${ndNote}
    <table class="pr-doms"><tbody>${rows}</tbody></table>${absNote}${ovs}
    <div class="pr-card"><i>${esc32(TGT_DISCLAIMER)}</i></div></div>`;
};
if (window.__DEV) Object.assign(window.__DEV, {
  TARGET: TARGET_PROFILE, targetAnswer, setTarget, clearTargetProfile, computeTargetProfile,
  tgtEffectiveVector, revalidateTargets, tgtCurrentProfile
});
