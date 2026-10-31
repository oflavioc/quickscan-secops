---
name: feedback-escopo-de-scanner-nos-dois-sentidos
description: Ao mexer no alcance de um scanner (glob do lint-arch, alvos de campanha), medir os dois sentidos — alvo de menos faz gate passar por vácuo, alvo demais cria vermelho alheio
metadata:
  type: feedback
---

Mudança no **alcance** de uma checagem se mede nos dois sentidos, com contagem
antes/depois e a lista nominal do que entrou: quantos arquivos o conjunto alcança
hoje, quantos passa a alcançar, e se algum arquivo **não pretendido** entrou.
Alargar de menos e alargar demais são o mesmo defeito com sinais trocados.

**Why:** gate que passa porque não tem o que olhar é indistinguível de gate que
mede — e é a família de defeito que reaparece a cada demanda nova nesta base
(011: `check_lint_arch.py` só varria `ui_p5*_v32.js`, e o módulo `ui_d011_*` ficava
fora; o critério C8 passava por ausência de alvo e o mutante do `innerHTML =`
sobrevivia). O sentido oposto tem custo simétrico e medido: em 2026-08-31, um glob
largo `ui_*_v32.js` produziria **11 FAILs novos em 6 módulos 4.x**
(`ui_ux`, `ui_target`, `ui_session`, `ui_refinement`, `ui_journey`, `ui_icons` —
nenhum é IIFE, vários usam `innerHTML =`), vários deles protegidos: o stage viraria
FAIL permanente por defeito alheio. Por isso o conjunto varrido era **nominal por
prefixo**, nunca `ui_*`.

**Superado em 2026-10-25 (EA-101, commit `1def6a9` na `fix/EA-101-...`)**: o prefixo
deixou 3 módulos de demanda (`ui_curation`, `ui_curation_edit`, `ui_ondas`) sem
varredura — a 019/022 batizaram fora da convenção. A solução foi **inverter o
sentido da lista**: varre `ui_*_v32.js` MENOS `LEGADOS_4X` (allowlist nominal e
fechada dos 6 legados medidos pela 011). Lição: enumerar o *excluído* (finito,
legado, fechado) é mais seguro que enumerar o *incluído* por convenção de nome
(aberto, cresce com cada demanda). `ui_v32.js` não casa `ui_*_v32.js` (falta o `_`
antes de `v32`) — entrada de allowlist para ele seria inerte; só `boundary.json`
protege `ui_icons` (classe `generated`), os outros cinco 4.x NÃO são `frozen` hoje.

**How to apply:** ao estender glob, allowlist, `arquivos_mutados` ou qualquer
conjunto varrido, provar o poder discriminante em **worktree efêmera** (R7 §3):
criar lá o arquivo violador sintético e mostrar as duas execuções lado a lado —
checagem antiga = 0 problemas/exit 0 (o vácuo), checagem nova = FAIL nomeado/exit 1.
Sem esse par, "estendi o glob" é alegação, não evidência. Os `check_*.py` leem
caminhos **relativos ao cwd**, então um `--root` é desnecessário: montar uma árvore
mínima no scratchpad (engine + `ui_*.js` + `bridges.json`, com o mutante) e rodar
`cd <tmp> && python <worktree>/.claude/verify/check_lint_arch.py` dá o negativo
sem tocar a árvore. Se o alcance novo acusar
algo em módulo alheio, **parar e reportar como achado** — pode ser violação real
preexistente, e consertá-la de passagem é mudança sem rastro (R5). Ver também
[[project-013-sonda-de-fiacao]], que é o mesmo raciocínio aplicado a mutante de
fiação, e [[project-targets-trigger-vs-mutados]], onde o conjunto declarado e o
conjunto realmente tocado divergem.
