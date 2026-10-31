---
name: janela-vermelha-decidida-no-plano
description: Gate que nasce vermelho e fecha por migração de dado/emissor em vários arquivos — o plan.md decide a janela vermelha (inevitável? onde vive? ordem que a encurta), com tabela commit → veredito esperado medida por protótipo dos estados intermediários
metadata:
  type: feedback
---

**Quando um gate novo nasce vermelho na árvore real e o green vem de mudanças em
outros arquivos (dado + emissores), o plano decide a janela vermelha — nunca a
deixa para a Fase 5.** Quatro coisas, nesta ordem: (1) se ela é inevitável (é,
sempre que o red tem de ser commitado antes da implementação — R3 §4; fazer o
dado antes do gate é red só em cópia, inauditável); (2) **onde ela vive** — só
na branch (merge é a unidade; `develop` nunca a tem como HEAD), invisível ao
hook Stop (`run.sh --light` não roda stage `heavy`) e ao CI (verify.yml só em
`pull_request`/`push` para develop/main; abrir o PR **depois** do green quando
nada precisa de red ao vivo); (3) a **ordem da wave verde** que minimiza
harnesses vermelhos por commit; (4) uma **tabela commit → veredito esperado**,
com os números.

**Why:** pedido literal do orquestrador na Fase 2 da 017 (2026-09-06): "Não
quero uma janela descoberta por acidente na Fase 5." A spec tinha nomeado o
risco e devolvido a decisão em DEPENDÊNCIAS; ele mandou decidir no plano.

**Dois buracos que a 025 (Fase 3, 2026-10-27) achou na tabela do plano — confira
sempre antes de escrever a coluna de cada stage:** (1) `check_suites.py:50-56`
reprova **qualquer `tests_*.js` fora de `expected_suites`/`mutation_map`/known_issues**
— a suíte nova commitada no red deixa o stage `suites` **vermelho, nomeado,** até a
wave de registro (rito da d019 W1–W7; spec 019 E2 recusou a exceção nominal de
propósito); o stage é `heavy`, logo invisível ao hook Stop, mas visível ao `run.sh`
completo e ao CI. "d025 não registrada → não roda" é falso. (2) Harness alheio que
mata por **regex de contagem** (`tests_core_mutants.js:59`, CM1: `/1 FAIL/` sobre a
m48 inteira) reporta **falso SOBREVIVENTE** enquanto a suíte-alvo tiver FAIL próprio
na janela — na 025, entre a wave que dispara `core` (ui_session) e a que fecha a m48
(ui_ux). Declare o intervalo em que a campanha não se mede (ou se mede e se declara)
e exija `reason` nominal (`/FAIL {2}<gate>/`) no harness da demanda. Também: alínea
que lê artefato de outra wave (INV8(d) ← exemplo-completo.json da W7) adia o green do
gate inteiro — a coluna da suíte nova conta **por gate**, não por alínea.

**How to apply:** rode um **protótipo descartável do predicado do gate** sobre a
árvore real em cada estado intermediário possível (na 017: hoje · só dado · só
forma · ambos). Na 017 isso decidiu a ordem — migrar o dado (`insumos`) primeiro
deixava 2 harnesses vermelhos; migrar a forma primeiro deixava 7 — e mostrou que
um diagnóstico do gate era observável na árvore real, não só em cópia. O
protótipo nunca vira o gate (R3 §2): o QA escreve o dele a partir da spec.
Declare também o **custo residual** da janela (harness editado entra no diff e
re-executa a campanha em toda medição posterior). Ver
[[medir-gatilho-de-campanha-no-plano]] e [[repin-e-sempre-commit-separado]].
