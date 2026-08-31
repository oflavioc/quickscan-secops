/* ============================================================================
   TESTES D010 · RECOMENDAÇÃO SEM VÃO (jsdom) — demanda 010-recomendacao-sem-vao
   Namespace exclusivo D010-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria.

   ==========================================================================
   O QUE ESTA SUÍTE JULGA, E COM QUE ORÁCULO
   ==========================================================================
   Os 13 gates traduzem C1..C13 de `specs/010-recomendacao-sem-vao/spec.md`
   (§"Critérios de aceite → gates"), já com a ERRATA DE VACUIDADE de
   2026-08-30 (E1..E9). Cada oráculo é independente do módulo sob teste:

     · o predicado "há substituto" é REIMPLEMENTADO da spec §1 dentro de
       `fixtures_010_vao.js` (`d010HasSubstitute`) — nunca lido de
       `__DEV.hasSubstitute`. Quem lê o produto para julgar o produto não julga;
     · `MAP`, `PRODUCTS`, `QS` e `ans` NÃO existem em `window` (errata E7): são
       `const` de topo de script clássico. O acesso é pelos helpers da fixture
       (`d010MapKeys`, `d010MapItems`, `d010ProductName`, `d010Answers`), nunca
       por `w.MAP` e nunca por leitura do DOM;
     · a tabela de equivalência de nome é RE-DERIVADA do catálogo congelado a
       cada execução por `d010EquivalenciaNome(w)` — heurística de nome é
       PROIBIDA aqui tanto quanto no produto (C10 (e));
     · o veredito de suficiência é CONSUMIDO como dado (`gateSuficiencia` /
       `diferencialC9` das fixtures + as funções canônicas do runtime): esta
       suíte NÃO altera nem reimplementa `dataSufficiency`, que vive em arquivo
       `frozen` (errata E5);
     · o censo da Camada 1 de `D010-ARB1` (d) e `D010-ARB3` (c) é COMPARATIVO:
       mede o render V3.2, depois volta ao modo legado pela rota canônica
       (`V32.resetLandscapeToUnset()`) e compara item a item. A ORDEM é
       obrigatória — censo primeiro, reset depois; invertida, a declaração é
       destruída antes de ser medida (plan.md §Restrições, item 8).

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   A errata de vacuidade (spec, 2026-08-30) fixou a contrapartida: ALÍNEA QUE
   DEPENDE DE CASO DECLARA ELA MESMA A PRÉ-CONDIÇÃO e falha NOMEANDO a
   vacuidade, em vez de fechar verde por ausência de caso. Toda asserção de
   AUSÊNCIA nesta suíte é precedida da prova de que o universo em que ela se
   aplica não está vazio. `vac()` existe para que essa falha tenha uma forma
   só, reconhecível na saída.

   ==========================================================================
   O QUE ESTA SUÍTE NÃO FAZ
   ==========================================================================
   · não spawna outra suíte e não usa regex sobre stdout PT-BR como oráculo
     (R10 §6): a ordem canônica do relatório impresso é TRANSCRITA aqui da
     âncora de `P51-DOC13`, não lida de `tests_p50_core.js` em execução;
   · não escreve arquivo versionado (R7 §3);
   · não pina hash inline (R8) — nenhum gate desta suíte consome hash;
   · o scanner de `D010-CARD4` (e) tem ESCOPO declarado e AUTO-EXCLUSÃO NOMINAL
     IMPRESSA (R10 §10): varre `ui_target_v32.js` e nada mais, porque este
     arquivo e `fixtures_010_vao.js` carregam os literais proibidos por dever
     de ofício e reprovariam a si mesmos.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");
const FX = require("./fixtures_010_vao.js");

const HERE = __dirname;
const HTML_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");
const TGT_JS_PATH = path.join(HERE, "ui_target_v32.js");
const TGT_SRC = fs.readFileSync(TGT_JS_PATH, "utf8");

const results = [];
const ONLY = (process.env.D010_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, err = "";
  try { ok = !!fn(); } catch (x) { err = " [" + x.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + err);
}
/* ==========================================================================
   POR QUE CADA GATE ACUMULA AS ALÍNEAS EM VEZ DE PARAR NA PRIMEIRA
   ==========================================================================
   Um gate que interrompe na alínea (a) esconde o veredito de (b)..(f): quem lê
   o vermelho não sabe se as demais estão verdes ou apenas não foram medidas —
   e no verde ninguém percebe que uma cláusula deixou de ser exercida. Cada
   `passo()` roda mesmo depois de um irmão falhar; a falha do GATE é a soma. A
   alínea que depende de um passo anterior chama `naoMedido()`, que é FALHA
   NOMEADA e nunca silêncio (R10 §2). O veredito do gate continua sendo um só.
   ========================================================================== */
function gate(fn) {
  const erros = [], oks = [];
  const g = {
    passo(nome, f) {
      try { f(); oks.push(nome); return true; }
      catch (x) { erros.push(nome + " → " + x.message); return false; }
    },
    naoMedido(nome, porque) { erros.push(nome + " → NÃO MEDIDO: " + porque); return false; },
    nota(s) { console.log("       · " + s); }
  };
  fn(g);
  if (erros.length) {
    if (oks.length) console.log("       · alíneas OK neste render: " + oks.join(", "));
    throw new Error(erros.length + " alínea(s) · " + erros.join("  ⟂  "));
  }
  return true;
}
/* forma única da falha por vacuidade: a alínea não mediu nada e diz por quê */
function vac(alinea, motivo) {
  throw new Error("VACUIDADE em " + alinea + " — " + motivo +
    " · a alínea não teria medido nada e por isso FALHA, em vez de fechar verde");
}

/* ============================== runtime ============================== */
const boot = () => {
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  return { w: dom.window, d: dom.window.document };
};
/* Sempre um runtime NOVO: vários gates mexem no estado (reset de landscape,
   resposta "NA", print) e cache entre gates faria um contaminar o outro —
   defeito que só aparece quando a ordem muda. O custo é tempo, não verdade. */
function R(fxId) {
  const fx = FX.D010_FIXTURES[fxId];
  if (!fx) throw new Error("fixture desconhecida: " + fxId);
  const r = boot();
  FX.d010ApplyResults(r.w, r.d, fx);
  FX.d010AssertFixtureStates(r.w, fx);      /* estado declarado, provado antes de julgar */
  r.fx = fx;
  return r;
}
const qa = (n, s) => Array.from(n.querySelectorAll(s));
const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const nomeCap = (w, id) => w.__DEV.V32.CAPABILITIES[id].name;

/* Nenhum gate de TELA pode medir com o relatório impresso montado no mesmo
   documento: os dois emitem os mesmos seletores e o censo somaria as duas
   superfícies. Esta guarda transforma esse engano em FAIL nomeado. */
function exigeTelaLimpa(d, gate) {
  const pr = d.getElementById("v32-print-report");
  if (pr && (pr.innerHTML || "").trim())
    throw new Error(gate + ": #v32-print-report já montado neste documento — censo de tela contaminado pelo papel");
}

/* ======================= censo da Camada 1 (congelada) ======================= */
/* Região da Camada 1 varrida pela arbitragem: filhos DIRETOS da seção de apoio
   (ou da tela, quando o workspace 5.2 não agrupou). É o mesmo domínio que a
   spec §C3 descreve — títulos de `HIDE_EYEBROWS` e blocos contíguos permitidos.
   Derivado do texto da spec, não lido do produto. */
const CLASSES_CONTIGUAS = ["apoio-block", "t-list", "t-details"];
function escopoApoio(d) {
  const screen = d.querySelector("section.screen");
  if (!screen) throw new Error("section.screen ausente — a tela de resultados não foi alcançada");
  return screen.querySelector('[data-p52-legacy-scope="support"]') || screen;
}
function assinatura(node) {
  const cls = String(node.className || "").split(/\s+/).filter(c => c && c !== "v32-hidden").sort().join(".");
  return cls + "#" + txt(node).slice(0, 60);
}
/* Itens da Camada 1 presentes, em ordem, com visibilidade e o nó de origem. */
function censoCamada1(d) {
  const out = [];
  let dentro = false;
  Array.from(escopoApoio(d).children).forEach(node => {
    if (node.id === "v32panel") { dentro = false; return; }
    const isTitle = node.classList && node.classList.contains("section-title");
    if (isTitle) {
      const eb = node.querySelector(".eyebrow");
      const t = eb ? (eb.textContent || "").replace(/\s+/g, " ").trim() : "";
      dentro = FX.D010_HIDE_EYEBROWS.indexOf(t) >= 0;
      if (dentro) out.push({ tipo: "titulo", chave: t, oculto: node.classList.contains("v32-hidden"), no: node });
      return;
    }
    const permitido = node.classList && CLASSES_CONTIGUAS.some(c => node.classList.contains(c));
    if (dentro && permitido) out.push({ tipo: "bloco", chave: assinatura(node), oculto: node.classList.contains("v32-hidden"), no: node });
    else if (dentro && !permitido) dentro = false;
  });
  return out;
}
const visiveis = censo => censo.filter(x => !x.oculto).map(x => x.tipo + "|" + x.chave);
/* Filhos diretos do escopo que carregam `.v32-hidden` — o conjunto que a
   arbitragem de fato produz. */
function ocultosDiretos(d) {
  return Array.from(escopoApoio(d).children).filter(n => n.classList && n.classList.contains("v32-hidden"));
}
/* Censo V3.2 → rota canônica para o legado → censo legado. ORDEM OBRIGATÓRIA. */
function censoContraLegado(w, d, gate) {
  const antes = censoCamada1(d);
  if (!antes.length)
    vac(gate, "nenhum título de HIDE_EYEBROWS presente no render V3.2 — sem Camada 1 não há vão a medir");
  w.__DEV.V32.resetLandscapeToUnset();
  w.__DEV.showResults();
  if (w.__DEV.V32.isLegacyModeV32() !== true)
    throw new Error(gate + ": resetLandscapeToUnset() não devolveu o runtime ao modo legado — o segundo render não é comparável");
  const depois = censoCamada1(d);
  if (!visiveis(depois).length)
    vac(gate, "o render em modo legado não expõe nó algum da Camada 1 — a comparação seria vazio contra vazio");
  return { v32: antes, legado: depois };
}

/* ====================== habilitadores no cartão-alvo ====================== */
/* Nós `[data-ux-enablers="a-validar"]` por qid, na TELA. A guarda de soma é a
   mesma disciplina de `d010TargetEnablers`: nó fora do `li` conhecido faria
   toda asserção de ausência virar PASS vacuoso. */
function aValidarPorQid(d, gate) {
  exigeTelaLimpa(d, gate);
  const out = {};
  let soma = 0;
  qa(d, "li.ux-tgt-ov[data-qid]").forEach(li => {
    const nos = qa(li, '[data-ux-enablers="a-validar"]');
    out[li.getAttribute("data-qid")] = nos;
    soma += nos.length;
  });
  const total = qa(d, '[data-ux-enablers="a-validar"]').length;
  if (total !== soma)
    throw new Error(gate + ": " + total + " nós `a-validar` no documento mas " + soma +
      " dentro de `li.ux-tgt-ov[data-qid]` — o nó nasceu fora do cartão-alvo e o censo por qid é cego a ele");
  return out;
}
const chipDe = s => ({
  eid: s.getAttribute("data-eid"),
  nome: txt(s.querySelector(".ux-tgt-enabler-name")),
  modo: txt(s.querySelector(".ux-tgt-mode")),
  no: s
});
const itensDe = no => qa(no, ".ux-tgt-enabler").map(chipDe);
const itensDeVarios = nos => nos.reduce((a, n) => a.concat(itensDe(n)), []);
/* "PUBLICOU" é nó COM item, nunca nó presente.
   Medido por SABOTAGEM antes do commit do red: um `[data-ux-enablers="a-validar"]`
   VAZIO fazia `D010-CARD6` fechar VERDE e teria satisfeito `D010-CARD2` (b) e
   `D010-CARD3` (c) — três alíneas verdes contra uma casca sem conteúdo. Onde a
   alínea afirma que a prática PUBLICA, ela exige item; onde afirma que NÃO
   publica, a casca vazia continua contando como violação (direção estrita). */
const publicaItens = (nos, qid) => itensDeVarios(nos[qid] || []).length;
/* As DUAS fontes do cartão-alvo, separadas pelo CONTÊINER e não pela classe do
   chip: depois de T008 os itens a validar também são `.ux-tgt-enabler`, e um
   acessor que os confunda com o payload do engine mede o card contra si mesmo
   — era assim que a fusão de C10 (c1) "passaria" contando o próprio item novo. */
