/* ============================================================================
   TESTES D011 · CHROMIUM — demanda 011-numeracao-das-prioridades
   Namespace exclusivo D011-*. Não vive em `tests_p52_chromium.js`: gate de uma
   demanda não mora em arquivo de outra fase (R10 §1), e a contagem canônica de
   `p52chromium` (55/0) não pode mudar por esta demanda.

   Aqui vive UMA propriedade — a única desta demanda que exige LAYOUT e CORES
   RESOLVIDAS de verdade:

     D011-CON1 · o contraste da legenda de C4 atinge o mínimo do WCAG 2.x,
     recalculado pela fórmula sobre as cores RESOLVIDAS pelo motor, nunca
     lido de um token declarado nem conferido contra uma paleta de projeto.

   A fórmula é REIMPLEMENTADA aqui (mesmo padrão de `V322C_CONTRASTE`,
   `tests_p52_chromium.js:6030-6072`) e não importada: oráculo que chama a
   implementação concorda com ela por construção. O fundo efetivo é o primeiro
   ancestral com alfa > 0,95 — o mesmo critério do precedente.

   AMBIENTE (R10 §2 — SKIP silencioso é FAIL): sem Chromium esta suíte
   TERMINA EM FAIL com o motivo NOMEADO. Ela é registrada em
   `expected_suites.json` no bloco `visual`, com `requires: ["chromium"]`:
   o agregado local NÃO a executa por desenho (KI-3, `design-decisions.md`),
   e a execução canônica é o job `visual` do CI e o rito do proprietário.
   ========================================================================== */
"use strict";

const path = require("path");

const HERE = __dirname;
const HTML_URL = "file://" + path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");

/* Texto canônico da legenda (C4) — mesma constante literal da suíte jsdom.
   A legenda é localizada pelo TEXTO, não pela classe: o gate mede o critério,
   não a nomenclatura do plano. */
const TEXTO_LEGENDA = "Os números são atalhos de teclado — não a ordem de prioridade.";

/* Fixture MISTA — o mesmo vetor de `tests_011_prioridade.js`: 15 findings,
   três respostas de nível 0 e as demais de nível 1. */
const FX_MISTA = { "training": 0, "logs": 0, "vulnerability-management": 0 };
const NIVEL_PADRAO = 1;

