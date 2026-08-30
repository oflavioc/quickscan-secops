# Red da guarda de leitura parcial — 013 · IC-10 (correção de defeito do IC-9)

> Fase 4 · dono: `qa-engineer`. Irmão de [red-integridade.md](red-integridade.md) e
> [red-excecao-nominal.md](red-excecao-nominal.md), mesmo rito, mesma mecânica.
> Mede a árvore **como ela está** em `8b5be3e` (o green do `IC-9` já commitado),
> antes de a guarda existir. Este arquivo registra **execução**; o critério está
> enunciado abaixo porque é **correção de defeito** de um mecanismo ratificado, e
> ainda não tem linha na `spec.md` (§Pendências).

## O achado, medido antes de ser afirmado (R2)

Campanha **truncada** cujo único não-KILL emitido é justamente o perdoado fecha
`0 problema(s)` e sai **0**. Reproduzido ponta a ponta em worktree efêmera com um
harness sintético (`sonda013`, `requires: ["node"]`, sem Chromium) que responde a
`--preflight` declarando **3** mutantes e emite **1** bloco antes de morrer com
exit 1 — a forma exata de uma campanha interrompida:

```
[RUN]  sonda013: node tests_sonda013_mutants.js
       CAMPANHA NAO CONCLUIDA — interrompida apos 1 de 3 mutantes
       não-KILL: LEITURA PARCIAL em `sonda013` — 1 mutante(s) lido(s) na saída contra 3 declarado(s) pelo preflight (C1); …
       não-KILL: 1 de 1 mutante(s) lido(s) · 0 KILL ficam na contagem
         SOBREVIVENTE   MUT-SONDA-A-013 · gate GATE-SONDA-013 · causa: achado sonda
       [EXCEÇÃO] KI-SONDA-FIACAO: sonda013/MUT-SONDA-A-013 SOBREVIVENTE perdoado · gate GATE-SONDA-013
----
mutation: 1 campanha(s) executada(s) · 0 problema(s)          ← exit 0
```

O stage **imprime** `LEITURA PARCIAL` (1 lido contra 3 declarados) e o veredito
**ignora** o que ele mesmo acabou de imprimir.

O contrafactual foi **medido**, não suposto: a mesma sonda contra `74e7378` (o
commit imediatamente anterior ao green do `IC-9`) fecha
`mutation: 1 campanha(s) executada(s) · 2 problema(s)`, exit **1** — 1 do red de
`IC-9` mais **1 da campanha**, que ali ainda contava. Quem passou a engolir o
vermelho foi o perdão.

## A classificação — decidida pelo proprietário, contra a minha

O `qa-engineer` classificou o achado como *comportamento de gate novo, fora das
quatro cláusulas ratificadas, a exigir nova ratificação*. **O proprietário
decidiu o contrário, no chat de 2026-08-30**, e a decisão dele é a que vale:

> A primeira cláusula ratificada é **"nominal, nunca abrangente"**. Um perdão
> aplicado sobre leitura parcial **não é nominal** — ele perdoa o que leu e, sem
> querer, tudo o que não leu. Não se pode afirmar que o perdoado é o único
> não-KILL sem ter lido **todos**. É **defeito do mecanismo**, não cláusula nova:
> o mecanismo não cumpre a cláusula que já foi ratificada.

Registro a divergência porque ela muda o **regime de prova**: como correção de
defeito, `IC-10` não depende de ratificação nova; como cláusula nova, dependeria.
A direção foi decidida, não afrouxada (R10 §1).

## O critério, enunciado (IC-10)

> **IC-10 — Perdão sobre leitura parcial é recusado, e a recusa é dita.** O laço
> de campanha só aplica o perdão nominal do `IC-9` quando a campanha foi lida
> **inteira**: `len(blocos lidos) == esperados`, com `esperados` vindo do
> preflight (C1). Divergência em qualquer direção — ou ausência do oráculo de
> contagem — **anula** o perdão (**IC-10.2/10.3**), e a anulação sai **impressa e
> nomeada**, com o harness, o(s) mutante(s) cujo perdão foi anulado e as duas
> contagens. O relato `LEITURA PARCIAL` de `mut_relata` **não é enfraquecido**: ele
> é relato, a guarda é veredito, e as duas coexistem (**IC-10.4**). A forma que a
> guarda lê do dicionário de C5 é **medida**, não presumida (**IC-10.1**).

