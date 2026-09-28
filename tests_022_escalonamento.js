/* ============================================================================
   TESTES D022 · ESCALONAMENTO DO INVESTIMENTO (jsdom)
   demanda 022-escalonamento-do-investimento · namespace exclusivo D022-*
   Não continua numeração de fase alheia e não vive em arquivo de outra fase
   (R10 §1). Sem Chromium: nenhum gate aqui mede geometria.

   ONDE ESTA SUÍTE É EXECUTADA
   ---------------------------------------------------------------------------
   Stage `suites` do `pipeline.yaml` → `check_suites.py`, chave `d022` de
   `expected_suites.json`. Registro e execução entram no mesmo PR (R10 §3).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os 14 critérios de `specs/022-escalonamento-do-investimento/spec.md`.

   O PROBLEMA, medido na Fase 0: o motor responde "o que serve aqui?" por
   capability, QUINZE vezes isoladas, e o cliente pergunta "por onde eu começo?"
   uma vez. Nada no produto encena investimento.

   A REGRA que estes gates cercam:

       teto = índice da banda de `__QS_STAGE_RULER` que contém `overall`,
              com piso 1 e sem teto algum quando não há suficiência;
       primeira onda = TODAS as prioridades declaradas (sem teto)
                       + acréscimo do motor até `teto − |prioridades|`;
       o resto NÃO some: vira onda seguinte declarada.

   ==========================================================================
   POR QUE O CONTRATO PURO MUDA O QUE DÁ PARA MEDIR
   ==========================================================================
   `__QS22.ondas()` é função pura (spec §Contratos). Isso permite ao
   `D022-TETO1` varrer os SEIS estágios passando `overall` sintético, sem
   fabricar seis sessões — e é o que torna o `D022-INV1` mensurável: uma função
   sem efeito não pode mover o estado canônico, e o gate PROVA em vez de supor.

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE
   ==========================================================================
   Alínea que depende de caso DECLARA a pré-condição e falha NOMEANDO o estado,
   nunca fecha verde por ausência de sujeito (lição do `D010-INV7`/`EA-11`).

   ==========================================================================
   POR QUE ESTES GATES NASCEM VERMELHOS
   ==========================================================================
   Escritos ANTES da implementação (R3 §1/§4). Hoje `__QS22` não existe, não há
   onda alguma no relatório e o contexto tecnológico é indexado por capability.
   O vermelho é o ponto, e commitá-lo é a prova de que o critério não foi
   ajustado ao resultado.

   Nasce VERDE e vai declarado: `D022-BND1`, que mede que nenhum `frozen` foi
   tocado. Hoje nada os toca, e é exatamente isso que ele existe para continuar
   afirmando depois das waves 2 e 3. O poder dele vem do mutante `M13`.
   ========================================================================== */

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_PATH = process.env.D022_HTML_OVERRIDE ||
  path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D022-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD022 ESCALONAMENTO: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const results = [];
