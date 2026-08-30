/* ============================================================================
   FIXTURES D010 — DEMANDA 010 · recomendação sem vão
   Namespace fechado D010-F*. Locais à demanda: `fixtures_p52.js` e
   `fixtures_p50.js` são artefatos de outra fase e NÃO são alterados
   (spec §"Critérios de aceite → gates", bloco "Fixtures"). Este arquivo é
   fixture, não suíte: não entra em `expected_suites.json` e não imprime
   PASS/FAIL — quem julga são os gates de `tests_010_vao.js`.

   Existem porque nenhuma fixture 5.0/5.2/D009 alcança os quatro estados que a
   demanda precisa exercitar:
     · D010-F1  — o VÃO canônico: contexto declarado, nenhuma capability
                  declarada, e a Camada 1 congelada oculta sem substituto;
     · D010-F1b — o mesmo vão no ramo `!hasPrio` ("Como a Fortinet pode apoiar
                  agora"), que é outro título e outro bloco contíguo;
     · D010-F2  — o par de C8: HÁ substituto (whitespace com candidatos DIRECT)
                  convivendo com práticas-alvo sem contexto;
     · D010-F3  — gate de suficiência FECHADO com a Camada 1 nomeando produto.

   ==========================================================================
   OWNERS CANÔNICOS — a regra que este arquivo não quebra
   ==========================================================================
   Todo estado é aplicado pelos owners reais do runtime:
     · respostas    -> `__DEV.setAnswerById` (via `FX50.p50ApplyVec`)
     · prioridades  -> `__DEV.setPriorities`
     · alvos        -> `__DEV.setTarget`     (via `FX50.p50ApplyTargets`)
     · contexto     -> EDITOR de contexto (`#v32cta` → selects → `#v32save`)
   NENHUM derivado é escrito à mão. Em particular, o eixo de PRESENCE desta
   demanda NÃO usa `FX50.p50ApplyPresence()` — que grava direto em
   `V32.TECH_LANDSCAPE` —, e sim o editor com o save transacional, que é o
   único caminho que passa por `validateConfigV32()` e pela invariante M43.
   Se o save for recusado, o erro aparece AQUI (`#v32errors` visível), nunca
   silenciosamente dentro de um gate.

   Leitura de estado canônico é outra coisa: `MAP`, `PRODUCTS` e `ans` são
   `const` de escopo de script no HTML congelado — não existem em `window`
   (medido: `typeof w.MAP === "undefined"`, `w.eval("typeof MAP") === "object"`).
   O único acesso é `window.eval`, e ele é de LEITURA. Está isolado em
   `d010Eval()` para que o custo apareça em um lugar só.

   ==========================================================================
   POR QUE O VETOR É O QUE É
   ==========================================================================
   15 respostas confirmadas ⇒ suficiência ABERTA (`confirmed>=10` e `n>=2` por
   domínio). Nível 0 nos quatro qids de gap (`automation`, `endpoint`,
   `network-visibility`, `external-surface`) porque é onde a demanda mede: são
   os quatro alvos, todos em S2, todos com `MAP[qid].lv[0].c` não vazio.
   Os 11 demais ficam em 2: no nível 2 nenhuma pergunta pontua severidade, logo
   não há gap, logo o engine não anexa serviço por `hasGap` — e as quatro
   práticas medidas ficam sozinhas no palco. O plano registra que o veredito de
   arbitragem é o mesmo com 2, 1 ou 0; conferido por execução nesta tarefa
   (ver `D010_VACUIDADES_CONHECIDAS`, que também registra o que 1/0 mudariam).
   ========================================================================== */
"use strict";

const FX50 = require("./fixtures_p50.js");

const N = FX50.P50_QIDS.length;
const K = qid => {
  const k = FX50.P50_QIDS.indexOf(qid);
  if (k < 0) throw new Error("fixtures_010: qid fora do question bank canônico: " + qid);
  return k;
};

/* Os quatro qids de gap da demanda — a lista existe uma vez só. */
const D010_GAP_QIDS = ["automation", "endpoint", "network-visibility", "external-surface"];

/* Vetor do vão: 15 confirmadas, nível 0 nos quatro qids de gap, 2 nos demais. */
function d010VecVao(extra) {
  const v = new Array(N).fill(2);
  D010_GAP_QIDS.forEach(q => { v[K(q)] = 0; });
  if (extra) Object.keys(extra).forEach(q => { v[K(q)] = extra[q]; });
  return v;
}

