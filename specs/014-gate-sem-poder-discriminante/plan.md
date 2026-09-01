# Plano — 014-gate-sem-poder-discriminante

> Fase 2 · dono: tech-lead · consome a [spec.md](spec.md) aprovada. Propõe, não
> delega: a execução é do orquestrador.
>
> **Trilha**: produzido na trilha Opus (decisão de créditos do orquestrador),
> não no modelo `fable` pinado.

## Desenho

### Camada e superfície

**Nenhuma superfície de produto é tocada.** A entrega inteira vive na camada de
**verificação** (`.claude/verify/**` + suítes/harnesses na raiz). Nada renderiza,
nada entra no HTML construído, nada toca sessão. Consequência declarada:
**R9 §5 não se aplica por ausência de dado novo** — não há owner de estado a
nomear, porque não há estado novo.

Módulos criados (um dono por módulo):

| módulo | papel | dono |
|---|---|---|
| `.claude/verify/regra_morta.js` | o instrumento: parse, normalização, predicado, cascata, relatório | `build-engineer` |
| `tests_014_regra_morta.js` | os gates `D014-*` (oráculo) | `qa-engineer` |
| `fixtures_014_regra_morta.js` | folhas sintéticas de C1/C6 | `qa-engineer` |
| `.claude/verify/regra_morta.json` | exclusões nominais + contagem de indecidíveis + censo de parse | `qa-engineer` |
| `tests_014_mutants.js` | harness `d014` (D014-M1…M9) | `qa-engineer` |
| `tests_014_mutants_visual.js` | harness `d014vis` (D014-M10) | `qa-engineer` |

**R3 §2 respeitado**: quem escreve os gates (`qa-engineer`) não implementa o
instrumento (`build-engineer`).

### O predicado da varredura — estreito de propósito, e agora completo

A spec fixou a forma (**mesma propriedade · mesmo contexto de mídia · seletores
por relação decidível**) e deixou o **normalizador** e o **contexto de mídia**
para esta fase. Ficam assim:

**1. Normalização de seletor**

1. Lista separada por vírgula → **um seletor por vez** (a declaração replica).
2. Espaço em branco colapsado; espaços normalizados em torno de `>`, `+`, `~`.
3. Aspas de seletor de atributo normalizadas para `"`; o **valor** permanece byte
   a byte.
4. **Sem case-folding.** Divergência de caixa → indecidível (conservador).
5. Tokenização em **compostos** separados por combinador descendente.
6. **Gramática recusada → indecidível, nunca "provavelmente viva"**: `:is()`,
   `:where()`, `:not()`, `:has()`, `:nth-*(...)` com seletor interno, `::part`,
   `::slotted`, e qualquer combinador não-descendente (`>`, `+`, `~`) na parte
   que seria prefixo — prefixar `a > b` muda semântica, então a relação de
   prefixação **não se aplica** e sobra apenas a identidade.

**2. Relação decidível** (as duas formas dos casos reais, e só elas)

- **(R-a) idênticos** após normalização.
- **(R-b) prefixação de compostos**: a sequência de compostos de `A` é **sufixo**
  da de `B`, com k ≥ 1 compostos extras à esquerda, todos ligados por combinador
  descendente.

**3. A peça que faltava: prefixo vácuo** — é ela que separa os dois casos reais

Prefixar **restringe**: `B ⊆ A`. Logo `B` vencer **não mata** `A` — `A` continua
vencendo fora de `B`. Salvo quando os compostos extras casam **todo** elemento do
documento. Chamo esses de **compostos vácuos**: `html`, `body`, `:root` e
combinações — e **apenas** eles, porque todo elemento sob `<body>` tem `html` e
`body` por ancestrais. Composto de prefixo com id, classe, atributo ou pseudo
**nunca** é vácuo.

| | prefixo extra | vácuo? | veredito |
|---|---|---|---|
| `M51-01` | `html` sobre `body[data-uxscreen="question"] .wrap` | **sim** | competição total → a declaração da 5.1 é **morta** |
| `M51-08` | `#ux-target` sobre `.ux-tgt-row select option` | **não** | a curta vence fora do prefixo → **viva** |

