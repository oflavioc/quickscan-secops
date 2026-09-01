/* ============================================================================
   CAMPANHA DE MUTAÇÃO D015 · superfícies de apoio — demanda 015
   Harness `d015` do `mutation_map.json`. Prova que os cinco gates de
   `tests_015_apoio.js` têm PODER DISCRIMINANTE: cada mutante é uma entrega
   plausível-mas-errada, e o gate atribuído tem de reprovar POR MOTIVO
   COMPATÍVEL — reprovar por outra razão é SOBREVIVENTE, não KILL.

   SHAPE COPIADO de `tests_010_mutants.js` (cópia de shape, nunca extração de
   runner comum: runner compartilhado acopla campanhas de demandas distintas
   pelo arquivo mais frágil que existe).

   ==========================================================================
   VOCABULÁRIO FECHADO DE TRÊS ESTADOS
   ==========================================================================
   DETECTADO · SOBREVIVENTE · NÃO EXECUTADO (este SEMPRE com uma causa do
   conjunto fechado de `CAUSA`). O `d015` nasce sem a dívida do `d009`: gate
   que não emitiu linha PASS/FAIL é NÃO EXECUTADO, jamais SOBREVIVENTE —
   sobrevivência exige gate EXECUTADO. Ambiente quebrado lido como
   sobrevivência é o defeito que a 013 catalogou.

   ==========================================================================
   `--preflight` (argv) — contrato C1, no MESMO commit da chave do mapa
   ==========================================================================
   `check_mutation.py:283-296` roda o preflight de todo harness que declara
   `"preflight": true`, e RECUSA a chave sem a leitura do argv — sem isso o
   IC-4 derruba o stage inteiro mesmo com a campanha verde. O preflight NÃO
   muta, NÃO reconstrói, NÃO executa gate e NÃO escreve arquivo nenhum: emite
   UM objeto JSON em stdout (todo texto humano vai para stderr) e prova
   `ocorrencias == 1` em cada âncora ANTES de qualquer mutação. Âncora ambígua
   mataria pelo SÍTIO ERRADO — que é sobrevivente disfarçado.

   ==========================================================================
   A ÂNCORA QUE EXIGIU CUIDADO, e por quê
   ==========================================================================
   O literal do `[data-pr-gap-fonte]` é IDÊNTICO nos dois ramos de
   `qsGapSupportHTML` — o texto sozinho casa **2×** em `ui_v32.js`, medido. Por
   isso as âncoras dos mutantes que mexem nele carregam a QUEBRA DE LINHA E A
   INDENTAÇÃO, que diferem entre os ramos (6 espaços no ramo "não declarado",
   4 no "declarado"). É o que devolve `ocorrencias == 1` a cada uma e o que
   permite atacar UM ramo de cada vez — mutação parcial é teste mais forte que
   a total, porque a alínea é quantificada sobre TODOS os nós.

   Mutantes aposentados: `M11`, `M12`, `M13` — caíram com o critério C4 na
   errata E1, e os ids NÃO são reutilizados (R12). `M16` não vive aqui: ele
   muta `ui_target_v32.js`, que é PROTEGIDO e NÃO autorizado, e roda em
   worktree efêmera (T022). O harness automatizado NUNCA toca `PROTECTED` —
   foi exatamente aí que a 009 se queimou.
   ========================================================================== */
"use strict";

const fs = require("fs"), path = require("path"), crypto = require("crypto");
const { execSync } = require("child_process");

const HERE = __dirname;
const V32JS = path.join(HERE, "ui_v32.js");
const HTML = path.join(HERE, "quickscan_secops_soccmm_v3_2_dev.html");
const BUILD_PY = path.join(HERE, "build_v32_html.py");

/* Interpretador com UMA fonte: `MUTATION_PY` (override do operador) ou o padrão
   da plataforma. Interpretador E script sempre entre aspas (R10 §7) — a família
   P2.1-16/I11/S64 quebrou em diretório com espaço no caminho. */
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");

const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");

/* Resolve o binário no PATH sem lançar processo NENHUM — o preflight não pode
   executar nada (C1 / R7 §3). Equivale ao shutil.which() de check_mutation.py. */
