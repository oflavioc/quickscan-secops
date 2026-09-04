/* ============================================================================
   CAMPANHA DE MUTAÇÃO · DEMANDA 016 — registro contra execução (P16.a / P16.b)
   harness `d016` · T060 (wave 5) · dono: qa-engineer
   ============================================================================
   Instrumento de MEDIÇÃO. Não tem red próprio: o aceite é 33/33 DETECTADO com
   os 3 controles verdes. (30 mutantes na wave 5; M31–M33 entraram na Fase 6,
   iteração de correção do spec-validate — G3, J1, J3, J4.)

   Prova o PODER DISCRIMINANTE dos gates D016-FEC1..FEC4, D016-PR1 (check_fecho.py)
   e D016-PROT1 (check_branch_protection.py) e da alínea comum C7. Três famílias:

     · MUTANTES DE INSTRUMENTO — fecho.py (M1..M11, M31) e branch_protection.py
       (M12..M15, M17): uma linha do julgador PURO muda; quem mata é a SONDA
       pinada (`--sonda`), e o oráculo é o JSON dela: os IDS DE CASO que a spec
       nomeia têm de divergir, no CAMPO que ela nomeia (F19 → EM VOO para M1;
       http_403 → PROTEGIDA para M12…). Nunca regex sobre prosa (R10 §6).
     · MUTANTES DO PRÓPRIO GATE — M16 (check_fecho.py) e M29
       (check_branch_protection.py): o laço da sonda é esvaziado; C7 exige
       `executados 0 ≠ total pinado`, e o JSON tem de dizer total 0.
     · MUTANTES DE ÁRVORE — M18..M28, M32 e M22/M30: cada um PRODUZ O ESTADO DO
       MUNDO que faz o gate NU reprovar (fecho.json, planning-state, fixture) e
       mede, pelo JSON de `--json`, o sujeito acusado (id, veredito, código,
       oráculo, #PR), o TOTAL de problemas e o ISOLAMENTO — nenhum outro sujeito
       com falha. "E nenhuma outra" é asserção, não sorte. São a prova de carga
       da spec (E2, C3 d, C2 a) rodando de novo a cada campanha.
     · MUTANTE DE LEITOR — M33 (Fase 6): fecho.py:ler_merges emudece (devolve []
       com metadados sãos). A sonda NÃO vê leitor (o julgador é puro); quem mata
       é a GUARDA DE CENSO do gate nu — `fecho.json → piso.merges_ate_piso` (39,
       imutável) comparado à leitura — e o kill exige 0 problema(s) de
       julgamento: a prova de que, sem a guarda, a árvore ficava verde por vácuo
       (spec-validate J1: medido exit 0 com o leitor mudo, D016-M19 sobrevivente).

   POR QUE HÁ CONTROLES (não mutantes, fora da contagem do preflight):
     · C0-fecho / C0-protecao — o baseline tem de estar VERDE antes de mutar:
       kill medido contra baseline vermelho não é atribuível ao mutante.
     · M24/positivo — a válvula VÁLIDA sobre o cenário de M18 (015 em validate,
       piso recuado) tem de ser ACEITA: FECHO PENDENTE DECLARADO, exit 0, com
       prazo == data do commit (a borda exata de T4). É o controle de que FEC4
       alcança o verde — sem ele, um gate constante-vermelho para válvulas
       passaria por gate correto (spec 014, D014-DISC1).

   POR QUE MULTI-ARQUIVO E REMOÇÃO ENTRAM NO CONTRATO C1: M18/M24 mutam DOIS
   arquivos (fecho.json + planning-state 015) — o preflight emite `ocorrencias`
   = 1 sse TODA âncora do mutante tem exatamente 1 ocorrência (0 se alguma
   falta; o máximo se alguma é ambígua) e lista cada edição em `edicoes`. M22 e
   M30 REMOVEM uma fixture: a âncora é a existência do arquivo (1 sse existe).
   M32 CRIA um planning-state sintético (`criar`): a âncora é a AUSÊNCIA do
   arquivo (1 sse não existe; existindo, ocorrencias=0 — a âncora "ausência" não
   foi encontrada); restauração = unlink, conferida no fecho. M18/M19/M24 e o
   controle positivo movem o piso E o censo pinado (piso.merges_ate_piso) na
   mesma mutação — mover só o piso faria a guarda de censo reprovar, e o kill
   deixaria de ser atribuível à alínea que o mutante ataca.

   M21 — AMARRADO AO CICLO DE VIDA DA 016 (decisão registrada): hoje a 016 está
   em voo e o estado é EM VOO + fecho_pendente-prematura (C4 d). Quando a 016
   passar a `done` ainda sem merge (T084), o mesmo estado sai EM VOO +
   fecho_pendente-obsoleta (decisão 3 do instrumento: done pré-empta a posição);
   depois do merge, CONFORME + obsoleta (C4 c). O julgador aceita SÓ essas três
   combinações, acopladas à fase e à posição — uma válvula na 016 nunca é
   legítima, logo o mutante morre em qualquer ponto do ciclo sem reancoragem.
   Se um dia sobreviver, é porque a árvore passou a ADMITIR a válvula (016
   mesclada com fase aberta): exatamente o sinal. M28 (válvula na 015, done e
   mesclada) é o carrasco PERMANENTE de C4(c) na árvore.
   PERDA NOMEADA (spec-validate J4): a partir do `done` M21 passa a medir C4(c),
   a alínea de M28, e C4(d) ficaria sem carrasco de árvore para sempre (só F10
   na sonda). M32 (planning-state SINTÉTICO 999, `implement`, nunca mesclada,
   válvula válida) é o carrasco PERMANENTE de C4(d): o cenário definido pela
   alínea, em sujeito estável. E o "se um dia sobreviver" acima não se realiza
   como SOBREVIVENTE: o mundo que o produziria (016 mesclada com fase aberta)
   derruba antes o controle C0-fecho, e M21 sai NÃO EXECUTADO · baseline
   vermelho — o sinal existe, com esse nome (medido em clone, spec-validate J4).

   M20 — "exclusões retiradas" é implementado RENOMEANDO a chave
   `excluidas_por_r13` (o instrumento lê `registro.get("excluidas_por_r13")`,
   que passa a ser vazio): âncora de UMA linha, imune a edição das `fonte`s.
   Efeito idêntico ao de apagar as três entradas.

   RESTAURAÇÃO: bytes originais reescritos sob try/finally + SHA-256 conferido
   por arquivo + `git status --porcelain` ESCOPADO aos arquivos mutados (R7 §3).
   Interpretador: MUTATION_PY ou o padrão da plataforma, RESOLVIDO no preflight
   (C1/C4 da 013); invocado por lista de argumentos, sem shell (R10 §7).

   VOCABULÁRIO FECHADO DE TRÊS ESTADOS — DETECTADO · SOBREVIVENTE · NÃO
   EXECUTADO (este sempre com UMA causa do conjunto fechado de T4 da 013).
   Réplica de instrumento que NÃO IMPORTA sob a mutação é NÃO EXECUTADO ·
   rebuild falhou — matar por crash não é detecção.

   `--preflight` (argv) — D4 da 013, no MESMO commit da entrada `d016` em
   mutation_map.json. Não muta, não executa gate, não escreve nada; stdout é só
   o JSON, texto humano vai a stderr. Exit 0 sse interpretador resolvido e toda
   âncora com ocorrencias == 1.

   Filtro de depuração: D016_MUT_ONLY=D016-M18,D016-M19 node tests_016_mutants.js
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const HERE = __dirname;
const PY_ORIGEM = process.env.MUTATION_PY ? "MUTATION_PY" : "padrão";
const PY = process.env.MUTATION_PY || (process.platform === "win32" ? "python" : "python3");

const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");

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

const V = path.join(HERE, ".claude", "verify");
const PS = path.join(HERE, ".claude", "project-memory", "planning-state");
const F = {
  fecho:      path.join(V, "fecho.py"),
  bp:         path.join(V, "branch_protection.py"),
  gateFecho:  path.join(V, "check_fecho.py"),
  gateBp:     path.join(V, "check_branch_protection.py"),
  reg:        path.join(V, "fecho.json"),
  fxF5:       path.join(V, "fixtures_016", "fecho", "F5.json"),
  fxSemFecho: path.join(V, "fixtures_016", "protecao", "sem_fecho.json"),
  ps015:      path.join(PS, "015-superficies-de-apoio.json"),
  ps016:      path.join(PS, "016-registro-contra-execucao.json"),
  ps999:      path.join(PS, "999-sintetica-d016.json")      // NÃO existe no repositório: M32 o cria e o remove
};
const GATE_FECHO_REL = path.join(".claude", "verify", "check_fecho.py");
const GATE_BP_REL = path.join(".claude", "verify", "check_branch_protection.py");

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

/* ── modos de medição ─────────────────────────────────────────────────────── */
const SONDA_FECHO = "sonda-fecho", SONDA_BP = "sonda-protecao", ARVORE = "arvore";

