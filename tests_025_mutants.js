/* ============================================================================
   CAMPANHA DE MUTAÇÃO D025 — demanda 025-curadoria-transacional
   Alvo: os 16 gates de `tests_025_curadoria_sessao.js` e as quatro reancoragens
   de `tests_session_m48.js` (S50, S69(b), S30(b), S31-S32). 23 mutantes,
   ids permanentes D025-M1…M23 (spec §Critérios, coluna *Mutante previsto*;
   §Reancoragens, coluna *Carrasco*; tasks.md §Estado do mundo).

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · TODO gate esperado reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e algum gate não a pegou, ou pegou
                        por motivo diferente (nomeado)
       NÃO EXECUTADO  · SEMPRE com causa declarada (conjunto fechado da 013)

   ==========================================================================
   POR QUE ESTE HARNESS NASCE DEPOIS DO GREEN (plan §Quando o harness nasce)
   ==========================================================================
   As âncoras (`find`) são TEXTO do código que a demanda criou — a chamada a
   `validate` no validador, a 11ª chave do candidato, a guarda removida do
   restore, o texto novo do diálogo. Um harness no red teria 22 de 23 âncoras
   `nao_executavel`. O que viajou no red e nos prompts foi a tabela estado-do-
   -mundo (tasks.md): uma linha por mutante dizendo que estado reprova que gate.
   Aqui cada linha vira código, e a campanha prova que os gates que nasceram
   VERDES (GAT1 ← M19; S69(b) ← M6) e os que nasceram vermelhos por OUTRO
   estado (AUS1 ← M5, TRX2(b′) ← M22, TRN2 ← M15) têm poder discriminante.

   ==========================================================================
   QUATRO MUTANTES SÃO JULGADOS POR DUAS SUÍTES, e isso é o ponto
   ==========================================================================
   M6, M11, M12 e M16 atacam propriedades que a demanda mede em DOIS lugares:
   um gate da suíte d025 e uma alínea reancorada da m48 (S69(b), S31-S32,
   S30(b)). O runner executa AMBAS contra o HTML mutado — a m48 lendo-o por
   `M48_HTML_OVERRIDE` — e só conta DETECTADO quando as duas reprovam pelo
   motivo nominal. Provar a reancoragem uma vez num relatório e nunca mais
   (família EA-28) é exatamente o que se evita aqui. M20 ataca o PRÓPRIO
   julgador (ressuscita a lista de 10 chaves em S50) e roda só a m48, sem
   rebuild; M21 muta uma CÓPIA de `SESSION_SCHEMA_V32.md` em tmp e aponta a
   suíte por `D025_DOC_OVERRIDE` — o doc rastreado nunca é escrito (R7 §3).

   `reason` é NOMINAL por gate (`/FAIL {2}D025-VAL1/`, `/FAIL {2}S50/`…),
   nunca `/N FAIL/`: foi a regex de contagem do `core` (`/1 FAIL/`) que
   produziu o falso SOBREVIVENTE de CM1 na janela entre a W3 e a W4
   (plan, nota aditiva (c)). Detectar pelo motivo errado é coincidência.

   ==========================================================================
   O QUE O RUNNER GARANTE (padrão `tests_019_mutants.js:272-440`)
   ==========================================================================
   · mutação do fonte, rebuild em arquivo EFÊMERO (`os.tmpdir`), gate apontado
     para ele por `D025_HTML_OVERRIDE`/`M48_HTML_OVERRIDE`; restauração do
     fonte conferida BYTE A BYTE em `finally` (R7 §3, R10 §8);
   · `--preflight` (contrato C1 da 013, no MESMO commit da chave do mapa — D4):
     UM objeto JSON em stdout, `ocorrencias == 1` por âncora, nada mutado;
   · caminhos por `execFileSync` com argv separado (R10 §7); nenhum hash
     inline (R10 §4); nenhuma regex de contagem como oráculo (R10 §6).
   Interpretador: `D025_PYTHON`, senão `MUTATION_PY`, senão `python` no PATH —
   resolvido e declarado no preflight; ausente é NÃO EXECUTADO nomeado.
   `D025_MUT_LOG=<arquivo fora da árvore>` grava, por mutante, a primeira linha
   `FAIL` de cada suíte (insumo do registro da matriz) — opcional, nunca na árvore.
   ========================================================================== */

