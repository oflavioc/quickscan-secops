/* ============================================================================
   TESTES D011 · NUMERAÇÃO DAS PRIORIDADES (jsdom) — demanda 011
   Namespace exclusivo D011-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem dependência de Chromium: nenhum gate
   desta suíte mede geometria — o contraste (C10) vive em tests_011_chromium.js.

   ==========================================================================
   O QUE ESTA SUÍTE MEDE — E O QUE ELA DELIBERADAMENTE NÃO MEDE
   ==========================================================================
   O critério da demanda NÃO é "o `·` sumiu". É "o glifo não lê como índice",
   e isso não é uma asserção: é uma percepção. A spec o decompôs em quatro
   asserções (C1..C4) e esta suíte mede a CONJUNÇÃO. A percepção residual, o
   nome acessível computado (accname), o alinhamento real da caixa vazia, o
   efeito da regra de print no PDF e a leitura por leitor de tela estão
   declarados NÃO MENSURÁVEIS na spec — e continuam declarados aqui, nunca
   disfarçados de asserção.

   ==========================================================================
   ORÁCULOS — POR QUE CADA UM É INDEPENDENTE DA IMPLEMENTAÇÃO
   ==========================================================================
   · A ORDEM dos findings é RECALCULADA do vetor da fixture (severidade desc →
     nível asc → índice da pergunta asc), NUNCA chamando `computeFindings()`.
     Oráculo que chama a implementação concorda com ela por construção.
   · A recomputação é conferida em DOIS SALTOS contra `D011_ORDEM_MISTA`, uma
     lista LITERAL declarada abaixo. Sem esse segundo salto, editar o vetor da
     fixture moveria oráculo e produto juntos e o julgador concordaria com a
     fixture — o modo de falha que a demanda 010 pagou em `D010-F3`.
   · A severidade por nível e o rótulo de cada pergunta vêm de `QS`/`MAP`, que
     são `const` de topo de script da Camada 1 (classe `frozen`): NÃO existem
     em `window` e só `window.eval` os alcança. O acesso está isolado em
     `lerTabelaFrozen()`, com falha ALTA se o `typeof` não for `object`
     (R10 §2: SKIP silencioso é FAIL).
   · A legenda é localizada pelo TEXTO CANÔNICO, não pela classe, para que o
     gate meça o critério (C4 fala de texto) e não a nomenclatura do plano.
   · A regra de print é medida por EFEITO — `Element.matches` sobre os nós
     REAIS — e não por menção textual de seletor. Um mutante que trocasse
     `.d011-key[data-d011="atalho"]` por `.d011-key` não menciona `.sel` em
     lugar nenhum e passaria por um oráculo textual; por `matches`, ele acerta
     o `.key` do item selecionado e morre.

   ==========================================================================
   A FIXTURE É MISTA POR MEDIÇÃO, NÃO POR GOSTO — NÃO UNIFORMIZE
   ==========================================================================
   Medido em 2026-08-31 nesta worktree: com `answerAll(w, 1)` (todas as 15
   respostas no mesmo nível) a ordem do DOM depois do reagrupamento por domínio
   é IDÊNTICA à ordem global — porque `QS` já está ordenada por domínio. Nesse
   cenário o mutante `D011-M2` ("renumerar o glifo pela posição visual
   pós-agrupamento") é EQUIVALENTE ao código correto e NÃO PODE MORRER.
   `FX_MISTA` responde três perguntas de domínios diferentes no nível 0
   (severidade 2) e as demais no nível 1 (severidade 1); a ordem global passa a
   interleavar domínios e o DOM deixa de coincidir com ela. `D011-KEY1` alínea
   (b) ASSERE essa divergência: se um dia as duas ordens voltarem a coincidir,
   o gate REPROVA em vez de passar sem medir nada.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");

/* ====================== TABELAS DECLARADAS (nunca derivadas) ====================== */

/* Nível de resposta aplicado às perguntas que a fixture não nomeia. */
const NIVEL_PADRAO = 1;

/* Fixture MISTA — 15 findings, ordem global ≠ ordem do DOM (ver cabeçalho). */
const FX_MISTA = { "training": 0, "logs": 0, "vulnerability-management": 0 };

/* Ordem global canônica de FX_MISTA, DERIVÁVEL À MÃO da regra declarada na
   spec (severidade desc → nível asc → índice da pergunta asc): as três
   respostas de nível 0 (sev 2) primeiro, em ordem de `k`; depois as doze de
   nível 1 (sev 1), em ordem de `k`. É o ponto fixo do julgador. */
