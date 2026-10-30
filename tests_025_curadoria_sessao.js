/* ============================================================================
   TESTES D025 · CURADORIA TRANSACIONAL NA SESSÃO (jsdom) — demanda 025-curadoria-transacional
   Namespace exclusivo D025-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: o papel é lido em jsdom
   depois de `beforeprint`; o Chromium é o job `visual` (KI-3).

   ONDE ESTA SUÍTE É EXECUTADA, E POR QUEM
   ---------------------------------------
   Stage `suites` do `pipeline.yaml` → `.claude/verify/check_suites.py`, que lê a
   chave `d025` de `expected_suites.json` (registro que nasce DEPOIS do green, na
   wave de fecho — spec 019 E2: o registro é oráculo de contagem VERDE) e compara
   a última linha desta saída contra a contagem canônica. Até o registro, o
   stage `suites` reprova NOMEANDO esta suíte como "fora do registro" — janela
   vermelha visível de propósito (plan.md, nota aditiva (a)).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os dezesseis critérios C1..C16 de `specs/025-curadoria-transacional/spec.md`:
   a importação de sessão é SUBSTITUTIVA e ATÔMICA também para a curadoria do
   relatório — validar sem aplicar, snapshot antes de qualquer escrita, candidato
   com a sexta chave inclusive quando ausente, commit dentro da transação — e a
   curadoria está ligada ao ciclo de vida da sessão (Exportar, Nova sessão,
   Reiniciar, editor, prévia).

   Regra única (verbete *Importação substitutiva*): depois de um import
   bem-sucedido o estado da janela é função SÓ do documento; depois de um import
   cancelado, recusado ou falho, é BYTE-IGUAL ao anterior.

   ==========================================================================
   ORÁCULOS INDEPENDENTES DA IMPLEMENTAÇÃO (nenhum lê o fonte de ui_session)
   ==========================================================================
   · bridge: `__CURATION.state()/contract()/published()/offered()/toSession()`;
   · `__DEV.captureCanonicalInputs()` serializado, comparado ENTRE janelas;
   · tela: cards `#p52-workspace #p52-sec-support > .apoio-block[data-p53-sol-produto]`,
     checkboxes `.p53-cur-check` (mapa nome→checked com o painel aberto) e o
     aviso `[data-p53-suprimido]`;
   · papel: `#v32-print-report` DEPOIS de `beforeprint` real, corpo sem `#pr-cover`
     (que carrega datas — precedente S37 da m48);
   · contador de chamadas ao bridge por EMBRULHO DE PROPRIEDADE lida na chamada
     (escritas: fromSession/set/clear/unset/setArchitectureNote/
     unsetArchitectureNote; leitura: toSession, usada pelo snapshot).
   "Assinatura(w)" = JSON de state + contract + inputs canônicos + mapa de
   checkboxes + atributo do aviso + corpo do papel. Dois estados são byte-iguais
   quando as assinaturas coincidem.

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   Alínea que depende de caso DECLARA ela mesma a pré-condição e falha NOMEANDO
   o estado, em vez de fechar verde por ausência de sujeito (`vac()`; lição do
   `D010-INV7`/`EA-11`). Cada gate agrupa alíneas: TODAS são medidas e a falha
   lista as vermelhas — a leitura do red é POR ALÍNEA, não só por gate.

   ==========================================================================
   POR QUE TANTO GATE NASCE VERMELHO AQUI
   ==========================================================================
   Esta suíte é escrita ANTES da implementação (R3 §1/§4). Hoje o validador
   APLICA a curadoria (`fromSession` em `validateSessionDocument`), o candidato
   não a leva, o commit não a escreve, o rollback restaura o ARQUIVO e não a
   sessão, `validate`/`unset`/`hasDraft` não existem. O vermelho é o ponto — e o
   commit dele é a prova de que o critério não foi ajustado ao resultado.

   Nasce VERDE, e isso vai declarado em vez de escondido: `D025-GAT1` — hoje o
   atalho do validador já retém a curadoria sob gate fechado; o poder dele vem
   do mutante `D025-M19` (precedente `D015-NOSUB1`; 019 T004).

   Variáveis: `D025_HTML_OVERRIDE` (HTML construído alternativo — o harness de
   mutação aponta a cópia mutada), `D025_ONLY` (ids separados por vírgula),
   `D025_DOC_OVERRIDE` (diretório de onde as alíneas documentais leem
   `SESSION_SCHEMA_V32.md`/`USER_GUIDE.md`, para que o harness mute cópias — R7 §3).
   A suíte não escreve na árvore, não spawna processo e não pina hash.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_NOME = "quickscan_secops_soccmm_v3_2_dev.html";
const HTML_PATH = process.env.D025_HTML_OVERRIDE || path.join(HERE, HTML_NOME);
const DOC_DIR = process.env.D025_DOC_OVERRIDE || HERE;
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D025-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD025 CURADORIA SESSAO: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const ONLY = (process.env.D025_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
const GATES = [];
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  GATES.push({ id, label, fn });
}
/* falha NOMEADA por ausência de sujeito — nunca verde por vacuidade */
function vac(alinea, porque) { throw new Error("VÁCUO em " + alinea + ": " + porque); }
/* alíneas: todas medidas; a falha do gate lista as vermelhas */
async function alineas(fn) {
  const falhas = [];
  const A = async (letra, f) => { try { await f(); } catch (e) { falhas.push("(" + letra + ") " + e.message); } };
  await fn(A);
  if (falhas.length) throw new Error(falhas.join(" · "));
  return true;
}
const must = (cond, msg) => { if (!cond) throw new Error(msg); };

const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const qa = (n, s) => Array.from(n.querySelectorAll(s));
const clone = o => JSON.parse(JSON.stringify(o));
/* igualdade profunda independente da ordem das chaves; `undefined` conta como ausente */
function canon(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
  return "{" + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
}
const deepEq = (a, b) => canon(a) === canon(b);

/* ==========================================================================
   Sessão de referência: nível 0 em tudo com PRIOS (padrão `tests_019_curadoria.js`),
   ≥ 9 produtos ofertados. `vazia` entrega só o DOM (janela virgem, sem respostas);
   `poucasRespostas` fecha o gate de suficiência; `contexto` declara contexto
   tecnológico e produz a leitura arquitetural (`#v32arch-note`).
   ========================================================================== */
const PRIOS = ["endpoint", "logs", "network-visibility"];
let JANELAS = [];
function boot(opts) {
  const o = opts || {};
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  JANELAS.push(w);
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  if (o.vazia) return { w, d };
  sessao(w, o);
  return { w, d };
}
/* (re)constrói a avaliação de referência numa janela já aberta — usado também
   depois de Nova sessão/Reiniciar, que levam a janela para a home */
function sessao(w, opts) {
  const o = opts || {};
  const nivel = ("nivel" in o) ? o.nivel : 0;
  w.__DEV.setArq(0);
  const ids = w.eval("QS.map(q=>q.id)");
  ids.forEach(id => w.__DEV.setAnswerById(id, nivel));
  if (o.poucasRespostas) ids.slice(3).forEach(id => w.__DEV.setAnswerById(id, null));
  if (o.contexto) {
    const V = w.__DEV.V32;
    ["security-analytics", "soc-platform"].forEach(c => { if (V.TECH_LANDSCAPE[c]) V.TECH_LANDSCAPE[c].presence = "NONE"; });
    V.ARCHITECTURE_CONTEXT.saasAllowed = "yes";
    V.ARCHITECTURE_CONTEXT.unifiedPlatformPreference = "unified";
  }
  w.__DEV.setPriorities(o.prios || PRIOS);
  w.__DEV.showResults();
}
function cur(w) {
  const b = w.__CURATION;
  if (!b) vac("pré-condição", "bridge `__CURATION` não existe");
  return b;
}
const nomeDe = (w, id) => { const p = w.eval("PRODUCTS")[id]; return (p && p.n) || id; };

