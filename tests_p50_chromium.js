/* ============================================================================
   TESTES P50 · CHROMIUM — PHASE 5.0 · microfases 5.0.1 + 5.0.2 + 5.0.3
   Escopo: P50-ACC6 (estado acessível da seleção), P50-SESUX1B (status de
   sessão renderizado) e as verificações de ACEITE de UX — que NÃO pertencem
   ao namespace de gate P50-VIS/P50-ACC e não o encerram.
   Origem: P50-ACC6 é o gate
   gate nominalmente associado a UI-004. P50-ACC1..P50-ACC5 e P50-VIS1..VIS10
   pertencem às microfases posteriores e NÃO são antecipados aqui.

   Ambiente canônico (spec §25.6): Chromium dirigido por Playwright, com a
   MESMA ordem de resolução de browser congelada da suíte UG
   (CHROME_PATH -> /opt/google/chrome/chrome -> Chromium gerenciado).
   Este arquivo NÃO toca tests_visual/ (fora da boundary autorizada).

   SKIP: sem browser resolvível o gate imprime "NÃO EXECUTADO" e NUNCA conta
   como PASS; a execução canônica de entrega exige PASS em Chromium real.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const FX = require("./fixtures_p50.js");

const HTML_URL = "file://" + path.join(__dirname, "quickscan_secops_soccmm_v3_2_dev.html");
const results = [];
let skipped = 0;

const EVIDENCE = path.join(__dirname, "docs_phase5", "evidence_p50");
const shots = [];
/* Sob campanha de MUTAÇÃO o produto está deliberadamente defeituoso: gravar
   evidência nessa condição contaminaria o acervo com render mutado (defeito
   H-19). As asserções continuam todas executando; apenas a ESCRITA de
   arquivos é suprimida. Sem a variável, a evidência é gravada normalmente. */
const NO_EVIDENCE = process.env.P50_NO_EVIDENCE === "1";
if (NO_EVIDENCE) console.log("EVIDÊNCIA SUPRIMIDA (execução sob mutação): nenhum arquivo será gravado");

/* B-503-EVIDENCE · integridade histórica.
   Evidência é o retrato do estado no momento em que foi produzida, não um
   arquivo vivo. Esta suíte grava EXCLUSIVAMENTE artefatos da microfase
   corrente: qualquer nome de microfase anterior é asserido normalmente, mas
   NUNCA regravado. Sem esta regra, uma execução posterior (ou uma execução sob
   mutação) reescreve o acervo auditado de 5.0.1/5.0.2 sem que nenhuma decisão
   de projeto o tenha tocado. */
const EVIDENCE_PREFIX = "P50-5.0.4-";   /* microfase CORRENTE; 5.0.1/5.0.2/5.0.3 são históricas */
function evidenceWritable(name) {
  if (NO_EVIDENCE) return false;
  return name.indexOf(EVIDENCE_PREFIX) === 0;
}
function writeEvidence(file, data) {
  if (!evidenceWritable(file)) return;
  fs.mkdirSync(EVIDENCE, { recursive: true });
  fs.writeFileSync(path.join(EVIDENCE, file), data, "utf8");
}

function resolveBrowser() {                       /* mesma ordem de playwright.config.js */
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { exe: explicit, origin: "CHROME_PATH" };
  if (fs.existsSync(local)) return { exe: local, origin: "/opt/google/chrome/chrome" };
  return { exe: null, origin: "Chromium gerenciado pelo Playwright" };
}

/* A Camada 1 aplica `.screen{animation:fade .35s ease}` (congelado). Capturar
   antes do fim da animação produz PNG não determinístico. Aguardar o repouso
   torna a evidência reproduzível entre execuções. */
/* Captura só o viewport. Necessária quando o estado sob teste contém texto
   sem pontos de quebra (a fixture de falha de export usa 1 MiB de "x"), que
   alarga a página congelada e inviabiliza um fullPage. */
/* Screenshot do próprio elemento: garante que o componente esteja
   materialmente visível na imagem (M-502-3). */
async function shotElement(page, selector, name) {
  if (!evidenceWritable(name)) { shots.push(name); return; }   /* histórico: aferido, nunca regravado */
  fs.mkdirSync(EVIDENCE, { recursive: true });
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await loc.screenshot({ path: path.join(EVIDENCE, name), animations: "disabled" });
  shots.push(name);
}

async function shotViewport(page, name) {
  if (!evidenceWritable(name)) { shots.push(name); return; }   /* histórico: aferido, nunca regravado */
  fs.mkdirSync(EVIDENCE, { recursive: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(EVIDENCE, name), fullPage: false, animations: "disabled" });
  shots.push(name);
}

async function shot(page, name) {
  if (!evidenceWritable(name)) { shots.push(name); return; }   /* histórico: aferido, nunca regravado */
  fs.mkdirSync(EVIDENCE, { recursive: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(EVIDENCE, name), fullPage: true, animations: "disabled" });
  shots.push(name);
}

/* Navega até a pergunta k usando SOMENTE controles congelados, e deixa no ar o
   vetor da fixture. Espelha fixtures_p50.js::p50GotoQuestion dentro da página. */
