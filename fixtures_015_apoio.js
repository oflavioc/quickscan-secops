/* ============================================================================
   FIXTURES D015 · SUPERFÍCIES DE APOIO — demanda 015-superficies-de-apoio
   Os SETE estados E1..E7 exigidos por `specs/015-superficies-de-apoio/spec.md`
   (§"Estados de sessão exigidos pelas fixtures") e o `d015AssertFixtureStates`.

   ARQUIVO PRÓPRIO — `fixtures_010_vao.js` NÃO é emendado nem importado
   (plan.md §5.1). Ele ancora censos que a 010 mediu por execução; emendá-lo
   obrigaria a recalcular censo alheio, e `require`-lo tornaria aquele arquivo
   alvo da campanha `d015`, acoplando duas demandas pelo artefato mais frágil
   que existe — o que declara estado.

   ==========================================================================
   O CONTRATO DO ASSERT (plan.md §5.2) — a linha divisória
   ==========================================================================
   O assert NÃO vigia o produto: ele prova que a fixture ALCANÇA o estado que
   declara. Por isso só declara o que ESTA DEMANDA NÃO ESCREVE.

     PROIBIDO declarar aqui (apodreceria no verde e abortaria os cinco gates
     antes da primeira alínea): o texto do eyebrow de `#v32prio`; o texto do
     `<h3>` que precede `#pr-sup-prio`; a existência de `[data-pr-gap-fonte]`;
     a contagem de `li` ou o comprimento de `#pr-howto`.

     EXIGIDO: presença/ausência de `#v32prio`; modo legado; visibilidade da
     Camada 1; qids de gap em `#pr-findings` e o RAMO de cada um; presença de
     `#pr-target` e sua ausência LEGÍTIMA em E6; gate de suficiência em E7.

   ==========================================================================
   O JULGADOR NÃO CONCORDA COM A FIXTURE
   ==========================================================================
   Cada fixture carrega um bloco `estado` com valores LITERAIS, medidos por
   execução em 2026-08-31 nesta worktree. `d015AssertFixtureStates` compara o
   runtime contra ESSES literais — nunca contra um objeto derivado da própria
   fixture no mesmo passe. Um assert que compara runtime × objeto recalculado
   é cego a edições da fixture: concorda com ela por construção.
   ========================================================================== */
"use strict";

const FX50 = require("./fixtures_p50.js");

/* Os quatro qids de `QS_GAP_SUPPORT` (`ui_v32.js:1034-1065`). A lista existe
   uma vez só, e é DERIVADA por leitura do runtime em `d015GapSupportQids()`
   quando um gate precisa da fonte canônica — esta cópia serve à construção do
   vetor, e o assert prova que as duas coincidem. */
const D015_GAP_QIDS = ["detection-lifecycle", "logs", "automation", "vulnerability-management"];

/* Qids levados a 0 para produzir os blocos de apresentação `base`/`maturity`
   no papel — as capabilities donas (`soc-governance`, `soc-staffing`,
   `soc-skills`) têm `landscapeEnabled=false`, único caminho para `maturity`
   (`ui_v32.js:presentationOf`). Sem eles, `#pr-sup-maturity` nunca nasce e
   `D015-NOSUB1(c)` compararia ausência contra ausência. */
const D015_MATURITY_QIDS = ["mandate", "governance", "policies", "team-capacity", "training"];

/* Vetor canônico da demanda: 0 nos quatro qids de gap-support e nos cinco que
   produzem base/maturity; 2 no resto. 15/15 confirmadas ⇒ suficiência ABERTA
   em E1..E6 (o fechamento é exclusividade de E7). */
function d015Vec(id) {
  if (D015_GAP_QIDS.indexOf(id) >= 0) return 0;
  if (D015_MATURITY_QIDS.indexOf(id) >= 0) return 0;
  return 2;
}
const D015_ALVOS = { "detection-lifecycle": 2, "logs": 2, "automation": 1, "vulnerability-management": 2 };

