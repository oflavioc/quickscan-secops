/* ============================================================================
   CAMPANHA DE MUTAÇÃO D021 — demanda 021-cobertura-do-apoio
   Alvo: os oito gates de `tests_021_cobertura.js` mais o `P51-REC1` emendado.
   Um mutante por critério (R3 §5).

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · o gate reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e o gate não a pegou, ou pegou por
                        motivo diferente
       NÃO EXECUTADO  · SEMPRE com causa declarada. Mutante que não chegou a
                        rodar é NÃO EXECUTADO, jamais SOBREVIVENTE

   ==========================================================================
   POR QUE ESTA CAMPANHA NASCE EM "NÃO EXECUTADO"
   ==========================================================================
   Ela é escrita na Fase 4 (RED), ANTES da implementação — é o que a R3 §5
   exige. As âncoras apontam para linhas que a W3 ainda não escreveu, então o
   estado é NÃO EXECUTADO **com causa declarada**, nunca SOBREVIVENTE, que
   significaria "atacou e escapou".

   As âncoras são o TEXTO COMPORTAMENTAL que a spec manda existir, nunca número
   de linha — lição do `EA-4` (âncora podre), que na 015 fez três mutantes
   saírem `ocorrencias=0` sem ninguém ver, e que na 019 me pegou de novo depois
   de um rename. Âncora podre não aparece como vermelho: aparece como SILÊNCIO.
   O `--preflight` existe para que ela apareça ANTES.

   ==========================================================================
   O MUTANTE QUE MEDE O MODO REAL DE QUEBRA DESTE PRODUTO
   ==========================================================================
   **M7** faz a derivação funcionar **só sem contexto declarado**. Não é um
   ataque inventado: é a forma exata do `EA-65`, em que a visão por solução
   sumia inteira quando o cliente declarava ambiente — justamente o caminho
   mais cuidadoso do produto. Um mutante que quebrasse nas duas configurações
   seria fácil demais; este quebra na que ninguém olha.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

const F = {
  papel: P("ui_v32.js"),          /* onde a derivação vive (§29.4) */
  uat:   P("tests_p50_core.js")   /* onde a §UAT-07 é declarada */
};

const CMD = "node tests_021_cobertura.js";
const CMD_UAT = "node tests_p50_core.js";
const PY = process.env.D021_PYTHON || "python";

