/* ============================================================================
   TESTES D019 · CURADORIA DO RELATÓRIO (jsdom) — demanda 019-curadoria-do-relatorio
   Namespace exclusivo D019-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria —
   a geometria da seção de apoio é do `P52-REC1g`, no job `visual` (KI-3).

   ONDE ESTA SUÍTE É EXECUTADA, E POR QUEM
   ---------------------------------------
   Stage `suites` do `pipeline.yaml` → `.claude/verify/check_suites.py`, que lê a
   chave `d019` de `expected_suites.json` e roda `node tests_019_curadoria.js`,
   comparando a última linha contra a contagem canônica. Registro e execução
   nascem no mesmo commit (R10 §3).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os dez critérios C1..C10 de `specs/019-curadoria-do-relatorio/spec.md`.

   A FRONTEIRA que a demanda existe para proteger, e que o `D019-CUR1` mede:

       o operador ESCOLHE entre o que o motor ofereceu;
       ele NUNCA escreve o que o motor deveria ter dito.

   Disso dependem as duas invariantes tangenciadas — INV-7 (determinismo é
   propriedade de (entradas)→saída, não proibição de entrada humana) e INV-8
   (seleção é entrada; texto do operador seria derivado serializado).

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   Alínea que depende de caso DECLARA ela mesma a pré-condição e falha NOMEANDO
   o estado, em vez de fechar verde por ausência de sujeito (lição do
   `D010-INV7`, achado `EA-11`). `vac()` dá a essa falha uma forma só.

   ==========================================================================
   POR QUE TANTO GATE NASCE VERMELHO AQUI
   ==========================================================================
   Esta suíte é escrita ANTES da implementação (R3 §1/§4). O bridge
   `__CURATION` não existe; a sexta chave canônica não existe; a visão por
   solução não existe. O vermelho é o ponto — e o commit dele é a prova de que
   o critério não foi ajustado ao resultado (R3 §4).

   Nascem VERDES, e isso vai declarado em vez de escondido: `D019-CUR2`,
   `D019-MED1` e `D019-SUF1`. Nada os viola hoje, porque hoje não há curadoria
   alguma. O poder deles vem dos mutantes, não do red — precedente
   `D015-NOSUB1`/`GOV1`.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_NOME = "quickscan_secops_soccmm_v3_2_dev.html";
const HTML_PATH = process.env.D019_HTML_OVERRIDE || path.join(HERE, HTML_NOME);
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D019-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD019 CURADORIA: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const results = [];
const ONLY = (process.env.D019_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, extra = "";
  try { ok = !!fn(); } catch (e) { ok = false; extra = " [" + e.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + extra);
}
/* falha NOMEADA por ausência de sujeito — nunca verde por vacuidade */
function vac(alinea, porque) { throw new Error("VÁCUO em " + alinea + ": " + porque); }

const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const qa = (n, s) => Array.from(n.querySelectorAll(s));

/* ==========================================================================
   Sessão de referência. Os números vêm da medição da Fase 0 sobre `develop`
   (refinement.md §Sistema real): nível 0 em tudo produz 15 blocos de apoio
   para 9 produtos distintos. Se o catálogo mudar, a alínea que depende do
   número falha NOMEANDO — ela não se ajusta sozinha.
   ========================================================================== */
const PRIOS = ["endpoint", "logs", "network-visibility"];

function boot(opts) {
  const o = opts || {};
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  const nivel = ("nivel" in o) ? o.nivel : 0;
  w.__DEV.V32 && w.__DEV.setArq && w.__DEV.setArq(0);
  const ids = w.eval("QS.map(q=>q.id)");
  ids.forEach(id => w.__DEV.setAnswerById(id, nivel));
  if (o.poucasRespostas) ids.slice(3).forEach(id => w.__DEV.setAnswerById(id, null));
  /* [EA-68] SESSÃO REALISTA. A fixture padrão responde TUDO em nível 0, onde
     todo achado é `sev 2`, todo achado vira `.apoio-block` e a consolidação
     enxerga 100% dos produtos. É o extremo improvável — uma operação em que
     tudo está no pior nível —, e foi essa amostragem única que deixou o EA-68
     passar por sete waves.
     `altos` põe alguns achados em `sev 2` sobre um fundo de nível 1, que é a
     forma da sessão real: gaps moderados predominando, poucos altos. */
  if (o.altos) o.altos.forEach(id => w.__DEV.setAnswerById(id, 0));
  /* [EA-65] CONTEXTO TECNOLÓGICO DECLARADO — o outro eixo cego.
     Declarar contexto tira o runtime do modo legado e liga a arbitragem da
     demanda 010, que oculta a região congelada porque existe substituto V3.2.
     Todos os gates anteriores rodam SEM contexto; foi essa amostragem que
     deixou a visão por solução sumir inteira no caminho principal do produto —
     porque contexto declarado é justamente o que o Quickscan pede para não
     recomendar coisa incompatível com o ambiente do cliente. */
  if (o.contexto) {
    const V = w.__DEV.V32;
    ["security-analytics", "soc-platform"].forEach(c => {
      if (V.TECH_LANDSCAPE[c]) V.TECH_LANDSCAPE[c].presence = "NONE";
    });
    V.ARCHITECTURE_CONTEXT.saasAllowed = "yes";
  }
  w.__DEV.setPriorities(o.prios || PRIOS);
  w.__DEV.showResults();
  return { w, d };
}

/* A ponte da demanda. Ausente ⇒ a alínea falha NOMEANDO, nunca passa por
   ausência de sujeito. */
function cur(w) {
  const b = w.__CURATION;
  if (!b) vac("pré-condição", "bridge `__CURATION` não existe — a demanda não foi implementada");
  return b;
}

/* modelo derivado, para comparar antes/depois da curadoria (C5) */
function derivado(w) {
  return JSON.stringify({
    legacy: w.__DEV.legacySnapshot(),
    ctx: w.__DEV.V32.buildRecommendationContext()
  });
}