/* --------------------------------------------------------------------------
   E1 · legado puro — nada declarado. `isLegacyModeV32()` verdadeiro, Camada 1
   visível, `#v32support` inexistente e `#v32prio` SEM SUJEITO. É o estado que
   `D015-TIT1(f)` tem de NOMEAR em vez de fechar verde por ausência de nó.
   Vetor todo em 2 ⇒ sem gaps ⇒ sem `#pr-findings` e sem `#pr-support`.
   Alvos em 3 porque `setTarget` exige estritamente > o confirmado (INV-5).
-------------------------------------------------------------------------- */
const D015_E1 = {
  id: "E1", nome: "legado puro · nada declarado",
  vec: () => 2,
  targets: { "detection-lifecycle": 3, "logs": 3, "automation": 3, "vulnerability-management": 3 },
  estado: {
    legado: true, v32prio: false, v32support: false, camada1Visivel: true,
    gapSupportQids: [], ramos: [], prTarget: true, suficiencia: true,
    prSupport: false, prFindings: false
  }
};

/* --------------------------------------------------------------------------
   E2 · vão de contexto parcial SEM substituto — Camada 1 visível E `#v32prio`
   presente ao mesmo tempo: o pior caso da redundância de promessa e o estado
   do cliente pós-010. Única declaração: `saasAllowed`, que tira do modo legado
   sem anexar candidato a capability alguma. É a fixture que sustenta a
   não-vacuidade de `D015-NOSUB1(c)` (os TRÊS blocos não vazios de uma vez) e
   de `D015-GOV1(c)` (`#pr-target` com habilitadores a validar).
-------------------------------------------------------------------------- */
const D015_E2 = {
  id: "E2", nome: "vão de contexto parcial · sem substituto",
  vec: d015Vec, priorities: ["automation", "logs"], targets: D015_ALVOS,
  arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: true, v32support: true, camada1Visivel: true,
    gapSupportQids: ["detection-lifecycle", "automation", "logs", "vulnerability-management"],
    ramos: ["NDECL", "NDECL", "NDECL", "NDECL"],
    prTarget: true, suficiencia: true, prSupport: true, prFindings: true
  }
};

/* --------------------------------------------------------------------------
   E3 · vão COM substituto — Camada 1 OCULTA. O motivo original (contraprova de
   `D015-RES1(b)`) caiu com o C4 na errata E1; o estado PERMANECE obrigatório
   por `C1(h)` — é justamente aqui que a arbitragem oculta, e o eyebrow novo
   não pode ser arrastado junto — e pela varredura E1..E7 de `NOSUB1`/`GOV1`.
   Mistura os dois ramos de `qsGapSupportHTML` no MESMO render.
-------------------------------------------------------------------------- */
const D015_E3 = {
  id: "E3", nome: "vão com substituto · Camada 1 oculta",
  vec: d015Vec, priorities: ["automation", "logs"], targets: D015_ALVOS,
  presence: { "security-analytics": "PRESENT" }, arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: true, v32support: true, camada1Visivel: false,
    gapSupportQids: ["detection-lifecycle", "automation", "logs", "vulnerability-management"],
    ramos: ["NDECL", "NDECL", "DECL", "NDECL"],
    prTarget: true, suficiencia: true, prSupport: true, prFindings: true
  }
};

/* --------------------------------------------------------------------------
   E4 · contexto completo, prioridade com gap — as quatro capabilities de
   gap-support declaradas: os QUATRO nós no ramo "declarado". É o par de
   controle de `D015-ANC1(c)`: sem ele, só o ramo "não declarado" teria caso e
   `M5` (emitir a ancoragem apenas em um ramo) sobreviveria.

   E4 CARREGA TAMBÉM O CARD NEUTRO DE PRIORIDADE, e não por elegância: a spec
   nomeia QUATRO estados do bloco `#v32prio` que `D015-NOSUB1(a)` promete
   preservar — card completo, card com serviços, card de encaminhamento e
   CARD NEUTRO. Medido em 2026-08-31: nos sete estados originais NENHUMA
   capability de prioridade caía em `presentationOf === null`, de modo que o
   mutante `M14` (tirar a cláusula `businessPriority.flag` do filtro de
   `prioCaps`) não removia nada e SOBREVIVIA — alínea sem carrasco. A varredura
   de 120 combinações achou o caso: `external-exposure` com `presence` PRESENT
   e o qid `external-surface` respondido em 2 e declarado prioridade entra em
   `#v32prio` SÓ pela cláusula da flag. É o par de controle de `M14`.
-------------------------------------------------------------------------- */
const D015_E4 = {
  id: "E4", nome: "contexto completo · quatro gaps no ramo declarado + card neutro de prioridade",
  vec: d015Vec, priorities: ["automation", "logs", "external-surface"], targets: D015_ALVOS,
  presence: {
    "detection-engineering": "PRESENT", "security-analytics": "PRESENT",
    "security-automation": "PRESENT", "vulnerability-management": "PRESENT",
    "external-exposure": "PRESENT"
  },
  arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: true, v32support: true, camada1Visivel: false,
    gapSupportQids: ["detection-lifecycle", "automation", "logs", "vulnerability-management"],
    ramos: ["DECL", "DECL", "DECL", "DECL"],
    prTarget: true, suficiencia: true, prSupport: true, prFindings: true
  }
};

