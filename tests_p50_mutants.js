/* ============================================================================
   HARNESS DE MUTAÇÃO · PHASE 5.0 · microfases 5.0.1 + 5.0.2 + 5.0.3
   Prova o PODER DISCRIMINANTE dos gates novos. Para cada mutante:
     1. aplica a mutação no source do módulo novo;
     2. reconstrói o HTML;
     3. executa o gate ESPERADO;
     4. exige FAIL do gate ESPERADO com MOTIVO compatível
        (detecção incidental ou apenas por manifesto NÃO conta);
     5. restaura o source e confere o SHA-256 byte a byte.

   Este harness NÃO integra test:all: é executado sob demanda na entrega da
   microfase e o seu resultado é evidência de auditoria.

   DEMANDA 013 · integridade da campanha — E1 na p50, commit (a)
   -------------------------------------------------------------
   T1 · o interpretador tem UMA fonte: `MUTATION_PY` (override do operador) ou o
        padrão por plataforma da referência da casa (tests_core_mutants.js:22).
        É a MESMA regra de check_mutation.py (C4) — o que se declara e o que se
        invoca passam a ser a mesma coisa. O caminho do script vai entre aspas
        (R10 §7): a família P2.1-16/I11/S64 quebrou em path com espaço.
   T4/T5 · TRÊS estados, vocabulário fechado: DETECTADO · SOBREVIVENTE ·
        NÃO EXECUTADO (este sempre com UMA causa do conjunto fechado). Antes
        havia dois rótulos, e tudo que não fosse detecção caía em "NÃO
        DETECTADO": âncora podre, rebuild quebrado e gate que não rodou eram
        lidos como sobrevivência. Um número que não foi medido não é impresso —
        havendo não executado, a razão D/T some e o exit é ≠ 0. Com U == 0 a
        linha histórica fica LITERAL (R13).
   T6 · `--preflight` (argv): resolve o interpretador e CONTA as ocorrências da
        âncora de cada um dos 53 mutantes no arquivo-alvo. Não muta, não
        reconstrói, não executa gate, não escreve nada. Um objeto JSON em stdout
        (contrato C1); texto humano em stderr. Exit 0 sse interpretador
        resolvido e toda âncora com ocorrencias == 1.
   D1 · gate que NÃO rodou nunca é sobrevivente. Id de gate digitado errado no
        filtro faz a suíte selecionar zero gates e sair 0; a ausência da linha
        PASS/FAIL do gate ESPERADO passa a ser `NÃO EXECUTADO · gate não pôde
        ser executado`, com o filtro nomeado na nota.
   T3 (commit (b)) · nenhum `cmd` de mutante carrega prefixo POSIX de variável:
        os 26 filtros `P50_ONLY=` saíram das strings de comando e passaram para o
        campo `only`, entregue pela opção `env` de execSync — a mesma plumbing
        que o runner já aceitava e que o laço principal não usava. Prefixo POSIX
        em `cmd` não é interpretado no shell do Windows: o filtro ia embora e a
        suíte inteira rodava. A supressão de evidência (`P50_NO_EVIDENCE`)
        continua aplicada POR CONSTRUÇÃO a toda execução do runner, não por
        lembrança de autor (B-AUD-503-1).
   Shape de referência: tests_p51_mutants.js (W3). Cópia de shape, nunca
   extração de runner comum (R9).
   ========================================================================== */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const SHELL = path.join(HERE, "ui_p50_shell_v32.js");
const CSS = path.join(HERE, "ui_p50_v32.css");
const SUFF = path.join(HERE, "ui_p50_suff_v32.js");
const RESULTS = path.join(HERE, "ui_p50_results_v32.js");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

/* baseline por CAMINHO: a restauração de todo mutante é conferida byte a byte */
const MUTABLE = [SHELL, CSS, SUFF, RESULTS];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });

/* ============================================================================
   B-AUD-503-1 · guarda pre/post de TODO o acervo de evidência.
   Um mutante torna o produto deliberadamente defeituoso; qualquer escrita de
   evidência nessa condição contamina o acervo auditado. A supressão de escrita
   (P50_NO_EVIDENCE=1, central em run()) é a barreira PREVENTIVA; esta guarda é
   a DETECTIVA.

   Escopo CORRIGIDO: a versão anterior fotografava apenas o acervo "histórico",
   excluindo o prefixo da microfase corrente (P50-5.0.3-*) — exatamente o
   prefixo que M20 regravava com render mutado. A guarda ficava cega para o
   único caso que precisava enxergar. Agora a fotografia cobre o DIRETÓRIO
   INTEIRO, prefixo corrente incluído, e detecta as três formas de violação:
   arquivo ALTERADO, arquivo REMOVIDO e arquivo ADICIONADO indevidamente.

   Fora de `evidence_p50/` nada é vigiado: outputs temporários permitidos (o
   HTML reconstruído, artefatos de suíte em tmp) não são evidência publicada e
   não podem fazer a campanha abortar.
   ========================================================================== */
const EVIDENCE_DIR = path.join(HERE, "docs_phase5", "evidence_p50");
const CURRENT_PREFIX = "P50-5.0.3-";
const evidenceList = () => (fs.existsSync(EVIDENCE_DIR) ? fs.readdirSync(EVIDENCE_DIR).sort() : []);
const GUARDED = evidenceList();
const GUARD_BYTES = {};
GUARDED.forEach(n => { GUARD_BYTES[n] = fs.readFileSync(path.join(EVIDENCE_DIR, n)); });
const guardSha = n => crypto.createHash("sha256").update(GUARD_BYTES[n]).digest("hex");
const GUARDED_CURRENT = GUARDED.filter(n => n.indexOf(CURRENT_PREFIX) === 0).length;

/* Confere o diretório inteiro e, se pedido, restaura os bytes originais.
   Devolve a lista NOMEADA de violações (alterado / removido / adicionado). */
function checkEvidence(restore) {
  const violated = [];
  GUARDED.forEach(n => {
    const f = path.join(EVIDENCE_DIR, n);
    if (!fs.existsSync(f)) {
      violated.push("REMOVIDO " + n);
      if (restore) fs.writeFileSync(f, GUARD_BYTES[n]);
      return;
    }
    const now = sha(f);
    if (now !== guardSha(n)) {
      violated.push("ALTERADO " + n + " (" + now.slice(0, 16) + " != " + guardSha(n).slice(0, 16) + ")");
      if (restore) fs.writeFileSync(f, GUARD_BYTES[n]);
    }
  });
  evidenceList().forEach(n => {
    if (GUARD_BYTES[n] !== undefined) return;
    violated.push("ADICIONADO " + n);
    if (restore) fs.unlinkSync(path.join(EVIDENCE_DIR, n));
  });
  return violated;
}
let BASE_HTML_SHA = null;

