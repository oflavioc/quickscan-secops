---
name: fortalecimento-ratificado-exige-errata
description: Guarda mais forte que a spec, ratificada pelo PO na iteração de correção, torna falsa a frase normativa da spec ("exit 1 sse F > 0") — é gap spec-errada com errata aditiva; nunca remover a guarda para devolver o "sse"
metadata:
  type: feedback
---

Quando a iteração de correção implementa uma candidata que o spec-validate
levou como "não decisão minha" (o converso de R10 §1: fortalecer por conta
própria) e o PO a ratifica no aceite, a implementação passa a ser mais forte
que a spec — e alguma frase normativa da spec vira falsa. Isso é gap na
iteração seguinte, classe **spec-errada**, direção **errata aditiva**; a
alternativa de remover a guarda para devolver a letra é R10 §1 ao contrário.

**Why:** demanda 016: J1 levou o censo pinado `merges_ate_piso = 39` como
candidata; `9fe57f0` o implementou (guarda de censo, D016-M33); o PO
ratificou ("além do que J1 pedia"). Na iteração 2 medi: sob M33 o gate sai
`exit 1 · 0 problema(s)` — a §Superfície 1 dizia `Exit 1 sse F > 0`. A guarda
é certa (sem ela o leitor mudo passava verde, medido com o gate de 76fd9dc);
a spec é que ficou atrás. Gap G4, escalado ao usuário com a errata — escrita
em `f0fe1e2` como **E016-5** depois do "ok" literal dele ("Escrever as duas
erratas e seguir"); a numeração levou o prefixo da demanda porque "E5"
colidiria com o achado histórico `E5` que a E4 da mesma spec desambiguou.

**How to apply:** ao fechar uma iteração de correção que acrescentou
mecanismo, releia as frases com "sse", "só", "nunca" e as amostras de saída da
spec contra o gate novo — não só os itens que estavam em gap. Registre a
divergência como spec-errada e proponha a errata; não "resolva" apagando a
guarda nem calibrando o número. Ver [[sobrevivente-por-lacuna-x-equivalente-por-spec]].
