---
name: doc-only-em-suite-pinada
description: fix-finding de comentário em suíte pinada (EA-40, 2026-09-05) — as três provas de que a edição é doc-only (censo de leitores do texto, byte-prova fora do bloco, contagem antes E depois), o controle pré-edição que separa o vermelho alheio do seu, a gramática que o compliance-audit impõe à linha de status do BACKLOG, e marcador+fill para nunca gravar número antes de medir
metadata:
  type: project
---

Rito executado em 2026-09-05 (fix-finding EA-40, worktree `phase5-014`): o
cabeçalho de `FROZEN_VISUAL_AUTHORITY` em `tests_p50_core.js` atribuía a lista
inteira à §29.4 da REV B, que não nomeia `playwright.config.js`. Erro de
justificativa, não de lista — a correção é só de comentário, em suíte pinada
por `pins.json` (não por boundary/deny/hook). O que vale reter:

**"É só comentário" se prova, não se afirma — três provas, nesta ordem:**

1. *Censo de leitores do texto*: quem poderia ler o cabeçalho como dado?
   `grep -rln` das frases do bloco (só o próprio arquivo respondeu); os campos
   `arquivo`/`ancora` de `mutation-matrix.json` (22, nenhum na suíte — os
   `gate:` que citam `tests_p50_core.js` são rótulo, não alvo); o
   `compliance-audit.sh` (varre só `.claude/hooks|verify`); e o auto-pin
   (`grep '"tests_p50_core.js"' tests_p50_core.js` → nada). Sem esse censo,
   uma âncora de preflight dentro do comentário viraria NÃO EXECUTADO na
   campanha seguinte, e ninguém saberia por quê.
2. *Byte-prova fora do bloco*: no script de edição,
   `src.replace(OLD, b"") == new.replace(NEW, b"")` — fora do `/* … */`
   nenhum byte difere. Mais: as 6 entradas/hashes contadas `== 1` antes e
   depois, e a trilha vizinha (repin do EA-38) comparada byte a byte, porque a
   ordem de despacho mandou "não a apague".
3. *Contagem antes E depois*: `node tests_p50_core.js` 64/0 nos dois lados, e
   o stage `suites` (lê o disco) como instrumento canônico. O `--light` não
   prova contagem nenhuma (pula `suites`); serve para o resto.

**Controle pré-edição separa o vermelho alheio do seu.** O `baseline` já
estava vermelho ANTES de eu tocar qualquer coisa: o cherry-pick que abriu o
achado (`b534fad`) mudou `.claude/BACKLOG.md` sem `gen_pins.py`
(`HEAD~1` = registry, `HEAD` ≠). Medido antes, foi declarado como "nasce do
cherry-pick, idêntico no controle"; medido só depois, pareceria efeito meu.
Regra: `check_baseline.py` e a suíte alvo rodam antes da primeira edição.

**Gramática do BACKLOG (compliance-audit, seção `backlog`, spec 012):** a
linha `**Status**: \`aberto|resolvido|refutado|transferido\`` tem de ser a
PRIMEIRA linha não vazia após o heading `## EA-NN`, fullmatch (nada depois da
crase, nem espaço à direita); qualquer OUTRA linha do bloco começando com
`**Status` reprova como duplicada; `###` não fecha o bloco, só o próximo `##`.
Logo o fecho vai como `### Fecho (data)` aditivo ao fim do bloco, e a prosa
nunca começa linha com `**Status`.

**Marcador + fill, nunca número antes de medir.** O fecho cita o próprio
`compliance-audit` e o `check_suites.py` — que só existem DEPOIS de o fecho
estar escrito (o audit lê o BACKLOG). Saída: escrever a seção com `__AUDIT2__`
/`__SUITES__`, medir, `fill.py` (assert `count == 1`, LF, NULs inalterados),
medir de novo e reportar a última. Ver [[numero-esperado-diferente-do-medido]].

**Why:** R2 §1/§4 — um comentário em gate parece inofensivo, mas a suíte é
pinada, os mutantes ancoram em texto e o BACKLOG é parseado; cada uma dessas
três coisas já quebrou um PR desta base por edição "só de doc".

**How to apply:** em qualquer fix-finding doc-only sobre `tests_*.js` ou
`BACKLOG.md`: censo de leitores → controle pré-edição → edição por script com
byte-prova → contagem depois → fecho com marcadores → fill → medição final.
O `grep` sem `-a` diz "Binary file" no BACKLOG (2 NUL literais na linha 2029,
commit `5729961`): use `grep -a`. Ver [[repin-inline-tres-confirmacoes]],
[[agentes-paralelos-na-mesma-worktree]], [[trilha-e-ambiente-quickscan]].
