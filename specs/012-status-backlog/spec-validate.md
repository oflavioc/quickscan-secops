# Spec-validate — 012-status-backlog

> Fase 6 (T007) · executor: `qa-engineer` · somente leitura · 2026-08-28.
> Valida a [spec.md](spec.md) aprovada (`1c06644`) contra a implementação REAL
> (source + execução de gate — R2), no HEAD `c3c6e55` (green + repin R4).
> Cobertura adicional PO-1…PO-4b conforme [plan.md](plan.md) §Cobertura.

## Método

Cada exigência verificável da spec conferida por leitura do source
(`.claude/verify/compliance-audit.sh`, `.claude/BACKLOG.md`) e por execução
(`--rule=backlog` real; cenários adversariais e campanha de mutantes em
worktrees efêmeras — evidência primária na
[matriz-gate-mutante.md](matriz-gate-mutante.md)); diffs por `git show`/
`git diff` contra o merge-base `84bf56c` (origin/develop).

## Itens — veredito um a um

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **T1** forma literal da linha: ``**Status**: `estado` ``, negrito fechado, dois-pontos fora, valor em crase, sem ponto, minúsculas case-sensitive, sem espaço à direita | bytes reais da linha 85 do `BACKLOG.md`: `'**Status**: \`aberto\`'` — `re.fullmatch` da canônica = True; `Aberto`/ponto final reprovados em execução (BS-2b) | **conforme** |
| 2 | **T2** posição = primeira linha não vazia após o heading, **asserida** | source (índice `primeira` × `cand`); PO-4a executado: canônica deslocada → FAIL de posição, exit 1 | **conforme** |
| 3 | **T3** regexes exatas (heading com `~~` e sufixo de letra; candidata `^\*\*Status`; canônica via `fullmatch`; split só de `\n`, espaço à direita reprova) | source: `RE_HEAD`/`RE_CAND`/`RE_CANON` byte-idênticos à spec; leitura com `newline=""` + `split("\n")`; heading riscado aceito em execução (PO-3) | **conforme** |
| 4 | **T4** bloco = heading de achado até próximo `^## ` ou EOF; `###` não fecha; seções do cabeçalho fora de bloco | source (loop de blocos); EA-1 real usa `###` internamente e parseia como 1 bloco; SONDA-T6ii prova cabeçalho fora de bloco | **conforme** |
| 5 | **T5** semântica fechada: exatamente 1 candidata, na posição, canônica; FAILs (a)/(b)/(c) nomeando id e causa; arquivo ausente = FAIL sem ramo gracioso | BS-2(a)(b)(c)(d) executados — 4 reprovas nomeadas, exit 1 cada; textos idênticos aos normativos do plan §PO-4b (conferência literal source×plan) | **conforme** |
| 6 | **T6** auto-exclusão em 3 camadas (path literal · escopo de bloco · exemplos indentados) | source: path literal único; M-BS4 (exemplo copiado para o bloco → FAIL duplicata) + SONDA-T6ii (exemplos em coluna 0 no cabeçalho → sem candidata fantasma) + SONDA-T6iii (heading-exemplo em coluna 0 → reprovado, não silenciado) — as 3 camadas provadas executáveis | **conforme** |
| 7 | **T7** migração mínima: linha 52 única alterada no bloco EA-1; resto byte-intacto; diff total = linha + rito | `git show ebceb70 --stat`: 34 inserções (rito, cabeçalho) + **1 linha alterada** (`-**Status: aberto.**` → ``+**Status**: `aberto` ``) — nada mais no bloco | **conforme** |
| 8 | **T8** red natural sem fixture e sem tocar `BACKLOG.md`; FAIL executado, registrado e commitado; adversariais em efêmera; `run.sh --light` verde | red commitado em `13f4bb4` (só o script; `BACKLOG.md` intocado — porcelain conferido); FAIL literal registrado; efêmeras R7 §3. **Observação de processo** (não é gap): o vermelho do CI no commit intermediário não se materializou porque a branch só foi empurrada pós-green — a prova canônica do red é o commit + saída registrada (R3 §4 cumprida); o PR deve referenciar `13f4bb4` nominalmente (R14) | **conforme** (com observação) |
| 9 | **T9** saída: `ok` com lista indentada de abertos / `ok "achados abertos: nenhum"` / `falha` única agregada; só abertos listam; enumeração linha 7 + `--rule` via `secao()`; exit = contagem de FAIL; total PASS +1; `expected_suites.json` intocado | execuções: árvore migrada `[PASS] achados abertos (1)` + `EA-1 — …` (exit 0, filtrado = 1 PASS); PO-3 exercitou o ramo "nenhum"; red = `falha` única; linha 7 = `…, waivers, backlog`; audit completo 13 PASS (12+1); `expected_suites.json` fora do diff da demanda | **conforme** |
| 10 | **Gramática normativa** (4 estados, eventos do rito, refutado com status limpo, transferido com ponteiro) | rito instalado no cabeçalho (linhas 48–79) com os 5 itens: gramática, vocabulário, eventos, prefixo reservado, disciplina de exemplos; 4 estados com aceitação provada (green `aberto` + PO-1 `resolvido` + PO-2 `transferido` + PO-3 `refutado`) | **conforme** |
| 11 | **BS-1** seção existe, enumerada, lista abertos com `ok`; 7 seções irmãs com comportamento idêntico | execução completa e filtrada (acima); 12 linhas das irmãs **byte-idênticas** ao baseline pré-012 (diff vazio) | **conforme** |
| 12 | **BS-2** 4 violações reprovam nomeadamente + contraprova do refutado verde | 14/14 cenários conformes (T002, reconfirmados na campanha T006) | **conforme** |
| 13 | **BS-3** red commitado + green com diff de 1 linha no bloco | `13f4bb4` (red) · `ebceb70` (green, item 7); M-BS3 prova o red reprodutível | **conforme** |
| 14 | **BS-4** rito no cabeçalho com auto-exclusão executável; audit exit 0 com exemplos literais presentes | audit completo exit 0 com os 4 exemplos instalados; revisão dos 5 itens do rito (item 10); M-BS4 + sondas (item 6) | **conforme** |
| 15 | **BS-5** identidade coerente: `gen_pins.py` no mesmo PR cobrindo os 4 alvos; 0 divergência · 0 sem pin | parcial provado: repins R1–R4 executados commit a commit; stage `baseline` PASS (199/199 · 0 · 0) no HEAD atual. **Pendente nomeado**: repin R5 (artefatos finais desta wave) é a T010, no mesmo PR — não computado como gap (agendamento do tasks.md, não ausência) | **conforme-pendente (T010)** |
| 16 | **PO-1/PO-2** `resolvido`/`transferido` aceitos e não listados | executados: exit 0, `achados abertos: nenhum` | **conforme** |
| 17 | **PO-3** ramo "nenhum aberto" com saída asserida | executado: `[PASS] achados abertos: nenhum` literal | **conforme** |
| 18 | **PO-4a** canônica deslocada reprova posição | executado: FAIL (a) nomeando EA-1, exit 1 | **conforme** |
| 19 | **PO-4b** mensagens normativas idênticas às do plan; (b) e (c) ensinam o prefixo reservado | conferência literal source×plan §Mensagens + asserção executada (vocabulário e "reservada à gramática" presentes) | **conforme** |
| 20 | **Contratos**: audit único leitor (só leitura), dono do dado = `doc-writer`, nenhum consumidor novo, `CONTEXT.md` sem mudança pós-Fase 0 | grep: nenhum outro leitor da gramática; audit não escreve; diff da demanda: `CONTEXT.md` só na Fase 0 (glossário) + pin | **conforme** |
| 21 | **"Não mudam"**: `expected_suites.json`, `invariants.json`, `boundary.json`, `known_issues.json`, `pipeline.yaml`/`run.sh`, `verify.yml`, bytes de produto, suítes | `git diff --name-only 84bf56c..HEAD`: **nenhum** desses arquivos no diff — só os 9 previstos (spec §Arquivos + planning-state, excluído de pins por design) | **conforme** |
| 22 | **Fora de escopo respeitado**: correção do EA-1 não tocada (~110 linhas intactas); sem prazo/fail-by-age; sem unicidade de id; sem segundo leitor | item 7 (diff mínimo); source sem checagem de prazo/unicidade — conjunto de falhas fechado em (a)/(b)/(c)/arquivo | **conforme** |

