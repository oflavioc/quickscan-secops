/* ============================================================================
   TESTES D023 · LEITURA ÚNICA DO APOIO (jsdom)
   demanda 023-leitura-unica-do-apoio · namespace exclusivo D023-*
   Não continua numeração de fase alheia e não vive em arquivo de outra fase
   (R10 §1). Sem Chromium: nenhum gate aqui mede geometria.

   ONDE ESTA SUÍTE É EXECUTADA
   ---------------------------------------------------------------------------
   Stage `suites` do `pipeline.yaml` → `check_suites.py`, chave `d023` de
   `expected_suites.json`. Registro e execução entram no mesmo PR (R10 §3).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os 9 critérios de `specs/023-leitura-unica-do-apoio/spec.md`: a leitura
   congelada some quando existe substituto PUBLICADO, e volta quando ele deixa
   de existir — inclusive quando é o operador que o remove.

   ==========================================================================
   TRÊS COISAS QUE A FASE 4 MEDIU E A SPEC NÃO SABIA
   ==========================================================================
   Escrever o gate obrigou a medir o sujeito dele, e o sujeito não era o que a
   Fase 0 descreveu. As três ficam aqui porque são o motivo da forma dos gates,
   e estão registradas no `relatorio-final.md` da demanda como achados da Fase 4.

   1 · "SEM CONTEXTO DECLARADO" SÃO DOIS MUNDOS, E O PREDICADO SÓ ALCANÇAVA UM.
       Sessão em que NADA foi declarado — nem landscape, nem arquitetura, nem
       sinal, nem plataforma — é MODO LEGADO (`engine_v32.js:305`). Ali
       `renderBlocks` toma o ramo legado e chama
       `hideLegacyRecommendation(app, false)` INCONDICIONALMENTE: o predicado
       não é consultado, e alargá-lo não mudaria nada. Medido:

         nada declarado      | legado=true  | hasSub=false | 0 ocultos | 11 cards
         só `saasAllowed=yes`| legado=false | hasSub=false | 0 ocultos | 11 cards
         capability `NONE`   | legado=false | hasSub=true  | 3 ocultos | 11 cards

       A redundância do relato existe nas DUAS primeiras linhas, e o
       proprietário confirmou em 2026-10-02 que a sessão real era a PRIMEIRA —
       a spec como estava não corrigiria o caso relatado. ERRATA `E1`: o modo
       legado entra no escopo (rota B, decisão do proprietário no chat). O
       `D023-OCU1` passa a medir os DOIS mundos, nominalmente, e o `D023-LEG1`
       troca de sujeito: em modo legado a arbitragem atravessa, e NADA MAIS.

       O preço está medido na errata `E1` da spec, e é maior do que o da spec
       original: sob o predicado novo as CINCO fixtures da 010 têm substituto, e
       um TERCEIRO oráculo alheio — a alínea (c) do `D019-CTX1` — tem de ser
       emendado, porque ele afirma que a `fronteira()` não existe em modo legado
       e a fixture de controle dele publica 11 produtos.

   2 · OS CARDS POR PRODUTO SÃO `.apoio-block` CONTÍGUOS AO TÍTULO CONGELADO —
       MAS NÃO SÃO OCULTADOS COM ELE, e a primeira redação desta nota afirmava o
       contrário.

       O fato: no escopo de apoio, sem contexto declarado, logo depois da
       `.t-list` congelada vêm os ONZE `.apoio-block.p53-sol-card`, e
       `.apoio-block` é classe permitida na varredura de
       `hideLegacyRecommendation`. Daí eu concluí — e escrevi na errata `E3` da
       spec — que ligar a arbitragem ocultaria os cards junto com a lista.

       MEDIDO, É FALSO. Com o mutante `D023-M2` (que remove a `fronteira()`) o
       artefato foi reconstruído e sondado em três renders consecutivos, nas duas
       fixtures: `cards=11 ocultos=0` em todas as seis medições. A ocultação não
       os alcança porque o decorador da 5.2 REPÕE os cards depois da varredura, e
       `colocar()` nunca devolve nó com `v32-hidden`.

       O que a `fronteira()` protege, então, é o CENSO — exatamente o que o
       comentário do autor dela diz (`ui_p52_support_v32.js:617-638`): ela encerra
       a contagem antes dos cards para que o grupo contíguo não seja lido como
       meio oculto e meio visível. É oráculo, não apresentação. Por isso o
       carrasco do `D023-M2` é o `D019-CTX1`, da demanda que a introduziu, e não
       um gate desta.

       O `D023-OCU1` continua medindo as DUAS metades — lista oculta E cards
       visíveis — e isso continua certo: um gate que só medisse a primeira
       passaria com a seção vazia, e a hipótese ter sido falsa não torna a
       asserção desnecessária.

   3 · A CAMADA 1 NUNCA É IMPRESSA, ENTÃO O PAPEL NÃO PODE MEDIR OCULTAÇÃO.
       Medido: ZERO dos três títulos de `HIDE_EYEBROWS` aparecem em
       `#v32-print-report`, em qualquer das oito fixtures. É desenho selado da
       010 (C13, `afirmaPreservacao` falsy em todo sítio de `buildPrintReport`).
       A redação da spec para o C6 — "tudo de C1–C4 medido no relatório" — é
       portanto INALCANÇÁVEL ao pé da letra, e um gate escrito assim fecharia
       verde por ausência de sujeito, que é o `EA-20` do lado de dentro.
       O `D023-PAP1` mede o que o papel CARREGA: coerência entre o conjunto
       publicado e os cards impressos, mais o aviso de supressão. O que ele não
       pode medir fica DECLARADO na própria alínea, nunca implícito.

   ==========================================================================
   POR QUE OITO DOS NOVE NASCEM VERDES, E ISSO É DECLARADO
   ==========================================================================
   Esta demanda muda UMA expressão booleana. O vermelho de nascença é o
   `D023-OCU1`, que é o critério do relato. Os outros oito são guardas: medem
   que a mudança não quebra o que já vale (`REG1`, `ARB1`, `DOM1`, `LEG1`,
   `BND1`) ou que o sujeito dos gates da 010 continua alcançável (`SUP1`,
   `SUJ1`, `PAP1`). Guarda que nasce verde tem o poder no MUTANTE, não no red —
   e os oito estão pareados em `tests_023_mutants.js` (W2). Declarar isso é o
   contrário de esconder: red fino com oito verdes é exatamente o perfil em que
   uma campanha fraca passaria despercebida.

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE
   ==========================================================================
   Alínea que depende de caso DECLARA a pré-condição e falha NOMEANDO o estado,
   nunca fecha verde por ausência de sujeito (lição do `D010-INV7`/`EA-11`).
   ========================================================================== */

