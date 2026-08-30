/* ============================================================================
   FIXTURES D009 — DEMANDA 009 · leitura do relatório
   Namespace fechado D009-F*. Locais à demanda: `fixtures_p52.js` é artefato de
   outra fase e NÃO é alterado (spec §"Critérios de aceite → gates", bloco
   "Fixtures").

   Existem porque nenhuma das cinco fixtures 5.2 alcança os dois estados que a
   demanda precisa exercitar:
     · S3  — prática-alvo sobre capability SEM gap e com contexto DECLARADO
             ("informado e nada se aplica"): `P52_F5` declara contexto mas não
             tem alvo algum, e com gap suficiente cai em S1;
     · B9  — contexto PARCIALMENTE informado: uma capability declarada e outra
             UNSET, com prática-alvo em ambas.

   Nenhuma fixture inventa estado canônico. Vetor de 15 posições, `presence` e
   alvos são aplicados pelos OWNERS reais do runtime congelado, via
   `fixtures_p50.js` (`p50ApplyVec`, `p50ApplyPresence`, `p50ApplyTargets`).
   `p50ApplyTargets` usa o setter canônico `setTarget()`, que recusa alvo não
   superior ao atual — se uma fixture declarar alvo ilegítimo, o erro aparece
   AQUI e não silenciosamente dentro de um gate.

   Por que o vetor é 2 em todas as 15 posições: no nível 2 nenhuma pergunta
   pontua severidade, logo `maturityStateOf(cap).state === "mature"` para toda
   capability avaliada — sem gap não há candidato contextual nem serviço
   disparado por gap, e `items` fica vazio. É o que separa S1 dos demais
   estados. O nível 2 também deixa espaço para o alvo 3, que o setter canônico
   aceita (3 > 2), e mantém o gate de suficiência ABERTO (15 confirmadas).
   ========================================================================== */
"use strict";

const FX50 = require("./fixtures_p50.js");

const N = FX50.P50_QIDS.length;

/* ---------------------------------------------------------------------------
   D009-F1 · S3 · contexto INFORMADO e nada se aplica
   `security-analytics` (questionId `logs`) declarada como PRESENT; todas as
   demais capabilities permanecem UNSET, mas nenhuma delas recebe alvo. A única
   prática-alvo é `logs`, cuja capability está declarada e não tem gap: estado
   S3 da spec §5 — a frase substantiva permanece, e NENHUM bloco de ausência
   pode nascer nesta fixture.
--------------------------------------------------------------------------- */
const D009_F1 = {
  id: "D009-F1",
  name: "S3 · contexto informado, nada se aplica",
  vec: new Array(N).fill(2),
  presence: { "security-analytics": "PRESENT" },
  targets: { "logs": 3 },
  landscape: "DECLARED",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D009-F2 · B9 · contexto PARCIALMENTE informado
   `security-analytics` declarada (PRESENT) e `endpoint-detection` deixada
   UNSET, com alvo nas DUAS: `logs` cai em S3 e `endpoint` cai em S2. É o par
   que prova que o aviso nomeia exatamente quem ficou de fora — e só quem
   ficou de fora.
--------------------------------------------------------------------------- */
const D009_F2 = {
  id: "D009-F2",
  name: "B9 · contexto parcialmente informado",
  vec: new Array(N).fill(2),
  presence: { "security-analytics": "PRESENT" },
  targets: { "logs": 3, "endpoint": 3 },
  landscape: "MIXED",
  screen: "results"
};

const D009_FIXTURES = { "D009-F1": D009_F1, "D009-F2": D009_F2 };

/* ===================== aplicação sobre o runtime real ===================== */

/* Aplica vetor + presence + alvos e alcança a tela de resultados pelos owners
   canônicos. Não escreve derivado algum e não toca em suficiência. */
function d009ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  FX50.p50ApplyVec(w, fx.vec, fx.notes);
  FX50.p50ApplyPresence(w, fx.presence);
  FX50.p50ApplyTargets(w, fx.targets);
  if (fx.priorities) w.__DEV.setPriorities(fx.priorities);
  w.__DEV.showResults();
  return fx;
}

/* ===================== oráculo dos QUATRO ESTADOS (spec §5) ================

   Recalcula o estado de cada prática-alvo a partir do MODELO CANÔNICO
   (`V32.CAPABILITIES`, `V32.TECH_LANDSCAPE` e o payload congelado de
   `V32.buildRecommendationContext()`), sem chamar `tgtEnablersHTML()` e sem
   ler o DOM. É oráculo do ESTADO, não da FONTE do habilitador: a demanda 009
   declara explicitamente que não altera a fonte (spec §"Fora de escopo"), de
   modo que o payload do engine é entrada, e a decisão de 4 estados é o que
   está sob teste.
   ========================================================================== */

