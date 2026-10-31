/* ============================================================================
   TESTES D026 · DECISÃO ÚNICA DO APOIO (jsdom) — demanda 026-decisao-unica-do-apoio
   Namespace exclusivo D026-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate mede geometria.

   ONDE ESTA SUÍTE É EXECUTADA
   ---------------------------------------------------------------------------
   Stage `suites` do `pipeline.yaml` → `check_suites.py`, chave `d026` de
   `expected_suites.json` (registro na wave de fecho, depois do green — errata
   E2 da 019: do commit do red até o registro o stage fica vermelho NOMEADO,
   "suíte fora do registro").

   ==========================================================================
   O QUE ESTA SUÍTE JULGA
   ==========================================================================
   Os oito critérios de `specs/026-decisao-unica-do-apoio/spec.md`, em TRÊS
   gates com alíneas nomeadas:

     D026-REC1  o motor vence a Camada 1 onde tem voz; a identidade é a chave,
                não o nome                                  (a)…(i)
     D026-PAP1  o papel diz o que a tela diz, por card      (QS-02)
     D026-LEG1  sem voz do motor nada é inventado; a derivação é pura  (a)…(g)

   A TESE que estes gates cercam (desenho §0): "o que o motor ofereceu nesta
   sessão" nasce UMA vez, em `ui_curation_v32.js` (`__CURATION.oferta()`,
   `.vetos()`, `.reconcile()`), reconciliando a hipótese da Camada 1
   (`computeFindings()+MAP`) com o motor contextual
   (`V32.buildRecommendationContext()`); tela, editor e papel CONSOMEM.

   ==========================================================================
   ORÁCULOS — nenhum gate lê `oferta()` como oráculo de si mesmo
   ==========================================================================
   · motor público (`engine_v32.js:811-817`): `classify`, `resolveCandidates`,
     `archSatisfied`, `serviceEligibility`, `suppressedByPlatform`,
     `buildRecommendationContext`, `isLegacyModeV32`;
   · pareamento `itemId → chave` REIMPLEMENTADO aqui pelas regras §1.4 do
     desenho (nunca o `chaveDe` do produto);
   · Camada 1 — `computeFindings()+MAP+PRODUCTS` — declarada oráculo de
     HIPÓTESE (vale em legado, `CONTEXT_NOT_INFORMED` e gate fechado);
   · tela: `#p52-sec-support > .apoio-block[data-p53-sol-produto]`,
     `:scope > [data-p53-vetos]`, `[data-p53-suprimido]`;
   · papel: `#v32-print-report` APÓS `beforeprint` despachado na janela
     (precedente S37/`D019-PAR1`);
   · `FX010.d010HasSubstitute(w)` (predicado da 010), `#p50-results[data-p50-gate]`.
   O registro (`oferta()`) entra como SUJEITO comparado ao motor, nunca como
   régua.

   ==========================================================================
   PRÉ-CONDIÇÃO DE NÃO-VACUIDADE
   ==========================================================================
   Alínea que depende de caso DECLARA a pré-condição e falha NOMEANDO o estado
   (`vac()`), nunca fecha verde por ausência de sujeito (lição `D010-INV7`/
   `EA-11`). Ausência de `__CURATION.oferta`/`.vetos`/`.reconcile` falha
   NOMEANDO o contrato (padrão `bridge(w)` da 022).

   ==========================================================================
   POR QUE ESTES GATES NASCEM VERMELHOS
   ==========================================================================
   Escritos ANTES da implementação (R3 §1/§4). Hoje `__CURATION.oferta` não
   existe, a tela não carrega `data-p53-sol-acao`/`-item-id`/`-condicao`, não
   há bloco `[data-p53-vetos]` e o papel não copia o tier. O vermelho é o
   ponto, e commitá-lo é a prova de que o critério não foi ajustado ao
   resultado. O que NASCERIA VERDE sem os atributos novos vai declarado em
   `red-026.md` (`LEG1 (b)`, `LEG1 (d)`, `REC1 (h)` e o que mais a medição
   mostrar) — o poder dessas alíneas vem dos mutantes, não do red.

   MODOS: `D026_HTML_OVERRIDE` (artefato efêmero), `D026_ONLY` (ids),
   `D026_DIAG=1` (diagnóstico: imprime por fixture o que o motor público
   devolve e o que tela/papel mostram HOJE, e roda TODAS as alíneas de cada
   gate em vez de parar na primeira — o veredito do gate não muda).
   Saída: última linha `D026 CONTRATO: N PASS · M FAIL de 3`; exit 1 com FAIL.
   ========================================================================== */

"use strict";

const path = require("path"), fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const FX010 = require("./fixtures_010_vao.js");

const HERE = __dirname;
const HTML_PATH = process.env.D026_HTML_OVERRIDE ||
  path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
if (!fs.existsSync(HTML_PATH)) {
  console.log("FAIL  D026-BOOT — artefato ausente: " + HTML_PATH);
  console.log("\nD026 CONTRATO: 0 PASS · 1 FAIL de 1");
  process.exit(1);
}
const HTML = fs.readFileSync(HTML_PATH, "utf8");
const DIAG = process.env.D026_DIAG === "1";

