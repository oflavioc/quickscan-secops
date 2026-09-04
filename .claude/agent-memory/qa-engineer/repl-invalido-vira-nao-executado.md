---
name: repl-invalido-vira-nao-executado
description: Ao escrever harness de mutação, valide a SINTAXE de cada `repl` antes da campanha — réplica que não parseia vira "rebuild falhou" (NÃO EXECUTADO) e mascara o veredito do gate
metadata:
  type: feedback
---

Todo `repl` de mutante tem de ser **JS válido e auto-contido**. Réplica que
chama função inexistente, ou que deixa a fonte sem parsear, não vira
SOBREVIVENTE nem DETECTADO: vira `rebuild falhou` → **NÃO EXECUTADO**. O par
some da medição com uma causa de ambiente, e ninguém descobre que o mutante
nunca chegou a ser testado.

Pego em T019 da 010 (2026-08-30), antes de commitar: o `repl` de `D010-M10`
chamava `tgtValidateAt(qid, 0)`, função que não existe no produto. A âncora
passava no preflight (`ocorrencias == 1` mede a ÂNCORA, não a RÉPLICA), então o
preflight verde não protege contra isso.

**A checagem é barata e não toca a árvore**: para cada mutante, aplique
`find`→`repl` em memória, grave a fonte mutada no scratchpad e rode
`node --check` nela. 18/18 em segundos. Vale rodar `node --check` no ORIGINAL
antes, para saber que o arquivo é parseável isolado — se não for, o método não
serve e é melhor descobrir aí.

Duas armadilhas irmãs, no mesmo passo:

- **âncora que inclui a linha anterior** é a saída quando a réplica precisa
  redefinir um símbolo (`const atual=...`). Recortar só a linha do `if` obriga a
  réplica a inventar nome novo ou a chamar algo que não existe;
- **`reason` inventada é SOBREVIVENTE garantido.** A regex tem de sair do
  `throw new Error(...)` literal do oráculo — extraia por script, gate a gate.
  Reprovar por motivo diferente do esperado conta como sobrevivência, então uma
  regex otimista transforma KILL em falso sobrevivente. Confirmação barata:
  simule a saída do mutante no DOM e veja se a mensagem casa a regex — foi assim
  que `D010-M6` teve a sua validada sem rodar a campanha.

**Why:** é a mesma família de [[core-colapsa-crash-em-sobrevivente]] e
[[bateria-negativa-que-mata-a-si-mesma]] — falha do andaime lida como veredito do
sistema medido. Aqui o andaime é a própria réplica.

**How to apply:** ao entregar harness novo, o relatório traz três números, não
um: âncoras com `ocorrencias == 1` (preflight), réplicas que parseiam
(`node --check`), e só então KILL/total (campanha). Os dois primeiros se medem
sem mutar nada e sem árvore suja — o terceiro pode ser de outra tarefa.

**Eu violei a propria regra, e o padrao tem nome: citar a MEDICAO em vez da
FONTE.** Na 010 (2026-08-30) escrevi a `reason` de `D010-M26` a partir do texto
que eu tinha visto na minha sonda de simulacao — `o \`MAP\`` com crases — quando o
oraculo emite `o MAP` sem elas. Campanha completa gasta, `M26` voltou
SOBREVIVENTE por "reprovou por motivo diferente do esperado", com o gate
reprovando na alinea certa. Uma linha corrigida por transcricao do literal
(`tests_010_vao.js:1000`) fechou 23/23.

E foi a SEGUNDA vez na mesma demanda: dias antes eu havia citado a minha propria
varredura de E14 sem o qualificador dela, e concluido "falta fixture" para um
mutante que era equivalente por construcao. Mesma raiz — **memoria da medicao no
lugar do artefato medido**.

**A defesa e mecanica e custa segundos:** antes de rodar campanha, teste cada
`reason` contra o FONTE do oraculo por script. Numa auditoria assim, 22 das 23
casam estaticamente; a unica que nao casa (mensagem interpolada em runtime) se
reconhece pelo `+ variavel +` no `throw` e se dispensa nominalmente. Regex que
nao casa nem o fonte nem por interpolacao e deriva de transcricao, sempre.