/* `validateConfigV32` garante que um qid pertence a NO MÁXIMO uma capability;
   os 15 qid do assessment estão cobertos. Ausência é violação do modelo
   canônico e precisa ser barulhenta, nunca um estado silencioso. */
function d009CapOf(w, qid) {
  const V = w.__DEV.V32;
  const caps = Object.keys(V.CAPABILITIES)
    .filter(id => (V.CAPABILITIES[id].questionIds || []).indexOf(qid) >= 0);
  if (caps.length !== 1)
    throw new Error("d009CapOf: " + qid + " pertence a " + caps.length + " capabilities (esperado 1)");
  return caps[0];
}

/* Contagem de habilitadores publicáveis para a prática — candidatos + serviços
   do contexto da capability, exatamente o payload que o card consome. */
function d009EnablerCount(w, qid) {
  const V = w.__DEV.V32;
  const c = V.buildRecommendationContext().contexts[d009CapOf(w, qid)];
  if (!c) return 0;
  return (c.candidates || []).length + (c.services || []).length;
}

function d009StateOf(w, qid) {
  const V = w.__DEV.V32;
  if (d009EnablerCount(w, qid) > 0) return "S1";
  const cap = d009CapOf(w, qid);
  if (V.CAPABILITIES[cap].landscapeEnabled !== true) return "S4";
  const L = V.TECH_LANDSCAPE[cap];
  return (!L || L.presence === "UNSET") ? "S2" : "S3";
}

/* Estados DECLARADOS de cada fixture, por prática-alvo. Se a fixture deixar de
   produzir o cenário documentado, o erro aparece aqui — nunca silenciosamente
   dentro de um gate. Fixture que não alcança o estado faz o gate morrer
   vacuoso, e gate vacuoso é pior que gate ausente. */
const D009_DECLARED = {
  "D009-F1": { gate: "released", states: { "logs": "S3" } },
  "D009-F2": { gate: "released", states: { "logs": "S3", "endpoint": "S2" } }
};

/* Confere, sobre um runtime JÁ com a fixture aplicada, que cada prática-alvo
   alcançou o estado declarado e que o conjunto de alvos é exatamente o
   declarado. Lança com a divergência nomeada. */
function d009AssertFixtureStates(w, fx) {
  const dec = D009_DECLARED[fx.id];
  if (!dec) throw new Error("d009AssertFixtureStates: fixture sem estados declarados: " + fx.id);
  const ov = Object.keys(w.__DEV.TARGET.overrides || {}).sort();
  const want = Object.keys(dec.states).sort();
  if (ov.join(",") !== want.join(","))
    throw new Error(fx.id + ": alvos aplicados [" + ov + "] != declarados [" + want + "]");
  want.forEach(qid => {
    const got = d009StateOf(w, qid);
    if (got !== dec.states[qid])
      throw new Error(fx.id + ": " + qid + " em " + got + ", declarado " + dec.states[qid]);
  });
  return true;
}

/* Conjuntos derivados do MODELO, usados pelos gates de bloco de ausência.
   `d009AbsentTargets` = práticas-alvo em S2 (as que o aviso deve nomear).
   `d009NonAbsentTargets` = todas as demais práticas-alvo (as que ele nunca
   pode nomear). */
function d009TargetsByState(w) {
  const out = { S1: [], S2: [], S3: [], S4: [] };
  Object.keys(w.__DEV.TARGET.overrides || {}).forEach(qid => out[d009StateOf(w, qid)].push(qid));
  return out;
}

/* Práticas de capability com `landscapeEnabled: false` — as 5 que nunca têm
   contexto a informar (C13). Derivadas de `V32.CAPABILITIES`, nunca escritas
   à mão. */
function d009NoLandscapeQids(w) {
  const V = w.__DEV.V32;
  const out = [];
  Object.keys(V.CAPABILITIES).forEach(id => {
    if (V.CAPABILITIES[id].landscapeEnabled !== true)
      (V.CAPABILITIES[id].questionIds || []).forEach(q => out.push(q));
  });
  return out.sort();
}

module.exports = {
  D009_F1, D009_F2, D009_FIXTURES, D009_DECLARED,
  d009ApplyResults, d009CapOf, d009EnablerCount, d009StateOf,
  d009AssertFixtureStates, d009TargetsByState, d009NoLandscapeQids
};