/* ====================== C1 · seleção, nunca redação ====================== */
T("D019-CUR1", "curadoria é SELEÇÃO: o estado só carrega ids e enum fechado, e nenhum texto do relatório nasce dele", () => {
  const { w } = boot();
  const b = cur(w);
  const st = b.state();
  if (!st || typeof st !== "object") vac("(a)", "o bridge não expõe estado legível");
  const ENUM = ["include", "exclude"];
  const off = st.decisions || {};
  Object.keys(off).forEach(k => {
    if (ENUM.indexOf(off[k]) < 0)
      throw new Error("valor fora do enum fechado em decisions[" + k + "]: " + JSON.stringify(off[k]));
  });
  /* (b) A FRONTEIRA, TENTADA DE VERDADE. [W3] Até aqui este gate só olhava um
     estado intocado: prometia "nenhum texto nasce dele" e media um objeto vazio.
     Era a família do EA-20 — promessa grande, medição pequena — e quem denunciou
     foi o mutante D019-M1, que abriu o estado para texto livre e ficou VERDE.
     Agora o gate TENTA redigir, e exige recusa. */
  const alvo = b.catalog()[0];
  if (!alvo) vac("(b)", "catálogo vazio — sem sujeito para tentar redigir");
  let recusouProsa = false;
  try { b.set(alvo, "Recomendo priorizar a consolidação de logs no próximo trimestre."); }
  catch (e) { recusouProsa = /enum fechado/.test(e.message); }
  if (!recusouProsa) throw new Error("o estado ACEITOU texto livre em decisions — seleção virou redação");
  let recusouNota = false;
  try { b.setArchitectureNote("preferimos arquitetura unificada, com ressalvas de prazo"); }
  catch (e) { recusouNota = /enum fechado/.test(e.message); }
  if (!recusouNota) throw new Error("architectureNote ACEITOU texto livre — seleção virou redação");
  /* (c) depois das tentativas, nem o estado nem o que viaja na sessão carregam
     prosa. O `toSession()` entra aqui porque é ele que atravessa a fronteira. */
  const plano = JSON.stringify(b.state()) + JSON.stringify(b.toSession() || {});
  const suspeito = plano.match(/"[^"]{60,}"/);
  if (suspeito) throw new Error("estado carrega texto longo — sinal de redação, não de seleção: " + suspeito[0].slice(0, 70));
  return true;
});

/* ============ C2 · ausência ≠ supressão (nasce VERDE, declarado) ========= */
T("D019-CUR2", "ausência de curadoria produz o MESMO relatório de hoje — missing ≠ null ≠ {}", () => {
  const { w, d } = boot();
  w.__DEV.preparePrint();
  const semCuradoria = txt(d.querySelector("#v32-print-report"));
  w.__DEV.finishPrint();
  if (!semCuradoria) vac("(a)", "relatório vazio — sem sujeito para comparar");
  const doc = w.__DEV.captureCanonicalInputs ? w.__DEV.captureCanonicalInputs() : null;
  if (!doc) vac("(b)", "captureCanonicalInputs indisponível");
  if ("reportCuration" in doc && doc.reportCuration === null)
    throw new Error("chave presente como null — missing e null precisam ser distintos (INV-8)");
  if (!semCuradoria.length) vac("(c)", "relatório sem texto — sem sujeito");
  /* (d) AUSÊNCIA NÃO É SUPRESSÃO, medido na ponte. [W3] O gate antes checava só
     que o relatório não estava vazio, e por isso o mutante D019-M2 — que faz a
     leitura converter `missing` em "exclude" — sobreviveu. A superfície que
     consome a curadoria só nasce na W4, mas a REGRA já é observável aqui: sem
     nada declarado, o publicado é exatamente o ofertado. */
  const b = cur(w);
  const ofertado = b.offered();
  if (!ofertado.length) vac("(d)", "nenhuma oferta nesta sessão — ausência≠supressão ficaria sem sujeito");
  const publicado = b.published();
  if (JSON.stringify(publicado) !== JSON.stringify(ofertado))
    throw new Error("sem curadoria declarada o publicado divergiu do ofertado — ausência virou supressão: " +
      ofertado.length + " ofertados, " + publicado.length + " publicados");
  /* (e) [W5] A T019 — inclusão que a avaliação não oferece é SINALIZADA no
     editor — tinha o `D019-CUR2` como gate e nada nele media sinalização
     alguma. Comportamento implementado que nenhuma máquina observa é
     comportamento que some no refactor seguinte. É a quarta vez nesta demanda
     que a distância entre o que o gate promete e o que ele mede aparece; esta
     foi pega por leitura, antes de qualquer mutante. */
  const extra = b.catalog().filter(id => ofertado.indexOf(id) < 0)[0];
  if (!extra) vac("(e)", "todo o catálogo foi ofertado nesta sessão — sem sujeito para inclusão sem lastro");
  b.set(extra, "include");
  w.__DEV.showResults();
  const abrir = d.querySelector("[data-p53-abrir-curadoria]");
  if (!abrir) throw new Error("controle de curadoria ausente com o resultado liberado — a alínea (e) não teria sujeito");
  abrir.click();
  if (!d.querySelector("[data-p53-cur-panel]"))
    throw new Error("o controle não abriu o painel — sem painel não há onde sinalizar");
  if (!d.querySelector("[data-p53-cur-sem-lastro]"))
    throw new Error("inclusão que a avaliação não oferece NÃO foi sinalizada no editor — " +
      "mantida em silêncio é o que o caso de borda 4/5 proíbe");
  return true;
});

