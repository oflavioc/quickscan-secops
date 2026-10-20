# Relatório final — 024-sete-defeitos-do-relatorio

> **Demanda REFUTADA no portão da Fase 0.** Nenhuma linha de produto mudou. O
> defeito estava no registro, não no relatório que o cliente recebe.

## Veredito

**Não abrir demanda de produto** (D1). Aprovação do proprietário no chat,
**2026-10-19**, no portão da Fase 0, conforme registrada no planning-state da
demanda (`refinement.notes`):

> *"Vamos de (a), release com a tag"*

A mesma frase escolheu a rota da selagem — release `develop → main` com tag
anotada —, que não é desta demanda.

## O que se perguntou

> **Sobrou defeito visível no relatório que o cliente recebe?**

Sete candidatos da mesma superfície (seção de apoio e cards), todos `aberto` às
vésperas da selagem. O corte do proprietário: congelar o backlog de instrumento,
limpar o que o cliente vê, selar.

## A reconfirmação — sete vereditos

Medidos contra o fonte e o git (`refinement.md` §0; rota, commits e linhas no bloco
de cada achado em `.claude/BACKLOG.md`):

| achado | veredito | rota e data |
|---|---|---|
| `EA-69` rótulos sem acrônimo | não reproduz → `resolvido` | `P52_COPY`, apresentação e não Camada 1 — fix-finding, PR #103, 2026-09-27 |
| `EA-73` apoio no card de prioridade | não reproduz → `resolvido` | `p52SupportHints` removida — PR #103, 2026-09-27 |
| `EA-74` contador mede a seção | não reproduz → `resolvido` | censo da sessão + a seção nomeia o que não mostra — PR #103, 2026-09-27 |
| `EA-75` produto duplicado | não reproduz → `resolvido` | forma emendada: errata `E2` da 022 — PR #104, 2026-10-01 |
| `EA-79` duas leituras | não reproduz → `resolvido` | quarta rota da 023: produto publicado conta como substituto — PR #106, 2026-10-02 |
| `EA-80` título sem blocos sob supressão | reproduz, **não é defeito** → `transferido` | fechado por declaração (D4); errata `E20` na spec da 010 |
| `EA-81` catálogo duplicado e oculto | reproduz, **invisível ao cliente** → `aberto` | dívida de instrumento declarada (D5) |

**Cinco dos sete já estavam corrigidos** havia 17 a 22 dias. Continuavam `aberto`
porque nenhum dos três PRs que os fecharam virou a linha de status.

## Decisões, e onde cada uma ficou

| # | decisão | onde | commit |
|---|---|---|---|
| D1 | não é demanda de produto | este relatório | este |
| D2 | cinco → `resolvido` com rota e data; fila do `EA-58` recontada | `.claude/BACKLOG.md` | `2753078` |
| D2 | a entrada do `EA-73` que o código prometia; o fecho da entrada da 020/`EA-79` | `.claude/rules/design-decisions.md` | `fb8744d` |
| D3 | resíduo B5 do `EA-79` (gate de suficiência fechado) declarado | bloco do `EA-79` | `2753078` |
| D4 | `EA-80` fechado por declaração | `BACKLOG.md` (`transferido`), `design-decisions.md` (confirmada), errata `E20` da 010 | `2753078` · `fb8744d` · `8fac7bd` |
| D5 | `EA-81` dívida de instrumento, risco residual nomeado | bloco do `EA-81` | `2753078` |
| D6 | três verbetes + remissiva em *Arbitragem de camada* | `CONTEXT.md` | `c04d939` |
| D7 | linhas para o registro de selagem | §Para o registro de selagem | este |

Fora destes arquivos: o comentário obsoleto em `ui_p52_workspace_v32.js:1072`
(*"O ponteiro FICA nos `.prio-decl`"*) é do `ui-engineer` (D2).

## Zero commit de código

Nenhum arquivo de produto, gate, fixture ou mutante foi tocado. Os cinco commits
desta demanda são de documentação — `BACKLOG.md`, `design-decisions.md`, a spec da
010, `CONTEXT.md` e este relatório. Os quatro primeiros são pinados; este é novo e
rastreado. Repin: do orquestrador.