/* ---------- oráculos de tela e papel ---------- */
const cardsTela = d => qa(d, "#p52-workspace #p52-sec-support > .apoio-block[data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto"));
const aviso = d => { const a = d.querySelector("#p52-sec-support [data-p53-suprimido]"); return a ? a.getAttribute("data-p53-suprimido") : null; };
function mapaCheckboxes(d) {
  const m = {};
  qa(d, "[data-p53-cur-item]").forEach(l => { const c = l.querySelector(".p53-cur-check"); m[l.getAttribute("data-p53-cur-item")] = c ? c.checked : null; });
  const a = d.querySelector("[data-p53-cur-arquitetura] .p53-cur-check");
  if (a) m["@arquitetura"] = a.checked;
  return m;
}
/* o painel guarda `aberto` entre renders: clicar de novo FECHA — por isso o
   helper lê `aria-expanded` antes de clicar (medido no protótipo P0) */
function abrirPainel(d) {
  const btn = d.querySelector("[data-p53-abrir-curadoria]");
  if (!btn) vac("painel", "controle de curadoria ausente — o gate de suficiência está fechado ou a decoração não rodou");
  if (btn.getAttribute("aria-expanded") !== "true") btn.click();
  if (!d.querySelector("[data-p53-cur-panel]")) throw new Error("o controle não abriu o painel de curadoria");
}
function checkboxDe(d, nome) {
  const l = d.querySelector('[data-p53-cur-item="' + nome.replace(/"/g, '\\"') + '"]');
  const c = l && l.querySelector(".p53-cur-check");
  if (!c) vac("checkbox", "item `" + nome + "` ausente do painel");
  return c;
}
function toggle(w, cx) { cx.checked = !cx.checked; cx.dispatchEvent(new w.Event("change")); }
/* papel: evento real `beforeprint`; corpo sem a capa (datas); `finishPrint` em seguida */
function papel(w, d) {
  w.dispatchEvent(new w.Event("beforeprint"));
  const rep = d.querySelector("#v32-print-report");
  const box = d.createElement("div"); box.innerHTML = rep ? rep.innerHTML : "";
  const capa = box.querySelector("#pr-cover"); if (capa) capa.remove();
  const out = { texto: txt(box), prov: qa(box, '[data-p53-prov="operador"]').length,
    produtos: qa(box, "[data-p53-sol-produto]").map(n => n.getAttribute("data-p53-sol-produto")),
    bloqueado: /v32-print-blocked/.test(String(d.body.className)) };
  w.__DEV.finishPrint();
  if (!out.texto.length) vac("papel", "o relatório ficou vazio após beforeprint");
  return out;
}
function assinatura(w, d) {
  const b = cur(w);
  return JSON.stringify({ state: b.state(), contract: b.contract(), inputs: w.__DEV.captureCanonicalInputs(),
    cks: mapaCheckboxes(d), aviso: aviso(d), papel: papel(w, d).texto });
}
const estadoVazio = b => Object.keys(b.state().decisions).length === 0 && b.state().architectureNote === undefined && b.toSession() === undefined;

/* ---------- contador de chamadas ao bridge: embrulho de PROPRIEDADE lida na chamada ---------- */
const ESCRITAS = ["fromSession", "set", "clear", "unset", "setArchitectureNote", "unsetArchitectureNote"];
function instrumentar(w) {
  const b = cur(w), orig = {}, log = [];
  ESCRITAS.concat(["toSession"]).forEach(m => {
    if (typeof b[m] !== "function") return;
    orig[m] = b[m];
    b[m] = function () { log.push(m); return orig[m].apply(this, arguments); };
  });
  return {
    log,
    escritas: () => log.filter(m => ESCRITAS.indexOf(m) >= 0),
    zerar: () => { log.length = 0; },
    restaurar: () => { Object.keys(orig).forEach(m => { b[m] = orig[m]; }); }
  };
}
/* falha sintética "aplica e lança UMA vez" (padrão S62+S68; protótipo P2): chama o
   original, restaura a propriedade, lança. Devolve o contador. */
function falhaSinteticaFromSession(w) {
  const b = cur(w), original = b.fromSession; let n = 0;
  b.fromSession = function () { n++; original.apply(this, arguments); b.fromSession = original; throw new Error("falha sintética D025-TRX2"); };
  return { vezes: () => n, desarmar: () => { if (b.fromSession !== original) b.fromSession = original; } };
}

/* ---------- curadorias e documentos de referência (construídos na própria suíte — R11) ---------- */
const REF = {};   /* ids: off0 (exclude em A), off1 (exclude em B), semL (include sem lastro em A) */
const F = {};     /* documentos F-* */
let ORIGEM_A = null;
function aplicarA(w) { const b = cur(w); b.clear(); b.set(REF.off0, "exclude"); b.set(REF.semL, "include"); b.setArchitectureNote("exclude"); }
function aplicarB(w) { const b = cur(w); b.clear(); b.set(REF.off1, "exclude"); }
const CUR_A = () => ({ decisions: { [REF.off0]: "exclude", [REF.semL]: "include" }, architectureNote: "exclude" });
const CUR_B = () => ({ decisions: { [REF.off1]: "exclude" } });
function fixtures() {
  const O = boot(); const b = cur(O.w);
  const off = b.offered(), cat = b.catalog();
  if (off.length < 9) vac("fixtures", "menos de nove produtos ofertados na sessão de referência (medido: " + off.length + ")");
  const semL = cat.filter(id => off.indexOf(id) < 0)[0];
  if (!semL) vac("fixtures", "todo o catálogo foi ofertado — não há inclusão sem lastro possível");
  REF.off0 = off[0]; REF.off1 = off[1]; REF.semL = semL;
  REF.nomeOff0 = nomeDe(O.w, off[0]); REF.nomeOff1 = nomeDe(O.w, off[1]); REF.nomeSemL = nomeDe(O.w, semL);
  aplicarA(O.w); O.w.__DEV.showResults();
  F.A = clone(O.w.__DEV.buildSessionDocument("A"));
  ORIGEM_A = { inputs: JSON.stringify(O.w.__DEV.captureCanonicalInputs()), contract: b.contract(), published: b.published(), papel: papel(O.w, O.d) };
  if (!F.A.inputs.reportCuration) vac("fixtures", "F-A não carregou reportCuration");
  const P = boot(); aplicarB(P.w); P.w.__DEV.showResults();
  F.B = clone(P.w.__DEV.buildSessionDocument("B"));
  F["0"] = clone(F.A); delete F["0"].inputs.reportCuration;
  const der = rc => { const f = clone(F.A); f.inputs.reportCuration = rc; return f; };
  F.null = der(null); F.vazio = der({}); F.decVazio = der({ decisions: {} });
  F.decVazioArch = der({ decisions: {}, architectureNote: "exclude" }); F.arch = der({ architectureNote: "exclude" });
  F.invId = der({ decisions: Object.assign({}, F.A.inputs.reportCuration.decisions, { ProdutoQueNaoExiste: "exclude" }) });
  F.invEnum = der({ decisions: Object.assign({}, F.A.inputs.reportCuration.decisions, { [REF.off0]: "talvez" }) });
  F.invTipo = der({ decisions: ["x"] });
  F.extra = clone(F.A); F.extra.inputs.reportCuration.observacao = "x";
  F.tardio = clone(F.A); F.tardio.inputs.operationalRefinement.answers["ref-hunting"] = 99;
  F.tardio0 = clone(F["0"]); F.tardio0.inputs.operationalRefinement.answers["ref-hunting"] = 99;
  F.engine = clone(F.A); F.engine.engineSha256 = (F.engine.engineSha256[0] === "0" ? "1" : "0") + F.engine.engineSha256.slice(1);
}
const COMPAT = { compatible: true, notice: null };
/* caminho REAL do seletor (protótipo P1: `File.text()` nativo do jsdom 30 chega ao
   modal em 1 tick): clica `#ses-import`, entrega um File sintético ao input real
   e despacha `change`; aguarda o onchange assíncrono */
async function selecionarArquivo(w, d, doc) {
  const btn = d.querySelector("#ses-import");
  if (!btn) vac("seletor", "`#ses-import` ausente — a tela de resultados não expôs o controle");
  btn.click();
  const input = d.querySelector('input[type=file][aria-label="Selecionar arquivo de sessão"]');
  if (!input) vac("seletor", "input de arquivo ausente após o clique em #ses-import");
  const file = new w.File([JSON.stringify(doc)], "sessao.json", { type: "application/json" });
  Object.defineProperty(input, "files", { value: [file] });
  input.dispatchEvent(new w.Event("change"));
  let modal = null;
  for (let i = 0; i < 6 && !modal; i++) { await Promise.resolve(); modal = d.querySelector("#ux-modal"); }
  if (!modal) { await new Promise(r => setTimeout(r, 0)); modal = d.querySelector("#ux-modal"); }
  if (!modal) throw new Error("o onchange real não abriu modal algum");
  return modal;
}
const escape = d => d.dispatchEvent(new d.defaultView.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

/* ====================== C1 · validar não aplica — nos três chamadores ====================== */
T("D025-VAL1", "validar não aplica: selecionar, prévia, cancelar, Escape e exportar deixam o owner intocado (0 escritas)", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w); aplicarB(w); w.__DEV.showResults();
  const pre = assinatura(w, d);
  const I = instrumentar(w);
  await A("a", () => {
    I.zerar();
    const r = w.__DEV.validateSessionDocument(F.A);
    must(r.ok === true, "validateSessionDocument(F-A) recusou: " + r.error);
    must(I.escritas().length === 0, "validar escreveu no bridge: " + JSON.stringify(I.escritas()));
    must(deepEq(b.state(), CUR_B()), "state() mudou ao validar: " + JSON.stringify(b.state()));
  });
  await A("b", async () => {
    aplicarB(w); I.zerar();
    let modal = await selecionarArquivo(w, d, F.A);
    must(txt(modal.querySelector("#ux-modal-t")) === "Importar sessão", "o seletor não chegou à prévia: " + txt(modal.querySelector("#ux-modal-t")));
    must(I.escritas().length === 0, "selecionar o arquivo escreveu no bridge: " + JSON.stringify(I.escritas()));
    d.querySelector("#ux-modal-cancel").click();
    must(!d.querySelector("#ux-modal"), "Cancelar não fechou a prévia");
    must(I.escritas().length === 0, "cancelar deixou escrita no bridge: " + JSON.stringify(I.escritas()));
    I.restaurar(); must(assinatura(w, d) === pre, "assinatura mudou após selecionar+cancelar");
    const J = instrumentar(w); modal = await selecionarArquivo(w, d, F.A);
    escape(d);
    must(!d.querySelector("#ux-modal"), "Escape não fechou a prévia");
    must(J.escritas().length === 0, "selecionar+Escape escreveu no bridge: " + JSON.stringify(J.escritas()));
    J.restaurar(); must(assinatura(w, d) === pre, "assinatura mudou após selecionar+Escape");
  });
  I.restaurar();
  await A("c", () => {
    const X = boot(); const bx = cur(X.w); aplicarA(X.w); X.w.__DEV.showResults();
    const antes = JSON.stringify(bx.state());
    const K = instrumentar(X.w);
    const r = X.w.__DEV.prepareSessionExport("x");
    must(r.ok === true, "prepareSessionExport recusou: " + r.error);
    must(K.escritas().length === 0, "exportar escreveu no bridge (EA-105): " + JSON.stringify(K.escritas()));
    must(JSON.stringify(bx.state()) === antes, "state() mudou ao exportar");
    K.restaurar();
  });
  await A("d", () => {
    aplicarB(w); const L = instrumentar(w);
    const r = w.__DEV.importSessionDocument(F.A);
    L.restaurar();
    must(r.ok === true, "controle negativo: importSessionDocument(F-A) recusou: " + r.error);
    must(L.escritas().length >= 1, "controle negativo: o import confirmado não produziu escrita visível ao contador — o contador não enxerga");
  });
}));