function resolvePy(nome) {
  if (nome.indexOf("/") >= 0 || nome.indexOf("\\") >= 0) {
    try { return fs.statSync(nome).isFile() ? path.resolve(nome) : null; } catch (e) { return null; }
  }
  const exts = process.platform === "win32"
    ? [""].concat((process.env.PATHEXT || ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean))
    : [""];
  for (const dir of String(process.env.PATH || "").split(path.delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const cand = path.join(dir.replace(/^"|"$/g, ""), nome + ext);
      try { if (fs.statSync(cand).isFile()) return cand; } catch (e) { /* próximo candidato */ }
    }
  }
  return null;
}

/* ── vocabulário fechado ──────────────────────────────────────────────────── */
const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente:       "âncora não encontrada",
  ambigua:       "âncora ambígua",
  rebuild:       "rebuild falhou",
  gate:          "gate não pôde ser executado"
};
const naoClassificada = msg => "falha não classificada: " + msg;

/* ==========================================================================
   OS 13 MUTANTES EXECUTADOS — M1..M10, M14, M15 (forma AMPLA) e M19.
   `find`/`repl` são texto literal; `reason` é a assinatura da mensagem que o
   gate REALMENTE emite, transcrita do `throw new Error(...)` do oráculo
   (`tests_015_apoio.js`), nunca inventada.
   ========================================================================== */
const NL = String.fromCharCode(10);
const BQ = String.fromCharCode(96);            /* crase, sem crase no fonte */

const EYEBROW = '<div class="eyebrow">Leitura das prioridades declaradas · contexto V3.2</div>';
const H3_PRIO = '<h3>Leitura das prioridades declaradas</h3>';
const H3_BASE = '<h3>Leitura base — contexto tecnológico não informado</h3>';
const FONTE_TXT = 'Esta lista parte da <b>capability</b> associada ao gap, não do nível respondido na pergunta — por isso pode não coincidir com outras listas deste relatório.';
/* A indentação FAZ PARTE da âncora: é ela que separa os dois ramos. */
const FONTE_NDECL = NL + '      <div class="pr-gapsup-why" data-pr-gap-fonte>' + FONTE_TXT + '</div>';
const FONTE_DECL  = NL + '    <div class="pr-gapsup-why" data-pr-gap-fonte>' + FONTE_TXT + '</div>';
const LI7_TXT = 'O relatório pode trazer <b>mais de uma lista</b> de possibilidades para o mesmo gap: elas partem de catálogos e ancoragens diferentes e <b>não se somam</b> como recomendação.';
const LI7 = '<li>' + LI7_TXT + '</li>';
const UL_NDECL = '<ul class="pr-gapsup-list">${m.opts.map(';
const FILTRO_PRIO = 'const prioCaps = prioOrder.filter(id => presentationOf(id, ctxs[id]) !== null ||' + NL +
                    '    (ctxs[id] && ctxs[id].businessPriority && ctxs[id].businessPriority.flag));';
/* O `<ul>` do ramo "não declarado" só é único COM o corpo do `<li>`, que
   difere do outro ramo pelo sufixo "; validar aderência ao contexto do cliente." */
const UL_NDECL_FULL = UL_NDECL + 'o=>' + BQ + '<li data-pr-gap-opt><b>${esc32(o.n)}</b> — <span class="pr-mut">${esc32(o.w)}; validar aderência ao contexto do cliente.</span></li>' + BQ + ').join("")}</ul></div>';

