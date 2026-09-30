# Relatório final — 022-escalonamento-do-investimento

> Fase 6 · aceite de intenção · 2026-09-30

## O que a demanda entrega

O relatório deixa de tratar quinze gaps como uma lista de compras simultânea. Ele
passa a dizer **quantas frentes a organização sustenta ao mesmo tempo**, a partir
do estágio de maturidade que ele **já media e já mostrava** — e o que não cabe na
primeira onda continua no documento, declarado, com o critério dito.

Pedido de origem, do proprietário, após sessão real na v3.2.9:

> *"não faz sentido somente fornecer produtos para todas as lacunas que forem
> observadas, essa não seria uma proposta realista"*

## Aceite de intenção

**Aceito.** O refinamento pedia encenação de investimento derivada do que a
organização já declarou, funcionando **também sem cenário-alvo**. É o que existe:

- o teto sai do **estágio**, e o estágio já estava no relatório — nenhum número
  novo entrou no produto;
- **a prioridade declarada nunca é cortada**; quando excede o teto, o documento
  **nomeia a tensão** em vez de podar a escolha do cliente;
- **sem suficiência não há escalonamento**, e isso é dito em vez de assumido;
- o cenário-alvo **refina** e nunca substitui — e a ausência dele não exclui
  ninguém.

O que a demanda **não** entrega, e está declarado: ela não prova que a leitura
ficou boa. Os gates provam existência, origem e integridade. A leitura se mede em
sessão real — foi assim que esta demanda nasceu.

## Medições

```
D022 ESCALONAMENTO: 14 PASS · 0 FAIL de 14
D022 MUTATION:      13 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO de 13
spec-validate:      14/14 · 100%  (com a errata E3, de letra)
payload M41:        9794b267… — idêntico ao pinado; a régua D2 não se moveu
frozen:             4 identidades OK — nenhum tocado
```

Sem regressão: `d010 13/13` · `d015 5/5` · `d019 14/14` · `d021 8/8` ·
`p52layout 45/45` · `d014 7/7`.

## O que custou caro, e por quê

**Três erratas, e as três vieram de medir em vez de supor.**

`E1` — o `C7` se apoiava em *"alvo igual ao atual"*, estado que o produto
**descarta** (`revalidateTargets` o apaga no render). O critério media algo que não
sobrevive. O sinal virou a **ausência declarada**, que persiste. E o `C5` mudou
junto: a união passou a incluir as excluídas, porque a redação original só se
sustentava sem exclusão alguma — teria reprovado o produto certo.

`E2` — o `EA-75` se resolveu **onde a visão por produto já existia**, em vez de
reindexar a seção por capability. Custo evitado, medido: 55 asserções em 5 suítes.

`E3` — a letra do `C1`, alinhada ao que o plano aprovou.

**Sete defeitos meus, achados pelos portões e pela campanha:**

| o que | quem pegou |
|---|---|
| três alíneas que casavam texto solto no relatório inteiro e passavam **vazias** | inspeção, antes de implementar — o placar caiu de 8 para 6 |
| `data-qs22-frente` nas duas ondas: o papel dizia 15 frentes onde o contrato decidira 3 | `D022-PAP1` |
| a camada de layout chamando o domínio | `P52-GOV1` |
| guard por `pr.n` — o catálogo do motor usa `name` | instrumentação |
| chave por id: quatro produtos duplicados na visão por produto | `D022-PROD1` |
| escopo alargado além da errata: `FortiSIEM Cloud` e `FortiNDR Cloud` entraram sem pedido | releitura própria |
| três gates frouxos — fixture que mascarava, alínea com sujeito errado, snapshot tarde demais | a campanha de mutação |

O último é o que mais importa: o `D022-INV1`, que afirma *"escalonar não altera
estado canônico"* — cláusula `UX-P8` da spec selada —, **media depois do primeiro
render**. A escrita que o mutante introduz acontece durante ele, entrava no
"antes", e o gate comparava duas fotos do mesmo estrago. Ele afirmava uma promessa
selada da fase 5.0 sem nunca tê-la medido.

## Dois achados abertos no caminho

- **`EA-76`** — a derivação *"o que o motor ofereceu"* existe em **duas cópias**, e
  a segunda é **porteira** da primeira. Foi ali que o `EA-75` morria, e o
  diagnóstico custou quatro ciclos. É a **quinta instância na mesma semana** da
  mesma classe: cópia literal de um valor com dono.
- **`EA-77`** — `bridges.json` declara `__QS_STAGE_RULER` como sendo de
  `ui_ux_v32.js`; ele vive em `ui_v32.js:991`. O `lint-arch` verifica que o bridge
  esteja registrado, não que o dono declarado seja o dono.

## Fronteira

Nenhum arquivo `frozen` foi tocado. `ui_v32.js` (`§29.4`) foi alterado sob
**autorização nominal do proprietário no chat, 2026-09-28**, pedida **antes** de
qualquer edição — a ordem que a R6 §5 manda, e que o `P50-GOV1` cobrou no lote
anterior quando foi feita ao contrário.

## Fora de escopo, como declarado desde o refinamento

Itens 2 e 3 do lote `EA-58` — catálogo (`FortiNAC`, `FortiClient EMS`, `FortiSOC`,
`FortiSOAR`) e `SCORES`. São conteúdo novo e mudança de nota; esta demanda encena
o que já existe.
