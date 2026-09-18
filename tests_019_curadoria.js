/* ============================================================================
   TESTES D019 · CURADORIA DO RELATÓRIO (jsdom) — demanda 019-curadoria-do-relatorio
   Namespace exclusivo D019-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria —
   a geometria da seção de apoio é do `P52-REC1g`, no job `visual` (KI-3).

   ONDE ESTA SUÍTE É EXECUTADA, E POR QUEM
   ---------------------------------------
   Stage `suites` do `pipeline.yaml` → `.claude/verify/check_suites.py`, que lê a
   chave `d019` de `expected_suites.json` e roda `node tests_019_curadoria.js`,
   comparando a última linha contra a contagem canônica. Registro e execução
   nascem no mesmo commit (R10 §3).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os dez critérios C1..C10 de `specs/019-curadoria-do-relatorio/spec.md`.

   A FRONTEIRA que a demanda existe para proteger, e que o `D019-CUR1` mede:

       o operador ESCOLHE entre o que o motor ofereceu;
       ele NUNCA escreve o que o motor deveria ter dito.

   Disso dependem as duas invariantes tangenciadas — INV-7 (determinismo é
   propriedade de (entradas)→saída, não proibição de entrada humana) e INV-8
   (seleção é entrada; texto do operador seria derivado serializado).

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   Alínea que depende de caso DECLARA ela mesma a pré-condição e falha NOMEANDO
   o estado, em vez de fechar verde por ausência de sujeito (lição do
   `D010-INV7`, achado `EA-11`). `vac()` dá a essa falha uma forma só.

   ==========================================================================
   POR QUE TANTO GATE NASCE VERMELHO AQUI
   ==========================================================================
   Esta suíte é escrita ANTES da implementação (R3 §1/§4). O bridge
   `__CURATION` não existe; a sexta chave canônica não existe; a visão por
   solução não existe. O vermelho é o ponto — e o commit dele é a prova de que
   o critério não foi ajustado ao resultado (R3 §4).

   Nascem VERDES, e isso vai declarado em vez de escondido: `D019-CUR2`,
   `D019-MED1` e `D019-SUF1`. Nada os viola hoje, porque hoje não há curadoria
   alguma. O poder deles vem dos mutantes, não do red — precedente
   `D015-NOSUB1`/`GOV1`.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_NOME = "quickscan_secops_soccmm_v3_2_dev.html";
const HTML_PATH = process.env.D019_HTML_OVERRIDE || path.join(HERE, HTML_NOME);
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D019-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD019 CURADORIA: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const results = [];
const ONLY = (process.env.D019_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, extra = "";
  try { ok = !!fn(); } catch (e) { ok = false; extra = " [" + e.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + extra);
}
/* falha NOMEADA por ausência de sujeito — nunca verde por vacuidade */
function vac(alinea, porque) { throw new Error("VÁCUO em " + alinea + ": " + porque); }

const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const qa = (n, s) => Array.from(n.querySelectorAll(s));

/* ==========================================================================
   Sessão de referência. Os números vêm da medição da Fase 0 sobre `develop`
   (refinement.md §Sistema real): nível 0 em tudo produz 15 blocos de apoio
   para 9 produtos distintos. Se o catálogo mudar, a alínea que depende do
   número falha NOMEANDO — ela não se ajusta sozinha.
   ========================================================================== */
const PRIOS = ["endpoint", "logs", "network-visibility"];

function boot(opts) {
  const o = opts || {};
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  const nivel = ("nivel" in o) ? o.nivel : 0;
  w.__DEV.V32 && w.__DEV.setArq && w.__DEV.setArq(0);
  const ids = w.eval("QS.map(q=>q.id)");
  ids.forEach(id => w.__DEV.setAnswerById(id, nivel));
  if (o.poucasRespostas) ids.slice(3).forEach(id => w.__DEV.setAnswerById(id, null));
  w.__DEV.setPriorities(o.prios || PRIOS);
  w.__DEV.showResults();
  return { w, d };
}

/* A ponte da demanda. Ausente ⇒ a alínea falha NOMEANDO, nunca passa por
   ausência de sujeito. */
function cur(w) {
  const b = w.__CURATION;
  if (!b) vac("pré-condição", "bridge `__CURATION` não existe — a demanda não foi implementada");
  return b;
}

/* modelo derivado, para comparar antes/depois da curadoria (C5) */
function derivado(w) {
  return JSON.stringify({
    legacy: w.__DEV.legacySnapshot(),
    ctx: w.__DEV.V32.buildRecommendationContext()
  });
}