async function applyFixture(page, fx) {
  await page.goto(HTML_URL);
  await page.evaluate(([qids, vec, k, notes]) => {
    const step = () => {
      const box = document.getElementById("progbox");
      if (!box || box.classList.contains("hidden")) return -1;
      const m = ((document.getElementById("ptext") || {}).textContent || "").match(/^(\d+)\s*\//);
      return m ? parseInt(m[1], 10) - 1 : null;
    };
    const key = kk => document.dispatchEvent(
      new KeyboardEvent("keydown", { key: kk, bubbles: true, cancelable: true }));
    window.__DEV.setArq(0);
    document.getElementById("start").click();
    key("Enter");
    for (let s = 1; s < k + 2; s++) { key("1"); key("Enter"); }
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    if (notes) Object.keys(notes).forEach(i => window.__DEV.setNote(Number(i), notes[i]));
    let guard = 0;
    while (step() > k + 1 && guard++ < 40) key("ArrowLeft");
    if (step() !== k + 1) throw new Error("navegação: step " + step() + " != " + (k + 1));
  }, [FX.P50_QIDS, fx.vec, fx.focusQuestion, fx.notes || null]);
}

/* Aplica o vetor da fixture pelos owners canônicos e alcança a tela de
   RESULTADOS pela rota congelada. Espelha fixtures_p50.js::p50ApplyResults. */
async function applyResults(page, fx) {
  await page.goto(HTML_URL);
  await page.evaluate(([qids, vec]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    window.__DEV.showResults();
  }, [FX.P50_QIDS, fx.vec]);
}

/* Leitura completa da superfície nova da 5.0.3, com layout medido no browser. */
function readSuffSurface(page) {
  return page.evaluate(() => {
    const box = document.getElementById("p50-suff");
    const res = document.getElementById("p50-results");
    if (!box || !res) return null;
    const t = e => (e ? (e.textContent || "").replace(/\s+/g, " ").trim() : null);
    const vis = e => !!e && !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    const se = document.scrollingElement;
    const rect = e => { const r = e.getBoundingClientRect(); return { t: r.top + scrollY, b: r.bottom + scrollY, l: r.left, r: r.right }; };
    const clipped = Array.from(document.querySelectorAll("#p50-suff *, #p50-results *"))
      .filter(e => e.children.length === 0 && (e.textContent || "").trim())
      .filter(e => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1).length;
    const rSuff = rect(box), rRes = rect(res);
    return {
      gate: res.getAttribute("data-p50-gate"),
      sufficientAttr: box.getAttribute("data-p50-sufficient"),
      suffVisible: vis(box),
      resVisible: vis(res),
      globalLine: {
        text: t(box.querySelector("[data-p50=\"suff-global\"]")),
        confirmed: (box.querySelector("[data-p50=\"suff-global\"]") || {}).getAttribute &&
                   box.querySelector("[data-p50=\"suff-global\"]").getAttribute("data-p50-confirmed"),
        required: box.querySelector("[data-p50=\"suff-global\"]") &&
                  box.querySelector("[data-p50=\"suff-global\"]").getAttribute("data-p50-required"),
        missing: box.querySelector("[data-p50=\"suff-global\"]") &&
                 box.querySelector("[data-p50=\"suff-global\"]").getAttribute("data-p50-missing")
      },
      deficits: Array.from(box.querySelectorAll("[data-p50=\"suff-deficit\"]")).map(n => ({
        dom: Number(n.getAttribute("data-dom")), missing: Number(n.getAttribute("data-missing")),
        text: t(n), accessible: n.getAttribute("aria-label") || t(n), visible: vis(n)
      })),
      axis: Array.from(box.querySelectorAll("[data-p50=\"suff-domain\"]")).map(n => ({
        dom: Number(n.getAttribute("data-dom")),
        confirmed: Number(n.getAttribute("data-p50-confirmed")),
        toValidate: Number(n.getAttribute("data-p50-tovalidate")),
        unanswered: Number(n.getAttribute("data-p50-unanswered")),
        text: t(n), accessible: n.getAttribute("aria-label") || t(n)
      })),
      guidance: t(box.querySelector("[data-p50=\"suff-guidance\"]")),
      verdict: t(res.querySelector("[data-p50=\"results-verdict\"]")),
      domains: Array.from(res.querySelectorAll("[data-p50=\"results-domain\"]")).map(n => ({
        dom: Number(n.getAttribute("data-dom")),
        state: n.getAttribute("data-p50-state"),
        value: t(n.querySelector("[data-p50=\"results-domain-value\"]")),
        label: t(n.querySelector("[data-p50=\"results-domain-label\"]")),
        accessible: n.getAttribute("aria-label") || t(n),
        visible: vis(n)
      })),
      execCards: Array.from(res.querySelectorAll("[data-p50=\"exec-card\"]")).map(n => n.getAttribute("data-card")),
      execCardsBox: !!res.querySelector("[data-p50=\"exec-cards\"]"),
      overallEl: !!res.querySelector("[data-p50=\"overall\"]"),
      stageEl: !!res.querySelector("[data-p50=\"stage\"]"),
      layout: {
        docScrollWidth: se.scrollWidth, viewportW: window.innerWidth, viewportH: window.innerHeight,
        clippedNodes: clipped,
        suffBottom: Math.round(rSuff.b), resTop: Math.round(rRes.t),
        overlap: rSuff.b > rRes.t + 1,
        suffRight: Math.round(rSuff.r), resRight: Math.round(rRes.r)
      },
      resText: t(res),

      /* B-503-COHERENCE · superfície LEGADA medida no browser real.
         Visibilidade aqui é layout de verdade (getComputedStyle + caixa),
         não apenas presença de atributo. */
      legacy: (function () {
        const seen = e => {
          if (!e) return false;
          const cs = getComputedStyle(e);
          if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const rows = Array.from(document.querySelectorAll("#app .grid2 .panel .dom"));
        const radar = document.querySelector("#app .radar-box");
        const legend = document.querySelector("#app .scale-legend");
        /* texto acessível da página de resultados, ignorando aria-hidden */
        const accWalk = n => {
          if (n.nodeType === 3) return n.nodeValue + " ";
          if (n.nodeType !== 1) return "";
          if (n.getAttribute("aria-hidden") === "true") return "";
          const cs = getComputedStyle(n);
          if (cs.display === "none" || cs.visibility === "hidden") return "";
          const lbl = n.getAttribute("aria-label");
          if (lbl) return lbl + " ";
          let out = "";
          for (const c of n.childNodes) out += accWalk(c);
          return out;
        };
        return {
          rows: rows.length,
          /* nó CONGELADO: preservado no DOM, medido quanto a VISIBILIDADE real */
          frozenValues: rows.map(r => t(r.querySelector(".lbl > span"))),
          frozenValuesVisible: rows.map(r => seen(r.querySelector(".lbl > span"))),
          frozenConfVisible: rows.map(r => seen(r.querySelector(".conf"))),
          p50Values: rows.map(r => t(r.querySelector("[data-p50=\"legacy-domain-value\"]"))),
          p50ValuesVisible: rows.map(r => seen(r.querySelector("[data-p50=\"legacy-domain-value\"]"))),
          marks: rows.map(r => r.getAttribute("data-p50-legacy")),
          stateNotes: rows.map((r, i) => t(r.querySelector("[data-p50=\"legacy-domain-state-" + i + "\"]"))),
          fillsPresent: document.querySelectorAll("#app .ruler .fill").length,
          /* domínios com score canônico: o renderer congelado só emite .fill
             para esses (os UNSET recebem .ruler.unset + marcador) */
          rulersScored: document.querySelectorAll("#app .ruler:not(.unset)").length,
          fillsVisible: Array.from(document.querySelectorAll("#app .ruler .fill")).filter(seen).length,
          radarVisible: seen(radar ? radar.querySelector("svg") : null),
          radarNoteVisible: seen(document.querySelector("#app [data-p50=\"legacy-radar-note\"]")),
          legendVisible: seen(legend),
          bannerVisible: seen(document.querySelector("#app [data-p50=\"legacy-domain-banner\"]")),
          accText: accWalk(document.getElementById("app")).replace(/\s+/g, " ").trim()
        };
      })()
    };
  });
}

/* ============================================================================
   ACEITE-UX-5.0.3 — verificação de aceite em Chromium REAL.
   NÃO é gate do namespace P50-VIS/P50-ACC (que permanecem reservados às
   microfases previstas e NÃO são declarados encerrados aqui). Cada screenshot
   corresponde às asserções executáveis abaixo; falha bloqueia a execução.
   ========================================================================== */
async function aceite503(browser, pageErrors) {
  const detail = [];
  const observed = [];
  const D = [];

  const check = (tag, m, expect) => {
    if (!m) { detail.push(tag + ": superfície nova ausente"); return; }
    observed.push(Object.assign({ fixture: tag }, m));
    if (m.gate !== expect.gate) detail.push(tag + ": gate=" + m.gate + " (esperado " + expect.gate + ")");
    if (m.sufficientAttr !== (expect.gate === "released" ? "true" : "false"))
      detail.push(tag + ": data-p50-sufficient=" + m.sufficientAttr);
    if (!m.suffVisible) detail.push(tag + ": painel de suficiência não visível");
    if (!m.resVisible) detail.push(tag + ": superfície de resultados não visível");
    /* déficits exatos, com nome acessível carregando o número */
    const gotDef = m.deficits.map(x => x.dom + ":" + x.missing).join(",");
    if (gotDef !== expect.deficits.join(",")) detail.push(tag + ": déficits [" + gotDef + "] != [" + expect.deficits.join(",") + "]");
    m.deficits.forEach(x => {
      if (!x.visible) detail.push(tag + ": déficit do domínio " + x.dom + " não visível");
      if (!x.accessible || x.accessible.indexOf("+" + x.missing) < 0)
        detail.push(tag + ": déficit sem número no texto acessível: " + x.accessible);
    });
    /* bloqueio: nenhum executive card, nenhum overall/estágio, n/d em todos */
    if (expect.gate === "blocked") {
      if (m.execCardsBox || m.execCards.length) detail.push(tag + ": executive cards sob gate fechado");
      if (m.overallEl || m.stageEl) detail.push(tag + ": overall/estágio sob gate fechado");
      if (!/BLOQUEADO/.test(m.verdict || "")) detail.push(tag + ": veredito visível não declara bloqueio");
      if (!m.guidance) detail.push(tag + ": orientação construtiva ausente");
      m.domains.forEach(dd => {
        if (dd.state !== "unavailable") detail.push(tag + " dom " + dd.dom + ": estado " + dd.state);
        if (dd.value !== "n/d") detail.push(tag + " dom " + dd.dom + ": valor " + dd.value);
        if (!/Não avaliado/i.test(dd.label || "")) detail.push(tag + " dom " + dd.dom + ": sem 'Não avaliado'");
        if (!/evidência insuficiente/i.test(dd.accessible || "")) detail.push(tag + " dom " + dd.dom + ": acessível sem qualificação");
      });
      if (/\d[.,]\d\s*\/\s*5[.,]0/.test(m.resText || "")) detail.push(tag + ": score consolidado visível sob bloqueio");
    } else {
      if (!m.execCardsBox) detail.push(tag + ": executive cards ausentes com gate aberto");
      if (m.execCards.join(",") !== "strengths,priorities") detail.push(tag + ": cards = " + m.execCards.join(","));
      if (m.guidance) detail.push(tag + ": orientação de insuficiência com gate aberto");
      m.domains.forEach(dd => {
        if (dd.state !== "scored") detail.push(tag + " dom " + dd.dom + ": estado " + dd.state + " com gate aberto");
        if (!/^\d[.,]\d$/.test(dd.value || "")) detail.push(tag + " dom " + dd.dom + ": valor " + dd.value);
      });
    }
    /* composição dos três estados sempre textual (não depende de cor) */
    if (m.axis.length !== 5) detail.push(tag + ": composição por domínio incompleta (" + m.axis.length + ")");
    m.axis.forEach(a => {
      ["confirmada", "a validar", "não respondida"].forEach(w => {
        if ((a.accessible || "").indexOf(w) < 0 && (a.accessible || "").indexOf(w + "s") < 0)
          detail.push(tag + " dom " + a.dom + ": estado '" + w + "' ausente do texto acessível");
      });
    });
    /* B-503-COHERENCE: a página inteira comunica UM só estado */
    const LG = m.legacy, STAGE = /\b(Non-existent|Initial|Managed|Defined|Quantitatively Managed|Optimizing)\b/;
    if (LG.rows !== 5) detail.push(tag + ": painel legado com " + LG.rows + " domínios");
    if (expect.gate === "blocked") {
      LG.frozenValuesVisible.forEach((vis, i) => {
        if (vis) detail.push(tag + " legado dom " + i + ": score parcial '" + LG.frozenValues[i] + "' VISÍVEL na tela");
      });
      LG.frozenConfVisible.forEach((vis, i) => {
        if (vis) detail.push(tag + " legado dom " + i + ": linha de confiança legada visível");
      });
      LG.p50Values.forEach((v, i) => {
        if (v !== "n/d") detail.push(tag + " legado dom " + i + ": substituto honesto ausente ('" + v + "')");
        if (!LG.p50ValuesVisible[i]) detail.push(tag + " legado dom " + i + ": substituto honesto não visível");
      });
      LG.marks.forEach((mk, i) => { if (mk !== "neutralized") detail.push(tag + " legado dom " + i + ": não neutralizado"); });
      LG.stateNotes.forEach((n, i) => {
        if (!/Não avaliado · evidência insuficiente/.test(n || "")) detail.push(tag + " legado dom " + i + ": rótulo de estado ausente");
      });
      if (LG.fillsVisible !== 0) detail.push(tag + ": " + LG.fillsVisible + " ruler(s) preenchido(s) VISÍVEL(is)");
      /* Os preenchimentos PERMANECEM no DOM de propósito: o contrato congelado
         de geometria UNSET (suíte UG) assere a sua presença e o seu style. O
         que a errata exige é que não sejam VISÍVEIS nem acessíveis — e é isso
         que se mede aqui, com layout real. */
      if (LG.fillsPresent !== LG.rulersScored)
        detail.push(tag + ": " + LG.fillsPresent + " preenchimento(s) no DOM, esperado " + LG.rulersScored +
          " (estrutura congelada preservada)");
      if (LG.radarVisible) detail.push(tag + ": radar parcial visível sob gate fechado");
      if (!LG.radarNoteVisible) detail.push(tag + ": substituto acessível do radar ausente");
      if (LG.legendVisible) detail.push(tag + ": legenda de maturidade visível sob gate fechado");
      if (!LG.bannerVisible) detail.push(tag + ": painel legado sem declaração de insuficiência");
      const st = (LG.accText || "").match(STAGE);
      if (st) detail.push(tag + ": estágio de maturidade acessível na página: '" + st[0] + "'");
    } else {
      if (LG.fillsVisible !== LG.rulersScored)
        detail.push(tag + ": " + LG.fillsVisible + " ruler(s) visível(is), esperado " + LG.rulersScored);
      if (!LG.radarVisible) detail.push(tag + ": radar canônico não restaurado");
      if (!LG.legendVisible) detail.push(tag + ": legenda de escala não restaurada");
      if (LG.marks.some(x => x !== null)) detail.push(tag + ": marcador de neutralização stale com gate aberto");
      if (LG.bannerVisible || LG.radarNoteVisible) detail.push(tag + ": nota de neutralização stale com gate aberto");
      if (LG.p50Values.some(v => v)) detail.push(tag + ": substituto de insuficiência stale com gate aberto");
      LG.frozenValuesVisible.forEach((vis, i) => {
        if (!vis) detail.push(tag + " legado dom " + i + ": score canônico não voltou à tela");
      });
      LG.frozenValues.forEach((v, i) => {
        if (!/^\d[.,]\d/.test(v || "")) detail.push(tag + " legado dom " + i + ": valor legado '" + v + "' não é score canônico");
      });
    }

    /* layout: sem overflow horizontal, sem clipping, sem sobreposição */
    if (m.layout.docScrollWidth > m.layout.viewportW)
      detail.push(tag + ": overflow horizontal (" + m.layout.docScrollWidth + " > " + m.layout.viewportW + ")");
    if (m.layout.clippedNodes) detail.push(tag + ": " + m.layout.clippedNodes + " nó(s) clipado(s)");
    if (m.layout.overlap) detail.push(tag + ": painel de suficiência sobrepõe a superfície de resultados");
  };

  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
    const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    pg.on("pageerror", e => pageErrors.push("5.0.3 vp" + vp.w + ": " + String(e.message)));

    if (vp.w === 1440) {
      await applyResults(pg, FX.P50_F2);
      check("P50-F2@1440", await readSuffSurface(pg), { gate: "blocked", deficits: ["1:1", "2:2", "3:1", "4:2"] });
      await shot(pg, "P50-5.0.3-partial-insufficient-1440.png");

      await applyResults(pg, FX.P50_F3);
      check("P50-F3@1440", await readSuffSurface(pg), { gate: "blocked", deficits: ["0:1"] });
      await shot(pg, "P50-5.0.3-near-threshold-1440.png");
      /* Captura DO ELEMENTO: em fullPage a superfície nova fica no rodapé de
         uma página muito alta. O recorte do componente torna a evidência
         materialmente legível (mesma correção adotada em 5.0.2 · M-502-3). */
      await shotElement(pg, "#p50-suff", "P50-5.0.3-panel-blocked-1440.png");
      await shotElement(pg, "#p50-results", "P50-5.0.3-gate-blocked-1440.png");
      /* superfície LEGADA neutralizada (B-503-COHERENCE), legível no recorte */
      await shotElement(pg, "#app .res-head", "P50-5.0.3-legacy-head-blocked-1440.png");
      await shotElement(pg, "#app .grid2 .panel", "P50-5.0.3-legacy-domains-blocked-1440.png");

      await applyResults(pg, FX.P50_F4);
      check("P50-F4@1440", await readSuffSurface(pg), { gate: "released", deficits: [] });
      await shot(pg, "P50-5.0.3-exactly-sufficient-1440.png");
      await shotElement(pg, "#p50-suff", "P50-5.0.3-panel-released-1440.png");
      await shotElement(pg, "#p50-results", "P50-5.0.3-gate-released-1440.png");
      await shotElement(pg, "#app .res-head", "P50-5.0.3-legacy-head-released-1440.png");
      await shotElement(pg, "#app .grid2 .panel", "P50-5.0.3-legacy-domains-released-1440.png");

      await applyResults(pg, FX.P50_F5);
      check("P50-F5@1440", await readSuffSurface(pg), { gate: "released", deficits: [] });
      await shot(pg, "P50-5.0.3-fully-sufficient-1440.png");

      /* rebloqueio pelo CAMINHO REAL: #review -> ArrowLeft -> "Não sei" */
      await applyResults(pg, FX.P50_F4);
      const relocked = await pg.evaluate(() => {
        const step = () => {
          const m = ((document.getElementById("ptext") || {}).textContent || "").match(/^(\d+)\s*\//);
          return m ? parseInt(m[1], 10) - 1 : null;
        };
        const key = kk => document.dispatchEvent(new KeyboardEvent("keydown", { key: kk, bubbles: true, cancelable: true }));
        document.getElementById("review").click();
        let guard = 0;
        while (step() > 1 && guard++ < 40) key("ArrowLeft");
        if (step() !== 1) return { error: "navegação real falhou: step " + step() };
        const na = document.querySelector("#app .opts .opt[data-i=\"NA\"]");
        if (!na) return { error: "botão canônico 'Não sei' ausente" };
        na.click();
        window.__DEV.showResults();
        return { ok: true };
      });
      if (relocked.error) detail.push("relock@1440: " + relocked.error);
      const mRe = await readSuffSurface(pg);
      check("relock@1440", mRe, { gate: "blocked", deficits: ["0:1"] });
      if (mRe && /Pontos fortes|Prioridades de evolução/.test(mRe.resText || ""))
        detail.push("relock@1440: conteúdo executivo stale visível após o rebloqueio");
      await shot(pg, "P50-5.0.3-relocked-1440.png");
    } else {
      await applyResults(pg, FX.P50_F3);
      check("P50-F3@390", await readSuffSurface(pg), { gate: "blocked", deficits: ["0:1"] });
      await shot(pg, "P50-5.0.3-insufficient-390.png");

      await applyResults(pg, FX.P50_F4);
      check("P50-F4@390", await readSuffSurface(pg), { gate: "released", deficits: [] });
      await shot(pg, "P50-5.0.3-sufficient-390.png");
    }
    await pg.close();
  }

  const ok = detail.length === 0;
  results.push({ id: "ACEITE-UX-5.0.3", ok });
  console.log((ok ? "PASS" : "FAIL") +
    "  ACEITE-UX-5.0.3 (verificação de aceite, NÃO é gate P50-VIS/P50-ACC) — gate de suficiência, déficits, n/d e layout da superfície nova" +
    (ok ? "" : " [" + detail.slice(0, 8).join(" · ") + "]"));
  D.push.apply(D, detail);
  return { observed, detail: D };
}

async function acc6(page) {
  const detail = [];
  for (const fx of [FX.P50_F2, FX.P50_F6]) {
    await applyFixture(page, fx);
    const obs = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("#app .opts .opt"));
      const sel = Array.from(document.querySelectorAll("#p50-shell [data-p50=\"q\"]"))
        .map(li => ({ qid: li.getAttribute("data-qid"), ans: li.getAttribute("data-p50-ans") }));
      return {
        screen: document.body.dataset.uxscreen,
        shell: !!document.getElementById("p50-shell"),
        sel: sel,
        group: (() => { const g = document.querySelector("#app .opts[data-p50=\"answers\"]");
          return g ? g.getAttribute("role") : null; })(),
        cards: cards.map(b => ({
          value: b.getAttribute("data-p50-value"),
          pressed: b.getAttribute("aria-pressed"),
          p50sel: b.getAttribute("data-p50-selected"),
          name: (b.getAttribute("aria-label") || b.textContent || "").trim().length,
          focusable: b.tabIndex >= 0 || b.tagName === "BUTTON"
        }))
      };
    });
    if (obs.screen !== "question") { detail.push(fx.id + ": tela " + obs.screen); continue; }
    if (!obs.shell) { detail.push(fx.id + ": #p50-shell ausente"); continue; }
    if (obs.group !== "group") { detail.push(fx.id + ": grupo de resposta sem role=group"); continue; }
    if (obs.cards.length !== 5) { detail.push(fx.id + ": " + obs.cards.length + " cards"); continue; }

    const canonicalAnswer = fx.vec[fx.focusQuestion];
    const want = canonicalAnswer === null ? null : String(canonicalAnswer);
    obs.cards.forEach(c => {
      const shouldBeSelected = want !== null && c.value === want;
      if ((c.pressed === "true") !== shouldBeSelected)
        detail.push(fx.id + ": aria-pressed=" + c.pressed + " em value=" + c.value);
      if ((c.p50sel === "true") !== shouldBeSelected)
        detail.push(fx.id + ": data-p50-selected=" + c.p50sel + " em value=" + c.value);
      if (!c.name) detail.push(fx.id + ": card sem nome acessível (value=" + c.value + ")");
      if (!c.focusable) detail.push(fx.id + ": card não focalizável (value=" + c.value + ")");
    });
    /* o estado programático da seleção é coerente, em TODAS as 15 perguntas,
       com o estado canônico refletido na superfície nova (sidebar) */
    const expected = FX.P50_QIDS.map((qid, i) => ({
      qid, state: fx.vec[i] === null ? "unset" : (fx.vec[i] === "NA" ? "na" : "confirmed")
    }));
    const mismatched = expected.filter(e => {
      const got = obs.sel.find(s => s.qid === e.qid);
      return !got || got.ans !== e.state;
    });
    if (mismatched.length)
      detail.push(fx.id + ": sidebar dessincronizada em " + mismatched.map(m => m.qid).join(","));

    /* evidência visual mínima da microfase, na MESMA execução Chromium */
    await shot(page, "P50-ACC6-" + fx.id + "-1440.png");
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-ACC6", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC6 — estado programático da seleção coerente com o estado canônico" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
}

