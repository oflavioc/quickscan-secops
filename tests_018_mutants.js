/* ============================================================================
   tests_018_mutants.js — mutantes de INSTRUMENTO do julgador `mutation-coverage`
   Demanda 018 (remédio do EA-3) · dono: qa-engineer · 2026-09-11

   O QUE PROVA. Que `check_mutation_coverage.py` não mente: que não é um
   `return 0`, que o órfão é de fato calculado, que a dívida não vale sem prazo,
   que o prazo vencido reprova, que a declaração podre é acusada e que a
   auto-exclusão não é silenciosa. O mundo é fixo; o GATE muda.

   R7 §3 — NUNCA ESCREVE NA ÁRVORE. Cada mutante escreve uma CÓPIA do julgador em
   `os.tmpdir()` e roda o Python sobre ela, com `cwd` na raiz (o julgador lê a
   árvore por caminho relativo, não pela própria localização). O SHA-256 do fonte
   rastreado é medido ANTES e DEPOIS e a divergência é FALHA, não aviso. Shape
   copiado de `tests_ea41_instrumento.js` (EA-42) — cópia de shape, nunca
   extração de runner comum.

   KILL EXIGE O SINAL DECLARADO. Cada mutante declara o que o mata; gate que
   reprove por outro motivo conta SOBREVIVENTE, com a razão impressa. Detecção
   incidental não é kill.

   `--preflight` (argv) — D4 da 013: um JSON, sem mutar e sem rodar o gate.
   ========================================================================== */

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const HERE = __dirname;
const GATE_REL = path.join(".claude", "verify", "check_mutation_coverage.py");
const GATE_POSIX = ".claude/verify/check_mutation_coverage.py";
const GATE_ABS = path.join(HERE, GATE_REL);
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");

const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  ausente: "ancora ausente", ambigua: "ancora ambigua",
  interpretador: "interpretador ausente", copia: "copia efemera falhou",
  arvore: "arvore mutada (SHA do gate rastreado mudou)"
};

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

/* ── leitura da saída do julgador ─────────────────────────────────────────── */
const RE_FECHO = /^mutation-coverage: (\d+) na população · (\d+) órfão\(s\) · (\d+) não medido\(s\) · (\d+) dívida\(s\) · (\d+) problema\(s\)$/;

function lerSaida(stdout) {
  const out = { fails: [], dividas: [], naoMedidos: [], fecho: null };
  for (const l of String(stdout || "").split("\n").map(x => x.replace(/\r$/, ""))) {
    if (l.startsWith("[FAIL]")) out.fails.push(l);
    else if (l.startsWith("[DÍVIDA]")) out.dividas.push(l);
    else if (l.startsWith("[NÃO MEDIDO]")) out.naoMedidos.push(l);
    const m = RE_FECHO.exec(l);
    if (m) out.fecho = { populacao: +m[1], orfaos: +m[2], naoMedidos: +m[3],
                         dividas: +m[4], problemas: +m[5] };
  }
  return out;
}
const temFail = (s, re) => s.fails.some(f => re.test(f));

