/* ============================================================================
   CAMPANHA DE MUTAÇÃO · DEMANDA 010 — recomendação sem vão
   ============================================================================
   Instrumento de MEDIÇÃO. Não tem red próprio: o aceite é 100% KILL (R10 §5).

   CORRESPONDÊNCIA 1:1 COM A SPEC. Os ids são `D010-M1..D010-M20`, um por
   mutante `M1..M20` da spec §Critérios, mais `M21..M25` da errata E16 e `M26` da errata E17 (R10 §1 — namespace da fase corrente,
   nunca continuar numeração alheia; o `M1` global existe desde a 003).
   EXECUTADOS: 24 de 27 DECLARADOS. Os ids `D010-M21..D010-M25` nasceram da
   errata E16 (2026-08-30) sobre a propriedade que E15 tornou normativa — o
   prefixo `map:` —, e entram DEPOIS de `M20`: nenhum id existente renumera
   (R12). Contagem não é sagrada; ids são. Os cinco são mutante de FONTE e não
   par manual porque a errata E16 dispõe assim: prova manual vale no dia em que
   é feita e não é re-executada pela campanha — meses depois ela não distingue
   "a propriedade continua guardada" de "a âncora apodreceu e ninguém viu".
   `D010-M3` e `D010-M4` NÃO são implementados aqui — foram
   medidos SEM CASO nas fixtures declaradas (sob o workspace da 5.2 a varredura
   de `hideLegacyRecommendation` não alcança o nó que eles atacam) e entram como
   DÍVIDA DECLARADA COM CAUSA em `mutation-matrix.json → dividas_declaradas`.
   Dívida declarada nunca vira mutante sintético: um mutante escrito para caber
   numa fixture que não existe mede o gate contra a própria encenação.
   `D010-ARB3` continua com mutante VIVO (`D010-M20`), como R3 §5 exige.

   VOCABULÁRIO FECHADO DE TRÊS ESTADOS — DETECTADO · SOBREVIVENTE ·
   NÃO EXECUTADO (este sempre com UMA causa do conjunto fechado). Nasce aqui, e
   não é decoração: a campanha `d009` declara preflight e NÃO emite o
   vocabulário (dívida da 009), de modo que quem lê o relato dela não distingue
   "não executado" de "detectado" — medido em T012, onde foi preciso traduzir do
   stdout. O `d010` nasce sem essa dívida. Sobrevivência EXIGE gate executado:
   gate que não emitiu linha PASS/FAIL é NÃO EXECUTADO, jamais SOBREVIVENTE.

   `--preflight` (argv) — D4 da demanda 013, no MESMO commit do harness.
   `check_mutation.py:283-296` roda o preflight de TODO harness fora de
   `IC_SEM_PREFLIGHT`, INDEPENDENTE de trigger e de ambiente: um `d010` sem ele
   reprova IC-4 e derruba o stage inteiro MESMO com a campanha verde. O
   preflight não muta, não reconstrói, não executa gate e não escreve arquivo
   nenhum (C1 / R7 §3); stdout carrega só o JSON, texto humano vai para stderr.

   ÂNCORA POR CONTAGEM, nunca por presença. `ocorrencias == 1` é pré-condição de
   mutar: 0 é âncora podre e ≥2 é âncora ambígua, e as duas reprovam. Âncora
   ambígua mataria pelo sítio errado, que é SOBREVIVENTE disfarçado — foi o
   custo que a demanda 013 inteira pagou. As âncoras abaixo só podiam ser
   escritas agora: ancoram no código que T008 (`ui_target_v32.js`) e T013
   (`ui_v32.js`) acabaram de escrever.

   RESTAURAÇÃO BYTE A BYTE é conferida por SHA a cada mutante, no `finally`, e a
   campanha reconstrói o HTML no fecho. Campanha abandonada deixa mutante
   aplicado — a 009 pagou por isso (`D009-M15`).
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const HERE = __dirname;
const V32JS = path.join(HERE, "ui_v32.js");
const TGTJS = path.join(HERE, "ui_target_v32.js");
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

/* ── vocabulário fechado (T4) ─────────────────────────────────────────────── */
const DETECTADO = "DETECTADO", SOBREVIVENTE = "SOBREVIVENTE", NAO_EXECUTADO = "NÃO EXECUTADO";
const CAUSA = {
  interpretador: "interpretador ausente",
  ausente:       "âncora não encontrada",
  ambigua:       "âncora ambígua",
  rebuild:       "rebuild falhou",
  gate:          "gate não pôde ser executado"
};
/* Escape NOMEADO: falha fora do conjunto fechado não vira detectado nem
   sobrevivente — é impressa como tal e também reprova. */
