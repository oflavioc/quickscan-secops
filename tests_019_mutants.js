/* ============================================================================
   CAMPANHA DE MUTAÇÃO D019 — demanda 019-curadoria-do-relatorio
   Alvo: os dez gates de `tests_019_curadoria.js`. Um mutante por gate (R3 §5).

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · o gate reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e o gate não a pegou, ou pegou por
                        motivo diferente
       NÃO EXECUTADO  · SEMPRE com causa declarada. Mutante que não chegou a
                        rodar é NÃO EXECUTADO, jamais SOBREVIVENTE

   ==========================================================================
   POR QUE ESTA CAMPANHA NASCE INTEIRA EM "NÃO EXECUTADO"
   ==========================================================================
   Ela é escrita na Fase 4 (RED), ANTES da implementação — é o que a R3 §5
   exige: o mutante existe antes do código que ele ataca. Mas os arquivos que
   ele muta ainda não existem, então **a causa é declarada e o estado é NÃO
   EXECUTADO** — nunca SOBREVIVENTE, que significaria "atacou e escapou".

   O runner NÃO estoura quando o alvo falta: isso seria transformar uma
   ausência esperada em erro de infraestrutura, e esconderia o estado real.

   As âncoras (`find`) são o TEXTO que a spec manda existir, não números de
   linha — lição do `EA-4` (âncora podre), que fez M5/M6/M7 da 015 saírem
   `ocorrencias=0` sem ninguém ver. Quando cada wave entregar seu módulo, o
   preflight passa a exigir `ocorrencias == 1` e a campanha ganha sentido.

   ==========================================================================
   OS DOIS MUTANTES QUE MEDEM O MODO REAL DE QUEBRA
   ==========================================================================
   · **M4** remove a proveniência **só no papel**. É assim que as duas
     superfícies deste produto divergem de verdade — foi o `EA-58`, e antes
     dele o `EA-55`. Mutante que removesse nas duas seria fácil demais.
   · **M6** descarta produto que só aparece como `.prod-mini`. É assim que a
     visão por solução perderia conteúdo sem ninguém ver, porque a menção
     curta é o que o olho não procura.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

/* Os módulos que a demanda cria. Nenhum existe na Fase 4 — é o ponto. */
const F = {
  estado:  P("ui_curation_v32.js"),
  editor:  P("ui_curation_edit_v32.js"),
  solucao: P("ui_p52_support_v32.js"),
  sessao:  P("ui_session_v32.js"),
  papel:   P("ui_v32.js"),
  gateSes: P("tests_session_m48.js")
};

const CMD = "node tests_019_curadoria.js";

const MUTANTS = [
  { id: "D019-M1", file: F.estado, gate: "D019-CUR1",
    desc: "abrir o estado para TEXTO LIVRE — a fronteira que a demanda existe para proteger",
    find: 'offerings:', repl: 'textoLivre: "", offerings:',
    reason: /texto longo|enum fechado|SELEÇÃO/ },

  { id: "D019-M2", file: F.estado, gate: "D019-CUR2",
    desc: "fazer ausência de curadoria significar 'excluir tudo'",
    find: '"include"', repl: '"exclude"',
    reason: /MESMO relatório|missing/ },

  { id: "D019-M3", file: F.sessao, gate: "D019-INV8",
    desc: "serializar junto a lista de recomendações resultante — derivado como fonte de verdade",
    find: "reportCuration", repl: "reportCuration_derivado",
    reason: /inputs canônicos|campo derivado/ },

  { id: "D019-M4", file: F.papel, gate: "D019-PROV1",
    desc: "remover a proveniência SÓ NO PAPEL — o modo real de as duas superfícies divergirem",
    find: 'data-p53-prov', repl: 'data-p53-prov-removido',
    reason: /proveniência ausente no PAPEL/ },

  { id: "D019-M5", file: F.solucao, gate: "D019-MED1",
    desc: "deixar a curadoria filtrar a lista de findings — alcançar MEDIÇÃO",
    find: "offerings", repl: "findings",
    reason: /alterou derivado|não podem mudar/ },

  { id: "D019-M6", file: F.solucao, gate: "D019-SOL1",
    desc: "descartar produto que só aparece como menção curta — perda que o olho não procura",
    find: ".prod-mini", repl: ".prod-mini-ignorado",
    reason: /SUMIU na visão por solução/ },

  { id: "D019-M7", file: F.solucao, gate: "D019-SOL2",
    desc: "descartar em silêncio o produto sem categoria conhecida",
    find: "nao-classificado", repl: "descartado-em-silencio",
    reason: /fora de qualquer grupo|não se nomeia/ },

  { id: "D019-M8", file: F.papel, gate: "D019-PAR1",
    desc: "aplicar a curadoria só na tela — o papel volta a publicar tudo",
    find: "__CURATION", repl: "__CURATION_ignorado",
    reason: /divergência tela×papel/ },

  { id: "D019-M9", file: F.editor, gate: "D019-VAZ1",
    desc: "renderizar seção vazia quando a curadoria suprime tudo",
    find: "data-p53-suprimido", repl: "data-p53-suprimido-removido",
    reason: /vazia e muda|DESAPARECEU/ },

  { id: "D019-M10", file: F.editor, gate: "D019-SUF1",
    desc: "oferecer curadoria com o resultado bloqueado",
    find: 'blocked', repl: 'released',
    reason: /resultado bloqueado/ }
];

