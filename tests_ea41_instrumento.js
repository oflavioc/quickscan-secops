/* ============================================================================
   tests_ea41_instrumento.js — MUTANTES DE INSTRUMENTO do gate `eol-text`
   fix-finding EA-42 · dono: qa-engineer · 2026-09-11

   O QUE ESTE HARNESS PROVA, e que o `ea41` NÃO prova.
   O harness `ea41` roda mutantes de ÁRVORE: o gate é fixo, o mundo muda — prova
   que o julgador ACUSA o estado errado e ABSOLVE o certo. Este aqui roda o
   inverso, mutantes de INSTRUMENTO: o mundo é fixo, o GATE muda — prova que o
   julgador NÃO MENTE. São ordens diferentes de prova e nenhuma substitui a outra.

   POR QUE EXISTE (EA-42). Estes 8 mutantes JÁ FORAM executados uma vez, em cópia
   efêmera, durante a Fase Red do EA-41 (commit RED `2a1fb7f`): 8/8 mortos. Essa
   bateria não foi versionada, e o único registro que sobreviveu dela era uma
   linha de `dividas_declaradas` — sem par na matriz, sem harness, sem trigger de
   path que a re-executasse. A frase que o `EA-42` cunhou: *"prova que vive só na
   bateria efêmera EVAPORA"*. Este arquivo é essa bateria, versionada.

   R7 §3 — VERIFICAÇÃO NUNCA ESCREVE NA ÁRVORE. O fonte rastreado do gate NÃO é
   mutado in-place: cada mutante escreve uma CÓPIA em `os.tmpdir()` e roda o
   Python sobre a cópia, com `cwd` na raiz do repositório (o gate lê a árvore por
   `git`, não pela própria localização — `ESTE_GATE` é constante, não `__file__`).
   O SHA-256 do arquivo rastreado é medido ANTES e DEPOIS de cada mutante e a
   divergência é falha, não aviso. É desvio deliberado do padrão `d015`/`d016`
   (mutação in-place + restauração), e ENDURECE: não existe janela em que a
   árvore esteja mutada.

   VOCABULÁRIO DE TRÊS ESTADOS (T4 da 013): DETECTADO · SOBREVIVENTE ·
   NÃO EXECUTADO com causa. Detecção incidental NÃO é kill: cada mutante declara
   o sinal que o mata, e o julgamento exige ESSE sinal — um gate que reprove por
   outro motivo conta como SOBREVIVENTE, com a razão impressa.

   ÂNCORAS. Cada mutante casa a âncora EXATAMENTE 1× no fonte do gate; 0 ou >1 é
   NÃO EXECUTADO (`ancora ausente` / `ancora ambigua`), nunca kill presumido.

   `--preflight` (argv) — D4 da 013: emite UM JSON com harness, arquivo,
   interpretador, arquivos_mutados e mutantes, sem mutar e sem rodar o gate.
   ========================================================================== */

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const HERE = __dirname;
const GATE_REL = path.join(".claude", "verify", "check_eol_text.py");
const GATE_POSIX = ".claude/verify/check_eol_text.py";
const GATE_ABS = path.join(HERE, GATE_REL);
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  ausente: "ancora ausente",
  ambigua: "ancora ambigua",
  interpretador: "interpretador ausente",
  copia: "copia efemera falhou",
  arvore: "arvore mutada (SHA do gate rastreado mudou)"
};
const naoClassificada = msg => "falha não classificada: " + msg;

/* Resolve o binário no PATH sem lançar processo NENHUM (R7 §3, C1). */
function resolvePy(nome) {
  if (nome.includes("/") || nome.includes("\\")) return fs.existsSync(nome) ? nome : null;
  const exts = process.platform === "win32"
    ? (process.env.PATHEXT || ".EXE;.BAT;.CMD").split(";").filter(Boolean) : [""];
  for (const dir of (process.env.PATH || "").split(path.delimiter).filter(Boolean)) {
    for (const e of exts) {
      const cand = path.join(dir, nome + e);
      try { if (fs.statSync(cand).isFile()) return cand; } catch (_) { /* segue */ }
    }
  }
  return null;
}

/* ── os 8 mutantes ─────────────────────────────────────────────────────────
   `ancora` casa 1× no fonte do gate; `troca` é o que entra no lugar.
   `mata(s)` recebe a saída já lida e devolve null (matou pelo motivo certo) ou
   a string que explica por que aquilo NÃO é o kill declarado.               */

const temGuarda = (s, re) => s.guardas.some(g => re.test(g));
const divergiu = (s, cid) => s.divergencias.some(d => new RegExp("^" + cid + "[ (]").test(d));
const faltou = (s, ids) => ids.filter(c => !divergiu(s, c));

