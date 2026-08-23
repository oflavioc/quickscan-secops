/* ============================================================================
   HARNESS DE MUTAÇÃO · PHASE 5.1
   Prova o PODER DISCRIMINANTE dos gates novos. Para cada mutante:
     1. aplica a mutação no source;
     2. reconstrói o HTML;
     3. executa o gate ESPERADO (e somente ele, quando filtrável);
     4. exige FAIL do gate esperado com MOTIVO compatível;
     5. restaura o source e confere o SHA-256 byte a byte.
   Detecção incidental (manifesto, sintaxe, crash) NÃO conta.
   Este harness não integra `test:all`: roda sob demanda, em cópia temporária.
   ========================================================================== */
"use strict";
const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const F = {
  css:     path.join(HERE, "ui_p50_v32.css"),
  shell:   path.join(HERE, "ui_p50_shell_v32.js"),
  journey: path.join(HERE, "ui_journey_v32.js"),
  uiv32:   path.join(HERE, "ui_v32.js"),
  results: path.join(HERE, "ui_p50_results_v32.js"),    /* ERRATA R1 */
  guide:   path.join(HERE, "USER_GUIDE.md")             /* ERRATA R2/R3 */
};
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const BASE = {}; Object.keys(F).forEach(k => { BASE[F[k]] = sha(F[k]); });

