# Registro de selagem — v3.2.12 (2026-10-31)

> Rito R14: release `develop → main` **sob pedido explícito do proprietário no
> chat**. Decisões que ancoram este registro, todas no chat do proprietário:
>
> - 2026-10-19: *"Vamos de (a), release com a tag"*, nome da tag *"v3.2.11"* —
>   rota (a): release com tag, **sem abrir fase de produto**.
> - 2026-10-25: *"Corrigir produto antes de selar"* — a tag `v3.2.11` ficou
>   **suspensa** até os defeitos de curadoria `EA-91`/`EA-92` serem corrigidos.
> - 2026-10-27 a 2026-10-30: a demanda 025 (`specs/025-curadoria-transacional/`)
>   foi aprovada portão a portão (`refinement.md`, rodadas 1 a 8) e mesclada no
>   PR #114 (2026-10-31T01:33:40Z).
> - 2026-10-30: *"Prossiga até abrir o PR"* — autoriza **montar** o PR de selagem;
>   a mescla, o fast-forward e a tag continuam sendo atos dele.
>
> Commit de selagem doc-only, separado; merge fast-forward (sem squash); tag
> anotada sobre o HEAD da `main`, com os hashes abaixo.
>
> **O nome `v3.2.12` é PROPOSTA do orquestrador, pendente de ratificação do
> proprietário na mescla do PR de selagem — não é fato consumado.** Motivo da
> proposta: o nome `v3.2.11` já está ligado ao SHA-256 `4c45ce20…5712` no
> `README.md`, em `deploy/v3.2.11/V3_2_11_PRODUCTION_DEPLOYMENT_RECORD.md`, no
> pacote entregue em reunião (2026-10-27) e no serviço em `127.0.0.1:1337`
> (container `quickscan-v3211`; `curl -s http://127.0.0.1:1337/ | sha256sum` deu
> `4c45ce20…`, medição do orquestrador em 2026-10-31 e do `build-engineer` em
> 2026-10-30). `preparar_release.py:45-47` recusa sobrescrever um release
> ("release nunca e sobrescrito"). Dois artefatos com o mesmo nome quebrariam a
> trilha de identidade — a classe do `EA-64`. A v3.2.11 fica como **artefato
> publicado sem tag**, como a v3.2.3, v3.2.4, v3.2.5 e v3.2.10.
>
> Este registro **substitui** o vigente (`SELAGEM_V3_2_11.md`), cujo adendo de
> 2026-10-25 dizia: *"Este registro será atualizado (ou substituído) na selagem
> efetiva"*. O registro da v3.2.11 permanece, com adendo de 2026-10-31, como
> trilha (R2 §5).
>
> Este registro não declara fase concluída nem selada (CLAUDE.md §Limites de
> autonomia): `fase_corrente` segue 5.2 `SELADA`. Convenção de fonte: **"medição do
> orquestrador"** é número que li de arquivo do orquestrador e não reexecutei;
> **"medido por mim"** é execução desta escrita (`doc-writer`, HEAD `66b0c5a`).

## Dois hashes, e não o mesmo

- **Conteúdo da v3.2.12**: `9ca1fdea00c6f4274330ff066709af725ea1a4b6` — a `develop`
  depois do merge do PR #114 e o último commit que toca produto. O PR de selagem
  (BACKLOG, README, este registro, `current_phase.json`, `pins.json`) é
  **doc-only**; logo o numstat canônico em `9ca1fde` é o numstat da release. Onde
  este registro diz "SHA final", leia `9ca1fde`, com esta ressalva. O commit
  `66b0c5a` (`current_phase.json` → `release_corrente` v3.2.12, conteúdo `9ca1fde`;
  bloco `superada` para a v3.2.11) é o primeiro commit da branch de selagem
  `chore/selagem-v3.2.12`; `git diff --stat 9ca1fde 66b0c5a` lista só esse arquivo
  (medido por mim).
- **Tag**: `v3.2.12` (nome proposto) aponta para o merge do PR de selagem na
  `develop`, que depois vai à `main` por fast-forward. Esse hash só existe depois da
  mescla; fica na própria tag anotada e no commit de `main`, e **não é escrito aqui**
  para não ser inventado. É o padrão `merge`/`conteúdo` que a 5.2 já usa em
  `current_phase.json` (merge `07bc90b` · conteúdo `c1e3649`).
- **O link da tag** no `README.md` (`…/tree/v3.2.12`) resolve a partir do push da
  tag, no mesmo ato de release. A v3.2.12 **não terá Release do GitHub** nesta
  selagem (as releases existem até a `v3.2.9`); criar uma é decisão do proprietário,
  ainda não tomada.

## Desvio declarado: o produto mudou sob a fase 5.2 SELADA, sem o gate de abertura de fase

A selagem anterior (`SELAGEM_V3_2_2_ESTRUTURA_1.md`) registrou "Produto
INALTERADO". Esta não pode registrar isso — e o desvio já declarado em
`SELAGEM_V3_2_11.md` continua valendo, com a 025 a mais.

