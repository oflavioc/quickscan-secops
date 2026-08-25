/* ============================================================================
   TESTES P52 · CHROMIUM — PHASE 5.2
   Aqui vivem as propriedades que só existem quando há LAYOUT de verdade:
   largura útil por viewport, grade de 12 colunas, rodapé de largura total,
   trilho de navegação por teclado, peso óptico do artwork medido em PIXEL,
   isolamento de print e acessibilidade automatizada.

   Regras desta suíte:
     · nenhuma medida é lida de atributo CSS declarado — tudo vem de
       `getBoundingClientRect()` / `getComputedStyle()` / pixels reais;
     · o peso óptico do ícone é medido pelo bounding box dos pixels NÃO
       transparentes do artwork, nunca por `width`/`height` de CSS;
     · o isolamento de print é comparado contra o BASELINE de entrada da fase,
       extraído do próprio git, e não contra um relatório anterior.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { chromium } = require("@playwright/test");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");

const HERE = __dirname;
const HTML_FILE = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML_URL = "file://" + HTML_FILE;
const EVID = path.join(HERE, "docs_phase5", "evidence_p52");

/* Baseline de ENTRADA da Phase 5.2 (§1 da diretriz) — o HTML PRÉ-P52 contra o
   qual P52-PR1 assere as diferenças DECLARADAS da fase.
   [Onda-4 · 2026-08-25] fix-finding (R10 §5: âncora em COMMIT IMUTÁVEL, nunca
   HEAD): o gate lia `git show HEAD:` esperando este SHA histórico — morreu
   permanentemente vermelho assim que HEAD avançou (E6, previsto na varredura;
   confirmado na calibração real do job visual). O SHA é pin de ÉPOCA, correto
   e imutável; o defeito era a rota HEAD. Âncora: merge da Phase 5.1
   (d3886812718e7ad9c5024880067133fbddf2fc4d), cujo blob confere byte a byte.
   1ª tentativa de correção (ancorar no registry/HTML atual) foi REVERTIDA:
   invertia a semântica do gate — as diferenças declaradas deixavam de existir. */
const P52_BASELINE_COMMIT = "d3886812718e7ad9c5024880067133fbddf2fc4d";
const P52_BASELINE_SHA = "12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9";

const results = [];
const ONLY = (process.env.P52_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, ok, detail) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  results.push({ id, ok: !!ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label +
    (ok || !detail || !detail.length ? "" : " [" + detail.join(" · ") + "]"));
}
function shouldRun(id) { return !ONLY.length || ONLY.indexOf(id) >= 0; }

function resolveBrowser() {                       /* mesma ordem de playwright.config.js */
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { executablePath: explicit };
  if (fs.existsSync(local)) return { executablePath: local };
  return {};
}
/* Durante a campanha de mutação o produto está deliberadamente defeituoso:
   escrever evidência ali contaminaria o acervo auditado. A supressão é do
   ARQUIVO apenas — todas as asserções continuam rodando e o exit code
   continua real. */
const NO_EVIDENCE = process.env.P52_NO_EVIDENCE === "1";
function evidence(name, data) {
  if (NO_EVIDENCE) return;
  try {
    if (!fs.existsSync(EVID)) fs.mkdirSync(EVID, { recursive: true });
    fs.writeFileSync(path.join(EVID, name), typeof data === "string" ? data : JSON.stringify(data, null, 2));
  } catch (e) { /* evidência é subproduto: nunca derruba o gate */ }
}

/* ==========================================================================
   Viewports obrigatórias (§14.2 da diretriz) e largura útil mínima (§5).
   A largura é medida na CAIXA DE BORDA de `.wrap` — a área que a aplicação
   realmente ocupa. Tolerância declarada: 16px.
   ========================================================================== */
const VIEWPORTS = [
  { w: 390, h: 844, min: null },
  { w: 768, h: 1024, min: null },
  { w: 1024, h: 768, min: null },
  { w: 1280, h: 800, min: 1180 },
  { w: 1440, h: 900, min: 1320 },
  { w: 1920, h: 1080, min: 1720 },
  { w: 2560, h: 1440, min: 2180 },
  { w: 3440, h: 1440, min: 2380 }
];
const TOL = 16;
const wideVp = vp => vp.w >= 1180;

async function pageAt(browser, vp, errs, tag) {
  const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  pg.on("pageerror", e => errs.push(tag + "@" + vp.w + ": " + String(e.message)));
  pg.on("console", m => { if (m.type() === "error") errs.push(tag + "@" + vp.w + " console: " + m.text()); });
  await pg.goto(HTML_URL);
  return pg;
}
async function toResults(pg, fx) {
  await pg.evaluate(([qids, vec, prios, targets]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    if (targets) Object.keys(targets).forEach(k => window.__DEV.setTarget(k, targets[k]));
    if (prios) window.__DEV.setPriorities(prios);
    window.__DEV.showResults();
  }, [FX50.P50_QIDS, fx.vec, fx.priorities || null, fx.targets || null]);
  await pg.waitForTimeout(180);
}
async function toQuestion(pg, k) {
  await pg.evaluate(([qids, kk]) => {
    window.__DEV.setArq(0);
    qids.forEach(id => window.__DEV.setAnswerById(id, 1));
    window.__DEV.gotoStep(kk);
  }, [FX50.P50_QIDS, k]);
  await pg.waitForTimeout(160);
}
const overflow = pg => pg.evaluate(() => ({
  s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth
}));

/* ============================== P52-LAY1 ============================== */
async function lay1(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    for (const screen of ["question", "results"]) {
      const pg = await pageAt(browser, vp, errs, "P52-LAY1/" + screen);
      try {
        if (screen === "question") await toQuestion(pg, 3);
        else await toResults(pg, FX52.P52_F1);
        const m = await pg.evaluate(() => {
          const w = document.querySelector(".wrap");
          const r = w.getBoundingClientRect();
          const cs = getComputedStyle(w);
          return {
            border: r.width,
            content: r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
          };
        });
        const ov = await overflow(pg);
        observed.push({ vp: vp.w, screen, border: Math.round(m.border), content: Math.round(m.content), min: vp.min });
        if (ov.s > ov.c + 1)
          detail.push(vp.w + "/" + screen + ": overflow horizontal " + ov.s + " > " + ov.c);
        if (vp.min !== null) {
          if (m.border + TOL < vp.min)
            detail.push(vp.w + "/" + screen + ": largura útil " + Math.round(m.border) + "px < " + vp.min + "px");
          if (m.content + TOL < vp.min)
            detail.push(vp.w + "/" + screen + ": largura de conteúdo " + Math.round(m.content) + "px < " + vp.min + "px");
        }
      } finally { await pg.close(); }
    }
  }
  evidence("P52-LAY1-widths.json", observed);
  T("P52-LAY1", "largura útil acompanha a viewport em todas as viewports obrigatórias, sem overflow", !detail.length, detail);
}

/* ============================== P52-LAY2 ============================== */
async function lay2(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-LAY2");
    try {
      await toQuestion(pg, 3);
      const m = await pg.evaluate(() => {
        const box = e => { if (!e) return null; const r = e.getBoundingClientRect();
          return { l: r.left, r: r.right, t: r.top, w: r.width, h: r.height }; };
        const w = document.querySelector(".wrap");
        const cs = getComputedStyle(w);
        const wr = w.getBoundingClientRect();
        return {
          display: cs.display,
          inner: { l: wr.left + parseFloat(cs.paddingLeft), r: wr.right - parseFloat(cs.paddingRight) },
          app: box(document.getElementById("app")),
          shell: box(document.getElementById("p50-shell")),
          foot: box(document.querySelector(".wrap > footer")),
          footSplit: (document.querySelector(".wrap > footer") || {}).getAttribute
            ? document.querySelector(".wrap > footer").getAttribute("data-p52-footer") : null,
          legal: box(document.querySelector(".p52-foot-legal")),
          contact: box(document.querySelector(".p52-foot-contact"))
        };
      });
      const wide = wideVp(vp);
      observed.push({ vp: vp.w, display: m.display, wide, foot: m.foot && Math.round(m.foot.w) });
      if (m.footSplit !== "split") detail.push(vp.w + ": rodapé não foi dividido em atribuição/contato");
      /* o rodapé ocupa a largura útil inferior — nunca a coluna lateral */
      const util = m.inner.r - m.inner.l;
      if (m.foot.w + 2 < util - 2)
        detail.push(vp.w + ": rodapé com " + Math.round(m.foot.w) + "px de " + Math.round(util) + "px úteis");
      if (wideVp(vp) && m.shell && m.foot.l > m.shell.l - 2)
        detail.push(vp.w + ": rodapé começa dentro da coluna lateral");
      if (wide) {
        if (m.display !== "grid") detail.push(vp.w + ": a tela de pergunta não é grade (" + m.display + ")");
        if (!m.shell) detail.push(vp.w + ": trilho de orientação ausente");
        else {
          /* pergunta e mapa lado a lado, alinhados pelo topo */
          if (m.app.l >= m.shell.l) detail.push(vp.w + ": a pergunta não está à esquerda do mapa");
          if (m.app.r > m.shell.l + 2) detail.push(vp.w + ": as colunas se sobrepõem");
          if (Math.abs(m.app.t - m.shell.t) > 8)
            detail.push(vp.w + ": colunas desalinhadas no topo (" + Math.round(m.app.t) + " vs " + Math.round(m.shell.t) + ")");
          /* o rodapé fica DEPOIS das duas colunas */
          if (m.foot.t < m.app.t || m.foot.t < m.shell.t) detail.push(vp.w + ": rodapé acima das colunas");
          /* atribuição à esquerda, contato à direita. A faixa alinha os dois
             pela BASE, então os topos diferem: "mesma linha" é sobreposição
             vertical, não igualdade de `top`. */
          if (m.legal && m.contact) {
            const mesmaLinha = m.contact.t < m.legal.t + m.legal.h - 2 &&
                               m.legal.t < m.contact.t + m.contact.h - 2;
            if (!mesmaLinha && util > 1100)
              detail.push(vp.w + ": contato quebrou de linha com " + Math.round(util) + "px úteis");
            if (mesmaLinha && m.contact.l <= m.legal.r - 2)
              detail.push(vp.w + ": contato não ficou à direita da atribuição");
          }
        }
      } else if (m.shell && m.app) {
        if (m.app.l !== m.shell.l && Math.abs(m.app.l - m.shell.l) > 24)
          detail.push(vp.w + ": abaixo de 1180px as colunas deveriam empilhar");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-LAY2-question.json", observed);
  T("P52-LAY2", "tela de pergunta em duas colunas reais e rodapé ocupando a largura útil inferior", !detail.length, detail);
}

/* ============================== P52-LAY3 ============================== */
async function lay3(browser, errs) {
  const detail = [], observed = [];
  /* REV A · com o gate ABERTO a suficiência deixa de ser seção independente
     (SUFF-REV-A); com o gate FECHADO ela sobe para a segunda posição. */
  const CANON = ["exec", "target", "context", "detail", "priorities", "gaps", "support", "actions"];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-LAY3");
    try {
      await toResults(pg, FX52.P52_F1);
      const m = await pg.evaluate(() => {
        const secs = Array.from(document.querySelectorAll("#p52-flow > .p52-sec")).map(s => {
          const r = s.getBoundingClientRect();
          return { key: s.getAttribute("data-p52-sec"), top: r.top + window.scrollY, w: r.width };
        });
        const rail = document.getElementById("p52-rail");
        const ws = document.getElementById("p52-workspace");
        const flow = document.getElementById("p52-flow");
        const rr = rail.getBoundingClientRect(), fr = flow.getBoundingClientRect();
        return {
          secs,
          railPosition: getComputedStyle(rail).position,
          wsDisplay: getComputedStyle(ws).display,
          railLeft: rr.left, railRight: rr.right, railTop: rr.top + window.scrollY,
          flowLeft: fr.left, flowTop: fr.top + window.scrollY,
          execCols: (function () {
            const rh = document.querySelector("#p52-sec-exec > .res-head");
            const g2 = document.querySelector("#p52-sec-exec > .grid2");
            if (!rh || !g2) return null;
            const a = rh.getBoundingClientRect(), b = g2.getBoundingClientRect();
            return { headW: a.width, headTop: a.top + window.scrollY, gridW: b.width, gridTop: b.top + window.scrollY };
          })()
        };
      });
      observed.push({ vp: vp.w, wsDisplay: m.wsDisplay, railPosition: m.railPosition,
        order: m.secs.map(s => s.key).join(">") });
      /* ordem VISUAL == ordem canônica == ordem do DOM */
      const keys = m.secs.map(s => s.key);
      if (keys.join(",") !== CANON.join(","))
        detail.push(vp.w + ": ordem do fluxo " + keys.join(">"));
      for (let i = 1; i < m.secs.length; i++)
        if (m.secs[i].top < m.secs[i - 1].top - 1)
          detail.push(vp.w + ": '" + m.secs[i].key + "' aparece acima de '" + m.secs[i - 1].key + "'");
      if (vp.w >= 1180) {
        if (m.wsDisplay !== "grid") detail.push(vp.w + ": workspace não é grade (" + m.wsDisplay + ")");
        if (m.railPosition !== "sticky") detail.push(vp.w + ": trilho não é sticky (" + m.railPosition + ")");
        if (m.railRight > m.flowLeft + 2) detail.push(vp.w + ": trilho e fluxo se sobrepõem");
        if (Math.abs(m.railTop - m.flowTop) > 8) detail.push(vp.w + ": trilho desalinhado do fluxo");
      } else {
        if (m.railTop > m.flowTop + 2) detail.push(vp.w + ": em tela estreita o trilho deveria vir acima do fluxo");
        if (m.railLeft > m.flowLeft + 24) detail.push(vp.w + ": trilho espremido em coluna lateral abaixo de 1180px");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-LAY3-sections.json", observed);
  T("P52-LAY3", "workspace de resultados: grade, trilho e ordem visual idênticos à ordem canônica", !detail.length, detail);
}

/* ============================== P52-GATE1v ============================== */
/* Com o gate de suficiência FECHADO, a §7 exige que o painel de suficiência
   ganhe destaque no PRIMEIRO VIEWPORT. Isto se mede em pixel: o topo da seção
   de evidência precisa estar dentro da primeira tela, e a ordem precisa ser a
   variante de gate fechado — sem que o alvo passe a vir depois do contexto. */
async function gate1v(browser, errs) {
  const detail = [], observed = [];
  const BLOCKED = ["exec", "evidence", "target", "context", "detail", "priorities", "gaps", "support", "actions"];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-GATE1v");
    try {
      await toResults(pg, FX52.P52_F3);
      const m = await pg.evaluate(() => {
        const ws = document.getElementById("p52-workspace");
        const ev = document.getElementById("p52-sec-evidence");
        const secs = Array.from(document.querySelectorAll("#p52-flow > .p52-sec"))
          .map(s => s.getAttribute("data-p52-sec"));
        const j = document.querySelector('[data-p52="gate-jump"]');
        const jr = j ? j.getBoundingClientRect() : null;
        const rl = document.querySelector('[data-p52-rail="evidence"]');
        return { gate: ws.getAttribute("data-p52-gate"), ordem: ws.getAttribute("data-p52-order"),
          secs, evTop: ev ? ev.getBoundingClientRect().top + window.scrollY : null,
          viewport: window.innerHeight,
          accent: ev ? getComputedStyle(ev).borderLeftWidth : null,
          jump: j ? { href: j.getAttribute("href"), top: jr.top, h: jr.height, text: (j.textContent || "").trim() } : null,
          railTop: rl ? rl.getBoundingClientRect().top : null,
          railMeta: rl ? rl.textContent : null };
      });
      observed.push({ vp: vp.w, evTop: m.evTop && Math.round(m.evTop), viewport: m.viewport, ordem: m.ordem,
        jumpTop: m.jump && Math.round(m.jump.top), jumpText: m.jump && m.jump.text });
      if (m.gate !== "blocked") detail.push(vp.w + ": fixture não bloqueou o resultado");
      if (m.secs.join(",") !== BLOCKED.join(","))
        detail.push(vp.w + ": ordem com gate fechado " + m.secs.join(">"));
      if (m.evTop === null) detail.push(vp.w + ": seção de evidência ausente");
      /* "destaque no primeiro viewport" é medido pelo que o leitor VÊ sem
         rolar: o ponteiro de navegação para a suficiência e o item do trilho
         com a pendência declarada. O painel em si tem altura própria e vive
         logo abaixo da visão executiva, que é conteúdo congelado e não pode
         ser encurtado por esta fase. */
      if (!m.jump) detail.push(vp.w + ": ponteiro para a suficiência ausente com o gate fechado");
      else {
        if (m.jump.href.indexOf("#p52-sec-evidence") < 0)
          detail.push(vp.w + ": ponteiro não aponta para a seção de evidência (" + m.jump.href + ")");
        if (m.jump.top < 0 || m.jump.top + m.jump.h > m.viewport)
          detail.push(vp.w + ": ponteiro fora do primeiro viewport (top=" + Math.round(m.jump.top) + ", vp=" + m.viewport + ")");
        if (m.jump.h < 43.5) detail.push(vp.w + ": ponteiro com " + m.jump.h.toFixed(1) + "px de altura (mínimo 44)");
      }
      if (m.railTop !== null && m.railTop > m.viewport)
        detail.push(vp.w + ": item de suficiência do trilho fora do primeiro viewport");
      if (parseFloat(m.accent) <= 0) detail.push(vp.w + ": seção de evidência sem acento de destaque");
      if (!/pendente/i.test(String(m.railMeta))) detail.push(vp.w + ": trilho não sinaliza pendência");
    } finally { await pg.close(); }
  }
  evidence("P52-GATE1-blocked.json", observed);
  T("P52-GATE1v", "gate fechado: suficiência no primeiro viewport, com acento próprio e ordem declarada", !detail.length, detail);
}

/* ============================== P52-NAV1 ============================== */
async function nav1(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-NAV1");
  try {
    await toResults(pg, FX52.P52_F1);
    /* (a) alcançável e acionável por TECLADO, sem mouse */
    const kb = await pg.evaluate(() => {
      document.body.setAttribute("tabindex", "-1"); document.body.focus();
      document.body.removeAttribute("tabindex");
      return true;
    });
    let hops = 0, reached = null;
    for (; hops < 15 && !reached; hops++) {
      await pg.keyboard.press("Tab");
      reached = await pg.evaluate(() => {
        const a = document.activeElement;
        return a && a.classList && a.classList.contains("p52-rail-link") ? a.id : null;
      });
    }
    if (!reached) detail.push("nenhum item do trilho alcançado em 15 tabulações");
    observed.firstRailStop = { hops, id: reached };

    /* (b) foco visível no item do trilho */
    const focus = await pg.evaluate(() => {
      const a = document.activeElement;
      if (!a) return null;
      const cs = getComputedStyle(a);
      return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, focusVisible: a.matches(":focus-visible") };
    });
    if (focus && focus.focusVisible && (focus.outlineStyle === "none" || parseFloat(focus.outlineWidth) === 0))
      detail.push("item do trilho sem indicador de foco");

    /* (c) ativar por Enter move o foco para a seção e marca o item ativo,
           SEM alterar estado canônico algum */
    const before = await pg.evaluate(() => JSON.stringify(window.__DEV.captureCanonicalInputs()));
    await pg.evaluate(() => document.getElementById("p52-railto-gaps").focus());
    await pg.keyboard.press("Enter");
    await pg.waitForTimeout(1400);            /* rolagem suave precisa assentar */
    const after = await pg.evaluate(() => ({
      canonical: JSON.stringify(window.__DEV.captureCanonicalInputs()),
      focused: document.activeElement ? document.activeElement.id : null,
      current: Array.from(document.querySelectorAll(".p52-rail-link"))
        .filter(a => a.getAttribute("aria-current") === "true").map(a => a.id),
      here: Array.from(document.querySelectorAll(".p52-rail-here")).length,
      secTop: document.getElementById("p52-sec-gaps").getBoundingClientRect().top
    }));
    if (after.canonical !== before) detail.push("a navegação lateral MUTOU estado canônico do assessment");
    if (after.focused !== "p52-sec-gaps") detail.push("Enter não moveu o foco para a seção (foco em " + after.focused + ")");
    if (after.current.length !== 1 || after.current[0] !== "p52-railto-gaps")
      detail.push("aria-current não acompanhou a ativação: " + after.current.join(","));
    if (after.here !== 1) detail.push(after.here + " marcadores textuais de 'seção atual'");
    if (after.secTop > 200) detail.push("a seção não foi trazida para o topo do viewport (top=" + Math.round(after.secTop) + ")");
    observed.activation = after;

    /* (d) o item ativo é distinguível SEM cor: borda, peso e texto */
    const shape = await pg.evaluate(() => {
      const links = Array.from(document.querySelectorAll(".p52-rail-link"));
      const on = links.find(a => a.getAttribute("aria-current") === "true") || links[0];
      const off = links.find(a => a !== on);
      const g = e => { const c = getComputedStyle(e);
        return { bw: c.borderLeftWidth, weight: c.fontWeight, text: (e.textContent || "").trim() }; };
      return { on: g(on), off: g(off) };
    });
    if (shape.on.bw === shape.off.bw) detail.push("borda idêntica entre ativo e inativo");
    if (shape.on.weight === shape.off.weight) detail.push("peso tipográfico idêntico entre ativo e inativo");
    if (!/se[çc][ãa]o atual/i.test(shape.on.text)) detail.push("item ativo sem pista textual");
    if (/se[çc][ãa]o atual/i.test(shape.off.text)) detail.push("item inativo com pista textual de ativo");
    observed.shape = shape;

    /* (e) rolagem manual atualiza o item ativo */
    await pg.evaluate(() => {
      const s = document.getElementById("p52-sec-support");
      window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 60);
    });
    await pg.waitForTimeout(700);
    const spy = await pg.evaluate(() => Array.from(document.querySelectorAll(".p52-rail-link"))
      .filter(a => a.getAttribute("aria-current") === "true").map(a => a.id));
    if (spy.length !== 1) detail.push("após rolagem, " + spy.length + " itens ativos");
    observed.scrollSpy = spy;

    /* (f) nada foi escondido atrás do trilho: todas as seções continuam no fluxo */
    const hidden = await pg.evaluate(() => Array.from(document.querySelectorAll("#p52-flow > .p52-sec"))
      .filter(s => getComputedStyle(s).display === "none" || s.getBoundingClientRect().height === 0)
      .map(s => s.id));
    if (hidden.length) detail.push("seções ocultas pelo trilho: " + hidden.join(","));

    /* (g) no mobile o trilho deixa de ser coluna lateral */
    const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mob.goto(HTML_URL);
    await toResults(mob, FX52.P52_F1);
    const mm = await mob.evaluate(() => {
      const r = document.getElementById("p52-rail").getBoundingClientRect();
      const f = document.getElementById("p52-flow").getBoundingClientRect();
      const list = document.querySelector(".p52-rail-list");
      return { railW: r.width, flowW: f.width, railBottom: r.bottom, flowTop: f.top,
               overflowX: getComputedStyle(list).overflowX,
               links: document.querySelectorAll(".p52-rail-link").length,
               minH: Math.min.apply(null, Array.from(document.querySelectorAll(".p52-rail-link"))
                 .map(a => a.getBoundingClientRect().height)) };
    });
    if (mm.railW < mm.flowW * 0.9) detail.push("mobile: trilho continua como coluna estreita (" + Math.round(mm.railW) + "px)");
    if (mm.railBottom > mm.flowTop + 2) detail.push("mobile: trilho sobrepõe o fluxo");
    if (mm.minH < 40) detail.push("mobile: item do trilho com " + Math.round(mm.minH) + "px de altura");
    observed.mobile = mm;
    await mob.close();
  } finally { await pg.close(); }
  evidence("P52-NAV1-rail.json", observed);
  T("P52-NAV1", "trilho lateral navegável por teclado, com item ativo por forma/borda/peso/texto e sem mutar o assessment", !detail.length, detail);
}

/* ============================== P52-ICON1 ============================== */
/* Peso óptico medido em PIXEL: o artwork é rasterizado no tamanho em que o
   navegador o desenha dentro do tile e o bounding box dos pixels não
   transparentes é medido. Conferir width/height de CSS não provaria nada. */
async function icon1(browser, errs) {
  const detail = [], observed = [];
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-ICON1");
  try {
    await toResults(pg, { vec: new Array(15).fill(0) });
    const tiles = await pg.evaluate(async () => {
      const out = [], seen = {};
      const imgs = Array.from(document.querySelectorAll(".icon-tile img"));
      for (const img of imgs) {
        const tile = img.closest(".icon-tile");
        const tr = tile.getBoundingClientRect(), ir = img.getBoundingClientRect();
        const key = (img.getAttribute("alt") || "") + "|" + (tile.classList.contains("sm") ? "sm" : "lg");
        if (seen[key]) continue; seen[key] = 1;
        const cs = getComputedStyle(img);
        const bmp = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = img.getAttribute("src"); });
        /* rasteriza na MESMA caixa em que o navegador desenha, com contain */
        const S = 256;
        const c = document.createElement("canvas"); c.width = S; c.height = S;
        const x = c.getContext("2d");
        x.clearRect(0, 0, S, S);
        x.drawImage(bmp, 0, 0, S, S);
        const d = x.getImageData(0, 0, S, S).data;
        let minx = S, miny = S, maxx = -1, maxy = -1;
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++)
          if (d[(yy * S + xx) * 4 + 3] > 16) {
            if (xx < minx) minx = xx; if (xx > maxx) maxx = xx;
            if (yy < miny) miny = yy; if (yy > maxy) maxy = yy;
          }
        if (maxx < 0) continue;
        const fw = (maxx - minx + 1) / S, fh = (maxy - miny + 1) / S;
        /* dimensão APARENTE do artwork = maior lado da tinta, na escala em que
           `object-fit:contain` desenha a imagem dentro do tile */
        const drawn = Math.min(ir.width, ir.height);
        const tileSide = Math.min(tr.width, tr.height);
        out.push({
          alt: img.getAttribute("alt") || "(sem alt)",
          size: tile.classList.contains("sm") ? "sm" : "lg",
          objectFit: cs.objectFit,
          tileSide, imgSide: drawn,
          inkW: fw, inkH: fh,
          apparent: (Math.max(fw, fh) * drawn) / tileSide,
          aspect: (fw / fh)
        });
      }
      return out;
    });
    if (!tiles.length) detail.push("nenhum tile de ícone na tela");
    const byTile = {};
    for (const t of tiles) (byTile[t.size] = byTile[t.size] || []).push(t);
    for (const size of Object.keys(byTile)) {
      const list = byTile[size];
      /* (a) tile externo uniforme */
      const sides = list.map(t => Math.round(t.tileSide));
      if (new Set(sides).size !== 1) detail.push(size + ": tiles com lados diferentes " + sides.join(","));
      /* (b) object-fit contain e proporção preservada */
      for (const t of list) {
        if (t.objectFit !== "contain") detail.push(t.alt + ": object-fit=" + t.objectFit);
        if (Math.abs(t.imgSide - Math.min(t.tileSide, t.imgSide)) > t.tileSide)
          detail.push(t.alt + ": imagem maior que o tile");
      }
      /* (c) artwork aparente entre 68% e 84% do tile */
      for (const t of list) {
        if (t.apparent < 0.68 - 0.005 || t.apparent > 0.84 + 0.005)
          detail.push(size + "/" + t.alt + ": artwork aparente " + (t.apparent * 100).toFixed(1) + "% do tile");
      }
      /* (d) FortiGuard dentro de 15% da mediana dos demais */
      const isFG = t => /fortiguard/i.test(t.alt);
      const others = list.filter(t => !isFG(t)).map(t => t.apparent).sort((a, b) => a - b);
      if (others.length) {
        const med = others[Math.floor(others.length / 2)];
        for (const t of list.filter(isFG)) {
          const dev = Math.abs(t.apparent - med) / med;
          if (dev > 0.15)
            detail.push(size + "/" + t.alt + ": desvio de " + (dev * 100).toFixed(1) + "% da mediana (" +
              (t.apparent * 100).toFixed(1) + "% vs " + (med * 100).toFixed(1) + "%)");
        }
      }
    }
    evidence("P52-ICON1-optics.json", tiles);
  } finally { await pg.close(); }
  T("P52-ICON1", "peso óptico dos tiles normalizado por medida de PIXEL, com o FortiGuard dentro da tolerância", !detail.length, detail);
}

