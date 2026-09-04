/* ============================================================================
   CAMPANHA DE MUTAÇÃO · DEMANDA 014 — gate sem poder discriminante
   harness `d014` · T060 (wave 6) · dono: qa-engineer
   ============================================================================
   Instrumento de MEDIÇÃO. Não tem red próprio: o aceite é 9/9 DETECTADO.

   Prova o PODER DISCRIMINANTE dos gates de `tests_014_regra_morta.js` — a
   varredura de regra morta por cascata. Os nove mutantes atacam as QUATRO
   camadas que decidem o veredito da varredura, e nenhuma outra:

     · o CLASSIFICADOR (.claude/verify/regra_morta.js + regra_morta_seletor.js):
       D014-M1 (importância), D014-M2 (especificidade), D014-M3 (contexto de
       mídia por texto), D014-M8 (indecidível engolido), D014-M9 (prefixo vácuo);
     · a ÁRVORE REAL (ui_p50_v32.css): D014-M4 — planta uma regra morta de
       verdade e exige que a varredura a acuse;
     · o BUILDER (build_v32_html.py): D014-M7 — folha nova injetada sem avisar
       a varredura não pode passar em silêncio;
     · o PRÓPRIO JULGADOR (tests_014_regra_morta.js): D014-M5/D014-M6 — alínea
       de C3 que deixa de poder falhar é pega pela bateria negativa (D014-DISC1).

   POR QUE M5/M6 MORREM EM D014-DISC1, E NÃO EM D014-EXC1 (decisão registrada):
   eles mutam o JULGADOR (`julgarExclusoes`), e um julgador enfraquecido continua
   verde sobre o registro real, que é são — não há curinga nem exclusão órfã em
   `regra_morta.json` para o julgador mutado engolir. Quem tem estado alcançável
   de falha é a BATERIA NEGATIVA de D014-DISC1, construída exatamente para isso:
   alínea que não reprova sob defeito injetado é nomeada pelo id. O critério
   medido é o C3 da spec; o carrasco executável é D014-DISC1.

   D014-M4 — A FORMA, E POR QUE NÃO É A LITERAL DA CÉLULA C2 (decisão registrada):
   a spec previa "acrescentar declaração que a p52 já sobrepõe". Medido: uma
   ADIÇÃO muda o censo pinado (E6) e mataria pelo caminho errado — C2(cen)
   acusa "a folha mudou", não "há regra morta" (e um mutante de CSS do próprio
   d014 cuja declaração introduzida nasce morta deixaria D014-VARR1
   permanentemente vermelho na árvore LIMPA, porque a varredura avalia a folha
   mutada EM MEMÓRIA a partir do preflight). A forma executável TROCA uma regra
   de 1 longhand por outra de 1 longhand — censo idêntico campo a campo,
   medido — e planta `html #ux-target .ux-tgt-row select option`, que domina
   por prefixo VÁCUO + especificidade a declaração de ui_p50_v32.css:792 que o
   mutante p51/M51-08 ataca. É a forma exata do M51-01 (o caso que originou a
   demanda) recriada ao vivo: a varredura TEM de acusar `mortas: p51/M51-08`,
   pelo veredito, não pelo censo. Kill medido antes de escrito: 1 morta, censo
   OK, 20 indecidíveis inalterados.

   D014-M7 — a adição de folha usa UMA âncora contígua (o contrato C1 tem UM
   `find`): constante + open + identificador na linha de injeção nascem juntos
   no `repl`. A folha não existe no disco de propósito: a varredura, que DERIVA
   a cobertura do builder (C5), tem de recusar ALTO (ENOENT nomeando a folha),
   nunca varrer por baixo — silêncio é o defeito que a demanda combate.

   D014-M9 — o mutante da errata E5. Sob ele TODO prefixo vira vácuo e o
   cenário (e) — vencedora prefixada por `#ux-target`, que RESTRINGE — sai
   "morta". O kill exige `1 alínea(s) reprovada(s)` + C1(e): o cenário (a)
   (prefixo `html`, vácuo de verdade) continua "morta" e continua PASSANDO —
   é a prova de que prefixar restringe e de que a vencedora prefixada NÃO mata
   o original; só a vacuidade separa os dois.

   SEM REBUILD: nenhum gate de tests_014_regra_morta.js consome o HTML
   construído — a varredura lê as folhas-FONTE e o fonte do builder (plan §c).
   Mutação in-place + suíte + restauração por SHA-256, sob try/finally. O fecho
   confere `git status --porcelain` ESCOPADO aos arquivos mutados (R7 §3).

   VOCABULÁRIO FECHADO DE TRÊS ESTADOS — DETECTADO · SOBREVIVENTE · NÃO
   EXECUTADO (este sempre com UMA causa do conjunto fechado de T4 da 013).
   Sobrevivência EXIGE gate executado: sem linha PASS/FAIL do gate esperado é
   NÃO EXECUTADO, jamais SOBREVIVENTE.

   ORÁCULO POR BLOCO, NÃO POR LINHA (desvio de forma declarado): o runner da
   suíte D014 imprime `FAIL <id> — <desc>` e as ALÍNEAS reprovadas nas linhas
   indentadas seguintes (`exigir()`). O motivo do kill mora nas alíneas; casar
   só a linha do FAIL não discrimina QUAL alínea caiu — e reprovar pela alínea
   errada é sobrevivente disfarçado. `gateBlock()` captura a linha do gate MAIS
   o seu próprio bloco indentado, e o `reason` casa contra esse bloco — nunca
   contra o stdout inteiro (R10 §6: o escopo é a emissão do gate esperado).
   Os reasons pinam também a CONTAGEM (`N alínea(s) reprovada(s)`) — o
   isolamento da alínea é asserção, não sorte.

   `--preflight` (argv) — D4 da 013, no MESMO commit da entrada `d014` em
   mutation_map.json. Contrato C1 + extensão E3 da 014: mutante cujo arquivo é
   `.css` carrega `find`/`repl`. Não muta, não reconstrói, não executa gate,
   não escreve nada; stdout é só o JSON, texto humano vai a stderr.
   Exit 0 sse interpretador resolvido e toda âncora com ocorrencias == 1.

   Filtro de depuração: D014_MUT_ONLY=D014-M4 node tests_014_mutants.js
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const HERE = __dirname;

/* Interpretador com UMA fonte (T1/C4 da 013): `MUTATION_PY` ou o padrão da
   plataforma. Aqui ele só é RESOLVIDO (contrato C1) — nada nesta campanha
   executa python, porque nada dela consome o HTML construído. */
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");

