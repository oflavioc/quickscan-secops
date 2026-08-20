/* ============================================================================
   HARNESS DE MUTAÇÃO · PHASE 5.0 · microfase 5.0.1
   Prova o PODER DISCRIMINANTE dos gates novos. Para cada mutante:
     1. aplica a mutação no source do módulo novo;
     2. reconstrói o HTML;
     3. executa o gate ESPERADO;
     4. exige FAIL do gate ESPERADO com MOTIVO compatível
        (detecção incidental ou apenas por manifesto NÃO conta);
     5. restaura o source e confere o SHA-256 byte a byte.

   Este harness NÃO integra test:all: é executado sob demanda na entrega da
   microfase e o seu resultado é evidência de auditoria.
   ========================================================================== */
"use strict";

const { execSync } = require("child_process");
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const HERE = __dirname;
const SHELL = path.join(HERE, "ui_p50_shell_v32.js");
const CSS = path.join(HERE, "ui_p50_v32.css");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const BASE_SHA = { shell: sha(SHELL), css: sha(CSS) };
let BASE_HTML_SHA = null;

function build() { execSync("python3 build_v32_html.py", { cwd: HERE, stdio: "pipe" }); }
function run(cmd) {
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe" }).toString() }; }
  catch (e) { return { code: e.status || 1, out: (e.stdout || "").toString() + (e.stderr || "").toString() }; }
}

/* Extrai a linha de resultado do gate alvo (PASS/FAIL + motivo entre colchetes). */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

