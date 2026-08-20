/* ============================================================================
   TESTES P50 · CORE (jsdom) — PHASE 5.0 · microfase 5.0.1
   Namespace exclusivo P50-<ÁREA><N> (spec §25.1). Nenhum ID fora da tabela
   normativa de reserva; nenhuma continuação de S114+/RCE5+/CDx/FRx/UG*.

   Gates desta microfase:
     governança   P50-GOV1 · P50-GOV2 · P50-GOV3
     experiência  P50-UX1 · P50-UX2 · P50-UX6 · P50-UX9 · P50-UX10 · P50-UX13
     suficiência  P50-SUF0 · P50-SUF2
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
const P50_NEW_MODULES = [SHELL_JS, SHELL_CSS];

const results = [];
function T(id, label, fn) {
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
  "tests_unset_ug.js": "d2a3f804bb14e9156978407710a7a680f8dc4b71929546c28a719fbde1bae2e9",
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
  /* Oráculos proibidos por P50-UX9 não podem ser usados por este arquivo.
     Os nomes são montados por concatenação para que o literal proibido NUNCA
     apareça contíguo no source e o lint não se auto-detecte. */
  const self = fs.readFileSync(__filename, "utf8");
  const forbidden = ["full" + "StateJSON", "build" + "SessionDocument"];
  forbidden.forEach(name => {
    if (new RegExp(name + "\\s*\\(").test(self))
      throw new Error("oráculo proibido por P50-UX9 usado no teste: " + name + "()");
  });
  /* o oráculo obrigatório é captureCanonicalInputs() */
  if (!/captureCanonicalInputs\s*\(/.test(self))
    throw new Error("oráculo obrigatório captureCanonicalInputs() ausente");
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
  return true;
});

/* ======================= 25.4 · SUFICIÊNCIA ======================= */

T("P50-SUF0", "o renderer novo não é dono de lógica de suficiência (lint prospectivo)", () => {
  const srcs = P50_NEW_MODULES.map(p => ({ p, s: readIf(p) })).filter(o => o.s !== null);
  if (!srcs.length) throw new Error("nenhum módulo novo presente para lintar");
  srcs.forEach(({ p, s }) => {
    const code = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
    if (/dataSufficiency/.test(code)) throw new Error(path.basename(p) + " referencia dataSufficiency");
    if (/\bsufficien/i.test(code)) throw new Error(path.basename(p) + " deriva suficiência");
    /* nenhuma comparação de contagem que reimplemente o gate canônico */
    const reGlobal = /(confirmed[A-Za-z]*|count[A-Za-z]*|total[A-Za-z]*)\s*(>=|>|<|<=)\s*10\b/i;
    const reDomain = /(\.n|confirmed[A-Za-z]*|count[A-Za-z]*)\s*(>=|>|<|<=)\s*2\b/i;
    if (reGlobal.test(code)) throw new Error(path.basename(p) + " contém comparação com o limiar global 10");
    if (reDomain.test(code)) throw new Error(path.basename(p) + " contém comparação com o limiar de domínio 2");
    if (/confirmedCount\s*\(\s*\)\s*(>=|>|<|<=)/.test(code))
      throw new Error(path.basename(p) + " compara confirmedCount() diretamente");
  });
  /* e a superfície nova não emite veredito executivo em nenhuma fixture */
  Object.values(FX.P50_FIXTURES).forEach(fx => {
    const { w, d } = boot();
    FX.p50ApplyFixture(w, d, fx);
    const t = txt(q(d, "#p50-shell"));
    if (/\b(overall|maturidade geral|estágio|stage)\b/i.test(t))
      throw new Error("veredito executivo exibido pelo shell em " + fx.id);
    if (/(suficiên|insuficiên)/i.test(t))
      throw new Error("shell emite juízo de suficiência em " + fx.id);
  });
  return true;
});

T("P50-SUF2", "domínio sem resposta confirmada exibe n/d + 'Não avaliado', nunca 0.0", () => {
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
    /* a string "0.0"/"0,0" jamais aparece como score de domínio */
    const sidebar = txt(q(d, "#p50-shell [data-p50=\"sidebar\"]"));
    if (/\b0[.,]0\b/.test(sidebar.replace(/Confirmad[oa][^·]*·\s*0[.,]0/g, "")))
      throw new Error(fx.id + ": 0.0 renderizado na sidebar fora de resposta confirmada");
  });
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
    /* 5.0.1 não cria componente de status de sessão nem dirty flag */
    if (q(d, "#p50-shell [data-p50=\"session-status\"]"))
      throw new Error("componente de status de sessão criado fora de escopo (5.0.2)");
  });
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

/* ============================== RESUMO ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nP50 CORE (microfase 5.0.1): " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