/* ── âncoras de árvore reutilizadas ───────────────────────────────────────── */
const PISO_VIGENTE_LINHA = '"sha": "921977c25e76fe0ed19dae74e17921d37c711ff0",';
const CENSO_VIGENTE_LINHA = '"merges_ate_piso": 39,';           // censo IMUTÁVEL até o piso vigente (fecho.json → _meta.censo_de_leitura)
const PISO_6DAD = "6dad53d3423b20c768690d0b0005ef88025b9f35";   // merge da Onda 4 (PR #15) — E2
const CENSO_6DAD = 15;   // merges first-parent até 6dad53d, inclusive — git rev-list --count --merges --first-parent = ler_merges (2026-09-04)
const PISO_ZERO = "e5ccd429d0ed271ab3dd9ea948181e697f891af3";   // raiz do repositório, commit NÃO-merge
const CENSO_ZERO = 0;    // a raiz não é merge: 0 até o piso, os 39 ficam posteriores
/* Mover o piso é mover o censo pinado junto (duas edições no fecho.json): o gate
   assere piso.merges_ate_piso contra a leitura (guarda de censo). Piso movido com
   censo velho reprovaria pela guarda, e o kill deixaria de ser atribuível à
   alínea que o mutante ataca. */
const pisoPara = (s, censo) => [
  { file: F.reg, find: PISO_VIGENTE_LINHA, repl: '"sha": "' + s + '",' },
  { file: F.reg, find: CENSO_VIGENTE_LINHA, repl: '"merges_ate_piso": ' + censo + ',' }
];
const FASE_015 = '  "phase": "done",';
const BRANCH_015 = '  "branch": "feature/015-superficies-de-apoio",';
const BRANCH_016 = '  "branch": "feature/016-registro-contra-execucao",';
const EXCL_LINHA = '  "excluidas_por_r13": {';
const FONTE_009 = '"fonte": "fecho retroativo 2026-09-04 (PR #37, chore/fecho-009-013) com conformance só no JSON; P4 do portão da Fase 0 da 016 — escrita retroativa opcional, fora da demanda; se acontecer, esta entrada sai no mesmo commit (C3 b)"';
/* válvula inserida logo abaixo da linha `branch` do planning-state; `prazo` é
   função do contexto (data do commit julgado, T4) — resolvida ao aplicar. */
const valvulaApos = (linha, id, prazoFn) => ({
  file: null, find: linha,
  repl: ctx => linha + '\n  "fecho_pendente": {"motivo": "MUTANTE ' + id +
    ' — válvula escrita pela campanha d016", "dono": "qa-engineer", "prazo": "' + prazoFn(ctx) +
    '", "declarado_em": "' + ctx.dataCommit + '"},'
});
const em = (file, e) => Object.assign({}, e, { file });

/* ==========================================================================
   OS 33 MUTANTES · D016-M1..D016-M33 (+ 3 controles)
   `edicoes`: [{file, find, repl}] aplicadas em ordem; `repl` pode ser função
   do contexto {dataCommit}. `remover`: arquivo apagado (restaurado por bytes).
   `criar`: {file, conteudo} escrito e depois removido (a âncora é a ausência).
   `espera`: oráculo ESTRUTURADO sobre o JSON do gate.
   ========================================================================== */