Medido no fonte: `ui_p50_v32.css:696-697` `(0,2,1)` × `ui_p52_workspace_v32.css:77`
`(0,2,2)`. **Sem esta regra o classificador passa em (a)–(d) e ainda assim
declara `M51-08` morta** — por isso ela ganha alínea e mutante próprios (errata
E5, `D014-M9`).

**4. Contexto de mídia** — também estreito e declarado

Normalização: espaços colapsados, espaço após `:` removido nas features, nomes de
feature e tipo em minúsculas, **tipo ausente ≡ `all`**.

Relação entre contextos:

- **idênticos** → competem;
- **contenção por tipo** — mesmas condições, um com tipo `all` e outro com
  `screen`/`print`: o de tipo `all` compete em ambos; o restrito só no seu. O
  restrito é morto se perde no seu tipo; o `all` só é morto se perde em **todos**
  os tipos em que compete;
- **qualquer outra relação** (features diferentes, ranges, `and`/`or` compostos,
  `not`) → **indecidível** (C6).

Isto não é teoria: `M51-01` vive em `@media screen and (min-width:1180px)` e a
regra que o mata vive em `@media (min-width: 1180px)` — **textos diferentes**. Um
normalizador que só comparasse texto diria "contextos distintos, não competem" e
devolveria "viva" para o único caso morto do repositório.

**5. Vencedora**: importância (`!important`) → especificidade → ordem de inlining.
Nessa ordem, sempre.

**6. Regra morta**: a declaração perde em **todos** os contextos em que compete e
em **nenhum** é vencedora.

**7. Mutante aditivo** — resolvido sem mapa de offsets: para cada mutante de CSS,
a folha mutada é construída **em memória** (`find` → `repl`, nunca em disco —
R7 §3), as duas versões são parseadas e o conjunto de declarações
**introduzidas ou alteradas** sai da **diferença**. É a exigência literal da spec
(“a cascata medida sobre a declaração resultante, nunca sobre a âncora”) e cobre
de graça a classe aditiva (`M52`, `M53`, `P52-M8`, `P52-ER5/ER6`, `P52-FC2`).

### Três decisões de mecanismo que a medição impôs

**(a) O parser é o do jsdom — não `@bramus/specificity`, não parser próprio.**
`@bramus/specificity` está no `node_modules` **apenas como transitiva do jsdom**
(`npm ls`: `jsdom@30.0.1 └── @bramus/specificity@2.4.2`) e **não** consta do
`package.json`. Depender dela é dependência de ambiente implícita (R7 §4), e
declará-la exigiria editar `package.json`/`package-lock.json` — dois arquivos
**pinados** cuja cláusula de fase selada (`specs/PHASE_5_0_REV_B.md:1607-1608`)
os governa nominalmente. **jsdom é dependência declarada de primeira classe** e
foi **medido** nas cinco folhas reais:

| folha | regras de estilo | declarações | `@media` | regras vazias |
|---|---|---|---|---|
| `ui_v32.css` | 158 | 1175 | 11 | 0 |
| `ui_ux_v32.css` | 194 | 804 | 20 | 0 |
| `ui_p50_v32.css` | 219 | 1130 | 11 | 0 |
| `ui_p52_workspace_v32.css` | 526 | 2097 | 47 | 0 |
| `ui_d011_prioridade_v32.css` | 4 | 12 | 1 | 0 |

Entrega `selectorText`, a lista de propriedades, `getPropertyPriority`
(`!important`) e `media.mediaText`. Censo de at-rules do repositório: só `@media`
(+ 1 `@page`, 2 `@keyframes`) — **nenhum `@supports`**, então mídia é a única
dimensão de contexto, como a spec supôs. **A especificidade é calculada
internamente** sobre a gramática aceita (contagem a/b/c por composto); fora dela,
indecidível. Zero dependência nova, zero edição de toolchain.

**(b) Censo de parse pinado — a guarda contra a vacuidade de C2.**
Durante esta análise um contador meu deu **0–4 regras** para as cinco folhas; a
causa era `CSSStyleRule` expor `cssRules` vazio (CSS aninhado) e a recursão
engolir as regras de estilo. O erro era **silencioso e verde**: um scanner assim
responde "zero regras mortas" sem ter lido nada. Por isso o censo (regras e
declarações por folha) vive no registro canônico e **divergência reprova** — é a
mesma doença que a demanda combate, aplicada a ela mesma.

