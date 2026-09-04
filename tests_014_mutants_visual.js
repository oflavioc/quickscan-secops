/* ============================================================================
   CAMPANHA DE MUTAÇÃO VISUAL · DEMANDA 014 — gate sem poder discriminante
   harness `d014vis` · T061 (wave 6) · dono: qa-engineer
   ============================================================================
   UM mutante, e é o fecho da demanda: `D014-M10` muta a COLOCAÇÃO que decide
   a composição da tela de pergunta na camada que hoje a governa —
   `body[data-uxscreen="question"] .wrap > #p50-shell { grid-column: 2 }` de
   ui_p52_workspace_v32.css:86 (5.2) vira `grid-column: 1`: o mapa cai na MESMA
   célula da pergunta (linha 3, coluna 1). É a substituição nominal do `M51-01`
   (aposentado na wave 5). O carrasco é `P52-LAY2` (tests_p52_chromium.js:231),
   gate EXISTENTE de suíte INVOCADA E NUNCA EDITADA — a autorização §29.4
   daquele arquivo era da demanda 010 e não se transfere; aqui só se executa.

   REANCORADO pela errata E13 (2026-09-04). A forma anterior — `:77`,
   `grid-template-columns: minmax(0, 1fr) clamp(320px, 23vw, 440px)` →
   `minmax(0, 1fr)`, "uma coluna" — foi medida SOBREVIVENTE no job `visual`
   (run 33516136516, workflow_dispatch sobre 5cf7c82, 2026-09-01). Causa,
   MEDIDA e não raciocinada: tirar o 2º track NÃO tira a 2ª coluna.
   `grid-template-areas:"main side"` da 5.1 (ui_p50_v32.css:697, mesmo
   breakpoint, VIVA — a própria varredura desta demanda a classificou assim)
   mantém a grade explícita em duas colunas e a não dimensionada cai em
   `grid-auto-columns: auto`; e mesmo sem as áreas, a colocação explícita
   `grid-column: 2` cria track implícito. P52-LAY2 mede esquerda, sobreposição,
   topo e rodapé — nunca largura de coluna — e a largura da coluna 2 era a
   única coisa que aquela mutação alterava (320→301px em 1280). Colocação
   explícita nunca empilha. A forma velha NÃO renasce (R2 §5): a refutação
   está no par da mutation-matrix.json e na E13.

   Partição E1 da spec: este harness exige Chromium (`requires: [node, python,
   chromium]`) e fecha no job `visual` do CI (KI-3, design-decisions.md) — o
   job executa check_mutation.py com navegador presente. Localmente, sem
   Chromium, a campanha aborta ANTES de tocar qualquer arquivo e emite
   NÃO EXECUTADO com a causa do conjunto fechado — o par nasce assim na
   mutation-matrix.json e é fechado em T081 com o resultado do job.

   CICLO (a parte que mais falha é a restauração, e por isso ela é dupla):
     1. resolve interpretador e Chromium ANTES de mutar — ausência aborta com a
        árvore intacta;
     2. build BASE (python build_v32_html.py, interpretador E script entre
        aspas — R10 §7) e SHA-256 do artefato como baseline;
     3. muta a folha in-place → REBUILD (a mutação tem de chegar ao artefato
        que o navegador abre, senão o gate mede o produto de ontem) → roda
        `node tests_p52_chromium.js` com P52_ONLY=P52-LAY2 pelo AMBIENTE
        (nunca prefixo POSIX no cmd — IC-1) e P52_NO_EVIDENCE=1 (evidência é
        subproduto; a campanha não promove evidência — R11 §1/§2);
     4. `finally` INCONDICIONAL: restaura a folha byte a byte, REBUILD de novo
        (restaura o artefato), e prova por SHA-256 — folha E HTML — que os dois
        voltaram ao baseline. Teste que estoura no meio não deixa rastro:
        o porcelain ESCOPADO (folha + artefato) sai impresso no fecho e
        qualquer sujeira derruba o exit (R7 §3).

   VEREDITO: vocabulário fechado de três estados (DETECTADO · SOBREVIVENTE ·
   NÃO EXECUTADO com causa do conjunto fechado de T4 da 013). O kill exige a
   linha do PRÓPRIO gate P52-LAY2 em FAIL com um dos três motivos que a spec
   fixou (célula C4): a pergunta não está à esquerda do mapa · as colunas se
   sobrepõem · colunas desalinhadas no topo. O runner do p52 imprime o detalhe
   NA MESMA linha do FAIL, então a linha basta — reprovar por outro motivo é
   SOBREVIVENTE, não kill. No NÃO-KILL a nota do bloco carrega a SONDA
   DIAGNÓSTICA (E13): é a única parte da saída deste harness que
   check_mutation.py ecoa no log do CI além das duas últimas linhas — ver
   `sondar()`.

   `--preflight` (argv) — D4 da 013, no MESMO commit da entrada `d014vis` no
   mutation_map.json. Não muta, não reconstrói, não executa gate, não abre
   navegador, não escreve nada; o Chromium NÃO é pré-condição do preflight
   (contrato C1 exige o interpretador; IC-4 roda o preflight em ambiente sem
   navegador). Emite `find`/`repl` (mutante de CSS — extensão E3): é por eles
   que a varredura de regra morta avalia a declaração que este mutante altera
   (`grid-column` em `body[data-uxscreen="question"] .wrap > #p50-shell`: para
   a varredura é INDECIDÍVEL — `gramatica-de-seletor-recusada`, o combinador
   `>` está fora da relação decidível (C6/E9) — e entra NOMEADA E CONTADA na
   lista da árvore (20 → 21 indecidíveis, 14 → 15 mutantes; contagem não
   pinada, E9), nunca engolida. A vida desta declaração é provada pelo KILL
   medido, não pela varredura. Medido com o instrumento em 2026-09-04, E13.)
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const HERE = __dirname;

/* Interpretador com UMA fonte (T1/C4 da 013); interpretador E script sempre
   entre aspas (R10 §7 — a família P2.1-16/I11/S64 quebrou em path com espaço). */
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const BUILD_PY = path.join(HERE, "build_v32_html.py");