"use strict";

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { JSDOM } = require("jsdom");
const FX010 = require("./fixtures_010_vao.js");

const HERE = __dirname;
const HTML_PATH = process.env.D023_HTML_OVERRIDE ||
  path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D023-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD023 LEITURA ÚNICA: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const results = [];
const ONLY = (process.env.D023_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, extra = "";
  try { ok = !!fn(); } catch (e) { ok = false; extra = " [" + e.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + extra);
}
function vac(alinea, porque) { throw new Error("VÁCUO em " + alinea + ": " + porque); }

const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const qa = (n, s) => Array.from(n.querySelectorAll(s));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

/* Os três títulos congelados, lidos do MESMO lugar que a demanda 010 já
   declara — nunca transcritos para cá (cópia literal é a classe de defeito que
   esta base de código já pagou seis vezes). */
const HIDE = FX010.D010_HIDE_EYEBROWS;
if (!Array.isArray(HIDE) || HIDE.length !== 3)
  throw new Error("`FX010.D010_HIDE_EYEBROWS` deixou de ser a lista de três títulos congelados");

/* ==========================================================================
   AS CINCO FIXTURES DA §Comportamento, nomeadas.
   Todo estado é aplicado pelos owners reais do runtime (`__DEV`), nunca
   escrito à mão em derivado.
   ========================================================================== */
