# Trilha — o commit `541771a` diz menos do que contém

> Registro de erro de processo do orquestrador, escrito em 2026-09-04.
> Não é achado de backlog: é trilha, para quem ler o histórico depois.

## O que aconteceu

O commit **`541771a`**, cuja mensagem é
`chore(014): fecha a pendência do termo no planning-state`, contém **duas** coisas:

| Arquivo | Linhas | O que é |
|---|---|---|
| `.claude/project-memory/planning-state/014-*.json` | 2 | o que a mensagem descreve |
| `.claude/verify/compliance-audit.sh` | **+159 / −11** | a **tarefa T042** da demanda 016 — a seção `branch-protection` inteira |

Viola a R14 (*1 microfase/errata = 1 commit próprio*) e a R12 (mensagem que
não descreve o conteúdo).

## A causa, sem atenuante

O orquestrador rodou `git add -A` na worktree `phase5-014` **enquanto o
`build-engineer` ainda escrevia** a T042 no mesmo diretório. O risco havia sido
identificado por ele mesmo poucos turnos antes — *"o `gen_pins` exige árvore
limpa, e `git add -A` varreria trabalho parcial"* — e ele fez exatamente isso
ao commitar um arquivo por caminho e depois um `-A` no turno seguinte.

## Por que o histórico NÃO foi reescrito

Precedente desta própria fase: quando o commit `de30308` ficou com um número
medido errado (667 contra 752), a resolução foi **registrar a correção**, não
reescrever — commit imutável continua dizendo o que dizia, e a correção vive ao
lado. Reescrever aqui apagaria a lição junto com o erro, e a lição é a parte
que serve para a próxima demanda.

Além disso, `git rebase -i` não está disponível neste ambiente, e a branch já
carrega o commit de red (`d1ae3c7`) referenciado pelo `planning-state` — cuja
imutabilidade a R3 §4 exige.

## O achado dentro do achado

A seção assim empacotada **estava quebrada**, e o defeito foi encontrado pelo
`build-engineer` ao testá-la — não ao lê-la:

```sh
printf '%s' "$JSON" | "$PYBIN" - <<'PY'   # ERRADO
```

O heredoc é o *programa* de `python -`; o pipe é o *stdin* do processo. Os dois
disputam o mesmo descritor e **o heredoc vence** — `sys.stdin.read()` chegava
vazio, e a seção reportava `[FAIL] JSONDecodeError` **incondicionalmente**.

Uma seção que sempre reprova pela mesma razão errada é o **oposto** do propósito
de `D016-PROT1`: ela nunca chegaria a classificar a proteção de branch. E teria
passado por verde-por-vermelho — ninguém desconfia de um gate que reprova quando
se espera que reprove.

Corrigido em `d7dbe58`, isolado: JSON por variável de ambiente em vez de pipe,
mais `sys.stdout.reconfigure(encoding="utf-8")` que faltava (acentos corrompidos
no Windows).

**A lição operacional**: gate novo que nasce vermelho tem de ser lido pela
**razão** do vermelho, não pela cor. Foi assim que o defeito apareceu — e é a
mesma disciplina que a demanda 014 nomeou ao provar que um mutante pode morrer
pelo motivo errado.
