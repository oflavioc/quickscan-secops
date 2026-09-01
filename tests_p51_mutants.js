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

   DEMANDA 013 · integridade da campanha
   -------------------------------------
   T1 · o interpretador tem UMA fonte: `MUTATION_PY` (override do operador) ou o
        padrão por plataforma da referência da casa (tests_core_mutants.js:22).
        O caminho do script vai entre aspas (R10 §7) — path com espaço quebrou a
        família P2.1-16/I11/S64.
   T3 · nenhum `cmd` de mutante carrega prefixo POSIX de variável: as variáveis
        passam pela opção `env` de execSync. A supressão de evidência é aplicada
        POR CONSTRUÇÃO a toda execução do runner (SUPPRESS), não por lembrança de
        autor — lição B-AUD-503-1, em que M20 perdeu a flag por esquecimento e o
        produto mutado regravou o acervo. O filtro por gate é o campo `only`.
        Shape de referência deste eixo: tests_p52_mutants.js:86-91,1374.
   T4/T5 · TRÊS estados, vocabulário fechado: DETECTADO · SOBREVIVENTE ·
        NÃO EXECUTADO (este sempre com UMA causa do conjunto fechado). Um número
        que não foi medido não é impresso: havendo não executado, a razão D/T
        some e o exit é ≠ 0. Com U == 0 a linha histórica fica literal.
   T6 · `--preflight` (argv): resolve o interpretador e CONTA as ocorrências de
        cada âncora no arquivo-alvo. Não muta, não reconstrói, não executa gate,
        não escreve nada. Um objeto JSON em stdout (contrato C1); texto humano em
        stderr. Exit 0 sse interpretador resolvido e toda âncora com
        ocorrencias == 1.
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

/* ── T1 · interpretador: fonte ÚNICA, a mesma de check_mutation.py (C4) ──────
   `MUTATION_PY` é o override explícito do operador; sem ele vale o padrão da
   referência da casa (tests_core_mutants.js:22). Precedente de forma do seam:
   `CHROME_PATH`. O que se declara e o que se invoca passam a ser a MESMA coisa. */
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const BUILD_PY = path.join(HERE, "build_v32_html.py");

/* Resolve o binário no PATH sem lançar processo NENHUM — o preflight não pode
   executar nada (C1 / R7 §3). Equivale ao shutil.which() de check_mutation.py. */
function resolvePy(nome) {
  if (nome.indexOf("/") >= 0 || nome.indexOf("\\") >= 0) {
    try { return fs.statSync(nome).isFile() ? path.resolve(nome) : null; } catch (e) { return null; }
  }
  const exts = process.platform === "win32"
    ? [""].concat((process.env.PATHEXT || ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean))
    : [""];
  for (const dir of String(process.env.PATH || "").split(path.delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const cand = path.join(dir.replace(/^"|"$/g, ""), nome + ext);
      try { if (fs.statSync(cand).isFile()) return cand; } catch (e) { /* próximo candidato */ }
    }
  }
  return null;
}

/* ── T3 · plumbing de ambiente: SUPPRESS por construção + envOverride ────────
   Shape de tests_p52_mutants.js:86-91,1374. A supressão de evidência é contrato
   do runner, não decoração do `cmd`: nenhum autor futuro pode esquecê-la ao
   acrescentar mutante (B-AUD-503-1). O filtro por gate chega pelo campo `only`. */
const SUPPRESS = { P50_NO_EVIDENCE: "1" };
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, SUPPRESS, envOverride || {});
  try {
    return { code: 0, spawnFalhou: false, erro: "",
             out: execSync(cmd, { cwd: HERE, encoding: "utf8", env,
                                  stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 }) };
  } catch (e) {
    /* `status` indefinido = o processo não chegou a existir (spawn). Distinguir
       spawn de exit ≠ 0 é o que impede um gate NÃO EXECUTADO de ser lido como
       sobrevivente — o colapso de estados que a demanda 013 mata. */
    const spawnFalhou = e.status === undefined || e.status === null;
    return { code: spawnFalhou ? -1 : e.status, spawnFalhou,
             erro: spawnFalhou ? String(e.message || e).split("\n")[0] : "",
             out: String(e.stdout || "") + String(e.stderr || "") };
  }
}
/* Caminho do script SEMPRE entre aspas (R10 §7): a família P2.1-16/I11/S64
   quebrou exatamente por diretório com espaço no caminho. */