/* ── T1 · interpretador: fonte ÚNICA, a mesma de check_mutation.py (C4) ──────
   `MUTATION_PY` é o override explícito do operador; sem ele vale o padrão da
   referência da casa (tests_core_mutants.js:22). Precedente de forma do seam:
   `CHROME_PATH`. Havia aqui um nome fixo embutido no literal de comando, que
   fazia a campanha abortar sem classificação em toda máquina cujo interpretador
   não atende por esse nome. */
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

/* Caminho do script SEMPRE entre aspas (R10 §7). `build()` DEVOLVE o resultado:
   rebuild quebrado por mutante é causa fechada de T4, não crash sem rótulo. */
function build() { return run(`"${PY}" "${BUILD_PY}"`); }
/* Rebuild cujo fracasso não é classificável (árvore base, restauração, modo de
   prova da guarda): continua sendo ruído alto, como antes de 013. */
function buildOuFalha(onde) {
  const r = build();
  if (r.code !== 0)
    throw new Error(onde + ": rebuild falhou · " +
      (r.erro || String(r.out).trim().split("\n").pop() || "").slice(0, 200));
  return r;
}

/* ============================================================================
   B-AUD-503-1 · SUPRESSÃO CENTRAL DE ESCRITA DE EVIDÊNCIA.
   A flag NÃO pode depender de cada mutante lembrar de incluí-la na sua string
   `cmd`: foi exatamente esse esquecimento (M20 sem a flag, enquanto M10 a
   tinha) que deixou o produto MUTADO regravar todo o prefixo P50-5.0.3-*.
   Aqui a supressão é aplicada POR CONSTRUÇÃO ao ambiente de TODA execução
   disparada pelo runner: nenhum mutante presente ou futuro escapa dela.
   A flag suprime SOMENTE a escrita de arquivos; as asserções das suítes
   continuam executando integralmente e o exit code continua real — é assim
   que M20 permanece DETECTADO pelo gate, e nunca contado como erro ambiental.
   ========================================================================== */
const SUPPRESS_EVIDENCE = { P50_NO_EVIDENCE: "1" };
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, SUPPRESS_EVIDENCE, envOverride || {});
  try {
    return { code: 0, spawnFalhou: false, erro: "",
             out: execSync(cmd, { cwd: HERE, stdio: "pipe", env }).toString() };
  } catch (e) {
    /* `status` indefinido = o processo não chegou a existir (spawn). Distinguir
       spawn de exit ≠ 0 é o que impede um gate NÃO EXECUTADO de ser lido como
       sobrevivente — o colapso de estados que a demanda 013 mata. Antes, o
       `e.status || 1` achatava as duas coisas no mesmo código. */
    const spawnFalhou = e.status === undefined || e.status === null;
    return { code: spawnFalhou ? -1 : e.status, spawnFalhou,
             erro: spawnFalhou ? String(e.message || e).split("\n")[0] : "",
             out: (e.stdout || "").toString() + (e.stderr || "").toString() };
  }
}

/* T3 · o filtro por gate é o campo `only` do mutante e chega pela opção `env`
   acima — nunca por prefixo POSIX na string `cmd`, que o shell do Windows não
   interpreta (o filtro sumia e a suíte inteira rodava). */
const filtro = m => (m.only ? { P50_ONLY: m.only } : {});

