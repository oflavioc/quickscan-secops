---
name: workflow-verificacao-sem-rebuild
description: Como o ui-engineer prova o verde sem rodar o builder — as suítes bootam o HTML gerado, e rodar build_v32_html.py é negado para este agente
metadata:
  type: feedback
---

As suítes jsdom bootam `quickscan_secops_soccmm_v3_2_dev.html` (classe `generated`),
não os módulos-fonte. Editar `ui_*.js` não muda nada para o gate até o rebuild.
Rodar `python build_v32_html.py` é **negado** para este agente (classificador de
permissão) e pertence ao `build-engineer`.

**Why:** o HTML gerado é boundary `generated` (R6) e o rebuild é tarefa própria na
wave de build; sem isso o agente de UI acabaria escrevendo em artefato protegido.

**How to apply:** para medir os próprios gates antes do rebuild, rodar a suíte por
um wrapper em scratchpad que intercepta `fs.readFileSync` do caminho do HTML e
troca o bloco entre os marcadores `/* V32_<MOD>_BEGIN */` … `/* V32_<MOD>_END */`
pelo source atual do módulo — é exatamente o que o builder faz, só que em memória
e sem escrever no repo. O corpo dos gates roda **sem modificação**. A execução
autoritativa continua sendo a de depois do rebuild, e isso vai declarado na
EVIDÊNCIA. Ver [[pins-duplos-bloqueiam-modulos-de-produto]].

**Variante com prova de fidelidade embutida** (usada na Fase 6 da 009): em vez de
casar marcador, procurar no HTML o texto de `git show HEAD:<mod>` e substituí-lo
pelo working tree. O builder inlina o módulo **verbatim**, então o `indexOf` só
acha se o HTML gerado estiver em dia com HEAD — achou, o splice é byte-exato;
não achou, o wrapper aborta em vez de medir um HTML velho. Marcadores do módulo
de alvo: `V32_TARGET_BEGIN`/`_END`. Cuidado com dois detalhes de ambiente: rodar
o wrapper de fora do repo exige `NODE_PATH=<repo>/node_modules` (senão `jsdom`
não resolve) e `process.chdir(<repo>)`.
