---
name: prova-mecanica-testada-contra-negativo
description: Todo comando de "prova mecânica" que o tech-lead põe numa tarefa do tasks.md é executado antes contra um caso positivo simulado E contra os negativos que ele promete pegar, com os limites declarados; grep sobre diff (`^-[^-]` = 0) para "errata aditiva" é inatingível com nota inline e cego a bullet removido
metadata:
  type: feedback
---

**Prova mecânica que entra numa tarefa é testada antes de entrar** — positivo
simulado (a mudança legítima passa) e negativos nomeados (remoção, distorção,
duplo trecho, linha movida, CRLF) — e vem com a lista de limites: o que ela prova
(estrutura) e o que fica para leitura (sentido). Ponto cego não declarado é
`EA-20` (gate que promete asserção e entrega tautologia) do lado do processo.

**Why:** na W0 da 017 (2026-09-06) a T032 nasceu com `git diff … | grep -c
'^-[^-]'` ⇒ 0 como prova de "errata aditiva" na spec da 013. Medido: nota inline
em linha de tabela/prosa sai no diff como par `-linha`/`+linha` (a errata correta
dá **3**, nunca 0 — inatingível), e bullet `- item` removido sai como `-- item`,
que `^-[^-]` não casa (**0** com uma remoção real — cego), justamente nos bullets
`:222-226` do bloco que a tarefa tocaria. O `doc-writer` descobriria na W3 um
critério que não fecha. O orquestrador pediu: substituir por comando executável
(não prosa), dizer qual classe de remoção ainda escapa e cobri-la ou declarar.

**How to apply:** o molde que ficou (tasks.md da 017, §Prova mecânica de T032):
script `difflib` linha a linha, `autojunk=False`, sobre **blobs** (`git show
<rev>:<path>`) ou blob × árvore — para toda linha do base: idêntica, ou ela
mesma + **exatamente um** trecho inserido que casa o padrão da nota
(`*(Errata <id> · demanda NNN: …)*`); linha nova livre; removida/movida/dois
trechos ⇒ FAIL com nome; sem escrita na árvore (R7 §3). O script vive em bloco
fenced no `tasks.md` com o `git hash-object` declarado; o executor copia para
tmp. Tabela "caso → saída → exit" medida no scratchpad entra na seção. Vale para
qualquer "prova de aditividade/identidade" em doc, JSON de mapa ou matriz: nunca
grep sobre o diff, sempre comparação de conteúdo com a forma do acréscimo.
Ver [[prova-de-carga-de-excecao-e-piso]] e [[observacao-sem-id-nunca]].

**Segundo tropeço da mesma família (017, Fase 6, 2026-09-08):** "linha removida
é substring da adicionada" também **não** serve — nota inserida **no meio** da
célula (antes de "; (ii)" numa linha de 765 chars, offset 361) acusa órfã falsa.
O critério mínimo correto é *uma inserção contígua*: prefixo comum + sufixo
comum ≥ `len(removida)`; aceita nota no início, meio ou fim e recusa qualquer
byte apagado (testado contra "palavra apagada no meio + nota anexada"). O molde
`difflib` acima continua sendo o completo; este é o atalho quando o diff é
pequeno e se conhece a forma da nota.
