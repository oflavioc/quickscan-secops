# R1 — Invariantes de produto

Severidade: **bloqueante**. Dono: `product-owner`. Só o PO propõe mudança de invariante,
e só o auditor humano a ratifica.

Estas dez proposições SÃO o produto. Cada uma tem gate executável mapeado em
`.claude/verify/invariants.json` — **invariante sem gate é prosa**, e o
`compliance-audit.sh` (seção `invariantes`) falha se o mapa quebrar.

| # | Invariante | Gate |
|---|---|---|
| INV-1 | Engine byte-idêntico salvo rito D2 (Porta A: payload M41 byte-idêntico + suítes verdes + QA + ok explícito do usuário; Porta B: spec + auditoria independente humana) | stages `baseline`/`build` + `m41` |
| INV-2 | UNSET ≠ NONE — não respondido nunca renderiza como score zero | `tests_unset_ug.js`, UX 4.1, P50 |
| INV-3 | Sufficiency gate (≥10 confirmadas e ≥2 por domínio) antes de qualquer score; a UI **nunca** é dona da decisão (moeda canônica UI-009A) | P50-SUF*, engine |
| INV-4 | Tecnologia, isoladamente, nunca aumenta o maturity score | `tests_m42_m86.js` |
| INV-5 | Target é declarado, estritamente > current confirmado; nunca deriva de produto | `tests_target_m431.js` |
| INV-6 | Refinamento operacional nunca afeta scoring | `tests_ref_m44.js` |
| INV-7 | Narrativa determinística e derivada de evidência | UX 4.1, M41 |
| INV-8 | Derivados nunca serializados como fonte de verdade; sessão exporta só inputs canônicos e o import recomputa (missing ≠ null ≠ [] ≠ "unset") | `tests_session_m48.js` |
| INV-9 | Superfícies congeladas protegidas por boundary legível por máquina | `boundary.json` + `guard-boundary` |
| INV-10 | PT-BR em docs/relatórios; nomes de código, funções, IDs e enums exatamente como no source | `compliance-audit` + revisão |

## A régua da INV-1 (decisão D2)

O que separa mudança de **equivalência** (Porta A) de mudança de **comportamento**
(Porta B) não é opinião: é o SHA-256 do payload funcional canonicalizado do harness
M41, pinado em `pins.json → declared.m41_payload_sha256`. Payload idêntico = Porta A.
Payload diferente = Porta B, sem exceção. A Porta A permanece **pendente de
ratificação do proprietário (Q3)** — até lá, todo toque no engine é Porta B.