/* --------------------------------------------------------------------------
   E5 · sem prioridades declaradas — `#v32prio` NÃO nasce e `#pr-sup-prio`
   tampouco. Sujeito ausente, e a alínea que depende dele tem de NOMEAR o
   estado (lição do `D010-INV7`, achado `EA-11`).
-------------------------------------------------------------------------- */
const D015_E5 = {
  id: "E5", nome: "sem prioridades declaradas · #v32prio não nasce",
  vec: d015Vec, targets: D015_ALVOS, arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: false, v32support: true, camada1Visivel: true,
    gapSupportQids: ["detection-lifecycle", "automation", "logs", "vulnerability-management"],
    ramos: ["NDECL", "NDECL", "NDECL", "NDECL"],
    prTarget: true, suficiencia: true, prSupport: true, prFindings: true
  }
};

/* --------------------------------------------------------------------------
   E6 · sem cenário-alvo declarado — `#pr-target` NÃO existe. É a guarda de
   `D015-GOV1(d)`: ausência LEGÍTIMA, que o gate nomeia e não confunde com
   regressão de boundary.
-------------------------------------------------------------------------- */
const D015_E6 = {
  id: "E6", nome: "sem cenário-alvo · #pr-target legitimamente ausente",
  vec: d015Vec, priorities: ["automation", "logs"], arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: true, v32support: true, camada1Visivel: true,
    gapSupportQids: ["detection-lifecycle", "automation", "logs", "vulnerability-management"],
    ramos: ["NDECL", "NDECL", "NDECL", "NDECL"],
    prTarget: false, suficiencia: true, prSupport: true, prFindings: true
  }
};

/* --------------------------------------------------------------------------
   E7 · suficiência FECHADA — uma única resposta confirmada. Nenhuma decisão
   desta demanda pode ampliar publicação sob gate fechado (INV-3). Sem gaps
   publicados: `#pr-findings` não nasce.
-------------------------------------------------------------------------- */
const D015_E7 = {
  id: "E7", nome: "suficiência fechada · nenhuma publicação nova sob gate fechado",
  vec: id => (id === "mandate" ? 2 : null), priorities: ["automation"],
  arch: { saasAllowed: "yes" },
  estado: {
    legado: false, v32prio: true, v32support: true, camada1Visivel: true,
    gapSupportQids: [], ramos: [], prTarget: false, suficiencia: false,
    prSupport: true, prFindings: false
  }
};

const D015_FIXTURES = {
  "E1": D015_E1, "E2": D015_E2, "E3": D015_E3, "E4": D015_E4,
  "E5": D015_E5, "E6": D015_E6, "E7": D015_E7
};
const D015_ESTADOS = ["E1", "E2", "E3", "E4", "E5", "E6", "E7"];

/* ===================== aplicação sobre o runtime real ===================== */

/* Contexto pelo EDITOR canônico: abre em `#v32cta`, mexe nos mesmos controles
   do facilitador, grava em `#v32save`. Cada passo falha ALTO se o controle
   sumir — controle ausente significa que a fixture deixou de alcançar a
   superfície, e isso não pode virar gate vacuoso. */
function d015ApplyContext(w, d, fx) {
  if (!fx.presence && !fx.arch) return;
  const cta = d.querySelector("#v32cta");
  if (!cta) throw new Error(fx.id + ": #v32cta ausente — editor de contexto inalcançável");
  cta.click();
  if (fx.presence) Object.keys(fx.presence).forEach(capId => {
    const sel = d.getElementById("v32-pres-" + capId);
    if (!sel) throw new Error(fx.id + ": select de presence ausente para " + capId);
    sel.value = fx.presence[capId];
    /* `onchange` RELÊ o rascunho e repinta o editor: referência a nó do editor
       obtida antes desta linha fica obsoleta — por isso arquitetura vem depois. */
    sel.dispatchEvent(new w.Event("change", { bubbles: true }));
  });
  if (fx.arch) Object.keys(fx.arch).forEach(k => {
    const sel = d.getElementById("v32-arch-" + k);
    if (!sel) throw new Error(fx.id + ": select de arquitetura ausente para " + k);
    sel.value = fx.arch[k];
  });
  const save = d.querySelector("#v32save");
  if (!save) throw new Error(fx.id + ": #v32save ausente — save transacional inalcançável");
  save.click();
  const box = d.querySelector("#v32errors");
  if (box && !box.classList.contains("v32-hidden"))
    throw new Error(fx.id + ": save recusado por validateConfigV32 — " +
      (box.textContent || "").replace(/\s+/g, " ").trim());
}

