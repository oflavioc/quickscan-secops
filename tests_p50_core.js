/* ============================================================================
   TESTES P50 · CORE (jsdom) — PHASE 5.0 · microfase 5.0.1
   Namespace exclusivo P50-<ÁREA><N> (spec §25.1). Nenhum ID fora da tabela
   normativa de reserva; nenhuma continuação de S114+/RCE5+/CDx/FRx/UG*.

   Gates desta microfase:
     governança   P50-GOV1 · P50-GOV2 · P50-GOV3
     experiência  P50-UX1 · P50-UX2 · P50-UX6 · P50-UX9 · P50-UX10 · P50-UX13
     suficiência  P50-SUF0 .. P50-SUF8  (SUF7/SUF8 exaustivos, 1024 vetores)
     sessão       P50-SESUX1A
     identidade   P50-COR1 · P50-COR2 · P50-IC3

   Oracle: os invariantes e as equações de contagem/estado são recalculados
   AQUI, a partir do vetor da fixture, sem chamar domStat()/confirmedCount()/
   dataSufficiency(). As funções e o DOM reais do runtime são os objetos
   submetidos à comparação.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { JSDOM } = require("jsdom");
const FX = require("./fixtures_p50.js");

const HERE = __dirname;
const HTML_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const SHELL_JS = path.join(HERE, "ui_p50_shell_v32.js");
const SHELL_CSS = path.join(HERE, "ui_p50_v32.css");
const SUFF_JS = path.join(HERE, "ui_p50_suff_v32.js");
const RESULTS_JS = path.join(HERE, "ui_p50_results_v32.js");
/* Camada derivada de suficiência: ÚNICO módulo autorizado a declarar limiares. */
const P50_SUFF_MODULE = SUFF_JS;
/* Renderers: nenhum deles pode declarar limiar, comparar contagem ou derivar
   veredito próprio (UI-012A §regras de consumo; P50-SUF0 prospectivo). */
const P50_RENDERER_MODULES = [SHELL_JS, RESULTS_JS, SHELL_CSS];
/* Renderer DO GATE: além do acima, consome EXCLUSIVAMENTE o contrato — não lê
   a contagem canônica para reconstruir mensagem alguma (§5.4 da diretriz).
   O shell não é renderer de gate: ele exibe a moeda canônica (UI-009A) sem
   possuir veredito, e por isso pode ler domStat().n para a contagem exibida. */
const P50_GATE_RENDERER = RESULTS_JS;
const P50_NEW_MODULES = [SHELL_JS, SUFF_JS, RESULTS_JS, SHELL_CSS];

const results = [];
/* Filtro OPCIONAL de execução (P50_ONLY="P50-SUF7,P50-SUF3").
   Existe exclusivamente para a campanha de mutação, em que só o gate esperado
   precisa ser executado por mutante. Sem a variável, a suíte executa tudo —
   nenhum gate é enfraquecido, apenas não é invocado nessa passagem. */
const ONLY = (process.env.P50_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, err = "";
  try { ok = !!fn(); } catch (x) { err = " [" + x.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + err);
}
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const readIf = p => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
const boot = () => {
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  return { w: dom.window, d: dom.window.document };
};
const q = (d, s) => d.querySelector(s);
const qa = (d, s) => Array.from(d.querySelectorAll(s));
const txt = el => (el ? (el.textContent || "").trim() : "");
const accName = el => (el ? (el.getAttribute("aria-label") || (el.textContent || "").trim()) : "");
const answersOf = w => w.__DEV.captureCanonicalInputs().assessment.answers;
const canonical = w => JSON.stringify(w.__DEV.captureCanonicalInputs());

/* ======================= 25.2 · GOVERNANÇA ======================= */

/* Identidade byte-a-byte dos arquivos protegidos da §29.4 no baseline de
   trabalho da §0.A. Qualquer edição de superfície protegida faz o gate FAIL. */
const PROTECTED = {
  "engine_v32.js": "9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a",
  "quickscan_secops_soccmm_v3_1_3.html": "d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82",
  "ui_v32.js": "094db057ff9c91f8705b99dea95ecc7513ca53afa9ed0600e5a2bddbf12c5038",
  "ui_ux_v32.js": "a050401145a5ed7af597eae01a9a23826418119769c096db168b3b177a9d3938",
  "ui_target_v32.js": "cfd85cbb3883c7410c8cd3c0eb4ae1712da8e73ff0a11ec6b436b0bcf94bb4a0",
  "ui_refinement_v32.js": "ade18a9afd265966feb40cb9f2926e20f5ffd2534dcfe7ec602e46cc6d01132c",
  "ui_journey_v32.js": "9005bbc238397f6f63c9351ae69448e335d14113b91dcd6ee40c070043b97775",
  "ui_session_v32.js": "6fd849cdbdbb6838921a1519613e8a5194777c6eeb9e3e102c681a0ddc27164b",
  "ui_icons_v32.js": "32aabc3445571d447189edf4b486239c9256aa9bd0bc6bdab00635a65aa42151",
  "ui_v32.css": "78d68ed05961712b59689a4d4ecb34b15d80ce48cac0539b3e261bff6d4ea2cb",
  "ui_ux_v32.css": "84af670571c7d11bec828636899b94e4f264e376febaaeb8e9ade1a841483b44",
  "generate_icons_v32.py": "1acfe25c2f3ac3e4d76ce42eeb7ceec3108c1d3471c27e8f788e0168b8225bf7",
  "harness_m41_v313.js": "7ec750b293fa7421cd95acf1ff27e3cf7c8c492c6faf03e9f9160734149f14b0",
  "v3_1_3_functional_snapshot.json": "0abeaa7cc3a7e270fde015791a93bfbdb580803a915871e12811585c99555435",
  /* EXCEÇÃO NOMINAL DE BOUNDARY · ERRATA AUTORIZADA UG8 (microfase 5.0.4).
     O proprietário autorizou, por ato explícito e test-only, corrigir o ESCOPO do
     oráculo de UG8 — que coletava `#app` inteiro e capturava o eixo POR PERGUNTA
     da Camada 5, onde UI-016a/A-8/§12.2 exigem literalmente "n/d". A exceção é
     estreita e não extensível: só o bloco de UG8 mudou; UG1..UG7 e UG9..UG13
     permanecem byte-idênticos, a contagem segue 13 e nenhuma asserção foi
     removida. P50-GOV1 continua fixando o arquivo BYTE A BYTE — apenas no valor
     autorizado. Identidade anterior: d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9 */
  "tests_unset_ug.js": "af129900d1c5e2b8f02a9582f4fc8ab26fecc617cc595c9f2a7508000cabcb91",
  "MANIFEST.sha256": "80369148582fab2c82c9504185fac13534f22c723646379d57c040fc6eed417e"
};

T("P50-GOV1", "nenhuma superfície protegida da §29.4 foi alterada (identidade byte-a-byte)", () => {
  const bad = Object.keys(PROTECTED).filter(f => sha(path.join(HERE, f)) !== PROTECTED[f]);
  if (bad.length) throw new Error("protegidos alterados: " + bad.join(", "));
  /* suítes congeladas presentes e não removidas */
  const frozenSuites = ["tests_m42_m86.js", "tests_ui_m31.js", "tests_ui_m32.js", "tests_ui_m33.js",
    "tests_ui_m332.js", "tests_ui_m333.js", "tests_ux_m41.js", "tests_target_m431.js",
    "tests_ref_m44.js", "tests_journey_m45.js", "tests_icons_m46.js", "tests_session_m48.js",
    "tests_unset_ug.js"];
  const missing = frozenSuites.filter(f => !fs.existsSync(path.join(HERE, f)));
  if (missing.length) throw new Error("suíte congelada ausente: " + missing.join(", "));
  if (!fs.existsSync(path.join(HERE, "tests_visual"))) throw new Error("tests_visual/ ausente");
  return true;
});

T("P50-GOV2", "spec normativa, registro de promoção e CLAUDE.md referenciam o mesmo SHA-256", () => {
  const specPath = path.join(HERE, "specs", "PHASE_5_0_REV_B.md");
  const observed = sha(specPath);
  const claude = fs.readFileSync(path.join(HERE, "CLAUDE.md"), "utf8");
  const promo = fs.readFileSync(path.join(HERE, "docs_phase5", "REV_B_PROMOTION_RECORD.md"), "utf8");
  const claudePointsToFile = /specs\/PHASE_5_0_REV_B\.md/.test(claude);
  const promoPointsToFile = /specs\/PHASE_5_0_REV_B\.md/.test(promo);
  const promoHasDate = /Data da promoção:\**\s*\d{4}-\d{2}-\d{2}/.test(promo);
  return claudePointsToFile && promoPointsToFile && promoHasDate &&
    claude.includes(observed) && promo.includes(observed);
});

T("P50-GOV3", "toda âncora simbólica usada por gate novo tem entrada VERIFICADA no mapa de reancoragem", () => {
  const map = fs.readFileSync(path.join(HERE, "docs_phase5", "REV_B_REANCHOR_MAP.md"), "utf8");
  /* âncoras (arquivo, símbolo) das quais os gates desta microfase dependem */
  const anchors = [
    ["Camada 1", "`DOMS` ({en,pt})"],
    ["Camada 1", "`QS` / `opts:[{t,d}×4]`"],
    ["Camada 1", "`confirmedCount()`"],
    ["Camada 1", "`domStat()`"],
    ["Camada 1", "grupo `<button class=\"opt\" data-i aria-pressed>`"],
    ["`ui_v32.js`", "`escAttr` / `esc32`"],
    ["`ui_v32.js`", "wrapper aditivo de `renderResults` / chamada `window.__uxDecor`"],
    ["`ui_v32.js`", "ponte `window.__V32UI`"],
    ["`ui_session_v32.js`", "`captureCanonicalInputs()`"]
  ];
  const lines = map.split("\n");
  const missing = anchors.filter(([file, sym]) => !lines.some(l =>
    l.includes("|") && l.includes(file) && l.includes(sym) && /VERIFICADA/.test(l)));
  if (missing.length) throw new Error("âncora sem entrada verificada: " + JSON.stringify(missing));
  if (!/33\/33 âncoras verificadas/.test(map) || !/0 pendentes/.test(map))
    throw new Error("mapa de reancoragem não está fechado");
  return true;
});

/* ======================= 25.3 · ASSESSMENT EXPERIENCE ======================= */

T("P50-UX1", "cards mapeiam 1:1 os valores canônicos; nada criado, removido ou reordenado", () => {
  const { w, d } = boot();
  w.__DEV.setArq(0);
  q(d, "#start").click();
  FX.p50Key(w, d, "Enter");                                  /* pergunta 1 */
  const expectedVals = ["0", "1", "2", "3", "NA"];
  for (let k = 0; k < FX.P50_QIDS.length; k++) {
    if (FX.p50Step(d) !== k + 1) throw new Error("step inesperado em k=" + k);
    /* o shell precisa ter marcado o grupo de resposta como superfície P50 */
    const group = q(d, "#app .opts[data-p50=\"answers\"]");
    if (!group) throw new Error("grupo de respostas P50 ausente na pergunta " + (k + 1));
    if (group.getAttribute("role") !== "group") throw new Error("role=group ausente");

    let cards = qa(d, "#app .opts .opt");
    if (cards.length !== 5) throw new Error("cardinalidade " + cards.length + " != 5 em k=" + k);
    /* ordem canônica preservada e valores anotados pelo shell */
    const vals = cards.map(b => b.getAttribute("data-p50-value"));
    if (JSON.stringify(vals) !== JSON.stringify(expectedVals))
      throw new Error("ordem/valores " + JSON.stringify(vals) + " em k=" + k);
    /* domínio anunciado corresponde ao question bank canônico */
    const domCur = q(d, "#p50-shell [data-p50=\"domain-current\"]");
    if (!domCur) throw new Error("orientação de domínio ausente");
    if (parseInt(domCur.getAttribute("data-dom"), 10) !== FX.P50_DOM_OF[k])
      throw new Error("domínio anunciado != canônico em k=" + k);

    /* subasserção: provenance do par canônico t/d, na ordem, para as 4 opções */
    for (let i = 0; i < 4; i++) {
      const c = cards[i];
      const t = c.getAttribute("data-p50-opt"), dsc = c.getAttribute("data-p50-optd");
      if (!t || !dsc) throw new Error("provenance t/d ausente em k=" + k + " i=" + i);
      const shownT = txt(c.querySelector(".t")), shownD = txt(c.querySelector(".d"));
      if (t !== shownT) throw new Error("título dessincronizado k=" + k + " i=" + i);
      if (dsc !== shownD) throw new Error("descrição canônica dessincronizada k=" + k + " i=" + i);
    }
    /* os 4 pares t/d são distintos entre si (nenhuma opção duplicada/omitida) */
    const pairs = cards.slice(0, 4).map(c => c.getAttribute("data-p50-opt") + "\u0000" + c.getAttribute("data-p50-optd"));
    if (new Set(pairs).size !== 4) throw new Error("pares t/d não distintos em k=" + k);
    /* opção NA com o contrato canônico */
    if (!cards[4].classList.contains("na")) throw new Error("5º card não é NA em k=" + k);

    /* acionar cada valor canônico e conferir o owner real */
    for (let i = 0; i < expectedVals.length; i++) {
      cards = qa(d, "#app .opts .opt");
      cards[i].click();
      const got = answersOf(w)[FX.P50_QIDS[k]];
      const want = expectedVals[i] === "NA" ? "NA" : i;
      if (got !== want) throw new Error("ans " + JSON.stringify(got) + " != " + JSON.stringify(want) + " k=" + k + " i=" + i);
    }
    /* deixa uma resposta pontuável e avança pelo controle congelado */
    qa(d, "#app .opts .opt")[1].click();
    FX.p50Key(w, d, "Enter");
  }
  return true;
});

T("P50-UX2", "seleção por teclado na superfície nova = mesmo estado canônico do clique, pelo setter congelado", () => {
  const A = boot(), B = boot();
  /* referência: clique */
  FX.p50ApplyFixture(A.w, A.d, FX.P50_F2);
  const cardsA = qa(A.d, "#app .opts .opt");
  cardsA[2].click();
  const refState = canonical(A.w);

  /* superfície nova: ArrowDown/Enter, com observação explícita do caminho congelado */
  FX.p50ApplyFixture(B.w, B.d, FX.P50_F2);
  let cards = qa(B.d, "#app .opts .opt");
  const target = cards[2];
  let frozenCalls = 0;
  const origHandler = target.onclick;
  if (typeof origHandler !== "function") throw new Error("handler congelado ausente no card");
  target.onclick = function (...a) { frozenCalls++; return origHandler.apply(this, a); };

  cards[0].focus();
  FX.p50Key(B.w, B.d, "ArrowDown", cards[0]);
  if (B.d.activeElement !== cards[1]) throw new Error("ArrowDown não moveu o foco (1)");
  FX.p50Key(B.w, B.d, "ArrowDown", cards[1]);
  if (B.d.activeElement !== cards[2]) throw new Error("ArrowDown não moveu o foco (2)");
  const ev = FX.p50Key(B.w, B.d, "Enter", B.d.activeElement);
  if (!ev.defaultPrevented) throw new Error("shell não preveniu a ativação nativa duplicada");
  if (frozenCalls !== 1) throw new Error("caminho congelado invocado " + frozenCalls + " vez(es), esperado 1");
  if (canonical(B.w) !== refState) throw new Error("estado canônico do teclado != do clique");

  /* ArrowUp e Home também movem o foco, sem tocar estado canônico */
  const before = canonical(B.w);
  const cards2 = qa(B.d, "#app .opts .opt");
  cards2[3].focus();
  FX.p50Key(B.w, B.d, "ArrowUp", cards2[3]);
  if (B.d.activeElement !== cards2[2]) throw new Error("ArrowUp não moveu o foco");
  FX.p50Key(B.w, B.d, "Home", B.d.activeElement);
  if (B.d.activeElement !== cards2[0]) throw new Error("Home não moveu o foco");
  return canonical(B.w) === before;
});

T("P50-UX6", "navegação da superfície nova é presentation-only (respostas, notas e prioridades intactas)", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  const before = canonical(w);
  const next = q(d, "#p50-shell button[data-p50=\"next\"]");
  const prev = q(d, "#p50-shell button[data-p50=\"prev\"]");
  if (!next || !prev) throw new Error("controles de navegação P50 ausentes");
  next.click();                                        /* avança pelo #next congelado */
  const afterNext = canonical(w);
  q(d, "#p50-shell button[data-p50=\"prev\"]").click(); /* volta pelo #back congelado */
  const afterPrev = canonical(w);
  if (before !== afterNext) throw new Error("avançar mutou estado canônico");
  if (before !== afterPrev) throw new Error("voltar mutou estado canônico");

  /* 5.0.4 · UI-028 — as tabs de Results são estado APENAS de apresentação.
     Trocar de tab não pode tocar resposta, nota, prioridade, landscape,
     target ou refinement. Oráculo: captureCanonicalInputs() (P50-UX9). */
  FX.p50ApplyResults(w, d, FX.P50_F5);
  const tabs = qa(d, "#p50-results [data-p50=\"tab\"]");
  const WANT_TABS = ["resumo", "dominios", "heatmap", "analise"];
  if (tabs.length !== WANT_TABS.length)
    throw new Error("esperadas " + WANT_TABS.length + " tabs de Results, obtidas " + tabs.length);
  const ids = tabs.map(t => t.getAttribute("data-p50-tab"));
  if (JSON.stringify(ids) !== JSON.stringify(WANT_TABS))
    throw new Error("ordem/ids das tabs: " + JSON.stringify(ids));
  if (ids.some(x => /framework|nist|cis|mapping/i.test(String(x))))
    throw new Error("tab de framework mapping criada — proibida pela §15");
  const labels = tabs.map(t => txt(t));
  if (JSON.stringify(labels) !== JSON.stringify(["Resumo", "Domínios", "Heat Map", "Análise"]))
    throw new Error("rótulos PT-BR das tabs: " + JSON.stringify(labels));
  const beforeTabs = canonical(w);
  WANT_TABS.forEach(id => {
    const btn = q(d, "#p50-results [data-p50=\"tab\"][data-p50-tab=\"" + id + "\"]");
    if (!btn) throw new Error("tab ausente: " + id);
    btn.click();
    if (canonical(w) !== beforeTabs) throw new Error("troca para a tab " + id + " mutou estado canônico");
    const panel = q(d, "#p50-results [data-p50=\"panel\"][data-p50-tab=\"" + id + "\"]");
    if (!panel) throw new Error("painel ausente: " + id);
    if (panel.hasAttribute("hidden")) throw new Error("painel " + id + " continua oculto após seleção");
    if (btn.getAttribute("aria-selected") !== "true")
      throw new Error("aria-selected não acompanhou a tab " + id);
    const others = qa(d, "#p50-results [data-p50=\"panel\"]").filter(x => x !== panel);
    if (others.some(x => !x.hasAttribute("hidden")))
      throw new Error("mais de um painel visível ao selecionar " + id);
  });
  /* nenhuma camada aspecto/capability entre domínio e pergunta (correção A-2) */
  if (qa(d, "#p50-results [data-p50=\"aspect\"], #p50-results [data-aspect]").length)
    throw new Error("camada aspecto/capability criada entre domínio e pergunta");
  return true;
});

