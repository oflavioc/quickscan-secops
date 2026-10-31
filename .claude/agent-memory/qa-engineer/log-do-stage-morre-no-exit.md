---
name: log-do-stage-morre-no-exit
description: O run.sh apaga o log do stage reprovado no EXIT (mktemp + trap) — reexecutar o comando do stage com saída inteira antes de escrever uma linha; nunca reconstruir de memória (EA-119)
metadata:
  type: project
---

Fecho de stage que difere do run direto: o `run.sh` apaga o log completo do stage no
`EXIT` (`mktemp -d` + `trap`). Na T090 da 025, 101 linhas do meio do log se perderam.

**Why:** o resumo do pipeline mostra só as pontas; o que falta só volta reexecutando.

**How to apply:** antes de escrever o relatório de um stage FAIL, reexecute o comando do
stage (o `run:` do `pipeline.yaml`) e capture a saída inteira; não reconstrua o trecho
omitido. Registrado como `EA-119` (2026-10-30).

(Nota parqueada em 2026-10-30 pelo orquestrador; materializada em 2026-10-31.)
