/* ============================================================================
   CAMPANHA DE MUTAÇÃO D026 — demanda 026-decisao-unica-do-apoio
   Alvo: os 3 gates de `tests_026_contrato.js` (D026-REC1 · D026-PAP1 ·
   D026-LEG1, alíneas nomeadas). Seis mutantes, ids permanentes D026-M1…M6
   (spec §Critérios, coluna *Mutante previsto*; tasks.md §Estado do mundo — uma
   linha por mutante: fixture → alínea reprovada; anexos/desenho-sintese.md §7).

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · TODO gate esperado reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e algum gate não a pegou, ou pegou
                        por motivo diferente (nomeado)
       NÃO EXECUTADO  · SEMPRE com causa declarada (conjunto fechado da 013)

   ==========================================================================
   POR QUE ESTE HARNESS NASCE DEPOIS DO GREEN (plan §Quando o harness nasce)
   ==========================================================================
   As âncoras (`find`) são TEXTO do código que a demanda criou em
   `ui_curation_v32.js` (W2: `temVoz`, `chaveDe`, a fusão por chave,
   `veredictoDeServico`) e em `ui_p52_support_v32.js` (W3a: `declararVetos`,
   o qualificador no `papelHTML`). No red nenhuma delas existia: um harness
   escrito então teria 6 de 6 âncoras `nao_executavel`. O que viajou no red
   (red-026.md) e nos prompts foi a tabela estado-do-mundo (tasks.md): uma
   linha por mutante dizendo que estado reprova que gate. Aqui cada linha vira
   código, e a campanha prova que as alíneas que NASCERAM VERDES sem os
   atributos novos — `REC1 (h)` (poder em M3), `LEG1 (b)` (poder em M6) — têm
   poder discriminante, e que os dois mutantes "só cópia" (M4, M6: o produto
   de hoje nunca foi esse estado) morrem pelo motivo nominal.

   ==========================================================================
   O QUE CADA MUTANTE ATACA, E O QUE O DERRUBA (tasks.md §Estado do mundo)
   ==========================================================================
   M1  ui_curation_v32.js · `temVoz` devolve false sempre — todo `ctx` é tratado
       como sem voz; as linhas de PRODUTO voltam à hipótese do MAP (C1/C6: `h4`
       = linha, sem `item-id`; C2/C4: cards reaparecem, zero veto). O veredito
       de SERVIÇO não lê `temVoz`: em C7 o veto do MDR e o card SOCaaS
       permanecem — por isso M1 NÃO derruba `REC1 (d)` (crítica aplicada na
       tasks.md), e a alínea que cai primeiro é (a), C1. Gate: D026-REC1.
   M2  ui_p52_support_v32.js · `papelHTML` deixa de emitir `.p53-pr-tier` (SÓ no
       papel, padrão D019-M4; a tela fica intacta — é assim que as duas
       superfícies divergem, EA-58). C5: 0/9 `pr-card` com qualificador.
       Gate: D026-PAP1 (a). DIVERGÊNCIA DECLARADA frente à spec ("omite
       `data-p53-sol-tier`/`.p53-pr-tier`"): o atributo e a linha nascem em
       dois pontos do fonte (ATTRS_DO_PAPEL e o `h +=` do tier) e um mutante
       tem UMA âncora contígua; a alínea (a) exige os DOIS no `pr-card`
       (`attr && .p53-pr-tier`), então omitir só a linha já a reprova.
   M3  ui_curation_v32.js · `chaveDe` pareia SÓ por nome exato — a regra 1
       devolve sem cair nas regras 2 (cadeia `variantOf`) e 3 (representante
       único da família). `fortiedr`/`fortindr-onprem`/`fortisiem-cloud`/
       `endpoint-family` ficam sem chave. C1: (a) cai; LEG1 (g) `exclude` da
       linha não retira o card; (h) `published()` ⊉ tela. Gates: D026-REC1 e
       D026-LEG1 — os DOIS têm de reprovar. (Carrasco em suíte alheia, declarado
       e NÃO executado aqui: `D023-REG1 (c)` pelo placeholder — roda na d023.)
   M4  ui_p52_support_v32.js · `declararVetos` escreve `data-p53-suprimido` /
       `.p53-sol-suprimido` em vez de `data-p53-vetos` / `.p53-sol-vetos`. C2/C4/
       C7/C3b: `[data-p53-vetos]` ausente — REC1 (b); `[data-p53-suprimido]`
       presente SEM curadoria — LEG1 (e); papel sem `.p53-pr-vetos` — PAP1.
       Gates: D026-REC1, D026-PAP1, D026-LEG1 — os TRÊS têm de reprovar.
       Conferido na tasks.md: `D025-AUS1 (b)` NÃO é carrasco (as fixtures da
       025 não têm veto); o desenho §7 o listava — corrigido lá, não aqui.
   M5  ui_curation_v32.js · fusão sem a precedência veto > hipótese: uma chave
       com `vetos.length > 0` e sem fonte do motor passa a publicar as
       hipóteses do MAP. Gate: D026-REC1 — alínea ESPERADA (j), fixture C4-DL
       (W4b): card "FortiSIEM · indicação prioritária" nasce da hipótese de
       `detection-lifecycle` apesar do veto de `logs`/security-analytics.
       PRIMEIRA EXECUÇÃO (2026-10-31, HEAD ab666e2): SOBREVIVENTE — e a
       sobrevivência acusa o GATE, não o código. A spec e a tasks.md previam
       que em C7 o card "FortiGuard MDR" nasceria da hipótese de
       `team-capacity`; MEDIDO que não: `veredictoDeServico` veta por
       inelegibilidade em TODA linha da chave (o veto do MDR lista as duas
       capabilities), `hipoteses[]` nasce vazio e a linha :404 não tem
       sujeito — (f) em C7 é garantida pelo veto POR LINHA. O estado que esta
       mutação distingue EXISTE (C4 + `detection-lifecycle` em gap: FortiSIEM
       com hipótese por detection-engineering CNI e veto por
       security-analytics; HEAD derruba o card, M5 publica-o ao lado do
       veto), mas nenhuma fixture da suíte o exercitava. O mutante ficou como
       estava (R10 §1); o remédio foi a alínea (j) + fixture C4-DL no gate
       (W4b, mesma data) — nada afrouxado, uma asserção a mais.
       Trilha completa em mutation_map.json → harnesses.d026._trilha.
   M6  ui_curation_v32.js · `veredictoDeServico` sem a exceção D-6: "base
       requerida ausente" vira veto também com `presence ∈ {UNSET, UNKNOWN}`.
       C7-UNSET: MDR vetado em vez de hipótese `capability-nao-informada` —
       LEG1 (b) (INV-2: não informado ≠ ausente). Gate: D026-LEG1.

   `reason` é NOMINAL por gate (`/FAIL {2}D026-REC1\b/` …), nunca `/N FAIL/`
   (a regex de contagem do `core` produziu o falso SOBREVIVENTE de CM1 na 025).
   Detectar pelo motivo errado é coincidência. A ALÍNEA que cai é RELATO
   (primeira linha `FAIL` da suíte, gravada por D026_MUT_LOG), não oráculo.

   ==========================================================================
   O QUE O RUNNER GARANTE (padrão `tests_025_mutants.js`)
   ==========================================================================
   · mutação do fonte, rebuild em arquivo EFÊMERO (`os.tmpdir`), gate apontado
     para ele por `D026_HTML_OVERRIDE`; o gate lê o HTML CONSTRUÍDO, não o
     módulo-fonte — sem reconstruir, TODO mutante sairia SOBREVIVENTE pelo
     motivo errado; restauração do fonte conferida BYTE A BYTE em `finally`
     (R7 §3, R10 §8);
   · `D026_ONLY=<gate>` acelera cada execução a UM gate, mas o veredito
     DETECTADO exige TODOS os gates esperados reprovando pelo motivo nominal
     (uma execução por gate esperado);
   · `--preflight` (contrato C1 da 013, no MESMO commit da chave do mapa — D4):
     UM objeto JSON em stdout, `ocorrencias == 1` por âncora, nada mutado;
   · caminhos por `execFileSync` com argv separado (R10 §7); nenhum hash
     inline (R10 §4); nenhuma regex de contagem como oráculo (R10 §6).
   Interpretador: `D026_PYTHON`, senão `MUTATION_PY`, senão `python` no PATH —
   resolvido e declarado no preflight; ausente é NÃO EXECUTADO nomeado.
   `D026_MUT_LOG=<arquivo fora da árvore>` grava, por mutante, a primeira linha
   `FAIL` de cada execução (insumo do registro da matriz) — opcional, nunca na
   árvore.
   ========================================================================== */