/* ===================== C3 · entrada canônica (INV-8) ==================== */
T("D019-INV8", "a sexta chave é ENTRADA canônica: exportada, recomputada na importação, e id desconhecido é recusado", () => {
  const { w } = boot();
  const b = cur(w);
  /* AUSÊNCIA primeiro: sem nada declarado, a chave NÃO existe. É o que mantém
     `missing ≠ {}` (INV-8) e o que faz o `S4-S5` continuar verde na sessão
     comum. Medido na W3: sem esta alínea o gate cobrava a chave sempre, e eu
     teria "consertado" o produto para satisfazer um gate errado. */
  const semNada = w.__DEV.captureCanonicalInputs();
  if ("reportCuration" in semNada)
    throw new Error("chave presente sem nada declarado — ausência e vazio precisam ser distintos");
  /* DECLARADA: aí sim ela viaja */
  const alvo = b.offered()[0];
  if (!alvo) vac("(a)", "nenhuma oferta nesta sessão — sem sujeito para declarar curadoria");
  b.set(alvo, "exclude");
  const doc = w.__DEV.captureCanonicalInputs();
  const chaves = Object.keys(doc);
  if (chaves.indexOf("reportCuration") < 0)
    throw new Error("curadoria declarada não entrou nos inputs canônicos: " + JSON.stringify(chaves));
  /* id desconhecido é RECUSADO, nunca aceito em silêncio */
  let recusou = false;
  try { b.set("ProdutoQueNaoExiste", "include"); } catch (e) { recusou = /fora do catálogo/.test(e.message); }
  if (!recusou) throw new Error("id fora do catálogo foi aceito — a fronteira seleção×redação depende dessa recusa");
  /* nenhum derivado viaja junto */
  const s = JSON.stringify(doc);
  ["\"findings\"", "\"score\"", "\"stage\"", "supportMode", "recommendationContext"].forEach(b => {
    if (s.indexOf(b) >= 0) throw new Error("campo derivado no export: " + b);
  });
  return true;
});

/* ================= C4 · proveniência nas DUAS superfícies ================ */
/* ==========================================================================
   [W6] A FIXTURE DESTE GATE NÃO CRIAVA A CONDIÇÃO QUE ELE DESCREVE.

   A C4 diz: "todo item cuja **PRESENÇA é decisão do operador** leva rótulo". A
   fixture original marcava como `include` um produto que o motor JÁ HAVIA
   OFERECIDO — cuja presença, portanto, não é decisão de ninguém: ele estaria
   no relatório de qualquer jeito. O gate exigia o selo para uma confirmação.

   Satisfazê-lo como estava significaria carimbar "incluído por decisão do
   engenheiro" em item derivado da avaliação — ou seja, o produto passaria a
   MENTIR para caber no gate. Foi pego por leitura do critério contra a spec,
   antes de escrever a implementação.

   A correção não afrouxa: a alínea (a) passa a usar um produto FORA da oferta,
   que é o caso que a C4 nomeia, e nasce a alínea (c) — o selo NÃO pode aparecer
   em item ofertado. Sem ela, um produto que carimbasse tudo passaria, e o
   rótulo não distinguiria coisa alguma. O `D019-M4` continua atacando a
   ausência SÓ NO PAPEL, que é o modo real de as duas superfícies divergirem.
   ========================================================================== */
T("D019-PROV1", "item cuja PRESENÇA é decisão do operador leva marcador na TELA e no PAPEL — e só ele", () => {
  const { w, d } = boot();
  const b = cur(w);
  const ofertados = b.offered();
  const foraDaOferta = b.catalog().filter(id => ofertados.indexOf(id) < 0)[0];
  if (!foraDaOferta) vac("(a)", "todo o catálogo foi ofertado — não há presença que seja decisão do operador");
  if (!ofertados.length) vac("(a)", "nenhuma oferta nesta sessão — a alínea (c) ficaria sem sujeito");
  b.set(foraDaOferta, "include");
  b.set(ofertados[0], "include");          /* confirmação: NÃO é decisão de presença */
  w.__DEV.showResults();

  const cardDe = id => {
    const p = w.eval("PRODUCTS")[id];
    return p ? d.querySelector('#app [data-p53-sol-produto="' + p.n + '"]') : null;
  };
  /* (a) o acrescentado está na TELA e leva o selo */
  const add = cardDe(foraDaOferta);
  if (!add) throw new Error("o produto incluído pelo operador não chegou à TELA");
  if (!add.querySelector("[data-p53-prov]")) throw new Error("marcador de proveniência ausente na TELA");
  /* (b) e no PAPEL — o modo real de divergir (EA-58) */
  w.__DEV.preparePrint();
  const noPapel = qa(d, '#v32-print-report [data-p53-sol-produto] [data-p53-prov]').length;
  const papelAdd = d.querySelector('#v32-print-report [data-p53-sol-produto]');
  w.__DEV.finishPrint();
  if (!papelAdd) throw new Error("a visão por solução não chegou ao PAPEL — sem sujeito");
  if (!noPapel) throw new Error("marcador de proveniência ausente no PAPEL — é assim que as duas superfícies divergem (EA-58)");
  /* (c) o CONFIRMADO não leva selo: rótulo que aparece em tudo não distingue nada */
  const conf = cardDe(ofertados[0]);
  if (conf && conf.querySelector("[data-p53-prov]"))
    throw new Error("item OFERTADO pelo motor levou marcador de proveniência — o rótulo afirma decisão de presença " +
      "que não houve, e um selo que aparece em tudo não distingue nada");
  return true;
});

/* ========== C5 · não alcança medição nem declaração (VERDE hoje) ========= */
/* ==========================================================================
   [W6] ESTE GATE NÃO OLHAVA PARA O CATÁLOGO DERIVADO, E O MUTANTE PROVOU.

   `derivado()` compara `legacySnapshot()` e `buildRecommendationContext()` —
   nenhum dos dois passa por `MAP`. Então uma exclusão implementada PODANDO o
   catálogo derivado (que é o erro que alguém realmente comete: "removi do MAP,
   agora não renderiza") deixava o gate VERDE. O `D019-M5` fez exatamente isso
   e sobreviveu.

   E a poda É a curadoria alcançando a medição: `offered()` deriva de
   `computeFindings()` + `MAP`; mexer ali muda o que o MOTOR oferece, não o que
   a tela mostra. A alínea nova compara a OFERTA do motor antes e depois —
   mesma expressão que o `D019-SOL1` usa como oráculo, pela mesma razão.
   ========================================================================== */