/* ====================== C2 · o bridge valida sem tocar o estado ====================== */
T("D025-VAL2", "o bridge valida sem tocar o estado; fromSession inválido não apaga a seleção; import inválido é byte-neutro", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w); aplicarB(w); w.__DEV.showResults();
  const casos = [["F-inv-id", F.invId, "decisions: id fora do catálogo: "], ["F-inv-enum", F.invEnum, "valor fora do enum fechado"], ["F-inv-tipo", F.invTipo, "decisions não é objeto"]];
  const validados = {};
  await A("a", () => {
    must(typeof b.validate === "function", "`validate` não existe no bridge");
    casos.forEach(([nome, doc, msg]) => {
      aplicarB(w); const antes = JSON.stringify(b.state());
      const erros = b.validate(doc.inputs.reportCuration); validados[nome] = erros;
      must(Array.isArray(erros) && erros.length, nome + ": validate devolveu lista vazia");
      must(erros.some(e => e.indexOf(msg) >= 0), nome + ": nenhuma mensagem nomeia o campo (`" + msg + "`): " + JSON.stringify(erros));
      must(JSON.stringify(b.state()) === antes, nome + ": validate tocou o estado");
    });
  });
  const acumula = fn => { const probs = []; casos.forEach(c => { try { fn.apply(null, c); } catch (e) { probs.push(e.message); } }); if (probs.length) throw new Error(probs.join("; ")); };
  await A("b", () => acumula((nome, doc, msg) => {
    aplicarB(w); const antes = JSON.stringify(b.state());
    const erros = b.fromSession(doc.inputs.reportCuration);
    must(Array.isArray(erros) && erros.length && erros.some(e => e.indexOf(msg) >= 0), nome + ": fromSession não recusou nomeando o campo: " + JSON.stringify(erros));
    if (validados[nome]) must(JSON.stringify(erros) === JSON.stringify(validados[nome]), nome + ": fromSession e validate divergem: " + JSON.stringify(erros) + " ≠ " + JSON.stringify(validados[nome]));
    must(JSON.stringify(b.state()) === antes, nome + ": fromSession inválido APAGOU a seleção (state: " + JSON.stringify(b.state()) + ")");
  }));
  await A("c", () => acumula((nome, doc) => {
    aplicarB(w); w.__DEV.showResults(); const pre = assinatura(w, d);
    const r = w.__DEV.importSessionDocument(doc);
    must(r.ok === false, nome + ": import inválido foi aceito");
    must(typeof r.error === "string" && r.error.indexOf("Curadoria inválida: ") === 0, nome + ": erro não começa por `Curadoria inválida: `: " + r.error);
    must(assinatura(w, d) === pre, nome + ": a janela não ficou byte-igual após a recusa (state: " + JSON.stringify(b.state()) + ")");
  }));
  await A("d", () => {
    aplicarB(w); const antes = JSON.stringify(b.state());
    must(typeof b.validate === "function", "`validate` não existe no bridge");
    const erros = b.validate(F.A.inputs.reportCuration);
    must(Array.isArray(erros) && erros.length === 0, "validate(F-A) recusou curadoria válida: " + JSON.stringify(erros));
    must(JSON.stringify(b.state()) === antes, "validar curadoria VÁLIDA aplicou-a");
  });
}));