T("P50-UX9", "presentation state isolation: colapso da sidebar e foco não alteram inputs canônicos", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  const before = canonical(w);
  const toggle = q(d, "#p50-shell button[data-p50=\"sidebar-toggle\"]");
  if (!toggle) throw new Error("toggle de sidebar ausente");
  const tgl = () => q(d, "#p50-shell button[data-p50=\"sidebar-toggle\"]");
  const state = () => q(d, "#p50-shell").getAttribute("data-p50-collapsed");
  const sidebarHidden = () => {
    const sb = q(d, "#p50-shell [data-p50=\"sidebar\"]");
    return !!sb && sb.hasAttribute("hidden");
  };

  /* (1) estado inicial RECOLHIDO */
  if (state() !== "true") throw new Error("mapa não inicia recolhido: data-p50-collapsed=" + state());
  if (!sidebarHidden()) throw new Error("mapa inicia visível apesar de data-p50-collapsed=true");
  if (!/Mostrar mapa do assessment/.test(txt(tgl())))
    throw new Error("rótulo inicial do botão incorreto: " + txt(tgl()));

  /* (2) abrir */
  tgl().click();
  if (state() !== "false") throw new Error("clique não expandiu o mapa");
  if (sidebarHidden()) throw new Error("mapa expandido continua oculto");
  if (!/Ocultar mapa do assessment/.test(txt(tgl())))
    throw new Error("rótulo do botão não acompanhou a expansão");
  if (qa(d, "#p50-shell [data-p50=\"domain\"]").length !== 5)
    throw new Error("mapa expandido não expõe os 5 domínios");

  /* (3) recolher */
  tgl().click();
  if (state() !== "true") throw new Error("clique não recolheu o mapa");
  if (!sidebarHidden()) throw new Error("mapa recolhido continua visível");

  /* (6) nenhum handler duplicado: N cliques => N transições, sem saltos */
  const seq = [];
  for (let i = 0; i < 4; i++) { tgl().click(); seq.push(state()); }
  if (JSON.stringify(seq) !== JSON.stringify(["false", "true", "false", "true"]))
    throw new Error("handler duplicado ou estado inconsistente: " + JSON.stringify(seq));
  if (d.querySelectorAll("#p50-shell").length !== 1)
    throw new Error("shell duplicado após alternâncias");

  /* (7) coerência após navegar anterior/próxima */
  tgl().click();                                        /* deixa expandido */
  if (state() !== "false") throw new Error("pré-condição: mapa deveria estar expandido");
  q(d, "#p50-shell button[data-p50=\"next\"]").click();
  if (state() !== "false") throw new Error("estado do mapa perdido ao avançar");
  q(d, "#p50-shell button[data-p50=\"prev\"]").click();
  if (state() !== "false") throw new Error("estado do mapa perdido ao voltar");
  if (qa(d, "#p50-shell [data-p50=\"domain\"]").length !== 5)
    throw new Error("mapa perdeu domínios após navegação");
  const cards = qa(d, "#app .opts .opt");
  cards[0].focus();
  FX.p50Key(w, d, "ArrowDown", cards[0]);
  const after = canonical(w);
  if (before !== after) throw new Error("estado canônico alterado por ação de apresentação");

  /* 5.0.4 · o estado de tab é efêmero e NÃO canônico: não entra no documento
     exportado, não sobrevive como owner e não altera score nem suficiência. */
  FX.p50ApplyResults(w, d, FX.P50_F9);
  const beforeTab = canonical(w);
  const scoreOf = () => JSON.stringify(w.__DEV.tgtCurrentProfile());
  const suffOf = () => String(w.__P50SUFF.contract().sufficient);
  const beforeScore = scoreOf(), beforeSuff = suffOf();
  const beforeOv = JSON.stringify(w.__DEV.TARGET.overrides);
  ["heatmap", "analise", "dominios", "resumo"].forEach(id => {
    const btn = q(d, "#p50-results [data-p50=\"tab\"][data-p50-tab=\"" + id + "\"]");
    if (!btn) throw new Error("tab ausente para isolamento: " + id);
    btn.click();
  });
  if (canonical(w) !== beforeTab) throw new Error("tab alterou captureCanonicalInputs()");
  if (scoreOf() !== beforeScore) throw new Error("tab alterou o score canônico");
  if (suffOf() !== beforeSuff) throw new Error("tab alterou o veredito de suficiência");
  if (JSON.stringify(w.__DEV.TARGET.overrides) !== beforeOv)
    throw new Error("tab alterou TARGET_PROFILE.overrides");
  const doc = w.__DEV.captureCanonicalInputs();
  if (JSON.stringify(doc).indexOf("p50-tab") >= 0 || JSON.stringify(doc).indexOf("heatmap") >= 0)
    throw new Error("estado de apresentação vazou para os inputs canônicos");
  /* Oráculos proibidos por P50-UX9 não podem ser usados por este arquivo.
     Os nomes são montados por concatenação para que o literal proibido NUNCA
     apareça contíguo no source e o lint não se auto-detecte. */
  const self = fs.readFileSync(__filename, "utf8");
  const start = self.indexOf('T("P50-UX9"');
  const rest = self.indexOf('\nT("', start + 10);
  const body = self.slice(start, rest < 0 ? self.length : rest);
  if (start < 0) throw new Error("não foi possível isolar o corpo de P50-UX9");
  const forbidden = ["full" + "StateJSON", "build" + "SessionDocument"];
  forbidden.forEach(name => {
    if (new RegExp(name + "\\s*\\(").test(body))
      throw new Error("oráculo proibido por P50-UX9 usado neste gate: " + name + "()");
  });
  if (!/captureCanonicalInputs\s*\(/.test(body))
    throw new Error("oráculo obrigatório captureCanonicalInputs() ausente de P50-UX9");
  return true;
});

T("P50-UX10", "três estados de resposta com DOM, rótulo visível e nome acessível distintos", () => {
  const { w, d } = boot();
  const fx = FX.P50_F6;
  FX.p50ApplyFixture(w, d, fx);
  const items = qa(d, "#p50-shell [data-p50=\"domain\"][data-dom=\"0\"] [data-p50=\"q\"]");
  if (items.length !== 3) throw new Error("esperadas 3 perguntas no domínio 0, obtidas " + items.length);
  const byId = {};
  items.forEach(li => { byId[li.getAttribute("data-qid")] = li; });
  const unset = byId["mandate"], na = byId["governance"], zero = byId["policies"];
  if (!unset || !na || !zero) throw new Error("itens de pergunta ausentes na sidebar");

  const domOf = li => li.getAttribute("data-p50-ans");
  const stateEl = li => li.querySelector("[data-p50=\"q-state\"]");
  const doms = [domOf(unset), domOf(na), domOf(zero)];
  if (JSON.stringify(doms) !== JSON.stringify(["unset", "na", "confirmed"]))
    throw new Error("semântica de DOM: " + JSON.stringify(doms));
  const vis = [txt(stateEl(unset)), txt(stateEl(na)), txt(stateEl(zero))];
  const acc = [accName(stateEl(unset)), accName(stateEl(na)), accName(stateEl(zero))];
  if (new Set(vis).size !== 3) throw new Error("rótulos visíveis não distintos: " + JSON.stringify(vis));
  if (new Set(acc).size !== 3) throw new Error("nomes acessíveis não distintos: " + JSON.stringify(acc));

  /* null nunca vira zero; "NA" nomeado pelo contrato canônico; 0 confirmado é exibido */
  if (!/^n\/d$/.test(vis[0])) throw new Error("estado null deve exibir n/d, obtido: " + vis[0]);
  if (!/Não avaliado/i.test(acc[0])) throw new Error("nome acessível de null sem 'Não avaliado'");
  if (/\b0([.,]0)?\b/.test(vis[0] + " " + acc[0])) throw new Error("estado null renderizado como zero");
  if (!/precisa validar/i.test(acc[1])) throw new Error("NA sem rótulo canônico 'precisa validar'");
  if (!/confirmad/i.test(vis[2] + acc[2])) throw new Error("nível 0 não marcado como confirmado");
  if (!/0([.,]0)?/.test(vis[2] + acc[2])) throw new Error("nível 0 confirmado foi omitido em vez de exibido");
  /* distinção não depende só de cor: data-* + texto presentes em todos */
  if (vis.some(v => v === "")) throw new Error("estado sem rótulo textual");

  /* 5.0.4 · UI-015 — os MESMOS três estados no heat map domínio → pergunta. */
  FX.p50ApplyResults(w, d, fx);
  const cells = qa(d, "#p50-results [data-p50=\"hm-cell\"]");
  if (cells.length !== 15) throw new Error("heat map com " + cells.length + " células (esperadas 15)");
  const byQid = {};
  cells.forEach(c => { byQid[c.getAttribute("data-qid")] = c; });
  const cU = byQid["mandate"], cN = byQid["governance"], cZ = byQid["policies"];
  if (!cU || !cN || !cZ) throw new Error("células do domínio 0 ausentes no heat map");
  const hmState = [cU, cN, cZ].map(c => c.getAttribute("data-p50-ans"));
  if (JSON.stringify(hmState) !== JSON.stringify(["unset", "na", "confirmed"]))
    throw new Error("semântica de DOM no heat map: " + JSON.stringify(hmState));
  const hmVis = [cU, cN, cZ].map(c => txt(c.querySelector("[data-p50=\"hm-state\"]")));
  const hmAcc = [cU, cN, cZ].map(c => accName(c));
  if (new Set(hmVis).size !== 3) throw new Error("rótulos do heat map não distintos: " + JSON.stringify(hmVis));
  if (new Set(hmAcc).size !== 3) throw new Error("nomes acessíveis do heat map não distintos");
  if (!/^n\/d$/.test(hmVis[0])) throw new Error("heat map: null deve exibir n/d, obtido " + hmVis[0]);
  if (cU.hasAttribute("data-p50-level")) throw new Error("heat map: null recebeu nível");
  if (/\b0([.,]0)?\b/.test(hmVis[0])) throw new Error("heat map: null renderizado como zero");
  if (cN.hasAttribute("data-p50-level")) throw new Error("heat map: NA recebeu nível/score");
  if (!/precisa validar/i.test(hmAcc[1])) throw new Error("heat map: NA sem rótulo canônico");
  if (cZ.getAttribute("data-p50-level") !== "0") throw new Error("heat map: nível 0 confirmado ausente");
  if (!/0[.,]0/.test(hmVis[2])) throw new Error("heat map: nível 0 confirmado omitido em vez de plotado");
  /* 0 confirmado é plotado; null nunca fabrica preenchimento */
  if (cU.getAttribute("data-p50-fill") !== "none")
    throw new Error("heat map: célula UNSET fabricou preenchimento");
  if (cZ.getAttribute("data-p50-fill") !== "level")
    throw new Error("heat map: nível 0 confirmado não foi plotado");
  return true;
});

T("P50-UX13", "composição de __uxDecor e do wrapper de render: captura única, predecessor preservado, ordem, idempotência, reentrância, isolamento", () => {
  const { w, d } = boot();
  const order = [];
  if (!w.__P50 || typeof w.__P50.registerDecor !== "function")
    throw new Error("registro P50 de decoradores ausente");
  const diag0 = w.__P50.diag();
  if (diag0.predecessorCaptured !== true) throw new Error("predecessor congelado não foi capturado");

  /* --- (a) owner único de window.__uxDecor: ordem, preservação, isolamento --- */
  let prevCalls = 0;
  w.__P50.__spyPredecessor(() => { prevCalls++; order.push("frozen"); });
  w.__P50.registerDecor(() => { order.push("p50-a"); });
  w.__P50.registerDecor(() => { throw new Error("falha isolada proposital"); });
  w.__P50.registerDecor(() => { order.push("p50-b"); });

  FX.p50ApplyVec(w, FX.P50_F2.vec);
  w.__DEV.setArq(0);
  w.__DEV.showResults();
  if (prevCalls < 1) throw new Error("predecessor não foi invocado");
  if (order[0] !== "frozen") throw new Error("decoração congelada não executou primeiro: " + JSON.stringify(order));
  if (!order.includes("p50-a") || !order.includes("p50-b"))
    throw new Error("isolamento falhou: callback posterior ao que lançou não executou");

  /* (a2) EFEITO REAL do predecessor, não apenas um marcador de ordem.
     A decoração congelada de resultados (uxResultsDecor) recria #ux-execrow.
     Este é o único caminho em que __uxDecor é observável isoladamente: o
     wrapper de render da UX 4.1 refaz a mesma decoração em todo render, de
     modo que só a invocação SEM render prova que o predecessor foi chamado. */
  (function predecessorRealEffect() {
    const appR = q(d, "#app");
    const row = q(d, "#ux-execrow");
    if (!row) throw new Error("pré-condição ausente: #ux-execrow não existe na tela de resultados");
    row.remove();
    if (q(d, "#ux-execrow")) throw new Error("pré-condição inválida: #ux-execrow não foi removido");
    w.__uxDecor(appR);
    if (!q(d, "#ux-execrow"))
      throw new Error("predecessor não foi invocado: decoração congelada não restaurou #ux-execrow");
  })();

  /* --- (b) não recaptura reatribuição posterior --- */
  const aggregator = w.__uxDecor;
  w.__uxDecor = function () { throw new Error("terceiro"); };
  if (w.__P50.diag().recaptured === true) throw new Error("agregador recapturou reatribuição posterior");
  w.__uxDecor = aggregator;

  /* --- (c) idempotência na tela de resultados --- */
  const app = q(d, "#app");
  const before = app.innerHTML;
  w.__uxDecor(app);
  if (app.innerHTML !== before) throw new Error("decoração não idempotente na tela de resultados");

  /* --- (d) wrapper de render: instalação única e efeito do predecessor preservado --- */
  const B = boot();
  const dg = B.w.__P50.diag();
  if (dg.renderInstalled !== true) throw new Error("wrapper de render não instalado");
  if (dg.renderInstallCount !== 1) throw new Error("wrapper instalado " + dg.renderInstallCount + " vezes");
  FX.p50ApplyFixture(B.w, B.d, FX.P50_F2);
  if (B.d.body.dataset.uxscreen !== "question")
    throw new Error("efeito do predecessor (data-uxscreen, UX 4.1) perdido");
  if (!q(B.d, "#app section.screen[data-dom]"))
    throw new Error("efeito do predecessor (uxQuestionDecor) perdido");

  /* --- (e) idempotência do shell na tela de pergunta --- */
  const h1 = q(B.d, "#p50-shell").outerHTML;
  const n1 = B.d.querySelectorAll("#p50-shell").length;
  B.w.__P50.decorate(); B.w.__P50.decorate();
  const h2 = q(B.d, "#p50-shell").outerHTML;
  const n2 = B.d.querySelectorAll("#p50-shell").length;
  if (n1 !== 1 || n2 !== 1) throw new Error("shell duplicado: " + n1 + " -> " + n2);
  if (h1 !== h2) throw new Error("decoração do shell não é idempotente");

  /* --- (f) falha da decoração P50 não impede render congelado --- */
  B.w.__P50.__forceShellFailure(true);
  FX.p50Key(B.w, B.d, "ArrowLeft");
  if (B.d.body.dataset.uxscreen !== "question") throw new Error("falha do shell quebrou o render congelado");
  if (!q(B.d, "#app .opts .opt")) throw new Error("falha do shell quebrou a tela congelada");
  B.w.__P50.__forceShellFailure(false);

  /* --- (g) REENTRÂNCIA REAL disparada por decorador registrado ---
     Cenário do blocker da auditoria: um decorador registrado via
     registerDecor() chama render(); render() reentra em window.__uxDecor por
     dentro de p50PrevRender, ANTES de p50AfterRender entrar na pilha. Sem
     guard na composição, a lista de decoradores reexecuta recursivamente.
     O CAP torna a detecção determinística e limitada — nunca um travamento. */
  (function realDecoratorReentrancy() {
    const R = boot();
    FX.p50ApplyVec(R.w, FX.P50_F2.vec);
    R.w.__DEV.setArq(0);
    const CAP = 8;
    let calls = 0;
    R.w.__P50.registerDecor(function () {
      calls++;
      if (calls > CAP) throw new Error("CAP de reentrância atingido");
      R.w.__DEV.showResults();                       /* caminho REAL que reentra em render() */
    });
    const prevBefore = R.w.__P50.diag().predecessorInvocations;
    const canonBefore = canonical(R.w);

    R.w.__DEV.showResults();                         /* aciona o caminho real */

    if (calls !== 1)
      throw new Error("lista de decoradores P50 reexecutada por reentrância: " +
        calls + " execuções (esperado 1)");
    const dg = R.w.__P50.diag();
    if (dg.decorDepth !== 0) throw new Error("profundidade de decoração não retornou a 0: " + dg.decorDepth);
    if (dg.decorReentriesBlocked < 1) throw new Error("nenhuma reentrância foi contida pelo guard");
    if (dg.predecessorInvocations <= prevBefore)
      throw new Error("predecessor congelado não preservado no fluxo aninhado");
    /* DOM final estável: nenhuma duplicação de nó pela reentrância */
    if (R.d.querySelectorAll("#ux-execrow").length !== 1)
      throw new Error("DOM instável: #ux-execrow duplicado ou ausente");
    if (R.d.querySelectorAll("#p50-shell").length !== 0)
      throw new Error("DOM instável: shell presente fora da tela de pergunta");
    if (canonical(R.w) !== canonBefore)
      throw new Error("estado canônico alterado pela proteção de reentrância");
  })();

  /* guard do shell (p50AfterRender) permanece válido e é probe secundário */
  const depth = B.w.__P50.__probeReentrancy();
  if (depth > 1) throw new Error("decoração do shell reentrante, profundidade " + depth);

  /* --- (h) lint de source: owner único e derivados sem reatribuição --- */
  ["ui_p50_suff_v32.js", "ui_p50_results_v32.js"].forEach(f => {
    const src = readIf(path.join(HERE, f));
    if (src && /window\.__uxDecor\s*=(?!=)/.test(src)) throw new Error(f + " reatribui window.__uxDecor");
  });
  const shellSrc = readIf(SHELL_JS);
  if (!shellSrc) throw new Error("ui_p50_shell_v32.js ausente");
  if ((shellSrc.match(/window\.__uxDecor\s*=(?!=)/g) || []).length !== 1)
    throw new Error("owner único deve atribuir window.__uxDecor exatamente uma vez");

  /* --- (i) 5.0.3 · os DOIS módulos novos participam da composição existente --- */
  [SUFF_JS, RESULTS_JS].forEach(f => {
    const src = readIf(f);
    if (src === null) throw new Error(path.basename(f) + " ausente");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
    /* registra pela interface existente; nenhum agregador paralelo */
    if (!/window\.__P50\.registerDecor\s*\(/.test(code))
      throw new Error(path.basename(f) + " não registra decorator via window.__P50.registerDecor");
    if (/__uxDecor/.test(code)) throw new Error(path.basename(f) + " toca em __uxDecor");
    if (/\brender\s*=\s*function|\brender\s*=\s*\(/.test(code))
      throw new Error(path.basename(f) + " instala wrapper próprio de render");
    /* não recaptura o predecessor congelado nem cria segunda lista */
    if (/Decorators\s*=\s*\[/.test(code)) throw new Error(path.basename(f) + " cria segundo array de decoradores");
    /* nenhum owner paralelo de estado canônico */
    [/\bans\s*\[[^\]]+\]\s*=(?!=)/, /\bnotes\s*\[[^\]]+\]\s*=(?!=)/, /businessPriority\.(add|delete|clear)/,
     /TARGET_PROFILE\s*\.\s*overrides\s*\[[^\]]+\]\s*=(?!=)/].forEach(re => {
      if (re.test(code)) throw new Error(path.basename(f) + " escreve owner canônico: " + re);
    });
    if (/localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest/.test(code))
      throw new Error(path.basename(f) + " introduz persistência ou rede");
  });

  /* (i2) prova MATERIAL: ordem previsível, idempotência e isolamento de falha
     dos decoradores dos módulos novos sob o agregador único da 5.0.1. */
  (function newModulesComposition() {
    const R = boot();
    if (!R.w.__P50SUFF || R.w.__P50SUFF.__installed !== true)
      throw new Error("camada derivada não se instalou");
    if (!R.w.__P50RESULTS || R.w.__P50RESULTS.__installed !== true)
      throw new Error("módulo de resultados não se instalou");
    /* dupla execução do IIFE é inofensiva (guarda de instalação) */
    const before = R.w.__P50.diag();
    FX.p50ApplyResults(R.w, R.d, FX.P50_F3);
    const seq = [];
    if (!R.d.querySelector("#p50-suff")) throw new Error("painel de suficiência não montou");
    if (!R.d.querySelector("#p50-results")) throw new Error("superfície de resultados não montou");
    /* ordem: suficiência antes de resultados (o consumidor lê o contrato) */
    const nodes = Array.from(R.d.querySelectorAll("#p50-suff, #p50-results"));
    nodes.forEach(n => seq.push(n.id));
    if (seq.join(">") !== "p50-suff>p50-results")
      throw new Error("ordem de montagem imprevisível: " + seq.join(">"));
    /* idempotência: decorar novamente não duplica nem altera a superfície */
    const app = R.d.querySelector("#app");
    const snapSuff = R.d.querySelector("#p50-suff").outerHTML;
    const snapRes = R.d.querySelector("#p50-results").outerHTML;
    R.w.__uxDecor(app); R.w.__uxDecor(app);
    if (R.d.querySelectorAll("#p50-suff").length !== 1) throw new Error("painel de suficiência duplicado");
    if (R.d.querySelectorAll("#p50-results").length !== 1) throw new Error("superfície de resultados duplicada");
    if (R.d.querySelector("#p50-suff").outerHTML !== snapSuff) throw new Error("painel de suficiência não idempotente");
    if (R.d.querySelector("#p50-results").outerHTML !== snapRes) throw new Error("superfície de resultados não idempotente");
    /* isolamento: falha do módulo de resultados não derruba o painel nem o congelado */
    R.w.__P50RESULTS.__forceFailure(true);
    R.w.console.error = () => {};
    R.w.__uxDecor(app);
    if (!R.d.querySelector("#p50-suff")) throw new Error("falha do módulo de resultados derrubou o painel de suficiência");
    if (!R.d.querySelector("#ux-execrow")) throw new Error("falha do módulo de resultados derrubou a decoração congelada");
    R.w.__P50RESULTS.__forceFailure(false);
    R.w.__uxDecor(app);
    if (!R.d.querySelector("#p50-results")) throw new Error("superfície não se recuperou após a falha isolada");
    /* estado canônico intocado por toda a composição */
    if (FX.p50ConfirmedByDomain(R.w.eval("QS.map((_,k)=>ans[k])")).join(",") !== "1,3,2,2,2")
      throw new Error("composição alterou o estado canônico");
    void before;
  })();
  return true;
});