const MUTANTS = [
  { id: "D015-M1", file: V32JS,
    desc: "restaurar o literal antigo do eyebrow (voltar a PROMETER apoio na tela)",
    find: EYEBROW,
    repl: '<div class="eyebrow">Apoio nas prioridades declaradas · contexto V3.2</div>',
    gate: "D015-TIT1", only: "D015-TIT1", reason: /o eyebrow ainda promete apoio/ },

  { id: "D015-M2", file: V32JS,
    desc: "apagar o sufixo ratificado `· contexto V3.2` do eyebrow",
    find: EYEBROW,
    repl: '<div class="eyebrow">Leitura das prioridades declaradas</div>',
    gate: "D015-TIT1", only: "D015-TIT1", reason: /o sufixo ratificado sumiu do eyebrow/ },

  { id: "D015-M3", file: V32JS,
    desc: "editar só a tela, deixando o papel para trás (o <h3> volta a prometer apoio)",
    find: H3_PRIO,
    repl: '<h3>Apoio nas prioridades declaradas</h3>',
    gate: "D015-TIT1", only: "D015-TIT1", reason: /tela e papel divergem/ },

  { id: "D015-M4", file: V32JS,
    desc: "copiar o sufixo de tela para o <h3> do papel (quebrar a assimetria declarada)",
    find: H3_PRIO,
    repl: '<h3>Leitura das prioridades declaradas · contexto V3.2</h3>',
    gate: "D015-TIT1", only: "D015-TIT1", reason: /o sufixo de tela vazou para o papel/ },

  { id: "D015-M5", file: V32JS,
    desc: "emitir a ancoragem só no ramo NÃO DECLARADO (suprimir o nó no ramo declarado)",
    find: FONTE_DECL,
    repl: "",
    gate: "D015-ANC1", only: "D015-ANC1", reason: /ramo DECL: \d+\/\d+ nó\(s\) sem a declaração de ancoragem/ },

  { id: "D015-M6", file: V32JS,
    desc: "trocar o texto por afirmação de ancoragem POR NÍVEL (inverter a propriedade)",
    find: FONTE_NDECL,
    repl: NL + '      <div class="pr-gapsup-why" data-pr-gap-fonte>Esta lista parte do nível respondido na pergunta, e acompanha o que foi assinalado.</div>',
    gate: "D015-ANC1", only: "D015-ANC1", reason: /nó\(s\) não atribuem a ancoragem à CAPABILITY/ },

  { id: "D015-M7", file: V32JS,
    desc: "reusar `data-pr-gap-why` em vez do atributo próprio (herdar o atributo que P51-REC1 mede)",
    find: FONTE_NDECL,
    repl: NL + '      <div class="pr-gapsup-why" data-pr-gap-why>' + FONTE_TXT + '</div>',
    gate: "D015-ANC1", only: "D015-ANC1", reason: /bloco\(s\) sem exatamente 1 \[data-pr-gap-fonte\]/ },

  { id: "D015-M8", file: V32JS,
    desc: "tornar o 7º item FUNÇÃO DA SESSÃO (a caixa deixa de ser estática)",
    find: LI7,
    repl: '<li>O relatório pode trazer <b>mais de uma lista</b> de possibilidades para o mesmo gap (${confirmedCount()} respostas confirmadas): elas partem de catálogos e ancoragens diferentes e <b>não se somam</b> como recomendação.</li>',
    gate: "D015-HOWTO1", only: "D015-HOWTO1", reason: /a caixa varia com os dados da sessão/ },

  { id: "D015-M9", file: V32JS,
    desc: "remover o 7º item (a regra das listas concorrentes desaparece)",
    find: NL + '      ' + LI7,
    repl: "",
    gate: "D015-HOWTO1", only: "D015-HOWTO1", reason: /itens na caixa; esperado 7/ },

  { id: "D015-M10", file: V32JS,
    desc: "escrever o 7º item longo o bastante para estourar o teto de 900 da métrica CRUA",
    find: LI7,
    repl: '<li>O relatório pode trazer <b>mais de uma lista</b> de possibilidades para o mesmo gap, e isso acontece porque cada curadoria nasce de um catálogo distinto, com regras de seleção distintas, mantidas por equipes distintas, em momentos distintos do ciclo de vida do assessment, de modo que a interseção entre elas nunca foi contratada nem verificada por ninguém: elas partem de catálogos e ancoragens diferentes e <b>não se somam</b> como recomendação, jamais.</li>',
    gate: "D015-HOWTO1", only: "D015-HOWTO1", reason: /métrica CRUA \d+ > 900/ },

  { id: "D015-M14", file: V32JS,
    desc: "colapsar o card de prioridade sem payload (tirar a cláusula businessPriority.flag do filtro) — rota S4, recusada",
    find: FILTRO_PRIO,
    repl: 'const prioCaps = prioOrder.filter(id => presentationOf(id, ctxs[id]) !== null);',
    gate: "D015-NOSUB1", only: "D015-NOSUB1", reason: /\(a\) E8: #v32prio caps/ },

  { id: "D015-M15", file: V32JS,
    desc: "suprimir as opções listadas dos qids de QS_GAP_SUPPORT (forma AMPLA — rota T5, recusada)",
    find: UL_NDECL_FULL,
    repl: '<ul class="pr-gapsup-list">${[].map(' + 'o=>' + BQ + '<li data-pr-gap-opt><b>${esc32(o.n)}</b> — <span class="pr-mut">${esc32(o.w)}; validar aderência ao contexto do cliente.</span></li>' + BQ + ').join("")}</ul></div>',
    gate: "D015-NOSUB1", only: "D015-NOSUB1", reason: /\(b\) E\d+: nomes de \[data-pr-gap-opt\]/ },

  { id: "D015-M19", file: V32JS,
    desc: "duplicar NO PAPEL o título de outra seção — o único carrasco da metade sem cobertura congelada",
    find: H3_BASE,
    repl: H3_BASE + H3_PRIO,
    gate: "D015-TIT1", only: "D015-TIT1", reason: /\(g\) metade PAPEL/ }
];

const MUTABLE = Array.from(new Set(MUTANTS.map(m => m.file)));
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });

