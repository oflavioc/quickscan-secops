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