/* ====================== C3 · forma canônica de "sem curadoria" é a ausência da chave ====================== */
T("D025-CAN1", "null/{}/{decisions:{}}/decisions vazio recusados com mensagem; chave desconhecida recusada nomeando-a; {architectureNote} só é válido; ausência segue legítima", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w);
  const formas = [["F-null", F.null], ["F-vazio", F.vazio], ["F-dec-vazio", F.decVazio], ["F-dec-vazio-arch", F.decVazioArch]];
  /* cada forma acumula os seus sintomas (validate, import, permanência de A) em vez de parar no primeiro */
  const forma = (nome, doc, checaValidate) => {
    aplicarA(w); w.__DEV.showResults(); const pre = assinatura(w, d); const probs = [];
    if (typeof b.validate !== "function") probs.push("`validate` não existe no bridge");
    else { const erros = b.validate(doc.inputs.reportCuration); const p = checaValidate(erros); if (p) probs.push(p); }
    const r = w.__DEV.importSessionDocument(doc);
    if (r.ok !== false) probs.push("import aceitou a forma (ok:true)");
    else if (nome !== "F-extra" && !/ausência da chave|ausência do campo/.test(r.error || "")) probs.push("a recusa não diz como representar a ausência: " + r.error);
    if (assinatura(w, d) !== pre) probs.push("curadoria A não permaneceu (state: " + JSON.stringify(b.state()) + ")");
    if (probs.length) throw new Error(probs.join("; "));
  };
  for (const [nome, doc] of formas) {
    await A(nome, () => forma(nome, doc, erros => (Array.isArray(erros) && erros.length) ? null : "validate aceitou a forma não canônica"));
  }
  await A("F-extra", () => forma("F-extra", F.extra, erros => {
    if (!(Array.isArray(erros) && erros.length)) return "validate ignorou a chave desconhecida `observacao`";
    if (!erros.some(e => /não reconhecid/.test(e) && e.indexOf("observacao") >= 0)) return "a mensagem não nomeia a chave desconhecida: " + JSON.stringify(erros);
    return null;
  }));
  await A("F-arch", () => {
    aplicarA(w);
    const r = w.__DEV.importSessionDocument(F.arch);
    must(r.ok === true, "{architectureNote:'exclude'} sozinho foi recusado: " + r.error);
    must(b.state().architectureNote === "exclude", "architectureNote não aplicada: " + JSON.stringify(b.state()));
    must(Object.keys(b.state().decisions).length === 0, "decisions não vazio após F-arch: " + JSON.stringify(b.state().decisions));
    must(deepEq(b.published(), b.offered()), "published ≠ offered após F-arch");
  });
  await A("controle F-0", () => {
    const r = w.__DEV.importSessionDocument(F["0"]);
    must(r.ok === true, "ausência da chave deixou de ser legítima: " + r.error);
  });
}));

/* ====================== C4 · a curadoria entra no candidato e no commit — inclusive a ausência ====================== */
T("D025-TRX1", "normalização leva `curadoria` ao candidato (presente mesmo quando undefined) sem tocar o estado; o commit a escreve", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w); aplicarB(w); w.__DEV.showResults();
  let candA = null, cand0 = null;
  await A("a", () => {
    const pre = assinatura(w, d);
    candA = w.__DEV.normalizeSessionDocument(F.A);
    must(Object.prototype.hasOwnProperty.call(candA, "curadoria"), "candidato sem a chave `curadoria`: " + Object.keys(candA).sort().join(","));
    must(deepEq(candA.curadoria, F.A.inputs.reportCuration), "cand.curadoria ≠ reportCuration do documento: " + JSON.stringify(candA.curadoria));
    must(assinatura(w, d) === pre, "normalizar tocou o estado (padrão S50)");
  });
  await A("b", () => {
    cand0 = w.__DEV.normalizeSessionDocument(F["0"]);
    must(Object.prototype.hasOwnProperty.call(cand0, "curadoria"), "candidato de F-0 sem a chave `curadoria` (a ausência também é candidato)");
    must(cand0.curadoria === undefined, "cand.curadoria de F-0 deveria ser undefined: " + JSON.stringify(cand0.curadoria));
  });
  await A("c", () => {
    aplicarB(w);
    const r = w.__DEV.commitCanonicalOwners(candA || w.__DEV.normalizeSessionDocument(F.A));
    must(r && r.ok === true, "commit do candidato de F-A falhou: " + JSON.stringify(r));
    must(deepEq(b.state(), CUR_A()), "após o commit o estado não é A: " + JSON.stringify(b.state()));
  });
  await A("d", () => {
    aplicarA(w);
    const r = w.__DEV.commitCanonicalOwners(cand0 || w.__DEV.normalizeSessionDocument(F["0"]));
    must(r && r.ok === true, "commit do candidato de F-0 falhou: " + JSON.stringify(r));
    must(estadoVazio(b), "commit de F-0 não limpou a curadoria: " + JSON.stringify(b.state()) + " toSession=" + JSON.stringify(b.toSession()));
  });
}));

/* ====================== C5 · snapshot antes de qualquer escrita; falha no commit devolve a SESSÃO ====================== */
T("D025-TRX2", "snapshot antes da primeira escrita; falha após a curadoria (B e 'nada declarado') e antes dela devolvem a sessão; sem patch o mesmo documento importa", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w); aplicarB(w); w.__DEV.showResults();
  const pre = assinatura(w, d);
  await A("a", () => {
    const I = instrumentar(w), probs = [];
    try {
      I.zerar(); w.__DEV.validateSessionDocument(F.A); w.__DEV.normalizeSessionDocument(F.A);
      if (I.escritas().length) probs.push("validar+normalizar escreveram no bridge: " + JSON.stringify(I.escritas()) + " (caso 13)");
      aplicarB(w); I.zerar();
      const r = w.__DEV.importSessionDocument(F.A);
      must(r.ok === true, "importSessionDocument(F-A) recusou: " + r.error);
      const log = I.log.slice();
      const iEscrita = log.findIndex(m => ESCRITAS.indexOf(m) >= 0), iLeitura = log.indexOf("toSession");
      if (iEscrita < 0) probs.push("nenhuma escrita durante o import — o contador não viu o commit");
      else if (!(iLeitura >= 0 && iLeitura < iEscrita)) probs.push("a primeira escrita (" + log[iEscrita] + ") ocorreu sem leitura `toSession` (snapshot) antes dela: " + JSON.stringify(log.slice(0, iEscrita + 1)));
    } finally { I.restaurar(); }
    if (probs.length) throw new Error(probs.join("; "));
  });
  await A("b", () => {
    aplicarB(w); w.__DEV.showResults(); const preB = assinatura(w, d);
    const cand = w.__DEV.normalizeSessionDocument(F.A);
    const S = falhaSinteticaFromSession(w); let r;
    try { r = w.__DEV.commitCanonicalOwners(cand); } finally { S.desarmar(); }
    must(S.vezes() === 1, "a falha sintética disparou " + S.vezes() + " vez(es) — o commit não chamou fromSession pela propriedade (esperado 1)");
    must(r && r.ok === false && r.rolledBack === true, "commit com falha após a curadoria não devolveu {ok:false, rolledBack:true}: " + JSON.stringify(r));
    must(deepEq(b.state(), CUR_B()), "rollback não devolveu a SESSÃO (B): " + JSON.stringify(b.state()));
    must(assinatura(w, d) === preB, "assinatura ≠ pré após o rollback");
  });
  await A("b′", () => {
    const Z = boot(); const bz = cur(Z.w);
    must(bz.toSession() === undefined, "a janela 'nada declarado' nasceu com curadoria");
    const cand = Z.w.__DEV.normalizeSessionDocument(F.A);
    const S = falhaSinteticaFromSession(Z.w); let r;
    try { r = Z.w.__DEV.commitCanonicalOwners(cand); } finally { S.desarmar(); }
    must(S.vezes() === 1, "a falha sintética disparou " + S.vezes() + " vez(es) (esperado 1)");
    must(r && r.ok === false && r.rolledBack === true, "sem {ok:false, rolledBack:true}: " + JSON.stringify(r));
    must(bz.toSession() === undefined && Object.keys(bz.state().decisions).length === 0, "rollback em 'nada declarado' deixou a curadoria do ARQUIVO: " + JSON.stringify(bz.state()));
  });
  await A("c", () => {
    aplicarB(w); w.__DEV.showResults(); const preC = assinatura(w, d);
    const cand = w.__DEV.normalizeSessionDocument(F.A);
    const SetProto = w.eval("Set.prototype"), origClear = SetProto.clear; let vezes = 0;
    SetProto.clear = function () { vezes++; SetProto.clear = origClear; throw new Error("falha controlada antes da curadoria (S62+S68)"); };
    let r; try { r = w.__DEV.commitCanonicalOwners(cand); } finally { SetProto.clear = origClear; }
    must(vezes === 1, "a falha em Set.prototype.clear não disparou");
    must(r && r.ok === false && r.rolledBack === true, "sem {ok:false, rolledBack:true}: " + JSON.stringify(r));
    must(deepEq(b.state(), CUR_B()), "estado ≠ B após falha anterior à curadoria: " + JSON.stringify(b.state()));
    must(assinatura(w, d) === preC, "assinatura ≠ pré após o rollback (falha antes da curadoria)");
  });
  await A("d", () => {
    const r = w.__DEV.importSessionDocument(F.A);
    must(r.ok === true, "sem patch, F-A foi recusado: " + r.error);
    must(deepEq(b.state(), CUR_A()), "sem patch o estado não é A — o patch contaminou a janela: " + JSON.stringify(b.state()));
  });
  void pre;
}));

