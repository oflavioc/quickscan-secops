/* ============================================================================
   TESTES P50 · CHROMIUM — PHASE 5.0 · microfases 5.0.1 a 5.0.5
   Escopo por microfase:
     5.0.1/5.0.2/5.0.3  P50-ACC6, P50-SESUX1B, P50-PR1 e as verificações de
                        ACEITE de UX — estas NÃO pertencem ao namespace de
                        gate P50-VIS/P50-ACC e não o encerram.
     5.0.4              P50-VIS7 · P50-VIS8 · P50-VIS9 · P50-ACC5.
     5.0.5              P50-VIS1..VIS4 (layout por viewport) · P50-VIS5 (foco
                        visível) · P50-VIS6 (zoom 200%) · P50-VIS10 (agregação
                        factual da regressão de print, sem escopo novo) ·
                        P50-ACC1 (axe-core 4.13.0) · P50-ACC2 (fluxo só por
                        teclado) · P50-ACC3 (ordem de foco) · P50-ACC4
                        (contraste e target size) · P50-IC1/P50-IC2 (ícone
                        oficial e fallback em superfície nova).
   Os contratos de P50-VIS7..VIS9 e P50-ACC5/ACC6 permanecem os da microfase
   que os entregou: a 5.0.5 os REEXECUTA, nunca os redefine.

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
const EVIDENCE_PREFIX = "P50-5.0.5-";   /* microfase CORRENTE; 5.0.1..5.0.4 são históricas */
/* Alguns artefatos da 5.0.5 são exigidos POR NOME pela spec (§25.6/§30) e pela
   diretriz — `P50-geometry.json`, os 12 relatórios axe, os diagnósticos de foco
   e a tabela de contraste — e portanto não carregam prefixo de microfase.
   Verificado no acervo antes da implementação: nenhum deles existia, logo esta
   permissão não abre caminho para regravar evidência histórica. */
const EVIDENCE_NOMINAL_5_0_5 = [
  /^P50-geometry\.json$/,
  /^P50-ACC1-axe-[A-Za-z0-9.\-]+\.json$/,
  /^P50-VIS5-focus-[A-Za-z0-9.\-]+\.json$/,
  /^P50-ACC4-contrast\.json$/
];
function evidenceWritable(name) {
  if (NO_EVIDENCE) return false;
  if (name.indexOf(EVIDENCE_PREFIX) === 0) return true;
  return EVIDENCE_NOMINAL_5_0_5.some(re => re.test(name));
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
        /* PHASE 5.2 · REV B (SUFF-B §9): com o resultado LIBERADO a base de
           evidência deixou de abrir a página e passou a viver na área interna
           de "Relatório e sessão", depois do resultado. Medir "suficiência
           acima do resultado" deixou de descrever o produto; o que este gate
           sempre quis medir é SOBREPOSIÇÃO — que agora é medida como
           interseção real das duas faixas, em qualquer ordem. */
        overlap: !(rSuff.b <= rRes.t + 1 || rRes.b <= rSuff.t + 1),
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
    document.getElementById("notetgl").click();   /* UAT-03: controle único */
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
   P50-PR1 — Neutralização de TELA preservada; papel unificado no relatório

   MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · B-02/B-03
   (parecer SHA-256 f5a9f70e7a5ee658ef86775d8dab93ce2cb15974604a7ed7f1dcd99e13b58dae)

   O enunciado anterior era: "o print legado NÃO monta `#v32-print-report`:
   `preparePrint()` devolve `{legacy:true}`, esvazia o contêiner e NÃO adiciona
   `v32-print-mode` — logo `.wrap`/`#app` é a superfície impressa", e o gate
   exigia no PAPEL os cinco valores de domínio, os cinco `.conf`, os cinco
   fills, o radar e a legenda da superfície legada.

   Esse enunciado era a formulação exata dos blockers B-02 e B-03. A
   neutralização honesta vive em `@media screen`; ao imprimir `.wrap`, o papel
   recebia justamente os valores NÃO neutralizados — `5.0 — Optimizing` em
   cinco domínios sob um cabeçalho que declarava cobertura insuficiente — e
   sem a nota que explica a supressão, ocultada em `@media print`.

   A PREMISSA do gate continua íntegra e é a metade que ele realmente protege:
   a Phase 5 não pode criar semântica de impressão própria, e a neutralização
   de tela não pode ser apagada. O que mudou foi o DOCUMENTO: ele deixou de ser
   `.wrap` e passou a ser o relatório estruturado, que a camada CONGELADA
   (`buildPrintReport()`) já sabia montar sem contexto tecnológico.

   Correspondência linha a linha das asserções de impressão:
     ANTES                                          DEPOIS
     printReportEmpty === true                  →   relatório montado (> 2000 chars)
     printModeClass === false                   →   printModeClass === true
     wrapVisible === true                       →   wrapVisible === false
     appVisible === true                        →   appVisible === false
     rows === 5 no papel                        →   nenhuma linha legada no papel
     values/confs/fills/radar/legend visíveis   →   nenhum deles visível no papel
     texto = score canônico da Camada 1         →   o score canônico da Camada 1
                                                    NÃO chega ao papel com o gate
                                                    FECHADO (é o próprio B-01)
   Nenhuma asserção foi removida: cada uma tem substituta no mesmo ponto do
   fluxo. As asserções de TELA (itens 4, 11 e 12) permanecem BYTE-IDÊNTICAS.

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
      /* ERRATA EXTERNA · o DOCUMENTO agora é o relatório: o gate precisa medi-lo */
      reportChars: pr ? (pr.innerHTML || "").length : 0,
      reportText: pr ? (pr.textContent || "").replace(/\s+/g, " ").trim() : "",
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

    /* 7 · o relatório estruturado é a superfície impressa, também sem contexto. */
    if (prn.printReportEmpty) detail.push("print: #v32-print-report vazio — o relatório não foi montado sem contexto (B-02)");
    if (!prn.printModeClass) detail.push("print: body NÃO recebeu v32-print-mode — a superfície de aplicação chega ao papel (B-02)");
    if (prn.printBlockedClass) detail.push("print: body recebeu v32-print-blocked");
    if (prn.wrapVisible) detail.push("print: .wrap visível no papel — a aplicação virou documento (B-02)");
    if (prn.appVisible) detail.push("print: #app visível no papel — a aplicação virou documento (B-02)");
    if (!(prn.reportChars > 2000))
      detail.push("print: relatório com " + prn.reportChars + " caracteres (esperado > 2000)");

    /* 8 · NENHUM nó da superfície legada chega ao papel — é a correção de B-03.
       Os nós continuam existindo no DOM (R-01 do parecer segue no backlog); o
       que o gate exige é que nenhum deles seja PINTADO no documento. */
    prn.valuesVisible.forEach((v, i) => { if (v) detail.push("print: valor legado do domínio " + i + " visível no papel (B-03)"); });
    prn.confsVisible.forEach((v, i) => { if (v) detail.push("print: .conf legado do domínio " + i + " visível no papel (B-03)"); });
    if (prn.fillsVisible !== 0) detail.push("print: " + prn.fillsVisible + " fill(s) legado(s) visível(is) no papel (B-03)");
    if (prn.radarVisible) detail.push("print: radar legado visível no papel (B-03)");
    if (prn.legendVisible) detail.push("print: legenda legada visível no papel (B-03)");
    /* (B) o oráculo da Camada 1 invertido: com o gate FECHADO, o score canônico
       por domínio NÃO pode aparecer no documento impresso. É B-01 medido no
       papel, com o valor vindo do renderer congelado — não de string digitada. */
    const impresso = prn.reportText || "";
    pre.snapshot.domains.forEach((dd, i) => {
      if (dd.score === null) return;
      const proibido = dd.score.toFixed(1);
      if (new RegExp("(^|[^\\d.])" + proibido.replace(".", "\\.") + "([^\\d]|$)").test(impresso))
        detail.push("print: relatório publica o score canônico " + proibido +
          " do domínio " + i + " com o gate FECHADO (B-01)");
    });
    /* não-vacuidade: o documento tem de existir e nomear os cinco domínios */
    ["Negócio", "Pessoas", "Processos", "Tecnologia", "Serviços"].forEach(nome => {
      if (impresso.indexOf(nome) < 0)
        detail.push("print: sensor cego — '" + nome + "' ausente do relatório impresso");
    });

    /* 10 · a Camada 5 continua sem semântica própria de impressão: nada dela
       chega ao papel. Preservado byte a byte — o documento é montado pela
       camada CONGELADA, não por P50/P52. */
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
        /* MIGRAÇÃO · ERRATA DA AUDITORIA EXTERNA · B-02/B-03.
           A comparação de IDENTIDADE com o baseline de entrada não pode
           continuar valendo para o print: é exatamente a diferença que a
           errata foi autorizada a produzir. Comparar identidade aqui seria
           exigir a permanência do defeito.

           O que resta é MAIS forte do que a identidade: o gate exige que a
           diferença EXISTA e tenha o sinal certo. Se o baseline não imprimia a
           tela — isto é, se a diferença declarada não é real — o gate FALHA, e
           não passa em silêncio. A comparação de identidade de TELA continua
           adiante, intocada, nos itens 11 e 12.

           Estrutura preservada de cada `cmp()` anterior, agora como direção:
             rows/values/confs/fills/radar/legend  → visíveis no baseline, invisíveis no candidato
             wrapVisible / appVisible              → true no baseline, false no candidato
             printReportEmpty                      → true no baseline, false no candidato */
        const dif = (k, base, cand, esperadoBase, esperadoCand) => {
          if (base !== esperadoBase)
            detail.push("baseline de entrada não apresentava o defeito em " + k +
              " (" + JSON.stringify(base) + ") — a diferença declarada não existe");
          if (cand !== esperadoCand)
            detail.push("candidato não corrigiu " + k + " (" + JSON.stringify(cand) + ")");
        };
        dif("printReportEmpty", bm.printReportEmpty, prn.printReportEmpty, true, false);
        dif("printModeClass", bm.printModeClass, prn.printModeClass, false, true);
        dif("wrapVisible", bm.wrapVisible, prn.wrapVisible, true, false);
        dif("appVisible", bm.appVisible, prn.appVisible, true, false);
        dif("radarVisible(legado)", bm.radarVisible, prn.radarVisible, true, false);
        dif("legendVisible(legado)", bm.legendVisible, prn.legendVisible, true, false);
        if (!bm.valuesVisible.some(Boolean))
          detail.push("baseline de entrada não imprimia valores legados — a diferença declarada não existe");
        if (bm.fillsVisible === 0)
          detail.push("baseline de entrada não imprimia fills legados — a diferença declarada não existe");
        if (bm.rows !== prn.rows)
          detail.push("o DOM legado deixou de existir (rows " + bm.rows + " -> " + prn.rows +
            ") — esta errata não estava autorizada a removê-lo");
        if (JSON.stringify(bm.values) !== JSON.stringify(prn.values))
          detail.push("o TEXTO do DOM legado mudou (" + JSON.stringify(bm.values) +
            " -> " + JSON.stringify(prn.values) + ") — fora da autorização desta errata");
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


/* ============================================================================
   MICROFASE 5.0.5 · ACCESSIBILITY, RESPONSIVE & VISUAL CLOSURE
   Gates normativos P50-VIS1..VIS6, P50-VIS10, P50-ACC1..ACC4 e P50-IC1/IC2.
   Ambiente canônico da §25.6: Chromium real, mesma rota de resolução da suíte
   UG, quatro viewports congelados. NENHUM gate aqui redefine o contrato de
   P50-VIS7..VIS9 nem de P50-ACC5/ACC6, que continuam com os oráculos da 5.0.4.
   ========================================================================== */

/* Viewports canônicos (UI-040 / §25.6). A largura é a CHAVE do gate: cada um
   dos quatro tem identificador próprio, de modo que a falha aponta o viewport
   nominalmente em vez de um booleano agregado. */
const P50_VIEWPORTS = [
  { w: 1920, h: 1080, gate: "P50-VIS1", label: "desktop wide" },
  { w: 1440, h: 900,  gate: "P50-VIS2", label: "desktop/laptop" },
  { w: 1366, h: 768,  gate: "P50-VIS3", label: "laptop" },
  { w: 390,  h: 844,  gate: "P50-VIS4", label: "narrow/mobile-width" }
];

/* ---------------------------------------------------------------------------
   Aritmética de contraste — WCAG 2.x, implementada AQUI (no oráculo) e não
   lida do produto: se a superfície declarasse o próprio contraste, o gate
   seria circular. Cores chegam da página como strings computadas; a
   composição alfa é resolvida contra o fundo efetivo já apurado no DOM.
--------------------------------------------------------------------------- */
function p50Chan(c) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function p50Lum(rgb) { return 0.2126 * p50Chan(rgb[0]) + 0.7152 * p50Chan(rgb[1]) + 0.0722 * p50Chan(rgb[2]); }
function p50Ratio(a, b) {
  const l1 = p50Lum(a), l2 = p50Lum(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return +((hi + 0.05) / (lo + 0.05)).toFixed(3);
}
function p50ParseColor(s) {
  const str = String(s || "");
  /* `color-mix()` computa para `color(srgb r g b / a)`, com canais em 0..1.
     Sem tratar essa notação, toda cor DERIVADA mediria contraste 0 — falso
     negativo grave: o gate reprovaria por não saber ler, não por defeito real. */
  const cm = str.match(/^color\(\s*srgb\s+([^)]+)\)$/i);
  if (cm) {
    const q = cm[1].split(/[\s\/]+/).filter(Boolean).map(Number);
    if (q.length < 3 || q.slice(0, 3).some(n => !isFinite(n))) return null;
    return { r: Math.round(q[0] * 255), g: Math.round(q[1] * 255), b: Math.round(q[2] * 255),
             a: q.length > 3 && isFinite(q[3]) ? q[3] : 1 };
  }
  const m = str.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
  if (p.length < 3 || p.slice(0, 3).some(n => !isFinite(n))) return null;
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 && isFinite(p[3]) ? p[3] : 1 };
}
/* Composição de uma cor semitransparente sobre um fundo OPACO já conhecido. */
function p50Composite(fg, bgRGB) {
  if (!fg) return null;
  const a = fg.a;
  return [Math.round(fg.r * a + bgRGB[0] * (1 - a)),
          Math.round(fg.g * a + bgRGB[1] * (1 - a)),
          Math.round(fg.b * a + bgRGB[2] * (1 - a))];
}

/* Trecho injetado na página: resolve o FUNDO EFETIVO de um elemento subindo a
   árvore até achar cor opaca (ou o canvas do documento). Sem isto, medir
   contraste contra `rgba(0,0,0,0)` produziria número inventado. */
const P50_PAGE_HELPERS = `
  window.__p50bg = function (el) {
    var stack = [];
    var n = el;
    while (n && n.nodeType === 1) {
      var c = window.__p50color(getComputedStyle(n).backgroundColor);
      if (c) {
        if (c.a > 0) { stack.push({ r: c.r, g: c.g, b: c.b, a: c.a, from: n.tagName + (n.id ? "#" + n.id : "") }); }
        if (c.a >= 1) break;
      }
      n = n.parentElement;
    }
    var base = [255, 255, 255];
    for (var i = stack.length - 1; i >= 0; i--) {
      var s = stack[i];
      base = [Math.round(s.r * s.a + base[0] * (1 - s.a)),
              Math.round(s.g * s.a + base[1] * (1 - s.a)),
              Math.round(s.b * s.a + base[2] * (1 - s.a))];
    }
    return { rgb: base, chain: stack.map(function (s) { return s.from; }) };
  };
  /* ATENÇÃO · este bloco é um TEMPLATE LITERAL: toda barra invertida de regex
     precisa ser DUPLICADA aqui para chegar simples à página. Escrito com barra
     simples, "\\s" vira "s" e "\\(" vira "(" na string injetada — a regex passa
     a casar outra coisa e o parser devolve NaN sem erro algum. */
  window.__p50color = function (s) {
    var str = String(s || "");
    var cm = str.match(/^color\\(\\s*srgb\\s+([^)]+)\\)$/i);   /* saída de color-mix() */
    if (cm) {
      var q = cm[1].split(/[\\s\\/]+/).filter(Boolean).map(Number);
      if (q.length < 3 || q.slice(0, 3).some(function (n) { return !isFinite(n); })) return null;
      return { r: Math.round(q[0] * 255), g: Math.round(q[1] * 255), b: Math.round(q[2] * 255),
               a: q.length > 3 && isFinite(q[3]) ? q[3] : 1 };
    }
    var m = str.match(/rgba?\\(([^)]+)\\)/i);
    if (!m) return null;
    var p = m[1].split(/[\\s,\\/]+/).filter(Boolean).map(Number);
    if (p.length < 3 || p.slice(0, 3).some(function (n) { return !isFinite(n); })) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 && isFinite(p[3]) ? p[3] : 1 };
  };
  window.__p50sel = function (el) {
    if (!el || el.nodeType !== 1) return null;
    var s = el.tagName.toLowerCase();
    if (el.id) return s + "#" + el.id;
    var d = el.getAttribute("data-p50");
    if (d) s += '[data-p50="' + d + '"]';
    var cl = (el.getAttribute("class") || "").trim().split(/\\s+/)[0];
    if (cl) s += "." + cl;
    var q = el.getAttribute("data-i") || el.getAttribute("data-p50-tab") ||
            el.getAttribute("data-qid") || el.getAttribute("data-dom");
    if (q !== null && q !== undefined && q !== "") s += "[" + q + "]";
    return s;
  };
`;

