# Plano — 017-semantica-do-gatilho

> Fase 2 · dono: tech-lead · consome a spec aprovada pelo usuário no chat em
> 2026-09-06 ("Prossiga" — aprovação literal, R4), commit `36073dd`, com **D4**
> (o `IC-6` sai e é substituído). Referencia [spec.md](spec.md) (D1–D5, C1–C9,
> `D017-*`) e [refinement.md](refinement.md); **não os repete e não os redecide**.
>
> Árvore medida: worktree `phase5-014`, branch `feature/017-semantica-do-gatilho`,
> HEAD `36073dd`. `git diff --stat abdddd0..HEAD` = só `spec.md` e o
> planning-state — **nenhuma linha de fonte citada pela spec derivou**; todas as
> que este plano cita foram relidas em 2026-09-06. O que foi **executado** nesta
> fase (fora da árvore, R7 §3): o stage `mutation` inteiro no HEAD, em clone
> efêmero (a worktree está suja pelo planning-state e `check_mutation.py:57-61`
> recusa); os onze `--preflight`; um protótipo descartável do julgador sobre os
> quatro estados que as waves atravessam; `check_baseline.py` no HEAD; a
> campanha `d014` completa. Números e caminhos em §Desenho.
>
> *(Execução, 2026-09-06 — edição de **registro** depois da W3, HEAD `bc12e28`,
> autorizada pelo orquestrador; TL. Entra a linha **PP-12** em §Patch-points e
> notas `*(Execução …)*` onde a execução desmentiu ou estendeu o previsto: §Um
> dono (julgador, matriz), **P1**, **P5**, §Pins (série executada — onze repins,
> dois fora da tabela; a frase sobre `[P]` na W3 estava mecanicamente errada),
> §Waves, Checklist R9 (orçamento), §Prova de carga (`M19`–`M21`), C8 (iv).
> Nenhum desenho reescrito; texto original intacto. Confirmado sem nota: janela
> 7 → 2 → 1 → 0 medida degrau a degrau (`3d8fa70`); nenhum `tdd_waiver`
> (planning-state sem a chave); nenhuma classe de boundary tocada —
> `git diff --stat 9d617d0..HEAD` = 15 arquivos: os sete da tabela abaixo +
> `pins.json`, cinco artefatos de `specs/017-…/`, `CONTEXT.md` (Fase 0) e o
> planning-state. Toda linha citada nas notas foi medida em `bc12e28`.)*

## Desenho

**Camada e superfície**: o **instrumento de prova**, exclusivamente — o stage
`mutation` (`.claude/verify/check_mutation.py`), a declaração canônica
(`.claude/verify/mutation_map.json`) e os dois emissores cujo **valor** viola
D1 (`tests_014_mutants.js`, `tests_016_mutants.js`). **Zero byte de produto**,
zero suíte de gate, nenhum módulo, nenhum stage, nenhuma suíte contada nova.
Arquivos novos só em `specs/017-semantica-do-gatilho/`.

### Um dono por arquivo (R5 §3) — e o rito de cada um

| Arquivo | Mudança | Dono | Wave | Rito (medido) |
|---|---|---|---|---|
| `.claude/verify/check_mutation.py` | bloco `---- semântica do gatilho (017) ----` (C1–C6, C8) + retirada do `IC-6` — **um único commit, o red** *(Execução: foram **dois** — o red `adb883f`, único que toca linha executável, e `126dc61`, docstring de `ex_ids_do_harness`, comentário-only, W3 — **PP-12**; repin R8a `bc12e28`)* | `qa-engineer` (é o julgador — R10; precedente T002 da 013) *(Execução: + `doc-writer` em `126dc61`, só docstring)* | W1 *(Execução: + W3, PP-12)* | pinado (`pins.json:204`); não protegido |
| `.claude/verify/mutation_map.json` | (a) `_meta.sonda_relacao` — **no commit red**; (b) `insumos` em 7 harnesses, frase em `_meta.descricao`, notas datadas em `_trilha` `:41` e `:246` | (a) `qa-engineer` · (b) `build-engineer` — **um autor por wave** (precedente 016 `plan.md:93-95`) | W1 · W2 | pinado (`:267`); não protegido |
| `tests_014_mutants.js` | `:303` → emissão repo-relativa (D1/C4 c) | `build-engineer` (precedente T006/T009/T011 da 013) | W2 | pinado (`:425`); **não** em `boundary.json`, `PROTECTED` nem `frozenSuites` |
| `tests_016_mutants.js` | `:555` → idem | `build-engineer` — **outra delegação, outro commit** | W2 | pinado (`:430`); idem |
| `.claude/verify/mutation-matrix.json` | `dividas_declaradas`: `D017-M17` (fiação) e a família de árvore `D017-M1`…`M9` sem re-execução (credor `EA-42`) *(Execução, `1aaccbe`: **três** entradas, não duas — (i) `M17` + `M19` fiação; (ii) `M1`…`M9`, `M20`, `M21` árvore one-shot; (iii) `M10`…`M16`, `M18` **instrumento** em cópia, credor `EA-42` — a classe (iii) não estava prevista aqui; 36 → 39 dívidas, 163 pares intactos; linhas de kill re-medidas sobre o estado B)* | `qa-engineer` | W3 | pinado (`:266`) |
| `specs/013-integridade-da-campanha/spec.md` | erratas aditivas `IC-6` (×3) e `C1` (C9) | `doc-writer` | W3 | pinado (`:389`) |
| `.claude/BACKLOG.md` | notas datadas `EA-3`/`EA-44`; achado novo (`ic_estatico`); correção de `:3421` (`:441-442` → `:440-441`) | `doc-writer` | W3 | pinado (`:18`); rito de forma do cabeçalho (`--rule=backlog`) |
| `specs/017-semantica-do-gatilho/{plan,tasks,red-017,spec-validate,relatorio-final}.md` | artefatos de fase | TL · TL · `qa-engineer` · `qa-engineer` · `doc-writer` | W0 · W0 · W1 · W4 · W4 | rastreado sem pin = FAIL do `baseline` → repin |
| `.claude/verify/pins.json` | regenerado | `build-engineer`, via `gen_pins.py` | todas | classe `registry` — o rito **é** o `gen_pins.py` |

Dois donos no mesmo arquivo só em **waves distintas** (`mutation_map.json`:
W1 QA, W2 build) *(Execução: também `check_mutation.py` — W1 `qa-engineer`,
W3 `doc-writer`, PP-12)*. Nenhum harness com `requires: chromium` é tocado. Os oito
arquivos de raiz que emitem `path.basename` **não são tocados** (D1). Nenhum
`tdd_waiver` previsto.