**(c) A entrada da varredura são as folhas-fonte na ordem do builder.**
Derivada de `build_v32_html.py:78` (`UICSS → UXCSS → P50CSS → P52CSS → D011CSS`,
constantes `:24-28`), com o CSS da Camada 1 (dentro do `<style>` do HTML
congelado) como **camada 0**. Ler o artefato construído seria acoplar a varredura
ao stage `build`; ler as fontes torna `D014-M4` visível sem reconstrução.
Conferência de C5: as folhas nomeadas em `specs/PHASE_5_0_REV_B.md:1606`
aparecem na ordem observada como **subsequência**, e folhas posteriores só podem
ser acrescentadas **ao fim** — reordenar é vedado (âncora normativa de fase
selada).

## Contratos e registros

- **Bridges**: nenhum. Nada aqui é módulo de produto; `bridges.json` não muda.
- **Patch-points**: nenhum. Nenhum monkey-patch, nenhuma função global estendida.
- **Ordem de injeção no builder**: **lida e conferida**, nunca alterada (C5).
- **Contrato C1 estendido (aditivo)** — a peça que a spec não mediu: o preflight
  de hoje emite por mutante apenas `{id, arquivo, ocorrencias, estado}`
  (verificado por execução: `node tests_p51_mutants.js --preflight`). **A âncora
  não está lá**, e sem ela a varredura não sabe *qual* declaração a mutação
  altera. Os harnesses já a têm em mãos (`tests_p51_mutants.js:124-131`, campos
  `find`/`repl`). C1 ganha, **para mutantes de CSS**, os campos `find` e `repl`.
  É aditivo: `check_mutation.py` valida apenas as chaves obrigatórias, e nenhum
  consumidor existente quebra.
- **`d014` e `d014vis` em `mutation_map.json`** — `"preflight": true` declarado
  **no mesmo commit** em que o harness passa a ler `--preflight` em argv (D4 da
  013; a guarda de fonte de `check_mutation.py:293-299` recusa a chave sem o
  modo). Alvos de `d014`: as **cinco folhas CSS** + `build_v32_html.py` +
  `tests_014_regra_morta.js` + `tests_014_mutants.js`. Incluir as folhas é a
  tese da demanda aplicada a ela mesma — *o gatilho passa a vigiar o que decide o
  resultado*. Desvio declarado que **endurece** o trigger, no precedente
  d009/d010/d011 (IC-6 é nominal à p51, não há laço genérico).
- **`.claude/verify/regra_morta.json`** (owner `qa-engineer`): `exclusoes[]`
  (`harness` · `mutante` · `motivo` do vocabulário fechado `oraculo-de-fonte` |
  `fallback-declarado` · `propriedade_afirmada` · `arquivos_lidos`),
  `indecidiveis.contagem` e `censo[]` por folha. Nunca prosa.
- **Pins**: todo arquivo criado/alterado é rastreado e pinado. `gen_pins.py` lê
  **blobs de HEAD** → o repin é sempre um **commit chore posterior**, um por
  commit de conteúdo (série R3…R11, abaixo).

## Boundary

**Classe tocada mais alta: nenhuma — produto/verificação.** Conferido nas quatro
fontes, com o negativo explícito:

1. `boundary.json → frozen` lista quatro paths (`engine_v32.js`,
   `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`,
   `v3_1_3_functional_snapshot.json`). **Nenhum arquivo desta demanda está lá.**
2. `PROTECTED` (`tests_p50_core.js`) tem **duas** chaves: `engine_v32.js` e
   `quickscan_secops_soccmm_v3_1_3.html`. `frozenSuites` (`:446-449`) tem 13
   suítes e **nenhum harness `*_mutants.js` está entre elas** — nem
   `tests_p50_mutants.js`, nem `tests_p51_mutants.js`, nem `tests_p52_mutants.js`.
   Resultado negativo, medido, não presumido.
3. `permissions.deny` não cobre nenhum arquivo desta demanda.
4. Pins: identidade, não proibição — repin no mesmo PR.

**Não há rito D2 e não há parada.** O rito é o comum: TDD (R3) + repin (R8) +
`expected_suites.json` no mesmo PR (R10 §3).

