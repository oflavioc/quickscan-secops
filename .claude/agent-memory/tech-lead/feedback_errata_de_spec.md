---
name: erratas-de-spec-forma-e-precedente
description: Errata de spec segue a forma da §"Errata de fidelidade" da 009 (o que estava escrito / fato medido / o que passa a valer / classe), amenda também a célula do critério e nunca reescreve seção de ratificação anterior
metadata:
  type: feedback
---

Quando o pedido é "errata no padrão das anteriores", o molde é
`specs/009-leitura-do-relatorio/spec.md`, seção **"Errata de fidelidade — registro
da autorização"**: cabeçalho de trilha (quem decidiu, quando, onde, alcance, **o
que NÃO é reaberto**) e um `### E<n>` por item, cada um numa tabela
`Campo | Registro` com *O que estava escrito* → *Fato medido/Por que estava
errado* → *O que passa a valer* → *Onde o gate já afirma isso* → *Classe*.

Dois hábitos que fazem a errata valer alguma coisa:

1. **A errata não vive sozinha.** Amende também a **célula do critério** e a linha
   da fixture, citando `(E<n> da errata)` — foi assim que a 009 fez em C5/C8/C10.
   Errata que só descreve o conserto deixa o texto vigente errado para quem lê a
   tabela de critérios, que é quem escreve o gate.
2. **Não reescreva seções de ratificação anteriores.** Autorização nominal §29.4,
   troca de âncora e critérios `D0NN-*` ficam intactos e a errata diz
   explicitamente que ficam — a trilha precisa distinguir o que o proprietário
   ratificou do que foi decidido sob delegação
   ([[autoridade-delegada-2026-08-29]]).

**Variante "critério que CAI", e o timing dela.** Quando o orquestrador derruba um
critério já aprovado (015: o C4 caiu por decisão dele, com o PO classificando a
evidência como fraca), a errata é **tarefa de wave 0 — antes do red**, por duas
razões mecânicas: o `spec-validate` da Fase 6 extrai critérios da spec e
classificaria o critério ausente como **"faltando"**, a classe mais cara; e o
`qa-engineer` precisa saber que escreve *N-1* gates antes de escrever o primeiro.
Registre também os **mutantes que caem junto** como ids **aposentados** (nunca
reutilizados, R12) e diga o que volta a ser resíduo aberto. Se a própria spec já
previa a queda por escrito, diga isso: aí a errata é **execução de uma cláusula da
spec**, não emenda contra ela — e não precisa de ratificação.

**Why:** erratas aqui são frequentes porque a medição chega depois do texto (Fase
4/Wave 1), e a auditoria futura precisa reconstruir *o que valia quando*. O
cabeçalho com "quem decidiu/quando/onde" é o que separa decisão delegada de
ratificação pessoal; sem ele, uma errata sob delegação passa a parecer aprovação
do proprietário.

**How to apply:** cheque antes se algum item enfraquece asserção, amplia boundary
ou muda veredito de gate alheio — se sim, **pare e escale** em vez de escrever a
errata. Se todos os itens **fortalecem** o que se mede e o estado novo vive em
arquivo da própria demanda, a errata cabe sob delegação; declare isso numa linha
do cabeçalho. Ver [[vacuidade-medida-antes-do-gate-nascer]].