- A 5.2 foi selada no merge `07bc90b` (PR #8, 2026-08-24; a tag `v3.2.1` aponta
  para ele), que trouxe o commit de conteúdo `c1e3649`.
- Desde então o produto passou de v3.2.1 a v3.2.12 com `current_phase.json` em
  `fase_corrente` 5.2 `SELADA` e `proxima_fase` `NAO_ABERTA`, sem
  `specs/PHASE_X*.md` com hash registrado. O gate de abertura de fase da R4
  (`sdd.md`, "Gates de fase") não foi cumprido.
- O proprietário decidiu declarar o desvio e selar (rota (a)), em vez de abrir uma
  5.3 retroativa (2026-10-19). O que segue é a medida do desvio, **recomputada** em
  `c1e3649..9ca1fde` (a da v3.2.11 era `c1e3649..0bd677c`).

Medido em 2026-10-31 (orquestrador) e conferido por mim, com **um escopo e um
intervalo**: escopo = o que o builder consome como produto próprio (`engine_v32.js`,
`build_v32_html.py`, o HTML dev, `ui_*.js`, `ui_*.css`), com o `USER_GUIDE.md` em
linha própria; intervalo = do commit de conteúdo da 5.2 até o commit de conteúdo da
v3.2.12. `E` = o pathspec
`engine_v32.js build_v32_html.py quickscan_secops_soccmm_v3_2_dev.html 'ui_*.js' 'ui_*.css'`.

| Medida | Valor | Comando |
|---|---|---|
| Arquivos de produto alterados | **20 · +10.973/−438** | `git diff --numstat c1e3649 9ca1fde -- E`, somando as colunas |
| `USER_GUIDE.md` (linha própria) | **+114/−25** | `git diff --numstat c1e3649 9ca1fde -- USER_GUIDE.md` |
| · já na `main` (`c1e3649..e03b0f0`) | 4 · +2.138/−264 | idem, sobre `E`, com `c1e3649 e03b0f0` |
| · levados por esta selagem (`e03b0f0..9ca1fde`) | 20 · +8.863/−202 | idem, sobre `E`, com `e03b0f0 9ca1fde` |
| HTML dev | +5.490/−218 | `git diff --numstat c1e3649 9ca1fde -- quickscan_secops_soccmm_v3_2_dev.html` |
| `engine_v32.js` | **0 linhas** | `git diff --numstat c1e3649 9ca1fde -- engine_v32.js` (saída vazia) |
| Demais paths `frozen` (`boundary.json`) | 0 linhas | idem, para `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json` |
| Módulos novos | 5 `ui_*.js` + 3 `ui_*.css` (os mesmos da v3.2.11) | `git diff --name-status --diff-filter=A c1e3649 9ca1fde -- 'ui_*'` (8 linhas `A`) |
| Entrada na `develop` | 91 merges de PR; 0 commits diretos | `git log --first-parent --merges --format=%h e03b0f0..9ca1fde`; `git log --first-parent --no-merges e03b0f0..9ca1fde` (vazio) |

O 20º arquivo, em relação à v3.2.11 (19 · +10.739/−422), é `ui_ux_v32.js` (+3/−1):
`git log c1e3649..0bd677c -- ui_ux_v32.js` é vazio (medido por mim), logo ele entra no
desvio só com a 025. Os dois
trechos (`c1e3649..e03b0f0` e `e03b0f0..9ca1fde`) somam 11.001 adições, não 10.973:
linhas escritas no primeiro foram reescritas no segundo. Os 5 módulos novos são
`ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_d011_prioridade_v32.js`,
`ui_ondas_v32.js` e `ui_p52_support_v32.js`; os 3 CSS novos são
`ui_d011_prioridade_v32.css`, `ui_ondas_v32.css` e `ui_p52_support_v32.css`.

**Como entrou.** Dos 91 PRs, 24 alteram arquivo de `E` (diff de cada merge contra o
primeiro pai, sobre `E`: `git diff --quiet <m>^ <m> -- E`, medido por mim); os
outros 67 não alteram:

- 9 demandas da máquina SDD, cada uma com `specs/NNN-*/` e planning-state `done`:
  #24 (009), #31 (010), #32 (011), #34 (015), #88 (019), #101 (021), #104 (022),
  #106 (023) e **#114 (025)** — soma por PR **+5.921/−168** (era +5.639/−104 sem a
  025; a 025 contribui com +282/−64).
- 15 PRs `fix/*` sem planning-state: #62, #64, #67, #70, #71, #81, #83, #84, #86,
  #91, #94, #95, #97, #103, #105 — soma por PR **+3.213/−305**, igual à da v3.2.11:
  nenhum `fix/*` entrou em `E` depois de `0bd677c`. A R4 dispensa spec para correção
  de achado registrado (skill `fix-finding`); este registro não reavalia se cada um
  se enquadrava como tal.