const MUTANTS = [

  /* ── C1 · D016-FEC1 — instrumento (fecho.py) ────────────────────────────── */
  { id: "D016-M1", gate: "D016-FEC1", modo: SONDA_FECHO,
    desc: "consultar SÓ a ancestralidade — o oráculo de mensagem cala (T1 invertido)",
    edicoes: [{ file: F.fecho,
      find: '    for m in merges:\n        nome, numero = pop.do_merge(m.get("msg"))\n        if nome and nome == branch:',
      repl: '    for m in []:   # MUTANTE D016-M1: a mensagem não é consultada — só a ancestralidade responde\n        nome, numero = pop.do_merge(m.get("msg"))\n        if nome and nome == branch:' }],
    espera: { divergem: [{ id: "F19", campos: { veredito: "EM VOO" } },
                         { id: "F1", campos: { oraculo: "ancestralidade" } }] } },

  { id: "D016-M2", gate: "D016-FEC1", modo: SONDA_FECHO,
    desc: "piso invertido — só o que é anterior ao piso é julgado",
    edicoes: [{ file: F.fecho,
      find: 'in ("anterior", "piso"), "mensagem", f"#{numero}"',
      repl: 'in ("posterior",), "mensagem", f"#{numero}"' }],
    espera: { divergem: [{ id: "F1", campos: { veredito: "ANTERIOR AO PISO" } },
                         { id: "F4", campos: { veredito: "MESCLADA SEM FECHO" } }] } },

  /* ── C2 · D016-FEC2 — instrumento ───────────────────────────────────────── */
  { id: "D016-M3", gate: "D016-FEC2", modo: SONDA_FECHO,
    desc: "feature/NNN sem planning-state tratada como FORA DA POPULAÇÃO",
    edicoes: [{ file: F.fecho,
      find: '            if pop.e_de_demanda(branch):',
      repl: '            if False and pop.e_de_demanda(branch):   # MUTANTE D016-M3' }],
    espera: { divergem: [{ id: "F11", campos: { veredito: "FORA DA POPULAÇÃO", codigo: null } }] } },

  { id: "D016-M4", gate: "D016-FEC2", modo: SONDA_FECHO,
    desc: "merge em develop fora de PR após o piso é engolido (sem código, sem problema)",
    edicoes: [{ file: F.fecho, find: 'codigo=C_MERGE_FORA_DE_PR,', repl: 'codigo=None,' }],
    espera: { divergem: [{ id: "F13", campos: { codigo: null, problemas: 0 } }] } },

  /* ── C3 · D016-FEC3 — instrumento ───────────────────────────────────────── */
  { id: "D016-M5", gate: "D016-FEC3", modo: SONDA_FECHO,
    desc: "só relatorio-final.md é exigido — spec-validate.md deixa de contar (pós e pré-merge)",
    edicoes: [{ file: F.fecho,
      find: 'ARTEFATOS_EXIGIDOS = ("relatorio-final.md", "spec-validate.md")',
      repl: 'ARTEFATOS_EXIGIDOS = ("relatorio-final.md",)   # MUTANTE D016-M5' }],
    espera: { divergem: [{ id: "F15", campos: { veredito: "CONFORME", codigo: null } },
                         { id: "P8", campos: { veredito: "LIBERADO" } }] } },

  { id: "D016-M6", gate: "D016-FEC3", modo: SONDA_FECHO,
    desc: "exclusão obsoleta (artefato nomeado existe) não reprova",
    edicoes: [{ file: F.fecho,
      find: '        if obsoletos:',
      repl: '        if False and obsoletos:   # MUTANTE D016-M6' }],
    espera: { divergem: [{ id: "F17", campos: { codigo: null, problemas: 0 } }] } },

  /* ── C4 · D016-FEC4 — instrumento ───────────────────────────────────────── */
  { id: "D016-M7", gate: "D016-FEC4", modo: SONDA_FECHO,
    desc: "válvula sem dono/prazo é aceita — campo ausente não invalida",
    edicoes: [{ file: F.fecho,
      find: '    faltam = [c for c in CAMPOS_VALVULA if not _txt(valvula.get(c))]',
      repl: '    faltam = []   # MUTANTE D016-M7: campo ausente não invalida' }],
    espera: { divergem: [{ id: "F8", campos: { veredito: "FECHO PENDENTE DECLARADO", codigo: null } }] } },

  { id: "D016-M8", gate: "D016-FEC4", modo: SONDA_FECHO,
    desc: "prazo não é comparado com a data do commit — válvula vencida passa (T4)",
    edicoes: [{ file: F.fecho,
      find: '    if _dia_valido(dia) and prazo < dia:',
      repl: '    if False and _dia_valido(dia) and prazo < dia:   # MUTANTE D016-M8' }],
    espera: { divergem: [{ id: "F7", campos: { veredito: "FECHO PENDENTE DECLARADO", codigo: null } }] } },

  /* Fase 6 (spec-validate G3): C4(e) tinha instrumento e não tinha carrasco —
     com a cláusula removida a sonda de 33 seguia 33 · 0 (medido em clone de
     d130a04, fecho.py idêntico ao de 76fd9dc). F24 (prazo '30/09/2026') é o
     caso; este é o mutante que ela mata. */
  { id: "D016-M31", gate: "D016-FEC4", modo: SONDA_FECHO,
    desc: "prazo fora de AAAA-MM-DD é aceito — a cláusula de formato de _valvula é desligada (C4 e)",
    edicoes: [{ file: F.fecho,
      find: '    if not _dia_valido(prazo):',
      repl: '    if False and not _dia_valido(prazo):   # MUTANTE D016-M31: o formato do prazo não é conferido' }],
    espera: { divergem: [{ id: "F24", campos: { veredito: "FECHO PENDENTE DECLARADO", codigo: null, problemas: 0 } }] } },

  /* ── C5 · D016-PR1 — instrumento ────────────────────────────────────────── */
  { id: "D016-M9", gate: "D016-PR1", modo: SONDA_FECHO,
    desc: "validate aceito como fecho pré-merge — a fase deixa de bloquear",
    edicoes: [{ file: F.fecho,
      find: '    if fase != "done":',
      repl: '    if fase not in ("done", "validate"):   # MUTANTE D016-M9' }],
    /* P11 (validate COM os dois artefatos) LIBERA — a letra da spec ("o caso 'PR
       em validate' libera"). P2 (validate SEM artefatos) escorrega da cláusula de
       fase para a de artefatos: o código muda de fase-nao-done para
       artefato-ausente. Até a Fase 6 só P2 existia e M9 morria pelo código, não
       por "libera" (spec-validate J3); P2 fica como segunda divergência. */
    espera: { divergem: [{ id: "P11", campos: { veredito: "LIBERADO", codigo: null } },
                         { id: "P2", campos: { veredito: "FECHO PENDENTE", codigo: "artefato-ausente" } }] } },

  { id: "D016-M10", gate: "D016-PR1", modo: SONDA_FECHO,
    desc: "válvula honrada pré-merge — o check deixa de recusá-la (T5)",
    edicoes: [{ file: F.fecho,
      find: '    if estado.get("fecho_pendente") is not None:',
      repl: '    if False and estado.get("fecho_pendente") is not None:   # MUTANTE D016-M10' }],
    espera: { divergem: [{ id: "P7", campos: { veredito: "LIBERADO" } },
                         { id: "P10", campos: { codigo: "fase-nao-done" } }] } },

  { id: "D016-M11", gate: "D016-PR1", modo: SONDA_FECHO,
    desc: "planning-state ausente libera o merge",
    edicoes: [{ file: F.fecho,
      find: '        return r(FECHO_PENDENTE, C_FORA_DA_MAQUINA,',
      repl: '        return r(LIBERADO, None,   # MUTANTE D016-M11: estado ausente libera' }],
    espera: { divergem: [{ id: "P3", campos: { veredito: "LIBERADO" } }] } },

  /* ── C6 · D016-PROT1 — instrumento (branch_protection.py) ───────────────── */
  { id: "D016-M12", gate: "D016-PROT1", modo: SONDA_BP,
    desc: "NÃO DETERMINÁVEL relatado como PROTEGIDA",
    edicoes: [{ file: F.bp,
      find: '        "veredito": "NÃO DETERMINÁVEL",',
      repl: '        "veredito": "PROTEGIDA",   # MUTANTE D016-M12' }],
    espera: { divergem: [{ id: "http_403", campos: { veredito: "PROTEGIDA" } },
                         { id: "sem_rede", campos: { veredito: "PROTEGIDA" } }] } },

  { id: "D016-M13", gate: "D016-PROT1", modo: SONDA_BP,
    desc: "strict ignorado — up-to-date desligado deixa de faltar",
    edicoes: [{ file: F.bp,
      find: '    strict_provado_false = rules_ok and tem_regra and strict is False',
      repl: '    strict_provado_false = False   # MUTANTE D016-M13: strict ignorado' }],
    espera: { divergem: [{ id: "strict_false", campos: { veredito: "PROTEGIDA", severidade_local: "WARN" } }] } },

  { id: "D016-M14", gate: "D016-PROT1", modo: SONDA_BP,
    desc: "um contexto basta — cobertura parcial zera o que falta",
    edicoes: [{ file: F.bp,
      find: '    faltam_ctx.sort()',
      repl: '    faltam_ctx = [] if len(faltam_ctx) < len(necessarios) else sorted(faltam_ctx)   # MUTANTE D016-M14: um contexto basta' }],
    espera: { divergem: [{ id: "sem_visual", campos: { veredito: "PROTEGIDA" } },
                         { id: "sem_fecho", campos: { veredito: "PROTEGIDA" } }] } },

  { id: "D016-M15", gate: "D016-PROT1", modo: SONDA_BP,
    desc: "protected: true basta — a armadilha do enabled=false/enforcement off",
    edicoes: [{ file: F.bp,
      find: '    desconhecido = False',
      repl: '    desconhecido = False\n    if branch_ok and (branch.get("body") or {}).get("protected"):   # MUTANTE D016-M15: protected true basta\n        necessarios = set()' }],
    espera: { divergem: [{ id: "hoje", campos: { veredito: "PROTEGIDA" } },
                         { id: "classic_off", campos: { veredito: "PROTEGIDA" } }] } },

  /* ── C7 · a sonda não pode ficar muda — o PRÓPRIO gate ──────────────────── */
  { id: "D016-M16", gate: "D016-FEC1 D016-FEC2 D016-FEC3 D016-FEC4 D016-PR1 (C7)", modo: SONDA_FECHO,
    desc: "laço da sonda esvaziado em check_fecho.py — 0 casos executados contra o total pinado",
    edicoes: [{ file: F.gateFecho,
      find: 'resultados = [executa_caso(instr, causa_instr, c, pasta) for c in casos]',
      repl: 'resultados = [executa_caso(instr, causa_instr, c, pasta) for c in []]   # MUTANTE D016-M16' }],
    espera: { vazia: true } },

  /* ── E1 · dois dos três contextos bastam ────────────────────────────────── */
  { id: "D016-M17", gate: "D016-PROT1", modo: SONDA_BP,
    desc: "dois dos três contextos bastam — `fecho` sai da exigência (errata E1)",
    edicoes: [{ file: F.bp,
      find: '    necessarios = set(esperado.get("checks_obrigatorios") or [])',
      repl: '    necessarios = set(esperado.get("checks_obrigatorios") or []) - {"fecho"}   # MUTANTE D016-M17: dois dos três contextos bastam (E1)' }],
    espera: { divergem: [{ id: "sem_fecho", campos: { veredito: "PROTEGIDA", faltam: [] } },
                         { id: "hoje", campos: { faltam: ["up-to-date", "verify", "visual"] } }] } },

  /* ── ÁRVORE · o estado do mundo, medido pelo gate nu ────────────────────── */
  { id: "D016-M18", gate: "D016-FEC1", modo: ARVORE,
    desc: "árvore: piso recuado para 6dad53d E 015 em validate — a prova de carga de C1(a) (E2)",
    edicoes: pisoPara(PISO_6DAD, CENSO_6DAD).concat([{ file: F.ps015, find: FASE_015, repl: '  "phase": "validate",' }]),
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "015-superficies-de-apoio", veredito: "MESCLADA SEM FECHO", codigo: null,
                           oraculo: "mensagem", oraculo_detalhe: "#34", fase: "validate" }] } },

  { id: "D016-M19", gate: "D016-FEC2", modo: ARVORE,
    desc: "árvore: piso zero (raiz e5ccd429) — a prova de carga do piso: 6 merges / 5 branches de Onda sem planning-state",
    edicoes: pisoPara(PISO_ZERO, CENSO_ZERO),
    espera: { problemas: 6, globais: [],
              sujeitos: [
                { tipo: "merge", oraculo_detalhe: "#15", veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/005-"] },
                { tipo: "merge", oraculo_detalhe: "#14", veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/004-"] },
                { tipo: "merge", oraculo_detalhe: "#12", veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/002-"] },
                { tipo: "merge", oraculo_detalhe: "#11", veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/001-"] },
                { tipo: "merge", oraculo_detalhe: "#10", veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/001-"] },
                { tipo: "merge", oraculo_detalhe: "#9",  veredito: "MESCLADA SEM FECHO", codigo: "demanda-fora-da-maquina", detalhe_contem: ["feature/000-"] }] } },

  { id: "D016-M20", gate: "D016-FEC3", modo: ARVORE,
    desc: "árvore: as três exclusões R13 retiradas — a prova de carga das exclusões: 003 (2 artefatos), 009 (1), 010 (1)",
    edicoes: [{ file: F.reg, find: EXCL_LINHA, repl: '  "excluidas_por_r13_retiradas_D016_M20": {' }],
    espera: { problemas: 3, globais: [],
              sujeitos: [
                { id: "003-marcador-duplicado",   veredito: "MESCLADA SEM FECHO", codigo: "artefato-ausente", oraculo: "mensagem", oraculo_detalhe: "#13", detalhe_contem: ["done sem relatorio-final.md, spec-validate.md"] },
                { id: "009-leitura-do-relatorio", veredito: "MESCLADA SEM FECHO", codigo: "artefato-ausente", oraculo: "mensagem", oraculo_detalhe: "#24", detalhe_contem: ["done sem spec-validate.md"] },
                { id: "010-recomendacao-sem-vao", veredito: "MESCLADA SEM FECHO", codigo: "artefato-ausente", oraculo: "mensagem", oraculo_detalhe: "#31", detalhe_contem: ["done sem spec-validate.md"] }] } },

  { id: "D016-M21", gate: "D016-FEC4", modo: ARVORE,
    desc: "árvore: válvula VÁLIDA escrita na 016 (em voo) — válvula antes do vencimento (T5, C4 d); ver ciclo de vida no cabeçalho",
    edicoes: [em(F.ps016, valvulaApos(BRANCH_016, "D016-M21", ctx => ctx.dataCommit))],
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "016-registro-contra-execucao",
                           regra: s => (s.fase !== "done"
                             ? (s.veredito === "EM VOO" && s.codigo === "fecho_pendente-prematura")
                             : ((s.veredito === "EM VOO" || s.veredito === "CONFORME") && s.codigo === "fecho_pendente-obsoleta")),
                           regra_texto: "fase≠done ⇒ EM VOO + fecho_pendente-prematura · fase done ⇒ (EM VOO | CONFORME) + fecho_pendente-obsoleta" }] } },

  { id: "D016-M22", gate: "D016-FEC1 D016-FEC2 D016-FEC3 D016-FEC4 D016-PR1 (C7)", modo: ARVORE,
    desc: "árvore: fixture F5.json removida — a guarda de contagem nomeia o caso e a árvore não é julgada",
    remover: F.fxF5,
    espera: { sondaQuebrada: { caso: "F5" } } },

  { id: "D016-M23", gate: "D016-FEC1", modo: ARVORE,
    desc: "árvore: chave `branch` removida de um planning-state done (015) — FAIL de forma, C1(f)",
    edicoes: [{ file: F.ps015, find: BRANCH_015 + "\n", repl: "" }],
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "015-superficies-de-apoio", veredito: "NÃO DETERMINÁVEL", codigo: "registro-sem-branch", oraculo: null }] } },

  { id: "D016-M24", gate: "D016-FEC4", modo: ARVORE,
    desc: "árvore: sobre o cenário de M18, válvula em 015 com prazo 2026-01-01 — vencida contra a data do commit (T4)",
    edicoes: pisoPara(PISO_6DAD, CENSO_6DAD).concat([{ file: F.ps015, find: FASE_015, repl: '  "phase": "validate",' },
              em(F.ps015, valvulaApos(BRANCH_015, "D016-M24", () => "2026-01-01"))]),
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "015-superficies-de-apoio", veredito: "MESCLADA SEM FECHO", codigo: "fecho_pendente-vencida",
                           oraculo: "mensagem", oraculo_detalhe: "#34", fase: "validate" }] } },

  { id: "D016-M25", gate: "D016-FEC2", modo: ARVORE,
    desc: "árvore: piso malformado no fecho.json real (SHA curto) — global piso-invalido, toda demanda NÃO DETERMINÁVEL (C2 d)",
    edicoes: [{ file: F.reg, find: PISO_VIGENTE_LINHA, repl: '"sha": "921977c",' }],
    espera: { problemas: 1, globais: ["piso-invalido"],
              todasDemandas: { veredito: "NÃO DETERMINÁVEL", codigo: "piso-invalido" }, semMerges: true } },

  { id: "D016-M26", gate: "D016-FEC3", modo: ARVORE,
    desc: "árvore: exclusão R13 para 011, cujo artefato existe em disco — exclusão obsoleta (C3 b)",
    edicoes: [{ file: F.reg, find: EXCL_LINHA,
      repl: EXCL_LINHA + '\n    "011-numeracao-das-prioridades": {"artefatos_ausentes": ["spec-validate.md"], "fonte": "MUTANTE D016-M26 — o artefato existe em disco; exclusão obsoleta"},' }],
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "011-numeracao-das-prioridades", veredito: "CONFORME", codigo: "exclusao-obsoleta", oraculo: "mensagem", oraculo_detalhe: "#32" }] } },

  { id: "D016-M27", gate: "D016-FEC3", modo: ARVORE,
    desc: "árvore: `fonte` vazia na exclusão da 009 — a exclusão NÃO exclui (global exclusao-malformada) e a 009 cai em artefato-ausente (C3 c)",
    edicoes: [{ file: F.reg, find: FONTE_009, repl: '"fonte": ""' }],
    espera: { problemas: 2, globais: ["exclusao-malformada"],
              sujeitos: [{ id: "009-leitura-do-relatorio", veredito: "MESCLADA SEM FECHO", codigo: "artefato-ausente", oraculo: "mensagem", oraculo_detalhe: "#24" }] } },

  { id: "D016-M28", gate: "D016-FEC4", modo: ARVORE,
    desc: "árvore: válvula na 015 (done, mesclada) com o piso vigente — válvula obsoleta (C4 c), carrasco permanente",
    edicoes: [em(F.ps015, valvulaApos(BRANCH_015, "D016-M28", ctx => ctx.dataCommit))],
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "015-superficies-de-apoio", veredito: "CONFORME", codigo: "fecho_pendente-obsoleta", oraculo: "mensagem", oraculo_detalhe: "#34", fase: "done" }] } },

  /* Fase 6 (spec-validate J4): carrasco PERMANENTE de C4(d) — M21 perde a alínea
     no `done` da 016. Sujeito estável: uma demanda que nunca é mesclada, CRIADA
     pela campanha e removida por ela (âncora = ausência do arquivo). */
  { id: "D016-M32", gate: "D016-FEC4", modo: ARVORE,
    desc: "árvore: planning-state SINTÉTICO 999 criado (implement, nunca mesclada) com válvula VÁLIDA — carrasco permanente de C4(d), independente do ciclo de vida da 016",
    criar: { file: F.ps999, conteudo: ctx => JSON.stringify({
      demanda: "999-sintetica-d016", phase: "implement", spec_dir: "specs/999-sintetica-d016",
      branch: "feature/999-sintetica-d016",
      brief: "MUTANTE D016-M32 — planning-state SINTÉTICO escrito pela campanha d016 (tests_016_mutants.js) e removido por ela ao fim do mutante. Se este arquivo existe fora da campanha, a restauração falhou: apague-o. Sujeito estável de C4(d): demanda que nunca é mesclada, com fecho_pendente válida.",
      fecho_pendente: { motivo: "MUTANTE D016-M32 — válvula escrita pela campanha d016", dono: "qa-engineer",
                        prazo: ctx.dataCommit, declarado_em: ctx.dataCommit }
    }, null, 2) + "\n" },
    espera: { problemas: 1, globais: [],
              sujeitos: [{ id: "999-sintetica-d016", veredito: "EM VOO", codigo: "fecho_pendente-prematura", oraculo: null, fase: "implement" }] } },

  /* ── C7 no gate de proteção ─────────────────────────────────────────────── */
  { id: "D016-M29", gate: "D016-PROT1 (C7)", modo: SONDA_BP,
    desc: "laço da sonda esvaziado em check_branch_protection.py — 0 casos executados contra o total pinado",
    edicoes: [{ file: F.gateBp,
      find: 'resultados = [executa_caso(instr, causa_instr, c, pasta, esperado_cfg) for c in casos]',
      repl: 'resultados = [executa_caso(instr, causa_instr, c, pasta, esperado_cfg) for c in []]   # MUTANTE D016-M29' }],
    espera: { vazia: true } },

  { id: "D016-M30", gate: "D016-PROT1 (C7)", modo: SONDA_BP,
    desc: "árvore: fixture sem_fecho.json removida — a guarda de contagem do gate de proteção nomeia o caso",
    remover: F.fxSemFecho,
    espera: { sondaQuebrada: { caso: "sem_fecho" } } },

  /* ── LEITOR · a sonda não vê leitor; a guarda de censo do gate nu vê ────── */
  { id: "D016-M33", gate: "D016-FEC1 D016-FEC2 (guarda de censo da leitura — C7 aplicada ao leitor)", modo: ARVORE,
    desc: "leitor: fecho.py:ler_merges devolve lista VAZIA com metadados sãos — sem a guarda de censo (piso.merges_ate_piso = 39) a árvore ficava verde por vácuo (spec-validate J1)",
    edicoes: [{ file: F.fecho,
      find: '    return {"merges": merges, "origin_develop": od}',
      repl: '    return {"merges": [], "origin_develop": od}   # MUTANTE D016-M33: leitor mudo com metadados sãos' }],
    espera: { censo: { pinado: 39, lido: 0 } } }
];

