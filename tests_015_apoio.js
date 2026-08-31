/* ============================================================================
   TESTES D015 · SUPERFÍCIES DE APOIO (jsdom) — demanda 015-superficies-de-apoio
   Namespace exclusivo D015-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria.

   ONDE ESTA SUÍTE É EXECUTADA, E POR QUEM
   ---------------------------------------
   Stage `suites` do `pipeline.yaml` → `.claude/verify/check_suites.py`, que lê
   a chave `d015` do bloco `suites` de `expected_suites.json` e roda o `cmd`
   registrado (`node tests_015_apoio.js`), comparando a última linha contra a
   contagem canônica. Localmente: `bash .claude/verify/run.sh` (o stage é
   `heavy`, logo NÃO roda em `--light` nem no hook Stop). No CI: job `verify`.
   Registro e execução nascem no mesmo commit (R10 §3) — suíte registrada que
   nenhum runner invoca é gate que não mede.

   ==========================================================================
   O QUE ESTA SUÍTE JULGA, E COM QUE ORÁCULO
   ==========================================================================
   Cinco gates traduzem C1, C2, C3, C5 e C6 de
   `specs/015-superficies-de-apoio/spec.md`, JÁ COM A ERRATA E1: o C4 e o gate
   `D015-RES1` caíram, e os mutantes `M11`–`M13` estão APOSENTADOS — ids nunca
   reutilizados. Não existe "novo C4"; não há gate número seis.

     · as asserções de texto medem PROPRIEDADE por DUAS expressões
       independentes, nunca a frase inteira — reescrita que preserve a
       propriedade passa sem reexecução, e é o preço aceito de não pinar prosa
       PT-BR num oráculo (R10 §6, spec §"Escolha de forma, com o custo");
     · o ramo de `qsGapSupportHTML` é discriminado pelo texto de
       `[data-pr-gap-why]`, que é da 5.1 e NÃO é escrito por esta demanda —
       discriminante fora do alcance do implementador;
     · a âncora de `D015-NOSUB1`/`D015-GOV1` é COMMIT IMUTÁVEL + path + bytes +
       sha256, conferidos antes do uso (R10 §5: nunca `HEAD:`, nunca branch —
       o `P52-PR1` morreu permanentemente vermelho por ancorar em HEAD);
     · os seis conteúdos exigidos por `P51-DOC12` são TRANSCRITOS aqui da
       âncora `tests_p50_core.js:3831-3837`, não lidos daquela suíte em
       execução: gate não spawna outra suíte (R10 §6).

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   ALÍNEA QUE DEPENDE DE CASO DECLARA ELA MESMA A PRÉ-CONDIÇÃO e falha
   NOMEANDO o estado, em vez de fechar verde por ausência de sujeito (lição do
   `D010-INV7`, achado `EA-11`). `vac()` dá a essa falha uma forma só.

   ==========================================================================
   ALÍNEAS SEM ESTADO ALCANÇÁVEL DE FALHA — dívida declarada, não disfarçada
   ==========================================================================
   A spec (§"Guarda de tautologia") já fixou que várias alíneas asseveram sobre
   LITERAL CONSTANTE: uma vez implementadas, nenhuma sessão as faz variar. Nelas
   o discriminante é EXCLUSIVAMENTE O MUTANTE, jamais a fixture — rodar mais
   estados ali é ruído, e nenhuma fixture é inventada para dar aparência de
   cobertura. São: TIT1 (a)(b)(c)(d)(e) · ANC1 (a)(b)(d) · HOWTO1 (a)(b)(c)(e).

   DIVERGÊNCIA MEDIDA CONTRA A TABELA DA SPEC, registrada aqui e reportada ao
   orquestrador — a spec classifica `TIT1(h)` como "discriminante real por
   estado do DOM" e afirma que `M18` "derruba `U15` junto". MEDIDO em
   2026-08-31 nesta worktree: FALSO para a metade de runtime. O
   `.section-title` de `#v32prio` vive em `#v32support` < `#v32panel`, e
   `hideLegacyRecommendation` (`ui_v32.js:178-193`) só varre FILHOS DIRETOS do
   escopo de apoio e RETORNA em `#v32panel` — o nó é inalcançável pelo ocultador
   em qualquer estado. Simulação direta de `M18` sobre o HTML construído: zero
   diferença observável (`.v32-hidden` do nó, censo de ocultos e `noOverreach`
   de `U15` idênticos). Consequência aplicada abaixo: (h) é PARTIDA em duas —
   (h1) pertinência às TRÊS cópias da lista, que `M18` mata de fato, e (h2) o
   observável de runtime, mantido como CLÁUSULA DEFENSIVA INALCANÇÁVEL POR
   CONSTRUÇÃO e declarada SEM MUTANTE, mesma classe de `GOV1(d)`.

   ==========================================================================
   O QUE ESTA SUÍTE NÃO FAZ
   ==========================================================================
   · não spawna outra suíte e não usa regex sobre stdout PT-BR como oráculo;
   · não escreve arquivo versionado (R7 §3) — a âncora vai para `os.tmpdir()`;
   · não pina hash inline de artefato (R8): o único sha256 daqui é o da PRÓPRIA
     âncora de regressão, que é o objeto do gate e não identidade de produto;
   · não edita nem importa suíte congelada. Onde precisa de um literal de
     `tests_ui_m31.js` ou de `fixtures_010_vao.js`, LÊ O TEXTO do arquivo —
     leitura estática, sem `require` e sem execução (plan.md §5.1).
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { execFileSync } = require("child_process");
const { JSDOM } = require("jsdom");
const FX = require("./fixtures_015_apoio.js");

const HERE = __dirname;
const HTML_NOME = "quickscan_secops_soccmm_v3_2_dev.html";

/* ---------------------------------------------------------------------------
   OVERRIDE DE ARTEFATO — existe SÓ para a bateria negativa / controle verde
   ---------------------------------------------------------------------------
   Precedente vivo: `P52_BASELINE_*_OVERRIDE` (`tests_p52_chromium.js:1233`),
   que existe só para a prova de não-vacuidade da §4.3. Aqui serve para provar
   que estes gates NÃO são constante-vermelho: apontado para um HTML sintético
   pós-fix, o gate tem de VIRAR VERDE; apontado para um HTML com remoção, o
   `D015-NOSUB1` tem de reprovar. Nunca é definido pelo pipeline; quando está
   ativo, a suíte IMPRIME o aviso na primeira linha — nenhuma execução com
   override pode ser confundida com execução canônica.
--------------------------------------------------------------------------- */
const HTML_OVERRIDE = process.env.D015_HTML_OVERRIDE || "";
const HTML_PATH = HTML_OVERRIDE || path.join(HERE, HTML_NOME);
if (HTML_OVERRIDE)
  console.log("### ATENÇÃO — D015_HTML_OVERRIDE ATIVO: o artefato sob teste é " + HTML_OVERRIDE +
    " · esta execução NÃO é canônica e não vale como contagem de registro ###");
const HTML = fs.readFileSync(HTML_PATH, "utf8");

/* ============================ âncora imutável ============================ */
/* Commit escolhido: tip da branch IMEDIATAMENTE ANTERIOR à primeira edição de
   `ui_v32.js` (plan.md §5.3). `382338b` é o repin R3 da série — o último
   commit da wave 0, antes de qualquer byte de produto desta demanda. É SHA
   literal, não `HEAD` e não nome de branch: continua apontando para o mesmo
   objeto depois que o red, o produto e o rebuild forem commitados por cima. */
