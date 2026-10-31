---
name: repin-e-sempre-commit-separado
description: gen_pins.py pina os blobs de HEAD, então o repin nunca cabe no commit que altera o arquivo — é sempre um commit chore imediatamente posterior, um por commit de conteúdo
metadata:
  type: project
---

`gen_pins.py` calcula os hashes com `git show HEAD:<path>`. Consequência de
planejamento: **é impossível o repin viajar dentro do mesmo commit que altera o
arquivo pinado** — rodá-lo antes de commitar pina o conteúdo antigo. O rito real
do repositório (confirmado no `git log`: `3888cc0` → `f0aba70`, e toda a série
`chore(012): gen_pins — R<n>`) é **um commit chore de repin logo depois de cada
commit de conteúdo**.

**Why:** planos costumam escrever "leva `gen_pins.py` no próprio commit" querendo
dizer "no mesmo PR" (R8 §1). Se o `tasks.md` levar essa frase ao pé da letra, o
executor produz um repin que pina o estado anterior e o stage `baseline` fica
vermelho no ponto auditável — exatamente o que a política queria evitar.

**How to apply:** ao escrever `tasks.md`, **uma tarefa `chore` de repin por commit
de conteúdo**, dono `build-engineer`, com a mensagem no padrão
`chore(NNN): gen_pins — R<n> da tabela de repins (<motivo>)`. Quando o plano
prevê "R6" para uma wave de dois commits, isso vira R6a/R6b — refinamento de
granularidade, não desvio; desvio de verdade (repin fora da previsão R1–R10, como
o de um merge de `develop`) vai **registrado no relatório final**, nunca
silenciado. `.claude/project-memory/**` é excluído do registry — commit de
`planning-state` não pede repin. Ver [[demanda-013-tasks-9-waves]].

**A série começa em R0, não em R1 — os artefatos de fase também são pinados.**
`specs/NNN-slug/{refinement,spec,plan,tasks}.md` são rastreados e entram no
registry (só `docs_phase5/**`, `.claude/project-memory/**` e `*.zip` estão
excluídos). Commit doc-only de portão **também** pede repin, e ninguém percebe:
medido em 2026-08-31, na Fase 3 da 011, `check_baseline.py` respondia
`264/264 pins conferem · 0 divergentes · 0 ausentes · **3 sem pin**` — as Fases
0, 1 e 2 tinham commitado sem repin nenhum, e o stage estava vermelho havia três
portões. **How to apply:** abra o `tasks.md` com uma tarefa `chore` de repin R0
que feche a dívida acumulada das fases anteriores **depois** do commit do próprio
`tasks.md`, e rode `python .claude/verify/check_baseline.py` na Fase 2/3 para
medir o tamanho dela em vez de supor que é zero.

**Armadilha de precedente (2026-08-30, Fase 2 da 010).**
`specs/009-leitura-do-relatorio/plan.md` é o melhor precedente de **formato** de
`plan.md` — e é **precedente errado de repin**: ele concentra `gen_pins.py` numa
"wave 7 única, no fim", justificando com "R8 exige o mesmo PR, não o mesmo
commit". Copiar isso abre uma janela de `baseline`/`boundary` vermelhos por meia
demanda e contraria o rito vivo. O `git log` decide, não o plano anterior: na
própria branch da 010 já existiam `chore(010): gen_pins — repin da fase 0` e
`… da fase 1`, um por commit de conteúdo. **Ao reusar o 009 como molde, troque a
seção de repin antes de qualquer outra coisa.**

**O R0 pode ser consumido antes do `tasks.md` (Fase 3 da 016, 2026-09-04).** O
plano previu "R0 = errata + plan.md + tasks.md", mas o orquestrador rodou o repin
logo após o commit do plano (`9e3fb0c`), e ao abrir a Fase 3 o `check_baseline`
já respondia `0 sem pin`. **How to apply:** o `tasks.md` começa medindo
(`python .claude/verify/check_baseline.py`) e, se o R0 já foi, a primeira tarefa
é um **R0b** que fecha só o commit do próprio `tasks.md` — refinamento de
granularidade, declarado na linha, não desvio para o relatório.

