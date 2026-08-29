/* ============================================================================
   HARNESS DE MUTAÇÃO · PHASE 5.2
   Prova o PODER DISCRIMINANTE dos gates novos. Para cada mutante:
     1. aplica a mutação no source;
     2. reconstrói o HTML determinístico;
     3. executa o gate SEMANTICAMENTE correspondente, filtrado;
     4. exige FAIL desse gate, com MOTIVO compatível — detecção incidental
        (manifesto, identidade de arquivo, contagem global) NÃO conta;
     5. restaura o source e confere o SHA-256 byte a byte.

   Os dez mutantes são exatamente os da §14.3 da diretriz. O último não toca a
   camada de layout: ele muta o cálculo do cenário-alvo para demonstrar que a
   reorganização visual NÃO enfraqueceu os contratos funcionais congelados.

   Este harness não integra `test:all`: roda sob demanda e o resultado é
   evidência de auditoria.

   DEMANDA 013 · integridade da campanha — E1 na p52 (a maior: 107 mutantes)
   -------------------------------------------------------------------------
   T1 · o interpretador tem UMA fonte: `MUTATION_PY` (override do operador) ou o
        padrão por plataforma da referência da casa (tests_core_mutants.js:22).
        É a MESMA regra de check_mutation.py (C4) — o que se declara e o que se
        invoca passam a ser a mesma coisa. Havia aqui um nome fixo embutido no
        literal de comando do build, que fazia a campanha abortar sem
        classificação em toda máquina cujo interpretador não atende por esse
        nome. O caminho do script vai entre aspas (R10 §7): a família
        P2.1-16/I11/S64 quebrou em diretório com espaço no caminho.
   T3 · JÁ CUMPRIDA antes desta demanda e preservada byte a byte: nenhum dos 107
        `cmd` carrega prefixo POSIX de variável, e o filtro por gate viaja pelo
        campo `only` na opção `env` de execSync (`envOverride`). Este harness é a
        REFERÊNCIA do eixo do prefixo — a p50 e a p51 copiaram daqui. A supressão
        de evidência (`SUPPRESS`) é aplicada POR CONSTRUÇÃO a toda execução do
        runner, não por lembrança de autor (B-AUD-503-1).
   T4/T5 · TRÊS estados, vocabulário fechado: DETECTADO · SOBREVIVENTE ·
        NÃO EXECUTADO (este sempre com UMA causa do conjunto fechado). Antes
        havia dois rótulos e um terceiro fora do vocabulário: "NÃO APLICÁVEL"
        para âncora podre, e todo o resto caía em "NÃO DETECTADO" — rebuild
        quebrado e gate que não rodou eram lidos como sobrevivência. Um número
        que não foi medido não é impresso: havendo não executado, a razão D/T
        some e o exit é ≠ 0. Com U == 0 a linha histórica sai LITERAL (R13), que
        é o que mantém comparabilidade com a evidência da fase 5.2.
   T6 · `--preflight` (argv): resolve o interpretador e CONTA as ocorrências da
        âncora de cada um dos 107 mutantes no arquivo-alvo. Não muta, não
        reconstrói, não executa gate, não escreve nada. Um objeto JSON em stdout
        (contrato C1); texto humano em stderr. Exit 0 sse interpretador
        resolvido e toda âncora com ocorrencias == 1.
   D1 · gate que NÃO rodou nunca é sobrevivente. Id de gate digitado errado no
        filtro faz a suíte selecionar zero gates e sair 0; a ausência da linha
        PASS/FAIL do gate ESPERADO passa a ser `NÃO EXECUTADO · gate não pôde
        ser executado`, com o filtro nomeado na nota.
   Shape de referência: tests_p51_mutants.js (W3) e tests_p50_mutants.js (W4).
   Cópia de shape, nunca extração de runner comum (R9).
   ========================================================================== */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const P52JS = path.join(HERE, "ui_p52_workspace_v32.js");
const P52CSS = path.join(HERE, "ui_p52_workspace_v32.css");
const TGTJS = path.join(HERE, "ui_target_v32.js");
const SHELL = path.join(HERE, "ui_p50_shell_v32.js");
const UIJS = path.join(HERE, "ui_v32.js");
/* ERRATA FINAL · ALTO-1/MÉDIO-2 · superfícies novas sob mutação: a régua da
   jornada e a Camada 5 também publicam o cenário-alvo, e a COBERTURA do gate
   de contraste é ela própria uma propriedade que precisa ser atacada. */
const JOURNEY = path.join(HERE, "ui_journey_v32.js");
const P50RES = path.join(HERE, "ui_p50_results_v32.js");
const P52TESTS = path.join(HERE, "tests_p52_chromium.js");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const MUTABLE = [P52JS, P52CSS, TGTJS, SHELL, UIJS, JOURNEY, P50RES, P52TESTS];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });
let BASE_HTML_SHA = null;

/* Guarda do acervo de evidência da fase: nenhum byte pode ser escrito ou
   alterado enquanto o produto estiver mutado. */
const EVID = path.join(HERE, "docs_phase5", "evidence_p52");
/* PATCH V3.2.2 · o acervo desta rodada vive num diretório novo e nominal e
   entra sob a MESMA guarda: nenhum byte de evidência pode ser escrito ou
   alterado enquanto o produto estiver deliberadamente defeituoso. */
const EVID322 = path.join(HERE, "docs_phase5", "evidence_v322");
/* o acervo passou a ter subdiretório (`pdf/`): a guarda cobre os ARQUIVOS de
   primeiro nível e a existência do subdiretório, sem tentar lê-lo como arquivo. */
const EVID_DIRS = [EVID, EVID322];
/* chave = "<diretório>/<arquivo>", para que dois acervos nunca se confundam */
const evidenceList = () => {
  const out = [];
  EVID_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter(n => fs.statSync(path.join(dir, n)).isFile())
      .forEach(n => out.push(path.basename(dir) + "/" + n));
  });
  return out.sort();
};
const evidencePath = key => path.join(HERE, "docs_phase5", key);
const GUARDED = evidenceList();
const GUARD_BYTES = {};
GUARDED.forEach(n => { GUARD_BYTES[n] = fs.readFileSync(evidencePath(n)); });
function checkEvidence(restore) {
  const bad = [];
  GUARDED.forEach(n => {
    const f = evidencePath(n);
    if (!fs.existsSync(f)) { bad.push("REMOVIDO " + n); if (restore) fs.writeFileSync(f, GUARD_BYTES[n]); return; }
    const now = sha(f);
    const want = crypto.createHash("sha256").update(GUARD_BYTES[n]).digest("hex");
    if (now !== want) { bad.push("ALTERADO " + n); if (restore) fs.writeFileSync(f, GUARD_BYTES[n]); }
  });
  evidenceList().forEach(n => {
    if (GUARD_BYTES[n] !== undefined) return;
    bad.push("ADICIONADO " + n);
    if (restore) fs.unlinkSync(evidencePath(n));
  });
  return bad;
}

/* ── T1 · interpretador: fonte ÚNICA, a mesma de check_mutation.py (C4) ──────
   `MUTATION_PY` é o override explícito do operador; sem ele vale o padrão da
   referência da casa (tests_core_mutants.js:22). Precedente de forma do seam:
   `CHROME_PATH`. */
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
/* Rebuild cujo fracasso não é classificável (árvore base, restauração, fecho da
   campanha): continua sendo ruído alto, como antes de 013. */
function buildOuFalha(onde) {
  const r = build();
  if (r.code !== 0)
    throw new Error(onde + ": rebuild falhou · " +
      (r.erro || String(r.out).trim().split("\n").pop() || "").slice(0, 200));
  return r;
}

/* B-AUD-503-1 · SUPRESSÃO CENTRAL DE ESCRITA DE EVIDÊNCIA, aplicada POR
   CONSTRUÇÃO ao ambiente de TODA execução disparada pelo runner: nenhum mutante
   presente ou futuro escapa dela por esquecimento de autor. */
const SUPPRESS = { P52_NO_EVIDENCE: "1", P50_NO_EVIDENCE: "1", V322_NO_EVIDENCE: "1" };
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, SUPPRESS, envOverride || {});
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

/* T3 (já cumprida antes de 013) · o filtro por gate é o campo `only` do mutante
   e chega pela opção `env` acima — nunca por prefixo POSIX na string `cmd`, que
   o shell do Windows não interpreta. Este é o shape que a p50 e a p51 copiaram. */
const filtro = m => (m.only ? { P52_ONLY: m.only } : {});

/* Extrai a linha de resultado do gate alvo (PASS/FAIL + motivo).
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

/* ==========================================================================
   Os dez mutantes da §14.3.
   ========================================================================== */
