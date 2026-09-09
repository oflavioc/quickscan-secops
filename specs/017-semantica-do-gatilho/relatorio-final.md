# Relatório final — 017-semantica-do-gatilho

> Fase 6 · T042 · dono: `doc-writer` · 2026-09-09.
> Branch `feature/017-semantica-do-gatilho` · HEAD local `8960dad` · remoto ainda
> em `5818b1c` (17 commits atrás, todos doc/chore — §CI, abaixo) · PR
> [#48](https://github.com/oflavioc/quickscan-secops/pull/48) · worktree
> `phase5-014`.
> **Aceite de intenção do `product-owner`: "não encontrei objeção"** (2026-09-09,
> `.claude/project-memory/planning-state/017-semantica-do-gatilho.json →
> validate.aceite_po`), com **sete resíduos** e **três condições** (§O aceite do
> PO, abaixo) — nenhuma delas bloqueante, todas registradas com a cadeia que as
> sustenta. **Este relatório não emite veredito de PASS/FAIL.** Todo número vem
> de execução citável (repetida nesta escrita — o método é "medir de novo depois
> de escrever", não confiar em número herdado) ou de registro canônico; o que
> depende do CI ou do ato do proprietário está declarado como tal.

## Objetivo cumprido

`targets`, em `mutation_map.json`, e `arquivos_mutados`, no contrato C1 da 013,
significavam duas coisas incompatíveis sob a mesma palavra até a asserção
`IC-6` (`check_mutation.py:395-412`, retirada por esta demanda) afirmar
identidade entre elas — e nascer vermelha em **7 dos 11** harnesses com
preflight, todos por excedentes legítimos e declarados só em prosa de
`_trilha`. A 017 substituiu a identidade por **inclusão com razão de classe
legível por máquina**: seis gates novos no stage `mutation`
(`D017-REL1`/`REL2`/`INS1`/`FORM1`/`CORE1`/`SONDA1`), a chave irmã `insumos`
(vocabulário fechado de quatro classes — `oraculo`, `fixture`, `populacao`,
`declaracao`), a forma canônica de path (D1, POSIX, relativa à raiz), e uma
sonda em processo com contagem pinada (`_meta.sonda_relacao.total = 15`) como
metade permanente da prova de que o julgador não mente. Os **58 excedentes**
semânticos de hoje couberam **58/58** nas quatro classes, sem quinta classe e
sem resíduo — a primeira cobrança do refinamento respondida antes do gate
nascer. `M-IC8`/`M-IC9`, os dois mutantes que fizeram o `IC-6` nascer na 013,
continuam mortos, re-executados contra o gate novo como `D017-M1`/`M2`. A
janela vermelha (7 → 2 → 1 → 0 harnesses) fechou como o plano previu, sem
afrouxar nenhuma asserção (R10 §1). A demanda deixa pronto, mas não fecha, o
`EA-3` (D3) e abre dois credores nomeados: `EA-44` (o `core`, sem preflight,
nunca `[OK]`, nunca silêncio) e `EA-42` (bateria efêmera de instrumento — a
família de mutantes de árvore/instrumento de `check_mutation.py` não é
re-executada por campanha nenhuma, porque `check_mutation.py` não é `target`
de harness algum).

## As quatro correções ao orquestrador — todas certas, nenhuma acomodada

Quatro agentes diferentes corrigiram uma alegação do orquestrador nesta
demanda, e nas quatro vezes a correção — não a alegação — prevaleceu.

1. **`tech-lead`, no portão da Fase 1** — a medição de "faltante falso"
   normalizava os dois lados da comparação. O orquestrador havia repassado
   "`ea41`: 3 excedentes + 1 faltante" como número de segunda mão. O
   `tech-lead` executou a expressão literal de `IC-6` sobre os onze harnesses
   e mediu: a `ea41` **não** produz faltante falso — ela já emite path
   repo-relativo e o gatilho também (`spec.md:65-72`); os 12 faltantes falsos
   estão inteiros em `d014` (2) e `d016` (10), os dois harnesses que emitem
   `path.basename()` para arquivos sob `.claude/`. A tese sobrevive ("a
   comparação literal mente por forma de path"); o exemplo, não.
2. **`build-engineer`, depois de T020** — a frase-resumo da delegação do
   orquestrador dizia "`D017-REL2` verde nos onze" e estava errada:
   `FORM1(b)` é diagnóstico **anexado** a `REL1` e `REL2`, então, enquanto a
   forma do path diverge, o mesmo arquivo é faltante e fantasma ao mesmo
   tempo (`d014`/`d016`, no estado da árvore antes de D1 migrar). O
   `build-engineer` seguiu o `tasks.md` — a fonte aprovada — em vez do resumo,
   e o próprio planning-state (`implement.notes`) registra o erro como do
   orquestrador, não do `build-engineer`.
3. **`qa-engineer`, na matriz de dívidas (`1aaccbe`)** — carrasco e vítima
   invertidos. A entrada `D017-M10…M16, M18` (`.claude/verify/mutation-matrix.json
   → dividas_declaradas`) registra, verbatim: *"o que roda a cada run do
   stage é o CARRASCO (a sonda — 15 cenários sintéticos contra `mut_relacao`,
   contagem pinada em `mutation_map.json → _meta.sonda_relacao.total`), não os
   mutantes; nenhum harness muta `check_mutation.py` (não é `target` de
   harness algum) …, logo M10…M18 morreram UMA vez, em cópia, e a prova de que
   morrem vive aqui e no red"*. Nenhum harness **vigia** o julgador — ele não
   está no `targets` de ninguém —, então a metade permanente da prova é a
   sonda, e os 21 mutantes (`M1`…`M21`) são vítimas one-shot, com credor
   `EA-42` nomeado, não carrascos de campanha.
4. **`doc-writer` (eu), nesta mesma escrita** — o número **726** que me foi
   passado como "linhas no `spec-validate.md` antes da iteração 3" **não é
   isso**: medido agora (`git show 82c0984~1:specs/017-…/spec-validate.md |
   wc -l` = **739**; `git show 82c0984:… | wc -l` = **1007**; diferença
   **268**, zero remoções — bate com o que a própria iteração 3 registra),
   726 é a contagem de linhas de **`specs/013-integridade-da-campanha/spec.md`**
   no HEAD final (medido: `git show HEAD:specs/013-…/spec.md | wc -l` = 726),
   citada em `spec-validate.md:780-781` e `:1000` junto com **104** (a
   contagem líquida de linhas novas) e `R0…R15` — os três números da mesma
   frase, sobre dois arquivos diferentes. §Números da spec da 013, abaixo, traz
   os dois corretamente separados e com a fonte de cada um.

## Três provas mecânicas com limite declarado — e o limite não evita o erro, mas o torna achável

1. **`aditiva_013.py`** (extraído de `tasks.md:299-356`, sem versão própria na
   árvore) mede **estrutura**, não sentido: conta linhas inseridas e linhas
   removidas por marcador de errata, nunca se o texto inserido é verdadeiro.
   Na iteração 1 do `spec-validate`, ele passou dizendo `0 removida(s)`
   enquanto a Errata `C1` da 013 (`:205-226`) dizia, literalmente, o **oposto**
   da decisão D1 da 017 ("não há nova obrigação de quem escreve o preflight" —
   a 017 é exatamente essa obrigação nova) — e a ferramenta **estava certa**:
   o texto contraditório entrou como inserção aditiva legítima, sem apagar
   nada. O `tasks.md` já declarava esse limite quando a prova nasceu
   (`spec-validate.md:47`, "prova estrutura, nao sentido"); o defeito (**G1**
   da iteração 1) só foi achado porque o `qa-engineer` leu a frase, não porque
   o script a comparou com o fato.
2. **`so_docstring.py`** (extraído para `PP-12`, `plan.md:215`) compara a
   árvore sintática do arquivo sem docstrings entre dois commits e diz
   "IDÊNTICA" se nenhuma linha executável mudou. Limite medido e escrito no
   próprio plano: o comando **passa se a docstring for apagada** — testado em
   cópia (`IDÊNTICA (20 → 19 docstrings)`, exit 0); quem reprovaria a remoção
   é o `+…,0` do hunk do `git diff` (comando 2) e um `TypeError` de
   `ast.get_docstring` sobre função sem docstring (comando 3), não o próprio
   `so_docstring.py`. Os três comandos juntos, não um isolado, é o que sustenta
   a prova de `PP-12`.
3. **A sonda `D017-SONDA1`** é a metade permanente da prova de que
   `mut_relacao` não mente, mas o limite dela está escrito na §Guarda de
   tautologia da spec (`:158-172`): ela **não vê** mutantes de fiação (`M17`,
   `M19` — o laço que consome o retorno, não a função pura) nem os dois
   acréscimos da Errata `INS1(f)` (`M20`, `M21` — `insumos` não-objeto, path
   vazio/não-string), porque um cenário novo moveria o pin
   `_meta.sonda_relacao.total` e seria segunda edição do julgador. É esse
   limite declarado que obrigou a demanda a nomear `D017-M19` com id **antes**
   do red (Errata `D017-M19`, abaixo) em vez de deixá-lo como observação sem
   registro — a mesma classe de defeito que `EA-28`/`EA-30`/`EA-42` já
   descrevem (prova que só viveu num relatório evapora).

## Três erratas nascidas do próprio trabalho, mais a `D3(i)` da Fase 6

A demanda que instrumenta "registro contra execução" (o tema geral que a
precede, `EA-31`) encontrou, em si mesma, três pontos em que a spec prometia
mais do que o instrumento entregava — e resolveu cada um por errata com id,
nunca por prosa solta em `_trilha`.

### Errata `D017-M19` — o ramo `[NOTA]` ganha carrasco

O `tasks.md` original (§Vácuos 2) declarava vácuo o ramo *"preflight
fracassou ⇒ `[NOTA] D017: <h> · não medida"*: nenhum dos 18 mutantes previstos
o exercitava, a sonda não pode vê-lo (`mut_relacao` recebe `None` tanto para
o `core` quanto para um preflight fracassado — a distinção é do laço, não da
função pura), e a proposta era registrar como **observação sem id** em
`red-017.md`. **Recusada** pelo orquestrador no portão da Fase 3: `EA-28`,
`EA-30` e `EA-42` são três achados cujo conteúdo inteiro é "prova que viveu só
num relatório evaporou", e observação sem id tem exatamente essa forma — um
id custa uma linha agora; depois do red custaria uma errata inteira. A rota
alternativa era, na prática, **remover a cobrança formal** (deixar o ramo sem
carrasco, fechando a conta de mutantes em 18 em vez de 19) — e essa rota foi
testada por **contrafactual executado**, não só argumentada: em clone
efêmero, a variante "`--preflight` saindo 1" (que o `tasks.md` original
descrevia como o estado que alimentaria o mutante) **não alcança o ramo** —
exit 1 com JSON válido em stdout mantém `IC_PREFLIGHT[h]` como `dict`
(`check_mutation.py:326`); só stdout **vazio** devolve `None`
(`:310-312`→`:341`). O estado real (variante A, `tests_p50_mutants.js:896`
→ `process.exit(1)` sem nada em stdout) foi medido, e `D017-M19` — mutante de
fiação, morto sob esse estado em cópia — entrou na matriz ao lado de `M17`
(`.claude/verify/mutation-matrix.json → dividas_declaradas`, credor `EA-42`).

### Errata `_meta.sonda_relacao` — o pin da sonda nasce no red, pelo `qa-engineer`

A spec original (`§Contratos C2`) dava o `_meta.sonda_relacao` ao
`build-engineer`, junto com `insumos`, na W2 — mas C6 exige `[OK]
D017-SONDA1: … 15 cenários …` já no **commit red**, e o estado A do `tasks.md`
também. Com o dono na W2, o red nasceria vermelho por **pin ausente**, um FAIL
de instrumento que não é o red da demanda. A errata corrigiu a favor das
próprias cláusulas que a spec já fixava (C6, D5, o estado A): `total` e
`descricao` nascem no commit red, pelo `qa-engineer` — o precedente correto é
a 016 (`fecho.json → sonda.total`, `qa-engineer`, W1), não a 013 (que é sobre
entradas de harness, que continuam do `build-engineer`). Diferente das outras
duas, esta não teve alternativa de "remover" testada por contrafactual: é uma
correção de **quem escreve e quando**, não de cobertura.

### Errata `INS1(f)` — a sexta causa fechada

`insumos` presente e **não-objeto** (lista, string, número, booleano) não
tinha causa fechada nas cinco de C3 (a–e). A rota alternativa — coagir em
silêncio a `{}`, como identidade — foi testada por **contrafactual
executado**: em cópia, `insumos: []` num harness em identidade (que hoje
imprime `[OK]` sem sufixo) continuaria imprimindo `[OK]` — **silêncio** sobre
um dado malformado, a forma exata que R10 §2 proíbe (SKIP silencioso é FAIL).
A sexta causa fechada — `insumos malformado — não é objeto classe →
[paths]: <tipo>` (`check_mutation.py:568-569`) — e o mutante `D017-M20`
(`insumos: []` na `d010`) entraram para fechar essa rota; o mesmo tratamento
se estendeu a `FORM1(a)` para elemento não-string ou string vazia (`M21`).

### `D3(i)` (Fase 6) — o que o julgador devolve, e o que fica derivável

Depois da iteração 1 do `spec-validate` (gap **G4**), ficou medido que D3
prometia mais do que o contrato C5 contratava: a spec e a nota do `EA-3` no
`BACKLOG.md` diziam que `mut_relacao` **devolve, como dado**, a classificação
de cada path em `mutado`/`harness`/`insumo(<classe>)` — falso contra o
código: `"mutado" in retorno = False`, `"harness" in retorno = False`, medido
sobre a `d010` real e confirmado nos onze harnesses com preflight. A rota
"segunda edição executável de `mut_relacao`" (devolver as duas posições que
faltam) foi **recusada por ausência de consumidor** — medida, não suposta: o
único leitor do retorno é o laço do próprio gate, que já deriva `mutado ∪
harness` dos argumentos (`arquivos_mutados`, `fontes`) em
`check_mutation.py:805`, sem tocar o retorno para isso. A errata desce a
promessa até o que C5 honra: `targets = (arquivos_mutados ∪ fontes) ⊔
⋃insumos_ok`, com `estado == "ok"` como **pré-condição** da derivação (medida
11/11), não a identidade — provado por controle negativo executado em
memória: **N1** (`fixtures_010_vao.js` retirado de `targets` — insumo
declarado **sem** gatilho, causa `razão sem gatilho` de `INS1` ⇒ `estado =
fail`, mas a identidade `targets = (arquivos_mutados ∪ fontes) ⊔
⋃insumos_ok` *continua valendo* mesmo assim, porque o insumo inválido sai de
`insumos_ok`) e **N2** (`zz_extra_017.js` acrescentado a `targets` — excedente
sem razão ⇒ `estado = fail`, e aí sim a identidade *não vale*: ela não é
tautologia). A nota do `EA-3` no
`BACKLOG.md` (`:539-547`) recebeu **segunda edição, ao lado da primeira, sem
apagar nada** (`c8b91cd`, `doc-writer`) — a decisão foi tomada **sob a
delegação do proprietário de 2026-08-29, não aprovada por ele pessoalmente**:
o `tasks.md` prescreve, para gap de classe `spec-errada`, "errata na spec,
TL/PO, com aprovação do usuário", e a spec da 017 registra essa distinção
explicitamente em vez de escondê-la (`spec.md:799-805`).

## Três decisões do plano que a execução desmentiu

O commit `d643d8d` ("plano - PP-12 e as tres decisoes que a execucao
desmentiu") registra as três, e a terceira é minha:

1. **"`[P]` na W3: o `build-engineer` roda os três repins em paralelo, depois
   dos três conteúdos estarem na árvore"** era mecanicamente impossível:
   `gen_pins.py` pina o `HEAD` inteiro, então o primeiro repin cobriria os
   três arquivos e os outros dois sairiam sem mudança nenhuma para registrar.
   Corrigido para **serial** ainda na Fase 3, antes de alguém tropeçar nisso.
2. **P1, "exatamente um commit toca o julgador"** — veio uma segunda edição
   (`126dc61`, `PP-12`, comentário-only na docstring de `ex_ids_do_harness`),
   por um terceiro autor (`doc-writer`, não implementador), autorizada pelo
   escalonamento 4 do `tasks.md`. O que P1 protegia ficou de pé: nenhum
   `green` tocou o arquivo, nenhuma linha **executável** mudou fora do commit
   do red — e a prova disso é `so_docstring.py`, não a promessa de "um
   commit".
3. **P5, "o PR abre ao fim da W2"** — **não abriu**, e a falha é do
   orquestrador. O PR #48 só nasceu em `5818b1c`, **doze commits** depois de
   `4f2dc6c` (medido agora: `git rev-list --count 4f2dc6c..5818b1c` = 12,
   confirmado em `spec-validate.md:393-394`), todos sem run de CI algum
   até o `34066877538`. Consequência medida: as campanhas `d014`/`d016` "no
   job `verify` do PR" ficaram sem prova de CI durante toda a janela — a
   demanda inteira correu sobre prova local e cópias efêmeras, sem o que só o
   CI garante (ambiente Linux limpo, checkout do zero). Corrigido na
   sequência: PR aberto antes do `spec-validate`, para a validação ter a
   evidência do CI em vez de dispensá-la — mas o próprio CI hoje só cobre até
   `5818b1c` (§CI, abaixo), então mesmo essa correção ficou incompleta.

## Duas candidatas de forma, não corrigidas por decisão

Reprovam e nomeiam a causa (R10 §2 satisfeita); tocar o julgador para
consertá-las seria uma quarta edição executável do julgador nesta demanda —
recusada, pela mesma razão que fechou `D3(i)`: sem consumidor que dependa da
forma exata da mensagem.

1. **`FORM1(a)` com elemento vazio imprime causa sem sujeito.**
   `check_mutation.py:554` (`txt = p if isinstance(p, str) else repr(p)`)
   deixa `""` sair cru quando o elemento é uma string vazia — a linha termina
   em `path fora da forma canônica: ` (nada depois dos dois-pontos). Medido em
   `D017-M21` (T022, `7` e `""` acrescentados a `d010.targets` em cópia):
   `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: ` — a
   alínea reprova e nomeia o **conjunto** (`d010/targets`), só não nomeia o
   elemento vazio em si.
2. **Classe com valor string (em vez de lista) imprime causa que contradiz o
   próprio conteúdo.** `check_mutation.py:586-589,594-595`: quando
   `membros` não é uma lista (por exemplo `insumos: {"oraculo":
   "tests_010_vao.js"}`, uma string crua no lugar do array), `lista` vira
   `[]`, `nomes` vira `[repr(membros)]` e, como `lista` está vazia, a causa
   disparada é `classe sem membros: oraculo ('tests_010_vao.js')` — o rótulo
   diz "sem membros" enquanto o parêntese mostra um conteúdo não vazio. A
   causa certa (é uma forma inválida do valor, não uma lista vazia) não
   existe; a mensagem aponta na direção errada sem deixar de reprovar.

## Série de repins — executados × previstos

O plano previu **dez** repins (`R0..R9`, `plan.md`). A execução real fechou em
**dezenove** execuções de `gen_pins.py`: os dezesseis rótulos principais
**`R0`…`R15`**, mais três classes que o plano não previu — **`R2a`**
(errata pós-red), **`R8a`** (docstring de `PP-12`) e **`R8b`** (repin da
própria emenda do plano, `d643d8d`) — medido agora
(`git log --oneline 9d617d0..HEAD | grep -i gen_pins`, 19 linhas):

| Repin | Commit | Cobre |
|---|---|---|
| R0 | `f790a20` | fecha a dívida de pin dos dois portões (Fase 0/1) |
| R1 | `d9a43d9` | W0 |
| R2 | `985c386` | commit red (`adb883f`) |
| **R2a** | `2c79eb2` | errata 3 — sexta causa do `INS1`, pós-red |
| R3 | `953df79` | migração dos `insumos` |
| R4 | `7cc3d86` | forma canônica no `d014` |
| R5 | `14d2046` | forma canônica no `d016` |
| R6 | `0d3cce5` | matriz — dívidas declaradas |
| R7 | `a45d697` | erratas na spec da 013 |
| R8 | `8f61eb8` | registros no `BACKLOG.md` |
| **R8a** | `bc12e28` | docstring de `ex_ids_do_harness` (`PP-12`) |
| **R8b** | `5818b1c` | emenda do plano (`d643d8d`) |
| R9 | `265c56e` | `spec-validate.md` (iteração 1) |
| R10 | `0861f90` | correção dos gaps G1–G3 (erratas da 013) |
| R11 | `07b8228` | Errata `D3(i)` |
| R12 | `34ae297` | `spec-validate.md` (iteração 2) |
| R13 | `9b96bbc` | G6 — segunda edição da nota de `EA-3` |
| R14 | `f1e9164` | G5 — conteúdo mínimo da Errata `C1` |
| R15 | `19dfd6a` | `spec-validate.md` (iteração 3) |

`check_baseline.py`, medido agora nesta escrita: **465/465 pins conferem · 0
divergentes · 0 ausentes · 0 sem pin** — cada um dos dezenove repins fechou a
dívida do commit anterior sem deixar arquivo pinado esquecido.

## Números da spec da 013 — dois arquivos, dois números, não confundir

- **104** é a contagem **líquida** de linhas novas em
  `specs/013-integridade-da-campanha/spec.md` desde o início da demanda:
  medido agora (`git show 9d617d0:… | wc -l` = 622; `git show HEAD:… | wc -l`
  = 726; 726 − 622 = **104**) e confirmado pelo próprio `aditiva_013.py`
  (`spec-validate.md:810-811`: "104 linha(s) nova(s) · 0 removida(s)"). A
  trilha do número, medida commit a commit (`git show <sha>:… | wc -l`):
  **74** em `5818b1c` (696 linhas — medição anterior à edição de correção),
  **90** em `0fe7e75` (712 linhas — medição numa iteração intermediária, após
  a errata de `C1`/`IC-6` mas antes de G5), **104** em `75149b9` (726 linhas —
  depois de G5 completar o conteúdo mínimo da Errata `C1`). A mensagem de
  commit de `0fe7e75` cita "74" e é **imutável** (R2 §5) — o número atual é
  104, e é esse que vale.
- **726** é a contagem **total** de linhas de
  `specs/013-integridade-da-campanha/spec.md` no HEAD final (não é uma
  contagem do `spec-validate.md` da 017, nem uma medição "antes da iteração
  3" — ver §4 de §As quatro correções, acima, onde corrijo essa atribuição
  que me foi passada). `spec-validate.md:821` registra o mesmo número por
  outra via: `wc -l: 712 → 726` (o salto de 14 linhas da correção G5,
  `75149b9`), o que bate exatamente com 90 → 104 na contagem líquida.

## `spec-validate.md` — três iterações, medidas de novo

O próprio `spec-validate.md` **cresceu** ao longo das três iterações — isso
sim é uma contagem sobre ele mesmo, e é diferente da confusão do parágrafo
acima:

| Iteração | Commit | Linhas do arquivo | Score |
|---|---|---|---|
| 1 | `cb709d2` | 441 | 69/73 (94,5 %) |
| 2 | `e547fcd` | 739 (+298) | 71/73 (97,3 %) |
| 3 | `82c0984` | 1007 (+268, 0 remoções) | **73/73** (100 %) com **dois ✓°** |

Medido agora: `git show cb709d2:… \| wc -l` = 441; `git show e547fcd:… \| wc -l`
= 739; `git show 82c0984:… \| wc -l` = 1007. Nenhuma linha das iterações 1 e 2
foi apagada na 3 (a própria iteração 3 registra "739 linhas antigas presentes
e na ordem, 268 inserções, ZERO remoções").

Os **dois ✓°** são o item **6** (`D3(i)`, desde a iteração 2 — não tocado
nesta rodada) e o item **51** (Errata `C1` da 013, nesta iteração). O item 51
tem **duas leituras possíveis, e os dois números estão registrados**: sob o
critério aplicado desde a iteração 1 ("presença na Errata `C1` da 013,
inline **ou** na seção única"), os cinco elementos do conteúdo mínimo estão
todos lá e são verdadeiros — **73/73**. Sob leitura literal alternativa
("`:377` exige nota **inline**", e três dos cinco elementos vivem só na seção
`:694-702`, não na nota curta de `:226`) — o item 51 seria ✗ por posição, e o
fecho seria **72/73**. O `qa-engineer` registrou os dois números e devolveu a
escolha ao orquestrador; a decisão foi aceitar o qualificado (73/73) **sob a
delegação do proprietário de 2026-08-29**, não por aprovação pessoal dele —
espelhar os três elementos também na nota inline duplicaria conteúdo no mesmo
documento, e é exatamente esse padrão de duplicação que o próprio CLAUDE.md
cita como origem do seu próprio drift histórico.

## CI — o que está coberto, e o que não está

**Um único run** cobre esta demanda:
[`34066877538`](https://github.com/oflavioc/quickscan-secops/actions/runs/34066877538),
sobre o head `5818b1c` (2026-09-06). Por job:

| Job | Conclusão | O que o log diz |
|---|---|---|
| `verify` | success | `verify: 17 PASS · 0 FAIL` · `compliance: 17 PASS · 0 FAIL · 0 WARN` · `[PASS] mutation`, sem `[DEFER]` |
| `visual` | success | as três suítes visuais (P50/P51/P52/D011) verdes; o bloco 017 completo (linhas 790-804); **`mutation: 2 campanha(s) executada(s) · 0 problema(s)`** — é **aqui**, no job `visual`, que essa linha vive, invocando `check_mutation.py` direto (`verify.yml:87`); no job `verify`, `run.sh` roda o mesmo `check_mutation.py` como stage, mas `reporta()` (`.claude/verify/run.sh:62-69`) só ecoa `[PASS] mutation`/`[FAIL] mutation` — o stdout do stage (onde a linha `mutation: N campanha(s)` vive) só é impresso em `FAIL`, e mesmo aí cortado por `head -30` (`EA-15`); em `PASS`, como neste run, a linha não aparece no job `verify` de jeito nenhum |
| `fecho` | failure | `[FAIL] FECHO PENDENTE da demanda 017-semantica-do-gatilho (fase implement) — merge bloqueado até done`, exit 1 — **por desenho** (`D016-PR1`, C8 da 016): acusa o processo (fase ainda não é `done`), não o produto |

**O que este relatório NÃO afirma**: nada sobre o HEAD atual (`8960dad`) rodou
no CI. Entre `5818b1c` (o head do único run) e `8960dad` (HEAD local) há
**17 commits**, e medi agora, nesta escrita, que nenhum deles toca os quatro
arquivos executáveis da demanda: `git diff --stat 5818b1c HEAD --
.claude/verify/check_mutation.py .claude/verify/mutation_map.json
tests_014_mutants.js tests_016_mutants.js` sai **vazio**. Os 17 commits são
as iterações 2 e 3 do `spec-validate.md`, a Errata `D3(i)`, G5/G6 na spec e no
`BACKLOG.md` da 013, e sete repins (`R9`…`R15`) — todos doc/chore, lidos pelos
stages que o `--light` cobre. **A camada executável está coberta** (bytes
idênticos ao head que o CI verificou, medido); **a camada de registro não
está** — nenhum run verificou, num ambiente limpo, os arquivos que compõem
G5/G6/D3(i)/as três iterações do `spec-validate`. Antes do merge, falta: push
do HEAD atual e leitura de um run novo sobre ele (condição (a) do aceite do
PO, abaixo).

**Medido localmente, agora, nesta escrita** (HEAD `8960dad`, worktree
`phase5-014`): `python .claude/verify/check_baseline.py` ⇒ `465/465 pins
conferem · 0 divergentes · 0 ausentes · 0 sem pin`; `MUTATION_DEFER_MISSING=1
bash .claude/verify/run.sh --light` ⇒ **13 PASS · 0 FAIL** (4 `[SKIP]`,
nomeados pela flag: `mutation`, `suites`, `suites-heavy`, `evidence-bridge`);
`bash .claude/verify/compliance-audit.sh` ⇒ **17 PASS · 0 FAIL · 0 WARN**;
`python .claude/verify/check_tdd.py` ⇒ `tdd: 12 demanda(s) · 0 waiver(s) · 0
problema(s)`, com as três entradas `D017-*` de `dividas_declaradas` impressas
por inteiro (fiação `M17`/`M19`; árvore `M1`…`M9`/`M20`/`M21`; instrumento
`M10`…`M16`/`M18`).

## O aceite do `product-owner` — sete resíduos, três condições

O aceite (`validate.aceite_po`, 2026-09-09) conferiu **no fonte**, não herdou
do validador: leu `check_mutation.py:558-622` diretamente e confirmou que
nenhum elemento do gatilho sai do cômputo sem razão de classe válida ou FAIL
nomeando o path, que a lista de exceção é fechada por construção
(`:287-289`), e concluiu **"não encontrei objeção"**. As duas cobranças que o
próprio PO havia escrito na Fase 0 — `mut_relacao` não recebe `_trilha`
(prosa não torna gate verde) e classe fora do vocabulário reprova — estão
cumpridas **estruturalmente**, não por leitura de comentário.

**Sete resíduos, nenhum bloqueante** (texto integral em
`validate.residuos_po`): (1) o `CONTEXT.md` enumera
oráculo/fixture/declaração/julgador/registro-lido; o vocabulário construído é
oráculo/fixture/população/declaração — "julgador" foi absorvido em oráculo,
"registro lido" em declaração, e "população" é nova; **não corrigir nesta
demanda** (o `CONTEXT.md` está em §Não mudam da spec, e corrigir agora
invalidaria um item já medido do `spec-validate`); (2) a classe é
verificável por forma, nunca por veracidade — rotular oráculo como fixture
passa; a defesa é revisão humana no PR; (3) a segunda candidata de forma no
`INS1` (§Duas candidatas de forma, acima); (4) o template antigo ("desvio
declarado que ENDURECE o trigger") sobrevive em `_trilha`s históricas, por
desenho (R2 §5); (5) a `p51` ainda não vigia o próprio oráculo — provado
possível na sonda (cenário xv), não exigido (decisão P1.9 do próprio PO); (6)
a fiação (`M17`/`M19`) tem prova one-shot, credor `EA-42`, regime declarado da
casa; (7) registro atrás da execução, de novo — o próprio padrão que esta
demanda instrumenta.

**Três condições, não objeções** (`validate.condicoes_po`): (a) push do HEAD
atual e leitura de um run de CI sobre ele antes do merge — hoje o CI cobre
`5818b1c`; o que falta é a **camada de registro** (§CI, acima); (b) este
relatório, com os números medidos; (c) planning-state atualizado com as
iterações 2 e 3 (feito em `8960dad`, anterior a esta escrita).

## Estado da Fase 6 — o que falta, e quem fecha

| Condição | Estado nesta data | Quem fecha |
|---|---|---|
| Pipeline `--light` local | **13 PASS · 0 FAIL** (`run.sh`, HEAD `8960dad`, medido nesta escrita) | — |
| `compliance-audit` local | **17 PASS · 0 FAIL · 0 WARN** | — |
| `check_baseline` local | **465/465**, 0 divergentes/ausentes/sem pin | — |
| `spec-validate.md` | **iteração 3, 73/73 (100 %), dois ✓°** | `qa-engineer` (feito) |
| `relatorio-final.md` | este arquivo | `doc-writer` (feito) |
| Push do HEAD atual (`8960dad`) | **não feito** — remoto ainda em `5818b1c` | `build-engineer` |
| Run de CI sobre o HEAD atual | **não existe** | leitura após o push |
| Check `fecho` do PR #48 | vermelho (`FECHO PENDENTE`), run `34066877538` | vira `LIBERADO` só depois do `done` |
| Aceite de intenção | **"não encontrei objeção"**, condicionado a (a)/(b)/(c) acima | `product-owner` (feito) |
| `done` | não — `phase` ainda `validate` no planning-state | orquestrador, depois de (a) |

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| `build-engineer` | Push de `8960dad` para `origin/feature/017-semantica-do-gatilho`; ler o próximo run de CI por número e conferir que os quatro arquivos executáveis continuam byte-idênticos (a expectativa é sim, já medido aqui) |
| `qa-engineer` | Nenhuma pendência de gate aberta nesta demanda; o credor `EA-42` (bateria efêmera de `M1`…`M21`) e o `EA-44` (o `core`) seguem como estão, para quando a demanda que os feche abrir |
| `product-owner` | Nada pendente do aceite em si; os sete resíduos ficam para leitura futura, sem prazo — nenhum é bloqueante |
| orquestrador | Mover `phase` para `done` no planning-state depois das condições (a)/(b)/(c); decidir quando abrir demanda para `EA-3` (a população/o órfão, que a 017 deixou pronta mas não fechou) |

## Fontes citadas

- `.claude/project-memory/planning-state/017-semantica-do-gatilho.json` —
  `refinement`, `specify`, `plan`, `tasks`, `red`, `implement`, `validate`
  (`aceite_po`, `residuos_po`, `condicoes_po`, `iteracoes`, `item_51`,
  `ratificacao_g4`)
- `specs/017-semantica-do-gatilho/spec.md` — D1–D5, C1–C9, §Correção de fato,
  §Erratas da Fase 3 (`D017-M19`, `_meta.sonda_relacao`), §Erratas da Fase 4
  (`INS1(f)`), §Erratas da Fase 6 (`D3(i)`)
- `specs/017-semantica-do-gatilho/plan.md` — P1–P8, `PP-1`…`PP-12`, §Série de
  repins
- `specs/017-semantica-do-gatilho/tasks.md` — T010, T030, T035, T037, T040,
  §Vácuos declarados
- `specs/017-semantica-do-gatilho/red-017.md` — tabela de mutantes com saída
- `specs/017-semantica-do-gatilho/spec-validate.md` — três iterações, G1–G6,
  O-1…O-7, §Série de commits e repins
- `.claude/verify/check_mutation.py:486-627` (bloco D017), `:568-569`
  (`INS1(f)`), `:554` (`FORM1(a)`), `:586-595` (candidata de forma do `INS1`)
- `.claude/verify/mutation-matrix.json → dividas_declaradas` (entradas `D017-*`,
  commit `1aaccbe`)
- `.claude/BACKLOG.md` — `EA-3` (duas notas datadas, 2026-09-06 e 2026-09-09),
  `EA-42`, `EA-44`
- `specs/013-integridade-da-campanha/spec.md` — Errata `IC-6` (`:116`, `:194`,
  `:231-232`), Errata `C1` (`:205-226`, `:688-712`)
- Commits: `abdddd0` `36073dd` `4b74e3a` `f56d4fd` `759752c` `adb883f`
  `46a812d` `7923701` `e26ee90` `9306d40` `4f2dc6c` `1aaccbe` `0d3cce5`
  `4f605c1` `a45d697` `6a0c7a9` `8f61eb8` `126dc61` `bc12e28` `d643d8d`
  `5818b1c` `513bdab` `cb709d2` `265c56e` `0fe7e75` `0861f90` `8bd422b`
  `07b8228` `4e7debd` `e547fcd` `34ae297` `c8b91cd` `9b96bbc` `75149b9`
  `f1e9164` `82c0984` `19dfd6a` `8960dad`
- PR [#48](https://github.com/oflavioc/quickscan-secops/pull/48) · run
  [`34066877538`](https://github.com/oflavioc/quickscan-secops/actions/runs/34066877538)
  (head `5818b1c`; `verify`/`visual` **success**, `fecho` **failure** por
  desenho)
- Medições diretas desta escrita (2026-09-09, worktree `phase5-014`, HEAD
  `8960dad`): `git show <sha>:<path> | wc -l` para as contagens de linha
  citadas; `git diff --stat`; `git rev-list --count`; `git log --oneline |
  grep gen_pins`; `python .claude/verify/check_baseline.py`; `bash
  .claude/verify/run.sh --light`; `bash .claude/verify/compliance-audit.sh`;
  `python .claude/verify/check_tdd.py`; `git ls-remote origin
  refs/heads/feature/017-semantica-do-gatilho`