const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");

/* Resolve o binário no PATH sem lançar processo NENHUM (C1 / R7 §3).
   Equivale ao shutil.which() de check_mutation.py. */
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

const F = {
  instr: path.join(HERE, ".claude", "verify", "regra_morta.js"),
  selet: path.join(HERE, ".claude", "verify", "regra_morta_seletor.js"),
  p50css: path.join(HERE, "ui_p50_v32.css"),
  builder: path.join(HERE, "build_v32_html.py"),
  suite: path.join(HERE, "tests_014_regra_morta.js")
};

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
   OS 9 MUTANTES · D014-M1..D014-M9
   `find`/`repl` são texto literal (String.raw preserva os \n internos do
   builder como bytes, não como quebras); `reason` casa contra o BLOCO do gate
   esperado — a linha FAIL + as alíneas indentadas que ela emite.
   ========================================================================== */
const MUTANTS = [

  /* ── C1 · o classificador ─────────────────────────────────────────────── */
  { id: "D014-M1", file: F.instr, gate: "D014-CASC1",
    desc: "vence() ignora a importância — !important deixa de ser a primeira régua",
    reason: /1 alínea\(s\) reprovada\(s\):[\s\S]*· C1\(d\): [\s\S]*esperado "viva", obtido "morta"/,
    find: String.raw`  if (D.important !== O.important) return D.important ? 1 : -1;`,
    repl: String.raw`  if (false && D.important !== O.important) return D.important ? 1 : -1;   /* MUTANTE D014-M1: importância ignorada */` },

  { id: "D014-M2", file: F.instr, gate: "D014-CASC1",
    desc: "vence() decide só por ordem — a especificidade sai da cascata",
    /* Dois erros, e SÓ dois: (a) a posterior mais fraca 'vence' → viva errada;
       (c) a anterior mais forte 'perde' → morta errada. (b)/(d)/(e) seguem
       certos — a contagem pinada em 2 prova que a régua removida é uma. */
    reason: /2 alínea\(s\) reprovada\(s\):[\s\S]*· C1\(a\): [\s\S]*esperado "morta", obtido "viva"[\s\S]*· C1\(c\): [\s\S]*esperado "viva", obtido "morta"/,
    find: String.raw`  const e = S.compararEspecificidade(D.espec, O.espec);
  if (e !== 0) return e;`,
    repl: String.raw`  const e = 0;   /* MUTANTE D014-M2: especificidade ignorada — só ordem decide */
  if (e !== 0) return e;` },

  { id: "D014-M3", file: F.selet, gate: "D014-CASC1",
    desc: "contexto de mídia normalizado por TEXTO, não por valor — a conjunção ancestral vira string crua",
    /* É o defeito da errata E5: a mesma condição escrita de dois jeitos (bloco
       único × aninhada) deixa de competir e (b) sai 'indecidivel' em vez de
       'morta' — o único caso morto escaparia como não-relacionado. */
    reason: /1 alínea\(s\) reprovada\(s\):[\s\S]*· C1\(b\): [\s\S]*esperado "morta", obtido "indecidivel"/,
    find: String.raw`    c.features.forEach(f => { if (features.indexOf(f) < 0) features.push(f); });`,
    repl: String.raw`    features.push(String(texto).toLowerCase().replace(/\s+/g, " ").trim());   /* MUTANTE D014-M3: texto cru, não valor */` },

  { id: "D014-M9", file: F.selet, gate: "D014-CASC1",
    desc: "todo prefixo tratado como vácuo — prefixar deixaria de restringir (errata E5)",
    /* A contagem 1 é a prova de desenho: (e) cai (vencedora prefixada por
       `#ux-target` NÃO mata o original) e (a) — prefixo `html`, vácuo de
       verdade — continua passando. Só a vacuidade separa os dois casos reais. */
    reason: /1 alínea\(s\) reprovada\(s\):[\s\S]*· C1\(e\): [\s\S]*esperado "viva", obtido "morta"/,
    find: String.raw`function ehVacuo(composto) {
  return COMPOSTOS_VACUOS.indexOf(composto) >= 0;
}`,
    repl: String.raw`function ehVacuo(composto) {
  return true;   /* MUTANTE D014-M9: todo prefixo vira vácuo */
}` },

  /* ── C2 · a árvore real ───────────────────────────────────────────────── */
  { id: "D014-M4", file: F.p50css, gate: "D014-VARR1",
    desc: "regra morta NOVA na árvore: troca censo-neutra planta dominadora de prefixo vácuo sobre a declaração que p51/M51-08 ataca",
    /* 1 longhand → 1 longhand (margin-top → background-color), fora de @media
       como o sítio dominado (ui_p50_v32.css:792): o censo pinado fica IDÊNTICO
       e o kill tem de vir do VEREDITO — C2(zero) nomeando a morta —, nunca de
       C2(cen). Medido em 2026-09-01 com o instrumento real: censo_ok true,
       mortas = [p51/M51-08 · background-color · prefixo VÁCUO [html]],
       indecidíveis 20 (inalterados), restauração byte a byte OK. */
    reason: /1 alínea\(s\) reprovada\(s\):[\s\S]*· C2\(zero\): [\s\S]*mortas: p51\/M51-08/,
    find: String.raw`.jn-link{ margin-top:14px; }`,
    repl: String.raw`html #ux-target .ux-tgt-row select option{ background-color:var(--surface2); }` },

  /* ── C3 · o julgador das exclusões (carrasco: a bateria de D014-DISC1) ── */
  { id: "D014-M5", file: F.suite, gate: "D014-DISC1",
    desc: "julgarExclusoes aceita curinga — C3(b) perde o estado de falha (shape do IC-9.1)",
    reason: /a alínea C3\(b\) NÃO reprovou com o defeito injetado/,
    find: String.raw`  const CURINGA = /[*?]|^\s*$|^(all|todos|any)$/i;`,
    repl: String.raw`  const CURINGA = /curinga-jamais-casa^/;   /* MUTANTE D014-M5: curinga aceito */` },

  { id: "D014-M6", file: F.suite, gate: "D014-DISC1",
    desc: "julgarExclusoes deixa de conferir a existência do mutante nomeado — exclusão órfã passa a perdoar para sempre",
    reason: /a alínea C3\(c\) NÃO reprovou com o defeito injetado/,
    find: String.raw`  const orfas = (ex || []).filter(e => !popK.has(chave(e)));`,
    repl: String.raw`  const orfas = [];   /* MUTANTE D014-M6: existência não conferida */` },

  /* ── C5 · o builder ───────────────────────────────────────────────────── */
  { id: "D014-M7", file: F.builder, gate: "D014-COB1",
    desc: "folha nova injetada pelo builder sem tocar a varredura — a cobertura derivada tem de recusar ALTO, nomeando a folha",
    reason: /ui_d014_m7_fantasma\.css/,
    find: String.raw`d011css = open(D011CSS, encoding="utf-8").read()
html = html.replace("</style>", "\n/* V32_CSS_BEGIN */\n" + uicss + "\n/* V32_CSS_END */\n/* V32_UXCSS_BEGIN */\n" + uxcss + "\n/* V32_UXCSS_END */\n/* V32_P50CSS_BEGIN */\n" + p50css + "\n/* V32_P50CSS_END */\n/* V32_P52CSS_BEGIN */\n" + p52css + "\n/* V32_P52CSS_END */\n/* V32_D011CSS_BEGIN */\n" + d011css + "\n/* V32_D011CSS_END */\n</style>")`,
    repl: String.raw`D014CSS = HERE / "ui_d014_m7_fantasma.css"   # MUTANTE D014-M7: folha nova, varredura nao avisada
d014css = open(D014CSS, encoding="utf-8").read()
d011css = open(D011CSS, encoding="utf-8").read()
html = html.replace("</style>", "\n/* V32_CSS_BEGIN */\n" + uicss + "\n/* V32_CSS_END */\n/* V32_UXCSS_BEGIN */\n" + uxcss + "\n/* V32_UXCSS_END */\n/* V32_P50CSS_BEGIN */\n" + p50css + "\n/* V32_P50CSS_END */\n/* V32_P52CSS_BEGIN */\n" + p52css + "\n/* V32_P52CSS_END */\n/* V32_D011CSS_BEGIN */\n" + d011css + "\n/* V32_D011CSS_END */\n/* V32_D014CSS_BEGIN */\n" + d014css + "\n/* V32_D014CSS_END */\n</style>")` },

  /* ── C6 · o indecidível ───────────────────────────────────────────────── */
  { id: "D014-M8", file: F.instr, gate: "D014-IND1",
    desc: "o indecidível é descartado em silêncio — a dúvida nomeada vira 'viva' (oráculo: o pin SINTÉTICO da E9)",
    /* 2 alíneas, e só 2: C6(sint) — o veredito do caso (f) — e C6(cont-sint),
       o pin de veredito+razão. As da árvore (nome/cons/cont-arvore) seguem
       conservadas com lista vazia: é exatamente por isso que a E9 pinou o
       SINTÉTICO agora — sem ele este mutante sobreviveria. */
    reason: /2 alínea\(s\) reprovada\(s\):[\s\S]*· C6\(sint\): [\s\S]*esperado "indecidivel", obtido "viva"[\s\S]*· C6\(cont-sint\):/,
    find: String.raw`  if (duvida)
    return { veredito: "indecidivel", razao: duvida.razao, detalhe: duvida.detalhe };`,
    repl: String.raw`  if (false)   /* MUTANTE D014-M8: dúvida engolida */
    return { veredito: "indecidivel", razao: duvida.razao, detalhe: duvida.detalhe };` }
];

