---
name: prova-de-carga-da-excecao
description: Três sondas baratas, sem Chromium, para revalidar a 014 — retirar a exclusão achado-aberto derruba C2(zero) E C3(*); o log da campanha d014 trunca a alínea do kill (reproduza à mão pelo find/repl do preflight); a KI-4 histórica volta por `git show 8b5be3e:` em commit efêmero e IC-9.2 a mata
metadata:
  type: project
---

Revalidar a varredura de regra morta (014) sem navegador cabe em três sondas de
segundos, cada uma com um colateral que precisa ser dito para não parecer erro:

1. **"A exceção é carga"** — retirar `exclusoes[2]` (`p52/P52-RA8`,
   `achado-aberto`) de `regra_morta.json` e rodar `node tests_014_regra_morta.js`
   dá **5 PASS · 2 FAIL**: `C2(zero) = (1, 21) · mortas: p52/P52-RA8` (a prova
   de carga) **e** `C3(*)` — o conjunto de exclusões é **lista fechada nas duas
   direções** ("não gaveta"), então tirar uma também reprova. Reporte as duas;
   a que prova a carga é a de `C2(zero)`.
2. **O kill de `D014-M4` não é citável do log da campanha** — o bloco `FAIL`
   que `tests_014_mutants.js` ecoa é truncado antes da linha da alínea. Para
   citar `mortas: p51/M51-08` e provar a censo-neutralidade (E10), aplique o
   `find`/`repl` lido do próprio `--preflight` em `ui_p50_v32.css` (1
   ocorrência), rode a suíte (3 s) e `git checkout --`: `FAIL D014-VARR1` com
   **1 alínea** e `D014-CEN1` **PASS** sob a mutação.
3. **Carrasco de C7 (`IC-9.2`)** — `git show 8b5be3e:.claude/verify/known_issues.json`
   devolve a `KI-4` histórica; `check_mutation.py` recusa árvore suja, então
   **commit efêmero** na worktree descartável, rodar, `git reset --hard HEAD~1`.
   Saída: `[FAIL] IC-9: known_issues/KI-4 · o harness p51 não declara o mutante
   'M51-01' [oráculo: preflight (C1)] — a exceção nomeia um fantasma`. A outra
   direção do juiz (exceção removida + sobrevivente sem perdão) só fecha no
   job `visual` (`p51` 19/19 sem `[EXCEÇÃO]`).

**Why:** na T082 esses kills foram "reproduzidos" e ficaram só na mensagem do
commit; sem artefato, o spec-validate retroativo teve de refazê-los — e o log
truncado teria deixado o kill de M4 sem linha citável.

**How to apply:** toda revalidação da 014 (ou de demanda com exceção nominal
de motivo `achado-aberto`) roda as três na efêmera antes de escrever o score;
o par (mortas, indecidíveis) de hoje sai pela API (`varrerArvore`) num script
do scratchpad, não pela suíte, que não o imprime quando passa. Ver
[[verde-com-excecao-impressa]] e [[mutante-de-arvore-sob-censo-pinado]].