### Owner do estado (R9 §5, por analogia — nenhum bridge, nenhum estado de runtime)

| Dado novo | Owner (quem escreve) | Consumidor único | Persistência |
|---|---|---|---|
| `insumos` por harness (C2 estendido) | `build-engineer` | `check_mutation.py` (bloco 017, C2/C3) | `mutation_map.json` |
| `_meta.sonda_relacao.total = 15` (C6) | `qa-engineer` no red; depois **só por errata desta spec** (a contagem move junto) | bloco 017 (`D017-SONDA1`) | `mutation_map.json` |
| forma canônica de `arquivos_mutados` (C1 errata) | cada harness | bloco 017 (C4 → C1/C2) | JSON de `--preflight` (efêmero) |
| retorno de `mut_relacao` (contrato C5 da 017) | bloco 017 | o laço de fiação do próprio bloco | **em processo, nunca gravado** (R7 §3) |
| `dividas_declaradas` novas | `qa-engineer` | leitura humana + `check_tdd.py` (estrutura) | `mutation-matrix.json` |

### O que foi executado nesta fase (R2 §1) — os números que o desenho usa

**1. Stage `mutation` no HEAD `36073dd`** (clone efêmero de `phase5/.git` na
branch, `origin/develop` pinado em `9d617d0`, `node_modules` por junção,
`MUTATION_DEFER_MISSING=1`): **exit 0** · `---- integridade: 0 problema(s) ----`
· `[OK] IC-6: p51.targets ≡ arquivos mutados ∪ {harness} (7 caminhos)` · IC-5
19/19 · IC-9 0 · IC-10 0 · `mutation: 0 campanha(s) executada(s) · 0 problema(s)`
(nenhum `target` mudou desde a base). Esta saída, 65 linhas, é a **linha de
base da regressão de C8** — o red e o green têm de reproduzir IC-1/2/4/5/9/10
linha a linha, sem `IC-6`.

**2. Os quatro estados que as waves atravessam** — protótipo descartável do
julgador (§Protótipo) sobre os onze preflights reais (11/11 exit 0; população
19·24·19·9·1·15·35·3·53·19·108 âncoras), com os `insumos` **exatamente** como a
tabela de C7 e a lista da `d016` derivada de `git ls-files
.claude/verify/fixtures_016/` (46) menos `F5.json` e `sem_fecho.json` (= **44**):

| Estado | `D017-REL1` | `D017-REL2` | `INS1` | `FORM1(a)` | Harnesses vermelhos | Diagnóstico C4(b) |
|---|---|---|---|---|---|---|
| **A — hoje** (gate novo, sem `insumos`, sem D1) | **12** (falsos: `d014` 2, `d016` 10) | **70** (58 semânticos + os 12 espelhados) | 0 | 0 | **7** (`d009` `d010` `d011` `d014` `d015` `d016` `ea41`) | em `d014` e `d016` |
| **B — D1 + C7** | 0 | 0 | 0 | 0 | **0** — 11/11 `ok`; `insumos: oraculo 1, fixture 1` (×3), `oraculo 1`, `populacao 4`, `fixture 44, declaracao 1`, `oraculo 1, declaracao 1` | — |
| **C — só C7** (razões migradas, forma não) | 12 | 12 | 0 | 0 | **2** (`d014` 2/2, `d016` 10/10) | em `d014` e `d016` |
| **D — só D1** (forma migrada, razões não) | 0 | **58** | 0 | 0 | **7** | — |

Confirma a spec (Medição A/B: 7 vermelhos, 70/12 literal, 58/58 nas quatro
classes) **por execução do predicado**, e acrescenta o que só o protótipo
mostra: **a ordem da wave verde**. Migrar as razões primeiro (C) deixa dois
harnesses vermelhos — exatamente a história de D1, com o diagnóstico de forma
impresso **na árvore real**; migrar a forma primeiro (D) deixa sete. Decisão em
§A janela vermelha.

**3. `check_baseline.py` no HEAD**: `458/459 pins conferem · 1 divergentes · 0
ausentes · 2 sem pin` — `CONTEXT.md` **divergente** (a Fase 0 editou os
verbetes em `abdddd0` sem repin) e `refinement.md`/`spec.md` **sem pin**. O
stage está vermelho há dois portões; o **R0** desta fase fecha os três mais o
próprio `plan.md` (precedente medido na 011).

**4. Campanhas que a demanda dispara** (Medição C da spec, agora com custo
medido): `d014` — **9/9 detectados em 35 s**, restauração byte a byte, porcelain
limpo (executada no clone); `d016` — 33/33 · 3 controles em **22 s** medidos na
016 (`prova-de-carga.md:547`; hoje 35 + 3). As duas fecham **nesta máquina**.

**5. Uma coisa que a spec não nomeou e o plano precisa**: o bloco `IC-6`
(`:395-412`) vive **dentro** do `else:` de `:384` e partilha com o `IC-5` as
variáveis `_arqs51` (`:388`, `:392`) e `_oraculo` (`:389`, `:393`); o rótulo de
`:382` é `"IC-5/IC-6"`. A retirada não é "apagar 18 linhas": é PP-4/PP-5 abaixo.

### A janela vermelha (Risco 1 da spec) — decidida aqui, não descoberta na Fase 5

**É inevitável dentro do PR, e a razão é a R3 §4**: o red tem de ser
**commitado antes** da implementação, e o red desta demanda **é** o stage
`mutation` vermelho — `D017-REL2` em 7 harnesses (70 fantasmas literais) e
`D017-REL1`/`FORM1(b)` em `d014`/`d016` (12 faltantes falsos com o diagnóstico
de forma). Não existe ordem de commits que prove o red e nunca tenha um commit
vermelho: fazer mapa e harnesses **antes** do gate faria o gate nascer verde e
o red só existiria em cópia — R3 §4 chama isso de red inauditável (E3).

**Por que é aceitável, e onde ela vive**:

1. **Só na branch.** O PR é a unidade de merge; a `develop` recebe o merge
   commit, cujo estado é o **B** da tabela (11/11 verde). R14 proíbe squash,
   então os commits vermelhos ficam navegáveis no histórico — é o que se quer
   de um red — mas nenhum deles é HEAD da `develop` em momento algum.
2. **O hook Stop não a vê.** `post-turn-verify` roda `run.sh --light`; o stage
   `mutation` é `heavy: true` (`pipeline.yaml:94`) — o `--light` segue verde
   durante toda a janela (precedente 013 `plan.md:201`).
