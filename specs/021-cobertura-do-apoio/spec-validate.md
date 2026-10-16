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

#### Nota de 2026-10-16 — sobreviveram CINCO, não quatro: faltava o `M51-07`

**Acréscimo, não reescrita** (R2 §5): a seção acima e a tabela ficam como foram
validadas; esta nota corrige a contagem. Devolvida pelo `product-owner` como
condição (1) do aceite de intenção retroativo da 021 (planning-state,
`validate.aceite_de_intencao`, 2026-10-16) e conferida no fonte pelo `doc-writer`
antes de gravar.

| mutante | campanha · gate | por quê | correção |
|---|---|---|---|
| `M51-07` | `p51` (`tests_p51_mutants.js:183-203`) · `P51-REC1` | **a primeira redação da emenda da §UAT-07 enfraqueceu o gate** — o carrasco desapareceu junto com a lista literal | alínea reescrita por origem declarada **mais** alínea de disjunção contra o motor (`tests_p50_core.js:3659-3688`) |

**O quinto é o mais grave, e não é da família dos outros quatro.** Os outros três
acusaram o **gate que esta demanda escreveu**; o `M51-07` acusou a **emenda a um
gate alheio**. Ele move a chave de `QS_GAP_SUPPORT` de `detection-lifecycle` para
`training`; sobreviver significa que a emenda **afrouxou a asserção** (R10 §1) —
o oposto do que a `spec.md:175-178` prometeu quando ofereceu justamente um mutante
como prova: *"A prova de que não afrouxou é o `M9`: reintroduzir os quatro literais
tem de deixar o gate **vermelho** na cobertura nova."*

**O mecanismo, escrito no gate** (`tests_p50_core.js:3645-3658`): a redação era
`!TAB[qid] && !candidatosDoMapa(...).length` e, **como todo qid tem candidato no
`MAP`**, a segunda metade nunca dispara — a cláusula virou inalcançável. *"União de
fontes sem origem declarada é o mesmo que fonte nenhuma."* O complemento está no
harness (`tests_p51_mutants.js:185-198`): quem matava o mutante era o
`QIDS_AUTORIZADOS` com quatro literais, em que `training` não estava; com a âncora
derivada da fonte congelada, `training` passou a estar autorizado e **o carrasco
sumiu**. O `reason` do mutante também teve de ser alargado para a mensagem nova
(`tests_p51_mutants.js:199`).

**A campanha denunciou, e a correção deixou o gate MAIS forte que antes da
demanda** (`tests_p50_core.js:3659-3688`): a alínea passou a respeitar a **origem
que o próprio bloco declara** — quem declara `capability` tem de estar na tabela
(`:3662-3663`), quem declara `nivel` tem de ter candidato no `MAP` no nível
respondido (`:3664-3665`) —, portanto discrimina nas **duas** origens em vez de
uma; e ganhou a alínea de **disjunção contra o motor** (`:3680-3688`), oráculo de
**fora** da tabela: a tabela curada pode ser mais larga que o `MAP`, não pode ser
disjunta dele. Sob o mutante, `training` × `FortiGuard-Service-Bundle` dá
interseção vazia — sem ela, o relatório ofereceria FortiSIEM, FortiAnalyzer e
FortiSOAR para um gap de **capacitação**.

**Por que registrar importa**: o episódio não estava em **nenhum** dos seis
artefatos da 021 — vivia só em comentário de código — e já é citado como precedente
pelas `tasks.md` da **022** (`:42`) e da **023** (`:40`) e por
`tests_022_escalonamento.js:277`, sempre na forma *"foi tratar reancoragem como
mexida inócua que produziu o `M51-07` sobrevivente na 021"*. O precedente estava
sendo citado contra um registro inexistente.

**Não executado, e nomeado**: dizer se o `M51-07` morre contra o texto atual do
gate é execução, e é do `qa-engineer` — condição (2) do mesmo aceite, que registra
`mutation-matrix.json:189-191` com `ultima_prova.data: 2026-09-13` e
`resultado: KILL`, prova **anterior** à 021, que mudou o arquivo mutado **e** a
alínea que decide. Esta nota registra o episódio; não declara PASS.

### Um erro meu que o produto desmentiu

O `D021-FON1` reprovou o `mandate`: o `MAP` diz *"formalização de charter"*, o
papel publica *"formalização do documento de direcionamento"*. Eu ia tratar como
defeito. **`P52_COPY` é tabela fechada e declarada**, com essa entrada exata. O
gate estava errado, o produto certo — mesma lição que o `EA-68` já pagou.

## Pendências

Nenhuma de implementação. O `EA-56`, que originou esta demanda, passa a
**resolvido**: a cobertura era o núcleo dele desde a emenda de 2026-09-15.
