/* ============================================================================
   HARNESS DE MUTAÇÃO · D009 — LEITURA DO RELATÓRIO
   demanda `009-leitura-do-relatorio` · T018 (wave 6) · dono: qa-engineer

   Prova o PODER DISCRIMINANTE dos 15 gates de `tests_009_leitura.js`. Sem um
   mutante morto, um gate verde só prova que o produto não explodiu — R3 §5 e
   R10 tratam isso como gate que não mede.

   Padrão dos harnesses da casa (`tests_core_mutants.js`, `tests_p52_mutants.js`):
     1. âncora textual ÚNICA no source (find casa exatamente 1x — âncora ausente
        ou ambígua é FALHA do harness, nunca "mutante não aplicável" em silêncio);
     2. mutação in-place + rebuild determinístico do HTML gerado;
     3. execução do gate SEMANTICAMENTE correspondente, FILTRADO (`D009_ONLY`);
     4. exige FAIL daquele gate COM MOTIVO compatível — detecção incidental
        (contagem global, outro gate, exceção de boot) NÃO conta como kill;
     5. restauração byte a byte provada por SHA-256, do source E do HTML.

   Este harness NÃO escreve recibo em arquivo versionado (R7 §3): o registro
   canônico vivo do par gate↔mutante é `.claude/verify/mutation-matrix.json`.

   SÃO 19 MUTANTES: `D009-M1`, `D009-M2` e `D009-M4`..`D009-M20`. O `D009-M20`
   entrou na rodada 2, quando a correção do `ui-engineer` criou o ramo em que
   ele ancora; até lá esteve declarado como especificado-e-não-executável, nunca
   como cobertura que existisse. O `M3` da spec
   NÃO é mutante desta campanha — ele permanece `P52-M3` no harness `p52`
   (`tests_p52_mutants.js`), porque a mutação e o oráculo (`P52-TGT1`) são os da
   Phase 5.2; o que a demanda 009 fez lá foi reescrever o registro do mutante,
   não criar um novo.

   Execução: via stage `mutation` do pipeline (trigger por path,
   `.claude/verify/check_mutation.py`) — requires: node + python, SEM Chromium.
   Nenhum gate de `tests_009_leitura.js` mede geometria.

   Filtro de depuração: D009_MUT_ONLY=D009-M5,D009-M9 node tests_009_mutants.js
   ============================================================================ */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const PY = process.platform === "win32" ? "python" : "python3";
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const WS_JS = path.join(HERE, "ui_p52_workspace_v32.js");
const WS_CSS = path.join(HERE, "ui_p52_workspace_v32.css");
const JOURNEY = path.join(HERE, "ui_journey_v32.js");
const TARGET = path.join(HERE, "ui_target_v32.js");
const UI_JS = path.join(HERE, "ui_v32.js");
const UX_CSS = path.join(HERE, "ui_ux_v32.css");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");

const MUTABLE = [WS_JS, WS_CSS, JOURNEY, TARGET, UI_JS, UX_CSS];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });
let BASE_HTML_SHA = null;

const SUITE = "node tests_009_leitura.js";

/* ==========================================================================
   OS 18 MUTANTES

   `gate` é o oráculo que DEVE matar; `reason` é o motivo exigido, casado
   contra a LINHA daquele gate — nunca contra o stdout inteiro. Cada `reason`
   é a mensagem que o próprio gate emite, e não uma contagem agregada.
   ========================================================================== */