/* ── execução de processo ─────────────────────────────────────────────────── */
/* `spawnFalhou` separa "o processo do gate não chegou a existir" (NÃO EXECUTADO)
   de "o gate rodou e saiu ≠ 0" (que é veredito). */
function run(cmd, envOverride) {
  const env = Object.assign({}, process.env, envOverride || {});
  try { return { code: 0, out: execSync(cmd, { cwd: HERE, stdio: "pipe", env, encoding: "utf8" }) }; }
  catch (e) {
    const saiu = typeof e.status === "number";
    return { code: saiu ? e.status : -1, out: (e.stdout || "") + (e.stderr || ""),
             erro: String(e.message || "").split("\n")[0], spawnFalhou: !saiu };
  }
}
/* Interpretador E script SEMPRE entre aspas (R10 §7). */
function build() { return run('"' + PY + '" "' + BUILD_PY + '"'); }
function buildOuFalha(onde) {
  const r = build();
  if (r.code !== 0)
    throw new Error(onde + ": rebuild falhou · " +
      (r.erro || String(r.out).trim().split("\n").pop() || "").slice(0, 200));
  return r;
}
/* O filtro do oráculo viaja pelo AMBIENTE (`D015_ONLY`), nunca por prefixo POSIX
   no `cmd` — prefixo de variável não funciona no cmd.exe (R10 §7). */
const filtro = m => (m.only ? { D015_ONLY: m.only } : {});
const CMD = "node tests_015_apoio.js";

/* Linha PASS/FAIL do gate esperado. Ausência = o gate NÃO foi executado:
   NÃO EXECUTADO, jamais SOBREVIVENTE. */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

function selecionar() {
  const only = (process.env.D015_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}
/* CONTAGEM, não presença: 0 é âncora podre, >=2 é âncora ambígua. */
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }

/* ── modo preflight (argv) · emite o contrato C1 ───────────────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d015",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* O que o harness realmente muta. Sai de MUTANTS inteiro, não da seleção:
       o filtro reduz a MEDIÇÃO, nunca o ALVO. */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d015 · " + dados.mutantes.length + " mutante(s) · interpretador " +
    PY + " (" + PY_ORIGEM + "): " + (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
  for (const m of dados.mutantes) {
    process.stderr.write("  " + (m.estado === "ok" ? "ok           " : "nao_executavel") + " " +
      m.id + " · ocorrencias=" + m.ocorrencias + " em " + m.arquivo +
      (m.causa ? " · " + m.causa : "") + "\n");
  }
  process.stderr.write(podres.length
    ? podres.length + " âncora(s) fora de ocorrencias == 1: " + podres.map(m => m.id).join(", ") + "\n"
    : "todas as âncoras com ocorrencias == 1\n");
  if (!binario) process.stderr.write(CAUSA.interpretador + ": " + PY + "\n");
  return (binario && podres.length === 0) ? 0 : 1;
}

if (process.argv.slice(2).indexOf("--preflight") >= 0) {
  process.exit(preflight(selecionar().sel));
}

const { only: ONLY, sel: SELECTED } = selecionar();
let BASE_HTML_SHA = null;

