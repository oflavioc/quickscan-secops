---
name: valor-malformado-que-mata-pela-alinea-certa
description: Ao escolher o valor da fixture negativa de formato, simule o mutante à mão e confira em QUAL cláusula seguinte o caso cai — '30/09/2026' > '2026-09-04' lexicograficamente faz M31 cair em "aceita" (alínea e); '01/10/2026' cairia em "vencida" (alínea b) e o par morreria pelo código errado
metadata:
  type: feedback
---

Para todo caso negativo novo, antes de pinar o esperado sob o mutante: aplique
o mutante à mão e siga o caminho do julgador com o valor escolhido até o fim —
o kill tem de acontecer na cláusula da alínea atribuída, não na seguinte.

**Why:** G3 da 016 (2026-09-04). `_valvula` faz `if not _dia_valido(prazo)` e
depois `if prazo < dia` (comparação de strings). Sob D016-M31 (formato
desligado), um prazo "dd/mm/aaaa" é comparado como string com "2026-09-04":
"30/09/2026" começa por '3' > '2' ⇒ não vence ⇒ FECHO PENDENTE DECLARADO (o
esperado do mutante, alínea e); "01/10/2026" começa por '0' < '2' ⇒ "vencida" ⇒
o par morreria por `fecho_pendente-vencida`, alínea (b) — DETECTADO, mas pelo
motivo errado, o [[preflight-prova-unicidade-nao-sitio]] aplicado ao valor da
fixture. A escolha ficou escrita no `_meta` do registro e na nota do par.

**How to apply:** é a mesma pergunta de [[guarda-de-vacuidade-preempta-a-alinea]]
e de [[mutante-que-morre-em-dois-lugares]], feita ao VALOR: "com esta entrada,
que outra cláusula pode disparar antes ou depois da que eu ataco?" Se houver
uma, mude o valor até que só a alínea-alvo responda, e registre por quê.
