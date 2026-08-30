---
name: project-wave-paralela-worktree-unica
description: As waves [P] desta demanda rodam vários agentes na MESMA worktree; contagens de suíte medidas in loco vêm contaminadas e não são evidência do meu diff
metadata:
  type: project
---

As tarefas marcadas `[P]` na mesma wave são delegadas em paralelo e todas escrevem
na **mesma worktree** (`phase5-009`). Durante a wave 3 eu observei, no mesmo minuto,
`ui_journey_v32.js`, `ui_p52_workspace_v32.css`, `ui_target_v32.js` e o HTML gerado
mudando sob os meus pés — inclusive o HTML carregando um `repl` de mutante aplicado
por uma campanha em curso.

**Why:** as suítes jsdom bootam `quickscan_secops_soccmm_v3_2_dev.html` (o artefato
`generated`), não os módulos-fonte. Então a contagem que eu leio no diretório do
projeto mistura (a) o meu diff, (b) o diff de todos os outros agentes da wave e
(c) o estado do último rebuild, que não é meu e pode estar mutado. Reportar essa
contagem como EVIDÊNCIA do meu trabalho é reportar ruído alheio.

**How to apply:** para produzir EVIDÊNCIA atribuível ao meu módulo, medir em árvore
isolada: `git archive HEAD | tar -x -C <scratch>`, copiar por cima **só** o meu
arquivo, rodar `python build_v32_html.py` ali e executar as suítes com
`NODE_PATH` apontando para o `node_modules` do repo (`mklink /J` falha com os `--`
do caminho de scratch). Isso dá "HEAD + o meu diff, mais nada" — e é o número que
vai no campo EVIDÊNCIA. A contagem in loco entra só como observação, com a
contaminação nomeada. Ver [[project-trilha-roda-em-opus]].

**Confirmado na wave 3 (T009) — e uma armadilha a mais:** `git worktree add --detach HEAD`
NÃO serve de linha de base, porque o `quickscan_secops_soccmm_v3_2_dev.html` **commitado**
fica stale de propósito (o rebuild é uma tarefa de wave 5). Medi `P52-LAY3` vermelho no
worktree cru e verde depois de rodar `build_v32_html.py` na mesma fonte: a diferença era só
o HTML velho. Toda medição isolada precisa do rebuild; sem ele o número é de outro commit.
