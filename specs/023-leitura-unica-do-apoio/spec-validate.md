# Conformidade — 023-leitura-unica-do-apoio

> Fase 6 · executor: qa-engineer · somente leitura.
> Conferido na implementação REAL (fonte + execução de gate), nunca no relato de
> quem implementou (R2 §4).

## Score

**9 de 9 critérios conformes · 100%** — com **quatro erratas** (`E1`–`E4`) que
mudaram a redação de três critérios ANTES do green, e uma **correção de fato**
dentro da `E3`, que não é divergência mascarada e sim o registro de uma afirmação
minha que a medição refutou.

## Item a item

| # | critério | conforme | evidência (executada) |
|---|---|---|---|
| C1 | com produto publicado a congelada é oculta e os cards ficam, **nos dois mundos** (`E1`) | sim | `D023-OCU1` PASS · duas alíneas nominais, `(a)` modo legado e `(b)` fora dele; mede a ocultação **e** a permanência dos cards, nas duas passagens de render |
| C2 | nada piora com contexto declarado, e a segunda fonte é **aditiva** | sim | `D023-REG1` PASS · região congelada inteira oculta, cards == `published()`, e a alínea `(d)` sobre a `F8` (contexto declarado **e** produto suprimido) |
| C3 | curadoria suprime tudo ⇒ a congelada volta | sim | `D023-SUP1` PASS · `published()==0`, zero cards, Camada 1 visível, `[data-p53-suprimido]` com contagem |
| C4 | tudo-ou-nada preservado | sim | `D023-ARB1` PASS · oito fixtures, grupos ∅-ou-inteiros, com a conta de grupos medidos como guarda de vacuidade |
| C5 | o `D010-ARB1` segue com sujeito alcançável | sim | `D023-SUJ1` PASS · predicado falso **e** título congelado presente e visível |
| C6 | o papel acompanha a tela **no que o papel carrega** (`E2`) | sim | `D023-PAP1` PASS · coerência papel×tela×`published()` e o aviso nas duas superfícies, com contraprova que falha se a Camada 1 passar a ser impressa |
| C7 | nada é removido — só `v32-hidden` muda | sim | `D023-DOM1` PASS · título presente nas oito fixtures, mais a contraprova "oculto E presente" |
| C8 | nenhum `frozen` tocado, régua imóvel | sim | `D023-BND1` PASS · 4 identidades conferem · stage `m41` PASS, payload `9794b267…` idêntico ao pinado |
| C9 | em modo legado a arbitragem atravessa, e **nada mais** (`E1`) | sim | `D023-LEG1` PASS · três alíneas: sem oferta, sob supressão, e `#v32support` ausente com o convite ao editor presente nas três fixtures legadas |

```
D023 LEITURA ÚNICA: 9 PASS · 0 FAIL de 9
D023 MUTATION:      12 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 12
```

## As quatro erratas, e quando cada uma nasceu

Nenhuma nasceu de conveniência: as quatro foram produzidas por uma máquina
reprovando ou por uma medição contrariando o que estava escrito.

| errata | nasceu | o que mudou |
|---|---|---|
| **E1** | Fase 4, no red | O modo legado entra no escopo. Medido que "sem contexto declarado" são **dois mundos** e que a sessão do relato era o legado, onde o predicado nem era consultado — a spec como estava **não corrigiria o caso relatado**. Rota B escolhida pelo proprietário em 2026-10-02 |
| **E2** | Fase 4, no red | O `C6` não podia medir o que prometia: zero títulos congelados em `#v32-print-report` nas oito fixtures. Passou a medir coerência e a **declarar** o que não mede |
| **E3** | Fase 4, no red; **corrigida** na W2 | "Uma função muda" virou duas. E a afirmação de que sem a `fronteira()` os cards seriam ocultados com a lista **foi refutada pela campanha** — ver abaixo |
| **E4** | W1, na implementação | Gate de suficiência **fechado não substitui**. Quem a exigiu foi o `D010-ARB3 (c)`, reprovando com conjunto visível vazio contra três nós de linha de base |

