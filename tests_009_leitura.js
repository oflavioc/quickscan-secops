/* ============================================================================
   TESTES D009 · LEITURA DO RELATÓRIO (jsdom) — demanda 009-leitura-do-relatorio
   Namespace exclusivo D009-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem dependência de Chromium: nenhum gate
   desta suíte mede geometria.

   ==========================================================================
   COMENTÁRIO NORMATIVO — DE ONDE VÊM AS LISTAS DE ORDEM
   ==========================================================================
   As três listas de ordem abaixo são **literais**, copiadas caractere a
   caractere da seção "Âncora normativa: a ordem canônica de leitura" de
   `specs/009-leitura-do-relatorio/spec.md`, que o proprietário ratificou em
   2026-08-27 (rota A — a §8 da diretriz da Phase 5.2 é SUBSTITUÍDA por aquela
   seção; a §8 segue citável como histórico).

   É PROIBIDO derivá-las de `window.__P52.sections()`, de `P52_SECTIONS` ou de
   qualquer constante das suítes 5.2 (`P52_CANONICAL_ORDER`,
   `P52_RELEASED_ORDER`, `P52_BLOCKED_ORDER`, `CANON`, `BLOCKED`). Derivar
   tornaria o oráculo equivalente por construção ao módulo sob teste e o gate
   perderia todo poder discriminante — que é exatamente o que o refinamento
   registrou em "Conflito com decisão registrada". O produto é conferido contra
   estas listas; nunca o contrário.

   Se a spec mudar, ESTAS LINHAS mudam por edição explícita, com a ratificação
   citada no commit. Nenhum caminho automático liga o módulo a este arquivo.
   ==========================================================================

   Oráculos independentes desta suíte (nenhum deles lê o módulo sob teste):
     · `QS` e `DOMS` são extraídos do HTML BASE CONGELADO
       (`quickscan_secops_soccmm_v3_1_3.html`, classe `frozen`), por varredura
       de literal balanceado — não de `window.__DEV`, não das fixtures 5.0;
     · `P52_CAP_HELP` é extraído do SOURCE de `ui_p52_workspace_v32.js` e a
       transformação "primeiro período" é reimplementada AQUI, em vez de
       chamar `__P52.capHelpLine()` (precedente do `copyMap()` público);
     · o estado dos quatro cenários do card de prática-alvo (S1..S4) é
       recalculado por `fixtures_009_leitura.js` a partir de `V32.CAPABILITIES`
       e `V32.TECH_LANDSCAPE`, sem chamar `tgtEnablersHTML()` e sem ler o DOM;
     · a régua de 78ch é lida do CSS por varredura própria de regras, e a
       decisão de "quem está sob o teto" é tomada por `Element.matches` sobre o
       nó REAL — seletor não suportado propaga exceção como FAIL (R10 §2:
       SKIP silencioso é FAIL), nunca é engolido como "não casou".
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");
const FX9 = require("./fixtures_009_leitura.js");

const HERE = __dirname;
const HTML_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");
const BASE_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_1_3.html");   /* frozen */
const P52_JS = path.join(HERE, "ui_p52_workspace_v32.js");
const P52_CSS = path.join(HERE, "ui_p52_workspace_v32.css");
const UX_CSS = path.join(HERE, "ui_ux_v32.css");
const JOURNEY_JS = path.join(HERE, "ui_journey_v32.js");

const results = [];
const ONLY = (process.env.D009_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, err = "";
  try { ok = !!fn(); } catch (x) { err = " [" + x.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + err);
}

/* ====================== ORDEM CANÔNICA — LISTAS LITERAIS ====================== */
/* spec.md · "Âncora normativa: a ordem canônica de leitura" — tabela de 9 linhas */
const D009_ORDEM_CANONICA = ["exec", "priorities", "detail", "gaps", "target",
  "context", "evidence", "support", "actions"];
/* spec.md · "Variante de gate ABERTO" (SUFF-REV-A) */
const D009_ORDEM_ABERTA = ["exec", "priorities", "detail", "gaps", "target",
  "context", "support", "actions"];
/* spec.md · "Variante de gate FECHADO" (exceção declarada, mantida) */
const D009_ORDEM_FECHADA = ["exec", "evidence", "priorities", "detail", "gaps",
  "target", "context", "support", "actions"];
/* namespace canônico das chaves de seção (as 9 da tabela da âncora) */
const D009_CHAVES_CANONICAS = ["exec", "priorities", "detail", "gaps", "target",
  "context", "evidence", "support", "actions"];

/* Frase canônica do estado "informado e nada se aplica" (S3/S4), congelada por
   `specs/009-leitura-do-relatorio/spec.md` §5: "mantém a frase de hoje". Pinada
   AQUI, byte a byte, para que a reescrita de `tgtEnablersHTML()` não a mude de
   passagem — se a frase mudar, o gate falha e a mudança vira decisão explícita. */
const FRASE_NONE = "Nenhum habilitador tecnológico específico foi identificado pelo contexto atual. " +
  "A evolução desta prática pode depender principalmente de processo, pessoas, governança ou de " +
  "aprofundamento adicional.";
/* controle canônico de entrada no editor de contexto (ui_v32.js:256) */
const CTRL_CONTEXTO = "Editar contexto tecnológico";

/* ============================ utilitários de DOM ============================ */
const boot = () => {
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  return { w: dom.window, d: dom.window.document };
};
const q = (d, s) => d.querySelector(s);
const qa = (d, s) => Array.from(d.querySelectorAll(s));
const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const sectionKeys = d => qa(d, "#p52-flow > .p52-sec").map(s => s.getAttribute("data-p52-sec"));
const railKeys = d => qa(d, ".p52-rail-link[data-p52-rail]").map(a => a.getAttribute("data-p52-rail"));

function resultsDom(fx) { const R = boot(); FX52.p52ApplyResults(R.w, R.d, fx); return R; }
function results009(fx) { const R = boot(); FX9.d009ApplyResults(R.w, R.d, fx); return R; }
/* relatório impresso montado pelo owner canônico, em host destacado */
function printDom(w) {
  const host = w.document.createElement("div");
  host.innerHTML = w.__DEV.buildPrintReport().html;
  return host;
}

/* ==================== oráculo independente: literais congelados ==================== */
/* Varredura de literal balanceado, ignorando conteúdo de string. Serve para ler
   `QS`/`DOMS` do HTML base congelado e `P52_CAP_HELP` do source da 5.2, sem
   executar o módulo sob teste e sem depender de ponte alguma. */
function literalOf(text, marker, open, close) {
  const i = text.indexOf(marker);
  if (i < 0) throw new Error("marcador ausente no source: " + marker);
  const j = text.indexOf(open, i);
  let depth = 0, inS = false, qc = "";
  for (let p = j; p < text.length; p++) {
    const c = text[p];
    if (inS) { if (c === "\\") { p++; continue; } if (c === qc) inS = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inS = true; qc = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return text.slice(j, p + 1); }
  }
  throw new Error("literal não fechado no source: " + marker);
}
const BASE_SRC = fs.readFileSync(BASE_PATH, "utf8");
const QS_FROZEN = new Function("return " + literalOf(BASE_SRC, "const QS = [", "[", "]"))();
const DOMS_FROZEN = new Function("return " + literalOf(BASE_SRC, "const DOMS = [", "[", "]"))();
const LBL_OF = {};
QS_FROZEN.forEach(x => { LBL_OF[x.id] = x.lbl; });

