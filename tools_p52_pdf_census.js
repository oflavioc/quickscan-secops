/* ============================================================================
   CENSO DE PDF REAL · ERRATA DA AUDITORIA EXTERNA (Phase 5.2)

   Ferramenta NOMINAL desta errata. Imprime a matriz completa de cenários em
   A4 real (escala 100%, fundos habilitados, sem cabeçalho/rodapé do
   navegador) e produz, POR PÁGINA: texto extraído, primeira e última linha
   materiais, cobertura de tinta medida na página RASTERIZADA e total de
   páginas — mais o veredito do oráculo independente de publicabilidade.

   Não é um gate: não decide PASS/FAIL. É o registro de evidência exigido
   pela §3.3.3 e pela §8.2 do prompt da errata. Os gates que decidem vivem em
   `tests_p52_chromium.js` (P52-PDF1..PDF9).

   Uso:
     node tools_p52_pdf_census.js <arquivo-de-saida.json> [--pdf-dir <dir>]
   ========================================================================== */
"use strict";

const fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto");
const { execFileSync } = require("child_process");
const { chromium } = require("@playwright/test");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");

const HERE = __dirname;
const HTML_URL = "file://" + path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const OUT = process.argv[2] || path.join(HERE, "docs_phase5", "evidence_p52", "P52-ERRATA-pdf-census.json");
const dirArg = process.argv.indexOf("--pdf-dir");
const PDF_DIR = dirArg > 0 ? process.argv[dirArg + 1] : fs.mkdtempSync(path.join(os.tmpdir(), "p52census-"));

function resolveBrowser() {
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { executablePath: explicit };
  if (fs.existsSync(local)) return { executablePath: local };
  return {};
}

/* mesma matriz dos gates: {suficiência} × {contexto} + fronteira + sem prioridade */
const CASOS = [
  { name: "1-suficiente-contexto-prioridades", vec: FX52.P52_F1.vec, prios: FX52.P52_F1.priorities.concat(["logs"]), contexto: true },
  { name: "2-suficiente-sem-contexto-prioridades", vec: FX52.P52_F1.vec, prios: FX52.P52_F1.priorities.concat(["logs"]), contexto: false },
  { name: "3-insuficiente-contexto", vec: FX52.P52_F3.vec, prios: null, contexto: true },
  { name: "4-insuficiente-sem-contexto", vec: FX52.P52_F3.vec, prios: null, contexto: false },
  { name: "5-fronteira-de-estagio", vec: new Array(15).fill(1), prios: ["mandate"], contexto: true },
  { name: "6-sem-prioridades", vec: FX52.P52_F1.vec, prios: null, contexto: true }
];

function poppler() {
  try { execFileSync("pdftotext", ["-v"], { stdio: "pipe" }); execFileSync("pdftoppm", ["-v"], { stdio: "pipe" }); return true; }
  catch (e) { return false; }
}
function paginasDe(file) {
  const xml = execFileSync("pdftotext", ["-bbox-layout", file, "-"], { maxBuffer: 64 * 1024 * 1024 }).toString();
  return xml.split(/<page\b/).slice(1).map(b => {
    const dim = /width="([\d.]+)"\s+height="([\d.]+)"/.exec(b);
    const linhas = [];
    const reL = /<line[^>]*>([\s\S]*?)<\/line>/g;
    let m;
    while ((m = reL.exec(b))) {
      const t = m[1].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
      if (t) linhas.push(t);
    }
    const texto = linhas.join(" ");
    return {
      larguraPt: dim ? +dim[1] : 0, alturaPt: dim ? +dim[2] : 0,
      caracteres: texto.length, linhas: linhas.length,
      primeiraLinha: linhas[0] || null, ultimaLinha: linhas[linhas.length - 1] || null,
      texto: texto
    };
  });
}
function tinta(file, n) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "p52ink-"));
  try {
    execFileSync("pdftoppm", ["-gray", "-r", "40", "-f", String(n), "-l", String(n), file, path.join(d, "g")]);
    const arq = fs.readdirSync(d)[0];
    const buf = fs.readFileSync(path.join(d, arq));
    let i = 0, campos = [], acc = "";
    while (campos.length < 4 && i < buf.length) {
      const c = String.fromCharCode(buf[i++]);
      if (/\s/.test(c)) { if (acc) { campos.push(acc); acc = ""; } } else acc += c;
    }
    const dados = buf.slice(i);
    let px = 0;
    for (let k = 0; k < dados.length; k++) if (dados[k] < 235) px++;
    return +(100 * px / dados.length).toFixed(2);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
}

