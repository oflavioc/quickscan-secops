---
name: check-obrigatorio-por-sinal
description: Um check obrigatório de CI por SINAL — veredito de processo (fecho de demanda) nunca vai como passo dentro do job `verify`; decisão do usuário no portão da Fase 1 da 016 contrariando a proposta T8-b do TL, com o argumento do EA-5
metadata:
  type: feedback
---

**Cada check obrigatório carrega um sinal só.** `verify` significa "o código
está são"; um veredito de outra natureza (na 016: "a demanda ainda não fechou")
ganha **check próprio** com nome próprio (`fecho`), mesmo que isso custe mais um
check obrigatório na proteção de branch. Nunca alojar o veredito novo como passo
dentro do `verify`.

**Why:** no portão da Fase 1 da 016 (2026-09-04) eu propus (T8-b) o check
pré-merge como passo do job `verify` para "não estender P2 sem decisão do
usuário". O usuário contrariou, com o argumento que decide: um `verify` vermelho
durante toda a demanda **ensina que vermelho é normal**, e vermelho normal deixa
de ser lido — o mecanismo exato do `EA-5` (MANIFEST sempre vermelho, nunca
rodado). Um check `fecho` vermelho diz algo verdadeiro e útil; conflatar os dois
destrói os dois sinais. Custo aceito por ele: três checks (`verify`, `visual`,
`fecho`) em vez de dois.

**How to apply:** (1) ao desenhar um gate cujo vermelho é **esperado e
prolongado** (red ao vivo, dependência de ato externo), pergunte "que sinal este
vermelho polui?" — se a resposta é "o do `verify`", é job/check próprio. (2)
Quando o desenho mais limpo exige uma decisão que o usuário ainda não tomou
(ex.: um terceiro check obrigatório), **apresente a decisão no portão, com o
custo**, em vez de desenhar em volta dela — o usuário preferiu tomá-la a ter um
desenho que a evitava. (3) O job novo não leva `needs:` nem `if:` — fora do
contexto ele roda e imprime `NÃO JULGADO (<motivo>)` (R10 §2); `skipped` seria
conflatar de novo. Ver [[prova-de-carga-de-excecao-e-piso]] e
[[erratas-de-spec-forma-e-precedente]].
