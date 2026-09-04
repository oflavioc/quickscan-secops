---
name: julgador-de-head-contra-runtime-atual
description: Para provar que uma emenda não moveu fixture já commitada, extraia o julgador de HEAD com git show e rode-o contra o runtime das fixtures atuais — comparar tabelas não basta
metadata:
  type: feedback
---

Quando a emenda mexe no MESMO arquivo que contém as fixtures congeladas e o
julgador delas, "as asserções existentes continuam passando" **não** se prova
rodando o julgador emendado: ele e a tabela mudaram juntos, e concordam.

A prova em três camadas, todas baratas:

1. **objeto** — `JSON.stringify(fixture)` de HEAD × atual, byte a byte;
2. **tabela** — toda chave que a tabela declarada tinha em HEAD mantém o MESMO
   valor; chaves **novas** são permitidas e listadas à parte (é a diferença entre
   *acrescentar asserção* e *mexer em asserção*);
3. **runtime** — `git show HEAD:<arquivo>` para o scratchpad, corrigindo só o
   `require` relativo para caminho absoluto, e então **o julgador de HEAD julga o
   runtime produzido pelas fixtures atuais**. É esta que vale: prova que o estado
   real não se moveu, e não a minha leitura da tabela.

Feito na emenda da 010 (2026-08-30): 13/13, com as 15–16 chaves de HEAD intactas
em D010-F1/F1b/F2/F3 e só `servicosPorGap`/`habilitadores` acrescentadas. O
julgador de HEAD ainda recusou a fixture nova por nome ("fixture sem estados
declarados: D010-F4") — que é o comportamento certo: suíte congelada não passa a
aprovar cenário que nunca mediu.

**Quando a emenda MOVE uma fixture de propósito** (D010-F3 na passagem seguinte,
mesmo dia), as três camadas não mudam de forma — muda o veredito esperado, e ele
tem de ser declarado por fixture: as intocadas exigem aprovação do juiz de HEAD;
a emendada exige **RECUSA com divergência nomeada**, e aprovação ali seria o
achado ("a emenda não mudou o que devia"). Na camada 2, a emendada é auditada por
"nenhuma chave de HEAD **sumiu**" e pela lista das que mudaram, com HEAD × atual
lado a lado — foi assim que as 10 chaves movidas de F3 couberam no envelope
previsto (`cardsSemPayload` 10 → 9, nunca 11) em vez de virarem prosa.

**Why:** é o [[julgador-que-concorda-com-a-fixture]] em escala de arquivo. Um
`git diff` mostra que nenhuma linha foi removida, mas não mostra que o runtime
continua produzindo o mesmo estado — dá para não tocar em linha nenhuma da tabela
e ainda assim mover o estado por efeito colateral de outra fixture.

**Camada 4 — a suíte inteira com o juiz de HEAD injetado.** Mais forte e mais
barata que julgar fixture a fixture: escreva o juiz de HEAD no `require.cache` da
suíte atual, antes de exigi-la, e compare as duas saídas.

```js
const alvo = require.resolve(path.join(ROOT, "fixtures_010_vao.js"));
require.cache[alvo] = { id: alvo, filename: alvo, loaded: true,
                        exports: require("./fixtures_HEAD.js"), children: [], paths: [] };
require(path.join(ROOT, "tests_010_vao.js"));
```

O veredito é `diff` das duas saídas: **idênticas** = a emenda não moveu nem
veredito nem RAZÃO de falha de gate algum. Contagem igual não prova isso — dois
gates podem trocar de motivo e somar o mesmo. Usado em T030 (2026-08-30) para
provar `1 PASS · 12 FAIL` byte a byte.

**Emenda SUBTRATIVA (o juiz deixa de asseverar algo) exige o controle invertido.**
As quatro camadas acima só provam que nada se moveu — o que, para uma remoção, é
compatível com ter removido asserção que nunca dispararia. Prove que dispararia:
**simule o pós-fix no runtime** (no DOM já renderizado, depois da fixture e antes
do julgamento — zero byte de produto) e rode os DOIS juízes. O emendado tem de
passar; **o de HEAD tem de recusar, com a mensagem dele**. Se HEAD também passa, o
controle é vacuoso e a "migração" foi faxina. Em T030 as duas sabotagens foram
tirar `.v32-hidden` dos títulos congelados e injetar `.ux-tgt-enabler` nos
cartões-alvo sem chip.

**Distinga "juiz de HEAD" de "GATE de HEAD" — eles não provam a mesma coisa.**
Ao extrair `git show HEAD:tests_*.js`, o gate antigo faz `require` do arquivo de
fixtures **atual**, logo usa o assert e a tabela declarada **emendados**. O que
essa montagem prova é que o *gate* não mudou de opinião; ela **não** prova nada
sobre o assert. Para emenda ADITIVA de fixture isso é o resultado certo e
esperado: na 010 (2026-08-30) o gate de HEAD aprovou 5/5 sobre a fixture com um
alvo novo, e foi essa aprovação que separou "acrescentei cenário" de "mexi no que
já era medido". Quem prova o assert é outra camada, barata: percorrer a tabela
declarada de HEAD **em nível de sub-chave** e exigir `0 alteradas · 0 removidas`,
listando os acréscimos (na 010: 11 acréscimos, todos do qid novo, e F1/F1b/F2/F3
byte-idênticas como objeto). Contar chaves de topo não serve — 11 chaves
"mudaram" ali eram 11 chaves que só **ganharam** uma entrada.

**How to apply:** sempre que emendar arquivo de fixture/gate já commitado, rode as
camadas antes de reportar green, e reporte a lista de **chaves acrescentadas**
explicitamente — ela é a fronteira entre emenda e reescrita. Complementar a
[[medir-red-do-proprio-julgador]], que trata do momento (efêmera, antes do commit);
esta trata do método (o juiz tem de ser o antigo). Ver [[fixture-que-pina-o-pre-fix]]
para o defeito que motiva a emenda subtrativa.
