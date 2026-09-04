# Matriz gate ↔ mutante — demanda 013 · integridade da campanha

> **Nasce na T017 (E2, passo 1): a triagem escrita ANTES de qualquer edição de
> âncora.** A reancoragem é a **T019**, e ela existe *depois* desta página
> exatamente para não ser oportunista. Nenhum byte de `tests_p51_mutants.js`,
> `ui_*`, `USER_GUIDE.md` ou suíte de gate foi tocado por esta tarefa —
> conferido por `git status --porcelain` vazio e por SHA-256 do harness
> inalterado (`0228954f66e5487e47ebf7c17d980c4dc828765a7ed48ac9446799df07876b2c`).
>
> Autor da triagem: `qa-engineer`. Quem confere a **intenção** — se a propriedade
> defendida continua sendo a que o mutante documentava — é o `product-owner`, na
> Fase 6 (refinement.md §Critério central).
>
> **Auto-exclusão (R10 §10)**: este arquivo vive sob
> `specs/013-integridade-da-campanha/`, path nominalmente excluído da varredura de
> IC-1 em `check_mutation.py:97-98`. Ele carrega os literais proibidos porque
> precisa citá-los; a exclusão é impressa, nunca silenciosa.

---

## 1. O red que esta triagem consome

Medido nesta tarefa, na worktree `phase5-013`, HEAD `23b59a6`, árvore limpa,
2026-08-29 — **reexecutado, não herdado de relato** (R2 §4):

```
MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py
  -> exit 1 · 12 [OK] · 10 [FAIL] · "mutation: 0 campanha(s) executada(s) · 10 problema(s)"
```

As quatro linhas que **são** o escopo de E2:

```
[FAIL] IC-4: p51/M51-03 · âncora não encontrada — ocorrencias=0 em ui_p50_shell_v32.js (C1 exige exatamente 1 antes de mutar)
[FAIL] IC-4: p51/M51-16 · âncora não encontrada — ocorrencias=0 em ui_v32.js (C1 exige exatamente 1 antes de mutar)
[FAIL] IC-4: p51/M51-18 · âncora não encontrada — ocorrencias=0 em ui_v32.js (C1 exige exatamente 1 antes de mutar)
[FAIL] IC-4: p51/M51-20 · âncora não encontrada — ocorrencias=0 em USER_GUIDE.md (C1 exige exatamente 1 antes de mutar)
```

Confirmadas pelo instrumento produtor, `node tests_p51_mutants.js --preflight`:
16 âncoras com `ocorrencias == 1`, quatro com `0`, exit 1.

**Correção de premissa que a E1 obrigou** (e que muda esta triagem): `M51-18`
**não** é âncora ambígua. É `ocorrencias=0` — o bloco de três linhas registrado
hoje não casa **nenhum** dos dois sítios de `ui_v32.js`. A duplicação existe só
na *linha solta*, que é o mutante adversarial `M-IC5` (spec.md:114). Logo a
unicidade de `M51-18` é **construída** aqui, não uma ambiguidade a desfazer.

---

## 2. A regra dura desta matriz

**Escolhe-se a âncora nova pela PROPRIEDADE que o `desc` documenta, nunca por
"casa e passa".** Se a propriedade morreu, o certo é **aposentadoria com a razão
registrada** — R10 §1 (nunca enfraquecer o gate para passar) aplicado a mutante.

As três perguntas, nesta ordem (refinement.md §Critério central):

1. **A propriedade que o mutante ataca ainda existe no produto?**
   Não → aposentadoria + gate órfão vira dívida declarada. Sim → pergunta 2.
2. **O gate ainda faz a asserção correspondente, e o `reason` ainda casa a
   mensagem que ele emite hoje?** Gate mudou de forma → o par
   (mutante, gate, `reason`) é **re-derivado da mensagem atual** e re-registrado.
3. **A reancoragem produz a MESMA violação?** Provas cumulativas de T9:
   **(a)** `ocorrencias == 1` pelo preflight; **(b)** morte pelo gate **e** motivo
   esperados, nunca incidental (`tests_p51_mutants.js:9`); **(c)** sobrevivência
   com a asserção do gate neutralizada, em worktree efêmera (T10).

Nesta tarefa a prova **(a)** foi **medida**; **(b)** e **(c)** são de T019 e ficam
declaradas como pendência nominal ao fim de cada seção. A regra que uso para
escolher o recorte, aplicada igual nas quatro:

> **o menor recorte único que seja o SÍTIO CAUSAL da propriedade.** Contexto só
> entra quando a unicidade o exige — e, quando exige, escolhe-se entre os
> candidatos aquele que **documenta a propriedade**, não o que fica por perto.

### Como a prova (a) foi obtida sem editar nada

Cópia efêmera (T10) de `tests_p51_mutants.js` + os seis alvos, fora da árvore; as
quatro âncoras candidatas aplicadas **só na cópia**; `--preflight` executado lá. A
árvore real não foi tocada nem por um byte. Resultado:

```
PREFLIGHT p51 · 4 mutante(s) · interpretador python (padrão): resolvido
  ok  M51-03 · ocorrencias=1 em ui_p50_shell_v32.js
  ok  M51-16 · ocorrencias=1 em ui_v32.js
  ok  M51-18 · ocorrencias=1 em ui_v32.js
  ok  M51-20 · ocorrencias=1 em USER_GUIDE.md
todas as âncoras com ocorrencias == 1     -> exit 0
```

E, porque `ocorrencias == 1` prova unicidade mas **não** prova sítio, um oráculo
independente aplicou cada mutação na cópia e reportou a primeira linha divergente:

| mutante | linha atingida | arquivo |
|---|---|---|
| `M51-03` | **577** | `ui_p50_shell_v32.js` |
| `M51-16` | **1036** | `ui_v32.js` |
| `M51-18` | **1026** | `ui_v32.js` (`buildPrintReport`) — **não** `:131` (`legacySnapshot`) |
| `M51-20` | **427** | `USER_GUIDE.md` |

---

## 3. Triagem — as quatro da `p51`

### M51-03 — "exemplo de MSSP vaza para um qid incorreto"

**Propriedade defendida.** O exemplo de MSSP/SLA é **exclusivo** da pergunta
`monitoring-coverage`; nenhuma outra pergunta pode exibi-lo. É o que o `desc` diz
e é o que a asserção do gate reprova.

**P1 · a propriedade existe hoje?** **Sim, verificada em três pontos.**

- a tabela por pergunta continua existindo e continua sendo o canal da mutação:
  `P51_Q_HELP` em `ui_p50_shell_v32.js:574`;
- o `ex:` de `mandate` — o sítio histórico do mutante — vive em
  `ui_p50_shell_v32.js:577` (texto reescrito pela COPY-B §5.1: "charter" virou
  "direcionamento"; foi **só** isso que apodreceu a âncora);
- o exemplo canônico de MSSP segue exclusivo de `monitoring-coverage`, em
  `ui_p50_shell_v32.js:625`.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim — e a
re-derivação foi feita, com resultado de identidade.** O gate `P51-UX2`
(`tests_p50_core.js:2689`) **mudou de forma** na REV B: o exemplo deixou de ser um
nó abaixo do campo e passou a ser o *placeholder* do textarea
(`tests_p50_core.js:2709-2716`). Re-derivando o par a partir do gate de hoje:

- a asserção é `tests_p50_core.js:2723-2724` e emite literalmente
  `"exemplo de MSSP aparece em " + qid`;
- o `reason` registrado, `/exemplo de MSSP aparece em/i`, **casa essa mensagem sem
  alteração** — a re-derivação devolve o mesmo par;
- a mudança de forma é **a montante** do canal de mutação e não o rompe: `h.ex`
  continua alimentando o que o gate lê, em `ui_p50_shell_v32.js:694`
  (`ta.setAttribute("placeholder", h.ex)`).

Ou seja: a forma do gate mudou, o **par** não. Nada a re-registrar além da âncora.

**P3 · (a) unicidade.** `ocorrencias=1`, medido; sítio `:577`, medido.

**Saída da triagem: REANCORAR.**

**Recorte proposto** — muda **só** o `find`; o `repl` fica byte-idêntico ao de hoje:

```js
find: `      ex: "Ex.: direcionamento aprovado pelo CISO; patrocinador é o Diretor de TI; objetivos revistos trimestralmente; responsáveis definidos."`,
```

**Por que este recorte carrega a propriedade e não só casa texto.** O recorte é a
**própria célula mutada**: o `ex:` de uma pergunta que não é `monitoring-coverage`.
Não é vizinhança nem marcador de posição — é o dado cuja contaminação o gate
proíbe. Se amanhã `mandate` perder o `ex:`, a âncora apodrece de novo, e isso é
**sinal correto**: a propriedade deixou de ter aquele sítio.

**Detalhe que a T019 não pode perder.** O `repl` atual
(`"Ex.: MSSP cobre 8×5; plantão interno fora do horário. SLA P1 = 30 min."`) é
**deliberadamente diferente** do texto canônico de `monitoring-coverage` (`:625`).
Se fosse idêntico, o gate poderia disparar antes a asserção
`"exemplo repetido entre …"` (`tests_p50_core.js:2717`) e o `reason` **não**
casaria — matar por outra asserção é sobreviver, na contabilidade deste harness.
Uma segunda salvaguarda existe por ordem: `mandate` é o índice 0 de `P51_QIDS`
(`tests_p50_core.js:2652`) e é visitado antes de `monitoring-coverage`. Manter o
`repl` como está preserva as duas.

**Pendente para T019**: prova (b) — `MUT_ONLY=M51-03` + `node tests_p50_core.js`
com filtro `P51-UX2`, exigindo a linha `FAIL P51-UX2` com motivo casando
`/exemplo de MSSP aparece em/i`; prova (c) — neutralizar `:2723-2724` em worktree
efêmera e exigir **sobrevivência**.

---

### M51-16 — "capa colide com o cabeçalho no PDF"

**Propriedade defendida.** A capa do relatório é emitida **no fluxo** do documento
e **antes** do cabeçalho corrente; nenhuma das duas caixas invade a outra no papel.

**P1 · a propriedade existe hoje?** **Sim.**

- a capa continua sendo emitida como primeiro bloco do relatório de impressão:
  `ui_v32.js:1036` (`let h = qsCoverHTML();`), dentro de `buildPrintReport()`
  (`:1017`);
- o cabeçalho corrente segue logo depois, em `ui_v32.js:1041`, agora com
  `data-pr-band="wide"` (REV B §11.2/§11.3);
- a relação "capa antes do cabeçalho" é exatamente o que a REV B preservou ao
  reescrever o bloco — o comentário `:1037-1040` a documenta.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim, por
leitura de fonte** (o gate não é executável nesta máquina — ver §7). `P51-PDF1`
(`tests_p50_chromium.js:3500`) emite hoje:

- `tests_p50_chromium.js:3603-3604` → `"… : capa e cabeçalho colidem (head top X < fim da capa Y)"`;
- `tests_p50_chromium.js:3605` → `"… : capa fora do fluxo do documento (position …)"`.

O `reason` registrado, `/colidem|capa/i`, casa **as duas**. O gate ainda ganhou
força depois do mutante: passou a emular mídia `print` antes de medir
(`tests_p50_chromium.js:3529-3532`), com o comentário dizendo que foi assim que
"o mutante de colisão de capa passou". A asserção não mudou de forma; ficou
estrita.

**P3 · (a) unicidade.** `ocorrencias=1`, medido; sítio `:1036`, medido.

**Saída da triagem: REANCORAR.**

**Recorte proposto** — `find` e `repl` encolhem para **uma linha cada** (as barras
invertidas são as do template literal do harness):

