---
name: hooks-rodam-do-project-dir
description: Hooks são invocados de $CLAUDE_PROJECT_DIR (a pasta primária da sessão), não da worktree onde me mandaram trabalhar — e instrumentá-los lá é negado como Self-Modification
metadata:
  type: project
---

Os hooks do `settings.json` rodam `bash "$CLAUDE_PROJECT_DIR"/.claude/hooks/<x>.sh`,
e `$CLAUDE_PROJECT_DIR` é a **pasta primária da sessão** — não a worktree que o
orquestrador me mandou usar. Numa sessão cujo diretório primário é `phase5-009`,
trabalhando em `phase5-r11`: o script executado é o de `phase5-009`, o
`project_root()` do hook resolve para `phase5-009`, e o `settings.json` carregado
é o **daquele branch** (que pode registrar um conjunto diferente de hooks — medido:
009 não registrava o `guard-add`, r11 sim).

Consequências que já mudaram desenho:
- editar o guarda na minha worktree **não** instrumenta a minha própria sessão;
- um guarda que inspeciona o índice via `project_root()` é **cego para commits
  feitos em outra worktree** — ele mede o repositório da pasta primária;
- copiar o guarda instrumentado para a pasta primária para medir é **negado pelo
  classificador de permissão como `[Self-Modification]`** (tentei em 2026-10-10,
  achado EA-83; não se contorna). Logo: medição de despacho de hook **não é
  autoexecutável por um subagente** — ela depende de o proprietário rodar o
  protocolo numa sessão nova.

**Why:** o EA-83 pedia prova POSITIVA de que o harness despacha o grupo
`PreToolUse`/matcher `Bash`; descobri que nem a instrumentação nem a leitura do
rastro ficam no meu alcance quando a worktree ≠ pasta primária.

**How to apply:** ao desenhar instrumento de hook, (a) assuma que o rastro vai
aparecer na pasta primária, não na worktree; (b) escreva o protocolo de leitura
para o proprietário (apagar o rastro → sessão nova → qualquer chamada → ler) e
diga no relatório que a medição ficou com ele; (c) se o guarda usa
`project_root()`, declare a cegueira entre worktrees. Ver
[[instrumento-prova-despacho-nao-enforcement]].
