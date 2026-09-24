/* ============================================================================
   TESTES D021 · COBERTURA DO APOIO (jsdom) — demanda 021-cobertura-do-apoio
   Namespace exclusivo D021-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria.

   ONDE ESTA SUÍTE É EXECUTADA, E POR QUEM
   ---------------------------------------
   Stage `suites` do `pipeline.yaml` → `.claude/verify/check_suites.py`, que lê a
   chave `d021` de `expected_suites.json` e roda `node tests_021_cobertura.js`,
   comparando a última linha contra a contagem canônica. Registro e execução
   entram no mesmo PR (R10 §3, com a errata E2 da 019: na wave de fecho).

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Oito dos nove critérios de `specs/021-cobertura-do-apoio/spec.md`. O nono
   (C9, a emenda da §UAT-07) é medido pelo `P51-REC1` emendado, em
   `tests_p50_core.js` — gate de outra fase, alterado por esta demanda.

   O PROBLEMA que a demanda existe para corrigir, medido na Fase 0:

       15 gaps chegam ao relatório do cliente · 4 com caminho de apoio · 11 SEM

   A REGRA que estes gates cercam, em uma frase:

       se o qid está em QS_GAP_SUPPORT, usa a tabela (intacta);
       senão, deriva de MAP[qid].lv[nível respondido].c;
       se nem isso existir, não emite bloco.

   ==========================================================================
   A SUPERFÍCIE É PAPEL, E SÓ — errata E2 da spec
   ==========================================================================
   `qsGapSupportHTML()` tem UM sítio de chamada: `ui_v32.js:1269`, dentro de
   `buildPrintReport()`. Medido antes de escrever estes gates:

       TELA  (após showResults)  ·  [data-pr-gap-support]: 0
       PAPEL (após beforeprint)  ·  [data-pr-gap-support]: 4

   Por isso TODA medição aqui é feita no relatório real, disparado por
   `beforeprint` — nunca por chamada direta a `buildPrintReport()`, que é a
   lição do `EA-26`: medir o intermediário esconde o que o cliente recebe.

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE — a regra desta suíte
   ==========================================================================
   Alínea que depende de caso DECLARA ela mesma a pré-condição e falha NOMEANDO
   o estado, em vez de fechar verde por ausência de sujeito (lição do
   `D010-INV7`, achado `EA-11`). `vac()` dá a essa falha uma forma só.

   ==========================================================================
   POR QUE ESTES GATES NASCEM VERMELHOS
   ==========================================================================
   Esta suíte é escrita ANTES da implementação (R3 §1/§4). Hoje os 11 qids fora
   da tabela recebem `""` — silêncio —, e o atributo `data-pr-gap-ancora` não
   existe. O vermelho é o ponto, e o commit dele é a prova de que o critério não
   foi ajustado ao resultado.

   Nasce VERDE, e vai declarado em vez de escondido: `D021-CUR1`. Ele mede que
   os quatro curados não regridem, e hoje nada os toca. O poder dele vem do
   mutante `M1` (derivação passando na frente da tabela), não do red.
   ========================================================================== */

const path = require("path"), fs = require("fs");
const { JSDOM } = require("jsdom");

const HERE = __dirname;
const HTML_NOME = "quickscan_secops_soccmm_v3_2_dev.html";
const HTML_PATH = process.env.D021_HTML_OVERRIDE || path.join(HERE, HTML_NOME);
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D021-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD021 COBERTURA: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");