const D015_ANCORA_COMMIT = "382338b3db669a5d994fbe778496d4294d73115a";
const D015_ANCORA_PATH   = HTML_NOME;
const D015_ANCORA_BYTES  = 1066883;
const D015_ANCORA_SHA    = "74ed75415d737df16c6448c05956b7b8e214690dd8d4bc2b3075994a45a55ae0";

function ancoraArquivo() {
  const spec = D015_ANCORA_COMMIT + ":" + D015_ANCORA_PATH;
  let buf;
  try {
    /* `git cat-file -e` primeiro: separa "commit ausente" de "caminho ausente",
       para que o diagnóstico diga QUAL das duas coisas falhou. */
    try { execFileSync("git", ["cat-file", "-e", D015_ANCORA_COMMIT + "^{commit}"], { cwd: HERE, stdio: "pipe" }); }
    catch (e) { return { ok: false, why: "commit da âncora ausente no repositório: " + D015_ANCORA_COMMIT }; }
    try { buf = execFileSync("git", ["show", spec], { cwd: HERE, maxBuffer: 1 << 28 }); }
    catch (e) { return { ok: false, why: "caminho ausente no commit da âncora: " + spec }; }
  } catch (e) { return { ok: false, why: String(e.message).split("\n")[0] }; }
  if (buf.length !== D015_ANCORA_BYTES)
    return { ok: false, why: "âncora " + spec + " com " + buf.length + " bytes; esperado " + D015_ANCORA_BYTES };
  const got = crypto.createHash("sha256").update(buf).digest("hex");
  if (got !== D015_ANCORA_SHA)
    return { ok: false, why: "identidade da âncora diverge em " + spec + " — observado " + got + ", esperado " + D015_ANCORA_SHA };
  const f = path.join(require("os").tmpdir(), "d015-ancora-" + got.slice(0, 12) + ".html");
  fs.writeFileSync(f, buf);
  return { ok: true, file: f, html: buf.toString("utf8"), sha: got, bytes: buf.length, spec: spec };
}
const ANCORA = ancoraArquivo();

/* ============================== relato ============================== */
const results = [];
const ONLY = (process.env.D015_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, err = "";
  try { ok = !!fn(); } catch (x) { err = " [" + x.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + err);
}
/* Cada alínea roda mesmo depois de uma irmã falhar; a falha do GATE é a soma.
   Gate que para na primeira esconde se as demais estão verdes ou apenas não
   foram medidas. Alínea que depende de passo anterior chama `naoMedido()` —
   falha NOMEADA, nunca silêncio (R10 §2). */
function gate(fn) {
  const erros = [], oks = [];
  const g = {
    passo(nome, f) { try { f(); oks.push(nome); return true; } catch (x) { erros.push(nome + " → " + x.message); return false; } },
    naoMedido(nome, porque) { erros.push(nome + " → NÃO MEDIDO: " + porque); return false; },
    nota(s) { console.log("       · " + s); }
  };
  fn(g);
  if (erros.length) {
    if (oks.length) console.log("       · alíneas OK nesta execução: " + oks.join(", "));
    throw new Error(erros.length + " alínea(s) · " + erros.join("  ⟂  "));
  }
  return true;
}
function vac(alinea, motivo) {
  throw new Error("VACUIDADE em " + alinea + " — " + motivo +
    " · a alínea não teria medido nada e por isso FALHA, em vez de fechar verde");
}

/* ============================== censo ============================== */
const txtN = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");   /* normalizada */
const txtC = el => (el ? (el.textContent || "").trim() : "");                        /* crua (P51-DOC12) */
const qa = (n, s) => Array.from(n.querySelectorAll(s));
const caps = n => (n ? qa(n, "[data-cap]").map(x => x.getAttribute("data-cap")) : null);

/* Um render por (origem, estado); o censo é um objeto de dados PLANO e a janela
   é descartada em seguida — 14 jsdom vivos ao mesmo tempo custariam memória sem
   comprar verdade. Nenhum gate desta suíte MUTA o runtime (só leitura), então o
   reuso do censo entre gates não contamina ordem de execução. */
const CACHE = {};
function censo(origem, fxId) {
  const chave = origem + "|" + fxId;
  if (CACHE[chave]) return CACHE[chave];
  const html = origem === "ANCORA" ? ANCORA.html : HTML;
  if (!html) throw new Error("censo(" + chave + "): artefato de origem indisponível");
  const fx = FX.D015_FIXTURES[fxId];
  if (!fx) throw new Error("estado desconhecido: " + fxId);
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  FX.d015ApplyResults(w, d, fx);

  /* ---- TELA (antes de montar o papel: as duas superfícies emitem os mesmos
     seletores e um censo de tela feito depois somaria as duas) ---- */
  const prio = d.querySelector("#v32prio");
  const st = prio ? prio.previousElementSibling : null;
  const eb = st ? st.querySelector(".eyebrow") : null;
  const c = {
    origem, fxId,
    telaV32prio: !!prio,
    telaTituloClasse: st ? String(st.className || "") : null,
    eyebrow: eb ? (eb.textContent || "").trim() : null,
    eyebrowOculto: st ? st.classList.contains("v32-hidden") : null,
    tituloEyebrowOculto: st ? !!(eb && eb.closest(".v32-hidden")) : null,
    appTitulos: qa(d, "#app .eyebrow,#app h3").map(x => (x.textContent || "").trim()),
    v32prioCaps: caps(prio)
  };

  /* ---- PAPEL ---- */
  w.__DEV.preparePrint();
  const pr = d.querySelector("#v32-print-report");
  FX.d015AssertFixtureStates(w, d, pr, fx);      /* estado declarado, provado antes de julgar */
  const supPrio = pr.querySelector("#pr-sup-prio");
  const h3Prio = supPrio ? supPrio.previousElementSibling : null;
  const howto = pr.querySelector("#pr-howto");
  const alvo = pr.querySelector("#pr-target");
  c.papelForaDoApp = !pr.closest("#app");
  c.papelH3 = qa(pr, "h3").map(x => (x.textContent || "").trim());
  c.papelTitulos = qa(pr, "h1,h2,h3,h4,.eyebrow").map(x => (x.textContent || "").trim());
  c.supPrio = !!supPrio;
  c.h3PrioTag = h3Prio ? h3Prio.tagName : null;
  c.h3PrioTexto = h3Prio ? (h3Prio.textContent || "").trim() : null;
  c.gapSup = qa(pr, "[data-pr-gap-support]").map(n => {
    const fontes = qa(n, "[data-pr-gap-fonte]");
    const why = n.querySelector("[data-pr-gap-why]");
    const f0 = fontes[0] || null;
    return {
      qid: n.getAttribute("data-pr-gap-qid"),
      ramo: FX.d015RamoDe(n),
      nFonte: fontes.length,
      fonteTexto: f0 ? (f0.textContent || "").replace(/\s+/g, " ").trim() : null,
      fonteTemAtributoProprio: f0 ? f0.hasAttribute("data-pr-gap-fonte") : null,
      fonteHerdaWhy: f0 ? f0.hasAttribute("data-pr-gap-why") : null,
      fonteIrmaDeWhy: (f0 && why) ? (f0.parentElement === why.parentElement) : null,
      fonteDentroDeWhy: (f0 && why) ? why.contains(f0) : null,
      nWhy: qa(n, "[data-pr-gap-why]").length,
      opts: qa(n, "[data-pr-gap-opt]").map(li => txtN(li.querySelector("b"))),
      textoTodo: txtN(n)
    };
  });
  c.opts = qa(pr, "[data-pr-gap-opt]").map(li => txtN(li.querySelector("b")));
  c.howtoOuter = howto ? howto.outerHTML : null;
  c.howtoCrua = howto ? txtC(howto).length : null;
  c.howtoNorm = howto ? txtN(howto).length : null;
  c.howtoLis = howto ? qa(howto, "li").map(li => txtN(li)) : null;
  c.supPrioCaps = caps(supPrio);
  c.supBaseCaps = caps(pr.querySelector("#pr-sup-base"));
  c.supMatCaps = caps(pr.querySelector("#pr-sup-maturity"));
  c.lenSupport = pr.querySelector("#pr-support") ? txtC(pr.querySelector("#pr-support")).length : null;
  c.lenFindings = pr.querySelector("#pr-findings") ? txtC(pr.querySelector("#pr-findings")).length : null;
  c.alvoOuter = alvo ? alvo.outerHTML : null;
  c.alvoEids = alvo ? qa(alvo, "[data-eid]").map(x => x.getAttribute("data-eid")) : null;
  c.alvoEn = alvo ? qa(alvo, ".ux-tgt-en").length : null;
  c.alvoAValidar = alvo ? qa(alvo, '[data-ux-enablers="a-validar"]').length : null;
  c.alvoAusencia = alvo ? qa(alvo, '[data-ux-absence="target-enablers"]').length : null;
  w.__DEV.finishPrint();
  dom.window.close();
  CACHE[chave] = c;
  return c;
}
const ESTADOS = FX.D015_ESTADOS;

