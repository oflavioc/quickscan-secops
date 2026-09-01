# Spec-validate — 015-superficies-de-apoio

> Fase 6 · T027 (segunda metade) · registro pelo `doc-writer` · 2026-09-01 ·
> **somente leitura**, iteração **1 de 2**.
> Valida a [spec.md](spec.md) aprovada — **com as erratas E1 e E2 incorporadas**
> — contra a implementação **real** (source + execução de gate, R2), no HEAD
> `9c88ac8`, branch `feature/015-superficies-de-apoio`, árvore limpa.
> **Este registro não emite veredito de PASS/FAIL**: cada linha cita o que foi
> executado ou lido. Quem decide gate é o `qa-engineer`; quem decide gap de
> classe `spec-errada` é o usuário, no chat (R4).
> **ADENDO DE 2026-09-01 no fim do arquivo: o gap G2 fechou** (`5724fbd`) e o
> score foi revisto para **35 de 36**. Os itens **7**, **8**, **23**, **25** e
> **27** desta tabela leem-se com o adendo.

## Método

- Exigências extraídas da `spec.md`: os **cinco** critérios vivos (C1, C2, C3,
  C5, C6 — **não existe sexto**, o C4 caiu na errata E1), alínea por alínea; os
  mutantes previstos; as quatro restrições da Fase 2 (R-1…R-4); os contratos; os
  estados E1–E8; a lista de "fora de escopo"; e o quadro de boundary.
- Verificação por **execução própria** (2026-09-01, worktree `phase5-015`, node
  v24.19.0): `node tests_015_apoio.js` → **5 PASS · 0 FAIL de 5**;
  `node tests_p50_core.js` → **64 PASS · 0 FAIL de 64**;
  `python .claude/verify/check_baseline.py` → **290/290 · 0 divergentes · 0 sem
  pin**; `bash .claude/verify/run.sh` (stages `env-doctor`, `baseline`,
  `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`,
  `m41`, `suites`, `suites-heavy`, `evidence-bridge` → **PASS**; **13 PASS · 1
  FAIL de 14**, o FAIL sendo o stage `mutation` por `p51`/`p52` exigidas sem
  Chromium — causa lida da saída, não suposta). Stage `mutation` executado
  isoladamente: **4 campanhas · 2 problemas** — `d015` **13/13**, `d010`
  **24/24**, `d009` **19/19**, `core` **3/3**, zero sobreviventes; os 2 problemas
  são `p51` e `p52` (KI-3).
- E por **leitura de source**: `ui_v32.js`, `tests_015_apoio.js`,
  `tests_015_mutants.js`, `fixtures_015_apoio.js`, `tests_p50_core.js:192`,
  `.claude/verify/{expected_suites,mutation_map,mutation-matrix,pins}.json`;
  diffs por `git diff 4f7c140..HEAD` (merge-base com `origin/develop`).
- Onde o `spec-validate` acusaria "critério sem asserção", a resposta legítima é
  a §"O que NÃO é mensurável por gate" da própria spec — **não uma regex
  inventada para dar aparência de medida** (item 34).

