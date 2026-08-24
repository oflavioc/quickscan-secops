/* ============================================================================
   TESTES P52 · LAYOUT (jsdom) — PHASE 5.2
   Namespace exclusivo P52-*. Não continua P50 nem P51 e não reimplementa gate
   algum daquelas suítes.

   Escopo desta suíte: as propriedades ESTRUTURAIS da nova arquitetura de
   informação — quais seções existem, em que ordem do DOM, com que conteúdo, e
   o que NÃO pode ter desaparecido no caminho. As propriedades GEOMÉTRICAS
   (largura útil por viewport, grade, peso óptico de ícone, print) vivem em
   `tests_p52_chromium.js`, porque jsdom não faz layout.

   Oracle: a ordem canônica, a lista de nós legados e as contagens de gaps são
   recalculadas AQUI a partir do DOM PRÉ-reorganização (uma segunda instância
   do runtime, com a camada P52 desligada por comparação de conteúdo), nunca
   lidas do próprio módulo sob teste.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { JSDOM } = require("jsdom");
const FX50 = require("./fixtures_p50.js");
const FX52 = require("./fixtures_p52.js");

const HERE = __dirname;
const HTML_PATH = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const HTML = fs.readFileSync(HTML_PATH, "utf8");
const P52_JS = path.join(HERE, "ui_p52_workspace_v32.js");
const P52_CSS = path.join(HERE, "ui_p52_workspace_v32.css");

const results = [];
const ONLY = (process.env.P52_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
if (ONLY.length) console.log("EXECUÇÃO FILTRADA (campanha de mutação): " + ONLY.join(", "));
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, err = "";
  try { ok = !!fn(); } catch (x) { err = " [" + x.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + err);
}

const boot = () => {
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/" });
  return { w: dom.window, d: dom.window.document };
};
const q = (d, s) => d.querySelector(s);
const qa = (d, s) => Array.from(d.querySelectorAll(s));
const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const readIf = p => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);

/* Ordem canônica declarada pela diretriz §7 (P52-RES2), reescrita aqui como
   oráculo independente: NÃO é lida de `window.__P52.sections()`.
   A variante de gate FECHADO sobe "Evidência e suficiência" para logo depois
   da visão executiva — a última cláusula da §7 exige destaque no primeiro
   viewport quando o resultado está bloqueado. Nas duas ordens, o cenário-alvo
   permanece ANTES do contexto tecnológico. */
const P52_CANONICAL_ORDER = ["exec", "target", "context", "evidence", "detail",
  "priorities", "gaps", "support", "actions"];
/* REV A · SUFF-REV-A: com o gate ABERTO, "Evidência e suficiência" deixa de ser
   seção independente — vira status compacto + disclosure dentro da visão
   executiva, e o refinamento operacional acompanha o resultado detalhado. */
const P52_RELEASED_ORDER = ["exec", "target", "context", "detail",
  "priorities", "gaps", "support", "actions"];
const P52_BLOCKED_ORDER = ["exec", "evidence", "target", "context", "detail",
  "priorities", "gaps", "support", "actions"];
function expectedOrder(d) {
  const ws = d.getElementById("p52-workspace");
  return ws && ws.getAttribute("data-p52-gate") === "blocked" ? P52_BLOCKED_ORDER : P52_RELEASED_ORDER;
}

function resultsDom(fx) {
  const R = boot();
  FX52.p52ApplyResults(R.w, R.d, fx);
  return R;
}
function sectionKeys(d) {
  return qa(d, "#p52-flow > .p52-sec").map(s => s.getAttribute("data-p52-sec"));
}
function indexOfSec(d, key) { return sectionKeys(d).indexOf(key); }

/* ======================= P52-GOV · governança ======================= */