/* ====================== C6 · ausência substitui ====================== */
T("D025-AUS1", "o mesmo arquivo sem a chave produz, sobre quatro estados prévios, o estado de um DOM virgem — tela, papel e export", () => alineas(async A => {
  const prep = [["virgem", () => {}], ["exclude em ofertado", w => cur(w).set(REF.off0, "exclude")],
    ["include sem lastro", w => cur(w).set(REF.semL, "include")], ["architectureNote exclude", w => cur(w).setArchitectureNote("exclude")]];
  const med = [];
  for (const [nome, f] of prep) {
    const { w, d } = boot(); const b = cur(w); f(w); w.__DEV.showResults();
    const r = w.__DEV.importSessionDocument(F["0"]);
    must(r.ok === true, nome + ": F-0 recusado: " + r.error);
    med.push({ nome, vazio: estadoVazio(b), state: b.state(), pubOk: deepEq(b.published(), b.offered()), aviso: aviso(d),
      cards: cardsTela(d), papel: papel(w, d).texto, inputs: w.__DEV.captureCanonicalInputs() });
  }
  await A("a", () => { const ruins = med.filter(m => !m.vazio); must(!ruins.length, "curadoria herdada após F-0 em: " + ruins.map(m => m.nome + "=" + JSON.stringify(m.state)).join("; ")); });
  await A("b", () => { const ruins = med.filter(m => !m.pubOk || m.aviso !== null); must(!ruins.length, "published≠offered ou aviso de supressão presente em: " + ruins.map(m => m.nome + " (aviso=" + m.aviso + ")").join("; ")); });
  await A("c", () => {
    if (med[0].cards.length < 9) vac("(c)", "a janela virgem publicou " + med[0].cards.length + " cards (< 9) — sem sujeito");
    const ref = JSON.stringify(med[0].cards);
    const ruins = med.filter(m => JSON.stringify(m.cards) !== ref);
    must(!ruins.length, "cards da tela divergem da janela virgem em: " + ruins.map(m => m.nome + "=" + m.cards.length + " cards").join("; "));
  });
  await A("d", () => { const ruins = med.filter(m => m.papel !== med[0].papel); must(!ruins.length, "corpo do papel diverge da janela virgem em: " + ruins.map(m => m.nome).join("; ")); });
  await A("e", () => {
    const com = med.filter(m => "reportCuration" in m.inputs); must(!com.length, "inputs canônicos carregam reportCuration em: " + com.map(m => m.nome).join("; "));
    const ref = JSON.stringify(med[0].inputs); const ruins = med.filter(m => JSON.stringify(m.inputs) !== ref);
    must(!ruins.length, "inputs canônicos divergem da janela virgem em: " + ruins.map(m => m.nome).join("; "));
  });
}));

/* ====================== C7 · roundtrip de identidade: substituição, nunca merge ====================== */
T("D025-INV8", "roundtrip em DOM novo é idêntico (inclusive include sem lastro sinalizado e rotulado); janela suja vira A sem resto de B; idempotente; exemplo publicado declara reportCuration", () => alineas(async A => {
  await A("a", () => {
    const { w, d } = boot(); const b = cur(w);
    const r = w.__DEV.importSessionDocument(F.A); must(r.ok === true, "F-A recusado em DOM novo: " + r.error);
    must(JSON.stringify(w.__DEV.captureCanonicalInputs()) === ORIGEM_A.inputs, "inputs canônicos ≠ janela de origem");
    must(deepEq(b.contract(), ORIGEM_A.contract), "contract() ≠ origem");
    must(deepEq(b.published(), ORIGEM_A.published), "published() ≠ origem");
    const pp = papel(w, d);
    must(pp.texto === ORIGEM_A.papel.texto, "papel ≠ origem");
    must(pp.prov >= 1 && pp.produtos.indexOf(REF.nomeSemL) >= 0, "a inclusão sem lastro não aparece rotulada no papel ([data-p53-prov=operador]=" + pp.prov + ")");
    abrirPainel(d);
    must(!!d.querySelector("[data-p53-cur-sem-lastro]"), "a inclusão sem lastro não está sinalizada no editor");
  });
  await A("b", () => {
    const { w } = boot(); const b = cur(w); aplicarB(w); w.__DEV.showResults();
    const r = w.__DEV.importSessionDocument(F.A); must(r.ok === true, "F-A recusado sobre B: " + r.error);
    must(deepEq(b.state(), CUR_A()), "estado ≠ A após importar sobre B: " + JSON.stringify(b.state()));
    must(!(REF.off1 in b.state().decisions), "chave de B sobreviveu à importação de A (merge): " + JSON.stringify(b.state().decisions));
  });
  await A("c", () => {
    const { w, d } = boot();
    must(w.__DEV.importSessionDocument(F.A).ok === true, "1ª importação recusada");
    const s1 = assinatura(w, d);
    must(w.__DEV.importSessionDocument(F.A).ok === true, "2ª importação recusada");
    must(assinatura(w, d) === s1, "a segunda importação do mesmo documento não foi no-op observável");
  });
  await A("d", () => {
    const p = path.join(HERE, "synthetic_session_examples", "exemplo-completo.json");
    const ex = JSON.parse(fs.readFileSync(p, "utf8"));
    must(ex.inputs && ex.inputs.reportCuration !== undefined, "exemplo-completo.json não declara reportCuration");
    const { w } = boot(); const b = cur(w);
    const r = w.__DEV.importSessionDocument(ex); must(r.ok === true, "exemplo-completo.json recusado: " + r.error);
    must(deepEq(b.state(), { decisions: ex.inputs.reportCuration.decisions || {}, architectureNote: ex.inputs.reportCuration.architectureNote }), "estado ≠ curadoria declarada no exemplo: " + JSON.stringify(b.state()));
  });
}));

