/* ============================================================================
   FIXTURES D010 — DEMANDA 010 · recomendação sem vão
   Namespace fechado D010-F*. Locais à demanda: `fixtures_p52.js` e
   `fixtures_p50.js` são artefatos de outra fase e NÃO são alterados
   (spec §"Critérios de aceite → gates", bloco "Fixtures"). Este arquivo é
   fixture, não suíte: não entra em `expected_suites.json` e não imprime
   PASS/FAIL — quem julga são os gates de `tests_010_vao.js`.

   Existem porque nenhuma fixture 5.0/5.2/D009 alcança os cinco estados que a
   demanda precisa exercitar:
     · D010-F1  — o VÃO canônico: contexto declarado, nenhuma capability
                  declarada, e a Camada 1 congelada oculta sem substituto;
     · D010-F1b — o mesmo vão no ramo `!hasPrio` ("Como a Fortinet pode apoiar
                  agora"), que é outro título e outro bloco contíguo;
     · D010-F2  — o par de C8: HÁ substituto (whitespace com candidatos DIRECT)
                  convivendo com práticas-alvo sem contexto;
     · D010-F3  — gate de suficiência FECHADO, com um alvo em S2 de contexto e
                  `MAP` não vazio que só NÃO publica por causa do gate (emenda
                  final de 2026-08-30, errata E5);
     · D010-F4  — o vão SERVIDO (emenda de 2026-08-30): duas capabilities-alvo
                  que recebem SERVIÇO por `hasGap` e ZERO candidatos, uma delas
                  carregando a colisão de identidade do catálogo congelado.

   ==========================================================================
   OWNERS CANÔNICOS — a regra que este arquivo não quebra
   ==========================================================================
   Todo estado é aplicado pelos owners reais do runtime:
     · respostas    -> `__DEV.setAnswerById` (via `FX50.p50ApplyVec`)
     · prioridades  -> `__DEV.setPriorities`
     · alvos        -> `__DEV.setTarget`     (via `FX50.p50ApplyTargets`)
     · contexto     -> EDITOR de contexto (`#v32cta` → selects → `#v32save`)
   NENHUM derivado é escrito à mão. Em particular, o eixo de PRESENCE desta
   demanda NÃO usa `FX50.p50ApplyPresence()` — que grava direto em
   `V32.TECH_LANDSCAPE` —, e sim o editor com o save transacional, que é o
   único caminho que passa por `validateConfigV32()` e pela invariante M43.
   Se o save for recusado, o erro aparece AQUI (`#v32errors` visível), nunca
   silenciosamente dentro de um gate.

   Leitura de estado canônico é outra coisa: `MAP`, `PRODUCTS` e `ans` são
   `const` de escopo de script no HTML congelado — não existem em `window`
   (medido: `typeof w.MAP === "undefined"`, `w.eval("typeof MAP") === "object"`).
   O único acesso é `window.eval`, e ele é de LEITURA. Está isolado em
   `d010Eval()` para que o custo apareça em um lugar só.

   ==========================================================================
   POR QUE O VETOR É O QUE É
   ==========================================================================
   15 respostas confirmadas ⇒ suficiência ABERTA (`confirmed>=10` e `n>=2` por
   domínio). Nível 0 nos quatro qids de gap (`automation`, `endpoint`,
   `network-visibility`, `external-surface`) porque é onde a demanda mede: são
   os quatro alvos, todos em S2, todos com `MAP[qid].lv[0].c` não vazio.
   Os 11 demais ficam em 2: no nível 2 nenhuma pergunta pontua severidade, logo
   não há gap, logo o engine não anexa serviço por `hasGap` — e as quatro
   práticas medidas ficam sozinhas no palco. O plano registra que o veredito de
   arbitragem é o mesmo com 2, 1 ou 0; conferido por execução nesta tarefa
   (ver `D010_VACUIDADES_CONHECIDAS`, que também registra o que 1/0 mudariam).

   ==========================================================================
   EMENDA DE 2026-08-30 — POR QUE FIXTURE NOVA, E NÃO EMENDA NAS EXISTENTES
   ==========================================================================
   A T002 mediu quatro vacuidades. Duas delas (C8·CARD2 (b) e C10·CARD4 (c))
   eram vacuidades de FIXTURE: o critério é mensurável, só que nenhum estado
   alcançado o exercitava. Esta emenda fecha as duas.

   O acréscimo NÃO cabe dentro de D010-F1/F1b/F2, e isso é medido, não opinião:
   pôr `vulnerability-management` e `monitoring-coverage` no nível 0 muda o
   VETOR, e com ele mudam valores já declarados de D010-F1 — `basePresented`
   passa de 4 para 6 capabilities e `baseInV32Base` de 2 para 4. Emendar F1
   reescreveria asserções que já vigoram; a instrução é o contrário disso.
   Logo: fixture nova, e F1, F1b e F2 continuam com os MESMOS valores
   declarados — conferido byte a byte a cada emenda desta série.

   D010-F3 é a exceção decidida, e por uma razão que não vale para as outras:
   dela só pendem dois critérios, e o censo de um deles (`D010-ARB3` (c)) é da
   Camada 1, que não muda por card V3.2 novo. Ela recebeu a emenda final de
   2026-08-30 (errata E5) porque `D010-CARD3` (b) era verdadeiro por ESTADO e
   não por GATE — ver o cabeçalho de D010-F3, com o custo medido campo a campo.

   Os dois estados novos moram na MESMA fixture porque foi medido que NÃO
   interferem um no outro: com os dois alvos juntos, o contexto de
   `vulnerability-management` (CONTEXT_NOT_INFORMED/LEGACY-LABELLED, zero
   candidatos, serviço `vulnerability-assessment`, `gap-high`) é idêntico ao
   que ele tem sozinho, e o mesmo vale para `continuous-monitoring`. Juntá-los
   ainda paga um bônus adversarial: o cartão de `vulnerability-management` é o
   CONTROLE do cartão de `monitoring-coverage` — tem serviço e nó do `MAP` sem
   nenhuma colisão de nome, de modo que um mutante que deduplique DEMAIS morre
   no mesmo runtime em que um que deduplique de MENOS morre.

   Níveis escolhidos por poder discriminante, não por conveniência:
     · `vulnerability-management` resposta 0, ALVO 1 — `lv[1].c` = [FortiRecon]
       é SUBCONJUNTO ESTRITO de `lv[0].c` = [FortiRecon, FortiEndpoint]. Um
       mutante INV-5 (ler o nível-alvo em vez do atual) devolve aqui uma lista
       PARCIAL e não vazia: some FortiEndpoint e sobra FortiRecon. Nenhuma
       fixture anterior tem essa forma — em D010-F1 o par de `automation` é
       superconjunto (`lv[1]` ⊋ `lv[0]`), que é mais fácil de ver.
     · `monitoring-coverage` resposta 0, ALVO 2 — `lv[1].c` é IDÊNTICO a
       `lv[0].c` neste qid; um alvo em 1 tornaria o mutante INV-5 INVISÍVEL
       justamente no cartão da colisão, isto é, eu estaria criando a vacuidade
       que vim fechar. Com alvo 2, `lv[2].c` é vazio e o mutante apaga o nó.
     · `monitoring-coverage` resposta 0 e não 1 — medido: em 1 a maturidade cai
       para `gap-moderate` e o censo de títulos congelados GANHA uma segunda
       entrada ("Pode fazer sentido — após validação"). Em 0 o censo de D010-F4
       é idêntico ao de D010-F1, e a diferença F1→F4 fica atribuível apenas aos
       dois alvos novos.
   ========================================================================== */
"use strict";

const FX50 = require("./fixtures_p50.js");

const N = FX50.P50_QIDS.length;
const K = qid => {
  const k = FX50.P50_QIDS.indexOf(qid);
  if (k < 0) throw new Error("fixtures_010: qid fora do question bank canônico: " + qid);
  return k;
};

/* Os quatro qids de gap da demanda — a lista existe uma vez só. */
const D010_GAP_QIDS = ["automation", "endpoint", "network-visibility", "external-surface"];

/* Vetor do vão: 15 confirmadas, nível 0 nos quatro qids de gap, 2 nos demais. */
function d010VecVao(extra) {
  const v = new Array(N).fill(2);
  D010_GAP_QIDS.forEach(q => { v[K(q)] = 0; });
  if (extra) Object.keys(extra).forEach(q => { v[K(q)] = extra[q]; });
  return v;
}

/* Alvos dos quatro qids. Os níveis NÃO são decorativos:
     · `automation` vai a 1 porque `MAP.automation.lv[1].c` (FortiSOAR+FortiXDR)
       DIFERE de `lv[0].c` (FortiSOAR) — é o único dos quatro em que ler o
       nível-alvo em vez do atual (INV-5) produz uma lista errada e NÃO VAZIA,
       isto é, com os itens do nível errado nomeados;
     · os outros três vão a 2, onde `lv[2]` não tem `.c` — ler o nível-alvo ali
       apaga o nó. As duas formas de falha ficam disponíveis na mesma fixture. */
const D010_ALVOS_VAO = { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 };

