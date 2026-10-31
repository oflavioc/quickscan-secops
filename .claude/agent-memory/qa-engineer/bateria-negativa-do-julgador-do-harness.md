---
name: bateria-negativa-do-julgador-do-harness
description: Um harness que dá N/N DETECTADO de primeira só vale depois de provar que o PRÓPRIO julgador alcança SOBREVIVENTE e NÃO EXECUTADO — seis adversariais (no-op de instrumento, no-op de árvore, contagem errada, isolamento violado, valor errado no campo certo, réplica que não importa) gerados por splice da lista MUTANTS numa cópia efêmera
metadata:
  type: feedback
---

Depois de escrever um harness com julgador estruturado (JSON do gate, não
regex), rode-o contra **mutantes que não podem morrer** antes de commitar. A
forma barata (016, 2026-09-04, 3 minutos): um script gera uma cópia do harness
na raiz da worktree com o bloco `const MUTANTS = [ … ];` trocado por seis
adversariais e o resto intacto — mesmos caminhos, mesmos julgadores, mesmos
controles —, roda, apaga. Exit 1 é o esperado, e a asserção é a linha de fecho
exata: `0 detectados · 5 sobreviventes · 1 não executado (de 6)`.

Os seis, um por defeito de julgador:

1. **no-op de instrumento** (só comentário) → tem de SOBREVIVER com "sonda não
   reprovou";
2. **no-op de árvore** (texto que o gate imprime mas não julga) → SOBREVIVER com
   "exit 0 · 0 problemas";
3. **contagem errada** (cenário real com `problemas` esperado +1) → SOBREVIVER
   nomeando "esperado 2 · obtido 1";
4. **isolamento violado** (cenário real sem declarar o sujeito acusado) →
   SOBREVIVER com "acusação a MAIS";
5. **valor errado no campo certo** (mutação real de M1 com F19 → CONFORME) →
   SOBREVIVER com o par esperado/obtido;
6. **réplica que não importa** (import inexistente) → `NÃO EXECUTADO · rebuild
   falhou`, nunca DETECTADO por crash — exige que o julgador leia
   `instrumento.presente` do JSON antes de contar divergências.

**Why:** um 30/30 de primeira é exatamente o número que R2 manda desconfiar; a
única prova de que o julgador não é constante-DETECTADO é vê-lo dizer
SOBREVIVENTE pelo motivo certo. É a [[controle-verde-na-bateria-negativa]]
aplicada ao harness em vez do gate, e a defesa contra
[[core-colapsa-crash-em-sobrevivente]] no sentido inverso (crash lido como
kill).

**How to apply:** toda campanha nova entrega três números antes do KILL/total —
âncoras únicas (preflight), réplicas que importam, e a bateria negativa do
julgador (0/k/1) — e registra a saída dela no `prova-de-carga.md`/red, nunca só
no scratchpad ([[bateria-efemera-nao-e-registro]]).

**A mesma régua para gate com sonda interna (EA-41, 2026-09-05, `check_eol_text.py`):**
a sonda de 13 casos passou de primeira, então rodei 8 mutantes DO GATE em cópia
efêmera (julgador mudo, acusa tudo, exclusão como escopo, sonda encurtada sem
tocar os pins, parser cego, código de causa constante, alínea sem carrasco,
sem-declaração como escopo) + controle intacto + o mutante mudo em modo
completo sobre a árvore real (tem de dizer "árvore NÃO JULGADA" e NÃO acusar o
sujeito). Saiu 9/10 — e o "DIVERGE" era **erro de aritmética do driver** (eu
esperava "11 ≠ 6", eram 10 em escopo), não do gate: a saída do gate era
internamente consistente (5 divergências nomeadas + guarda `10 ≠ 6`). Regra:
quando o driver diverge, confira primeiro se a saída do gate fecha consigo
mesma; se fecha, corrija a expectativa, reexecute e DECLARE os dois números.
E para gate cujo sujeito é a árvore, dê a ele `--repo DIR`: o controle negativo
vira um clone efêmero com só os bytes do defeito trocados (578/525/53/0 → 0
problema(s)), muito mais forte que a fixture em miniatura.
