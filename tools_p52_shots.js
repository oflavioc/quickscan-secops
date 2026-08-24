/* ============================================================================
   GERADOR DE EVIDÊNCIA VISUAL · PHASE 5.2 · Etapa A
   Produz o acervo de screenshots da UAT em `docs_phase5/evidence_p52/` e o
   índice `INDEX.md`. Não é gate: não afirma PASS nem FAIL, apenas fotografa a
   candidata nas viewports obrigatórias (§14.2) e nas cenas exigidas (§15).
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const { chromium } = require("@playwright/test");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");

const HERE = __dirname;
const URL = "file://" + path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const OUT = path.join(HERE, "docs_phase5", "evidence_p52");
fs.mkdirSync(OUT, { recursive: true });

/* ERRATA DA AUDITORIA EXTERNA · §8.3 · a lista obrigatória passa a incluir
   768×1024 e 1024×768 (tablets), que faltavam ao acervo. */
const VIEWPORTS = [
  { w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 },
  { w: 3440, h: 1440 }, { w: 390, h: 844 },
  { w: 768, h: 1024 }, { w: 1024, h: 768 }
];

function resolveBrowser() {
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { executablePath: explicit };
  if (fs.existsSync(local)) return { executablePath: local };
  return {};
}
async function results(pg, fx) {
  await pg.evaluate(([qids, vec, prios, targets]) => {
    window.__DEV.setArq(0);
    qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
    if (targets) Object.keys(targets).forEach(k => window.__DEV.setTarget(k, targets[k]));
    if (prios) window.__DEV.setPriorities(prios);
    window.__DEV.showResults();
  }, [FX50.P50_QIDS, fx.vec, fx.priorities || null, fx.targets || null]);
  await pg.waitForTimeout(280);
}
async function question(pg, k, opts) {
  await pg.evaluate(([qids, kk]) => {
    window.__DEV.setArq(0);
    qids.forEach(id => window.__DEV.setAnswerById(id, 1));
    window.__DEV.gotoStep(kk);
  }, [FX50.P50_QIDS, k]);
  await pg.waitForTimeout(220);
  if (opts && opts.map !== undefined) {
    const want = opts.map ? "false" : "true";
    await pg.evaluate(w => {
      const sh = document.getElementById("p50-shell");
      const t = document.querySelector('#p50-shell button[data-p50="sidebar-toggle"]');
      if (sh && t && sh.getAttribute("data-p50-collapsed") !== w) t.click();
    }, want);
    await pg.waitForTimeout(180);
  }
}
async function refbranch(pg) {
  await pg.evaluate(qids => {
    window.__DEV.setArq(0);
    qids.forEach(id => window.__DEV.setAnswerById(id, 1));
    window.__DEV.gotoStep(qids.length);
    document.getElementById("next").click();
  }, FX50.P50_QIDS);
  await pg.waitForTimeout(250);
}
async function ctxEditor(pg, region) {
  await results(pg, FX52.P52_F1);
  await pg.click("#v32cta");
  await pg.waitForTimeout(320);
  await pg.evaluate(k => {
    const r = document.querySelector('[data-p52="ctx-region"][data-p52-region="' + k + '"]');
    if (r) window.scrollTo(0, r.getBoundingClientRect().top + window.scrollY - 24);
  }, region);
  await pg.waitForTimeout(220);
}
async function scrollTo(pg, sel, off) {
  await pg.evaluate(([s, o]) => {
    const e = document.querySelector(s);
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - (o || 24));
  }, [sel, off || 24]);
  await pg.waitForTimeout(220);
}

