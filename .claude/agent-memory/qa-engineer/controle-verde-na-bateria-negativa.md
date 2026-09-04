---
name: controle-verde-na-bateria-negativa
description: Bateria negativa sem cenário de CONTROLE que alcance o verde não distingue gate correto de gate constante-vermelho — e quem paga é a wave de implementação
metadata:
  type: feedback
---

Toda bateria negativa de gate novo começa por um cenário de **CONTROLE que
atinge o verde**. Sem ele a bateria só prova que o gate reprova — e gate
constante-vermelho reprova em tudo, inclusive nos mutantes, parecendo perfeito.

**Why:** na fase red da 011 (2026-08-31) os 5 gates vermelhos pareciam
saudáveis: cada um reprovava com a alínea nomeada, e cada mutante morria no
lugar certo. O controle derrubou `D011-ACC1`: a alínea (c) comparava
`QS[k].lbl` cru (`"Mandato e objetivos"`) com o texto da tela, que a 5.2
reescreve para `"Direcionamento e objetivos"` — o gate era **constante
vermelho** por causa alheia à demanda, e só apareceria na wave 3, com o
`ui-engineer` caçando um fantasma numa implementação correta. É o dual de
[[armadilha-oraculo-de-texto-copymap]]: lá o mapa não aplicado produz PASS
vacuoso na asserção negativa; aqui produz FAIL eterno na positiva.

**How to apply:** para alcançar o verde sem implementar a correção (o QA nunca
implementa), monte um **simulacro efêmero** no scratchpad: uma cópia da suíte +
do HTML construído, com um pintor de DOM guiado pelo **próprio oráculo do
gate**, injetado por `<script>` antes de `</body>` e um `<style>` com os
marcadores do builder. O simulacro tem de ser **deliberadamente não conforme**
(sem IIFE registrado, sem bridge, sem `__installed`, sem write-if-different
onde não precisa) para que ninguém o confunda com a implementação — e nunca
sai do efêmero. Dois cuidados medidos: o pintor precisa de write-if-different
no `textContent`, senão o `MutationObserver` reentra em laço infinito de
microtarefa e a suíte trava; e o veredito de cada cenário exige a **marca da
alínea** (`D011-XXX(c)`) na linha de FAIL — contar qualquer throw é o erro de
[[bateria-negativa-que-mata-a-si-mesma]].

**Rota mais barata que o simulacro, quando o produto é um artefato único
construído** (015, 2026-08-31): dê à suíte um **override nominal do caminho do
artefato** (`D015_HTML_OVERRIDE`), no precedente vivo de
`P52_BASELINE_*_OVERRIDE`, e aponte-o para um HTML sintético pós-fix montado por
cirurgia de string sobre o construído. O controle verde fechou 5/0 e os 14
mutantes rodaram como variações do mesmo pós-fix — sem pintor de DOM, sem
`MutationObserver`, sem laço. Duas amarras obrigatórias: a suíte **imprime um
aviso na primeira linha** quando o override está ativo (nenhuma execução com ele
pode ser confundida com a canônica) e o pipeline **nunca** o define. Bônus: sob
override, o lado "âncora" dos gates de preservação continua vindo do commit
imutável, então o mesmo instrumento prova que uma entrega aditiva mantém o verde
e que uma remoção o derruba.

**Dois buracos de segunda ordem, medidos na 014 (2026-09-01), quando a bateria
vira código que roda dentro da própria suíte** (julgadores puros `julgar*(dados)`
alimentados com defeito sintético, em vez de simulacro externo):

1. **A injeção que borra a partição.** Para provar a alínea `C5(ordem)` eu
   inverti duas folhas — e escolhi justamente o par que a alínea `C5(spec)`
   vigia. As duas caíram, e a asserção `exato: 1 alínea` reprovou. O defeito
   injetado tem de morar **fora do domínio das outras alíneas**; onde a
   sobreposição é estrutural (curinga, por definição, também não resolve no
   preflight), declare `exato: false` e escreva o colateral esperado no caso.
   Foi a bateria pegando o autor dela — que é exatamente o serviço dela.
2. **Controle verde vazio zera a checagem de cobertura.** A regra "toda alínea
   emitida por algum julgador tem entrada na bateria" deriva o conjunto de
   alíneas dos **controles verdes**. Com a lista de controles vazia, o conjunto
   sai vazio e a checagem passa sem medir nada — vacuidade dentro da própria
   guarda de vacuidade. Feche com censo declarado: número de julgadores e
   número de alíneas como literais, quebrados por gate no comentário. Alínea
   nova passa a exigir entrada na bateria **e** bump do censo.
