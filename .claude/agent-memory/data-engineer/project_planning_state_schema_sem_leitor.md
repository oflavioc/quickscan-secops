---
name: planning-state-schema-sem-leitor
description: O planning-state.schema.json não tem leitor executável (check_state.py valida à mão), e a chave irmã validacao/implementacao só pode ser fechada numa sequência de três passos — medida em 2026-09-04
metadata:
  type: project
---

`.claude/templates/planning-state.schema.json` é **contrato declarado, não gate**:
o único consumidor do caminho no repositório é `pins.json` (identidade). O stage
`state` roda `check_state.py`, que valida à mão (`required` literal, enums,
coerência slug↔arquivo, R3) e **nunca abre o schema**. Consequência prática: toda
mudança de schema é `chore`, nasce verde e não tem dentes — dentes exigiriam
editar `check_state.py`.

**Why:** na demanda 016 (gap G1 do `spec-validate`) me pediram, além de `branch`
em `required` e da válvula `fecho_pendente`, **proibir a chave irmã `validacao`**
(PT) que 010/011/015 usam enquanto `check_tdd.py:37` só lê `validate`. Medi as 11
demandas com `jsonschema` 4.26 (Draft 2020-12): `additionalProperties: false`
reprova **5 de 11** — há **8 chaves ad-hoc** fora do schema, e só 2 são as irmãs
(as outras: `achado_real`, `autorizacao`, `autorizacao_29_4`, `ideia_para_a_spec`,
`portao_fase0`, `t004_equivalencia`); `not{required: validacao}` reprova **3 de
11** (010, 011, 015, todas `done`, todas com os **dois** blocos, `validate` e
`validacao`, desde o fecho retroativo). Ou seja: proibir hoje = stage `state`
vermelho no histórico, que é o `EA-5` (MANIFEST sempre vermelho, logo nunca
rodado). Só a variante condicionada a `demanda >= 016` nasce verde — e ainda sem
dentes.

**How to apply:** se a normalização voltar (a spec 016 §Fora de escopo já a
registra como candidata a `chore` do `data-engineer`), a ordem é: (1) normalizar
os 3 estados `validacao`→`validate` / `implementacao`→`implement` — cuidado, o
planning-state da 015 e o da 016 são `targets` da campanha `d016` no
`mutation_map.json`, editá-los dispara a campanha; (2) declarar as chaves ad-hoc
ou adotar escape nomeado (`patternProperties: ^x_`) para `additionalProperties:
false` ser satisfazível; (3) só então dentes, em `check_state.py` — congelado
como "intocado" pela decisão T9 da 016 enquanto a demanda não fecha.
Relacionado: [[feedback-t004-ratificacao-mecanica]]