/* ============================== P52-DOM1c ============================== */
async function dom1c(browser, errs) {
  const detail = [], observed = [];
  const CANON = { "0": "rgb(144, 99, 205)", "1": "rgb(60, 177, 126)", "2": "rgb(44, 204, 211)",
                  "3": "rgb(48, 127, 226)", "4": "rgb(162, 178, 200)" };
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-DOM1c");
  try {
    await toResults(pg, FX52.P52_F1);
    const chips = await pg.evaluate(() => Array.from(document.querySelectorAll("#app .dom-chip")).map(c => {
      const cs = getComputedStyle(c), sw = getComputedStyle(c, "::before");
      return {
        dom: c.getAttribute("data-dom"), text: (c.textContent || "").trim(),
        swatch: sw.backgroundColor, swatchW: sw.width,
        color: cs.color, borderLeft: cs.borderLeftColor, borderLeftW: cs.borderLeftWidth,
        bg: (function () { let e = c; while (e) { const b = getComputedStyle(e).backgroundColor;
          if (b && b !== "rgba(0, 0, 0, 0)" && b !== "transparent") return b; e = e.parentElement; } return "rgb(11, 11, 12)"; })()
      };
    }));
    if (!chips.length) detail.push("nenhuma tag de domínio");
    const seen = {};
    for (const c of chips) {
      if (!(c.dom in CANON)) { detail.push("tag sem domínio canônico: " + c.text); continue; }
      seen[c.dom] = 1;
      if (c.swatch !== CANON[c.dom])
        detail.push(c.text + ": amostra " + c.swatch + " != canônica " + CANON[c.dom]);
      if (c.borderLeft !== CANON[c.dom])
        detail.push(c.text + ": borda " + c.borderLeft + " != canônica " + CANON[c.dom]);
      if (parseFloat(c.swatchW) <= 0) detail.push(c.text + ": amostra de cor sem largura");
      if (!c.text) detail.push("tag sem nome textual de domínio");
      /* contraste do TEXTO: a cor de domínio pura não atinge 4.5:1 no tema
         escuro; a variante derivada (--p50-dom-text) precisa atingir */
      const fg = parse(c.color), bg = parse(c.bg);
      if (!fg || !bg) { detail.push(c.text + ": cor não interpretável (" + c.color + " / " + c.bg + ")"); continue; }
      const ratio = contrast(fg, bg);
      if (ratio < 4.5) detail.push(c.text + ": contraste de texto " + ratio.toFixed(2) + ":1 (" + c.color + " sobre " + c.bg + ")");
    }
    if (Object.keys(seen).length < 2) detail.push("fixture cobriu apenas " + Object.keys(seen).length + " domínio(s)");
    /* nenhuma tag usa o vermelho de marca como cor de domínio */
    for (const c of chips) if (/218,\s*41,\s*28/.test(c.swatch + c.borderLeft))
      detail.push(c.text + ": vermelho de marca usado como cor de domínio");
    observed.push(...chips);
    evidence("P52-DOM1-tags.json", observed);
  } finally { await pg.close(); }
  T("P52-DOM1c", "tags de domínio pintadas com a cor congelada do domínio, com texto contrastado e nome escrito", !detail.length, detail);
}
/* Chromium devolve `color(srgb r g b)` para valores resolvidos de
   `color-mix()`; ler só `rgb()` daria contraste falso perto de 1:1. */
function parse(s) {
  const str = String(s);
  const srgb = str.match(/color\(\s*srgb\s+([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)/);
  if (srgb) return [1, 2, 3].map(i => Math.max(0, Math.min(255, Math.round(parseFloat(srgb[i]) * 255))));
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2]];
}
function chan(c) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function lum(c) { return 0.2126 * chan(c[0]) + 0.7152 * chan(c[1]) + 0.0722 * chan(c[2]); }
function contrast(a, b) { const L1 = lum(a), L2 = lum(b); const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05); }

/* ============================== P52-GAP1v ============================== */
async function gap1v(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-GAP1v");
  try {
    await toResults(pg, FX52.P52_F1);
    const m = await pg.evaluate(() => {
      const g = id => { const e = document.getElementById(id); if (!e) return null;
        const t = e.querySelector("h3"), r = e.getBoundingClientRect();
        const cs = getComputedStyle(t);
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY,
          headText: (t.textContent || "").trim(),
          borderStyle: cs.borderLeftStyle, borderWidth: cs.borderLeftWidth,
          cards: Array.from(e.querySelectorAll(".finding")).map(c => {
            const cr = c.getBoundingClientRect(); const cc = getComputedStyle(c);
            return { l: Math.round(cr.left), t: Math.round(cr.top + window.scrollY),
                     bs: cc.borderLeftStyle, bw: cc.borderLeftWidth }; }) }; };
      return { hi: g("p52-grp-gaps-high"), mo: g("p52-grp-gaps-moderate") };
    });
    if (!m.hi || !m.mo) detail.push("um dos grupos de severidade não foi renderizado");
    else {
      if (m.hi.bottom > m.mo.top + 1) detail.push("os grupos se sobrepõem verticalmente");
      /* distinção NÃO cromática: estilo/espessura de borda diferentes */
      if (m.hi.borderStyle === m.mo.borderStyle && m.hi.borderWidth === m.mo.borderWidth)
        detail.push("headings indistinguíveis em escala de cinza (mesma borda)");
      const c1 = m.hi.cards[0], c2 = m.mo.cards[0];
      if (c1 && c2 && c1.bs === c2.bs && c1.bw === c2.bw)
        detail.push("cards indistinguíveis em escala de cinza");
      if (!/altos/i.test(m.hi.headText) || !/moderados/i.test(m.mo.headText))
        detail.push("headings sem o nome da severidade");
      /* em desktop, cards em duas colunas dentro de cada grupo */
      const cols = new Set(m.hi.cards.map(c => c.l));
      if (m.hi.cards.length > 1 && cols.size < 2)
        detail.push("gaps altos em coluna única com " + m.hi.cards.length + " cards em desktop");
    }
    observed.desktop = m;
    /* mobile: uma coluna */
    const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mob.goto(HTML_URL);
    await toResults(mob, FX52.P52_F1);
    const mm = await mob.evaluate(() => {
      const e = document.getElementById("p52-grp-gaps-high");
      return Array.from(e.querySelectorAll(".finding")).map(c => Math.round(c.getBoundingClientRect().left));
    });
    if (new Set(mm).size !== 1) detail.push("mobile: gaps em mais de uma coluna");
    observed.mobile = mm;
    await mob.close();
    evidence("P52-GAP1-groups.json", observed);
  } finally { await pg.close(); }
  T("P52-GAP1v", "gaps altos e moderados separados também em geometria, e distinguíveis em escala de cinza", !detail.length, detail);
}

/* ============================== P52-REC1g ============================== */
async function rec1g(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-REC1g");
  try {
    await toResults(pg, FX52.P52_F1);
    const m = await pg.evaluate(() => {
      const sec = document.getElementById("p52-sec-support");
      const cards = Array.from(sec.querySelectorAll(":scope > .apoio-block"))
        .map(c => { const r = c.getBoundingClientRect();
          return { l: Math.round(r.left), t: Math.round(r.top + window.scrollY), w: Math.round(r.width) }; });
      const titles = Array.from(sec.querySelectorAll(":scope > .section-title"))
        .map(t => ({ text: (t.textContent || "").trim(), w: Math.round(t.getBoundingClientRect().width) }));
      return { display: getComputedStyle(sec).display, cards, titles,
        declared: sec.getAttribute("data-p52-support-cards"),
        secW: Math.round(sec.getBoundingClientRect().width) };
    });
    if (m.display !== "grid") detail.push("a seção de apoio não é grade (" + m.display + ")");
    if (String(m.cards.length) !== m.declared)
      detail.push("contador " + m.declared + " != " + m.cards.length + " cards medidos");
    if (m.cards.length > 1) {
      const cols = new Set(m.cards.map(c => c.l));
      if (cols.size < 2) detail.push(m.cards.length + " cards de apoio em coluna única no desktop");
      for (const c of m.cards) if (c.w > m.secW * 0.62)
        detail.push("card de apoio ocupando " + Math.round(c.w / m.secW * 100) + "% da seção com " + m.cards.length + " cards");
    }
    /* os títulos de função continuam em faixa própria, de largura total */
    for (const t of m.titles) if (t.w < m.secW - 4)
      detail.push("título de função '" + t.text.slice(0, 40) + "' não ocupa a faixa completa");
    observed.desktop = m;
    /* mobile: uma coluna */
    const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mob.goto(HTML_URL);
    await toResults(mob, FX52.P52_F1);
    const mm = await mob.evaluate(() => Array.from(
      document.querySelectorAll("#p52-sec-support > .apoio-block")).map(c => Math.round(c.getBoundingClientRect().left)));
    if (new Set(mm).size > 1) detail.push("mobile: apoio em mais de uma coluna");
    observed.mobile = mm;
    await mob.close();
    evidence("P52-REC1-grid.json", observed);
  } finally { await pg.close(); }
  T("P52-REC1g", "formas de apoio em grade responsiva, com títulos de função em faixa própria", !detail.length, detail);
}

/* ============================== P52-CTX1v ============================== */
async function ctx1v(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-CTX1v");
  try {
    await toResults(pg, FX52.P52_F1);
    const card = await pg.evaluate(() => {
      const c = document.querySelector("#p52-sec-context .p52-ctxcard");
      if (!c) return null;
      const b = document.getElementById("v32cta").getBoundingClientRect();
      const badge = document.querySelector('.p52-badge[data-p52-badge="optional"]');
      return { w: c.getBoundingClientRect().width, ctaH: b.height, ctaW: b.width,
        badge: badge ? (badge.textContent || "").trim() : null,
        badgeVisible: badge ? badge.getBoundingClientRect().height > 0 : false,
        title: (document.querySelector(".p52-ctxcard-title") || {}).textContent };
    });
    if (!card) detail.push("card de contexto ausente");
    else {
      if (card.ctaH < 44) detail.push("botão de contexto com " + Math.round(card.ctaH) + "px de altura (mínimo 44)");
      if (!card.badgeVisible) detail.push("badge Opcional não visível");
    }
    /* grupo aberto × fechado, no editor real */
    await pg.click("#v32cta");
    await pg.waitForTimeout(200);
    const grp = await pg.evaluate(() => {
      const gs = Array.from(document.querySelectorAll("#v32editor details.v32-group"));
      const g = e => { const cs = getComputedStyle(e), su = getComputedStyle(e.querySelector("summary"));
        return { gid: e.getAttribute("data-gid"), open: e.open, state: e.getAttribute("data-p52-grp"),
          borderLeftW: cs.borderLeftWidth, borderLeftC: cs.borderLeftColor, bg: cs.backgroundColor,
          weight: su.fontWeight, color: su.color,
          stateText: e.querySelector('[data-p52="grp-state"]') ? "presente" : null,
          expanded: e.querySelector("summary").getAttribute("aria-expanded"),
          marker: getComputedStyle(e.querySelector("summary"), "::before").content }; };
      const open = gs.filter(e => e.open), closed = gs.filter(e => !e.open);
      return { total: gs.length, open: open.map(g), closed: closed.map(g) };
    });
    if (!grp.open.length) detail.push("nenhum grupo aberto no editor");
    if (!grp.closed.length) detail.push("nenhum grupo fechado no editor");
    if (grp.open.length && grp.closed.length) {
      const o = grp.open[0], c = grp.closed[0];
      if (o.borderLeftW === c.borderLeftW && o.bg === c.bg)
        detail.push("grupo aberto e fechado com o mesmo tratamento visual");
      if (o.weight === c.weight) detail.push("cabeçalho do grupo aberto sem peso próprio");
      if (o.marker === c.marker) detail.push("marcador de estado idêntico entre aberto e fechado");
      /* REV A · CTX-REV-A §2.4: o pill textual foi REMOVIDO. O estado é
         comunicado por caret, aria-expanded, borda/fundo e conteúdo visível. */
      if (o.stateText !== null || c.stateText !== null)
        detail.push("pill ABERTO/FECHADO ainda renderizado");
      if (o.expanded !== "true" || c.expanded !== "false")
        detail.push("aria-expanded incorreto: aberto=" + o.expanded + " fechado=" + c.expanded);
    }
    /* selects legíveis: contraste texto × fundo >= 4.5:1 */
    const sel = await pg.evaluate(() => Array.from(document.querySelectorAll("#v32editor select")).slice(0, 8).map(s => {
      const cs = getComputedStyle(s); return { color: cs.color, bg: cs.backgroundColor, id: s.id }; }));
    for (const s of sel) {
      const fg = parse(s.color), bg = parse(s.bg);
      if (!fg || !bg) { detail.push("select " + s.id + ": cor não interpretável"); continue; }
      const r = contrast(fg, bg);
      if (r < 4.5) detail.push("select " + s.id + " com contraste " + r.toFixed(2) + ":1");
    }
    observed.card = card; observed.groups = grp; observed.selects = sel;
    evidence("P52-CTX1-context.json", observed);
  } finally { await pg.close(); }
  T("P52-CTX1v", "card de contexto opcional proeminente e grupo ativo do editor distinguível por forma, peso e texto", !detail.length, detail);
}