/* ==================================================================
   D015-TIT1 · C1 — o título nomeia a LEITURA que entrega, não o apoio
   ================================================================== */
const RE_PROMESSA = /apoi(o|ar|a)/i;
const SUFIXO = "· contexto V3.2";
const RE_SUFIXO = /\s*·\s*contexto\s+V3\.2\s*$/i;
const TITULO_CONGELADO = "Como a Fortinet pode apoiar nas prioridades declaradas";
const oracaoPrincipal = s => String(s == null ? "" : s).replace(RE_SUFIXO, "").trim();

/* As TRÊS cópias da lista de ocultação, extraídas por LEITURA ESTÁTICA. A
   duplicação é achado registrado (spec §Referenciado, não absorvido); enquanto
   ela existir, a alínea (h1) confere as três — conferir só uma deixaria M18
   vivo pela porta das outras duas. Extração que falha é FALHA NOMEADA. */
function listaLiteral(fonte, texto, decl) {
  const i = texto.indexOf(decl);
  if (i < 0) return { ok: false, why: "declaração `" + decl + "` não encontrada em " + fonte };
  const j = texto.indexOf("];", i);
  if (j < 0) return { ok: false, why: "fim da lista `" + decl + "` não encontrado em " + fonte };
  const corpo = texto.slice(i + decl.length, j);
  const itens = (corpo.match(/"((?:[^"\\]|\\.)*)"/g) || []).map(s => JSON.parse(s));
  if (!itens.length) return { ok: false, why: "lista `" + decl + "` de " + fonte + " saiu vazia da extração" };
  return { ok: true, itens: itens, fonte: fonte };
}
function tresCopiasDaLista() {
  const ler = p => { try { return fs.readFileSync(path.join(HERE, p), "utf8"); } catch (e) { return null; } };
  const tuim = ler("tests_ui_m31.js"), fx010 = ler("fixtures_010_vao.js");
  return [
    listaLiteral("produto (HTML construído · ui_v32.js:109-110)", HTML, "const HIDE_EYEBROWS = ["),
    tuim ? listaLiteral("oráculo de U15 (tests_ui_m31.js:279-280)", tuim, "const HIDE = [")
         : { ok: false, why: "tests_ui_m31.js ilegível — a cópia de U15 não pôde ser conferida" },
    fx010 ? listaLiteral("fixture da 010 (fixtures_010_vao.js:675-676)", fx010, "const D010_HIDE_EYEBROWS = [")
          : { ok: false, why: "fixtures_010_vao.js ilegível — a cópia da 010 não pôde ser conferida" }
  ];
}