(() => {
  const report = [];
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota, linha) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, desc: m.desc, gate: m.gate, estado, causa: causa || "",
                  nota: nota || "", line: String(linha || "").slice(0, 220) });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + nota : ""));
    if (linha) console.log("              " + String(linha).slice(0, 220));
    console.log("");
  };

  /* Número que não foi medido NÃO é impresso: havendo não executado, a razão
     D/T some e o exit é diferente de zero. */
  const fechar = () => {
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_015_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U +
        " não executados (de " + SELECTED.length + ")" +
        (ONLY.length ? " · inventário completo: " + MUTANTS.length : ""));
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nD015 MUTATION [tests_015_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados" +
        (ONLY.length ? "" : " · M16 fora do harness (muta arquivo PROTEGIDO; worktree efêmera, T022)" +
                            " · M11/M12/M13 APOSENTADOS com o critério C4 (errata E1), ids não reutilizados"));
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    process.exit(D === SELECTED.length ? 0 : 1);
  };

  /* Interpretador ausente é CLASSIFICADO, não crash sem rótulo: aborta ANTES de
     construir e antes de mutar — nenhum arquivo tocado, árvore limpa. */
  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de construir e antes de mutar; nenhum arquivo tocado\n");
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "", "");
    return fechar();
  }
  const rb0 = build();
  if (rb0.code !== 0) {
    console.log("build da árvore BASE falhou (" + PY + ", " + PY_ORIGEM + ") — " +
      "campanha abortada antes de mutar; nenhum arquivo tocado\n");
    const detalhe = (rb0.erro || String(rb0.out).trim().split("\n").pop() || "").slice(0, 160);
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.rebuild, "árvore base · " + detalhe, "");
    return fechar();
  }
  BASE_HTML_SHA = sha(HTML);
  console.log("D015 MUTATION · " + SELECTED.length + " mutante(s) · interpretador " + PY +
    " (" + PY_ORIGEM + ") resolvido em " + binario);
  console.log("baseline: html " + BASE_HTML_SHA.slice(0, 16) + " · " +
    MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · ") + "\n");
  if (ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + ONLY.join(", ") + "\n");

  for (const m of SELECTED) {
    const src = fs.readFileSync(m.file, "utf8");
    /* Âncora provada por CONTAGEM antes de mutar: sem unicidade não se muta, e o
       par não vira veredito. */
    const n = src.split(m.find).length - 1;
    if (n !== 1) {
      emitir(m, NAO_EXECUTADO, (n === 0 ? CAUSA.ausente : CAUSA.ambigua + " (n=" + n + ")"),
        "ocorrencias=" + n + " em " + path.basename(m.file), "");
      continue;
    }
    let estado = "", causa = "", nota = "", linha = "";
    try {
      fs.writeFileSync(m.file, src.replace(m.find, m.repl), "utf8");
      const rb = build();
      if (rb.code !== 0) {
        estado = NAO_EXECUTADO; causa = CAUSA.rebuild;
        nota = (rb.erro || String(rb.out).trim().split("\n").pop() || "").slice(0, 160);
      } else {
        const r = run(CMD, filtro(m));
        if (r.spawnFalhou) {
          estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = String(r.erro).slice(0, 160);
        } else {
          linha = gateLine(r.out, m.gate) || "";
          if (!linha) {
            estado = NAO_EXECUTADO; causa = CAUSA.gate;
            nota = "a suíte não emitiu linha PASS/FAIL de " + m.gate +
                   " (exit " + r.code + ")" + (m.only ? " · filtro only=" + m.only : "");
          } else {
            const reprovou = /^FAIL/.test(linha);
            const motivo = m.reason.test(linha);
            estado = (reprovou && motivo) ? DETECTADO : SOBREVIVENTE;
            if (!reprovou) nota = "o gate esperado NÃO reprovou";
            else if (!motivo) nota = "reprovou por motivo diferente do esperado";
          }
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      fs.writeFileSync(m.file, src, "utf8");
      if (sha(m.file) !== BASE_SHA[m.file]) throw new Error(m.id + ": restauração NÃO byte-idêntica");
    }
    emitir(m, estado, causa, nota, linha);
  }

  buildOuFalha("fecho da campanha");
  const back = sha(HTML);
  console.log("restauração: source byte a byte " +
    (MUTABLE.every(f => sha(f) === BASE_SHA[f]) ? "OK" : "FALHOU") +
    " · html byte a byte " + (back === BASE_HTML_SHA ? "OK" : "FALHOU"));
  fechar();
})();