/* ============================== REV A · HOME / REFINAMENTO ============================== */
async function home1(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-HOME1");
    try {
      const m = await pg.evaluate(() => {
        const box = e => { if (!e) return null; const r = e.getBoundingClientRect();
          return { l: r.left, r: r.right, t: r.top, w: r.width, h: r.height }; };
        const wrap = document.querySelector(".wrap");
        const cs = getComputedStyle(wrap), wr = wrap.getBoundingClientRect();
        return {
          hero: box(document.getElementById("p52-hero")),
          main: box(document.querySelector(".p52-hero-main")),
          art: box(document.querySelector(".p52-hero-art")),
          emblem: box(document.querySelector('[data-p52="home-emblem"]')),
          secondary: box(document.querySelector('[data-p52="home-secondary"]')),
          cta: box(document.getElementById("start")),
          inner: wr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
          /* nenhum rótulo do emblema pode ser cortado pela borda do SVG */
          clipped: (function () {
            const svg = document.querySelector('[data-p52="home-emblem"]');
            if (!svg) return [];
            const sr = svg.getBoundingClientRect(), out = [];
            svg.querySelectorAll("text.p52-emblem-label").forEach(t => {
              const r = t.getBoundingClientRect();
              if (r.left < sr.left - 0.5 || r.right > sr.right + 0.5 ||
                  r.top < sr.top - 0.5 || r.bottom > sr.bottom + 0.5)
                out.push((t.textContent || "").trim());
            });
            return out;
          })(),
          ov: { s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }
        };
      });
      observed.push({ vp: vp.w, main: m.main && Math.round(m.main.w), art: m.art && Math.round(m.art.w) });
      if (!m.hero) { detail.push(vp.w + ": hero ausente"); continue; }
      if (!m.emblem || m.emblem.w <= 0 || m.emblem.h <= 0) detail.push(vp.w + ": emblema não renderizou");
      if (!m.cta || m.cta.h <= 0) detail.push(vp.w + ": CTA de início não visível");
      if (m.ov.s > m.ov.c + 1) detail.push(vp.w + ": overflow horizontal na home");
      if (m.secondary && m.hero && m.secondary.t < m.hero.t) detail.push(vp.w + ": faixa secundária acima do hero");
      if (vp.w >= 1180) {
        /* duas colunas reais, na proporção 7+5 (tolerância de uma coluna) */
        if (m.main.r > m.art.l + 2) detail.push(vp.w + ": colunas do hero se sobrepõem");
        if (m.art.l <= m.main.l) detail.push(vp.w + ": emblema não está à direita do conteúdo");
        if (Math.abs(m.main.t - m.art.t) > m.hero.h) detail.push(vp.w + ": colunas do hero desalinhadas");
        const ratio = m.main.w / (m.main.w + m.art.w);
        if (ratio < 0.52 || ratio > 0.68)
          detail.push(vp.w + ": proporção do hero " + (ratio * 100).toFixed(1) + "% (esperado ~58% para 7+5)");
        if (m.emblem.w < 240) detail.push(vp.w + ": emblema com " + Math.round(m.emblem.w) + "px — pequeno demais para o hero");
        if (m.clipped && m.clipped.length)
          detail.push(vp.w + ": rótulo(s) do emblema clipado(s): " + m.clipped.join(", "));
      } else {
        if (m.art.t < m.main.t) detail.push(vp.w + ": no mobile o emblema deveria vir abaixo do texto");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-HOME1-hero.json", observed);
  T("P52-HOME1", "home em hero 7+5, com emblema dos cinco domínios e ações secundárias abaixo", !detail.length, detail);
}

async function ref1(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-REF1");
    try {
      await pg.evaluate(qids => {
        window.__DEV.setArq(0);
        qids.forEach(id => window.__DEV.setAnswerById(id, 1));
        window.__DEV.gotoStep(qids.length);
        document.getElementById("next").click();
      }, FX50.P50_QIDS);
      await pg.waitForTimeout(200);
      const m = await pg.evaluate(() => {
        const g = id => { const e = document.getElementById(id); if (!e) return null;
          const r = e.getBoundingClientRect(), c = getComputedStyle(e);
          return { w: r.width, h: r.height, t: r.top, l: r.left,
                   pad: c.paddingTop + "/" + c.paddingBottom + "/" + c.paddingLeft + "/" + c.paddingRight,
                   align: c.textAlign, bg: c.backgroundColor, border: c.borderTopColor, radius: c.borderTopLeftRadius }; };
        return { screen: document.body.getAttribute("data-uxscreen"), go: g("ref-go"), skip: g("ref-skip-all") };
      });
      observed.push({ vp: vp.w, go: m.go && Math.round(m.go.w) + "x" + Math.round(m.go.h),
        skip: m.skip && Math.round(m.skip.w) + "x" + Math.round(m.skip.h) });
      if (m.screen !== "refbranch") { detail.push(vp.w + ": tela de refinamento não alcançada (" + m.screen + ")"); continue; }
      if (!m.go || !m.skip) { detail.push(vp.w + ": um dos CTAs ausente"); continue; }
      if (Math.abs(m.go.h - m.skip.h) > 1)
        detail.push(vp.w + ": alturas diferentes " + Math.round(m.go.h) + " vs " + Math.round(m.skip.h));
      if (m.go.h < 44 || m.skip.h < 44)
        detail.push(vp.w + ": altura abaixo de 44px (" + Math.round(m.go.h) + "/" + Math.round(m.skip.h) + ")");
      if (m.go.pad !== m.skip.pad) detail.push(vp.w + ": paddings diferentes");
      if (m.go.align !== m.skip.align) detail.push(vp.w + ": alinhamento de texto diferente");
      if (m.go.radius !== m.skip.radius) detail.push(vp.w + ": raio de borda diferente");
      /* hierarquia: um preenchido, outro contornado — e nunca o inverso */
      if (m.go.bg === m.skip.bg) detail.push(vp.w + ": os dois CTAs com o mesmo preenchimento");
      if (vp.w >= 768) {
        if (Math.abs(m.go.t - m.skip.t) > 1) detail.push(vp.w + ": CTAs desalinhados verticalmente");
        if (Math.abs(m.go.w - m.skip.w) > 1 && Math.min(m.go.w, m.skip.w) < 280)
          detail.push(vp.w + ": larguras divergentes sem min-width comum");
      } else {
        if (Math.abs(m.go.w - m.skip.w) > 1) detail.push(vp.w + ": no mobile os CTAs deveriam ter a mesma largura");
        if (m.skip.t <= m.go.t) detail.push(vp.w + ": no mobile os CTAs deveriam empilhar com o primário acima");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-REF1-ctas.json", observed);
  T("P52-REF1", "os dois CTAs do refinamento com geometria equivalente e hierarquia só de preenchimento", !detail.length, detail);
}

/* ============================== REV A · VISÃO EXECUTIVA ============================== */
async function exec1(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-EXEC1");
    try {
      await toResults(pg, FX52.P52_F1);
      const m = await pg.evaluate(() => {
        const px = e => e ? parseFloat(getComputedStyle(e).fontSize) : null;
        const box = e => { if (!e) return null; const r = e.getBoundingClientRect();
          return { w: r.width, h: r.height, l: r.left, r: r.right, t: r.top }; };
        const head = document.querySelector("#p52-sec-exec > .res-head");
        return {
          score: px(document.querySelector("#p52-sec-exec .score-big")),
          small: px(document.querySelector("#p52-sec-exec .score-big small")),
          stage: box(document.querySelector("#p52-sec-exec .stage-tag")),
          radar: box(document.querySelector("#p52-sec-exec svg.radar")),
          head: box(head),
          grid2: box(document.querySelector("#p52-sec-exec > .grid2")),
          body: px(document.querySelector("#p52-sec-exec .panel")),
          rail: px(document.querySelector(".p52-rail-link")),
          arq: box(document.querySelector("#p52-sec-exec .arq-tag"))
        };
      });
      observed.push({ vp: vp.w, score: m.score, radar: m.radar && Math.round(m.radar.w) });
      if (!m.score) { detail.push(vp.w + ": score não renderizou"); continue; }
      /* §5.5 · escala tipográfica mínima */
      if (m.body !== null && m.body < 15) detail.push(vp.w + ": corpo do card com " + m.body + "px (mínimo 15)");
      if (m.rail !== null && m.rail < 13) detail.push(vp.w + ": trilho com " + m.rail + "px (mínimo 13)");
      if (vp.w >= 1180) {
        /* §5.1 + REV B §7.1 · o score é a âncora visual, agora entre 80 e 112 */
        if (m.score < 80 || m.score > 112)
          detail.push(vp.w + ": score com " + m.score + "px (esperado 80–112)");
        if (m.small === null || m.small < 20) detail.push(vp.w + ": '/ 5.0' ilegível (" + m.small + "px)");
        if (!m.stage || m.stage.h < 28) detail.push(vp.w + ": estágio sem badge legível");
        if (!m.arq) detail.push(vp.w + ": base/arquitetura ausente junto ao score");
        /* §5.2 + REV B §7.1 · até 1920px o radar mantém EXATAMENTE a geometria
           do gate visual congelado V1 (420px de 1200 a 1499; 460px a partir de
           1500) — e 460 já está dentro da faixa 440–540 pedida pela REV B. A
           partir de 2200px, onde V1 não mede e há largura de sobra, ele cresce
           para 520px. Em desktop amplo o gate exige a faixa da REV B. */
        const esperado = vp.w >= 2200 ? 520 : (vp.w >= 1500 ? 460 : 420);
        if (!m.radar || Math.abs(m.radar.w - esperado) > 8)
          detail.push(vp.w + ": radar " + (m.radar && Math.round(m.radar.w)) + "px != " + esperado + "px");
        if (vp.w >= 1920 && m.radar && (m.radar.w < 440 || m.radar.w > 540))
          detail.push(vp.w + ": radar fora da faixa 440–540px da REV B (" + Math.round(m.radar.w) + ")");
        /* §5.3 · a terceira coluna não pode ser uma caixinha solta */
        if (m.grid2 && m.head && m.grid2.w < 260)
          detail.push(vp.w + ": coluna de domínios/síntese com " + Math.round(m.grid2.w) + "px");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-EXEC1-anchor.json", observed);
  T("P52-EXEC1", "score como âncora visual, radar na geometria congelada e escala tipográfica mínima", !detail.length, detail);
}

async function exec2(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-EXEC2");
    try {
      await toResults(pg, FX52.P52_F1);
      const m = await pg.evaluate(() => {
        const box = e => { if (!e) return null; const r = e.getBoundingClientRect();
          return { w: r.width, h: r.height, l: r.left, r: r.right, t: r.top + window.scrollY }; };
        return {
          journey: box(document.querySelector("#ux-journey .jn-wrap")),
          pair: box(document.querySelector('[data-p52="exec-pair"]')),
          advance: box(document.querySelector('[data-p52="exec-advance"]')),
          reading: box(document.querySelector('[data-p52="exec-reading"]')),
          sec: box(document.getElementById("p52-sec-exec")),
          advanceInside: !!document.querySelector('[data-p52="exec-advance"] .jn-themes'),
          readingInside: !!document.querySelector('[data-p52="exec-reading"] .jn-narrative'),
          themesInTrack: !!document.querySelector("#ux-journey .jn-wrap .jn-themes")
        };
      });
      observed.push({ vp: vp.w, advance: m.advance && Math.round(m.advance.w), reading: m.reading && Math.round(m.reading.w) });
      if (!m.pair) { detail.push(vp.w + ": par 'Para avançar' × 'Leitura executiva' não montado"); continue; }
      if (!m.advanceInside) detail.push(vp.w + ": card 'Para avançar' vazio");
      if (!m.readingInside) detail.push(vp.w + ": card 'Leitura executiva' vazio");
      if (m.themesInTrack) detail.push(vp.w + ": 'Para avançar' continua dentro da régua da jornada");
      if (m.journey && m.pair && m.pair.t < m.journey.t) detail.push(vp.w + ": par acima da jornada");
      if (m.journey && m.sec && m.journey.w < m.sec.w - 4)
        detail.push(vp.w + ": jornada não ocupa a faixa de 12 colunas (" + Math.round(m.journey.w) + " de " + Math.round(m.sec.w) + ")");
      if (vp.w >= 1180) {
        if (Math.abs(m.advance.t - m.reading.t) > 2) detail.push(vp.w + ": os dois cards não estão na mesma linha");
        if (m.advance.r > m.reading.l + 2) detail.push(vp.w + ": os cards se sobrepõem");
        const dif = Math.abs(m.advance.w - m.reading.w) / Math.max(m.advance.w, m.reading.w);
        if (dif > 0.06) detail.push(vp.w + ": larguras 6+6 divergentes em " + (dif * 100).toFixed(1) + "%");
        const dh = Math.abs(m.advance.h - m.reading.h) / Math.max(m.advance.h, m.reading.h);
        if (dh > 0.35) detail.push(vp.w + ": alturas dos cards muito desiguais (" + (dh * 100).toFixed(0) + "%)");
      } else {
        if (m.reading.t <= m.advance.t) detail.push(vp.w + ": no mobile os cards deveriam empilhar");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-EXEC2-pair.json", observed);
  T("P52-EXEC2", "jornada em faixa de 12 colunas e, abaixo, 'Para avançar' × 'Leitura executiva' em 6+6", !detail.length, detail);
}

/* ============================== REV A · AJUDA POR CAPABILITY ============================== */
async function help1(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-HELP1");
  try {
    await toResults(pg, FX52.P52_F1);
    await pg.click("#v32cta");
    await pg.waitForTimeout(250);
    const sel = '[data-p52="cap-help"][data-cap="knowledge-management"]';
    const exists = await pg.$(sel);
    if (!exists) { T("P52-HELP1", "ajuda por capability", false, ["controle de ajuda ausente"]); return; }

    /* (a) hover do mouse abre */
    await pg.hover(sel);
    await pg.waitForTimeout(120);
    let st = await pg.evaluate(s => {
      const b = document.querySelector(s), p = document.getElementById(b.getAttribute("aria-describedby"));
      return { open: !p.hidden, expanded: b.getAttribute("aria-expanded"),
               box: p.getBoundingClientRect().height, txt: (p.textContent || "").trim().length };
    }, sel);
    if (!st.open) detail.push("hover não abriu a ajuda");
    if (st.expanded !== "true") detail.push("hover não refletiu aria-expanded");
    if (st.box <= 0) detail.push("popover sem caixa visível");
    observed.hover = st;

    /* (b) foco por teclado abre */
    await pg.mouse.move(0, 0);
    await pg.waitForTimeout(120);
    await pg.evaluate(s => document.querySelector(s).focus(), sel);
    await pg.waitForTimeout(120);
    st = await pg.evaluate(s => {
      const b = document.querySelector(s), p = document.getElementById(b.getAttribute("aria-describedby"));
      return { open: !p.hidden, focused: document.activeElement === b };
    }, sel);
    if (!st.focused) detail.push("controle de ajuda não recebeu foco");
    if (!st.open) detail.push("foco por teclado não abriu a ajuda");

    /* (c) Esc fecha e devolve o foco */
    await pg.keyboard.press("Escape");
    await pg.waitForTimeout(120);
    st = await pg.evaluate(s => {
      const b = document.querySelector(s), p = document.getElementById(b.getAttribute("aria-describedby"));
      return { open: !p.hidden, focused: document.activeElement === b, expanded: b.getAttribute("aria-expanded") };
    }, sel);
    if (st.open) detail.push("Esc não fechou a ajuda");
    if (!st.focused) detail.push("Esc não devolveu o foco ao controle");
    if (st.expanded !== "false") detail.push("aria-expanded não voltou a false");

    /* (d) clique/toque alterna e apenas um popover fica aberto */
    const two = await pg.evaluate(() => {
      const bs = Array.from(document.querySelectorAll('[data-p52="cap-help"]'));
      bs[0].click(); bs[1].click();
      const open = bs.filter(b => !document.getElementById(b.getAttribute("aria-describedby")).hidden);
      return { total: bs.length, abertos: open.length, quais: open.map(b => b.getAttribute("data-cap")) };
    });
    if (two.abertos !== 1) detail.push(two.abertos + " popovers abertos ao mesmo tempo");
    observed.exclusivo = two;

    /* (e) abrir a ajuda não desloca o formulário */
    const shift = await pg.evaluate(() => {
      const cap = document.querySelectorAll(".v32-cap")[3];
      const antes = cap.getBoundingClientRect().top;
      const b = document.querySelector('[data-p52="cap-help"]');
      b.click();
      const depois = cap.getBoundingClientRect().top;
      b.click();
      return Math.abs(depois - antes);
    });
    if (shift > 2) detail.push("abrir a ajuda deslocou o formulário em " + Math.round(shift) + "px");
    observed.deslocamento = shift;

    /* (f) o texto não pode virar parede: 2–4 linhas em desktop */
    const alturas = await pg.evaluate(() => {
      const out = [];
      document.querySelectorAll('[data-p52="cap-help"]').forEach(b => {
        const p = document.getElementById(b.getAttribute("aria-describedby"));
        p.hidden = false;
        const lh = parseFloat(getComputedStyle(p).lineHeight);
        out.push(Math.round(p.getBoundingClientRect().height / lh));
        p.hidden = true;
      });
      return out;
    });
    const demais = alturas.filter(l => l > 6);
    if (demais.length) detail.push(demais.length + " verbetes com mais de 6 linhas em desktop");
    observed.linhas = alturas;
  } finally { await pg.close(); }
  evidence("P52-HELP1-popover.json", observed);
  T("P52-HELP1", "ajuda por capability funciona a mouse, teclado, clique e Esc, com um popover por vez", !detail.length, detail);
}

/* ============================== REV A · ÍCONES ============================== */
/* ICON-REV-A §8.2 · altura aparente medida em PIXEL do bounding box da tinta.
   Artworks marcadamente panorâmicos (aspecto > 1.25) são limitados pela
   LARGURA: igualar a altura deles estouraria o tile, e cortar ou distorcer é
   proibido pela própria §8.1. Para esses, o critério é a largura aparente. */
async function icon2(browser, errs) {
  const detail = [], observed = [];
  const EXIGIDOS = ["Serviços FortiGuard", "FortiGuard SOCaaS", "FortiGuard MDR",
    "FortiSOAR", "FortiSIEM", "FortiRecon", "FortiEndpoint"];
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-ICON2");
  try {
    await toResults(pg, { vec: new Array(15).fill(0) });
    const tiles = await pg.evaluate(async () => {
      const out = [], seen = {};
      for (const img of Array.from(document.querySelectorAll(".icon-tile img"))) {
        const tile = img.closest(".icon-tile");
        const key = (img.getAttribute("alt") || "") + "|" + (tile.classList.contains("sm") ? "sm" : "lg");
        if (seen[key]) continue; seen[key] = 1;
        const tr = tile.getBoundingClientRect(), ir = img.getBoundingClientRect();
        const cs = getComputedStyle(img);
        const scale = parseFloat(cs.getPropertyValue("--p52-icon-scale")) || 1;
        const bmp = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = img.getAttribute("src"); });
        const S = 256, c = document.createElement("canvas"); c.width = S; c.height = S;
        const x = c.getContext("2d"); x.clearRect(0, 0, S, S); x.drawImage(bmp, 0, 0, S, S);
        const d = x.getImageData(0, 0, S, S).data;
        let minx = S, miny = S, maxx = -1, maxy = -1;
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++)
          if (d[(yy * S + xx) * 4 + 3] > 16) {
            if (xx < minx) minx = xx; if (xx > maxx) maxx = xx;
            if (yy < miny) miny = yy; if (yy > maxy) maxy = yy;
          }
        if (maxx < 0) continue;
        const fw = (maxx - minx + 1) / S, fh = (maxy - miny + 1) / S;
        const drawn = Math.min(ir.width, ir.height) * scale;
        const tileSide = Math.min(tr.width, tr.height);
        out.push({
          alt: img.getAttribute("alt") || "(sem alt)",
          size: tile.classList.contains("sm") ? "sm" : "lg",
          icon: img.getAttribute("data-p52-icon") || null,
          objectFit: cs.objectFit, scale: scale,
          aspect: fw / fh,
          hApparent: (fh * drawn) / tileSide,
          wApparent: (fw * drawn) / tileSide
        });
      }
      return out;
    });
    if (!tiles.length) detail.push("nenhum tile de ícone medido");
    const vistos = tiles.filter(t => t.size === "lg").map(t => t.alt);
    for (const nome of EXIGIDOS)
      if (vistos.indexOf(nome) < 0) detail.push("ícone exigido não amostrado: " + nome);

    const grupos = {};
    tiles.forEach(t => (grupos[t.size] = grupos[t.size] || []).push(t));
    for (const size of Object.keys(grupos)) {
      const list = grupos[size];
      const quadrados = list.filter(t => t.aspect <= 1.25);
      const panoramicos = list.filter(t => t.aspect > 1.25);
      for (const t of list) {
        if (t.objectFit !== "contain") detail.push(t.alt + ": object-fit=" + t.objectFit);
        if (!t.icon) detail.push(t.alt + ": tile sem identidade de asset (data-p52-icon)");
        if (t.wApparent > 0.9 || t.hApparent > 0.9)
          detail.push(size + "/" + t.alt + ": artwork encosta na borda do tile");
      }
      for (const t of quadrados) {
        if (t.hApparent < 0.68 - 0.005 || t.hApparent > 0.82 + 0.005)
          detail.push(size + "/" + t.alt + ": altura aparente " + (t.hApparent * 100).toFixed(1) + "% do tile");
      }
      for (const t of panoramicos) {
        if (t.wApparent < 0.68 - 0.005 || t.wApparent > 0.82 + 0.005)
          detail.push(size + "/" + t.alt + ": largura aparente " + (t.wApparent * 100).toFixed(1) + "% (artwork panorâmico)");
      }
      if (quadrados.length > 1) {
        const hs = quadrados.map(t => t.hApparent).sort((a, b) => a - b);
        const med = hs[Math.floor(hs.length / 2)];
        for (const t of quadrados) {
          const dev = Math.abs(t.hApparent - med) / med;
          if (dev > 0.10)
            detail.push(size + "/" + t.alt + ": desvio de altura " + (dev * 100).toFixed(1) + "% da mediana");
        }
      }
    }
    evidence("P52-ICON2-optics.json", tiles);
    observed.push.apply(observed, tiles);
  } finally { await pg.close(); }
  T("P52-ICON2", "catálogo exibido com altura aparente normalizada e nenhum artwork encostando na borda", !detail.length, detail);
}

/* ============================== REV A · PRINT ============================== */
async function pr2(browser, errs) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => errs.push("P52-PR2: " + String(e.message)));
  try {
    await pg.goto(HTML_URL);
    await toResults(pg, FX52.P52_F1);
    /* abre editor e ajuda, para que popover e accordions estejam VIVOS */
    await pg.click("#v32cta");
    await pg.waitForTimeout(200);
    await pg.evaluate(() => { const b = document.querySelector('[data-p52="cap-help"]'); if (b) b.click(); });
    await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await pg.emulateMedia({ media: "print" });
    await pg.waitForTimeout(150);
    const m = await pg.evaluate(() => {
      const seen = e => { const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const list = {};
      [["trilho lateral", "#p52-rail"], ["popover de ajuda", ".p52-caphelp-pop"],
       ["controle de ajuda", ".p52-caphelp-btn"], ["orientação de região", ".p52-ctxregion-lead"],
       ["numeração de região", ".p52-ctxregion-num"], ["affordance do disclosure", ".p52-evbase-more"],
       ["títulos de seção", ".p52-sec-title"], ["ponteiro do gate", ".p52-gate-jump"]]
        .forEach(([nome, sel]) => { list[nome] = Array.from(document.querySelectorAll(sel)).some(seen); });
      return list;
    });
    observed.leaks = m;
    for (const k of Object.keys(m)) if (m[k]) detail.push("vazou para o papel: " + k);
  } finally { await pg.close(); }
  evidence("P52-PR2-print.json", observed);
  T("P52-PR2", "popovers, trilho, editores e cromo da REV A não alcançam o papel", !detail.length, detail);
}

/* ============================== P52-PR1 ============================== */
/* Isolamento de print: nada do workspace pode alcançar o papel, e o relatório
   executivo V3.2 precisa continuar materialmente idêntico ao do baseline. */
function baselineFile() {
  try {
    const { execFileSync } = require("child_process");
    const buf = execFileSync("git", ["show", P52_BASELINE_COMMIT + ":quickscan_secops_soccmm_v3_2_dev.html"],
      { cwd: HERE, maxBuffer: 1 << 28 });
    const got = crypto.createHash("sha256").update(buf).digest("hex");
    if (got !== P52_BASELINE_SHA) return { ok: false, why: "blob do commit-âncora com SHA " + got.slice(0, 16) };
    const f = path.join(require("os").tmpdir(), "p52-baseline-" + P52_BASELINE_SHA.slice(0, 12) + ".html");
    fs.writeFileSync(f, buf);
    return { ok: true, file: f };
  } catch (e) { return { ok: false, why: String(e.message).split("\n")[0] }; }
}
async function printReport(browser, url, fx, errs, tag) {
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => errs.push(tag + ": " + String(e.message)));
  await pg.goto(url);
  /* contexto declarado: sem ele o modo legado imprime a própria tela e não há
     relatório V3.2 a comparar */
  await pg.evaluate(([qids, vec]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    window.__DEV.showResults();
  }, [FX50.P50_QIDS, fx.vec]);
  await pg.waitForTimeout(150);
  await pg.click("#v32cta");
  await pg.evaluate(() => {
    const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
    ["security-analytics", "endpoint-detection"].forEach(c => {
      const s = document.getElementById("v32-pres-" + c);
      if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
    });
  });
  await pg.click("#v32save");
  await pg.waitForTimeout(200);
  await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(120);
  return pg;
}
async function pr1(browser, errs) {
  const detail = [], observed = {};
  const base = baselineFile();
  if (!base.ok) { T("P52-PR1", "isolamento de print", false, ["baseline indisponível: " + base.why]); return; }

  /* (a) nada do workspace vaza para o papel */
  const cp = await printReport(browser, HTML_URL, FX52.P52_F1, errs, "P52-PR1/cand");
  try {
    const leak = await cp.evaluate(() => {
      const seen = e => { if (!e) return false; const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const list = {};
      [["trilho", "#p52-rail"], ["títulos de seção", ".p52-sec-title"],
       ["card de CTA de contexto", ".p52-ctxcard-head"], ["painel de contexto", "#v32panel"],
       ["editor de contexto", "#v32editor"], ["estado de grupo", ".p52-grp-state"],
       ["contador de gaps", ".p52-gapgrp-count"], ["controles de sessão", "#ses-actions"]]
        .forEach(([nome, sel]) => { list[nome] = Array.from(document.querySelectorAll(sel)).some(seen); });
      const report = document.getElementById("v32-print-report");
      return { list, printMode: document.body.classList.contains("v32-print-mode"),
        reportText: report ? (report.textContent || "").replace(/\s+/g, " ").trim() : null,
        reportVisible: seen(report) };
    });
    observed.leaksPdf = leak.list;
    if (!leak.printMode) detail.push("modo de print V3.2 não ativo — comparação inválida");
    for (const k of Object.keys(leak.list)) if (leak.list[k]) detail.push("vazou para o PDF executivo: " + k);
    if (!leak.reportVisible) detail.push("relatório executivo V3.2 ausente do papel");

    /* (b) o relatório executivo é materialmente idêntico ao do baseline */
    const bp = await printReport(browser, "file://" + base.file, FX52.P52_F1, errs, "P52-PR1/base");
    try {
      const bt = await bp.evaluate(() => {
        const r = document.getElementById("v32-print-report");
        return r ? (r.textContent || "").replace(/\s+/g, " ").trim() : null;
      });
      /* o relatório carimba data e hora de geração: normalizar é obrigatório,
         senão o gate acusaria diferença material a cada segundo de relógio. */
      const stamp = t => String(t).replace(/\d{2}\/\d{2}\/\d{4},?\s*\d{2}:\d{2}:\d{2}/g, "<carimbo>");
      observed.reportLenCandidate = leak.reportText ? leak.reportText.length : 0;
      observed.reportLenBaseline = bt ? bt.length : 0;
      /* PHASE 5.2 · REV B (PDF-B): o relatório do cliente foi REESTRUTURADO por
         decisão do proprietário — abertura única, orientação antes dos números,
         KPI de suficiência fora, linguagem de negócio, prioridades na página 2.
         Comparar o texto inteiro com o baseline deixou de descrever o produto.
         O que continua sendo medido, e é mais forte do que igualdade de string:
           (a) nenhuma SEÇÃO do relatório se perdeu;
           (b) o ANEXO de respostas da sessão continua com os mesmos FATOS,
               caractere a caractere, depois de normalizar carimbo e a
               linguagem de apresentação declarada;
           (c) as proibições explícitas da revisão são verificadas. */
      const secsBase = await bp.evaluate(() => Array.from(
        document.querySelectorAll("#v32-print-report .pr-sec")).map(e => e.id).filter(Boolean));
      const secsCand = await cp.evaluate(() => Array.from(
        document.querySelectorAll("#v32-print-report .pr-sec")).map(e => e.id).filter(Boolean));
      observed.secoes = { baseline: secsBase, candidato: secsCand };
      for (const id of secsBase)
        if (secsCand.indexOf(id) < 0) detail.push("seção perdida no relatório: " + id);

      const anexo = pg => pg.evaluate(() => {
        const a = document.querySelector("#v32-print-report #pr-annex");
        return a ? (a.textContent || "").replace(/\s+/g, " ").trim() : null;
      });
      const aB = await anexo(bp), aC = await anexo(cp);
      if (!aB || !aC) detail.push("anexo de respostas ausente em um dos lados");
      else {
        const norm = await cp.evaluate(t => (window.__P52 && window.__P52.applyCopy)
          ? window.__P52.applyCopy(t) : t, stamp(aB));
        if (stamp(aC) !== norm) {
          let i = 0; while (i < Math.min(norm.length, stamp(aC).length) && norm[i] === stamp(aC)[i]) i++;
          detail.push("os FATOS do anexo mudaram no caractere " + i + ": baseline '" +
            norm.slice(i, i + 70) + "' vs candidato '" + stamp(aC).slice(i, i + 70) + "'");
        }
      }
      const proibido = await cp.evaluate(() => {
        const t = (document.getElementById("v32-print-report").textContent || "");
        return {
          jargao: /\bmandato\b|charter/i.test(t),
          kpiSuff: /Sufici[êe]ncia da sess[ãa]o/i.test(t),
          cobertura: /Cobertura da evid[êe]ncia/i.test(t)
        };
      });
      observed.proibido = proibido;
      if (proibido.jargao) detail.push("relatório do cliente ainda usa 'mandato' ou 'charter'");
      if (proibido.kpiSuff) detail.push("KPI 'Suficiência da sessão' voltou ao relatório do cliente");
      if (!proibido.cobertura) detail.push("linha 'Cobertura da evidência' ausente dos metadados");
    } finally { await bp.close(); }
  } finally { await cp.close(); }

  /* (c) MIGRAÇÃO DE GATE · ERRATA DA AUDITORIA EXTERNA · B-02/B-03.

     O enunciado anterior era: "no modo LEGADO (sem contexto declarado) o papel
     é a própria tela; a única diferença material autorizada pela diretriz §7 é
     a remoção da caixa 'Próximo passo sugerido'. Tudo o mais precisa continuar
     impresso." Isso codificava o blocker B-02: sem contexto tecnológico —
     a configuração documentada como legítima e completa — o documento entregue
     ao cliente era a superfície de aplicação.

     A OBRIGAÇÃO que este bloco protege continua a mesma e continua asserida: o
     cromo do workspace não pode vazar para o papel. O que mudou é que agora ela
     é satisfeita por CONSTRUÇÃO, e o gate exige a construção: `.wrap` inteira
     fora do papel nas duas condições de contexto.

     Correspondência linha a linha:
       ANTES                                   DEPOIS
       !c.legacy → FAIL                    →   c.legacy (candidato ainda imprimindo
                                               a tela) → FAIL; e o baseline TEM de
                                               tê-la impresso, senão a diferença
                                               declarada não existe
       chrome[k] visível → FAIL            →   PRESERVADO, medido no papel real
       c.next !== 0 → FAIL                 →   PRESERVADO (nada da tela no papel)
       findings/apoio/prio/rulers/radar/
         legend iguais ao baseline         →   nenhum deles pintado no papel
       anexo/rodapé iguais ao baseline     →   comparados na TELA, onde a
                                               obrigação de não regredir vale */
  const lc = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const lb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const read = pg => pg.evaluate(() => {
      const seen = e => { const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const norm = s => (s || "").replace(/\s+/g, " ").trim();
      const chrome = {};
      [["trilho", "#p52-rail"], ["títulos de seção", ".p52-sec-title"],
       ["lead de seção", ".p52-sec-lead"], ["card de CTA de contexto", ".p52-ctxcard-head"],
       ["explicação do CTA", ".p52-ctxcard-explain"], ["estado de grupo", ".p52-grp-state"],
       ["contador de gaps", ".p52-gapgrp-count"], ["marcador de gaps", ".p52-gapgrp-mark"]]
        .forEach(([nome, sel]) => { chrome[nome] = Array.from(document.querySelectorAll(sel)).some(seen); });
      return {
        chrome,
        legacy: !document.body.classList.contains("v32-print-mode"),
        findings: Array.from(document.querySelectorAll(".finding")).filter(seen).length,
        apoio: Array.from(document.querySelectorAll(".apoio-block")).filter(seen).length,
        prio: Array.from(document.querySelectorAll(".prio-decl")).filter(seen).length,
        rulers: Array.from(document.querySelectorAll("#app .grid2 .panel .dom .ruler")).filter(seen).length,
        radar: Array.from(document.querySelectorAll("#app .radar-box svg")).filter(seen).length,
        legend: Array.from(document.querySelectorAll("#app .scale-legend")).filter(seen).length,
        next: Array.from(document.querySelectorAll(".next")).filter(seen).length,
        annex: norm((document.getElementById("annex") || {}).textContent).length,
        /* ERRATA EXTERNA · o censo do papel é de TINTA, não de `textContent`:
           o nó legado continua no DOM (R-01) e o que importa é se ele PINTA. */
        annexVisible: (function () { const a = document.getElementById("annex"); return !!a && seen(a); })(),
        footer: norm((document.querySelector(".wrap > footer") || {}).textContent)
      };
    });
    var telas = {};
    for (const [tag, pg, url] of [["c", lc, HTML_URL], ["b", lb, "file://" + base.file]]) {
      await pg.goto(url);
      await toResults(pg, FX52.P52_F1);
      /* TELA primeiro: é onde anexo e rodapé continuam tendo de ser idênticos */
      telas[tag] = await read(pg);
      await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
      await pg.emulateMedia({ media: "print" });
      await pg.waitForTimeout(120);
    }
    const cTela = telas.c, bTela = telas.b;
    /* medida de TELA, antes de qualquer print: é onde anexo e rodapé continuam
       tendo de ser idênticos ao baseline. */
    const c = await read(lc), b = await read(lb);
    observed.legacyCandidate = c; observed.legacyBaseline = b;
    if (!b.legacy)
      detail.push("o baseline de entrada NÃO imprimia a tela sem contexto — a diferença declarada não existe");
    if (c.legacy)
      detail.push("o candidato ainda imprime a tela sem contexto declarado (B-02 não corrigido)");
    /* o papel legado é a PRÓPRIA `.wrap`: é aqui que um vazamento do cromo do
       workspace apareceria, e não no PDF executivo (onde a `.wrap` inteira já
       está oculta pela camada congelada) */
    for (const k of Object.keys(c.chrome)) if (c.chrome[k]) detail.push("vazou para o papel: " + k);
    if (c.next !== 0) detail.push("a caixa 'Próximo passo sugerido' ainda alcança o papel");
    if (b.next === 0) detail.push("o baseline não imprimia a caixa 'Próximo passo' — a diferença declarada não existe");
    /* nenhuma superfície de aplicação é pintada no papel do candidato; e o
       baseline TEM de tê-las pintado, senão o gate estaria medindo o nada. */
    for (const k of ["findings", "apoio", "prio", "rulers", "radar", "legend"]) {
      if (c[k] !== 0) detail.push("print sem contexto: " + k + " ainda pintado no papel (" + c[k] + ")");
      if (b[k] === 0) detail.push("baseline não pintava " + k + " no papel — a diferença declarada não existe");
    }
    if (c.annexVisible)
      detail.push("print sem contexto: anexo legado de evidências ainda pintado no papel");
    if (!b.annexVisible)
      detail.push("baseline não pintava o anexo legado no papel — a diferença declarada não existe");
    /* REV B §2.3 · o card intermediário saiu do hero e a única informação que
       só existia nele — o framework ser aberto e neutro — foi consolidada no
       rodapé. É uma adição DECLARADA: o gate a subtrai e exige que todo o
       resto do rodapé continue idêntico ao baseline. */
    const NEUTRA = /\s*O SOC-CMM é um framework aberto e neutro de fabricante\.\s*/;
    if (!NEUTRA.test(cTela.footer))
      detail.push("a nota de neutralidade do framework não foi consolidada no rodapé");
    if (NEUTRA.test(bTela.footer))
      detail.push("o baseline já trazia a nota de neutralidade — a diferença declarada não existe");
    const semNeutra = cTela.footer.replace(NEUTRA, " ").replace(/\s+/g, " ").trim();
    if (semNeutra !== bTela.footer.replace(/\s+/g, " ").trim())
      detail.push("rodapé mudou além da nota declarada");
    /* o anexo de evidências da TELA continua idêntico ao baseline: a errata não
       alterou conteúdo de sessão, só o caminho de impressão. */
    if (cTela.annex !== bTela.annex)
      detail.push("tela: anexo de evidências mudou de tamanho " + bTela.annex + " -> " + cTela.annex);
  } finally { await lc.close(); await lb.close(); }

  evidence("P52-PR1-print.json", observed);
  T("P52-PR1", "print isolado: workspace fora do papel, nenhuma seção perdida, fatos do anexo intactos e proibições da REV B respeitadas", !detail.length, detail);
}

/* ============================== REV B · DOM-B / SUPPORT-B / PDF ============================== */
async function dom3(browser, errs) {
  const detail = [], observed = [];
  for (const vp of VIEWPORTS) {
    const pg = await pageAt(browser, vp, errs, "P52-DOM3");
    try {
      await toResults(pg, FX52.P52_F1);
      const m = await pg.evaluate(() => {
        const w = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().width : null; };
        /* o tab Resumo é medido ENQUANTO está visível; só depois se troca para
           o Heat Map. Medir um painel `hidden` devolveria zero e o gate
           acusaria um defeito que não existe. */
        const base = {
          flow: w("#p52-flow"), res: w("#p50-results"),
          resumo: w("#p50-panel-resumo"),
          cards: (function () {
            const b = document.querySelector("#p50-panel-resumo .p50-res-cards");
            if (!b) return null;
            const kids = Array.from(b.children).map(c => Math.round(c.getBoundingClientRect().left));
            return { cols: new Set(kids).size, n: kids.length };
          })()
        };
        const heat = document.querySelector('#p50-results [data-p50="tab"][data-p50-tab="heatmap"]');
        if (heat) heat.click();
        base.hm = w("#p50-results .p50-hm");
        base.alt = w("#p50-results .p50-alt-table");
        base.ov = { s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth };
        return base;
      });
      const ratio = m.res && m.flow ? m.res / m.flow : 0;
      observed.push({ vp: vp.w, ratio: +ratio.toFixed(3), res: m.res && Math.round(m.res) });
      if (m.ov.s > m.ov.c + 1) detail.push(vp.w + ": overflow horizontal");
      if (vp.w >= 1180) {
        if (ratio < 0.80)
          detail.push(vp.w + ": painel de domínios ocupa " + (ratio * 100).toFixed(1) + "% do workspace (mínimo 80%)");
        if (m.hm && m.res && m.hm < m.res * 0.9)
          detail.push(vp.w + ": heat map com coluna vazia à direita (" + Math.round(m.hm) + " de " + Math.round(m.res) + ")");
        if (m.cards && m.cards.n > 1 && m.cards.cols < 2)
          detail.push(vp.w + ": pontos fortes e prioridades em coluna única");
      } else if (vp.w <= 767 && m.cards && m.cards.n > 1 && m.cards.cols > 1) {
        /* §10 · "mobile volta a uma coluna". Entre 768 e 1179 o comportamento
           congelado da Camada 5.0 já distribui os cards quando cabe, e a REV B
           não pede o contrário. */
        detail.push(vp.w + ": mobile deveria empilhar os cards executivos");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-DOM3-width.json", observed);
  T("P52-DOM3", "painel de domínios e heat map ocupam a largura útil da seção", !detail.length, detail);
}

async function sup3(browser, errs) {
  const detail = [], observed = {};
  const pg = await pageAt(browser, { w: 1440, h: 900 }, errs, "P52-SUP3");
  try {
    await toResults(pg, FX52.P52_F1);
    await pg.click("#v32cta");
    await pg.evaluate(() => {
      const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
      ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
        const s = document.getElementById("v32-pres-" + c);
        if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
      });
    });
    await pg.click("#v32save");
    await pg.waitForTimeout(400);
    const m = await pg.evaluate(() => {
      const its = Array.from(document.querySelectorAll("#app .v32-cand, #app .v32-svc"));
      const style = e => { const c = getComputedStyle(e); return c.display + "|" + c.gridTemplateColumns; };
      /* MIGRAÇÃO DE MÉTRICA · ERRATA DA AUDITORIA EXTERNA · §6.5.
         Antes: `getBoundingClientRect()`. A §6.5 manda normalizar o peso óptico
         "por caixa aparente, não apenas por width/height nominal", e a
         normalização é `transform: scale()` por asset — que NÃO altera layout
         algum, mas ENTRA no rect. Medir o rect passaria a acusar de "tile de
         tamanho diferente" exatamente a correção pedida.
         A obrigação do gate — todo card usar o MESMO tile — continua asserida,
         agora na caixa de LAYOUT, que é o tile de verdade. A uniformidade da
         tinta, que o rect media por acidente, passou a ser asserida de forma
         direta e em PIXEL pelo gate P52-ICON3 (faixa 84–92% de ocupação). */
      const icon = e => { const i = e.querySelector(".v32-icon, .v32-icon-fb");
        if (!i) return null;
        return i.offsetWidth + "x" + i.offsetHeight; };
      const title = e => { const t = e.querySelector("strong");
        return t ? getComputedStyle(t).fontSize : null; };
      const linkPos = e => { const a = e.querySelector('[data-p52="sup-link"]');
        if (!a) return null;
        const kids = Array.from(e.children);
        return kids.indexOf(a) === kids.length - 1 ? "last" : "middle"; };
      return {
        n: its.length,
        estilos: Array.from(new Set(its.map(style))),
        icones: Array.from(new Set(its.map(icon).filter(Boolean))),
        titulos: Array.from(new Set(its.map(title).filter(Boolean))),
        badges: its.filter(e => e.querySelector(".p52-sup-badge")).length,
        linkPos: Array.from(new Set(its.map(linkPos).filter(Boolean))),
        comLink: its.filter(e => e.querySelector('[data-p52="sup-link"]')).length,
        /* as variantes de apoio da Camada V3.2 são separadas por `.section-title` */
        blocos: Array.from(document.querySelectorAll("#app #v32support > .section-title"))
          .map(h => (h.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean)
      };
    });
    observed.cards = m;
    if (!m.n) detail.push("nenhum card de apoio renderizado com contexto declarado");
    /* §8.2 · um único sistema visual: mesmo grid, mesmo tile, mesma tipografia */
    if (m.estilos.length > 1) detail.push("dois sistemas de layout de card: " + m.estilos.join(" / "));
    if (m.icones.length > 1) detail.push("tiles de ícone com tamanhos diferentes: " + m.icones.join(", "));
    if (m.titulos.length > 1) detail.push("títulos com tipografias diferentes: " + m.titulos.join(", "));
    if (m.badges !== m.n) detail.push((m.n - m.badges) + " cards sem badge de natureza do apoio");
    if (m.linkPos.length > 1) detail.push("link oficial em posições diferentes: " + m.linkPos.join(", "));
    if (!m.comLink) detail.push("nenhum link oficial renderizado na tela");
    if (m.blocos.length < 2) detail.push("as variantes de apoio deixaram de ser distinguidas por função");
  } finally { await pg.close(); }
  evidence("P52-SUP3-cards.json", observed);
  T("P52-SUP3", "apoio nas prioridades e apoio contextual usam o mesmo sistema visual, distinguidos por badge", !detail.length, detail);
}

/* ---- PDF REAL: os gates da §11 são medidos no documento impresso ---- */
const PDF_DIR = path.join(EVID, "pdf");
const PDF_TMP = fs.mkdtempSync(path.join(require("os").tmpdir(), "p52pdf-"));
async function renderPdf(browser, name, fx, opts) {
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await pg.goto(HTML_URL);
    await pg.evaluate(([qids, vec, prios]) => {
      window.__DEV.setArq(0);
      qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
      if (prios) window.__DEV.setPriorities(prios);
      window.__DEV.showResults();
    }, [FX50.P50_QIDS, fx.vec, fx.priorities || null]);
    await pg.waitForTimeout(200);
    if (opts && opts.contexto) {
      await pg.click("#v32cta");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
        ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
          const s = document.getElementById("v32-pres-" + c);
          if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
        });
      });
      await pg.click("#v32save");
      await pg.waitForTimeout(300);
    }
    /* ==================================================================
       ERRATA DA AUDITORIA EXTERNA · a TELA é medida ANTES do print, para que
       a coerência tela × papel seja comparação entre duas leituras reais e
       não entre o papel e uma expectativa digitada no gate. O que conta como
       "publicado na tela" é o que está MATERIALMENTE VISÍVEL: `getComputedStyle`
       decide, nunca a presença no DOM (a superfície legada permanece no DOM
       e é neutralizada por apresentação — R-01/R-02 do parecer).
       ================================================================== */
    const tela = await pg.evaluate(() => {
      const app = document.getElementById("app");
      const visivel = e => {
        for (let n = e; n && n !== document.body; n = n.parentElement) {
          const c = getComputedStyle(n);
          if (c.display === "none" || c.visibility === "hidden") return false;
        }
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      };
      const folhas = raiz => Array.from(raiz.querySelectorAll("*"))
        .filter(n => n.children.length === 0 && (n.textContent || "").trim() && visivel(n))
        .map(n => (n.textContent || "").trim());
      return {
        /* valor publicado por domínio, na ordem canônica das cinco caixas */
        dominios: Array.from(app.querySelectorAll(".dom")).map(d => {
          const t = folhas(d);
          const num = t.filter(x => /^\d\.\d$/.test(x) || /^\d\.\d\s+—/.test(x));
          return { nd: t.some(x => x === "n/d"), numericos: num };
        }),
        /* texto integral materialmente visível da tela de resultados */
        texto: folhas(app).join(" | ")
      };
    });
    await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    /* §4.2 · o modo estruturado de impressão tem de estar ATIVO durante o
       `beforeprint` — é ele que retira a superfície de aplicação do papel. */
    const modo = await pg.evaluate(() => ({
      classes: document.body.className,
      printMode: document.body.classList.contains("v32-print-mode"),
      reportLen: (document.getElementById("v32-print-report") || { innerHTML: "" }).innerHTML.length
    }));
    await pg.emulateMedia({ media: "print" });
    await pg.waitForTimeout(200);
    /* geometria de página medida no MESMO documento que vira PDF */
    const geo = await pg.evaluate(() => {
      const R = document.getElementById("v32-print-report");
      if (!R) return null;
      const top = R.getBoundingClientRect().top + window.scrollY;
      const y = e => e ? Math.round(e.getBoundingClientRect().top + window.scrollY - top) : null;
      const seen = e => { if (!e) return false; const c = getComputedStyle(e);
        if (c.display === "none" || c.visibility === "hidden") return false;
        const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      const icons = Array.from(R.querySelectorAll(".v32-icon, .v32-icon-fb"));
      return {
        alturaTotal: Math.round(R.getBoundingClientRect().height),
        yHowto: y(R.querySelector("#pr-howto")),
        yMaturity: y(R.querySelector("#pr-maturity")),
        yRuler: y(R.querySelector("#pr-stage-ruler")),
        yPrios: y(R.querySelector("#pr-prios")),
        prios: !!R.querySelector("#pr-prios"),
        breakPrios: R.querySelector("#pr-prios")
          ? getComputedStyle(R.querySelector("#pr-prios")).breakBefore : null,
        marcas: Array.from(R.querySelectorAll(".pr-cover-brand, .pr-brand")).map(e => (e.textContent || "").trim()),
        /* nenhum rótulo do emblema da capa pode ser cortado pelo viewBox */
        pentaClip: (function () {
          const sv = R.querySelector('[data-qs-mark="pentagon"]');
          if (!sv) return ["(emblema da capa ausente)"];
          const sr = sv.getBoundingClientRect(), out = [];
          const nos = Array.from(sv.querySelectorAll("circle")).map(c => c.getBoundingClientRect());
          sv.querySelectorAll("g:last-of-type text").forEach(t => {
            const r = t.getBoundingClientRect(), nome = (t.textContent || "").trim();
            if (r.left < sr.left - 0.5 || r.right > sr.right + 0.5 ||
                r.top < sr.top - 0.5 || r.bottom > sr.bottom + 0.5) out.push(nome + " (cortado)");
            else if (nos.some(n => r.left < n.right - 0.5 && r.right > n.left + 0.5 &&
                                   r.top < n.bottom - 0.5 && r.bottom > n.top + 0.5))
              out.push(nome + " (sobre o nó)");
          });
          return out;
        })(),
        bandaW: (function () { const b = R.querySelector(".pr-headmark svg");
          const h = R.querySelector(".pr-head");
          return b && h ? +(b.getBoundingClientRect().width / h.getBoundingClientRect().width).toFixed(3) : null; })(),
        bandaSegs: (function () { const b = R.querySelector(".pr-headmark svg");
          if (!b) return []; return Array.from(b.querySelectorAll("rect, path, g > rect"))
            .map(r => Math.round(r.getBoundingClientRect().width)).filter(x => x > 2); })(),
        rulerW: (function () { const t = R.querySelector(".pr-rl-track"); const r = R.querySelector(".pr-ruler");
          return t && r ? +(t.getBoundingClientRect().width / r.getBoundingClientRect().width).toFixed(3) : null; })(),
        markLeft: (function () { const m = R.querySelector("[data-rl-mark]"); return m ? m.style.left : null; })(),
        markColor: (function () { const m = R.querySelector("[data-rl-mark]");
          return m ? getComputedStyle(m).backgroundColor : null; })(),
        /* tinta REAL da haste: uma borda herdada pinta por cima do fundo e
           devolve o traço preto sem alterar backgroundColor */
        markBorda: (function () { const m = R.querySelector("[data-rl-mark]"); if (!m) return null;
          const c = getComputedStyle(m);
          return { w: c.borderLeftWidth, cor: c.borderLeftColor }; })(),
        here: (function () { const h = R.querySelector("[data-rl-here]");
          if (!h) return null;
          const r = h.getBoundingClientRect();
          /* recorte por ancestral: o rótulo pode existir, ter tamanho e ainda
             assim nunca chegar ao papel se um ancestral o corta */
          let cortado = null;
          for (let a = h.parentElement; a && !cortado; a = a.parentElement) {
            const cs = getComputedStyle(a);
            if (cs.overflow === "visible" && cs.overflowX === "visible" && cs.overflowY === "visible") continue;
            const ar = a.getBoundingClientRect();
            if (r.bottom > ar.bottom + 0.5 || r.top < ar.top - 0.5 ||
                r.right > ar.right + 0.5 || r.left < ar.left - 0.5)
              cortado = a.className || a.tagName;
          }
          /* colisão com os nomes dos estágios impressos dentro das faixas */
          const bate = [];
          R.querySelectorAll(".pr-rl-band .pr-rl-s, .pr-rl-band .pr-rl-n").forEach(e => {
            const b = e.getBoundingClientRect();
            if (r.left < b.right - 0.5 && r.right > b.left + 0.5 &&
                r.top < b.bottom - 0.5 && r.bottom > b.top + 0.5) bate.push((e.textContent || "").trim());
          });
          return { txt: (h.textContent || "").trim(), left: h.style.left, seen: seen(h),
                   cortado: cortado, bate: bate }; })(),
        /* a haste não pode cruzar o texto das faixas */
        markBate: (function () { const m = R.querySelector("[data-rl-mark]"); if (!m) return [];
          const r = m.getBoundingClientRect(), out = [];
          R.querySelectorAll(".pr-rl-band .pr-rl-s, .pr-rl-band .pr-rl-n").forEach(e => {
            const b = e.getBoundingClientRect();
            if (r.left < b.right - 0.5 && r.right > b.left + 0.5 &&
                r.top < b.bottom - 0.5 && r.bottom > b.top + 0.5) out.push((e.textContent || "").trim());
          });
          return out; })(),
        /* ERRATA §4 · os nomes dos estágios vêm do relatório, não de uma
           lista digitada no gate: o oráculo do PDF compara o papel com o que
           o produto diz que imprimiu. */
        jornada: (function () {
          const w = R.querySelector("#pr-journey");
          if (!w) return null;
          const t = w.querySelector("h2");
          const nota = w.querySelector(".jn-note");
          return {
            titulo: t ? (t.textContent || "").trim() : "",
            estagios: Array.from(w.querySelectorAll(".jn-node .jn-name")).map(e => (e.textContent || "").trim()),
            marcas: Array.from(w.querySelectorAll(".jn-node .jn-label")).map(e => (e.textContent || "").trim()),
            nota: nota ? (nota.textContent || "").trim() : ""
          };
        })(),
        /* ERRATA FINAL §4 · o texto do rodapé do relatório é DECORADOR: o
           censo material precisa saber separá-lo do conteúdo. Vem do próprio
           relatório, não de uma string digitada no gate. */
        rodape: (function () { const f = R.querySelector(".pr-foot");
          return f ? (f.textContent || "").trim() : null; })(),
        /* títulos de seção do relatório, para a prova de título órfão */
        titulos: Array.from(R.querySelectorAll(".pr-sec > h2, .pr-sec > h3"))
          .map(e => (e.textContent || "").trim()).filter(Boolean),
        iconTotal: icons.length,
        iconVisiveis: icons.filter(seen).length,
        iconCaixas: icons.map(e => { const b = e.getBoundingClientRect();
          return { alt: e.getAttribute("alt") || (e.textContent || "").trim(),
                   w: Math.round(b.width), h: Math.round(b.height) }; }),
        overall: (function () { const k = R.querySelector(".pr-kpi b"); return k ? (k.textContent || "").trim() : null; })(),
        kpis: Array.from(R.querySelectorAll(".pr-kpi span")).map(e => (e.textContent || "").trim()),
        /* ============ ERRATA DA AUDITORIA EXTERNA · superfícies de publicação
           por domínio ENTREGUES ao renderer do relatório. B-01 nasce aqui: a
           tabela e o radar consumiam `stats` cru, sem a decisão canônica de
           publicabilidade que o KPI global já respeitava. ============ */
        celulasDominio: Array.from(R.querySelectorAll("table.pr-doms td")).map(e => (e.textContent || "").trim()),
        radarRotulos: Array.from(R.querySelectorAll(".pr-radar text")).map(e => (e.textContent || "").trim()),
        /* vértices REALMENTE desenhados: o polígono de dado é o único <polygon>
           com preenchimento; a grade é `fill:none`. */
        radarVertices: (function () {
          const sv = R.querySelector(".pr-radar"); if (!sv) return null;
          const dado = Array.from(sv.querySelectorAll("polygon"))
            .filter(p => (p.getAttribute("fill") || "none") !== "none");
          return dado.reduce((a, p) => a + (p.getAttribute("points") || "").trim().split(/\s+/).filter(Boolean).length, 0);
        })(),
        radarPresente: !!R.querySelector(".pr-radar"),
        /* estrutura obrigatória do relatório em QUALQUER condição de contexto */
        estrutura: {
          capa: !!R.querySelector("#pr-cover"),
          metadados: Array.from(R.querySelectorAll(".pr-cover-meta [data-pr-meta]")).map(e => e.getAttribute("data-pr-meta")),
          legenda: R.querySelectorAll(".pr-cover-meta").length > 0 && !!R.querySelector('[data-qs-mark="pentagon"]'),
          howto: !!R.querySelector("#pr-howto"),
          regua: !!R.querySelector("#pr-stage-ruler"),
          faixas: R.querySelectorAll(".pr-ruler .pr-rl-band").length,
          jornada: !!R.querySelector("#pr-journey"),
          anexo: !!R.querySelector("#pr-annex"),
          rodape: (function () { const f = R.querySelector(".pr-foot"); return f ? (f.textContent || "").trim() : null; })()
        },
        /* a superfície de aplicação não pode existir como documento no papel */
        wrapDisplay: (function () { const w = document.querySelector(".wrap");
          return w ? getComputedStyle(w).display : null; })(),
        /* leitura publicada da régua — a moeda de coerência tela × papel */
        leituraRegua: (function () { const r = R.querySelector("[data-rl-read]");
          return r ? (r.textContent || "").trim() : null; })()
      };
    });
    /* ERRATA §4.5 · o PDF é SEMPRE impresso: as provas de paginação examinam
       o arquivo, não o DOM. Sob `P52_NO_EVIDENCE` ele vai para um diretório
       temporário — o acervo auditado não é tocado, mas o gate continua
       medindo papel de verdade (inclusive durante a campanha de mutação). */
    const dir = NO_EVIDENCE ? PDF_TMP : PDF_DIR;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, name + ".pdf");
    await pg.pdf({ path: file, format: "A4", printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" } });
    const bytes = fs.existsSync(file) ? fs.statSync(file).size : null;
    return { geo, tela: tela, modo: modo, file: file, bytes };
  } finally { await pg.close(); }
}

/* ==========================================================================
   ERRATA UAT ESTREITA · §4 — PROVAS NO PDF REAL, PÁGINA A PÁGINA
   "Existência correta no DOM não é evidência suficiente." Aqui o objeto de
   medida é o ARQUIVO: texto por página, caixa de cada palavra em pontos e
   cobertura de tinta da página rasterizada. Sem poppler não há prova — e a
   ausência é declarada como FALHA, nunca como silêncio.
   ========================================================================== */
const { execFileSync: p52exec } = require("child_process");

function p52Poppler() {
  try { p52exec("pdftotext", ["-v"], { stdio: "pipe" }); p52exec("pdftoppm", ["-v"], { stdio: "pipe" }); }
  catch (e) { return false; }
  return true;
}
/* palavras com caixa, por página, em pontos PDF */
function p52PdfWords(file) {
  const xml = p52exec("pdftotext", ["-bbox-layout", file, "-"], { maxBuffer: 64 * 1024 * 1024 }).toString();
  const paginas = [];
  const blocos = xml.split(/<page\b/).slice(1);
  for (const b of blocos) {
    const dim = /width="([\d.]+)"\s+height="([\d.]+)"/.exec(b);
    const words = [];
    const re = /<word xMin="([\d.-]+)" yMin="([\d.-]+)" xMax="([\d.-]+)" yMax="([\d.-]+)">([\s\S]*?)<\/word>/g;
    let m;
    while ((m = re.exec(b))) {
      words.push({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4],
        t: m[5].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
    }
    paginas.push({ w: dim ? +dim[1] : 0, h: dim ? +dim[2] : 0, words: words,
      texto: words.map(w => w.t).join(" ") });
  }
  return paginas;
}
/* cobertura de tinta da página, medida no PGM rasterizado (sem dependência
   de biblioteca de imagem: P5 é cabeçalho ASCII + bytes) */
function p52PdfInk(file, pagina) {
  const dir = fs.mkdtempSync(path.join(require("os").tmpdir(), "p52ink-"));
  try {
    p52exec("pdftoppm", ["-gray", "-r", "30", "-f", String(pagina), "-l", String(pagina), file, path.join(dir, "g")]);
    const arq = fs.readdirSync(dir)[0];
    const buf = fs.readFileSync(path.join(dir, arq));
    let i = 0, campos = [], acc = "";
    while (campos.length < 4 && i < buf.length) {
      const c = String.fromCharCode(buf[i++]);
      if (/\s/.test(c)) { if (acc) { campos.push(acc); acc = ""; } } else acc += c;
    }
    const dados = buf.slice(i);
    let tinta = 0;
    for (let k = 0; k < dados.length; k++) if (dados[k] < 235) tinta++;
    return +(100 * tinta / dados.length).toFixed(2);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
const p52Sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const p52Norm = t => String(t).toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
/* PRESENÇA: comparação compacta (sem espaços). `letter-spacing` faz o
   extrator quebrar palavras — "PARA AVANÇAR" sai como "PA R A AVA N Ç A R" —
   e maiúsculas de CSS não existem no DOM. Compactar e normalizar remove os
   dois artefatos sem afrouxar a prova: o texto continua tendo de estar ali. */
function p52Compacta(pagina) {
  if (pagina.__c === undefined) pagina.__c = p52Norm(pagina.words.map(w => w.t).join("")).replace(/\s+/g, "");
  return pagina.__c;
}
function p52TemFrase(pagina, frase) {
  const alvo = p52Norm(frase).replace(/\s+/g, "");
  return !!alvo && p52Compacta(pagina).indexOf(alvo) >= 0;
}
/* OCORRÊNCIA COM CAIXA: sequência de palavras na ORDEM DE LEITURA do PDF.
   Serve para achar um título exato — "Contexto tecnológico declarado" não
   casa com "Contexto tecnológico não informado" — e para medir onde ele
   está na página. Aceita quebra de linha, que preserva a ordem. */
function p52Sequencia(pagina, frase) {
  const alvo = p52Norm(frase).split(/\s+/).filter(Boolean);
  const out = [];
  if (!alvo.length) return out;
  const W = pagina.words;
  for (let i = 0; i + alvo.length <= W.length; i++) {
    let ok = true;
    for (let k = 0; k < alvo.length; k++) if (p52Norm(W[i + k].t) !== alvo[k]) { ok = false; break; }
    if (!ok) continue;
    const seg = W.slice(i, i + alvo.length);
    out.push({ i0: i, i1: i + alvo.length - 1,
      x0: Math.min.apply(null, seg.map(w => w.x0)), x1: Math.max.apply(null, seg.map(w => w.x1)),
      y0: Math.min.apply(null, seg.map(w => w.y0)), y1: Math.max.apply(null, seg.map(w => w.y1)) });
  }
  return out;
}

/* Um TÍTULO ocupa a própria linha. Sem esta condição, a frase "O contexto
   tecnológico declarado foi considerado…" dentro da leitura executiva seria
   confundida com o título "Contexto tecnológico declarado" — falso positivo
   observado na primeira execução deste gate. */
function p52Titulos(pagina, frase) {
  return p52Sequencia(pagina, frase).filter(o => {
    const meus = pagina.words.slice(o.i0, o.i1 + 1);
    /* cada linha ocupada pela ocorrência tem de conter SOMENTE palavras dela:
       basta uma palavra estranha na linha para aquilo ser prosa, não título.
       Vale também para título que quebra em duas linhas. */
    const linhas = [];
    meus.forEach(w => {
      const l = linhas.find(x => Math.abs(x.y - w.y0) <= 3);
      if (l) l.n++; else linhas.push({ y: w.y0, n: 1 });
    });
    return linhas.every(l => pagina.words.filter(w => Math.abs(w.y0 - l.y) <= 3).length === l.n);
  });
}

/* ============================== P52-PDF4 ============================== */
function pdf4(arquivos, observed) {
  const detail = [];
  if (!p52Poppler()) {
    T("P52-PDF4", "jornada de maturidade atômica e horizontal no PDF real", false,
      ["poppler-utils (pdftotext/pdftoppm) ausente: a prova de papel NÃO foi executada"]);
    return;
  }
  const reg = {};
  for (const a of arquivos) {
    const jn = a.geo && a.geo.jornada;
    if (!jn) { detail.push(a.name + ": relatório sem seção de jornada"); continue; }
    const paginas = p52PdfWords(a.file);
    const achados = paginas.map((p, k) => ({ k: k, occ: p52Titulos(p, jn.titulo) })).filter(x => x.occ.length);
    if (!achados.length) { detail.push(a.name + ": título '" + jn.titulo + "' não aparece em nenhuma página"); continue; }
    if (achados.length > 1)
      detail.push(a.name + ": título da jornada repetido nas páginas " + achados.map(x => x.k + 1).join(","));
    const idx = achados[0].k, pag = paginas[idx], tituloCx = achados[0].occ[0];

    /* 1 · os SEIS estágios na MESMA página do título */
    const fora = jn.estagios.filter(nome => !p52TemFrase(pag, nome));
    if (fora.length)
      detail.push(a.name + ": estágio(s) fora da página do título (p" + (idx + 1) + "): " + fora.join(", "));
    /* 2 · marcador de perfil, próximo estágio e texto explicativo juntos */
    (jn.marcas || []).forEach(mk => {
      if (!p52TemFrase(pag, mk)) detail.push(a.name + ": marcador '" + mk + "' fora da página da jornada");
    });
    if (jn.nota && !p52TemFrase(pag, jn.nota.split(/\s+/).slice(0, 8).join(" ")))
      detail.push(a.name + ": texto explicativo da jornada fora da sua página");

    /* 3 · COMPOSIÇÃO HORIZONTAL, medida na página: as caixas dos nomes dos
           estágios têm de formar UMA fileira. Empilhado — o defeito relatado
           pelo proprietário — a fileira não existe e a faixa vertical estoura.
           Os nomes podem repetir na página (a leitura executiva também os
           cita), então agrupam-se as caixas por linha e escolhe-se a fileira
           que reúne MAIS estágios distintos. */
    const caixas = [];
    jn.estagios.forEach((nome, ordem) => {
      p52Sequencia(pag, nome).forEach(o => caixas.push({ ordem: ordem, nome: nome, o: o }));
    });
    let fileira = [];
    caixas.forEach(c => {
      const grupo = caixas.filter(o => Math.abs(o.o.y0 - c.o.y0) <= 26);
      const distintos = grupo.map(g => g.ordem).filter((v, i, arr) => arr.indexOf(v) === i);
      if (distintos.length > fileira.length) fileira = grupo.filter((g, i, arr) =>
        arr.findIndex(x => x.ordem === g.ordem) === i);
    });
    const distintosNaFileira = fileira.map(f => f.ordem).filter((v, i, arr) => arr.indexOf(v) === i).length;
    if (distintosNaFileira < jn.estagios.length) {
      detail.push(a.name + ": apenas " + distintosNaFileira + " de " + jn.estagios.length +
        " estágios numa mesma fileira — jornada empilhada ou partida");
    } else {
      const faixaY = Math.max.apply(null, fileira.map(f => f.o.y1)) - Math.min.apply(null, fileira.map(f => f.o.y0));
      const faixaX = Math.max.apply(null, fileira.map(f => f.o.x1)) - Math.min.apply(null, fileira.map(f => f.o.x0));
      if (faixaY > 40)
        detail.push(a.name + ": estágios com " + faixaY.toFixed(0) + "pt de altura entre si (teto 40pt)");
      if (faixaX < 300)
        detail.push(a.name + ": estágios sem distribuição horizontal — " + faixaX.toFixed(0) + "pt de largura (piso 300pt)");
      if (tituloCx.y1 > Math.min.apply(null, fileira.map(f => f.o.y0)))
        detail.push(a.name + ": título da jornada abaixo dos estágios");
      /* 4 · o bloco inteiro cabe na página: nada dele encosta na borda útil */
      const fim = Math.max.apply(null, fileira.map(f => f.o.y1));
      if (fim > pag.h - 30)
        detail.push(a.name + ": fileira de estágios encostando na margem inferior (" + fim.toFixed(0) + "pt)");
      reg[a.name] = { pagina: idx + 1, de: paginas.length,
        faixaY: +faixaY.toFixed(1), faixaX: +faixaX.toFixed(1),
        estagios: fileira.sort((x, y) => x.ordem - y.ordem).map(f => f.nome) };
    }
  }
  observed.jornada = reg;
  T("P52-PDF4", "jornada de maturidade atômica e horizontal no PDF real: título, seis estágios, marcadores e nota na mesma página", !detail.length, detail);
}

/* ============================== P52-PDF5 ============================== */
function pdf5(arquivos, observed) {
  const detail = [];
  if (!p52Poppler()) {
    T("P52-PDF5", "paginação sadia no PDF real", false,
      ["poppler-utils (pdftotext/pdftoppm) ausente: a prova de papel NÃO foi executada"]);
    return;
  }
  const censo = {};
  for (const a of arquivos) {
    const paginas = p52PdfWords(a.file);
    const linhas = [];
    paginas.forEach((p, k) => {
      const n = k + 1;
      const tinta = p52PdfInk(a.file, n);
      const chars = p.texto.length;
      linhas.push({ pagina: n, tinta: tinta, chars: chars,
        inicio: p.texto.slice(0, 60), fim: p.texto.slice(-60) });
      /* 1 · nada fora da área imprimível (A4 com margens de 12mm = 34pt) */
      const forA = p.words.filter(w => w.x0 < 30 || w.x1 > p.w - 30 || w.y0 < 30 || w.y1 > p.h - 30);
      if (forA.length)
        detail.push(a.name + " p" + n + ": " + forA.length + " palavra(s) fora da área imprimível (ex.: '" + forA[0].t + "')");
      /* 2 · nenhuma página intermediária quase vazia */
      if (n < paginas.length && tinta < 3 && chars < 200)
        detail.push(a.name + " p" + n + ": página intermediária quase vazia (tinta " + tinta + "%, " + chars + " caracteres)");
      /* 3 · nenhum título de seção sem conteúdo abaixo dele na mesma página */
      (a.geo && a.geo.titulos ? a.geo.titulos : []).forEach(tit => {
        p52Titulos(p, tit).forEach(occ => {
          const abaixo = p.words.filter(w => w.y0 > occ.y1 + 1);
          if (!abaixo.length)
            detail.push(a.name + " p" + n + ": título '" + tit + "' isolado no rodapé da página");
        });
      });
    });
    censo[a.name] = { sha256: p52Sha(a.file), bytes: fs.statSync(a.file).size,
      paginas: paginas.length, detalhe: linhas };
  }
  observed.censo = censo;
  T("P52-PDF5", "paginação sadia no PDF real: sem título órfão, sem página intermediária vazia e nada fora da área imprimível", !detail.length, detail);
}

/* ==========================================================================
   ERRATA FINAL DE UAT · §4 — CENSO MATERIAL DE TODAS AS PÁGINAS
   Uma página só existe se tiver CONTEÚDO MATERIAL do relatório. Rodapé,
   cabeçalho, número de página, URL e régua decorativa não fazem página.
   O limiar não é contagem bruta de tinta — linha, rodapé e URL também pintam:
   a tinta é medida SOMENTE na região acima da faixa de decoração, e o texto
   é contado depois de remover as palavras do decorador.
   ========================================================================== */
function p52InkRegiao(file, pagina, y0pt, y1pt, alturaPt) {
  const dir = fs.mkdtempSync(path.join(require("os").tmpdir(), "p52ink-"));
  try {
    p52exec("pdftoppm", ["-gray", "-r", "30", "-f", String(pagina), "-l", String(pagina), file, path.join(dir, "g")]);
    const arq = fs.readdirSync(dir)[0];
    const buf = fs.readFileSync(path.join(dir, arq));
    let i = 0, campos = [], acc = "";
    while (campos.length < 4 && i < buf.length) {
      const c = String.fromCharCode(buf[i++]);
      if (/\s/.test(c)) { if (acc) { campos.push(acc); acc = ""; } } else acc += c;
    }
    const W = +campos[1], H = +campos[2], dados = buf.slice(i);
    const lin0 = Math.max(0, Math.floor(H * (y0pt / alturaPt)));
    const lin1 = Math.min(H, Math.ceil(H * (y1pt / alturaPt)));
    let tinta = 0, total = 0;
    for (let y = lin0; y < lin1; y++) {
      for (let x = 0; x < W; x++) { total++; if (dados[y * W + x] < 235) tinta++; }
    }
    return total ? +(100 * tinta / total).toFixed(2) : 0;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

/* ============================== P52-PDF6 ============================== */
function pdf6(arquivos, observed) {
  const detail = [];
  if (!p52Poppler()) {
    T("P52-PDF6", "toda página do PDF real tem conteúdo material — nenhuma página residual, inclusive a última", false,
      ["poppler-utils (pdftotext/pdftoppm) ausente: a prova de papel NÃO foi executada"]);
    return;
  }
  const CHARS_MIN = 120;     /* abaixo disto, a página precisa de tinta material própria */
  const INK_MIN = 1.5;       /* tinta medida SOMENTE fora da faixa de decoração */
  const censo = {};
  for (const a of arquivos) {
    const decorador = a.geo && a.geo.rodape;
    const titulos = (a.geo && a.geo.titulos) ? a.geo.titulos : [];
    const paginas = p52PdfWords(a.file);
    const linhas = [];
    paginas.forEach((p, k) => {
      const n = k + 1;
      /* 1 · separar decoradores do conteúdo material */
      const decor = [];
      if (decorador) p52Sequencia(p, decorador).forEach(o => { for (let i = o.i0; i <= o.i1; i++) decor.push(i); });
      const material = p.words.filter((w, i) => decor.indexOf(i) < 0);
      const textoMaterial = material.map(w => w.t).join(" ");
      const chars = textoMaterial.length;
      const caixa = material.length ? {
        x0: +Math.min.apply(null, material.map(w => w.x0)).toFixed(1),
        y0: +Math.min.apply(null, material.map(w => w.y0)).toFixed(1),
        x1: +Math.max.apply(null, material.map(w => w.x1)).toFixed(1),
        y1: +Math.max.apply(null, material.map(w => w.y1)).toFixed(1)
      } : null;
      /* 2 · tinta MATERIAL: da margem superior até o topo da faixa decorada */
      const topoDecor = decor.length
        ? Math.min.apply(null, decor.map(i => p.words[i].y0)) - 4
        : p.h - 30;
      const tintaMaterial = p52InkRegiao(a.file, n, 26, Math.max(30, topoDecor), p.h);
      /* 3 · a página é só um título de seção sem o primeiro conteúdo? */
      let soTitulo = null;
      titulos.forEach(t => {
        const occ = p52Titulos(p, t);
        if (!occ.length) return;
        const abaixo = material.filter(w => w.y0 > occ[occ.length - 1].y1 + 1);
        if (!abaixo.length) soTitulo = t;
      });
      /* 4 · classificação */
      let classe = "material", motivo = "conteúdo material presente";
      if (!material.length) { classe = "residual"; motivo = "página sem qualquer conteúdo material"; }
      else if (decor.length && chars === 0) { classe = "residual"; motivo = "página somente com decorador"; }
      else if (chars < CHARS_MIN && tintaMaterial < INK_MIN) {
        classe = "residual";
        motivo = "conteúdo material abaixo do limiar (" + chars + " caracteres, " + tintaMaterial + "% de tinta material)";
      } else if (soTitulo) {
        classe = "residual";
        motivo = "somente o título '" + soTitulo + "' sem o primeiro conteúdo";
      }
      linhas.push({ pagina: n, classe: classe, motivo: motivo,
        charsMateriais: chars, tintaMaterial: tintaMaterial,
        caixaMaterial: caixa, decoradores: decor.length,
        primeiroMaterial: textoMaterial.slice(0, 60), ultimoMaterial: textoMaterial.slice(-60) });
      if (classe === "residual") {
        const onde = (n === paginas.length) ? "página FINAL residual" : "página intermediária residual";
        detail.push(a.name + " p" + n + " de " + paginas.length + ": " + onde + " — " + motivo +
          " [" + chars + " caracteres materiais, " + tintaMaterial + "% de tinta material]");
      }
    });
    censo[a.name] = { sha256: p52Sha(a.file), bytes: fs.statSync(a.file).size,
      paginas: paginas.length, ultima: linhas[linhas.length - 1], detalhe: linhas };
  }
  observed.censoMaterial = censo;
  T("P52-PDF6", "toda página do PDF real tem conteúdo material — nenhuma página residual, inclusive a última", !detail.length, detail);
}

/* ==========================================================================
   ERRATA DA AUDITORIA EXTERNA · MATRIZ COMPLETA DE CENÁRIOS DE PDF

   A campanha anterior media SEMPRE com contexto tecnológico declarado, e o
   comentário do próprio caso bloqueado registrava o motivo: "sem isso o
   produto entra em modo legado e nem chega a montar o relatório V3.2". Esse
   era exatamente o ponto cego. O contexto tecnológico é OPCIONAL e
   documentado como opcional — logo a metade não coberta da matriz era a
   metade MAIS PROVÁVEL em uso real.

   A matriz obrigatória é {suficiência aberta, fechada} × {contexto informado,
   não informado}, mais fronteira de estágio e ausência de prioridades:

     1 · aberta   + contexto    + prioridades   → relatório estruturado
     2 · aberta   + sem contexto + prioridades  → relatório estruturado, contexto "não informado"
     3 · fechada  + contexto                    → estruturado; score global e domínios NÃO publicados
     4 · fechada  + sem contexto                → estruturado; score global e domínios NÃO publicados
     5 · fronteira de estágio                   → número e faixa nunca divergem
     6 · sem prioridades                        → nenhum bloco de prioridade fabricado
   ========================================================================== */
const PDF_CASOS = [
  { name: "P52-pdf-suficiente-3prioridades", fx: { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities.concat(["logs"]) }, contexto: true, prios: 3 },
  { name: "P52-pdf-suficiente-sem-prioridade", fx: { vec: FX52.P52_F1.vec }, contexto: true, prios: 0 },
  { name: "P52-pdf-fronteira", fx: { vec: new Array(15).fill(1), priorities: ["mandate"] }, contexto: true, prios: 1 },
  { name: "P52-pdf-bloqueado", fx: { vec: FX52.P52_F3.vec }, contexto: true, prios: 0, bloqueado: true },
  /* --- quadrantes SEM contexto tecnológico: o caminho não coberto até aqui --- */
  { name: "P52-pdf-suficiente-3prioridades-sem-contexto", fx: { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities.concat(["logs"]) }, contexto: false, prios: 3 },
  { name: "P52-pdf-bloqueado-sem-contexto", fx: { vec: FX52.P52_F3.vec }, contexto: false, prios: 0, bloqueado: true }
];

/* ==========================================================================
   ERRATA DA AUDITORIA EXTERNA · GATES DE PUBLICABILIDADE E DE ESTRUTURA

   Três provas novas, todas medidas no PAPEL REAL e cruzadas com a TELA REAL:

   P52-PDF7 (B-01) · nenhum score por domínio é publicado com o gate canônico
     de suficiência fechado — nem em célula de tabela, nem em rótulo de radar,
     nem em vértice desenhado. O que pode ser publicado vem de um ORÁCULO
     INDEPENDENTE (`p52PublishOracle`), recalculado do vetor.
   P52-PDF8 (B-02/B-03) · nas DUAS condições de contexto o documento é o
     relatório estruturado: `v32-print-mode` ativo no `beforeprint`, capa,
     metadados, legenda, régua e anexo presentes, e a superfície de aplicação
     (`.wrap`) fora do papel.
   P52-PDF9 · coerência tela × papel: o valor publicado por domínio e o
     agregado publicado são os MESMOS nos dois meios, nos quatro quadrantes.

   NÃO-VACUIDADE: cada prova negativa vem acompanhada de um CONTROLE POSITIVO
   no mesmo lote — se o mesmo sensor não encontra o valor onde ele DEVE
   aparecer (gate aberto), o gate falha por sensor cego, não passa em silêncio.
   ========================================================================== */
const DOM_PT = FX50.P50_DOM_PT;
/* "Negócio 5.0" impresso em qualquer lugar do papel é publicação de score de
   domínio, venha da tabela, do radar ou de texto derivado. */
function p52DominioNumeradoNoPapel(paginas) {
  const achados = [];
  paginas.forEach((pag, k) => {
    DOM_PT.forEach(nome => {
      const alvo = p52Norm(nome).split(/\s+/).filter(Boolean);
      const W = pag.words;
      for (let i = 0; i + alvo.length < W.length; i++) {
        let ok = true;
        for (let j = 0; j < alvo.length; j++) if (p52Norm(W[i + j].t) !== alvo[j]) { ok = false; break; }
        if (!ok) continue;
        const seguinte = (W[i + alvo.length].t || "").trim();
        if (/^\d[.,]\d$/.test(seguinte)) achados.push({ pagina: k + 1, texto: nome + " " + seguinte });
      }
    });
  });
  return achados;
}

async function pdfGates(browser, errs) {
  const d1 = [], d2 = [], d3 = [], d7 = [], d8 = [], d9 = [], observed = {};
  const arquivos = [];
  const oraculos = {};
  for (const caso of PDF_CASOS) {
    let r;
    try { r = await renderPdf(browser, caso.name, caso.fx, { contexto: caso.contexto }); }
    catch (e) { d1.push(caso.name + ": falhou ao gerar o PDF — " + String(e.message).split("\n")[0]); continue; }
    const g = r.geo;
    const O = FX52.p52PublishOracle(caso.fx.vec);
    oraculos[caso.name] = O;
    observed[caso.name] = { bytes: r.bytes, geo: g, tela: r.tela, modo: r.modo, oraculo: O };
    if (r.file && g) arquivos.push({ name: caso.name, file: r.file, geo: g, tela: r.tela, modo: r.modo, oraculo: O, caso: caso });

    /* ------- P52-PDF8 · o documento é SEMPRE o relatório estruturado ------- */
    if (O.suff !== !caso.bloqueado)
      d8.push(caso.name + ": o oráculo independente diz suff=" + O.suff + " e o caso declara bloqueado=" + !!caso.bloqueado);
    if (!r.modo || !r.modo.printMode)
      d8.push(caso.name + ": `v32-print-mode` ausente durante o beforeprint (classes: '" +
        ((r.modo && r.modo.classes) || "") + "') — a superfície de tela vira o documento");
    if (!r.modo || !(r.modo.reportLen > 2000))
      d8.push(caso.name + ": relatório não montado no beforeprint (" + ((r.modo && r.modo.reportLen) || 0) + " caracteres)");
    if (g && g.wrapDisplay !== "none")
      d8.push(caso.name + ": `.wrap` com display='" + g.wrapDisplay + "' sob mídia de impressão — a aplicação chega ao papel");
    const E = g && g.estrutura;
    if (!E) d8.push(caso.name + ": nenhuma estrutura de relatório medida");
    else {
      const META = ["session", "sessionDate", "generatedAt", "tool", "coverage"];
      if (!E.capa) d8.push(caso.name + ": sem capa");
      const faltamMeta = META.filter(m => E.metadados.indexOf(m) < 0);
      if (faltamMeta.length) d8.push(caso.name + ": metadados ausentes: " + faltamMeta.join(", "));
      if (!E.legenda) d8.push(caso.name + ": legenda dos cinco domínios ausente da capa");
      if (!E.howto) d8.push(caso.name + ": 'Como interpretar' ausente");
      if (!E.regua) d8.push(caso.name + ": régua 0–5 ausente");
      else if (E.faixas !== 6) d8.push(caso.name + ": régua com " + E.faixas + " faixas (esperadas 6)");
      if (!E.jornada) d8.push(caso.name + ": jornada de maturidade ausente do relatório");
      if (!E.anexo) d8.push(caso.name + ": anexo de respostas ausente");
      if (!E.rodape) d8.push(caso.name + ": rodapé do relatório ausente");
      else if (!caso.contexto && !/não informado/i.test(E.rodape))
        d8.push(caso.name + ": sem contexto declarado, o rodapé não diz 'não informado' ('" + E.rodape + "')");
    }

    /* ------- P52-PDF7 · publicabilidade por domínio na ORIGEM (B-01) ------- */
    if (g) {
      const esperadas = O.publicaveis.map(v => v === null ? "n/d" : v.toFixed(1));
      if (g.celulasDominio.length !== 5)
        d7.push(caso.name + ": tabela de domínios com " + g.celulasDominio.length + " células (esperadas 5)");
      else if (g.celulasDominio.join("|") !== esperadas.join("|"))
        d7.push(caso.name + ": tabela publica [" + g.celulasDominio.join(", ") +
          "] e o oráculo autoriza [" + esperadas.join(", ") + "]");
      if (!O.suff) {
        const numericas = g.celulasDominio.filter(c => /^\d[.,]\d$/.test(c));
        if (numericas.length)
          d7.push(caso.name + ": " + numericas.length + " célula(s) de domínio publicadas com o gate FECHADO: " + numericas.join(", "));
        const radarNum = g.radarRotulos.filter(t => /\d[.,]\d\s*$/.test(t));
        if (radarNum.length)
          d7.push(caso.name + ": radar rotulado com score sob gate fechado: " + radarNum.join(" · "));
        if (g.radarVertices)
          d7.push(caso.name + ": radar com " + g.radarVertices + " vértice(s) de dado sob gate fechado");
        if (g.radarPresente && g.radarRotulos.length)
          d7.push(caso.name + ": radar publicado sob gate fechado (" + g.radarRotulos.length + " rótulos)");
      } else {
        /* CONTROLE POSITIVO: com o gate aberto o mesmo sensor TEM de enxergar
           os cinco valores. Sensor cego reprova aqui, não passa em silêncio. */
        if (g.radarVertices === null || g.radarVertices < 3)
          d7.push(caso.name + ": controle positivo falhou — radar sem polígono de dado com o gate ABERTO");
        if (!g.celulasDominio.some(c => /^\d[.,]\d$/.test(c)))
          d7.push(caso.name + ": controle positivo falhou — nenhuma célula numérica com o gate ABERTO");
      }
    }

    /* ------- P52-PDF9 · coerência TELA × PAPEL ------- */
    if (r.tela && g) {
      if (r.tela.dominios.length !== 5)
        d9.push(caso.name + ": tela com " + r.tela.dominios.length + " caixas de domínio (esperadas 5)");
      r.tela.dominios.forEach((d, i) => {
        const autorizado = O.publicaveis[i];
        if (autorizado === null) {
          if (d.numericos.length)
            d9.push(caso.name + ": tela publica score no domínio " + DOM_PT[i] + " sob gate fechado (" + d.numericos.join(", ") + ")");
          if (!d.nd) d9.push(caso.name + ": tela não marca 'n/d' no domínio " + DOM_PT[i] + " sob gate fechado");
        }
      });
      /* a mesma decisão dos dois lados: papel e tela concordam célula a célula */
      const papel = g.celulasDominio;
      r.tela.dominios.forEach((d, i) => {
        const noPapel = papel[i];
        if (noPapel === undefined) return;
        const telaTemNum = d.numericos.length > 0;
        const papelTemNum = /^\d[.,]\d$/.test(noPapel);
        if (telaTemNum !== papelTemNum)
          d9.push(caso.name + ": domínio " + DOM_PT[i] + " — tela " +
            (telaTemNum ? "publica" : "não publica") + " e papel " + (papelTemNum ? "publica" : "não publica"));
      });
      /* agregado publicado: o KPI do relatório contra o oráculo */
      const kpi = g.overall;
      const esperado = O.overall === null ? "n/d" : O.overall.toFixed(1) + " / 5";
      if (kpi !== esperado)
        d9.push(caso.name + ": KPI global '" + kpi + "' contra o oráculo '" + esperado + "'");
    }

    if (!g) { d1.push(caso.name + ": relatório V3.2 não montou"); continue; }
    if (!(r.bytes > 20000)) d1.push(caso.name + ": PDF vazio ou truncado (" + r.bytes + " bytes)");

    /* §11.1 · a primeira página orienta, resume e mostra a régua; as
       prioridades só começam depois dela. A4 útil com margens de 12mm a 96dpi
       CSS: ~1000px de altura de página. */
    const PAGINA = 1000;
    if (g.yHowto === null) d1.push(caso.name + ": 'Como interpretar' ausente");
    else if (g.yHowto > PAGINA) d1.push(caso.name + ": 'Como interpretar' fora da página 1 (y=" + g.yHowto + ")");
    if (g.yMaturity === null) d1.push(caso.name + ": resumo de maturidade ausente");
    else {
      if (g.yMaturity > PAGINA) d1.push(caso.name + ": resumo fora da página 1 (y=" + g.yMaturity + ")");
      if (g.yHowto !== null && g.yHowto > g.yMaturity)
        d1.push(caso.name + ": a orientação vem depois dos números");
    }
    if (!caso.bloqueado && g.yRuler === null) d1.push(caso.name + ": régua ausente do resumo");
    if (g.prios && g.breakPrios !== "page")
      d1.push(caso.name + ": prioridades sem quebra de página (break-before=" + g.breakPrios + ")");
    if (caso.prios === 0 && g.prios) d1.push(caso.name + ": bloco de prioridades criado sem prioridade declarada");
    if (caso.prios > 0 && !g.prios) d1.push(caso.name + ": prioridades declaradas não foram impressas");

    /* §11.2 · uma única abertura de marca */
    if (g.pentaClip && g.pentaClip.length)
      d2.push(caso.name + ": rótulo(s) do emblema da capa ilegível(is): " + g.pentaClip.join(", "));
    if (g.marcas.length !== 1)
      d2.push(caso.name + ": " + g.marcas.length + " ocorrências de marca no topo (" + g.marcas.join(" | ") + ")");
    /* §11.3 · faixa dos domínios distribuída */
    if (g.bandaW === null) d2.push(caso.name + ": faixa dos domínios ausente");
    else if (g.bandaW < 0.9) d2.push(caso.name + ": faixa ocupa " + (g.bandaW * 100).toFixed(0) + "% da largura útil");
    /* §11.5 · régua de ponta a ponta, marcador de marca, "Você está aqui" */
    if (!caso.bloqueado) {
      if (g.rulerW === null || g.rulerW < 0.95)
        d2.push(caso.name + ": régua não ocupa a largura útil");
      if (!g.here) d2.push(caso.name + ": marcador 'Você está aqui' ausente");
      else {
        if (!/Você está aqui/.test(g.here.txt)) d2.push(caso.name + ": rótulo do marcador: '" + g.here.txt + "'");
        if (g.here.left !== g.markLeft) d2.push(caso.name + ": rótulo e marcador em posições diferentes");
        if (!g.here.seen) d2.push(caso.name + ": rótulo do marcador não é visível");
        if (g.here.cortado)
          d2.push(caso.name + ": rótulo do marcador recortado por ancestral (" + g.here.cortado + ")");
        if (g.here.bate.length)
          d2.push(caso.name + ": rótulo do marcador sobre o texto da régua (" + g.here.bate.join(", ") + ")");
      }
      if (g.markColor !== "rgb(218, 41, 28)")
        d2.push(caso.name + ": marcador em " + g.markColor + " (esperado o vermelho de marca)");
      if (g.markBorda && g.markBorda.w !== "0px" && g.markBorda.cor !== "rgb(218, 41, 28)")
        d2.push(caso.name + ": haste do marcador com borda " + g.markBorda.w + " " + g.markBorda.cor +
          " pintando sobre a cor de marca");
      if (g.markBate && g.markBate.length)
        d2.push(caso.name + ": haste do marcador sobre o texto da régua (" + g.markBate.join(", ") + ")");
      /* posição derivada do score já arredondado para exibição */
      const esperado = g.overall && /^\d/.test(g.overall)
        ? +(parseFloat(g.overall) / 5 * 100).toFixed(2) : null;
      const obtido = g.markLeft ? parseFloat(g.markLeft) : null;
      if (esperado !== null && (obtido === null || Math.abs(obtido - esperado) > 0.02))
        d2.push(caso.name + ": marcador em " + g.markLeft + " para score " + g.overall +
          " (esperado " + esperado + "%)");
    } else {
      if (g.here) d2.push(caso.name + ": bloqueado não pode ter marcador de posição");
      if (g.markLeft) d2.push(caso.name + ": bloqueado desenhou marcador (n/d nunca é zero)");
    }
    /* §11.4 · o KPI "Suficiência da sessão: adequada" sai do relatório do
       cliente. O rótulo que DECLARA o bloqueio quando a evidência é
       insuficiente permanece obrigatório (§9): ele é honestidade, não KPI. */
    if (g.kpis.some(k => /Sufici[êe]ncia da sess[ãa]o/i.test(k)))
      d2.push(caso.name + ": KPI 'Suficiência da sessão' voltou ao resumo");
    if (caso.bloqueado && !g.kpis.some(k => /sufici[êe]ncia de dados não atingida/i.test(k)))
      d2.push(caso.name + ": o relatório não declara o bloqueio no lugar do estágio");
    if (!caso.bloqueado && g.kpis.some(k => /não atingida/i.test(k)))
      d2.push(caso.name + ": relatório liberado declarando bloqueio");

    /* §11.7 · ícones materialmente visíveis */
    if (caso.contexto) {
      if (!g.iconTotal) d3.push(caso.name + ": nenhum ícone no relatório");
      if (g.iconVisiveis !== g.iconTotal)
        d3.push(caso.name + ": " + (g.iconTotal - g.iconVisiveis) + " ícone(s) invisível(is) no papel");
      const pequenos = g.iconCaixas.filter(c => c.w < 24 || c.h < 24);
      if (pequenos.length) d3.push(caso.name + ": " + pequenos.length + " ícone(s) com caixa menor que 24px");
      const quadrados = g.iconCaixas.filter(c => Math.abs(c.w - c.h) > 2);
      if (quadrados.length) d3.push(caso.name + ": ícone com aspecto distorcido");
      const ACEITE = ["FortiSOAR", "FortiSIEM", "FortiRecon", "FortiEndpoint"];
      const nomes = g.iconCaixas.map(c => String(c.alt));
      const faltando = ACEITE.filter(a => !nomes.some(n => n.indexOf(a) >= 0));
      if (caso.name === "P52-pdf-suficiente-3prioridades" && faltando.length)
        observed.aceiteIcones = { faltando: faltando, presentes: nomes };
    }
  }
  /* ---- prova no PAPEL: nenhum "<domínio> <número>" sob gate fechado ---- */
  if (p52Poppler()) {
    const censo = {};
    for (const a of arquivos) {
      const paginas = p52PdfWords(a.file);
      const achados = p52DominioNumeradoNoPapel(paginas);
      censo[a.name] = { suff: a.oraculo.suff, paginas: paginas.length, achados: achados };
      /* NÃO-VACUIDADE do sensor: os nomes dos domínios têm de estar no papel */
      const nomesAusentes = DOM_PT.filter(n => !paginas.some(p => p52TemFrase(p, n)));
      if (nomesAusentes.length)
        d7.push(a.name + ": sensor cego — nomes de domínio ausentes do papel: " + nomesAusentes.join(", "));
      if (!a.oraculo.suff && achados.length)
        d7.push(a.name + ": papel publica score por domínio com o gate FECHADO: " +
          achados.map(x => "p" + x.pagina + " '" + x.texto + "'").join(" · "));
      if (a.oraculo.suff && !achados.length)
        d7.push(a.name + ": controle positivo falhou — nenhum '<domínio> <score>' no papel com o gate ABERTO");
      /* B-03 · nenhuma faixa de estágio numérica pode ressurgir no papel */
      const faixas = [];
      paginas.forEach((pag, k) => {
        const t = pag.words.map(w => w.t).join(" ");
        const re = /\d[.,]\d\s*[—-]\s*(Optimizing|Quantitatively|Defined|Managed|Initial|Non-existent)/g;
        let m; while ((m = re.exec(t))) faixas.push("p" + (k + 1) + " '" + m[0] + "'");
      });
      censo[a.name].faixasNumericas = faixas;
      if (!a.oraculo.suff && faixas.length)
        d7.push(a.name + ": papel nomeia estágio numérico por domínio sob gate fechado: " + faixas.join(" · "));
    }
    observed.censoPublicacao = censo;
  } else {
    d7.push("poppler-utils ausente: a prova de publicação no papel NÃO foi executada");
  }

  evidence("P52-PDF-cases.json", observed);
  T("P52-PDF1", "página 1 com abertura, orientação, resumo e régua; prioridades abrindo a página 2", !d1.length, d1);
  T("P52-PDF2", "abertura única, faixa de domínios distribuída e régua com 'Você está aqui'", !d2.length, d2);
  T("P52-PDF3", "ícones de solução materialmente visíveis no PDF, sem distorção", !d3.length, d3);
  T("P52-PDF7", "nenhum score por domínio é publicado — em tabela, radar ou papel — com o gate canônico de suficiência fechado", !d7.length, d7);
  T("P52-PDF8", "nas duas condições de contexto o PDF é o relatório estruturado, e a superfície de aplicação não chega ao papel", !d8.length, d8);
  T("P52-PDF9", "tela e papel publicam a mesma decisão de score por domínio e o mesmo agregado, nos quatro quadrantes", !d9.length, d9);
  /* ERRATA §4.5 · as provas de paginação examinam os MESMOS quatro PDFs que
     acabaram de ser impressos, arquivo por arquivo. */
  if (shouldRun("P52-PDF4")) pdf4(arquivos, observed);
  if (shouldRun("P52-PDF5")) pdf5(arquivos, observed);
  if (shouldRun("P52-PDF6")) pdf6(arquivos, observed);
  if (!NO_EVIDENCE) evidence("P52-pdf-paginacao.json", observed);
}

/* ============================== P52-ACC1 ============================== */
/* Duas obrigações distintas da §12 da diretriz, medidas separadamente:
     (1) ZERO violação critical/serious de axe nas superfícies NOVAS — o
         trilho, os headings de seção, os grupos de gap, o card de contexto,
         o estado de grupo do editor e o botão de evidência;
     (2) ZERO NOVO problema de contraste na tela como um todo — provado por
         comparação do conjunto de violações do candidato com o do BASELINE
         de entrada, e não por um número absoluto. A tela legada já entrava
         nesta fase com 21 ocorrências de `#DA291C` como texto de marca; a
         Phase 5.2 não pode aumentar esse conjunto e não está autorizada a
         alterar aquela superfície para reduzi-lo.                          */
const P52_OWN_SURFACES = ["#p52-rail", ".p52-sec-title", ".p52-sec-lead", ".p52-gapgrp-title",
  ".p52-gapgrp-count", ".p52-ctxcard", ".p52-grp-state", ".p52-foot-legal", ".p52-foot-contact"];

/* axe lê a cor RASTERIZADA: o mesmo `#DA291C` volta como #d5281c/#d8291c/
   #da291c conforme o anti-aliasing da execução. A chave quantiza cada canal
   para que ruído de renderização não vire "problema novo" — e para que um
   problema realmente novo não se esconda atrás do ruído. */
function bucket(hex) {
  const h = String(hex || "").replace("#", "");
  if (h.length < 6) return hex || "-";
  const q = i => Math.round(parseInt(h.slice(i, i + 2), 16) / 16);
  return "b" + q(0) + q(2) + q(4);
}
function axeKey(v, n) {
  const m = String(n.failureSummary || "").match(/foreground color:\s*(#[0-9a-f]{3,8})[\s\S]*?background color:\s*(#[0-9a-f]{3,8})/i);
  return v.id + "|" + v.impact + "|" + (m ? bucket(m[1]) + "|" + bucket(m[2]) : "-");
}
function axeKeys(violations) {
  const set = {};
  for (const v of violations) for (const n of v.nodes) set[axeKey(v, n)] = 1;
  return set;
}
/* Um nó violador pertence à Camada 5.2? O `target` do axe é um CAMINHO de
   seletores; só o ÚLTIMO segmento identifica o nó — os anteriores são
   ancestrais, e a seção do workspace é ancestral de quase tudo. Testar o
   caminho inteiro acusaria a Camada 5.2 por texto legado que ela apenas
   passou a conter. */
function isP52Node(n) {
  const alvo = String((n.target || []).slice(-1)[0] || "");
  const ultimo = alvo.split(">").map(x => x.trim()).filter(Boolean).pop() || "";
  return /(^|[.#\[])p52-/.test(ultimo);
}
async function acc1(browser, errs) {
  const detail = [], observed = {};
  let AxeBuilder = null;
  try { AxeBuilder = require("@axe-core/playwright").default; } catch (e) { AxeBuilder = null; }
  if (!AxeBuilder) { T("P52-ACC1", "acessibilidade automatizada das superfícies novas", false, ["@axe-core/playwright indisponível"]); return; }
  const base = baselineFile();
  if (!base.ok) { T("P52-ACC1", "acessibilidade automatizada das superfícies novas", false, ["baseline indisponível: " + base.why]); return; }

  const CASES = [
    { fx: FX52.P52_F1, id: "P52-F1", vp: { width: 1440, height: 900 } },
    { fx: FX52.P52_F3, id: "P52-F3", vp: { width: 1440, height: 900 } },
    { fx: FX52.P52_F1, id: "P52-F1", vp: { width: 390, height: 844 } }
  ];
  for (const c of CASES) {
    const tag = c.id + "@" + c.vp.width;
    const ctx = await browser.newContext({ viewport: c.vp });
    const pg = await ctx.newPage();
    pg.on("pageerror", e => errs.push("P52-ACC1: " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      await toResults(pg, c.fx);

      /* (1) superfícies NOVAS: nada de critical/serious */
      let b1 = new AxeBuilder({ page: pg });
      for (const sel of P52_OWN_SURFACES) b1 = b1.include(sel);
      const own = await b1.analyze();
      const badOwn = own.violations.filter(v => v.impact === "critical" || v.impact === "serious");
      observed[tag + "/novas"] = badOwn.map(v => ({ id: v.id, impact: v.impact,
        nodes: v.nodes.map(n => n.target.join(" ")).slice(0, 6) }));
      for (const v of badOwn)
        detail.push(tag + ": axe " + v.id + " (" + v.impact + ", " + v.nodes.length + " nós) em superfície nova");

      /* (2) a tela inteira não pode ter GANHO problema algum */
      const cand = await new AxeBuilder({ page: pg }).include("#app").analyze();
      const candBad = cand.violations.filter(v => v.impact === "critical" || v.impact === "serious");
      const bctx = await browser.newContext({ viewport: c.vp });
      const bpg = await bctx.newPage();
      await bpg.goto("file://" + base.file);
      await toResults(bpg, c.fx);
      const bl = await new AxeBuilder({ page: bpg }).include("#app").analyze();
      const blBad = bl.violations.filter(v => v.impact === "critical" || v.impact === "serious");
      await bpg.close(); await bctx.close();
      const ck = axeKeys(candBad), bk = axeKeys(blBad);
      observed[tag + "/tela"] = { candidato: Object.keys(ck), baseline: Object.keys(bk) };
      for (const k of Object.keys(ck))
        if (!(k in bk)) detail.push(tag + ": combinação NOVA de contraste — " + k);
      /* nenhuma violação pode estar em nó desta camada */
      const meus = candBad.flatMap(v => v.nodes.filter(isP52Node).map(n => v.id + " @ " + n.target.join(" ")));
      for (const m of meus) detail.push(tag + ": violação em nó da Camada 5.2 — " + m);
      observed[tag + "/nossos"] = meus;

      /* (3) hierarquia de headings do workspace */
      const hs = await pg.evaluate(() => Array.from(document.querySelectorAll("#p52-flow h2, #p52-flow h3"))
        .map(h => ({ level: +h.tagName[1], text: (h.textContent || "").trim().slice(0, 40) })));
      let prev = 1;
      for (const h of hs) {
        if (h.level > prev + 1) detail.push(tag + ": salto de heading para h" + h.level + " em '" + h.text + "'");
        prev = h.level;
      }
    } finally { await pg.close(); await ctx.close(); }
  }
  evidence("P52-ACC1-axe.json", observed);
  T("P52-ACC1", "zero critical/serious de axe nas superfícies novas e zero NOVO problema de contraste na tela", !detail.length, detail);
}

/* ============================== P52-ACC2 ============================== */
/* Zoom de 200% em 1440x900: sem clipping, sem controle fora da viewport e sem
   rolagem horizontal. Emulado pela redução equivalente da viewport CSS. */
async function acc2(browser, errs) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  pg.on("pageerror", e => errs.push("P52-ACC2: " + String(e.message)));
  try {
    await pg.goto(HTML_URL);
    await toResults(pg, FX52.P52_F1);
    const ov = await overflow(pg);
    if (ov.s > ov.c + 1) detail.push("rolagem horizontal a 200%: " + ov.s + " > " + ov.c);
    const m = await pg.evaluate(() => {
      const bad = [];
      const ctrls = Array.from(document.querySelectorAll(
        "#p52-workspace a[href], #p52-workspace button, #p52-workspace select, #p52-workspace summary"));
      /* um controle dentro de um contêiner com rolagem horizontal PRÓPRIA
         continua alcançável — a barra de seções compacta é exatamente isso.
         Só é falha o que sai da página sem meio de chegar até lá. */
      const emRolagem = e => {
        for (let p = e.parentElement; p; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (/(auto|scroll)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1) return true;
        }
        return false;
      };
      ctrls.forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (emRolagem(e)) return;
        if (r.left < -1 || r.right > document.documentElement.clientWidth + 1)
          bad.push({ sel: e.id || e.className, l: Math.round(r.left), r: Math.round(r.right) });
      });
      return { controls: ctrls.length, offscreen: bad,
        railList: getComputedStyle(document.querySelector(".p52-rail-list")).overflowX };
    });
    observed.zoom200 = m;
    if (m.offscreen.length)
      detail.push(m.offscreen.length + " controles fora da viewport a 200%: " +
        m.offscreen.slice(0, 4).map(x => x.sel).join(","));
    if (!m.controls) detail.push("nenhum controle do workspace medido");
    /* nenhuma seção fica inacessível */
    const sec = await pg.evaluate(() => Array.from(document.querySelectorAll("#p52-flow > .p52-sec"))
      .filter(s => { const cs = getComputedStyle(s); return cs.display === "none" || cs.visibility === "hidden"; })
      .map(s => s.id));
    if (sec.length) detail.push("seções inacessíveis a 200%: " + sec.join(","));
    evidence("P52-ACC2-zoom200.json", observed);
  } finally { await pg.close(); }
  T("P52-ACC2", "zoom de 200% em 1440x900 sem clipping, sem controle fora da viewport e sem rolagem horizontal", !detail.length, detail);
}

/* ==========================================================================
   ERRATA UAT ESTREITA · §2.4 — GATES DE ESCALA ULTRAWIDE
   Medidos em Chromium REAL, zoom do navegador em 100%, sem detectar
   navegador, sistema ou monitor: a única entrada é a viewport em CSS px.
   O oráculo é a RAZÃO entre viewports — independente dos valores absolutos
   declarados por qualquer camada, e por isso imune a maquiagem.
   ========================================================================== */
const UW_HOME_SURF = [
  { k: "h1", sel: ".p52-hero-main h1" },
  { k: "lead", sel: ".p52-hero-main p.lead" },
  { k: "eyebrow", sel: ".p52-hero-main .eyebrow" },
  { k: "meta", sel: ".p52-hero-main .meta-row > div" },
  { k: "cta", sel: "#start" },
  { k: "ctx", sel: "#ux-addctx" },
  { k: "importar", sel: "#ses-import-home" }
];
const UW_Q_SURF = [
  { k: "pergunta", sel: "#app .question" },
  { k: "hint", sel: "#app .hint" },
  { k: "opt", sel: "#app .opt" },
  { k: "optT", sel: "#app .opt .t" },
  { k: "optD", sel: "#app .opt .d" },
  { k: "voltar", sel: "#back" },
  { k: "continuar", sel: "#next" }
];

async function uwMeasure(pg, surf) {
  return pg.evaluate((surf) => {
    const out = { surf: {}, ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    const R = e => { const r = e.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
    surf.forEach(s => {
      const e = document.querySelector(s.sel);
      if (!e) { out.surf[s.k] = null; return; }
      const cs = getComputedStyle(e);
      out.surf[s.k] = Object.assign({ fs: +parseFloat(cs.fontSize).toFixed(2) }, R(e));
    });
    const wrap = document.querySelector(".wrap");
    out.wrap = wrap ? +wrap.getBoundingClientRect().width.toFixed(1) : null;
    out.vw = window.innerWidth; out.vh = window.innerHeight;
    /* medida de LINHA DE LEITURA em caracteres: sonda com `width:1ch` no
       mesmo contexto tipográfico do alvo — nada de estimativa por em. */
    out.ch = (function () {
      const alvo = document.querySelector(".p52-hero-main p.lead") || document.querySelector("#app .hint");
      if (!alvo) return null;
      const s = document.createElement("span");
      s.style.cssText = "display:inline-block;width:1ch;height:1px;position:absolute;visibility:hidden";
      alvo.appendChild(s);
      const uma = s.getBoundingClientRect().width;
      s.remove();
      return uma > 0 ? +(alvo.getBoundingClientRect().width / uma).toFixed(1) : null;
    })();
    const ft = document.querySelector(".wrap > footer");
    out.footerFs = ft ? +parseFloat(getComputedStyle(ft).fontSize).toFixed(2) : null;
    const shell = document.getElementById("p50-shell");
    const app = document.getElementById("app");
    out.side = shell ? +shell.getBoundingClientRect().width.toFixed(1) : null;
    out.main = app ? +app.getBoundingClientRect().width.toFixed(1) : null;
    const nav = document.querySelector("#app .navrow");
    out.navBottom = nav ? Math.round(nav.getBoundingClientRect().bottom) : null;
    const evid = document.querySelector("#app .notebar") || document.querySelector("#app #p52-qutil");
    out.evidBottom = evid ? Math.round(evid.getBoundingClientRect().bottom) : null;
    const mapa = document.querySelector("#p50-shell .p50-sidebar");
    out.mapaBottom = mapa ? Math.round(mapa.getBoundingClientRect().bottom) : null;
    return out;
  }, surf);
}
function uwRatio(a, b, k) {
  if (!a || !b || !a.surf[k] || !b.surf[k]) return null;
  const x = a.surf[k].fs, y = b.surf[k].fs;
  return (x && y) ? +(y / x).toFixed(3) : null;
}

/* ============================== P52-UW1 ============================== */
async function uw1(browser, errs) {
  const detail = [], observed = {};
  const VPS = [{ w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 }, { w: 3440, h: 1392 }];
  const med = {};
  for (const vp of VPS) {
    const pg = await pageAt(browser, vp, errs, "P52-UW1");
    try { med[vp.w] = await uwMeasure(pg, UW_HOME_SURF); } finally { await pg.close(); }
  }
  observed.medidas = med;
  /* 1 · abaixo da faixa NADA muda: 1440 e 1920 têm de ser idênticos */
  UW_HOME_SURF.forEach(s => {
    const r = uwRatio(med[1440], med[1920], s.k);
    if (r !== null && Math.abs(r - 1) > 0.001)
      detail.push("a faixa ultrawide vazou para 1920: " + s.k + " mudou " + r + "×");
  });
  /* 2 · na faixa ultrawide a escala é a pedida pela §2.2: 1,20–1,25 */
  UW_HOME_SURF.forEach(s => {
    const r = uwRatio(med[1920], med[3440], s.k);
    if (r === null) { detail.push("superfície ausente na home: " + s.k); return; }
    if (r < 1.18 || r > 1.28)
      detail.push("home " + s.k + " escalou " + r + "× (§2.2 pede ~1,20–1,25)");
    const r25 = uwRatio(med[1920], med[2560], s.k);
    if (r25 !== null && (r25 < 1.18 || r25 > 1.28))
      detail.push("home " + s.k + " em 2560 escalou " + r25 + "×");
  });
  /* 3 · pisos absolutos exigidos em 3440x1392 */
  const m34 = med[3440];
  if (m34.surf.h1 && m34.surf.h1.fs < 44) detail.push("heading em " + m34.surf.h1.fs + "px (piso 44px)");
  if (m34.surf.lead && m34.surf.lead.fs < 16) detail.push("texto corrido em " + m34.surf.lead.fs + "px (piso 16px)");
  ["cta", "ctx", "importar"].forEach(k => {
    if (m34.surf[k] && m34.surf[k].h < 44) detail.push("botão " + k + " com " + m34.surf[k].h + "px de altura (piso 44px)");
  });
  /* 4 · a composição ocupa MATERIALMENTE mais largura do que a candidata
         anterior — e a linha de leitura continua confortável */
  if (!(m34.wrap >= med[1920].wrap * 1.25))
    detail.push("largura útil da home em 3440 é " + m34.wrap + "px contra " + med[1920].wrap + "px em 1920 — sem ganho material");
  if (m34.ch === null) detail.push("não foi possível medir a linha de leitura");
  else if (m34.ch < 45 || m34.ch > 92) detail.push("linha de leitura da home com " + m34.ch + " caracteres");
  /* 5 · o rodapé continua discreto */
  if (m34.footerFs !== null && m34.surf.lead && m34.footerFs >= m34.surf.lead.fs)
    detail.push("rodapé em " + m34.footerFs + "px, igual ou maior que o corpo (" + m34.surf.lead.fs + "px)");
  /* 6 · nenhuma viewport com rolagem horizontal */
  Object.keys(med).forEach(w => { if (med[w].ovf > 1) detail.push("rolagem horizontal em " + w + "px: " + med[w].ovf); });
  evidence("P52-UW1-home-scale.json", observed);
  T("P52-UW1", "home ganha escala e largura na faixa ultrawide, sem tocar 1920 e sem esticar a linha de leitura", !detail.length, detail);
}

/* ============================== P52-UW2 ============================== */
async function uw2(browser, errs) {
  const detail = [], observed = {};
  const VPS = [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1024, h: 768 }, { w: 1440, h: 900 },
               { w: 1920, h: 1080 }, { w: 2560, h: 1440 }, { w: 3440, h: 1392 }];
  const med = {};
  for (const vp of VPS) {
    const pg = await pageAt(browser, vp, errs, "P52-UW2");
    try { await toQuestion(pg, 3); med[vp.w] = await uwMeasure(pg, UW_Q_SURF); } finally { await pg.close(); }
  }
  observed.medidas = med;
  UW_Q_SURF.forEach(s => {
    const r = uwRatio(med[1440], med[1920], s.k);
    if (r !== null && Math.abs(r - 1) > 0.001)
      detail.push("a faixa ultrawide vazou para 1920: " + s.k + " mudou " + r + "×");
  });
  UW_Q_SURF.forEach(s => {
    const r = uwRatio(med[1920], med[3440], s.k);
    if (r === null) { detail.push("superfície ausente na pergunta: " + s.k); return; }
    if (r < 1.06 || r > 1.14)
      detail.push("questionário " + s.k + " escalou " + r + "× (§2.3 pede ~1,08–1,12)");
  });
  const m34 = med[3440];
  /* §2.3 · o questionário não pode PARECER menor do que a home: o piso é o
     corpo canônico da home (16px), não a home já ampliada — ampliar o
     questionário até 19,5px contrariaria a própria faixa 1,08–1,12 da §2.3.
     Ponto declarado ao proprietário no relatório. */
  [["pergunta", 16], ["hint", 16], ["optT", 16], ["continuar", 16]].forEach(([k, piso]) => {
    if (m34.surf[k] && m34.surf[k].fs < piso)
      detail.push("questionário " + k + " em " + m34.surf[k].fs + "px (piso " + piso + "px, corpo canônico da home)");
  });
  /* o mapa lateral não pode roubar a coluna principal */
  if (m34.side !== null && m34.side > 442)
    detail.push("mapa lateral com " + m34.side + "px (teto 440px)");
  if (!(m34.main > med[1920].main))
    detail.push("coluna principal não cresceu: " + m34.main + "px contra " + med[1920].main + "px");
  /* mapa, pergunta, opções, evidência e navegação simultaneamente visíveis */
  ["mapaBottom", "evidBottom", "navBottom"].forEach(k => {
    if (m34[k] === null) { detail.push("elemento ausente na pergunta: " + k); return; }
    if (m34[k] > m34.vh) detail.push(k + " abaixo da dobra em 3440x1392 (" + m34[k] + " > " + m34.vh + ")");
  });
  Object.keys(med).forEach(w => { if (med[w].ovf > 1) detail.push("rolagem horizontal em " + w + "px: " + med[w].ovf); });
  evidence("P52-UW2-question-scale.json", observed);
  T("P52-UW2", "questionário ganha escala na faixa ultrawide mantendo mapa, pergunta, opções, evidência e navegação visíveis", !detail.length, detail);
}

/* ============================== P52-UW3 ============================== */
async function uw3(browser, errs) {
  const detail = [], observed = {};
  /* mobile continua mobile */
  const pgm = await pageAt(browser, { w: 390, h: 844 }, errs, "P52-UW3/mobile");
  try {
    const home = await uwMeasure(pgm, UW_HOME_SURF);
    observed.mobile = home;
    if (home.ovf > 1) detail.push("rolagem horizontal em 390px: " + home.ovf);
    ["cta", "ctx", "importar"].forEach(k => {
      if (home.surf[k] && home.surf[k].h < 44) detail.push("alvo de toque " + k + " com " + home.surf[k].h + "px");
    });
  } finally { await pgm.close(); }
  /* zoom de 200% sobre uma ultrawide: a viewport em CSS px cai pela metade e
     a faixa DESLIGA sozinha — é o comportamento pedido, e a prova de que a
     escala respeita o zoom do usuário em vez de tentar adivinhá-lo. */
  const pgz = await browser.newPage({ viewport: { width: 1720, height: 696 }, deviceScaleFactor: 2 });
  pgz.on("pageerror", e => errs.push("P52-UW3/zoom: " + String(e.message)));
  try {
    await pgz.goto(HTML_URL);
    const z = await uwMeasure(pgz, UW_HOME_SURF);
    observed.zoom200 = z;
    if (z.ovf > 1) detail.push("rolagem horizontal a 200% de zoom: " + z.ovf);
    if (z.surf.h1 && Math.abs(z.surf.h1.fs - 44) > 0.5)
      detail.push("a faixa ultrawide continuou ativa sob zoom de 200%: heading em " + z.surf.h1.fs + "px");
    const alcance = await pgz.evaluate(() => {
      const alvos = ["#start", "#ux-addctx", "#ses-import-home"];
      return alvos.map(s => { const e = document.querySelector(s); if (!e) return s + ":ausente";
        e.focus(); return document.activeElement === e ? null : s + ":sem foco"; }).filter(Boolean);
    });
    if (alcance.length) detail.push("controles sem alcance por teclado a 200%: " + alcance.join(","));
  } finally { await pgz.close(); }
  evidence("P52-UW3-degradacao.json", observed);
  T("P52-UW3", "mobile e zoom de 200% não são degradados pela faixa ultrawide", !detail.length, detail);
}

/* ==========================================================================
   ERRATA UAT ESTREITA · §3 — PARIDADE DOS CINCO POPOVERS DE DOMÍNIO
   O defeito de origem era funcional, não cosmético: o `<g>` do SVG só
   responde onde há geometria PINTADA, e o popover nascia POR CIMA dos nós de
   baixo — o ponteiro passava a estar sobre o popover, `mouseleave` disparava
   no nó e a ajuda fechava sozinha. "Processos" e "Tecnologia" eram os únicos
   cobertos. Estes gates medem os cinco pelo MESMO contrato, ponto a ponto.
   ========================================================================== */
const POP_VPS = [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1920, h: 1080 },
                 { w: 2560, h: 1440 }, { w: 3440, h: 1392 }];

async function popGeo(pg, i) {
  return pg.evaluate((i) => {
    const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
    const pop = document.getElementById("p52-domhelp-" + i);
    if (!g || !pop) return null;
    const cs = getComputedStyle(pop);
    const R = e => { const r = e.getBoundingClientRect();
      return { x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1),
               h: +r.height.toFixed(1), r: +r.right.toFixed(1), b: +r.bottom.toFixed(1) }; };
    const pr = R(pop), svgEl = document.querySelector(".p52-emblem"), sr = R(svgEl);
    const bate = [];
    document.querySelectorAll(".p52-emblem-node").forEach(o => {
      const orr = R(o);
      if (pr.x < orr.r - 0.5 && pr.r > orr.x + 0.5 && pr.y < orr.b - 0.5 && pr.b > orr.y + 0.5)
        bate.push(o.getAttribute("data-dom"));
    });
    let cortado = null;
    for (let a = pop.parentElement; a && !cortado; a = a.parentElement) {
      const acs = getComputedStyle(a);
      if (acs.overflow === "visible" && acs.overflowX === "visible" && acs.overflowY === "visible") continue;
      const ar = R(a);
      if (pr.b > ar.b + 0.5 || pr.y < ar.y - 0.5 || pr.r > ar.r + 0.5 || pr.x < ar.x - 0.5)
        cortado = a.className || a.tagName;
    }
    return {
      estilo: [pop.className, cs.width, cs.padding, cs.fontSize, cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
               cs.borderRadius, cs.backgroundColor, cs.boxShadow, cs.position, cs.zIndex,
               pop.getAttribute("role") || "", cs.color, cs.lineHeight].join(" | "),
      caixa: pr, svg: sr, sobreNos: bate, cortado: cortado,
      foraDaViewport: (pr.x < -0.5 || pr.r > window.innerWidth + 0.5 || pr.y < -0.5 || pr.b > window.innerHeight + 0.5),
      sobreOSvg: (pr.x < sr.r - 0.5 && pr.r > sr.x + 0.5 && pr.y < sr.b - 0.5 && pr.b > sr.y + 0.5),
      descrito: g.getAttribute("aria-describedby"),
      expandido: g.getAttribute("aria-expanded"),
      texto: (pop.textContent || "").trim()
    };
  }, i);
}

/* ============================== P52-POP1 ============================== */
async function pop1(browser, errs) {
  const detail = [], observed = {};
  for (const vp of POP_VPS) {
    const pg = await pageAt(browser, vp, errs, "P52-POP1");
    try {
      const geo = [];
      /* o emblema pode viver abaixo da dobra (768px empilha a home): a
         medida de recorte só faz sentido com o componente inteiro em tela,
         que é a condição em que o usuário o aciona. */
      await pg.waitForSelector(".p52-hero-art", { state: "attached" });
      /* medir antes de a tipografia assentar produz diferença de sub-pixel
         entre a PRIMEIRA e as demais medidas — que não é diferença de
         componente nenhum. Espera-se o layout parar antes de comparar. */
      await pg.evaluate(() => document.fonts && document.fonts.ready);
      await pg.evaluate(() => {
        const a = document.querySelector(".p52-hero-art");
        if (a) a.scrollIntoView({ block: "center", inline: "nearest" });
      });
      await pg.waitForTimeout(220);
      for (let i = 0; i < 5; i++) {
        await pg.locator('.p52-emblem-node[data-dom="' + i + '"]').hover({ force: true });
        await pg.waitForTimeout(90);
        const g = await popGeo(pg, i);
        if (!g) { detail.push(vp.w + "px: domínio " + i + " sem nó ou sem popover"); continue; }
        geo.push(g);
        if (g.expandido !== "true") detail.push(vp.w + "px: domínio " + i + " não abriu ao apontar");
        if (g.descrito !== "p52-domhelp-" + i)
          detail.push(vp.w + "px: domínio " + i + " associado a '" + g.descrito + "'");
        if (g.sobreNos.length)
          detail.push(vp.w + "px: popover " + i + " sobre o(s) nó(s) " + g.sobreNos.join(","));
        if (g.sobreOSvg) detail.push(vp.w + "px: popover " + i + " sobre o desenho do emblema");
        if (g.cortado) detail.push(vp.w + "px: popover " + i + " recortado por " + g.cortado);
        if (g.foraDaViewport) detail.push(vp.w + "px: popover " + i + " fora da viewport");
        if (!(g.caixa.w > 0 && g.caixa.h > 0)) detail.push(vp.w + "px: popover " + i + " sem caixa");
        if (!g.texto) detail.push(vp.w + "px: popover " + i + " sem texto");
      }
      observed[vp.w] = geo;
      if (geo.length === 5) {
        /* MESMO componente: a assinatura de estilo é uma só */
        const assinaturas = geo.map(g => g.estilo).filter((v, i, a) => a.indexOf(v) === i);
        if (assinaturas.length !== 1)
          detail.push(vp.w + "px: " + assinaturas.length + " apresentações diferentes entre os cinco popovers");
        /* MESMA geometria de ancoragem: mesma esquerda, mesma largura, mesma base */
        ["x", "w", "b"].forEach(k => {
          const vs = geo.map(g => g.caixa[k]);
          const spread = Math.max.apply(null, vs) - Math.min.apply(null, vs);
          if (spread > 1)
            detail.push(vp.w + "px: '" + k + "' varia " + spread.toFixed(1) + "px entre os cinco popovers");
        });
        /* cinco textos distintos, um por domínio */
        const textos = geo.map(g => g.texto).filter((v, i, a) => a.indexOf(v) === i);
        if (textos.length !== 5) detail.push(vp.w + "px: os cinco popovers não têm cinco textos distintos");
      }
    } finally { await pg.close(); }
  }
  evidence("P52-POP1-parity.json", observed);
  T("P52-POP1", "os cinco popovers de domínio são o mesmo componente, na mesma geometria, sem recorte e sem cobrir nó algum", !detail.length, detail);
}

/* ============================== P52-POP2 ============================== */
async function pop2(browser, errs) {
  const detail = [], observed = {};
  const aberto = (pg, i) => pg.evaluate(i => {
    const p = document.getElementById("p52-domhelp-" + i);
    return !!p && !p.hidden;
  }, i);
  const fechaTudo = pg => pg.evaluate(() => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); });

  for (const vp of [{ w: 1920, h: 1080 }, { w: 3440, h: 1392 }]) {
    const pg = await pageAt(browser, vp, errs, "P52-POP2");
    try {
      await pg.waitForSelector('.p52-emblem-node[data-dom="4"]', { state: "attached" });
      const rel = {};
      for (let i = 0; i < 5; i++) {
        const pontos = await pg.evaluate(i => {
          const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
          if (!g) return null;
          const C = e => { const r = e.getBoundingClientRect();
            return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; };
          return { disco: C(g.querySelector(".p52-emblem-disc")),
                   rotulo: C(g.querySelector(".p52-emblem-label")), caixa: C(g) };
        }, i);
        if (!pontos) { detail.push(vp.w + "px: emblema desapareceu antes do domínio " + i); break; }
        const porPonto = {};
        for (const nome of ["disco", "rotulo", "caixa"]) {
          await pg.mouse.move(4, 4); await fechaTudo(pg); await pg.waitForTimeout(60);
          await pg.mouse.move(pontos[nome][0], pontos[nome][1]); await pg.waitForTimeout(120);
          porPonto[nome] = await aberto(pg, i);
          if (!porPonto[nome]) detail.push(vp.w + "px: domínio " + i + " não abre ao apontar o " + nome);
        }
        /* foco por teclado */
        await pg.mouse.move(4, 4); await fechaTudo(pg); await pg.waitForTimeout(60);
        const foco = await pg.evaluate(i => {
          const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
          g.focus();
          const p = document.getElementById("p52-domhelp-" + i);
          return { focado: document.activeElement === g, aberto: !!p && !p.hidden };
        }, i);
        if (!foco.focado) detail.push(vp.w + "px: domínio " + i + " não recebe foco");
        if (!foco.aberto) detail.push(vp.w + "px: domínio " + i + " não abre ao focar");
        /* Esc fecha e devolve o foco ao trigger */
        const esc = await pg.evaluate(i => {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
          const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
          const p = document.getElementById("p52-domhelp-" + i);
          return { fechou: !!p && p.hidden, foco: document.activeElement === g,
                   expandido: g.getAttribute("aria-expanded") };
        }, i);
        if (!esc.fechou) detail.push(vp.w + "px: Esc não fecha o domínio " + i);
        if (!esc.foco) detail.push(vp.w + "px: Esc não devolve o foco ao domínio " + i);
        if (esc.expandido !== "false") detail.push(vp.w + "px: aria-expanded ficou '" + esc.expandido + "' após Esc");
        /* clique alterna */
        const alterna = await pg.evaluate(i => {
          const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
          const p = document.getElementById("p52-domhelp-" + i);
          /* sem `bubbles`: o alvo do contrato é o próprio nó. Deixar o evento
             subir acionaria os atalhos globais do produto (Enter avança a
             tela) e o gate mediria outra coisa. */
          g.dispatchEvent(new MouseEvent("click"));
          const a = !p.hidden;
          g.dispatchEvent(new MouseEvent("click"));
          return { abriu: a, fechou: p.hidden };
        }, i);
        if (!alterna.abriu || !alterna.fechou)
          detail.push(vp.w + "px: clique não alterna o domínio " + i + " (" + JSON.stringify(alterna) + ")");
        /* Enter alterna */
        const tecla = await pg.evaluate(i => {
          const g = document.querySelector('.p52-emblem-node[data-dom="' + i + '"]');
          const p = document.getElementById("p52-domhelp-" + i);
          g.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
          const a = !p.hidden;
          g.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
          return { abriu: a, fechou: p.hidden };
        }, i);
        if (!tecla.abriu || !tecla.fechou)
          detail.push(vp.w + "px: Enter não alterna o domínio " + i);
        rel[i] = { porPonto, foco, esc, alterna, tecla };
      }
      /* exclusividade: no máximo um aberto */
      const excl = await pg.evaluate(() => {
        const g0 = document.querySelector('.p52-emblem-node[data-dom="0"]');
        const g3 = document.querySelector('.p52-emblem-node[data-dom="3"]');
        g0.dispatchEvent(new MouseEvent("click"));
        g3.dispatchEvent(new MouseEvent("click"));
        return Array.from(document.querySelectorAll('[data-p52="emblem-pop"]'))
          .filter(p => !p.hidden).map(p => p.id);
      });
      if (excl.length !== 1 || excl[0] !== "p52-domhelp-3")
        detail.push(vp.w + "px: exclusividade quebrada — abertos: " + (excl.join(",") || "nenhum"));
      observed[vp.w] = rel;
    } finally { await pg.close(); }
  }
  /* toque real, em contexto com touch */
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const pgt = await ctx.newPage();
  pgt.on("pageerror", e => errs.push("P52-POP2/toque: " + String(e.message)));
  try {
    await pgt.goto(HTML_URL);
    await pgt.waitForSelector('.p52-emblem-node[data-dom="4"]', { state: "attached" });
    for (let i = 0; i < 5; i++) {
      await pgt.locator('.p52-emblem-node[data-dom="' + i + '"] .p52-emblem-disc').tap({ force: true });
      await pgt.waitForTimeout(90);
      const ok = await pgt.evaluate(i => {
        const p = document.getElementById("p52-domhelp-" + i);
        return !!p && !p.hidden;
      }, i);
      if (!ok) detail.push("toque não abre o domínio " + i + " em 390px");
      await pgt.evaluate(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    }
  } finally { await ctx.close(); }
  evidence("P52-POP2-interacao.json", observed);
  T("P52-POP2", "os cinco domínios respondem igual a ponteiro, teclado, clique, toque e Esc, com um popover aberto por vez", !detail.length, detail);
}

/* ==========================================================================
   GATES NOVOS DA ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND
   (parecer SHA-256 f5a9f70e7a5ee658ef86775d8dab93ce2cb15974604a7ed7f1dcd99e13b58dae)

   P52-ACC3 · A-01 — contraste COMPUTADO, nó a nó, nas três telas
   P52-HELP2 · §6.1 — cobertura de ajuda `(i)` e contrato do componente
   P52-SIG1  · §6.2 — grade de requisitos consistente
   P52-ADV1  · §6.3 — tipografia e marcador de "Para avançar"
   P52-TGT3  · §6.4 — painel do cenário-alvo ocupa a seção, nos dois estados
   P52-ICON3 · §6.5/§6.6 — ocupação óptica do `.v32-icon` e ícones pintados
                            nas listas secundárias (medido em PIXEL)
   ========================================================================== */

/* razão de contraste WCAG a partir de duas cores rgb() já computadas */
function p52Lum(c) {
  const f = v => { v = v / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function p52Ratio(a, b) {
  const la = p52Lum(a), lb = p52Lum(b);
  return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(3));
}

/* ============================== P52-ACC3 ============================== */
async function acc3(browser, errs) {
  const detail = [], observed = {};
  /* ==========================================================================
     ERRATA FINAL · MÉDIO-2 · o caso que faltava, e a guarda de não-vacuidade.

     Parecer 70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120
     (§10 MÉDIO-2): o SELETOR deste gate já cobria `#app a`, logo `.p52-sup-link`
     estava no escopo. O ponto cego era de FIXTURE — os três casos declaram
     `landscape: "UNSET"`, e sem contexto tecnológico o produto nunca monta os
     cards de apoio. `grep p52-sup-link` na evidência do gate: zero ocorrências.

     `P52-F5` declara o contexto pelo editor REAL e monta os cards. O caso é
     acompanhado de uma guarda NOMINAL: se o link deixar de ser renderizado, o
     gate FALHA por cobertura — nunca passa em silêncio. Registra-se também que
     a guarda genérica de não-vacuidade do caso "pergunta" é satisfeita por um
     único nó, e por isso ela não é a proteção deste achado.
     ========================================================================== */
  const CASOS = [
    { nome: "resultados", fx: FX52.P52_F1, tela: "results" },
    { nome: "resultados-bloqueado", fx: FX52.P52_F3, tela: "results" },
    { nome: "pergunta", tela: "question" },
    { nome: "resultados-contexto", fx: FX52.P52_F5, tela: "results", contexto: true,
      exigeSeletores: ["a.p52-sup-link"], minimoNos: 8 }
  ];
  for (const caso of CASOS) {
    const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    pg.on("pageerror", e => errs.push("P52-ACC3: " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      if (caso.tela === "question") await toQuestion(pg, 3); else await toResults(pg, caso.fx);
      if (caso.contexto) await p52DeclaraContexto(pg);
      /* GUARDA DE COBERTURA · nominal, antes de medir: o gate não pode ser
         declarado verde sobre uma fixture que não monta o nó sob prova. */
      if (caso.exigeSeletores) {
        const presentes = await pg.evaluate(sels => sels.map(s => ({
          sel: s, n: document.querySelectorAll("#app " + s).length })), caso.exigeSeletores);
        presentes.forEach(x => {
          if (!x.n) detail.push(caso.nome + ": fixture não montou '" + x.sel + "' — gate vacuoso para este nó");
        });
      }
      const nos = await pg.evaluate(() => {
        const rgb = s => { const m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/.exec(s || "");
          return m ? [ +m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4] ] : null; };
        const fundo = e => {                       /* primeiro ancestral OPACO */
          for (let n = e; n; n = n.parentElement) {
            const c = rgb(getComputedStyle(n).backgroundColor);
            if (c && c[3] >= 0.999) return c;
          }
          return [255, 255, 255, 1];
        };
        const visivel = e => {
          for (let n = e; n && n !== document.body; n = n.parentElement) {
            const c = getComputedStyle(n);
            if (c.display === "none" || c.visibility === "hidden" || Number(c.opacity) === 0) return false;
          }
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const out = [];
        const alvos = document.querySelectorAll(
          "#app .eyebrow, #app .stage-tag, #app .f-tag, #app .rk, #app .pt-link, #app .pnum, " +
          "#app a, #app .p52-sec-title .eyebrow, #app .jn-themes li");
        alvos.forEach(e => {
          /* só nós com TEXTO PRÓPRIO: contêiner herda cor mas não pinta letra */
          const proprio = Array.from(e.childNodes).some(n => n.nodeType === 3 && (n.textContent || "").trim());
          if (!proprio || !visivel(e)) return;
          const cs = getComputedStyle(e);
          const fg = rgb(cs.color); if (!fg) return;
          const px = parseFloat(cs.fontSize);
          const peso = parseInt(cs.fontWeight, 10) || 400;
          out.push({
            sel: (e.className || e.tagName).toString().slice(0, 44),
            texto: (e.textContent || "").trim().slice(0, 34),
            fg: fg.slice(0, 3), bg: fundo(e).slice(0, 3), px: px, peso: peso,
            deco: String(cs.textDecorationLine || ""),
            grande: px >= 24 || (px >= 18.66 && peso >= 700)
          });
        });
        return out;
      });
      if (!nos.length) { detail.push(caso.nome + ": nenhum nó de texto de marca medido — sensor cego"); continue; }
      if (caso.minimoNos && nos.length < caso.minimoNos)
        detail.push(caso.nome + ": só " + nos.length + " nó(s) medidos, mínimo declarado " + caso.minimoNos);
      /* WCAG 1.4.1 · o link de apoio não pode se distinguir SÓ pela cor. */
      const semAfordancia = nos.filter(n => /p52-sup-link/.test(n.sel) &&
        n.deco.indexOf("underline") < 0 && n.texto.indexOf("↗") < 0);
      semAfordancia.forEach(n => detail.push(caso.nome + ": '" + n.texto +
        "' distingue-se apenas pela cor (text-decoration '" + n.deco + "', sem glifo)"));
      const falhas = [];
      nos.forEach(n => {
        const r = p52Ratio(n.fg, n.bg);
        const exigido = n.grande ? 3 : 4.5;
        if (r + 0.005 < exigido)
          falhas.push(n.sel + " '" + n.texto + "' " + n.px + "px → " + r + ":1 (exigido " + exigido + ":1)");
      });
      observed[caso.nome] = { medidos: nos.length, falhas: falhas,
        supLinks: nos.filter(n => /p52-sup-link/.test(n.sel))
          .map(n => ({ texto: n.texto, fg: n.fg, bg: n.bg, px: n.px, deco: n.deco,
            razao: p52Ratio(n.fg, n.bg) })) };
      falhas.forEach(f => detail.push(caso.nome + ": " + f));
    } finally { await pg.close(); }
  }
  evidence("P52-ACC3-contraste.json", observed);
  T("P52-ACC3", "todo texto de marca renderizado atinge 4,5:1 (3:1 para texto grande) sobre o fundo opaco efetivo", !detail.length, detail);
}

/* ============================== P52-HELP2 ============================== */
async function help2(browser, errs) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => errs.push("P52-HELP2: " + String(e.message)));
  try {
    await pg.goto(HTML_URL);
    await toResults(pg, FX52.P52_F1);
    await pg.click("#v32cta");
    await pg.waitForTimeout(300);
    await pg.evaluate(() => { document.querySelectorAll("#v32editor details").forEach(d => { d.open = true; }); });
    await pg.waitForTimeout(500);
    const m = await pg.evaluate(() => {
      const ed = document.getElementById("v32editor");
      const tem = e => !!(e && e.querySelector('[data-p52="cap-help"]'));
      const lab = e => e && e.closest ? e.closest("label") : null;
      const grupos = [];
      const reg = (grupo, nome, host) => grupos.push({ grupo: grupo, nome: nome, ok: tem(host) });
      /* o controle DA capability é o único com `data-cap`: o cabeçalho também
         hospeda o controle da "Situação declarada", e confundir os dois faria
         o gate aprovar uma capability sem verbete. */
      ed.querySelectorAll(".v32-cap[id^='v32-cap-']").forEach(c => {
        const head = c.querySelector(".v32-cap-head");
        grupos.push({ grupo: "capability", nome: c.id.replace(/^v32-cap-/, ""),
                      ok: !!(head && head.querySelector('[data-p52="cap-help"][data-cap]')) });
      });
      ed.querySelectorAll('select[id^="v32-pres-"]').forEach(sl =>
        reg("situação declarada", sl.id, lab(sl)));
      ed.querySelectorAll(".v32-arch label").forEach(l =>
        reg("arquitetura", (l.childNodes[0].textContent || "").trim().slice(0, 40), l));
      ed.querySelectorAll("details.v32-group > summary").forEach(sm =>
        reg("família", (sm.textContent || "").trim().slice(0, 40), sm));
      ed.querySelectorAll("details.v32-siggroup > summary").forEach(sm =>
        reg("subgrupo de requisitos", (sm.textContent || "").trim().slice(0, 40), sm));
      ed.querySelectorAll('input[id^="v32-sig-"]').forEach(c =>
        reg("requisito", c.id, lab(c)));
      ed.querySelectorAll('input[id^="v32-sub-"]').forEach(c =>
        reg("subscription", c.id, lab(c)));
      ed.querySelectorAll('input[name="v32-bundle"]').forEach(c =>
        reg("bundle", c.value || "(nenhum)", lab(c)));
      const fgt = ed.querySelector("#v32-plat-fgt");
      if (fgt) reg("plataforma", "v32-plat-fgt", lab(fgt));
      ed.querySelectorAll("fieldset > legend").forEach(l =>
        reg("legenda", (l.textContent || "").trim().slice(0, 40), l));
      /* contrato do componente, medido em TODOS os controles */
      const btns = Array.from(ed.querySelectorAll('[data-p52="cap-help"]'));
      const contrato = btns.map(b => {
        const cs = getComputedStyle(b);
        const pop = document.getElementById(b.getAttribute("aria-describedby") || "");
        return {
          id: b.getAttribute("aria-describedby"),
          nome: (b.getAttribute("aria-label") || "").length,
          rotulo: (b.textContent || "").trim(),
          w: Math.round(b.getBoundingClientRect().width),
          h: Math.round(b.getBoundingClientRect().height),
          fs: cs.fontSize, radius: cs.borderRadius,
          expanded: b.getAttribute("aria-expanded"),
          temPop: !!pop, popRole: pop ? pop.getAttribute("role") : null,
          popTexto: pop ? (pop.textContent || "").trim().length : 0,
          title: b.hasAttribute("title")
        };
      });
      return { grupos: grupos, contrato: contrato, total: btns.length };
    });
    const faltando = m.grupos.filter(g => !g.ok);
    observed.cobertura = { total: m.grupos.length, comAjuda: m.grupos.length - faltando.length, faltando: faltando };
    observed.contratoAmostra = m.contrato.slice(0, 6);
    if (!m.grupos.length) detail.push("sensor cego: nenhum campo do editor foi encontrado");
    faltando.forEach(f => detail.push("sem ajuda (i): " + f.grupo + " · " + f.nome));
    /* contrato idêntico: mesmo rótulo, mesma caixa, mesma tipografia */
    const caixas = Array.from(new Set(m.contrato.map(c => c.w + "x" + c.h)));
    if (caixas.length > 1) detail.push("controles de ajuda com caixas diferentes: " + caixas.join(", "));
    const fss = Array.from(new Set(m.contrato.map(c => c.fs)));
    if (fss.length > 1) detail.push("controles de ajuda com tipografias diferentes: " + fss.join(", "));
    const rots = Array.from(new Set(m.contrato.map(c => c.rotulo)));
    if (rots.length > 1) detail.push("controles de ajuda com rótulos diferentes: " + rots.join(", "));
    m.contrato.forEach(c => {
      if (!c.nome) detail.push("controle sem nome acessível: " + c.id);
      if (c.expanded !== "false" && c.expanded !== "true") detail.push("controle sem aria-expanded: " + c.id);
      if (!c.temPop) detail.push("aria-describedby sem alvo: " + c.id);
      if (c.popRole !== "note") detail.push("popover sem role=note: " + c.id);
      if (c.popTexto < 40) detail.push("popover com texto curto demais: " + c.id + " (" + c.popTexto + " caracteres)");
      if (c.title) detail.push("controle usa tooltip nativo `title`: " + c.id);
    });
    /* comportamento real: hover, foco, clique, Escape e exclusividade */
    const alvo = m.contrato.length ? m.contrato[m.contrato.length - 1].id : null;
    if (alvo) {
      const comp = await pg.evaluate(async (popId) => {
        const b = document.querySelector('[aria-describedby="' + popId + '"]');
        const p = document.getElementById(popId);
        const espera = () => new Promise(r => setTimeout(r, 40));
        const out = {};
        b.dispatchEvent(new MouseEvent("mouseenter")); await espera();
        out.hover = !p.hidden;
        b.dispatchEvent(new MouseEvent("mouseleave")); await espera();
        b.focus(); await espera(); out.foco = !p.hidden;
        b.blur(); await espera();
        b.dispatchEvent(new MouseEvent("click", { bubbles: true })); await espera();
        out.clique = !p.hidden;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); await espera();
        out.escape = p.hidden;
        b.dispatchEvent(new MouseEvent("click", { bubbles: true })); await espera();
        b.dispatchEvent(new MouseEvent("click", { bubbles: true })); await espera();
        out.toggle = p.hidden;
        /* sem clipping nem sobreposição: dentro da viewport quando aberto */
        b.dispatchEvent(new MouseEvent("click", { bubbles: true })); await espera();
        const r = p.getBoundingClientRect();
        out.dentro = r.left >= -1 && r.right <= window.innerWidth + 1 && r.width > 0 && r.height > 0;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        return out;
      }, alvo);
      observed.comportamento = comp;
      ["hover", "foco", "clique", "escape", "toggle", "dentro"].forEach(k => {
        if (!comp[k]) detail.push("contrato do componente falhou em '" + k + "' (" + alvo + ")");
      });
    }
  } finally { await pg.close(); }
  evidence("P52-HELP2-cobertura.json", observed);
  T("P52-HELP2", "ajuda (i) em toda capability, campo, família, subgrupo, requisito, bundle, subscription e legenda, com contrato idêntico", !detail.length, detail);
}

/* ============================== P52-SIG1 ============================== */
async function sig1(browser, errs) {
  const detail = [], observed = {};
  for (const vp of [{ w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 390, h: 844 }]) {
    const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    pg.on("pageerror", e => errs.push("P52-SIG1: " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      await toResults(pg, FX52.P52_F1);
      await pg.click("#v32cta");
      await pg.waitForTimeout(300);
      await pg.evaluate(() => { document.querySelectorAll("#v32editor details").forEach(d => { d.open = true; }); });
      await pg.waitForTimeout(400);
      const m = await pg.evaluate(() => {
        const grids = Array.from(document.querySelectorAll("#v32editor .v32-signals"));
        return grids.map(g => {
          const cs = getComputedStyle(g);
          const labs = Array.from(g.children).filter(c => c.tagName === "LABEL");
          const cx = labs.map(l => Math.round(l.getBoundingClientRect().left));
          const larg = labs.map(l => Math.round(l.getBoundingClientRect().width));
          const linhas = {};
          labs.forEach(l => { const t = Math.round(l.getBoundingClientRect().top);
            const chave = Object.keys(linhas).find(k => Math.abs(+k - t) <= 4);
            (linhas[chave !== undefined ? chave : t] = linhas[chave !== undefined ? chave : t] || []).push(l); });
          /* alinhamento pelo TOPO dentro de cada linha */
          const desalinhados = Object.keys(linhas).filter(k =>
            new Set(linhas[k].map(l => Math.round(l.getBoundingClientRect().top))).size > 1).length;
          /* caixa e rótulo alinhados */
          const desalinhoCaixa = labs.filter(l => {
            const i = l.querySelector('input[type="checkbox"]');
            if (!i) return false;
            return Math.abs(i.getBoundingClientRect().top - l.getBoundingClientRect().top) > 6;
          }).length;
          const grupo = g.closest("details.v32-siggroup");
          return {
            grupo: grupo ? (grupo.querySelector("summary").textContent || "").trim().slice(0, 30) : "(plat)",
            n: labs.length,
            colunas: cs.gridTemplateColumns,
            colGap: cs.columnGap, rowGap: cs.rowGap,
            xUnicos: Array.from(new Set(cx)).sort((a, b) => a - b),
            largUnicas: Array.from(new Set(larg)),
            desalinhados: desalinhados, desalinhoCaixa: desalinhoCaixa,
            ordemPreservada: labs.map(l => (l.textContent || "").trim().slice(0, 18))
          };
        });
      });
      observed[vp.w] = m;
      if (!m.length) { detail.push(vp.w + ": nenhuma grade de requisitos medida — sensor cego"); continue; }
      const gapsRef = new Set();
      m.forEach(g => {
        if (!g.n) { detail.push(vp.w + "/" + g.grupo + ": grupo sem opções"); return; }
        gapsRef.add(g.colGap + "|" + g.rowGap);
        if (g.colGap !== g.rowGap)
          detail.push(vp.w + "/" + g.grupo + ": gaps desiguais (" + g.colGap + " × " + g.rowGap + ")");
        if (g.desalinhados)
          detail.push(vp.w + "/" + g.grupo + ": " + g.desalinhados + " linha(s) com cards fora do alinhamento de topo");
        if (g.desalinhoCaixa)
          detail.push(vp.w + "/" + g.grupo + ": " + g.desalinhoCaixa + " checkbox(es) desalinhado(s) do rótulo");
        /* colunas coerentes: no máximo 2 larguras distintas (a última coluna de
           uma linha incompleta pode diferir em 1px por arredondamento) */
        if (g.largUnicas.length > 2)
          detail.push(vp.w + "/" + g.grupo + ": " + g.largUnicas.length + " larguras de coluna distintas");
        if (vp.w <= 719 && g.xUnicos.length !== 1)
          detail.push(vp.w + "/" + g.grupo + ": " + g.xUnicos.length + " colunas em viewport estreito (esperado 1)");
        if (vp.w >= 1440 && g.n >= 4 && g.xUnicos.length < 2)
          detail.push(vp.w + "/" + g.grupo + ": grade não usa a largura disponível (1 coluna com " + g.n + " opções)");
      });
      if (gapsRef.size > 1)
        detail.push(vp.w + ": grades de requisitos com gaps diferentes entre grupos: " + Array.from(gapsRef).join(" / "));
      /* mesmas colunas para todos os grupos: nenhuma distribuição desigual */
      const cols = Array.from(new Set(m.filter(g => g.n).map(g => g.colunas.split(" ").length)));
      if (cols.length > 1)
        detail.push(vp.w + ": os grupos de requisitos usam números de coluna diferentes (" + cols.join(", ") + ")");
    } finally { await pg.close(); }
  }
  evidence("P52-SIG1-grade.json", observed);
  T("P52-SIG1", "requisitos específicos numa grade única: colunas coerentes, gaps iguais, cards alinhados pelo topo e uma coluna em viewport estreito", !detail.length, detail);
}

/* ============================== P52-ADV1 ============================== */
async function adv1(browser, errs) {
  const detail = [], observed = {};
  for (const vp of [{ w: 1440, h: 900 }, { w: 1920, h: 1080 }]) {
    const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    pg.on("pageerror", e => errs.push("P52-ADV1: " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      await toResults(pg, FX52.P52_F1);
      const m = await pg.evaluate(() => {
        const bloco = document.querySelector(".p52-exec-advance .jn-themes");
        if (!bloco) return null;
        const lis = Array.from(bloco.querySelectorAll("li"));
        const corpo = document.querySelector(".p52-exec-reading .jn-narrative p");
        return {
          n: lis.length,
          itens: lis.map(li => {
            const cs = getComputedStyle(li);
            const marca = getComputedStyle(li, "::before");
            return {
              px: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) / parseFloat(cs.fontSize),
              listStyle: cs.listStyleType,
              marcaW: marca.width, marcaH: marca.height, marcaContent: marca.content,
              marcaBorda: marca.borderTopColor,
              padLeft: parseFloat(cs.paddingLeft),
              img: (li.innerHTML || "").indexOf("<img") >= 0,
              caixa: Math.round(li.getBoundingClientRect().height)
            };
          }),
          corpoPx: corpo ? parseFloat(getComputedStyle(corpo).fontSize) : null,
          eyebrowPx: (function () { const e = bloco.querySelector(".eyebrow");
            return e ? parseFloat(getComputedStyle(e).fontSize) : null; })()
        };
      });
      if (!m) { detail.push(vp.w + ": bloco 'Para avançar' não montado — sensor cego"); continue; }
      observed[vp.w] = m;
      if (!m.n) { detail.push(vp.w + ": 'Para avançar' sem itens"); continue; }
      m.itens.forEach((it, i) => {
        if (it.px < 16.5) detail.push(vp.w + ": item " + i + " com " + it.px + "px (piso 16,5px)");
        if (it.lh < 1.55) detail.push(vp.w + ": item " + i + " com entrelinha " + it.lh.toFixed(2) + " (piso 1,55)");
        if (it.listStyle !== "none") detail.push(vp.w + ": item " + i + " ainda usa marcador de lista padrão (" + it.listStyle + ")");
        if (parseFloat(it.marcaW) < 4 || parseFloat(it.marcaH) < 4)
          detail.push(vp.w + ": item " + i + " sem marcador gráfico determinístico");
        if (it.img) detail.push(vp.w + ": item " + i + " usa asset de imagem — proibido nesta errata");
        if (it.padLeft < 20) detail.push(vp.w + ": item " + i + " sem calha para o marcador");
        /* não virar card pesado: altura próxima do texto, não de um bloco */
        if (it.caixa > it.px * it.lh * 4)
          detail.push(vp.w + ": item " + i + " virou card (" + it.caixa + "px de altura)");
      });
      /* hierarquia: o achado não pode ser menor que o corpo de leitura */
      if (m.corpoPx !== null && m.itens[0].px < m.corpoPx - 1.5)
        detail.push(vp.w + ": 'Para avançar' (" + m.itens[0].px + "px) menor que a leitura executiva (" + m.corpoPx + "px)");
    } finally { await pg.close(); }
  }
  evidence("P52-ADV1-avancar.json", observed);
  T("P52-ADV1", "'Para avançar' com tipografia de achado, entrelinha confortável e marcador gráfico determinístico, sem virar card", !detail.length, detail);
}

/* ============================== P52-TGT3 ============================== */
async function tgt3(browser, errs) {
  const detail = [], observed = {};
  for (const vp of [{ w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 }]) {
    for (const estado of ["vazio", "editado"]) {
      const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      pg.on("pageerror", e => errs.push("P52-TGT3: " + String(e.message)));
      try {
        await pg.goto(HTML_URL);
        await toResults(pg, estado === "editado" ? FX52.P52_F2 : { vec: FX52.P52_F2.vec });
        const m = await pg.evaluate(() => {
          const sec = document.getElementById("ux-target");
          if (!sec) return null;
          const bloco = sec.querySelector(".v32-block");
          /* a comparação é com a caixa de CONTEÚDO: padding do painel não é
             "card estreito", é respiro declarado. */
          const cx = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
            return { l: Math.round(r.left), w: Math.round(r.width),
                     inner: Math.round(r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) }; };
          const conteudo = document.getElementById("p52-flow") || document.querySelector(".wrap");
          const tab = sec.querySelector(".ux-tgt-table");
          return {
            secao: cx(sec), bloco: bloco ? cx(bloco) : null, area: cx(conteudo),
            filhos: Array.from(bloco ? bloco.children : []).map(c => ({
              cls: (c.className || c.tagName).toString().slice(0, 30), ...cx(c)
            })),
            tabela: tab ? cx(tab) : null,
            micro: (function () { const u = sec.querySelector(".ux-micro");
              return u ? Object.assign(cx(u), { px: parseFloat(getComputedStyle(u).fontSize) }) : null; })(),
            editado: !!tab
          };
        });
        if (!m) { detail.push(vp.w + "/" + estado + ": seção do cenário-alvo ausente — sensor cego"); continue; }
        observed[vp.w + "/" + estado] = m;
        const tag = vp.w + "/" + estado;
        if (m.editado !== (estado === "editado"))
          detail.push(tag + ": estado da fixture não alcançado (tabela " + (m.editado ? "presente" : "ausente") + ")");
        /* o painel ocupa a área de conteúdo, com folga de 2px */
        if (m.bloco && m.bloco.w < m.area.inner - 2)
          detail.push(tag + ": painel com " + m.bloco.w + "px numa área útil de " + m.area.inner + "px");
        /* nenhum filho encolhido a menos de 60% do painel, exceto o texto do
           estado vazio (limitado por legibilidade) e o botão */
        (m.filhos || []).forEach(f => {
          if (/ux-micro|btn2|ux-ctxactions|ux-tgt-disc/.test(f.cls)) return;
          if (f.w < m.bloco.inner * 0.6)
            detail.push(tag + ": '" + f.cls + "' com " + f.w + "px num painel útil de " + m.bloco.inner + "px (card estreito preso à esquerda)");
        });
        if (m.tabela && m.tabela.w < m.bloco.inner - 2)
          detail.push(tag + ": tabela Atual × Alvo com " + m.tabela.w + "px num painel útil de " + m.bloco.inner + "px");
        /* legibilidade preservada no estado vazio */
        if (m.micro) {
          if (m.micro.px < 14) detail.push(tag + ": texto do estado vazio com " + m.micro.px + "px");
          if (m.micro.w > m.micro.px * 40)
            detail.push(tag + ": comprimento de linha do estado vazio acima do confortável (" + m.micro.w + "px)");
        }
      } finally { await pg.close(); }
    }
  }
  evidence("P52-TGT3-alvo.json", observed);
  T("P52-TGT3", "o painel do cenário-alvo ocupa a área de conteúdo nos dois estados, com legibilidade preservada", !detail.length, detail);
}

/* declara contexto tecnológico pelo editor REAL — é o único caminho que faz o
   produto sair do modo legado e montar os cards de apoio da Camada V3.2. */
async function p52DeclaraContexto(pg) {
  await pg.click("#v32cta");
  await pg.evaluate(() => {
    const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
    ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
      const s = document.getElementById("v32-pres-" + c);
      if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
    });
  });
  await pg.click("#v32save");
  await pg.waitForTimeout(350);
}

/* ============================== P52-ICON3 ============================== */
async function icon3(browser, errs) {
  const detail = [], observed = {};
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg.on("pageerror", e => errs.push("P52-ICON3: " + String(e.message)));
  try {
    await pg.goto(HTML_URL);
    /* TRÊS páginas, porque as superfícies vivem em condições diferentes e o
       gate não pode fingir que vivem na mesma:
         (1) contexto DECLARADO → cards de apoio da Camada V3.2 (`.v32-icon`);
         (2) contexto NÃO informado + gaps → "Pode fazer sentido — após validação";
         (3) contexto NÃO informado + práticas maduras → "Não priorizados".
       As listas (2) e (3) pertencem à superfície de recomendação legada, que é
       deliberadamente ocultada quando o contexto é declarado — medi-las com
       contexto seria medir um bloco `display:none` e chamar isso de aprovação. */
    await toResults(pg, { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities });
    await p52DeclaraContexto(pg);
    await pg.waitForTimeout(200);
    /* (1) ocupação óptica do `.v32-icon`, medida em PIXEL sobre o artwork e a
           escala realmente aplicada pelo CSS. */
    const m = await pg.evaluate(async () => {
      const out = [];
      const imgs = Array.from(document.querySelectorAll("#app img.v32-icon"));
      const vistos = {};
      for (const img of imgs) {
        const key = img.getAttribute("data-icon") || "(sem chave)";
        if (vistos[key]) continue; vistos[key] = 1;
        const cs = getComputedStyle(img);
        const r = img.getBoundingClientRect();
        const bmp = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = img.getAttribute("src"); });
        if (!bmp) { out.push({ key, erro: "artwork não carregou" }); continue; }
        const S = 192, c = document.createElement("canvas"); c.width = S; c.height = S;
        const x = c.getContext("2d");
        const sc = Math.min(S / bmp.width, S / bmp.height);
        x.clearRect(0, 0, S, S);
        x.drawImage(bmp, (S - bmp.width * sc) / 2, (S - bmp.height * sc) / 2, bmp.width * sc, bmp.height * sc);
        const d = x.getImageData(0, 0, S, S).data;
        let a = S, b = S, cc = -1, dd = -1;
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++)
          if (d[(yy * S + xx) * 4 + 3] > 16) { if (xx < a) a = xx; if (xx > cc) cc = xx; if (yy < b) b = yy; if (yy > dd) dd = yy; }
        if (cc < 0) { out.push({ key, erro: "artwork sem tinta" }); continue; }
        const fw = (cc - a + 1) / S, fh = (dd - b + 1) / S;
        const mt = new DOMMatrixReadOnly(cs.transform);
        const escala = +Math.sqrt(Math.abs(mt.a * mt.d - mt.b * mt.c)).toFixed(4) || 1;
        out.push({ key, objectFit: cs.objectFit, escala: escala,
          fw: +fw.toFixed(4), fh: +fh.toFixed(4),
          aparente: +(Math.max(fw, fh) * escala).toFixed(4),
          largura: +(fw * escala).toFixed(4), altura: +(fh * escala).toFixed(4),
          /* caixa de LAYOUT: a normalização óptica é `transform`, e transform
             não pode ser lido como "tile de tamanho diferente". A caixa pintada
             fica registrada à parte, para diagnóstico. */
          caixa: [img.offsetWidth, img.offsetHeight],
          caixaPintada: [Math.round(r.width), Math.round(r.height)] });
      }
      return out;
    });
    const bons = m.filter(x => !x.erro);
    observed.v32icon = m;
    m.filter(x => x.erro).forEach(x => detail.push("v32-icon " + x.key + ": " + x.erro));
    if (bons.length < 3) detail.push("apenas " + bons.length + " ícone(s) do sistema V3.2 medido(s) — sensor cego");
    bons.forEach(x => {
      if (x.objectFit !== "contain") detail.push("v32-icon " + x.key + ": object-fit=" + x.objectFit);
      if (x.aparente < 0.84 || x.aparente > 0.92)
        detail.push("v32-icon " + x.key + ": ocupação aparente " + (x.aparente * 100).toFixed(1) + "% (faixa 84–92%)");
      if (x.largura > 0.97 || x.altura > 0.97)
        detail.push("v32-icon " + x.key + ": glifo encostando na borda (" + (x.largura * 100).toFixed(0) + "×" + (x.altura * 100).toFixed(0) + "%)");
      if (Math.abs(x.caixa[0] - x.caixa[1]) > 1)
        detail.push("v32-icon " + x.key + ": caixa não quadrada " + x.caixa.join("×"));
    });
    const caixas = Array.from(new Set(bons.map(x => x.caixa.join("x"))));
    if (caixas.length > 1) detail.push("v32-icon com caixas externas diferentes: " + caixas.join(", "));

  } finally { await pg.close(); }

  /* (2) §6.6 · ícone REALMENTE PINTADO em "Pode fazer sentido — após validação".
         A prova é de TINTA, não de presença no DOM. */
  const pgL = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pgL.on("pageerror", e => errs.push("P52-ICON3/t2: " + String(e.message)));
  try {
    await pgL.goto(HTML_URL);
    await toResults(pgL, { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities });
    await pgL.waitForTimeout(200);
    const listas = await pgL.evaluate(async () => {
      const seen = e => { const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const itens = Array.from(document.querySelectorAll(".t-list .t-item, .t-details .t-item"));
      const out = [];
      for (const it of itens) {
        const nome = it.querySelector("b") ? (it.querySelector("b").textContent || "").trim() : null;
        const img = it.querySelector(".icon-tile img");
        let tinta = null;
        if (img && seen(img)) {
          const bmp = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = img.getAttribute("src"); });
          if (bmp) {
            const S = 96, c = document.createElement("canvas"); c.width = S; c.height = S;
            const x = c.getContext("2d");
            const sc = Math.min(S / bmp.width, S / bmp.height);
            x.clearRect(0, 0, S, S);
            x.drawImage(bmp, (S - bmp.width * sc) / 2, (S - bmp.height * sc) / 2, bmp.width * sc, bmp.height * sc);
            const d = x.getImageData(0, 0, S, S).data;
            let n = 0; for (let k = 3; k < d.length; k += 4) if (d[k] > 16) n++;
            tinta = +(100 * n / (S * S)).toFixed(2);
          }
        }
        out.push({
          lista: it.closest(".t-details") ? "não priorizados" : "pode fazer sentido",
          nome: nome,
          marcado: it.getAttribute("data-p52-titem"),
          temTile: !!img, visivel: !!(img && seen(img)),
          /* a caixa comparável é a de LAYOUT: `transform: scale()` normaliza a
             tinta e não deve ser lido como "tamanho diferente de tile". */
          caixa: img ? [img.offsetWidth, img.offsetHeight] : null,
          tile: img && img.closest(".icon-tile")
            ? [img.closest(".icon-tile").offsetWidth, img.closest(".icon-tile").offsetHeight] : null,
          tinta: tinta,
          textoRestante: (it.textContent || "").replace(/\s+/g, " ").trim().length,
          link: !!it.querySelector("a")
        });
      }
      return out;
    });
    observed.listasSecundarias = listas;
    if (!listas.length) detail.push("nenhum item nas listas secundárias — sensor cego");
    const porLista = {};
    listas.forEach(l => { porLista[l.lista] = (porLista[l.lista] || 0) + 1; });
    if (!porLista["pode fazer sentido"])
      detail.push("a lista 'Pode fazer sentido — após validação' não foi exercitada — sensor cego");
    listas.forEach(l => {
      if (l.marcado === "no-icon") return;         /* solução sem entrada no catálogo congelado */
      if (!l.temTile) detail.push(l.lista + " · " + l.nome + ": sem tile de ícone");
      else if (!l.visivel) detail.push(l.lista + " · " + l.nome + ": tile presente no DOM mas não pintado");
      else if (l.tinta === null || l.tinta < 5)
        detail.push(l.lista + " · " + l.nome + ": artwork sem tinta materialmente pintada (" + l.tinta + "%)");
      if (l.caixa && (l.caixa[0] < 24 || Math.abs(l.caixa[0] - l.caixa[1]) > 1))
        detail.push(l.lista + " · " + l.nome + ": caixa do ícone " + l.caixa.join("×"));
      if (l.textoRestante < 40)
        detail.push(l.lista + " · " + l.nome + ": o texto explicativo se perdeu (" + l.textoRestante + " caracteres)");
    });
    /* escala e alinhamento iguais aos das recomendações principais */
    const caixasT = Array.from(new Set(listas.filter(l => l.caixa).map(l => l.caixa.join("x"))));
    if (caixasT.length > 1) detail.push("listas secundárias com caixas de ícone diferentes: " + caixasT.join(", "));
    const tilesT = Array.from(new Set(listas.filter(l => l.tile).map(l => l.tile.join("x"))));
    if (tilesT.length > 1) detail.push("listas secundárias com tiles diferentes: " + tilesT.join(", "));
  } finally { await pgL.close(); }

  /* segunda fixture: todas as práticas maduras ⇒ nenhum gap ⇒ é aqui que
     "Não priorizados neste screening" existe. */
  const pg3 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pg3.on("pageerror", e => errs.push("P52-ICON3/t3: " + String(e.message)));
  try {
    await pg3.goto(HTML_URL);
    await toResults(pg3, { vec: new Array(15).fill(2) });
    await pg3.evaluate(() => { document.querySelectorAll("details.t-details").forEach(d => { d.open = true; }); });
    await pg3.waitForTimeout(200);
    const t3 = await pg3.evaluate(async () => {
      const seen = e => { const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const itens = Array.from(document.querySelectorAll(".t-details .t-item"));
      const out = [];
      for (const it of itens) {
        const img = it.querySelector(".icon-tile img");
        let tinta = null;
        if (img && seen(img)) {
          const bmp = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = img.getAttribute("src"); });
          if (bmp) {
            const S = 96, c = document.createElement("canvas"); c.width = S; c.height = S;
            const x = c.getContext("2d");
            const sc = Math.min(S / bmp.width, S / bmp.height);
            x.clearRect(0, 0, S, S);
            x.drawImage(bmp, (S - bmp.width * sc) / 2, (S - bmp.height * sc) / 2, bmp.width * sc, bmp.height * sc);
            const d = x.getImageData(0, 0, S, S).data;
            let n = 0; for (let k = 3; k < d.length; k += 4) if (d[k] > 16) n++;
            tinta = +(100 * n / (S * S)).toFixed(2);
          }
        }
        out.push({
          nome: it.querySelector("b") ? (it.querySelector("b").textContent || "").trim() : null,
          marcado: it.getAttribute("data-p52-titem"),
          visivel: !!(img && seen(img)), tinta: tinta,
          tile: img && img.closest(".icon-tile") ? [img.closest(".icon-tile").offsetWidth, img.closest(".icon-tile").offsetHeight] : null,
          textoRestante: (it.textContent || "").replace(/\s+/g, " ").trim().length
        });
      }
      return out;
    });
    observed.naoPriorizados = t3;
    if (!t3.length) detail.push("'Não priorizados neste screening' não foi exercitado — sensor cego");
    t3.forEach(l => {
      if (l.marcado === "no-icon") return;
      if (!l.visivel) detail.push("não priorizados · " + l.nome + ": ícone ausente ou não pintado");
      else if (l.tinta === null || l.tinta < 5)
        detail.push("não priorizados · " + l.nome + ": artwork sem tinta materialmente pintada (" + l.tinta + "%)");
      if (l.textoRestante < 40)
        detail.push("não priorizados · " + l.nome + ": o texto de não priorização se perdeu");
    });
    const tiles3 = Array.from(new Set(t3.filter(l => l.tile).map(l => l.tile.join("x"))));
    if (tiles3.length > 1) detail.push("'Não priorizados' com tiles diferentes: " + tiles3.join(", "));
  } finally { await pg3.close(); }
  evidence("P52-ICON3-otica.json", observed);
  T("P52-ICON3", "ocupação óptica uniforme do ícone V3.2 e ícones materialmente pintados em 'Pode fazer sentido' e 'Não priorizados'", !detail.length, detail);
}


