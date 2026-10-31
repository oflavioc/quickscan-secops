---
name: html-gerado-viaja-no-commit-do-modulo
description: O HTML gerado é reconstruído pelo implementador e commitado JUNTO com o módulo (rito vivo 019/022/023); não desenhe "wave de rebuild" separada nem suponha janela vermelha do stage build — o repin vem logo depois
metadata:
  type: feedback
---

**O `quickscan_secops_soccmm_v3_2_dev.html` viaja no mesmo commit do módulo que o
altera** — o implementador roda `python build_v32_html.py` e commita módulo + HTML;
o `gen_pins` segue em commit próprio. Medido no `git log -- quickscan_…dev.html`
em 2026-10-27: `aef6ff3 feat(019): W2`, `90f14ea feat(019): T010/T011`,
`f10f60b feat(022): W2`, `7e75cce feat(023): W1` — todos tocam o HTML. Nenhuma
demanda recente tem commit "chore: rebuild" separado.

**Why:** na Fase 2 da 025 eu quase desenhei um rebuild único no fecho (como o
`D019_HTML_OVERRIDE` sugere) e uma "janela vermelha do stage `build`" entre waves.
Falso dos dois lados: `build` tem `mutates:false, heavy:false` e **roda no hook
Stop** (`--light`) — HTML defasado seria vermelho visível a cada turno; e a
classe `generated` proíbe Edit/Write mas não o builder via Bash, que é o rito.

**How to apply:** cada tarefa de produto do `tasks.md` diz "rebuild no mesmo
commit" e o repin vem a seguir (conteúdo+HTML → gen_pins). O `*_HTML_OVERRIDE`
serve ao harness de mutação (rebuild em tmp), não para adiar o rebuild da árvore.
Ver [[repin-e-sempre-commit-separado]] e [[janela-vermelha-decidida-no-plano]].