const path = require("path"), fs = require("fs"), os = require("os");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

const F = {
  sessao:  P("ui_session_v32.js"),
  estado:  P("ui_curation_v32.js"),
  ux:      P("ui_ux_v32.js"),
  editor:  P("ui_curation_edit_v32.js"),
  ui:      P("ui_v32.js"),
  m48:     P("tests_session_m48.js"),
  schema:  P("SESSION_SCHEMA_V32.md")
};
const SUITE_D025 = "tests_025_curadoria_sessao.js", SUITE_M48 = "tests_session_m48.js";
const HEAP_M48 = ["--max-old-space-size=6144"];   /* = scripts["test:session"] do package.json */
const m48 = gate => ({ suite: SUITE_M48, gate, reason: new RegExp("FAIL {2}" + gate.replace(/[-]/g, "\\-") + "\\b"), nodeArgs: HEAP_M48 });
const d025 = gate => ({ suite: SUITE_D025, gate, reason: new RegExp("FAIL {2}" + gate + "\\b") });

/* bloco do commit entre o snapshot e a escrita da curadoria — âncora de M7/M8
   (texto contíguo e único de ui_session_v32.js; qualquer edição ali é
   reancoragem declarada, nunca "confere depois") */
const COMMIT_ATE_CURADORIA =
`  const snap = snapshotCanonicalOwners();
  try {
    arq = cand.arq;
    for (let k = 0; k < QS.length; k++){ ans[k] = cand.ans[k]; notes[k] = cand.notes[k]; }
    businessPriority.clear(); cand.priorities.forEach(id => businessPriority.add(id));
    Object.keys(V32.TECH_LANDSCAPE).forEach(id => { delete V32.TECH_LANDSCAPE[id]; });
    Object.keys(cand.landscape).forEach(id => { V32.TECH_LANDSCAPE[id] = cand.landscape[id]; });
    Object.keys(cand.arch).forEach(k => { V32.ARCHITECTURE_CONTEXT[k] = cand.arch[k]; });
    V32.PLATFORM_CONTEXT.declaredPlatforms = cand.platforms;
    Object.keys(cand.signals).forEach(k => { V32.SESSION_SIGNALS[k] = cand.signals[k]; });
    Object.keys(TARGET_PROFILE.overrides).forEach(k => { delete TARGET_PROFILE.overrides[k]; });
    Object.keys(cand.targetOverrides).forEach(k => { TARGET_PROFILE.overrides[k] = cand.targetOverrides[k]; });
    Object.keys(cand.refinement).forEach(k => { OPERATIONAL_REFINEMENT.answers[k] = cand.refinement[k]; });
    if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);   /* [025 · T030] 11º owner, dentro da transação */`;
const CORPO_OWNERS = COMMIT_ATE_CURADORIA.split("\n").slice(2, -1).join("\n");   /* as escritas dos dez owners, intactas */
const LINHA_CLEAR_UX = '  if (window.__CURATION) window.__CURATION.clear(); if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();   /* [025 · T040] */';
const LINHA_SEM_CLEAR = '  if (window.__V32UI && typeof window.__V32UI.discardDraft === "function") window.__V32UI.discardDraft();';