const F = {
  /* F1 · o sujeito ALCANÇÁVEL do relato: fora do modo legado, nenhuma
     capability com contexto, gaps presentes, produto publicado. */
  F1: { nome: "sem contexto de capability, fora do legado", arch: { saasAllowed: "yes" } },
  /* F2 · contexto de capability declarado — o caso que não pode piorar. */
  F2: { nome: "com contexto declarado", presence: { "endpoint-detection": "NONE" } },
  /* F3 · F1 com a curadoria suprimindo TUDO: o substituto deixa de existir
     por decisão do operador. */
  F3: { nome: "substituto suprimido pela curadoria", arch: { saasAllowed: "yes" }, suprimirTudo: true },
  /* F4 · sem gap algum: não há recomendação legada a esconder nem produto. */
  F4: { nome: "sem gap algum", nivel: 3, prios: [], arch: { saasAllowed: "yes" } },
  /* F5 · MODO LEGADO COM PRODUTO PUBLICADO — o caso do relato (errata `E1`).
     Nada declarado: nem landscape, nem arquitetura, nem sinal, nem plataforma.
     Medido: legado=true, offered=11, published=11. */
  F5: { nome: "modo legado COM produto publicado (o caso do relato)", prios: [] },
  /* F6 · modo legado SEM produto: nível 3 em tudo, sem prioridade declarada.
     Medido: legado=true, offered=0. É o sujeito do `D023-LEG1` depois de `E1`. */
  F6: { nome: "modo legado sem produto publicado", nivel: 3, prios: [] },
  /* F7 · modo legado com a curadoria suprimindo tudo: o substituto existia e o
     operador o desfez, no mundo em que a V3.2 não governava nada. */
  F7: { nome: "modo legado com substituto suprimido", prios: [], suprimirTudo: true },
  /* F8 · contexto declarado E curadoria suprimindo tudo. Existe para medir que a
     segunda fonte é ADITIVA e não substitutiva: aqui a visão por produto está
     vazia e o substituto continua existindo, pelos cards de capability. Sem esta
     fixture, um defeito que TROCASSE a cláusula de capability pela de produto
     publicado passaria por todos os outros gates — foi a campanha que cobrou. */
  F8: { nome: "contexto declarado com a visão por produto suprimida",
        presence: { "endpoint-detection": "NONE" }, suprimirTudo: true }
};

function boot(fx, opts) {
  const o = Object.assign({}, fx, opts || {});
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  w.__DEV.setArq(0);
  const V = w.__DEV.V32;
  w.eval("QS.map(q=>q.id)").forEach(id => w.__DEV.setAnswerById(id, ("nivel" in o) ? o.nivel : 1));
  if (o.niveis) Object.keys(o.niveis).forEach(id => w.__DEV.setAnswerById(id, o.niveis[id]));
  if (o.arch) Object.keys(o.arch).forEach(k => { V.ARCHITECTURE_CONTEXT[k] = o.arch[k]; });
  if (o.presence) Object.keys(o.presence).forEach(c => {
    if (!V.TECH_LANDSCAPE[c]) vac("fixture", "capability fora do landscape: " + c);
    V.TECH_LANDSCAPE[c].presence = o.presence[c];
  });
  w.__DEV.setPriorities("prios" in o ? o.prios : ["endpoint", "logs", "network-visibility"]);
  w.__DEV.showResults();
  if (o.suprimirTudo) {
    const C = curadoria(w);
    const off = C.offered();
    if (!off.length) vac("fixture", "nada ofertado — não há o que suprimir, e a fixture perderia o sujeito");
    off.forEach(id => C.set(id, "exclude"));
    w.__DEV.showResults();
  }
  return { w, d };
}

function curadoria(w) {
  if (!w.__CURATION || !w.__CURATION.__installed)
    throw new Error("`__CURATION` ausente — o contrato que a spec §Contratos nomeia não existe");
  return w.__CURATION;
}

/* `published()` é a DEFINIÇÃO de "publicado" que a spec adota (C3), então ele é
   a fonte declarada, não uma reimplementação a conferir. O que o oráculo NÃO
   faz é ler do produto o VEREDITO da arbitragem: quem lê o produto para julgar
   o produto não julga nada. */
const publicados = w => curadoria(w).published();

/* ==========================================================================
   O PREDICADO NOVO, da spec §Comportamento, em UMA peça.
   A cláusula de capability vem do oráculo que a demanda 010 já mantém
   (`d010HasSubstitute`) — uma cópia no repositório, não duas (`EA-76`). A
   cláusula de produto publicado é a disjunção que esta demanda acrescenta.
   Depois da T003, o primeiro termo passa a ser o predicado inteiro e a
   disjunção vira idempotente por construção: continua verdadeira, e continua
   sem segunda cópia.
   ========================================================================== */
function d023Substituto(w) {
  return FX010.d010HasSubstitute(w) || publicados(w).length > 0;
}

/* ==========================================================================
   CENSO DA CAMADA 1 — fiel à regra de `hideLegacyRecommendation`, e não a uma
   consulta por seletor.
   A varredura é por FILHOS DO ESCOPO, em ordem: um título de `HIDE_EYEBROWS`
   liga o grupo; os nós permitidos contíguos (`apoio-block`/`t-list`/
   `t-details`) entram nele; o primeiro nó NÃO permitido — ou `#v32panel` —
   fecha o grupo. É a mesma regra do produto porque é a regra que a alínea de
   tudo-ou-nada julga; um censo por `querySelectorAll` mediria grupos que a
   regra não forma.
   Cada bloco declara se é card de produto V3.2 (`data-p53-sol-produto`), que é
   a distinção sem a qual o `D023-OCU1` não sabe o que deveria estar visível.
   ========================================================================== */