const ONLY = (process.env.D022_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
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

/* ==========================================================================
   Sessão de referência.
   `niveis` permite níveis DIFERENTES entre perguntas: a fixture de nível único
   é o extremo improvável que deixou o `EA-68` passar por sete waves.
   ========================================================================== */
function boot(opts) {
  const o = opts || {};
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  w.__DEV.setArq(0);
  const ids = w.eval("QS.map(q=>q.id)");
  const base = ("nivel" in o) ? o.nivel : 1;
  ids.forEach(id => w.__DEV.setAnswerById(id, base));
  if (o.niveis) Object.keys(o.niveis).forEach(id => w.__DEV.setAnswerById(id, o.niveis[id]));
  if (o.contexto) {
    const V = w.__DEV.V32;
    ["endpoint-detection", "network-detection", "incident-management", "security-analytics"]
      .forEach(c => { if (V.TECH_LANDSCAPE[c]) V.TECH_LANDSCAPE[c].presence = "NONE"; });
    V.ARCHITECTURE_CONTEXT.saasAllowed = "yes";
  }
  if (o.alvos) Object.keys(o.alvos).forEach(qid => {
    const okSet = w.eval("setTarget(" + JSON.stringify(qid) + "," + o.alvos[qid] + ")");
    if (okSet !== true) vac("fixture", "setTarget recusou " + qid + "=" + o.alvos[qid] +
      " — alvo abaixo do atual não é cenário válido (INV-5)");
  });
  w.__DEV.setPriorities("prios" in o ? o.prios : ["endpoint", "logs", "network-visibility"]);
  w.__DEV.showResults();
  return { w, d };
}

function papel(w, d) {
  w.dispatchEvent(new w.Event("beforeprint"));
  const rel = d.getElementById("v32-print-report");
  if (!rel) vac("pré-condição", "`#v32-print-report` não existe após `beforeprint`");
  return rel;
}

/* ---- o contrato da spec, e a falha NOMEADA quando ele não existe ---------- */
function bridge(w) {
  if (!w.__QS22 || typeof w.__QS22.ondas !== "function")
    throw new Error("`__QS22.ondas` ausente — o contrato da spec §Contratos não existe");
  return w.__QS22;
}
/* Entrada montada do MOTOR, nunca do DOM — lição da 021, onde um oráculo lido
   do card perdeu um sujeito em silêncio (`mandate`, por causa do P52_COPY). */
function entrada(w, over) {
  const snap = JSON.parse(w.__DEV.legacySnapshot());
  const base = {
    findings: w.eval("computeFindings().findings") || [],
    prioridades: w.eval("Array.from(businessPriority)") || [],
    alvos: JSON.parse(w.eval("JSON.stringify(TARGET_PROFILE.overrides)")),
    overall: snap.overall,
    suff: snap.suff
  };
  return Object.assign(base, over || {});
}
const ondas = (w, over) => bridge(w).ondas(entrada(w, over));

/* A RÉGUA, lida do bridge que o produto já expõe e já desenha — nunca uma
   tabela transcrita para cá (a transcrição é a cópia literal que apodrece). */
function tetoEsperado(w, overall) {
  const bands = w.__QS_STAGE_RULER.bands();
  let i = bands.findIndex(b => overall >= b.from && overall < b.to);
  if (i < 0) i = bands.length - 1;                     /* overall == 5 */
  return Math.max(1, i);
}

/* ========================================================================== */

T("D022-TETO1", "C1 · o teto é o índice da banda de estágio, com piso 1", () => {
  const { w } = boot();
  const B = bridge(w);
  const amostras = [0.4, 1.0, 2.0, 3.0, 4.0, 4.8];
  const vistos = new Set();
  amostras.forEach(v => {
    const r = B.ondas({ findings: [], prioridades: [], alvos: {}, overall: v, suff: true });
    const esperado = tetoEsperado(w, v);
    vistos.add(r.teto);
    if (r.teto !== esperado)
      throw new Error("overall " + v + ": teto " + r.teto + " × esperado " + esperado);
  });
  /* guarda de tautologia: teto constante passaria a varredura acima se o
     esperado também fosse constante — exige que a régua DISCRIMINE */
  if (vistos.size < 4)
    throw new Error("a varredura produziu só " + vistos.size + " teto(s) distinto(s) — sem poder discriminante");
  return true;
});

T("D022-PRIO1", "C2 · prioridade declarada nunca é cortada pelo teto", () => {
  const { w } = boot({ nivel: 1, prios: ["endpoint", "logs", "network-visibility"] });
  const r = ondas(w);
  if (r.teto === null) vac("(a)", "sessão sem suficiência — este gate exige teto vivo");
  if (r.teto >= 3) vac("(a)", "teto " + r.teto + " ≥ 3 prioridades: o caso não exercita o corte");
  const prios = w.eval("Array.from(businessPriority)");
  const faltam = prios.filter(q => r.primeira.indexOf(q) < 0);
  if (faltam.length)
    throw new Error("prioridade declarada fora da primeira onda: " + JSON.stringify(faltam) +
      " (teto " + r.teto + ")");
  return true;
});

T("D022-TENS1", "C3 · prioridades acima do teto são NOMEADAS, nunca podadas", () => {
  const { w, d } = boot({ nivel: 1, prios: ["endpoint", "logs", "network-visibility"] });
  const r = ondas(w);
  if (!r.tensao) throw new Error("`tensao` ausente com " + r.primeira.length +
    " prioridades e teto " + r.teto);
  if (r.tensao.declaradas !== 3 || r.tensao.teto !== r.teto)
    throw new Error("`tensao` não traz os dois números: " + JSON.stringify(r.tensao));
  const t = txt(papel(w, d));
  if (t.indexOf(String(r.tensao.declaradas)) < 0 || t.indexOf(String(r.tensao.teto)) < 0)
    throw new Error("o papel não traz os dois números da tensão");
  if (!/Gerenciado|Inicial|Definido|Inexistente|otimiza|Quantitativ/i.test(t))
    throw new Error("o papel não nomeia o estágio que produziu o teto");
  return true;
});

T("D022-SUFI1", "C4 · sem suficiência não há escalonamento, e isso é dito", () => {
  /* três respostas confirmadas: abaixo do piso de 10 e de 2 por domínio */
  const { w, d } = boot({ nivel: null, niveis: { endpoint: 1, logs: 1, mandate: 1 },
                          prios: ["endpoint"] });
  const snap = JSON.parse(w.__DEV.legacySnapshot());
  if (snap.suff !== false) vac("(a)", "a fixture não produziu insuficiência (suff=" + snap.suff + ")");
  const r = ondas(w);
  if (r.teto !== null) throw new Error("teto " + r.teto + " sem suficiência — deveria ser null");
  const prios = w.eval("Array.from(businessPriority)");
  const extras = r.primeira.filter(q => prios.indexOf(q) < 0);
  if (extras.length) throw new Error("o motor acrescentou sem suficiência: " + JSON.stringify(extras));
  if (!/insufici|não há evidência suficiente|sem suficiência/i.test(txt(papel(w, d))))
    throw new Error("o papel não diz por que não há escalonamento");
  return true;
});

T("D022-COB1", "C5 · a união das ondas é IGUAL ao conjunto coberto pela 021", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const r = ondas(w);
  const rel = papel(w, d);
  const comApoio = qa(rel, "[data-pr-gap-support]").map(b => b.getAttribute("data-pr-gap-qid")).sort();
  if (!comApoio.length) vac("(a)", "nenhum gap com caminho de apoio no papel — sujeito vazio");
  const uniao = r.primeira.concat(r.seguintes).sort();
  const faltam = comApoio.filter(q => uniao.indexOf(q) < 0);
  const sobram = uniao.filter(q => comApoio.indexOf(q) < 0);
  if (faltam.length || sobram.length)
    throw new Error("união ≠ cobertura da 021 · sumiram: " + JSON.stringify(faltam) +
      " · inventados: " + JSON.stringify(sobram));
  return true;
});

