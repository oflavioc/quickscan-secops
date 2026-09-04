---
name: parser-declarado-tem-cegueira-medida
description: O CSSOM do jsdom descarta !important quando o valor é var() — e um censo de regras/declarações não vê isso; sentinela com gatilho nomeado é o fecho
metadata:
  type: project
---

Escolher um parser por errata **não mede o parser**. Medido na 014 (2026-09-01),
com jsdom 30.0.1, que a errata E4 declarou como parser da varredura de cascata:

```
.x{ background:var(--accent) !important }  → getPropertyPriority() === ""   ← perdido
.w{ background-color:var(--accent) !important } → ""                        ← perdido
.y{ color:#123 !important }                → "important"                    ← ok
.z{ background:#123456 !important }        → "important" (11 longhands)     ← ok
```

Vale para shorthand **e** longhand: o gatilho é o `var()`, não a forma da
propriedade. Efeito num classificador de cascata: declaração importante lida
como normal ⇒ vencedora errada ⇒ veredito errado, **em silêncio**.

**Why:** a errata E6 mandou pinar um censo de parse (regras e declarações por
folha) contra parser que degrada calado — e esse censo **não pega este defeito**,
porque a contagem de regras e declarações não muda quando só a prioridade some.
Censo que mede volume não cobre censo de semântica. E a fixture (d) do C1, que
eu tinha escrito com `background:var(--accent) !important`, seria **vacuosa**:
o instrumento não veria importância nenhuma e a alínea passaria a medir ordem.

**How to apply:**
- Antes de assar um valor numa fixture que exerce uma propriedade do parser,
  **rode a sonda** e confira que o parser reporta o que você acha que reporta.
  Fixture calibrada contra a spec ainda pode ser vacuosa contra o parser.
- Alcance medido na árvore: **zero** das 41 declarações `!important` das cinco
  folhas (+3 na camada 0) usam `var()`. Logo não é achado — é **sentinela**.
- A sentinela é `censo[].importante_com_var` pinado em 0 por folha, com oráculo
  **textual** (independente do CSSOM) e gatilho escrito: a primeira declaração
  `!important` com `var()` faz o censo divergir e reprova **antes** do veredito;
  a ação exigida é reavaliar o parser, jamais rebaixar o pin. É a forma de
  [[sentinela-nao-e-clausula-defensiva]] — gatilho nomeado, não silêncio.
- Corolário geral: censo de parse pinado deve carregar, além de volume, ao menos
  um campo de **semântica** medido por oráculo independente do parser. Um `outras`
  com o inventário de at-rules (CSSPageRule, CSSKeyframesRule) fecha a mesma
  família — at-rule que some não muda a contagem de regras de estilo.

Ver também [[divergencia-de-censo-tem-causa-isolavel]] para o caso irmão: duas
medições honestas do mesmo censo divergem por convenção de contagem, não por
defeito.
