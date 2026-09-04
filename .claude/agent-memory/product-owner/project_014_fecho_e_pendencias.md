---
name: fecho-da-014-e-pendencias
description: Aceite de intenção da 014 gravado 2026-09-01 (não encontrei objeção, condicionado ao run 33516136516); KI-4 removida por aposentadoria; 4 termos entraram no CONTEXT.md tardiamente — lição de portão
metadata:
  type: project
---

A demanda **014-gate-sem-poder-discriminante** teve o aceite de intenção (T083)
gravado em 2026-09-01 no `planning-state → validate.notes`: **"não encontrei
objeção"**, com `conformance: 100%` (spec-validate T082, 19/19) e pendências
nomeadas. A entrega é **exposição permanente vigiada** (stage `regra-morta`
estático em todo pipeline, cobertura derivada do builder), não saneamento — 1
regra morta em 49 mutantes de CSS, e a `KI-4` saiu pela rota da **aposentadoria**
de `M51-01` com substituição nominal `D014-M10 × P52-LAY2` (ver
[[fecho-retroativo-da-013]]).

**O que o aceite deixou condicionado ao job `visual` (run 33516136516):**
1. `D014-M10 × P52-LAY2` — KILL fecha C4; SOBREVIVENTE reabre o desenho do par
   (disposição já na matriz: nunca afrouxar o `reason`) e o ponto volta como
   iteração.
2. `P52-ICON2` sob a mutação parcial de `P52-RA8` decide o **EA-32** — se
   sobreviver, é um segundo par sem poder discriminante e a saída de **partir o
   mutante em dois** (uma por asset, precedente D011-M12/M13) ganha força.

**Pendências que atravessam o merge:** T084 relatorio-final (doc-writer) + T085
repin; atomicidade do commit T050 só conferível por `git log`; termo **"mutante
parcialmente inerte"** (classe nomeada pela E7, definida em `regra_morta.json →
classes_de_achado`) ainda fora do `CONTEXT.md`; waves 7–8 sem registro no bloco
`implement` do planning-state (família EA-33 — estado atrás do git).

**Why:** a lição nova é minha: os **4 termos aprovados no refinamento** (regra
morta, poder discriminante, prova de discriminância vencida, varredura de regra
morta) **não entraram no `CONTEXT.md` no portão** — só na Fase 6, quando eu mesmo
conferi. Sob aprovação por delegação, o passo "gravar o vocabulário no glossário"
não tem dono automático e cai.

**How to apply:** em toda Fase 6, conferir o glossário contra o §Vocabulário do
refinement antes do veredito — é lacuna do MEU domínio e barata de sanar no ato
(CONTEXT.md é pinado: exige repin no mesmo PR). No fecho da 014, cobrar o registro
de "mutante parcialmente inerte" e a citação do run no relatorio-final.