## Score

**22/22 itens conformes — 100%** (item 15 conforme no que é verificável nesta
wave, com pendência **nomeada e agendada** — repin R5/T010; item 8 com
observação de processo registrada, sem gap de implementação). Nenhum gap nas
classes spec-errada / implementação-divergente / faltando. **Zero iterações de
correção necessárias.**

## Pipeline completo (execução desta validação)

- `run.sh` (14 stages): **13 PASS · 1 FAIL** — o FAIL é o stage `mutation`,
  pré-condição de árvore limpa (`check_mutation.py:40-44`, porcelain inclui
  `??`) disparada pela **matriz não rastreada** (decisão de desenho da T006:
  commit só na T010, preservando a previsão de 5 repins). Causa isolada por
  execução: no mesmo HEAD em worktree efêmera limpa, `mutation` = **0
  campanhas exigidas · 0 problemas · exit 0** (nenhum alvo do
  `mutation_map.json` mudou nesta demanda). Relatado como informação de
  desenho, não contornado; aprendizado candidato para a política de repins
  de futuras demandas (artefato-que-espera-fechamento × pré-condição de
  árvore limpa).
- `compliance-audit.sh`: **13 PASS · 0 FAIL** (8 seções), EA-1 listado.
- Stage `baseline` isolado: **PASS** — 199/199 · 0 divergentes · 0 sem pin.
- Campanha de mutantes: **6/6 mortos + 2/2 sondas** (matriz).
- CI (plataforma canônica Linux, `verify.yml`, run `33219366036` via
  `workflow_dispatch` no head `c3c6e55` — push de `feature/*` não dispara o
  workflow, gatilhos são PR/push→develop/main): job `verify` **success** —
  pipeline **14 PASS · 0 FAIL** (árvore limpa no CI: a matriz não rastreada
  não viaja no push, terceira confirmação do isolamento da causa local do
  stage `mutation`) e compliance **13 PASS · 0 FAIL** com
  `[PASS] achados abertos (1)` — primeira execução da seção `backlog` em
  Linux. Job `visual`: **skipped** neste dispatch (input `visual` default;
  roda em PR/push a develop — KI-3), pendente nomeado para o PR.