```js
find: `  let h = qsCoverHTML();`,
repl: `  let h = \`<div style="position:absolute;top:0;left:0;height:400px">\` + qsCoverHTML() + \`</div>\`;` },
```

**Por que este recorte carrega a propriedade e não só casa texto.** A linha
`let h = qsCoverHTML();` **é** o ato de emitir a capa no fluxo — o sítio causal da
propriedade. A mutação continua sendo exatamente a mesma transformação de sempre:
tirar a capa do fluxo e posicioná-la absolutamente sobre o topo, colidindo com
`.pr-head`.

**Alternativa rejeitada: manter a segunda linha (`h += …pr-head…`) como contexto.**
Ela **nunca foi mutada** — aparece idêntica em `find` e em `repl`. Não acrescenta
discriminação (`let h = qsCoverHTML();` já é único no arquivo, ocorrência única
verificada), e acrescenta **superfície de apodrecimento**: foi precisamente ela
que matou esta âncora — a REV B inseriu um comentário no meio do par **e** mudou o
atributo da segunda linha. Reancorar mantendo-a seria reconstruir a armadilha. O
cabeçalho continua nomeado onde importa: na **asserção do gate**, que mede
`.pr-head` (`tests_p50_chromium.js:3548-3549`).

**Pendente para T019/T021**: provas (b) e (c) **não são medíveis localmente** —
`P51-PDF1` roda em `tests_p50_chromium.js` e o Chromium não existe nesta worktree
(§7). Declarado `NÃO EXECUTADO` local **com causa** e fechado no job `visual`
(D5/KI-3: honestidade do relato > paridade de execução).

---

### M51-18 — "agregado do relatório volta à forma sem arredondamento (regresso do B1)"

**Propriedade defendida.** O agregado **do relatório** é arredondado a uma casa
**antes** de nomear o estágio, para que o número impresso e o nome da faixa nunca
divirjam entre KPI, régua, jornada e leitura executiva. É o blocker B1.

**P1 · a propriedade existe hoje?** **Sim, e com a documentação junto.**

- forma canônica viva em `ui_v32.js:1026`, dentro de `buildPrintReport()` (`:1017`);
- o comentário `ui_v32.js:1022-1024` (`ERRATA B1 · agregado do relatorio na forma
  canonica … arredondar ANTES de nomear o estagio, para que numero impresso e nome
  da faixa nunca divirjam`) **enuncia a propriedade** no ponto exato dela;
- o que apodreceu a âncora foi a errata externa B-01, que inseriu comentário +
  `const pub = publishableStats(stats, suff);` (`:1027-1029`) entre `overall` e
  `computeFindings()`, partindo o bloco de três linhas registrado.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim.**
`P51-RPT6` (`tests_p50_core.js:3000`) deriva o oráculo de faixas do próprio
`stageOf()` do runtime, enumera 537 824 combinações, isola as fronteiras onde
média bruta e média arredondada nomeiam faixas diferentes e confere **cinco
superfícies**. As mensagens de hoje:

```
tests_p50_core.js:3104-3105  "<n>: KPI diz '…' e o canônico é '…'"
tests_p50_core.js:3106-3107  "<n>: régua lê '…' (esperado '…')"
tests_p50_core.js:3108-3111  "<n>: jornada do relatório diz '…' …"
tests_p50_core.js:3112-3113  "<n>: leitura executiva diz '…'"
```

O `reason` registrado — `/KPI diz|régua lê|jornada|leitura executiva|canônico/i` —
casa todas. Nada a re-derivar.

**P3 · (a) unicidade — e aqui ela é o ponto.** O texto natural do agregado é
**idêntico** em `ui_v32.js:131` (`legacySnapshot`, invariante M43) e `:1026`
(relatório). `String.replace` muta a **primeira** ocorrência: uma âncora de linha
solta atingiria `:131`, o sítio **errado**, e atacaria outra propriedade.

Isso não é detalhe de estilo — é a diferença entre matar e sobreviver, e foi
medido: com a mutação em `:131`, o gate reprova por `tests_p50_core.js:3075-3076`
→ `"agregado da tela <x> != <y>"`, mensagem que **não casa** o `reason` (`false`,
verificado). Pelo cabeçalho do harness (`tests_p51_mutants.js:9`) e por `:236`,
reprovar por motivo diferente do esperado é **SOBREVIVENTE**, não detectado. A
unicidade tem de ser **construída**, e construída **do lado certo**.

**Saída da triagem: REANCORAR — com unicidade construída.**

**Recorte proposto** — quatro linhas em `find` e em `repl`; a mutação continua
sendo **só** a da última linha:

```js
find: `  /* ERRATA B1 · agregado do relatorio na forma canonica (mesma de renderResults,
     legacySnapshot, computeTargetProfile e buildNarrativeSnapshot): arredondar ANTES
     de nomear o estagio, para que numero impresso e nome da faixa nunca divirjam. */
  const overall = suff && scored.length ? Math.round(scored.reduce((a,s)=>a+s.score,0)/scored.length*10)/10 : null;`,
repl: `  /* ERRATA B1 · agregado do relatorio na forma canonica (mesma de renderResults,
     legacySnapshot, computeTargetProfile e buildNarrativeSnapshot): arredondar ANTES
     de nomear o estagio, para que numero impresso e nome da faixa nunca divirjam. */
  const overall = suff && scored.length ? (scored.reduce((a,s)=>a+s.score,0)/scored.length) : null;` },
```

**Por que este recorte carrega a propriedade e não só casa texto.** O contexto
escolhido é o comentário que **é a especificação da propriedade** — ele diz, em
português, exatamente o que o mutante nega ("arredondar ANTES de nomear o
estagio"). Duas consequências:

- o recorte só existe onde a propriedade está declarada, e por isso seleciona
  `:1026` e nunca `:131` (medido: primeira linha divergente = **1026**);
- se alguém apagar esse comentário, a âncora apodrece — e apodrecer **aí** é sinal
  legítimo: a decisão B1 perdeu o registro no ponto onde ela vale, e a triagem tem
  de acontecer de novo.

**Alternativa rejeitada: ancorar para baixo** (`const overall` + comentário da
ERRATA EXTERNA + `const pub = publishableStats(stats, suff);`, `:1026-1029`).
Também é única, mas amarra a propriedade do **arredondamento** a uma decisão
**vizinha e não relacionada** (publicabilidade, B-01) — é "casa e passa" com outro
nome. Pior: a rot desta âncora nasceu exatamente de uma inserção **logo abaixo** da
linha; ancorar para cima é ancorar do lado que a história já mostrou ser o estável.

**Pendente para T019**: prova (b) — `MUT_ONLY=M51-18` + `node tests_p50_core.js`
com filtro `P51-RPT6`, exigindo `FAIL P51-RPT6` com motivo casando o `reason`;
prova (c) — neutralizar as comparações de `:3104-3113` em worktree efêmera e
exigir sobrevivência.

**Nota para T028**: o adversarial `M-IC5` (spec.md:114) é o **dual** deste recorte
— apontar o `find` para a linha solta e provar `âncora ambígua (n=2)`. Ele nasce em
cópia efêmera; a árvore real fica com a âncora construída acima.

---

### M51-20 — "manual volta a listar régua e legenda como seções próprias (R3)"

**Propriedade defendida.** A §12 do manual descreve a estrutura do relatório **na
ordem realmente emitida**, e **não** lista régua nem legenda como seções próprias —
porque a legenda vive na capa e a régua vive dentro do resumo de maturidade.

**P1 · a propriedade existe hoje?** **Sim.**

- a §12 existe e continua sendo uma lista numerada de 10 itens:
  `USER_GUIDE.md:416` (`## 12 · Relatório / PDF`), itens em `:419-430`;
- o manual continua afirmando explicitamente as duas localizações — "A legenda
  está na capa, não em seção própria" (`USER_GUIDE.md:421`) e "A régua está dentro
  do resumo" (`USER_GUIDE.md:426`);
- o produto continua produzindo essa ordem: `#pr-cover #pr-domlegend` e
  `#pr-maturity #pr-stage-ruler`, aferidos pelo gate em
  `tests_p50_core.js:3709-3712`.

O que apodreceu a âncora foi a renumeração da REV B: "Como interpretar" virou item
**2** (com dois-pontos no lugar do travessão) e "Prioridades" virou item **4**, com
", já na **página 2**".

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim.**
`P51-DOC13` (`tests_p50_core.js:3648`) mantém o bloco R3 inteiro em `:3714-3730`,
com as mensagens:

```
:3718-3719  "§12 lista <n> seções para <m> emitidas"
:3721-3722  "§12 item <i> não corresponde a <ids>: '…'"
:3725       "§12 não põe a legenda na capa"
:3728       "§12 não põe a régua no resumo de maturidade"
:3729-3730  "§12 ainda lista régua ou legenda como seção própria"
```

O `reason` registrado — `/§12|ordem|item \d+|legenda|r[ée]gua/i` — casa todas. E a
`ESPERADO` do gate (`:3694-3705`) **acompanhou** a decisão da REV B: dez seções,
"Como interpretar" antes do resumo. O gate está vivo e atualizado; só a âncora
ficou para trás.

**A contraprova que separa "a âncora envelheceu" de "o gate morreu":** `M51-19`,
**mesmo gate `P51-DOC13`**, mesmo arquivo-alvo, âncora **intacta** —
`ocorrencias=1` em `USER_GUIDE.md:291-293`, medido no mesmo preflight. Se o gate
tivesse morrido, `M51-19` teria morrido junto. Não morreu. O defeito é da âncora de
`M51-20`, e só dela.

**P3 · (a) unicidade.** `ocorrencias=1`, medido; sítio `:427`, medido.

**Saída da triagem: REANCORAR.**

**Recorte proposto** — `find` de uma linha; `repl` reintroduz os dois itens:

```md
find: `4. **Prioridades declaradas pelo negócio**, já na **página 2**;`,
repl: `4. **Régua 0–5** — posição do score entre os seis estágios;
5. **Legenda dos domínios** — nomes completos, na ordem canônica;
6. **Prioridades declaradas pelo negócio**, já na **página 2**;` }
```

**Por que este recorte carrega a propriedade e não só casa texto.** O item 4 é a
**costura** onde régua e legenda seriam reinseridas como seções próprias: vem logo
depois do item 3 ("Resumo de maturidade", que **contém** a régua) e do enunciado "A
régua está dentro do resumo". Mutar ali é exatamente reintroduzir o defeito R3 — a
mesma transformação do mutante original, transposta para a numeração de hoje. E é o
**menor** recorte único: a linha do item 4 já é única no manual
(`USER_GUIDE.md:427`; a ocorrência de `:102` é o título `## 5 · …`, texto
diferente).

**Alternativa rejeitada: incluir a linha anterior** (`   A régua está dentro do
resumo. A primeira página termina aqui;`). É retoricamente atraente — é a frase que
o mutante nega — mas não acrescenta unicidade e acrescenta rot: é uma linha de
prosa do manual, o tipo de texto que a REV B já reescreveu uma vez.

**Reação do gate, prevista por oráculo independente** (reimplementação do recorte
de §12 de `tests_p50_core.js:3714-3717`, rodada sobre o manual mutado em cópia):

| estado | itens de §12 | efeito |
|---|---|---|
| hoje | **10** | igual a `ESPERADO.length` → o gate passa nessa asserção |
| mutado | **12** | primeira asserção a disparar: `:3718-3719` → `"§12 lista 12 seções para 10 emitidas"` |

O `reason` casa essa mensagem (`true`, verificado). A asserção R3 específica
(`:3729-3730`) **também** dispararia — os dois itens novos casam
`/^\d+\.\s+\*?\*?(R[ée]gua|Legenda)/i` —, mas ela é alcançada **depois**.

**Consequência direta para a prova (c) da T019**, e é o motivo de estar escrito
aqui: a asserção a neutralizar para provar sobrevivência é a **de contagem**
(`:3718-3719`), não apenas a de R3 (`:3729-3730`). Neutralizar só a segunda
deixaria o mutante morrendo pela primeira, e a prova (c) devolveria um falso "morre
de qualquer jeito". As duas são asserções de R3 do mesmo gate, e a faixa
`:3713-3731` prevista em `tasks.md` cobre ambas.

**Zero byte do manual muda.** A reancoragem é no harness; `USER_GUIDE.md` é
**alvo**, não paciente (IC-7).

---

## 4. Resumo da triagem

| mutante | propriedade (do `desc`) | existe hoje? | gate / `reason` | saída | recorte novo |
|---|---|---|---|---|---|
| `M51-03` | exemplo de MSSP não vaza para outro `qid` | **sim** · `ui_p50_shell_v32.js:577`, `:625`, `:694` | `P51-UX2` vivo · `:2723-2724` · `reason` idêntico (re-derivado) | **reancorar** | `ex:` de `mandate` (`:577`) — só o `find` muda |
| `M51-16` | capa no fluxo, antes do cabeçalho, sem colisão | **sim** · `ui_v32.js:1036`, `:1041` | `P51-PDF1` vivo · `:3603-3605` · `reason` casa (lido, não executado) | **reancorar** | `let h = qsCoverHTML();` (`:1036`), linha única |
| `M51-18` | agregado do relatório arredondado antes do estágio | **sim** · `ui_v32.js:1022-1026` | `P51-RPT6` vivo · `:3104-3113` · `reason` casa | **reancorar** (unicidade **construída**) | comentário `ERRATA B1` + linha (`:1022-1026`) |
| `M51-20` | §12 não lista régua/legenda como seções próprias | **sim** · `USER_GUIDE.md:416-430` | `P51-DOC13` vivo · `:3714-3730` · `reason` casa | **reancorar** | item 4 da §12 (`:427`), linha única |