A soma por PR conta duas vezes a linha que um PR seguinte reescreve, e por isso não
fecha com a diferença líquida da tabela. Dos 18 planning-states que entram na `main`
(008 e 009…025; 003 e 007 já estavam em `e03b0f0`), 9 mudaram produto — 009, 010,
011, 015, 019, 021, 022, 023 e 025 — e 9 não: 008 (evidência), 012 (backlog), 013,
014, 016, 017 e 018 (processo e instrumento de verificação), e 020 e 024 (refutadas
no portão da Fase 0). Os 20 planning-states `done` somam 003…025
(`.claude/project-memory/planning-state/`, medido por mim: 20 arquivos, todos
`phase: done`).

## O que mudou desde a candidata v3.2.11 (`0bd677c..9ca1fde`)

Quatro merges first-parent entraram depois do conteúdo da v3.2.11; **só o #114
toca produto**.

| PR | Merge | Mesclado (UTC) | O que é |
|---|---|---|---|
| #111 | `cee02e9` | 2026-10-20T08:20:38Z | `chore/selagem-v3.2.11` — registro de selagem da v3.2.11, README, BACKLOG, `current_phase.json` (doc-only; conteúdo `0bd677c`) |
| #112 | `6933179` | 2026-10-27T21:28:28Z | `chore/registro-auditoria-codex` — registro da auditoria externa (Codex) e da refutação adversarial, `EA-91`…`EA-116`; tag v3.2.11 suspensa |
| #113 | `da71759` | 2026-10-27T21:28:44Z | `fix/EA-101-lint-arch-modulos-novos` — `lint-arch` varre `ui_*_v32.js` menos allowlist nominal dos legados 4.x |
| #114 | `9ca1fde` | 2026-10-31T01:33:40Z | `feature/025-curadoria-transacional` — curadoria transacional na sessão (`EA-91`/`EA-92`) |

Numstat do que tocou produto, `git diff --numstat 0bd677c 9ca1fde -- E` (medido por
mim; 6 arquivos, **+282/−64**):

