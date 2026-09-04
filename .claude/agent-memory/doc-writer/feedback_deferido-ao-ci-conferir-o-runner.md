---
name: deferido-ao-ci-conferir-o-runner
description: Antes de registrar "deferido ao CI / KI-3" como agendamento por desenho, conferir que algum runner realmente invoca a suíte — registro em expected_suites.json não executa nada
metadata:
  type: feedback
---

Quando uma demanda declara um gate **deferido ao job `visual` do CI** (padrão
KI-3), a frase só pode entrar no relatório depois de conferir **quem executa**:

1. `.github/workflows/verify.yml` — o job `visual` roda **comandos literais**
   (`npm run test:visual`, `node tests_p50_chromium.js`, `node tests_p52_chromium.js`).
   Suíte nova só roda se alguém acrescentar o passo.
2. `npm run test:visual` é `playwright test` sobre `./tests_visual/` — um
   `tests_NNN_chromium.js` na raiz **não** é descoberto por ele.
3. `check_suites.py` usa o bloco `visual` de `expected_suites.json` apenas para
   **registrar** (evita "suíte fora do registro"); ele não executa esse bloco.
4. Prova final: `gh run view --job <id> --log | grep <id-do-gate>` no run citado.
   Se o gate não aparece no log, ele não rodou — por mais que a matriz diga
   "deferido".

**Why:** na demanda 011 (2026-08-31) `D011-CON1`/`D011-M9` estavam escritos,
registrados e com par na matriz, e mesmo assim **nenhum runner os invocava** —
nem local (sem Chromium, KI-3) nem no CI (sem passo). Registrar isso como
"agendamento por desenho, não pendência" teria produzido exatamente o verde por
omissão que a R10 §2 existe para impedir, num relatório meu.

**How to apply:** em todo relatório final que contenha "deferido ao CI", dizer
**qual passo do workflow** executa o gate e **em qual run** ele apareceu no log;
se não houver passo, isso é gap de `spec-validate` classe
`implementação-divergente`, devolvido ao orquestrador com a direção (passo novo
em `verify.yml` é do `build-engineer`, R10 §9) — nunca afrouxado nem maquiado.
Vale o mesmo cuidado para "o CI está verde": conferir o **head** do run contra o
head do PR. Ver [[status-do-achado-contra-o-fonte]].