/* ==========================================================================
   P52-TGT4 · ERRATA FINAL · ALTO-1 — A COMPARAÇÃO É INDIVISÍVEL

   Reprovação funcional do parecer independente
   70904c113096d9a95617a80daf9eb7df28d27c1a0e0837f510fbffaa53b04120 (§10 ALTO-1):
   a coluna Alvo de "Perfil atual × Cenário-alvo" respondia ao SEU próprio gate.
   Com o gate canônico FECHADO e alvos declarados em quantidade suficiente, a
   comparação publicava cinco scores por domínio, um agregado e um NOME DE
   ESTÁGIO DE MATURIDADE, em tela e no papel, com polígono materialmente
   pintado no PDF — e negava tudo isso, na mesma página, duas linhas abaixo.

   Este gate mede as QUATRO superfícies numa passada só, nos quatro quadrantes
   exigidos, e nunca por presença no DOM:
     · tela           — visibilidade COMPUTADA (getComputedStyle + caixas)
     · acessibilidade — texto que um AT alcança, excluída a lista de práticas
                        declaradas, que é conteúdo autorizado sob gate fechado
     · papel          — DOM projetado com visibilidade computada
     · PDF A4 real    — texto extraído por página E TINTA RASTERIZADA da cor
                        exclusiva do alvo (#3CB17E)

   Oráculo INDEPENDENTE: `FX52.p52ComparisonOracle()`, que recalcula os dois
   perfis a partir do vetor e dos alvos sem chamar `computeTargetProfile()`,
   `tgtPublishable()` nem `publishableStats()`.
   ========================================================================== */

