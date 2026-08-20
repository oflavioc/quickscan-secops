/* ============================================================================
   TESTES P50 · CHROMIUM — PHASE 5.0 · microfase 5.0.1
   Escopo desta microfase: SOMENTE P50-ACC6 (estado acessível da seleção),
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
async function shot(page, name) {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(EVIDENCE, name), fullPage: true, animations: "disabled" });
  shots.push(name);
}

/* Navega até a pergunta k usando SOMENTE controles congelados, e deixa no ar o
   vetor da fixture. Espelha fixtures_p50.js::p50GotoQuestion dentro da página. */
async function applyFixture(page, fx) {
  await page.goto(HTML_URL);
  await page.evaluate(([qids, vec, k]) => {
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
    let guard = 0;
    while (step() > k + 1 && guard++ < 40) key("ArrowLeft");
    if (step() !== k + 1) throw new Error("navegação: step " + step() + " != " + (k + 1));
  }, [FX.P50_QIDS, fx.vec, fx.focusQuestion]);
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

    fs.mkdirSync(EVIDENCE, { recursive: true });
    fs.writeFileSync(path.join(EVIDENCE, "P50-ACC6-selection-1440.json"),
      JSON.stringify({
        gate: "P50-ACC6",
        microfase: "5.0.1",
        browser: { name: "chromium", version: b.version(), executablePath: chromium.executablePath(),
          resolutionOrigin: resolved.origin,
          specNominalVersion: "141.0.7390.37",
          nominalDeviationAccepted: b.version() !== "141.0.7390.37" },
        playwright: require("@playwright/test/package.json").version,
        viewport: "1440x900",
        fixtures: ["P50-F2", "P50-F6"],
        pageErrors,
        screenshots: shots.slice(),
        smokeNonNormative: smoke,
        note: "Screenshots são evidência visual mínima da 5.0.1. NÃO encerram P50-VIS1..P50-VIS10.",
        verdict: results.every(r => r.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n", "utf8");
  } finally { await b.close(); }
  finish();
})();

function finish() {
  const fail = results.filter(r => !r.ok).length;
  const pass = results.length - fail;
  console.log("\nP50 CHROMIUM (microfase 5.0.1): " + pass + " PASS · " + fail + " FAIL de " + results.length +
    (skipped ? " · " + skipped + " NÃO EXECUTADO (requer Chromium real)" : ""));
  process.exit(fail ? 1 : 0);
}