/* Vetor + prioridades + alvos + contexto, pelos owners canônicos. Nenhum
   derivado é escrito e a suficiência não é tocada. O segundo `showResults()`
   existe porque o save só repinta o painel V3.2: o render completo é a rota
   que o usuário percorre e a que os gates observam. */
function d015ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  FX50.P50_QIDS.forEach(id => {
    const v = fx.vec(id);
    if (v !== null && v !== undefined) w.__DEV.setAnswerById(id, v);
  });
  if (fx.priorities) w.__DEV.setPriorities(fx.priorities);
  if (fx.targets) Object.keys(fx.targets).forEach(qid => {
    if (w.__DEV.setTarget(qid, fx.targets[qid]) !== true)
      throw new Error(fx.id + ": setter canônico recusou alvo " + qid + "=" + fx.targets[qid]);
  });
  w.__DEV.showResults();
  d015ApplyContext(w, d, fx);
  w.__DEV.showResults();
  return fx;
}

/* ==================== leitura de estado fora da `window` ================== */
/* `MAP`, `QS` e `ans` são `const` de topo de script clássico: existem no
   registro declarativo global, NÃO em `window`. `window.eval` é indireto e
   roda no escopo global, então os enxerga. É LEITURA. Isolado aqui para que o
   custo seja auditável num lugar só. */
function d015Eval(w, expr) {
  if (typeof w.eval !== "function") throw new Error("d015Eval: window.eval indisponível neste runtime");
  return w.eval(expr);
}
/* Os qids de `QS_GAP_SUPPORT` lidos do RUNTIME — fonte canônica, exportada em
   `ui_v32.js:1386`. A cópia local existe para montar o vetor; o assert prova
   que as duas coincidem, para que a fixture não passe a medir outro conjunto
   em silêncio se a tabela mudar. */
function d015GapSupportQids(w) {
  const t = d015Eval(w, "typeof (window.__DEV && window.__DEV.QS_GAP_SUPPORT)");
  if (t !== "object")
    throw new Error("d015GapSupportQids: __DEV.QS_GAP_SUPPORT inalcançável (typeof " + t + ")");
  return JSON.parse(d015Eval(w, "JSON.stringify(Object.keys(window.__DEV.QS_GAP_SUPPORT))"));
}
/* O VEREDITO DE SUFICIÊNCIA, lido da MESMA expressão que o engine consome em
   `V32.configure({assessmentSufficient})` (HTML `V32_ADAPTER`). Não está em
   `window.__DEV` — `ui_v32.js:1383` reatribui `window.__DEV` e o bloco dele
   não reexporta a ponte; `dataSufficiency`, `DOMS` e `domStat` são de topo de
   script clássico. Reimplementar o predicado aqui tornaria a asserção
   equivalente por construção (defeito que a errata E5 da 010 removeu do C9);
   função ausente falha ALTO e nunca vira "não medi". */
function d015Sufficient(w) {
  ["dataSufficiency", "domStat"].forEach(f => {
    const t = d015Eval(w, "typeof " + f);
    if (t !== "function") throw new Error("d015Sufficient: " + f + " inalcançável (typeof " + t + ")");
  });
  if (d015Eval(w, "typeof DOMS") !== "object")
    throw new Error("d015Sufficient: DOMS inalcançável");
  return !!d015Eval(w, "dataSufficiency(DOMS.map(function(_,i){return domStat(i);}))");
}

/* ===================== o estado declarado, provado ======================= */

const d015Txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");

/* Ramo de `qsGapSupportHTML` observado no nó, decidido pelo texto do
   `[data-pr-gap-why]` — que é da 5.1 e NÃO é escrito por esta demanda, logo
   serve de discriminante sem pinar nada que a 015 possa mexer.
   `ui_v32.js:1090` (não declarado) × `:1096` (declarado). */
