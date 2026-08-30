---
name: project-013-sonda-de-fiacao
description: Green de fiação no stage mutation exige sonda com harness sintético em worktree efêmera — a sonda em processo do gate não alcança mutantes de fiação (M-IC29/M-IC31)
metadata:
  type: project
---

No `check_mutation.py` há duas classes de asserção e só uma delas mede fiação. As
sondas **em processo** (IC-2, IC-9.4, IC-10.3) chamam a função diretamente com
dados sintéticos: elas medem a FUNÇÃO, nunca o LAÇO. Um mutante que deixa a função
impecável e estraga a chamada — guarda correta que o laço nunca consome, ou
oráculo alimentado com a própria leitura (`esperados = len(blocos)`) — **passa pelo
gate verde**. Medido em 2026-08-30 no green do IC-10: com M-IC29 e com M-IC31 o
bloco fecha `0 problema(s)` e a campanha truncada volta a `exit 0`.

**Why:** é o limite estrutural que a casa resolve nomeando o job onde o mutante
morre, em vez de fingir cobertura. Declarar green sem sonda de fiação seria
declarar o que não se mediu (R2 §1).

**How to apply:** antes de declarar green de qualquer mudança no LAÇO de
`check_mutation.py`, montar um harness sintético na worktree efêmera (rito de
[[project-013-rito-de-medicao]]) e fazer o laço rodar de verdade. A receita, que
passa por IC-1/IC-4/IC-9 sem poluir a contagem:

1. `tests_<sonda>_mutants.js` que responde a `--preflight` com o objeto de C1
   (`harness`, `arquivo`, `interpretador{nome,origem,resolvido}`, `arquivos_mutados`,
   `mutantes[{id,estado:"ok",ocorrencias:1}]`) e sai 0; sem o flag, emite blocos no
   formato fechado `<ESTADO>␣␣<id>␣·␣<desc>` + 14 espaços + `gate esperado: <gate>`.
   Modo por env (`SONDA_MODO`), nunca por `cmd` — prefixo POSIX no `cmd` reprova IC-1.
2. `mutation_map.json`: entrada com `preflight: true`, `requires: ["node"]` e
   `targets` contendo um arquivo que de fato mudou contra a base (ex.: o próprio
   `.claude/verify/check_mutation.py`), senão a campanha não é exigida.
3. Perdão em jogo? A entrada sintética em `known_issues.json` precisa de par
   correspondente em `mutation-matrix.json` com `ultima_prova.resultado != KILL`,
   `classificacao` do vocabulário fechado e `registro` que resolva no disco —
   senão IC-9.2/9.3 reprovam e sujam a leitura.
4. Três modos no mínimo: leitura completa · truncada · sobrevivente novo. Depois,
   aplicar os mutantes de fiação e confirmar que a SONDA os mata mesmo quando o
   gate não os mata.

`node_modules` e Chromium não fazem falta: a sonda é um `.js` de 30 linhas que não
importa nada. É o único jeito de medir o laço nesta máquina.