/* Extrai a linha de resultado do gate alvo (PASS/FAIL + motivo entre colchetes).
   Ausência de linha = o gate não rodou — é a decisão D1: filtro que não seleciona
   gate nenhum é NÃO EXECUTADO, jamais SOBREVIVENTE. */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
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
  {
    id: "M1",
    desc: "remover a chamada do predecessor em window.__uxDecor",
    file: SHELL,
    find: `      p50PrevInvocations++;
      try { p50PrevDecor(app); }
      catch (e) { console.error("P50 predecessor:", e.message); }`,
    repl: `      p50PrevInvocations++;`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /predecessor não foi invocado/
  },
  {
    id: "M2",
    desc: "remover a chamada do predecessor no wrapper de render",
    file: SHELL,
    find: `    var r = p50PrevRender.apply(this, arguments);          /* predecessor SEMPRE, e antes */`,
    repl: `    var r = undefined;                                     /* MUTANTE: predecessor suprimido */`,
    gate: "UX 4.1", cmd: "node tests_ux_m41.js",
    reason: /FAIL\s+UX/,
    lineless: true
  },
  {
    id: "M3",
    desc: "trocar o mapeamento de dois answer cards",
    file: SHELL,
    find: `      var val = (raw === "NA") ? "NA" : String(parseInt(raw, 10));`,
    repl: `      var val = (raw === "NA") ? "NA" : String(parseInt(raw, 10) === 1 ? 2 : (parseInt(raw, 10) === 2 ? 1 : parseInt(raw, 10)));`,
    gate: "P50-UX1", cmd: "node tests_p50_core.js",
    reason: /ordem\/valores|título dessincronizado|ans .* != /
  },
  {
    id: "M4",
    desc: "trocar o acionamento do handler congelado por escrita direta em ans[k]",
    file: SHELL,
    find: `      card.click();
      return;`,
    repl: `      var mk = step - 1, mv = card.getAttribute("data-p50-value");
      ans[mk] = (mv === "NA") ? "NA" : parseInt(mv, 10);
      render();
      return;`,
    gate: "P50-UX2", cmd: "node tests_p50_core.js",
    reason: /caminho congelado invocado 0 vez/
  },
  {
    id: "M5",
    desc: "dessincronizar a descrição canônica d de uma opção",
    file: SHELL,
    find: `          c.setAttribute("data-p50-optd", o.d);`,
    repl: `          c.setAttribute("data-p50-optd", opts[(parseInt(val, 10) + 1) % 4].d);`,
    gate: "P50-UX1", cmd: "node tests_p50_core.js",
    reason: /descrição canônica dessincronizada/
  },
  {
    id: "M6",
    desc: "renderizar 0.0 para domínio sem resposta confirmada",
    file: SHELL,
    find: `        }, "n/d"));`,
    repl: `        }, "0.0"));`,
    gate: "P50-SUF2", cmd: "node tests_p50_core.js",
    reason: /visível '0\.0'|zero fabricado/
  },
  {
    id: "M7",
    desc: "introduzir derivação local de suficiência no renderer novo",
    file: SHELL,
    find: `    var answered = 0;`,
    repl: `    var mutSuff = confirmedCount() >= 10;
    void mutSuff;
    var answered = 0;`,
    gate: "P50-SUF0", cmd: "node tests_p50_core.js",
    reason: /limiar global 10|compara confirmedCount|deriva suficiência/
  },
  {
    id: "M8",
    desc: "introduzir hexadecimal de cor de domínio na camada nova",
    file: CSS,
    find: `#p50-shell .p50-qlabel{ color:var(--text); }`,
    repl: `#p50-shell .p50-qlabel{ color:#307FE2; }`,
    gate: "P50-COR1", cmd: "node tests_p50_core.js",
    reason: /declara hex de domínio|declara hex literal/
  },
  {
    id: "M9",
    desc: "remover a proteção de idempotência do shell",
    file: SHELL,
    find: `    var old = document.getElementById("p50-shell");
    if (old) old.remove();`,
    repl: `    var old = null;`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /shell duplicado|não é idempotente/
  },
  {
    id: "M11",
    desc: "neutralizar o guard de reentrância da composição de __uxDecor",
    file: SHELL,
    find: `    if (p50DecorDepth > 0) { p50DecorReentriesBlocked++; return; }   /* reentrância contida */`,
    repl: `    if (false) { p50DecorReentriesBlocked++; return; }   /* MUTANTE: guard neutralizado */`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /reexecutada por reentrância|reentrância|recurs/i
  },
  {
    id: "M12",
    desc: "cue exibir a descrição de outra opção (dessincronizada da seleção)",
    file: SHELL,
    find: `      var dEl = sel ? sel.querySelector(".d") : null;`,
    repl: `      var dEl = document.querySelector("#app .opts .opt[data-p50-value='3'] .d");`,
    gate: "P50-UX3", cmd: "node tests_p50_core.js",
    reason: /cue != opts|cue stale/
  },
  {
    id: "M13",
    desc: "escrever a evidência direto em notes[k] em vez do setter congelado",
    file: SHELL,
    find: `  function p50OnNoteInput() {
    try {`,
    repl: `  function p50OnNoteInput() {
    try {
      notes[step - 1] = String(notes[step - 1] || "");`,
    gate: "P50-UX4", cmd: "node tests_p50_core.js",
    reason: /campo canônico de nota não foi aberto|escreve diretamente em notes/
  },
  {
    id: "M14",
    desc: "fabricar um chip sem provenance no runtime (weight class)",
    file: SHELL,
    find: `    var hint = scr.querySelector("p.hint");`,
    repl: `    chips.appendChild(el("span", { "class": "p50-chip", "data-p50": "chip",
      "data-p50-chip": "weight", role: "listitem", "aria-label": "Peso" }, "Importance: alta"));
    var hint = scr.querySelector("p.hint");`,
    gate: "P50-UX5", cmd: "node tests_p50_core.js",
    reason: /conjunto de chips|chip fabricado|esperados 3 chips/
  },
  {
    id: "M15",
    desc: "renderizar a evidência como marcação em vez de texto inerte",
    file: SHELL,
    find: `      ev.appendChild(el("p", { "class": "p50-ev-txt", "data-p50": "evidence-preview" }, preview));`,
    repl: `      var pnode = el("p", { "class": "p50-ev-txt", "data-p50": "evidence-preview" });
      pnode.innerHTML = preview;
      ev.appendChild(pnode);`,
    gate: "P50-UX12", cmd: "node tests_p50_core.js",
    reason: /gerou .* elemento|gerou marcação|executou|escape de contexto|nó executável/
  },
  {
    id: "M16",
    desc: "manter o wording de export mesmo com modificações posteriores",
    file: SHELL,
    find: `    if (p50IsDirty()) return "default";          /* honestidade tem precedência */`,
    repl: `    /* MUTANTE: honestidade removida */`,
    gate: "P50-SESUX2", cmd: "node tests_p50_core.js",
    reason: /wording de export persistiu|modificação pós-export/
  },
  {
    id: "M17",
    desc: "serializar o estado efêmero de sessão dentro dos inputs canônicos",
    file: SHELL,
    find: `  function p50MarkClean() { p50CleanSnapshot = p50Canon(); }`,
    repl: `  function p50MarkClean() {
    p50CleanSnapshot = p50Canon();
    try { OPERATIONAL_REFINEMENT.answers.p50SessionState = p50SesState; } catch (e) {}
  }`,
    gate: "P50-SESUX5", cmd: "node tests_p50_core.js",
    reason: /estado efêmero serializado|bloco inputs alterado|roundtrip|inválido/
  },
  {
    id: "M18",
    desc: "remover a reconciliação no evento REAL de evidência (B-502-1)",
    file: SHELL,
    find: `    ta.addEventListener("input", p50OnNoteInput);`,
    repl: `    void p50OnNoteInput;   /* MUTANTE: reconciliação removida */`,
    gate: "P50-SESUX2", cmd: "node tests_p50_core.js",
    reason: /status stale após digitar evidência|dirty não reconciliado|wording de export permaneceu/
  },
  {
    id: "M19",
    desc: "manter o estado `imported` após edição da evidência",
    file: SHELL,
    find: `    if (p50IsDirty()) return "default";          /* honestidade tem precedência */`,
    repl: `    if (p50IsDirty() && p50SesState !== "imported") return "default";`,
    gate: "P50-SESUX3", cmd: "node tests_p50_core.js",
    reason: /estado imported persistiu|wording de import permaneceu|dirty não reconciliado/
  },
  {
    id: "M20",
    desc: "omitir dirty e falha do texto acessível (aria-label sobrescrevendo a live region)",
    file: SHELL,
    find: `      role: "status", "aria-live": "polite"`,
    repl: `      role: "status", "aria-live": "polite",
      "aria-label": "Estado da sessão: " + msg[0] + " " + msg[1]`,
    gate: "P50-SESUX1B", cmd: "node tests_p50_chromium.js",
    reason: /aria-label sobrescreve|texto acessível/
  },
  {
    id: "M21",
    desc: "remover o wrapper de export (downloadSession não observado)",
    file: SHELL,
    find: `      var r = p50SesInvoke("download", p50PrevDownloadSession, this, arguments);`,
    repl: `      var r = p50PrevDownloadSession.apply(this, arguments);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /predecessor invocado 0|contadores|identidade do objeto retornado|`this` do predecessor/
  },
  {
    id: "M22",
    desc: "remover o wrapper de import (importSessionDocument não observado)",
    file: SHELL,
    find: `      var r = p50SesInvoke("import", p50PrevImportSessionDocument, this, arguments);`,
    repl: `      var r = p50PrevImportSessionDocument.apply(this, arguments);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /import ok=true não marcou imported|import ok=false marcou imported|retorno de falha de import/
  },
  {
    id: "M23",
    desc: "inverter a leitura de r.ok no observador de export",
    file: SHELL,
    find: `        if (r && r.ok) {
          p50SesState = "exported"; p50MarkClean();`,
    repl: `        if (r && !r.ok) {
          p50SesState = "exported"; p50MarkClean();`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /ok=true não marcou exported|ok=false marcou exported|ok=true não marcou clean/
  },
  {
    id: "M24",
    desc: "duplicar a invocação do predecessor de sessão",
    file: SHELL,
    find: `    var pred = p50SesSub[kind] || fallback;
    p50SesPredCalls[kind]++;
    return pred.apply(ctx, args);`,
    repl: `    var pred = p50SesSub[kind] || fallback;
    p50SesPredCalls[kind]++;
    pred.apply(ctx, args);
    p50SesPredCalls[kind]++;
    return pred.apply(ctx, args);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /predecessor invocado 2|contadores/
  },
  {
    id: "M10",
    desc: "dessincronizar o estado acessível do card do estado canônico",
    file: SHELL,
    find: `      c.setAttribute("data-p50-selected", isSel ? "true" : "false");`,
    repl: `      c.setAttribute("data-p50-selected", "false");`,
    /* a supressão NÃO vive mais aqui: é central em run() (B-AUD-503-1) */
    gate: "P50-ACC6", cmd: "node tests_p50_chromium.js",
    reason: /data-p50-selected=false/
  },

  /* ===================== microfase 5.0.3 · suficiência ===================== */
  {
    id: "M25",
    desc: "alterar o limiar GLOBAL da declaração única",
    file: SUFF,
    find: `var P50_SUFF_REQUIRED = { global: 10, domain: 2 };`,
    repl: `var P50_SUFF_REQUIRED = { global: 9, domain: 2 };`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /requiredGlobal|missingGlobal|sufficient/
  },
  {
    id: "M26",
    desc: "alterar o limiar POR DOMÍNIO da declaração única",
    file: SUFF,
    find: `  var P50_SUFF_REQUIRED = { global: 10, domain: 2 };`,
    repl: `  var P50_SUFF_REQUIRED = { global: 10, domain: 1 };`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /domains\[\d\]\.required|domains\[\d\]\.missing|sufficient/
  },
  {
    id: "M27",
    desc: "fazer `null` contar como resposta confirmada na contagem global",
    file: SUFF,
    find: `    var confirmedGlobal = confirmedCount();`,
    repl: `    var confirmedGlobal = ans.filter(function (v) { return v !== "NA"; }).length;`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /confirmedGlobal|missingGlobal|sufficient/
  },
  {
    id: "M28",
    desc: "fazer `\"NA\"` contar como resposta confirmada na contagem global",
    file: SUFF,
    find: `  function p50SuffContract() {
    var confirmedGlobal = confirmedCount();`,
    repl: `  function p50SuffContract() {
    var confirmedGlobal = ans.filter(function (v) { return v !== null; }).length;`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /confirmedGlobal|missingGlobal|sufficient/
  },
  {
    id: "M29",
    desc: "fazer `0` (NONE) deixar de confirmar na composição por domínio",
    file: SUFF,
    find: `    return { confirmed: st.n, toValidate: st.nNA, unanswered: total - st.n - st.nNA, total: total };`,
    repl: `    var noneless = st.idx.filter(function (k) { return ans[k] !== null && ans[k] !== "NA" && ans[k] !== 0; }).length;
    return { confirmed: noneless, toValidate: st.nNA, unanswered: total - st.n - st.nNA, total: total };`,
    gate: "P50-SUF6", cmd: "node tests_p50_core.js", only: "P50-SUF6",
    reason: /NONE \(0\) não foi contado como confirmado|confirmada/
  },
  {
    id: "M30",
    desc: "permitir déficit GLOBAL incorreto e negativo",
    file: SUFF,
    find: `    var missingGlobal = p50Deficit(P50_SUFF_REQUIRED.global, confirmedGlobal);`,
    repl: `    var missingGlobal = P50_SUFF_REQUIRED.global - confirmedGlobal;`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /missingGlobal/
  },
  {
    id: "M31",
    desc: "permitir déficit de DOMÍNIO incorreto e negativo",
    file: SUFF,
    find: `      var miss = p50Deficit(P50_SUFF_REQUIRED.domain, have);`,
    repl: `      var miss = P50_SUFF_REQUIRED.domain - have;`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /domains\[\d\]\.missing/
  },
  {
    id: "M32",
    desc: "listar domínio SATISFEITO como condição pendente",
    file: SUFF,
    find: `      if (dd.missing > 0) out.push(dd);`,
    repl: `      if (dd.missing >= 0) out.push(dd);`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /pendências|pending/
  },
  {
    id: "M33",
    desc: "omitir domínio DEFICITÁRIO das condições pendentes",
    file: SUFF,
    find: `      var dd = contract.domains[i];
      if (dd.missing > 0) out.push(dd);`,
    repl: `      var dd = contract.domains[i];
      if (dd.missing > 1) out.push(dd);`,
    gate: "P50-SUF3", cmd: "node tests_p50_core.js", only: "P50-SUF3",
    reason: /pendências .* != déficits reais/
  },
  {
    id: "M34",
    desc: "fazer `sufficient` considerar somente o requisito global",
    file: SUFF,
    find: `      sufficient: missingGlobal === 0 && allDomainsMet`,
    repl: `      sufficient: missingGlobal === 0`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /sufficient|dataSufficiency/
  },
  {
    id: "M35",
    desc: "renderer do gate passa a conter o limiar literal",
    file: RESULTS,
    find: `  function p50BuildResults(contract) {
    var released = contract.sufficient === true;`,
    repl: `  function p50BuildResults(contract) {
    var released = contract.confirmedGlobal >= 10;`,
    gate: "P50-SUF0", cmd: "node tests_p50_core.js", only: "P50-SUF0",
    reason: /limiar global 10/
  },
  {
    id: "M36",
    desc: "renderer do gate reimplementa a comparação de suficiência",
    file: RESULTS,
    find: `  function p50BuildResults(contract) {
    var released = contract.sufficient === true;`,
    repl: `  function p50BuildResults(contract) {
    var released = contract.confirmedGlobal >= contract.requiredGlobal;`,
    gate: "P50-SUF0", cmd: "node tests_p50_core.js", only: "P50-SUF0",
    reason: /gate da UI .* != veredito canônico/
  },
  {
    id: "M37",
    desc: "expor estágio executivo com o gate FECHADO",
    file: RESULTS,
    find: `    if (released) sec.appendChild(p50ExecCards());
    return sec;`,
    repl: `    sec.appendChild(el("p", { "data-p50": "stage" }, "Managed"));
    if (released) sec.appendChild(p50ExecCards());
    return sec;`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /estágio presente sob gate fechado|estágio executivo renderizado/
  },
  {
    id: "M38",
    desc: "expor executive cards com o gate FECHADO",
    file: RESULTS,
    find: `    if (released) sec.appendChild(p50ExecCards());`,
    repl: `    sec.appendChild(p50ExecCards());`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /executive cards presentes sob gate fechado|executive card presente/
  },
  {
    id: "M39",
    desc: "impedir o desbloqueio quando o veredito canônico abre",
    file: RESULTS,
    find: `  function p50BuildResults(contract) {
    var released = contract.sufficient === true;
    var sec = el("section", {`,
    repl: `  function p50BuildResults(contract) {
    var released = false;
    var sec = el("section", {`,
    gate: "P50-SUF4", cmd: "node tests_p50_core.js", only: "P50-SUF4",
    reason: /gate da UI não desbloqueou|executive cards não liberados/
  },
  {
    id: "M40",
    desc: "não remover a superfície anterior: conteúdo executivo stale sobrevive ao rebloqueio",
    file: RESULTS,
    find: `    var old = document.getElementById("p50-results");
    if (old && old.parentNode) old.parentNode.removeChild(old);`,
    repl: `    var old = document.getElementById("p50-results");
    if (false && old && old.parentNode) old.parentNode.removeChild(old);`,
    gate: "P50-SUF5", cmd: "node tests_p50_core.js", only: "P50-SUF5",
    reason: /executive cards permaneceram|card executivo stale|superfície duplicada|score stale|estágio stale/
  },
  {
    id: "M41",
    desc: "fazer `0` (NONE) deixar de confirmar no CONTRATO (distinto de M29, que ataca a composição)",
    file: SUFF,
    find: `  function p50SuffContract() {
    var confirmedGlobal = confirmedCount();
    var domains = [];`,
    repl: `  function p50SuffContract() {
    var confirmedGlobal = ans.filter(function (v) { return v !== null && v !== "NA" && v !== 0; }).length;
    var domains = [];`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /confirmedGlobal|missingGlobal|sufficient|0 \(NONE\) não confirmou/
  },
  {
    id: "M42",
    desc: "quebrar a ordem canônica de DOMS no contrato (domínios reordenados)",
    file: SUFF,
    find: `      domains.push({
        domainId: i,`,
    repl: `      domains.unshift({
        domainId: i,`,
    gate: "P50-SUF7", cmd: "node tests_p50_core.js", only: "P50-SUF7",
    reason: /domainId|confirmed|missing/
  },
  {
    id: "M43",
    desc: "promover score parcial de domínio a veredito executivo sob gate FECHADO",
    file: RESULTS,
    find: `    if (released) {
      var canonical = domStat(i).score;               /* score canônico, já computado */`,
    repl: `    if (true) {
      var canonical = domStat(i).score;               /* score canônico, já computado */`,
    gate: "P50-SUF2", cmd: "node tests_p50_core.js", only: "P50-SUF2",
    reason: /estado scored sob gate fechado|valor .* != n\/d|número fabricado|estado \w+ sob gate fechado/
  },

  /* ============ errata estreita 5.0.3 · B-503-COHERENCE ============
     Cada mutante deixa a superfície LEGADA contradizer o veredito canônico.
     A detecção tem de vir do gate semântico correspondente, com motivo
     compatível — nunca de manifesto ou lint incidental. */
  {
    id: "M44",
    desc: "deixar o score parcial legado exposto sob insuficiência",
    file: RESULTS,
    find: `        legHide(value, "gone");`,
    repl: `        void value;   /* MUTANTE: score parcial legado segue exposto */`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /permanece visível na tela|substituto honesto ausente/
  },
  {
    id: "M45",
    desc: "esconder à vista mas manter o estágio legado na árvore acessível",
    file: RESULTS,
    find: `    node.setAttribute("aria-hidden", "true");
    node.classList.add(mode === "veiled" ? "p50-legacy-veiled" : "p50-legacy-gone");`,
    repl: `    node.classList.add(mode === "veiled" ? "p50-legacy-veiled" : "p50-legacy-gone");   /* MUTANTE: some da tela, fica na árvore acessível */`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /permanece na árvore acessível|estágio de maturidade acessível na página/
  },
  {
    id: "M46",
    desc: "deixar o ruler parcial preenchido sob insuficiência",
    file: RESULTS,
    find: `        legHide(fill, "gone");`,
    repl: `        void fill;   /* MUTANTE: preenchimento parcial permanece exposto */`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /ruler\(s\) preenchido\(s\) exposto/
  },
  {
    id: "M47",
    desc: "deixar o radar parcial exposto sob insuficiência",
    file: RESULTS,
    find: `          if (!radar.children[i].classList.contains("p50-legacy-note")) legHide(radar.children[i], "veiled");`,
    repl: `          void i;   /* MUTANTE: radar parcial permanece exposto */`,
    gate: "P50-SUF1", cmd: "node tests_p50_core.js", only: "P50-SUF1",
    reason: /nó\(s\) do radar ainda expostos|radar parcial não neutralizado/
  },
  {
    id: "M48",
    desc: "falhar em restaurar a superfície legada no unlock",
    file: RESULTS,
    find: `        legShow(value);
        legShow(conf);
        legShow(fill);`,
    repl: `        void value; void conf; void fill;   /* MUTANTE: restauração do unlock não ocorre */`,
    gate: "P50-SUF4", cmd: "node tests_p50_core.js", only: "P50-SUF4",
    reason: /nó congelado permanece oculto|valor legado permanece oculto|preenchimento\(s\) exposto\(s\)|marcador de neutralização stale/
  },
  {
    id: "M49",
    desc: "perder a capacidade de neutralizar de novo depois de restaurar (relock)",
    file: RESULTS,
    find: `  function legHide(node, mode) {
    if (!node || node.getAttribute("data-p50-legacy") === "hidden") return;`,
    repl: `  function legHide(node, mode) {
    if (!node || node.getAttribute("data-p50-legacy") === "hidden") return;
    if (node.getAttribute("data-p50-sealed") !== null) return;   /* MUTANTE: não re-neutraliza */
    node.setAttribute("data-p50-sealed", "1");`,
    gate: "P50-SUF5", cmd: "node tests_p50_core.js", only: "P50-SUF5",
    reason: /permanece visível na tela|permanece na árvore acessível|estágio de maturidade acessível/
  },

  /* ============ pós-auditoria FAIL · B-AUD-503-2 e RQ-AUD-2 ============
     Continuação do inventário após M49, sem reutilizar IDs. */
  {
    id: "M50",
    desc: "trocar as leituras canônicas da moeda por recontagem paralela em ans[]",
    file: SUFF,
    find: `    var confirmedGlobal = confirmedCount();`,
    repl: `    var confirmedGlobal = 0;
    for (var mk = 0; mk < ans.length; mk++) {
      if (ans[mk] !== null && ans[mk] !== "NA") confirmedGlobal++;   /* MUTANTE: owner paralelo */
    }`,
    gate: "P50-SUF0", cmd: "node tests_p50_core.js", only: "P50-SUF0",
    reason: /owner paralelo|recontar respostas|indexa ans|itera ans|reproduz a fórmula|não reflete a sentinela/
  },
  {
    id: "M51",
    desc: "remover o escopo @media screen da neutralização (vazamento para o print legado)",
    file: CSS,
    find: `@media screen{
  #app .p50-legacy-gone{ display:none !important; }
  #app .p50-legacy-veiled{ visibility:hidden !important; }
  #app .radar-box.p50-legacy-off{ position:relative; }
  #app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }
}`,
    repl: `#app .p50-legacy-gone{ display:none !important; }
#app .p50-legacy-veiled{ visibility:hidden !important; }
#app .radar-box.p50-legacy-off{ position:relative; }
#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }`,
    gate: "P50-PR1", cmd: "node tests_p50_chromium.js",
    reason: /ausente do papel|não é a superfície impressa|difere do baseline de entrada|fills visíveis no papel|espaço mutilado/
  },

  /* ==========================================================================
     B-AUD-FIN-503-1 · CLASSE NOVA DE MUTANTE — regra CONTÍNUA desconfinada.
     `M51` cobre a remoção do bloco `@media screen` inteiro, que produz sumiço
     BINÁRIO de conteúdo e já era detectável por visibilidade e texto. Os dois
     mutantes abaixo cobrem a classe distinta que passou despercebida: uma
     regra de neutralização deixada FORA do bloco, que não faz nada sumir e
     apenas ATENUA ou REPOSICIONA o nó congelado no papel legado. Só o oracle
     de apresentação contínua de `P50-PR1` os enxerga.
     ========================================================================== */
  {
    id: "M52",
    desc: "opacidade de neutralização desconfinada (vaza atenuação para o print legado)",
    file: CSS,
    find: `#app .lbl > .p50-legacy-note{ margin:0; margin-left:auto; color:var(--faint); }`,
    repl: `#app .lbl > .p50-legacy-note{ margin:0; margin-left:auto; color:var(--faint); }
#app .dom[data-p50-legacy="neutralized"] .ruler{ opacity:.45; }   /* MUTANTE: fora de @media screen */`,
    gate: "P50-PR1", cmd: "node tests_p50_chromium.js",
    reason: /estilo divergente em \.ruler\[\d+\] propriedade opacity: baseline "1", candidato "0\.45"/
  },
  {
    id: "M53",
    desc: "posicionamento de neutralização desconfinado (vaza contexto de posicionamento para o print legado)",
    file: CSS,
    find: `#app .p50-legacy-note{
  margin:6px 0 0; color:var(--muted);`,
    repl: `#app .radar-box.p50-legacy-off{ position:relative; }   /* MUTANTE: fora de @media screen */
#app .p50-legacy-note{
  margin:6px 0 0; color:var(--muted);`,
    gate: "P50-PR1", cmd: "node tests_p50_chromium.js",
    reason: /estilo divergente em \.radar-box\[\d+\] propriedade position: baseline "static", candidato "relative"/
  }
];