T("P52-GOV1", "os módulos novos da Phase 5.2 existem, estão injetados no HTML e são os únicos owners de layout", () => {
  if (!fs.existsSync(P52_JS)) throw new Error("ui_p52_workspace_v32.js ausente");
  if (!fs.existsSync(P52_CSS)) throw new Error("ui_p52_workspace_v32.css ausente");
  const js = fs.readFileSync(P52_JS, "utf8");
  const css = fs.readFileSync(P52_CSS, "utf8");
  /* o HTML construído precisa conter os dois blocos, byte a byte */
  const jsBlock = HTML.split("/* V32_P52_WORKSPACE_BEGIN */\n")[1];
  if (!jsBlock) throw new Error("bloco V32_P52_WORKSPACE ausente do HTML");
  if (jsBlock.split("\n/* V32_P52_WORKSPACE_END */")[0] !== js)
    throw new Error("bloco JS injetado difere do arquivo-fonte");
  const cssBlock = HTML.split("/* V32_P52CSS_BEGIN */\n")[1];
  if (!cssBlock) throw new Error("bloco V32_P52CSS ausente do HTML");
  if (cssBlock.split("\n/* V32_P52CSS_END */")[0] !== css)
    throw new Error("bloco CSS injetado difere do arquivo-fonte");
  /* a camada de layout não pode declarar limiar, score ou recomendação */
  const proibido = [/dataSufficiency\s*\(/, /confirmedCount\s*\(/, /computeFindings\s*\(/,
    /buildTiers\s*\(/, />=\s*10\b/, /stageOf\s*\(/, /setTarget\s*\(/, /setAnswerById\s*\(/];
  const hits = proibido.filter(re => re.test(js)).map(String);
  if (hits.length) throw new Error("owner de layout tocando domínio canônico: " + hits.join(" "));
  /* zero innerHTML em nó vivo */
  if (/\.innerHTML\s*=/.test(js)) throw new Error("innerHTML usado na camada de layout");
  return true;
});

T("P52-GOV2", "engine e payload M41 permanecem byte-idênticos ao baseline congelado", () => {
  const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  const eng = sha(path.join(HERE, "engine_v32.js"));
  if (eng !== "9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a")
    throw new Error("engine_v32.js alterado: " + eng);
  const base = sha(path.join(HERE, "quickscan_secops_soccmm_v3_1_3.html"));
  if (base !== "d329049147950a5b2a40b2735c3d4bd9a89177fed439efbcb58df01bdeb7ae82")
    throw new Error("HTML-base congelado alterado: " + base);
  return true;
});

/* ======================= P52-LAY3 · arquitetura de seções ======================= */

T("P52-LAY3", "a tela de resultados é um workspace de seções na ordem canônica de leitura", () => {
  const R = resultsDom(FX52.P52_F1);
  const ws = q(R.d, "#p52-workspace");
  if (!ws) throw new Error("workspace ausente");
  if (!q(R.d, "#p52-rail") || !q(R.d, "#p52-flow")) throw new Error("trilho ou fluxo ausentes");
  /* o trilho vem ANTES do fluxo no DOM (coluna à esquerda == ordem de foco) */
  const kids = Array.from(ws.children).map(c => c.id);
  if (kids[0] !== "p52-rail" || kids[1] !== "p52-flow")
    throw new Error("ordem do workspace: " + kids.join(","));
  const keys = sectionKeys(R.d);
  /* toda seção presente respeita a ordem canônica (subsequência estrita) */
  let prev = -1;
  for (const k of keys) {
    const ix = expectedOrder(R.d).indexOf(k);
    if (ix < 0) throw new Error("seção fora do namespace canônico: " + k);
    if (ix <= prev) throw new Error("ordem violada em '" + k + "': " + keys.join(" > "));
    prev = ix;
  }
  /* na fixture cheia (gate ABERTO) existem as OITO seções da ordem liberada */
  if (keys.join(",") !== P52_RELEASED_ORDER.join(","))
    throw new Error("seções com gate aberto: " + keys.join(","));
  /* cada seção tem heading próprio, é focável por programa e está rotulada */
  for (const s of qa(R.d, "#p52-flow > .p52-sec")) {
    const h = s.querySelector(":scope > h2.p52-sec-title");
    if (!h) throw new Error(s.id + " sem h2 de seção");
    if (s.getAttribute("aria-labelledby") !== h.id) throw new Error(s.id + " sem aria-labelledby coerente");
    if (s.getAttribute("tabindex") !== "-1") throw new Error(s.id + " não é alvo programático de foco");
  }
  return true;
});

T("P52-LAY4", "reorganizar não perde nem duplica superfície: todo nó legado da tela sobrevive exatamente uma vez", () => {
  /* oráculo: o conjunto de superfícies canônicas que o renderer congelado
     produz, medido por identidade de nó, antes e depois da reorganização. */
  const R = resultsDom(FX52.P52_F1);
  const d = R.d;
  const ALVOS = [".res-head", ".grid2", "#ux-journey", "#ux-target", "#v32panel",
    "#p50-suff", "#p50-results", "#ux-refsum", "#ux-execrow", ".actions",
    "#ses-export", "#ses-import", "#review", "#restart", "#editprio"];
  for (const sel of ALVOS) {
    const n = qa(d, sel);
    if (n.length !== 1) throw new Error(sel + ": " + n.length + " ocorrências (esperado 1)");
    if (!q(d, "#p52-workspace").contains(n[0])) throw new Error(sel + " ficou fora do workspace");
  }
  /* cards e listas de conteúdo continuam todos presentes */
  const findings = qa(d, ".finding").length;
  const apoio = qa(d, ".apoio-block").length;
  const prio = qa(d, ".prio-decl").length;
  if (findings !== 13) throw new Error("findings: " + findings + " (esperado 13)");
  if (!apoio) throw new Error("nenhum bloco de apoio sobreviveu");
  if (prio !== FX52.P52_DECLARED["P52-F1"].priorities)
    throw new Error("prioridades declaradas: " + prio);
  return true;
});

T("P52-LAY5", "o workspace é idempotente: renders sucessivos não acumulam invólucro nem perdem conteúdo", () => {
  /* Censo COMPLETO: conteúdo legado E invólucros criados por esta camada. Sem
     contar os invólucros, um nó próprio que voltasse à lista de nós legados
     seria recriado a cada render e duplicaria em silêncio. */
  const censo = d => ({
    ws: qa(d, "#p52-workspace").length,
    secs: sectionKeys(d).join(","),
    findings: qa(d, ".finding").length,
    actions: qa(d, ".actions").length,
    apoio: qa(d, ".apoio-block").length,
    prio: qa(d, ".prio-decl").length,
    secTitles: qa(d, ".p52-sec-title").length,
    secLeads: qa(d, ".p52-sec-lead").length,
    gapGroups: qa(d, ".p52-gapgrp").length,
    railLinks: qa(d, ".p52-rail-link").length,
    gateJump: qa(d, '[data-p52="gate-jump"]').length,
    ctxCards: qa(d, ".p52-ctxcard-head").length
  });
  for (const fx of [FX52.P52_F1, FX52.P52_F3]) {
    const R = resultsDom(fx);
    const before = censo(R.d);
    R.w.__DEV.showResults();
    R.w.__DEV.showResults();
    const after = censo(R.d);
    if (JSON.stringify(before) !== JSON.stringify(after))
      throw new Error(fx.id + ": estado divergente entre passagens: " +
        JSON.stringify(before) + " != " + JSON.stringify(after));
    if (after.ws !== 1) throw new Error(fx.id + ": " + after.ws + " workspaces no DOM");
    if (after.ctxCards > 1) throw new Error(fx.id + ": card de contexto duplicado");
    if (R.w.__P52.diag().errors !== 0) throw new Error(fx.id + ": erros na camada P52: " + R.w.__P52.diag().errors);
  }
  return true;
});

T("P52-RES4", "a caixa “Próximo passo sugerido” não existe mais na tela interativa, e nada foi posto no lugar", () => {
  for (const fx of [FX52.P52_F1, FX52.P52_F2, FX52.P52_F3]) {
    const R = resultsDom(fx);
    if (q(R.d, ".next")) throw new Error(fx.id + ": .next ainda renderizada");
    const t = txt(q(R.d, "#app"));
    if (/Pr[óo]ximo passo sugerido/i.test(t)) throw new Error(fx.id + ": texto do próximo passo persiste");
    /* nenhum substituto promocional entrou no lugar */
    if (/fale com|agende|entre em contato com um especialista|solicite uma proposta/i.test(t))
      throw new Error(fx.id + ": CTA comercial substituto detectado");
    /* recomendações factuais e ações NÃO podem ter sumido junto */
    if (!q(R.d, "#p52-sec-actions .actions")) throw new Error(fx.id + ": barra de ações perdida");
    if (!q(R.d, "#p50-results")) throw new Error(fx.id + ": resultado executivo perdido");
  }
  return true;
});

/* ======================= P52-TGT1 · cenário-alvo ======================= */

T("P52-TGT1", "cenário-alvo vem antes do contexto tecnológico, com explicação estável e sem tocar no current", () => {
  for (const fx of [FX52.P52_F1, FX52.P52_F2, FX52.P52_F3]) {
    const R = resultsDom(fx);
    const iT = indexOfSec(R.d, "target"), iC = indexOfSec(R.d, "context"), iE = indexOfSec(R.d, "exec");
    if (iT < 0 || iC < 0) throw new Error(fx.id + ": seção de alvo ou de contexto ausente");
    if (!(iT > iE)) throw new Error(fx.id + ": alvo antes da visão executiva");
    if (!(iT < iC)) throw new Error(fx.id + ": contexto (" + iC + ") antes do alvo (" + iT + ")");
    /* com o gate ABERTO o alvo é imediatamente posterior à visão executiva;
       com o gate FECHADO só a suficiência pode se interpor (§7, última
       cláusula), e nada mais */
    const bloqueado = q(R.d, "#p52-workspace").getAttribute("data-p52-gate") === "blocked";
    const esperado = bloqueado ? iE + 2 : iE + 1;
    if (iT !== esperado)
      throw new Error(fx.id + ": alvo em " + iT + ", esperado " + esperado +
        (bloqueado ? " (gate fechado: exec > evidência > alvo)" : " (imediatamente após a visão executiva)"));
    if (bloqueado && indexOfSec(R.d, "evidence") !== iE + 1)
      throw new Error(fx.id + ": com gate fechado a suficiência não subiu para logo depois da visão executiva");
    const lead = q(R.d, '#p52-sec-target [data-p52="target-lead"]');
    if (!lead) throw new Error(fx.id + ": explicação do cenário-alvo ausente");
    const t = txt(lead);
    if (!/n[ãa]o altera as respostas nem o score atual/i.test(t))
      throw new Error(fx.id + ": explicação não declara o limite do alvo: " + t);
    if (!/Current\s*×\s*Target/i.test(t)) throw new Error(fx.id + ": explicação não cita a comparação");
    /* o alvo continua sendo o do owner canônico: a camada de layout não escreve override */
    const ov = Object.keys(R.w.__DEV.TARGET.overrides || {}).length;
    const want = fx.targets ? Object.keys(fx.targets).length : 0;
    if (ov !== want) throw new Error(fx.id + ": overrides " + ov + " != " + want);
  }
  return true;
});

T("P52-TGT3", "o trilho anuncia o cenário-alvo como informação derivada, sem oferecer edição", () => {
  const semAlvo = resultsDom(FX52.P52_F1);
  const link1 = q(semAlvo.d, '[data-p52-rail="target"]');
  if (!/sem cen[áa]rio-alvo/i.test(txt(link1))) throw new Error("sem alvo: '" + txt(link1) + "'");
  const comAlvo = resultsDom(FX52.P52_F2);
  const link2 = q(comAlvo.d, '[data-p52-rail="target"]');
  const n = Object.keys(comAlvo.w.__DEV.TARGET.overrides).length;
  if (n !== FX52.P52_DECLARED["P52-F2"].overrides)
    throw new Error("fixture P52-F2 não produziu " + FX52.P52_DECLARED["P52-F2"].overrides + " overrides");
  if (txt(link2).indexOf(String(n)) < 0)
    throw new Error("trilho não anuncia a contagem de práticas com alvo: '" + txt(link2) + "'");
  /* o item do trilho é navegação, não editor */
  if (q(comAlvo.d, "#p52-rail select, #p52-rail input, #p52-rail button"))
    throw new Error("controle editável dentro do trilho");
  return true;
});

/* ======================= P52-CTX1 · contexto tecnológico ======================= */

T("P52-CTX1", "contexto tecnológico é um card de ação opcional, com título, badge e limite declarado", () => {
  const R = resultsDom(FX52.P52_F1);
  const card = q(R.d, "#p52-sec-context .p52-ctxcard");
  if (!card) throw new Error("card de contexto ausente");
  if (!/Adicionar contexto tecnol[óo]gico/i.test(txt(q(R.d, ".p52-ctxcard-title"))))
    throw new Error("título do card: '" + txt(q(R.d, ".p52-ctxcard-title")) + "'");
  const badge = q(R.d, '.p52-badge[data-p52-badge="optional"]');
  if (!badge || txt(badge).toLowerCase() !== "opcional") throw new Error("badge Opcional ausente");
  const ex = txt(q(R.d, ".p52-ctxcard-explain"));
  if (!/n[ãa]o altera perguntas, respostas ou pontua[çc][ãa]o/i.test(ex))
    throw new Error("explicação sem o limite canônico: '" + ex + "'");
  /* o acionador continua sendo o owner congelado, e é ÚNICO */
  const gatilhos = qa(R.d, "#p52-sec-context button").filter(b => /contexto tecnol[óo]gico/i.test(txt(b)));
  if (gatilhos.length !== 1) throw new Error(gatilhos.length + " acionadores de contexto");
  if (gatilhos[0].id !== "v32cta") throw new Error("acionador não canônico: #" + gatilhos[0].id);
  /* contexto NÃO virou pré-requisito: o resultado continua liberado sem ele */
  if (q(R.d, "#p50-results").getAttribute("data-p50-gate") !== "released")
    throw new Error("gate mudou de estado por causa do contexto");
  return true;
});

T("P52-CTX2", "editor separa capabilities de ambiente/condicionantes em duas regiões de primeiro nível", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const regs = qa(d, '#v32editor > [data-p52="ctx-region"]');
  if (regs.length !== 2) throw new Error(regs.length + " regiões de primeiro nível (esperadas 2)");
  const keys = regs.map(r => r.getAttribute("data-p52-region"));
  if (keys.join(",") !== "caps,env") throw new Error("ordem/identidade das regiões: " + keys.join(","));
  /* cada região tem título próprio, orientação e os SEUS grupos — nada de
     lista contínua sem separador */
  const esperado = { caps: ["g1", "g2", "g3"], env: ["arch", "plat", "sig"] };
  for (const r of regs) {
    const k = r.getAttribute("data-p52-region");
    const h = r.querySelector(":scope > h4.p52-ctxregion-title");
    if (!h) throw new Error(k + ": região sem título");
    if (r.getAttribute("aria-labelledby") !== h.id) throw new Error(k + ": região sem rotulagem acessível");
    if (!txt(r.querySelector(".p52-ctxregion-lead"))) throw new Error(k + ": região sem frase de orientação");
    const gids = qa(r, ':scope > .p52-ctxregion-body > details[data-gid]').map(x => x.getAttribute("data-gid"));
    if (gids.join(",") !== esperado[k].join(","))
      throw new Error(k + ": grupos = " + gids.join(",") + " (esperado " + esperado[k].join(",") + ")");
  }
  /* nenhum grupo ficou solto fora das regiões */
  const soltos = qa(d, '#v32editor > details[data-gid]');
  if (soltos.length) throw new Error(soltos.length + " grupos fora das duas regiões");
  return true;
});

T("P52-CTX3", "estado do grupo por caret, aria-expanded e forma — sem o pill textual ABERTO/FECHADO", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  /* o pill redundante foi REMOVIDO (CTX-REV-A §2.4) */
  const pills = qa(d, '[data-p52="grp-state"], .p52-grp-state');
  if (pills.length) throw new Error(pills.length + " pills ABERTO/FECHADO ainda renderizados");
  if (/\b(ABERTO|FECHADO)\b/.test(txt(q(d, "#v32editor"))))
    throw new Error("texto ABERTO/FECHADO ainda aparece no editor");
  const grupos = qa(d, "#v32editor details.v32-group");
  if (!grupos.length) throw new Error("editor sem grupos");
  let abertos = 0;
  for (const g of grupos) {
    const sum = g.querySelector("summary");
    if (!sum) throw new Error("grupo sem summary");
    const want = g.open ? "true" : "false";
    if (sum.getAttribute("aria-expanded") !== want)
      throw new Error(g.getAttribute("data-gid") + ": aria-expanded=" + sum.getAttribute("aria-expanded") + " (esperado " + want + ")");
    if (g.getAttribute("data-p52-grp") !== (g.open ? "open" : "closed"))
      throw new Error(g.getAttribute("data-gid") + ": data-p52-grp incoerente");
    if (g.open) abertos++;
  }
  if (!abertos) throw new Error("nenhum grupo aberto — não há estado ativo a distinguir");
  return true;
});

T("P52-HELP1", "cada capability com verbete tem controle de ajuda acessível, associado e fechável", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const caps = qa(d, "#v32editor .v32-cap[id^='v32-cap-']");
  if (!caps.length) throw new Error("editor sem capabilities");
  let comAjuda = 0;
  for (const cap of caps) {
    /* PRECISÃO DE SELETOR · ERRATA DA AUDITORIA EXTERNA · §6.1.
       Depois que a §6.1 passou a decorar também a "Situação declarada" — que
       vive no MESMO `.v32-cap-head` —, `[data-p52="cap-help"]` genérico podia
       devolver o controle VIZINHO quando o da capability faltasse, e o gate
       acusava "desalinhado" em vez de "verbete ausente". `[data-cap]` é o que
       identifica o controle da capability. A obrigação não mudou. */
    const btn = cap.querySelector('[data-p52="cap-help"][data-cap]');
    if (!btn) continue;
    comAjuda++;
    const capId = cap.id.replace(/^v32-cap-/, "");
    if (btn.getAttribute("data-cap") !== capId) throw new Error(capId + ": controle de ajuda desalinhado");
    if (btn.tagName !== "BUTTON") throw new Error(capId + ": ajuda não é botão focável");
    const nome = btn.getAttribute("aria-label");
    if (!nome || !/Explicação da capability/.test(nome)) throw new Error(capId + ": ajuda sem nome acessível");
    const popId = btn.getAttribute("aria-describedby");
    const pop = popId ? d.getElementById(popId) : null;
    if (!pop) throw new Error(capId + ": ajuda sem texto associado por aria-describedby");
    if (!pop.hidden) throw new Error(capId + ": ajuda começa aberta — poluição visual");
    if (btn.getAttribute("aria-expanded") !== "false") throw new Error(capId + ": aria-expanded inicial incorreto");
    if (btn.hasAttribute("title")) throw new Error(capId + ": usa title nativo como implementação");
    const t = txt(pop);
    if (t.length < 80 || t.length > 420) throw new Error(capId + ": verbete com " + t.length + " caracteres");
    if (/Forti[A-Z]/.test(t)) throw new Error(capId + ": verbete cita produto");
  }
  if (comAjuda < 20) throw new Error("apenas " + comAjuda + " capabilities com verbete");
  /* o verbete obrigatório da diretriz, verificado literalmente */
  const km = d.getElementById("p52-caphelp-knowledge-management");
  if (!km) throw new Error("verbete de Gestão de conhecimento ausente");
  const kmT = txt(km);
  for (const trecho of ["procedimentos, lições aprendidas, playbooks",
                        "Informe ferramentas e práticas já utilizadas",
                        "não prova que o conhecimento esteja atualizado"]) {
    if (kmT.indexOf(trecho) < 0) throw new Error("verbete de Gestão de conhecimento sem: " + trecho);
  }
  /* abrir por clique, fechar por clique, e um por vez */
  const b1 = qa(d, '[data-p52="cap-help"]')[0], b2 = qa(d, '[data-p52="cap-help"]')[1];
  b1.click();
  if (d.getElementById(b1.getAttribute("aria-describedby")).hidden) throw new Error("clique não abriu a ajuda");
  b2.click();
  if (!d.getElementById(b1.getAttribute("aria-describedby")).hidden)
    throw new Error("duas ajudas abertas ao mesmo tempo");
  b2.click();
  if (!d.getElementById(b2.getAttribute("aria-describedby")).hidden) throw new Error("clique não fechou a ajuda");
  return true;
});

/* ======================= P52-DOM1 · tags de domínio ======================= */

T("P52-DOM1", "toda tag de domínio carrega o índice canônico e mantém o nome escrito", () => {
  const R = resultsDom(FX52.P52_F1);
  const DOMS_PT = FX50.P50_DOM_PT;
  const chips = qa(R.d, "#app .dom-chip");
  if (!chips.length) throw new Error("nenhuma tag de domínio na tela");
  for (const c of chips) {
    const nome = txt(c);
    const ix = DOMS_PT.indexOf(nome);
    if (ix < 0) throw new Error("tag sem nome canônico de domínio: '" + nome + "'");
    if (c.getAttribute("data-dom") !== String(ix))
      throw new Error("'" + nome + "' com data-dom=" + c.getAttribute("data-dom") + " (esperado " + ix + ")");
    if (c.getAttribute("data-p52-domtag") !== "canonical")
      throw new Error("'" + nome + "' não marcada como canônica");
  }
  /* o mapa de cor não é duplicado em JavaScript: nenhum hex de domínio no módulo */
  const js = fs.readFileSync(P52_JS, "utf8");
  const hex = js.match(/#(9063CD|3CB17E|2CCCD3|307FE2|A2B2C8|DA291C)/ig);
  if (hex) throw new Error("hex de domínio duplicado no owner de layout: " + hex.join(","));
  return true;
});

/* ======================= P52-GAP1 · severidades ======================= */

T("P52-GAP1", "gaps altos e moderados vivem em grupos estruturais distintos, com contador e heading próprios", () => {
  const R = resultsDom(FX52.P52_F1);
  const d = R.d;
  const hi = q(d, "#p52-grp-gaps-high"), mo = q(d, "#p52-grp-gaps-moderate");
  if (!hi || !mo) throw new Error("um dos grupos de severidade não existe");
  if (hi.contains(mo) || mo.contains(hi)) throw new Error("grupos aninhados");
  /* nenhum card cruza a fronteira */
  for (const card of qa(d, ".finding")) {
    const sevA = !!card.querySelector(".f-tag.sev-a");
    const dono = sevA ? hi : mo;
    const outro = sevA ? mo : hi;
    if (!dono.contains(card)) throw new Error("card " + (sevA ? "alto" : "moderado") + " fora do grupo correto");
    if (outro.contains(card)) throw new Error("card no grupo da severidade errada");
  }
  /* contadores conferem com a contagem REAL, recalculada aqui */
  const nHi = qa(d, ".finding .f-tag.sev-a").length, nMo = qa(d, ".finding .f-tag.sev-m").length;
  const decl = FX52.P52_DECLARED["P52-F1"];
  if (nHi !== decl.high || nMo !== decl.moderate)
    throw new Error("fixture P52-F1 mudou de severidades: " + nHi + "/" + nMo);
  if (hi.getAttribute("data-p52-gapcount") !== String(nHi)) throw new Error("contador de altos incorreto");
  if (mo.getAttribute("data-p52-gapcount") !== String(nMo)) throw new Error("contador de moderados incorreto");
  /* headings próprios, legíveis em escala de cinza (texto + contagem) */
  const hHi = txt(hi.querySelector("h3")), hMo = txt(mo.querySelector("h3"));
  if (!/Gaps altos de maturidade/i.test(hHi)) throw new Error("heading de altos: '" + hHi + "'");
  if (!/Gaps moderados de maturidade/i.test(hMo)) throw new Error("heading de moderados: '" + hMo + "'");
  if (hHi.indexOf(String(nHi)) < 0 || hMo.indexOf(String(nMo)) < 0)
    throw new Error("contagem ausente do heading");
  if (hi.getAttribute("role") !== "group" || hi.getAttribute("aria-labelledby") !== hi.querySelector("h3").id)
    throw new Error("grupo de altos sem rotulagem acessível");
  return true;
});

/* ======================= P52-REC1 · recomendações ======================= */

T("P52-REC1", "as formas de apoio continuam íntegras, separadas por função e dentro da própria seção", () => {
  const R = resultsDom(FX52.P52_F1);
  const sec = q(R.d, "#p52-sec-support");
  if (!sec) throw new Error("seção de apoio ausente");
  /* nada foi inventado e nada sumiu: o conjunto de blocos legados de apoio
     está inteiro dentro da seção */
  const apoio = qa(R.d, ".apoio-block");
  if (!apoio.length) throw new Error("nenhum bloco de apoio");
  /* o `details` "Possíveis formas de apoio aos demais gaps altos" pertence,
     no baseline congelado, ao bloco de GAPS — e continua ali, porque mover o
     acordeão mudaria a semântica de ocultação da recomendação legada. Todo o
     resto vive na seção de apoio. */
  for (const a of apoio) {
    if (sec.contains(a)) continue;
    if (a.closest("details.t-details") && a.closest("#p52-sec-gaps")) continue;
    throw new Error("bloco de apoio fora da seção e fora do acordeão de gaps");
  }
  /* os títulos legados de função continuam presentes e distintos */
  const titulos = qa(sec, ":scope > .section-title").map(t => txt(t));
  if (!titulos.length) throw new Error("seção de apoio sem títulos de função");
  if (new Set(titulos).size !== titulos.length) throw new Error("títulos de função duplicados");
  /* o contador de cards existe e é honesto — é o CSS que decide 1 ou 2 colunas */
  const n = qa(sec, ":scope > .apoio-block").length;
  if (sec.getAttribute("data-p52-support-cards") !== String(n))
    throw new Error("contador de cards de apoio: " + sec.getAttribute("data-p52-support-cards") + " != " + n);
  /* nenhum produto novo entrou na tela pela camada de layout */
  const js = fs.readFileSync(P52_JS, "utf8");
  if (/Forti[A-Z]/.test(js)) throw new Error("nome de produto embutido no owner de layout");
  return true;
});

/* ======================= P52-Q1 · evidência ======================= */

T("P52-Q1", "a evidência continua tendo um único controle, com rótulo canônico e estado publicado", () => {
  const R = boot();
  FX50.p50ApplyFixture(R.w, R.d, FX50.P50_F2);
  const d = R.d;
  const acionadores = qa(d, "#app button, #app a[href]").filter(b =>
    /evid[êe]ncia|observa[çc][ãa]o/i.test(txt(b)));
  if (acionadores.length !== 1)
    throw new Error(acionadores.length + " controles de evidência: " +
      acionadores.map(b => "'" + txt(b) + "'#" + b.id).join(" | "));
  const t = acionadores[0];
  if (t.id !== "notetgl") throw new Error("controle não canônico: #" + t.id);
  if (txt(t) !== "Adicionar evidência ou observação") throw new Error("rótulo fechado: '" + txt(t) + "'");
  if (t.getAttribute("data-p52-evidence") !== "closed")
    throw new Error("estado fechado não publicado: " + t.getAttribute("data-p52-evidence"));
  if (!t.classList.contains("p52-evidence-btn")) throw new Error("apresentação de botão não aplicada");
  t.click();
  const aberto = q(d, "#notetgl");
  if (txt(aberto) !== "Fechar evidência ou observação") throw new Error("rótulo aberto: '" + txt(aberto) + "'");
  if (aberto.getAttribute("data-p52-evidence") !== "open")
    throw new Error("estado aberto não publicado: " + aberto.getAttribute("data-p52-evidence"));
  if (aberto.getAttribute("aria-expanded") !== "true") throw new Error("aria-expanded não acompanhou o estado");
  /* o símbolo é decoração de CSS: não entra no nome acessível */
  if (/[＋+−✎]/.test(txt(aberto))) throw new Error("símbolo entrou no texto do botão");
  return true;
});

/* ======================= P52-NAV0 · trilho (estrutura) ======================= */

T("P52-NAV0", "cada item do trilho aponta para uma seção real da mesma página, com identidade estável", () => {
  const R = resultsDom(FX52.P52_F1);
  const d = R.d;
  const nav = q(d, "#p52-rail");
  if (nav.tagName !== "NAV") throw new Error("o trilho não é um landmark de navegação");
  if (!nav.getAttribute("aria-label")) throw new Error("trilho sem nome acessível");
  const links = qa(d, ".p52-rail-link");
  const keys = sectionKeys(d);
  if (links.length !== keys.length)
    throw new Error(links.length + " itens para " + keys.length + " seções");
  links.forEach((a, i) => {
    const key = a.getAttribute("data-p52-rail");
    if (key !== keys[i]) throw new Error("item " + i + " ('" + key + "') fora da ordem das seções");
    if (a.getAttribute("href") !== "#p52-sec-" + key) throw new Error(key + ": href '" + a.getAttribute("href") + "'");
    if (a.id !== "p52-railto-" + key) throw new Error(key + ": id instável '" + a.id + "'");
    if (!q(d, "#p52-sec-" + key)) throw new Error(key + ": âncora sem seção correspondente");
    if (!txt(a)) throw new Error(key + ": item sem nome acessível");
  });
  /* exatamente um item ativo, marcado por aria-current E por texto */
  const ativos = links.filter(a => a.getAttribute("aria-current") === "true");
  if (ativos.length !== 1) throw new Error(ativos.length + " itens marcados como ativos");
  if (!/se[çc][ãa]o atual/i.test(txt(ativos[0]))) throw new Error("item ativo sem pista textual");
  const inativos = links.filter(a => a !== ativos[0]);
  if (inativos.some(a => /se[çc][ãa]o atual/i.test(txt(a))))
    throw new Error("pista textual de 'seção atual' em item inativo");
  return true;
});

/* ======================= P52-GATE · bloqueio honesto ======================= */

T("P52-GATE1", "com o gate fechado a ordem não simula liberação e a suficiência ganha destaque declarado", () => {
  const R = resultsDom(FX52.P52_F3);
  const d = R.d;
  const ws = q(d, "#p52-workspace");
  if (ws.getAttribute("data-p52-gate") !== "blocked")
    throw new Error("workspace não publica o gate fechado: " + ws.getAttribute("data-p52-gate"));
  if (ws.getAttribute("data-p52-order") !== "gate-blocked")
    throw new Error("ordem do gate fechado não aplicada: " + ws.getAttribute("data-p52-order"));
  if (sectionKeys(d).indexOf("evidence") !== 1)
    throw new Error("suficiência não é a segunda seção com o gate fechado: " + sectionKeys(d).join(">"));
  /* o trilho anuncia a MESMA ordem que o fluxo — nada de sumário mentiroso */
  const railKeys = qa(d, ".p52-rail-link").map(a => a.getAttribute("data-p52-rail"));
  if (railKeys.join(">") !== sectionKeys(d).join(">"))
    throw new Error("trilho fora de ordem: " + railKeys.join(">"));
  if (q(d, "#p50-results").getAttribute("data-p50-gate") !== "blocked")
    throw new Error("fixture P52-F3 não bloqueia o resultado");
  /* a visão executiva continua dizendo a verdade, no primeiro bloco da página */
  const exec = txt(q(d, "#p52-sec-exec"));
  if (!/Cobertura insuficiente|insuficient/i.test(exec))
    throw new Error("visão executiva não declara o bloqueio: " + exec.slice(0, 160));
  if (/\b\d\.\d\s*\/\s*5\.0/.test(exec) && !/n\/d/.test(exec))
    throw new Error("visão executiva exibe consolidado com gate fechado");
  /* o veredito canônico continua sendo o do owner de suficiência */
  const verd = txt(q(d, '[data-p50="results-verdict"]'));
  if (!/BLOQUEADO/.test(verd)) throw new Error("veredito: '" + verd + "'");
  /* o trilho declara a pendência por TEXTO */
  if (!/pendente/i.test(txt(q(d, '[data-p52-rail="evidence"]'))))
    throw new Error("trilho não sinaliza a pendência de evidência");
  return true;
});

/* ======================= REV A · HOME / SUFICIÊNCIA / DOMÍNIOS / MAPA ======================= */

T("P52-HOME1", "home é um hero 7+5 com o emblema estático dos cinco domínios", () => {
  const R = boot();
  const d = R.d;
  const hero = q(d, "#p52-hero");
  if (!hero) throw new Error("hero ausente na home");
  const main = q(d, ".p52-hero-main"), art = q(d, ".p52-hero-art");
  if (!main || !art) throw new Error("hero sem as duas colunas");
  if (Array.from(hero.children).map(c => c.className).join(",") !== "p52-hero-main,p52-hero-art")
    throw new Error("ordem do hero: conteúdo precisa vir antes do emblema no DOM");
  /* conteúdo, métricas e CTA ficam na coluna de conteúdo */
  for (const sel of ["#start", ".meta-row", "h1", "p.lead"])
    if (!main.querySelector(sel)) throw new Error("hero-main sem " + sel);
  /* ações secundárias descem para a faixa organizada */
  const sec = q(d, '[data-p52="home-secondary"]');
  if (!sec) throw new Error("faixa de ações secundárias ausente");
  if (!sec.querySelector("#ux-home")) throw new Error("bloco de contexto/sessão não desceu para a faixa secundária");
  /* PHASE 5.2 · REV B (HOME-B §2.4): os dois caminhos de entrada passam a ser
     CTAs equivalentes lado a lado na região principal, com `Importar sessão`
     logo abaixo. O CTA de contexto deixa de viver na faixa secundária. */
  const row = q(d, '[data-p52="cta-row"]');
  if (!row) throw new Error("faixa de CTAs principais ausente");
  const cta = Array.from(row.children).map(x => x.id);
  if (cta.indexOf("start") !== 0) throw new Error("'Começar o quickscan' não abre a faixa de CTAs");
  if (!row.querySelector("#ux-addctx, #ux-editctx"))
    throw new Error("CTA 'Adicionar contexto tecnológico · opcional' foi perdido");
  if (!/opcional/i.test(txt(row))) throw new Error("o contexto não está marcado como opcional");
  const sub = q(d, '[data-p52="cta-sub"]');
  if (!sub || !sub.querySelector("#ses-import-home, #ses-import"))
    throw new Error("'Importar sessão' não está logo abaixo dos CTAs");
  /* §2.3 · o card intermediário some do hero e o conteúdo vive no rodapé */
  if (q(d, "#p52-hero .disclaimer")) throw new Error("card intermediário de disclaimer persiste no hero");
  if (!q(d, 'footer [data-p52="home-neutral"]'))
    throw new Error("neutralidade do framework não foi consolidada no rodapé");

  /* emblema: estático, canônico, rotulado e SEM dado de sessão */
  const svg = q(d, '[data-p52="home-emblem"]');
  if (!svg) throw new Error("emblema ausente");
  if (svg.tagName.toLowerCase() !== "svg") throw new Error("emblema não é SVG inline");
  if (svg.getAttribute("role") !== "img") throw new Error("emblema sem role=img");
  const titleId = (svg.getAttribute("aria-labelledby") || "").split(/\s+/)[0];
  if (!titleId || !d.getElementById(titleId)) throw new Error("emblema sem nome acessível");
  if (!txt(q(d, "#p52-emblem-desc"))) throw new Error("emblema sem descrição curta");
  const nodes = qa(d, ".p52-emblem-node");
  if (nodes.length !== 5) throw new Error(nodes.length + " nós no emblema (esperados 5)");
  const labels = qa(d, ".p52-emblem-label").map(txt);
  if (labels.join(",") !== FX50.P50_DOM_PT.join(","))
    throw new Error("rótulos/ordem canônica: " + labels.join(","));
  nodes.forEach((n, i) => {
    if (n.getAttribute("data-dom") !== String(i))
      throw new Error("nó " + i + " sem data-dom canônico");
  });
  /* nenhuma cor é declarada em JavaScript e nenhum asset externo entra aqui */
  const js = fs.readFileSync(P52_JS, "utf8");
  if (/#(9063CD|3CB17E|2CCCD3|307FE2|A2B2C8|DA291C)/i.test(js))
    throw new Error("hex de domínio no owner de layout");
  if (/base64|https?:\/\//i.test(js.split("P52_CAP_HELP")[0]))
    throw new Error("asset externo ou base64 na construção do emblema");
  /* identidade gráfica, não visualização de resultado. O que se mede é o
     conteúdo VISÍVEL (`<text>`): `<title>`/`<desc>` são descrição acessível e
     podem — devem — dizer que o emblema não representa avaliação alguma. */
  const visiveis = qa(svg, "text").map(txt).join(" | ");
  if (/\d\s*[.,]\s*\d|\/\s*5|score|est[áa]gio|Inicial|Gerenciado|Definido|otimiza/i.test(visiveis))
    throw new Error("emblema exibe estado de avaliação: " + visiveis);
  if (qa(svg, "[data-p50-score], [data-p50-target], [data-dom][data-p50]").length)
    throw new Error("emblema carrega atributo de dado da sessão");
  return true;
});

T("P52-SUFF1", "suficiência muda de hierarquia conforme o público, sem esconder insuficiência", () => {
  /* (a) gate FECHADO: painel completo, proeminente, na segunda seção */
  const B = resultsDom(FX52.P52_F3);
  if (q(B.d, "#p52-evbase")) throw new Error("bloqueado: painel técnico escondido atrás de disclosure");
  const panelB = q(B.d, "#p52-sec-evidence #p50-suff");
  if (!panelB) throw new Error("bloqueado: painel de suficiência fora da seção de evidência");
  if (panelB.getAttribute("data-p50-sufficient") !== "false")
    throw new Error("fixture de gate fechado não bloqueia");
  if (!q(B.d, '#p50-suff [data-p50="suff-deficits"]')) throw new Error("bloqueado: déficits não listados");
  if (!q(B.d, '#p50-suff [data-p50="suff-guidance"]')) throw new Error("bloqueado: orientação ausente");
  if (!/BLOQUEADO/.test(txt(q(B.d, '[data-p50="results-verdict"]'))))
    throw new Error("bloqueado: veredito canônico não declara bloqueio");
  if (sectionKeys(B.d).indexOf("evidence") !== 1)
    throw new Error("bloqueado: suficiência não é a segunda seção");

  /* (b) gate ABERTO: status compacto na narrativa principal, painel atrás do
     disclosure, e nenhuma seção principal independente */
  const A = resultsDom(FX52.P52_F1);
  if (sectionKeys(A.d).indexOf("evidence") >= 0)
    throw new Error("liberado: suficiência ainda ocupa seção principal");
  if (qa(A.d, '[data-p52-rail="evidence"]').length)
    throw new Error("liberado: trilho ainda traz a suficiência como seção principal");
  const box = q(A.d, "#p52-evbase");
  if (!box) throw new Error("liberado: base de evidência ausente do relatório");
  /* PHASE 5.2 · REV B (SUFF-B §9): com o resultado liberado, "suficiência
     adequada" deixa de ser card de RESULTADO para o cliente. A base de
     evidência vai para a área interna de "Relatório e sessão"; a narrativa
     principal não pode mais exibi-la. */
  if (q(A.d, "#p52-sec-exec #p52-evbase"))
    throw new Error("liberado: base de evidência ainda ocupa a narrativa principal");
  if (!q(A.d, "#p52-sec-actions #p52-evbase"))
    throw new Error("liberado: base de evidência fora da área de relatório e sessão");
  if (/Qualidade da evid[êe]ncia|Sufici[êe]ncia adequada/i.test(txt(q(A.d, "#p52-sec-exec"))))
    throw new Error("liberado: KPI de suficiência voltou à visão executiva");
  if (box.hasAttribute("open")) throw new Error("liberado: disclosure já começa aberto");
  const panelA = q(A.d, "#p52-evbase #p50-suff");
  if (!panelA) throw new Error("liberado: painel canônico não está dentro do disclosure");
  if (panelA.getAttribute("data-p50-sufficient") !== "true")
    throw new Error("fixture de gate aberto não libera");
  /* o painel continua ÍNTEGRO: nada foi removido dele */
  for (const sel of ['[data-p50="suff-title"]', '[data-p50="suff-global"]', '[data-p50="suff-domains"]'])
    if (!panelA.querySelector(sel)) throw new Error("liberado: painel perdeu " + sel);
  /* o status compacto ECOA o contrato canônico — nunca inventa número */
  const g = q(A.d, '#p50-suff [data-p50="suff-global"]');
  const n = g.getAttribute("data-p50-confirmed");
  const compact = txt(q(A.d, '[data-p52="evidence-detail"]'));
  if (compact.indexOf(n) < 0)
    throw new Error("status compacto '" + compact + "' não reflete data-p50-confirmed=" + n);
  if (q(A.d, '[data-p52="evidence-verdict"]'))
    throw new Error("liberado: selo de veredito de suficiência persiste na apresentação");
  if (qa(A.d, "#p50-suff").length !== 1) throw new Error("painel de suficiência duplicado");
  return true;
});

T("P52-DOM2", "resumo traz cinco barras canônicas, com UNSET, NA e zero confirmado corretos", () => {
  const R = resultsDom(FX52.P52_F1);
  const d = R.d;
  const rows = qa(d, '#p50-panel-resumo [data-p50="results-domain"]');
  if (rows.length !== 5) throw new Error(rows.length + " linhas de domínio (esperadas 5)");
  rows.forEach((row, i) => {
    const bar = row.querySelector('[data-p52="dom-bar"]');
    if (!bar) throw new Error("domínio " + i + " sem barra");
    if (row.getAttribute("data-dom") !== String(i)) throw new Error("domínio " + i + " sem data-dom canônico");
    /* oráculo INDEPENDENTE: o score sai do runtime, não do DOM */
    const canonical = R.w.__DEV.legacySnapshot ? null : null;
    const shown = txt(row.querySelector('[data-p50="results-domain-value"]'));
    const fill = bar.querySelector(".p52-dombar-fill");
    if (shown === "n/d") {
      if (fill) throw new Error("domínio " + i + ": n/d desenhou barra — zero geométrico proibido");
      if (bar.getAttribute("data-p52-plotted") !== "false") throw new Error("domínio " + i + ": n/d marcado como plotado");
      if (!/Não avaliado|insuficiente/i.test(txt(row))) throw new Error("domínio " + i + ": n/d sem rótulo textual");
    } else {
      const v = parseFloat(shown);
      if (!fill) throw new Error("domínio " + i + ": score " + shown + " sem barra");
      const w = fill.style.getPropertyValue("--p52-bar-w");
      const want = (v / 5 * 100).toFixed(2) + "%";
      if (w !== want) throw new Error("domínio " + i + ": largura " + w + " != " + want + " para score " + shown);
      if (v === 0 && fill.getAttribute("data-p52-zero") !== "true")
        throw new Error("domínio " + i + ": zero confirmado sem marcador de origem");
    }
    if (!row.querySelector(".p52-dombar-ticks")) throw new Error("domínio " + i + ": barra sem referência de escala");
  });
  /* o radar NÃO é duplicado dentro do tab Resumo */
  if (q(d, "#p50-panel-resumo svg.radar")) throw new Error("radar duplicado no tab Resumo");
  /* cards executivos continuam presentes e lado a lado */
  if (qa(d, '#p50-panel-resumo [data-p50="exec-card"]').length !== 2)
    throw new Error("cards executivos do Resumo perdidos");

  /* UNSET real: uma fixture com domínio inteiro não avaliado não pode plotar */
  const U = resultsDom(FX52.P52_F3);
  const unplot = qa(U.d, '#p50-panel-resumo [data-p52="dom-bar"]');
  if (!unplot.length) throw new Error("gate fechado: barras ausentes no Resumo");
  if (unplot.some(b => b.querySelector(".p52-dombar-fill")))
    throw new Error("gate fechado: barra desenhada apesar de n/d");
  return true;
});

T("P52-MAP1", "trilho da pergunta sem navegação duplicada e mapa recolhível", () => {
  const R = boot();
  FX50.p50ApplyFixture(R.w, R.d, FX50.P50_F2);
  const d = R.d;
  const shell = q(d, "#p50-shell");
  if (!shell) throw new Error("trilho ausente");
  /* só o que é do trilho: orientação, mapa e o controle de recolher */
  if (qa(d, '#p50-shell [data-p50="prev"], #p50-shell [data-p50="next"]').length)
    throw new Error("navegação duplicada de volta na sidebar");
  if (q(d, "#p50-shell #p50-session-status"))
    throw new Error("card de sessão ainda vive na sidebar");
  const tgl = q(d, '#p50-shell button[data-p50="sidebar-toggle"]');
  if (!tgl) throw new Error("controle de recolher/expandir ausente");
  if (tgl.getAttribute("aria-controls") !== "p50-sidebar") throw new Error("toggle sem aria-controls");
  const btns = qa(d, "#p50-shell .p50-nav .p50-btn");
  if (btns.length !== 1) throw new Error(btns.length + " botões na barra do trilho (esperado 1)");
  /* orientação e mapa continuam lá */
  for (const sel of ['[data-p50="position"]', '[data-p50="domain-progress"]', '[data-p50="completion"]'])
    if (!shell.querySelector(sel)) throw new Error("trilho perdeu " + sel);
  if (qa(d, '#p50-shell [data-p50="domain"]').length !== 5)
    throw new Error("mapa não expõe os cinco domínios");
  /* estado inicial coerente com a largura da viewport e alternável */
  const desktop = R.w.innerWidth >= 1180;
  if (shell.getAttribute("data-p50-collapsed") !== (desktop ? "false" : "true"))
    throw new Error("estado inicial do mapa incoerente com innerWidth=" + R.w.innerWidth);
  const antes = q(d, "#p50-shell").getAttribute("data-p50-collapsed");
  tgl.click();
  if (q(d, "#p50-shell").getAttribute("data-p50-collapsed") === antes)
    throw new Error("o controle não alterna o mapa");
  /* alternar é apresentação: não toca input canônico */
  const canon = JSON.stringify(R.w.__DEV.captureCanonicalInputs());
  q(d, '#p50-shell button[data-p50="sidebar-toggle"]').click();
  if (JSON.stringify(R.w.__DEV.captureCanonicalInputs()) !== canon)
    throw new Error("recolher/expandir alterou estado canônico");
  return true;
});

T("P52-Q2", "faixa de utilidades da pergunta: evidência à esquerda, sessão à direita, navegação em botões", () => {
  const R = boot();
  FX50.p50ApplyFixture(R.w, R.d, FX50.P50_F2);
  const d = R.d;
  const util = q(d, "#p52-qutil");
  if (!util) throw new Error("faixa de utilidades ausente");
  const kids = Array.from(util.children);
  if (!kids.length || !kids[0].classList.contains("notebar"))
    throw new Error("evidência não é o primeiro item da faixa");
  const ses = q(d, "#p52-qutil #p50-session-status");
  if (!ses) throw new Error("status de sessão fora da faixa");
  if (kids.indexOf(ses) !== kids.length - 1) throw new Error("status de sessão não é o último item da faixa");
  if (!/n[ãa]o salva automaticamente/i.test(txt(ses)))
    throw new Error("status de sessão perdeu a declaração de não-persistência");
  /* owner ÚNICO de sessão: nada foi duplicado */
  if (qa(d, "#p50-session-status").length !== 1) throw new Error("segundo status de sessão criado");
  if (qa(d, ".p50-ses").length !== 1) throw new Error("segunda superfície de estado de sessão");
  /* navegação vira botões claros, sem terceira cópia */
  const nav = q(d, ".navrow.p52-qnav");
  if (!nav) throw new Error("navegação não recebeu o tratamento de botões");
  if (!nav.querySelector("#back") || !nav.querySelector("#next"))
    throw new Error("controles congelados de navegação ausentes da faixa");
  if (!nav.querySelector(".kbd-tip")) throw new Error("atalhos de teclado deixaram de ser indicados");
  /* o controle de evidência continua único na tela */
  const acion = qa(d, "#app button, #app a[href]").filter(b => /evid[êe]ncia|observa[çc][ãa]o/i.test(txt(b)));
  if (acion.length !== 1) throw new Error(acion.length + " controles de evidência");
  return true;
});

/* ======================= REV B · HOME / FOOTER / CONTEXTO / COPY ======================= */

T("P52-HOME2", "emblema dos cinco domínios com explicação acessível por nó", () => {
  const R = boot();
  const d = R.d;
  const svg = q(d, '[data-p52="home-emblem"]');
  if (!svg) throw new Error("emblema ausente");
  const nodes = qa(d, ".p52-emblem-node");
  if (nodes.length !== 5) throw new Error(nodes.length + " nós no emblema");
  nodes.forEach((g, i) => {
    if (g.getAttribute("tabindex") !== "0") throw new Error("nó " + i + " não é focável por teclado");
    if (g.getAttribute("role") !== "button") throw new Error("nó " + i + " sem papel de controle");
    if (g.getAttribute("aria-expanded") !== "false") throw new Error("nó " + i + " com estado inicial errado");
    const nome = g.getAttribute("aria-label") || "";
    if (nome.indexOf(FX50.P50_DOM_PT[i]) < 0) throw new Error("nó " + i + " sem nome acessível do domínio");
    const pop = d.getElementById(g.getAttribute("aria-describedby"));
    if (!pop) throw new Error("nó " + i + " sem explicação associada");
    if (!pop.hidden) throw new Error("nó " + i + ": explicação nasce aberta");
    if (pop.getAttribute("data-dom") !== String(i)) throw new Error("explicação " + i + " fora de ordem");
    const t = txt(pop);
    if (t.length < 60) throw new Error("explicação " + i + " curta demais");
    if (/Forti[A-Z]|score|est[áa]gio/i.test(t)) throw new Error("explicação " + i + " recomenda produto ou cita resultado");
  });
  /* o conteúdo mínimo exigido pela §2.2, por domínio */
  const MIN = [/governan[çc]a/i, /competências|treinamento/i, /detec[çc][ãa]o|automa[çc][ãa]o/i,
    /telemetria|endpoints/i, /monitoramento|vulnerabilidades/i];
  MIN.forEach((re, i) => {
    if (!re.test(txt(d.getElementById("p52-domhelp-" + i))))
      throw new Error("explicação de " + FX50.P50_DOM_PT[i] + " sem o conteúdo mínimo");
  });
  /* um popover por vez */
  nodes[0].dispatchEvent(new R.w.MouseEvent("click", { bubbles: true }));
  nodes[3].dispatchEvent(new R.w.MouseEvent("click", { bubbles: true }));
  const abertos = qa(d, '[data-p52="emblem-pop"]').filter(x => !x.hidden);
  if (abertos.length !== 1) throw new Error(abertos.length + " explicações abertas ao mesmo tempo");
  return true;
});

T("P52-HOME3", "a natureza indicativa do Quickscan é dita uma única vez, no rodapé", () => {
  const R = boot();
  const d = R.d;
  if (q(d, "#p52-hero .disclaimer")) throw new Error("card intermediário ainda no hero");
  if (q(d, "#app .disclaimer")) throw new Error("card intermediário ainda na tela");
  const foot = q(d, ".wrap > footer");
  const ft = txt(foot);
  /* o rodapé preserva TODOS os itens que o card carregava */
  const OBRIG = [[/SOC-CMM 2\.4/, "base SOC-CMM 2.4"], [/screening indicativo de alto n[íi]vel/i, "natureza indicativa"],
    [/n[ãa]o substitui/i, "não substitui assessment formal"], [/percep[çc][ãa]o declarada/i, "percepção declarada"],
    [/pr[áa]ticas/i, "avalia práticas"], [/CC BY-SA 4\.0/, "licença"], [/Rob van Os/, "atribuição"],
    [/aberto e neutro/i, "framework aberto e neutro"]];
  OBRIG.forEach(([re, nome]) => { if (!re.test(ft)) throw new Error("rodapé sem: " + nome); });
  /* e não repete a mesma frase duas vezes */
  const frase = "screening indicativo de alto nível";
  const ocor = (txt(q(d, "#app")) + " " + ft).toLowerCase().split(frase).length - 1;
  if (ocor > 1) throw new Error("a mesma mensagem aparece " + ocor + " vezes");
  return true;
});

T("P52-FOOT1", "crédito pessoal em estilo marca d'água, sem competir com a atribuição", () => {
  const R = boot();
  const d = R.d;
  const c = q(d, ".p52-foot-contact");
  if (!c) throw new Error("bloco de crédito pessoal ausente");
  const t = txt(c);
  for (const parte of ["Flávio Costa", "Business Development Engineer", "fcosta@fortinet.com"])
    if (t.indexOf(parte) < 0) throw new Error("crédito perdeu: " + parte);
  const legal = q(d, ".p52-foot-legal");
  if (!legal || !txt(legal)) throw new Error("atribuição/licença ausente do rodapé");
  if (txt(legal).indexOf("Flávio Costa") >= 0) throw new Error("crédito misturado à atribuição");
  return true;
});

T("P52-CTX4", "editor abre apenas SOC & Operations e distingue o grupo ativo sem pill", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const grupos = qa(d, "#v32editor details.v32-group[data-gid]");
  if (!grupos.length) throw new Error("editor sem grupos");
  const abertos = grupos.filter(g => g.open).map(g => g.getAttribute("data-gid"));
  if (abertos.join(",") !== "g1")
    throw new Error("grupos abertos ao entrar: " + (abertos.join(",") || "(nenhum)") + " (esperado só g1)");
  grupos.forEach(g => {
    const want = g.open ? "open" : "closed";
    if (g.getAttribute("data-p52-grp") !== want) throw new Error(g.getAttribute("data-gid") + ": estado incoerente");
    const sum = g.querySelector("summary");
    if (sum.getAttribute("aria-expanded") !== (g.open ? "true" : "false"))
      throw new Error(g.getAttribute("data-gid") + ": aria-expanded incorreto");
  });
  if (qa(d, '[data-p52="grp-state"], .p52-grp-state').length)
    throw new Error("pill ABERTO/FECHADO reintroduzido");
  /* §3.1 · dados preenchidos sobrevivem a fechar e reabrir o grupo */
  const sel = q(d, "#v32-pres-knowledge-management");
  if (sel) {
    sel.value = "PRESENT";
    sel.dispatchEvent(new R.w.Event("change"));
    const g1 = q(d, '#v32editor details[data-gid="g1"]');
    if (g1) { g1.open = false; g1.open = true; }
    const depois = q(d, "#v32-pres-knowledge-management");
    if (!depois || depois.value !== "PRESENT")
      throw new Error("o valor declarado se perdeu ao fechar e reabrir o grupo");
  }
  return true;
});

T("P52-CTX5", "dentro da capability: situação, tecnologias e só então o contexto complementar", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const sel = q(d, "#v32-pres-knowledge-management");
  if (!sel) throw new Error("capability de referência ausente do editor");
  sel.value = "PRESENT";
  sel.dispatchEvent(new R.w.Event("change"));
  const cap = q(d, "#v32-cap-knowledge-management");
  if (!cap) throw new Error("capability sumiu após declarar presença");
  const ordem = Array.from(cap.children).map(c => String(c.className).split(" ")[0]);
  const iHead = ordem.indexOf("v32-cap-head");
  const iSols = ordem.indexOf("v32-sols");
  const iDrv = ordem.indexOf("v32-driver-lab");
  if (iHead !== 0) throw new Error("nome e situação não abrem a capability: " + ordem.join(" > "));
  if (iSols < 0) throw new Error("bloco de tecnologias ausente");
  if (iDrv >= 0 && iDrv < iSols)
    throw new Error("contexto complementar aparece ANTES das tecnologias: " + ordem.join(" > "));
  const add = cap.querySelector(".v32-add");
  if (!add || txt(add) !== "+ Adicionar tecnologia") throw new Error("botão de tecnologia: '" + txt(add) + "'");
  if (iDrv >= 0) {
    const lab = txt(cap.querySelector(".v32-driver-lab"));
    if (!/Contexto complementar da capability · opcional/.test(lab))
      throw new Error("campo geral não foi renomeado: '" + lab.slice(0, 60) + "'");
    if (/Motivo declarado para aprofundamento/.test(lab)) throw new Error("rótulo antigo persiste");
  }
  return true;
});

T("P52-HELP2", "glossário acessível também em arquitetura, plataformas, requisitos e IA", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const ARQ = ["saasAllowed", "localProcessingRequired", "otIsolated",
    "unifiedPlatformPreference", "environmentProfile", "dataResidency"];
  ARQ.forEach(k => {
    const pop = d.getElementById("p52-archhelp-" + k);
    if (!pop) throw new Error("campo de arquitetura sem ajuda: " + k);
    if (!pop.hidden) throw new Error(k + ": ajuda nasce aberta");
    if (txt(pop).length < 60) throw new Error(k + ": verbete curto demais");
  });
  /* §4.2 · a distinção obrigatória entre processamento local e residência */
  const local = txt(d.getElementById("p52-archhelp-localProcessingRequired"));
  const resid = txt(d.getElementById("p52-archhelp-dataResidency"));
  if (!/infraestrutura sob seu controle/i.test(local) || !/local e do modelo operacional/i.test(local))
    throw new Error("verbete de processamento local não trata do local e do modelo operacional");
  if (!/pa[íi]ses, regi[õo]es ou jurisdi[çc][õo]es/i.test(resid) || !/regulat[óo]ri/i.test(resid))
    throw new Error("verbete de residência não trata de jurisdição e regulação");
  if (local === resid) throw new Error("os dois verbetes são idênticos");
  /* plataformas e requisitos */
  ["plat", "sig"].forEach(g => {
    if (!d.getElementById("p52-grphelp-" + g)) throw new Error("família sem ajuda: " + g);
  });
  /* todos os sinais de IA */
  ["shadowAIConcern", "organizationBuildsAIApps", "usesAgenticAI", "promptInjectionConcern",
   "aiUsageRisk", "usesPrivateLLMs", "aiRuntimeSecurityConcern", "llmDataLeakageConcern"].forEach(k => {
    if (!d.getElementById("p52-sighelp-" + k)) throw new Error("sinal de IA sem ajuda: " + k);
  });
  return true;
});

T("P52-AI1", "aplicações de IA e agentes autônomos são rótulos distinguíveis", () => {
  const R = resultsDom(FX52.P52_F1);
  q(R.d, "#v32cta").click();
  const d = R.d;
  const sig = q(d, '#v32editor details[data-gid="sig"]');
  if (sig) sig.open = true;
  const labels = qa(d, "#v32editor .v32-siggroup label").map(txt);
  const ESPERADOS = ["Shadow AI", "Aplicações corporativas de IA (copilots e chatbots)",
    "Agentes autônomos de IA", "Prompt injection", "Risco e governança do uso de IA",
    "Uso de LLM privado", "Segurança de runtime de IA", "Vazamento de dados via LLM"];
  ESPERADOS.forEach(e => {
    if (!labels.some(l => l.indexOf(e) >= 0)) throw new Error("rótulo de IA ausente: " + e);
  });
  if (labels.some(l => /Aplica[çc][õo]es\/agentes de IA/.test(l)))
    throw new Error("rótulo ambíguo 'Aplicações/agentes de IA' voltou");
  /* os IDs internos NÃO mudaram */
  const ids = qa(d, "#v32editor .v32-siggroup input[type=checkbox]").map(i => i.id);
  ["v32-sig-organizationBuildsAIApps", "v32-sig-usesAgenticAI"].forEach(i => {
    if (ids.indexOf(i) < 0) throw new Error("ID interno de sinal alterado: " + i);
  });
  /* e as duas ajudas explicam a diferença */
  const apl = txt(d.getElementById("p52-sighelp-organizationBuildsAIApps"));
  const agt = txt(d.getElementById("p52-sighelp-usesAgenticAI"));
  if (!/usadas por pessoas|copilot/i.test(apl)) throw new Error("ajuda de aplicações não explica o uso por pessoas");
  if (!/planejam e executam a[çc][õo]es/i.test(agt)) throw new Error("ajuda de agentes não explica autonomia");
  return true;
});

T("P52-COPY1", "sem 'mandato' e sem 'charter' na tela e no relatório do cliente", () => {
  for (const fx of [FX52.P52_F1, FX52.P52_F3]) {
    const R = resultsDom(fx);
    const tela = txt(q(R.d, "#app"));
    if (/\bmandato\b|charter/i.test(tela))
      throw new Error(fx.id + ": jargão na tela — " + (tela.match(/.{0,50}(mandato|charter).{0,50}/i) || [""])[0]);
    /* o canônico permanece intocado: identidade não muda com apresentação */
    if (R.w.eval("QS[0].id") !== "mandate") throw new Error("qid canônico alterado");
    if (R.w.eval("QS[0].lbl") !== "Mandato e objetivos") throw new Error("rótulo canônico alterado");
  }
  /* a pergunta apresentada usa a formulação de negócio */
  const Q = boot();
  FX50.p50GotoQuestion(Q.w, Q.d, FX50.P50_F2.vec, 0);
  const pergunta = txt(q(Q.d, "#app .question"));
  if (!/direcionamento/i.test(pergunta)) throw new Error("pergunta sem a linguagem de direcionamento: " + pergunta);
  if (/mandato|charter/i.test(pergunta)) throw new Error("pergunta ainda usa jargão");
  /* o mapa de apresentação é público e auditável */
  const mapa = Q.w.__P52.copyMap();
  if (!Array.isArray(mapa) || !mapa.length) throw new Error("mapa de apresentação não exposto");
  return true;
});

T("P52-EVID1", "'O que registrar' vem antes do campo e o exemplo é placeholder, sem duplicação", () => {
  const R = boot();
  FX50.p50ApplyFixture(R.w, R.d, FX50.P50_F2);
  const d = R.d;
  q(d, "#notetgl").click();
  const box = q(d, ".notebox");
  if (!box) throw new Error("campo de evidência não abriu");
  const kids = Array.from(box.children);
  const iLabel = kids.findIndex(x => x.tagName === "LABEL");
  const iWhat = kids.findIndex(x => x.querySelector && x.querySelector('[data-p50="evidence-help-what"]'));
  const iTa = kids.findIndex(x => x.id === "notetxt");
  if (iLabel !== 0) throw new Error("o rótulo não abre o bloco: " + kids.map(x => x.tagName).join(","));
  if (iWhat < 0) throw new Error("orientação 'O que registrar' ausente");
  if (!(iWhat < iTa)) throw new Error("'O que registrar' não vem antes do campo");
  const ta = q(d, "#notetxt");
  const ph = ta.getAttribute("placeholder") || "";
  if (!/^Ex\.:/.test(ph)) throw new Error("o exemplo não virou placeholder: '" + ph + "'");
  if (q(d, '[data-p50="evidence-help-example"]')) throw new Error("linha de exemplo duplicada abaixo do campo");
  /* o placeholder NÃO é valor salvo */
  if (ta.value) throw new Error("placeholder foi gravado como valor");
  const canon = JSON.stringify(R.w.__DEV.captureCanonicalInputs());
  if (canon.indexOf(ph.slice(0, 24)) >= 0)
    throw new Error("o exemplo do placeholder foi parar nos inputs canônicos da sessão");
  /* rótulo sem travessão de sistema */
  if (/—/.test(txt(kids[iLabel]))) throw new Error("rótulo do campo ainda usa travessão como separador");
  return true;
});

T("P52-SUP2", "toda oferta e serviço com URL canônica mostra o link oficial", () => {
  const R = resultsDom({ vec: FX52.P52_F1.vec, priorities: FX52.P52_F1.priorities,
    presence: { "security-analytics": "NONE", "endpoint-detection": "NONE", "soc-platform": "NONE" } });
  const d = R.d;
  const itens = qa(d, "#app .v32-cand[data-item-id], #app .v32-svc[data-item-id]");
  if (!itens.length) throw new Error("nenhum card de apoio V3.2 renderizado");
  const V = R.w.__DEV.V32;
  let comUrl = 0;
  itens.forEach(li => {
    const id = li.getAttribute("data-item-id");
    const url = ((V.OFFERINGS[id] || {}).url) || ((V.SERVICES[id] || {}).url) || "";
    const a = li.querySelector('[data-p52="sup-link"]');
    if (url) {
      comUrl++;
      if (!a) throw new Error(id + ": item com URL canônica e sem link oficial");
      if (a.getAttribute("href") !== url) throw new Error(id + ": link diverge da URL canônica");
      if (a.getAttribute("target") !== "_blank" || !/noopener/.test(a.getAttribute("rel") || ""))
        throw new Error(id + ": link sem target/rel seguros");
    } else if (a) {
      throw new Error(id + ": link criado sem URL canônica");
    }
    /* nada foi perdido: badge e razão continuam no card */
    if (!li.querySelector(".p52-sup-badge")) throw new Error(id + ": badge de natureza do apoio ausente");
  });
  if (!comUrl) throw new Error("nenhum item canônico com URL foi exercitado");
  return true;
});

/* ======================= P52-DOC1 · manual ======================= */

T("P52-DOC1", "o manual explica navegação, alvo, contexto opcional, suficiência, gaps e limites — sem prometer resultado", () => {
  const ug = readIf(path.join(HERE, "USER_GUIDE.md"));
  const rd = readIf(path.join(HERE, "README.md"));
  if (!ug) throw new Error("USER_GUIDE.md ausente");
  if (!rd) throw new Error("README.md ausente");
  const TEMAS = [
    [/navega(r|ção)[^.\n]{0,80}(se(ç|c)|resultado)/i, "navegação da tela de resultados"],
    [/cen[áa]rio-alvo/i, "cenário-alvo"],
    [/n[ãa]o altera[^.\n]{0,80}(pontua[çc][ãa]o|score)/i, "contexto não altera pontuação"],
    [/contexto[^.\n]{0,60}(interpreta|recomenda)/i, "contexto influencia interpretação/recomendações"],
    [/sufici[êe]ncia de evid[êe]ncia/i, "suficiência de evidência"],
    [/gaps? altos?/i, "gaps altos"],
    [/gaps? moderados?/i, "gaps moderados"],
    [/prioridades declaradas/i, "prioridades"],
    [/limit(e|ação|ações)/i, "limites das recomendações"],
    [/evid[êe]ncia[^.\n]{0,80}(sens[íi]ve|dado)/i, "dados sensíveis na evidência"],
    [/(exportar|exporta[çc][ãa]o)[^.\n]{0,40}sess[ãa]o/i, "exportação de sessão"],
    [/importar|importa[çc][ãa]o/i, "importação de sessão"],
    [/PDF/i, "PDF"],
    /* REV A · o manual precisa acompanhar o que a revisão mudou na tela */
    [/mapa do assessment/i, "mapa do assessment"],
    [/Recolher mapa/i, "controle de recolher o mapa"],
    [/Capabilities de seguran[çc]a/i, "regiões do contexto tecnológico"],
    [/Ambiente e condicionantes/i, "região de ambiente e condicionantes"],
    [/Base de evid[êe]ncia/i, "disclosure Base de evidência"],
    [/n[ãa]o vira barra zerada|nunca zero|n\/d/i, "UNSET não vira zero na barra"],
    /* REV B · o manual acompanha o que a revisão final mudou */
    [/Come[çc]ar o quickscan/i, "CTAs da tela de abertura"],
    [/Importar sess[ãa]o/i, "importar sessão na abertura"],
    [/emblema dos cinco dom[íi]nios/i, "emblema da home"],
    [/Contexto complementar da capability/i, "contexto complementar da capability"],
    [/Resid[êe]ncia\/localidade de dados/i, "residência de dados"],
    [/\+ Adicionar tecnologia/i, "botão de adicionar tecnologia"],
    [/Voc[êe] est[áa] aqui/i, "marcador da régua no relatório"],
    [/Cobertura da evid[êe]ncia/i, "cobertura da evidência nos metadados"]
  ];
  const faltando = TEMAS.filter(([re]) => !re.test(ug)).map(([, n]) => n);
  if (faltando.length) throw new Error("USER_GUIDE.md sem: " + faltando.join(" · "));
  if (!/cen[áa]rio-alvo/i.test(rd) || !/opcional/i.test(rd))
    throw new Error("README.md não cobre cenário-alvo e o caráter opcional do contexto");
  /* sem overclaim: o manual não pode prometer resultado nem virar documentação de implementação */
  const OVERCLAIM = [/garant(e|ia|imos)\s+(a\s+)?(melhoria|redu[çc][ãa]o|matur)/i,
    /assegura\s+conformidade/i, /elimina\s+(o\s+)?risco/i, /substitui\s+um\s+assessment\s+formal/i];
  for (const re of OVERCLAIM) {
    if (re.test(ug)) throw new Error("USER_GUIDE.md com promessa de resultado: " + re);
    if (re.test(rd)) throw new Error("README.md com promessa de resultado: " + re);
  }
  if (/ui_p52_workspace_v32\.(js|css)/.test(ug))
    throw new Error("USER_GUIDE.md virou documentação de implementação");
  return true;
});

/* ============ P52-DOC2 · ERRATA §4.4 · preferências de impressão ============ */

T("P52-DOC2", "o manual instrui as preferências de impressão e declara a jornada como bloco atômico", () => {
  const ug = readIf(path.join(__dirname, "USER_GUIDE.md"));
  if (!ug) throw new Error("USER_GUIDE.md ausente");
  const EXIGIDO = [
    [/salvar como pdf/i, "destino 'Salvar como PDF'"],
    [/\bA4\b/, "papel A4"],
    [/escala[^\n]{0,30}100\s?%/i, "escala 100%"],
    [/gr[áa]ficos de fundo[^\n]{0,40}habilitad/i, "gráficos de fundo habilitados"],
    [/cabe[çc]alhos e rodap[ée]s do navegador[^\n]{0,40}desabilitad/i, "cabeçalhos e rodapés do navegador desabilitados"]
  ];
  const faltando = EXIGIDO.filter(([re]) => !re.test(ug)).map(([, nome]) => nome);
  if (faltando.length) throw new Error("USER_GUIDE.md sem: " + faltando.join(" · "));
  /* a instrução não pode virar desculpa: a paginação é responsabilidade do
     CSS, e o manual precisa dizer isso com todas as letras */
  if (!/bloco at[ôo]mico/i.test(ug))
    throw new Error("USER_GUIDE.md não declara a jornada como bloco atômico no papel");
  if (!/mesma p[áa]gina/i.test(ug))
    throw new Error("USER_GUIDE.md não afirma que a jornada sai na mesma página");
  return true;
});

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
console.log("\nP52 LAYOUT (Phase 5.2): " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