/* ---------------------------------------------------------------------------
   Infraestrutura comum dos gates de suficiência da 5.0.3.

   ORACLE — disciplina obrigatória (§10 da diretriz · REV B §25.4):
   as FUNÇÕES REAIS do runtime (dataSufficiency, confirmedCount, domStat,
   computeTargetProfile) e o DOM real são os OBJETOS SUBMETIDOS à comparação.
   O oracle de correção são as equações independentes de soma/max declaradas
   aqui, derivadas do vetor da fixture. É proibido copiar a fórmula de
   dataSufficiency() para fabricar um segundo oracle equivalente por construção.
--------------------------------------------------------------------------- */
const REQ_GLOBAL_ORACLE = 10;   /* valor normativo, usado SOMENTE nas equações do oracle */
const REQ_DOMAIN_ORACLE = 2;    /* valor normativo, usado SOMENTE nas equações do oracle */
const deficitOracle = (req, have) => (req - have > 0 ? req - have : 0);

/* Contrato esperado, recalculado a partir do vetor — nunca lido do produto. */
function expectedContract(vec) {
  const byDom = FX.p50ConfirmedByDomain(vec);
  const confirmedGlobal = byDom.reduce((a, b) => a + b, 0);
  const domains = byDom.map((n, i) => ({
    domainId: i, confirmed: n, required: REQ_DOMAIN_ORACLE,
    missing: deficitOracle(REQ_DOMAIN_ORACLE, n)
  }));
  const missingGlobal = deficitOracle(REQ_GLOBAL_ORACLE, confirmedGlobal);
  return {
    confirmedGlobal, requiredGlobal: REQ_GLOBAL_ORACLE, missingGlobal, domains,
    sufficient: missingGlobal === 0 && domains.every(dd => dd.missing === 0)
  };
}

/* Vetor de 15 posições que realiza as contagens (n0..n4) por domínio.
   Slots não confirmados alternam null e "NA" — as duas formas de NÃO confirmar.
   Os valores confirmados percorrem 0..3, de modo que `0` (NONE) confirma. */
function vecOfCounts(ns) {
  const v = new Array(15).fill(null);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const k = i * 3 + j;
      v[k] = (j < ns[i]) ? ((i + j) % 4) : (j % 2 === 0 ? null : "NA");
    }
  }
  return v;
}

/* Enumeração completa dos 4^5 = 1024 vetores de contagem. */
function allCountVectors() {
  const out = [];
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 4; c++)
    for (let e = 0; e < 4; e++) for (let f = 0; f < 4; f++) out.push([a, b, c, e, f]);
  return out;
}

/* Funções REAIS do runtime (escopo global do script único do build). */
const realCanonicalVerdict = w => w.dataSufficiency(w.eval("DOMS.map((_,i)=>domStat(i))"));
const realTargetVerdict = (w, eff) => w.computeTargetProfile(eff).suff;
const derivedContract = w => {
  if (!w.__P50SUFF || typeof w.__P50SUFF.contract !== "function")
    throw new Error("camada derivada de suficiência ausente (window.__P50SUFF.contract)");
  return w.__P50SUFF.contract();
};
const applyVecOnly = (w, vec) => FX.p50ApplyVec(w, vec);

/* ---------------------------------------------------------------------------
   B-503-COHERENCE · varredura da PÁGINA INTEIRA de resultados.
   Os gates de suficiência deixam de olhar apenas `#p50-results`: a exigência é
   que a superfície LEGADA decorada e a superfície P50 comuniquem o MESMO
   estado. Esconder visualmente mantendo texto contraditório na árvore
   acessível não satisfaz o requisito — por isso o texto acessível é computado
   ignorando subárvores `aria-hidden="true"`.
--------------------------------------------------------------------------- */
const STAGE_WORDS = /\b(Non-existent|Initial|Managed|Defined|Quantitatively Managed|Optimizing)\b/;

function accessibleText(root) {
  if (!root) return "";
  let out = "";
  (function walk(n) {
    if (n.nodeType === 3) { out += n.nodeValue + " "; return; }
    if (n.nodeType !== 1) return;
    if (n.getAttribute && n.getAttribute("aria-hidden") === "true") return;
    const cls = (n.getAttribute && n.getAttribute("class")) || "";
    if (/\bp50-legacy-off\b/.test(cls) && !/\bp50-legacy-note\b/.test(cls)) {
      /* neutralizado: só o substituto acessível permanece */
      const note = n.querySelector && n.querySelector(".p50-legacy-note");
      if (note) walk(note);
      return;
    }
    const lbl = n.getAttribute && n.getAttribute("aria-label");
    if (lbl) { out += lbl + " "; return; }
    for (let i = 0; i < n.childNodes.length; i++) walk(n.childNodes[i]);
  })(root);
  return out.replace(/\s+/g, " ").trim();
}

function legacyProbe(d) {
  const rows = qa(d, "#app .grid2 .panel .dom");
  const radar = q(d, "#app .radar-box");
  const legend = q(d, "#app .scale-legend");
  const hidden = el => !!el && el.getAttribute("aria-hidden") === "true";
  /* duas propriedades DISTINTAS: sair da tela e sair da árvore acessível.
     Esconder à vista mantendo o texto acessível não satisfaz a errata. */
  const offScreen = el => !!el && (el.classList.contains("p50-legacy-gone") ||
                                   el.classList.contains("p50-legacy-veiled"));
  const fills = qa(d, "#app .ruler .fill");
  return {
    rows: rows.length,
    /* nó CONGELADO: nunca é mutado; a asserção é sobre estar fora da tela e da
       árvore acessível. O texto honesto vive num elemento NOVO ao lado. */
    frozenValues: rows.map(r => txt(r.querySelector(".lbl > span"))),
    frozenValuesHidden: rows.map(r => hidden(r.querySelector(".lbl > span"))),
    frozenValuesOffScreen: rows.map(r => offScreen(r.querySelector(".lbl > span"))),
    frozenConfHidden: rows.map(r => hidden(r.querySelector(".conf"))),
    p50Values: rows.map(r => txt(r.querySelector("[data-p50=\"legacy-domain-value\"]"))),
    p50Confs: rows.map(r => txt(r.querySelector("[data-p50=\"legacy-domain-conf\"]"))),
    marks: rows.map(r => r.getAttribute("data-p50-legacy")),
    stateNotes: rows.map((r, i) => txt(r.querySelector("[data-p50=\"legacy-domain-state-" + i + "\"]"))),
    fillsTotal: fills.length,
    fillsExposed: fills.filter(f => !hidden(f)).length,
    radarMark: radar ? radar.getAttribute("data-p50-legacy") : null,
    radarKidsExposed: radar ? Array.from(radar.children)
      .filter(c => !c.classList.contains("p50-legacy-note") && !hidden(c)).length : null,
    radarNote: txt(q(d, "#app [data-p50=\"legacy-radar-note\"]")),
    radarSvg: !!q(d, "#app .radar-box svg"),
    legendHidden: hidden(legend),
    banner: txt(q(d, "#app [data-p50=\"legacy-domain-banner\"]")),
    accText: accessibleText(q(d, "#app")),
    panelAcc: accessibleText(rows.length ? rows[0].parentNode : null),
    p50Gate: (q(d, "#p50-results") || { getAttribute: () => null }).getAttribute("data-p50-gate"),
    p50DomainStates: qa(d, "#p50-results [data-p50=\"results-domain\"]").map(n => n.getAttribute("data-p50-state"))
  };
}

/* Sob gate FECHADO: uma única verdade em toda a página de resultados. */
function assertPageBlocked(d, tag) {
  const L = legacyProbe(d);
  if (L.rows !== 5) throw new Error(tag + ": painel legado com " + L.rows + " domínios");
  for (let i = 0; i < 5; i++) {
    if (!L.frozenValuesOffScreen[i])
      throw new Error(tag + " legado dom " + i + ": score parcial '" + L.frozenValues[i] + "' permanece visível na tela");
    if (!L.frozenValuesHidden[i])
      throw new Error(tag + " legado dom " + i + ": score parcial '" + L.frozenValues[i] + "' permanece na árvore acessível");
    if (!L.frozenConfHidden[i])
      throw new Error(tag + " legado dom " + i + ": linha de confiança legada segue exposta");
    if (L.p50Values[i] !== "n/d")
      throw new Error(tag + " legado dom " + i + ": substituto honesto ausente ('" + L.p50Values[i] + "')");
    if (!/respostas confirmadas · diagnóstico parcial/.test(L.p50Confs[i] || ""))
      throw new Error(tag + " legado dom " + i + ": contagem não rotulada como diagnóstico parcial");
    if (L.marks[i] !== "neutralized")
      throw new Error(tag + " legado dom " + i + ": não neutralizado (" + L.marks[i] + ")");
    if (!/Não avaliado · evidência insuficiente/.test(L.stateNotes[i] || ""))
      throw new Error(tag + " legado dom " + i + ": rótulo de estado ausente ('" + L.stateNotes[i] + "')");
  }
  if (L.fillsExposed !== 0) throw new Error(tag + ": " + L.fillsExposed + " ruler(s) preenchido(s) exposto(s)");
  if (L.radarMark !== "neutralized") throw new Error(tag + ": radar parcial não neutralizado");
  if (L.radarKidsExposed !== 0) throw new Error(tag + ": " + L.radarKidsExposed + " nó(s) do radar ainda expostos");
  if (!L.radarNote) throw new Error(tag + ": radar sem substituto acessível");
  if (!L.legendHidden) throw new Error(tag + ": legenda de escala de maturidade permanece exposta");
  if (!L.banner) throw new Error(tag + ": painel legado sem declaração de insuficiência");
  const stage = L.accText.match(STAGE_WORDS);
  if (stage) throw new Error(tag + ": estágio de maturidade acessível na página: '" + stage[0] + "'");
  const num = L.panelAcc.match(/\b\d[.,]\d\b/);
  if (num) throw new Error(tag + ": score numérico acessível no painel legado: '" + num[0] + "'");
  if (L.p50Gate !== "blocked") throw new Error(tag + ": superfície P50 não está bloqueada (" + L.p50Gate + ")");
  if (L.p50DomainStates.length !== 5 || L.p50DomainStates.some(x => x !== "unavailable"))
    throw new Error(tag + ": superfície P50 contradiz a legada: " + L.p50DomainStates.join(","));
  return L;
}

/* Sob gate ABERTO: a superfície legada volta INTEIRA, sem marcador stale.
   `checkCanonical` só se aplica quando houve render congelado no meio: sem
   render, o texto do nó congelado é o que o renderer congelado deixou, e a
   Camada 5 não o reescreve (é exatamente essa a disciplina). */
function assertPageReleased(w, d, tag, checkCanonical) {
  const L = legacyProbe(d);
  if (L.rows !== 5) throw new Error(tag + ": painel legado com " + L.rows + " domínios");
  if (qa(d, "#app [data-p50-legacy]").length !== 0)
    throw new Error(tag + ": marcador de neutralização stale após o desbloqueio");
  if (qa(d, "#app .p50-legacy-note").length !== 0)
    throw new Error(tag + ": elemento de neutralização stale após o desbloqueio");
  if (qa(d, "#app [aria-hidden=\"true\"].p50-legacy-gone, #app [aria-hidden=\"true\"].p50-legacy-veiled").length !== 0)
    throw new Error(tag + ": nó congelado permanece oculto após o desbloqueio");
  if (L.frozenValuesHidden.some(Boolean)) throw new Error(tag + ": valor legado permanece oculto");
  if (L.fillsTotal !== 5) throw new Error(tag + ": " + L.fillsTotal + " preenchimento(s), esperado 5");
  if (L.fillsExposed !== 5) throw new Error(tag + ": " + L.fillsExposed + " preenchimento(s) exposto(s), esperado 5");
  if (!L.radarSvg) throw new Error(tag + ": radar canônico ausente");
  if (L.radarKidsExposed === 0) throw new Error(tag + ": radar permanece oculto após o desbloqueio");
  if (L.legendHidden) throw new Error(tag + ": legenda permanece oculta após o desbloqueio");
  if (L.p50Gate !== "released") throw new Error(tag + ": superfície P50 não liberada (" + L.p50Gate + ")");
  if (checkCanonical) {
    for (let i = 0; i < 5; i++) {
      const real = w.domStat(i).score;
      if (real === null) throw new Error(tag + " dom " + i + ": score canônico null com gate aberto");
      if (L.frozenValues[i].indexOf(real.toFixed(1)) !== 0)
        throw new Error(tag + " legado dom " + i + ": '" + L.frozenValues[i] + "' != canônico " + real.toFixed(1));
      const fill = qa(d, "#app .grid2 .panel .dom")[i].querySelector(".ruler .fill");
      const want = "width:" + (real / 5 * 100) + "%";
      if ((fill.getAttribute("style") || "").replace(/\s/g, "") !== want)
        throw new Error(tag + " dom " + i + ": preenchimento '" + fill.getAttribute("style") + "' != canônico '" + want + "'");
    }
  }
  return L;
}

/* ======================= 25.4 · SUFICIÊNCIA ======================= */