| Arquivo | + | − |
|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` (gerado) | 141 | 32 |
| `ui_curation_v32.js` | 84 | 11 |
| `ui_session_v32.js` | 40 | 17 |
| `ui_curation_edit_v32.js` | 8 | 2 |
| `ui_v32.js` | 6 | 1 |
| `ui_ux_v32.js` | 3 | 1 |

`engine_v32.js`, `build_v32_html.py` e todo `ui_*.css`: **vazio** na janela. Fora de
`E`, a janela toca ainda `README.md` (+18/−8), `CONTEXT.md` (+31/−1),
`SESSION_SCHEMA_V32.md` (+15/−4), `USER_GUIDE.md` (+6/−1),
`synthetic_session_examples/exemplo-completo.json` (+6/−0) e os gates
`tests_019_curadoria.js` (+3/−2), `tests_p50_core.js` (+32/−3),
`tests_session_m48.js` (+84/−11), `tests_025_curadoria_sessao.js` (novo, +842) e
`tests_025_mutants.js` (novo, +413) — `git diff --numstat 0bd677c 9ca1fde`, medido
por mim.

**O que a 025 corrige** (cito, não repito: `specs/025-curadoria-transacional/relatorio-final.md`,
§Objetivo cumprido e §EA fechados). A curadoria do relatório — a sexta chave
canônica da sessão, nascida na 019 — passa a obedecer o ciclo de vida dos outros
owners: a importação deixa de **aplicar ao validar** (`__CURATION.validate` é
puro), a curadoria — inclusive a **ausência** — é a 11ª chave do candidato e do
commit, o snapshot é a primeira instrução de `commitCanonicalOwners`, "Nova sessão" e
"Reiniciar avaliação" a limpam e descartam o `draft` do editor, e a prévia e o aviso
de substituição a mencionam. Achados passados a `resolvido` no `.claude/BACKLOG.md`
por esse PR: `EA-91`, `EA-92`, `EA-105`, `EA-106`, `EA-107`, `EA-108`, `EA-109`,
`EA-110`, `EA-111`, `EA-112` (**com resíduo declarado**: as fixtures curadas das
suítes congeladas ficaram de fora), `EA-113` e `EA-114` — status conferido por mim
no `BACKLOG.md` de `66b0c5a`. `EA-115` permanece `aberto` (só a redação de C10
entrou) e `EA-116` ficou intocado. O relatório final cita, da 025: 16 gates
`D025-*`, 4 reancoragens na m48, 23 mutantes (campanha `23 DETECTADO · 0
SOBREVIVENTE`), `spec-validate` 42/42 na segunda iteração, aceite do
`product-owner` "não encontrei objeção" condicionado à prova verde — **números do
relatório final, que li e não reexecutei**.

Efeito de usuário que o relatório nomeia como *juiz* da versão (registro de deploy
do `build-engineer`): exportar uma sessão com curadoria, importar outra **sem** a
chave de curadoria e confirmar que a curadoria anterior **não** sobrevive; cancelar
a importação e confirmar que nada mudou; confirmar que *Nova sessão* e *Reiniciar
avaliação* deixam a curadoria vazia. **Esse juiz é uma sessão real e não foi
executado por mim.**

## Fronteira (R6)

- `frozen`: nenhuma mudança (tabela). `generated`: `ui_icons_v32.js` com 0 linhas
  (`git diff --numstat c1e3649 9ca1fde -- ui_icons_v32.js`, vazio, medido por mim); o
  HTML dev muda só pelo builder, e o stage `build` prova a identidade (dentro do
  `run.sh` 18 PASS, abaixo). `legacy`: `MANIFEST.sha256` e
  `specs/PHASE_5_0_REV_A.md` sem mudança em `e03b0f0..9ca1fde` (`git diff
  --numstat`, vazio, medido por mim).
- **`build_v32_html.py` na tabela do desvio.** O arquivo está em `E` (+21/−3 em
  `c1e3649..9ca1fde`; **0** em `0bd677c..9ca1fde`) e **não consta de nenhuma das
  quatro classes de `.claude/verify/boundary.json`** (`frozen`: engine, Camada 1,
  harness M41, snapshot; `generated`: HTML dev e `ui_icons`; `legacy`; `registry`):
  aparece ali apenas no texto do `rito` da classe `generated`, como o gerador. Está no
  registry de pins (`pins.json`, 1 ocorrência — medido por mim) e **não** na lista
  `PROTECTED` da §29.4. Um rascunho de fatos do orquestrador o rotulava como
  `frozen`; pelo `boundary.json` ele é **gerador pinado, fora das classes
  protegidas**. As 21 linhas são injeção dos módulos novos (019, 011, 022) e LF por
  construção da Onda 0 — `git diff c1e3649 9ca1fde -- build_v32_html.py`, lido por
  mim.
- Lista da §29.4 (`PROTECTED`, `tests_p50_core.js:82`, 16 entradas — extraída por
  `eval` do literal, medido por mim): **seis** arquivos mudaram desde a `main` —
  `ui_v32.js`, `ui_ux_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`,
  `ui_session_v32.js`, `ui_ux_v32.css` (`git diff --name-only e03b0f0 9ca1fde`
  filtrado pela lista); **três** desde a candidata v3.2.11 (`0bd677c`): `ui_v32.js`,
  `ui_ux_v32.js`, `ui_session_v32.js`. A mudança desses três é a 025, sob
  **autorização nominal §29.4 do proprietário no portão da Fase 0** (2026-10-27,
  `specs/025-curadoria-transacional/refinement.md`), com a trilha *"Identidade
  anterior"* nos pinos inline de `tests_p50_core.js` (commit `97f08d8`). Este registro
  conferiu que os seis têm trilha e que o stage `suites` (que inclui `p50core`, 65/0
  no relatório da 025) fecha verde; **não reconferiu cada autorização contra o
  chat**.
- `current_phase.json`: `release_corrente` ganha v3.2.12 e a nota de medição por
  acréscimo, no commit `66b0c5a` (do orquestrador). O repin do registry é commit
  próprio dele, depois deste.

## O que esta selagem consolida (`main` está atrás em `e03b0f0`)

`git rev-list --count e03b0f0..9ca1fde` = 1.074 (117 merges, 957 não-merge);
`git merge-base --is-ancestor e03b0f0 9ca1fde` = verdadeiro, logo fast-forward
(medido por mim; `origin/main` = `e03b0f0`). `e03b0f0` é a tag
`v3.2.2-estrutura.1`, da selagem anterior.

- **Produto v3.2.2 → v3.2.12**: ver o desvio acima. SHA-256 do HTML dev
  (`quickscan_secops_soccmm_v3_2_dev.html`, 1.248.772 bytes):
  `024abf113f30098617cf9f0617d51295903634839fb6e1b07b625f13baa03885`.
  `git show 9ca1fde:quickscan_secops_soccmm_v3_2_dev.html | sha256sum` dá esse valor
  e `| wc -c` dá 1248772 (medido por mim). O registro de deploy do
  `build-engineer` (`deploy/v3.2.12/V3_2_12_PRODUCTION_DEPLOYMENT_RECORD.md`,
  SHA-256 do registro
  `4dee3d67325669382afa584398d4c22b814411c5e12d4b00f2427c7eb161762f` — conferi com
  `sha256sum`) declara o artefato `deploy/v3.2.12/quickscan_secops_soccmm_v3_2_12.html`
  idêntico ao blob (`cmp`), e eu conferi o `sha256sum` desse artefato:
  `024abf11…3885`, igual. O artefato foi preparado em 2026-10-30 por
  `preparar_release.py v3.2.12`.
  **Ressalva: `deploy/` mora fora do repositório (`EA-53`)** — a existência e o
  conteúdo desses arquivos não são verificáveis por git; o que o git permite
  conferir é o blob de `9ca1fde`.
- **Cresceu 6.726 bytes sobre a v3.2.11** (1.242.046 → 1.248.772), segundo o
  registro de deploy; a conta confere com os bytes acima.
- **Engine e régua D2**: `engine_v32.js` SHA-256
  `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (0 linhas
  alteradas na janela; `git show 9ca1fde:engine_v32.js | sha256sum`, medido por mim);
  payload M41 `pins.json → declared.m41_payload_sha256` =
  `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b`, igual em
  `e03b0f0` e em `9ca1fde` (medição do orquestrador); 529 pins em `9ca1fde`. O
  registro de deploy cita, medido pelo `build-engineer` com `--compare`:
  `COMPARAÇÃO: PASS — payload funcional idêntico ao baseline`, `SANIDADE: OK ·
  cenários: 9`, e `check_m41.py` OK; stage `m41` dentro do `run.sh` 18 PASS
  (medição do orquestrador).