function censo(d) {
  const screen = d.querySelector("section.screen");
  if (!screen) return [];
  const scope = screen.querySelector('[data-p52-legacy-scope="support"]') || screen;
  const out = [];
  let grupo = null;
  Array.from(scope.children).forEach(n => {
    if (n.id === "v32panel") { grupo = null; return; }
    const cl = n.classList;
    if (!cl) return;
    if (cl.contains("section-title")) {
      const eb = n.querySelector(".eyebrow");
      const t = eb ? txt(eb) : "";
      grupo = HIDE.indexOf(t) >= 0 ? t : null;
      if (grupo) out.push({ tipo: "titulo", grupo, chave: t, oculto: cl.contains("v32-hidden"), produto: null });
      return;
    }
    const permitido = cl.contains("apoio-block") || cl.contains("t-list") || cl.contains("t-details");
    if (grupo && permitido) out.push({
      tipo: "bloco", grupo,
      chave: grupo + "/" + (n.className || "").toString().split(" ")[0],
      oculto: cl.contains("v32-hidden"),
      produto: n.getAttribute("data-p53-sol-produto")
    });
    else if (grupo && !permitido) grupo = null;
  });
  return out;
}

/* Cards da TELA. O filtro por `#v32-print-report` não é zelo: depois do
   `beforeprint` o relatório impresso vive no mesmo documento e também emite
   `data-p53-sol-produto` — medido na Fase 4, onde a primeira redação desta
   função contou 22 cards na tela e o `D023-PAP1` acusou uma divergência que era
   do oráculo, não do produto. */
const cardsProduto = d => qa(d, "[data-p53-sol-produto]")
  .filter(c => !c.closest("#v32-print-report"));
const cardsProdutoOcultos = d => cardsProduto(d).filter(c => c.classList.contains("v32-hidden"));

function papel(w, d) {
  w.dispatchEvent(new w.Event("beforeprint"));
  const rel = d.getElementById("v32-print-report");
  if (!rel) vac("pré-condição", "`#v32-print-report` não existe após `beforeprint`");
  return rel;
}

/* ========================================================================== */

T("D023-OCU1", "C1 · com produto publicado a congelada é oculta e os cards ficam — nos DOIS mundos (errata E1)", () => {
  /* AS DUAS ALÍNEAS SÃO OS DOIS MUNDOS da nota 1 do cabeçalho, e a (a) é a do
     relato. Medir só uma deixaria passar exatamente o defeito que o
     proprietário viu: `legadoEsperado` é parte da pré-condição, nominalmente,
     para que uma fixture que escorregue de modo não passe por engano. */
  const erros = [];
  [["(a) modo legado", F.F5, true], ["(b) fora do legado", F.F1, false]].forEach(par => {
    const nome = par[0], fx = par[1], legadoEsperado = par[2];
    const { w, d } = boot(fx);
    if (w.__DEV.V32.isLegacyModeV32() !== legadoEsperado)
      vac(nome, "a fixture não está no modo que a alínea mede · esperado legado=" + legadoEsperado);
    const pub = publicados(w);
    if (!pub.length)
      vac(nome, "nenhum produto publicado — sem substituto não há o que arbitrar");
    if (d023Substituto(w) !== true)
      vac(nome, "o predicado da spec §Comportamento não vê substituto nesta fixture");
    const c1 = censo(d);
    if (!c1.length) vac(nome, "nenhum título de HIDE_EYEBROWS presente na tela");
    /* a leitura congelada SAI */
    const congeladosVisiveis = c1.filter(x => !x.produto && !x.oculto).map(x => x.chave);
    if (congeladosVisiveis.length)
      erros.push(nome + " · leitura congelada AINDA VISÍVEL: " + JSON.stringify(congeladosVisiveis));
    /* e a leitura que FICA é a dos cards — medida na MESMA passagem, porque
       ocultar a lista e levar os cards junto satisfaria a primeira metade com a
       seção vazia. É a nota 2 do cabeçalho: os cards são `.apoio-block`
       contíguos ao título, e `.apoio-block` é classe permitida na varredura. */
    const todos = cardsProduto(d), ocultos = cardsProdutoOcultos(d);
    if (!todos.length)
      erros.push(nome + " · nenhum card por produto na tela — a leitura que deveria ficar não existe");
    if (ocultos.length)
      erros.push(nome + " · cards por produto OCULTOS junto com a congelada: " +
        JSON.stringify(ocultos.map(c => c.getAttribute("data-p53-sol-produto"))));
    if (todos.length !== pub.length)
      erros.push(nome + " · cards na tela (" + todos.length + ") ≠ publicados pela curadoria (" + pub.length + ")");
    /* e o mesmo depois de UMA SEGUNDA passagem de render. A fronteira que
       protege os cards é inserida por `arbitragemEmCurso()`, que LÊ o DOM já
       arbitrado; e o ramo de idempotência do decorador reaproveita os cards que
       já existem. Medir só a primeira passagem deixaria passar o estado em que a
       segunda volta com os cards ocultos. */
    w.__DEV.showResults();
    const congVis2 = censo(d).filter(x => !x.produto && !x.oculto).map(x => x.chave);
    const oc2 = cardsProdutoOcultos(d);
    if (congVis2.length)
      erros.push(nome + " · após re-render, leitura congelada VISÍVEL de novo: " + JSON.stringify(congVis2));
    if (oc2.length)
      erros.push(nome + " · após re-render, cards por produto OCULTOS: " +
        JSON.stringify(oc2.map(c => c.getAttribute("data-p53-sol-produto"))));
  });
  if (erros.length) throw new Error(erros.join(" | "));
  return true;
});

