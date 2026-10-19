# Relatório final — 021-cobertura-do-apoio

> Fase 6 · o que a demanda entregou, o que custou e o que ela ensinou.

## O que mudou para quem recebe o relatório

**De 4 para 15.** Todo gap de maturidade observado passa a trazer caminho de
apoio; antes, onze dos quinze chegavam ao cliente **sem dizer por onde começar**.

Medido nas duas configurações de contexto, antes e depois:

```
antes  ·  15 gaps · 4 com apoio · 11 SEM      (contexto declarado ou não)
depois ·  15 gaps · 15 com apoio · 0 SEM
```

Ficavam mudos, entre outros: **Capacidade do time**, **Capacitação**, **Resposta a
incidentes**, **Proteção de endpoint**, **Visibilidade de rede** e **Superfície
externa**.

## A descoberta que barateou a demanda inteira

O encaminhamento do `EA-56` supunha que o conteúdo teria de ser **escrito** — e era
por isso que o item parecia caro, e por isso ele passou dez dias parado atrás de
uma decisão de catálogo.

**Não tinha.** A Camada 1 congelada já declarava produto **e** justificativa para os
quinze qids, em `MAP[qid].lv[nível].c` — inclusive a trilha de capacitação que o
`EA-56` deu como sem-onde-morar:

```
training → FortiGuard-Service-Bundle
           "treinamento e certificação (Cybersecurity Professional Education)"
```

O produto simplesmente não lia. **Ler o `MAP` não o altera**: `frozen` proíbe
escrita, e por isso esta demanda não abriu Porta B nem tocou a régua D2.

## O desenho, e por que não foi o óbvio

Três opções; a medição descartou duas **antes** do portão:

- **A · escrever 11 entradas à mão** — exigiria conteúdo editorial inventado, e
  tabela escrita à mão apodrece. É a doença que o `EA-68` pagou.
- **B · derivar tudo e aposentar a tabela** — **estreitaria** os quatro que já
  funcionavam: `detection-lifecycle` cairia de quatro produtos para um. Regressão
  disfarçada de melhoria.
- **C · tabela como exceção curada, `MAP` como padrão** ← aprovado. Cobertura
  4 → 15 com **zero regressão** e **zero invenção**.

## Medições

```
D021 COBERTURA:  8 PASS · 0 FAIL de 8     (red commitado: 2 PASS · 6 FAIL)
D021 MUTATION:   8 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO
D015 SUPERFÍCIES: 5 PASS · 0 FAIL de 5
D015 MUTATION:  15/15 detectados
P50 CORE + P51: 65 PASS · 0 FAIL de 65
conformidade:   7/9 contra a spec como escrita · 9/9 com E1 e E2
```

## O que custou, e é o registro que importa

### O bloqueio: colisão com critério selado da 015

A verificação completa acusou `d015: 0 PASS · 5 FAIL`. A C2 da demanda 015 exigia
que **todo** bloco declarasse ancoragem por capability e **negasse** ancoragem por
nível — e o bloco derivado desta demanda é ancorado no nível. Satisfazê-la exigiria
**o produto afirmar duas coisas falsas**.

**Eu não toquei na 015 por conta própria.** Mudar o oráculo declarado de outra
demanda de dentro desta é o que a R10 §1 proíbe, e é o que a demanda 020 mediu e
reverteu. Parei, reportei e esperei a ratificação — que veio como errata **E19**.

**A falha de processo é minha e está nomeada:** o cross-check contra specs seladas
não foi feito na Fase 0 nem na Fase 1, e a memória do projeto **já registrava esse
exato modo de falha**. Custou três waves de implementação antes de aparecer.

### O que a E19 ensinou de graça

Ao emendá-la, encontrei que a alínea (b) do `D015-NOSUB1` **afirmava mais do que o
critério dela dizia**: exigia igualdade de opções contra a âncora, quando o C5 diz
*"nada foi removido"*. A metade extra — *"nada foi acrescentado"* — nunca foi
pedida, e só se sustentava porque a 015 não acrescentava nada.