const results = [];
const ONLY = (process.env.D026_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
function T(id, label, fn) {
  if (ONLY.length && ONLY.indexOf(id) < 0) return;
  let ok = false, extra = "";
  try { ok = !!fn(); } catch (e) { ok = false; extra = " [" + e.message + "]"; }
  results.push({ id, ok });
  console.log((ok ? "PASS" : "FAIL") + "  " + id + " — " + label + extra);
}
/* falha NOMEADA por ausência de sujeito — nunca verde por vacuidade */
function vac(alinea, porque) { throw new Error("VÁCUO em " + alinea + ": " + porque); }

/* Alíneas SEQUENCIAIS: a primeira que falha encerra o gate nomeando alínea e
   estado. Sob D026_DIAG=1 todas rodam e cada uma é impressa — a leitura por
   alínea do red é MEDIDA, não raciocinada; o veredito do gate é o mesmo. */
function alineas(lista) {
  const falhas = [];
  for (let i = 0; i < lista.length; i++) {
    const id = lista[i][0], fn = lista[i][1];
    try { fn(); if (DIAG) console.log("      · " + id + " — ok"); }
    catch (e) {
      const msg = id + " " + e.message;
      if (!DIAG) throw new Error(msg);
      console.log("      · " + id + " — FALHA: " + e.message);
      falhas.push(msg);
    }
  }
  if (falhas.length)
    throw new Error(falhas[0] + (falhas.length > 1 ? " (+" + (falhas.length - 1) + " alínea(s) em D026_DIAG)" : ""));
  return true;
}

const txt = el => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");
const qa = (n, s) => Array.from(n.querySelectorAll(s));
const attr = (n, a) => (n ? n.getAttribute(a) : null);
const J = x => JSON.stringify(x);

/* ==========================================================================
   FIXTURES — valores LITERAIS de `anexos/cenarios/*.json`, construídas pelo
   padrão de `anexos/sonda-leitura.js:33-39`: respostas por `__DEV`, contexto
   escrito em `V32.TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT`/`SESSION_SIGNALS`.
   C7-UNSET, F2-placeholder (fixture F2 de `tests_023_leitura.js:156`) e as
   duas GF (gate fechado) são as da spec §Fixtures.
   ========================================================================== */
const QS_ORDER = ["mandate", "governance", "policies", "team-capacity", "training", "knowledge",
  "incident-response", "detection-lifecycle", "automation", "logs", "endpoint", "network-visibility",
  "monitoring-coverage", "external-surface", "vulnerability-management"];

const SOL_CROWDSTRIKE = { product: "CrowdStrike Falcon", vendor: "CrowdStrike", status: "production", coverage: "", deployment: "saas" };
const SOL_FORTISOC = { product: "FortiSOC", vendor: "Fortinet", status: "production", deployment: "saas" };
const SOL_SENTINEL = { product: "Microsoft Sentinel", vendor: "Microsoft", status: "production", deployment: "saas" };
const SOL_FORTIEDR = { product: "FortiEDR", vendor: "Fortinet", status: "production", deployment: "on-prem" };
/* GF: 4 confirmadas (3 de governança + endpoint) ⇒ `suff === false` (< 10);
   mandate/governance/policies em 0 dão linha do MAP (Serviços FortiGuard) e
   endpoint em 0 dá a linha cuja capability cada variante declara. */
const GF_ANSWERS = [0, 0, 0, null, null, null, null, null, null, null, 0, null, null, null, null];

const FX = {
  "C1":  { nivel: 2, niveis: { endpoint: 0 }, landscape: { "endpoint-detection": { presence: "NONE" } },
           arch: { saasAllowed: "no", localProcessingRequired: "yes" } },
  "C2":  { nivel: 2, niveis: { endpoint: 0 }, landscape: { "endpoint-detection": { presence: "PRESENT", solutions: [SOL_CROWDSTRIKE] } },
           arch: { saasAllowed: "yes" } },
  "C3":  { nivel: 2, niveis: { automation: 0 }, landscape: { "soc-platform": { presence: "PRESENT", solutions: [SOL_FORTISOC] } },
           arch: { saasAllowed: "yes" } },
  "C3b": { nivel: 2, niveis: { automation: 0 }, landscape: { "soc-platform": { presence: "PRESENT", solutions: [SOL_FORTISOC] },
           "security-automation": { presence: "PRESENT", solutions: [SOL_FORTISOC] } }, arch: { saasAllowed: "yes" } },
  "C4":  { nivel: 2, niveis: { logs: 0 }, landscape: { "security-analytics": { presence: "PRESENT", solutions: [SOL_SENTINEL] } },
           arch: { saasAllowed: "yes" } },
  "C5":  { arq: 1, answers: [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, "NA", 1, 2, 0, 0], prios: ["mandate", "training", "knowledge"] },
  "C6":  { nivel: 2, niveis: { "network-visibility": 0 }, landscape: { "network-detection": { presence: "NONE" } },
           arch: { saasAllowed: "no", localProcessingRequired: "yes" } },
  "C7":  { nivel: 2, niveis: { "monitoring-coverage": 0, "team-capacity": 0, endpoint: 1 },
           landscape: { "endpoint-detection": { presence: "PRESENT", solutions: [SOL_FORTIEDR] }, "continuous-monitoring": { presence: "NONE" } },
           arch: { saasAllowed: "yes" } },
  "C7-UNSET": { nivel: 2, niveis: { "monitoring-coverage": 0, "team-capacity": 0, endpoint: 1 },
           landscape: { "continuous-monitoring": { presence: "NONE" } }, arch: { saasAllowed: "yes" } },
  "C8":  { nivel: 2, niveis: { endpoint: 0 } },
  "C9":  { nivel: 2, signals: { dataLeakageConcern: true }, landscape: { "data-loss-prevention": { presence: "NONE" } },
           arch: { saasAllowed: "yes" } },
  "C10": { nivel: 2, niveis: { endpoint: 0, logs: 0 },
           landscape: { "endpoint-detection": { presence: "NONE" }, "security-analytics": { presence: "NONE" } }, arch: { saasAllowed: "yes" } },
  "F2-placeholder": { nivel: 1, landscape: { "endpoint-detection": { presence: "NONE" } }, prios: ["endpoint", "logs", "network-visibility"] },
  "GF-NONE": { answers: GF_ANSWERS, landscape: { "endpoint-detection": { presence: "NONE" } }, arch: { saasAllowed: "yes" } },
  "GF-TERCEIRO": { answers: GF_ANSWERS, landscape: { "endpoint-detection": { presence: "PRESENT", solutions: [SOL_CROWDSTRIKE] } }, arch: { saasAllowed: "yes" } }
};

function boot(nome, opts) {
  const fx = FX[nome];
  if (!fx) throw new Error("fixture desconhecida: " + nome);
  const o = Object.assign({}, fx, opts || {});
  const errs = [];
  const vc = new VirtualConsole();
  vc.on("error", function () { errs.push(Array.prototype.map.call(arguments, String).join(" ")); });
  vc.on("jsdomError", e => errs.push(String((e && e.message) || e)));
  const dom = new JSDOM(HTML, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://l.test/", virtualConsole: vc });
  const w = dom.window, d = w.document;
  if (!w.__DEV) throw new Error("__DEV ausente — o artefato não expôs a superfície de teste");
  w.__DEV.setArq(o.arq == null ? 0 : o.arq);
  const ids = w.eval("QS.map(q=>q.id)");
  if (J(ids) !== J(QS_ORDER)) vac("fixture " + nome, "ordem de QS diverge da sonda: " + ids.join(","));
  if (Array.isArray(o.answers)) ids.forEach((id, i) => w.__DEV.setAnswerById(id, o.answers[i]));
  else {
    const base = o.nivel == null ? 2 : o.nivel;
    ids.forEach(id => w.__DEV.setAnswerById(id, base));
    Object.keys(o.niveis || {}).forEach(id => w.__DEV.setAnswerById(id, o.niveis[id]));
  }
  const V = w.__DEV.V32;
  Object.keys(o.landscape || {}).forEach(cap => {
    if (!V.TECH_LANDSCAPE[cap]) vac("fixture " + nome, "capability sem landscape: " + cap);
    V.TECH_LANDSCAPE[cap] = Object.assign({ presence: "UNSET", solutions: [], declaredDriver: null },
      JSON.parse(J(o.landscape[cap])));
  });
  Object.keys(o.arch || {}).forEach(k => { V.ARCHITECTURE_CONTEXT[k] = o.arch[k]; });
  Object.keys(o.signals || {}).forEach(k => { V.SESSION_SIGNALS[k] = o.signals[k]; });
  if (o.platforms) V.PLATFORM_CONTEXT.declaredPlatforms = o.platforms;
  w.__DEV.setPriorities(o.prios || []);
  /* `semRender` existe para `LEG1 (f)`: snapshot ANTES do primeiro render
     (precedente `D022-INV1`). */
  if (!o.semRender) w.__DEV.showResults();
  return { w, d, V, errs, nome };
}
/* uma janela por uso, fechada em `finally` — ~35 janelas na suíte inteira,
   nunca mais de uma aberta por vez (heap). */
function com(nome, fn, opts) {
  const s = boot(nome, opts);
  try { return fn(s); }
  finally { try { s.w.close(); } catch (e) { /* janela já fechada */ } }
}

/* ==========================================================================
   O CONTRATO da spec §Contratos — e a falha NOMEADA quando não existe.
   ========================================================================== */
function bridge(w) {
  const b = w.__CURATION;
  if (!b || !b.__installed) throw new Error("`__CURATION` ausente — o contrato da spec §Contratos não existe");
  ["oferta", "vetos", "reconcile"].forEach(m => {
    if (typeof b[m] !== "function")
      throw new Error("`__CURATION." + m + "` ausente — o contrato da spec §Contratos não existe");
  });
  return b;
}

/* ==========================================================================
   ORÁCULOS DE TELA E PAPEL
   ========================================================================== */
function sec(d) {
  const s = d.getElementById("p52-sec-support");
  if (!s) vac("tela", "`#p52-sec-support` ausente — a tela de resultados não foi alcançada");
  return s;
}
const cards = d => qa(sec(d), ":scope > .apoio-block[data-p53-sol-produto]");
const cardDe = (d, nome) => cards(d).filter(c => attr(c, "data-p53-sol-produto") === nome)[0] || null;
const vetosBloco = d => sec(d).querySelector(":scope > [data-p53-vetos]");
const vetoItens = d => { const b = vetosBloco(d); return b ? qa(b, "li[data-p53-veto-item]") : []; };
const vetoDe = (d, nome) => vetoItens(d).filter(li => attr(li, "data-p53-veto-item") === nome)[0] || null;
const aviso = d => sec(d).querySelector(":scope > [data-p53-suprimido]");
const listar = d => cards(d).map(c => attr(c, "data-p53-sol-produto") + "{tier=" + attr(c, "data-p53-sol-tier") +
  ", acao=" + attr(c, "data-p53-sol-acao") + ", item-id=" + attr(c, "data-p53-sol-item-id") +
  ", condicao=" + attr(c, "data-p53-sol-condicao") + "}").join(" · ") || "(nenhum card)";
function papel(w, d) {
  w.dispatchEvent(new w.Event("beforeprint"));
  const rel = d.getElementById("v32-print-report");
  if (!rel) vac("papel", "`#v32-print-report` não existe após `beforeprint`");
  return rel;
}
function fimPapel(w) { try { w.__DEV.finishPrint(); } catch (e) { /* sem relatório montado */ } }
const prCards = rel => qa(rel, "#pr-sup-solucao .pr-card");
const prCardDe = (rel, nome) => prCards(rel).filter(c => attr(c, "data-p53-sol-produto") === nome)[0] || null;
const prVetos = rel => rel.querySelector("#pr-sup-solucao .p53-pr-vetos[data-p53-vetos]");
const prVetoItens = rel => { const b = prVetos(rel); return b ? qa(b, "li[data-p53-veto-item]") : []; };

const TIER_TXT = { prioritaria: "indicação prioritária", validacao: "após validação" };
const ATTRS_COPIADOS = ["data-p53-sol-tier", "data-p53-sol-acao", "data-p53-sol-item-id",
  "data-p53-sol-origem", "data-p53-sol-condicao", "data-p53-sol-variantes"];

/* O papel é DERIVADO dos cards da tela (`D019-PAR1`): cada `pr-card` homônimo
   carrega os mesmos atributos e o texto do tier. */
function compararCards(nome, cs, prs) {
  if (!cs.length) vac("PAP1 " + nome, "nenhum card na tela — sem sujeito");
  if (prs.length !== cs.length)
    throw new Error(nome + ": " + prs.length + " pr-card no papel ≠ " + cs.length + " card(s) na tela");
  cs.forEach(c => {
    const prod = attr(c, "data-p53-sol-produto");
    const p = prs.filter(x => attr(x, "data-p53-sol-produto") === prod)[0];
    if (!p) throw new Error(nome + ": pr-card homônimo de `" + prod + "` ausente no papel");
    ATTRS_COPIADOS.forEach(a => {
      if (attr(c, a) !== attr(p, a))
        throw new Error(nome + " · " + prod + ": " + a + " tela=" + J(attr(c, a)) + " papel=" + J(attr(p, a)));
    });
    const tier = attr(c, "data-p53-sol-tier");
    const lbl = p.querySelector(".p53-pr-tier");
    if (tier) {
      if (!lbl) throw new Error(nome + " · " + prod + ": `.p53-pr-tier` ausente no pr-card (tela diz " + tier + ")");
      if (txt(lbl) !== TIER_TXT[tier])
        throw new Error(nome + " · " + prod + ": `.p53-pr-tier` = " + J(txt(lbl)) + " ≠ " + J(TIER_TXT[tier]));
      const lt = c.querySelector(".p53-sol-tierlabel");
      if (lt && txt(lt) !== txt(lbl))
        throw new Error(nome + " · " + prod + ": texto do tier diverge tela/papel: " + J(txt(lt)) + " × " + J(txt(lbl)));
    } else if (lbl) throw new Error(nome + " · " + prod + ": papel inventou tier (`.p53-pr-tier`) para card sem tier");
  });
}
function compararVetos(nome, d, rel) {
  const bt = vetosBloco(d);
  if (!bt) throw new Error(nome + ": `[data-p53-vetos]` ausente na tela — atributo ausente, sem sujeito para o papel");
  const bp = prVetos(rel);
  if (!bp) throw new Error(nome + ": `.p53-pr-vetos[data-p53-vetos]` ausente no papel (tela tem " + attr(bt, "data-p53-vetos") + ")");
  if (attr(bp, "data-p53-vetos") !== attr(bt, "data-p53-vetos"))
    throw new Error(nome + ": contagem de vetos tela=" + attr(bt, "data-p53-vetos") + " papel=" + attr(bp, "data-p53-vetos"));
  const it = vetoItens(d).map(li => attr(li, "data-p53-veto-item")).sort();
  const ip = prVetoItens(rel).map(li => attr(li, "data-p53-veto-item")).sort();
  if (J(it) !== J(ip)) throw new Error(nome + ": itens vetados tela=" + J(it) + " papel=" + J(ip));
}

/* ==========================================================================
   ORÁCULO DA CAMADA 1 — hipótese por pergunta (`computeFindings()+MAP+PRODUCTS`,
   o oráculo do `D019-SOL1`, aqui declarado oráculo de HIPÓTESE).
   ========================================================================== */
function hipoteseDoMapa(w) {
  return w.eval("(function(){var o=[],fs=(computeFindings()||{}).findings||[];" +
    "for(var i=0;i<fs.length;i++){var f=fs[i],m=MAP[f.id];if(!m||!m.lv||!m.lv[f.lvl])continue;" +
    "var c=m.lv[f.lvl].c||[];for(var j=0;j<c.length;j++){var p=PRODUCTS[c[j].p];" +
    "if(p)o.push({chave:c[j].p,nome:p.n,qid:f.id,cap:m.cap,sev:f.sev,lvl:f.lvl,sn:c[j].sn||null});}}return o;})()");
}
/* linhas do MAP cuja pergunta pertence à capability (1:1 por `validateConfigV32`) */
function linhasDoMapa(w, V, capId) {
  const qids = (V.CAPABILITIES[capId] || {}).questionIds || [];
  const out = [];
  hipoteseDoMapa(w).forEach(x => { if (qids.indexOf(x.qid) >= 0 && out.indexOf(x.nome) < 0) out.push(x.nome); });
  return out;
}
/* tier de hipótese, como `buildTiers` congelado: sev 2 ⇒ 1, senão 2 */
function tierDaHipotese(w, nome) {
  const sevs = hipoteseDoMapa(w).filter(x => x.nome === nome).map(x => x.sev);
  if (!sevs.length) return null;
  return Math.max.apply(null, sevs) === 2 ? "prioritaria" : "validacao";
}
function ctxDe(V, capId) {
  const r = V.buildRecommendationContext();
  const c = r.contexts && r.contexts[capId];
  if (!c) vac("motor", "`contexts[" + capId + "]` ausente (legacyMode=" + r.legacyMode + ")");
  return c;
}
const copy = w => ((w.__P52 && typeof w.__P52.applyCopy === "function")
  ? function (s) { return w.__P52.applyCopy(s); } : function (s) { return s; });

/* ==========================================================================
   PAREAMENTO `itemId → chave` — REIMPLEMENTADO pelas regras §1.4 do desenho
   (nunca o `chaveDe` do produto). Total sobre `OFFERINGS ∪ SERVICES`.
     1. nome exato (OFFERINGS/SERVICES[id].name === PRODUCTS[k].n)
     2. cadeia `variantOf` até (1)
     3. representante ÚNICO da família: entre as ofertas com `family === fam`,
        `variantOf === null`, `entityType !== "family"`, as pareáveis por (1)
        devem ser EXATAMENTE UMA
     4. serviço membro de SERVICE_FAMILIES[f] → LINHA_DA_FAMILIA_DE_SERVICO[f]
     5. senão null (incurável, status quo)
   ========================================================================== */
const LINHA_DA_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };
function pareamento(V, P) {
  const OFF = V.OFFERINGS, SRV = V.SERVICES, SF = V.SERVICE_FAMILIES;
  const porNome = {};
  Object.keys(P).forEach(k => { porNome[P[k].n] = k; });
  const regra1 = id => { const o = OFF[id] || SRV[id]; return (o && porNome[o.name]) || null; };
  function chaveDe(id) {
    if (OFF[id]) {
      const k1 = regra1(id); if (k1) return k1;
      let cur = OFF[id], passos = 0;
      while (cur && cur.variantOf && passos++ < 10) {
        const k2 = regra1(cur.variantOf); if (k2) return k2;
        cur = OFF[cur.variantOf];
      }
      const o = OFF[id];
      const fam = o.entityType === "family" ? id : o.family;
      if (fam) {
        const reps = Object.keys(OFF).filter(x => OFF[x].family === fam && OFF[x].variantOf === null &&
          OFF[x].entityType !== "family" && regra1(x));
        if (reps.length === 1) return regra1(reps[0]);
      }
      return null;
    }
    if (SRV[id]) {
      const k1 = regra1(id); if (k1) return k1;
      const fams = Object.keys(SF).filter(f => (SF[f].members || []).indexOf(id) >= 0);
      for (let i = 0; i < fams.length; i++) if (LINHA_DA_FAMILIA_DE_SERVICO[fams[i]]) return LINHA_DA_FAMILIA_DE_SERVICO[fams[i]];
      return null;
    }
    return undefined;                       /* fora do domínio */
  }
  const dominio = Object.keys(OFF).concat(Object.keys(SRV));
  const idsDaLinha = k => dominio.filter(id => chaveDe(id) === k);
  return { chaveDe, idsDaLinha, dominio };
}

/* censo da Camada 1 — a regra de `hideLegacyRecommendation` (tests_010_vao.js:168-196) */
const HIDE = FX010.D010_HIDE_EYEBROWS;
if (!Array.isArray(HIDE) || HIDE.length !== 3)
  throw new Error("`FX010.D010_HIDE_EYEBROWS` deixou de ser a lista de três títulos congelados");
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
      if (grupo) out.push({ tipo: "titulo", chave: t, oculto: cl.contains("v32-hidden"), produto: null });
      return;
    }
    const permitido = cl.contains("apoio-block") || cl.contains("t-list") || cl.contains("t-details");
    if (grupo && permitido) out.push({ tipo: "bloco", chave: grupo + "/" + String(n.className || "").split(" ")[0],
      oculto: cl.contains("v32-hidden"), produto: attr(n, "data-p53-sol-produto") });
    else if (grupo && !permitido) grupo = null;
  });
  return out;
}