/* ── os sete mutantes ─────────────────────────────────────────────────────── */
const MUTANTES = [
  {
    id: "D018-M1", desc: "POP1 cego — exceção/dívida sem `motivo` deixa de ser acusada",
    gate: "[FAIL] D018-POP1 … sem motivo",
    ancora: '            faltando = [c for c in ("motivo", "prazo") if not str(e.get(c, "")).strip()]',
    troca:  '            faltando = []',
    /* o mundo é fixo: a mutação sozinha não produz o sinal, então o oráculo é a
       AUSÊNCIA de acusação sobre uma declaração que a árvore não tem. Por isso
       este mutante é medido pelo fecho: com POP1 cego, nada muda hoje — e é
       exatamente por isso que ele precisa do cenário sintético abaixo. */
    cenario: { remover: "motivo", de: "dividas", indice: 0 },
    mata: s => temFail(s, /D018-POP1 dívida .*sem motivo/) ? null
      : "a acusação de dívida sem motivo não saiu"
  },
  {
    id: "D018-M2", desc: "ORF1 mudo — o laço da população deixa de acusar quem não tem gatilho",
    gate: "[FAIL] D018-ORF1 nomeando o arquivo sem gatilho",
    ancora: "        if caminho in gatilhos:\n            continue",
    troca:  "        if True:\n            continue",
    cenario: { remover: "divida_inteira", indice: 0 },
    mata: s => temFail(s, /D018-ORF1 /) ? null : "nenhum [FAIL] D018-ORF1 saiu"
  },
  {
    id: "D018-M3", desc: "ORF1(b) frouxo — dívida sem prazo passa a valer como dívida viva",
    gate: "[FAIL] D018-ORF1 para o arquivo cuja dívida perdeu o prazo",
    ancora: '        if d and str(d.get("prazo", "")).strip():',
    troca:  "        if d:",
    cenario: { remover: "prazo", de: "dividas", indice: 0 },
    mata: s => temFail(s, /D018-ORF1 /) ? null
      : "com o prazo removido, o arquivo tinha de voltar a ser órfão e não voltou"
  },
  {
    id: "D018-M4", desc: "PRAZO1 cego — dívida vencida deixa de reprovar",
    gate: "[FAIL] D018-PRAZO1 … VENCIDO",
    ancora: "            venceu = date.fromisoformat(prazo) < hoje",
    troca:  "            venceu = False",
    cenario: { prazoPassado: true, indice: 0 },
    mata: s => temFail(s, /D018-PRAZO1 .*VENCIDO/) ? null
      : "a acusação de prazo vencido não saiu"
  },
  {
    id: "D018-M5", desc: "MORTO1 cego — declaração apontando arquivo inexistente passa",
    gate: "[FAIL] D018-MORTO1 … não existe no disco",
    ancora: "            elif not os.path.exists(caminho):",
    troca:  "            elif False:",
    cenario: { arquivoInexistente: true, indice: 0 },
    mata: s => temFail(s, /D018-MORTO1 .*não existe no disco/) ? null
      : "a acusação de declaração morta não saiu"
  },
  {
    id: "D018-M6", desc: "POP1(b) cego — o julgador fora da própria população passa em silêncio",
    gate: "[FAIL] D018-POP1(b) … o próprio julgador está FORA da população",
    ancora: "    if ESTE_GATE not in pop:",
    troca:  "    if False:",
    cenario: { esvaziarRegra: true },
    mata: s => temFail(s, /D018-POP1\(b\)/) ? null
      : "a acusação de auto-exclusão silenciosa não saiu"
  },
  {
    id: "D018-M7", desc: "veredito constante — o julgador devolve 0 com problemas na mesa",
    gate: "exit != 0 quando há problema(s)",
    ancora: "    return 1 if problemas else 0",
    troca:  "    return 0",
    cenario: { remover: "divida_inteira", indice: 0 },
    mata: (s, r) => r.code !== 0 ? null
      : "o julgador saiu 0 com " + (s.fecho ? s.fecho.problemas : "?") + " problema(s) na mesa"
  }
];

/* ── cenário: árvore sintética em cópia, nunca a de verdade ───────────────── */
const POP_REL = ".claude/verify/mutation_population.json";
const POP_ABS = path.join(HERE, ".claude", "verify", "mutation_population.json");

function popMutada(cenario) {
  const d = JSON.parse(fs.readFileSync(POP_ABS, "utf8"));
  if (!cenario) return d;
  const i = cenario.indice || 0;
  if (cenario.remover === "divida_inteira") d.dividas.splice(i, 1);
  else if (cenario.remover && cenario.de === "dividas") delete d.dividas[i][cenario.remover];
  if (cenario.prazoPassado) d.dividas[i].prazo = "2000-01-01";
  if (cenario.arquivoInexistente) d.dividas[i].arquivo = ".claude/verify/nao_existe_018.py";
  if (cenario.esvaziarRegra) d.regra.padrao = "check_baseline\\.py";
  return d;
}