Namespace: `IC-*` é da demanda 013; `IC-7` (stage `baseline`) e `IC-8` (execução
da campanha) já estão tomados na `spec.md`, `IC-9` é o addendum — `IC-10` é o
próximo livre, sem continuar numeração de fase alheia (R10 §"Nascimento").

Bloco **aditivo**: contador próprio, fecho próprio. `---- integridade: N ----` e
`---- exceção nominal: N ----` saem **byte-idênticos**; a seção `IC-1`…`IC-6` e as
quatro cláusulas verdes do `IC-9` não foram tocadas.

## Contrato C6 — o seam, e por que ele fica no LAÇO

    mut_guarda_leitura(harness, blocos, esperados, perdao) -> dict   FUNÇÃO PURA
      harness   — nome do harness no mutation_map.json
      blocos    — a lista `todos` de mut_ler(): o que a campanha DE FATO emitiu
      esperados — quantos mutantes o preflight (C1) declara, ou None quando
                  oráculo nenhum respondeu (harness sem preflight)
      perdao    — o dicionário de mut_perdao() (contrato C5)
      devolve  {"parcial": bool,        # len(blocos) != esperados, OU esperados None
                "recusa":  bool,        # havia perdão aplicável e ele foi ANULADO
                "linhas":  [linha…],    # o que o stage IMPRIME — não vazia SSE `recusa`
                "perdoa_o_exit": bool}  # perdao["perdoa_o_exit"] AND NOT parcial

`mut_perdao` (C5) **não é tocada**, e não poderia sê-lo: função pura de perdão não
sabe — nem pode saber — quantos mutantes deveriam ter aparecido. Quem sabe é o
laço, que tem `IC_PREFLIGHT`. Foi o ponto de conserto que o proprietário fixou.

`esperados is None` conta como parcial **de propósito**: sem oráculo de contagem
ninguém pode afirmar que leu tudo, e a direção segura é não perdoar — com a
ausência do oráculo dita na linha (`IC10_SEM_ORACULO`), nunca em silêncio (R10 §2).
Hoje isso alcança só o `core`, que não tem preflight (dívida declarada de T8) e não
tem exceção; o caminho de saída é dar preflight ao `core`, não afrouxar a guarda.

**C6 é proposta do `qa-engineer`, não decisão de desenho ratificada.** Renomear a
função ou trocar a forma do retorno é prerrogativa do `tech-lead`; o gate muda
junto, em uma string. O que **não** é negociável sem voltar ao proprietário é o
conjunto de cenários que a guarda tem de discriminar.

## Como foi medido (e por que assim)

`check_mutation.py` recusa rodar com `git status` sujo, então o red de uma mudança
**no próprio julgador** só se mede em worktree efêmera com o gate commitado **lá**
(rito da T002):

    git worktree add --detach <efêmera> 8b5be3e
    # + o novo check_mutation.py, commitado LÁ (0b9f80f na efêmera, descartada com ela)
    MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py    # exit 1

`MUTATION_DEFER_MISSING=1` é o rito local de D3: **não há Chromium nesta máquina**
e as três harnesses reais são exigidas (alvos mudaram). Sem a env, os três
`[FAIL]` de ambiente se somam ao da asserção e embaralham a leitura; as duas
execuções estão registradas abaixo, nenhuma omitida.

**Identidade da medição**: o `check_mutation.py` desta árvore é **byte-idêntico**
ao que foi commitado e medido na efêmera —
`sha256 90dc5cd04259220ab8e136301af1945daec74d7385811e3af295a3f9d09d286a`. É a
substituição auditável do passo "reconferir em árvore limpa **depois** do commit",
que não pôde ser executado aqui porque o commit é do proprietário (§Pendências 1).

## Saída do red — o bloco novo, integral