/* ---------------------------------------------------------------------------
   D010-F1 · o vão canônico (estado do relatório do cliente, P10)
   15 confirmadas · nível 0 nos quatro qids de gap · landscape 100% UNSET ·
   ÚNICA declaração de contexto: `saasAllowed = "yes"` — que tira do modo
   legado (`engine_v32.js:305-311`) sem anexar candidato nem serviço a
   capability alguma. Prioridades em `automation` e `endpoint`; alvo nos quatro.
   Resultado medido: `isLegacyModeV32() === false`, "há substituto" = false, os
   quatro alvos em S2 com zero itens do engine — e a Camada 1 congelada oculta.
--------------------------------------------------------------------------- */
const D010_F1 = {
  id: "D010-F1",
  name: "vão canônico · contexto declarado, nada declarado, zero substituto",
  vec: d010VecVao(),
  arch: { saasAllowed: "yes" },
  priorities: ["automation", "endpoint"],
  targets: D010_ALVOS_VAO,
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F1b · o mesmo vão sem prioridades
   Exercita o ramo `!hasPrio` do render congelado: o título passa a ser "Como a
   Fortinet pode apoiar agora" e o bloco contíguo é `apoioAgora`. Sem esta
   fixture, o ramo sem prioridades da arbitragem fica sem medição (C4).
   Efeito colateral medido e declarado: sem prioridades, `buildSupportHTML` não
   desvia capability alguma para `#v32prio`, e as QUATRO capabilities de
   apresentação `base` caem em `#v32base` (contra DUAS sob D010-F1).
--------------------------------------------------------------------------- */
const D010_F1b = {
  id: "D010-F1b",
  name: "vão sem prioridades · ramo !hasPrio",
  vec: d010VecVao(),
  arch: { saasAllowed: "yes" },
  targets: D010_ALVOS_VAO,
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F2 · substituto presente
   D010-F1 + `security-analytics` declarada NONE pelo editor + `logs` no nível
   0 + alvo em `logs`.

   ERRATA DE 2026-08-30 (spec, §Fixtures), reconferida por execução aqui: o
   nível de `logs` é PARTE do estado, não detalhe. Com `logs` em 2 a capability
   sai em `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com ZERO candidatos, e a
   fixture deixa de ser "substituto presente". Com `logs` em 0:
   `TECHNOLOGY_WHITESPACE`/`DIRECT` com `fortianalyzer`, `fortisiem` e
   `fortisiem-cloud` — medido, não inferido.
--------------------------------------------------------------------------- */
const D010_F2 = {
  id: "D010-F2",
  name: "substituto presente · whitespace com candidatos DIRECT",
  vec: d010VecVao({ "logs": 0 }),
  arch: { saasAllowed: "yes" },
  priorities: ["automation", "endpoint"],
  presence: { "security-analytics": "NONE" },
  targets: Object.assign({}, D010_ALVOS_VAO, { "logs": 2 }),
  landscape: "MIXED",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F3 · gate de suficiência FECHADO
   Vetor de `P50-F2` (4 confirmadas + 1 "NA") ACRESCIDO de
   `vulnerability-management` = 0 ⇒ 5 confirmadas, e `5 < 10` mantém
   `suff === false`. Mais `saasAllowed = "yes"` e DOIS alvos.

   ==========================================================================
   EMENDA DE 2026-08-30 (errata da spec, E5) — o vetor TINHA de ganhar resposta
   ==========================================================================
   T002 mediu que nenhum alvo legítimo do vetor original estava em estado de
   CONTEXTO S2 com `MAP` não vazio: `mandate`/`governance`/`team-capacity`
   pertencem a capabilities com `landscapeEnabled:false` (S4), `logs` está em
   nível 3 com `MAP.lv[3].c` vazio e o alvo seria removido por
   `revalidateTargets`, e `incident-response` é "NA". Logo `D010-CARD3` (b) —
   "zero `[data-ux-enablers=a-validar]` sob gate fechado" — era verdadeiro por
   ESTADO e não por GATE: não havia nada que o gate pudesse estar impedindo.
   Não há atalho pelos qids já confirmados; o vetor tem de ganhar uma resposta.

   `vulnerability-management` = 0 é a resposta que serve, e o CUSTO foi medido
   por execução aqui (previsão do `tech-lead` conferida, não presumida):
     · `confirmedCount()` 4 → 5, `suff` FALSE e
       `tgtComparisonPublishable(tgtCurrentProfile())` FALSE — o gate continua
       FECHADO, que é a razão de ser desta fixture;
     · EXATAMENTE UMA capability muda em todo o render: `vulnerability-management`
       sai de `card` (`NEEDS_VALIDATION`/`VALIDATE`, payload zero) e entra em
       apresentação `base` (`CONTEXT_NOT_INFORMED`/`LEGACY-LABELLED`, serviço
       `vulnerability-assessment`, `gap-high`). As outras 11 saem idênticas,
       campo a campo;
     · ZERO cards novos — `cardsSemPayload` vai de 10 para 9, nunca para 11 —,
       logo "há substituto" continua FALSE e a Camada 1 continua sem substituto;
     · o censo de títulos congelados não se move.

   O ALVO VAI A 1, e o nível não é decorativo. `D010-CARD3` (c) mede o
   DIFERENCIAL entre fixtures: o mesmo par (qid, nível confirmado) publica o nó
   sob D010-F4 (gate ABERTO) e não publica aqui (gate FECHADO), "com todas as
   demais condições de C7 idênticas nas duas". Medido: com alvo 1, as duas
   metades coincidem em 16 campos — nível confirmado, alvo, estado de payload,
   estado de contexto, `MAP` no nível atual e no nível alvo, classificação,
   supportMode, candidatos, serviços, notas, maturidade, apresentação,
   `landscapeEnabled`, presence e chips — e divergem SÓ no gate (5 × 15
   confirmadas, `suff` false × true, publicável false × true). Com alvo 2,
   `MAP.lv[2].c` é vazio e o nível do alvo viraria uma SEGUNDA diferença: o
   diferencial deixaria de isolar o gate, que é a única coisa que ele mede.

   `team-capacity` PERMANECE como segundo alvo. Ele é o alvo em S4 cujo `MAP` no
   nível atual é não vazio ([SOCaaS, FortiGuard-MDR-Service]) e cuja capability
   recebe serviço por `hasGap` — é ele que põe o chip "FortiGuard SOCaaS" na tela
   SOB GATE FECHADO, que é o contraste do enunciado de C9 ("mesmo que a Camada 1
   nomeie produto nesse estado"). Tirá-lo removeria esse contraste e moveria
   valores já declarados sem que critério algum peça.
--------------------------------------------------------------------------- */
const D010_F3_VEC = (() => {
  const v = FX50.P50_F2.vec.slice();
  v[K("vulnerability-management")] = 0;
  return v;
})();

const D010_F3 = {
  id: "D010-F3",
  name: "gate de suficiência FECHADO · alvo em S2 que só não publica por causa do gate",
  vec: D010_F3_VEC,
  arch: { saasAllowed: "yes" },
  targets: { "team-capacity": 2, "vulnerability-management": 1 },
  landscape: "UNSET",
  screen: "results"
};

/* ---------------------------------------------------------------------------
   D010-F4 · o vão SERVIDO (emenda de 2026-08-30)
   D010-F1 + dois qids novos no nível 0 (`vulnerability-management` e
   `monitoring-coverage`) e alvo em cada um. O engine anexa serviço por
   `hasGap` às duas capabilities correspondentes, e NENHUM candidato: é o
   estado que C8·`D010-CARD2` (b) exige — "capability-alvo que recebe serviço
   e continua em S2 de contexto" — e que nenhuma das quatro fixtures anteriores
   alcançava.

   O vão continua sendo vão: medido `isLegacyModeV32() === false`,
   `suff === true` e "há substituto" === FALSE. Serviço anexado não vira
   substituto porque a classificação com presence UNSET é CONTEXT_NOT_INFORMED,
   cuja apresentação é `base` e nunca `card` — que é a mesma cláusula que A5
   deixou provada como redundante no predicado.

   `monitoring-coverage` carrega a COLISÃO DE IDENTIDADE de C10·`D010-CARD4`
   (c). Medido no catálogo congelado, sem inferir por semelhança de nome:
     · `SERVICES["fortiguard-socaas"].name` === `PRODUCTS["SOCaaS"].n`
       === "FortiGuard SOCaaS" — ids diferentes, MESMO nome renderizado;
     · o serviço `fortiguard-socaas` está ANEXADO a `continuous-monitoring` e
       já emite `data-eid="fortiguard-socaas"` no cartão-alvo
       (`ui_target_v32.js:262`), ANTES de T008 existir;
     · `MAP["monitoring-coverage"].lv[0].c` = [SOCaaS, FortiGuard-MDR-Service]
       — o nó que T008 publica traz `SOCaaS`, homônimo do chip já presente.
   O par de CONTROLE mora no mesmo nó: `FortiGuard-MDR-Service` também tem
   homônimo no catálogo (`fortiguard-mdr`, "FortiGuard MDR"), mas esse serviço
   NÃO está anexado aqui. Deduplicar contra a tabela de equivalência sem olhar
   o que está de fato anexado apaga "FortiGuard MDR" do nó — e é assim que o
   cenário mata o mutante que deduplica demais, não só o que deduplica de
   menos. Os dois pares acima são a tabela INTEIRA: ver `D010_EQUIVALENCIA_NOME`.

   `vulnerability-management` é o contrapeso sem colisão: serviço
   `vulnerability-assessment` ("Vulnerability Assessment") e nó do `MAP` com
   [FortiRecon, FortiEndpoint] — nenhum nome em comum. Um mutante que
   deduplique por qualquer critério largo mexe aqui e é visto.
--------------------------------------------------------------------------- */
const D010_ALVOS_SERVICO = { "vulnerability-management": 1, "monitoring-coverage": 2 };

const D010_F4 = {
  id: "D010-F4",
  name: "vão servido · alvos com serviço por hasGap e a colisão de identidade",
  vec: d010VecVao({ "vulnerability-management": 0, "monitoring-coverage": 0 }),
  arch: { saasAllowed: "yes" },
  priorities: ["automation", "endpoint"],
  targets: Object.assign({}, D010_ALVOS_VAO, D010_ALVOS_SERVICO),
  landscape: "UNSET",
  screen: "results"
};

const D010_FIXTURES = { "D010-F1": D010_F1, "D010-F1b": D010_F1b, "D010-F2": D010_F2,
                        "D010-F3": D010_F3, "D010-F4": D010_F4 };

/* ===================== aplicação sobre o runtime real ===================== */

/* Declara o contexto pelo EDITOR canônico: abre por `#v32cta`, mexe nos mesmos
   controles que o facilitador mexe e grava por `#v32save`. Cada passo falha
   ALTO se o controle não existir — controle ausente significa que a fixture
   deixou de alcançar a superfície, e isso não pode virar um gate vacuoso. */
function d010ApplyContext(w, d, fx) {
  if (!fx.presence && !fx.arch) return;
  const cta = d.querySelector("#v32cta");
  if (!cta) throw new Error(fx.id + ": #v32cta ausente — editor de contexto inalcançável");
  cta.click();
  if (fx.presence) Object.keys(fx.presence).forEach(capId => {
    const sel = d.getElementById("v32-pres-" + capId);
    if (!sel) throw new Error(fx.id + ": select de presence ausente para " + capId);
    sel.value = fx.presence[capId];
    /* `onchange` relê o rascunho e REPINTA o editor: qualquer referência a nó
       do editor obtida antes desta linha fica obsoleta. Por isso os campos de
       arquitetura são lidos do DOM depois, nunca antes. */
    sel.dispatchEvent(new w.Event("change", { bubbles: true }));
  });
  if (fx.arch) Object.keys(fx.arch).forEach(k => {
    const sel = d.getElementById("v32-arch-" + k);
    if (!sel) throw new Error(fx.id + ": select de arquitetura ausente para " + k);
    sel.value = fx.arch[k];
  });
  const save = d.querySelector("#v32save");
  if (!save) throw new Error(fx.id + ": #v32save ausente — save transacional inalcançável");
  save.click();
  const box = d.querySelector("#v32errors");
  if (box && !box.classList.contains("v32-hidden"))
    throw new Error(fx.id + ": save recusado por validateConfigV32 — " + (box.textContent || "").replace(/\s+/g, " ").trim());
}

/* Aplica vetor + prioridades + alvos + contexto e alcança a tela de resultados
   pelos owners canônicos. Não escreve derivado algum e não toca em suficiência.
   O segundo `showResults()` existe porque o save só repinta o painel V3.2: o
   render completo é a rota que o usuário percorre e a que os gates observam. */
function d010ApplyResults(w, d, fx) {
  w.__DEV.setArq(0);
  FX50.p50ApplyVec(w, fx.vec, fx.notes);
  if (fx.priorities) w.__DEV.setPriorities(fx.priorities);
  FX50.p50ApplyTargets(w, fx.targets);
  w.__DEV.showResults();
  d010ApplyContext(w, d, fx);
  w.__DEV.showResults();
  return fx;
}

/* ==================== leitura de estado de escopo de script ================ */

/* `MAP`, `PRODUCTS` e `ans` são `const` de topo de script clássico: existem no
   registro declarativo global, não em `window`. `window.eval` é indireto e
   roda no escopo global, então enxerga os três. É LEITURA — nenhum estado é
   aplicado por aqui. Isolado para que o custo seja auditável em um lugar só. */
function d010Eval(w, expr) {
  if (typeof w.eval !== "function") throw new Error("d010Eval: window.eval indisponível neste runtime");
  return w.eval(expr);
}
function d010RequireMap(w) {
  const t = d010Eval(w, "typeof MAP");
  if (t !== "object") throw new Error("d010RequireMap: MAP inalcançável (typeof " + t + ") — catálogo congelado ausente");
}
/* Vetor de respostas corrente, lido do owner canônico. */
function d010Answers(w) { return JSON.parse(d010Eval(w, "JSON.stringify(ans)")); }

/* O VEREDITO DE SUFICIÊNCIA, lido das duas funções canônicas do runtime
   congelado — as MESMAS que o card consome (`ui_target_v32.js:116`). Nenhuma
   das duas está em `window.__DEV`: o bloco exportado por `ui_target_v32.js`
   termina em `tgtCurrentProfile`, e `confirmedCount` é função de topo de script
   do HTML. Reimplementá-las aqui tornaria a asserção equivalente por construção
   — é exatamente o defeito que a errata E5 tirou de C9 (c) —, e criar bridge
   nova exigiria editar arquivo `frozen` (R-3). Sobra a leitura por `d010Eval`,
   com falha ALTA se a função sumir: função ausente não vira "não medi". */
function d010ConfirmedCount(w) {
  const t = d010Eval(w, "typeof confirmedCount");
  if (t !== "function") throw new Error("d010ConfirmedCount: confirmedCount inalcançável (typeof " + t + ")");
  return d010Eval(w, "confirmedCount()");
}
function d010ComparisonPublishable(w) {
  const t = d010Eval(w, "typeof tgtComparisonPublishable");
  if (t !== "function")
    throw new Error("d010ComparisonPublishable: tgtComparisonPublishable inalcançável (typeof " + t + ")");
  return d010Eval(w, "tgtComparisonPublishable(tgtCurrentProfile())");
}
/* `MAP[qid].lv[nivel].c` mapeado para as chaves de produto (`c.p`). Nível não
   numérico ("NA"/null) devolve lista vazia — é a propriedade que C7 (d) usa. */
function d010MapItems(w, qid, nivel) {
  d010RequireMap(w);
  if (typeof nivel !== "number") return [];
  const q = JSON.stringify(qid), l = JSON.stringify(nivel);
  return JSON.parse(d010Eval(w,
    "JSON.stringify((((MAP[" + q + "] || {lv:[]}).lv[" + l + "] || {}).c || []).map(function(x){return x.p;}))"));
}
/* Chaves distintas de `c.p` em todo o `MAP`, na ordem alfabética. São as 11 que
   a tabela de equivalência de C10 tem de cobrir — derivadas do catálogo
   congelado, nunca da tabela do produto. */
function d010MapKeys(w) {
  d010RequireMap(w);
  return JSON.parse(d010Eval(w,
    "JSON.stringify(Object.keys(MAP).reduce(function(acc,q){(MAP[q].lv||[]).forEach(function(l){(l.c||[]).forEach(function(x){if(acc.indexOf(x.p)<0)acc.push(x.p);});});return acc;},[]).sort())"));
}

/* Nome RENDERIZADO de uma chave de produto do `MAP` (`PRODUCTS[chave].n`) e de
   um serviço do catálogo (`SERVICES[id].name`). São os dois lados da colisão de
   identidade de C10 e vivem em registros diferentes: `PRODUCTS` é `const` de
   escopo de script (só por `d010Eval`), `SERVICES` está em `__DEV.V32`. */
function d010ProductName(w, chave) {
  return JSON.parse(d010Eval(w, "JSON.stringify((PRODUCTS[" + JSON.stringify(chave) + "]||{}).n||null)"));
}
function d010ServiceName(w, sid) {
  const S = (w.__DEV.V32.SERVICES || {})[sid];
  return S ? (S.name || null) : null;
}

/* A TABELA DE EQUIVALÊNCIA, derivada do catálogo congelado e não de uma lista
   escrita à mão: todo par (serviceId, chave do `MAP`) que RENDERIZA o mesmo
   nome. É o oráculo independente de C10 — se T008 escrever a própria tabela, é
   contra esta que ela é medida, e se a Fortinet renomear qualquer um dos lados
   o gate cai e alguém decide a direção (R10 §1), em vez de a tabela envelhecer
   em silêncio. Formato: "<serviceId>≡<chaveMAP>|<nome>", ordenado. */
function d010EquivalenciaNome(w) {
  const V = w.__DEV.V32;
  const sids = Object.keys(V.SERVICES || {});
  const pares = [];
  d010MapKeys(w).forEach(pk => {
    const pn = d010ProductName(w, pk);
    if (!pn) return;
    sids.forEach(sid => { if (d010ServiceName(w, sid) === pn) pares.push(sid + "≡" + pk + "|" + pn); });
  });
  return pares.sort();
}

/* Medido em 2026-08-30 sobre `quickscan_secops_soccmm_v3_2_dev.html`: o
   catálogo congelado tem EXATAMENTE dois pares homônimos, e os DOIS moram no
   mesmo `MAP["monitoring-coverage"].lv[0].c`. Um deles tem o serviço anexado
   sob D010-F4 (colisão real, a deduplicar); o outro não (controle, a preservar). */
const D010_EQUIVALENCIA_NOME = [
  "fortiguard-mdr≡FortiGuard-MDR-Service|FortiGuard MDR",
  "fortiguard-socaas≡SOCaaS|FortiGuard SOCaaS"
];

/* ===================== oráculos derivados do MODELO ======================= */

function d010CapOf(w, qid) {
  const V = w.__DEV.V32;
  const caps = Object.keys(V.CAPABILITIES)
    .filter(id => (V.CAPABILITIES[id].questionIds || []).indexOf(qid) >= 0);
  if (caps.length !== 1)
    throw new Error("d010CapOf: " + qid + " pertence a " + caps.length + " capabilities (esperado 1)");
  return caps[0];
}

/* Habilitadores publicáveis pelo engine para a prática — candidatos + serviços
   do contexto da capability, exatamente o payload que o card consome hoje. */
function d010EnablerCount(w, qid) {
  const V = w.__DEV.V32;
  const c = V.buildRecommendationContext().contexts[d010CapOf(w, qid)];
  if (!c) return 0;
  return (c.candidates || []).length + (c.services || []).length;
}

/* Os quatro estados da spec 009 §5, recalculados sobre o MODELO CANÔNICO.
   `nItems` é parâmetro porque a 010 precisa das DUAS leituras:
     · d010StateOf     — com os itens reais: é o estado que o card publica hoje
                         e o conjunto que `D009-UNS1` mede;
     · d010CtxStateOf  — com `nItems = 0`: é o PREDICADO DE CONTEXTO, o "S2" de
                         C7/C8 — a pergunta "esta capability tem contexto a
                         declarar e não declarou?", independente de o engine ter
                         anexado serviço. É a leitura que faz serviço do engine
                         não bloquear o `MAP`.
   Confundir as duas é o erro que faz o gate medir outra coisa: sob D010-F3,
   `team-capacity` é S1 pela primeira e S4 pela segunda. */
function d010StateWith(w, qid, nItems) {
  const V = w.__DEV.V32;
  if (nItems > 0) return "S1";
  const caps = Object.keys(V.CAPABILITIES).filter(id => (V.CAPABILITIES[id].questionIds || []).indexOf(qid) >= 0);
  if (caps.length !== 1) return "S3";
  if (V.CAPABILITIES[caps[0]].landscapeEnabled !== true) return "S4";
  const L = V.TECH_LANDSCAPE[caps[0]];
  return (!L || L.presence === "UNSET") ? "S2" : "S3";
}
function d010StateOf(w, qid) { return d010StateWith(w, qid, d010EnablerCount(w, qid)); }
function d010CtxStateOf(w, qid) { return d010StateWith(w, qid, 0); }

function d010TargetsByState(w) {
  const out = { S1: [], S2: [], S3: [], S4: [] };
  Object.keys(w.__DEV.TARGET.overrides || {}).forEach(qid => out[d010StateOf(w, qid)].push(qid));
  return out;
}

/* `presentationOf` REIMPLEMENTADA a partir da spec §1/§2 — não é lida do
   módulo sob teste (que é uma IIFE e não a expõe). Enquanto a regra da spec e
   a do produto coincidirem, os gates medem; se divergirem, o gate falha e a
   divergência vira decisão explícita, que é o efeito desejado (R10 §1). */
function d010PresentationOf(w, id, c) {
  const V = w.__DEV.V32;
  if (!c) return null;
  if (c.supportMode === "VALIDATE") return "card";
  if (["DIRECT", "CONTEXTUAL"].indexOf(c.supportMode) >= 0 &&
      ((c.candidates || []).length || (c.services || []).length || (c.notes || []).length)) return "card";
  if (c.classification === "CONTEXT_NOT_INFORMED" &&
      ((c.maturity && (c.maturity.state === "gap-high" || c.maturity.state === "gap-moderate")) ||
       (c.businessPriority && c.businessPriority.flag) || (c.services || []).length))
    return V.CAPABILITIES[id].landscapeEnabled ? "base" : "maturity";
  return null;
}

/* "Há substituto?" — o predicado da spec §1, com as TRÊS cláusulas, como
   oráculo. Reimplementado da spec, não lido de `__DEV.hasSubstitute`: quem lê o
   produto para julgar o produto não julga nada. */
function d010HasSubstitute(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).some(id => {
    const c = ctxs[id];
    if (d010PresentationOf(w, id, c) !== "card") return false;
    if (c.classification === "CONTEXT_NOT_INFORMED") return false;
    return ((c.candidates || []).length + (c.services || []).length + (c.notes || []).length) > 0;
  });
}

/* Capabilities de apresentação `base`. Os DOIS conjuntos existem porque não são
   o mesmo: `buildSupportHTML` desvia as capabilities de prioridade declarada
   para `#v32prio` ANTES de montar `#v32base` (`rest`), e o card de prioridade
   continua sendo `baseCardHTML`. Sob D010-F1 são 4 e 2 respectivamente — um
   oráculo que use o conjunto errado mede a lista nominal de C6 contra um
   universo que a superfície não contém. */
function d010BasePresented(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "base").sort();
}
function d010BaseInV32Base(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "base" &&
    !(ctxs[id].businessPriority && ctxs[id].businessPriority.flag)).sort();
}