const MUTANTS = [
  {
    id: "P52-M1",
    desc: "restaurar o teto de 980px da largura útil (voltar à faixa central estreita)",
    file: P52CSS,
    find: `    width: min(96vw, 2480px);
    max-width: none;`,
    repl: `    width: auto;
    max-width: 980px;`,
    gate: "P52-LAY1", cmd: "node tests_p52_chromium.js", only: "P52-LAY1",
    reason: /largura (útil|de conteúdo) \d+px </
  },
  {
    id: "P52-M2",
    desc: "retirar o grid-column:1/-1 do rodapé na tela de pergunta",
    file: P52CSS,
    find: `    body[data-uxscreen="question"] .wrap > footer { grid-column: 1 / -1; grid-row: 5; }`,
    repl: `    body[data-uxscreen="question"] .wrap > footer { grid-column: 2; grid-row: 5; }`,
    gate: "P52-LAY2", cmd: "node tests_p52_chromium.js", only: "P52-LAY2",
    reason: /rodapé (com \d+px de|começa dentro da coluna lateral)/
  },
  {
    id: "P52-M3",
    desc: "empilhar o cenário-alvo DEPOIS do contexto tecnológico",
    file: P52JS,
    find: `    { key: "target",     title: "Cenário-alvo" },
    { key: "context",    title: "Contexto tecnológico" },`,
    repl: `    { key: "context",    title: "Contexto tecnológico" },
    { key: "target",     title: "Cenário-alvo" },`,
    gate: "P52-TGT1", cmd: "node tests_p52_layout.js", only: "P52-TGT1",
    reason: /contexto \(\d+\) antes do alvo|alvo não é imediatamente posterior/
  },
  {
    id: "P52-M4",
    desc: "deixar dois controles de evidência na tela de pergunta",
    file: P52JS,
    find: `    t.setAttribute("data-p52-evidence", state);
    t.classList.add("p52-evidence-btn");`,
    repl: `    t.setAttribute("data-p52-evidence", state);
    t.classList.add("p52-evidence-btn");
    if (t.parentNode && !document.getElementById("p52-evid-dup"))
      t.parentNode.appendChild(el("button", { id: "p52-evid-dup", type: "button" }, "Adicionar evidência ou observação"));`,
    gate: "P52-Q1", cmd: "node tests_p52_layout.js", only: "P52-Q1",
    reason: /\d+ controles de evidência/
  },
  {
    id: "P52-M5",
    desc: "remover o marcador de grupo ativo do editor de contexto",
    file: P52CSS,
    find: `  #v32editor details[data-p52-grp="open"] > summary::before { content: "▾"; }`,
    repl: `  #v32editor details[data-p52-grp="open"] > summary::before { content: "▸"; }`,
    gate: "P52-CTX1v", cmd: "node tests_p52_chromium.js", only: "P52-CTX1v",
    reason: /marcador de estado idêntico/
  },
  {
    id: "P52-M6",
    desc: "misturar gaps altos e moderados num único grupo",
    file: P52JS,
    find: `        var sev = p52SeverityOf(nodes[i]);
        if (sev) { cards[sev].push(nodes[i]); continue; }`,
    repl: `        var sev = "high";
        if (sev) { cards[sev].push(nodes[i]); continue; }`,
    gate: "P52-GAP1", cmd: "node tests_p52_layout.js", only: "P52-GAP1",
    reason: /grupos? de severidade não existe|fora do grupo correto|contador de/
  },
  {
    id: "P52-M7",
    desc: "neutralizar a cor canônica das tags de domínio",
    file: P52CSS,
    find: `    background: var(--dom-accent);
    margin-right: 7px; vertical-align: baseline;`,
    repl: `    background: var(--line);
    margin-right: 7px; vertical-align: baseline;`,
    gate: "P52-DOM1c", cmd: "node tests_p52_chromium.js", only: "P52-DOM1c",
    reason: /amostra rgb\(.*\) != canônica/
  },
  {
    id: "P52-M8",
    desc: "reduzir visualmente apenas o artwork do FortiGuard",
    file: P52CSS,
    find: `  .icon-tile img { width: 46px; height: 46px; object-fit: contain; }`,
    repl: `  .icon-tile img { width: 46px; height: 46px; object-fit: contain; }
  .icon-tile img[alt*="FortiGuard"] { width: 30px; height: 30px; }`,
    gate: "P52-ICON1", cmd: "node tests_p52_chromium.js", only: "P52-ICON1",
    reason: /desvio de [\d.]+% da mediana|artwork aparente [\d.]+% do tile/
  },
  {
    /* REPONTUAÇÃO · ERRATA DA AUDITORIA EXTERNA · B-02/B-03.
       A mutação original retirava `#p52-rail` da lista de supressão de print.
       Depois da correção de B-02 ela ficou INERTE — e a inércia é, ela própria,
       evidência da correção: `preparePrint()` passou a aplicar sempre
       `v32-print-mode`, e a regra congelada `body.v32-print-mode .wrap
       {display:none}` retira do papel a `.wrap` INTEIRA, com o trilho dentro.
       Suprimir o trilho individualmente virou redundância.
       A OBRIGAÇÃO do mutante — provar que o cromo do workspace não alcança o
       papel — é preservada, agora atacando o ÚNICO ponto que hoje a garante. */
    id: "P52-M9",
    desc: "vazar o cromo do workspace para o papel (não aplicar v32-print-mode)",
    file: UIJS,
    find: `  el.innerHTML = html;
  document.body.classList.add("v32-print-mode");`,
    repl: `  el.innerHTML = html;`,
    gate: "P52-PR1", cmd: "node tests_p52_chromium.js", only: "P52-PR1",
    reason: /vazou para o papel: trilho|ainda imprime a tela sem contexto declarado|ainda pintado no papel/
  },
  /* ---------------- REV A · ajuste de UAT visual (§10) ---------------- */
  {
    id: "P52-RA1",
    desc: "voltar a misturar ambiente/condicionantes entre as capabilities",
    file: P52JS,
    find: `      gids: ["arch", "plat", "sig"] }`,
    repl: `      gids: [] }`,
    gate: "P52-CTX2", cmd: "node tests_p52_layout.js", only: "P52-CTX2",
    reason: /grupos = |regiões de primeiro nível|grupos fora das duas regiões/
  },
  {
    id: "P52-RA2",
    desc: "remover o verbete de Gestão de conhecimento",
    file: P52JS,
    find: `    "knowledge-management":`,
    repl: `    "knowledge-management-REMOVIDO":`,
    gate: "P52-HELP1", cmd: "node tests_p52_layout.js", only: "P52-HELP1",
    reason: /verbete de Gestão de conhecimento ausente|apenas \d+ capabilities com verbete/
  },
  {
    id: "P52-RA3",
    desc: "tornar a ajuda por capability hover-only (sem teclado nem Esc)",
    file: P52JS,
    find: `      btn.addEventListener("focus", function () {
        var p = document.getElementById(this.getAttribute("aria-describedby"));
        if (p) p52ShowHelp(this, p);
      });`,
    repl: `      /* MUTANTE: ajuda deixa de abrir por foco de teclado */`,
    gate: "P52-HELP1", cmd: "node tests_p52_chromium.js", only: "P52-HELP1",
    reason: /foco por teclado não abriu a ajuda/
  },
  {
    id: "P52-RA4",
    desc: "remover o emblema dos cinco domínios da home",
    file: P52JS,
    find: `    var emblem = p52DomainEmblem();
    if (emblem) {
      art.appendChild(emblem);`,
    repl: `    var emblem = null;
    if (emblem) {
      art.appendChild(emblem);`,
    gate: "P52-HOME1", cmd: "node tests_p52_layout.js", only: "P52-HOME1",
    reason: /emblema ausente/
  },
  {
    id: "P52-RA5",
    desc: "reduzir o score ao tamanho anterior",
    file: P52CSS,
    find: `  #p52-sec-exec .score-big { font-size: clamp(80px, 5.8vw, 112px); }`,
    repl: `  #p52-sec-exec .score-big { font-size: 44px; }`,
    gate: "P52-EXEC1", cmd: "node tests_p52_chromium.js", only: "P52-EXEC1",
    reason: /score com [\d.]+px \(esperado 80–112\)/
  },
  {
    id: "P52-RA6",
    desc: "tornar o Resumo texto-only: remover a barra de maturidade do domínio",
    file: P52JS,
    find: `      var wrap = el("span", { "class": "p52-dombar", "data-p52": "dom-bar",`,
    repl: `      var wrap = el("span", { "class": "p52-dombar", "data-p52": "dom-bar-REMOVIDA",`,
    gate: "P52-DOM2", cmd: "node tests_p52_layout.js", only: "P52-DOM2",
    reason: /sem barra|sem referência de escala/
  },
  {
    id: "P52-RA7",
    desc: "representar UNSET com barra de largura zero (zero geométrico)",
    file: P52JS,
    find: `      var score = /^\\d+(\\.\\d+)?$/.test(raw) ? parseFloat(raw) : null;`,
    repl: `      var score = /^\\d+(\\.\\d+)?$/.test(raw) ? parseFloat(raw) : 0;`,
    gate: "P52-DOM2", cmd: "node tests_p52_layout.js", only: "P52-DOM2",
    reason: /n\/d desenhou barra|zero geométrico proibido|n\/d marcado como plotado|barra desenhada apesar de n\/d/
  },
  {
    id: "P52-RA8",
    desc: "reduzir SOCaaS e MDR abaixo do limite óptico",
    file: P52CSS,
    find: `  .icon-tile img[data-p52-icon="FortiGuard-MDR-Service"]    { --p52-icon-scale: 1.053; }`,
    repl: `  .icon-tile img[data-p52-icon="FortiGuard-MDR-Service"]    { --p52-icon-scale: 0.70; }
  .icon-tile img[data-p52-icon="SOCaaS"]                    { --p52-icon-scale: 0.70; }`,
    gate: "P52-ICON2", cmd: "node tests_p52_chromium.js", only: "P52-ICON2",
    reason: /altura aparente [\d.]+% do tile|desvio de altura [\d.]+%/
  },
  {
    id: "P52-RA9",
    desc: "recolocar Pergunta anterior/Próxima na sidebar",
    file: SHELL,
    find: `    nav.appendChild(bTgl);
    orient.appendChild(nav);`,
    repl: `    var mPrev = el("button", { type: "button", "class": "p50-btn", "data-p50": "prev" }, "← Pergunta anterior");
    mPrev.addEventListener("click", function () { var b = document.getElementById("back"); if (b) b.click(); });
    nav.appendChild(mPrev);
    nav.appendChild(bTgl);
    orient.appendChild(nav);`,
    gate: "P52-MAP1", cmd: "node tests_p52_layout.js", only: "P52-MAP1",
    reason: /navegação duplicada de volta na sidebar|botões na barra do trilho/
  },
  {
    id: "P52-RA10",
    desc: "duplicar o owner do status de sessão na área da pergunta",
    file: P52JS,
    find: `    var ses = document.getElementById("p50-session-status");
    if (ses) util.appendChild(ses);          /* nó original do owner canônico */`,
    repl: `    var ses = document.getElementById("p50-session-status");
    if (ses) util.appendChild(ses.cloneNode(true));   /* MUTANTE: segundo estado de sessão */`,
    gate: "P52-Q2", cmd: "node tests_p52_layout.js", only: "P52-Q2",
    reason: /segundo status de sessão criado|segunda superfície de estado de sessão|status de sessão fora da faixa/
  },
  {
    id: "P52-RA11",
    desc: "esconder o painel completo de suficiência mesmo com o gate FECHADO",
    file: P52JS,
    find: `    if (gate === "released") {
      var keep = [], k2;`,
    repl: `    if (gate === "released" || gate === "blocked") {
      var keep = [], k2;`,
    gate: "P52-SUFF1", cmd: "node tests_p52_layout.js", only: "P52-SUFF1",
    reason: /bloqueado: painel técnico escondido|bloqueado: painel de suficiência fora da seção|suficiência não é a segunda seção/
  },
  /* ---------------- REV B · ajuste final de UAT visual (§12) ---------------- */
  {
    id: "P52-RB1",
    desc: "reduzir novamente o emblema dos cinco domínios",
    file: P52CSS,
    find: `  .p52-emblem { width: 100%; max-width: 540px; height: auto; display: block; }`,
    repl: `  .p52-emblem { width: 100%; max-width: 200px; height: auto; display: block; }`,
    gate: "P52-HOME1", cmd: "node tests_p52_chromium.js", only: "P52-HOME1",
    reason: /emblema com \d+px — pequeno demais/
  },
  {
    id: "P52-RB2",
    desc: "tornar a explicação do domínio hover-only (sem teclado)",
    file: P52JS,
    find: `        tabindex: "0", role: "button", "aria-expanded": "false",`,
    repl: `        role: "button", "aria-expanded": "false",`,
    gate: "P52-HOME2", cmd: "node tests_p52_layout.js", only: "P52-HOME2",
    reason: /não é focável por teclado/
  },
  {
    id: "P52-RB3",
    desc: "devolver o card intermediário de disclaimer ao hero",
    file: P52JS,
    find: `    var disc = scr.querySelector(".disclaimer");
    if (disc && disc.parentNode) disc.parentNode.removeChild(disc);`,
    repl: `    /* MUTANTE: o card intermediário volta a repetir o rodapé */`,
    gate: "P52-HOME3", cmd: "node tests_p52_layout.js", only: "P52-HOME3",
    reason: /card intermediário ainda|aparece \d+ vezes/
  },
  {
    id: "P52-RB4",
    desc: "reabrir os três accordions de capability ao entrar no editor",
    /* MIGRAÇÃO · ERRATA V3.2.2 §4 · o mutante ATACA A MESMA PROPRIEDADE — "as
       famílias de capability não nascem abertas" —, mas o ponto onde ela é
       decidida mudou. Antes o estado inicial vinha do default `open:` do owner
       congelado, e mutar `ui_v32.js` bastava. Agora a apresentação recolhe os
       grupos ao abrir cada edição, e o default do owner deixou de ser
       observável: mutá-lo produziria um mutante INDETECTÁVEL POR CONSTRUÇÃO,
       que não mede gate algum. A mutação passa a ser feita onde a propriedade
       de fato vive. */
    file: P52JS,
    find: `    for (var i = 0; i < det.length; i++) det[i].open = false;`,
    repl: `    for (var i = 0; i < det.length; i++)
      if (["g1", "g2", "g3"].indexOf(det[i].getAttribute("data-gid")) < 0) det[i].open = false;`,
    gate: "P52-CTX4", cmd: "node tests_p52_layout.js", only: "P52-CTX4",
    reason: /grupos abertos ao entrar/
  },
  {
    id: "P52-RB5",
    desc: "voltar o rótulo ambíguo 'Aplicações/agentes de IA'",
    file: UIJS,
    find: `  organizationBuildsAIApps:"Aplicações corporativas de IA (copilots e chatbots)",`,
    repl: `  organizationBuildsAIApps:"Aplicações/agentes de IA",`,
    gate: "P52-AI1", cmd: "node tests_p52_layout.js", only: "P52-AI1",
    reason: /rótulo de IA ausente|rótulo ambíguo/
  },
  {
    id: "P52-RB6",
    desc: "reintroduzir 'mandato' na linguagem apresentada",
    file: P52JS,
    find: `      if (!/[Mm]andato|charter|—/.test(v)) continue;`,
    repl: `      continue;   /* MUTANTE: o jargão volta para a tela e para o relatório */`,
    gate: "P52-COPY1", cmd: "node tests_p52_layout.js", only: "P52-COPY1",
    reason: /jargão na tela|pergunta ainda usa jargão/
  },
  {
    id: "P52-RB7",
    desc: "duplicar o exemplo abaixo do campo de evidência",
    file: SHELL,
    find: `    var ta = box.querySelector("#notetxt");`,
    repl: `    wrap.appendChild(el("p", { "class": "p51-help-ex", "data-p50": "evidence-help-example" }, h.ex));
    var ta = box.querySelector("#notetxt");`,
    gate: "P52-EVID1", cmd: "node tests_p52_layout.js", only: "P52-EVID1",
    reason: /exemplo duplicad/
  },
  {
    id: "P52-RB8",
    desc: "remover o link oficial das ofertas de apoio",
    file: UIJS,
    find: "  const cLnk = cUrl ? ",
    repl: "  const cLnk = false ? ",
    gate: "P52-SUP2", cmd: "node tests_p52_layout.js", only: "P52-SUP2",
    reason: /item com URL canônica e sem link oficial/
  },
  {
    id: "P52-RB9",
    desc: "reintroduzir o KPI de suficiência adequada no relatório do cliente",
    file: UIJS,
    find: "      <div class=\"pr-kpi\"><b>${ans.filter(v=>v!==null&&v!==\"NA\").length} de ${QS.length}</b><span>Respostas confirmadas</span></div>",
    repl: "      <div class=\"pr-kpi\"><b>${suff ? \"adequada\" : \"insuficiente\"}</b><span>Suficiência da sessão</span></div>",
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /KPI 'Sufici[êe]ncia da sess[ãa]o' voltou/
  },
  {
    id: "P52-RB10",
    desc: "limitar o painel de domínios a menos de 80% do workspace",
    file: P52CSS,
    find: `  #p52-flow #p50-results, #p52-flow #p50-suff, #p52-flow .p50-ses { max-width: none; }`,
    repl: `  #p52-flow #p50-results { max-width: 820px; }
  #p52-flow #p50-suff, #p52-flow .p50-ses { max-width: none; }`,
    gate: "P52-DOM3", cmd: "node tests_p52_chromium.js", only: "P52-DOM3",
    reason: /painel de domínios ocupa [\d.]+% do workspace/
  },
  {
    id: "P52-RB11",
    desc: "permitir que as prioridades comecem na primeira página",
    file: UIJS,
    find: "  if (prios.length) h += `<div class=\"pr-sec pr-pagebreak\" id=\"pr-prios\">",
    repl: "  if (prios.length) h += `<div class=\"pr-sec\" id=\"pr-prios\">",
    gate: "P52-PDF1", cmd: "node tests_p52_chromium.js", only: "P52-PDF1",
    reason: /prioridades sem quebra de página/
  },
  {
    id: "P52-RB12",
    desc: "esconder os ícones de solução no PDF",
    file: P52CSS,
    find: `  #v32-print-report .v32-icon, #v32-print-report .v32-icon-fb {
    width: 11mm !important; height: 11mm !important;`,
    repl: `  #v32-print-report .v32-icon, #v32-print-report .v32-icon-fb {
    display: none !important;
    width: 11mm !important; height: 11mm !important;`,
    gate: "P52-PDF3", cmd: "node tests_p52_chromium.js", only: "P52-PDF3",
    reason: /ícone\(s\) invisível\(is\) no papel|nenhum ícone no relatório/
  },
  {
    id: "P52-RB13",
    desc: "posicionar o marcador da régua com o valor não arredondado",
    file: UIJS,
    find: `  const pct = v => (Math.max(0, Math.min(5, v)) / 5 * 100).toFixed(2);`,
    repl: `  const pct = v => (Math.max(0, Math.min(5, v + 0.37)) / 5 * 100).toFixed(2);`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /marcador em [\d.]+% para score/
  },
  {
    id: "P52-RB14",
    desc: "desenhar marcador de posição mesmo com o resultado bloqueado",
    file: UIJS,
    find: "  const marcador = determinado\n    ? `<span class=\"pr-rl-mark\" data-rl-mark style=\"left:${pct(overall)}%\" aria-hidden=\"true\"></span>`\n      + `<span class=\"pr-rl-here\" data-rl-here style=\"left:${pct(overall)}%\">Você está aqui</span>`\n    : \"\";",
    repl: "  const marcador = `<span class=\"pr-rl-mark\" data-rl-mark style=\"left:${pct(overall||0)}%\" aria-hidden=\"true\"></span>`\n      + `<span class=\"pr-rl-here\" data-rl-here style=\"left:${pct(overall||0)}%\">Você está aqui</span>`;",
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /bloqueado não pode ter marcador|bloqueado desenhou marcador/
  },
  {
    id: "P52-RB15",
    desc: "devolver o recorte da pista da régua (o rótulo existe e não chega ao papel)",
    file: P52CSS,
    find: `    position: relative; width: 100%; display: flex; overflow: visible;`,
    repl: `    position: relative; width: 100%; display: flex;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /rótulo do marcador recortado por ancestral/
  },
  {
    id: "P52-RB16",
    desc: "devolver o viewBox quadrado do emblema da capa (rótulos cortados no PDF)",
    file: UIJS,
    find: `viewBox="-25 2 150 96" width="190" height="122"`,
    repl: `viewBox="0 0 100 100" width="132" height="132"`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /emblema da capa ilegível/
  },
  {
    id: "P52-RB17",
    desc: "deixar a borda herdada pintar preto sobre a haste de marca",
    file: P52CSS,
    find: `    width: 2px; margin-left: -1px; border: 0;`,
    repl: `    width: 2px; margin-left: -1px;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /pintando sobre a cor de marca/
  },
  {
    id: "P52-RB18",
    desc: "fazer a haste do marcador cruzar o nome do estágio dentro da faixa",
    file: P52CSS,
    find: `    position: absolute; top: 100%; bottom: auto; height: 3.4mm;`,
    repl: `    position: absolute; top: -4px; bottom: -4px; height: auto;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /haste do marcador sobre o texto da régua/
  },
  {
    id: "P52-ER1",
    desc: "desligar a ampliação ultrawide da home",
    file: P52CSS,
    find: `    --p52-uw-home: 1.22;   /* §2.2 · faixa pedida: 1,20–1,25 */`,
    repl: `    --p52-uw-home: 1;      /* MUTANTE: a home volta ao tamanho de 1920 */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /home \w+ escalou 1×|sem ganho material/
  },
  {
    id: "P52-ER2",
    desc: "desligar a ampliação ultrawide do questionário",
    file: P52CSS,
    find: `    --p52-uw-q: 1.10;      /* §2.3 · faixa pedida: 1,08–1,12 */`,
    repl: `    --p52-uw-q: 1;         /* MUTANTE: o questionário volta ao tamanho de 1920 */`,
    gate: "P52-UW2", cmd: "node tests_p52_chromium.js", only: "P52-UW2",
    reason: /questionário \w+ escalou 1×/
  },
  {
    id: "P52-ER3",
    desc: "soltar a linha de leitura do parágrafo da home na faixa ultrawide",
    file: P52CSS,
    find: `    font-size: calc(16px * var(--p52-uw-home));
    max-width: calc(620px * var(--p52-uw-home));`,
    repl: `    font-size: calc(16px * var(--p52-uw-home));
    max-width: none;   /* MUTANTE: o parágrafo estica com a coluna */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /linha de leitura da home com [\d.]+ caracteres/
  },
  {
    id: "P52-ER4",
    desc: "trocar a largura fluida da home por largura fixa maior que a viewport",
    file: P52CSS,
    find: `  html body[data-uxscreen="home"] .wrap { width: min(92vw, 2240px); }`,
    repl: `  html body[data-uxscreen="home"] .wrap { width: 2700px; }   /* MUTANTE: estoura em 2560 */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /rolagem horizontal em 2560px/
  },
  {
    id: "P52-ER5",
    desc: "tirar a área sensível uniforme apenas de Processos",
    file: P52CSS,
    find: `  .p52-emblem-hit { fill: transparent; stroke: none; pointer-events: all; }`,
    repl: `  .p52-emblem-node:not([data-dom="2"]) .p52-emblem-hit { fill: transparent; stroke: none; pointer-events: all; }
  .p52-emblem-node[data-dom="2"] .p52-emblem-hit { fill: none; pointer-events: none; }   /* MUTANTE: só Processos diverge */`,
    gate: "P52-POP2", cmd: "node tests_p52_chromium.js", only: "P52-POP2",
    reason: /domínio 2 não abre ao apontar/
  },
  {
    id: "P52-ER6",
    desc: "dar a Processos uma apresentação de popover diferente das outras quatro",
    file: P52CSS,
    find: `    width: min(420px, 100%); padding: 12px 14px;`,
    repl: `    width: min(420px, 100%); padding: 12px 14px;
  }
  .p52-emblem-pop[data-dom="2"] {
    width: 300px; padding: 6px 8px; font-size: 11px;   /* MUTANTE: só Processos diverge */`,
    gate: "P52-POP1", cmd: "node tests_p52_chromium.js", only: "P52-POP1",
    reason: /apresentações diferentes entre os cinco popovers|varia [\d.]+px entre os cinco/
  },
  {
    id: "P52-ER7",
    desc: "devolver a jornada empilhada no papel (um estágio por linha)",
    file: P52CSS,
    find: `    flex-direction: row !important;
    flex-wrap: nowrap;`,
    repl: `    flex-direction: column !important;   /* MUTANTE: a régua do papel volta a empilhar */
    flex-wrap: nowrap;`,
    gate: "P52-PDF4", cmd: "node tests_p52_chromium.js", only: "P52-PDF4",
    reason: /jornada empilhada ou partida|altura entre si|sem distribuição horizontal/
  },
  {
    id: "P52-ER8",
    desc: "permitir título de seção órfão no pé da página",
    file: P52CSS,
    find: `  #v32-print-report .pr-sec > h2 + *, #v32-print-report .pr-sec > h3 + * {
    break-before: avoid; page-break-before: avoid;
  }`,
    repl: `  #v32-print-report .pr-sec > h2 + *, #v32-print-report .pr-sec > h3 + * {
    break-before: page; page-break-before: always;   /* MUTANTE: o título fica sozinho no pé */
  }`,
    gate: "P52-PDF5", cmd: "node tests_p52_chromium.js", only: "P52-PDF5",
    reason: /isolado no rodapé da página/
  },
  {
    id: "P52-ER9",
    desc: "reintroduzir a página final contendo somente o rodapé do relatório",
    file: P52CSS,
    find: `    margin-top: 6px; padding-top: 4px;
    break-before: avoid; page-break-before: avoid;`,
    repl: `    margin-top: 6px; padding-top: 4px;
    break-before: page; page-break-before: always;   /* MUTANTE: o rodapé abre folha só para si */`,
    gate: "P52-PDF6", cmd: "node tests_p52_chromium.js", only: "P52-PDF6",
    reason: /página FINAL residual/
  },
  {
    id: "P52-M10",
    desc: "permitir alvo INFERIOR ao current confirmado (contrato funcional, fora da camada de layout)",
    file: TGTJS,
    find: `  if (cur!==null && cur!=="NA" && v < cur) return false;`,
    repl: `  if (false) return false;                                      /* MUTANTE: alvo pode ser inferior ao atual */`,
    gate: "TARGET 4.3.1", cmd: "node tests_target_m431.js", only: null,
    reason: /FAIL\s+T\d+/, lineless: true
  },

  /* ==========================================================================
     ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · §8.4
     Catorze mutantes: os três blockers de PDF, a paginação, e cada ajuste
     visual autorizado. Cada um tem de ser detectado pelo gate SEMANTICAMENTE
     correspondente e por MOTIVO compatível — detecção incidental por manifesto,
     identidade de arquivo ou contagem global não conta.
     ========================================================================== */
  {
    id: "P52-EX1",
    desc: "B-01 · publicar score por domínio na tabela do relatório sob gate FECHADO",
    file: UIJS,
    find: `    <tr>\${pub.map(s=>\`<td>\${s.score===null?"n/d":s.score.toFixed(1)}</td>\`).join("")}</tr></table>`,
    repl: `    <tr>\${stats.map(s=>\`<td>\${s.score===null?"n/d":s.score.toFixed(1)}</td>\`).join("")}</tr></table>`,
    gate: "P52-PDF7", cmd: "node tests_p52_chromium.js", only: "P52-PDF7",
    reason: /célula\(s\) de domínio publicadas com o gate FECHADO|tabela publica \[/
  },
  {
    id: "P52-EX2",
    desc: "B-01 · restaurar o radar numérico do relatório sob gate FECHADO",
    file: UIJS,
    find: `    \${prRadarSVG(pub)}`,
    repl: `    \${prRadarSVG(stats)}`,
    gate: "P52-PDF7", cmd: "node tests_p52_chromium.js", only: "P52-PDF7",
    reason: /radar rotulado com score sob gate fechado|radar com \d+ vértice|radar publicado sob gate fechado/
  },
  {
    id: "P52-EX3",
    desc: "B-02 · restaurar o curto-circuito de modo legado em preparePrint()",
    file: UIJS,
    find: `  const { html } = buildPrintReport();
  el.innerHTML = html;`,
    repl: `  if (V32.isLegacyModeV32()){ el.innerHTML=""; document.body.classList.remove("v32-print-mode"); return { legacy:true }; }
  const { html } = buildPrintReport();
  el.innerHTML = html;`,
    gate: "P52-PDF8", cmd: "node tests_p52_chromium.js", only: "P52-PDF8",
    reason: /relatório não montado no beforeprint|`v32-print-mode` ausente durante o beforeprint/
  },
  {
    id: "P52-EX4",
    desc: "B-03 · imprimir a superfície de tela (não aplicar v32-print-mode)",
    file: UIJS,
    find: `  document.body.classList.add("v32-print-mode");
  return { blocked:false, legacy:V32.isLegacyModeV32() };`,
    repl: `  return { blocked:false, legacy:V32.isLegacyModeV32() };`,
    gate: "P52-PDF8", cmd: "node tests_p52_chromium.js", only: "P52-PDF8",
    reason: /`v32-print-mode` ausente durante o beforeprint|`\.wrap` com display='block' sob mídia de impressão/
  },
  {
    id: "P52-EX5",
    desc: "§4.4 · recolocar a jornada VERTICAL no papel (voltar à regra de telefone)",
    file: P52CSS,
    find: `  #v32-print-report .jn-track {
    display: flex !important;
    flex-direction: row !important;`,
    repl: `  #v32-print-report .jn-track {
    display: flex !important;
    flex-direction: column !important;`,
    gate: "P52-PDF4", cmd: "node tests_p52_chromium.js", only: "P52-PDF4",
    reason: /jornada empilhada ou partida|estágios com \d+pt de altura|sem distribuição horizontal/
  },
  {
    id: "P52-EX6",
    desc: "§4.4 · permitir página residual (retirar a guarda do último bloco do anexo)",
    file: P52CSS,
    find: `  #v32-print-report #pr-annex > .pr-card:last-child,
  #v32-print-report .pr-sec:last-of-type > *:last-child {
    break-after: avoid; page-break-after: avoid;
  }`,
    repl: `  #v32-print-report #pr-annex > .pr-card:last-child,
  #v32-print-report .pr-sec:last-of-type > *:last-child {
    break-after: page; page-break-after: always;
  }`,
    gate: "P52-PDF6", cmd: "node tests_p52_chromium.js", only: "P52-PDF6",
    reason: /página FINAL residual|página intermediária residual/
  },
  {
    id: "P52-EX7",
    desc: "A-01 · devolver o vermelho de marca ao texto pequeno (token acessível revertido)",
    file: P52CSS,
    find: `:root { --red-text: #F54133; }`,
    repl: `:root { --red-text: #DA291C; }`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /→ [0-3][.,]\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-EX8",
    desc: "§6.1 · remover a ajuda (i) de uma capability (detection-engineering)",
    file: P52JS,
    find: `      var text = P52_CAP_HELP[capId];`,
    repl: `      var text = (capId === "detection-engineering") ? null : P52_CAP_HELP[capId];`,
    gate: "P52-HELP2", cmd: "node tests_p52_chromium.js", only: "P52-HELP2",
    reason: /sem ajuda \(i\): capability · detection-engineering/
  },
  {
    id: "P52-EX9",
    desc: "§6.2 · quebrar a grade de requisitos (gaps desiguais e coluna fixa)",
    file: P52CSS,
    find: `  #v32editor .v32-signals,
  #v32editor .v32-subs .v32-signals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;`,
    repl: `  #v32editor .v32-signals,
  #v32editor .v32-subs .v32-signals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px 26px;`,
    gate: "P52-SIG1", cmd: "node tests_p52_chromium.js", only: "P52-SIG1",
    reason: /gaps desiguais|gaps diferentes entre grupos/
  },
  {
    id: "P52-EX10",
    desc: "§6.3 · reduzir novamente a tipografia de 'Para avançar'",
    file: P52CSS,
    find: `    font-size: 17px; line-height: 1.7; color: var(--text);`,
    repl: `    font-size: 13.5px; line-height: 1.4; color: var(--text);`,
    gate: "P52-ADV1", cmd: "node tests_p52_chromium.js", only: "P52-ADV1",
    reason: /com 13\.5px \(piso 16,5px\)|entrelinha 1\.\d+ \(piso 1,55\)|menor que a leitura executiva/
  },
  {
    id: "P52-EX11",
    desc: "§6.4 · devolver o cenário-alvo a um card estreito preso à esquerda",
    file: P52CSS,
    find: `  #ux-target .ux-tgt-table {
    width: 100%; table-layout: fixed; margin: 0;`,
    repl: `  #ux-target .ux-tgt-table {
    width: max-content; table-layout: auto; margin: 0;`,
    gate: "P52-TGT3", cmd: "node tests_p52_chromium.js", only: "P52-TGT3",
    reason: /tabela Atual × Alvo com \d+px num painel útil|card estreito preso à esquerda/
  },
  {
    id: "P52-EX12",
    desc: "§6.5 · reduzir um ícone específico do sistema V3.2 (FortiSIEM)",
    file: P52CSS,
    /* O asset mutado tem de ser um dos EFETIVAMENTE renderizados pela fixture
       do gate — senão o mutante seria invisível por ausência, não por acerto.
       `P52-ICON3` mede SOCaaS, FortiAnalyzer, FortiSIEM, FortiGuard-IR-Service
       e FortiGuard-Labs na tela de apoio com contexto declarado. */
    find: `  .v32-icon[data-icon="FortiSIEM"]                       { --p52-v32icon-scale: 1.001; }`,
    repl: `  .v32-icon[data-icon="FortiSIEM"]                       { --p52-v32icon-scale: 0.62; }`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /v32-icon FortiSIEM: ocupação aparente [\d.]+% \(faixa 84–92%\)/
  },
  {
    id: "P52-EX13",
    desc: "§6.6 · remover o ícone de 'Pode fazer sentido — após validação' e de 'Não priorizados'",
    file: P52JS,
    find: `    var itens = root.querySelectorAll(".t-list .t-item, .t-details .t-item");`,
    repl: `    var itens = root.querySelectorAll(".t-list .t-item-INEXISTENTE, .t-details .t-item-INEXISTENTE");`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /sem tile de ícone|ícone ausente ou não pintado/
  },
  {
    id: "P52-EX14",
    desc: "§6.6 · ícone presente no DOM mas NÃO pintado nas listas secundárias",
    file: P52CSS,
    find: `  .t-list .t-item > .icon-tile, .t-details .t-item > .icon-tile {
    grid-column: 1; grid-row: 1; margin: 0;
  }`,
    repl: `  .t-list .t-item > .icon-tile, .t-details .t-item > .icon-tile {
    grid-column: 1; grid-row: 1; margin: 0; visibility: hidden;
  }`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /tile presente no DOM mas não pintado|ícone ausente ou não pintado/
  },
  /* ==========================================================================
     ERRATA FINAL · ALTO-1 — a comparação indivisível.
     Cinco mutantes exigidos pelo §6.1 da instrução, mais dois das superfícies
     que a mesma decisão passou a governar (régua da jornada e Camada 5). Cada
     um restaura o defeito por um caminho DIFERENTE: se o gate detectasse todos
     pelo mesmo motivo, ele estaria medindo uma coisa só.
     ========================================================================== */
  {
    id: "P52-FT1",
    desc: "ALTO-1 · TELA: a coluna Alvo volta a responder apenas a `tgt.suff` (gate próprio do vetor-alvo)",
    file: TGTJS,
    find: `  /* ERRATA FINAL · ALTO-1 · uma decisão só, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);`,
    repl: `  /* ERRATA FINAL · ALTO-1 · uma decisão só, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,tgt.suff);`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /TELA: domínio \d publica alvo/
  },
  {
    id: "P52-FT2",
    desc: "ALTO-1 · TELA: tabela protegida, mas KPI e NOME DE ESTÁGIO do alvo reaparecem",
    file: TGTJS,
    find: `  const pubO=v=>cmpPub?v:null, pubS=p=>(cmpPub&&p.stage)?esc32(p.stage.pt):"n/d";`,
    repl: `  const pubO=v=>v, pubS=p=>p.stage?esc32(p.stage.pt):"n/d";`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /TELA: KPI do alvo publica (score|estágio)/
  },
  {
    id: "P52-FT3",
    desc: "ALTO-1 · PAPEL: texto protegido, mas o POLÍGONO do alvo volta a ser pintado no PDF",
    file: TGTJS,
    find: `      <polygon points="\${poly(tgtPub)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>`,
    repl: `      <polygon points="\${poly(tgt.stats)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: polígono do alvo com \d vértices|PDF-TINTA: \d+px de #3CB17E/
  },
  {
    id: "P52-FT4",
    desc: "ALTO-1 · tela protegida, mas o PAPEL volta a publicar a coluna Alvo",
    file: TGTJS,
    find: `     ERRATA FINAL · ALTO-1 · e essa decisão é a do PERFIL ATUAL, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);`,
    repl: `     ERRATA FINAL · ALTO-1 · e essa decisão é a do PERFIL ATUAL, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,tgt.suff);`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: domínio \d publica alvo|PDF-TEXTO: número publicado no bloco/
  },
  {
    id: "P52-FT5",
    desc: "ALTO-1 · a mensagem neutra é trocada por alegação contraditória (o alvo como resultado projetado)",
    file: TGTJS,
    find: `data-pr-nopub="target">O cenário-alvo está salvo. A comparação será apresentada quando o perfil atual tiver evidência suficiente.`,
    repl: `data-pr-nopub="target">O cenário-alvo publicado abaixo é o resultado projetado desta sessão e constitui previsão de maturidade.`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: mensagem neutra ausente/
  },
  {
    id: "P52-FT6",
    desc: "ALTO-1 · a RÉGUA DA JORNADA volta a marcar o estágio do cenário-alvo sob gate fechado",
    file: JOURNEY,
    find: `  const tgtIdx=(snap.maturity.sufficient && snap.target.exists && snap.target.sufficient && snap.target.stage)? stageIndexOf(snap.target.stage,L) : -1;`,
    repl: `  const tgtIdx=(snap.target.exists && snap.target.sufficient && snap.target.stage)? stageIndexOf(snap.target.stage,L) : -1;`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /JORNADA: marcador de estágio do cenário-alvo na régua/
  },
  {
    id: "P52-FT7",
    desc: "ALTO-1 · a CAMADA 5 volta a pintar o marcador 'alvo X.X' por domínio sob gate fechado",
    file: P50RES,
    find: `      var domTarget = (released && domHasTarget && tgtStats) ? tgtStats[i].score : null;`,
    repl: `      var domTarget = (domHasTarget && tgtStats) ? tgtStats[i].score : null;`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /CAMADA 5: \d+ (marcador|gap|atributo)/
  },
  /* ==========================================================================
     ERRATA FINAL · MÉDIO-2 — contraste do link de apoio e COBERTURA do gate.
     ========================================================================== */
  {
    id: "P52-FC1",
    desc: "MÉDIO-2 · restaurar `#DA291C` diretamente em `.p52-sup-link`",
    file: P52CSS,
    find: `    font-size: 13.5px; color: var(--red-text); margin-top: 2px;
    text-decoration: underline; text-underline-offset: 2px;`,
    repl: `    font-size: 13.5px; color: #DA291C; margin-top: 2px;
    text-decoration: underline; text-underline-offset: 2px;`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /p52-sup-link.*3\.7\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-FC2",
    desc: "MÉDIO-2 · cor acessível SOMENTE no hover, deixando o estado normal reprovado",
    file: P52CSS,
    find: `  .p52-sup-link:hover { text-decoration: underline; text-decoration-thickness: 2px; }`,
    repl: `  .p52-sup-link { color: #DA291C; }
  .p52-sup-link:hover { color: var(--red-text); text-decoration: underline; text-decoration-thickness: 2px; }`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /p52-sup-link.*3\.7\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-FC3",
    desc: "MÉDIO-2 · remover a declaração de contexto do caso novo, tornando o gate VACUOSO para `.p52-sup-link`",
    file: P52TESTS,
    find: `    { nome: "resultados-contexto", fx: FX52.P52_F5, tela: "results", contexto: true,`,
    repl: `    { nome: "resultados-contexto", fx: FX52.P52_F5, tela: "results", contexto: false,`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /fixture não montou 'a\.p52-sup-link' — gate vacuoso/
  },
  /* ==========================================================================
     PATCH V3.2.2 · os doze mutantes da §8. Cada um ataca UMA garantia das três
     correções estreitas e deve cair pelo gate `V322-*` semanticamente
     correspondente, por motivo acionável — nunca por erro de sintaxe, timeout
     ou fixture quebrada.
     ========================================================================== */
  {
    id: "V322-M1",
    desc: "aplicar as regiões de contexto apenas na tela de resultados (voltar ao defeito da v3.2.1)",
    file: P52JS,
    find: `  function p52ContextEditorDecor() {
    var ed = document.getElementById("v32editor");
    if (!ed) return;`,
    repl: `  function p52ContextEditorDecor() {
    var ed = document.getElementById("v32editor");
    if (!ed) return;
    if (p52Screen() !== "results") return;`,
    gate: "V322-CTXPAR1", cmd: "node tests_p52_chromium.js", only: "V322-CTXPAR1",
    reason: /home: \d+ regiões de primeiro nível|composição divergente home × resultados/
  },
  {
    id: "V322-M2",
    desc: "abrir todos os accordions por padrão (parede de campos na primeira abertura)",
    /* MIGRAÇÃO · ERRATA V3.2.2 §4 · mesma razão de `P52-RB4`: a propriedade é a
       mesma, o lugar onde ela é decidida mudou. Ver a nota daquele mutante. */
    file: P52JS,
    find: `    var det = ed.querySelectorAll("details[data-gid]");`,
    repl: `    var det = [];
    ed.querySelectorAll("details[data-gid]").forEach(function (d) { d.open = true; });`,
    gate: "V322-CTXPAR1", cmd: "node tests_p52_chromium.js", only: "V322-CTXPAR1",
    reason: /abertura inicial = \[[^\]]*g2/
  },
  {
    id: "V322-M3",
    desc: "reabrir SOC & Operations em todo rerender, anulando a decisão do usuário",
    file: P52JS,
    find: `    p52ContextRegions(ed);
    p52DecorateContextGroups(ed);
    p52CapHelp(ed);
  }`,
    repl: `    p52ContextRegions(ed);
    p52DecorateContextGroups(ed);
    p52CapHelp(ed);
    var g1m = ed.querySelector('details[data-gid="g1"]');
    if (g1m) g1m.open = true;
  }`,
    /* MIGRAÇÃO · ERRATA V3.2.2 §4 · o defeito atacado é o mesmo: o decorador
       reabre `g1` a cada passagem, anulando a decisão do usuário. O que mudou é
       QUANDO o gate o pega. Com o estado inicial recolhido, a PRIMEIRA passagem
       do decorador já reabre `g1`, e `V322-CTXPAR1` reprova logo na abertura
       inicial em vez de esperar o rerender. As duas frases dizem a mesma coisa —
       "o decorador reabriu SOC & Operations" — e ambas são aceitas. Detecção
       incidental continua fora: nenhuma delas é contagem global, identidade de
       arquivo ou manifesto. */
    gate: "V322-CTXPAR1", cmd: "node tests_p52_chromium.js", only: "V322-CTXPAR1",
    reason: /o decorador REABRIU (no rerender )?o grupo que o usuário fechou|abertura inicial = \[g1\]/
  },
  {
    id: "V322-M4",
    desc: "restaurar o max-width estreito do disclaimer no rodapé",
    file: P52CSS,
    find: `  .p52-foot-legal { min-width: 0; }`,
    repl: `  .p52-foot-legal { min-width: 0; max-width: 92ch; }`,
    gate: "V322-FOOT1", cmd: "node tests_p52_chromium.js", only: "V322-FOOT1",
    reason: /max-width estreito ainda aplicado ao texto legal|bloco legal ocupa \d+% da largura útil/
  },
  {
    id: "V322-M5",
    desc: "remover a mensagem local junto ao botão de PDF",
    file: P52JS,
    find: `  function p52SyncPrintPending() {
    var btn = p52PrintButton();`,
    repl: `  function p52SyncPrintPending() {
    if (true) return;
    var btn = p52PrintButton();`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /mensagem junto ao PDF: 0 ocorrência/
  },
  {
    id: "V322-M6",
    desc: "remover o indicador de pendência do menu lateral",
    file: P52JS,
    find: `  function p52SyncRailPending() {
    var link = document.getElementById("p52-railto-context");
    if (!link) return;`,
    repl: `  function p52SyncRailPending() {
    var link = document.getElementById("p52-railto-context");
    if (!link) return;
    if (true) return;`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /trilho: 0 indicador\(es\)|antes da tentativa: 0 indicador\(es\) no trilho/
  },
  {
    id: "V322-M7",
    desc: "deixar o indicador apenas cromático, sem nome acessível",
    file: P52JS,
    find: `      mark.appendChild(el("span", { "class": "p52-rail-pending-dot", "aria-hidden": "true" }));
      mark.appendChild(el("span", { "class": "p52-rail-pending-text" }, P52_PENDING_RAIL_TEXT));`,
    repl: `      mark.appendChild(el("span", { "class": "p52-rail-pending-dot", "aria-hidden": "true" }));`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /indicador sem texto 'alterações pendentes'|trilho sem texto acessível de pendência/
  },
  {
    id: "V322-M8",
    desc: "não limpar o aria-describedby obsoleto depois de Salvar",
    file: P52JS,
    find: `      var all = document.querySelectorAll("button"), k;
      for (k = 0; k < all.length; k++)
        if (all[k].getAttribute("aria-describedby") === P52_PENDING_ID) all[k].removeAttribute("aria-describedby");
      return;`,
    repl: `      return;`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /após Salvar: aria-describedby obsoleto no botão de PDF/
  },
  {
    id: "V322-M9",
    desc: "não limpar a mensagem de PDF depois de Cancelar",
    file: P52JS,
    find: `    if (!show || !btn) {
      for (i = 0; i < old.length; i++) if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);`,
    repl: `    if (!show || !btn) {
      if (false) for (i = 0; i < old.length; i++) if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /após Cancelar: mensagem de PDF permanece/
  },
  {
    id: "V322-M10",
    desc: "duplicar a mensagem a cada clique repetido no botão de PDF",
    file: P52JS,
    find: `    var box = null;
    for (i = 0; i < old.length; i++) {
      if (!box && old[i].previousElementSibling === group) box = old[i];
      else if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);
    }`,
    repl: `    var box = null;`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    /* Sem a guarda de reaproveitamento a decoração deixa de convergir: cada
       passagem do observador insere um nó novo, que agenda a passagem
       seguinte. O gate registra isso pelo NOME — não como timeout do harness,
       graças ao orçamento de convergência de `v322Eval()`. */
    reason: /NÃO CONVERGIU|congelou|cliques repetidos: [2-9]\d* mensagens junto ao PDF|mensagem junto ao PDF: [2-9]\d* ocorrência/
  },
  {
    id: "V322-M11",
    desc: "permitir window.print() com um draft de contexto aberto",
    file: UIJS,
    find: `function safePrint(){
  if (draft !== null){`,
    repl: `function safePrint(){
  if (false){`,
    gate: "V322-PRINT1", cmd: "node tests_p52_chromium.js", only: "V322-PRINT1",
    reason: /window\.print\(\) chamado [1-9]\d* vez\(es\) com draft aberto/
  },
  {
    id: "V322-M12",
    desc: "perder um valor digitado ao reorganizar os nós entre as regiões (serializar em vez de mover)",
    file: P52JS,
    find: `      var body = el("div", { "class": "p52-ctxregion-body" });
      for (i = 0; i < found.length; i++) body.appendChild(found[i]);`,
    repl: `      var body = el("div", { "class": "p52-ctxregion-body" });
      for (i = 0; i < found.length; i++) {
        body.insertAdjacentHTML("beforeend", found[i].outerHTML);
        if (found[i].parentNode) found[i].parentNode.removeChild(found[i]);
      }`,
    gate: "V322-CTXPAR1", cmd: "node tests_p52_chromium.js", only: "V322-CTXPAR1",
    reason: /valor perdido na passagem do decorador/
  },
  /* ==========================================================================
     FECHAMENTO PRÉ-AUDITORIA v3.2.2 · §4.3 — NÃO VACUIDADE DO BASELINE.
     Provam que a resolução do baseline REJEITA identidade errada ANTES de
     comparar produto e baseline, e que o diagnóstico nomeia o observado E o
     esperado. Sem estes, "P52-PR1/P52-ACC1 verdes" poderia significar apenas
     que o oracle aceitou qualquer coisa.
     ========================================================================== */
  {
    id: "V322-M13",
    desc: "trocar o commit imutável do baseline pelo da v3.2.1 (HEAD móvel) na resolução de P52-PR1/P52-ACC1",
    file: P52TESTS,
    find: `const P52_BASELINE_COMMIT = "d3886812718e7ad9c5024880067133fbddf2fc4d";`,
    repl: `const P52_BASELINE_COMMIT = "07bc90b3fbf6f033a56c490f3bff1951c58316b7";`,
    gate: "P52-PR1", cmd: "node tests_p52_chromium.js", only: "P52-PR1,P52-ACC1",
    reason: /baseline indisponível: baseline .* com 963373 bytes; esperado 744179/
  },
  {
    id: "V322-M14",
    desc: "alterar um dígito do SHA-256 esperado do baseline da entrada da Phase 5.2",
    file: P52TESTS,
    find: `const P52_BASELINE_SHA = "12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9";`,
    repl: `const P52_BASELINE_SHA = "12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d8";`,
    gate: "P52-ACC1", cmd: "node tests_p52_chromium.js", only: "P52-PR1,P52-ACC1",
    reason: /identidade do baseline diverge .* observado 12bb950f\S+, esperado 12bb950f\S+d8/
  },
  /* ==========================================================================
     FECHAMENTO PRÉ-AUDITORIA v3.2.2 · §5.3 — NÃO VACUIDADE DO `nested-interactive`.
     Reinsere um controle FOCÁVEL dentro do `<summary>`, que é exatamente o
     defeito corrigido. `V322-NI1` tem de reprovar NOMEANDO a regra, e não por
     erro incidental de sintaxe, de fixture ou de contagem.
     ========================================================================== */
  {
    id: "V322-M15",
    desc: "reinserir um controle focável dentro do <summary> das famílias (volta do nested-interactive)",
    file: P52JS,
    find: `    head.appendChild(made.btn);
    head.appendChild(made.pop);
    return true;`,
    repl: `    head.appendChild(made.btn);
    head.appendChild(made.pop);
    sum.appendChild(el("button", { type: "button", "class": "p52-mut-nested" }, "?"));
    return true;`,
    gate: "V322-NI1", cmd: "node tests_p52_chromium.js", only: "V322-NI1",
    reason: /n[óo]\(s\) nested-interactive|controle\(s\) interativo\(s\) dentro de <summary>/
  },
  /* ==========================================================================
     ERRATA V3.2.2 · AJUDAS, ACCORDION E TRANSIÇÃO · §6 — OS SEIS MUTANTES
     EXIGIDOS, MAIS TRÊS DE NÃO VACUIDADE.

     Os seis primeiros reintroduzem, um a um, exatamente os defeitos que esta
     errata corrigiu. Os três últimos atacam os gates que já nasceram VERDES —
     `V322-HELP4`, `V322-HELP5` e a preservação da decisão do usuário —, porque
     um gate que nunca reprovou não provou nada. Nenhum deles é detectado por
     contagem global, identidade de arquivo ou manifesto: o motivo esperado é
     sempre a frase semântica do próprio gate.
     ========================================================================== */
  {
    id: "V322-M16",
    desc: "reinserir o controle de ajuda (i) em cada rótulo 'Situação declarada'",
    file: P52JS,
    find: `    /* subgrupos de requisitos (\`data-gid="sig-N"\`) */`,
    repl: `    var pressMut = ed.querySelectorAll('select[id^="v32-pres-"]');
    for (var pmi = 0; pmi < pressMut.length; pmi++) {
      var labMut = pressMut[pmi].closest("label");
      if (!labMut || labMut.querySelector('[data-p52="cap-help"]')) continue;
      labMut.classList.add("p52-fieldhelp");
      var feitoMut = p52HelpControl("p52-preshelp-" + pressMut[pmi].id.replace(/^v32-pres-/, ""),
        "Situação declarada",
        "Situação DECLARADA da capacidade nesta organização: não informado, ausência confirmada, " +
        "parcialmente atendida ou atendida. É declaração de contexto, não avaliação.");
      labMut.insertBefore(feitoMut.btn, pressMut[pmi]);
      labMut.appendChild(feitoMut.pop);
    }
    /* subgrupos de requisitos (\`data-gid="sig-N"\`) */`,
    gate: "V322-HELP3", cmd: "node tests_p52_layout.js", only: "V322-HELP3",
    reason: /ajuda \(i\) redundante em 'Situa[çc][ãa]o declarada' de v32-pres-/
  },
  {
    id: "V322-M17",
    desc: "reinserir o controle de ajuda (i) numa subscription FortiGuard individual",
    file: P52JS,
    find: `    p52InstallHelpEscape();
  }

  function p52CapHelp(ed) {`,
    repl: `    var subMut = ed.querySelector("#v32-sub-fg-ips");
    var labSubMut = subMut ? subMut.closest("label") : null;
    if (labSubMut && !labSubMut.querySelector('[data-p52="cap-help"]')) {
      labSubMut.classList.add("p52-fieldhelp");
      var feitoSubMut = p52HelpControl("p52-subhelp-fg-ips", "Prevenção de intrusão",
        "Prevenção de intrusão: inspeciona o tráfego em busca de exploração de vulnerabilidades conhecidas.");
      labSubMut.appendChild(feitoSubMut.btn);
      labSubMut.appendChild(feitoSubMut.pop);
    }
    p52InstallHelpEscape();
  }

  function p52CapHelp(ed) {`,
    gate: "P52-HELP2", cmd: "node tests_p52_chromium.js", only: "P52-HELP2",
    reason: /ajuda \(i\) redundante reintroduzida: subscription · v32-sub-fg-ips|ajuda\(s\) \(i\) dentro do grupo de plataformas/
  },
  {
    id: "V322-M18",
    desc: "fazer SOC & Operations voltar a nascer aberto na primeira abertura do editor",
    file: P52JS,
    find: `    for (var i = 0; i < det.length; i++) det[i].open = false;`,
    repl: `    for (var i = 0; i < det.length; i++)
      if (det[i].getAttribute("data-gid") !== "g1") det[i].open = false;`,
    gate: "V322-ACC4", cmd: "node tests_p52_layout.js", only: "V322-ACC4",
    reason: /grupos abertos na primeira abertura = \[g1\]/
  },
  {
    id: "V322-M19",
    desc: "retirar a neutralização da animação legada: o fade volta a cada render (o piscar)",
    file: P52CSS,
    find: `  section.screen { animation: none; }`,
    repl: `  section.screen { animation-delay: 0s; }`,
    gate: "V322-MOT3", cmd: "node tests_p52_chromium.js", only: "V322-MOT3",
    reason: /trocar de resposta aplica anima[çc][ãa]o 'fade'|a tela caiu para opacidade 0 ao trocar de resposta/
  },
  {
    id: "V322-M20",
    desc: "suprimir a marcação de direção: a navegação real entre perguntas deixa de ter transição",
    file: P52JS,
    find: `      dir = st > p52NavStep ? "fwd" : "back";`,
    repl: `      dir = null;`,
    gate: "V322-MOT3", cmd: "node tests_p52_chromium.js", only: "V322-MOT3",
    reason: /avan[çc]ar n[ãa]o marcou a transi[çc][ãa]o para a frente|sem deslocamento observ[áa]vel/
  },
  {
    id: "V322-M21",
    desc: "mover a transição para a Web Animations API, fora do alcance de prefers-reduced-motion",
    file: P52JS,
    find: `    if (dir) sec.setAttribute("data-p52-nav", dir);`,
    repl: `    if (dir) {
      sec.setAttribute("data-p52-nav", dir);
      if (typeof sec.animate === "function")
        sec.animate([{ transform: "translateX(" + (dir === "fwd" ? 18 : -18) + "px)" },
                     { transform: "none" }], { duration: 150 });
    }`,
    gate: "V322-MOT3", cmd: "node tests_p52_chromium.js", only: "V322-MOT3",
    reason: /sob prefers-reduced-motion/
  },
  {
    id: "V322-M22",
    desc: "apagar a ajuda conceitual de uma capability (não vacuidade de V322-HELP4)",
    file: P52JS,
    find: `      var text = P52_CAP_HELP[capId];
      if (!text) continue;`,
    repl: `      var text = P52_CAP_HELP[capId];
      if (!text || capId === "knowledge-management") continue;`,
    gate: "V322-HELP4", cmd: "node tests_p52_layout.js", only: "V322-HELP4",
    reason: /capabilities sem ajuda — knowledge-management/
  },
  {
    id: "V322-M23",
    desc: "apontar aria-describedby para um ID inexistente (não vacuidade de V322-HELP5)",
    file: P52JS,
    find: `      "aria-expanded": "false", "aria-describedby": popId,`,
    repl: `      "aria-expanded": "false", "aria-describedby": popId + "-orfao",`,
    gate: "V322-HELP5", cmd: "node tests_p52_layout.js", only: "V322-HELP5",
    reason: /aria-describedby [óo]rf[ãa]o —/
  },
  {
    id: "V322-M24",
    desc: "recolher os grupos em TODA passagem do decorador (desfaz a decisão do usuário)",
    file: P52JS,
    find: `    p52ContextRegions(ed);`,
    repl: `    p52CollapseGroups(ed);
    p52ContextRegions(ed);`,
    gate: "V322-ACC5", cmd: "node tests_p52_layout.js", only: "V322-ACC5",
    reason: /o repaint FECHOU o grupo que o usu[áa]rio abriu/
  },

  /* ========================================================================
     ERRATA FINAL V3.2.2 (REV C) · mutantes estreitos das correções B-01,
     A-01, A-02, M-01, M-02 e M-05. Cada um ataca UMA cláusula da correção e
     tem de ser detectado pelo gate semanticamente correspondente, pelo motivo
     esperado — detecção incidental não conta.
     ======================================================================== */
  {
    id: "V322C-M1",
    desc: "retirar <button> da isenção do handler global de Enter (A-01: o botão volta a executar ação diferente da rotulada)",
    file: P52JS,
    find: `  var P52_ENTER_SELF = 'button, select, input, textarea, summary, a[href], ' +`,
    repl: `  var P52_ENTER_SELF = 'select, input, textarea, summary, a[href], ' +`,
    gate: "V322C-KEY1", cmd: "node tests_p52_chromium.js", only: "V322C-KEY1",
    reason: /K1 \(Enter\): tela final 'arq'/
  },
  {
    id: "V322C-M2",
    desc: "retirar <select> da isenção do handler global de Enter (B-01: o gatilho mais provável no uso real)",
    file: P52JS,
    find: `  var P52_ENTER_SELF = 'button, select, input, textarea, summary, a[href], ' +`,
    repl: `  var P52_ENTER_SELF = 'button, input, textarea, summary, a[href], ' +`,
    /* A primeira execução desta campanha mostrou que a matriz de EFEITO não
       distingue esta mutação: na tela do editor a cláusula de identidade de
       tela já bastaria, e o mutante era no-op. O gate passou a medir QUAL
       cláusula está em vigor por classe de controle (T1–T12), que é a
       exigência normativa da §4.1 — e é por ela que o mutante é detectado. */
    gate: "V322C-KEY1", cmd: "node tests_p52_chromium.js", only: "V322C-KEY1",
    reason: /T3 \(select\): a isen[çc][ãa]o por ALVO n[ãa]o est[áa] em vigor/
  },
  {
    id: "V322C-M3",
    desc: "voltar a decidir a tela somente por step === -1 (B-01: o editor da home volta a ser lido como home)",
    file: P52JS,
    find: `    if (s === "ctxeditor") return false;      /* tela do editor: o atalho não é dela */
    if (s === "home") return p52RealHome();`,
    repl: `    if (s === "ctxeditor") return true;
    if (s === "home") return true;`,
    gate: "V322C-KEY1", cmd: "node tests_p52_chromium.js", only: "V322C-KEY1",
    reason: /K12 \(Enter\):/
  },
  {
    id: "V322C-M4",
    desc: "fazer Enter em '← Voltar' cair no handler global (A-01: o botão avança em vez de voltar)",
    file: P52JS,
    find: `    if (t.isContentEditable) return true;`,
    repl: `    if (t.id === "back") return false;
    if (t.isContentEditable) return true;`,
    gate: "V322C-KEY1", cmd: "node tests_p52_chromium.js", only: "V322C-KEY1",
    reason: /K6 \(Enter\): pergunta \d+ → \d+/
  },
  {
    id: "V322C-M5",
    desc: "omitir a restauração de foco depois do reparentamento (A-02)",
    file: P52JS,
    find: `    p52RestoreEditorFocus(keep);`,
    repl: `    /* mutante: restauração omitida */`,
    gate: "V322C-FOC1", cmd: "node tests_p52_chromium.js", only: "V322C-FOC1",
    reason: /F1: o foco caiu para/
  },
  {
    id: "V322C-M6",
    desc: "restaurar deliberadamente o foco em <body> (A-02: maquiar activeElement não é preservar fluxo)",
    file: P52JS,
    find: `    var alvo = p52ResolveFocusIntent(ed, it);`,
    repl: `    var alvo = document.body;`,
    gate: "V322C-FOC1", cmd: "node tests_p52_chromium.js", only: "V322C-FOC1",
    reason: /F1: o foco caiu para/
  },
  {
    id: "V322C-M7",
    desc: "deixar Salvar/Cancelar caírem no handler global (B-01: draft órfão depois de o editor sair da tela)",
    file: P52JS,
    find: `    if (t.isContentEditable) return true;`,
    repl: `    if (t.id === "v32save" || t.id === "v32cancel") return false;
    if (t.isContentEditable) return true;`,
    /* Mesmo diagnóstico do `V322C-M2`: Salvar e Cancelar são `<button>` na tela
       do editor, onde a cláusula de identidade de tela também cobre — o efeito
       não muda e a mutação era no-op para a matriz de efeito. A detecção passa
       a ser pela cláusula EM VIGOR nesses dois controles (T1/T2). O draft
       órfão propriamente dito continua sendo medido, e por um mutante que
       realmente o produz: `V322C-M3`, detectado por K12. */
    gate: "V322C-KEY1", cmd: "node tests_p52_chromium.js", only: "V322C-KEY1",
    reason: /T1 \(button\): a isen[çc][ãa]o por ALVO n[ãa]o est[áa] em vigor/
  },
  {
    id: "V322C-M8",
    desc: "limpar visualmente a pendência sem que o draft real tenha morrido",
    file: P52JS,
    find: `      if (window.__DEV && typeof window.__DEV._setDraft === "function") {
        var vivo = false;`,
    repl: `      if (window.__DEV && typeof window.__DEV._setDraft === "function") {
        var vivo = false; return false;`,
    gate: "V322C-PRN1", cmd: "node tests_p52_chromium.js", only: "V322C-PRN1",
    reason: /mensagem de bloqueio invis[íi]vel/
  },
  {
    id: "V322C-M9",
    desc: "devolver a regra móvel à especificidade insuficiente (M-01: a grade rígida de 260px volta a cortar o editor)",
    file: P52CSS,
    find: `    #v32editor .v32-subs .v32-signals,
    #v32editor .v32-arch,`,
    repl: `    #v32editor .v32-arch,`,
    gate: "V322C-RFL1", cmd: "node tests_p52_chromium.js", only: "V322C-RFL1",
    reason: /caixa\(s\) do editor além de/
  },
  {
    id: "V322C-M10",
    desc: "não remover o #v32errors externo da entrada HOME (M-02: id duplicado volta)",
    file: P52JS,
    find: `    var interna = ed.querySelector(".v32-errors");`,
    repl: `    var interna = null;`,
    gate: "V322C-ID1", cmd: "node tests_p52_layout.js", only: "V322C-ID1",
    reason: /ids duplicados no documento/
  },
  {
    id: "V322C-M11",
    desc: "devolver o azul de marca ao preenchimento com texto branco (M-05: 3,99:1)",
    file: P52CSS,
    find: `:root { --p52-blue-strong: #2B72CB; }`,
    repl: `:root { --p52-blue-strong: #307FE2; }`,
    gate: "V322C-CON1", cmd: "node tests_p52_chromium.js", only: "V322C-CON1",
    reason: /#ux-addctx \(home\): contraste/
  }
];

/* Filtro OPCIONAL (P52_MUT_ONLY="P52-M1,P52-M7") para verificação dirigida. A
   campanha de entrega roda SEM filtro; quando o filtro está ativo o total
   impresso declara explicitamente a execução parcial. O nome da variável é o
   desta harness e não muda — vale para a campanha E para o preflight. */
function selecionar() {
  const only = (process.env.P52_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
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
    harness: "p52",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* Declaração do que o harness realmente muta — oráculo de IC-6. Sai de
       MUTANTS inteiro, não da seleção: o filtro reduz a medição, não o alvo. */
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
  process.stderr.write("PREFLIGHT p52 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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

const { only: ONLY, sel: SELECTED } = selecionar();

(async () => {
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, desc: m.desc, gate: m.gate, estado,
                  causa: causa || "", nota: nota || "",
                  /* `detected` preservado: o recibo P52-mutation.json é lido por
                     auditoria anterior a esta demanda e não pode perder o campo. */
                  detected: estado === DETECTADO, note: nota || "",
                  line: String(linha || "").slice(0, 220) });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).slice(0, 220));
    console.log("");
  };

  /* T5 · um número que não foi medido não é impresso; com U == 0 a linha
     histórica sai LITERAL (R13), que é o que mantém comparabilidade com a
     evidência da fase 5.2. */
  const fechar = () => {
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_p52_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U +
        " não executados (de " + SELECTED.length + ")" +
        (ONLY.length ? " · inventário completo: " + MUTANTS.length : ""));
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO)) {
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
      }
    } else {
      console.log("\nMUTATION TESTING (Phase 5.2) [tests_p52_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados");
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    /* Recibo só quando houve campanha completa e medida. BASE_HTML_SHA nulo =
       nada foi construído (interpretador ausente ou build base quebrado): não se
       escreve recibo de campanha que não existiu. */
    if (!ONLY.length && BASE_HTML_SHA) {
      fs.mkdirSync(EVID, { recursive: true });
      const baseline = {}; MUTABLE.forEach(f => { baseline[path.basename(f)] = BASE_SHA[f]; });
      baseline.html = BASE_HTML_SHA;
      fs.writeFileSync(path.join(EVID, "P52-mutation.json"),
        JSON.stringify({ baseline, detected: D, sobreviventes: S, nao_executados: U,
          total: SELECTED.length, mutants: report }, null, 2) + "\n", "utf8");
    }
    process.exit(D === SELECTED.length ? 0 : 1);
  };

  /* T1/IC-3(a) · interpretador ausente NÃO é mais um crash sem rótulo no build
     inicial: é classificado. Aborta ANTES de construir e antes de mutar —
     nenhum arquivo tocado, nenhum recibo escrito, a árvore fica limpa, e nada é
     dado por detectado ou por sobrevivente. */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de construir e antes de mutar; nenhum arquivo tocado\n");
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
  console.log("baseline: html " + BASE_HTML_SHA.slice(0, 16) + " · " +
    MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · ") + "\n");
  if (ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + ONLY.join(", ") + "\n");

  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    /* Âncora provada por CONTAGEM antes de mutar (T6/IC-4): sem unicidade não se
       muta, e o par não vira veredito. */
    const n = src.split(m.find).length - 1;
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
        const r = run(m.cmd, filtro(m));
        if (r.spawnFalhou) {
          /* D1 · o processo do gate não chegou a existir: NÃO EXECUTADO. */
          estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = r.erro.slice(0, 160);
        } else if (m.lineless) {
          /* Mutante sem linha nomeada de gate: o oráculo é o exit da suíte
             inteira, que rodou. Continua um par detectado/sobrevivente. */
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
      fs.writeFileSync(m.file, src, "utf8");
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica");
      const bad = checkEvidence(true);
      if (bad.length) { build(); throw new Error(m.id + ": acervo de evidência violado — " + bad.join(" · ")); }
    }
    emitir(m, estado, causa, nota, linha);
  }

  buildOuFalha("fecho da campanha");
  const back = sha(HTML);
  const evFinal = checkEvidence(false);
  if (evFinal.length) throw new Error("acervo de evidência divergente ao fim da campanha — " + evFinal.join(" · "));
  console.log("restauração: " + MUTABLE.map(f => path.basename(f) + " " +
    (sha(f) === BASE_SHA[f] ? "OK" : "DIVERGENTE")).join(" · ") +
    " · html " + (back === BASE_HTML_SHA ? "OK" : "DIVERGENTE (" + back.slice(0, 16) + ")"));
  console.log("acervo de evidência: " + GUARDED.length + " arquivo(s) byte-idênticos ao início");
  fechar();
})().catch(e => { console.error("MUTATION P52: falha fatal —", e && e.stack || e); process.exit(1); });
