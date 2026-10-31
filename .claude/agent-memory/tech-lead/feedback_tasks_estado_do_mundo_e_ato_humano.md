---
name: tasks-estado-do-mundo-e-ato-humano
description: Quatro exigências do orquestrador para o tasks.md (016 e 017) — estado do mundo que reprova cada gate com quem produz e quem mede; ato humano fora do repositório como tarefa nomeada; o que cada tarefa deixa medível (comando → linha); onde o spec-validate da Fase 6 vai olhar e o que já nasce defasado
metadata:
  type: feedback
---

Duas exigências do orquestrador na Fase 3 da 016 (2026-09-04), ambas para o
`tasks.md`, não para o plano:

1. **Para cada gate novo, a tarefa do mutante diz qual estado do mundo faria o
   gate reprovar, e a tarefa de validação exige que esse estado seja produzido
   e medido — não raciocinado.** Se algum gate não tiver esse estado, dizer no
   portão, não depois. Forma que atendeu: uma seção própria no `tasks.md`
   ("O estado do mundo que reprova cada gate") com colunas `gate · estado ·
   produzido em (Txxx) · medido em (Txxx)`; e os estados de árvore viram
   **mutantes de árvore no harness** (ids ≥ M<n+1>, mutação in-place com
   restauração por SHA, gate nu como oráculo), para que a prova de carga rode
   de novo a cada campanha em vez de viver só num relatório.
2. **Ato humano fora do repositório é tarefa nomeada**, com dono `usuário`, wave
   própria (nunca `[P]`), pré-condição (o contexto de CI precisa ter reportado
   antes) e o **texto exato** do que marcar no painel (nomes dos contextos,
   *require branches to be up to date*, ruleset × classic). "Uma tarefa que
   depende de ato humano fora do repositório tem de estar visível no plano de
   execução, não numa nota de rodapé."

**Why:** a 014 fechou tendo encontrado dentro de si a patologia que existia para
expor — aposentou um problema alegando que um par media a propriedade, e o CI
provou que não media; a causa foi raciocínio pinado sem execução. Gate sobre
**processo** é ainda mais fácil de escrever sem estado que o reprove (a árvore
está conforme por construção).

**How to apply:** ao tipar tarefas, pergunte por gate: "que mutação de árvore
(registro, planning-state, fixture) faz o gate nu reprovar com o nome certo, e
qual tarefa a executa?" Vácuo real (ex.: nenhuma válvula existe hoje) é
**declarado na tabela**, com a sonda como única fonte — nunca disfarçado. Ver
[[prova-de-carga-de-excecao-e-piso]], [[vacuidade-medida-antes-do-gate-nascer]]
e [[repin-e-sempre-commit-separado]].

**A árvore pode mudar DURANTE a delegação (025, Fase 3, 2026-10-27).** A branch foi
rebaseada pelo orquestrador (W0.2/W0.3 do plano: merge de #112/#113 pelo usuário +
rebase) enquanto eu lia; o brief dizia HEAD `e734810`, o HEAD real ao escrever era
`395942a`, `origin/develop` tinha movido e todos os SHAs da 025 mudaram. **How to
apply:** remeça HEAD, `origin/develop`, merge-base, `reflog -10` e `check_baseline`
**imediatamente antes de escrever o cabeçalho**, não só no início; tarefa de W0 já
executada entra como **"EXECUTADA antes deste artefato — registro, não pendência"**
com os SHAs e o que resta de conferência medível; os SHAs antigos citados por
spec/plano/planning-state entram em "o que já nasce defasado" com o mapa antigo→novo
(`git reflog` é a fonte). Repins previstos que a execução tornou vazios (R0b/R0′ sem
conflito de pins) fundem-se e vão declarados como granularidade, não desvio.

**Terceira e quarta exigências (017, Fase 3, 2026-09-06)**, ambas do orquestrador
para o `tasks.md`: (3) **o que cada tarefa deixa medível** — não "implementar X",
mas "ao fim desta tarefa, `<comando>` imprime `<linha>`", numa tabela por id
(permite verificar wave a wave em vez de descobrir no fim); (4) **onde o
`spec-validate` da Fase 6 vai olhar e o que já nasce defasado** — a 015 fechou
34/36 porque o `tasks.md` era anterior às erratas (item 36, "coerência spec ×
tasks"). Forma que atendeu: seção por critério (artefato + execução/leitura) e
lista (a)…(g) de divergências pré-declaradas com classe — dono de um pin movido
pelo plano (P2), linhas de `pins.json` instáveis por construção (conferir por
chave), endereços de `_trilha` que se movem após inserções, duas redações da mesma
linha na própria spec, âncora de regressão equivalente provada por diff vazio. No
mesmo portão ele exigiu os repins **como tarefas**, cada uma amarrada ao commit de
conteúdo anterior, e `[P]` só onde despachável na mesma mensagem sem pensar (ver
[[repin-e-sempre-commit-separado]] — o `gen_pins.py` decide onde `[P]` é falso).

