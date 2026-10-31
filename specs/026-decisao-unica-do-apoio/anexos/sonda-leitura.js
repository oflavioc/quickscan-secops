/* probe026.js — sonda READ-ONLY (jsdom) para medir motor × tela × papel.
   Uso: node probe026.js <cenario.json> [caminho-do-html]
   Nunca escreve na árvore. Dados estritamente sintéticos. */
"use strict";
const path = require("path"), fs = require("fs");
const REPO = process.env.QS_REPO || "(raiz do repositorio)";
const { JSDOM } = require(path.join(REPO, "node_modules", "jsdom"));
const HTML_PATH = process.argv[3] || path.join(REPO, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");
const cen = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

const QS_ORDER = ["mandate","governance","policies","team-capacity","training","knowledge","incident-response",
  "detection-lifecycle","automation","logs","endpoint","network-visibility","monitoring-coverage",
  "external-surface","vulnerability-management"];

const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
const w = dom.window, d = w.document;
const errs = [];
w.console.error = (...a) => errs.push(a.map(String).join(" "));
if (!w.__DEV) throw new Error("__DEV ausente");
w.__DEV.setArq(cen.arq == null ? 0 : cen.arq);
const ids = w.eval("QS.map(q=>q.id)");
if (JSON.stringify(ids) !== JSON.stringify(QS_ORDER)) throw new Error("ordem QS diverge: " + ids.join(","));
if (Array.isArray(cen.answers)) {
  ids.forEach((id, i) => w.__DEV.setAnswerById(id, cen.answers[i]));
} else {
  const base = cen.nivel == null ? 2 : cen.nivel;
  ids.forEach(id => w.__DEV.setAnswerById(id, base));
  Object.keys(cen.niveis || {}).forEach(id => w.__DEV.setAnswerById(id, cen.niveis[id]));
}
const V = w.__DEV.V32;
Object.keys(cen.landscape || {}).forEach(cap => {
  if (!V.TECH_LANDSCAPE[cap]) throw new Error("capability sem landscape: " + cap);
  V.TECH_LANDSCAPE[cap] = Object.assign({ presence: "UNSET", solutions: [], declaredDriver: null }, cen.landscape[cap]);
});
Object.keys(cen.arch || {}).forEach(k => { V.ARCHITECTURE_CONTEXT[k] = cen.arch[k]; });
Object.keys(cen.signals || {}).forEach(k => { V.SESSION_SIGNALS[k] = cen.signals[k]; });
if (cen.platforms) V.PLATFORM_CONTEXT.declaredPlatforms = cen.platforms;
w.__DEV.setPriorities(cen.prios || []);
w.__DEV.showResults();

const txt = n => n ? String(n.textContent || "").replace(/\s+/g, " ").trim() : "";
const qa = (n, s) => Array.from(n.querySelectorAll(s));

/* ---- motor ---- */
const ctx = V.buildRecommendationContext();
const motor = {};
Object.keys(ctx.contexts || {}).forEach(cap => {
  const c = ctx.contexts[cap];
  if (!c.candidates.length && !c.services.length && !["TECHNOLOGY_WHITESPACE","OPERATIONAL_GAP","COVERAGE_GAP","ADOPTION_GAP","CONTEXT_NOT_INFORMED","NEEDS_VALIDATION"].includes(c.classification)) return;
  motor[cap] = {
    maturity: c.maturity && c.maturity.state, techState: c.techState, classification: c.classification,
    supportMode: c.supportMode,
    candidates: c.candidates.map(x => ({ itemId: x.itemId, itemKind: x.itemKind, relation: x.relation,
      scopeNote: x.scopeNote || null, variantResolution: x.variantResolution || null, variants: x.variants || null, signals: x.signals || null })),
    services: c.services.map(s => ({ serviceId: s.serviceId, triggeredBy: s.triggeredBy, note: s.note })),
    notes: c.notes
  };
});
const legacy = ctx.legacyMode;
const findings = w.eval("computeFindings().findings").map(f => ({ id: f.id, lvl: f.lvl, sev: f.sev }));
let suff = "n/a"; try { suff = JSON.stringify(JSON.parse(w.__DEV.legacySnapshot()).suff); } catch (e) { suff = "erro: " + e.message; }

/* ---- curadoria ---- */
const offered = (w.__CURATION && w.__CURATION.offered()) || null;

/* ---- tela ---- */
const sec = d.getElementById("p52-sec-support");
const cards = sec ? qa(sec, ":scope > .apoio-block[data-p53-sol-produto]").map(c => ({
  produto: c.getAttribute("data-p53-sol-produto"),
  tier: c.getAttribute("data-p53-sol-tier"),
  tierLabel: txt(c.querySelector(".p53-sol-tierlabel")) || null,
  grupo: c.getAttribute("data-p53-sol-grupo"),
  sinais: c.getAttribute("data-qs22-sinais") || "",
  prov: !!c.querySelector("[data-p53-prov]"),
  caps: qa(c, "[data-p53-sol-cap]").map(x => x.getAttribute("data-p53-sol-cap")),
  texto: txt(c)
})) : null;
const aviso = sec ? txt(sec.querySelector(":scope > [data-p53-suprimido]")) : null;
const legadoVisivel = sec ? qa(sec, ".apoio-block:not([data-p53-sol-produto])").filter(n => !n.closest(".v32-hidden")).map(n => txt(n).slice(0, 80)) : null;
const archNote = d.getElementById("v32arch-note") ? txt(d.getElementById("v32arch-note")) : null;
/* leitura por capability V3.2 (cards de capability), se existir */
const capCards = qa(d, "[data-v32-cap], .v32-cap-card, .v32cap").slice(0, 40).map(n => txt(n).slice(0, 160));

/* ---- papel (beforeprint) ---- */
w.dispatchEvent(new w.Event("beforeprint"));
const rel = d.getElementById("v32-print-report");
const papel = rel ? qa(rel, "#pr-sup-solucao .pr-card").map(c => ({
  produto: c.getAttribute("data-p53-sol-produto"),
  grupo: c.getAttribute("data-p53-sol-grupo"),
  sinais: c.getAttribute("data-qs22-sinais") || "",
  tierAttr: c.getAttribute("data-p53-sol-tier"),
  temIndicacaoPrioritaria: /indica[cç][aã]o priorit[aá]ria/i.test(txt(c)),
  temAposValidacao: /ap[oó]s valida[cç][aã]o/i.test(txt(c)),
  texto: txt(c)
})) : null;
const papelAviso = rel ? txt(rel.querySelector("#pr-sup-solucao [data-p53-suprimido]")) : null;
const papelTexto = rel ? txt(rel) : "";
const papelTemAtribuicao = /soc-cmm/i.test(papelTexto) && /van os|cc by/i.test(papelTexto);
try { w.__DEV.finishPrint(); } catch (e) {}

const out = { cenario: cen.id || null, legacyMode: legacy, suff, findings, motor, architectureNote: ctx.architectureNote,
  offered, tela: { cards, aviso, legadoVisivel, archNote, capCards }, papel: { cards: papel, aviso: papelAviso, temAtribuicaoSOCCMM: papelTemAtribuicao },
  consoleErrors: errs, p53diag: w.__P53SOL && w.__P53SOL.diag() };
process.stdout.write(JSON.stringify(out, null, 1) + "\n");