const path = require("path"), fs = require("fs"), os = require("os");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

const F = {
  estado: P("ui_curation_v32.js"),      /* o registro único da oferta (owner) */
  tela:   P("ui_p52_support_v32.js")    /* tela e papel — leitores do registro */
};
const SUITE = "tests_026_contrato.js";
const d026 = gate => ({ suite: SUITE, gate, reason: new RegExp("FAIL {2}" + gate + "\\b") });

const MUTANTS = [
  { id: "D026-M1", file: F.estado, suites: [d026("D026-REC1")],
    desc: "temVoz devolve false sempre — todo ctx tratado como sem voz do motor; produto volta à hipótese do MAP (C1/C2/C4/C6)",
    find: "    return ((ctx.candidates || []).length + (ctx.services || []).length + (ctx.notes || []).length) > 0;",
    repl: "    return false;   /* MUTANTE D026-M1: temVoz ignorado — todo ctx como CONTEXT_NOT_INFORMED */" },

  { id: "D026-M2", file: F.tela, suites: [d026("D026-PAP1")],
    desc: "papelHTML deixa de emitir .p53-pr-tier — o qualificador some SÓ no papel (QS-02; padrão D019-M4)",
    find: "        h += '<div class=\"pr-mut p53-pr-tier\">' + escHtml(txt(tierLabel)) + \"</div>\";",
    repl: "        h += \"\";   /* MUTANTE D026-M2: o papel perde o qualificador */" },

  { id: "D026-M3", file: F.estado, suites: [d026("D026-REC1"), d026("D026-LEG1")],
    desc: "chaveDe pareia só por nome exato — regras 2 (variantOf) e 3 (representante único) nunca alcançadas; fortiedr vira chave própria",
    find: "        k = regra1(o.name); if (k) return k;                                   /* 1 · nome exato */",
    repl: "        return regra1(o.name);   /* MUTANTE D026-M3: só a regra 1 — regras 2–3 nunca alcançadas */" },

  { id: "D026-M4", file: F.tela, suites: [d026("D026-REC1"), d026("D026-PAP1"), d026("D026-LEG1")],
    desc: "declararVetos escreve data-p53-suprimido/.p53-sol-suprimido em vez de data-p53-vetos/.p53-sol-vetos — veto vira supressão sem curadoria",
    find: "    var bloco = el(\"div\", { \"class\": \"p53-sol-vetos\", \"data-p53-vetos\": String(ordem.length), role: \"note\" });",
    repl: "    var bloco = el(\"div\", { \"class\": \"p53-sol-suprimido\", \"data-p53-suprimido\": String(ordem.length), role: \"note\" });   /* MUTANTE D026-M4 */" },

  /* [W4b] alínea esperada: D026-REC1 (j), fixture C4-DL — `reason` segue nominal
     por gate; a alínea é RELATO (primeira linha FAIL, gravada em D026_MUT_LOG). */
  { id: "D026-M5", file: F.estado, suites: [d026("D026-REC1")],
    desc: "fusão sem a precedência veto > hipótese — chave vetada sem fonte do motor publica a hipótese do MAP (C4-DL: FortiSIEM via detection-lifecycle apesar do veto de logs — REC1 (j))",
    find: "      } else if (!e.vetos.length && e.hipoteses.length) registros.push(registroDe(e, \"hipotese\", e.hipoteses));",
    repl: "      } else if (e.hipoteses.length) registros.push(registroDe(e, \"hipotese\", e.hipoteses));   /* MUTANTE D026-M5: veto não derruba hipótese */" },

  { id: "D026-M6", file: F.estado, suites: [d026("D026-LEG1")],
    desc: "veredictoDeServico sem a exceção D-6 — 'base requerida ausente' vira veto também sob presence UNSET/UNKNOWN (C7-UNSET: MDR vetado)",
    find: "        if (!el.eligible && /^base requerida ausente/.test(r) && (base === \"UNSET\" || base === \"UNKNOWN\")) { hip = true; return; }",
    repl: "        /* MUTANTE D026-M6: exceção D-6 removida — não informado tratado como ausente */" }
];

