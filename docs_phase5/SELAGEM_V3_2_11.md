# Registro de selagem — v3.2.11 (2026-10-19)

> Rito R14: release `develop → main` sob pedido explícito do proprietário no
> chat (2026-10-19: *"Vamos de (a), release com a tag"*; nome da tag:
> *"v3.2.11"*). Rota (a): release com tag, **sem abrir fase de produto** — a
> alternativa descartada foi abrir uma 5.3 retroativa. Commit de selagem
> doc-only, separado; merge fast-forward (sem squash); tag anotada `v3.2.11`
> sobre o HEAD da `main`, com os hashes abaixo. Registro fechado em 2026-10-20.
>
> Este registro não declara fase concluída nem selada (CLAUDE.md §Limites de
> autonomia): `fase_corrente` segue 5.2 `SELADA`. O PR #110
> (`feature/024-sete-defeitos-do-relatorio`) está **mesclado** — merge
> `0bd677c`, `gh pr view 110` → `MERGED`, 2026-10-20T07:20:44Z. Os itens
> marcados **[#110]** foram conferidos contra esse merge.

## Dois hashes, e não o mesmo

- **Conteúdo da v3.2.11**: `0bd677cc6b65507346ad5150b5b8899b230ddb8e` — a
  `develop` depois do merge do PR #110 e o último commit que toca produto. O PR
  de selagem (BACKLOG, README, este registro, `current_phase.json`, `pins.json`)
  é **doc-only**; logo o numstat canônico em `0bd677c` é o numstat da release.
  Onde este registro diz "SHA final", leia `0bd677c`, com esta ressalva.
- **Tag**: `v3.2.11` aponta para o merge do PR de selagem na `develop`, que
  depois vai à `main` por fast-forward. Esse hash só existe depois da mescla; fica
  na própria tag anotada e no commit de `main`, e **não é escrito aqui** para não
  ser inventado. É o padrão `merge`/`conteúdo` que a 5.2 já usa em
  `current_phase.json` (merge `07bc90b` · conteúdo `c1e3649`).
- **O link da tag** no `README.md` (`…/tree/v3.2.11`) resolve a partir do push da
  tag, no mesmo ato de release. A v3.2.11 **não terá Release do GitHub** nesta
  selagem (as releases existem até a `v3.2.9`); criar uma é decisão do
  proprietário, ainda não tomada.

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

Medido em 2026-10-20 na janela `c1e3649..0bd677c`, com **um escopo e um
intervalo**: escopo = o que o builder consome como produto próprio (`engine_v32.js`,
`build_v32_html.py`, o HTML dev, `ui_*.js`, `ui_*.css`), com o `USER_GUIDE.md` em
linha própria; intervalo = do commit de conteúdo da 5.2 até o commit de conteúdo
da v3.2.11. `E` = o pathspec
`engine_v32.js build_v32_html.py quickscan_secops_soccmm_v3_2_dev.html 'ui_*.js' 'ui_*.css'`.

| Medida | Valor | Comando |
|---|---|---|
| Arquivos de produto alterados | **19 · +10.739/−422** | `git diff --numstat c1e3649 0bd677c -- E`, somando as colunas |
| `USER_GUIDE.md` (linha própria) | **+108/−24** | `git diff --numstat c1e3649 0bd677c -- USER_GUIDE.md` |
| · já na `main` (`c1e3649..e03b0f0`) | 4 · +2.138/−264 | idem, com `c1e3649 e03b0f0` |
| · levados por esta selagem (`e03b0f0..0bd677c`) | 19 · +8.629/−186 | idem, com `e03b0f0 0bd677c` |
| HTML dev | +5.373/−210 | `git diff --numstat c1e3649 0bd677c -- quickscan_secops_soccmm_v3_2_dev.html` |
| `engine_v32.js` | **0 linhas** | `git diff --numstat c1e3649 0bd677c -- engine_v32.js` (saída vazia) |
| Demais paths `frozen` (`boundary.json`) | 0 linhas | idem, para `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json` |
| Módulos novos | 5 `ui_*.js` + 3 `ui_*.css` | `git diff --name-status --diff-filter=A c1e3649 0bd677c -- 'ui_*'` |
| Entrada na `develop` | 87 merges de PR (#21…#110); 0 commits diretos | `git log --first-parent --merges --format=%s e03b0f0..0bd677c`; `git log --first-parent --no-merges e03b0f0..0bd677c` (vazio) |

Os dois trechos somam 10.767 adições, não 10.739: linhas escritas no primeiro
trecho foram reescritas no segundo. Os 5 módulos novos são
`ui_curation_v32.js`, `ui_curation_edit_v32.js`, `ui_d011_prioridade_v32.js`,
`ui_ondas_v32.js` e `ui_p52_support_v32.js`; os 3 CSS novos são
`ui_d011_prioridade_v32.css`, `ui_ondas_v32.css` e `ui_p52_support_v32.css`.

**Como entrou.** Dos 87 PRs, 23 alteram arquivo de produto (diff de cada merge
contra o primeiro pai, sobre `E`; os outros 64, entre eles o #110, não alteram):

- 8 demandas da máquina SDD, cada uma com `specs/NNN-*/` e planning-state
  `done`: #24 (009), #31 (010), #32 (011), #34 (015), #88 (019), #101 (021),
  #104 (022), #106 (023) — soma por PR **+5.639/−104**.
- 15 PRs `fix/*` sem planning-state: #62, #64, #67, #70, #71, #81, #83, #84,
  #86, #91, #94, #95, #97, #103, #105 — soma por PR **+3.213/−305**. A R4
  dispensa spec para correção de achado registrado (skill `fix-finding`); este
  registro não reavalia se cada um se enquadrava como tal.

A soma por PR conta duas vezes a linha que um PR seguinte reescreve, e por isso
não fecha com a diferença líquida da tabela. Dos 17 planning-states que entram
na `main` (008 e 009…024), 8 mudaram produto e 9 não: 008 (evidência), 012
(backlog), 013, 014, 016, 017 e 018 (processo e instrumento de verificação), e
020 e 024 (refutadas no portão da Fase 0). **[#110 mesclado]** A 024 fecha por
refutação, sem linha de produto.

**Fronteira (R6).**

- `frozen`: nenhuma mudança (tabela). `generated`: `ui_icons_v32.js` com 0
  linhas (`git diff --numstat c1e3649 0bd677c -- ui_icons_v32.js`, vazio); o HTML
  dev muda só pelo builder, e o stage `build` prova a identidade (dentro do
  `run.sh` 18 PASS, abaixo). `legacy`: `MANIFEST.sha256` e
  `specs/PHASE_5_0_REV_A.md` sem mudança em `e03b0f0..0bd677c` (`git diff
  --numstat`, vazio).
- Lista da §29.4 (`PROTECTED`, `tests_p50_core.js:82`): cinco arquivos mudaram
  desde a `main` — `ui_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`,
  `ui_session_v32.js`, `ui_ux_v32.css` (`git diff --name-only e03b0f0 0bd677c`
  filtrado pela lista). Cada repin do `P50-GOV1` deixou comentário-trilha com a
  autorização nominal do proprietário, por demanda ou fix-finding e por arquivo
  (`tests_p50_core.js:132-592`). A auditoria adversarial de 2026-10-19 não achou
  arquivo protegido tocado sem rito (refutação por três caminhos). Este registro
  conferiu que os cinco têm trilha e que o stage `suites` (que inclui `p50core`,
  65/0 em `expected_suites.json`) fecha verde; não reconferiu cada autorização
  contra o chat.
- `current_phase.json` não foi alterado entre `e7d9933` (2026-08-25) e
  2026-10-19: 55 dias sem registrar nada disto. A correção está em commit desta
  branch (`378c371`); o repin do registry é commit próprio do orquestrador.

## O que esta selagem consolida (`main` estava 996 commits atrás, em `e03b0f0`)

`git rev-list --count e03b0f0..0bd677c` = 996 (113 merges, 883 não-merge);
`git merge-base --is-ancestor e03b0f0 0bd677c` = verdadeiro, logo
fast-forward. `e03b0f0` é a tag `v3.2.2-estrutura.1`, da selagem anterior.

- **Produto v3.2.2 → v3.2.11**: ver o desvio acima. SHA-256 do HTML dev
  (`quickscan_secops_soccmm_v3_2_dev.html`, 1.242.046 bytes):
  `4c45ce20fece3bf024dd4a85b99a9766185f48039805ead45d0fe71700bf5712`.
  `git show <commit>:quickscan_secops_soccmm_v3_2_dev.html | sha256sum` dá esse
  valor em `232448f` e em `0bd677c`; `sha256sum` de
  `deploy/v3.2.11/quickscan_secops_soccmm_v3_2_11.html` também.
- **O produto em `0bd677c` é byte-idêntico a `232448f`** (merge do PR #106,
  2026-10-02), commit do qual o artefato de `deploy/v3.2.11/` foi construído
  segundo o cabeçalho de `deploy/v3.2.11/compose.yaml`: `git diff --name-only
  232448f 0bd677c` fora de `docs*`, `specs` e `.claude` lista só `CONTEXT.md`,
  `USER_GUIDE.md` e `tests_016_mutants.js` (o conserto do `D016-M20`, commit
  `93c8561` do #110). De `22aa692` a `0bd677c` o diff sobre `E`,
  `generate_icons_v32.py` e `ui_icons_v32.js` é vazio.
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
  `e03b0f0` e em `0bd677c`; stage `m41` dentro do `run.sh` 18 PASS.
- **Tags**: o remoto (`git ls-remote --tags origin`, 2026-10-20) tem `v3.2.6` →
  `31ea762` (PR #86), `v3.2.7` → `cc6ffad` (#88), `v3.2.8` → `789d87c` (#95) e
  `v3.2.9` → `e95cfe4` (#101), anotadas em merges da `develop` e fora da `main`
  até esta selagem. Sem tag no remoto: v3.2.3, v3.2.4, v3.2.5 e v3.2.10
  (artefatos em `deploy/`, fora do git). **A tag anotada `v3.2.11` nasce nesta
  selagem**, sobre o HEAD da `main` (conteúdo `0bd677c`; ver "Dois hashes"). Ela
  dá ao repositório o registro de qual commit é a v3.2.11 que o `EA-64`
  (`.claude/BACKLOG.md`, `aberto`) aponta como ausente; o remédio de raiz que o
  `EA-64` descreve (registro escrito por `preparar_release.py`) não é feito aqui,
  e o `EA-64` ganhou nota de 2026-10-20 dizendo isso — o status não muda.
- **Demandas**: 17 planning-states `done` entram na `main` (008, 009…024; 003 e
  007 já estavam); 8 mudaram produto (009, 010, 011, 015, 019, 021, 022, 023).
  **[#110 mesclado]** A 024 fecha por refutação no portão da Fase 0, sem linha de
  produto
  (`.claude/project-memory/planning-state/024-sete-defeitos-do-relatorio.json`).
- **Instrumento**: o pipeline passa de 14 para 18 stages (novos: `eol-text`,
  `regra-morta`, `fecho`, `mutation-coverage`); a `develop` declara
  `checks_obrigatorios` = `verify`, `visual`, `fecho` em
  `.claude/verify/branch_protection.json` (ADR
  `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md`).
- **Backlog**: `.claude/BACKLOG.md` não existe na `main`
  (`git cat-file -e e03b0f0:.claude/BACKLOG.md` falha); entra com os ids `EA-1` a
  `EA-90` (a `EA-90` nasce no passe final desta selagem). Achados `aberto`: **29**
  — a contagem da seção "achados abertos (N)" do `compliance-audit.sh`, que conta
  **blocos** com linha de status `aberto` (não um grep do texto), medida depois do
  commit do backlog deste passe; eram 28 em `0008576`, antes da `EA-90`.
- **Evidência (R11)**: a demanda 008 (PR #21) tirou os 3 ZIPs da raiz do índice
  para o release `evidence-v32`.

## Estado de verificação no momento da selagem

- **Candidata verificada: `0008576`** — HEAD da branch de selagem antes do passe
  final, rebaseada sobre a `develop` com o #110; árvore limpa; medido pelo
  orquestrador em 2026-10-20:
  - `bash .claude/verify/run.sh` (completo): **18 PASS · 0 FAIL**;
  - `bash .claude/verify/compliance-audit.sh`: **17 PASS · 0 FAIL · 0 WARN**, com
    "achados abertos (28)";
  - `check_baseline.py`: **520/520** pins conferem · 0 divergentes · 0 ausentes ·
    0 sem pin;
  - `git status --porcelain` vazio depois de cada medição.
- **O que muda de `0008576` para a release**: os quatro commits do passe final
  (`.claude/BACKLOG.md`, `README.md`, este registro e `current_phase.json`) são
  **doc-only** e ganham repin e pipeline próprios antes do PR (do orquestrador).
  Medido por mim depois do commit do backlog: `compliance-audit.sh` 17 PASS · 0
  FAIL · 0 WARN com "achados abertos (29)"; depois do commit do README,
  `node tests_p52_layout.js` → 45 PASS · 0 FAIL de 45, com o `V322-DOC3` PASS (o
  gate mede a coerência interna do README, não o fato — `EA-64`).
- **Verificação anterior, sobre `22aa692`** (histórico; não é a da candidata):
  CI, run `39238485730` (push em `22aa692`, lido por `gh run view`): job `verify`
  success — `run.sh` 18 PASS · 0 FAIL e `compliance-audit.sh` 17 PASS · 0 FAIL ·
  0 WARN; job `visual` success — P50+P51 27/27, P52 56/56, D011 1/1; job `fecho`
  success. Local, clone limpo de `22aa692` (Windows, 2026-10-19): `run.sh` 18 PASS
  · 0 FAIL; `compliance-audit.sh` 17 PASS · 0 FAIL · 0 WARN; `check_baseline.py`
  518/518. As primeiras execuções deram outro resultado, por ambiente do clone e
  não por produto: `run.sh` 17 PASS · 1 FAIL no stage `mutation`, porque o
  `origin/develop` do clone apontava para `1c6a363` e a base do trigger tratou
  `USER_GUIDE.md`, alvo do harness `p51`, como alterado (com essa base o `p51`
  passa a ser executado, medido); e `compliance-audit.sh` 16 PASS · 0 FAIL · 1
  WARN (`branch-protection` não determinável), porque o `origin` do clone era um
  caminho local. Com `origin/develop` em `22aa692` e o remote do GitHub, os dois
  fecharam como acima.
- **De `22aa692` a `0bd677c`**: entra o PR #110 **[#110 mesclado]**. O diff de
  `22aa692` a `0bd677c` fora de `.claude`, `docs*` e `specs` lista só
  `CONTEXT.md` e `tests_016_mutants.js`; sobre `E`, `generate_icons_v32.py` e
  `ui_icons_v32.js` é vazio.
- **Fase de produto: 5.2 SELADA**. Esta selagem não abre nem fecha fase de
  produto; `fase_corrente` e `proxima_fase` do `current_phase.json` ficam como
  estão, e o arquivo ganha `release_corrente` (com `commit` = "merge do PR de
  selagem — ver tag v3.2.11" e `conteudo` = `0bd677c`) e a nota do desvio. A nota
  de medição do arquivo cita o mesmo comando canônico e o mesmo resultado da
  tabela acima.
- **Não executado**: o `run.sh` completo e o CI sobre o commit final do PR de
  selagem (do orquestrador, depois do repin); suítes visuais Chromium localmente
  (KI-3; a execução canônica é o job `visual` do CI); o que o serviço em
  `127.0.0.1:1337` está servindo (a leitura de 2026-10-19 não obteve resposta,
  HTTP 000); a conferência de cada autorização da §29.4 contra o chat; a
  reexecução das sondas da auditoria de 2026-10-19 (as medidas de `EA-76` e
  `EA-65` abaixo são do refutador, com as linhas de código relidas em `0bd677c`).
- Defeito visível ao cliente na seção de apoio, medido em 2026-10-19 por jsdom e
  por Chromium real (medição do orquestrador; os probes não estão versionados e
  este registro não os reexecutou): **no relatório impresso, zero; na tela, um**
  — o `EA-80`, título sem conteúdo embaixo **só sob supressão total pela
  curadoria do operador**, com o aviso de supressão declarado. Classificado como
  a leitura correta daquele estado (D4 da 024, `transferido` para
  `design-decisions.md`) **[#110 mesclado]**. O `EA-76`, abaixo, é um segundo
  caminho que a auditoria mediu depois, com sinais declarados.

## Pendências que ATRAVESSAM a selagem (declaradas; nenhuma em ação)

1. **`EA-76` materializado** (medido pelo refutador da auditoria de 2026-10-19 e
   registrado neste PR de selagem como nota "Instância medida em 2026-10-19" do
   próprio `EA-76`, `.claude/BACKLOG.md:7137`). `ofertaDoMotor()`
   (`ui_p52_support_v32.js:247`) tem uma segunda fonte, o bloco da errata E2 da
   022 (`:272-345`), que não é a de `offered()` da curadoria
   (`ui_curation_v32.js:75`, bloco E2 em `:89-129`; `if (!chave) return;` em
   `:121`). `decisaoDe()` (`:136-141`) resolve o nome só em `PRODUCTS`
   (`idDoNome`, `:114-121`) e devolve `"include"` quando não casa: um card entra
   na seção de apoio sem passar pela curadoria, e `valido()`
   (`ui_curation_v32.js:133-138`) recusa o id fora do catálogo — o operador não
   consegue excluí-lo. Medido com sinais normais da UI: `offered()` = 11 contra 14
   cards (`becConcern`: FortiMail ×3), 12 (`identityRiskConcern`:
   FortiAuthenticator), 12 (`pamRequirement`: FortiPAM), 12
   (`organizationBuildsAIApps`: FortiAIGate); com todos os sinais, 12 contra 18.
   Decisão do proprietário, 2026-10-19: **declarar e selar** (fail-open nomeado).
   Dono do conserto: demanda futura (dois módulos, R9 §5).
2. **`EA-65`**: segundo a auditoria de 2026-10-19, o fecho registrado no backlog
   afirma, sobre o modo legado, o contrário do que o código faz — registro com
   erro, mecanismo correto. O fecho diz que a fronteira não entra em modo legado
   (`.claude/BACKLOG.md:6046-6049`); o código decide a fronteira por
   `arbitragemEmCurso()` (`ui_p52_support_v32.js:198-205`, usada em `:702` e
   `:666`), que lê a ocultação dos filhos e não o modo legado. A nota de
   2026-10-20 do próprio `EA-65` (`.claude/BACKLOG.md:6140`) corrige por
   acréscimo, sem reescrever o fecho. A contradição em estado concreto é medida
   da auditoria, não reexecutada aqui; o comentário do módulo
   (`ui_p52_support_v32.js:633`) repete a descrição antiga e só muda com demanda
   que toque o módulo.
3. **`EA-88`, quantificado e corrigido**: **12 de 19** fechos fora do critério
   (a contagem de 13 contou a 021 duas vezes; ver a nota de 2026-10-20 do
   `EA-88`, `.claude/BACKLOG.md:8236`). Medidos nos planning-states de `0bd677c`:
   8 sem campo de aceite (003, 007, 008, 009, 012, 013, 014, 018); 3 com a forma
   que a D3 (`sdd.md:36-38`) condena (020, 022, 023); e a 011, em que
   `validacao.decisao_tasks_160` começa por "ACEITO COM DEFERIMENTO REGISTRADO",
   palavra escrita por agente dentro do bloco do PO. As 7 canônicas são 010, 015,
   016, 017, 019, 021 (desde o #108) e 024 (nasceu com `aceite_po`). O remédio
   proposto, não decidido, está no `EA-88` (`.claude/BACKLOG.md:8074`); donos ali:
   gate `qa-engineer`, campo `product-owner`, schema `data-engineer`.
4. **`EA-81`**: cópia morta de ícones em modo legado sob arbitragem; dívida de
   instrumento declarada, sem efeito no relatório impresso (o papel lê só os
   cards). Sem dono em ação.
5. **`EA-84`, ampliado**: não é só o `guard-data`. `project_root()`
   (`.claude/hooks/lib/common.sh:15`, `git rev-parse --show-toplevel` pelo cwd do
   processo) é usado por `guard-boundary.sh`, `guard-data.sh`, `guard-tdd.sh`,
   `post-turn-verify.sh` e `state-eval.sh`; segundo a auditoria, o `guard-tdd`
   leu a worktree errada. O `EA-84` (`.claude/BACKLOG.md:7737`) ganhou nota de
   2026-10-20 (`:7828`) com a família inteira. Dono: `build-engineer`.
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
   `pins.json → declared` é igual em `e03b0f0` e `0bd677c`. Todo toque no engine
   continua sendo Porta B.
10. **`EA-90` (novo)**: uma exclusão R13 inerte é invisível ao `check_fecho` —
    entrada em `fecho.json → excluidas_por_r13` cujo slug não tem planning-state
    (ou cuja demanda não está `done`) nunca é julgada. Medido pelo `qa-engineer`
    em 2026-10-19 ao consertar o `D016-M20`; registrado em
    `.claude/BACKLOG.md:8422`, com duas defasagens de registro pinado
    (`fecho.json:22`, `mutation-matrix.json:1963-1964`) que **não são tocadas**
    por esta selagem.
11. **Versão corrente nos docs, e o `EA-64`**: o `README.md` declarava `v3.2.9`
    como "produção publicada" e versão corrente (`README.md:19` e `:23`); a
    produção declarada pelo proprietário é a v3.2.11, e o release mais recente no
    GitHub é `v3.2.9` (`gh release list`; `v3.2.10` e `v3.2.11` não têm release).
    **Corrigido neste PR** (commit `adc300f`): a v3.2.11 é a produção, aponta para
    a tag e para este registro; a v3.2.9 passa a rollback; a v3.2.8 desce para os
    marcos. Foi uma correção à mão, da mesma classe do `EA-64`, que **segue
    `aberto`**: o gate `V322-DOC3` confere a coerência interna do README, não o
    fato, e o registro escrito por `preparar_release.py` não existe. Dono do
    remédio de raiz: `build-engineer`/`tech-lead`.
12. **Demais achados `aberto`**: os 29 da contagem do `compliance-audit.sh`
    (acima) incluem os itens 1 a 11 e os achados de instrumento mais antigos
    (`EA-8` em diante, listados pelo próprio `compliance-audit.sh`); nenhum deles
    é tocado por esta selagem além das notas de 2026-10-20 já nomeadas.

## Adendo de 2026-10-25 — auditoria externa e suspensão da tag

Este adendo **só acrescenta**; o corpo acima não foi reescrito (R2 §5).

**A auditoria.** Em 2026-10-20 o Codex auditou o HEAD `ba77134` em modo somente
leitura e entregou dois relatórios independentes, promovidos em
`docs_phase5/auditoria_codex_2026-10-20/` (`relatorio_gpt-6-astra.md`,
`relatorio_gpt-5.6-terra.md`, `prompt.md`). Ambos recomendam **não selar** a
candidata nesse estado. Conferiram, sem divergência, o numstat canônico
(19 arquivos, +10.739/−422), o engine sem linha alterada e o HTML reproduzido
(SHA-256 `4c45ce20…5712`, 1.242.046 bytes). A triagem do orquestrador, por
cadeia `arquivo:linha` relida em `cee02e9`, está nos verbetes do
`.claude/BACKLOG.md`; cada verbete separa o que o Codex **executou** do que só
**leu**.

**Achados registrados** (`aberto`, 2026-10-25; a contagem de abertos do
`compliance-audit.sh` passa de 29 para 43, medida após o registro):

- `EA-91` — importação de sessão não é transacional nem substitutiva para a
  curadoria (validar já aplica; cancelar não desfaz; chave ausente herda a sessão
  anterior). Produto, alta.
- `EA-92` — "Nova sessão" não limpa a curadoria. Produto, alta.
- `EA-93` — `guard-boundary`/`guard-tdd` comparam caminho sensível a caixa em
  sistema de arquivos que ignora caixa. Instrumento, alta.
- `EA-94` — escrita em caminho protegido por Bash não tem guarda (boundary e TDD
  só no matcher `Write|Edit`). Instrumento, alta.
- `EA-95` — o `guard-tdd` libera qualquer módulo se existir uma demanda ativa com
  RED ou `tdd_waiver`; `check_state` não carrega o schema. Instrumento, média.
- `EA-96` — `red.commit` aceita qualquer objeto git (`cat-file -e`), não só commit.
  Instrumento, média.
- `EA-97` — `check_suites.py` ignora o código de saída; o bloco `visual` nunca é
  comparado. Instrumento, alta.
- `EA-98` — o stage `build` (`mutates: false`) regrava `ui_icons_v32.js` na
  árvore. Instrumento, média.
- `EA-99` — o composto que o `guard-data` recomenda contorna a inspeção; o parser
  não vê `&&` colado nem `$g commit` (família do `EA-82`). Instrumento, alta.
- `EA-100` — `run.sh --stage=<inexistente>` termina verde com 0 stages.
  Instrumento, média.
- `EA-101` — o `lint-arch` só aplica IIFE/`innerHTML=` a `ui_p5*` e `ui_d0*`.
  Instrumento, média.
- `EA-102` — `EA-59`, `EA-60` e `EA-63` citados sem verbete. Documentação, baixa.
- `EA-103` — Actions por tag móvel e sem `permissions:` em `verify.yml`.
  Cadeia de suprimentos, baixa.
- `EA-104` — o README instruía a baixar `releases/latest` com o nome da v3.2.7 e a
  tratar "o artefato da release" como o em uso (incidência viva do `EA-64`,
  que segue `aberto`). Tratado em commit próprio deste mesmo PR.

**Não viraram achado novo.** A reprodução do `EA-76` (FortiMail ×3) pelo terra
ganhou nota datada no próprio `EA-76`. As alegações do terra de que a tag não
existe e de que o pipeline completo não rodou no commit final (CX-07/CX-08) são
as declaradas neste registro — a tag é o passo seguinte por desenho (seção "Dois
hashes") e, segundo o orquestrador, o `run.sh` 18/18 e o `compliance-audit.sh`
17/17 foram medidos em `ba77134` depois do registro (medição do orquestrador,
citada sem reexecução por quem escreveu este adendo). Os `EA-71`, `EA-72` e `EA-90` (CX-16) já estavam
registrados e abertos.

**Decisão do proprietário (2026-10-25, no chat): corrigir o produto antes de
selar.** A tag `v3.2.11` fica **suspensa** até os defeitos de curadoria
(`EA-91`/`EA-92`) serem corrigidos; os achados de instrumento e o README entram
no mesmo ciclo. Este PR é o passo 1 e é doc-only: registra, não corrige.

**Consequência para este registro.** O que está escrito acima descreve a
**candidata `ba77134`/`cee02e9`**, cujo conteúdo `0bd677c` **não será o da tag**:
o conteúdo final será o da `develop` depois da correção do `EA-91`/`EA-92`. Os
hashes, o numstat, a contagem de abertos (29) e o SHA-256 do HTML citados acima
valem para a candidata e **não valem** para a tag futura. Este registro será
atualizado (ou substituído) na selagem efetiva; até lá, a v3.2.11 não tem tag e o
`README.md` não a afirma.

**Refutação adversarial dos `EA-91`…`EA-104` (2026-10-25, acrescentado depois do
parágrafo acima; nada acima foi reescrito).** Um workflow de 31 agentes tentou refutar
**por execução** cada um dos 14 achados; a síntese está em
`docs_phase5/auditoria_codex_2026-10-20/refutacao_adversarial_2026-10-25.md`. Resultado:
**14 confirmados, 0 refutados** — todos com correção de cadeia, que entrou em cada
verbete do `.claude/BACKLOG.md` como subseção datada "Refutação adversarial de
2026-10-25" (commit `eff1cc1`), sem apagar o corpo. Nada nesta refutação altera a
suspensão da tag registrada acima.

Ids nascidos, todos `aberto` (os quatro sufixados ficam junto do pai):

- `EA-97a` — o bloco `visual` de `expected_suites.json` não tem comparador (metade do
  `EA-97`; alta; demanda).
- `EA-98a` — `tests_ui_m33.js:108` executa o gerador de ícones sem `--check` sobre a
  árvore (média).
- `EA-99a` — o parser do `guard-data` e do `guard-add` não vê operador colado, `bash -c`
  nem expansão de shell (alta).
- `EA-100a` — `compliance-audit.sh --rule=<inexistente>` termina verde, `0 PASS · 0 FAIL
  · 0 WARN`, exit 0 (média).
- `EA-105` — exportar também escreve no owner da curadoria (baixa).
- `EA-106` — "sem curadoria" tem três representações e dois comportamentos (média).
- `EA-107` — o `draft` do editor de contexto tecnológico sobrevive a importação / Nova
  sessão / Reiniciar e bloqueia a impressão do cliente seguinte (média).
- `EA-108` — `prioLimitHit` sobrevive à importação (baixa).
- `EA-109` — `sessionHasContent()` e `sessionPreview()` são cegos à curadoria (média).
- `EA-110` — desmarcar e remarcar grava `include` explícito: **pergunta de desenho, não
  defeito confirmado** (baixa).
- `EA-111` — `D019-INV8` é tautológico para a importação; três mutantes sobrevivem 14/14
  (alta).
- `EA-112` — suítes de sessão e de UX cegas ao sexto owner, em quatro alíneas (alta).
- `EA-113` — S50 pina a ausência da curadoria no candidato (média).
- `EA-114` — S69 confere uma lista fixa de 10 owners sem `__CURATION` (média).
- `EA-115` — `D019-SUF1` mede só metade de C10 (baixa).
- `EA-116` — as regras `Write(...)` do `permissions.deny` são inertes segundo o host
  (baixa).

**Contagem de abertos.** Medida pelo `compliance-audit.sh` **depois** do commit
`eff1cc1`: **59** (eram 43 no registro do adendo; +16 = 4 sufixados + 12 novos), com
`17 PASS · 0 FAIL · 0 WARN` na execução completa. A contagem "29 para 43" acima continua
sendo a do instante em que foi escrita.

**`EA-93` teve o título corrigido.** O exemplo original, `ENGINE_v32.js`, **não** passa
por `Edit`/`Write`: o `permissions.deny` do host é avaliado antes do `PreToolUse` e ignora
caixa (medido em projeto-sonda). O exemplo verdadeiro é `UI_P52_WORKSPACE_V32.JS` no
`guard-tdd`; a regra ferida passa a ser a R3, e a severidade recomendada, de alta para
média. O título anterior está preservado na subseção do verbete.
