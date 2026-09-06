# Refinamento — 017-semantica-do-gatilho

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.
>
> Árvore medida: worktree `phase5-014`, branch `feature/017-semantica-do-gatilho`,
> HEAD `9d617d0` (nascida de `origin/develop`). **Toda linha citada foi lida nesta
> árvore em 2026-09-05.** Método: leitura estática das expressões que emitem e
> consomem os dados — o `product-owner` não executa (`--preflight` não foi
> rodado; ver §Sistema real, "O que não foi executado").

## Necessidade

Quem usa esta superfície não é o facilitador nem o leitor do relatório — é quem
lê o log do stage `mutation` (orquestrador, auditor, `qa-engineer` que escreve o
próximo harness). Hoje esse log só sabe dizer, para **um** harness (`p51`), se a
declaração de alvos é verdadeira; para os outros onze a pergunta não é feita, e a
única regra escrita (o glossário) diz uma coisa que **sete** deles violam por
escrito e com razão. O que muda com a demanda: o stage passa a poder afirmar,
para **todo** harness, que o gatilho não tem fantasma e que nenhum arquivo mutado
está fora dele — **sem** reprovar o oráculo, a fixture ou a declaração que os
autores puseram lá de propósito. E a `p51`, a única campanha que hoje não pode
vigiar a própria suíte de gate, passa a poder.

