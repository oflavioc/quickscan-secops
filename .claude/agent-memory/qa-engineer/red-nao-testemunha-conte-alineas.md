---
name: red-nao-testemunha-conte-alineas
description: Dentro de janela vermelha o veredito do gate não testemunha nada — para provar que uma emenda de COBERTURA é nova, compare a contagem de alíneas vermelhas do juiz emendado contra a do juiz de HEAD sob a MESMA sabotagem
metadata:
  type: feedback
---

Emenda que só ACRESCENTA cobertura a um gate já vermelho não pode ser provada
pelo veredito: o gate já era FAIL e continua FAIL, com ou sem a cobertura. "O
gate emendado falhou sob a sabotagem" é compatível com a cobertura nova não ter
tido participação nenhuma na morte.

O que testemunha, nesta ordem:

1. **a alínea que casou** — extraia do erro o segmento que contém a assinatura
   esperada, e não o começo da linha. Gate que já falhava imprime a razão VELHA
   primeiro, e ler o prefixo dá crédito à cobertura nova por um vermelho que não
   é dela;
2. **a contagem de alíneas vermelhas, EMENDADO × HEAD, sob a mesma sabotagem** —
   a diferença é a cobertura. Medido na 010 (2026-08-30): A1–A3 deram 2 × 1,
   B1–B2 deram 3 × 2, C1 deu 1 × 0;
3. **um controle sem sabotagem** quando o caso exige simular o pós-fix. Sem ele,
   a morte pode ser efeito da simulação (C0: os dois juízes passam com o pós-fix
   simulado e só C1 mata).

**Mecanismo** (barato, roda em segundos por caso): `require.cache` recebe um
wrapper das fixtures cujo `d010ApplyResults` aplica a sabotagem no DOM **depois**
da fixture e **antes** do julgamento; `D010_ONLY=<gate>` filtra a execução; o
mesmo caso roda contra `tests_010_vao.js` e contra `git show HEAD:` do gate (dois
patches: `HERE` absoluto e o `require` relativo). Zero byte de produto.

**A morte só conta se for do gate.** Exceção que escapa de `R()` chega ao
relatório sem o formato `N alínea(s) · <alínea> → <motivo>` — exija esse formato,
senão é o andaime falando, como em [[bateria-negativa-que-mata-a-si-mesma]].

**Why:** o veredito é a soma, e soma não distingue parcela. É o mesmo motivo pelo
qual [[julgador-de-head-contra-runtime-atual]] exige diff de SAÍDA e não de
contagem — aqui a granularidade desce um nível, da suíte para a alínea, porque a
janela vermelha já consumiu o sinal do veredito.

**How to apply:** toda vez que ampliar a varredura de um gate (fixture nova numa
lista, guarda que passa a rodar em mais um render) durante a fase de red. Vale
também para o inverso: se EMENDADO e HEAD derem a mesma contagem, a emenda é
decorativa e o par gate↔mutante que ela promete é vazio —
[[cenario-sem-mutante-e-cenario-nao-medido]].