/* Filtro OPCIONAL (MUT_ONLY="M7,M40") para verificação dirigida durante o
   desenvolvimento. A campanha de entrega roda SEM filtro; quando o filtro está
   ativo o total impresso declara explicitamente a execução parcial. Vale para a
   campanha E para o preflight. */
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
    harness: "p50",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* Declaração do que o harness realmente muta. Sai de MUTANTS inteiro, não da
       seleção: MUT_ONLY filtra a medição, não o alvo. */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT p50 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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

/* ============================================================================
   B-AUD-503-1 §2.3 · PROVA NÃO VACUOSA DA GUARDA (MUT_GUARD_PROOF=1)
   Uma guarda que nunca disparou não é evidência de nada. Este modo controlado
   executa exatamente o roteiro exigido:
     1. desativa DELIBERADAMENTE a supressão de escrita para uma execução
        isolada de M20 (o mutante que regravava o prefixo corrente);
     2. exige que a guarda DETECTE os artefatos P50-5.0.3-* modificados;
     3. exige restauração BYTE-IDÊNTICA de todos eles;
     4. restaura a barreira preventiva;
     5. roda M20 de novo, agora com a barreira, e prova ZERO escrita.
   O modo é autocontido: o source do mutante é sempre restaurado e o HTML
   reconstruído, de modo que a candidata NUNCA fica em estado mutado.
   ========================================================================== */