function build() { return run(`"${PY}" "${BUILD_PY}"`); }

/* Linha do gate ESPERADO (PASS ou FAIL). Ausência de linha = o gate não rodou —
   é a decisão D1: filtro que não seleciona gate nenhum é NÃO EXECUTADO, jamais
   SOBREVIVENTE. Cópia de shape de tests_p52_mutants.js, nunca runner comum (R9). */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = String(out).match(re);
  return m ? m[0] : null;
}

/* ── T4 · vocabulário fechado (spec §Vocabulário fechado, normativo) ──────── */
const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente:       "âncora não encontrada",
  ambigua:       "âncora ambígua",
  rebuild:       "rebuild falhou",
  gate:          "gate não pôde ser executado"
};
/* Escape NOMEADO: falha fora do conjunto fechado não vira detectado nem
   sobrevivente — é impressa como tal e também reprova. */
const naoClassificada = msg => "falha não classificada: " + msg;

const MUTANTS = [
  /* [014/T050] M51-01 APOSENTADO em 2026-09-01 (demanda 014-gate-sem-poder-discriminante).
     Motivo: gate sem poder discriminante (achado EA-7). O par estava íntegro em
     tudo que se pode conferir sem navegador — âncora única (preflight C1,
     ocorrencias == 1) e `reason` com as três alternativas ainda emitidas por
     tests_p50_chromium.js:3405/:3408/:3412 — e mesmo assim P51-VIS1 rodava e
     PASSAVA sob a mutação. Causa medida por cascata e agora também pela
     varredura da 014: desde c1e3649 a composição da tela de pergunta é
     governada por ui_p52_workspace_v32.css:74-77, cujo seletor é o desta camada
     prefixado por `html` — prefixo VÁCUO, que casa todo elemento —, e a
     declaração que M51-01 mutava não decide mais nada em contexto nenhum.
     SUBSTITUIÇÃO NOMINAL: `D014-M10` (tests_014_mutants_visual.js, harness
     `d014vis`), que muta a linha VENCEDORA — `grid-template-columns` de
     ui_p52_workspace_v32.css:77 — e morre em P52-LAY2, gate existente de suíte
     INVOCADA e nunca editada. Trilha completa: mutation-matrix.json →
     dividas_declaradas; a KI-4 que perdoava este sobrevivente sai no MESMO
     commit (IC-9.2 reprova exceção a fantasma).
     Identidade anterior do bloco: id M51-01 · file F.css · gate P51-VIS1. */

  { id: "M51-02", desc: "reintroduz um segundo botão de evidência focável",
    file: F.shell, gate: "P51-UX1", cmd: "node tests_p50_core.js", only: "P51-UX1",
    reason: /2 controles de evid|não é o canônico/i,
    find: `    /* Phase 5.1 · apresentação da pergunta e controle único de evidência. */`,
    repl: `    block.appendChild(el("button", { type: "button", "class": "p50-btn",
      "data-p50": "evidence-open" }, "Registrar evidência ou observação"));
    /* Phase 5.1 · apresentação da pergunta e controle único de evidência. */` },

  { id: "M51-03", desc: "exemplo de MSSP vaza para um qid incorreto",
    file: F.shell, gate: "P51-UX2", cmd: "node tests_p50_core.js", only: "P51-UX2",
    reason: /exemplo de MSSP aparece em/i,
    find: `      ex: "Ex.: direcionamento aprovado pelo CISO; patrocinador é o Diretor de TI; objetivos revistos trimestralmente; responsáveis definidos."`,
    repl: `      ex: "Ex.: MSSP cobre 8×5; plantão interno fora do horário. SLA P1 = 30 min."` },

  { id: "M51-04", desc: "jornada perde o número do estágio",
    file: F.journey, gate: "P51-JN1", cmd: "node tests_p50_core.js", only: "P51-JN1",
    reason: /número ''|nó \d+: número/i,
    find: '<span class="jn-num">' + "${i}" + '</span>',
    repl: '<span class="jn-num"></span>' },

  { id: "M51-05", desc: "tag de domínio sai da ordem canônica de DOMS",
    file: F.shell, gate: "P51-COR5", cmd: "node tests_p50_core.js", only: "P51-COR5",
    reason: /fora da ordem canônica|apenas \d+ elementos/i,
    find: `      "data-dom": qq.dom,`,
    repl: `      "data-dom": "x" + qq.dom,` },

  { id: "M51-06", desc: "FortiClient descrito como plataforma universal",
    file: F.uiv32, gate: "P51-REC1", cmd: "node tests_p50_core.js", only: "P51-REC1",
    reason: /sem escopo de endpoint|além do escopo/i,
    find: `      { n: "FortiClient administrado por EMS", w: "descoberta, inventário, varredura e patching no escopo de endpoint; não substitui uma plataforma completa de gestão de vulnerabilidades" },`,
    repl: `      { n: "FortiClient administrado por EMS", w: "plataforma universal de gestão de vulnerabilidades para todo o ambiente" },` },

  { id: "M51-07", desc: "recomendação é anexada ao gap errado",
    file: F.uiv32, gate: "P51-REC1", cmd: "node tests_p50_core.js", only: "P51-REC1",
    reason: /FortiClient|escopo de endpoint|apoio/i,
    find: `const QS_GAP_SUPPORT = {
  "detection-lifecycle": {`,
    repl: `const QS_GAP_SUPPORT = {
  "training": {` },

  { id: "M51-08", desc: "option do cenário-alvo volta a herdar cor/fundo",
    file: F.css, gate: "P51-VIS2", cmd: "node tests_p50_chromium.js",
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
    file: F.shell, gate: "P51-RPT2", cmd: "node tests_p50_core.js", only: "P51-RPT2",
    reason: /label importado não refletido|Sem rótulo|rótulo/i,
    find: `    p51Meta.label = (typeof doc.label === "string" && doc.label.trim()) ? doc.label : null;`,
    repl: `    if (typeof doc.label === "string" && doc.label.trim()) p51Meta.label = doc.label;` },

  { id: "M51-10", desc: "data de geração usada como data da sessão",
    file: F.uiv32, gate: "P51-RPT2", cmd: "node tests_p50_core.js", only: "P51-RPT2",
    reason: /mesmo instante|sessionDateISO/i,
    find: `    sessionDateISO: m ? m.startedAt : null,`,
    repl: `    sessionDateISO: new Date().toISOString(),` },

  { id: "M51-11", desc: "régua marca posição mesmo sem suficiência",
    file: F.uiv32, gate: "P51-PDF1", cmd: "node tests_p50_chromium.js",
    reason: /marcou posição com dados insuficientes|não determinado/i,
    find: `  const determinado = suff && overall !== null;`,
    repl: `  const determinado = true; overall = overall === null ? 0 : overall;` },

  { id: "M51-12", desc: "régua diverge de stageOf() numa borda",
    file: F.uiv32, gate: "P51-RPT3", cmd: "node tests_p50_core.js", only: "P51-RPT3",
    reason: /divergência em|borda/i,
    find: `  bands: qsStageBands,
  stageAt: v => stageOf(v)`,
    repl: `  bands: qsStageBands,
  stageAt: v => stageOf(v < 2.5 ? v : v + 0.6)` },

  { id: "M51-13", desc: "ordem/cor de dois domínios trocada no sistema gráfico",
    file: F.uiv32, gate: "P51-RPT4", cmd: "node tests_p50_core.js", only: "P51-RPT4",
    reason: /legenda \d+: cor|não contém/i,
    find: `    + DOMS.map((d,i)=>\`<span class="pr-domleg" data-dom-legend="\${i}"><span class="pr-domsw" data-dom-sw style="background:\${PR_DOM_HEX[i]}"></span>\${i+1}. \${esc32(d.pt)}</span>\`).join("")`,
    repl: `    + DOMS.map((d,i)=>\`<span class="pr-domleg" data-dom-legend="\${i}"><span class="pr-domsw" data-dom-sw style="background:\${PR_DOM_HEX[(i+1)%5]}"></span>\${i+1}. \${esc32(d.pt)}</span>\`).join("")`},

  { id: "M51-14", desc: "SVG do emblema passa a variar com o score",
    file: F.uiv32, gate: "P51-RPT5", cmd: "node tests_p50_core.js", only: "P51-RPT5",
    reason: /varia entre sessão baixa e alta|não é neutro/i,
    find: `  const linha = QS_PENTA.map(p=>\`\${p.x},\${p.y}\`).join(" ");`,
    repl: `  const __s = DOMS.map((_,i)=>domStat(i).score||0).reduce((a,b)=>a+b,0);
  const linha = QS_PENTA.map(p=>\`\${(p.x+__s*0.01).toFixed(2)},\${p.y}\`).join(" ");` },

  { id: "M51-15", desc: "emblema perde os rótulos completos dos domínios",
    file: F.uiv32, gate: "P51-RPT5", cmd: "node tests_p50_core.js", only: "P51-RPT5",
    reason: /rótulo '.*' ausente/i,
    find: `text-anchor="\${p.anchor}" fill="#3A3A40">\${esc32(nomes[i])}</text>\``,
    repl: `text-anchor="\${p.anchor}" fill="#3A3A40">\${esc32(nomes[i].slice(0,1))}</text>\`` },

  { id: "M51-16", desc: "capa colide com o cabeçalho no PDF",
    file: F.uiv32, gate: "P51-PDF1", cmd: "node tests_p50_chromium.js",
    reason: /colidem|capa/i,
    find: `  let h = qsCoverHTML();`,
    repl: `  let h = \`<div style="position:absolute;top:0;left:0;height:400px">\` + qsCoverHTML() + \`</div>\`;` },

  /* ---------------- ERRATA pós-auditoria independente (2026-08-22) ----------------
     Dois mutantes novos, um por gate novo. M51-17 é exatamente a mutação
     adversarial AUD-02 do auditor, que sobreviveu a 162 gates e virou a
     ressalva R1. M51-18 é o regresso do blocker B1: o agregado do relatório
     de volta à forma sem arredondamento. */
  { id: "M51-17", desc: "sinal do gap Current × Target invertido na matriz única (AUD-02)",
    file: F.results, gate: "P51-VIS3", cmd: "node tests_p50_core.js", only: "P51-VIS3",
    reason: /gap|sinal|negativo/i,
    find: `          gap: (score !== null && tScore !== null) ? p50Round1(tScore - score) : null,`,
    repl: `          gap: (score !== null && tScore !== null) ? p50Round1(score - tScore) : null,` },

  { id: "M51-18", desc: "agregado do relatório volta à forma sem arredondamento (regresso do B1)",
    file: F.uiv32, gate: "P51-RPT6", cmd: "node tests_p50_core.js", only: "P51-RPT6",
    reason: /KPI diz|régua lê|jornada|leitura executiva|canônico/i,
    find: `  /* ERRATA B1 · agregado do relatorio na forma canonica (mesma de renderResults,
     legacySnapshot, computeTargetProfile e buildNarrativeSnapshot): arredondar ANTES
     de nomear o estagio, para que numero impresso e nome da faixa nunca divirjam. */
  const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;`,
    repl: `  /* ERRATA B1 · agregado do relatorio na forma canonica (mesma de renderResults,
     legacySnapshot, computeTargetProfile e buildNarrativeSnapshot): arredondar ANTES
     de nomear o estagio, para que numero impresso e nome da faixa nunca divirjam. */
  const overall = suff && scored.length ? (scored.reduce((a,s)=>a+s.score,0)/scored.length) : null;` },

  { id: "M51-19", desc: "manual volta a descrever o score geral como média das respostas (R2)",
    file: F.guide, gate: "P51-DOC13", cmd: "node tests_p50_core.js", only: "P51-DOC13",
    reason: /score geral|m[ée]dia dos .{0,12}cinco scores|redação imprecisa/i,
    find: `**Score 0–5.** O score **por domínio** é a média das respostas confirmadas daquele domínio,
arredondada a uma casa. O score **geral** é a média dos **cinco scores de domínio** — não a média
direta das respostas.`,
    repl: `**Score 0–5.** Média das respostas confirmadas. Por domínio e geral. O score **geral** e o score
**por domínio** saem da mesma conta.` },

  { id: "M51-20", desc: "manual volta a listar régua e legenda como seções próprias (R3)",
    file: F.guide, gate: "P51-DOC13", cmd: "node tests_p50_core.js", only: "P51-DOC13",
    reason: /§12|ordem|item \d+|legenda|r[ée]gua/i,
    find: `4. **Prioridades declaradas pelo negócio**, já na **página 2**;`,
    repl: `4. **Régua 0–5** — posição do score entre os seis estágios;
5. **Legenda dos domínios** — nomes completos, na ordem canônica;
6. **Prioridades declaradas pelo negócio**, já na **página 2**;` }
];