const MUTANTS = [
  { id: "D021-M1", file: F.papel, gate: "D021-CUR1", cmd: CMD,
    desc: "a derivação passa NA FRENTE da tabela curada — é o desenho B, descartado no portão por estreitar os quatro",
    find: "const m = curado || qsGapSupportDerivado(f);",
    repl: "const m = qsGapSupportDerivado(f) || curado;",
    reason: /publica \d+ opções, a tabela declara|perdeu a opção/ },

  { id: "D021-M2", file: F.papel, gate: "D021-COB1", cmd: CMD,
    desc: "manter o silêncio de hoje para quem não está na tabela — o defeito que a demanda existe para corrigir",
    find: "const m = curado || qsGapSupportDerivado(f);",
    repl: "const m = curado;",
    reason: /ficaram MUDOS/ },

  /* ==========================================================================
     D021-M3 · APOSENTADO em 2026-09-24, e o id NÃO é reutilizado (R12).

     Ele atacava a guarda `if (!cand.length) return null;` esperando bloco vazio.
     Executado, saiu SOBREVIVENTE — e a causa não é gate fraco: é que a guarda é
     **inalcançável por construção**. Medido: sempre que há gap, há candidato
     (níveis 0 e 1 → 15 gaps/15 candidatos; nível 2 → 0 gaps/0 candidatos).
     Removê-la não muda nada observável, logo o mutante é EQUIVALENTE.

     É a disposição do `product-owner` na demanda 010, registrada em
     `design-decisions.md`: cláusula defensiva inalcançável por construção é
     *declarada, sem mutante* — e mutante equivalente entra como dívida declarada,
     **nunca como par vazio na coluna de mutantes**.

     A METADE ESTÁTICA DA PROVA tem gate: o `D021-VAZ1 (a)` afirma que todo gap
     tem candidato no nível respondido. Se o catálogo mudar e a guarda virar
     alcançável, ele reprova e AVISA — e aí um mutante novo, com id novo, passa a
     fazer sentido.
     ========================================================================== */

  { id: "D021-M4", file: F.papel, gate: "D021-FON1", cmd: CMD,
    desc: "trocar o porquê do MAP por redação própria — a segunda fonte que o EA-68 custou sete waves para eliminar",
    find: "opts: cand.map(o => ({ n: o.p, w: o.w }))",
    repl: 'opts: cand.map(o => ({ n: o.p, w: "apoio possível, a validar" }))',
    reason: /o porquê publicado não é o do MAP/ },

  { id: "D021-M5", file: F.papel, gate: "D021-NIV1", cmd: CMD,
    desc: "ler sempre o nível 0 em vez do nível respondido — o gap deixa de ser o do cliente",
    find: "const cand = (m && m.lv && m.lv[f.lvl] && m.lv[f.lvl].c) || [];",
    repl: "const cand = (m && m.lv && m.lv[0] && m.lv[0].c) || [];",
    /* as DUAS mensagens do NIV1 são detecção correta do mesmo defeito: ou o
       bloco deixa de citar o produto do nível respondido, ou passa a citar um
       que só existe no nível 0. Exigir só a segunda tornava o mutante
       SOBREVIVENTE por precisão de regex, não por falha de gate. */
    reason: /que só existe no nível 0 — leu nível fixo|\(nível 1\) não cita/ },

  { id: "D021-M6", file: F.papel, gate: "D021-ANC1", cmd: CMD,
    desc: "marcar todo bloco como ancorado na capability — o aviso do EA-48 volta a mentir para metade deles",
    find: 'const ancora = curado ? "capability" : "nivel";',
    repl: 'const ancora = "capability";',
    reason: /declara ancoragem 'capability', a origem dele é 'nivel'|repete o aviso de divergência/ },

  { id: "D021-M7", file: F.papel, gate: "D021-PAR1", cmd: CMD,
    desc: "derivar SÓ sem contexto declarado — a forma exata do EA-65, em que o caminho mais cuidadoso do produto perdia a funcionalidade",
    find: "const m = curado || qsGapSupportDerivado(f);",
    repl: "const m = curado || (declarado ? null : qsGapSupportDerivado(f));",
    reason: /com contexto: \d+ gap\(s\) sem apoio NO PAPEL/ },

  { id: "D021-M8", file: F.papel, gate: "D021-CTX1", cmd: CMD,
    desc: "tirar a ressalva de validação quando o contexto NÃO foi declarado — contexto ausente virando recomendação",
    find: "exigem <b>validar aderência</b> antes de qualquer recomendação.",
    repl: "são os caminhos indicados para esta capability.",
    reason: /sem a ressalva com contexto NÃO declarado/ },

  { id: "D021-M9", file: F.uat, gate: "P51-REC1", cmd: CMD_UAT,
    desc: "reintroduzir os quatro literais da §UAT-07 — a prova de que a emenda NÃO afrouxou o gate",
    find: "const QIDS_AUTORIZADOS = qidsDaFonteCongelada(R.w);",
    repl: 'const QIDS_AUTORIZADOS = ["detection-lifecycle", "logs", "automation", "vulnerability-management"];',
    reason: /fora do mapeamento normativo/ }
];

/* ========================================================================== */
const existe = f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } };
const ocorrencias = m => existe(m.file) ? fs.readFileSync(m.file, "utf8").split(m.find).length - 1 : 0;

function construir(saida) {
  try {
    execFileSync(PY, [path.join(HERE, "build_v32_html.py"), saida], { cwd: HERE, stdio: "pipe" });
    return { ok: true };
  } catch (e) { return { ok: false, why: (e && e.message || String(e)).split("\n")[0] }; }
}