T("D023-REG1", "C2 · nada piora com contexto declarado (censo e cards idênticos aos de hoje)", () => {
  const { w, d } = boot(F.F2);
  if (w.__DEV.V32.isLegacyModeV32() !== false)
    vac("(a)", "a fixture de contexto declarado caiu em modo legado");
  if (FX010.d010HasSubstitute(w) !== true)
    vac("(a)", "a cláusula de capability da 010 não vê substituto com contexto declarado — a fixture perdeu a propriedade que a define");
  const c = censo(d);
  const congelados = c.filter(x => !x.produto);
  if (!congelados.length) vac("(b)", "nenhum nó congelado no censo");
  /* (b) toda a região congelada OCULTA, como hoje */
  const vis = congelados.filter(x => !x.oculto).map(x => x.chave);
  if (vis.length) throw new Error("região congelada VISÍVEL com contexto declarado: " + JSON.stringify(vis));
  /* (c) e os cards intactos: todos os publicados, nenhum oculto */
  const pub = publicados(w), todos = cardsProduto(d);
  if (todos.length !== pub.length)
    throw new Error("cards na tela (" + todos.length + ") ≠ publicados (" + pub.length + ")");
  const oc = cardsProdutoOcultos(d);
  if (oc.length) throw new Error("cards por produto ocultos com contexto declarado: " +
    JSON.stringify(oc.map(x => x.getAttribute("data-p53-sol-produto"))));
  /* (d) A SEGUNDA FONTE É ADITIVA, NÃO SUBSTITUTIVA. Com contexto declarado e a
     visão por produto SUPRIMIDA, o substituto continua existindo — pelos cards
     de capability, que são a fonte original do predicado. Um defeito que trocasse
     uma cláusula pela outra devolveria a Camada 1 aqui, com os cards de
     capability na tela: duas leituras de novo, e nenhum outro gate desta suíte
     veria. A alínea nasceu porque a campanha cobrou (`D023-M2b`). */
  const F8 = boot(F.F8);
  if (publicados(F8.w).length !== 0)
    vac("(d)", "a supressão não esvaziou a publicação na fixture de contexto declarado");
  const sup = F8.d.getElementById("v32support");
  if (!sup || !qa(sup, ".v32-card").length)
    vac("(d)", "`#v32support` sem card de capability — a cláusula original do predicado não tem sujeito aqui");
  const congF8 = censo(F8.d).filter(x => !x.produto);
  if (!congF8.length) vac("(d)", "nenhum nó congelado presente");
  const visF8 = congF8.filter(x => !x.oculto).map(x => x.chave);
  if (visF8.length)
    throw new Error("com contexto declarado e visão por produto suprimida a Camada 1 VOLTOU, " +
      "embora os cards de capability continuem na tela — a segunda fonte substituiu a primeira " +
      "em vez de somar: " + JSON.stringify(visF8));
  return true;
});