/* Alvos dos quatro qids. Os níveis NÃO são decorativos:
     · `automation` vai a 1 porque `MAP.automation.lv[1].c` (FortiSOAR+FortiXDR)
       DIFERE de `lv[0].c` (FortiSOAR) — é o único dos quatro em que ler o
       nível-alvo em vez do atual (INV-5) produz uma lista errada e NÃO VAZIA,
       isto é, com os itens do nível errado nomeados;
     · os outros três vão a 2, onde `lv[2]` não tem `.c` — ler o nível-alvo ali
       apaga o nó. As duas formas de falha ficam disponíveis na mesma fixture. */
const D010_ALVOS_VAO = { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 };

/* ---------------------------------------------------------------------------
   D010-F1 · o vão canônico (estado do relatório do cliente, P10)
   15 confirmadas · nível 0 nos quatro qids de gap · landscape 100% UNSET ·
   ÚNICA declaração de contexto: `saasAllowed = "yes"` — que tira do modo
   legado (`engine_v32.js:305-311`) sem anexar candidato nem serviço a
   capability alguma. Prioridades em `automation` e `endpoint`; alvo nos quatro.
   Resultado medido: `isLegacyModeV32() === false`, "há substituto" = false, os
   quatro alvos em S2 com zero itens do engine — e a Camada 1 congelada oculta.
--------------------------------------------------------------------------- */
const D010_F1 = {
  id: "D010-F1",
  name: "vão canônico · contexto declarado, nada declarado, zero substituto",
  vec: d010VecVao(),
  arch: { saasAllowed: "yes" },
  priorities: ["automation", "endpoint"],
  targets: D010_ALVOS_VAO,
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F1b · o mesmo vão sem prioridades
   Exercita o ramo `!hasPrio` do render congelado: o título passa a ser "Como a
   Fortinet pode apoiar agora" e o bloco contíguo é `apoioAgora`. Sem esta
   fixture, o ramo sem prioridades da arbitragem fica sem medição (C4).
   Efeito colateral medido e declarado: sem prioridades, `buildSupportHTML` não
   desvia capability alguma para `#v32prio`, e as QUATRO capabilities de
   apresentação `base` caem em `#v32base` (contra DUAS sob D010-F1).
--------------------------------------------------------------------------- */
const D010_F1b = {
  id: "D010-F1b",
  name: "vão sem prioridades · ramo !hasPrio",
  vec: d010VecVao(),
  arch: { saasAllowed: "yes" },
  targets: D010_ALVOS_VAO,
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F2 · substituto presente
   D010-F1 + `security-analytics` declarada NONE pelo editor + `logs` no nível
   0 + alvo em `logs`.

   ERRATA DE 2026-08-30 (spec, §Fixtures), reconferida por execução aqui: o
   nível de `logs` é PARTE do estado, não detalhe. Com `logs` em 2 a capability
   sai em `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com ZERO candidatos, e a
   fixture deixa de ser "substituto presente". Com `logs` em 0:
   `TECHNOLOGY_WHITESPACE`/`DIRECT` com `fortianalyzer`, `fortisiem` e
   `fortisiem-cloud` — medido, não inferido.
--------------------------------------------------------------------------- */
const D010_F2 = {
  id: "D010-F2",
  name: "substituto presente · whitespace com candidatos DIRECT",
  vec: d010VecVao({ "logs": 0 }),
  arch: { saasAllowed: "yes" },
  priorities: ["automation", "endpoint"],
  presence: { "security-analytics": "NONE" },
  targets: Object.assign({}, D010_ALVOS_VAO, { "logs": 2 }),
  landscape: "MIXED",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F3 · gate de suficiência FECHADO
   Vetor de `P50-F2` (4 confirmadas + 1 "NA" ⇒ `suff === false`) +
   `saasAllowed = "yes"` + 1 alvo cujo `MAP` no nível ATUAL é não vazio.

   O alvo é `team-capacity` (atual 0 ⇒ `MAP.team-capacity.lv[0].c` =
   [SOCaaS, FortiGuard-MDR-Service]): é o único par alvo/MAP do vetor que faz a
   Camada 1 NOMEAR produto sob gate fechado, que é o contraste de C9. `mandate`
   serviria com um item só; `governance` e `logs` têm `lv[ans].c` vazio; o alvo
   de `logs` seria removido por `revalidateTargets` (atual 3).

   RESÍDUO MEDIDO, declarado e não escondido: `team-capacity` pertence a
   `soc-staffing`, que tem `landscapeEnabled: false` ⇒ estado de CONTEXTO S4.
   Nenhum alvo legítimo deste vetor está em S2 com `MAP` não vazio, de modo que
   a fixture prova "não publica sob gate fechado" mas NÃO prova que é o gate —
   e não o estado — quem impede. Ver `D010_VACUIDADES_CONHECIDAS`.
--------------------------------------------------------------------------- */
const D010_F3 = {
  id: "D010-F3",
  name: "gate de suficiência FECHADO · Camada 1 nomeia produto",
  vec: FX50.P50_F2.vec.slice(),
  arch: { saasAllowed: "yes" },
  targets: { "team-capacity": 2 },
  landscape: "UNSET",
  screen: "results"
};

const D010_FIXTURES = { "D010-F1": D010_F1, "D010-F1b": D010_F1b, "D010-F2": D010_F2, "D010-F3": D010_F3 };

/* ===================== aplicação sobre o runtime real ===================== */

/* Declara o contexto pelo EDITOR canônico: abre por `#v32cta`, mexe nos mesmos
   controles que o facilitador mexe e grava por `#v32save`. Cada passo falha
   ALTO se o controle não existir — controle ausente significa que a fixture
   deixou de alcançar a superfície, e isso não pode virar um gate vacuoso. */
function d010ApplyContext(w, d, fx) {
  if (!fx.presence && !fx.arch) return;
  const cta = d.querySelector("#v32cta");
  if (!cta) throw new Error(fx.id + ": #v32cta ausente — editor de contexto inalcançável");
  cta.click();
  if (fx.presence) Object.keys(fx.presence).forEach(capId => {
    const sel = d.getElementById("v32-pres-" + capId);
    if (!sel) throw new Error(fx.id + ": select de presence ausente para " + capId);
    sel.value = fx.presence[capId];
    /* `onchange` relê o rascunho e REPINTA o editor: qualquer referência a nó
       do editor obtida antes desta linha fica obsoleta. Por isso os campos de
       arquitetura são lidos do DOM depois, nunca antes. */
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
    throw new Error(fx.id + ": save recusado por validateConfigV32 — " + (box.textContent || "").replace(/\s+/g, " ").trim());
}

/* Aplica vetor + prioridades + alvos + contexto e alcança a tela de resultados
   pelos owners canônicos. Não escreve derivado algum e não toca em suficiência.
   O segundo `showResults()` existe porque o save só repinta o painel V3.2: o
   render completo é a rota que o usuário percorre e a que os gates observam. */
function d010ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  FX50.p50ApplyVec(w, fx.vec, fx.notes);
  if (fx.priorities) w.__DEV.setPriorities(fx.priorities);
  FX50.p50ApplyTargets(w, fx.targets);
  w.__DEV.showResults();
  d010ApplyContext(w, d, fx);
  w.__DEV.showResults();
  return fx;
}

/* ==================== leitura de estado de escopo de script ================ */

/* `MAP`, `PRODUCTS` e `ans` são `const` de topo de script clássico: existem no
   registro declarativo global, não em `window`. `window.eval` é indireto e
   roda no escopo global, então enxerga os três. É LEITURA — nenhum estado é
   aplicado por aqui. Isolado para que o custo seja auditável em um lugar só. */
function d010Eval(w, expr) {
  if (typeof w.eval !== "function") throw new Error("d010Eval: window.eval indisponível neste runtime");
  return w.eval(expr);
}
function d010RequireMap(w) {
  const t = d010Eval(w, "typeof MAP");
  if (t !== "object") throw new Error("d010RequireMap: MAP inalcançável (typeof " + t + ") — catálogo congelado ausente");
}
/* Vetor de respostas corrente, lido do owner canônico. */
function d010Answers(w) { return JSON.parse(d010Eval(w, "JSON.stringify(ans)")); }
/* `MAP[qid].lv[nivel].c` mapeado para as chaves de produto (`c.p`). Nível não
   numérico ("NA"/null) devolve lista vazia — é a propriedade que C7 (d) usa. */
function d010MapItems(w, qid, nivel) {
  d010RequireMap(w);
  if (typeof nivel !== "number") return [];
  const q = JSON.stringify(qid), l = JSON.stringify(nivel);
  return JSON.parse(d010Eval(w,
    "JSON.stringify((((MAP[" + q + "] || {lv:[]}).lv[" + l + "] || {}).c || []).map(function(x){return x.p;}))"));
}
/* Chaves distintas de `c.p` em todo o `MAP`, na ordem alfabética. São as 11 que
   a tabela de equivalência de C10 tem de cobrir — derivadas do catálogo
   congelado, nunca da tabela do produto. */
function d010MapKeys(w) {
  d010RequireMap(w);
  return JSON.parse(d010Eval(w,
    "JSON.stringify(Object.keys(MAP).reduce(function(acc,q){(MAP[q].lv||[]).forEach(function(l){(l.c||[]).forEach(function(x){if(acc.indexOf(x.p)<0)acc.push(x.p);});});return acc;},[]).sort())"));
}

/* ===================== oráculos derivados do MODELO ======================= */

function d010CapOf(w, qid) {
  const V = w.__DEV.V32;
  const caps = Object.keys(V.CAPABILITIES)
    .filter(id => (V.CAPABILITIES[id].questionIds || []).indexOf(qid) >= 0);
  if (caps.length !== 1)
    throw new Error("d010CapOf: " + qid + " pertence a " + caps.length + " capabilities (esperado 1)");
  return caps[0];
}

/* Habilitadores publicáveis pelo engine para a prática — candidatos + serviços
   do contexto da capability, exatamente o payload que o card consome hoje. */
function d010EnablerCount(w, qid) {
  const V = w.__DEV.V32;
  const c = V.buildRecommendationContext().contexts[d010CapOf(w, qid)];
  if (!c) return 0;
  return (c.candidates || []).length + (c.services || []).length;
}

/* Os quatro estados da spec 009 §5, recalculados sobre o MODELO CANÔNICO.
   `nItems` é parâmetro porque a 010 precisa das DUAS leituras:
     · d010StateOf     — com os itens reais: é o estado que o card publica hoje
                         e o conjunto que `D009-UNS1` mede;
     · d010CtxStateOf  — com `nItems = 0`: é o PREDICADO DE CONTEXTO, o "S2" de
                         C7/C8 — a pergunta "esta capability tem contexto a
                         declarar e não declarou?", independente de o engine ter
                         anexado serviço. É a leitura que faz serviço do engine
                         não bloquear o `MAP`.
   Confundir as duas é o erro que faz o gate medir outra coisa: sob D010-F3,
   `team-capacity` é S1 pela primeira e S4 pela segunda. */
function d010StateWith(w, qid, nItems) {
  const V = w.__DEV.V32;
  if (nItems > 0) return "S1";
  const caps = Object.keys(V.CAPABILITIES).filter(id => (V.CAPABILITIES[id].questionIds || []).indexOf(qid) >= 0);
  if (caps.length !== 1) return "S3";
  if (V.CAPABILITIES[caps[0]].landscapeEnabled !== true) return "S4";
  const L = V.TECH_LANDSCAPE[caps[0]];
  return (!L || L.presence === "UNSET") ? "S2" : "S3";
}
function d010StateOf(w, qid) { return d010StateWith(w, qid, d010EnablerCount(w, qid)); }
function d010CtxStateOf(w, qid) { return d010StateWith(w, qid, 0); }

function d010TargetsByState(w) {
  const out = { S1: [], S2: [], S3: [], S4: [] };
  Object.keys(w.__DEV.TARGET.overrides || {}).forEach(qid => out[d010StateOf(w, qid)].push(qid));
  return out;
}

/* `presentationOf` REIMPLEMENTADA a partir da spec §1/§2 — não é lida do
   módulo sob teste (que é uma IIFE e não a expõe). Enquanto a regra da spec e
   a do produto coincidirem, os gates medem; se divergirem, o gate falha e a
   divergência vira decisão explícita, que é o efeito desejado (R10 §1). */
function d010PresentationOf(w, id, c) {
  const V = w.__DEV.V32;
  if (!c) return null;
  if (c.supportMode === "VALIDATE") return "card";
  if (["DIRECT", "CONTEXTUAL"].indexOf(c.supportMode) >= 0 &&
      ((c.candidates || []).length || (c.services || []).length || (c.notes || []).length)) return "card";
  if (c.classification === "CONTEXT_NOT_INFORMED" &&
      ((c.maturity && (c.maturity.state === "gap-high" || c.maturity.state === "gap-moderate")) ||
       (c.businessPriority && c.businessPriority.flag) || (c.services || []).length))
    return V.CAPABILITIES[id].landscapeEnabled ? "base" : "maturity";
  return null;
}

/* "Há substituto?" — o predicado da spec §1, com as TRÊS cláusulas, como
   oráculo. Reimplementado da spec, não lido de `__DEV.hasSubstitute`: quem lê o
   produto para julgar o produto não julga nada. */
function d010HasSubstitute(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).some(id => {
    const c = ctxs[id];
    if (d010PresentationOf(w, id, c) !== "card") return false;
    if (c.classification === "CONTEXT_NOT_INFORMED") return false;
    return ((c.candidates || []).length + (c.services || []).length + (c.notes || []).length) > 0;
  });
}

/* Capabilities de apresentação `base`. Os DOIS conjuntos existem porque não são
   o mesmo: `buildSupportHTML` desvia as capabilities de prioridade declarada
   para `#v32prio` ANTES de montar `#v32base` (`rest`), e o card de prioridade
   continua sendo `baseCardHTML`. Sob D010-F1 são 4 e 2 respectivamente — um
   oráculo que use o conjunto errado mede a lista nominal de C6 contra um
   universo que a superfície não contém. */
function d010BasePresented(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "base").sort();
}
function d010BaseInV32Base(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "base" &&
    !(ctxs[id].businessPriority && ctxs[id].businessPriority.flag)).sort();
}

