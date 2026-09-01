---
name: numero-de-orcamento-que-nao-reproduz
description: Número de orçamento relatado por outro agente se reconcilia por aritmética antes de virar registro — antes + item + custo estrutural tem de fechar, senão o relato está errado e o ledger herda a mentira
metadata:
  type: feedback
---

Antes de gravar num registro qualquer número de orçamento que **outro** produziu,
reconcilie-o por aritmética: `antes + custo do item + custo estrutural = depois`.
Se não fechar, meça você, por **dois caminhos independentes**, e grave o que
reproduz.

**Why:** na 015 o mesmo orçamento circulou errado **três vezes**. (1) A spec
carregava "~540 chars" — era a métrica normalizada (544) comparada com o teto da
crua; a errata E1 corrigiu para 585 crus / 544 normalizados. (2) O commit da
implementação anunciou **667 crus**; duas medições independentes — por DOM em
jsdom, com o instrumento exato de `P51-DOC12`, e por extração do literal do HTML
construído sem jsdom — devolveram **752**, e `585 + 160 + 7 = 752` fecha, onde 7
é o custo estrutural do `<li>` novo (quebra de linha + 6 espaços de indentação,
que a métrica crua conta e a normalizada colapsa). Registrar 667 anunciaria **85
caracteres de folga que não existem**, e a próxima demanda dimensionaria a
própria adição contra eles.

O gate não pega isso: 667 e 752 estão os dois abaixo do teto de 900, então tudo
fica verde. O dano é no **ledger**, não no veredito — e é por isso que ninguém
percebe até alguém gastar a folga inexistente.

**How to apply:** todo gate de orçamento imprime as duas métricas **a cada
execução**, com o delta contra o "antes"; a alínea assere as duas e o custo do
item isoladamente. A conta de reconciliação vai escrita no `_trilha`, junto do
número — número sem a conta que o sustenta é o mesmo tipo de dado que apodrece.
E quando divergir do que outro agente relatou, registre a **divergência**, não só
o valor certo: apagar o número errado em silêncio faz o próximo leitor achar que
o relato original nunca existiu.

Parente de [[vacuidade-com-folga-no-limiar]] (lá o número que falta; aqui o
número que não reproduz).
