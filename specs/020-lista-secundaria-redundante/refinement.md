# Refinamento — 020-lista-secundaria-redundante

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> **Quem escreveu**: o orquestrador, no contrato do `product-owner` — os agentes
> de papel existem em `.claude/agents/` mas não estão disponíveis como subagentes
> nesta sessão (precedente da 018 e da 019).
>
> **Estado: aguardando o portão da Fase 0.** Há **uma** pergunta para o
> proprietário, no fim deste documento, e ela é a demanda inteira.

## Necessidade

O leitor do relatório vê **o mesmo produto duas vezes**, em dois lugares
diferentes da mesma tela, dizendo a mesma coisa de dois jeitos.

Isso não era verdade quando a demanda 019 foi desenhada. Passou a ser em
**2026-09-22**, quando o `EA-68` corrigiu a visão por solução para derivar do
motor: ela foi de 2 para **11 produtos**, e **9 deles carregam o qualificador
*"após validação"*** — que é exatamente a população da lista secundária
*"Pode fazer sentido — após validação"*.

A consolidação que esta demanda existiria para fazer **já foi feita**. O que
sobrou é o resíduo: uma lista que agora repete o que o card ao lado já diz.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

- **INV-7** (narrativa determinística derivada de evidência): nenhuma. Remover
  uma apresentação redundante não muda o que é derivado, só onde aparece.
- **INV-1**: nenhuma. Não toca engine nem Camada 1 — o título vive em
  `ui_v32.js:110` (`HIDE_EYEBROWS`), camada V3.2.
- Nenhuma outra: score, estágio, suficiência, gaps e prioridades não são tocados.

### Conflito com decisão registrada

**Sim, e é o motivo de isto ser demanda e não fix-finding.** O fecho do `EA-68`
registra:

> *A lista "pode fazer sentido" ficou INTACTA, e isso é decisão declarada.*

E a spec da 019, Fase 1, lista *"pode fazer sentido — após validação"* na coluna
**curável** — ou seja, previu que ela continuaria existindo para ser curada.
Removê-la contradiz um desenho aprovado. A R4 é explícita: **na dúvida, é
demanda.**

### Alternativa mais simples considerada, e por que não basta

**Ocultar em vez de remover.** Passaria: o censo do `D010-ARB3` só enxerga
`v32-hidden`, e uma classe própria escaparia dele.

Não basta, e a razão é a mesma que o `EA-67` já registrou: **seria contornar pela
letra**. A regra existe para impedir que conteúdo da Camada 1 desapareça sem
substituto. Aqui **há** substituto — os cards —, e é justamente por isso que a
remoção é honesta e a ocultação não seria.

## Sistema real

Verificado no código, não suposto:

| fato | onde |
|---|---|
| o título é um dos três `HIDE_EYEBROWS` da V3.2 | `ui_v32.js:110` |
| o censo da 010 conta `["apoio-block", "t-list", "t-details"]` como contíguos | `tests_010_vao.js:146` |
| a visão por solução já cobre os produtos de `sev 1`, com tier próprio | `ui_p52_support_v32.js` · `ofertaDoMotor()` |
| o módulo **declara** a decisão de não mexer na lista | `ui_p52_support_v32.js:234` |
| o `P52-ICON3` afirma que os ícones **da lista** são materialmente pintados | `tests_p52_chromium.js` · KI-3, só CI |

### O custo, MEDIDO — e ele já desmentiu uma estimativa minha

Em 2026-09-22 tentei a remoção dentro do fix-finding do `EA-68`. Eu havia
estimado *"uma reancoragem de gate visual, ciclo de uma hora"*. **Errado.** A
execução derrubou **cinco gates da demanda 010** — `D010-ARB3`, `INV7`, `CARD1`,
`CARD2`, `CARD3` — todos pela mesma raiz:

```
D010-F3: títulos congelados presentes ["Como a Fortinet pode apoiar agora"]
       != declarados [..., "Pode fazer sentido — após validação"]
```

**As fixtures da 010 DECLARAM aquele título como presente.** Não é gate de
apresentação que se reancora: é o **oráculo declarado de outra demanda**. Mudá-lo
de dentro de um fix-finding seria decidir a direção sem decidir — o que a R10 §1
proíbe. Foi revertido, com `D010` de volta a 13/13.

**Escopo real do trabalho, portanto:**

1. `D010_DECLARED` em cinco gates — mudança de oráculo declarado, com trilha;
2. `P52-ICON3` reancorado (Chromium, só roda no CI);
3. a remoção em si, que é a parte pequena.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | produto de `sev 1` que hoje só aparece na lista | continua visível, como card com qualificador *"após validação"* — **nada some** |
| 2 | sessão sem nenhum gap moderado | a lista já não existe hoje; nada muda |
| 3 | arbitragem da 010 ativa (modo legado) | a lista é conteúdo da Camada 1 sob arbitragem — a remoção **não pode** ressuscitar nem esconder região arbitrada |
| 4 | curadoria exclui um produto | ele some do card; não pode reaparecer pela lista, que não existirá mais |
| 5 | papel (PDF) | a lista sai das duas superfícies ou de nenhuma — `EA-58` é a lição |

## Vocabulário

Nenhum termo novo. *Qualificador*, *visão por solução* e *arbitragem* já estão no
`CONTEXT.md`.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do proprietário |
|---|---|---|
| 1 | (2026-09-22) remover a lista secundária? | *"Sobre o ponto 3, sim, prossiga"* — executado, **revertido** ao medir o custo real |
| 2 | (2026-09-24) seguir com os três itens abertos | *"Vamos seguir com todas"* — abriu esta demanda |
| 3 | **PENDENTE — o portão desta fase** | ver abaixo |

## A pergunta do portão

> **A redundância incomoda mais do que o custo de removê-la?**

Os dois lados, sem inclinar a balança:

**A favor de remover** — o leitor vê o mesmo produto duas vezes na mesma tela, e
foi você quem apontou poluição visual como problema nesta superfície. A
consolidação já está feita; o que sobra é resíduo de uma transição.

**Contra** — o custo não é de apresentação: mexe no **oráculo declarado da
demanda 010**, em cinco gates. Oráculo de outra demanda alterado para acomodar
esta é precisamente o tipo de mudança que envelhece mal, e a 010 existe para
impedir que conteúdo da Camada 1 suma sem substituto.

**Terceira via, que eu não recomendo mas registro:** manter a lista e mudar o
**qualificador dos cards** para que as duas superfícies não digam o mesmo com
palavras diferentes. Não recomendo porque trata o sintoma — a duplicação
continua, só fica mais coerente.

**Sem a sua resposta esta demanda não passa da Fase 0**, e é o lugar certo para
ela parar: o custo é real e o benefício é de gosto, não de correção.

## Fora de escopo (explícito)

- **Não** toca engine, Camada 1, score, estágio, suficiência, gaps ou prioridades.
- **Não** muda a regra de arbitragem da 010 — só as fixtures que declaram quais
  títulos estão presentes.
- **Não** resolve o `EA-69` (acrônimos SIEM/NDR), que é Porta B e tem registro
  próprio.