**Nenhuma das quatro é candidata a aposentadoria, e nenhuma responde "a propriedade
mudou de forma".** As quatro propriedades estão vivas, os quatro gates estão vivos,
os quatro `reason` casam a mensagem de hoje, e existe recorte único para as quatro —
provado, não inspecionado. Não há escalonamento do tipo plan.md §Protótipo a
disparar nesta wave.

---

## 5. Observado e **NÃO** triado — dívida nomeada

O preflight rodou pela primeira vez sobre os **180** mutantes das três harnesses e
achou **oito** âncoras fora de `ocorrencias == 1`. **Quatro não são de E2** — a
demanda escopa E2 nominalmente às quatro da `p51` (tasks.md §Escalonamentos, 1).
Aqui vai **o que foi observado**, sem triagem e sem conserto:

| harness | mutante | `desc` | alvo | estado medido | classe |
|---|---|---|---|---|---|
| `p50` | `M13` | escrever a evidência direto em `notes[k]` em vez do setter congelado | `ui_p50_shell_v32.js` | `ocorrencias=0` | âncora podre |
| `p50` | `M23` | inverter a leitura de `r.ok` no observador de export | `ui_p50_shell_v32.js` | `ocorrencias=0` | âncora podre |
| `p50` | `M35` | renderer do gate passa a conter o limiar literal | `ui_p50_results_v32.js` | **`ocorrencias=2`** | **âncora ambígua** |
| `p52` | `V322-M3` | reabrir SOC & Operations em todo rerender, anulando a decisão do usuário | `ui_p52_workspace_v32.js` | `ocorrencias=0` | âncora podre |

Três observações que valem registro, e nada além disso:

1. **`M35` é a única âncora ambígua das três campanhas.** Nas 180 medidas, é o
   único `≥2`; as outras sete são `0`. Classe distinta, tratamento distinto: `0`
   pergunta "onde a propriedade foi parar"; `2` pergunta "qual das duas é a
   propriedade". Quem decide isso não é esta wave.
2. **`V322-M3` é o que explica o `106/107` do CI.** Não era sobrevivente: era
   âncora podre. O gate `V322-CTXPAR1` nunca chegou a rodar contra a mutação — o
   relatório é que somava não executado como não detectado. O número estava certo
   na aritmética e errado no significado.
3. **`M13` e `M23` compartilham o alvo `ui_p50_shell_v32.js` com `M51-03`** — o
   mesmo arquivo que a REV B reescreveu. Sugere causa comum, não coincidência;
   confirmar é trabalho de quem triar a `p50`, não desta página.

**Dívida declarada**: as quatro acima seguem **não triadas e não reancoradas**. A
decisão sobre elas (wave, dono, e se entram nesta demanda ou viram achado próprio)
é do orquestrador com o `product-owner` — fora do meu domínio e fora do escopo
nominal de E2.

---

## 6. Divergências spec ↔ medido

Classificadas nas três classes de `spec-validate` (spec errada / implementação
divergente / faltando). Nenhuma bloqueia a T019.

| # | divergência | classe | direção proposta |
|---|---|---|---|
| 1 | `spec.md:181` chama `M51-18` de "o **caso real**" da borda 4 (âncora ambígua). **Medido: `M51-18` é `ocorrencias=0`, não `≥2`.** O único caso real de `≥2` na árvore é `p50/M35` | **spec errada** (redação de célula) | corrigir a redação: o caso de `M51-18` é **construído** em cópia efêmera — que é exatamente o que a definição operativa de `M-IC5` em `spec.md:114` já diz ("apontar a `find` de `M51-18` para …"). Se se quiser um caso **não construído**, o nome dele é `p50/M35`. Consumidor: T028 |
| 2 | o resumo da demanda vinha tratando `M51-18` como ambiguidade **a desfazer**; `refinement.md:135` já descrevia a rot corretamente ("a âncora exige as três linhas em sequência") | **spec errada** (premissa corrigida pela E1) | esta matriz registra a correção: a unicidade de `M51-18` é **construída**, não restaurada |
| 3 | `IC-5` está vermelho para a `p51`: 20 mutantes sem par em `mutation-matrix.json` + um par obsoleto (`campanhas P51 (múltiplos)`) | **faltando** (previsto) | é escopo de **E4/T024** (W8), não desta wave. Registrado aqui só para não ser confundido com resíduo da T017 — **esta matriz é a prosa da triagem, não o registro legível por máquina** |

---

## 7. O que esta tarefa **não** executou (R2 §1)

| não executado | motivo |
|---|---|
| `P51-UX2`, `P51-RPT6`, `P51-DOC13` (provas (b) e (c)) | são de **T019**; T017 é tipada `doc` e não cria comportamento. Executá-las aqui seria antecipar a reancoragem que esta página existe para preceder |
| `P51-PDF1` / `M51-16` (provas (b) e (c)) | **ambiente ausente, nomeado**: `tests_p50_chromium.js` exige Chromium; medido nesta worktree — `CHROME_PATH` não definida e cache `ms-playwright` inexistente. Fecha no job `visual` (D5/KI-3) |
| campanha `p51` completa | delegada ao job `visual`: o próprio `check_mutation.py` imprime `[DEFER] p51: exigida (alvo mudou) — delegada ao job com chromium (job visual)` |
| pipeline completo (`suites`, `baseline`) | fora do escopo da T017. O repin desta matriz é **R8a/T018** (`build-engineer`), no commit seguinte — entre este commit e o dele, o stage `baseline` fica legitimamente vermelho |
| edição de âncora, de `ui_*`, de `USER_GUIDE.md` ou de gate | **proibida nesta tarefa por construção** — e verificada: árvore limpa e SHA do harness inalterado |

---
---

# E2 estendida (W6b) — as quatro âncoras que o instrumento revelou

> **Esta seção fecha a dívida declarada na §5.** A §5 registrou quatro âncoras
> fora de `ocorrencias == 1` em `p50` e `p52` e as deixou **não triadas**, porque
> a E2 era nominalmente escopada às quatro da `p51`. O escopo foi **estendido**
> pelo orquestrador sob delegação do proprietário (2026-08-29). A razão é dura e
> vale registrada: sem elas o **`IC-4` fica vermelho para sempre**, o stage
> `mutation` nunca fecha e o PR da 013 não mescla. A alternativa — fazer o gate
> **tolerar** âncora podre como dívida — é exatamente o buraco que esta demanda
> existe para fechar (R10 §1).
>
> Mesma disciplina da T017 + T019: **triagem escrita antes da edição**, as três
> perguntas por âncora com `arquivo:linha`, e as **três provas cumulativas de
> T9** — (a) unicidade pelo preflight · (b) morte pelo gate **e** motivo
> esperados · (c) sobrevivência com a asserção correspondente neutralizada.
>
> **Zero byte de produto.** Nenhuma edição em `ui_*`, `USER_GUIDE.md`, engine ou
> suíte de gate. O que muda são **duas** âncoras de harness: `tests_p50_mutants.js`
> (M13, M23, M35) e `tests_p52_mutants.js` (V322-M3).

---

## 8. O red que esta extensão consome

Medido nesta tarefa — **reexecutado, não herdado de relato** (R2 §4) — na
worktree `phase5-013`, HEAD `18d78e6`, árvore limpa, 2026-08-29:

```
MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py
  -> exit 1 · "mutation: 0 campanha(s) executada(s) · 6 problema(s)"

[FAIL] IC-4: p50/M13 · âncora não encontrada — ocorrencias=0 em ui_p50_shell_v32.js (C1 exige exatamente 1 antes de mutar)
[FAIL] IC-4: p50/M23 · âncora não encontrada — ocorrencias=0 em ui_p50_shell_v32.js (C1 exige exatamente 1 antes de mutar)
[FAIL] IC-4: p50/M35 · âncora ambígua — ocorrencias=2 em ui_p50_results_v32.js (C1 exige exatamente 1 antes de mutar)
[OK]   IC-4: p51: 20 âncora(s) com ocorrencias == 1 (preflight, C1)
[FAIL] IC-4: p52/V322-M3 · âncora não encontrada — ocorrencias=0 em ui_p52_workspace_v32.js (C1 exige exatamente 1 antes de mutar)
```

Confirmado pelos **produtores** de C1, executados de forma independente:
`node tests_p50_mutants.js --preflight` ⇒ `3 âncora(s) fora de ocorrencias == 1:
M13, M23, M35` (de 53) · `node tests_p52_mutants.js --preflight` ⇒
`1 âncora(s) fora de ocorrencias == 1: V322-M3` (de 107).

**Os outros 2 dos 6 problemas são `IC-5`** (os 20 pares da `p51` ausentes de
`mutation-matrix.json` + o par obsoleto `campanhas P51 (múltiplos)`) — escopo de
**E4/T024, W8**. Ficam vermelhos ao fim desta wave **por previsão**, não por
resíduo, e não são tocados aqui.

### 8.1 Ambiente medido (R10 §2 — ausência se declara com nome)

| item | estado medido |
|---|---|
| `node` | v24.19.0 |
| `node_modules` em `phase5-013` | **inexistente** — resolvido por `NODE_PATH=C:\Projetos\QuickScan-SOC-CMM\phase5-009\node_modules` |
| `jsdom` | **30.0.1** (mesma versão pinada) |
| interpretador | `python` (padrão), resolvido em `C:\Python314\python.EXE` |
| **Chromium** | **AUSENTE, nomeado**: `CHROME_PATH` vazia; `C:\Users\usuario\AppData\Local\ms-playwright` inexistente; a própria suíte diz `P52 CHROMIUM: falha fatal — browserType.launch: Executable doesn't exist at ...\ms-playwright\chromium_headless_shell-1234\chrome-headless-shell-win64\chrome-headless-shell.exe` |
| trilha | **Opus** — não o `fable`/`max` pinado (créditos). Registrado em DEPENDÊNCIAS |

**Onde as provas rodaram.** Todas em **cópia efêmera** fora da árvore (T10): a
árvore real nunca foi mutada, e ao fim de cada experimento a cópia foi conferida
byte a byte contra a árvore real (9 arquivos de produto + HTML: todos `OK`).
O `check_mutation.py` **recusa árvore suja** (`:56-61`), então o veredito
canônico pós-edição também é medido em cópia — a árvore real só o produz depois
do commit, que não é meu.

---

## 9. A regra, e o corolário que esta seção exercita

Vale a mesma regra dura da §2: **a âncora nova se escolhe pela PROPRIEDADE que o
`desc` documenta, nunca por "casa e passa"**; propriedade morta ⇒ **aposentadoria
com razão registrada**, nunca reancoragem oportunista.

E o corolário, que aqui é o eixo do trabalho:

> **`ocorrencias == 1` prova unicidade, não prova sítio.** Para cada âncora, o
> sítio foi confirmado por **oráculo independente do preflight**: aplicação da
> mutação em cópia + primeira linha divergente, e — novo nesta seção —
> **arqueologia por `git log -S`**, que responde *quando a âncora casou e o que a
> quebrou*, sem depender de leitura de código.

A arqueologia devolveu um resultado que sozinho já ordena a triagem:

| mutante | autoria | `ocorrencias` da âncora ORIGINAL na autoria | commit que a quebrou | `ocorrencias` da âncora NOVA no mesmo ponto |
|---|---|---|---|---|
| `M13` | `e520c05` (5.0.2) | **1** | `4aa1f12` (Phase 5.1 UAT) ⇒ 0 | 1 · **já existia na autoria** |
| `M23` | `e520c05` (5.0.2) | **1** | `4aa1f12` (Phase 5.1 UAT) ⇒ 0 | 1 · **nasce no mesmo commit que quebra a antiga** |
| `M35` | `4e30c8e` (5.0.3) | **1** | `e527ef6` (5.0.4, `p50Matrix`) ⇒ **2** | 1 em `4e30c8e`, `e527ef6` **e** HEAD |
| `V322-M3` | `df5d9f6` (v3.2.2) | **0 — na própria autoria** | — | 1 · **já era 1 em `df5d9f6`** |

