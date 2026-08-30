---
name: sonda-de-fiacao-sem-chromium
description: Como executar o laço de campanha do check_mutation.py sem Chromium — harness sintético que responde a C1 — para não entregar fiação que nunca rodou
metadata:
  type: project
---

Sonda em processo mede a **função**; ela não faz o **laço** executar. No green do
`IC-9` (013, 2026-08-30) a fiação nova — a chamada a `mut_perdao` dentro do laço
de trigger — não rodava **nenhuma vez** localmente: os três harnesses de campanha
exigem `chromium`, que esta máquina não tem, e todos caem em `[DEFER]`. Entregar
código de veredito que nunca executou é o `PASS` que a R2 manda desconfiar.

## O truque: registrar um harness sintético que responde a C1

Na worktree **efêmera**, adicionar um harness ao `mutation_map.json` que:

- tem `requires: ["node"]` (sem `chromium`) e `targets` apontando para um arquivo
  que **de fato mudou** desde a base, senão o laço nem o considera (`due`);
- tem `preflight: true` e responde a `--preflight` com o objeto C1 completo
  (`harness`, `arquivo`, `interpretador{nome,origem,resolvido}`, `arquivos_mutados`,
  `mutantes[]`) — com isso `ex_ids_do_harness` usa o oráculo bom e `IC-9.2` fica
  verde em vez de virar ruído;
- sem o flag, imprime blocos no formato que `mut_ler` casa: estado + **dois**
  espaços + id + ` · ` + desc, e a linha de gate com **exatamente 14** espaços.

Fechando o par no `mutation-matrix.json` e a entrada no `known_issues.json`, o
stage roda limpo e o laço executa de verdade. `IC-5`/`IC-6` são nominais à `p51` e
não reclamam do harness novo; sem `preflight` ele cairia em `[DÍVIDA]`, como o `core`.

## O que só a fiação prova, e a sonda em processo não

Três modos do harness sintético dão três provas que nenhuma sonda em processo dá:

| Modo | Campanha | Sem a fiação | Com a fiação |
|---|---|---|---|
| nomeado SOBREVIVENTE | exit 1 | 1 problema | **0** — perdão impresso |
| nomeado voltou a DETECTADO | exit **0** | 0 problemas | **1** — `EXCEÇÃO OBSOLETA` |
| sobrevivente novo ao lado | exit 1 | 1 problema | 1 — e o vizinho nomeado |

A linha do meio é a que importa: **campanha verde reprovada** porque a exceção
perdeu a razão. É a metade da cláusula ⚠️ que `IC-9.3` (registro) não cobre e que
só existe se alguém tiver ligado o mecanismo ao laço.

**Why:** sem esta sonda, o green do IC-9 teria sido entregue com o bloco de fiação
literalmente nunca executado — e o único sinal seria no job `visual`, dias depois.

**How to apply:** sempre que o green tocar o laço de campanha e o ambiente não
tiver Chromium, monte o harness sintético na efêmera antes de declarar green.
Tudo morre com a efêmera (`git worktree remove --force`); nada volta para a árvore
real. Ver [[medir-red-do-proprio-julgador]] para o rito da efêmera e
[[excecao-que-morre-com-a-razao]] para o desenho que esta sonda fecha.