/* A Camada 1 aplica `.screen{animation:fade .35s ease}` (congelado), que anima
   OPACIDADE. Medir contraste ou rodar axe durante a animação mede um estado
   TRANSITÓRIO — não a interface entregue — e produz resultado não determinístico
   (observado: `--faint` medido a 4.37:1 em pleno fade contra 4.92:1 em repouso).
   Esta espera é ATIVA e verificável: aguarda `document.getAnimations()` esvaziar
   e devolve o que observou, em vez de dormir um número mágico. Ela não afrouxa
   limiar algum — apenas garante que o objeto medido é o estado final. */
async function p50Settle(page, budgetMs) {
  const started = Date.now();
  const deadline = started + (budgetMs || 2000);
  let running = -1;
  while (Date.now() < deadline) {
    running = await page.evaluate(() => {
      if (typeof document.getAnimations !== "function") return 0;
      return document.getAnimations().filter(a => a.playState === "running").length;
    });
    if (running === 0) break;
    await page.waitForTimeout(50);
  }
  return { runningAnimations: running, waitedMs: Date.now() - started };
}

/* Superfícies da Camada 5 sob medição. `required` são controles/blocos
   ESSENCIAIS: sua ausência ou inalcançabilidade reprova o viewport. */
const P50_SURFACE_ASSESSMENT = {
  id: "assessment",
  required: [
    { sel: "#p50-shell", min: 1 },
    { sel: "#p50-shell .p50-orient", min: 1 },
    { sel: '#p50-shell [data-p50="position"]', min: 1 },
    { sel: '#p50-shell [data-p50="domain-progress"]', min: 1 },
    { sel: '#p50-shell [data-p50="completion"]', min: 1 },
    /* PHASE 5.2 · REV A (MAP-REV-A §9.1): o trilho deixou de duplicar
       `Pergunta anterior`/`Próxima pergunta`. Resta o controle do mapa; a
       navegação real é medida em `#back`/`#next`, já presentes no inventário
       crítico logo abaixo. */
    { sel: "#p50-shell .p50-nav .p50-btn", min: 1 },
    { sel: "#back", min: 1 },
    { sel: "#next", min: 1 },
    { sel: '#p50-shell button[data-p50="sidebar-toggle"]', min: 1 },
    { sel: ".p50-ses", min: 1 },
    { sel: "#app .question", min: 1 },
    { sel: "#app .opts .opt", min: 5 },
    { sel: '#app .p50-chips [data-p50="chip"]', min: 3 },
    { sel: '#notetgl', min: 1 },                       /* UAT-03: controle único de evidência */
    { sel: '#app [data-p50="evidence-guidance"]', min: 1 },
    { sel: "#notetgl", min: 1 }
  ],
  textScope: '#p50-shell, #p50-shell *, #app .p50-chips *, #app .p50-cueblock *, .p50-ses *'
};
/* Base comum a TODAS as tabs de Results. O conteúdo específico de cada tab
   é declarado à parte porque as tabs não selecionadas ficam `hidden` por
   contrato (padrão ARIA): exigir o conteúdo do Resumo enquanto o Heat Map
   está aberto mediria a ausência esperada, não um defeito. */
const P50_SURFACE_RESULTS = {
  id: "results",
  required: [
    { sel: "#p50-suff", min: 1 },
    { sel: '#p50-suff [data-p50="suff-global"]', min: 1 },
    { sel: "#p50-results", min: 1 },
    { sel: '#p50-results [data-p50="results-verdict"]', min: 1 },
    { sel: '#p50-results [data-p50="tab"]', min: 4 }
  ],
  textScope: "#p50-suff *, #p50-results *"
};
/* Conteúdo essencial de cada tab, exigido SOMENTE quando ela está selecionada.
   Cobre as quatro visões: nenhuma tab passa por "vazia mas presente". */
const P50_RESULTS_TAB_REQUIRED = {
  resumo:   [{ sel: '#p50-results [data-p50="results-domain"]', min: 5 }],
  dominios: [{ sel: '#p50-results [data-p50="drill-dom"]', min: 5 },
             { sel: '#p50-results [data-p50="drill-q"]', min: 15 }],
  heatmap:  [{ sel: '#p50-results [data-p50="hm-cell"]', min: 15 },
             { sel: '#p50-results .p50-alt-table', min: 1 }],
  analise:  [{ sel: '#p50-results [data-p50="ct-row"]', min: 5 }]
};
function p50ResultsSurfaceFor(tab) {
  return { id: "results:" + tab,
           required: P50_SURFACE_RESULTS.required.concat(P50_RESULTS_TAB_REQUIRED[tab] || []),
           textScope: P50_SURFACE_RESULTS.textScope };
}

/* Medição de layout de uma superfície no viewport corrente.
   Alcançável = existe, é visível e cabe no espaço rolável (vertical do
   documento, horizontal do próprio contêiner quando este é rolável por
   design — `.p50-alt{overflow-x:auto}` é padrão responsivo legítimo). */
function p50MeasureSurface(page, surface) {
  return page.evaluate(([req, textScope]) => {
    const se = document.scrollingElement;
    const vw = window.innerWidth, vh = window.innerHeight;
    const vis = e => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    const scrollerX = e => {
      for (let p = e.parentElement; p; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (/(auto|scroll)/.test(s.overflowX) && p.scrollWidth > p.clientWidth + 1) return window.__p50sel(p);
      }
      return null;
    };
    const clipper = e => {
      for (let p = e.parentElement; p; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.overflowX === "hidden" || s.overflowY === "hidden") return window.__p50sel(p);
      }
      return null;
    };
    const groups = req.map(r => {
      const nodes = Array.from(document.querySelectorAll(r.sel));
      const shown = nodes.filter(vis);
      const items = shown.map(e => {
        const b = e.getBoundingClientRect();
        const absTop = b.top + window.scrollY, absBottom = b.bottom + window.scrollY;
        return {
          sel: window.__p50sel(e),
          box: { l: +b.left.toFixed(1), r: +b.right.toFixed(1), t: +absTop.toFixed(1), b: +absBottom.toFixed(1) },
          insideVertical: absTop >= -1 && absBottom <= se.scrollHeight + 1,
          insideHorizontal: b.left >= -1 && b.right <= vw + 1,
          horizontalScroller: scrollerX(e)
        };
      });
      return { selector: r.sel, min: r.min, found: nodes.length, visible: shown.length, items };
    });
    const texts = Array.from(document.querySelectorAll(textScope))
      .filter(e => e.children.length === 0 && (e.textContent || "").trim().length)
      .filter(vis)
      .map(e => ({
        sel: window.__p50sel(e),
        text: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48),
        overflowX: e.scrollWidth - e.clientWidth,
        overflowY: e.scrollHeight - e.clientHeight,
        horizontalScroller: scrollerX(e),
        clipper: clipper(e)
      }))
      .filter(t => t.overflowX > 1 || t.overflowY > 1);
    return {
      viewport: { w: vw, h: vh },
      documentScrollWidth: se.scrollWidth,
      documentScrollHeight: se.scrollHeight,
      horizontalOverflow: se.scrollWidth - vw,
      groups,
      clippedTexts: texts
    };
  }, [surface.required, surface.textScope]);
}

/* Verdito de uma medição: transforma medidas em falhas NOMINAIS. */
function p50JudgeSurface(tag, m) {
  const fail = [];
  if (m.horizontalOverflow > 0)
    fail.push(tag + ": overflow horizontal do documento = " + m.horizontalOverflow + "px (scrollWidth " +
      m.documentScrollWidth + " > viewport " + m.viewport.w + ")");
  m.groups.forEach(g => {
    if (g.visible < g.min)
      fail.push(tag + ": " + g.selector + " visível " + g.visible + " de " + g.min + " exigidos (encontrados " + g.found + ")");
    g.items.forEach(it => {
      if (!it.insideVertical)
        fail.push(tag + ": " + it.sel + " fora do espaço rolável vertical (top " + it.box.t + ", bottom " + it.box.b +
          ", scrollHeight " + m.documentScrollHeight + ")");
      if (!it.insideHorizontal && !it.horizontalScroller)
        fail.push(tag + ": " + it.sel + " fora do viewport horizontal (l " + it.box.l + ", r " + it.box.r +
          ") e sem contêiner rolável");
    });
  });
  m.clippedTexts.forEach(t => {
    if (t.overflowX > 1 && t.horizontalScroller) return;   /* rolagem por design */
    fail.push(tag + ": texto clipado em " + t.sel + " (+" + t.overflowX + "px/+" + t.overflowY +
      "px) '" + t.text + "'" + (t.clipper ? " sob " + t.clipper : ""));
  });
  return fail;
}

/* P50-VIS1..P50-VIS4 — layout por viewport, fixtures P50-F2 e P50-F5.
   Um gate POR viewport; cada um exercita as duas superfícies novas
   (assessment e results) e o mapa do assessment expandido. */
async function vis1to4(browser, pageErrors) {
  const gates = [];
  for (const vp of P50_VIEWPORTS) {
    const detail = [], observed = { viewport: vp.w + "x" + vp.h, label: vp.label, surfaces: [] };
    for (const fx of [FX.P50_F2, FX.P50_F5]) {
      const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      const localErrors = [];
      pg.on("pageerror", e => { localErrors.push(String(e.message)); pageErrors.push(vp.gate + "/" + fx.id + ": " + String(e.message)); });
      try {
        await pg.addInitScript(P50_PAGE_HELPERS);
        /* --- superfície de assessment --- */
        await applyFixture(pg, fx);
        const a = await p50MeasureSurface(pg, P50_SURFACE_ASSESSMENT);
        a.fixture = fx.id; a.surface = "assessment"; a.pageErrors = localErrors.slice();
        observed.surfaces.push(a);
        detail.push(...p50JudgeSurface(fx.id + "/assessment@" + vp.w, a));
        await shotViewport(pg, "P50-5.0.5-vis-assessment-" + fx.id + "-" + vp.w + ".png");

        /* --- mapa expandido: nenhum dado sai de alcance ao abrir a sidebar --- */
        await pg.evaluate(() => {
          const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
          if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
        });
        await pg.waitForTimeout(120);
        const sb = await p50MeasureSurface(pg, {
          id: "sidebar",
          required: [
            { sel: '#p50-shell [data-p50="sidebar"]', min: 1 },
            { sel: '#p50-shell [data-p50="domain"]', min: 5 },
            { sel: '#p50-shell [data-p50="q"]', min: 15 }
          ],
          textScope: '#p50-shell [data-p50="sidebar"] *'
        });
        sb.fixture = fx.id; sb.surface = "sidebar-expanded";
        observed.surfaces.push(sb);
        detail.push(...p50JudgeSurface(fx.id + "/sidebar@" + vp.w, sb));

        /* --- superfície de results, todas as tabs --- */
        await applyResults(pg, fx);
        for (const tab of ["resumo", "dominios", "heatmap", "analise"]) {
          await selectTab(pg, tab);
          const r = await p50MeasureSurface(pg, p50ResultsSurfaceFor(tab));
          r.fixture = fx.id; r.surface = "results/" + tab;
          observed.surfaces.push(r);
          detail.push(...p50JudgeSurface(fx.id + "/results:" + tab + "@" + vp.w, r));
        }
        await selectTab(pg, "resumo");
        await shotViewport(pg, "P50-5.0.5-vis-results-" + fx.id + "-" + vp.w + ".png");
        if (localErrors.length)
          detail.push(fx.id + "@" + vp.w + ": pageErrors " + JSON.stringify(localErrors));
      } catch (e) {
        detail.push(fx.id + "@" + vp.w + ": exceção " + String(e.message).split("\n")[0]);
      } finally { await pg.close(); }
    }
    const ok = detail.length === 0;
    results.push({ id: vp.gate, ok });
    console.log((ok ? "PASS" : "FAIL") + "  " + vp.gate + " — layout utilizável em " + vp.w + "×" + vp.h +
      " (" + vp.label + "): zero overflow horizontal, controles essenciais alcançáveis, nenhum texto funcional clipado" +
      (ok ? "" : " [" + detail.join(" · ") + "]"));
    gates.push({ gate: vp.gate, ok, detail, observed });
  }
  return gates;
}

/* ---------------------------------------------------------------------------
   Fluxo crítico navegável por teclado. É a mesma lista para P50-VIS5 (foco
   visível), P50-ACC3 (ordem de foco) e P50-ACC4 (target size): um único
   inventário evita que um gate meça o que o outro não mede.
--------------------------------------------------------------------------- */
const P50_CRITICAL_SELECTOR = [
  "#p50-shell .p50-nav .p50-btn",
  '#p50-shell button[data-p50="sidebar-toggle"]',
  "#app .opts .opt",
  "#notetgl",
  "#notetxt",
  "#prev", "#next",
  "#ses-export", "#ses-import",
  '#p50-results [data-p50="tab"]',
  '#p50-results [data-p50="panel"]',
  '#p50-results [data-p50="alt-region"]'
].join(", ");

/* Percorre a página SÓ por teclado e devolve, passo a passo, o elemento
   focado com o diagnóstico do seu indicador de foco. */
async function p50TabWalk(page, maxSteps) {
  await page.evaluate(() => {
    /* Ponto de partida determinístico. `blur()` NÃO basta: o Chromium guarda um
       "sequential focus navigation starting point" definido pelo último CLIQUE,
       de modo que o Tab seguinte retomava do meio da página e a travessia
       terminava em duas paradas — o gate media quase nada sem acusar nada.
       Focar o <body> explicitamente reposiciona esse ponto no início. */
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    window.scrollTo(0, 0);
    const b = document.body;
    const had = b.hasAttribute("tabindex");
    b.setAttribute("tabindex", "-1");
    b.focus();
    if (!had) b.removeAttribute("tabindex");
  });
  const seen = [];
  let leftDocument = 0;
  for (let i = 0; i < maxSteps; i++) {
    await page.keyboard.press("Tab");
    const step = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      const st = getComputedStyle(el);
      const b = el.getBoundingClientRect();

      /* indicador NOMINAL: outline, box-shadow ou border. */
      const outlineW = parseFloat(st.outlineWidth) || 0;
      const outlineC = window.__p50color(st.outlineColor);
      const hasOutline = st.outlineStyle !== "none" && outlineW > 0 && outlineC && outlineC.a > 0;
      const shadow = st.boxShadow && st.boxShadow !== "none" ? st.boxShadow : null;
      const shadowC = shadow ? window.__p50color((shadow.match(/rgba?\([^)]+\)/) || [])[0]) : null;
      const borderW = Math.max(parseFloat(st.borderTopWidth) || 0, parseFloat(st.borderLeftWidth) || 0);
      const borderC = window.__p50color(st.borderTopColor);
      const hasBorder = st.borderTopStyle !== "none" && borderW > 0 && borderC && borderC.a > 0;

      let indicator = null;
      if (hasOutline) indicator = { kind: "outline", width: outlineW, color: st.outlineColor, style: st.outlineStyle };
      else if (shadow && shadowC && shadowC.a > 0) indicator = { kind: "box-shadow", width: null, color: (shadow.match(/rgba?\([^)]+\)/) || [])[0], style: shadow };
      else if (hasBorder) indicator = { kind: "border", width: borderW, color: st.borderTopColor, style: st.borderTopStyle };

      /* adjacências: fundo do próprio elemento e do entorno imediato. */
      const own = window.__p50bg(el);
      const around = el.parentElement ? window.__p50bg(el.parentElement) : own;

      /* clipping: o anel de foco precisa caber dentro de todo ancestral que
         corta overflow, e o elemento precisa estar dentro do viewport depois
         do scroll automático que o próprio foco provoca. */
      const pad = (indicator && indicator.width ? indicator.width : 2) + (parseFloat(st.outlineOffset) || 0);
      let clippedBy = null;
      for (let p = el.parentElement; p && !clippedBy; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.overflowX === "hidden" || ps.overflowY === "hidden") {
          const pb = p.getBoundingClientRect();
          if (b.left - pad < pb.left - 1 || b.right + pad > pb.right + 1 ||
              b.top - pad < pb.top - 1 || b.bottom + pad > pb.bottom + 1) clippedBy = window.__p50sel(p);
        }
      }
      const outOfViewport = b.right < 0 || b.bottom < 0 || b.left > innerWidth || b.top > innerHeight;

      return {
        sel: window.__p50sel(el),
        tag: el.tagName,
        critical: el.matches(window.__p50critical),
        focusVisible: (function () { try { return el.matches(":focus-visible"); } catch (e) { return null; } })(),
        indicator,
        ownBackground: own, aroundBackground: around,
        box: { l: +b.left.toFixed(1), t: +b.top.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) },
        clippedBy, outOfViewport,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40)
      };
    });
    /* Sair do documento (chrome do browser / barra de endereço) é etapa normal
       do ciclo, não fim da travessia: mais um Tab reentra no início da página.
       Só duas saídas consecutivas indicam que não há mais o que percorrer. */
    if (!step) { if (++leftDocument >= 2) break; continue; }
    leftDocument = 0;
    if (seen.length && step.sel === seen[0].sel) break;       /* ciclo completo */
    seen.push(step);
  }
  return seen;
}