/* Capabilities cuja apresentação é `card` e cujo payload é VAZIO — é a cláusula
   "candidato/serviço/nota" do predicado, e é a única das três que alguma
   fixture desta demanda torna load-bearing (D010-F3). */
function d010CardsSemPayload(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  return Object.keys(ctxs).filter(id => d010PresentationOf(w, id, ctxs[id]) === "card" &&
    ((ctxs[id].candidates || []).length + (ctxs[id].services || []).length + (ctxs[id].notes || []).length) === 0).sort();
}

/* Serviços que o engine anexou por capability — o payload que faz C8·CARD2 (b)
   existir. Vazio em D010-F1/F1b/F2: lá o `hasGap` não alcança capability alguma
   dos alvos, que é exatamente a vacuidade que D010-F4 fecha. */
function d010ServicesByCapability(w, res) {
  const ctxs = (res || w.__DEV.V32.buildRecommendationContext()).contexts;
  const out = {};
  Object.keys(ctxs).sort().forEach(id => {
    const s = (ctxs[id].services || []).map(x => x.serviceId);
    if (s.length) out[id] = s;
  });
  return out;
}

/* Chips de habilitador do cartão-alvo, agrupados pelo qid do `li` que os
   contém. É a SUPERFÍCIE onde a colisão de C10 acontece: o emissor é
   `ui_target_v32.js:262` e a identidade que ele já publica é `data-eid`.

   A guarda do final não é decorativa: se o emissor sair de `li.ux-tgt-ov`, um
   agrupador ingênuo devolveria `{}` e toda asserção de ausência sobre chips
   viraria PASS vacuoso. Aqui ele grita com a contagem que não fecha. */
