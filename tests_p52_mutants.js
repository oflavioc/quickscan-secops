/* ============================================================================
   HARNESS DE MUTAÇÃO · PHASE 5.2
   Prova o PODER DISCRIMINANTE dos gates novos. Para cada mutante:
     1. aplica a mutação no source;
     2. reconstrói o HTML determinístico;
     3. executa o gate SEMANTICAMENTE correspondente, filtrado;
     4. exige FAIL desse gate, com MOTIVO compatível — detecção incidental
        (manifesto, identidade de arquivo, contagem global) NÃO conta;
     5. restaura o source e confere o SHA-256 byte a byte.

   Os dez mutantes são exatamente os da §14.3 da diretriz. O último não toca a
   camada de layout: ele muta o cálculo do cenário-alvo para demonstrar que a
   reorganização visual NÃO enfraqueceu os contratos funcionais congelados.

   Este harness não integra `test:all`: roda sob demanda e o resultado é
   evidência de auditoria.
   ========================================================================== */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const P52JS = path.join(HERE, "ui_p52_workspace_v32.js");
const P52CSS = path.join(HERE, "ui_p52_workspace_v32.css");
const TGTJS = path.join(HERE, "ui_target_v32.js");
const SHELL = path.join(HERE, "ui_p50_shell_v32.js");
const UIJS = path.join(HERE, "ui_v32.js");
/* ERRATA FINAL · ALTO-1/MÉDIO-2 · superfícies novas sob mutação: a régua da
   jornada e a Camada 5 também publicam o cenário-alvo, e a COBERTURA do gate
   de contraste é ela própria uma propriedade que precisa ser atacada. */
const JOURNEY = path.join(HERE, "ui_journey_v32.js");
const P50RES = path.join(HERE, "ui_p50_results_v32.js");
const P52TESTS = path.join(HERE, "tests_p52_chromium.js");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const MUTABLE = [P52JS, P52CSS, TGTJS, SHELL, UIJS, JOURNEY, P50RES, P52TESTS];
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });
let BASE_HTML_SHA = null;

/* Guarda do acervo de evidência da fase: nenhum byte pode ser escrito ou
   alterado enquanto o produto estiver mutado. */
const EVID = path.join(HERE, "docs_phase5", "evidence_p52");
/* o acervo passou a ter subdiretório (`pdf/`): a guarda cobre os ARQUIVOS de
   primeiro nível e a existência do subdiretório, sem tentar lê-lo como arquivo. */
const evidenceList = () => (fs.existsSync(EVID)
  ? fs.readdirSync(EVID).filter(n => fs.statSync(path.join(EVID, n)).isFile()).sort()
  : []);
const GUARDED = evidenceList();
const GUARD_BYTES = {};
GUARDED.forEach(n => { GUARD_BYTES[n] = fs.readFileSync(path.join(EVID, n)); });
function checkEvidence(restore) {
  const bad = [];
  GUARDED.forEach(n => {
    const f = path.join(EVID, n);
    if (!fs.existsSync(f)) { bad.push("REMOVIDO " + n); if (restore) fs.writeFileSync(f, GUARD_BYTES[n]); return; }
    const now = sha(f);
    const want = crypto.createHash("sha256").update(GUARD_BYTES[n]).digest("hex");
    if (now !== want) { bad.push("ALTERADO " + n); if (restore) fs.writeFileSync(f, GUARD_BYTES[n]); }
  });
  evidenceList().forEach(n => {
    if (GUARD_BYTES[n] !== undefined) return;
    bad.push("ADICIONADO " + n);
    if (restore) fs.unlinkSync(path.join(EVID, n));
  });
  return bad;
}

function build() { execSync("python3 build_v32_html.py", { cwd: HERE, stdio: "pipe" }); }
const SUPPRESS = { P52_NO_EVIDENCE: "1", P50_NO_EVIDENCE: "1" };
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, SUPPRESS, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env }).toString() }; }
  catch (e) { return { code: e.status || 1, out: (e.stdout || "").toString() + (e.stderr || "").toString() }; }
}
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

/* ==========================================================================
   Os dez mutantes da §14.3.
   ========================================================================== */
