---
name: mutante-aditivo-nasce-morto
description: Mutante que INSERE regra para um seletor que já existe MAIS ABAIXO na mesma folha escreve declaração morta na chegada — metade do mutante é inerte, e só a medição por declaração vê
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
