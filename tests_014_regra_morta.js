/* ============================================================================
   TESTES D014 · REGRA MORTA POR CASCATA — demanda 014-gate-sem-poder-discriminante
   Namespace exclusivo D014-*. Não continua numeração de fase alheia e não vive
   em arquivo de outra fase (R10 §1). Sem Chromium: nenhum gate desta suíte mede
   geometria — é o ponto da demanda. O par que exige navegador (`D014-M10` ×
   `P52-LAY2`) vive em `tests_014_mutants_visual.js` e fecha no job `visual`.

   ==========================================================================
   O QUE ESTA SUÍTE É — E O RISCO PARTICULAR DELA
   ==========================================================================
   Isto é um instrumento que mede OUTROS instrumentos. Uma alínea que não possa
   falhar aqui não é só um teste fraco: é a demanda virando a coisa que combate.
   Por isso a suíte é construída em duas camadas separadas:

     1. JULGADORES PUROS — `julgar*(dados)` devolve `[{alinea, ok, msg}]` e não
        lê arquivo, não executa processo, não conhece a árvore. São funções do
        DADO.
     2. COLETORES — leem a árvore, o registro e o instrumento, e alimentam os
        julgadores.

   A separação existe para que `D014-DISC1` possa alimentar os MESMOS julgadores
   com dados sintéticos deliberadamente defeituosos e provar, alínea por alínea,
   que cada uma tem estado alcançável de FALHA — e, com o controle verde, que
   cada uma tem estado alcançável de PASSAGEM. Julgador constante-vermelho e
   julgador constante-verde são o mesmo defeito com sinais trocados.

   ORÇAMENTO (R9 §7, justificativa registrada): este arquivo passa das ~600
   linhas. A `D014-DISC1` — controles verdes + bateria negativa + censo de
   alíneas — responde por cerca de 40% dele, e é justamente a peça que não pode
   ser cortada: sem ela a suíte é um julgador sem juiz. Partir a bateria em
   arquivo próprio a tiraria do mesmo processo que declara as alíneas e abriria
   a porta para as duas listas divergirem em silêncio, que é a doença desta
   demanda. Fica em um arquivo, com a razão escrita.

   ==========================================================================
   API EXIGIDA DO INSTRUMENTO — CONTRATO DESTE GATE
   ==========================================================================
   `.claude/verify/regra_morta.js` (owner: build-engineer, wave 4, T040) precisa
   exportar:

     API                     inteiro; esta suíte exige 1
     censo(camadas)          camadas: [{nome, css}] em ordem de inlining
                             -> [{folha, regras, declaracoes, media,
                                  regras_com_importante, importante_texto,
                                  importante_com_var, outras}]
     classificar(caso)       caso: {camadas:[{nome,css}], alvo:{camada,seletor,propriedade}}
                             -> {veredito: "morta"|"viva"|"indecidivel", razao, ...}
     folhasInjetadas(src)    src: fonte de build_v32_html.py
                             -> [nome de folha, ...] na ORDEM de injeção
     varrerArvore(opts)      opts: {raiz, exclusoes}
                             -> {censo_ok, censo, populacao, harnesses,
                                 sem_preflight, avaliados, excluidos, mortas,
                                 indecidiveis, folhas}
                             REGRA DE ORDEM: `mortas` é `null` enquanto
                             `censo_ok !== true`. Veredito depois do censo,
                             nunca antes (errata E6).

   O contrato está aqui, e não num .md, porque é o gate que o cobra. Divergência
   de forma entre o instrumento e este bloco é divergência a decidir, nunca
   asserção a afrouxar (R10 §1).

   ==========================================================================
   POR QUE INVOCAR `--preflight` NÃO É VIOLAÇÃO DE R10 §6
   ==========================================================================
   R10 §6 proíbe gate que SPAWNA OUTRA SUÍTE e gate que usa regex sobre stdout
   PT-BR como oráculo. `--preflight` não é suíte: não muta, não reconstrói, não
   executa gate nenhum, não escreve arquivo (é o contrato C1 da demanda 013), e
   o oráculo é o OBJETO JSON, nunca o texto humano — que vai para stderr. O
   precedente é o stage `mutation` (`check_mutation.py:279-330`), que o consome
   do mesmo jeito. A spec desta demanda ratificou a fonte em C2: "população e
   âncora lidas de `--preflight` (nunca dos pares da matriz)".

   E quem invoca é o INSTRUMENTO (`varrerArvore`), não esta suíte: aqui só se
   julga o relatório. Caminho entre aspas é exigência de quem invoca (R10 §7).

   ==========================================================================
   O RECORTE DE "MUTANTE DE CSS" NA EXTENSÃO DO CONTRATO — DECISÃO REGISTRADA
   ==========================================================================
   A spec (§Contratos, errata E3) diz `find`/`repl` "para mutante de CSS". A
   pergunta que ela deixou aberta — emitir só para `.css` ou para todos? — foi
   MEDIDA antes de decidida (2026-09-01, sonda sobre os cinco harnesses):

     · só `.css`  → 49 mutantes,  3.845 bytes de `find`
     · todos      → 218 mutantes, 18.638 bytes de `find`

   Custo não decide: 15 KB a mais é irrelevante, e o edit no harness é o mesmo
   (a condição é `arquivo.endsWith(".css")`, avaliada por mutante, num laço que
   já existe). O que decide é OUTRA coisa: campo de contrato sem consumidor
   apodrece, e emitir a âncora de 169 mutantes que ninguém lê é criar 169
   campos sem carrasco. **Decisão: só para mutante cujo arquivo é `.css`.**

   E o ENDURECIMENTO vai para o eixo onde o buraco desta demanda realmente
   está: este gate NÃO consulta a lista de cinco harnesses da spec. Ele
   quantifica sobre TODO harness com `"preflight": true` em `mutation_map.json`
   — hoje sete, incluindo `d010`, que tem ZERO mutante de CSS. Um sexto,
   sétimo ou oitavo harness que ganhe um mutante de CSS entra na população no
   dia em que nascer, sem editar este arquivo. Digitar "os cinco" aqui seria
   reproduzir, dentro do julgador, exatamente o defeito julgado: *o gatilho
   vigiando uma lista, em vez do que decide o resultado.* Os harnesses SEM
   preflight (hoje `core`) saem NOMEADOS em `sem_preflight` — cegueira
   declarada, nunca silenciosa (R10 §2).

   ==========================================================================
   AUTO-EXCLUSÃO NOMINAL (R10 §10) — DUAS, E AS DUAS IMPRESSAS
   ==========================================================================
   1. Exclusão de MUTANTE: `.claude/verify/regra_morta.json → exclusoes`, por
      par (harness, mutante), nominal, com a cegueira escrita. Julgada por
      `D014-EXC1`, cujo conjunto esperado é DECLARADO abaixo — exclusão nova
      sem mudança de spec reprova.
   2. Auto-exclusão dos ARTEFATOS DESTA DEMANDA da varredura: as fixtures são
      strings (nunca `.css`) e o registro é JSON — nenhum dos dois pode entrar
      na lista de folhas varridas. Julgada pela alínea `C2(auto)`, que é
      NOMINAL: nomeia os arquivos, não confia na construção.

   ==========================================================================
   DE ONDE VÊM OS GABARITOS
   ==========================================================================
   `VEREDITO_CANONICO`, `PARES_DECLARADOS` e `SUBSEQUENCIA_SELADA` são LITERAIS,
   copiados da spec (`specs/014-gate-sem-poder-discriminante/spec.md`, células C1
   e §Justificativa) e da spec selada (`specs/PHASE_5_0_REV_B.md:1606`). É
   PROIBIDO derivá-los de `fixtures_014_regra_morta.js` ou do próprio
   instrumento: um julgador que lê o gabarito do objeto julgado concorda com
   qualquer edição do objeto julgado. A fixture traz a ENTRADA; o gabarito mora
   aqui.
   ========================================================================== */
"use strict";

const path = require("path"), fs = require("fs");
const FX = require("./fixtures_014_regra_morta.js");

const HERE = __dirname;
const REG_PATH = path.join(HERE, ".claude", "verify", "regra_morta.json");
const MAP_PATH = path.join(HERE, ".claude", "verify", "mutation_map.json");
const BUILDER_PATH = path.join(HERE, "build_v32_html.py");
const SPEC_SELADA_PATH = path.join(HERE, "specs", "PHASE_5_0_REV_B.md");
const INSTRUMENTO_PATH = path.join(HERE, ".claude", "verify", "regra_morta.js");

/* ── gabaritos DECLARADOS (spec, literais) ─────────────────────────────────── */