const MUTANTS = [
  /* ---------------------------------------------------------------- C1/C2 */
  {
    id: "D009-M1",
    desc: "restaurar a ordem selada da 5.2: o PAR target+context volta para a 2ª/3ª posição de P52_SECTIONS",
    file: WS_JS,
    find: `    { key: "exec",       title: "Visão executiva" },
    { key: "priorities", title: "Prioridades do negócio" },
    { key: "detail",     title: "Domínios e heat map" },
    { key: "gaps",       title: "Gaps observados" },
    { key: "target",     title: "Cenário-alvo" },
    { key: "context",    title: "Contexto tecnológico" },
    { key: "support",    title: "Formas de apoio" },`,
    repl: `    { key: "exec",       title: "Visão executiva" },
    { key: "target",     title: "Cenário-alvo" },
    { key: "context",    title: "Contexto tecnológico" },
    { key: "priorities", title: "Prioridades do negócio" },
    { key: "detail",     title: "Domínios e heat map" },
    { key: "gaps",       title: "Gaps observados" },
    { key: "support",    title: "Formas de apoio" },`,
    gate: "D009-ORD1",
    reason: /!= ordem aberta da spec/,
    /* PROVA DE DESENHO (spec §C1/C3): este mutante tem de SOBREVIVER a
       `P52-TGT1` reancorado — o alvo continua depois de `exec` e colado em
       `context`, logo `iT > iE` e `iC === iT + 1` seguem verdadeiros. É a
       demonstração de que adjacência NÃO deduz sequência e de que a ordem
       completa precisa de gate próprio. Se ele morrer nos dois, o par
       gate↔mutante perdeu o sentido e o achado é do DESENHO, não do produto. */
    sobrevive: { gate: "P52-TGT1", cmd: "node tests_p52_layout.js", env: { P52_ONLY: "P52-TGT1" } }
  },
  {
    id: "D009-M2",
    desc: "p52OrderFor() devolve P52_SECTIONS para qualquer gate (remove a exceção do gate FECHADO)",
    file: WS_JS,
    find: `  function p52OrderFor(gate) {
    if (gate !== "blocked") return P52_SECTIONS;`,
    repl: `  function p52OrderFor(gate) {
    if (true) return P52_SECTIONS;   /* MUTANTE D009-M2 */`,
    gate: "D009-ORD2",
    reason: /!= ordem fechada da spec/
  },
  /* ------------------------------------------------------------------- C4 */
  {
    id: "D009-M4",
    desc: "emitir data-dom com índice deslocado (i+1): a marca deixa de identificar o domínio que marca",
    file: JOURNEY,
    find: '    return i<0? m : `<span class="jn-dom" data-dom="${i}">${m}</span>`;',
    repl: '    return i<0? m : `<span class="jn-dom" data-dom="${i+1}">${m}</span>`;   /* MUTANTE D009-M4 */',
    gate: "D009-DOM1",
    reason: /ocorre \d+x na narrativa e tem \d+ marca\(s\)|marca com data-dom fora de DOMS/
  },
  {
    id: "D009-M5",
    desc: "remover font-weight da regra .jn-dom, deixando a COR como único portador do significado",
    file: UX_CSS,
    /* Âncora byte a byte da linha real de `ui_ux_v32.css` (a mesma armadilha do
       literal `P52_SECTIONS`): reformatar a regra faz o mutante deixar de
       aplicar e o gate perde o discriminante em silêncio. Por isso âncora
       ausente é FALHA do harness, não "não aplicável". */
    find: `.jn-dom{ color:var(--dom-accent); font-weight:700; }`,
    repl: `.jn-dom{ color:var(--dom-accent); }`,
    gate: "D009-DOM1",
    reason: /canal não-cromático ausente/
  },
  /* ------------------------------------------------------------------- C5 */
  {
    id: "D009-M6",
    desc: "injetar <span> na string de P1 (ramo dos extremos de domínio): markup entra no pipeline determinístico",
    file: JOURNEY,
    find: '      p1+=`, com maior consistência relativa em ${joinPt(ex.hi)} e oportunidades mais relevantes de evolução em ${joinPt(ex.lo)}`;',
    repl: '      p1+=`, com maior consistência relativa em <span class="jn-dom">${joinPt(ex.hi)}</span> e oportunidades mais relevantes de evolução em ${joinPt(ex.lo)}`;   /* MUTANTE D009-M6 */',
    gate: "D009-DOM2",
    reason: /markup em paragraphs\[0\]/
  },
  /* ------------------------------------------------------------------- C6 */
  {
    id: "D009-M7",
    desc: "restaurar themes.map(...).join(\"; \") no P3: a prosa volta a reenumerar a lista “Para avançar”",
    file: JOURNEY,
    find: '  else if(themes.length){ p3+=`Os próximos passos mais consistentes desta leitura estão reunidos na lista “Para avançar”.`; s3.push("evolution.themes"); }',
    repl: '  else if(themes.length){ p3+=`Os próximos passos mais consistentes envolvem: ${themes.map(t=>t.phrase.replace(/\\.$/,"").toLowerCase()).join("; ")}.`; s3.push("evolution.themes"); }   /* MUTANTE D009-M7 */',
    gate: "D009-NXT1",
    reason: /tema enumerado em prosa no P3/
  },
  /* ------------------------------------------------------------------- C7 */
  {
    id: "D009-M8",
    desc: "emitir o ponteiro incondicionalmente: o P3 aponta para a lista “Para avançar” mesmo sem tema algum",
    file: JOURNEY,
    find: '  else { p3+=`O conjunto avaliado não apresenta gaps confirmados relevantes; a evolução tende a se concentrar em sustentação e otimização das práticas existentes.`; s3.push("evolution.none"); }',
    repl: '  else { p3+=`O conjunto avaliado não apresenta gaps confirmados relevantes; a evolução tende a se concentrar em sustentação e otimização das práticas existentes. Os próximos passos estão reunidos na lista “Para avançar”.`; s3.push("evolution.none"); }   /* MUTANTE D009-M8 */',
    gate: "D009-NXT2",
    reason: /P3 aponta para uma lista que não existe/
  },
  /* ------------------------------------------------------------------- C8 */
  {
    id: "D009-M9",
    desc: "capHelpLine() devolve o verbete INTEIRO (três períodos) em vez do primeiro período",
    file: WS_JS,
    find: `  function p52CapHelpLine(capId) {
    var v = Object.prototype.hasOwnProperty.call(P52_CAP_HELP, capId) ? P52_CAP_HELP[capId] : "";
    var s = String(v == null ? "" : v);
    var i = s.indexOf(". ");
    return i < 0 ? s : s.slice(0, i + 1);
  }`,
    repl: `  function p52CapHelpLine(capId) {
    var v = Object.prototype.hasOwnProperty.call(P52_CAP_HELP, capId) ? P52_CAP_HELP[capId] : "";
    var s = String(v == null ? "" : v);
    return s;   /* MUTANTE D009-M9: verbete inteiro */
  }`,
    gate: "D009-GLO1",
    reason: /!= primeiro período/
  },
  {
    id: "D009-M10",
    desc: "perder o filtro presence !== \"UNSET\" na TELA: a capability não informada ganha linha e ganha a frase",
    file: UI_JS,
    /* A frase de glossário só existe DENTRO da linha declarada — não há como
       emiti-la sob UNSET sem que a linha nasça. O defeito plausível é este:
       derivar a lista sem o filtro. As duas cláusulas atingidas são de C8 (a
       contagem de `.v32-decl-row` que `p52ContextSummary` consome, e a
       contagem de `.v32-caphelp` que mata a emissão sob UNSET) — por isso o
       `reason` aceita as duas, e apenas as duas. */
    find: `    const declared = Object.keys(V32.TECH_LANDSCAPE)
      .filter(id => V32.TECH_LANDSCAPE[id].presence !== "UNSET")`,
    repl: `    const declared = Object.keys(V32.TECH_LANDSCAPE)
      .filter(id => true)   /* MUTANTE D009-M10: emite também sob UNSET */`,
    gate: "D009-GLO1",
    reason: /\.v32-decl-row para \d+ capabilities declaradas|nós \.v32-caphelp em #v32decl para \d+ declaradas/
  },
  /* ------------------------------------------------------------------- C9 */
  {
    id: "D009-M11",
    desc: "remover a emissão da frase no buildPrintReport: o glossário existe na tela e some do papel",
    file: UI_JS,
    find: '        <span class="pr-state">${PRESENCE_LABELS[L.presence]}</span>${capHelpHTML(id,"div")}${rows}</div>`;}).join("")',
    repl: '        <span class="pr-state">${PRESENCE_LABELS[L.presence]}</span>${rows}</div>`;}).join("")   /* MUTANTE D009-M11 */',
    gate: "D009-GLO2",
    reason: /nós \.v32-caphelp no papel \(esperado 1\)/
  },
  /* ------------------------------------------------------------------ C10 */
  {
    id: "D009-M12",
    desc: "devolver a frase única antiga para o ramo UNSET: contexto não informado volta a falar como NONE",
    file: TARGET,
    find: '    if (tgtEnablerState(qid, 0)==="S2"){ if (semCtx) semCtx.push(qid); return ""; }',
    repl: '    if (false){ if (semCtx) semCtx.push(qid); return ""; }   /* MUTANTE D009-M12 */',
    gate: "D009-UNS1",
    reason: /\(S2\): linha \.ux-tgt-en renderizada/
  },
  /* ------------------------------------------------------------------ C11 */
  {
    id: "D009-M13",
    desc: "usar o silêncio de UNSET para o estado INFORMADO: quem declarou contexto perde a frase substantiva",
    file: TARGET,
    find: '  return (!L || L.presence==="UNSET") ? "S2" : "S3";',
    repl: '  return "S2";   /* MUTANTE D009-M13 */',
    gate: "D009-UNS2",
    reason: /\(S3\): \d+ linhas \.ux-tgt-en \(esperado 1\)|bloco de ausência nasceu com o contexto INFORMADO/
  },
  /* ------------------------------------------------------------------ C12 */
  {
    id: "D009-M14",
    desc: "listar TODAS as práticas-alvo no aviso, em vez das que ficaram sem contexto",
    file: TARGET,
    find: '  const absNote=tgtAbsenceHTML(semCtx,true);',
    repl: '  const absNote=tgtAbsenceHTML(Object.keys(TARGET_PROFILE.overrides),true);   /* MUTANTE D009-M14 */',
    gate: "D009-UNS3",
    reason: /o aviso nomeia .+, cuja capability foi informada/
  },
  /* ------------------------------------------------------------------ C13 */
  {
    id: "D009-M15",
    desc: "incluir capability sem landscape na lista do aviso: \"não aplicável\" vira \"não informado\"",
    file: TARGET,
    find: '  if (V32.CAPABILITIES[caps[0]].landscapeEnabled !== true) return "S4";',
    repl: '  if (false) return "S4";   /* MUTANTE D009-M15 */',
    gate: "D009-UNS4",
    reason: /o aviso nomeia .+, cuja capability não tem landscape a informar/
  },
  /* ------------------------------------------------------------------ C14 */
  {
    id: "D009-M16",
    desc: "emitir o aviso SEM a lista: declara a contagem e nao nomeia quem ficou de fora",
    file: TARGET,
    /* [rodada 2] ÂNCORA REESCRITA. A âncora original casava a frase de UM ramo
       só, e a correção `e77b7b5` transformou a frase em ternário de DOIS ramos:
       o `find` passou a casar 0x e o mutante ESCAPOU na campanha de 2026-08-28,
       reportado como FALHA DO HARNESS — que é o desenho funcionando, não uma
       regressão de produto. `D009-ABS1` esteve verde o tempo todo; o que se
       perdeu, entre `e77b7b5` e este commit, foi a PROVA do par.
       A âncora agora cobre o ternário INTEIRO e o `repl` remove a lista dos
       DOIS ramos, mantendo a contagem — o gate exige contagem E lista, então
       tirar só a lista é exatamente o defeito que ele tem de pegar. */
    find: '  const frase=tgtCtxDeclaradoNaSessao()' + "\n" +
      '    ? `O contexto tecnológico não foi informado para ${n} ${uma?"prática-alvo":"práticas-alvo"}. Por isso ${uma?"ela ficou":"elas ficaram"} sem refino por habilitadores já identificados: ${nomes.join("; ")}.`' + "\n" +
      '    : `O contexto tecnológico não foi informado nesta sessão. Por isso ${n} ${uma?"prática-alvo ficou":"práticas-alvo ficaram"} sem refino por habilitadores já identificados: ${nomes.join("; ")}.`;',
    repl: '  const frase=tgtCtxDeclaradoNaSessao()' + "\n" +
      '    ? `O contexto tecnológico não foi informado para ${n} ${uma?"prática-alvo":"práticas-alvo"}. Por isso ${uma?"ela ficou":"elas ficaram"} sem refino por habilitadores já identificados.`' + "\n" +
      '    : `O contexto tecnológico não foi informado nesta sessão. Por isso ${n} ${uma?"prática-alvo ficou":"práticas-alvo ficaram"} sem refino por habilitadores já identificados.`;',
    gate: "D009-ABS1",
    reason: /o aviso não nomeia a prática /
  },
  /* ------------------------------------------------------------------ C15 */
  {
    id: "D009-M17",
    desc: "devolver .jn-note à lista de seletores da régua de 78ch",
    file: WS_CSS,
    find: '  .p52-sec .ux-micro:not(.jn-note),',
    repl: '  .p52-sec .ux-micro,',
    gate: "D009-LEG1",
    reason: /a nota da jornada continua na régua de leitura por/
  },
  /* ------------------------------------------------------------------ C16 */
  {
    id: "D009-M18",
    desc: "a base de evidência nasce com o atributo open (o disclosure deixa de ser disclosure)",
    file: WS_JS,
    find: `      id: "p52-evbase", "class": "p52-evbase", "data-p52": "evidence-base",
      "data-p52-suff": "true"`,
    repl: `      id: "p52-evbase", "class": "p52-evbase", "data-p52": "evidence-base",
      "data-p52-suff": "true", open: "open"   /* MUTANTE D009-M18 */`,
    gate: "D009-EVB1",
    reason: /#p52-evbase nasce com o atributo open/
  },
  {
    id: "D009-M19",
    desc: "anexar a base de evidência à seção exec, em vez da última seção (actions)",
    file: WS_JS,
    find: '      if (d.key === "actions" && evbase) sec.appendChild(evbase);',
    repl: '      if (d.key === "exec" && evbase) sec.appendChild(evbase);   /* MUTANTE D009-M19 */',
    gate: "D009-EVB1",
    reason: /#p52-evbase pendurado em p52-sec-exec/
  }
,
  /* ------------------------------------------------------------------ C12-b */
  {
    id: "D009-M20",
    desc: "devolver a frase de ausência GLOBAL ao caso parcial: o aviso volta a afirmar não-informação em escopo de sessão enquanto o relatório lista capabilities declaradas",
    file: TARGET,
    /* Âncora ESCRITA AGORA, não antes: o ramo só passou a existir com a correção
       da rodada 2 (`e77b7b5`). O bloco de especificação que ocupava este lugar
       declarava `find`/`repl` PENDENTES de propósito — âncora inventada casaria
       0x e este harness trata isso como FALHA DO HARNESS, derrubando a campanha
       inteira por um mutante que não podia existir.
       A mutação quebra o PREDICADO, não a redação: `tgtCtxDeclaradoNaSessao()`
       passa a dizer que nada foi declarado, e a frase de escopo de SESSÃO volta
       a ser usada nos DOIS casos. Alvo cirúrgico — o predicado alimenta apenas o
       ternário da abertura, então `D009-UNS1` (100% UNSET, onde a frase global é
       VERDADEIRA) e `D009-ABS1` seguem verdes: o kill é de `D009-UNS3` e só. */
    find: '  return Object.keys(L).some(id=>L[id] && L[id].presence!=="UNSET");',
    repl: '  return false;   /* MUTANTE D009-M20: nega a declaração e devolve a frase global */',
    gate: "D009-UNS3",
    reason: /declara ausência de contexto em ESCOPO DE SESSÃO/,
    /* PROVA DE DESENHO: este mutante tem de SOBREVIVER a `D009-UNS1`. Sob
       landscape 100% UNSET a frase de escopo de sessão é VERDADEIRA, e é esse o
       caso que UNS1 mede — se ele também morresse ali, a cláusula estaria no
       gate errado e `D009-UNS1` teria sido endurecido por engano. */
    sobrevive: { gate: "D009-UNS1", cmd: "node tests_009_leitura.js", env: { D009_ONLY: "D009-UNS1" } }
  }
];