const MUTANTS = [
  { id: "D025-M1", file: F.sessao, ...d025("D025-VAL1"),
    desc: "reintroduzir fromSession no validador — validar volta a APLICAR (o produto antes da 025, `:240`)",
    find: "const errosCur = window.__CURATION.validate(I.reportCuration);",
    repl: "const errosCur = window.__CURATION.fromSession(I.reportCuration);   /* MUTANTE D025-M1 */" },

  { id: "D025-M2", file: F.estado, ...d025("D025-VAL2"),
    desc: "fromSession zera o estado ANTES de validar — curadoria inválida apaga a seleção (sub-caso E do EA-91)",
    find: "    var erros = validar(obj);\n    if (erros.length) return erros;",
    repl: "    estado = { decisions: {}, architectureNote: undefined };   /* MUTANTE D025-M2: zera antes de validar */\n    var erros = validar(obj);\n    if (erros.length) return erros;" },

  { id: "D025-M3", file: F.estado, ...d025("D025-CAN1"),
    desc: "validate aceita null / {} / {decisions:{}} como 'vazio' — a direção inversa de P1",
    find: "    if (obj === undefined) return [];",
    repl: "    if (obj === undefined || obj === null || (typeof obj === \"object\" && !Array.isArray(obj) && obj.architectureNote === undefined && (obj.decisions === undefined || (typeof obj.decisions === \"object\" && obj.decisions !== null && !Object.keys(obj.decisions).length)))) return [];   /* MUTANTE D025-M3 */" },

  { id: "D025-M23", file: F.estado, ...d025("D025-CAN1"),
    desc: "validate ignora chave desconhecida dentro de reportCuration (o produto antes da 025: daSessao lia só duas chaves)",
    find: 'if (extra.length) erros.push("reportCuration: campos não reconhecidos: " + extra.join(", "));',
    repl: 'if (false) erros.push("reportCuration: campos não reconhecidos: " + extra.join(", "));   /* MUTANTE D025-M23 */' },

  { id: "D025-M4", file: F.sessao, ...d025("D025-TRX1"),
    desc: "a curadoria fora do candidato — a lista volta a ter 10 chaves e o commit recebe `undefined` sempre",
    find: "  cand.curadoria = (I.reportCuration === undefined) ? undefined : JSON.parse(JSON.stringify(I.reportCuration));",
    repl: "  delete cand.curadoria;   /* MUTANTE D025-M4: candidato de 10 chaves */" },

  { id: "D025-M5", file: F.estado, ...d025("D025-AUS1"),
    desc: "mutC: fromSession(undefined) devolve [] SEM aplicar — a ausência deixa de substituir (herança)",
    find: "    if (obj === undefined) { estado = { decisions: {}, architectureNote: undefined }; return []; }",
    repl: "    if (obj === undefined) { return []; }   /* MUTANTE D025-M5: ausência não limpa */" },

  /* M6 é julgado pela d025 (TRX2 (b)) E pela m48 (S69 (b)): a reancoragem só
     tem valor se o mutante morre CONTRA O HTML MUTADO na própria campanha. */
  { id: "D025-M6", file: F.sessao, suites: [d025("D025-TRX2"), m48("S69")],
    desc: "mutB: o restore deixa de devolver a curadoria — rollback restaura dez owners e esquece o 11º",
    find: "    window.__CURATION.fromSession(snap.curadoria);",
    repl: "    void snap.curadoria;   /* MUTANTE D025-M6: restore sem fromSession */" },

  { id: "D025-M7", file: F.sessao, ...d025("D025-TRX2"),
    desc: "snapshot tirado DEPOIS da escrita da curadoria — a primeira escrita precede a leitura toSession e o rollback não tem foto",
    find: COMMIT_ATE_CURADORIA,
    repl: "  let snap = null;   /* MUTANTE D025-M7: snapshot depois da escrita */\n  try {\n" + CORPO_OWNERS +
          "\n    if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);\n    snap = snapshotCanonicalOwners();" },

  { id: "D025-M8", file: F.sessao, ...d025("D025-TRX2"),
    desc: "fromSession(cand.curadoria) FORA do try, antes do snapshot — a curadoria é aplicada fora da transação",
    find: COMMIT_ATE_CURADORIA,
    repl: "  if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);   /* MUTANTE D025-M8: fora da transação */\n" +
          "  const snap = snapshotCanonicalOwners();\n  try {\n" + CORPO_OWNERS },

  { id: "D025-M22", file: F.sessao, ...d025("D025-TRX2"),
    desc: "reintroduzir a guarda `&& snap.curadoria` no restore — a foto 'nada declarado' deixa de ser restaurada (ERR-1)",
    find: '  if (typeof window !== "undefined" && window.__CURATION)\n    window.__CURATION.fromSession(snap.curadoria);',
    repl: '  if (typeof window !== "undefined" && window.__CURATION && snap.curadoria)   /* MUTANTE D025-M22 */\n    window.__CURATION.fromSession(snap.curadoria);' },

  { id: "D025-M9", file: F.estado, ...d025("D025-INV8"),
    desc: "mutD: fromSession sem o reset — merge com a sessão anterior em vez de substituição",
    find: "    var novo = { decisions: {}, architectureNote: undefined };",
    repl: "    var novo = { decisions: Object.assign({}, estado.decisions), architectureNote: estado.architectureNote };   /* MUTANTE D025-M9: merge */" },

  { id: "D025-M10", file: F.sessao, ...d025("D025-NOP1"),
    desc: "importSessionDocument aplica a curadoria ANTES de sessionCompatibility — engine incompatível deixa rastro",
    find: "  const c = sessionCompatibility(doc);           if (!c.compatible) return { ok:false, error:c.message, compat:c };",
    repl: "  if (window.__CURATION && doc.inputs.reportCuration !== undefined) window.__CURATION.fromSession(doc.inputs.reportCuration);   /* MUTANTE D025-M10 */\n" +
          "  const c = sessionCompatibility(doc);           if (!c.compatible) return { ok:false, error:c.message, compat:c };" },

  { id: "D025-M11", file: F.ux, suites: [d025("D025-NEW1"), m48("S31-S32")],
    desc: "clear() removido de uxNewSession — Nova sessão preserva a curadoria (EA-92)",
    find: "  V32.resetLandscapeToUnset();                          /* limpa TODO o contexto V3.2 */\n" + LINHA_CLEAR_UX,
    repl: "  V32.resetLandscapeToUnset();                          /* limpa TODO o contexto V3.2 */\n" + LINHA_SEM_CLEAR + "   /* MUTANTE D025-M11 */" },

  { id: "D025-M12", file: F.ux, suites: [d025("D025-RST1"), m48("S31-S32")],
    desc: "clear() removido de uxResetAssessment — Reiniciar preserva a curadoria",
    find: LINHA_CLEAR_UX + "\n  step=-1; render();                                   /* Landscape/arch/platform/sinais PRESERVADOS */",
    repl: LINHA_SEM_CLEAR + "   /* MUTANTE D025-M12 */\n  step=-1; render();                                   /* Landscape/arch/platform/sinais PRESERVADOS */" },

  { id: "D025-M13", file: F.ux, ...d025("D025-RST1"),
    desc: "texto antigo do diálogo de Reiniciar — o diálogo deixa de nomear a curadoria",
    find: '"Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado."',
    repl: '"Respostas, observações e prioridades serão limpas. O contexto tecnológico declarado será preservado."' },

  { id: "D025-M14", file: F.sessao, ...d025("D025-TRN1"),
    desc: "prioLimitHit deixa de ser zerado pelo commit — o aviso de limite sobrevive à importação (EA-108)",
    find: "    prioLimitHit = false;                             /* [025 · T030] EA-108 */",
    repl: "    /* MUTANTE D025-M14: prioLimitHit não zerado */" },

  { id: "D025-M15", file: F.ui, ...d025("D025-TRN2"),
    desc: "discardDraft vira no-op — o draft do cliente anterior sobrevive ao commit, a Nova sessão e a Reiniciar (EA-107)",
    find: "function discardDraft(){ const had = draft !== null; draft = null; return had; }",
    repl: "function discardDraft(){ const had = draft !== null; return had; }   /* MUTANTE D025-M15: no-op */" },

  { id: "D025-M16", file: F.sessao, suites: [d025("D025-PRV1"), m48("S30")],
    desc: "sessionHasContent sem a curadoria — só curadoria declarada não exige 'Importar e substituir' (EA-109)",
    find: '    (typeof window !== "undefined" && window.__CURATION && window.__CURATION.toSession() !== undefined);',
    repl: "    false;   /* MUTANTE D025-M16: curadoria não conta como conteúdo */" },

  { id: "D025-M17", file: F.sessao, ...d025("D025-PRV1"),
    desc: "sessionPreview sem o campo curation — a prévia diz 'não' para um arquivo com curadoria",
    find: "    curation: doc.inputs.reportCuration !== undefined };",
    repl: "    curation: undefined };   /* MUTANTE D025-M17 */" },

  /* [W5] a âncora deste mutante é a FORMA NOVA do handler (tabela fechada):
     o produto antes da 025 era `b.set(id, cx.checked ? "include" : "exclude")`,
     e é para ele que o mutante devolve o editor. */
  { id: "D025-M18", file: F.editor, ...d025("D025-UNS1"),
    desc: "remarcar ofertado grava `include` explícito em vez de voltar a ausente (o editor antes da 025, EA-110)",
    find: '        if (ofertado) { if (cx.checked) b.unset(id); else b.set(id, "exclude"); }',
    repl: '        if (ofertado) { b.set(id, cx.checked ? "include" : "exclude"); }   /* MUTANTE D025-M18 */' },

  { id: "D025-M19", file: F.sessao, ...d025("D025-GAT1"),
    desc: "o commit só aplica a curadoria com o gate de suficiência `released` — sob gate fechado a curadoria do arquivo se perde",
    find: "    if (window.__CURATION) window.__CURATION.fromSession(cand.curadoria);   /* [025 · T030] 11º owner, dentro da transação */",
    repl: '    if (window.__CURATION) { const _g = document.getElementById("p50-results"); if (_g && _g.getAttribute("data-p50-gate") === "released") window.__CURATION.fromSession(cand.curadoria); }   /* MUTANTE D025-M19 */' },

  /* [T015] O mutante da REANCORAGEM: ressuscita a lista de 10 chaves em S50 e
     exige que a m48 reprove — se ficasse verde, a alínea nova não discriminaria
     nada. Muta o arquivo de TESTE: não reconstrói o HTML. */
  { id: "D025-M20", file: F.m48, suites: [Object.assign(m48("S50"), { skipBuild: true })], skipBuild: true,
    desc: "ressuscitar a lista de 10 chaves em S50 — provar que a reancoragem ainda discrimina",
    find: '"ans,arch,arq,curadoria,landscape,notes,platforms,priorities,refinement,signals,targetOverrides"',
    repl: '"ans,arch,arq,landscape,notes,platforms,priorities,refinement,signals,targetOverrides"' },

  /* [T070] Mutante DOCUMENTAL em CÓPIA: a linha da sexta chave sai da tabela de
     owners numa cópia de SESSION_SCHEMA_V32.md em tmp, apontada por
     D025_DOC_OVERRIDE. O arquivo rastreado nunca é escrito. */
  { id: "D025-M21", file: F.schema, ...d025("D025-DOC1"), docCopy: true, skipBuild: true,
    desc: "remover a linha da sexta chave da tabela de owners do schema (cópia em tmp) — a documentação deixa de dizer o que o produto faz",
    find: "| curadoria do relatório | `__CURATION` (`ui_curation_v32.js`) | inputs.reportCuration | não |\n",
    repl: "" }
];