/* tinta de uma COR na página rasterizada — PPM P6 é cabeçalho ASCII + bytes */
function p52PdfColorInk(file, pagina, alvo, tol) {
  const dir = fs.mkdtempSync(path.join(require("os").tmpdir(), "p52ink-"));
  try {
    p52exec("pdftoppm", ["-r", "110", "-f", String(pagina), "-l", String(pagina), file, path.join(dir, "c")]);
    const arq = fs.readdirSync(dir).filter(f => /\.ppm$/.test(f))[0];
    if (!arq) return null;
    const b = fs.readFileSync(path.join(dir, arq));
    const esp = c => c === 32 || c === 10 || c === 13 || c === 9;
    let i = 2, campos = [];
    while (campos.length < 3 && i < b.length) {
      while (i < b.length && esp(b[i])) i++;
      if (b[i] === 35) { while (i < b.length && b[i] !== 10) i++; continue; }   /* comentário */
      let t = "";
      while (i < b.length && !esp(b[i])) { t += String.fromCharCode(b[i]); i++; }
      campos.push(+t);
    }
    i++;
    const W = campos[0], H = campos[1];
    let n = 0, total = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const o = i + (y * W + x) * 3;
      total++;
      if (Math.abs(b[o] - alvo[0]) <= tol && Math.abs(b[o + 1] - alvo[1]) <= tol && Math.abs(b[o + 2] - alvo[2]) <= tol) n++;
    }
    return { px: n, amostras: total, w: W, h: H };
  } catch (e) { return null; }
  finally { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* temporário */ } }
}