/* ========================================================================== */

function build() { execSync(`${PY} "${path.join(HERE, "build_v32_html.py")}"`, { cwd: HERE, stdio: "pipe" }); }

function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env, encoding: "utf8" }) }; }
  catch (e) { return { code: e.status || 1, out: (e.stdout || "") + (e.stderr || "") }; }
}

function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/-/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

const ONLY = (process.env.D009_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
const SELECTED = ONLY.length ? MUTANTS.filter(m => ONLY.indexOf(m.id) >= 0) : MUTANTS;

(function main() {
  build();
  BASE_HTML_SHA = sha(HTML);
  console.log("D009 MUTATION · " + SELECTED.length + " mutante(s)" + (ONLY.length ? " [PARCIAL]" : "") +
    " · baseline html " + BASE_HTML_SHA.slice(0, 12) + " · " +
    MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 8)).join(" · ") + "\n");

  let killed = 0;
  const escaped = [];

  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    const hits = src.split(m.find).length - 1;
    if (hits !== 1) {
      /* R10 §2: âncora perdida NUNCA vira silêncio. Um `find` que não aplica é
         um mutante que não existe — e um gate sem discriminante provado. */
      console.log(`FALHA DO HARNESS  ${m.id} — âncora casa ${hits}x em ${path.basename(m.file)} ` +
        "(esperado 1): o módulo mudou de forma e o mutante deixou de aplicar");
      escaped.push(m.id + " (âncora)");
      continue;
    }

    let dead = false, nota = "", linha = "", extra = "";
    try {
      fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
      build();
      const r = run(SUITE, { D009_ONLY: m.gate });
      linha = gateLine(r.out, m.gate) || "";
      const reprovou = /^FAIL/.test(linha);
      const motivo = m.reason.test(linha);
      dead = reprovou && motivo;
      if (!linha) nota = "o gate esperado não emitiu linha (executou?)";
      else if (!reprovou) nota = "o gate esperado NÃO reprovou — sem poder discriminante";
      else if (!motivo) nota = "reprovou por motivo DIFERENTE do esperado";

      /* prova de desenho: mutante que, por construção, tem de sobreviver a
         outro gate (a asserção daquele gate não cobre o que este ataca) */
      if (m.sobrevive) {
        const s = run(m.sobrevive.cmd, m.sobrevive.env);
        const sl = gateLine(s.out, m.sobrevive.gate) || "";
        const sobreviveu = /^PASS/.test(sl);
        extra = "\n                  desenho: " + m.sobrevive.gate + " → " +
          (sobreviveu ? "SOBREVIVEU (esperado)" : "MATOU TAMBÉM — o par perdeu o desenho, reabra a análise") +
          (sl ? "  [" + sl.slice(0, 120) + "]" : "  [sem linha]");
        if (!sobreviveu) { dead = false; nota = (nota ? nota + " · " : "") + "prova de desenho quebrada"; }
      }
    } finally {
      fs.writeFileSync(m.file, src, "utf8");
      /* rebuild TAMBÉM na restauração: se algo abortar no meio da campanha, a
         árvore não fica com o HTML gerado a partir de um módulo defeituoso
         (`check_mutation.py:41-46` exige porcelain limpo, e HTML sujo é o
         rastro mais caro de diagnosticar). */
      build();
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica de " + path.basename(m.file));
    }

    if (dead) killed++; else escaped.push(m.id);
    console.log((dead ? "KILL      " : "ESCAPOU   ") + m.id + " · " + m.desc +
      "\n                  oráculo: " + m.gate + (nota ? " · " + nota : "") +
      "\n                  " + (linha ? linha.slice(0, 240) : "(sem linha do gate)") + extra + "\n");
  }

  build();
  const htmlOk = sha(HTML) === BASE_HTML_SHA;
  const srcOk = MUTABLE.every(f => sha(f) === BASE_SHA[f]);
  console.log("restauração: source " + (srcOk ? "byte a byte OK" : "DIVERGENTE") +
    " · html " + (htmlOk ? "byte a byte OK" : "DIVERGENTE (" + sha(HTML).slice(0, 12) + ")"));
  console.log(`D009 MUTATION: ${killed} KILL · ${escaped.length} escaparam de ${SELECTED.length}` +
    (escaped.length ? " (" + escaped.join(", ") + ")" : ""));
  process.exit(escaped.length || !srcOk || !htmlOk ? 1 : 0);
})();
