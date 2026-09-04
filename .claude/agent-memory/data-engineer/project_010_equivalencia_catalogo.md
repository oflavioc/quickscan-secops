---
name: 010-equivalencia-catalogo-divergencia
description: T004 da demanda 010 ratificou as 11 linhas da tabela de equivalência MAP↔catálogo V3.2, mas devolveu ao plano uma divergência sobre a FORMA do contrato (chave→id vs chave→id[]) que bloqueia T008
metadata:
  type: project
---

Em 2026-08-30 ratifiquei (T004, leitura pura) a tabela de equivalência de
`specs/010-recomendacao-sem-vao/plan.md` §"Tabela de equivalência de catálogo":
as 11 chaves conferem, `FortiNDR → ndr-family` e
`FortiGuard-Service-Bundle → sem equivalente` estão certas, colisão de `map:` é
zero e ícone não degrada. **Mas devolvi uma divergência de forma ao plano**: o
contrato `chave → id | null` não distingue "equivalente não anexado" de
"equivalente coberto por um nó irmão/pai anexado", e por isso
`FortiEndpoint` (equiv. `fortiendpoint`) sobrevive como "a validar" ao lado do
placeholder `endpoint-family` no MESMO card, na própria fixture `D010-F4`
(qid `vulnerability-management`) — o mesmo produto duas vezes, com dois nomes.

**Why:** `resolveCandidates` só emite ofertas com
`recommendationPolicy: "direct-when-gap-and-whitespace"`; sob arquitetura não
declarada (estado de todas as fixtures D010) ela colapsa variantes no
placeholder de grupo (`ndr-family`, `endpoint-family`). Logo "declarar
equivalência" e "poder fundir" são ortogonais, e a relação certa é de
**família**, não de id único. O plano já tinha internalizado metade disso na
errata E9 (o caso `fortiguard-mdr` inelegível), mas não o caso do nó irmão.

**How to apply:** se T008 (`ui_target_v32.js`, `__DEV.TGT_EQUIV`) for delegada,
conferir ANTES se o plano decidiu a forma — contrato muda antes do consumidor.
Nada disso toca o engine (nenhum rito D2 aberto); a mudança é só de
`plan.md`. Relacionado: [[feedback-t004-ratificacao-mecanica]]