/* ====================== C8 · sem efeito ====================== */
T("D025-NOP1", "cancelar, Escape, erro posterior ao bloco, engine incompatível e curadoria inválida deixam a janela byte-igual (também com o `bad` de outra janela e sem a chave)", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w);
  const armar = () => { aplicarB(w); w.__DEV.showResults(); abrirPainel(d); return assinatura(w, d); };
  await A("F-tardio", () => {
    const pre = armar(); const r = w.__DEV.importSessionDocument(F.tardio);
    must(r.ok === false && /aprofundamento/i.test(r.error || ""), "F-tardio deveria falhar no aprofundamento: " + JSON.stringify(r));
    must(assinatura(w, d) === pre, "janela mudou após erro posterior ao bloco da curadoria (state: " + JSON.stringify(b.state()) + ")");
  });
  await A("F-engine", async () => {
    const pre = armar(); const r = w.__DEV.importSessionDocument(F.engine);
    must(r.ok === false && r.compat && r.compat.compatible === false, "F-engine não foi bloqueado por compatibilidade: " + JSON.stringify(r));
    must(assinatura(w, d) === pre, "janela mudou após engine incompatível (import direto; state: " + JSON.stringify(b.state()) + ")");
    const pre2 = armar(); const modal = await selecionarArquivo(w, d, F.engine);
    must(txt(modal.querySelector("#ux-modal-t")) === "Importação bloqueada", "o seletor não mostrou `Importação bloqueada`: " + txt(modal.querySelector("#ux-modal-t")));
    d.querySelector("#ux-modal-ok").click();
    must(assinatura(w, d) === pre2, "janela mudou após engine incompatível pelo seletor (state: " + JSON.stringify(b.state()) + ")");
  });
  await A("F-inv-id", () => {
    const pre = armar(); const r = w.__DEV.importSessionDocument(F.invId);
    must(r.ok === false, "F-inv-id aceito");
    must(assinatura(w, d) === pre, "janela mudou após curadoria inválida (state: " + JSON.stringify(b.state()) + ")");
  });
  await A("cancelar", async () => {
    const pre = armar(); const modal = await selecionarArquivo(w, d, F.A);
    must(txt(modal.querySelector("#ux-modal-t")) === "Importar sessão", "prévia não abriu");
    d.querySelector("#ux-modal-cancel").click();
    must(assinatura(w, d) === pre, "janela mudou após cancelar a prévia (state: " + JSON.stringify(b.state()) + ")");
  });
  await A("Escape", async () => {
    const pre = armar(); await selecionarArquivo(w, d, F.A); escape(d);
    must(!d.querySelector("#ux-modal"), "Escape não fechou a prévia");
    must(assinatura(w, d) === pre, "janela mudou após Escape na prévia (state: " + JSON.stringify(b.state()) + ")");
  });
  await A("b", () => {
    const pre = armar(); const r = w.__DEV.importSessionDocument(F.tardio0);
    must(r.ok === false, "F-tardio sem a chave aceito");
    must(assinatura(w, d) === pre, "janela mudou após erro tardio em documento SEM curadoria");
  });
}));

/* ====================== C9 · Nova sessão limpa a curadoria; cancelar preserva ====================== */
T("D025-NEW1", "Nova sessão (diálogo e rota direta) limpa a curadoria e a avaliação seguinte publica a oferta; Cancelar/Escape preservam; o texto do diálogo não muda", () => alineas(async A => {
  const { w, d } = boot(); const b = cur(w);
  const comA = () => { sessao(w); aplicarA(w); w.__DEV.showResults(); };
  const limpa = rota => {
    must(estadoVazio(b), rota + ": curadoria sobreviveu: " + JSON.stringify(b.state()) + " toSession=" + JSON.stringify(b.toSession()));
    must(!("reportCuration" in w.__DEV.captureCanonicalInputs()), rota + ": inputs ainda carregam reportCuration");
    sessao(w);
    must(deepEq(b.published(), b.offered()), rota + ": a avaliação seguinte não publica a oferta inteira");
    must(aviso(d) === null, rota + ": aviso de supressão herdado na avaliação seguinte");
  };
  await A("a", () => { aplicarA(w); w.__DEV.showResults(); d.querySelector("#ux-newsession").click(); d.querySelector("#ux-modal-ok").click(); limpa("diálogo"); });
  await A("b", () => { comA(); must(typeof w.uxNewSession === "function", "uxNewSession não é alcançável"); w.uxNewSession({ silent: true }); limpa("rota direta"); });
  await A("c", () => {
    comA(); d.querySelector("#ux-newsession").click(); d.querySelector("#ux-modal-cancel").click();
    must(!d.querySelector("#ux-modal") && deepEq(b.state(), CUR_A()), "Cancelar alterou a curadoria: " + JSON.stringify(b.state()));
    d.querySelector("#ux-newsession").click(); escape(d);
    must(!d.querySelector("#ux-modal") && deepEq(b.state(), CUR_A()), "Escape alterou a curadoria: " + JSON.stringify(b.state()));
  });
  await A("d", () => {
    d.querySelector("#ux-newsession").click();
    must(txt(d.querySelector("#ux-modal")).indexOf("Nova sessão remove também todo o contexto tecnológico declarado.") >= 0, "texto do diálogo de Nova sessão mudou: " + txt(d.querySelector("#ux-modal")));
    d.querySelector("#ux-modal-cancel").click();
  });
}));

/* ====================== C10 · Reiniciar avaliação limpa a curadoria e o diálogo a nomeia ====================== */
const TEXTO_REINICIAR = "Respostas, observações, prioridades e a curadoria do relatório serão limpas. O contexto tecnológico declarado será preservado.";
T("D025-RST1", "Reiniciar limpa a curadoria e preserva o contexto; o diálogo diz exatamente o texto novo; Cancelar/Escape preservam", () => alineas(async A => {
  const { w, d } = boot({ contexto: true }); const b = cur(w);
  const comA = () => { sessao(w, { contexto: true }); w.__DEV.setTarget("logs", 3); w.__DEV.setRefinementAnswer("ref-metrics", 1); aplicarA(w); w.__DEV.showResults(); };
  comA();
  must(w.__DEV.V32.isLegacyModeV32() === false, "VÁCUO: a fixture não declarou contexto");
  d.querySelector("#restart").click();
  await A("b", () => {
    const p = d.querySelector("#ux-modal p");
    must(p && txt(p) === TEXTO_REINICIAR, "texto do diálogo de Reiniciar: " + JSON.stringify(txt(p)));
  });
  await A("a", () => {
    d.querySelector("#ux-modal-ok").click();
    must(estadoVazio(b), "Reiniciar não limpou a curadoria: " + JSON.stringify(b.state()));
    must(w.__DEV.V32.isLegacyModeV32() === false, "Reiniciar apagou o contexto tecnológico (deveria preservar)");
    must(Object.keys(w.__DEV.TARGET.overrides).length === 0, "cenário-alvo não foi limpo");
    must(w.__DEV.getOperationalRefinementSnapshot().every(r => r.answer === null), "aprofundamento não foi limpo");
  });
  await A("c", () => {
    comA(); d.querySelector("#restart").click(); d.querySelector("#ux-modal-cancel").click();
    must(!d.querySelector("#ux-modal") && deepEq(b.state(), CUR_A()), "Cancelar alterou a curadoria");
    d.querySelector("#restart").click(); escape(d);
    must(!d.querySelector("#ux-modal") && deepEq(b.state(), CUR_A()), "Escape alterou a curadoria");
  });
}));

/* ====================== C11 · prioLimitHit é transiente e o commit o zera ====================== */
T("D025-TRN1", "prioLimitHit produzido pela UI é zerado pelo commit da importação; a tela de prioridades não exibe o aviso de limite", () => alineas(async A => {
  const { w, d } = boot();
  w.eval("step=PRIORITY_STEP;render();");
  const livre = qa(d, ".opt").filter(o => o.getAttribute("aria-pressed") !== "true")[0];
  if (!livre) vac("fixture", "nenhuma quarta prioridade disponível para tentar");
  livre.click();
  if (w.eval("prioLimitHit") !== true || !d.querySelector(".limitmsg")) vac("fixture", "a quarta tentativa não produziu prioLimitHit=true com o aviso na tela");
  const doc = clone(F["0"]); doc.inputs.priorities = [];
  const r = w.__DEV.importSessionDocument(doc);
  must(r.ok === true, "F-0 com priorities:[] recusado: " + r.error);
  await A("a", () => must(w.eval("prioLimitHit") === false, "prioLimitHit continua true após o commit (EA-108)"));
  await A("b", () => {
    w.eval("step=PRIORITY_STEP;render();");
    must(txt(d.querySelector("#app")).indexOf("Limite de 3 prioridades atingido") < 0, "a tela de prioridades exibe `Limite de 3 prioridades atingido` sobre 0 selecionadas");
  });
}));

