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
   `ocorrencias=0` sem ninguém ver.

   **E o EA-4 me pegou aqui, na W3.** O rename `offerings` → `decisions` deixou
   as âncoras de M1, M2 e M3 AMBÍGUAS (5, 8 e 4 ocorrências): os três saíram
   `NÃO EXECUTADO` com o alvo já existindo. A regra `ocorrencias == 1` não é
   burocracia — foi ela que denunciou, e é por isso que ela nunca vira aviso.
   Reancorados em trechos únicos, e o critério de unicidade passou a ser
   conferido também sobre ESTE arquivo quando eu o edito.

   **E aí a campanha cobrou o preço certo.** Com âncoras boas, M1 e M2 saíram
   SOBREVIVENTES — e a culpa não era deles: o `D019-CUR1` olhava um estado
   intocado e o `D019-CUR2` só conferia que o relatório não estava vazio. Dois
   gates prometendo mais do que mediam, a família do `EA-20`, de novo nesta
   demanda. Os gates ganharam alínea (o CUR1 TENTA redigir e exige recusa; o
   CUR2 compara publicado×ofertado na ponte) e os mutantes passaram a atacar o
   ponto que quebra de verdade: a validação do enum, e a conversão de `missing`
   em exclusão. Nada foi afrouxado — os dois gates ficaram maiores. Quando cada wave entregar seu módulo, o
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
    find: 'if (ENUM.indexOf(valor) < 0) return "valor fora do enum fechado: " + String(valor);',
    repl: 'if (false) return "valor fora do enum fechado: " + String(valor);',
    reason: /ACEITOU texto livre|texto longo/ },

  { id: "D019-M2", file: F.estado, gate: "D019-CUR2",
    desc: "fazer ausência de curadoria significar 'excluir tudo'",
    find: 'return ofertados().indexOf(id) >= 0 ? "include" : "exclude";', repl: 'return "exclude";',
    reason: /ausência virou supressão|missing/ },

  { id: "D019-M3", file: F.sessao, gate: "D019-INV8",
    desc: "serializar junto a lista de recomendações resultante — derivado como fonte de verdade",
    find: "out.reportCuration = cur;", repl: "out.reportCuration_derivado = cur;",
    reason: /inputs canônicos|campo derivado/ },

  { id: "D019-M4", file: F.papel, gate: "D019-PROV1",
    desc: "remover a proveniência SÓ NO PAPEL — o modo real de as duas superfícies divergirem",
    find: 'data-p53-prov', repl: 'data-p53-prov-removido',
    reason: /proveniência ausente no PAPEL/ },

  { id: "D019-M5", file: F.solucao, gate: "D019-MED1",
    desc: "deixar a curadoria filtrar a lista de findings — alcançar MEDIÇÃO",
    find: "decisions", repl: "findings",
    reason: /alterou derivado|não podem mudar/ },

  { id: "D019-M6", file: F.solucao, gate: "D019-SOL1",
    desc: "descartar produto que só aparece como menção curta — perda que o olho não procura",
    find: 'minis[j].querySelector("b")', repl: 'minis[j].querySelector("b-inexistente")',
    reason: /SUMIU na visão por solução/ },
  /* O M6 foi o mutante mais caro desta demanda, e valeu cada rodada: ele saiu
     SOBREVIVENTE com âncora boa, e o culpado era o oráculo do `D019-SOL1`, que
     media o DOM consolidado contra ele mesmo. Na sessão de referência todo
     produto tem um `.prod` completo, então perder as menções curtas não perde
     PRODUTO — perde o par (produto × capability). Sem medir o par, esta perda é
     literalmente invisível, que é a definição do que o M6 existe para atacar. */

  /* [W4] O ATAQUE MUDOU, e a razão fica escrita. A spec descrevia o M7 como
     "descartar em silêncio o produto sem categoria conhecida" — mas na sessão
     de referência NENHUM produto é sem categoria: os 13 do catálogo têm grupo
     no portfólio. O mutante original seria INERTE, e mutante inerte é pior que
     mutante nenhum, porque vira confiança falsa.

     O que o C7 enuncia — "o desconhecido é NOMEADO" — vale para qualquer
     grupo: agrupar sem dizer o nome do grupo é descartar em silêncio a própria
     classificação. É esse o descarte que este mutante passa a atacar, e ele
     ACONTECE na sessão de referência. A cláusula do balde `nao-classificado`
     continua no gate, declaradamente condicional. */
  { id: "D019-M7", file: F.solucao, gate: "D019-SOL2",
    desc: "agrupar sem nomear o grupo — descarte silencioso da classificação",
    find: '"data-p53-sol-grupo-nome": grupo', repl: '"data-p53-sol-grupo-nome-removido": grupo',
    reason: /não se nomeiam|não se nomeia/ },

  { id: "D019-M8", file: F.papel, gate: "D019-PAR1",
    desc: "aplicar a curadoria só na tela — o papel volta a publicar tudo",
    find: "__CURATION", repl: "__CURATION_ignorado",
    reason: /divergência tela×papel/ },

  /* [W5] O M9 mudou de ARQUIVO, não de ataque. Quem declara a supressão é o
     dono da apresentação (`ui_p52_support_v32.js`), não o editor: o editor
     decide, a apresentação publica. Apontá-lo para o editor o deixaria
     `ocorrencias=0` para sempre — NÃO EXECUTADO eterno com cara de campanha
     incompleta, que é o modo de falha do EA-4. */
  { id: "D019-M9", file: F.solucao, gate: "D019-VAZ1",
    desc: "renderizar seção vazia quando a curadoria suprime tudo",
    find: '"data-p53-suprimido": String(suprimidos)', repl: '"data-p53-suprimido-removido": String(suprimidos)',
    reason: /vazia e muda|DESAPARECEU/ },

  /* [W5] O M10 foi reancorado no predicado, e não na palavra `blocked`: o
     editor pergunta se o gate está `released`, não se está `blocked`. Ancorar
     na palavra do enum oposto era ancorar no vocabulário de outro módulo. */
  { id: "D019-M10", file: F.editor, gate: "D019-SUF1",
    desc: "oferecer curadoria com o resultado bloqueado",
    find: 'return !res || res.getAttribute("data-p50-gate") !== "released";', repl: 'return false;',
    reason: /resultado bloqueado/ },

  /* [T012] O mutante da REANCORAGEM. Ele não ataca o produto: ataca o critério
     que eu mesmo acabei de mexer. Ressuscita a lista de CINCO chaves e exige que
     o `S4-S5` reprove — se ele ficasse verde com a lista antiga, a alínea (b)
     não estaria discriminando coisa alguma e a reancoragem teria sido só uma
     permissão a mais. Roda a suíte de SESSÃO, não a da 019, e por isso não
     reconstrói o HTML: a mutação é no arquivo de teste, não numa fonte. */
  { id: "D019-M11", file: F.gateSes, gate: "S4-S5",
    desc: "ressuscitar a lista de cinco chaves — provar que a reancoragem do S4-S5 ainda discrimina",
    find: 'CANONICAS.concat(["reportCuration"])', repl: 'CANONICAS',
    suite: "tests_session_m48.js", nodeArgs: ["--max-old-space-size=4608"], skipBuild: true,
    reason: /FAIL {2}S4-S5/ }
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

/* A suíte julgadora é parametrizável porque o M11 é julgado pela suíte de
   SESSÃO. Sem isso, ele teria de virar um gate da 019 que reimplementa o S4-S5 —
   duas verdades sobre a mesma regra, e uma delas envelheceria. */
function rodarGate(m, htmlPath) {
  const suite = m.suite || "tests_019_curadoria.js";
  const args = (m.nodeArgs || []).concat([path.join(HERE, suite)]);
  const env = Object.assign({}, process.env);
  if (!m.suite) { env.D019_ONLY = m.gate; env.D019_HTML_OVERRIDE = htmlPath; }
  try {
    const out = execFileSync(process.argv[0], args, { cwd: HERE, encoding: "utf8", env });
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
    if (!m.skipBuild) {
      const build = construir(efemero);
      if (!build.ok) {
        estado = NAO_EXECUTADO;
        causa = "build sob mutação falhou: " + build.why;
        throw new SaltoControlado();
      }
    }
    const r = rodarGate(m, efemero);
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