function d010TargetEnablers(d) {
  const T = n => (n ? (n.textContent || "") : "").replace(/\s+/g, " ").trim();
  const out = {};
  Array.from(d.querySelectorAll("li.ux-tgt-ov[data-qid]")).forEach(li => {
    out[li.getAttribute("data-qid")] = Array.from(li.querySelectorAll(".ux-tgt-enabler")).map(s =>
      s.getAttribute("data-eid") + "|" + T(s.querySelector(".ux-tgt-enabler-name")) + "|" + T(s.querySelector(".ux-tgt-mode")));
  });
  const total = d.querySelectorAll(".ux-tgt-enabler").length;
  const soma = Object.keys(out).reduce((a, q) => a + out[q].length, 0);
  if (total !== soma)
    throw new Error("d010TargetEnablers: " + total + " chips `.ux-tgt-enabler` no documento mas " + soma +
      " agrupados por `li.ux-tgt-ov[data-qid]` — o emissor saiu do sítio conhecido (ui_target_v32.js:262)");
  return out;
}

/* Títulos congelados de recomendação presentes na tela, e quais estão ocultos.
   A lista é a mesma de `HIDE_EYEBROWS` (`ui_v32.js:109-110`), transcrita aqui
   caractere a caractere: se o produto mudar o texto, o gate falha — que é o
   comportamento correto para uma âncora de regressão. */
const D010_HIDE_EYEBROWS = ["Como a Fortinet pode apoiar nas prioridades declaradas",
  "Como a Fortinet pode apoiar agora", "Pode fazer sentido — após validação"];
function d010FrozenTitles(d) {
  return Array.from(d.querySelectorAll("section.screen .section-title")).map(t => {
    const eb = t.querySelector(".eyebrow");
    return { texto: eb ? (eb.textContent || "").replace(/\s+/g, " ").trim() : "", oculto: t.classList.contains("v32-hidden") };
  }).filter(o => D010_HIDE_EYEBROWS.indexOf(o.texto) >= 0);
}

/* ===================== ESTADOS DECLARADOS (medidos) ======================= */
/* Cada número/lista abaixo foi MEDIDO por execução em 2026-08-30 sobre
   `quickscan_secops_soccmm_v3_2_dev.html`, antes de qualquer implementação da
   010. Se a fixture deixar de produzir o cenário documentado, o erro aparece
   em `d010AssertFixtureStates` — nunca silenciosamente dentro de um gate.
   Fixture que não alcança o estado faz o gate morrer vacuoso, e gate vacuoso é
   pior que gate ausente. */