const D011_ORDEM_MISTA = [
  "training", "logs", "vulnerability-management",
  "mandate", "governance", "policies", "team-capacity", "knowledge",
  "incident-response", "detection-lifecycle", "automation",
  "endpoint", "network-visibility", "monitoring-coverage", "external-surface"
];

/* Fixture sem finding: nível 2 em todas → `m.s === 0` → zero findings.
   É o caso negativo de C4 ("a legenda existe se e somente se há botão"). */
const NIVEL_SEM_FINDING = 2;

/* Texto canônico da legenda — igualdade LITERAL, sem normalização (C4). */
const TEXTO_LEGENDA = "Os números são atalhos de teclado — não a ordem de prioridade.";

/* Limite de atalhos declarado pela Camada 1 (`:1058`) e pela spec. */
const LIMITE_ATALHOS = 9;

/* Quantidade de perguntas do catálogo congelado. */
const TOTAL_PERGUNTAS = 15;

/* Marcadores do bloco CSS do módulo no HTML construído (contrato do builder). */
const CSS_INI = "/* V32_D011CSS_BEGIN */";
const CSS_FIM = "/* V32_D011CSS_END */";

/* ============================== infraestrutura ============================== */

const results = [];
const casos = [];
const ONLY = (process.env.D011_ONLY || "").split(",").map(s => s.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));

function T(id, label, fn) { casos.push({ id: id, label: label, fn: fn }); }

const tick = () => Promise.resolve();   /* medido na Fase 2: 0 entregas síncronas, 1 após um tick */

function boot() {
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  return { w: dom.window, d: dom.window.document };
}

/* Estado congelado (`QS`, `MAP`) é `const` de topo de script: não está em
   `window`. Único ponto de acesso, e ele FALHA ALTO se o estado sumir. */
function lerTabelaFrozen(w) {
  const tq = w.eval("typeof QS"), tm = w.eval("typeof MAP");
  if (tq !== "object" || tm !== "object")
    throw new Error("estado congelado indisponível: typeof QS=" + tq + ", typeof MAP=" + tm);
  const t = JSON.parse(w.eval(
    "JSON.stringify(QS.map(function(q,k){return {k:k,id:q.id,lbl:q.lbl,sev:[0,1,2,3]" +
    ".map(function(l){var m=MAP[q.id].lv[l];return (m&&m.s)||0;})};}))"));
  if (!Array.isArray(t) || t.length !== TOTAL_PERGUNTAS)
    throw new Error("catálogo congelado com " + (t && t.length) + " perguntas (declarado " + TOTAL_PERGUNTAS + ")");
  return t;
}

/* ORÁCULO DE ORDEM — reimplementa a regra da spec sobre o vetor da fixture.
   NÃO chama `computeFindings()`. */
function ordemDoVetor(tabela, vetor, padrao) {
  const achados = [];
  tabela.forEach(function (q) {
    const a = Object.prototype.hasOwnProperty.call(vetor, q.id) ? vetor[q.id] : padrao;
    if (a === "NA" || a === null || a === undefined) return;
    const s = q.sev[a] || 0;
    if (s > 0) achados.push({ k: q.k, id: q.id, sev: s, lvl: a });
  });
  achados.sort(function (x, y) { return (y.sev - x.sev) || (x.lvl - y.lvl) || (x.k - y.k); });
  return achados.map(function (f) { return f.id; });
}

/* ORÁCULO DE APRESENTAÇÃO — a tabela de decisão do glifo, tal como a spec a
   escreve ("Comportamento especificado"). Uma função, três consumidores. */
function esperadoGlifo(i, selecionado) {
  if (selecionado) return "✓";                 /* ✓ — estado, inalterado pela demanda */
  return i < LIMITE_ATALHOS ? String(i + 1) : "";   /* mudo a partir do décimo */
}
function esperadoAtalho(i) {
  return i < LIMITE_ATALHOS ? String(i + 1) : null; /* null = atributo AUSENTE */
}

async function telaPrioridade(vetor, padrao) {
  const c = boot();
  const tabela = lerTabelaFrozen(c.w);
  const nivel = (padrao === undefined) ? NIVEL_PADRAO : padrao;
  const alvo = vetor || {};
  Object.keys(alvo).forEach(function (id) {
    if (!tabela.some(function (q) { return q.id === id; }))
      throw new Error("fixture nomeia pergunta inexistente no catálogo congelado: '" + id + "'");
  });
  tabela.forEach(function (q) {
    c.w.__DEV.setAnswerById(q.id, Object.prototype.hasOwnProperty.call(alvo, q.id) ? alvo[q.id] : nivel);
  });
  c.w.__DEV.setArq(0);
  c.w.__DEV.showPriority();
  await tick();
  c.tabela = tabela;
  c.ordem = ordemDoVetor(tabela, alvo, nivel);
  return c;
}