function cartao(d, qid) {
  const li = d.querySelector('li.ux-tgt-ov[data-qid="' + qid + '"]');
  if (!li) return { li: null, engine: [], aValidar: [], todos: [] };
  return {
    li,
    engine: qa(li, ".ux-tgt-en .ux-tgt-enabler").map(chipDe),
    aValidar: qa(li, '[data-ux-enablers="a-validar"] .ux-tgt-enabler').map(chipDe),
    todos: qa(li, ".ux-tgt-enabler").map(chipDe)
  };
}
/* markup do ícone de um chip: o primeiro filho que não é nome nem modo */
function iconeDe(span) {
  const el = Array.from(span.children).find(c => !c.classList.contains("ux-tgt-enabler-name") &&
    !c.classList.contains("ux-tgt-mode"));
  return el ? el.outerHTML : null;
}
/* normaliza um trecho de HTML pelo MESMO serializador do DOM, para que a
   comparação com `iconFor()` não seja sobre ordem de atributo */
function normHTML(d, s) {
  const host = d.createElement("div");
  host.innerHTML = String(s || "");
  return host.firstElementChild ? host.firstElementChild.outerHTML : "";
}

/* ============================ papel ============================ */
function papel(w, d) {
  const r = w.__DEV.preparePrint();
  if (r && r.blocked) throw new Error("preparePrint() bloqueado por rascunho de contexto não salvo");
  const el = d.getElementById("v32-print-report");
  if (!el) throw new Error("#v32-print-report ausente depois de preparePrint()");
  return el;
}
/* Ordem canônica do relatório impresso — TRANSCRITA da âncora viva de
   `P51-DOC13` (`tests_p50_core.js`, bloco "R3 · a lista de §12 reproduz a ordem
   realmente emitida"). Transcrita, e não lida em execução: gate não spawna
   suíte alheia (R10 §6). Se a ordem mudar, ESTE literal muda por edição
   explícita e a divergência vira decisão (R10 §1). */
const D010_ORDEM_PAPEL = ["pr-cover", "pr-howto", "pr-maturity", "pr-prios", "pr-findings",
  "pr-landscape", "pr-interp", "pr-support", "pr-journey", "pr-target", "pr-annex"];

/* Prefixo do `data-eid` do item SEM equivalente V3.2 — NORMATIVO desde a errata
   E15 da spec (§C10 (b): "`data-eid` da forma `map:<chave do MAP>` — prefixo
   normativo por E15, não só 'estável'"). TRANSCRITO do critério, jamais lido do
   source de `ui_target_v32.js`: derivá-lo do módulo sob teste tornaria a
   asserção equivalente por construção — o oráculo concordaria com qualquer
   prefixo que o produto passasse a emitir, que é exatamente o contrário do que
   E15 pede. Se o critério mudar, ESTE literal muda por edição explícita e a
   divergência vira decisão (R10 §1).
   Até E15 (2026-08-30) o critério dizia só "estável", e o gate media só isso:
   a chave CRUA satisfazia C10 (b) e o mutante que a emitisse era EQUIVALENTE —
   ver a nota riscada em `D010_VACUIDADES_CONHECIDAS`. */
const D010_PREFIXO_MAP = "map:";

/* ===================== frases e literais congelados ===================== */
/* `TGT_DISCLAIMER` lido do SOURCE de `ui_target_v32.js` (`:4`) — oráculo
   externo ao runtime: se o produto reescrever o texto no DOM, o gate cai. */
const TGT_DISCLAIMER_SRC = (() => {
  const m = TGT_SRC.match(/const TGT_DISCLAIMER = "((?:[^"\\]|\\.)*)"/);
  if (!m) throw new Error("TGT_DISCLAIMER não encontrado no source de ui_target_v32.js");
  return m[1];
})();
/* A frase do aviso único da 009, nos DOIS ramos, transcrita caractere a
   caractere da spec 009 §5 / `tgtAbsenceHTML`. R-1 congela essa função: se ela
   mudar, `D010-CARD6` (c) cai e alguém decide a direção. */
const FRASE_SESSAO = (n, nomes) => "O contexto tecnológico não foi informado nesta sessão. Por isso " + n +
  " " + (n === 1 ? "prática-alvo ficou" : "práticas-alvo ficaram") +
  " sem refino por habilitadores já identificados: " + nomes.join("; ") + ".";
const FRASE_PARCIAL = (n, nomes) => "O contexto tecnológico não foi informado para " + n + " " +
  (n === 1 ? "prática-alvo" : "práticas-alvo") + ". Por isso " + (n === 1 ? "ela ficou" : "elas ficaram") +
  " sem refino por habilitadores já identificados: " + nomes.join("; ") + ".";
const RE_PRESERVADA = /Leitura V3\.1\.3 preservada/;
const RE_AUSENCIA_TEC = /(ausência de|não (há|possui|existe|tem))\s+(tecnologia|ferramenta)/i;
const RE_FORTI = /Forti[A-Z]/;

/* rótulo canônico de QS, lido do escopo de script (E7) */
function rotuloQid(w, qid) {
  const r = JSON.parse(FX.d010Eval(w,
    "JSON.stringify((QS.filter(function(q){return q.id===" + JSON.stringify(qid) + ";})[0]||{}).lbl||null)"));
  if (!r) throw new Error("rótulo canônico ausente para o qid " + qid);
  return r;
}

/* ============================================================================
   C1 · D010-ARB1 — o vão deixa de existir
   ========================================================================== */
T("D010-ARB1", "C1 · sem substituto, a recomendação congelada permanece VISÍVEL (D010-F1)", () => gate(g => {
  const { w, d } = R("D010-F1");
  exigeTelaLimpa(d, "D010-ARB1");
  let censo = [];
  /* (a) pré-condição declarada: fora do modo legado, e sem substituto */
  const preOk = g.passo("(a) pré-condição · não-legado e sem substituto", () => {
    if (w.__DEV.V32.isLegacyModeV32() !== false)
      vac("(a)", "o runtime está em modo legado — a arbitragem V1 nem é exercida");
    if (FX.d010HasSubstitute(w) !== false)
      vac("(a)", "o oráculo da spec §1 diz que HÁ substituto sob D010-F1 — a fixture deixou de ser o vão");
    censo = censoCamada1(d);
    if (!censo.length) vac("(a)", "nenhum título de HIDE_EYEBROWS presente na tela");
  });
  /* (b) nenhum título de HIDE_EYEBROWS oculto */
  if (preOk) g.passo("(b) títulos congelados visíveis", () => {
    const oc = censo.filter(x => x.tipo === "titulo" && x.oculto).map(x => x.chave);
    if (oc.length) throw new Error("títulos congelados OCULTOS sem substituto: " + JSON.stringify(oc));
  }); else g.naoMedido("(b)", "a pré-condição (a) não fechou");
  /* (c) blocos contíguos idem */
  if (preOk) g.passo("(c) blocos contíguos visíveis", () => {
    const bl = censo.filter(x => x.tipo === "bloco");
    if (!bl.length) vac("(c)", "nenhum `.apoio-block`/`.t-list`/`.t-details` contíguo aos títulos presentes");
    const oc = bl.filter(x => x.oculto).map(x => x.chave);
    if (oc.length) throw new Error("blocos contíguos OCULTOS sem substituto: " + JSON.stringify(oc));
  }); else g.naoMedido("(c)", "a pré-condição (a) não fechou");
  /* (d) censo comparativo contra o MESMO estado em modo legado */
  g.passo("(d) censo visível idêntico ao do modo legado", () => {
    const cmp = censoContraLegado(w, d, "(d)");
    const a = visiveis(cmp.v32), b = visiveis(cmp.legado);
    if (JSON.stringify(a) !== JSON.stringify(b))
      throw new Error("censo visível V3.2 ≠ censo visível legado · V3.2=" + JSON.stringify(a) +
        " · legado=" + JSON.stringify(b));
  });
}));

/* ============================================================================
   C2 · D010-ARB2 — com substituto, a supressão vigente é preservada
   ========================================================================== */
T("D010-ARB2", "C2 · com substituto, a leitura congelada continua oculta (D010-F2)", () => gate(g => {
  const { w, d } = R("D010-F2");
  exigeTelaLimpa(d, "D010-ARB2");
  /* (a) havendo substituto, todos os títulos presentes de HIDE_EYEBROWS estão ocultos */
  g.passo("(a) supressão preservada havendo substituto", () => {
    if (FX.d010HasSubstitute(w) !== true)
      vac("(a)", "o oráculo da spec §1 não vê substituto sob D010-F2 — a alínea mediria a ausência de supressão");
    const titulos = censoCamada1(d).filter(x => x.tipo === "titulo");
    if (!titulos.length) vac("(a)", "nenhum título de HIDE_EYEBROWS presente na tela");
    const vis = titulos.filter(x => !x.oculto).map(x => x.chave);
    if (vis.length) throw new Error("título congelado VISÍVEL havendo substituto: " + JSON.stringify(vis));
  });
  /* (b) `#v32support` traz ≥1 card com candidato ou serviço */
  g.passo("(b) #v32support tem card com candidato ou serviço", () => {
    const sup = d.getElementById("v32support");
    if (!sup) throw new Error("#v32support ausente");
    const comPayload = qa(sup, ".v32-card").filter(c => c.querySelector(".v32-list li")).length;
    if (!comPayload) throw new Error("nenhum `.v32-card` de #v32support traz candidato ou serviço");
  });
  /* (c) nenhum outro `.section-title` da tela ficou oculto */
  g.passo("(c) sem transbordo para títulos fora de HIDE_EYEBROWS", () => {
    const todos = qa(d, "section.screen .section-title").length;
    if (!todos) vac("(c)", "nenhum `.section-title` na tela — não há transbordo possível a medir");
    const transbordo = qa(d, "section.screen .section-title.v32-hidden").filter(t => {
      const eb = t.querySelector(".eyebrow");
      return FX.D010_HIDE_EYEBROWS.indexOf(eb ? (eb.textContent || "").replace(/\s+/g, " ").trim() : "") < 0;
    }).map(t => txt(t));
    if (transbordo.length) throw new Error("títulos ocultos fora de HIDE_EYEBROWS: " + JSON.stringify(transbordo));
  });
}));

/* ============================================================================
   C3 · D010-ARB3 — arbitragem tudo-ou-nada, alcance inalterado

   POR QUE A VARREDURA INCLUI `D010-F4`, QUE A SPEC §C3 NÃO LISTA
   ---------------------------------------------------------------------------
   A redação de C3 nomeia três fixtures porque é ANTERIOR à errata de vacuidade
   (E3/E4, 2026-08-30), que criou `D010-F4`; a lista não foi estendida junto, e a
   fixture nasceu sem alínea de arbitragem alguma que a exercitasse. A varredura
   é ampliada AQUI e a redação de C3 tem de segui-la: divergência gate↔spec se
   DECIDE, nunca se absorve em silêncio (R10 §1). O gate é o lado ESTRITO da
   divergência; a redação é do `product-owner`, e o gap está reportado.

   CUSTO MEDIDO ANTES DE APLICAR (2026-08-30, pré-implementação): sob `D010-F4` o
   censo da Camada 1 é 3 nós, 3 ocultos, ZERO forasteiros — idêntico ao de
   `D010-F1` —, logo (a) e (b) fecham VERDE e o veredito do gate não se move.

   O QUE F4 ACRESCENTA — e o que NÃO acrescenta, que também fica escrito:
   hoje, nenhum censo que `D010-F1` já não produza. O que ela traz é
   CONFIGURAÇÃO distinta, não censo distinto: gate de suficiência ABERTO,
   landscape 100% UNSET e as DUAS fontes do cartão-alvo se cruzando no mesmo
   card. O ganho materializa no GREEN — F4 é a única fixture desta varredura
   cujos cards publicam item das duas fontes, e é nela que uma arbitragem presa
   ao CONTEÚDO do card, em vez do predicado da spec §1, teria configuração
   própria para divergir de F1 sem que nenhuma outra fixture notasse.
   ========================================================================== */