Trocada por **âncora ⊆ HEAD + delta declarado**. O acréscimo ganhou oráculo próprio
em vez de virar permissão.

### Os gates que esta demanda escreveu, e que ela mesma teve de consertar

Quatro mutantes sobreviveram na primeira execução. **Três acusaram o gate, não o
código** — e dois deles o gate desta própria demanda, cego por amostragem: a
fixture de "contexto declarado" declarava capabilities que **não alcançam nenhum
qid derivado**. O eixo existia no nome.

É a família `EA-20` dentro do gate escrito para caçá-la. Registrado sem
atenuante.

#### Nota de 2026-10-16 — a contagem era CINCO, e o quinto é de outra natureza

**Acréscimo, não reescrita** (R2 §5): o texto acima fica como foi registrado no
fecho. Correção devolvida pelo `product-owner` como condição (1) do aceite de
intenção retroativo da 021 (planning-state, `validate.aceite_de_intencao`,
2026-10-16) e conferida no fonte pelo `doc-writer` antes de gravar.

Sobreviveram **cinco** mutantes na primeira execução, não quatro. O quinto é o
**`M51-07`** (campanha `p51`, `tests_p51_mutants.js:183-203`, gate `P51-REC1`), e
ele não pertence à família dos outros: três acusaram **o gate que esta demanda
escreveu**; o `M51-07` acusou **a emenda a um gate alheio**. A primeira redação da
emenda da §UAT-07 **enfraqueceu o gate** (R10 §1) — o oposto do que a
`spec.md:175-178` prometeu ao oferecer um mutante como prova de que não afrouxava.

Em uma linha, com o mecanismo citável: a redação
`!TAB[qid] && !candidatosDoMapa(...).length` virou **inalcançável**, porque todo
qid tem candidato no `MAP` (`tests_p50_core.js:3645-3658`), e o carrasco antigo —
`QIDS_AUTORIZADOS` com quatro literais, onde `training` não estava — desapareceu
junto com a lista (`tests_p51_mutants.js:185-198`). **A campanha denunciou**, e a
correção (`tests_p50_core.js:3659-3688`) deixou o gate **mais forte que antes da
021**: discrimina nas duas origens declaradas e acrescenta a alínea de **disjunção
contra o motor** (`:3680-3688`). A medição completa está na nota irmã de
`spec-validate.md` (§Nota de 2026-10-16).

O que isto muda na leitura do fecho: o título desta seção continua verdadeiro e
ganha um quinto caso de natureza diferente — **não foi o gate novo que falhou, foi
a emenda ao gate alheio**. É por isso que as `tasks.md` da **022** (`:42`) e da
**023** (`:40`), e `tests_022_escalonamento.js:277`, citam este episódio como
precedente de *"reancoragem não é mexida inócua"* — precedente que, até esta nota,
não existia em artefato nenhum da 021.

Não executado aqui, e nomeado: se o `M51-07` morre contra o texto atual do gate é
medição do `qa-engineer` — condição (2) do mesmo aceite, que registra
`mutation-matrix.json:189-191` com `ultima_prova.data: 2026-09-13` /
`resultado: KILL`, prova anterior à 021.

### Três premissas minhas, falsas, achadas ao escrever o red

- o `C3` descrevia um estado **inalcançável por construção**;
- o `C7` supunha uma **superfície de tela que não existe**;
- o `D021-FON1` tratou como defeito uma **localização declarada** (`P52_COPY`).

As três apareceram porque a R3 manda escrever o gate antes da implementação. Se a
ordem fosse a inversa, as três teriam virado código.

## Efeito no backlog

`EA-56` → **resolvido**. A cobertura era o núcleo dele desde a emenda de
2026-09-15 (*"a tabela de apoio do relatório cobre 40% dos gaps"*).

`EA-58` → **permanece aberto**, com um item a menos na fila: restam o catálogo
(`FortiNAC`, `FortiClient EMS`, `FortiSOC`, `FortiSOAR`), os rótulos `(SIEM)`/`(NDR)`
do `EA-69` e o `SCORES`, que nem achado é.