/* Capabilities cuja apresentação é `card` e cujo payload é VAZIO — é a cláusula
   "candidato/serviço/nota" do predicado, e é a única das três que alguma
   fixture desta demanda torna load-bearing (D010-F3). */
function d010CardsSemPayload(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "card" &&
    ((ctxs[id].candidates || []).length + (ctxs[id].services || []).length + (ctxs[id].notes || []).length) === 0).sort();
}

/* Títulos congelados de recomendação presentes na tela, e quais estão ocultos.
   A lista é a mesma de `HIDE_EYEBROWS` (`ui_v32.js:109-110`), transcrita aqui
   caractere a caractere: se o produto mudar o texto, o gate falha — que é o
   comportamento correto para uma âncora de regressão. */
const D010_HIDE_EYEBROWS = ["Como a Fortinet pode apoiar nas prioridades declaradas",
  "Como a Fortinet pode apoiar agora", "Pode fazer sentido — após validação"];
function d010FrozenTitles(d) {
  return Array.from(d.querySelectorAll("section.screen .section-title")).map(t => {
    const eb = t.querySelector(".eyebrow");
    return { texto: eb ? (eb.textContent || "").replace(/\s+/g, " ").trim() : "", oculto: t.classList.contains("v32-hidden") };
  }).filter(o => D010_HIDE_EYEBROWS.indexOf(o.texto) >= 0);
}