T("P50-SUF0", "nenhum renderer é dono de lógica de suficiência; limiar declarado uma única vez", () => {
  FX.p50AssertFixtureCounts();      /* pré-condição: fixtures estruturalmente válidas */
  const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

  /* (a) renderers: sem veredito próprio, sem limiar, sem comparação de contagem */
  const rends = P50_RENDERER_MODULES.map(f => ({ f, s: readIf(f) })).filter(o => o.s !== null);
  if (rends.length !== P50_RENDERER_MODULES.length)
    throw new Error("renderer ausente: " + P50_RENDERER_MODULES.filter(f => !fs.existsSync(f)).map(f => path.basename(f)).join(", "));
  rends.forEach(({ f, s: src }) => {
    const n = path.basename(f), code = strip(src);
    if (/dataSufficiency/.test(code)) throw new Error(n + " referencia dataSufficiency");
    if (f === P50_GATE_RENDERER) {
      if (/\bconfirmedCount\s*\(/.test(code)) throw new Error(n + " chama confirmedCount() para reconstruir a mensagem");
      if (/\bdomStat\s*\([^)]*\)\s*\.\s*n\b/.test(code)) throw new Error(n + " lê domStat().n para reconstruir a mensagem");
    }
    /* Qualquer comparação contra os limiares canônicos, sob qualquer forma —
       identificador, chamada de função ou expressão — é reimplementação do
       gate. `=== 2` não é banido: é a severidade que o motor congelado já
       define (MAP[...].lv[a].s), e nunca um limiar de suficiência. */
    if (/(>=|>|<|<=|===|==)\s*10\b/.test(code)) throw new Error(n + " contém comparação com o limiar global 10");
    if (/(>=|>|<|<=)\s*2\b/.test(code)) throw new Error(n + " contém comparação com o limiar de domínio 2");
    if (/confirmedCount\s*\(\s*\)\s*(>=|>|<|<=|===|==)/.test(code))
      throw new Error(n + " compara confirmedCount() diretamente");
    if (/domStat\s*\([^)]*\)\s*\.\s*n\s*(>=|>|<|<=|===|==)/.test(code))
      throw new Error(n + " compara domStat().n diretamente");
    if (/\bmissing\w*\s*=\s*[^=]*[-−]\s*(10|2)\b/.test(code)) throw new Error(n + " recalcula déficit a partir de limiar literal");
  });

  /* (b) camada derivada: UMA única declaração nomeada dos dois limiares */
  const suffSrc = readIf(P50_SUFF_MODULE);
  if (suffSrc === null) throw new Error("ui_p50_suff_v32.js ausente");
  const suffCode = strip(suffSrc);
  if (/dataSufficiency/.test(suffCode))
    throw new Error("a camada derivada delega a dataSufficiency() — a equivalência deixaria de ser provada");
  const decl = suffCode.match(/P50_SUFF_REQUIRED\s*=\s*\{[^}]*\}/g) || [];
  if (decl.length !== 1)
    throw new Error("limiares declarados " + decl.length + " vez(es); esperado exatamente 1");
  if (!/global\s*:\s*10\b/.test(decl[0]) || !/domain\s*:\s*2\b/.test(decl[0]))
    throw new Error("declaração única não espelha os limiares canônicos: " + decl[0]);
  const outside = suffCode.replace(decl[0], "");
  if (/(required|threshold|limiar)\w*\s*[:=]\s*(10|2)\b/i.test(outside))
    throw new Error("segunda declaração de limiar fora da declaração única");

  /* ==========================================================================
     (b2) RQ-AUD-2 · PROVENIÊNCIA DA MOEDA (UI-009A).
     Declarar o limiar uma única vez não impede o pior caso: a camada derivada
     RECONTAR respostas por conta própria e virar um owner paralelo da moeda de
     suficiência. Duas provas complementares, porque nenhuma basta sozinha —
     a estrutural não vê o runtime, e a de runtime não vê código morto.
     ========================================================================== */

  /* (b2.i) ESTRUTURAL: as leituras canônicas têm de estar lá, e a recontagem
     paralela tem de estar ausente. */
  if (!/confirmedGlobal\s*=\s*confirmedCount\s*\(\s*\)/.test(suffCode))
    throw new Error("confirmedGlobal não é lido de confirmedCount() — owner paralelo da moeda global");
  if (!/=\s*domStat\s*\(\s*i\s*\)\s*\.\s*n\b/.test(suffCode))
    throw new Error("confirmações por domínio não são lidas de domStat(i).n — owner paralelo por domínio");
  [[/\bans\s*\[/, "indexa ans[] diretamente"],
   [/\bans\s*\.\s*(filter|reduce|forEach|map|every|some|length)\b/, "itera ans"],
   [/\bQS\s*\[/, "indexa QS[] diretamente"],
   [/\bQS\s*\.\s*(filter|reduce|forEach|map|every|some|length)\b/, "itera QS"]
  ].forEach(([re, why]) => {
    if (re.test(suffCode)) throw new Error("a camada derivada " + why + " para recontar respostas");
  });
  /* a FÓRMULA de confirmação pertence à Camada 1 e não pode ser reproduzida */
  if (/!==\s*null[\s\S]{0,60}!==\s*"NA"/.test(suffCode) || /!==\s*"NA"[\s\S]{0,60}!==\s*null/.test(suffCode))
    throw new Error("a camada derivada reproduz a fórmula de confirmação (v !== null && v !== \"NA\")");

  /* (b2.ii) RUNTIME por SENTINELA: substitui temporariamente as funções
     canônicas por sentinelas controladas e exige que o contrato REFLITA os
     valores das sentinelas. Se o contrato recontasse por conta própria, os
     números não mudariam. Nada de produção é alterado: as funções são
     restauradas em `finally` e a ausência de estado residual é verificada. */
  {
    const { w: ws } = boot();
    ws.__DEV.setArq(0);
    ws.__DEV.showResults();
    if (typeof ws.confirmedCount !== "function" || typeof ws.domStat !== "function")
      throw new Error("owner canônico (confirmedCount/domStat) inalcançável no runtime");
    const before = JSON.stringify(derivedContract(ws));
    const origCC = ws.confirmedCount, origDS = ws.domStat;
    let ccCalls = 0; const dsCalls = [];
    try {
      ws.confirmedCount = function () { ccCalls++; return 7; };
      ws.domStat = function (i) { dsCalls.push(i); return { n: 100 + i, nNA: 0, idx: [], score: null, conf: null }; };
      const c = derivedContract(ws);
      if (ccCalls !== 1)
        throw new Error("confirmedCount() invocado " + ccCalls + " vez(es) pelo contrato (esperado 1)");
      if (c.confirmedGlobal !== 7)
        throw new Error("confirmedGlobal = " + c.confirmedGlobal + " não reflete a sentinela (7) — moeda global recontada localmente");
      if (dsCalls.join(",") !== c.domains.map(x => x.domainId).join(","))
        throw new Error("domStat() não foi consultado uma vez por domínio na ordem canônica: [" + dsCalls.join(",") + "]");
      c.domains.forEach((dd, i) => {
        if (dd.confirmed !== 100 + i)
          throw new Error("domínio " + i + ": confirmed = " + dd.confirmed + " não reflete a sentinela (" + (100 + i) + ") — recontagem paralela por domínio");
      });
    } finally {
      ws.confirmedCount = origCC;
      ws.domStat = origDS;
    }
    if (ws.confirmedCount !== origCC || ws.domStat !== origDS)
      throw new Error("sentinela não foi restaurada — estado residual no runtime");
    if (JSON.stringify(derivedContract(ws)) !== before)
      throw new Error("estado residual: o contrato não voltou ao valor anterior à sentinela");
  }

  /* (c) equivalência material: a superfície nova nunca discorda do veredito canônico */
  const { w, d } = boot();
  [[0,0,0,0,0],[1,3,2,2,2],[2,2,2,2,2],[3,3,3,3,3],[3,3,3,3,1],[2,2,2,2,1]].forEach(ns => {
    const vec = vecOfCounts(ns);
    applyVecOnly(w, vec);
    w.__DEV.setArq(0);
    w.__DEV.showResults();
    const canonical = realCanonicalVerdict(w);
    const derived = derivedContract(w).sufficient;
    if (derived !== canonical)
      throw new Error("veredito derivado " + derived + " != canônico " + canonical + " em [" + ns + "]");
    const sec = q(d, "#p50-results");
    if (!sec) throw new Error("superfície nova de resultados ausente em [" + ns + "]");
    const gate = sec.getAttribute("data-p50-gate");
    if (gate !== (canonical ? "released" : "blocked"))
      throw new Error("gate da UI '" + gate + "' != veredito canônico " + canonical + " em [" + ns + "]");
  });

  /* (d) o shell (5.0.1/5.0.2) permanece sem qualquer juízo de suficiência */
  [FX.P50_F1, FX.P50_F2, FX.P50_F6].forEach(fx => {
    const B = boot();
    FX.p50ApplyFixture(B.w, B.d, fx);
    const t = txt(q(B.d, "#p50-shell"));
    if (/\b(overall|maturidade geral|estágio|stage)\b/i.test(t))
      throw new Error("veredito executivo exibido pelo shell em " + fx.id);
    if (/(suficiên|insuficiên)/i.test(t))
      throw new Error("shell emite juízo de suficiência em " + fx.id);
  });

  /* (e) ui_target_v32.js e a Camada 1 intactos */
  if (sha(path.join(HERE, "ui_target_v32.js")) !== PROTECTED["ui_target_v32.js"])
    throw new Error("ui_target_v32.js alterado");
  const html = HTML;
  if (!/function dataSufficiency\(stats\)\{\s*\n\s*return confirmedCount\(\) >= 10 && stats\.every\(s=>s\.n>=2\);/.test(html))
    throw new Error("dataSufficiency() não está byte-idêntica no build");

  /* (f) nenhum símbolo fora da fronteira autorizada nos módulos de PRODUÇÃO.
     R3 (auditoria 5.0.4) · a mensagem de diagnóstico ficara presa à microfase
     anterior. Com a 5.0.5 AUTORIZADA, a lista deixa de guardar uma "microfase
     futura" e passa a guardar duas coisas permanentes:

       (i)  a área fora de escopo da Phase 5.0 por decisão normativa (§15/§23):
            framework mapping NIST/CIS e qualquer semântica nova de print;
       (ii) axe-core: é dependência EXCLUSIVA de teste (P50-ACC1, §29.3).
            Nenhum byte de axe pode entrar em módulo de produção e, por
            consequência, no HTML construído — este lint é a prova estrutural
            dessa separação, e vale para sempre, não só nesta microfase.

     Os sentinelas `P50-ACC7`/`P50-VIS11` permanecem: não existem na REV B
     (§25.7 vai até ACC6; §25.6 até VIS10) e acusariam invenção de gate fora
     da numeração normativa. */
  const forbidden = ["axe-core", "axeCore", "runAxe", "P50-ACC7", "P50-VIS11",
                     "frameworkMapping", "framework-mapping", "nistCsf", "nist-csf", "cisControls",
                     "buildPrintReport", "preparePrint"];
  P50_NEW_MODULES.forEach(f => {
    const src = readIf(f); if (src === null) return;
    /* comentários são prosa normativa (inclusive a declaração do que NÃO foi
       implementado); a antecipação proibida é de CÓDIGO executável. */
    const code = strip(src);
    forbidden.forEach(sym => {
      if (code.indexOf(sym) >= 0)
        throw new Error(path.basename(f) + " contém símbolo fora da fronteira autorizada " +
          "(área fora de escopo §15/§23 ou dependência exclusiva de teste): " + sym);
    });
  });

  /* (g) prova POSITIVA de que a dependência de teste da 5.0.5 não alcança o
     produto: o HTML CONSTRUÍDO não contém byte algum de axe-core (P50-ACC1,
     §29.3 "axe-core não entra no HTML"). O lint de módulo (f) é a causa; esta
     é a consequência observada no artefato entregável. */
  ["axe-core", "axeCore", "AxeBuilder", "@axe-core/playwright"].forEach(sym => {
    if (html.indexOf(sym) >= 0) throw new Error("HTML construído contém símbolo de axe: " + sym);
  });
  return true;
});

/* ============================================================================
   RQ-AUD-1 · lint anti-duplicação dos módulos da Camada 5.
   A candidata carregava 158 linhas de CSS duplicadas byte a byte (segundo
   `@media print` de #p50-shell, segunda cópia do bloco 5.0.2 e segunda cópia
   do bloco base 5.0.3). Duplicação integral é dívida de manutenção com risco
   real: uma correção aplicada a uma cópia e não à outra produz divergência
   silenciosa entre regras que o leitor supõe idênticas.
   Oráculo estrutural e independente da implementação: janela deslizante sobre
   as LINHAS SIGNIFICATIVAS (ignora vazias e delimitadores puros de comentário,
   de modo que reindentação ou espaçamento não mascaram a repetição).
   ========================================================================== */
T("P50-DUP1", "nenhum módulo da Camada 5 contém bloco integralmente duplicado", () => {
  const WINDOW = 12;                      /* "integral" = bloco, não uma linha isolada */
  const offenders = [];
  P50_NEW_MODULES.forEach(f => {
    const src = readIf(f);
    if (src === null) throw new Error("módulo P50 ausente: " + path.basename(f));
    const sig = [];
    src.split("\n").forEach((ln, i) => {
      const t = ln.trim();
      if (!t) return;
      if (/^[/*=\-\s]*$/.test(t)) return;        /* moldura de comentário não é conteúdo */
      sig.push({ line: i + 1, t });
    });
    const seen = new Map();
    for (let k = 0; k + WINDOW <= sig.length; k++) {
      const win = sig.slice(k, k + WINDOW);
      const key = win.map(x => x.t).join("\n");
      if (seen.has(key)) {
        offenders.push(path.basename(f) + ": bloco de " + WINDOW +
          " linhas significativas repetido (linha " + seen.get(key) + " e linha " + win[0].line + ")");
        break;                                    /* um relato por arquivo basta para reprovar */
      }
      seen.set(key, win[0].line);
    }
  });
  if (offenders.length) throw new Error(offenders.join(" · "));
  return true;
});

T("P50-SUF1", "estado insuficiente não expõe overall, estágio nem executive card na superfície nova", () => {
  [FX.P50_F2, FX.P50_F3].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, fx);
    if (realCanonicalVerdict(w) !== false) throw new Error(fx.id + ": pré-condição — veredito canônico não é insuficiente");
    const sec = q(d, "#p50-results");
    if (!sec) throw new Error(fx.id + ": superfície nova de resultados ausente");
    if (sec.getAttribute("data-p50-gate") !== "blocked") throw new Error(fx.id + ": gate não está bloqueado");
    if (sec.querySelector("[data-p50=\"exec-cards\"]")) throw new Error(fx.id + ": executive cards presentes sob gate fechado");
    if (sec.querySelector("[data-p50=\"exec-card\"]")) throw new Error(fx.id + ": executive card presente sob gate fechado");
    if (sec.querySelector("[data-p50=\"overall\"]")) throw new Error(fx.id + ": overall presente sob gate fechado");
    if (sec.querySelector("[data-p50=\"stage\"]")) throw new Error(fx.id + ": estágio presente sob gate fechado");
    /* H-27 · o texto é lido POR NÓ e reunido com separador. Concatenar
       textContent de nós adjacentes cria fronteiras falsas ("0.0" seguido de
       "1 de 2…" vira "0.01") e desarma silenciosamente os \b das asserções.
       Este defeito do harness deixou passar score agregado sob gate fechado. */
    /* O escopo textual EXCLUI as células/linhas de resposta CONFIRMADA: um
       nível 0 confirmado vale 0.0 e UG7/UI-016a exigem que ele apareça. O que
       esta varredura persegue é o zero FABRICADO por ausência de evidência —
       e o agregado por domínio é conferido estruturalmente logo abaixo. */
    const confirmedScope = e => !!(e.closest && e.closest("[data-p50-ans=\"confirmed\"]"));
    const t = qa(d, "#p50-results *").filter(e => !confirmedScope(e)).map(e => {
      let out = "";
      for (let n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) out += n.nodeValue;
      return out.trim();
    }).filter(Boolean).join(" \u00b7 ");
    if (/\b\d[.,]\d\s*\/\s*5[.,]0\b/.test(t)) throw new Error(fx.id + ": score consolidado renderizado: " + t.slice(0, 120));
    if (/\b(Initial|Managed|Defined|Optimizing|Quantitatively Managed|Non-existent)\b/.test(t))
      throw new Error(fx.id + ": estágio executivo renderizado");
    /* nenhum zero fabricado por falta de evidência */
    if (/\b0[.,]0\b/.test(t)) throw new Error(fx.id + ": zero fabricado na superfície nova");

    /* 5.0.4 · UI-013/UI-014 nas TRÊS visões novas: sob gate fechado nenhuma
       delas pode publicar AGREGADO de domínio. O valor por PERGUNTA confirmada
       continua exigido (UI-015/UI-016a) — o que é proibido é o agregado. */
    qa(d, "#p50-results [data-p50=\"drill-score\"]").forEach((e, i) => {
      if (/\d/.test(txt(e)))
        throw new Error(fx.id + ": drill-down publica score agregado do domínio " + i + ": " + txt(e));
    });
    qa(d, "#p50-results [data-p50=\"ct-row\"]").forEach((r, i) => {
      if (r.hasAttribute("data-p50-current"))
        throw new Error(fx.id + ": Current × Target publica agregado do domínio " + i);
      if (r.hasAttribute("data-p50-gap"))
        throw new Error(fx.id + ": Current × Target publica gap sob gate fechado no domínio " + i);
      const v = txt(r.querySelector("[data-p50=\"ct-current-value\"]"));
      if (/\d/.test(v))
        throw new Error(fx.id + ": Current × Target exibe valor atual " + v + " sob gate fechado");
      const bar = r.querySelector("[data-p50=\"ct-current\"]");
      if (bar && bar.getAttribute("data-p50-plotted") === "true")
        throw new Error(fx.id + ": barra de current plotada sob gate fechado no domínio " + i);
    });
    /* o eixo por PERGUNTA permanece honesto e visível */
    const conf = qa(d, "#p50-results [data-p50=\"hm-cell\"][data-p50-ans=\"confirmed\"]");
    if (!conf.length) throw new Error(fx.id + ": heat map perdeu as respostas confirmadas");
    conf.forEach(c => {
      if (!/\d/.test(txt(c.querySelector("[data-p50=\"hm-state\"]"))))
        throw new Error(fx.id + ": resposta confirmada deixou de exibir o seu valor por pergunta");
    });
    /* completion e navegação continuam disponíveis (controles congelados) */
    if (!q(d, "#review")) throw new Error(fx.id + ": navegação de revisão indisponível");
    /* B-503-COHERENCE: a PÁGINA INTEIRA, não só #p50-results */
    assertPageBlocked(d, fx.id);
  });
  return true;
});

T("P50-SUF2", "domínio sem resposta confirmada exibe n/d + 'Não avaliado', nunca 0.0", () => {
  /* (a) sidebar do shell (superfície da 5.0.1) */
  [FX.P50_F1, FX.P50_F2, FX.P50_F6].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyFixture(w, d, fx);
    const expected = FX.p50ConfirmedByDomain(fx.vec);          /* oracle independente */
    for (let i = 0; i < 5; i++) {
      const sec = q(d, "#p50-shell [data-p50=\"domain\"][data-dom=\"" + i + "\"]");
      if (!sec) throw new Error(fx.id + ": domínio " + i + " ausente na sidebar");
      const state = sec.querySelector("[data-p50=\"domain-state\"]");
      if (!state) throw new Error(fx.id + ": estado do domínio " + i + " ausente");
      const mark = state.getAttribute("data-p50-state");
      const visible = txt(state);
      if (expected[i] === 0) {
        if (mark !== "unset") throw new Error(fx.id + " dom " + i + ": data-p50-state=" + mark);
        if (!/^n\/d\b/.test(visible)) throw new Error(fx.id + " dom " + i + ": visível '" + visible + "'");
        const label = sec.querySelector("[data-p50=\"domain-state-label\"]");
        if (!label || !/Não avaliado/i.test(txt(label)))
          throw new Error(fx.id + " dom " + i + ": rótulo 'Não avaliado' ausente");
        if (/\b0([.,]\d)?\b/.test(visible)) throw new Error(fx.id + " dom " + i + ": zero fabricado '" + visible + "'");
      } else {
        if (mark !== "answered") throw new Error(fx.id + " dom " + i + ": deveria estar respondido");
        if (!new RegExp("^" + expected[i] + " de 3 respostas confirmadas").test(visible))
          throw new Error(fx.id + " dom " + i + ": contagem '" + visible + "' != " + expected[i]);
      }
    }
    const sidebar = txt(q(d, "#p50-shell [data-p50=\"sidebar\"]"));
    if (/\b0[.,]0\b/.test(sidebar.replace(/Confirmad[oa][^·]*·\s*0[.,]0/g, "")))
      throw new Error(fx.id + ": 0.0 renderizado na sidebar fora de resposta confirmada");
  });

  /* (b) superfície nova de resultados (UI-014): sob gate fechado, TODO domínio
     é n/d + "Não avaliado"; nenhum score parcial vira veredito executivo. */
  [FX.P50_F2, FX.P50_F3].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, fx);
    for (let i = 0; i < 5; i++) {
      const row = q(d, "#p50-results [data-p50=\"results-domain\"][data-dom=\"" + i + "\"]");
      if (!row) throw new Error(fx.id + ": linha de domínio " + i + " ausente na superfície nova");
      if (row.getAttribute("data-p50-state") !== "unavailable")
        throw new Error(fx.id + " dom " + i + ": estado " + row.getAttribute("data-p50-state") + " sob gate fechado");
      const val = txt(row.querySelector("[data-p50=\"results-domain-value\"]"));
      if (val !== "n/d") throw new Error(fx.id + " dom " + i + ": valor '" + val + "' != n/d");
      if (!/Não avaliado/i.test(txt(row))) throw new Error(fx.id + " dom " + i + ": 'Não avaliado' ausente");
      if (/\b\d[.,]\d\b/.test(txt(row))) throw new Error(fx.id + " dom " + i + ": número fabricado '" + txt(row) + "'");
      if (!/evidência insuficiente/i.test(accName(row)))
        throw new Error(fx.id + " dom " + i + ": nome acessível sem qualificação de insuficiência");
    }
    assertPageBlocked(d, fx.id + "/página");
  });

  /* (c) sob gate ABERTO, os domínios exibem o score CANÔNICO real */
  [FX.P50_F4, FX.P50_F5].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, fx);
    if (realCanonicalVerdict(w) !== true) throw new Error(fx.id + ": pré-condição — veredito canônico não é suficiente");
    for (let i = 0; i < 5; i++) {
      const row = q(d, "#p50-results [data-p50=\"results-domain\"][data-dom=\"" + i + "\"]");
      if (!row) throw new Error(fx.id + ": linha de domínio " + i + " ausente");
      if (row.getAttribute("data-p50-state") !== "scored")
        throw new Error(fx.id + " dom " + i + ": não exibe score sob gate aberto");
      const shown = txt(row.querySelector("[data-p50=\"results-domain-value\"]"));
      const real = w.domStat(i).score;                     /* função REAL do runtime */
      if (real === null) throw new Error(fx.id + " dom " + i + ": score canônico null sob gate aberto");
      if (shown !== real.toFixed(1))
        throw new Error(fx.id + " dom " + i + ": exibido '" + shown + "' != canônico " + real.toFixed(1));
    }
    assertPageReleased(w, d, fx.id + "/página", true);
  });
  return true;
});

T("P50-SUF3", "mensagem do gate provém campo a campo do contrato derivado", () => {
  [FX.P50_F1, FX.P50_F2, FX.P50_F3].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, fx);
    const exp = expectedContract(fx.vec);                   /* oracle independente */
    const got = derivedContract(w);

    if (got.confirmedGlobal !== exp.confirmedGlobal) throw new Error(fx.id + ": confirmedGlobal " + got.confirmedGlobal);
    if (got.requiredGlobal !== exp.requiredGlobal) throw new Error(fx.id + ": requiredGlobal " + got.requiredGlobal);
    if (got.missingGlobal !== exp.missingGlobal) throw new Error(fx.id + ": missingGlobal " + got.missingGlobal);
    if (got.sufficient !== exp.sufficient) throw new Error(fx.id + ": sufficient " + got.sufficient);

    /* linha global: números vindos do contrato, presentes no texto */
    const g = q(d, "#p50-suff [data-p50=\"suff-global\"]");
    if (!g) throw new Error(fx.id + ": linha global de suficiência ausente");
    if (g.getAttribute("data-p50-confirmed") !== String(exp.confirmedGlobal)) throw new Error(fx.id + ": data-confirmed divergente");
    if (g.getAttribute("data-p50-required") !== String(exp.requiredGlobal)) throw new Error(fx.id + ": data-required divergente");
    if (g.getAttribute("data-p50-missing") !== String(exp.missingGlobal)) throw new Error(fx.id + ": data-missing divergente");
    const gt = txt(g);
    if (gt.indexOf(String(exp.confirmedGlobal)) < 0 || gt.indexOf(String(exp.requiredGlobal)) < 0)
      throw new Error(fx.id + ": linha global não exibe confirmadas/requeridas: '" + gt + "'");
    if (exp.missingGlobal > 0) {
      if (!new RegExp("Falta(m)? " + exp.missingGlobal + " resposta").test(gt) && exp.missingGlobal !== 1)
        throw new Error(fx.id + ": déficit global ausente do texto: '" + gt + "'");
      if (exp.missingGlobal === 1 && !/Falta 1 resposta confirmada/.test(gt))
        throw new Error(fx.id + ": singular incorreto: '" + gt + "'");
    } else if (/Falta/i.test(gt)) {
      throw new Error(fx.id + ": déficit global inexistente foi exibido: '" + gt + "'");
    }

    /* lista de pendências == exatamente os domínios com missing > 0 */
    const deficits = qa(d, "#p50-suff [data-p50=\"suff-deficit\"]");
    const shownIds = deficits.map(n => Number(n.getAttribute("data-dom"))).sort((a, b) => a - b);
    const wantIds = exp.domains.filter(dd => dd.missing > 0).map(dd => dd.domainId).sort((a, b) => a - b);
    if (shownIds.join(",") !== wantIds.join(","))
      throw new Error(fx.id + ": pendências [" + shownIds + "] != déficits reais [" + wantIds + "]");
    deficits.forEach(n => {
      const i = Number(n.getAttribute("data-dom"));
      const dd = exp.domains[i];
      if (Number(n.getAttribute("data-missing")) !== dd.missing)
        throw new Error(fx.id + " dom " + i + ": data-missing " + n.getAttribute("data-missing") + " != " + dd.missing);
      const t = txt(n);
      if (t.indexOf(FX.P50_DOM_PT[i]) < 0) throw new Error(fx.id + " dom " + i + ": domínio não nomeado: '" + t + "'");
      if (t.indexOf("+" + dd.missing) < 0) throw new Error(fx.id + " dom " + i + ": déficit ausente: '" + t + "'");
      if (!new RegExp("\\(" + dd.confirmed + " de " + dd.required + "\\)").test(t))
        throw new Error(fx.id + " dom " + i + ": confirmadas/requeridas ausentes: '" + t + "'");
      if (/-\d/.test(t)) throw new Error(fx.id + " dom " + i + ": déficit negativo exibido: '" + t + "'");
      if (dd.missing === 1 && /respostas confirmadas necessárias/.test(t))
        throw new Error(fx.id + " dom " + i + ": plural incorreto: '" + t + "'");
      if (dd.missing > 1 && /\+\d resposta confirmada necessária/.test(t))
        throw new Error(fx.id + " dom " + i + ": singular incorreto: '" + t + "'");
    });
    /* orientação construtiva presente somente enquanto insuficiente */
    const guide = q(d, "#p50-suff [data-p50=\"suff-guidance\"]");
    if (!exp.sufficient && !guide) throw new Error(fx.id + ": orientação para continuar ausente");
    if (exp.sufficient && guide) throw new Error(fx.id + ": orientação de insuficiência exibida com gate aberto");
  });
  return true;
});

