/* ============================================================================
   HARNESS DE MUTAÇÃO · D011 — NUMERAÇÃO DAS PRIORIDADES
   demanda `011-numeracao-das-prioridades` · T018 (wave 5) · dono: qa-engineer

   Prova o PODER DISCRIMINANTE dos 6 gates de `tests_011_prioridade.js`. Sem um
   mutante morto, gate verde só prova que o produto não explodiu — R3 §5 e R10
   tratam isso como gate que não mede.

   Shape copiado de `tests_009_mutants.js` (R9: cópia de shape, nunca extração
   de runner comum):
     1. âncora textual ÚNICA no source (find casa exatamente 1x — âncora ausente
        ou ambígua é NÃO EXECUTADO com causa nomeada, nunca silêncio);
     2. mutação in-place + rebuild determinístico do HTML gerado;
     3. execução do oráculo SEMANTICAMENTE correspondente, FILTRADO (`D011_ONLY`);
     4. exige reprovação daquele oráculo COM MOTIVO compatível — a `reason` casa
        a ALÍNEA que o gate emite (`D011-XXX(c)`), não o stdout inteiro:
        detecção incidental não conta como detecção;
     5. restauração byte a byte provada por SHA-256, do source E do HTML.

   OS TRÊS ESTADOS (vocabulário do `d010`, e o `d011` nasce com ele)
     · DETECTADO      — o oráculo reprovou pela alínea atribuída;
     · SOBREVIVENTE   — não reprovou, ou reprovou por motivo diferente;
     · NÃO EXECUTADO  — com causa do conjunto FECHADO de `check_mutation.py`
                        (T4/013): "interpretador ausente", "âncora não
                        encontrada", "âncora ambígua", "rebuild falhou",
                        "gate não pôde ser executado".
   Sobrevivente e não executado são vermelhos DIFERENTES e nunca se fundem:
   fundir os dois é o que faz uma campanha devolver falso sobrevivente quando o
   ambiente é que faltou.

   O QUE NÃO ESTÁ AQUI, E POR QUÊ — não é omissão, é raia
     · `D011-M6` (edita um byte de `ui_ux_v32.js`) e `D011-M8` (altera o
       mapeamento tecla→finding em `quickscan_secops_soccmm_v3_1_3.html:1058`)
       mutam arquivos da classe `frozen` / §29.4. O harness automatizado NUNCA
       toca `PROTECTED`: os dois rodam em WORKTREE EFÊMERA, manualmente, e a
       matriz registra a raia. Foi exatamente aqui que a demanda 009 se queimou
       — campanha abandonada deixou mutante aplicado em arquivo protegido.
     · `D011-M9` (cor calculada para ~3,9:1) exige Chromium: job `visual` do CI
       e rito do proprietário (KI-3). Deferido COM registro, nunca "pendente".

   Execução: stage `mutation` (trigger por path, `.claude/verify/check_mutation.py`)
   — requires: node + python, SEM Chromium: nenhum gate de
   `tests_011_prioridade.js` mede geometria.

   Filtro de depuração: D011_MUT_ONLY=D011-M2,D011-M13 node tests_011_mutants.js

   CONTRATOS DA DEMANDA 013 HERDADOS POR CONSTRUÇÃO
   T1 · o interpretador tem UMA fonte: `MUTATION_PY` (override do operador) ou o
        padrão por plataforma da referência da casa (`tests_core_mutants.js:22`).
        É a MESMA regra de `mutation_py_bin()` em `check_mutation.py` (C4).
        Interpretador E script vão entre aspas (R10 §7).
   T6 · `--preflight` (argv): resolve o interpretador e CONTA as ocorrências de
        cada âncora. Não muta, não reconstrói, não executa oráculo e não escreve
        nada (C1 / R7 §3) — nem o rebuild que `main()` faz na primeira linha.
        Um objeto JSON em stdout; todo texto humano vai para stderr. Exit 0 sse
        interpretador resolvido e toda âncora com ocorrencias == 1.
        `mutation_map.json` declara `"preflight": true` no MESMO commit (D4).
   ============================================================================ */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;

/* ── T1 · interpretador: fonte ÚNICA, a mesma de check_mutation.py (C4) ───── */
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const BUILD_PY = path.join(HERE, "build_v32_html.py");
const LINT_PY = path.join(HERE, ".claude", "verify", "check_lint_arch.py");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

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

