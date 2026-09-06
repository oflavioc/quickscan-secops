/* ============================================================================
   CAMPANHA DE MUTAÇÃO · EA-41 — a normalização de texto declarada está EM VIGOR
   harness `ea41` · fix-finding EA-41 (R7 §1 executável) · dono: qa-engineer · 2026-09-05
   ============================================================================
   Instrumento de MEDIÇÃO do poder discriminante do gate `eol-text`
   (.claude/verify/check_eol_text.py — EA41-EOL1(a)/(b)) sobre a ÁRVORE REAL, na
   forma que a sonda interna do gate (EA41-EOL0, repositório efêmero) NÃO alcança:
   os estados MISTOS índice × worktree, que só existem num repositório vivo.

     · EA41-M1  ÁRVORE  — NUL só no WORKTREE (i/lf w/-text): os dois escapes da
                âncora do sujeito viram o byte 0x00 no disco, antes do add. É o
                EA-41 em miniatura no momento mais cedo em que o gate o alcança
                (o hook Stop e o run.sh --light executam o stage eol-text). Mata
                EOL1(a) pelo disjunto `w/-text`, origem worktree, código `nul`.
     · EA41-M2  ÍNDICE  — CR no blob do ÍNDICE sob eol=lf (i/crlf w/lf): o blob do
                sujeito é regravado com CRLF SEM filtro (`git hash-object -w
                --no-filters --stdin` + `git update-index --cacheinfo`) — o E9
                consumado, e o único caminho que alcança EOL1(b): CR só no
                worktree NÃO reprova (controle negativo abaixo).
     · EA41-M3  ÍNDICE  — NUL no blob do ÍNDICE (i/-text w/lf): o estado EXATO do
                RED do EA-41 (.claude/BACKLOG.md em 2a1fb7f — byte commitado, disco
                já corrigido). Mata EOL1(a) pelo disjunto `i/-text`, origem índice.
       M1 e M3 juntos são as testemunhas de que os DOIS disjuntos de (a) estão
       vivos: a sonda S1 tem i/-text E w/-text ao mesmo tempo, logo não distingue
       a perda de um só deles; um mutante do gate que apague `reg["w"] == "-text"`
       faz M1 SOBREVIVER, e um que apague `reg["i"] == "-text"` faz M3 sobreviver.

   CONTROLES (fora da contagem do preflight; falha de controle derruba o exit):
     · C0-eol — baseline VERDE do gate nu antes de mutar: sonda íntegra (N/N),
       0 problema(s), 0 falha(s) de instrumento, exit 0, e o sujeito i/lf w/lf
       attr/text=auto eol=lf. Kill medido contra baseline vermelho não é atribuível
       ao mutante: com C0 vermelho todo mutante sai NÃO EXECUTADO, e a NOTA leva o
       `resultado:` do controle (é a única linha que chega ao log do CI).
     · EA41-M2/negativo — CRLF só no WORKTREE do sujeito (índice LF): o gate tem de
       ALCANÇAR O VERDE (exit 0, 0 problema(s)), contar "CR só no worktree" e
       nomear o sujeito em [INFO]. Prova que o kill de M2 é do blob do índice, não
       de CR em geral — sem ele, um gate constante-vermelho para CR passaria.

   ORÁCULO: as linhas de vocabulário FECHADO do próprio gate — `[FAIL] EA41-EOL1(x)
   <path> — attr/… · i/… w/…: … · causa (<origem>): <código> — NUL=… · CR
   solitário=… · CRLF=…` e a linha de fecho `eol-text: … problema(s) [EOL1(a)=…
   · EOL1(b)=…] · … falha(s) de instrumento · sonda N/N`. O julgador pina, por
   mutante: exit, alínea, PATH do sujeito, attr, i/, w/, origem, código, NUL,
   linha da 1ª ocorrência (derivada da fixture em runtime, nunca número fixo),
   CR solitário, CRLF, os totais [a/b] e o ISOLAMENTO (exatamente UMA linha
   [FAIL] na saída, a do sujeito). Reprovar pela razão errada é sobrevivente
   disfarçado. Fecho ilegível, sonda incompleta ou falha de instrumento no gate
   ⇒ NÃO EXECUTADO · gate não pôde ser executado — nunca DETECTADO por acidente.
   Números da árvore (rastreados, excluídos…) NÃO são pinados: mudam a cada
   commit e não pertencem ao mutante.

   ÍNDICE: `update-index --cacheinfo` aceita sha INEXISTENTE sem erro e o git passa
   a responder `i/none` (medido em git 2.55) — o gate não acusaria e o mutante
   sairia SOBREVIVENTE por defeito do andaime. Por isso o blob é gravado com `-w`
   e, depois do cacheinfo, o harness CONFERE `git ls-files --eol` (i/crlf para M2,
   i/-text para M3) antes de rodar o gate; divergência ⇒ NÃO EXECUTADO · rebuild
   falhou. O objeto solto que `-w` deixa no object store é inalcançável e o gc o
   recolhe; não é árvore (git status não o vê).

   RESTAURAÇÃO (R7 §3), sob try/finally: worktree = bytes originais + SHA-256
   conferido; índice = `update-index --cacheinfo` com o sha ORIGINAL + linha de
   `git ls-files -s` idêntica à de partida; `git status --porcelain` ESCOPADO ao
   sujeito idêntico ao de partida (sob o stage `mutation` a árvore é limpa, logo
   idêntico ⇔ limpo; numa execução direta com o sujeito recém-adicionado, `A `
   antes e depois é restauração provada, e o estado é impresso). Se uma campanha
   morrer sem restaurar: `git restore --staged .claude/verify/fixtures_ea41/sujeito.md`
   (índice) e `git checkout -- .claude/verify/fixtures_ea41/sujeito.md` (worktree).

   VOCABULÁRIO FECHADO DE TRÊS ESTADOS — DETECTADO · SOBREVIVENTE · NÃO EXECUTADO
   (este sempre com UMA causa do conjunto fechado de T4 da 013). Interpretador:
   MUTATION_PY ou o padrão da plataforma (win32 ? python : python3), RESOLVIDO no
   preflight (C1/C4); gate invocado por lista de argumentos, sem shell (R10 §7).

   `--preflight` (argv) — D4 da 013, no MESMO commit da entrada `ea41` em
   mutation_map.json. Não muta, não executa gate, não escreve nada: conta a âncora
   de M1/M3 na fixture (ocorrências da linha do escape) e lê a entrada do sujeito
   no índice (uma entrada, estágio 0, i/lf) para M2/M3 — leitura por plumbing, sem
   escrita. stdout é só o JSON; texto humano vai a stderr. Exit 0 sse interpretador
   resolvido e toda âncora com ocorrencias == 1.

   Filtro de depuração: EA41_MUT_ONLY=EA41-M2 node tests_ea41_mutants.js
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const HERE = __dirname;
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");

/* Resolve o binário no PATH sem lançar processo NENHUM (C1 / R7 §3). */
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