const botoes = d => Array.from(d.querySelectorAll(".opt"));
const idsNoDom = d => botoes(d).map(b => b.dataset.id);
const selecionados = d => Array.from(d.querySelectorAll(".opt.sel")).map(b => b.dataset.id);
function botaoDe(d, id) {
  const b = d.querySelector('.opt[data-id="' + id + '"]');
  if (!b) throw new Error("botão ausente para o finding '" + id + "'");
  return b;
}
function keyDe(b) {
  const k = b.querySelector(".key");
  if (!k) throw new Error("elemento .key ausente no botão '" + b.dataset.id + "' — o alinhamento exige que ele permaneça no DOM");
  return k;
}
function glifo(b) { return keyDe(b).textContent.trim(); }
function tecla(w, d, k) { d.dispatchEvent(new w.KeyboardEvent("keydown", { key: k, bubbles: true })); }

/* Texto próprio (só nós de texto diretos) — usado para achar a legenda. */
function textoProprio(el) {
  let s = "";
  Array.prototype.forEach.call(el.childNodes, function (n) { if (n.nodeType === 3) s += n.nodeValue; });
  return s.trim();
}
function legendas(d) {
  const app = d.getElementById("app");
  if (!app) throw new Error("#app ausente");
  return Array.prototype.filter.call(app.querySelectorAll("*"), function (el) {
    return textoProprio(el) === TEXTO_LEGENDA;
  });
}

/* ============================================================================
   MAPA DE APRESENTAÇÃO DA 5.2 — sem ele o oráculo de texto mente
   `p52Copy()` reescreve os nós de TEXTO da tela: `QS[0].lbl` é "Mandato e
   objetivos" e chega ao leitor como "Direcionamento e objetivos". Medido nesta
   base em 2026-08-31 pela bateria negativa desta demanda, que reprovou o
   CONTROLE (estado verde simulado) por este motivo — o gate teria nascido
   CONSTANTE VERMELHO por causa alheia à demanda, e a wave 3 pagaria a conta
   caçando um fantasma. O oráculo aplica a MESMA transformação declarada,
   lendo o mapa PÚBLICO `__P52.copyMap()` e reimplementando a substituição aqui
   (precedente de `tests_009_leitura.js:150-175`). Bridge indisponível é FALHA
   ALTA: oráculo de texto cego é pior que gate ausente.
   ========================================================================== */
function copyOf(w) {
  const map = (w.__P52 && typeof w.__P52.copyMap === "function") ? w.__P52.copyMap() : null;
  if (!map || !map.length)
    throw new Error("mapa de apresentação __P52.copyMap() indisponível — o oráculo de rótulo ficaria cego");
  return function (v) {
    let o = String(v == null ? "" : v);
    for (let i = 0; i < map.length; i++) o = o.split(map[i][0]).join(map[i][1]);
    return o;
  };
}

/* Aproximação canônica do nome acessível: texto ignorando subárvores
   aria-hidden. jsdom não calcula accname — a limitação está DECLARADA na spec
   e o accname real é conferido no job visual (axe/Chromium). */
function textoSemAriaHidden(el) {
  let s = "";
  Array.prototype.forEach.call(el.childNodes, function (n) {
    if (n.nodeType === 3) { s += n.nodeValue; return; }
    if (n.nodeType !== 1) return;
    if (n.getAttribute("aria-hidden") === "true") return;
    s += textoSemAriaHidden(n);
  });
  return s;
}

/* Retrato do estado apresentado, indexado pela ORDEM GLOBAL do oráculo. */
function retrato(c) {
  const sel = selecionados(c.d);
  return {
    ids: idsNoDom(c.d).slice().sort(),
    glifos: c.ordem.map(function (id) { return glifo(botaoDe(c.d, id)); }),
    atalhos: c.ordem.map(function (id) {
      const b = botaoDe(c.d, id);
      return b.hasAttribute("aria-keyshortcuts") ? b.getAttribute("aria-keyshortcuts") : null;
    }),
    ariaHidden: c.ordem.filter(function (id) {
      return keyDe(botaoDe(c.d, id)).getAttribute("aria-hidden") === "true";
    }).length,
    legendas: legendas(c.d).length,
    selecionados: sel.slice().sort()
  };
}
function retratoEsperado(c, sel) {
  const S = new Set(sel);
  return {
    ids: c.ordem.slice().sort(),
    glifos: c.ordem.map(function (id, i) { return esperadoGlifo(i, S.has(id)); }),
    atalhos: c.ordem.map(function (id, i) { return esperadoAtalho(i); }),
    ariaHidden: c.ordem.length,
    legendas: c.ordem.length ? 1 : 0,
    selecionados: sel.slice().sort()
  };
}
function difere(a, b) { return JSON.stringify(a) !== JSON.stringify(b); }

