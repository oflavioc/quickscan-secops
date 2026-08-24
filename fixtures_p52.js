/* ============================================================================
   FIXTURES P52 — PHASE 5.2 · Desktop Workspace & Results Information Architecture
   Namespace fechado P52-F*. Nenhuma fixture inventa estado canônico: um vetor
   de 15 posições (null | 0..3 | "NA"), um conjunto de prioridades declaradas e
   um conjunto de alvos são aplicados pelos OWNERS reais do runtime congelado
   (`__DEV.setAnswerById`, `__DEV.setPriorities`, `__DEV.setTarget`).

   As fixtures da 5.0 continuam válidas e são reutilizadas onde já provam o
   estado necessário; as três abaixo existem porque nenhuma fixture anterior
   produz, ao mesmo tempo, gate LIBERADO, gaps ALTOS e MODERADOS e prioridades
   declaradas — que é exatamente a tela que a Phase 5.2 reorganiza.
   ========================================================================== */
"use strict";

const FX50 = require("./fixtures_p50.js");

/* ---------------------------------------------------------------------------
   P52-F1 · Workspace completo
   15 respostas confirmadas (gate liberado), severidades mistas e duas
   prioridades declaradas. É a fixture da tela cheia: visão executiva, alvo,
   contexto, evidência, detalhe, prioridades, gaps altos + moderados, apoio e
   ações — todas as nove seções presentes ao mesmo tempo.
--------------------------------------------------------------------------- */
const P52_F1 = {
  id: "P52-F1",
  name: "Workspace completo",
  vec: [0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
  priorities: ["mandate", "team-capacity"],
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   P52-F2 · Workspace com cenário-alvo declarado
   Todas confirmadas no nível 1 e quatro práticas com override de alvo — prova
   que o trilho anuncia a contagem de práticas com alvo como informação
   DERIVADA, e que Target continua antes de Contexto.
--------------------------------------------------------------------------- */
const P52_F2 = {
  id: "P52-F2",
  name: "Workspace com cenário-alvo",
  vec: new Array(15).fill(1),
  targets: { "mandate": 3, "governance": 2, "team-capacity": 2, "logs": 3 },
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   P52-F3 · Gate fechado
   Quatro confirmadas + uma "NA": o veredito canônico BLOQUEIA o resultado.
   A ordem das seções não pode fazer resultado bloqueado parecer liberado.
--------------------------------------------------------------------------- */
const P52_F3 = {
  id: "P52-F3",
  name: "Gate fechado",
  vec: FX50.P50_F2.vec.slice(),
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   P52-F4 · Gate FECHADO com cenário-alvo SUFICIENTE   [ERRATA FINAL · ALTO-1]

   O quadrante que faltava. Cinco respostas confirmadas — uma por domínio —
   deixam o perfil ATUAL insuficiente (`confirmadas < 10` e `n = 1` em todo
   domínio). Os cinco alvos declarados recaem sobre práticas NUNCA respondidas,
   um por domínio, de modo que o VETOR EFETIVO do alvo alcança 10 confirmadas
   com `n = 2` em todo domínio e o gate do alvo, sozinho, ABRE.

   É o estado que o parecer independente
   70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120 (§9.3)
   demonstrou ser alcançável pela UI real de workshop, e é o estado em que a
   candidata anterior publicava metade da comparação sob gate fechado.
   Nenhum gate anterior o exercitava: o caso negativo de `UG6` mantinha o vetor
   do alvo TAMBÉM insuficiente.
--------------------------------------------------------------------------- */
const P52_F4 = {
  id: "P52-F4",
  name: "Gate fechado com cenário-alvo suficiente",
  vec: [1, null, null, 1, null, null, 1, null, null, 1, null, null, 1, null, null],
  targets: { "governance": 3, "training": 2, "detection-lifecycle": 3, "endpoint": 2, "external-surface": 3 },
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   P52-F5 · Workspace com CONTEXTO TECNOLÓGICO declarado   [ERRATA FINAL · MÉDIO-2]

   F1, F2 e F3 declaram `landscape: "UNSET"`; sem contexto o produto não monta
   os cards de apoio, e portanto nenhuma delas renderiza `a.p52-sup-link`. Esse
   é exatamente o ponto cego de FIXTURE que deixou `P52-ACC3` vacuoso para o
   único nó de texto de marca que ficara fora de A-01 (parecer §10 MÉDIO-2:
   `grep p52-sup-link` na evidência do gate → zero ocorrências).

   `presence` é aplicado pelo OWNER real (`p50ApplyPresence`), nunca por
   escrita direta de derivado.
--------------------------------------------------------------------------- */
const P52_F5 = {
  id: "P52-F5",
  name: "Workspace com contexto tecnológico declarado",
  vec: new Array(15).fill(1),
  presence: { "security-analytics": "NONE", "endpoint-detection": "NONE", "soc-platform": "NONE" },
  landscape: "DECLARED",
  screen: "results"
};

const P52_FIXTURES = { "P52-F1": P52_F1, "P52-F2": P52_F2, "P52-F3": P52_F3,
                       "P52-F4": P52_F4, "P52-F5": P52_F5 };

/* ===================== aplicação sobre o runtime real ===================== */

/* Aplica vetor + prioridades + alvos e alcança a tela de resultados pelos
   owners canônicos. Não escreve derivado algum. */
function p52ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  FX50.p50ApplyVec(w, fx.vec, fx.notes);
  FX50.p50ApplyPresence(w, fx.presence);
  FX50.p50ApplyTargets(w, fx.targets);
  if (fx.priorities) w.__DEV.setPriorities(fx.priorities);
  w.__DEV.showResults();
  return fx;
}

/* Oráculo independente das contagens declaradas: severidade por pergunta é
   recalculada AQUI a partir do vetor e do mapa canônico exposto ao runtime,
   sem chamar computeFindings(). Se a fixture deixar de produzir o cenário
   documentado, o erro aparece aqui — nunca silenciosamente dentro de um gate. */
const P52_DECLARED = {
  "P52-F1": { confirmed: 15, gate: "released", high: 4, moderate: 9, priorities: 2 },
  "P52-F2": { confirmed: 15, gate: "released", overrides: 4 },
  "P52-F3": { confirmed: 4, gate: "blocked" },
  "P52-F4": { confirmed: 5, gate: "blocked", overrides: 5, targetGate: "released" },
  "P52-F5": { confirmed: 15, gate: "released", contexto: true }
};

function p52ConfirmedTotal(vec) {
  return vec.filter(v => v !== null && v !== "NA").length;
}

/* ---------------------------------------------------------------------------
   ERRATA DA AUDITORIA EXTERNA · ORÁCULO DE PUBLICABILIDADE (B-01)
   Recalcula, a partir do VETOR e das constantes canônicas do question bank,
   o que pode e o que não pode ser publicado. Nada aqui chama `domStat()`,
   `dataSufficiency()`, `renderResults()` ou `buildPrintReport()`: se a
   implementação e este oráculo divergirem, o gate falha — e é essa a prova.

   Regra canônica de suficiência (congelada): `confirmedCount() >= 10` E todo
   domínio com `n >= 2`. Score de domínio: média das confirmadas, uma casa.
   Agregado: média dos scores de domínio, arredondada ANTES de nomear a faixa.
--------------------------------------------------------------------------- */
function p52PublishOracle(vec) {
  const porDominio = [0, 1, 2, 3, 4].map(i => {
    const vals = vec.map((v, k) => ({ v: v, k: k }))
      .filter(x => FX50.P50_DOM_OF[x.k] === i && x.v !== null && x.v !== "NA")
      .map(x => FX50.P50_SCORES[x.v]);
    return { n: vals.length,
      score: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null };
  });
  const confirmadas = p52ConfirmedTotal(vec);
  const suff = confirmadas >= 10 && porDominio.every(d => d.n >= 2);
  const comScore = porDominio.filter(d => d.score !== null);
  const overall = (suff && comScore.length)
    ? Math.round(comScore.reduce((a, d) => a + d.score, 0) / comScore.length * 10) / 10 : null;
  return {
    confirmadas: confirmadas,
    suff: suff,
    porDominio: porDominio,
    overall: overall,
    /* o que o produto TEM O DIREITO de publicar por domínio, em tela e no papel */
    publicaveis: porDominio.map(d => (suff ? d.score : null))
  };
}

/* ---------------------------------------------------------------------------
   ERRATA FINAL · ORÁCULO DA COMPARAÇÃO INDIVISÍVEL (ALTO-1)

   Reimplementa, a partir do VETOR e dos alvos declarados, os dois perfis e o
   veredito de publicação da comparação. Não chama `computeTargetProfile()`,
   `tgtCurrentProfile()`, `tgtPublishable()` nem `publishableStats()`: se a
   implementação e este oráculo divergirem, o gate falha — e é essa a prova.

   Regra normativa desta errata:  comparisonPublishable = current.suff === true
   `target.suff` NÃO abre a comparação sozinho.
--------------------------------------------------------------------------- */
function p52EffectiveVector(vec, targets) {
  const eff = vec.slice();
  Object.keys(targets || {}).forEach(qid => {
    const k = FX50.P50_QIDS.indexOf(qid);
    if (k < 0) throw new Error("p52EffectiveVector: qid inexistente no banco congelado: " + qid);
    eff[k] = targets[qid];
  });
  return eff;
}
function p52ComparisonOracle(vec, targets) {
  const atual = p52PublishOracle(vec);
  const alvo  = p52PublishOracle(p52EffectiveVector(vec, targets));
  const publicavel = atual.suff === true;          /* a regra, e nada além dela */
  const porDominio = [0, 1, 2, 3, 4].map(i => {
    const c = publicavel ? atual.porDominio[i].score : null;
    const t = (publicavel && alvo.suff) ? alvo.porDominio[i].score : null;
    return { atual: c, alvo: t,
      gap: (c !== null && t !== null) ? Math.round((t - c) * 10) / 10 : null };
  });
  return {
    atual, alvo, publicavel,
    overrides: Object.keys(targets || {}).length,
    porDominio,
    kpiAtual: publicavel ? atual.overall : null,
    kpiAlvo:  (publicavel && alvo.suff) ? alvo.overall : null
  };
}

module.exports = {
  P52_F1, P52_F2, P52_F3, P52_F4, P52_F5, P52_FIXTURES, P52_DECLARED,
  p52ApplyResults, p52ConfirmedTotal, p52PublishOracle,
  p52EffectiveVector, p52ComparisonOracle
};