- **Tags**: o remoto (`git ls-remote --tags origin`, medido por mim em 2026-10-31)
  tem `v3.2-phase5.1`, `v3.2.1`, `v3.2.2`, `v3.2.2-estrutura.1`, `v3.2.6` → `31ea762`
  (PR #86), `v3.2.7` → `cc6ffad` (#88), `v3.2.8` → `789d87c` (#95) e `v3.2.9` →
  `e95cfe4` (#101), mais as tags de evidência. **Sem tag no remoto**: v3.2.3, v3.2.4,
  v3.2.5, **v3.2.10, v3.2.11 e v3.2.12** (os artefatos estão em `deploy/`, fora do
  git). **A tag anotada `v3.2.12` nasce nesta
  selagem, se o nome for ratificado**, sobre o HEAD da `main` (conteúdo `9ca1fde`;
  ver "Dois hashes"). Ela dá ao repositório o registro de qual commit é a versão que
  o `EA-64` (`.claude/BACKLOG.md`, `aberto`) aponta como ausente; o remédio de raiz
  que o `EA-64` descreve (registro escrito por `preparar_release.py`) não é feito
  aqui, e o `EA-64` ganhou nota de 2026-10-31 dizendo isso — o status não muda.
- **Demandas**: 18 planning-states `done` entram na `main` (008, 009…025); 9
  mudaram produto (009, 010, 011, 015, 019, 021, 022, 023, 025); 9 não. A 025 está
  fechada (`phase: done`; PR #114 aberto antes do merge, conforme a R4 — fecho
  C8 da demanda 016).
- **Instrumento**: o pipeline segue com 18 stages; a `develop` declara
  `checks_obrigatorios` = `verify`, `visual`, `fecho` em
  `.claude/verify/branch_protection.json` (ADR
  `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md`). O PR #113 (`EA-101`)
  alargou o `lint-arch` aos módulos `ui_*_v32.js` com allowlist nominal dos legados.
- **Backlog**: `.claude/BACKLOG.md` não existe na `main` (`git cat-file -e
  e03b0f0:.claude/BACKLOG.md` falha); entra com os ids `EA-1` a `EA-121`. Achados
  `aberto`: **51** — a contagem da seção "achados abertos (N)" do
  `compliance-audit.sh --rule=backlog`, que conta **blocos** com linha de status
  `aberto` (não um grep do texto). Medida por mim: **50** com o `BACKLOG.md` de
  `66b0c5a` e **51** com o `EA-121` aplicado (`1 PASS · 0 FAIL · 0 WARN` nas duas;
  o 51 vale depois do commit do backlog deste passe, que é o último dos quatro).
  Na v3.2.11 eram 29 (59 no adendo de 2026-10-25). O relatório final da 025 mediu **58**
  na base dela (o `EA-101` já estava `resolvido` pelo #113, conferido no `BACKLOG.md`)
  e **50** depois: 58 − 12 (`EA-91`, `EA-92`, `EA-105`…`EA-114`) + 4
  (`EA-117`…`EA-120`); o `EA-121` deste passe leva a 51.
- **Evidência (R11)**: a demanda 008 (PR #21) tirou os 3 ZIPs da raiz do índice
  para o release `evidence-v32`; nenhuma evidência binária nova entra nesta selagem.

## Estado de verificação no momento da selagem

- **Candidata verificada: `9ca1fde`** (conteúdo da release), árvore limpa, medida
  pelo orquestrador em 2026-10-31T01:40–01:49Z (`pipeline_9ca1fde.txt`, lido por
  mim):
  - `check_baseline.py`: **529/529** pins conferem · 0 divergentes · 0 ausentes · 0
    sem pin;
  - `bash .claude/verify/run.sh` (completo, 18 stages — `env-doctor`, `baseline`,
    `eol-text`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`,
    `regra-morta`, `state`, `tdd`, `fecho`, `mutation`, `mutation-coverage`, `m41`,
    `suites`, `suites-heavy`, `evidence-bridge`): **18 PASS · 0 FAIL**;
  - `bash .claude/verify/compliance-audit.sh`: **17 PASS · 0 FAIL · 0 WARN**;
  - `git status --porcelain` vazio ao final.
  O log não registra qual interpretador o `run.sh` usou; o relatório final da 025
  registrou, sobre `91a57e7`, um `run.sh` 17 PASS · 1 FAIL no stage `mutation` por
  ambiente (alias `python3` da Store cego ao cache do Playwright — `EA-118`), com
  diagnóstico do `qa-engineer`. Sobre `9ca1fde` o mesmo stage deu PASS; **não
  verifiquei a causa da diferença** e não a atribuo.
- **CI da `develop` em `9ca1fde`**: run `41155936738` (push na `develop`), lido por
  mim com `gh run view 41155936738 --repo oflavioc/quickscan-secops` no momento da
  escrita (2026-10-31, ~01:52Z): **concluído, `success`** — job `verify` success
  (completado 01:43:43Z), `visual` success (01:46:35Z), `fecho` success
  (01:33:51Z). Antes do merge, o run `41149493946` em `569640d` (head do #114)
  também terminou com os três jobs `SUCCESS` (`gh pr view 114 --json
  statusCheckRollup`, lido por mim).
- **Registro de deploy do `build-engineer`** (fora do repositório, `EA-53`; citado,
  medido por ele em 2026-10-30): D2 `COMPARAÇÃO: PASS`; `check_m41.py` OK; smoke das
  correções **contra o artefato da release** (via `D025_HTML_OVERRIDE` e
  `M48_HTML_OVERRIDE`): `tests_025_curadoria_sessao.js` **16/16** e
  `tests_session_m48.js` **97/97**; serviço em `127.0.0.1:1337` servindo `4c45ce20…`
  (v3.2.11, container `quickscan-v3211`); **cutover pendente** do proprietário, com
  rollback registrado (`deploy/v3.2.11/compose.yaml`). Não reexecutei o smoke.
- **Fase de produto: 5.2 SELADA**. Esta selagem não abre nem fecha fase de produto;
  `fase_corrente` e `proxima_fase` do `current_phase.json` ficam como estão, e o
  arquivo ganhou `release_corrente` (`tag` v3.2.12, `commit` = "merge do PR de
  selagem — ver tag v3.2.12", `conteudo` = `9ca1fde`) e o bloco `superada` para a
  v3.2.11 (`66b0c5a`).
- **Não executado**:
  - o `run.sh` completo, o `compliance-audit.sh` completo e o CI sobre o **commit
    final do PR de selagem** (do orquestrador, depois do repin; o que foi medido é
    sobre `9ca1fde`, e os quatro commits de documento deste passe são doc-only);
  - suítes visuais Chromium localmente (KI-3; a execução canônica é o job `visual`
    do CI, que ficou verde em `9ca1fde` acima);
  - o **cutover** em `127.0.0.1:1337` (ato do proprietário; hoje serve a v3.2.11);
  - a **sessão real** que o registro de deploy nomeia como juiz da v3.2.12
    (importar sem chave de curadoria, cancelar, Nova sessão, Reiniciar);
  - a conferência de **cada autorização da §29.4 contra o chat** (apenas a trilha
    nos pinos foi lida);
  - a reexecução, por mim, dos gates `D025-*`, da m48 e da campanha `d025`: os
    números 16/16, 97/97 e 23/23 são do relatório final da 025 e do registro de
    deploy;
  - a causa da diferença do stage `mutation` entre `91a57e7` e `9ca1fde` (acima).

## Pendências que ATRAVESSAM a selagem (declaradas; nenhuma em ação)

Todas conferidas no estado de `66b0c5a`: status pelo bloco do `.claude/BACKLOG.md`,
linhas pelo fonte. **O que saiu desde a v3.2.11**: o `EA-65` (item 2 do registro
anterior) está `resolvido`; dos ids do adendo de 2026-10-25, `EA-91`, `EA-92` e
`EA-105`…`EA-114` estão `resolvido` (pela 025) e `EA-101` também (pelo #113);
`EA-93`…`EA-100a`, `EA-102`…`EA-104`, `EA-115` e `EA-116` seguem `aberto`.

1. **`EA-76` segue `aberto`** (fail-open nomeado, decisão do proprietário de
   2026-10-19: **declarar e selar**). `ofertaDoMotor()` (`ui_p52_support_v32.js:247`)
   e `decisaoDe()` (`:136-141`, devolve `"include"` quando não resolve o nome em
   `PRODUCTS`, `:137`/`:139`/`:140`) estão como no registro anterior — o arquivo
   não mudou em `0bd677c..9ca1fde`. Do lado da curadoria (`ui_curation_v32.js`,
   que a 025 mudou em +84/−11) **não reconferi as linhas citadas na v3.2.11**; as
   medidas "11 contra 14 cards" etc. são do refutador de 2026-10-19, não
   reexecutadas. Dono do conserto: demanda futura (dois módulos, R9 §5).
2. **`EA-88` segue `aberto`**: o campo que registra o aceite não é declarado em
   schema; a quantificação do registro anterior (12 de 19 fechos fora do critério)
   **não foi refeita**. A 025 registra o aceite em `validate.aceite_po` (forma
   "NAO ENCONTREI OBJECAO"; o campo também existe nas 010, 011, 015, 016, 017 e 024 —
   achado por leitura do campo, não por conferência contra o critério do `EA-88`). Remédio proposto, não
   decidido, no próprio `EA-88`; donos: gate `qa-engineer`, campo `product-owner`,
   schema `data-engineer`.
3. **`EA-81`**: cópia morta de ícones em modo legado sob arbitragem; dívida de
   instrumento declarada, sem efeito no relatório impresso. Sem dono em ação.
4. **`EA-84`, `EA-83`, `EA-85`, `EA-87`** (todos `aberto`; dono `build-engineer`,
   as duas últimas dependem de decisão de desenho do proprietário): `project_root()`
   pelo cwd (`.claude/hooks/lib/common.sh`), despacho do matcher `Bash` não medido,
   `guard-data` que falha aberto sem python, configuração de hook que vale ser a da
   pasta primária. O relatório final da 025 registra uma ocorrência da família —
   o `guard-tdd` negou três vezes a edição de `ui_curation_v32.js` com a sessão
   ancorada em `phase5-sel`, e a demanda mudou a pasta primária para `phase5-009`
   (relato do briefing da T093, **sem registro em arquivo**; o relatório não a
   contornou).
5. **Comentários obsoletos em `ui_p52_workspace_v32.js`** — descrevem o ponteiro de
   apoio nos cards de prioridade, que saiu (PR #103) — e `p52CapOf` sem chamador:
   reconferido, só a definição (`:1032`) e uma menção em comentário (`:998`) existem;
   o arquivo não mudou em `0bd677c..9ca1fde`. Não visíveis ao cliente; sem `EA`
   próprio. Dono: `ui-engineer`.
6. **Porta A do rito D2**: pendente de ratificação do proprietário (Q3);
   `product-invariants.md` não mudou desde `f7a787c` (`git log --oneline` sobre o
   arquivo, medido por mim) e `pins.json → declared` é
   igual em `e03b0f0` e `9ca1fde`. Todo toque no engine continua sendo Porta B.
7. **`EA-90`**: uma exclusão R13 inerte é invisível ao `check_fecho`; `aberto`, com
   duas defasagens de registro pinado que esta selagem não toca.
8. **`EA-64` e `EA-104`** (a versão corrente nos docs): o `README.md` foi corrigido
   à mão neste passe para a v3.2.12 — da mesma classe do `EA-64`, que **segue
   `aberto`**: o gate `V322-DOC3` confere a coerência interna do README, não o
   fato, e o registro escrito por `preparar_release.py` não existe. O `EA-104`
   (instrução de obtenção do README) também segue `aberto`; o status só vira
   `resolvido` por quem o escrever com a referência do PR (R2 §1). Dono do remédio
   de raiz: `build-engineer`/`tech-lead`.
9. **`EA-115`** (`D019-SUF1` mede só metade de C10; baixa) e **`EA-116`** (as regras
   `Write(...)` do `permissions.deny` são inertes segundo o host; baixa): `aberto`.
   A 025 tocou só a redação de C10.
10. **`EA-117`…`EA-120`** (todos `aberto`, instrumento, dono `build-engineer`,
    nascidos na Fase 6 da 025): `harnesses.p52.requires` ignora `poppler-utils` (12
    falsos sobreviventes locais); `run.sh` usa `python3`, alias da Store nesta
    máquina (o veredito do `mutation` depende do interpretador); `run.sh` apaga o
    log do stage reprovado no `EXIT`; `harnesses.d011` não lista
    `check_lint_arch.py`.
11. **`EA-121` (novo, nesta selagem)**: `preparar_release.py:64-66` escolhe o
    "release anterior" por `sorted()` de strings `vN.N.N` — lexicográfico: `v3.2.9`
    > `v3.2.12` > `v3.2.11` > `v3.2.10`. Efeito: os cabeçalhos de
    `deploy/v3.2.11/compose.yaml` e `deploy/v3.2.12/compose.yaml` dizem "postura de
    seguranca herdada de v3.2.9" (o da v3.2.10 diz o mesmo, ali correto), e o
    cutover impresso pelo script para a v3.2.12 seria `docker stop quickscan-v329`,
    container que não existe (lido, não executado). Não afetou o artefato:
    `default.conf` (`7c9ecad4…dbbe`) e o digest da imagem
    (`nginxinc/nginx-unprivileged@sha256:44e36330…dd49`) são idênticos de v3.2.9 a
    v3.2.12. Dono: `build-engineer`.
12. **Cutover pendente do proprietário.** A v3.2.12 está **preparada e conferida**
    (`deploy/v3.2.12/`), não publicada; o serviço segue na v3.2.11. O registro de
    deploy dá o cutover correto — `docker stop quickscan-v3211`, depois `docker
    compose -f deploy/v3.2.12/compose.yaml up -d`, **não** o `quickscan-v329`
    impresso pelo script — e a conferência byte a byte
    (`curl -s http://127.0.0.1:1337/ | sha256sum` deve dar `024abf11…3885`).
    Rollback: `deploy/v3.2.11/`.
13. **Decisão de GitHub Release.** A v3.2.12 não terá Release do GitHub nesta
    selagem; a última Release continua sendo a v3.2.9 (rollback). Criar uma é
    decisão do proprietário, ainda não tomada.
14. **Memórias de agentes parqueadas fora do PR.** Os agentes que escreveram nesta
    demanda e nesta selagem registraram aprendizados em memória de agente; por
    instrução do orquestrador, nenhuma entra neste PR (o orquestrador as
    parqueia). Sem conteúdo versionado aqui.
15. **A ratificação do nome `v3.2.12`.** Proposta do orquestrador, pendente do
    proprietário na mescla do PR de selagem. Se o proprietário preferir outro nome,
    a tag, o `README.md`, o `current_phase.json` e este registro mudam juntos; o
    SHA-256 do artefato e o conteúdo `9ca1fde` não.
16. **Demais achados `aberto`**: os 51 da contagem do `compliance-audit.sh`
    (acima) incluem os itens 1 a 11 e os achados de instrumento mais antigos
    (`EA-8` em diante, listados pelo próprio `compliance-audit.sh`); nenhum deles é
    tocado por esta selagem além das notas de 2026-10-31 já nomeadas (`EA-64`,
    `EA-121`).

## Adendo de 2026-10-31 — ratificação do nome, tag, Release e cutover

Este adendo **só acrescenta**; o corpo acima descreve o estado no momento da abertura
do PR de selagem e não foi reescrito (R2 §5). O que ali está como proposta ou pendência
fechou assim:

- **Nome ratificado.** O proprietário mesclou o PR #115 em 2026-10-31T02:19:29Z
  (merge `f2ff25d8d50614ab44f4bdc529d8adbd8963cf57`) e autorizou no chat, de forma
  literal, o release: *"Pode — ff + tag + push"* e, para a Release do GitHub, *"Sim,
  com o artefato HTML como asset"*. A pendência 15 está fechada; o nome é `v3.2.12`.
- **`main` por fast-forward**: `e03b0f0 → f2ff25d` (`git push origin f2ff25d:refs/heads/main`;
  `git merge-base --is-ancestor` verdadeiro; 1.081 commits, sem squash). Medido pelo
  orquestrador após o push: `git ls-remote origin refs/heads/main` = `f2ff25d…`.
- **Tag anotada `v3.2.12`**: objeto `2428777cefb4f3c197bf57b80981cc655cffedf6`, aponta
  para `f2ff25d` (`git ls-remote origin 'refs/tags/v3.2.12^{}'`); tagger Flavio Costa,
  2026-10-30 23:52:55 −03:00; mensagem com conteúdo `9ca1fde`, SHA-256 do HTML, engine,
  payload M41, numstat canônico e verificação. `git describe --tags --exact-match
  origin/main` devolve `v3.2.12`. É o hash que a seção "Dois hashes" dizia que não
  seria escrito antes de existir.
- **Release do GitHub** (decisão tomada, pendência 13 fechada):
  https://github.com/oflavioc/quickscan-secops/releases/tag/v3.2.12, criada com
  `--verify-tag`, assets `quickscan_secops_soccmm_v3_2_12.html` (1.248.772 bytes) e
  `quickscan_secops_soccmm_v3_2_12.html.sha256`. Digest reportado pela API do GitHub
  para o asset: `sha256:024abf113f30098617cf9f0617d51295903634839fb6e1b07b625f13baa03885`;
  re-download pelo `gh release download` e `sha256sum` deram o mesmo valor. A última
  Release deixa de ser a v3.2.9 — ela permanece como caminho de rollback.
- **Cutover feito pelo proprietário** (pendência 12 fechada), do WSL:
  `docker stop quickscan-v3211` e, de `/mnt/c/Projetos/QuickScan-SOC-CMM`,
  `docker compose -f deploy/v3.2.12/compose.yaml up -d`; `curl -s http://127.0.0.1:1337/ |
  sha256sum` devolveu `024abf11…3885`, relatado por ele no chat e conferido pelo
  orquestrador (`docker ps`: `quickscan-v3212` healthy em `127.0.0.1:1337`;
  `quickscan-v3211` `Exited (0)`, rollback por `docker start`). A primeira tentativa
  falhou por caminho (`/mnt/d/ai-workspace` não tem `deploy/`), com o container antigo
  já parado — o serviço ficou fora do ar por cerca de dois minutos. O registro de deploy
  em `deploy/v3.2.12/` (fora do git) ainda diz "cutover pendente"; não foi reescrito.
- **CI do merge de selagem**: run `41159473808` em `f2ff25d` — `verify`, `visual` e
  `fecho` success.
- **Memórias de agentes** (pendência 14): restauradas no PR que traz este adendo, em
  commit próprio, a partir do commit WIP `0ade099` e do acervo parqueado no scratchpad.

Nenhum número do corpo muda com isto: conteúdo `9ca1fde`, SHA `024abf11…3885`,
numstat 20 · +10.973/−438, 529 pins.