const OFERTA_DO_MOTOR =
  "(function(){var o=[],fs=(computeFindings()||{}).findings||[];" +
  "for(var i=0;i<fs.length;i++){var f=fs[i],m=MAP[f.id];" +
  "if(!m||!m.lv||!m.lv[f.lvl])continue;var c=m.lv[f.lvl].c||[];" +
  "for(var j=0;j<c.length;j++)o.push(f.id+'/'+f.lvl+'/'+c[j].p);}" +
  "return o.join('|');})()";

T("D019-MED1", "a curadoria não alcança medição nem declaração: derivados E oferta do motor idênticos com e sem ela", () => {
  const { w } = boot();
  const antes = derivado(w);
  const ofertaAntes = w.eval(OFERTA_DO_MOTOR);
  if (!ofertaAntes) vac("(a)", "o motor não ofereceu nada nesta sessão — sem sujeito para a alínea da oferta");
  let b = null;
  try { b = w.__CURATION; } catch (e) { b = null; }
  if (!b || !b.offered || !b.offered().length) vac("(b)", "sem curadoria disponível — nada a exercer");
  b.set(b.offered()[0], "exclude");
  w.__DEV.showResults();
  const depois = derivado(w);
  if (antes !== depois)
    throw new Error("a curadoria alterou derivado — score/estágio/suficiência/gaps não podem mudar (C5)");
  const ofertaDepois = w.eval(OFERTA_DO_MOTOR);
  if (ofertaAntes !== ofertaDepois)
    throw new Error("a curadoria alterou o que o MOTOR oferece — excluir é não publicar, nunca podar o catálogo " +
      "derivado; isso é a curadoria alcançando a MEDIÇÃO (C5)");
  return true;
});

/* ===================== C6 · apoio por solução, íntegro ================== */
/* ==========================================================================
   [W4] ESTE GATE MEDIA CONTRA SI MESMO, E O MUTANTE PROVOU.

   A versão original lia o conjunto "por gap" de `.apoio-block .prod .pt-name`
   e `.prod-mini b` no DOM. Só que a consolidação **move** os `.prod` para
   dentro dos cards e **consome** as menções curtas: depois dela, aquele seletor
   devolve exatamente os 9 produtos dos cards. O gate comparava o resultado com
   ele mesmo — tautologia perfeita, verde por construção.

   Quem denunciou foi o `D019-M6`: desliguei a colheita das menções curtas e o
   gate continuou VERDE. A causa não era o mutante fraco; era o oráculo olhando
   para o espelho.

   O oráculo agora é o MOTOR — `computeFindings()` + `MAP` + `PRODUCTS` —, que é
   a mesma fonte que o renderer congelado usa e que a consolidação não pode
   alterar. E mede o PAR (produto × capability), não só o conjunto de produtos:
   medido que na sessão de referência todo produto tem ao menos um `.prod`
   completo, então perder as menções curtas NÃO perde produto — perde a
   associação com a capability. Era exatamente essa a perda "que o olho não
   procura", e ela só é observável no par.

   O texto da capability passa pelo `__P52.applyCopy`, que é transformação
   DECLARADA e pública deste repositório justamente para que um gate possa
   comparar texto canônico com texto exibido sem aceitar divergência.
   ========================================================================== */
T("D019-SOL1", "visão por solução: o par (produto × capability) é igual ao que o MOTOR produziu, menções curtas incluídas", () => {
  const { w, d } = boot();
  const copy = (w.__P52 && typeof w.__P52.applyCopy === "function")
    ? function (s) { return w.__P52.applyCopy(s); } : function (s) { return s; };
  const esperado = new Set(), prodEsperado = new Set();
  w.eval("(function(){var o=[],fs=(computeFindings()||{}).findings||[];" +
         "for(var i=0;i<fs.length;i++){var f=fs[i],m=MAP[f.id];" +
         "if(!m||!m.lv||!m.lv[f.lvl])continue;var c=m.lv[f.lvl].c||[];" +
         "for(var j=0;j<c.length;j++){var p=PRODUCTS[c[j].p];if(p)o.push([p.n,m.cap]);}}" +
         "return o;})()").forEach(par => {
    prodEsperado.add(par[0]);
    esperado.add(par[0] + " × " + copy(par[1]).replace(/\s+/g, " ").trim());
  });
  if (!esperado.size) vac("(a)", "o motor não ofereceu produto algum nesta sessão — sem sujeito");

  const cards = qa(d, "#p52-workspace [data-p53-sol-produto]");
  if (!cards.length) throw new Error("visão por solução ausente — nenhum [data-p53-sol-produto]");
  const observado = new Set(), prodObservado = new Set();
  cards.forEach(c => {
    const nome = c.getAttribute("data-p53-sol-produto");
    prodObservado.add(nome);
    qa(c, "[data-p53-sol-cap]").forEach(li =>
      observado.add(nome + " × " + String(li.getAttribute("data-p53-sol-cap")).replace(/\s+/g, " ").trim()));
  });

  const pSumiu = [...prodEsperado].filter(p => !prodObservado.has(p));
  const pNasceu = [...prodObservado].filter(p => !prodEsperado.has(p));
  if (pSumiu.length) throw new Error("produto SUMIU na visão por solução: " + pSumiu.join(", "));
  if (pNasceu.length) throw new Error("produto NASCEU na visão por solução: " + pNasceu.join(", "));

  const sumiu = [...esperado].filter(x => !observado.has(x));
  const nasceu = [...observado].filter(x => !esperado.has(x));
  if (sumiu.length) throw new Error("par (produto × capability) SUMIU na visão por solução: " + sumiu.slice(0, 5).join(" · "));
  if (nasceu.length) throw new Error("par (produto × capability) NASCEU na visão por solução: " + nasceu.slice(0, 5).join(" · "));
  return true;
});

