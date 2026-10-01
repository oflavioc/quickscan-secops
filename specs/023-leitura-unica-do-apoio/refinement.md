# Refinamento — 023-leitura-unica-do-apoio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Aberta em 2026-10-01, por relato do proprietário após sessão real na v3.2.10.

## Necessidade

Sem contexto tecnológico declarado — que é o caso comum — a seção *Formas de apoio*
apresenta **o mesmo conjunto duas vezes**: a lista congelada *"Pode fazer sentido —
após validação"*, item a item por sinal, e logo abaixo os cards por produto. Nada
no documento diz que são a mesma coisa, e o leitor interpreta como erro.

> *"Não entendi essa divisão de lista e depois card em 'formas de apoio', para mim,
> está um pouco confusa essa seção e ela poderia ser mais direta indo apenas para
> 'FORMAS DE APOIO', e abaixo, 'COMO A FORTINET PODE APOIAR NAS PRIORIDADES
> DECLARADAS', e já aparecer os cards logo abaixo"*

**Por que agora**: a demanda 020 propôs exatamente isto e foi **refutada pelo
proprietário** em 2026-09-24, pelo custo medido de UMA rota. Em 2026-10-01 ele
**reverteu a decisão** (*"Vamos de C"*), com três rotas medidas na mesa. A reversão
é dele; esta demanda a executa.

## Enquadramento de produto

**Esta demanda não é "implementar o que foi pedido".** As três rotas conhecidas
custam invariante, e nenhuma delas entrega *"ir direto para os cards"* sem preço.
Ela existe para **achar uma quarta rota ou decidir conscientemente qual invariante
vale menos que a legibilidade** — e essa segunda saída é do proprietário, não minha.

**Invariantes tangenciadas (R1)**

- **INV-9** (superfícies congeladas protegidas por boundary) — a lista é Camada 1.
- A **`C1` da demanda 010** — *"sem substituto, a recomendação congelada permanece
  VISÍVEL"* — é o centro do problema, e ver §Sistema real, item 4.

**Conflito com decisão registrada?** **Sim, e declarado**: `design-decisions.md`
registra a refutação da 020. A entrada recebeu **emenda** em 2026-10-01 com a
reversão e o motivo; ela fica como trilha, não é apagada (R2 §5).

**Alternativa mais simples considerada**: uma linha explicando que as duas leituras
são o mesmo conjunto. **Foi implementada, medida e retirada no mesmo ciclo** — ver
§Sistema real, item 5. Não basta: ela só cabe depois do momento em que o leitor se
confundiu.

## Sistema real

Verificado por execução, não suposto.

**1 · A arbitragem JÁ sabe esconder essa lista.** `ui_v32.js:109` —
`HIDE_EYEBROWS` inclui `"Pode fazer sentido — após validação"` pelo nome. O
mecanismo existe e nomeia o alvo.

**2 · Ela não dispara porque o substituto não é reconhecido.**
`hasSubstituteV32` (`ui_v32.js:702`) exige uma capability com apresentação `card` e
payload, e **exclui explicitamente `CONTEXT_NOT_INFORMED`** (`:707`). Sem contexto
declarado não há card de capability, logo não há substituto.

**3 · Mas a visão por produto existe nos DOIS casos.** Medido:

```
SEM contexto | hasSubstitute=false | 0 nós ocultos | lista legada VISÍVEL | 11 cards por produto
COM contexto | hasSubstitute=true  | 3 nós ocultos | lista legada OCULTA  | 11 cards por produto
```

A redundância aparece **só sem contexto declarado**, e some sozinha quando o cliente
declara. O cliente mais cuidadoso vê a tela limpa; o comum vê a confusão.

**4 · DIVERGÊNCIA ENTRE INVARIANTE E PRODUTO — a pista principal.** A `C1` da 010
foi escrita quando a visão por produto **não existia**. Hoje ela existe sempre, e o
`EA-65`/`EA-68` a tornaram independente de contexto declarado. Então a proposição
*"sem substituto, a congelada permanece visível"* descreve um mundo que mudou:
**existe substituto, e ele não é contado.**

Isso muda a natureza da conversa. Alargar `hasSubstituteV32` sem mais nada deixaria
o `D010-ARB1` **sem sujeito** — toda sessão com gap tem card por produto, logo "sem
substituto" só existiria sem gap algum, e aí não há recomendação legada para
esconder. Mas a saída não é necessariamente "não mexer": pode ser que a invariante
precise ser **reescrita pelo dono dela**, e aí não é tautologia, é uma proposição
que envelheceu.

**5 · As duas posições úteis para uma linha explicativa estão fechadas.** Medido:

| posição | o que acontece |
|---|---|
| antes do título congelado | `p52Classify` **reclassifica o nó para outra seção** — foi parar em `p52-sec-gaps` |
| entre a lista e os cards | `D010-ARB1 (c)` reprova por **vacuidade**: em modo legado os cards *são* os blocos contíguos que a alínea conta |

A segunda confirma, por execução, o aviso que o autor da `fronteira()` já havia
deixado no código.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| B1 | contexto declarado | a arbitragem já resolve: 3 nós ocultos, uma leitura só. **Nada deve piorar aqui** |
| B2 | sem contexto, com gaps | o caso do relato: hoje duas leituras; é o que a demanda tem de resolver |
| B3 | sem gap algum | não há recomendação legada nem cards; nada a arbitrar |
| B4 | modo legado (`isLegacyModeV32`) | a V3.2 não governa; a leitura congelada é a única e permanece |
| B5 | curadoria suprimiu todos os produtos | não há cards; a lista congelada não pode sumir sem substituto |
| B6 | sessão sem suficiência | o gate de suficiência já governa o que se publica; a demanda não o toca |

**B5 é o caso que mais protege a `C1`**: se a curadoria esvaziar a visão por
produto, o substituto deixa de existir **naquela sessão** — e a lista congelada
tem de voltar. Qualquer desenho que ignore isso recria o vão que a 010 existe para
impedir.

## Vocabulário

A registrar no `CONTEXT.md` na Fase 1, se o desenho os exigir:

- **Substituto** — o termo existe na 010 pela via do predicado, mas não no
  glossário. Esta demanda muda o que conta como substituto; o verbete tem de
  nascer **por critério**, nunca por lista (R12 / `EA-47`).

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | O que incomoda na seção | *"não entendi essa divisão de lista e depois card… poderia ser mais direta"* |
| 2 | Medir a arbitragem antes de decidir | *"Confirmo, mede a arbitragem"* |
| 3 | Redação da linha explicativa | *"precisamos ser mais objetivos… sem aumentar desnecessariamente e sem duplicidades"* |
| 4 | Linha paliativa, remover, ou estrutural | *"Vamos de C"* — a estrutural |
| 5 | Enquadramento desta demanda | *"Abre a 023 com esse enquadramento"* |

## Fora de escopo (explícito)

- **Não mexe no motor** nem em arquivo `frozen`.
- **Não remove conteúdo da Camada 1 sem substituto** — é a invariante que a 010
  existe para proteger, e o `B5` é o teste dela.
- **Não altera score, suficiência nem o que o motor recomenda.**
- **Não reabre o escalonamento da 022** — ondas, teto e tensão ficam como estão.
- **Itens 2 e 3 do lote `EA-58`** seguem fora.

## O que esta demanda PODE concluir, e o proprietário precisa saber

Que **nenhuma rota vale o preço**, e a decisão certa seja manter a refutação da 020
com a emenda registrando a segunda tentativa. Isso é um resultado legítimo da Fase
0 e não é fracasso: a 020 já produziu um, e o registro dela foi o que tornou esta
conversa mais barata.