const MOD_JS = path.join(HERE, "ui_d011_prioridade_v32.js");
const MOD_CSS = path.join(HERE, "ui_d011_prioridade_v32.css");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");

/* `build_v32_html.py` é alvo mutável: a injeção do bloco CSS no artefato
   publicado é comportamento verificável (D011-M18), e sem ela a regra de print
   do módulo simplesmente não chega ao leitor. */
const MUTABLE = [MOD_JS, MOD_CSS, BUILD_PY];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });
let BASE_HTML_SHA = null;

const SUITE = "node tests_011_prioridade.js";

/* ==========================================================================
   OS MUTANTES

   `gate` é o oráculo que DEVE reprovar; `reason` é o motivo exigido, casado
   contra a LINHA daquele gate — e sempre com a ALÍNEA, porque é a alínea que
   carrega o poder discriminante. Mutante que derrube o gate por outra alínea é
   SOBREVIVENTE para o par: mediu-se outra coisa.

   `oraculo: "lint"` roda o stage `lint-arch` em vez da suíte — é o carrasco
   real de C8, e o único do repositório que alcança `innerHTML=` no módulo.
   ========================================================================== */
const MUTANTS = [
  /* ------------------------------------------------------------- C2 · KEY2 */
  {
    id: "D011-M1",
    desc: "restaura o '·' nos itens sem atalho — a ausência de atalho volta a ser desenhada como glifo",
    file: MOD_JS,
    find: '    return { texto: "", marcador: "mudo", atalho: null };',
    repl: '    return { texto: "·", marcador: "mudo", atalho: null };   /* MUTANTE D011-M1 */',
    gate: "D011-KEY2",
    reason: /D011-KEY2\(c\): \d+ item\(ns\) sem atalho ainda exibem glifo/,
    /* PROVA DE DESENHO: tem de SOBREVIVER a D011-KEY1. O '·' não é dígito, e C1
       só fala de glifo NUMÉRICO — se KEY1 também reprovasse aqui, as duas
       asserções estariam medindo a mesma coisa e uma seria supérflua. */
    sobrevive: { gate: "D011-KEY1" }
  },

  /* ------------------------------------------------------------- C1 · KEY1 */
  {
    id: "D011-M2",
    desc: "renumera o glifo pela POSIÇÃO VISUAL pós-agrupamento em vez do índice canônico",
    file: MOD_JS,
    find: '    for (var i = 0; i < findings.length; i++) {\n      var id = findings[i].id;',
    repl: '    var __visual = Array.prototype.map.call(app.querySelectorAll(".opt"), function (b) { return b.dataset.id; });\n' +
          '    for (var i0 = 0; i0 < findings.length; i0++) {   /* MUTANTE D011-M2 */\n' +
          '      var id = findings[i0].id;\n' +
          '      var i = __visual.indexOf(id) >= 0 ? __visual.indexOf(id) : i0;',
    gate: "D011-KEY1",
    reason: /D011-KEY1\(c\): o glifo 1 está em/
  },

  /* ------------------------------------------------------------- C3 · ACC1 */
  {
    id: "D011-M3",
    desc: "remove aria-keyshortcuts do item SELECIONADO — o atalho some justamente sob o ✓",
    file: MOD_JS,
    find: '    if (selecionado) return { texto: "✓", marcador: "estado", atalho: digito };',
    repl: '    if (selecionado) return { texto: "✓", marcador: "estado", atalho: null };   /* MUTANTE D011-M3 */',
    gate: "D011-ACC1",
    reason: /D011-ACC1\(e\): o item selecionado de índice 0 perdeu o atalho declarado/
  },
  {
    id: "D011-M3B",
    desc: "aplica aria-keyshortcuts a TODOS os botões, inclusive aos que não têm atalho (2ª variante que a spec nomeia em M3)",
    file: MOD_JS,
    find: '      porAtributo(botao, "aria-keyshortcuts", alvo.atalho);',
    repl: '      porAtributo(botao, "aria-keyshortcuts", alvo.atalho === null ? String(i + 1) : alvo.atalho);   /* MUTANTE D011-M3B */',
    gate: "D011-ACC1",
    reason: /D011-ACC1\(d\): \d+ divergência\(s\) de aria-keyshortcuts/
  },
  {
    id: "D011-M14",
    desc: "não escreve aria-hidden no .key — o glifo volta a ser conteúdo do botão para quem não vê a tela",
    file: MOD_JS,
    find: '      porAtributo(key, "aria-hidden", "true");',
    repl: '      /* MUTANTE D011-M14: aria-hidden não escrito */',
    gate: "D011-ACC1",
    reason: /D011-ACC1\(b\): \d+\/\d+ \.key sem aria-hidden/
  },
  {
    id: "D011-M16",
    desc: "monta a legenda DENTRO do primeiro botão — conteúdo visível passa a preceder o rótulo da pergunta",
    file: MOD_JS,
    find: '  var SEL_MONTAGEM = ".ux-priolayout";',
    repl: '  var SEL_MONTAGEM = ".opt";   /* MUTANTE D011-M16 */',
    gate: "D011-ACC1",
    reason: /D011-ACC1\(c\): \d+ botões cujo texto sem aria-hidden não começa pelo rótulo/
  },

  /* ------------------------------------------------------------- C4 · LEG1 */
  {
    id: "D011-M5",
    desc: "legenda ausente — a tela deixa de dizer o que o número é",
    file: MOD_JS,
    find: '    sincronizarLegenda(app, findings.length > 0);',
    repl: '    sincronizarLegenda(app, false);   /* MUTANTE D011-M5 */',
    gate: "D011-LEG1",
    reason: /D011-LEG1\(b\): 0 nó\(s\) com o texto canônico da legenda/
  },
  {
    id: "D011-M5B",
    desc: "a legenda AFIRMA a ordem em vez do atalho — inverte o critério em vez de removê-lo (2ª variante de M5 na spec)",
    file: MOD_JS,
    find: '  var TEXTO_LEGENDA = "Os números são atalhos de teclado — não a ordem de prioridade.";',
    repl: '  var TEXTO_LEGENDA = "Os números indicam a ordem de prioridade.";   /* MUTANTE D011-M5B */',
    gate: "D011-LEG1",
    reason: /D011-LEG1\(b\): 0 nó\(s\) com o texto canônico da legenda/
  },
  {
    id: "D011-M15",
    desc: "monta a legenda dentro do PRIMEIRO GRUPO de domínio — deixa de ser ancestral comum da grade inteira",
    file: MOD_JS,
    find: '  var SEL_MONTAGEM = ".ux-priolayout";',
    repl: '  var SEL_MONTAGEM = ".ux-priogroup";   /* MUTANTE D011-M15 */',
    gate: "D011-LEG1",
    reason: /D011-LEG1\(c\): o container da legenda não abrange/
  },
  {
    id: "D011-M17",
    desc: "cria a legenda INCONDICIONALMENTE — quebra o 'se e somente se' na direção da criação: grade sem botão fica com a frase",
    file: MOD_JS,
    find: '    sincronizarLegenda(app, findings.length > 0);',
    repl: '    sincronizarLegenda(app, true);   /* MUTANTE D011-M17 */',
    gate: "D011-LEG1",
    reason: /D011-LEG1\(d\): \d+ legenda\(s\) numa grade sem botão/
  },

  /* ------------------------------------------------------------ C5 · IDEM1 */
  {
    id: "D011-M4",
    desc: "guarda global __done: decora uma vez só e nunca reaplica após a reconstrução do DOM",
    file: MOD_JS,
    find: '  function decorar() {\n    var app = document.getElementById("app");',
    repl: '  var __done = false;   /* MUTANTE D011-M4 */\n' +
          '  function decorar() {\n' +
          '    if (__done) return;\n' +
          '    __done = true;\n' +
          '    var app = document.getElementById("app");',
    gate: "D011-IDEM1",
    reason: /D011-IDEM1\(c\): depois do toggle o estado diverge do oráculo/
  },
  {
    id: "D011-M11",
    desc: "NÃO instala o observador — ataca o patch-point PP-011-1, e não o efeito",
    file: MOD_JS,
    find: '  instalarObservador();',
    repl: '  /* MUTANTE D011-M11: observador não instalado */',
    gate: "D011-IDEM1",
    reason: /D011-IDEM1\(b\): estado inicial diverge do oráculo/,
    /* CONTRAPROVA DE QUE A SUÍTE NÃO TEM ATALHO: nenhum gate D011-* chama a
       decoração à mão (`__D011` não expõe decorar() de propósito), então matar
       o observador tem de derrubar TUDO que é comportamento. Se algum destes
       sobrevivesse, existiria caminho de teste que não passa pelo patch-point. */
    mataTambem: ["D011-KEY2", "D011-ACC1", "D011-LEG1"],
    /* E tem de SOBREVIVER a D011-KEY1: KEY1 é critério de PRESERVAÇÃO e mede o
       que a Camada 1 congelada já fazia. Módulo morto não pode quebrá-lo — se
       quebrasse, o módulo estaria mexendo em algo que não é dele. */
    sobrevive: { gate: "D011-KEY1" }
  },

  /* ------------------------------------------------------------ C11 · PRT1 */
  {
    id: "D011-M10",
    desc: "estende a regra de print ao ✓/.sel — apaga o ESTADO de seleção no papel",
    file: MOD_CSS,
    find: '  .d011-key[data-d011="atalho"]{ visibility: hidden; }',
    repl: '  .d011-key{ visibility: hidden; }   /* MUTANTE D011-M10 */',
    gate: "D011-PRT1",
    reason: /D011-PRT1\(e\): a regra de print apaga o estado de seleção no papel/
  },
  {
    id: "D011-M12",
    desc: "remove a cláusula da LEGENDA do @media print — no papel a frase fica ao lado dos badges 'Prioridade N', que SÃO a ordem",
    file: MOD_CSS,
    find: '  .d011-legenda{ display: none; }',
    repl: '  /* MUTANTE D011-M12: cláusula da legenda removida */',
    gate: "D011-PRT1",
    reason: /D011-PRT1\(d\): a legenda não é alcançada por nenhuma regra de ocultação/
  },
  {
    id: "D011-M13",
    desc: "remove a cláusula do GLIFO do @media print — metade simétrica de M12; sem ele uma das duas cláusulas 'indivisíveis' ficaria sem carrasco",
    file: MOD_CSS,
    find: '  .d011-key[data-d011="atalho"]{ visibility: hidden; }',
    repl: '  /* MUTANTE D011-M13: cláusula do glifo removida */',
    gate: "D011-PRT1",
    reason: /D011-PRT1\(c\): o \.key do item com atalho .* não é alcançado por nenhuma regra de ocultação/
  },
  {
    id: "D011-M19",
    desc: "escreve a regra de print contra SELETOR ALHEIO (.opt .key) em vez da classe do próprio módulo — R9 §6",
    file: MOD_CSS,
    find: '  .d011-key[data-d011="atalho"]{ visibility: hidden; }',
    repl: '  .opt .key[data-d011="atalho"]{ visibility: hidden; }   /* MUTANTE D011-M19 */',
    gate: "D011-PRT1",
    reason: /D011-PRT1\(b\): \d+ seletor\(es\) fora do prefixo do módulo/
  },
  {
    id: "D011-M18",
    desc: "o builder deixa de injetar o bloco CSS do módulo — a regra de print existe no fonte e não chega ao artefato publicado",
    file: BUILD_PY,
    find: '/* V32_P52CSS_END */\\n/* V32_D011CSS_BEGIN */\\n" + d011css + "\\n/* V32_D011CSS_END */\\n</style>")',
    repl: '/* V32_P52CSS_END */\\n</style>")   # MUTANTE D011-M18',
    gate: "D011-PRT1",
    reason: /bloco CSS do módulo ausente ou duplicado no HTML construído: 0×/
  },

  /* ------------------------------------------------------------- C8 · lint */
  {
    id: "D011-M7",
    desc: "escreve a legenda com innerHTML= — o caminho fácil que R9 §9 proíbe em módulo novo",
    file: MOD_JS,
    find: '      legenda.textContent = TEXTO_LEGENDA;',
    repl: '      legenda.innerHTML = TEXTO_LEGENDA;   /* MUTANTE D011-M7 */',
    oraculo: "lint",
    gate: "lint-arch (check_lint_arch.py)",
    reason: /ui_d011_prioridade_v32\.js: atribuição \.innerHTML=/
  }
];

