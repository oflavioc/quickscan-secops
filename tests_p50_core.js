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
console.log("\nP50 CORE (microfases 5.0.1+5.0.2): " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