const MUTANTES = [
  {
    id: "EA42-I1", desc: "julgador mudo — `julgar` devolve zero problemas sobre qualquer árvore",
    gate: "guarda da sonda: julgador acusou 0 ≠ 6 pinado(s)",
    ancora: "    return problemas, censo, info",
    troca:  "    return [], censo, info",
    mata: s => temGuarda(s, /julgador acusou 0 problema\(s\) ≠ 6 pinado\(s\)/)
      ? null : "a guarda 'julgador acusou 0 ≠ 6' não saiu"
  },
  {
    id: "EA42-I2", desc: "acusa tudo — cai a guarda de classe e todo registro vira problema",
    gate: "divergências da sonda em S2 S3 S4 S6 S8 S12",
    /* A mutação precisa ser acusação INCONDICIONAL, não só a queda da guarda de
       classe: sem a guarda, um registro limpo (S2 · S6 · S8 — i/lf, sem -text e
       sem CR no índice) continua atravessando o corpo sem ser acusado, e o
       mutante morreria só pelos `-text` (S3 · S4 · S12). Medido em 2026-09-11:
       com `if False: continue` isolado o gate reprova, mas por 3 divergências em
       vez de 6 — reprovação incidental, que este harness não conta como kill. */
    ancora: '        if reg["classe"] != "normalizacao-declarada":\n            continue\n',
    troca:  '        if False:\n            continue\n' +
            '        problemas.append({"alinea": "a", "codigo": "nul", "origem": "índice", "censo": None, **reg})\n' +
            '        continue\n',
    mata: s => { const f = faltou(s, ["S2", "S3", "S4", "S6", "S8", "S12"]);
                 return f.length ? "sem divergência em " + f.join(", ") : null; }
  },
  {
    id: "EA42-I3", desc: "exclusão declarada (-text) tratada como escopo de normalização",
    ancora: '    if attr == ATTR_EXCLUIDO:\n        return "excluido-por-declaracao"',
    troca:  '    if attr == ATTR_EXCLUIDO:\n        return "normalizacao-declarada"',
    gate: "divergências da sonda em S3 e S4 (os excluídos passam a ser acusados)",
    mata: s => { const f = faltou(s, ["S3", "S4"]);
                 return f.length ? "sem divergência em " + f.join(", ") : null; }
  },
  {
    id: "EA42-I4", desc: "sonda encurtada — um cenário sai da lista e os pins ficam onde estão",
    ancora: '    ("S12", "sem_declaracao.md", b"x\\x00\\n", "add", "", "-text", "-text", None, None),\n',
    troca:  "",
    gate: "guarda da sonda: executados 12 ≠ total pinado 13",
    mata: s => temGuarda(s, /executados 12 registro\(s\) ≠ total pinado 13/)
      ? null : "a guarda 'executados 12 ≠ 13' não saiu"
  },
  {
    id: "EA42-I5", desc: "parser cego — o cabeçalho i/ w/ attr/ deixa de casar e nada é lido",
    ancora: '_RE_CABECALHO = re.compile(rb"^i/(\\S*)\\s+w/(\\S*)\\s+attr/(.*?)\\s*$")',
    troca:  '_RE_CABECALHO = re.compile(rb"^NUNCA_CASA_(\\S*)(\\S*)(.*?)$")',
    gate: "guarda da sonda: executados 0 ≠ 13 (censo vazio, nada julgado)",
    mata: s => temGuarda(s, /executados 0 registro\(s\) ≠ total pinado 13/)
      ? null : "a guarda de censo vazio não saiu"
  },
  {
    id: "EA42-I6", desc: "código de causa constante — `codigo_do_censo` devolve sempre 'nul'",
    ancora: '    if c is None:\n        return "causa-nao-reproduzida"',
    troca:  '    return "nul"\n    if c is None:\n        return "causa-nao-reproduzida"',
    gate: "divergências da sonda em S5 e S11 (códigos esperados cr-solitario e nao-imprimiveis)",
    mata: s => { const f = faltou(s, ["S5", "S11"]);
                 return f.length ? "sem divergência em " + f.join(", ") : null; }
  },
  {
    id: "EA42-I7", desc: "alínea (b) sem carrasco — CR no índice deixa de ser acusado",
    ancora: '        elif reg["i"] in ("crlf", "mixed"):',
    troca:  "        elif False:",
    gate: "divergência da sonda em S10 (o CR no índice deixa de ser acusado)",
    mata: s => divergiu(s, "S10") ? null : "sem divergência em S10"
  },
  {
    id: "EA42-I8", desc: "ausência de declaração tratada como escopo de normalização",
    ancora: '    if attr == "":\n        return "sem-declaracao"',
    troca:  '    if attr == "":\n        return "normalizacao-declarada"',
    gate: "divergência da sonda em S12 (o sem-declaração passa a ser acusado)",
    mata: s => divergiu(s, "S12") ? null : "sem divergência em S12"
  }
];

/* ── fonte do gate e âncoras ───────────────────────────────────────────────── */
function fonteDoGate() {
  return fs.readFileSync(GATE_ABS, "utf8").replace(/\r\n/g, "\n");   // LF por construção (R7 §1)
}
function ocorrencias(m, src) {
  let n = 0, i = 0;
  while ((i = src.indexOf(m.ancora, i)) !== -1) { n++; i += m.ancora.length; }
  return n;
}