/* entrada LITERAL para `reconcile(entrada)` — shape de spec §Contratos →
   Funções (`entradaViva()`), montada do motor público e da Camada 1 */
function montarEntrada(w, V) {
  const sup = V.suppressedByPlatform();
  const arquitetura = {}, elegibilidade = {}, landscape = {};
  Object.keys(V.OFFERINGS).forEach(id => { arquitetura[id] = V.archSatisfied(V.OFFERINGS[id].architectureRequires); });
  Object.keys(V.SERVICES).forEach(sid => { elegibilidade[sid] = V.serviceEligibility(sid); });
  Object.keys(V.TECH_LANDSCAPE).forEach(c => { landscape[c] = V.TECH_LANDSCAPE[c].presence; });
  const suff = w.__P50SUFF && typeof w.__P50SUFF.contract === "function" ? w.__P50SUFF.contract() : null;
  if (!suff || typeof suff.sufficient !== "boolean") vac("entrada", "`__P50SUFF.contract().sufficient` indisponível");
  return {
    legado: V.isLegacyModeV32(),
    suficiente: suff.sufficient,
    findings: w.eval("computeFindings().findings"),
    mapa: w.eval("MAP"),
    produtos: w.eval("PRODUCTS"),
    contextos: V.buildRecommendationContext().contexts,
    catalogo: { ofertas: V.OFFERINGS, servicos: V.SERVICES, familiasServico: V.SERVICE_FAMILIES, capabilities: V.CAPABILITIES },
    landscape,
    supressao: { caps: Array.from(sup.caps || []), plataforma: sup.plat || null },
    arquitetura,
    elegibilidade
  };
}
function todasAsChaves(o, acc) {
  acc = acc || new Set();
  if (o && typeof o === "object") {
    if (!Array.isArray(o)) Object.keys(o).forEach(k => { acc.add(k); todasAsChaves(o[k], acc); });
    else o.forEach(x => todasAsChaves(x, acc));
  }
  return acc;
}
function abrirPainel(d) {
  const btn = d.querySelector("[data-p53-abrir-curadoria]");
  if (!btn) vac("painel", "controle de curadoria ausente — gate fechado ou decoração não rodou");
  if (attr(btn, "aria-expanded") !== "true") btn.click();
  if (!d.querySelector("[data-p53-cur-panel]")) throw new Error("o controle não abriu o painel de curadoria");
}

/* ==========================================================================
   DIAGNÓSTICO (D026_DIAG=1): o que o motor público devolve e o que tela/papel
   mostram HOJE, por fixture — para conferir contra `anexos/refutacao-reproducoes.json`
   antes de atribuir o vermelho ao produto (R2 §3).
   ========================================================================== */