/* ---- extração da regra de print do módulo, a partir do HTML CONSTRUÍDO ---- */
function blocoCssDoModulo() {
  const nIni = HTML.split(CSS_INI).length - 1, nFim = HTML.split(CSS_FIM).length - 1;
  if (nIni !== 1 || nFim !== 1)
    throw new Error("bloco CSS do módulo ausente ou duplicado no HTML construído: "
      + nIni + "× " + CSS_INI + " e " + nFim + "× " + CSS_FIM);
  return HTML.slice(HTML.indexOf(CSS_INI) + CSS_INI.length, HTML.indexOf(CSS_FIM));
}
function blocosMediaPrint(css) {
  const out = [];
  const re = /@media[^{]*\bprint\b[^{]*\{/g;
  let m;
  while ((m = re.exec(css))) {
    let i = m.index + m[0].length, prof = 1;
    while (i < css.length && prof > 0) {
      if (css[i] === "{") prof++;
      else if (css[i] === "}") prof--;
      if (prof > 0) i++;
    }
    if (prof !== 0) throw new Error("bloco @media print não fechado no CSS do módulo");
    out.push(css.slice(m.index + m[0].length, i));
    re.lastIndex = i;
  }
  return out;
}
function regras(css) {
  const out = [];
  const semComentario = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(semComentario))) {
    const sels = m[1].split(",").map(s => s.trim()).filter(Boolean);
    const decls = m[2].split(";").map(s => s.trim().toLowerCase().replace(/\s+/g, "")).filter(Boolean);
    if (sels.length) out.push({ seletores: sels, decls: decls });
  }
  return out;
}
function escondeu(decls) {
  return decls.some(function (dd) {
    const v = dd.replace(/!important$/, "");
    return v === "display:none" || v === "visibility:hidden";
  });
}

/* ================================== GATES ================================== */

T("D011-KEY1",
  "C1 · todo glifo numérico exibido é um atalho que funciona: o botão que exibe N é exatamente o que a tecla N alterna (oráculo recalculado do vetor, sem computeFindings)",
  async function () {
    const c = await telaPrioridade(FX_MISTA);

    /* (a) dois saltos: recomputação × tabela declarada */
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-KEY1(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));

    /* (b) NÃO-VACUIDADE: sem divergência DOM × global, D011-M2 é equivalente */
    const dom = idsNoDom(c.d);
    if (dom.length !== D011_ORDEM_MISTA.length)
      throw new Error("D011-KEY1(b): a grade tem " + dom.length + " botões e a ordem canônica tem " + D011_ORDEM_MISTA.length);
    if (!difere(dom, c.ordem))
      throw new Error("D011-KEY1(b): cenário SEM PODER DISCRIMINANTE — a ordem do DOM é idêntica à ordem global, e nesse estado renumerar pela posição visual é indistinguível do correto. Restaure uma fixture mista.");

    /* (c) glifo → id */
    for (let n = 1; n <= LIMITE_ATALHOS; n++) {
      const comN = botoes(c.d).filter(function (b) { return glifo(b) === String(n); });
      if (comN.length !== 1)
        throw new Error("D011-KEY1(c): " + comN.length + " botões exibem o glifo " + n + " (esperado exatamente 1)");
      if (comN[0].dataset.id !== c.ordem[n - 1])
        throw new Error("D011-KEY1(c): o glifo " + n + " está em '" + comN[0].dataset.id + "'; a ordem canônica prevê '" + c.ordem[n - 1] + "'");
    }

    /* (d) tecla → id, com toggle-off (respeita o limite de 3: nunca há 2 juntos) */
    for (let n = 1; n <= LIMITE_ATALHOS; n++) {
      tecla(c.w, c.d, String(n)); await tick();
      let sel = selecionados(c.d);
      if (sel.length !== 1 || sel[0] !== c.ordem[n - 1])
        throw new Error("D011-KEY1(d): keydown " + n + " deixou selecionado " + JSON.stringify(sel) + " (esperado ['" + c.ordem[n - 1] + "'])");
      tecla(c.w, c.d, String(n)); await tick();
      sel = selecionados(c.d);
      if (sel.length !== 0)
        throw new Error("D011-KEY1(d): keydown " + n + " repetido não desmarcou — restou " + JSON.stringify(sel));
    }
    return true;
  });