(async () => {
  if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });
  const temPoppler = poppler();
  const browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
  const censo = {
    ferramenta: "tools_p52_pdf_census.js",
    html: path.basename(HTML_URL),
    htmlSha256: crypto.createHash("sha256")
      .update(fs.readFileSync(path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html"))).digest("hex"),
    poppler: temPoppler,
    preferencias: { formato: "A4", escala: "100%", fundos: true, cabecalhoRodapeNavegador: false, margens: "12mm" },
    casos: {}
  };
  try {
    for (const c of CASOS) {
      const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const erros = [];
      pg.on("pageerror", e => erros.push(String(e.message)));
      try {
        await pg.goto(HTML_URL);
        await pg.evaluate(([qids, vec, prios]) => {
          window.__DEV.setArq(0);
          qids.forEach((id, i) => window.__DEV.setAnswerById(id, vec[i]));
          if (prios) window.__DEV.setPriorities(prios);
          window.__DEV.showResults();
        }, [FX50.P50_QIDS, c.vec, c.prios]);
        await pg.waitForTimeout(200);
        if (c.contexto) {
          await pg.click("#v32cta");
          await pg.evaluate(() => {
            const g = document.querySelector('details[data-gid="g3"]'); if (g) g.open = true;
            ["security-analytics", "endpoint-detection", "soc-platform"].forEach(id => {
              const s = document.getElementById("v32-pres-" + id);
              if (s) { s.value = "NONE"; s.dispatchEvent(new Event("change")); }
            });
          });
          await pg.click("#v32save");
          await pg.waitForTimeout(300);
        }
        await pg.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
        const modo = await pg.evaluate(() => ({
          classes: document.body.className,
          printMode: document.body.classList.contains("v32-print-mode"),
          reportLen: (document.getElementById("v32-print-report") || { innerHTML: "" }).innerHTML.length,
          legacyMode: window.__DEV.V32.isLegacyModeV32()
        }));
        await pg.emulateMedia({ media: "print" });
        await pg.waitForTimeout(180);
        const dom = await pg.evaluate(() => {
          const R = document.getElementById("v32-print-report");
          return {
            wrapDisplay: getComputedStyle(document.querySelector(".wrap")).display,
            celulasDominio: R ? Array.from(R.querySelectorAll("table.pr-doms td")).map(e => (e.textContent || "").trim()) : [],
            radarRotulos: R ? Array.from(R.querySelectorAll(".pr-radar text")).map(e => (e.textContent || "").trim()) : [],
            kpiGlobal: R && R.querySelector(".pr-kpi b") ? R.querySelector(".pr-kpi b").textContent.trim() : null,
            secoes: R ? Array.from(R.querySelectorAll(".pr-sec")).map(e => e.id).filter(Boolean) : []
          };
        });
        const file = path.join(PDF_DIR, c.name + ".pdf");
        await pg.pdf({ path: file, format: "A4", printBackground: true,
          margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" } });
        const O = FX52.p52PublishOracle(c.vec);
        const pgs = temPoppler ? paginasDe(file) : [];
        pgs.forEach((p, i) => { p.tintaPct = temPoppler ? tinta(file, i + 1) : null; });
        censo.casos[c.name] = {
          contextoInformado: c.contexto, oraculo: O, modo: modo, dom: dom,
          arquivo: path.basename(file), bytes: fs.statSync(file).size,
          sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
          totalPaginas: pgs.length,
          paginas: pgs.map((p, i) => ({
            n: i + 1, larguraPt: p.larguraPt, alturaPt: p.alturaPt,
            a4: Math.abs(p.larguraPt - 595.28) < 2 && Math.abs(p.alturaPt - 841.89) < 2,
            caracteres: p.caracteres, linhas: p.linhas, tintaPct: p.tintaPct,
            primeiraLinha: p.primeiraLinha, ultimaLinha: p.ultimaLinha
          })),
          textoPorPagina: pgs.map((p, i) => ({ n: i + 1, texto: p.texto })),
          errosDePagina: erros
        };
        console.log(c.name + ": " + pgs.length + " páginas · " + fs.statSync(file).size + " bytes · " +
          "printMode=" + modo.printMode + " · legacy=" + modo.legacyMode +
          " · domínios=[" + dom.celulasDominio.join(",") + "] · suff=" + O.suff);
      } finally { await pg.close(); }
    }
  } finally { await browser.close(); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(censo, null, 2));
  console.log("\ncenso → " + OUT + "\nPDFs → " + PDF_DIR);
})().catch(e => { console.error("CENSO: falha fatal —", e && e.stack || e); process.exit(1); });
