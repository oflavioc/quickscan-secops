---
name: vocabulario-fechado-nao-e-congelado
description: Decisão de forma do EA-39 (2026-09-05) — código novo `historico-raso` em vez de esticar `piso-invalido`; regra para vocabulários fechados de veredito/código (016, 013) e para a divisão autorrelato × oráculo independente (impedimento × guarda de censo)
metadata:
  type: project
---

No `EA-39` (leitor de histórico do `fecho.py` lê clone raso como "0 merges",
`causa: null`) escolhi **código novo `historico-raso`** com veredito `NÃO
DETERMINÁVEL`, contra a rota "reusar `piso-invalido` com detalhe nomeado".
Registro completo em `.claude/BACKLOG.md`, seção do EA-39, "Decisão de forma".

Regras que saíram dessa decisão e valem para a próxima:

1. **Fechado ≠ congelado.** Vocabulário fechado é o que a sonda compara por
   igualdade (enum, não regex). Cresce por errata aditiva com fixture que pina
   o membro novo. O que o dissolve é esticar um membro para cobrir estados de
   **remédio distinto** — o enum fica do mesmo tamanho e deixa de significar
   uma coisa: `EA-5` por outra porta. Teste rápido: cada código responde "o que
   faço agora?" com UMA resposta? Se dois remédios, dois códigos.
2. **O código é o que a sonda pina; o detalhe não é.** Sob reuso de código, a
   fixture nova pinaria o mesmo que uma fixture existente e não separaria o
   julgador certo do que acerta o código com a razão errada.
3. **O código mais barato que mente é o mais caro** — a rota "sem errata"
   (reusar `origin-develop-ausente`, para onde a borda 10 da spec apontava)
   carregava um remédio medido como ineficaz (`git fetch origin develop` não
   desfaz `.git/shallow`).
4. **Autorrelato do instrumento nunca substitui o oráculo independente.** O
   impedimento (leitor nomeia a causa) é diagnóstico; a guarda de censo (número
   pinado, R10 §3) é a medição — foi ela que pegou o EA-39 e é a que **não se
   remove**. Regra de composição: leitor nomeia → global + guarda
   `nao_aplicado` (um FAIL); leitor cala com contagem errada → guarda.
5. Cuidado com o carrasco existente: `D016-M33` corta no `return` final de
   `ler_merges` com `od` intacto — campo novo populado depois desse ponto muda
   o que M33 prova.

Armadilha de enquadramento: o orquestrador chamou a lista de códigos de
"vocabulário fechado de T10". **T10 é só vereditos**; os 16 códigos vivem em
`fecho.json → _meta.contrato_da_sonda.codigos`, `check_fecho.py` §CONTRATO,
`fecho.py → CODIGOS` e `plan.md` ET3 — conferir onde a lista é normativa antes
de dimensionar a errata. Códigos/causas de conjunto fechado (016, 013) **não
entram no `CONTEXT.md`**: são identificadores (INV-10), não termos de domínio.

**Why:** a 016 acabou de construir o instrumento para caçar exatamente "número
que não distingue não medi de medi zero"; reproduzir o defeito no vocabulário do
próprio instrumento, para poupar uma errata aditiva, seria a errata mais cara.

**How to apply:** em toda decisão de vocabulário de gate (veredito, código,
causa), julgar pelo que o log diz a quem lê dali a seis meses e pelo remédio
que o rótulo implica — nunca pelo custo de implementação. Ver
[[refinamento-016-registro-contra-execucao]] e [[gate-verde-nao-e-protecao]].