## Itens — veredito um a um

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **C1(a)** eyebrow de `#v32prio` **não contém** `/apoi(o\|ar\|a)/i` | `ui_v32.js:749` = `Leitura das prioridades declaradas · contexto V3.2`; `D015-TIT1(a)` PASS na execução própria | **conforme** |
| 2 | **C1(b)** eyebrow **contém** a substring exata `· contexto V3.2` (ratificação do proprietário) | mesmo literal; alínea (b) PASS | **conforme** |
| 3 | **C1(c)** `<h3>` que precede `#pr-sup-prio` com **oração principal idêntica** ao eyebrow sem o sufixo | `ui_v32.js:1278` = `Leitura das prioridades declaradas`; o gate emitiu os dois textos observados lado a lado | **conforme** |
| 4 | **C1(d)** o `<h3>` do papel **não** contém o sufixo (assimetria declarada) | idem; alínea (d) PASS | **conforme** |
| 5 | **C1(e)** eyebrow ≠ e não é substring do título congelado `"Como a Fortinet pode apoiar nas prioridades declaradas"` | alínea (e) PASS. **Observação registrada** (não é gap): nenhum dos mutantes atribuídos a (a)–(e) na spec (`M1`–`M4`) mata **(e)** — `M1` restaura um literal que também não contém a substring congelada. A spec declara a dívida em bloco na §"Guarda de tautologia"; a matriz não tem par para (e) | **conforme, com observação** |
| 6 | **C1(f)** não-vacuidade que **nomeia** o estado sem sujeito | gate emitiu: `estados COM sujeito: E2,E3,E4,E6,E7,E8 · SEM sujeito (nomeados): E1,E5` — e (a)–(e) só rodam se (f) estabelecer sujeito | **conforme** |
| 7 | **C1(g)** unicidade nas **duas** metades: eyebrow único em `#app .eyebrow, #app h3`; `<h3>` único em `#v32-print-report` | alínea (g) PASS, escopos disjuntos no oráculo (`tests_015_apoio.js:414-429`) | **conforme** (ver gap **G2** quanto ao carrasco da metade tela) |
| 8 | **C1(h1)** o texto do eyebrow não pertence a `HIDE_EYEBROWS` **nem às suas duas cópias** | gate conferiu as **três** cópias e emitiu: produto (`ui_v32.js:109-110`) · oráculo de `U15` (`tests_ui_m31.js:279-280`) · fixture da 010 (`fixtures_010_vao.js:675-676`), 3 itens cada | **conforme** (ver gap **G2** quanto ao carrasco) |
| 9 | **C1(h2)** cláusula **sentinela**, sem mutante, com gatilho nomeado | alínea PASS varrendo E2,E3,E4,E6,E7,E8; nota do gate nomeia o gatilho (escopo de varredura de `hideLegacyRecommendation`) e recusa a etiqueta da 010; dívida registrada em `mutation-matrix.json → dividas_declaradas[27]` | **conforme** |
| 10 | **C2(a)** exatamente **1** `[data-pr-gap-fonte]` por bloco, atributo **próprio**, irmão de `[data-pr-gap-why]` | `ui_v32.js:1092` e `:1099`; `D015-ANC1(a)` PASS sobre **24 nós** medidos | **conforme** |
| 11 | **C2(b)** o texto casa a **propriedade** por **duas expressões independentes** (ancoragem por capability × negação de ancoragem por nível), nunca a frase inteira | alínea (b) PASS; oráculo por duas expressões (`tests_015_apoio.js:532-551`) | **conforme** |
| 12 | **C2(c)** presente nos **dois** ramos de `qsGapSupportHTML`, medido em fixtures distintas | gate emitiu: `ramo NDECL nos estados E2,E3,E5,E6,E8 (19 nós) · ramo DECL nos estados E3,E4 (5 nós)` | **conforme** |
| 13 | **C2(d)** o nó **não** nomeia produto (`!/Forti[A-Z]/`) nem repete a lista | alínea (d) PASS; literal conferido por leitura | **conforme** |
| 14 | **C2(e)** não-vacuidade com contagem esperada **declarada no gate**, por estado | gate emitiu: `estados com gap-support: E2,E3,E4,E5,E6,E8 · total de nós medidos: 24 · sem gap (nomeados): E1,E7` | **conforme** |
| 15 | **C3(a)** `#pr-howto li` = **7**, dentro da faixa 5–8 de `P51-DOC12` e do gate de PDF | `ui_v32.js:1122` (7º `<li>`); alínea (a) PASS; `P51-DOC12` verde dentro dos 64/0 do `p50core` | **conforme** |
| 16 | **C3(b)** as **duas** métricas sob 900, **cada uma nomeada com a sua suíte**, registradas **antes e depois** | execução própria: **crua 752** (antes 585, Δ 167 · `P51-DOC12`, `tests_p50_core.js:3827-3828`) e **normalizada 705** (antes 544, Δ 161 · gate de PDF, `tests_p50_chromium.js:3570-3571`, `:3597`), em cada um dos 8 estados. **Divergência de registro, corrigida e citada**: a mensagem de `de30308` anuncia "667 crus", número que **não reproduz** — a folga real é **148**, não 233 (ver `relatorio-final.md` §"O número que não reproduz") | **conforme** |
| 17 | **C3(c)** o item novo casa a propriedade por duas expressões ("mais de uma lista" + "não se somam") e cabe em **≤ 308** caracteres visíveis | alínea (c) PASS; o item custa **160** visíveis (+7 estruturais na métrica crua) | **conforme** |
| 18 | **C3(d)** a caixa continua **estática** — `outerHTML` idêntico entre duas sessões de dados diferentes | alínea (d) PASS, com guarda própria: o gate reprova por vacuidade se as duas sessões produzirem o mesmo papel (`tests_015_apoio.js:678-681`) | **conforme** |
| 19 | **C3(e)** os 6 conteúdos exigidos por `P51-DOC12:3831-3837` continuam casando | alínea (e) PASS + `p50core` 64/0 na execução própria | **conforme** |
| 20 | **C4 / `D015-RES1` — RETIRADOS pela errata E1**; `M11`–`M13` aposentados, ids não reutilizados; `renderBlocks` intocada; nenhum nó novo na tela | `D015-RES1` não existe como gate vivo: as três ocorrências no código são **comentário-trilha** (`tests_015_apoio.js:21`, `fixtures_015_apoio.js:103`, `_trilha` de `expected_suites`); `M11`–`M13` ausentes do harness, com a causa escrita (`tests_015_mutants.js:43-45`, `:320`); `git diff` não toca `renderBlocks`. **Não classificar como "faltando"** — foi decisão de produto registrada, não omissão (era exatamente o risco que a T004 previu) | **conforme (retirado)** |
| 21 | **C5 / `D015-NOSUB1`** (a)–(e) contra **âncora de commit imutável + SHA**, em E1–E8 | âncora conferida pelo gate: `382338b…:quickscan_secops_soccmm_v3_2_dev.html · 1066883 bytes · sha256 74ed7541…`; nunca `HEAD:`; (a) 3 shapes distintos de `#v32prio` exercidos; (b) 11 nomes por estado; (c) três sítios de papel; (d) nenhum comprimento diminuiu; (e) não-vacuidade nomeada. Gate PASS | **conforme** |
| 22 | **C6 / `D015-GOV1`** (a)–(d): `#pr-target` byte-idêntico, `data-eid` idêntico, não-vacuidade nomeada, E6 como ausência legítima | gate PASS; emitiu `estados com #pr-target povoado: E2,E3,E4,E5,E8` e `ausência legítima (declarada): E6,E7`. A alínea (d) é **mais forte que a spec**: além de exigir E6, confere **todo** estado sem `#pr-target` contra o que a fixture declara (`tests_015_apoio.js:865-869`) — extensão conferida, não presumida | **conforme** |
| 23 | **Mutantes previstos pela spec** (após E1/E2): `M1`–`M10`, `M14`, `M15`, `M16`, **`M17`**, **`M18`**, `M19` — cada gate novo aceito **matando um mutante escrito para ele** (R3 §5) | executados: **13** no harness `d015` (`M1`–`M10`, `M14`, `M15`, `M19`) + **`M16`** em worktree efêmera = **14 pares** na matriz. **`M17` e `M18` não estão no harness, não têm par na matriz e não constam de `dividas_declaradas`** | **GAP · G2** |
| 24 | **R-1** a substring `"Como a Fortinet pode apoiar"` guardada por `U1`/`U2`/`U7` — entra como **regressão nomeada**, sem edição de suíte congelada | `tests_ui_m31.js` não está no diff da demanda; o novo literal não contém a substring; stage `suites` PASS na execução própria (a `ui31` está entre as 17 congeladas do canônico) | **conforme** |
| 25 | **R-2** unicidade de título — vira `C1(g)`; medido em E2 que `N40`/`N41` **não alcançam o papel** | `tests_journey_m45.js` intocado; `C1(g)` implementada nas duas metades; a medição de escopo está registrada no par `D015-M19` da matriz | **conforme** (carrasco da metade tela: ver **G2**) |
| 26 | **R-3** o eyebrow continua fora das **três** cópias de ocultação | item 8; nenhuma das três listas foi alterada (`git diff`) | **conforme** |
| 27 | **R-4** o título entra no **payload de evidência pinado** de `P52-SUP3` → é restrição de **operação**, não de produto: rito de promoção (R11 §2) e/ou repin no mesmo PR | `P52-SUP3` exige Chromium (KI-3) e vive no job `visual` do CI — run **`33464353689`**: job `verify` (`99720999259`) **success** (2026-09-01T03:10:26Z); job `visual` (`99720999212`) com o passo *"Suítes visuais (playwright + chromium P50/P52/D011)"* **success** e o passo *"Campanhas de mutação com Chromium"* ainda **`in_progress`**. **Contagem por suíte não citável até o run concluir**; o registro do retorno é a T029 | **pendência declarada (CI)** |
| 28 | **Estados E1–E8** exigidos pela spec, com `d015AssertFixtureStates` | `fixtures_015_apoio.js:243` (`D015_ESTADOS` com os oito) e `:364`; os oito aparecem nas notas de todos os cinco gates. **E8** nasceu na errata E2, com o sobrevivente `automation` para impedir detecção incidental | **conforme** |
| 29 | **Contratos**: nenhum bridge, `window.__*`, módulo ou CSS novos; nenhum estado novo; 7º `<li>` literal estático; INV-8 nada serializado | `git diff 4f7c140..HEAD`: **zero** `window.__` no diff de `ui_v32.js`, **nenhum** `.css` e **nenhum** `bridges.json` no diff; stage `lint-arch` PASS na execução própria; o nó novo é função pura de `f.id` e de literal | **conforme** |
| 30 | **Restrições duras de `P51-REC1`** sobre o nó novo: irmão de `[data-pr-gap-why]`, **termina em ponto final**, sem nomear produto, sem overclaim, e **todas** as opções continuam listadas | leitura do literal (`ui_v32.js:1092`, `:1099`): termina em `deste relatório.`; `P51-REC1` verde dentro dos 64/0 do `p50core` (execução própria); `D015-NOSUB1(b)` prova o conjunto de `[data-pr-gap-opt]` idêntico à âncora | **conforme** |
| 31 | **Fora de escopo** respeitado (12 itens do refinamento + 10 da spec): `ui_target_v32.js` intocado; nenhuma suíte congelada editada; sufixo mantido; `P52_SECTIONS` não renomeada; `QS_GAP_SUPPORT`/`QIDS_AUTORIZADOS`/`MAP` intocados; nenhum número muda; nada escrito em `.claude/BACKLOG.md` | `git diff --name-only 4f7c140..HEAD` = 15 arquivos, **todos** previstos: os 4 da demanda + `ui_v32.js` + gerado + `tests_p50_core.js` (**só** o repin inline) + 4 registros de `verify` + planning-state. **Não** aparecem: `ui_target_v32.js`, `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, qualquer `.css`, `.claude/BACKLOG.md` | **conforme** |
| 32 | **Boundary e identidade**: repin inline de `PROTECTED` com trilha R8 §2 + `gen_pins.py` no mesmo PR; `declared.m41_payload_sha256` inalterado (Porta B fechada) | `tests_p50_core.js:192-219` — trilha com motivo, data, citação da autorização §29.4 e `Identidade anterior: d594dafe…9bb85`; identidade nova `9d31fef9…72b6`; **nenhuma asserção tocada**, `frozenSuites` intacto. `m41_payload_sha256` = `9794b267…4365b`, **idêntico ao da `develop`** (comparação própria). Stages `baseline` (290/290), `boundary` e `m41` **PASS** na execução própria | **conforme** |
| 33 | **Guarda de tautologia** — cada alínea sem estado alcançável de falha registrada como **dívida declarada**, com a classe certa | `mutation-matrix.json → dividas_declaradas`: `D015-TIT1(h2)` **sentinela**, `D015-GOV1(d)` **defensiva inalcançável**, `D015-NOSUB1(d)` **rede e não guarda**. As duas primeiras explicitamente contrastadas como classes **distintas** | **conforme** |
| 34 | **§"O que NÃO é mensurável por gate"** — três itens declarados, não disfarçados: redação do título, nó de ancoragem no **PDF real**, julgamento de poluição | nenhuma asserção inventada para simulá-los; os três estão nomeados na `spec.md` e endereçados à T033 (`product-owner`). A queda do C4 é a prova de que a coluna não é decorativa | **conforme (leitura humana, Fase 6)** |
| 35 | **Registros canônicos** no mesmo PR: `expected_suites.json → d015` **fixado por execução**; `mutation_map.json → d015` com `preflight: true` e alvos; matriz **expandida por par**, nunca agregada | `expected_suites` 5/0 com `_trilha` reescrito (janela vermelha encerrada, medidas antes/depois, divergência do 667); `mutation_map` com `preflight: true` no **mesmo commit** do harness que lê `--preflight`; stage `tdd` **PASS** e integridade da campanha **0 problema(s)** (IC-4 conferiu `d015: 13 âncoras com ocorrências == 1`) | **conforme** |
| 36 | **Coerência entre `spec.md` e `tasks.md`** (artefato aprovado da Fase 3) quanto a mutantes e à série de repins | o `tasks.md` (`b2ec1c4`) é **anterior à errata E1** (`3bc9c8b`) e nunca foi emendado: a §"Matriz gate↔mutante prevista (T023)" **não conhece `M17`, `M18` nem `M19`**, T018 fala em "12 mutantes" (são 13) e T023 em "13 pares" (são 14); a série de repins prevista **R2–R12** não corresponde à executada **R0–R8** (dois repins nasceram fora da série, quatro previstos foram fundidos em dois commits — mapa completo no `relatorio-final.md`) | **GAP · G1** |

## Score

**34 de 36 itens conformes — 94%.** Um item é **pendência declarada de CI**
(item 27, contado como conforme: é agendamento por desenho, KI-3, com run
nomeado). **Dois gaps**, com **a mesma raiz**, e nenhum deles se resolve
afrouxando gate (R10 §1).

## Gaps — classificados, com a direção que eu recomendo

### G1 · classe **spec-errada** — o `tasks.md` ficou anterior às erratas

**O que é.** O `tasks.md` foi aprovado e commitado (`b2ec1c4`) **antes** da
errata E1 (`3bc9c8b`), que criou `M17` e `M18`, e antes da E2 (`9c83a07`), que
criou `M19` e reatribuiu `M15`. Ele nunca foi emendado. Resultado: o artefato
aprovado da Fase 3 registra **12 mutantes** e **13 pares**, e a campanha
executada tem **13** e **14** — e a §"Matriz gate↔mutante prevista" **não
contém** `M17` nem `M18`, que a `spec.md` declara como carrascos de
`C1(g)`-tela e `C1(h1)`.

**Por que exige decisão, e não conserto de passagem.** Emendar artefato aprovado
pelo usuário é aprovação do usuário (R4), e a decisão de fundo **não é textual**:

- emendar o `tasks.md` **para casar com a `spec.md`** significa **`M17` e `M18`
  entram no harness** — trabalho do `qa-engineer`, campanha re-executada e repin
  novo;
- emendar **para casar com o executado** significa que a `spec.md` fica com dois
  mutantes previstos e não executados, e as alíneas `C1(g)`-tela e `C1(h1)`
  passam a viver de **dívida declarada** na matriz.

**Direção que eu recomendo:** **as duas coisas, nesta ordem** — primeiro
resolver o G2 (que é o conteúdo), depois emendar o `tasks.md` por **errata
mínima**, sem renumerar tarefas e sem reescrever histórico, apontando E1/E2 e
anexando o mapa real da série de repins. Razão: o `tasks.md` é lido pelo
cross-check das demandas seguintes — deixado como está, o próximo leitor herda
"12 mutantes" do mesmo jeito que herdaria "667 chars".

### G2 · classe **implementação-divergente** — `C1(h1)` está sem carrasco executado

**O que é.** A `spec.md` (errata E2 §E2.1) diz, com todas as letras, que `M18` é
o **único carrasco** de `C1(h1)`, e que `M17` é o carrasco — **prova fraca
declarada** — da metade **tela** de `C1(g)`. Nenhum dos dois está no harness
`d015` (`tests_015_mutants.js`, 13 entradas: `M1`–`M10`, `M14`, `M15`, `M19`),
nenhum tem par em `mutation-matrix.json` (14 pares `D015-*`), e **nenhum consta
de `dividas_declaradas`** — que é o lugar onde a própria matriz manda registrar
gate sem mutante ("dívida declarada, nunca omissão silenciosa").

**Divergência, não ausência — e é por isso que pesa mais.** Os dois **foram
provados uma vez**: a bateria negativa da Fase 4 registrou **15/15 detectados
(`M1`–`M10`, `M14`, `M15`, `M17`, `M18`, `M19`)** sobre um pós-fix sintético.
Esse registro vivia no `_trilha` de `d015` e **foi substituído** em `351de95`
pelo `_trilha` da contagem fixada. Hoje ele sobrevive **só no histórico do
git** — não há registro vivo, e **nenhum trigger de path o re-executa**. É a
forma exata do padrão que esta jornada já catalogou (*prova manual apodrece*,
errata E16 da 010) e do risco que a própria demanda nomeou: **alínea que fecha
verde sem poder reprovar** (família `EA-20`).

**Direção que eu recomendo:**

1. **`M18` entra no harness `d015`.** É mutação de fonte trivialmente
   automatizável (acrescentar o texto do eyebrow a `HIDE_EYEBROWS`,
   `ui_v32.js:109-110`), e `(h1)` existe precisamente para desarmar uma bomba
   com gatilho nomeado — deixá-la sem carrasco executável esvazia a alínea
   **e** a cláusula sentinela `(h2)`, que depende dela.
2. **`M17`**: entra no harness pelo mesmo custo, **ou** vira dívida declarada na
   matriz com a razão que já está escrita (`N40` o mataria também — prova
   fraca). Qualquer das duas serve, desde que **fique escrita**; o que não pode
   é continuar invisível.
3. Em ambos os casos: **a correção é do `qa-engineer`** (R3 §2 — quem escreve o
   gate não é quem implementa, e o `doc-writer` não escreve gate), com campanha
   re-executada, matriz atualizada e repin no mesmo PR (R8 §1).

**O que NÃO fazer:** rebaixar a contagem, apagar a menção a `M17`/`M18` da spec
ou reclassificá-los como "equivalentes por construção" sem medição. As três
seriam enfraquecimento (R10 §1), e a segunda apagaria decisão registrada
(R2 §5).

## Observação de método — o que **não** virou gap

Três coisas que um extrator mecânico marcaria e que **não são gaps**, com a
razão:

1. **"Critério sem asserção" nos três itens humanos** (redação do título, PDF
   real, poluição da tela): a spec os declara em §"O que NÃO é mensurável por
   gate", e a resposta correta é a Fase 6 humana — não uma regex inventada.
2. **"C4 faltando"**: foi **retirado** pela errata E1, com trilha, e os ids dos
   mutantes não foram reutilizados. A T004 existiu exatamente para impedir esta
   classificação errada.
3. **`D015-NOSUB1` e `D015-GOV1` "nasceram verdes"**: são critérios de
   **preservação**; no red a âncora e o HEAD eram o mesmo blob. Está escrito na
   spec desde a Fase 1, o discriminante vem de `M14`/`M15`/`M16`, e os três
   mataram.

## Encaminhamento

- **Iteração 1 de 2** (limite da skill). G1 e G2 vão ao orquestrador; **G1 exige
  decisão do usuário** (emenda de artefato aprovado), **G2 exige execução do
  `qa-engineer`**.
- Fechados G1 e G2, o score volta a ser medido **por execução**, não por
  releitura — e é o `qa-engineer` quem o declara.

---

## Adendo — iteração 2, 2026-09-01 · HEAD `643a0a6`

Registro do que mudou depois da 1ª edição. **Continua sem emitir veredito**: os
números abaixo são de execução própria ou de log de CI citado.

### G2 · FECHADO

`M17` e `M18` entraram no harness `d015` (`5724fbd`). Conferido no HEAD atual:

- `tests_015_mutants.js` tem **15** entradas de mutante;
- `mutation-matrix.json` tem **16 pares** `D015-*` (15 do harness + `M16` manual),
  os dois novos com `ultima_prova.resultado` **KILL**, data 2026-09-01;
- execução própria de `node tests_015_mutants.js`: **15/15 DETECTADOS**,
  `não-KILL: nenhum`, restauração source e html **byte a byte OK**, exit 0;
- `node tests_015_apoio.js` segue **5 PASS · 0 FAIL de 5**; `check_baseline.py`
  fecha **292/292 · 0 divergentes · 0 sem pin**;
- a dívida da cláusula sentinela — que **afirmava** um carrasco nunca executado —
  foi corrigida na própria entrada de `dividas_declaradas`.

**A direção que este registro recomendou foi seguida para `M18` e superada para
`M17`**, com uma razão melhor que a minha: `dividas_declaradas` é para mutante que
**não pode** rodar; `M17` tinha caso e rodava em segundos, então declará-lo dívida
seria *usar a gaveta errada para esconder trabalho barato*. Fica como **critério
de classificação**, não como preferência de estilo.

**E a medição corrigiu a spec em dois pontos** (errata E3, `7a6a572`): a forma
literal do `M17` **não isolava** — o gate reprovava antes por `(b)`, porque o
sufixo ratificado sumia junto, e **detecção incidental não é kill** —; e a frase
*"`N40` também mataria"* é **falsa**: o cenário de `N40` é modo legado, onde o
bloco não nasce. Consequência: **as duas metades de `C1(g)` são obrigação
exclusiva deste gate**, o que **reforça** a conclusão da E2.4.

### G1 · ABERTO, e mais distante do executado

O `tasks.md` não é tocado desde `b2ec1c4`. Hoje diverge em: **12 mutantes** (são
15) · **13 pares** (são 16) · matriz prevista sem `M17`/`M18`/`M19` · série de
repins **R2–R12** contra a executada **R0–R12**, com significados diferentes.
Classe **spec-errada**, **exige decisão do usuário** (R4). Recomendação
inalterada: errata mínima, sem renumerar tarefas.

### Itens que o adendo revisa

| Item | Antes | Agora |
|---|---|---|
| 7 · `C1(g)` | conforme, com remissão ao G2 | **conforme**, sem remissão |
| 8 · `C1(h1)` | conforme, com remissão ao G2 | **conforme**, sem remissão |
| 23 · mutantes previstos × executados | **GAP · G2** | **conforme** — 15 no harness, 16 pares, 15/15 KILL |
| 25 · R-2 unicidade | conforme, com ressalva sobre o carrasco da metade-tela | **conforme** — a ressalva caiu com a E3: `M17` é o carrasco pela razão certa, porque nada mais alcança o nó |
| 27 · R-4 payload de `P52-SUP3` | pendência declarada (CI) | **fechado no run `33464353689`** (head `9c88ac8`, job `visual` **success**): `p52chromium` **55 PASS · 0 FAIL de 55**, `p50chromium` **27 PASS · 0 FAIL de 27**, campanhas `p51` **19/20** (o não-KILL é a exceção nominal **KI-4**, achado `EA-7`) e `p52` **107/107**, agregado `mutation: 6 campanha(s) · 0 problema(s)`. Os bytes de produto são **idênticos** entre aquele head e o atual, medido. O run do head atual (`33468032409`) tem `verify` **success** e `visual` em curso |

### Score revisto

**35 de 36 itens conformes — 97%.** Resta **um** gap, o **G1**, de classe
`spec-errada`, cuja resolução é decisão do usuário e **não** se resolve
afrouxando gate (R10 §1).

### Achado de registro, novo neste adendo

**A nota do par `D015-M19` ainda carrega a frase que a E3 refutou** — *"a metade
de TELA, atacada por M17, é PROVA FRACA … N40 mataria M17 também"* —,
contradizendo, **no mesmo arquivo**, a nota do par `D015-M17` e a spec emendada.
Refutação registrada tem de ficar **riscada com a razão** (R2 §5), e esta está
viva num registro consultável. A matriz é do `qa-engineer`: aqui fica registrado,
não corrigido.