T("P50-SUF4", "transição real insuficiente → suficiente desbloqueia sem conteúdo stale", () => {
  const { w, d } = boot();
  FX.p50ApplyResults(w, d, FX.P50_F3);
  if (realCanonicalVerdict(w) !== false) throw new Error("pré-condição: P50-F3 deveria ser insuficiente");
  const sec0 = q(d, "#p50-results");
  if (!sec0) throw new Error("superfície nova de resultados ausente");
  if (sec0.getAttribute("data-p50-gate") !== "blocked") throw new Error("gate inicial não bloqueado");
  const deficitsBefore = qa(d, "#p50-suff [data-p50=\"suff-deficit\"]").length;
  if (deficitsBefore !== 1) throw new Error("P50-F3 deveria ter exatamente 1 domínio deficitário, tem " + deficitsBefore);
  const canonBefore = FX.p50ConfirmedByDomain(FX.P50_F3.vec).join(",");

  /* caminho REAL: voltar às perguntas pelo controle congelado e responder */
  const rev = q(d, "#review");
  if (!rev) throw new Error("controle congelado #review ausente");
  rev.click();                                          /* #review -> última pergunta (congelado) */
  /* Navegação REAL apenas para trás: ArrowLeft é o controle congelado que não
     exige resposta prévia, portanto não altera nenhum estado ao caminhar. */
  const goBackTo = k => {
    let guard = 0;
    while (FX.p50Step(d) > k + 1 && guard++ < 40) FX.p50Key(w, d, "ArrowLeft");
    if (FX.p50Step(d) !== k + 1) throw new Error("navegação real falhou: step " + FX.p50Step(d) + " != " + (k + 1));
  };
  goBackTo(5);                                          /* Pessoas · knowledge (confirmada) */
  const na = q(d, "#app .opts .opt[data-i=\"NA\"]");
  if (!na) throw new Error("botão canônico 'Não sei' ausente");
  na.click();                                           /* remove uma confirmação de Pessoas */
  goBackTo(1);                                          /* Negócio · governance (déficit) */
  const opt = q(d, "#app .opts .opt[data-i=\"1\"]");
  if (!opt) throw new Error("botão canônico de opção ausente");
  opt.click();                                          /* setter congelado + render() */
  w.__DEV.showResults();

  const eff = w.eval("QS.map((_,k)=>ans[k])");
  const counts = FX.p50ConfirmedByDomain(eff);
  if (counts.join(",") !== "2,2,2,2,2")
    throw new Error("estado alcançado [" + counts + "] != contagens de P50-F4 [2,2,2,2,2]");
  if (counts.join(",") === canonBefore) throw new Error("o caminho real não alterou o estado");
  if (realCanonicalVerdict(w) !== true) throw new Error("veredito canônico não abriu após a transição");
  const got = derivedContract(w);
  if (got.sufficient !== true) throw new Error("contrato derivado não abriu");
  if (got.missingGlobal !== 0) throw new Error("déficit global residual " + got.missingGlobal);
  if (got.domains.some(dd => dd.missing !== 0)) throw new Error("déficit de domínio residual");

  const sec = q(d, "#p50-results");
  if (sec.getAttribute("data-p50-gate") !== "released") throw new Error("gate da UI não desbloqueou");
  if (!sec.querySelector("[data-p50=\"exec-cards\"]")) throw new Error("executive cards não liberados");
  if (qa(d, "#p50-suff [data-p50=\"suff-deficit\"]").length !== 0)
    throw new Error("déficit stale permaneceu após o desbloqueio");
  if (q(d, "#p50-suff [data-p50=\"suff-guidance\"]")) throw new Error("orientação de insuficiência stale");
  if (/Resultado ainda indisponível/i.test(txt(sec))) throw new Error("mensagem de bloqueio stale no DOM acessível");
  if (d.querySelectorAll("#p50-results").length !== 1) throw new Error("superfície de resultados duplicada");
  if (d.querySelectorAll("#p50-suff").length !== 1) throw new Error("painel de suficiência duplicado");
  /* B-503-COHERENCE: a superfície legada volta INTEIRA, sem reload e sem stale */
  assertPageReleased(w, d, "unlock", true);
  /* e também quando a decoração roda SEM render (caminho congelado sem rebuild) */
  w.__uxDecor(q(d, "#app"));
  assertPageReleased(w, d, "unlock/sem-render", false);
  /* nenhuma resposta perdida pela transição */
  if (w.eval("ans.filter(v=>v!==null&&v!=='NA').length") !== 10)
    throw new Error("respostas perdidas na transição");

  /* Desbloqueio SEM render (§3.4 da errata): toda transição por controle
     congelado passa por render(), que reconstrói o #app inteiro e entrega uma
     superfície legada nova — nesse caminho a restauração nunca é exercitada.
     Aqui o MESMO nó #app, já neutralizado, é redecorado após o estado canônico
     abrir o gate: a restauração tem de acontecer de fato. */
  (function unlockWithoutRender() {
    const N = boot();
    FX.p50ApplyResults(N.w, N.d, FX.P50_F3);
    if (realCanonicalVerdict(N.w) !== false) throw new Error("sem-render: P50-F3 deveria bloquear");
    assertPageBlocked(N.d, "unlock-sem-render/1-bloqueado");
    const appNode = q(N.d, "#app");
    N.w.__DEV.setAnswerById("governance", 1);          /* owner canônico; NÃO renderiza */
    if (realCanonicalVerdict(N.w) !== true) throw new Error("sem-render: veredito canônico não abriu");
    N.w.__uxDecor(appNode);                            /* redecoração sobre o MESMO DOM */
    if (q(N.d, "#app") !== appNode) throw new Error("sem-render: #app foi reconstruído (o caminho não foi exercitado)");
    assertPageReleased(N.w, N.d, "unlock-sem-render/2-liberado", false);
  })();
  return true;
});

T("P50-SUF5", "transição real suficiente → insuficiente rebloqueia e limpa o executivo", () => {
  [FX.P50_F4, FX.P50_F5].forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, fx);
    if (realCanonicalVerdict(w) !== true) throw new Error(fx.id + ": pré-condição — deveria estar suficiente");
    const sec0 = q(d, "#p50-results");
    if (!sec0) throw new Error(fx.id + ": superfície nova de resultados ausente");
    if (sec0.getAttribute("data-p50-gate") !== "released") throw new Error(fx.id + ": gate inicial não liberado");
    const execTextBefore = txt(sec0.querySelector("[data-p50=\"exec-cards\"]"));
    if (!execTextBefore) throw new Error(fx.id + ": executive cards ausentes no estado suficiente");

    /* caminho REAL: revisar e marcar respostas confirmadas de Negócio como
       "Não sei", uma a uma, até o veredito CANÔNICO rebloquear. O número de
       remoções necessárias depende da fixture e não é presumido. */
    q(d, "#review").click();                          /* -> última pergunta (congelado) */
    let removed = 0;
    for (const k of [2, 1, 0]) {                      /* somente para trás: ArrowLeft */
      if (!realCanonicalVerdict(w)) break;
      const cur = w.eval("ans[" + k + "]");
      if (cur === null || cur === "NA") continue;     /* já não confirma: nada a remover */
      let guard = 0;
      while (FX.p50Step(d) > k + 1 && guard++ < 40) FX.p50Key(w, d, "ArrowLeft");
      if (FX.p50Step(d) !== k + 1) throw new Error(fx.id + ": navegação real falhou em k=" + k);
      const naBtn = q(d, "#app .opts .opt[data-i=\"NA\"]");
      if (!naBtn) throw new Error(fx.id + ": botão canônico 'Não sei' ausente");
      naBtn.click();                                  /* setter congelado + render() */
      removed++;
    }
    if (!removed) throw new Error(fx.id + ": nenhuma remoção real foi aplicada");
    w.__DEV.showResults();

    if (realCanonicalVerdict(w) !== false) throw new Error(fx.id + ": veredito canônico não rebloqueou");
    const exp = expectedContract(w.eval("QS.map((_,k)=>ans[k])"));
    const got = derivedContract(w);
    if (got.sufficient !== false) throw new Error(fx.id + ": contrato derivado não rebloqueou");
    if (got.domains[0].missing !== exp.domains[0].missing)
      throw new Error(fx.id + ": déficit de Negócio " + got.domains[0].missing + " != " + exp.domains[0].missing);

    const sec = q(d, "#p50-results");
    if (sec.getAttribute("data-p50-gate") !== "blocked") throw new Error(fx.id + ": gate da UI não rebloqueou");
    if (sec.querySelector("[data-p50=\"exec-cards\"]")) throw new Error(fx.id + ": executive cards permaneceram");
    if (sec.querySelector("[data-p50=\"exec-card\"]")) throw new Error(fx.id + ": card executivo stale");
    const t = txt(sec);
    if (/\b\d[.,]\d\s*\/\s*5[.,]0\b/.test(t)) throw new Error(fx.id + ": score stale no DOM acessível");
    if (/\b(Initial|Managed|Defined|Optimizing|Quantitatively Managed|Non-existent)\b/.test(t))
      throw new Error(fx.id + ": estágio stale no DOM acessível");
    const deficits = qa(d, "#p50-suff [data-p50=\"suff-deficit\"]");
    if (deficits.length !== exp.domains.filter(dd => dd.missing > 0).length)
      throw new Error(fx.id + ": déficits exibidos != déficits reais");
    if (!q(d, "#p50-suff [data-p50=\"suff-guidance\"]")) throw new Error(fx.id + ": orientação construtiva ausente após rebloqueio");
    if (d.querySelectorAll("#p50-results").length !== 1) throw new Error(fx.id + ": superfície duplicada");

    /* A limpeza do conteúdo executivo NÃO pode depender do render congelado
       recriar #app: existe caminho congelado que invoca a decoração SEM
       render (ui_v32.js, botão de limpar landscape). Decorar de novo, sem
       render, também não pode deixar superfície duplicada nem card stale. */
    const appEl = q(d, "#app");
    w.__uxDecor(appEl);
    if (d.querySelectorAll("#p50-results").length !== 1)
      throw new Error(fx.id + ": superfície duplicada após decoração sem render (limpeza de stale ausente)");
    if (d.querySelectorAll("#p50-suff").length !== 1)
      throw new Error(fx.id + ": painel de suficiência duplicado após decoração sem render");
    if (qa(d, "#p50-results [data-p50=\"exec-cards\"]").length !== 0)
      throw new Error(fx.id + ": card executivo stale após decoração sem render");
    if (qa(d, "#p50-results [data-p50=\"exec-card\"]").length !== 0)
      throw new Error(fx.id + ": exec-card stale após decoração sem render");
    /* B-503-COHERENCE: a superfície legada é neutralizada NOVAMENTE no relock,
       tanto após render congelado quanto na decoração sem render. */
    assertPageBlocked(d, fx.id + "/relock");
    w.__uxDecor(appEl);
    assertPageBlocked(d, fx.id + "/relock/sem-render");
  });

  /* Ciclo COMPLETO bloqueado → liberado → bloqueado sobre a MESMA página.
     É o único caminho que prova que a neutralização sobrevive a uma
     restauração: sem ele, um módulo que perdesse a capacidade de neutralizar
     depois de restaurar passaria despercebido (§3.4 da errata). */
  (function fullCycle() {
    const { w, d } = boot();
    FX.p50ApplyResults(w, d, FX.P50_F3);
    if (realCanonicalVerdict(w) !== false) throw new Error("ciclo: P50-F3 deveria bloquear");
    assertPageBlocked(d, "ciclo/1-bloqueado");

    /* liberar pelo caminho REAL */
    q(d, "#review").click();
    let guard = 0;
    while (FX.p50Step(d) > 2 && guard++ < 40) FX.p50Key(w, d, "ArrowLeft");
    if (FX.p50Step(d) !== 2) throw new Error("ciclo: navegação real falhou (liberar)");
    q(d, "#app .opts .opt[data-i=\"2\"]").click();
    w.__DEV.showResults();
    if (realCanonicalVerdict(w) !== true) throw new Error("ciclo: veredito canônico não abriu");
    assertPageReleased(w, d, "ciclo/2-liberado", true);

    /* rebloquear pelo caminho REAL, sobre a MESMA página já restaurada */
    q(d, "#review").click();
    guard = 0;
    while (FX.p50Step(d) > 2 && guard++ < 40) FX.p50Key(w, d, "ArrowLeft");
    if (FX.p50Step(d) !== 2) throw new Error("ciclo: navegação real falhou (rebloquear)");
    q(d, "#app .opts .opt[data-i=\"NA\"]").click();
    w.__DEV.showResults();
    if (realCanonicalVerdict(w) !== false) throw new Error("ciclo: veredito canônico não rebloqueou");
    assertPageBlocked(d, "ciclo/3-rebloqueado");
    const appNode = q(d, "#app");
    w.__uxDecor(appNode);
    assertPageBlocked(d, "ciclo/3-rebloqueado/sem-render");

    /* 4-5: liberar e rebloquear SEM render, sobre o MESMO nó já neutralizado.
       É aqui que a restauração roda de verdade — e, logo depois, a
       neutralização precisa acontecer OUTRA VEZ sobre nós já restaurados. */
    w.__DEV.setAnswerById("governance", 1);
    if (realCanonicalVerdict(w) !== true) throw new Error("ciclo: veredito não abriu sem render");
    w.__uxDecor(appNode);
    if (q(d, "#app") !== appNode) throw new Error("ciclo: #app foi reconstruído");
    assertPageReleased(w, d, "ciclo/4-liberado-sem-render", false);

    w.__DEV.setAnswerById("governance", "NA");
    if (realCanonicalVerdict(w) !== false) throw new Error("ciclo: veredito não rebloqueou sem render");
    w.__uxDecor(appNode);
    assertPageBlocked(d, "ciclo/5-rebloqueado-sem-render");
  })();
  return true;
});

T("P50-SUF6", "UNSET, NA e NONE distintos em tela, texto e nome acessível na superfície nova", () => {
  /* P50-F6: Negócio tem null (q0), "NA" (q1) e 0 (q2) — os três estados juntos. */
  const { w, d } = boot();
  FX.p50ApplyResults(w, d, FX.P50_F6);
  const row = q(d, "#p50-suff [data-p50=\"suff-domain\"][data-dom=\"0\"]");
  if (!row) throw new Error("composição do domínio 0 ausente na superfície nova");
  const nConf = Number(row.getAttribute("data-p50-confirmed"));
  const nVal = Number(row.getAttribute("data-p50-tovalidate"));
  const nUn = Number(row.getAttribute("data-p50-unanswered"));
  if (nConf !== 1) throw new Error("NONE (0) não foi contado como confirmado: confirmadas=" + nConf);
  if (nVal !== 1) throw new Error("\"NA\" não foi contado como a validar: " + nVal);
  if (nUn !== 1) throw new Error("UNSET (null) não foi contado como não respondido: " + nUn);
  const t = txt(row);
  if (!/1 confirmada/.test(t)) throw new Error("estado confirmado ausente do texto: '" + t + "'");
  if (!/1 a validar/.test(t)) throw new Error("estado 'a validar' ausente do texto: '" + t + "'");
  if (!/1 não respondida/.test(t)) throw new Error("estado 'não respondida' ausente do texto: '" + t + "'");
  const acc = accName(row);
  ["confirmada", "a validar", "não respondida"].forEach(s => {
    if (acc.indexOf(s) < 0) throw new Error("nome acessível sem o estado '" + s + "': '" + acc + "'");
  });
  /* a distinção não depende de cor: o texto sozinho já separa os três estados */
  const stripped = t.replace(/\s+/g, " ");
  if (stripped.indexOf("1 confirmada") === stripped.indexOf("1 a validar"))
    throw new Error("estados não são textualmente distintos");

  /* NONE nunca é apresentado como não respondido, e UNSET nunca pontua */
  const dom0 = derivedContract(w).domains[0];
  if (dom0.confirmed !== 1) throw new Error("contrato: NONE não confirma");
  if (dom0.missing !== 1) throw new Error("contrato: déficit de Negócio deveria ser 1, é " + dom0.missing);

  /* os três estados também permanecem distintos na superfície de perguntas */
  const B = boot();
  FX.p50ApplyFixture(B.w, B.d, FX.P50_F6);
  const items = qa(B.d, "#p50-shell [data-p50=\"domain\"][data-dom=\"0\"] [data-p50=\"q\"]");
  if (items.length !== 3) throw new Error("esperadas 3 perguntas no domínio 0, obtidas " + items.length);
  const byQid = {};
  items.forEach(li => { byQid[li.getAttribute("data-qid")] = li; });
  const semantics = ["mandate", "governance", "policies"].map(id => {
    const li = byQid[id];
    if (!li) throw new Error("pergunta " + id + " ausente na sidebar");
    return li.getAttribute("data-p50-ans");
  });
  if (semantics.join(",") !== "unset,na,confirmed")
    throw new Error("estados na superfície de perguntas: " + semantics.join(","));
  const accs = ["mandate", "governance", "policies"].map(id =>
    accName(byQid[id].querySelector("[data-p50=\"q-state\"]")));
  if (new Set(accs).size !== 3)
    throw new Error("nomes acessíveis não distintos na superfície de perguntas: " + JSON.stringify(accs));
  if (/\b0([.,]0)?\b/.test(accs[0])) throw new Error("UNSET apresentado como zero");
  if (!/confirmad/i.test(accs[2])) throw new Error("NONE (0) não apresentado como confirmado");

  /* Asserção nova de print/PDF permanece BLOQUEADA pela boundary normativa. */
  console.log("      P50-SUF6 · new print/PDF assertion: BLOCKED by normative boundary; not counted as PASS");
  return true;
});

