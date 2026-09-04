---
name: arbitragem-de-desvio-declarado
description: T082 da 014 — protocolo para arbitrar desvio de forma declarado (conforme com errata / sem errata / gap): reproduzir o kill à mão, exigir o gate "sugerido" VERDE sob o mutante, e decidir errata pela direção do erro do leitor
metadata:
  type: project
---

Na 014 (T082, 2026-09-01) arbitrei 4 desvios de forma (3 declarados pela wave 6 + 1 achado por mim no pin de C6). Resultado: E10/E11/E12 na spec + 1 conforme sem errata. O protocolo que funcionou:

1. **Reproduzir o kill com as próprias mãos, nunca via harness.** Extraí `find`/`repl` do fonte, apliquei com script próprio, rodei a suíte direta e li o bloco cru. O harness é objeto sob validação — usá-lo para provar a si mesmo é círculo ([[oraculo-independente-do-instrumento]]). Restauração por `git checkout` + porcelain escopado.

2. **A assinatura executável de "carrasco declarado errado" é um PAR**: sob o mesmo mutante, o gate que a spec sugere fica **PASS** e o carrasco real fica **FAIL nomeando a alínea**. Na 014: sob `D014-M5`, `D014-EXC1` PASS (registro são — julgador enfraquecido devolve as mesmas respostas sobre dado sem defeito) e `D014-DISC1` FAIL (`bateria[19]`/`C3(b)`). Se eu só tivesse visto o FAIL do carrasco real, não teria provado que o declarado era impossível. Regra geral: **mutante de julgador morre onde o dado defeituoso é alcançável** — a bateria negativa, nunca o gate que só vê o registro real.

3. **Censo-neutralidade se prova pelo gate do censo VERDE sob a mutação.** Para `D014-M4` a prova não foi só `C2(zero)` vermelha com a morta certa — foi `D014-CEN1` PASS na mesma execução, com contagem de alíneas (`1 alínea(s) reprovada(s)`). Kill limpo = alínea atribuída vermelha E pré-emptores verdes ([[mutante-de-arvore-sob-censo-pinado]], [[guarda-de-vacuidade-preempta-a-alinea]]).

4. **A régua errata × sem-errata é a direção do erro do leitor.** Errata quando a spec promete o que não há (célula sugerindo carrasco impossível; "contagem pinada" que seria alínea vacuosa — quem "restaurasse" por fidelidade à letra criaria o defeito). Sem errata quando a spec é piso e o desvio endurece (targets a mais no map, precedente d009/d010/d011): o leitor que subestima cobertura não quebra nada.

5. **Prova de carga da exceção entra na validação**: rodei a varredura SEM a exclusão `achado-aberto` e o vermelho voltou (0→1 morta). Verde com exceção que não segura nada é vácuo ([[verde-com-excecao-impressa]], amarra 4 — medir, não presumir).

Custo evitado: aceitar os desvios pelo registro da wave 6 (que eu mesmo escrevi) seria R2 §4 — alegação checável verificada por execução antes de agir, mesmo quando o alegante sou eu de ontem.