const D010_DECLARED = {
  "D010-F1": {
    legacy: false, suff: true, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: ["automation", "endpoint"],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 },
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["external-exposure", "network-detection"],
    cardsSemPayload: [],
    /* nenhum `hasGap` alcança capability de alvo: é a vacuidade de C8 (b) que
       esta fixture NÃO fecha, agora declarada como valor e não como prosa */
    servicosPorGap: {},
    habilitadores: { "automation": [], "endpoint": [], "network-visibility": [], "external-surface": [] },
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar nas prioridades declaradas", oculto: true }]
  },
  "D010-F1b": {
    legacy: false, suff: true, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: [],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2 },
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    cardsSemPayload: [],
    servicosPorGap: {},
    habilitadores: { "automation": [], "endpoint": [], "network-visibility": [], "external-surface": [] },
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar agora", oculto: true }]
  },
  "D010-F2": {
    legacy: false, suff: true, substituto: true,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: { "security-analytics": "NONE" },
    prioridades: ["automation", "endpoint"],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2, "logs": 2 },
    /* `logs` sai em S1 pela leitura com itens (3 candidatos DIRECT do engine) e
       em S3 pela leitura de contexto (presence NONE ≠ UNSET). */
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2", "logs": "S1" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2", "logs": "S3" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"],
                     "logs": ["FortiAnalyzer", "FortiSIEM"] },
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [], "logs": [] },
    basePresented: ["endpoint-detection", "external-exposure", "network-detection", "security-automation"],
    baseInV32Base: ["external-exposure", "network-detection"],
    cardsSemPayload: [],
    /* o substituto de F2 vem de CANDIDATO, não de serviço: o `hasGap` continua
       sem alcançar capability de alvo alguma — a vacuidade de C8 (b) sobrevive
       aqui e é D010-F4 quem a fecha */
    servicosPorGap: {},
    habilitadores: { "automation": [], "endpoint": [], "network-visibility": [], "external-surface": [],
                     "logs": ["fortianalyzer|FortiAnalyzer|apoio direto", "fortisiem|FortiSIEM|apoio direto",
                              "fortisiem-cloud|FortiSIEM Cloud|apoio direto"] },
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar nas prioridades declaradas", oculto: true }],
    /* o substituto, nomeado: é ele que autoriza a supressão de C2 */
    substitutoEm: { capability: "security-analytics", classification: "TECHNOLOGY_WHITESPACE",
                    supportMode: "DIRECT", candidates: ["fortianalyzer", "fortisiem", "fortisiem-cloud"], services: [] }
  },
  "D010-F3": {
    legacy: false, suff: false, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: [],
    alvos: { "team-capacity": 2, "vulnerability-management": 1 },
    /* `team-capacity` é S4 de contexto (capability `soc-staffing`,
       `landscapeEnabled:false`); `vulnerability-management` é o alvo em S2 que a
       emenda E5 trouxe — S1 pela leitura COM itens (o serviço) e S2 pela leitura
       de CONTEXTO (presence UNSET). É ele que satisfaz todas as demais condições
       de C7 e só não publica por causa do gate. */
    estados:    { "team-capacity": "S1", "vulnerability-management": "S1" },
    estadosCtx: { "team-capacity": "S4", "vulnerability-management": "S2" },
    mapNivelAtual: { "team-capacity": ["SOCaaS", "FortiGuard-MDR-Service"],
                     "vulnerability-management": ["FortiRecon", "FortiEndpoint"] },
    mapNivelAlvo:  { "team-capacity": [], "vulnerability-management": ["FortiRecon"] },
    /* a ÚNICA consequência da emenda no censo de apresentação: uma capability a
       mais em `base`, e nenhum card novo. Sem prioridades declaradas, os dois
       conjuntos coincidem. */
    basePresented: ["vulnerability-management"],
    baseInV32Base: ["vulnerability-management"],
    /* as 9 capabilities `NEEDS_VALIDATION`/`VALIDATE` com 0 candidatos, 0
       serviços e 0 notas: são elas que tornam a cláusula "candidato/serviço/
       nota" load-bearing, e é por elas que "há substituto" é false aqui.
       Eram 10 antes da emenda E5: `vulnerability-management` SAIU de `card` e
       entrou em `base`. A emenda tira um card, nunca acrescenta — se esta lista
       crescer, a previsão do `tech-lead` foi violada e a fixture grita aqui. */
    cardsSemPayload: ["continuous-monitoring", "detection-engineering", "endpoint-detection",
      "external-exposure", "incident-management", "knowledge-management", "network-detection",
      "security-automation", "soc-skills"],
    /* `team-capacity` pertence a `soc-staffing`, e É por gap que o serviço
       chega — mas `soc-staffing` tem `landscapeEnabled: false`, logo o estado
       de contexto é S4 e não S2. O chip dele mostra que a colisão
       fortiguard-socaas × SOCaaS também existe aqui — sob gate FECHADO, que é
       outro cenário e o de C9. D010-F3 continua NÃO servindo para C8 (b) nem
       para C10 (c): lá o universo é o card que publica, e aqui nada publica. */
    servicosPorGap: { "soc-staffing": ["fortiguard-socaas"],
                      "vulnerability-management": ["vulnerability-assessment"] },
    habilitadores: { "team-capacity": ["fortiguard-socaas|FortiGuard SOCaaS|serviço"],
                     "vulnerability-management": ["vulnerability-assessment|Vulnerability Assessment|serviço"] },
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar agora", oculto: true },
                        { texto: "Pode fazer sentido — após validação", oculto: true }],
    /* C9 (a) · o veredito de suficiência, DECLARADO para ser consumido como dado */
    gateSuficiencia: { confirmadas: 5, suff: false, publicavel: false },
    /* C9 (c) · a metade FECHADA do diferencial */
    diferencialC9: { qid: "vulnerability-management", nivel: 0, alvo: 1, gateAberto: false }
  },
  "D010-F4": {
    legacy: false, suff: true, substituto: false,
    arch: { saasAllowed: "yes" },
    landscapeDeclarada: {},
    prioridades: ["automation", "endpoint"],
    alvos: { "automation": 1, "endpoint": 2, "network-visibility": 2, "external-surface": 2,
             "vulnerability-management": 1, "monitoring-coverage": 2 },
    /* Os dois qids novos saem em S1 pela leitura COM itens (1 serviço cada) e
       em S2 pela leitura de CONTEXTO (presence UNSET). Essa divergência é o
       ponto inteiro de C8 (b): serviço do engine não pode bloquear o nó do
       `MAP`, e é aqui que um gate que confunda as duas leituras é pego. */
    estados:    { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2",
                  "vulnerability-management": "S1", "monitoring-coverage": "S1" },
    estadosCtx: { "automation": "S2", "endpoint": "S2", "network-visibility": "S2", "external-surface": "S2",
                  "vulnerability-management": "S2", "monitoring-coverage": "S2" },
    mapNivelAtual: { "automation": ["FortiSOAR"], "endpoint": ["FortiEndpoint"],
                     "network-visibility": ["FortiNDR"], "external-surface": ["FortiRecon"],
                     "vulnerability-management": ["FortiRecon", "FortiEndpoint"],
                     "monitoring-coverage": ["SOCaaS", "FortiGuard-MDR-Service"] },
    /* `vulnerability-management` é o único par SUBCONJUNTO ESTRITO das cinco
       fixtures; `monitoring-coverage` esvazia. As duas formas de INV-5 ficam
       disponíveis nos dois cartões que a emenda acrescenta. */
    mapNivelAlvo:  { "automation": ["FortiSOAR", "FortiXDR"], "endpoint": [],
                     "network-visibility": [], "external-surface": [],
                     "vulnerability-management": ["FortiRecon"], "monitoring-coverage": [] },
    basePresented: ["continuous-monitoring", "endpoint-detection", "external-exposure",
                    "network-detection", "security-automation", "vulnerability-management"],
    baseInV32Base: ["continuous-monitoring", "external-exposure", "network-detection", "vulnerability-management"],
    cardsSemPayload: [],
    /* C8 · D010-CARD2 (b), materializado: serviço por `hasGap` em capability de
       alvo, ZERO candidatos nas duas. */
    servicosPorGap: { "continuous-monitoring": ["fortiguard-socaas"],
                      "vulnerability-management": ["vulnerability-assessment"] },
    /* C10 · D010-CARD4 (c), materializado: o chip `fortiguard-socaas` já existe
       na tela ANTES de T008, com o mesmo nome renderizado que a chave `SOCaaS`
       do nó do `MAP` do MESMO qid. Os quatro alvos herdados seguem sem chip —
       é o que separa "alvo servido" de "alvo do vão". */
    habilitadores: { "automation": [], "endpoint": [], "network-visibility": [], "external-surface": [],
                     "vulnerability-management": ["vulnerability-assessment|Vulnerability Assessment|serviço"],
                     "monitoring-coverage": ["fortiguard-socaas|FortiGuard SOCaaS|serviço"] },
    titulosCongelados: [{ texto: "Como a Fortinet pode apoiar nas prioridades declaradas", oculto: true }],
    /* a colisão, NOMEADA — com o par de controle que a torna bidirecional */
    colisaoDeIdentidade: {
      qid: "monitoring-coverage", capability: "continuous-monitoring",
      servicoAnexado: "fortiguard-socaas", chaveMapHomonima: "SOCaaS", nomeComum: "FortiGuard SOCaaS",
      controleChaveMap: "FortiGuard-MDR-Service", controleServicoNaoAnexado: "fortiguard-mdr",
      controleNome: "FortiGuard MDR"
    },
    /* C9 (a) · o veredito de suficiência, declarado também aqui: é a metade
       ABERTA do diferencial, e sem os DOIS vereditos declarados o oráculo teria
       de recalcular a suficiência — que é o que a errata E5 proibiu. */
    gateSuficiencia: { confirmadas: 15, suff: true, publicavel: true },
    /* C9 (c) · a metade ABERTA. O par é IDÊNTICO ao de D010-F3 (mesmo qid,
       mesmo nível confirmado, mesmo nível de alvo) — é essa identidade que faz
       o gate ser a única variável do diferencial. `gateAberto` é o oposto do de
       F3, e o assert exige que sejam opostos: dois iguais não são diferencial. */
    diferencialC9: { qid: "vulnerability-management", nivel: 0, alvo: 1, gateAberto: true },
    /* E2 da errata · as DUAS leituras de "S2", por qid, lado a lado. Não é
       repetição de `estados`/`estadosCtx`: o que esta declaração acrescenta é a
       lista de qids em que as duas DIVERGEM, e é ela que C8 (b) consome como
       pré-condição de não-vacuidade — "prática com apenas serviços (nenhum
       candidato) e em S2 de CONTEXTO". Lista vazia = alínea sem caso. */
    leiturasPorQid: {
      "automation":              { payload: "S2", contexto: "S2" },
      "endpoint":                { payload: "S2", contexto: "S2" },
      "network-visibility":      { payload: "S2", contexto: "S2" },
      "external-surface":        { payload: "S2", contexto: "S2" },
      "vulnerability-management": { payload: "S1", contexto: "S2" },
      "monitoring-coverage":     { payload: "S1", contexto: "S2" }
    },
    leiturasDivergentes: ["monitoring-coverage", "vulnerability-management"],
    /* C10 (c) · os DOIS homônimos no MESMO card, declarados como conjunto
       TOTAL: os pares abaixo têm de ser exatamente a tabela de equivalência
       inteira do catálogo (`D010_EQUIVALENCIA_NOME`), e os dois têm de estar no
       nó do `MAP` deste qid. Um anexado (colide, tem de fundir) e um NÃO
       anexado (controle, tem de sobreviver) — se algum dia os dois ficarem do
       mesmo lado, o cartão perdeu uma direção e o assert diz qual. */
    homonimosNoCard: {
      qid: "monitoring-coverage", capability: "continuous-monitoring",
      pares: [
        { chaveMap: "SOCaaS", servico: "fortiguard-socaas", nome: "FortiGuard SOCaaS", anexado: true },
        { chaveMap: "FortiGuard-MDR-Service", servico: "fortiguard-mdr", nome: "FortiGuard MDR", anexado: false }
      ]
    }
  }
};

/* ==========================================================================
   VACUIDADES CONHECIDAS — o que foi FECHADO e o que continua ABERTO
   ==========================================================================
   Este bloco é dado, não desculpa. Ele existe para que um gate de
   `tests_010_vao.js` não nasça vacuoso sem que alguém tenha decidido isso: a
   alínea com `status: "ABERTA"` NÃO pode ser dada por medida enquanto a
   decisão do `tech-lead`/`product-owner` não vier.

   T002 (2026-08-30) mediu quatro. A emenda do proprietário de 2026-08-29,
   executada em 2026-08-30 em três passagens, deixa UMA aberta:
     · C8 (b) e C10 (c) — FECHADAS por D010-F4 (2ª passagem);
     · C9 (b) e (c) — FECHADAS pela emenda de D010-F3 (3ª e última passagem):
       (b) ganhou o alvo que só não publica por causa do gate, e (c) virou o
       diferencial declarado F3 × F4, com o mesmo par (qid, nível) dos dois
       lados. A redação nova do `tech-lead` (errata E5) chegou antes da fixture,
       e é ela que esta emenda cumpre — não há critério pendente de texto;
     · A5 continua ABERTA POR CONSTRUÇÃO e sem mutante — a cláusula fica no
       predicado como guarda contra mudança futura no engine e para de receber
       atribuição de peso. Fica registrada aqui como PROVA de que nada a mata,
       para que ninguém tente escrever esse mutante de novo.
   ========================================================================== */
