---
name: verde-com-excecao-impressa
description: Vermelho crônico é remédio pior que a doença (EA-5); a saída é verde com exceção impressa — asserção idêntica, objeto com dono/id/prazo, prazo auto-executável, e a exceção tem de ser CARGA
metadata:
  type: project
---

Quando a varredura acusa um caso **correto** cuja causa ainda não fechou, a
tentação do QA é manter o gate vermelho até a decisão. **O product-owner desta
casa recusa isso**, com precedente: o `MANIFEST` 74/74 ficou *"sempre vermelho,
logo nunca rodado"* (`EA-5`). **Gate que ninguém lê não protege nada.**

A saída ratificada (014, errata E7, 2026-09-01) é **verde com exceção impressa**,
motivo `achado-aberto`, reusando o registro de exclusões que já existe em vez de
criar mecanismo novo. Não é enfraquecer (R10 §1): **a asserção é idêntica**; o
que muda é que o objeto excluído passa a ter **dono, id e prazo**.

**Cinco amarras, e nenhuma é opcional:**

1. **Conjunto nominal fechado.** A alínea que compara as exclusões contra a lista
   literal da spec é o que impede `achado-aberto` de virar gaveta: exclusão nova
   sem mudança de spec reprova. É também a testemunha de fiação
   ([[oraculo-independente-do-instrumento]]).
2. **Prazo por EVENTO, auto-executável**, nunca por data. Aqui: *"um par
   `P52-RA8 × P52-ICON2` passa a existir em `mutation-matrix.json`"*. Hoje não
   existe → exceção válida; no dia em que o veredito for registrado, a alínea
   **reprova** e força a remoção. É o que separa prazo de intenção — e é como o
   veredito volta do job `visual`: **como um par na matriz**.
3. **Marcador não pode ser silencioso.** Id de backlog depende da `develop`, que
   uma worktree de feature não enxerga (R14). Resolução: `achado_id` com
   marcador do namespace da demanda + `achado_id_alocado: false` + pendência
   escrita obrigatória. O que impede o apodrecimento não é o formato do id — é o
   gatilho do item 2. Esperar o id bloquearia uma wave indivisível.
4. **A exceção tem de ser CARGA, e isso se mede.** Rode a varredura **sem** ela:
   se o vermelho não voltar, a exceção não estava segurando nada e o verde era
   vácuo. Medido: retirada a exceção, `mortas` volta de 0 para 1.
5. **A cegueira fica impressa**, como em `oraculo-de-fonte` — inclusive o que
   NÃO se sabe (aqui: se o gate ainda morre com metade da mutação inerte).

**Corolário para pin com prazo aberto:** a mesma doutrina vale para contagem não
fixada. `null` **seco** reprova; `null` com motivo/id/prazo/evento passa e vence
sozinho quando o evento ocorre. E se o pin da árvore fica em aberto, **pine o
sintético** para o gate não ficar sem dentes no intervalo — mas cuidado: um
agregado sobre poucas fixtures já asseridas uma a uma é **redundante**; pine o
que ninguém assere (aqui, a **razão** do indecidível, não a contagem). Ver
[[universo-de-tamanho-um]].