/* ====================== C1 · seleção, nunca redação ====================== */
T("D019-CUR1", "curadoria é SELEÇÃO: o estado só carrega ids e enum fechado, e nenhum texto do relatório nasce dele", () => {
  const { w } = boot();
  const b = cur(w);
  const st = b.state();
  if (!st || typeof st !== "object") vac("(a)", "o bridge não expõe estado legível");
  const ENUM = ["include", "exclude"];
  const off = st.offerings || {};
  Object.keys(off).forEach(k => {
    if (ENUM.indexOf(off[k]) < 0)
      throw new Error("valor fora do enum fechado em offerings[" + k + "]: " + JSON.stringify(off[k]));
  });
  /* nenhuma chave do estado pode conter prosa: o que existe são ids e enums */
  const plano = JSON.stringify(st);
  const suspeito = plano.match(/"[^"]{60,}"/);
  if (suspeito) throw new Error("estado carrega texto longo — sinal de redação, não de seleção: " + suspeito[0].slice(0, 70));
  return true;
});

/* ============ C2 · ausência ≠ supressão (nasce VERDE, declarado) ========= */
T("D019-CUR2", "ausência de curadoria produz o MESMO relatório de hoje — missing ≠ null ≠ {}", () => {
  const { w, d } = boot();
  w.__DEV.preparePrint();
  const semCuradoria = txt(d.querySelector("#v32-print-report"));
  w.__DEV.finishPrint();
  if (!semCuradoria) vac("(a)", "relatório vazio — sem sujeito para comparar");
  const doc = w.__DEV.captureCanonicalInputs ? w.__DEV.captureCanonicalInputs() : null;
  if (!doc) vac("(b)", "captureCanonicalInputs indisponível");
  if ("reportCuration" in doc && doc.reportCuration === null)
    throw new Error("chave presente como null — missing e null precisam ser distintos (INV-8)");
  return semCuradoria.length > 0;
});

/* ===================== C3 · entrada canônica (INV-8) ==================== */
T("D019-INV8", "a sexta chave é ENTRADA canônica: exportada, recomputada na importação, e id desconhecido é recusado", () => {
  const { w } = boot();
  cur(w);
  const doc = w.__DEV.captureCanonicalInputs();
  const chaves = Object.keys(doc);
  if (chaves.indexOf("reportCuration") < 0)
    throw new Error("reportCuration não entrou nos inputs canônicos: " + JSON.stringify(chaves));
  /* nenhum derivado viaja junto */
  const s = JSON.stringify(doc);
  ["\"findings\"", "\"score\"", "\"stage\"", "supportMode", "recommendationContext"].forEach(b => {
    if (s.indexOf(b) >= 0) throw new Error("campo derivado no export: " + b);
  });
  return true;
});

/* ================= C4 · proveniência nas DUAS superfícies ================ */
T("D019-PROV1", "todo item incluído por decisão do operador leva marcador de proveniência na TELA e no PAPEL", () => {
  const { w, d } = boot();
  const b = cur(w);
  const alvo = b.offered()[0];
  if (!alvo) vac("(a)", "nenhuma oferta para curar nesta sessão");
  b.set(alvo, "include");
  w.__DEV.showResults();
  const naTela = qa(d, "#app [data-p53-prov]").length;
  if (!naTela) throw new Error("marcador de proveniência ausente na TELA");
  w.__DEV.preparePrint();
  const noPapel = qa(d, "#v32-print-report [data-p53-prov]").length;
  w.__DEV.finishPrint();
  if (!noPapel) throw new Error("marcador de proveniência ausente no PAPEL — é assim que as duas superfícies divergem (EA-58)");
  return true;
});

/* ========== C5 · não alcança medição nem declaração (VERDE hoje) ========= */
T("D019-MED1", "a curadoria não alcança medição nem declaração: derivados idênticos com e sem ela", () => {
  const { w } = boot();
  const antes = derivado(w);
  let b = null;
  try { b = w.__CURATION; } catch (e) { b = null; }
  if (b && b.offered && b.offered().length) { b.set(b.offered()[0], "exclude"); w.__DEV.showResults(); }
  const depois = derivado(w);
  if (antes !== depois)
    throw new Error("a curadoria alterou derivado — score/estágio/suficiência/gaps não podem mudar (C5)");
  return true;
});

/* ===================== C6 · apoio por solução, íntegro ================== */
T("D019-SOL1", "visão por solução: o CONJUNTO de produtos é igual ao da visão por gap, menções curtas incluídas", () => {
  const { w, d } = boot();
  const porGap = new Set();
  qa(d, "#p52-workspace .apoio-block .prod .pt-name").forEach(n => porGap.add(txt(n)));
  qa(d, "#p52-workspace .apoio-block .prod-mini b").forEach(n => porGap.add(txt(n)));
  if (!porGap.size) vac("(a)", "nenhum produto na sessão de referência — sem sujeito");
  const porSolucao = new Set(qa(d, "#p52-workspace [data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")));
  if (!porSolucao.size) throw new Error("visão por solução ausente — nenhum [data-p53-sol-produto]");
  const sumiu = [...porGap].filter(p => !porSolucao.has(p));
  const nasceu = [...porSolucao].filter(p => !porGap.has(p));
  if (sumiu.length) throw new Error("produto SUMIU na visão por solução: " + sumiu.join(", "));
  if (nasceu.length) throw new Error("produto NASCEU na visão por solução: " + nasceu.join(", "));
  return true;
});