T("D022-CRIT1", "C6 · a onda seguinte declara o critério que a produziu", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const r = ondas(w);
  if (!r.seguintes.length) vac("(a)", "nenhuma onda seguinte nesta fixture — sujeito vazio");
  const no = papel(w, d).querySelector("[data-qs22-onda='seguinte']");
  if (!no) throw new Error("o papel não traz nó de onda seguinte");
  const t = txt(no);
  if (t.indexOf(String(r.teto)) < 0)
    throw new Error("a onda seguinte não cita o teto: " + JSON.stringify(t.slice(0, 120)));
  if (!r.estagio || t.indexOf(r.estagio) < 0)
    throw new Error("a onda seguinte não cita o estágio: " + JSON.stringify(t.slice(0, 120)));
  return true;
});

T("D022-ALVO1", "C7 · alvo igual ao atual sai do enquadramento, NOMEADAMENTE", () => {
  const { w, d } = boot({ nivel: 1, contexto: true, prios: ["endpoint"],
                          alvos: { "network-visibility": 1 } });
  const r = ondas(w);
  const excl = (r.excluidas || []).map(e => e.qid);
  if (excl.indexOf("network-visibility") < 0)
    throw new Error("prática com alvo == atual não foi excluída: " + JSON.stringify(excl));
  if (r.primeira.indexOf("network-visibility") >= 0)
    throw new Error("prática declarada como não-subir recebeu frente");
  const motivo = (r.excluidas.find(e => e.qid === "network-visibility") || {}).motivo;
  if (!motivo) throw new Error("exclusão sem motivo declarado — silêncio é o que o C7 proíbe");
  if (txt(papel(w, d)).indexOf("network-visibility") < 0 &&
      !/alvo igual|não vai subir|mantida no nível/i.test(txt(papel(w, d))))
    throw new Error("o papel não nomeia a exclusão");
  return true;
});

T("D022-ALVO2", "C8 · o alvo não abre frente nova nem aumenta o teto", () => {
  const semAlvo = boot({ nivel: 1, contexto: true, prios: ["endpoint"] });
  const comAlvo = boot({ nivel: 1, contexto: true, prios: ["endpoint"],
                         alvos: { "vulnerability-management": 3 } });
  const a = ondas(semAlvo.w), b = ondas(comAlvo.w);
  if (a.teto !== b.teto)
    throw new Error("o alvo mexeu no teto: " + a.teto + " → " + b.teto);
  if (a.primeira.length !== b.primeira.length)
    throw new Error("o alvo abriu frente nova: " + a.primeira.length + " → " + b.primeira.length);
  return true;
});

T("D022-PAP1", "C9 · a onda existe no papel, não só na tela", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const rel = papel(w, d);
  const primeira = qa(rel, "[data-qs22-onda='primeira']");
  if (!primeira.length) throw new Error("o relatório impresso não traz a primeira onda");
  const r = ondas(w);
  const noPapel = qa(rel, "[data-qs22-frente]").map(n => n.getAttribute("data-qs22-frente")).sort();
  const esperado = r.primeira.slice().sort();
  if (JSON.stringify(noPapel) !== JSON.stringify(esperado))
    throw new Error("papel × contrato divergem · papel=" + JSON.stringify(noPapel) +
      " contrato=" + JSON.stringify(esperado));
  return true;
});

