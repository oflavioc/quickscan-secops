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
/* Captura só o viewport. Necessária quando o estado sob teste contém texto
   sem pontos de quebra (a fixture de falha de export usa 1 MiB de "x"), que
   alarga a página congelada e inviabiliza um fullPage. */
/* Screenshot do próprio elemento: garante que o componente esteja
   materialmente visível na imagem (M-502-3). */
async function shotElement(page, selector, name) {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await loc.screenshot({ path: path.join(EVIDENCE, name), animations: "disabled" });
  shots.push(name);
}

async function shotViewport(page, name) {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(EVIDENCE, name), fullPage: false, animations: "disabled" });
  shots.push(name);
}

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
        sesux1b: sesuxObserved,
        note: "Screenshots são evidência visual mínima da 5.0.1. NÃO encerram P50-VIS1..P50-VIS10.",
        verdict: results.every(r => r.ok) ? "PASS" : "FAIL"
      }, null, 2) + "\n", "utf8");
  } finally { await b.close(); }
  finish();
})();

function finish() {
  const fail = results.filter(r => !r.ok).length;
  const pass = results.length - fail;
  console.log("\nP50 CHROMIUM (microfases 5.0.1+5.0.2): " + pass + " PASS · " + fail + " FAIL de " + results.length +
    (skipped ? " · " + skipped + " NÃO EXECUTADO (requer Chromium real)" : ""));
  process.exit(fail ? 1 : 0);
}