/* ========================================================================== */

/* Interpretador E script SEMPRE entre aspas (R10 §7). */
function build() { execSync('"' + PY + '" "' + BUILD_PY + '"', { cwd: HERE, stdio: "pipe" }); }

function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env, encoding: "utf8" }) }; }
  catch (e) { return { code: e.status || 1, out: (e.stdout || "") + (e.stderr || "") }; }
}

function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/-/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

/* Executa o oráculo do mutante e devolve o veredito.
   `suite`: a linha do gate filtrado. `lint`: a linha [FAIL] do stage. */
function executarOraculo(m) {
  if (m.oraculo === "lint") {
    const r = run('"' + PY + '" "' + LINT_PY + '"', {});
    const linhas = r.out.split(/\r?\n/);
    const linha = linhas.find(l => /^\[FAIL\]/.test(l) && /ui_d011_/.test(l)) ||
                  linhas.find(l => /^\[FAIL\]/.test(l)) || "";
    return { linha: linha, reprovou: r.code !== 0 && !!linha, executou: /lint-arch:/.test(r.out) };
  }
  const r = run(SUITE, { D011_ONLY: m.gate });
  const linha = gateLine(r.out, m.gate) || "";
  return { linha: linha, reprovou: /^FAIL/.test(linha), executou: !!linha };
}

