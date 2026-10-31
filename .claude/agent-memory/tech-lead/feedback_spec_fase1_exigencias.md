---
name: spec-fase1-exigencias-do-orquestrador
description: O que o orquestrador exige de uma spec de Fase 1 além do template (025, 2026-10-27) — mapa caso→gate e cenário→gate nos dois sentidos, mensagens PT-BR exatas, "o que NÃO muda", PROTECTED lido inteiro, erratas como tarefas, modelo declarado
metadata:
  type: feedback
---

Numa spec de Fase 1, além do template, entregar: (1) **mapa de cobertura nos dois
sentidos** — caso do refinement → gate/alínea e cenário da síntese → gate, com a
frase "nenhum caso sem gate, nenhum gate sem caso"; (2) **mensagens de produto com
texto exato**, PT-BR, no padrão das mensagens vizinhas do mesmo validador; (3) seção
**"O que NÃO muda"** nominal (schema, shapes, bridges, textos pinados, payload M41,
cláusulas defensivas que ficam); (4) no boundary, dizer se a suíte da demanda
anterior está em `PROTECTED` **e** distinguir chave-hash de `PROTECTED` de
`frozenSuites` (só existência) de "§29.4 pela prosa"; (5) **erratas listadas como
tarefas** (spec anterior, docs do schema, exemplo sintético, guia, notas de
`bridges.json`), nunca executadas na spec; (6) declarar o **modelo real** que
executou; (7) gates que **nascem verdes** declarados com o mutante que lhes dá
poder; (8) oráculo independente nomeado por gate, comparado **entre janelas**.

**Why:** pedido explícito do orquestrador na delegação da Fase 1 da 025 ("O QUE A
SPEC TEM DE TER", itens 1–6). Os itens 1, 3 e 5 são o que o `spec-validate` da
Fase 6 extrai; sem eles a Fase 6 mede a demanda contra o que ela não prometeu ou
classifica critério como "faltando".

**How to apply:** usar como checklist antes de fechar qualquer `spec.md`. Lição
técnica da mesma rodada: reancoragem de alínea em suíte congelada que lê o HTML de
caminho fixo só tem carrasco **executado pela campanha** se o carregador ganhar um
env de override (ex.: `M48_HTML_OVERRIDE`) — senão a prova vive num relatório
(família `EA-28`); declarar o custo (execuções extras da suíte pesada) para a Fase
2 medir. Ver [[crosscheck-inclui-specs-seladas]], [[erratas-de-spec-forma-e-precedente]],
[[observacao-sem-id-nunca]].
