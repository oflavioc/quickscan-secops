---
name: red-por-instrumento-ausente
description: Quando o gate importa um instrumento que ainda não existe (desenho gate × instrumento da 014/016), o red "INSTRUMENTO AUSENTE" não prova poder discriminante; prove o GATE com stubs constantes em cópia efêmera e escreva a linha de kill de cada mutante antes de dar o gate por pronto
metadata:
  type: feedback
---

Red por instrumento ausente é red de existência, não de discriminação: TODO caso
sai igual (`INSTRUMENTO AUSENTE ≠ esperado`), então a saída vermelha não mostra
se o gate compara campo a campo, se a guarda de contagem funciona, nem se ele
nomeia a causa. Antes de commitar, rode o gate numa CÓPIA EFÊMERA (fora da
árvore) contra stubs CONSTANTES — funções sem lógica que devolvem sempre o
mesmo objeto, impossíveis de entregar como instrumento (R3 §2 preservado) — e
confira que só os casos cujo pin coincide com a constante ficam `ok`, que cada
divergência sai com o campo nomeado, e que enum incompleto, exceção do
julgador, fixture removida e caso sem fixture são todos NOMEADOS.

**Why:** na 016 (2026-09-04) o gate `check_fecho.py` já estava "pronto" — 33
divergências, exit 1 em todo modo — quando fui escrever a linha de kill de
D016-M16 (laço da sonda vazio) e descobri que sob ele a sonda saía `0 caso(s)`
com exit 1 **sem nenhuma linha dizendo por quê**: violação de R10 §2 invisível
no red, porque o red nunca exercita esse ramo. A emenda (`executados N ≠ total
pinado P`) só existiu porque tentei escrever o mutante antes do commit.

**How to apply:** em toda Fase 4 com gate × instrumento separados: (1) stub
constante → lista dos casos `ok` tem de ser exatamente a previsível pelo pin;
(2) para cada mutante que ataca o PRÓPRIO gate (M16-like), aplicar na cópia e
exigir a linha nomeada; (3) registrar a bateria no red-*.md como "prova do
gate", nunca como prova do instrumento. O verde da sonda inteira só o
instrumento real alcança — diga isso, não o esconda.
