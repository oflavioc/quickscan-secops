/* ============================================================================
   CAMPANHA DE MUTAÇÃO D022 — demanda 022-escalonamento-do-investimento
   Alvo: os 14 gates de `tests_022_escalonamento.js`. Um mutante por critério
   (R3 §5), exceto o C14, cujo carrasco é o par `baseline`/`m41` do pipeline.

   VOCABULÁRIO DE TRÊS ESTADOS (013), sem quarta opção:

       DETECTADO      · o gate reprovou, E pelo motivo esperado
       SOBREVIVENTE   · a mutação aplicou e o gate não a pegou, ou pegou por
                        motivo diferente
       NÃO EXECUTADO  · SEMPRE com causa declarada

   ==========================================================================
   POR QUE ESTA CAMPANHA NASCE DEPOIS DA IMPLEMENTAÇÃO, E NÃO NO RED
   ==========================================================================
   A tabela de tarefas colocou esta campanha na wave 0, junto do red. Foi
   otimismo meu: mutante precisa de ÂNCORA em código real, e `ui_ondas_v32.js`
   só nasce na W1. Escrever mutante sobre linha que não existe produz âncora
   podre de nascença — que é como `NÃO EXECUTADO` disfarçado de cobertura. A
   correção ficou registrada no planning-state em vez de a tabela ser reescrita
   para parecer certa.

   ==========================================================================
   TRÊS MUTANTES QUE ATACAM SPEC SELADA, e por que isso importa
   ==========================================================================
   `M11`, `M12` e `M13` não são ataques inventados: cada um desfaz uma cláusula
   de `specs/PHASE_5_0_REV_B.md`, que o cross-check da Fase 1 leu linha a linha —
   UX-P7 (`:270`, não depender só de cor), UX-P6 (`:267`, visão derivada declara
   proveniência) e UX-P8 (`:274`, trocar visualização não altera estado
   canônico). Se algum deles sobreviver, o que ficou sem guarda não é um
   detalhe desta demanda: é uma promessa selada da fase 5.0.

   `M13` é o mais direto: ele faz o escalonamento ESCREVER no estado canônico.
   O contrato é função pura justamente para que esse ataque tenha um carrasco.
   ============================================================================ */

const path = require("path"), fs = require("fs");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const P = f => path.join(HERE, f);

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";

const F = {
  ondas: P("ui_ondas_v32.js"),          /* a decisão — função pura */
  papel: P("ui_v32.js"),                /* a apresentação (§29.4) */
  apoio: P("ui_p52_support_v32.js")     /* a visão por produto */
};

const CMD = "node tests_022_escalonamento.js";
const PY = process.env.D022_PYTHON || "python";

