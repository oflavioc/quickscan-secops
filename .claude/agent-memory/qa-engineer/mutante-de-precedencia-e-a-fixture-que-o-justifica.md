---
name: mutante-de-precedencia-e-a-fixture-que-o-justifica
description: Mutante que troca a ORDEM de dois ramos de um julgador ancora na CONCATENAÇÃO byte a byte dos dois blocos (única) — a mutação é de precedência, não de conteúdo, e reescrever um ramo vira ocorrencias=0 no preflight; o par que reproduz o julgador pré-fix pina TODAS as divergências do red; e a fixture criada "para provar a precedência" só está justificada quando a bateria negativa mostra que a outra fixture NÃO vê o mutante — D016-M34/M35, 2026-09-05
metadata:
  type: feedback
---

Forma que funcionou em T096 (fix-finding EA-39, harness `d016`), quando um
julgador ganhou um terceiro global e a spec pediu dois mutantes — "ignora o
campo" e "precedência trocada":

- **Âncora do mutante de precedência = os dois blocos contíguos, concatenados,
  byte a byte** (`RASO_RAMO + PISO_FORA_RAMO`, gerados por script a partir do
  arquivo do instrumento e asseridos únicos), com `repl` = comentário do
  mutante + blocos em ordem inversa. Ancorar só numa linha e "inserir o outro
  ramo antes" seria mutação de conteúdo (duplica código); ancorar nos blocos
  garante que, se o `core-engineer` reescrever um deles, o preflight acusa
  `ocorrencias=0` em vez de o mutante morrer por outra razão
  ([[preflight-prova-unicidade-nao-sitio]]).
- **Meça à mão antes de escrever o par**: cópia efêmera do diretório do gate no
  scratchpad (a sonda é pura, não precisa de git nem de árvore), réplica
  aplicada por `str.replace`, `py_compile` da réplica, `--sonda` em JSON. M34
  deu 2/37 (F25 `EM VOO · null · 0`, F26 `piso-invalido`), M35 deu 1/37 (só
  F26). Isso é o que vai para `espera.divergem` — não o que a spec "prevê".
- **O par que reproduz o julgador pré-fix pina todas as divergências do red.**
  "Ignora o campo" (M34) é literalmente o HEAD antes do fix; o red de T091 já
  tinha medido F25 e F26 divergindo. Pinar só F25 (como a célula da spec
  nomeia) seria verdade incompleta; pinar as duas amarra o par ao red e diz o
  que cada fixture prova (F25 = a afirmação falsa; F26 = o detalhe falso).
- **A fixture "por isso F26 existe" se prova pela negativa.** A spec dizia
  "F25 não vê M35 — por isso F26 existe". Isso só vira fato na bateria
  negativa do julgador ([[bateria-negativa-do-julgador-do-harness]]): a
  variante `D016-M35/F25` (precedência trocada, esperando F25 divergir) tem de
  sair `SOBREVIVENTE · F25: NÃO divergiu`. Sem essa linha, F26 é uma fixture
  a mais e nada mostra que ela é a única que mede a ordem
  ([[cenario-sem-mutante-e-cenario-nao-medido]]). Os outros quatro
  adversariais foram os de sempre: réplica idêntica ×2 ⇒ "sonda não
  reprovou", campo errado ⇒ nomeia o campo, réplica sem `:` ⇒ `NÃO EXECUTADO ·
  rebuild falhou`. 0/4/1.
- **O carrasco vizinho tem de ficar igual, e isso se mede, não se supõe**: a
  campanha parcial `D016_MUT_ONLY=M33,M34,M35` antes da integral, lendo a
  nota de M33 (`censo lido 0 × pinado 39 (divergente) · 0 problema(s)`) — se
  ela mudasse, o leitor mudo estaria sendo morto pelo impedimento novo e a
  guarda teria perdido o carrasco (a condição de parada que o orquestrador
  fixou).

**Why:** um mutante de ordem que morre porque duplicou/apagou código não prova
precedência; e uma fixture "de precedência" cuja necessidade nunca foi medida
é exatamente o cenário sem mutante que a matriz esconde. Custo evitado: par
registrado como KILL pelo motivo errado.

**How to apply:** toda vez que a spec pedir "precedência trocada" ou "ramo
ignorado": (1) gere as âncoras do arquivo real e assira unicidade da
concatenação; (2) meça à mão em cópia efêmera e pine o que mediu; (3) inclua
na bateria negativa a variante "mutante de ordem julgado pela fixture que não
o vê"; (4) rode o carrasco vizinho na campanha parcial e compare a nota.