/* `P52_CAP_HELP` lido do SOURCE — nunca de `__P52`. */
function capHelpMap() {
  return new Function("return " + literalOf(fs.readFileSync(P52_JS, "utf8"), "var P52_CAP_HELP = ", "{", "}"))();
}
/* Transformação DECLARADA e PÚBLICA (spec §4): prefixo até o primeiro ". ",
   ponto incluído. Reimplementada aqui — não se chama `__P52.capHelpLine()`. */
function primeiroPeriodo(v) {
  const s = String(v == null ? "" : v);
  const i = s.indexOf(". ");
  return i < 0 ? s : s.slice(0, i + 1);
}

/* ============================================================================
   TRANSFORMAÇÃO DECLARADA E PÚBLICA — o mapa de apresentação da 5.2
   `p52Copy()` reescreve os nós de texto da TELA (e, no rito de impressão, os do
   `#v32-print-report` já montado): "Mandato e objetivos" chega ao leitor como
   "Direcionamento e objetivos". Medido nesta base em 2026-08-28.

   Consequência para qualquer oráculo de TEXTO desta suíte: comparar a string
   canônica crua com o `textContent` da tela produziria (a) FAIL por motivo
   alheio à demanda e (b) — pior — PASS VACUOSO nas asserções NEGATIVAS, porque
   procurar "Mandato e objetivos" na tela nunca casaria. Por isso o gate aplica
   a MESMA transformação declarada, lendo o mapa PÚBLICO `__P52.copyMap()` e
   reimplementando a substituição aqui (precedente citado pela própria spec, em
   C8). `buildPrintReport().html` medido em host destacado ainda NÃO passou pelo
   mapa — é a convenção já usada por `tests_p50_core.js` — e por isso o lado
   PAPEL compara com a string crua.
   ========================================================================== */
function copyOf(w) {
  const map = w.__P52 && typeof w.__P52.copyMap === "function" ? w.__P52.copyMap() : null;
  if (!map || !map.length) throw new Error("mapa de apresentação __P52.copyMap() indisponível — oráculo de texto ficaria cego");
  return function (v) {
    let o = String(v == null ? "" : v);
    for (let i = 0; i < map.length; i++) o = o.split(map[i][0]).join(map[i][1]);
    return o;
  };
}

/* ocorrência EXATA, sensível a maiúsculas, de palavra inteira (Unicode) */
function ocorrencias(hay, needle) {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("(?<![\\p{L}\\p{N}_])" + esc + "(?![\\p{L}\\p{N}_])", "gu");
  return (String(hay).match(re) || []).length;
}
const contemPalavra = (hay, needle) => ocorrencias(hay, needle) > 0;

/* ======================= oráculo independente: regras CSS ======================= */
/* Lista de regras (seletor, declarações, cadeia de at-rules) de um arquivo CSS.
   Varredura própria — jsdom não faz cascata, e o gate não pode depender dela. */
function cssRules(text) {
  const src = String(text).replace(/\/\*[\s\S]*?\*\//g, "");
  const res = [], at = [];
  let i = 0, buf = "";
  (function scan() {
    while (i < src.length) {
      const c = src[i];
      if (c === "{") {
        const prelude = buf.trim(); buf = ""; i++;
        if (prelude.charAt(0) === "@") { at.push(prelude); scan(); at.pop(); }
        else {
          let d = 1, body = "";
          while (i < src.length && d > 0) {
            const x = src[i];
            if (x === "{") d++;
            else if (x === "}") { d--; if (!d) { i++; break; } }
            body += x; i++;
          }
          res.push({ sel: prelude, decls: body, at: at.slice() });
        }
        continue;
      }
      if (c === "}") { i++; return; }
      buf += c; i++;
    }
  })();
  return res;
}
const MAXW_CH = /max-width\s*:\s*[^;}]*\d(?:\.\d+)?ch\b/;
const seletoresDe = r => r.sel.split(",").map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);

/* ============================================================================
   D009-ORD1 · C1 — ordem nova com gate ABERTO
   ========================================================================== */
T("D009-ORD1", "gate aberto: as 8 seções presentes seguem a ordem narrativa da spec, e o trilho anuncia a MESMA sequência", () => {
  const R = resultsDom(FX52.P52_F1);
  const ws = q(R.d, "#p52-workspace");
  if (!ws) throw new Error("workspace ausente");
  /* pré-condição: esta fixture existe para exercitar o gate ABERTO */
  if (ws.getAttribute("data-p52-gate") !== "released")
    throw new Error("P52-F1 não está com o gate aberto: " + ws.getAttribute("data-p52-gate"));

  const keys = sectionKeys(R.d);
  /* (d) toda seção presente pertence ao namespace canônico */
  keys.forEach(k => {
    if (D009_CHAVES_CANONICAS.indexOf(k) < 0)
      throw new Error("chave de seção fora do namespace canônico: '" + k + "'");
  });
  /* (a) fluxo item a item contra a lista LITERAL da âncora */
  if (keys.length !== D009_ORDEM_ABERTA.length || keys.some((k, i) => k !== D009_ORDEM_ABERTA[i]))
    throw new Error("fluxo observado [" + keys.join(" > ") + "] != ordem aberta da spec [" +
      D009_ORDEM_ABERTA.join(" > ") + "]");
  /* (b) trilho na MESMA sequência do fluxo */
  const rail = railKeys(R.d);
  if (rail.length !== keys.length || rail.some((k, i) => k !== keys[i]))
    throw new Error("trilho [" + rail.join(" > ") + "] != fluxo [" + keys.join(" > ") + "]");
  /* (c) target imediatamente antes de context */
  const iT = keys.indexOf("target"), iC = keys.indexOf("context");
  if (iT < 0 || iC < 0) throw new Error("alvo ou contexto ausentes do fluxo");
  if (iC !== iT + 1) throw new Error("contexto (" + iC + ") não é imediatamente posterior ao alvo (" + iT + ")");
  return true;
});

/* ============================================================================
   D009-ORD2 · C2 — exceção de gate FECHADO preservada
   ========================================================================== */
