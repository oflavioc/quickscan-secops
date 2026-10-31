---
name: letra-de-opcao-tem-escopo-da-pergunta
description: "Vamos de C"/"rota B" só significa algo dentro da pergunta em que foi respondido — achar a rodada de entrevista antes de transcrever a letra como rota
metadata:
  type: feedback
---

Letra de opção dita pelo proprietário (*"Vamos de C"*, *"Vamos com a B"*) tem o
escopo **da pergunta daquele momento**. Neste repo as letras são reusadas por
conjuntos de opções diferentes no mesmo assunto, e o refinamento seguinte pode
ler a letra contra o conjunto errado.

**Why:** na 024 (2026-10-19) o refinamento do PO e a delegação do orquestrador
diziam que o `EA-79` fora executado "pela quarta rota, não pela C" — lendo C como
a terceira linha da tabela de rotas do achado (a linha explicativa). A rodada 4 do
refinamento da 023 (`specs/023-leitura-unica-do-apoio/refinement.md:122`) mostra
que o *"Vamos de C"* respondia a outra pergunta — paliativa / remover /
**estrutural** — e C era a estrutural, que FOI feita (a própria 023). No mesmo
assunto ainda havia o A/B/C da errata `E1` da 023 e a "rota C" do conserto de gate
do `EA-81`. Transcrever o rótulo teria gravado uma falsidade justo na demanda cujo
objetivo era o registro parar de mentir.

**How to apply:** ao encontrar "rota X"/"opção X" num texto a transcrever,
`grep -n "Vamos de X\|Vamos com a X"` nos `refinement.md`/`spec.md` da demanda de
origem e ler a linha da tabela §Rodadas de entrevista onde a letra foi respondida.
Escrever a rota **pelo nome** (estrutural, quarta rota, produto publicado conta
como substituto), citando a rodada, nunca só a letra. Divergência com o
refinamento vai ao relatório e a DEPENDÊNCIAS (refinamento é do `product-owner`).
Família de [[status-do-achado-contra-o-fonte]] — o rótulo de outro agente se
confere no fonte.