```
---- exceção nominal: 0 problema(s) nomeado(s) ----
---- guarda de leitura parcial no perdão (013 · IC-10) ----
[OK]   IC-10: acordo de forma C5→C6: `mut_perdao` devolve as chaves que a guarda lê (perdoados, perdoa_o_exit) — a sonda sintética abaixo não mede forma inventada
[FAIL] IC-10: check_mutation.py · o laço não expõe `mut_guarda_leitura(harness, blocos, esperados, perdao)` (contrato C6) — o perdão nominal do IC-9 é aplicado SEM conferir se a campanha foi lida inteira: campanha TRUNCADA cujo único não-KILL emitido é justamente o perdoado fecha `0 problema(s)` e sai 0, com a `LEITURA PARCIAL` impressa e ignorada pelo veredito. Perdão sobre leitura parcial não é NOMINAL — perdoa o que leu e, sem querer, tudo o que não leu; e um verde que esconde campanha que não terminou é a doença desta demanda inteira
[OK]   IC-10: regressão: `mut_relata` segue emitindo `LEITURA PARCIAL` com as duas contagens (2 lidos × 5 declarados) e sem a marca da guarda — relato e veredito coexistem, cada um no seu papel
---- guarda de leitura parcial: 1 problema(s) nomeado(s) ----
[OK]   core: nenhum alvo mudou desde a base — campanha não exigida
[DEFER] p50: exigida (alvo mudou) — delegada ao job com chromium (job visual)
[DEFER] p51: exigida (alvo mudou) — delegada ao job com chromium (job visual)
[DEFER] p52: exigida (alvo mudou) — delegada ao job com chromium (job visual)
----
mutation: 0 campanha(s) executada(s) · 1 problema(s)
```

Exit **1**. A mesma execução **sem** `MUTATION_DEFER_MISSING`, medida sobre o
mesmo arquivo byte-idêntico (efêmera `0b8ac4e`), fecha
`mutation: 0 campanha(s) executada(s) · 4 problema(s)`, exit **1** — os três
`[FAIL] … ambiente sem chromium` mais o de `IC-10`. O seam `DEFER`/`FAIL` da T004
segue intacto sob o bloco novo. As duas execuções estão registradas; nenhuma foi
omitida.

`diff` da saída inteira contra a de `8b5be3e`: **só** as 5 linhas do bloco novo e
a contagem final (`0 problema(s)` → `1 problema(s)`). Nada mais mudou.

### O que os `[OK]` provam, e importam tanto quanto o `[FAIL]`

- **IC-10.1** já verde no red: o acordo de forma C5→C6 é medido contra o
  `mut_perdao` **real**, não contra um dicionário que eu inventei. Sem ele a sonda
  de IC-10.3 poderia estar medindo uma forma que nunca ocorre na execução.
- **IC-10.4** já verde no red: a `LEITURA PARCIAL` existente é **relato** e
  continua de pé. A exigência do proprietário ("não enfraqueça") nasce medida,
  não prometida — e é a única asserção do bloco que já podia ficar verde antes do
  green, porque mede o que já existe.
- **IC-10.3 não é medida no red** — a sonda não roda sem o seam. Isso é dito pelo
  próprio `[FAIL]` de IC-10.2, nunca em silêncio (R10 §2).

## Estado asserção a asserção

| Asserção | Veredito no red | O que nomeia | Vira verde quando |
|---|---|---|---|
| **IC-10.1** (acordo de forma C5→C6) | **verde** | — | já verde; falsificada por **M-IC30** |
| **IC-10.2** (o seam existe) | **RED** | `mut_guarda_leitura` (C6) não existe — o perdão é aplicado sem conferir se a campanha foi lida inteira | quando o green expuser C6 |
| **IC-10.3** (a guarda discrimina, 8 cenários) | **não medida** — sem seam não há o que sondar | — | com o green; falsificada por M-IC23…M-IC27 |
| **IC-10.4** (regressão do relato) | **verde** | — | já verde; falsificada por **M-IC28** |

## Falsificação — o gate consegue ficar verde? E voltar ao vermelho?

Red que não falha é gate que não mede; gate que nunca passa também não. Em
worktree efêmera, com uma implementação de **referência** de C6 (descartável,
escrita só para a sonda — **não é a correção**, que é do engenheiro dono do
módulo):

| Sonda | Cenário | Veredito de IC-10 |
|---|---|---|
| **P1** | referência sã de C6 (função + fiação no laço) | **0 problemas · exit 0** |

### A fiação, provada sem Chromium

A sonda em processo mede a **função**; ela não faz o **laço** executar. Com o
harness sintético `sonda013` registrado na efêmera (três modos, mesma exceção
nominal declarada), o laço roda de verdade:

| Modo da campanha | Sem a guarda (hoje, `8b5be3e`) | Com a referência de C6 |
|---|---|---|
| **truncada**, único não-KILL é o perdoado | **0 problemas · exit 0** | **1 problema · exit 1**, com `[EXCEÇÃO NÃO APLICADA] sonda013: perdão de MUT-SONDA-A-013 ANULADO — a campanha foi lida PARCIALMENTE (1 mutante(s) lido(s) contra 3 declarado(s) pelo preflight (C1))` |
| **completa**, o perdoado sobrevive e os vizinhos morrem | 0 problemas · exit 0 | **0 problemas · exit 0** — o green do `IC-9` segue valendo |
| **truncada**, sobrevivente NOVO não nomeado | 1 problema · exit 1 | 1 problema · exit 1 — a guarda cala, o relato fala |