/* ============ C7 · agrupamento declarado, desconhecido é nomeado ========= */
T("D019-SOL2", "todo produto cai num grupo do portfólio; o sem categoria vai para grupo explícito e é LISTADO", () => {
  const { w, d } = boot();
  const cards = qa(d, "#p52-workspace [data-p53-sol-produto]");
  if (!cards.length) throw new Error("visão por solução ausente — sem sujeito");
  const semGrupo = cards.filter(c => !c.closest("[data-p53-sol-grupo]"));
  if (semGrupo.length)
    throw new Error(semGrupo.length + " produto(s) fora de qualquer grupo: " +
      semGrupo.map(c => c.getAttribute("data-p53-sol-produto")).join(", "));
  /* (b) TODO grupo presente SE NOMEIA. [W4] A alínea original media só o balde
     `nao-classificado` — e, na sessão de referência, ele está VAZIO, porque os
     13 produtos do catálogo têm categoria. Ou seja: a única cláusula com dentes
     do C7 nunca chegava a rodar, e o gate fechava verde tendo medido apenas que
     cada card declara um grupo. É a família do EA-20 pela terceira vez nesta
     demanda; desta vez peguei antes do mutante.

     A regra que o C7 realmente enuncia — "o desconhecido é NOMEADO" — vale para
     qualquer grupo: agrupar sem dizer o nome do grupo é descarte silencioso da
     própria classificação. Medido sobre os 9 cards reais, não sobre um balde
     que pode estar vazio. */
  const grupos = {};
  cards.forEach(c => {
    const dono = c.closest("[data-p53-sol-grupo]");
    grupos[dono.getAttribute("data-p53-sol-grupo")] = true;
  });
  const ids = Object.keys(grupos);
  if (!ids.length) vac("(b)", "nenhum grupo declarado — sem sujeito");
  const semNome = ids.filter(g => {
    const rot = d.querySelector('[data-p53-sol-grupo-nome="' + g + '"]');
    return !rot || !txt(rot);
  });
  if (semNome.length)
    throw new Error("grupo(s) que não se nomeiam: " + semNome.join(", ") +
      " — agrupar sem dizer o nome é descarte silencioso da classificação (C7)");
  /* (c) o balde do desconhecido, quando existir, é explícito E listado */
  const naoClass = cards.filter(c =>
    c.closest('[data-p53-sol-grupo="nao-classificado"]'));
  const rotulo = d.querySelector('[data-p53-sol-grupo-nome="nao-classificado"]');
  if (naoClass.length && !rotulo)
    throw new Error("há produto não classificado e o grupo não se nomeia — descarte silencioso é o que o C7 proíbe");
  return true;
});

/* ==========================================================================
   [EA-68] TODO PRODUTO QUE O MOTOR OFERECE APARECE NA VISÃO POR SOLUÇÃO —
   e este gate nasce numa SESSÃO REALISTA, de propósito.

   O defeito que ele fecha: o renderer congelado emite `.apoio-block` apenas
   para `sev 2`; achado de gap moderado vira entrada na lista "pode fazer
   sentido — após validação". A consolidação colhia só `.apoio-block`, então
   numa sessão dominada por gaps moderados — a sessão comum — ela nascia quase
   vazia enquanto a lista antiga carregava tudo.

   Medido no relato do proprietário: 15 achados, 2 com `sev 2`, **2 produtos na
   visão por solução contra 9 na lista**, e nenhum dos nove na visão. Dois de
   onze.

   E HAVIA UMA INCOERÊNCIA DENTRO DO PRÓPRIO TRABALHO: `__CURATION.offered()`
   já devolvia os 11 — o editor oferecia para curar produtos que a vista nunca
   mostrou. Excluir nove deles não fazia nada visível.

   A FIXTURE É O CONSERTO MAIS IMPORTANTE. Os doze gates anteriores rodam com
   tudo em nível 0, onde todo achado é `sev 2` e a consolidação enxerga 100%
   dos produtos — os "15 blocos → 9 cards" que a spec cita. Amostragem única do
   extremo improvável. Aqui o fundo é nível 1, com poucos altos, que é a forma
   da sessão real.
   ========================================================================== */
T("D019-SOL3", "em sessão REALISTA, todo produto que o motor oferece está na visão por solução, qualificado", () => {
  const { w, d } = boot({ nivel: 1, altos: ["mandate", "incident-response"],
                          prios: ["logs", "endpoint", "monitoring-coverage"] });
  const b = cur(w);
  const ofertados = b.offered();
  if (ofertados.length < 4)
    vac("(a)", "a fixture não produziu ofertas suficientes (" + ofertados.length + ") — sem sujeito");
  /* NÃO-VACUIDADE DA PRÓPRIA FIXTURE: ela só serve se houver as DUAS
     severidades. Com um tier só, o gate voltaria a medir um caminho. */
  const sevs = w.eval("(function(){var s={};((computeFindings()||{}).findings||[])" +
                      ".forEach(function(f){s[f.sev]=1;});return Object.keys(s).join(',');})()");
  if (String(sevs).indexOf("1") < 0 || String(sevs).indexOf("2") < 0)
    vac("(a)", "a fixture não tem as duas severidades (" + sevs + ") — voltaria a medir um caminho só");

  const P = w.eval("PRODUCTS");
  const esperados = new Set(ofertados.map(id => (P[id] && P[id].n) || id));
  const cards = qa(d, "#p52-workspace [data-p53-sol-produto]");
  const vistos = new Set(cards.map(c => c.getAttribute("data-p53-sol-produto")));

  const sumiram = [...esperados].filter(n => !vistos.has(n));
  if (sumiram.length)
    throw new Error(sumiram.length + " de " + esperados.size + " produtos OFERECIDOS pelo motor não estão " +
      "na visão por solução: " + sumiram.join(", ") + " — a consolidação não substitui a leitura antiga, " +
      "ela convive com ela dizendo coisa diferente (EA-68)");
  const nasceram = [...vistos].filter(n => !esperados.has(n));
  if (nasceram.length)
    throw new Error("produto na visão que o motor não ofereceu: " + nasceram.join(", "));

  /* (b) o QUALIFICADOR diz de onde o produto veio, e bate com o motor */
  const tierDoMotor = w.eval("(function(){var o={},fs=(computeFindings()||{}).findings||[];" +
    "for(var i=0;i<fs.length;i++){var f=fs[i],m=MAP[f.id];if(!m||!m.lv||!m.lv[f.lvl])continue;" +
    "var c=m.lv[f.lvl].c||[];for(var j=0;j<c.length;j++){var t=(f.sev===2)?1:2;" +
    "o[c[j].p]=Math.min(o[c[j].p]||9,t);}}return o;})()");
  const rotulo = { 1: "prioritaria", 2: "validacao" };
  const erradas = [];
  ofertados.forEach(id => {
    const nome = (P[id] && P[id].n) || id;
    const card = cards.filter(c => c.getAttribute("data-p53-sol-produto") === nome)[0];
    if (!card) return;
    const tier = card.getAttribute("data-p53-sol-tier");
    if (tier !== rotulo[tierDoMotor[id]])
      erradas.push(nome + ": card diz " + JSON.stringify(tier) + ", motor diz " +
        JSON.stringify(rotulo[tierDoMotor[id]]));
  });
  if (erradas.length)
    throw new Error("qualificador divergente do motor — " + erradas.slice(0, 4).join(" · ") +
      "; sem ele o leitor não distingue indicação prioritária de 'após validação'");
  /* (c) as duas qualificações precisam ter aparecido, senão (b) mediu metade */
  const tiers = new Set(cards.map(c => c.getAttribute("data-p53-sol-tier")));
  if (tiers.size < 2)
    vac("(c)", "a visão trouxe um qualificador só (" + [...tiers].join(",") + ") — (b) mediu metade");
  return true;
});