/* Controles verdes — não são mutantes, não entram no preflight nem na contagem
   de detectados; falha de controle derruba o exit da campanha. */
const CONTROLES = [
  { id: "C0-fecho", modo: ARVORE, desc: "baseline verde do gate nu: sonda 35/35 ok, censo da leitura ok (39 = 39), 0 problema(s), exit 0",
    edicoes: [], espera: { baselineFecho: true } },
  { id: "C0-protecao", modo: SONDA_BP, desc: "baseline verde da sonda de proteção: 9/9 ok, exit 0",
    edicoes: [], espera: { baselineBp: true } },
  { id: "D016-M24/positivo", modo: ARVORE, desc: "válvula VÁLIDA sobre o cenário de M18 (prazo == data do commit): FECHO PENDENTE DECLARADO, exit 0 — FEC4 alcança o verde, T4 lê a data do commit e a guarda de censo honra o censo movido (15 = 15)",
    edicoes: pisoPara(PISO_6DAD, CENSO_6DAD).concat([{ file: F.ps015, find: FASE_015, repl: '  "phase": "validate",' },
              em(F.ps015, valvulaApos(BRANCH_015, "D016-M24/positivo", ctx => ctx.dataCommit))]),
    espera: { valvulaAceita: { id: "015-superficies-de-apoio", oraculo_detalhe: "#34" } } }
];