const CSS = path.join(HERE, "ui_p52_workspace_v32.css");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");

const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");

/* Resolve o binário no PATH sem lançar processo NENHUM (C1 / R7 §3). */
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

/* Chromium presente? MESMA régua de check_mutation.have("chromium") — o que o
   stage declara e o que a campanha exige não podem divergir (C4 da 013). */
function temChromium() {
  const explicit = process.env.CHROME_PATH;
  if (explicit && fs.existsSync(explicit)) return true;
  const cache = path.join(process.env.LOCALAPPDATA ||
    path.join(require("os").homedir(), ".cache"), "ms-playwright");
  try { return fs.readdirSync(cache).some(d => d.indexOf("chromium") >= 0); }
  catch (e) { return false; }
}

/* ── vocabulário fechado (T4 da 013) ──────────────────────────────────────── */
const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente:       "âncora não encontrada",
  ambigua:       "âncora ambígua",
  rebuild:       "rebuild falhou",
  gate:          "gate não pôde ser executado"
};
const naoClassificada = msg => "falha não classificada: " + msg;

/* ==========================================================================
   O MUTANTE · D014-M10 — a réplica é a da célula C4 da spec, literal.
   ========================================================================== */
const MUTANTS = [
  { id: "D014-M10", file: CSS, gate: "P52-LAY2",
    desc: "no desktop o mapa deixa de ficar ao lado da pergunta: #p50-shell vai para a coluna 1 e ocupa a mesma célula de #app",
    reason: /a pergunta não está à esquerda do mapa|as colunas se sobrepõem|colunas desalinhadas no topo/,
    find: '    body[data-uxscreen="question"] .wrap > #p50-shell { grid-column: 2; grid-row: 3; min-width: 0; }',
    repl: '    body[data-uxscreen="question"] .wrap > #p50-shell { grid-column: 1; grid-row: 3; min-width: 0; }   /* MUTANTE D014-M10: mesma célula que #app */' }
];

const BASE_CSS_SHA = sha(CSS);
let BASE_HTML_SHA = null;

/* ── execução de processo ─────────────────────────────────────────────────── */
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }) }; }
  catch (e) {
    const saiu = typeof e.status === "number";
    return { code: saiu ? e.status : -1, out: (e.stdout || "") + (e.stderr || ""),
             erro: String(e.message || "").split("\n")[0], spawnFalhou: !saiu };
  }
}
function build() { return run('"' + PY + '" "' + BUILD_PY + '"'); }

const CMD = "node tests_p52_chromium.js";
/* O filtro e o corte de evidência viajam pelo AMBIENTE, nunca por prefixo
   POSIX no comando (IC-1; prefixo de variável não existe no cmd.exe). */
const ENV_GATE = { P52_ONLY: "P52-LAY2", P52_NO_EVIDENCE: "1" };

/* Linha PASS/FAIL do gate esperado — o runner do p52 põe o detalhe na própria
   linha. Ausência de linha = gate não executado → NÃO EXECUTADO, jamais
   SOBREVIVENTE. */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = String(out).match(re);
  return m ? m[0] : null;
}