const GATE_REL = path.join(".claude", "verify", "check_eol_text.py");
const SUJEITO_REL = ".claude/verify/fixtures_ea41/sujeito.md";        // como o git o nomeia (posix)
const SUJEITO = path.join.apply(path, [HERE].concat(SUJEITO_REL.split("/")));
const ATTR_ESPERADO = "text=auto eol=lf";

/* ── vocabulário fechado (T4 da 013) ──────────────────────────────────────── */
const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente:       "âncora não encontrada",
  ambigua:       "âncora ambígua",
  rebuild:       "rebuild falhou",
  gate:          "gate não pôde ser executado"
};
const naoClassificada = msg => "falha não classificada: " + msg;

/* ── âncora e réplicas ────────────────────────────────────────────────────── */
/* O byte 0x00 NASCE AQUI, em runtime, a partir do escape de seis caracteres: nem
   este arquivo nem a fixture carregam o byte — os dois são varridos pelo próprio
   gate (sem auto-exclusão, R10 §10) e têm de ficar i/lf w/lf. */
const ESCAPE = "\\u0000";                                   // seis caracteres: \ u 0 0 0 0
const BYTE_NUL = String.fromCharCode(0);                                  // o byte proibido, só em memória
const LINHA_ESCAPE = 'chave = ctxChave(d) + "' + ESCAPE + '" + d.seletor + "' + ESCAPE + '" + d.prop';
const LINHA_BYTE = LINHA_ESCAPE.split(ESCAPE).join(BYTE_NUL);
if (LINHA_ESCAPE.indexOf(BYTE_NUL) >= 0 || LINHA_BYTE.split(BYTE_NUL).length !== 3)
  throw new Error("réplica de M1/M3 mal formada: o escape colapsou ou o byte não nasceu");

/* bytes → bytes por latin1 (1 byte ↔ 1 char): fiel a qualquer conteúdo, inclusive UTF-8 e NUL */
const bin = b => b.toString("latin1");
const buf = s => Buffer.from(s, "latin1");
const contar = (s, sub) => s.split(sub).length - 1;
const nulNoLugarDoEscape = b => buf(bin(b).replace(LINHA_ESCAPE, () => LINHA_BYTE));
const crlfEmTodaLinha = b => buf(bin(b).split("\n").join("\r\n"));
const linhaDaAncora = b => { const s = bin(b); const i = s.indexOf(LINHA_ESCAPE); return i < 0 ? null : contar(s.slice(0, i), "\n") + 1; };