/* ── arquivos mutáveis e snapshot ─────────────────────────────────────────── */
const arquivosDe = m => (m.edicoes || []).map(e => e.file).concat(m.remover ? [m.remover] : []);
const criadoPor = m => (m.criar ? [m.criar.file] : []);
const MUTABLE = Array.from(new Set([].concat.apply([], MUTANTS.concat(CONTROLES).map(arquivosDe))));
/* Arquivos que a campanha CRIA (M32): não têm bytes de base — a âncora é a
   ausência; ficam fora de BASE_BYTES e a restauração é unlink + asserção de ausência. */
const CRIAVEIS = Array.from(new Set([].concat.apply([], MUTANTS.concat(CONTROLES).map(criadoPor))));
const BASE_BYTES = {}, BASE_SHA = {};
MUTABLE.forEach(f => { BASE_BYTES[f] = fs.readFileSync(f); BASE_SHA[f] = sha(f); });

/* CONTAGEM, não presença: 0 é âncora podre, >=2 é âncora ambígua. */
function ocorrenciasDe(edicao) {
  return BASE_BYTES[edicao.file].toString("utf8").split(edicao.find).length - 1;
}
function preflightDoMutante(m) {
  const edicoes = (m.edicoes || []).map(e => ({ arquivo: path.basename(e.file), ocorrencias: ocorrenciasDe(e) }));
  if (m.remover) edicoes.push({ arquivo: path.basename(m.remover), ocorrencias: fs.existsSync(m.remover) ? 1 : 0, remocao: true });
  /* criação: a âncora é a AUSÊNCIA do arquivo — 1 sse não existe; existindo, 0 (âncora não encontrada) */
  if (m.criar) edicoes.push({ arquivo: path.basename(m.criar.file), ocorrencias: fs.existsSync(m.criar.file) ? 0 : 1, criacao: true });
  const ns = edicoes.map(e => e.ocorrencias);
  const n = ns.every(x => x === 1) ? 1 : (ns.some(x => x === 0) ? 0 : Math.max.apply(null, ns));
  return { arquivo: edicoes.map(e => e.arquivo).join("+"), ocorrencias: n, edicoes };
}

function selecionar() {
  const only = (process.env.D016_MUT_ONLY || "").split(",").map(x => x.trim()).filter(Boolean);
  return { only, sel: only.length ? MUTANTS.filter(m => only.indexOf(m.id) >= 0) : MUTANTS };
}

