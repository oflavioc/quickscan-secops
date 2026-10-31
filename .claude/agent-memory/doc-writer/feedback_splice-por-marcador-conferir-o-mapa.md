---
name: splice-por-marcador-conferir-o-mapa
description: ao inserir muitas subseções num arquivo grande por script com marcadores "BEFORE <heading>", o conteúdo do bloco N vai ANTES do heading N+1 — errei o mapa duas vezes; conferir por frase-assinatura antes de gravar
metadata:
  type: feedback
---

Para acrescentar dezenas de subseções/blocos ao `BACKLOG.md` (9 mil linhas) o método que
funcionou foi: arquivos de inserção no scratchpad com linhas `@@BEFORE EA-NN` / `@@EOF`, e
um splicer Python que acha o heading **uma única vez** (regex `^## (?:~~)?EA-NN\b(?![a-z])`),
exige linha anterior vazia e insere. Escrever em `Write`, nunca em heredoc (aspas/apóstrofos).

**Why:** em 2026-10-25 troquei o marcador **duas vezes** na primeira redação — o conteúdo
da subseção do `EA-95` foi parar sob `BEFORE EA-95` (que insere ANTES do heading 95, isto é,
dentro do bloco 94) e o do `EA-102` foi esquecido. O splicer não percebe: o arquivo ficava
bem formado e o compliance verde. Só o cruzamento por conteúdo pega.

**How to apply:** o marcador nomeia o heading que **vem depois**. Antes do commit, rodar um
check "frase-assinatura de cada subseção ∈ corpo do bloco do seu id" (14/14 aqui) e contar
uma subseção por bloco. Nota de uma linha sem lugar no cabeçalho (o `BACKLOG.md` não tem
"cabeçalho do dia"): colocá-la na subseção do achado a que pertence e dizer isso em
DEPENDÊNCIAS, em vez de inventar um `##` novo. Ligado a [[prova-aditiva-mede-forma-nao-sentido]]
(forma verde não prova sentido certo) e [[alocacao-ids-ea]].