/* ===================== ESTADOS DECLARADOS (medidos) ======================= */
/* Cada número/lista abaixo foi MEDIDO por execução em 2026-08-30 sobre
   `quickscan_secops_soccmm_v3_2_dev.html`, antes de qualquer implementação da
   010. Se a fixture deixar de produzir o cenário documentado, o erro aparece
   em `d010AssertFixtureStates` — nunca silenciosamente dentro de um gate.
   Fixture que não alcança o estado faz o gate morrer vacuoso, e gate vacuoso é
   pior que gate ausente. */
const D010_DECLARED = {
  "D010-F1": {
    legacy: false, suff: true, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: ["automation", "endpoint"],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 },
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["external-exposure", "network-detection"],
    cardsSemPayload: [],
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar nas prioridades declaradas", oculto: true }]
  },
  "D010-F1b": {
    legacy: false, suff: true, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: [],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 },
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    cardsSemPayload: [],
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar agora", oculto: true }]
  },
  "D010-F2": {
    legacy: false, suff: true, substituto: true,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: { "security-analytics": "NONE" },
    prioridades: ["automation", "endpoint"],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2, "logs": 2 },
    /* `logs` sai em S1 pela leitura com itens (3 candidatos DIRECT do engine) e
       em S3 pela leitura de contexto (presence NONE ≠ UNSET). */
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2", "logs": "S1" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2", "logs": "S3" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"],
                     "logs": ["FortiAnalyzer", "FortiSIEM"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [], "logs": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["external-exposure", "network-detection"],
    cardsSemPayload: [],
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar nas prioridades declaradas", oculto: true }],
    /* o substituto, nomeado: é ele que autoriza a supressão de C2 */
    substitutoEm: { capability: "security-analytics", classification: "TECHNOLOGY_WHITESPACE",
                    supportMode: "DIRECT", candidates: ["fortianalyzer", "fortisiem", "fortisiem-cloud"], services: [] }
  },
  "D010-F3": {
    legacy: false, suff: false, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: [],
    alvos: { "team-capacity": 2 },
    estados:    { "team-capacity": "S1" },
    estadosCtx: { "team-capacity": "S4" },
    mapNivelAtual: { "team-capacity": ["SOCaaS", "FortiGuard-MDR-Service"] },
    mapNivelAlvo:  { "team-capacity": [] },
    basePresented: [],
    baseInV32Base: [],
    /* as 10 capabilities `NEEDS_VALIDATION`/`VALIDATE` com 0 candidatos, 0
       serviços e 0 notas: são elas que tornam a cláusula "candidato/serviço/
       nota" load-bearing, e é por elas que "há substituto" é false aqui. */
    cardsSemPayload: ["continuous-monitoring", "detection-engineering", "endpoint-detection",
      "external-exposure", "incident-management", "knowledge-management", "network-detection",
      "security-automation", "soc-skills", "vulnerability-management"],
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar agora", oculto: true },
                        { texto: "Pode fazer sentido — após validação", oculto: true }]
  }
};

