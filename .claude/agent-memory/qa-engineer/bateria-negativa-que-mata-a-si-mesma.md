---
name: bateria-negativa-que-mata-a-si-mesma
description: Runner de bateria negativa que conta QUALQUER throw como rejeição é cego a exceções vindas dele próprio — o caso passa sem o julgador ter opinado
metadata:
  type: feedback
---

Um runner de bateria negativa no formato `try { aplicar; julgar } catch { PASS }`
conta como rejeição **qualquer** exceção — inclusive as que o próprio runner
lança. Medido na emenda de `D010-F3` (010, 2026-08-30): dois casos de "alvo a
mais/a menos só no runtime" passavam `null` como função de sabotagem, o runner
chamava `sabota(...)` sem guarda, e o `TypeError` — `sabota is not a function` —
era contado como PASS. Dois de 39 casos verdes sem o julgador ter sido
consultado uma única vez.

O sintoma é visível de graça: **imprima a mensagem de cada rejeição**. As duas
destoavam do padrão `<fixture-id>: <divergência>` que o `fail()` do julgador
emite. Sem imprimir, os dois casos teriam entrado no relatório como prova de
poder discriminante que eles não tinham.

Duas defesas, e a segunda é a que vale:

- guardar a chamada opcional (`sabota ? sabota(...) : null`) — conserta este bug;
- **exigir que a mensagem venha do namespace do julgador** — conserta a classe.
  Rejeição cuja mensagem não começa pelo id da fixture (ou não passa pelo
  `fail()`) é o runner falando, não o juiz.

**Why:** é o [[core-colapsa-crash-em-sobrevivente]] com o sinal trocado: lá o
crash do harness virava sobrevivente falso; aqui o crash do runner vira morte
falsa. Nos dois, uma exceção do andaime foi lida como veredito do sistema medido.
Bateria negativa existe para provar que o julgador sabe reprovar — se ela se
autossatisfaz, é ela que precisa de bateria.

**How to apply:** ao escrever qualquer runner adversarial (bateria negativa,
campanha de mutante, sonda de vacuidade), a rejeição só conta se **a mensagem for
atribuível ao alvo**. Imprima sempre a mensagem, e desconfie de dois casos com
texto idêntico ou com cara de erro de JavaScript (`is not a function`,
`Cannot read properties of undefined`). Mesma disciplina de
[[medir-red-do-proprio-julgador]], aplicada ao andaime em vez do gate.