/* ==========================================================================
   [EA-65] A VISÃO POR SOLUÇÃO EXISTE TAMBÉM COM CONTEXTO DECLARADO.

   O defeito: eu me abstinha da seção INTEIRA quando qualquer nó do escopo
   estivesse oculto — guarda que nasceu na W4 para não ressuscitar região que a
   arbitragem da 010 escondeu. A decisão foi grossa. Medido: bastava UMA
   capability declarada para a funcionalidade sumir, tela e papel, e contexto
   declarado é o caminho mais cuidadoso do produto, não uma borda.

   Nenhum dos gates anteriores viu, porque nenhum declara contexto. Segundo
   eixo cego da mesma família, depois da severidade (EA-68).

   AS TRÊS ALÍNEAS, e a terceira é a que me protege de mim mesmo:
     (a) com contexto declarado, a visão cobre o que o motor oferece;
     (b) a FRONTEIRA existe nesse modo — é o nó que encerra a contagem do censo
         da Camada 1 antes dos cards, impedindo o grupo meio oculto e meio
         visível que o `D010-ARB3` reprova;
     (c) a fronteira NÃO existe em modo legado — ali o título congelado está
         visível e os cards SÃO os "blocos contíguos visíveis" do
         `D010-ARB1 (c)`; interpor a fronteira tiraria o sujeito da alínea.

   A mesma peça, nos dois modos, tem efeitos opostos. Medir só um lado deixaria
   passar a metade errada — e foi medir só um lado que produziu este achado.
   ========================================================================== */
T("D019-CTX1", "com contexto tecnológico DECLARADO a visão por solução existe, e a fronteira do censo é condicional", () => {
  const { w, d } = boot({ nivel: 1, altos: ["mandate", "incident-response"], contexto: true,
                          prios: ["logs", "endpoint", "monitoring-coverage"] });
  if (w.__DEV.V32.isLegacyModeV32() !== false)
    vac("(a)", "a fixture não saiu do modo legado — não há contexto declarado para medir");
  const b = cur(w);
  const P = w.eval("PRODUCTS");
  const esperados = new Set(b.offered().map(id => (P[id] && P[id].n) || id));
  if (esperados.size < 4) vac("(a)", "oferta pequena demais (" + esperados.size + ") — sem sujeito");
  const vistos = new Set(qa(d, "#p52-workspace [data-p53-sol-produto]")
    .map(c => c.getAttribute("data-p53-sol-produto")));
  const sumiram = [...esperados].filter(n => !vistos.has(n));
  if (sumiram.length)
    throw new Error(sumiram.length + " de " + esperados.size + " produtos ausentes da visão COM contexto " +
      "declarado: " + sumiram.slice(0, 5).join(", ") + " — quem declara contexto, que é o caso mais " +
      "cuidadoso, recebia o produto sem a funcionalidade (EA-65)");

  const sec = d.getElementById("p52-sec-support");
  const ocultosNoEscopo = qa(sec, ":scope > .v32-hidden").length;
  if (!ocultosNoEscopo)
    vac("(b)", "a arbitragem não ocultou nada nesta fixture — a alínea da fronteira ficaria sem sujeito");
  const fronteira = sec.querySelector(":scope > [data-p53-sol-lead]");
  if (!fronteira)
    throw new Error("com arbitragem ativa e cards visíveis, falta a fronteira que encerra a contagem do " +
      "censo — sem ela o grupo contíguo fica meio oculto e meio visível, que é o que o D010-ARB3 reprova");
  const cardsDepois = qa(sec, ":scope > [data-p53-sol-produto]")
    .filter(c => fronteira.compareDocumentPosition(c) & 4 /* DOCUMENT_POSITION_FOLLOWING */);
  if (!cardsDepois.length)
    throw new Error("a fronteira existe mas não precede os cards — ela só serve no lugar certo");

  /* (c) e em modo LEGADO ela não pode existir */
  const L = boot({ nivel: 1, altos: ["mandate", "incident-response"],
                   prios: ["logs", "endpoint", "monitoring-coverage"] });
  if (L.w.__DEV.V32.isLegacyModeV32() !== true)
    vac("(c)", "a fixture de controle não está em modo legado — a alínea não compara o que promete");
  if (L.d.querySelector("#p52-sec-support > [data-p53-sol-lead]"))
    throw new Error("a fronteira apareceu em modo LEGADO — ali ela tira do `D010-ARB1 (c)` justamente os " +
      "blocos contíguos visíveis que a alínea mede, e o gate cai por vacuidade");
  return true;
});