T("D015-TIT1", "C1 · o título de #v32prio nomeia a leitura (tela e papel), com o sufixo só na tela, único e fora das listas de ocultação", () => gate(g => {
  /* (f) NÃO-VACUIDADE PRIMEIRO: sem sujeito, (a)-(e) fechariam verdes por
     ausência. E1/E5 NÃO têm `#v32prio` por desenho — a alínea NOMEIA os
     estados em que o sujeito existe e exige que existam de fato. */
  const comSujeito = ESTADOS.filter(e => FX.D015_FIXTURES[e].estado.v32prio);
  const semSujeito = ESTADOS.filter(e => !FX.D015_FIXTURES[e].estado.v32prio);
  let base = null;
  const okF = g.passo("(f) não-vacuidade: #v32prio e #pr-sup-prio existem nos estados declarados", () => {
    if (!comSujeito.length) vac("(f)", "nenhum estado declara `#v32prio` presente");
    comSujeito.forEach(e => {
      const c = censo("HEAD", e);
      if (!c.telaV32prio) throw new Error(e + ": #v32prio ausente, mas a fixture o declara presente");
      if (!c.supPrio) throw new Error(e + ": #pr-sup-prio ausente no papel, mas a fixture declara #v32prio presente");
      if (c.eyebrow == null) throw new Error(e + ": #v32prio existe mas não há `.eyebrow` no título que o precede — o sujeito de (a)-(e) não existe");
      if (c.h3PrioTag !== "H3") throw new Error(e + ": o irmão anterior de #pr-sup-prio é <" + c.h3PrioTag + ">, não <H3>");
    });
    /* o contraponto: onde a fixture declara ausência, ela tem de ser real —
       senão "sem sujeito" viraria desculpa universal */
    semSujeito.forEach(e => {
      const c = censo("HEAD", e);
      if (c.telaV32prio) throw new Error(e + ": #v32prio PRESENTE, mas a fixture o declara ausente — o estado de ausência não está sendo exercido");
    });
    base = censo("HEAD", comSujeito[0]);
    g.nota("estados COM sujeito: " + comSujeito.join(",") + " · SEM sujeito (nomeados): " + semSujeito.join(","));
    g.nota("eyebrow observado: " + JSON.stringify(base.eyebrow) + " · <h3> do papel: " + JSON.stringify(base.h3PrioTexto));
  });

  /* o eyebrow é literal constante: se variasse entre estados, (a)-(e) mediriam
     coisas diferentes a cada render e o gate seria não determinístico */
  g.passo("(pré) o eyebrow e o <h3> são os MESMOS em todos os estados com sujeito", () => {
    if (!okF) return;
    const ebs = Array.from(new Set(comSujeito.map(e => censo("HEAD", e).eyebrow)));
    const h3s = Array.from(new Set(comSujeito.map(e => censo("HEAD", e).h3PrioTexto)));
    if (ebs.length !== 1) throw new Error("o eyebrow varia entre estados: " + JSON.stringify(ebs));
    if (h3s.length !== 1) throw new Error("o <h3> do papel varia entre estados: " + JSON.stringify(h3s));
  });

  g.passo("(a) o eyebrow NÃO promete apoio — /apoi(o|ar|a)/i ausente", () => {
    if (!okF) return vac("(a)", "sem sujeito medido em (f)");
    if (RE_PROMESSA.test(base.eyebrow))
      throw new Error("o eyebrow ainda promete apoio: " + JSON.stringify(base.eyebrow) +
        " casa " + RE_PROMESSA);
  });
  g.passo("(b) o eyebrow mantém o sufixo `" + SUFIXO + "` (ratificado)", () => {
    if (!okF) return vac("(b)", "sem sujeito medido em (f)");
    if (base.eyebrow.indexOf(SUFIXO) < 0)
      throw new Error("o sufixo ratificado sumiu do eyebrow: " + JSON.stringify(base.eyebrow));
  });
  g.passo("(c) o <h3> do papel tem a MESMA oração principal do eyebrow", () => {
    if (!okF) return vac("(c)", "sem sujeito medido em (f)");
    const o = oracaoPrincipal(base.eyebrow);
    if (!o) throw new Error("a oração principal do eyebrow ficou vazia após remover o sufixo");
    if (o !== base.h3PrioTexto)
      throw new Error("tela e papel divergem · oração principal do eyebrow=" + JSON.stringify(o) +
        " · <h3> do papel=" + JSON.stringify(base.h3PrioTexto));
  });
  g.passo("(d) o <h3> do papel NÃO leva o sufixo (assimetria declarada)", () => {
    if (!okF) return vac("(d)", "sem sujeito medido em (f)");
    if (String(base.h3PrioTexto).indexOf(SUFIXO) >= 0 || RE_SUFIXO.test(base.h3PrioTexto))
      throw new Error("o sufixo de tela vazou para o papel: " + JSON.stringify(base.h3PrioTexto));
  });
  g.passo("(e) o eyebrow ≠ e não é substring do título congelado da 7ª seção", () => {
    if (!okF) return vac("(e)", "sem sujeito medido em (f)");
    if (base.eyebrow === TITULO_CONGELADO)
      throw new Error("o eyebrow é idêntico ao título congelado " + JSON.stringify(TITULO_CONGELADO));
    if (TITULO_CONGELADO.indexOf(base.eyebrow) >= 0)
      throw new Error("o eyebrow é substring do título congelado — não desambigua nada");
    /* R-1 (plan.md §2.2): `U1`/`U2`/`U7` varrem `.section-title` por
       `includes("Como a Fortinet pode apoiar")`. Conter a oração faria o
       eyebrow V3.2 ser contado como título congelado VISÍVEL quando deveria
       estar oculto, e `U2` reprovaria SUÍTE CONGELADA em vez deste gate. */
    if (base.eyebrow.indexOf("Como a Fortinet pode apoiar") >= 0)
      throw new Error("o eyebrow contém a oração guardada por U1/U2/U7 — quebraria suíte congelada, não este gate");
  });

  /* (g) UNICIDADE — dois escopos DISJUNTOS (o assert da fixture prova a
     disjunção). O precedente é vivo: `N40`/`N41` (`tests_journey_m45.js:220-231`)
     já reprovam duplicata por igualdade trimada. */
  g.passo("(g) [E1] o eyebrow é único em `#app .eyebrow,#app h3` e o <h3> é único em `#v32-print-report`", () => {
    if (!okF) return vac("(g)", "sem sujeito medido em (f)");
    comSujeito.forEach(e => {
      const c = censo("HEAD", e);
      if (!c.papelForaDoApp)
        throw new Error(e + ": #v32-print-report está DENTRO de #app — os dois escopos deixaram de ser disjuntos");
      const nTela = c.appTitulos.filter(t => t === c.eyebrow).length;
      if (nTela !== 1)
        throw new Error(e + ": o eyebrow " + JSON.stringify(c.eyebrow) + " aparece " + nTela +
          "x em `#app .eyebrow,#app h3` (esperado exatamente 1)");
      const nPapel = c.papelTitulos.filter(t => t === c.h3PrioTexto).length;
      if (nPapel !== 1)
        throw new Error(e + ": o título " + JSON.stringify(c.h3PrioTexto) + " aparece " + nPapel +
          "x entre os títulos de #v32-print-report (esperado exatamente 1)");
    });
  });

  /* (h1) as TRÊS cópias da lista de ocultação — a metade de (h) que M18 mata */
  g.passo("(h1) [E1] o eyebrow não pertence a NENHUMA das três cópias da lista de ocultação", () => {
    if (!okF) return vac("(h1)", "sem sujeito medido em (f)");
    const copias = tresCopiasDaLista();
    const ruins = copias.filter(c => !c.ok);
    if (ruins.length) throw new Error("cópia(s) não conferida(s): " + ruins.map(r => r.why).join(" · "));
    const dentro = copias.filter(c => c.itens.indexOf(base.eyebrow) >= 0).map(c => c.fonte);
    if (dentro.length)
      throw new Error("o eyebrow " + JSON.stringify(base.eyebrow) + " ENTROU na lista de ocultação em: " + dentro.join(" · "));
    g.nota("três cópias conferidas: " + copias.map(c => c.fonte + " (" + c.itens.length + " itens)").join(" · "));
  });

  /* (h2) CLÁUSULA DEFENSIVA INALCANÇÁVEL POR CONSTRUÇÃO, SEM MUTANTE.
     Medido em 2026-08-31: `hideLegacyRecommendation` varre só filhos DIRETOS
     do escopo de apoio e retorna em `#v32panel`; o `.section-title` de
     `#v32prio` vive dentro de `#v32panel > #v32support`, logo nenhum estado o
     alcança. Fica porque é o OBSERVÁVEL da propriedade e passaria a ter
     estado alcançável no dia em que o escopo do ocultador mudar — que é
     exatamente quando alguém precisa saber. Não é código morto: é a classe
     "cláusula defensiva declarada" já registrada em `design-decisions.md`. */
  g.passo("(h2) o nó do eyebrow nunca recebe `.v32-hidden` em E1..E7 [cláusula defensiva, sem mutante]", () => {
    if (!okF) return vac("(h2)", "sem sujeito medido em (f)");
    const sujos = comSujeito.filter(e => { const c = censo("HEAD", e); return c.eyebrowOculto || c.tituloEyebrowOculto; });
    if (sujos.length) throw new Error("o título do bloco V3.2 foi ocultado em: " + sujos.join(","));
    g.nota("(h2) inalcançável por construção — declarada SEM mutante (ver cabeçalho); estados varridos: " + comSujeito.join(","));
  });
}));

/* ==================================================================
   D015-ANC1 · C2 — o bloco de apoio junto do gap declara a ancoragem
   ================================================================== */
/* PROPRIEDADE, por duas expressões INDEPENDENTES — nunca a frase.
   EXPR-1 exige que a ANCORAGEM seja atribuída à capability; EXPR-2 exige a
   NEGAÇÃO explícita da ancoragem por nível. `M6` (afirmar ancoragem por
   nível) não satisfaz nenhuma das duas.
   ESCOPO ESTRITO: as duas rodam sobre o texto do PRÓPRIO `[data-pr-gap-fonte]`.
   Medir o `[data-pr-gap-support]` inteiro seria vacuoso — o cabeçalho
   `[data-pr-gap-cap]` da 5.1 já diz "Para a capability <b>X</b>:" e satisfaria
   EXPR-1 sozinho, com o nó novo dizendo qualquer coisa. */
const RE_ANC_CAP = /(parte|part[ei]m?|ancorad[ao]s?|âncora|ancora|deriva|vem|origem|baseia)[^.]{0,40}\bcapabilit(y|ies)\b/i;
const RE_ANC_NEG_NIVEL = /\bn[ãa]o\b[^.]{0,60}\bn[íi]ve(l|is)\b/i;