T("P50-SUF7", "gate exaustivo do contrato derivado — 1024 vetores, campo a campo", () => {
  const { w, d } = boot();
  const vectors = allCountVectors();
  if (vectors.length !== 1024) throw new Error("espaço incompleto: " + vectors.length);
  let checked = 0, zeroConfirms = 0, nullSeen = 0, naSeen = 0;

  vectors.forEach(ns => {
    const vec = vecOfCounts(ns);
    applyVecOnly(w, vec);
    const got = derivedContract(w);
    const exp = expectedContract(vec);
    const fail = (field, e, o) => {
      throw new Error("vetor [" + ns + "] campo " + field + ": esperado " + JSON.stringify(e) +
        ", observado " + JSON.stringify(o) + ", estado aplicado " + JSON.stringify(vec));
    };
    if (got.confirmedGlobal !== ns[0] + ns[1] + ns[2] + ns[3] + ns[4]) fail("confirmedGlobal", ns.reduce((a, b) => a + b, 0), got.confirmedGlobal);
    if (got.requiredGlobal !== REQ_GLOBAL_ORACLE) fail("requiredGlobal", REQ_GLOBAL_ORACLE, got.requiredGlobal);
    if (got.missingGlobal !== exp.missingGlobal) fail("missingGlobal", exp.missingGlobal, got.missingGlobal);
    if (!Array.isArray(got.domains) || got.domains.length !== 5) fail("domains.length", 5, got.domains && got.domains.length);
    for (let i = 0; i < 5; i++) {
      const g = got.domains[i], e = exp.domains[i];
      if (g.domainId !== e.domainId) fail("domains[" + i + "].domainId", e.domainId, g.domainId);
      if (g.confirmed !== ns[i]) fail("domains[" + i + "].confirmed", ns[i], g.confirmed);
      if (g.required !== REQ_DOMAIN_ORACLE) fail("domains[" + i + "].required", REQ_DOMAIN_ORACLE, g.required);
      if (g.missing !== e.missing) fail("domains[" + i + "].missing", e.missing, g.missing);
      if (g.missing < 0) fail("domains[" + i + "].missing", ">= 0", g.missing);
    }
    if (got.missingGlobal < 0) fail("missingGlobal", ">= 0", got.missingGlobal);
    if (got.sufficient !== exp.sufficient) fail("sufficient", exp.sufficient, got.sufficient);

    /* equivalência com a FUNÇÃO REAL da Camada 1 */
    const canonical = realCanonicalVerdict(w);
    if (got.sufficient !== canonical) fail("derived.sufficient === dataSufficiency(stats)", canonical, got.sufficient);

    /* razões emitidas == déficits exatos, sem domínio satisfeito e sem omissão */
    const pending = w.__P50SUFF.pending(got);
    if (!Array.isArray(pending)) fail("pending", "array", typeof pending);
    const pendIds = pending.map(x => x.domainId).sort((a, b) => a - b);
    const wantIds = exp.domains.filter(x => x.missing > 0).map(x => x.domainId);
    if (pendIds.join(",") !== wantIds.join(",")) fail("pendências", wantIds, pendIds);
    pending.forEach(x => {
      const e = exp.domains[x.domainId];
      if (x.missing !== e.missing) fail("pending[" + x.domainId + "].missing", e.missing, x.missing);
      if (x.confirmed !== e.confirmed) fail("pending[" + x.domainId + "].confirmed", e.confirmed, x.confirmed);
      if (x.required !== e.required) fail("pending[" + x.domainId + "].required", e.required, x.required);
      if (x.missing <= 0) fail("pending[" + x.domainId + "].missing", "> 0", x.missing);
    });

    /* moeda canônica exercitada de fato neste vetor */
    vec.forEach(v => { if (v === null) nullSeen++; else if (v === "NA") naSeen++; else if (v === 0) zeroConfirms++; });
    checked++;
  });

  if (checked !== 1024) throw new Error("vetores verificados: " + checked);
  if (zeroConfirms === 0) throw new Error("valor 0 (NONE) nunca exercitado como confirmação");
  if (nullSeen === 0 || naSeen === 0) throw new Error("null/'NA' não exercitados como não confirmação");

  /* moeda: substituir uma confirmação por null e por "NA" fecha o gate no limiar */
  const base = vecOfCounts([2, 2, 2, 2, 2]);
  applyVecOnly(w, base);
  if (derivedContract(w).sufficient !== true) throw new Error("boundary [2,2,2,2,2] não é suficiente");
  [null, "NA"].forEach(nonConfirming => {
    const v = base.slice(); v[0] = nonConfirming;
    applyVecOnly(w, v);
    const c = derivedContract(w);
    if (c.sufficient !== false) throw new Error("valor " + JSON.stringify(nonConfirming) + " confirmou indevidamente");
    if (c.confirmedGlobal !== 9) throw new Error("contagem com " + JSON.stringify(nonConfirming) + ": " + c.confirmedGlobal);
    if (c.sufficient !== realCanonicalVerdict(w)) throw new Error("divergência do veredito canônico na moeda");
  });
  const v0 = base.slice(); v0[0] = 0;                     /* NONE confirma */
  applyVecOnly(w, v0);
  const c0 = derivedContract(w);
  if (c0.confirmedGlobal !== 10 || c0.sufficient !== true) throw new Error("0 (NONE) não confirmou");
  if (c0.sufficient !== realCanonicalVerdict(w)) throw new Error("divergência do veredito canônico com NONE");
  void d;
  return true;
});

T("P50-SUF8", "equivalência tripla sobre o MESMO estado — 1024 vetores, sem leak", () => {
  const { w } = boot();
  const initial = canonical(w);                            /* estado canônico completo */
  const vectors = allCountVectors();
  let checked = 0;

  vectors.forEach(ns => {
    /* 1-2. aplicar o vetor ao owner canônico `ans` pelos setters permitidos */
    const vec = vecOfCounts(ns);
    applyVecOnly(w, vec);
    /* 3. stats pela via canônica · 4. eff semanticamente idêntico ao aplicado */
    const eff = vec.slice();
    /* 5-6. funções REAIS, mesmo estado */
    const canonicalVerdict = realCanonicalVerdict(w);
    const targetVerdict = realTargetVerdict(w, eff);
    const derived = derivedContract(w).sufficient;
    /* 7. equivalência tripla exigida */
    if (!(targetVerdict === canonicalVerdict && canonicalVerdict === derived))
      throw new Error("vetor [" + ns + "]: computeTargetProfile=" + targetVerdict +
        " dataSufficiency=" + canonicalVerdict + " derived=" + derived +
        " estado " + JSON.stringify(vec));
    /* 8. restaurar o owner antes do próximo vetor */
    applyVecOnly(w, new Array(15).fill(null));
    if (w.eval("ans.some(v=>v!==null)")) throw new Error("restauração incompleta no vetor [" + ns + "]");
    checked++;
  });

  if (checked !== 1024) throw new Error("vetores verificados: " + checked);
  if (canonical(w) !== initial) throw new Error("leak acumulado: estado canônico final != inicial");
  if (sha(path.join(HERE, "ui_target_v32.js")) !== PROTECTED["ui_target_v32.js"])
    throw new Error("ui_target_v32.js deixou de ser byte-idêntico");
  return true;
});

/* ======================= 25.5 · SESSÃO (UX) ======================= */

T("P50-SESUX1A", "lint: nenhum claim de persistência/autosave nos módulos novos nem na superfície nova", () => {
  const banned = [/\bSaved\b/i, /\bAuto-?saved\b/i, /autosave/i, /salvo automaticamente/i,
    /salvamento autom/i, /pode fechar a aba/i, /feche a aba com segurança/i,
    /retome automaticamente/i, /retomada autom/i, /persist[eê]ncia autom/i];
  const files = [SHELL_JS, SHELL_CSS, path.join(HERE, "fixtures_p50.js")];
  files.forEach(p => {
    const s = readIf(p); if (s === null) return;
    banned.forEach(re => { if (re.test(s)) throw new Error(path.basename(p) + " contém claim proibido: " + re); });
  });
  Object.values(FX.P50_FIXTURES).forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyFixture(w, d, fx);
    const shell = q(d, "#p50-shell");
    if (!shell) throw new Error("shell ausente em " + fx.id);
    const all = (shell.textContent || "") + " " +
      qa(d, "#p50-shell [aria-label]").map(e => e.getAttribute("aria-label")).join(" ") + " " +
      qa(d, "#p50-shell [title]").map(e => e.getAttribute("title")).join(" ");
    banned.forEach(re => { if (re.test(all)) throw new Error("superfície nova exibe claim proibido: " + re); });
    /* 5.0.2: o componente de status EXISTE e deve exibir uma das frases canônicas */
    const st = q(d, "#p50-session-status");
    if (!st) throw new Error("componente de status de sessão ausente em " + fx.id);
    const l1 = txt(q(d, "[data-p50=\"ses-line1\"]")), l2 = txt(q(d, "[data-p50=\"ses-line2\"]"));
    const CANON = [
      ["Sessão não salva automaticamente.", "Exporte o arquivo da sessão para continuar depois."],
      ["Sessão exportada.", "Guarde o arquivo JSON para retomar posteriormente."],
      ["Sessão carregada do arquivo.", "Novas alterações não são salvas automaticamente."]
    ];
    if (!CANON.some(pair => pair[0] === l1 && pair[1] === l2))
      throw new Error(fx.id + ": par de mensagens fora do contrato UI-011: " + JSON.stringify([l1, l2]));
  });
  return true;
});

/* ======================= 5.0.2 · EVIDÊNCIA, CUE E CHIPS ======================= */

T("P50-UX3", "cue corresponde à descrição canônica da opção selecionada; sem cue stale nem cue sem resposta", () => {
  const { w, d } = boot();
  w.__DEV.setArq(0);
  q(d, "#start").click();
  FX.p50Key(w, d, "Enter");
  const cue = () => q(d, "#app [data-p50=\"cue\"]");
  /* (a) sem resposta -> nenhuma cue */
  if (cue()) throw new Error("cue exibida sem resposta selecionada");
  /* (b) para cada opção 0..3, a cue é EXATAMENTE opts[i].d do runtime */
  for (let k = 0; k < 3; k++) {
    if (FX.p50Step(d) !== k + 1) throw new Error("step inesperado k=" + k);
    for (let i = 0; i < 4; i++) {
      qa(d, "#app .opts .opt")[i].click();
      const c = cue();
      if (!c) throw new Error("cue ausente após selecionar " + i + " em k=" + k);
      const card = q(d, "#app .opts .opt[data-p50-selected=\"true\"]");
      const canonical_d = card.getAttribute("data-p50-optd");
      if (txt(c) !== canonical_d)
        throw new Error("cue != opts[" + i + "].d em k=" + k + ": " + JSON.stringify(txt(c)));
      if (c.getAttribute("data-p50-cue-for") !== String(i))
        throw new Error("cue-for dessincronizado em k=" + k + " i=" + i);
    }
    /* (c) NA usa o descritor canônico já renderizado (Caminho A/C), sem inventar */
    qa(d, "#app .opts .opt")[4].click();
    const cna = cue();
    if (!cna) throw new Error("cue ausente para NA em k=" + k);
    if (cna.getAttribute("data-p50-cue-for") !== "NA") throw new Error("cue-for != NA");
    const naDesc = txt(q(d, "#app .opts .opt.na .d"));
    if (txt(cna) !== naDesc) throw new Error("cue de NA não é o descritor canônico do runtime");
    /* (d) sem cue stale: voltar a 0 troca a cue */
    qa(d, "#app .opts .opt")[0].click();
    if (txt(cue()) === naDesc) throw new Error("cue stale após trocar de NA para 0");
    FX.p50Key(w, d, "Enter");
  }
  /* (e) a cue não altera estado canônico */
  const before = canonical(w);
  q(d, "#app [data-p50=\"cue\"]");
  if (canonical(w) !== before) throw new Error("leitura da cue alterou estado canônico");
  return true;
});

T("P50-UX4", "evidência binda somente ao owner canônico notes[k] e sobrevive ao roundtrip", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  const k = FX.P50_F2.focusQuestion, qid = FX.P50_QIDS[k];
  const TXT = "Evidência via UI real — SLA 30 min & \"aspas\" <tag> 😀";
  /* escrita pelo caminho congelado: abre o editor pelo botão P50 e digita */
  const openBtn = q(d, "#app [data-p50=\"evidence-open\"]");
  if (!openBtn) throw new Error("atalho P50 de evidência ausente");
  openBtn.click();
  const ta = q(d, "#notetxt");
  if (!ta) throw new Error("campo canônico de nota não foi aberto pelo atalho");
  ta.value = TXT;
  ta.dispatchEvent(new w.Event("input", { bubbles: true }));
  /* owner canônico recebeu o valor */
  const inputs = w.__DEV.captureCanonicalInputs();
  if (inputs.assessment.notes[qid] !== TXT)
    throw new Error("nota não chegou a inputs.assessment.notes[" + qid + "]");
  /* nenhum owner paralelo: as notas do documento são exatamente as não vazias */
  const doc = w.__DEV.buildSessionDocument("t");
  const keys = Object.keys(doc.inputs.assessment.notes);
  if (!keys.includes(qid)) throw new Error("nota ausente do documento exportado");
  if (JSON.stringify(doc.inputs.assessment) !== JSON.stringify(inputs.assessment))
    throw new Error("assessment do documento difere dos inputs canônicos");
  /* a presença de nota NÃO confirma resposta (UI-007) */
  const k2 = 12;                                   /* Serviços · sem resposta */
  w.__DEV.setNote(k2, "nota sem resposta");
  const after = w.__DEV.captureCanonicalInputs();
  if (after.assessment.answers[FX.P50_QIDS[k2]] !== null)
    throw new Error("nota alterou a resposta canônica");
  /* nenhum segundo store: o módulo novo não declara owner paralelo */
  const src = readIf(SHELL_JS) || "";
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "");
  if (/notes\s*\[[^\]]*\]\s*=[^=]/.test(code))
    throw new Error("módulo novo escreve diretamente em notes[...]");
  if (/(evidence|notas?)\s*(Store|Map|By(Domain|Session|Aspect))/i.test(code))
    throw new Error("módulo novo declara store paralelo de evidência");
  return true;
});

T("P50-UX5", "todo chip tem provenance no runtime; nenhum chip fabricado", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F8);
  const k = FX.P50_F8.focusQuestion, qid = FX.P50_QIDS[k];
  const chips = qa(d, "#app [data-p50=\"chip\"]");
  if (chips.length !== 3) throw new Error("esperados 3 chips, obtidos " + chips.length);
  const kinds = chips.map(c => c.getAttribute("data-p50-chip"));
  if (JSON.stringify(kinds) !== JSON.stringify(["qid", "dom", "evidence"]))
    throw new Error("conjunto de chips: " + JSON.stringify(kinds));
  /* provenance verificável contra o runtime */
  if (!txt(chips[0]).includes(qid)) throw new Error("chip de Question ID sem o id canônico");
  const domIdx = FX.P50_DOM_OF[k];
  const expectDom = FX.P50_DOM_PT[domIdx] + " · " + FX.P50_DOM_EN[domIdx];
  if (txt(chips[1]) !== expectDom) throw new Error("chip de domínio: " + txt(chips[1]));
  if (chips[1].getAttribute("data-dom") !== String(domIdx)) throw new Error("data-dom incorreto");
  if (chips[2].getAttribute("data-p50-evidence") !== "present")
    throw new Error("chip de evidência deveria indicar presença em P50-F8");
  chips.forEach(c => { if (!(c.getAttribute("aria-label") || "").trim()) throw new Error("chip sem nome acessível"); });
  /* proibido: importance/weight, framework mapping, NIST/CIS */
  const all = txt(q(d, "#app [data-p50=\"chips\"]"));
  [/importance/i, /weight/i, /peso/i, /criticidade/i, /NIST/i, /\bCIS\b/i, /framework/i].forEach(re => {
    if (re.test(all)) throw new Error("chip fabricado detectado: " + re);
  });
  /* ausência de nota inverte o indicador, sem tocar em ans */
  const before = canonical(w);
  const B = boot();
  FX.p50ApplyFixture(B.w, B.d, FX.P50_F2);
  const ev = q(B.d, "#app [data-p50-chip=\"evidence\"]");
  if (ev.getAttribute("data-p50-evidence") !== "none")
    throw new Error("chip de evidência deveria indicar ausência em P50-F2");
  void before;
  return true;
});

T("P50-UX12", "renderização inerte de texto livre adversarial na superfície nova", () => {
  const { w, d } = boot();
  const errs = []; w.console.error = (...a) => errs.push(a.join(" "));
  FX.p50ApplyFixture(w, d, FX.P50_F10);
  if (w.__p50_pwned) throw new Error("payload executou durante a renderização");
  const host = q(d, "#app [data-p50=\"evidence-preview\"]");
  if (!host) throw new Error("preview de evidência ausente para P50-F10");
  /* nenhum nó executável criado a partir do payload */
  const scope = q(d, "#app");
  if (scope.querySelector("#p50-cue script, #p50-cue iframe, #p50-q script, #p50-q iframe"))
    throw new Error("nó executável criado na superfície nova");
  const inj = scope.querySelector("#p50-cue h1, #p50-q h1");
  if (inj) throw new Error("escape de contexto: elemento injetado " + inj.tagName);
  /* nenhum atributo de evento nos nós da superfície nova */
  qa(d, "#app #p50-q *, #app #p50-cue *").concat([q(d, "#app #p50-q"), q(d, "#app #p50-cue")])
    .filter(Boolean).forEach(n => {
      Array.from(n.attributes || []).forEach(at => {
        if (/^on/i.test(at.name)) throw new Error("atributo de evento " + at.name + " em " + n.tagName);
        if (/^javascript:/i.test(String(at.value || "").trim()))
          throw new Error("URL javascript: em " + at.name);
      });
    });
  /* o texto permanece INERTE: aparece como texto, não como marcação */
  const shown = txt(host);
  if (!shown.includes("<script>")) throw new Error("payload não foi preservado como texto literal");
  /* cada payload individual, isolado, permanece inerte */
  FX.P50_ADVERSARIAL.forEach((payload, i) => {
    const B = boot();
    B.w.console.error = () => {};
    const vec = FX.P50_F10.vec.slice();
    const notes = {}; notes[0] = payload;
    FX.p50GotoQuestion(B.w, B.d, vec, 0, notes);
    if (B.w.__p50_pwned) throw new Error("payload " + i + " executou");
    const pv = q(B.d, "#app [data-p50=\"evidence-preview\"]");
    if (!pv) throw new Error("payload " + i + ": preview ausente");
    if (pv.children.length !== 0) throw new Error("payload " + i + " gerou " + pv.children.length + " elemento(s)");
    if (pv.querySelector("*")) throw new Error("payload " + i + " gerou marcação");
  });
  if (errs.length) throw new Error("console sujo: " + errs.slice(0, 2).join(" | "));
  return true;
});

/* ======================= 5.0.2 · SESSÃO (UX) ======================= */

/* Aciona o caminho REAL de export: botão congelado -> modal -> confirmar. */
function realExport(w, d, label) {
  /* jsdom não implementa Object URLs; a suíte SESSION 4.8 congelada aplica o
     mesmo polyfill (tests_session_m48.js:247). Não altera o produto: apenas
     permite que o caminho real de download execute sob jsdom. */
  if (typeof w.URL.createObjectURL !== "function") {
    w.URL.createObjectURL = () => "blob:p50";
    w.URL.revokeObjectURL = () => {};
  }
  w.__DEV.showResults();
  const btn = q(d, "#ses-export");
  if (!btn) throw new Error("controle congelado #ses-export ausente");
  btn.click();
  const modal = q(d, "#ux-modal");
  if (!modal) throw new Error("modal de export não abriu");
  if (label !== undefined) {
    const inp = q(d, "#ses-label");
    if (inp) { inp.value = label; inp.dispatchEvent(new w.Event("input", { bubbles: true })); }
  }
  q(d, "#ux-modal-ok").click();
}

/* Volta de resultados para a pergunta pelo controle congelado #review e digita
   evidência disparando o evento real do campo canônico. NÃO escreve notes[k]. */
function realNoteEdit(w, d, text) {
  const rev = q(d, "#review");
  if (!rev) throw new Error("controle congelado #review ausente");
  rev.click();
  const open = q(d, "#app [data-p50=\"evidence-open\"]");
  if (!open) throw new Error("atalho P50 de evidência ausente");
  open.click();
  const ta = q(d, "#notetxt");
  if (!ta) throw new Error("campo canônico #notetxt não foi aberto");
  ta.value = text;
  ta.dispatchEvent(new w.Event("input", { bubbles: true }));
  return ta;
}