**Segunda medição (Fase 2 da 017, 2026-09-06): a dívida dos portões inclui
arquivo de OUTRO agente.** `check_baseline.py` no HEAD `36073dd` respondia
`458/459 · 1 divergentes · 2 sem pin` — os dois `sem pin` eram `refinement.md` e
`spec.md`, e o **divergente era `CONTEXT.md`**, editado pelo `product-owner` na
Fase 0 sem repin. **How to apply:** o R0 do plano lista os arquivos por nome a
partir da saída do `check_baseline`, não só os `specs/NNN-*/`; e quando a
worktree está suja (planning-state do orquestrador), meça num clone efêmero
([[prototipo-clone-efemero-origin-local]]). Contagem honesta de repins = número
de commits de conteúdo que as waves produzem (017: dez, R0–R9), mais os desvios
**por classe** (merge de `develop`; iteração do `spec-validate`) — 008 previu 1
e gastou 3, 015 previu R2–R12 e executou 13 deslizados, 016 previu 15–16 e
executou 9 fundidos: o conferível é o par (commit, arquivos pinados).

**`gen_pins.py` recusa QUALQUER pendência fora do próprio `pins.json`
(`:72-79`, medido em 2026-09-06) — inclusive planning-state e arquivo não
rastreado (`??`).** Consequências de desenho no `tasks.md`: (i) a tarefa de
repin do portão e a do planning-state **nunca** são `[P]` — a edição de estado
suja a árvore que o repin exige limpa, e o planning-state pendente entra
commitado antes (a 016 marcou esse par como `[P]` e só funcionou porque a ordem
real foi serial); (ii) "um repin por commit de conteúdo" com escritores
paralelos na mesma worktree é mecanicamente impossível — o repin de A falha
enquanto B tem arquivo pendente —, logo toda wave que carregue repins é
**serial**, e `[P]` só sobra entre tarefas em que ninguém escreve arquivo (na 017:
aceite do PO ∥ relatório do doc-writer). Fundir os repins para "liberar" o `[P]`
é o desvio que 015 e 016 pagaram. Nunca `--force`. Ver
[[tasks-estado-do-mundo-e-ato-humano]].

**Série executada da 017 (medida em `bc12e28`, 2026-09-06) — duas classes de
desvio que o plano não previa.** Previstos dez (R0–R9) e as classes (a) merge de
`develop` e (b) iteração do `spec-validate`; executados onze até a W3 (R0, R1,
R2, **R2a**, R3–R8, **R8a**) e nenhum de (a)/(b). Os extras: **errata de spec
depois do red** (R2a `2c79eb2`: o gate escrito emitiu uma causa que C3 não
listava; errata em vez de afrouxar) e **segunda edição comentário-only do
julgador** (R8a `bc12e28`: docstring, PP-12). Também R1 fechou **dois** commits
de conteúdo (`tasks.md` + erratas de W0 na spec) com um repin. E a frase do
plano "`[P]` na W3: o build-engineer roda os três repins em sequência depois de
os três conteúdos estarem na árvore" é **mecanicamente errada** — com os três em
HEAD, o primeiro repin cobre os três e os outros dois saem vazios: é a fusão que
a frase promete evitar. **How to apply:** liste as quatro classes (a)–(d) na
seção de repins; escreva a W3 serial já no plano (conteúdo → repin, por
arquivo); e quando duas tarefas de conteúdo forem delegadas juntas, diga na
delegação "commit, volte, repin, próxima" — na 017 o `build-engineer` commitou
`d014` e `d016` seguidos e o orquestrador teve de refazer a branch local (reset,
R4, cherry-pick, R5) para não fundir. Ver [[amendar-plano-pos-execucao]].