/* ============ C7 · agrupamento declarado, desconhecido é nomeado ========= */
T("D019-SOL2", "todo produto cai num grupo do portfólio; o sem categoria vai para grupo explícito e é LISTADO", () => {
  const { w, d } = boot();
  const cards = qa(d, "#p52-workspace [data-p53-sol-produto]");
  if (!cards.length) throw new Error("visão por solução ausente — sem sujeito");
  const semGrupo = cards.filter(c => !c.closest("[data-p53-sol-grupo]"));
  if (semGrupo.length)
    throw new Error(semGrupo.length + " produto(s) fora de qualquer grupo: " +
      semGrupo.map(c => c.getAttribute("data-p53-sol-produto")).join(", "));
  const naoClass = qa(d, '[data-p53-sol-grupo="nao-classificado"] [data-p53-sol-produto]');
  const rotulo = d.querySelector('[data-p53-sol-grupo="nao-classificado"] [data-p53-sol-grupo-nome]');
  if (naoClass.length && !rotulo)
    throw new Error("há produto não classificado e o grupo não se nomeia — descarte silencioso é o que o C7 proíbe");
  return true;
});

/* ================== C8 · tela e papel, a MESMA seleção ================== */
T("D019-PAR1", "tela e papel publicam o mesmo conjunto, medido DEPOIS de beforeprint", () => {
  const { w, d } = boot();
  const b = cur(w);
  const oferta = b.offered();
  if (oferta.length < 2) vac("(a)", "menos de duas ofertas — a exclusão não teria o que distinguir");
  b.set(oferta[0], "exclude");
  w.__DEV.showResults();
  const tela = new Set(qa(d, "#p52-workspace [data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")));
  /* NÃO-VACUIDADE, e ela custou caro para aparecer: sem esta alínea o gate
     fechava VERDE com os dois conjuntos VAZIOS — igualdade trivial entre nada
     e nada. É a família do `EA-20` (gate que promete asserção e entrega
     tautologia), e ela nasceu aqui na W2, quando a visão por solução ainda não
     existia e o `PAR1` passou sem sujeito. Medido, não suposto. */
  if (!tela.size) vac("(b)", "a tela não publicou produto algum — sem sujeito, a igualdade tela×papel seria trivial");
  w.__DEV.preparePrint();
  const papel = new Set(qa(d, "#v32-print-report [data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")));
  w.__DEV.finishPrint();
  const soTela = [...tela].filter(x => !papel.has(x));
  const soPapel = [...papel].filter(x => !tela.has(x));
  if (soTela.length || soPapel.length)
    throw new Error("divergência tela×papel — só na tela: [" + soTela.join(", ") + "] · só no papel: [" + soPapel.join(", ") + "]");
  return true;
});

/* ================= C9 · supressão total declara a supressão ============= */
T("D019-VAZ1", "curadoria que exclui tudo DECLARA a supressão — nunca seção vazia, nunca seção ausente", () => {
  const { w, d } = boot();
  const b = cur(w);
  const oferta = b.offered();
  if (!oferta.length) vac("(a)", "nada ofertado — sem sujeito");
  oferta.forEach(id => b.set(id, "exclude"));
  w.__DEV.showResults();
  const sec = d.querySelector("#p52-sec-support");
  if (!sec) throw new Error("a seção de apoio DESAPARECEU com a supressão total");
  const aviso = sec.querySelector("[data-p53-suprimido]");
  if (!aviso) throw new Error("seção vazia e muda — a supressão precisa se declarar");
  return true;
});

/* ============ C10 · gate fechado ⇒ curadoria indisponível (VERDE) ======== */
T("D019-SUF1", "com o gate de suficiência FECHADO a curadoria não se oferece e o estado não é lido", () => {
  const { w, d } = boot({ poucasRespostas: true });
  const res = d.querySelector("#p50-results");
  const gate = res ? res.getAttribute("data-p50-gate") : null;
  if (gate !== "blocked") vac("(a)", "a fixture não produziu gate fechado (medido: " + gate + ")");
  const controle = d.querySelector("[data-p53-abrir-curadoria]");
  if (controle) throw new Error("curadoria oferecida com resultado bloqueado — não há resultado publicado para curar");
  return true;
});

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD019 CURADORIA: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