function diagnostico() {
  Object.keys(FX).forEach(nome => com(nome, ({ w, d, V, errs }) => {
    const r = V.buildRecommendationContext();
    const motor = {};
    Object.keys(r.contexts || {}).forEach(cap => {
      const c = r.contexts[cap];
      if (!c.candidates.length && !c.services.length && !c.notes.length) return;
      motor[cap] = { cls: c.classification, modo: c.supportMode, mat: c.maturity && c.maturity.state,
        cands: c.candidates.map(x => x.itemId + "/" + x.itemKind + (x.variants ? "[" + x.variants.join("|") + "]" : "")),
        servs: c.services.map(s => s.serviceId + "<" + (s.triggeredBy || []).join(",") + ">:" + s.note), notas: c.notes };
    });
    const gate = d.getElementById("p50-results");
    const tela = cards(d).map(c => ({ produto: attr(c, "data-p53-sol-produto"), tier: attr(c, "data-p53-sol-tier"),
      label: txt(c.querySelector(".p53-sol-tierlabel")) || null, h4: txt(c.querySelector("h4")),
      acao: attr(c, "data-p53-sol-acao"), itemId: attr(c, "data-p53-sol-item-id"), condicao: attr(c, "data-p53-sol-condicao"),
      origem: attr(c, "data-p53-sol-origem"), variantes: attr(c, "data-p53-sol-variantes"),
      caps: qa(c, "[data-p53-sol-cap]").map(x => attr(x, "data-p53-sol-cap")), sinais: attr(c, "data-qs22-sinais"),
      prov: attr(c.querySelector("[data-p53-prov]"), "data-p53-prov") }));
    const vb = vetosBloco(d);
    const vetos = vb ? { n: attr(vb, "data-p53-vetos"), itens: vetoItens(d).map(li => ({ item: attr(li, "data-p53-veto-item"),
      classe: attr(li, "data-p53-veto-classe"), txt: txt(li).slice(0, 200) })) } : null;
    const rel = papel(w, d);
    const pap = prCards(rel).map(c => ({ produto: attr(c, "data-p53-sol-produto"), tier: attr(c, "data-p53-sol-tier"),
      label: txt(c.querySelector(".p53-pr-tier")) || null, b: txt(c.querySelector("b")), acao: attr(c, "data-p53-sol-acao"),
      itemId: attr(c, "data-p53-sol-item-id"), origem: attr(c, "data-p53-sol-origem"), condicao: attr(c, "data-p53-sol-condicao"),
      escopo: txt(c.querySelector(".p53-pr-escopo")) || null, prov: attr(c.querySelector("[data-p53-prov]"), "data-p53-prov") }));
    const pv = prVetos(rel);
    const papelVetos = pv ? { n: attr(pv, "data-p53-vetos"), itens: prVetoItens(rel).map(li => attr(li, "data-p53-veto-item")) } : null;
    const papelAviso = attr(rel.querySelector("#pr-sup-solucao [data-p53-suprimido]"), "data-p53-suprimido");
    fimPapel(w);
    const C = w.__CURATION;
    const ponte = { __CURATION: !!C, oferta: typeof (C || {}).oferta, vetos: typeof (C || {}).vetos, reconcile: typeof (C || {}).reconcile,
      offered: C ? C.offered() : null, published: C ? C.published() : null };
    const ctxEp = r.contexts && r.contexts["endpoint-detection"];
    console.log("DIAG " + nome + " " + J({
      legado: r.legacyMode, suff: JSON.parse(w.__DEV.legacySnapshot()).suff, gate: attr(gate, "data-p50-gate"),
      d010HasSubstitute: FX010.d010HasSubstitute(w),
      elegMDR: V.serviceEligibility("fortiguard-mdr"),
      archFortiEndpoint: V.archSatisfied(V.OFFERINGS.fortiendpoint.architectureRequires),
      archFortiEDR: V.archSatisfied(V.OFFERINGS.fortiedr.architectureRequires),
      classifySecAutomation: V.classify("security-automation").c,
      supCaps: Array.from(V.suppressedByPlatform().caps),
      candEp: ctxEp ? ctxEp.candidates.map(x => x.itemId + "/" + x.itemKind) : null,
      hipoteseMAP: hipoteseDoMapa(w).map(x => x.nome + "×" + x.qid + "(sev" + x.sev + ")"),
      motor, ponte, tela, vetos, aviso: attr(aviso(d), "data-p53-suprimido"),
      papel: pap, papelVetos, papelAviso,
      censoCongeladoVisivel: censo(d).filter(x => !x.produto && !x.oculto).map(x => x.chave),
      consoleErrors: errs
    }, null, 1));
  }));
  /* a tabela do pareamento reimplementado */
  com("C1", ({ w, V }) => {
    const P = w.eval("PRODUCTS"), par = pareamento(V, P), tab = {};
    par.dominio.forEach(id => { tab[id] = par.chaveDe(id); });
    console.log("DIAG pareamento " + J(tab));
  });
}
if (DIAG) diagnostico();

/* ==========================================================================
   D026-REC1 · o motor vence a Camada 1 onde tem voz; a identidade é a chave
   ========================================================================== */
