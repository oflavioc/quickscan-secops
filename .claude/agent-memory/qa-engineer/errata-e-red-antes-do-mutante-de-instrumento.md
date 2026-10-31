---
name: errata-e-red-antes-do-mutante-de-instrumento
description: Ordem que funcionou no fix-finding EA-39 (2026-09-05) — aplicar o red na árvore suja e MEDIR, commitar a errata citando os números medidos, só então o commit red; mutante de instrumento ancorado em código que ainda não existe é âncora podre (preflight/IC-4 derrubam o stage) — declare o kill esperado no registro e escreva o par com o green
metadata:
  type: feedback
---

Quando o red de um fix vem acompanhado de errata da spec (T090 antes de T091,
como o `tech-lead` desenhou: o `spec-validate` extrai critérios da spec, e as
fixtures/mutantes novos precisam existir nela antes do primeiro red), a
sequência que não deixa alegação sem execução é:

1. aplicar as edições do red (fixtures, registro, gate) na árvore de trabalho e
   **medir** (`--sonda`, gate nu sem pipe, preflight com a âncora que não pode
   mudar);
2. commitar a **errata** — a célula "Onde o gate já afirma isso" cita os números
   medidos em (1) e diz "medido na árvore de trabalho antes deste commit e do
   seguinte";
3. commitar o **red** com a mensagem canônica (`test(<id>): red — <código>`) e
   os mesmos números no corpo;
4. registros que não dependem do green (medição pré-fix, dívida declarada) em
   commit `doc` próprio — repin do orquestrador depois, um por conteúdo (R8 §1).

O que **não** entra no red: mutantes de instrumento (`D016-M34`/`M35`) cujas
âncoras são linhas que o `core-engineer` ainda vai escrever. Ancorá-los por
adivinhação dá `ocorrencias=0` no preflight — `NÃO EXECUTADO · âncora não
encontrada` na campanha e IC-4 vermelho no stage `mutation` — um vermelho no
lugar errado, que não é red de gate. E `check_mutation` IC-5 reprova par na
matriz sem mutante no harness, logo a matriz também espera. O que se registra
agora, no `_trilha`/`acrescimos`/dívida, é o **kill esperado** de cada par
(F25 → `EM VOO · 0` sob M34; F26 → `piso-invalido` sob M35) e a condição dura
que o green não pode violar (âncora de M33 byte-idêntica e única, campos
populados antes dela).

**Why:** R2 §1 e R3 §4 — a errata é uma alegação sobre o gate; sem a medição
prévia ela nasceria com números previstos, e o commit red seria o único lugar
onde a prova vive. E a memória [[repl-invalido-vira-nao-executado]] já mostrou
que réplica/âncora inválida vira NÃO EXECUTADO, nunca DETECTADO — escrever o
mutante antes do código só produz isso.

**How to apply:** em todo fix-finding tipado `fix` com errata: medir → errata →
red → registro; deixar na `DEPENDÊNCIAS` a lista exata de âncoras que o par
novo vai precisar (a linha do ramo em `_impedimento`, o bloco cuja ordem M35
troca) para o implementador não fragmentar a linha. Ver
[[mutante-de-arvore-amarrado-ao-ciclo-de-vida]] para a outra ponta (par que
muda de código no tempo) e [[medir-red-do-proprio-julgador]].