/* ============================================================================
   P50-SESUX1B · Rendered persistence claim (Chromium)
   Texto VISÍVEL e texto acessível/computado do componente de status de sessão
   devem corresponder ao estado real, nas seis fixtures obrigatórias da §25.5.
   Inclui texto composto por nós DOM separados (l1 + l2 + notas).
   ========================================================================== */
const SESUX_BANNED = [
  "saved", "auto-saved", "autosave", "salvo automaticamente", "salvamento autom",
  "pode fechar a aba", "feche a aba com seguran", "retome automaticamente",
  "retomada autom", "persistência autom", "persistencia autom"
];
const SESUX_CANON = {
  "default":  ["Sessão não salva automaticamente.", "Exporte o arquivo da sessão para continuar depois."],
  "exported": ["Sessão exportada.", "Guarde o arquivo JSON para retomar posteriormente."],
  "imported": ["Sessão carregada do arquivo.", "Novas alterações não são salvas automaticamente."]
};

async function sesux1b(page) {
  const detail = [];
  const observed = [];

  const readStatus = () => page.evaluate(() => {
    const box = document.getElementById("p50-session-status");
    if (!box) return null;
    const g = sel => { const e = box.querySelector(sel); return e ? (e.textContent || "").trim() : null; };
    return {
      state: box.getAttribute("data-p50-ses-state"),
      dirty: box.getAttribute("data-p50-ses-dirty"),
      role: box.getAttribute("role"),
      l1: g("[data-p50=\"ses-line1\"]"),
      l2: g("[data-p50=\"ses-line2\"]"),
      failure: g("[data-p50=\"ses-failure\"]"),
      dirtyNote: g("[data-p50=\"ses-dirty\"]"),
      ariaLabel: box.getAttribute("aria-label"),
      visibleText: (box.innerText || box.textContent || "").replace(/\s+/g, " ").trim(),
      /* Numa live region role=status o texto ANUNCIADO é o conteúdo. Um
         aria-label aqui suprimiria dirty/falha (B-502-2), logo exigimos a
         ausência da sobrescrita e usamos o conteúdo como texto acessível. */
      accessibleText: (box.textContent || "").replace(/\s+/g, " ").trim()
    };
  });

  const check = (name, st, expectState, expectDirty) => {
    if (!st) { detail.push(name + ": componente de status ausente"); return; }
    observed.push({ fixture: name, state: st.state, dirty: st.dirty,
      visibleText: st.visibleText, accessibleText: st.accessibleText });
    if (st.state !== expectState) detail.push(name + ": estado=" + st.state + " (esperado " + expectState + ")");
    if (expectDirty !== null && st.dirty !== expectDirty)
      detail.push(name + ": dirty=" + st.dirty + " (esperado " + expectDirty + ")");
    if (st.role !== "status") detail.push(name + ": role=" + st.role);
    const canon = SESUX_CANON[st.state === "export-failed" ? "default" : st.state];
    if (!canon) { detail.push(name + ": estado desconhecido"); return; }
    if (st.l1 !== canon[0] || st.l2 !== canon[1])
      detail.push(name + ": par de mensagens fora do contrato: " + JSON.stringify([st.l1, st.l2]));
    /* texto visível E acessível: nenhum claim proibido, inclusive composto */
    const hay = (st.visibleText + " " + st.accessibleText).toLowerCase();
    SESUX_BANNED.forEach(b => { if (hay.includes(b)) detail.push(name + ": claim proibido \"" + b + "\""); });
    if (st.ariaLabel !== null)
      detail.push(name + ": aria-label sobrescreve o conteúdo da live region");
    if (!st.accessibleText.includes(canon[0]) || !st.accessibleText.includes(canon[1]))
      detail.push(name + ": texto acessível não corresponde ao visível");
    /* B-502-2: dirty e falha são estados MATERIAIS e devem constar do texto
       visível E do texto acessível quando exibidos. */
    const DIRTY_TXT = "Há alterações ainda não exportadas.";
    const FAIL_TXT = "A última exportação não foi concluída";
    if (st.dirty === "true") {
      if (!st.visibleText.includes(DIRTY_TXT)) detail.push(name + ": dirty ausente do texto visível");
      if (!st.accessibleText.includes(DIRTY_TXT)) detail.push(name + ": dirty ausente do texto acessível");
    } else if (st.visibleText.includes(DIRTY_TXT)) {
      detail.push(name + ": mensagem stale de alterações pendentes");
    }
    if (st.state === "export-failed") {
      if (!st.visibleText.includes(FAIL_TXT)) detail.push(name + ": falha ausente do texto visível");
      if (!st.accessibleText.includes(FAIL_TXT)) detail.push(name + ": falha ausente do texto acessível");
    } else if (st.visibleText.includes(FAIL_TXT)) {
      detail.push(name + ": mensagem stale de falha de exportação");
    }
    /* nenhuma mensagem stale de outro estado */
    Object.keys(SESUX_CANON).forEach(kk => {
      if (kk === (st.state === "export-failed" ? "default" : st.state)) return;
      if (st.visibleText.includes(SESUX_CANON[kk][0]) && SESUX_CANON[kk][0] !== canon[0])
        detail.push(name + ": wording stale de \"" + kk + "\"");
    });
  };

  /* Volta à pergunta pelo controle congelado e digita evidência pelo evento real. */
  const realNoteEdit = text => page.evaluate(t => {
    document.getElementById("review").click();
    document.querySelector("#app [data-p50=\"evidence-open\"]").click();
    const ta = document.getElementById("notetxt");
    ta.value = t;
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }, text);

  /* 1 · fresh assessment — estado de carga, antes de qualquer interação */
  await page.goto(HTML_URL);
  check("fresh", await readStatus(), "default", "false");

  /* 2 · modified but not exported */
  await applyFixture(page, FX.P50_F2);
  await page.evaluate(id => { window.__DEV.setAnswerById(id, 3); window.__P50.decorate(); }, FX.P50_QIDS[5]);
  check("modified-not-exported", await readStatus(), "default", "true");

  /* 3 · export success (caminho real: botão congelado -> modal -> confirmar) */
  await page.evaluate(() => {
    if (typeof URL.createObjectURL !== "function") { URL.createObjectURL = () => "blob:p50"; URL.revokeObjectURL = () => {}; }
    window.__DEV.showResults();
    document.getElementById("ses-export").click();
    document.getElementById("ux-modal-ok").click();
  });
  check("export-success", await readStatus(), "exported", "false");
  /* M-502-3: o componente precisa aparecer MATERIALMENTE na imagem —
     screenshot do próprio elemento, não do topo da página. */
  await shotElement(page, "#p50-session-status", "P50-5.0.2-session-exported-1440.png");

  /* 4 · post-export modification -> volta ao padrão, honestamente */
  await page.evaluate(id => { window.__DEV.setAnswerById(id, 1); window.__uxDecor(document.getElementById("app")); },
    FX.P50_QIDS[7]);
  check("post-export-modification", await readStatus(), "default", "true");

  /* 5 · import success */
  await page.evaluate(() => {
    const doc = window.__DEV.buildSessionDocument("sesux1b");
    const compat = window.__DEV.sessionCompatibility(doc);
    window.__DEV.showImportPreview(doc, compat, null);
    document.getElementById("ux-modal-ok").click();
  });
  check("import-success", await readStatus(), "imported", "false");

  /* 5b · POST-IMPORT MODIFICATION — fixture normativa da §25.5.
     Usa o evento REAL do campo de evidência, não alteração por API. */
  await realNoteEdit("evidência digitada após o import");
  const pim = await readStatus();
  check("post-import-modification", pim, "default", "true");
  /* evidência do estado pós-edição: default + dirty=true + alterações pendentes */
  await shotElement(page, "#p50-session-status", "P50-5.0.2-session-dirty-after-edit-1440.png");
  if (pim && pim.visibleText.includes(SESUX_CANON["imported"][0]))
    detail.push("post-import-modification: wording de import permaneceu");
  /* o componente não muta estado canônico: a nota veio do handler congelado */
  const ownerOk = await page.evaluate(() =>
    Object.values(window.__DEV.captureCanonicalInputs().assessment.notes)
      .some(v => String(v).includes("evidência digitada após o import")));
  if (!ownerOk) detail.push("post-import-modification: nota não chegou ao owner canônico");

  /* 6 · export failure (documento acima do limite -> nenhum arquivo gerado) */
  await applyFixture(page, FX.P50_F2);
  await page.evaluate(() => {
    if (typeof URL.createObjectURL !== "function") { URL.createObjectURL = () => "blob:p50"; URL.revokeObjectURL = () => {}; }
    window.__DEV.setNote(0, "x".repeat(1024 * 1024 + 64));      /* estoura o limite de 1 MiB */
    window.__DEV.showResults();
    document.getElementById("ses-export").click();
    document.getElementById("ux-modal-ok").click();
  });
  const failSt = await readStatus();
  check("export-failure", failSt, "export-failed", null);
  if (failSt && !failSt.failure) detail.push("export-failure: nota de falha ausente");
  if (failSt && failSt.l1 !== SESUX_CANON["default"][0])
    detail.push("export-failure: exibiu wording de export bem-sucedido");

  const ok = detail.length === 0;
  results.push({ id: "P50-SESUX1B", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-SESUX1B — status de sessão renderizado corresponde ao estado real (matriz normativa completa + pós-export)" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return observed;
}

/* ============================================================================
   P50-PR1 — Legacy print surface preserved under insufficient gate
   B-AUD-503-2 · a neutralização da superfície legada é decisão de TELA. O
   print legado NÃO monta `#v32-print-report`: `preparePrint()` devolve
   `{legacy:true}`, esvazia o contêiner e NÃO adiciona `v32-print-mode` — logo
   `.wrap`/`#app` é a superfície impressa. Se `.p50-legacy-gone` /
   `.p50-legacy-veiled` valessem no print, os cinco valores de domínio, os
   cinco `.conf`, os cinco fills, o radar e a legenda sumiriam do papel e a
   Phase 5 teria criado semântica de impressão que não lhe é autorizada.

   Guard ADICIONAL e ESTREITO. NÃO encerra nem redefine P50-VIS10, que
   permanece sendo a regressão congelada integral prevista na REV B.

   Oráculo DUPLO, ambos independentes da implementação da Camada 5:
     (A) baseline de ENTRADA da 5.0.3 (SHA 5d1a301e…), materializado do git e
         medido sob a MESMA fixture e a MESMA mídia — comparação seletor a
         seletor de presença, texto e visibilidade;
     (B) invariante da Camada 1 (`__DEV.legacySnapshot()`), capturado ANTES de
         qualquer leitura da decoração: os scores/conf que o renderer
         congelado produziu têm de continuar no papel, com o mesmo texto.
   (A) é best-effort quanto à DISPONIBILIDADE (repositório sem git), nunca
   quanto ao VEREDITO: indisponível é declarado; divergente é FAIL. (B) é
   sempre exigido, de modo que nenhum caminho leva a PASS vacuoso.
   ========================================================================== */
/* A baseline de ENTRADA é identificada por DUAS constantes imutáveis: o commit
   de entrada da 5.0.3 e o SHA-256 funcional do HTML daquele commit. Resolver por
   `HEAD:` era correto ENQUANTO o trabalho vivia na branch da microfase, mas
   passou a apontar para o próprio candidato assim que a 5.0.3 foi integrada em
   `main` — o guard, corretamente, recusou comparar o candidato consigo mesmo e
   FALHOU. A referência é agora ancorada no commit, independente de branch, de
   `HEAD`, de pai corrente e de merge-base. */
const PR1_BASELINE_COMMIT = "fe4a536a508ed592bf62d1545a90e399036bb43d";
const PR1_BASELINE_SHA = "5d1a301e472dd1453f4056c6919ea818e6fd7768d67158321deaae9ad0c926cd";

function pr1Baseline() {
  try {
    const { execFileSync } = require("child_process");
    const crypto = require("crypto"), os = require("os");
    const ref = PR1_BASELINE_COMMIT + ":quickscan_secops_soccmm_v3_2_dev.html";
    const buf = execFileSync("git", ["show", ref], { cwd: __dirname, maxBuffer: 1 << 28 });
    const got = crypto.createHash("sha256").update(buf).digest("hex");
    if (got !== PR1_BASELINE_SHA)
      return { ok: false, why: "baseline de entrada do commit " + PR1_BASELINE_COMMIT.slice(0, 16) +
        " com SHA " + got.slice(0, 16) + " != " + PR1_BASELINE_SHA.slice(0, 16) + " (esperado)" };
    const f = path.join(os.tmpdir(), "p50-pr1-baseline-" + PR1_BASELINE_SHA.slice(0, 12) + ".html");
    fs.writeFileSync(f, buf);
    return { ok: true, file: f };
  } catch (e) {
    return { ok: false, why: "baseline de entrada indisponível no commit " +
      PR1_BASELINE_COMMIT.slice(0, 16) + ": " + String(e.message).split("\n")[0] };
  }
}

/* Mede a superfície legada com visibilidade REAL (computed style + caixa),
   nunca por presença de atributo, e devolve diagnóstico por seletor. */
function pr1Measure(page) {
  return page.evaluate(() => {
    const t = e => (e ? (e.textContent || "").replace(/\s+/g, " ").trim() : null);
    const seen = e => {
      if (!e) return false;
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const diag = (sel, e) => {
      if (!e) return { selector: sel, present: false };
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      return { selector: sel, present: true, display: cs.display, visibility: cs.visibility,
               opacity: cs.opacity, w: Math.round(r.width), h: Math.round(r.height) };
    };
    const rows = Array.from(document.querySelectorAll("#app .grid2 .panel .dom"));
    const fills = Array.from(document.querySelectorAll("#app .ruler .fill"));
    const radar = document.querySelector("#app .radar-box svg");
    const legend = document.querySelector("#app .scale-legend");
    const pr = document.getElementById("v32-print-report");
    const subs = Array.from(document.querySelectorAll("#app .p50-legacy-note"));
    return {
      /* superfície impressa no modo legado */
      wrapPresent: !!document.querySelector(".wrap"), wrapVisible: seen(document.querySelector(".wrap")),
      appPresent: !!document.getElementById("app"), appVisible: seen(document.getElementById("app")),
      printReportEmpty: !pr || (pr.innerHTML || "") === "",
      printModeClass: /\bv32-print-mode\b/.test(document.body.className),
      printBlockedClass: /\bv32-print-blocked\b/.test(document.body.className),
      /* os cinco de cada coisa */
      rows: rows.length,
      values: rows.map(r => t(r.querySelector(".lbl > span"))),
      valuesVisible: rows.map(r => seen(r.querySelector(".lbl > span"))),
      confs: rows.map(r => t(r.querySelector(".conf"))),
      confsVisible: rows.map(r => seen(r.querySelector(".conf"))),
      fills: fills.length, fillsVisible: fills.filter(seen).length,
      radarPresent: !!radar, radarVisible: seen(radar),
      legendPresent: !!legend, legendVisible: seen(legend),
      /* substituto P50: presente no DOM, mas sem semântica NOVA de impressão */
      substitutes: subs.length, substitutesVisible: subs.filter(seen).length,
      p50ShellVisible: seen(document.getElementById("p50-shell")),
      p50SuffVisible: seen(document.getElementById("p50-suff")),
      p50ResultsVisible: seen(document.getElementById("p50-results")),
      /* diagnóstico por seletor e propriedade (exigido em qualquer FAIL) */
      diag: [diag(".wrap", document.querySelector(".wrap")), diag("#app", document.getElementById("app")),
             diag("#app .radar-box svg", radar), diag("#app .scale-legend", legend)]
        .concat(rows.map((r, i) => diag(".dom[" + i + "] .lbl > span", r.querySelector(".lbl > span"))))
        .concat(rows.map((r, i) => diag(".dom[" + i + "] .conf", r.querySelector(".conf"))))
        .concat(fills.map((f, i) => diag(".ruler .fill[" + i + "]", f)))
    };
  });
}

/* ============================================================================
   B-AUD-FIN-503-1 · ORACLE DE APRESENTAÇÃO CONTÍNUA.

   O guard anterior decidia visibilidade por booleano (`display:none`,
   `visibility:hidden`, `opacity === 0`) e por texto. Uma regra de neutralização
   desconfinada que apenas ATENUA — `opacity:.45` — ou que troca o contexto de
   posicionamento — `position:relative` — passava intacta para o papel legado
   sem que nada falhasse. Aqui a comparação com a baseline de ENTRADA passa a
   ser por ESTILO COMPUTADO, propriedade a propriedade, seletor a seletor,
   índice a índice, com cardinalidade conferida.

   `opacity` NUNCA é reduzida a `=== 0`: qualquer divergência contra a baseline
   reprova, inclusive `1 → 0.45`.
   ========================================================================== */
const PR1_STYLE_CONTRACT = "P50-PR1/continuous-presentation-v1";
const PR1_STYLE_PROPS = ["display", "visibility", "opacity", "position",
  "filter", "transform", "color", "backgroundColor"];
const PR1_STYLE_SELECTORS = [
  { key: ".ruler", sel: "#app .grid2 .panel .dom .ruler", expect: 5 },
  { key: ".fill", sel: "#app .grid2 .panel .dom .ruler .fill", expect: 5 },
  { key: ".conf", sel: "#app .grid2 .panel .dom .conf", expect: 5 },
  { key: ".lbl > span", sel: "#app .grid2 .panel .dom .lbl > span", expect: 5 },
  { key: ".radar-box", sel: "#app .radar-box", expect: 1 },
  { key: ".scale-legend", sel: "#app .scale-legend", expect: 1 }
];

/* A Camada 1 aplica `.screen{animation:fade .35s ease}` (congelado). Medir o
   estilo computado durante a animação devolve um `transform` intermediário e
   torna a comparação NÃO determinística. Espera-se o repouso — que é também o
   estado que o papel recebe. Guarda de tempo para nunca pendurar a suíte. */
async function pr1Settle(pg) {
  await pg.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().map(a => a.finished.catch(() => null))),
    new Promise(r => setTimeout(r, 2000))
  ]));
  await pg.waitForTimeout(120);
}