const ONLY = (process.env.D011_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
const SELECTED = ONLY.length ? MUTANTS.filter(m => ONLY.indexOf(m.id) >= 0) : MUTANTS;

/* Conjunto FECHADO de causas de NÃO EXECUTADO — idêntico ao de
   check_mutation.py (T4/013). String fora do conjunto reprova IC-4 por si só. */
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente: "âncora não encontrada",
  ambigua: "âncora ambígua",
  rebuild: "rebuild falhou",
  gate: "gate não pôde ser executado"
};

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

/* Contagem, não presença: 0 é âncora podre e ≥2 é âncora ambígua. Expressão
   IDÊNTICA à que o laço da campanha usa antes de mutar, para que o que o
   preflight promete e o que a campanha faz não possam divergir. */
function ocorrencias(m) {
  return fs.readFileSync(m.file, "utf8").split(m.find).length - 1;
}

/* ── T6 · modo preflight (argv) · emite o contrato C1 ────────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d011",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* Sai de MUTANTS inteiro, não da seleção: D011_MUT_ONLY filtra a medição,
       nunca o alvo declarado (oráculo de IC-6). */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = {
      id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
      estado: n === 1 ? "ok" : "nao_executavel"
    };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d011 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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

/* `main()` reconstrói o HTML na primeira linha, e o preflight não pode escrever
   nada (C1) — por isso o desvio acontece ANTES. */
