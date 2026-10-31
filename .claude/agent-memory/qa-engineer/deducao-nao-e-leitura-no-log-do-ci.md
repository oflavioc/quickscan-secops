---
name: deducao-nao-e-leitura-no-log-do-ci
description: `run.sh` ecoa o stdout de um stage SÓ no FAIL — `[PASS] mutation` no CI não carrega contagem nenhuma; "33/33 no job verify" é dedução (exit 0 ⇒ fails 0 ⇒ harness exit 0 ⇒ D === SELECTED e controles OK) e tem de ser escrita como dedução; e "os KILL de sonda provam que a sonda estava sã" é falso porque julgaSonda não pina isolamento
metadata:
  type: feedback
---

Duas frases minhas no `spec-validate.md` §A1 da 016 foram refutadas pelo
diagnóstico do orquestrador e riscadas em `7cec314`:

1. **"logo a sonda estava sã; o que falhou foi a metade de árvore"** — falso
   por medição. `julgaSonda` exige que os casos de `espera.divergem` divirjam e
   `ok === false`; **não pina isolamento** (só `julgaArvore` pina). Clone com
   `F99.json` extra: C0-fecho FALHOU (`vivo: null`, metade da SONDA) e
   `D016-M1` saiu **DETECTADO**. Kills de sonda sob C0 vermelho não localizam a
   metade que falhou; quem localiza é a nota do controle.
2. **"o mesmo commit fecha 33/33 no job `verify`"** — dedução, não leitura:
   `run.sh:66-69` ecoa o stdout de um stage apenas no FAIL, então o log do job
   mostra só `[PASS] mutation`. A cadeia válida (exit 0 ⇒ `fails == 0` ⇒
   campanha devida executada sem perdão vivo ⇒ harness exit 0 ⇒ `D ===
   SELECTED.length && CFALHOU === 0`) tem de ser **escrita como cadeia**, não
   como número lido.

**Why:** R2 §1/§3 — PASS cita execução; causa antes de conclusão. Uma
inferência plausível escrita como fato virou item a corrigir sob R2 §5
(riscado, com a razão), e a primeira teria mandado o diagnóstico do run
`33927191969` procurar só na metade errada.

**How to apply:** ao citar resultado de CI, ou cole a linha lida, ou escreva
"dedução: <cadeia>" — nunca a contagem nua; para stage PASS no `run.sh` não há
saída para citar. Ao ler um controle de baseline vermelho, não infira a metade
a partir dos mutantes que morreram; exija a nota. Para provar uma nota de
controle, quatro formas de C0 vermelho em clone efêmero: fixture extra (sonda),
`update-ref -d origin/develop` (árvore/global), gate quebrado (JSON ausente),
`origin/develop` movido para SHA antigo (piso-invalido). Ver
[[vermelho-de-controle-sem-nota-no-stage]], [[nota-constante-esconde-o-controle]].
