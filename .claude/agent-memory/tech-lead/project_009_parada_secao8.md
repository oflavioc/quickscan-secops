---
name: demanda-009-secao8-substituida
description: A §8 da diretriz selada da Phase 5.2 (alvo imediatamente após a visão executiva) foi substituída pela spec da demanda 009, ratificada pelo proprietário em 2026-08-27
metadata:
  type: project
---

A cláusula **§8** da diretriz da Phase 5.2 — *"o cenário-alvo vem imediatamente
depois da visão executiva"* — **deixou de ser âncora** em 2026-08-27. O
proprietário ratificou no chat a rota A ("trocar a regra selada"), e a âncora
normativa da ordem de leitura do resultado passou a ser
`specs/009-leitura-do-relatorio/spec.md`, seção "Âncora normativa". A §8 continua
citável como histórico em `docs_phase5/PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md`.

**Why:** a ordem aprovada no portão da 009 põe o cenário-alvo na 5ª posição, o
que quebra a forma forte da §8 implementada em `P52-TGT1`. R10 §1 proíbe
enfraquecer gate para passar, então a única saída legítima era a troca de âncora
ratificada por quem detém a decisão — e ela foi obtida com as duas ordens
apresentadas lado a lado.

**How to apply:** ao desenhar qualquer coisa que toque a ordem das seções do
resultado, a referência é a spec da 009, não o relatório da 5.2. `P52-TGT1` passa
a asserir apenas adjacência ("alvo depois de `exec` **e** imediatamente antes de
`context`"); a posição absoluta é garantida pelos gates `D009-ORD1`/`D009-ORD2`.
Consequência de desenho que vale além da 009: **cláusula de adjacência não
substitui gate de sequência completa** — um mutante que mova o par
`target`+`context` inteiro passa em `P52-TGT1` e só morre no gate de ordem
completa.

Achados adjacentes levantados na mesma spec e ainda **não** decididos pelo
`product-owner`: o buraco na numeração visível das seções (`data-p52-order` usa o
índice na ordem completa, não a posição entre as renderizadas) e a conflação
entre "contexto informado e nada se aplica" (S3) e "landscape não se aplica" (S4)
no card de prática-alvo.