/* ==========================================================================
   Runner.
   ========================================================================== */
function existe(f) { try { return fs.statSync(f).isFile(); } catch (e) { return false; } }
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }
function runsDe(m) { return m.suites; }
function gatesDe(m) { return runsDe(m).map(r => r.gate).join("/"); }

function SaltoControlado() {}
SaltoControlado.prototype = Object.create(Error.prototype);

const PY = process.env.D026_PYTHON || process.env.MUTATION_PY || "python";
const PY_ORIGEM = process.env.D026_PYTHON ? "D026_PYTHON" : (process.env.MUTATION_PY ? "MUTATION_PY" : "padrão");

function construir(destino) {
  try {
    execFileSync(PY, [path.join(HERE, "build_v32_html.py"), destino], { cwd: HERE, encoding: "utf8", stdio: "pipe" });
    return fs.existsSync(destino) ? { ok: true } : { ok: false, why: "builder não produziu " + destino };
  } catch (e) {
    return { ok: false, why: (e.message || "").split("\n")[0] };
  }
}

/* uma execução da suíte: filtrada por D026_ONLY (gate nominal) e apontada para
   o HTML efêmero por D026_HTML_OVERRIDE; D026_DIAG é removido do ambiente para
   que a primeira alínea que cai encerre o gate (relato fiel ao modo canônico) */
