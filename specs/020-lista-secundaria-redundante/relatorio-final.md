# Relatório final — 020-lista-secundaria-redundante

> **Demanda REFUTADA no portão da Fase 0.** Nenhuma linha de produto mudou, e
> esse é o resultado — não uma interrupção dele.

## Veredito

**Não remover a lista secundária *"Pode fazer sentido — após validação"*.**

Decisão do proprietário no chat, **2026-09-24**, respondendo à única pergunta do
portão da Fase 0:

> *"Não remover a lista, fecha a 020 como refutada"*

## O que se perguntou

> **A redundância incomoda mais do que o custo de removê-la?**

Desde 2026-09-22, o mesmo produto aparece em dois lugares da mesma tela: como
card na visão por solução e como item na lista secundária. Isso não era verdade
quando a 019 foi desenhada — passou a ser quando o `EA-68` fez a visão derivar do
motor e ela foi de 2 para **11 produtos**, 9 deles com o qualificador *"após
validação"*, que é exatamente a população da lista.

## Por que a resposta "não" é a certa, e não uma acomodação

O custo estava **medido**, e não estimado:

```
remover o título congelado derruba CINCO gates da demanda 010
  D010-ARB3 · INV7 · CARD1 · CARD2 · CARD3
raiz única: as fixtures D010-F3 DECLARAM o título como presente
```

Não é gate de apresentação que se reancora. É o **oráculo declarado de outra
demanda** — a 010 existe para impedir que conteúdo da Camada 1 desapareça sem
substituto, e mudar o que ela declara presente, de fora dela, é decidir a direção
sem decidir (R10 §1).

Do outro lado da balança: **legibilidade**. Um produto visto duas vezes na mesma
tela. Nenhuma afirmação falsa, nenhum dado errado, nenhuma decisão do cliente
prejudicada.

**Custo estrutural contra benefício estético.** A resposta "não" é a proporcional.

## O que fica registrado para não voltar como achado

A redundância passa a ser **decisão confirmada**, não defeito pendente. Entrou em
[`.claude/rules/design-decisions.md`](../../.claude/rules/design-decisions.md)
com a fonte, e a R13 é explícita: *reapresentar decisão confirmada como defeito
gera ruído e desgasta a confiança nos achados reais.*

Este relatório existe para que a pergunta, quando for refeita — e ela será —,
encontre a resposta e o custo em vez de recomeçar a medição.

## Erro de estimativa registrado

Em 2026-09-22 estimei o custo desta remoção em *"uma reancoragem de gate visual,
ciclo de uma hora"*. **Errado por uma ordem de grandeza.** A execução derrubou
cinco gates de outra demanda e foi revertida.

A estimativa errada por pouco teria produzido a decisão oposta: fosse mesmo uma
hora, remover seria óbvio. **Foi a medição que mudou a resposta**, não a
preferência — e é por isso que ela veio antes do portão, e não depois.

## Estado da máquina

| item | estado |
|---|---|
| fase | `done` — encerrada na Fase 0, sem `specify` |
| artefatos | `refinement.md` + este relatório; `spec-validate.md` **não se aplica** (não houve spec a validar) |
| `fecho_pendente` | removida — era válvula para a decisão que agora existe |
| produto | **intocado**; nenhum commit de código nesta demanda |
