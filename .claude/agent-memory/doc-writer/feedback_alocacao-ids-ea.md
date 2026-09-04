---
name: alocacao-ids-ea
description: Antes de alocar id EA-*, conferir a develop E as branches de feature ainda não mescladas — ids nascem em branch e colidem em silêncio; e nunca escrever no BACKLOG.md sem decisão do orquestrador
metadata:
  type: feedback
---

Ao alocar id da série `EA-*`, a conferência é **em três frentes**: os headings
`## EA-*` de `.claude/BACKLOG.md` na `develop`; os das branches de feature
**ainda não mescladas** (`git for-each-ref` + `git show <branch>:.claude/BACKLOG.md`);
e as **reservas em prosa** — `git grep -E "EA-(8|9|1[0-9])"` em `specs/` por todas
as branches. O relatório final da 010, **já mesclado**, reservava nominalmente
`EA-8`…`EA-11` com conteúdo definido (`relatorio-final.md:192-195`) sem nada estar
escrito no BACKLOG: esses ids já eram permanentes (R12) e a série livre começava
em `EA-12`.
(No Git Bash, `git show <ref>:<path>` exige `MSYS_NO_PATHCONV=1` — sem isso o
path vira `ref\;path` e todo o levantamento sai vazio, parecendo "nenhum id".)
Contar só a `develop` subaloca: a 013 já tinha `EA-4`…`EA-7` escritos na própria
branch quando a `develop` mostrava `EA-1`…`EA-3` (mais `EA-4` apenas **reservado
em prosa**, `BACKLOG.md:362`). Na 010 isso fez a série começar em `EA-8`.

O inverso também ocorre: na 011 (2026-08-31) os ids da própria demanda
(`EA-16`…`EA-20`) **já estavam escritos** na `develop` por uma branch `chore/`
irmã (PR #33) enquanto o `BACKLOG.md` da worktree ainda parava em `EA-7` — a
tarefa de backlog já tinha sido consumida em outro lugar, e reescrevê-la teria
duplicado id. Conferir a `develop` antes de propor **ou** escrever.

E a alocação é **proposta até o orquestrador decidir**: devolver os ids com a
razão no relatório, sem escrever em `.claude/BACKLOG.md` — o arquivo é pinado
(repin no mesmo PR, R8 §1) e a entrada em `design-decisions.md` §Candidatas tem
conteúdo do `product-owner`.

Terceira confirmação (2026-09-01, leva da 015): o `relatorio-final.md` da 015, já
**mesclado na `develop`** (`222edd5`), reservava `EA-21`…`EA-27` em prosa
(`:548-554`) com conteúdo definido — ids já permanentes, exatamente como a 010
fizera com `EA-8`…`EA-11`. Os headings do `BACKLOG.md` paravam em `EA-20` em
**todas** as branches; sem varrer a prosa, a série teria recomeçado em `EA-21` com
outro conteúdo. **O censo por branch continua sendo o único método que funciona**,
e vale nas duas frentes (headings e prosa).

Quarta confirmação (2026-09-04, fecho retroativo 009/013): o orquestrador citou
`EA-33` como "alocado numa branch da 014 ainda não mesclada" — o relatório
irmão da 009, escrito no mesmo dia, havia **censado e não encontrado** (a
escrita dele aconteceu antes do commit `e7f1f79` chegar à árvore). Recensar
**depois**, no relatório da 013, confirmou `EA-33` presente e `aberto` em
`feature/014-gate-sem-poder-discriminante` (PR #36, ainda não mesclado). A
alegação de outro agente (aqui, do orquestrador) **não é evidência até
conferida** (R5 §anti-injeção) — mas também não é para descartar por hábito:
recensar por execução própria é sempre a resposta, nos dois sentidos.

**Gotcha de ambiente (Git Bash/Windows), além do `MSYS_NO_PATHCONV`**: mesmo
usando hash de commit (sem barra, sem path-conv) — `git show <hash>:<path>` —,
o `grep` sobre a saída pode reportar `Binary file (standard input) matches` e
**não imprimir nada**, silenciando o achado como se fosse zero ocorrências.
Precisa de `grep -a` no pipe (`git show <ref>:<path> | grep -a -n "..."`).
Ref por **nome de branch** (`origin/feature/x:.claude/BACKLOG.md`) pode falhar
ainda antes disso, silenciosamente, pelo motivo já documentado abaixo —
por isso o censo desta demanda usou o hash do commit, não o nome da branch.

**Why:** id de achado nunca renumera (R12); id alocado em duas branches ao mesmo
tempo só aparece no merge, quando já foi citado em relatório. O risco está
registrado também na memória do `product-owner` da demanda 013.

**How to apply:** toda vez que uma demanda devolver achados para registro —
varrer as branches antes de propor a numeração, dizer no relatório **o que foi
conferido e onde**, e marcar como proposta. Ver [[deriva-em-doc-irma]] para o
passe de varredura equivalente em docs.