/* ==========================================================================
   Runner.
   ========================================================================== */
function existe(f) { try { return fs.statSync(f).isFile(); } catch (e) { return false; } }
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }
function runsDe(m) { return m.suites || [{ suite: m.suite || SUITE_D025, gate: m.gate, reason: m.reason, nodeArgs: m.nodeArgs }]; }
function gatesDe(m) { return runsDe(m).map(r => r.gate).join("/"); }

function SaltoControlado() {}
SaltoControlado.prototype = Object.create(Error.prototype);

const PY = process.env.D025_PYTHON || process.env.MUTATION_PY || "python";
const PY_ORIGEM = process.env.D025_PYTHON ? "D025_PYTHON" : (process.env.MUTATION_PY ? "MUTATION_PY" : "padrão");

function construir(destino) {
  try {
    execFileSync(PY, [path.join(HERE, "build_v32_html.py"), destino], { cwd: HERE, encoding: "utf8", stdio: "pipe" });
    return fs.existsSync(destino) ? { ok: true } : { ok: false, why: "builder não produziu " + destino };
  } catch (e) {
    return { ok: false, why: (e.message || "").split("\n")[0] };
  }
}

/* uma execução de suíte: d025 filtrada por D025_ONLY (gate nominal) e apontada
   para o HTML efêmero; m48 inteira, lendo o HTML efêmero por M48_HTML_OVERRIDE */
