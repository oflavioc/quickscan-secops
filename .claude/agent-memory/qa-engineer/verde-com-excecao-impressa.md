---
name: verde-com-excecao-impressa
description: Vermelho crônico é remédio pior que a doença (EA-5); a saída é verde com exceção impressa — asserção idêntica, objeto com dono/id/prazo, prazo auto-executável, e a exceção tem de ser CARGA; e como ela morre (EA-32) — cinco atos num commit, evento provado por registro antigo × matriz nova
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

## Como a exceção morreu (fix-finding do EA-32, 2026-09-04, commit `8d753bc`)

O evento se cumpriu como escrito: o par `p52/P52-RA8` entrou na matriz e a
exceção saiu — **no mesmo commit**. Cinco atos indivisíveis: partição do
mutante · remoção da exclusão · literal `PARES_DECLARADOS` do instrumento de
volta a dois · `arvore.contagem` fixada por execução · pares na matriz. Qualquer
subconjunto deixa `C3(*)`/`C3(c)`/`C3(e)` ou `C2(zero)` vermelha entre commits.

**Prove que o prazo era real antes de fechá-lo.** Em worktree efêmera:
instrumento e registro de HEAD (exclusão viva, `contagem: null`) contra o
harness partido e a matriz nova → **exatamente** `C3(e)` e `C6(cont-arvore)`
reprovam, ambas por *PRAZO VENCIDO* ("observado hoje = 21"), e nada mais cai.
Sem essa medição, "o evento dispara" seria promessa do desenho, não fato.

**O red do fecho não precisa de commit vermelho.** A prova de carga (amarra 4)
*é* o red: `varrerArvore()` do instrumento só com as exclusões restantes, sobre o
harness ainda inteiro, devolve `mortas: 1`; sobre o harness partido, `0`. Fica
registrado em três lugares (mensagem do commit, errata, `_meta.exclusoes_encerradas`)
e o desvio de R3 §4 vai declarado ao orquestrador — a atomicidade venceu porque
o custo do estado vermelho intermediário já tinha nome (EA-5).

**O que fica**: a classe (`mutante-parcialmente-inerte`) e o motivo
(`achado-aberto`) continuam no vocabulário; a forma "pendência bem-formada"
continua como cenário **sintético** de `D014-DISC1` — o julgador que só passa
com inteiro não mede a válvula. A trilha da exclusão vai para
`_meta.exclusoes_encerradas` (R2 §5), nunca se apaga.