function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }

/* ── sonda diagnóstica do NÃO-KILL (E13) ──────────────────────────────────────
   check_mutation.py (mut_ler/mut_relata) ecoa no log do CI apenas as duas
   últimas linhas do harness e o bloco `<ESTADO>  <id> · <desc>` + `gate
   esperado: … · <nota>`; a linha crua do gate e o `baseline:` NUNCA chegam lá
   — o SOBREVIVENTE do run 33516136516 exigiu uma worktree efêmera com
   navegador só para descobrir a causa. A nota passa a levar: sha e contagem do
   `repl` no HTML construído sob mutação (a mutação chegou ao artefato que o
   navegador abriu?), a linha crua do gate, e a geometria da grade em 1280
   após a MESMA navegação do gate (toQuestion(3)). Falha da sonda vira texto
   na nota; nunca muda o veredito, nunca escreve nada (R7 §3). Só roda no
   não-KILL: o DETECTADO não precisa de diagnóstico. */
function resolveBrowser() {                       /* mesma ordem de tests_p52_chromium.js */
  const explicit = process.env.CHROME_PATH;
  const local = "/opt/google/chrome/chrome";
  if (explicit) return { executablePath: explicit };
  if (fs.existsSync(local)) return { executablePath: local };
  return {};
}
async function sondar(m, linha) {
  const partes = [];
  try {
    const html = fs.readFileSync(HTML, "utf8");
    partes.push("html(mutado) sha256=" + sha(HTML).slice(0, 16) + " · repl no artefato=" + (html.split(m.repl).length - 1) + "x");
  } catch (e) { partes.push("html(mutado): ilegível (" + String((e && e.message) || e).slice(0, 60) + ")"); }
  partes.push("linha do gate: " + (linha ? String(linha).slice(0, 160) : "(nenhuma)"));
  let browser = null;
  try {
    const { chromium } = require("playwright");
    const qids = require("./fixtures_p50.js").P50_QIDS;
    browser = await chromium.launch(Object.assign({ args: ["--no-sandbox", "--disable-dev-shm-usage"] }, resolveBrowser()));
    const pg = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pg.goto("file://" + HTML);
    await pg.evaluate(([ids, k]) => {
      window.__DEV.setArq(0); ids.forEach(id => window.__DEV.setAnswerById(id, 1)); window.__DEV.gotoStep(k);
    }, [qids, 3]);
    await pg.waitForTimeout(160);
    partes.push(await pg.evaluate(() => {
      const box = e => { if (!e) return "ausente"; const r = e.getBoundingClientRect();
        return "[" + Math.round(r.left) + "," + Math.round(r.right) + "]"; };
      const w = document.querySelector(".wrap"); const cs = getComputedStyle(w);
      return "1280: display=" + cs.display + " · grid-template-columns=" + cs.gridTemplateColumns +
        " · grid-template-areas=" + cs.gridTemplateAreas + " · #app=" + box(document.getElementById("app")) +
        " · #p50-shell=" + box(document.getElementById("p50-shell")) + " · footer=" + box(document.querySelector(".wrap > footer"));
    }));
  } catch (e) {
    partes.push("sonda 1280: falhou (" + String((e && e.message) || e).slice(0, 100) + ")");
  } finally {
    if (browser) { try { await browser.close(); } catch (e) { /* já fechado */ } }
  }
  return partes.join(" · ");
}

/* ── modo preflight (argv, D4) · contrato C1 + extensão E3 ────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d014vis",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    if (/\.css$/i.test(e.arquivo)) { e.find = m.find; e.repl = m.repl; }   /* [014/E3] */
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d014vis · " + dados.mutantes.length + " mutante(s) · interpretador " +
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
  process.exit(preflight(MUTANTS));
}