T("D010-ARB3", "C3 · tudo-ou-nada e sem transbordo, nas quatro fixturas (F1/F2/F3/F4)", () => gate(g => {
  ["D010-F1", "D010-F2", "D010-F3", "D010-F4"].forEach(fxId => {
    const { d } = R(fxId);
    exigeTelaLimpa(d, "D010-ARB3");
    /* (a) o conjunto oculto é ∅ OU exatamente o conjunto da Camada 1 */
    g.passo("(a)·" + fxId + " arbitragem tudo-ou-nada", () => {
      const censo = censoCamada1(d);
      if (!censo.length) vac("(a)", fxId + ": nenhum nó de Camada 1 presente — nada a arbitrar");
      const ocultos = ocultosDiretos(d);
      const conhecidos = censo.map(x => x.no);
      const forasteiros = ocultos.filter(n => conhecidos.indexOf(n) < 0)
        .map(n => String(n.className) + "#" + txt(n).slice(0, 40));
      if (forasteiros.length)
        throw new Error(fxId + ": nó OCULTO fora da Camada 1 (transbordo da varredura): " + JSON.stringify(forasteiros));
      if (ocultos.length !== 0 && ocultos.length !== conhecidos.length)
        throw new Error(fxId + ": arbitragem parcial — " + ocultos.length + " ocultos de " +
          conhecidos.length + " nós da Camada 1 (esperado 0 ou " + conhecidos.length + ")");
    });
    /* (b) âncoras que NUNCA podem ser ocultadas */
    g.passo("(b)·" + fxId + " âncoras nunca ocultadas", () => {
      const ancoras = [];
      const rev = d.getElementById("review"), res = d.getElementById("restart");
      if (rev) ancoras.push({ nome: "#review", no: rev });
      if (res) ancoras.push({ nome: "#restart", no: res });
      qa(d, "section.screen .section-title").forEach(t => {
        if (/Capabilities a validar/i.test(txt(t))) ancoras.push({ nome: "título 'Capabilities a validar'", no: t });
      });
      qa(d, "section.screen details.t-details").forEach(x => {
        if (/demais gaps altos/i.test(txt(x.querySelector("summary")))) ancoras.push({ nome: "<details> 'demais gaps altos'", no: x });
      });
      if (!ancoras.length) vac("(b)", fxId + ": nenhuma das quatro âncoras de não-transbordo está presente");
      /* ALCANCE DECLARADO (R10 §2 — o que a alínea NÃO mede fica escrito).
         Sob o workspace 5.2 a varredura tem escopo `[data-p52-legacy-scope="support"]`,
         que contém só a Camada 1: medido, NENHUMA das quatro âncoras está lá dentro.
         (b) é, portanto, guarda de ALCANCE — só pode falhar se a varredura voltar a
         alcançar a tela inteira (regressão de R-5/U15). Quem mede transbordo DENTRO
         do escopo é (a). */
      const esc = escopoApoio(d);
      const dentro = ancoras.filter(a => esc.contains(a.no));
      g.nota("D010-ARB3 (b) · " + fxId + " · âncoras presentes: " + ancoras.map(a => a.nome).join(", ") +
        " · DENTRO do escopo varrido: " + dentro.length + "/" + ancoras.length +
        (dentro.length ? "" : " — nenhuma: (b) é guarda de ALCANCE, não pode falhar enquanto o escopo for o do workspace 5.2"));
      const feridas = ancoras.filter(a => a.no.classList.contains("v32-hidden")).map(a => a.nome);
      if (feridas.length) throw new Error(fxId + ": âncora recebeu `.v32-hidden`: " + JSON.stringify(feridas));
    });
  });
  /* (c) sob gate FECHADO o conjunto visível é IDÊNTICO ao do modo legado */
  g.passo("(c) sob gate FECHADO o visível é o do modo legado", () => {
    const F3 = R("D010-F3");
    if (FX.d010ComparisonPublishable(F3.w) !== false)
      vac("(c)", "D010-F3 deixou de ser a fixture de gate FECHADO");
    const cmp = censoContraLegado(F3.w, F3.d, "(c)");
    const a = visiveis(cmp.v32), b = visiveis(cmp.legado);
    if (JSON.stringify(a) !== JSON.stringify(b))
      throw new Error("sob gate fechado o conjunto visível difere do legado · V3.2=" + JSON.stringify(a) +
        " · legado=" + JSON.stringify(b));
  });
}));

/* ============================================================================
   C4 · D010-ARB4 — os dois ramos seguem a mesma arbitragem
   ========================================================================== */
T("D010-ARB4", "C4 · o ramo !hasPrio ('apoiar agora') segue a mesma arbitragem (D010-F1b)", () => gate(g => {
  const A = R("D010-F1b");
  exigeTelaLimpa(A.d, "D010-ARB4");
  const censo = censoCamada1(A.d);
  /* (a) o título do ramo sem prioridades está presente e VISÍVEL */
  g.passo("(a) título 'Como a Fortinet pode apoiar agora' visível", () => {
    const alvo = censo.find(x => x.tipo === "titulo" && x.chave === "Como a Fortinet pode apoiar agora");
    if (!alvo) vac("(a)", "o título 'Como a Fortinet pode apoiar agora' não está na tela — o ramo !hasPrio não foi exercido");
    if (alvo.oculto) throw new Error("'Como a Fortinet pode apoiar agora' está OCULTO sem substituto");
  });
  /* (b) os blocos contíguos do ramo estão visíveis */
  g.passo("(b) apoioAgora contíguo visível", () => {
    const blocos = censo.filter(x => x.tipo === "bloco");
    if (!blocos.length) vac("(b)", "nenhum bloco contíguo ao título do ramo !hasPrio — não há apoioAgora a medir");
    const oc = blocos.filter(x => x.oculto).map(x => x.chave);
    if (oc.length) throw new Error("blocos do ramo !hasPrio OCULTOS: " + JSON.stringify(oc));
  });
  /* (c) a mesma sessão COM prioridades dá o mesmo veredito de arbitragem */
  g.passo("(c) mesmo veredito com e sem prioridades declaradas", () => {
    const B = R("D010-F1");
    const vA = FX.d010HasSubstitute(A.w), vB = FX.d010HasSubstitute(B.w);
    if (vA !== vB) throw new Error("veredito de arbitragem difere entre F1b e F1: " + vA + " × " + vB);
    const cA = censoCamada1(A.d), cB = censoCamada1(B.d);
    if (!cA.length || !cB.length) vac("(c)", "uma das duas telas não traz nó de Camada 1 — a comparação seria vazia");
    const ocA = cA.some(x => x.oculto), ocB = cB.some(x => x.oculto);
    if (ocA !== ocB)
      throw new Error("a Camada 1 é ocultada em uma fixture e não na outra · F1b oculta=" + ocA + " · F1 oculta=" + ocB);
  });
}));

/* ============================================================================
   C5 · D010-INV7 — nenhuma superfície afirma preservação de leitura oculta
   ========================================================================== */
T("D010-INV7", "C5 · a frase de preservação só existe com a leitura citada VISÍVEL", () => gate(g => {
  const F2 = R("D010-F2");
  exigeTelaLimpa(F2.d, "D010-INV7");
  const F1 = R("D010-F1");
  exigeTelaLimpa(F1.d, "D010-INV7");
  /* (a) sob D010-F2 (congelado oculto) a tela não pode afirmar preservação */
  g.passo("(a) congelado OCULTO ⇒ a tela não afirma preservação", () => {
    if (!FX.d010BaseInV32Base(F2.w).length)
      vac("(a)", "nenhuma capability de apresentação `base` fora das prioridades sob D010-F2 — a frase não teria onde nascer");
    const titulos = censoCamada1(F2.d).filter(x => x.tipo === "titulo");
    if (!titulos.length) vac("(a)", "nenhum título de Camada 1 sob D010-F2");
    if (!titulos.every(x => x.oculto))
      vac("(a)", "sob D010-F2 a Camada 1 não está oculta — a alínea mede a frase sob leitura OCULTA");
    if (RE_PRESERVADA.test(F2.d.querySelector("section.screen").textContent || ""))
      throw new Error("a tela afirma 'Leitura V3.1.3 preservada' com a Camada 1 OCULTA (INV-7 violada)");
  });
  /* (b) sob D010-F1: se a afirmação existir, a leitura citada está visível no MESMO render */
  g.passo("(b) afirmação ⇒ leitura citada visível no mesmo render", () => {
    if (!FX.d010BaseInV32Base(F1.w).length)
      vac("(b)", "nenhuma capability de apresentação `base` fora das prioridades sob D010-F1");
    const censo = censoCamada1(F1.d);
    if (!censo.length) vac("(b)", "nenhum nó de Camada 1 presente sob D010-F1");
    const afirma = RE_PRESERVADA.test(F1.d.querySelector("section.screen").textContent || "");
    const visivel = censo.every(x => !x.oculto);
    g.nota("D010-INV7 (b) · afirma preservação=" + afirma + " · Camada 1 visível=" + visivel);
    if (afirma && !visivel)
      throw new Error("a tela afirma preservação sob D010-F1 e a leitura citada está OCULTA: " +
        JSON.stringify(censo.filter(x => x.oculto).map(x => x.chave)));
  });
  /* (c) no papel, sob QUALQUER fixture, a afirmação nunca ocorre */
  g.passo("(c) o papel nunca afirma preservação (5 fixtures)", () => {
    const culpados = [];
    let comSujeito = 0;
    Object.keys(FX.D010_FIXTURES).forEach(fxId => {
      const { w, d } = R(fxId);
      const pr = papel(w, d);
      if (qa(pr, "#pr-sup-base .v32-card, #pr-sup-prio .v32-card, #pr-sup-maturity .v32-card").length) comSujeito++;
      if (RE_PRESERVADA.test(pr.textContent || "")) culpados.push(fxId);
    });
    if (!comSujeito)
      vac("(c)", "nenhuma das 5 fixtures imprime card base/prioridade no papel — a frase não teria onde nascer");
    g.nota("D010-INV7 (c) · fixtures cujo papel traz card onde a frase poderia nascer: " + comSujeito + "/5");
    if (culpados.length)
      throw new Error("#v32-print-report afirma 'Leitura V3.1.3 preservada' em: " + JSON.stringify(culpados) +
        " — no papel a Camada 1 nunca é impressa (C13)");
  });
  /* (d) regressão de V10: o card de prioridade preserva a segunda oração e não nomeia produto */
  g.passo("(d) regressão de V10 no card de prioridade", () => {
    const prio = F1.d.getElementById("v32prio");
    if (!prio) vac("(d)", "#v32prio ausente sob D010-F1 — a regressão de V10 não teria sujeito");
    const t = txt(prio);
    if (!/nenhum produto é inferido sem contexto/.test(t))
      throw new Error("o card de prioridade perdeu 'nenhum produto é inferido sem contexto' (pinada por V10)");
    if (RE_FORTI.test(t))
      throw new Error("#v32prio passou a nomear produto: " + (t.match(RE_FORTI) || [])[0]);
  });
}));

/* ============================================================================
   C6 · D010-ABS1 — leitura base vira bloco de ausência
   ========================================================================== */
T("D010-ABS1", "C6 · #v32base é UM aviso de ausência com contagem e lista nominal (D010-F1)", () => gate(g => {
  const { w, d } = R("D010-F1");
  exigeTelaLimpa(d, "D010-ABS1");
  const esperados = FX.d010BaseInV32Base(w);
  let aviso = null;
  /* (a) exatamente 1 aviso e zero cards */
  const aOk = g.passo("(a) #v32base = 1 aviso de ausência, 0 cards", () => {
    if (!esperados.length)
      vac("(a)", "`baseIds` vazio sob D010-F1 — sem capability em apresentação `base` fora das prioridades o bloco não nasce");
    const base = d.getElementById("v32base");
    if (!base) throw new Error("#v32base ausente havendo " + esperados.length + " capabilities em `baseIds`");
    const avisos = qa(base, '[data-v32-absence="base-context"]');
    const cards = qa(base, ".v32-card");
    if (avisos.length !== 1)
      throw new Error("#v32base traz " + avisos.length + " nós [data-v32-absence=\"base-context\"] (esperado 1)");
    if (cards.length)
      throw new Error("#v32base ainda traz " + cards.length + " `.v32-card` — o bloco de ausência substitui os N cards");
    aviso = avisos[0];
  });
  /* (b) declara não-informação, traz a contagem e nomeia EXATAMENTE `baseIds` */
  if (aOk) g.passo("(b) contagem e lista nominal = baseIds (E6)", () => {
    const t = txt(aviso);
    if (!/não\s+(foi\s+)?informad/i.test(t))
      throw new Error("o aviso não declara que o contexto NÃO FOI INFORMADO: " + JSON.stringify(t.slice(0, 160)));
    if (t.indexOf(String(esperados.length)) < 0)
      throw new Error("o aviso não traz a contagem " + esperados.length + ": " + JSON.stringify(t.slice(0, 160)));
    const faltando = esperados.filter(id => t.indexOf(nomeCap(w, id)) < 0).map(id => nomeCap(w, id));
    if (faltando.length) throw new Error("o aviso não nomeia: " + JSON.stringify(faltando));
    const fora = Object.keys(w.__DEV.V32.CAPABILITIES)
      .filter(id => esperados.indexOf(id) < 0 && t.indexOf(nomeCap(w, id)) >= 0).map(id => nomeCap(w, id));
    if (!fora.length && esperados.length === Object.keys(w.__DEV.V32.CAPABILITIES).length)
      vac("(b)", "`baseIds` é o universo inteiro de capabilities — a cláusula 'exatamente' não discrimina");
    if (fora.length)
      throw new Error("o aviso nomeia capability FORA de `baseIds` (E6 — `#v32base` ≠ apresentação `base`): " + JSON.stringify(fora));
  }); else g.naoMedido("(b)", "não há aviso de ausência a ler — a alínea (a) não fechou");
  /* (c) não afirma ausência de tecnologia nem conclui sobre processo/pessoas/governança */
  if (aOk) g.passo("(c) declara não-informação, nunca ausência (INV-2)", () => {
    const t = txt(aviso);
    if (RE_AUSENCIA_TEC.test(t))
      throw new Error("o aviso afirma ausência de tecnologia (INV-2): " + JSON.stringify(t.match(RE_AUSENCIA_TEC)[0]));
    if (/(depende|carece|falta)[^.]{0,40}(processo|pessoas|governança)/i.test(t))
      throw new Error("o aviso conclui sobre processo/pessoas/governança: " + JSON.stringify(t.slice(0, 160)));
  }); else g.naoMedido("(c)", "não há aviso de ausência a ler — a alínea (a) não fechou");
  /* (d) idempotência: o mesmo censo depois de dois renders consecutivos */
  if (aOk) g.passo("(d) idempotência entre dois renders", () => {
    const censo1 = { avisos: 1, cards: 0, texto: txt(aviso) };
    w.__DEV.showResults();
    const base2 = d.getElementById("v32base");
    if (!base2) throw new Error("#v32base sumiu no segundo render");
    const censo2 = { avisos: qa(base2, '[data-v32-absence="base-context"]').length,
                     cards: qa(base2, ".v32-card").length,
                     texto: txt(base2.querySelector('[data-v32-absence="base-context"]')) };
    if (JSON.stringify(censo1) !== JSON.stringify(censo2))
      throw new Error("censo mudou entre dois renders consecutivos: " + JSON.stringify(censo1) + " × " + JSON.stringify(censo2));
  }); else g.naoMedido("(d)", "sem censo inicial válido não há idempotência a comparar — a alínea (a) não fechou");
  /* (e) no papel, #pr-sup-base traz o MESMO aviso, sem controle */
  g.passo("(e) o papel traz o mesmo aviso, sem controle", () => {
    const P = R("D010-F1");
    const alvos = FX.d010BaseInV32Base(P.w);
    if (!alvos.length) vac("(e)", "`baseIds` vazio — o bloco do papel não nasceria");
    const pr = papel(P.w, P.d);
    const prBase = pr.querySelector("#pr-sup-base");
    if (!prBase) throw new Error("#pr-sup-base ausente no papel havendo `baseIds` não vazio");
    const prAvisos = qa(prBase, '[data-v32-absence="base-context"]');
    if (prAvisos.length !== 1)
      throw new Error("#pr-sup-base traz " + prAvisos.length + " avisos de ausência (esperado 1)");
    if (qa(prBase, ".v32-card").length)
      throw new Error("#pr-sup-base ainda traz " + qa(prBase, ".v32-card").length + " cards");
    if (qa(prAvisos[0], "button, a[href], input, select").length)
      throw new Error("o aviso do PAPEL traz controle interativo");
    const faltando = alvos.filter(id => txt(prAvisos[0]).indexOf(nomeCap(P.w, id)) < 0).map(id => nomeCap(P.w, id));
    if (faltando.length) throw new Error("o aviso do papel não nomeia: " + JSON.stringify(faltando));
  });
  /* (f) o bloco de prioridades não é alterado */
  g.passo("(f) #v32prio intocado", () => {
    const prio = d.getElementById("v32prio");
    if (!prio) vac("(f)", "#v32prio ausente sob D010-F1 — a alínea não teria sujeito");
    if (qa(prio, '[data-v32-absence]').length)
      throw new Error("#v32prio recebeu bloco de ausência — prioridade nunca vira aviso (V10/V15)");
    if (!qa(prio, ".v32-card").length)
      throw new Error("#v32prio ficou sem `.v32-card` — o card de prioridade continua sendo card");
  });
}));