const MUTANTS = [
  { id: "M51-01", desc: "layout desktop volta a empilhar mapa e pergunta",
    file: F.css, gate: "P51-VIS1", cmd: "P50_NO_EVIDENCE=1 node tests_p50_chromium.js",
    reason: /se sobrep|empilhamento|faixa central/i,
    find: `    grid-template-columns:minmax(0,1fr) 340px;
    grid-template-areas:"main side";`,
    repl: `    grid-template-columns:minmax(0,1fr);
    grid-template-areas:"side" "main";` },

  { id: "M51-02", desc: "reintroduz um segundo botão de evidência focável",
    file: F.shell, gate: "P51-UX1", cmd: "P50_ONLY=P51-UX1 node tests_p50_core.js",
    reason: /2 controles de evid|não é o canônico/i,
    find: `    /* Phase 5.1 · apresentação da pergunta e controle único de evidência. */`,
    repl: `    block.appendChild(el("button", { type: "button", "class": "p50-btn",
      "data-p50": "evidence-open" }, "Registrar evidência ou observação"));
    /* Phase 5.1 · apresentação da pergunta e controle único de evidência. */` },

  { id: "M51-03", desc: "exemplo de MSSP vaza para um qid incorreto",
    file: F.shell, gate: "P51-UX2", cmd: "P50_ONLY=P51-UX2 node tests_p50_core.js",
    reason: /exemplo de MSSP aparece em/i,
    find: `      ex: "Ex.: charter aprovado pelo CISO em 03/2025; sponsor é o Diretor de TI; metas revistas no comitê trimestral; responsável nomeado."`,
    repl: `      ex: "Ex.: MSSP cobre 8×5; plantão interno fora do horário. SLA P1 = 30 min."` },

  { id: "M51-04", desc: "jornada perde o número do estágio",
    file: F.journey, gate: "P51-JN1", cmd: "P50_ONLY=P51-JN1 node tests_p50_core.js",
    reason: /número ''|nó \d+: número/i,
    find: '<span class="jn-num">' + "${i}" + '</span>',
    repl: '<span class="jn-num"></span>' },

  { id: "M51-05", desc: "tag de domínio sai da ordem canônica de DOMS",
    file: F.shell, gate: "P51-COR5", cmd: "P50_ONLY=P51-COR5 node tests_p50_core.js",
    reason: /fora da ordem canônica|apenas \d+ elementos/i,
    find: `      "data-dom": qq.dom,`,
    repl: `      "data-dom": "x" + qq.dom,` },

  { id: "M51-06", desc: "FortiClient descrito como plataforma universal",
    file: F.uiv32, gate: "P51-REC1", cmd: "P50_ONLY=P51-REC1 node tests_p50_core.js",
    reason: /sem escopo de endpoint|além do escopo/i,
    find: `      { n: "FortiClient administrado por EMS", w: "descoberta, inventário, varredura e patching no escopo de endpoint; não substitui uma plataforma completa de gestão de vulnerabilidades" },`,
    repl: `      { n: "FortiClient administrado por EMS", w: "plataforma universal de gestão de vulnerabilidades para todo o ambiente" },` },

  { id: "M51-07", desc: "recomendação é anexada ao gap errado",
    file: F.uiv32, gate: "P51-REC1", cmd: "P50_ONLY=P51-REC1 node tests_p50_core.js",
    reason: /FortiClient|escopo de endpoint|apoio/i,
    find: `const QS_GAP_SUPPORT = {
  "detection-lifecycle": {`,
    repl: `const QS_GAP_SUPPORT = {
  "training": {` },

  { id: "M51-08", desc: "option do cenário-alvo volta a herdar cor/fundo",
    file: F.css, gate: "P51-VIS2", cmd: "P50_NO_EVIDENCE=1 node tests_p50_chromium.js",
    reason: /color-scheme|sem fundo explícito|contraste/i,
    find: `#ux-target .ux-tgt-row select option,
#ux-target select[data-qid] option{
  color:var(--text);
  background-color:var(--surface2);
}`,
    repl: `#ux-target .ux-tgt-row select option,
#ux-target select[data-qid] option{
  color:inherit;
  background-color:transparent;
}` },

  { id: "M51-09", desc: "label da sessão fica stale após import sem label",
    file: F.shell, gate: "P51-RPT2", cmd: "P50_ONLY=P51-RPT2 node tests_p50_core.js",
    reason: /label importado não refletido|Sem rótulo|rótulo/i,
    find: `    p51Meta.label = (typeof doc.label === "string" && doc.label.trim()) ? doc.label : null;`,
    repl: `    if (typeof doc.label === "string" && doc.label.trim()) p51Meta.label = doc.label;` },

  { id: "M51-10", desc: "data de geração usada como data da sessão",
    file: F.uiv32, gate: "P51-RPT2", cmd: "P50_ONLY=P51-RPT2 node tests_p50_core.js",
    reason: /mesmo instante|sessionDateISO/i,
    find: `    sessionDateISO: m ? m.startedAt : null,`,
    repl: `    sessionDateISO: new Date().toISOString(),` },

  { id: "M51-11", desc: "régua marca posição mesmo sem suficiência",
    file: F.uiv32, gate: "P51-PDF1", cmd: "P50_NO_EVIDENCE=1 node tests_p50_chromium.js",
    reason: /marcou posição com dados insuficientes|não determinado/i,
    find: `  const determinado = suff && overall !== null;`,
    repl: `  const determinado = true; overall = overall === null ? 0 : overall;` },

  { id: "M51-12", desc: "régua diverge de stageOf() numa borda",
    file: F.uiv32, gate: "P51-RPT3", cmd: "P50_ONLY=P51-RPT3 node tests_p50_core.js",
    reason: /divergência em|borda/i,
    find: `  bands: qsStageBands,
  stageAt: v => stageOf(v)`,
    repl: `  bands: qsStageBands,
  stageAt: v => stageOf(v < 2.5 ? v : v + 0.6)` },

  { id: "M51-13", desc: "ordem/cor de dois domínios trocada no sistema gráfico",
    file: F.uiv32, gate: "P51-RPT4", cmd: "P50_ONLY=P51-RPT4 node tests_p50_core.js",
    reason: /legenda \d+: cor|não contém/i,
    find: `    + DOMS.map((d,i)=>\`<span class="pr-domleg" data-dom-legend="\${i}"><span class="pr-domsw" data-dom-sw style="background:\${PR_DOM_HEX[i]}"></span>\${i+1}. \${esc32(d.pt)}</span>\`).join("")`,
    repl: `    + DOMS.map((d,i)=>\`<span class="pr-domleg" data-dom-legend="\${i}"><span class="pr-domsw" data-dom-sw style="background:\${PR_DOM_HEX[(i+1)%5]}"></span>\${i+1}. \${esc32(d.pt)}</span>\`).join("")`},

  { id: "M51-14", desc: "SVG do emblema passa a variar com o score",
    file: F.uiv32, gate: "P51-RPT5", cmd: "P50_ONLY=P51-RPT5 node tests_p50_core.js",
    reason: /varia entre sessão baixa e alta|não é neutro/i,
    find: `  const linha = QS_PENTA.map(p=>\`\${p.x},\${p.y}\`).join(" ");`,
    repl: `  const __s = DOMS.map((_,i)=>domStat(i).score||0).reduce((a,b)=>a+b,0);
  const linha = QS_PENTA.map(p=>\`\${(p.x+__s*0.01).toFixed(2)},\${p.y}\`).join(" ");` },

  { id: "M51-15", desc: "emblema perde os rótulos completos dos domínios",
    file: F.uiv32, gate: "P51-RPT5", cmd: "P50_ONLY=P51-RPT5 node tests_p50_core.js",
    reason: /rótulo '.*' ausente/i,
    find: `text-anchor="\${p.anchor}" fill="#3A3A40">\${esc32(nomes[i])}</text>\``,
    repl: `text-anchor="\${p.anchor}" fill="#3A3A40">\${esc32(nomes[i].slice(0,1))}</text>\`` },

  { id: "M51-16", desc: "capa colide com o cabeçalho no PDF",
    file: F.uiv32, gate: "P51-PDF1", cmd: "P50_NO_EVIDENCE=1 node tests_p50_chromium.js",
    reason: /colidem|capa/i,
    find: `  let h = qsCoverHTML();
  h += \`<div class="pr-head">`,
    repl: `  let h = \`<div style="position:absolute;top:0;left:0;height:400px">\` + qsCoverHTML() + \`</div>\`;
  h += \`<div class="pr-head">` },

  /* ---------------- ERRATA pós-auditoria independente (2026-08-22) ----------------
     Dois mutantes novos, um por gate novo. M51-17 é exatamente a mutação
     adversarial AUD-02 do auditor, que sobreviveu a 162 gates e virou a
     ressalva R1. M51-18 é o regresso do blocker B1: o agregado do relatório
     de volta à forma sem arredondamento. */
  { id: "M51-17", desc: "sinal do gap Current × Target invertido na matriz única (AUD-02)",
    file: F.results, gate: "P51-VIS3", cmd: "P50_ONLY=P51-VIS3 node tests_p50_core.js",
    reason: /gap|sinal|negativo/i,
    find: `          gap: (score !== null && tScore !== null) ? p50Round1(tScore - score) : null,`,
    repl: `          gap: (score !== null && tScore !== null) ? p50Round1(score - tScore) : null,` },

  { id: "M51-18", desc: "agregado do relatório volta à forma sem arredondamento (regresso do B1)",
    file: F.uiv32, gate: "P51-RPT6", cmd: "P50_ONLY=P51-RPT6 node tests_p50_core.js",
    reason: /KPI diz|régua lê|jornada|leitura executiva|canônico/i,
    find: `  const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;
  const {findings, validate} = computeFindings();
  const prios =`,
    repl: `  const overall = suff && scored.length ? (scored.reduce((a,s)=>a+s.score,0)/scored.length) : null;
  const {findings, validate} = computeFindings();
  const prios =` },

  { id: "M51-19", desc: "manual volta a descrever o score geral como média das respostas (R2)",
    file: F.guide, gate: "P51-DOC13", cmd: "P50_ONLY=P51-DOC13 node tests_p50_core.js",
    reason: /score geral|m[ée]dia dos .{0,12}cinco scores|redação imprecisa/i,
    find: `**Score 0–5.** O score **por domínio** é a média das respostas confirmadas daquele domínio,
arredondada a uma casa. O score **geral** é a média dos **cinco scores de domínio** — não a média
direta das respostas.`,
    repl: `**Score 0–5.** Média das respostas confirmadas. Por domínio e geral. O score **geral** e o score
**por domínio** saem da mesma conta.` },

  { id: "M51-20", desc: "manual volta a listar régua e legenda como seções próprias (R3)",
    file: F.guide, gate: "P51-DOC13", cmd: "P50_ONLY=P51-DOC13 node tests_p50_core.js",
    reason: /§12|ordem|item \d+|legenda|r[ée]gua/i,
    find: `3. **Como interpretar este relatório** — caixa curta com as regras de leitura;
4. **Prioridades declaradas pelo negócio**;`,
    repl: `3. **Como interpretar este relatório** — caixa curta com as regras de leitura;
4. **Régua 0–5** — posição do score entre os seis estágios;
5. **Legenda dos domínios** — nomes completos, na ordem canônica;
6. **Prioridades declaradas pelo negócio**;` }
];

