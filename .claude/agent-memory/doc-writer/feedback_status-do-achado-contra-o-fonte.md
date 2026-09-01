---
name: status-do-achado-contra-o-fonte
description: Antes de transcrever um achado devolvido por outra demanda, conferir o fonte/commits — relatório final mesclado pode listar como aberto o que a própria demanda corrigiu antes de fechar
metadata:
  type: feedback
---

Achado devolvido por uma demanda **não** entra no `.claude/BACKLOG.md` pelo texto
do relatório: antes de escrever o status, ler o **fonte de hoje** e o `git log` do
arquivo. Se a correção existir, o registro vira **histórico com a correção
citada** (`resolvido`, com commit e linhas), nunca pendência — e a divergência
com o relatório fica escrita na própria entrada, não silenciada.

**Why:** na 010 dois ids reservados como `aberto` no `relatorio-final.md` já
estavam fechados quando ele foi escrito: `EA-10` (as duas metades do recorte do
`P52-TGT4`) e `EA-11` (a guarda de não-vacuidade do `D010-INV7`, corrigida em
`cf6dd21`/T019, commit **ancestral** do que escreveu o relatório). Transcrever o
relatório teria criado pendência inexistente e mandado alguém desfazer correção
boa — o próprio gate avisa disso em comentário (`tests_p52_chromium.js:4061-4066`).

**How to apply:** para cada achado a registrar — `git log -S <símbolo> -- <arquivo>`
e leitura do trecho; `git merge-base --is-ancestor <fix> <commit do relatório>`
decide quem é mais novo. O limite continua: **eu não declaro PASS/FAIL** — a
entrada registra o fato citável em git/código e diz, nomeando, que a confirmação
por execução é do `qa-engineer`. Ver [[alocacao-ids-ea]].
