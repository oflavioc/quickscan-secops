---
name: errata-que-afirma-registro-confere-por-grep
description: Toda afirmação "registrado em X" de uma errata se confere por grep antes do score do spec-validate; lista de registro na spec pode ser contradita por contrato de outra demanda (C1/REL1) — classe spec-errada, recomendar errata e parar
metadata:
  type: feedback
---

Duas lições do spec-validate da 025 (2026-10-30):

1. Lista de registro escrita na spec pode ser contradita por contrato de **outra**
   demanda (D017-REL1: targets ⊇ mutados ∪ {harness}). Classe **spec-errada**:
   recomendar errata e parar — não "corrigir o registro para casar com a spec".
2. Toda afirmação "registrado em X" dentro de uma errata se confere por `grep` antes de
   pontuar: a E9 dava a dívida INV8(c) como existente na matriz, e não estava
   (acrescentada em `af41f72`).

**How to apply:** no spec-validate, o item "registrado em" só pontua conforme depois de
localizar a linha no arquivo citado.

(Nota parqueada em 2026-10-30 pelo orquestrador; materializada em 2026-10-31.)