/* P50-VIS5 — foco visível em todo o fluxo crítico, por teclado.
   Contraste do indicador >= 3:1 contra as adjacências (fundo próprio e do
   entorno). Diagnóstico POR ELEMENTO, nunca booleano global. */
async function vis5(browser, pageErrors) {
  const detail = [], observed = { cases: [] };
  const CASES = [
    { fx: FX.P50_F2, id: "P50-F2", vp: { width: 1440, height: 900 }, screen: "assessment" },
    { fx: FX.P50_F2, id: "P50-F2", vp: { width: 390, height: 844 }, screen: "assessment" },
    { fx: FX.P50_F5, id: "P50-F5", vp: { width: 1440, height: 900 }, screen: "results" },
    { fx: FX.P50_F5, id: "P50-F5", vp: { width: 390, height: 844 }, screen: "results" }
  ];
  /* PROVA ANTI-VACUIDADE: sem um piso de cobertura, uma travessia que não
     alcança nada passa por "nenhuma falha". O gate declara nominalmente o que
     PRECISA ter sido focado em cada superfície; não alcançar é FAIL. */
  const MUST_REACH = {
    assessment: [
      { label: "botões de navegação do shell P50", re: /^button.*p50-btn/ },
      { label: "answer cards congelados", re: /^button\.opt/, min: 5 },
      { label: "controle único de evidência (#notetgl)", re: /^button#notetgl$/ },
      { label: "controle congelado de nota (#notetgl)", re: /^button#notetgl$/ },
      { label: "campo de nota congelado (#notetxt)", re: /^textarea#notetxt$/ },
      { label: "avanço congelado (#next)", re: /^button#next$/ }
    ],
    results: [
      { label: "tab selecionada de Results", re: /^button#p50-tab-/ },
      { label: "painel de Results", re: /^div#p50-panel-/ },
      { label: "região rolável da alternativa acessível", re: /alt-region/ },
      { label: "exportar sessão", re: /^button#ses-export$/ },
      { label: "importar sessão", re: /^button#ses-import$/ }
    ]
  };
  for (const c of CASES) {
    const pg = await browser.newPage({ viewport: c.vp });
    pg.on("pageerror", e => pageErrors.push("P50-VIS5/" + c.id + "@" + c.vp.width + ": " + String(e.message)));
    const tag = c.id + "/" + c.screen + "@" + c.vp.width;
    const elements = [];
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      await pg.addInitScript("window.__p50critical = " + JSON.stringify(P50_CRITICAL_SELECTOR) + ";");
      if (c.screen === "assessment") {
        await applyFixture(pg, c.fx);
        await pg.evaluate(() => {                       /* mapa aberto: mais controles no fluxo */
          const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
          if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
        });
        await pg.evaluate(() => { const t = document.getElementById("notetgl"); if (t) t.click(); });
        await pg.waitForTimeout(150);
        await p50Settle(pg);
      } else {
        await applyResults(pg, c.fx);
        await p50Settle(pg);
      }
      /* Na superfície de resultados, cada tab expõe controles próprios (o
         padrão ARIA mantém as demais `hidden`): uma travessia só cobriria uma
         das quatro visões. Percorre-se cada tab e agregam-se as paradas. */
      let walk = [];
      const walkTabs = (c.screen === "results") ? ["resumo", "dominios", "heatmap", "analise"] : [null];
      for (const tb of walkTabs) {
        if (tb) { await selectTab(pg, tb); await p50Settle(pg); }
        const w = await p50TabWalk(pg, 90);
        w.forEach(st => { if (!walk.some(x => x.sel === st.sel)) walk.push(st); });
      }
      const crit = walk.filter(s => s.critical);
      if (!crit.length) detail.push(tag + ": nenhum controle do fluxo crítico foi alcançado por Tab");
      /* piso de cobertura declarado */
      (MUST_REACH[c.screen] || []).forEach(req => {
        const hits = crit.filter(s => req.re.test(s.sel)).length;
        if (hits < (req.min || 1))
          detail.push(tag + ": cobertura insuficiente — " + req.label + " alcançado " + hits +
            "x por Tab (mínimo " + (req.min || 1) + ")");
      });
      crit.forEach(s => {
        const rec = { case: tag, sel: s.sel, focusVisible: s.focusVisible, indicator: s.indicator,
                      box: s.box, clippedBy: s.clippedBy, contrast: null, verdict: "PASS" };
        const fails = [];
        if (s.focusVisible !== true) fails.push(":focus-visible=" + s.focusVisible);
        if (!s.indicator) fails.push("sem indicador nominal (outline/box-shadow/border)");
        else {
          if (s.indicator.width !== null && !(s.indicator.width > 0)) fails.push("espessura computada 0");
          const ind = p50ParseColor(s.indicator.color);
          if (!ind || ind.a === 0) fails.push("indicador transparente");
          else {
            const own = p50Composite(ind, s.ownBackground.rgb);
            const around = p50Composite(ind, s.aroundBackground.rgb);
            const rOwn = p50Ratio(own, s.ownBackground.rgb);
            const rAround = p50Ratio(around, s.aroundBackground.rgb);
            rec.contrast = {
              indicatorColor: s.indicator.color,
              ownBackground: "rgb(" + s.ownBackground.rgb.join(",") + ")", ratioOwn: rOwn,
              aroundBackground: "rgb(" + s.aroundBackground.rgb.join(",") + ")", ratioAround: rAround,
              threshold: 3
            };
            if (rOwn < 3) fails.push("contraste " + rOwn + ":1 contra o fundo próprio (< 3:1)");
            if (rAround < 3) fails.push("contraste " + rAround + ":1 contra o entorno (< 3:1)");
          }
        }
        if (s.clippedBy) fails.push("indicador clipado por " + s.clippedBy);
        if (s.outOfViewport) fails.push("elemento focado fora do viewport após o scroll de foco");
        if (fails.length) { rec.verdict = "FAIL"; rec.failures = fails; detail.push(tag + " · " + s.sel + ": " + fails.join("; ")); }
        elements.push(rec);
      });
      observed.cases.push({ case: tag, tabStops: walk.length, criticalStops: crit.length,
                            coverageFloor: (MUST_REACH[c.screen] || []).map(r => r.label), elements });
      writeEvidence("P50-VIS5-focus-" + c.id + "-" + c.vp.width + ".json",
        JSON.stringify({
          gate: "P50-VIS5", microfase: "5.0.5", fixture: c.id, surface: c.screen,
          viewport: c.vp.width + "x" + c.vp.height,
          method: "travessia EXCLUSIVAMENTE por teclado (Tab), com o ponto de partida de navegação " +
                  "sequencial reposicionado no <body> e o ciclo percorrido por inteiro; nas telas de " +
                  "resultados, uma travessia por tab. Indicador nominal = outline | box-shadow | border; " +
                  "contraste do indicador composto sobre o fundo efetivo, limiar 3:1",
          coverageFloor: (MUST_REACH[c.screen] || []).map(r => ({ label: r.label, min: r.min || 1 })),
          tabStops: walk.map(s => s.sel), elements,
          verdict: elements.every(e => e.verdict === "PASS") ? "PASS" : "FAIL"
        }, null, 2) + "\n");
    } catch (e) {
      detail.push(tag + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await pg.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-VIS5", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-VIS5 — foco visível e contrastado (>= 3:1) em todo o fluxo crítico, só por teclado" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P50-VIS6 — robustez a zoom de página 200% em 1366×768.
   Zoom de página a 200% divide por 2 o viewport em pixels CSS e dobra o
   deviceScaleFactor: 1366×768 @200% == 683×384 CSS com DSF 2. É a emulação
   fiel do zoom do browser, não um `transform:scale` sobre o conteúdo. */
async function vis6(browser, pageErrors) {
  const detail = [], observed = { basis: "1366x768 @ zoom 200% => 683x384 CSS, deviceScaleFactor 2", cases: [] };
  for (const fx of [FX.P50_F2, FX.P50_F5]) {
    const ctx = await browser.newContext({ viewport: { width: 683, height: 384 }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    pg.on("pageerror", e => pageErrors.push("P50-VIS6/" + fx.id + ": " + String(e.message)));
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      await applyFixture(pg, fx);
      const a = await p50MeasureSurface(pg, P50_SURFACE_ASSESSMENT);
      a.fixture = fx.id; a.surface = "assessment@zoom200";
      observed.cases.push(a);
      detail.push(...p50JudgeSurface(fx.id + "/assessment@zoom200", a));
      await shotViewport(pg, "P50-5.0.5-zoom200-assessment-" + fx.id + ".png");
      await applyResults(pg, fx);
      for (const tab of ["resumo", "dominios", "heatmap", "analise"]) {
        await selectTab(pg, tab);
        const r = await p50MeasureSurface(pg, p50ResultsSurfaceFor(tab));
        r.fixture = fx.id; r.surface = "results:" + tab + "@zoom200";
        observed.cases.push(r);
        detail.push(...p50JudgeSurface(fx.id + "/results:" + tab + "@zoom200", r));
      }
      await selectTab(pg, "resumo");
      await shotViewport(pg, "P50-5.0.5-zoom200-results-" + fx.id + ".png");
    } catch (e) {
      detail.push(fx.id + "@zoom200: exceção " + String(e.message).split("\n")[0]);
    } finally { await ctx.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-VIS6", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-VIS6 — zoom de página 200% em 1366×768: zero overflow horizontal, zero clipping do fluxo crítico" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* ---------------------------------------------------------------------------
   P50-ACC1 · baseline automatizado com axe-core (§25.7).
   Pacote e versão são FIXADOS pela spec: @axe-core/playwright 4.13.0. O gate
   confere a versão instalada antes de executar — rodar com outra versão é
   FAIL, não "PASS com ressalva". Nenhum byte de axe entra no HTML: a
   dependência é devDependency e o lint de fronteira do P50 CORE prova que
   nenhum módulo de produção a referencia.
   Escopo DOM: SOMENTE os containers da Camada 5 (include por seletor).
--------------------------------------------------------------------------- */
const P50_AXE_VERSION = "4.13.0";
const P50_AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const P50_AXE_CONTAINERS = ["#p50-shell", "#p50-suff", "#p50-results",
                            "#app .p50-chips", "#app .p50-cueblock", ".p50-ses"];

/* Limitações formalmente aceitas: LISTA VAZIA. Por decisão normativa, uma
   violação critical/serious só sai da conta com entrada nominal
   (ruleId + seletor + justificativa) aprovada pelo proprietário. Não existe
   desabilitação de regra inteira e não existe aceite implícito. */
const P50_AXE_ACCEPTED = [];

async function acc1(browser, pageErrors) {
  const detail = [], observed = { runs: [], accepted: P50_AXE_ACCEPTED };
  let AxeBuilder = null, axeVersion = null;
  try {
    const mod = require("@axe-core/playwright");
    AxeBuilder = mod.default || mod.AxeBuilder || mod;
    /* O pacote publica um mapa `exports` que não expõe ./package.json; a
       versão é lida do arquivo instalado, que é a fonte real da resolução. */
    axeVersion = JSON.parse(fs.readFileSync(
      path.join(__dirname, "node_modules", "@axe-core", "playwright", "package.json"), "utf8")).version;
  } catch (e) {
    detail.push("dependência @axe-core/playwright ausente: " + String(e.message).split("\n")[0]);
  }
  if (AxeBuilder && axeVersion !== P50_AXE_VERSION)
    detail.push("versão de axe divergente da fixada pela spec: instalada " + axeVersion + " != " + P50_AXE_VERSION);

  if (AxeBuilder && !detail.length) {
    const FIXTURES = [
      { fx: FX.P50_F2, id: "P50-F2" },
      { fx: FX.P50_F5, id: "P50-F5" },
      { fx: FX.P50_F6, id: "P50-F6" }
    ];
    for (const f of FIXTURES) {
      for (const vp of P50_VIEWPORTS) {
        /* AxeBuilder exige uma page vinda de contexto EXPLÍCITO: ele instala o
           axe por `context.addInitScript`, o que o contexto implícito de
           `browser.newPage()` não aceita. Sem isto o gate morre com
           "Please use browser.newContext()" e nada seria medido. */
        const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
        const pg = await ctx.newPage();
        pg.on("pageerror", e => pageErrors.push("P50-ACC1/" + f.id + "@" + vp.w + ": " + String(e.message)));
        const tag = f.id + "@" + vp.w;
        const scans = [];
        try {
          /* varredura 1 · superfície de assessment, com o mapa aberto e o
             campo de evidência visível (mais nós reais sob análise). */
          await applyFixture(pg, f.fx);
          await pg.evaluate(() => {
            const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
            if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
            const n = document.getElementById("notetgl"); if (n) n.click();
          });
          const settleA = await p50Settle(pg);
          scans.push(Object.assign(await p50AxeScan(AxeBuilder, pg, "assessment"), { settle: settleA }));

          /* varredura 2 · superfície de results, tab a tab. */
          await applyResults(pg, f.fx);
          for (const tab of ["resumo", "dominios", "heatmap", "analise"]) {
            await selectTab(pg, tab);
            const st = await p50Settle(pg);
            scans.push(Object.assign(await p50AxeScan(AxeBuilder, pg, "results:" + tab), { settle: st }));
          }
        } catch (e) {
          detail.push(tag + ": exceção " + String(e.message).split("\n")[0]);
        } finally { await ctx.close(); }

        const blocking = [];
        scans.forEach(sc => (sc.violations || []).forEach(v => {
          if (v.impact !== "critical" && v.impact !== "serious") return;
          v.nodes.forEach(n => {
            const target = (n.target || []).join(" ");
            const acc = P50_AXE_ACCEPTED.some(a => a.ruleId === v.id && a.selector === target);
            if (!acc) blocking.push({ surface: sc.surface, ruleId: v.id, impact: v.impact, selector: target, help: v.help });
          });
        }));
        blocking.forEach(b => detail.push(tag + " · " + b.surface + " · " + b.ruleId +
          " (" + b.impact + ") em " + b.selector));
        const run = {
          fixture: f.id, viewport: vp.w + "x" + vp.h, scans,
          blockingViolations: blocking, verdict: blocking.length ? "FAIL" : "PASS"
        };
        observed.runs.push({ fixture: f.id, viewport: vp.w + "x" + vp.h,
          surfaces: scans.map(s => ({ surface: s.surface, violations: (s.violations || []).length,
            criticalSerious: (s.violations || []).filter(v => v.impact === "critical" || v.impact === "serious").length,
            passes: s.passCount, incomplete: s.incompleteCount })),
          blocking: blocking.length });
        writeEvidence("P50-ACC1-axe-" + f.id + "-" + vp.w + ".json",
          JSON.stringify({
            gate: "P50-ACC1", microfase: "5.0.5",
            package: "@axe-core/playwright", version: axeVersion,
            axeCore: (scans[0] && scans[0].testEngine) || null,
            tags: P50_AXE_TAGS, containers: P50_AXE_CONTAINERS,
            blockingImpacts: ["critical", "serious"],
            acceptedLimitations: P50_AXE_ACCEPTED,
            run
          }, null, 2) + "\n");
      }
    }
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-ACC1", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC1 — axe-core " + (axeVersion || "?") +
    " · zero violações critical/serious nos containers da Camada 5 (3 fixtures × 4 viewports)" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed, axeVersion };
}

/* Uma varredura axe restrita aos containers da Camada 5 PRESENTES na tela. */
async function p50AxeScan(AxeBuilder, page, surface) {
  const present = await page.evaluate(list => list.filter(s => document.querySelector(s)), P50_AXE_CONTAINERS);
  if (!present.length) return { surface, violations: [], passCount: 0, incompleteCount: 0, containers: [], note: "nenhum container da Camada 5 nesta tela" };
  let builder = new AxeBuilder({ page }).withTags(P50_AXE_TAGS);
  present.forEach(sel => { builder = builder.include(sel); });
  const r = await builder.analyze();
  return {
    surface, containers: present,
    testEngine: r.testEngine || null,
    passCount: (r.passes || []).length,
    incompleteCount: (r.incomplete || []).length,
    violations: (r.violations || []).map(v => ({
      id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
      nodes: (v.nodes || []).map(n => ({ target: n.target, html: String(n.html || "").slice(0, 220), failureSummary: n.failureSummary }))
    }))
  };
}

/* ---------------------------------------------------------------------------
   P50-ACC2 · fluxo canônico SÓ por teclado.
   A spec pede `responder 3 perguntas -> registrar 1 nota -> navegar a Results`.
   O runtime congelado só publica Results depois das 15 perguntas (RESULTS_STEP
   = QS.length + 2): não existe atalho e criar um seria mudança de produto. O
   fluxo executado portanto CONTÉM o exigido e o excede — 3 perguntas com nota
   na primeira, seguidas da navegação, sempre por teclado, até Results.
   Nenhum setter de teste (`window.__DEV.*`) participa do caminho de teclado:
   só teclas reais. O oráculo é `captureCanonicalInputs()` (P50-UX9), comparado
   com o MESMO fluxo executado por mouse.
--------------------------------------------------------------------------- */
const P50_ACC2_LEVELS = [1, 2, 0, 3, 1, 2, 0, 3, 1, 2, 3, 0, 1, 2, 3];  /* níveis canônicos 0..3 */
const P50_ACC2_NOTE = "Evidencia registrada por teclado no fluxo P50-ACC2.";

/* Tab até que o elemento focado case com o seletor. Se a travessia inteira
   não alcançar o controle, isso É o achado: o controle não é acessível por
   teclado. Nunca usa page.focus(), que seria foco programático. */
async function p50TabUntil(page, selector, maxSteps) {
  for (let i = 0; i < (maxSteps || 60); i++) {
    await page.keyboard.press("Tab");
    const hit = await page.evaluate(sel => {
      const a = document.activeElement;
      return !!(a && a.nodeType === 1 && a.matches(sel));
    }, selector);
    if (hit) return i + 1;
  }
  return -1;
}

async function p50Acc2Keyboard(page, trace) {
  await page.goto(HTML_URL);
  await page.waitForTimeout(120);
  await page.keyboard.press("Enter");                 /* home -> arquétipo */
  await page.waitForTimeout(100);
  await page.keyboard.press("1");                     /* arquétipo canônico 0 */
  await page.waitForTimeout(80);
  await page.keyboard.press("Enter");                 /* -> pergunta 1 */
  await page.waitForTimeout(120);
  for (let q = 0; q < P50_ACC2_LEVELS.length; q++) {
    await page.keyboard.press(String(P50_ACC2_LEVELS[q] + 1));   /* 1..4 == níveis 0..3 */
    await page.waitForTimeout(70);
    if (q === 0) {
      const t1 = await p50TabUntil(page, "#notetgl", 60);
      if (t1 < 0) { trace.push("teclado: #notetgl inalcançável por Tab"); return false; }
      await page.keyboard.press(" ");                 /* Space aciona o botão sem colidir com o Enter global */
      await page.waitForTimeout(150);
      const t2 = await p50TabUntil(page, "#notetxt", 60);
      if (t2 < 0) { trace.push("teclado: #notetxt inalcançável por Tab com o painel aberto"); return false; }
      await page.keyboard.type(P50_ACC2_NOTE);
      await page.waitForTimeout(80);
      const t3 = await p50TabUntil(page, "#notetgl", 60);
      if (t3 < 0) { trace.push("teclado: #notetgl inalcançável para fechar o painel"); return false; }
      await page.keyboard.press(" ");
      await page.waitForTimeout(150);
      trace.push("teclado: nota registrada em " + t1 + "/" + t2 + "/" + t3 + " tabulações");
    }
    await page.keyboard.press("Enter");               /* avança pelo handler congelado */
    await page.waitForTimeout(90);
  }
  /* Depois da última pergunta o runtime congelado interpõe etapas próprias
     (ramo de aprofundamento e/ou priorização). Nenhuma prioridade é escolhida:
     Enter apenas segue adiante — exatamente o que o fluxo por mouse fará. */
  const steps = [];
  for (let i = 0; i < 6; i++) {
    const at = await page.evaluate(() => ({
      results: !!document.getElementById("p50-results"),
      screen: document.body.dataset.uxscreen || null
    }));
    steps.push(at.screen);
    if (at.results) break;
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
  }
  trace.push("teclado: telas após a última pergunta = " + steps.join(" -> "));
  return await page.evaluate(() => !!document.getElementById("p50-results"));
}

async function p50Acc2Mouse(page, trace) {
  await page.goto(HTML_URL);
  await page.waitForTimeout(120);
  await page.click("#start");
  await page.waitForTimeout(100);
  await page.click("#app .opts .opt:nth-child(1)");   /* arquétipo canônico 0 */
  await page.waitForTimeout(80);
  await page.click("#next");
  await page.waitForTimeout(120);
  for (let q = 0; q < P50_ACC2_LEVELS.length; q++) {
    await page.click("#app .opts .opt:nth-child(" + (P50_ACC2_LEVELS[q] + 1) + ")");
    await page.waitForTimeout(70);
    if (q === 0) {
      await page.click("#notetgl");
      await page.waitForTimeout(150);
      await page.click("#notetxt");
      await page.keyboard.type(P50_ACC2_NOTE);
      await page.waitForTimeout(80);
      await page.click("#notetgl");
      await page.waitForTimeout(150);
    }
    await page.click("#next");
    await page.waitForTimeout(90);
  }
  /* O runtime congelado usa controles DIFERENTES por etapa: `#next` na
     pergunta e na priorização, `#ref-skip-all` no ramo de aprofundamento.
     O fluxo por mouse precisa espelhar o de teclado até Results — comparar um
     estado final alcançado só de um dos lados enfraqueceria o oráculo. */
  const steps = [];
  for (let i = 0; i < 6; i++) {
    const at = await page.evaluate(() => {
      const first = ["#next", "#ref-skip-all", "#skip"].find(sel => document.querySelector(sel));
      return { results: !!document.getElementById("p50-results"),
               screen: document.body.dataset.uxscreen || null, advance: first || null };
    });
    steps.push(at.screen + (at.advance ? "(" + at.advance + ")" : ""));
    if (at.results || !at.advance) break;
    await page.click(at.advance);
    await page.waitForTimeout(200);
  }
  trace.push("mouse: telas após a última pergunta = " + steps.join(" -> "));
  return await page.evaluate(() => !!document.getElementById("p50-results"));
}

async function acc2(browser, pageErrors) {
  const detail = [], trace = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("P50-ACC2: " + String(e.message)));
  try {
    await pg.addInitScript(P50_PAGE_HELPERS);
    const kbSurface = await p50Acc2Keyboard(pg, trace);
    const kb = await pg.evaluate(() => ({
      inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
      resultsSurface: !!document.getElementById("p50-results"),
      suffSurface: !!document.getElementById("p50-suff")
    }));
    await shotViewport(pg, "P50-5.0.5-acc2-keyboard-results-1440.png");
    const msSurface = await p50Acc2Mouse(pg, trace);
    const ms = await pg.evaluate(() => ({
      inputs: JSON.stringify(window.__DEV.captureCanonicalInputs()),
      resultsSurface: !!document.getElementById("p50-results")
    }));
    observed.trace = trace;
    observed.keyboard = { reachedResultsSurface: kbSurface, suffSurface: kb.suffSurface };
    observed.mouse = { reachedResultsSurface: msSurface };
    observed.canonicalInputsEqual = kb.inputs === ms.inputs;
    try { observed.canonicalInputs = JSON.parse(kb.inputs).assessment; } catch (e) { observed.canonicalInputs = null; }
    if (!kbSurface) detail.push("fluxo por teclado não alcançou a superfície nova de Results");
    if (!msSurface) detail.push("fluxo por mouse não alcançou a superfície nova de Results (comparação assimétrica)");
    if (!kb.suffSurface) detail.push("painel de suficiência ausente após o fluxo por teclado");
    if (kb.inputs !== ms.inputs) {
      detail.push("estado canônico divergente entre teclado e mouse");
      observed.keyboardInputs = kb.inputs; observed.mouseInputs = ms.inputs;
    }
    const noteOk = /Evidencia registrada por teclado/.test(kb.inputs);
    if (!noteOk) detail.push("nota digitada por teclado não chegou ao owner canônico notes");
    writeEvidence("P50-5.0.5-acc2-keyboard-equivalence.json",
      JSON.stringify({
        gate: "P50-ACC2", microfase: "5.0.5",
        oracle: "captureCanonicalInputs() (ui_session_v32.js) — cinco owners canônicos",
        flowRequested: "responder 3 perguntas -> registrar 1 nota -> navegar a Results",
        flowExecuted: "15 perguntas (o runtime congelado só publica Results em RESULTS_STEP), " +
                      "nota na 1ª pergunta, priorização atravessada, tudo por teclado",
        keyboardOnly: "nenhum window.__DEV.* e nenhum page.focus() no caminho de teclado",
        observed, verdict: detail.length ? "FAIL" : "PASS"
      }, null, 2) + "\n");
  } catch (e) {
    detail.push("exceção " + String(e.message).split("\n")[0]);
  } finally { await pg.close(); }
  const ok = detail.length === 0;
  results.push({ id: "P50-ACC2", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC2 — fluxo canônico completo só por teclado, estado idêntico ao do mouse" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* ---------------------------------------------------------------------------
   P50-ACC3 · ordem de foco.
   Duas obrigações: (a) a ordem de tabulação acompanha a ordem VISUAL/semântica
   (documento), e (b) não existe armadilha de foco. As tabs de Results seguem
   o padrão ARIA de tablist — uma única parada de Tab e navegação por setas —,
   o que NÃO é violação de ordem e é verificado como tal, não ignorado.
--------------------------------------------------------------------------- */
async function acc3(browser, pageErrors) {
  const detail = [], observed = { cases: [] };
  const CASES = [
    { fx: FX.P50_F2, id: "P50-F2", screen: "assessment" },
    { fx: FX.P50_F5, id: "P50-F5", screen: "results" }
  ];
  for (const c of CASES) {
    const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    pg.on("pageerror", e => pageErrors.push("P50-ACC3/" + c.id + ": " + String(e.message)));
    const tag = c.id + "/" + c.screen;
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      await pg.addInitScript("window.__p50critical = " + JSON.stringify(P50_CRITICAL_SELECTOR) + ";");
      if (c.screen === "assessment") {
        await applyFixture(pg, c.fx);
        await pg.evaluate(() => {
          const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
          if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
        });
        await pg.waitForTimeout(120);
      } else {
        await applyResults(pg, c.fx);
      }

      /* (a) ordem de tabulação × ordem do documento */
      const walk = await p50TabWalk(pg, 80);
      const order = await pg.evaluate(sels => {
        /* posição no documento de cada parada, na ordem em que o Tab as visitou */
        const all = Array.from(document.querySelectorAll("*"));
        return sels.map(s => {
          const el = Array.from(document.querySelectorAll("*")).find(e => window.__p50sel(e) === s);
          return { sel: s, docIndex: el ? all.indexOf(el) : -1,
                   top: el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1,
                   left: el ? Math.round(el.getBoundingClientRect().left) : -1 };
        });
      }, walk.map(s => s.sel));
      const known = order.filter(o => o.docIndex >= 0);
      const inversions = [];
      for (let i = 1; i < known.length; i++)
        if (known[i].docIndex < known[i - 1].docIndex)
          inversions.push(known[i - 1].sel + " -> " + known[i].sel +
            " (doc " + known[i - 1].docIndex + " -> " + known[i].docIndex + ")");
      if (inversions.length)
        detail.push(tag + ": ordem de Tab diverge da ordem do documento: " + inversions.join(" · "));

      /* (b) ausência de armadilha: a travessia fecha o ciclo e Shift+Tab volta */
      const cycled = walk.length > 1 && walk.length < 80;
      if (!cycled) detail.push(tag + ": travessia não fechou o ciclo em 80 tabulações (possível armadilha de foco)");
      const back = await pg.evaluate(() => (document.activeElement ? window.__p50sel(document.activeElement) : null));
      await pg.keyboard.press("Shift+Tab");
      const afterBack = await pg.evaluate(() => (document.activeElement ? window.__p50sel(document.activeElement) : null));
      if (afterBack === back && back !== null)
        detail.push(tag + ": Shift+Tab não moveu o foco a partir de " + back + " (armadilha)");

      /* (c) tablist conforme padrão ARIA: uma parada só, setas navegam */
      let tabPattern = null;
      if (c.screen === "results") {
        const stops = walk.filter(s => /\[data-p50="tab"\]/.test(s.sel) || /p50-tab/.test(s.sel)).length;
        tabPattern = await pg.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('#p50-results [data-p50="tab"]'));
          return {
            count: btns.length,
            roving: btns.filter(b => b.getAttribute("tabindex") === "0").length,
            selected: btns.filter(b => b.getAttribute("aria-selected") === "true").length,
            list: !!document.querySelector('#p50-results [role="tablist"]'),
            panels: document.querySelectorAll('#p50-results [role="tabpanel"]').length
          };
        });
        tabPattern.tabStops = stops;
        if (tabPattern.roving !== 1)
          detail.push(tag + ": tablist com " + tabPattern.roving + " paradas de Tab (padrão ARIA exige exatamente 1)");
        if (tabPattern.selected !== 1)
          detail.push(tag + ": " + tabPattern.selected + " tabs com aria-selected=true");
        if (!tabPattern.list) detail.push(tag + ": role=tablist ausente");
        if (tabPattern.panels !== tabPattern.count)
          detail.push(tag + ": " + tabPattern.panels + " tabpanels para " + tabPattern.count + " tabs");
        /* setas realmente navegam (padrão ARIA), sem alterar estado canônico */
        const arrow = await pg.evaluate(() => {
          const before = JSON.stringify(window.__DEV.captureCanonicalInputs());
          const btns = Array.from(document.querySelectorAll('#p50-results [data-p50="tab"]'));
          btns[0].focus();
          btns[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
          const sel = document.querySelector('#p50-results [data-p50="tab"][aria-selected="true"]');
          return { moved: sel ? sel.getAttribute("data-p50-tab") : null,
                   canonicalUnchanged: before === JSON.stringify(window.__DEV.captureCanonicalInputs()) };
        });
        tabPattern.arrow = arrow;
        if (arrow.moved !== "dominios") detail.push(tag + ": ArrowRight no tablist selecionou '" + arrow.moved + "'");
        if (!arrow.canonicalUnchanged) detail.push(tag + ": navegação por setas alterou estado canônico");
      }
      observed.cases.push({ case: tag, tabStops: walk.map(s => s.sel), documentOrder: order,
                            inversions, cycled, tabPattern });
    } catch (e) {
      detail.push(tag + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await pg.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P50-ACC3", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC3 — ordem de foco coerente com a ordem visual/semântica; sem armadilha; tablist conforme ARIA" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* ---------------------------------------------------------------------------
   P50-ACC4 · contraste e target size dos componentes NOVOS.
   Contraste: toda combinação texto/fundo real da Camada 5, com o fundo
   EFETIVO resolvido na árvore e a cor do texto composta quando semitransparente.
   Limiar: 4.5:1 para texto normal, 3:1 para texto grande (>= 24px, ou >= 18.66px
   em peso >= 700 — definição WCAG, não estimativa).
   Target size: WCAG 2.2 AA (2.5.8) exige 24x24 CSS px; o conforto de notebook
   (44x44) é MEDIDO e registrado, mas o limiar de reprovação é o normativo.
--------------------------------------------------------------------------- */
const P50_INTERACTIVE_SELECTOR = [
  "#p50-shell button", "#p50-shell a[href]",
  "#notetgl",
  "#p50-results button", "#p50-results a[href]",
  ".p50-ses button"
].join(", ");

async function acc4(browser, pageErrors) {
  const detail = [], rows = [], targets = [];
  const CASES = [
    { fx: FX.P50_F2, id: "P50-F2", screen: "assessment", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F2, id: "P50-F2", screen: "assessment", vp: { width: 390, height: 844 } },
    { fx: FX.P50_F6, id: "P50-F6", screen: "assessment", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F5, id: "P50-F5", screen: "results", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F5, id: "P50-F5", screen: "results", vp: { width: 390, height: 844 } },
    { fx: FX.P50_F7, id: "P50-F7", screen: "results", vp: { width: 1440, height: 900 } },
    { fx: FX.P50_F9, id: "P50-F9", screen: "results", vp: { width: 1440, height: 900 } }
  ];
  const SCOPE = '#p50-shell, #p50-suff, #p50-results, #app .p50-chips, #app .p50-cueblock, .p50-ses';
  for (const c of CASES) {
    const pg = await browser.newPage({ viewport: c.vp });
    pg.on("pageerror", e => pageErrors.push("P50-ACC4/" + c.id + ": " + String(e.message)));
    const tag = c.id + "/" + c.screen + "@" + c.vp.width;
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      if (c.screen === "assessment") {
        await applyFixture(pg, c.fx);
        await pg.evaluate(() => {
          const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
          if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
          const n = document.getElementById("notetgl"); if (n) n.click();
        });
        await p50Settle(pg);
        rows.push(...await p50CollectContrast(pg, tag, SCOPE));
        targets.push(...await p50CollectTargets(pg, tag));
      } else {
        await applyResults(pg, c.fx);
        for (const tab of ["resumo", "dominios", "heatmap", "analise"]) {
          await selectTab(pg, tab);
          await p50Settle(pg);
          rows.push(...await p50CollectContrast(pg, tag + ":" + tab, SCOPE));
          targets.push(...await p50CollectTargets(pg, tag + ":" + tab));
        }
      }
    } catch (e) {
      detail.push(tag + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await pg.close(); }
  }
  /* deduplica por (seletor, cor, fundo, tamanho): a mesma regra medida em
     várias telas é UMA combinação, e a tabela fica legível para auditoria. */
  const seen = new Map();
  rows.forEach(r => { const k = [r.selector, r.foreground, r.background, r.fontSize, r.fontWeight, r.effectiveOpacity].join("|");
    if (!seen.has(k)) seen.set(k, r); else seen.get(k).cases.push(...r.cases); });
  const table = Array.from(seen.values()).map(r => {
    const fg = p50ParseColor(r.foreground), bg = p50ParseColor(r.background);
    const bgRGB = bg ? [bg.r, bg.g, bg.b] : [0, 0, 0];
    const op = (typeof r.effectiveOpacity === "number" && isFinite(r.effectiveOpacity)) ? r.effectiveOpacity : 1;
    const fgEff = fg ? { r: fg.r, g: fg.g, b: fg.b, a: fg.a * op } : null;
    const composed = p50Composite(fgEff, bgRGB);
    const ratio = composed ? p50Ratio(composed, bgRGB) : 0;
    const large = r.fontSize >= 24 || (r.fontSize >= 18.66 && r.fontWeight >= 700);
    const threshold = large ? 3 : 4.5;
    return { selector: r.selector, sample: r.sample, foreground: r.foreground, background: r.background,
             effectiveOpacity: op, fontSize: r.fontSize, fontWeight: r.fontWeight, large, ratio, threshold,
             verdict: ratio >= threshold ? "PASS" : "FAIL", cases: Array.from(new Set(r.cases)) };
  }).sort((a, b) => a.ratio - b.ratio);
  table.filter(t => t.verdict === "FAIL").forEach(t =>
    detail.push("contraste " + t.ratio + ":1 < " + t.threshold + ":1 em " + t.selector +
      " (" + t.foreground + " sobre " + t.background + ", " + t.fontSize + "px/" + t.fontWeight + ") '" + t.sample + "'"));

  const tseen = new Map();
  targets.forEach(t => { const k = t.selector + "|" + t.w + "x" + t.h;
    if (!tseen.has(k)) tseen.set(k, t); else tseen.get(k).cases.push(...t.cases); });
  const targetTable = Array.from(tseen.values()).map(t => ({
    selector: t.selector, sample: t.sample, width: t.w, height: t.h,
    minimumAA: 24, comfortable: 44,
    verdict: (t.w >= 24 && t.h >= 24) ? "PASS" : "FAIL",
    comfort: (t.w >= 44 && t.h >= 44) ? "confortável" : "abaixo do conforto de notebook (44px)",
    cases: Array.from(new Set(t.cases))
  })).sort((a, b) => (a.width * a.height) - (b.width * b.height));
  targetTable.filter(t => t.verdict === "FAIL").forEach(t =>
    detail.push("target size " + t.width + "×" + t.height + " < 24×24 em " + t.selector + " '" + t.sample + "'"));

  writeEvidence("P50-ACC4-contrast.json",
    JSON.stringify({
      gate: "P50-ACC4", microfase: "5.0.5",
      method: "fundo EFETIVO resolvido na árvore do DOM; cor de texto composta quando semitransparente " +
              "E multiplicada pela OPACIDADE acumulada dos ancestrais; medição feita com as animações " +
              "da Camada 1 em repouso (p50Settle); aritmética WCAG 2.x implementada no oráculo, nunca lida do produto",
      thresholds: { normalText: 4.5, largeText: 3, largeTextDefinition: ">= 24px, ou >= 18.66px com peso >= 700" },
      targetSize: { minimumAA: "24x24 CSS px (WCAG 2.2 · 2.5.8)", comfortReference: "44x44 (medido, não bloqueante)" },
      scope: SCOPE, interactiveScope: P50_INTERACTIVE_SELECTOR,
      contrastCombinations: table, interactiveTargets: targetTable,
      verdict: (table.every(t => t.verdict === "PASS") && targetTable.every(t => t.verdict === "PASS")) ? "PASS" : "FAIL"
    }, null, 2) + "\n");

  const ok = detail.length === 0;
  results.push({ id: "P50-ACC4", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-ACC4 — contraste (" + table.length + " combinações) e target size (" +
    targetTable.length + " controles) dos componentes novos" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed: { contrast: table, targets: targetTable } };
}

function p50CollectContrast(page, caseTag, scope) {
  return page.evaluate(([scope, tag]) => {
    const vis = e => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    const out = [];
    Array.from(document.querySelectorAll(scope)).forEach(root => {
      const nodes = [root].concat(Array.from(root.querySelectorAll("*")));
      nodes.forEach(e => {
        if (!vis(e)) return;
        if (e.getAttribute("aria-hidden") === "true") return;
        /* só nós com texto PRÓPRIO: medir um contêiner herdaria fonte errada */
        const own = Array.from(e.childNodes)
          .filter(n => n.nodeType === 3 && String(n.nodeValue).trim().length).map(n => n.nodeValue).join(" ").trim();
        if (!own) return;
        const st = getComputedStyle(e);
        if (st.visibility === "hidden" || st.opacity === "0") return;
        /* opacidade acumulada: um grupo com `opacity < 1` esmaece o TEXTO
           contra o que estiver atrás. Ignorá-la mediria uma cor que o usuário
           nunca vê — foi assim que uma violação real de contraste escapou ao
           oráculo próprio e só apareceu no axe. */
        let opacity = 1;
        for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
          const o = parseFloat(getComputedStyle(n).opacity);
          if (isFinite(o)) opacity *= o;
        }
        out.push({
          selector: window.__p50sel(e),
          sample: own.replace(/\s+/g, " ").slice(0, 44),
          foreground: st.color,
          background: "rgb(" + window.__p50bg(e).rgb.join(",") + ")",
          effectiveOpacity: Math.round(opacity * 1000) / 1000,
          fontSize: Math.round(parseFloat(st.fontSize) * 100) / 100,
          fontWeight: parseInt(st.fontWeight, 10) || 400,
          cases: [tag]
        });
      });
    });
    return out;
  }, [scope, caseTag]);
}

function p50CollectTargets(page, caseTag) {
  return page.evaluate(([sel, tag]) => {
    const out = [];
    Array.from(document.querySelectorAll(sel)).forEach(e => {
      if (!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)) return;
      if (e.disabled) return;
      const b = e.getBoundingClientRect();
      out.push({ selector: window.__p50sel(e),
                 sample: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
                 w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10, cases: [tag] });
    });
    return out;
  }, [P50_INTERACTIVE_SELECTOR, caseTag]);
}

/* ---------------------------------------------------------------------------
   P50-IC1 · P50-IC2 — ícone oficial em superfície nova (UI-031A · ICON-01).
   Nenhuma superfície P50 atual possui `itemId` canônico; renderizar ícones em
   alguma delas exigiria fabricar produto ou recomendação, o que é proibido.
   O que se prova, então, é o RENDERER REUTILIZÁVEL (`window.__P50.iconNode`):
   sobre uma fixture controlada de itemIds REAIS do runtime congelado, ele
   devolve exatamente o que `window.__V32UI.iconFor()` resolveu — asset oficial
   para produto com asset, fallback de iniciais para família e para `fortisat`.
   O oráculo NÃO é o renderer: é `iconFor()` chamado diretamente, mais o mapa
   congelado `ICONS_V32`, ambos lidos do runtime.
--------------------------------------------------------------------------- */
const P50_IC_ASSET_ITEMS = ["fortisiem", "fortianalyzer", "fortiedr", "fortisoar"];
const P50_IC_FALLBACK_ITEMS = ["fortisat", "endpoint-family", "fortimail-family",
                               "identity-family", "soc-platform-family"];

async function ic1ic2(browser, pageErrors) {
  const detail = [], observed = { asset: [], fallback: [], rendererPresent: false, noParallelSurface: null };
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("P50-IC1/IC2: " + String(e.message)));
  try {
    await applyFixture(pg, FX.P50_F5);
    const probe = await pg.evaluate(([assetIds, fbIds]) => {
      const P = window.__P50;
      if (!P || typeof P.iconNode !== "function") return { rendererPresent: false };
      const bridge = window.__V32UI;
      const off = (window.__DEV.V32 && window.__DEV.V32.OFFERINGS) || {};
      const host = document.createElement("div");           /* fora da árvore visível */
      const run = ids => ids.map(id => {
        const name = (off[id] || {}).name || id;
        const node = P.iconNode(id, name);
        if (node) { host.appendChild(node); }
        const raw = bridge.iconFor(id, name);               /* ORÁCULO: runtime congelado */
        return {
          itemId: id, name,
          rendered: node ? { tag: node.tagName, cls: node.getAttribute("class"),
                             src: node.getAttribute("src") || null,
                             dataIcon: node.getAttribute("data-icon"),
                             text: (node.textContent || ""),
                             alt: node.getAttribute("alt"),
                             ariaHidden: node.getAttribute("aria-hidden"),
                             childElements: node.childElementCount,
                             eventAttrs: Array.from(node.attributes).filter(a => /^on/i.test(a.name)).map(a => a.name) } : null,
          oracleMarkup: raw
        };
      });
      return {
        rendererPresent: true,
        asset: run(assetIds), fallback: run(fbIds),
        /* nenhuma superfície P50 VISÍVEL renderiza ícone: o renderer não é
           usado para fabricar seção decorativa (proibição explícita). */
        iconsInP50Surface: document.querySelectorAll(
          "#p50-shell .v32-icon, #p50-shell .v32-icon-fb, #p50-suff .v32-icon, #p50-suff .v32-icon-fb, " +
          "#p50-results .v32-icon, #p50-results .v32-icon-fb").length,
        frozenIconsStillRendered: document.querySelectorAll(".v32-cand .v32-icon, .v32-cand .v32-icon-fb").length
      };
    }, [P50_IC_ASSET_ITEMS, P50_IC_FALLBACK_ITEMS]);

    observed.rendererPresent = !!probe.rendererPresent;
    if (!probe.rendererPresent) {
      detail.push("window.__P50.iconNode ausente: renderer único de ícone não exposto");
    } else {
      observed.asset = probe.asset; observed.fallback = probe.fallback;
      observed.iconsInP50Surface = probe.iconsInP50Surface;
      /* P50-IC1 · asset oficial */
      probe.asset.forEach(r => {
        const m = String(r.oracleMarkup || "").match(/^<img class="v32-icon" alt="" data-icon="([^"]+)" src="([^"]+)">$/);
        if (!m) { detail.push("P50-IC1 " + r.itemId + ": iconFor() não resolveu asset oficial (oráculo: " +
          String(r.oracleMarkup).slice(0, 60) + ")"); return; }
        if (!r.rendered) { detail.push("P50-IC1 " + r.itemId + ": renderer devolveu null para item com asset oficial"); return; }
        if (r.rendered.tag !== "IMG" || r.rendered.cls !== "v32-icon")
          detail.push("P50-IC1 " + r.itemId + ": nó " + r.rendered.tag + "." + r.rendered.cls + " != img.v32-icon");
        if (r.rendered.src !== m[2])
          detail.push("P50-IC1 " + r.itemId + ": src divergente do asset congelado servido por ICONS_V32");
        if (r.rendered.dataIcon !== m[1])
          detail.push("P50-IC1 " + r.itemId + ": data-icon '" + r.rendered.dataIcon + "' != '" + m[1] + "'");
        if (r.rendered.eventAttrs.length)
          detail.push("P50-IC1 " + r.itemId + ": atributo de evento no nó: " + r.rendered.eventAttrs.join(","));
      });
      /* P50-IC2 · fallback determinístico, jamais asset de produto emprestado */
      probe.fallback.forEach(r => {
        if (!/^<span class="v32-icon-fb"/.test(String(r.oracleMarkup || ""))) {
          detail.push("P50-IC2 " + r.itemId + ": o runtime congelado NÃO produz fallback para este item — " +
            "a fixture pressupõe decisão congelada que mudou (oráculo: " + String(r.oracleMarkup).slice(0, 60) + ")");
          return;
        }
        if (!r.rendered) { detail.push("P50-IC2 " + r.itemId + ": renderer devolveu null para item de fallback"); return; }
        if (r.rendered.tag !== "SPAN" || r.rendered.cls !== "v32-icon-fb")
          detail.push("P50-IC2 " + r.itemId + ": nó " + r.rendered.tag + "." + r.rendered.cls + " != span.v32-icon-fb");
        if (r.rendered.src)
          detail.push("P50-IC2 " + r.itemId + ": fallback recebeu src de produto — ícone emprestado");
        if (r.rendered.dataIcon !== "fallback")
          detail.push("P50-IC2 " + r.itemId + ": data-icon '" + r.rendered.dataIcon + "' != 'fallback'");
        const ini = String(r.oracleMarkup).replace(/^.*>([^<]*)<.*$/, "$1");
        if (r.rendered.text !== ini)
          detail.push("P50-IC2 " + r.itemId + ": iniciais '" + r.rendered.text + "' != oráculo '" + ini + "'");
      });
      if (probe.iconsInP50Surface !== 0)
        detail.push("superfície P50 visível renderiza " + probe.iconsInP50Surface +
          " ícone(s): nenhuma possui itemId canônico, logo isto seria conteúdo fabricado");
      observed.noParallelSurface = probe.iconsInP50Surface === 0;
      observed.frozenIconsStillRendered = probe.frozenIconsStillRendered;
    }
  } catch (e) {
    detail.push("exceção " + String(e.message).split("\n")[0]);
  } finally { await pg.close(); }

  const ok = detail.length === 0;
  results.push({ id: "P50-IC1", ok });
  results.push({ id: "P50-IC2", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P50-IC1 — renderer de superfície nova devolve img.v32-icon com src idêntico ao asset congelado" +
    (ok ? "" : " [" + detail.filter(d => /IC1|renderer|exceção/.test(d)).join(" · ") + "]"));
  console.log((ok ? "PASS" : "FAIL") + "  P50-IC2 — família e fortisat devolvem .v32-icon-fb; nenhum ícone de produto emprestado" +
    (ok ? "" : " [" + detail.filter(d => /IC2|renderer|exceção|fabricado/.test(d)).join(" · ") + "]"));
  writeEvidence("P50-5.0.5-icons.json",
    JSON.stringify({
      gates: ["P50-IC1", "P50-IC2"], microfase: "5.0.5",
      source: "window.__V32UI.iconFor(itemId, name) — ponte congelada; nenhum mapa, SVG ou asset paralelo",
      renderer: "window.__P50.iconNode(itemId, name) — devolve NÓ validado ou null; nunca string",
      noDecorativeSurface: "nenhuma superfície P50 possui itemId canônico e nenhuma renderiza ícone",
      assetItems: P50_IC_ASSET_ITEMS, fallbackItems: P50_IC_FALLBACK_ITEMS,
      observed: {
        rendererPresent: observed.rendererPresent,
        iconsInP50Surface: observed.iconsInP50Surface,
        frozenIconsStillRendered: observed.frozenIconsStillRendered,
        asset: (observed.asset || []).map(r => ({ itemId: r.itemId, tag: r.rendered && r.rendered.tag,
          cls: r.rendered && r.rendered.cls, dataIcon: r.rendered && r.rendered.dataIcon,
          srcMatchesOracle: !!(r.rendered && r.oracleMarkup.indexOf(r.rendered.src) > 0),
          srcLength: r.rendered && r.rendered.src ? r.rendered.src.length : 0 })),
        fallback: (observed.fallback || []).map(r => ({ itemId: r.itemId, tag: r.rendered && r.rendered.tag,
          cls: r.rendered && r.rendered.cls, initials: r.rendered && r.rendered.text,
          hasProductSrc: !!(r.rendered && r.rendered.src) }))
      },
      failures: detail, verdict: ok ? "PASS" : "FAIL"
    }, null, 2) + "\n");
  return { ok, detail, observed };
}

/* ---------------------------------------------------------------------------
   ACEITE-R1-5.0.5 · marcador de ZERO CONFIRMADO no Atual × Alvo.
   NÃO é gate do namespace P50 (a ressalva R1 da auditoria da 5.0.4 é polimento,
   não requisito normativo novo) e não redefine P50-VIS8/VIS9. Prova que
   `current == 0.0` plotado e `current == n/d` deixaram de ser graficamente
   idênticos, sem depender de cor nem do rótulo textual.
   O estado é aplicado pelos setters canônicos: 15 respostas confirmadas no
   nível 0 produzem gate ABERTO e todos os domínios com atual 0.0.
--------------------------------------------------------------------------- */
async function aceiteR1(browser, pageErrors) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("ACEITE-R1: " + String(e.message)));
  try {
    await pg.goto(HTML_URL);
    await pg.evaluate(qids => {
      window.__DEV.setArq(0);
      qids.forEach(id => window.__DEV.setAnswerById(id, 0));   /* nível 0 = confirmado, pontua 0 */
      window.__DEV.showResults();
    }, FX.P50_QIDS);
    await pg.waitForTimeout(200);
    await selectTab(pg, "analise");
    const zero = await pg.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'));
      return rows.map(r => ({
        dom: r.getAttribute("data-dom"),
        current: r.getAttribute("data-p50-current"),
        plotted: (r.querySelector('[data-p50="ct-current"]') || {}).getAttribute
                  ? r.querySelector('[data-p50="ct-current"]').getAttribute("data-p50-plotted") : null,
        zeroMark: !!r.querySelector('[data-p50="ct-zero"]'),
        zeroMarkWidth: (function () {
          const m = r.querySelector('[data-p50="ct-zero"]');
          if (!m) return null;
          const st = getComputedStyle(m);
          return { borderLeftWidth: st.borderLeftWidth, borderLeftColor: st.borderLeftColor,
                   height: Math.round(m.getBoundingClientRect().height) };
        })(),
        valueText: (r.querySelector('[data-p50="ct-current-value"]') || {}).textContent || null
      }));
    });
    observed.confirmedZero = zero;
    zero.forEach(r => {
      if (r.current !== "0.0") detail.push("dom " + r.dom + ": current '" + r.current + "' != 0.0");
      if (r.plotted !== "true") detail.push("dom " + r.dom + ": zero confirmado não foi plotado (UG7)");
      if (!r.zeroMark) detail.push("dom " + r.dom + ": marcador de origem ausente para zero confirmado");
      if (r.zeroMark && !(parseFloat(r.zeroMarkWidth.borderLeftWidth) > 0))
        detail.push("dom " + r.dom + ": marcador de origem com espessura 0");
      if (r.valueText !== "0.0") detail.push("dom " + r.dom + ": rótulo '" + r.valueText + "' != '0.0'");
    });
    /* contraprova: sem base atual, nenhum marcador é desenhado */
    await pg.goto(HTML_URL);
    await pg.evaluate(qids => {
      window.__DEV.setArq(0);
      qids.forEach((id, i) => { if (i < 12) window.__DEV.setAnswerById(id, 2); });
      window.__DEV.showResults();
    }, FX.P50_QIDS);
    await pg.waitForTimeout(200);
    await selectTab(pg, "analise");
    const nd = await pg.evaluate(() => Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'))
      .filter(r => !r.hasAttribute("data-p50-current"))
      .map(r => ({ dom: r.getAttribute("data-dom"), zeroMark: !!r.querySelector('[data-p50="ct-zero"]'),
                   valueText: (r.querySelector('[data-p50="ct-current-value"]') || {}).textContent || null })));
    observed.noBaseline = nd;
    nd.forEach(r => {
      if (r.zeroMark) detail.push("dom " + r.dom + ": linha sem base atual recebeu marcador de zero");
      if (r.valueText !== "n/d") detail.push("dom " + r.dom + ": rótulo sem base '" + r.valueText + "' != 'n/d'");
    });
    if (!nd.length) detail.push("contraprova vazia: nenhuma linha sem base atual na fixture de controle");
    await shotElement(pg, '#p50-results [data-p50="current-target"]', "P50-5.0.5-r1-zero-vs-nd-1440.png");
  } catch (e) {
    detail.push("exceção " + String(e.message).split("\n")[0]);
  } finally { await pg.close(); }
  const ok = detail.length === 0;
  results.push({ id: "ACEITE-R1-5.0.5", ok });
  console.log((ok ? "PASS" : "FAIL") +
    "  ACEITE-R1-5.0.5 (verificação de aceite, NÃO é gate P50) — zero confirmado tem marcador de origem; sem base atual não tem" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* ---------------------------------------------------------------------------
   P50-VIS10 · Print/PDF — SEM ESCOPO NOVO (§25.6).
   O gate não implementa semântica de print e não toca o pipeline congelado.
   Ele é AGREGAÇÃO FACTUAL: executa de verdade a regressão de print já
   normativa e exige contagens INTEGRAIS. Nada aqui é lido de relatório
   anterior — cada contagem vem da execução desta rodada, com exit code
   próprio. Timeout, interrupção ou SKIP NUNCA viram PASS.
     · UI 3.3.2 / P1..P11        -> node tests_ui_m332.js
     · print.spec (gates V/print) -> playwright test tests_visual/print.spec.js
     · UG4 · UG6 · UG9            -> node tests_unset_ug.js
     · P50-PR1                    -> guard ADICIONAL desta suíte (não substituto)
--------------------------------------------------------------------------- */
function p50Run(cmd, args, timeoutMs) {
  const cp = require("child_process");
  const started = Date.now();
  const r = cp.spawnSync(cmd, args, {
    cwd: __dirname, encoding: "utf8", timeout: timeoutMs,
    maxBuffer: 64 * 1024 * 1024,
    env: Object.assign({}, process.env, { P50_NO_EVIDENCE: "1" })   /* subprocesso jamais grava evidência */
  });
  return {
    command: [cmd].concat(args).join(" "),
    status: r.status, signal: r.signal || null,
    timedOut: r.error && r.error.code === "ETIMEDOUT" ? true : false,
    error: r.error ? String(r.error.message).split("\n")[0] : null,
    ms: Date.now() - started,
    stdout: String(r.stdout || ""), stderr: String(r.stderr || "")
  };
}

async function vis10(prn1Ok, pageErrors) {
  const detail = [], observed = { components: [] };

  /* (1) UI 3.3.2 — P1..P11 e contagem integral */
  const m332 = p50Run(process.execPath, ["tests_ui_m332.js"], 20 * 60 * 1000);
  const m332Counts = m332.stdout.match(/UI 3\.3\.2 \(PDF\):\s*(\d+) PASS · (\d+) FAIL de (\d+)/);
  const pGates = {};
  for (let i = 1; i <= 11; i++) {
    const re = new RegExp("^(PASS|FAIL)\\s+P" + i + "\\b", "m");
    const m = m332.stdout.match(re);
    pGates["P" + i] = m ? m[1] : "AUSENTE";
  }
  observed.components.push({ component: "UI 3.3.2 (P1..P11)", command: m332.command, exit: m332.status,
    timedOut: m332.timedOut, ms: m332.ms,
    counts: m332Counts ? { pass: +m332Counts[1], fail: +m332Counts[2], total: +m332Counts[3] } : null,
    printGates: pGates });
  if (m332.timedOut || m332.signal) detail.push("UI 3.3.2 interrompida (" + (m332.signal || "timeout") + ") — não conta como PASS");
  if (m332.status !== 0) detail.push("UI 3.3.2 exit " + m332.status);
  if (!m332Counts) detail.push("UI 3.3.2 sem linha de contagem no stdout");
  else if (+m332Counts[2] !== 0 || +m332Counts[1] !== +m332Counts[3])
    detail.push("UI 3.3.2 regrediu: " + m332Counts[1] + " PASS / " + m332Counts[2] + " FAIL de " + m332Counts[3]);
  Object.keys(pGates).forEach(g => { if (pGates[g] !== "PASS") detail.push("gate de print " + g + ": " + pGates[g]); });

  /* (2) print.spec — gates visuais de print em Chromium real */
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const pspec = p50Run(npx, ["playwright", "test", "tests_visual/print.spec.js"], 30 * 60 * 1000);
  const pOut = pspec.stdout + pspec.stderr;
  const pPassed = pOut.match(/(\d+)\s+passed/);
  const pFailed = pOut.match(/(\d+)\s+failed/);
  const pSkipped = pOut.match(/(\d+)\s+skipped/);
  /* print.spec.js declara `test.skip(() => project.name !== "d1440")`: os 7
     testes existem nos 4 projetos de viewport e executam SÓ no breakpoint
     canônico. Os 21 "skipped" são RECORTE DE PROJETO por design da suíte
     congelada, não gate não executado — e a soma tem de fechar 7 × 4 = 28.
     A regra "SKIP nunca é PASS" continua valendo para gate REAL não executado:
     por isso o oráculo abaixo exige a contagem exata, não apenas "sem falhas". */
  const P_EXECUTED = 7, P_PROJECTS = 4;
  observed.components.push({ component: "tests_visual/print.spec.js", command: pspec.command, exit: pspec.status,
    timedOut: pspec.timedOut, ms: pspec.ms,
    counts: { passed: pPassed ? +pPassed[1] : null, failed: pFailed ? +pFailed[1] : 0,
              skipped: pSkipped ? +pSkipped[1] : 0 },
    skipSemantics: "recorte de projeto declarado pela própria suíte congelada " +
      "(test.skip: project.name !== 'd1440'); NÃO é gate não executado" });
  if (pspec.timedOut || pspec.signal) detail.push("print.spec interrompida (" + (pspec.signal || "timeout") + ") — não conta como PASS");
  if (pspec.status !== 0) detail.push("print.spec exit " + pspec.status);
  if (!pPassed) detail.push("print.spec sem contagem de aprovados no stdout");
  else if (+pPassed[1] !== P_EXECUTED)
    detail.push("print.spec executou " + pPassed[1] + " testes (esperado " + P_EXECUTED + ")");
  if (pFailed && +pFailed[1] > 0) detail.push("print.spec com " + pFailed[1] + " falha(s)");
  const pSk = pSkipped ? +pSkipped[1] : 0;
  const pTotal = (pPassed ? +pPassed[1] : 0) + pSk + (pFailed ? +pFailed[1] : 0);
  if (pTotal !== P_EXECUTED * P_PROJECTS)
    detail.push("print.spec somou " + pTotal + " execuções (esperado " + (P_EXECUTED * P_PROJECTS) +
      " = " + P_EXECUTED + " testes × " + P_PROJECTS + " projetos) — recorte de projeto divergente");
  if (pSk !== P_EXECUTED * (P_PROJECTS - 1))
    detail.push("print.spec com " + pSk + " skips de projeto (esperado " + (P_EXECUTED * (P_PROJECTS - 1)) + ")");

  /* (3) UG4 · UG6 · UG9 — geometria UNSET aplicável a print */
  const ug = p50Run(process.execPath, ["tests_unset_ug.js"], 20 * 60 * 1000);
  const ugCounts = ug.stdout.match(/UNSET GEOMETRY \(UG\):\s*(\d+) PASS · (\d+) FAIL de (\d+)/);
  const ugGates = {};
  ["UG4", "UG6", "UG9"].forEach(g => {
    const m = ug.stdout.match(new RegExp("^(PASS|FAIL|SKIP)\\s+" + g + "\\b", "m"));
    ugGates[g] = m ? m[1] : "AUSENTE";
  });
  observed.components.push({ component: "UG (UG4/UG6/UG9 aplicáveis a print)", command: ug.command, exit: ug.status,
    timedOut: ug.timedOut, ms: ug.ms,
    counts: ugCounts ? { pass: +ugCounts[1], fail: +ugCounts[2], total: +ugCounts[3] } : null,
    printGates: ugGates });
  if (ug.timedOut || ug.signal) detail.push("suíte UG interrompida (" + (ug.signal || "timeout") + ") — não conta como PASS");
  if (ug.status !== 0) detail.push("suíte UG exit " + ug.status);
  if (!ugCounts) detail.push("suíte UG sem linha de contagem no stdout");
  else if (+ugCounts[2] !== 0 || +ugCounts[1] !== +ugCounts[3])
    detail.push("suíte UG regrediu: " + ugCounts[1] + " PASS / " + ugCounts[2] + " FAIL de " + ugCounts[3]);
  Object.keys(ugGates).forEach(g => { if (ugGates[g] !== "PASS") detail.push("gate UG de print " + g + ": " + ugGates[g]); });

  /* (4) P50-PR1 — guard ADICIONAL desta suíte; jamais substituto da agregação */
  observed.components.push({ component: "P50-PR1 (guard adicional)", ok: !!prn1Ok,
    note: "guard estreito da superfície de print legado; não substitui nenhum componente acima" });
  if (!prn1Ok) detail.push("P50-PR1 falhou nesta execução");

  const ok = detail.length === 0;
  results.push({ id: "P50-VIS10", ok });
  console.log((ok ? "PASS" : "FAIL") +
    "  P50-VIS10 — regressão de print INTEGRAL reexecutada nesta rodada (UI 3.3.2/P1–P11 · print.spec · UG4/UG6/UG9 · P50-PR1); nenhuma semântica nova de print" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  writeEvidence("P50-5.0.5-vis10-print-aggregation.json",
    JSON.stringify({
      gate: "P50-VIS10", microfase: "5.0.5",
      scope: "AGREGAÇÃO FACTUAL da regressão de print já normativa. Zero escopo novo de print; " +
             "nenhum arquivo do pipeline de print foi lido, escrito ou decorado por este gate.",
      rule: "SKIP, timeout, sinal ou exit != 0 NUNCA contam como PASS.",
      components: observed.components,
      failures: detail, verdict: ok ? "PASS" : "FAIL"
    }, null, 2) + "\n");
  return { ok, detail, observed };
}


/* ---------------------------------------------------------------------------
   ACEITE-LOCALIDADE-5.0.5 e ACEITE-LATENCIA-5.0.5.
   Não são gates do namespace P50: UI-043 já é coberto pela regressão congelada
   de rede e UI-044 proíbe expressamente inventar budget numérico antes da
   instrumentação. O que se faz aqui é MEDIR e REGISTRAR.
     · Localidade: sink de requisições sobre os fluxos novos. Qualquer esquema
       http/https/ws/wss é achado REAL e reprova.
     · Latência: dataset canônico MÁXIMO (15 respostas confirmadas + nota longa
       em todas as 15 perguntas). Sem limiar normativo: só bloqueia atraso
       MATERIAL, e o limiar de materialidade está declarado no próprio artefato.
--------------------------------------------------------------------------- */
const P50_LATENCY_MATERIAL_MS = 1000;   /* limiar de MATERIALIDADE declarado, não budget normativo */

async function localidadeELatencia(browser, pageErrors) {
  const detail = [], observed = { requests: [], latency: {} };
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => pageErrors.push("ACEITE-LOCALIDADE: " + String(e.message)));
  const seen = [];
  pg.on("request", r => seen.push(r.url()));
  try {
    /* dataset canônico MÁXIMO */
    const longNote = ("Evidência operacional detalhada da entrevista. ").repeat(40) + "FIM";
    await pg.goto(HTML_URL);
    await pg.evaluate(([qids, vec, note]) => {
      window.__DEV.setArq(0);
      qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
      qids.forEach((id, i) => window.__DEV.setNote(i, note));
    }, [FX.P50_QIDS, FX.P50_F5.vec, longNote]);

    const lat = await pg.evaluate(() => {
      const t = () => performance.now();
      const settle = () => { void document.body.offsetHeight; };   /* força layout: mede render, não só JS */
      const stat = arr => {
        const a = arr.slice().sort((x, y) => x - y);
        return { n: a.length, min: +a[0].toFixed(1),
                 median: +a[Math.floor(a.length / 2)].toFixed(1), max: +a[a.length - 1].toFixed(1) };
      };
      /* navegar até a tela de pergunta pelo caminho congelado */
      document.getElementById("start").click();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      const selection = [], navigation = [], tabs = [], results = [];
      for (let i = 0; i < 12; i++) {
        const card = document.querySelector('#app .opts .opt[data-i="' + (i % 4) + '"]');
        const a = t(); card.click(); settle(); selection.push(t() - a);
        const nxt = document.getElementById("next");
        if (nxt && !nxt.disabled) { const b = t(); nxt.click(); settle(); navigation.push(t() - b); }
        const prv = document.querySelector('#p50-shell [data-p50="prev"]');
        if (prv && !prv.disabled) { const c = t(); prv.click(); settle(); navigation.push(t() - c); }
      }
      const r0 = t(); window.__DEV.showResults(); settle(); results.push(t() - r0);
      const ids = ["dominios", "heatmap", "analise", "resumo", "heatmap", "analise"];
      ids.forEach(id => {
        const b = document.querySelector('#p50-results [data-p50="tab"][data-p50-tab="' + id + '"]');
        if (!b) return;
        const s = t(); b.click(); settle(); tabs.push(t() - s);
      });
      return {
        dataset: "15 respostas confirmadas + nota longa nas 15 perguntas (dataset canônico máximo)",
        selection: stat(selection), navigation: stat(navigation),
        openResults: stat(results), tabSwitch: stat(tabs),
        heatmapCells: document.querySelectorAll('#p50-results [data-p50="hm-cell"]').length
      };
    });
    observed.latency = lat;
    ["selection", "navigation", "openResults", "tabSwitch"].forEach(k => {
      if (lat[k] && lat[k].max > P50_LATENCY_MATERIAL_MS)
        detail.push("latência material em " + k + ": máximo " + lat[k].max + " ms (> " + P50_LATENCY_MATERIAL_MS + " ms)");
    });

    const external = seen.filter(u => /^(https?|wss?):/i.test(u));
    observed.requests = { total: seen.length, external,
      schemes: Array.from(new Set(seen.map(u => String(u).split(":")[0]))) };
    if (external.length) detail.push("requisições externas: " + JSON.stringify(external.slice(0, 5)));

    /* lint do artefato entregável: nada de telemetria, CDN, fonte remota ou
       persistência de navegador entrou no HTML por conta desta microfase. */
    const html = fs.readFileSync(path.join(__dirname, "quickscan_secops_soccmm_v3_2_dev.html"), "utf8");
    /* Lint por CONSTRUÇÃO, nunca por vocabulário. "Detection & Telemetry" é
       título de grupo do landscape congelado e `security-analytics` é id
       canônico de capability: procurar as PALAVRAS acusaria o conteúdo do
       produto, não um mecanismo de rastreamento. O que importa é se existe
       canal de rede, recurso remoto ou persistência de navegador. */
    const forbidden = [
      ["recurso remoto (src/href http)", /(?:src|href)\s*=\s*["']https?:/i],
      ["@import remoto", /@import\s+url\(\s*['"]?https?:/i],
      ["fonte remota", /@font-face[^}]*url\(\s*['"]?https?:/i],
      ["endpoint de analytics", /google-analytics\.com|googletagmanager\.com|segment\.(io|com)|mixpanel|amplitude\.com|googleapis\.com/i],
      ["gtag/ga", /\bgtag\s*\(|\bga\s*\(\s*["']/],
      ["fetch", /\bfetch\s*\(/], ["XMLHttpRequest", /XMLHttpRequest/],
      ["WebSocket", /\bnew\s+WebSocket\b/], ["navigator.sendBeacon", /sendBeacon/],
      ["localStorage", /localStorage/], ["sessionStorage", /sessionStorage/],
      ["indexedDB", /indexedDB/i], ["serviceWorker", /serviceWorker/i],
      ["EventSource", /\bnew\s+EventSource\b/], ["Notification", /\bnew\s+Notification\b/],
      ["geolocation", /navigator\.geolocation/]
    ];
    const hits = forbidden.filter(([, re]) => re.test(html)).map(([n]) => n);
    observed.htmlLint = { checked: forbidden.map(f => f[0]), hits };
    if (hits.length) detail.push("HTML construído contém: " + hits.join(", "));
  } catch (e) {
    detail.push("exceção " + String(e.message).split("\n")[0]);
  } finally { await pg.close(); }

  const ok = detail.length === 0;
  results.push({ id: "ACEITE-LOCALIDADE-LATENCIA-5.0.5", ok });
  console.log((ok ? "PASS" : "FAIL") +
    "  ACEITE-LOCALIDADE-LATENCIA-5.0.5 (verificação de aceite, NÃO é gate P50) — zero requisição externa/persistência de navegador; latências observadas registradas" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  writeEvidence("P50-5.0.5-locality-latency.json",
    JSON.stringify({
      check: "ACEITE-LOCALIDADE-LATENCIA-5.0.5", microfase: "5.0.5",
      note: "UI-043/UI-044. Nenhum budget numérico é normado: os valores abaixo são MEDIDOS. " +
            "O limiar de materialidade declarado (" + P50_LATENCY_MATERIAL_MS + " ms) serve só para " +
            "separar 'lento a ponto de prejudicar o uso' de 'medido e registrado'.",
      materialityThresholdMs: P50_LATENCY_MATERIAL_MS,
      observed, failures: detail, verdict: ok ? "PASS" : "FAIL"
    }, null, 2) + "\n");
  return { ok, detail, observed };
}


/* ============================================================================
   PHASE 5.1 · gates de tela e de PDF (namespace P51-*)
   ========================================================================== */
const P51_VPS = [[390,844],[768,1024],[1024,768],[1440,900],[2560,1080]];

/* P51-VIS1 — composição responsiva da tela de pergunta (UAT-01).
   Mede CAIXAS REAIS: em desktop largo a pergunta e o mapa precisam ocupar
   colunas distintas (sobreposição horizontal zero e topos comparáveis); em
   telas estreitas, uma coluna. Overflow e clipping são medidos em todos. */
async function p51vis1(browser, pageErrors) {
  const detail = [], observed = [];
  for (const [w, h] of P51_VPS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const pg = await ctx.newPage();
    pg.on("pageerror", e => pageErrors.push("P51-VIS1@" + w + ": " + String(e.message)));
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      await applyFixture(pg, FX.P50_F2);
      /* mapa aberto: é o estado que produzia o empilhamento reclamado */
      await pg.evaluate(() => {
        const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
        if (t && document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "true") t.click();
      });
      await p50Settle(pg);
      const m = await pg.evaluate(() => {
        const se = document.scrollingElement;
        const box = e => { const b = e.getBoundingClientRect();
          return { l: +b.left.toFixed(1), r: +b.right.toFixed(1), t: +(b.top + scrollY).toFixed(1),
                   b: +(b.bottom + scrollY).toFixed(1), w: +b.width.toFixed(1) }; };
        const shell = document.getElementById("p50-shell");
        const app = document.getElementById("app");
        const question = document.querySelector("#app .question");
        const card = document.querySelector("#app .opts .opt");
        const sb = shell.getBoundingClientRect(), ab = app.getBoundingClientRect();
        const overlapX = Math.max(0, Math.min(sb.right, ab.right) - Math.max(sb.left, ab.left));
        const clipped = Array.from(document.querySelectorAll("#p50-shell *, #app *"))
          .filter(e => e.children.length === 0 && (e.textContent || "").trim())
          .filter(e => e.scrollWidth > e.clientWidth + 1).length;
        return {
          viewport: { w: innerWidth, h: innerHeight },
          shell: box(shell), app: box(app),
          question: question ? box(question) : null,
          firstCard: card ? box(card) : null,
          overlapX: +overlapX.toFixed(1),
          documentScrollWidth: se.scrollWidth,
          overflowX: se.scrollWidth - innerWidth,
          clipped,
          wrapWidth: +document.querySelector(".wrap").getBoundingClientRect().width.toFixed(1)
        };
      });
      m.viewportKey = w + "x" + h;
      observed.push(m);
      const tag = "@" + w;
      if (m.overflowX > 0) detail.push(tag + ": overflow horizontal " + m.overflowX + "px");
      if (m.clipped) detail.push(tag + ": " + m.clipped + " texto(s) clipado(s)");
      if (w >= 1180) {
        /* duas colunas REAIS: sem sobreposição horizontal entre mapa e pergunta */
        if (m.overlapX > 0)
          detail.push(tag + ": mapa e pergunta se sobrepõem horizontalmente (" + m.overlapX + "px) — não são colunas");
        /* a pergunta não pode começar abaixo de todo o mapa */
        if (m.question && m.question.t >= m.shell.b - 1)
          detail.push(tag + ": pergunta começa abaixo do mapa inteiro (empilhamento) — top " +
            m.question.t + " vs fim do mapa " + m.shell.b);
        /* aproveitamento: a faixa útil não pode ser uma tira estreita */
        const uso = m.wrapWidth / m.viewport.w;
        if (uso < 0.72) detail.push(tag + ": faixa central estreita — .wrap usa " + (uso * 100).toFixed(0) + "% da tela");
      } else {
        /* uma coluna: mapa e pergunta empilhados é o comportamento correto */
        if (m.overlapX <= 0 && m.shell.w > 0 && m.app.w > 0)
          detail.push(tag + ": em tela estreita mapa e pergunta deveriam compartilhar a coluna");
      }
      if (m.firstCard && m.firstCard.t > m.shell.b && w >= 1180)
        detail.push(tag + ": 1º card de resposta empurrado para baixo do mapa");
    } catch (e) {
      detail.push("@" + w + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await ctx.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P51-VIS1", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P51-VIS1 — composição: duas colunas reais em desktop, uma em telas estreitas, sem overflow" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P51-VIS2 — legibilidade do select do cenário-alvo (UAT-08), fechado e aberto.
   O popup nativo não é inspecionável, então o oráculo mede o que o determina:
   cor, fundo e `color-scheme` do próprio select E de cada <option>. */
async function p51vis2(browser, pageErrors) {
  const detail = [], observed = [];
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const pg = await ctx.newPage();
    pg.on("pageerror", e => pageErrors.push("P51-VIS2@" + w + ": " + String(e.message)));
    try {
      await pg.addInitScript(P50_PAGE_HELPERS);
      await applyResults(pg, FX.P50_F9);
      /* com perfil já declarado o controle é "Editar cenário-alvo"; sem perfil,
         "Definir cenário-alvo". O gate abre o que existir no estado corrente. */
      const abriu = await pg.evaluate(() => {
        const b = document.getElementById("ux-tgt-open") || document.getElementById("ux-tgt-edit");
        if (b) { b.click(); return true; }
        return false;
      });
      await p50Settle(pg);
      const m = await pg.evaluate(() => {
        const sels = Array.from(document.querySelectorAll("#ux-target select[data-qid]"));
        return sels.slice(0, 4).map(sel => {
          const cs = getComputedStyle(sel);
          const opts = Array.from(sel.options).map(o => {
            const os = getComputedStyle(o);
            return { text: (o.textContent || "").slice(0, 40), color: os.color, bg: os.backgroundColor };
          });
          return { qid: sel.getAttribute("data-qid"), color: cs.color, bg: cs.backgroundColor,
                   colorScheme: cs.colorScheme, border: cs.borderTopStyle + " " + cs.borderTopWidth,
                   options: opts, count: sel.options.length };
        });
      });
      observed.push({ viewport: w + "x" + h, opened: abriu, selects: m });
      const tag = "@" + w;
      if (!abriu) { detail.push(tag + ": controle de cenário-alvo não abriu"); continue; }
      if (!m.length) { detail.push(tag + ": nenhum select de alvo encontrado"); continue; }
      m.forEach(sl => {
        if (!/dark/i.test(sl.colorScheme))
          detail.push(tag + " " + sl.qid + ": color-scheme '" + sl.colorScheme + "' não fixa o esquema do popup nativo");
        const bg = p50ParseColor(sl.bg), fg = p50ParseColor(sl.color);
        if (!bg || bg.a === 0)
          detail.push(tag + " " + sl.qid + ": background do select transparente (" + sl.bg + ")");
        if (bg && fg) {
          const r = p50Ratio(p50Composite(fg, [bg.r, bg.g, bg.b]), [bg.r, bg.g, bg.b]);
          if (r < 4.5) detail.push(tag + " " + sl.qid + ": contraste do select " + r + ":1");
        }
        if (!sl.count) detail.push(tag + " " + sl.qid + ": select sem opções");
        sl.options.forEach(o => {
          const ob = p50ParseColor(o.bg), of = p50ParseColor(o.color);
          if (!ob || ob.a === 0)
            detail.push(tag + " " + sl.qid + ": option '" + o.text + "' sem fundo explícito (" + o.bg + ")");
          if (ob && of) {
            const r = p50Ratio(p50Composite(of, [ob.r, ob.g, ob.b]), [ob.r, ob.g, ob.b]);
            if (r < 4.5) detail.push(tag + " " + sl.qid + ": option '" + o.text + "' contraste " + r + ":1");
          }
        });
      });
    } catch (e) {
      detail.push("@" + w + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await ctx.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P51-VIS2", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P51-VIS2 — select do cenário-alvo legível: cor, fundo e color-scheme explícitos em select e options" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

/* P51-PDF1 — PDF REAL: capa, cabeçalho, régua, legenda, emblema e anexo.
   Renderiza o documento em A4 e inspeciona o resultado, não apenas o DOM. */
async function p51pdf(browser, pageErrors) {
  const detail = [], observed = [];
  const CENARIOS = [
    { id: "suficiente-com-label", vec: FX.P50_F5.vec, label: "Cliente Alfa" },
    { id: "suficiente-sem-label", vec: FX.P50_F5.vec, label: null },
    { id: "insuficiente", vec: FX.P50_F2.vec, label: "Cliente Beta" },
    { id: "zero-confirmado", vec: new Array(15).fill(0), label: "Cliente Zero" },
    { id: "unicode", vec: FX.P50_F5.vec, label: "Cliente 😀 Ácentos — «tudo»" }
  ];
  for (const c of CENARIOS) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    pg.on("pageerror", e => pageErrors.push("P51-PDF1/" + c.id + ": " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      await pg.evaluate(([qids, vec, label]) => {
        window.__DEV.setArq(0);
        qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
        const L = window.__DEV.V32.TECH_LANDSCAPE, ids = Object.keys(L);
        if (ids[0]) L[ids[0]].presence = "PRESENT";
        if (label) {
          const doc = window.__DEV.buildSessionDocument(label);
          window.__DEV.importSessionDocument(JSON.parse(JSON.stringify(doc)));
        }
        window.__DEV.showResults();
        window.__DEV.preparePrint();
      }, [FX.P50_QIDS, c.vec, c.label]);
      await p50Settle(pg);
      /* A geometria da capa só existe sob MÍDIA PRINT: as regras de `.pr-cover`
         vivem em @media print. Medir sem emular a mídia lia um layout que o
         papel nunca terá — foi assim que o mutante de colisão de capa passou. */
      await pg.emulateMedia({ media: "print" });
      await pg.waitForTimeout(200);
      const dom = await pg.evaluate(() => {
        const el = document.getElementById("v32-print-report");
        const t = s => { const n = el.querySelector(s); return n ? (n.textContent || "").replace(/\s+/g, " ").trim() : null; };
        const cover = el.querySelector("#pr-cover");
        /* `scrollWidth`/`clientWidth` não têm significado em elementos SVG:
           medi-los ali produzia falso positivo nos rótulos do emblema. O ajuste
           dos textos SVG é geométrico (viewBox fixo) e é asserido por conteúdo;
           aqui medem-se apenas caixas HTML. */
        const clip = Array.from(el.querySelectorAll("*"))
          .filter(e => e.namespaceURI === "http://www.w3.org/1999/xhtml")
          .filter(e => e.children.length === 0 && (e.textContent || "").trim())
          .filter(e => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)
          .map(e => String(e.className || e.tagName) + ":" + (e.textContent || "").slice(0, 30));
        const cb = cover ? cover.getBoundingClientRect() : null;
        const head = el.querySelector(".pr-head");
        const hb = head ? head.getBoundingClientRect() : null;
        return {
          cover: !!cover,
          coverHeight: cb ? Math.round(cb.height) : null,
          coverPosition: cover ? getComputedStyle(cover.parentElement || cover).position : null,
          coverOutOfFlow: cover ? (function(){
            for (let n = cover; n && n !== el; n = n.parentElement){
              const ps = getComputedStyle(n).position;
              if (ps === "absolute" || ps === "fixed") return true;
            }
            return false;
          })() : false,
          headTop: hb ? Math.round(hb.top) : null,
          coverBottom: cb ? Math.round(cb.bottom) : null,
          session: t('[data-pr-meta="session"]'),
          sessionDate: t('[data-pr-meta="sessionDate"]'),
          generatedAt: t('[data-pr-meta="generatedAt"]'),
          tool: t('[data-pr-meta="tool"]'),
          howto: !!el.querySelector("#pr-howto"),
          howtoItens: el.querySelectorAll("#pr-howto li").length,
          howtoChars: (function(){ const b=el.querySelector("#pr-howto");
            return b ? b.textContent.replace(/\s+/g," ").trim().length : 0; })(),
          ruler: !!el.querySelector("#pr-stage-ruler"),
          rulerMark: !!el.querySelector("[data-rl-mark]"),
          rulerRead: t("[data-rl-read]"),
          bands: el.querySelectorAll("[data-rl-band]").length,
          legend: el.querySelectorAll("[data-dom-legend]").length,
          penta: !!el.querySelector('svg[data-qs-mark="pentagon"]'),
          band: !!el.querySelector('svg[data-qs-mark="band"]'),
          annex: el.querySelectorAll("#pr-annex .pr-card").length,
          gapSupport: el.querySelectorAll("[data-pr-gap-support]").length,
          controls: el.querySelectorAll("button, select, textarea, input").length,
          clipped: clip
        };
      });
      await pg.emulateMedia({ media: null });
      const pdf = await pg.pdf({ format: "A4", printBackground: true, margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" } });
      dom.pdfBytes = pdf.length;
      dom.scenario = c.id;
      observed.push(dom);
      const tag = c.id;
      if (!dom.cover) detail.push(tag + ": capa ausente");
      if (!dom.ruler || dom.bands !== 6) detail.push(tag + ": régua ausente ou com " + dom.bands + " faixas");
      /* adendo documental · §4: caixa curta de leitura no próprio relatório */
      if (!dom.howto) detail.push(tag + ": caixa 'Como interpretar este relatório' ausente do PDF");
      if (dom.howtoItens < 5 || dom.howtoItens > 8)
        detail.push(tag + ": caixa interpretativa com " + dom.howtoItens + " itens");
      if (dom.howtoChars > 900) detail.push(tag + ": caixa interpretativa longa demais (" + dom.howtoChars + " caracteres)");
      if (dom.legend !== 5) detail.push(tag + ": legenda com " + dom.legend + " domínios");
      if (!dom.penta || !dom.band) detail.push(tag + ": emblema/faixa ausentes");
      if (dom.annex !== 15) detail.push(tag + ": anexo com " + dom.annex + " itens (esperado 15)");
      if (dom.controls !== 0) detail.push(tag + ": " + dom.controls + " controle(s) interativo(s) no print");
      if (dom.clipped.length) detail.push(tag + ": texto cortado -> " + dom.clipped.slice(0, 3).join(" | "));
      if (dom.coverBottom !== null && dom.headTop !== null && dom.headTop < dom.coverBottom - 1)
        detail.push(tag + ": capa e cabeçalho colidem (head top " + dom.headTop + " < fim da capa " + dom.coverBottom + ")");
      if (dom.coverOutOfFlow) detail.push(tag + ": capa fora do fluxo do documento (position " + dom.coverPosition + ")");
      if (dom.coverHeight !== null && dom.coverHeight > 900)
        detail.push(tag + ": capa ocupa " + dom.coverHeight + "px — desperdício desproporcional");
      if (!(dom.pdfBytes > 20000)) detail.push(tag + ": PDF de " + dom.pdfBytes + " bytes");
      /* metadados por cenário */
      if (c.label && dom.session !== c.label) detail.push(tag + ": Sessão '" + dom.session + "' != '" + c.label + "'");
      if (!c.label && dom.session !== "Sem rótulo") detail.push(tag + ": sessão sem label deveria dizer 'Sem rótulo'");
      /* comparar as STRINGS renderizadas seria frágil: numa execução automática
         a sessão e o relatório caem no mesmo segundo. O que precisa ser
         distinto é a FONTE semântica e o RÓTULO. */
      const meta = await pg.evaluate(() => {
        const m = window.__DEV.qsSessionMeta();
        const el = document.getElementById("v32-print-report");
        return { sessionISO: m.sessionDateISO, generatedISO: m.generatedAtISO,
                 labels: Array.from(el.querySelectorAll(".pr-cover-meta dt")).map(e => e.textContent.trim()) };
      });
      dom.meta = meta;
      if (meta.sessionISO && meta.sessionISO === meta.generatedISO)
        detail.push(tag + ": data da sessão e de geração vêm do mesmo instante");
      if (meta.labels.indexOf("Relatório gerado em") < 0)
        detail.push(tag + ": rótulo 'Relatório gerado em' ausente");
      if (meta.labels.filter(l => /Data da sessão|Sessão registrada em/.test(l)).length !== 1)
        detail.push(tag + ": rótulo de data da sessão ausente/duplicado: " + JSON.stringify(meta.labels));
      if (c.label && meta.labels.indexOf("Sessão registrada em") < 0)
        detail.push(tag + ": documento importado não usa o rótulo honesto de proveniência");
      /* n/d nunca vira marcador em zero */
      if (tag === "insuficiente") {
        if (dom.rulerMark) detail.push(tag + ": régua marcou posição com dados insuficientes");
        if (!/não determinado/i.test(dom.rulerRead || "")) detail.push(tag + ": régua não declara estágio indeterminado");
      }
      if (tag === "zero-confirmado") {
        if (!dom.rulerMark) detail.push(tag + ": zero confirmado deveria ter marcador em 0");
        if (!/0\.0/.test(dom.rulerRead || "")) detail.push(tag + ": leitura da régua '" + dom.rulerRead + "'");
      }
      if (tag === "unicode" && dom.session !== c.label)
        detail.push(tag + ": label Unicode corrompido -> '" + dom.session + "'");
    } catch (e) {
      detail.push(c.id + ": exceção " + String(e.message).split("\n")[0]);
    } finally { await ctx.close(); }
  }
  const ok = detail.length === 0;
  results.push({ id: "P51-PDF1", ok });
  console.log((ok ? "PASS" : "FAIL") + "  P51-PDF1 — PDF real em A4: capa, metadados, régua, legenda, emblema, anexo e ausência de controles" +
    (ok ? "" : " [" + detail.join(" · ") + "]"));
  return { ok, detail, observed };
}

(async () => {
  /* §25.6 · sem browser resolvível TODOS os gates Chromium desta suíte são
     declarados NÃO EXECUTADOS, um a um. SKIP nunca conta como PASS e não
     satisfaz evidência de entrega, auditoria ou freeze. */
  const P50_CHROMIUM_GATES = [
    "P50-ACC6", "P50-SESUX1B", "P50-PR1",
    "P50-VIS7", "P50-VIS8", "P50-VIS9", "P50-ACC5",
    "P50-VIS1", "P50-VIS2", "P50-VIS3", "P50-VIS4", "P50-VIS5", "P50-VIS6", "P50-VIS10",
    "P50-ACC1", "P50-ACC2", "P50-ACC3", "P50-ACC4", "P50-IC1", "P50-IC2",
    "P51-VIS1", "P51-VIS2", "P51-PDF1"
  ];
  function skipAll(reason) {
    P50_CHROMIUM_GATES.forEach(g => {
      console.log("SKIP  " + g + " — NÃO EXECUTADO (" + reason + ")");
      skipped++;
    });
  }
  let chromium;
  try { ({ chromium } = require("@playwright/test")); }
  catch (e) {
    skipAll("@playwright/test ausente");
    finish(); return;
  }
  const resolved = resolveBrowser();
  const opts = { args: ["--no-sandbox", "--disable-dev-shm-usage"] };
  if (resolved.exe) opts.executablePath = resolved.exe;
  let b;
  try { b = await chromium.launch(opts); }
  catch (e) {
    skipAll("browser indisponível: " + e.message.split("\n")[0]);
    finish(); return;
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
      /* PHASE 5.2 · REV A (MAP-REV-A §9.2): o mapa do assessment passa a
         iniciar EXPANDIDO em desktop (>=1180px) e recolhido abaixo disso. O
         critério de aceite não é mais "sempre recolhido": é o estado CERTO
         para a largura, com o rótulo correspondente. */
      const wantCollapsed = vp.w >= 1180 ? "false" : "true";
      const wantLabel = vp.w >= 1180 ? /Recolher mapa do assessment/ : /Mostrar mapa do assessment/;
      if (m.collapsed !== wantCollapsed)
        foldDetail.push(tag + ": mapa com data-p50-collapsed=" + m.collapsed + " (esperado " + wantCollapsed + ")");
      if (m.sidebarVisible !== (wantCollapsed === "false"))
        foldDetail.push(tag + ": visibilidade do mapa incoerente com o estado inicial");
      if (!m.toggleVisible) foldDetail.push(tag + ": botão do mapa não visível");
      if (!wantLabel.test(m.toggleLabel || "")) foldDetail.push(tag + ": rótulo do botão = " + m.toggleLabel);
      if (!(m.questionTop < m.viewport.h)) foldDetail.push(tag + ": pergunta fora da dobra (top=" + m.questionTop + ")");
      if (!(m.firstCardTop < m.viewport.h)) foldDetail.push(tag + ": 1º card fora da dobra (top=" + m.firstCardTop + ")");
      if (m.documentScrollWidth > m.viewport.w) foldDetail.push(tag + ": overflow horizontal");
      if (m.stickyOverlapsFirstCard) foldDetail.push(tag + ": sticky sobrepõe o 1º card");
      if (m.clippedLabels) foldDetail.push(tag + ": " + m.clippedLabels + " rótulo(s) clipado(s)");
      await shot(pg, "P50-5.0.1-default-collapsed-" + vp.w + ".png");

      /* mapa expandido: prova que o botão abre e nada foi removido (1440) */
      if (vp.w === 1440) {
        const exp = await pg.evaluate(() => {
          /* REV A · em 1440 o mapa já inicia expandido: para provar que o
             botão ABRE, é preciso fechá-lo antes. O que o gate mede continua
             sendo o mesmo — o controle alterna e nada do mapa se perde. */
          const t = document.querySelector("#p50-shell button[data-p50=\"sidebar-toggle\"]");
          if (document.getElementById("p50-shell").getAttribute("data-p50-collapsed") === "false") t.click();
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

    /* ---- microfase 5.0.5 · acessibilidade, responsivo e fechamento visual ----
       Ordem deliberada: primeiro os gates que medem a página, depois a
       agregação de print (P50-VIS10), que dispara subprocessos longos e
       precisa do resultado real de P50-PR1 desta mesma execução. */
    const gLayout = await vis1to4(b, pageErrors);
    const gFocus = await vis5(b, pageErrors);
    const gZoom = await vis6(b, pageErrors);
    const gAxe = await acc1(b, pageErrors);
    const gKeyboard = await acc2(b, pageErrors);
    const gOrder = await acc3(b, pageErrors);
    const gContrast = await acc4(b, pageErrors);
    const gIcons = await ic1ic2(b, pageErrors);
    const gR1 = await aceiteR1(b, pageErrors);
    const gLocal = await localidadeELatencia(b, pageErrors);
    /* ---- Phase 5.1 · UAT e relatório executivo ---- */
    const g51a = await p51vis1(b, pageErrors);
    const g51b = await p51vis2(b, pageErrors);
    const g51c = await p51pdf(b, pageErrors);

    const gPrint = await vis10(prn1.ok, pageErrors);

    /* P50-geometry.json — medidas consolidadas + pageErrors (§25.6/§30.4). */
    writeEvidence("P50-geometry.json",
      JSON.stringify({
        artifact: "P50-geometry.json", microfase: "5.0.5",
        note: "Geometria consolidada dos gates responsivos e de foco da Phase 5.0. " +
              "Medidas reais de Chromium; nenhuma estimativa.",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin, specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        viewports: P50_VIEWPORTS.map(v => v.w + "x" + v.h),
        gates: {
          "P50-VIS1": gLayout[0] ? { ok: gLayout[0].ok, failures: gLayout[0].detail, observed: gLayout[0].observed } : null,
          "P50-VIS2": gLayout[1] ? { ok: gLayout[1].ok, failures: gLayout[1].detail, observed: gLayout[1].observed } : null,
          "P50-VIS3": gLayout[2] ? { ok: gLayout[2].ok, failures: gLayout[2].detail, observed: gLayout[2].observed } : null,
          "P50-VIS4": gLayout[3] ? { ok: gLayout[3].ok, failures: gLayout[3].detail, observed: gLayout[3].observed } : null,
          "P50-VIS5": { ok: gFocus.ok, failures: gFocus.detail, observed: gFocus.observed },
          "P50-VIS6": { ok: gZoom.ok, failures: gZoom.detail, observed: gZoom.observed }
        },
        pageErrors,
        verdict: (gLayout.every(g => g.ok) && gFocus.ok && gZoom.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n");

    writeEvidence("P50-5.0.5-accessibility-surface.json",
      JSON.stringify({
        microfase: "5.0.5 · Accessibility, Responsive & Visual Closure",
        note: "Gates normativos da 5.0.5 em Chromium real. Os contratos de P50-VIS7..VIS9 e " +
              "P50-ACC5/ACC6 não foram redefinidos: foram reexecutados nesta mesma rodada.",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin, specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        axe: { package: "@axe-core/playwright", version: gAxe.axeVersion,
               runtimeBytesInHtml: 0,
               note: "devDependency exclusiva de teste; nenhum módulo de produção a referencia (lint do P50 CORE)" },
        gates: {
          "P50-ACC1": { ok: gAxe.ok, failures: gAxe.detail, observed: gAxe.observed },
          "P50-ACC2": { ok: gKeyboard.ok, failures: gKeyboard.detail, observed: gKeyboard.observed },
          "P50-ACC3": { ok: gOrder.ok, failures: gOrder.detail, observed: gOrder.observed },
          "P50-ACC4": { ok: gContrast.ok, failures: gContrast.detail },
          "P50-IC1/P50-IC2": { ok: gIcons.ok, failures: gIcons.detail },
          "P50-VIS10": { ok: gPrint.ok, failures: gPrint.detail, observed: gPrint.observed }
        },
        acceptanceChecks: {
          "ACEITE-R1-5.0.5": { ok: gR1.ok, failures: gR1.detail, observed: gR1.observed,
            note: "polimento da ressalva R1 da auditoria 5.0.4; NÃO é gate do namespace P50" },
          "ACEITE-LOCALIDADE-LATENCIA-5.0.5": { ok: gLocal.ok, failures: gLocal.detail, observed: gLocal.observed,
            note: "UI-043/UI-044 medidos e registrados; nenhum budget numérico é normado" }
        },
        screenshots: shots.filter(n => n.indexOf("P50-5.0.5-") === 0),
        pageErrors,
        verdict: (gAxe.ok && gKeyboard.ok && gOrder.ok && gContrast.ok && gIcons.ok && gPrint.ok && gR1.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n");
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
  console.log("\nP50 CHROMIUM + P51 (microfases 5.0.1..5.0.5 + Phase 5.1): " + pass + " PASS · " + fail + " FAIL de " + results.length +
    (skipped ? " · " + skipped + " NÃO EXECUTADO (requer Chromium real)" : ""));
  process.exit(fail ? 1 : 0);
}