T("D011-KEY2",
  "C2 · item sem atalho não exibe glifo: .key permanece no DOM em 15/15 e fica textualmente VAZIO nos índices ≥ 9; 1..9 intactos nos índices 0..8",
  async function () {
    const c = await telaPrioridade(FX_MISTA);
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-KEY2(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));

    /* NÃO-VACUIDADE: sem índice ≥ 9 a alínea dos mudos não teria caso */
    if (c.ordem.length <= LIMITE_ATALHOS)
      throw new Error("D011-KEY2(nv): a fixture produz " + c.ordem.length + " findings e nenhum índice ≥ " + LIMITE_ATALHOS + " — a alínea dos mudos seria vazia");
    if (selecionados(c.d).length !== 0)
      throw new Error("D011-KEY2(nv): o cenário tem seleção (" + JSON.stringify(selecionados(c.d)) + ") e o item selecionado exibe ✓ por desenho — mediria a tabela ao contrário");

    /* (b) .key presente em todos */
    const faltando = c.ordem.filter(function (id) { return !botaoDe(c.d, id).querySelector(".key"); });
    if (faltando.length)
      throw new Error("D011-KEY2(b): " + faltando.length + " botões sem .key no DOM: " + JSON.stringify(faltando.slice(0, 4)));

    /* (c) mudos vazios */
    const sujos = [];
    c.ordem.forEach(function (id, i) {
      if (i < LIMITE_ATALHOS) return;
      const t = glifo(botaoDe(c.d, id));
      if (t !== "") sujos.push(id + "=" + JSON.stringify(t));
    });
    if (sujos.length)
      throw new Error("D011-KEY2(c): " + sujos.length + " item(ns) sem atalho ainda exibem glifo: " + sujos.join(" "));

    /* (d) 1..9 intactos */
    const trocados = [];
    c.ordem.forEach(function (id, i) {
      if (i >= LIMITE_ATALHOS) return;
      const t = glifo(botaoDe(c.d, id));
      if (t !== String(i + 1)) trocados.push(id + "=" + JSON.stringify(t) + " (esperado " + (i + 1) + ")");
    });
    if (trocados.length)
      throw new Error("D011-KEY2(d): glifo alterado onde há atalho: " + trocados.join(" "));
    return true;
  });

T("D011-ACC1",
  "C3 · o glifo sai do nome acessível (aria-hidden) e o atalho é declarado (aria-keyshortcuts), inclusive sob ✓; índice ≥ 9 não declara atalho",
  async function () {
    const c = await telaPrioridade(FX_MISTA);
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-ACC1(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));
    if (c.ordem.length <= LIMITE_ATALHOS)
      throw new Error("D011-ACC1(nv): a fixture não alcança índice ≥ " + LIMITE_ATALHOS + " — a alínea do atributo ausente seria vazia");

    /* (b) aria-hidden em todo .key */
    const semHidden = c.ordem.filter(function (id) {
      return keyDe(botaoDe(c.d, id)).getAttribute("aria-hidden") !== "true";
    });
    if (semHidden.length)
      throw new Error("D011-ACC1(b): " + semHidden.length + "/" + c.ordem.length + " .key sem aria-hidden=\"true\": " + JSON.stringify(semHidden.slice(0, 4)));

    /* (c) o nome acessível aproximado começa pelo rótulo da pergunta, aplicado
       o mapa de apresentação público da 5.2 (ver bloco normativo de copyOf) */
    const copia = copyOf(c.w);
    const rotulo = {};
    c.tabela.forEach(function (q) { rotulo[q.id] = copia(q.lbl); });
    const ruins = [];
    c.ordem.forEach(function (id) {
      const t = textoSemAriaHidden(botaoDe(c.d, id)).trim();
      if (!t.startsWith(rotulo[id]))
        ruins.push(id + " começa por " + JSON.stringify(t.slice(0, 28)) + " e o rótulo é " + JSON.stringify(rotulo[id]));
    });
    if (ruins.length)
      throw new Error("D011-ACC1(c): " + ruins.length + " botões cujo texto sem aria-hidden não começa pelo rótulo: " + ruins.slice(0, 2).join(" · "));

    /* (d) mapa índice → aria-keyshortcuts, sem seleção */
    const divs = [];
    c.ordem.forEach(function (id, i) {
      const b = botaoDe(c.d, id);
      const got = b.hasAttribute("aria-keyshortcuts") ? b.getAttribute("aria-keyshortcuts") : null;
      const want = esperadoAtalho(i);
      if (got !== want) divs.push("i=" + i + " " + id + ": " + JSON.stringify(got) + " (esperado " + JSON.stringify(want) + ")");
    });
    if (divs.length)
      throw new Error("D011-ACC1(d): " + divs.length + " divergência(s) de aria-keyshortcuts: " + divs.slice(0, 3).join(" · "));

    /* (e) sob seleção: o atalho PERMANECE no índice < 9 e continua ausente no ≥ 9 */
    const idCurto = c.ordem[0], idMudo = c.ordem[LIMITE_ATALHOS + 1];
    botaoDe(c.d, idCurto).click(); await tick();
    botaoDe(c.d, idMudo).click(); await tick();
    const sel = selecionados(c.d);
    if (sel.indexOf(idCurto) < 0 || sel.indexOf(idMudo) < 0)
      throw new Error("D011-ACC1(nv): a seleção do cenário não se estabeleceu — selecionados=" + JSON.stringify(sel));
    const bCurto = botaoDe(c.d, idCurto), bMudo = botaoDe(c.d, idMudo);
    if (glifo(bCurto) !== "✓" || glifo(bMudo) !== "✓")
      throw new Error("D011-ACC1(nv): item selecionado não exibe ✓ — o cenário 'sob ✓' não foi alcançado");
    if (bCurto.getAttribute("aria-keyshortcuts") !== String(1))
      throw new Error("D011-ACC1(e): o item selecionado de índice 0 perdeu o atalho declarado: " + JSON.stringify(bCurto.getAttribute("aria-keyshortcuts")));
    if (bMudo.hasAttribute("aria-keyshortcuts"))
      throw new Error("D011-ACC1(e): o item selecionado de índice " + (LIMITE_ATALHOS + 1) + " declara atalho inexistente: " + JSON.stringify(bMudo.getAttribute("aria-keyshortcuts")));
    if (keyDe(bCurto).getAttribute("aria-hidden") !== "true")
      throw new Error("D011-ACC1(b): o .key do item selecionado perdeu aria-hidden");
    return true;
  });