/* ====================== C12 · o draft do editor de contexto é descartado por commit, Nova sessão e Reiniciar ====================== */
T("D025-TRN2", "draft descartado por import confirmado, Nova sessão e Reiniciar; mantido em recusa e em prévia cancelada; discardDraft existe", () => alineas(async A => {
  const { w, d } = boot(); const UI = w.__V32UI;
  const temDraft = () => { let had = false; w.__DEV._setDraft(() => { had = true; }); return had; };
  const abrirEditor = () => { const cta = d.querySelector("#v32cta"); if (!cta) vac("editor", "`#v32cta` ausente na tela de resultados"); cta.click(); if (!temDraft()) vac("editor", "abrir o editor não criou draft"); };
  const semDraft = rota => {
    must(typeof UI.hasDraft === "function", rota + ": `__V32UI.hasDraft` não existe");
    must(UI.hasDraft() === false, rota + ": hasDraft() ainda true");
    must(!temDraft(), rota + ": o draft continua vivo (sonda _setDraft)");
    const pp = w.__DEV.preparePrint(); w.__DEV.finishPrint();
    must(pp.blocked !== true, rota + ": preparePrint() bloqueado pelo draft do cliente anterior (EA-107)");
  };
  await A("a", () => {
    abrirEditor(); w.__DEV.showImportPreview(F["0"], COMPAT, null); d.querySelector("#ux-modal-ok").click(); semDraft("import confirmado");
    sessao(w); abrirEditor(); d.querySelector("#ux-newsession").click(); d.querySelector("#ux-modal-ok").click(); semDraft("Nova sessão");
    sessao(w); abrirEditor(); d.querySelector("#restart").click(); d.querySelector("#ux-modal-ok").click(); semDraft("Reiniciar");
  });
  await A("b", async () => {
    sessao(w); abrirEditor();
    const r = w.__DEV.importSessionDocument(F.invId); must(r.ok === false, "F-inv-id aceito");
    must(typeof UI.hasDraft === "function" && UI.hasDraft() === true && temDraft(), "import recusado descartou o draft");
    let pp = w.__DEV.preparePrint(); w.__DEV.finishPrint(); must(pp.blocked === true, "preparePrint() não bloqueou com draft aberto após recusa");
    await selecionarArquivo(w, d, F.A); d.querySelector("#ux-modal-cancel").click();
    must(UI.hasDraft() === true && temDraft(), "prévia cancelada descartou o draft");
    pp = w.__DEV.preparePrint(); w.__DEV.finishPrint(); must(pp.blocked === true, "preparePrint() não bloqueou com draft aberto após prévia cancelada");
  });
  await A("c", () => must(typeof UI.discardDraft === "function", "`__V32UI.discardDraft` não é função"));
}));

/* ====================== C13 · a prévia e o aviso de substituição falam da curadoria ====================== */
T("D025-PRV1", "sessionPreview.curation; a prévia diz `Curadoria do relatório: sim/não`; só curadoria declarada já exige `Importar e substituir`", () => alineas(async A => {
  const { w, d } = boot();
  await A("a", () => {
    must(w.__DEV.sessionPreview(F.A).curation === true, "sessionPreview(F-A).curation ≠ true: " + JSON.stringify(w.__DEV.sessionPreview(F.A).curation));
    must(w.__DEV.sessionPreview(F["0"]).curation === false, "sessionPreview(F-0).curation ≠ false");
  });
  await A("b", () => {
    w.__DEV.showImportPreview(F.A, COMPAT, null);
    must(txt(d.querySelector("#ux-modal")).indexOf("Curadoria do relatório: sim") >= 0, "prévia de F-A sem `Curadoria do relatório: sim`");
    d.querySelector("#ux-modal-cancel").click();
    w.__DEV.showImportPreview(F["0"], COMPAT, null);
    must(txt(d.querySelector("#ux-modal")).indexOf("Curadoria do relatório: não") >= 0, "prévia de F-0 sem `Curadoria do relatório: não`");
    d.querySelector("#ux-modal-cancel").click();
  });
  await A("c", () => {
    const V = boot({ vazia: true }); const bv = cur(V.w);
    must(V.w.__DEV.sessionHasContent() === false, "janela virgem já tem conteúdo");
    V.w.__DEV.showImportPreview(F["0"], COMPAT, null);
    must(txt(V.d.querySelector("#ux-modal")).indexOf("substituirá a sessão atual") < 0 && txt(V.d.querySelector("#ux-modal-ok")) === "Importar", "janela virgem sem declaração já avisa substituição");
    V.d.querySelector("#ux-modal-cancel").click();
    bv.set(bv.catalog()[0], "exclude");
    must(V.w.__DEV.sessionHasContent() === true, "sessionHasContent() ignora curadoria declarada (EA-109)");
    V.w.__DEV.showImportPreview(F["0"], COMPAT, null);
    const m = txt(V.d.querySelector("#ux-modal"));
    must(m.indexOf("substituirá a sessão atual") >= 0, "aviso `substituirá a sessão atual` ausente com só curadoria declarada");
    must(txt(V.d.querySelector("#ux-modal-ok")) === "Importar e substituir", "botão ≠ `Importar e substituir`: " + txt(V.d.querySelector("#ux-modal-ok")));
    V.d.querySelector("#ux-modal-cancel").click();
  });
}));

/* ====================== C14 · toggle-back volta a ausente ====================== */
T("D025-UNS1", "o editor escreve só a divergência: remarcar ofertado, desmarcar não ofertado e remarcar a leitura arquitetural voltam a AUSENTE; unset no bridge", () => alineas(async A => {
  const { w, d } = boot({ contexto: true }); const b = cur(w);
  if (!d.getElementById("v32arch-note")) vac("fixture", "a fixture com contexto não produziu leitura arquitetural");
  abrirPainel(d);
  await A("a", () => {
    toggle(w, checkboxDe(d, REF.nomeOff0)); must(b.state().decisions[REF.off0] === "exclude", "desmarcar ofertado não gravou exclude: " + JSON.stringify(b.state().decisions));
    toggle(w, checkboxDe(d, REF.nomeOff0)); must(!(REF.off0 in b.state().decisions), "remarcar ofertado gravou `" + b.state().decisions[REF.off0] + "` em vez de voltar a ausente (EA-110)");
  });
  await A("b", () => {
    toggle(w, checkboxDe(d, REF.nomeSemL)); must(b.state().decisions[REF.semL] === "include", "marcar não ofertado não gravou include");
    toggle(w, checkboxDe(d, REF.nomeSemL)); must(!(REF.semL in b.state().decisions), "desmarcar não ofertado gravou `" + b.state().decisions[REF.semL] + "` em vez de voltar a ausente");
  });
  await A("c", () => {
    const arq = () => { const c = d.querySelector("[data-p53-cur-arquitetura] .p53-cur-check"); if (!c) vac("(c)", "checkbox da leitura arquitetural ausente"); return c; };
    toggle(w, arq()); must(b.state().architectureNote === "exclude", "desmarcar a leitura arquitetural não gravou exclude");
    toggle(w, arq()); must(b.state().architectureNote === undefined, "remarcar a leitura arquitetural gravou `" + b.state().architectureNote + "` em vez de voltar a ausente");
  });
  await A("d", () => {
    must(b.toSession() === undefined, "após os três toggle-back toSession() ≠ undefined: " + JSON.stringify(b.toSession()));
    const doc = clone(w.__DEV.buildSessionDocument("d"));
    const N = boot({ contexto: true }); must(N.w.__DEV.importSessionDocument(doc).ok === true, "roundtrip recusado");
    const pp = papel(N.w, N.d);
    must(pp.produtos.indexOf(REF.nomeSemL) < 0 && pp.prov === 0, "o item remarcado produziu card/rótulo de proveniência no papel do DOM novo");
  });
  await A("e", () => {
    must(typeof b.unset === "function" && typeof b.unsetArchitectureNote === "function", "`unset`/`unsetArchitectureNote` não existem no bridge");
    b.set(REF.off0, "exclude"); must(b.unset(REF.off0) === true && !(REF.off0 in b.state().decisions), "unset não removeu a decisão");
    let msg = null; try { b.unset("ProdutoQueNaoExiste"); } catch (e) { msg = e.message; }
    must(msg && msg.indexOf("curadoria: id fora do catálogo") >= 0, "unset de id desconhecido não lançou `curadoria: id fora do catálogo`: " + msg);
    b.setArchitectureNote("exclude"); must(b.unsetArchitectureNote() === true && b.state().architectureNote === undefined, "unsetArchitectureNote não devolveu ao ausente");
  });
}));