T("P50-SESUX2", "wording de export aparece somente após export bem-sucedido", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  const line1 = () => txt(q(d, "[data-p50=\"ses-line1\"]"));
  const state = () => (q(d, "#p50-session-status") || {}).getAttribute("data-p50-ses-state");
  if (line1() !== "Sessão não salva automaticamente.")
    throw new Error("estado inicial não é o padrão: " + line1());
  realExport(w, d, "gate");
  if (state() !== "exported") throw new Error("estado após export: " + state());
  if (line1() !== "Sessão exportada.") throw new Error("wording de export ausente: " + line1());
  if (txt(q(d, "[data-p50=\"ses-line2\"]")) !== "Guarde o arquivo JSON para retomar posteriormente.")
    throw new Error("segunda linha do export incorreta");
  if (w.__P50.diag().sessionDirty !== false) throw new Error("dirty deveria zerar após export");
  /* modificação posterior devolve o estado ao padrão (honestidade) */
  w.__DEV.setAnswerById(FX.P50_QIDS[5], 2);
  w.__uxDecor(q(d, "#app"));            /* caminho real de redecoração em resultados */
  const st2 = q(d, "#p50-session-status");
  if (st2.getAttribute("data-p50-ses-dirty") !== "true")
    throw new Error("modificação pós-export não marcou dirty");
  if (txt(q(d, "[data-p50=\"ses-line1\"]")) !== "Sessão não salva automaticamente.")
    throw new Error("wording de export persistiu apesar de modificação posterior");

  /* --- B-502-1: fluxo REAL export -> digitar evidência -> status honesto --- */
  const B = boot();
  FX.p50ApplyFixture(B.w, B.d, FX.P50_F2);
  realExport(B.w, B.d, "b502");
  if (txt(q(B.d, "[data-p50=\"ses-line1\"]")) !== "Sessão exportada.")
    throw new Error("pré-condição: export não produziu o wording esperado");
  const noteBefore = JSON.stringify(B.w.__DEV.captureCanonicalInputs().assessment.notes);
  realNoteEdit(B.w, B.d, "evidência digitada pelo usuário após o export");
  const box = q(B.d, "#p50-session-status");
  if (!box) throw new Error("status ausente após digitar evidência");
  if (box.getAttribute("data-p50-ses-state") !== "default")
    throw new Error("status stale após digitar evidência: " + box.getAttribute("data-p50-ses-state"));
  if (box.getAttribute("data-p50-ses-dirty") !== "true")
    throw new Error("dirty não reconciliado após digitar evidência");
  if (txt(q(B.d, "[data-p50=\"ses-line1\"]")) !== "Sessão não salva automaticamente.")
    throw new Error("wording de export permaneceu após digitar evidência");
  if (!/Há alterações ainda não exportadas\./.test(txt(box)))
    throw new Error("nota de alterações pendentes ausente: " + txt(box));
  /* o owner canônico foi alterado pelo handler CONGELADO, não pelo módulo P50 */
  const noteAfter = JSON.stringify(B.w.__DEV.captureCanonicalInputs().assessment.notes);
  if (noteAfter === noteBefore) throw new Error("o handler congelado não gravou a nota");
  if (!noteAfter.includes("evidência digitada pelo usuário"))
    throw new Error("nota não chegou ao owner canônico");
  /* indicador de evidência reconciliado sem re-render */
  const chip = q(B.d, "#app [data-p50-chip=\"evidence\"]");
  if (!chip || chip.getAttribute("data-p50-evidence") !== "present")
    throw new Error("indicador de evidência stale após digitação");
  return true;
});

T("P50-SESUX3", "wording de import não implica persistência automática", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  const doc = w.__DEV.buildSessionDocument("import-gate");
  const compat = w.__DEV.sessionCompatibility(doc);
  w.__DEV.showImportPreview(doc, compat, null);
  const ok = q(d, "#ux-modal-ok");
  if (!ok) throw new Error("modal de import não abriu");
  ok.click();
  const st = q(d, "#p50-session-status");
  if (!st) throw new Error("status ausente após import");
  if (st.getAttribute("data-p50-ses-state") !== "imported")
    throw new Error("estado após import: " + st.getAttribute("data-p50-ses-state"));
  const l1 = txt(q(d, "[data-p50=\"ses-line1\"]")), l2 = txt(q(d, "[data-p50=\"ses-line2\"]"));
  if (l1 !== "Sessão carregada do arquivo.") throw new Error("linha 1 do import: " + l1);
  if (l2 !== "Novas alterações não são salvas automaticamente.") throw new Error("linha 2 do import: " + l2);
  /* nenhuma promessa de persistência/retomada automática */
  [/\bSaved\b/i, /autosave/i, /pode fechar a aba/i, /retome automaticamente/i, /salvo automaticamente/i]
    .forEach(re => { if (re.test(l1 + " " + l2)) throw new Error("claim proibido no wording de import"); });

  /* --- B-502-1: fluxo REAL import -> digitar evidência -> status honesto --- */
  realNoteEdit(w, d, "evidência digitada pelo usuário após o import");
  const box = q(d, "#p50-session-status");
  if (box.getAttribute("data-p50-ses-state") !== "default")
    throw new Error("estado imported persistiu após edição: " + box.getAttribute("data-p50-ses-state"));
  if (box.getAttribute("data-p50-ses-dirty") !== "true")
    throw new Error("dirty não reconciliado após edição pós-import");
  if (txt(q(d, "[data-p50=\"ses-line1\"]")) === "Sessão carregada do arquivo.")
    throw new Error("wording de import permaneceu após edição");
  if (!w.__DEV.captureCanonicalInputs().assessment.notes[FX.P50_QIDS[14]])
    throw new Error("nota não chegou ao owner canônico no fluxo de import");
  return true;
});

T("P50-SESUX4", "session roundtrip permanece canônico com a superfície nova ativa", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F8);
  const before = canonical(w);
  const doc = w.__DEV.buildSessionDocument("roundtrip");
  const v = w.__DEV.validateSessionDocument(doc);
  if (!v.ok) throw new Error("documento inválido: " + v.error);
  /* zera e reimporta pelo caminho real */
  FX.P50_QIDS.forEach((id, k) => { w.__DEV.setAnswerById(id, null); w.__DEV.setNote(k, ""); });
  if (canonical(w) === before) throw new Error("pré-condição: estado não foi zerado");
  const r = w.__DEV.importSessionDocument(doc);
  if (!r.ok) throw new Error("import falhou: " + r.error);
  if (canonical(w) !== before) throw new Error("roundtrip não preservou os inputs canônicos");

  /* ============ H-502-1 · contrato dos wrappers de sessão (AMB-2.1) ============
     Provado materialmente, não apenas exposto em diag(). */
  const P = boot();
  FX.p50ApplyFixture(P.w, P.d, FX.P50_F2);
  /* Polyfill de Object URL (mesmo da SESSION 4.8 congelada): sem ele, um
     bypass do observador cairia numa limitação do jsdom e a detecção do
     mutante seria INCIDENTAL, não semântica. */
  if (typeof P.w.URL.createObjectURL !== "function") {
    P.w.URL.createObjectURL = () => "blob:p50";
    P.w.URL.revokeObjectURL = () => {};
  }
  const dg = P.w.__P50.diag();

  /* (1) exatamente dois wrappers instalados; (9) sem dupla instalação */
  if (dg.sessionWrapCount !== 2)
    throw new Error("wrappers de sessão instalados: " + dg.sessionWrapCount + " (esperado 2)");
  if (P.w.__P50.__installed !== true) throw new Error("guard de instalação ausente");

  /* (2) captura única + (3) uma invocação do predecessor por chamada
     + (4) ordem predecessor -> observador + (5) this/argumentos preservados
     + (6) identidade do retorno */
  const seen = [];
  const SENTINEL = { ok: true, filename: "sentinela.json", bytes: 7 };
  const CTX = { marca: "contexto-de-teste" };
  P.w.__P50.__resetSessionCounters();
  P.w.__P50.__substituteSessionPredecessor("download", function (label) {
    seen.push({ phase: "predecessor", this: this, args: Array.from(arguments), label });
    return SENTINEL;
  });
  const ret = P.w.downloadSession.call(CTX, "rotulo-x", 42);
  P.w.__P50.__substituteSessionPredecessor("download", null);

  if (seen.length !== 1) throw new Error("predecessor invocado " + seen.length + " vez(es), esperado 1");
  if (seen[0].this !== CTX) throw new Error("`this` do predecessor não preservado");
  if (JSON.stringify(seen[0].args) !== JSON.stringify(["rotulo-x", 42]))
    throw new Error("argumentos não preservados: " + JSON.stringify(seen[0].args));
  if (ret !== SENTINEL) throw new Error("identidade do objeto retornado não preservada");
  const c1 = P.w.__P50.diag();
  if (c1.sessionCalls.download !== 1 || c1.sessionPredCalls.download !== 1)
    throw new Error("contadores: " + JSON.stringify(c1.sessionCalls) + " / " + JSON.stringify(c1.sessionPredCalls));
  /* (10) sucesso derivado do retorno real */
  if (c1.sessionState !== "exported") throw new Error("ok=true não marcou exported");
  if (c1.sessionDirty !== false) throw new Error("ok=true não marcou clean");

  /* export ok=false NUNCA marca exported/clean */
  P.w.__DEV.setAnswerById(FX.P50_QIDS[5], 2);                 /* índice null em P50-F2: sujo de fato */
  P.w.__P50.__substituteSessionPredecessor("download", () => ({ ok: false, error: "recusado" }));
  const bad = P.w.downloadSession("y");
  P.w.__P50.__substituteSessionPredecessor("download", null);
  if (bad.ok !== false) throw new Error("retorno de falha alterado pelo wrapper");
  const c2 = P.w.__P50.diag();
  if (c2.sessionState === "exported") throw new Error("ok=false marcou exported");
  if (c2.sessionDirty !== true) throw new Error("ok=false marcou clean");

  /* import ok=true marca imported/clean; ok=false nunca marca imported */
  P.w.__P50.__substituteSessionPredecessor("import", () => ({ ok: true }));
  P.w.importSessionDocument({});
  P.w.__P50.__substituteSessionPredecessor("import", null);
  if (P.w.__P50.diag().sessionState !== "imported") throw new Error("import ok=true não marcou imported");
  /* ok=false NUNCA marca imported — verificado a partir de um estado limpo */
  const F = boot();
  FX.p50ApplyFixture(F.w, F.d, FX.P50_F2);
  if (F.w.__P50.diag().sessionState !== "default") throw new Error("pré-condição: estado inicial != default");
  F.w.__P50.__substituteSessionPredecessor("import", () => ({ ok: false, error: "x" }));
  const badImp = F.w.importSessionDocument({});
  F.w.__P50.__substituteSessionPredecessor("import", null);
  if (badImp.ok !== false) throw new Error("retorno de falha de import alterado pelo wrapper");
  if (F.w.__P50.diag().sessionState !== "default") throw new Error("import ok=false marcou imported");

  /* (7) exceção do predecessor propaga intacta */
  const BOOM = new Error("falha-do-predecessor");
  P.w.__P50.__substituteSessionPredecessor("download", () => { throw BOOM; });
  let caught = null;
  try { P.w.downloadSession("z"); } catch (e) { caught = e; }
  P.w.__P50.__substituteSessionPredecessor("download", null);
  if (caught !== BOOM) throw new Error("exceção do predecessor não propagou intacta");

  /* (8) o wrapper não escreve em owner canônico */
  const canonBefore = canonical(P.w);
  P.w.__P50.__substituteSessionPredecessor("download", () => ({ ok: true }));
  P.w.downloadSession("w");
  P.w.__P50.__substituteSessionPredecessor("download", null);
  if (canonical(P.w) !== canonBefore) throw new Error("wrapper alterou owner canônico");

  /* (11) o observador P50 falho não contamina o retorno da operação */
  const S = boot();
  FX.p50ApplyFixture(S.w, S.d, FX.P50_F2);
  S.w.__P50.__substituteSessionPredecessor("download", () => ({ ok: true, filename: "f.json" }));
  const statusNode = q(S.d, "#p50-session-status");
  if (statusNode) Object.defineProperty(statusNode, "parentNode", { get() { throw new Error("observador quebrado"); } });
  const r2 = S.w.downloadSession("iso");
  S.w.__P50.__substituteSessionPredecessor("download", null);
  if (!r2 || r2.ok !== true) throw new Error("falha do observador contaminou o retorno da operação");

  /* lint: nenhuma duplicação de lógica de sessão no módulo novo */
  const src = (readIf(SHELL_JS) || "").replace(/\/\*[\s\S]*?\*\//g, "");
  ["validateSessionDocument", "normalizeSessionDocument", "commitCanonicalOwners",
   "buildSessionDocument", "prepareSessionExport", "sessionFilename"].forEach(fn => {
    if (new RegExp("\\b" + fn + "\\s*\\(").test(src))
      throw new Error("módulo novo duplica lógica de Session Portability: " + fn + "()");
  });
  return true;
});

T("P50-SESUX5", "estado efêmero de UX nunca entra no documento exportado e é recusado no import", () => {
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  /* manipula estado de apresentação e de sessão antes de exportar */
  q(d, "#p50-shell button[data-p50=\"sidebar-toggle\"]").click();
  realExport(w, d, "efemero");
  const doc = w.__DEV.buildSessionDocument("efemero");
  const json = JSON.stringify(doc);
  /* Varredura RECURSIVA de nomes de chave: qualquer chave que denuncie estado
     efêmero de UX é reprovada, em qualquer profundidade. Mais forte do que uma
     lista literal — foi a lista literal que deixou passar o mutante M17. */
  const EPHEMERAL = /(p50|dirty|collaps|ephemeral|lastexport|lastimport|sesstate|sessionstate|uxstate|autosave)/i;
  (function scan(node, path) {
    if (node === null || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach((v, i) => scan(v, path + "[" + i + "]")); return; }
    Object.keys(node).forEach(kk => {
      if (EPHEMERAL.test(kk))
        throw new Error("estado efêmero serializado em " + path + "." + kk);
      scan(node[kk], path + "." + kk);
    });
  })(doc, "doc");
  /* o documento construído com a superfície nova ativa continua VÁLIDO */
  const vdoc = w.__DEV.validateSessionDocument(doc);
  if (!vdoc.ok) throw new Error("documento exportado inválido: " + vdoc.error);
  /* e o bloco inputs é exatamente o dos owners canônicos */
  if (JSON.stringify(doc.inputs) !== JSON.stringify(w.__DEV.captureCanonicalInputs()))
    throw new Error("inputs do documento divergem dos owners canônicos");
  if (Object.keys(doc.inputs).sort().join(",") !==
      ["assessment", "operationalRefinement", "priorities", "targetProfile", "technologyLandscape"].join(","))
    throw new Error("bloco inputs alterado: " + Object.keys(doc.inputs).join(","));
  /* complemento adversarial: injetar o estado efêmero no import deve ser RECUSADO */
  const inj1 = JSON.parse(json); inj1.p50SessionState = "exported";
  if (w.__DEV.validateSessionDocument(inj1).ok) throw new Error("chave extra na raiz foi aceita");
  const inj2 = JSON.parse(json); inj2.inputs.uxEphemeral = { dirty: true };
  if (w.__DEV.validateSessionDocument(inj2).ok) throw new Error("chave extra em inputs foi aceita");
  const inj3 = JSON.parse(json); inj3.inputs.assessment.dirty = true;
  if (w.__DEV.validateSessionDocument(inj3).ok) throw new Error("chave extra em assessment foi aceita");
  return true;
});

/* ======================= 25.8 · IDENTIDADE VISUAL ======================= */

const DOMAIN_HEX = ["#9063CD", "#3CB17E", "#2CCCD3", "#307FE2", "#A2B2C8"];

T("P50-COR1", "lint de fonte única: zero hex de cor de domínio nos módulos novos", () => {
  const srcs = P50_NEW_MODULES.map(p => ({ p, s: readIf(p) })).filter(o => o.s !== null);
  if (!srcs.length) throw new Error("nenhum módulo novo presente para lintar");
  srcs.forEach(({ p, s }) => {
    DOMAIN_HEX.forEach(hex => {
      const re = new RegExp(hex.replace("#", "#?"), "i");
      if (re.test(s)) throw new Error(path.basename(p) + " declara hex de domínio " + hex);
    });
    /* nenhum hex de 3/6 dígitos é declarado pelos módulos novos: a cor vem de tokens */
    const hexes = s.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    if (hexes.length) throw new Error(path.basename(p) + " declara hex literal: " + hexes.join(","));
  });
  const css = readIf(SHELL_CSS) || "";
  if (!/var\(--dom-accent\)/.test(css)) throw new Error("CSS novo não consome o token congelado --dom-accent");
  return true;
});