**`M13` e `M23` têm causa comum, e agora ela tem nome**: `4aa1f12`. A §5 suspeitou
("sugere causa comum, não coincidência"); está confirmado, e é o mesmo commit de
REV B/UAT que também apodreceu `M51-03` — três âncoras, um alvo, uma reescrita.

**`V322-M3` nasceu podre.** Não é rot: é âncora que **nunca casou em árvore
commitada**. O gate `V322-CTXPAR1` jamais rodou contra esta mutação — nem uma vez
desde `df5d9f6`. Isso fecha a leitura da §5 sobre o `106/107` do CI: não era
sobrevivente, não era regressão, era um mutante que **nunca existiu na prática**,
somado como "não detectado" por um relatório de dois estados.

---

## 10. Triagem — as quatro

### 10.1 `p50` / `M13` — "escrever a evidência direto em `notes[k]` em vez do setter congelado"

**Propriedade defendida.** O **handler congelado da Camada 1** é o **único
escritor** de `notes[k]`; a Camada 5 observa o evento de evidência e reconcilia
apresentação, **sem nunca escrever no owner**.

**P1 · a propriedade existe hoje?** **Sim — e está enunciada no ponto exato dela.**

- `ui_p50_shell_v32.js:502-510` é a especificação em português:
  *"A observação é ADITIVA: `addEventListener` não substitui o handler congelado
  (`t.oninput`), que continua sendo o único escritor de `notes[k]` … Não chama
  `render()`."*;
- o observador vive em `ui_p50_shell_v32.js:511-520` (`p50OnNoteInput`), ligado
  ao textarea congelado em `:522-533` (`p50BindNoteObserver`);
- a Camada 5 só **lê** `notes[k]`: `:538` (indicador), `:716` e `:760` (preview).
  Não há uma única escrita — e é isso que a asserção estrutural do gate afere.

**O que morreu foi o SÍTIO, não a propriedade.** A âncora antiga vivia no *proxy
P50 de evidência*, o segundo botão que reencaminhava o clique para `#notetgl`.
Ele foi **removido** — não escondido — pela UAT-03, e a remoção está documentada
em `ui_p50_shell_v32.js:769-776`. Sítio removido com propriedade viva é caso de
**reancoragem**, não de aposentadoria.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim — e
aqui o gate MUDOU DE FORMA, com consequência que precisa ficar escrita.**
`P50-UX4` (`tests_p50_core.js:1883`) tem **duas** asserções cujas mensagens o
`reason` (`/campo canônico de nota não foi aberto|escreve diretamente em notes/`)
alcança:

```
tests_p50_core.js:1896   "campo canônico de nota não foi aberto pelo atalho"   (comportamental)
tests_p50_core.js:1919   "módulo novo escreve diretamente em notes[...]"        (estrutural, varre SHELL_JS)
```

O gate deixou de clicar no proxy e passou a clicar no controle canônico
(`:1892`, com o comentário `:1888-1891` explicando a troca). **Consequência
medida:** a primeira alternativa do `reason` tornou-se **inalcançável** por uma
mutação confinada a `ui_p50_shell_v32.js` — quem abre o campo é a Camada 1, que
este mutante não toca. A metade que mata hoje é a **estrutural**, e é ela que a
medição confirma. Registro isto como achado (§13, divergência 1); **não** estreito
o `reason` nesta wave: mexer no par vai além de reancorar, e a disciplina desta
demanda é classificar, não consertar por conta própria.

**P3 · unicidade e sítio.** Medidos — ver §11.

**Saída da triagem: REANCORAR.**

**Recorte proposto** (`tests_p50_mutants.js`):