(async () => {
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, estado, causa: causa || "", nota: nota || "" });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).slice(0, 220));
    console.log("");
  };

  const fechar = () => {
    /* porcelain ESCOPADO à folha e ao artefato — a prova de R7 §3 no nível do
       harness (a da árvore inteira é do stage). Sujeira aqui derruba o exit
       mesmo com kill: restauração é parte do contrato, não cortesia. */
    let porcelain = "";
    try {
      porcelain = String(execSync(
        'git status --porcelain -- "ui_p52_workspace_v32.css" "quickscan_secops_soccmm_v3_2_dev.html"',
        { cwd: HERE, encoding: "utf8" })).trim();
    } catch (e) { porcelain = "(git indisponível: " + String(e.message || e).split("\n")[0] + ")"; }
    const cssOk = sha(CSS) === BASE_CSS_SHA;
    const htmlOk = BASE_HTML_SHA === null || sha(HTML) === BASE_HTML_SHA;
    console.log("restauração: folha byte a byte " + (cssOk ? "OK" : "FALHOU") +
      " · html " + (BASE_HTML_SHA === null ? "não construído (campanha abortou antes)" : (htmlOk ? "byte a byte OK" : "FALHOU")) +
      " · porcelain dos alvos " + (porcelain === "" ? "limpo" : "SUJO → " + porcelain.split("\n")[0]));
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_014_mutants_visual.js]: " + D + " detectados · " +
        S + " sobreviventes · " + U + " não executados (de " + MUTANTS.length + ")");
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nD014VIS MUTATION [tests_014_mutants_visual.js]: " + D + "/" + MUTANTS.length +
        " mutantes detectados pelo gate e motivo esperados");
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    process.exit(D === MUTANTS.length && cssOk && htmlOk && porcelain === "" ? 0 : 1);
  };

  /* Pré-condições resolvidas ANTES de mutar — ausência aborta com a árvore
     intacta, classificada, nunca crash sem rótulo. */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de construir e antes de mutar; nenhum arquivo tocado\n");
    for (const m of MUTANTS) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "", "");
    return fechar();
  }
  if (!temChromium()) {
    console.log("Chromium ausente (CHROME_PATH e cache ms-playwright) — campanha abortada " +
      "antes de construir e antes de mutar; nenhum arquivo tocado. Execução canônica: " +
      "job `visual` do CI (KI-3) — T081 fecha o par com o resultado de lá\n");
    for (const m of MUTANTS) emitir(m, NAO_EXECUTADO, CAUSA.gate, "ambiente sem chromium", "");
    return fechar();
  }
  const rb0 = build();
  if (rb0.code !== 0) {
    console.log("build da árvore BASE falhou (" + PY + ", " + PY_ORIGEM + ") — campanha abortada " +
      "antes de mutar; nenhum arquivo tocado\n");
    const detalhe = (rb0.erro || String(rb0.out).trim().split("\n").pop() || "").slice(0, 160);
    for (const m of MUTANTS) emitir(m, NAO_EXECUTADO, CAUSA.rebuild, "árvore base · " + detalhe, "");
    return fechar();
  }
  BASE_HTML_SHA = sha(HTML);
  console.log("D014VIS MUTATION · " + MUTANTS.length + " mutante(s) · interpretador " + PY +
    " (" + PY_ORIGEM + ") resolvido em " + binario);
  console.log("baseline: html " + BASE_HTML_SHA.slice(0, 16) + " · " +
    path.basename(CSS) + " " + BASE_CSS_SHA.slice(0, 12) + "\n");

  for (const m of MUTANTS) {
    const src = fs.readFileSync(m.file, "utf8");
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
        const r = run(CMD, ENV_GATE);
        if (r.spawnFalhou) {
          estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = String(r.erro).slice(0, 160);
        } else {
          linha = gateLine(r.out, m.gate) || "";
          if (!linha) {
            estado = NAO_EXECUTADO; causa = CAUSA.gate;
            nota = "a suíte não emitiu linha PASS/FAIL de " + m.gate +
                   " (exit " + r.code + ") · filtro P52_ONLY=" + ENV_GATE.P52_ONLY;
          } else {
            const reprovou = /^FAIL/.test(linha);
            const motivo = m.reason.test(linha);
            estado = (reprovou && motivo) ? DETECTADO : SOBREVIVENTE;
            if (!reprovou) nota = "o gate esperado NÃO reprovou — sem poder discriminante";
            else if (!motivo) nota = "reprovou por motivo DIFERENTE dos três da célula C4";
            /* a sonda lê o artefato AINDA mutado — antes do finally restaurar */
            if (estado === SOBREVIVENTE) nota += " · " + await sondar(m, linha);
          }
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      /* Restauração INCONDICIONAL: folha de volta + rebuild do artefato. O
         rebuild roda mesmo quando o passo do gate estourou — abandonar o HTML
         construído sobre folha mutada é o rastro mais caro de diagnosticar
         (o precedente é o `finally` do d009). */
      fs.writeFileSync(m.file, src, "utf8");
      const rbFim = build();
      if (rbFim.code !== 0)
        console.log("              AVISO: rebuild de restauração falhou — o fecho abaixo acusa pelo SHA");
      if (sha(m.file) !== BASE_CSS_SHA) throw new Error(m.id + ": restauração NÃO byte-idêntica de " + path.basename(m.file));
    }
    emitir(m, estado, causa, nota, linha);
  }

  fechar();
})();