const MUTABLE = Array.from(new Set(MUTANTS.map(m => m.file)));
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });

/* ── execução de processo ─────────────────────────────────────────────────── */
/* `spawnFalhou` separa "o processo não chegou a existir" (NÃO EXECUTADO) de
   "a suíte rodou e saiu ≠ 0" (que é o estado esperado do kill). */
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }) }; }
  catch (e) {
    const saiu = typeof e.status === "number";
    return { code: saiu ? e.status : -1, out: (e.stdout || "") + (e.stderr || ""),
             erro: String(e.message || "").split("\n")[0], spawnFalhou: !saiu };
  }
}
const SUITE = "node tests_014_regra_morta.js";

/* Bloco do gate esperado: a linha PASS/FAIL + as linhas indentadas que ELA
   emite (o runner da suíte indenta o detalhe com 6 espaços). Ausência de
   linha = gate não executado → NÃO EXECUTADO, jamais SOBREVIVENTE. */
function gateBlock(out, gateId) {
  const linhas = String(out || "").split("\n");
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—");
  for (let i = 0; i < linhas.length; i++) {
    if (!re.test(linhas[i])) continue;
    const bloco = [linhas[i]];
    for (let j = i + 1; j < linhas.length && /^ {6}/.test(linhas[j]); j++) bloco.push(linhas[j]);
    return bloco.join("\n");
  }
  return null;
}