function rodar(run, htmlPath, docDir) {
  const args = (run.nodeArgs || []).concat([path.join(HERE, run.suite)]);
  const env = Object.assign({}, process.env);
  delete env.D025_ONLY; delete env.D025_HTML_OVERRIDE; delete env.D025_DOC_OVERRIDE; delete env.M48_HTML_OVERRIDE;
  if (run.suite === SUITE_D025) {
    env.D025_ONLY = run.gate;
    if (htmlPath) env.D025_HTML_OVERRIDE = htmlPath;
    if (docDir) env.D025_DOC_OVERRIDE = docDir;
  } else if (htmlPath) {
    env.M48_HTML_OVERRIDE = htmlPath;
  }
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
    harness: "d025",
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
  process.stderr.write("PREFLIGHT d025 · " + dados.mutantes.length + " mutante(s) · interpretador " + PY + " (" + PY_ORIGEM + "): " +
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
const LOG = process.env.D025_MUT_LOG || null;
if (LOG) fs.writeFileSync(LOG, "");
const linhas = [];
const t0 = Date.now();
let execM48 = 0;
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
  let estado, causa = "", docDir = null, efemero = null;
  const detalhes = [];
  try {
    if (m.docCopy) {
      /* cópia dos dois docs que a suíte lê; só a cópia do schema é mutada */
      docDir = fs.mkdtempSync(path.join(os.tmpdir(), "d025-" + m.id + "-"));
      fs.writeFileSync(path.join(docDir, path.basename(m.file)), texto.split(m.find).join(m.repl), { encoding: "utf8" });
      fs.copyFileSync(P("USER_GUIDE.md"), path.join(docDir, "USER_GUIDE.md"));
    } else {
      fs.writeFileSync(m.file, texto.split(m.find).join(m.repl), { encoding: "utf8" });
    }
    if (!m.skipBuild) {
      efemero = path.join(os.tmpdir(), "d025-" + m.id + ".html");
      const build = construir(efemero);
      if (!build.ok) { estado = NAO_EXECUTADO; causa = CAUSA.rebuild + ": " + build.why; throw new SaltoControlado(); }
    }
    for (const run of runsDe(m)) {
      if (run.suite === SUITE_M48) execM48++;
      const r = rodar(run, efemero, docDir);
      detalhes.push({ suite: run.suite, gate: run.gate, exit: r.saiu, falha: r.falha, segundos: r.segundos });
      if (r.saiu === 0) { estado = SOBREVIVENTE; causa = "o gate " + run.gate + " (" + run.suite + ") ficou verde sob mutação"; break; }
      if (!run.reason.test(r.out)) { estado = SOBREVIVENTE; causa = run.suite + " reprovou por motivo diferente do esperado (" + run.gate + "): " + (r.falha || "sem linha FAIL"); break; }
    }
    if (!estado) estado = DETECTADO;
  } catch (e) {
    if (!(e instanceof SaltoControlado)) { estado = NAO_EXECUTADO; causa = CAUSA.gate + ": " + (e.message || String(e)).split("\n")[0]; }
  } finally {
    if (!m.docCopy) fs.writeFileSync(m.file, original);
    if (Buffer.compare(fs.readFileSync(m.file), original) !== 0)
      throw new Error("RESTAURAÇÃO FALHOU em " + m.file + " — árvore alterada pela verificação (R7 §3)");
    if (efemero) { try { fs.unlinkSync(efemero); } catch (e) { /* efêmero */ } }
    if (docDir) { try { fs.rmSync(docDir, { recursive: true, force: true }); } catch (e) { /* efêmero */ } }
  }
  linhas.push({ id: m.id, estado, causa, detalhes });
  if (LOG) fs.appendFileSync(LOG, JSON.stringify({ id: m.id, estado, causa, gates: gatesDe(m), detalhes }) + "\n");
}

/* ============================== resumo ============================== */
linhas.forEach(l => {
  const m = MUTANTS.find(x => x.id === l.id) || {};
  console.log(l.estado + "  " + l.id + " · " + m.desc + (l.causa ? " [" + l.causa + "]" : ""));
  console.log("              gate esperado: " + gatesDe(m) + (l.causa ? " · causa: " + l.causa : "") +
    (l.detalhes && l.detalhes.length ? " · " + l.detalhes.map(d => d.suite.replace(/^tests_|\.js$/g, "") + " exit " + d.exit + " em " + d.segundos + " s").join(", ") : ""));
});
const det = linhas.filter(l => l.estado === DETECTADO).length;
const sob = linhas.filter(l => l.estado === SOBREVIVENTE).length;
const nex = linhas.filter(l => l.estado === NAO_EXECUTADO).length;
console.log("\nrestauração: source byte a byte OK · tempo total " + Math.round((Date.now() - t0) / 1000) + " s · execuções da m48: " + execM48);
console.log("D025 MUTATION [tests_025_mutants.js]: " + det + " DETECTADO · " + sob + " SOBREVIVENTE · " + nex + " NÃO EXECUTADO de " + linhas.length);
process.exit((sob || nex) ? 1 : 0);
