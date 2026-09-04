---
name: vacuidade-medida-antes-do-gate-nascer
description: Contrato do assert de fixture — criterio sem caso declara a própria pré-condição, mutante que não pode matar vira dívida ou equivalente declarado, e o assert nunca ancora estado que a demanda escreve
metadata:
  type: feedback
---

Ao escrever critério de aceite, o desenho tem de responder **duas** perguntas que
não são a mesma: "o gate afirma a coisa certa?" e "existe, na fixture, o caso que
faz a alínea poder falhar?". Alínea que depende de um caso **declara ela mesma a
pré-condição de não-vacuidade** e falha nomeando a vacuidade — nunca fecha verde
por ausência de caso. E cláusula do produto que nenhum mutante consegue matar vai
para a matriz como **equivalente declarado, com o motivo escrito**, em vez de
deixar par vazio na coluna de mutantes.

**Why:** na Wave 1 da demanda 010 o `qa-engineer` provou as quatro fixtures por
execução e mediu **quatro vacuidades** em critérios que a Fase 1 tinha dado por
prontos: alvo com serviço-sem-candidato inexistente, colisão de nome que só existe
em `monitoring-coverage`, gate fechado cuja ausência de nó era verdadeira "por
estado, não por gate", e uma cláusula do predicado de arbitragem inalcançável
porque `LEGACY-LABELLED` nunca vira `card`. A demanda **013** gastou-se inteira
combatendo gate que não pode falhar; aqui deu para evitar antes de o gate nascer,
ao custo de uma errata de texto e duas linhas de fixture.

**O assert de fixture não vigia o produto — e a linha divisória é o diff.** Ele
existe para provar que a fixture **alcança o estado que declara**; vigiar o
produto é do gate. Então o assert só declara o que a demanda **não pode escrever**:
estado aplicado pelos owners canônicos e estado derivado por arquivo `frozen` ou
fora do diff. Qualquer dado produzido por arquivo que **aparece no diff da
demanda** é âncora que apodrece no green — na 010 o assert declarava "títulos
congelados ocultos" e o censo de chips do DOM, as duas coisas que a demanda existe
para mudar, e no verde ele abortaria antes de qualquer alínea, convertendo 12
gates em falha de fixture. Ao remover, **nada some**: cada declaração migra para o
gêmeo canônico (censo de DOM → payload do engine) ou para a alínea do gate que já
a mede, e a parte que servia de guarda anti-vacuidade fica (lá: a **presença** dos
títulos fica, a **ocultação** sai). Recuse "declarar o estado-alvo" (o assert vira
segundo oráculo e a fixture fica vermelha por toda a janela de red, escondendo
defeito real de fixture) e "parametrizar por fase" (fixture com dois modos mente
no modo que não roda).

**Remédio de fixture: quando emendar e quando criar.** Estado novo que **move o
vetor de respostas** move também os censos que outros critérios medem — na 010,
pôr duas capabilities em nível 0 na fixture canônica levaria `basePresented` de 4
a 6 e `baseInV32Base` de 2 a 4. Nesse caso o remédio é **fixture nova** (custa uma
linha de tabela), não emenda da que ancora censo (custa recalcular censo e reabrir
asserção que já passa). Emendar só vale quando **nenhum censo de critério pende**
da fixture — foi o caso da fixture de gate fechado, cujo único consumidor mede a
Camada 1, que o acréscimo não toca. Decida isso **com medição**, e escreva na spec
qual fixture fica byte-idêntica e por quê, senão a próxima rodada desfaz.

**Prova cruzada citada pela spec verifica-se por EXECUÇÃO, nunca por leitura do
rótulo.** Quando a spec afirma "o mutante M<n> tem de morrer no gate congelado
G" — o padrão "gate de fase nova matando mutante em suíte congelada é prova
cruzada forte" —, **rode a expressão de G antes de o plano endossar a
afirmação**. Na Fase 2 da 011 a spec apostava em `UX14` (`tests_ux_m41.js:127`)
e `UX14` **não pode reprovar**: o retorno é
`… && a===b===c ? (x || true) : true`, e `a===b===c` avalia `(a===b)===c` —
booleano contra string, sempre falso —, então o ramo tomado é o literal `true`.
Reproduzida fora do repositório com quatro entradas (verde real, nada
selecionado, item errado selecionado, dois selecionados): `true` nas quatro. O
custo de não medir seria uma campanha inteira "provando" o que o gate não
afirma. Desfecho correto: o carrasco real passa a ser um gate da própria
demanda, a célula do critério vai por **errata de fato**, a suíte congelada
**não** é editada (fortalecer critério alheio está fora da delegação — ver
[[criterio-ratificado-de-demanda-anterior]]) e o gate tautológico vira **achado
de backlog** com a cadeia arquivo:linha→efeito.

**How to apply:** na Fase 1/2, para cada alínea, escreva qual fixture carrega o
caso e qual mutante morre por causa dela — se não houver, o remédio é **fixture**
(quando o estado é alcançável) ou **redação** (quando não é: reescreva para o que
é verificável, ou declare "verdadeiro por estado" e **nomeie que não há mutante
possível"). Suspeite especialmente de: cláusula defensiva contra mudança futura do
engine (mantenha-a, mas sem lhe atribuir peso), alínea que manda o oráculo
"alterar X" quando X vive em arquivo `frozen`, e conjunto nomeado pelo id do bloco
que o exibe. E ao mandar fundir itens de duas fontes, diga **contra o quê** a
fusão compara: "deduplicar pela tabela de equivalência" e "deduplicar contra o que
está de fato anexado" divergem no único caso em que a perda seria invisível — o
gate precisa das **duas direções** (o que tem de sumir e o que tem de sobreviver).
Ver [[erratas-de-spec-forma-e-precedente]] e
[[criterio-ratificado-de-demanda-anterior]].
