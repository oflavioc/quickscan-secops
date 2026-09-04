---
name: prova-por-eliminacao-sem-instrumento
description: Quando o gate não emite o dado que você precisa, prove por eliminação com offsets medidos localmente — e teste a correção extraindo o código REAL do arquivo, não reescrevendo uma cópia
metadata:
  type: feedback
---

Instrumento que calcula o dado e **não o imprime** é comum em suíte congelada: o
`P52-TGT4` guardava `paginaDoBloco`/`paginas` no `observed`, e o `observed` ia
para arquivo de evidência que o workflow **descarta** (há um passo "Restaurar
árvore"). O log só trazia o `detail`. Instrumentar para ver é editar o gate — que
é justamente o que ainda não estava autorizado.

**A saída é eliminação sobre offsets medidos localmente.** Na 010 (2026-08-31),
com `2.8` no offset 287 de 1412 dentro do bloco e o terminador no 1203:

- se o terminador estivesse na mesma página, `fim` = 1203 e a fatia cobriria
  `[0,1203)` ⊇ 287 → acharia o valor. Contradiz o vermelho. **Eliminado**;
- logo o terminador está noutra página, `fim` é −1, a fatia já ia **até o fim da
  página**, e a página termina antes de 287.

Conclusão necessária, não conjectura — e ela **derrubou o meu próprio
diagnóstico anterior** ("o slice alarga o sujeito"), que virou item sem caso
comprovado. O sintoma que eu atribuíra a ele era de outra causa já corrigida.
Registre a retificação **onde o achado está citado**, senão quem abrir a demanda
procura o defeito errado.

**Duas disciplinas que vieram junto:**

- **teste o código REAL, extraído do arquivo.** Em vez de reimplementar a lógica
  nova numa sonda, recorte o trecho do arquivo (`indexOf` das âncoras), passe-o a
  `new Function(...)` com as dependências mockadas e exercite ali. Reimplementar
  prova a sua cópia, não a edição — é o [[julgador-que-concorda-com-a-fixture]] em
  escala de trecho;
- **o controle invertido de uma correção de instrumento é a identidade byte a
  byte no caso feliz.** Se com o bloco inteiro numa página a saída nova não for
  idêntica à antiga, você reescreveu a asserção em vez de consertar o
  instrumento — e isso muda quem precisa autorizar.

**Why:** as duas vezes em que errei o diagnóstico nesta demanda foi por medir na
condição errada ([[comparador-e-a-base-do-pr]]). Eliminação sobre offsets não
depende de reproduzir a condição — depende só de dados que o próprio vermelho já
fixou.

**How to apply:** antes de pedir instrumentação, pergunte se o vermelho já
determina a resposta por eliminação. Um run gasto para observar o que a
eliminação fixa é um run que não corrige nada — e instrumentar também é editar,
então entra no mesmo pedido de autorização.

**A sonda sintetica prova o CODIGO; ela nao prova o DOCUMENTO.** Errei com isso
tres vezes na mesma demanda, e a terceira foi cara: provei que "o fluxo corta no
terminador e nao engole vizinho" — verdade sobre o codigo — e no PDF real ele
engoliu, porque o conteudo entre a ancora e o terminador incluia uma **lista que
o proprio criterio autoriza**. A sonda respondia "o recorte respeita os
marcadores?"; a pergunta que importava era "o que EXISTE entre os marcadores?".

**Antes de aceitar uma sonda sintetica, escreva as duas perguntas lado a lado.**
Se a fixture da sonda foi inventada por voce, ela so pode responder a primeira.
Para a segunda, o insumo tem de sair do **documento real**: renderize e liste o
que ha entre os marcadores, elemento a elemento, com offsets.

**E cuidado com a FORMA do texto.** `pdftotext` monta a pagina como
`words.join(" ")` — palavras separadas por espaco; `textContent` do DOM concatena
sem separador. Um limite que funciona numa forma pode falhar na outra. Teste
qualquer regex de fronteira nas **duas** formas antes de escrever no arquivo:
na 010 (2026-08-31) foram 4/4 casos, e sem esse teste eu teria gravado uma
regex validada so na forma errada — de novo.

**Sabotagem tem endereco.** Ao provar que um limite novo nao cegou o gate, a
sabotagem precisa cair DENTRO do sujeito que sobrou, nao no que voce acabou de
excluir. A primeira que escrevi injetou o termo proibido depois da fronteira e
"passou" — o que provava apenas que a fronteira existia. Refeita nos tres sitios
que o criterio de fato mede (KPI, tabela, e o valor por dominio), as tres
reprovaram.

**Duas camadas escondem o motivo de um stage, e as duas se contornam sem editar
nada.** Ao confirmar POR QUE o stage `mutation` reprova:

1. **arvore suja mascara tudo.** `check_mutation.py` recusa working tree sujo
   ANTES de qualquer campanha, entao com trabalho nao commitado o motivo impresso
   e sempre "arvore suja" — nunca o real. `git stash push -u` + rodar + `git
   stash pop` isola sem commitar; faca **backup dos arquivos antes** e confira a
   volta com `diff -q`, mais `git stash list` para nao deixar residuo;
2. **o `run.sh` trunca a saida do stage.** Rodando `--stage=mutation` a saida
   parava numa secao intermediaria e o veredito saia sem motivo — parecia crash.
   Rodar o script direto (`python .claude/verify/check_mutation.py`, stdout e
   stderr em arquivos separados) devolveu as duas linhas que importavam:
   `[FAIL] p51/p52: campanha EXIGIDA (alvo mudou) mas ambiente sem chromium`.

**Why:** "confirme que o FAIL e por X e nenhum outro" nao se responde lendo o
agregado do pipeline. O agregado diz QUE falhou; o script diz POR QUE. E o
primeiro motivo que ele encontra pode ser um artefato da sua propria arvore.

**How to apply:** para atribuir motivo a stage vermelho, sempre: arvore limpa
(por stash, com backup) + script direto + stdout/stderr separados. Se o motivo
esperado nao aparecer literalmente na saida, ele nao esta confirmado.
