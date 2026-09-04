---
name: mutante-aditivo-nasce-morto
description: Mutante que INSERE regra para um seletor que já existe MAIS ABAIXO na mesma folha escreve declaração morta na chegada — metade do mutante é inerte, e só a medição por declaração vê; o remédio (EA-32) é partir por asset, alterar a regra VENCEDORA in loco e nomear o alt no reason — depois de conferir em que ramo do emissor o asset cai
metadata:
  type: project
---

Mutante **aditivo** de CSS (o que troca uma linha por duas) precisa saber se o
seletor que ele insere já existe **adiante na mesma folha**. Se existir, a
declaração inserida perde por ordem para a que já estava lá e **nasce morta** —
o mutante fica com metade inerte, sem que nada acuse.

Caso medido, 014 (2026-09-01), `p52/P52-RA8` (`tests_p52_mutants.js:398`):

```
find:  .icon-tile img[data-p52-icon="FortiGuard-MDR-Service"] { --p52-icon-scale: 1.053; }   (ui_p52_workspace_v32.css:1350)
repl:  ... MDR ... 0.70;
       .icon-tile img[data-p52-icon="SOCaaS"]                 { --p52-icon-scale: 0.70;  }   ← inserida em ~1351
já existe: .icon-tile img[data-p52-icon="SOCaaS"]             { --p52-icon-scale: 1.006; }   ← linha 1357, VENCE por ordem
```

Veredito da varredura: 2 declarações alteradas, **1 morta + 1 viva**. O `desc`
promete "reduzir SOCaaS **e** MDR"; só o MDR reduz. O valor computado de SOCaaS
segue 1.006, idêntico ao da folha não mutada.

**Why:** o veredito de regra morta é **por declaração, não por mutante** — a
mesma forma apareceu em `p51/M51-01` (2 declarações: `grid-template-columns`
morta, `grid-template-areas` viva, esta sem concorrente em folha nenhuma).
Alínea que contar mutantes conta errado nas duas pontas: some com a metade morta
de um mutante vivo e inflaria a de um mutante todo morto.

**How to apply:**
- Ao revisar mutante aditivo, procure o seletor inserido **abaixo** do ponto de
  inserção na mesma folha. `grep -n` no arquivo alvo resolve em segundos.
- É intra-arquivo, então gatilho por path e campanha não o veem: quem vê é a
  varredura de cascata. E a spec da 014 já o havia pré-classificado
  (§Não mensurável, item 4: "sobreposição intra-arquivo … se aparecer, é achado
  novo") — ver [[numero-esperado-diferente-do-medido]].
- Distinção que importa na classificação: a folha do PRODUTO não tem regra morta
  aqui. Quem escreve a regra morta é o MUTANTE. É defeito de instrumento de
  teste, não do produto — e ainda assim é da família "gate sem poder
  discriminante", por outro mecanismo.

## Remédio aplicado (fix-finding do EA-32, 2026-09-04, commit `8d753bc`)

Partir **por asset**, e cada metade **altera a regra vencedora in loco** —
nunca mover a inserção "para depois" (mudaria o alvo real) nem manter a
inserção. `P52-RA8` ficou com a metade MDR (`:1350`), `P52-RA8B` nasceu com a
SOCaaS alterando `:1357`. Três decisões que não eram óbvias:

1. **Ramo do emissor antes do `reason`.** `P52-ICON2` imprime *"altura
   aparente"* para aspecto ≤ 1.25 e *"largura aparente (artwork panorâmico)"*
   acima. Um `reason` de altura para um asset panorâmico sobrevive por *"motivo
   diferente"*. O aspecto veio do acervo histórico de óptica
   (SOCaaS 0.78, MDR 1.0 — ver [[acervo-migrado-vive-no-historico]]); só então
   o `reason` foi escrito, nomeando o `alt` que o gate imprime
   (`lg/FortiGuard SOCaaS: …`). A sonda contra a `gateLine` literal provou que
   cada `reason` casa só o próprio asset — a antiga casava os dois.
2. **O id fica com a metade que sempre foi efetiva** e que o
   `evento_de_remocao` da exclusão nomeia literalmente; a irmã ganha sufixo de
   letra (`P52-RA8B`, precedente `D011-M3B`/`M5B`). Renomear as duas deixaria o
   evento letra morta — a exclusão sairia por órfã (C3-c), não pelo evento.
3. **A metade que nasce "viva" na varredura ainda não tem kill.** Viva por
   cascata ≠ observável pelo gate ([[grade-implicita-neutraliza-mutante-de-coluna]]);
   os pares nascem NÃO EXECUTADO e a reprodução no Chrome local
   (DETECTADO 2/2) fica na nota, nunca no `resultado`.

Red do reparo sem commit: `varrerArvore()` do instrumento só com as exclusões
restantes, sobre o harness inteiro → `mortas: 1` (a metade inerte, sozinha);
sobre o harness partido → `mortas: 0`, cada metade 1 declaração viva.
