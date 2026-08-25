/* ============================================================================
   HARNESS DE MUTAÇÃO · CORE (Onda 3 da Estrutura Agêntica)

   Campanha inicial do achado E7: as superfícies portadoras das invariantes
   INV-8 (sessão), INV-2/INV-3 (publicação sob suficiência) e INV-6
   (refinamento) não tinham NENHUMA prova de poder discriminante.

   Padrão dos harnesses da casa (p50/p51/p52): mutação in-place com baseline
   SHA-256 por caminho, rebuild do HTML entre mutantes, oracle é uma suíte
   congelada que DEVE FALHAR, restauração byte a byte provada ao final.
   Todo kill desta campanha foi provado empiricamente ANTES de ser commitado
   (R10: mutante que não mata não entra).

   Execução recomendada: via stage `mutation` do pipeline (trigger por path,
   .claude/verify/check_mutation.py) — requires: node + python (sem Chromium).
   ============================================================================ */
"use strict";
const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const HERE = __dirname;
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const PY = process.platform === "win32" ? "python" : "python3";

const SESS = path.join(HERE, "ui_session_v32.js");
const UIJS = path.join(HERE, "ui_v32.js");
const REFJS = path.join(HERE, "ui_refinement_v32.js");
const MUTABLE = [SESS, UIJS, REFJS];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });

const MUTANTS = [
  {
    id: "CM1",
    desc: "import aceita derivados serializados (ataca INV-8: derivado nunca é fonte)",
    file: SESS,
    find: `  if (hasReservedDerived(I,0)) return err("O arquivo contém resultados derivados; sessões transportam apenas entradas.");`,
    repl: `  if (false) return err("O arquivo contém resultados derivados; sessões transportam apenas entradas.");   /* MUTANTE CM1 */`,
    gate: "SESSION 4.8", cmd: "node --max-old-space-size=4608 tests_session_m48.js",
    reason: /1 FAIL/
  },
  {
    id: "CM2",
    desc: "publishableStats publica score sob gate de suficiência fechado (ataca INV-2/INV-3)",
    file: UIJS,
    find: `function publishableStats(stats, suff){
  if (suff) return stats;
  return stats.map(s => Object.assign({}, s, { score: null }));
}`,
    repl: `function publishableStats(stats, suff){
  return stats;   /* MUTANTE CM2: publica score sob gate fechado */
}`,
    gate: "UNSET GEOMETRY (UG)", cmd: "node tests_unset_ug.js",
    reason: /3 FAIL/
  },
  {
    id: "CM3",
    desc: "refinamento aceita valor fora de 0..3 (ataca INV-6 na porta de entrada)",
    file: REFJS,
    find: `  v=+v; if(!(v>=0 && v<=3)) return false;`,
    repl: `  v=+v;   /* MUTANTE CM3: aceita qualquer valor */`,
    gate: "REF 4.4", cmd: "node tests_ref_m44.js",
    reason: /1 FAIL/
  },
];

function rebuild() {
  execSync(`${PY} "${path.join(HERE, "build_v32_html.py")}"`, { stdio: "pipe" });
}

let killed = 0, escaped = [];
console.log("CORE MUTATION · " + MUTANTS.length + " mutantes · baselines: " +
  MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · "));

for (const m of MUTANTS) {
  const src = fs.readFileSync(m.file, "utf8");
  if (!src.includes(m.find)) {
    console.log(`FAIL  ${m.id} — find-string não aplica (módulo mudou: mantenha o mutante, R10)`);
    escaped.push(m.id);
    continue;
  }
  fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
  rebuild();
  let out = "", code = 0;
  try { out = execSync(m.cmd, { stdio: "pipe", encoding: "utf8" }); }
  catch (e) { code = e.status || 1; out = (e.stdout || "") + (e.stderr || ""); }
  const dead = code !== 0 && m.reason.test(out);
  console.log((dead ? "KILL " : "FAIL ") + ` ${m.id} — ${m.desc} → oracle ${m.gate} ` +
    (dead ? "matou (exit " + code + ")" : "NÃO matou — gate sem poder discriminante"));
  if (dead) killed++; else escaped.push(m.id);
  fs.writeFileSync(m.file, src, "utf8");            // restauração exata
}

rebuild();                                          // HTML de volta ao canônico
const restored = MUTABLE.every(f => sha(f) === BASE_SHA[f]);
console.log("restauração: " + (restored ? "byte a byte OK" : "DIVERGENTE — repare a árvore!"));
console.log(`CORE MUTATION: ${killed} KILL · ${escaped.length} escaparam de ${MUTANTS.length}` +
  (escaped.length ? " (" + escaped.join(", ") + ")" : ""));
process.exit(escaped.length || !restored ? 1 : 0);
