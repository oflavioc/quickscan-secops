/* ============================================================================
   CAMPANHA DE MUTAÇÃO D023 — demanda 023-leitura-unica-do-apoio
   Alvo: os 9 gates de `tests_023_leitura.js`, mais os dois carrascos que moram
   em suíte alheia e são nomeados como tal.

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · o gate reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e o gate não a pegou, ou pegou por
                        motivo diferente
       NÃO EXECUTADO  · SEMPRE com causa declarada

   ==========================================================================
   POR QUE ESTA CAMPANHA CARREGA MAIS PESO DO QUE O NORMAL
   ==========================================================================
   OITO DOS NOVE GATES DESTA DEMANDA NASCERAM VERDES. Isso está declarado no
   cabeçalho da suíte e não é acidente: a demanda muda duas expressões
   booleanas, e o único vermelho de nascença foi o `D023-OCU1`, o critério do
   relato. Guarda que nasce verde tem o poder NO MUTANTE — se esta campanha for
   fraca, oito gates ficam sendo decoração e ninguém percebe, porque a suíte
   continua verde.

   Por isso há `M1b`, `M5b` e `M8b`: três propriedades desta demanda têm mais de
   uma forma plausível de serem desfeitas, e medir uma só deixaria a outra sem
   carrasco.

   ==========================================================================
   DOIS MUTANTES CUJO CARRASCO MORA EM OUTRA SUÍTE, e isso é declarado
   ==========================================================================
   `M2` e `M5b` têm carrasco em suíte alheia, e o de `M2` foi DESCOBERTO pela
   campanha: ele saiu sobrevivente contra o gate que eu lhe havia dado, e a
   sobrevivência mostrou que a propriedade atacada pertence ao `D019-CTX1` — ver
   a nota no próprio mutante.

   `M5b` desfaz a cláusula da errata `E4` (gate de suficiência fechado não
   substitui). Nenhuma das oito fixtures desta demanda tem `suff === false` —
   todas respondem as quinze —, então nenhum gate `D023-*` pode matá-lo. Quem
   mata é o `D010-ARB1`, ancorado na `D010-F3` exatamente por isso. Declarar o
   carrasco onde ele está é mais honesto do que fabricar uma oitava fixture para
   a campanha parecer autossuficiente.

   É também a prova de que a cláusula `E4` não é zelo: ela nasceu porque o
   `D010-ARB3 (c)` reprovou, e sobrevive porque um gate a mata.
   ============================================================================ */

"use strict";

const path = require("path"), fs = require("fs");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

const F = {
  pred: P("ui_v32.js"),                 /* o predicado e a arbitragem (§29.4) */
  apoio: P("ui_p52_support_v32.js")     /* a fronteira e o papel da visão por produto */
};

const CMD = "node tests_023_leitura.js";
const CMD_010 = "node tests_010_vao.js";
const CMD_019 = "node tests_019_curadoria.js";
const PY = process.env.D023_PYTHON || "python";