/* ==========================================================================
   OS 3 MUTANTES · EA41-M1..EA41-M3 (+ 2 controles)
   `modo`: "arvore" (bytes do worktree) · "indice" (blob do índice, `indice` = i/
   que o git tem de responder depois do cacheinfo). `ancora`: o que o preflight
   conta. `bytes`: a transformação. `espera`: oráculo sobre as linhas do gate.
   ========================================================================== */
const MUTANTS = [
  { id: "EA41-M1", modo: "arvore",
    desc: "ÁRVORE: no worktree do sujeito, os dois escapes da âncora viram o byte 0x00 (i/lf w/-text) — o EA-41 em miniatura, antes do add",
    gate: "EA41-EOL1(a) (check_eol_text.py, alínea a, disjunto w/-text, origem worktree)",
    ancora: { linha: true }, bytes: nulNoLugarDoEscape,
    espera: { exit: 1, alinea: "a", i: "lf", w: "-text", origem: "worktree", codigo: "nul",
              nul: 2, linha_nul: "ancora", cr_solitario: 0, crlf: 0, a: 1, b: 0 } },
  { id: "EA41-M2", modo: "indice", indice: "crlf",
    desc: "ÍNDICE: o blob do sujeito é regravado com CRLF sem filtro (hash-object --no-filters + update-index --cacheinfo) — o E9 consumado sob eol=lf (i/crlf w/lf)",
    gate: "EA41-EOL1(b) (check_eol_text.py, alínea b, blob do índice com CR)",
    ancora: { indice: true }, bytes: crlfEmTodaLinha,
    espera: { exit: 1, alinea: "b", i: "crlf", w: "lf", origem: "índice", codigo: "cr-no-indice",
              nul: 0, linha_nul: null, cr_solitario: 0, crlf: "linhas", a: 0, b: 1 } },
  { id: "EA41-M3", modo: "indice", indice: "-text",
    desc: "ÍNDICE: o blob do sujeito é regravado com os dois bytes 0x00 no lugar dos escapes (i/-text w/lf) — o estado EXATO do RED do EA-41 (byte commitado, disco corrigido)",
    gate: "EA41-EOL1(a) (check_eol_text.py, alínea a, disjunto i/-text, origem índice)",
    ancora: { linha: true, indice: true }, bytes: nulNoLugarDoEscape,
    espera: { exit: 1, alinea: "a", i: "-text", w: "lf", origem: "índice", codigo: "nul",
              nul: 2, linha_nul: "ancora", cr_solitario: 0, crlf: 0, a: 1, b: 0 } }
];

/* Controles verdes — não são mutantes, não entram na contagem de detectados;
   falha de controle derruba o exit da campanha. */
const CONTROLES = [
  { id: "C0-eol", modo: "base",
    desc: "baseline verde do gate nu: sonda íntegra N/N, 0 problema(s), 0 falha(s) de instrumento, exit 0; sujeito i/lf w/lf attr/text=auto eol=lf" },
  { id: "EA41-M2/negativo", modo: "arvore", ancora: { lfPuro: true }, bytes: crlfEmTodaLinha,
    desc: "CRLF só no WORKTREE do sujeito (índice LF): o gate alcança o VERDE — exit 0, 0 problema(s), 'CR só no worktree' >= 1 e o sujeito nomeado em [INFO]; o kill de M2 é do blob do ÍNDICE, não de CR em geral" }
];

/* ── git por lista de argumentos, sem shell (R10 §7) ──────────────────────── */
function git(args, opts) {
  return spawnSync("git", args, Object.assign({ cwd: HERE, maxBuffer: 64 * 1024 * 1024 }, opts || {}));
}
function gitTexto(args, input) {
  const r = git(args, { encoding: "utf8", input });
  return { rc: r.error ? -1 : r.status, out: String(r.stdout || ""),
           err: r.error ? String(r.error.message || r.error) : String(r.stderr || "") };
}
function gitBytes(args, input) {
  const r = git(args, { input });                                   // sem encoding → Buffers
  return { rc: r.error ? -1 : r.status, out: r.stdout || Buffer.alloc(0),
           err: r.error ? String(r.error.message || r.error) : String(r.stderr || "") };
}
/* entrada do sujeito no índice + o que o git responde em --eol para ele */
function lerIndice() {
  const s = gitTexto(["ls-files", "-s", "--", SUJEITO_REL]);
  const linhas = s.out.split("\n").filter(Boolean);
  const m = linhas.length === 1 ? /^(\d{6}) ([0-9a-f]{40}) (\d)\t(.*)$/.exec(linhas[0]) : null;
  const e = gitTexto(["ls-files", "--eol", "--", SUJEITO_REL]);
  const el = e.out.split("\n").filter(Boolean);
  const me = el.length === 1 ? /^i\/(\S*)\s+w\/(\S*)\s+attr\/(.*?)\s*\t(.*)$/.exec(el[0]) : null;
  return { rc: s.rc, linha: linhas[0] || "", n: linhas.length, modo: m ? m[1] : null, sha: m ? m[2] : null,
           estagio: m ? m[3] : null, eol: me ? { i: me[1], w: me[2], attr: me[3] } : null };
}
function porcelainDoSujeito() {
  const r = gitTexto(["status", "--porcelain", "--", SUJEITO_REL]);
  return r.rc === 0 ? r.out.trim() : "(git status falhou: " + r.err.split("\n")[0] + ")";
}