function guardProof() {
  const m = MUTANTS.filter(x => x.id === "M20")[0];
  if (!m) throw new Error("MUT_GUARD_PROOF: M20 ausente do inventário");
  const orig = fs.readFileSync(m.file, "utf8");
  const steps = [];
  const fail = [];
  try {
    if (orig.indexOf(m.find) < 0) throw new Error("MUT_GUARD_PROOF: âncora de M20 não encontrada");
    fs.writeFileSync(m.file, orig.replace(m.find, m.repl), "utf8");
    buildOuFalha("MUT_GUARD_PROOF/mutação");

    /* 1 · barreira preventiva DESATIVADA para esta execução isolada */
    const unguarded = run(m.cmd, Object.assign({}, filtro(m), { P50_NO_EVIDENCE: "0" }));
    const detected = checkEvidence(false);
    const touchedCurrent = detected.filter(v => v.indexOf(CURRENT_PREFIX) >= 0);
    steps.push("1. M20 sem supressão · exit=" + unguarded.code);

    /* 2 · a guarda TEM de enxergar o prefixo corrente sendo regravado */
    steps.push("2. guarda detectou " + detected.length + " violação(ões), " +
      touchedCurrent.length + " no prefixo corrente");
    if (!touchedCurrent.length)
      fail.push("a guarda NÃO detectou escrita mutada no prefixo " + CURRENT_PREFIX + "* " +
        "(detecções: " + (detected.join(" · ") || "nenhuma") + ")");
    detected.slice(0, 8).forEach(v => steps.push("     · " + v));

    /* 3 · restauração byte-idêntica */
    checkEvidence(true);
    const after = checkEvidence(false);
    steps.push("3. após restauração: " + after.length + " divergência(s)");
    if (after.length) fail.push("restauração NÃO byte-idêntica: " + after.join(" · "));

    /* 4 · barreira preventiva restaurada (padrão de run()) */
    steps.push("4. barreira preventiva restaurada (P50_NO_EVIDENCE central em run())");

    /* 5 · M20 de novo, agora com a barreira: zero escrita */
    const guarded = run(m.cmd, filtro(m));
    const residue = checkEvidence(false);
    steps.push("5. M20 com supressão · exit=" + guarded.code + " · violações=" + residue.length);
    if (residue.length) fail.push("houve escrita mesmo com a barreira: " + residue.join(" · "));
    if (guarded.code === 0)
      fail.push("M20 com supressão terminou com exit 0 — o comando Chromium interno deve falhar");
    if (!/aria-label sobrescreve|texto acessível/.test(guarded.out))
      fail.push("M20 com supressão não foi detectado pelo motivo semântico esperado");
    steps.push("   M20 permanece DETECTADO pelo gate P50-SESUX1B (motivo semântico preservado)");
  } finally {
    fs.writeFileSync(m.file, orig, "utf8");
    if (sha(m.file) !== BASE_SHA[m.file]) throw new Error("MUT_GUARD_PROOF: restauração do source NÃO byte-idêntica");
    buildOuFalha("MUT_GUARD_PROOF/restauração");
    checkEvidence(true);
  }
  const ok = fail.length === 0;
  console.log(steps.join("\n"));
  console.log("\n" + (ok ? "PASS" : "FAIL") +
    "  MUT-GUARD-PROOF — a guarda de evidence_p50/ detecta e restaura escrita mutada do prefixo corrente" +
    (ok ? "" : " [" + fail.join(" · ") + "]"));
  return ok;
}