/* ==========================================================================
   `--preflight` — contrato C1 da demanda 013, no MESMO commit da chave do mapa.
   NÃO muta, NÃO reconstrói, NÃO executa gate e NÃO escreve arquivo: emite UM
   objeto JSON em stdout (todo texto humano vai para stderr) e prova
   `ocorrencias == 1` em cada âncora ANTES de qualquer mutação.
   ========================================================================== */
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
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente: "âncora não encontrada",
  ambigua: "âncora ambígua",
  rebuild: "rebuild falhou",
  gate: "gate não pôde ser executado"
};
function preflight() {
  const binario = resolvePy(PY);
  const origem = process.env.D021_PYTHON ? "D021_PYTHON" : "padrão";
  const dados = {
    harness: "d021",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: origem, resolvido: !!binario },
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of MUTANTS) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");
  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d021 · " + dados.mutantes.length + " mutante(s) · interpretador " +
    PY + " (" + origem + "): " + (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
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
if (process.argv.slice(2).indexOf("--preflight") >= 0) process.exit(preflight());

/* ============================== campanha ============================== */
const linhas = [];
for (const m of MUTANTS) {
  if (!existe(m.file)) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "alvo não existe (" + path.basename(m.file) + ")" });
    continue;
  }
  const n = ocorrencias(m);
  if (n !== 1) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "âncora com ocorrencias=" + n + " em " + path.basename(m.file) +
             " (exigido exatamente 1) — a wave que escreve essa linha ainda não rodou" });
    continue;
  }
  const original = fs.readFileSync(m.file, "utf8");
  let estado, causa = "";
  try {
    fs.writeFileSync(m.file, original.split(m.find).join(m.repl), { encoding: "utf8" });
    /* O gate lê o HTML CONSTRUÍDO, não o módulo-fonte. Sem reconstruir, a
       mutação não alcançaria o sujeito e TODO mutante sairia SOBREVIVENTE pelo
       motivo errado — falso negativo de campanha, pior que campanha nenhuma.
       O build escreve em arquivo EFÊMERO e o gate é apontado para ele: a
       verificação não toca o artefato rastreado (R7 §3). */
    const efemero = path.join(require("os").tmpdir(), "d021-" + m.id + ".html");
    const precisaBuild = m.file === F.papel;
    if (precisaBuild) {
      const build = construir(efemero);
      if (!build.ok) { estado = NAO_EXECUTADO; causa = CAUSA.rebuild + ": " + build.why; }
    }
    if (!estado) {
      let saida = "", falhou = false;
      try {
        const env = Object.assign({}, process.env);
        if (precisaBuild) env.D021_HTML_OVERRIDE = efemero;
        saida = execFileSync(m.cmd.split(" ")[0], m.cmd.split(" ").slice(1),
          { cwd: HERE, encoding: "utf8", env: env, stdio: "pipe" });
      } catch (e) {
        falhou = true;
        saida = (e.stdout || "") + (e.stderr || "");
      }
      if (!falhou) { estado = SOBREVIVENTE; causa = "o gate " + m.gate + " NÃO reprovou"; }
      else if (!m.reason.test(saida)) {
        estado = SOBREVIVENTE;
        causa = "reprovou por motivo DIFERENTE do esperado (" + m.reason + ")";
      } else estado = DETECTADO;
    }
  } finally {
    fs.writeFileSync(m.file, original, { encoding: "utf8" });
  }
  linhas.push({ id: m.id, estado, causa, gate: m.gate });
}

const cont = { [DETECTADO]: 0, [SOBREVIVENTE]: 0, [NAO_EXECUTADO]: 0 };
for (const l of linhas) {
  cont[l.estado]++;
  console.log(l.estado.padEnd(14) + " " + l.id + (l.gate ? " · gate " + l.gate : "") +
              (l.causa ? " · " + l.causa : ""));
}
console.log("\nD021 MUTATION: " + cont[DETECTADO] + " DETECTADO · " + cont[SOBREVIVENTE] +
            " SOBREVIVENTE · " + cont[NAO_EXECUTADO] + " NÃO EXECUTADO de " + linhas.length);
process.exit((cont[SOBREVIVENTE] || cont[NAO_EXECUTADO]) ? 1 : 0);