if (process.argv.slice(2).indexOf("--preflight") >= 0) {
  process.exit(preflight(SELECTED));
}

(function main() {
  if (!resolvePy(PY)) {
    /* Sem interpretador nada muta e nada reconstrói: a campanha inteira é NÃO
       EXECUTADO com causa nomeada — jamais 0 sobreviventes por não ter rodado. */
    console.log("D011 MUTATION · " + SELECTED.length + " mutante(s)");
    for (const m of SELECTED) {
      console.log(NAO_EXECUTADO + "  " + m.id + " · " + m.desc +
        "\n                  causa: " + CAUSA.interpretador + " (" + PY + ", origem " + PY_ORIGEM + ")\n");
    }
    console.log("D011 MUTATION: 0 DETECTADO · 0 SOBREVIVENTE · " + SELECTED.length +
      " NÃO EXECUTADO de " + SELECTED.length);
    process.exit(1);
  }

  build();
  BASE_HTML_SHA = sha(HTML);
  console.log("D011 MUTATION · " + SELECTED.length + " mutante(s)" + (ONLY.length ? " [PARCIAL]" : "") +
    " · baseline html " + BASE_HTML_SHA.slice(0, 12) + " · " +
    MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 8)).join(" · ") + "\n");

  const detectados = [], sobreviventes = [], naoExecutados = [];

  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    const hits = src.split(m.find).length - 1;
    if (hits !== 1) {
      /* R10 §2: âncora perdida NUNCA vira silêncio, e nunca vira sobrevivente:
         um `find` que não aplica é um mutante que não existe. */
      naoExecutados.push(m.id);
      console.log(NAO_EXECUTADO + "  " + m.id + " · " + m.desc +
        "\n                  causa: " + (hits === 0 ? CAUSA.ausente : CAUSA.ambigua) +
        " — ocorrencias=" + hits + " em " + path.basename(m.file) + " (esperado 1)\n");
      continue;
    }

    let estado = SOBREVIVENTE, nota = "", linha = "", extra = "";
    try {
      fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
      try { build(); }
      catch (e) {
        estado = NAO_EXECUTADO;
        nota = CAUSA.rebuild + " — " + String((e && e.message) || e).split(/\r?\n/)[0].slice(0, 120);
      }

      if (estado !== NAO_EXECUTADO) {
        const v = executarOraculo(m);
        linha = v.linha;
        if (!v.executou) {
          estado = NAO_EXECUTADO;
          nota = CAUSA.gate + " — o oráculo não emitiu veredito";
        } else if (!v.reprovou) {
          nota = "o oráculo NÃO reprovou — sem poder discriminante";
        } else if (!m.reason.test(linha)) {
          nota = "reprovou por motivo DIFERENTE do esperado (detecção incidental não conta)";
        } else {
          estado = DETECTADO;
        }
      }

      /* prova de desenho: gate que, por construção, tem de SOBREVIVER */
      if (estado === DETECTADO && m.sobrevive) {
        const s = run(SUITE, { D011_ONLY: m.sobrevive.gate });
        const sl = gateLine(s.out, m.sobrevive.gate) || "";
        const ok = /^PASS/.test(sl);
        extra += "\n                  desenho: " + m.sobrevive.gate + " → " +
          (ok ? "SOBREVIVEU (esperado)" : "REPROVOU TAMBÉM — o par perdeu o desenho, reabra a análise") +
          (sl ? "  [" + sl.slice(0, 110) + "]" : "  [sem linha]");
        if (!ok) { estado = SOBREVIVENTE; nota = (nota ? nota + " · " : "") + "prova de desenho quebrada"; }
      }

      /* contraprova do patch-point: gates que TÊM de cair junto */
      if (estado === DETECTADO && m.mataTambem) {
        for (const g of m.mataTambem) {
          const s = run(SUITE, { D011_ONLY: g });
          const sl = gateLine(s.out, g) || "";
          const caiu = /^FAIL/.test(sl);
          extra += "\n                  contraprova: " + g + " → " +
            (caiu ? "REPROVOU (esperado)" : "PASSOU — existe caminho de teste que não passa pelo patch-point");
          if (!caiu) {
            estado = SOBREVIVENTE;
            nota = (nota ? nota + " · " : "") + "contraprova do patch-point quebrada em " + g;
          }
        }
      }
    } finally {
      fs.writeFileSync(m.file, src, "utf8");
      /* rebuild TAMBÉM na restauração: se algo abortar no meio da campanha, a
         árvore não fica com o HTML gerado a partir de um módulo defeituoso
         (`check_mutation.py` exige porcelain limpo, e HTML sujo é o rastro mais
         caro de diagnosticar). */
      try { build(); } catch (e) { /* o confronto de SHA abaixo denuncia */ }
      if (sha(m.file) !== BASE_SHA[m.file]) {
        throw new Error(m.id + ": restauração NÃO byte-idêntica de " + path.basename(m.file));
      }
    }

    if (estado === DETECTADO) detectados.push(m.id);
    else if (estado === NAO_EXECUTADO) naoExecutados.push(m.id);
    else sobreviventes.push(m.id);

    console.log(estado + "  " + m.id + " · " + m.desc +
      "\n                  oráculo: " + m.gate + (nota ? " · " + nota : "") +
      "\n                  " + (linha ? linha.slice(0, 240) : "(sem linha do oráculo)") + extra + "\n");
  }

  build();
  const htmlOk = sha(HTML) === BASE_HTML_SHA;
  const srcOk = MUTABLE.every(f => sha(f) === BASE_SHA[f]);
  console.log("restauração: source " + (srcOk ? "byte a byte OK" : "DIVERGENTE") +
    " · html " + (htmlOk ? "byte a byte OK" : "DIVERGENTE (" + sha(HTML).slice(0, 12) + ")"));
  console.log("D011 MUTATION: " + detectados.length + " DETECTADO · " + sobreviventes.length +
    " SOBREVIVENTE · " + naoExecutados.length + " NÃO EXECUTADO de " + SELECTED.length +
    (sobreviventes.length ? "\n  SOBREVIVENTES: " + sobreviventes.join(", ") : "") +
    (naoExecutados.length ? "\n  NÃO EXECUTADOS: " + naoExecutados.join(", ") : ""));
  process.exit((sobreviventes.length || naoExecutados.length || !srcOk || !htmlOk) ? 1 : 0);
})();