const MUTANTS = [
  {
    id: "P52-M1",
    desc: "restaurar o teto de 980px da largura útil (voltar à faixa central estreita)",
    file: P52CSS,
    find: `    width: min(96vw, 2480px);
    max-width: none;`,
    repl: `    width: auto;
    max-width: 980px;`,
    gate: "P52-LAY1", cmd: "node tests_p52_chromium.js", only: "P52-LAY1",
    reason: /largura (útil|de conteúdo) \d+px </
  },
  {
    id: "P52-M2",
    desc: "retirar o grid-column:1/-1 do rodapé na tela de pergunta",
    file: P52CSS,
    find: `    body[data-uxscreen="question"] .wrap > footer { grid-column: 1 / -1; grid-row: 5; }`,
    repl: `    body[data-uxscreen="question"] .wrap > footer { grid-column: 2; grid-row: 5; }`,
    gate: "P52-LAY2", cmd: "node tests_p52_chromium.js", only: "P52-LAY2",
    reason: /rodapé (com \d+px de|começa dentro da coluna lateral)/
  },
  {
    id: "P52-M3",
    desc: "empilhar o cenário-alvo DEPOIS do contexto tecnológico",
    file: P52JS,
    find: `    { key: "target",     title: "Cenário-alvo" },
    { key: "context",    title: "Contexto tecnológico" },`,
    repl: `    { key: "context",    title: "Contexto tecnológico" },
    { key: "target",     title: "Cenário-alvo" },`,
    gate: "P52-TGT1", cmd: "node tests_p52_layout.js", only: "P52-TGT1",
    reason: /contexto \(\d+\) antes do alvo|alvo não é imediatamente posterior/
  },
  {
    id: "P52-M4",
    desc: "deixar dois controles de evidência na tela de pergunta",
    file: P52JS,
    find: `    t.setAttribute("data-p52-evidence", state);
    t.classList.add("p52-evidence-btn");`,
    repl: `    t.setAttribute("data-p52-evidence", state);
    t.classList.add("p52-evidence-btn");
    if (t.parentNode && !document.getElementById("p52-evid-dup"))
      t.parentNode.appendChild(el("button", { id: "p52-evid-dup", type: "button" }, "Adicionar evidência ou observação"));`,
    gate: "P52-Q1", cmd: "node tests_p52_layout.js", only: "P52-Q1",
    reason: /\d+ controles de evidência/
  },
  {
    id: "P52-M5",
    desc: "remover o marcador de grupo ativo do editor de contexto",
    file: P52CSS,
    find: `  #v32editor details[data-p52-grp="open"] > summary::before { content: "▾"; }`,
    repl: `  #v32editor details[data-p52-grp="open"] > summary::before { content: "▸"; }`,
    gate: "P52-CTX1v", cmd: "node tests_p52_chromium.js", only: "P52-CTX1v",
    reason: /marcador de estado idêntico/
  },
  {
    id: "P52-M6",
    desc: "misturar gaps altos e moderados num único grupo",
    file: P52JS,
    find: `        var sev = p52SeverityOf(nodes[i]);
        if (sev) { cards[sev].push(nodes[i]); continue; }`,
    repl: `        var sev = "high";
        if (sev) { cards[sev].push(nodes[i]); continue; }`,
    gate: "P52-GAP1", cmd: "node tests_p52_layout.js", only: "P52-GAP1",
    reason: /grupos? de severidade não existe|fora do grupo correto|contador de/
  },
  {
    id: "P52-M7",
    desc: "neutralizar a cor canônica das tags de domínio",
    file: P52CSS,
    find: `    background: var(--dom-accent);
    margin-right: 7px; vertical-align: baseline;`,
    repl: `    background: var(--line);
    margin-right: 7px; vertical-align: baseline;`,
    gate: "P52-DOM1c", cmd: "node tests_p52_chromium.js", only: "P52-DOM1c",
    reason: /amostra rgb\(.*\) != canônica/
  },
  {
    id: "P52-M8",
    desc: "reduzir visualmente apenas o artwork do FortiGuard",
    file: P52CSS,
    find: `  .icon-tile img { width: 46px; height: 46px; object-fit: contain; }`,
    repl: `  .icon-tile img { width: 46px; height: 46px; object-fit: contain; }
  .icon-tile img[alt*="FortiGuard"] { width: 30px; height: 30px; }`,
    gate: "P52-ICON1", cmd: "node tests_p52_chromium.js", only: "P52-ICON1",
    reason: /desvio de [\d.]+% da mediana|artwork aparente [\d.]+% do tile/
  },
  {
    /* REPONTUAÇÃO · ERRATA DA AUDITORIA EXTERNA · B-02/B-03.
       A mutação original retirava `#p52-rail` da lista de supressão de print.
       Depois da correção de B-02 ela ficou INERTE — e a inércia é, ela própria,
       evidência da correção: `preparePrint()` passou a aplicar sempre
       `v32-print-mode`, e a regra congelada `body.v32-print-mode .wrap
       {display:none}` retira do papel a `.wrap` INTEIRA, com o trilho dentro.
       Suprimir o trilho individualmente virou redundância.
       A OBRIGAÇÃO do mutante — provar que o cromo do workspace não alcança o
       papel — é preservada, agora atacando o ÚNICO ponto que hoje a garante. */
    id: "P52-M9",
    desc: "vazar o cromo do workspace para o papel (não aplicar v32-print-mode)",
    file: UIJS,
    find: `  el.innerHTML = html;
  document.body.classList.add("v32-print-mode");`,
    repl: `  el.innerHTML = html;`,
    gate: "P52-PR1", cmd: "node tests_p52_chromium.js", only: "P52-PR1",
    reason: /vazou para o papel: trilho|ainda imprime a tela sem contexto declarado|ainda pintado no papel/
  },
  /* ---------------- REV A · ajuste de UAT visual (§10) ---------------- */
  {
    id: "P52-RA1",
    desc: "voltar a misturar ambiente/condicionantes entre as capabilities",
    file: P52JS,
    find: `      gids: ["arch", "plat", "sig"] }`,
    repl: `      gids: [] }`,
    gate: "P52-CTX2", cmd: "node tests_p52_layout.js", only: "P52-CTX2",
    reason: /grupos = |regiões de primeiro nível|grupos fora das duas regiões/
  },
  {
    id: "P52-RA2",
    desc: "remover o verbete de Gestão de conhecimento",
    file: P52JS,
    find: `    "knowledge-management":`,
    repl: `    "knowledge-management-REMOVIDO":`,
    gate: "P52-HELP1", cmd: "node tests_p52_layout.js", only: "P52-HELP1",
    reason: /verbete de Gestão de conhecimento ausente|apenas \d+ capabilities com verbete/
  },
  {
    id: "P52-RA3",
    desc: "tornar a ajuda por capability hover-only (sem teclado nem Esc)",
    file: P52JS,
    find: `      btn.addEventListener("focus", function () {
        var p = document.getElementById(this.getAttribute("aria-describedby"));
        if (p) p52ShowHelp(this, p);
      });`,
    repl: `      /* MUTANTE: ajuda deixa de abrir por foco de teclado */`,
    gate: "P52-HELP1", cmd: "node tests_p52_chromium.js", only: "P52-HELP1",
    reason: /foco por teclado não abriu a ajuda/
  },
  {
    id: "P52-RA4",
    desc: "remover o emblema dos cinco domínios da home",
    file: P52JS,
    find: `    var emblem = p52DomainEmblem();
    if (emblem) {
      art.appendChild(emblem);`,
    repl: `    var emblem = null;
    if (emblem) {
      art.appendChild(emblem);`,
    gate: "P52-HOME1", cmd: "node tests_p52_layout.js", only: "P52-HOME1",
    reason: /emblema ausente/
  },
  {
    id: "P52-RA5",
    desc: "reduzir o score ao tamanho anterior",
    file: P52CSS,
    find: `  #p52-sec-exec .score-big { font-size: clamp(80px, 5.8vw, 112px); }`,
    repl: `  #p52-sec-exec .score-big { font-size: 44px; }`,
    gate: "P52-EXEC1", cmd: "node tests_p52_chromium.js", only: "P52-EXEC1",
    reason: /score com [\d.]+px \(esperado 80–112\)/
  },
  {
    id: "P52-RA6",
    desc: "tornar o Resumo texto-only: remover a barra de maturidade do domínio",
    file: P52JS,
    find: `      var wrap = el("span", { "class": "p52-dombar", "data-p52": "dom-bar",`,
    repl: `      var wrap = el("span", { "class": "p52-dombar", "data-p52": "dom-bar-REMOVIDA",`,
    gate: "P52-DOM2", cmd: "node tests_p52_layout.js", only: "P52-DOM2",
    reason: /sem barra|sem referência de escala/
  },
  {
    id: "P52-RA7",
    desc: "representar UNSET com barra de largura zero (zero geométrico)",
    file: P52JS,
    find: `      var score = /^\\d+(\\.\\d+)?$/.test(raw) ? parseFloat(raw) : null;`,
    repl: `      var score = /^\\d+(\\.\\d+)?$/.test(raw) ? parseFloat(raw) : 0;`,
    gate: "P52-DOM2", cmd: "node tests_p52_layout.js", only: "P52-DOM2",
    reason: /n\/d desenhou barra|zero geométrico proibido|n\/d marcado como plotado|barra desenhada apesar de n\/d/
  },
  {
    id: "P52-RA8",
    desc: "reduzir SOCaaS e MDR abaixo do limite óptico",
    file: P52CSS,
    find: `  .icon-tile img[data-p52-icon="FortiGuard-MDR-Service"]    { --p52-icon-scale: 1.053; }`,
    repl: `  .icon-tile img[data-p52-icon="FortiGuard-MDR-Service"]    { --p52-icon-scale: 0.70; }
  .icon-tile img[data-p52-icon="SOCaaS"]                    { --p52-icon-scale: 0.70; }`,
    gate: "P52-ICON2", cmd: "node tests_p52_chromium.js", only: "P52-ICON2",
    reason: /altura aparente [\d.]+% do tile|desvio de altura [\d.]+%/
  },
  {
    id: "P52-RA9",
    desc: "recolocar Pergunta anterior/Próxima na sidebar",
    file: SHELL,
    find: `    nav.appendChild(bTgl);
    orient.appendChild(nav);`,
    repl: `    var mPrev = el("button", { type: "button", "class": "p50-btn", "data-p50": "prev" }, "← Pergunta anterior");
    mPrev.addEventListener("click", function () { var b = document.getElementById("back"); if (b) b.click(); });
    nav.appendChild(mPrev);
    nav.appendChild(bTgl);
    orient.appendChild(nav);`,
    gate: "P52-MAP1", cmd: "node tests_p52_layout.js", only: "P52-MAP1",
    reason: /navegação duplicada de volta na sidebar|botões na barra do trilho/
  },
  {
    id: "P52-RA10",
    desc: "duplicar o owner do status de sessão na área da pergunta",
    file: P52JS,
    find: `    var ses = document.getElementById("p50-session-status");
    if (ses) util.appendChild(ses);          /* nó original do owner canônico */`,
    repl: `    var ses = document.getElementById("p50-session-status");
    if (ses) util.appendChild(ses.cloneNode(true));   /* MUTANTE: segundo estado de sessão */`,
    gate: "P52-Q2", cmd: "node tests_p52_layout.js", only: "P52-Q2",
    reason: /segundo status de sessão criado|segunda superfície de estado de sessão|status de sessão fora da faixa/
  },
  {
    id: "P52-RA11",
    desc: "esconder o painel completo de suficiência mesmo com o gate FECHADO",
    file: P52JS,
    find: `    if (gate === "released") {
      var keep = [], k2;`,
    repl: `    if (gate === "released" || gate === "blocked") {
      var keep = [], k2;`,
    gate: "P52-SUFF1", cmd: "node tests_p52_layout.js", only: "P52-SUFF1",
    reason: /bloqueado: painel técnico escondido|bloqueado: painel de suficiência fora da seção|suficiência não é a segunda seção/
  },
  /* ---------------- REV B · ajuste final de UAT visual (§12) ---------------- */
  {
    id: "P52-RB1",
    desc: "reduzir novamente o emblema dos cinco domínios",
    file: P52CSS,
    find: `  .p52-emblem { width: 100%; max-width: 540px; height: auto; display: block; }`,
    repl: `  .p52-emblem { width: 100%; max-width: 200px; height: auto; display: block; }`,
    gate: "P52-HOME1", cmd: "node tests_p52_chromium.js", only: "P52-HOME1",
    reason: /emblema com \d+px — pequeno demais/
  },
  {
    id: "P52-RB2",
    desc: "tornar a explicação do domínio hover-only (sem teclado)",
    file: P52JS,
    find: `        tabindex: "0", role: "button", "aria-expanded": "false",`,
    repl: `        role: "button", "aria-expanded": "false",`,
    gate: "P52-HOME2", cmd: "node tests_p52_layout.js", only: "P52-HOME2",
    reason: /não é focável por teclado/
  },
  {
    id: "P52-RB3",
    desc: "devolver o card intermediário de disclaimer ao hero",
    file: P52JS,
    find: `    var disc = scr.querySelector(".disclaimer");
    if (disc && disc.parentNode) disc.parentNode.removeChild(disc);`,
    repl: `    /* MUTANTE: o card intermediário volta a repetir o rodapé */`,
    gate: "P52-HOME3", cmd: "node tests_p52_layout.js", only: "P52-HOME3",
    reason: /card intermediário ainda|aparece \d+ vezes/
  },
  {
    id: "P52-RB4",
    desc: "reabrir os três accordions de capability ao entrar no editor",
    file: UIJS,
    find: `    { id:"g2", t:"Detection & Telemetry", open:false, caps: ids.filter(id => V32.CAPABILITIES[id].scope==="secops") },`,
    repl: `    { id:"g2", t:"Detection & Telemetry", open:true, caps: ids.filter(id => V32.CAPABILITIES[id].scope==="secops") },`,
    gate: "P52-CTX4", cmd: "node tests_p52_layout.js", only: "P52-CTX4",
    reason: /grupos abertos ao entrar/
  },
  {
    id: "P52-RB5",
    desc: "voltar o rótulo ambíguo 'Aplicações/agentes de IA'",
    file: UIJS,
    find: `  organizationBuildsAIApps:"Aplicações corporativas de IA (copilots e chatbots)",`,
    repl: `  organizationBuildsAIApps:"Aplicações/agentes de IA",`,
    gate: "P52-AI1", cmd: "node tests_p52_layout.js", only: "P52-AI1",
    reason: /rótulo de IA ausente|rótulo ambíguo/
  },
  {
    id: "P52-RB6",
    desc: "reintroduzir 'mandato' na linguagem apresentada",
    file: P52JS,
    find: `      if (!/[Mm]andato|charter|—/.test(v)) continue;`,
    repl: `      continue;   /* MUTANTE: o jargão volta para a tela e para o relatório */`,
    gate: "P52-COPY1", cmd: "node tests_p52_layout.js", only: "P52-COPY1",
    reason: /jargão na tela|pergunta ainda usa jargão/
  },
  {
    id: "P52-RB7",
    desc: "duplicar o exemplo abaixo do campo de evidência",
    file: SHELL,
    find: `    var ta = box.querySelector("#notetxt");`,
    repl: `    wrap.appendChild(el("p", { "class": "p51-help-ex", "data-p50": "evidence-help-example" }, h.ex));
    var ta = box.querySelector("#notetxt");`,
    gate: "P52-EVID1", cmd: "node tests_p52_layout.js", only: "P52-EVID1",
    reason: /exemplo duplicad/
  },
  {
    id: "P52-RB8",
    desc: "remover o link oficial das ofertas de apoio",
    file: UIJS,
    find: "  const cLnk = cUrl ? ",
    repl: "  const cLnk = false ? ",
    gate: "P52-SUP2", cmd: "node tests_p52_layout.js", only: "P52-SUP2",
    reason: /item com URL canônica e sem link oficial/
  },
  {
    id: "P52-RB9",
    desc: "reintroduzir o KPI de suficiência adequada no relatório do cliente",
    file: UIJS,
    find: "      <div class=\"pr-kpi\"><b>${ans.filter(v=>v!==null&&v!==\"NA\").length} de ${QS.length}</b><span>Respostas confirmadas</span></div>",
    repl: "      <div class=\"pr-kpi\"><b>${suff ? \"adequada\" : \"insuficiente\"}</b><span>Suficiência da sessão</span></div>",
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /KPI 'Sufici[êe]ncia da sess[ãa]o' voltou/
  },
  {
    id: "P52-RB10",
    desc: "limitar o painel de domínios a menos de 80% do workspace",
    file: P52CSS,
    find: `  #p52-flow #p50-results, #p52-flow #p50-suff, #p52-flow .p50-ses { max-width: none; }`,
    repl: `  #p52-flow #p50-results { max-width: 820px; }
  #p52-flow #p50-suff, #p52-flow .p50-ses { max-width: none; }`,
    gate: "P52-DOM3", cmd: "node tests_p52_chromium.js", only: "P52-DOM3",
    reason: /painel de domínios ocupa [\d.]+% do workspace/
  },
  {
    id: "P52-RB11",
    desc: "permitir que as prioridades comecem na primeira página",
    file: UIJS,
    find: "  if (prios.length) h += `<div class=\"pr-sec pr-pagebreak\" id=\"pr-prios\">",
    repl: "  if (prios.length) h += `<div class=\"pr-sec\" id=\"pr-prios\">",
    gate: "P52-PDF1", cmd: "node tests_p52_chromium.js", only: "P52-PDF1",
    reason: /prioridades sem quebra de página/
  },
  {
    id: "P52-RB12",
    desc: "esconder os ícones de solução no PDF",
    file: P52CSS,
    find: `  #v32-print-report .v32-icon, #v32-print-report .v32-icon-fb {
    width: 11mm !important; height: 11mm !important;`,
    repl: `  #v32-print-report .v32-icon, #v32-print-report .v32-icon-fb {
    display: none !important;
    width: 11mm !important; height: 11mm !important;`,
    gate: "P52-PDF3", cmd: "node tests_p52_chromium.js", only: "P52-PDF3",
    reason: /ícone\(s\) invisível\(is\) no papel|nenhum ícone no relatório/
  },
  {
    id: "P52-RB13",
    desc: "posicionar o marcador da régua com o valor não arredondado",
    file: UIJS,
    find: `  const pct = v => (Math.max(0, Math.min(5, v)) / 5 * 100).toFixed(2);`,
    repl: `  const pct = v => (Math.max(0, Math.min(5, v + 0.37)) / 5 * 100).toFixed(2);`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /marcador em [\d.]+% para score/
  },
  {
    id: "P52-RB14",
    desc: "desenhar marcador de posição mesmo com o resultado bloqueado",
    file: UIJS,
    find: "  const marcador = determinado\n    ? `<span class=\"pr-rl-mark\" data-rl-mark style=\"left:${pct(overall)}%\" aria-hidden=\"true\"></span>`\n      + `<span class=\"pr-rl-here\" data-rl-here style=\"left:${pct(overall)}%\">Você está aqui</span>`\n    : \"\";",
    repl: "  const marcador = `<span class=\"pr-rl-mark\" data-rl-mark style=\"left:${pct(overall||0)}%\" aria-hidden=\"true\"></span>`\n      + `<span class=\"pr-rl-here\" data-rl-here style=\"left:${pct(overall||0)}%\">Você está aqui</span>`;",
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /bloqueado não pode ter marcador|bloqueado desenhou marcador/
  },
  {
    id: "P52-RB15",
    desc: "devolver o recorte da pista da régua (o rótulo existe e não chega ao papel)",
    file: P52CSS,
    find: `    position: relative; width: 100%; display: flex; overflow: visible;`,
    repl: `    position: relative; width: 100%; display: flex;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /rótulo do marcador recortado por ancestral/
  },
  {
    id: "P52-RB16",
    desc: "devolver o viewBox quadrado do emblema da capa (rótulos cortados no PDF)",
    file: UIJS,
    find: `viewBox="-25 2 150 96" width="190" height="122"`,
    repl: `viewBox="0 0 100 100" width="132" height="132"`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /emblema da capa ilegível/
  },
  {
    id: "P52-RB17",
    desc: "deixar a borda herdada pintar preto sobre a haste de marca",
    file: P52CSS,
    find: `    width: 2px; margin-left: -1px; border: 0;`,
    repl: `    width: 2px; margin-left: -1px;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /pintando sobre a cor de marca/
  },
  {
    id: "P52-RB18",
    desc: "fazer a haste do marcador cruzar o nome do estágio dentro da faixa",
    file: P52CSS,
    find: `    position: absolute; top: 100%; bottom: auto; height: 3.4mm;`,
    repl: `    position: absolute; top: -4px; bottom: -4px; height: auto;`,
    gate: "P52-PDF2", cmd: "node tests_p52_chromium.js", only: "P52-PDF2",
    reason: /haste do marcador sobre o texto da régua/
  },
  {
    id: "P52-ER1",
    desc: "desligar a ampliação ultrawide da home",
    file: P52CSS,
    find: `    --p52-uw-home: 1.22;   /* §2.2 · faixa pedida: 1,20–1,25 */`,
    repl: `    --p52-uw-home: 1;      /* MUTANTE: a home volta ao tamanho de 1920 */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /home \w+ escalou 1×|sem ganho material/
  },
  {
    id: "P52-ER2",
    desc: "desligar a ampliação ultrawide do questionário",
    file: P52CSS,
    find: `    --p52-uw-q: 1.10;      /* §2.3 · faixa pedida: 1,08–1,12 */`,
    repl: `    --p52-uw-q: 1;         /* MUTANTE: o questionário volta ao tamanho de 1920 */`,
    gate: "P52-UW2", cmd: "node tests_p52_chromium.js", only: "P52-UW2",
    reason: /questionário \w+ escalou 1×/
  },
  {
    id: "P52-ER3",
    desc: "soltar a linha de leitura do parágrafo da home na faixa ultrawide",
    file: P52CSS,
    find: `    font-size: calc(16px * var(--p52-uw-home));
    max-width: calc(620px * var(--p52-uw-home));`,
    repl: `    font-size: calc(16px * var(--p52-uw-home));
    max-width: none;   /* MUTANTE: o parágrafo estica com a coluna */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /linha de leitura da home com [\d.]+ caracteres/
  },
  {
    id: "P52-ER4",
    desc: "trocar a largura fluida da home por largura fixa maior que a viewport",
    file: P52CSS,
    find: `  html body[data-uxscreen="home"] .wrap { width: min(92vw, 2240px); }`,
    repl: `  html body[data-uxscreen="home"] .wrap { width: 2700px; }   /* MUTANTE: estoura em 2560 */`,
    gate: "P52-UW1", cmd: "node tests_p52_chromium.js", only: "P52-UW1",
    reason: /rolagem horizontal em 2560px/
  },
  {
    id: "P52-ER5",
    desc: "tirar a área sensível uniforme apenas de Processos",
    file: P52CSS,
    find: `  .p52-emblem-hit { fill: transparent; stroke: none; pointer-events: all; }`,
    repl: `  .p52-emblem-node:not([data-dom="2"]) .p52-emblem-hit { fill: transparent; stroke: none; pointer-events: all; }
  .p52-emblem-node[data-dom="2"] .p52-emblem-hit { fill: none; pointer-events: none; }   /* MUTANTE: só Processos diverge */`,
    gate: "P52-POP2", cmd: "node tests_p52_chromium.js", only: "P52-POP2",
    reason: /domínio 2 não abre ao apontar/
  },
  {
    id: "P52-ER6",
    desc: "dar a Processos uma apresentação de popover diferente das outras quatro",
    file: P52CSS,
    find: `    width: min(420px, 100%); padding: 12px 14px;`,
    repl: `    width: min(420px, 100%); padding: 12px 14px;
  }
  .p52-emblem-pop[data-dom="2"] {
    width: 300px; padding: 6px 8px; font-size: 11px;   /* MUTANTE: só Processos diverge */`,
    gate: "P52-POP1", cmd: "node tests_p52_chromium.js", only: "P52-POP1",
    reason: /apresentações diferentes entre os cinco popovers|varia [\d.]+px entre os cinco/
  },
  {
    id: "P52-ER7",
    desc: "devolver a jornada empilhada no papel (um estágio por linha)",
    file: P52CSS,
    find: `    flex-direction: row !important;
    flex-wrap: nowrap;`,
    repl: `    flex-direction: column !important;   /* MUTANTE: a régua do papel volta a empilhar */
    flex-wrap: nowrap;`,
    gate: "P52-PDF4", cmd: "node tests_p52_chromium.js", only: "P52-PDF4",
    reason: /jornada empilhada ou partida|altura entre si|sem distribuição horizontal/
  },
  {
    id: "P52-ER8",
    desc: "permitir título de seção órfão no pé da página",
    file: P52CSS,
    find: `  #v32-print-report .pr-sec > h2 + *, #v32-print-report .pr-sec > h3 + * {
    break-before: avoid; page-break-before: avoid;
  }`,
    repl: `  #v32-print-report .pr-sec > h2 + *, #v32-print-report .pr-sec > h3 + * {
    break-before: page; page-break-before: always;   /* MUTANTE: o título fica sozinho no pé */
  }`,
    gate: "P52-PDF5", cmd: "node tests_p52_chromium.js", only: "P52-PDF5",
    reason: /isolado no rodapé da página/
  },
  {
    id: "P52-ER9",
    desc: "reintroduzir a página final contendo somente o rodapé do relatório",
    file: P52CSS,
    find: `    margin-top: 6px; padding-top: 4px;
    break-before: avoid; page-break-before: avoid;`,
    repl: `    margin-top: 6px; padding-top: 4px;
    break-before: page; page-break-before: always;   /* MUTANTE: o rodapé abre folha só para si */`,
    gate: "P52-PDF6", cmd: "node tests_p52_chromium.js", only: "P52-PDF6",
    reason: /página FINAL residual/
  },
  {
    id: "P52-M10",
    desc: "permitir alvo INFERIOR ao current confirmado (contrato funcional, fora da camada de layout)",
    file: TGTJS,
    find: `  if (cur!==null && cur!=="NA" && v < cur) return false;`,
    repl: `  if (false) return false;                                      /* MUTANTE: alvo pode ser inferior ao atual */`,
    gate: "TARGET 4.3.1", cmd: "node tests_target_m431.js", only: null,
    reason: /FAIL\s+T\d+/, lineless: true
  },

  /* ==========================================================================
     ERRATA DA AUDITORIA EXTERNA SÊNIOR DE FRONTEND · §8.4
     Catorze mutantes: os três blockers de PDF, a paginação, e cada ajuste
     visual autorizado. Cada um tem de ser detectado pelo gate SEMANTICAMENTE
     correspondente e por MOTIVO compatível — detecção incidental por manifesto,
     identidade de arquivo ou contagem global não conta.
     ========================================================================== */
  {
    id: "P52-EX1",
    desc: "B-01 · publicar score por domínio na tabela do relatório sob gate FECHADO",
    file: UIJS,
    find: `    <tr>\${pub.map(s=>\`<td>\${s.score===null?"n/d":s.score.toFixed(1)}</td>\`).join("")}</tr></table>`,
    repl: `    <tr>\${stats.map(s=>\`<td>\${s.score===null?"n/d":s.score.toFixed(1)}</td>\`).join("")}</tr></table>`,
    gate: "P52-PDF7", cmd: "node tests_p52_chromium.js", only: "P52-PDF7",
    reason: /célula\(s\) de domínio publicadas com o gate FECHADO|tabela publica \[/
  },
  {
    id: "P52-EX2",
    desc: "B-01 · restaurar o radar numérico do relatório sob gate FECHADO",
    file: UIJS,
    find: `    \${prRadarSVG(pub)}`,
    repl: `    \${prRadarSVG(stats)}`,
    gate: "P52-PDF7", cmd: "node tests_p52_chromium.js", only: "P52-PDF7",
    reason: /radar rotulado com score sob gate fechado|radar com \d+ vértice|radar publicado sob gate fechado/
  },
  {
    id: "P52-EX3",
    desc: "B-02 · restaurar o curto-circuito de modo legado em preparePrint()",
    file: UIJS,
    find: `  const { html } = buildPrintReport();
  el.innerHTML = html;`,
    repl: `  if (V32.isLegacyModeV32()){ el.innerHTML=""; document.body.classList.remove("v32-print-mode"); return { legacy:true }; }
  const { html } = buildPrintReport();
  el.innerHTML = html;`,
    gate: "P52-PDF8", cmd: "node tests_p52_chromium.js", only: "P52-PDF8",
    reason: /relatório não montado no beforeprint|`v32-print-mode` ausente durante o beforeprint/
  },
  {
    id: "P52-EX4",
    desc: "B-03 · imprimir a superfície de tela (não aplicar v32-print-mode)",
    file: UIJS,
    find: `  document.body.classList.add("v32-print-mode");
  return { blocked:false, legacy:V32.isLegacyModeV32() };`,
    repl: `  return { blocked:false, legacy:V32.isLegacyModeV32() };`,
    gate: "P52-PDF8", cmd: "node tests_p52_chromium.js", only: "P52-PDF8",
    reason: /`v32-print-mode` ausente durante o beforeprint|`\.wrap` com display='block' sob mídia de impressão/
  },
  {
    id: "P52-EX5",
    desc: "§4.4 · recolocar a jornada VERTICAL no papel (voltar à regra de telefone)",
    file: P52CSS,
    find: `  #v32-print-report .jn-track {
    display: flex !important;
    flex-direction: row !important;`,
    repl: `  #v32-print-report .jn-track {
    display: flex !important;
    flex-direction: column !important;`,
    gate: "P52-PDF4", cmd: "node tests_p52_chromium.js", only: "P52-PDF4",
    reason: /jornada empilhada ou partida|estágios com \d+pt de altura|sem distribuição horizontal/
  },
  {
    id: "P52-EX6",
    desc: "§4.4 · permitir página residual (retirar a guarda do último bloco do anexo)",
    file: P52CSS,
    find: `  #v32-print-report #pr-annex > .pr-card:last-child,
  #v32-print-report .pr-sec:last-of-type > *:last-child {
    break-after: avoid; page-break-after: avoid;
  }`,
    repl: `  #v32-print-report #pr-annex > .pr-card:last-child,
  #v32-print-report .pr-sec:last-of-type > *:last-child {
    break-after: page; page-break-after: always;
  }`,
    gate: "P52-PDF6", cmd: "node tests_p52_chromium.js", only: "P52-PDF6",
    reason: /página FINAL residual|página intermediária residual/
  },
  {
    id: "P52-EX7",
    desc: "A-01 · devolver o vermelho de marca ao texto pequeno (token acessível revertido)",
    file: P52CSS,
    find: `:root { --red-text: #F54133; }`,
    repl: `:root { --red-text: #DA291C; }`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /→ [0-3][.,]\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-EX8",
    desc: "§6.1 · remover a ajuda (i) de uma capability (detection-engineering)",
    file: P52JS,
    find: `      var text = P52_CAP_HELP[capId];`,
    repl: `      var text = (capId === "detection-engineering") ? null : P52_CAP_HELP[capId];`,
    gate: "P52-HELP2", cmd: "node tests_p52_chromium.js", only: "P52-HELP2",
    reason: /sem ajuda \(i\): capability · detection-engineering/
  },
  {
    id: "P52-EX9",
    desc: "§6.2 · quebrar a grade de requisitos (gaps desiguais e coluna fixa)",
    file: P52CSS,
    find: `  #v32editor .v32-signals,
  #v32editor .v32-subs .v32-signals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;`,
    repl: `  #v32editor .v32-signals,
  #v32editor .v32-subs .v32-signals {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px 26px;`,
    gate: "P52-SIG1", cmd: "node tests_p52_chromium.js", only: "P52-SIG1",
    reason: /gaps desiguais|gaps diferentes entre grupos/
  },
  {
    id: "P52-EX10",
    desc: "§6.3 · reduzir novamente a tipografia de 'Para avançar'",
    file: P52CSS,
    find: `    font-size: 17px; line-height: 1.7; color: var(--text);`,
    repl: `    font-size: 13.5px; line-height: 1.4; color: var(--text);`,
    gate: "P52-ADV1", cmd: "node tests_p52_chromium.js", only: "P52-ADV1",
    reason: /com 13\.5px \(piso 16,5px\)|entrelinha 1\.\d+ \(piso 1,55\)|menor que a leitura executiva/
  },
  {
    id: "P52-EX11",
    desc: "§6.4 · devolver o cenário-alvo a um card estreito preso à esquerda",
    file: P52CSS,
    find: `  #ux-target .ux-tgt-table {
    width: 100%; table-layout: fixed; margin: 0;`,
    repl: `  #ux-target .ux-tgt-table {
    width: max-content; table-layout: auto; margin: 0;`,
    gate: "P52-TGT3", cmd: "node tests_p52_chromium.js", only: "P52-TGT3",
    reason: /tabela Atual × Alvo com \d+px num painel útil|card estreito preso à esquerda/
  },
  {
    id: "P52-EX12",
    desc: "§6.5 · reduzir um ícone específico do sistema V3.2 (FortiSIEM)",
    file: P52CSS,
    /* O asset mutado tem de ser um dos EFETIVAMENTE renderizados pela fixture
       do gate — senão o mutante seria invisível por ausência, não por acerto.
       `P52-ICON3` mede SOCaaS, FortiAnalyzer, FortiSIEM, FortiGuard-IR-Service
       e FortiGuard-Labs na tela de apoio com contexto declarado. */
    find: `  .v32-icon[data-icon="FortiSIEM"]                       { --p52-v32icon-scale: 1.001; }`,
    repl: `  .v32-icon[data-icon="FortiSIEM"]                       { --p52-v32icon-scale: 0.62; }`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /v32-icon FortiSIEM: ocupação aparente [\d.]+% \(faixa 84–92%\)/
  },
  {
    id: "P52-EX13",
    desc: "§6.6 · remover o ícone de 'Pode fazer sentido — após validação' e de 'Não priorizados'",
    file: P52JS,
    find: `    var itens = root.querySelectorAll(".t-list .t-item, .t-details .t-item");`,
    repl: `    var itens = root.querySelectorAll(".t-list .t-item-INEXISTENTE, .t-details .t-item-INEXISTENTE");`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /sem tile de ícone|ícone ausente ou não pintado/
  },
  {
    id: "P52-EX14",
    desc: "§6.6 · ícone presente no DOM mas NÃO pintado nas listas secundárias",
    file: P52CSS,
    find: `  .t-list .t-item > .icon-tile, .t-details .t-item > .icon-tile {
    grid-column: 1; grid-row: 1; margin: 0;
  }`,
    repl: `  .t-list .t-item > .icon-tile, .t-details .t-item > .icon-tile {
    grid-column: 1; grid-row: 1; margin: 0; visibility: hidden;
  }`,
    gate: "P52-ICON3", cmd: "node tests_p52_chromium.js", only: "P52-ICON3",
    reason: /tile presente no DOM mas não pintado|ícone ausente ou não pintado/
  },
  /* ==========================================================================
     ERRATA FINAL · ALTO-1 — a comparação indivisível.
     Cinco mutantes exigidos pelo §6.1 da instrução, mais dois das superfícies
     que a mesma decisão passou a governar (régua da jornada e Camada 5). Cada
     um restaura o defeito por um caminho DIFERENTE: se o gate detectasse todos
     pelo mesmo motivo, ele estaria medindo uma coisa só.
     ========================================================================== */
  {
    id: "P52-FT1",
    desc: "ALTO-1 · TELA: a coluna Alvo volta a responder apenas a `tgt.suff` (gate próprio do vetor-alvo)",
    file: TGTJS,
    find: `  /* ERRATA FINAL · ALTO-1 · uma decisão só, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);`,
    repl: `  /* ERRATA FINAL · ALTO-1 · uma decisão só, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,tgt.suff);`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /TELA: domínio \d publica alvo/
  },
  {
    id: "P52-FT2",
    desc: "ALTO-1 · TELA: tabela protegida, mas KPI e NOME DE ESTÁGIO do alvo reaparecem",
    file: TGTJS,
    find: `  const pubO=v=>cmpPub?v:null, pubS=p=>(cmpPub&&p.stage)?esc32(p.stage.pt):"n/d";`,
    repl: `  const pubO=v=>v, pubS=p=>p.stage?esc32(p.stage.pt):"n/d";`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /TELA: KPI do alvo publica (score|estágio)/
  },
  {
    id: "P52-FT3",
    desc: "ALTO-1 · PAPEL: texto protegido, mas o POLÍGONO do alvo volta a ser pintado no PDF",
    file: TGTJS,
    find: `      <polygon points="\${poly(tgtPub)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>`,
    repl: `      <polygon points="\${poly(tgt.stats)}" fill="none" stroke="#3CB17E" stroke-width="1.6" stroke-dasharray="5 4"/>`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: polígono do alvo com \d vértices|PDF-TINTA: \d+px de #3CB17E/
  },
  {
    id: "P52-FT4",
    desc: "ALTO-1 · tela protegida, mas o PAPEL volta a publicar a coluna Alvo",
    file: TGTJS,
    find: `     ERRATA FINAL · ALTO-1 · e essa decisão é a do PERFIL ATUAL, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,cmpPub&&tgt.suff);`,
    repl: `     ERRATA FINAL · ALTO-1 · e essa decisão é a do PERFIL ATUAL, para as duas metades. */
  const cmpPub=tgtComparisonPublishable(cur);
  const curPub=tgtPublishable(cur.stats,cmpPub), tgtPub=tgtPublishable(tgt.stats,tgt.suff);`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: domínio \d publica alvo|PDF-TEXTO: número publicado no bloco/
  },
  {
    id: "P52-FT5",
    desc: "ALTO-1 · a mensagem neutra é trocada por alegação contraditória (o alvo como resultado projetado)",
    file: TGTJS,
    find: `data-pr-nopub="target">O cenário-alvo está salvo. A comparação será apresentada quando o perfil atual tiver evidência suficiente.`,
    repl: `data-pr-nopub="target">O cenário-alvo publicado abaixo é o resultado projetado desta sessão e constitui previsão de maturidade.`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /PAPEL: mensagem neutra ausente/
  },
  {
    id: "P52-FT6",
    desc: "ALTO-1 · a RÉGUA DA JORNADA volta a marcar o estágio do cenário-alvo sob gate fechado",
    file: JOURNEY,
    find: `  const tgtIdx=(snap.maturity.sufficient && snap.target.exists && snap.target.sufficient && snap.target.stage)? stageIndexOf(snap.target.stage,L) : -1;`,
    repl: `  const tgtIdx=(snap.target.exists && snap.target.sufficient && snap.target.stage)? stageIndexOf(snap.target.stage,L) : -1;`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /JORNADA: marcador de estágio do cenário-alvo na régua/
  },
  {
    id: "P52-FT7",
    desc: "ALTO-1 · a CAMADA 5 volta a pintar o marcador 'alvo X.X' por domínio sob gate fechado",
    file: P50RES,
    find: `      var domTarget = (released && domHasTarget && tgtStats) ? tgtStats[i].score : null;`,
    repl: `      var domTarget = (domHasTarget && tgtStats) ? tgtStats[i].score : null;`,
    gate: "P52-TGT4", cmd: "node tests_p52_chromium.js", only: "P52-TGT4",
    reason: /CAMADA 5: \d+ (marcador|gap|atributo)/
  },
  /* ==========================================================================
     ERRATA FINAL · MÉDIO-2 — contraste do link de apoio e COBERTURA do gate.
     ========================================================================== */
  {
    id: "P52-FC1",
    desc: "MÉDIO-2 · restaurar `#DA291C` diretamente em `.p52-sup-link`",
    file: P52CSS,
    find: `    font-size: 13.5px; color: var(--red-text); margin-top: 2px;
    text-decoration: underline; text-underline-offset: 2px;`,
    repl: `    font-size: 13.5px; color: #DA291C; margin-top: 2px;
    text-decoration: underline; text-underline-offset: 2px;`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /p52-sup-link.*3\.7\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-FC2",
    desc: "MÉDIO-2 · cor acessível SOMENTE no hover, deixando o estado normal reprovado",
    file: P52CSS,
    find: `  .p52-sup-link:hover { text-decoration: underline; text-decoration-thickness: 2px; }`,
    repl: `  .p52-sup-link { color: #DA291C; }
  .p52-sup-link:hover { color: var(--red-text); text-decoration: underline; text-decoration-thickness: 2px; }`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /p52-sup-link.*3\.7\d+:1 \(exigido 4\.5:1\)/
  },
  {
    id: "P52-FC3",
    desc: "MÉDIO-2 · remover a declaração de contexto do caso novo, tornando o gate VACUOSO para `.p52-sup-link`",
    file: P52TESTS,
    find: `    { nome: "resultados-contexto", fx: FX52.P52_F5, tela: "results", contexto: true,`,
    repl: `    { nome: "resultados-contexto", fx: FX52.P52_F5, tela: "results", contexto: false,`,
    gate: "P52-ACC3", cmd: "node tests_p52_chromium.js", only: "P52-ACC3",
    reason: /fixture não montou 'a\.p52-sup-link' — gate vacuoso/
  }
];

const ONLY = (process.env.P52_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
const SELECTED = ONLY.length ? MUTANTS.filter(m => ONLY.indexOf(m.id) >= 0) : MUTANTS;

(async () => {
  build();
  BASE_HTML_SHA = sha(HTML);
  console.log("baseline: html " + BASE_HTML_SHA.slice(0, 16) + " · " +
    MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · ") + "\n");

  const report = [];
  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    if (src.indexOf(m.find) < 0) {
      report.push({ id: m.id, desc: m.desc, gate: m.gate, detected: false, note: "âncora de mutação AUSENTE" });
      console.log("NÃO APLICÁVEL  " + m.id + " · " + m.desc + "\n              âncora ausente em " + path.basename(m.file) + "\n");
      continue;
    }
    if (src.split(m.find).length !== 2) {
      report.push({ id: m.id, desc: m.desc, gate: m.gate, detected: false, note: "âncora de mutação NÃO ÚNICA" });
      console.log("NÃO APLICÁVEL  " + m.id + " · âncora não única\n");
      continue;
    }
    let detected = false, note = "", line = "";
    try {
      fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
      build();
      const r = run(m.cmd, m.only ? { P52_ONLY: m.only } : {});
      line = m.lineless ? (r.out.match(/^FAIL\s+\S+.*$/m) || [""])[0] : (gateLine(r.out, m.gate) || "");
      const failed = /^FAIL/.test(line) || (m.lineless && r.code !== 0);
      const motivo = m.reason.test(line) || (m.lineless && m.reason.test(r.out));
      detected = failed && motivo;
      if (!failed) note = "o gate esperado NÃO reprovou";
      else if (!motivo) note = "reprovou por motivo diferente do esperado";
      if (!line) line = (r.out.split("\n").filter(x => /^FAIL/.test(x))[0] || "(sem linha FAIL)");
    } finally {
      fs.writeFileSync(m.file, src, "utf8");
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica");
      const bad = checkEvidence(true);
      if (bad.length) { build(); throw new Error(m.id + ": acervo de evidência violado — " + bad.join(" · ")); }
    }
    report.push({ id: m.id, desc: m.desc, gate: m.gate, detected, note, line: line.slice(0, 220) });
    console.log((detected ? "DETECTADO      " : "NÃO DETECTADO  ") + m.id + " · " + m.desc +
      "\n              gate esperado: " + m.gate + (note ? " · " + note : "") +
      "\n              " + line.slice(0, 220) + "\n");
  }

  build();
  const back = sha(HTML);
  const ok = report.filter(r => r.detected).length;
  const evFinal = checkEvidence(false);
  if (evFinal.length) throw new Error("acervo de evidência divergente ao fim da campanha — " + evFinal.join(" · "));
  console.log("restauração: " + MUTABLE.map(f => path.basename(f) + " " +
    (sha(f) === BASE_SHA[f] ? "OK" : "DIVERGENTE")).join(" · ") +
    " · html " + (back === BASE_HTML_SHA ? "OK" : "DIVERGENTE (" + back.slice(0, 16) + ")"));
  console.log("acervo de evidência: " + GUARDED.length + " arquivo(s) byte-idênticos ao início");
  console.log("\nMUTATION TESTING (Phase 5.2) [tests_p52_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
    ok + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados");
  if (!ONLY.length) {
    fs.mkdirSync(EVID, { recursive: true });
    const baseline = {}; MUTABLE.forEach(f => { baseline[path.basename(f)] = BASE_SHA[f]; });
    baseline.html = BASE_HTML_SHA;
    fs.writeFileSync(path.join(EVID, "P52-mutation.json"),
      JSON.stringify({ baseline, detected: ok, total: SELECTED.length, mutants: report }, null, 2) + "\n", "utf8");
  }
  process.exit(ok === SELECTED.length ? 0 : 1);
})().catch(e => { console.error("MUTATION P52: falha fatal —", e && e.stack || e); process.exit(1); });
