---
name: prosa-descritiva-no-julgador
description: Comentário/docstring do gate que descreve comportamento que deixou de existir corrige-se (não "fica"), em wave de doc, por edição comentário-only provada por AST + hunk único; distinguir citação retrospectiva (fica) de descritiva (corrige)
metadata:
  type: feedback
---

Quando um id sai do gate (ex.: `IC-6` substituído na 017) e a string sobrevive em
prosa do próprio julgador, **classifique cada citação** antes de decidir:
**retrospectiva** (enumera o que a seção continha quando o bloco nasceu, ou diz
"saiu/reservado") — fica, citar o passado é correto; **descritiva** (afirma o que
a função faz *agora*, ex.: "mesma escada de IC-5/IC-6") — corrige, é prosa que
mente sobre o código (família `EA-31`). O orquestrador recusou "deixar" a
descritiva mesmo com o QA recomendando não tocar (custo: segunda edição do julgador).

Desenho que passou (017, T037/T038): tarefa `doc` do `doc-writer` na wave de
documentação, **comentário-only**, com três provas mecânicas testadas contra
negativos — (1) AST sem docstrings idêntica (`so_docstring.py`, `ast.walk` +
`del corpo[0]` do `Expr(Constant str)`), que **não** localiza nem vê docstring
apagada; (2) `git diff -U0 | grep '^@@'` = um hunk com `def <função>` no
cabeçalho e nunca `+…,0`; (3) `ast.get_docstring` da função sem o id velho. A
segunda edição do arquivo do gate é **declarada**: patch-point novo (PP-12),
repin com **sufixo de letra** (R8a — série aprovada não se renumera), nota no
relatório, e a asserção de "hunks só em PP-1…PP-n" das tarefas de validação
ganha o PP novo — senão a validação falha por construção.

**Why:** dentro da demanda que instrumenta "registro contra execução", docstring
que descreve escada de dois degraus quando há um é o mesmo defeito que a demanda
combate; e o custo de deixar é o `spec-validate`/leitor futuro acreditar nela.

**How to apply:** ao substituir/retirar um id de gate, `grep -n` o id no arquivo
do gate e classifique linha a linha na tarefa (qual fica, qual corrige), com a
razão; se a corretiva estiver fora do commit red, é tarefa própria com as três
provas, nunca "ajuste de passagem". Ver [[r3-gate-e-implementacao-no-mesmo-arquivo]]
e [[prova-mecanica-testada-contra-negativo]].