## A correção dentro da E3 — uma afirmação minha que a medição refutou

**Classe: hipótese escrita como fato em documento de governança.** Fica
registrada porque quem ler a errata daqui a um ano não deve encontrar uma causa
que o produto não tem.

Eu havia escrito, na `E3` e no cabeçalho da suíte, que ligar a arbitragem sem mais
nada **ocultaria os cards junto com a lista**, e que a `fronteira()` era o que os
protegia. O mutante `D023-M2` removeu a fronteira; o artefato foi reconstruído e
sondado em **três renders consecutivos, nas duas fixtures**:

```
F1 com M2   render1: cards=11 ocultos=0 | render2: 11/0 | render3: 11/0
F2 com M2   render1: cards=11 ocultos=0 | render2: 11/0 | render3: 11/0
```

A ocultação **nunca** alcança os cards: o decorador da 5.2 os repõe depois da
varredura, e `colocar()` não devolve nó com `v32-hidden`. O que a `fronteira()`
protege é o **censo** — oráculo, não apresentação — e pertence à demanda 019.

**A asserção do `D023-OCU1` não mudou**: a hipótese ter sido falsa não a torna
desnecessária, porque um gate que só medisse a ocultação passaria com a seção
vazia. Mudou a **razão declarada**, que agora é a medida. E o `D023-REG1` ganhou
carrasco próprio e mais forte (`M2b`, fixture `F8`, alínea `(d)`).

## O que mais foi tocado, e por quê

Quatro oráculos de outras demandas, todos com a mesma natureza — fixture ou
helper que declarava "sem substituto" para um estado que passou a ter um:

| demanda | o que mudou | ratificação |
|---|---|---|
| **010** | oráculo `d010HasSubstitute` (segunda fonte + `E4`); quatro valores declarados de `substituto`; fixtures `D010-F5`/`F5b` derivadas; `D010-ARB1`→`F3`, `D010-ARB4`→`F5b`; controle legado do `censoContraLegado` passa a suprimir a curadoria. Errata `E19` na spec dela | 2026-10-01 e 2026-10-02 |
| **015** | quatro fixtures ganharam `suprimirCuradoria`; a `E1` **não**, porque não oferta nada e o guarda de não-vacuidade a recusou | idem |
| **019** | `D019-CTX1 (c)` trocou de proposição e ganhou **três** controles; `reason` do `D019-M18` atualizado, ataque intacto | idem |
| **p50** | pin inline `§29.4` de `ui_v32.js` repinado, com identidade anterior no próprio pin | 2026-10-01 |
| **M3.1 (fase 4.x)** | `U1` e `U7` de `tests_ui_m31.js` exigiam *"apoio legado VISÍVEL"* em modo legado, **incondicionalmente** — a cláusula exata que a `E1` revogou. Passaram a medir a **regra nas duas direções**: oculto com substituto, visível sem ele, com pré-condição de sujeito | 2026-10-02 |
| **p52 chromium (fase 5.2)** | **quatro gates**. `P52-ICON1`/`P52-ICON2` deduplicavam tiles por `alt\|tamanho` guardando a **primeira** ocorrência em ordem de documento, sem olhar visibilidade → guarda de tile não desenhado, ANTES da deduplicação. `P52-ICON3` obtinha "lista congelada na tela" **não declarando contexto**, o que deixou de bastar → passa a retirar o substituto. `P52-REC1g` media faixa e coluna de nós `display:none` → mede só o que tem layout | 2026-10-02 |

**Seis suítes, dez gates, e nenhum enfraquecido.** A errata `E1` previu duas
suítes; a conta subiu em cada wave, sempre pela mesma natureza — fixture ou
asserção que codificava *"a leitura congelada está visível quando o contexto não
foi declarado"*, proposição verdadeira por anos e que esta demanda tornou falsa.

**O fecho do `p52chromium` é por igualdade com o controle, não por verde:**