## O que a escrita do registro corrigiu na reconfirmação

O registro foi escrito contra o fonte, não contra o refinamento. Três imprecisões
de citação apareceram — **nenhuma muda veredito**:

1. **"Vamos de C" não era a linha explicativa.** O refinamento lê assim a rota C do
   `EA-79`; a rodada 4 do refinamento da 023
   (`specs/023-leitura-unica-do-apoio/refinement.md:122`) registra que C era **a
   estrutural**, entre paliativa, remover e estrutural. A estrutural foi feita — é a
   023 —, por uma rota técnica que não estava entre as três da tabela do achado.
2. **Três dos cinco não fecharam por demanda.** `EA-69`, `EA-73` e `EA-74` fecharam
   pelo fix-finding `fix/sessao-v329-onda1` (PR #103), não pelas demandas 019–023.
3. **Nomes e linhas.** O papel do apoio é `papelHTML()`
   (`ui_p52_support_v32.js:794-802`, exposto como `printHTML`), não
   `buildSupportHTML`, que existe em `ui_v32.js:836` e é outra função. O gate
   `D022-PROD1` é `tests_022_escalonamento.js:350-389` (citado `:369-387`, que são as
   alíneas (b) e (c)); o bloco da errata `E2` fecha em `ui_p52_support_v32.js:344`
   (citado `:272-330`).

## A lição

**A primeira tarefa foi medir em vez de desenhar, e isso derrubou a demanda.** O
nome da pasta promete sete defeitos. A reconfirmação, feita antes de qualquer
enquadramento, achou cinco já corrigidos e dois que não são defeito no relatório
entregue. Desenhar primeiro teria aberto sete tarefas para corrigir o que já
estava corrigido.

O defeito real era de registro: três PRs fecharam cinco achados sem virar a linha
de status, e a recontagem da fila do `EA-58` de 2026-10-16 leu a linha de status em
vez do fonte — contou como represado um item que estava no produto havia 19 dias.
**Achado se confere no fonte, não na própria linha de status.**

## Para o registro de selagem (D7)

| item | estado | razão |
|---|---|---|
| `EA-80` | `transferido` — declarado | supressão pela curadoria é decisão de quem conduz, não vão do software (D4; errata `E20` da 010) |
| `EA-81` | `aberto` — dívida de instrumento | invisível ao cliente; risco residual: oráculo que deduplicar por ordem de documento nesta seção tem de olhar visibilidade, senão mede a cópia morta (D5) |
| resíduo B5 do `EA-79` | declarado | gate de suficiência fechado: as duas leituras coexistem, por INV-3 (D3) |
| demais achados `aberto` | 26 | congelados pelo corte do proprietário; nenhuma frente nova sem pedido dele |

**Contagem medida**: 33 achados `aberto` antes, **27** depois — 26 + `EA-81`. A D7
do refinamento fala em `EA-81` *"mais os 27 de instrumento"*, o que somaria 28; a
conta que fecha é 26 + `EA-81` = 27. O 27 do brief bate com a contagem de 34 que a
delegação da Fase 0 trazia (34 − 7), corrigida para 33 no próprio refinamento (§O
que não pude medir, item 6).

## Estado da máquina

| item | estado |
|---|---|
| fase | encerrada na Fase 0, sem `specify`; o planning-state é escrito pelo orquestrador |
| artefatos | `refinement.md` + este relatório; `spec-validate.md` **não se aplica** (não houve spec) |
| `tdd_waiver` | registrado no planning-state em 2026-10-19 — não houve tarefa `feature`/`fix` |
| produto | **intocado** |

## Verificação

```
compliance-audit.sh --rule=backlog   antes (0e82141):  1 PASS · 0 FAIL · 0 WARN · 33 abertos
                                     depois (2753078): 1 PASS · 0 FAIL · 0 WARN · 27 abertos
```

**Não executado**, com o motivo: suítes, campanhas e pipeline — nenhuma linha de
produto mudou. O stage `baseline` não foi rodado: os quatro arquivos pinados e
este relatório ficam sem pin correspondente até o repin do orquestrador.
