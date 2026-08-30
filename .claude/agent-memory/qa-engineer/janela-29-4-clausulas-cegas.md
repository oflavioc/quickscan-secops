---
name: janela-29-4-clausulas-cegas
description: Enquanto a autorização nominal §29.4 mantém P50-GOV1/SUF0/SUF8/IC4 vermelhos por identidade, as cláusulas COMPORTAMENTAIS depois do check de SHA não são avaliadas — nomeie quais ficam cegas antes de aceitar o vermelho
metadata:
  type: project
---

Quando uma demanda altera superfície protegida sob autorização nominal §29.4, os
quatro gates que consomem o mapa `PROTECTED` inline de `tests_p50_core.js` ficam
vermelhos **por identidade**. O detalhe que morde: o `throw` da identidade
**interrompe o gate**, e tudo que vem depois dele **não roda**.

Medido em 2026-08-28 (wave 6 da demanda 009), `p50core` 60 PASS · 4 FAIL:

| gate | posição do check de SHA | o que fica CEGO |
|---|---|---|
| `P50-GOV1` (:232) | **1ª** instrução | presença das 13 suítes congeladas + `tests_visual/` |
| `P50-SUF0` (:1149) | no meio | identidade de `dataSufficiency()` no build **e** o lint de símbolo fora da fronteira (axe-core, `buildPrintReport`, framework mapping) |
| `P50-SUF8` (:1800) | **última** | nada — os 1024 vetores de equivalência tripla rodaram e passaram |
| `P50-IC4` (:2540) | **1ª** (alínea a) | `window.__V32UI` expor `iconFor` **e** a reexecução de ICONS 4.6 12/12 |

**Why:** um vermelho "esperado" é fácil de aceitar como ruído e seguir adiante —
e nesse intervalo o repositório perde cobertura que ninguém contabilizou. R2:
PASS não executado é alegação; o mesmo vale para "não medido porque o gate parou
antes".

**How to apply:** ao reportar um vermelho por identidade, (1) nomeie as
cláusulas que ficaram cegas, (2) diga quais estão cobertas por execução
independente — ICONS 4.6 roda sozinha no stage `suites` como `icons46` 12/12, o
que salva a alínea (c) de `P50-IC4` — e (3) trate as restantes como dívida da
janela, a fechar no repin. **Não repine para "destravar"**: o repin é tarefa
própria e cita a seção "Autorização nominal §29.4" da spec. Ver
[[trilha-e-ambiente-quickscan]].

**Desfecho desta janela (2026-08-28, demanda 009).** Fechada no mesmo dia:
`p50core` voltou a **64 PASS · 0 FAIL** e as cláusulas antes cegas, recomputadas
por oráculo independente, acusaram **zero** achados — as 13 suítes congeladas e
`tests_visual/` presentes, `dataSufficiency()` byte-idêntica no build, lint de
fronteira limpo nos quatro módulos, `window.__V32UI` expondo `iconFor`. Nada
estava escondido. Isso **não** enfraquece a regra: a cobertura esteve suspensa e
ninguém sabia disso até medir. Duas práticas que valeram a pena e devem repetir:
sondar o gate repinado com uma mutação transiente (um comentário a mais em
`ui_ux_v32.css` fez `P50-GOV1` reprovar nomeando o arquivo — prova de que o
repin não virou tautologia) e conferir o diff **com comentários removidos**, que
deve mostrar só as linhas de hash.