/* ── fotografia de partida: worktree, índice, blob, porcelain ─────────────── */
const BASE = { wt: null, wtSha: null, idx: null, blob: null, porcelain: null };
function fotografarBase() {
  BASE.wt = fs.existsSync(SUJEITO) ? fs.readFileSync(SUJEITO) : null;
  BASE.wtSha = BASE.wt ? sha256(BASE.wt) : null;
  BASE.idx = lerIndice();
  BASE.blob = null;
  if (BASE.idx.n === 1 && BASE.idx.sha) {
    const r = gitBytes(["cat-file", "blob", BASE.idx.sha]);
    if (r.rc === 0) BASE.blob = r.out;
  }
  BASE.porcelain = porcelainDoSujeito();
}

/* CONTAGEM, não presença: 0 é âncora podre, >=2 é âncora ambígua. */
function ocorrencias(m) {
  const ed = [], a = m.ancora || {};
  if (a.linha) {
    const fonte = m.modo === "indice" ? BASE.blob : BASE.wt;
    ed.push({ arquivo: SUJEITO_REL, alvo: m.modo === "indice" ? "blob do índice" : "worktree",
              ancora: "linha do escape", ocorrencias: fonte ? contar(bin(fonte), LINHA_ESCAPE) : 0 });
  }
  if (a.indice || m.modo === "indice") {
    const i = BASE.idx, ok = i.n === 1 && i.estagio === "0" && !!BASE.blob && !!i.eol && i.eol.i === "lf";
    ed.push({ arquivo: SUJEITO_REL, alvo: "entrada do índice", ancora: "uma entrada, estágio 0, i/lf",
              ocorrencias: ok ? 1 : 0, lido: i.n + " entrada(s)" + (i.eol ? " · i/" + i.eol.i : " · sem --eol") });
  }
  if (a.lfPuro) {
    const ok = !!BASE.wt && contar(bin(BASE.wt), "\n") > 0 && bin(BASE.wt).indexOf("\r") < 0;
    ed.push({ arquivo: SUJEITO_REL, alvo: "worktree", ancora: "arquivo LF sem CR", ocorrencias: ok ? 1 : 0 });
  }
  if (m.modo === "arvore" && !BASE.wt) ed.push({ arquivo: SUJEITO_REL, alvo: "worktree", ancora: "arquivo presente", ocorrencias: 0 });
  const ns = ed.map(e => e.ocorrencias);
  const n = ns.length && ns.every(x => x === 1) ? 1 : (ns.some(x => x === 0) || !ns.length ? 0 : Math.max.apply(null, ns));
  return { arquivo: SUJEITO_REL, ocorrencias: n, edicoes: ed };
}

