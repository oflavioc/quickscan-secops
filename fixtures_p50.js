/* ============================================================================
   FIXTURES P50 — PHASE 5.0 · microfases 5.0.1 + 5.0.2 + 5.0.3
   Namespace fechado P50-F* (spec §26). Existem, nesta ordem de criação:
     5.0.1  P50-F1 · P50-F2 · P50-F6
     5.0.2  P50-F8 · P50-F10
     5.0.3  P50-F3 · P50-F4 · P50-F5
   P50-F7 e P50-F9 NÃO são criadas — nem como placeholder (§17.3 da diretriz).

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

/* ---------------------------------------------------------------------------
   P50-F8 · Rich notes  (microfase 5.0.2)
   Texto longo, Unicode fora do BMP, marcas combinantes, pontuação extensa,
   quebras de linha. Exercita UI-006/UI-007 e a renderização inerte (UI-049).
--------------------------------------------------------------------------- */
const P50_F8 = (() => {
  const v = nulls();
  v[0] = 2; v[1] = 1; v[3] = 3;
  const notes = {};
  notes[0] = "MSSP cobre 8×5; plantão interno fora do horário — SLA P1 = 30 min.\n" +
             "Contatos: NOC (ramal 4021) & SOC (ramal 4022).\n" +
             "Observação: “governança” revisada em 12/03; pendências: 3 (três).";
  notes[1] = "Unicode: 😀🇧🇷 àéîõü ﬁ ligature · combinantes: a\u0301e\u0300 · " +
             "matemático: 𝕏 𝔸 · RTL: \u200Fשלום\u200E · zero-width:\u200B fim.";
  notes[3] = ("Parágrafo longo. ").repeat(60) + "FIM-DO-TEXTO-LONGO";
  return { id: "P50-F8", name: "Rich notes", vec: v, notes, landscape: "UNSET", focusQuestion: 0 };
})();

/* ---------------------------------------------------------------------------
   P50-F10 · Adversarial content  (microfase 5.0.2)
   Payloads da UI-049. NENHUM deve produzir nó executável, atributo de evento
   ou escape de contexto na superfície nova.
--------------------------------------------------------------------------- */
const P50_ADVERSARIAL = [
  "<script>window.__p50_pwned=1;<\/script>",
  "<img src=x onerror=\"window.__p50_pwned=1\">",
  "<svg/onload=window.__p50_pwned=1>",
  "\" onmouseover=\"window.__p50_pwned=1\" x=\"",
  "' onfocus='window.__p50_pwned=1' y='",
  "</textarea><script>window.__p50_pwned=1;<\/script>",
  "<iframe src=javascript:window.__p50_pwned=1></iframe>",
  "a < b && c > d — ampersand &amp; &lt; &gt; &#39; &quot;",
  "javascript:window.__p50_pwned=1",
  "\u2028\u2029 separadores de linha Unicode",
  "</div></section><h1>injetado</h1>",
  "&#60;script&#62;window.__p50_pwned=1&#60;/script&#62;"
];
const P50_F10 = (() => {
  const v = nulls();
  v[0] = 0; v[1] = "NA"; v[2] = 3;
  const notes = {};
  P50_ADVERSARIAL.forEach((payload, i) => { notes[i % N] = payload; });
  notes[0] = P50_ADVERSARIAL.join(" \n ");        /* pergunta em foco: todos juntos */
  return { id: "P50-F10", name: "Adversarial content", vec: v, notes, landscape: "UNSET", focusQuestion: 0 };
})();

/* ---------------------------------------------------------------------------
   P50-F3 · Near threshold  (microfase 5.0.3)
   Contagens confirmadas por domínio: [1, 3, 2, 2, 2] · total 10.
   O requisito GLOBAL está satisfeito (10 de 10) e ainda assim o veredito é
   INSUFICIENTE: Negócio permanece com 1 de 2 respostas confirmadas.
   É a prova de que atingir o total global não basta.
--------------------------------------------------------------------------- */
const P50_F3 = (() => {
  const v = nulls();
  v[0] = 2;                          /* Negócio    · 1 confirmada  (déficit 1) */
  v[3] = 1; v[4] = 2; v[5] = 3;      /* Pessoas    · 3 confirmadas             */
  v[6] = 1; v[7] = 2;                /* Processos  · 2 confirmadas             */
  v[9] = 2; v[10] = 1;               /* Tecnologia · 2 confirmadas             */
  v[12] = 3; v[13] = 2;              /* Serviços   · 2 confirmadas             */
  return { id: "P50-F3", name: "Near threshold", vec: v, landscape: "UNSET",
           screen: "results", focusQuestion: 0 };
})();