A linha do meio é a que impede o remédio de virar doença: a guarda **não** revoga
a exceção nominal; revoga só o perdão que se apoiava em leitura incompleta.

### Matriz gate ↔ mutante — `M-IC23`…`M-IC30`

Todos aplicados sobre a referência sã do **P1**, em cópia efêmera, cada um com
`ast.parse` conferido **antes** de creditar a morte (crash não é detecção — regra
da casa, `tests_p51_mutants.js:9`). **Nada disto voltou para a árvore real.**

| Mutante | O que muda | Exigência atacada | Veredito | Cenários que o matam |
|---|---|---|---|---|
| **M-IC23** | **remove a comparação** e perdoa assim mesmo (`parcial = False`) | a guarda inteira | **morto** — 18 FAILs | i, iii, iv, v, vi, vii, viii |
| **M-IC24** | recusa **silenciosa** (`"linhas": []`) | 1 · recusa impressa e nomeada | **morto** — 4 FAILs | i, iii, iv, vii |
| **M-IC25** | recusa **sempre** (`parcial = True`) | não estragar o verde legítimo | **morto** — 4 FAILs | **ii** (negativo canônico) |
| **M-IC26** | oráculo ausente tratado como leitura completa | direção segura sem oráculo | **morto** — 4 FAILs | iv |
| **M-IC27** | recusa mesmo **sem perdão aplicável** (`recusa = parcial`) | a guarda não inventa problema | **morto** — 6 FAILs | v, vi, viii |
| **M-IC28** | **enfraquece** a `LEITURA PARCIAL` de `mut_relata` | 2 · relato e veredito coexistem | **morto** — IC-10.4 | regressão |
| **M-IC30** | C5 renomeia `perdoados` no dicionário devolvido | acordo de forma C5→C6 | **morto** — IC-10.1 (**e** IC-9.4, 7 FAILs: morte incidental entre gates, declarada) | IC-10.1 |
| **M-IC29** | guarda **correta** que o laço nunca consome | fiação do veredito | **SOBREVIVE a IC-10** — declarado abaixo | — (job `visual`) |
| **M-IC31** | laço consome a guarda mas a alimenta com `esperados = len(blocos lidos)` em vez do preflight | fiação do **oráculo** | **SOBREVIVE a IC-10** — declarado abaixo | — (job `visual`) |

Nenhum cenário da sonda ficou sem killer: a matriz foi lida **pelo lado do gate**
("este cenário mata alguém?"), não só pelo lado do mutante. Nenhuma morte foi
incidental **dentro** do bloco — cada `[FAIL]` cita o cenário correspondente. A
única morte que atravessa gates é a de **M-IC30**, e ela está dita: a forma do
dicionário de C5 é contrato dos dois.

### M-IC29 e M-IC31 — os mutantes que sobrevivem, e onde eles morrem

`IC-10.3` mede a **função**, não a **fiação**: uma `mut_guarda_leitura` impecável
que o laço não consome passa pelo gate. É o mesmo limite estrutural de `IC-2`
(que sobrevive ao dual `have → False`) e de `M-IC19` no `IC-9`, e a casa resolve
do mesmo jeito — **nomear o job onde o mutante morre**, em vez de fingir cobertura.

Medido, não suposto: com **M-IC29** aplicado, `IC-10` fecha `0 problema(s)` **e** a
campanha truncada do `sonda013` volta a `1 campanha(s) executada(s) · 0
problema(s)`, exit **0**. Ou seja: o mutante é invisível ao gate e **visível a
qualquer campanha real que trunque** — job `visual` do CI, ou a própria sonda de
fiação em efêmera, que é como a fiação foi conferida aqui.

**M-IC31 é da mesma classe e é o erro mais provável do green**: o laço chama a
guarda, mas alimenta `esperados` com `len(blocos lidos)` em vez do preflight — a
comparação passa a ser do número consigo mesmo, `parcial` nunca é True e o defeito
volta inteiro. Medido: `IC-10` fecha `0 problema(s)` e a campanha truncada volta a
`0 problema(s)`, exit **0**. É por causa desta classe que o green **tem de** ser
conferido com a sonda de fiação em efêmera antes de ser declarado — a sonda em
processo não a alcança, e dizer isso é obrigação, não formalidade.

