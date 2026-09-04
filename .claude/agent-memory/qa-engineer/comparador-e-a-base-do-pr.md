---
name: comparador-e-a-base-do-pr
description: Ao diagnosticar regressão de CI num PR, o comparador é a BASE DO PR — não o commit anterior à wave que você suspeita; escolher pela suspeita esconde a wave que é de fato a culpada
metadata:
  type: feedback
---

Diagnóstico de regressão de PR compara **base do PR × HEAD**. Comparar contra o
commit anterior à wave *suspeita* embute a conclusão na medição: se a culpada for
outra wave do mesmo PR, ela está dos DOIS lados e o diff sai vazio — e "vazio"
lê-se como "não fui eu", que é o erro mais caro possível nessa hora.

Aconteceu comigo na 010 (2026-08-30). O coordenador levantou a hipótese de que a
wave 7 (V3, N cards → um aviso) tinha mudado a paginação do PDF. Medi contra o
build anterior à wave 7 e achei **zero delta** nos dois casos que o CI reprovava.
Ia concluir "não é o 010". Refiz contra a base do PR (`git merge-base`) e o caso
C saltou: **+173 chars** no papel e na tela, vindos da **wave 4** — que já estava
no meu comparador anterior e por isso era invisível.

**A receita, em ordem:**

1. `BASE=$(git merge-base HEAD origin/develop)` — e o artefato construído sai de
   `git show $BASE:<html>`, não de rebuild;
2. meça o DOM das DUAS superfícies (tela e papel) nas fixtures que o gate usa,
   não numa fixture sua: contagem de nós, chars por seção, classes de ocultação.
   Delta zero em todas é uma resposta forte, mas só depois do comparador certo;
3. **separe os casos reprovados antes de atribuir causa comum.** Ali um caso
   tinha +173 chars (regressão real, por paginação) e o outro tinha delta **zero**
   em nós (1050), ocultos (1) e nós pós-print (1452) — mesmo job, mesmo gate,
   causas diferentes. Um remédio para os dois teria consertado metade e mascarado
   a outra.

**Why:** o CI reprova por SUÍTE; a atribuição de causa é por CASO. E o instinto de
medir contra "antes da mudança que eu suspeito" transforma a suspeita em premissa.

**How to apply:** também vale para "objeção do PO × vermelho do CI" chegando
juntos. Na 010 os dois falavam de "conteúdo que sumiu do papel" e eram defeitos
OPOSTOS: a objeção era subtração (V3 tirou 6299 chars de `#pr-support`), o CI era
adição (wave 4 pôs 173 chars em `#pr-target` e empurrou um valor de página).
Convergência de sintoma não é convergência de causa — ver
[[guarda-de-vacuidade-preempta-a-alinea]] para o mesmo erro dentro de um gate só.

**Segundo erro na MESMA investigacao, e maior: a CONDICAO, nao o comparador.**
Depois de acertar a base, medi as fixtures do gate sem reproduzir o `setup` dele —
o `P52-TGT4` chama `p52DeclaraContexto()` (`tests_p52_chromium.js:3563-3574`), que
declara `presence: NONE` em tres capabilities. Sem essa chamada o runtime fica em
**modo legado**, `buildRecommendationContext().contexts` sai vazio, e a camada que
eu investigava nao roda. Conclui duas vezes errado com numeros corretos:
"caso B nao e do 010" (delta zero) e "caso C e da wave 4" (+173 chars). Com o
contexto declarado os dois viram: `#pr-sup-base` cai 3067→226 (B) e 6016→413 (C),
`#pr-target` fica **inalterado**, e a wave 4 contribui **zero**. Uma causa so.

**A regra:** reproduza o setup do gate **linha a linha, com arquivo:linha na mao**,
antes de medir a fixture dele. "Apliquei a mesma fixture" nao basta — o gate faz
mais coisas entre aplicar a fixture e assertar, e cada uma pode ser a que liga a
camada sob suspeita. Se voce nao consegue citar o helper de setup que copiou, nao
mediu o cenario do gate; mediu um parecido.

**Corolario sobre gates que fatiam texto extraido de PDF.** Ali o recorte era
`t.slice(t.indexOf(ANCORA), t.indexOf(TERMINADOR))` dentro do texto de UMA pagina,
com `undefined` quando o terminador nao esta na pagina — e o terminador e o ultimo
cartao do proprio bloco. Bloco que passa a cavalgar a quebra de pagina faz o
recorte **crescer silenciosamente ate o fim da pagina** e engolir o vizinho. Isso
produz os dois sintomas opostos de uma vez: sobra texto (assercao de ausencia
reprova) e falta valor (assercao de presenca reprova). Antes de atribuir causa a
conteudo, verifique se a fatia mudou de tamanho.