T("D015-ANC1", "C2 · todo [data-pr-gap-support] declara ancoragem por capability e nega ancoragem por nível, nos DOIS ramos", () => gate(g => {
  /* (e) NÃO-VACUIDADE PRIMEIRO — é a guarda que impede (a)-(d) de fecharem
     verdes sobre conjunto vazio. Contagem esperada DECLARADA por estado. */
  const comGap = ESTADOS.filter(e => FX.D015_FIXTURES[e].estado.gapSupportQids.length > 0);
  const semGap = ESTADOS.filter(e => FX.D015_FIXTURES[e].estado.gapSupportQids.length === 0);
  let nos = [];
  const okE = g.passo("(e) não-vacuidade: [data-pr-gap-support] não vazio e na contagem declarada por estado", () => {
    if (!comGap.length) vac("(e)", "nenhum estado declara gap-support presente");
    comGap.forEach(e => {
      const c = censo("HEAD", e), esperado = FX.D015_FIXTURES[e].estado.gapSupportQids;
      if (!c.gapSup.length) vac("(e)", e + ": nenhum [data-pr-gap-support] no papel");
      const obtido = c.gapSup.map(x => x.qid);
      if (JSON.stringify(obtido) !== JSON.stringify(esperado))
        throw new Error(e + ": qids " + JSON.stringify(obtido) + " ≠ declarados " + JSON.stringify(esperado));
      nos = nos.concat(c.gapSup.map(x => Object.assign({ estado: e }, x)));
    });
    semGap.forEach(e => {
      if (censo("HEAD", e).gapSup.length)
        throw new Error(e + ": gap-support PRESENTE onde a fixture declara ausência");
    });
    g.nota("estados com gap-support: " + comGap.join(",") + " · total de nós medidos: " + nos.length +
      " · sem gap (nomeados): " + semGap.join(","));
  });

  g.passo("(a) exatamente 1 [data-pr-gap-fonte] por bloco, com atributo PRÓPRIO e irmão de [data-pr-gap-why]", () => {
    if (!okE) return vac("(a)", "conjunto não estabelecido em (e)");
    const ruins = nos.filter(n => n.nFonte !== 1);
    if (ruins.length)
      throw new Error(ruins.length + "/" + nos.length + " bloco(s) sem exatamente 1 [data-pr-gap-fonte] · ex.: " +
        ruins.slice(0, 3).map(n => n.estado + "/" + n.qid + "=" + n.nFonte).join(", "));
    const herdeiros = nos.filter(n => n.fonteHerdaWhy);
    if (herdeiros.length)
      throw new Error(herdeiros.length + " nó(s) reusam `data-pr-gap-why` em vez do atributo próprio — quebraria P51-REC1 sem tocar no código dele");
    const dentro = nos.filter(n => n.fonteDentroDeWhy);
    if (dentro.length)
      throw new Error(dentro.length + " nó(s) nasceram DENTRO de [data-pr-gap-why]; o contrato é ser IRMÃO");
    const naoIrmaos = nos.filter(n => n.fonteIrmaDeWhy === false);
    if (naoIrmaos.length)
      throw new Error(naoIrmaos.length + " nó(s) não são irmãos de [data-pr-gap-why] · ex.: " +
        naoIrmaos.slice(0, 3).map(n => n.estado + "/" + n.qid).join(", "));
    const whyDemais = nos.filter(n => n.nWhy !== 1);
    if (whyDemais.length)
      throw new Error("a contagem de [data-pr-gap-why] deixou de ser 1 em " + whyDemais.length + " bloco(s) — P51-REC1 mediria outra coisa");
  });

  g.passo("(b) o texto casa a PROPRIEDADE por duas expressões independentes (capability × negação de nível)", () => {
    if (!okE) return vac("(b)", "conjunto não estabelecido em (e)");
    const semTexto = nos.filter(n => !n.fonteTexto);
    if (semTexto.length) throw new Error(semTexto.length + " nó(s) de ancoragem sem texto algum");
    const semCap = nos.filter(n => !RE_ANC_CAP.test(n.fonteTexto));
    if (semCap.length)
      throw new Error(semCap.length + "/" + nos.length + " nó(s) não atribuem a ancoragem à CAPABILITY (" + RE_ANC_CAP + ") · ex.: " +
        JSON.stringify((semCap[0].fonteTexto || "").slice(0, 140)));
    const semNeg = nos.filter(n => !RE_ANC_NEG_NIVEL.test(n.fonteTexto));
    if (semNeg.length)
      throw new Error(semNeg.length + "/" + nos.length + " nó(s) não NEGAM ancoragem por nível (" + RE_ANC_NEG_NIVEL + ") · ex.: " +
        JSON.stringify((semNeg[0].fonteTexto || "").slice(0, 140)));
    /* P51-REC1 fatia `host.textContent` por "." (`tests_p50_core.js:3418`):
       frase sem ponto final se funde à vizinha e pode arrastar "FortiClient"
       para fora do escopo de endpoint — reprovaria suíte congelada. */
    const semPonto = nos.filter(n => !/\.\s*$/.test(n.fonteTexto));
    if (semPonto.length)
      throw new Error(semPonto.length + " nó(s) não terminam em ponto final — o scanner de P51-REC1 fundiria a frase à vizinha");
  });

  g.passo("(c) presente nos DOIS ramos de qsGapSupportHTML, medido em fixtures distintas", () => {
    if (!okE) return vac("(c)", "conjunto não estabelecido em (e)");
    const porRamo = { DECL: [], NDECL: [] };
    nos.forEach(n => { if (porRamo[n.ramo]) porRamo[n.ramo].push(n); });
    ["NDECL", "DECL"].forEach(r => {
      if (!porRamo[r].length)
        vac("(c)", "nenhum nó no ramo " + r + " — o ramo não foi exercido por fixture alguma e M5 sobreviveria");
      const estados = Array.from(new Set(porRamo[r].map(n => n.estado)));
      const faltando = porRamo[r].filter(n => n.nFonte !== 1);
      if (faltando.length)
        throw new Error("ramo " + r + ": " + faltando.length + "/" + porRamo[r].length +
          " nó(s) sem a declaração de ancoragem · estados " + estados.join(",") +
          " · ex.: " + faltando.slice(0, 3).map(n => n.estado + "/" + n.qid).join(", "));
    });
    const fixturesDecl = Array.from(new Set(porRamo.DECL.map(n => n.estado)));
    const fixturesNdecl = Array.from(new Set(porRamo.NDECL.map(n => n.estado)));
    if (!fixturesDecl.length || !fixturesNdecl.length)
      vac("(c)", "um dos ramos não tem fixture própria");
    g.nota("ramo NDECL nos estados " + fixturesNdecl.join(",") + " (" + porRamo.NDECL.length + " nós) · " +
      "ramo DECL nos estados " + fixturesDecl.join(",") + " (" + porRamo.DECL.length + " nós)");
  });

  g.passo("(d) o nó não nomeia produto e não repete a lista de opções", () => {
    if (!okE) return vac("(d)", "conjunto não estabelecido em (e)");
    const comProduto = nos.filter(n => /Forti[A-Z]/.test(n.fonteTexto || ""));
    if (comProduto.length)
      throw new Error(comProduto.length + " nó(s) nomeiam produto (/Forti[A-Z]/) · ex.: " +
        JSON.stringify((comProduto[0].fonteTexto || "").slice(0, 140)));
    const repetem = nos.filter(n => (n.opts || []).some(o => o && (n.fonteTexto || "").indexOf(o) >= 0));
    if (repetem.length)
      throw new Error(repetem.length + " nó(s) repetem nome(s) da lista de opções dentro da declaração de ancoragem");
    /* overclaim de P51-REC1 (`:3429`): o caminho seguro é não usar nenhuma */
    const OVER = [/é obrigatório/i, /requisito obrigatório/i, /solução completa/i, /compra recomendada/i];
    const over = nos.filter(n => OVER.some(re => re.test(n.fonteTexto || "")));
    if (over.length)
      throw new Error(over.length + " nó(s) usam expressão de overclaim guardada por P51-REC1");
  });
}));

