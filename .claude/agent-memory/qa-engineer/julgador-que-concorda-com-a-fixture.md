---
name: julgador-que-concorda-com-a-fixture
description: Assert de fixture que compara o runtime contra o objeto da fixture é cego a qualquer edição da fixture — a comparação tem de ser contra a tabela declarada
metadata:
  type: feedback
---

`d010AssertFixtureStates` (T002 da 010, 2026-08-30) nasceu comparando
`TARGET.overrides` do runtime contra `fx.targets`. Passou nos quatro cenários
positivos. A prova negativa derrubou: trocar o alvo de `D010-F3` de
`team-capacity` para `mandate` **não era detectado** — o objeto da fixture e o
runtime mudam juntos, e o assert concorda com os dois.

A correção é comparar em dois saltos: `fx.targets` × tabela declarada, e depois
runtime × tabela declarada. A tabela é o único ponto fixo.

O mesmo cheiro aparece em qualquer campo que o assert leia da fixture em vez de
ler da declaração: nível de alvo, vetor, prioridades. O vetor foi pego só porque
uma segunda asserção (conjunto de apresentação `base`) mede consequência, não
entrada.

**Why:** fixture que não alcança o estado pretendido faz o gate morrer vacuoso —
pior que gate ausente (lição da 013). Um assert que valida a fixture contra ela
mesma é exatamente esse vácuo, uma camada acima: ele existe para impedir a
vacuidade e é a própria vacuidade.

**How to apply:** toda entrega de fixture leva uma bateria negativa que **estraga
a fixture de propósito** (tira a declaração de contexto, troca o alvo, muda um
nível, muda o vetor) e exige rejeição com divergência nomeada. Rejeição que não
vem é buraco no julgador, e o conserto é do julgador, não da bateria. Mesma
disciplina de [[medir-red-do-proprio-julgador]], aplicada a fixture em vez de
gate.