T("D011-LEG1",
  "C4 · exatamente UMA legenda com o texto canônico, dentro do container da grade — e nenhuma quando não há botão",
  async function () {
    const c = await telaPrioridade(FX_MISTA);
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-LEG1(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));

    /* (b) existe exatamente uma */
    const legs = legendas(c.d);
    if (legs.length !== 1)
      throw new Error("D011-LEG1(b): " + legs.length + " nó(s) com o texto canônico da legenda (esperado 1). Texto exigido: " + JSON.stringify(TEXTO_LEGENDA));

    /* (c) ancestral comum com a grade, mais estreito que #app */
    const app = c.d.getElementById("app");
    const anc = legs[0].parentElement;
    const opts = botoes(c.d);
    if (!opts.length)
      throw new Error("D011-LEG1(nv): grade sem botões no cenário positivo");
    if (!anc || anc === app || !app.contains(anc))
      throw new Error("D011-LEG1(c): a legenda não está dentro do container da grade (pai=" + (anc && anc.className) + ")");
    const fora = opts.filter(function (b) { return !anc.contains(b); });
    if (fora.length)
      throw new Error("D011-LEG1(c): o container da legenda não abrange " + fora.length + " dos " + opts.length + " botões da grade");

    /* (d) caso negativo alcançável: zero findings → zero legenda */
    const z = await telaPrioridade({}, NIVEL_SEM_FINDING);
    if (z.ordem.length !== 0 || botoes(z.d).length !== 0)
      throw new Error("D011-LEG1(nv): o cenário negativo não zerou — oráculo=" + z.ordem.length + " findings, DOM=" + botoes(z.d).length + " botões");
    if (z.d.body.dataset.uxscreen !== "priority")
      throw new Error("D011-LEG1(nv): o cenário negativo não está na tela de prioridade (uxscreen=" + z.d.body.dataset.uxscreen + ")");
    const legsZ = legendas(z.d);
    if (legsZ.length !== 0)
      throw new Error("D011-LEG1(d): " + legsZ.length + " legenda(s) numa grade sem botão — a legenda existe se e somente se há botão");
    return true;
  });

T("D011-IDEM1",
  "C5 · idempotência por reconstrução: após alternar uma prioridade (render completo) as três propriedades e a legenda seguem o oráculo, e desfazer devolve o estado inicial byte a byte",
  async function () {
    const c = await telaPrioridade(FX_MISTA);
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-IDEM1(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));

    /* (b) estado inicial confere com o oráculo */
    const inicial = retrato(c);
    if (difere(inicial, retratoEsperado(c, [])))
      throw new Error("D011-IDEM1(b): estado inicial diverge do oráculo — obtido=" + JSON.stringify(inicial) + " esperado=" + JSON.stringify(retratoEsperado(c, [])));

    /* (c) após o toggle, o DOM reconstruído volta a conferir */
    const alvo = c.ordem[0];
    botaoDe(c.d, alvo).click(); await tick();
    if (selecionados(c.d).length !== 1)
      throw new Error("D011-IDEM1(nv): o clique não alterou a seleção — a reconstrução não foi exercida");
    const depois = retrato(c);
    if (difere(depois, retratoEsperado(c, [alvo])))
      throw new Error("D011-IDEM1(c): depois do toggle o estado diverge do oráculo — obtido=" + JSON.stringify(depois) + " esperado=" + JSON.stringify(retratoEsperado(c, [alvo])));

    /* (d) desfazer devolve exatamente o estado inicial */
    botaoDe(c.d, alvo).click(); await tick();
    if (selecionados(c.d).length !== 0)
      throw new Error("D011-IDEM1(nv): o segundo clique não desfez a seleção");
    const volta = retrato(c);
    if (difere(volta, inicial))
      throw new Error("D011-IDEM1(d): desfazer não devolveu o estado inicial — obtido=" + JSON.stringify(volta) + " inicial=" + JSON.stringify(inicial));
    return true;
  });