```
origin/develop (8f166d3)   51 PASS · 5 FAIL  → PDF7, PDF4, PDF5, PDF6, TGT4
branch, antes das emendas  49 PASS · 7 FAIL  → as 5 + REC1g + ICON3
branch, depois             51 PASS · 5 FAIL  → as 5, idêntico ao controle
```

As cinco remanescentes são **`poppler-utils` ausente** nesta máquina, não
divergência de produto — a prova de papel não foi executada, e o job `visual` do
CI a executa. Declarado, não escondido.

**O sexto oráculo foi o mais caro, e só apareceu porque o controle foi rodado em
árvore inteira.** A execução direta do `check_mutation.py` acusou 16 não-KILL na
campanha `p52`; o controle em worktree limpa de `origin/develop` (`8f166d3`)
devolveu **13**. Os três de diferença — `P52-M8`, `P52-RA8`, `P52-RA8B` — eram
meus: **3/3 DETECTADO no controle, 0/3 no branch**.

A causa, medida: em modo legado sob arbitragem o catálogo de ícones vai de **9
para 29 tiles, 20 ocultos**, e os ocultos vêm primeiro em ordem de documento —
então a chave de deduplicação era tomada por um nó de retângulo zero e a medição
media o invisível. É a armadilha do oráculo que lê o DOM transformado.

**Rota C, decidida pelo proprietário em 2026-10-02**: o gate é consertado aqui
(ele promete *"o peso óptico que o navegador desenha"* e aceitava nó invisível —
a guarda é fortalecimento), e a causa vira demanda própria, **`EA-81`**. Depois da
guarda: `P52-ICON1`/`ICON2` 2 PASS · 0 FAIL sem mutação, e os três mutantes
**3/3 DETECTADO**.

**O quinto oráculo foi encontrado tarde, e a causa foi minha.** O `ui31` estava
vermelho desde a W1, e eu relatei a W2 dizendo *"todas verdes menos p50core"* —
porque li a saída do stage `suites` pelo `tail`, e o `ui31` estava na **linha 3**.
É a terceira vez nesta sessão que truncar saída de verificação esconde um estágio
que falhou. O portão estava certo e falando desde o começo.

## Verificação final — executada, não relatada

```
run.sh (leve)            14 PASS · 0 FAIL
compliance-audit.sh      17 PASS · 0 FAIL · 0 WARN
stage suites             todas as suítes na contagem do registro
preflight (9 campanhas)  todas as âncoras com ocorrencias == 1
```

**As SETE campanhas jsdom que têm `ui_v32.js` como alvo foram executadas de
verdade**, não só conferidas por preflight — porque preflight prova unicidade de
âncora e não letalidade, e mudar linha em arquivo-alvo já apodreceu âncora duas
vezes nesta sessão:

```
d023 MUTATION            12 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 12
d010 MUTATION            23/24 · 1 sobrevivente: D010-M20 → KI-5, declarada
d015 MUTATION            15/15
d019 MUTATION            17 DETECTADO · 0 SOBREVIVENTE de 17
d009 MUTATION            19 DETECTADO · 0 SOBREVIVENTE de 19
d021 MUTATION             8 DETECTADO · 0 SOBREVIVENTE de 8
d022 MUTATION            13 DETECTADO · 0 SOBREVIVENTE de 13
core MUTATION             3 DETECTADO · 0 SOBREVIVENTE de 3
```

Cada uma reportou restauração da árvore, e `git status` conferido limpo depois de
todas.

## Não executado, com causa declarada

- **Suítes Chromium** (`p50chromium`, `p52chromium`, `d011chromium`,
  `tests_014_mutants_visual.js`) — **KI-3**: exigem binário do Chromium, ausente
  nesta máquina; execução canônica é o job `visual` do CI, que é check obrigatório
  do merge. **Agendamento nomeado, não dispensa.**
- **Campanhas `p51` e `p52`** — âncoras conferidas por preflight
  (`ocorrencias == 1`); as campanhas em si exigem Chromium (KI-3) e são
  executadas pelo job `visual` do CI. **Únicas** das nove que não rodaram aqui, e
  a causa é ambiente, não escolha.
