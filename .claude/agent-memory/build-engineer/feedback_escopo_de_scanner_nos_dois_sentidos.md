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
FAIL permanente por defeito alheio. Por isso o conjunto varrido é **nominal por
prefixo**, nunca `ui_*`.

**How to apply:** ao estender glob, allowlist, `arquivos_mutados` ou qualquer
conjunto varrido, provar o poder discriminante em **worktree efêmera** (R7 §3):
criar lá o arquivo violador sintético e mostrar as duas execuções lado a lado —
checagem antiga = 0 problemas/exit 0 (o vácuo), checagem nova = FAIL nomeado/exit 1.
Sem esse par, "estendi o glob" é alegação, não evidência. Se o alcance novo acusar
algo em módulo alheio, **parar e reportar como achado** — pode ser violação real
preexistente, e consertá-la de passagem é mudança sem rastro (R5). Ver também
[[project-013-sonda-de-fiacao]], que é o mesmo raciocínio aplicado a mutante de
fiação, e [[project-targets-trigger-vs-mutados]], onde o conjunto declarado e o
conjunto realmente tocado divergem.