Um ponto **verificado e liberado**, não presumido: `D014-M7` muta
`build_v32_html.py`, que `specs/PHASE_5_0_REV_B.md:1606` chama de "permanece
protegido" **em prosa**. Não é parada — o precedente vivo é `D011-M18`, que muta
o mesmo arquivo dentro do harness automatizado com restauração. A linha que a
011 traçou e que esta demanda respeita: harness automatizado **nunca** toca
`PROTECTED`/`frozen` (esses vão a worktree efêmera manual); `build_v32_html.py`
não é nenhum dos dois.

## Checklist R9 (módulo novo)

Não se aplica ao produto — **nenhum módulo de produto é criado**. `lint-arch`
varre `ui_p5*`/`ui_d0*`, fora do alcance desta entrega. Mantidos por disciplina:

- [x] IIFE + `__installed` — **N/A** (não é módulo de UI)
- [x] um bridge registrado — **N/A** (nenhum bridge)
- [x] CSS por prefixo — **N/A** (nenhum CSS novo; as fixtures são strings, não
      arquivos `.css`, para não entrarem na árvore varrida nem no builder)
- [x] zero `innerHTML=` — vale para `regra_morta.js` e para as suítes
- [x] ≤600 linhas — orçamento estimado ~490 para `regra_morta.js`. **Gatilho de
      divisão declarado**: passando de 600, separar em
      `regra_morta_seletor.js` (normalizador + especificidade) e
      `regra_morta.js` (cascata + relatório). Decisão do implementador, com o
      motivo no commit.
- [x] helper único por semântica — a normalização de seletor e a de contexto de
      mídia existem **uma vez**, em `regra_morta.js`, e a suíte as consome pela
      API do módulo; comparação literal duplicada na suíte é FAIL de revisão.

## Onde a varredura roda

Stage próprio em `pipeline.yaml` (R10 §9), **depois de `lint-arch`** (mesma
família: lint estático sobre fonte):

```yaml
  regra-morta:
    desc: "Regra morta por cascata: nenhum mutante de CSS ataca declaração que perde em todos os contextos; indecidíveis nomeados e contados"
    run: node tests_014_regra_morta.js
    parallel: true
    mutates: false
    heavy: false
```

`heavy: false` e **sem Chromium** é o ponto da demanda: o defeito ficou escondido
meses porque a prova morava no job `visual`. Com isso a varredura entra também no
`--light` do hook Stop. Medido: o `--light` de hoje tem **10 stages**; passa a 11,
e nenhum registro pina a lista de stages (`run.sh` a lê do próprio
`pipeline.yaml`), então não há churn de registro. A suíte roda **duas vezes** no
pipeline completo (stage + `suites`), de propósito e a custo desprezível: o stage
é quem garante a execução em todo turno.

## Medição de campanhas — quais disparam, e onde cada uma fecha

O pedido explícito: repetir aqui a medição que mudou o desenho na 011. Feita.
`check_mutation.py:466-471` calcula o diff contra `merge-base(HEAD, origin/develop)`
e `:1291` reprova por ambiente ausente, salvo `MUTATION_DEFER_MISSING=1` — que o
job `verify` do CI define (`.github/workflows/verify.yml:42`) e o job `visual`
não precisa, porque lá o Chromium existe e ele roda `check_mutation.py` (`:81`).

| arquivo que a demanda edita | campanha disparada | ambiente | fecha onde |
|---|---|---|---|
| `tests_009_mutants.js` | `d009` | node/python | **nesta máquina** |
| `tests_011_mutants.js` | `d011` | node/python | **nesta máquina** |
| `tests_014_regra_morta.js`, `tests_014_mutants.js`, folhas CSS | `d014` | node/python | **nesta máquina** |
| `tests_p50_mutants.js` | `p50` (53 mutantes) | **chromium** | job `visual` do CI |
| `tests_p51_mutants.js` | `p51` (20 mutantes) | **chromium** | job `visual` do CI |
| `tests_p52_mutants.js` | `p52` (107 mutantes) | **chromium** | job `visual` do CI |
| `tests_014_mutants_visual.js`, `ui_p52_workspace_v32.css` | `d014vis` | **chromium** | job `visual` do CI |

Duas consequências que o desenho absorve em vez de descobrir tarde:

1. **A p51 iria para o CI de qualquer jeito** — aposentar `M51-01` exige editar
   `tests_p51_mutants.js`, que é alvo dela. Não há rota que evite isso.