function rodar(binario, gatePath, popPath) {
  /* PYTHONIOENCODING obrigatório: sem ele o Python emite cp1252 no Windows, e os
     acentos e o `·` das linhas do julgador chegam mangled — os oráculos deste
     harness casariam por acaso ou deixariam de casar por acaso. Dependência de
     ambiente DECLARADA, nunca implícita (R7 §4). */
  const env = Object.assign({}, process.env, { MUTCOV_POPULACAO: popPath, PYTHONIOENCODING: "utf-8" });
  const r = spawnSync(binario, [gatePath], { cwd: HERE, encoding: "utf8", env,
                                             maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { spawnFalhou: true, erro: String(r.error.message || r.error).split("\n")[0] };
  return { code: r.status, stdout: String(r.stdout || ""), stderr: String(r.stderr || "") };
}

function fonteDoGate() {
  return fs.readFileSync(GATE_ABS, "utf8").replace(/\r\n/g, "\n");
}
function ocorrencias(m, src) {
  let n = 0, i = 0;
  while ((i = src.indexOf(m.ancora, i)) !== -1) { n++; i += m.ancora.length; }
  return n;
}

function preflight() {
  const src = fonteDoGate();
  const binario = resolvePy(PY);
  const dados = {
    harness: "d018",
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

(() => {
  if (process.argv.slice(2).includes("--preflight")) process.exit(preflight());

  const shaAntes = sha256(fs.readFileSync(GATE_ABS));
  const src = fonteDoGate();
  const binario = resolvePy(PY);
  let D = 0, S = 0, U = 0;

  const emitir = (m, estado, causa, nota) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 600) : ""));
    console.log("");
  };

  for (const m of MUTANTES) {
    if (!binario) { emitir(m, NAO_EXECUTADO, CAUSA.interpretador, PY); continue; }
    const n = ocorrencias(m, src);
    if (n !== 1) { emitir(m, NAO_EXECUTADO, n === 0 ? CAUSA.ausente : CAUSA.ambigua,
                          GATE_POSIX + ": âncora casou " + n + "×"); continue; }
    let dir = null;
    try {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), "d018-"));
      const alvo = path.join(dir, "check_mutation_coverage_mutado.py");
      fs.writeFileSync(alvo, src.replace(m.ancora, m.troca), { encoding: "utf8" });
      const popPath = path.join(dir, "populacao.json");
      fs.writeFileSync(popPath, JSON.stringify(popMutada(m.cenario), null, 2), { encoding: "utf8" });

      /* CONTROLE: o gate ÍNTEGRO sobre o MESMO cenário tem de produzir o sinal.
         Sem isto, um mutante "morreria" por um cenário que já falhava sozinho. */
      const ctrl = rodar(binario, path.join(HERE, GATE_REL), popPath);
      const sCtrl = ctrl.spawnFalhou ? null : lerSaida(ctrl.stdout);
      if (!sCtrl || (m.mata(sCtrl, ctrl) !== null)) {
        emitir(m, NAO_EXECUTADO, "cenario nao produz o sinal no gate integro",
               "controle: " + (ctrl.spawnFalhou ? ctrl.erro : (m.mata(sCtrl, ctrl) || "sinal presente")));
        continue;
      }

      const r = rodar(binario, alvo, popPath);
      if (r.spawnFalhou) { emitir(m, NAO_EXECUTADO, CAUSA.copia, r.erro); continue; }
      const s = lerSaida(r.stdout);
      const medido = "medido: exit " + r.code + " · " + s.fails.length + " FAIL · " +
        (s.fecho ? s.fecho.problemas + " problema(s)" : "fecho ausente");
      /* Fecho ausente = o julgador mutado NÃO chegou ao fim (traceback). Matar por
         crash é detecção incidental, que este harness recusa por desenho — foi
         assim que o D018-M3 "matou" na primeira execução, por KeyError, e o
         achado virou endurecimento do julgador em vez de kill contabilizado. */
      if (!s.fecho) { emitir(m, NAO_EXECUTADO, "julgador mutado nao chegou ao fecho", medido); continue; }
      const porque = m.mata(s, r);
      if (porque === null) emitir(m, SOBREVIVENTE, "", "o mutante continuou emitindo o sinal ‖ " + medido);
      else emitir(m, DETECTADO, "", medido);
    } catch (e) {
      emitir(m, NAO_EXECUTADO, "falha nao classificada: " + String((e && e.message) || e).split("\n")[0].slice(0, 140), "");
    } finally {
      if (dir) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) { /* declarado */ } }
    }
  }

  const shaDepois = sha256(fs.readFileSync(GATE_ABS));
  const intacta = shaAntes === shaDepois;
  if (!intacta) {
    console.log(NAO_EXECUTADO + "  D018-ARVORE · " + CAUSA.arvore);
    console.log("              " + GATE_POSIX + ": " + shaAntes.slice(0, 16) + " → " + shaDepois.slice(0, 16));
    console.log("");
  }
  console.log("----");
  console.log("d018: " + D + " DETECTADO · " + S + " SOBREVIVENTE · " + U + " NÃO EXECUTADO" +
              " · gate rastreado " + (intacta ? "intacto (sha " + shaAntes.slice(0, 12) + ")" : "MUTADO — falha"));
  process.exit(D === MUTANTES.length && intacta ? 0 : 1);
})();
