---
name: mutante-nascido-em-errata
description: No relatório/spec-validate, cruzar os mutantes previstos pela spec (inclusive os nascidos em errata) contra o harness E a mutation-matrix — errata posterior ao tasks.md deixa carrasco órfão
metadata:
  type: feedback
---

Ao fechar demanda, **cruzar três listas**: mutantes previstos na `spec.md` (com
as erratas), entradas do harness (`tests_NNN_mutants.js`) e pares em
`.claude/verify/mutation-matrix.json`. O que sobrar em qualquer uma é gap, e o
mais caro é o que a spec exige e o harness não tem.

**Why:** na demanda 015 o `tasks.md` foi commitado **antes** da errata E1, que
criou `M17`/`M18`. A campanha executada seguiu o `tasks.md` (12 previstos + `M19`
acrescentado pela E2 = 13) e `M17`/`M18` nunca entraram: `C1(h1)` ficou sem o
mutante que a própria spec chama de "único carrasco", sem par na matriz e sem
linha em `dividas_declaradas`. A prova existia — bateria negativa da Fase 4,
15/15 — mas vivia num `_trilha` de `expected_suites.json` que foi **substituído**
depois, sobrevivendo só no histórico do git, sem trigger de path que a
re-execute. É "prova manual apodrece" (errata E16 da 010) somado a "gate verde
que não pode reprovar" (família `EA-20`).

**How to apply:** vale para toda demanda que tenha errata sobre a spec depois da
Fase 3. A ordem barata é: ler os ids `M*` da `spec.md`, `grep 'id: "'` no harness,
e listar os `pares` da matriz filtrando pelo prefixo da demanda. Divergência vira
gap classificado no `spec-validate` com direção recomendada — a correção é do
`qa-engineer` (R3 §2), nunca minha. Ver [[status-do-achado-contra-o-fonte]] e
[[deferido-ao-ci-conferir-o-runner]], que são a mesma disciplina em outros
registros.

**Desfecho na 015 (2026-09-01), que vira critério reusável:**
- `dividas_declaradas` é para mutante que **não pode** rodar (equivalente por
  construção · sem caso na fixture · sem ambiente). Mutante que **tem caso e roda
  em segundos** vai para o harness — declará-lo dívida é *usar a gaveta errada
  para esconder trabalho barato*. A fraqueza de um par, quando existe, é
  propriedade **do par** e mora na nota dele.
- **Prova que vive só na bateria efêmera evapora.** `M17`/`M18` tinham sido
  provados na bateria negativa da Fase 4, num `_trilha` que foi substituído
  depois: sobrou no histórico do git, sem par na matriz e sem trigger que
  re-executasse. Critério prático: **prova sem par na matriz e sem trigger de
  path não é prova, é lembrança.**
- Ao registrar a correção, **conferir se as notas dos pares vizinhos repetem a
  afirmação refutada** — na 015 o par `M19` continuou carregando "prova fraca ·
  N40 mataria M17 também" depois de a errata E3 riscar a frase.