/* ── modo preflight (argv, D4) · contrato C1 ──────────────────────────────── */
function preflight(sel) {
  const binario = resolvePy(PY);
  const dados = {
    harness: "d016",
    arquivo: path.basename(__filename),
    interpretador: { nome: PY, origem: PY_ORIGEM, resolvido: !!binario },
    arquivos_mutados: Array.from(new Set(MUTABLE.concat(CRIAVEIS).map(f => path.basename(f)))).sort(),
    controles: CONTROLES.map(c => c.id),
    mutantes: []
  };
  for (const m of sel) {
    const p = preflightDoMutante(m);
    const e = { id: m.id, arquivo: p.arquivo, ocorrencias: p.ocorrencias,
                estado: p.ocorrencias === 1 ? "ok" : "nao_executavel", edicoes: p.edicoes };
    if (p.ocorrencias === 0) e.causa = CAUSA.ausente;
    else if (p.ocorrencias > 1) e.causa = CAUSA.ambigua;
    dados.mutantes.push(e);
  }
  process.stdout.write(JSON.stringify(dados) + "\n");

  const podres = dados.mutantes.filter(m => m.estado !== "ok");
  process.stderr.write("PREFLIGHT d016 · " + dados.mutantes.length + " mutante(s) · " + CONTROLES.length +
    " controle(s) · interpretador " + PY + " (" + PY_ORIGEM + "): " +
    (binario ? "resolvido em " + binario : "NÃO RESOLVIDO") + "\n");
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

/* ── execução de processo (lista de argumentos, sem shell — R10 §7) ───────── */
function runJson(binario, script, args) {
  const r = spawnSync(binario, [script].concat(args), { cwd: HERE, encoding: "utf8", env: process.env,
                                                        maxBuffer: 64 * 1024 * 1024 });
  if (r.error) return { spawnFalhou: true, erro: String(r.error.message || r.error).split("\n")[0] };
  let json = null, erroJson = null;
  try { json = JSON.parse(String(r.stdout || "").trim()); }
  catch (e) { erroJson = "stdout não é o JSON do gate (" + String(e.message || e).slice(0, 60) + ")"; }
  return { code: r.status, json, erroJson, stderr: String(r.stderr || "") };
}
function dataDoCommit() {
  const r = spawnSync("git", ["log", "-1", "--format=%cI", "HEAD"], { cwd: HERE, encoding: "utf8" });
  if (r.error || r.status !== 0) return null;
  return String(r.stdout || "").trim().slice(0, 10);
}
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fmtSujeito = s => s.id + ": " + s.veredito + (s.codigo ? " [" + s.codigo + "]" : "") +
  (s.oraculo ? " · " + s.oraculo + (s.oraculo_detalhe ? " " + s.oraculo_detalhe : "") : "");

/* ── julgadores do KILL (estruturados) ────────────────────────────────────── */
function julgaSonda(r, espera) {
  const j = r.json;
  if (!j) return { kill: false, nota: r.erroJson || "sem JSON" };
  if (espera.vazia) {
    const ok = r.code === 1 && j.ok === false && j.total === 0 && j.total_pinado > 0 && (j.guarda || []).length >= 1;
    return { kill: ok, nota: "total " + j.total + " ≠ pinado " + j.total_pinado + " · guarda: " + (j.guarda || []).join(" | ") };
  }
  if (espera.sondaQuebrada) {
    const c = (j.casos || []).find(x => x.id === espera.sondaQuebrada.caso);
    const ok = r.code === 1 && j.ok === false && !!c && c.obtido === "FIXTURE AUSENTE" && (j.guarda || []).length >= 1;
    return { kill: ok, nota: (c ? c.id + " → " + c.obtido : "caso ausente") + " · guarda: " + (j.guarda || []).join(" | ") };
  }
  if (j.instrumento && j.instrumento.presente !== true)
    return { naoExecutado: CAUSA.rebuild, nota: "instrumento não importou sob o mutante: " + j.instrumento.causa };
  if (r.code !== 1 || j.ok !== false) return { kill: false, nota: "sonda não reprovou (exit " + r.code + ", ok=" + j.ok + ")" };
  const faltas = [];
  for (const d of espera.divergem) {
    const c = (j.casos || []).find(x => x.id === d.id);
    if (!c) { faltas.push(d.id + ": caso ausente da sonda"); continue; }
    if (c.ok) { faltas.push(d.id + ": NÃO divergiu"); continue; }
    if (!c.obtido || typeof c.obtido !== "object") { faltas.push(d.id + ": obtido não é veredito (" + c.obtido + ")"); continue; }
    for (const k of Object.keys(d.campos || {}))
      if (!igual(c.obtido[k], d.campos[k]))
        faltas.push(d.id + "." + k + ": esperado " + JSON.stringify(d.campos[k]) + " · obtido " + JSON.stringify(c.obtido[k]));
  }
  return { kill: faltas.length === 0, nota: faltas.length ? faltas.join(" | ")
           : "divergentes: " + (j.divergentes || []).join(",") + " (" + j.falhas + "/" + j.total + ")" };
}

function julgaArvore(r, espera) {
  const j = r.json;
  if (!j) return { kill: false, nota: r.erroJson || "sem JSON" };
  if (espera.sondaQuebrada) {
    const s = j.sonda || {};
    const c = (s.casos || []).find(x => x.id === espera.sondaQuebrada.caso);
    const ok = r.code === 1 && j.exit === 1 && s.ok === false && j.vivo === null && !!c && c.obtido === "FIXTURE AUSENTE" && (s.guarda || []).length >= 1;
    return { kill: ok, nota: (c ? c.id + " → " + c.obtido : "caso ausente") + " · árvore julgada: " + (j.vivo !== null) + " · guarda: " + (s.guarda || []).join(" | ") };
  }
  const sonda = j.sonda || {};
  if (sonda.ok !== true) return { kill: false, nota: "a sonda saiu do verde sob um mutante de ÁRVORE (" + (sonda.guarda || []).join(" | ") + ")" };
  const v = j.vivo;
  if (!v || v.erro_de_leitura) return { kill: false, nota: "árvore não julgada: " + (v ? v.erro_de_leitura : "vivo nulo") };
  if (espera.censo) {                     /* M33 — guarda de censo da leitura (C7 aplicada ao leitor) */
    const cen = (v._leitura || {}).censo || {}, contC = v.contagens || {}, faltasC = [];
    if (r.code !== 1 || j.exit !== 1) faltasC.push("exit " + r.code + "/" + j.exit + " (esperado 1)");
    if (cen.estado !== "divergente") faltasC.push("censo.estado: esperado divergente · obtido " + cen.estado);
    if (!igual(cen.pinado, espera.censo.pinado)) faltasC.push("censo.pinado: esperado " + espera.censo.pinado + " · obtido " + JSON.stringify(cen.pinado));
    if (!igual(cen.lido, espera.censo.lido)) faltasC.push("censo.lido: esperado " + espera.censo.lido + " · obtido " + JSON.stringify(cen.lido));
    if (contC.problemas !== 0) faltasC.push("problemas de julgamento: esperado 0 (só a guarda de censo pode acusar o leitor mudo) · obtido " + contC.problemas);
    const acusadosC = (v.sujeitos || []).filter(s => s.falha);
    if (acusadosC.length) faltasC.push("sujeito com falha sob leitor mudo (esperado nenhum): " + acusadosC.map(fmtSujeito).join("; "));
    return { kill: faltasC.length === 0,
             nota: (faltasC.length ? faltasC.join(" | ") + " ‖ " : "") + "censo lido " + JSON.stringify(cen.lido) + " × pinado " +
                   JSON.stringify(cen.pinado) + " (" + cen.estado + ") · " + contC.problemas + " problema(s) de julgamento · exit " + r.code };
  }
  const faltas = [];
  if (r.code !== 1 || j.exit !== 1) faltas.push("exit " + r.code + "/" + j.exit + " (esperado 1)");
  const cont = v.contagens || {};
  if (cont.problemas !== espera.problemas) faltas.push("problemas: esperado " + espera.problemas + " · obtido " + cont.problemas);
  if (espera.globais) {
    const g = (v.globais || []).map(x => x.codigo).sort();
    if (!igual(g, espera.globais.slice().sort())) faltas.push("globais: esperado " + JSON.stringify(espera.globais) + " · obtido " + JSON.stringify(g));
  }
  const sujeitos = v.sujeitos || [];
  const casados = new Set();
  for (const e of espera.sujeitos || []) {
    const chaves = Object.keys(e).filter(k => ["detalhe_contem", "regra", "regra_texto"].indexOf(k) < 0);
    const cand = sujeitos.filter(s => chaves.every(k => igual(s[k], e[k])) &&
      (e.detalhe_contem || []).every(t => String(s.detalhe || "").indexOf(t) >= 0) &&
      (!e.regra || e.regra(s)));
    if (cand.length !== 1) {
      const nome = e.id || e.oraculo_detalhe || JSON.stringify(e);
      const real = sujeitos.find(s => e.id ? s.id === e.id : s.oraculo_detalhe === e.oraculo_detalhe);
      faltas.push("sujeito " + nome + ": " + (cand.length === 0 ? "não casou" : "ambíguo") +
        (real ? " · real: " + fmtSujeito(real) + (real.fase ? " (fase " + real.fase + ")" : "") : "") +
        (e.regra_texto ? " · regra: " + e.regra_texto : ""));
    } else casados.add(cand[0].id);
  }
  if (espera.todasDemandas) {
    const dem = sujeitos.filter(s => s.tipo === "demanda");
    const ruins = dem.filter(s => s.veredito !== espera.todasDemandas.veredito || s.codigo !== espera.todasDemandas.codigo);
    if (!dem.length) faltas.push("nenhum sujeito demanda");
    if (ruins.length) faltas.push(ruins.length + " demanda(s) fora de " + JSON.stringify(espera.todasDemandas) + ": " + ruins.map(fmtSujeito).join("; "));
    dem.forEach(s => casados.add(s.id));
  }
  if (espera.semMerges && sujeitos.some(s => s.tipo === "merge")) faltas.push("sujeitos merge julgados sob impedimento global");
  /* isolamento: NENHUM outro sujeito com falha além dos esperados */
  const outros = sujeitos.filter(s => s.falha && !casados.has(s.id));
  if (outros.length) faltas.push("acusação a MAIS (" + outros.length + "): " + outros.map(fmtSujeito).join("; "));
  const acusados = sujeitos.filter(s => s.falha).map(s => fmtSujeito(s) + (s.fase ? " (fase " + s.fase + ")" : ""));
  return { kill: faltas.length === 0,
           nota: (faltas.length ? faltas.join(" | ") + " ‖ " : "") + cont.problemas + " problema(s) · acusados: " + (acusados.join("; ") || "nenhum") +
                 ((v.globais || []).length ? " · globais: " + v.globais.map(g => g.codigo).join(",") : "") };
}

function julgaControle(r, espera) {
  const j = r.json;
  if (!j) return { ok: false, nota: r.erroJson || "sem JSON" };
  if (espera.baselineBp) {
    const ok = r.code === 0 && j.ok === true && j.total === j.total_pinado && j.falhas === 0;
    return { ok, nota: "sonda " + j.total + "/" + j.total_pinado + " · falhas " + j.falhas + " · exit " + r.code };
  }
  const s = j.sonda || {}, v = j.vivo || {}, c = v.contagens || {};
  const cen = (v._leitura || {}).censo || {};
  const censoTxt = "censo da leitura " + JSON.stringify(cen.lido) + "/" + JSON.stringify(cen.pinado) + " (" + cen.estado + ")";
  if (espera.baselineFecho) {
    /* a guarda de censo tem de estar VERDE no baseline: é o controle de que ela roda e alcança o ok */
    const ok = r.code === 0 && j.exit === 0 && s.ok === true && c.problemas === 0 && cen.estado === "ok";
    return { ok, nota: "sonda " + s.total + "/" + s.total_pinado + " · " + c.demandas + " demanda(s) · " + c.problemas + " problema(s) · " + censoTxt + " · exit " + r.code +
      " · origin/develop " + String(((v._leitura || {}).origin_develop || {}).sha || "?").slice(0, 12) + " · data do commit " + (v._leitura || {}).data_do_commit };
  }
  if (espera.valvulaAceita) {
    const suj = (v.sujeitos || []).find(x => x.id === espera.valvulaAceita.id);
    const ok = r.code === 0 && j.exit === 0 && s.ok === true && c.problemas === 0 && c.valvulas === 1 && !!suj &&
      suj.veredito === "FECHO PENDENTE DECLARADO" && suj.oraculo_detalhe === espera.valvulaAceita.oraculo_detalhe && cen.estado === "ok";
    return { ok, nota: (suj ? fmtSujeito(suj) + " · " + suj.detalhe : "sujeito ausente") + " · válvulas " + c.valvulas + " · problemas " + c.problemas + " · " + censoTxt + " · exit " + r.code };
  }
  return { ok: false, nota: "controle sem espera" };
}

/* ── aplicar / restaurar ──────────────────────────────────────────────────── */
function aplicar(m, ctx) {
  if (m.criar && fs.existsSync(m.criar.file))
    return { erro: CAUSA.ausente + " (a âncora da criação é a AUSÊNCIA do arquivo, e ele existe)", arquivo: path.basename(m.criar.file) };
  const porArquivo = new Map();
  for (const e of m.edicoes || []) {
    if (!porArquivo.has(e.file)) porArquivo.set(e.file, BASE_BYTES[e.file].toString("utf8"));
    const atual = porArquivo.get(e.file);
    const n = atual.split(e.find).length - 1;
    if (n !== 1) return { erro: n === 0 ? CAUSA.ausente : CAUSA.ambigua + " (n=" + n + ")", arquivo: path.basename(e.file) };
    const repl = typeof e.repl === "function" ? e.repl(ctx) : e.repl;
    porArquivo.set(e.file, atual.replace(e.find, () => repl));
  }
  for (const [f, conteudo] of porArquivo) fs.writeFileSync(f, conteudo, "utf8");
  if (m.remover) fs.unlinkSync(m.remover);
  if (m.criar) fs.writeFileSync(m.criar.file, typeof m.criar.conteudo === "function" ? m.criar.conteudo(ctx) : m.criar.conteudo, "utf8");
  return { erro: null };
}
function restaurar(m) {
  for (const f of arquivosDe(m)) {
    fs.writeFileSync(f, BASE_BYTES[f]);
    if (sha(f) !== BASE_SHA[f]) throw new Error(m.id + ": restauração NÃO byte-idêntica de " + path.basename(f));
  }
  for (const f of criadoPor(m)) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
    if (fs.existsSync(f)) throw new Error(m.id + ": arquivo criado pela campanha NÃO removido: " + path.basename(f));
  }
}