function selecionar() {
  const only = (process.env.D014_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}
/* CONTAGEM, não presença: 0 é âncora podre, >=2 é âncora ambígua. */
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }

/* ── modo preflight (argv, D4) · contrato C1 + extensão E3 ────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d014",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* O que o harness realmente muta — a razão de `.claude/verify/regra_morta*.js`
       estarem nos targets do mapa (desvio declarado que ENDURECE o trigger). */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    /* [014/E3] mutante de `.css` carrega a âncora — é dela que a varredura de
       regra morta deriva QUAL declaração a mutação altera (D014-M4 entra na
       população de D014-VARR1 e a sua declaração plantada é VIVA na árvore
       limpa — verificado antes do commit; morta ela deixaria o gate vermelho
       para sempre). */
    if (/\.css$/i.test(e.arquivo)) { e.find = m.find; e.repl = m.repl; }
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d014 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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

(() => {
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, estado, causa: causa || "", nota: nota || "" });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).replace(/\n/g, " ⏎ ").slice(0, 220));
    console.log("");
  };

  /* Número que não foi medido NÃO é impresso: havendo não executado, a
     contagem de detectados some do fecho e o exit é != 0 (R10 §2). */
  const fechar = () => {
    /* Restauração conferida também pelo porcelain ESCOPADO aos arquivos que a
       campanha muta — a prova de R7 §3 no nível do harness; a da árvore
       inteira é do stage `mutation` (check_mutation.py). */
    let porcelain = "";
    try {
      porcelain = String(execSync(
        "git status --porcelain -- " + MUTABLE.map(f => '"' + path.relative(HERE, f).replace(/\\/g, "/") + '"').join(" "),
        { cwd: HERE, encoding: "utf8" })).trim();
    } catch (e) { porcelain = "(git indisponível: " + String(e.message || e).split("\n")[0] + ")"; }
    console.log("restauração: source byte a byte " +
      (MUTABLE.every(f => sha(f) === BASE_SHA[f]) ? "OK" : "FALHOU") +
      " · porcelain dos alvos " + (porcelain === "" ? "limpo" : "SUJO → " + porcelain.split("\n")[0]));
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_014_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U +
        " não executados (de " + SELECTED.length + ")");
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nD014 MUTATION [tests_014_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados");
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    process.exit(D === SELECTED.length && porcelain === "" ? 0 : 1);
  };

  /* Interpretador ausente é CLASSIFICADO, não crash sem rótulo: aborta antes
     de mutar — nenhum arquivo tocado. (Nada aqui o executa; é o contrato C4
     de coerência entre o que o stage declara e o que a campanha exige.) */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de mutar; nenhum arquivo tocado\n");
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "", "");
    return fechar();
  }
  console.log("D014 MUTATION · " + SELECTED.length + " mutante(s) · interpretador " + PY +
    " (" + PY_ORIGEM + ") resolvido em " + binario);
  console.log("baseline: " + MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · ") + "\n");
  if (ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + ONLY.join(", ") + "\n");

  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    const n = src.split(m.find).length - 1;
    if (n !== 1) {
      emitir(m, NAO_EXECUTADO, (n === 0 ? CAUSA.ausente : CAUSA.ambigua + " (n=" + n + ")"),
        "ocorrencias=" + n + " em " + path.basename(m.file), "");
      continue;
    }
    let estado = "", causa = "", nota = "", bloco = "";
    try {
      fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
      const r = run(SUITE);
      if (r.spawnFalhou) {
        estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = String(r.erro).slice(0, 160);
      } else {
        bloco = gateBlock(r.out, m.gate) || "";
        if (!bloco) {
          estado = NAO_EXECUTADO; causa = CAUSA.gate;
          nota = "a suíte não emitiu linha PASS/FAIL de " + m.gate + " (exit " + r.code + ")";
        } else {
          const reprovou = /^FAIL/.test(bloco);
          const motivo = m.reason.test(bloco);
          estado = (reprovou && motivo) ? DETECTADO : SOBREVIVENTE;
          if (!reprovou) nota = "o gate esperado NÃO reprovou — sem poder discriminante";
          else if (!motivo) nota = "reprovou por motivo/alínea DIFERENTE do esperado";
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      fs.writeFileSync(m.file, src, "utf8");
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica de " + path.basename(m.file));
    }
    emitir(m, estado, causa, nota, bloco);
  }

  fechar();
})();
