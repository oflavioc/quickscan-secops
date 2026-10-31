---
name: homonimo-no-glossario
description: Doutrina de homônimo no CONTEXT.md (021/2026-10-16) — palavra já ocupada por outra família entra com cabeça QUALIFICADA e remissiva nos dois sentidos; "termo já está no glossário" verifica-se por verbete E por sentido; e o _Evitar_ tem dois registros (tela × conceito)
metadata:
  type: project
---

Três regras que nasceram juntas, na condição (4) do meu aceite da 021 (modelo
Opus 5, branch `fix/verbetes-ancoragem`):

1. **Cabeça qualificada, nunca nua.** Palavra que o glossário já usa em outra
   família entra como `**Ancoragem do apoio**`, não `**Ancoragem**` — e a cabeça
   da família antiga (`Âncora de mutante`) ganha a remissiva de volta, senão a
   desambiguação só existe para quem já sabia. Fecho explícito que evita a
   próxima colisão: *"neste repositório, âncora sem qualificador é do
   instrumento"*. O **identificador no código não entra na decisão** (INV-10):
   decide-se o termo de domínio.
2. **"O termo já está no `CONTEXT.md`" verifica-se por verbete E por sentido.**
   O grep acha a palavra e **lava a afirmação falsa**: a 021 declarou três termos
   cobertos; `capability` estava, *Ancoragem* nunca existiu, e *caminho de apoio*
   estava como `_Evitar_` de outro verbete. "Âncora" aparecia quatro vezes como
   cabeça (todas de instrumento) e uma quinta em prosa (`âncora normativa`) — hit
   no sentido errado é pior que hit nenhum.
3. **`_Evitar_` tem dois registros.** O registro da **tela** (nome de seção que o
   leitor vê: *formas de apoio*, Camada 1 `frozen`; *caminhos de apoio*, 5.x sob
   §29.4) é citação e é livre; o registro do **conceito** é o que o `_Evitar_`
   proíbe — *predicar* com o sinônimo ("todo gap recebe caminho de apoio" fala do
   ITEM e deve dizer *habilitador*). O substantivo nu (*apoio*) nomeia a
   SUPERFÍCIE e é livre, inclusive em slug.

**Why:** a 021 reancorou mutantes (sentido instrumento) **na mesma demanda** em
que introduziu a ancoragem de apoio (sentido produto), e ninguém viu. O custo não
é teórico: o glossário **já carrega a colisão consumada** — `**Onda**` é cabeça
duas vezes, `:153` (etapa da Estrutura Agêntica) e `:416` (conjunto de frentes do
relatório), sem uma linha de distinção, porque o segundo nasceu solto na seção
`## Estrutura (processo)` sendo termo de produto. Sem a regra 1, "Ancoragem"
teria sido a terceira. E a regra 3 existe porque a pergunta certa do proprietário
— *"o glossário está pedindo que a documentação fale uma língua que o produto não
fala?"* — tinha resposta medida: a palavra do cliente está na Camada 1 congelada,
logo o `_Evitar_` tinha de delimitar registro, não vencer o produto.

**How to apply:** antes de gravar verbete, grep da palavra-chave no `CONTEXT.md`
inteiro e ler **cada** hit pelo sentido; se houver família ocupando a palavra,
cabeça qualificada + remissiva nos dois lados, na mesma emenda. Em aceite de
Fase 6, tratar `§Vocabulário` do `refinement.md` como **afirmação a medir** —
é o item 1 de [[checklist-de-fase-6-do-po]]. Definição segue
[[verbete-define-criterio-nao-lista]]; a trilha de emenda fora de Fase 0 segue o
precedente do cabeçalho (017/2026-09-09).