/* spec.md, célula C1 + §"O predicado, e por que ele é estreito de propósito".
   Os dois casos reais estão nas linhas (a) e (e): `M51-01` morre por prefixo
   VÁCUO (`html`), `M51-08` vive por prefixo que RESTRINGE (`#ux-target`). */
const VEREDITO_CANONICO = { a: "morta", b: "morta", c: "viva", d: "viva", e: "viva" };
const VEREDITO_INDECIDIVEL = { f: "indecidivel" };
const VOCABULARIO_VEREDITO = ["morta", "viva", "indecidivel"];

/* Conjunto NOMINAL FECHADO das exclusões, literal da spec. As duas vêm de
   §Justificativa ("imune por oráculo — o gate lê fonte, não renderização | 2 |
   M8 (P50-COR1) · D009-M5 (D009-DOM1)"). Houve uma terceira — `p52/P52-RA8`,
   motivo `achado-aberto`, ratificada pela errata **E7** — que SAIU pela errata
   **E14** (fix-finding do EA-32, 2026-09-04): o mutante foi partido em
   `P52-RA8` (MDR) + `P52-RA8B` (SOCaaS), cada metade alterando a regra
   VENCEDORA do seu asset, e a exceção morreu com a razão que a criou — o par
   `p52/P52-RA8` passou a existir na matriz, que era o `evento_de_remocao` que
   ela mesma declarava (sem esta linha mudar, C3(*) e C3(c) reprovariam: a
   exclusão ficaria órfã pelo preflight). Uma TERCEIRA exige mudança de spec —
   é isto que dá dentes a C3, e é o que impede que `achado-aberto` vire a
   gaveta onde todo caso incômodo é despejado. */
const PARES_DECLARADOS = ["p50/M8", "d009/D009-M5"];

/* specs/PHASE_5_0_REV_B.md:1606 — âncora normativa de fase selada. A cláusula
   declara a ORDEM (ui_ux_v32.css antes de ui_p50_v32.css); nunca quem vence a
   cascata. Reordenar folhas está fora de escopo desta demanda. */
const SUBSEQUENCIA_SELADA = ["ui_ux_v32.css", "ui_p50_v32.css"];
const ANCORA_SELADA =
  "**nesta ordem declarada**, após a entrada existente de `ui_session_v32.js` (JS) e após `ui_ux_v32.css` (CSS)";

/* Artefatos desta demanda que NUNCA podem aparecer na lista de folhas varridas
   (auto-exclusão nominal, R10 §10). */
const ARTEFATOS_DA_DEMANDA = [
  "fixtures_014_regra_morta.js",
  "tests_014_regra_morta.js",
  "regra_morta.json",
  "regra_morta.js"
];

/* ── runner (shape da casa) ────────────────────────────────────────────────── */
const results = [];
function T(id, desc, fn) {
  try { fn(); results.push({ id, ok: true }); console.log("PASS " + id + " — " + desc); }
  catch (e) {
    results.push({ id, ok: false });
    console.log("FAIL " + id + " — " + desc + "\n      " + String(e && e.message || e).replace(/\n/g, "\n      "));
  }
}

/* Converte o resultado de um julgador em falha NOMEADA por alínea. Nunca
   agrega: quem lê o vermelho precisa saber QUAL alínea caiu. */
function exigir(alineas) {
  const ruins = alineas.filter(a => !a.ok);
  if (ruins.length)
    throw new Error(ruins.length + " alínea(s) reprovada(s):\n" +
      ruins.map(a => "· " + a.alinea + ": " + a.msg).join("\n"));
}
const A = (alinea, ok, msg) => ({ alinea, ok: !!ok, msg: ok ? "" : String(msg) });

/* ═══════════════════════════════════════════════════════════════════════════
   CAMADA 1 · JULGADORES PUROS
   Funções do DADO. Nenhuma lê arquivo, executa processo ou conhece a árvore.
   São o que `D014-DISC1` alimenta com defeito deliberado.
   ═══════════════════════════════════════════════════════════════════════════ */

/* C1 — os cinco cenários canônicos. `respostas` mapeia id de caso → veredito. */
function julgarCascata(respostas) {
  const r = respostas || {};
  const ausentes = FX.CASCATA.filter(id => VOCABULARIO_VEREDITO.indexOf(r[id]) < 0);
  const out = [A("C1(*)", ausentes.length === 0,
    "caso(s) sem veredito no vocabulário " + JSON.stringify(VOCABULARIO_VEREDITO) +
    ": " + ausentes.map(id => id + "=" + JSON.stringify(r[id])).join(", ") +
    " — a alínea de não-vacuidade cai quando o cenário some, e SÓ nesse caso")];
  FX.CASCATA.forEach(id => {
    const esperado = VEREDITO_CANONICO[id], obtido = r[id];
    out.push(A("C1(" + id + ")", obtido === esperado,
      "cenário (" + id + ") " + FX.CASOS[id].titulo + " → esperado " +
      JSON.stringify(esperado) + ", obtido " + JSON.stringify(obtido)));
  });
  return out;
}

/* C2 — a varredura sobre a árvore real.
   `pref` é o oráculo INDEPENDENTE: a população e a âncora lidas do preflight
   pela própria suíte, sem passar pelo instrumento. Sem ele, C2(pop) compararia
   o instrumento consigo mesmo — julgador que concorda com o julgado.
   `rel === null` significa instrumento ausente: as alíneas que dependem dele
   caem NOMEADAS como não medidas (R10 §2), e as que não dependem seguem
   medindo. Vermelho que colapsa estados esconde o que ainda funciona. */
function julgarVarredura(rel, pref) {
  const out = [];
  const r = rel || null;
  const semInstr = "instrumento ausente — alínea NÃO MEDIDA (FAIL nomeado, nunca SKIP: R10 §2)";
  const popRef = (pref && Array.isArray(pref.populacao)) ? pref.populacao : [];
  const chave = m => m.harness + "/" + m.id;

  /* (pref) o oráculo independente respondeu? Ambiente ausente se declara com
     nome, jamais vira verde por omissão. */
  const erros = (pref && pref.erros) || [];
  out.push(A("C2(pref)", !!pref && erros.length === 0,
    "preflight indisponível em: " + JSON.stringify(erros) +
    " — sem o oráculo independente a população não é conferível"));

  /* (pop) a população do instrumento bate com a do oráculo independente, e a
     fonte é o preflight de TODO harness que o declara; os que NÃO o declaram
     saem NOMEADOS (`sem_preflight`), nunca omitidos. */
  const hs = r && Array.isArray(r.harnesses) ? r.harnesses.slice().sort() : null;
  const sp = r && Array.isArray(r.sem_preflight) ? r.sem_preflight.slice().sort() : null;
  const espH = ((pref && pref.harnesses) || []).slice().sort();
  const espS = ((pref && pref.sem_preflight) || []).slice().sort();
  const popI = r && Array.isArray(r.populacao) ? r.populacao.map(chave).sort() : null;
  const popP = popRef.map(chave).sort();
  out.push(A("C2(pop)", !!r && !!popI && !!hs && !!sp &&
      JSON.stringify(popI) === JSON.stringify(popP) &&
      JSON.stringify(hs) === JSON.stringify(espH) &&
      JSON.stringify(sp) === JSON.stringify(espS),
    !r ? semInstr :
    "população do instrumento (" + (popI ? popI.length : "sem lista") + ") × do preflight (" +
    popP.length + "); harnesses consultados " + JSON.stringify(hs) + " × " + JSON.stringify(espH) +
    "; sem preflight " + JSON.stringify(sp) + " × " + JSON.stringify(espS)));

  /* (anc) a âncora, por E3 — julgada no ORÁCULO INDEPENDENTE, porque é o
     contrato C1 dos harnesses que está sendo cobrado, não o relatório.
     `repl === find` é mutação que não muta: a folha mutada sairia idêntica, o
     diff seria vazio e a varredura diria "zero mortas" sem ter avaliado nada. */
  const semAncora = popRef.filter(m =>
    typeof m.find !== "string" || !m.find.length ||
    typeof m.repl !== "string" || m.repl === m.find);
  out.push(A("C2(anc)", popRef.length > 0 && semAncora.length === 0,
    popRef.length === 0
      ? "população vazia — sem mutante de CSS não há âncora a conferir"
      : semAncora.length + " de " + popRef.length +
        " mutante(s) de CSS sem âncora no contrato C1 (find/repl string não-vazia, repl !== find): " +
        semAncora.map(chave).join(", ")));

  /* (cen) ORDEM: o censo é conferido ANTES do veredito. Censo reprovado com
     `mortas: []` é o verde vacuoso que a errata E6 existe para matar. */
  const ordemOk = r && (r.censo_ok === true ? true : (r.mortas === null || r.mortas === undefined));
  out.push(A("C2(cen)", !!r && r.censo_ok === true && ordemOk,
    !r ? semInstr :
    "censo_ok=" + JSON.stringify(r.censo_ok) + " e mortas=" +
    (r.mortas === null ? "null" : JSON.stringify(r.mortas && r.mortas.length)) +
    " — veredito só existe com censo conferido; censo reprovado exige mortas=null"));

  /* (zero) O VEREDITO É UM PAR — (mortas, indecidíveis) —, nunca um número só
     (errata E9). "Zero mortas" significa *zero entre as DECIDÍVEIS*; medido em
     2026-09-01, 29% da população (14 de 49 mutantes) tem parte indecidível, de
     modo que a frase sem a segunda metade afirma mais do que se mediu. Por isso
     um relatório que traga `mortas: []` mas não traga a lista de indecidíveis
     REPROVA aqui: não é veredito, é meia-frase. */
  const mortasZero = Array.isArray(r && r.mortas) && r.mortas.length === 0;
  const parCompleto = Array.isArray(r && r.indecidiveis);
  out.push(A("C2(zero)", !!r && mortasZero && parCompleto,
    !r ? semInstr :
    "veredito (mortas, indecidíveis) = (" +
    (Array.isArray(r.mortas) ? r.mortas.length : JSON.stringify(r.mortas)) + ", " +
    (Array.isArray(r.indecidiveis) ? r.indecidiveis.length : JSON.stringify(r.indecidiveis)) + ")" +
    (Array.isArray(r.mortas) && r.mortas.length
      ? " · mortas: " + r.mortas.map(m => m.harness + "/" + m.id).join(", ")
      : "") +
    " — o veredito é o PAR; sem a segunda metade a frase afirma mais do que se mediu (E9)"));

  /* (cob) conservação no nível do mutante, contra a população do ORÁCULO
     INDEPENDENTE: cada um cai em exatamente um balde. Nada some, nada conta
     duas vezes. */
  const av = new Set(((r && r.avaliados) || []).map(chave));
  const ex = new Set(((r && r.excluidos) || []).map(chave));
  const orfaos = popP.filter(k => !av.has(k) && !ex.has(k));
  const duplos = popP.filter(k => av.has(k) && ex.has(k));
  const intrusos = [...av, ...ex].filter(k => popP.indexOf(k) < 0);
  out.push(A("C2(cob)", !!r && !orfaos.length && !duplos.length && !intrusos.length,
    !r ? semInstr :
    "cobertura: órfãos (nem avaliados nem excluídos) " + JSON.stringify(orfaos) +
    "; em dois baldes " + JSON.stringify(duplos) +
    "; fora da população " + JSON.stringify(intrusos)));

  /* (auto) auto-exclusão NOMINAL dos artefatos desta demanda (R10 §10). */
  const folhas = (r && Array.isArray(r.folhas)) ? r.folhas : [];
  const vazou = folhas.filter(f => ARTEFATOS_DA_DEMANDA.indexOf(path.basename(String(f))) >= 0);
  out.push(A("C2(auto)", !!r && vazou.length === 0,
    !r ? semInstr :
    "artefato da própria demanda dentro da varredura: " + JSON.stringify(vazou) +
    " — a auto-exclusão é nominal e impressa, nunca confiada à construção"));

  return out;
}