const D010_VACUIDADES_CONHECIDAS = [
  { criterio: "C8 · D010-CARD2 (b)", status: "FECHADA em 2026-08-30 por D010-F4", fixture: "D010-F4",
    medido: "T002 mediu que nenhuma capability de alvo de D010-F1/F1b/F2 recebia serviço por hasGap " +
            "(`servicosPorGap` declarado {} nas três) e que o único alvo servido de D010-F3 — " +
            "`team-capacity`, via `soc-staffing` — estava em S4 de contexto, fora do universo da alínea. " +
            "D010-F4 põe `vulnerability-management` e `monitoring-coverage` no nível 0 com alvo: o engine " +
            "anexa `vulnerability-assessment` e `fortiguard-socaas` às capabilities correspondentes, com " +
            "ZERO candidatos, presence UNSET (estado de contexto S2) e MAP.lv[atual].c não vazio nos dois. " +
            "ATUALIZAÇÃO da 3ª passagem: D010-F3 emendada também passou a ter capability de alvo servida " +
            "em S2 (`vulnerability-management`), mas a fixture de C8 (b) continua sendo D010-F4 — sob F3 o " +
            "gate está FECHADO e nada publica, de modo que não há \"nó ao lado da linha do engine\" para medir.",
    consequencia: "a alínea passa a ser exercitável: um mutante que trate serviço-sem-candidato como " +
            "\"já tem contexto\" e suprima o nó morre em D010-F4. O par S1 (com itens) × S2 (contexto) fica " +
            "declarado lado a lado na mesma fixture, que é onde um gate que confunda as duas leituras é pego." },
  { criterio: "C10 · D010-CARD4 (c) · dedup por data-eid", status: "FECHADA em 2026-08-30 por D010-F4", fixture: "D010-F4",
    medido: "a colisão foi confirmada NOMINALMENTE, não por semelhança de nome: " +
            "SERVICES[\"fortiguard-socaas\"].name === PRODUCTS[\"SOCaaS\"].n === \"FortiGuard SOCaaS\", " +
            "ids distintos. Sob D010-F4 o chip `data-eid=\"fortiguard-socaas\"` já é emitido pelo cartão-alvo " +
            "de `monitoring-coverage` (ui_target_v32.js:262) ANTES de T008, e MAP[\"monitoring-coverage\"].lv[0].c " +
            "traz a chave `SOCaaS`. Sob D010-F1 há ZERO chips na tela — o cenário é novo, não herdado.",
    consequencia: "a deduplicação de T008 nasce com cenário que a mata nas DUAS direções: o par de controle " +
            "`fortiguard-mdr`/`FortiGuard-MDR-Service` (homônimo no catálogo, serviço NÃO anexado) está no " +
            "mesmo nó, então deduplicar contra a tabela sem olhar o que está anexado apaga \"FortiGuard MDR\" " +
            "e também morre. A tabela inteira tem 2 pares e é re-derivada a cada execução por " +
            "`d010EquivalenciaNome` — ver `D010_EQUIVALENCIA_NOME`." },
  { criterio: "C9 · D010-CARD3 (b)", status: "FECHADA em 2026-08-30 pela emenda de D010-F3", fixture: "D010-F3",
    medido: "com o vetor ORIGINAL de P50-F2, nenhum alvo legítimo estava em estado de contexto S2 com MAP não " +
            "vazio: mandate/governance/team-capacity são S4 (landscapeEnabled:false), logs é S2 mas MAP.lv[3].c é " +
            "vazio e o alvo seria removido por revalidateTargets, incident-response é S2 mas a resposta é \"NA\". " +
            "A ausência de nó a-validar era verdadeira por ESTADO, não por GATE. A emenda acrescenta " +
            "`vulnerability-management` = 0 com alvo 1: S2 de contexto, resposta confirmada e " +
            "MAP.lv[0].c = [FortiRecon, FortiEndpoint] — todas as demais condições de C7 satisfeitas.",
    custoMedido: "conferido por execução, contra a previsão do `tech-lead`, e sem ajustar critério a medição: " +
            "confirmedCount() 4 → 5 com o gate AINDA FECHADO (suff false, tgtComparisonPublishable false); " +
            "EXATAMENTE UMA capability muda em todo o render (`vulnerability-management` sai de card " +
            "NEEDS_VALIDATION/VALIDATE e entra em apresentação base CONTEXT_NOT_INFORMED + serviço), as outras 11 " +
            "saem idênticas campo a campo; ZERO cards novos (cardsSemPayload 10 → 9); \"há substituto\" continua " +
            "FALSE; censo de títulos congelados inalterado.",
    consequencia: "a alínea passa a medir o GATE: existe um alvo que satisfaz tudo o que C7 pede e cuja única " +
            "razão para não publicar é a suficiência fechada. Um mutante que publique o nó ignorando o gate (M12) " +
            "morre aqui — com o vetor original ele sobreviveria, porque não havia nó a suprimir." },
  { criterio: "C9 · D010-CARD3 (c) · diferencial declarado entre fixtures",
    status: "FECHADA em 2026-08-30 pelo par D010-F3 × D010-F4", fixture: "D010-F3 + D010-F4",
    medido: "o par (vulnerability-management, nível confirmado 0, alvo 1) existe NAS DUAS fixtures e coincide " +
            "nelas em 16 campos medidos — nível confirmado, alvo, estado de payload (S1), estado de contexto (S2), " +
            "MAP no nível atual e no nível alvo, classification (CONTEXT_NOT_INFORMED), supportMode " +
            "(LEGACY-LABELLED), candidatos (0), serviços ([vulnerability-assessment]), notas (0), maturidade " +
            "(gap-high), apresentação (base), landscapeEnabled (true), presence (UNSET) e chips do cartão-alvo. " +
            "Divergem SÓ no gate: 5 × 15 confirmadas, suff false × true, publicável false × true.",
    consequencia: "(c) deixa de exigir que alguém altere `dataSufficiency` — que vive em arquivo frozen (Porta B) " +
            "e cuja reimplementação tornaria a asserção equivalente por construção — e passa a ler o veredito como " +
            "DADO: `d010AssertFixtureStates` declara `gateSuficiencia` e `diferencialC9` nas duas fixtures, exige " +
            "que o par seja o MESMO e que os vereditos sejam OPOSTOS. Par ausente, par diferente ou vereditos " +
            "iguais = FAIL nomeado, nunca verde silencioso.",
    riscada_e_refutada: "RISCADO por medição em 2026-08-30 — a T002 registrava \"não é falta de fixture: " +
            "acrescentar alvo em S2 a este vetor exigiria mudar o vetor, e um vetor com suficiência ABERTA deixa " +
            "de ser o cenário de gate fechado que C9 mede\". FALSO: 5 confirmadas continuam abaixo do limiar de 10, " +
            "então o vetor muda e o gate NÃO abre. Fica registrado em vez de apagado (R2 §5) — foi essa afirmação " +
            "que quase transformou uma vacuidade fechável em vacuidade permanente." },
  { criterio: "§1 · cláusula \"classificação ≠ CONTEXT_NOT_INFORMED\" (A5)",
    status: "ABERTA por construção — decidida: fica no predicado, sem mutante", fixture: "todas",
    medido: "re-derivado a cada passagem da série, a última em 2026-08-30 com D010-F3 já emendada: nas cinco " +
            "fixtures o predicado dá o MESMO valor com e sem a cláusula, e o número de capabilities " +
            "CONTEXT_NOT_INFORMED que alcançam apresentação \"card\" é ZERO em todas (4 delas em F1/F1b/F2, " +
            "3 em F3, 6 em F4). O supportMode dessa classificação é LEGACY-LABELLED, que presentationOf nunca " +
            "promove a card. D010-F4 REFORÇA a medição em vez de mudá-la: as duas capabilities novas são " +
            "CONTEXT_NOT_INFORMED, têm serviço anexado, e ainda assim \"há substituto\" continua FALSE; a emenda " +
            "de F3 acrescenta uma terceira nessa forma, com o mesmo resultado.",
    ressalva: "CORREÇÃO de 2026-08-30 à redação anterior desta entrada: as sessões 15×0 e 15×1 \"sem nada " +
            "declarado\" NÃO sustentam a medição — sem contexto declarado o runtime está em modo legado e " +
            "`buildRecommendationContext().contexts` sai VAZIO, de modo que o predicado é falso dos dois lados por " +
            "universo vazio. Sonda vacuosa não é evidência. O que sustenta A5 são as cinco fixtures, onde há de 3 " +
            "a 6 capabilities CONTEXT_NOT_INFORMED e nenhuma alcança \"card\".",
    consequencia: "a cláusula é guarda redundante, não load-bearing. Decisão do proprietário de 2026-08-29: " +
            "permanece no predicado como defesa contra mudança futura no engine, o texto do critério para de " +
            "lhe atribuir peso e NENHUM mutante a tem como alvo. Registro aqui para que a matriz gate↔mutante " +
            "não ganhe de novo um mutante que nenhuma fixture pode matar." }
];

/* ===================== conferência dos estados declarados ================== */

const _eqL = (a, b) => a.slice().sort().join("|") === b.slice().sort().join("|");

/* Blocos que a errata torna OBRIGATÓRIOS em fixtures nomeadas. Sem esta lista,
   as conferências abaixo são guardadas por `if (dec.<bloco>)` e apagar uma
   declaração faria a asserção correspondente SUMIR EM SILÊNCIO — que dá no
   mesmo que nunca tê-la escrito, e é a forma de vacuidade mais difícil de ver,
   porque a suíte continua verde. Bloco exigido e ausente = FAIL nomeado. */
const D010_DECLARACOES_OBRIGATORIAS = {
  "D010-F3": ["gateSuficiencia", "diferencialC9"],
  "D010-F4": ["gateSuficiencia", "diferencialC9", "leiturasPorQid", "leiturasDivergentes",
              "colisaoDeIdentidade", "homonimosNoCard"]
};

/* Confere, sobre um runtime JÁ com a fixture aplicada, TODO o estado declarado.
   Lança com a divergência nomeada, no primeiro desvio. Recebe `w` e a fixture,
   como `d009AssertFixtureStates`; o documento sai de `w.document`. */