T("D023-SUP1", "C3 · curadoria suprime tudo ⇒ sem substituto ⇒ a congelada volta VISÍVEL", () => {
  const { w, d } = boot(F.F3);
  /* (a) pré-condição: a supressão de fato esvaziou a publicação */
  const C = curadoria(w);
  if (!C.offered().length) vac("(a)", "nada ofertado — a supressão não tem sujeito");
  if (publicados(w).length !== 0)
    vac("(a)", "a curadoria não esvaziou a publicação: " + publicados(w).length + " publicado(s)");
  if (d023Substituto(w) !== false)
    vac("(a)", "o predicado da spec ainda vê substituto com tudo suprimido — não é este o cenário");
  /* (b) zero cards por produto */
  const todos = cardsProduto(d);
  if (todos.length) throw new Error("há " + todos.length + " card(s) por produto com tudo suprimido: " +
    JSON.stringify(todos.map(x => x.getAttribute("data-p53-sol-produto"))));
  /* (c) a Camada 1 VISÍVEL — o vão que a 010 existe para impedir, do lado certo */
  const congelados = censo(d).filter(x => !x.produto);
  if (!congelados.length) vac("(c)", "nenhum nó congelado presente — não há leitura a devolver");
  const oc = congelados.filter(x => x.oculto).map(x => x.chave);
  if (oc.length) throw new Error("Camada 1 OCULTA sem substituto algum — o vão da 010 de volta: " + JSON.stringify(oc));
  /* (d) e a supressão se DECLARA, com a contagem */
  const aviso = d.querySelector("[data-p53-suprimido]");
  if (!aviso) throw new Error("`[data-p53-suprimido]` ausente — a supressão não é declarada ao leitor");
  const n = parseInt(aviso.getAttribute("data-p53-suprimido"), 10);
  if (!(n > 0)) throw new Error("aviso de supressão com contagem inválida: " +
    JSON.stringify(aviso.getAttribute("data-p53-suprimido")));
  return true;
});

T("D023-ARB1", "C4 · tudo-ou-nada: o grupo congelado é ∅ ou INTEIRO, nunca parcial, nas oito fixtures", () => {
  const parciais = [];
  /* A CONTA DE GRUPOS MEDIDOS EXISTE PORQUE SEM ELA O GATE É VACUOSO: se as
     oito fixtures devolvessem censo vazio, `parciais` ficaria vazio e a
     alínea fecharia verde sem ter olhado grupo algum. Medido na Fase 4 — é a
     mesma forma de vácuo que o red da 022 achou em três alíneas. */
  let gruposMedidos = 0;
  Object.keys(F).forEach(k => {
    const { d } = boot(F[k]);
    const c = censo(d);
    if (!c.length) return;                       /* ausência é julgada por DOM1/LEG1 */
    const grupos = {};
    /* O card de produto V3.2 NÃO entra na conta: ele não é Camada 1, e contá-lo
       transformaria "um grupo meio oculto" na soma de duas origens — que é o
       erro que a `fronteira()` existe para evitar e que o `D010-ARB3` já pagou
       uma vez (3 ocultos de 9). */
    c.filter(x => !x.produto).forEach(x => {
      (grupos[x.grupo] = grupos[x.grupo] || []).push(x);
    });
    Object.keys(grupos).forEach(g => {
      const nos = grupos[g], ocultos = nos.filter(x => x.oculto).length;
      gruposMedidos++;
      if (ocultos !== 0 && ocultos !== nos.length)
        parciais.push(k + " · grupo \"" + g + "\": " + ocultos + " oculto(s) de " + nos.length);
    });
  });
  if (!gruposMedidos) vac("(a)", "nenhum grupo congelado em nenhuma das oito fixtures — a regra tudo-ou-nada não teve sujeito");
  if (parciais.length) throw new Error("arbitragem PARCIAL: " + parciais.join(" | "));
  return true;
});

T("D023-SUJ1", "C5 · o `D010-ARB1` segue com sujeito: substituto suprimido dá falso COM a Camada 1 presente", () => {
  const { w, d } = boot(F.F3);
  /* (a) o predicado NOVO devolve falso — se não devolvesse, o gate da 010
     ficaria sem sujeito e a 023 teria esvaziado oráculo alheio */
  if (d023Substituto(w) !== false)
    throw new Error("o predicado novo NUNCA é falso nesta fixture — o `D010-ARB1` perde o sujeito");
  /* (b) e a Camada 1 está PRESENTE no DOM e VISÍVEL: é dela que o gate da 010
     fala, e sujeito ausente é vacuidade, não aprovação */
  const congelados = censo(d).filter(x => !x.produto);
  if (!congelados.length)
    throw new Error("nenhum nó da Camada 1 presente na fixture de substituto suprimido — sujeito inexistente");
  const titulos = congelados.filter(x => x.tipo === "titulo");
  if (!titulos.length)
    throw new Error("nenhum TÍTULO congelado presente — o `D010-ARB1` mede título, não só bloco");
  const oc = congelados.filter(x => x.oculto).map(x => x.chave);
  if (oc.length) throw new Error("Camada 1 oculta na fixture que deveria devolvê-la: " + JSON.stringify(oc));
  return true;
});

