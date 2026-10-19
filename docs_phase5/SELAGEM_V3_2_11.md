# Registro de selagem — v3.2.11 (2026-10-19)

> Rito R14: release `develop → main` sob pedido explícito do proprietário no
> chat (2026-10-19: *"Vamos de (a), release com a tag"*; nome da tag:
> *"v3.2.11"*). Rota (a): release com tag, **sem abrir fase de produto** — a
> alternativa descartada foi abrir uma 5.3 retroativa. Commit de selagem
> doc-only, separado; merge fast-forward (sem squash); tag anotada `v3.2.11`
> sobre o HEAD da `main`, com os hashes abaixo.
>
> Este registro não declara fase concluída nem selada (CLAUDE.md §Limites de
> autonomia): `fase_corrente` segue 5.2 `SELADA`. Itens marcados **[#110]**
> dependem do merge do PR #110 (`feature/024-sete-defeitos-do-relatorio`), que
> estava `OPEN` na escrita (`gh pr view 110`, 2026-10-19); o fecho os confere.

## Desvio declarado: o produto mudou sob a fase 5.2 SELADA, sem o gate de abertura de fase

A selagem anterior (`SELAGEM_V3_2_2_ESTRUTURA_1.md`) registrou "Produto
INALTERADO". Esta não pode registrar isso.

- A 5.2 foi selada no merge `07bc90b` (PR #8, 2026-08-24; a tag `v3.2.1` aponta
  para ele), que trouxe o commit de conteúdo `c1e3649`.
- Desde então o produto passou de v3.2.1 a v3.2.11 com `current_phase.json` em
  `fase_corrente` 5.2 `SELADA` e `proxima_fase` `NAO_ABERTA`, sem
  `specs/PHASE_X*.md` com hash registrado. O gate de abertura de fase da R4
  (`sdd.md`, "Gates de fase") não foi cumprido.
- O proprietário decidiu declarar o desvio e selar (rota (a)), em vez de abrir
  uma 5.3 retroativa (2026-10-19). O que segue é a medida do desvio.

Medido em 2026-10-19 na janela `c1e3649..22aa692` (`22aa692` = HEAD da
`develop`, merge do PR #109). `P` = o pathspec
`'ui_*.js' 'ui_*.css' engine_v32.js build_v32_html.py generate_icons_v32.py quickscan_secops_soccmm_v3_2_dev.html`.

| Medida | Valor | Comando |
|---|---|---|
| Arquivos de produto alterados | **20 · +10.752/−424** | `git diff --shortstat c1e3649 22aa692 -- P` |
| · já na `main` (`c1e3649..e03b0f0`) | 5 · +2.151/−266 | idem, com `c1e3649 e03b0f0` |
| · levados por esta selagem (`e03b0f0..22aa692`) | 19 · +8.629/−186 | idem, com `e03b0f0 22aa692` |
| HTML dev | +5.373/−210 | `git diff --numstat c1e3649 22aa692 -- quickscan_secops_soccmm_v3_2_dev.html` |
| `engine_v32.js` | **0 linhas** | `git diff --numstat c1e3649 22aa692 -- engine_v32.js` (saída vazia) |
| Demais paths `frozen` (`boundary.json`) | 0 linhas | idem, para `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json` |
| Módulos novos | 5 `ui_*.js` + 3 `ui_*.css` | `git diff --name-status c1e3649 22aa692 -- 'ui_*'` (status `A`) |
| Entrada na `develop` | 86 merges de PR (#21…#109); 0 commits diretos | `git log --first-parent --format=%s e03b0f0..22aa692`; `git log --first-parent --no-merges e03b0f0..22aa692` (vazio) |

Os dois trechos somam 10.780 adições, não 10.752: linhas escritas no primeiro
trecho foram reescritas no segundo. Os 5 módulos novos são
`ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_d011_prioridade_v32.js`,
`ui_ondas_v32.js` e `ui_p52_support_v32.js`; os 3 CSS novos são
`ui_d011_prioridade_v32.css`, `ui_ondas_v32.css` e `ui_p52_support_v32.css`.

**Como entrou.** Dos 86 PRs, 23 alteram arquivo de produto (diff de cada merge
contra o primeiro pai, sobre `P`; os outros 63 não alteram):

- 8 demandas da máquina SDD, cada uma com `specs/NNN-*/` e planning-state
  `done`: #24 (009), #31 (010), #32 (011), #34 (015), #88 (019), #101 (021),
  #104 (022), #106 (023) — soma por PR **+5.639/−104**.
- 15 PRs `fix/*` sem planning-state: #62, #64, #67, #70, #71, #81, #83, #84,
  #86, #91, #94, #95, #97, #103, #105 — soma por PR **+3.213/−305**. A R4
  dispensa spec para correção de achado registrado (skill `fix-finding`); este
  registro não reavalia se cada um se enquadrava como tal.

A soma por PR conta duas vezes a linha que um PR seguinte reescreve, e por isso
não fecha com a diferença líquida da tabela. Dos 16 planning-states que entram
na `main` (008 e 009…023), 8 não alteraram arquivo de produto: 008 (evidência),
012 (backlog), 013, 014, 016, 017 e 018 (processo e instrumento de verificação)
e 020 (refutada no portão da Fase 0).

**Fronteira (R6).**

- `frozen`: nenhuma mudança (tabela). `generated`: `ui_icons_v32.js` com 0
  linhas; o HTML dev muda só pelo builder, e o stage `build` prova a identidade
  (PASS no CI, abaixo). `legacy`: `MANIFEST.sha256` e
  `specs/PHASE_5_0_REV_A.md` sem mudança em `e03b0f0..22aa692`.
- Lista da §29.4 (`PROTECTED`, `tests_p50_core.js:82`): cinco arquivos mudaram
  desde a `main` — `ui_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`,
  `ui_session_v32.js`, `ui_ux_v32.css`. Cada repin do `P50-GOV1` deixou
  comentário-trilha com a autorização nominal do proprietário, por demanda ou
  fix-finding e por arquivo (`tests_p50_core.js:132-592`). A auditoria
  adversarial de 2026-10-19 não achou arquivo protegido tocado sem rito
  (refutação por três caminhos). Este registro conferiu que os cinco têm trilha
  e que o stage `suites` (que inclui `p50core`, 65/0 em `expected_suites.json`)
  fecha verde; não reconferiu cada autorização contra o chat.
- `current_phase.json` não foi alterado entre `e7d9933` (2026-08-25) e
  2026-10-19: 55 dias sem registrar nada disto. A correção está em commit desta
  branch (`4e73298` na escrita); o repin do registry é commit próprio do
  orquestrador.

## O que esta selagem consolida (`main` estava 979 commits atrás, em `e03b0f0`)

`git rev-list --count e03b0f0..22aa692` = 979 (111 merges, 868 não-merge);
`git merge-base --is-ancestor e03b0f0 22aa692` = verdadeiro, logo
fast-forward. `e03b0f0` é a tag `v3.2.2-estrutura.1`, da selagem anterior.

- **Produto v3.2.2 → v3.2.11**: ver o desvio acima. SHA-256 do HTML dev
  (`quickscan_secops_soccmm_v3_2_dev.html`, 1.242.046 bytes):
  `4c45ce20fece3bf024dd4a85b99a9766185f48039805ead45d0fe71700bf5712`.
  `git show <commit>:quickscan_secops_soccmm_v3_2_dev.html | sha256sum` dá esse
  valor em `232448f` e em `22aa692`; `sha256sum` de
  `deploy/v3.2.11/quickscan_secops_soccmm_v3_2_11.html` também.
- **O produto em `22aa692` é byte-idêntico a `232448f`** (merge do PR #106,
  2026-10-02), commit do qual o artefato de `deploy/v3.2.11/` foi construído
  segundo o cabeçalho de `deploy/v3.2.11/compose.yaml`: `git diff 232448f 22aa692`
  fora de `docs*`, `specs` e `.claude` lista só `CONTEXT.md` e `USER_GUIDE.md`.
  **Ressalva: a proveniência não é verificável por git.** A afirmação "publicado
  a partir de `232448f`" consta em `deploy/v3.2.11/compose.yaml` e em
  `V3_2_11_PRODUCTION_DEPLOYMENT_RECORD.md`, ambos fora do repositório
  (`deploy/` mora fora da worktree, `EA-53`), e nenhuma tag aponta para
  `232448f` (`git tag --points-at 232448f` vazio). O que o git permite conferir
  é a igualdade de bytes acima.
- **Engine e régua D2**: `engine_v32.js` SHA-256
  `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (0 linhas
  alteradas na janela); payload M41 `pins.json → declared.m41_payload_sha256` =
  `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b`, igual em
  `e03b0f0` e em `22aa692`; stage `m41` PASS.
- **Tags**: o remoto (`git ls-remote --tags origin`) tem `v3.2.6` → `31ea762`
  (PR #86), `v3.2.7` → `cc6ffad` (#88), `v3.2.8` → `789d87c` (#95) e `v3.2.9` →
  `e95cfe4` (#101), anotadas em merges da `develop` e fora da `main` até esta
  selagem. Sem tag no remoto: v3.2.3, v3.2.4, v3.2.5 e v3.2.10 (artefatos em
  `deploy/`, fora do git). **A tag anotada `v3.2.11` nasce nesta selagem**, sobre
  o HEAD da `main` (SHA final da `develop`: `«A PREENCHER NO FECHO»`). Ela dá ao
  repositório o registro de qual commit é a v3.2.11 que o `EA-64`
  (`.claude/BACKLOG.md`, `aberto` neste HEAD) aponta como ausente; o remédio de
  raiz que o `EA-64` descreve (registro escrito por `preparar_release.py`) não é
  feito aqui, e a mudança de status do `EA-64` não é feita por este documento.
- **Demandas**: 16 planning-states `done` entram na `main` (008, 009…023; 003 e
  007 já estavam); 8 mudaram produto (009, 010, 011, 015, 019, 021, 022, 023).
  **[#110]** A 024 fecha por refutação no portão da Fase 0, sem linha de produto
  (`.claude/project-memory/planning-state/024-sete-defeitos-do-relatorio.json`).
- **Instrumento**: o pipeline passa de 14 para 18 stages (novos: `eol-text`,
  `regra-morta`, `fecho`, `mutation-coverage`); a `develop` declara
  `checks_obrigatorios` = `verify`, `visual`, `fecho` em
  `.claude/verify/branch_protection.json` (ADR
  `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md`).
- **Backlog**: `.claude/BACKLOG.md` não existe na `main`
  (`git cat-file -e e03b0f0:.claude/BACKLOG.md` falha); entra com os ids `EA-1` a
  `EA-89`. Achados `aberto` no SHA final da `develop`: `«A PREENCHER NO FECHO»`.
- **Evidência (R11)**: a demanda 008 (PR #21) tirou os 3 ZIPs da raiz do índice
  para o release `evidence-v32`.

## Estado de verificação no momento da selagem

- CI, run `39238485730` (push em `22aa692`, lido por `gh run view`): job
  `verify` success — `run.sh` 18 PASS · 0 FAIL e `compliance-audit.sh` 17 PASS ·
  0 FAIL · 0 WARN; job `visual` success — P50+P51 27/27, P52 56/56, D011 1/1;
  job `fecho` success.
- Local, clone limpo de `22aa692` (Windows, 2026-10-19): `run.sh` 18 PASS · 0
  FAIL; `compliance-audit.sh` 17 PASS · 0 FAIL · 0 WARN; `check_baseline.py`
  518/518 pins conferem, 0 divergentes, 0 ausentes, 0 sem pin. As primeiras
  execuções deram outro resultado, por ambiente do clone e não por produto:
  `run.sh` 17 PASS · 1 FAIL no stage `mutation`, porque o `origin/develop` do
  clone apontava para `1c6a363` e a base do trigger tratou `USER_GUIDE.md`,
  alvo do harness `p51`, como alterado (com essa base o `p51` passa a ser
  executado, medido); e
  `compliance-audit.sh` 16 PASS · 0 FAIL · 1 WARN (`branch-protection` não
  determinável), porque o `origin` do clone era um caminho local. Com
  `origin/develop` em `22aa692` e o remote do GitHub, os dois fecham como
  acima.
- **Fase de produto: 5.2 SELADA**. Esta selagem não abre nem fecha fase de
  produto; `fase_corrente` e `proxima_fase` do `current_phase.json` ficam como
  estão, e o arquivo ganha `release_corrente` e a nota do desvio.
- O SHA final da `develop` é `«A PREENCHER NO FECHO»`. A verificação acima é
  sobre `22aa692`; a diferença para o SHA final é o PR #110 **[#110]** e os
  commits desta branch. Na escrita, o diff do #110 contra a `develop`
  (`git diff --name-only origin/develop...origin/feature/024-sete-defeitos-do-relatorio`)
  não lista `ui_*`, `engine_v32.js`, `build_v32_html.py`, `generate_icons_v32.py`
  nem o HTML dev, e o commit desta branch (`4e73298`) altera só
  `current_phase.json`.
- **Não executado**: suítes visuais Chromium localmente (KI-3; a execução
  canônica é o job `visual` do CI, acima); o que o serviço em
  `127.0.0.1:1337` está servindo (a leitura de 2026-10-19 não obteve resposta,
  HTTP 000); a conferência de cada autorização da §29.4 contra o chat.
- Defeito visível ao cliente na seção de apoio, medido em 2026-10-19 por jsdom e
  por Chromium real (medição do orquestrador; os probes não estão versionados e
  este registro não os reexecutou): **no relatório impresso, zero; na tela, um**
  — o `EA-80`, título sem conteúdo embaixo **só sob supressão total pela
  curadoria do operador**, com o aviso de supressão declarado. Classificado como
  a leitura correta daquele estado (D4 da 024, `transferido` para
  `design-decisions.md`) **[#110]**.

## Pendências que ATRAVESSAM a selagem (declaradas; nenhuma em ação)

1. **`EA-76` materializado** (medido pelo refutador da auditoria de 2026-10-19;
   o registro no backlog entra em PR posterior — `BACKLOG.md:6934` hoje descreve
   só a duplicação da derivação). `ofertaDoMotor()`
   (`ui_p52_support_v32.js:247`) tem uma segunda fonte, o bloco da errata E2 da
   022 (`:272-344`), que não é a de `offered()` da curadoria
   (`ui_curation_v32.js:75`, bloco E2 em `:89-129`). `decisaoDe()` (`:136-141`)
   resolve o nome só em `PRODUCTS` (`idDoNome`, `:114-121`) e devolve `"include"`
   quando não casa: um card entra na seção de apoio sem passar pela curadoria,
   em sessão alcançável. Decisão do proprietário: declarar e selar. Dono do
   conserto: demanda futura (dois módulos, R9 §5).
2. **`EA-65`**: segundo a auditoria de 2026-10-19, o fecho registrado no backlog
   afirma, sobre o modo legado, o contrário do que o código faz — registro com
   erro, mecanismo correto. O fecho diz que a fronteira não entra em modo legado
   (`BACKLOG.md:6003-6007`); o código decide a fronteira por
   `arbitragemEmCurso()` (`ui_p52_support_v32.js:198-205`), que lê a ocultação
   dos filhos e não o modo legado. A contradição específica é medida da
   auditoria, não reexecutada aqui. Dono: `doc-writer` (correção do registro);
   sem mudança de código.
3. **`EA-88`, quantificado**: 13 de 19 fechos fora do critério (contagem da
   auditoria de 2026-10-19; o 19º é a 024 **[#110]**). Nomeados e conferidos nos
   planning-states de `22aa692`: 8 sem campo de aceite (003, 007, 008, 009, 012,
   013, 014, 018); 3 com a forma que a D3 (`sdd.md:36-38`) condena (020, 022, 023);
   e a 011, em que `validacao.decisao_tasks_160` começa por "ACEITO COM
   DEFERIMENTO REGISTRADO", palavra escrita por agente dentro do bloco do PO —
   12 no total. O 13º não está nomeado nas fontes lidas por este registro. O
   remédio proposto, não decidido, está no `EA-88` (`BACKLOG.md:7778`); donos
   ali: gate `qa-engineer`, campo `product-owner`, schema `data-engineer`.
4. **`EA-81`**: cópia morta de ícones em modo legado sob arbitragem; dívida de
   instrumento declarada, sem efeito no relatório impresso (o papel lê só os
   cards). Sem dono em ação.
5. **`EA-84`, ampliado**: não é só o `guard-data`. `project_root()`
   (`.claude/hooks/lib/common.sh:15`, `git rev-parse --show-toplevel` pelo cwd do
   processo) é usado por `guard-boundary.sh`, `guard-data.sh`, `guard-tdd.sh`,
   `post-turn-verify.sh` e `state-eval.sh`; segundo a auditoria, o `guard-tdd`
   leu a worktree errada. O registro do `EA-84` (`BACKLOG.md:7455`) ainda
   descreve só o `guard-data`. Dono: `build-engineer`.
6. **`EA-83`**: o despacho do matcher `Bash` segue **não medido**; o protocolo
   está em `.claude/hooks/README-dispatch.md`, e `dispatch.log` não existe na
   pasta primária. Dono: `build-engineer`.
7. **`EA-85`** (o `guard-data` falha aberto sem python) e **`EA-87`** (a
   configuração de hook que vale é a da pasta primária): decisões de desenho do
   proprietário, em aberto. Dono do conserto, depois da decisão:
   `build-engineer`.
8. **Comentários obsoletos em `ui_p52_workspace_v32.js`** — `:1014-1031`,
   `:1044-1054` e `:1072-1075` descrevem o ponteiro de apoio nos cards de
   prioridade, que saiu (PR #103) — e `p52CapOf` (`:1032`) sem chamador (só
   ocorrem a definição e uma menção em comentário, `:998`). Não visíveis ao
   cliente; fora da 024, cujo corte é zero linha de produto. Dono:
   `ui-engineer`.
9. **Porta A do rito D2**: pendente de ratificação do proprietário (Q3) desde a
   abertura; `product-invariants.md` não mudou desde `f7a787c` (2026-08-25) e
   `pins.json → declared` é igual em `e03b0f0` e `22aa692`. Todo toque no
   engine continua sendo Porta B.
10. **Demais achados de instrumento abertos**: contagem
    `«A PREENCHER NO FECHO»`.
11. **Versão corrente nos docs** (medida por este registro): `README.md:19` e
    `:23` declaram `v3.2.9` como "produção publicada" e versão corrente; a
    produção declarada pelo proprietário é a v3.2.11, e o release mais recente
    no GitHub é `v3.2.9` (`gh release list`; `v3.2.10` e `v3.2.11` não têm
    release). É a classe do `EA-64`: o gate `V322-DOC3` confere a coerência
    interna do README, não o fato. Dono: `doc-writer`.