T("D009-ORD2", "gate fechado: evidência na 2ª posição, alvo na 6ª e contexto na 7ª, com o ponteiro exclusivo deste estado", () => {
  const R = resultsDom(FX52.P52_F3);
  const ws = q(R.d, "#p52-workspace");
  if (!ws) throw new Error("workspace ausente");
  /* (a) o estado é declarado nos DOIS atributos da raiz (o `data-p52-order` de
     `.p52-sec` é NÚMERO; este é enum — plan.md, armadilha 4) */
  if (ws.getAttribute("data-p52-gate") !== "blocked")
    throw new Error("data-p52-gate = " + ws.getAttribute("data-p52-gate") + " (esperado 'blocked')");
  if (ws.getAttribute("data-p52-order") !== "gate-blocked")
    throw new Error("data-p52-order = " + ws.getAttribute("data-p52-order") + " (esperado 'gate-blocked')");

  const keys = sectionKeys(R.d);
  /* (b) sequência igual à variante fechada, literal da spec */
  if (keys.length !== D009_ORDEM_FECHADA.length || keys.some((k, i) => k !== D009_ORDEM_FECHADA[i]))
    throw new Error("fluxo observado [" + keys.join(" > ") + "] != ordem fechada da spec [" +
      D009_ORDEM_FECHADA.join(" > ") + "]");
  /* (c) evidência no índice 1 · (d) alvo em 5 e contexto em 6 (6ª e 7ª seções) */
  if (keys.indexOf("evidence") !== 1)
    throw new Error("evidência no índice " + keys.indexOf("evidence") + " (esperado 1)");
  if (keys.indexOf("target") !== 5)
    throw new Error("alvo no índice " + keys.indexOf("target") + " (esperado 5)");
  if (keys.indexOf("context") !== 6)
    throw new Error("contexto no índice " + keys.indexOf("context") + " (esperado 6)");
  /* (e) trilho idêntico ao fluxo */
  const rail = railKeys(R.d);
  if (rail.length !== keys.length || rail.some((k, i) => k !== keys[i]))
    throw new Error("trilho [" + rail.join(" > ") + "] != fluxo [" + keys.join(" > ") + "]");
  /* (f) ponteiro existe SÓ neste estado e aponta para a seção de evidência */
  const jump = qa(R.d, '[data-p52="gate-jump"]');
  if (jump.length !== 1) throw new Error(jump.length + " ponteiros de gate (esperado 1)");
  if (jump[0].getAttribute("href") !== "#p52-sec-evidence")
    throw new Error("ponteiro aponta para " + jump[0].getAttribute("href"));
  const A = resultsDom(FX52.P52_F1);
  if (qa(A.d, '[data-p52="gate-jump"]').length !== 0)
    throw new Error("ponteiro de gate presente com o resultado LIBERADO");
  return true;
});

/* ============================================================================
   D009-DOM1 · C4 — domínio colorido na leitura executiva, com canal não-cromático
   ========================================================================== */