/* ==================================================================
   D015-HOWTO1 · C3 — a regra geral entra na caixa "Como interpretar"
   ================================================================== */
/* TRANSCRITOS da âncora `tests_p50_core.js:3831-3837` (P51-DOC12). Transcrição
   e não leitura em execução: gate não spawna nem lê outra suíte como oráculo
   (R10 §6) — mesmo precedente da ordem canônica em `tests_010_vao.js`. */
const HOWTO_SEIS = [
  [/score.{0,60}estágio.{0,80}respostas confirmadas/i, "score/estágio vêm das respostas confirmadas"],
  [/contexto tecnológico não altera a nota/i, "contexto não altera a nota"],
  [/refina.{0,60}(classificação|recomenda)/i, "contexto refina classificação e recomendações"],
  [/n\/d.{0,60}não avaliado.{0,20}nunca zero|n\/d.{0,40}não avaliado/i, "n/d é não avaliado, não zero"],
  [/cenário-alvo.{0,60}desejado/i, "Target é cenário desejado"],
  [/recomendações são possibilidades/i, "recomendações são possibilidades condicionadas"]
];
/* A REGRA NOVA, por duas expressões independentes — nunca a frase. */
const RE_MAIS_DE_UMA = /(mais de uma|mais de um|duas ou mais|múltiplas|diferentes)[^.]{0,40}\blistas?\b/i;
const RE_NAO_SOMAM = /\bn[ãa]o\b[^.]{0,60}\bsom(a|am|ar|am-se|adas|ados|atória)\b/i;
/* Orçamento MEDIDO em 2026-08-31 nesta worktree, ANTES da implementação:
   crua 585 · normalizada 544 · 6 `li` · custo estrutural de um `<li>` na
   métrica CRUA = 7 (6 espaços de indentação + `\n`). Folga visível: 308.
   As duas métricas ficam registradas na saída a cada execução — a que
   REPROVA PRIMEIRO é a crua, e foi por medir pelo instrumento errado que a
   estimativa de ~540 (normalizada) circulou como se fosse a vinculante. */
const HOWTO_TETO = 900;
const HOWTO_ANTES_CRUA = 585, HOWTO_ANTES_NORM = 544, HOWTO_ORCAMENTO_ITEM = 308;

T("D015-HOWTO1", "C3 · 7º item estático com a regra das listas concorrentes, dentro das DUAS métricas de orçamento", () => gate(g => {
  const comHowto = ESTADOS.filter(e => censo("HEAD", e).howtoOuter !== null);
  let base = null;
  const okPre = g.passo("(pré) não-vacuidade: #pr-howto existe nos estados varridos", () => {
    if (!comHowto.length) vac("(pré)", "#pr-howto não existe em estado algum — nenhuma alínea de C3 mediria coisa alguma");
    base = censo("HEAD", comHowto[0]);
    g.nota("estados com #pr-howto: " + comHowto.join(","));
  });

  g.passo("(b) as DUAS métricas sob o teto de " + HOWTO_TETO + ", cada uma nomeada com a sua suíte", () => {
    if (!okPre) return vac("(b)", "sem sujeito");
    comHowto.forEach(e => {
      const c = censo("HEAD", e);
      g.nota(e + " · crua=" + c.howtoCrua + " (P51-DOC12 · tests_p50_core.js:3827-3828 · antes=" + HOWTO_ANTES_CRUA +
        " · Δ=" + (c.howtoCrua - HOWTO_ANTES_CRUA) + ")" +
        " · normalizada=" + c.howtoNorm + " (PDF · tests_p50_chromium.js:3570-3571,:3597 · antes=" + HOWTO_ANTES_NORM +
        " · Δ=" + (c.howtoNorm - HOWTO_ANTES_NORM) + ")");
      if (c.howtoCrua > HOWTO_TETO)
        throw new Error(e + ": métrica CRUA " + c.howtoCrua + " > " + HOWTO_TETO + " — é a que reprova primeiro (P51-DOC12)");
      if (c.howtoNorm > HOWTO_TETO)
        throw new Error(e + ": métrica NORMALIZADA " + c.howtoNorm + " > " + HOWTO_TETO + " (gate de PDF)");
    });
  });

  g.passo("(a) #pr-howto li === 7, dentro da faixa 5-8 exigida por P51-DOC12 e pelo gate de PDF", () => {
    if (!okPre) return vac("(a)", "sem sujeito");
    comHowto.forEach(e => {
      const n = censo("HEAD", e).howtoLis.length;
      if (n < 5 || n > 8) throw new Error(e + ": " + n + " itens — fora da faixa 5..8 das suítes congeladas");
      if (n !== 7) throw new Error(e + ": " + n + " itens na caixa; esperado 7 (os 6 de 5.1 + a regra das listas concorrentes)");
    });
  });

  g.passo("(c) o item novo casa a PROPRIEDADE por duas expressões (mais de uma lista + não se somam), e cabe em " + HOWTO_ORCAMENTO_ITEM + " chars visíveis", () => {
    if (!okPre) return vac("(c)", "sem sujeito");
    comHowto.forEach(e => {
      const lis = censo("HEAD", e).howtoLis;
      const cands = lis.filter(t => RE_MAIS_DE_UMA.test(t) && RE_NAO_SOMAM.test(t));
      if (!cands.length) {
        const soA = lis.filter(t => RE_MAIS_DE_UMA.test(t)).length, soB = lis.filter(t => RE_NAO_SOMAM.test(t)).length;
        throw new Error(e + ": nenhum item comunica a regra das listas concorrentes · itens casando só 'mais de uma lista'=" +
          soA + ", só 'não se somam'=" + soB + " de " + lis.length);
      }
      if (cands.length > 1) throw new Error(e + ": " + cands.length + " itens comunicam a mesma regra — a caixa passou a repetir");
      if (cands[0].length > HOWTO_ORCAMENTO_ITEM)
        throw new Error(e + ": o item novo tem " + cands[0].length + " caracteres visíveis; orçamento medido " + HOWTO_ORCAMENTO_ITEM);
    });
  });

  g.passo("(d) a caixa continua ESTÁTICA — outerHTML idêntico entre duas sessões de dados diferentes", () => {
    if (!okPre) return vac("(d)", "sem sujeito");
    /* E2 (15 confirmadas, 4 gaps, alvo, contexto) × E7 (1 confirmada,
       suficiência FECHADA, sem findings, sem alvo): se a caixa passar a
       depender de `ans`/`suff`/`stats`, estes dois divergem. */
    const A = censo("HEAD", "E2"), B = censo("HEAD", "E7");
    if (A.howtoOuter === null || B.howtoOuter === null)
      vac("(d)", "uma das duas sessões não produziu #pr-howto — a comparação seria vazio contra vazio");
    if (A.howtoOuter !== B.howtoOuter)
      throw new Error("a caixa varia com os dados da sessão · E2 tem " + A.howtoLis.length + " itens/" +
        A.howtoCrua + " chars, E7 tem " + B.howtoLis.length + "/" + B.howtoCrua);
    /* controle de não-degenerescência: as duas sessões TÊM de ser diferentes
       em algum observável, senão (d) compararia um render consigo mesmo */
    if (A.lenSupport === B.lenSupport && A.lenFindings === B.lenFindings)
      vac("(d)", "E2 e E7 produziram o mesmo papel — não são sessões de dados diferentes e (d) seria tautológica");
  });

  g.passo("(e) os 6 conteúdos exigidos por P51-DOC12 continuam casando", () => {
    if (!okPre) return vac("(e)", "sem sujeito");
    comHowto.forEach(e => {
      const t = censo("HEAD", e).howtoLis.join(" ").replace(/\s+/g, " ");
      const faltam = HOWTO_SEIS.filter(([re]) => !re.test(t)).map(([, nome]) => nome);
      if (faltam.length) throw new Error(e + ": a caixa deixou de comunicar: " + faltam.join(" · "));
    });
  });
}));

