---
name: crash-de-laco-nao-e-kill-nomeado
description: Mutante de instrumento que faz o LAÇO do gate morrer em TypeError não produz kill nomeado — a fiação tem de tolerar o valor mutado no caminho verde para a mentira sair IMPRESSA; passe a dívida pelo julgador para o mutante ser visível na árvore e não só na sonda; driver de bateria (reset/commit/stage/veredito) em clone efêmero fecha 18 runs em 250 s (017, 2026-09-06)
metadata:
  type: feedback
---

Ao escrever a fiação de um gate com julgador puro + sonda (padrão IC-9/IC-10/
D017), percorra cada mutante de instrumento previsto e pergunte "o que o LAÇO
faz com o valor mutado?". Na 017, `D017-M14` (julgador devolve `ok` para
`arquivos_mutados = None`) faria o laço executar `set(None)` — traceback DEPOIS
da sonda, e nunca a linha `[OK] D017: core` falsa que a spec chama de "core como
OK". Trocar por `set(_mutados or [])` não muda o caminho real (no `ok` a lista
está sempre presente) e faz a árvore IMPRIMIR a mentira que a sonda ix acusa.
E fazer a dívida do `core` passar pelo julgador (`mut_relacao(None)` →
`nao_medido` + `credor`, o laço imprime a partir do retorno) em vez de imprimir
a `[DÍVIDA]` por pertença a `IC_SEM_PREFLIGHT` foi o que tornou M14 visível na
árvore além da sonda.

**Why:** R10 §2 — crash é barulho, não nome; e um kill que só existe como
traceback sai "SOBREVIVENTE/DIVERGE" no driver da bateria (a linha esperada não
aparece). É a classe de [[core-colapsa-crash-em-sobrevivente]] e de
[[bateria-negativa-que-mata-a-si-mesma]], vista do lado do gate.

**How to apply — a bateria que fechou 18 runs em 250 s:** o stage `mutation`
leva ~2 s quando nenhuma campanha é devida, então cada mutante cabe como run
COMPLETO do stage: `git reset --hard <red efêmero>` → edição com asserção
`count(old) == 1` (as âncoras do MAPA têm indentação irregular — 6/8/10/16
espaços por harness — confira por `grep -n` antes de escrever o driver) →
`git commit -a` → stage → veredito por observações (linha exata / prefixo /
contagem) → `reset`. Três coisas medidas que valem para a próxima: (1) mutante
em HARNESS (M9 em `tests_014_mutants.js`) dispara a campanha do harness pelo
trigger de path — 217 s no clone, contra 35 s do plano; o kill (FORM1) independe
dela; (2) trocar `process.exit(preflight(…))` por `process.exit(1)` num harness
com `requires: chromium` sai `[DEFER]` sob `MUTATION_DEFER_MISSING=1` — é o
estado NOTA da errata, não ruído; (3) o `red-*.md` foi GERADO por script a
partir de `base_head.txt`, `redA.txt`, hunks e `mutantes_resumo.json`: números
e linhas de kill vêm dos artefatos, e o gerador ASSERE o que a prosa afirma
(IC-5 presente nos runs de M1/M2; contagens do estado NOTA lidas dos arquivos) —
[[bateria-efemera-nao-e-registro]], [[trilha-e-ambiente-quickscan]] item 4.
Regressão C8 por diff: base sem a única linha `IC-6` × red sem o bloco novo
tem de dar 64 = 64 linhas com UMA divergência (a linha final `mutation:`, que é
o contador novo entrando em `fails`) — e o stage na árvore real, pós-commit,
tem de bater a cópia linha a linha (81 = 81).
