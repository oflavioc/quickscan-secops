---
name: project-013-e1-harnesses
description: Demanda 013 (integridade da campanha) — E1 é minha nas três harnesses de mutação, uma wave por harness; tests_p51_mutants.js tem dois donos
metadata:
  type: project
---

Na demanda **013-integridade-da-campanha** (worktree `phase5-013`, branch
`feature/013-integridade-da-campanha`), o **julgador** é `check_mutation.py`
(`qa-engineer`) e o **julgado** — E1 nas três harnesses — é meu, **uma wave por
harness**: `p51` na W3 (T006), `p50` na W4, `p52` na W5. `tests_p51_mutants.js`
tem **dois donos** e por isso nunca na mesma wave: E1 é minha (W3), a
reancoragem das âncoras (E2/W6) é do `qa-engineer`.

**Why:** separação de poderes do R3 §2 — quem escreve o gate não escreve o green,
e quem conserta a âncora não é quem construiu o instrumento que a mede.

**How to apply:** se me pedirem E1 numa harness, o escopo é o eixo de
portabilidade (T1 interpretador · T3 prefixo de env · T4/T5 três estados · T6
preflight) e **nunca** o `find`/`repl` de mutante — mexer em âncora é reancoragem,
outra wave, outro dono. `tests_core_mutants.js` é a referência do eixo do
interpretador e fica **fora** de qualquer edição; `tests_p52_mutants.js` é a
referência do eixo do prefixo (`SUPPRESS` + `envOverride`). Cópia de *shape*,
nunca extração de runner comum (R9). Ver [[project-013-rito-de-medicao]].

**E1 concluída nas três (W5, 2026-08-29).** As "quatro conhecidas" da spec são
âncoras da `p51`: `M51-03`, `M51-16`, `M51-18`, `M51-20`. O primeiro preflight de
cada harness achou rot **fora** dessas quatro — `p50`: `M13`, `M23`, `M35`;
`p52`: `V322-M3` — e todas foram **classificadas e reportadas, nunca
reancoradas** (spec §Riscos 1): reancoragem é E2/W6, do `qa-engineer`.

**Insight durável do preflight:** número histórico do tipo `N-1/N` vindo do CI
(`p51` 19/20, `p52` 106/107) tende a ser **âncora podre**, não gate sem poder
discriminante. O rótulo antigo colapsava os dois. Antes de tratar um
"sobrevivente" como defeito de gate, rodar `--preflight` — é barato, não muta e
não precisa de Chromium nem de `node_modules`.