T("D026-REC1", "o motor vence a Camada 1 onde tem voz; a identidade é a chave, não o nome", () => alineas([

  /* (a) C1 — a variante resolvida é o título; a linha é a identidade; sem veto arquitetural (E5) */
  ["(a) C1 · fortiedr sob a linha FortiEndpoint", () => com("C1", ({ w, d, V }) => {
    const b = bridge(w);
    if (V.archSatisfied(V.OFFERINGS.fortiendpoint.architectureRequires) !== "violated")
      vac("(a)", "o motor não veta FortiEndpoint por arquitetura em C1 — a fixture perdeu o sujeito");
    const cands = V.resolveCandidates("endpoint-detection").map(c => c.itemId);
    if (cands.indexOf("fortiedr") < 0) vac("(a)", "resolveCandidates(endpoint-detection) não traz fortiedr: " + J(cands));
    const ctx = ctxDe(V, "endpoint-detection");
    if (!(ctx.maturity && ctx.maturity.state === "gap-high"))
      vac("(a)", "endpoint-detection não está em gap-high (" + (ctx.maturity && ctx.maturity.state) + ") — `prioritaria` sem fundamento no motor");
    const reg = b.oferta().filter(r => r.itemId === "fortiedr")[0];
    if (!reg) throw new Error("`oferta()` não traz registro com itemId fortiedr");
    if (reg.chave !== "FortiEndpoint") throw new Error("registro fortiedr com chave " + J(reg.chave) + " ≠ \"FortiEndpoint\"");
    if (reg.acao !== "avaliar-aquisicao") throw new Error("registro fortiedr com acao " + J(reg.acao) + " ≠ \"avaliar-aquisicao\"");
    const card = sec(d).querySelector(':scope > .apoio-block[data-p53-sol-item-id="fortiedr"]');
    if (!card) throw new Error("card `[data-p53-sol-item-id=\"fortiedr\"]` ausente — atributo ausente; cards hoje: " + listar(d));
    const h4 = txt(card.querySelector("h4"));
    if (h4 !== V.OFFERINGS.fortiedr.name) throw new Error("h4 = " + J(h4) + " ≠ " + J(V.OFFERINGS.fortiedr.name));
    if (attr(card, "data-p53-sol-produto") !== "FortiEndpoint")
      throw new Error("data-p53-sol-produto = " + J(attr(card, "data-p53-sol-produto")) + " ≠ \"FortiEndpoint\" (linha)");
    if (attr(card, "data-p53-sol-tier") !== "prioritaria")
      throw new Error("data-p53-sol-tier = " + J(attr(card, "data-p53-sol-tier")) + " ≠ \"prioritaria\" (gap-high)");
    if (vetosBloco(d)) throw new Error("`[data-p53-vetos]` presente em C1 — veto arquitetural sobre linha que ganhou card (E5)");
  })],

  /* (b) C2/C4 — veto visível, nunca aquisição */
  ["(b) C2/C4 · veto com a razão literal do motor", () => ["C2", "C4"].forEach(nome => com(nome, ({ w, d, V }) => {
    const capId = nome === "C2" ? "endpoint-detection" : "security-analytics";
    const ctx = ctxDe(V, capId);
    if (!(ctx.supportMode === "CONTEXTUAL" && ctx.candidates.length === 0))
      vac("(b) " + nome, "motor: supportMode=" + ctx.supportMode + ", candidates=" + ctx.candidates.length);
    if (!ctx.notes.length) vac("(b) " + nome, "motor sem nota em " + capId);
    const linhas = linhasDoMapa(w, V, capId);
    if (!linhas.length) vac("(b) " + nome, "o MAP não lista linha alguma para " + capId);
    const sol = (V.TECH_LANDSCAPE[capId].solutions || [])[0];
    if (!sol) vac("(b) " + nome, "landscape de " + capId + " sem solução declarada");
    const cs = cards(d);
    if (cs.length) throw new Error(nome + ": " + cs.length + " card(s) por produto onde o motor vetou — " + listar(d));
    const bloco = vetosBloco(d);
    if (!bloco) throw new Error(nome + ": `[data-p53-vetos]` ausente na seção — atributo ausente");
    const itens = vetoItens(d).map(li => attr(li, "data-p53-veto-item"));
    const faltam = linhas.filter(n => itens.indexOf(n) < 0);
    if (faltam.length) throw new Error(nome + ": linha do MAP sem `li[data-p53-veto-item]`: " + faltam.join(", ") + " (itens: " + J(itens) + ")");
    const distintos = new Set(itens).size;
    if (attr(bloco, "data-p53-vetos") !== String(distintos))
      throw new Error(nome + ": data-p53-vetos=" + J(attr(bloco, "data-p53-vetos")) + " ≠ " + distintos + " linha(s) vetada(s)");
    if (nome === "C4" && attr(bloco, "data-p53-vetos") !== "2")
      throw new Error("C4: data-p53-vetos=" + J(attr(bloco, "data-p53-vetos")) + " ≠ \"2\" (FortiAnalyzer e FortiSIEM)");
    vetoItens(d).forEach(li => {
      const t = txt(li);
      if (t.indexOf(ctx.notes[0]) < 0) throw new Error(nome + " · " + attr(li, "data-p53-veto-item") + ": veto sem a nota literal " + J(ctx.notes[0]));
      if (t.indexOf("Tecnologia declarada") < 0) throw new Error(nome + " · " + attr(li, "data-p53-veto-item") + ": veto sem \"Tecnologia declarada\"");
      if (t.indexOf("Tecnologia declarada: " + sol.product + " (" + sol.status) < 0)
        throw new Error(nome + " · " + attr(li, "data-p53-veto-item") + ": veto sem \"Tecnologia declarada: " + sol.product + " (" + sol.status + "…\"");
    });
  }))],

  /* (c) C6 — variante NDR sob a linha FortiNDR */
  ["(c) C6 · fortindr-onprem sob a linha FortiNDR", () => com("C6", ({ w, d, V }) => {
    bridge(w);
    const cands = V.resolveCandidates("network-detection").map(c => c.itemId);
    if (cands.indexOf("fortindr-onprem") < 0) vac("(c)", "resolveCandidates(network-detection) não traz fortindr-onprem: " + J(cands));
    const card = sec(d).querySelector(':scope > .apoio-block[data-p53-sol-item-id="fortindr-onprem"]');
    if (!card) throw new Error("card `[data-p53-sol-item-id=\"fortindr-onprem\"]` ausente — atributo ausente; cards hoje: " + listar(d));
    const h4 = txt(card.querySelector("h4"));
    if (h4 !== V.OFFERINGS["fortindr-onprem"].name) throw new Error("h4 = " + J(h4) + " ≠ " + J(V.OFFERINGS["fortindr-onprem"].name));
    if (attr(card, "data-p53-sol-produto") !== "FortiNDR")
      throw new Error("data-p53-sol-produto = " + J(attr(card, "data-p53-sol-produto")) + " ≠ \"FortiNDR\" (linha)");
  })],

  /* (d) C7 — serviço gerenciado: elegibilidade é do motor; SOCaaS é o controle positivo */
  ["(d) C7 · MDR inelegível vetado; SOCaaS servico prioritária; extensão FortiXDR", () => com("C7", ({ w, d, V }) => {
    bridge(w);
    const el = V.serviceEligibility("fortiguard-mdr");
    if (el.eligible !== false || !/^base declarada apenas em deployments não elegíveis/.test(el.reason))
      vac("(d)", "serviceEligibility(fortiguard-mdr) = " + J(el) + " — a fixture perdeu o sujeito");
    const ctxEp = ctxDe(V, "endpoint-detection");
    const ext = ctxEp.candidates.filter(c => c.itemId === "fortixdr" && c.itemKind === "contextual-extension")[0];
    if (!ext || !ext.scopeNote) vac("(d)", "motor não anexou fortixdr como contextual-extension em endpoint-detection");
    if (!ctxEp.notes.length) vac("(d)", "endpoint-detection sem nota do motor");
    const socaas = ["continuous-monitoring", "soc-staffing"].map(c => ctxDe(V, c).services.filter(s => s.serviceId === "fortiguard-socaas")[0]).filter(Boolean)[0];
    if (!socaas || (socaas.triggeredBy || []).indexOf("capability-gap") < 0)
      vac("(d)", "motor não disparou fortiguard-socaas por capability-gap: " + J(socaas || null));
    const cm = ctxDe(V, "continuous-monitoring");
    if (!(cm.maturity && cm.maturity.state === "gap-high")) vac("(d)", "continuous-monitoring não está em gap-high");
    if (cardDe(d, "FortiGuard MDR"))
      throw new Error("card `FortiGuard MDR` presente apesar de serviceEligibility inelegível (" + el.reason + ") — cards: " + listar(d));
    const vMdr = vetoDe(d, "FortiGuard MDR");
    if (!vMdr) throw new Error("`li[data-p53-veto-item=\"FortiGuard MDR\"]` ausente" + (vetosBloco(d) ? "" : " — `[data-p53-vetos]` ausente na seção"));
    if (txt(vMdr).indexOf(el.reason) < 0) throw new Error("veto do MDR sem a reason literal " + J(el.reason) + ": " + J(txt(vMdr)));
    const cS = cardDe(d, "FortiGuard SOCaaS");
    if (!cS) throw new Error("card `FortiGuard SOCaaS` ausente (controle positivo) — cards: " + listar(d));
    if (attr(cS, "data-p53-sol-acao") !== "servico") throw new Error("SOCaaS: data-p53-sol-acao = " + J(attr(cS, "data-p53-sol-acao")) + " ≠ \"servico\"");
    if (attr(cS, "data-p53-sol-tier") !== "prioritaria") throw new Error("SOCaaS: data-p53-sol-tier = " + J(attr(cS, "data-p53-sol-tier")) + " ≠ \"prioritaria\"");
    if (attr(cS, "data-p53-sol-origem") !== "gap") throw new Error("SOCaaS: data-p53-sol-origem = " + J(attr(cS, "data-p53-sol-origem")) + " ≠ \"gap\"");
    const elig = cS.querySelector(".p53-sol-elig");
    if (!elig) throw new Error("SOCaaS: `.p53-sol-elig` ausente");
    if (txt(elig).indexOf(socaas.note) < 0) throw new Error("SOCaaS: `.p53-sol-elig` sem o note literal " + J(socaas.note) + ": " + J(txt(elig)));
    const vEp = vetoDe(d, "FortiEndpoint");
    if (!vEp) throw new Error("`li[data-p53-veto-item=\"FortiEndpoint\"]` ausente");
    if (!vEp.querySelector('[data-p53-sol-extensao="fortixdr"]')) throw new Error("veto do FortiEndpoint sem `[data-p53-sol-extensao=\"fortixdr\"]`");
    if (txt(vEp).indexOf(ext.scopeNote) < 0) throw new Error("veto do FortiEndpoint sem o scopeNote M50 literal " + J(ext.scopeNote));
    if (txt(vEp).indexOf("Tecnologia declarada: FortiEDR (production, on-prem)") < 0)
      throw new Error("veto do FortiEndpoint sem \"Tecnologia declarada: FortiEDR (production, on-prem)\": " + J(txt(vEp)));
  })],

  /* (e) C10 — variantes fundidas na linha, nunca card próprio (E2/022) */
  ["(e) C10 · FortiSIEM com variantes, sem card FortiSIEM Cloud", () => com("C10", ({ w, d, V }) => {
    bridge(w);
    const cands = V.resolveCandidates("security-analytics").map(c => c.itemId);
    if (cands.indexOf("fortisiem") < 0 || cands.indexOf("fortisiem-cloud") < 0)
      vac("(e)", "resolveCandidates(security-analytics) não traz fortisiem e fortisiem-cloud: " + J(cands));
    const card = cardDe(d, "FortiSIEM");
    if (!card) throw new Error("card `FortiSIEM` ausente — cards: " + listar(d));
    if (attr(card, "data-p53-sol-variantes") !== "fortisiem, fortisiem-cloud")
      throw new Error("FortiSIEM: data-p53-sol-variantes = " + J(attr(card, "data-p53-sol-variantes")) + " ≠ \"fortisiem, fortisiem-cloud\"");
    if (cardDe(d, "FortiSIEM Cloud") || cards(d).some(c => txt(c.querySelector("h4")) === "FortiSIEM Cloud"))
      throw new Error("nasceu card \"FortiSIEM Cloud\" — variante de uma linha virou card próprio (E2/022)");
  })],

  /* (f) C7 — precedência: veto > hipótese da mesma chave em OUTRA capability (E4) */
  ["(f) C7 · precedência veto > hipótese (MDR via team-capacity)", () => com("C7", ({ w, d, V }) => {
    bridge(w);
    const tc = w.eval('MAP["team-capacity"].lv[0].c.map(function(c){return c.p})');
    if (tc.indexOf("FortiGuard-MDR-Service") < 0) vac("(f)", "MAP[team-capacity].lv[0] não lista FortiGuard-MDR-Service: " + J(tc));
    if (!hipoteseDoMapa(w).some(x => x.qid === "team-capacity" && x.chave === "FortiGuard-MDR-Service"))
      vac("(f)", "computeFindings() não produziu a hipótese FortiGuard-MDR-Service × team-capacity");
    if (V.classify("soc-staffing").c !== "CONTEXT_NOT_INFORMED") vac("(f)", "soc-staffing não é CONTEXT_NOT_INFORMED");
    if (V.serviceEligibility("fortiguard-mdr").eligible !== false) vac("(f)", "MDR elegível — sem veto a preceder");
    if (cardDe(d, "FortiGuard MDR"))
      throw new Error("card `FortiGuard MDR` presente: a hipótese de team-capacity venceu o veto de elegibilidade — " + listar(d));
  })],

  /* (g) totalidade do pareamento — e o produto concorda */
  ["(g) pareamento total; toda chave com pré-imagem; o produto concorda", () => {
    com("C1", ({ w, V }) => {
      const P = w.eval("PRODUCTS"), par = pareamento(V, P);
      const indef = par.dominio.filter(id => par.chaveDe(id) === undefined);
      if (indef.length) throw new Error("chaveDe indefinido para " + J(indef));
      const chavesP = Object.keys(P);
      if (chavesP.length !== 13) vac("(g)", "PRODUCTS tem " + chavesP.length + " chaves, esperadas 13 — o catálogo congelado mudou");
      const semPre = chavesP.filter(k => !par.idsDaLinha(k).length);
      if (semPre.length) throw new Error("chave de PRODUCTS sem pré-imagem: " + J(semPre));
      if (par.idsDaLinha("FortiGuard-Service-Bundle").indexOf("ir-training") < 0)
        throw new Error("a pré-imagem de FortiGuard-Service-Bundle não nasce da regra 4");
      const nulos = ["fortisoc", "fortimail", "fortimail-wss", "fortimail-cloud-saas", "fortiaigate", "fortipam", "fortiauthenticator", "fortisat"];
      const naoNulos = nulos.filter(id => par.chaveDe(id) !== null);
      if (naoNulos.length) throw new Error("deveriam parear com null: " + J(naoNulos.map(id => id + "→" + par.chaveDe(id))));
      const esperados = { fortiedr: "FortiEndpoint", "endpoint-family": "FortiEndpoint", "fortindr-onprem": "FortiNDR",
        "fortindr-cloud": "FortiNDR", "fortisiem-cloud": "FortiSIEM", "fortiguard-socaas": "SOCaaS", "fortiguard-mdr": "FortiGuard-MDR-Service" };
      Object.keys(esperados).forEach(id => {
        if (par.chaveDe(id) !== esperados[id]) throw new Error("chaveDe(" + id + ") = " + J(par.chaveDe(id)) + " ≠ " + J(esperados[id]));
      });
      ["SOCaaS", "FortiGuard-MDR-Service", "FortiGuard-Service-Bundle"].forEach(k => {
        if (!par.idsDaLinha(k).some(id => !!V.SERVICES[id])) throw new Error("linha " + k + " sem id de SERVICES na pré-imagem");
      });
    });
    /* o produto concorda: todo portador de `data-p53-sol-item-id` (card ou veto)
       está sob a linha que o pareamento reimplementado dá */
    let portadores = 0;
    ["C1", "C6", "C7", "C10", "F2-placeholder"].forEach(nome => com(nome, ({ w, d, V }) => {
      const P = w.eval("PRODUCTS"), par = pareamento(V, P);
      qa(sec(d), "[data-p53-sol-item-id]").forEach(n => {
        portadores++;
        const id = attr(n, "data-p53-sol-item-id");
        const card = n.closest("[data-p53-sol-produto]"), li = n.closest("[data-p53-veto-item]");
        const linha = card ? attr(card, "data-p53-sol-produto") : (li ? attr(li, "data-p53-veto-item") : null);
        const k = par.chaveDe(id);
        if (k === undefined) throw new Error(nome + ": item-id fora de OFFERINGS ∪ SERVICES: " + J(id));
        const esperado = k === null ? ((V.OFFERINGS[id] || V.SERVICES[id]).name) : P[k].n;
        if (linha !== esperado) throw new Error(nome + ": item-id " + id + " sob a linha " + J(linha) + " ≠ " + J(esperado) + " (chave reimplementada " + J(k) + ")");
        const vars = attr(n, "data-p53-sol-variantes");
        if (vars) vars.split(",").map(s => s.trim()).forEach(vid => {
          if (par.chaveDe(vid) !== k) throw new Error(nome + ": variante " + vid + " listada sob " + id + " pareia com " + J(par.chaveDe(vid)) + " ≠ " + J(k));
        });
      });
    }));
    if (!portadores) vac("(g)", "nenhum `[data-p53-sol-item-id]` em C1/C6/C7/C10/F2 — atributo ausente, o produto não declara identidade");
  }],

  /* (h) published() ≡ tela ≡ papel */
  ["(h) C1/C7/C10 · published() ≡ tela ≡ papel", () => ["C1", "C7", "C10"].forEach(nome => com(nome, ({ w, d }) => {
    const b = bridge(w), P = w.eval("PRODUCTS");
    const pub = b.published().map(id => (P[id] && P[id].n) || id).sort();
    if (!pub.length) vac("(h) " + nome, "nada publicado");
    const tela = Array.from(new Set(cards(d).map(c => attr(c, "data-p53-sol-produto")))).sort();
    const rel = papel(w, d);
    const pap = Array.from(new Set(prCards(rel).map(c => attr(c, "data-p53-sol-produto")))).sort();
    fimPapel(w);
    if (J(pub) !== J(tela)) throw new Error(nome + ": published()=" + J(pub) + " ≠ tela=" + J(tela));
    if (J(tela) !== J(pap)) throw new Error(nome + ": tela=" + J(tela) + " ≠ papel=" + J(pap));
  }))],

  /* (i) F2-placeholder — família sem variante resolvida: modalidade a definir, nunca prioritária (E9) */
  ["(i) F2 · placeholder endpoint-family: modalidade-a-definir, validacao", () => com("F2-placeholder", ({ w, d, V }) => {
    const b = bridge(w);
    const ctx = ctxDe(V, "endpoint-detection");
    if (!(ctx.candidates[0] && ctx.candidates[0].itemKind === "family"))
      vac("(i)", "candidates[0] de endpoint-detection não é placeholder family: " + J(ctx.candidates.map(c => c.itemId + "/" + c.itemKind)));
    const card = cardDe(d, "FortiEndpoint");
    if (!card) throw new Error("card `FortiEndpoint` ausente — cards: " + listar(d));
    if (attr(card, "data-p53-sol-item-id") !== "endpoint-family")
      throw new Error("data-p53-sol-item-id = " + J(attr(card, "data-p53-sol-item-id")) + " ≠ \"endpoint-family\"");
    if (attr(card, "data-p53-sol-acao") !== "modalidade-a-definir")
      throw new Error("data-p53-sol-acao = " + J(attr(card, "data-p53-sol-acao")) + " ≠ \"modalidade-a-definir\"");
    if (attr(card, "data-p53-sol-tier") !== "validacao")
      throw new Error("data-p53-sol-tier = " + J(attr(card, "data-p53-sol-tier")) + " ≠ \"validacao\" (E9: placeholder nunca é prioritária)");
    const v = card.querySelector(".p53-sol-variante");
    if (!v || !txt(v)) throw new Error("`.p53-sol-variante` ausente ou vazio no placeholder");
    const n = cards(d).length, p = b.published().length;
    if (n !== p) throw new Error("cards na tela (" + n + ") ≠ published() (" + p + ")");
  })]
]));