const MUTANTS = [
  /* ---------------------------------------------------------------- C1 · OCU1 */
  { id: "D023-M1", file: F.pred, gate: "D023-OCU1", cmd: CMD,
    desc: "manter o predicado ANTIGO — a segunda fonte deixa de contar e a redundância volta",
    find: "  return porCapability || temProdutoPublicadoV32();",
    repl: "  return porCapability;",
    reason: /leitura congelada AINDA VISÍVEL/ },

  { id: "D023-M1b", file: F.pred, gate: "D023-OCU1", cmd: CMD,
    desc: "restaurar a IMUNIDADE do ramo legado — o caso do relato volta a não ser arbitrado",
    find: "    hideLegacyRecommendation(app, hasSubstituteV32(null));",
    repl: "    hideLegacyRecommendation(app, false);",
    reason: /\(a\) modo legado · leitura congelada AINDA VISÍVEL/ },

  /* ---------------------------------------------------------------- C2 · REG1 */
  /* ESTE MUTANTE TROCOU DE CARRASCO NA PRIMEIRA CAMPANHA, e a troca é o achado.
     Ele saiu SOBREVIVENTE contra o `D023-REG1`, e a sobrevivência acusou a minha
     hipótese, não o código: eu havia escrito — na nota 2 do cabeçalho da suíte e
     na errata `E3` da spec — que sem a `fronteira()` os cards seriam ocultados
     junto com a lista congelada. MEDIDO, É FALSO: artefato reconstruído com a
     mutação e sondado em três renders, nas duas fixtures, deu `cards=11
     ocultos=0` nas seis medições — o decorador REPÕE os cards depois da
     varredura, e `colocar()` nunca devolve nó com `v32-hidden`.
     O que a fronteira protege é o CENSO, que é oráculo e pertence à demanda que
     a introduziu. O carrasco verdadeiro é o `D019-CTX1`, e ele reprova com a
     mensagem exata do autor dela. A nota e a errata foram corrigidas; o ataque
     não mudou uma vírgula. */
  { id: "D023-M2", file: F.apoio, gate: "D019-CTX1", cmd: CMD_019,
    desc: "a FRONTEIRA deixa de ser inserida — o censo da Camada 1 volta a ler o grupo como meio oculto",
    find: "    if (arbitrando && cards.length) sec.appendChild(fronteira());",
    repl: "    if (false && cards.length) sec.appendChild(fronteira());",
    reason: /falta a fronteira que encerra a contagem do censo/ },

  { id: "D023-M2b", file: F.pred, gate: "D023-REG1", cmd: CMD,
    desc: "a segunda fonte SUBSTITUI a primeira em vez de somar — com contexto declarado e produto suprimido a congelada volta, com os cards de capability na tela",
    find: "  return porCapability || temProdutoPublicadoV32();",
    repl: "  return temProdutoPublicadoV32();",
    reason: /a segunda fonte substituiu a primeira em vez de somar/ },

  /* ---------------------------------------------------------------- C3 · SUP1 */
  { id: "D023-M3", file: F.pred, gate: "D023-SUP1", cmd: CMD,
    desc: "IGNORAR A CURADORIA no predicado — o vão da 010 de volta: o operador remove tudo e a congelada não retorna",
    find: "    const pub = window.__CURATION.published();",
    repl: "    const pub = window.__CURATION.offered();",
    reason: /Camada 1 OCULTA sem substituto algum/ },

  /* ---------------------------------------------------------------- C4 · ARB1 */
  { id: "D023-M4", file: F.pred, gate: "D023-ARB1", cmd: CMD,
    desc: "ocultar o TÍTULO e parar — o grupo contíguo fica meio oculto e meio visível",
    find: "    if (hiding && allowed) node.classList.toggle(\"v32-hidden\", hide);",
    repl: "    if (hiding && allowed) node.classList.toggle(\"v32-hidden\", false);",
    reason: /arbitragem PARCIAL/ },

  /* ---------------------------------------------------------------- C5 · SUJ1 */
  { id: "D023-M5", file: F.pred, gate: "D023-SUJ1", cmd: CMD,
    desc: "o predicado SEMPRE verdadeiro — o `D010-ARB1` perde o sujeito e a 023 esvazia oráculo alheio",
    find: "  const porCapability = Object.keys(ctxs).some(id => {",
    repl: "  if (true) return true;\n  const porCapability = Object.keys(ctxs).some(id => {",
    reason: /Camada 1 oculta na fixture que deveria devolvê-la|a V3.2 ocultou a Camada 1 SEM substituto/ },

  { id: "D023-M5b", file: F.pred, gate: "D010-ARB1", cmd: CMD_010,
    desc: "[errata E4] gate de suficiência FECHADO volta a substituir — leitura não-publicável desloca a congelada",
    find: "    if (!dataSufficiency(DOMS.map((_, i) => domStat(i)))) return false;",
    repl: "    if (false) return false;",
    reason: /títulos congelados OCULTOS sem substituto|blocos contíguos OCULTOS|conjunto visível difere do legado/ },

  /* ---------------------------------------------------------------- C6 · PAP1 */
  { id: "D023-M6", file: F.apoio, gate: "D023-PAP1", cmd: CMD,
    desc: "arbitrar só na TELA — o aviso de supressão não viaja para o papel, que é o que chega ao cliente",
    find: "    if (aviso) h += '<div class=\"pr-mut\" data-p53-suprimido=\"' +",
    repl: "    if (false) h += '<div class=\"pr-mut\" data-p53-suprimido=\"' +",
    reason: /aviso de supressão em uma superfície só/ },

  /* ---------------------------------------------------------------- C7 · DOM1 */
  { id: "D023-M7", file: F.pred, gate: "D023-DOM1", cmd: CMD,
    desc: "REMOVER em vez de ocultar — a Camada 1 sai do DOM e não há como devolvê-la",
    find: "      node.classList.toggle(\"v32-hidden\", hide && hiding);",
    repl: "      if (hide && hiding && node.parentNode) { node.parentNode.removeChild(node); return; }\n      node.classList.toggle(\"v32-hidden\", hide && hiding);",
    reason: /conteúdo congelado AUSENTE do DOM|nenhum título congelado no DOM/ },

  /* ---------------------------------------------------------------- C9 · LEG1 */
  { id: "D023-M8", file: F.pred, gate: "D023-LEG1", cmd: CMD,
    desc: "ocultar em modo legado SEM substituto — a arbitragem atravessa onde não há nada para pôr no lugar",
    find: "    hideLegacyRecommendation(app, hasSubstituteV32(null));",
    repl: "    hideLegacyRecommendation(app, true);",
    reason: /a V3.2 ocultou a Camada 1 SEM substituto algum/ },

  { id: "D023-M8b", file: F.pred, gate: "D023-LEG1", cmd: CMD,
    desc: "a V3.2 passa a governar MAIS que a arbitragem em modo legado — `#v32support` nasce ali",
    find: "      <div id=\"v32editor\" class=\"v32-hidden\" aria-live=\"off\"></div>`;",
    repl: "      <div id=\"v32editor\" class=\"v32-hidden\" aria-live=\"off\"></div>\n      <div id=\"v32support\"></div>`;",
    reason: /`#v32support` APARECEU em modo legado/ }
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
  const origem = process.env.D023_PYTHON ? "D023_PYTHON" : "padrão";
  const dados = {
    harness: "d023",
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
  process.stderr.write("PREFLIGHT d023 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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
const ONLY = (process.env.D023_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
const linhas = [];
for (const m of MUTANTS) {
  if (ONLY.length && ONLY.indexOf(m.id) < 0) continue;
  if (!existe(m.file)) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "alvo não existe (" + path.basename(m.file) + ")" });
    continue;
  }
  const n = ocorrencias(m);
  if (n !== 1) {
    linhas.push({ id: m.id, estado: NAO_EXECUTADO,
      causa: "âncora com ocorrencias=" + n + " em " + path.basename(m.file) +
             " (exigido exatamente 1)" });
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
    const efemero = path.join(require("os").tmpdir(), "d023-" + m.id + ".html");
    const build = construir(efemero);
    if (!build.ok) { estado = NAO_EXECUTADO; causa = CAUSA.rebuild + ": " + build.why; }
    if (!estado) {
      let saida = "", falhou = false;
      try {
        const env = Object.assign({}, process.env);
        /* as duas suítes honram a própria variável de override */
        env.D023_HTML_OVERRIDE = efemero;
        env.D010_HTML_OVERRIDE = efemero;
        env.D019_HTML_OVERRIDE = efemero;
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
console.log("\nD023 MUTATION" + (ONLY.length ? " [FILTRADO]" : "") + ": " +
            cont[DETECTADO] + " DETECTADO · " + cont[SOBREVIVENTE] +
            " SOBREVIVENTE · " + cont[NAO_EXECUTADO] + " NÃO EXECUTADO de " + linhas.length);
process.exit((cont[SOBREVIVENTE] || cont[NAO_EXECUTADO]) ? 1 : 0);