function pr1Styles(page, props, selectors) {
  return page.evaluate(([props, selectors]) => {
    const out = {};
    selectors.forEach(({ key, sel }) => {
      const nodes = Array.from(document.querySelectorAll(sel));
      out[key] = {
        count: nodes.length,
        nodes: nodes.map(e => {
          const cs = getComputedStyle(e);
          const st = { tag: e.tagName.toLowerCase(),
            cls: (typeof e.className === "string" ? e.className : (e.className && e.className.baseVal) || "")
              .split(/\s+/).filter(x => x && !/^p50-/.test(x)).sort().join(" ") };
          props.forEach(p => { st[p] = cs[p]; });
          return st;
        })
      };
    });
    return out;
  }, [props, selectors]);
}

/* Compara candidato × baseline e devolve motivos NOMEADOS: seletor, índice,
   propriedade, valor baseline e valor candidato. */
function pr1DiffStyles(cand, base, state) {
  const out = [];
  PR1_STYLE_SELECTORS.forEach(({ key, expect }) => {
    const c = cand[key], b = base[key];
    if (b.count !== expect)
      out.push(state + " · baseline com cardinalidade inesperada em " + key + ": " + b.count + " != " + expect);
    if (c.count !== b.count) {
      out.push(state + " · cardinalidade divergente em " + key + ": baseline " + b.count + ", candidato " + c.count);
      return;
    }
    for (let i = 0; i < b.count; i++) {
      const cn = c.nodes[i], bn = b.nodes[i];
      if (cn.tag !== bn.tag || cn.cls !== bn.cls)
        out.push(state + " · identidade do nó divergente em " + key + "[" + i + "]: baseline <" +
          bn.tag + " class=\"" + bn.cls + "\">, candidato <" + cn.tag + " class=\"" + cn.cls + "\">");
      PR1_STYLE_PROPS.forEach(p => {
        if (cn[p] !== bn[p])
          out.push(state + " · estilo divergente em " + key + "[" + i + "] propriedade " + p +
            ": baseline " + JSON.stringify(bn[p]) + ", candidato " + JSON.stringify(cn[p]));
      });
    }
  });
  return out;
}

async function pr1Page(browser, url, pageErrors, tag, vec) {
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push(tag + ": " + String(e.message)));
  await pg.goto(url);
  await pg.evaluate(([qids, v]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, v[i]));
    window.__DEV.showResults();
  }, [FX.P50_QIDS, vec || FX.P50_F3.vec]);
  await pr1Settle(pg);
  return pg;
}

/* Um estado completo do oracle contínuo: candidato e baseline sob a MESMA
   fixture, ambos em mídia `print`, ambos em repouso de animação. */
async function pr1StyleState(browser, baseFile, pageErrors, state, vec) {
  const cp = await pr1Page(browser, HTML_URL, pageErrors, "P50-PR1/" + state, vec);
  const bp = await pr1Page(browser, "file://" + baseFile, pageErrors, "P50-PR1/" + state + "/baseline", vec);
  try {
    await cp.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await bp.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await cp.emulateMedia({ media: "print" });
    await bp.emulateMedia({ media: "print" });
    await pr1Settle(cp); await pr1Settle(bp);
    const cs = await pr1Styles(cp, PR1_STYLE_PROPS, PR1_STYLE_SELECTORS);
    const bs = await pr1Styles(bp, PR1_STYLE_PROPS, PR1_STYLE_SELECTORS);
    const gate = await cp.evaluate(() => {
      const e = document.getElementById("p50-results");
      return e ? e.getAttribute("data-p50-gate") : null;
    });
    return { gate, diffs: pr1DiffStyles(cs, bs, state), candidate: cs, baseline: bs };
  } finally { await cp.close(); await bp.close(); }
}