const MUTANTS = [
  {
    id: "M1",
    desc: "remover a chamada do predecessor em window.__uxDecor",
    file: SHELL,
    find: `      p50PrevInvocations++;
      try { p50PrevDecor(app); }
      catch (e) { console.error("P50 predecessor:", e.message); }`,
    repl: `      p50PrevInvocations++;`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /predecessor não foi invocado/
  },
  {
    id: "M2",
    desc: "remover a chamada do predecessor no wrapper de render",
    file: SHELL,
    find: `    var r = p50PrevRender.apply(this, arguments);          /* predecessor SEMPRE, e antes */`,
    repl: `    var r = undefined;                                     /* MUTANTE: predecessor suprimido */`,
    gate: "UX 4.1", cmd: "node tests_ux_m41.js",
    reason: /FAIL\s+UX/,
    lineless: true
  },
  {
    id: "M3",
    desc: "trocar o mapeamento de dois answer cards",
    file: SHELL,
    find: `      var val = (raw === "NA") ? "NA" : String(parseInt(raw, 10));`,
    repl: `      var val = (raw === "NA") ? "NA" : String(parseInt(raw, 10) === 1 ? 2 : (parseInt(raw, 10) === 2 ? 1 : parseInt(raw, 10)));`,
    gate: "P50-UX1", cmd: "node tests_p50_core.js",
    reason: /ordem\/valores|título dessincronizado|ans .* != /
  },
  {
    id: "M4",
    desc: "trocar o acionamento do handler congelado por escrita direta em ans[k]",
    file: SHELL,
    find: `      card.click();
      return;`,
    repl: `      var mk = step - 1, mv = card.getAttribute("data-p50-value");
      ans[mk] = (mv === "NA") ? "NA" : parseInt(mv, 10);
      render();
      return;`,
    gate: "P50-UX2", cmd: "node tests_p50_core.js",
    reason: /caminho congelado invocado 0 vez/
  },
  {
    id: "M5",
    desc: "dessincronizar a descrição canônica d de uma opção",
    file: SHELL,
    find: `          c.setAttribute("data-p50-optd", o.d);`,
    repl: `          c.setAttribute("data-p50-optd", opts[(parseInt(val, 10) + 1) % 4].d);`,
    gate: "P50-UX1", cmd: "node tests_p50_core.js",
    reason: /descrição canônica dessincronizada/
  },
  {
    id: "M6",
    desc: "renderizar 0.0 para domínio sem resposta confirmada",
    file: SHELL,
    find: `        }, "n/d"));`,
    repl: `        }, "0.0"));`,
    gate: "P50-SUF2", cmd: "node tests_p50_core.js",
    reason: /visível '0\.0'|zero fabricado/
  },
  {
    id: "M7",
    desc: "introduzir derivação local de suficiência no renderer novo",
    file: SHELL,
    find: `    var answered = 0;`,
    repl: `    var mutSuff = confirmedCount() >= 10;
    void mutSuff;
    var answered = 0;`,
    gate: "P50-SUF0", cmd: "node tests_p50_core.js",
    reason: /limiar global 10|compara confirmedCount|deriva suficiência/
  },
  {
    id: "M8",
    desc: "introduzir hexadecimal de cor de domínio na camada nova",
    file: CSS,
    find: `#p50-shell .p50-qlabel{ color:var(--text); }`,
    repl: `#p50-shell .p50-qlabel{ color:#307FE2; }`,
    gate: "P50-COR1", cmd: "node tests_p50_core.js",
    reason: /declara hex de domínio|declara hex literal/
  },
  {
    id: "M9",
    desc: "remover a proteção de idempotência do shell",
    file: SHELL,
    find: `    var old = document.getElementById("p50-shell");
    if (old) old.remove();`,
    repl: `    var old = null;`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /shell duplicado|não é idempotente/
  },
  {
    id: "M11",
    desc: "neutralizar o guard de reentrância da composição de __uxDecor",
    file: SHELL,
    find: `    if (p50DecorDepth > 0) { p50DecorReentriesBlocked++; return; }   /* reentrância contida */`,
    repl: `    if (false) { p50DecorReentriesBlocked++; return; }   /* MUTANTE: guard neutralizado */`,
    gate: "P50-UX13", cmd: "node tests_p50_core.js",
    reason: /reexecutada por reentrância|reentrância|recurs/i
  },
  {
    id: "M12",
    desc: "cue exibir a descrição de outra opção (dessincronizada da seleção)",
    file: SHELL,
    find: `      var dEl = sel ? sel.querySelector(".d") : null;`,
    repl: `      var dEl = document.querySelector("#app .opts .opt[data-p50-value='3'] .d");`,
    gate: "P50-UX3", cmd: "node tests_p50_core.js",
    reason: /cue != opts|cue stale/
  },
  {
    id: "M13",
    desc: "escrever a evidência direto em notes[k] em vez do setter congelado",
    file: SHELL,
    find: `      var t = document.getElementById("notetgl");        /* setter congelado */
      if (t) t.click();`,
    repl: `      notes[step - 1] = String(notes[step - 1] || "");
      render();`,
    gate: "P50-UX4", cmd: "node tests_p50_core.js",
    reason: /campo canônico de nota não foi aberto|escreve diretamente em notes/
  },
  {
    id: "M14",
    desc: "fabricar um chip sem provenance no runtime (weight class)",
    file: SHELL,
    find: `    var hint = scr.querySelector("p.hint");`,
    repl: `    chips.appendChild(el("span", { "class": "p50-chip", "data-p50": "chip",
      "data-p50-chip": "weight", role: "listitem", "aria-label": "Peso" }, "Importance: alta"));
    var hint = scr.querySelector("p.hint");`,
    gate: "P50-UX5", cmd: "node tests_p50_core.js",
    reason: /conjunto de chips|chip fabricado|esperados 3 chips/
  },
  {
    id: "M15",
    desc: "renderizar a evidência como marcação em vez de texto inerte",
    file: SHELL,
    find: `      ev.appendChild(el("p", { "class": "p50-ev-txt", "data-p50": "evidence-preview" }, preview));`,
    repl: `      var pnode = el("p", { "class": "p50-ev-txt", "data-p50": "evidence-preview" });
      pnode.innerHTML = preview;
      ev.appendChild(pnode);`,
    gate: "P50-UX12", cmd: "node tests_p50_core.js",
    reason: /gerou .* elemento|gerou marcação|executou|escape de contexto|nó executável/
  },
  {
    id: "M16",
    desc: "manter o wording de export mesmo com modificações posteriores",
    file: SHELL,
    find: `    if (p50IsDirty()) return "default";          /* honestidade tem precedência */`,
    repl: `    /* MUTANTE: honestidade removida */`,
    gate: "P50-SESUX2", cmd: "node tests_p50_core.js",
    reason: /wording de export persistiu|modificação pós-export/
  },
  {
    id: "M17",
    desc: "serializar o estado efêmero de sessão dentro dos inputs canônicos",
    file: SHELL,
    find: `  function p50MarkClean() { p50CleanSnapshot = p50Canon(); }`,
    repl: `  function p50MarkClean() {
    p50CleanSnapshot = p50Canon();
    try { OPERATIONAL_REFINEMENT.answers.p50SessionState = p50SesState; } catch (e) {}
  }`,
    gate: "P50-SESUX5", cmd: "node tests_p50_core.js",
    reason: /estado efêmero serializado|bloco inputs alterado|roundtrip|inválido/
  },
  {
    id: "M18",
    desc: "remover a reconciliação no evento REAL de evidência (B-502-1)",
    file: SHELL,
    find: `    ta.addEventListener("input", p50OnNoteInput);`,
    repl: `    void p50OnNoteInput;   /* MUTANTE: reconciliação removida */`,
    gate: "P50-SESUX2", cmd: "node tests_p50_core.js",
    reason: /status stale após digitar evidência|dirty não reconciliado|wording de export permaneceu/
  },
  {
    id: "M19",
    desc: "manter o estado `imported` após edição da evidência",
    file: SHELL,
    find: `    if (p50IsDirty()) return "default";          /* honestidade tem precedência */`,
    repl: `    if (p50IsDirty() && p50SesState !== "imported") return "default";`,
    gate: "P50-SESUX3", cmd: "node tests_p50_core.js",
    reason: /estado imported persistiu|wording de import permaneceu|dirty não reconciliado/
  },
  {
    id: "M20",
    desc: "omitir dirty e falha do texto acessível (aria-label sobrescrevendo a live region)",
    file: SHELL,
    find: `      role: "status", "aria-live": "polite"`,
    repl: `      role: "status", "aria-live": "polite",
      "aria-label": "Estado da sessão: " + msg[0] + " " + msg[1]`,
    gate: "P50-SESUX1B", cmd: "node tests_p50_chromium.js",
    reason: /aria-label sobrescreve|texto acessível/
  },
  {
    id: "M21",
    desc: "remover o wrapper de export (downloadSession não observado)",
    file: SHELL,
    find: `      var r = p50SesInvoke("download", p50PrevDownloadSession, this, arguments);`,
    repl: `      var r = p50PrevDownloadSession.apply(this, arguments);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /predecessor invocado 0|contadores|identidade do objeto retornado|`this` do predecessor/
  },
  {
    id: "M22",
    desc: "remover o wrapper de import (importSessionDocument não observado)",
    file: SHELL,
    find: `      var r = p50SesInvoke("import", p50PrevImportSessionDocument, this, arguments);`,
    repl: `      var r = p50PrevImportSessionDocument.apply(this, arguments);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /import ok=true não marcou imported|import ok=false marcou imported|retorno de falha de import/
  },
  {
    id: "M23",
    desc: "inverter a leitura de r.ok no observador de export",
    file: SHELL,
    find: `        if (r && r.ok) { p50SesState = "exported"; p50MarkClean(); }
        else { p50SesState = "export-failed"; }`,
    repl: `        if (r && !r.ok) { p50SesState = "exported"; p50MarkClean(); }
        else { p50SesState = "export-failed"; }`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /ok=true não marcou exported|ok=false marcou exported|ok=true não marcou clean/
  },
  {
    id: "M24",
    desc: "duplicar a invocação do predecessor de sessão",
    file: SHELL,
    find: `    var pred = p50SesSub[kind] || fallback;
    p50SesPredCalls[kind]++;
    return pred.apply(ctx, args);`,
    repl: `    var pred = p50SesSub[kind] || fallback;
    p50SesPredCalls[kind]++;
    pred.apply(ctx, args);
    p50SesPredCalls[kind]++;
    return pred.apply(ctx, args);`,
    gate: "P50-SESUX4", cmd: "node tests_p50_core.js",
    reason: /predecessor invocado 2|contadores/
  },
  {
    id: "M10",
    desc: "dessincronizar o estado acessível do card do estado canônico",
    file: SHELL,
    find: `      c.setAttribute("data-p50-selected", isSel ? "true" : "false");`,
    repl: `      c.setAttribute("data-p50-selected", "false");`,
    gate: "P50-ACC6", cmd: "node tests_p50_chromium.js",
    reason: /data-p50-selected=false/
  }
];