3. **O CI não a vê.** `verify.yml` dispara em `pull_request` e em `push` para
   `develop`/`main` — push na feature não roda nada (medido na 016, T041). O PR
   **abre ao fim da W2**, sobre o estado B (decisão **P5**): nenhum run de CI
   desta demanda reporta `mutation` vermelho. Nada na 017 depende de red ao vivo
   (diferente da 016, cujo P2 precisava do contexto reportado).
4. **É curta, monotônica e medida a cada passo.** Quatro commits de conteúdo,
   uma wave, um autor por commit, sem outra wave no meio: **7 → 2 → 1 → 0**
   harnesses vermelhos (estados A → C → C′ → B). Cada commit fecha **um** red
   nomeado e é revertível sozinho.
5. **Não polui o sinal de ninguém** (lição `EA-5`/016: vermelho prolongado
   ensina que vermelho é normal): o único lugar onde a janela é observável é o
   `verify` completo rodado **nesta** branch, por quem está executando a W2 e
   sabe o que espera ver — a tabela abaixo diz exatamente o quê.

| Commit (W1→W2) | `mutation` esperado depois dele (medido pelo protótipo) | Vermelhos |
|---|---|---|
| red (`check_mutation.py` + `_meta.sonda_relacao` + `red-017.md`) | REL1 12 · REL2 70 · INS1 0 · FORM1(a) 0 · SONDA1 15/15 · CORE1 impressa · IC-1/2/4/5/9/10 idênticos ao HEAD · nenhuma linha `IC-6` | **7** |
| + `mutation_map.json` (`insumos`, C7) | REL1 12 · REL2 12 — só `d014`/`d016`, todos com `[forma do path? mesmo basename nos dois lados: …]` | **2** |
| + `tests_014_mutants.js:303` | REL1 10 · REL2 10 — só `d016`; campanha `d014` roda (9/9, ~35 s) | **1** |
| + `tests_016_mutants.js:555` | **0 · 0 · 0 · 0**, 11/11 `[OK] D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>) [· insumos: …]`; campanha `d016` roda (35 + 3, ~22 s+) | **0** |

*(Execução, 2026-09-06: **confirmada** — 7 → 2 → 1 → 0 harnesses vermelhos,
medidos degrau a degrau depois de `adb883f`, `e26ee90`, `9306d40`, `4f2dc6c`
(planning-state `3d8fa70`); o red contou 9 problemas por linha — REL1 ×2 + REL2
×7 (`red-017.md:141`). Entre o red e a W2 entraram dois commits que não tocam
`targets` nem o que o bloco 017 lê — a errata 3 (`7923701`) e o seu repin
(`2c79eb2`) — sem mover o estado A.)*

**Custo residual da janela, declarado**: a partir do commit da `d014`, os dois
harnesses estão no diff contra a base e **toda** execução posterior do stage
nesta branch (W3, W4, o job `verify` do PR) re-executa `d014` e `d016` — ~1 min
por medição. É o gatilho funcionando (R3 §5), não um defeito; no CI as duas
rodam no job `verify` (node + python presentes; `MUTATION_DEFER_MISSING=1` não
as defere — 016 T063). `EA-38` (clone raso no job `visual` sob `pull_request`,
que fazia a `d016` sair 20/33) está **`resolvido`** (`BACKLOG.md:2500`).

### Decisões de desenho desta fase (sem redecidir a spec)

| id | Decisão | Por quê |
|---|---|---|
| **P1** | **A tensão da R3 §2 resolve-se por arquivo e por commit: `check_mutation.py` tem um autor (`qa-engineer`) e é editado em exatamente um commit — o red.** O green **não** passa por esse arquivo: nasce em dado (`insumos`, C7) e em emissor (D1), pelo `build-engineer`. Se um implementador precisar de mudança no gate, volta por `DEPENDÊNCIAS` ao `qa-engineer` — o implementador **não edita** o julgador (016 `plan.md:72-73`). | A 013 tolerou green no mesmo arquivo pelo mesmo autor (T004, `tasks.md:113-115`, "é o julgador"); a 016 partiu cada script em gate × instrumento por arquivo (`plan.md:39-44`) porque havia instrumento a escrever. Aqui **não há instrumento**: `mut_relacao` é o julgador puro, gêmeo de `mut_guarda_leitura` (IC-10) e `mut_perdao` (IC-9), e a sonda é o autoteste do gate (IC-9.4/IC-10 são do QA). A separação de poderes fica **mais forte** que nos dois precedentes: nenhum green toca o arquivo do gate. *(Execução, 2026-09-06: "exatamente um commit" **não se confirmou à letra** — houve uma segunda edição, `126dc61`, comentário-only (PP-12), por um terceiro autor (`doc-writer`, não implementador), autorizada pelo escalonamento 4 do `tasks.md`, não por este plano. O que P1 protege ficou de pé: nenhum green tocou o arquivo, nenhuma linha executável mudou fora do red, nenhum implementador o editou — e a prova disso é `so_docstring.py` (linha PP-12), não a promessa.)* |
| **P2** | **`_meta.sonda_relacao` nasce no commit red, pelo `qa-engineer`** — pin e gate que o lê no mesmo commit (o D4 da 013, aplicado ao pin). O `mutation_map.json` fica com dois autores em duas waves (QA W1, build W2). | Um mapa com `sonda_relacao` e sem gate é inerte; um gate lendo pin ausente é FAIL de instrumento, não o red da demanda. Se o `build-engineer` escrevesse o `15`, o implementador estaria fixando a contagem do autoteste do gate (R3 §2 ao contrário). Precedente exato: 016, `branch_protection.json` (`plan.md:93-95`, "um autor por wave"). |
| **P3** | **O `IC-6` sai no commit red**, não em edição posterior. `D017-M1`/`M2` (= `M-IC8`/`M-IC9`) morrem **já no red**: a `p51` está em identidade nos quatro estados da tabela (`ok` em A, B, C e D), logo remover `USER_GUIDE.md` de `p51.targets` dispara REL1 e devolver `ui_session_v32.js` dispara REL2 antes de qualquer green. | Alternativa "coexistir e retirar depois" custaria uma segunda edição do julgador pelo mesmo autor, sem red próprio, e um repin a mais — pelo mesmo resultado. Com P3, reverter o commit red **restaura o `IC-6` byte a byte**. |
| **P4** | **Ordem da wave verde: mapa → `d014` → `d016`.** | Tabela dos quatro estados: C (mapa primeiro) deixa 2 vermelhos que são a história de D1 com o diagnóstico (b) visível na árvore real — prova de carga de C4(b) **fora de cópia**; D (forma primeiro) deixa 7. E a `d016` por último porque é a que mais re-executa (~22 s+) e a que tem a lista de 44 a derivar no commit. |
| **P5** | **O PR abre ao fim da W2** (estado B), nunca durante a janela. Push da feature é livre a qualquer momento (não dispara CI). *(Execução, 2026-09-06: **não aconteceu** — em `bc12e28` a branch não tem ref remota (`git for-each-ref refs/remotes` sem entrada de 017) e não há PR (`gh pr list --state all --head feature/017-semantica-do-gatilho` = `[]`); o planning-state (`3d8fa70`) moveu push e PR para a Fase 6. Efeitos: nenhum run de CI desta demanda existe ainda — as campanhas `d014`/`d016` "no job `verify` do PR" (W4) ficam por medir; e o conserto do histórico da W2 (nota em §Pins) pôde ser feito em branch nunca enviada. A janela continua invisível ao CI, agora trivialmente.)* | §A janela vermelha, itens 3 e 5. |
| **P6** | **Posição do bloco 017**: entre `:463` (`---- integridade: … ----`) e `:465` (`# arquivos mudados em relação à base`) — depois do laço de IC-4 (`IC_PREFLIGHT` completo, `:330-374`), **fora** do `else:` da `p51`, antes de `changed` e do bloco E3, com contador `D017_FAILS` e fecho próprios. Antes de IC-9/IC-10, logo `IC_PREFLIGHT` está intacto (IC-10.4 insere e remove uma chave sintética em `:1301`/`:1310` — depois de nós). | Roda independente de `requires` e de trigger, como a seção da 013 (T7, `:70-75`). Contador próprio é o que permite a C8 exigir `---- integridade: 0 ----` **byte-idêntico** ao HEAD. |
| **P7** | **A lista `fixture` da `d016` é derivada por `git ls-files .claude/verify/fixtures_016/` no momento do commit**, menos as duas mutadas — nunca digitada (T060 da 016). Medido hoje: 46 − 2 = 44. Se uma fixture entrar entre W1 e W2, a lista muda e o gate acusa `REL2` nomeando — o desenho não depende do número. | `insumos` é dado; dado se deriva, não se copia da spec. |
| **P8** | **Nenhum caminho novo entra em `targets` por esta demanda** (borda 10). Nota: `ui_v32.css` e `ui_ux_v32.css` — chaves de `PROTECTED` (`tests_p50_core.js:82`, 16 chaves) — entram em `d014.insumos.populacao`; **já são `targets` da `d014` desde a 014** (`mutation_map.json:120-121`); a 017 só os classifica. Zero edição neles. | Boundary sem PARADA, dito com a chave protegida nomeada em vez de omitida. |