/* ==========================================================================
   VACUIDADES CONHECIDAS — achados abertos, medidos, NÃO resolvidos aqui
   ==========================================================================
   Este bloco é dado, não desculpa. Ele existe para que um gate de
   `tests_010_vao.js` não nasça vacuoso sem que alguém tenha decidido isso: a
   alínea listada aqui NÃO pode ser dada por medida enquanto a decisão do
   `tech-lead`/`product-owner` não vier. Nenhuma delas é corrigível dentro de
   T002 — todas exigem mexer em conteúdo de fixture que a spec declara.
   ========================================================================== */
const D010_VACUIDADES_CONHECIDAS = [
  { criterio: "C9 · D010-CARD3 (b)(c)", fixture: "D010-F3",
    medido: "nenhum alvo legítimo do vetor P50-F2 está em estado de contexto S2 com MAP não vazio: " +
            "mandate/governance/team-capacity são S4 (landscapeEnabled:false), logs é S2 mas MAP.lv[3].c é vazio " +
            "e o alvo seria removido por revalidateTargets, incident-response é S2 mas a resposta é \"NA\".",
    consequencia: "a ausência de nó a-validar sob gate fechado é verdadeira por ESTADO, não por GATE; " +
            "flipar a suficiência não muda o veredito do card, então (c) não tem como ser provado com esta fixture." },
  { criterio: "C8 · D010-CARD2 (b)", fixture: "D010-F2",
    medido: "nenhuma das capabilities dos 5 alvos recebe serviço por hasGap. Os serviços do engine só chegam a " +
            "soc-staffing, soc-skills, incident-management, continuous-monitoring e vulnerability-management, " +
            "e nenhum qid dessas está no conjunto de alvos declarado pela spec.",
    consequencia: "\"capability com apenas serviços e em S2 continua recebendo o nó\" não é exercitável; " +
            "um 6º alvo em vulnerability-management (nível 0 ⇒ serviço vulnerability-assessment, sem candidato, " +
            "presence UNSET, MAP.lv[0].c = [FortiRecon, FortiEndpoint]) tornaria a alínea real." },
  { criterio: "C10 · D010-CARD4 (c) · dedup por data-eid", fixture: "nenhuma",
    medido: "a colisão real (serviço fortiguard-socaas × chave SOCaaS do MAP) vive em monitoring-coverage / " +
            "continuous-monitoring, e só materializa com a resposta em nível 0 ou 1 E um alvo naquele qid. " +
            "Nenhuma das quatro fixtures tem alvo em monitoring-coverage.",
    consequencia: "a deduplicação exigida de T008 nasce sem cenário que a mate; (c) passa vacuosamente." },
  { criterio: "§1 · cláusula \"classificação ≠ CONTEXT_NOT_INFORMED\" (A5)", fixture: "todas",
    medido: "em D010-F1, F1b, F2, F3 e também numa sessão 15×0 e 15×1 sem nada declarado, o predicado dá o MESMO " +
            "valor com e sem a cláusula. Nenhuma capability CONTEXT_NOT_INFORMED alcança apresentação \"card\": " +
            "o supportMode dessa classificação é LEGACY-LABELLED, que presentationOf nunca promove a card.",
    consequencia: "a cláusula é guarda redundante, não load-bearing como o plano registra; " +
            "nenhum mutante que a remova pode ser morto por fixture alguma desta demanda." }
];