/* C3 — a auto-exclusão tem dentes. `paresEsperados` é parâmetro para que a
   bateria negativa possa exercer (a)–(d) sem derrubar (*) por tabela. */
function julgarExclusoes(reg, populacao, paresEsperados, vocabulario, paresDaMatriz) {
  const out = [];
  const ex = (reg && Array.isArray(reg.exclusoes)) ? reg.exclusoes : null;
  const voc = vocabulario || [];
  const chave = e => String(e && e.harness) + "/" + String(e && e.mutante);
  const CURINGA = /[*?]|^\s*$|^(all|todos|any)$/i;

  /* (*) conjunto NOMINAL fechado: exclusão nova sem mudança de spec reprova. */
  const obtido = ex ? ex.map(chave).slice().sort() : null;
  out.push(A("C3(*)", !!obtido && JSON.stringify(obtido) === JSON.stringify(paresEsperados.slice().sort()),
    "conjunto de exclusões " + JSON.stringify(obtido) + " ≠ declarado na spec " +
    JSON.stringify(paresEsperados) + " — auto-exclusão é lista fechada, não gaveta"));

  /* (a) vocabulário fechado de motivo. */
  const motivoRuim = (ex || []).filter(e => voc.indexOf(e && e.motivo) < 0);
  out.push(A("C3(a)", !!ex && motivoRuim.length === 0,
    "motivo fora do vocabulário " + JSON.stringify(voc) + ": " +
    motivoRuim.map(e => chave(e) + "=" + JSON.stringify(e && e.motivo)).join(", ")));

  /* (b) curinga, vazio ou não-texto NÃO excluem. */
  const curinga = (ex || []).filter(e =>
    typeof (e && e.harness) !== "string" || typeof (e && e.mutante) !== "string" ||
    CURINGA.test(e.harness) || CURINGA.test(e.mutante));
  out.push(A("C3(b)", !!ex && curinga.length === 0,
    "exclusão por curinga, campo vazio ou não-texto: " +
    curinga.map(e => JSON.stringify([e && e.harness, e && e.mutante])).join(", ")));

  /* (c) exclusão órfã reprova — o oráculo é o preflight, resolvido no disco. */
  const popK = new Set((populacao || []).map(m => m.harness + "/" + m.id));
  const orfas = (ex || []).filter(e => !popK.has(chave(e)));
  out.push(A("C3(c)", !!ex && orfas.length === 0,
    "exclusão nomeia mutante que o preflight não declara: " +
    orfas.map(chave).join(", ") + " — exclusão órfã é permissão permanente disfarçada"));

  /* (d) a exclusão registra o que AFIRMA, o que LÊ e o que NÃO VÊ. A cegueira
     é exigência da spec §"A alínea em que quase escorreguei"; vale para os dois
     motivos que fazem afirmação sobre um objeto que a varredura deixa de olhar. */
  const COM_CEGUEIRA = ["oraculo-de-fonte", "achado-aberto"];
  const incompletas = (ex || []).filter(e => e && COM_CEGUEIRA.indexOf(e.motivo) >= 0 && !(
    typeof e.gate === "string" && e.gate.length &&
    typeof e.propriedade_afirmada === "string" && e.propriedade_afirmada.length &&
    Array.isArray(e.arquivos_lidos) && e.arquivos_lidos.length &&
    e.arquivos_lidos.every(a => typeof a === "string" && a.length) &&
    typeof e.cegueira === "string" && e.cegueira.length));
  out.push(A("C3(d)", !!ex && incompletas.length === 0,
    "exclusão " + JSON.stringify(COM_CEGUEIRA) + " sem gate, propriedade_afirmada, " +
    "arquivos_lidos ou cegueira: " + incompletas.map(chave).join(", ") +
    " — excluir sem dizer o que se deixa de ver é a doença que esta demanda combate"));

  /* (e) `achado-aberto` — a exclusão de CAUSA NÃO FECHADA (errata E7). Não é
     passe livre e não é adiamento: exige DONO (gate), ID e PRAZO, e o prazo é
     AUTO-EXECUTÁVEL contra a matriz — a exceção morre com a razão que a criou,
     no padrão da KI-4. Duas cláusulas que não existem em nenhuma outra alínea:

       · MARCADOR NÃO PODE SER SILENCIOSO. `achado_id_alocado: false` obriga
         `achado_id_pendencia` escrita — id de backlog depende da `develop`, que
         uma worktree de feature não enxerga (R14), e um marcador sem a pendência
         declarada é exatamente a âncora podre que esta demanda combate.
       · PRAZO VENCIDO REPROVA. Se o evento declarado JÁ OCORREU, a exceção
         devia ter saído: o gate reprova em vez de esperar boa vontade. É o que
         separa "prazo" de "intenção". */
  const abertas = (ex || []).filter(e => e && e.motivo === "achado-aberto");
  const CHAVES_EVENTO = ["registro", "condicao", "harness", "mutante"];
  const ruinsAA = [];
  abertas.forEach(e => {
    const faltam = [];
    if (typeof e.achado_id !== "string" || !e.achado_id.trim()) faltam.push("achado_id");
    if (typeof e.achado_id_alocado !== "boolean") faltam.push("achado_id_alocado (booleano)");
    if (e.achado_id_alocado === false &&
        (typeof e.achado_id_pendencia !== "string" || !e.achado_id_pendencia.trim()))
      faltam.push("achado_id_pendencia — marcador silencioso não passa");
    if (typeof e.remocao_prevista !== "string" || !e.remocao_prevista.trim())
      faltam.push("remocao_prevista");
    const ev = e.evento_de_remocao;
    if (!ev || typeof ev !== "object" ||
        CHAVES_EVENTO.some(k => typeof ev[k] !== "string" || !ev[k].trim()))
      faltam.push("evento_de_remocao {" + CHAVES_EVENTO.join(",") + "}");
    else {
      const ocorreu = (paresDaMatriz || []).some(p =>
        String(p && p.mutante).trim() === ev.mutante.trim() &&
        new RegExp("^\\s*" + ev.harness.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b")
          .test(String((p && p.harness) || "")));
      if (ocorreu)
        faltam.push("PRAZO VENCIDO — o evento declarado já ocorreu (par " + ev.harness + "/" +
                    ev.mutante + " existe em " + ev.registro + "); a exceção tinha de ter saído");
    }
    if (faltam.length) ruinsAA.push(chave(e) + ": " + faltam.join("; "));
  });
  out.push(A("C3(e)", !!ex && ruinsAA.length === 0,
    "exclusão `achado-aberto` sem dono, id, prazo ou com prazo vencido:\n    " +
    ruinsAA.join("\n    ") +
    "\n  — `achado-aberto` não é gaveta: a asserção de C2 é idêntica, o que muda é que o " +
    "objeto excluído passa a ter dono, id e prazo (E7)"));

  return out;
}

/* C5 — cobertura DERIVADA do builder, nunca digitada. */
function julgarCobertura(observadas, doBuilder, subsequenciaSelada) {
  const out = [];
  const obs = Array.isArray(observadas) ? observadas : [];
  const bld = Array.isArray(doBuilder) ? doBuilder : [];

  /* (*) não-vacuidade: derivação que devolve lista vazia faz (lista) e (ordem)
     passarem por vacuidade. */
  out.push(A("C5(*)", bld.length > 0,
    "a derivação a partir de build_v32_html.py devolveu " + bld.length +
    " folha(s) — lista vazia tornaria as demais alíneas vacuosas"));

  const falta = bld.filter(f => obs.indexOf(f) < 0);
  const sobra = obs.filter(f => bld.indexOf(f) < 0);
  out.push(A("C5(lista)", !falta.length && !sobra.length,
    "folha injetada pelo builder e não lida pela varredura: " + JSON.stringify(falta) +
    "; folha lida e não injetada: " + JSON.stringify(sobra)));

  out.push(A("C5(ordem)", JSON.stringify(obs) === JSON.stringify(bld),
    "ordem observada " + JSON.stringify(obs) + " ≠ ordem do builder " + JSON.stringify(bld)));

  /* (spec) a ordem nominal da fase selada aparece como SUBSEQUÊNCIA. */
  let i = 0;
  obs.forEach(f => { if (i < subsequenciaSelada.length && f === subsequenciaSelada[i]) i++; });
  out.push(A("C5(spec)", i === subsequenciaSelada.length,
    "a ordem declarada em specs/PHASE_5_0_REV_B.md:1606 " +
    JSON.stringify(subsequenciaSelada) + " não aparece como subsequência de " +
    JSON.stringify(obs) + " — reordenar folhas não é remédio admissível nesta demanda"));

  return out;
}

/* C6 — o que a varredura NÃO decide é nomeado e contado. */
function julgarIndecidiveis(rel, respostaSintetica, regIndecidiveis, vocabularioRazao, paresDaMatriz) {
  const out = [];
  const r = rel || {};
  const lista = Array.isArray(r.indecidiveis) ? r.indecidiveis : null;

  /* (sint) a guarda que NÃO depende do número da árvore. É ela que carrega o
     critério se a árvore real não tiver indecidível nenhum. */
  const sint = respostaSintetica || {};
  out.push(A("C6(sint)", sint.veredito === VEREDITO_INDECIDIVEL.f,
    "caso sintético (f) " + FX.CASOS.f.titulo + " → esperado " +
    JSON.stringify(VEREDITO_INDECIDIVEL.f) + ", obtido " + JSON.stringify(sint.veredito)));

  /* (nome) indecidível sem razão nomeada é "provavelmente viva" com outro nome. */
  const anonimas = (lista || []).filter(x => !(x &&
    typeof x.harness === "string" && typeof x.id === "string" &&
    typeof x.folha === "string" && typeof x.seletor === "string" &&
    typeof x.propriedade === "string" && vocabularioRazao.indexOf(x.razao) >= 0));
  out.push(A("C6(nome)", !!lista && anonimas.length === 0,
    "entrada indecidível sem {harness,id,folha,seletor,propriedade} ou com razão fora de " +
    JSON.stringify(vocabularioRazao) + ": " + anonimas.length + " de " +
    (lista ? lista.length : "sem lista")));

  /* (cons) lei de conservação: nada é descartado em silêncio. */
  const quebradas = (r.avaliados || []).filter(a =>
    Number(a && a.declaracoes) !== (Number(a && a.morta) + Number(a && a.viva) + Number(a && a.indecidivel)));
  const somaInd = (r.avaliados || []).reduce((s, a) => s + Number(a && a.indecidivel || 0), 0);
  out.push(A("C6(cons)", !!lista && quebradas.length === 0 && somaInd === lista.length,
    "conservação: " + quebradas.length + " avaliado(s) com declaracoes ≠ morta+viva+indecidivel" +
    (quebradas.length ? " (" + quebradas.map(a => a.harness + "/" + a.id).join(", ") + ")" : "") +
    "; soma de indecidíveis dos avaliados = " + somaInd + " × lista nomeada = " +
    (lista ? lista.length : "sem lista")));

  /* (cont-sint) O PIN QUE TEM DENTES HOJE (errata E9). Não é a CONTAGEM: com
     seis fixtures e C1 asserindo cinco vereditos um a um, qualquer agregado
     sobre elas é determinado pelas alíneas que já existem — alínea que não pode
     falhar sozinha não mede nada. Medido também que `classificar()` reporta só
     o PRIMEIRO concorrente indecidível, então nem contagem por caso é
     observável. O que NINGUÉM assere é a RAZÃO: um instrumento que classifique
     (f) como indecidível pelo motivo ERRADO passa em C6(sint) e em toda C1.
     Estado de falha exclusivo desta alínea: veredito certo, razão errada. */
  const pinSint = (regIndecidiveis || {}).sintetico || null;
  const razaoOk = !!pinSint && vocabularioRazao.indexOf(pinSint.razao) >= 0;
  out.push(A("C6(cont-sint)",
    !!pinSint && razaoOk && pinSint.caso === "f" &&
      sint.veredito === pinSint.veredito && sint.razao === pinSint.razao,
    !pinSint ? "regra_morta.json → indecidiveis.sintetico AUSENTE — C6 ficaria sem pin nenhum"
      : (!razaoOk ? "razão pinada " + JSON.stringify(pinSint.razao) + " fora do vocabulário " +
                    JSON.stringify(vocabularioRazao)
         : "sintético (" + pinSint.caso + "): pinado (" + JSON.stringify(pinSint.veredito) + ", " +
           JSON.stringify(pinSint.razao) + ") × observado (" + JSON.stringify(sint.veredito) +
           ", " + JSON.stringify(sint.razao) + ")")));

  /* (cont-arvore) A CONTAGEM DA ÁRVORE, com o segundo prazo. Ou é inteiro e
     casa com o observado, ou é uma PENDÊNCIA BEM-FORMADA — mesma doutrina de
     C3(e), pelo mesmo motivo: vermelho crônico é remédio pior que a doença
     (o MANIFEST 74/74 "sempre vermelho, logo nunca rodado", EA-5). `null` seco,
     sem motivo/id/prazo, continua reprovando. */
  const arv = (regIndecidiveis || {}).arvore || null;
  let contOk = false, contMsg = "regra_morta.json → indecidiveis.arvore AUSENTE";
  if (arv && Number.isInteger(arv.contagem) && arv.contagem >= 0) {
    contOk = !!lista && arv.contagem === lista.length;
    contMsg = "contagem pinada = " + arv.contagem + " × observada = " +
              (lista ? lista.length : "sem lista");
  } else if (arv) {
    const ev = arv.evento_de_remocao;
    const bemFormada = arv.motivo === "achado-aberto" &&
      typeof arv.achado_id === "string" && arv.achado_id.trim().length > 0 &&
      typeof arv.remocao_prevista === "string" && arv.remocao_prevista.trim().length > 0 &&
      !!ev && typeof ev === "object" &&
      ["registro", "condicao", "harness", "mutante"].every(k => typeof ev[k] === "string" && ev[k].trim());
    const vencido = bemFormada && (paresDaMatriz || []).some(p =>
      String(p && p.mutante).trim() === ev.mutante.trim() &&
      new RegExp("^\\s*" + ev.harness.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b")
        .test(String((p && p.harness) || "")));
    contOk = bemFormada && !vencido;
    contMsg = "contagem da árvore NÃO FIXADA e " +
      (!bemFormada ? "SEM pendência bem-formada (exige motivo `achado-aberto`, achado_id, " +
                     "remocao_prevista e evento_de_remocao) — `null` seco não passa"
        : "PRAZO VENCIDO: o evento já ocorreu, a contagem tinha de ter sido fixada") +
      " · observado hoje = " + (lista ? lista.length : "sem lista");
  }
  out.push(A("C6(cont-arvore)", contOk, contMsg));

  return out;
}

/* E6 — censo de parse pinado, conferido ANTES do veredito. */
function julgarCenso(observado, pinado) {
  const out = [];
  const obs = Array.isArray(observado) ? observado : [];
  const pin = Array.isArray(pinado) ? pinado : [];
  const nomes = x => x.map(e => String(e && e.folha));
  const CAMPOS = ["regras", "declaracoes", "media", "regras_com_importante",
                  "importante_texto", "importante_com_var"];

  out.push(A("CEN(folhas)", JSON.stringify(nomes(obs)) === JSON.stringify(nomes(pin)),
    "folhas do censo observado " + JSON.stringify(nomes(obs)) +
    " ≠ pinadas " + JSON.stringify(nomes(pin))));

  const divs = [];
  pin.forEach(p => {
    const o = obs.find(x => x && x.folha === p.folha);
    if (!o) return;                                   /* ausência é de CEN(folhas) */
    CAMPOS.forEach(c => {
      if (Number(o[c]) !== Number(p[c]))
        divs.push(p.folha + "." + c + ": observado " + o[c] + " × pinado " + p[c] +
          (c === "importante_com_var"
            ? "  ⟵ SENTINELA DISPARADA: primeira declaração `!important` com valor var(). " +
              "O CSSOM do jsdom descarta a prioridade nesse formato (medido em 2026-09-01). " +
              "Ação: reavaliar o parser da errata E4 ou declarar a exceção com a razão — " +
              "jamais rebaixar o pin (R10 §1)."
            : ""));
    });
    if (JSON.stringify(o.outras || {}) !== JSON.stringify(p.outras || {}))
      divs.push(p.folha + ".outras: observado " + JSON.stringify(o.outras) +
        " × pinado " + JSON.stringify(p.outras) + " (at-rule sumindo em silêncio)");
  });
  out.push(A("CEN(valores)", divs.length === 0,
    "censo divergente:\n  " + divs.join("\n  ") +
    "\n  Regra de contagem em regra_morta.json → _meta.regra_de_contagem_do_censo."));

  /* (nao-vac) a alínea que o defeito real desta demanda produziu: um contador
     que devolve 0-4 regras para cinco folhas passa em CEN(valores) se o pin
     também for zero. Aqui não passa. */
  const vazias = obs.filter(o => !(Number(o && o.regras) > 0));
  out.push(A("CEN(nao-vac)", obs.length > 0 && vazias.length === 0,
    "folha com ZERO regras lidas: " + JSON.stringify(nomes(vazias)) +
    " — 'zero regras mortas' é vacuosamente verdadeiro para um parser que lê pouco"));

  return out;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAMADA 2 · COLETORES
   Leem árvore, registro e instrumento. Ausência é FAIL NOMEADO, nunca SKIP
   silencioso (R10 §2).
   ═══════════════════════════════════════════════════════════════════════════ */

let INSTRUMENTO = null, INSTRUMENTO_ERRO = null;
try {
  INSTRUMENTO = require(INSTRUMENTO_PATH);
} catch (e) {
  INSTRUMENTO_ERRO = (e && e.code === "MODULE_NOT_FOUND")
    ? "instrumento ausente: " + path.relative(HERE, INSTRUMENTO_PATH) +
      " (T040, wave 4, owner build-engineer) — NÃO EXECUTADO, e isso é FAIL, não SKIP"
    : "instrumento não carregou: " + String(e && e.message || e);
}

function instrumento() {
  if (!INSTRUMENTO) throw new Error(INSTRUMENTO_ERRO);
  if (INSTRUMENTO.API !== 1)
    throw new Error("instrumento expõe API=" + JSON.stringify(INSTRUMENTO.API) +
      "; esta suíte exige API=1 (contrato no cabeçalho)");
  ["censo", "classificar", "folhasInjetadas", "varrerArvore"].forEach(f => {
    if (typeof INSTRUMENTO[f] !== "function")
      throw new Error("instrumento sem a função `" + f + "` do contrato do gate");
  });
  return INSTRUMENTO;
}

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

function harnessesDoMapa() {
  const mm = lerJSON(MAP_PATH).harnesses || {};
  const com = [], sem = [];
  Object.keys(mm).forEach(n => (mm[n] && mm[n].preflight === true ? com : sem).push(n));
  return { com, sem, mapa: mm };
}

/* ORÁCULO INDEPENDENTE da população e da âncora.
   Lê o contrato C1 direto de cada harness que declara `preflight: true`, sem
   passar pelo instrumento — é o que impede C2(pop) de comparar o instrumento
   consigo mesmo. Não muta, não reconstrói, não executa gate: `--preflight` é
   modo declarado (demanda 013, C1) e o oráculo é o JSON, nunca o stdout PT-BR
   (R10 §6). Nenhum caminho é interpolado no comando — `cwd` resolve os
   relativos, que é como o stage `mutation` já o invoca (R10 §7).
   Harness sem preflight sai NOMEADO em `sem_preflight`; falha de execução sai
   NOMEADA em `erros`. Silêncio, aqui, seria o defeito da demanda em pessoa. */
let _PREF = null;
function lerPreflight() {
  if (_PREF) return _PREF;
  const { com, sem, mapa } = harnessesDoMapa();
  const cp = require("child_process");
  const populacao = [], erros = [];
  com.slice().sort().forEach(nome => {
    let saida;
    try {
      saida = cp.execSync(mapa[nome].cmd + " --preflight", {
        cwd: HERE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
        timeout: 180000, maxBuffer: 64 * 1024 * 1024
      });
    } catch (e) {
      /* exit != 0 ainda traz o objeto C1 em stdout (âncora podre); só é erro
         quando não há stdout parseável. */
      saida = (e && e.stdout) ? String(e.stdout) : "";
      if (!saida.trim()) { erros.push(nome + ": " + String(e && e.message || e).split("\n")[0]); return; }
    }
    let d;
    try { d = JSON.parse(String(saida).trim()); }
    catch (e) { erros.push(nome + ": stdout não é o objeto JSON de C1 (" + (e && e.message) + ")"); return; }
    (d.mutantes || []).forEach(m => {
      if (!m || typeof m.arquivo !== "string" || !/\.css$/i.test(m.arquivo)) return;
      populacao.push({ harness: nome, id: m.id, arquivo: m.arquivo, find: m.find, repl: m.repl });
    });
  });
  _PREF = { harnesses: com, sem_preflight: sem, populacao, erros };
  return _PREF;
}

/* Classifica os casos sintéticos. Um caso que estoure NÃO vira "sem veredito"
   em silêncio: a exceção vira o próprio veredito inválido, e C1(*) a nomeia. */
function classificarFixtures(ids) {
  const rm = instrumento(), out = {};
  ids.forEach(id => {
    const c = FX.CASOS[id];
    try {
      const r = rm.classificar({ camadas: c.camadas, alvo: c.alvo });
      out[id] = r && r.veredito;
    } catch (e) { out[id] = "EXCEÇÃO: " + String(e && e.message || e); }
  });
  return out;
}

/* Classificação CRUA de um caso sintético: devolve o objeto inteiro, porque
   C6(cont-sint) julga veredito E razão. Exceção vira veredito inválido nomeado,
   nunca silêncio. */
function classificarCru(id) {
  const c = FX.CASOS[id];
  try { return instrumento().classificar({ camadas: c.camadas, alvo: c.alvo }); }
  catch (e) { return { veredito: "EXCEÇÃO: " + String((e && e.message) || e) }; }
}

/* Pares da matriz — oráculo do PRAZO auto-executável de C3(e) e C6(cont-arvore). */
function paresDaMatriz() {
  try { return JSON.parse(fs.readFileSync(path.join(HERE, ".claude", "verify",
                                                    "mutation-matrix.json"), "utf8")).pares || []; }
  catch (e) { return []; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   OS GATES
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── C1 · D014-CASC1 ──────────────────────────────────────────────────────── */
T("D014-CASC1", "o classificador de cascata acerta os cinco cenários canônicos, incluindo os três cuja resposta correta é 'viva'", () => {
  exigir(julgarCascata(classificarFixtures(FX.CASCATA)));
});

/* ── C2 · D014-VARR1 ──────────────────────────────────────────────────────────
   Duas fontes, de propósito: o RELATÓRIO do instrumento e o PREFLIGHT lido
   aqui. Instrumento ausente não interrompe o gate — as alíneas que não
   dependem dele (C2(pref), C2(anc)) seguem medindo, e as demais caem nomeadas.
   Vermelho que colapsa estados esconde o que ainda funciona. */
T("D014-VARR1", "a varredura enumera os mutantes de CSS de toda campanha pelo preflight (população E âncora) e acusa zero regras mortas, sobre censo conferido antes do veredito", () => {
  const reg = lerJSON(REG_PATH);
  const pref = lerPreflight();
  let rel = null;
  if (INSTRUMENTO) rel = instrumento().varrerArvore({ raiz: HERE, exclusoes: reg.exclusoes });
  exigir(julgarVarredura(rel, pref));
});

/* ── C3 · D014-EXC1 ───────────────────────────────────────────────────────────
   NÃO depende do instrumento: o oráculo de C3(c) é o preflight, resolvido no
   disco. É por isso que este gate pode nascer verde enquanto os outros nascem
   vermelhos — e o fato de nascer verde é declarado, não escondido. */
T("D014-EXC1", "a auto-exclusão nominal tem dentes e não é passe livre: vocabulário fechado, sem curinga, sem órfã, e a cegueira impressa", () => {
  const reg = lerJSON(REG_PATH);
  const pref = lerPreflight();
  if (pref.erros.length)
    throw new Error("preflight indisponível em " + JSON.stringify(pref.erros) +
      " — C3(c) não pode ser medida sem o oráculo; FAIL nomeado, nunca SKIP");
  const voc = (reg._meta || {}).vocabulario_fechado_de_motivo || [];
  exigir(julgarExclusoes(reg, pref.populacao, PARES_DECLARADOS, voc, paresDaMatriz()));
});

/* ── C5 · D014-COB1 ───────────────────────────────────────────────────────── */
T("D014-COB1", "a cobertura da varredura é derivada de build_v32_html.py — lista e ordem —, e respeita a ordem declarada na spec selada", () => {
  const rm = instrumento();
  const reg = lerJSON(REG_PATH);

  /* a âncora da fase selada é conferida no texto: se a cláusula mudar, o
     gabarito desta suíte deixa de ser citável e isto reprova antes. */
  const selada = fs.readFileSync(SPEC_SELADA_PATH, "utf8");
  const n = selada.split(ANCORA_SELADA).length - 1;
  if (n !== 1)
    throw new Error("âncora normativa de specs/PHASE_5_0_REV_B.md:1606 com " + n +
      " ocorrência(s) (esperado 1) — o gabarito SUBSEQUENCIA_SELADA deixou de ser citável");

  const doBuilder = rm.folhasInjetadas(fs.readFileSync(BUILDER_PATH, "utf8"));
  const rel = rm.varrerArvore({ raiz: HERE, exclusoes: reg.exclusoes });
  const observadas = (rel.folhas || []).map(f => path.basename(String(f)))
    .filter(f => /\.css$/i.test(f));
  exigir(julgarCobertura(observadas, doBuilder, SUBSEQUENCIA_SELADA));
});

/* ── C6 · D014-IND1 ───────────────────────────────────────────────────────── */
T("D014-IND1", "o que a varredura não decide é nomeado e contado — nunca engolido; e a alínea não depende do número da árvore", () => {
  const rm = instrumento();
  const reg = lerJSON(REG_PATH);
  const rel = rm.varrerArvore({ raiz: HERE, exclusoes: reg.exclusoes });
  const sint = classificarCru("f");
  const voc = (reg._meta || {}).vocabulario_fechado_de_razao_indecidivel || [];
  exigir(julgarIndecidiveis(rel, sint, reg.indecidiveis, voc, paresDaMatriz()));
});

/* ── E6 · D014-CEN1 ───────────────────────────────────────────────────────── */
T("D014-CEN1", "censo de parse pinado por folha: parser ou contador que degrade em silêncio reprova aqui, antes de qualquer veredito", () => {
  const rm = instrumento();
  const reg = lerJSON(REG_PATH);
  const rel = rm.varrerArvore({ raiz: HERE, exclusoes: reg.exclusoes });
  exigir(julgarCenso(rel.censo, reg.censo));
});

/* ═══════════════════════════════════════════════════════════════════════════
   D014-DISC1 · A GUARDA DE TAUTOLOGIA, ALÍNEA POR ALÍNEA

   A spec responde em PROSA, na §"Guarda de tautologia, alínea por alínea", a
   pergunta do portão: "para cada alínea, existe estado alcançável em que ela
   falha?". Aqui a resposta vira EXECUTÁVEL. Duas provas por julgador:

     · CONTROLE VERDE — uma entrada correta produz ZERO reprovações. Sem ele,
       um julgador constante-vermelho passaria por julgador correto.
     · BATERIA NEGATIVA — para cada alínea, uma entrada defeituosa que a
       reprova PELO NOME. Contar "alguma coisa falhou" contaria o TypeError da
       própria bateria; por isso a asserção é sobre o id da alínea.

   `exato: true` exige que a alínea nomeada seja a ÚNICA reprovada. Onde a
   sobreposição é estrutural (um curinga, por definição, também não resolve no
   preflight), `exato: false` e o colateral esperado fica escrito no caso.

   Esta é a única prova desta suíte que NÃO depende do instrumento — por isso
   nasce verde, enquanto os seis gates acima nascem vermelhos.
   ═══════════════════════════════════════════════════════════════════════════ */

const POP_SINT = [
  { harness: "hx", id: "X1", arquivo: "a.css", find: "α", repl: "β" },
  { harness: "hx", id: "X2", arquivo: "b.css", find: "γ", repl: "δ" }
];
const PREF_SADIO = { harnesses: ["hx"], sem_preflight: ["hz"], populacao: POP_SINT, erros: [] };
const REL_SADIO = {
  censo_ok: true,
  censo: [{ folha: "a.css", regras: 3, declaracoes: 7, media: 1, regras_com_importante: 0, importante_texto: 0, importante_com_var: 0, outras: {} }],
  populacao: POP_SINT,
  harnesses: ["hx"], sem_preflight: ["hz"],
  avaliados: [
    { harness: "hx", id: "X1", declaracoes: 2, morta: 0, viva: 1, indecidivel: 1 },
    { harness: "hx", id: "X2", declaracoes: 1, morta: 0, viva: 1, indecidivel: 0 }
  ],
  excluidos: [],
  mortas: [],
  indecidiveis: [{ harness: "hx", id: "X1", folha: "a.css", seletor: ".s", propriedade: "color", razao: "gramatica-de-seletor-recusada" }],
  folhas: ["a.css", "b.css"]
};
const VOC_MOTIVO = ["oraculo-de-fonte", "fallback-declarado", "achado-aberto"];
const VOC_RAZAO = ["gramatica-de-seletor-recusada", "combinador-nao-descendente-no-prefixo",
                   "contexto-de-midia-nao-relacionado", "caixa-de-seletor-divergente"];
const EVT_SADIO = { registro: "m.json", condicao: "par passa a existir", harness: "hx", mutante: "X1" };
/* Duas exclusões, uma de cada motivo com cegueira: assim o CONTROLE VERDE de
   C3(d) e C3(e) passa com SUJEITO REAL, e não por vacuidade (lista sem entrada
   do motivo faria a alínea passar sem medir nada). */
const EXC_SADIA = {
  exclusoes: [
    { harness: "hx", mutante: "X2", motivo: "oraculo-de-fonte", gate: "G1",
      propriedade_afirmada: "p", arquivos_lidos: ["z.css"], cegueira: "c" },
    { harness: "hx", mutante: "X1", motivo: "achado-aberto", gate: "G2",
      propriedade_afirmada: "p2", arquivos_lidos: ["w.css"], cegueira: "c2",
      achado_id: "sint-X1", achado_id_alocado: false, achado_id_pendencia: "pend",
      remocao_prevista: "veredito de G2", evento_de_remocao: EVT_SADIO }
  ]
};
const SINT_SADIO = { veredito: "indecidivel", razao: "gramatica-de-seletor-recusada" };
const IND_SADIO = {
  sintetico: { caso: "f", veredito: "indecidivel", razao: "gramatica-de-seletor-recusada" },
  arvore: { contagem: 1 }
};
/* pendência bem-formada: FOI o estado REAL do registro enquanto o EA-32
   (`014-P52-RA8`) esteve aberto — 2026-09-01 → 2026-09-04, fechado pela errata
   E14 com a contagem da árvore fixada por execução. Permanece como cenário
   SINTÉTICO porque o julgador continua a aceitar a forma (é a válvula de C6
   contra o vermelho crônico, EA-5) e o controle verde tem de continuar a
   alcançá-la — julgador que só passa com inteiro não mede a válvula. */
const IND_PEND = {
  sintetico: IND_SADIO.sintetico,
  arvore: { contagem: null, motivo: "achado-aberto", achado_id: "sint-A",
            remocao_prevista: "quando o achado fechar", evento_de_remocao: EVT_SADIO }
};
const CENSO_SADIO = REL_SADIO.censo;
const PARES_SINT = ["hx/X1", "hx/X2"];

/* clona e aplica um defeito pontual */
const mud = (o, f) => { const c = JSON.parse(JSON.stringify(o)); f(c); return c; };

const CONTROLES_VERDES = [
  ["julgarCascata", () => julgarCascata({ a: "morta", b: "morta", c: "viva", d: "viva", e: "viva" })],
  ["julgarVarredura", () => julgarVarredura(REL_SADIO, PREF_SADIO)],
  ["julgarExclusoes", () => julgarExclusoes(EXC_SADIA, POP_SINT, ["hx/X2", "hx/X1"], VOC_MOTIVO, [])],
  ["julgarCobertura", () => julgarCobertura(["u.css", "ui_ux_v32.css", "ui_p50_v32.css"],
                                            ["u.css", "ui_ux_v32.css", "ui_p50_v32.css"], SUBSEQUENCIA_SELADA)],
  ["julgarIndecidiveis", () => julgarIndecidiveis(REL_SADIO, SINT_SADIO, IND_SADIO, VOC_RAZAO, [])],
  ["julgarIndecidiveis/pendência", () => julgarIndecidiveis(REL_SADIO, SINT_SADIO, IND_PEND, VOC_RAZAO, [])],
  ["julgarCenso", () => julgarCenso(CENSO_SADIO, CENSO_SADIO)]
];

const BATERIA = [
  /* ── C1 ── */
  { alinea: "C1(*)", exato: false, colateral: "C1(a), porque o caso sumiu",
    run: () => julgarCascata({ b: "morta", c: "viva", d: "viva", e: "viva" }) },
  { alinea: "C1(a)", exato: true,
    run: () => julgarCascata({ a: "viva", b: "morta", c: "viva", d: "viva", e: "viva" }) },
  { alinea: "C1(b)", exato: true,
    run: () => julgarCascata({ a: "morta", b: "viva", c: "viva", d: "viva", e: "viva" }) },
  { alinea: "C1(c)", exato: true,
    run: () => julgarCascata({ a: "morta", b: "morta", c: "morta", d: "viva", e: "viva" }) },
  { alinea: "C1(d)", exato: true,
    run: () => julgarCascata({ a: "morta", b: "morta", c: "viva", d: "morta", e: "viva" }) },
  { alinea: "C1(e)", exato: true,
    run: () => julgarCascata({ a: "morta", b: "morta", c: "viva", d: "viva", e: "morta" }) },

  /* ── C2 ── */
  { alinea: "C2(pref)", exato: true,
    run: () => julgarVarredura(REL_SADIO, mud(PREF_SADIO, p => { p.erros = ["hx: não respondeu"]; })) },
  { alinea: "C2(pop)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.populacao = []; }), PREF_SADIO) },
  { alinea: "C2(pop)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.sem_preflight = []; }), PREF_SADIO) },
  { alinea: "C2(anc)", exato: true,
    run: () => julgarVarredura(REL_SADIO, mud(PREF_SADIO, p => { delete p.populacao[0].find; })) },
  { alinea: "C2(anc)", exato: true,
    run: () => julgarVarredura(REL_SADIO, mud(PREF_SADIO, p => { p.populacao[0].repl = p.populacao[0].find; })) },
  { alinea: "C2(cen)", exato: false, colateral: "C2(zero), porque mortas=null não é lista vazia",
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.censo_ok = false; r.mortas = null; }), PREF_SADIO) },
  { alinea: "C2(cen)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.censo_ok = false; }), PREF_SADIO) },
  { alinea: "C2(zero)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.mortas = [{ harness: "hx", id: "X1" }]; }), PREF_SADIO) },
  { alinea: "C2(cob)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.avaliados.pop(); }), PREF_SADIO) },
  { alinea: "C2(auto)", exato: true,
    run: () => julgarVarredura(mud(REL_SADIO, r => { r.folhas.push("fixtures_014_regra_morta.js"); }), PREF_SADIO) },
  /* o estado do RED: instrumento ausente. As alíneas dependentes do relatório
     caem NOMEADAS, e as independentes (pref/anc) continuam medindo — é a prova
     de que o vermelho desta suíte não colapsa estados. */
  { alinea: "C2(zero)", exato: false, colateral: "C2(pop)/C2(cen)/C2(cob)/C2(auto), todas nomeadas como não medidas",
    run: () => julgarVarredura(null, PREF_SADIO) },

  /* ── C3 ── */
  { alinea: "C3(*)", exato: true,
    run: () => julgarExclusoes(EXC_SADIA, POP_SINT, ["hx/X1"], VOC_MOTIVO, []) },
  { alinea: "C3(a)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { r.exclusoes[0].motivo = "porque o oráculo é de fonte"; }),
                               POP_SINT, PARES_SINT, VOC_MOTIVO, []) },
  { alinea: "C3(b)", exato: false, colateral: "C3(c), porque curinga por definição não resolve no preflight",
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { r.exclusoes[0].mutante = "X*"; }),
                               POP_SINT, ["hx/X*", "hx/X1"], VOC_MOTIVO, []) },
  { alinea: "C3(c)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { r.exclusoes[0].mutante = "X999"; }),
                               POP_SINT, ["hx/X999", "hx/X1"], VOC_MOTIVO, []) },
  { alinea: "C3(d)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { delete r.exclusoes[0].cegueira; }),
                               POP_SINT, PARES_SINT, VOC_MOTIVO, []) },
  { alinea: "C3(d)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { r.exclusoes[0].arquivos_lidos = []; }),
                               POP_SINT, PARES_SINT, VOC_MOTIVO, []) },
  /* C3(e) · marcador silencioso: `achado_id_alocado: false` sem a pendência
     escrita. É o caso que a 014 vive de verdade — id de backlog depende da
     `develop`, invisível à worktree de feature. */
  { alinea: "C3(e)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { delete r.exclusoes[1].achado_id_pendencia; }),
                               POP_SINT, PARES_SINT, VOC_MOTIVO, []) },
  { alinea: "C3(e)", exato: true,
    run: () => julgarExclusoes(mud(EXC_SADIA, r => { delete r.exclusoes[1].evento_de_remocao; }),
                               POP_SINT, PARES_SINT, VOC_MOTIVO, []) },
  /* C3(e) · PRAZO VENCIDO: o par declarado no evento passa a existir na matriz
     e a exceção continua lá. É a cláusula que separa prazo de intenção. */
  { alinea: "C3(e)", exato: true,
    run: () => julgarExclusoes(EXC_SADIA, POP_SINT, PARES_SINT, VOC_MOTIVO,
                               [{ mutante: "X1", harness: "hx (t.js)" }]) },

  /* ── C5 ── */
  { alinea: "C5(*)", exato: false, colateral: "C5(spec), porque lista vazia não contém a subsequência",
    run: () => julgarCobertura([], [], SUBSEQUENCIA_SELADA) },
  { alinea: "C5(lista)", exato: false, colateral: "C5(ordem), porque a sequência também deixa de casar",
    run: () => julgarCobertura(["ui_ux_v32.css", "ui_p50_v32.css"],
                               ["ui_ux_v32.css", "ui_p50_v32.css", "nova.css"], SUBSEQUENCIA_SELADA) },
  /* a troca é FORA do par selado: se o defeito injetado invertesse ux×p50, ele
     derrubaria C5(spec) junto e a partição ficaria borrada — foi a própria
     bateria que pegou isso na primeira execução. */
  { alinea: "C5(ordem)", exato: true,
    run: () => julgarCobertura(["ui_ux_v32.css", "ui_p50_v32.css", "z.css"],
                               ["ui_ux_v32.css", "z.css", "ui_p50_v32.css"], SUBSEQUENCIA_SELADA) },
  { alinea: "C5(spec)", exato: true,
    run: () => julgarCobertura(["ui_p50_v32.css", "ui_ux_v32.css"],
                               ["ui_p50_v32.css", "ui_ux_v32.css"], SUBSEQUENCIA_SELADA) },

  /* ── C6 ── */
  { alinea: "C6(sint)", exato: false, colateral: "C6(cont-sint), porque o veredito pinado também deixa de casar",
    run: () => julgarIndecidiveis(REL_SADIO, { veredito: "viva" }, IND_SADIO, VOC_RAZAO, []) },
  { alinea: "C6(nome)", exato: true,
    run: () => julgarIndecidiveis(mud(REL_SADIO, r => { delete r.indecidiveis[0].razao; }),
                                  SINT_SADIO, IND_SADIO, VOC_RAZAO, []) },
  { alinea: "C6(cons)", exato: true,
    run: () => julgarIndecidiveis(mud(REL_SADIO, r => { r.avaliados[0].declaracoes = 3; }),
                                  SINT_SADIO, IND_SADIO, VOC_RAZAO, []) },
  { alinea: "C6(cons)", exato: false, colateral: "C6(cont-arvore), porque a lista encolhe e a contagem pinada deixa de casar",
    run: () => julgarIndecidiveis(mud(REL_SADIO, r => { r.indecidiveis = []; }),
                                  SINT_SADIO, IND_SADIO, VOC_RAZAO, []) },
  /* C6(cont-sint) · O ESTADO DE FALHA EXCLUSIVO desta alínea: veredito CERTO,
     razão ERRADA. Nenhuma outra alínea da suíte o pega — C6(sint) só olha o
     veredito, e C1 nem chega ao caso (f). */
  { alinea: "C6(cont-sint)", exato: true,
    run: () => julgarIndecidiveis(REL_SADIO,
                                  { veredito: "indecidivel", razao: "contexto-de-midia-nao-relacionado" },
                                  IND_SADIO, VOC_RAZAO, []) },
  { alinea: "C6(cont-sint)", exato: true,
    run: () => julgarIndecidiveis(REL_SADIO, SINT_SADIO,
                                  { sintetico: null, arvore: { contagem: 1 } }, VOC_RAZAO, []) },
  /* C6(cont-arvore) · inteiro que não casa */
  { alinea: "C6(cont-arvore)", exato: true,
    run: () => julgarIndecidiveis(REL_SADIO, SINT_SADIO,
                                  { sintetico: IND_SADIO.sintetico, arvore: { contagem: 5 } },
                                  VOC_RAZAO, []) },
  /* C6(cont-arvore) · `null` SECO: sem motivo, sem id, sem prazo. É o que
     separa "pendência declarada" de "esquecimento". */
  { alinea: "C6(cont-arvore)", exato: true,
    run: () => julgarIndecidiveis(REL_SADIO, SINT_SADIO,
                                  { sintetico: IND_SADIO.sintetico, arvore: { contagem: null } },
                                  VOC_RAZAO, []) },
  /* C6(cont-arvore) · PRAZO VENCIDO: o evento ocorreu e a contagem continua nula. */
  { alinea: "C6(cont-arvore)", exato: true,
    run: () => julgarIndecidiveis(REL_SADIO, SINT_SADIO, IND_PEND, VOC_RAZAO,
                                  [{ mutante: "X1", harness: "hx (t.js)" }]) },

  /* ── E6 ── */
  { alinea: "CEN(folhas)", exato: true,
    run: () => julgarCenso(CENSO_SADIO.concat([{ folha: "extra.css", regras: 1, declaracoes: 1, media: 0, regras_com_importante: 0, importante_texto: 0, importante_com_var: 0, outras: {} }]), CENSO_SADIO) },
  { alinea: "CEN(valores)", exato: true,
    run: () => julgarCenso(mud(CENSO_SADIO, c => { c[0].regras = 999; }), CENSO_SADIO) },
  { alinea: "CEN(valores)", exato: true,
    run: () => julgarCenso(mud(CENSO_SADIO, c => { c[0].importante_com_var = 1; }), CENSO_SADIO) },
  { alinea: "CEN(valores)", exato: true,
    run: () => julgarCenso(mud(CENSO_SADIO, c => { c[0].outras = { CSSPageRule: 1 }; }), CENSO_SADIO) },
  /* o defeito REAL desta demanda: contador que lê zero, com pin rebaixado para
     caber no verde. CEN(valores) passa (iguais); CEN(nao-vac) não. */
  { alinea: "CEN(nao-vac)", exato: true,
    run: () => { const z = mud(CENSO_SADIO, c => { c[0].regras = 0; c[0].declaracoes = 0; });
                 return julgarCenso(z, z); } }
];

