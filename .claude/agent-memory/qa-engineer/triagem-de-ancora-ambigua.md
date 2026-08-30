---
name: triagem-de-ancora-ambigua
description: Quando a âncora casa 2 vezes, o gate pode ser incapaz de dizer qual sítio é o certo — se a asserção varre o ARQUIVO e o desc fala de uma FUNÇÃO, os dois sítios morrem com a mesma frase; quem discrimina é a arqueologia e a camada de baixo
metadata:
  type: project
---

`ocorrencias >= 2` não é "escolher a ocorrência que passa": é responder **qual
das duas carrega a propriedade** e provar que a outra não carrega. Duas
armadilhas medidas na E2 estendida da 013 (W6b, 2026-08-29).

## 1. Gate file-scoped não discrimina sítio function-scoped

`p50/M35` (`desc`: "renderer **do gate** passa a conter o limiar literal") tinha
`ocorrencias=2` em `ui_p50_results_v32.js`: `p50Matrix` (agregado por domínio) e
`p50BuildResults` (a superfície do gate). A asserção que mata é uma **varredura
do arquivo inteiro** (`P50-SUF0`: "contém comparação com o limiar global 10").
Consequência: mutar **qualquer um dos dois** produz `DETECTADO` com a **mesma
frase**. Unicidade e morte-pelo-motivo — as provas (a) e (b) de T9 — ficam
**cegas** aqui. Não adianta rodar mais: o instrumento não tem esse eixo.

Dois oráculos respondem, e nenhum é o gate:

- **Camada de baixo.** Neutralize a asserção que casa o `reason` e rode de novo.
  No sítio certo o mutante continua reprovando por uma asserção **comportamental**
  (`gate da UI 'released' != veredito canônico false em [1,3,2,2,2]`); no sítio
  errado o gate passa **inteiro**. É a prova (c) virada instrumento de escolha.
- **Arqueologia.** `git log -S '<texto da âncora>'` e `git log -S 'function
  <sítio>'`. O sítio que **existia no commit de autoria do mutante** é o sítio.
  `p50BuildResults` nasceu em `4e30c8e`, o mesmo commit que escreveu `M35`;
  `p50Matrix` só apareceu em `e527ef6`, uma microfase depois — nunca foi alvo,
  virou colisão. E `String.replace` pega a **primeira** ocorrência, então desde
  5.0.4 o mutante estava mirando o sítio errado.

O recorte novo (cabeçalho da função + a linha) mede `ocorrencias=1` **nos três
pontos da história** — teria sido correto desde a autoria. Esse é o teste de que
o recorte é refinamento, não escolha.

## 2. Âncora pode nascer podre — e aí o gate nunca rodou nem uma vez

`p52/V322-M3` estava com `ocorrencias=0`. Não era rot: medido com `git show
df5d9f6:<arquivo>`, a âncora já contava **0 no próprio commit que escreveu o
mutante** — o mesmo commit inseriu `p52RestoreEditorFocus(keep);` entre
`p52CapHelp(ed);` e o `}` que a âncora exigia. `V322-CTXPAR1` **nunca** rodou
contra essa mutação. Isso muda a leitura de um número de campanha: o `106/107` do
CI não era sobrevivente nem regressão, era um mutante que nunca existiu na
prática, somado como "não detectado" por um relatório de dois estados.

**Why:** é a tese da 013 um nível abaixo — número que parece medição e não é. Um
`DETECTADO` no sítio errado e um "não detectado" que nunca rodou são o mesmo tipo
de mentira, e nenhum dos dois aparece no relatório sem que alguém vá olhar.

**How to apply:** em toda triagem de âncora, antes de propor recorte, rode
`git log -S` no texto da âncora e no sítio candidato, e compare com o commit de
autoria do mutante (`git log -S '<desc>' -- <harness>`). Duas perguntas de graça:
*quando casou* e *o que quebrou*. Se a asserção que mata for varredura de arquivo
(regex sobre o fonte inteiro), assuma que (a) e (b) não discriminam sítio e vá à
camada de baixo. Ver [[preflight-prova-unicidade-nao-sitio]] e
[[prova-c-em-camadas]].
