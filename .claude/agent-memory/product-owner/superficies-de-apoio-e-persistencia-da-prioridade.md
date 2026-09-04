---
name: superficies-de-apoio-e-persistencia-da-prioridade
description: O relatório tem ~11 superfícies de apoio na tela em 4 seções — "Formas de apoio" não é onde elas moram; e o bloco de prioridades é protegido por uma propriedade congelada, não só por gates
metadata:
  type: project
---

Ao refinar qualquer demanda sobre "remover/fundir bloco de apoio" no QuickScan,
dois fatos mudam o custo e quase nunca aparecem na conversa.

**1 · O apoio está espalhado por 4 das 9 seções canônicas, não concentrado em
"Formas de apoio".** Contagem feita lendo o source na 015 (2026-08-31): ~11
superfícies na tela e ~8 no papel. Na tela: o `<details>` "Possíveis formas de
apoio aos demais gaps altos" fica na seção **gaps** (o `RE_GAPS` do `p52Classify`
mantém o balde); os chips de habilitador ficam na seção **target**; TODOS os
blocos V3.2 (`#v32prio`, `#v32direct/contextual/validate`, `#v32base`,
`#v32maturity`, `#v32arch-note`) ficam na seção **context**, porque `p52Classify`
manda `#v32panel` inteiro para lá; só os blocos da Camada 1 e os tiers ficam em
**support**. No papel a Camada 1 **não é impressa** (`body.v32-print-mode .wrap
{display:none}`) — logo `apoioBlock` e os tiers T2/T3 nunca chegam ao PDF, e o
`pr-gapsup` do §UAT-07 é **papel-only**. Qualquer proposta de "convergir gaps e
apoio" tem de dizer em qual das duas superfícies age.

**2 · "Prioridade declarada nunca desaparece" é PROPRIEDADE, não detalhe de
teste.** Vem da 3.2.2-A/3.2.3-B e é guardada por `V10`, `V15(A)`, `V21`, `V22`
(`tests_ui_m32.js`), `P5`/`P7` (`tests_ui_m332.js`, no papel), `D010-ABS1(f)` e
`P52-SUP3`. É ela que impede aplicar o *Bloco de ausência* / a partição por
payload da errata E18 ao bloco das prioridades. Revogá-la é frase do
proprietário, não execução — e enfraquecer os gates para passar é R10 §1.

**3 · Cuidado com "remover o sufixo de versão do título".** Recomendei isso na
009 (P7) e na 010 (P8). Na 015 **refutei minha própria recomendação**: o sufixo
"· contexto V3.2" é jargão, mas é o **único desambiguador** entre dois títulos
adjacentes que compartilham quatro palavras. Removê-lo isolado piora a
redundância que o cliente reclamou. O título da 7ª seção é Camada 1 `frozen` —
logo a desambiguação só pode acontecer do lado V3.2.

**Why:** a leitura literal do pedido do cliente ("remover a seção") custaria 7
gates em 4 suítes e uma propriedade de produto — e apagaria a superfície mais
rica do relatório justamente quando o facilitador declara contexto. Sem contar
as superfícies e medir o que cada uma entrega em cada estado, isso passa por
"UI-only".

**How to apply:** na Fase 0, antes de aceitar "esse bloco é redundante",
inventarie por FONTE e por SEÇÃO (não por título) e diga o que cada superfície
entrega em cada estado de sessão. Ver
[[project-quickscan-duas-doutrinas-recomendacao]] e
[[project-gates-ancora-normativa]].
