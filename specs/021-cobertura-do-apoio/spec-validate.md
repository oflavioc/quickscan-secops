# Validação de conformidade — 021-cobertura-do-apoio

> Fase 6 · somente leitura · compara a **spec aprovada** com a **implementação
> real**, item a item. Não decide PASS/FAIL de produto: reporta conformidade.

## Score

| medida | resultado |
|---|---|
| contra a spec **como foi aprovada** | **7 de 9** (77,8%) |
| contra a spec **com as erratas E1 e E2 ratificadas** | **9 de 9** (100%) |

**As duas ficam registradas**, no precedente da 018 e da 019: apagar a de 77,8%
esconderia que a spec pedia duas coisas que o produto não podia cumprir — uma
inalcançável, outra sobre uma superfície que não existe.

## Item a item

| # | Critério | Gate | Estado | Nota |
|---|---|---|---|---|
| C1 | Zero regressão nos curados | `D021-CUR1` | **conforme** | os quatro publicam exatamente as opções da tabela; `M1` prova que inverter a ordem reprova |
| C2 | Cobertura completa | `D021-COB1` | **conforme** | 15 blocos onde havia 4 |
| C3 | Cláusula de silêncio | `D021-VAZ1` | **conforme após E1** | a redação original descrevia caso **inalcançável por construção** |
| C4 | Justificativa vem do `MAP` | `D021-FON1` | **conforme** | comparação após a copy declarada (`P52_COPY`) |
| C5 | Nível respondido | `D021-NIV1` | **conforme** | sujeitos escolhidos por medição: `team-capacity` e `incident-response` discriminam lv0×lv1 |
| C6 | Ancoragem por bloco | `D021-ANC1` | **conforme** | e forçou a errata **E19** na demanda 015 |
| C7 | Chega ao relatório real | `D021-PAR1` | **conforme após E2** | a redação original supunha superfície de tela que **não existe** |
| C8 | Contexto não declarado | `D021-CTX1` | **conforme** | mede a frase do "por que apareceu", não qualquer ocorrência |
| C9 | §UAT-07 emendada | `P51-REC1` | **conforme** | `M9` prova que reintroduzir os quatro literais reprova |

## Os dois não conformes contra a spec como escrita

Ambos são **spec errada**, não lacuna de comportamento — e os dois foram achados
**ao escrever o red**, que é exatamente para isso que a R3 ordena a fase antes da
implementação.

**E1 · o C3 descrevia um estado que o produto não produz.** Medido: nível 0 → 15
gaps/15 candidatos; nível 1 → 15/15; nível 2 → 0 gaps/0 candidatos. Sempre que há
gap, há candidato. Uma fixture que forçasse o estado faria **o produto mentir para
caber no critério** — o erro que o `D019-PROV1` já custou.

**E2 · o C7 supunha paridade com uma superfície de tela inexistente.** Medido:
tela 0 blocos, papel 4. `qsGapSupportHTML()` tem **um** sítio de chamada, dentro
de `buildPrintReport()`.

## O que esta validação encontrou e não estava previsto

### O bloqueio que custou três waves

A verificação completa acusou `d015: 0 PASS · 5 FAIL`. **Colisão com critério
selado de outra demanda**, em dois eixos: a C2 da 015 exigia que todo bloco
declarasse ancoragem **por capability** e **negasse** ancoragem por nível; e oito
fixtures declaravam a cobertura de quatro.

O cross-check contra specs seladas **não foi feito na Fase 0 nem na Fase 1** — e a
memória do projeto já registrava esse exato modo de falha. O bloqueio apareceu
tarde, depois de W3, W4 e W5.

Resolvido pela errata **E19** da 015, ratificada pelo proprietário, com três
efeitos colaterais medidos e emendados no mesmo ato — o mais instrutivo deles: a
alínea (b) do `D015-NOSUB1` **afirmava mais do que o critério dela dizia**
(igualdade, onde o C5 diz "nada foi removido").

### Quatro mutantes sobreviveram, e três acusaram o gate

| mutante | por quê | correção |
|---|---|---|
| `D021-M7` | a fixture de contexto declarava capabilities que **não alcançam qid derivado** — o eixo existia no nome | fixture reescrita |
| `D021-M8` | o `CTX1` procurava a frase em qualquer lugar do bloco, e cada opção já a contém | passou a medir o observável certo |
| `D021-M5` | regex do mutante estreita demais | as duas mensagens são detecção correta |
| `D021-M3` | **equivalente por construção** — ataca guarda inalcançável | **aposentado**, id não reutilizado |

Os dois primeiros são a família `EA-20` **dentro do gate que esta demanda
escreveu para caçá-la**. É desconfortável e é o registro honesto.

### Um erro meu que o produto desmentiu

O `D021-FON1` reprovou o `mandate`: o `MAP` diz *"formalização de charter"*, o
papel publica *"formalização do documento de direcionamento"*. Eu ia tratar como
defeito. **`P52_COPY` é tabela fechada e declarada**, com essa entrada exata. O
gate estava errado, o produto certo — mesma lição que o `EA-68` já pagou.

## Pendências

Nenhuma de implementação. O `EA-56`, que originou esta demanda, passa a
**resolvido**: a cobertura era o núcleo dele desde a emenda de 2026-09-15.