const P52_TGT_GREEN = [60, 177, 126];                  /* #3CB17E — encoding exclusivo do alvo */
const P52_ESTAGIOS = /Inexistente|Inicial|Definido|Gerenciado|Otimiz/i;
const P52_NUM = /\d[.,]\d/;

async function tgt4(browser, errs) {
  const detail = [], observed = {};
  if (!p52Poppler()) {
    T("P52-TGT4", "Perfil atual × Cenário-alvo é indivisível: nenhuma metade publica sob gate canônico fechado", false,
      ["poppler-utils (pdftotext/pdftoppm) ausente: a prova de papel NÃO foi executada"]);
    return;
  }
  /* Os quatro quadrantes do §6 da errata. O caso B é o que faltava: é o único
     em que o vetor efetivo do ALVO é suficiente enquanto o ATUAL não é. */
  const CASOS = [
    { id: "A", nome: "atual insuficiente × alvo insuficiente",
      vec: FX52.P52_F4.vec, targets: { "governance": 3 }, publica: false },
    { id: "B", nome: "atual insuficiente × alvo SUFICIENTE",
      vec: FX52.P52_F4.vec, targets: FX52.P52_F4.targets, publica: false },
    { id: "C", nome: "atual suficiente × alvo suficiente",
      vec: FX52.P52_F2.vec, targets: FX52.P52_F2.targets, publica: true },
    { id: "D", nome: "atual suficiente, sem alterações de alvo",
      vec: FX52.P52_F1.vec, targets: null, publica: "sem-secao" }
  ];

  for (const caso of CASOS) {
    const or = FX52.p52ComparisonOracle(caso.vec, caso.targets);
    const tag = "caso " + caso.id;
    /* GUARDA DE NÃO-VACUIDADE: o cenário tem de ser materialmente o declarado. */
    if (caso.id === "A" && !(or.atual.suff === false && or.alvo.suff === false))
      detail.push(tag + ": cenário não é 'atual insuficiente × alvo insuficiente'");
    if (caso.id === "B" && !(or.atual.suff === false && or.alvo.suff === true && or.alvo.overall !== null))
      detail.push(tag + ": cenário não é 'atual insuficiente × alvo SUFICIENTE' — o gate seria vacuoso");
    if (caso.id === "C" && !(or.atual.suff === true && or.alvo.suff === true))
      detail.push(tag + ": cenário não é 'atual suficiente × alvo suficiente'");
    if (caso.publica === "sem-secao" && !(or.atual.suff === true && or.overrides === 0))
      detail.push(tag + ": cenário não é 'atual suficiente, sem alterações de alvo'");
    if (caso.publica !== "sem-secao" && or.publicavel !== caso.publica)
      detail.push(tag + ": oráculo diverge do quadrante declarado");

    const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    pg.on("pageerror", e => errs.push("P52-TGT4/" + caso.id + ": " + String(e.message)));
    try {
      await pg.goto(HTML_URL);
      await pg.evaluate(([qids, vec, targets]) => {
        window.__DEV.setArq(0);
        qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
        if (targets) Object.keys(targets).forEach(q => {
          if (window.__DEV.setTarget(q, targets[q]) !== true)
            throw new Error("setTarget canônico recusou " + q);
        });
        window.__DEV.showResults();
      }, [FX50.P50_QIDS, caso.vec, caso.targets]);
      await pg.waitForTimeout(150);
      await p52DeclaraContexto(pg);

      /* estado canônico ANTES de qualquer impressão */
      const snapAntes = await pg.evaluate(() => window.__DEV.legacySnapshot() +
        "|" + JSON.stringify(window.__DEV.TARGET.overrides));

      /* ------------------------------ TELA ------------------------------ */
      const tela = await pg.evaluate(() => {
        const vis = e => {
          if (!e) return false;
          for (let n = e; n && n !== document.body; n = n.parentElement) {
            const c = getComputedStyle(n);
            if (c.display === "none" || c.visibility === "hidden" || Number(c.opacity) === 0) return false;
          }
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const lim = e => e ? (e.textContent || "").replace(/\s+/g, " ").trim() : null;
        const sec = document.getElementById("ux-tgt-cmp");
        const ov = document.querySelector(".ux-target-shape");
        /* árvore acessível DA COMPARAÇÃO: a lista de práticas-alvo declaradas
           é conteúdo autorizado sob gate fechado e não entra na medida. */
        const raiz = document.getElementById("ux-target");
        const ovs = raiz ? raiz.querySelector(".ux-tgt-ovs") : null;
        let ax = "";
        (function walk(n) {
          if (!n) return;
          if (n.nodeType === 3) { const t = (n.textContent || "").trim(); if (t) ax += " " + t; return; }
          if (n.nodeType !== 1 || n === ovs) return;
          const cs = getComputedStyle(n);
          if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
          if (n.getAttribute("aria-hidden") === "true") return;
          const al = n.getAttribute("aria-label"); if (al) ax += " " + al;
          Array.from(n.childNodes).forEach(walk);
        })(raiz);
        return {
          secVis: vis(sec),
          kpiAtual: lim(document.querySelector(".ux-tgt-kpi")),
          kpiAlvo: lim(document.querySelector(".ux-tgt-kpi-t")),
          linhas: Array.from(document.querySelectorAll(".ux-tgt-table tr"))
            .map(tr => Array.from(tr.children).map(td => (td.textContent || "").replace(/\s+/g, " ").trim())),
          tabelaVis: vis(document.querySelector(".ux-tgt-table")),
          nota: lim(document.querySelector('[data-p52-nopub="target"]')),
          notaVis: vis(document.querySelector('[data-p52-nopub="target"]')),
          overlayPts: ov ? ((ov.getAttribute("points") || "").trim() ? ov.getAttribute("points").trim().split(/\s+/).length : 0) : -1,
          overlayVis: vis(ov),
          radarAria: (document.querySelector("svg.radar") || {}).getAttribute
            ? document.querySelector("svg.radar").getAttribute("aria-label") : null,
          ax: ax.replace(/\s+/g, " ").trim(),
          praticasDeclaradas: document.querySelectorAll(".ux-tgt-ov").length,
          /* Camada 5 · a MESMA comparação, na superfície de resultados */
          camada5: {
            alvoMarks: document.querySelectorAll('#p50-results [data-p50="ct-target"]').length,
            gapMarks: document.querySelectorAll('#p50-results [data-p50="ct-gap"]').length,
            attrs: Array.from(document.querySelectorAll('#p50-results [data-p50="ct-row"]'))
              .map(r => r.getAttribute("data-p50-target")).filter(v => v !== null).length
          },
          /* régua da jornada · publicação de ESTÁGIO do alvo */
          jornadaAlvo: document.querySelectorAll('[data-jn-target="true"]').length
        };
      });

      /* ------------------------------ PAPEL ----------------------------- */
      await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
      await pg.emulateMedia({ media: "print" });
      await pg.waitForTimeout(200);
      const papel = await pg.evaluate(() => {
        const sec = document.getElementById("pr-target");
        if (!sec) return { sem: true };
        const vis = e => {
          if (!e) return false;
          for (let n = e; n && n !== document.body; n = n.parentElement) {
            const c = getComputedStyle(n);
            if (c.display === "none" || c.visibility === "hidden" || Number(c.opacity) === 0) return false;
          }
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const np = p => { const s = p && (p.getAttribute("points") || "").trim(); return s ? s.split(/\s+/).length : 0; };
        const polys = Array.from(sec.querySelectorAll("svg.pr-radar polygon"));
        return {
          sem: false, secVis: vis(sec),
          kpis: Array.from(sec.querySelectorAll(".pr-kpi")).map(k => (k.textContent || "").replace(/\s+/g, " ").trim()),
          linhas: Array.from(sec.querySelectorAll(".pr-doms tr"))
            .map(tr => Array.from(tr.children).map(td => (td.textContent || "").replace(/\s+/g, " ").trim())),
          tgtPts: np(polys.find(p => p.getAttribute("stroke") === "#3CB17E")),
          tgtDash: !!(polys.find(p => p.getAttribute("stroke") === "#3CB17E") || {}).getAttribute
            && !!polys.find(p => p.getAttribute("stroke") === "#3CB17E").getAttribute("stroke-dasharray"),
          curPts: np(polys.find(p => p.getAttribute("stroke") === "#307FE2")),
          nota: (function () { const n = sec.querySelector('[data-pr-nopub="target"]'); return n ? (n.textContent || "").replace(/\s+/g, " ").trim() : null; })(),
          praticas: sec.querySelectorAll(".pr-card").length
        };
      });

      /* ------------------------------ PDF A4 ---------------------------- */
      const dir = NO_EVIDENCE ? PDF_TMP : PDF_DIR;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, "P52-TGT4-" + caso.id + ".pdf");
      await pg.pdf({ path: file, format: "A4", printBackground: true, scale: 1,
        margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" }, displayHeaderFooter: false });
      await pg.emulateMedia({ media: null });
      await pg.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      const snapDepois = await pg.evaluate(() => window.__DEV.legacySnapshot() +
        "|" + JSON.stringify(window.__DEV.TARGET.overrides));

      const paginas = p52PdfWords(file);
      const idxBloco = paginas.findIndex(p => /Perfil atual/.test(p.texto) && /Cen[áa]rio-alvo/.test(p.texto));
      /* recorte do bloco: da âncora até o disclaimer metodológico */
      let blocoTexto = "";
      if (idxBloco >= 0) {
        const t = paginas[idxBloco].texto;
        const ini = t.indexOf("Perfil atual");
        const fim = t.indexOf("A adoção de tecnologia");
        blocoTexto = t.slice(ini, fim > ini ? fim : undefined);
      }
      const tinta = idxBloco >= 0 ? p52PdfColorInk(file, idxBloco + 1, P52_TGT_GREEN, 28) : null;

      observed[caso.id] = { oraculo: { atualSuff: or.atual.suff, alvoSuff: or.alvo.suff,
        publicavel: or.publicavel, kpiAtual: or.kpiAtual, kpiAlvo: or.kpiAlvo,
        porDominio: or.porDominio },
        tela, papel, pdf: { paginas: paginas.length, paginaDoBloco: idxBloco + 1,
          verdePx: tinta ? tinta.px : null, blocoTexto: blocoTexto.slice(0, 400) } };

      /* --------------------------- VEREDITOS ---------------------------- */
      if (snapAntes !== snapDepois)
        detail.push(tag + ": estado canônico contaminado por render/impressão");

      if (caso.publica === "sem-secao") {
        if (!papel.sem) detail.push(tag + ": #pr-target existe sem cenário-alvo declarado");
        if (tela.secVis) detail.push(tag + ": comparação em tela existe sem cenário-alvo declarado");
        if (tinta && tinta.px > 0) detail.push(tag + ": " + tinta.px + "px de tinta do alvo sem cenário-alvo declarado");
        if (tela.overlayPts >= 0) detail.push(tag + ": overlay do alvo existe sem cenário-alvo declarado");
      } else if (caso.publica === false) {
        /* o cenário-alvo continua SALVO e editável — §5.2 */
        if (tela.praticasDeclaradas !== or.overrides)
          detail.push(tag + ": " + tela.praticasDeclaradas + " prática(s)-alvo listadas, " + or.overrides + " declaradas — o alvo não foi preservado");
        /* nada publicado, em nenhuma superfície */
        if (P52_NUM.test(tela.kpiAlvo || "")) detail.push(tag + " TELA: KPI do alvo publica score · '" + tela.kpiAlvo + "'");
        if (P52_ESTAGIOS.test(tela.kpiAlvo || "")) detail.push(tag + " TELA: KPI do alvo publica estágio · '" + tela.kpiAlvo + "'");
        if (P52_NUM.test(tela.kpiAtual || "")) detail.push(tag + " TELA: KPI atual publica score · '" + tela.kpiAtual + "'");
        if (P52_ESTAGIOS.test(tela.kpiAtual || "")) detail.push(tag + " TELA: KPI atual publica estágio · '" + tela.kpiAtual + "'");
        tela.linhas.forEach((l, i) => {
          if (l[1] !== "n/d") detail.push(tag + " TELA: domínio " + i + " publica atual '" + l[1] + "'");
          if (l[3] !== "n/d") detail.push(tag + " TELA: domínio " + i + " publica alvo '" + l[3] + "'");
          if (l[4] !== "n/d") detail.push(tag + " TELA: domínio " + i + " publica delta '" + l[4] + "'");
          if (l[2] !== "") detail.push(tag + " TELA: domínio " + i + " publica seta de comparação");
        });
        if (tela.linhas.length !== 5) detail.push(tag + " TELA: " + tela.linhas.length + " linhas de domínio (esperadas 5)");
        if (tela.overlayPts > 0) detail.push(tag + " TELA: overlay do alvo com " + tela.overlayPts + " vértices");
        if (/cen[áa]rio-alvo/i.test(tela.radarAria || "")) detail.push(tag + " TELA: radar anuncia cenário-alvo no nome acessível");
        if (tela.camada5.alvoMarks) detail.push(tag + " CAMADA 5: " + tela.camada5.alvoMarks + " marcador(es) 'alvo' por domínio");
        if (tela.camada5.gapMarks) detail.push(tag + " CAMADA 5: " + tela.camada5.gapMarks + " gap(s) por domínio");
        if (tela.camada5.attrs) detail.push(tag + " CAMADA 5: " + tela.camada5.attrs + " atributo(s) data-p50-target");
        if (tela.jornadaAlvo) detail.push(tag + " JORNADA: marcador de estágio do cenário-alvo na régua");
        if (P52_NUM.test(tela.ax) && P52_ESTAGIOS.test(tela.ax))
          detail.push(tag + " A11Y: score e estágio do alvo alcançáveis na árvore acessível da comparação");
        /* mensagem neutra e honesta — e nada de alegação contraditória */
        if (!/cen[áa]rio-alvo está salvo/i.test(tela.nota || ""))
          detail.push(tag + " TELA: mensagem neutra ausente · '" + (tela.nota || "") + "'");
        if (!tela.notaVis) detail.push(tag + " TELA: mensagem neutra presente mas não visível");
        if (/previs[ãa]o|resultado validado|score validado/i.test(tela.nota || ""))
          detail.push(tag + " TELA: a mensagem apresenta o alvo como previsão ou resultado");
        if (papel.sem) { detail.push(tag + " PAPEL: seção da comparação ausente com cenário-alvo declarado"); }
        else {
          const kpiAlvoP = (papel.kpis || []).find(x => /Cen[áa]rio-alvo/.test(x)) || "";
          const kpiAtualP = (papel.kpis || []).find(x => /Atual/.test(x)) || "";
          if (P52_NUM.test(kpiAlvoP)) detail.push(tag + " PAPEL: KPI do alvo publica score · '" + kpiAlvoP + "'");
          if (P52_ESTAGIOS.test(kpiAlvoP)) detail.push(tag + " PAPEL: KPI do alvo publica estágio · '" + kpiAlvoP + "'");
          if (P52_NUM.test(kpiAtualP)) detail.push(tag + " PAPEL: KPI atual publica score · '" + kpiAtualP + "'");
          papel.linhas.forEach((l, i) => {
            if (l[1] !== "n/d") detail.push(tag + " PAPEL: domínio " + i + " publica atual '" + l[1] + "'");
            if (l[3] !== "n/d") detail.push(tag + " PAPEL: domínio " + i + " publica alvo '" + l[3] + "'");
            if (l[4] !== "n/d") detail.push(tag + " PAPEL: domínio " + i + " publica delta '" + l[4] + "'");
            if (l[2] !== "") detail.push(tag + " PAPEL: domínio " + i + " publica seta de comparação");
          });
          if (papel.tgtPts > 0) detail.push(tag + " PAPEL: polígono do alvo com " + papel.tgtPts + " vértices");
          if (papel.curPts > 0) detail.push(tag + " PAPEL: polígono atual com " + papel.curPts + " vértices");
          if (!/cen[áa]rio-alvo está salvo/i.test(papel.nota || ""))
            detail.push(tag + " PAPEL: mensagem neutra ausente · '" + (papel.nota || "") + "'");
          if (papel.praticas < or.overrides)
            detail.push(tag + " PAPEL: " + papel.praticas + " cartões de prática-alvo, " + or.overrides + " declaradas");
        }
        if (idxBloco < 0) detail.push(tag + " PDF: bloco Atual × Alvo não encontrado — sensor cego");
        else {
          if (P52_NUM.test(blocoTexto)) detail.push(tag + " PDF-TEXTO: número publicado no bloco · '" + blocoTexto.replace(/\s+/g, " ").slice(0, 120) + "'");
          if (P52_ESTAGIOS.test(blocoTexto)) detail.push(tag + " PDF-TEXTO: nome de estágio publicado no bloco");
          if (!/n\/d/.test(blocoTexto)) detail.push(tag + " PDF-TEXTO: rótulo canônico 'n/d' ausente do bloco");
          if (!tinta) detail.push(tag + " PDF: rasterização da página do bloco falhou — prova não executada");
          else if (tinta.px > 0) detail.push(tag + " PDF-TINTA: " + tinta.px + "px de #3CB17E (cor exclusiva do alvo) na página do bloco");
        }
      } else {
        /* CONTROLE POSITIVO — a comparação completa e CORRETA continua existindo */
        if (papel.sem) { detail.push(tag + ": #pr-target ausente sob gate aberto"); }
        if (!tela.secVis) detail.push(tag + ": comparação em tela não visível sob gate aberto");
        if (!P52_NUM.test(tela.kpiAlvo || "")) detail.push(tag + " CONTROLE: KPI do alvo sem score · '" + tela.kpiAlvo + "'");
        if (!P52_ESTAGIOS.test(tela.kpiAlvo || "")) detail.push(tag + " CONTROLE: KPI do alvo sem estágio · '" + tela.kpiAlvo + "'");
        if (tela.overlayPts !== 5) detail.push(tag + " CONTROLE: overlay de tela com " + tela.overlayPts + " vértices (esperado 5)");
        if (papel.tgtPts !== 5) detail.push(tag + " CONTROLE: polígono do alvo com " + papel.tgtPts + " vértices (esperado 5)");
        if (papel.curPts !== 5) detail.push(tag + " CONTROLE: polígono atual com " + papel.curPts + " vértices (esperado 5)");
        if (!papel.tgtDash) detail.push(tag + " CONTROLE: encoding tracejado exclusivo do alvo ausente");
        if (tinta && tinta.px === 0) detail.push(tag + " CONTROLE: nenhuma tinta #3CB17E do alvo na página do bloco");
        if (tela.nota) detail.push(tag + " CONTROLE: nota de gate fechado presente sob gate ABERTO");
        /* cada número contra o oráculo independente, e tela = papel */
        or.porDominio.forEach((o, i) => {
          const l = tela.linhas[i] || [], p = (papel.linhas || [])[i] || [];
          const espC = o.atual === null ? "n/d" : o.atual.toFixed(1);
          const espT = o.alvo === null ? "n/d" : o.alvo.toFixed(1);
          const espG = o.gap === null ? "n/d" : ((o.gap >= 0 ? "+" : "") + o.gap.toFixed(1));
          if (l[1] !== espC) detail.push(tag + " ORÁCULO tela: domínio " + i + " atual '" + l[1] + "' != " + espC);
          if (l[3] !== espT) detail.push(tag + " ORÁCULO tela: domínio " + i + " alvo '" + l[3] + "' != " + espT);
          if (l[4] !== espG) detail.push(tag + " ORÁCULO tela: domínio " + i + " gap '" + l[4] + "' != " + espG);
          if (l[2] !== "→") detail.push(tag + " CONTROLE: domínio " + i + " sem seta de comparação sob gate aberto");
          if (p[1] !== l[1] || p[3] !== l[3] || p[4] !== l[4])
            detail.push(tag + " DIVERGÊNCIA tela×papel no domínio " + i + ": [" + l.slice(1).join(",") + "] vs [" + p.slice(1).join(",") + "]");
        });
        if (idxBloco < 0) detail.push(tag + " PDF: bloco Atual × Alvo não encontrado sob gate aberto");
        else or.porDominio.forEach((o, i) => {
          if (o.alvo !== null && blocoTexto.indexOf(o.alvo.toFixed(1)) < 0)
            detail.push(tag + " PDF-TEXTO: alvo " + o.alvo.toFixed(1) + " do domínio " + i + " ausente do papel");
        });
      }
    } finally { await pg.close(); }
  }
  evidence("P52-TGT4-comparacao-indivisivel.json", observed);
  T("P52-TGT4",
    "Perfil atual × Cenário-alvo é indivisível: sob gate canônico fechado nenhuma metade publica score, estágio, valor por domínio, delta, seta, polígono ou tinta — em tela, acessibilidade, papel e PDF — e sob gate aberto a comparação volta completa e correta",
    !detail.length, detail);
}

/* ============================== execução ============================== */
(async () => {
  const errs = [];
  const browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
  try {
    if (shouldRun("P52-LAY1")) await lay1(browser, errs);
    if (shouldRun("P52-LAY2")) await lay2(browser, errs);
    if (shouldRun("P52-LAY3")) await lay3(browser, errs);
    if (shouldRun("P52-GATE1v")) await gate1v(browser, errs);
    if (shouldRun("P52-HOME1")) await home1(browser, errs);
    if (shouldRun("P52-REF1")) await ref1(browser, errs);
    if (shouldRun("P52-EXEC1")) await exec1(browser, errs);
    if (shouldRun("P52-EXEC2")) await exec2(browser, errs);
    if (shouldRun("P52-HELP1")) await help1(browser, errs);
    if (shouldRun("P52-ICON2")) await icon2(browser, errs);
    if (shouldRun("P52-PR2")) await pr2(browser, errs);
    if (shouldRun("P52-DOM3")) await dom3(browser, errs);
    if (shouldRun("P52-SUP3")) await sup3(browser, errs);
    if (shouldRun("P52-PDF1") || shouldRun("P52-PDF2") || shouldRun("P52-PDF3") ||
        shouldRun("P52-PDF4") || shouldRun("P52-PDF5") || shouldRun("P52-PDF6") ||
        shouldRun("P52-PDF7") || shouldRun("P52-PDF8") || shouldRun("P52-PDF9")) await pdfGates(browser, errs);
    if (shouldRun("P52-NAV1")) await nav1(browser, errs);
    if (shouldRun("P52-ICON1")) await icon1(browser, errs);
    if (shouldRun("P52-DOM1c")) await dom1c(browser, errs);
    if (shouldRun("P52-GAP1v")) await gap1v(browser, errs);
    if (shouldRun("P52-REC1g")) await rec1g(browser, errs);
    if (shouldRun("P52-CTX1v")) await ctx1v(browser, errs);
    if (shouldRun("P52-PR1")) await pr1(browser, errs);
    if (shouldRun("P52-ACC1")) await acc1(browser, errs);
    if (shouldRun("P52-ACC2")) await acc2(browser, errs);
    if (shouldRun("P52-UW1")) await uw1(browser, errs);
    if (shouldRun("P52-UW2")) await uw2(browser, errs);
    if (shouldRun("P52-UW3")) await uw3(browser, errs);
    if (shouldRun("P52-POP1")) await pop1(browser, errs);
    if (shouldRun("P52-POP2")) await pop2(browser, errs);
    /* gates novos da errata da auditoria externa */
    if (shouldRun("P52-ACC3")) await acc3(browser, errs);
    if (shouldRun("P52-HELP2")) await help2(browser, errs);
    if (shouldRun("P52-SIG1")) await sig1(browser, errs);
    if (shouldRun("P52-ADV1")) await adv1(browser, errs);
    if (shouldRun("P52-TGT3")) await tgt3(browser, errs);
    /* gate novo da ERRATA FINAL · ALTO-1 */
    if (shouldRun("P52-TGT4")) await tgt4(browser, errs);
    if (shouldRun("P52-ICON3")) await icon3(browser, errs);
  } finally {
    await browser.close();
    try { fs.rmSync(PDF_TMP, { recursive: true, force: true }); } catch (e) { /* temporário */ }
  }
  T("P52-ERR0", "nenhum erro de página ou console durante a bateria", !errs.length, errs.slice(0, 6));
  const pass = results.filter(r => r.ok).length;
  const fail = results.length - pass;
  console.log("\nP52 CHROMIUM (Phase 5.2): " + pass + " PASS · " + fail + " FAIL de " + results.length);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("P52 CHROMIUM: falha fatal —", e && e.stack || e); process.exit(1); });