Asserção estrutural por `grep` no próprio fonte (`mut_guarda_leitura(` dentro do
laço) foi **considerada e recusada**, pelo mesmo motivo do `IC-9`: comentário ou
chamada morta a satisfazem, e verde que não mede é a doença desta demanda.

## Regressão — conferida, não presumida

- Seção de integridade `IC-1`…`IC-6`: **0 problemas**, saída byte-idêntica à de
  `8b5be3e`. Nenhuma linha do bloco foi editada.
- `IC-9`, as quatro cláusulas: **0 problemas**, saída byte-idêntica; `mut_perdao`
  (C5) não foi tocada, e `KI-4` segue honrada.
- Relato `LEITURA PARCIAL` (`mut_relata`): intacto — e agora **medido** por
  IC-10.4 em vez de confiado.
- `DEFER` sob `MUTATION_DEFER_MISSING=1` e `FAIL` sem a env: intactos, medidos nas
  duas execuções.
- Pré-condição de árvore limpa, pós-condição de restauração, recibos, `[DÍVIDA]
  core`: nenhuma linha tocada.
- `state`: 0 problemas. `tdd`: 0 problemas (5 demandas, 0 waivers).
- **Zero byte de produto.** O diff toca `.claude/verify/check_mutation.py` e este
  arquivo, e mais nada.

## Não executado (declarado, nunca omitido — R2 §1)

- **Campanhas reais** (`p50`/`p51`/`p52`): exigem Chromium, ausente nesta máquina
  (`CHROME_PATH` vazia, cache do Playwright inexistente). A fiação da guarda foi
  provada com **harness sintético** em efêmera, não com campanha de produto.
- **`M-IC29`** e **`M-IC31`**: sobrevivem a `IC-10` por construção (medem-se na
  fiação, não na função); morrem no job `visual` e na sonda de fiação em efêmera.
  Declarados, não contornados.
- **`gen_pins.py`**: **não executado**, por instrução explícita do proprietário. O
  stage `baseline` já estava vermelho em `8b5be3e` (2 pins divergentes:
  `check_mutation.py` e `known_issues.json`, do green do IC-9 sem repin) e segue
  assim, mais este arquivo novo como rastreado-sem-pin depois do commit.
- **Pipeline completo**: não executado nesta árvore — o stage `mutation` recusa
  árvore suja e a árvore está suja por construção enquanto o red não é commitado.
  Rodaram `baseline` (exit 1, pré-existente), `tdd` (exit 0) e `state` (exit 0).

## Pendências que este red abre (para quem for fechar)

1. **O commit é do proprietário.** A instrução desta rodada foi `não commite`; o
   red fica na árvore, sem SHA. `planning-state → red.commit`/`gates` **não**
   foram atualizados por isso: sem SHA não há referência honesta a registrar.
   `IC-10` entra em `red.gates` no mesmo commit em que o SHA existir.
2. **`spec.md` não tem linha para `IC-10`** (nem para `IC-9`). Classe do gap:
   **faltando**. Dono: `product-owner` + `tech-lead` — o `qa-engineer` não escreve
   critério.
3. **C6 precisa de ratificação técnica** (nome e forma do retorno): `tech-lead`.
4. **O green é do engenheiro dono do módulo**, não meu (R3 §2): expor
   `mut_guarda_leitura` e ligá-la no laço, entre o `mut_perdao` e o veredito.
   Ponto editorial que o gate deliberadamente **não** fixa: hoje a linha
   `[EXCEÇÃO] … perdoado` sai **antes** da recusa; suprimi-la quando há recusa é
   decisão do implementador, desde que a anulação continue impressa e nomeada.
5. **`M-IC23`…`M-IC31` têm de ser absorvidos pela `matriz-gate-mutante.md`** na
   T028, junto com `M-IC1`…`M-IC22`.
6. **Repin** (`gen_pins.py`) de `check_mutation.py` + este arquivo, em commit
   `chore` próprio: `build-engineer`.

## Aviso operacional (R14 — o vermelho é a entrega)

Entre este commit e o green, o stage `mutation` fica **legitimamente vermelho por
`IC-10`**, com **uma** linha nomeada. Esse vermelho **é** o red. O `run.sh --light`
segue sem tocar o stage (`heavy: true`); `---- integridade: 0 ----` e
`---- exceção nominal: 0 ----` seguem verdes.
