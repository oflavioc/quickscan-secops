---
name: medir-gatilho-de-campanha-e-onde-fecha
description: Todo plan.md deve trazer a tabela "arquivo editado → campanha disparada → ambiente → onde fecha"; pedida nominalmente na 011 e de novo na 014, e ela muda o desenho
metadata:
  type: feedback
---

O `plan.md` traz uma **tabela de medição de campanhas**: para cada arquivo que a
demanda edita, qual campanha de mutação ele dispara, qual ambiente ela exige, e
**onde ela fecha** (nesta máquina × job `visual` do CI). Não é apêndice: nas duas
vezes em que foi pedida, ela **mudou o desenho**.

**Why:** o orquestrador pediu isso nominalmente na Fase 2 da 011 ("tocar certo
arquivo jogaria o fechamento inteiro para o CI") e repetiu na 014. Pendência
vaga do tipo "isso fecha no CI" é o que a R2 §1 proíbe — o não executado é
declarado, com motivo e com dono.

**How to apply:** o gatilho é `mutation_map.json → harnesses.<n>.targets`
comparado ao diff contra `merge-base(HEAD, origin/develop)`. Campanha exigida sem
ambiente **reprova localmente com nome**; `MUTATION_DEFER_MISSING=1` a converte em
`[DEFER]` — o job `verify` do CI define essa env, e o job `visual` é quem de fato
executa as campanhas com Chromium. Confira os números **por execução**
(`node <harness> --preflight` responde população e âncoras sem mutar nada), nunca
pelo `_trilha` do mapa, que já foi medido divergente (o d011 dizia 18 mutantes e
eram 19). Verifique os caminhos e as linhas antes de citar: esta nota descreve o
mecanismo, não promete que os arquivos seguem onde estavam.

Duas armadilhas medidas na 014, que valem como padrão:

- **Escolher o `requires` errado torna a demanda infechável localmente.** Um
  harness novo que declare `chromium` porque *um* dos mutantes precisa dele joga
  a campanha inteira para o CI, inclusive os mutantes que só precisam de node. O
  desenho certo é **partir em dois harnesses** (o precedente d011 defere o
  mutante de Chromium; a 014 automatizou a deferição, porque o job `visual` já
  roda `check_mutation.py`).
- **Consumir dado de outra campanha custa o gatilho dela.** Estender o contrato
  do preflight nos harnesses que possuem o dado é a rota de fonte única — e o
  preço, medido, é re-disparar as campanhas desses harnesses. Precifique antes de
  escolher entre isso e um registro paralelo; o registro paralelo apodrece, que é
  em geral a doença que a demanda combate.

Ver [[repin-e-sempre-commit-separado]] e [[vacuidade-medida-antes-do-gate-nascer]].