2. **A extensão de C1 leva p50 e p52 junto.** É o preço medido de ter a âncora na
   fonte única (o harness que a possui) em vez de num registro paralelo que
   apodrece — e a spec já proibiu o registro paralelo ("população lida do
   preflight, **nunca dos pares da matriz**"). Localmente o operador roda
   `MUTATION_DEFER_MISSING=1 bash .claude/verify/run.sh`, e as três saem
   **nomeadas como delegadas**, nunca em silêncio.

**O que fecha sem Chromium, e é uma boa notícia**: o carrasco da `KI-4`. Medido
em `check_mutation.py:895-907` — **IC-9.2** reprova quando a exceção nomeia
mutante que o harness não declara mais (oráculo: preflight), e `:921` (IC-9.3)
reprova quando não há par na matriz. Ou seja, aposentar `M51-01` e deixar a
`KI-4` viva reprova **nesta máquina**, sem job visual. (A spec atribuía o
carrasco a IC-9.1/IC-9.4-ii; `mut_perdao` na verdade **não faz nada** quando a
campanha deixa de emitir o id — `alvo is None` → `continue`. Errata E2.)

## Erratas da spec — wave 0, antes do red

Cada uma medida, não opinada. Forma: amenda a célula, preserva o id do critério.

| # | célula | correção | por quê (medido) |
|---|---|---|---|
| **E1** | §Contratos · `d014.requires` | **dois** harnesses: `d014` (`[node, python]`, D014-M1…M9) e `d014vis` (`[node, python, chromium]`, D014-M10) | com chromium em `d014`, **todo** commit de implementação desta demanda deixa o stage `mutation` vermelho localmente, e D014-M1…M8 (que não precisam de Chromium) só rodariam no CI. Precedente: d011 defere D011-M9 ao job visual — aqui a deferição é **automatizada**, porque o job visual já executa `check_mutation.py` |
| **E2** | C7 · §Disposição-3 | o carrasco é **IC-9.2** (mutante inexistente no harness) e **IC-9.3** (par ausente na matriz) | `mut_perdao` no-opa quando o id some da campanha; IC-9.4 cenário ii não dispara após aposentadoria |
| **E3** | C2 | a população vem do preflight **e a âncora também**, por extensão aditiva de C1 (`find`/`repl` em mutantes de CSS, nos 5 harnesses que os possuem) | o preflight de hoje não emite âncora; sem ela a varredura não decide nada. Medido por execução |
| **E4** | §Comportamento · mecanismo | parser = **CSSOM do jsdom** (dependência declarada); especificidade calculada **internamente** | `@bramus/specificity` só existe como transitiva do jsdom, ausente do `package.json` (R7 §4); declará-la editaria `package.json`/`package-lock.json`, nominalmente governados por `PHASE_5_0_REV_B.md:1607-1608` |
| **E5** | C1 | **alínea (e)**: viva por **prefixo não-vácuo**; mutante `D014-M9` (id livre na spec) | é o que separa `M51-01` de `M51-08`. Sem (e), um classificador que ignora vacuidade passa em (a)–(d) e declara `M51-08` morta |
| **E6** | C2 | **censo de parse pinado** por folha (regras/declarações); divergência reprova | um parser que degrada em silêncio torna "zero regras mortas" vacuosamente verdadeiro — falha reproduzida nesta análise |

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| 0 | Errata E1–E6 na spec; planning-state; repins R3/R4 | — |
| 1 | Fixtures sintéticas + registro `regra_morta.json` (esqueleto) | 0 |
| 2 | Suíte `tests_014_regra_morta.js` (gates) + **RED commitado** + `expected_suites.json` | 1 |
| 3 | Contrato C1 estendido nos 5 harnesses (`find`/`repl`) | 2 (gate antes de implementação) |
| 4 | `regra_morta.js` + stage `regra-morta` no `pipeline.yaml` | 3 (contrato antes do consumidor) |
| 5 | Fecho da regra morta: aposenta `M51-01` + matriz + **remove `KI-4`** (commit atômico) | 4 |
| 6 | Harnesses `d014`/`d014vis` + entradas no `mutation_map.json` (preflight no mesmo commit) | 5 |
| 7 | Fixação **por execução**: contagem da suíte, contagem de indecidíveis (não-vacuidade de C6), censo | 6 |
| 8 | Validação: campanha `d014` local, `spec-validate`, aceite do PO, relatório; par `D014-M10` fechado pelo job `visual` | 7 |

Ordem ditada por dependência real, não por conveniência: **gate antes de
implementação** (2 → 4), **contrato antes do consumidor** (3 → 4), **registro
antes do consumo** (1 → 2, 6 → 8). A última wave é sempre a validação.

## Série de repins

`gen_pins.py` pina blobs de **HEAD**: nenhum repin cabe no commit que altera o
arquivo. **Um commit `chore` de repin por commit de conteúdo**, dono
`build-engineer`, mensagem `chore(014): gen_pins — R<n> (<motivo>)`.

| repin | fecha o commit de | wave |
|---|---|---|
| R3 | `plan.md` + `tasks.md` | 0 |
| R4 | errata da spec | 0 |
| R5 | fixtures + registro | 1 |
| R6 | suíte + RED + `expected_suites.json` | 2 |
| R7 | contrato C1 nos 5 harnesses | 3 |
| R8 | `regra_morta.js` + `pipeline.yaml` | 4 |
| R9 | aposentadoria + matriz + `KI-4` | 5 |
| R10 | harnesses + `mutation_map.json` | 6 |
| R11 | fixação por execução + relatório final | 7–8 |

R0/R1/R2 (refinamento, planning-state, spec) já saíram. Wave de dois commits
vira R\<n\>a/R\<n\>b — refinamento de granularidade, não desvio; repin fora desta
previsão vai **registrado no relatório final**, nunca silenciado.
`.claude/project-memory/**` é excluído do registry: commit de planning-state não
pede repin.

## Riscos e rollback

| risco | como se detecta | rollback |
|---|---|---|
| A varredura fica **vacuosa** (parser lê pouco e diz "zero mortas") | censo de parse pinado (E6) + `D014-M4`, que planta uma regra morta real na árvore | corrigir o parser; o censo é o oráculo, e a contagem nunca é rebaixada para caber no verde (R10 §1) |
| **C6 vacuosa**: nenhum indecidível na árvore real | medição da wave 7 | a guarda já está na spec — o caso indecidível **sintético** é obrigatório e carrega o critério; a alínea da árvore real é declarada vacuosa **no registro, com a razão**, nunca apagada |
| Especificidade própria erra em gramática exótica | `D014-M1`/`M2`/`M3`/`M9` + as cinco alíneas de C1 | a gramática recusada cai em indecidível por construção; fallback nomeado: voltar a `@bramus/specificity` **e** declará-la no `env_doctor` (rota precificada, não usada) |
| `npm ci` deixar de trazer o parser | jsdom é dependência **declarada**; `env-doctor` roda antes das suítes | nenhum — é exatamente por isso que jsdom foi escolhido no lugar da transitiva |
| Extensão de C1 quebrar um harness existente | `IC-1`/`IC-4` para os 7 harnesses, em todo `mutation` | os campos são **aditivos**; reverter é remover duas chaves do objeto emitido |
| p50/p51/p52 não fecharem antes do merge | as três saem **nomeadas** como delegadas no stage local e no job `verify` | dívida declarada com prazo no relatório final; nunca silêncio (R10 §2) |
| Aposentar `M51-01` sem substituto provado | `IC-9.2`/`IC-9.3` reprovam localmente; `check_tdd` exige par completo | o par `D014-M10` nasce com `ultima_prova.resultado: "NÃO EXECUTADO"` + causa `ambiente sem chromium`, e a wave 8 o fecha com o resultado do job `visual` |

## Protótipo

**Não haverá.** A pergunta que só código responderia — *quantos dos 49 caem fora
da relação decidível* — foi parcialmente antecipada por medição direta nesta fase
(parser, censo de at-rules, população de 49 confirmada por preflight
harness a harness: d009 2 · p50 4 · p51 2 · p52 36 · d011 5), e o restante é
**o próprio entregável**: um protótipo do classificador seria o classificador,
duplicado e sem gate. A medição rides no instrumento, na wave 7, com dono e
tarefa (`T070`). O que um protótipo teria descoberto — que jsdom serve e que a
regra do prefixo vácuo é indispensável — já está acima, medido.