/* Censo DECLARADO das alíneas desta suíte, para que a própria D014-DISC1 não
   possa passar vacuosamente: com `CONTROLES_VERDES` vazio, `todas` sairia vazio
   e a checagem de cobertura passaria sem medir nada. Quebra por alínea:
   C1 6 (*,a..e) · C2 7 (pref,pop,anc,cen,zero,cob,auto) · C3 6 (*,a..e) ·
   C5 4 (*,lista,ordem,spec) · C6 5 (sint,nome,cons,cont-sint,cont-arvore) ·
   CEN 3 (folhas,valores,nao-vac). Alínea nova exige entrada na bateria E bump
   aqui — é a forçante de propósito. Wave 5 (erratas E7/E9): C3 ganhou (e) e
   C6(cont) virou dois prazos, 29 → 31. Os CONTROLES são 7 e não 6 porque
   `julgarIndecidiveis` tem DOIS estados verdes legítimos — contagem fixada e
   pendência bem-formada — e um controle que só alcançasse o primeiro deixaria
   a rota da pendência sem prova de que ela pode passar. */
const JULGADORES_ESPERADOS = 7;
const ALINEAS_ESPERADAS = 31;

T("D014-DISC1", "poder discriminante: toda alínea desta suíte tem estado alcançável de falha (bateria negativa) e estado alcançável de passagem (controle verde)", () => {
  const problemas = [];

  if (CONTROLES_VERDES.length !== JULGADORES_ESPERADOS)
    problemas.push("controles verdes: " + CONTROLES_VERDES.length + " ≠ " + JULGADORES_ESPERADOS +
      " declarados — sem controle verde a checagem de cobertura passa sem medir nada");

  CONTROLES_VERDES.forEach(([nome, run]) => {
    let r; try { r = run(); } catch (e) { problemas.push("controle verde " + nome + " estourou: " + (e && e.message)); return; }
    const ruins = r.filter(a => !a.ok);
    if (ruins.length)
      problemas.push("controle verde " + nome + " reprovou " + ruins.length +
        " alínea(s) com entrada correta: " + ruins.map(a => a.alinea).join(", ") +
        " — julgador constante-vermelho passa por julgador correto");
  });

  const cobertas = new Set();
  BATERIA.forEach((caso, i) => {
    let r;
    try { r = caso.run(); }
    catch (e) { problemas.push("bateria[" + i + "] " + caso.alinea + " estourou antes de julgar: " + (e && e.message)); return; }
    const ruins = r.filter(a => !a.ok).map(a => a.alinea);
    if (ruins.indexOf(caso.alinea) < 0) {
      problemas.push("bateria[" + i + "]: a alínea " + caso.alinea +
        " NÃO reprovou com o defeito injetado (reprovaram: " + JSON.stringify(ruins) +
        ") — alínea que não pode falhar não mede nada");
      return;
    }
    if (caso.exato && ruins.length !== 1)
      problemas.push("bateria[" + i + "]: esperado APENAS " + caso.alinea +
        ", reprovaram " + JSON.stringify(ruins) + " — a partição das alíneas está borrada");
    cobertas.add(caso.alinea);
  });

  /* toda alínea produzida por algum julgador precisa aparecer na bateria:
     alínea sem entrada é alínea sem prova de falsificabilidade. */
  const todas = new Set();
  CONTROLES_VERDES.forEach(([, run]) => { try { run().forEach(a => todas.add(a.alinea)); } catch (e) { void e; } });
  const semBateria = [...todas].filter(a => !cobertas.has(a));
  if (semBateria.length)
    problemas.push("alínea(s) sem entrada na bateria negativa: " + JSON.stringify(semBateria) +
      " — cada alínea precisa de um estado alcançável de falha, nomeado");
  if (todas.size !== ALINEAS_ESPERADAS)
    problemas.push("censo de alíneas: " + todas.size + " ≠ " + ALINEAS_ESPERADAS +
      " declaradas no cabeçalho de D014-DISC1 — alínea que nasce sem entrar no censo " +
      "nasce sem prova de falsificabilidade");

  if (problemas.length) throw new Error(problemas.join("\n"));
  console.log("      controle verde: " + CONTROLES_VERDES.length + " julgador(es) · bateria: " +
    BATERIA.length + " caso(s) · alíneas cobertas: " + cobertas.size);
});

/* ============================== resumo ============================== */
const pass = results.filter(r => r.ok).length;
const fail = results.length - pass;
if (INSTRUMENTO_ERRO) console.log("\n[NÃO EXECUTADO, NOMEADO] " + INSTRUMENTO_ERRO);
console.log("\nD014 REGRA MORTA: " + pass + " PASS · " + fail + " FAIL de " + results.length);
process.exit(fail ? 1 : 0);