/* ==========================================================================
   [EA-67] O ACABAMENTO DO CARD, e por que ele merece gate.

   Dois defeitos que o proprietário viu numa passada e nenhuma máquina viu em
   sete waves — porque nenhum dos dez gates olhava para o card como o leitor
   olha: eles mediam CONJUNTOS (produtos, pares, grupos), nunca a forma.

   1. O nome saía DUAS VEZES. Na visão por gap o `.pt-name` era o título do
      produto dentro do bloco da capability; consolidado, o título do card já é
      o produto, e o `.pt-name` repete a palavra duas linhas abaixo. Mover o nó
      mudou o papel dele, e eu movi sem reavaliar.
   2. O card ACRESCENTADO saía sem ícone, porque eu o montava do catálogo e não
      montava o `.icon-tile`. Na tela do proprietário só um card aparecia
      ilustrado — o único colhido entre quatro.

   A alínea (b) é a que importa mais: o que distingue um card acrescentado de um
   colhido tem de ser o SELO DE PROVENIÊNCIA, nunca o acabamento. Card mais
   pobre é um segundo canal dizendo "este aqui é de segunda", e não é isso que
   a demanda combinou.
   ========================================================================== */
T("D019-CARD1", "o card diz o nome do produto UMA vez e todo card tem ícone — acrescentado igual a colhido", () => {
  const { w, d } = boot();
  const b = cur(w);
  const fora = b.catalog().filter(id => b.offered().indexOf(id) < 0)[0];
  if (!fora) vac("(a)", "todo o catálogo foi ofertado — sem card acrescentado para comparar");
  b.set(fora, "include");
  w.__DEV.showResults();
  const cards = qa(d, "#p52-sec-support > [data-p53-sol-produto]");
  if (!cards.length) throw new Error("nenhum card na seção de apoio — sem sujeito");

  /* (a) o nome aparece UMA vez por card */
  const repetidos = cards.filter(c => {
    const nome = c.getAttribute("data-p53-sol-produto");
    return qa(c, "*").filter(n => !n.children.length && txt(n) === nome).length > 1;
  }).map(c => c.getAttribute("data-p53-sol-produto"));
  if (repetidos.length)
    throw new Error("o nome do produto sai mais de uma vez no card: " + repetidos.join(", ") +
      " — consolidar mudou o papel do `.pt-name`, e repetir a palavra é o sintoma");

  /* (b) TODO card tem ícone, inclusive o acrescentado */
  const semIcone = cards.filter(c => !c.querySelector("img"))
    .map(c => c.getAttribute("data-p53-sol-produto"));
  if (semIcone.length)
    throw new Error("card sem ícone: " + semIcone.join(", ") + " — o que distingue acrescentado de " +
      "colhido é o selo de proveniência, nunca o acabamento");

  /* (c) não-vacuidade: a alínea (b) precisa ter visto um card ACRESCENTADO */
  const acrescentado = cards.filter(c => c.querySelector("[data-p53-prov]"));
  if (!acrescentado.length)
    vac("(c)", "nenhum card acrescentado nesta sessão — (b) não teria medido o caso que o defeito produziu");
  return true;
});

/* ================== C8 · tela e papel, a MESMA seleção ================== */
T("D019-PAR1", "tela e papel publicam o mesmo conjunto, medido DEPOIS de beforeprint", () => {
  const { w, d } = boot();
  const b = cur(w);
  const oferta = b.offered();
  if (oferta.length < 2) vac("(a)", "menos de duas ofertas — a exclusão não teria o que distinguir");
  b.set(oferta[0], "exclude");
  w.__DEV.showResults();
  const tela = new Set(qa(d, "#p52-workspace [data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")));
  /* NÃO-VACUIDADE, e ela custou caro para aparecer: sem esta alínea o gate
     fechava VERDE com os dois conjuntos VAZIOS — igualdade trivial entre nada
     e nada. É a família do `EA-20` (gate que promete asserção e entrega
     tautologia), e ela nasceu aqui na W2, quando a visão por solução ainda não
     existia e o `PAR1` passou sem sujeito. Medido, não suposto. */
  if (!tela.size) vac("(b)", "a tela não publicou produto algum — sem sujeito, a igualdade tela×papel seria trivial");
  w.__DEV.preparePrint();
  const papel = new Set(qa(d, "#v32-print-report [data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")));
  w.__DEV.finishPrint();
  const soTela = [...tela].filter(x => !papel.has(x));
  const soPapel = [...papel].filter(x => !tela.has(x));
  if (soTela.length || soPapel.length)
    throw new Error("divergência tela×papel — só na tela: [" + soTela.join(", ") + "] · só no papel: [" + soPapel.join(", ") + "]");

  /* (c) [T025] A LEITURA ARQUITETURAL TAMBÉM É CURÁVEL, e nas duas superfícies.
     Ela está na coluna "curável" do portão da Fase 0 (refinement §P4) e a spec
     não a levou para nenhum dos dez critérios — o aceite de intenção encontrou
     a lacuna, e o comportamento foi entregue. Sem esta alínea ele nasceria sem
     máquina que o observe, que é como comportamento some no refactor seguinte.

     Fixture própria, e ela é necessária: a sessão de referência não declara
     contexto tecnológico, e sem contexto a leitura arquitetural não existe —
     medir ali seria medir o vazio. */
  const A = boot();
  const V = A.w.__DEV.V32;
  ["security-analytics", "soc-platform"].forEach(c => {
    if (V.TECH_LANDSCAPE[c]) V.TECH_LANDSCAPE[c].presence = "NONE";
  });
  V.ARCHITECTURE_CONTEXT.saasAllowed = "yes";
  V.ARCHITECTURE_CONTEXT.unifiedPlatformPreference = "unified";
  A.w.__DEV.showResults();
  if (!A.d.getElementById("v32arch-note"))
    vac("(c)", "a fixture não produziu leitura arquitetural — a alínea ficaria sem sujeito");
  cur(A.w).setArchitectureNote("exclude");
  A.w.__DEV.showResults();
  if (A.d.getElementById("v32arch-note"))
    throw new Error("leitura arquitetural EXCLUÍDA continua na TELA");
  A.w.__DEV.preparePrint();
  const noPapel = !!A.d.getElementById("pr-arch");
  A.w.__DEV.finishPrint();
  if (noPapel)
    throw new Error("leitura arquitetural EXCLUÍDA continua no PAPEL — é assim que as duas superfícies divergem (EA-58)");
  cur(A.w).setArchitectureNote("include");
  A.w.__DEV.showResults();
  if (!A.d.getElementById("v32arch-note"))
    throw new Error("reincluir não devolveu a leitura arquitetural — exclusão tem de ser reversível, " +
      "senão a curadoria vira destruição");
  return true;
});