function d010AssertFixtureStates(w, fx) {
  const dec = D010_DECLARED[fx.id];
  if (!dec) throw new Error("d010AssertFixtureStates: fixture sem estados declarados: " + fx.id);
  const d = w.document;
  const V = w.__DEV.V32;
  const fail = m => { throw new Error(fx.id + ": " + m); };

  /* 0 · os blocos que a errata exige DESTA fixture existem. Vem antes de tudo:
         asserção que não está na tabela não reprova ninguém. */
  (D010_DECLARACOES_OBRIGATORIAS[fx.id] || []).forEach(k => {
    if (!(k in dec))
      fail("tabela declarada sem `" + k + "` — a errata exige este bloco nesta fixture, e sem ele a " +
           "conferência correspondente é PULADA em silêncio");
  });

  /* 1 · modo legado — pré-condição de TODOS os gates da demanda */
  if (V.isLegacyModeV32() !== dec.legacy)
    fail("isLegacyModeV32 = " + V.isLegacyModeV32() + ", declarado " + dec.legacy);

  /* 2 · arquitetura declarada, e SÓ ela */
  Object.keys(dec.arch).forEach(k => {
    if (V.ARCHITECTURE_CONTEXT[k] !== dec.arch[k])
      fail("ARCHITECTURE_CONTEXT." + k + " = " + V.ARCHITECTURE_CONTEXT[k] + ", declarado " + dec.arch[k]);
  });
  const archExtra = Object.keys(V.ARCHITECTURE_CONTEXT).filter(k => !(k in dec.arch) &&
    !["unknown", "undefined", "uninformed", null].some(v => V.ARCHITECTURE_CONTEXT[k] === v));
  if (archExtra.length) fail("campos de arquitetura fora do declarado: [" + archExtra + "]");

  /* 3 · landscape: exatamente as capabilities declaradas saem de UNSET */
  const decl = {};
  Object.keys(V.TECH_LANDSCAPE).forEach(id => {
    if (V.TECH_LANDSCAPE[id].presence !== "UNSET") decl[id] = V.TECH_LANDSCAPE[id].presence;
  });
  if (JSON.stringify(decl) !== JSON.stringify(dec.landscapeDeclarada))
    fail("landscape declarada " + JSON.stringify(decl) + " != declarado " + JSON.stringify(dec.landscapeDeclarada));

  /* 4 · vetor de respostas e suficiência (owner canônico, não recontagem) */
  const ansNow = d010Answers(w);
  if (JSON.stringify(ansNow) !== JSON.stringify(fx.vec))
    fail("vetor aplicado " + JSON.stringify(ansNow) + " != vetor da fixture " + JSON.stringify(fx.vec));
  const cur = w.__DEV.tgtCurrentProfile();
  if (cur.suff !== dec.suff) fail("suficiência = " + cur.suff + ", declarada " + dec.suff);

  /* 5 · alvos: conjunto e níveis EXATOS, medidos contra a tabela declarada e
         não contra o objeto da fixture. Comparar runtime × `fx.targets` deixa
         passar qualquer edição da fixture — o objeto e o runtime mudam juntos e
         o assert concorda com os dois. Medido: com essa comparação, trocar o
         alvo de D010-F3 de `team-capacity` para `mandate` NÃO era detectado. */
  const alvos = dec.alvos;
  const fxq = Object.keys(fx.targets || {}).sort(), decq = Object.keys(alvos).sort();
  if (fxq.join(",") !== decq.join(","))
    fail("fixture declara alvos [" + fxq + "], tabela declara [" + decq + "]");
  decq.forEach(qid => {
    if ((fx.targets || {})[qid] !== alvos[qid])
      fail("fixture põe alvo " + qid + " = " + (fx.targets || {})[qid] + ", tabela declara " + alvos[qid]);
  });
  const ov = Object.keys(w.__DEV.TARGET.overrides || {}).sort();
  if (ov.join(",") !== decq.join(","))
    fail("alvos aplicados [" + ov + "] != declarados [" + decq + "]");
  decq.forEach(qid => {
    if (w.__DEV.TARGET.overrides[qid] !== alvos[qid])
      fail("alvo " + qid + " = " + w.__DEV.TARGET.overrides[qid] + ", declarado " + alvos[qid]);
  });

  /* 6 · prioridades — lidas do payload do engine, não de estado interno */
  const res = V.buildRecommendationContext();
  const prioQ = [];
  Object.keys(res.contexts).forEach(id => {
    ((res.contexts[id].businessPriority || {}).priorityQuestionIds || []).forEach(q => {
      if (prioQ.indexOf(q) < 0) prioQ.push(q);
    });
  });
  if (!_eqL(prioQ, dec.prioridades))
    fail("prioridades [" + prioQ.sort() + "] != declaradas [" + dec.prioridades.slice().sort() + "]");

  /* 7 · o predicado da spec §1 */
  if (d010HasSubstitute(w, res) !== dec.substituto)
    fail("\"há substituto\" = " + d010HasSubstitute(w, res) + ", declarado " + dec.substituto);

  /* 8 · os DOIS estados por prática-alvo */
  Object.keys(dec.estados).forEach(qid => {
    const got = d010StateOf(w, qid);
    if (got !== dec.estados[qid]) fail(qid + " (estado com itens) em " + got + ", declarado " + dec.estados[qid]);
  });
  Object.keys(dec.estadosCtx).forEach(qid => {
    const got = d010CtxStateOf(w, qid);
    if (got !== dec.estadosCtx[qid]) fail(qid + " (estado de contexto) em " + got + ", declarado " + dec.estadosCtx[qid]);
  });

  /* 9 · âncora de catálogo: nível ATUAL e nível ALVO, para que INV-5 seja
         mensurável e para que nenhum gate de C7 nasça sobre lista vazia */
  Object.keys(dec.mapNivelAtual).forEach(qid => {
    const got = d010MapItems(w, qid, ansNow[K(qid)]);
    if (JSON.stringify(got) !== JSON.stringify(dec.mapNivelAtual[qid]))
      fail("MAP[" + qid + "].lv[atual].c = " + JSON.stringify(got) + ", declarado " + JSON.stringify(dec.mapNivelAtual[qid]));
  });
  Object.keys(dec.mapNivelAlvo).forEach(qid => {
    const got = d010MapItems(w, qid, dec.alvos[qid]);
    if (JSON.stringify(got) !== JSON.stringify(dec.mapNivelAlvo[qid]))
      fail("MAP[" + qid + "].lv[alvo].c = " + JSON.stringify(got) + ", declarado " + JSON.stringify(dec.mapNivelAlvo[qid]));
  });

  /* 10 · superfície de apresentação: os dois conjuntos `base` e os cards sem
          payload — é o que separa C6 de um oráculo com universo errado */
  const bp = d010BasePresented(w, res), bb = d010BaseInV32Base(w, res), cs = d010CardsSemPayload(w, res);
  if (!_eqL(bp, dec.basePresented)) fail("apresentação base [" + bp + "] != declarada [" + dec.basePresented + "]");
  if (!_eqL(bb, dec.baseInV32Base)) fail("base fora de prioridade [" + bb + "] != declarada [" + dec.baseInV32Base + "]");
  if (!_eqL(cs, dec.cardsSemPayload)) fail("cards sem payload [" + cs + "] != declarado [" + dec.cardsSemPayload + "]");

  /* 11 · o substituto, quando declarado, é NOMEADO */
  if (dec.substitutoEm) {
    const s = dec.substitutoEm, c = res.contexts[s.capability];
    if (!c) fail("capability do substituto ausente: " + s.capability);
    if (c.classification !== s.classification || c.supportMode !== s.supportMode)
      fail(s.capability + " = " + c.classification + "/" + c.supportMode + ", declarado " + s.classification + "/" + s.supportMode);
    const cand = (c.candidates || []).map(x => x.itemId), svc = (c.services || []).map(x => x.serviceId);
    if (JSON.stringify(cand) !== JSON.stringify(s.candidates))
      fail(s.capability + " candidatos " + JSON.stringify(cand) + " != declarados " + JSON.stringify(s.candidates));
    if (JSON.stringify(svc) !== JSON.stringify(s.services))
      fail(s.capability + " serviços " + JSON.stringify(svc) + " != declarados " + JSON.stringify(s.services));
  }

  /* 12 · a Camada 1 congelada existe na tela — sem título presente, todo gate
          de arbitragem passa vacuosamente */
  const tit = d010FrozenTitles(d);
  if (JSON.stringify(tit) !== JSON.stringify(dec.titulosCongelados))
    fail("títulos congelados " + JSON.stringify(tit) + " != declarados " + JSON.stringify(dec.titulosCongelados));

  /* 13 · serviços anexados por `hasGap`, por capability. OBRIGATÓRIO em toda
          fixture: é o eixo de C8 (b), e "não declarei" não pode virar "não
          medi". Sem esta asserção, um mutante que anexasse serviço a mais (ou
          a menos) não seria visto por fixture alguma da demanda. */
  if (!dec.servicosPorGap) fail("tabela declarada sem `servicosPorGap` — eixo de C8 (b) não medido");
  const svcs = d010ServicesByCapability(w, res);
  if (JSON.stringify(svcs) !== JSON.stringify(dec.servicosPorGap))
    fail("serviços por capability " + JSON.stringify(svcs) + " != declarados " + JSON.stringify(dec.servicosPorGap));

  /* 14 · chips de habilitador do cartão-alvo, por qid. Também OBRIGATÓRIO: é a
          superfície onde a colisão de C10 se materializa, e onde a AUSÊNCIA de
          chip nos alvos do vão precisa ser asserção, não silêncio. */
  if (!dec.habilitadores) fail("tabela declarada sem `habilitadores` — superfície de C10 não medida");
  const hab = d010TargetEnablers(d);
  const hq = Object.keys(hab).sort(), dq = Object.keys(dec.habilitadores).sort();
  if (hq.join(",") !== dq.join(","))
    fail("cartões-alvo na tela [" + hq + "] != declarados [" + dq + "]");
  dq.forEach(qid => {
    if (JSON.stringify(hab[qid]) !== JSON.stringify(dec.habilitadores[qid]))
      fail("habilitadores de " + qid + " " + JSON.stringify(hab[qid]) +
           " != declarados " + JSON.stringify(dec.habilitadores[qid]));
  });

  /* 15 · a tabela de equivalência de nome, RE-DERIVADA do catálogo congelado a
          cada execução. Âncora global: não depende da fixture, e é ela que faz
          um renome no catálogo virar decisão explícita em vez de rot silenciosa. */
  const eq = d010EquivalenciaNome(w);
  if (JSON.stringify(eq) !== JSON.stringify(D010_EQUIVALENCIA_NOME))
    fail("tabela de equivalência de nome " + JSON.stringify(eq) +
         " != declarada " + JSON.stringify(D010_EQUIVALENCIA_NOME));

  /* 16 · a colisão de identidade, quando declarada, é conferida DOS DOIS LADOS:
          o par que colide tem de colidir, e o par de controle tem de estar no
          mesmo nó do `MAP` SEM o serviço anexado. Um cenário que só provasse o
          primeiro deixaria vivo o mutante que deduplica demais. */
  if (dec.colisaoDeIdentidade) {
    const z = dec.colisaoDeIdentidade;
    /* o qid e a capability declarados têm de ser O MESMO nó. Sem esta amarra,
       declarar um qid cujo `MAP` por acaso traz as mesmas chaves (é o caso de
       `team-capacity`) passaria pelo resto do bloco medindo outro cartão —
       achado da bateria negativa desta emenda. */
    if (d010CapOf(w, z.qid) !== z.capability)
      fail("colisão: qid " + z.qid + " pertence a " + d010CapOf(w, z.qid) + ", declarado " + z.capability);
    const nomeSvc = d010ServiceName(w, z.servicoAnexado), nomeProd = d010ProductName(w, z.chaveMapHomonima);
    if (nomeSvc !== z.nomeComum || nomeProd !== z.nomeComum)
      fail("colisão: SERVICES[" + z.servicoAnexado + "].name=" + JSON.stringify(nomeSvc) +
           " / PRODUCTS[" + z.chaveMapHomonima + "].n=" + JSON.stringify(nomeProd) +
           ", declarado " + JSON.stringify(z.nomeComum));
    if (z.servicoAnexado === z.chaveMapHomonima)
      fail("colisão: serviço e chave do MAP têm o MESMO id — não há o que deduplicar");
    const mapAtual = d010MapItems(w, z.qid, ansNow[K(z.qid)]);
    if (mapAtual.indexOf(z.chaveMapHomonima) < 0)
      fail("colisão: " + z.chaveMapHomonima + " não está em MAP[" + z.qid + "].lv[atual].c = " + JSON.stringify(mapAtual));
    const anexados = (svcs[z.capability] || []);
    if (anexados.indexOf(z.servicoAnexado) < 0)
      fail("colisão: " + z.servicoAnexado + " não está anexado a " + z.capability + " = " + JSON.stringify(anexados));
    /* o controle: mesmo nó, homônimo no catálogo, serviço NÃO anexado */
    if (mapAtual.indexOf(z.controleChaveMap) < 0)
      fail("controle: " + z.controleChaveMap + " não está em MAP[" + z.qid + "].lv[atual].c = " + JSON.stringify(mapAtual));
    if (d010ServiceName(w, z.controleServicoNaoAnexado) !== z.controleNome ||
        d010ProductName(w, z.controleChaveMap) !== z.controleNome)
      fail("controle: par " + z.controleServicoNaoAnexado + "/" + z.controleChaveMap + " não renderiza " +
           JSON.stringify(z.controleNome));
    if (anexados.indexOf(z.controleServicoNaoAnexado) >= 0)
      fail("controle: " + z.controleServicoNaoAnexado + " ESTÁ anexado a " + z.capability +
           " — o par de controle deixou de ser controle e o cenário perdeu a direção 'deduplica demais'");
  }

  /* 17 · O VEREDITO DE SUFICIÊNCIA, declarado e provado contra as DUAS funções
          canônicas do runtime (`confirmedCount` e `tgtComparisonPublishable`).
          C9 (a) e (c) consomem a decisão como DADO; sem esta asserção "gate
          fechado" seria alegação da prosa, e um oráculo que recalculasse a
          suficiência seria equivalente por construção (errata E5). */
  if (dec.gateSuficiencia) {
    const g = dec.gateSuficiencia;
    const conf = d010ConfirmedCount(w), pub = d010ComparisonPublishable(w);
    if (conf !== g.confirmadas) fail("confirmedCount() = " + conf + ", declarado " + g.confirmadas);
    if (cur.suff !== g.suff) fail("suff = " + cur.suff + ", declarado em gateSuficiencia " + g.suff);
    if (pub !== g.publicavel) fail("tgtComparisonPublishable(tgtCurrentProfile()) = " + pub + ", declarado " + g.publicavel);
    if (g.suff !== dec.suff)
      fail("gateSuficiencia.suff (" + g.suff + ") diverge do `suff` declarado (" + dec.suff + ") na MESMA tabela");
  }

  /* 18 · O PAR DO DIFERENCIAL de C9 (c). Aqui se prova o lado desta fixture — o
          par existe, satisfaz TODAS as demais condições de C7 (respondido no
          nível declarado, alvo no nível declarado, S2 de contexto, `MAP` do
          nível confirmado não vazio) e o veredito do gate é o declarado — e a
          coerência entre as duas metades: mesmo par, vereditos OPOSTOS. Sem a
          segunda parte, editar um dos lados passaria despercebido e o
          "diferencial" viraria duas medições soltas. */
  if (dec.diferencialC9) {
    const D = dec.diferencialC9;
    if (typeof D.nivel !== "number") fail("diferencial: nível confirmado não numérico (" + D.nivel + ")");
    if (ansNow[K(D.qid)] !== D.nivel)
      fail("diferencial: " + D.qid + " respondido " + JSON.stringify(ansNow[K(D.qid)]) +
           ", declarado nível " + D.nivel);
    if (alvos[D.qid] !== D.alvo)
      fail("diferencial: alvo de " + D.qid + " é " + alvos[D.qid] + " na tabela de alvos e " + D.alvo + " no diferencial");
    if (w.__DEV.TARGET.overrides[D.qid] !== D.alvo)
      fail("diferencial: alvo aplicado de " + D.qid + " = " + w.__DEV.TARGET.overrides[D.qid] + ", declarado " + D.alvo);
    const ctxSt = d010CtxStateOf(w, D.qid);
    if (ctxSt !== "S2") fail("diferencial: " + D.qid + " em estado de contexto " + ctxSt + " — C7 exige S2");
    const mapAt = d010MapItems(w, D.qid, D.nivel);
    if (!mapAt.length)
      fail("diferencial: MAP[" + D.qid + "].lv[" + D.nivel + "].c vazio — o par não satisfaz C7 e nada estaria sendo impedido");
    if (d010ComparisonPublishable(w) !== D.gateAberto)
      fail("diferencial: gate publicável = " + d010ComparisonPublishable(w) + ", declarado gateAberto " + D.gateAberto);
    const outras = Object.keys(D010_DECLARED).filter(id => id !== fx.id && D010_DECLARED[id].diferencialC9);
    if (!outras.length)
      fail("diferencial: nenhuma outra fixture declara `diferencialC9` — não há diferencial, só uma medição");
    outras.forEach(id => {
      const O = D010_DECLARED[id].diferencialC9;
      if (O.qid !== D.qid || O.nivel !== D.nivel || O.alvo !== D.alvo)
        fail("diferencial: " + id + " declara (" + O.qid + ", nível " + O.nivel + ", alvo " + O.alvo + ") e " +
             fx.id + " declara (" + D.qid + ", nível " + D.nivel + ", alvo " + D.alvo +
             ") — o par tem de ser o MESMO nas duas metades");
      if (O.gateAberto === D.gateAberto)
        fail("diferencial: " + id + " e " + fx.id + " declaram o mesmo veredito de gate (" + D.gateAberto +
             ") — sem as duas direções não há diferencial");
    });
  }

  /* 19 · As DUAS leituras de "S2" por qid (E2 da errata), e a lista de qids em
          que divergem. A lista é a pré-condição de não-vacuidade de C8 (b):
          prática com ZERO candidatos, ao menos um serviço e S2 de CONTEXTO.
          Lista vazia = alínea sem caso, e o assert recusa em vez de deixar a
          vacuidade viajar para dentro do gate. */
  if (dec.leiturasPorQid) {
    const L = dec.leiturasPorQid;
    const lq = Object.keys(L).sort(), aq = Object.keys(alvos).sort();
    if (lq.join(",") !== aq.join(","))
      fail("leituras declaradas para [" + lq + "] != alvos declarados [" + aq + "]");
    const div = [];
    lq.forEach(qid => {
      const p = d010StateOf(w, qid), c = d010CtxStateOf(w, qid);
      if (p !== L[qid].payload || c !== L[qid].contexto)
        fail("leituras de " + qid + ": payload " + p + " / contexto " + c +
             ", declarado payload " + L[qid].payload + " / contexto " + L[qid].contexto);
      if (p !== c) div.push(qid);
    });
    if (!_eqL(div, dec.leiturasDivergentes || []))
      fail("qids com leituras divergentes [" + div.slice().sort() + "] != declarados [" +
           (dec.leiturasDivergentes || []).slice().sort() + "]");
    if (!div.length)
      fail("nenhum qid com as duas leituras divergentes — a pré-condição de C8 (b) não existe nesta fixture");
    div.forEach(qid => {
      const c = res.contexts[d010CapOf(w, qid)] || {};
      const nc = (c.candidates || []).length, ns = (c.services || []).length;
      if (nc !== 0 || ns === 0)
        fail("divergência de " + qid + " não é 'apenas serviços': " + nc + " candidato(s) e " + ns + " serviço(s)");
      if (d010CtxStateOf(w, qid) !== "S2")
        fail("divergência de " + qid + " fora de S2 de contexto — o universo de C8 (b) é S2");
    });
  }

  /* 20 · Os DOIS homônimos no MESMO card. Vai além do item 16: aqui se exige
          TOTALIDADE — os pares declarados são a tabela de equivalência INTEIRA
          do catálogo, re-derivada — e BIDIRECIONALIDADE — exatamente um serviço
          anexado e exatamente um livre. É essa forma que põe as duas direções da
          fusão no mesmo cartão; se um dia os dois caírem do mesmo lado, o card
          perdeu uma direção e o assert diz qual. */
  if (dec.homonimosNoCard) {
    const H = dec.homonimosNoCard;
    if (d010CapOf(w, H.qid) !== H.capability)
      fail("homônimos: qid " + H.qid + " pertence a " + d010CapOf(w, H.qid) + ", declarado " + H.capability);
    const decl = H.pares.map(p => p.servico + "≡" + p.chaveMap + "|" + p.nome).sort();
    if (JSON.stringify(decl) !== JSON.stringify(D010_EQUIVALENCIA_NOME))
      fail("homônimos declarados no card " + JSON.stringify(decl) +
           " != tabela de equivalência INTEIRA " + JSON.stringify(D010_EQUIVALENCIA_NOME));
    const noNo = d010MapItems(w, H.qid, ansNow[K(H.qid)]);
    const anex = (svcs[H.capability] || []);
    let comServico = 0;
    H.pares.forEach(p => {
      if (noNo.indexOf(p.chaveMap) < 0)
        fail("homônimo " + p.chaveMap + " fora de MAP[" + H.qid + "].lv[atual].c = " + JSON.stringify(noNo));
      if (d010ProductName(w, p.chaveMap) !== p.nome || d010ServiceName(w, p.servico) !== p.nome)
        fail("homônimo " + p.servico + "/" + p.chaveMap + " não renderiza " + JSON.stringify(p.nome));
      const est = anex.indexOf(p.servico) >= 0;
      if (est !== p.anexado)
        fail("homônimo " + p.servico + ": anexado a " + H.capability + " = " + est + ", declarado " + p.anexado);
      if (est) comServico++;
    });
    if (comServico !== 1)
      fail("homônimos com serviço anexado = " + comServico + " (esperado exatamente 1) — sem um anexado e um livre " +
           "o card de " + H.qid + " perde uma das duas direções da fusão");
  }

  return true;
}

module.exports = {
  D010_F1, D010_F1b, D010_F2, D010_F3, D010_F4, D010_FIXTURES, D010_DECLARED,
  D010_GAP_QIDS, D010_ALVOS_VAO, D010_ALVOS_SERVICO, D010_HIDE_EYEBROWS,
  D010_EQUIVALENCIA_NOME, D010_VACUIDADES_CONHECIDAS, D010_DECLARACOES_OBRIGATORIAS,
  d010VecVao, d010ApplyContext, d010ApplyResults,
  d010Eval, d010Answers, d010ConfirmedCount, d010ComparisonPublishable,
  d010MapItems, d010MapKeys, d010ProductName, d010ServiceName, d010EquivalenciaNome,
  d010CapOf, d010EnablerCount, d010StateWith, d010StateOf, d010CtxStateOf, d010TargetsByState,
  d010PresentationOf, d010HasSubstitute, d010BasePresented, d010BaseInV32Base, d010CardsSemPayload,
  d010ServicesByCapability, d010TargetEnablers, d010FrozenTitles, d010AssertFixtureStates
};
