---
name: suite-concorrente-envenena-gate-de-arvore
description: Nunca rodar tests_p50_core.js / tests_p52_layout.js em paralelo com tests_p51_mutants.js — os gates de identidade hasheiam a ÁRVORE e a campanha muta a árvore; o FAIL é falso e cita "protegidos alterados"
metadata:
  type: feedback
---

Suíte de mutação e gate de identidade **não podem correr ao mesmo tempo** neste
repositório. `tests_p51_mutants.js` muta e restaura arquivos **no disco**;
`P50-GOV1` e `P50-IC4` medem identidade com `sha(path.join(HERE, f))` —
`tests_p50_core.js:58`, `crypto…update(fs.readFileSync(p))` —, isto é, sobre a
**árvore**, não sobre o blob. Rodando juntos, o gate lê o arquivo mutado e
reprova com `protegidos alterados: ui_v32.js`, acusando a coisa errada.

Medido em 2026-10-16: `tests_p50_core.js` deu **62 PASS · 3 FAIL**
(`P50-GOV1`, `P50-IC4`, `P51-DOC13`) enquanto a campanha ainda corria; isolado,
**65 PASS · 0 FAIL** — com a mesma árvore. Prova de que não era o produto:
`sha256sum ui_v32.js` == `git show HEAD:ui_v32.js | sha256sum` == o pin inline
do gate (`d9215fd6…`), **antes e depois** das duas rodadas.

A ironia está escrita no próprio gate: o comentário-trilha de
`tests_p50_core.js:377-378` diz que a identidade é *"medida sobre o blob de HEAD
(`git show HEAD:ui_v32.js`) … e não se move enquanto uma campanha muta a
árvore"* — mas o código mede a árvore. A **prosa do pin** e o **instrumento**
discordam. Vizinho do `EA-18` (gate que lê a árvore × gate que lê HEAD medem
objetos diferentes), no sentido oposto.

**Why:** eu quase reportei três FAIL como regressão de uma edição que só tocou
`USER_GUIDE.md`. R2 §3 manda isolar ambiente/plataforma/**ordem de execução**
antes de atribuir ao código; "ordem de execução" aqui não é teoria, é o caso.

**How to apply:** rodar suíte de identidade **sozinha**, uma por chamada, nunca
encadeada com `;` nem em paralelo com campanha. Se vier FAIL citando
"protegidos alterados" ou "ordem real do relatório mudou": primeiro comparar
`sha256sum <arquivo>` com `git show HEAD:<arquivo> | sha256sum`; se baterem, a
causa é concorrência e o FAIL é falso — **re-executar isolado antes de escrever
qualquer coisa**. E registrar a primeira execução vermelha com a causa (R2 §1),
nunca só o verde. Ver [[prova-aditiva-mede-forma-nao-sentido]].