T("D011-PRT1",
  "C11 · no papel, NENHUM .d011-key que não seja `estado` fica visível (glifo de atalho E item sem atalho), a legenda some junto, o estado de seleção sobrevive e nenhum seletor é alheio — medido por Element.matches sobre os nós reais",
  async function () {
    const bloco = blocoCssDoModulo();
    const prints = blocosMediaPrint(bloco);
    if (prints.length !== 1)
      throw new Error("D011-PRT1(a): " + prints.length + " bloco(s) @media print no CSS do módulo (esperado exatamente 1)");
    const rs = regras(prints[0]);
    if (!rs.length)
      throw new Error("D011-PRT1(a): @media print do módulo sem regra alguma");

    /* (b) zero seletor alheio (R9 §6) — a allowlist é vazia por desenho */
    const alheios = [];
    rs.forEach(function (r) {
      r.seletores.forEach(function (s) { if (s.indexOf(".d011-") < 0) alheios.push(s); });
    });
    if (alheios.length)
      throw new Error("D011-PRT1(b): " + alheios.length + " seletor(es) fora do prefixo do módulo no @media print: " + alheios.slice(0, 3).join(" · "));

    /* cenário real: 15 findings, um item de índice < 9 selecionado */
    const c = await telaPrioridade(FX_MISTA);
    if (difere(c.ordem, D011_ORDEM_MISTA))
      throw new Error("D011-PRT1(a): ordem recalculada do vetor diverge da declarada — recalculada=" + JSON.stringify(c.ordem));
    const idSel = c.ordem[0], idAtalho = c.ordem[1];
    botaoDe(c.d, idSel).click(); await tick();
    if (selecionados(c.d).indexOf(idSel) < 0)
      throw new Error("D011-PRT1(nv): a seleção do cenário não se estabeleceu");

    const legs = legendas(c.d);
    if (legs.length !== 1)
      throw new Error("D011-PRT1(nv): " + legs.length + " legenda(s) no cenário — sem legenda a cláusula que a esconde é vazia");
    const bSel = botaoDe(c.d, idSel), bAt = botaoDe(c.d, idAtalho);
    const keySel = keyDe(bSel), keyAt = keyDe(bAt);
    if (glifo(bSel) !== "✓")
      throw new Error("D011-PRT1(nv): o item selecionado não exibe ✓ — a cláusula de preservação do estado seria vazia");
    const badge = bSel.querySelector(".ux-prio-badge");
    if (!badge)
      throw new Error("D011-PRT1(nv): badge 'Prioridade N' ausente no item selecionado — os únicos números que sobrevivem no papel");

    const oculta = [];
    rs.forEach(function (r) { if (escondeu(r.decls)) r.seletores.forEach(function (s) { oculta.push(s); }); });
    if (!oculta.length)
      throw new Error("D011-PRT1(a): nenhuma regra do @media print esconde coisa alguma");
    const casa = function (el) {
      return oculta.filter(function (s) {
        try { return el.matches(s); }
        catch (e) { throw new Error("seletor não suportado pelo motor de casamento: " + JSON.stringify(s) + " [" + e.message + "]"); }
      });
    };

    /* (c) o glifo de atalho some */
    if (!casa(keyAt).length)
      throw new Error("D011-PRT1(c): o .key do item com atalho ('" + idAtalho + "') não é alcançado por nenhuma regra de ocultação: " + JSON.stringify(oculta));
    /* (d) a legenda some */
    if (!casa(legs[0]).length)
      throw new Error("D011-PRT1(d): a legenda não é alcançada por nenhuma regra de ocultação — no papel ela ficaria falsa, ao lado dos badges 'Prioridade N', que SÃO a ordem");
    /* (e) o estado de seleção sobrevive */
    const vitimas = [];
    [["✓ (.key do selecionado)", keySel], ["botão selecionado", bSel], ["badge Prioridade N", badge]].forEach(function (par) {
      const hits = casa(par[1]);
      if (hits.length) vitimas.push(par[0] + " ← " + hits.join(","));
    });
    if (vitimas.length)
      throw new Error("D011-PRT1(e): a regra de print apaga o estado de seleção no papel: " + vitimas.join(" · "));

    /* (f) O ITEM SEM ATALHO TAMBÉM SOME — a cláusula que faltava, e a razão dela.
       `visibility:hidden` apaga o elemento INTEIRO, inclusive a borda herdada de
       `.opt .key` (`quickscan_…v3_1_3.html:68-69`: `border:1px solid var(--line)`,
       e `--line` vira `#c9c9c9` dentro do `@media print`, `:205`). Um seletor que
       casasse SÓ `data-d011="atalho"` deixaria o item MUDO imprimir uma moldura
       vazia — marca visível exatamente nos itens que o cliente apontou como "sem
       numeração", e sem a legenda para explicá-los, porque a legenda some por
       desenho na alínea (d). É a troca de categoria que a demanda existe para
       desfazer, sobrevivendo na superfície onde ninguém pode corrigi-la lendo.

       A asserção é por EFEITO e vale para QUALQUER forma do seletor — regra
       própria para `"mudo"`, ou `:not([data-d011="estado"])`. Quem escolhe a
       forma é o `ui-engineer`; o que se exige é o efeito.

       Os nós vêm do ORÁCULO (índice canônico ≥ 9 e não selecionado), não do
       atributo: um módulo que parasse de marcar `"mudo"` não escaparia por aqui.
       A varredura de fechamento logo abaixo cobre o resto — inclusive um quarto
       valor de marcador que ninguém previu. Juntas, (c) e (f) equivalem a "no
       papel, nenhum `.d011-key` que não seja `estado` fica visível". */
    const selSet = new Set(selecionados(c.d));
    const mudos = c.ordem
      .map(function (id, i) { return { id: id, i: i }; })
      .filter(function (e) { return e.i >= LIMITE_ATALHOS && !selSet.has(e.id); })
      .map(function (e) { return { id: e.id, key: keyDe(botaoDe(c.d, e.id)) }; });
    if (!mudos.length)
      throw new Error("D011-PRT1(nv): nenhum item sem atalho e não selecionado no cenário — a cláusula (f) seria vazia");
    const visiveis = mudos.filter(function (e) { return !casa(e.key).length; });
    if (visiveis.length)
      throw new Error("D011-PRT1(f): " + visiveis.length + "/" + mudos.length +
        " item(ns) SEM ATALHO continuam visíveis no papel (" + visiveis.slice(0, 3).map(function (e) { return e.id; }).join(", ") +
        ") — o .key some, mas a MOLDURA de `.opt .key` fica, marcando justamente os itens que o cliente apontou," +
        " e a legenda que os explicaria some por desenho. Regras de ocultação vigentes: " + JSON.stringify(oculta));

    /* fechamento: todo `.d011-key` da grade ou é `estado` ou é ocultado. Fecha o
       buraco de um marcador NOVO, que nem (c) nem (f) alcançariam pelo nome. */
    const sobras = Array.prototype.filter.call(c.d.querySelectorAll(".d011-key"), function (k) {
      return k.getAttribute("data-d011") !== "estado" && !casa(k).length;
    });
    if (sobras.length)
      throw new Error("D011-PRT1(f): " + sobras.length + " .d011-key que não são `estado` sobrevivem à impressão — marcadores: " +
        JSON.stringify(Array.from(new Set(sobras.map(function (k) { return k.getAttribute("data-d011"); })))));
    return true;
  });

/* ================================ execução ================================ */
(async function () {
  for (const c of casos) {
    if (ONLY.length && ONLY.indexOf(c.id) < 0) continue;
    let ok = false, err = "";
    try { ok = (await c.fn()) === true; }
    catch (x) { err = " [" + ((x && x.message) || x) + "]"; }
    results.push({ id: c.id, ok: ok });
    console.log((ok ? "PASS" : "FAIL") + "  " + c.id + " — " + c.label + err);
  }
  const pass = results.filter(r => r.ok).length;
  const fail = results.length - pass;
  console.log("\nD011 NUMERAÇÃO DAS PRIORIDADES: " + pass + " PASS · " + fail + " FAIL de " + results.length);
  process.exit(fail ? 1 : 0);
})().catch(function (e) {
  console.error("D011: falha fatal —", (e && e.stack) || e);
  console.log("\nD011 NUMERAÇÃO DAS PRIORIDADES: 0 PASS · " + (casos.length || 1) + " FAIL de " + (casos.length || 1));
  process.exit(1);
});
