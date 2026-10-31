---
name: checklist-de-fase-6-do-po
description: O que o aceite de intenção do PO confere que ninguém mais confere sob delegação — glossário (014), registro da validação acompanhando a iteração (016), regra operacional nova fora da trilha (016), onde o vermelho vive de verdade (016), flips medidos e não raciocinados
metadata:
  type: project
---

Sob delegação do proprietário, o aceite de intenção (Fase 6) é o **último ponto
humano-equivalente** antes do `done` — e três ciclos seguidos mostraram que há
uma classe de lacuna que só aparece nele: **o registro não acompanhou a execução**.
Lista acumulada, cada item com a demanda que o ensinou:

1. **Glossário contra o §Vocabulário do refinement E contra o enum construído**
   (014, 016, 021). Termos aprovados na Fase 0 caem sem dono; e um `_Evitar_`
   pode ter virado rótulo canônico de outro estado (T10 da 016). Conferir os
   dois — e tratar "o termo já está no `CONTEXT.md`" como **afirmação a medir**:
   a 021 afirmou três coberturas e tinha uma (ver
   [[homonimo-no-glossario]]). Grep acha a palavra e lava a afirmação; ler o
   **sentido** de cada hit.
2. **`spec-validate.md` acompanhou a iteração?** (016). O QA fechou G1–G3 e
   documentou em `prova-de-carga.md` §9, mas o `spec-validate.md` continuava
   "iteração 1 de 2, 95%" enquanto o planning-state dizia "fechados". C3 só mede
   existência do arquivo (meu próprio §NÃO mede 1) — conteúdo é defesa humana.
   Virou condição do aceite, não observação.
3. **Regra operacional nova saiu da trilha?** (016). A trilha de erro do
   orquestrador escreveu "regra que passa a valer" — e a regra vivia só em
   `specs/NNN/trilha-*.md`. Conferir por grep em `rules/` e `skills/`. Se não
   entrou, pedir a linha em `orchestration.md` §Anti-patterns no mesmo PR.
4. **Onde o vermelho "por desenho" vive de verdade** (016). A spec dizia que E1
   tirava o vermelho do `verify`; mas PROT1 roda no `compliance-audit`, que roda
   no job `verify`. Ler o `verify.yml`, não a spec, para saber que check fica
   vermelho — e escrever isso no aceite para o vermelho ser lido pela razão.
5. **Flips medidos, não raciocinados** (014, 016). Todo "vermelho → verde" que
   depende do CI ou de ato do proprietário entra como **condição com agente que
   verifica**, nunca como pendência solta. Se o relatório da entrega diz "já foi
   medido — julgue, não remeça", ainda assim conferir o que é conferível por
   leitura (prova de carga: lido = medido = registrado) e nomear o resto.
6. **Recusa de agente com medição fora da árvore** (016). O `data-engineer`
   recusou com números (5/11, 3/11) que só existiam no chat. Ratificar pelo
   mérito e exigir o registro no relatório final — senão será remedido.

**Why:** as três lacunas da 016 (itens 2–4) estavam **invisíveis no relato do
orquestrador**, que era honesto e completo sobre o que ele mediu — o problema é
que ninguém tinha lido o artefato de validação depois da iteração, nem
procurado a regra fora da trilha. É a mesma família do EA-31/EA-33 aplicada ao
processo de fecho: registro que promete e ninguém confronta.

**How to apply:** rodar a lista inteira em toda Fase 6 antes do veredito; cada
item que falhar vira **condição nomeada** em `validate.aceite_po` (formato da
016), com o agente que verifica — nunca "aprovado", nunca pendência sem dono.
Ver [[fecho-da-014-e-pendencias]], [[refinamento-016-registro-contra-execucao]]
e [[gate-verde-nao-e-protecao]].