/* ── execução do gate sobre uma CÓPIA, nunca sobre a árvore ────────────────── */
function rodarGateEm(binario, gatePath) {
  const r = spawnSync(binario, [gatePath], { cwd: HERE, encoding: "utf8", env: process.env,
                                             maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { spawnFalhou: true, erro: String(r.error.message || r.error).split("\n")[0] };
  return { code: r.status, stdout: String(r.stdout || ""), stderr: String(r.stderr || "") };
}

const RE_GUARDA = /^\[FAIL\] EA41-EOL0 sonda\/guarda: (.+)$/;
const RE_DIVERG = /^\[FAIL\] EA41-EOL0 sonda: (.+)$/;
const RE_SONDA  = /^\[SONDA\] eol-text: (\d+) registro\(s\) · (\d+) divergência\(s\)/;

function lerSaida(stdout) {
  const out = { guardas: [], divergencias: [], sonda: null, linhas: 0 };
  for (const l of String(stdout || "").split("\n").map(x => x.replace(/\r$/, ""))) {
    let m;
    if ((m = RE_GUARDA.exec(l))) out.guardas.push(m[1]);
    else if ((m = RE_DIVERG.exec(l))) out.divergencias.push(m[1]);
    else if ((m = RE_SONDA.exec(l))) out.sonda = { registros: +m[1], divergencias: +m[2] };
    if (l) out.linhas++;
  }
  return out;
}

/* ── preflight (D4 da 013) ─────────────────────────────────────────────────── */
function preflight() {
  const src = fonteDoGate();
  const binario = resolvePy(PY);
  const dados = {
    harness: "ea41i",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    arquivos_mutados: [GATE_POSIX],
    mutantes: MUTANTES.map(m => {
      const n = ocorrencias(m, src);
      const e = { id: m.id, arquivo: GATE_POSIX, ocorrencias: n,
                  estado: n === 1 ? "ok" : "nao_executavel" };
      if (n === 0) e.causa = CAUSA.ausente;
      else if (n > 1) e.causa = CAUSA.ambigua;
      return e;
    })
  };
  process.stdout.write(JSON.stringify(dados) + "\n");
  return dados.mutantes.every(m => m.estado === "ok") ? 0 : 1;
}

/* ── corpo ─────────────────────────────────────────────────────────────────── */
(() => {
  if (process.argv.slice(2).includes("--preflight")) { process.exit(preflight()); }

  const shaAntes = sha256(fs.readFileSync(GATE_ABS));
  const src = fonteDoGate();
  const binario = resolvePy(PY);
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 700) : ""));
    console.log("");
  };

  for (const m of MUTANTES) {
    if (!binario) { emitir(m, NAO_EXECUTADO, CAUSA.interpretador, PY + " (origem: " + PY_ORIGEM + ")"); continue; }
    const n = ocorrencias(m, src);
    if (n !== 1) { emitir(m, NAO_EXECUTADO, n === 0 ? CAUSA.ausente : CAUSA.ambigua,
                          GATE_POSIX + ": âncora casou " + n + "×"); continue; }

    let dir = null;
    try {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), "ea42-instrumento-"));
      const alvo = path.join(dir, "check_eol_text_mutado.py");
      fs.writeFileSync(alvo, src.replace(m.ancora, m.troca), { encoding: "utf8" });

      const r = rodarGateEm(binario, alvo);
      if (r.spawnFalhou) { emitir(m, NAO_EXECUTADO, CAUSA.copia, r.erro); continue; }

      const s = lerSaida(r.stdout);
      const medido = "medido: exit " + r.code + " · " + s.guardas.length + " guarda(s) · " +
        s.divergencias.length + " divergência(s)" +
        (s.sonda ? " · sonda " + s.sonda.registros + " registro(s)" : " · [SONDA] ausente");

      if (r.code === 0) { emitir(m, SOBREVIVENTE, "", "o gate mutado saiu VERDE ‖ " + medido); continue; }
      const porque = m.mata(s);
      if (porque) emitir(m, SOBREVIVENTE, "", "reprovou por OUTRO motivo (detecção incidental não é kill): " +
                                              porque + " ‖ " + medido);
      else emitir(m, DETECTADO, "", medido);
    } catch (e) {
      emitir(m, NAO_EXECUTADO, naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160)), "");
    } finally {
      if (dir) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) { /* declarado abaixo */ } }
    }
  }

  /* R7 §3 provado, não presumido: a árvore não foi tocada em momento nenhum. */
  const shaDepois = sha256(fs.readFileSync(GATE_ABS));
  const arvoreIntacta = shaAntes === shaDepois;
  if (!arvoreIntacta) {
    console.log(NAO_EXECUTADO + "  EA42-ARVORE · " + CAUSA.arvore);
    console.log("              " + GATE_POSIX + ": " + shaAntes.slice(0, 16) + " → " + shaDepois.slice(0, 16));
    console.log("");
  }

  console.log("----");
  console.log("ea41i: " + D + " DETECTADO · " + S + " SOBREVIVENTE · " + U + " NÃO EXECUTADO" +
              " · gate rastreado " + (arvoreIntacta ? "intacto (sha " + shaAntes.slice(0, 12) + ")" : "MUTADO — falha"));
  process.exit(D === MUTANTES.length && arvoreIntacta ? 0 : 1);
})();
