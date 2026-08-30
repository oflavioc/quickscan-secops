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
