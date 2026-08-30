---
name: excecao-que-morre-com-a-razao
description: Como se escreve exceção nominal com dentes — prazo auto-executável contra a matriz, sonda com dados sintéticos, e as duas armadilhas (gate que passa a EXIGIR a exceção; mutante Python que mata por IndentationError)
metadata:
  type: project
---

Desenhado na demanda 013 (addendum de 2026-08-30, gate `IC-9` em
`check_mutation.py`), quando o proprietário autorizou **nominalmente** que o
stage `mutation` honre exceção do `known_issues.json` para o `M51-01`/EA-7.

## O que dá dentes a uma exceção: o prazo que se cobra sozinho

`remocao_prevista` em prosa é promessa. O que vira gate é amarrar a exceção ao
**registro canônico da última prova**: a entrada só é legítima enquanto
`mutation-matrix.json → pares[M51-01].ultima_prova.resultado != "KILL"`. No dia
em que alguém reconstruir o poder discriminante e repuser o `KILL`, o stage
**reprova nomeando `EXCEÇÃO OBSOLETA`** e força a remoção. Ninguém precisa
lembrar.

Isso cobre a obsolescência pelo **registro**. A outra direção — obsolescência
pela **execução** (o bloco do mutante volta a `DETECTADO` na saída da campanha) —
é outra asserção, e medir só uma deixa metade da cláusula sem gate.

## A armadilha que quase passou: gate que passa a EXIGIR a exceção

Se as asserções sobre a entrada forem as únicas, o gate fica verde hoje e
**quebra no dia em que a exceção for cumprida** — exatamente o dia em que o
sistema está mais são. Duas consequências de desenho, as duas medidas:

1. `issues: []` sai `[OK] … nada a honrar`, nunca FAIL.
2. A sonda do mecanismo usa **dados sintéticos** (harness/mutante/gate
   fabricados) e recebe a lista de exceções **por parâmetro**, não por leitura de
   arquivo. Assim o poder discriminante continua medido depois que a última
   exceção real for removida.

Sonda mínima que discrimina (7 cenários): perdoa o nomeado · **obsoleta** quando
o nomeado volta a `DETECTADO` · não perdoa o vizinho sobrevivente · não perdoa
harness alheio · **não perdoa `NÃO EXECUTADO`** (não executar não é sobreviver) ·
não perdoa campanha vazia (`blocos == []`, senão um crash vira perdão) · sem
exceção declarada nada muda.

## O buraco que este desenho tinha (achado no dia seguinte)

As sete cenários da sonda perguntam *"o perdão discrimina?"* e nenhum pergunta
*"sobre que leitura ele decide?"*. Campanha **truncada** cujo único não-KILL
emitido é o perdoado saiu **verde** — ver [[perdao-sobre-leitura-parcial]], que
é o `IC-10`/contrato C6 fechando isso no LAÇO (que tem o oráculo de contagem),
nunca em `mut_perdao`.

## O limite estrutural, que se declara em vez de fingir

Sonda em processo mede a **função**, não a **fiação**: um mecanismo impecável que
o laço nunca consome sobrevive ao gate. É a mesma forma de
[[poder-discriminante-ic2-e-ic8]] — e a resposta da casa é a mesma: registrar o
mutante como sobrevivente e **nomear o job onde ele morre**. Uma asserção por
`grep` no próprio fonte foi considerada e recusada: comentário ou chamada morta a
satisfazem, e verde que não mede é a doença.

## Armadilha operacional: mutante Python por `str.replace`

Ao fabricar mutante removendo um ramo `elif`, **inclua a indentação inicial no
padrão**. Sem ela sobra a indentação do ramo anterior e o arquivo estoura
`IndentationError` — o gate "mata" o mutante por crash, que não é detecção
(regra da casa, `tests_p51_mutants.js:9`). Rode `ast.parse` no arquivo mutado
**antes** de creditar a morte; foi o que separou um M-IC11 falso de um verdadeiro.

**Why:** a demanda 013 existe para matar número que parece medição e não é, e uma
exceção nominal é a forma mais elegante de reintroduzir exatamente isso — um
verde que não conta que houve perdão. As quatro cláusulas do proprietário
(nominal · com prazo · impressa · **obsoleta reprova**) são o antídoto, e cada
uma precisa da sua asserção.

**How to apply:** ao ser pedido para "tolerar" qualquer coisa em gate, recuse a
forma abrangente e ofereça esta: entrada nominal + prazo amarrado a um registro
verificável + sonda sintética + mutante para cada cláusula. Ver
[[medir-red-do-proprio-julgador]] para o rito de medição (o stage recusa árvore
suja) e [[ancora-viva-em-regra-morta]] para o EA-7, que é a razão da primeira
exceção.
