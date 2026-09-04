---
name: project-011-aceite-segundo-passe
description: A 011 foi mesclada sem aceite do PO (EA-33); o segundo passe (2026-09-01) não achou objeção, mas "d011 19/19 DETECTADO" nunca cobre D011-M9 — o harness exclui M6/M8/M9 por raia
metadata:
  type: project
---

A 011-numeracao-das-prioridades entrou na develop (PR #32) com meu primeiro
passe REPROVADO gravado e ninguém voltou para julgar a correção (forma B,
`.d011-key[data-d011="mudo"]{visibility:hidden}`). Segundo passe em 2026-09-01:
não encontrei objeção; a forma B fecha o defeito que nomeei (moldura vazia do
item MUDO no papel), com carrasco próprio `D011-M20` em `D011-PRT1(f)`.

Três coisas que não estão escritas em lugar óbvio:

1. **"Campanha d011 19 DETECTADO de 19" NÃO inclui `D011-M9`.** O harness
   `d011` exclui por raia M6 e M8 (arquivo protegido, worktree efêmera) e M9
   (Chromium). Um número verde de CI da campanha pode ser citado como se
   cobrisse o mutante de contraste — não cobre. O kill de M9 é rito manual do
   proprietário e o par na matriz continua DEFERIDO até T031 escrever o retorno.
2. **Relatório final e spec-validate ficaram congelados no HEAD `27aabe9`**; os
   commits seguintes fecharam o gap do C10 (`verify.yml:74` passou a invocar
   `tests_011_chromium.js`; run 33426062475 mediu 8,82:1 — citado só em
   comentário do CSS). Registros que ficaram para trás: item 4/6 de "O que fica
   aberto" e a `_trilha` de `visual.d011chromium` ("ainda não fixada por
   execução"). Relatório de doc-writer é retrato de um SHA, não do PR mesclado.
3. **O gate tinha o mesmo ponto cego do CSS**: as alíneas (c)/(e) de PRT1
   enumeravam "atalho"/"estado" e nunca perguntavam pelo terceiro valor. A alínea
   nova (f) não enumera — os nós vêm do oráculo. Regra de print escrita pela
   positiva sobre um marcador de N valores deixa o valor não nomeado imprimindo.

**Why:** aceite pós-merge não é formalidade (EA-33 existe por isso), e o
segundo passe precisou distinguir o que a campanha local prova do que o rito
do proprietário ainda deve — senão "19/19" vira prova do que não mede.

**How to apply:** em todo aceite de intenção, cruzar o número da campanha com a
`_trilha` do harness em `mutation_map.json` (quais ids estão FORA e por quê)
antes de dar por coberto um mutante Chromium; e conferir se relatório final e
registros canônicos são do mesmo SHA que o merge. Ver
[[project-014-fecho-e-pendencias]] e [[project-gate-verde-nao-e-protecao]].