T("P50-COR2", "cor do domínio na dimensão de dados; acento de marca ausente dos dados", () => {
  const css = readIf(SHELL_CSS) || "";
  if (!css) throw new Error("ui_p50_v32.css ausente");
  if (/--ftnt-red/.test(css)) throw new Error("acento de marca usado na camada nova de dados");
  const { w, d } = boot();
  FX.p50ApplyFixture(w, d, FX.P50_F2);
  /* todo bloco de domínio da sidebar carrega a identidade canônica do domínio */
  for (let i = 0; i < 5; i++) {
    const sec = q(d, "#p50-shell [data-p50=\"domain\"][data-dom=\"" + i + "\"]");
    if (!sec) throw new Error("domínio " + i + " ausente");
    if (sec.getAttribute("data-dom") !== String(i)) throw new Error("data-dom incorreto em " + i);
    if ((sec.getAttribute("style") || "").length) throw new Error("cor inline no domínio " + i);
  }
  /* mapa congelado [data-dom] -> --ftnt-* permanece a autoridade */
  if (!/\[data-dom="0"\]\{\s*--dom-accent:var\(--ftnt-purple\);/.test(HTML))
    throw new Error("mapa congelado de cor por domínio ausente do build");

  /* 5.0.4 · o heat map e o Current × Target são visualizações em que o DOMÍNIO
     é a dimensão: a cor vem do token do próprio domínio, nunca do acento. */
  FX.p50ApplyResults(w, d, FX.P50_F9);
  const grid = q(d, "#p50-results [data-p50=\"heatmap\"]");
  if (!grid) throw new Error("heat map ausente");
  for (let i = 0; i < 5; i++) {
    const row = q(d, "#p50-results [data-p50=\"hm-row\"][data-dom=\"" + i + "\"]");
    if (!row) throw new Error("linha de domínio " + i + " ausente no heat map");
    if (row.getAttribute("data-dom") !== String(i))
      throw new Error("heat map: data-dom incorreto em " + i);
    if ((row.getAttribute("style") || "").length) throw new Error("heat map: cor inline no domínio " + i);
    const ct = q(d, "#p50-results [data-p50=\"ct-row\"][data-dom=\"" + i + "\"]");
    if (!ct) throw new Error("linha Current × Target do domínio " + i + " ausente");
    if ((ct.getAttribute("style") || "").length) throw new Error("Current × Target: cor inline no domínio " + i);
  }
  /* O proibido é COR inline. Custom properties de geometria/nível são
     legítimas (o próprio runtime congelado plota `.fill` por style inline);
     o que não pode existir é cor de dado escapando do token de domínio. */
  const COLOR_INLINE = /(^|;)\s*(color|background|background-color|border[a-z-]*color|fill|stroke)\s*:/i;
  const HEX_INLINE = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/i;
  qa(d, "#p50-results [data-p50=\"hm-cell\"], #p50-results [data-p50=\"ct-current\"], #p50-results [data-p50=\"ct-target\"]").forEach(c => {
    const st = c.getAttribute("style") || "";
    if (COLOR_INLINE.test(st)) throw new Error("cor inline na dimensão de dados: " + st);
    if (HEX_INLINE.test(st)) throw new Error("cor literal inline na dimensão de dados: " + st);
  });
  qa(d, "#p50-results [data-p50=\"hm-cell\"]").forEach(c => {
    if (!c.hasAttribute("data-dom")) throw new Error("heat map: célula sem identidade de domínio");
  });
  /* o CSS da camada nova resolve a cor de dados por token de domínio */
  if (!/\.p50-hm-cell[^{]*\{[^}]*var\(--dom-accent\)/.test(css.replace(/\s+/g, " ")) &&
      !/--p50-hm-tint:\s*var\(--dom-accent\)/.test(css))
    throw new Error("heat map não consome var(--dom-accent) como cor de dados");
  return true;
});

T("P50-UX11", "UNSET × NONE no eixo de presence: DOM, rótulo visível e nome acessível distintos", () => {
  const { w, d } = boot();
  const fx = FX.P50_F7;
  FX.p50ApplyResults(w, d, fx);

  /* pré-condição: o estado veio dos owners canônicos, não da superfície nova */
  const L = w.__DEV.V32.TECH_LANDSCAPE;
  if (L["knowledge-management"].presence !== "UNSET")
    throw new Error("pré-condição: capability A não está UNSET no runtime");
  if (L["security-analytics"].presence !== "NONE")
    throw new Error("pré-condição: capability B não está NONE no runtime");

  const chip = id => q(d, "#p50-results [data-p50=\"presence-chip\"][data-cap=\"" + id + "\"]");
  const a = chip("knowledge-management"), b = chip("security-analytics");
  if (!a || !b) throw new Error("chips de presence ausentes na superfície nova");

  /* (1) DOM semantics distintos */
  const semA = a.getAttribute("data-p50-presence"), semB = b.getAttribute("data-p50-presence");
  if (semA !== "UNSET") throw new Error("data-p50-presence de A = " + semA);
  if (semB !== "NONE") throw new Error("data-p50-presence de B = " + semB);
  if (semA === semB) throw new Error("DOM semantics de UNSET e NONE idênticos");

  /* (2) rótulos visíveis distintos, vindos dos rótulos congelados */
  const visA = txt(a.querySelector("[data-p50=\"presence-state\"]"));
  const visB = txt(b.querySelector("[data-p50=\"presence-state\"]"));
  if (!visA || !visB) throw new Error("chip de presence sem rótulo textual");
  if (visA === visB) throw new Error("rótulos visíveis idênticos: " + visA);
  if (!/não informado/i.test(visA)) throw new Error("UNSET sem o rótulo canônico: " + visA);
  if (!/não existe|não utilizamos/i.test(visB)) throw new Error("NONE sem o rótulo canônico: " + visB);

  /* (3) nomes acessíveis distintos */
  const accA = accName(a), accB = accName(b);
  if (accA === accB) throw new Error("nomes acessíveis idênticos");
  if (!/não avaliad|não informad/i.test(accA)) throw new Error("nome acessível de UNSET: " + accA);
  if (/não avaliad/i.test(accB)) throw new Error("NONE descrito como não avaliado: " + accB);

  /* (4) UNSET nunca vira zero nem ausência confirmada */
  if (/\b0([.,]0)?\b/.test(visA + " " + accA)) throw new Error("UNSET renderizado como zero");
  if (a.hasAttribute("data-p50-level")) throw new Error("UNSET recebeu nível");
  if (a.getAttribute("data-p50-confirmed") === "true")
    throw new Error("UNSET marcado como estado confirmado");
  if (b.getAttribute("data-p50-confirmed") !== "true")
    throw new Error("NONE não é marcado como ausência CONFIRMADA");

  /* (5) a distinção não depende só de cor: ambos carregam pista textual própria */
  const cueA = a.getAttribute("data-p50-cue"), cueB = b.getAttribute("data-p50-cue");
  if (!cueA || !cueB) throw new Error("chip de presence sem pista não cromática");
  if (cueA === cueB) throw new Error("pista não cromática idêntica entre UNSET e NONE");

  /* (6) cobertura total do enum canônico: nenhum estado vaza como enum cru */
  const ENUM = w.__DEV.V32.ENUMS.presence;
  if (!Array.isArray(ENUM) || !ENUM.length) throw new Error("enum canônico de presence ausente");
  const src = readIf(RESULTS_JS) || "";
  const mapDecl = (src.match(/P50_PRESENCE_LABEL\s*=\s*\{[\s\S]*?\}/) || [""])[0];
  if (!mapDecl) throw new Error("rótulos de presence da Camada 5 ausentes");
  ENUM.forEach(v => {
    if (!new RegExp("\\b" + v + "\\s*:").test(mapDecl))
      throw new Error("estado canônico de presence sem rótulo na Camada 5: " + v);
  });
  qa(d, "#p50-results [data-p50=\"presence-chip\"]").forEach(c => {
    const st = txt(c.querySelector("[data-p50=\"presence-state\"]"));
    if (ENUM.indexOf(st) >= 0) throw new Error("enum cru vazou para a tela: " + st);
  });

  /* (7) nenhuma presence é fabricada onde o runtime não a fornece */
  const chips = qa(d, "#p50-results [data-p50=\"presence-chip\"]");
  chips.forEach(c => {
    const id = c.getAttribute("data-cap");
    if (!L[id]) throw new Error("chip de capability inexistente no runtime: " + id);
    if (c.getAttribute("data-p50-presence") !== L[id].presence)
      throw new Error("presence divergente do owner canônico em " + id);
  });
  return true;
});

T("P50-COR3", "UNSET nas superfícies novas: cor do próprio domínio esmaecida + pista não cromática", () => {
  const css = readIf(SHELL_CSS) || "";
  if (!css) throw new Error("ui_p50_v32.css ausente");
  const flat = css.replace(/\s+/g, " ");

  /* (1) o encoding de UNSET existe e é ancorado no token do PRÓPRIO domínio */
  const unsetRules = flat.match(/\[data-p50-ans="unset"\][^{]*\{[^}]*\}/g) || [];
  if (!unsetRules.length) throw new Error("nenhuma regra de encoding para data-p50-ans=\"unset\"");
  const joined = unsetRules.join(" ");
  if (!/var\(--dom-accent\)/.test(joined))
    throw new Error("UNSET não usa a cor do próprio domínio: " + joined.slice(0, 160));

  /* (2) esmaecida — e nunca cinza genérico, nunca acento de marca */
  if (!/opacity\s*:|--p50-unset-fade/.test(joined))
    throw new Error("UNSET não é esmaecido (sem opacidade declarada)");
  if (/var\(--ftnt-red\)|--ftnt-(grey|medium-grey|dark-grey|silver)\b/.test(joined))
    throw new Error("UNSET usa cinza genérico ou acento de marca");

  /* (3) tracejado+verde é encoding EXCLUSIVO do alvo: proibido em UNSET */
  if (/var\(--ftnt-green\)/.test(joined))
    throw new Error("UNSET usa o encoding exclusivo do cenário-alvo");

  /* (4) pista NÃO cromática presente na regra de UNSET */
  if (!/(border[^;]*dashed|repeating-linear-gradient|content\s*:)/.test(joined))
    throw new Error("UNSET sem pista não cromática (tracejado/hachura/glifo)");

  /* (5) no DOM real: a célula UNSET carrega pista textual e não fabrica valor */
  const { w, d } = boot();
  FX.p50ApplyResults(w, d, FX.P50_F6);
  const cell = q(d, "#p50-results [data-p50=\"hm-cell\"][data-qid=\"mandate\"]");
  if (!cell) throw new Error("célula UNSET ausente");
  if (cell.getAttribute("data-p50-ans") !== "unset") throw new Error("célula não marcada como unset");
  if (!cell.hasAttribute("data-p50-cue")) throw new Error("célula UNSET sem pista não cromática");
  if (cell.getAttribute("data-dom") === null) throw new Error("célula UNSET sem identidade de domínio");
  if (txt(cell.querySelector("[data-p50=\"hm-state\"]")) !== "n/d")
    throw new Error("célula UNSET sem o rótulo textual n/d");
  return true;
});

T("P50-IC3", "fonte única de ícones: nenhum mapa/asset paralelo nos módulos novos", () => {
  const srcs = P50_NEW_MODULES.map(p => ({ p, s: readIf(p) })).filter(o => o.s !== null);
  srcs.forEach(({ p, s }) => {
    if (/data:image\/svg\+xml/i.test(s)) throw new Error(path.basename(p) + " embute asset SVG");
    if (/ICON_MAP_V32/.test(s)) throw new Error(path.basename(p) + " duplica ICON_MAP_V32");
    if (/ICONS_V32\s*\[/.test(s)) throw new Error(path.basename(p) + " acessa ICONS_V32 diretamente");
  });
  return true;
});

/* ==========================================================================
   MICROFASE 5.0.5 · fechamento de identidade visual e de ícones
   ========================================================================== */

/* Autoridade congelada sobre as superfícies protegidas. Estes hashes fixam os
   arquivos que a §29.4 declara protegidos e que governam a cor (V4+V5 vivem em
   tests_visual/screen.spec.js) — pinar aqui é o guard estrutural de que a
   Phase 5.0 não moveu a autoridade, e não uma reimplementação dela. */
const FROZEN_VISUAL_AUTHORITY = {
  "tests_visual/screen.spec.js": "6127d1de876d5dbc54b6fe70899d62aa48b576d2e8af6378381e4bcdb5cb1195",
  "tests_visual/print.spec.js": "9fe2e998e6151b9fa447c334456605fa68d9c4b1b2469a2d6d5650d58f75565d",
  "tests_visual/session.spec.js": "99956abdd43b0c946d2d9035c75fdeaae7a8bcba9e9d4051f31bb9647b0df499",
  "tests_visual/fixtures.js": "1b3cead911563bcb53192a6b6312851d297ab10a1109ff876d8bf1bfc2c07a86",
  "playwright.config.js": "9661deed970d595c62bc924708e1eb0b6d09c1c7db60176972819f1ea15b5dcf",
  "tests_icons_m46.js": "f73f96e32951507135c0b36d968fe12e9ffbc268e8ad438ea2e6c861a8b88123"
};

T("P50-COR4", "regressão de autoridade: V4+V5 e superfícies congeladas de cor intactas", () => {
  /* (a) os arquivos que HOSPEDAM a autoridade continuam byte-idênticos */
  Object.keys(FROZEN_VISUAL_AUTHORITY).forEach(rel => {
    const abs = path.join(HERE, rel);
    if (!fs.existsSync(abs)) throw new Error(rel + " ausente");
    const got = sha(abs);
    if (got !== FROZEN_VISUAL_AUTHORITY[rel])
      throw new Error(rel + " alterado (" + got.slice(0, 12) + "… != " + FROZEN_VISUAL_AUTHORITY[rel].slice(0, 12) + "…)");
  });
  /* (b) o teste V4+V5 continua existindo, nominalmente, com a asserção de token */
  const screen = readIf(path.join(HERE, "tests_visual", "screen.spec.js")) || "";
  if (!/test\('V4\+V5 progress semantics'/.test(screen))
    throw new Error("o teste V4+V5 desapareceu de tests_visual/screen.spec.js");
  ["--ftnt-purple", "--ftnt-green", "--ftnt-teal", "--ftnt-blue", "--ftnt-silver"].forEach(t => {
    if (screen.indexOf(t) < 0) throw new Error("V4+V5 deixou de asserir o token congelado " + t);
  });
  /* (c) a fonte única dos tokens permanece a congelada, com os mesmos valores */
  const uxcss = readIf(path.join(HERE, "ui_ux_v32.css")) || "";
  const pairs = { "--ftnt-purple": "#9063CD", "--ftnt-green": "#3CB17E", "--ftnt-teal": "#2CCCD3",
                  "--ftnt-blue": "#307FE2", "--ftnt-silver": "#A2B2C8" };
  Object.keys(pairs).forEach(tok => {
    const re = new RegExp(tok.replace(/-/g, "\\-") + "\\s*:\\s*" + pairs[tok], "i");
    if (!re.test(uxcss)) throw new Error("token congelado " + tok + " não resolve mais para " + pairs[tok]);
  });
  /* (d) nenhuma paleta nova: os módulos da Camada 5 não declaram custom
     property de cor própria — só CONSOMEM as congeladas (COR-01.1) */
  P50_NEW_MODULES.forEach(f => {
    const src = readIf(f); if (src === null) return;
    const decls = (src.match(/--[a-z0-9-]*(color|hex|palette|ftnt)[a-z0-9-]*\s*:/gi) || []);
    if (decls.length) throw new Error(path.basename(f) + " declara custom property de cor: " + decls.join(","));
  });
  /* (e) o HTML construído continua servindo os cinco tokens uma única vez */
  Object.keys(pairs).forEach(tok => {
    const n = (HTML.match(new RegExp(tok.replace(/-/g, "\\-") + "\\s*:", "g")) || []).length;
    if (n !== 1) throw new Error("token " + tok + " declarado " + n + " vez(es) no HTML (esperado 1)");
  });
  return true;
});

T("P50-IC4", "regressão de ícones: ICONS 4.6 integral e superfícies congeladas intactas", () => {
  /* (a) o resolvedor congelado e o gerador de assets continuam byte-idênticos
     (já fixados em PROTECTED; reafirmados aqui pelo escopo do gate) */
  ["ui_icons_v32.js", "generate_icons_v32.py", "ui_v32.js"].forEach(f => {
    if (sha(path.join(HERE, f)) !== PROTECTED[f]) throw new Error(f + " alterado");
  });
  /* (b) a ponte continua expondo iconFor — fonte única da Camada 5 */
  if (!/window\.__V32UI\s*=\s*\{[^}]*\biconFor\b/.test(HTML))
    throw new Error("window.__V32UI deixou de expor iconFor");
  /* (c) a suíte ICONS 4.6 é REEXECUTADA e precisa fechar 12/12.
     Oráculo independente: a contagem sai do stdout da própria suíte congelada,
     não de um relatório anterior. SKIP/timeout/exit != 0 reprovam. */
  const cp = require("child_process");
  const r = cp.spawnSync(process.execPath, ["tests_icons_m46.js"],
    { cwd: HERE, encoding: "utf8", timeout: 10 * 60 * 1000, maxBuffer: 32 * 1024 * 1024 });
  if (r.error) throw new Error("ICONS 4.6 não executou: " + String(r.error.message).split("\n")[0]);
  if (r.status !== 0) throw new Error("ICONS 4.6 exit " + r.status);
  const m = String(r.stdout || "").match(/ICONS 4\.6:\s*(\d+) PASS · (\d+) FAIL de (\d+)/);
  if (!m) throw new Error("ICONS 4.6 sem linha de contagem no stdout");
  if (+m[1] !== 12 || +m[2] !== 0 || +m[3] !== 12)
    throw new Error("ICONS 4.6 regrediu: " + m[1] + " PASS / " + m[2] + " FAIL de " + m[3]);
  return true;
});

/* ==========================================================================
   Verificações de ACEITE das ressalvas R2 e R4 da auditoria independente da
   5.0.4. NÃO são gates do namespace P50 — as ressalvas eram editoriais, não
   requisitos normativos novos — e por isso levam identificador próprio, como
   já fizeram as verificações ACEITE-UX das microfases anteriores.
   ========================================================================== */
T("ACEITE-R2-5.0.5", "contagem e limiar de suficiência são grandezas declaradas separadamente", () => {
  const R = boot();
  FX.p50ApplyVec(R.w, FX.P50_F5.vec);                   /* 15 confirmadas: gate ABERTO */
  R.w.__DEV.showResults();
  const d = R.d;
  const g = q(d, "#p50-suff [data-p50=\"suff-global\"]");
  if (!g) throw new Error("linha global ausente");
  const gt = txt(g);
  if (/\b15 de 10\b/.test(gt)) throw new Error("forma 'N de M' com N > M persiste na linha global: '" + gt + "'");
  if (!/15 respostas confirmadas/.test(gt)) throw new Error("contagem real ausente: '" + gt + "'");
  if (!/mínimo requerido: 10/.test(gt)) throw new Error("limiar não declarado como mínimo: '" + gt + "'");
  const drills = qa(d, "#p50-results [data-p50=\"drill-state\"]").map(txt);
  if (drills.length !== 5) throw new Error(drills.length + " linhas de drill-down (esperado 5)");
  drills.forEach(t => {
    if (/\b3 de 2\b/.test(t)) throw new Error("forma '3 de 2' persiste no drill-down: '" + t + "'");
    if (!/respostas confirmadas · mínimo requerido: 2/.test(t))
      throw new Error("redação do drill-down não separa contagem de limiar: '" + t + "'");
  });
  /* a forma "(N de M)" continua CORRETA e presente onde N < M (déficit) */
  const P = boot();
  FX.p50ApplyVec(P.w, FX.P50_F2.vec);                   /* gate FECHADO, com déficits */
  P.w.__DEV.showResults();
  const defs = qa(P.d, "#p50-suff [data-p50=\"suff-deficit\"]").map(txt);
  if (!defs.length) throw new Error("nenhuma pendência exibida sob gate fechado");
  if (!defs.some(t => /\(\d+ de \d+\)/.test(t)))
    throw new Error("a forma '(N de M)' do déficit foi removida indevidamente");
  return true;
});

T("ACEITE-R4-5.0.5", "nome acessível de presence sem redundância, com UNSET × NONE preservados", () => {
  const R = boot();
  FX.p50ApplyVec(R.w, FX.P50_F7.vec);
  const L = R.w.__DEV.V32.TECH_LANDSCAPE;
  L["knowledge-management"].presence = "UNSET"; L["knowledge-management"].declaredDriver = null;
  L["security-analytics"].presence = "NONE";
  R.w.__DEV.showResults();
  const chip = st => q(R.d, "#p50-results [data-p50=\"presence-chip\"][data-p50-presence=\"" + st + "\"]");
  const unset = chip("UNSET"), none = chip("NONE");
  if (!unset || !none) throw new Error("chips UNSET/NONE ausentes");
  const aU = unset.getAttribute("aria-label") || "", aN = none.getAttribute("aria-label") || "";
  const visU = txt(unset.querySelector("[data-p50=\"presence-state\"]"));
  /* (a) o rótulo visível não é repetido dentro do nome acessível */
  const occurrences = aU.toLowerCase().split(visU.toLowerCase()).length - 1;
  if (occurrences !== 1) throw new Error("rótulo '" + visU + "' aparece " + occurrences + "x no nome acessível: '" + aU + "'");
  /* (b) a distinção normativa UI-016(b) permanece inteira */
  if (aU === aN) throw new Error("nome acessível idêntico entre UNSET e NONE");
  if (!/nunca ausência/.test(aU)) throw new Error("UNSET perdeu a declaração 'nunca ausência': '" + aU + "'");
  if (!/ausência confirmada/.test(aN)) throw new Error("NONE perdeu 'ausência confirmada': '" + aN + "'");
  if (unset.getAttribute("data-p50-confirmed") !== "false") throw new Error("UNSET marcado como confirmado");
  if (none.getAttribute("data-p50-confirmed") !== "true") throw new Error("NONE não marcado como estado declarado");
  return true;
});

T("ACEITE-UI048-5.0.5", "orientação sobre dado sensível junto ao campo de evidência", () => {
  const R = boot();
  FX.p50ApplyFixture(R.w, R.d, FX.P50_F2);              /* navegação pelos controles congelados */
  const g = q(R.d, "#app [data-p50=\"evidence-guidance\"]");
  if (!g) throw new Error("orientação ausente na tela de pergunta");
  if (txt(g) !== "Evite registrar segredos, credenciais ou dados pessoais desnecessários.")
    throw new Error("texto divergente: '" + txt(g) + "'");
  /* tom informativo, não alarmista: sem role de alerta e sem aria-live */
  if (g.getAttribute("role") || g.getAttribute("aria-live"))
    throw new Error("orientação usa semântica de alerta");
  /* ligada ao textarea congelado por atributo ADITIVO */
  const tgl = q(R.d, "#notetgl");
  if (!tgl) throw new Error("controle congelado de nota ausente");
  tgl.click();
  const ta = q(R.d, "#notetxt");
  if (!ta) throw new Error("textarea congelado não abriu");
  if (ta.getAttribute("aria-describedby") !== g.id && ta.getAttribute("aria-describedby") !== "p50-ev-guide")
    throw new Error("textarea não referencia a orientação: '" + ta.getAttribute("aria-describedby") + "'");
  /* a orientação não vira claim de persistência nem de segurança */
  if (/salv|autom|segur[oa]|protegid|criptograf/i.test(txt(g)))
    throw new Error("orientação faz claim indevido: '" + txt(g) + "'");
  return true;
});

/* ============================== RESUMO ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nP50 CORE (microfases 5.0.1+5.0.2+5.0.3+5.0.4+5.0.5)" + (ONLY.length ? " [FILTRADO]" : "") + ": " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
