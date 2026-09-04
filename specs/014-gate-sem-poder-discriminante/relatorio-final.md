# Relatório final — 014-gate-sem-poder-discriminante

> Fase 6 · T084 · dono: `doc-writer` · 2026-09-04.
> Branch `feature/014-gate-sem-poder-discriminante` · HEAD `51e6c69` · PR
> [#36](https://github.com/oflavioc/quickscan-secops/pull/36).
> Demanda conduzida **sob a delegação do proprietário de 2026-08-29**
> (`.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`)
> — nenhuma ratificação nominal nova foi pedida nem dada; a errata **E13**
> exigiu a citação explícita do registro da delegação antes de agir sobre ela
> (`spec.md:662-672`), e isso está registrado, não presumido.
> Este relatório **não emite veredito**. Todo número aqui vem de execução
> citável ou de registro canônico; o que não foi executado está declarado como
> não executado, com o motivo (R2 §1). Decidir PASS/FAIL é do `qa-engineer`;
> confirmar o conteúdo de invariante/glossário é do `product-owner`.

## O eixo do relatório

A demanda 014 nasceu para construir um instrumento — a varredura estática de
regra morta por cascata (`.claude/verify/regra_morta.js`) — que separasse
**gate saudável sem poder discriminante** (`EA-7`, `EA-20`) das outras doenças
já catalogadas (âncora podre, ambiente ausente, campanha que não roda). O que
torna este fecho honesto é que a demanda **encontrou dentro de si mesma a
patologia que existe para expor**.

Na wave 5 ela aposentou `M51-01`, removeu a exceção `KI-4` e registrou
substituição nominal alegando que *"a propriedade é medida pelo par
`D014-M10`/`P52-LAY2`"* (`mutation-matrix.json`, T050). O job `visual` do CI
**falsificou a alegação**: run **33516136516**, `SOBREVIVENTE D014-M10 · gate
P52-LAY2 · o gate esperado NÃO reprovou — sem poder discriminante`. O
diagnóstico por execução (T081, errata **E13**) excluiu, nesta ordem, falha de
ciclo (hash do artefato construído sob mutação, conferido diferente do base) e
regra morta na folha (o próprio instrumento desta demanda, `censo_ok`, zero
mortas) — a raiz é a **interação entre duas propriedades de camadas
diferentes**, e o raciocínio pinado na spec original era **CSS errado**:
colocação explícita (`grid-column`) nunca empilha; quem decidia "uma coluna só"
na cabeça de quem escreveu a spec nunca decidiu isso no navegador.

**Datação** (`git log -S`): a área nomeada da 5.1 nasceu em `4aa1f12`
(2026-08-22); a regra da 5.2 que passou a governar a composição, em `c1e3649`
(2026-08-24); o mutante que assumiu a forma errada, em `7c93899` (2026-09-01).
**O par nasceu sem faca — não apodreceu.** É a distinção que separa este caso de
`EA-30` (prova de discriminância vencida, onde a prova existiu e decaiu):
aqui nunca houve prova nenhuma na forma antiga, e a datação é o que prova a
diferença.

Corrigido pela errata **E13**: `D014-M10` foi reancorado em
`ui_p52_workspace_v32.css:86` (`.wrap > #p50-shell { grid-column: 2 }` →
`grid-column: 1`), mesmo arquivo, mesmo bloco `@media`, mesma camada 5.2,
medido **DETECTADO 1/1** em reprodução não-canônica, **sem tocar
`tests_p52_chromium.js`** (suíte invocada, nunca editada — vedação que a E13
mantém explícita).

## Cadeia da demanda — fases e commits

| Fase | Commits (amostra) | O que entregou |
|---|---|---|
| 0 Refinamento | `ec77053` `7f8c250` | derrubou a premissa de "família": é 1 caso em 42, não uma classe — 36 imunes por estrutura, 1 por oráculo, 4 vivos. Causa real um nível abaixo: o gatilho por path vigia o que a campanha muta, nunca o que decide o resultado |
| 1 Spec | `c74679c` `a5b2688` | seis erratas E1–E6; a terceira refutação foi do próprio `product-owner` |
| 2–3 Plano/Tarefas | `2069575` `7527c39` | prefixo vácuo + mídia semântica; defeito silencioso e verde cometido no próprio instrumento por medição prévia; 85 tarefas em 9 waves |
| 4 Red | `71b4347` | **2 PASS · 5 FAIL de 7**, commitado — vermelho substantivo: 49/49 mutantes de CSS sem âncora |
| 5 Implementação (waves 1–4) | `3741ed0` `d4bba3e` `af8dfd9` `b027ce2` | o instrumento (`regra_morta.js` + `regra_morta_seletor.js`), contrato C1 estendido a 6 harnesses |
| Wave 5 (fecho indivisível) | `49f5bec` `dfd2551` | aposentadoria de `M51-01`, remoção da `KI-4`, exclusão nominal de `P52-RA8` — os três num commit |
| E7–E9 | `d3b002d` `58b2fe4` | mutante parcialmente inerte (`P52-RA8`/`EA-32`); veredito em par (mortas, indecidíveis); vermelho crônico recusado |
| Wave 6 | `40f8b89` `7c93899` `5cf7c82` | harnesses `d014` (9 mutantes) e `d014vis` (`D014-M10`); campanha `d014` **9/9 DETECTADO**; par `D014-M10`×`P52-LAY2` nasce `NÃO EXECUTADO` |
| Wave 8 (validação) | `e7f1f79` `ca38462` `57392a3` `26d0b05` | `EA-32`/`EA-33` alocados; erratas E10–E12 (arbitragem de forma); `spec-validate` 19/19 |
| Aceite condicionado | `bdda9a1` `a65c19d` | PO: **não encontrei objeção**, condicionado ao veredito do job `visual` |
| E13 (T081 reaberta) | `cba0c17` `809f870` `88930b0` `24acad6` `51e6c69` | diagnóstico do SOBREVIVENTE, reancoragem `:86`, sonda diagnóstica, proveniência da delegação citada, repin R13 |

## Números — o que cada gate emitiu, com a execução que sustenta

Execução própria do `doc-writer` em 2026-09-04, HEAD `51e6c69`, árvore limpa
antes e depois, node v24.19.0 · python 3.14.7:

```
bash .claude/verify/run.sh --light
[PASS] env-doctor · [PASS] baseline · [PASS] boundary · [PASS] marker-lint
[PASS] icons-check · [PASS] build · [PASS] lint-arch · [PASS] regra-morta
[PASS] state · [PASS] tdd · [PASS] m41
verify: 11 PASS · 0 FAIL
```

```
bash .claude/verify/compliance-audit.sh
compliance: 14 PASS · 0 FAIL — 19 achados abertos listados (inclui EA-34, novo)
```

As demais contagens abaixo foram **medidas na wave correspondente**, citadas
aqui como executadas, com a fonte de registro:

| Medição | Número | Fonte |
|---|---|---|
| Campanha `d014` (`D014-M1…M9`) | **9/9 DETECTADO** | `mutation-matrix.json`, wave 6/7 (T071) |
| `tests_014_regra_morta.js` | **7 PASS · 0 FAIL** | `expected_suites.json → suites.d014._trilha` |
| `spec-validate` (T082) | **19/19 conformes** | `planning-state/014-*.json → validate.conformance` |
| Sonda do instrumento sobre a árvore | população **50** · avaliados **47** · **0 mortas** · indecidíveis **20** (14 mutantes) | `expected_suites.json → suites.d014._trilha`, medição de wave 6 |
| Retirada a exceção `achado-aberto` (`P52-RA8`) | volta **1 morta** | mesma `_trilha` — a exceção é **carga**, não afrouxamento |
| Run de CI **33516136516** (workflow_dispatch sobre `5cf7c82`) | `p50` 53/53 · `p51` 19/19 · `p52` 107/107 · `d011` 19/19 · `d014` 9/9 · **`d014vis` 0/1** (SOBREVIVENTE, forma `:77`) | `mutation-matrix.json → _meta.execucao_ci_demanda_014` |
| Indecidíveis com a forma reancorada (`:86`) | de 20 em 14 mutantes para **21 em 15** — **não pinado** (E9, segundo prazo) | `spec.md` E13 item 5; `mutation-matrix.json` par `D014-M10` |
| Reprodução não-canônica da forma `:86` (T081, 2026-09-04) | **DETECTADO 1/1** | `mutation-matrix.json` par `D014-M10 → ultima_prova` |

**Nota sobre o número de indecidíveis parado em 20**:
`.claude/verify/regra_morta.json → indecidiveis.arvore.observado_em_2026_09_01`
ainda registra **20** — é o valor da wave 6/8, anterior à E13, mantido como
**trilha histórica** (R2 §5): o segundo prazo da E9 continua aberto, e o 21 da
forma reancorada só vira pin quando a árvore "parar de se mexer" (T070). Não é
divergência silenciosa: é o mesmo campo, com o mesmo prazo, ainda não fixado
por execução.

## Achado da Tarefa 1 desta entrega — id permanente

**`EA-34`** — *"declaração viva" não implica "mutação observável pelo gate":
o limite do instrumento de regra morta por cascata*, alocado neste turno contra
`origin/develop` (maior id em qualquer branch/remoto conferido: `EA-31`; nesta
branch já existiam `EA-32`/`EA-33` sem colisão — `EA-34` é o próximo).

Cadeia: `.claude/verify/regra_morta.js:227` (`classificarDeclaracao` só compara
concorrentes da **mesma propriedade**) + `:392-412` (`diferenca()` agrupa por
contexto de mídia, seletor e propriedade) → uma declaração cujo efeito é
neutralizado por **outra propriedade**, de **outra camada**, nunca compete na
mesma chave → `D014-VARR1` fica verde e o instrumento diz "viva" para uma
declaração cuja mutação o gate `P52-LAY2` não conseguia observar (a forma `:77`
de `D014-M10`, SOBREVIVENTE no run 33516136516). **É limitação declarada do
instrumento, não defeito dele**: a demanda 014 o construiu para medir cascata
por declaração, e é isso que ele faz corretamente. O texto completo, com a
distinção contra `EA-20` (aqui o gate tem poder discriminante — a forma `:86`
prova **DETECTADO 1/1**) e contra `EA-32` (mesma família de sintoma — regra que
perde na cascata —, mas dentro da mesma propriedade, não entre propriedades),
está em `.claude/BACKLOG.md`, seção `## EA-34`.

## Citações da forma antiga — trilha, não erro

Ficam no repositório, sem edição, porque descrevem a forma **refutada** de
`D014-M10` (`:77`) e são histórico de como a demanda chegou à forma correta
(`:86`). Quem ler depois precisa saber que descrevem o raciocínio que a E13
corrigiu:

- `tasks.md:31` (T061) — cita `ui_p52_workspace_v32.css:77 → minmax(0, 1fr)`.
- `plan.md:74` — tabela de especificidade que compara `M51-01`/`M51-08` contra
  `ui_p52_workspace_v32.css:77`.
- `tests_p51_mutants.js:135-137` (comentário do bloco `M51-01`) — cita
  `ui_p52_workspace_v32.css:74-77` como o sítio que passou a governar.
- `.claude/verify/regra_morta.json → indecidiveis.arvore.observado_em_2026_09_01`
  — **20**, valor anterior à forma reancorada (ver nota acima).

Nenhum dos quatro é lido por stage de máquina como fonte de verdade sobre a
forma atual do mutante — a forma canônica vive em `mutation-matrix.json` (par
`D014-M10`) e no harness `tests_014_mutants_visual.js`, ambos já na forma `:86`.

## Pendências que ficam abertas

| # | Item | Estado, com a causa medida |
|---|---|---|
| 1 | **Par `D014-M10`×`P52-LAY2`** | `NÃO EXECUTADO` na matriz, causa `ambiente sem chromium`. T081 **reaberta**: job `visual` disparado neste turno — run **33834890154** (`workflow_dispatch` sobre a branch, PR #36, jobs `verify` e `visual` em andamento no momento deste relatório). **Não presumo o resultado** — fica em voo, e quem fecha o par com a referência da execução é o `qa-engineer` |
| 2 | **`EA-32`** | mutante parcialmente inerte (`P52-RA8`) — espera o veredito de `P52-ICON2` sob mutação parcial no **mesmo** run 33834890154. Se `P52-ICON2` sobreviver, é um segundo par sem poder discriminante e o achado cresce |
| 3 | **`EA-34`** (Tarefa 1 deste relatório) | achado novo, aberto — o remédio (documentar o limite, segunda fase do instrumento, ou nenhum) não é decidido aqui |
| 4 | **Aceite de intenção do `product-owner`** | registrado em `bdda9a1`/`a65c19d` como **"não encontrei objeção"**, **condicionado por escrito** ao veredito do job `visual` (`planning-state → validate.notes`). Com o run 33834890154 em andamento, o aceite **volta como iteração** neste ponto — é decisão já tomada pelo PO antes de saber o resultado, não uma reabertura desta entrega |
| 5 | **Termo `mutante parcialmente inerte`** | classe nomeada pela errata E7, ainda fora do `CONTEXT.md` — recomendado no fecho anterior, glossário é do `product-owner` |
| 6 | **Waves 7–8 sem registro próprio no `planning-state`** | o bloco `implement` registra só waves 1–6; é a instância `EA-33` desta mesma demanda (fase × histórico de git) |

## O que este relatório não decide

Se `EA-34` vira demanda própria, campo de registro ou fica só documentado — é
do orquestrador (R4) e do `qa-engineer`; o veredito de `P52-ICON2` sob mutação
parcial (`EA-32`) e o fecho do par `D014-M10`×`P52-LAY2` são do `qa-engineer`,
lendo o run 33834890154 quando terminar; o vocabulário novo no `CONTEXT.md` é
do `product-owner`; release/selagem e merge do PR #36 são do proprietário, no
chat.

## Fontes citadas

- `specs/014-gate-sem-poder-discriminante/`: `refinement.md`, `spec.md`
  (erratas E1–E13), `plan.md`, `tasks.md`
- `.claude/project-memory/planning-state/014-gate-sem-poder-discriminante.json`
  — blocos `refinement`, `specify`, `plan`, `tasks`, `red`, `implement`,
  `validate` (aceite do PO em `validate.notes`, condicionado)
- `.claude/verify/mutation-matrix.json` — par `D014-M10`, `_meta.execucao_ci_demanda_014`,
  `dividas_declaradas` (`p51/M51-01`)
- `.claude/verify/regra_morta.json` — `classes_de_achado.mutante-parcialmente-inerte`,
  `exclusoes[2]` (`P52-RA8`/`EA-32`), `indecidiveis.arvore`
- `.claude/BACKLOG.md` — `EA-7`, `EA-20`, `EA-32`, `EA-33`, `EA-34` (novo)
- `.claude/verify/check_mutation.py:895-912` — `IC-9.2`/`IC-9.3`
- Execução direta: `bash .claude/verify/run.sh --light` (11 PASS · 0 FAIL),
  `bash .claude/verify/compliance-audit.sh` (14 PASS · 0 FAIL), ambas em
  2026-09-04, HEAD `51e6c69`
- `gh run view 33834890154` — confirmação de que o run está em andamento
  (PR #36, jobs `verify` e `visual`)
