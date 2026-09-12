# Plano — 018-cobertura-declarada-de-mutacao

> Fase 2 · dono: tech-lead · consome a [spec.md](spec.md) aprovada em 2026-09-11.
>
> **Nota de condução** (herdada): agentes de papel indisponíveis como subagentes
> nesta sessão; artefato escrito pelo orquestrador no contrato do `tech-lead`.

## ⚠ Correção de premissa — a afirmação que a demanda herdou é FALSA

Ao desenhar o `D018-COB1` eu ia registrar que ele nasceria **vermelho**, porque
`check_branch_protection.py` seria *"gatilho sem mutante"*. **Fui medir antes de
escrever a proposta de errata, e a afirmação não se sustenta.**

**Medido nesta data**, na `develop` em `312a18c`:

| `check_*.py` que é gatilho | harness | é mutado? |
|---|---|---|
| `check_fecho.py` | `d016` | **sim** |
| `check_eol_text.py` | `ea41`, `ea41i` | **sim** |
| `check_branch_protection.py` | `d016` | **sim** — `D016-M29`, *"o laço da sonda itera sobre `[]`"*; e `tests_016_mutants.js:144` declara `gateBp: path.join(V, "check_branch_protection.py")` como arquivo mutado |

**Os três gatilhos são mutados. O `D018-COB1` nasce VERDE**, junto com `POP1`,
`PRAZO1`, `MORTO1` e `POP1(b)`. Nenhuma errata da spec é necessária, a válvula de
dívida **não** precisa ser estendida à lacuna, e o desenho fica mais simples do que
eu ia propor.

### De onde veio a afirmação falsa, e por que isto fica escrito aqui