const results = [];
const ONLY = (process.env.D021_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
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
   Sessão de referência e leitura do PAPEL.
   `niveis` aceita um mapa qid→nível para as alíneas que precisam de níveis
   DIFERENTES entre perguntas (C5) — a fixture de nível único é o extremo
   improvável que deixou o `EA-68` passar por sete waves.
   ========================================================================== */
function boot(opts) {
  const o = opts || {};
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  w.__DEV.setArq(0);
  const ids = w.eval("QS.map(q=>q.id)");
  const base = ("nivel" in o) ? o.nivel : 0;
  ids.forEach(id => w.__DEV.setAnswerById(id, base));
  if (o.niveis) Object.keys(o.niveis).forEach(id => w.__DEV.setAnswerById(id, o.niveis[id]));
  if (o.contexto) {
    const V = w.__DEV.V32;
    ["security-analytics", "soc-platform"].forEach(c => {
      if (V.TECH_LANDSCAPE[c]) V.TECH_LANDSCAPE[c].presence = "NONE";
    });
    V.ARCHITECTURE_CONTEXT.saasAllowed = "yes";
  }
  w.__DEV.setPriorities(o.prios || ["endpoint", "logs", "network-visibility"]);
  w.__DEV.showResults();
  return { w, d };
}

/* O RELATÓRIO REAL — disparado por `beforeprint`, nunca por chamada direta ao
   builder (`EA-26`). Devolve o nó do papel, ou falha NOMEANDO. */
function papel(w, d) {
  w.dispatchEvent(new w.Event("beforeprint"));
  const rel = d.getElementById("v32-print-report");
  if (!rel) vac("pré-condição", "`#v32-print-report` não existe após `beforeprint`");
  if (!rel.querySelector("#pr-findings"))
    vac("pré-condição", "o relatório não trouxe a seção de gaps — sessão sem achados");
  return rel;
}
const blocos = root => qa(root, "[data-pr-gap-support]");
const qidDo = b => b.getAttribute("data-pr-gap-qid");
const opcoes = b => qa(b, "[data-pr-gap-opt]");

/* Fontes de verdade, lidas do artefato — nunca copiadas para cá. */
const tabela = w => w.__DEV.QS_GAP_SUPPORT || {};
const mapa = w => w.eval("MAP");

/* ORÁCULO DOS GAPS: o MOTOR, nunca o título do card.
   A primeira versão deste helper casava o texto do card contra `QS[].lbl` e
   PERDIA UM SUJEITO EM SILÊNCIO: o card de `mandate` publica "Direcionamento e
   objetivos" e o `QS.lbl` dele é "Mandato e objetivos". O gate media 14 gaps
   onde há 15 — a mesma doença que ele existe para caçar, dentro dele mesmo.

   `computeFindings()` é da Camada 1 congelada e devolve `{k,id,sev,lvl}`: o qid
   E o nível que produziu o achado, sem passar pela apresentação. É o oráculo
   independente que a R10 pede. */
const achados = w => w.eval("computeFindings().findings") || [];
const qidsComGap = w => achados(w).map(f => f.id);
/* o nível vem do PRÓPRIO achado, não de uma segunda leitura das respostas */
const nivelDe = (w, qid) => {
  const f = achados(w).find(x => x.id === qid);
  if (!f) vac("nível", "qid '" + qid + "' não está entre os achados do motor");
  return f.lvl;
};
const candidatos = (w, qid, nivel) => {
  const m = mapa(w)[qid];
  return ((m && m.lv && m.lv[nivel] && m.lv[nivel].c) || []);
};

/* ==========================================================================
   C1 · ZERO REGRESSÃO NOS CURADOS
   O desenho B foi descartado no portão por violar exatamente isto: derivar
   tudo estreitaria `detection-lifecycle` de quatro produtos para um. Se a
   implementação estreitar qualquer um dos quatro, ela parou de ser o desenho
   aprovado — e é este gate que diz.
   ========================================================================== */
T("D021-CUR1", "os quatro qids curados publicam exatamente as opções da tabela — nem uma a menos, nem uma a mais", () => {
  const { w, d } = boot({});
  const rel = papel(w, d);
  const TAB = tabela(w);
  const nomes = Object.keys(TAB);
  if (nomes.length < 4) vac("(a)", "a tabela curada tem " + nomes.length + " entradas — oráculo sem sujeito");
  const vistos = [];
  nomes.forEach(qid => {
    const b = blocos(rel).find(x => qidDo(x) === qid);
    if (!b) throw new Error("qid curado '" + qid + "' ficou SEM bloco — regressão no que já funcionava");
    vistos.push(qid);
    const t = txt(b);
    TAB[qid].opts.forEach(o => {
      if (t.indexOf(o.n) < 0)
        throw new Error("curado '" + qid + "' perdeu a opção '" + o.n + "' — estreitamento (desenho B, descartado)");
    });
    const n = opcoes(b).length;
    if (n !== TAB[qid].opts.length)
      throw new Error("curado '" + qid + "' publica " + n + " opções, a tabela declara " +
                      TAB[qid].opts.length + " — a derivação passou na frente da tabela");
  });
  if (vistos.length !== nomes.length) vac("(b)", "só " + vistos.length + " de " + nomes.length + " curados medidos");
  return true;
});

/* ==========================================================================
   C2 · COBERTURA COMPLETA — o coração da demanda
   ========================================================================== */
T("D021-COB1", "todo gap cujo qid tem candidato no nível respondido recebe caminho de apoio", () => {
  const { w, d } = boot({});
  const rel = papel(w, d);
  const gaps = qidsComGap(w);
  if (gaps.length < 10) vac("(a)", "só " + gaps.length + " gaps no relatório — a fixture não exercita a cobertura");
  const comBloco = blocos(rel).map(qidDo);
  const mudos = gaps.filter(qid => {
    const temCand = candidatos(w, qid, nivelDe(w, qid)).length > 0;
    return temCand && comBloco.indexOf(qid) < 0;
  });
  if (mudos.length)
    throw new Error(mudos.length + " de " + gaps.length + " gaps têm candidato no MAP e ficaram MUDOS: " +
                    mudos.join(", "));
  return true;
});

/* ==========================================================================
   C3 · A CLÁUSULA DE SILÊNCIO É INALCANÇÁVEL — e este é o sensor (errata E1)
   Medido na Fase 0: nível 0 → 15 gaps/15 candidatos; nível 1 → 15/15;
   nível 2 → 0 gaps/0 candidatos. Sempre que há gap, há candidato.
   A alínea (a) é a metade estática da prova de inalcançabilidade: se o
   catálogo mudar e a cláusula virar alcançável, ela reprova e AVISA.
   ========================================================================== */
T("D021-VAZ1", "todo gap tem candidato no nível respondido (a cláusula de silêncio segue inalcançável) e nenhum bloco sai vazio", () => {
  let medidos = 0;
  [0, 1].forEach(nivel => {
    const { w, d } = boot({ nivel });
    const rel = papel(w, d);
    const gaps = qidsComGap(w);
    if (!gaps.length) vac("(a)", "nível " + nivel + " não produziu gap — sem sujeito");
    gaps.forEach(qid => {
      medidos++;
      if (!candidatos(w, qid, nivelDe(w, qid)).length)
        throw new Error("nível " + nivel + ": gap '" + qid + "' SEM candidato no MAP — a cláusula " +
                        "defensiva de silêncio deixou de ser inalcançável; ela precisa de gate próprio agora");
    });
    /* (b) nenhum bloco vazio em lugar nenhum */
    blocos(rel).forEach(b => {
      if (!opcoes(b).length)
        throw new Error("nível " + nivel + ": bloco de '" + qidDo(b) + "' sem nenhuma opção — bloco vazio é " +
                        "pior que bloco ausente: promete caminho e não entrega");
    });
  });
  if (medidos < 20) vac("(c)", "apenas " + medidos + " pares (gap, nível) medidos");
  return true;
});

/* ==========================================================================
   C4 · A JUSTIFICATIVA VEM DO MAP
   O `EA-68` custou sete waves por uma fonte escrita à mão divergir do motor.
   Aqui o texto do "porquê" tem de SER o do MAP, não uma segunda redação.
   ========================================================================== */
T("D021-FON1", "o porquê de cada opção derivada é o texto do próprio MAP, sem redação própria", () => {
  const { w, d } = boot({});
  const rel = papel(w, d);
  const TAB = tabela(w);
  const derivados = blocos(rel).filter(b => !TAB[qidDo(b)]);
  if (!derivados.length)
    vac("(a)", "nenhum bloco derivado no relatório — a cobertura não foi implementada");
  let pares = 0;
  derivados.forEach(b => {
    const qid = qidDo(b), t = txt(b);
    candidatos(w, qid, nivelDe(w, qid)).forEach(c => {
      pares++;
      if (t.indexOf(c.p) < 0)
        throw new Error("derivado '" + qid + "' não cita o produto '" + c.p + "' que o MAP declara");
      if (c.w && t.indexOf(c.w) < 0)
        throw new Error("derivado '" + qid + "': o porquê publicado não é o do MAP — esperado \"" +
                        c.w + "\"");
    });
  });
  if (pares < 8) vac("(b)", "apenas " + pares + " pares (produto, porquê) conferidos");
  return true;
});

/* ==========================================================================
   C5 · NÍVEL RESPONDIDO, NUNCA NÍVEL FIXO
   Sujeitos escolhidos por medição: `team-capacity` e `incident-response` são
   os qids cujo conjunto de candidatos MUDA entre lv0 e lv1. Medir com um qid
   que não muda seria gate sem poder discriminante (`EA-20`).
   ========================================================================== */
T("D021-NIV1", "cada bloco derivado publica os candidatos do nível daquele qid, não os de um nível fixo", () => {
  const ALVOS = ["team-capacity", "incident-response"];
  const { w, d } = boot({ nivel: 0, niveis: { "team-capacity": 1, "incident-response": 1 } });
  const rel = papel(w, d);
  const TAB = tabela(w);
  let medidos = 0;
  ALVOS.forEach(qid => {
    if (TAB[qid]) vac("(a)", "'" + qid + "' virou curado — o sujeito desta alínea sumiu");
    const b = blocos(rel).find(x => qidDo(x) === qid);
    if (!b) throw new Error("'" + qid + "' sem bloco — a cobertura derivada não existe");
    const nivel = nivelDe(w, qid);
    if (nivel !== 1) vac("(b)", "'" + qid + "' respondido em nível " + nivel + ", esperado 1");
    const doNivel = candidatos(w, qid, 1).map(c => c.p);
    const doZero = candidatos(w, qid, 0).map(c => c.p);
    const soNoZero = doZero.filter(p => doNivel.indexOf(p) < 0);
    if (!soNoZero.length) vac("(c)", "'" + qid + "' não discrimina lv0 × lv1 — sujeito sem poder");
    const t = txt(b);
    doNivel.forEach(p => {
      if (t.indexOf(p) < 0) throw new Error("'" + qid + "' (nível 1) não cita '" + p + "'");
    });
    soNoZero.forEach(p => {
      if (t.indexOf(p) >= 0)
        throw new Error("'" + qid + "' publica '" + p + "', que só existe no nível 0 — leu nível fixo");
    });
    medidos++;
  });
  if (medidos !== ALVOS.length) vac("(d)", "só " + medidos + " de " + ALVOS.length + " alvos medidos");
  return true;
});

/* ==========================================================================
   C6 · ANCORAGEM DECLARADA POR BLOCO
   O aviso do `EA-48` foi escrito quando TODOS os blocos partiam da capability.
   Com duas origens ele mente para metade: o bloco derivado É a ancoragem
   canônica e não diverge dela. Aviso que aparece em tudo não distingue nada.
   ========================================================================== */
T("D021-ANC1", "cada bloco declara a própria ancoragem, e só o bloco da tabela repete o aviso de divergência", () => {
  const { w, d } = boot({});
  const rel = papel(w, d);
  const TAB = tabela(w);
  const todos = blocos(rel);
  if (todos.length < 10) vac("(a)", "só " + todos.length + " blocos — sem as duas origens não há o que distinguir");
  let curados = 0, derivados = 0;
  todos.forEach(b => {
    const qid = qidDo(b);
    const anc = b.getAttribute("data-pr-gap-ancora");
    if (anc !== "capability" && anc !== "nivel")
      throw new Error("bloco de '" + qid + "' sem ancoragem declarada (data-pr-gap-ancora='" + anc + "')");
    const esperada = TAB[qid] ? "capability" : "nivel";
    if (anc !== esperada)
      throw new Error("bloco de '" + qid + "' declara ancoragem '" + anc + "', a origem dele é '" + esperada + "'");
    const temAviso = !!b.querySelector("[data-pr-gap-fonte]");
    if (esperada === "capability") {
      curados++;
      if (!temAviso) throw new Error("curado '" + qid + "' perdeu o aviso de divergência do EA-48");
    } else {
      derivados++;
      if (temAviso)
        throw new Error("derivado '" + qid + "' repete o aviso de divergência — ele É a ancoragem canônica");
    }
  });
  if (!curados || !derivados)
    vac("(b)", "as duas origens precisam estar presentes — curados " + curados + ", derivados " + derivados);
  return true;
});

/* ==========================================================================
   C7 · O APOIO CHEGA AO RELATÓRIO REAL (errata E2)
   Medido pelo caminho do papel, disparado por `beforeprint` — nunca por
   chamada direta ao builder (`EA-26`). É onde o `EA-56` mediu o problema e é
   o artefato que o cliente recebe.
   ========================================================================== */
T("D021-PAR1", "no relatório montado por beforeprint, todo gap com candidato traz seu caminho de apoio", () => {
  let configuracoes = 0;
  [false, true].forEach(ctx => {
    const { w, d } = boot({ contexto: ctx });
    const rel = papel(w, d);
    const gaps = qidsComGap(w);
    if (!gaps.length) vac("(a)", (ctx ? "com" : "sem") + " contexto: relatório sem gaps");
    const comBloco = blocos(rel).map(qidDo);
    const faltam = gaps.filter(qid => candidatos(w, qid, nivelDe(w, qid)).length && comBloco.indexOf(qid) < 0);
    if (faltam.length)
      throw new Error((ctx ? "com" : "sem") + " contexto: " + faltam.length + " gap(s) sem apoio NO PAPEL — " +
                      faltam.join(", "));
    configuracoes++;
  });
  if (configuracoes !== 2) vac("(b)", "as duas configurações de contexto precisam ser medidas");
  return true;
});

/* ==========================================================================
   C8 · CONTEXTO NÃO DECLARADO CONTINUA "VALIDAR ADERÊNCIA"
   A moldura honesta quando o cliente não declarou ambiente. O ramo derivado
   não pode virar recomendação onde o curado é ressalva.
   ========================================================================== */
T("D021-CTX1", "sem contexto declarado todo bloco traz a ressalva de validação, curado ou derivado", () => {
  const { w, d } = boot({});
  const rel = papel(w, d);
  const todos = blocos(rel);
  if (todos.length < 10) vac("(a)", "só " + todos.length + " blocos — cobertura ausente");
  const semRessalva = todos.filter(b => !/validar aderência/i.test(txt(b))).map(qidDo);
  if (semRessalva.length)
    throw new Error(semRessalva.length + " bloco(s) sem a ressalva com contexto NÃO declarado: " +
                    semRessalva.join(", ") + " — contexto ausente nunca vira recomendação");
  return true;
});

/* ============================== fecho ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nD021 COBERTURA: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
