/* ============================================================================
   FIXTURES P50 — PHASE 5.0 · microfase 5.0.1
   Namespace fechado P50-F* (spec §26). Nesta microfase existem SOMENTE
   P50-F1, P50-F2 e P50-F6 (decisão do proprietário, errata 5.0.1 §2/AMB-6).
   P50-F3, F4, F5, F7, F8, F9, F10 NÃO são criadas aqui — nem como placeholder.
   O arquivo é ampliado nas microfases seguintes até conter P50-F1..P50-F10.

   Nenhuma fixture inventa estado canônico: um vetor de 15 posições
   (null | 0..3 | "NA") é aplicado pelos owners reais do runtime congelado.
   ========================================================================== */
"use strict";

/* Identidade canônica congelada do question bank (ordem de QS).
   NÃO é fonte de verdade: gateQuestionBank() confere estes valores contra o
   runtime real antes de qualquer uso, e falha se divergirem. */
const P50_QIDS = ["mandate", "governance", "policies",
                  "team-capacity", "training", "knowledge",
                  "incident-response", "detection-lifecycle", "automation",
                  "logs", "endpoint", "network-visibility",
                  "monitoring-coverage", "external-surface", "vulnerability-management"];
const P50_DOM_OF = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
const P50_DOM_PT = ["Negócio", "Pessoas", "Processos", "Tecnologia", "Serviços"];
const P50_DOM_EN = ["Business", "People", "Process", "Technology", "Services"];
const P50_SCORES = [0, 1.7, 3.3, 5];

const N = P50_QIDS.length;
const nulls = () => new Array(N).fill(null);

/* ---------------------------------------------------------------------------
   P50-F1 · Blank assessment
   Todas as 15 respostas null; landscape permanece integralmente UNSET
   (estado inicial do runtime — nenhuma capability é declarada pela fixture).
   Uso em 5.0.1: P50-SUF2, P50-UX10 (estado `null`), sidebar em branco.
--------------------------------------------------------------------------- */
const P50_F1 = {
  id: "P50-F1",
  name: "Blank assessment",
  vec: nulls(),
  landscape: "UNSET",
  focusQuestion: 0
};

/* ---------------------------------------------------------------------------
   P50-F2 · Partial insufficient
   4 respostas confirmadas + 1 "NA": gate canônico de suficiência FECHADO
   (confirmedCount()=4 < 10). Serviços inteiro não avaliado -> n/d.
   Uso em 5.0.1: P50-UX1, P50-UX6, P50-UX9, P50-SUF2, P50-ACC6.
--------------------------------------------------------------------------- */
const P50_F2 = (() => {
  const v = nulls();
  v[0] = 1;      /* Negócio    · mandate            confirmado */
  v[1] = 2;      /* Negócio    · governance         confirmado */
  v[3] = 0;      /* Pessoas    · team-capacity      confirmado nível 0 (pontua 0) */
  v[6] = "NA";   /* Processos  · incident-response  não pontua */
  v[9] = 3;      /* Tecnologia · logs               confirmado */
  /* Serviços (12,13,14) permanece null -> n/d */
  return { id: "P50-F2", name: "Partial insufficient", vec: v, landscape: "UNSET", focusQuestion: 1 };
})();

/* ---------------------------------------------------------------------------
   P50-F6 · Três estados de resposta lado a lado no MESMO domínio
   Negócio: mandate=null · governance="NA" · policies=0
   Prova que os três estados do eixo de respostas coexistem e são distintos.
   Uso em 5.0.1: P50-UX10, P50-SUF2, P50-ACC6.
--------------------------------------------------------------------------- */
const P50_F6 = (() => {
  const v = nulls();
  v[0] = null;   /* não avaliado          */
  v[1] = "NA";   /* não sei · validar     */
  v[2] = 0;      /* confirmado, pontua 0  */
  return { id: "P50-F6", name: "Três estados de resposta", vec: v, landscape: "UNSET", focusQuestion: 2 };
})();

const P50_FIXTURES = { "P50-F1": P50_F1, "P50-F2": P50_F2, "P50-F6": P50_F6 };

/* ===================== aplicação sobre o runtime real ===================== */

/* step corrente lido do progresso congelado (#ptext: "NN / 16 · ...").
   Evita depender de posição de source e de qualquer símbolo não exposto. */
function p50Step(d) {
  const box = d.querySelector("#progbox");
  if (!box || box.classList.contains("hidden")) return -1;
  const t = (d.querySelector("#ptext") || {}).textContent || "";
  const m = t.match(/^(\d+)\s*\//);
  if (!m) return null;
  return parseInt(m[1], 10) - 1;
}

function p50Key(w, d, key, target) {
  const ev = new w.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  (target || d).dispatchEvent(ev);
  return ev;
}

/* Aplica o vetor pelos owners canônicos do runtime (API DEV congelada).
   NÃO renderiza — a renderização é provocada por navegação real. */
function p50ApplyVec(w, vec) {
  P50_QIDS.forEach((id, k) => w.__DEV.setAnswerById(id, vec[k]));
}

/* Navega até a pergunta de índice k (0..13) deixando o vetor da fixture no ar.
   Estratégia (somente controles congelados): avança até k+2 respondendo
   temporariamente, aplica o vetor real e volta com ArrowLeft — cada volta
   dispara render(), portanto o render final reflete o vetor da fixture. */
function p50GotoQuestion(w, d, vec, k) {
  if (k < 0 || k > 13) throw new Error("p50GotoQuestion: k fora de 0..13 (limite do caminho congelado)");
  w.__DEV.setArq(0);
  d.querySelector("#start").click();          /* step 0 · ponto de partida */
  p50Key(w, d, "Enter");                      /* step 1 · pergunta 1       */
  const forward = k + 2;
  for (let s = 1; s < forward; s++) { p50Key(w, d, "1"); p50Key(w, d, "Enter"); }
  p50ApplyVec(w, vec);
  let guard = 0;
  while (p50Step(d) > k + 1 && guard++ < 40) p50Key(w, d, "ArrowLeft");
  if (p50Step(d) !== k + 1) throw new Error("p50GotoQuestion: step " + p50Step(d) + " != " + (k + 1));
}

function p50ApplyFixture(w, d, fx) {
  p50GotoQuestion(w, d, fx.vec, fx.focusQuestion);
  return fx;
}

/* Oráculo independente: contagem de confirmadas por domínio a partir do vetor,
   recalculada aqui, sem chamar domStat()/confirmedCount(). */
function p50ConfirmedByDomain(vec) {
  return [0, 1, 2, 3, 4].map(i =>
    vec.filter((v, k) => P50_DOM_OF[k] === i && v !== null && v !== "NA").length);
}
function p50ConfirmedTotal(vec) {
  return vec.filter(v => v !== null && v !== "NA").length;
}

module.exports = {
  P50_QIDS, P50_DOM_OF, P50_DOM_PT, P50_DOM_EN, P50_SCORES,
  P50_F1, P50_F2, P50_F6, P50_FIXTURES,
  p50Step, p50Key, p50ApplyVec, p50GotoQuestion, p50ApplyFixture,
  p50ConfirmedByDomain, p50ConfirmedTotal
};