A frase *"apenas `check_fecho.py` é de fato mutado por um par (`M16`/`M29` de
`tests_016_mutants.js`)"* nasceu no corpo do **`EA-42`** em 2026-09-05 e atribuiu
a `check_fecho.py` um mutante — o `M29` — que na verdade muta
`check_branch_protection.py`. **Eu a repeti hoje sem medir, quatro vezes**: no
fecho do `EA-42`, no censo do `EA-3` (PR #56, já mesclado), no
[refinement.md](refinement.md) e na [spec.md](spec.md) desta demanda.

É precisamente o que a **R2 §4** proíbe — *alegação checável de outro registro se
verifica por execução antes de agir* — e é a doença da família **`EA-31`** que esta
demanda existe para instrumentar: **um registro afirmou o que a execução não
sustentava, e sobreviveu porque ninguém reexecutou.**

**Encaminhamento**: o `refinement.md` e a `spec.md` desta demanda foram emendados
no mesmo commit. A correção dos registros **já mesclados** (`EA-3` no
`.claude/BACKLOG.md` e a dívida `EA41-EOL0/EOL1` na `mutation-matrix.json`) é
trabalho próprio, fora desta demanda, e está nomeada para não se perder.

**O que a correção NÃO muda**: o `EA-3` continua inteiro. Os **seis órfãos**
seguem órfãos — foram reconferidos um a um por medição direta, não por herança de
registro — e são eles, não a lacuna, que sustentam a necessidade da demanda.

## Desenho

**Camada e superfície**: `.claude/verify/` — estrutura de verificação. Nenhuma
camada de produto é tocada; nenhuma superfície de UI existe nesta demanda.

| módulo | natureza | dono (um por módulo, R5) |
|---|---|---|
| `.claude/verify/mutation_population.json` | **novo** · dado declarativo | `build-engineer` |
| `.claude/verify/check_mutation_coverage.py` | **novo** · julgador | `qa-engineer` |
| `.claude/verify/pipeline.yaml` | **editado** · uma entrada de stage | `build-engineer` |
| `tests_018_mutants.js` + entrada `d018` no `mutation_map.json` | **novo** · harness | `qa-engineer` |

**Owner do estado do dado novo** (R9 §5): o arquivo de população é do
`build-engineer`, com repartição explícita de quem decide o quê — a **regra** é
decisão do `product-owner` (o que a máquina passa a cobrar); as **exceções e
dívidas** são de quem as pede, sempre com `motivo` e `prazo`.

**Por que o julgador é do `qa-engineer` e não de um implementador**: nesta demanda
o entregável *é* o gate. A R3 §2 separa quem escreve o critério de quem implementa
a correção — e a correção (adotar os órfãos) fica **fora de escopo**, em
`fix-finding` próprio. Precedente da casa: `check_eol_text.py` (EA-41) e
`check_fecho.py` (016) nasceram assim.

**Forma do harness de mutação**: cópia de shape de **`tests_ea41_instrumento.js`**
(EA-42), não de `d015`/`d016` — porque o alvo é um julgador **Python** e o padrão
que serve é o de mutar em **cópia efêmera** com o SHA do rastreado conferido antes
e depois (R7 §3 endurecido). Cópia de shape, nunca extração de runner comum.

## Contratos e registros

- **Bridges**: nenhum. Não há módulo de UI nem `window.__*`.
- **Patch-points**: nenhum. O stage novo não estende nem embrulha
  `check_mutation.py`; roda ao lado, com entrada própria no `pipeline.yaml`.
- **Ordem de injeção no builder**: não se aplica — nada entra no HTML.
- **Pins que mudam** (repin no mesmo PR, R8 §1): `pipeline.yaml` (editado) e os
  três arquivos novos, que entram no registry ao nascer. `expected_suites.json` e
  `mutation_map.json` também, quando as entradas do `d018` forem criadas.

## Boundary

**Classe tocada mais alta: `nenhuma`.** As três fontes foram cruzadas e medidas na
Fase 1 e reconferidas aqui: `pipeline.yaml`, `mutation_population.json` e
`check_mutation_coverage.py` não constam de `boundary.json`, de `PROTECTED` nem de
`frozenSuites`. **Nenhum rito de autorização é acionado; nada para aqui.**

## Checklist R9 (módulo novo)

Não se aplica como escrito — a R9 governa **módulos de UI** (IIFE, bridge, CSS,
`innerHTML`). Os equivalentes que valem para um julgador de pipeline, e que o
desenho assume:

- [ ] **auto-exclusão nominal** (R10 §10) — o julgador está na própria população e
      declara isso; é o `D018-POP1(b)`
- [ ] **não escreve na árvore** (R7 §3) — leitura pura; o harness muta em cópia
- [ ] **caminhos entre aspas** em qualquer invocação de processo (R10 §7)
- [ ] **não spawna outra suíte** (R10 §6) — lê JSON, não orquestra
- [ ] **≤600 linhas** ou justificativa registrada

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **0** | Repin de série; errata da spec se o portão aprovar a extensão da válvula à lacuna | — |
| **1** | `qa-engineer`: `check_mutation_coverage.py` com os 7 gates + `mutation_population.json` **só com a regra**, sem dívidas. **Executar e commitar o RED** — os seis órfãos e a lacuna reprovando, que é o defeito do `EA-3` visível pela primeira vez | Wave 0 |
| **2** | `build-engineer`: stage `mutation-coverage` no `pipeline.yaml`; `build-engineer`: as dívidas com prazo no arquivo de população → **verde** | Wave 1 |
| **3** | `qa-engineer`: `tests_018_mutants.js` (M1…M7) + entrada `d018` no `mutation_map.json` **no mesmo commit**; campanha executada e registrada na matriz | Wave 2 |
| **4** | `qa-engineer`: contagem fixada por execução em `expected_suites.json`; pipeline completo; `spec-validate` | Wave 3 |

**O red da Wave 1 é o achado**: pela primeira vez o `EA-3` aparece como linha
vermelha nomeando os seis arquivos, em vez de silêncio. Esse commit é a prova que
a R3 §4 exige e, ao mesmo tempo, a evidência que o achado nunca teve.

**Gates que nascem VERDES, declarado e não escondido** (precedente `D015-NOSUB1`/
`GOV1`): `POP1`, `PRAZO1`, `MORTO1` e `POP1(b)`. Nada no repositório os viola
hoje, e o poder deles vem dos mutantes `M1`/`M4`/`M6`/`M7`, nunca do red.

## Riscos e rollback

| risco | como se detecta | como se reverte |
|---|---|---|
| O stage novo reprova a `develop` por estado herdado que ninguém decidiu tratar | CI do PR, job `verify` | as dívidas da Wave 2 são o tratamento previsto; se insuficientes, a entrada do stage sai do `pipeline.yaml` num commit |
| A regra de população captura mais do que se quis (P4 previu 14 arquivos) | `D018-POP1` imprime o tamanho da população; divergência do previsto é sinal | ajustar a regra no dado, sem tocar o julgador — é por isso que a regra é dado e não código |
| A campanha `d018` fica lenta e atrasa o CI | tempo do job `visual`/`verify` | o harness é node+python, **sem chromium** — roda no `verify`, não no `visual` |
| O julgador vira mais um registro que apodrece | ele próprio: `D018-MORTO1` reprova declaração apontando arquivo inexistente | — |

**Rollback completo**: remover a entrada do stage no `pipeline.yaml` e repinar. Os
três arquivos novos ficam inertes; nenhum gate existente muda de comportamento,
porque nenhum foi tocado.

## Protótipo

**Não é necessário.** A questão que só código responderia — *"a regra de população
captura os 14 arquivos previstos?"* — já foi respondida por medição na Fase 0 (14
`check_*.py` no disco, 3 gatilhos, 11 órfãos) e a Wave 1 a reconfere antes do red.
Abrir `prototype/` aqui seria cerimônia sem pergunta.