T("D023-PAP1", "C6 · o papel acompanha a tela — no que o papel carrega, e o resto declarado", () => {
  /* A OCULTAÇÃO DA CAMADA 1 NÃO É MEDÍVEL AQUI, e isso é declarado em vez de
     fingido: a Camada 1 nunca é impressa (010 · C13), e medido nesta Fase 4
     nenhum dos três títulos de `HIDE_EYEBROWS` aparece em `#v32-print-report`
     em nenhuma das oito fixtures. Um gate que procurasse ocultação no papel
     fecharia verde por ausência de sujeito.
     O que o papel CARREGA e esta alínea mede: o conjunto de cards impressos e o
     aviso de supressão — isto é, a COERÊNCIA entre as duas superfícies. */
  const erros = [];
  /* CADA FIXTURE TRAZ A SUA EXPECTATIVA, e é isso que impede a coerência de ser
     verdadeira por vazio: em F3 tudo é zero, e `0 === 0 === 0` passaria sem
     medir nada. F1 exige conjunto publicado NÃO vazio; F3 exige o aviso de
     supressão nas DUAS superfícies. */
  [["F1", F.F1, { pubNaoVazio: true }], ["F3", F.F3, { exigeAviso: true }]].forEach(par => {
    const k = par[0], esperado = par[2], { w, d } = boot(par[1]);
    const rel = papel(w, d);
    const pub = publicados(w);
    if (esperado.pubNaoVazio && !pub.length)
      vac(k, "conjunto publicado vazio — a coerência entre tela e papel ficaria verdadeira por ausência");
    /* (a) contraprova do que NÃO se mede: se um dia a Camada 1 passar a ser
       impressa, esta alínea deixa de ser declaração e volta a ser medição —
       e o gate avisa em vez de continuar calado. */
    const impressos = HIDE.filter(t => txt(rel).indexOf(t) >= 0);
    if (impressos.length)
      erros.push(k + " · a Camada 1 passou a ser IMPRESSA (" + JSON.stringify(impressos) +
        ") — a premissa desta alínea mudou e o C6 tem de voltar a medir ocultação no papel");
    /* (b) coerência do conjunto publicado */
    const noPapel = qa(rel, "[data-p53-sol-produto]").length;
    if (noPapel !== pub.length)
      erros.push(k + " · cards no papel (" + noPapel + ") ≠ publicados (" + pub.length + ")");
    const naTela = cardsProduto(d).length;
    if (noPapel !== naTela)
      erros.push(k + " · papel (" + noPapel + ") ≠ tela (" + naTela + ")");
    /* (c) e o aviso de supressão viaja com a mesma contagem */
    const at = d.querySelector("[data-p53-suprimido]"), ap = rel.querySelector("[data-p53-suprimido]");
    if (esperado.exigeAviso && !at)
      vac(k, "aviso de supressão ausente na tela — a alínea do aviso ficaria sem sujeito");
    if (!!at !== !!ap)
      erros.push(k + " · aviso de supressão em uma superfície só · tela=" + !!at + " papel=" + !!ap);
    if (at && ap && at.getAttribute("data-p53-suprimido") !== ap.getAttribute("data-p53-suprimido"))
      erros.push(k + " · contagem de supressão divergente · tela=" + at.getAttribute("data-p53-suprimido") +
        " papel=" + ap.getAttribute("data-p53-suprimido"));
  });
  if (erros.length) throw new Error(erros.join(" | "));
  return true;
});

T("D023-DOM1", "C7 · nada é REMOVIDO — o título e a lista congelados existem nas oito fixtures", () => {
  const faltando = [];
  Object.keys(F).forEach(k => {
    const { d } = boot(F[k]);
    const c = censo(d);
    const titulos = c.filter(x => x.tipo === "titulo");
    if (!titulos.length) { faltando.push(k + " · nenhum título congelado no DOM"); return; }
    /* O que muda entre fixtures é `v32-hidden`, nunca a existência: a cada
       fixture o título é NOMEADO e tem de estar em `HIDE_EYEBROWS`. */
    titulos.forEach(t => {
      if (HIDE.indexOf(t.chave) < 0) faltando.push(k + " · título fora de HIDE_EYEBROWS no censo: " + t.chave);
    });
  });
  if (faltando.length) throw new Error("conteúdo congelado AUSENTE do DOM: " + faltando.join(" | "));
  /* E a contraprova de que "existir" não está sendo confundido com "aparecer":
     a fixture de contexto declarado tem título OCULTO e PRESENTE ao mesmo
     tempo. Sem esta alínea, um produto que REMOVESSE o nó passaria na primeira. */
  const { d } = boot(F.F2);
  const ocultos = censo(d).filter(x => x.tipo === "titulo" && x.oculto);
  if (!ocultos.length)
    vac("(b)", "nenhum título congelado OCULTO na fixture de contexto declarado — a contraprova perdeu o sujeito");
  return true;
});