/* ====================== C15 · gate fechado + curadoria no arquivo (nasce VERDE) ====================== */
T("D025-GAT1", "gate de suficiência fechado: a curadoria do arquivo é importada e retida, o editor não se oferece, o export seguinte a carrega", () => alineas(async A => {
  const S = boot({ poucasRespostas: true });
  const insuf = clone(S.w.__DEV.buildSessionDocument("insuf")); insuf.inputs.reportCuration = clone(F.A.inputs.reportCuration);
  if (Object.values(insuf.inputs.assessment.answers).filter(v => v !== null).length > 9) vac("fixture", "F-insuf tem mais de 9 respostas");
  const { w, d } = boot({ poucasRespostas: true }); const b = cur(w);
  await A("a", () => {
    const r = w.__DEV.importSessionDocument(insuf); must(r.ok === true, "F-insuf recusado: " + r.error);
    const res = d.querySelector("#p50-results"); const gate = res ? res.getAttribute("data-p50-gate") : null;
    if (gate !== "blocked") vac("(a)", "a fixture não produziu gate fechado (medido: " + gate + ")");
    must(!d.querySelector("[data-p53-abrir-curadoria]"), "editor de curadoria oferecido com o gate fechado");
    must(deepEq(b.state(), CUR_A()), "curadoria do arquivo não foi retida sob gate fechado: " + JSON.stringify(b.state()));
    must(deepEq(w.__DEV.captureCanonicalInputs().reportCuration, insuf.inputs.reportCuration), "o export seguinte não carrega a curadoria retida");
  });
}));

/* ====================== C16 · a documentação diz o que o produto faz ====================== */
T("D025-DOC1", "SESSION_SCHEMA_V32.md: linha da sexta chave, ausência legítima E substitutiva, rollback nomeia __CURATION, S81 intacto; USER_GUIDE §11: importar substitui também a curadoria, Nova sessão e Reiniciar a limpam", () => alineas(async A => {
  const ler = n => { const p = path.join(DOC_DIR, n); if (!fs.existsSync(p)) vac("doc", n + " ausente em " + DOC_DIR); return fs.readFileSync(p, "utf8"); };
  const SCHEMA = ler("SESSION_SCHEMA_V32.md"), GUIA = ler("USER_GUIDE.md");
  await A("a", () => {
    const lines = SCHEMA.split("\n"); const tables = []; let t = null;
    lines.forEach(l => { const row = /^\s*\|.*\|\s*$/.test(l); if (row) { if (!t) t = { rows: [] }; t.rows.push(l); } else if (t) { tables.push(t); t = null; } });
    if (t) tables.push(t);
    const owners = tables.filter(x => x.rows.length > 2 && /declaredDriver|architectureContext|declaredPlatforms|signals|solutions/.test(x.rows.join("\n")))[0];
    if (!owners) vac("(a)", "tabela de owners (§5) não encontrada");
    const cells = r => r.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).length;
    const linha = owners.rows.filter(r => /reportCuration/.test(r) && /__CURATION/.test(r))[0];
    must(linha, "a tabela de owners não tem linha com `reportCuration` e `__CURATION` (EA-112 d)");
    must(cells(linha) === cells(owners.rows[0]), "a linha da sexta chave tem " + cells(linha) + " células; as demais têm " + cells(owners.rows[0]) + " (S82)");
  });
  await A("b", () => must(/ausên[cs]ia[\s\S]{0,160}substitu/i.test(SCHEMA), "o schema não diz que a chave ausente é legítima E que a importação substitui"));
  await A("c", () => must(/Cobertura de rollback[\s\S]{0,800}__CURATION/.test(SCHEMA), "a cobertura de rollback (§8.4 item 5) não nomeia __CURATION"));
  await A("d", () => {
    const scope = /recompute[\s\S]{0,200}fora da transação|fora\s+da transação/i.test(SCHEMA);
    const unqualified = /qualquer falha (deixa|mantém) a sessão anterior intacta/i.test(SCHEMA);
    const boundary = /valida(ção|tion)[\s\S]{0,120}normaliza[\s\S]{0,120}commit/i.test(SCHEMA);
    must(scope && !unqualified && boundary, "as regexes de S81 deixaram de ser satisfeitas na cópia lida (scope=" + scope + " unqualified=" + unqualified + " boundary=" + boundary + ")");
  });
  await A("e", () => {
    const i = GUIA.search(/^## 11\b/m), j = GUIA.search(/^## 12\b/m);
    if (i < 0) vac("(e)", "USER_GUIDE.md sem §11");
    const s11 = GUIA.slice(i, j > i ? j : undefined);
    must(/curadoria do relatório/i.test(s11), "§11 não fala da curadoria do relatório");
    must(/importa[^\n]{0,200}substitui[^\n]{0,200}curadoria|importa[^\n]{0,200}curadoria[^\n]{0,200}substitui/i.test(s11), "§11 não diz que importar substitui também a curadoria");
    must(/Nova sessão/.test(s11) && /Reiniciar avaliação/.test(s11), "§11 não nomeia Nova sessão e Reiniciar avaliação");
    must(/(Nova sessão|Reiniciar avaliação)[^\n]{0,240}limp/i.test(s11), "§11 não diz que Nova sessão e Reiniciar avaliação limpam a curadoria");
  });
}));

/* ============================== execução sequencial e resumo ============================== */
(async () => {
  const t0 = Date.now(); const results = [];
  try { fixtures(); }
  catch (e) {
    console.log("FAIL  D025-FIXTURES — fixtures de referência: " + e.message);
    console.log("\nD025 CURADORIA SESSAO: 0 PASS · 1 FAIL de 1");
    process.exit(1);
  }
  JANELAS.forEach(w => { try { w.close(); } catch (e) { /* já fechada */ } }); JANELAS = [];
  let janelas = 0;
  for (const g of GATES) {
    const ti = Date.now(); let ok = false, extra = "";
    try { ok = !!(await g.fn()); } catch (e) { ok = false; extra = " [" + e.message + "]"; }
    results.push({ id: g.id, ok });
    console.log((ok ? "PASS" : "FAIL") + "  " + g.id + " — " + g.label + extra);
    console.log("      · " + ((Date.now() - ti) / 1000).toFixed(1) + " s · " + JANELAS.length + " janela(s)");
    janelas += JANELAS.length;
    JANELAS.forEach(w => { try { w.close(); } catch (e) { /* já fechada */ } }); JANELAS = [];
  }
  const pass = results.filter(r => r.ok).length;
  const fail = results.length - pass;
  console.log("\nD025 tempo total: " + ((Date.now() - t0) / 1000).toFixed(1) + " s · " + janelas + " janela(s) jsdom · heap " + Math.round(process.memoryUsage().heapUsed / 1048576) + " MB");
  console.log("\nD025 CURADORIA SESSAO: " + pass + " PASS · " + fail + " FAIL de " + results.length);
  process.exit(fail ? 1 : 0);
})();
