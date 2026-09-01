---
name: oraculo-independente-do-instrumento
description: Gate que pega a população do próprio instrumento compara o julgado consigo mesmo; leia a fonte por conta própria — e a alínea de conjunto declarado vira testemunha da fiação
metadata:
  type: feedback
---

Quando o gate julga um **relatório** produzido pelo instrumento sob teste, toda
alínea que compara "o que o relatório diz" contra "o que o relatório diz" é
círculo. A população, a âncora e o universo têm de vir de uma **fonte que o
instrumento não controla**.

**Why:** na 014 (2026-09-01) o primeiro desenho de `D014-VARR1` chamava
`varrerArvore()` e julgava `rel.populacao` contra uma lista de harnesses. Se o
instrumento enumerasse metade dos mutantes, a alínea passaria — ele estaria
concordando consigo mesmo. Pior: instrumento ausente derrubava os **seis** gates
com a mesma mensagem, colapsando estados (o vermelho não dizia o que ainda
funcionava). É o dual de [[julgador-que-concorda-com-a-fixture]], um nível acima:
lá o gabarito vem do objeto julgado, aqui o **universo** vem.

**How to apply:**
- A suíte lê a fonte por conta própria (aqui: `<cmd> --preflight` de todo harness
  com `"preflight": true` no `mutation_map.json`, oráculo = o JSON de C1) e o
  relatório do instrumento é conferido **contra** ela. Não é R10 §6: preflight
  não é suíte, não muta, não roda gate, e quem já o consome assim é o próprio
  stage `mutation`.
- Aceite `rel === null` no julgador puro: as alíneas dependentes do relatório
  saem NOMEADAS como não medidas, as independentes seguem medindo. Efeito real:
  o red passou de "6 gates, uma mensagem" para "49 de 49 mutantes de CSS sem
  `find`/`repl` no contrato C1" — vermelho substantivo, que é o red da wave
  seguinte, e não uma ausência de arquivo.
- **A alínea de conjunto declarado é a testemunha da fiação.** `C3(*)` comparava
  o conjunto de exclusões do registro contra a lista literal da spec; ela passar
  prova que o gate leu o registro REAL, não um default vazio. Sem uma alínea
  assim, um gate que falhasse em carregar o arquivo passaria vacuosamente em
  todas as alíneas de "para todo item, ...". Toda vez que houver `for each` sobre
  uma lista carregada de disco, ponha ao lado a alínea que fixa **qual** lista é.
- Corolário de quantificação: não digite a lista de fontes. Quantifique sobre o
  registro que as declara (`preflight: true`), e nomeie as que ficam de fora
  (`sem_preflight`). Lista digitada dentro do julgador reproduz, no julgador, o
  defeito do gatilho por path — ver [[cenario-sem-mutante-e-cenario-nao-medido]].
