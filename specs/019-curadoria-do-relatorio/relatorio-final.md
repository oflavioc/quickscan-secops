# Relatório final — 019-curadoria-do-relatorio

> Fase 6 · `product-owner` + `qa-engineer`. Conduzido pelo orquestrador no
> contrato de cada dono, sob a delegação de 2026-08-29. **Nenhum agente escreve
> em registro de aceitação**: este documento *reprova* ou declara *"não encontrei
> objeção"* (R4 §D3). O aceite é do proprietário, no chat.

## O que a demanda entrega

O engenheiro passa a decidir **o que de fato será apresentado** como recomendação.
O motor escolhe automaticamente; ele mantém, remove ou acrescenta, pelo critério e
pela experiência dele — e o relatório diz quando a presença de um item é decisão
sua.

Junto vem a reorganização que a curadoria exigia: a seção de apoio deixa de
agrupar por gap e passa a agrupar por **produto**, seguindo a divisão oficial do
portfólio. Medido na sessão de referência: **15 blocos → 9 cards**, com
`Serviços FortiGuard` deixando de aparecer cinco vezes.

## Aceite de intenção, contra o [refinement.md](refinement.md)

| Decisão do portão da Fase 0 | Entregue? |
|---|---|
| **P1** · curadoria é **seleção**, nunca redação | **sim** — `set()` recusa id fora do catálogo e valor fora do enum; o editor não tem campo de texto, por desenho |
| **P1 (a)** · acrescentar produto do catálogo que o motor não ofereceu | **sim** — lista "Acrescentar por decisão sua" |
| **P1 (b)** · acrescentar produto fora do mapeamento atual | **sim** — mesmo caminho; o card é montado do catálogo e leva selo de proveniência |
| **P1 (c)** · escrever texto livre — *"esse é desnecessário"* | **não existe**, e o `D019-CUR1` tenta redigir a cada execução para provar que continua não existindo |
| **P2** · persistência como **sexta chave canônica** | **sim** — `reportCuration`, omitida quando nada foi declarado |
| **P3** · proveniência por **item**, no padrão de `Observações da sessão` | **sim** — `[data-p53-prov]` na tela e no papel |
| **P4** · escopo: só o apoio; a curadoria age sobre o **inferido** | **sim** — score, estágio, suficiência, gaps e prioridades intactos, medidos pelo `D019-MED1` |
| **P4** · **leitura arquitetural** curável | **sim, e só depois desta fase** — ver abaixo |
| **P5** · o apoio por solução entra nesta demanda | **sim** — e a divisão segue <https://www.fortinet.com/products>, como você determinou |

**Não encontrei objeção** aos itens acima, com uma ressalva que não é ressalva de
qualidade e sim de processo: a **leitura arquitetural** chegou à Fase 6 **não
entregue**. A spec da Fase 1 não levou o item da tabela do portão para nenhum dos
dez critérios, e as sete waves seguiram a spec. O aceite de intenção é o que
existe para pegar isso, e pegou. Entregue e medido na iteração 2 do
[spec-validate.md](spec-validate.md) (gap 4).

## Execução

```
D019 CURADORIA: 10 PASS · 0 FAIL de 10
D019 MUTATION:  11 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 11
PREFLIGHT d019: 11 âncoras, todas com ocorrencias == 1
suites:         0 problema(s)        ·  suites-heavy: session 97 PASS · 0 FAIL
m41:            PASS — payload byte-idêntico ao pinado (critério C5)
P50 CORE + P51: 65 PASS · 0 FAIL     ·  d010: 13 PASS · 0 FAIL
d014: 7 PASS · 0 FAIL                ·  d015 MUTATION: 15/15
```

Sonda com curadoria real — um produto retirado e outro acrescentado:

```
TELA  (9) == PAPEL (9), conjuntos idênticos
selos de proveniência: 1 na tela, 1 no papel
"Seleção do engenheiro aplicada. 1 item foi retirado da apresentação; 9 permanecem."
```

Geometria medida no navegador a 1440 CSS px: seção em `display: grid`, 9 cards em
**duas colunas**, cada um a **49%** da largura da seção (o limite do `P52-REC1g`
é 62%), contador `data-p52-support-cards` = 9 batendo com os cards reais.

## Pendente, e declarado como pendente

**As campanhas `p51` e `p52` exigem Chromium** e ficaram
`[FAIL] campanha EXIGIDA (alvo mudou) mas ambiente sem chromium`. É a **KI-3** —
execução canônica no job `visual` do CI. A **T023 condiciona o fecho a esse job
verde**, e com razão: *a geometria da visão por solução é o único risco que esta
máquina não julga.*

## O que custou, e o que isso ensina

Sete defeitos meus, todos pegos por execução e todos corrigidos. Vale listá-los
porque o padrão é mais útil que os itens:

1. **Commitei a W3 rodando só a suíte de sessão** — o pin da §29.4 ficou para trás
   e o `P50-GOV1` esteve vermelho entre dois commits. Suíte que passa não autoriza
   commit; o `run.sh` é que autoriza.
2. **Renames apodreceram âncoras de mutante** — três vezes, e uma delas atingiu
   campanhas de **outras demandas** (`D011-M18`, `D014-M7`). Âncora podre não
   aparece como vermelho, aparece como **silêncio**.
3. **Cinco gates prometiam mais do que mediam** — família do `EA-20`. Quatro
   denunciados por mutante sobrevivente, dois por leitura do gate contra a spec.
4. **O `SOL1` virou tautologia** ao comparar o DOM consolidado consigo mesmo,
   porque a transformação passou a **mover** os nós que ele lia dos dois lados.
5. **O `PROV1` exigia um selo que faria o produto mentir** — carimbar "decisão do
   engenheiro" em item derivado da avaliação.
6. **Dupliquei a emissão do selo de grupo**, e a campanha cobrou na hora com
   `ocorrencias=2`. Âncora ambígua era o sintoma; código duplicado era a causa.
7. **A leitura arquitetural não foi entregue** até a Fase 6.

A lição transversal: **nenhum desses apareceu como vermelho.** Todos apareceram
como verde silencioso, ou como `NÃO EXECUTADO` no meio de outros `NÃO EXECUTADO`
legítimos. O que os expôs foram mutantes sobreviventes, o preflight de âncoras e o
aceite de intenção — três instrumentos que existem exatamente para isso.

Por isso o `--preflight` do `d019` nasceu no mesmo commit da chave do mapa: a
partir de agora, âncora podre desta campanha aparece **antes** de qualquer
mutação, e não depois, escondida.

## Três erratas propostas, pendentes de ratificação

Detalhadas no [spec-validate.md](spec-validate.md). Nenhuma delas afrouxa
asserção; duas corrigem a spec e uma acrescenta critério.

- **E1** — a byte-identidade da C2 ficou impossível quando você decidiu
  consolidar os 15 blocos em 9 cards. O que a C2 protege continua medido, com
  mais dentes do que na redação original.
- **E2** — "no mesmo commit" (spec) contra "no mesmo PR" (R10 §3): o mais estrito
  é inexequível com janela vermelha visível.
- **E3** — acrescentar o critério `C11` para a leitura arquitetural, que o
  refinamento pedia e a spec não carregou.

## Estado

Pronto para PR. **Merge é do proprietário**, e só depois do `done` — que por sua
vez espera o job `visual` verde no CI.