/* ==================================================================
   D015-NOSUB1 · C5 — NADA é removido (ratificação do proprietário)
   ==================================================================
   CRITÉRIO DE PRESERVAÇÃO: nasce VERDE por desenho, e a dívida está escrita
   aqui, na linha. No commit do red, âncora e HEAD são o MESMO blob — o gate é
   tautológico NESTE instante e passa a discriminar quando `ui_v32.js` mudar
   (T011) e o rebuild entrar (T015). Seu poder NÃO vem da fixture: vem de
   `M14` (colapsar em aviso o card de prioridade sem payload — rota S4,
   recusada) e `M15` (suprimir o `pr-gapsup` do qid que é prática-alvo — rota
   T5, recusada). Enquanto os dois não estiverem DETECTADOS, este verde não é
   evidência de nada — e é por isso que a bateria negativa da Fase 4 injeta as
   duas remoções e prova que o julgador as reprova. */
function exigeAncora(g, alinea) {
  if (!ANCORA.ok) { g.naoMedido(alinea, "âncora indisponível — " + ANCORA.why); return false; }
  return true;
}
const conj = a => (a === null ? null : a.slice().sort());
const igual = (a, b) => JSON.stringify(conj(a)) === JSON.stringify(conj(b));

T("D015-NOSUB1", "C5 · nada foi removido em E1..E7 contra a âncora imutável " + D015_ANCORA_COMMIT.slice(0, 7), () => gate(g => {
  if (!exigeAncora(g, "(âncora)")) return;
  g.nota("âncora conferida: " + ANCORA.spec + " · " + ANCORA.bytes + " bytes · sha256 " + ANCORA.sha.slice(0, 16) + "…");

  const medido = { a: [], b: [], c: [], d: [] };
  const erros = [];
  ESTADOS.forEach(e => {
    const A = censo("ANCORA", e), H = censo("HEAD", e);
    /* O CENSO DE NÃO-VACUIDADE SAI DO LADO DA ÂNCORA, e é INDEPENDENTE do
       resultado da comparação. Medi-lo só quando os lados batem confunde
       "o conjunto está vazio" com "o conjunto DIVERGIU": sob qualquer remoção
       real, (e) fecharia vermelha por vacuidade e MASCARARIA a alínea que de
       fato reprova — o mutante morreria pelo motivo errado. Medido na bateria
       negativa desta Fase 4 com o `M15` isolante: era exatamente isto que
       acontecia antes desta correção. */
    if ((A.v32prioCaps || []).length) medido.a.push(e + "(" + A.v32prioCaps.length + ")");
    if ((A.opts || []).length) medido.b.push(e + "(" + A.opts.length + ")");
    [["#pr-sup-prio", "supPrioCaps"], ["#pr-sup-base", "supBaseCaps"], ["#pr-sup-maturity", "supMatCaps"]].forEach(([nome, k]) => {
      if ((A[k] || []).length) medido.c.push(e + " " + nome + "(" + A[k].length + ")");
    });
    [["#pr-support", "lenSupport"], ["#pr-findings", "lenFindings"]].forEach(([nome, k]) => {
      if (A[k] !== null) medido.d.push(e + " " + nome + "(" + A[k] + "→" + (H[k] === null ? "ausente" : H[k]) + ")");
    });

    /* (a) conjunto de data-cap de #v32prio */
    if ((A.v32prioCaps !== null || H.v32prioCaps !== null) && !igual(A.v32prioCaps, H.v32prioCaps))
      erros.push("(a) " + e + ": #v32prio caps âncora=" + JSON.stringify(conj(A.v32prioCaps)) + " ≠ HEAD=" + JSON.stringify(conj(H.v32prioCaps)));
    /* (b) conjunto de nomes em [data-pr-gap-opt] */
    if (!igual(A.opts, H.opts))
      erros.push("(b) " + e + ": nomes de [data-pr-gap-opt] âncora=" + JSON.stringify(conj(A.opts)) + " ≠ HEAD=" + JSON.stringify(conj(H.opts)));
    /* (c) data-cap de #pr-sup-prio, #pr-sup-base, #pr-sup-maturity */
    [["#pr-sup-prio", "supPrioCaps"], ["#pr-sup-base", "supBaseCaps"], ["#pr-sup-maturity", "supMatCaps"]].forEach(([nome, k]) => {
      if (!igual(A[k], H[k]))
        erros.push("(c) " + e + " " + nome + ": âncora=" + JSON.stringify(conj(A[k])) + " ≠ HEAD=" + JSON.stringify(conj(H[k])));
    });
    /* (d) comprimentos de #pr-support e #pr-findings NÃO DIMINUEM */
    [["#pr-support", "lenSupport"], ["#pr-findings", "lenFindings"]].forEach(([nome, k]) => {
      if (A[k] === null) return;                        /* nasceu no HEAD: aditivo, legítimo */
      if (H[k] === null) { erros.push("(d) " + e + " " + nome + ": existia na âncora e SUMIU no HEAD"); return; }
      if (H[k] < A[k]) erros.push("(d) " + e + " " + nome + ": " + A[k] + " → " + H[k] + " caracteres (DIMINUIU " + (A[k] - H[k]) + ")");
    });
  });

  /* (e) NÃO-VACUIDADE: cada conjunto comparado tem de ser não vazio em ao
     menos um estado, NOMEADO. Sem isto, (a)-(d) fechariam verdes comparando
     ausência contra ausência — a vacuidade que a 010 encontrou em 4 alíneas. */
  g.passo("(e) não-vacuidade: cada conjunto comparado é não vazio em ao menos um estado, nomeado", () => {
    const vazios = [];
    if (!medido.a.length) vazios.push("(a) #v32prio [data-cap]");
    if (!medido.b.length) vazios.push("(b) [data-pr-gap-opt]");
    if (!medido.c.length) vazios.push("(c) #pr-sup-* [data-cap]");
    if (!medido.d.length) vazios.push("(d) comprimento de #pr-support/#pr-findings");
    if (vazios.length)
      vac("(e)", "conjunto(s) vazio(s) em TODOS os estados: " + vazios.join(" · "));
    /* NÃO-DEGENERESCÊNCIA DE FORMA: se todos os estados produzirem o MESMO
       `#v32prio`, (a) mede um shape só e a promessa de que os QUATRO estados do
       bloco continuam intactos nunca é exercida. Medido em 2026-08-31: E4
       carrega `external-exposure`, que entra em `prioCaps` SÓ pela cláusula
       `businessPriority.flag` — é o único caso que `M14` ataca, e sem ele
       aquele mutante SOBREVIVIA. Esta cláusula não pré-empta (a): sob `M14` os
       shapes continuam distintos (E7 tem 1 cap), e quem reprova é a alínea. */
    const shapes = Array.from(new Set(ESTADOS
      .map(e => censo("ANCORA", e).v32prioCaps)
      .filter(x => x !== null)
      .map(x => JSON.stringify(conj(x)))));
    if (shapes.length < 2)
      vac("(e)", "todos os estados produzem o MESMO #v32prio (" + shapes.join("") +
        ") — (a) mediria um único shape e os quatro estados do bloco não seriam exercidos");
    g.nota("(a) shapes distintos de #v32prio exercidos: " + shapes.length + " · " + shapes.join(" | "));
    g.nota("(a) medido em " + medido.a.join(", "));
    g.nota("(b) medido em " + medido.b.join(", "));
    g.nota("(c) medido em " + medido.c.join(", "));
    g.nota("(d) medido em " + medido.d.join(", "));
  });

  g.passo("(a)(b)(c)(d) nenhum conjunto encolheu em E1..E7", () => {
    if (erros.length) throw new Error(erros.length + " remoção(ões) detectada(s) · " + erros.join("  ⟂  "));
  });
}));