function run(cmd) {
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, encoding: "utf8", stdio: ["ignore","pipe","pipe"], maxBuffer: 64*1024*1024 }) }; }
  catch (e) { return { code: e.status === undefined ? -1 : e.status, out: String(e.stdout || "") + String(e.stderr || "") }; }
}

(async () => {
  const only = (process.env.MUT_ONLY || "").split(",").map(x=>x.trim()).filter(Boolean);
  const sel = only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS;
  const report = []; let ok = 0;
  for (const m of sel) {
    const src = fs.readFileSync(m.file, "utf8");
    const n = src.split(m.find).length - 1;
    if (n < 1) { console.log("ERRO  " + m.id + " · alvo não encontrado em " + path.basename(m.file));
      report.push({ id: m.id, detected: false, why: "alvo não encontrado" }); continue; }
    fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
    run("python3 build_v32_html.py");
    const r = run(m.cmd);
    const linhaFail = (r.out.split("\n").find(l => l.indexOf("FAIL  " + m.gate) === 0)) || "";
    const detectado = !!linhaFail && m.reason.test(linhaFail);
    fs.writeFileSync(m.file, src, "utf8");
    run("python3 build_v32_html.py");
    const restaurado = sha(m.file) === BASE[m.file];
    if (!restaurado) { console.log("ERRO  " + m.id + " · restauração divergente"); }
    if (detectado && restaurado) ok++;
    console.log((detectado && restaurado ? "DETECTADO " : "NÃO DETECTADO ") + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate + (linhaFail ? "\n              " + linhaFail.slice(0, 220) : "\n              (gate não falhou)"));
    report.push({ id: m.id, desc: m.desc, gate: m.gate, detected: detectado, restored: restaurado,
                  failLine: linhaFail.slice(0, 300) });
  }
  console.log("\nMUTATION TESTING (Phase 5.1): " + ok + "/" + sel.length + " mutantes detectados pelo gate e motivo esperados");
  if (!only.length) {
    fs.mkdirSync(path.join(HERE, "docs_phase5", "evidence_p51"), { recursive: true });
    fs.writeFileSync(path.join(HERE, "docs_phase5", "evidence_p51", "P51-mutation.json"),
      JSON.stringify({ baseline: BASE, detected: ok, total: sel.length, mutants: report }, null, 2) + "\n", "utf8");
  }
  process.exit(ok === sel.length ? 0 : 1);
})();