/* ==========================================================================
   D026-PAP1 · o papel diz o que a tela diz, por card (QS-02)
   ========================================================================== */
T("D026-PAP1", "o papel diz o que a tela diz, por card: qualificador, ação, origem, condição, variante, escopo e vetos", () => alineas([

  ["(a) C5 · todo pr-card com qualificador; escopos do MAP", () => com("C5", ({ w, d, V }) => {
    if (V.isLegacyModeV32() !== true) vac("(a)", "C5 não está em modo legado");
    const cs = cards(d);
    if (!cs.length) vac("(a)", "nenhum card na tela em C5");
    const contagem = {};
    cs.forEach(c => { const t = attr(c, "data-p53-sol-tier"); contagem[t] = (contagem[t] || 0) + 1; });
    const rel = papel(w, d);
    try {
      const prs = prCards(rel);
      if (!prs.length) vac("(a)", "nenhum pr-card em #pr-sup-solucao");
      const comTier = prs.filter(p => attr(p, "data-p53-sol-tier") && p.querySelector(".p53-pr-tier"));
      if (comTier.length !== prs.length)
        throw new Error("pr-card com data-p53-sol-tier e .p53-pr-tier: " + comTier.length + "/" + prs.length +
          " (tela: " + cs.length + " cards, " + J(contagem) + ") — o papel perde o qualificador (QS-02)");
      compararCards("C5", cs, prs);
      const mapa = hipoteseDoMapa(w);
      const snDe = nome => mapa.filter(x => x.nome === nome && x.sn).map(x => x.sn);
      const prEp = prCardDe(rel, "FortiEndpoint");
      if (!prEp) vac("(a)", "pr-card FortiEndpoint ausente");
      if (!snDe("FortiEndpoint").length) vac("(a)", "o MAP não dá escopo (sn) ao FortiEndpoint nesta fixture");
      const eEp = prEp.querySelector(".p53-pr-escopo");
      if (!eEp) throw new Error("pr-card FortiEndpoint sem `.p53-pr-escopo` (MAP sn: " + J(snDe("FortiEndpoint")) + ")");
      if (txt(eEp).indexOf("Escopo: cobre a camada de endpoint") < 0) throw new Error("escopo do FortiEndpoint = " + J(txt(eEp)));
      const prRc = prCardDe(rel, "FortiRecon");
      if (!prRc) vac("(a)", "pr-card FortiRecon ausente");
      const eRc = prRc.querySelector(".p53-pr-escopo");
      if (!eRc) throw new Error("pr-card FortiRecon sem `.p53-pr-escopo` (MAP sn: " + J(snDe("FortiRecon")) + ")");
      if (txt(eRc).indexOf("complementa o programa de gestão de vulnerabilidades") < 0) throw new Error("escopo do FortiRecon = " + J(txt(eRc)));
    } finally { fimPapel(w); }
  })],

  ["(b) C1 · cópia por card; <b> FortiEDR + variante", () => com("C1", ({ w, d, V }) => {
    const cs = cards(d), rel = papel(w, d);
    try {
      compararCards("C1", cs, prCards(rel));
      const p = prCardDe(rel, "FortiEndpoint");
      if (!p) vac("(b)", "pr-card FortiEndpoint ausente");
      const bq = p.querySelector("b");
      if (txt(bq) !== V.OFFERINGS.fortiedr.name) throw new Error("<b> = " + J(txt(bq)) + " ≠ " + J(V.OFFERINGS.fortiedr.name));
      const pv = p.querySelector(".p53-pr-variante");
      if (!pv || !txt(pv)) throw new Error("`.p53-pr-variante` ausente ou vazio no pr-card FortiEndpoint");
      const tv = cardDe(d, "FortiEndpoint").querySelector(".p53-sol-variante");
      if (tv && txt(tv) !== txt(pv)) throw new Error("variante diverge tela/papel: " + J(txt(tv)) + " × " + J(txt(pv)));
    } finally { fimPapel(w); }
  })],

  ["(c) C7 · cópia por card; vetos com a mesma contagem e itens", () => com("C7", ({ w, d }) => {
    const cs = cards(d), rel = papel(w, d);
    try { compararCards("C7", cs, prCards(rel)); compararVetos("C7", d, rel); }
    finally { fimPapel(w); }
  })],

  ["(d) C9 · após validação, origem sinal, sinais", () => com("C9", ({ w, d, V }) => {
    const ctx = ctxDe(V, "data-loss-prevention");
    if (!ctx.candidates.some(c => c.itemId === "fortidlp" && c.signals && c.signals.length))
      vac("(d)", "motor não habilitou fortidlp por sinal em data-loss-prevention");
    const cs = cards(d), rel = papel(w, d);
    try {
      compararCards("C9", cs, prCards(rel));
      const p = prCardDe(rel, "FortiDLP");
      if (!p) vac("(d)", "pr-card FortiDLP ausente");
      if (txt(p.querySelector(".p53-pr-tier")) !== "após validação") throw new Error("FortiDLP: `.p53-pr-tier` = " + J(txt(p.querySelector(".p53-pr-tier"))));
      if (attr(p, "data-p53-sol-origem") !== "sinal") throw new Error("FortiDLP: data-p53-sol-origem = " + J(attr(p, "data-p53-sol-origem")) + " ≠ \"sinal\"");
      if (!attr(p, "data-qs22-sinais")) throw new Error("FortiDLP: data-qs22-sinais vazio no papel");
    } finally { fimPapel(w); }
  })],

  ["(e) C10 · cópia por card, variantes", () => com("C10", ({ w, d }) => {
    const cs = cards(d), rel = papel(w, d);
    try {
      compararCards("C10", cs, prCards(rel));
      const p = prCardDe(rel, "FortiSIEM");
      if (!p) vac("(e)", "pr-card FortiSIEM ausente");
      if (attr(p, "data-p53-sol-variantes") !== "fortisiem, fortisiem-cloud")
        throw new Error("FortiSIEM: data-p53-sol-variantes no papel = " + J(attr(p, "data-p53-sol-variantes")));
    } finally { fimPapel(w); }
  })],

  ["(f) C2/C4 · a seção existe no papel só com o bloco de vetos", () => ["C2", "C4"].forEach(nome => com(nome, ({ w, d }) => {
    if (!vetosBloco(d)) throw new Error(nome + ": `[data-p53-vetos]` ausente na tela — atributo ausente, sem sujeito");
    const rel = papel(w, d);
    try {
      const s = rel.querySelector("#pr-sup-solucao");
      if (!s) throw new Error(nome + ": `#pr-sup-solucao` ausente no papel com veto na tela");
      const prs = prCards(rel);
      if (prs.length) throw new Error(nome + ": " + prs.length + " pr-card onde o motor vetou: " + J(prs.map(p => attr(p, "data-p53-sol-produto"))));
      compararVetos(nome, d, rel);
    } finally { fimPapel(w); }
  }))]
]));