```js
find: `  function p50OnNoteInput() {
    try {`,
repl: `  function p50OnNoteInput() {
    try {
      notes[step - 1] = String(notes[step - 1] || "");`,
```

**Por que este recorte carrega a propriedade e não só casa texto.** O observador
**é** o lugar onde a Camada 5 encontra o evento de evidência e, por contrato,
**escolhe não escrever**. Mutar ali é literalmente "escrever a evidência direto em
`notes[k]` em vez de deixar o setter congelado fazê-lo" — a mesma transformação do
mutante original, transposta para o único sítio em que a Camada 5 ainda toca esse
evento. O `find` é o **menor recorte único** que põe a escrita **dentro** do bloco
guardado do observador (o `try` é o que faz dele uma observação de falha isolada;
escrever fora dele seria outra construção).

**Mudança no `repl`, declarada.** O `repl` antigo tinha duas linhas —
`notes[step - 1] = …` **e** `render();`. O `render()` era **plumbing do sítio
removido**: depois de um clique no proxy a tela repintava. No observador,
`render()` é proibido pelo **mesmo comentário** que enuncia a propriedade
(`:509`). Mantê-lo faria o mutante atacar **duas** propriedades ao mesmo tempo e
embaralharia "morte pelo motivo esperado". O mutante fica **menor** — e mutante
menor que ainda morre prova mais, não menos.

**Alternativa rejeitada: ancorar no comentário `:502-510`.** É a especificação da
propriedade (foi esse o critério que decidiu `M51-18`), mas ali a unicidade
**não** o exige: o cabeçalho da função já é único. A regra da §2 é explícita —
contexto só entra quando a unicidade obriga.

---

### 10.2 `p50` / `M23` — "inverter a leitura de `r.ok` no observador de export"

**Propriedade defendida.** O observador de exportação deriva o estado **do retorno
real** do predecessor: `ok === true` ⇒ `exported` **e** owner limpo;
`ok === false` ⇒ `export-failed`, sem tocar em metadado.

**P1 · a propriedade existe hoje?** **Sim, byte a byte no mesmo lugar.**

- `ui_p50_shell_v32.js:183-187` é o bloco: `if (r && r.ok) { p50SesState =
  "exported"; p50MarkClean(); … } else { p50SesState = "export-failed"; }`, com o
  comentário `/* falha não toca metadado */` na própria linha do `else`;
- o observador irmão de **import** (`:198-203`) tem a **mesma condição literal**
  `if (r && r.ok) {` — é o que torna a condição sozinha ambígua (medido: `n=2`).

**O que apodreceu.** `4aa1f12` inseriu `p51MetaOnExport(...)` **dentro** do bloco
de sucesso e, ao fazê-lo, quebrou o bloco de uma linha em bloco de três. A
propriedade não se moveu um milímetro; a **forma** do texto sim.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim, sem
re-derivação.** `P50-SESUX4` (`tests_p50_core.js:2127`) mantém as três asserções
que o `reason` alcança:

```
tests_p50_core.js:2182   "ok=true não marcou exported"
tests_p50_core.js:2183   "ok=true não marcou clean"
tests_p50_core.js:2192   "ok=false marcou exported"
```

**P3 · unicidade e sítio.** Medidos — ver §11.

**Saída da triagem: REANCORAR.**

**Recorte proposto** (`tests_p50_mutants.js`):

```js
find: `        if (r && r.ok) {
          p50SesState = "exported"; p50MarkClean();`,
repl: `        if (r && !r.ok) {
          p50SesState = "exported"; p50MarkClean();`,
```

**Por que este recorte carrega a propriedade e não só casa texto.** A condição
**é** a leitura de `r.ok` que o `desc` nomeia; a segunda linha é o que a torna o
observador **de export** e não o de import. Ou seja: o contexto entrou porque a
unicidade obrigou (`if (r && r.ok) {` sozinho ⇒ `ocorrencias=2`, sítios 183 e 199
— medido) **e** o contexto escolhido é o que documenta a propriedade
(sucesso ⇒ `exported` + `markClean`), não o que estava por perto. As duas
exigências da §2 caem no mesmo recorte.

**Alternativa rejeitada: manter as duas linhas antigas incluindo o `else`.** O
`else` não é mutado (aparece idêntico em `find` e `repl`), não acrescenta
unicidade e **acrescenta superfície de apodrecimento** — foi uma inserção *dentro*
do bloco que matou esta âncora. O `else` continua nomeado onde importa: na
asserção `:2192` do gate.

---

### 10.3 `p50` / `M35` — a **única âncora ambígua** das 180 medidas

**Propriedade defendida.** O **renderer do gate** não é dono de lógica de
suficiência: ele **consome o veredito canônico** (`contract.sufficient`) e nunca
reimplementa o limiar.

**P1 · a propriedade existe hoje?** **Sim** — `ui_p50_results_v32.js:733-738`, com
o cabeçalho da seção dizendo o nome dela: *"Superfície do gate executivo"*.

**P2 · o gate faz a asserção, e o `reason` casa?** **Sim.** `P50-SUF0`
(`tests_p50_core.js:1013`), bloco (a): `tests_p50_core.js:1032` emite
`<arquivo> + " contém comparação com o limiar global 10"`, que o `reason`
(`/limiar global 10/`) casa.

**P3 · QUAL das duas ocorrências carrega a propriedade — e prova de que a outra
não carrega.**

As duas ocorrências de `    var released = contract.sufficient === true;`:

| sítio | linha | função | o que `released` decide ali |
|---|---|---|---|
| **A** | `:300` | `p50Matrix(contract)` (`:292`) | se o **agregado por domínio** é publicado no modelo de dados das três visões (UI-013/UI-014 · B-503-COHERENCE) |
| **B** | `:738` | `p50BuildResults(contract)` (`:737`) | **o gate**: `data-p50-gate` = `released`/`blocked`, o texto do veredito e a liberação dos executive cards |

**Três oráculos independentes, e os três apontam para B.**

1. **Arqueologia.** `p50BuildResults` nasceu em `4e30c8e` — **o mesmo commit que
   escreveu `M35`** —, e ali a âncora tinha `ocorrencias=1`. `p50Matrix` só
   apareceu uma microfase depois, em `e527ef6`, e foi essa chegada que fez a
   contagem virar 2. O sítio A **não existia** quando o mutante foi escrito: ele
   nunca foi o alvo, ele virou colisão.
2. **O par estrutural/comportamental.** `M36` — `desc` "renderer do gate
   reimplementa a comparação de suficiência" — já ancora **exatamente** em
   `p50BuildResults`, com a mesma linha e o cabeçalho da função por contexto
   (`tests_p50_mutants.js`, bloco de `M36`). `M35` e `M36` são as duas metades do
   mesmo sítio: a estrutural (limiar literal) e a comportamental (veredito
   próprio). O harness já dizia onde o sítio ficava.
3. **Oráculo executável — e este é o que decide.** Com a asserção do limiar
   literal **neutralizada** em cópia efêmera, os dois sítios se separam:

   | `M35` ancorado em | `tests_p50_core.js` pristino | com a asserção do limiar neutralizada |
   |---|---|---|
   | **B** (`p50BuildResults`) | `DETECTADO` · `FAIL P50-SUF0 [ui_p50_results_v32.js contém comparação com o limiar global 10]` | `SOBREVIVENTE` · **`FAIL P50-SUF0`** `[gate da UI 'released' != veredito canônico false em [1,3,2,2,2]]` |
   | **A** (`p50Matrix`) | `DETECTADO` · **mensagem idêntica** | `SOBREVIVENTE` · **`PASS P50-SUF0`** — o gate não reprova por nada |

   Leitura, sem suavizar: **com a asserção ativa, os dois sítios são
   indistinguíveis** — a varredura de `P50-SUF0` é por **arquivo**, e mutar
   qualquer lugar de `ui_p50_results_v32.js` produz a mesma frase. É a camada
   **de baixo** que discrimina: só o sítio B faz a **superfície do gate** divergir
   do veredito canônico (`tests_p50_core.js:1132-1134`). A propriedade do `desc`
   — *renderer **do gate*** — está em B; em A há outro `released`, que decide
   publicação de agregado e que o gate não afere comportamentalmente.

**Isto responde à pergunta que a extensão exigia**, e responde pela negativa ao
cenário de escalonamento: **não** é o caso de "as duas carregam a propriedade".
Carregam a mesma *sensibilidade do gate* (que é file-scoped), e isso é fato
registrado — não a *propriedade*, que é function-scoped e vive em B.

**Saída da triagem: REANCORAR no sítio B — a ambiguidade se desfaz por refinamento
do recorte, não por escolha de ocorrência.**

**Recorte proposto** (`tests_p50_mutants.js`):

```js
find: `  function p50BuildResults(contract) {
    var released = contract.sufficient === true;`,
repl: `  function p50BuildResults(contract) {
    var released = contract.confirmedGlobal >= 10;`,
```

**Por que este recorte e não outro.** É o **menor recorte único** e o cabeçalho da
função é precisamente o que distingue "renderer **do gate**" de "construtor da
matriz" — o contexto exigido pela unicidade é o mesmo que documenta a
propriedade. Medido em `4e30c8e`, `e527ef6` e HEAD: `ocorrencias=1` nos três —
**este recorte teria sido correto desde a autoria** e a ambiguidade de 5.0.4 não o
teria alcançado.

**Consequência declarada: `M35` e `M36` passam a ter o `find` byte-idêntico.**
Não é defeito, é o que os dois `desc` dizem — mesmo sítio, duas mutações, dois
`reason` distintos (`/limiar global 10/` × `/gate da UI .* != veredito canônico/`).
O precedente na casa é `M37`/`M38`, que já compartilham sítio com recortes
diferentes. O custo é acoplamento: um refactor de `p50BuildResults` apodrece as
duas ao mesmo tempo — e apodrecer junto, ali, é sinal correto.

**Alternativa rejeitada: incluir o comentário `:733-736` ("Superfície do gate
executivo").** Seria retoricamente forte, mas não acrescenta **nenhuma**
discriminação sobre o cabeçalho da função e acrescenta rot (prosa se reescreve).

---

### 10.4 `p52` / `V322-M3` — "reabrir SOC & Operations em todo rerender, anulando a decisão do usuário"

**Propriedade defendida.** A passagem de decoração do editor de contexto **não
reabre** grupo que o usuário fechou: a decisão do usuário sobrevive a todo
rerender.

**P1 · a propriedade existe hoje?** **Sim.**

- a passagem é `p52ContextEditorDecor()` (`ui_p52_workspace_v32.js:1413-1424`), e
  as três chamadas de decoração seguem lá, em sequência (`:1418-1420`);
- nenhuma delas abre grupo: a normalização recolhida é decidida em outro lugar
  (`V322-M18` ancora nela, âncora sã);
- o gate mede a propriedade nas duas frentes — abertura inicial e rerender.

**O que apodreceu — e a resposta é diferente das outras três.** Nada apodreceu:
**a âncora nasceu podre**. Em `df5d9f6`, o commit que **escreveu** `V322-M3`, a
âncora já contava `ocorrencias=0` (medido) — o mesmo commit havia acrescentado o
comentário da ERRATA A-02 e `p52RestoreEditorFocus(keep);` entre `p52CapHelp(ed);`
e o `}` que a âncora exigia. O mutante nunca foi executável em árvore commitada.

**P2 · o gate faz a asserção, e o `reason` casa a mensagem de hoje?** **Sim, por
leitura de fonte** (gate não executável nesta máquina — §12). `V322-CTXPAR1`
(`tests_p52_chromium.js:4477`) emite hoje:

```
tests_p52_chromium.js:4458   "o decorador REABRIU o grupo que o usuário fechou"
tests_p52_chromium.js:4433   "<tag>: abertura inicial = [<gids>] (esperado nenhum grupo aberto)"
```

O `reason` registrado — `/o decorador REABRIU (no rerender )?o grupo que o usuário
fechou|abertura inicial = \[g1\]/` — casa **as duas**, e a nota de migração do
próprio harness (`tests_p52_mutants.js`, bloco de `V322-M3`) já previa por escrito
que, com o estado inicial recolhido, é pela **abertura inicial** que o gate pega.
Nada a re-derivar.

**P3 · unicidade e sítio.** Medidos — ver §11.

**Saída da triagem: REANCORAR.**

**Recorte proposto** (`tests_p52_mutants.js`):

```js
find: `    p52CapHelp(ed);`,
repl: `    p52CapHelp(ed);
    var g1m = ed.querySelector('details[data-gid="g1"]');
    if (g1m) g1m.open = true;`,
```

**Por que este recorte carrega a propriedade e não só casa texto.**
`    p52CapHelp(ed);` é a **última chamada de decorador da passagem** — o ponto em
que "o decorador terminou de passar" e a partir do qual reabrir `g1` é exatamente
o defeito do `desc`. Conferido por oráculo estrutural: com a mutação aplicada, o
bloco inserido fica **dentro** de `p52ContextEditorDecor`, entre `p52CapHelp(ed);`
e a restauração de foco, e `node --check` aceita o arquivo. O precedente de forma
está no próprio harness: `V322-M24` ancora em `    p52ContextRegions(ed);` — a
**primeira** chamada da mesma passagem — para recolher a cada passagem. As duas
âncoras emparedam a passagem pelas pontas, cada uma mínima e única.

**Alternativa rejeitada: manter as três chamadas + `}` (o recorte de nascença).**
Também é única hoje (medido), mas reconstrói a armadilha: o `}` é vizinho de uma
correção **recente e volátil** (a restauração de foco de A-02, `:1421-1423`), e foi
exatamente essa vizinhança que impediu esta âncora de casar **desde sempre**.
Ancorar longe do que a história mostrou instável é a mesma lição de `M51-16`.

---

## 11. As três provas de T9 — medidas

Tudo em **cópia efêmera** (T10), `NODE_PATH` para `phase5-009/node_modules`,
árvore real nunca mutada.

### (a) Unicidade — `ocorrencias == 1` pelo preflight, e o **sítio** por oráculo independente

```
node tests_p50_mutants.js --preflight   ->  exit 0 · "todas as âncoras com ocorrencias == 1"  (53/53)
node tests_p52_mutants.js --preflight   ->  exit 0 · "todas as âncoras com ocorrencias == 1"  (107/107)
```

O preflight prova unicidade. O **sítio** vem de fora dele — mutação aplicada em
cópia, primeira linha divergente:

| mutante | recorte candidato | `ocorrencias` | 1ª linha divergente | é o sítio da propriedade? |
|---|---|---|---|---|
| `M13` | `p50OnNoteInput` + `try` | **1** | **513** | sim — dentro do observador (`:511-520`) |
| `M23` | condição + `exported`/`markClean` | **1** | **183** | sim — observador de **export** (o de import fica em `:199`) |
| `M35` | `p50BuildResults` + `released` | **1** | **738** | sim — **não** `:300` (`p50Matrix`) |
| `V322-M3` | `p52CapHelp(ed);` | **1** | **1421** | sim — dentro de `p52ContextEditorDecor` (`:1413-1424`) |

Contraprovas medidas no mesmo oráculo, que mostram por que o contexto entrou:

```
M23 com a condição sozinha  -> ocorrencias=2 (linhas 183 e 199)
M35 com a linha sozinha     -> ocorrencias=2 (linhas 300 e 738)   <- o red de hoje
```

**Sondas de falsificação** — o verde de `IC-4` não pode ser tautologia (mesma
disciplina da T019). Medidas em memória sobre a árvore real; nenhum arquivo
escrito:

| mutante | âncora real | sonda 1: **um caractere a mais** no `find` | sonda 2: âncora **duplicada no alvo** | veredito |
|---|---|---|---|---|
| `M13` | 1 | **0** (`âncora não encontrada`) | **2** (`âncora ambígua`) | discrimina |
| `M23` | 1 | **0** | **2** | discrimina |
| `M35` | 1 | **0** | **2** | discrimina |
| `V322-M3` | 1 | **0** | **2** | discrimina |

As quatro reagem **nas duas direções**: o `1` não é um número que o instrumento
devolveria de qualquer jeito.

### (b) Morte pelo **gate e motivo esperados**

| mutante | comando | veredito | linha do gate |
|---|---|---|---|
| `M13` | `MUT_ONLY=M13 node tests_p50_mutants.js` | **DETECTADO** | `FAIL  P50-UX4 — … [módulo novo escreve diretamente em notes[...]]` |
| `M23` | `MUT_ONLY=M23 node tests_p50_mutants.js` | **DETECTADO** | `FAIL  P50-SESUX4 — … [ok=true não marcou exported]` |
| `M35` | `MUT_ONLY=M35 node tests_p50_mutants.js` | **DETECTADO** | `FAIL  P50-SUF0 — … [ui_p50_results_v32.js contém comparação com o limiar global 10]` |
| `V322-M3` | `P52_MUT_ONLY=V322-M3 node tests_p52_mutants.js` | **NÃO EXECUTADO · gate não pôde ser executado** | — (Chromium ausente, §12) |

Em todas: `restauração: … OK · html OK`; nenhuma evidência escrita
(`P50_NO_EVIDENCE` por construção; com filtro ativo o recibo não é emitido).

Sobre `V322-M3`: a causa impressa é **`gate não pôde ser executado`**, e **não**
`rebuild` — ou seja, a mutação **foi aplicada e o HTML foi reconstruído com
sucesso** sobre a âncora nova. O que faltou é ambiente, não âncora. É o vocabulário
de três estados fazendo exatamente o que a demanda pediu: um mutante que não rodou
não é sobrevivente.

### (c) Sobrevivência com a asserção neutralizada

Neutralização **em bloco**, nunca de uma asserção só: desliga-se **todas** as
asserções do gate esperado cuja mensagem o `reason` alcança — neutralizar parte
devolveria um falso "morre de qualquer jeito" (lição de `M51-20`).

| mutante | asserções neutralizadas | veredito | resíduo |
|---|---|---|---|
| `M13` | `tests_p50_core.js:1896` + `:1919` | **SOBREVIVENTE** | `PASS P50-UX4` — o gate esperado **não reprovou** por nada |
| `M23` | `:2182` + `:2183` + `:2192` | **SOBREVIVENTE** | `FAIL P50-SESUX4 [ok=false marcou clean]` — asserção **fora** do `reason`, portanto não é detecção |
| `M35` | `:1032` | **SOBREVIVENTE** | `FAIL P50-SUF0 [gate da UI 'released' != veredito canônico false em [1,3,2,2,2]]` — a camada comportamental, fora do `reason` |
| `V322-M3` | — | **não medível localmente** (§12) | — |

As três provam o que (c) existe para provar: **foi aquela asserção que matou**, não
o gate por acaso. Onde há resíduo (`M23`, `M35`), ele está **nomeado** e é de
asserção que o `reason` não cobre — o harness classifica como `SOBREVIVENTE`
("reprovou por motivo diferente do esperado"), que é a contabilidade correta.

---

## 12. O que esta tarefa **não** executou (R2 §1 — SKIP silencioso é FAIL)

| não executado | causa nomeada | onde fecha |
|---|---|---|
| `V322-M3` provas **(b)** e **(c)** | **Chromium ausente**: `CHROME_PATH` vazia, `…\AppData\Local\ms-playwright` inexistente, `browserType.launch: Executable doesn't exist at …chromium_headless_shell-1234…` | job `visual` do commit pushado (D5/KI-3: honestidade do relato > paridade de execução) — mesmo tratamento dado a `M51-16` na T019 |
| campanha completa das três harnesses | **proibida nesta wave por instrução** — as provas são por mutante, isoladas | T029 (W9) |
| `gen_pins.py` | **proibido nesta wave por instrução** | repin é do `build-engineer` |
| `check_mutation.py` na **árvore real** pós-edição | o stage **recusa árvore suja** (`:56-61`) e o commit não é meu | medido em cópia efêmera (§14); veredito canônico na árvore real, depois do commit |
| `spec-validate`, pipeline completo | fora do escopo desta wave | T029 |

---

## 13. Divergências e achados

Classificados nas três classes de `spec-validate`. Nenhum bloqueia a reancoragem.

| # | divergência / achado | classe | direção proposta |
|---|---|---|---|
| 1 | **`P50-UX4` mudou de forma e uma metade do `reason` de `M13` ficou inalcançável.** O gate deixou de clicar no proxy P50 (removido pela UAT-03) e passa a clicar no controle canônico (`tests_p50_core.js:1892`): `campo canônico de nota não foi aberto` **não pode mais** ser produzido por mutação confinada a `ui_p50_shell_v32.js`. Um `reason` com alternativa inalcançável é uma porta aberta para **detecção incidental** — que o cabeçalho do harness proíbe | **implementação divergente** | estreitar o `reason` de `M13` para `/escreve diretamente em notes/` (medido: com o `reason` estreito, (b) continua `DETECTADO` e (c) continua `SOBREVIVENTE`). **Não executado aqui**: alterar o par vai além de reancorar. Consumidor: E3/T022 ou achado próprio |
| 2 | **`V322-M3` nasceu podre** — `ocorrencias=0` no próprio commit de autoria (`df5d9f6`). O gate `V322-CTXPAR1` **nunca** rodou contra esta mutação | **implementação divergente** (o mutante nunca mediu nada) | resolvido pela reancoragem desta seção; o dado histórico entra no relatório final como a explicação completa do `106/107` — não era sobrevivente **nem** regressão |
| 3 | **A asserção do limiar de `P50-SUF0` é por ARQUIVO; o `desc` de `M35` é por FUNÇÃO.** Com ela ativa, mutar `p50Matrix` ou `p50BuildResults` produz **a mesma** morte e a **mesma** frase. Unicidade + morte-pelo-motivo **não discriminam** o sítio neste par | **spec errada** (a §5 registrou "qual das duas é a propriedade" como se o gate pudesse responder; ele não pode) | registrado: o discriminante é a camada comportamental (`tests_p50_core.js:1132-1134`) + a arqueologia. Sem valor de bloqueio; vale como precedente para futuras âncoras sobre asserções de varredura |
| 4 | `IC-5` segue vermelho para a `p51` (20 mutantes sem par + par obsoleto) | **faltando** (previsto) | **E4/T024, W8**. Registrado para não ser confundido com resíduo desta wave |

**Nenhuma das quatro é candidata a aposentadoria.** As quatro propriedades estão
vivas e localizadas com `arquivo:linha`; os quatro gates estão vivos; os quatro
`reason` casam a mensagem de hoje; e existe recorte único para as quatro —
**provado, não inspecionado**. Nenhuma resposta "a propriedade mudou de forma" a
disparar `plan.md §Protótipo`; e o único gate que mudou de forma (`P50-UX4`)
devolveu re-derivação com resultado registrado, não bloqueio.

---

## 14. Resumo da E2 estendida

| harness | mutante | estado no red | recorte novo | (a) | (b) | (c) |
|---|---|---|---|---|---|---|
| `p50` | `M13` | `ocorrencias=0` | `p50OnNoteInput` + `try` (`:511-512`) | **1** · sítio 513 | **DETECTADO** `P50-UX4` | **SOBREVIVENTE** (`PASS`) |
| `p50` | `M23` | `ocorrencias=0` | condição de export + `exported`/`markClean` (`:183-184`) | **1** · sítio 183 | **DETECTADO** `P50-SESUX4` | **SOBREVIVENTE** |
| `p50` | `M35` | **`ocorrencias=2` · ambígua** | `p50BuildResults` + `released` (`:737-738`) | **1** · sítio 738 | **DETECTADO** `P50-SUF0` | **SOBREVIVENTE** |
| `p52` | `V322-M3` | `ocorrencias=0` (**de nascença**) | `p52CapHelp(ed);` (`:1420`) | **1** · sítio 1421 | **NÃO EXECUTADO** · Chromium | **NÃO EXECUTADO** · Chromium |

**`IC-4` medido depois da reancoragem**, em cópia efêmera do estado pós-edição
(o stage recusa árvore suja; a árvore real só produz o veredito canônico depois do
commit):

```
[OK]   IC-4: p50: 53 âncora(s) com ocorrencias == 1 (preflight, C1)
[OK]   IC-4: p51: 20 âncora(s) com ocorrencias == 1 (preflight, C1)
[OK]   IC-4: p52: 107 âncora(s) com ocorrencias == 1 (preflight, C1)
---- integridade: 2 problema(s) nomeado(s) ----     (os dois são IC-5 / E4-T024)
```

**`IC-4` fica verde nas três harnesses pela primeira vez desde a W3** — e é a
primeira vez desde sempre para `p50` e `p52`, que nunca tiveram preflight antes da
W4/W5. Os problemas nomeados caem de **6 para 2**, e os **dois** que restam são os
`[FAIL]` de `IC-5` (`p51`), escopo de **E4/T024** na W8.

**Ressalva honesta sobre a medição em cópia** (R2 §1): a cópia efêmera não é um
repositório git, então o **laço de trigger** que roda *depois* da seção de
integridade se comporta de outro jeito lá (`[WARN] sem origin/develop para diff` ⇒
executa a campanha `core`, que na árvore real está `[OK] core: nenhum alvo mudou
desde a base — campanha não exigida`). **A seção de integridade não usa git** — ela
lê o conteúdo da árvore e o JSON do contrato C1 —, portanto as linhas `IC-*` acima
valem para o conteúdo pós-edição. O laço de trigger, não: aquele só se mede na
árvore real, depois do commit.

Conferido também na **árvore real** (o preflight, ao contrário do stage, não exige
árvore limpa):

```
node tests_p50_mutants.js --preflight  ->  exit 0 · todas as âncoras com ocorrencias == 1   (53)
node tests_p51_mutants.js --preflight  ->  exit 0 · todas as âncoras com ocorrencias == 1   (20)
node tests_p52_mutants.js --preflight  ->  exit 0 · todas as âncoras com ocorrencias == 1   (107)
```

### 14.1 Regressão congelada — conferida, não presumida

| item | estado |
|---|---|
| `IC-7` · nenhum path de produto no diff | **intacto** — `git diff --name-only` devolve **três** arquivos: esta matriz, `tests_p50_mutants.js`, `tests_p52_mutants.js` |
| `tests_p51_mutants.js` (as quatro âncoras da T019) | **não tocado** · preflight segue `20/20`, exit 0 |
| `tests_p50_core.js`, `tests_p52_chromium.js` (suítes de gate) | **não tocados** — a neutralização de (c) só existiu em cópia |
| `check_mutation.py`, `expected_suites.json`, `mutation_map.json` | **não tocados** |
| restauração por SHA (`tests_p50_mutants.js:1072`, `tests_p52_mutants.js:1643`) | **intacta**, não enfraquecida (borda 12) |
| guarda do acervo de evidência (`p50:1077,1088` · `p52:1645,1653`) | **intacta** |
| `IC-1` (prefixo POSIX e literal de interpretador) | **verde nos quatro harnesses** — `53`/`20`/`107`/`3` `cmd`, nenhum com prefixo |
| `IC-6` (`p51.targets`) | **verde**, 7 caminhos |
| registro canônico de suítes (R10 §3) | **nada a acrescentar**: as harnesses de mutação não vivem em `expected_suites.json` (são dirigidas pelo stage `mutation`, não pelo stage `suites`) — nenhuma suíte nova nasceu nesta wave |
---

# E3 (W7) — classificação dos dois não-KILL no vocabulário fechado

## 15. As duas saídas, e por que são diferentes

O red desta seção é o relato do job `visual` do CI, **não medido aqui** (sem
Chromium nesta máquina):

```
p50:  52/53   · não-KILL: SOBREVIVENTE P50::M51 · gate P50-PR1  · reprovou por motivo diferente do esperado
p51:  19/20   · não-KILL: SOBREVIVENTE M51-01   · gate P51-VIS1 · o gate esperado NÃO reprovou
p52: 107/107  · não-KILL: nenhum
```

As duas **notas** do harness já separam os casos, e a classificação da spec
(§Classificação de par não-KILL) confirma a separação:

| par | nota do harness | classificação | conserto |
|---|---|---|---|
| `P50::M51` | `reprovou por motivo diferente do esperado` | **rot semântica** | **em escopo** — o par é re-derivado da mensagem atual |
| `p51/M51-01` | `o gate esperado NÃO reprovou` | **gate sem poder discriminante (achado EA-7)** | **fora de escopo** — a demanda para; achado + demanda própria |

A diferença não é de grau: no primeiro caso **o gate reprovou** (a propriedade
está viva e medida, envelheceu a mensagem); no segundo **o gate passou** (a
propriedade está viva e o gate a afirma, mas a mutação não consegue mais
violá-la).

---

## 16. `P50::M51` — rot semântica, e a re-derivação do `reason`

### 16.1 As três perguntas da triagem (respondidas antes da edição)

**(1) A propriedade que o `desc` documenta ainda existe?** Sim.
`ui_p50_v32.css:637-656` é explícito: *"Toda decisão de neutralização da Camada 5
vive AQUI dentro"* — dentro de `@media screen`. O bloco existe, as quatro regras
existem, e a razão registrada (B-AUD-503-2 + B-AUD-FIN-503-1) é a mesma. A
mutação — remover o `@media screen{…}` que envolve as quatro — continua sendo
uma violação real da propriedade. **Não é aposentadoria.**

**(2) O gate ainda mede a propriedade?** Sim, e reprovou. O que mudou foi **onde**
ele a mede. O enunciado de `P50-PR1` migrou pela errata da auditoria externa
B-02/B-03 (`tests_p50_chromium.js:689-742`): o DOCUMENTO deixou de ser
`.wrap`/`#app` e passou a ser `#v32-print-report`. No enunciado antigo, o
vazamento binário fazia os valores legados **sumirem do papel**, e o gate dizia
isso com as palavras do `reason` de então. No enunciado novo, a superfície legada
já não pode ser pintada no papel de jeito nenhum — o vazamento binário deixou de
mudar o **veredito de visibilidade** e passou a ser visível apenas pelo oracle de
apresentação contínua contra a baseline de ENTRADA (`:1140-1168`).

**(3) O `reason` casa a mensagem atual?** Não — e por uma razão que vale
registrar, porque é a armadilha nomeada na triagem anterior: **as cinco
alternativas eram inalcançáveis**.

| alternativa do `reason` antigo | ocorrências em `tests_p50_chromium.js` |
|---|---|
| `ausente do papel` | 0 |
| `não é a superfície impressa` | 0 |
| `difere do baseline de entrada` | 1 — **dentro de `cmp`, `:1046`, definido e nunca invocado** |
| `fills visíveis no papel` | 0 |
| `espaço mutilado` | 0 |

`cmp` sobreviveu à errata como código morto: a própria errata explica, em
`:1062`, que a comparação de identidade foi substituída por `dif()` — e a função
antiga ficou. Um `reason` cuja única alternativa "viva" mora em código morto é
detecção incidental esperando acontecer.

### 16.2 O `reason` novo — escolhido pela propriedade, não por "casa e passa"

```
/gate-bloqueado · estilo divergente em (\.scale-legend|\.lbl > span|\.fill)\[\d+\] propriedade display: baseline "[^"]+", candidato "none"/
```

Três decisões, cada uma com uma razão:

1. **Por que o oracle de apresentação contínua?** Porque é o único ponto do gate
   que ainda mede "a neutralização não alcança o papel" depois da errata —
   comparação por estilo computado, propriedade a propriedade, contra a baseline
   de ENTRADA da 5.0.3.
2. **Por que `display`, e não `opacity`/`position`?** Porque `M51` desconfina o
   **bloco inteiro**, e a assinatura própria dele é o vazamento **binário**
   (`display:none` de `.p50-legacy-gone`) — a classe que o comentário do próprio
   harness (`tests_p50_mutants.js:795-805`) diz que `M52` (opacidade) e `M53`
   (posicionamento) **não** cobrem. Casar a assinatura de `M52`/`M53` aqui
   mataria `M51` pela propriedade do vizinho, e ele voltaria a apodrecer pelo
   mesmo motivo.
3. **Por que `gate-bloqueado` no `reason`?** Porque a neutralização só existe sob
   gate fechado; sob `gate-liberado` (`FX.P50_F5`) nada está neutralizado e uma
   divergência ali significaria outra coisa.

**Alcançabilidade das três alternativas** — a armadilha do `reason` anterior foi
exatamente a alternativa impossível, então cada uma foi provada:

| alternativa | recebe `p50-legacy-gone` em | a baseline TEM de exibi-lo, senão o gate reprova em |
|---|---|---|
| `.lbl > span` | `ui_p50_results_v32.js:241` | `tests_p50_chromium.js:1079-1080` (`bm.valuesVisible.some`) |
| `.fill` | `ui_p50_results_v32.js:243` | `tests_p50_chromium.js:1081-1082` (`bm.fillsVisible === 0`) |
| `.scale-legend` | `ui_p50_results_v32.js:219` | `tests_p50_chromium.js:1078` (`dif("legendVisible(legado)", …, true, false)`) |

`.conf` também recebe a classe (`:242`), mas **ficou de fora**: o gate não tem
asserção que obrigue a baseline a exibi-lo, logo a alcançabilidade não estaria
provada — e alternativa não provada é a doença que este conserto existe para
matar.

### 16.3 As três provas de T9

**(a) Unicidade — EXECUTADA, e já estava fechada.** A âncora não mudou (rot
semântica conserta a MENSAGEM, não o recorte). Reconferida na árvore real depois
da edição:

```
node tests_p50_mutants.js --preflight  ->  exit 0 · 53/53 âncoras com ocorrencias == 1
                                           M51 -> {"arquivo":"ui_p50_v32.css","ocorrencias":1,"estado":"ok"}
```

**(b) Morte pelo gate e motivo esperados — PARCIAL.** `P50-PR1` exige Chromium,
ausente aqui (§16.4). O que **foi** medido, com o emissor extraído do próprio
arquivo do gate (`PR1_STYLE_PROPS`, `PR1_STYLE_SELECTORS`, `pr1DiffStyles`, sem
cópia digitada) e alimentado com o efeito das quatro regras desconfinadas:

```
22 divergências emitidas sob `gate-bloqueado`, entre elas:
  gate-bloqueado · estilo divergente em .scale-legend[0] propriedade display: baseline "block", candidato "none"
  gate-bloqueado · estilo divergente em .lbl > span[0]   propriedade display: baseline "block", candidato "none"
  gate-bloqueado · estilo divergente em .fill[0]         propriedade display: baseline "block", candidato "none"

gateLine() captura a linha FAIL de P50-PR1 : SIM
reason ANTIGO casa                          : false     <- reproduz o veredito do CI (rot)
reason NOVO   casa                          : true
```

Quatro **controles negativos**, todos no comportamento esperado:

| controle | reason NOVO casa? |
|---|---|
| sem mutação (zero divergências) | `false` |
| só a regra de opacidade desconfinada (= `M52`) | `false` |
| só a regra de posicionamento desconfinada (= `M53`) | `false` |
| a mesma divergência sob o estado `gate-liberado` | `false` |

O que falta para (b) plena é o navegador: provar que a mutação produz, no
Chromium, os valores computados que aqui foram alimentados. Fecha no job
`visual`.

**(c) Sobrevivência com a asserção neutralizada — POR ENUMERAÇÃO EXAUSTIVA, não
por execução.** A prova (c) canônica roda o mutante com a asserção neutralizada
em worktree efêmera (T10) e exige o mesmo Chromium. No lugar dela, os **48**
sítios de `detail.push()` do corpo de `pr1()` (`tests_p50_chromium.js:948-1185`)
foram enumerados e confrontados com o efeito de `M51`:

- itens 1-3 (pré-condições), 5-7 (montagem do relatório), 9 (`dif()` contra a
  baseline), 11 e 12 (tela) — **não podem disparar**: `M51` só desconfina regras
  de CSS que já estavam ativas na tela e que, no papel, tornam a superfície
  legada *mais* oculta, nunca visível; nenhuma asserção do gate exige que ela
  apareça no papel;
- item 8 (nenhum nó legado pintado no papel) — a mutação empurra na **mesma
  direção** da asserção;
- item 13 (oracle de apresentação contínua, `:1163`) — **é o único que dispara**.

Logo, neutralizado o bloco `:1140-1168`, `detail` fica vazio e `P50-PR1`
**passa**: `M51` sobrevive. A camada `c1` da prova (só a asserção que disparou)
coincide com a `c2` (a faixa inteira da propriedade) porque `:1163` é um único
`forEach` sobre as divergências. Registrado como **argumento estático**, não como
execução — a execução fecha no job `visual`.

### 16.4 O que esta triagem NÃO executou (R2 §1 — SKIP silencioso é FAIL)

Ambiente nomeado, medido nesta árvore:

```
node --version   -> v24.19.0
python --version -> Python 3.14.7            (preflight resolve: origem "padrão")
CHROME_PATH      -> vazia
~/AppData/Local/ms-playwright -> não existe

P50_NO_EVIDENCE=1 node tests_p50_chromium.js
  -> 23 x "SKIP  <gate> — NÃO EXECUTADO (browser indisponível: … Executable doesn't exist …)"
  -> "0 PASS · 0 FAIL de 0 · 23 NÃO EXECUTADO (requer Chromium real)"
```

Consequência para o harness, e ela é **correta**: sem a linha `PASS/FAIL
P50-PR1 —`, `D1` classifica `M51` como `NÃO EXECUTADO · gate não pôde ser
executado` — **nunca** `SOBREVIVENTE`. Um número que não foi medido não é
impresso. **Campanha completa não foi executada** (nem p50, nem p51, nem p52) e
`gen_pins.py` não foi executado — ambos por instrução da wave.

---

## 17. `p51/M51-01` — gate sem poder discriminante (achado EA-7)

### 17.1 Por que NÃO é nenhuma das outras duas saídas

| hipótese | descartada por |
|---|---|
| âncora podre / ambígua | `node tests_p51_mutants.js --preflight` → exit 0, `M51-01` com `ocorrencias == 1` em `ui_p50_v32.css`. A mutação **é aplicada** |
| **rot semântica** | as três alternativas de `/se sobrep\|empilhamento\|faixa central/i` são emitidas hoje por `tests_p50_chromium.js:3405`, `:3408` e `:3412`. O `reason` está vivo — só que **nada o dispara**, porque o gate não reprova |
| **propriedade aposentada** | a propriedade "no desktop o mapa e a pergunta ficam lado a lado" **continua valendo e continua implementada** — mudou de camada, não morreu |

Sobra a terceira saída do vocabulário fechado, e é a que **para a demanda**.

### 17.2 A causa, verificada por cascata (janela `4aa1f12..HEAD`)

- `4aa1f12` (Fase 5.1) escreveu **a âncora e o mutante no mesmo commit**
  (`git log -S` sobre `grid-template-areas:"main side";` em `ui_p50_v32.css` e
  sobre o `desc` em `tests_p51_mutants.js` devolve `4aa1f12` para os dois). Ali o
  mutante mordia: a regra da 5.1 era a única que governava a composição.
- `c1e3649` (Fase 5.2) introduziu `ui_p52_workspace_v32.css:70-83` — `git log -S`
  sobre `html body[data-uxscreen="question"] .wrap`, sobre `grid-column: 2; grid-row: 3`
  e sobre `grid-template-rows: auto auto auto auto auto` devolve `c1e3649` para
  os três. `df5d9f6` (integração v3.2.2) **não** introduziu nenhuma delas.
- A cascata, medida com oráculo independente (`@bramus/specificity`, já em
  `node_modules`):

| declaração | seletor | especificidade | quem vence |
|---|---|---|---|
| `grid-template-columns` da 5.1 | `body[data-uxscreen="question"] .wrap` | `(0,2,1)` | — |
| `grid-template-columns` da 5.2 | `html body[data-uxscreen="question"] .wrap` | `(0,2,2)` | **5.2, por especificidade** |
| `grid-area` da 5.1 (`main`/`side`) | `… .wrap > #app` / `> #p50-shell` | `(1,2,1)` | — |
| `grid-column`/`grid-row` da 5.2 | `… .wrap > #app` / `> #p50-shell` | `(1,2,1)` | **5.2, por ordem de fonte** |

O desempate por ordem é decidido em `build_v32_html.py:76`, que inlina
`ui_p52_workspace_v32.css` **depois** de `ui_p50_v32.css`.

- **Efeito**: a mutação de `M51-01` troca declarações que já não decidem nada. O
  grid renderizado em ≥1180px (as duas viewports desktop de `P51_VPS`: 1440 e
  2560) é o da 5.2, com e sem mutação. `P51-VIS1` mede caixas reais —
  sobreposição horizontal, topo da pergunta, aproveitamento da faixa — e as três
  medidas ficam idênticas. **O gate está verde no baseline e continua verde sob a
  mutação: ele afirma algo que a mutação não consegue mais violar.**

### 17.3 O que foi registrado, e o que fica para outro dono

- `mutation-matrix.json` — o par `M51-01` **permanece** (não é aposentadoria),
  com `ultima_prova` de 2026-08-29 `SOBREVIVENTE`, o `KILL` de 2026-08-22
  preservado em `prova_anterior` (R13), e
  `classificacao: "gate sem poder discriminante (achado EA-7)"`; mais a entrada
  correspondente em `dividas_declaradas`.
- `.claude/BACKLOG.md` — achado **EA-7**, nascido `aberto`, com a cadeia
  `arquivo:linha → efeito` fechada.
- **Não** foi escrita asserção nova sobre comportamento de produto, **nem**
  reancoragem oportunista no sítio da 5.2: as duas são decisão de desenho, de
  outro dono (spec §Fora de escopo; §Riscos 3).

### 17.4 Red de IC-5 medido (o registro tem dentes)

`check_mutation.py` exige `classificacao` do vocabulário fechado quando
`ultima_prova.resultado != "KILL"`. Medido em **worktree efêmera** (o stage
recusa árvore suja), com `MUTATION_DEFER_MISSING=1` e **zero campanha executada**:

```
variante RED   (ultima_prova = SOBREVIVENTE, sem `classificacao`):
  [FAIL] IC-5: p51/M51-01 · ultima_prova.resultado = 'SOBREVIVENTE' exige
         `classificacao` do vocabulário fechado; veio None
  ---- integridade: 1 problema(s) nomeado(s) ----

variante GREEN (com `classificacao: "gate sem poder discriminante (achado EA-7)"`):
  [OK]   IC-5: os 20 mutantes da p51 têm um par cada na matriz
  [OK]   IC-5: registro de 20 par(es) p51 resolve no disco
  ---- integridade: 0 problema(s) nomeado(s) ----
  mutation: 0 campanha(s) executada(s) · 0 problema(s)
```

---

## 18. Achado de vizinhança — observado, deliberadamente NÃO corrigido

`tests_p50_chromium.js:1046-1049` define `cmp`, nunca invocado desde a errata
B-02/B-03 (a única ocorrência de `cmp(` no corpo de `pr1()` é um **comentário**,
`:1062`). É a única fonte da frase `"difere do baseline de entrada"` no
repositório inteiro — isto é, uma mensagem que nenhum gate pode emitir. Remover
código morto de uma suíte de gate está fora do escopo desta wave (R5: "corrigir
de passagem" é mudança sem rastro) e a suíte é alcançada pela prosa da §29.4
(tensão `EA-1` Face B). Fica registrado aqui e em `DEPENDÊNCIAS`.

---

## 19. Regressão congelada da E3 — conferida, não presumida

| item | estado |
|---|---|
| bytes de **produto** no diff | **zero** — `git diff --name-only` devolve `.claude/BACKLOG.md`, `.claude/verify/mutation-matrix.json`, `tests_p50_mutants.js` e este arquivo |
| `ui_p50_v32.css`, `ui_p50_results_v32.js`, `ui_p52_workspace_v32.css`, `build_v32_html.py` | **não tocados** — a triagem só os leu |
| `tests_p50_chromium.js` (a suíte dos dois gates) | **não tocada** — nenhum gate foi enfraquecido, nenhuma asserção removida |
| `tests_p51_mutants.js` | **não tocado** — `M51-01` não é consertado aqui |
| âncora de `P50::M51` | **não tocada** — rot semântica conserta a mensagem, não o recorte |
| `IC-4` (unicidade) | **verde** nos três harnesses: `53`/`20`/`107`, exit 0, depois da edição |
| `IC-1`, `IC-2`, `IC-5`, `IC-6` | **verdes** na efêmera com a variante final · `0 problema(s) nomeado(s)` |
| `compliance-audit --rule=backlog` | `[PASS] achados abertos (6)` · `1 PASS · 0 FAIL` |
| registro canônico de suítes (R10 §3) | **nada a acrescentar** — nenhuma suíte nova nasceu; as harnesses de mutação não vivem em `expected_suites.json` e `tests_p50_chromium.js` já está lá, com contagem inalterada |
| pins (R8) | **repin pendente** — os três arquivos tocados são pinados; `gen_pins.py` não foi executado por instrução da wave (ver `DEPENDÊNCIAS`) |


---
---

# T028 — campanha formal `M-IC1`…`M-IC9` e os cenários IC-3, medidos na árvore de 2026-09-04

> Fase 6 · `qa-engineer` · retroativo (o PR #29 foi mesclado sem esta seção — a
> prova de R3 §5 para IC-1…IC-6 vivia **dispersa**: P1–P6 do
> [red-integridade.md](red-integridade.md), contra um *stub* de C1, e os
> "estados de hoje" do próprio red). Aqui a campanha é **formal, sobre a
> implementação real**, e cada mutante morre pela linha do seu gate.
> Executada junto do [spec-validate.md](spec-validate.md); fecha a pendência (3)
> do aceite do `product-owner` (2026-09-01).

## 20. Método

- **Worktree efêmera** (`git worktree add --detach`) no HEAD
  `7bf1c300a8364c0ac854849ad4ecd3e1b602c5ab` (branch `chore/fecho-009-013`),
  árvore limpa; descartada ao fim. A árvore real **não foi tocada** (R7 §3, T10).
- Cada mutante é aplicado por substituição de âncora **única** na cópia (o
  script aborta se a âncora do próprio mutante tiver `≠ 1` ocorrência — a regra
  que a demanda impõe aos harnesses vale para quem os muta), **commitado na
  efêmera** (o stage recusa árvore suja, `check_mutation.py:57-61`) e medido por
  `python .claude/verify/check_mutation.py` **sem** `--all`, com `origin/develop`
  como base do trigger. Depois de cada medição: `git checkout -f --detach <HEAD>`
  + `git clean -fdq`, `porcelain` vazio conferido.
- Ambiente: node v24.19.0 · Python 3.14.7 (`python`, origem `padrão`) ·
  `NODE_PATH` apontando para o `node_modules` do clone (a efêmera não tem o seu)
  · **sem Chromium** — o que só importa para o `[FAIL] p51: campanha EXIGIDA
  (alvo mudou) mas ambiente sem chromium` que aparece ao lado de todo mutante que
  toca `tests_p51_mutants.js` (é o laço nomeando o ambiente ausente, R10 §2; não
  é a morte do mutante e está listado como "outro FAIL" no log).
- **Controle** (árvore sã, mesma efêmera): `---- integridade: 0 problema(s) ----`
  · `---- exceção nominal: 0 ----` · `---- guarda de leitura parcial: 0 ----` ·
  IC-4 verde nos 7 harnesses (19 + 24 + 19 + 15 + 53 + 20 + 107 = **257**
  âncoras com `ocorrencias == 1`) · `mutation: 0 campanha(s) executada(s) · 0
  problema(s)` · exit 0 · 0,9 s. Sem o controle verde, nenhuma das mortes abaixo
  provaria nada (gate constante-vermelho passa por gate correto).

## 21. Os nove — mutação aplicada, gate, linha que mata

| mutante | gate | mutação (âncora única na cópia) | linha que mata (verbatim, truncada) | exit · t |
|---|---|---|---|---|
| **M-IC1** | IC-1 | `tests_p51_mutants.js:100` — `function build() { return run(\`"${PY}" "${BUILD_PY}"\`); }` → `run("python3 build_v32_html.py")` | `[FAIL] IC-1: p51/tests_p51_mutants.js:100 · interpretador por nome fixo em literal de comando — T1 exige MUTATION_PY ou o padrão por plataforma (win32 ? python : python3), com o caminho do script entre aspas` | 1 · 0,9 s |
| **M-IC2** | IC-1 | `M51-02`: `cmd: "node tests_p50_core.js"` → `cmd: "P50_ONLY=P51-UX1 node tests_p50_core.js"` | `[FAIL] IC-1: p51/tests_p51_mutants.js · 1 de 20 cmd de mutante começam com prefixo POSIX de variável (classe ^[A-Za-z_][A-Za-z0-9_]*=; prefixos: P50_ONLY=)` | 1 · 0,9 s |
| **M-IC3** | IC-2 | `check_mutation.py:47` — `return shutil.which(mutation_py_bin()) is not None` → `return True` (o estado pré-013) | `[FAIL] IC-2: M-IC3 · have("python") · com MUTATION_PY=mutation-py-inexistente-013 (binário inexistente) o requisito "python" ainda foi dado por presente — requisito declarado que nunca reprova` | 1 · 0,9 s |
| **M-IC4** | IC-3 | ver §22 — morre pelos **dois cenários**, não pelo stage | — | — |
| **M-IC5** | IC-4 | `find` de `M51-18` trocado pela linha nua `const overall = suff && scored.length ? Math.round(…)` — texto **idêntico** em `ui_v32.js:131` (`legacySnapshot`) e `:1164` (relatório; era `:1026` na spec — o arquivo cresceu) | `[FAIL] IC-4: p51/M51-18 · âncora ambígua — ocorrencias=2 em ui_v32.js (C1 exige exatamente 1 antes de mutar)` | 1 · 0,9 s |
| **M-IC6** | IC-5 | par `p51/M51-07` removido de `mutation-matrix.json` (sem entrada em `dividas_declaradas`) | `[FAIL] IC-5: p51 · 1 mutante(s) do harness sem par na matriz (nem aposentado em dividas_declaradas): M51-07 [oráculo dos ids: preflight (C1)]` | 1 · 0,9 s |
| **M-IC7** | IC-5 | `ultima_prova.registro` de `p51/M51-07` → `specs/013-integridade-da-campanha/nao-existe-qa013.md` | `[FAIL] IC-5: p51/M51-07 · ultima_prova.registro não resolve no disco: 'specs/013-integridade-da-campanha/nao-existe-qa013.md'` | 1 · 0,9 s |
| **M-IC8** | IC-6 | `USER_GUIDE.md` removido de `mutation_map.json → p51.targets` (o estado pré-013, causa direta do rot de `M51-20`) | `[FAIL] IC-6: p51.targets · alvo mutado ausente de targets: USER_GUIDE.md [oráculo: preflight (C1)]` | 1 · 0,9 s |
| **M-IC9** | IC-6 | `ui_session_v32.js` (alvo fantasma) devolvido a `p51.targets` | `[FAIL] IC-6: p51.targets · alvo declarado que o harness não muta: ui_session_v32.js [oráculo: preflight (C1)]` | 1 · 0,9 s |

Em todos: `porcelain` vazio depois do stage (o stage não escreve; a mutação
estava commitada na efêmera e foi descartada pelo reset). Os oito mortos pelo
stage morrem **cada um pelo seu gate** — nenhuma morte incidental por outro
`IC-n` (o único FAIL adicional é o do ambiente, acima). `M-IC1`, `M-IC2` e
`M-IC3` deixam de ser "estado de hoje" e passam a ser mutantes **aplicados sobre
o green** e mortos: a prova que o red não podia dar.

## 22. `M-IC4` e os dois cenários de IC-3 — medidos sobre as harnesses de hoje

IC-3 não é asserção do stage: é execução das harnesses em cópia (spec, IC-3).
Primeiro os cenários **sem** mutante, sobre a implementação real — o que o
red-integridade.md §"Cenário IC-3(a)" mediu **antes** da correção e ninguém havia
re-medido depois:

**(a) interpretador ausente** — `MUTATION_PY=py-inexistente-qa013 node <harness>`,
sem filtro (o aborto precede a mutação, então nada é construído):

| harness | `NÃO EXECUTADO` | com `causa: interpretador ausente` | razão `D/T` impressa | fecho | exit | porcelain |
|---|---|---|---|---|---|---|
| `tests_p50_mutants.js` | **53/53** | 53 | **0** | `CAMPANHA NÃO CONCLUÍDA [tests_p50_mutants.js · namespace P50]: 0 detectados · 0 sobreviventes · 53 não executados (de 53)` | 1 | vazio |
| `tests_p51_mutants.js` | **20/20** | 20 | **0** | `CAMPANHA NÃO CONCLUÍDA · 0 detectados · 0 sobreviventes · 20 não executados (de 20)` | 1 | vazio |
| `tests_p52_mutants.js` | **107/107** | 107 | **0** | `CAMPANHA NÃO CONCLUÍDA [tests_p52_mutants.js]: 0 detectados · 0 sobreviventes · 107 não executados (de 107)` | 1 | vazio |

Compare com o red: a `p51` imprimia `NÃO DETECTADO` + razão `0/1`; `p50` e
`p52` morriam em *stack trace* cru. As três agora dizem a mesma coisa, com a
mesma causa, em 0,1 s.

**(b) âncora corrompida** — `find` de `M51-03` trocado por texto inexistente,
commitado na cópia:

- `node tests_p51_mutants.js --preflight` → exit 1, stdout = um objeto JSON,
  `M51-03 = {ocorrencias: 0, estado: "nao_executavel", causa: "âncora não
  encontrada"}`, os outros 19 `ok`;
- `MUT_ONLY=M51-03 node tests_p51_mutants.js` →
  `NÃO EXECUTADO  M51-03 · exemplo de MSSP vaza para um qid incorreto` /
  `gate esperado: P51-UX2 · causa: âncora não encontrada · ocorrencias=0 em
  ui_p50_shell_v32.js` / `CAMPANHA NÃO CONCLUÍDA · 0 detectados · 0 sobreviventes
  · 1 não executados (de 1)`, exit 1, **nada mutado** (porcelain vazio — a
  mutação "na primeira ocorrência" nunca é aplicada);
- stage sobre a cópia: `[FAIL] IC-4: p51/M51-03 · âncora não encontrada —
  ocorrencias=0 em ui_p50_shell_v32.js (C1 exige exatamente 1 antes de mutar)`
  — mutante, arquivo e contagem nomeados.

**`M-IC4`** — a spec o define contra o código pré-013 ("o `run()` que engole a
exceção e rotula `NÃO DETECTADO`"); sobre o código de hoje a forma fiel é
**reintroduzir o laço de dois estados**: cinco sítios em `tests_p51_mutants.js`,
todos com âncora única — `const binario = resolvePy(PY) || PY;` (não aborta sem
interpretador), `if (n !== 1)` → `if (false)` (não conta âncora),
`if (rb.code !== 0)` → `if (false)` (engole rebuild falho),
`if (r.spawnFalhou)` → `if (false)` e `} else if (!linha)` → `} else if (false)`
(engole spawn falho e linha ausente). Resultado: tudo que não reprova pelo motivo
vira `SOBREVIVENTE`, exatamente o colapso que EA-5 descreve.

| cenário sob `M-IC4` | saída observada | veredito |
|---|---|---|
| (a) `MUTATION_PY=py-inexistente-qa013 MUT_ONLY=M51-02` | `SOBREVIVENTE  M51-02 · reintroduz um segundo botão de evidência focável` + `MUTATION TESTING (Phase 5.1): 0/1 mutantes detectados pelo gate e motivo esperados` — o gate rodou contra o HTML **não reconstruído** (o rebuild falhou em silêncio) e o harness publicou veredito **e** razão sobre um mutante que nunca foi medido | **MORTO** — o cenário exige `NÃO EXECUTADO · interpretador ausente` e zero razão `D/T` |
| (b) âncora de `M51-03` corrompida, `MUT_ONLY=M51-03` (interpretador presente) | `SOBREVIVENTE  M51-03 …` + `0/1 mutantes detectados` — o `replace` sem casamento é *no-op*, o rebuild devolve o HTML idêntico, o gate passa e o harness chama isso de sobrevivência; `'âncora não encontrada'` aparece **0** vezes | **MORTO** — o cenário exige `NÃO EXECUTADO · âncora não encontrada` |

Porcelain vazio nos dois (o `finally` restaurou o fonte e o SHA conferiu — a
regressão da borda 12 **não** foi enfraquecida pelo mutante, que só tocou a
classificação).

## 23. O que esta campanha NÃO cobre (declarado)

- `M-IC10`…`M-IC31` são dos addenda IC-9/IC-10 e estão medidos nos seus reds
  (`red-excecao-nominal.md`, `red-guarda-leitura-parcial.md`); os três de
  **fiação** (`M-IC19`, `M-IC29`, `M-IC31`) seguem com morte declarada fora das
  sondas em processo — o laço executou de verdade no job `visual` do PR #29
  (`[EXCEÇÃO] KI-4 …` impresso, `p51` 19/20 fechando `0 problema(s)`), o que
  prova a **fiação viva**, não a **morte do mutante** (matar exige rodar o
  mutante, e isso o CI não faz).
- Prova **(c)** de T9 para `M51-16` e `V322-M3` (Chromium) — G3 do
  spec-validate; rota não-canônica agora conhecida (Chrome estável via
  `CHROME_PATH`), dono `qa-engineer`.
- Campanhas `p50`/`p51`/`p52` completas — canônicas no job `visual` (run
  33295007844: 53/53 · 19/20 com KI-4 · 107/107).

Nada desta seção altera contagem canônica, pin ou asserção. O único arquivo
tocado é este.
