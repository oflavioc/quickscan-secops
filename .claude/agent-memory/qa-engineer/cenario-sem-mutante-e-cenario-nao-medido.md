---
name: cenario-sem-mutante-e-cenario-nao-medido
description: Auditar a matriz gate↔mutante pelo lado do GATE — todo cenário da sonda precisa de um mutante que ele mate, senão o cenário pode ser vácuo
metadata:
  type: feedback
---

Ao fechar o green do `IC-9` (013, 2026-08-30) o catálogo `M-IC10`…`M-IC19` matava
os cenários **i, ii, iii, vi** da sonda de 7 cenários. Os cenários **iv** (exceção
nominal ao harness), **v** (`NÃO EXECUTADO` não é perdoável) e **vii** (regressão:
sem exceção, nada muda) não tinham **mutante nenhum**.

Cenário sem mutante é cenário cuja força discriminante ninguém provou: ele pode
estar sempre verde por construção — asserção que não sabe reprovar.

Três mutantes fecharam o vão, e os três morreram:

- neutralizar a comparação de harness → só o cenário iv reprova;
- aceitar `NÃO EXECUTADO` no ramo do perdão → só o cenário v reprova;
- zerar `remanescentes` → reprova por iii, iv, v **e vii**, provando que vii mede.

**Why:** a matriz gate↔mutante é sempre lida pelo lado do mutante ("este mutante
morre?"). Lida pelo lado do gate ("este cenário mata alguém?") ela revela asserções
decorativas — que é exatamente o achado `EA-6` da própria demanda 013, cometido
dentro do gate que existe para caçá-lo.

**How to apply:** ao entregar um gate com sonda de N cenários, construa a tabela
cenário → mutante(s) que ele mata **antes** de declarar green. Cenário com coluna
vazia: ou se escreve o mutante, ou se declara o cenário como não medido. Vale
também para o mutante de fiação: mutante que sobrevive ao gate por construção
(mede a função, não a ligação) tem de ser **nomeado com o job onde morre**, nunca
silenciado — ver [[excecao-que-morre-com-a-razao]] e
[[sonda-de-fiacao-sem-chromium]], que é como se mede a ligação sem Chromium.