async function pr1(browser, pageErrors) {
  const detail = [];
  const observed = {};
  const page = await pr1Page(browser, HTML_URL, pageErrors, "P50-PR1");
  try {
    /* 1/2/3 · fixture insuficiente P50-F3, modo legado REAL, gate fechado.
       O veredito canônico vem da Camada 1, não da superfície nova. */
    const pre = await page.evaluate(() => ({
      legacy: window.__DEV.V32.isLegacyModeV32(),
      gate: (document.getElementById("p50-results") || {}).getAttribute
        ? document.getElementById("p50-results").getAttribute("data-p50-gate") : null,
      snapshot: JSON.parse(window.__DEV.legacySnapshot())
    }));
    observed.precondition = { legacy: pre.legacy, gate: pre.gate, canonicalSuff: pre.snapshot.suff };
    if (pre.legacy !== true) detail.push("pré-condição: modo legado real ausente (isLegacyModeV32=" + pre.legacy + ")");
    if (pre.snapshot.suff !== false) detail.push("pré-condição: P50-F3 não é insuficiente para a Camada 1");
    if (pre.gate !== "blocked") detail.push("pré-condição: gate da UI = " + pre.gate + " (esperado blocked)");

    /* (B) invariante independente: o que o renderer CONGELADO produziu. */
    const scored = pre.snapshot.domains.filter(x => x.score !== null);
    observed.canonicalDomains = pre.snapshot.domains;
    if (scored.length !== 5) detail.push("pré-condição: Camada 1 produziu " + scored.length + " scores (esperado 5)");

    /* 4 · TELA: a neutralização continua ativa e o substituto honesto aparece. */
    await page.emulateMedia({ media: "screen" });
    const scr = await pr1Measure(page);
    observed.screen = scr;
    if (scr.valuesVisible.some(Boolean)) detail.push("tela: valor de domínio legado visível sob gate fechado");
    if (scr.confsVisible.some(Boolean)) detail.push("tela: .conf legado visível sob gate fechado");
    if (scr.fillsVisible !== 0) detail.push("tela: " + scr.fillsVisible + " fill(s) visível(is) sob gate fechado");
    if (scr.radarVisible) detail.push("tela: radar visível sob gate fechado");
    if (scr.legendVisible) detail.push("tela: legenda visível sob gate fechado");
    if (scr.substitutesVisible < 1) detail.push("tela: substituto honesto P50 não visível");

    /* 5 · caminho REAL de print: o listener `beforeprint` registrado pela
       Camada 1 — não uma chamada direta a preparePrint(). */
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));

    /* 6 · mídia print REAL no Chromium. */
    await page.emulateMedia({ media: "print" });
    const prn = await pr1Measure(page);
    observed.print = prn;

    /* 7 · `.wrap`/`#app` são a superfície impressa no modo legado. */
    if (!prn.printReportEmpty) detail.push("print: #v32-print-report não está vazio no modo legado");
    if (prn.printModeClass) detail.push("print: body recebeu v32-print-mode no modo legado");
    if (prn.printBlockedClass) detail.push("print: body recebeu v32-print-blocked");
    if (!prn.wrapVisible) detail.push("print: .wrap não é a superfície impressa (não visível)");
    if (!prn.appVisible) detail.push("print: #app não é a superfície impressa (não visível)");

    /* 8 · cinco valores, cinco .conf, cinco fills, radar e legenda no papel. */
    if (prn.rows !== 5) detail.push("print: " + prn.rows + " linhas de domínio (esperado 5)");
    prn.valuesVisible.forEach((v, i) => { if (!v) detail.push("print: valor do domínio " + i + " ausente do papel"); });
    prn.confsVisible.forEach((v, i) => { if (!v) detail.push("print: .conf do domínio " + i + " ausente do papel"); });
    if (prn.fills !== 5) detail.push("print: " + prn.fills + " fills presentes (esperado 5)");
    if (prn.fillsVisible !== 5) detail.push("print: " + prn.fillsVisible + "/5 fills visíveis no papel");
    if (!prn.radarVisible) detail.push("print: radar ausente do papel");
    if (!prn.legendVisible) detail.push("print: legenda ausente do papel");
    /* nenhum espaço vazio/mutilado: o texto impresso é o do renderer congelado */
    prn.values.forEach((v, i) => {
      if (!v) detail.push("print: valor do domínio " + i + " vazio (espaço mutilado)");
    });
    /* (B) o texto impresso corresponde ao score canônico da Camada 1 */
    pre.snapshot.domains.forEach((dd, i) => {
      if (dd.score === null) return;
      /* o renderer congelado imprime "<score> — <estágio>"; o oráculo exige o
         score canônico da Camada 1 como PREFIXO, sem presumir o rótulo. */
      const want = dd.score.toFixed(1);
      const got = prn.values[i] || "";
      if (got.indexOf(want) !== 0)
        detail.push("print: domínio " + i + " imprime '" + got + "' sem o score canônico " + want);
    });

    /* 10 · o substituto P50 não fabrica semântica nova de impressão. */
    if (prn.substitutesVisible !== 0)
      detail.push("print: " + prn.substitutesVisible + " substituto(s) P50 visível(is) — semântica nova de impressão");
    if (prn.p50ShellVisible) detail.push("print: #p50-shell visível");
    if (prn.p50SuffVisible) detail.push("print: #p50-suff visível");
    if (prn.p50ResultsVisible) detail.push("print: #p50-results visível");

    /* 9 · (A) comparação com o BASELINE DE ENTRADA, mesma fixture, mesma mídia. */
    const base = pr1Baseline();
    if (!base.ok) {
      observed.baseline = { compared: false, why: base.why };
      detail.push("baseline de entrada NÃO comparado (" + base.why + ") — oráculo (B) permanece exigido");
    } else {
      const bp = await pr1Page(browser, "file://" + base.file, pageErrors, "P50-PR1/baseline");
      try {
        await bp.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
        await bp.emulateMedia({ media: "print" });
        const bm = await pr1Measure(bp);
        observed.baseline = { compared: true, sha: PR1_BASELINE_SHA, print: bm };
        const cmp = (k, a, b) => {
          const sa = JSON.stringify(a), sb = JSON.stringify(b);
          if (sa !== sb) detail.push("print difere do baseline de entrada em " + k + ": " + sa + " != " + sb);
        };
        cmp("rows", prn.rows, bm.rows);
        cmp("values", prn.values, bm.values);
        cmp("valuesVisible", prn.valuesVisible, bm.valuesVisible);
        cmp("confs", prn.confs, bm.confs);
        cmp("confsVisible", prn.confsVisible, bm.confsVisible);
        cmp("fills", prn.fills, bm.fills);
        cmp("fillsVisible", prn.fillsVisible, bm.fillsVisible);
        cmp("radarVisible", prn.radarVisible, bm.radarVisible);
        cmp("legendVisible", prn.legendVisible, bm.legendVisible);
        cmp("wrapVisible", prn.wrapVisible, bm.wrapVisible);
        cmp("appVisible", prn.appVisible, bm.appVisible);
        cmp("printReportEmpty", prn.printReportEmpty, bm.printReportEmpty);
      } finally { await bp.close(); }
    }

    /* 11 · volta à mídia screen: a neutralização volta a valer. */
    await page.emulateMedia({ media: "screen" });
    const back = await pr1Measure(page);
    observed.screenAfter = back;
    if (back.valuesVisible.some(Boolean)) detail.push("retorno à tela: valor de domínio legado voltou a aparecer");
    if (back.fillsVisible !== 0) detail.push("retorno à tela: " + back.fillsVisible + " fill(s) visível(is)");
    if (back.radarVisible) detail.push("retorno à tela: radar visível");
    if (back.legendVisible) detail.push("retorno à tela: legenda visível");
    if (back.substitutesVisible < 1) detail.push("retorno à tela: substituto honesto P50 desapareceu");

    /* 12 · B-AUD-FIN-503-1 · a neutralização de TELA continua ativa e contínua.
       Corrigir o print não pode apagar a apresentação honesta da tela: as
       réguas seguem atenuadas e a `.radar-box` segue como contexto de
       posicionamento da nota — ambas SOMENTE na tela. */
    await pr1Settle(page);
    const scrStyles = await pr1Styles(page, PR1_STYLE_PROPS, PR1_STYLE_SELECTORS);
    const scrExtra = await page.evaluate(() => {
      const rb = document.querySelector("#app .radar-box.p50-legacy-off");
      const note = document.querySelector("#app .radar-box > .p50-legacy-note");
      return {
        radarBoxNeutralized: !!rb,
        radarBoxPosition: rb ? getComputedStyle(rb).position : null,
        radarNoteText: note ? (note.textContent || "").trim() : null,
        radarNotePosition: note ? getComputedStyle(note).position : null,
        ariaHiddenNeutralized: document.querySelectorAll("#app [data-p50-legacy=\"hidden\"][aria-hidden=\"true\"]").length
      };
    });
    observed.screenPresentation = {
      rulerOpacity: scrStyles[".ruler"].nodes.map(n => n.opacity),
      radarBox: scrExtra
    };
    scrStyles[".ruler"].nodes.forEach((n, i) => {
      if (n.opacity !== "0.45")
        detail.push("tela: .ruler[" + i + "] com opacity " + JSON.stringify(n.opacity) +
          " — a atenuação honesta de tela foi perdida (esperado \"0.45\")");
    });
    if (!scrExtra.radarBoxNeutralized)
      detail.push("tela: .radar-box.p50-legacy-off ausente sob gate fechado");
    if (scrExtra.radarBoxPosition !== "relative")
      detail.push("tela: .radar-box.p50-legacy-off com position " + JSON.stringify(scrExtra.radarBoxPosition) +
        " — a nota do radar perde o contexto de posicionamento (esperado \"relative\")");
    if (scrExtra.radarNotePosition !== "absolute")
      detail.push("tela: nota do radar com position " + JSON.stringify(scrExtra.radarNotePosition));
    if (!scrExtra.ariaHiddenNeutralized)
      detail.push("tela: nenhum nó congelado permanece fora da árvore acessível sob gate fechado");
  } finally { await page.close(); }

  /* ==========================================================================
     13 · B-AUD-FIN-503-1 · ORACLE DE APRESENTAÇÃO CONTÍNUA contra a baseline.
     Dois estados: gate BLOQUEADO (onde as classes/atributos de neutralização
     existem) e gate LIBERADO (controle positivo de ausência de divergência).
     ========================================================================== */
  {
    const base = pr1Baseline();
    if (!base.ok) {
      observed.continuousPresentation = { contract: PR1_STYLE_CONTRACT, compared: false, why: base.why };
      detail.push("oracle de apresentação contínua NÃO executado (" + base.why + ")");
    } else {
      const states = [
        { state: "gate-bloqueado", vec: FX.P50_F3.vec, wantGate: "blocked" },
        { state: "gate-liberado", vec: FX.P50_F5.vec, wantGate: "released" }
      ];
      const rec = { contract: PR1_STYLE_CONTRACT, compared: true, baselineSha: PR1_BASELINE_SHA,
        comparedAgainst: "baseline de ENTRADA da 5.0.3 (5d1a301e…), mesma fixture, mídia print",
        properties: PR1_STYLE_PROPS,
        selectors: PR1_STYLE_SELECTORS.map(s => ({ key: s.key, selector: s.sel, expect: s.expect })),
        states: [] };
      for (const st of states) {
        const r = await pr1StyleState(browser, base.file, pageErrors, st.state, st.vec);
        if (r.gate !== st.wantGate)
          detail.push(st.state + " · pré-condição: gate da UI = " + r.gate + " (esperado " + st.wantGate + ")");
        r.diffs.forEach(d => detail.push(d));
        rec.states.push({ state: st.state, fixture: st.state === "gate-bloqueado" ? "P50-F3" : "P50-F5",
          gate: r.gate, divergences: r.diffs, candidate: r.candidate, baseline: r.baseline });
      }
      observed.continuousPresentation = rec;
    }
  }

  /* 14 · diagnóstico por seletor e propriedade em qualquer FAIL. */
  const ok = detail.length === 0;
  if (!ok && observed.print && observed.print.diag) {
    observed.failureDiag = observed.print.diag.filter(d =>
      !d.present || d.display === "none" || d.visibility === "hidden" || d.w === 0 || d.h === 0);
  }
  results.push({ id: "P50-PR1", ok });
  console.log((ok ? "PASS" : "FAIL") +
    "  P50-PR1 — Legacy print surface preserved under insufficient gate (guard estreito; NÃO encerra P50-VIS10)" +
    (ok ? "" : " [" + detail.join(" · ") +
      (observed.failureDiag && observed.failureDiag.length
        ? " · diag: " + JSON.stringify(observed.failureDiag).slice(0, 400) : "") + "]"));
  return { ok, detail, observed };
}

/* ============================================================================
   MICROFASE 5.0.4 · TARGET & HEAT MAP VISUALIZATIONS
   Gates normativos P50-VIS7 · P50-VIS8 · P50-VIS9 · P50-ACC5.
   Todos medem a SUPERFÍCIE NOVA (#p50-results) em Chromium real; nenhum deles
   encerra P50-VIS10 nem redefine a autoridade congelada V9/T14 sobre
   `#ux-target`, que permanece intacta.
   ========================================================================== */

/* Aplica a fixture pelos OWNERS CANÔNICOS e alcança a tela de resultados.
   Presence via V32.TECH_LANDSCAPE; target via o setter canônico setTarget(),
   que recusa alvo inferior ao atual — a fixture não pode fabricar alvo. */
async function applyResults(page, fx) {
  await page.goto(HTML_URL);
  await page.evaluate(([qids, vec, notes, presence, targets]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    if (notes) Object.keys(notes).forEach(i => window.__DEV.setNote(Number(i), notes[i]));
    if (presence) Object.keys(presence).forEach(id => {
      const L = window.__DEV.V32.TECH_LANDSCAPE[id];
      if (!L) throw new Error("capability inexistente: " + id);
      L.presence = presence[id];
      if (presence[id] === "UNSET") L.declaredDriver = null;
    });
    if (targets) Object.keys(targets).forEach(qid => {
      if (window.__DEV.setTarget(qid, targets[qid]) !== true)
        throw new Error("setter canônico recusou alvo " + qid + "=" + targets[qid]);
    });
    window.__DEV.showResults();
  }, [FX.P50_QIDS, fx.vec, fx.notes || null, fx.presence || null, fx.targets || null]);
  await pr1Settle(page);
}

async function selectTab(page, id) {
  await page.evaluate(t => {
    const b = document.querySelector('#p50-results [data-p50="tab"][data-p50-tab="' + t + '"]');
    if (!b) throw new Error("tab ausente: " + t);
    b.click();
  }, id);
  await page.waitForTimeout(60);
}

/* Geometria dos labels — mesmo método do UG13: bounding boxes reais, com
   tolerância ZERO de sobreposição e de transbordo do container. */
