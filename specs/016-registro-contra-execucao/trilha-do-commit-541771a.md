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

---

## Segunda ocorrência — `d130a04`, e por que isso muda a conclusão

O commit **`d130a04`** (`doc(016): errata E4 — citação trocada entre E5 e EA-5`)
carrega **também**: o schema do planning-state (**G1**, `data-engineer`),
`design-decisions.md` e o ADR 0001 (**G2**, `doc-writer`), e o `spec-validate.md`
que estava não rastreado.

Mesma causa, mesmo turno de trabalho, **quatro horas depois** de o erro anterior
ter sido registrado neste arquivo: `git add -A` numa worktree onde agentes
escrevem em paralelo.

### O que isso ensina, e é mais do que o primeiro caso

Uma ocorrência é deslize. **Duas, depois de a primeira ter sido escrita e
commitada, é processo defeituoso** — e o defeito não é a falta de atenção: é o
comando. `git add -A` numa worktree compartilhada **não pode** ser usado com
segurança, porque o orquestrador não controla o instante em que cada agente
grava. Registrar o erro não o impede; só a mudança de comando impede.

**Regra operacional que passa a valer**: enquanto houver delegação ativa na
worktree, o orquestrador commita **por caminho nominal**, nunca com `-A`. O `-A`
volta a ser seguro só quando nenhum agente está em voo — e o `gen_pins.py`, que
exige árvore limpa, já é o sinal natural desse momento.

### Por que, de novo, o histórico não foi reescrito

As mesmas razões do primeiro caso, mais uma: a segunda ocorrência **é a
evidência** de que registrar não bastava. Apagá-la deixaria só a primeira, e a
primeira sozinha lê como acidente. As duas juntas leem como o que são — e é
por isso que a regra acima existe.

O paralelo com o produto é exato: a demanda 014 mostrou que **gate que promete e
não mede** cria falsa segurança. Um registro de erro que não muda o
comportamento é a mesma coisa, aplicada a processo.
