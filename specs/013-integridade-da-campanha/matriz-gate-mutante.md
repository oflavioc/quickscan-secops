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
