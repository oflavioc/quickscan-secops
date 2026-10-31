---
name: simulacao-de-merge-em-clone-efemero
description: Gate de processo que julga origin/develop (016) se prova SEM PR e SEM CI — no clone do scratchpad, `merge --no-ff -m "Merge pull request #99 from owner/branch"` + `update-ref refs/remotes/origin/develop` produz o EA-33 real com os leitores reais; a variante de mensagem manual dá C1(b)+C2(c); merge commit "solto" continua endereçável por SHA depois do reset
metadata:
  type: feedback
---

Para responder "o verde por vácuo é EA-20?" com execução, não basta a sonda
(julgador puro) nem os mutantes de árvore (que só mexem no registro e no
planning-state): é preciso o **leitor real** lendo uma **cadeia real** em que o
estado proibido existe. Sem PR e sem CI isso se fabrica em minutos no clone
efêmero ([[clone-efemero-para-refs-remotas]]), na Fase 6 da 016 (2026-09-04):

```
git checkout -q -b devsim <piso>
git -c user.name=qa -c user.email=qa@local merge -q --no-ff \
   -m "Merge pull request #99 from oflavioc/feature/016-…" feature/016-…
git update-ref refs/remotes/origin/develop $(git rev-parse HEAD); git checkout -q feature/016-…
python .claude/verify/check_fecho.py      # 016: MESCLADA SEM FECHO (fase implement) · mensagem #99 · exit 1
```

Depois, no mesmo mundo: `phase: done` sem artefatos ⇒ `[artefato-ausente]`;
com os dois arquivos (vazios) ⇒ `CONFORME · #99` e `--pr` ⇒ `LIBERADO` (o flip
de T084 antes de acontecer); válvula com `prazo == %cI` ⇒ `FECHO PENDENTE
DECLARADO`, `2026-01-01` ⇒ vencida, `done`+válvula ⇒ obsoleta. A variante
`-m "merge manual da 016 sem PR"` faz a mensagem calar: a 016 sai por
**ancestralidade `d1ae3c76af73`** e o merge sai `FORA DA POPULAÇÃO
[merge-fora-de-pr]` — C1(b) e C2(c) ao vivo, 2 problemas. O merge `#99`
(7ffba2b) continuou endereçável por SHA depois de `reset --hard` do `devsim`
(objeto solto, sem gc), então dá para voltar a ele com `update-ref` sem
recriar.

**Why:** a árvore de hoje tem 0 merges após o piso — tudo que o gate nu diz
sobre FEC1/FEC2 é vácuo declarado. A prova de que o mecanismo inteiro
(leitor + julgador + relato + exit) reprova o EA-33 só existe num mundo onde o
EA-33 existe, e esse mundo não pode ser a worktree nem o remoto.

**How to apply:** toda validação de gate que lê `refs/remotes/*` ou histórico
ganha um cenário "o estado proibido existe de verdade", fabricado no clone com
commit de merge no formato que o oráculo primário espera E no formato que o
faz calar. Cite o SHA simulado e a linha inteira do gate. Ver
[[leitor-mudo-sobrevive-ao-gate-nu]] para o que esse mundo NÃO prova.