/* ==================================================================
   D015-GOV1 · C6 — a autorização nominal não foi excedida
   ==================================================================
   Prova pelo PRODUTO, não só pelo hash: `ui_target_v32.js` é protegido §29.4 e
   NÃO autorizado, e o que ele emite (`#pr-target`) tem de sair byte-idêntico.
   Também nasce VERDE por preservação; o discriminante é `M16` (mover a
   declaração de C2 para o card-alvo), que roda em worktree efêmera (T022)
   porque muta arquivo `PROTECTED` — o harness automatizado nunca o toca.
   `#pr-target` é lido do HTML CONSTRUÍDO: ler não é tocar. */
T("D015-GOV1", "C6 · #pr-target byte-idêntico à âncora em E1..E7 — ui_target_v32.js intocado, provado pelo produto", () => gate(g => {
  if (!exigeAncora(g, "(âncora)")) return;

  const comAlvo = [], semAlvo = [], erros = [];
  ESTADOS.forEach(e => {
    const A = censo("ANCORA", e), H = censo("HEAD", e);
    if (A.alvoOuter === null && H.alvoOuter === null) { semAlvo.push(e); return; }
    if (A.alvoOuter !== null && H.alvoOuter === null) { erros.push("(a) " + e + ": #pr-target existia na âncora e SUMIU no HEAD"); return; }
    if (A.alvoOuter === null && H.alvoOuter !== null) { erros.push("(a) " + e + ": #pr-target NASCEU no HEAD onde a âncora não tinha — o card-alvo mudou"); return; }
    comAlvo.push(e);
    if (A.alvoOuter !== H.alvoOuter) {
      const i = (() => { let k = 0; while (k < A.alvoOuter.length && A.alvoOuter[k] === H.alvoOuter[k]) k++; return k; })();
      erros.push("(a) " + e + ": #pr-target DIVERGE (âncora " + A.alvoOuter.length + " bytes, HEAD " +
        H.alvoOuter.length + "; 1ª diferença em " + i + ": …" +
        JSON.stringify(A.alvoOuter.slice(i, i + 80)) + " × …" + JSON.stringify(H.alvoOuter.slice(i, i + 80)) + ")");
    }
    /* as três superfícies que a spec nomeia dentro do card */
    [["·ux-tgt-en", "alvoEn"], ["[data-ux-enablers=a-validar]", "alvoAValidar"],
     ["[data-ux-absence=target-enablers]", "alvoAusencia"]].forEach(([nome, k]) => {
      if (A[k] !== H[k]) erros.push("(a) " + e + " " + nome + ": âncora=" + A[k] + " ≠ HEAD=" + H[k]);
    });
    if (!igual(A.alvoEids, H.alvoEids))
      erros.push("(b) " + e + ": data-eid âncora=" + JSON.stringify(conj(A.alvoEids)) + " ≠ HEAD=" + JSON.stringify(conj(H.alvoEids)));
  });

  /* (c) NÃO-VACUIDADE, nomeada: sem um estado com card-alvo POVOADO, (a) e (b)
     comparariam ausência contra ausência nos sete estados. */
  g.passo("(c) não-vacuidade: ao menos um estado com #pr-target presente e [data-ux-enablers] não vazio, nomeado", () => {
    if (!comAlvo.length)
      vac("(c)", "#pr-target ausente na âncora E no HEAD em TODOS os estados — (a) e (b) não teriam sujeito");
    const povoados = comAlvo.filter(e => (censo("ANCORA", e).alvoEids || []).length > 0 && censo("ANCORA", e).alvoEn > 0);
    if (!povoados.length)
      vac("(c)", "#pr-target existe em " + comAlvo.join(",") + " mas sem `.ux-tgt-en` e sem `data-eid` em nenhum — casca vazia não prova preservação");
    const comAValidar = comAlvo.filter(e => censo("ANCORA", e).alvoAValidar > 0);
    if (!comAValidar.length)
      vac("(c)", "nenhum estado exercita `[data-ux-enablers=\"a-validar\"]` — a superfície que a spec nomeia ficaria fora da comparação");
    g.nota("estados com #pr-target povoado: " + povoados.map(e => e + "(eid=" + censo("ANCORA", e).alvoEids.length +
      ", en=" + censo("ANCORA", e).alvoEn + ", a-validar=" + censo("ANCORA", e).alvoAValidar + ")").join(" · "));
  });

  /* (d) CLÁUSULA DEFENSIVA, sem mutante (classe registrada em
     `design-decisions.md` §Candidatas, pela 010): E6 é ausência LEGÍTIMA de
     `#pr-target` — sem cenário-alvo declarado o card não nasce
     (`ui_target_v32.js:426`). O gate NOMEIA o estado para que a ausência nunca
     seja lida como regressão de boundary nem feche alínea por vacuidade. */
  g.passo("(d) E6 é ausência LEGÍTIMA de #pr-target, nomeada e não confundida com regressão", () => {
    if (semAlvo.indexOf("E6") < 0)
      throw new Error("E6 deveria ser o estado sem cenário-alvo, mas #pr-target foi observado nele — a guarda de (d) perdeu o caso que ela nomeia");
    const inesperados = semAlvo.filter(e => FX.D015_FIXTURES[e].estado.prTarget);
    if (inesperados.length)
      throw new Error("estado(s) sem #pr-target que a fixture declara COM alvo: " + inesperados.join(","));
    g.nota("ausência legítima (declarada): " + semAlvo.join(",") + " · comparação efetiva em: " + comAlvo.join(","));
  });

  g.passo("(a)(b) #pr-target e o conjunto de data-eid idênticos nos estados com alvo", () => {
    if (erros.length) throw new Error(erros.length + " divergência(s) · " + erros.join("  ⟂  "));
  });
}));

/* ============================== resumo ============================== */
if (!ANCORA.ok) console.log("\n### ÂNCORA NÃO RESOLVIDA: " + ANCORA.why + " — D015-NOSUB1 e D015-GOV1 reportam NÃO MEDIDO, nunca SKIP ###");
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD015 SUPERFÍCIES DE APOIO: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
