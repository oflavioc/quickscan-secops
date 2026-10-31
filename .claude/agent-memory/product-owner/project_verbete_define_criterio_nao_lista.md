---
name: verbete-define-criterio-nao-lista
description: Resíduo 1 da 017 (2026-09-09) — verbete que define por enumeração de exemplos envelhece contra o enum da Fase 1; a §Não mudam da spec faz o spec-validate CERTIFICAR o verbete congelado; a hipótese "glossário cedo demais" está refutada
metadata:
  type: project
---

Verbete de Fase 0 que define a **extensão** (a lista de exemplos) fica
verdadeiro-e-incompleto quando a Fase 1 fecha um enum sobre a mesma extensão.
Caso medido: `CONTEXT.md` *Insumo de prova* enumerava cinco exemplos; a 017
fechou quatro classes que absorvem dois deles e trazem uma sem correspondente.
Remédio geral: **definir pelo critério e remeter a lista à fonte que a pina** —
o glossário aponta, não repete. Aplicado como cláusula remissiva em 2026-09-09.

**Why:** a hipótese "o glossário está sendo escrito cedo demais" está
**refutada pelo próprio artefato**: o `refinement.md` da 017 (`:272-278`,
"Não registrados, de propósito") já listava as **seis** razões candidatas,
incluindo *entrada da varredura* — que virou `populacao`. A Fase 1 não inventou
classe nenhuma; o verbete copiou cinco dos seis nomes como exemplos, contra a
decisão registrada uma seção abaixo dele, e deixou a sexta de fora. O
conhecimento estava lá na Fase 0; o defeito é de **forma**, não de momento.
E escrever o glossário mais tarde tiraria a única alavanca que ele tem: na 013
foi o meu verbete que promoveu a identidade gatilho≡mutado a doutrina, e a 017
existe para desfazê-la.

**How to apply:**
1. Ao escrever verbete na Fase 0 de demanda que vai construir enum/veredito/
   código: definir o critério, marcar exemplos como exemplos, e prever a
   remissão. Nunca importar para o glossário a lista que o próprio refinamento
   declarou "não registrada, de propósito" (identificadores, INV-10).
2. Quando a demanda constrói vocabulário fechado, `CONTEXT.md` na `§Não mudam`
   da spec é **hipótese escrita antes do conhecimento** — e o `spec-validate`
   a converte em prova (017, item 68: diff vazio `✓`). Cobrar na Fase 1 que a
   linha vire pergunta do aceite, não afirmação.
3. Achado só se corrige DEPOIS do merge quando o item já foi medido: diferir com
   a razão é certo, e o fecho reabre a porta. Ver
   [[vocabulario-fechado-nao-e-congelado]], [[checklist-de-fase-6-do-po]] e
   [[017-relacao-gatilho-conjunto-mutado]].