/* ============================================================================
   C7 · D010-CARD1 — habilitador a validar, ancorado no nível ATUAL confirmado
   ========================================================================== */
/* POR QUE (a)/(b) VARREM `D010-F1` **E** `D010-F4`, se a spec §C7 lista só F1
   ==========================================================================
   O critério C7 (a) é universalmente quantificado — "**toda** prática-alvo em
   S2-contexto com resposta confirmada e `MAP` não vazio publica…" —, e `D010-F1`
   é nomeada como a fixture onde ele é exercido, não como o limite do que ele
   afirma. Mesma forma da varredura de `D010-ARB3` sobre F4, já registrada acima.

   O QUE F1 SOZINHA NÃO ALCANÇAVA (medido por simulação da saída no DOM,
   2026-08-30, zero byte de produto — três SOBREVIVENTES que nenhum gate matava):
     · item do `MAP` DESCARTADO em silêncio — sob F1 todo nó tem UM item, então
       "sumiu um item" e "o nó não nasceu" são o mesmo estado, e `D010-CARD4` (b)
       só sabe julgar item RENDERIZADO: item que não existe não é auditado por
       ninguém. Sob F4 há nós de DOIS itens, e a contagem passa a ter sujeito;
     · ORDEM DO CATÁLOGO invertida — com um item por nó não há ordem que se
       possa violar. Sob F4, `vulnerability-management` ([FortiRecon,
       FortiEndpoint]) e `incident-response` ([FortiSOAR,
       FortiGuard-Service-Bundle]) dão à alínea o par que ela sempre prometeu
       medir;
     · rótulo `.ux-tgt-mode` trocado NO ITEM SEM EQUIVALÊNCIA — (b) já media o
       rótulo, mas o único item sem equivalência do produto inteiro vive em
       `incident-response`, que não estava em fixture alguma.

   CUSTO MEDIDO ANTES DE APLICAR: sob F4 o universo de C7 tem 7 qids contra 4 de
   F1; o veredito do gate e o da suíte não se movem (7 PASS · 6 FAIL, linhas
   byte a byte idênticas). O que muda é o censo impresso na nota.

   A FUSÃO (E9) ENTRA COMO PRÉ-CONDIÇÃO, NÃO COMO JULGAMENTO. Sob F4 um item do
   `MAP` cujo equivalente está ANEXADO ao card é removido do nó por regra
   ratificada (C10 c1) — `SOCaaS` em `monitoring-coverage` é o caso. Se (a)
   comparasse contra o catálogo cru, ela reprovaria o produto CORRETO por
   cumprir outro critério. O conjunto esperado é então o catálogo MENOS os
   fundidos, com as duas fontes lidas de fora do módulo sob teste: o conjunto
   anexado vem de `buildRecommendationContext()` (engine, `frozen`) e a tabela
   de equivalência vem de `__DEV.TGT_EQUIV` como DADO (totalidade provada por
   C10 (a)). Quem JULGA a fusão continua sendo C10 (c1)/(c2); (a) mede
   CONTAGEM, ORDEM e NÍVEL (INV-5). Sob F1 o conjunto fundido é VAZIO — a
   alínea ali é a mesma de antes desta emenda, e a nota imprime o número. */
/* Conjunto EFETIVAMENTE ANEXADO ao card pela fonte congelada, por qid. */
function c7Anexados(w, qid) {
  const c = w.__DEV.V32.buildRecommendationContext().contexts[FX.d010CapOf(w, qid)] || {};
  return (c.candidates || []).map(x => x.itemId).concat((c.services || []).map(s => s.serviceId));
}
/* Catálogo do nível ATUAL menos os itens fundidos. Devolve também os fundidos,
   para que a nota diga quantos foram — guarda contra a alínea passar a medir
   uma lista vazia sem ninguém perceber. */