## Contratos e registros

- **Bridges**: nenhuma entrada nova ou alterada em `bridges.json` — não há
  módulo de runtime.
- **Ordem de injeção no builder**: não se aplica — `build_v32_html.py` não é
  tocado.
- **Contratos de instrumento**: C1 (errata de forma), C2 (extensão `insumos` +
  `_meta.sonda_relacao`) e C5 (retorno de `mut_relacao`) estão fixados em
  `spec.md` §Contratos e **não são repetidos aqui**. Vocabulário de saída:
  `spec.md` §Vocabulário fechado — a forma final da linha é extraída do
  executável no `spec-validate` (lição `E016-5`).

### Patch-points em `check_mutation.py` (numeração de `36073dd`; pin `cfee795f…`)

Nenhum monkey-patch, nenhuma função global reatribuída. O que muda, o que **não
pode** mudar de veredito, e por quê:

| PP | Onde | O que | Veredito que **não muda** |
|---|---|---|---|
| **PP-1** | `:64-67` (cabeçalho da seção 013) | `IC-6` sai da lista `(IC-1 · IC-2 · IC-4 · IC-5 · IC-6)`; uma linha aponta para o bloco 017 abaixo. Comentário | — |
| **PP-2** | `:172-176` (docstring de `ic_estatico`) | "IC-5 e IC-6 ficariam 'não medidos'" → só IC-5. Comentário; a função **não muda** (o achado dos pontos cegos é C9, não conserto) | IC-5 (reserva) |
| **PP-3** | `:376-379` (comentário "IC-5 e IC-6 · nominais à p51") | passa a dizer: IC-5 nominal à `p51`; `IC-6` substituído por `D017-REL1/REL2/INS1/FORM1` (bloco abaixo), id reservado | — |
| **PP-4** | `:382` `ic_fail("IC-5/IC-6", "p51", …)` | rótulo → `"IC-5"`, mensagem no singular ("a asserção nominal à p51 fica sem objeto") | IC-5 — o ramo é inalcançável enquanto a `p51` existir; só o texto muda |
| **PP-5** | `:388` `_arqs51 = …` · `:392` `_ids51, _arqs51 = ic_estatico(…)` | `_arqs51` perde o único consumidor (o `IC-6`); sai: `:388` apagada, `:392` → `_ids51 = ic_estatico(_f51[0])[0] if _f51 else []`. `_ids51` e `_oraculo` (`:389`, `:393`) **ficam** — o IC-5 os consome em `:425-444` | IC-5 (contagem 19/19 e `[oráculo dos ids: …]` byte-idênticos) |
| **PP-6** | `:395-412` | **o bloco `IC-6` sai inteiro** (18 linhas). Nenhuma linha `[OK] IC-6`/`[FAIL] IC-6` volta a existir | IC-5 continua em `:414-461`, intacto |
| **PP-7** | entre `:463` e `:465` | **entra o bloco `---- semântica do gatilho (017) ----`**: `D017_FAILS = 0`; `d017_fail(gate, alvo, causa)` **próprio** (incrementa `D017_FAILS`, imprime `[FAIL] D017-<x>: <alvo> · <causa>`); `mut_relacao(...)` pura (C5 da 017); `D017_CENARIOS` (15, ids i–xv); execução da sonda contra `_meta.sonda_relacao.total` **lido da raiz do JSON** (`MAP` é `["harnesses"]`, `:22` — o bloco relê `json.load(open(".claude/verify/mutation_map.json", …))["_meta"]`; a linha `:22` **não muda**); laço sobre `sorted(MAP.items())`: nome em `IC_SEM_PREFLIGHT` → `[DÍVIDA] core: … (credor: EA-44)` via `ic_divida`; `IC_PREFLIGHT.get(nome) is None` com nome presente → `[NOTA] D017: …` via `ic_nota`; senão `mut_relacao(targets, insumos, arquivos_mutados, ic_fontes(h))` e a fiação imprime/conta; fecho `---- semântica do gatilho: <n> problema(s) nomeado(s) ----` | IC-1/2/4/5 (o bloco **nunca** chama `ic_fail`, que incrementa `IC_FAILS`); `ic_ok`/`ic_nota`/`ic_divida` podem ser reusados — não contam |
| **PP-8** | `:1328` | `fails = IC_FAILS + D017_FAILS + EX_FAILS + GP_FAILS` (+ comentário). **Única linha tocada** depois do bloco; `:1332-1421` byte-idênticos — em particular o laço de trigger `:1333`, `DEFER`/`FAIL` de ambiente `:1343-1349`, `receipts` `:1407-1411`, exit `:1421` | trigger, campanha, perdão, guarda, receipts |
| **PP-9** | reuso de `ic_fontes` (`:156-168`) | `{fontes do cmd}` entra **como o token do `cmd`** (`tests_010_mutants.js`, já na forma D1) — **nunca** `os.path.basename` como o `IC-6` fazia em `:400` | — |
| **PP-10** | **anti-patch-point**: `ic_path` (`:146-148`) | **proibido** no bloco 017: ela troca `\` por `/` e tira `./` — exatamente a normalização que D1/C4 proíbem no consumidor (R7 §5). Os conjuntos comparam-se **crus**; forma fora do contrato é `FORM1` | FORM1(a) só existe se `ic_path` não for chamada |
| **PP-11** | `IC_SEM_PREFLIGHT` (`:119`), `IC_PREFLIGHT` (`:280`, `:341`) | consumidos **só em leitura**; a linha `[DÍVIDA] core: sem preflight declarado …` de T8 (`:337-338`) permanece byte-idêntica no bloco da 013 — a 017 imprime a **sua** dívida no bloco 017 (C5) | T8 |
| **PP-12** *(Execução, 2026-09-06 — não previsto na Fase 2; numeração de `bc12e28`)* | `:1230-1234` — corpo da docstring de `ex_ids_do_harness` (`def` em `:1227`, docstring `:1228-1235`; era `:1230` em `46a812d`) | **Segunda edição do julgador, comentário-only, fora do red.** A docstring dizia *"Mesma escada de IC-5/IC-6"* — descritiva, e falsa desde PP-5/PP-6 (só o IC-5 desce a `ic_estatico` como reserva; o bloco 017 não sobe a escada, PP-10). Passou a nomear a escada **do IC-5** e a dizer, em duas linhas, que o bloco 017 compara os conjuntos crus. Dono `doc-writer` (T037, tipo `doc`, sem red — nenhuma asserção muda), commit `126dc61`, repin **R8a** `bc12e28`; autorizada pelo orquestrador pelo escalonamento 4 do `tasks.md`. **Provada por três comandos, re-medidos nesta edição** (`tasks.md` §Prova mecânica de T037; `so_docstring.py` reextraído de lá, `git hash-object` = `c9267d27…`): **(1)** `python so_docstring.py 126dc61~1 126dc61` ⇒ `árvore sintática sem docstrings IDÊNTICA (20 → 20 docstrings)`, exit 0; **(2)** `git diff -U0 126dc61~1 126dc61 -- .claude/verify/check_mutation.py \| grep '^@@'` ⇒ **uma** linha, `@@ -1230,3 +1230,5 @@ def ex_ids_do_harness(nome):`; **(3)** `ast.get_docstring` da função no HEAD ⇒ `False True` (`IC-6` ausente, `IC-5` presente). **Limite declarado**: o comando (1) **passa se a docstring for apagada** — medido em cópia: `IDÊNTICA (20 → 19 docstrings)`, exit 0; quem reprova a remoção é o `+…,0` do hunk (`@@ -1228,8 +1227,0 @@`) e o `TypeError` do comando (3). Controle: `36073dd × adb883f` (o red) ⇒ `DIVERGENTE (14 → 20)`, exit 1 — o script vê código quando há código. As sete citações de `IC-6` que restam no arquivo (`:65` `:379` `:381` `:456` `:458` `:961` `:1453`) são retrospectivas e ficam; `grep -c 'IC-5/IC-6'` = 0 | **Todos** — nenhuma linha executável muda (comando 1): o julgador é o mesmo programa; IC-5, D017-*, IC-9, IC-10, trigger, campanha |

Tradução de C8 para pontos de código: **(i)** `---- integridade: 0 ----` e
todas as 41 linhas `[OK]`/`[DÍVIDA]` de IC-1/IC-2/IC-4/IC-5 idênticas à linha de
base do HEAD, **menos** a linha `IC-6`; **(ii)** blocos IC-9 e IC-10 idênticos
(`:475-1326` não tocados); **(iii)** `:1332-1421` byte-idênticos; **(iv)** o
único diff fora de PP-1…PP-8 é vazio (`git diff` do commit red contra `36073dd`
restrito ao arquivo mostra só esses hunks). *(Execução, 2026-09-06: (iv) vale
para o commit red; no HEAD `bc12e28` o `git diff f790a20 HEAD --
.claude/verify/check_mutation.py` tem **um** hunk a mais, o de PP-12 —
`@@ -1230,3 +1230,5 @@ def ex_ids_do_harness(nome):` —, provado
comentário-only; T040 (iv) já o espera.)*

### Medição do gatilho — o que cada edição dispara, e onde fecha

| Arquivo editado | Campanha (`targets` casam) | `requires` | Onde fecha | Custo medido |
|---|---|---|---|---|
| `tests_014_mutants.js` | `d014` (9 mutantes) | node + python | **local** e job `verify` do PR | 35 s (9/9, clone) |
| `tests_016_mutants.js` | `d016` (35 mutantes + 3 controles) | node + python | **local** e job `verify` do PR | 22 s na 016 (33+3) |
| `check_mutation.py` · `mutation_map.json` · `mutation-matrix.json` · `BACKLOG.md` · `specs/**` | **nenhuma** — nenhum está em `targets` de harness algum (grep no mapa) | — | — | — |

Nenhuma campanha com Chromium é exigida; o job `visual` só executa as
asserções novas como parte do `check_mutation.py` que já roda. A demanda **fecha
inteira nesta máquina** — confirmado por execução, não pelas `_trilha`s.

### Pins e a série de repins (R8 §1)

`gen_pins.py` pina blobs de **HEAD** ⇒ repin é sempre commit `chore` **posterior**
ao commit de conteúdo, um por commit de conteúdo, dono `build-engineer`,
mensagem `chore(017): gen_pins — R<n> (<motivo>)`. Planning-state não pede repin
(`gen_pins.py:29`, `.claude/project-memory/` excluído).

**Quantos**: **dez** (R0–R9), porque as waves produzem **dez commits de
conteúdo** — o número não é escolhido, é consequência da granularidade que a
janela e a revertibilidade pedem. Por que mais de um é mais honesto que o
precedente: a 008 previu um e gastou três; a 015 previu R2–R12 e executou treze
com os rótulos deslizados (`relatorio-final.md:360-380`); a 016 previu 15–16 e
executou **nove**, fundindo (`relatorio-final.md:239-270`) — e a lição escrita
lá é a que vale aqui: **rótulo é prosa; o conferível é o par (commit, arquivos
pinados)**. A tabela abaixo é esse par, previsto.

| Repin | Fecha o commit de | Cobre | Wave |
|---|---|---|---|
| **R0** | este `plan.md` (portão da Fase 2) | `CONTEXT.md` (divergente desde `abdddd0`), `refinement.md`, `spec.md`, `plan.md` — a dívida medida: `1 divergente · 2 sem pin` + este arquivo | W0 |
| **R1** | `tasks.md` (portão da Fase 3) | `tasks.md` | W0 |
| **R2** | red | `check_mutation.py`, `mutation_map.json` (`_meta.sonda_relacao`), `red-017.md` | W1 |
| **R3** | `insumos` (C7) | `mutation_map.json` | W2 |
| **R4** | emissão da `d014` | `tests_014_mutants.js` | W2 |
| **R5** | emissão da `d016` | `tests_016_mutants.js` | W2 |
| **R6** | dívidas na matriz | `mutation-matrix.json` | W3 |
| **R7** | erratas da 013 | `specs/013-integridade-da-campanha/spec.md` | W3 |
| **R8** | notas e achado no BACKLOG | `.claude/BACKLOG.md` | W3 |
| **R9** | fechamento | `spec-validate.md`, `relatorio-final.md` | W4 |

*(Execução, 2026-09-06 — a série medida até a W3, pelo par (commit → chaves de
`pins.json` que mudaram), extraído com `git show <repin> -- .claude/verify/pins.json`:)*

| Repin | Commit | Fecha o commit de | Chaves que mudaram |
|---|---|---|---|
| R0 | `f790a20` | `4b74e3a` (plano) | `CONTEXT.md`, `plan.md`, `refinement.md`, `spec.md` — como previsto |
| R1 | `d9a43d9` | `f56d4fd` (tasks) **+ `759752c`** (erratas 1–2 na spec, W0) | `spec.md`, `tasks.md` — **dois commits de conteúdo, um repin**; a tabela previa só `tasks.md` |
| R2 | `985c386` | `adb883f` (red) | `check_mutation.py`, `mutation_map.json`, `red-017.md` — como previsto |
| **R2a** | `2c79eb2` | `7923701` (errata 3 — sexta causa do `INS1`, `M20`/`M21`) | `spec.md`, `tasks.md` — **fora da tabela** |
| R3 | `953df79` | `e26ee90` | `mutation_map.json` |
| R4 | `7cc3d86` | `9306d40` | `tests_014_mutants.js` |
| R5 | `14d2046` | `4f2dc6c` | `tests_016_mutants.js` |
| R6 | `0d3cce5` | `1aaccbe` | `mutation-matrix.json` |
| R7 | `a45d697` | `4f605c1` | `specs/013-integridade-da-campanha/spec.md` |
| R8 | `8f61eb8` | `6a0c7a9` | `.claude/BACKLOG.md` |
| **R8a** | `bc12e28` | `126dc61` (PP-12) | `check_mutation.py` — **fora da tabela** |
| R9 | — | pendente (W4) | — |

*Onze executados, doze com R9 — o plano previu dez. **O que não se confirmou**:
as duas classes de desvio previstas abaixo ((a) merge de `develop`, (b) iteração
do `spec-validate`) não ocorreram até aqui; os dois extras vieram de classes que
o plano **não** previu — **errata de spec depois do red** (R2a: o red revelou
uma causa que C3 não listava, e a errata foi escolhida sobre afrouxar o gate) e
**segunda edição comentário-only do julgador** (R8a, PP-12). Um terceiro fato de
processo, registrado no planning-state (`3d8fa70`): T023/T026 foram delegadas
juntas e o `build-engineer` commitou as duas antes do repin — o commit da `d014`
ficou com registry defasado; o orquestrador **recusou fundir R4/R5** e refez a
branch local, nunca enviada (reset, R4, cherry-pick do commit da `d016`
preservando autor e mensagem, R5). O histórico final tem o par por commit; a
lição é "um commit de conteúdo por delegação quando há repin", não "fundir".*

**Desvios previstos por classe, não por número** (os dois que toda demanda
recente teve): (a) **merge de `develop` na feature** se a `develop` andar antes
do merge — repin próprio, resolvendo `pins.json` **por regeneração**, nunca à
mão (013 T023); (b) **iteração de correção do `spec-validate`** (008 iteração 2,
015 R10 2ª ed., 016 R7) — um repin por commit de correção. Ambos vão
**registrados no relatório final**, com o par (commit, arquivos), nunca
silenciados. `[P]` na W3 **não** funde repins: cada agente commita só o próprio
arquivo (`git add` nominal) e cada commit recebe o seu — a serialização é do
`build-engineer`, que executa os três em sequência depois de os três conteúdos
estarem na árvore. *(Execução, 2026-09-06: esta frase estava **mecanicamente
errada** — `gen_pins.py` pina blobs de HEAD e recusa qualquer pendência fora de
`pins.json` (`.claude/verify/gen_pins.py:71-79`, medido); com três conteúdos já
em HEAD, o primeiro repin cobriria os três e os outros dois seriam vazios —
exatamente a fusão que a frase promete evitar. A Fase 3 corrigiu (`tasks.md`
§`[P]` — onde é verdade; decisão (1) do portão): W3 **serial**, conteúdo →
repin, três vezes — e foi assim que rodou (`1aaccbe` → `0d3cce5`, `4f605c1` →
`a45d697`, `6a0c7a9` → `8f61eb8`), com T037 → T038 (PP-12, R8a) inseridos antes
de T036. Decisão de desenho desmentida, não defasagem de registro.)*

## Boundary

**Classe tocada mais alta: nenhuma.** Reconferido nesta fase por leitura de
`boundary.json` (`frozen` 4 paths de produto · `generated` 2 · `legacy` 2 ·
`registry` 1): nenhum dos oito arquivos que mudam está em classe alguma;
`pins.json` é tocado **só** pelo seu rito. `PROTECTED` (`tests_p50_core.js:82`):
**16 chaves**, listadas por grep — `engine_v32.js`, o HTML 3.1.3, seis `ui_*.js`,
`ui_icons_v32.js`, `ui_v32.css`, `ui_ux_v32.css`, `generate_icons_v32.py`, o
harness M41, o snapshot, `tests_unset_ug.js`, `MANIFEST.sha256` — **nenhum**
harness de mutação, nenhum instrumento de `.claude/verify/`. `frozenSuites`
(`:473-476`): 13 suítes, nenhuma tocada. Os dois casamentos de grep em
`tests_p50_core.js:2733`/`:2753` são prosa citando `.claude/BACKLOG.md`, não
chaves. As duas folhas protegidas que entram em `insumos.populacao` (P8) já eram
`targets` e não são editadas.

**Nenhuma PARADA; nenhum ponto deste plano pede ratificação do proprietário** —
a única decisão que o portão da Fase 1 carregou (D4) já foi ratificada em
2026-09-06. Mutantes de árvore rodam em **cópia efêmera** (R7 §3); a árvore real
nunca é mutada por prova fora da campanha do harness.

## Checklist R9 (módulo novo)

**Não se aplica** — nenhum módulo de produto é criado ou tocado. Registrado para
o checkpoint: sem IIFE, bridge, CSS, `innerHTML` ou orçamento de módulo em
questão. O que da R9 **incide por analogia**, e o plano honra: **helper único por
semântica** (§8) — a relação gatilho × conjunto mutado tem **um** julgador,
`mut_relacao`; nenhuma segunda comparação de conjuntos sobrevive no arquivo
(PP-6 tira a do `IC-6`), e `ic_path` não participa (PP-10). **Orçamento** (§7):
`check_mutation.py` tem 1.421 linhas e ganha ~200; é instrumento de pipeline,
não módulo, e cresce por **blocos com contador e fecho próprios** (013 IC-9,
IC-10, agora 017) — justificativa registrada, não licença; se um quarto bloco
vier, a extração por bloco é a conversa a ter, e ela é do TL, não de quem
implementa. *(Execução, 2026-09-06: o red `adb883f` acrescentou +380/−30 linhas
— 1.421 → 1.771 — e `bc12e28` tem **1.773**: +352 líquidas, não ~200; o
previsto estava subestimado em ~150 linhas. A justificativa registrada não muda
de natureza — um bloco com contador e fecho próprios —, mas a conversa sobre
extração por bloco está mais próxima do que este parágrafo sugeria.)*

## Waves

Dependência real dita a ordem: portões antes do red; **gate antes de qualquer
implementação; registro (pin da sonda) junto do gate que o lê; contrato (forma
D1) antes do consumidor fechar verde**. Escrita e medição **nunca na mesma
delegação** — `check_mutation.py:57-61` recusa árvore suja, e por isso toda
medição vem depois do commit. `[P]` só na W3, entre arquivos que **não medem
nada**. *(Execução: a W3 rodou **serial** — o `[P]` caiu na Fase 3; ver a nota
em §Pins.)*

| Wave | Tarefas (resumo) | Dono | Depende de |
|---|---|---|---|
| **W0** | Portões: commit deste `plan.md` → **R0** (fecha a dívida medida: `CONTEXT.md` + `refinement.md` + `spec.md` + `plan.md`); `tasks.md` → **R1**; planning-state `plan → tasks → red` (orquestrador, sem repin) | TL · `build-engineer` · orquestrador | aprovação literal do usuário, no chat, em cada portão |
| **W1** | **RED do julgador** — uma delegação, um commit: `check_mutation.py` (PP-1…PP-8) + `_meta.sonda_relacao` (P2) + `red-017.md`. Executar em árvore limpa e registrar: REL2 70 em 7 harnesses; REL1 12 (falsos) com o diagnóstico (b) em `d014`/`d016`; INS1 e FORM1(a) **verdes por vácuo — declarados**; CORE1 impressa; SONDA1 15/15; IC-1/2/4/5/9/10 idênticos à linha de base; **nenhuma** linha `IC-6`. Em cópia efêmera: `D017-M1`/`M2` (= `M-IC8`/`M-IC9`, P3), `M5`–`M7`, `M9`, `M10`–`M16`, `M18` mortos; `M17` **sobrevive à sonda** e morre por `M2` — declarado. Commit `test(017): red — …` → **R2**; `red.status: proven` com o SHA | `qa-engineer` · `build-engineer` (R2) · orquestrador | W0 |
| **W2** | **GREEN, sequencial, um arquivo por delegação, medição depois de cada commit** (P4): (a) `mutation_map.json` — `insumos` nos 7 (tabela C7 da spec; `d016` derivada por P7), frase em `_meta.descricao`, notas datadas em `_trilha` `:41`/`:246` → medir: **2 vermelhos** (`d014` 2/2, `d016` 10/10, ambos com o diagnóstico) → **R3**; (b) `tests_014_mutants.js:303` → medir: **1 vermelho** (`d016`), campanha `d014` 9/9 → **R4**; (c) `tests_016_mutants.js:555` → medir: **11/11 verde**, campanha `d016` 35/35 + 3 → **R5**. `D017-M3` (remover `.claude/verify/regra_morta.js` de `d014.targets`), `M4` (retirar `fixture` da `d010`) e `M8` (reverter a emissão da `d014` em cópia) medidos **aqui**, pós-green, pelo QA. Push; **abrir o PR** (P5) *(Execução: 7 → 2 → 1 → 0 confirmado (`3d8fa70`); push e PR **não** feitos na W2 — ver P5)* | `build-engineer` (escreve) · `qa-engineer` (mede, nada escreve — R3 §2) | W1 (red commitado) |
| **W3** | **Registros `[P]`**: `mutation-matrix.json` — `dividas_declaradas` (`D017-M17`; família de árvore sem re-execução, credor `EA-42`; molde: a entrada `EA41-EOL0/EOL1`) → **R6** ∥ erratas `IC-6` (`:116`, `:194`, `:231-232`) e `C1` (`:205-226`) na spec da 013, forma de `:462-495`, com os SHAs do red e da W2 → **R7** ∥ `BACKLOG.md`: notas `EA-3`/`EA-44`, achado `ic_estatico` (`:171-182`), correção `:3421` → **R8** (rito `--rule=backlog` antes do commit) *(Execução: **serial**, conteúdo → repin ×3, e mais T037 → T038 — docstring de `check_mutation.py`, PP-12, `126dc61` → R8a `bc12e28` — antes de T036; ver §Pins)* | `qa-engineer` ∥ `doc-writer` (dois commits) · `build-engineer` (R6–R8 em sequência) | W2 (os SHAs que as erratas citam existem) |
| **W4** | **Validação**: pipeline completo (skill `verify`, contagens citadas); **regressão C8 por diff** das linhas IC contra a linha de base do HEAD `36073dd`; campanhas `d014`/`d016` no job `verify` do PR; `spec-validate` → `spec-validate.md`; aceite de intenção do PO ("não encontrei objeção" ou reprova); `relatorio-final.md` com **repins executados × previstos**; commit de fechamento → **R9**. **Merge é do usuário** | `qa-engineer` · `product-owner` · `doc-writer` · `build-engineer` | W3 |

**Tipagem prevista** (R3 — a matriz final é do `tasks.md`): W1 `feature` (o red
é provado nela mesma); W2(a) `fix` (red em W1: REL2 70); W2(b)/(c) `fix` (red em
W1: REL1 12 + FORM1(b)); W3 `chore` (matriz) e `doc` (erratas, BACKLOG); repins
`chore`; W4 `chore`/`doc`. **Nenhum `tdd_waiver`** — se algum for necessário,
entra no planning-state com motivo e data e o `compliance-audit` o lista.

**Prova de carga por gate — de onde vêm os dentes, medido hoje** (o `tasks.md`
transforma isto na tabela gate · estado · produzido em · medido em):

| Gate | Hoje (estado A, medido) | Dentes | Onde morre |
|---|---|---|---|
| `D017-REL1` | 12 faltantes **falsos** (forma) — o estado real da árvore | `M1` (red), `M3` (pós-green), sonda ii/viii | cópia efêmera W1/W2 + sonda |
| `D017-REL2` | **70** fantasmas em 7 harnesses — red natural | C7 fecha; `M2` (red), `M4` (pós-green), sonda iii | árvore real (W2a) + cópia + sonda |
| `D017-INS1` | verde **por vácuo** (nenhum `insumos`) — declarado | `M5`/`M6`/`M7`, sonda v/vi/vii/xii/xiii | cópia + sonda, exclusivamente |
| `D017-FORM1` (a) | verde por vácuo — declarado; razão de existir: `\` do Windows | `M9`, sonda xiv | cópia + sonda |
| `D017-FORM1` (b)(c) | **vermelho** em `d014`/`d016` com o diagnóstico impresso | D1 fecha; `M8` = reverter a emissão | árvore real (estados A e C) + cópia |
| `D017-CORE1` | linha impressa (o `core` existe) | `M14`, sonda ix | sonda |
| `D017-SONDA1` | 15/15 verde | `M10`–`M16`, `M18`; `M17` sobrevive → `M2` | sonda + cópia |

*(Execução, 2026-09-06: a spec ganhou **três** mutantes por errata depois deste
plano — `D017-M19` (W0, errata 1: fiação do ramo `[NOTA]` de C1, morre sob o
estado NOTA em cópia; `_meta.sonda_relacao.total` continua 15, medido) e
`D017-M20`/`M21` (errata 3, pós-red: sexta causa de `INS1` e `FORM1(a)` com
elemento não-string/vazio, medidos em T022). Nenhuma linha desta tabela muda de
carrasco; os três estão em `dividas_declaradas` (`1aaccbe`) — `M19` como fiação,
`M20`/`M21` como árvore one-shot.)*

## Riscos e rollback

| Risco | Detecção (gate) | Reversão |
|---|---|---|
| **Janela vermelha** (W1→W2) lida como quebra | Relato por asserção com o esperado **tabelado** (§A janela vermelha); `--light` verde; PR fechado até o estado B | Nenhuma — é o red. Reverter o commit red restaura o `IC-6` byte a byte (P3) |
| **Windows**: `path.relative` emite `\` | `FORM1(a)` reprova **localmente**, antes do CI — é o desenho (R7 §5); a migração usa `.split(path.sep).join("/")` | `git revert` do commit do harness |
| **Lista de 44 da `d016` deriva** (fixture entra entre W1 e W2) | `REL2` nomeia a fixture nova como fantasma; P7 deriva no commit, não copia | recompor `insumos.fixture` por `git ls-files` e recommitar |
| **`_arqs51` removida quebra o IC-5** | Regressão C8: IC-5 usa só `_ids51`/`_oraculo` (`:425-444`); a linha de base tem `19/19` e `19 par(es)` para comparar | revert do commit red |
| **Bloco 017 conta em `IC_FAILS`** por reuso de `ic_fail` | C8: `---- integridade: 0 ----` deixaria de ser byte-idêntico no red | PP-7: `d017_fail` próprio — verificado pelo diff do red |
| **Campanhas `d014`/`d016` re-executam em toda medição** após W2 | esperado; ~1 min por `verify`; no CI, no job `verify` | nenhuma — é R3 §5 |
| **Repin fora de R0–R9** (merge de `develop`; iteração do `spec-validate`) *(Execução: dois — R2a, R8a —, de classes **não** previstas; ver §Pins)* | stage `baseline` FAIL — impossível de silenciar | repin próprio + registro no relatório final |
| **`_trilha` da `d016` cita `:1287`** e o laço está em `:1333` | nota datada em W2(a) — não se reescreve a trilha (R2 §5) | — |
| **Protótipo vira produção** | R3 §2: o `mut_relacao` do protótipo é do TL e **não** é o gate; o `qa-engineer` escreve o seu a partir da spec; o protótipo não está na árvore | — |

Rollback geral: cada commit de W2 isola **um** red fechado e reverte sozinho;
W3 e W4 são doc/registro. Não há migração de dado irreversível — `insumos` é
aditivo e `insumos` ausente ≡ `{}` (borda 9).

## Protótipo

**Executado, descartável, fora da árvore** — não em branch `prototype/*`,
porque não há código a conservar: um script sobre os onze preflights reais
(o mesmo predicado da spec, 60 linhas) e o stage real em clone efêmero. Saída
guardada no scratchpad da sessão, **não versionada**; os números só entram no
repositório quando o gate real os produzir (`red-017.md`, R2 §1).

Perguntas que só código respondia, e as respostas: **(1)** as quatro classes
de D2 fecham 58/58 **por execução**, com a `d016` derivada e não digitada —
sim, estado B 0/0/0/0; **(2)** qual ordem da wave verde minimiza a janela —
mapa primeiro (C: 2 vermelhos) e não forma primeiro (D: 7); **(3)** o
diagnóstico C4(b) é observável na **árvore real**, não só em cópia — sim, em
`d014` e `d016` nos estados A e C; **(4)** a `p51` fica em identidade em todos os
estados, logo `M-IC8`/`M-IC9` re-morrem **já no red** (P3); **(5)** o stage no
HEAD está verde e a saída de 65 linhas é comparável linha a linha (C8).

O que o protótipo **não** é: o julgador de produção. O `qa-engineer` escreve
`mut_relacao` a partir de `spec.md` §Contratos C5 e §Os 15 cenários — o esboço
do TL não viaja no prompt (R3 §2, §3: o que viaja é o **caminho da spec**).