const CENAS = [
  { id: "01-home", desc: "Home — hero 7+5 com o emblema dos cinco domínios",
    go: async pg => { await pg.waitForTimeout(250); } },
  { id: "02-refinamento", desc: "Seu perfil-base está pronto — dois CTAs com a mesma geometria",
    go: refbranch },
  { id: "03-pergunta-mapa-aberto", desc: "Pergunta com o mapa do assessment expandido",
    go: pg => question(pg, 3, { map: true }) },
  { id: "04-pergunta-mapa-recolhido", desc: "Pergunta com o mapa recolhido",
    go: pg => question(pg, 3, { map: false }) },
  { id: "05-contexto-capabilities", desc: "Contexto tecnológico — região Capabilities de segurança",
    go: pg => ctxEditor(pg, "caps"), viewport: true },
  { id: "06-contexto-ambiente", desc: "Contexto tecnológico — região Ambiente e condicionantes",
    go: pg => ctxEditor(pg, "env"), viewport: true },
  { id: "07-contexto-ajuda", desc: "Ajuda de capability aberta (Gestão de conhecimento)",
    go: async pg => {
      await ctxEditor(pg, "caps");
      await pg.evaluate(() => {
        const b = document.querySelector('[data-p52="cap-help"][data-cap="knowledge-management"]');
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); }
      });
      await pg.waitForTimeout(260);
    }, viewport: true },
  { id: "08-visao-executiva", desc: "Visão executiva — score, radar, terceira coluna e 6+6",
    go: pg => results(pg, FX52.P52_F1) },
  { id: "09-suficiencia-bloqueada", desc: "Suficiência insuficiente — painel completo e resultado bloqueado",
    go: pg => results(pg, FX52.P52_F3) },
  { id: "10-suficiencia-atendida", desc: "Suficiência atendida — status compacto e Base de evidência",
    go: async pg => {
      await results(pg, FX52.P52_F1);
      await pg.evaluate(() => { const b = document.getElementById("p52-evbase"); if (b) b.open = true; });
      await scrollToEvbase(pg);
    }, viewport: true },
  { id: "11-resumo-barras", desc: "Resumo com as cinco barras de maturidade",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, "#p50-panel-resumo", 40); }, viewport: true },
  { id: "12-recomendacoes-icones", desc: "Formas de apoio — ícones lado a lado",
    go: async pg => { await results(pg, { vec: new Array(15).fill(0) }); await scrollTo(pg, "#p52-sec-support", 40); }, viewport: true },
  { id: "13-cenario-alvo", desc: "Cenário-alvo declarado",
    go: pg => results(pg, FX52.P52_F2) },
  /* REV B */
  { id: "17-home-emblema-ajuda", desc: "REV B · home com explicação de domínio aberta",
    go: async pg => {
      await pg.waitForTimeout(250);
      await pg.evaluate(() => {
        const g = document.querySelector('.p52-emblem-node[data-dom="0"]');
        if (g) g.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      });
      await pg.waitForTimeout(250);
    } },
  { id: "18-contexto-editor-revb", desc: "REV B · editor com só SOC & Operations aberto",
    go: async pg => { await ctxEditor(pg, "caps"); }, viewport: true },
  { id: "19-contexto-ajuda-arquitetura", desc: "REV B · ajuda de arquitetura e residência de dados",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="arch"]');
        if (g) g.open = true;
      });
      await pg.waitForTimeout(200);
      await pg.evaluate(() => {
        const b = document.querySelector('[aria-describedby="p52-archhelp-dataResidency"]');
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); }
      });
      await pg.waitForTimeout(250);
    }, viewport: true },
  { id: "20-dominios-largura", desc: "REV B · painel de domínios ocupando a largura da seção",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, "#p52-sec-detail", 40); }, viewport: true },
  { id: "21-apoio-links", desc: "REV B · cards de apoio unificados com link oficial",
    go: async pg => {
      await results(pg, FX52.P52_F1);
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
      await scrollTo(pg, "#v32support", 40);
    }, viewport: true },
  { id: "22-pergunta-evidencia-revb", desc: "REV B · 'O que registrar' antes do campo e exemplo como placeholder",
    go: async pg => { await question(pg, 1, { map: false });
      await pg.evaluate(() => { const t = document.getElementById("notetgl"); if (t) t.click(); });
      await pg.waitForTimeout(220); }, viewport: true },

  /* ======================================================================
     ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · cenas nominais da §8.3
     ====================================================================== */
  { id: "EX01-contexto-todos-os-grupos", desc: "ERRATA · contexto tecnológico com TODOS os grupos abertos e ajuda (i) em todo campo",
    go: async pg => {
      await ctxEditor(pg, "caps");
      await pg.evaluate(() => { document.querySelectorAll("#v32editor details").forEach(d => { d.open = true; }); });
      await pg.waitForTimeout(420);
    } },
  { id: "EX02-requisitos-especificos", desc: "ERRATA §6.2 · requisitos específicos na grade única, quatro grupos",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        document.querySelectorAll('#v32editor details[data-gid^="sig"]').forEach(d => { d.open = true; });
        const g = document.querySelector('details[data-gid="sig"]');
        if (g) window.scrollTo(0, g.getBoundingClientRect().top + window.scrollY - 24);
      });
      await pg.waitForTimeout(360);
    } },
  { id: "EX03-plataformas-licenciamento", desc: "ERRATA §6.1 · plataformas, bundles e subscriptions com ajuda (i)",
    go: async pg => {
      await ctxEditor(pg, "env");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="plat"]');
        if (g) { g.open = true; window.scrollTo(0, g.getBoundingClientRect().top + window.scrollY - 24); }
      });
      await pg.waitForTimeout(340);
    } },
  { id: "EX04-alvo-vazio", desc: "ERRATA §6.4 · cenário-alvo no estado VAZIO, ocupando a seção",
    go: async pg => { await results(pg, { vec: FX52.P52_F2.vec }); await scrollTo(pg, "#ux-target", 40); }, viewport: true },
  { id: "EX05-alvo-editado", desc: "ERRATA §6.4 · cenário-alvo editado, tabela Atual × Alvo em largura plena",
    go: async pg => { await results(pg, FX52.P52_F2); await scrollTo(pg, "#ux-target", 40); }, viewport: true },
  { id: "EX06-para-avancar", desc: "ERRATA §6.3 · 'Para avançar' com tipografia de achado e marcador gráfico",
    go: async pg => { await results(pg, FX52.P52_F1); await scrollTo(pg, ".p52-exec-advance", 40); }, viewport: true },
  { id: "EX07-recomendacoes-principais", desc: "ERRATA §6.5 · cards de apoio V3.2 com ícones normalizados",
    go: async pg => {
      await results(pg, FX52.P52_F1);
      await pg.click("#v32cta");
      await pg.evaluate(() => {
        const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
        ["security-analytics", "endpoint-detection", "soc-platform"].forEach(c => {
          const s = document.getElementById("v32-pres-" + c);
          if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
        });
      });
      await pg.click("#v32save");
      await pg.waitForTimeout(420);
      await scrollTo(pg, "#v32support", 40);
    }, viewport: true },
  { id: "EX08-pode-fazer-sentido", desc: "ERRATA §6.6 · 'Pode fazer sentido — após validação' com ícone das soluções",
    go: async pg => {
      await results(pg, { vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities });
      await scrollTo(pg, ".t-list", 40);
    }, viewport: true },
  { id: "EX09-nao-priorizados", desc: "ERRATA §6.6 · 'Não priorizados neste screening' com ícone das soluções",
    go: async pg => {
      await results(pg, { vec: new Array(15).fill(2) });
      await pg.evaluate(() => { document.querySelectorAll("details.t-details").forEach(d => { d.open = true; }); });
      await pg.waitForTimeout(240);
      await scrollTo(pg, "details.t-details", 40);
    }, viewport: true },
  { id: "EX10-icones-lado-a-lado", desc: "ERRATA §6.5 · ícones comparados lado a lado, mesma ocupação óptica",
    go: async pg => { await results(pg, { vec: new Array(15).fill(0) }); await scrollTo(pg, "#p52-sec-support", 40); }, viewport: true },
  { id: "EX11-resultado-bloqueado", desc: "ERRATA §4.1 · resultado bloqueado: nenhum score por domínio publicado",
    go: pg => results(pg, FX52.P52_F3) }
];
async function scrollToEvbase(pg) {
  await pg.evaluate(() => {
    const e = document.getElementById("p52-evbase");
    if (e) window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 40);
  });
  await pg.waitForTimeout(240);
}

