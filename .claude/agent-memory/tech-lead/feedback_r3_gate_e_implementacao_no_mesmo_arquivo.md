---
name: r3-gate-e-implementacao-no-mesmo-arquivo
description: Como resolver a tensão da R3 §2 (autor do gate ≠ implementador) quando o gate e o que muda vivem no mesmo julgador (check_mutation.py) — por arquivo e por commit, com os precedentes 013/016 e o que a 017 fez de diferente
metadata:
  type: feedback
---

**Quando o gate e a mudança vivem no mesmo arquivo (o julgador), a R3 §2
resolve-se por arquivo e por commit, e o plano diz isso explicitamente — nunca
deixa implícito.** Três desenhos já usados, do mais fraco ao mais forte:

1. **013** (`tasks.md:113-115`): o `qa-engineer` é dono do julgador e produziu o
   green de uma asserção **no mesmo arquivo** (T004), justificado por "é o
   julgador (R10)"; os outros greens vieram de outros agentes em outros arquivos.
2. **016** (`plan.md:39-44`): cada script parte-se em **gate** (sonda, leitura →
   julgamento → relato, exit — QA) × **instrumento** (o que decide e o que lê —
   engenheiro), arquivos distintos; implementador que precisa de mudança no gate
   volta por DEPENDÊNCIAS (`:72-73`). Molde da 014 (`tests_014_regra_morta.js` ×
   `regra_morta.js`).
3. **017**: o julgador tem **um autor e um commit** (o red); o green nasce só em
   dado (`insumos` no mapa) e em emissor (harnesses), por outro agente. Não há
   instrumento a partir porque `mut_relacao` é o julgador puro (gêmeo de
   `mut_guarda_leitura`/`mut_perdao`) e a sonda é autoteste do gate.

**Why:** o orquestrador exigiu na Fase 2 da 017 que a tensão fosse resolvida no
plano ("como a 013 e a 016 resolveram, se resolveram"). O critério que separa os
casos: **existe instrumento a escrever?** Se sim, 016; se o gate é só julgador +
sonda + fiação, 017 — e o arquivo do gate fica fora de toda wave de green.

**How to apply:** ao desenhar, pergunte "que commit toca o julgador depois do
red?" — a resposta certa é "nenhum". Se um pin de sonda vive em dado que outro
agente é dono (`mutation_map.json`), o pin nasce **no commit red, pelo QA**
(pin e gate que o lê juntos — o D4 da 013 aplicado ao pin), e o arquivo fica com
**um autor por wave** (016 `plan.md:93-95`). Ver
[[janela-vermelha-decidida-no-plano]].
