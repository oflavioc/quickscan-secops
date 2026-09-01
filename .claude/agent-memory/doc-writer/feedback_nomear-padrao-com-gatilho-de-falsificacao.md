---
name: nomear-padrao-com-gatilho-de-falsificacao
description: Antes de registrar uma família de achados (estilo EA-20/EA-31), exigir origens independentes, mecanismo verificável hoje e gatilho de falsificação escrito — e declarar o viés de amostragem da janela em que os casos apareceram
metadata:
  type: feedback
---

Achado-família (o que nomeia um padrão em vez de um defeito) só se registra com
três coisas escritas no próprio bloco: **origens independentes** (agentes/métodos
diferentes, não a mesma leitura contada três vezes); **mecanismo verificável
agora**, sem estatística (p.ex. "nenhum stage do `pipeline.yaml` compara registro
com execução" — isso se confere hoje); e **gatilho de falsificação** — a condição
que, se ocorrer, faz o achado ser riscado com a razão (R2 §5).

E declarar o **viés de amostragem**: se os casos nasceram todos na mesma janela
(revisão de registro, Fase 6 de uma demanda), a frequência observada mede onde se
olhou, não o repositório. Isso vai escrito, não omitido.

**Why:** o proprietário pediu explicitamente o julgamento nos dois sentidos —
*"ver padrão onde há coincidência é tão custoso quanto o contrário"* (2026-09-01,
leva de achados da 015/014). O `EA-20` sobreviveu porque tinha alvo próprio (o
critério de nascimento de gate, R10) e não era "o quarto item de uma lista"; o
`EA-31` foi aceito pelo mesmo teste, completando a tríade instrumento doente ×
gate sem poder discriminante × registro que diverge da execução.

**How to apply:** quando uma leva de achados parecer ter eixo comum, contar
quantos realmente casam (na leva de 2026-09-01 eram 6 de 10 — quatro eram achados
de produto), separar **membros** de **casos de fronteira** e de **adjacentes** com
a razão de cada corte, e só então propor o id de família. Ver
[[alocacao-ids-ea]] e [[status-do-achado-contra-o-fonte]].