(function main() {
  build();
  BASE_HTML_SHA = sha(HTML);
  console.log("baseline shell : " + BASE_SHA.shell);
  console.log("baseline css   : " + BASE_SHA.css);
  console.log("baseline html  : " + BASE_HTML_SHA + "\n");

  const report = [];
  for (const m of MUTANTS) {
    const orig = fs.readFileSync(m.file, "utf8");
    let detected = false, note = "", line = "";
    try {
      if (orig.indexOf(m.find) < 0) { note = "ÂNCORA DE MUTAÇÃO NÃO ENCONTRADA"; }
      else {
        fs.writeFileSync(m.file, orig.replace(m.find, m.repl), "utf8");
        build();
        const r = run(m.cmd);
        if (m.lineless) {
          detected = r.code !== 0 && m.reason.test(r.out);
          line = (r.out.match(/^FAIL\s+\S+.*$/m) || ["(sem linha FAIL)"])[0];
        } else {
          line = gateLine(r.out, m.gate) || "(gate não reportado)";
          const isFail = /^FAIL/.test(line);
          const reasonOk = m.reason.test(line);
          detected = isFail && reasonOk;
          if (isFail && !reasonOk) note = "FAIL com motivo INCOMPATÍVEL";
          if (!isFail) note = "gate NÃO detectou";
        }
      }
    } finally {
      fs.writeFileSync(m.file, orig, "utf8");
      const back = sha(m.file);
      const key = m.file === CSS ? "css" : "shell";
      if (back !== BASE_SHA[key]) throw new Error(m.id + ": restauração NÃO byte-idêntica");
    }
    report.push({ id: m.id, desc: m.desc, gate: m.gate, detected, note, line: line.slice(0, 200) });
    console.log((detected ? "DETECTADO    " : "NÃO DETECTADO") + "  " + m.id + " · " + m.desc +
      "\n              gate esperado: " + m.gate + (note ? " · " + note : "") +
      "\n              " + line.slice(0, 200) + "\n");
  }

  build();
  const htmlBack = sha(HTML);
  const ok = report.filter(r => r.detected).length;
  console.log("restauração: shell " + (sha(SHELL) === BASE_SHA.shell ? "OK" : "DIVERGENTE") +
    " · css " + (sha(CSS) === BASE_SHA.css ? "OK" : "DIVERGENTE") +
    " · html " + (htmlBack === BASE_HTML_SHA ? "OK" : "DIVERGENTE (" + htmlBack + ")"));
  console.log("\nMUTATION TESTING (5.0.1+5.0.2): " + ok + "/" + MUTANTS.length + " mutantes detectados pelo gate e motivo esperados");
  fs.mkdirSync(path.join(HERE, "docs_phase5", "evidence_p50"), { recursive: true });
  fs.writeFileSync(path.join(HERE, "docs_phase5", "evidence_p50", "P50-mutation-5.0.1.json"),
    JSON.stringify({ baseline: { shell: BASE_SHA.shell, css: BASE_SHA.css, html: BASE_HTML_SHA },
      detected: ok, total: MUTANTS.length, mutants: report }, null, 2) + "\n", "utf8");
  process.exit(ok === MUTANTS.length ? 0 : 1);
})();