function measureLabels(page, sel, containerSel) {
  return page.evaluate(([sel, containerSel]) => {
    const box = e => { const b = e.getBoundingClientRect();
      return { l: +b.left.toFixed(2), t: +b.top.toFixed(2), r: +b.right.toFixed(2), b: +b.bottom.toFixed(2),
               w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
    const nodes = Array.from(document.querySelectorAll(sel))
      .filter(e => e.getClientRects().length && (e.textContent || "").trim());
    const container = document.querySelector(containerSel);
    const cbox = container ? box(container) : null;
    const items = nodes.map(e => ({
      text: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      key: e.getAttribute("data-qid") || e.getAttribute("data-dom") || e.getAttribute("data-cap") || "",
      box: box(e),
      clipped: e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1
    }));
    const se = document.scrollingElement;
    return { items, container: cbox, documentScrollWidth: se.scrollWidth, innerWidth: window.innerWidth };
  }, [sel, containerSel]);
}

function overlaps(a, b) { return !(a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t); }

/* P50-VIS7 — labels dos charts novos: disjuntos, contidos e não clipados. */
async function vis7(browser, pageErrors) {
  const detail = [], observed = { viewports: [] };
  const CASES = [
    { fx: FX.P50_F9, id: "P50-F9", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F9, id: "P50-F9", vp: { width: 390, height: 844 } },
    { fx: FX.P50_F5, id: "P50-F5", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F5, id: "P50-F5", vp: { width: 390, height: 844 } }
  ];
  const TARGETS = [
    { tab: "heatmap", sel: '#p50-results [data-p50="hm-cell"] [data-p50="hm-q"]', box: '#p50-results [data-p50="heatmap"]' },
    { tab: "analise", sel: '#p50-results [data-p50="ct-row"] [data-p50="ct-name"]', box: '#p50-results [data-p50="current-target"]' }
  ];
  for (const c of CASES) {
    const pg = await browser.newPage({ viewport: c.vp });
    pg.on("pageerror", e => pageErrors.push("VIS7/" + c.id + "/" + c.vp.width + ": " + String(e.message)));
    try {
      await applyResults(pg, c.fx);
      for (const t of TARGETS) {
        await selectTab(pg, t.tab);
        const m = await measureLabels(pg, t.sel, t.box);
        const tag = c.id + "@" + c.vp.width + "/" + t.tab;
        observed.viewports.push({ case: tag, labels: m.items.length, container: m.container,
          documentScrollWidth: m.documentScrollWidth, innerWidth: m.innerWidth });
        if (!m.items.length) { detail.push(tag + ": nenhum label medido"); continue; }
        if (!m.container) { detail.push(tag + ": container ausente"); continue; }
        for (let i = 0; i < m.items.length; i++) {
          const A = m.items[i];
          if (A.clipped) detail.push(tag + ": label clipado por overflow — \"" + A.text + "\"");
          const cb = m.container;
          if (A.box.l < cb.l - 0.5 || A.box.r > cb.r + 0.5 || A.box.t < cb.t - 0.5 || A.box.b > cb.b + 0.5)
            detail.push(tag + ": label fora do container — \"" + A.text + "\" " + JSON.stringify(A.box) +
              " vs " + JSON.stringify(cb));
          for (let j = i + 1; j < m.items.length; j++) {
            if (overlaps(A.box, m.items[j].box))
              detail.push(tag + ": labels sobrepostos — \"" + A.text + "\" × \"" + m.items[j].text + "\"");
          }
        }
        if (m.documentScrollWidth > m.innerWidth)
          detail.push(tag + ": overflow horizontal do documento (" + m.documentScrollWidth + " > " + m.innerWidth + ")");
      }
    } catch (e) {
      detail.push(c.id + "@" + c.vp.width + ": " + String(e.message).split("\n")[0]);
    } finally { await pg.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-VIS7", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-VIS7 — labels dos charts novos disjuntos, contidos e não clipados" +
    (ok ? "" : " [" + detail.slice(0, 6).join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P50-VIS8 — encoding de UNSET/estados nas superfícies novas (§12.2 c/d). */
async function vis8(browser, pageErrors) {
  const detail = [], observed = {};
  const GREEN = "rgb(60, 177, 126)";                 /* --ftnt-green: encoding EXCLUSIVO do alvo */
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("VIS8: " + String(e.message)));
  try {
    /* (1) P50-F1 — assessment em branco: 15 células UNSET, zero preenchimento */
    await applyResults(pg, FX.P50_F1);
    await selectTab(pg, "heatmap");
    const blank = await pg.evaluate(() => {
      const cells = Array.from(document.querySelectorAll('#p50-results [data-p50="hm-cell"]'));
      return {
        total: cells.length,
        unset: cells.filter(c => c.getAttribute("data-p50-ans") === "unset").length,
        filled: cells.filter(c => c.getAttribute("data-p50-fill") !== "none").length,
        levels: cells.filter(c => c.hasAttribute("data-p50-level")).length,
        texts: Array.from(new Set(cells.map(c => (c.querySelector('[data-p50="hm-state"]') || {}).textContent)))
      };
    });
    observed.blank = blank;
    if (blank.total !== 15) detail.push("P50-F1: " + blank.total + " células (esperadas 15)");
    if (blank.unset !== 15) detail.push("P50-F1: " + blank.unset + "/15 células UNSET");
    if (blank.filled !== 0) detail.push("P50-F1: " + blank.filled + " célula(s) com preenchimento fabricado");
    if (blank.levels !== 0) detail.push("P50-F1: " + blank.levels + " célula(s) UNSET com nível");
    if (JSON.stringify(blank.texts) !== JSON.stringify(["n/d"]))
      detail.push("P50-F1: rótulos de UNSET " + JSON.stringify(blank.texts));

    /* (2) P50-F6 — encoding computado do UNSET: cor do PRÓPRIO domínio, esmaecida */
    await applyResults(pg, FX.P50_F6);
    await selectTab(pg, "heatmap");
    const enc = await pg.evaluate(() => {
      const cell = document.querySelector('#p50-results [data-p50="hm-cell"][data-qid="mandate"]');
      const row = document.querySelector('#p50-results [data-p50="hm-row"][data-dom="0"]');
      const cs = getComputedStyle(cell), tint = getComputedStyle(cell).getPropertyValue("--dom-accent").trim();
      const before = getComputedStyle(cell, "::before");
      return {
        ans: cell.getAttribute("data-p50-ans"),
        cue: cell.getAttribute("data-p50-cue"),
        fill: cell.getAttribute("data-p50-fill"),
        domAccentToken: tint,
        rowAccent: getComputedStyle(row).getPropertyValue("--dom-accent").trim(),
        borderStyle: cs.borderTopStyle,
        borderColor: cs.borderTopColor,
        beforeOpacity: before.opacity,
        beforeBackground: before.backgroundImage + " | " + before.backgroundColor,
        text: (cell.querySelector('[data-p50="hm-state"]') || {}).textContent,
        confirmedCell: (() => {
          const z = document.querySelector('#p50-results [data-p50="hm-cell"][data-qid="policies"]');
          const zb = getComputedStyle(z, "::before");
          return { ans: z.getAttribute("data-p50-ans"), fill: z.getAttribute("data-p50-fill"),
                   level: z.getAttribute("data-p50-level"), opacity: zb.opacity,
                   text: (z.querySelector('[data-p50="hm-state"]') || {}).textContent };
        })()
      };
    });
    observed.unsetEncoding = enc;
    if (enc.ans !== "unset") detail.push("P50-F6: célula mandate não é unset");
    if (!enc.cue) detail.push("P50-F6: UNSET sem pista não cromática");
    if (enc.fill !== "none") detail.push("P50-F6: UNSET com preenchimento");
    if (enc.borderStyle !== "dashed") detail.push("P50-F6: UNSET sem tracejado (border-style=" + enc.borderStyle + ")");
    if (enc.borderColor === GREEN) detail.push("P50-F6: UNSET usa o encoding exclusivo do alvo");
    if (!/^rgb/.test(enc.borderColor)) detail.push("P50-F6: borda de UNSET sem cor computada");
    if (Number(enc.beforeOpacity) >= 1 || Number(enc.beforeOpacity) <= 0)
      detail.push("P50-F6: UNSET não está esmaecido (opacity=" + enc.beforeOpacity + ")");
    if (enc.text !== "n/d") detail.push("P50-F6: UNSET sem rótulo n/d");
    if (enc.confirmedCell.fill !== "level") detail.push("P50-F6: nível 0 confirmado não foi plotado");
    if (enc.confirmedCell.level !== "0") detail.push("P50-F6: nível 0 perdeu o atributo de nível");

    /* (3) P50-F7 — UNSET × NONE no eixo de presence, visualmente distintos */
    await applyResults(pg, FX.P50_F7);
    await selectTab(pg, "heatmap");
    const pres = await pg.evaluate(() => {
      const g = id => {
        const c = document.querySelector('#p50-results [data-p50="presence-chip"][data-cap="' + id + '"]');
        if (!c) return null;
        const cs = getComputedStyle(c);
        return { presence: c.getAttribute("data-p50-presence"), cue: c.getAttribute("data-p50-cue"),
                 confirmed: c.getAttribute("data-p50-confirmed"),
                 borderStyle: cs.borderTopStyle, borderColor: cs.borderTopColor,
                 label: (c.querySelector('[data-p50="presence-state"]') || {}).textContent,
                 acc: c.getAttribute("aria-label") };
      };
      return { unset: g("knowledge-management"), none: g("security-analytics") };
    });
    observed.presence = pres;
    if (!pres.unset || !pres.none) detail.push("P50-F7: chips de presence ausentes");
    else {
      if (pres.unset.presence === pres.none.presence) detail.push("P50-F7: DOM de presence idêntico");
      if (pres.unset.label === pres.none.label) detail.push("P50-F7: rótulo visível idêntico");
      if (pres.unset.acc === pres.none.acc) detail.push("P50-F7: nome acessível idêntico");
      if (pres.unset.cue === pres.none.cue) detail.push("P50-F7: pista não cromática idêntica");
      if (pres.unset.borderStyle !== "dashed") detail.push("P50-F7: UNSET sem tracejado");
      if (pres.none.borderStyle === "dashed") detail.push("P50-F7: NONE tracejado como UNSET");
      if (pres.none.confirmed !== "true") detail.push("P50-F7: NONE não é ausência confirmada");
    }
    await shotViewport(pg, "P50-5.0.4-presence-F7-1440.png");
  } catch (e) { detail.push("exceção: " + String(e.message).split("\n")[0]); } finally { await pg.close(); }
  const ok = detail.length === 0;
  results.push({ id: "P50-VIS8", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-VIS8 — encoding de UNSET e dos três estados nas superfícies novas" +
    (ok ? "" : " [" + detail.slice(0, 6).join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P50-VIS9 — Current × Target: alvo só com override canônico; encoding
   tracejado + --ftnt-green exclusivo do alvo; current inalterado. */
async function vis9(browser, pageErrors) {
  const detail = [], observed = {};
  const GREEN = "rgb(60, 177, 126)";
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("VIS9: " + String(e.message)));
  try {
    /* (1) SEM override: nenhum alvo fabricado, nenhum delta contra nada */
    await applyResults(pg, FX.P50_F5);
    await selectTab(pg, "analise");
    const noOv = await pg.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'));
      return {
        overrides: Object.keys(window.__DEV.TARGET.overrides).length,
        rows: rows.length,
        withTarget: rows.filter(r => r.getAttribute("data-p50-has-target") === "true").length,
        targetNodes: document.querySelectorAll('#p50-results [data-p50="ct-target"]').length,
        gapNodes: document.querySelectorAll('#p50-results [data-p50="ct-gap"]').length,
        empty: !!document.querySelector('#p50-results [data-p50="ct-empty"]'),
        bodyText: (document.querySelector('#p50-results [data-p50="current-target"]') || {}).textContent || ""
      };
    });
    observed.withoutOverrides = noOv;
    if (noOv.overrides !== 0) detail.push("pré-condição: P50-F5 não deveria ter override");
    if (noOv.rows !== 5) detail.push("sem override: " + noOv.rows + " linhas (esperadas 5)");
    if (noOv.withTarget !== 0) detail.push("sem override: " + noOv.withTarget + " linha(s) com alvo fabricado");
    if (noOv.targetNodes !== 0) detail.push("sem override: " + noOv.targetNodes + " marcador(es) de alvo fabricado(s)");
    if (noOv.gapNodes !== 0) detail.push("sem override: " + noOv.gapNodes + " gap fabricado(s)");
    if (!noOv.empty) detail.push("sem override: ausência de alvo não é declarada ao usuário");
    if (/\b3[.,]0\b/.test(noOv.bodyText)) detail.push("sem override: alvo fixo 3.0 presente na superfície");

    /* (2) COM override canônico (P50-F9): alvo só onde há override */
    await applyResults(pg, FX.P50_F9);
    await selectTab(pg, "analise");
    const withOv = await pg.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'));
      const cur = window.__DEV.tgtCurrentProfile();
      const tgt = window.__DEV.computeTargetProfile(window.__DEV.tgtEffectiveVector());
      return {
        overrides: JSON.parse(JSON.stringify(window.__DEV.TARGET.overrides)),
        canonicalCurrent: cur.stats.map(x => x.score),
        canonicalTarget: tgt.stats.map(x => x.score),
        rows: rows.map(r => {
          const t = r.querySelector('[data-p50="ct-target"]');
          const cs = t ? getComputedStyle(t) : null;
          return {
            dom: r.getAttribute("data-dom"),
            hasTarget: r.getAttribute("data-p50-has-target"),
            current: r.getAttribute("data-p50-current"),
            target: r.getAttribute("data-p50-target"),
            gap: r.getAttribute("data-p50-gap"),
            currentText: (r.querySelector('[data-p50="ct-current-value"]') || {}).textContent,
            targetText: t ? t.textContent : null,
            /* o marcador de alvo é uma RÉGUA VERTICAL: mede-se o lado que ele
               efetivamente usa, não um lado presumido. Exige-se que exista ao
               menos um lado tracejado e que a cor desse lado seja a canônica. */
            targetDashedSides: cs ? ["Top", "Right", "Bottom", "Left"]
              .filter(k => cs["border" + k + "Style"] === "dashed") : null,
            targetDashedColors: cs ? ["Top", "Right", "Bottom", "Left"]
              .filter(k => cs["border" + k + "Style"] === "dashed")
              .map(k => cs["border" + k + "Color"]) : null,
            /* §12.2(b)/T14: o encoding EXCLUSIVO do alvo é a COMBINAÇÃO
               tracejado + --ftnt-green. O verde isolado NÃO é exclusivo: a
               paleta congelada atribui --ftnt-green ao domínio Pessoas, e
               COR-01.2 exige que a barra de current use a cor do próprio
               domínio. O que se proíbe é o current adotar a combinação. */
            currentBarColor: (() => {
              const bar = r.querySelector('[data-p50="ct-current"]');
              return bar ? getComputedStyle(bar).backgroundColor : null;
            })(),
            currentDashedSides: (() => {
              const bar = r.querySelector('[data-p50="ct-current"]');
              if (!bar) return null;
              const bs = getComputedStyle(bar);
              return ["Top", "Right", "Bottom", "Left"].filter(k => bs["border" + k + "Style"] === "dashed");
            })()
          };
        })
      };
    });
    observed.withOverrides = withOv;
    const OV_DOMS = { 0: true, 1: true, 3: true };            /* mandate/governance · team-capacity · logs */
    withOv.rows.forEach(r => {
      const i = Number(r.dom);
      const shouldHave = !!OV_DOMS[i];
      if ((r.hasTarget === "true") !== shouldHave)
        detail.push("domínio " + i + ": alvo " + (shouldHave ? "ausente" : "fabricado") + " (has-target=" + r.hasTarget + ")");
      if (Number(r.current) !== withOv.canonicalCurrent[i])
        detail.push("domínio " + i + ": current " + r.current + " != canônico " + withOv.canonicalCurrent[i]);
      if (shouldHave) {
        if (Number(r.target) !== withOv.canonicalTarget[i])
          detail.push("domínio " + i + ": target " + r.target + " != canônico " + withOv.canonicalTarget[i]);
        const g = +(withOv.canonicalTarget[i] - withOv.canonicalCurrent[i]).toFixed(1);
        if (Number(r.gap) !== g) detail.push("domínio " + i + ": gap " + r.gap + " != " + g);
        if (!r.targetDashedSides || !r.targetDashedSides.length)
          detail.push("domínio " + i + ": alvo sem tracejado em nenhum lado");
        else if (r.targetDashedColors.indexOf(GREEN) < 0)
          detail.push("domínio " + i + ": alvo fora do encoding canônico (" +
            JSON.stringify(r.targetDashedColors) + " sem " + GREEN + ")");
      } else {
        if (r.target !== null) detail.push("domínio " + i + ": atributo de alvo presente sem override");
        if (r.gap !== null) detail.push("domínio " + i + ": gap presente sem override");
      }
      if (r.currentDashedSides && r.currentDashedSides.length && r.currentBarColor === GREEN)
        detail.push("domínio " + i + ": current adotou a COMBINAÇÃO exclusiva do alvo (tracejado + verde)");
    });

    /* (3) UI-018 — exibir/alternar o alvo não altera current nem canônico */
    const inv = await pg.evaluate(async () => {
      const snap = () => JSON.stringify(window.__DEV.captureCanonicalInputs());
      const cur = () => JSON.stringify(window.__DEV.tgtCurrentProfile());
      const before = { canon: snap(), cur: cur(),
        ov: JSON.stringify(window.__DEV.TARGET.overrides),
        suff: String(window.__P50SUFF.contract().sufficient) };
      ["resumo", "heatmap", "dominios", "analise"].forEach(t => {
        const b = document.querySelector('#p50-results [data-p50="tab"][data-p50-tab="' + t + '"]');
        if (b) b.click();
      });
      const after = { canon: snap(), cur: cur(),
        ov: JSON.stringify(window.__DEV.TARGET.overrides),
        suff: String(window.__P50SUFF.contract().sufficient) };
      return { before, after };
    });
    observed.invariants = inv;
    ["canon", "cur", "ov", "suff"].forEach(k => {
      if (inv.before[k] !== inv.after[k]) detail.push("UI-018: " + k + " alterado pela visualização de alvo");
    });

    /* (4) UI-019 — current insuficiente: nenhum zero, nenhum delta contra nada */
    await applyResults(pg, FX.P50_F6);
    await selectTab(pg, "analise");
    const insuf = await pg.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'));
      return {
        sufficient: window.__P50SUFF.contract().sufficient,
        canonical: window.__DEV.tgtCurrentProfile().stats.map(x => x.score),
        currents: rows.map(r => r.getAttribute("data-p50-current")),
        texts: rows.map(r => (r.querySelector('[data-p50="ct-current-value"]') || {}).textContent),
        gaps: rows.map(r => r.getAttribute("data-p50-gap")),
        plotted: rows.map(r => {
          const bar = r.querySelector('[data-p50="ct-current"]');
          return bar ? bar.getAttribute("data-p50-plotted") : null;
        })
      };
    });
    observed.insufficient = insuf;
    if (insuf.sufficient !== false) detail.push("pré-condição: P50-F6 deveria ser insuficiente");
    /* UG7: um 0.0 CONFIRMADO é legítimo e deve aparecer. O que é proibido é
       desenhar como zero um domínio cujo current canônico é null. */
    insuf.canonical.forEach((canon, i) => {
      const shown = insuf.currents[i];
      if (canon === null) {
        if (shown !== null)
          detail.push("domínio " + i + ": current ausente renderizado como " + shown);
        if (!/n\/d/.test(String(insuf.texts[i])))
          detail.push("domínio " + i + ": current ausente sem rótulo n/d");
        if (insuf.plotted[i] === "true")
          detail.push("domínio " + i + ": barra plotada sem current canônico");
        if (insuf.gaps[i] !== null)
          detail.push("domínio " + i + ": delta numérico contra current inexistente");
      } else if (Number(shown) !== canon) {
        detail.push("domínio " + i + ": current " + shown + " != canônico " + canon);
      }
    });
  } catch (e) { detail.push("exceção: " + String(e.message).split("\n")[0]); } finally { await pg.close(); }
  const ok = detail.length === 0;
  results.push({ id: "P50-VIS9", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-VIS9 — Current × Target somente pelo alvo canônico; current inalterado" +
    (ok ? "" : " [" + detail.slice(0, 6).join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P50-ACC5 — alternativa acessível com os MESMOS dados do gráfico. */
async function acc5(browser, pageErrors) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("ACC5: " + String(e.message)));
  try {
    await applyResults(pg, FX.P50_F9);
    await selectTab(pg, "heatmap");
    const cmp = await pg.evaluate(() => {
      const cells = Array.from(document.querySelectorAll('#p50-results [data-p50="hm-cell"]'));
      const rows = Array.from(document.querySelectorAll('#p50-results [data-p50="alt-row"]'));
      const cellData = cells.map(c => ({
        dom: c.getAttribute("data-dom"), qid: c.getAttribute("data-qid"),
        state: c.getAttribute("data-p50-ans"),
        current: c.getAttribute("data-p50-score"),
        target: c.getAttribute("data-p50-target"),
        gap: c.getAttribute("data-p50-gap"),
        sufficient: c.getAttribute("data-p50-domain-sufficient")
      }));
      const rowData = rows.map(r => ({
        dom: r.getAttribute("data-dom"), qid: r.getAttribute("data-qid"),
        state: r.getAttribute("data-p50-ans"),
        current: r.getAttribute("data-p50-score"),
        target: r.getAttribute("data-p50-target"),
        gap: r.getAttribute("data-p50-gap"),
        sufficient: r.getAttribute("data-p50-domain-sufficient")
      }));
      const table = document.querySelector('#p50-results [data-p50="alt-table"]');
      const heads = Array.from(document.querySelectorAll('#p50-results [data-p50="alt-table"] thead th'))
        .map(h => (h.textContent || "").trim());
      const rowHeaderScopes = Array.from(document.querySelectorAll('#p50-results [data-p50="alt-table"] tbody th'))
        .map(h => h.getAttribute("scope"));
      return { cellData, rowData, isTable: !!table && table.tagName.toLowerCase() === "table",
               caption: table ? (table.querySelector("caption") || {}).textContent : null,
               heads, rowHeaderScopes,
               altTexts: rows.map(r => (r.textContent || "").replace(/\s+/g, " ").trim()) };
    });
    observed.acc5 = { cells: cmp.cellData.length, rows: cmp.rowData.length, heads: cmp.heads,
                      isTable: cmp.isTable, caption: cmp.caption };
    if (!cmp.isTable) detail.push("alternativa acessível não é uma tabela real");
    if (!cmp.caption) detail.push("tabela alternativa sem caption");
    const WANT_HEADS = ["Domínio", "Pergunta", "Estado", "Atual", "Alvo", "Gap", "Suficiência"];
    if (JSON.stringify(cmp.heads) !== JSON.stringify(WANT_HEADS))
      detail.push("cabeçalhos da alternativa: " + JSON.stringify(cmp.heads));
    if (cmp.rowData.length !== cmp.cellData.length)
      detail.push("alternativa com " + cmp.rowData.length + " linhas para " + cmp.cellData.length + " células");
    else {
      for (let i = 0; i < cmp.cellData.length; i++) {
        const a = cmp.cellData[i], b = cmp.rowData[i];
        Object.keys(a).forEach(k => {
          if (a[k] !== b[k])
            detail.push("divergência campo a campo em " + a.qid + "." + k + ": chart=" +
              JSON.stringify(a[k]) + " alternativa=" + JSON.stringify(b[k]));
        });
      }
    }
    if (cmp.altTexts.some(t => !t)) detail.push("linha da alternativa sem conteúdo textual");
    if (cmp.rowHeaderScopes.length !== cmp.rowData.length)
      detail.push("linhas da alternativa sem cabeçalho de linha");
    if (cmp.rowHeaderScopes.some(x => x !== "row"))
      detail.push("cabeçalho de linha sem scope=\"row\": " + JSON.stringify(cmp.rowHeaderScopes.slice(0, 4)));
  } catch (e) { detail.push("exceção: " + String(e.message).split("\n")[0]); } finally { await pg.close(); }
  const ok = detail.length === 0;
  results.push({ id: "P50-ACC5", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC5 — alternativa acessível com os mesmos dados do heat map" +
    (ok ? "" : " [" + detail.slice(0, 6).join(" · ") + "]"));
  return { ok, detail, observed };
}

/* Evidência visual mínima da 5.0.4 (prefixo exclusivo P50-5.0.4-).
   Capturas do ELEMENTO quando o componente vive no rodapé de página alta —
   mesma correção adotada em 5.0.2 (M-502-3) e 5.0.3. */
async function shot504(browser, pageErrors) {
  const CASES = [
    { fx: FX.P50_F6, tab: "heatmap",  vp: { width: 1440, height: 900 }, sel: '#p50-results [data-p50="heatmap"]',        name: "P50-5.0.4-heatmap-F6-1440.png" },
    { fx: FX.P50_F6, tab: "heatmap",  vp: { width: 390,  height: 844 }, sel: '#p50-results [data-p50="heatmap"]',        name: "P50-5.0.4-heatmap-F6-390.png" },
    { fx: FX.P50_F9, tab: "analise",  vp: { width: 1440, height: 900 }, sel: '#p50-results [data-p50="current-target"]', name: "P50-5.0.4-current-target-F9-1440.png" },
    { fx: FX.P50_F9, tab: "analise",  vp: { width: 390,  height: 844 }, sel: '#p50-results [data-p50="current-target"]', name: "P50-5.0.4-current-target-F9-390.png" },
    { fx: FX.P50_F9, tab: "dominios", vp: { width: 1440, height: 900 }, sel: '#p50-results [data-p50="drilldown"]',      name: "P50-5.0.4-domain-drilldown-1440.png" }
  ];
  for (const c of CASES) {
    const pg = await browser.newPage({ viewport: c.vp });
    pg.on("pageerror", e => pageErrors.push("shot504/" + c.name + ": " + String(e.message)));
    try {
      await applyResults(pg, c.fx);
      await selectTab(pg, c.tab);
      await shotElement(pg, c.sel, c.name);
    } catch (e) { pageErrors.push("shot504/" + c.name + ": " + String(e.message).split("\n")[0]); }
    finally { await pg.close(); }
  }
}

(async () => {
  let chromium;
  try { ({ chromium } = require("@playwright/test")); }
  catch (e) {
    console.log("SKIP  P50-ACC6 — estado programático da seleção — NÃO EXECUTADO (@playwright/test ausente)");
    skipped++; finish(); return;
  }
  const resolved = resolveBrowser();
  const opts = { args: ["--no-sandbox", "--disable-dev-shm-usage"] };
  if (resolved.exe) opts.executablePath = resolved.exe;
  let b;
  try { b = await chromium.launch(opts); }
  catch (e) {
    console.log("SKIP  P50-ACC6 — estado programático da seleção — NÃO EXECUTADO (browser indisponível: " +
      e.message.split("\n")[0] + ")");
    skipped++; finish(); return;
  }
  let smoke = null;
  try {
    const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const pageErrors = [];
    page.on("pageerror", e => pageErrors.push(String(e.message)));
    await acc6(page);
    /* superfície de evidência da 5.0.2: chips + cue + preview inerte */
    await applyFixture(page, FX.P50_F8);
    await shot(page, "P50-5.0.2-evidence-P50-F8-1440.png");
    await applyFixture(page, FX.P50_F10);
    await shot(page, "P50-5.0.2-evidence-P50-F10-1440.png");
    const sesuxObserved = await sesux1b(page);
    if (pageErrors.length) {
      console.log("FAIL  P50-ACC6 — erros de página: " + pageErrors.join(" | "));
      results.push({ id: "P50-ACC6-pageerrors", ok: false });
    }

    /* ======================================================================
       CRITÉRIOS VISUAIS DE ACEITE DA CORREÇÃO DE UX 5.0.1
       Verificação programática (screenshot isolado NÃO é suficiente) do
       estado inicial recolhido e da posição do conteúdo na primeira dobra.
       NÃO é gate do namespace P50-VIS: P50-VIS1..P50-VIS10 permanecem
       reservados às microfases previstas e NÃO são declarados encerrados.
       Falha aqui bloqueia a execução.
       ====================================================================== */
    const foldDetail = [];
    smoke = { viewports: [] };
    for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
      const pg = await b.newPage({ viewport: { width: vp.w, height: vp.h } });
      pg.on("pageerror", e => pageErrors.push("vp" + vp.w + ": " + String(e.message)));
      await applyFixture(pg, FX.P50_F6);
      const m = await pg.evaluate(() => {
        const se = document.scrollingElement;
        const r = e => { const b = e.getBoundingClientRect();
          return { l: b.left, t: Math.round(b.top + scrollY), r: b.right, b: b.bottom, h: Math.round(b.height) }; };
        const vis = e => !!e && !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
        const shell = document.getElementById("p50-shell");
        const orient = document.querySelector("#p50-shell .p50-orient");
        const sidebar = document.querySelector("#p50-shell [data-p50=\"sidebar\"]");
        const tgl = document.querySelector("#p50-shell button[data-p50=\"sidebar-toggle\"]");
        const qt = document.querySelector("#app .question");
        const card = document.querySelector("#app .opts .opt");
        const ov = (a, z) => !(a.r <= z.l || z.r <= a.l || a.b <= z.t || z.b <= a.t);
        const clipped = Array.from(document.querySelectorAll("#p50-shell .p50-qstate, #p50-shell .p50-qlabel, #p50-shell .p50-pos, #p50-shell .p50-domcur"))
          .filter(e => e.scrollWidth > e.clientWidth + 1).length;
        const rr = e => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
        return {
          viewport: { w: innerWidth, h: innerHeight },
          shellPresent: !!shell,
          shellHeight: shell ? r(shell).h : null,
          collapsed: shell ? shell.getAttribute("data-p50-collapsed") : null,
          sidebarVisible: vis(sidebar),
          toggleVisible: vis(tgl),
          toggleLabel: tgl ? (tgl.textContent || "").trim() : null,
          questionTop: qt ? r(qt).t : null,
          firstCardTop: card ? r(card).t : null,
          documentScrollWidth: se.scrollWidth,
          horizontalOverflow: se.scrollWidth > innerWidth,
          stickyOverlapsFirstCard: !!(orient && card) && ov(rr(orient), rr(card)),
          clippedLabels: clipped
        };
      });
      smoke.viewports.push(m);
      const tag = vp.w + "×" + vp.h;
      if (!m.shellPresent) foldDetail.push(tag + ": #p50-shell ausente");
      if (m.collapsed !== "true") foldDetail.push(tag + ": mapa não inicia recolhido");
      if (m.sidebarVisible) foldDetail.push(tag + ": mapa visível no estado inicial");
      if (!m.toggleVisible) foldDetail.push(tag + ": botão de mostrar mapa não visível");
      if (!/Mostrar mapa do assessment/.test(m.toggleLabel || "")) foldDetail.push(tag + ": rótulo do botão = " + m.toggleLabel);
      if (!(m.questionTop < m.viewport.h)) foldDetail.push(tag + ": pergunta fora da dobra (top=" + m.questionTop + ")");
      if (!(m.firstCardTop < m.viewport.h)) foldDetail.push(tag + ": 1º card fora da dobra (top=" + m.firstCardTop + ")");
      if (m.documentScrollWidth > m.viewport.w) foldDetail.push(tag + ": overflow horizontal");
      if (m.stickyOverlapsFirstCard) foldDetail.push(tag + ": sticky sobrepõe o 1º card");
      if (m.clippedLabels) foldDetail.push(tag + ": " + m.clippedLabels + " rótulo(s) clipado(s)");
      await shot(pg, "P50-5.0.1-default-collapsed-" + vp.w + ".png");

      /* mapa expandido: prova que o botão abre e nada foi removido (1440) */
      if (vp.w === 1440) {
        const exp = await pg.evaluate(() => {
          document.querySelector("#p50-shell button[data-p50=\"sidebar-toggle\"]").click();
          const sb = document.querySelector("#p50-shell [data-p50=\"sidebar\"]");
          const st = Array.from(document.querySelectorAll("#p50-shell [data-p50=\"q\"]"))
            .map(li => li.getAttribute("data-p50-ans"));
          return {
            collapsed: document.getElementById("p50-shell").getAttribute("data-p50-collapsed"),
            sidebarVisible: !!(sb && (sb.offsetWidth || sb.offsetHeight)),
            domains: document.querySelectorAll("#p50-shell [data-p50=\"domain\"]").length,
            questions: st.length,
            unset: st.filter(x => x === "unset").length,
            na: st.filter(x => x === "na").length,
            confirmed: st.filter(x => x === "confirmed").length
          };
        });
        smoke.expanded = exp;
        if (exp.collapsed !== "false") foldDetail.push("expandido: botão não abriu o mapa");
        if (!exp.sidebarVisible) foldDetail.push("expandido: mapa permanece oculto");
        if (exp.domains !== 5) foldDetail.push("expandido: " + exp.domains + " domínios (esperado 5)");
        if (exp.questions !== 15) foldDetail.push("expandido: " + exp.questions + " perguntas (esperado 15)");
        /* P50-F6: mandate=null, governance="NA", policies=0, demais null */
        if (exp.unset !== 13 || exp.na !== 1 || exp.confirmed !== 1)
          foldDetail.push("expandido: estados unset/na/confirmed = " + exp.unset + "/" + exp.na + "/" + exp.confirmed + " (esperado 13/1/1)");
        await shot(pg, "P50-5.0.1-map-expanded-1440.png");
      }
      await pg.close();
    }
    const foldOk = foldDetail.length === 0;
    results.push({ id: "ACEITE-UX-5.0.1", ok: foldOk });
    console.log((foldOk ? "PASS" : "FAIL") +
      "  ACEITE-UX-5.0.1 (verificação de aceite, NÃO é gate P50-VIS) — mapa recolhido por padrão; pergunta e 1º card dentro da primeira dobra" +
      (foldOk ? "" : " [" + foldDetail.join(" · ") + "]"));

    /* ---- 5.0.3 · aceite em Chromium real + evidência própria ---- */
    const aceite = await aceite503(b, pageErrors);
    /* ---- B-AUD-503-2 · guard estreito da superfície de print legado ---- */
    const prn1 = await pr1(b, pageErrors);

    /* ---- microfase 5.0.4 · gates normativos novos ---- */
    const g7 = await vis7(b, pageErrors);
    const g8 = await vis8(b, pageErrors);
    const g9 = await vis9(b, pageErrors);
    const g5 = await acc5(b, pageErrors);
    await shot504(b, pageErrors);
    writeEvidence("P50-5.0.3-sufficiency-surface.json",
      JSON.stringify({
        check: "ACEITE-UX-5.0.3",
        microfase: "5.0.3",
        note: "Verificação de aceite em Chromium real. NÃO é gate do namespace P50-VIS/P50-ACC e não encerra P50-VIS1..P50-VIS10.",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin, specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        viewports: ["1440x900", "390x844"],
        fixtures: ["P50-F2", "P50-F3", "P50-F4", "P50-F5", "relock(P50-F4 -> NA)"],
        selectors: {
          suffPanel: "#p50-suff", gate: "#p50-results[data-p50-gate]",
          globalLine: "[data-p50=\"suff-global\"]", deficit: "[data-p50=\"suff-deficit\"]",
          axis: "[data-p50=\"suff-domain\"]", guidance: "[data-p50=\"suff-guidance\"]",
          domainRow: "[data-p50=\"results-domain\"]", execCards: "[data-p50=\"exec-cards\"]"
        },
        screenshots: shots.filter(n => n.indexOf("P50-5.0.3-") === 0),
        observed: aceite.observed,
        failures: aceite.detail,
        /* B-AUD-503-2 · o guard de print legado tem oráculo próprio e é
           registrado junto da evidência de aceite da mesma execução limpa. */
        legacyPrintGuard: {
          gate: "P50-PR1",
          note: "Guard ADICIONAL e estreito. NÃO encerra nem redefine P50-VIS10.",
          vis10Closed: false,
          vis10Statement: "P50-VIS10 permanece ABERTO e integral; P50-PR1 não o encerra, não o redefine e não o substitui.",
          fixture: "P50-F3", baselineSha: PR1_BASELINE_SHA,
          /* B-AUD-FIN-503-1 · contrato do oracle de apresentação contínua */
          continuousPresentationContract: {
            version: PR1_STYLE_CONTRACT,
            comparedAgainstBaseline: PR1_BASELINE_SHA,
            comparedAgainstBaselineLabel: "baseline de ENTRADA da 5.0.3 (5d1a301e…), mesma fixture, mídia print",
            properties: PR1_STYLE_PROPS,
            selectors: PR1_STYLE_SELECTORS.map(s => ({ key: s.key, selector: s.sel, expect: s.expect })),
            states: ["gate-bloqueado (P50-F3)", "gate-liberado (P50-F5)"],
            opacityIsBinary: false,
            divergences: (prn1.observed.continuousPresentation &&
              prn1.observed.continuousPresentation.states || []).map(s =>
                ({ state: s.state, fixture: s.fixture, gate: s.gate, divergences: s.divergences }))
          },
          ok: prn1.ok, failures: prn1.detail, observed: prn1.observed
        },
        pageErrors,
        verdict: (aceite.detail.length || !prn1.ok) ? "FAIL" : "PASS"
      }, null, 2) + "\n");
    writeEvidence("P50-5.0.4-visual-surface.json",
      JSON.stringify({
        microfase: "5.0.4 · Target & Heat Map Visualizations",
        note: "Gates normativos da 5.0.4 em Chromium real. NÃO encerram P50-VIS10 nem redefinem a autoridade congelada V9/T14 sobre #ux-target.",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin, specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        fixtures: ["P50-F1", "P50-F5", "P50-F6", "P50-F7", "P50-F9"],
        tabs: ["resumo", "dominios", "heatmap", "analise"],
        frameworkMappingTab: false,
        gates: {
          "P50-VIS7": { ok: g7.ok, failures: g7.detail, observed: g7.observed },
          "P50-VIS8": { ok: g8.ok, failures: g8.detail, observed: g8.observed },
          "P50-VIS9": { ok: g9.ok, failures: g9.detail, observed: g9.observed },
          "P50-ACC5": { ok: g5.ok, failures: g5.detail, observed: g5.observed }
        },
        canonicalOwners: {
          target: "TARGET_PROFILE.overrides via setTarget() — nenhum alvo fixo, nenhum fallback",
          presence: "V32.TECH_LANDSCAPE[cap].presence",
          sufficiency: "window.__P50SUFF.contract() (UI-012A)",
          score: "domStat(i).score / tgtCurrentProfile()"
        },
        screenshots: shots.filter(n => n.indexOf("P50-5.0.4-") === 0),
        pageErrors,
        verdict: (g7.ok && g8.ok && g9.ok && g5.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n");
    writeEvidence("P50-5.0.3-acc6-selection-1440.json",
      JSON.stringify({
        gate: "P50-ACC6",
        microfase: "5.0.3 (execução corrente; a evidência histórica da 5.0.1 permanece congelada em P50-ACC6-selection-1440.json)",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin,
          specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        viewport: "1440x900",
        fixtures: ["P50-F2", "P50-F6"],
        pageErrors,
        /* Escopo da evidência: as capturas da 5.0.3 têm arquivo próprio
           (P50-5.0.3-sufficiency-surface.json). Sem este recorte, o array
           compartilhado faria a evidência histórica absorver nomes novos. */
        screenshots: shots.filter(n => n.indexOf("P50-5.0.3-") !== 0),
        smokeNonNormative: smoke,
        sesux1b: sesuxObserved,
        note: "Screenshots são evidência visual mínima da 5.0.1. NÃO encerram P50-VIS1..P50-VIS10.",
        verdict: results.every(r => r.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n");
  } finally { await b.close(); }
  finish();
})();

function finish() {
  const fail = results.filter(r => !r.ok).length;
  const pass = results.length - fail;
  console.log("\nP50 CHROMIUM (microfases 5.0.1+5.0.2+5.0.3+5.0.4): " + pass + " PASS · " + fail + " FAIL de " + results.length +
    (skipped ? " · " + skipped + " NÃO EXECUTADO (requer Chromium real)" : ""));
  process.exit(fail ? 1 : 0);
}