/* ---------------------------------------------------------------------------
   P50-F4 · Exactly sufficient  (microfase 5.0.3)
   Contagens confirmadas por domínio: [2, 2, 2, 2, 2] · total 10.
   Boundary mínimo exato do gate canônico: qualquer remoção de uma confirmação
   volta a bloquear.
--------------------------------------------------------------------------- */
const P50_F4 = (() => {
  const v = nulls();
  v[0] = 2; v[1] = 1;
  v[3] = 1; v[4] = 2;
  v[6] = 2; v[7] = 1;
  v[9] = 2; v[10] = 3;
  v[12] = 1; v[13] = 2;
  return { id: "P50-F4", name: "Exactly sufficient", vec: v, landscape: "UNSET",
           screen: "results", focusQuestion: 0 };
})();

/* ---------------------------------------------------------------------------
   P50-F5 · Fully sufficient  (microfase 5.0.3)
   Contagens confirmadas por domínio: [3, 3, 3, 3, 3] · total 15.
   Cobertura completa; nenhum déficit global ou por domínio.
--------------------------------------------------------------------------- */
const P50_F5 = (() => {
  const v = nulls();
  const lv = [2, 1, 3, 1, 2, 3, 2, 3, 1, 3, 2, 1, 2, 1, 3];
  for (let k = 0; k < N; k++) v[k] = lv[k];
  return { id: "P50-F5", name: "Fully sufficient", vec: v, landscape: "UNSET",
           screen: "results", focusQuestion: 0 };
})();

const P50_FIXTURES = { "P50-F1": P50_F1, "P50-F2": P50_F2, "P50-F3": P50_F3,
                       "P50-F4": P50_F4, "P50-F5": P50_F5, "P50-F6": P50_F6,
                       "P50-F8": P50_F8, "P50-F10": P50_F10 };

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
function p50ApplyVec(w, vec, notes) {
  P50_QIDS.forEach((id, k) => w.__DEV.setAnswerById(id, vec[k]));
  if (notes) Object.keys(notes).forEach(k => w.__DEV.setNote(Number(k), notes[k]));
}

/* Navega até a pergunta de índice k (0..13) deixando o vetor da fixture no ar.
   Estratégia (somente controles congelados): avança até k+2 respondendo
   temporariamente, aplica o vetor real e volta com ArrowLeft — cada volta
   dispara render(), portanto o render final reflete o vetor da fixture. */
function p50GotoQuestion(w, d, vec, k, notes) {
  if (k < 0 || k > 13) throw new Error("p50GotoQuestion: k fora de 0..13 (limite do caminho congelado)");
  w.__DEV.setArq(0);
  d.querySelector("#start").click();          /* step 0 · ponto de partida */
  p50Key(w, d, "Enter");                      /* step 1 · pergunta 1       */
  const forward = k + 2;
  for (let s = 1; s < forward; s++) { p50Key(w, d, "1"); p50Key(w, d, "Enter"); }
  p50ApplyVec(w, vec, notes);
  let guard = 0;
  while (p50Step(d) > k + 1 && guard++ < 40) p50Key(w, d, "ArrowLeft");
  if (p50Step(d) !== k + 1) throw new Error("p50GotoQuestion: step " + p50Step(d) + " != " + (k + 1));
}

function p50ApplyFixture(w, d, fx) {
  p50GotoQuestion(w, d, fx.vec, fx.focusQuestion, fx.notes);
  return fx;
}

/* Aplica a fixture e alcança a tela de RESULTADOS pelo owner canônico de
   respostas + a rota congelada de resultados (mesma usada por realExport da
   5.0.2). Não escreve derivado algum e não toca em suficiência. */
function p50ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  p50ApplyVec(w, fx.vec, fx.notes);
  w.__DEV.showResults();
  return fx;
}

/* Validação ESTRUTURAL das contagens declaradas de cada fixture: se o vetor
   deixar de produzir as contagens documentadas, a fixture falha aqui — nunca
   silenciosamente dentro de um gate. Oracle independente (p50ConfirmedByDomain). */
const P50_FIXTURE_COUNTS = {
  "P50-F1": [0, 0, 0, 0, 0],
  "P50-F2": [2, 1, 0, 1, 0],
  "P50-F3": [1, 3, 2, 2, 2],
  "P50-F4": [2, 2, 2, 2, 2],
  "P50-F5": [3, 3, 3, 3, 3],
  "P50-F6": [1, 0, 0, 0, 0]
};
function p50AssertFixtureCounts() {
  Object.keys(P50_FIXTURE_COUNTS).forEach(id => {
    const got = p50ConfirmedByDomain(P50_FIXTURES[id].vec);
    const want = P50_FIXTURE_COUNTS[id];
    if (got.join(",") !== want.join(","))
      throw new Error(id + ": contagens [" + got + "] != declaradas [" + want + "]");
  });
  return true;
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
  P50_F1, P50_F2, P50_F3, P50_F4, P50_F5, P50_F6, P50_F8, P50_F10,
  P50_FIXTURES, P50_ADVERSARIAL, P50_FIXTURE_COUNTS,
  p50Step, p50Key, p50ApplyVec, p50GotoQuestion, p50ApplyFixture, p50ApplyResults,
  p50ConfirmedByDomain, p50ConfirmedTotal, p50AssertFixtureCounts
};