/* ===================== conferência dos estados declarados ================== */

const _eqL = (a, b) => a.slice().sort().join("|") === b.slice().sort().join("|");

/* Confere, sobre um runtime JÁ com a fixture aplicada, TODO o estado declarado.
   Lança com a divergência nomeada, no primeiro desvio. Recebe `w` e a fixture,
   como `d009AssertFixtureStates`; o documento sai de `w.document`. */
function d010AssertFixtureStates(w, fx) {
  const dec = D010_DECLARED[fx.id];
  if (!dec) throw new Error("d010AssertFixtureStates: fixture sem estados declarados: " + fx.id);
  const d = w.document;
  const V = w.__DEV.V32;
  const fail = m => { throw new Error(fx.id + ": " + m); };

  /* 1 · modo legado — pré-condição de TODOS os gates da demanda */
  if (V.isLegacyModeV32() !== dec.legacy)
    fail("isLegacyModeV32 = " + V.isLegacyModeV32() + ", declarado " + dec.legacy);

  /* 2 · arquitetura declarada, e SÓ ela */
  Object.keys(dec.arch).forEach(k => {
    if (V.ARCHITECTURE_CONTEXT[k] !== dec.arch[k])
      fail("ARCHITECTURE_CONTEXT." + k + " = " + V.ARCHITECTURE_CONTEXT[k] + ", declarado " + dec.arch[k]);
  });
  const archExtra = Object.keys(V.ARCHITECTURE_CONTEXT).filter(k => !(k in dec.arch) &&
    !["unknown", "undefined", "uninformed", null].some(v => V.ARCHITECTURE_CONTEXT[k] === v));
  if (archExtra.length) fail("campos de arquitetura fora do declarado: [" + archExtra + "]");

  /* 3 · landscape: exatamente as capabilities declaradas saem de UNSET */
  const decl = {};
  Object.keys(V.TECH_LANDSCAPE).forEach(id => {
    if (V.TECH_LANDSCAPE[id].presence !== "UNSET") decl[id] = V.TECH_LANDSCAPE[id].presence;
  });
  if (JSON.stringify(decl) !== JSON.stringify(dec.landscapeDeclarada))
    fail("landscape declarada " + JSON.stringify(decl) + " != declarado " + JSON.stringify(dec.landscapeDeclarada));

  /* 4 · vetor de respostas e suficiência (owner canônico, não recontagem) */
  const ansNow = d010Answers(w);
  if (JSON.stringify(ansNow) !== JSON.stringify(fx.vec))
    fail("vetor aplicado " + JSON.stringify(ansNow) + " != vetor da fixture " + JSON.stringify(fx.vec));
  const cur = w.__DEV.tgtCurrentProfile();
  if (cur.suff !== dec.suff) fail("suficiência = " + cur.suff + ", declarada " + dec.suff);

  /* 5 · alvos: conjunto e níveis EXATOS, medidos contra a tabela declarada e
         não contra o objeto da fixture. Comparar runtime × `fx.targets` deixa
         passar qualquer edição da fixture — o objeto e o runtime mudam juntos e
         o assert concorda com os dois. Medido: com essa comparação, trocar o
         alvo de D010-F3 de `team-capacity` para `mandate` NÃO era detectado. */
  const alvos = dec.alvos;
  const fxq = Object.keys(fx.targets || {}).sort(), decq = Object.keys(alvos).sort();
  if (fxq.join(",") !== decq.join(","))
    fail("fixture declara alvos [" + fxq + "], tabela declara [" + decq + "]");
  decq.forEach(qid => {
    if ((fx.targets || {})[qid] !== alvos[qid])
      fail("fixture põe alvo " + qid + " = " + (fx.targets || {})[qid] + ", tabela declara " + alvos[qid]);
  });
  const ov = Object.keys(w.__DEV.TARGET.overrides || {}).sort();
  if (ov.join(",") !== decq.join(","))
    fail("alvos aplicados [" + ov + "] != declarados [" + decq + "]");
  decq.forEach(qid => {
    if (w.__DEV.TARGET.overrides[qid] !== alvos[qid])
      fail("alvo " + qid + " = " + w.__DEV.TARGET.overrides[qid] + ", declarado " + alvos[qid]);
  });

  /* 6 · prioridades — lidas do payload do engine, não de estado interno */
  const res = V.buildRecommendationContext();
  const prioQ = [];
  Object.keys(res.contexts).forEach(id => {
    ((res.contexts[id].businessPriority || {}).priorityQuestionIds || []).forEach(q => {
      if (prioQ.indexOf(q) < 0) prioQ.push(q);
    });
  });
  if (!_eqL(prioQ, dec.prioridades))
    fail("prioridades [" + prioQ.sort() + "] != declaradas [" + dec.prioridades.slice().sort() + "]");

  /* 7 · o predicado da spec §1 */
  if (d010HasSubstitute(w, res) !== dec.substituto)
    fail("\"há substituto\" = " + d010HasSubstitute(w, res) + ", declarado " + dec.substituto);

  /* 8 · os DOIS estados por prática-alvo */
  Object.keys(dec.estados).forEach(qid => {
    const got = d010StateOf(w, qid);
    if (got !== dec.estados[qid]) fail(qid + " (estado com itens) em " + got + ", declarado " + dec.estados[qid]);
  });
  Object.keys(dec.estadosCtx).forEach(qid => {
    const got = d010CtxStateOf(w, qid);
    if (got !== dec.estadosCtx[qid]) fail(qid + " (estado de contexto) em " + got + ", declarado " + dec.estadosCtx[qid]);
  });

  /* 9 · âncora de catálogo: nível ATUAL e nível ALVO, para que INV-5 seja
         mensurável e para que nenhum gate de C7 nasça sobre lista vazia */
  Object.keys(dec.mapNivelAtual).forEach(qid => {
    const got = d010MapItems(w, qid, ansNow[K(qid)]);
    if (JSON.stringify(got) !== JSON.stringify(dec.mapNivelAtual[qid]))
      fail("MAP[" + qid + "].lv[atual].c = " + JSON.stringify(got) + ", declarado " + JSON.stringify(dec.mapNivelAtual[qid]));
  });
  Object.keys(dec.mapNivelAlvo).forEach(qid => {
    const got = d010MapItems(w, qid, dec.alvos[qid]);
    if (JSON.stringify(got) !== JSON.stringify(dec.mapNivelAlvo[qid]))
      fail("MAP[" + qid + "].lv[alvo].c = " + JSON.stringify(got) + ", declarado " + JSON.stringify(dec.mapNivelAlvo[qid]));
  });

  /* 10 · superfície de apresentação: os dois conjuntos `base` e os cards sem
          payload — é o que separa C6 de um oráculo com universo errado */
  const bp = d010BasePresented(w, res), bb = d010BaseInV32Base(w, res), cs = d010CardsSemPayload(w, res);
  if (!_eqL(bp, dec.basePresented)) fail("apresentação base [" + bp + "] != declarada [" + dec.basePresented + "]");
  if (!_eqL(bb, dec.baseInV32Base)) fail("base fora de prioridade [" + bb + "] != declarada [" + dec.baseInV32Base + "]");
  if (!_eqL(cs, dec.cardsSemPayload)) fail("cards sem payload [" + cs + "] != declarado [" + dec.cardsSemPayload + "]");

  /* 11 · o substituto, quando declarado, é NOMEADO */
  if (dec.substitutoEm) {
    const s = dec.substitutoEm, c = res.contexts[s.capability];
    if (!c) fail("capability do substituto ausente: " + s.capability);
    if (c.classification !== s.classification || c.supportMode !== s.supportMode)
      fail(s.capability + " = " + c.classification + "/" + c.supportMode + ", declarado " + s.classification + "/" + s.supportMode);
    const cand = (c.candidates || []).map(x => x.itemId), svc = (c.services || []).map(x => x.serviceId);
    if (JSON.stringify(cand) !== JSON.stringify(s.candidates))
      fail(s.capability + " candidatos " + JSON.stringify(cand) + " != declarados " + JSON.stringify(s.candidates));
    if (JSON.stringify(svc) !== JSON.stringify(s.services))
      fail(s.capability + " serviços " + JSON.stringify(svc) + " != declarados " + JSON.stringify(s.services));
  }

  /* 12 · a Camada 1 congelada existe na tela — sem título presente, todo gate
          de arbitragem passa vacuosamente */
  const tit = d010FrozenTitles(d);
  if (JSON.stringify(tit) !== JSON.stringify(dec.titulosCongelados))
    fail("títulos congelados " + JSON.stringify(tit) + " != declarados " + JSON.stringify(dec.titulosCongelados));

  return true;
}

module.exports = {
  D010_F1, D010_F1b, D010_F2, D010_F3, D010_FIXTURES, D010_DECLARED,
  D010_GAP_QIDS, D010_ALVOS_VAO, D010_HIDE_EYEBROWS, D010_VACUIDADES_CONHECIDAS,
  d010VecVao, d010ApplyContext, d010ApplyResults,
  d010Eval, d010Answers, d010MapItems, d010MapKeys,
  d010CapOf, d010EnablerCount, d010StateWith, d010StateOf, d010CtxStateOf, d010TargetsByState,
  d010PresentationOf, d010HasSubstitute, d010BasePresented, d010BaseInV32Base, d010CardsSemPayload,
  d010FrozenTitles, d010AssertFixtureStates
};