function rodar(run, htmlPath) {
  const args = [path.join(HERE, run.suite)];
  const env = Object.assign({}, process.env);
  delete env.D026_ONLY; delete env.D026_HTML_OVERRIDE; delete env.D026_DIAG;
  env.D026_ONLY = run.gate;
  if (htmlPath) env.D026_HTML_OVERRIDE = htmlPath;
  const t0 = Date.now();
  let saiu, out;
  try {
    out = execFileSync(process.argv[0], args, { cwd: HERE, encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
    saiu = 0;
  } catch (e) {
    saiu = e.status == null ? -1 : e.status; out = (e.stdout || "") + (e.stderr || "");
  }
  const falha = (out.split("\n").find(l => /^FAIL {2}/.test(l)) || "").slice(0, 400);
  return { saiu, out, falha, segundos: Math.round((Date.now() - t0) / 100) / 10 };
}

/* ==========================================================================
   `--preflight` — contrato C1 (013): UM objeto JSON em stdout; texto humano em
   stderr; nada mutado, nada construído, nenhum gate executado.
   ========================================================================== */
function resolvePy(nome) {
  if (nome.indexOf("/") >= 0 || nome.indexOf(path.sep) >= 0) {
    try { return fs.statSync(nome).isFile() ? path.resolve(nome) : null; } catch (e) { return null; }
  }
  const exts = process.platform === "win32"
    ? [""].concat((process.env.PATHEXT || ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean))
    : [""];
  for (const dir of String(process.env.PATH || "").split(path.delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const cand = path.join(dir.replace(/^"|"$/g, ""), nome + ext);
      try { if (fs.statSync(cand).isFile()) return cand; } catch (e) { /* próximo */ }
    }
  }
  return null;
}
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente: "âncora não encontrada",
  ambigua: "âncora ambígua",
  rebuild: "rebuild falhou",
  gate: "gate não pôde ser executado"
};
function preflight() {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d026",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of MUTANTS) {
    const n = existe(m.file) ? ocorrencias(m) : 0;
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n, estado: n === 1 ? "ok" : "nao_executavel",
                gates: gatesDe(m), suites: runsDe(m).map(r => r.suite) };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");
  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d026 · " + dados.mutantes.length + " mutante(s) · interpretador " + PY + " (" + PY_ORIGEM + "): " +
    (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
  for (const m of dados.mutantes) {
    process.stderr.write("  " + (m.estado === "ok" ? "ok            " : "nao_executavel") + " " + m.id +
      " · ocorrencias=" + m.ocorrencias + " em " + m.arquivo + " · " + m.gates + (m.causa ? " · " + m.causa : "") + "\n");
  }
  process.stderr.write(podres.length
    ? podres.length + " âncora(s) fora de ocorrencias == 1: " + podres.map(m => m.id).join(", ") + "\n"
    : "todas as âncoras com ocorrencias == 1\n");
  if (!binario) process.stderr.write(CAUSA.interpretador + ": " + PY + "\n");
  return (binario && podres.length === 0) ? 0 : 1;
}
if (process.argv.slice(2).indexOf("--preflight") >= 0) process.exit(preflight());

/* ============================== campanha ============================== */
const LOG = process.env.D026_MUT_LOG || null;
if (LOG) fs.writeFileSync(LOG, "");
const linhas = [];
const t0 = Date.now();
let execucoes = 0;
if (!resolvePy(PY)) {
  MUTANTS.forEach(m => linhas.push({ id: m.id, estado: NAO_EXECUTADO, causa: CAUSA.interpretador + ": " + PY }));
} else for (const m of MUTANTS) {
  if (!existe(m.file)) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO, causa: CAUSA.ausente + " (" + path.basename(m.file) + " inexistente)" });
    continue;
  }
  const n = ocorrencias(m);
  if (n !== 1) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO, causa: (n === 0 ? CAUSA.ausente : CAUSA.ambigua) + ": ocorrencias=" + n + " em " + path.basename(m.file) });
    continue;
  }
  const original = fs.readFileSync(m.file);
  const texto = original.toString("utf8");
  let estado, causa = "", efemero = null;
  const detalhes = [];
  try {
    fs.writeFileSync(m.file, texto.split(m.find).join(m.repl), { encoding: "utf8" });
    efemero = path.join(os.tmpdir(), "d026-" + m.id + ".html");
    const build = construir(efemero);
    if (!build.ok) { estado = NAO_EXECUTADO; causa = CAUSA.rebuild + ": " + build.why; throw new SaltoControlado(); }
    for (const run of runsDe(m)) {
      execucoes++;
      const r = rodar(run, efemero);
      detalhes.push({ suite: run.suite, gate: run.gate, exit: r.saiu, falha: r.falha, segundos: r.segundos });
      if (r.saiu === 0) { estado = SOBREVIVENTE; causa = "o gate " + run.gate + " (" + run.suite + ") ficou verde sob mutação"; break; }
      if (!run.reason.test(r.out)) { estado = SOBREVIVENTE; causa = run.suite + " reprovou por motivo diferente do esperado (" + run.gate + "): " + (r.falha || "sem linha FAIL"); break; }
    }
    if (!estado) estado = DETECTADO;
  } catch (e) {
    if (!(e instanceof SaltoControlado)) { estado = NAO_EXECUTADO; causa = CAUSA.gate + ": " + (e.message || String(e)).split("\n")[0]; }
  } finally {
    fs.writeFileSync(m.file, original);
    if (Buffer.compare(fs.readFileSync(m.file), original) !== 0)
      throw new Error("RESTAURAÇÃO FALHOU em " + m.file + " — árvore alterada pela verificação (R7 §3)");
    if (efemero) { try { fs.unlinkSync(efemero); } catch (e) { /* efêmero */ } }
  }
  linhas.push({ id: m.id, estado, causa, detalhes });
  if (LOG) fs.appendFileSync(LOG, JSON.stringify({ id: m.id, estado, causa, gates: gatesDe(m), detalhes }) + "\n");
}

/* ============================== resumo ============================== */
linhas.forEach(l => {
  const m = MUTANTS.find(x => x.id === l.id) || {};
  console.log(l.estado + "  " + l.id + " · " + m.desc + (l.causa ? " [" + l.causa + "]" : ""));
  console.log("              gate esperado: " + gatesDe(m) + (l.causa ? " · causa: " + l.causa : "") +
    (l.detalhes && l.detalhes.length ? " · " + l.detalhes.map(d => d.gate + " exit " + d.exit + " em " + d.segundos + " s").join(", ") : ""));
});
const det = linhas.filter(l => l.estado === DETECTADO).length;
const sob = linhas.filter(l => l.estado === SOBREVIVENTE).length;
const nex = linhas.filter(l => l.estado === NAO_EXECUTADO).length;
console.log("\nrestauração: source byte a byte OK · tempo total " + Math.round((Date.now() - t0) / 1000) + " s · execuções da suíte: " + execucoes);
console.log("D026 MUTATION [tests_026_mutants.js]: " + det + " DETECTADO · " + sob + " SOBREVIVENTE · " + nex + " NÃO EXECUTADO de " + linhas.length);
process.exit((sob || nex) ? 1 : 0);