const MUTANTS = [
  { id: "D022-M1", file: F.ondas, gate: "D022-TETO1", cmd: CMD,
    desc: "teto constante 3 — a régua deixa de governar e o estágio vira decoração",
    find: "      if (overall >= bands[i].from && overall < bands[i].to) return Math.max(1, i);",
    repl: "      if (overall >= bands[i].from && overall < bands[i].to) return 3;",
    reason: /teto \d+ × esperado \d+/ },

  { id: "D022-M2", file: F.ondas, gate: "D022-PRIO1", cmd: CMD,
    desc: "o teto passa a cortar a prioridade declarada — o produto desfazendo a escolha do cliente",
    find: "      if (ehGap[qid] && primeira.indexOf(qid) < 0) primeira.push(qid);",
    repl: "      if (ehGap[qid] && primeira.indexOf(qid) < 0 && primeira.length < 2) primeira.push(qid);",
    reason: /prioridade declarada fora da primeira onda/ },

  { id: "D022-M3", file: F.ondas, gate: "D022-TENS1", cmd: CMD,
    desc: "a tensão some: três prioridades sob teto dois e o relatório cala",
    find: "    var tensao = (prioridades.length > teto)",
    repl: "    var tensao = (false)",
    reason: /`tensao` ausente|não traz nó de tensão/ },

  { id: "D022-M4", file: F.ondas, gate: "D022-SUFI1", cmd: CMD,
    desc: "escalonar sem suficiência — teto derivado de número que não existe",
    find: "    if (!suff || overall === null) {",
    repl: "    if (false) {",
    reason: /sem suficiência|teto .* deveria ser null|não traz nó declarando a ausência/ },

  { id: "D022-M5", file: F.ondas, gate: "D022-COB1", cmd: CMD,
    desc: "o excedente é DESCARTADO em vez de virar onda seguinte — o gap some do relatório",
    find: "    var seguintes = elegiveis.map(function (f) { return f.id; })\n      .filter(function (q) { return primeira.indexOf(q) < 0; });\n\n    /* (6) TENSÃO",
    repl: "    var seguintes = [];\n\n    /* (6) TENSÃO",
    reason: /união ≠ cobertura da 021|sumiram/ },

  { id: "D022-M6", file: F.papel, gate: "D022-CRIT1", cmd: CMD,
    desc: "a onda seguinte é rotulada sem dizer POR QUE — rótulo sem critério é carimbo",
    find: "const criterio = r.teto === null",
    repl: "const criterio = true ? \"Estas ficam para depois.\" : r.teto === null",
    reason: /não cita o teto|não cita o estágio/ },

  { id: "D022-M7", file: F.ondas, gate: "D022-ALVO1", cmd: CMD,
    desc: "excluir em SILÊNCIO: a prática sai do enquadramento sem motivo declarado",
    find: "        excluidas.push({ qid: f.id, motivo: MOTIVO_ALVO });",
    repl: "        excluidas.push({ qid: f.id, motivo: \"\" });",
    reason: /exclusão sem motivo declarado/ },

  { id: "D022-M8", file: F.ondas, gate: "D022-ALVO2", cmd: CMD,
    desc: "o cenário-alvo AUMENTA o teto — declarar destino viraria licença para abrir mais frentes",
    find: "    var vagas = Math.max(0, teto - primeira.length);",
    repl: "    var vagas = Math.max(0, teto + Object.keys(alvos).length - primeira.length);",
    reason: /abriu frente nova|mexeu no teto/ },

  { id: "D022-M9", file: F.papel, gate: "D022-PAP1", cmd: CMD,
    desc: "a onda existe só na tela — o PDF, que é o que chega ao cliente, sai sem ela",
    find: "  h += qs22OndasHTML();",
    repl: "  h += \"\";",
    reason: /não traz a primeira onda|papel × contrato divergem/ },

  { id: "D022-M10", file: F.apoio, gate: "D022-PROD1", cmd: CMD,
    desc: "a fusão guarda só a PRIMEIRA capability — a alavancagem do produto multi-necessidade some",
    find: "            if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);",
    repl: "            if (capNome && !reg2.caps.length) reg2.caps.push(capNome);",
    /* REASON ATUALIZADO em 2026-09-29. O `D022-PROD1` foi FORTALECIDO depois da
       primeira campanha — a alínea (c) passou a olhar o produto POR SINAL, e
       com isso a mensagem mudou. O mutante segue atacando a MESMA propriedade
       (a fusão guarda só a primeira capability); o que se atualiza é a agulha
       com que se confere o motivo, nunca o ataque. Deixar o regex velho faria o
       mutante sair SOBREVIVENTE "por motivo diferente" — âncora podre na metade
       que ninguém olha, que foi exatamente o que a segunda campanha mostrou. */
    reason: /habilitado por sinal traz .* capability|a fusão tem de trazer as duas/ },

  { id: "D022-M11", file: F.papel, gate: "D022-A11Y1", cmd: CMD,
    desc: "a onda passa a se distinguir só por classe de cor — viola a UX-P7 da spec selada",
    find: "<div class=\"qs22-rot\" data-qs22-rotulo>Primeira onda — o que atacar agora</div>",
    repl: "<div class=\"qs22-rot qs22-cor-primeira\"></div>",
    reason: /sem rótulo textual próprio|sem texto algum/ },

  { id: "D022-M12", file: F.papel, gate: "D022-PROV1", cmd: CMD,
    desc: "a onda perde a proveniência — visão derivada que não diz de que deriva (UX-P6 selada)",
    find: "<div class=\"qs22-onda\" data-qs22-onda=\"primeira\" data-qs22-prov=\"${escAttr(prov)}\">",
    repl: "<div class=\"qs22-onda\" data-qs22-onda=\"primeira\">",
    reason: /onda sem proveniência declarada/ },

  { id: "D022-M13", file: F.ondas, gate: "D022-INV1", cmd: CMD,
    desc: "escalonar ESCREVE no estado canônico — a visão derivada mexendo na fonte (UX-P8 selada)",
    find: "      teto: teto, estagio: estagio,",
    repl: "      teto: (businessPriority.add(\"mandate\"), teto), estagio: estagio,",
    reason: /o estado canônico mudou ao escalonar/ }
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
    harness: "d022",
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
  process.stderr.write("PREFLIGHT d022 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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
    const efemero = path.join(require("os").tmpdir(), "d022-" + m.id + ".html");
    const precisaBuild = (m.file === F.papel || m.file === F.ondas || m.file === F.apoio);
    if (precisaBuild) {
      const build = construir(efemero);
      if (!build.ok) { estado = NAO_EXECUTADO; causa = CAUSA.rebuild + ": " + build.why; }
    }
    if (!estado) {
      let saida = "", falhou = false;
      try {
        const env = Object.assign({}, process.env);
        if (precisaBuild) env.D022_HTML_OVERRIDE = efemero;
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
console.log("\nD022 MUTATION: " + cont[DETECTADO] + " DETECTADO · " + cont[SOBREVIVENTE] +
            " SOBREVIVENTE · " + cont[NAO_EXECUTADO] + " NÃO EXECUTADO de " + linhas.length);
process.exit((cont[SOBREVIVENTE] || cont[NAO_EXECUTADO]) ? 1 : 0);