T("D023-BND1", "C8 · nenhum arquivo `frozen` foi tocado", () => {
  const pins = JSON.parse(fs.readFileSync(path.join(HERE, ".claude/verify/pins.json"), "utf8"));
  const boundary = JSON.parse(fs.readFileSync(path.join(HERE, ".claude/verify/boundary.json"), "utf8"));
  const frozen = boundary.classes.frozen.paths;
  if (!frozen.length) vac("(a)", "boundary.json não declara arquivo frozen algum");
  const mapa = pins.files || pins;
  const divergentes = frozen.filter(f => {
    const esperado = typeof mapa[f] === "string" ? mapa[f] : (mapa[f] || {}).sha256;
    return !esperado || sha(path.join(HERE, f)) !== esperado;
  });
  if (divergentes.length) throw new Error("frozen alterado: " + JSON.stringify(divergentes));
  /* A régua D2 (payload M41) é medida pelo stage `m41`, que roda o harness.
     Aqui se afirma a metade que este gate PODE medir sem invocar processo
     externo (R10 §6); a outra metade fica DECLARADA, não implícita. */
  return true;
});

T("D023-LEG1", "C9 · em modo legado a arbitragem atravessa, e NADA MAIS (errata E1)", () => {
  /* O SUJEITO DESTE GATE TROCOU, e a troca é a errata `E1`. Antes ele afirmava
     "em modo legado a V3.2 não governa"; medido, essa frase já era parcialmente
     falsa — a visão por produto renderiza os 11 cards em modo legado hoje,
     desde o `EA-65`/`EA-68`. Agora ele afirma duas coisas mais precisas, e a
     segunda é a que de fato protege o modo legado. */
  const erros = [];
  /* (a) e (b) · SEM substituto, a congelada permanece — por ausência de oferta
     (F6) e por supressão pelo operador (F7). São os dois jeitos de não haver
     substituto, e o segundo é o que a 010 existe para cobrir. */
  [["(a) sem produto publicado", F.F6, false], ["(b) substituto suprimido", F.F7, true]].forEach(par => {
    const nome = par[0], fx = par[1], exigeAviso = par[2];
    const { w, d } = boot(fx);
    if (w.__DEV.V32.isLegacyModeV32() !== true)
      vac(nome, "a fixture não está em modo legado — nada declarado deveria bastar");
    if (publicados(w).length !== 0)
      vac(nome, "há " + publicados(w).length + " produto(s) publicado(s) — a alínea mede a AUSÊNCIA de substituto");
    const congelados = censo(d).filter(x => !x.produto);
    if (!congelados.length) vac(nome, "nenhum nó congelado presente em modo legado");
    const oc = congelados.filter(x => x.oculto).map(x => x.chave);
    if (oc.length)
      erros.push(nome + " · a V3.2 ocultou a Camada 1 SEM substituto algum: " + JSON.stringify(oc));
    if (exigeAviso && !d.querySelector("[data-p53-suprimido]"))
      erros.push(nome + " · supressão não declarada ao leitor em modo legado");
  });
  /* (c) · E NADA MAIS ATRAVESSA. É esta alínea que carrega o peso depois de
     `E1`: a arbitragem passa a valer em modo legado, e só ela. A superfície de
     apoio V3.2 (`#v32support`) continua AUSENTE e o convite ao editor de
     contexto continua PRESENTE — medido hoje nas três fixtures legadas. É a
     alínea que o mutante `M8b` ataca. */
  [["F5", F.F5], ["F6", F.F6], ["F7", F.F7]].forEach(par => {
    const nome = par[0], { w, d } = boot(par[1]);
    if (w.__DEV.V32.isLegacyModeV32() !== true) vac("(c) " + nome, "a fixture não está em modo legado");
    if (d.getElementById("v32support"))
      erros.push("(c) " + nome + " · `#v32support` APARECEU em modo legado — a V3.2 passou a governar mais que a arbitragem");
    if (!d.getElementById("v32cta"))
      erros.push("(c) " + nome + " · o convite ao editor de contexto SUMIU em modo legado");
  });
  if (erros.length) throw new Error(erros.join(" | "));
  return true;
});

/* ============================== RESUMO ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD023 LEITURA ÚNICA" + (ONLY.length ? " [FILTRADO]" : "") +
  ": " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