Por que agora: cada harness novo escreve um parágrafo de "desvio declarado" contra
o glossário — são sete (`mutation_map.json:21, :41, :135, :151, :180, :246, :261`),
o mais recente de hoje (`ea41`). A `d015` diz literalmente que só não reprova
porque o gate é nominal (`:180`: *"IC-6 e nominal a p51, entao o excedente aqui
nao reprova"*). Enquanto isso, `EA-3`, `EA-28`, `EA-30`, `EA-31` e `EA-42`
esperam um instrumento que precisa saber o que "coberto por campanha" significa.

## Enquadramento de produto

### A pergunta certa

Não é "qual nome vence" (`targets` × `arquivos_mutados`): são **dois conceitos com
dois nomes já existentes na máquina**. A pergunta é **qual é a relação entre
eles**. Medido:

- o mapa define `targets` como **gatilho** — `mutation_map.json:3` (`_meta`):
  *"compara os arquivos tocados (diff contra a base) com os alvos de cada harness
  e re-executa APENAS as campanhas cujos alvos mudaram"*; a implementação é
  `check_mutation.py:466-471` (`changed = set(git diff --name-only base HEAD)`) e
  `:1333` (`any(t in changed for t in h["targets"])`) — pertinência **exata**,
  sem glob;
- o contrato C1 define `arquivos_mutados` como **conjunto mutado** —
  `specs/013-integridade-da-campanha/spec.md:205-226`; cada harness o emite a
  partir do próprio array de mutantes (ex.: `tests_p51_mutants.js:321`,
  `tests_016_mutants.js:555`);
- o **único** ponto que afirma identidade entre os dois é o `IC-6`
  (`check_mutation.py:400-403`: `_esperado = arquivos_mutados ∪ {harness}`;
  `_declarado = targets`; qualquer diferença nas duas direções é FAIL) — e o
  próprio código o declara **nominal à `p51`** (`:376-379`, "T11/borda 10: sem
  laço genérico");
- a relação que as sete `_trilha`s praticam é **inclusão com razão declarada**:
  gatilho ⊇ conjunto mutado ∪ {harness}, e cada elemento além disso vem com uma
  frase dizendo por quê (oráculo, fixture, declaração, julgador).

Resposta recomendada: **a relação é inclusão com razão de classe legível por
máquina.** Faltante (mutado fora do gatilho) continua FAIL sem exceção — foi
isso que apodreceu `M51-20`. Excedente **sem** razão é alvo fantasma e reprova
— foi isso que `ui_session_v32.js` era. Excedente **com** razão é insumo de
prova e passa, nomeado.

### Invariantes e regras tangenciadas

- Nenhuma das dez INV-* diretamente: é instrumento de processo, não produto.
- **R3 §5** (`.claude/rules/tdd.md:17`): *"Campanha re-executada quando módulo
  **ou gate** muda (Onda 3: trigger por path)"*. A regra exige o **gate** no
  gatilho. A identidade do glossário **contradiz R3 §5**: sob ela, pôr o oráculo
  no gatilho é FAIL. Este é o argumento mais curto da demanda.
- **R10 §2** (SKIP silencioso é FAIL) — governa a borda do `core` (abaixo).
- **INV-9** por analogia: a relação tem de ser dado legível por máquina, não
  prosa — a prosa já apodreceu (§Sistema real, divergência i).

### Conflito com decisão registrada

- `design-decisions.md`: nada sobre `IC-6` ou `targets`.
- A **spec validada da 013** afirma a identidade em dois lugares de prosa: borda
  10 (`spec.md:194`, *"IC-6 nominal à p51. A checagem genérica permanece do
  EA-3"*) e a linha `IC-6` (`spec.md:116`, explicitamente *"(`p51`, nominal)"*).
  A **asserção** nunca foi generalizada; quem generalizou foi o **glossário** —
  `CONTEXT.md:214-218`, verbete que **eu** escrevi na Fase 0 da 013
  (`specs/013-integridade-da-campanha/refinement.md:279-283`), com o gatilho na
  frase 1 e a identidade na frase 2. A 017 supera a borda 10 por spec própria; a
  013 recebe **errata aditiva de uma linha** apontando para cá (não se reescreve
  spec validada; R2 §5).

### O que a identidade da 013 acertou — contra-argumento, escrito para ser cobrado

A identidade **não foi erro**. Em 2026-08-29 a `develop` tinha quatro harnesses
(`EA-3`, `BACKLOG.md:421-422`): `core`, `p50`, `p52` cumpriam identidade
(`p52` inclusive com `tests_p52_chromium.js`, porque o **muta** — abaixo) e a
`p51` tinha um fantasma **e** um arquivo mutado fora. Uma única asserção de
igualdade de conjuntos matou os dois com dois mutantes (`M-IC8`, `M-IC9`) — o
remédio mais barato que existia, e o `d009` com oráculo no gatilho vivia em
branch que aquela worktree não enxergava. O que promoveu o remédio a **doutrina
geral** foi a frase 2 do meu verbete. O custo foi pago em prosa (sete parágrafos
de desvio), e por isso ninguém o viu como custo.

**Como cobrar esta demanda por isso**: se o próximo harness precisar escrever um
parágrafo de "desvio declarado" contra a regra da 017, a 017 falhou; se um alvo
fantasma passar por ela, falhou do outro lado. As duas cobranças têm de virar
critério na Fase 1.

### Alternativas mais simples, e por que não bastam

| Alternativa | Por que não basta |
|---|---|
| (a) Só corrigir o glossário; `IC-6` segue nominal | A `p51` continua proibida de vigiar o próprio oráculo; nenhum instrumento genérico dos eixos A/C pode nascer sobre uma relação que só existe em prosa |
| (b) Generalizar o `IC-6` como está | Nasce **7/11 vermelho** (medido abaixo), reprovando exatamente o que R3 §5 exige; e em 2 dos 7 reprova por **forma de path**, com um "faltante" falso |
| (c) Remover o `IC-6` | Perde a única guarda contra fantasma e contra mutado-fora — o caso real do `USER_GUIDE.md` |
| (d) `IC-6` nominal + lista de exceções em prosa por harness | É o que as `_trilha`s já são; a da `d016` já cita linha errada (`:1287`) — prosa apodrece |

## Sistema real

### Medição 1 — a `ea41` é o sétimo vermelho no HEAD `9d617d0`?

**Sim, por leitura da expressão emitida** (execução do `--preflight` pendente —
ver "O que não foi executado"):

- `tests_ea41_mutants.js:263` emite `arquivos_mutados: [SUJEITO_REL]`, e
  `:114` fixa `SUJEITO_REL = ".claude/verify/fixtures_ea41/sujeito.md"` — array
  literal, sem ramo condicional;
- `ic_fontes` (`check_mutation.py:156-168`) extrai do `cmd` o token
  `tests_ea41_mutants.js`;
- `_esperado` = {`.claude/verify/fixtures_ea41/sujeito.md`, `tests_ea41_mutants.js`};
  `_declarado` (`mutation_map.json:251-256`) tem 4 entradas;
- **excedente = 2** (`.claude/verify/check_eol_text.py`, `.gitattributes`);
  **faltante = 0**. Sob o `IC-6` generalizado: `[FAIL] … alvo declarado que o
  harness não muta: .claude/verify/check_eol_text.py, .gitattributes`.

A `_trilha` (`:261`) dá a razão dos dois por escrito: o gate ("mudar o julgador
re-dispara a campanha") e a declaração (`* text=auto eol=lf`, "mudar a declaração
muda o que a campanha prova"). São insumos de prova, não fantasmas.

### Medição 2 — o `IC-6` generalizado, harness a harness

Método: para cada harness, o conjunto mutado foi lido do **campo `file:` de cada
mutante** (o que `arquivos_mutados` emite), mais `remover:`/`criar:`/`em(F.*)`
onde existem; o gatilho, de `mutation_map.json`. Duas colunas de resultado: a
**semântica** (mesmo arquivo = mesmo elemento, independente da forma do path) e a
**literal** (a expressão de `:400-403` como está — comparação de strings).

| Harness | Conjunto mutado (n) · fonte | ∪ harness | Gatilho (n) · `mutation_map.json` | Excedente semântico | Faltante | Literal exc./falt. |
|---|---|---|---|---|---|---|
| `d010` | 2 (`ui_v32.js`, `ui_target_v32.js`) · `tests_010_mutants.js:115-315` | 3 | 5 · `:10-16` | 2: `tests_010_vao.js`, `fixtures_010_vao.js` | 0 | 2 / 0 |
| `d009` | 6 (`ui_p52_workspace_v32.{js,css}`, `ui_journey_v32.js`, `ui_target_v32.js`, `ui_v32.js`, `ui_ux_v32.css`) · `tests_009_mutants.js:121-369` | 7 | 9 · `:26-36` | 2: `tests_009_leitura.js`, `fixtures_009_leitura.js` | 0 | 2 / 0 |
| `core` | 3 (`ui_session_v32.js`, `ui_v32.js`, `ui_refinement_v32.js`) · `tests_core_mutants.js:35,44,58` | 4 | 4 · `:45-50` | **não medível** — sem preflight (`check_mutation.py:119`, `:331-339`) | — | FAIL "oráculo nenhum" (`:396-398`; a reserva `ic_estatico:179` só casa a forma `chave: path.join(HERE, …)` da `p51`) |
| `p50` | 4 (`ui_p50_shell_v32.js`, `ui_p50_v32.css`, `ui_p50_suff_v32.js`, `ui_p50_results_v32.js`) · `tests_p50_mutants.js:221-817` | 5 | 5 · `:59-65` | 0 | 0 | 0 / 0 |
| `p51` | 6 · `tests_p51_mutants.js:152-289` | 7 | 7 · `:78-86` | 0 | 0 | 0 / 0 (é o `IC-6` verde de hoje) |
| `p52` | 8 (incl. `tests_p52_chromium.js`) · `tests_p52_mutants.js:216-1477` | 9 | 9 · `:96-105` | 0 | 0 | 0 / 0 |
| `d014` | 5 (`regra_morta.js`, `regra_morta_seletor.js`, `ui_p50_v32.css`, `tests_014_regra_morta.js`, `build_v32_html.py`) · `tests_014_mutants.js:121-127`, `:149-226` | 6 | 10 · `:119-130` | 4: `ui_v32.css`, `ui_ux_v32.css`, `ui_p52_workspace_v32.css`, `ui_d011_prioridade_v32.css` | 0 | **6 / 2** (forma — abaixo) |
| `d011` | 3 (`ui_d011_prioridade_v32.{js,css}`, `build_v32_html.py`) · `tests_011_mutants.js:122-323` | 4 | 5 · `:140-146` | 1: `tests_011_prioridade.js` | 0 | 1 / 0 |
| `d014vis` | 1 (`ui_p52_workspace_v32.css`) · `tests_014_mutants_visual.js:140` | 2 | 2 · `:156-159` | 0 | 0 | 0 / 0 |
| `d015` | 1 (`ui_v32.js`) · `tests_015_mutants.js:126-232` | 2 | 4 · `:170-175` | 2: `tests_015_apoio.js`, `fixtures_015_apoio.js` | 0 | 2 / 0 |
| `d016` | 10 (`fecho.py`, `branch_protection.py`, `check_fecho.py`, `check_branch_protection.py`, `fecho.json`, planning-state 015, planning-state **016** via `em(F.ps016)` `:396`, `999-sintetica-d016.json` criado `:453`, `F5.json` removido `:406`, `sem_fecho.json` removido `:473`) · `tests_016_mutants.js:181-515`, `:520-525` | 11 | 56 · `:184-241` | 45: `branch_protection.json` + 44 fixtures (46 − as duas removidas) | 0 | **55 / 10** (forma) |
| `ea41` | 1 (`.claude/verify/fixtures_ea41/sujeito.md`) · `tests_ea41_mutants.js:114`, `:263` | 2 | 4 · `:251-256` | 2: `.claude/verify/check_eol_text.py`, `.gitattributes` | 0 | 2 / 0 |

**Resultado**: dos **11 harnesses com preflight, 7 nascem vermelhos** sob o
`IC-6` generalizado (`d010`, `d009`, `d014`, `d011`, `d015`, `d016`, `ea41`) e
4 nascem verdes (`p50`, `p51`, `p52`, `d014vis`). O `core` seria um **oitavo**,
por "oráculo nenhum", se entrasse no laço. **Faltante semântico é zero em todos
os onze**: nenhum harness da casa muta arquivo fora do gatilho hoje — a doença
que o `IC-6` nasceu para matar está morta; o que sobra é o instrumento
reprovando a cura.

**Divergência contra a minha análise anterior**: eu havia dito "6 de 11" sobre
árvore anterior. **Vale 7 de 11** — a `ea41` (harness de hoje) é o sétimo. E os
sete excedentes são, todos, insumos com razão escrita na `_trilha`.

**O defeito de forma, que só a medição literal mostra**: dez harnesses emitem
`arquivos_mutados` como **basename** (`path.basename(m.file)` — `tests_014_mutants.js:303`,
`tests_016_mutants.js:555` e os demais); a `ea41` emite **path relativo ao
repositório** (`:263`); e `targets` são paths relativos ao repositório (é a forma
de `git diff --name-only`, `check_mutation.py:471`). O C1 (`spec.md:205-226`) **não
fixa a forma** — o exemplo só tem arquivos da raiz, onde as duas coincidem. Em
consequência, a expressão de `:400-403` aplicada à `d014` acusaria **6 excedentes
e 2 faltantes** (os dois `.claude/verify/regra_morta*.js` contados nas duas
colunas, sob nomes diferentes) e à `d016` **55 e 10**. O "faltante" aí é
**falso**, e é a mensagem mais grave do gate (`:408`, "alvo mutado ausente de
targets"). Qualquer relação que a 017 defina precisa de **uma forma canônica de
path antes de comparar** — borda 8.

### Medição 3 — os três itens que eu havia lido estaticamente

| Item | Resultado | Fonte |
|---|---|---|
| A `p52` **muta** `tests_p52_chromium.js` | **Confirmado**. Três mutantes: `P52-FC3` (`tests_p52_mutants.js:1017-1019`, torna um caso do gate vácuo), `V322-M13` (`:1194-1196`, troca o commit-âncora do baseline) e `V322-M14` (`:1203-1205`, altera um dígito do SHA esperado). Logo o "precedente p52" que a `d009` invoca (`mutation_map.json:41`, *"o harness p52 já lista tests_p52_chromium.js entre os alvos"*) é **falsa analogia**: a `p52` lista o arquivo porque o muta, não porque é oráculo | `tests_p52_mutants.js:70`, `:74`, `:1019`, `:1196`, `:1205` |
| O excedente da `d014` são as quatro folhas CSS | **Confirmado semanticamente** (4) — e a `_trilha` (`:135`) dá a razão: a varredura de regra morta **lê** as cinco folhas e o builder; muta uma folha e os dois instrumentos. **Divergência**: o instrumento literal diria 6/2 (forma do path) | `tests_014_mutants.js:121-127`, `:149-226`; `mutation_map.json:119-130` |
| O excedente da `ea41` são dois | **Confirmado** (`.claude/verify/check_eol_text.py`, `.gitattributes`); faltante zero | Medição 1 |

### O `IC-6` de hoje impede a `p51` de ter o gatilho certo — confirmado

Os oráculos da `p51` são `tests_p50_core.js` (`tests_p51_mutants.js:152-224`,
campo `cmd`) e `tests_p50_chromium.js` (`:192`, `:218`). Nenhum dos dois está em
`p51.targets` (`mutation_map.json:78-86`). Incluí-los hoje cai em
`check_mutation.py:402-406`: `_excedente` não vazio ⇒ `[FAIL] IC-6: p51.targets ·
alvo declarado que o harness não muta`. A `p51` é a única campanha da casa que o
próprio instrumento **proíbe** de cumprir R3 §5.

### Divergências doc × código encontradas (sem id alocado — Fase 0 não aloca)

1. `mutation_map.json:246` (`_trilha` da `d016`) cita *"check_mutation.py:1287 casa
   por pertinência exata"*; hoje `:1287` é comentário do IC-10.4 e o laço está em
   `:1333`. Família `EA-31` — a razão de a razão precisar ser dado, não prosa.
2. `mutation_map.json:41` — o "precedente p52" é falsa analogia (Medição 3).
3. Contrato C1 sem forma canônica de path (Medição 2, 10 × 1).
4. O oráculo de reserva `ic_estatico` (`check_mutation.py:171-182`) tem **dois
   pontos cegos** medidos: não casa `const X = path.join(HERE, …)` (forma do
   `core`, `p50`, `p52`, `d009`, `d010`, `d011`, `d015`, `d014vis`) e não vê
   arquivo passado por helper (`em(F.ps016, …)`, `tests_016_mutants.js:396`). Só
   serve à forma da `p51`/`d014`/`d016` com `file: F.*`. Relevante para a borda 4.
5. `BACKLOG.md:3421` (`EA-44`) cita `spec.md:441-442` para T8; medido, o trecho
   está em `:440-441`. Deriva de uma linha.
6. O `brief` do planning-state desta demanda diz "6 de 11"; vale **7 de 11**.

### O que não foi executado, e por quê

- `<cmd> --preflight` dos onze harnesses: **não executado** — o `product-owner`
  não tem shell nesta sessão. A Medição 1 e a coluna "conjunto mutado" da
  Medição 2 vêm da leitura das expressões que emitem `arquivos_mutados`; são
  determinísticas (arrays literais e `map(m => m.file)` sobre arrays estáticos),
  mas a **confirmação canônica é a execução** — pedida em DEPENDÊNCIAS.
- `python .claude/verify/check_mutation.py` no HEAD: não executado (mesmo
  motivo). A afirmação "IC-6 verde hoje para a `p51`" vem da igualdade dos
  conjuntos lidos, não de log.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Arquivo **mutado e insumo** ao mesmo tempo (`tests_p52_chromium.js`: oráculo da `p52` e alvo de 3 mutantes) | Classifica-se pela relação **mais forte**: é conjunto mutado. Está no gatilho por isso; nenhuma razão de insumo se declara. Um arquivo nunca tem duas classificações |
| 2 | Arquivo que a campanha **cria** (`999-sintetica-d016.json`, `D016-M32`) | É conjunto mutado: "mutar" inclui alterar a **existência**. O harness já o emite assim (`tests_016_mutants.js:525`, `:555`, `CRIAVEIS`). O gatilho dispara quando um commit o cria (`changed` traz o path novo) — que é a razão de ele estar lá (`:246`). A checagem **não pode exigir que todo elemento do gatilho exista no repositório** |
| 3 | Arquivo que a campanha **remove** (`F5.json` em `D016-M22`, `sem_fecho.json` em `D016-M30`) | Idem: conjunto mutado (`arquivosDe`, `:520`, inclui `remover`). A remoção é mutação de existência |
| 4 | Harness **sem preflight** (`core`, `EA-44`): não há conjunto mutado legível por máquina | A relação sai como **não medida, nomeada** — a linha `[DÍVIDA] core: …` de hoje (`:337-338`) ganha o credor (`EA-44`); nunca `[OK]`, nunca silêncio. **Qual manda**: R10 §2 proíbe o **silêncio**, não a exceção **nomeada com credor** — T8 já é nomeada e impressa; o que lhe faltava era credor, e `EA-44` agora é. A lista de exceção é fechada por construção: harness novo sem `preflight: true` já reprova em `IC-4` (`:285-287`). A 017 **não toca** `tests_core_mutants.js` (T8 permanece; o remédio é da demanda que `EA-44` pede). O oráculo de reserva não é saída: tem dois pontos cegos (divergência 4) |
| 5 | Elemento do gatilho que **não é mutado e não tem razão** | **Alvo fantasma** — FAIL nomeando o path. É o `M-IC9` de hoje generalizado; a única forma de o gate continuar matando o mutante que o fez nascer |
| 6 | Arquivo **mutado fora do gatilho** | FAIL **sem exceção**, nomeando o path. É o `M-IC8`/`M51-20`. Zero casos hoje (Medição 2) — a asserção nasce verde nesta direção e precisa do mutante para provar que morde |
| 7 | **Razão coletiva** para família (as 44 fixtures não mutadas da `d016`; as 4 folhas da `d014`) | Uma razão **por classe de relação**, nunca por arquivo nem por harness. A linha: todos os membros respondem **igual** à pergunta "o que muda na prova se este arquivo mudar?" — se sim, é uma classe (44 fixtures: "caso da sonda que o julgador lê"); se um membro precisaria de resposta diferente, é outra classe. "Endurece o trigger" **não é razão** (é efeito, e vale para qualquer coisa que se ponha no gatilho). Razão que não nomeia a relação é rótulo e reprova |
| 8 | **Forma do path** em `arquivos_mutados` (10 harnesses basename, `ea41` repo-relativo; `targets` repo-relativo) | Uma forma canônica **antes** de qualquer comparação; hoje a literal produz faltante falso em `d014`/`d016`. Recomendo a forma do git (a de `changed` e de `targets`), porque é a que o gatilho já compara; a **decisão e a errata do C1 são do `tech-lead`** (raia técnica — não resolvo aqui) |
| 9 | Gatilho **igual** a conjunto mutado ∪ {harness} (`p50`, `p51`, `p52`, `d014vis`) | OK sem razão a declarar: identidade é caso particular da inclusão. Nada muda para esses quatro |
| 10 | Mutante que roda **fora do harness**, em worktree efêmera, sobre arquivo protegido (`D011-M6`/`M8`, `D015-M16`, `_trilha` `:151`, `:180`) | **Não** é conjunto mutado do harness (a campanha automatizada nunca toca `PROTECTED`) e o arquivo **não** entra no gatilho por esta demanda. A raia desses pares é da matriz, não do mapa. Dito para que ninguém "conserte" pondo `ui_target_v32.js` em `d015.targets` |
| 11 | `receipts` (`p50`, `p52`, `mutation_map.json:71-73`, `:112-114`) | Nem gatilho nem conjunto mutado: são artefatos que o harness legado grava e o runner restaura. Fora da relação |
| 12 | Gatilho **incompleto** (ex.: `build_v32_html.py` reconstrói o HTML em `p50`/`p51`/`p52`/`d009`/`d010`/`d015` e não está no gatilho de nenhum deles) | **Fora desta demanda.** A 017 garante que o gatilho é **verdadeiro** (sem fantasma, sem mutado-fora, insumo classificado); não garante que é **completo**. Completude é o problema-espelho do `EA-3` (população) — borda registrada para que a Fase 1 não a prometa |

## Vocabulário

Registrados em `CONTEXT.md` nesta Fase 0 (seção "Estrutura (processo)"), no
formato da R12, com o verbete anterior **riscado e localizável** (R2 §5):

- **~~Alvo declarado de campanha~~** — riscado com a razão (frase 2 afirmava
  identidade; sete de onze a violam com razão; R3 §5 exige o gate no gatilho).
- **Gatilho de campanha** — o que `targets` **é**: o que vigia; contém o conjunto
  mutado e o harness; o resto é insumo com razão. A chave JSON permanece
  `targets` (INV-10); só a prosa muda.
- **Conjunto mutado** — o que `arquivos_mutados` **é**: bytes ou existência que a
  campanha altera, incluindo criar e remover; sempre contido no gatilho.
- **Insumo de prova** — arquivo não mutado de que o poder da prova depende, no
  gatilho com razão de classe. _Evitar_ inclui **excedente**, que é o rótulo do
  sintoma no `IC-6` — vocabulário do instrumento, que pressupõe identidade.
- **Alvo fantasma** — já em uso sem registro (`specs/013-…/refinement.md:178`,
  `matriz-gate-mutante.md:1406`): lacuna real, não linguagem inventada.

Reexaminados contra a medição antes de gravar: (i) "Conjunto mutado" ganhou
"ou existência" e "criar/remover" pela `d016` (bordas 2-3), que eu não tinha
lido; (ii) "Insumo de prova" perdeu "estado lido pelo julgador" como exemplo — o
planning-state da 016, que eu supunha insumo, é **mutado** (`em(F.ps016)`,
`:396`); (iii) "Gatilho" ganhou "pertinência exata, sem glob" porque é o que
`:1333` faz e o que a `_trilha` da `d016` já depende.

**Não registrados, de propósito**: os nomes das **classes** de razão (oráculo,
fixture, declaração, julgador, registro lido, entrada da varredura) — são
vocabulário fechado de instrumento, identificadores que a spec fixa (INV-10),
não termos de domínio; e o par "coberto × vigiado" que o `EA-3` vai precisar —
ainda não está em uso em artefato nenhum, e registrar termo antes do uso é
linguagem inventada (R12). **Arquivo órfão de campanha** continua do `EA-3`
(`specs/013-…/refinement.md:286-289`).

## Rodadas de entrevista

Rodada 1 — treze perguntas, uma recomendação cada, defensável em source. Sem
resposta ainda; aprovação em bloco adota as treze.

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1.1 | **A relação é inclusão com razão de classe** (gatilho ⊇ conjunto mutado ∪ {harness}; todo elemento além disso tem razão de classe legível por máquina), substituindo a identidade? **Recomendo sim.** É o que as sete `_trilha`s praticam, o que R3 §5 exige (`tdd.md:17`) e a única forma que mata o fantasma (`M-IC9`) sem proibir o oráculo. Faltante zero em todos os onze prova que a direção "mutado fora" está curada; o instrumento novo herda essa guarda intacta | — |
| 1.2 | **Faltante continua FAIL sem exceção?** **Recomendo sim.** É o `M51-20`; e é a direção em que a asserção nasce verde hoje, logo o mutante que a prova (devolver o estado `USER_GUIDE.md`-fora, ou equivalente em harness com path sob `.claude/`) é obrigatório na Fase 1 | — |
| 1.3 | **Excedente sem razão é FAIL ou WARN?** **Recomendo FAIL**, nomeando o path. A razão é barata (uma classe), o fantasma é o defeito de origem, e WARN é o verde que ninguém investiga (`EA-3`). Sem vermelho crônico: os sete excedentes de hoje já têm razão em prosa — migrá-la para a forma legível é **tarefa da demanda**, não dívida |
| 1.4 | **Razão coletiva** — onde fica a linha? **Recomendo: uma razão por classe de relação, nunca por arquivo nem por harness** (borda 7). Declarar 44 fixtures sob uma classe é legítimo; declarar "endurece o trigger" não é razão. A forma (campo no mapa? padrão por classe? entrada por arquivo com classe?) é do `tech-lead`; o que é meu é que **classe sem nome de relação reprova** | — |
| 1.5 | **Mutado e insumo** ao mesmo tempo classifica-se como conjunto mutado, sem razão de insumo? **Recomendo sim** (borda 1). Uma classificação por arquivo; a mais forte vence | — |
| 1.6 | **Conjunto mutado inclui âncora de existência** (criado/removido)? **Recomendo sim** (bordas 2-3): é o que a `d016` já emite, e a alternativa obrigaria o gatilho a excluir o único arquivo cuja criação por terceiros faria `M32` escrever por cima | — |
| 1.7 | **`core` sem preflight**: T8 ou R10 §2? **Recomendo: as duas, porque não conflitam** — R10 §2 proíbe o silêncio; T8 é nomeada e impressa; o que faltava era credor, e é `EA-44`. A 017 emite para o `core` "relação não medida — EA-44" como dívida (nunca OK), **não toca** `tests_core_mutants.js` e registra que a lista de exceção é fechada por construção (`:285-287`) | — |
| 1.8 | **Forma canônica do path** pertence ao problema? **Recomendo sim, como pré-condição** — sem ela a comparação mente (faltante falso em `d014`/`d016`). Recomendo a forma do git; a decisão e a errata aditiva do C1 são do `tech-lead`, e a migração dos dez harnesses que emitem basename é **edição de harness** — conferir na Fase 2 quais deles são pinados/protegidos e quem é o dono de cada um (um módulo por delegação) | — |
| 1.9 | **Incluir o oráculo da `p51`** (`tests_p50_core.js`, `tests_p50_chromium.js`) no gatilho entra? **Recomendo: consequência permitida, não exigida.** Passa a ser possível; exigir completude de insumos para todos os harnesses é o problema-espelho do `EA-3` (borda 12). Custo se entrar: a `p51` exige Chromium, logo todo PR que toque `tests_p50_core.js` (suíte grande) dispara `DEFER` ao job visual. O `tech-lead` decide se cabe como tarefa opcional; **não é critério** da 017 | — |
| 1.10 | **"Declaração de população" do `EA-3`** pertence ao problema? **Recomendo: não ao problema, sim ao vocabulário.** A 017 define o que "coberto" (no conjunto mutado de alguém) e "vigiado" (no gatilho de alguém) significam; o `EA-3` precisa dessa distinção para não contar oráculo como cobertura. A população em si é outro instrumento. Se cabe na **mesma demanda** é decisão do `tech-lead` — meu voto é não, para a 017 não herdar o "11 de 14 / 17 de 35" que o próprio `EA-3` já reconheceu como teto e não defeito (`BACKLOG.md:456-469`) | — |
| 1.11 | **Detectores do eixo C** (`EA-28`, `EA-30`, `EA-42`) ficam fora? **Recomendo sim.** Dependem da relação, mas são instrumentos distintos (spec × harness, data da prova × execução, bateria efêmera × harness). A 017 é a pré-condição deles, não o pacote | — |
| 1.12 | **A spec da 013** recebe errata aditiva apontando para a 017 (borda 10 `:194`, linha `IC-6` `:116`, C2 `:231`)? **Recomendo sim, uma linha por ponto, pelo `doc-writer`, no PR da 017** — id pelo gap, inline + seção única (padrão já usado). Nunca reescrever o texto original (R2 §5) | — |
| 1.13 | **Renomear a chave `targets`** no JSON para casar com o glossário? **Recomendo não.** INV-10: nome de código fica como está; a chave é lida por `check_mutation.py`, citada em oito `_trilha`s e em dezenas de artefatos — o churn compraria nada. A prosa nova usa "gatilho"; a chave segue `targets`, e o verbete diz isso | — |

Deste lado o refinamento está pronto para o portão assim que a rodada 1 for
respondida; **quem aprova a fase é o usuário, no chat** (D3/R4).

## Fora de escopo (explícito)

- **Tornar os gatilhos completos** (borda 12) — a 017 os torna verdadeiros.
  Completude é população (`EA-3`).
- **A checagem de arquivo órfão** (`EA-3`) e a sua declaração de população.
- **Os detectores do eixo C**: `EA-28` (spec × harness), `EA-30` (data da
  prova), `EA-42` (bateria efêmera de instrumento).
- **`EA-44`** (preflight/vocabulário do `core`) e **`EA-45`** (vocabulário de
  runtime do `d009`): o `core` fica como T8 deixou, com credor nomeado.
- **Incluir o oráculo da `p51` no gatilho** — permitido pela regra nova, não
  exigido por ela (P1.9).
- **Reescrever as `_trilha`s históricas** — permanecem como trilha (R2 §5); a
  razão legível por máquina é **acrescentada**, não substitui a prosa. A deriva
  `:1287` → `:1333` da `d016` é nota datada, não reescrita.
- **Renomear a chave `targets`** (P1.13).
- **Tocar harness com `requires: chromium`** para além do que a forma canônica
  do path exigir — e, se exigir, cada um é uma delegação com dono nomeado no
  `tasks.md`.