/* Seleção por mutante (MUT_ONLY) — vale para a campanha E para o preflight. */
function selecionar() {
  const only = (process.env.MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}

/* Conta as ocorrências da âncora no arquivo-alvo. É CONTAGEM, não presença: 0 é
   âncora podre e ≥2 é âncora ambígua — as duas reprovam, e a mutação nunca é
   aplicada "na primeira ocorrência". */
function ocorrencias(m) {
  return fs.readFileSync(m.file, "utf8").split(m.find).length - 1;
}

/* ── T6 · modo preflight (argv, D6) · emite o contrato C1 ───────────────────
   Não muta, não reconstrói, não executa gate, não escreve arquivo nenhum.
   stdout carrega SÓ o objeto JSON; todo texto humano vai para stderr. */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "p51",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* Declaração do que o harness realmente muta — oráculo de IC-6. Sai de
       MUTANTS inteiro, não da seleção: MUT_ONLY filtra a medição, não o alvo. */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    /* [014/E3] Extensão ADITIVA do contrato C1 (demanda 014-gate-sem-poder-discriminante,
       errata E3): mutante cujo arquivo é `.css` carrega também a ÂNCORA
       (`find`/`repl`). Sem ela a varredura de regra morta sabe QUAIS mutantes
       existem mas não QUAL declaração cada um altera — e "zero regras mortas"
       vira vácuo, não veredito (medido antes desta extensão: 49 de 49 avaliados
       sem âncora). Só para `.css`, por decisão registrada: campo de contrato sem
       consumidor apodrece, e os outros 169 mutantes não têm quem leia a deles.
       ADITIVA de verdade: `check_mutation.py` valida apenas as chaves
       obrigatórias de C1 (IC-4, :320-323), então nenhum consumidor existente
       quebra. O preflight segue sendo contrato — não muta, não reconstrói, não
       roda gate, não escreve: só acrescenta duas chaves ao objeto de stdout. */
    if (/\.css$/i.test(e.arquivo)) { e.find = m.find; e.repl = m.repl; }
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT p51 · " + dados.mutantes.length + " mutante(s) · interpretador " +
    PY + " (" + PY_ORIGEM + "): " + (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
  for (const m of dados.mutantes) {
    process.stderr.write("  " + (m.estado === "ok" ? "ok           " : "nao_executavel") + " " +
      m.id + " · ocorrencias=" + m.ocorrencias + " em " + m.arquivo +
      (m.causa ? " · " + m.causa : "") + "\n");
  }
  process.stderr.write(podres.length
    ? podres.length + " âncora(s) fora de ocorrencias == 1: " + podres.map(m => m.id).join(", ") + "\n"
    : "todas as âncoras com ocorrencias == 1\n");
  if (!binario) process.stderr.write(CAUSA.interpretador + ": " + PY + "\n");
  return (binario && podres.length === 0) ? 0 : 1;
}

if (process.argv.slice(2).indexOf("--preflight") >= 0) {
  process.exit(preflight(selecionar().sel));
}

(async () => {
  const { only, sel } = selecionar();
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, desc: m.desc, gate: m.gate, estado,
                  causa: causa || "", nota: nota || "",
                  detected: estado === DETECTADO, line: String(linha || "").slice(0, 300) });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).slice(0, 220));
  };

  /* IC-3(a) · interpretador ausente aborta ANTES de mutar: nenhum arquivo é
     tocado, nenhum recibo é escrito, a árvore fica limpa e nada é "detectado". */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de mutar; nenhum arquivo tocado");
    for (const m of sel) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "", "");
  } else {
    for (const m of sel) {
      const src = fs.readFileSync(m.file, "utf8");
      const n = src.split(m.find).length - 1;
      /* Âncora provada ANTES de mutar (T6/IC-4): sem unicidade não se muta. */
      if (n !== 1) {
        emitir(m, NAO_EXECUTADO, (n === 0 ? CAUSA.ausente : CAUSA.ambigua + " (n=" + n + ")"),
          "ocorrencias=" + n + " em " + path.basename(m.file), "");
        continue;
      }
      let estado = "", causa = "", nota = "", linha = "";
      try {
        fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
        const rb = build();
        if (rb.code !== 0) {
          estado = NAO_EXECUTADO; causa = CAUSA.rebuild;
          nota = (rb.erro || String(rb.out).trim().split("\n").pop() || "").slice(0, 160);
        } else {
          const r = run(m.cmd, m.only ? { P50_ONLY: m.only } : {});
          linha = gateLine(r.out, m.gate) || "";
          if (r.spawnFalhou) {
            estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = r.erro.slice(0, 160);
          } else if (!linha) {
            /* D1 · a suíte rodou e não emitiu linha do gate esperado: o gate não
               foi executado (filtro que não seleciona gate nenhum). Nunca
               SOBREVIVENTE — sobrevivência exige que o gate tenha rodado. */
            estado = NAO_EXECUTADO; causa = CAUSA.gate;
            nota = "a suíte não emitiu linha PASS/FAIL de " + m.gate +
                   " (exit " + r.code + ")" + (m.only ? " · filtro only=" + m.only : "");
          } else {
            const reprovou = /^FAIL/.test(linha);
            const motivo = reprovou && m.reason.test(linha);
            estado = (reprovou && motivo) ? DETECTADO : SOBREVIVENTE;
            if (!reprovou) nota = "o gate esperado NÃO reprovou";
            else if (!motivo) nota = "reprovou por motivo diferente do esperado";
          }
        }
      } catch (e) {
        estado = NAO_EXECUTADO;
        causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
      } finally {
        fs.writeFileSync(m.file, src, "utf8");
        build();
      }
      /* Restauração byte a byte provada por SHA — regressão preservada. */
      if (sha(m.file) !== BASE[m.file]) {
        emitir(m, NAO_EXECUTADO, naoClassificada("restauração divergente em " + path.basename(m.file)),
          "campanha interrompida: a árvore não voltou ao estado base", "");
        for (const resto of sel.slice(sel.indexOf(m) + 1)) {
          emitir(resto, NAO_EXECUTADO,
            naoClassificada("campanha interrompida por restauração divergente"), "", "");
        }
        break;
      }
      emitir(m, estado, causa, nota, linha);
    }
  }

  const T = sel.length;
  if (U > 0) {
    /* T5 · um número que não foi medido não é impresso: a razão D/T some. */
    console.log("\nCAMPANHA NÃO CONCLUÍDA · " + D + " detectados · " + S + " sobreviventes · " +
      U + " não executados (de " + T + ")");
    for (const r of report.filter(r => r.estado === NAO_EXECUTADO)) {
      console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    }
  } else {
    /* Linha histórica preservada LITERALMENTE quando a campanha conclui (R13):
       é ela que mantém comparabilidade com a evidência das fases 5.0-5.2. */
    console.log("\nMUTATION TESTING (Phase 5.1): " + D + "/" + T + " mutantes detectados pelo gate e motivo esperados");
    if (S > 0) console.log("  " + S + " sobrevivente(s): " +
      report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
  }
  if (!only.length && binario) {
    fs.mkdirSync(path.join(HERE, "docs_phase5", "evidence_p51"), { recursive: true });
    fs.writeFileSync(path.join(HERE, "docs_phase5", "evidence_p51", "P51-mutation.json"),
      JSON.stringify({ baseline: BASE, detected: D, sobreviventes: S, nao_executados: U,
                       total: T, mutants: report }, null, 2) + "\n", "utf8");
  }
  process.exit(D === T ? 0 : 1);
})();