/* ================= C9 · supressão total declara a supressão ============= */
T("D019-VAZ1", "curadoria que exclui tudo DECLARA a supressão — nunca seção vazia, nunca seção ausente", () => {
  const { w, d } = boot();
  const b = cur(w);
  const oferta = b.offered();
  if (!oferta.length) vac("(a)", "nada ofertado — sem sujeito");
  oferta.forEach(id => b.set(id, "exclude"));
  w.__DEV.showResults();
  const sec = d.querySelector("#p52-sec-support");
  if (!sec) throw new Error("a seção de apoio DESAPARECEU com a supressão total");
  const aviso = sec.querySelector("[data-p53-suprimido]");
  if (!aviso) throw new Error("seção vazia e muda — a supressão precisa se declarar");
  return true;
});

/* ============ C10 · gate fechado ⇒ curadoria indisponível (VERDE) ======== */
T("D019-SUF1", "com o gate de suficiência FECHADO a curadoria não se oferece e o estado não é lido", () => {
  const { w, d } = boot({ poucasRespostas: true });
  const res = d.querySelector("#p50-results");
  const gate = res ? res.getAttribute("data-p50-gate") : null;
  if (gate !== "blocked") vac("(a)", "a fixture não produziu gate fechado (medido: " + gate + ")");
  const controle = d.querySelector("[data-p53-abrir-curadoria]");
  if (controle) throw new Error("curadoria oferecida com resultado bloqueado — não há resultado publicado para curar");
  return true;
});

/* ==========================================================================
   [EA-66] O MODO DE FALHA MAIS CARO DESTE PRODUTO, e ele é SILENCIOSO.

   Medido em sessão real do proprietário: o PDF saiu com 13 folhas, doze quase
   em branco e a última com o anexo — e não era o relatório, era A TELA. A
   assinatura é inconfundível: o anexo da tela chama-se "Evidências e
   observações da sessão" e o do relatório, "Anexo — respostas da sessão"; a
   regra congelada `#annex{break-before:page}` lhe dá a folha final.

   O mecanismo: `preparePrint()` monta o relatório e SÓ DEPOIS aplica
   `v32-print-mode`. Exceção na montagem ⇒ classe nunca entra ⇒ `.wrap` visível,
   `#v32-print-report` oculto ⇒ o navegador imprime o workspace. O operador vê
   um diálogo de impressão perfeitamente normal.

   A FAMÍLIA JÁ MORDEU ANTES, e isso é o que torna o gate obrigatório: a errata
   externa B-03 corrigiu exatamente "sem aplicar `v32-print-mode`, deixava
   `.wrap` visível na impressão" — por outro caminho. Duas instâncias do mesmo
   defeito, nenhuma máquina afirmando a propriedade. Agora há.

   A injeção de falha é na FRONTEIRA DO BRIDGE: `buildPrintReport()` chama
   `__P53SOL.printHTML()` direto, e o try/catch do módulo vive DENTRO do método.
   Substituí-lo faz a exceção subir por onde ela subiria num defeito real —
   nenhum caminho artificial.
   ========================================================================== */
T("D019-PRT1", "montagem do relatório que FALHA não emite a tela como se fosse o relatório", () => {
  const { w, d } = boot();
  const bridge = w.__P53SOL;
  if (!bridge || typeof bridge.printHTML !== "function")
    vac("(a)", "bridge de apresentação ausente — sem fronteira onde injetar a falha");
  const original = bridge.printHTML;
  bridge.printHTML = function () { throw new Error("falha sintética D019-PRT1"); };
  try { w.dispatchEvent(new w.Event("beforeprint")); }
  finally { bridge.printHTML = original; }

  const cls = String(d.body.className || "");
  if (/v32-print-mode/.test(cls))
    throw new Error("a montagem falhou e o modo de impressão entrou assim mesmo — o papel sairia incompleto");
  if (!/v32-print-blocked/.test(cls))
    throw new Error("a montagem falhou e NADA marcou o documento: `.wrap` continua imprimível e o cliente " +
      "recebe a TELA no lugar do relatório — é o modo de falha do EA-66, e ele é silencioso");
  const aviso = d.querySelector("#v32-print-report [data-pr-falha]");
  if (!aviso)
    throw new Error("falha de montagem sem aviso NO PAPEL — falhar em silêncio é o defeito, não a falha");
  if (!/D019-PRT1/.test(txt(aviso)))
    throw new Error("o aviso não carrega a mensagem do erro; sem ela o operador não tem o que relatar");
  /* a tela não pode ter virado o sujeito impresso */
  const annexTela = d.querySelector("#annex");
  if (annexTela && !annexTela.closest(".wrap"))
    throw new Error("o anexo da TELA saiu de `.wrap` — ele voltaria a imprimir junto");
  w.__DEV.finishPrint();
  return true;
});

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD019 CURADORIA: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
