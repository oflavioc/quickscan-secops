---
name: acervo-migrado-vive-no-historico
description: Os acervos migrados para Releases (evidence_p50/p51/p52/unset, demanda 007) continuam legíveis do histórico git sem download — `git show <último-commit>^:<path>`; foi assim que P52-ICON2-optics.json deu o aspecto dos assets antes de escrever um reason
metadata:
  type: reference
---

`docs_phase5/evidence_p52/` não existe mais no checkout (migrado para Release
em `oflavioc/quickscan-secops`, demanda 007), mas **o histórico não emagreceu**:
todo arquivo do acervo continua como blob e se lê em segundos, sem rede:

```bash
P=docs_phase5/evidence_p52/P52-ICON2-optics.json
C=$(git log --all --format=%H -1 -- "$P")     # último commit que tocou (a desindexação)
git show "$C^:$P"                              # o blob anterior à remoção
```

Em 2026-09-04 (EA-32) isso devolveu as 10 medições de `P52-ICON2` por tile —
`alt`, `size`, `icon`, `scale`, **`aspect`**, `hApparent`, `wApparent` — e foi o
que decidiu a forma do `reason`: SOCaaS tem aspecto **0.78** (ramo "altura
aparente"), MDR 1.0; um asset panorâmico (> 1.25) cairia no ramo "largura" e
um `reason` de altura sobreviveria por "motivo diferente". A mediana dos
quadrados (0.754) também sai dali.

**Why:** a alternativa era rodar o gate no Chrome local só para descobrir o
aspecto, ou raciocinar a partir do SVG — a primeira é mais cara, a segunda é o
erro da E13. O acervo é medição real do mesmo emissor, só que antiga:
`scale` e `aspect` são propriedades do asset/folha e não mudaram; `hApparent`
histórico é indicativo, não pin (ver [[gate-compoe-o-scale-duas-vezes]]).

**How to apply:** antes de escrever `reason` para gate visual que imprime
valores por item, procure no acervo histórico (P50/P51/P52 `*-optics.json`,
`*-mutation.json`, capturas) o formato e os valores de base; cite o commit do
blob no registro, nunca o caminho no disco. O manifesto-ponte
(`.claude/verify/evidence_bridge.json`) é a prova de identidade; o blob é a
leitura.
