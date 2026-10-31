---
name: targets-derivam-do-conjunto-mutado
description: Na revisão de intenção (Fase 1) e no aceite (Fase 6), conferir os `targets` de todo harness novo contra o conjunto de arquivos que os M* tocam — inclusive documento mutado em cópia (E12 da 025)
metadata:
  type: feedback
---

Regra: `targets` de um harness ⊇ arquivos mutados ∪ {harness} (D017-REL1). Antes de
aprovar o §Registro de uma spec, ler o bloco de mutantes e listar o que cada M* toca,
inclusive documento mutado em cópia (ex.: `SESSION_SCHEMA_V32.md` pelo M21 da 025).

**Why:** a spec da 025 enumerou 8 targets pelos módulos de código e esqueceu o documento
que o M21 muta — virou o G1 do spec-validate (41/42) e a errata E12, autorizada pelo
proprietário em 2026-10-30.

**How to apply:** targets não se enumeram "à mão pelos módulos"; derivam do conjunto
mutado. Conferir contra `mutation_map.json → harnesses.<id>.targets` antes do aceite.

(Nota parqueada em 2026-10-30 pelo orquestrador; materializada em 2026-10-31.)