function d015RamoDe(no) {
  const why = no.querySelector("[data-pr-gap-why]");
  if (!why) return "SEM-WHY";
  const t = d015Txt(why);
  if (/Apareceu porque o gap acima foi observado/.test(t)) return "DECL";
  if (/Contexto tecnológico não declarado para esta capability/.test(t)) return "NDECL";
  return "RAMO-DESCONHECIDO";
}

/* Camada 1 visível: eyebrow congelado presente e não oculto. MESMA propriedade
   que `U1` (`tests_ui_m31.js:38-39`) mede, transcrita — não lida de lá em
   execução (R10 §6). */
function d015Camada1Visivel(d) {
  return Array.from(d.querySelectorAll(".section-title .eyebrow"))
    .some(e => (e.textContent || "").includes("Como a Fortinet pode apoiar") && !e.closest(".v32-hidden"));
}

/* Prova que a fixture ALCANÇOU o estado declarado. Compara o runtime contra os
   LITERAIS de `fx.estado` — nunca contra um objeto recalculado no mesmo passe.
   Divergência falha ALTO, nomeando estado, campo, observado e declarado.
   `pr` é o host do relatório impresso já montado pelo chamador. */
function d015AssertFixtureStates(w, d, pr, fx) {
  const e = fx.estado, erros = [];
  const cmp = (campo, obtido, esperado) => {
    const a = JSON.stringify(obtido), b = JSON.stringify(esperado);
    if (a !== b) erros.push(campo + ": obtido " + a + " · declarado " + b);
  };

  cmp("legado", w.__DEV.V32.isLegacyModeV32(), e.legado);
  cmp("#v32prio", !!d.querySelector("#v32prio"), e.v32prio);
  cmp("#v32support", !!d.querySelector("#v32support"), e.v32support);
  cmp("camada1Visivel", d015Camada1Visivel(d), e.camada1Visivel);
  cmp("suficiencia(dataSufficiency)", d015Sufficient(w), e.suficiencia);

  if (!pr) erros.push("#v32-print-report ausente — o papel não foi montado e nenhum estado de papel seria medido");
  else {
    const gs = Array.from(pr.querySelectorAll("[data-pr-gap-support]"));
    cmp("gapSupportQids", gs.map(n => n.getAttribute("data-pr-gap-qid")), e.gapSupportQids);
    cmp("ramos", gs.map(d015RamoDe), e.ramos);
    cmp("#pr-target", !!pr.querySelector("#pr-target"), e.prTarget);
    cmp("#pr-support", !!pr.querySelector("#pr-support"), e.prSupport);
    cmp("#pr-findings", !!pr.querySelector("#pr-findings"), e.prFindings);
  }

  /* A tabela do runtime e a cópia local desta fixture têm de nomear o MESMO
     conjunto — senão o vetor deixaria de produzir os gaps que a fixture diz
     produzir, e todo censo de gap-support viraria medida de outra coisa. */
  const runtimeQids = d015GapSupportQids(w).slice().sort();
  const locais = D015_GAP_QIDS.slice().sort();
  if (JSON.stringify(runtimeQids) !== JSON.stringify(locais))
    erros.push("QS_GAP_SUPPORT do runtime " + JSON.stringify(runtimeQids) +
      " ≠ cópia da fixture " + JSON.stringify(locais));

  /* Pré-condição ESTRUTURAL de `D015-TIT1(g)`: os dois escopos de unicidade
     (tela `#app` e papel `#v32-print-report`) têm de ser DISJUNTOS. Medido em
     2026-08-31: `#v32-print-report` é filho direto de `body`. Se um dia entrar
     em `#app`, a alínea (g) passaria a somar as duas superfícies e a unicidade
     de tela viraria outra medida — em silêncio. Aqui isso é FALHA NOMEADA. */
  if (pr && pr.closest("#app"))
    erros.push("#v32-print-report passou a viver DENTRO de #app — os escopos de unicidade de " +
      "D015-TIT1(g) deixaram de ser disjuntos e a alínea mediria outra coisa");

  if (erros.length)
    throw new Error("fixture " + fx.id + " (" + fx.nome + ") NÃO alcançou o estado declarado · " +
      erros.join("  ⟂  "));
  return true;
}

module.exports = {
  D015_FIXTURES, D015_ESTADOS, D015_GAP_QIDS, D015_MATURITY_QIDS, D015_ALVOS,
  d015ApplyResults, d015ApplyContext, d015AssertFixtureStates,
  d015Eval, d015GapSupportQids, d015Sufficient, d015RamoDe, d015Camada1Visivel, d015Txt
};