T("D009-DOM1", "todo nome canônico de domínio na narrativa carrega a identidade do domínio, e a cor nunca é o único portador", () => {
  const R = resultsDom(FX52.P52_F1);
  const copy = copyOf(R.w);
  const snap = R.w.__DEV.buildNarrativeSnapshot();
  const nar = R.w.__DEV.buildExecutiveNarrative(snap);
  const fonte = nar.paragraphs.join("\n");           /* oráculo: a STRING pura, não o DOM */

  /* não-vacuidade: sem ocorrência alguma o gate não mediria nada */
  const total = DOMS_FROZEN.reduce((a, d) => a + ocorrencias(fonte, d.pt), 0);
  if (!total) throw new Error("nenhum nome canônico de domínio ocorre na narrativa desta fixture — gate vacuoso");

  /* a marcação nasce no renderizador e serve TELA e PAPEL pela mesma função
     (`narrativeHTML`, spec §2) — as duas superfícies são conferidas. A tela
     passa pelo mapa de apresentação; o papel montado em host destacado, não. */
  const superficies = [
    { nome: "tela", root: q(R.d, "#ux-journey .jn-narrative"), texto: copy(fonte) },
    { nome: "papel", root: q(printDom(R.w), "#pr-journey .jn-narrative"), texto: fonte }
  ];
  superficies.forEach(s => {
    if (!s.root) throw new Error("narrativa ausente na superfície '" + s.nome + "'");
    DOMS_FROZEN.forEach((dm, i) => {
      const esperado = ocorrencias(s.texto, dm.pt);
      const marcas = qa(s.root, '.jn-dom[data-dom="' + i + '"]');
      if (marcas.length !== esperado)
        throw new Error(s.nome + ": '" + dm.pt + "' ocorre " + esperado + "x na narrativa e tem " +
          marcas.length + " marca(s) .jn-dom[data-dom=\"" + i + "\"]");
      marcas.forEach(m => {
        if (m.textContent !== dm.pt)
          throw new Error(s.nome + ": marca data-dom=" + i + " com texto " + JSON.stringify(m.textContent) +
            " (esperado " + JSON.stringify(dm.pt) + ")");
      });
    });
    /* nenhuma marca com índice fora do namespace de DOMS */
    qa(s.root, ".jn-dom").forEach(m => {
      const v = m.getAttribute("data-dom");
      if (!/^\d+$/.test(String(v)) || Number(v) < 0 || Number(v) >= DOMS_FROZEN.length)
        throw new Error(s.nome + ": marca com data-dom fora de DOMS: " + v);
    });
  });

  /* canal NÃO-CROMÁTICO obrigatório na regra de `.jn-dom` */
  const regras = cssRules(fs.readFileSync(UX_CSS, "utf8"))
    .filter(r => seletoresDe(r).some(s => /(^|[\s>+~])\.jn-dom(\b|[.:[])/.test(s)));
  if (!regras.length) throw new Error("nenhuma regra CSS para .jn-dom em ui_ux_v32.css");
  if (!regras.some(r => /(^|[;\s])font-weight\s*:/.test(r.decls)))
    throw new Error("canal não-cromático ausente: nenhuma regra de .jn-dom declara font-weight");

  /* nenhum hex de domínio em JavaScript (precedente tests_p52_layout.js:676) */
  const js = fs.readFileSync(JOURNEY_JS, "utf8");
  if (/#(9063CD|3CB17E|2CCCD3|307FE2|A2B2C8|DA291C)/i.test(js))
    throw new Error("hex de domínio no renderizador da narrativa");
  return true;
});

/* ============================================================================
   D009-DOM2 · C5 — a narrativa continua string pura (INV-7)
   ========================================================================== */
T("D009-DOM2", "colorir não injeta markup no pipeline determinístico nem altera o texto da narrativa", () => {
  [FX52.P52_F1, FX52.P52_F3, FX52.P52_F5].forEach(fx => {
    const R = resultsDom(fx);
    const copy = copyOf(R.w);
    const snap = R.w.__DEV.buildNarrativeSnapshot();
    const nar = R.w.__DEV.buildExecutiveNarrative(snap);
    nar.paragraphs.forEach((p, k) => {
      if (typeof p !== "string") throw new Error(fx.id + ": paragraphs[" + k + "] não é string");
      if (p.indexOf("<") >= 0 || p.indexOf(">") >= 0)
        throw new Error(fx.id + ": markup em paragraphs[" + k + "]: " + JSON.stringify(p.slice(0, 80)));
    });
    if (nar.trace.length !== nar.paragraphs.length)
      throw new Error(fx.id + ": trace " + nar.trace.length + " != paragraphs " + nar.paragraphs.length);
    const ps = qa(R.d, "#ux-journey .jn-narrative > p");
    if (ps.length !== nar.paragraphs.length)
      throw new Error(fx.id + ": " + ps.length + " <p> na tela para " + nar.paragraphs.length + " parágrafos");
    ps.forEach((el, k) => {
      /* byte a byte contra a string PURA, com a transformação declarada da 5.2
         aplicada — colorir não pode mudar o texto, e o mapa de apresentação já
         mudava antes desta demanda */
      const esperado = copy(nar.paragraphs[k]);
      if (el.textContent !== esperado) {
        let i = 0; while (i < esperado.length && el.textContent[i] === esperado[i]) i++;
        throw new Error(fx.id + ": <p>[" + k + "] difere de paragraphs[" + k + "] na posição " + i +
          " — DOM " + JSON.stringify(el.textContent.slice(Math.max(0, i - 30), i + 30)) +
          " / esperado " + JSON.stringify(esperado.slice(Math.max(0, i - 30), i + 30)));
      }
    });
  });
  return true;
});

/* ============================================================================
   D009-NXT1 · C6 — fim da repetição em prosa dos próximos passos
   ========================================================================== */
T("D009-NXT1", "com temas e suficiência aberta o P3 aponta para “Para avançar” e não reenumera; a lista continua a única enumeração", () => {
  const R = resultsDom(FX52.P52_F1);
  const copy = copyOf(R.w);
  const snap = R.w.__DEV.buildNarrativeSnapshot();
  const temas = R.w.__DEV.evolutionThemes(snap);
  const nar = R.w.__DEV.buildExecutiveNarrative(snap);
  /* não-vacuidade: o gate só existe neste ramo */
  if (!snap.maturity.sufficient) throw new Error("fixture com suficiência FECHADA — ramo errado");
  if (!temas.length) throw new Error("fixture sem temas de evolução — gate vacuoso");

  const p3 = nar.paragraphs[2];
  temas.forEach(t => {
    if (p3.indexOf(t.phrase) >= 0)
      throw new Error("tema enumerado em prosa no P3: " + JSON.stringify(t.phrase));
    /* a forma que o P3 usava: minúscula e sem ponto final */
    const minus = t.phrase.replace(/\.$/, "").toLowerCase();
    if (p3.toLowerCase().indexOf(minus) >= 0)
      throw new Error("tema enumerado em prosa no P3 (forma minúscula): " + JSON.stringify(minus));
  });
  /* a <ul> continua sendo a ÚNICA enumeração, com as N frases */
  const listas = qa(R.d, "#ux-journey .jn-themes");
  if (listas.length !== 1) throw new Error(listas.length + " blocos .jn-themes (esperado 1)");
  const itens = qa(listas[0], "ul > li").map(li => li.textContent);
  if (itens.length !== temas.length)
    throw new Error(itens.length + " itens na lista para " + temas.length + " temas");
  itens.forEach((v, k) => {
    if (v !== copy(temas[k].phrase))
      throw new Error("item " + k + " da lista = " + JSON.stringify(v) + " != " + JSON.stringify(copy(temas[k].phrase)));
  });
  /* o P3 cita o rótulo canônico da lista */
  if (p3.indexOf("Para avançar") < 0)
    throw new Error("P3 não cita o rótulo canônico “Para avançar”: " + JSON.stringify(p3.slice(0, 140)));
  /* rastreabilidade preservada: a frase existe porque os temas existem */
  const src = (nar.trace[2] || {}).sources || [];
  if (src.indexOf("evolution.themes") < 0)
    throw new Error("trace[2].sources perdeu 'evolution.themes': " + JSON.stringify(src));
  return true;
});

/* ============================================================================
   D009-NXT2 · C7 — sem tema não há ponteiro; o ramo insuficiente é preservado
   REGRESSÃO: este gate nasce VERDE contra o produto atual, de propósito — ele
   guarda o que a demanda NÃO pode quebrar. Seu poder discriminante é provado
   pelo mutante D009-M8 (emitir o ponteiro incondicionalmente).
   ========================================================================== */
T("D009-NXT2", "sem tema não há lista nem ponteiro; com suficiência fechada o P3 mantém a frase de validação de evidências", () => {
  /* (a) sem tema */
  const A = results009(FX9.D009_F1);
  const snapA = A.w.__DEV.buildNarrativeSnapshot();
  const temasA = A.w.__DEV.evolutionThemes(snapA);
  if (temasA.length) throw new Error("fixture D009-F1 deixou de ser o ramo SEM temas (" + temasA.length + ")");
  if (qa(A.d, ".jn-themes").length)
    throw new Error("existe .jn-themes sem tema algum");
  const p3a = A.w.__DEV.buildExecutiveNarrative(snapA).paragraphs[2];
  if (p3a.indexOf("Para avançar") >= 0)
    throw new Error("P3 aponta para uma lista que não existe: " + JSON.stringify(p3a.slice(0, 140)));
  if (!/sustenta[çc][ãa]o e otimiza[çc][ãa]o/i.test(p3a))
    throw new Error("P3 perdeu a frase de sustentação/otimização: " + JSON.stringify(p3a.slice(0, 140)));

  /* (b) suficiência fechada — regressão de tests_journey_m45.js (N13-N14) */
  const B = resultsDom(FX52.P52_F3);
  const snapB = B.w.__DEV.buildNarrativeSnapshot();
  if (snapB.maturity.sufficient) throw new Error("P52-F3 deixou de ser gate FECHADO");
  const p3b = B.w.__DEV.buildExecutiveNarrative(snapB).paragraphs[2];
  if (p3b.indexOf("completar e validar as evidências") < 0)
    throw new Error("P3 do ramo insuficiente perdeu a frase canônica: " + JSON.stringify(p3b.slice(0, 140)));
  return true;
});

/* ============================================================================
   D009-GLO1 · C8 — explicação de uma frase por capability declarada, na TELA
   ========================================================================== */
T("D009-GLO1", "cada capability declarada com verbete ganha o PRIMEIRO PERÍODO do verbete canônico na tela; UNSET e sem-verbete não ganham nada", () => {
  const R = resultsDom(FX52.P52_F5);
  const copy = copyOf(R.w);
  const V = R.w.__DEV.V32;
  const HELP = capHelpMap();
  /* a lista de declaradas vem do MODELO, nunca do DOM */
  const declaradas = Object.keys(V.TECH_LANDSCAPE).filter(id => V.TECH_LANDSCAPE[id].presence !== "UNSET");
  const unset = Object.keys(V.TECH_LANDSCAPE).filter(id => V.TECH_LANDSCAPE[id].presence === "UNSET");
  if (!declaradas.length) throw new Error("fixture sem capability declarada — gate vacuoso");
  if (!unset.length) throw new Error("fixture sem capability UNSET — o ramo negativo não seria medido");
  const comVerbete = declaradas.filter(id => id in HELP);
  const semVerbete = declaradas.filter(id => !(id in HELP));
  if (!comVerbete.length) throw new Error("nenhuma capability declarada tem verbete — gate vacuoso");

  const rows = qa(R.d, "#v32decl .v32-decl-row");
  /* a contagem consumida por `p52ContextSummary` não muda */
  if (rows.length !== declaradas.length)
    throw new Error(rows.length + " .v32-decl-row para " + declaradas.length + " capabilities declaradas");

  const rowDe = id => rows.find(r => txt(r.querySelector("strong")) === copy(V.CAPABILITIES[id].name));
  comVerbete.forEach(id => {
    const row = rowDe(id);
    if (!row) throw new Error("sem linha declarada para " + id);
    const help = qa(row, ".v32-caphelp");
    if (help.length !== 1) throw new Error(id + ": " + help.length + " nós .v32-caphelp (esperado 1)");
    const esperado = copy(primeiroPeriodo(HELP[id]));
    if (txt(help[0]) !== esperado)
      throw new Error(id + ": frase = " + JSON.stringify(txt(help[0])) + " != primeiro período " + JSON.stringify(esperado));
    if (/Forti[A-Z]/.test(txt(help[0]))) throw new Error(id + ": nome de produto na explicação");
  });
  /* B13 · declarada SEM verbete não ganha nada. Hoje o cruzamento é VAZIO —
     todas as 22 capabilities com `landscapeEnabled: true` têm verbete —, então
     a cláusula é guardada pela invariante que a torna vazia: se alguém criar
     capability declarável sem verbete, o ramo passa a ser exercitado de fato,
     em vez de continuar passando em silêncio. */
  semVerbete.forEach(id => {
    const row = rowDe(id);
    if (row && qa(row, ".v32-caphelp").length)
      throw new Error(id + ": capability declarada SEM verbete ganhou explicação");
  });
  if (!semVerbete.length) {
    const orfas = Object.keys(V.TECH_LANDSCAPE).filter(id => !(id in HELP));
    if (orfas.length)
      throw new Error("B13 deixou de ser inalcançável: capabilities declaráveis sem verbete = " + orfas.join(", "));
  }
  /* nenhuma explicação além das declaradas com verbete (mata a emissão sob UNSET) */
  const todas = qa(R.d, "#v32decl .v32-caphelp");
  if (todas.length !== comVerbete.length)
    throw new Error(todas.length + " nós .v32-caphelp em #v32decl para " + comVerbete.length + " declaradas com verbete");
  return true;
});

/* ============================================================================
   D009-GLO2 · C9 — a MESMA explicação no relatório impresso (P14)
   ========================================================================== */
T("D009-GLO2", "no papel cada capability declarada com verbete traz a mesma frase, e a ordem das seções do relatório não muda", () => {
  const R = resultsDom(FX52.P52_F5);
  const V = R.w.__DEV.V32;
  const HELP = capHelpMap();
  const declaradas = Object.keys(V.TECH_LANDSCAPE).filter(id => V.TECH_LANDSCAPE[id].presence !== "UNSET");
  const comVerbete = declaradas.filter(id => id in HELP);
  if (!comVerbete.length) throw new Error("fixture sem capability declarada com verbete — gate vacuoso");

  const host = printDom(R.w);
  const cards = qa(host, "#pr-landscape .pr-card");
  if (cards.length !== declaradas.length)
    throw new Error(cards.length + " .pr-card em #pr-landscape para " + declaradas.length + " declaradas");
  comVerbete.forEach(id => {
    const card = cards.find(c => txt(c.querySelector("b")) === V.CAPABILITIES[id].name);
    if (!card) throw new Error("sem card impresso para " + id);
    const help = qa(card, ".v32-caphelp");
    if (help.length !== 1) throw new Error(id + ": " + help.length + " nós .v32-caphelp no papel (esperado 1)");
    const esperado = primeiroPeriodo(HELP[id]);
    if (txt(help[0]) !== esperado)
      throw new Error(id + " (papel): frase = " + JSON.stringify(txt(help[0])) + " != " + JSON.stringify(esperado));
    if (/Forti[A-Z]/.test(txt(help[0]))) throw new Error(id + " (papel): nome de produto na explicação");
  });
  declaradas.filter(id => !(id in HELP)).forEach(id => {
    const card = cards.find(c => txt(c.querySelector("b")) === V.CAPABILITIES[id].name);
    if (card && qa(card, ".v32-caphelp").length)
      throw new Error(id + " (papel): declarada sem verbete ganhou explicação");
  });

  /* a ordem do PAPEL é a pinada por tests_p50_core.js:3692-3706 (P14: o
     glossário acompanha o papel; a ordem do papel, não). Seção que a fixture
     não produz simplesmente não aparece — a asserção é de SUBSEQUÊNCIA sobre
     os ids pinados, e não de igualdade, para não depender da fixture daquele
     gate. Ids fora do pin (ex.: `pr-arch`) não são governados aqui. */
  const PIN = ["pr-cover", "pr-howto", "pr-maturity", "pr-prios", "pr-findings",
    "pr-landscape", "pr-interp", "pr-support", "pr-journey", "pr-target", "pr-annex"];
  const obs = Array.from(host.children).map(n => n.id).filter(id => PIN.indexOf(id) >= 0);
  let prev = -1;
  obs.forEach(id => {
    const ix = PIN.indexOf(id);
    if (ix <= prev) throw new Error("ordem do relatório impresso alterada: " + obs.join(" > "));
    prev = ix;
  });
  if (obs.indexOf("pr-landscape") < 0) throw new Error("#pr-landscape ausente do relatório impresso");
  return true;
});

/* ============================================================================
   D009-UNS1 · C10 — UNSET não fala como NONE, e o bloco de ausência não renderiza
   NOTA DE DIVERGÊNCIA (spec-validate): a cláusula "zero .ux-tgt-en com a frase
   de NONE" foi escrita antes da ampliação C13, ratificada depois pelo mesmo
   proprietário. Com C13, as práticas em S4 (`landscapeEnabled: false`) MANTÊM a
   frase (spec §5, tabela de estados). Logo a cláusula só pode valer para as
   práticas em S2 — que é como este gate a afirma, por prática e não em bloco.
   Divergência registrada no relatório da fase, não resolvida em silêncio.
   ========================================================================== */
T("D009-UNS1", "contexto não informado: a prática em S2 perde a linha, o aviso único nasce e nada conclui sobre processo/pessoas/governança", () => {
  const R = resultsDom(FX52.P52_F2);
  const copy = copyOf(R.w);
  const V = R.w.__DEV.V32;
  /* pré-condição declarada da fixture: landscape 100% UNSET */
  const naoUnset = Object.keys(V.TECH_LANDSCAPE).filter(id => V.TECH_LANDSCAPE[id].presence !== "UNSET");
  if (naoUnset.length) throw new Error("P52-F2 não está 100% UNSET: " + naoUnset.join(", "));
  const porEstado = FX9.d009TargetsByState(R.w);
  if (!porEstado.S2.length) throw new Error("fixture sem prática-alvo em S2 — gate vacuoso");

  /* a linha por prática NÃO renderiza para quem está em S2 */
  porEstado.S2.forEach(qid => {
    const ov = q(R.d, '.ux-tgt-ov[data-qid="' + qid + '"]');
    if (!ov) throw new Error("prática-alvo " + qid + " não renderizada em .ux-tgt-ovs");
    const en = qa(ov, ".ux-tgt-en");
    if (en.length) throw new Error(qid + " (S2): linha .ux-tgt-en renderizada — " + JSON.stringify(txt(en[0]).slice(0, 90)));
  });
  /* e a frase de NONE não aparece sob nenhuma prática em S2 */
  qa(R.d, ".ux-tgt-en").forEach(en => {
    const ov = en.closest(".ux-tgt-ov");
    const qid = ov && ov.getAttribute("data-qid");
    if (porEstado.S2.indexOf(qid) >= 0 && txt(en) === copy(FRASE_NONE))
      throw new Error("frase de NONE publicada sob contexto UNSET, em " + qid);
  });

  /* exatamente um bloco de ausência */
  const avisos = qa(R.d, '[data-ux-absence="target-enablers"]');
  if (avisos.length !== 1) throw new Error(avisos.length + " nós [data-ux-absence=\"target-enablers\"] (esperado 1)");
  const t = txt(avisos[0]);
  if (!/n[ãa]o foi informad/i.test(t))
    throw new Error("o aviso não declara que o contexto NÃO FOI INFORMADO: " + JSON.stringify(t.slice(0, 140)));
  if (/processo,\s*pessoas,\s*governan[çc]a/i.test(t))
    throw new Error("o aviso conclui sobre processo/pessoas/governança");
  if (/(aus[êe]ncia de|n[ãa]o (h[áa]|possui|existe|tem|dispõe de)\s+)(tecnologia|ferramenta)/i.test(t))
    throw new Error("o aviso afirma ausência de tecnologia: " + JSON.stringify(t.slice(0, 140)));

  /* a lista do aviso é derivada no MESMO passe da lista de práticas (B5) */
  const renderizadas = qa(R.d, ".ux-tgt-ovs .ux-tgt-ov[data-qid]").map(n => n.getAttribute("data-qid"));
  /* o rótulo procurado passa pelo mapa de apresentação — sem isso, procurar
     "Mandato e objetivos" na TELA nunca casaria e a asserção negativa viraria
     PASS vacuoso */
  const nomeadas = Object.keys(R.w.__DEV.TARGET.overrides).filter(qid => contemPalavra(t, copy(LBL_OF[qid])));
  nomeadas.forEach(qid => {
    if (renderizadas.indexOf(qid) < 0)
      throw new Error("o aviso nomeia " + qid + ", que não está na lista renderizada de práticas-alvo");
  });
  if (nomeadas.slice().sort().join(",") !== porEstado.S2.slice().sort().join(","))
    throw new Error("aviso nomeia [" + nomeadas.join(",") + "] e as práticas em S2 são [" + porEstado.S2.join(",") + "]");
  return true;
});

/* ============================================================================
   D009-UNS2 · C11 — contexto informado e nada se aplica mantém a frase, sem aviso
   REGRESSÃO: nasce VERDE contra o produto atual (a frase de hoje já é a de S3).
   O que o gate impede é que a reescrita de `tgtEnablersHTML()` troque a frase
   de S3 pela de S2 — poder discriminante provado pelo mutante D009-M13.
   ========================================================================== */
T("D009-UNS2", "capability informada e sem candidato/serviço: a frase substantiva permanece e nenhum bloco de ausência nasce", () => {
  const R = results009(FX9.D009_F1);
  const copy = copyOf(R.w);
  FX9.d009AssertFixtureStates(R.w, FX9.D009_F1);        /* a fixture prova o estado ANTES da asserção */
  const porEstado = FX9.d009TargetsByState(R.w);
  if (!porEstado.S3.length) throw new Error("fixture D009-F1 deixou de alcançar S3");
  if (porEstado.S2.length) throw new Error("fixture D009-F1 passou a ter prática em S2: " + porEstado.S2.join(","));

  porEstado.S3.forEach(qid => {
    const ov = q(R.d, '.ux-tgt-ov[data-qid="' + qid + '"]');
    if (!ov) throw new Error("prática-alvo " + qid + " não renderizada");
    const en = qa(ov, ".ux-tgt-en");
    if (en.length !== 1) throw new Error(qid + " (S3): " + en.length + " linhas .ux-tgt-en (esperado 1)");
    if (txt(en[0]) !== copy(FRASE_NONE))
      throw new Error(qid + " (S3): frase = " + JSON.stringify(txt(en[0]).slice(0, 120)));
  });
  if (qa(R.d, "[data-ux-absence]").length)
    throw new Error("bloco de ausência nasceu com o contexto INFORMADO");
  if (qa(printDom(R.w), "[data-ux-absence]").length)
    throw new Error("bloco de ausência nasceu no PAPEL com o contexto INFORMADO");
  return true;
});

/* ============================================================================
   D009-UNS3 · C12 — contexto parcial (B9): o aviso nomeia exatamente quem ficou
   de fora E NÃO DECLARA AUSÊNCIA GLOBAL DE CONTEXTO
   ========================================================================== */
T("D009-UNS3", "com uma capability informada e outra UNSET, o aviso lista só a prática da UNSET, não declara ausência global de contexto, e a informada mantém sua linha", () => {
  const R = results009(FX9.D009_F2);
  const copy = copyOf(R.w);
  FX9.d009AssertFixtureStates(R.w, FX9.D009_F2);
  const porEstado = FX9.d009TargetsByState(R.w);
  if (!porEstado.S2.length || !porEstado.S3.length)
    throw new Error("fixture D009-F2 deixou de ser o par S2×S3: " + JSON.stringify(porEstado));

  const avisos = qa(R.d, '[data-ux-absence="target-enablers"]');
  if (avisos.length !== 1) throw new Error(avisos.length + " blocos de ausência (esperado 1)");
  const t = txt(avisos[0]);
  porEstado.S2.forEach(qid => {
    if (!contemPalavra(t, copy(LBL_OF[qid])))
      throw new Error("o aviso não nomeia a prática sem contexto: " + qid + " (" + copy(LBL_OF[qid]) + ")");
  });
  porEstado.S3.concat(porEstado.S1, porEstado.S4).forEach(qid => {
    if (contemPalavra(t, copy(LBL_OF[qid])))
      throw new Error("o aviso nomeia " + qid + ", cuja capability foi informada");
  });
  /* a prática informada mantém sua linha, com a frase de hoje */
  porEstado.S3.forEach(qid => {
    const en = qa(q(R.d, '.ux-tgt-ov[data-qid="' + qid + '"]') || R.d.createElement("div"), ".ux-tgt-en");
    if (en.length !== 1 || txt(en[0]) !== copy(FRASE_NONE))
      throw new Error(qid + " (S3) perdeu a linha substantiva no ramo parcial");
  });

  /* ------------------------------------------------------------------------
     [rodada 2 · 2026-08-28] A LISTA estava certa; a ABERTURA, não.

     Achado do `product-owner`: `tgtAbsenceHTML` (`ui_target_v32.js:217`) monta a
     frase SEM RAMO e abre com "O contexto tecnológico não foi informado nesta
     sessão". No caso PARCIAL isso é FALSO — o contexto FOI informado, apenas não
     para as práticas nomeadas — e o próprio relatório desmente a frase duas
     seções abaixo, onde `#v32decl` lista as capabilities declaradas. É o mesmo
     defeito que esta demanda corrige em `ui_target_v32.js:166`, um degrau acima:
     afirmar mais do que a sessão sustenta.

     Por que passou até aqui: este gate afirmava só a LISTA, e `D009-UNS1` usa
     `/não foi informad/i`, que casa igual nos dois escopos. Verde e impreciso ao
     mesmo tempo.

     O gate afirma o PAR, nunca a redação da correção:
       (+) o aviso CONTINUA declarando não-informação — a mesma regra que
           `D009-UNS1` mede. Sem esta cláusula, APAGAR a frase faria a asserção
           negativa passar vacuosamente, que é pior que gate ausente;
       (−) e NÃO a declara em ESCOPO DE SESSÃO, que é o escopo falso aqui.
     Duas correções plausíveis passam — "…não foi informado para estas
     práticas-alvo." e "…não foi informado nesta sessão para estas
     práticas-alvo." —, e a frase de hoje reprova. Escolher a redação é do
     `ui-engineer`; o gate só recusa a proposição falsa.

     A cláusula vive AQUI, e não em `D009-UNS1`, de propósito: sob landscape 100%
     UNSET a frase global é VERDADEIRA, e é exatamente esse caso que `D009-UNS1`
     mede. `D009-UNS1` NÃO é alterado.

     Oráculo independente da prosa: `V32.TECH_LANDSCAPE` prova que existe ao
     menos uma capability declarada NESTA sessão — é esse fato do modelo, não a
     leitura do texto, que torna a afirmação de escopo global uma contradição.
     ---------------------------------------------------------------------- */
  const V = R.w.__DEV.V32;
  const declaradas = Object.keys(V.TECH_LANDSCAPE).filter(id => V.TECH_LANDSCAPE[id].presence !== "UNSET");
  if (!declaradas.length)
    throw new Error("D009-F2 deixou de ter capability declarada: o caso PARCIAL não existiria e a cláusula seria vacuosa");
  if (!/n[ãa]o foi informad/i.test(t))
    throw new Error("o aviso deixou de declarar não-informação (mesma regra de D009-UNS1): " + JSON.stringify(t.slice(0, 140)));
  /* Proposições de ausência GLOBAL: a afirmação FECHA (terminador) sem restringir
     o alcance. Lista explícita e extensível — paráfrase nova que escape daqui e
     ainda seja falsa é lacuna a fechar por edição declarada, nunca em silêncio. */
  const AUSENCIA_GLOBAL = [
    /n[ãa]o (?:foi|foram) informad\w*\s+(?:nesta|desta|na)\s+sess[ãa]o\s*[.;]/i,
    /nenhum contexto tecnol[óo]gico foi informado/i
  ];
  const global = AUSENCIA_GLOBAL.map(re => t.match(re)).find(Boolean);
  if (global)
    throw new Error("no caso PARCIAL o aviso declara ausência de contexto em ESCOPO DE SESSÃO — " +
      declaradas.length + " capability(ies) foram declaradas nesta sessão (" + declaradas.join(", ") +
      ") e o relatório as lista em #v32decl: " + JSON.stringify(global[0]));
  return true;
});

/* ============================================================================
   D009-UNS4 · C13 — landscape não aplicável nunca vira "não informado"
   (ampliação sinalizada, ratificada pelo proprietário em 2026-08-27)
   ========================================================================== */
T("D009-UNS4", "prática de capability com landscapeEnabled:false nunca entra no aviso, em nenhum estado de landscape", () => {
  /* as 5 perguntas vêm de V32.CAPABILITIES; a lista literal da spec é o SEGUNDO
     oráculo — se as duas divergirem, é a spec ou o modelo que mudou, e o gate
     avisa em vez de escolher sozinho */
  const LITERAL_SPEC = ["governance", "mandate", "policies", "team-capacity", "training"];
  [
    { nome: "landscape 100% UNSET", R: resultsDom(FX52.P52_F2) },
    { nome: "landscape parcial (B9)", R: results009(FX9.D009_F2) }
  ].forEach(caso => {
    const R = caso.R;
    const copy = copyOf(R.w);
    const semLandscape = FX9.d009NoLandscapeQids(R.w);
    if (semLandscape.join(",") !== LITERAL_SPEC.join(","))
      throw new Error("as práticas sem landscape do modelo [" + semLandscape.join(",") +
        "] divergem da lista literal da spec [" + LITERAL_SPEC.join(",") + "]");
    const porEstado = FX9.d009TargetsByState(R.w);
    /* não-vacuidade: o aviso tem de existir para que "nunca aparece nele" meça algo */
    if (!porEstado.S2.length) throw new Error(caso.nome + ": sem prática em S2 — gate vacuoso");
    const avisos = qa(R.d, '[data-ux-absence="target-enablers"]');
    if (avisos.length !== 1) throw new Error(caso.nome + ": " + avisos.length + " blocos de ausência (esperado 1)");
    const t = txt(avisos[0]);
    semLandscape.forEach(qid => {
      if (contemPalavra(t, copy(LBL_OF[qid])))
        throw new Error(caso.nome + ": o aviso nomeia " + qid + ", cuja capability não tem landscape a informar");
    });
    /* e as práticas em S4 mantêm a frase substantiva, nunca o silêncio de S2 */
    porEstado.S4.forEach(qid => {
      const ov = q(R.d, '.ux-tgt-ov[data-qid="' + qid + '"]');
      if (!ov) throw new Error(caso.nome + ": prática-alvo " + qid + " não renderizada");
      const en = qa(ov, ".ux-tgt-en");
      if (en.length !== 1 || txt(en[0]) !== copy(FRASE_NONE))
        throw new Error(caso.nome + ": " + qid + " (S4) não manteve a frase substantiva");
    });
  });
  return true;
});

/* ============================================================================
   D009-ABS1 · C14 — o aviso é único, acionável e nomeia o que ficou de fora
   ========================================================================== */
T("D009-ABS1", "um aviso por render, idempotente, com contagem e lista; caminho para o editor na tela e a mesma frase sem controle no papel", () => {
  const R = resultsDom(FX52.P52_F2);
  const copy = copyOf(R.w);
  const porEstado = FX9.d009TargetsByState(R.w);
  if (!porEstado.S2.length) throw new Error("fixture sem prática em S2 — gate vacuoso");

  const avisos = qa(R.d, '[data-ux-absence="target-enablers"]');
  if (avisos.length !== 1) throw new Error(avisos.length + " nós de aviso (esperado 1)");
  const aviso = avisos[0];
  /* posição declarada (spec §5): dentro do card de comparação, ANTES da lista */
  const card = q(R.d, "#ux-tgt-cmp");
  if (!card || !card.contains(aviso)) throw new Error("o aviso não vive dentro do card de comparação");
  const lista = q(R.d, ".ux-tgt-ovs");
  if (!lista) throw new Error("lista de práticas-alvo ausente");
  if (!(aviso.compareDocumentPosition(lista) & 4))
    throw new Error("o aviso não precede a lista de práticas-alvo");

  /* contagem E lista */
  const t = txt(aviso);
  const n = porEstado.S2.length;
  const PT = { 1: "uma", 2: "duas", 3: "três", 4: "quatro", 5: "cinco" };
  const temContagem = new RegExp("(?<!\\d)" + n + "(?!\\d)").test(t) ||
    (PT[n] && contemPalavra(t.toLowerCase(), PT[n]));
  if (!temContagem) throw new Error("o aviso não nomeia a contagem (" + n + "): " + JSON.stringify(t.slice(0, 140)));
  porEstado.S2.forEach(qid => {
    if (!contemPalavra(t, copy(LBL_OF[qid])))
      throw new Error("o aviso não nomeia a prática " + qid + " (" + copy(LBL_OF[qid]) + ")");
  });

  /* idempotência: mesmo censo depois de dois renders consecutivos */
  R.w.__DEV.showResults();
  R.w.__DEV.showResults();
  const depois = qa(R.d, '[data-ux-absence="target-enablers"]');
  if (depois.length !== 1) throw new Error("após dois renders há " + depois.length + " nós de aviso");
  if (txt(depois[0]) !== t) throw new Error("o texto do aviso mudou entre renders");

  /* TELA: caminho explícito para o editor de contexto */
  const INTERATIVO = "button, a[href], input, select, [role=\"button\"]";
  const controles = qa(depois[0], INTERATIVO);
  const nomeiaControle = depois[0].textContent.indexOf(CTRL_CONTEXTO) >= 0;
  if (!controles.length && !nomeiaControle)
    throw new Error("o aviso de TELA não oferece caminho para o editor de contexto (nem controle, nem o rótulo canônico “" + CTRL_CONTEXTO + "”)");

  /* PAPEL: a mesma frase, sem controle */
  const host = printDom(R.w);
  const impressos = qa(host, '[data-ux-absence="target-enablers"]');
  if (impressos.length !== 1) throw new Error(impressos.length + " nós de aviso no PAPEL (esperado 1)");
  if (qa(impressos[0], INTERATIVO).length)
    throw new Error("o aviso do PAPEL carrega controle interativo");
  /* "a mesma frase": o texto de tela, retirado o texto dos controles, é o do
     papel — com o mapa de apresentação aplicado ao papel, que em host destacado
     ainda não passou por `p52Copy` */
  let telaSemControle = depois[0].textContent;
  controles.forEach(c => { telaSemControle = telaSemControle.split(c.textContent).join(" "); });
  const norm = s => String(s).replace(/\s+/g, " ").trim();
  const noPapel = norm(copy(impressos[0].textContent));
  if (norm(telaSemControle) !== noPapel)
    throw new Error("tela e papel não publicam a mesma frase:\n  tela : " + JSON.stringify(norm(telaSemControle).slice(0, 160)) +
      "\n  papel: " + JSON.stringify(noPapel.slice(0, 160)));
  return true;
});

/* ============================================================================
   D009-LEG1 · C15 — a nota da jornada sai da régua de 78ch, e só ela
   Regra dura (tasks.md T003): seletor não suportado pelo `Element.matches`
   PROPAGA exceção como FAIL — nunca é engolido como "não casou".
   ========================================================================== */
T("D009-LEG1", "nenhuma regra de max-width em ch alcança .jn-note; o restante de .ux-micro continua sob o teto, dentro do @media screen", () => {
  const R = resultsDom(FX52.P52_F1);
  const regras = cssRules(fs.readFileSync(P52_CSS, "utf8")).filter(r => MAXW_CH.test(r.decls));
  if (!regras.length) throw new Error("nenhuma regra com max-width em ch em ui_p52_workspace_v32.css — gate vacuoso");
  /* a régua vive em @media screen: resolver isto fora da media query levaria a
     restrição ao papel e cegaria o oráculo (spec §6) */
  regras.forEach(r => {
    if (!r.at.some(a => /^@media\b/.test(a) && /\bscreen\b/.test(a)))
      throw new Error("regra de régua fora do @media screen da camada: " + r.sel.replace(/\s+/g, " "));
  });

  const nota = q(R.d, ".p52-sec .jn-note");
  if (!nota) throw new Error("a nota da jornada não está dentro de uma .p52-sec — cenário errado");
  if (!nota.classList.contains("ux-micro"))
    throw new Error(".jn-note perdeu a classe ux-micro (a régua deixaria de ser o que se mede)");
  const irmao = qa(R.d, ".p52-sec .ux-micro").filter(n => !n.classList.contains("jn-note"))[0];
  if (!irmao) throw new Error("nenhum .ux-micro irmão dentro de .p52-sec — o controle positivo não existiria");

  const casam = (el, quem) => {
    const out = [];
    regras.forEach(r => seletoresDe(r).forEach(sel => {
      let m;
      try { m = el.matches(sel); }
      catch (x) {
        /* R10 §2 — não se engole como "não casou": vira FAIL nomeado */
        throw new Error("seletor não suportado por Element.matches ao testar " + quem + ": '" + sel + "' [" + x.message + "]");
      }
      if (m) out.push(sel);
    }));
    return out;
  };
  const naNota = casam(nota, ".jn-note");
  if (naNota.length)
    throw new Error("a nota da jornada continua na régua de leitura por: " + naNota.join(" | "));
  const noIrmao = casam(irmao, ".ux-micro irmão");
  if (!noIrmao.length)
    throw new Error("a régua deixou de alcançar o restante de .ux-micro dentro de .p52-sec — a alteração foi larga demais");
  return true;
});

/* ============================================================================
   D009-EVB1 · C16 — a base de evidência muda de posição, não de comportamento
   REGRESSÃO: nasce VERDE contra o produto atual, de propósito. Guarda o que a
   ordem nova não pode quebrar; discriminado pelos mutantes D009-M18/M19.
   ========================================================================== */
T("D009-EVB1", "gate aberto: evbase é <details> fechado na última seção; gate fechado: não existe e a suficiência está na 2ª seção", () => {
  /* ABERTO */
  const A = resultsDom(FX52.P52_F1);
  const ev = A.d.getElementById("p52-evbase");
  if (!ev) throw new Error("gate aberto sem #p52-evbase");
  if (ev.tagName !== "DETAILS") throw new Error("#p52-evbase é <" + ev.tagName.toLowerCase() + ">, não <details>");
  if (ev.hasAttribute("open")) throw new Error("#p52-evbase nasce com o atributo open");
  if (!ev.parentNode || ev.parentNode.id !== "p52-sec-actions")
    throw new Error("#p52-evbase pendurado em " + (ev.parentNode && ev.parentNode.id) + " (esperado p52-sec-actions)");
  const keysA = sectionKeys(A.d);
  if (keysA[keysA.length - 1] !== "actions")
    throw new Error("a última seção renderizada é '" + keysA[keysA.length - 1] + "', não 'actions'");
  /* e 'actions' é mesmo a última da ordem nova declarada pela spec */
  if (D009_ORDEM_ABERTA[D009_ORDEM_ABERTA.length - 1] !== "actions")
    throw new Error("a ordem aberta da spec não termina em 'actions'");

  /* FECHADO */
  const B = resultsDom(FX52.P52_F3);
  if (B.d.getElementById("p52-evbase"))
    throw new Error("gate fechado publicou #p52-evbase");
  const suff = B.d.getElementById("p50-suff");
  if (!suff) throw new Error("painel de suficiência ausente com o gate fechado");
  const sec = suff.closest(".p52-sec");
  if (!sec || sec.id !== "p52-sec-evidence")
    throw new Error("#p50-suff vive em " + (sec && sec.id) + " (esperado p52-sec-evidence)");
  if (sectionKeys(B.d).indexOf("evidence") !== 1)
    throw new Error("a seção de evidência não é a 2ª com o gate fechado");
  return true;
});

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD009 LEITURA DO RELATÓRIO: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