/* RQ-REAUD-2 · qualificação nominal por suíte. Os IDs `M50`/`M51`/`M52`/`M53`
   coincidem nominalmente com IDs da matriz de engine (`tests_m42_m86.js`).
   Cada linha individual passa a se autoqualificar, e não apenas o cabeçalho,
   o arquivo e a evidência. */
const SUITE_NS = "P50";
const QUAL = id => SUITE_NS + "::" + id;

(function main() {
  const { only: MUT_ONLY, sel: SELECTED } = selecionar();
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, desc: m.desc, gate: m.gate, estado,
                  causa: causa || "", nota: nota || "",
                  /* `detected` preservado: o recibo da 5.0.3 é lido por auditoria
                     anterior a esta demanda e não pode perder o campo. */
                  detected: estado === DETECTADO, line: String(linha || "").slice(0, 200) });
    console.log(estado + "  " + QUAL(m.id) + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).slice(0, 200));
    console.log("");
  };

  /* T5 · um número que não foi medido não é impresso; com U == 0 a linha
     histórica sai LITERAL (R13), que é o que mantém comparabilidade com a
     evidência das microfases 5.0.x. */
  const fechar = () => {
    const MUTANT_IDS = SELECTED.map(m => QUAL(m.id));
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_p50_mutants.js · namespace " + SUITE_NS + "]" +
        (MUT_ONLY.length ? " [PARCIAL]" : "") + ": " + D + " detectados · " + S +
        " sobreviventes · " + U + " não executados (de " + MUTANT_IDS.length + ")" +
        (MUT_ONLY.length ? " · inventário completo: " + MUTANTS.length : ""));
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO)) {
        console.log("  NÃO EXECUTADO  " + QUAL(r.id) + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
      }
    } else {
      console.log("\nMUTATION TESTING (5.0.1+5.0.2+5.0.3) [tests_p50_mutants.js · namespace " + SUITE_NS + "]" + (MUT_ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + MUTANT_IDS.length + " mutantes detectados pelo gate e motivo esperados" +
        (MUT_ONLY.length ? " · inventário completo: " + MUTANTS.length : ""));
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => QUAL(r.id)).join(", "));
    }
    /* Recibo só quando houve campanha completa e medida. BASE_HTML_SHA nulo =
       nada foi construído (interpretador ausente): não se escreve recibo de
       campanha que não existiu. */
    if (!MUT_ONLY.length && BASE_HTML_SHA) {
      fs.mkdirSync(path.join(HERE, "docs_phase5", "evidence_p50"), { recursive: true });
      const baseline = {}; MUTABLE.forEach(f => { baseline[path.basename(f)] = BASE_SHA[f]; });
      baseline.html = BASE_HTML_SHA;
      /* Evidência NOVA da 5.0.3; as evidências anteriores permanecem preservadas. */
      fs.writeFileSync(path.join(HERE, "docs_phase5", "evidence_p50", "P50-5.0.3-mutation.json"),
        JSON.stringify({ baseline, ids: MUTANT_IDS, detected: D, sobreviventes: S,
          nao_executados: U, total: MUTANT_IDS.length, mutants: report }, null, 2) + "\n", "utf8");
    }
    process.exit(D === MUTANTS.length ? 0 : 1);
  };

  /* T1/IC-3(a) · interpretador ausente NÃO é mais um crash sem rótulo no build
     inicial: é classificado. Aborta ANTES de construir e antes de mutar —
     nenhum arquivo tocado, nenhum recibo escrito, a árvore fica limpa, e nada é
     dado por detectado ou por sobrevivente. */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de construir e antes de mutar; nenhum arquivo tocado\n");
    if (MUT_ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + MUT_ONLY.join(", ") + "\n");
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "", "");
    return fechar();
  }

  const rb0 = build();
  if (rb0.code !== 0) {
    console.log("build da árvore BASE falhou (" + PY + ", " + PY_ORIGEM + ") — " +
      "campanha abortada antes de mutar; nenhum arquivo tocado\n");
    const detalhe = (rb0.erro || String(rb0.out).trim().split("\n").pop() || "").slice(0, 160);
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.rebuild, "árvore base · " + detalhe, "");
    return fechar();
  }
  BASE_HTML_SHA = sha(HTML);
  console.log("interpretador: " + PY + " (" + PY_ORIGEM + ") resolvido em " + binario);
  console.log("acervo sob guarda: " + GUARDED.length + " artefato(s) em evidence_p50/ (inclui " +
    GUARDED_CURRENT + " do prefixo corrente " + CURRENT_PREFIX + "*)");
  const pre = checkEvidence(false);
  if (pre.length) throw new Error("pré-condição: acervo de evidência já divergente — " + pre.join(" · "));
  MUTABLE.forEach(f => console.log("baseline " + path.basename(f).padEnd(24) + " : " + BASE_SHA[f]));
  console.log("baseline html                     : " + BASE_HTML_SHA + "\n");

  if (process.env.MUT_GUARD_PROOF === "1") { process.exit(guardProof() ? 0 : 1); }

  if (MUT_ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + MUT_ONLY.join(", ") + "\n");

  for (const m of SELECTED) {
    const orig = fs.readFileSync(m.file, "utf8");
    /* Âncora provada por CONTAGEM antes de mutar (T6/IC-4): sem unicidade não se
       muta. `indexOf` aceitava âncora ambígua e mutava a primeira ocorrência. */
    const n = orig.split(m.find).length - 1;
    if (n !== 1) {
      emitir(m, NAO_EXECUTADO, (n === 0 ? CAUSA.ausente : CAUSA.ambigua + " (n=" + n + ")"),
        "ocorrencias=" + n + " em " + path.basename(m.file), "");
      continue;
    }
    let estado = "", causa = "", nota = "", linha = "";
    try {
      fs.writeFileSync(m.file, orig.replace(m.find, m.repl), "utf8");
      const rb = build();
      if (rb.code !== 0) {
        estado = NAO_EXECUTADO; causa = CAUSA.rebuild;
        nota = (rb.erro || String(rb.out).trim().split("\n").pop() || "").slice(0, 160);
      } else {
        const r = run(m.cmd, filtro(m));
        if (r.spawnFalhou) {
          /* D1 · o processo do gate não chegou a existir: NÃO EXECUTADO. */
          estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = r.erro.slice(0, 160);
        } else if (m.lineless) {
          /* Mutante sem linha nomeada de gate (M2 · UX 4.1): o oráculo é o exit
             da suíte inteira, que rodou. Continua um par detectado/sobrevivente. */
          linha = (r.out.match(/^FAIL\s+\S+.*$/m) || [""])[0];
          const reprovou = r.code !== 0 && m.reason.test(r.out);
          estado = reprovou ? DETECTADO : SOBREVIVENTE;
          if (!reprovou) nota = "a suíte não reprovou pelo motivo esperado (exit " + r.code + ")";
        } else {
          linha = gateLine(r.out, m.gate) || "";
          if (!linha) {
            /* D1 · a suíte rodou e não emitiu linha do gate esperado: o gate não
               foi executado (id de gate errado no filtro seleciona ZERO gates e
               sai 0). Nunca SOBREVIVENTE — sobrevivência exige gate executado. */
            estado = NAO_EXECUTADO; causa = CAUSA.gate;
            nota = "a suíte não emitiu linha PASS/FAIL de " + m.gate +
                   " (exit " + r.code + ")" + (m.only ? " · filtro only=" + m.only : "");
          } else {
            const reprovou = /^FAIL/.test(linha);
            const motivo = m.reason.test(linha);
            estado = (reprovou && motivo) ? DETECTADO : SOBREVIVENTE;
            if (!reprovou) nota = "o gate esperado NÃO reprovou";
            else if (!motivo) nota = "reprovou por motivo diferente do esperado";
          }
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      fs.writeFileSync(m.file, orig, "utf8");
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica");
      /* guarda pre/post de TODO o acervo (B-AUD-503-1) */
      const violated = checkEvidence(true);
      if (violated.length) {
        build();
        throw new Error(m.id + ": acervo de evidência violado durante o mutante — " +
          violated.join(" · ") + " (bytes restaurados; campanha abortada · " +
          "nenhuma evidência mutada sobrevive ao mutante seguinte)");
      }
    }
    emitir(m, estado, causa, nota, linha);
  }

  buildOuFalha("fecho da campanha");
  const htmlBack = sha(HTML);
  const evFinal = checkEvidence(false);
  if (evFinal.length) throw new Error("acervo de evidência divergente ao fim da campanha — " + evFinal.join(" · "));
  console.log("acervo de evidência: " + GUARDED.length + "/" + GUARDED.length +
    " byte-idênticos ao início (prefixo corrente incluído); zero arquivo escrito durante a campanha");
  const restored = MUTABLE.map(f => path.basename(f) + " " + (sha(f) === BASE_SHA[f] ? "OK" : "DIVERGENTE"));
  console.log("restauração: " + restored.join(" · ") +
    " · html " + (htmlBack === BASE_HTML_SHA ? "OK" : "DIVERGENTE (" + htmlBack + ")"));
  fechar();
})();