const naoClassificada = msg => "falha não classificada: " + msg;

/* ==========================================================================
   OS 24 MUTANTES EXECUTADOS (D010-M1..M27 menos M3/M4 e menos M11).
   `find`/`repl` são texto literal; `reason` é a assinatura da mensagem que o
   gate REALMENTE emite — extraída do `throw new Error(...)` do oráculo, nunca
   inventada: reprovar por motivo diferente do esperado é SOBREVIVENTE, não KILL.
   ========================================================================== */
const NL = String.fromCharCode(10);   /* LF literal, sem escape no fonte */
const ARB_V1 = '    hideLegacyRecommendation(app, haSubstituto);   /* [010 · V1] "há substituto?" no lugar da constante `true` */';
const ANC_EID = '    const id=eq || ("map:"+x.p);';
const FUSAO  = '    if (eq && anexados.indexOf(eq)>=0) return;';

const MUTANTS = [
  { id: "D010-M1", file: V32JS,
    desc: "devolver o argumento de hideLegacyRecommendation ao predicado antigo (constante `true` no ramo não-legado)",
    find: ARB_V1,
    repl: '    hideLegacyRecommendation(app, true);',
    gate: "D010-ARB1", only: "D010-ARB1", reason: /títulos congelados OCULTOS sem substituto/ },

  { id: "D010-M2", file: V32JS,
    desc: "o predicado devolver sempre false (nunca ocultar) — passa em ARB1 e só ARB2 o pega",
    find: ARB_V1,
    repl: '    hideLegacyRecommendation(app, false);',
    gate: "D010-ARB2", only: "D010-ARB2", reason: /título congelado VISÍVEL havendo substituto/ },

  { id: "D010-M5", file: V32JS,
    desc: "arbitrar apenas quando há prioridades declaradas (condicionar o argumento a hasPrio)",
    find: ARB_V1,
    repl: '    hideLegacyRecommendation(app, businessPriority.size ? haSubstituto : true);',
    gate: "D010-ARB4", only: "D010-ARB4", reason: /'Como a Fortinet pode apoiar agora' está OCULTO sem substituto/ },

  { id: "D010-M6", file: V32JS,
    desc: "emitir a afirmação de preservação incondicionalmente em baseCardHTML",
    find: '    : afirmaPreservacao' + NL,
    repl: '    : true' + NL,
    gate: "D010-INV7", only: "D010-INV7", reason: /afirma 'Leitura V3\.1\.3 preservada' com a Camada 1 OCULTA/ },

  { id: "D010-M7", file: V32JS,
    desc: "emitir o aviso de ausência sem a lista nominal das capabilities",
    find: ': ${nomes}. `',
    repl: '. `',
    gate: "D010-ABS1", only: "D010-ABS1", reason: /o aviso não nomeia/ },

  { id: "D010-M8", file: V32JS,
    desc: "a partição de E18 NÃO acontece: TODO `baseIds` volta a ser card, com ou sem payload",
    /* [E18] ANCORA RETRANSCRITA em 2026-08-31. A anterior citava
       `baseAbsenceHTML(baseIds, ctxs, true)` e foi a ZERO ocorrencias quando a
       partição entrou — a campanha teria reprovado por ANCORA PODRE, que e a
       classe que a demanda 013 inteira existiu para caçar. Desta vez o
       `--preflight` a pegou ANTES da campanha (contrato C1). Nao e par novo: a
       intencao — "a partição não acontece, todos os baseIds seguem card" —
       continua a mesma e continua matavel pela alínea (a), agora pela metade
       'sobrando SEM payload' da igualdade de conjunto.
       A replica troca UMA coisa: `baseComPayload` volta a ser `baseIds`. */
    find: '<div class="v32-block" id="v32base">${baseComPayload.map(id=>baseCardHTML(id, ctxs[id], "base")).join("")}${baseAbsenceHTML(baseSemPayload, ctxs, true)}</div>',
    repl: '<div class="v32-block" id="v32base">${baseIds.map(id=>baseCardHTML(id, ctxs[id], "base")).join("")}${baseAbsenceHTML(baseSemPayload, ctxs, true)}</div>',
    gate: "D010-ABS1", only: "D010-ABS1", reason: /#v32base ainda traz `\.v32-card` de capability SEM payload/ },   /* [E18] TRANSCRITA do literal novo: a mensagem perdeu a contagem e ganhou o qualificador */

  { id: "D010-M9", file: TGTJS,
    desc: "ler MAP[qid].lv[nível-ALVO] em vez do nível ATUAL confirmado (INV-5)",
    find: '  const cat=(((MAP[qid]||{lv:[]}).lv[atual]||{}).c)||[];',
    repl: '  const cat=(((MAP[qid]||{lv:[]}).lv[TARGET_PROFILE.overrides[qid]]||{}).c)||[];',
    gate: "D010-CARD1", only: "D010-CARD1", reason: /itens no nó, esperado/ },

  { id: "D010-M10", file: TGTJS,
    desc: "emitir o nó quando a resposta atual é null/\"NA\" (ancorar no nível 0 por omissão)",
    /* A âncora inclui a linha ANTERIOR de propósito: a réplica precisa redefinir
       `atual`, e uma que chamasse função inexistente quebraria o BUILD — isso
       viraria `rebuild falhou` (NÃO EXECUTADO), nunca um veredito sobre o gate. */
    find: '  const atual=ans[k];' + NL +
          '  if (typeof atual !== "number") return "";                     /* null / "NA" ⇒ nada a ancorar */',
    repl: '  const atual=(typeof ans[k]==="number")?ans[k]:0;',
    gate: "D010-CARD1", only: "D010-CARD1", reason: /produziu nó `a-validar`/ },

  /* D010-M11 NAO E EXECUTADO — EQUIVALENTE POR CONSTRUCAO (reconciliacao de
     2026-08-30). Ele atacava `if (temCandidato) return ""`, a clausula de
     precedencia de C8. Provado inalcancavel: S2-de-CONTEXTO exige capability
     UNICA dona do qid + landscapeEnabled, e capability dona de qid tem
     `questionIds` não vazio, logo `assessmentCoverage != "none"` (invariante de
     `validateConfigV32`, 0 erros, com gate vivo em tests_m42_m86.js). A unica
     rota que emite candidato sob UNSET e `UNASSESSED_CAPABILITY`, exclusiva de
     capability `coverage: "none"` — que tem ZERO questionIds. Medido: catalogo
     13 capabilities com questionIds, 0 delas com coverage "none"; 12 sem
     questionIds, 12 com coverage "none". Varredura adversarial de 900 sessoes /
     9000 observacoes (dona de qid x UNSET): 0 contraexemplos, e
     `UNASSESSED_CAPABILITY` sequer aparece nessa classe. `temCandidato` e
     sempre falso onde o codigo chega. Fica na spec como clausula DEFENSIVA,
     sem mutante, no mesmo desfecho de E1/A5 — e a divida e "inalcancavel,
     provado", nunca "falta fixture": fixture que a pague não pode existir.
     CONSEQUENCIA para o gate: ver a divida declarada em mutation-matrix.json —
     D010-CARD2 (a) passa por ESTADO, e quem mede C8 e a alínea (b). */
  { id: "D010-M12", file: TGTJS,
    desc: "publicar o habilitador a validar ignorando o gate canônico de suficiência (INV-3)",
    find: 'function tgtValidateHTML(qid, cmpPub){' + NL + '  if (cmpPub !== true) return "";',
    repl: 'function tgtValidateHTML(qid, cmpPub){' + NL + '  if (false) return "";',
    gate: "D010-CARD3", only: "D010-CARD3", reason: /sob gate FECHADO a tela publicou nó `a-validar`/ },

  { id: "D010-M13", file: TGTJS,
    desc: "remover uma entrada da tabela de equivalência (FortiSIEM), quebrando a totalidade",
    find: '  "FortiSIEM":                "fortisiem",' + NL,
    repl: '',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /chave do MAP sem entrada na tabela/ },

  { id: "D010-M14", file: TGTJS,
    desc: "emitir o item com data-eid = c.p cru quando HÁ equivalência",
    find: '    const id=eq || ("map:"+x.p);',
    repl: '    const id=x.p;',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /esperado o id equivalente/ },

  { id: "D010-M15", file: TGTJS,
    desc: "mover o disclaimer para ANTES da lista de práticas (fora da posição que C11 fixa)",
    find: '      <div class="ux-tgt-ovs"><div class="eyebrow">Práticas-alvo definidas</div><ul>${ovList}</ul></div>' + NL +
          '      <div class="ux-tgt-disc">${esc32(TGT_DISCLAIMER)}</div>',
    repl: '      <div class="ux-tgt-disc">${esc32(TGT_DISCLAIMER)}</div>' + NL +
          '      <div class="ux-tgt-ovs"><div class="eyebrow">Práticas-alvo definidas</div><ul>${ovList}</ul></div>',
    gate: "D010-CARD5", only: "D010-CARD5", reason: /o disclaimer NÃO vem depois da lista de práticas|o disclaimer vem ANTES de um habilitador/ },

  { id: "D010-M16", file: TGTJS,
    desc: "emitir o nó a validar com a classe .ux-tgt-en (R-1: tem de ser IRMÃO, nunca a classe)",
    find: '  return `<div class="ux-mut" data-ux-enablers="a-validar">',
    repl: '  return `<div class="ux-mut ux-tgt-en" data-ux-enablers="a-validar">',
    gate: "D010-CARD6", only: "D010-CARD6", reason: /exibe `\.ux-tgt-en` estando em S2-payload/ },

  { id: "D010-M17", file: TGTJS,
    desc: "emitir o habilitador a validar só na TELA — retorno vazio no ramo de papel",
    find: '${tgtEnablersHTML(qid,semCtx)}${tgtValidateHTML(qid,cmpPub)}</div>`;}).join("");',
    repl: '${tgtEnablersHTML(qid,semCtx)}</div>`;}).join("");',
    gate: "D010-PAPEL1", only: "D010-PAPEL1", reason: /não traz ITEM `a-validar` algum/ },

  { id: "D010-M18", file: TGTJS,
    desc: "NÃO deduplicar — concatenar o MAP sobre o que o engine já anexou ao card",
    find: FUSAO,
    repl: '    if (false) return;',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /\(c1\)/ },

  { id: "D010-M19", file: TGTJS,
    desc: "deduplicar pelo DOMÍNIO da tabela, sem olhar o que está anexado (apaga FortiGuard MDR)",
    find: FUSAO,
    repl: '    if (eq) return;',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /\(c2\)/ },

  { id: "D010-M20", file: V32JS,
    desc: "arbitrar o título e parar — não arrastar os blocos contíguos (apoio-block/t-list/t-details)",
    find: '    if (hiding && allowed) node.classList.toggle("v32-hidden", hide);',
    repl: '    if (hiding && allowed) node.classList.remove("v32-hidden");',
    gate: "D010-ARB3", only: "D010-ARB3", reason: /arbitragem parcial/ },
  /* ── E16 · os cinco de E15 viram MUTANTE DE FONTE ────────────────────────
     A errata E16 dispõe: propriedade derivada de E15 ganha mutante de fonte
     sempre que a mutação for exprimível como mudança de UMA linha numa âncora
     REAL do produto. Julgados um a um em ui_target_v32.js:346 — a MESMA âncora
     de D010-M14 —, com `qid`, `x.p` e `eq` todos em escopo: os CINCO cabem, e
     nenhum precisa de andaime sintético. O par manual correspondente
     (D010-E15-1..5) fica na matriz RISCADO e apontando para cá: prova manual
     vale no dia em que é feita e não é re-executada pela campanha.
     REDUNDÂNCIA DECLARADA, para que 5 KILL não sejam lidos como 5 propriedades
     independentes: os cinco morrem pela MESMA asserção de C10 (b) — a forma
     normativa `map:<chave>`. O que cada um acrescenta é a CLASSE de desvio que
     um autor futuro cometeria, não uma alínea nova. `M23` é o menos redundante:
     é o único cujo prefixo está CERTO e cuja chave mente, e é ele que prova que
     a asserção pina a forma inteira, não só o prefixo. */
  { id: "D010-M21", file: TGTJS,
    desc: "emitir a CHAVE CRUA do MAP como data-eid no ramo sem equivalência (o comportamento pré-E15)",
    find: ANC_EID, repl: '    const id=eq || x.p;',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /sem equivalência V3\.2 a forma é/ },

  { id: "D010-M22", file: TGTJS,
    desc: "trocar o separador do prefixo: `map-<chave>` em vez de `map:<chave>`",
    find: ANC_EID, repl: '    const id=eq || ("map-"+x.p);',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /sem equivalência V3\.2 a forma é/ },

  { id: "D010-M23", file: TGTJS,
    desc: "prefixo CERTO e chave MENTIDA: `map:<qid>` em vez de `map:<chave do MAP>` (troca plausível — os dois estão em escopo)",
    find: ANC_EID, repl: '    const id=eq || ("map:"+qid);',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /sem equivalência V3\.2 a forma é/ },

  { id: "D010-M24", file: TGTJS,
    desc: "trocar a caixa do prefixo: `MAP:<chave>`",
    find: ANC_EID, repl: '    const id=eq || ("MAP:"+x.p);',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /sem equivalência V3\.2 a forma é/ },

  { id: "D010-M25", file: TGTJS,
    desc: "emitir o prefixo SEM chave alguma: `map:`",
    find: ANC_EID, repl: '    const id=eq || "map:";',
    gate: "D010-CARD4", only: "D010-CARD4", reason: /sem equivalência V3\.2 a forma é/ },

  /* ── E17 · o mutante que faltava a C8 ──────────────────────────────
     `D010-M11` atacava a metade de C8 que é verdadeira POR CONSTRUÇÃO (a
     precedência de candidato: `temCandidato` é inalcançável — ver a dívida
     declarada). Retirado ele, `D010-CARD2` ficou SEM MUTANTE, e critério vivo
     sem mutante é critério sem prova de poder (R3 §5). Quem sustenta C8 é a
     alínea (b) — "serviço do engine NÃO bloqueia o `MAP`" —, e este mutante é
     exatamente a negação dela: fazer o serviço ligar `temCandidato`, como o
     candidato faz. Uma linha, na âncora real de `ui_target_v32.js:340`.
     ALCANÇADO, ao contrário de M11: sob `D010-F4` há TRÊS práticas-alvo com
     serviço por `hasGap`, zero candidatos e S2 de contexto
     (`vulnerability-management`, `monitoring-coverage`, `incident-response`).
     Medido por simulação antes de ser autorizado: morre em (b), nomeando a
     prática e a fonte. */
  { id: "D010-M26", file: TGTJS,
    desc: "serviço do engine passa a BLOQUEAR o `MAP`, como se fosse candidato (nega C8 (b))",
    find: '    (c.services||[]).forEach(s=>anexados.push(s.serviceId));});',
    repl: '    (c.services||[]).forEach(s=>{temCandidato=true; anexados.push(s.serviceId);});});',
    gate: "D010-CARD2", only: "D010-CARD2",
    reason: /serviço do engine não pode bloquear o MAP/ },

  /* ── E18 · a direcao OPOSTA a de D010-M8 ──────────────────────────
     Declarado no commit do RED com a causa "a ancora ainda não existe"; a
     implementacao a criou (ui_v32.js:766) e o par entra agora, como previsto.
     A saida deste mutante e EXATAMENTE o produto de antes da correção — o aviso
     engolindo tambem as capabilities COM payload —, e por isso o seu poder
     discriminante ja estava provado antes de existir: e a prova de red desta
     serie (12 PASS · 1 FAIL de 13). Uma linha: o map dos cards sai e o aviso
     volta a receber `baseIds`. */
  { id: "D010-M27", file: V32JS,
    desc: "colapsar TODOS os baseIds no aviso, com ou sem payload (o comportamento pré-E18)",
    find: '<div class="v32-block" id="v32base">${baseComPayload.map(id=>baseCardHTML(id, ctxs[id], "base")).join("")}${baseAbsenceHTML(baseSemPayload, ctxs, true)}</div>',
    repl: '<div class="v32-block" id="v32base">${baseAbsenceHTML(baseIds, ctxs, true)}</div>',
    gate: "D010-ABS1", only: "D010-ABS1",
    reason: /perdeu o `\.v32-card` de capability COM payload/ }   /* SEM crases: transcrito do literal do oráculo (tests_010_vao.js:1000), não da memória da sonda */
];

const MUTABLE = Array.from(new Set(MUTANTS.map(m => m.file)));
const BASE_SHA = {};
MUTABLE.forEach(f => { BASE_SHA[f] = sha(f); });

/* ── execução de processo ─────────────────────────────────────────────────── */
/* `spawnFalhou` separa "o processo do gate não chegou a existir" (NÃO EXECUTADO)
   de "o gate rodou e saiu ≠ 0" (que é veredito). Sem essa separação, ambiente
   quebrado é lido como sobrevivência — o defeito que a 013 catalogou. */
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
/* O filtro do oráculo viaja pelo AMBIENTE (`D010_ONLY`), nunca por prefixo POSIX
   no `cmd` — prefixo de variável não funciona no cmd.exe (R10 §7). */
const filtro = m => (m.only ? { D010_ONLY: m.only } : {});
const CMD = "node tests_010_vao.js";

/* Linha PASS/FAIL do gate esperado. Ausência = o gate NÃO foi executado (id
   errado no filtro seleciona ZERO gates e a suíte sai 0): NÃO EXECUTADO, jamais
   SOBREVIVENTE — sobrevivência exige gate executado. */
function gateLine(out, gateId) {
  const re = new RegExp("^(PASS|FAIL)\\s+" + gateId.replace(/[-]/g, "\\-") + "\\s+—.*$", "m");
  const m = out.match(re);
  return m ? m[0] : null;
}

function selecionar() {
  const only = (process.env.D010_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}
/* CONTAGEM, não presença: 0 é âncora podre, >=2 é âncora ambígua. */
function ocorrencias(m) { return fs.readFileSync(m.file, "utf8").split(m.find).length - 1; }

/* ── modo preflight (argv, D4) · emite o contrato C1 ───────────────────────── */
/* Não muta, não reconstrói, não executa gate, não escreve arquivo nenhum.
   stdout carrega SÓ o objeto JSON; todo texto humano vai para stderr. */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d010",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    /* O que o harness realmente muta — oráculo de IC-6. Sai de MUTANTS inteiro,
       não da seleção: o filtro reduz a MEDIÇÃO, nunca o ALVO. */
    arquivos_mutados: Array.from(new Set(MUTANTS.map(m => path.basename(m.file)))).sort(),
    mutantes: []
  };
  for (const m of sel) {
    const n = ocorrencias(m);
    const e = { id: m.id, arquivo: path.basename(m.file), ocorrencias: n,
                estado: n === 1 ? "ok" : "nao_executavel" };
    if (n === 0) e.causa = CAUSA.ausente;
    else if (n > 1) e.causa = CAUSA.ambigua;
    /* [014/E3] Extensão ADITIVA do contrato C1 (demanda 014-gate-sem-poder-discriminante,
       errata E3): mutante cujo arquivo é `.css` carrega também a ÂNCORA
       (`find`/`repl`). Sem ela a varredura de regra morta sabe QUAIS mutantes
       existem mas não QUAL declaração cada um altera — e "zero regras mortas"
       vira vácuo, não veredito (medido antes desta extensão: 49 de 49 avaliados
       sem âncora). Só para `.css`, por decisão registrada: campo de contrato sem
       consumidor apodrece, e os outros 169 mutantes não têm quem leia a deles.
       ADITIVA de verdade: `check_mutation.py` valida apenas as chaves
       obrigatórias de C1 (IC-4, :320-323), então nenhum consumidor existente
       quebra. O preflight segue sendo contrato — não muta, não reconstrói, não
       roda gate, não escreve: só acrescenta duas chaves ao objeto de stdout.
       NESTE HARNESS a linha não dispara hoje: `d010` tem ZERO mutante de CSS.
       Ela existe porque o consumidor quantifica sobre TODO harness com
       `"preflight": true`, e não sobre uma lista digitada — o dia em que um
       mutante de CSS nascer aqui, ele já nasce com a âncora. Deixar de fora
       seria o buraco desta demanda em miniatura: o gatilho vigiando a lista,
       e não o que decide o resultado. Desvio declarado: a spec nomeia CINCO
       harnesses (os que têm mutante de CSS hoje); a extensão vai aos SEIS que
       declaram `preflight`, o que ENDURECE o contrato e custa uma campanha
       local a mais (`d010`, 24 mutantes, node/python). */
    if (/\.css$/i.test(e.arquivo)) { e.find = m.find; e.repl = m.repl; }
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d010 · " + dados.mutantes.length + " mutante(s) · interpretador " +
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
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_010_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U +
        " não executados (de " + SELECTED.length + ")" +
        (ONLY.length ? " · inventário completo: " + MUTANTS.length : ""));
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nD010 MUTATION [tests_010_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados" +
        (ONLY.length ? "" : " · 3 em dívida declarada: D010-M3/M4 (sem caso nas fixtures) e D010-M11 (equivalente por construção)"));
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
  console.log("D010 MUTATION · " + SELECTED.length + " mutante(s) · interpretador " + PY +
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