(async () => {
  const browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
  const index = [];
  try {
    for (const cena of CENAS) {
      for (const vp of VIEWPORTS) {
        const pg = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
        try {
          await pg.goto(URL);
          await cena.go(pg);
          const name = "P52-" + cena.id + "-" + vp.w + "x" + vp.h + ".png";
          await pg.screenshot({ path: path.join(OUT, name), fullPage: !cena.viewport });
          index.push({ cena: cena.id, desc: cena.desc, vp: vp.w + "x" + vp.h, file: name });
        } catch (e) {
          index.push({ cena: cena.id, desc: cena.desc, vp: vp.w + "x" + vp.h, file: null, erro: String(e.message).split("\n")[0] });
        } finally { await pg.close(); }
      }
    }
    /* ERRATA UAT ESTREITA · cenas próprias da rodada: os cinco popovers de
       domínio, um a um, e a faixa ultrawide exata da §2.4 (3440x1392). */
    for (let d = 0; d < 5; d++) {
      const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      try {
        await pg.goto(URL);
        await pg.waitForSelector('.p52-emblem-node[data-dom="' + d + '"]', { state: "attached" });
        await pg.locator('.p52-emblem-node[data-dom="' + d + '"]').hover({ force: true });
        await pg.waitForTimeout(240);
        const nome = "P52-ER-popover-dominio-" + d + "-1920x1080.png";
        await pg.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: "ER-popover", desc: "Popover do domínio " + (d + 1) + " aberto por ponteiro",
                     vp: "1920x1080", file: nome });
      } catch (e) {
        index.push({ cena: "ER-popover", desc: "Popover do domínio " + (d + 1), vp: "1920x1080",
                     file: null, erro: String(e.message).split("\n")[0] });
      } finally { await pg.close(); }
    }
    for (const uw of [
      { id: "ER-ultrawide-home", desc: "Home na faixa ultrawide (escala ~1,22)", go: async pg => { await pg.waitForTimeout(260); } },
      { id: "ER-ultrawide-pergunta", desc: "Questionário na faixa ultrawide (escala ~1,10)", go: pg => question(pg, 3, { map: true }) }
    ]) {
      const pg = await browser.newPage({ viewport: { width: 3440, height: 1392 } });
      try {
        await pg.goto(URL);
        await uw.go(pg);
        const nome = "P52-" + uw.id + "-3440x1392.png";
        await pg.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: uw.id, desc: uw.desc, vp: "3440x1392", file: nome });
      } catch (e) {
        index.push({ cena: uw.id, desc: uw.desc, vp: "3440x1392", file: null, erro: String(e.message).split("\n")[0] });
      } finally { await pg.close(); }
    }
    /* ERRATA DA AUDITORIA EXTERNA · §8.3 · zoom de 110% e 125% em 1440x900,
       emulados pela viewport CSS equivalente (1309x818 e 1152x720). */
    for (const z of [
      { id: "EXzoom110-resultado", vp: { width: 1309, height: 818 }, dsf: 1.1, desc: "ERRATA · zoom 110% em 1440x900 — resultado" },
      { id: "EXzoom125-resultado", vp: { width: 1152, height: 720 }, dsf: 1.25, desc: "ERRATA · zoom 125% em 1440x900 — resultado" },
      { id: "EXzoom110-contexto", vp: { width: 1309, height: 818 }, dsf: 1.1, desc: "ERRATA · zoom 110% em 1440x900 — contexto tecnológico" },
      { id: "EXzoom125-contexto", vp: { width: 1152, height: 720 }, dsf: 1.25, desc: "ERRATA · zoom 125% em 1440x900 — contexto tecnológico" }
    ]) {
      const zp = await browser.newPage({ viewport: z.vp, deviceScaleFactor: z.dsf });
      try {
        await zp.goto(URL);
        if (/contexto/.test(z.id)) { await ctxEditor(zp, "caps"); }
        else { await results(zp, FX52.P52_F1); }
        const nome = "P52-" + z.id + ".png";
        await zp.screenshot({ path: path.join(OUT, nome), fullPage: false });
        index.push({ cena: z.id, desc: z.desc, vp: z.vp.width + "x" + z.vp.height, file: nome });
      } catch (e) {
        index.push({ cena: z.id, desc: z.desc, vp: z.vp.width + "x" + z.vp.height, file: null, erro: String(e.message).split("\n")[0] });
      } finally { await zp.close(); }
    }
    /* zoom de 200% em 1440x900 (viewport CSS equivalente de 720x450) */
    for (const z of [
      { id: "14-zoom200-home", desc: "Zoom 200% em 1440x900 — home", go: async pg => { await pg.waitForTimeout(220); } },
      { id: "15-zoom200-pergunta", desc: "Zoom 200% em 1440x900 — pergunta", go: pg => question(pg, 3, { map: false }) },
      { id: "16-zoom200-resultado", desc: "Zoom 200% em 1440x900 — resultado", go: pg => results(pg, FX52.P52_F1) }
    ]) {
      const zp = await browser.newPage({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
      try {
        await zp.goto(URL);
        await z.go(zp);
        const name = "P52-" + z.id + ".png";
        await zp.screenshot({ path: path.join(OUT, name), fullPage: true });
        index.push({ cena: z.id, desc: z.desc, vp: "720x450@2x (=1440x900 a 200%)", file: name });
      } finally { await zp.close(); }
    }
  } finally { await browser.close(); }

  const byCena = {};
  index.forEach(i => (byCena[i.cena] = byCena[i.cena] || { desc: i.desc, files: [] }).files.push(i));
  let md = "# Evidência visual · Phase 5.2 — Etapa A\n\n" +
    "Acervo gerado por `tools_p52_shots.js` sobre a candidata local. Cada cena é\n" +
    "fotografada nas oito viewports obrigatórias da §14.2 da diretriz; salvo indicação\n" +
    "em contrário, a captura é de página inteira.\n\n";
  Object.keys(byCena).sort().forEach(k => {
    md += "## " + k + " — " + byCena[k].desc + "\n\n";
    md += "| viewport | arquivo |\n|---|---|\n";
    byCena[k].files.forEach(f => { md += "| " + f.vp + " | " + (f.file ? "`" + f.file + "`" : "**FALHOU** — " + f.erro) + " |\n"; });
    md += "\n";
  });
  md += "## Medições e diagnósticos\n\n" +
    "| arquivo | conteúdo |\n|---|---|\n" +
    "| `P52-LAY1-widths.json` | largura de borda e de conteúdo de `.wrap` por viewport |\n" +
    "| `P52-LAY2-question.json` | geometria da tela de pergunta e do rodapé |\n" +
    "| `P52-LAY3-sections.json` | ordem e geometria das seções do workspace |\n" +
    "| `P52-NAV1-rail.json` | trilho: teclado, ativação, scroll spy e comportamento mobile |\n" +
    "| `P52-ICON1-optics.json` | bounding box de pixels do artwork de cada tile |\n" +
    "| `P52-DOM1-tags.json` | cor, borda e contraste de cada tag de domínio |\n" +
    "| `P52-GAP1-groups.json` | geometria dos grupos de severidade |\n" +
    "| `P52-REC1-grid.json` | grade das formas de apoio |\n" +
    "| `P52-CTX1-context.json` | card de contexto e estado dos grupos do editor |\n" +
    "| `P52-PR1-print.json` | isolamento de print (PDF executivo e papel legado) |\n" +
    "| `P52-ACC1-axe.json` | violações de axe: superfícies novas e comparação com o baseline |\n" +
    "| `P52-ACC2-zoom200.json` | controles e seções sob zoom de 200% |\n" +
    "| `P52-mutation.json` | campanha de mutação: mutantes e gates que os detectaram |\n";

  /* provas de PDF REAL (REV B §11): os arquivos são gerados pelo gate de
     Chromium; aqui apenas indexamos o que estiver no acervo, sem afirmar
     PASS. As páginas rasterizadas acompanham cada PDF quando presentes. */
  const PDFDIR = path.join(OUT, "pdf");
  if (fs.existsSync(PDFDIR)) {
    const arqs = fs.readdirSync(PDFDIR).sort();
    if (arqs.length) {
      md += "\n## Provas de PDF real\n\n" +
        "Impressão real em A4 com margens de 12 mm, pelo mesmo Chromium dos gates. As páginas\n" +
        "rasterizadas (`-pagina-*.png`) existem para leitura direta do papel, sem visualizador.\n\n" +
        "| arquivo | bytes |\n|---|---|\n";
      for (const a of arqs) md += "| `pdf/" + a + "` | " + fs.statSync(path.join(PDFDIR, a)).size + " |\n";
    }
  }
  fs.writeFileSync(path.join(OUT, "INDEX.md"), md, "utf8");
  const falhas = index.filter(i => !i.file);
  console.log("evidência visual: " + (index.length - falhas.length) + "/" + index.length + " capturas em " + OUT);
  if (falhas.length) { falhas.forEach(f => console.log("  FALHOU " + f.cena + " " + f.vp + ": " + f.erro)); process.exit(1); }
})().catch(e => { console.error("SHOTS P52: falha fatal —", e && e.stack || e); process.exit(1); });