function selecionar() {
  const only = (process.env.EA41_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}

/* ── modo preflight (argv, D4) · contrato C1 ──────────────────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "ea41",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    arquivos_mutados: [SUJEITO_REL],
    controles: CONTROLES.map(c => c.id),
    mutantes: []
  };
  for (const m of sel) {
    const p = ocorrencias(m);
    const e = { id: m.id, arquivo: p.arquivo, ocorrencias: p.ocorrencias,
                estado: p.ocorrencias === 1 ? "ok" : "nao_executavel", edicoes: p.edicoes };
    if (p.ocorrencias === 0) e.causa = CAUSA.ausente;
    else if (p.ocorrencias > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT ea41 · " + dados.mutantes.length + " mutante(s) · " + CONTROLES.length +
    " controle(s) · interpretador " + PY + " (" + PY_ORIGEM + "): " +
    (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
  for (const m of dados.mutantes) {
    process.stderr.write("  " + (m.estado === "ok" ? "ok           " : "nao_executavel") + " " + m.id +
      " · ocorrencias=" + m.ocorrencias + " em " + m.arquivo + " [" +
      m.edicoes.map(e => e.alvo + ": " + e.ancora + " = " + e.ocorrencias + (e.lido ? " (" + e.lido + ")" : "")).join("; ") +
      "]" + (m.causa ? " · " + m.causa : "") + "\n");
  }
  process.stderr.write(podres.length
    ? podres.length + " âncora(s) fora de ocorrencias == 1: " + podres.map(m => m.id).join(", ") + "\n"
    : "todas as âncoras com ocorrencias == 1\n");
  if (!binario) process.stderr.write(CAUSA.interpretador + ": " + PY + "\n");
  return (binario && podres.length === 0) ? 0 : 1;
}

if (process.argv.slice(2).indexOf("--preflight") >= 0) {
  fotografarBase();
  process.exitCode = preflight(selecionar().sel);
  return;
}

/* ── execução do gate (lista de argumentos, sem shell — R10 §7) ───────────── */
function rodarGate(binario) {
  const r = spawnSync(binario, [GATE_REL], { cwd: HERE, encoding: "utf8", env: process.env,
                                             maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { spawnFalhou: true, erro: String(r.error.message || r.error).split("\n")[0] };
  return { code: r.status, stdout: String(r.stdout || ""), stderr: String(r.stderr || "") };
}

/* ── leitor da saída do gate — vocabulário fechado, campo a campo ─────────── */
const RE_FECHO = /^eol-text: (\d+) rastreado\(s\) · (\d+) com normalização declarada · (\d+) excluído\(s\) por declaração \(-text\) · (\d+) sem declaração · (\d+) com CR só no worktree · (\d+) problema\(s\) \[EOL1\(a\)=(\d+) · EOL1\(b\)=(\d+)\] · (\d+) falha\(s\) de instrumento · sonda (\d+)\/(\d+)$/;
const RE_PROBLEMA = /^\[FAIL\] EA41-EOL1\(([ab])\) (.+?) — attr\/(.+?) · i\/(\S*) w\/(\S*): .*? · causa \((índice|worktree)\): (\S+) — (.*)$/;
const RE_CENSO = /^NUL=(\d+)(?: \(1ª ocorrência: linha (\d+)\))? · CR solitário=(\d+) · CRLF=(\d+)$/;
const RE_INFO_CR = /^\[INFO\] CR só no worktree \(o índice está LF; o próximo add normaliza\): (.*)$/;

function lerSaida(stdout) {
  const linhas = String(stdout || "").split("\n").map(l => l.replace(/\r$/, ""));
  const out = { fecho: null, problemas: [], fails: [], infoCr: null,
                ultima: linhas.filter(Boolean).slice(-1)[0] || "(saída vazia)" };
  for (const l of linhas) {
    const f = RE_FECHO.exec(l);
    if (f) {
      out.fecho = { rastreados: +f[1], normalizados: +f[2], excluidos: +f[3], sem_declaracao: +f[4],
                    cr_so_worktree: +f[5], problemas: +f[6], a: +f[7], b: +f[8],
                    falhas_instrumento: +f[9], sonda: +f[10], sonda_total: +f[11] };
      continue;
    }
    if (l.indexOf("[FAIL]") === 0) {
      out.fails.push(l);
      const p = RE_PROBLEMA.exec(l);
      if (p) {
        const c = RE_CENSO.exec(p[8]);
        out.problemas.push({ alinea: p[1], path: p[2], attr: p[3], i: p[4], w: p[5], origem: p[6], codigo: p[7],
                             censo_legivel: !!c, nul: c ? +c[1] : null,
                             linha_nul: c ? (c[2] === undefined ? null : +c[2]) : null,
                             cr_solitario: c ? +c[3] : null, crlf: c ? +c[4] : null });
      }
      continue;
    }
    const i = RE_INFO_CR.exec(l);
    if (i) out.infoCr = i[1];
  }
  return out;
}

/* instrumento presente? (gate rodou, julgou a árvore com sonda íntegra e sem falha
   de instrumento) — senão NÃO EXECUTADO, nunca DETECTADO por acidente */
function instrumentoAusente(s, r) {
  if (!s.fecho)
    return "saída sem a linha de fecho `eol-text: … sonda N/N` (exit " + r.code + ") · última linha: " + s.ultima.slice(0, 160);
  if (s.fecho.sonda_total === 0 || s.fecho.sonda !== s.fecho.sonda_total)
    return "sonda incompleta " + s.fecho.sonda + "/" + s.fecho.sonda_total + " — o instrumento não julgou a árvore (exit " + r.code + ")";
  if (s.fecho.falhas_instrumento !== 0)
    return s.fecho.falhas_instrumento + " falha(s) de instrumento no gate (exit " + r.code + ") · " +
      s.fails.filter(l => l.indexOf("EA41-EOL1") < 0).slice(0, 2).join(" | ");
  return null;
}

/* ── julgadores ───────────────────────────────────────────────────────────── */
function julgaMutante(r, m, ctx) {
  const s = lerSaida(r.stdout);
  const ausente = instrumentoAusente(s, r);
  if (ausente) return { naoExecutado: CAUSA.gate, nota: ausente };
  const e = m.espera, dif = [];
  const cmp = (campo, esperado, obtido) => {
    if (esperado !== obtido) dif.push(campo + ": esperado " + JSON.stringify(esperado) + " · obtido " + JSON.stringify(obtido));
  };
  cmp("exit", e.exit, r.code);
  cmp("problemas", 1, s.fecho.problemas);
  cmp("EOL1(a)", e.a, s.fecho.a);
  cmp("EOL1(b)", e.b, s.fecho.b);
  cmp("linhas [FAIL] (isolamento)", 1, s.fails.length);
  const p = s.problemas.filter(x => x.path === SUJEITO_REL)[0];
  if (!p) {
    dif.push("sujeito não acusado: nenhuma linha [FAIL] EA41-EOL1 nomeia " + SUJEITO_REL +
      (s.problemas.length ? " (acusados: " + s.problemas.map(x => x.path).join(", ") + ")" : ""));
  } else {
    cmp("alinea", e.alinea, p.alinea); cmp("attr", ATTR_ESPERADO, p.attr);
    cmp("i", e.i, p.i); cmp("w", e.w, p.w); cmp("origem", e.origem, p.origem); cmp("codigo", e.codigo, p.codigo);
    if (!p.censo_legivel) dif.push("censo ilegível na linha do problema");
    else {
      cmp("NUL", e.nul, p.nul);
      cmp("linha da 1ª ocorrência", e.linha_nul === "ancora" ? ctx.linhaAncora : e.linha_nul, p.linha_nul);
      cmp("CR solitário", e.cr_solitario, p.cr_solitario);
      cmp("CRLF", e.crlf === "linhas" ? ctx.linhas : e.crlf, p.crlf);
    }
  }
  const medido = "medido: exit " + r.code + " · " + s.fecho.problemas + " problema(s) [a=" + s.fecho.a + " b=" + s.fecho.b + "] · " +
    s.fails.length + " linha(s) [FAIL]" +
    (p ? " · " + SUJEITO_REL + ": EOL1(" + p.alinea + ") i/" + p.i + " w/" + p.w + " · causa (" + p.origem + "): " + p.codigo +
         " — NUL=" + p.nul + (p.linha_nul !== null ? " (linha " + p.linha_nul + ")" : "") +
         " · CR solitário=" + p.cr_solitario + " · CRLF=" + p.crlf : "") +
    " · sonda " + s.fecho.sonda + "/" + s.fecho.sonda_total;
  return { kill: dif.length === 0, nota: (dif.length ? dif.join(" | ") + " ‖ " : "") + medido };
}

function julgaControle(r, c) {
  const s = lerSaida(r.stdout);
  const ausente = instrumentoAusente(s, r);
  if (ausente) return { ok: false, nota: ausente };
  const f = s.fecho;
  const base = "exit " + r.code + " · " + f.problemas + " problema(s) [a=" + f.a + " b=" + f.b + "] · " + s.fails.length +
    " linha(s) [FAIL] · " + f.rastreados + " rastreado(s) · " + f.normalizados + " com normalização declarada · " +
    f.excluidos + " excluído(s) · " + f.sem_declaracao + " sem declaração · " + f.cr_so_worktree +
    " com CR só no worktree · sonda " + f.sonda + "/" + f.sonda_total;
  if (c.modo === "base") {
    const idx = BASE.idx, eol = idx.eol;
    const sujeitoOk = idx.n === 1 && !!eol && eol.i === "lf" && eol.w === "lf" && eol.attr === ATTR_ESPERADO;
    const ok = r.code === 0 && f.problemas === 0 && s.fails.length === 0 && sujeitoOk;
    return { ok, nota: base + " · sujeito " + (eol ? "i/" + eol.i + " w/" + eol.w + " attr/" + eol.attr : "SEM entrada no índice") +
      (idx.n !== 1 ? " (" + idx.n + " entrada(s))" : "") + (s.fails.length ? " · " + s.fails.slice(0, 2).join(" | ") : "") };
  }
  /* negativo: CRLF só no worktree ⇒ verde, contado e nomeado */
  const nomeado = !!s.infoCr && s.infoCr.split(", ").indexOf(SUJEITO_REL + " (w/crlf)") >= 0;
  const ok = r.code === 0 && f.problemas === 0 && s.fails.length === 0 && f.cr_so_worktree >= 1 && nomeado;
  return { ok, nota: base + " · [INFO] " + (nomeado ? "nomeia " + SUJEITO_REL + " (w/crlf)" : "NÃO nomeia o sujeito: " + (s.infoCr || "linha ausente")) +
    (s.fails.length ? " · " + s.fails.slice(0, 2).join(" | ") : "") };
}

/* ── aplicar / restaurar ──────────────────────────────────────────────────── */
function aplicar(m) {
  if (m.modo === "arvore") {
    fs.writeFileSync(SUJEITO, m.bytes(BASE.wt));
    return { erro: null };
  }
  const novo = m.bytes(BASE.blob);
  const h = gitBytes(["hash-object", "-w", "--no-filters", "--stdin"], novo);
  const shaNovo = h.out.toString("utf8").trim();
  if (h.rc !== 0 || !/^[0-9a-f]{40}$/.test(shaNovo))
    return { erro: CAUSA.rebuild, nota: "hash-object -w --no-filters falhou (rc " + h.rc + "): " + h.err.split("\n")[0] };
  const u = gitTexto(["update-index", "--cacheinfo", BASE.idx.modo + "," + shaNovo + "," + SUJEITO_REL]);
  if (u.rc !== 0)
    return { erro: CAUSA.rebuild, nota: "update-index --cacheinfo falhou (rc " + u.rc + "): " + u.err.split("\n")[0] };
  const agora = lerIndice();
  if (!agora.eol || agora.eol.i !== m.indice || agora.sha !== shaNovo)
    return { erro: CAUSA.rebuild, nota: "o blob mutado não chegou ao índice como i/" + m.indice + ": lido " +
      (agora.eol ? "i/" + agora.eol.i + " w/" + agora.eol.w : "sem --eol") + " · sha " + (agora.sha || "?").slice(0, 12) +
      " (esperado " + shaNovo.slice(0, 12) + ")" };
  return { erro: null };
}
function restaurar(m) {
  if (m.modo === "arvore") {
    fs.writeFileSync(SUJEITO, BASE.wt);
    if (sha256(fs.readFileSync(SUJEITO)) !== BASE.wtSha) throw new Error(m.id + ": restauração do worktree NÃO byte-idêntica");
    return;
  }
  const u = gitTexto(["update-index", "--cacheinfo", BASE.idx.modo + "," + BASE.idx.sha + "," + SUJEITO_REL]);
  const agora = lerIndice();
  if (u.rc !== 0 || agora.linha !== BASE.idx.linha)
    throw new Error(m.id + ": restauração do índice falhou (rc " + u.rc + "; ls-files -s: '" + agora.linha + "' ≠ '" + BASE.idx.linha + "')");
}

const { only: ONLY, sel: SELECTED } = selecionar();
const CONTROLES_SEL = CONTROLES.filter(c => !ONLY.length || c.modo === "base" || ONLY.some(o => c.id.indexOf(o) === 0));

(() => {
  const report = [], falhasRestauracao = [];
  let D = 0, S = 0, U = 0, COK = 0, CFALHOU = 0;

  const emitir = (m, estado, causa, nota) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, estado, causa: causa || "", nota: nota || "" });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 700) : ""));
    console.log("");
  };
  const emitirControle = (c, ok, nota) => {
    if (ok) COK++; else CFALHOU++;
    console.log("CONTROLE  " + c.id + " · " + c.desc);
    console.log("              resultado: " + (ok ? "OK" : "FALHOU") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 700) : ""));
    console.log("");
  };
  const restaurarOuAnotar = m => { try { restaurar(m); } catch (e) { falhasRestauracao.push(String((e && e.message) || e).split("\n")[0]); } };

  const fechar = () => {
    const wtOk = !!BASE.wt && fs.existsSync(SUJEITO) && sha256(fs.readFileSync(SUJEITO)) === BASE.wtSha;
    const idxOk = lerIndice().linha === BASE.idx.linha;
    const porc = porcelainDoSujeito(), porcOk = porc === BASE.porcelain;
    console.log("restauração: sujeito no worktree byte a byte " + (wtOk ? "OK" : "FALHOU") +
      " · entrada do índice idêntica " + (idxOk ? "OK" : "FALHOU") +
      " · porcelain do alvo " + (porcOk ? (porc === "" ? "limpo" : "inalterado (sujo desde o início: " + porc.split("\n")[0] + ")")
                                         : "MUDOU → " + (porc || "(vazio)").split("\n")[0] + " (início: " + (BASE.porcelain || "limpo") + ")") +
      (falhasRestauracao.length ? " · FALHAS: " + falhasRestauracao.join(" | ") : ""));
    const ctrl = "controles: " + COK + " ok · " + CFALHOU + " falho(s)";
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_ea41_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U + " não executados (de " + SELECTED.length + ") · " + ctrl);
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nEA41 MUTATION [tests_ea41_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados · " + ctrl);
      if (S > 0) console.log("  " + S + " sobrevivente(s): " + report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    process.exitCode = (D === SELECTED.length && CFALHOU === 0 && wtOk && idxOk && porcOk && !falhasRestauracao.length) ? 0 : 1;
  };

  fotografarBase();
  const binario = resolvePy(PY);
  console.log("EA41 MUTATION · " + SELECTED.length + " mutante(s) · " + CONTROLES_SEL.length + " controle(s) · interpretador " + PY +
    " (" + PY_ORIGEM + ") " + (binario ? "resolvido em " + binario : "NÃO RESOLVIDO"));
  console.log("sujeito: " + SUJEITO_REL + " · worktree " + (BASE.wtSha ? BASE.wtSha.slice(0, 12) : "AUSENTE") +
    " · índice " + (BASE.idx.sha ? BASE.idx.sha.slice(0, 12) + " (" + BASE.idx.modo + ", estágio " + BASE.idx.estagio + ")" : "SEM ENTRADA") +
    " · " + (BASE.idx.eol ? "i/" + BASE.idx.eol.i + " w/" + BASE.idx.eol.w + " attr/" + BASE.idx.eol.attr : "sem --eol") +
    " · porcelain de partida: " + (BASE.porcelain || "limpo") + "\n");
  if (ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + ONLY.join(", ") + "\n");
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — campanha abortada antes de mutar; nada tocado\n");
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "");
    return fechar();
  }

  /* 1. controle de baseline — antes de qualquer mutação */
  let c0 = null;
  for (const c of CONTROLES_SEL.filter(c => c.modo === "base")) {
    const r = rodarGate(binario);
    const v = r.spawnFalhou ? { ok: false, nota: CAUSA.gate + ": " + r.erro } : julgaControle(r, c);
    c0 = { id: c.id, ok: v.ok, nota: v.nota };
    emitirControle(c, v.ok, v.nota);
  }
  const baselineVermelho = !!c0 && !c0.ok;
  const notaBaseline = prefixo => prefixo + " · controle " + c0.id + " · resultado: FALHOU · " + c0.nota;

  /* 2. mutantes */
  for (const m of SELECTED) {
    const pf = ocorrencias(m);
    if (pf.ocorrencias !== 1) {
      emitir(m, NAO_EXECUTADO, pf.ocorrencias === 0 ? CAUSA.ausente : CAUSA.ambigua,
        pf.edicoes.map(e => e.alvo + ": " + e.ancora + " = " + e.ocorrencias + (e.lido ? " (" + e.lido + ")" : "")).join(", "));
      continue;
    }
    if (baselineVermelho) {
      emitir(m, NAO_EXECUTADO, CAUSA.gate, notaBaseline("baseline do gate nu VERMELHO — kill não atribuível ao mutante"));
      continue;
    }
    const fonte = m.modo === "indice" ? BASE.blob : BASE.wt;
    const ctx = { linhaAncora: linhaDaAncora(fonte), linhas: contar(bin(fonte), "\n") };
    let estado = "", causa = "", nota = "";
    try {
      const a = aplicar(m);
      if (a.erro) { estado = NAO_EXECUTADO; causa = a.erro; nota = a.nota; }
      else {
        const r = rodarGate(binario);
        if (r.spawnFalhou) { estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = String(r.erro).slice(0, 160); }
        else {
          const v = julgaMutante(r, m, ctx);
          if (v.naoExecutado) { estado = NAO_EXECUTADO; causa = v.naoExecutado; nota = v.nota; }
          else { estado = v.kill ? DETECTADO : SOBREVIVENTE; nota = v.nota; }
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      restaurarOuAnotar(m);
    }
    emitir(m, estado, causa, nota);
  }

  /* 3. controle negativo (CRLF só no worktree; restaura) */
  for (const c of CONTROLES_SEL.filter(c => c.modo !== "base")) {
    if (baselineVermelho) { emitirControle(c, false, notaBaseline("baseline vermelho — não medido")); continue; }
    const pf = ocorrencias(c);
    if (pf.ocorrencias !== 1) {
      emitirControle(c, false, CAUSA.ausente + " · " + pf.edicoes.map(e => e.alvo + ": " + e.ancora + " = " + e.ocorrencias).join(", "));
      continue;
    }
    let ok = false, nota = "";
    try {
      const a = aplicar(c);
      if (a.erro) nota = a.erro + " · " + a.nota;
      else {
        const r = rodarGate(binario);
        const v = r.spawnFalhou ? { ok: false, nota: r.erro } : julgaControle(r, c);
        ok = v.ok; nota = v.nota;
      }
    } catch (e) { nota = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160)); }
    finally { restaurarOuAnotar(c); }
    emitirControle(c, ok, nota);
  }

  fechar();
})();