const { only: ONLY, sel: SELECTED } = selecionar();
const CONTROLES_SEL = CONTROLES.filter(c => !ONLY.length || c.id.indexOf("C0-") === 0 || ONLY.some(o => c.id.indexOf(o) === 0));

(() => {
  const report = [];
  let D = 0, S = 0, U = 0, COK = 0, CFALHOU = 0;

  const emitir = (m, estado, causa, nota) => {
    if (estado === DETECTADO) D++; else if (estado === SOBREVIVENTE) S++; else U++;
    report.push({ id: m.id, estado, causa: causa || "", nota: nota || "" });
    console.log(estado + "  " + m.id + " · " + m.desc);
    console.log("              gate esperado: " + m.gate +
      (causa ? " · causa: " + causa : "") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 600) : ""));
    console.log("");
  };
  const emitirControle = (c, ok, nota) => {
    if (ok) COK++; else CFALHOU++;
    console.log("CONTROLE  " + c.id + " · " + c.desc);
    console.log("              resultado: " + (ok ? "OK" : "FALHOU") + (nota ? " · " + String(nota).replace(/\n/g, " ⏎ ").slice(0, 600) : ""));
    console.log("");
  };

  const fechar = () => {
    let porcelain = "";
    const rel = MUTABLE.concat(CRIAVEIS).map(f => path.relative(HERE, f).replace(/\\/g, "/"));
    const g = spawnSync("git", ["status", "--porcelain", "--"].concat(rel), { cwd: HERE, encoding: "utf8" });
    porcelain = g.error ? "(git indisponível: " + String(g.error.message || g.error).split("\n")[0] + ")" : String(g.stdout || "").trim();
    const criadosForam = CRIAVEIS.every(f => !fs.existsSync(f));
    console.log("restauração: arquivos mutados byte a byte " +
      (MUTABLE.every(f => fs.existsSync(f) && sha(f) === BASE_SHA[f]) ? "OK" : "FALHOU") +
      " · criados removidos " + (criadosForam ? "OK" : "FALHOU") +
      " · porcelain dos alvos " + (porcelain === "" ? "limpo" : "SUJO → " + porcelain.split("\n")[0]));
    const ctrl = "controles: " + COK + " ok · " + CFALHOU + " falho(s)";
    if (U > 0) {
      console.log("\nCAMPANHA NÃO CONCLUÍDA [tests_016_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") +
        ": " + D + " detectados · " + S + " sobreviventes · " + U + " não executados (de " + SELECTED.length + ") · " + ctrl);
      for (const r of report.filter(r => r.estado === NAO_EXECUTADO))
        console.log("  NÃO EXECUTADO  " + r.id + " · " + r.causa + (r.nota ? " · " + r.nota : ""));
    } else {
      console.log("\nD016 MUTATION [tests_016_mutants.js]" + (ONLY.length ? " [PARCIAL]" : "") + ": " +
        D + "/" + SELECTED.length + " mutantes detectados pelo gate e motivo esperados · " + ctrl);
      if (S > 0) console.log("  " + S + " sobrevivente(s): " +
        report.filter(r => r.estado === SOBREVIVENTE).map(r => r.id).join(", "));
    }
    process.exit(D === SELECTED.length && CFALHOU === 0 && porcelain === "" && criadosForam ? 0 : 1);
  };

  const binario = resolvePy(PY);
  if (!binario) {
    console.log("interpretador " + PY + " (" + PY_ORIGEM + ") não resolvido no PATH — " +
      "campanha abortada antes de mutar; nenhum arquivo tocado\n");
    for (const m of SELECTED) emitir(m, NAO_EXECUTADO, CAUSA.interpretador, "");
    return fechar();
  }
  const dataCommit = dataDoCommit();
  const ctx = { dataCommit };
  console.log("D016 MUTATION · " + SELECTED.length + " mutante(s) · " + CONTROLES_SEL.length + " controle(s) · interpretador " + PY +
    " (" + PY_ORIGEM + ") resolvido em " + binario + " · data do commit julgado (T4): " + (dataCommit || "INDISPONÍVEL"));
  console.log("baseline: " + MUTABLE.map(f => path.basename(f) + " " + BASE_SHA[f].slice(0, 12)).join(" · ") + "\n");
  if (ONLY.length) console.log("CAMPANHA PARCIAL (verificação dirigida): " + ONLY.join(", ") + "\n");

  const medir = (m) => {
    if (m.modo === SONDA_FECHO) return runJson(binario, GATE_FECHO_REL, ["--sonda"]);
    if (m.modo === SONDA_BP) return runJson(binario, GATE_BP_REL, ["--sonda"]);
    return runJson(binario, GATE_FECHO_REL, ["--json"]);
  };

  /* 1. controles de baseline — antes de qualquer mutação */
  const baseline = {};
  for (const c of CONTROLES_SEL.filter(c => c.id.indexOf("C0-") === 0)) {
    const r = medir(c);
    const v = r.spawnFalhou ? { ok: false, nota: CAUSA.gate + ": " + r.erro } : julgaControle(r, c.espera);
    baseline[c.modo] = v.ok;
    emitirControle(c, v.ok, v.nota);
  }

  /* 2. mutantes */
  for (const m of SELECTED) {
    const pf = preflightDoMutante(m);
    if (pf.ocorrencias !== 1) {
      emitir(m, NAO_EXECUTADO, pf.ocorrencias === 0 ? CAUSA.ausente : CAUSA.ambigua,
        pf.edicoes.map(e => e.arquivo + "=" + e.ocorrencias).join(", "));
      continue;
    }
    if (m.modo === ARVORE && baseline[ARVORE] === false) {
      emitir(m, NAO_EXECUTADO, CAUSA.gate, "baseline do gate nu VERMELHO — kill não atribuível ao mutante");
      continue;
    }
    if (m.modo === SONDA_BP && baseline[SONDA_BP] === false) {
      emitir(m, NAO_EXECUTADO, CAUSA.gate, "baseline da sonda de proteção VERMELHO — kill não atribuível ao mutante");
      continue;
    }
    const precisaData = (m.edicoes || []).some(e => typeof e.repl === "function") ||
      (!!m.criar && typeof m.criar.conteudo === "function");
    if (precisaData && !dataCommit) {
      emitir(m, NAO_EXECUTADO, CAUSA.gate, "data do commit indisponível (git log -1 --format=%cI HEAD falhou)");
      continue;
    }
    let estado = "", causa = "", nota = "";
    try {
      const a = aplicar(m, ctx);
      if (a.erro) { estado = NAO_EXECUTADO; causa = a.erro; nota = a.arquivo; }
      else {
        const r = medir(m);
        if (r.spawnFalhou) { estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = String(r.erro).slice(0, 160); }
        else if (!r.json) { estado = NAO_EXECUTADO; causa = CAUSA.gate; nota = (r.erroJson || "sem JSON") + " (exit " + r.code + ") · " + r.stderr.split("\n").filter(Boolean).slice(-1)[0]; }
        else {
          const v = m.modo === ARVORE ? julgaArvore(r, m.espera) : julgaSonda(r, m.espera);
          if (v.naoExecutado) { estado = NAO_EXECUTADO; causa = v.naoExecutado; nota = v.nota; }
          else { estado = v.kill ? DETECTADO : SOBREVIVENTE; nota = v.nota; }
        }
      }
    } catch (e) {
      estado = NAO_EXECUTADO;
      causa = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160));
    } finally {
      restaurar(m);
    }
    emitir(m, estado, causa, nota);
  }

  /* 3. controle positivo (muta a árvore como M18 + válvula válida; restaura) */
  for (const c of CONTROLES_SEL.filter(c => c.id.indexOf("C0-") !== 0)) {
    if (baseline[ARVORE] === false) { emitirControle(c, false, "baseline vermelho — não medido"); continue; }
    if (!dataCommit) { emitirControle(c, false, "data do commit indisponível"); continue; }
    let ok = false, nota = "";
    try {
      const a = aplicar(c, ctx);
      if (a.erro) nota = a.erro + " em " + a.arquivo;
      else {
        const r = medir(c);
        const v = r.spawnFalhou ? { ok: false, nota: r.erro } : julgaControle(r, c.espera);
        ok = v.ok; nota = v.nota;
      }
    } catch (e) { nota = naoClassificada(String((e && e.message) || e).split("\n")[0].slice(0, 160)); }
    finally { restaurar(c); }
    emitirControle(c, ok, nota);
  }

  fechar();
})();