function c7Esperado(w, qid, nivel) {
  const tab = w.__DEV.TGT_EQUIV || {};
  const anex = c7Anexados(w, qid);
  const cat = FX.d010MapItems(w, qid, nivel);
  const fundidos = cat.filter(k => {
    const eq = (typeof tab[k] === "string" && tab[k]) ? tab[k] : null;
    return eq && anex.indexOf(eq) >= 0;
  });
  return { cat, fundidos, esperado: cat.filter(k => fundidos.indexOf(k) < 0) };
}
T("D010-CARD1", "C7 · nó a-validar sse S2-contexto + resposta confirmada + MAP não vazio + gate ABERTO (F1 · F4)", () => gate(g => {
  const { w, d } = R("D010-F1");
  const nos = aValidarPorQid(d, "D010-CARD1");
  const ansv = FX.d010Answers(w);
  const qsIds = JSON.parse(FX.d010Eval(w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
  const alvos = Object.keys(w.__DEV.TARGET.overrides || {});
  /* universo da alínea (a): derivado do MODELO, nunca do DOM */
  let universo = [];
  const uOk = g.passo("(pré) universo de C7 não vazio e gate ABERTO", () => {
    if (FX.d010ComparisonPublishable(w) !== true)
      vac("(pré)", "o gate de suficiência está FECHADO sob D010-F1 — nenhuma prática poderia publicar");
    universo = alvos.filter(qid => {
      const k = qsIds.indexOf(qid);
      return FX.d010CtxStateOf(w, qid) === "S2" && typeof ansv[k] === "number" &&
        FX.d010MapItems(w, qid, ansv[k]).length > 0;
    });
    if (!universo.length)
      vac("(pré)", "nenhuma prática-alvo em S2-contexto com resposta confirmada e MAP não vazio sob D010-F1");
    g.nota("D010-CARD1 · universo derivado do MODELO: " + JSON.stringify(universo));
  });
  /* Os renders em que (a)/(b) são exercidas. F1 é o render já aberto acima; F4
     é o único que traz nós de MAIS DE UM item e o único item sem equivalência
     do produto. Cada render deriva o SEU universo do modelo, do mesmo jeito. */
  const C7_RENDERS = [{ fx: "D010-F1", w, d, nos, ansv, qsIds, universo: null }];
  const uF4 = g.passo("(pré·F4) universo de C7 sob D010-F4, com nó de 2+ itens", () => {
    const F4 = R("D010-F4");
    if (FX.d010ComparisonPublishable(F4.w) !== true)
      vac("(pré·F4)", "o gate de suficiência está FECHADO sob D010-F4 — nenhuma prática poderia publicar");
    const a4 = FX.d010Answers(F4.w);
    const i4 = JSON.parse(FX.d010Eval(F4.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
    const u4 = Object.keys(F4.w.__DEV.TARGET.overrides || {}).filter(qid => {
      const k = i4.indexOf(qid);
      return FX.d010CtxStateOf(F4.w, qid) === "S2" && typeof a4[k] === "number" &&
        FX.d010MapItems(F4.w, qid, a4[k]).length > 0;
    });
    if (!u4.length) vac("(pré·F4)", "nenhuma prática-alvo em S2-contexto com resposta confirmada e MAP não vazio sob D010-F4");
    /* NÃO-VACUIDADE ESPECÍFICA desta extensão: sem nó de 2+ itens, (a) volta a
       não ter como medir ordem, e a varredura extra vira decoração. */
    const multi = u4.filter(qid => c7Esperado(F4.w, qid, a4[i4.indexOf(qid)]).esperado.length > 1);
    if (!multi.length)
      vac("(pré·F4)", "nenhum nó `a-validar` de D010-F4 tem 2+ itens esperados — sem ele a ORDEM do catálogo " +
        "não é mensurável em fixture alguma, e a varredura de F4 não acrescenta poder discriminante");
    g.nota("D010-CARD1 · universo sob D010-F4: " + JSON.stringify(u4) +
      " · com 2+ itens (onde a ORDEM é mensurável): " + JSON.stringify(multi));
    C7_RENDERS.push({ fx: "D010-F4", w: F4.w, d: F4.d, nos: aValidarPorQid(F4.d, "D010-CARD1"),
                      ansv: a4, qsIds: i4, universo: u4 });
  });
  if (!uF4) g.naoMedido("(pré·F4)", "o render de D010-F4 não pôde ser preparado — (a)/(b) medem só sob D010-F1");
  const renders = () => C7_RENDERS.map(r => Object.assign({}, r, { universo: r.universo || universo }));
  /* (a) cada uma traz UM nó cujos itens são o catálogo do nível ATUAL (menos os
         fundidos), na ORDEM do catálogo.
         A correspondência item↔chave é por NOME: a regra de equivalência
         ratificada (T004) é identidade de nome — `name(id) === PRODUCTS[k].n` —,
         e o item sem equivalente sai com `PRODUCTS[c.p].n`, de modo que o nome
         é total sobre os dois ramos. A unicidade do nome entre as 11 chaves é
         conferida aqui, senão "o nome bate" deixaria de identificar POSIÇÃO.
         O `data-eid` NÃO é pinado aqui, e isso é decisão medida, não descuido:
         quem o pina é `D010-CARD4` (b), que roda sobre D010-F4 e cobre TODO
         item renderizado — nos dois ramos da identidade, e desde a errata E15
         também a FORMA `map:<chave>` do ramo sem equivalência. Medido pelo teste
         de subsunção: o universo que uma checagem de eid nesta alínea
         acrescentaria são os itens de F1, e F1 não tem forma de item que F4 não
         tenha (os quatro qids do vão estão nas duas), logo nenhum mutante de
         código morre aqui e sobrevive lá. A conclusão foi RE-MEDIDA depois de
         E15, com o prefixo já pinado, e não mudou: `M-SE1` (chave crua) morre em
         C10 (b) sob F4 e nenhuma alínea de C7 o veria primeiro. Até esta emenda a alínea trazia o termo
         `it.eid !== chave` dentro de uma CONJUNÇÃO: ele é sempre verdadeiro (o
         eid é o id equivalente ou `map:<chave>`, nunca a chave crua), portanto
         nunca decidia — a alínea media o nome e a mensagem prometia o eid. */
  if (uOk) g.passo("(a) itens = catálogo do nível ATUAL (menos fundidos), na ordem do catálogo", () => {
    const nomes = FX.d010MapKeys(w).map(k => FX.d010ProductName(w, k));
    const dup = nomes.filter((n, i) => nomes.indexOf(n) !== i);
    if (dup.length)
      throw new Error("duas chaves do MAP renderizam o mesmo nome " + JSON.stringify(dup) +
        " — a correspondência item↔chave por NOME deixa de identificar posição e esta alínea precisa de outro eixo");
    renders().forEach(R7 => {
      R7.universo.forEach(qid => {
        const E = c7Esperado(R7.w, qid, R7.ansv[R7.qsIds.indexOf(qid)]);
        const esperado = E.esperado;
        const lista = R7.nos[qid] || [];
        if (lista.length !== 1)
          throw new Error(R7.fx + "/" + qid + ": " + lista.length + " nós `a-validar` (esperado 1) para catálogo=" +
            JSON.stringify(E.cat) + (E.fundidos.length ? " fundidos=" + JSON.stringify(E.fundidos) : ""));
        const itens = itensDe(lista[0]);
        if (itens.length !== esperado.length)
          throw new Error(R7.fx + "/" + qid + ": " + itens.length + " itens no nó, esperado " + esperado.length +
            " " + JSON.stringify(esperado) + " (catálogo do nível ATUAL=" + JSON.stringify(E.cat) +
            (E.fundidos.length ? ", fundidos por equivalente anexado=" + JSON.stringify(E.fundidos) : "") +
            ") — item subtraído do relatório, ou nível errado (INV-5)");
        esperado.forEach((chave, i) => {
          const nomeMap = FX.d010ProductName(R7.w, chave), it = itens[i];
          if (it.nome !== nomeMap)
            throw new Error(R7.fx + "/" + qid + " posição " + i + ": item " + JSON.stringify(it.nome + "/" + it.eid) +
              " não corresponde à chave " + JSON.stringify(chave) + " (nome do catálogo: " + JSON.stringify(nomeMap) +
              ") — ordem do catálogo violada ou nível errado (INV-5). O `data-eid` desta alínea é informativo: " +
              "quem o pina é D010-CARD4 (b)");
        });
      });
    });
    g.nota("D010-CARD1 (a) · renders varridos: " + renders().map(R7 =>
      R7.fx + "(" + R7.universo.length + " qids, fundidos=" +
      R7.universo.reduce((n, q) => n + c7Esperado(R7.w, q, R7.ansv[R7.qsIds.indexOf(q)]).fundidos.length, 0) + ")").join(" · "));
  }); else g.naoMedido("(a)", "o universo de C7 não pôde ser derivado");
  /* (b) rótulo "a validar" e a fórmula de §UAT-07, sem "apoio direto" */
  if (uOk) g.passo("(b) rótulo 'a validar' e fórmula 'validar aderência'", () => {
    let medidos = 0, itensLidos = 0;
    renders().forEach(R7 => {
      R7.universo.forEach(qid => {
        (R7.nos[qid] || []).forEach(no => {
          medidos++;
          const modos = itensDe(no).map(x => x.modo);
          if (!modos.length) throw new Error(R7.fx + "/" + qid + ": nó `a-validar` sem item algum");
          itensLidos += modos.length;
          if (modos.some(m => !/a validar/i.test(m)))
            throw new Error(R7.fx + "/" + qid + ": rótulo `.ux-tgt-mode` fora de 'a validar': " + JSON.stringify(modos));
          const t = txt(no);
          if (!/validar aderência/i.test(t)) throw new Error(R7.fx + "/" + qid + ": o nó não traz a fórmula 'validar aderência' (§UAT-07)");
          if (/apoio direto/i.test(t)) throw new Error(R7.fx + "/" + qid + ": o nó diz 'apoio direto' — a validar não é apoio identificado");
        });
      });
    });
    if (!medidos) vac("(b)", "nenhum nó `a-validar` publicado pelo universo de C7 — não há rótulo a ler");
    g.nota("D010-CARD1 (b) · nós lidos: " + medidos + " · itens com rótulo conferido: " + itensLidos);
  }); else g.naoMedido("(b)", "o universo de C7 não pôde ser derivado");
  /* (c) nomeia a origem e NÃO afirma identificação pelo contexto declarado */
  if (uOk) g.passo("(c) nomeia a origem e não afirma identificação", () => {
    let medidos = 0;
    universo.forEach(qid => {
      (nos[qid] || []).forEach(no => {
        medidos++;
        const t = txt(no);
        if (!/gap/i.test(t) || !/cat[áa]logo/i.test(t))
          throw new Error(qid + ": o nó não nomeia a origem (gap + catálogo da sessão): " + JSON.stringify(t.slice(0, 160)));
        if (/identificad/i.test(t))
          throw new Error(qid + ": o nó afirma que o item foi IDENTIFICADO — contradiz o aviso da 009");
      });
    });
    if (!medidos) vac("(c)", "nenhum nó `a-validar` publicado pelo universo de C7 — não há origem a ler");
  }); else g.naoMedido("(c)", "o universo de C7 não pôde ser derivado");
  /* (d) prática com resposta null/"NA" não produz o nó.
         Nenhuma das cinco fixtures tem alvo com resposta não confirmada; o caso é
         DERIVADO de D010-F1 pelo owner canônico `__DEV.setAnswerById`, com o gate
         ainda ABERTO e o alvo ainda vivo — declarado aqui, não escondido. O
         CONTROLE (as demais práticas continuam publicando) é o que separa
         "não publica porque a resposta não é confirmada" de "não publica nada". */
  g.passo("(d) resposta null/'NA' não produz o nó (cenário derivado de F1)", () => {
    [null, "NA"].forEach(valor => {
      const X = R("D010-F1");
      X.w.__DEV.setAnswerById("automation", valor);
      X.w.__DEV.showResults();
      if (Object.keys(X.w.__DEV.TARGET.overrides || {}).indexOf("automation") < 0)
        vac("(d)", "o alvo em `automation` sumiu ao pôr a resposta " + JSON.stringify(valor) + " — o caso derivado não existe");
      if (FX.d010ComparisonPublishable(X.w) !== true)
        vac("(d)", "o gate fechou ao pôr a resposta " + JSON.stringify(valor) +
          " — a ausência do nó seria explicada pelo gate, não pela resposta");
      if (X.d.querySelectorAll('li.ux-tgt-ov[data-qid="automation"]').length !== 1)
        vac("(d)", "o `li` de `automation` não está na tela com a resposta " + JSON.stringify(valor));
      const nosX = aValidarPorQid(X.d, "D010-CARD1");
      const vivas = Object.keys(nosX).filter(q => q !== "automation" && publicaItens(nosX, q));
      if (!vivas.length)
        vac("(d)", "com a resposta " + JSON.stringify(valor) + " NENHUMA prática publica o nó — a ausência em " +
          "`automation` não discrimina nada (controle vazio)");
      if ((nosX["automation"] || []).length)
        throw new Error("resposta " + JSON.stringify(valor) + " em `automation` produziu nó `a-validar` (itens: " +
          JSON.stringify(itensDeVarios(nosX["automation"]).map(x => x.eid)) + ")");
    });
  });
  /* (e) prática em S3-contexto ou S4 não produz o nó.
         O caso DISCRIMINANTE é o S3 de `D010-F2`, onde o gate está ABERTO e há
         controle. O S4 vive só em `D010-F3`, de gate FECHADO: ali a ausência do
         nó não distingue S4 do gate, e isso fica IMPRESSO em vez de presumido. */
  g.passo("(e) S3/S4 de contexto não produzem o nó", () => {
    const casos = [
      { fx: "D010-F2", qid: "logs", estado: "S3", exigeControle: true },
      { fx: "D010-F3", qid: "team-capacity", estado: "S4", exigeControle: false }
    ];
    casos.forEach(c => {
      const Y = R(c.fx);
      const idsY = JSON.parse(FX.d010Eval(Y.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
      if (FX.d010CtxStateOf(Y.w, c.qid) !== c.estado)
        vac("(e)", c.fx + "/" + c.qid + " não está em " + c.estado + " de contexto — o caso sumiu da fixture");
      if (!FX.d010MapItems(Y.w, c.qid, FX.d010Answers(Y.w)[idsY.indexOf(c.qid)]).length)
        vac("(e)", c.fx + "/" + c.qid + ": MAP no nível atual está vazio — a ausência do nó seria explicada pelo MAP");
      const nosY = aValidarPorQid(Y.d, "D010-CARD1");
      const outras = Object.keys(nosY).filter(q => q !== c.qid && publicaItens(nosY, q));
      if (c.exigeControle && !outras.length)
        vac("(e)", c.fx + ": NENHUMA outra prática publica o nó — a ausência em " + c.qid +
          " (" + c.estado + ") não discrimina nada (controle vazio)");
      if (!c.exigeControle)
        g.nota("D010-CARD1 (e) · " + c.fx + "/" + c.qid + " (" + c.estado + ") medido sob gate FECHADO: " +
          "ali a ausência do nó NÃO distingue " + c.estado + " do gate — quem discrimina é o caso S3 de D010-F2");
      if ((nosY[c.qid] || []).length)
        throw new Error(c.fx + "/" + c.qid + " (" + c.estado + " de contexto) produziu nó `a-validar`");
    });
  });
  /* (f) serviço e produto-a-validar não são o mesmo tipo de item (C17) */
  g.passo("(f) o nó é IRMÃO de `.ux-tgt-en`, nunca a classe (R-1)", () => {
    const todos = Object.keys(nos).reduce((a, q) => a.concat(nos[q]), []);
    if (!itensDeVarios(todos).length)
      vac("(f)", "nenhum ITEM `a-validar` na tela (nós presentes: " + todos.length + ") — nada a distinguir do serviço do engine");
    todos.forEach(no => {
      if (no.classList.contains("ux-tgt-en"))
        throw new Error("o nó `a-validar` carrega a classe `.ux-tgt-en` — R-1 exige nó IRMÃO, nunca a classe");
      if (no.closest(".ux-tgt-en")) throw new Error("o nó `a-validar` está DENTRO de `.ux-tgt-en`");
    });
  });
}));

/* ============================================================================
   C8 · D010-CARD2 — precedência de fonte
   ========================================================================== */
T("D010-CARD2", "C8 · candidato do engine bloqueia o MAP; serviço não (a·F2 · b·F4 · c·F2/F3/F4)", () => gate(g => {
  const A = R("D010-F2");
  const B = R("D010-F4");
  /* (a) `logs` tem candidatos DIRECT ⇒ só a linha do engine, sem nó a-validar.
         O CONTROLE é o que separa "a precedência funcionou" de "nada publica":
         sob D010-F2 as quatro práticas do vão são S2-contexto com MAP não vazio
         e gate ABERTO, logo TÊM de publicar. */
  g.passo("(a) capability com candidato do engine não recebe item do MAP", () => {
    const ansA = FX.d010Answers(A.w);
    const idsA = JSON.parse(FX.d010Eval(A.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
    const mapLogs = FX.d010MapItems(A.w, "logs", ansA[idsA.indexOf("logs")]);
    if (!mapLogs.length)
      vac("(a)", "MAP['logs'] no nível atual está vazio sob D010-F2 — a precedência não teria o que suprimir");
    const ctxA = A.w.__DEV.V32.buildRecommendationContext().contexts[FX.d010CapOf(A.w, "logs")];
    if (!((ctxA.candidates || []).length))
      vac("(a)", "a capability de `logs` não tem candidato do engine sob D010-F2 — não há fonte com contexto a ter precedência");
    if (!cartao(A.d, "logs").engine.length)
      vac("(a)", "`logs` não exibe chip do engine — a alínea mediria a ausência das duas fontes");
    const nosA = aValidarPorQid(A.d, "D010-CARD2");
    const outras = Object.keys(nosA).filter(q => q !== "logs" && publicaItens(nosA, q));
    if (!outras.length)
      vac("(a)", "NENHUMA outra prática de D010-F2 publica o nó — a ausência em `logs` não distingue " +
        "precedência de ausência universal (controle vazio)");
    if ((nosA["logs"] || []).length)
      throw new Error("`logs` recebeu nó `a-validar` tendo " + ctxA.candidates.length + " candidatos do engine e MAP=" +
        JSON.stringify(mapLogs) + " — a fonte com contexto perdeu a precedência");
  });
  /* (b) capability só com serviços e em S2-contexto CONTINUA recebendo o nó (E2/E3) */
  g.passo("(b) serviço do engine NÃO bloqueia o MAP", () => {
    const ctxsB = B.w.__DEV.V32.buildRecommendationContext().contexts;
    const ansB = FX.d010Answers(B.w);
    const idsB = JSON.parse(FX.d010Eval(B.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
    const universo = Object.keys(B.w.__DEV.TARGET.overrides || {}).filter(qid => {
      const c = ctxsB[FX.d010CapOf(B.w, qid)];
      return c && FX.d010CtxStateOf(B.w, qid) === "S2" && (c.services || []).length > 0 &&
        (c.candidates || []).length === 0 && FX.d010MapItems(B.w, qid, ansB[idsB.indexOf(qid)]).length > 0;
    });
    if (!universo.length)
      vac("(b)", "nenhuma prática-alvo com APENAS serviços (zero candidatos) em S2-contexto sob D010-F4 — " +
        "é a vacuidade que a errata E3 mandou fechar");
    g.nota("D010-CARD2 (b) · universo com serviço e SEM candidato: " + JSON.stringify(universo));
    const nosB = aValidarPorQid(B.d, "D010-CARD2");
    universo.forEach(qid => {
      if (!cartao(B.d, qid).engine.some(x => /serviço/i.test(x.modo)))
        vac("(b)", qid + " deixou de exibir a linha `.ux-tgt-en` do engine — o nó não estaria 'ao lado' de nada");
      if (!publicaItens(nosB, qid))
        throw new Error(qid + " tem serviço do engine e ZERO candidatos em S2-contexto, e não publicou ITEM no nó `a-validar` " +
          "(nós presentes: " + (nosB[qid] || []).length + ") — " +
          "serviço do engine não pode bloquear o MAP (E2/E3)");
    });
  });
  /* (c) nenhum nome de produto aparece duas vezes no mesmo card — em TODA fixture
         desta suíte que tenha chip, e não só nas duas de C8.

         POR QUE `D010-F3` ENTROU (cobertura, 2026-08-30, antes do green)
         ---------------------------------------------------------------------
         `d010TargetEnablers` carrega a GUARDA DE AGRUPAMENTO
         (`fixtures_010_vao.js:601-605`): chip `.ux-tgt-enabler` emitido FORA de
         `li.ux-tgt-ov[data-qid]` deixa o censo por qid cego, e com ele toda
         asserção de ausência por qid vira PASS vacuoso. A guarda só roda quando
         alguém CHAMA o helper — e não rodava sob nenhuma fixture de gate
         FECHADO. Medido: `D010-F3` tem 2 chips (`team-capacity`,
         `vulnerability-management`) e nenhum gate a varria.
         O QUE F3 ACRESCENTA: a guarda sobre um render COM chip e gate FECHADO,
         que é o estado em que o emissor de `ui_target_v32.js` continua rodando
         mesmo sem publicar item.
         O QUE F3 NÃO ACRESCENTA, e fica escrito (R10 §2): sob gate fechado o
         `MAP` não publica, então existe UMA fonte só — a direção "duas fontes
         fundem o mesmo nome" não tem caso ali e continua medida por F2/F4.
         `D010-F1b` permanece FORA de propósito: nenhuma alínea desta suíte lê o
         cartão-alvo sob F1b, e guarda que não protege asserção alguma é ruído.
         Sob `D010-F1` a guarda passou a rodar em `D010-CARD6` (b), colada à
         asserção de ausência que ela protege. */
  g.passo("(c) nenhum nome repetido no mesmo card, com o emissor no sítio conhecido", () => {
    let cards = 0;
    /* boot próprio de F3, DENTRO da alínea: falha de fixture fica atribuída a (c)
       e não derruba (a)/(b), que medem outras fixtures. */
    const C = R("D010-F3");
    [{ id: "D010-F2", ctx: A }, { id: "D010-F3", ctx: C }, { id: "D010-F4", ctx: B }].forEach(caso => {
      /* o censo do helper é do DOCUMENTO inteiro: com o papel montado, os cards
         impressos entrariam na soma e a guarda mediria duas superfícies. */
      exigeTelaLimpa(caso.ctx.d, "D010-CARD2 (c)/" + caso.id);
      /* a guarda vive na fixture e não sabe qual render está sendo julgado; com
         três renders na alínea, "2 chips no documento mas 1 agrupados" não diria
         ONDE. O prefixo é do caso, como em toda mensagem desta alínea. */
      let chips;
      try { chips = FX.d010TargetEnablers(caso.ctx.d); }
      catch (x) { throw new Error(caso.id + ": " + x.message); }
      const comChip = Object.keys(chips).filter(q => chips[q].length);
      if (!comChip.length)
        vac("(c)", caso.id + ": nenhum card traz chip algum — não há repetição possível a medir");
      comChip.forEach(qid => {
        cards++;
        const nomes = chips[qid].map(x => x.split("|")[1]);
        const dup = nomes.filter((n, i) => nomes.indexOf(n) !== i);
        if (dup.length)
          throw new Error(caso.id + "/" + qid + ": nome de produto repetido no mesmo card: " + JSON.stringify(dup));
      });
    });
    g.nota("D010-CARD2 (c) · cards com item medidos: " + cards);
  });
}));

/* ============================================================================
   C9 · D010-CARD3 — INV-3 não é importada mais fraca
   ========================================================================== */
T("D010-CARD3", "C9 · sob gate FECHADO nada é publicado, e o diferencial isola o gate (F3 × F4)", () => gate(g => {
  const F3 = R("D010-F3");
  const decF3 = FX.D010_DECLARED["D010-F3"], decF4 = FX.D010_DECLARED["D010-F4"];
  const dif3 = decF3.diferencialC9, dif4 = decF4.diferencialC9;
  /* (a) pré-condição declarada, lida da fonte canônica já usada pelo card */
  g.passo("(a) tgtComparisonPublishable === false sob D010-F3", () => {
    const pub = F3.w.tgtComparisonPublishable(F3.w.__DEV.tgtCurrentProfile());
    if (pub !== false)
      throw new Error("tgtComparisonPublishable(tgtCurrentProfile()) === " + pub + " sob D010-F3 (esperado false)");
    if (decF3.gateSuficiencia.publicavel !== pub)
      throw new Error("o veredito declarado (" + decF3.gateSuficiencia.publicavel + ") diverge do runtime (" + pub + ")");
  });
  /* (b) zero nós a-validar na tela e no papel, com PRÉ-CONDIÇÃO DE NÃO-VACUIDADE */
  g.passo("(b) zero nós a-validar sob gate FECHADO, com alvo que só o gate impede", () => {
    const ansF3 = FX.d010Answers(F3.w);
    const idsF3 = JSON.parse(FX.d010Eval(F3.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
    const k = idsF3.indexOf(dif3.qid);
    if (Object.keys(F3.w.__DEV.TARGET.overrides || {}).indexOf(dif3.qid) < 0)
      vac("(b)", dif3.qid + " não é alvo sob D010-F3");
    if (FX.d010CtxStateOf(F3.w, dif3.qid) !== "S2" || ansF3[k] !== dif3.nivel ||
        !FX.d010MapItems(F3.w, dif3.qid, ansF3[k]).length)
      vac("(b)", dif3.qid + " não satisfaz TODAS as demais condições de C7 sob D010-F3 (S2-contexto=" +
        FX.d010CtxStateOf(F3.w, dif3.qid) + ", nível=" + JSON.stringify(ansF3[k]) + ", MAP=" +
        JSON.stringify(FX.d010MapItems(F3.w, dif3.qid, ansF3[k])) +
        ") — a ausência do nó seria verdadeira por ESTADO, não por GATE");
    const nosTela = aValidarPorQid(F3.d, "D010-CARD3");
    const publicados = Object.keys(nosTela).filter(q => (nosTela[q] || []).length);
    if (publicados.length)
      throw new Error("sob gate FECHADO a tela publicou nó `a-validar` em: " + JSON.stringify(publicados));
    const pr3 = papel(F3.w, F3.d);
    const nPapel = qa(pr3, '[data-ux-enablers="a-validar"]').length;
    if (nPapel) throw new Error("sob gate FECHADO o papel publicou " + nPapel + " nós `a-validar`");
  });
  /* (c) diferencial declarado entre fixtures: o MESMO par, vereditos OPOSTOS */
  g.passo("(c) diferencial F3 × F4 — o gate é a ÚNICA variável", () => {
    if (!dif3 || !dif4) vac("(c)", "uma das fixtures não declara `diferencialC9` — sem par não há diferencial");
    if (dif3.qid !== dif4.qid || dif3.nivel !== dif4.nivel)
      vac("(c)", "o par declarado difere entre as fixtures: " + JSON.stringify(dif3) + " × " + JSON.stringify(dif4));
    if (dif3.gateAberto === dif4.gateAberto)
      vac("(c)", "os dois lados declaram o MESMO veredito de gate (" + dif3.gateAberto + ") — dois iguais não são diferencial");
    const F4 = R("D010-F4");
    const pub4 = F4.w.tgtComparisonPublishable(F4.w.__DEV.tgtCurrentProfile());
    if (pub4 !== decF4.gateSuficiencia.publicavel)
      throw new Error("o veredito declarado de D010-F4 (" + decF4.gateSuficiencia.publicavel +
        ") diverge do runtime (" + pub4 + ")");
    const ansF4 = FX.d010Answers(F4.w);
    const idsF4 = JSON.parse(FX.d010Eval(F4.w, "JSON.stringify(QS.map(function(q){return q.id;}))"));
    if (ansF4[idsF4.indexOf(dif4.qid)] !== dif4.nivel || FX.d010CtxStateOf(F4.w, dif4.qid) !== "S2")
      vac("(c)", "o par não está no MESMO estado sob D010-F4 — o diferencial não isolaria o gate");
    const nos4 = aValidarPorQid(F4.d, "D010-CARD3");
    if (!publicaItens(nos4, dif4.qid))
      throw new Error("o MESMO par (" + dif4.qid + ", nível " + dif4.nivel + ") NÃO publica ITEM sob gate ABERTO (D010-F4), " +
        "nós presentes=" + (nos4[dif4.qid] || []).length + " — " +
        "o diferencial não prova que a decisão vem do gate");
  });
  /* (d) o gateNote da comparação permanece */
  g.passo("(d) o `gateNote` de ui_target_v32.js:129 permanece", () => {
    const nopub = F3.d.querySelector('[data-p52-nopub="target"]');
    if (!nopub) throw new Error("o `gateNote` da comparação (`[data-p52-nopub=\"target\"]`) sumiu sob gate FECHADO");
    if (!/evidência suficiente/i.test(txt(nopub)))
      throw new Error("o `gateNote` mudou de texto: " + JSON.stringify(txt(nopub).slice(0, 120)));
  });
}));

/* ============================================================================
   C10 · D010-CARD4 — um habilitador, uma vez, um nome, um ícone
   ========================================================================== */
T("D010-CARD4", "C10 · tabela total sobre as 11 chaves, identidade e as DUAS direções da fusão (D010-F4)", () => gate(g => {
  const { w, d } = R("D010-F4");
  const V = w.__DEV.V32;
  const chaves = FX.d010MapKeys(w);
  const nos = aValidarPorQid(d, "D010-CARD4");
  let tab = null;
  const eqId = k => (tab && typeof tab[k] === "string" && (V.OFFERINGS[tab[k]] || V.SERVICES[tab[k]])) ? tab[k] : null;
  const nomeCatalogo = id => ((V.OFFERINGS[id] || V.SERVICES[id] || {}).name) || null;
  /* (a) a tabela é DADO, lida por __DEV, e cobre as 11 chaves derivadas do MAP */
  const aOk = g.passo("(a) tabela total sobre as chaves de `c.p` do MAP", () => {
    if (!chaves.length) vac("(a)", "`d010MapKeys(w)` devolveu zero chaves — catálogo congelado inalcançável");
    g.nota("D010-CARD4 (a) · chaves de `c.p` derivadas do MAP (" + chaves.length + "): " + JSON.stringify(chaves));
    const t = w.__DEV.TGT_EQUIV;
    if (!t || typeof t !== "object")
      throw new Error("`window.__DEV.TGT_EQUIV` ausente — a tabela de equivalência não é servida como dado (R-3)");
    tab = t;
    const orfas = chaves.filter(k => !(k in tab));
    if (orfas.length) throw new Error("chave do MAP sem entrada na tabela: " + JSON.stringify(orfas));
    const sobrando = Object.keys(tab).filter(k => chaves.indexOf(k) < 0);
    if (sobrando.length) throw new Error("a tabela declara chave que não existe no MAP: " + JSON.stringify(sobrando));
    const semValor = chaves.filter(k => {
      const v = tab[k];
      if (v === null || v === false) return false;               /* "sem equivalente V3.2", explícito */
      return !(typeof v === "string" && (V.OFFERINGS[v] || V.SERVICES[v]));
    });
    if (semValor.length)
      throw new Error("entrada que não é id de OFFERINGS/SERVICES nem o valor explícito de 'sem equivalente V3.2': " +
        JSON.stringify(semValor.map(k => k + "=" + JSON.stringify(tab[k]))));
  });
  /* (b) identidade de cada item renderizado */
  const itens = Object.keys(nos).reduce((a, q) => a.concat(itensDeVarios(nos[q]).map(x => Object.assign({ qid: q }, x))), []);
  if (aOk) g.passo("(b) nome do catálogo V3.2 + data-eid do equivalente", () => {
    if (!itens.length) vac("(b)", "nenhum item `a-validar` renderizado sob D010-F4 — a identidade não tem sujeito");
    const idsEngine = Object.keys(V.OFFERINGS).concat(Object.keys(V.SERVICES));
    let comEq = 0, semEq = 0;
    itens.forEach(it => {
      const chave = Object.keys(tab).find(k => eqId(k) === it.eid) ||
                    Object.keys(tab).find(k => FX.d010ProductName(w, k) === it.nome);
      if (!chave)
        throw new Error("item " + JSON.stringify(it.eid + "/" + it.nome) + " em " + it.qid +
          " não corresponde a chave alguma do MAP nem a id equivalente da tabela");
      const id = eqId(chave);
      if (id) {
        comEq++;
        if (it.eid !== id)
          throw new Error(it.qid + "/" + chave + ": data-eid=" + JSON.stringify(it.eid) +
            " (esperado o id equivalente " + JSON.stringify(id) + ")");
        if (it.nome !== nomeCatalogo(id))
          throw new Error(it.qid + "/" + chave + ": nome=" + JSON.stringify(it.nome) +
            " (esperado o nome do catálogo V3.2 " + JSON.stringify(nomeCatalogo(id)) + ")");
      } else {
        semEq++;
        if (it.nome !== FX.d010ProductName(w, chave))
          throw new Error(it.qid + "/" + chave + ": sem equivalente, o nome tem de ser PRODUCTS[c.p].n=" +
            JSON.stringify(FX.d010ProductName(w, chave)) + ", veio " + JSON.stringify(it.nome));
        if (!it.eid) throw new Error(it.qid + "/" + chave + ": item sem equivalente ficou sem `data-eid`");
        /* FORMA NORMATIVA (E15). Antes desta emenda a alínea exigia só "estável
           e sem colisão", e a CHAVE CRUA satisfazia as duas — o mutante que a
           emitisse sobrevivia, corretamente, por equivalência ao critério. E15
           tornou o prefixo normativo, e a razão é de produto: o prefixo carrega
           a PROVENIÊNCIA no próprio DOM (item vindo do `MAP` congelado × item
           vindo do catálogo V3.2), que é a distinção que a demanda inteira
           existe para manter legível. */
        const eidNormativo = D010_PREFIXO_MAP + chave;
        if (it.eid !== eidNormativo)
          throw new Error(it.qid + "/" + chave + ": `data-eid`=" + JSON.stringify(it.eid) +
            " — sem equivalência V3.2 a forma é " + JSON.stringify(eidNormativo) +
            " (prefixo NORMATIVO por E15). O prefixo é o que distingue, no DOM, item do `MAP` congelado " +
            "de item do catálogo V3.2; sem ele a proveniência do item deixa de ser legível");
        if (idsEngine.indexOf(it.eid) >= 0)
          throw new Error(it.qid + "/" + chave + ": `data-eid`=" + JSON.stringify(it.eid) +
            " COLIDE com id do engine — o namespace `" + D010_PREFIXO_MAP + "` foi invadido pelo catálogo " +
            "e o prefixo deixou de distinguir proveniência");
      }
    });
    g.nota("D010-CARD4 (b) · itens COM equivalência: " + comEq + " · SEM equivalência: " + semEq);
    if (!comEq) vac("(b)", "nenhum item COM equivalência renderizado — o ramo principal ficaria sem caso");
    /* GUARDA SIMÉTRICA (2026-08-30). Até esta emenda a alínea imprimia
       "SEM equivalência: 0 — declarado como não medido" e fechava VERDE: o ramo
       do produto que emite `PRODUCTS[c.p].n` + `data-eid` próprio era código
       alcançável que nenhuma fixture percorria, e qualquer mutante sobre ele
       sobrevivia por FALTA DE CASO — não por equivalência. A rota existe (é
       única no produto: `incident-response`@lv0, ver `ramoSemEquivalencia` em
       `D010-F4`), logo `semEq === 0` deixa de ser notícia e passa a ser
       REGRESSÃO: alguém tirou a rota da fixture. A assimetria anterior — (b)
       falhando por vacuidade num ramo e a tolerando no outro — era a metade que
       faltava. */
    if (!semEq) vac("(b)", "nenhum item SEM equivalência renderizado — o ramo 'sem equivalente V3.2' fica " +
      "sem caso e todo mutante sobre ele sobrevive por falta de cenário; a rota declarada em " +
      "`D010_DECLARED['D010-F4'].ramoSemEquivalencia` é a ÚNICA alcançável no produto e saiu do render");
  }); else g.naoMedido("(b)", "a tabela de equivalência não pôde ser lida — a alínea (a) não fechou");
  /* (c) as duas direções da fusão, no MESMO card */
  g.passo("(c1/c2) fusão contra o conjunto ANEXADO, nas duas direções (E9)", () => {
    const H = FX.D010_DECLARED["D010-F4"].homonimosNoCard;
    const pares = FX.d010EquivalenciaNome(w);
    if (JSON.stringify(pares) !== JSON.stringify(FX.D010_EQUIVALENCIA_NOME))
      throw new Error("a tabela de homônimos RE-DERIVADA do catálogo mudou: " + JSON.stringify(pares) +
        " (declarada: " + JSON.stringify(FX.D010_EQUIVALENCIA_NOME) + ") — decidir a direção antes de seguir (R10 §1)");
    const card = cartao(d, H.qid);
    if (!card.li) vac("(c)", "o cartão-alvo de " + H.qid + " não está na tela");
    if (!card.engine.length || !card.aValidar.length)
      vac("(c)", "o card de " + H.qid + " não traz as DUAS fontes ao mesmo tempo (chips do engine=" +
        card.engine.length + ", itens a-validar=" + card.aValidar.length +
        ") — sem elas nenhuma das duas direções da fusão é medida");
    const anexados = card.engine.map(x => x.eid);
    const eids = card.todos.map(x => x.eid), nomes = card.todos.map(x => x.nome);
    H.pares.forEach(p => {
      if (p.anexado) {
        /* (c1) o homônimo ANEXADO funde: uma vez só, por eid e por nome */
        if (anexados.indexOf(p.servico) < 0)
          vac("(c1)", p.servico + " deixou de estar ANEXADO ao card — a direção 'deduplica de menos' perdeu o caso");
        const nE = eids.filter(e => e === p.servico).length, nN = nomes.filter(n => n === p.nome).length;
        if (nE !== 1)
          throw new Error("(c1) " + p.servico + " aparece " + nE + " vezes no card de " + H.qid +
            " (esperado 1) — eids=" + JSON.stringify(eids));
        if (nN !== 1)
          throw new Error("(c1) o nome " + JSON.stringify(p.nome) + " aparece " + nN + " vezes no card de " + H.qid +
            " (esperado 1) — nomes=" + JSON.stringify(nomes));
      } else {
        /* (c2) o homônimo NÃO anexado SOBREVIVE, com o nome do catálogo V3.2 */
        if (anexados.indexOf(p.servico) >= 0)
          vac("(c2)", p.servico + " passou a estar ANEXADO ao card — o par de controle perdeu a função");
        const sobrevivente = card.aValidar.find(x => x.eid === p.servico || x.nome === p.nome);
        if (!sobrevivente)
          throw new Error("(c2) " + p.chaveMap + " (equivalente " + p.servico + ", NÃO anexado) sumiu do nó a-validar de " +
            H.qid + " — deduplicar pelo DOMÍNIO da tabela apaga " + JSON.stringify(p.nome) + " do relatório (E9)");
        if (sobrevivente.nome !== p.nome)
          throw new Error("(c2) o sobrevivente veio com o nome " + JSON.stringify(sobrevivente.nome) +
            " (esperado o nome do catálogo V3.2 " + JSON.stringify(p.nome) + ")");
      }
    });
    /* e nenhum card do render tem dois itens com o mesmo eid ou o mesmo nome */
    Object.keys(FX.d010TargetEnablers(d)).forEach(qid => {
      const c = cartao(d, qid);
      const e = c.todos.map(x => x.eid), n = c.todos.map(x => x.nome);
      const dupE = e.filter((x, i) => e.indexOf(x) !== i), dupN = n.filter((x, i) => n.indexOf(x) !== i);
      if (dupE.length || dupN.length)
        throw new Error("(c1) " + qid + ": data-eid repetido " + JSON.stringify(dupE) +
          " / nome repetido " + JSON.stringify(dupN));
    });
  });
  /* (d) o markup de ícone é o MESMO que o engine emitiria para o item */
  if (aOk) g.passo("(d) ícone idêntico ao de `iconFor(idEquivalente, nome)`", () => {
    const comIcone = itens.filter(it => Object.keys(tab).some(k => eqId(k) === it.eid));
    if (!comIcone.length)
      vac("(d)", "nenhum item a-validar COM equivalência — o ícone não pode ser comparado ao do engine");
    comIcone.forEach(it => {
      const esperado = normHTML(d, w.__V32UI.iconFor(it.eid, it.nome));
      if (!esperado) throw new Error("`iconFor` não devolveu markup para " + it.eid);
      const obtido = normHTML(d, iconeDe(it.no));
      if (obtido !== esperado)
        throw new Error(it.qid + "/" + it.eid + ": markup de ícone difere do emitido por `iconFor(idEquivalente, nome)` · " +
          "obtido=" + JSON.stringify(String(obtido).slice(0, 120)) +
          " esperado=" + JSON.stringify(String(esperado).slice(0, 120)));
    });
    g.nota("D010-CARD4 (d) · itens com ícone comparado ao do engine: " + comIcone.length);
  }); else g.naoMedido("(d)", "sem a tabela não há `idEquivalente` para chamar `iconFor` — a alínea (a) não fechou");
  /* (e) scanner de normalização de nome — ESCOPO e AUTO-EXCLUSÃO NOMINAL, impressos */
  g.passo("(e) nenhuma normalização de nome como fonte de equivalência", () => {
    const PROIBIDOS = [
      { re: /\.toLowerCase\s*\(/g, nome: ".toLowerCase(" },
      { re: /\.toUpperCase\s*\(/g, nome: ".toUpperCase(" },
      { re: /\.normalize\s*\(/g, nome: ".normalize(" },
      { re: /localeCompare\s*\(/g, nome: "localeCompare(" },
      { re: /replace\s*\(\s*\/\^?Forti/gi, nome: "replace(/^Forti…/)" }
    ];
    g.nota("D010-CARD4 (e) · ESCOPO do scanner: ui_target_v32.js (1 arquivo) · AUTO-EXCLUSÃO NOMINAL (R10 §10): " +
      "tests_010_vao.js e fixtures_010_vao.js carregam os literais proibidos por dever de ofício e NÃO são varridos; " +
      "ui_v32.js também não — o `replace(/^Forti/i)` de `iconFor` (:538) é o fallback de iniciais, sítio legítimo " +
      "(plan.md §Restrições item 9) · padrões buscados: " + PROIBIDOS.map(p => p.nome).join(" "));
    if (!TGT_SRC.length) vac("(e)", "o source de ui_target_v32.js veio vazio — o scanner não varreria nada");
    const achados = PROIBIDOS.map(p => ({ nome: p.nome, n: (TGT_SRC.match(p.re) || []).length })).filter(x => x.n);
    if (achados.length)
      throw new Error("ui_target_v32.js usa normalização de nome: " + JSON.stringify(achados.map(x => x.nome + "×" + x.n)) +
        " — a equivalência é DECLARADA, nunca derivada do nome");
  });
}));

/* ============================================================================
   C11 · D010-CARD5 — INV-4 na leitura
   ========================================================================== */
T("D010-CARD5", "C11 · TGT_DISCLAIMER na mesma superfície dos habilitadores, e depois deles (D010-F1)", () => gate(g => {
  const { d } = R("D010-F1");
  exigeTelaLimpa(d, "D010-CARD5");
  const P = R("D010-F1");
  const pr = papel(P.w, P.d);
  let discTela = null, discPapel = null;
  /* (a) tela: `.ux-tgt-disc` dentro do MESMO #ux-tgt-cmp que contém os habilitadores, depois da lista */
  g.passo("(a) disclaimer dentro de #ux-tgt-cmp e depois da lista de práticas", () => {
    const cmp = d.getElementById("ux-tgt-cmp");
    if (!cmp) throw new Error("#ux-tgt-cmp ausente — o bloco de comparação não foi renderizado");
    const habs = qa(cmp, ".ux-tgt-enabler");
    if (!habs.length)
      vac("(a)", "zero `.ux-tgt-enabler` dentro de #ux-tgt-cmp sob D010-F1 — sem habilitador não há 'mesma superfície' a provar");
    discTela = cmp.querySelector(".ux-tgt-disc");
    if (!discTela) throw new Error("`.ux-tgt-disc` não está dentro de #ux-tgt-cmp");
    const ovs = cmp.querySelector(".ux-tgt-ovs");
    if (!ovs) throw new Error("`.ux-tgt-ovs` (lista de práticas) ausente");
    if (!(ovs.compareDocumentPosition(discTela) & 4))
      throw new Error("o disclaimer NÃO vem depois da lista de práticas");
    habs.forEach(h => {
      if (!(h.compareDocumentPosition(discTela) & 4))
        throw new Error("o disclaimer vem ANTES de um habilitador (" + h.getAttribute("data-eid") + ")");
    });
  });
  /* (b) papel: o `.pr-card` do disclaimer dentro de #pr-target, depois de `ovs` */
  g.passo("(b) no papel, o disclaimer é o último card de #pr-target", () => {
    const alvo = pr.querySelector("#pr-target");
    if (!alvo) throw new Error("#pr-target ausente no papel");
    const cards = qa(alvo, ".pr-card");
    discPapel = cards.find(c => c.textContent.indexOf(TGT_DISCLAIMER_SRC.slice(0, 40)) >= 0);
    if (!discPapel) throw new Error("o `.pr-card` do disclaimer não está em #pr-target");
    const ovsP = cards.filter(c => c !== discPapel);
    if (!ovsP.length) vac("(b)", "#pr-target não traz card de prática alguma — não há 'depois de ovs' a medir");
    ovsP.forEach(c => {
      if (!(c.compareDocumentPosition(discPapel) & 4))
        throw new Error("o disclaimer do papel vem ANTES de um card de prática");
    });
  });
  /* (c) texto byte-idêntico ao literal do source */
  g.passo("(c) texto byte-idêntico a TGT_DISCLAIMER (ui_target_v32.js:4)", () => {
    if (!discTela && !discPapel) vac("(c)", "nenhuma das duas superfícies expôs o disclaimer — não há texto a comparar");
    if (discTela && txt(discTela) !== TGT_DISCLAIMER_SRC)
      throw new Error("o disclaimer da TELA difere de TGT_DISCLAIMER (ui_target_v32.js:4)");
    if (discPapel && txt(discPapel) !== TGT_DISCLAIMER_SRC)
      throw new Error("o disclaimer do PAPEL difere de TGT_DISCLAIMER (ui_target_v32.js:4)");
  });
  /* (d) o nó a-validar não cita nível, score, delta nem estágio */
  g.passo("(d) o nó a-validar não cita nível/score/delta/estágio", () => {
    const nos = aValidarPorQid(d, "D010-CARD5");
    const todos = Object.keys(nos).reduce((a, q) => a.concat(nos[q]), []);
    if (!itensDeVarios(todos).length)
      vac("(d)", "nenhum ITEM `a-validar` na tela (nós presentes: " + todos.length + ") — a alínea não teria sujeito");
    const RE_DELTA = /(n[íi]vel\s*\d|score|delta|est[áa]gio|\+\d[.,]\d|\d[.,]\d\s*\/\s*5)/i;
    todos.forEach(no => {
      const t = txt(no);
      if (RE_DELTA.test(t))
        throw new Error("o nó a-validar cita nível/score/delta/estágio: " + JSON.stringify((t.match(RE_DELTA) || [])[0]));
    });
  });
}));

/* ============================================================================
   C12 · D010-CARD6 — coexistência com o aviso único da 009
   ========================================================================== */
T("D010-CARD6", "C12 · o aviso único da 009 e o nó a-validar coexistem sem órfão nem contradição (D010-F1)", () => gate(g => {
  const { w, d } = R("D010-F1");
  exigeTelaLimpa(d, "D010-CARD6");
  const alvos = Object.keys(w.__DEV.TARGET.overrides || {});
  /* S2-PAYLOAD: o conjunto que D009-UNS1 mede (E2) */
  const s2payload = alvos.filter(qid => FX.d010StateOf(w, qid) === "S2");
  const avisos = qa(d, '[data-ux-absence="target-enablers"]');
  const nomes = s2payload.map(qid => rotuloQid(w, qid));
  /* (a) exatamente 1 aviso, nomeando exatamente esse conjunto */
  const aOk = g.passo("(a) 1 aviso, nomeando exatamente as práticas em S2-payload", () => {
    if (!s2payload.length)
      vac("(a)", "nenhuma prática-alvo em S2-payload sob D010-F1 — o aviso único não teria conteúdo");
    if (avisos.length !== 1)
      throw new Error(avisos.length + " nós [data-ux-absence=\"target-enablers\"] na tela (esperado exatamente 1)");
    const t = txt(avisos[0]);
    const faltando = nomes.filter(n => t.indexOf(n) < 0);
    if (faltando.length) throw new Error("o aviso não nomeia as práticas em S2-payload: " + JSON.stringify(faltando));
    const fora = alvos.filter(qid => s2payload.indexOf(qid) < 0 && t.indexOf(rotuloQid(w, qid)) >= 0);
    if (fora.length) throw new Error("o aviso nomeia prática FORA de S2-payload: " + JSON.stringify(fora));
  });
  /* (b) essas práticas exibem o nó a-validar e NENHUMA `.ux-tgt-en` */
  g.passo("(b) as mesmas práticas exibem `a-validar` e nenhuma `.ux-tgt-en` (R-1)", () => {
    if (!s2payload.length) vac("(b)", "conjunto S2-payload vazio — não há prática a conferir");
    /* GUARDA DE AGRUPAMENTO, colada à asserção de ausência que ela protege
       (cobertura, 2026-08-30, antes do green). `cartao(d,qid).engine` é censo POR
       QID: uma `.ux-tgt-en` emitida FORA do `li.ux-tgt-ov[data-qid]` deixaria
       "nenhuma `.ux-tgt-en`" VERDADEIRA no censo e FALSA na tela — PASS vacuoso
       exatamente onde R-1 é medida. `d010TargetEnablers` compara o total do
       documento com a soma por qid e transforma isso em FALHA NOMEADA.
       POR QUE AGORA, e não quando "houver o que medir": sob `D010-F1` o censo de
       chip é ZERO hoje, e essa é uma propriedade do PRÉ-FIX — os itens que T008
       publica são `.ux-tgt-enabler` (ver `cartao`, :232), logo é no GREEN que este
       render passa a ter chip. Guarda cabeada depois do green é indistinguível de
       guarda que sempre esteve lá. */
    FX.d010TargetEnablers(d);
    const nos = aValidarPorQid(d, "D010-CARD6");
    s2payload.forEach(qid => {
      if (cartao(d, qid).engine.length)
        throw new Error(qid + " exibe `.ux-tgt-en` estando em S2-payload — R-1 e D009-UNS1 quebrados");
      if (!publicaItens(nos, qid))
        throw new Error(qid + " está no aviso único e não publica ITEM em `[data-ux-enablers=\"a-validar\"]` " +
          "(nós presentes: " + (nos[qid] || []).length + ") — órfão");
    });
  });
  /* (c) o texto do aviso é o de antes desta demanda, reconstruído da spec 009 */
  if (aOk) g.passo("(c) o texto do aviso é byte-idêntico ao de antes desta demanda", () => {
    const declarou = Object.keys(w.__DEV.V32.TECH_LANDSCAPE || {})
      .some(id => w.__DEV.V32.TECH_LANDSCAPE[id] && w.__DEV.V32.TECH_LANDSCAPE[id].presence !== "UNSET");
    const esperado = (declarou ? FRASE_PARCIAL : FRASE_SESSAO)(nomes.length, nomes);
    const corpo = avisos[0].querySelector("span");
    if (!corpo) throw new Error("o aviso da tela perdeu o `<span>` do corpo — a forma de `tgtAbsenceHTML` mudou");
    if (txt(corpo) !== esperado)
      throw new Error("o texto do aviso mudou · obtido=" + JSON.stringify(txt(corpo)) +
        " · esperado=" + JSON.stringify(esperado));
  }); else g.naoMedido("(c)", "não há aviso único a ler — a alínea (a) não fechou");
  /* (d) cada nó diz a sua coisa */
  g.passo("(d) o aviso não diz 'validar aderência'; o nó não diz 'identificados'", () => {
    if (!avisos.length) vac("(d)", "nenhum aviso único na tela — a primeira metade não teria sujeito");
    if (/validar aderência/i.test(txt(avisos[0])))
      throw new Error("o aviso único passou a dizer 'validar aderência' — é fórmula do nó a-validar");
    const nos = aValidarPorQid(d, "D010-CARD6");
    const todos = Object.keys(nos).reduce((a, q) => a.concat(nos[q]), []);
    if (!itensDeVarios(todos).length)
      vac("(d)", "nenhum ITEM `a-validar` na tela (nós presentes: " + todos.length + ") — a segunda metade não teria sujeito");
    todos.forEach(no => {
      if (/identificados/i.test(txt(no)))
        throw new Error("o nó a-validar diz 'identificados' — é a fórmula do aviso da 009");
    });
  });
}));

/* ============================================================================
   C13 · D010-PAPEL1 — o papel fecha o vão por V2 + V3
   ========================================================================== */
T("D010-PAPEL1", "C13 · #pr-target e #pr-sup-base fecham o vão no papel, com a ordem pinada (D010-F1)", () => gate(g => {
  const { w, d } = R("D010-F1");
  /* conjunto da TELA, medido ANTES de montar o papel (depois, a guarda de tela
     limpa recusaria o censo — e com razão: os dois emitem o mesmo seletor) */
  const nosTela = aValidarPorQid(d, "D010-PAPEL1");
  const itensTela = Object.keys(nosTela).sort()
    .reduce((a, q) => a.concat(itensDeVarios(nosTela[q]).map(x => q + "::" + x.eid)), []).sort();
  const pr = papel(w, d);
  /* (a) #pr-target traz ≥1 habilitador a validar, com o MESMO conjunto de itens */
  g.passo("(a) #pr-target traz o mesmo conjunto de itens da tela", () => {
    const alvo = pr.querySelector("#pr-target");
    if (!alvo) throw new Error("#pr-target ausente no papel");
    if (!itensTela.length)
      vac("(a)", "a TELA não publica habilitador a validar sob D010-F1 — sem o conjunto da tela não há o que comparar no papel");
    const itensPapelN = qa(alvo, '[data-ux-enablers="a-validar"] .ux-tgt-enabler').length;
    if (!itensPapelN)
      throw new Error("#pr-target não traz ITEM `a-validar` algum (nós presentes: " +
        qa(alvo, '[data-ux-enablers="a-validar"]').length + "), e a tela traz " + itensTela.length + " itens");
    const itensPapel = qa(alvo, '[data-ux-enablers="a-validar"] .ux-tgt-enabler').map(s => s.getAttribute("data-eid")).sort();
    const soIds = arr => arr.map(x => x.split("::")[1]).sort();
    if (JSON.stringify(soIds(itensTela)) !== JSON.stringify(itensPapel))
      throw new Error("o conjunto de itens a-validar difere entre tela e papel · tela=" +
        JSON.stringify(soIds(itensTela)) + " · papel=" + JSON.stringify(itensPapel));
  });
  /* (b) #pr-sup-base é o aviso único de C6 */
  g.passo("(b) #pr-sup-base é o bloco de ausência de C6", () => {
    if (!FX.d010BaseInV32Base(w).length)
      vac("(b)", "`baseIds` vazio sob D010-F1 — o bloco de ausência do papel não nasceria");
    const prBase = pr.querySelector("#pr-sup-base");
    if (!prBase) throw new Error("#pr-sup-base ausente havendo `baseIds` não vazio");
    const n = qa(prBase, '[data-v32-absence="base-context"]').length;
    if (n !== 1) throw new Error("#pr-sup-base traz " + n + " avisos de ausência (esperado 1)");
    if (qa(prBase, ".v32-card").length)
      throw new Error("#pr-sup-base ainda traz " + qa(prBase, ".v32-card").length + " cards em vez do aviso único");
  });
  /* (c) a ordem pinada por P51-DOC13 permanece */
  g.passo("(c) a ordem do relatório impresso (pin de P51-DOC13) permanece", () => {
    const ordem = Array.from(pr.children).map(n => n.id).filter(Boolean);
    if (!ordem.length) vac("(c)", "o relatório impresso saiu sem seção alguma");
    if (JSON.stringify(ordem) !== JSON.stringify(D010_ORDEM_PAPEL))
      throw new Error("a ordem do relatório impresso mudou · obtida=" + JSON.stringify(ordem) +
        " · pinada por P51-DOC13=" + JSON.stringify(D010_ORDEM_PAPEL));
  });
  /* (d) #pr-support continua ausente em modo legado (regressão de P1) */
  g.passo("(d) #pr-support ausente em modo legado (regressão de P1)", () => {
    const L = R("D010-F1");
    L.w.__DEV.V32.resetLandscapeToUnset();
    L.w.__DEV.showResults();
    if (L.w.__DEV.V32.isLegacyModeV32() !== true)
      vac("(d)", "o runtime não voltou ao modo legado — a regressão de P1 não seria medida");
    const prL = papel(L.w, L.d);
    if (!prL.querySelector("#pr-target"))
      vac("(d)", "#pr-target sumiu do papel em modo legado — a alínea perderia o contraste que ela mede");
    if (prL.querySelector("#pr-support"))
      throw new Error("#pr-support apareceu no papel em modo legado (regressão de P1)");
  });
}));

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD010 RECOMENDAÇÃO SEM VÃO: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