T("D022-PROD1", "C10 · contexto tecnológico indexado por PRODUTO, sem perder sinal", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const rel = papel(w, d);
  const cards = qa(rel, "[data-qs22-produto]");
  if (!cards.length) vac("(a)", "nenhum card indexado por produto — o eixo não mudou");
  const nomes = cards.map(c => c.getAttribute("data-qs22-produto"));
  const dup = nomes.filter((n, i) => nomes.indexOf(n) !== i);
  if (dup.length) throw new Error("produto repetido: " + JSON.stringify(Array.from(new Set(dup))));
  const multi = cards.filter(c => (c.getAttribute("data-qs22-caps") || "").split(",").filter(Boolean).length > 1);
  if (!multi.length)
    vac("(b)", "nenhum produto serve mais de uma capability nesta fixture — o caso do EA-75 não é exercitado");
  multi.forEach(c => {
    if (!(c.getAttribute("data-qs22-sinais") || "").trim())
      throw new Error("produto multi-capability perdeu os sinais ao fundir: " +
        c.getAttribute("data-qs22-produto"));
  });
  return true;
});

T("D022-A11Y1", "C11 · a onda é distinguível por TEXTO, não por cor (UX-P7 selada)", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const rel = papel(w, d);
  ["primeira", "seguinte"].forEach(qual => {
    const no = rel.querySelector("[data-qs22-onda='" + qual + "']");
    if (!no) return;                       /* ausência é julgada por PAP1/CRIT1 */
    if (!txt(no)) throw new Error("onda '" + qual + "' sem texto algum — só cor não basta");
    const rotulo = no.querySelector("[data-qs22-rotulo]");
    if (!rotulo || !txt(rotulo))
      throw new Error("onda '" + qual + "' sem rótulo textual próprio");
  });
  if (!rel.querySelector("[data-qs22-onda]")) vac("(a)", "nenhuma onda no papel — sujeito vazio");
  return true;
});

T("D022-PROV1", "C12 · a onda declara sua proveniência (UX-P6 selada)", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const nos = qa(papel(w, d), "[data-qs22-onda]");
  if (!nos.length) vac("(a)", "nenhuma onda no papel — sujeito vazio");
  nos.forEach(n => {
    const prov = n.getAttribute("data-qs22-prov");
    if (!prov || !prov.trim())
      throw new Error("onda sem proveniência declarada: " + n.getAttribute("data-qs22-onda"));
  });
  return true;
});

T("D022-INV1", "C13 · escalonar não altera score, suficiência nem estado canônico (UX-P8)", () => {
  const { w, d } = boot({ nivel: 1, contexto: true });
  const antes = w.__DEV.legacySnapshot();
  ondas(w);                       /* o contrato puro */
  papel(w, d);                    /* e a montagem do relatório */
  const depois = w.__DEV.legacySnapshot();
  if (antes !== depois)
    throw new Error("o estado canônico mudou ao escalonar — diff de " +
      Math.abs(antes.length - depois.length) + " byte(s)");
  return true;
});

T("D022-BND1", "C14 · nenhum arquivo `frozen` foi tocado", () => {
  const pins = JSON.parse(fs.readFileSync(path.join(HERE, ".claude/verify/pins.json"), "utf8"));
  const boundary = JSON.parse(fs.readFileSync(path.join(HERE, ".claude/verify/boundary.json"), "utf8"));
  const frozen = boundary.classes.frozen.paths;
  if (!frozen.length) vac("(a)", "boundary.json não declara arquivo frozen algum");
  const mapa = pins.files || pins;
  const divergentes = frozen.filter(f => {
    const esperado = typeof mapa[f] === "string" ? mapa[f] : (mapa[f] || {}).sha256;
    return !esperado || sha(path.join(HERE, f)) !== esperado;
  });
  if (divergentes.length)
    throw new Error("frozen alterado: " + JSON.stringify(divergentes));
  /* A régua D2 (payload M41) é medida pelo stage `m41` do pipeline, que roda o
     harness. Aqui se afirma a metade que este gate PODE medir sem invocar
     processo externo (R10 §6), e a outra metade fica DECLARADA, não implícita. */
  return true;
});

/* ============================== RESUMO ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD022 ESCALONAMENTO" + (ONLY.length ? " [FILTRADO]" : "") +
  ": " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
