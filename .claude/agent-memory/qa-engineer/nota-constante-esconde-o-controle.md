---
name: nota-constante-esconde-o-controle
description: Harness cujo NÃO EXECUTADO por baseline usa nota constante deixa o CI sem a razão — check_mutation ecoa só 2 linhas + bloco não-KILL (que repete a nota); ponha o resultado do controle na nota
metadata:
  type: feedback
---

Quando um controle de baseline (C0) reprova no CI, a única coisa que sobrevive
à truncagem do `check_mutation.py` é a `nota` de cada mutante `NÃO EXECUTADO`
— o bloco de não-KILL a repete "nas palavras do harness". Se essa nota é uma
string constante ("baseline do gate nu VERMELHO — kill não atribuível"), o log
do CI diz QUE o baseline falhou e nunca POR QUÊ; a linha `resultado: FALHOU ·
exit … · problemas … · censo …` fica no stdout capturado e descartado.

**Why:** demanda 016, run 33927191969, job `visual`: 13/33 mutantes de árvore
`NÃO EXECUTADO` por baseline vermelho; o mesmo commit era 33/33 no job
`verify`, na worktree e num clone limpo. Sem a linha do controle não deu para
atribuir causa (R2 §3) — mesma família da E13 da 014 (log trunca o gate),
agora no controle. O `check_mutation.py` é intocado por T9; o canal que
sobrevive é a nota do harness.

**How to apply:** em todo harness com controle de baseline, a nota do
`NÃO EXECUTADO` por baseline carrega o `resultado:` do controle (exit,
problemas, censo, `erro_de_leitura`, última linha do stderr). Ao ler um CI com
"baseline vermelho", não raciocine a causa: exija a linha — reexecute com o
instrumento dizendo, ou com um passo diagnóstico que rode o gate nu em prosa
antes da campanha. Ver [[red-por-instrumento-ausente]] e
[[prova-de-carga-da-excecao]] (kill à mão porque o log trunca).

**Estado (2026-09-04, `6678d31`, errata E016-7 da spec 016):** as duas
metades entraram — a nota do `d016` carrega `controle <id> · resultado: FALHOU
· <nota>` com a METADE nomeada (SONDA/ÁRVORE) e sem `undefined`, e o
`check_mutation.py` ecoa `controle: <id> · <resultado> · <nota>` após o tail
(`mut_controles`/`mut_relata_controles`, relato, `fails` intocado). O caveat
medido antes: sob `vivo: null` a nota antiga imprimia `undefined demanda(s)`
— toda nota de controle tem de cobrir as duas metades e o JSON ausente. Se a
causa do run `33927191969` reaparecer, agora o log a diz. Ver
[[deducao-nao-e-leitura-no-log-do-ci]].