/* ==========================================================================
   D026-LEG1 · sem voz do motor nada é inventado; a derivação é pura
   ========================================================================== */
T("D026-LEG1", "sem voz do motor nada é inventado (hipótese condicionada); gate fechado sem veto; derivação pura; exclusão por linha", () => alineas([

  ["(a) C8 · legado: hipótese sem-contexto ≡ computeFindings()+MAP", () => com("C8", ({ w, d, V }) => {
    const b = bridge(w);
    if (V.isLegacyModeV32() !== true) vac("(a)", "C8 não está em modo legado");
    const mapa = hipoteseDoMapa(w);
    if (!mapa.length) vac("(a)", "o MAP não oferece linha alguma em C8");
    const regs = b.oferta();
    const espL = new Set(mapa.map(x => x.nome)), espP = new Set(mapa.map(x => x.nome + " × " + x.cap));
    const obsL = new Set(regs.map(r => r.nome)), obsP = new Set();
    regs.forEach(r => (r.capabilities || []).forEach(c => obsP.add(r.nome + " × " + c.texto)));
    const dif = (a, b2) => [...a].filter(x => !b2.has(x));
    if (dif(espL, obsL).length) throw new Error("linha SUMIU em oferta(): " + dif(espL, obsL).join(", "));
    if (dif(obsL, espL).length) throw new Error("linha NASCEU em oferta(): " + dif(obsL, espL).join(", "));
    if (dif(espP, obsP).length) throw new Error("par SUMIU em oferta(): " + dif(espP, obsP).slice(0, 4).join(" · "));
    if (dif(obsP, espP).length) throw new Error("par NASCEU em oferta(): " + dif(obsP, espP).slice(0, 4).join(" · "));
    regs.forEach(r => {
      if (r.acao !== "hipotese" || r.condicao !== "sem-contexto")
        throw new Error("registro " + r.nome + ": acao=" + J(r.acao) + ", condicao=" + J(r.condicao) + " — legado é hipótese · sem-contexto");
    });
    const cp = copy(w), obsT = new Set();
    cards(d).forEach(c => qa(c, "[data-p53-sol-cap]").forEach(li => obsT.add(attr(c, "data-p53-sol-produto") + " × " + attr(li, "data-p53-sol-cap"))));
    const espT = new Set(mapa.map(x => x.nome + " × " + cp(x.cap).replace(/\s+/g, " ").trim()));
    if (dif(espT, obsT).length) throw new Error("par SUMIU na tela: " + dif(espT, obsT).slice(0, 4).join(" · "));
    if (dif(obsT, espT).length) throw new Error("par NASCEU na tela: " + dif(obsT, espT).slice(0, 4).join(" · "));
    const card = cardDe(d, "FortiEndpoint");
    if (!card) throw new Error("card `FortiEndpoint` ausente — cards: " + listar(d));
    if (attr(card, "data-p53-sol-acao") !== "hipotese") throw new Error("data-p53-sol-acao = " + J(attr(card, "data-p53-sol-acao")) + " ≠ \"hipotese\"");
    if (attr(card, "data-p53-sol-condicao") !== "sem-contexto") throw new Error("data-p53-sol-condicao = " + J(attr(card, "data-p53-sol-condicao")) + " ≠ \"sem-contexto\"");
    const tierEsp = tierDaHipotese(w, "FortiEndpoint");
    if (attr(card, "data-p53-sol-tier") !== tierEsp || tierEsp !== "prioritaria")
      throw new Error("data-p53-sol-tier = " + J(attr(card, "data-p53-sol-tier")) + " ≠ " + J(tierEsp) + " (sev do MAP)");
    const cond = card.querySelector(".p53-sol-condicao");
    if (!cond || !txt(cond)) throw new Error("`.p53-sol-condicao` ausente ou vazio — a condição não é visível");
    if (vetosBloco(d)) throw new Error("`[data-p53-vetos]` presente em modo legado");
  })],

  ["(b) C7-UNSET · MDR hipótese capability-nao-informada (D-6, INV-2)", () => com("C7-UNSET", ({ w, d, V }) => {
    bridge(w);
    if (V.TECH_LANDSCAPE["endpoint-detection"].presence !== "UNSET") vac("(b)", "endpoint-detection não está UNSET");
    const el = V.serviceEligibility("fortiguard-mdr");
    if (!/^base requerida ausente/.test(el.reason)) vac("(b)", "serviceEligibility(fortiguard-mdr) = " + J(el));
    if (!hipoteseDoMapa(w).some(x => x.chave === "FortiGuard-MDR-Service")) vac("(b)", "o MAP não oferece FortiGuard-MDR-Service");
    const card = cardDe(d, "FortiGuard MDR");
    if (!card) throw new Error("card `FortiGuard MDR` ausente — não informado foi lido como ausente (INV-2); cards: " + listar(d));
    if (attr(card, "data-p53-sol-acao") !== "hipotese") throw new Error("MDR: data-p53-sol-acao = " + J(attr(card, "data-p53-sol-acao")) + " ≠ \"hipotese\"");
    if (attr(card, "data-p53-sol-condicao") !== "capability-nao-informada")
      throw new Error("MDR: data-p53-sol-condicao = " + J(attr(card, "data-p53-sol-condicao")) + " ≠ \"capability-nao-informada\"");
    if (vetosBloco(d)) throw new Error("`[data-p53-vetos]` presente em C7-UNSET: " + J(vetoItens(d).map(li => attr(li, "data-p53-veto-item"))));
  })],

  ["(c) C3 · constante desligada (hipótese); C3b · plataforma cobre (veto M75)", () => {
    com("C3", ({ w, d, V }) => {
      bridge(w);
      if (V.classify("security-automation").c !== "CONTEXT_NOT_INFORMED") vac("(c) C3", "security-automation não é CONTEXT_NOT_INFORMED");
      if (!V.suppressedByPlatform().caps.has("security-automation")) vac("(c) C3", "suppressedByPlatform() não cobre security-automation");
      const card = cardDe(d, "FortiSOAR");
      if (!card) throw new Error("C3: card `FortiSOAR` ausente — cards: " + listar(d));
      if (attr(card, "data-p53-sol-condicao") !== "capability-nao-informada")
        throw new Error("C3: data-p53-sol-condicao = " + J(attr(card, "data-p53-sol-condicao")) + " ≠ \"capability-nao-informada\"");
      const tierEsp = tierDaHipotese(w, "FortiSOAR");
      if (attr(card, "data-p53-sol-tier") !== "prioritaria" || tierEsp !== "prioritaria")
        throw new Error("C3: data-p53-sol-tier = " + J(attr(card, "data-p53-sol-tier")) + ", MAP diz " + J(tierEsp));
      if (vetosBloco(d)) throw new Error("C3: `[data-p53-vetos]` presente — a constante CONTEXTO_SUPRIMIDO_POR_PLATAFORMA não está em false");
      if (aviso(d)) throw new Error("C3: `[data-p53-suprimido]` presente sem curadoria");
    });
    com("C3b", ({ w, d, V }) => {
      const ctx = ctxDe(V, "security-automation");
      if (ctx.classification !== "OPERATIONAL_GAP" || !ctx.notes.some(n => n.indexOf("M75") >= 0))
        vac("(c) C3b", "security-automation: " + ctx.classification + " notas " + J(ctx.notes));
      if (cardDe(d, "FortiSOAR")) throw new Error("C3b: card `FortiSOAR` presente onde a plataforma declarada cobre — " + listar(d));
      const li = vetoDe(d, "FortiSOAR");
      if (!li) throw new Error("C3b: `li[data-p53-veto-item=\"FortiSOAR\"]` ausente" + (vetosBloco(d) ? "" : " — `[data-p53-vetos]` ausente"));
      const classe = attr(li, "data-p53-veto-classe");
      if (["operacional", "plataforma"].indexOf(classe) < 0) throw new Error("C3b: data-p53-veto-classe = " + J(classe));
      if (txt(li).indexOf("M75") < 0) throw new Error("C3b: veto sem \"M75\": " + J(txt(li)));
    });
  }],

  ["(d) GF ×2 · gate fechado: hipótese contexto-a-validar, zero veto", () => [
    ["GF-NONE", "NEEDS_VALIDATION"], ["GF-TERCEIRO", "OPERATIONAL_GAP"]
  ].forEach(par => com(par[0], ({ w, d, V }) => {
    const nome = par[0];
    const g = d.getElementById("p50-results");
    if (!g || attr(g, "data-p50-gate") === "released") vac("(d) " + nome, "`#p50-results[data-p50-gate]` = " + J(attr(g, "data-p50-gate")) + " — o gate não está fechado");
    const suff = w.__P50SUFF && w.__P50SUFF.contract();
    if (!suff || suff.sufficient !== false) vac("(d) " + nome, "`__P50SUFF.contract().sufficient` ≠ false");
    const cls = V.classify("endpoint-detection").c;
    if (cls !== par[1]) vac("(d) " + nome, "classify(endpoint-detection) = " + cls + " ≠ " + par[1]);
    const cs = cards(d);
    if (!cs.length) vac("(d) " + nome, "nenhum card de hipótese sob gate fechado");
    cs.forEach(c => {
      if (attr(c, "data-p53-sol-acao") !== "hipotese")
        throw new Error(nome + " · " + attr(c, "data-p53-sol-produto") + ": data-p53-sol-acao = " + J(attr(c, "data-p53-sol-acao")) + " ≠ \"hipotese\"");
    });
    const ep = cardDe(d, "FortiEndpoint");
    if (!ep) throw new Error(nome + ": card `FortiEndpoint` ausente sob gate fechado — " + listar(d));
    if (attr(ep, "data-p53-sol-condicao") !== "contexto-a-validar")
      throw new Error(nome + ": FortiEndpoint data-p53-sol-condicao = " + J(attr(ep, "data-p53-sol-condicao")) + " ≠ \"contexto-a-validar\"");
    if (vetosBloco(d)) throw new Error(nome + ": `[data-p53-vetos]` sob gate fechado (INV-3): " + J(vetoItens(d).map(li => attr(li, "data-p53-veto-item"))));
  }))],

  ["(e) C2/C4/C7/C3b · onde há veto: substituto, congelada oculta, sem supressão", () => ["C2", "C4", "C7", "C3b"].forEach(nome => com(nome, ({ w, d }) => {
    if (!vetosBloco(d)) throw new Error(nome + ": `[data-p53-vetos]` ausente — atributo ausente, sem sujeito");
    if (FX010.d010HasSubstitute(w) !== true) throw new Error(nome + ": `d010HasSubstitute` é falso com veto na tela — o veto devolveria a Camada 1");
    const c = censo(d);
    if (!c.length) vac("(e) " + nome, "nenhum nó congelado no censo");
    const vis = c.filter(x => x.tipo === "bloco" && !x.produto && !x.oculto).map(x => x.chave);
    if (vis.length) throw new Error(nome + ": `.apoio-block` congelado VISÍVEL com veto: " + J(vis));
    if (aviso(d)) throw new Error(nome + ": `[data-p53-suprimido]` presente sem curadoria — veto não é supressão");
  }))],

  ["(f) pureza: reconcile; oferta()/vetos()/contract() sem efeito; toSession sem derivado", () => com("C1", ({ w, d, V }) => {
    const b = bridge(w);
    const antesLeg = w.__DEV.legacySnapshot(), antesCtx = J(V.buildRecommendationContext());
    const c1 = b.contract(); b.oferta(); b.vetos();
    if (w.__DEV.legacySnapshot() !== antesLeg) throw new Error("`legacySnapshot()` mudou após oferta()/vetos()/contract()");
    if (J(V.buildRecommendationContext()) !== antesCtx) throw new Error("`buildRecommendationContext()` mudou após oferta()/vetos()/contract()");
    ["published", "offered", "architectureNote", "operatorChoices", "suppressed", "oferta", "vetos"].forEach(k => {
      if (!(k in c1)) throw new Error("`contract()` sem o campo " + k);
    });
    const entrada = montarEntrada(w, V), e0 = J(entrada);
    const r1 = b.reconcile(entrada);
    if (!r1 || !Array.isArray(r1.registros) || !Array.isArray(r1.vetos)) throw new Error("`reconcile(entrada)` não devolve { registros[], vetos[] }");
    const s1 = J(r1), s2 = J(b.reconcile(JSON.parse(e0)));
    if (s1 !== s2) throw new Error("`reconcile` não é pura: a mesma entrada produziu saídas diferentes");
    if (J(entrada) !== e0) throw new Error("`reconcile` mutou a entrada");
    if (J(b.reconcile(entrada)) !== s1) throw new Error("`reconcile` não é idempotente sobre a mesma referência");
    w.__DEV.showResults();
    b.set("FortiEndpoint", "exclude");
    if (J(b.toSession()) !== J({ decisions: { FortiEndpoint: "exclude" } })) throw new Error("`toSession()` = " + J(b.toSession()));
    const RD = w.eval("RESERVED_DERIVED");
    if (!Array.isArray(RD) || !RD.length) vac("(f)", "`RESERVED_DERIVED` ilegível na janela");
    const doc = w.__DEV.buildSessionDocument("d026");
    const chaves = todasAsChaves(doc);
    const vazou = RD.concat(["oferta", "vetos"]).filter(k => chaves.has(k));
    if (vazou.length) throw new Error("documento de sessão carrega derivado: " + J(vazou));
    const inputs = Object.keys(w.__DEV.captureCanonicalInputs());
    if (inputs.indexOf("oferta") >= 0 || inputs.indexOf("vetos") >= 0) throw new Error("`captureCanonicalInputs()` com oferta/vetos: " + J(inputs));
  }, { semRender: true })],

  ["(g) C1 · exclude retira a linha (tela e papel); unset devolve; editor; acréscimo", () => com("C1", ({ w, d }) => {
    const b = bridge(w), P = w.eval("PRODUCTS");
    const sel = ':scope > .apoio-block[data-p53-sol-item-id="fortiedr"]';
    if (!sec(d).querySelector(sel)) vac("(g)", "card `[data-p53-sol-item-id=\"fortiedr\"]` ausente antes da exclusão — atributo ausente; cards: " + listar(d));
    b.set("FortiEndpoint", "exclude"); w.__DEV.showResults();
    if (sec(d).querySelector(sel)) throw new Error("card fortiedr ainda na tela após set(\"FortiEndpoint\",\"exclude\")");
    const av = aviso(d);
    if (!av || attr(av, "data-p53-suprimido") !== "1") throw new Error("tela: `[data-p53-suprimido=\"1\"]` ausente após exclude (" + J(attr(av, "data-p53-suprimido")) + ")");
    let rel = papel(w, d);
    try {
      if (rel.querySelector('#pr-sup-solucao [data-p53-sol-item-id="fortiedr"]')) throw new Error("papel: card fortiedr presente após exclude");
      if (!rel.querySelector('#pr-sup-solucao [data-p53-suprimido="1"]')) throw new Error("papel: `[data-p53-suprimido=\"1\"]` ausente após exclude");
    } finally { fimPapel(w); }
    b.unset("FortiEndpoint"); w.__DEV.showResults();
    if (!sec(d).querySelector(sel)) throw new Error("unset não devolveu o card `[data-p53-sol-item-id=\"fortiedr\"]`");
    abrirPainel(d);
    const item = d.querySelector('[data-p53-cur-item="FortiEndpoint"]');
    if (!item) throw new Error("editor: `[data-p53-cur-item=\"FortiEndpoint\"]` ausente no painel — a linha não é curável");
    const vr = item.querySelector(".p53-cur-item-var");
    if (vr && txt(vr).indexOf("FortiEDR") < 0) throw new Error("editor: `.p53-cur-item-var` = " + J(txt(vr)) + " sem \"FortiEDR\"");
    const extra = b.catalog().filter(id => b.offered().indexOf(id) < 0)[0];
    if (!extra) vac("(g)", "todo o catálogo foi ofertado — sem acréscimo possível");
    b.set(extra, "include"); w.__DEV.showResults();
    const nomeX = P[extra].n;
    const chk = (c, onde) => {
      if (!c) throw new Error(onde + ": card acrescentado `" + nomeX + "` ausente");
      if (attr(c.querySelector("[data-p53-prov]"), "data-p53-prov") !== "operador") throw new Error(onde + ": `[data-p53-prov=\"operador\"]` ausente no acréscimo");
      if (attr(c, "data-p53-sol-origem") !== "operador") throw new Error(onde + ": data-p53-sol-origem = " + J(attr(c, "data-p53-sol-origem")) + " ≠ \"operador\"");
      if (attr(c, "data-p53-sol-acao") !== "hipotese") throw new Error(onde + ": data-p53-sol-acao = " + J(attr(c, "data-p53-sol-acao")) + " ≠ \"hipotese\"");
      if (attr(c, "data-p53-sol-tier") !== null) throw new Error(onde + ": acréscimo com data-p53-sol-tier = " + J(attr(c, "data-p53-sol-tier")));
    };
    chk(cardDe(d, nomeX), "tela");
    rel = papel(w, d);
    try { chk(prCardDe(rel, nomeX), "papel"); } finally { fimPapel(w); }
  })]
]));

/* ---------------------------------------------------------------- resumo */
const pass = results.filter(r => r.ok).length, fail = results.length - pass;
console.log("\nD026 CONTRATO: " + pass + " PASS · " + fail + " FAIL de " + results.length);
if (fail) process.exitCode = 1;