/* ==========================================================================
   Runner. Mutação em CÓPIA do arquivo, com restauração conferida byte a byte
   (R7 §3: verificação nunca deixa a árvore alterada).
   ========================================================================== */
function existe(f) { try { return fs.statSync(f).isFile(); } catch (e) { return false; } }
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }

/* salto de controle interno: separa "o mutante não chegou a ser julgado" de
   "o gate o deixou passar". Sem isso, falha de build viraria SOBREVIVENTE. */
function SaltoControlado() {}
SaltoControlado.prototype = Object.create(Error.prototype);

const PY = process.env.D019_PYTHON || "python";

function construir(destino) {
  try {
    execFileSync(PY, [path.join(HERE, "build_v32_html.py"), destino],
      { cwd: HERE, encoding: "utf8", stdio: "pipe" });
    return fs.existsSync(destino) ? { ok: true } : { ok: false, why: "builder não produziu " + destino };
  } catch (e) {
    return { ok: false, why: (e.message || "").split("\n")[0] };
  }
}

function rodarGate(only, htmlPath) {
  try {
    const out = execFileSync(process.argv[0], [path.join(HERE, "tests_019_curadoria.js")],
      { cwd: HERE, encoding: "utf8",
        env: Object.assign({}, process.env, { D019_ONLY: only, D019_HTML_OVERRIDE: htmlPath }) });
    return { saiu: 0, out };
  } catch (e) {
    return { saiu: e.status == null ? -1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

const linhas = [];
for (const m of MUTANTS) {
  if (!existe(m.file)) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "alvo ainda não existe (" + path.basename(m.file) + ") — a wave que o cria não rodou" });
    continue;
  }
  const n = ocorrencias(m);
  if (n !== 1) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "âncora com ocorrencias=" + n + " em " + path.basename(m.file) + " (exigido exatamente 1)" });
    continue;
  }
  const original = fs.readFileSync(m.file, "utf8");
  let estado, causa = "";
  try {
    fs.writeFileSync(m.file, original.split(m.find).join(m.repl), { encoding: "utf8" });
    /* O gate lê o HTML CONSTRUÍDO, não o módulo-fonte. Sem reconstruir, a
       mutação não alcançaria o sujeito e TODO mutante sairia SOBREVIVENTE pelo
       motivo errado — falso negativo de campanha, que é pior que campanha
       nenhuma. O build escreve em ARQUIVO PRÓPRIO (`--out` efêmero) e o gate é
       apontado para ele: a verificação não toca o artefato rastreado (R7 §3).
       Caminho entre aspas por `execFileSync` com argv separado (R10 §7). */
    const efemero = path.join(require("os").tmpdir(), "d019-" + m.id + ".html");
    const build = construir(efemero);
    if (!build.ok) {
      estado = NAO_EXECUTADO;
      causa = "build sob mutação falhou: " + build.why;
      throw new SaltoControlado();
    }
    const r = rodarGate(m.gate, efemero);
    try { fs.unlinkSync(efemero); } catch (e) { /* efêmero; ausência não é erro */ }
    if (r.saiu === 0) { estado = SOBREVIVENTE; causa = "o gate " + m.gate + " ficou verde sob mutação"; }
    else if (m.reason.test(r.out)) { estado = DETECTADO; }
    else { estado = SOBREVIVENTE; causa = "reprovou por motivo diferente do esperado"; }
  } catch (e) {
    if (!(e instanceof SaltoControlado)) {
      estado = NAO_EXECUTADO;
      causa = "erro ao julgar: " + (e.message || String(e)).split("\n")[0];
    }
  } finally {
    fs.writeFileSync(m.file, original, { encoding: "utf8" });
    if (fs.readFileSync(m.file, "utf8") !== original)
      throw new Error("RESTAURAÇÃO FALHOU em " + m.file + " — árvore alterada pela verificação (R7 §3)");
  }
  linhas.push({ id: m.id, estado, causa });
}

/* ============================== resumo ============================== */
linhas.forEach(l => console.log(l.estado + "  " + l.id + " · " +
  (MUTANTS.find(m => m.id === l.id) || {}).desc + (l.causa ? " [" + l.causa + "]" : "")));

const det = linhas.filter(l => l.estado === DETECTADO).length;
const sob = linhas.filter(l => l.estado === SOBREVIVENTE).length;
const nex = linhas.filter(l => l.estado === NAO_EXECUTADO).length;
console.log("\nrestauração: source byte a byte OK");
console.log("D019 MUTATION [tests_019_mutants.js]: " + det + " DETECTADO · " + sob +
  " SOBREVIVENTE · " + nex + " NÃO EXECUTADO de " + linhas.length);
if (nex === linhas.length)
  console.log("  causa única: a demanda está na Fase 4 (RED) — nenhum alvo existe ainda, e isso é o esperado");
process.exit(sob ? 1 : 0);