const results = [];
function T(id, label, ok, detalhe) {
  results.push({ id: id, ok: !!ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label +
    (ok ? "" : (detalhe && detalhe.length ? " [" + [].concat(detalhe).join(" · ") + "]" : "")));
}
function encerrar() {
  const pass = results.filter(r => r.ok).length;
  const fail = results.length - pass;
  console.log("\nD011 CHROMIUM (demanda 011): " + pass + " PASS · " + fail + " FAIL de " + results.length);
  process.exit(fail ? 1 : 0);
}

/* Executada DENTRO da página: recalcula a razão WCAG sobre as cores resolvidas. */
const D011_CONTRASTE = function (texto) {
  function rgb(s) {
    var m = String(s || "").match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(",").map(function (x) { return parseFloat(x); });
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function lum(c) {
    var v = [c.r, c.g, c.b].map(function (x) {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  var app = document.getElementById("app");
  if (!app) return { erro: "#app ausente" };
  var alvos = Array.prototype.filter.call(app.querySelectorAll("*"), function (el) {
    var s = "";
    Array.prototype.forEach.call(el.childNodes, function (n) { if (n.nodeType === 3) s += n.nodeValue; });
    return s.trim() === texto;
  });
  if (alvos.length !== 1) return { erro: alvos.length + " nó(s) com o texto canônico da legenda (esperado 1)" };
  var el = alvos[0];
  var cs = getComputedStyle(el);
  var fg = rgb(cs.color);
  if (!fg) return { erro: "cor do texto não resolvida: " + cs.color };
  var bg = null, p;
  for (p = el; p; p = p.parentElement) {
    var c = rgb(getComputedStyle(p).backgroundColor);
    if (c && c.a > 0.95) { bg = c; break; }
  }
  if (!bg) bg = rgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  var l1 = lum(fg), l2 = lum(bg);
  var ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  var fsz = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight, 10) || 400;
  var grande = fsz >= 24 || (fsz >= 18.66 && fw >= 700);
  var vis = cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity || "1") > 0.05;
  return {
    color: cs.color, background: cs.backgroundColor, fundoEfetivo: bg,
    fontSize: fsz, fontWeight: fw, grande: grande, visivel: vis,
    ratio: Math.round(ratio * 100) / 100, minimo: grande ? 3 : 4.5
  };
};

(async function () {
  let chromium;
  try { chromium = require("@playwright/test").chromium; }
  catch (e) {
    T("D011-CON1", "contraste da legenda ≥ mínimo WCAG sobre as cores resolvidas",
      false, ["AMBIENTE AUSENTE, NOMEADO: @playwright/test indisponível — " + e.message +
        ". Execução canônica: job `visual` do CI (KI-3). NÃO EXECUTADO não é PASS."]);
    return encerrar();
  }
  let browser = null;
  try { browser = await chromium.launch(); }
  catch (e) {
    T("D011-CON1", "contraste da legenda ≥ mínimo WCAG sobre as cores resolvidas",
      false, ["AMBIENTE AUSENTE, NOMEADO: Chromium não pôde ser iniciado — " + e.message +
        ". Execução canônica: job `visual` do CI (KI-3). NÃO EXECUTADO não é PASS."]);
    return encerrar();
  }
  const erros = [];
  try {
    const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    pg.on("pageerror", e => erros.push("pageerror: " + e.message));
    pg.on("console", m => { if (m.type() === "error") erros.push("console: " + m.text()); });
    await pg.goto(HTML_URL, { waitUntil: "load" });
    await pg.evaluate(function (fx) {
      var vetor = fx.vetor, padrao = fx.padrao;
      /* o catálogo é lido do estado congelado (`QS` é const de topo de script:
         não está em `window`, só o eval global a alcança) — sem lista literal
         duplicada nesta suíte */
      var ids = eval("QS.map(function(q){return q.id;})");
      if (!Array.isArray(ids) || !ids.length) throw new Error("catálogo congelado indisponível na página");
      ids.forEach(function (id) {
        window.__DEV.setAnswerById(id, Object.prototype.hasOwnProperty.call(vetor, id) ? vetor[id] : padrao);
      });
      window.__DEV.setArq(0);
      window.__DEV.showPriority();
    }, { vetor: FX_MISTA, padrao: NIVEL_PADRAO });
    await pg.waitForTimeout(300);

    const m = await pg.evaluate(D011_CONTRASTE, TEXTO_LEGENDA);
    const det = [];
    if (!m || m.erro) det.push("legenda não medida: " + ((m && m.erro) || "sem retorno"));
    else {
      if (!m.visivel) det.push("legenda presente porém não visível na tela (visibility/display/opacity)");
      if (m.ratio < m.minimo)
        det.push("contraste " + m.ratio.toFixed(2) + ":1 (mínimo " + m.minimo + ":1) — " + m.color +
          " sobre rgb(" + m.fundoEfetivo.r + "," + m.fundoEfetivo.g + "," + m.fundoEfetivo.b + ")");
    }
    if (erros.length) det.push("erros de página: " + erros.slice(0, 3).join(" | "));
    T("D011-CON1",
      "C10 · contraste da legenda ≥ mínimo WCAG, recalculado pela fórmula sobre as cores resolvidas na tela de prioridade" +
      (m && !m.erro ? " (medido " + m.ratio + ":1, mínimo " + m.minimo + ":1)" : ""),
      !det.length, det);
    await pg.close().catch(() => { });
  } finally {
    await browser.close().catch(() => { });
  }
  encerrar();
})().catch(function (e) {
  console.error("D011 CHROMIUM: falha fatal —", (e && e.stack) || e);
  console.log("\nD011 CHROMIUM (demanda 011): 0 PASS · 1 FAIL de 1");
  process.exit(1);
});
