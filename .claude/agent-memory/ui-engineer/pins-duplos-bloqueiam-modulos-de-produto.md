---
name: pins-duplos-bloqueiam-modulos-de-produto
description: Mudar ui_target_v32.js, ui_journey_v32.js, ui_ux_v32.css ou ui_v32.js deixa p50core vermelho por pin inline em tests_p50_core.js, além do repin de pins.json
metadata:
  type: project
---

Existem **duas** superfícies de identidade sobre os módulos de produto, não uma:
`.claude/verify/pins.json` (repin por `gen_pins.py`, R8) **e** um mapa `PROTECTED`
inline em `tests_p50_core.js`, consumido por **quatro** gates: `P50-GOV1`,
`P50-SUF0`, `P50-SUF8` e — descoberto na wave 4 da 009 — `P50-IC4`.
Qualquer mudança em `ui_target_v32.js` / `ui_journey_v32.js` / `ui_ux_v32.css`
derruba os três primeiros por hash, mesmo com a demanda perfeitamente
implementada. **`ui_v32.js` derruba `P50-GOV1` e `P50-IC4`**: o `IC4` verifica
`sha(ui_v32.js)` na alínea (a) *antes* de reexecutar ICONS 4.6 (alínea c), então
ele acusa "ui_v32.js alterado" mesmo com os ícones 12/12 — a falha é de pin, não
de regressão de ícone, e a distinção precisa ser dita na entrega.

**Why:** o pin inline é legado anterior à R8 (R10 §4 proíbe pin inline **novo**),
e nenhuma spec/tasks de demanda o cita — então ele aparece como surpresa na wave
de implementação, depois que o red já foi provado.

**How to apply:** ao entregar tarefa de UI que toque esses arquivos, reportar em
DEPENDÊNCIAS que `p50core` fica fora do 64/0 do `expected_suites.json` até alguém
com domínio de teste resolver o pin — nunca tocar `tests_p50_core.js` (é do
`qa-engineer`) e nunca tratar isso como regressão do próprio patch. A prova de
não-atribuição é rodar a mesma suíte com a versão de HEAD do módulo, ver
[[workflow-verificacao-sem-rebuild]].

**Cobertura medida por arquivo (2026-08-28):** os quatro gates NÃO caem juntos —
cada um pina um conjunto próprio. Tocar **só** `ui_ux_v32.css` derruba
**apenas `P50-GOV1`** (`63 PASS · 1 FAIL de 64`, "protegidos alterados:
ui_ux_v32.css"); `SUF0`, `SUF8` e `IC4` seguem verdes. Reporte o gate que a sua
medição realmente mostrou, não a lista inteira.

**Confirmado na 010 · T008 (2026-08-30):** tocar **só** `ui_target_v32.js` deu
exatamente **`61 PASS · 3 FAIL de 64`** — `P50-GOV1` ("protegidos alterados:
ui_target_v32.js"), `P50-SUF0` ("ui_target_v32.js alterado") e `P50-SUF8`
("deixou de ser byte-idêntico"). `P50-IC4` **verde**: ele pina `ui_v32.js`, não
este módulo. A tríade é estável entre demandas — é a contagem a citar na entrega.

**Confirmado na 010 · T013 (2026-08-30) — os dois módulos juntos:** com
`ui_target_v32.js` (T008) **e** `ui_v32.js` (T013) no mesmo diff, `p50core` dá
**`60 PASS · 4 FAIL de 64`**: a tríade acima **mais** `P50-IC4`
("ui_v32.js alterado"), com `icons46` **12/12 verde** na mesma execução — a prova
de que `IC4` cai pela alínea (a) de pin, nunca pela regressão de ícone (c). O
vermelho declarado da demanda ("61/3") vale para o estado de T008; ao entregar o
segundo módulo, cite **60/4** e nomeie o gate que a sua execução acrescentou.

**Atualização 010 · pós-repin inline (2026-08-31):** o commit `760883b`
("o repin dos pins inline") reancorou parte do mapa `PROTECTED`, e a contagem
**mudou**: no HEAD `d6d667a` da 010, `p50core` dá **62 PASS · 2 FAIL** —
só `P50-GOV1` e `P50-IC4`, ambos citando `ui_v32.js`; `SUF0`/`SUF8` voltaram ao
verde. Esse vermelho **já existe no HEAD, sem diff nenhum**: rodar a suíte sem
splice e com splice deu o MESMO 62/2, com as mesmas duas linhas — é essa
execução dupla, e não a memória, que prova a não-atribuição. Sempre medir as
duas antes de citar contagem: a tríade "estável entre demandas" registrada acima
deixou de valer depois do repin.

**Registro da 009 (2026-08-28):** a seção "Autorização nominal §29.4" do
`spec.md` lista, na linha *Consequência*, só `P50-GOV1`, `P50-SUF0` e `P50-SUF8`
como gates a voltar ao verde após o repin — **`P50-IC4` ficou de fora**. Quem
repinar precisa incluí-lo, senão `p50core` não fecha 64/0.

**Confirmado na 015 · T011 (2026-08-31), e o contraste com a 010 importa:** na
worktree `phase5-015`, `p50core` no **HEAD limpo** dá **64 PASS · 0 FAIL** —
o vermelho pré-existente que a 010 media NÃO existe aqui. Tocar **só**
`ui_v32.js` leva a **62 PASS · 2 FAIL**: `P50-GOV1` ("protegidos alterados:
ui_v32.js") e `P50-IC4` ("ui_v32.js alterado"), com `icons46` **12/12 verde**
na mesma execução. Logo os dois FAIL **são atribuíveis ao meu diff** e fecham
com o repin inline + `gen_pins.py` do `build-engineer` — não repita a fórmula
"já existia no HEAD" sem medir: **rodar o controle com `git show HEAD:<mod> >
<mod>`, medir, e restaurar conferindo sha256** é o que separa os dois casos.
