---
name: divergencia-de-censo-tem-causa-isolavel
description: Duas medições honestas do mesmo censo divergem por CONVENÇÃO de contagem; isole a causa antes de pinar, e pine a regra junto do número
metadata:
  type: feedback
---

Antes de pinar um censo medido por outro agente, **remeça e isole a diferença**.
Número pinado sem a regra que o produziu é número que vira mistério na primeira
divergência.

**Why:** na 014 (2026-09-01) o `tech-lead` mediu `ui_v32.css` em 158 regras /
1175 declarações; eu medi 157 / 1170. Diferença exata: **1 regra e 5
declarações** — o `@page { margin: 14mm; }` aninhado num `@media print`, que o
CSSOM expõe como `CSSPageRule` com `style.length === 5`. Nenhuma das duas
medições estava errada: uma contava `@page` como regra de estilo, a outra não.
Se eu tivesse pinado 158/1175 sem isolar, o instrumento da wave seguinte
devolveria 157/1170 e o gate reprovaria por uma convenção não escrita — o
vermelho pela razão errada, no arquivo cuja errata inteira existe para impedir
falha silenciosa.

**How to apply:**
- Pine a **regra de contagem** no `_meta` do registro, campo a campo: o que é
  travessia recursiva, se `CSS aninhado` conta, se shorthand expandido conta
  (`padding` são 5 declarações no CSSOM, `background` literal são 11), o que cai
  em `outras`.
- Escolha a convenção pelo **propósito do consumidor**, não pela estética:
  `@page` não compete na cascata de elemento que a varredura decide, então fica
  fora de `regras`/`declaracoes` e dentro de `outras` — onde continua vigiado.
- Grave a medição divergente **com a causa isolada e a disposição** (R2 §5).
  Assim, se a wave de implementação devolver o outro número, a conversa já
  nasce sobre a convenção, e não sobre um fantasma.
- Vale a mesma disciplina para qualquer contagem herdada de outro agente:
  [[numero-de-orcamento-que-nao-reproduz]] é o caso irmão do lado do orçamento.

Ver [[parser-declarado-tem-cegueira-medida]] para o outro modo de falha do mesmo
censo: volume idêntico, semântica perdida.
