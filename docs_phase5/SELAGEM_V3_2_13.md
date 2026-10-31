# Registro de selagem — v3.2.13 (2026-10-31)

> Rito R14: release `develop → main` **sob pedido explícito do proprietário no
> chat**. Decisões que ancoram este registro, todas no chat do proprietário:
>
> - 2026-10-19: *"Vamos de (a), release com a tag"* — rota (a): release com tag,
>   **sem abrir fase de produto**. É a rota que a v3.2.11 e a v3.2.12 já usaram.
> - 2026-10-31, PR #117: *«Ratifico D-1 a D-9.»* — as nove decisões de desenho da
>   demanda 026 (`specs/026-decisao-unica-do-apoio/refinement.md`), até então
>   decididas pelo orquestrador sob instrução dele, com a ratificação pendente.
> - 2026-10-31: *"Sim, faça a release"* — autoriza a release `develop → main` com
>   tag. O que isso cobre: o fast-forward da `main`, a tag anotada, o push e a
>   Release do GitHub com o asset e o `.sha256`. O **cutover** do serviço em
>   `127.0.0.1:1337` **não** está nessa autorização: continua sendo ato dele.
>
> Commit de selagem doc-only, separado; merge fast-forward (sem squash); tag
> anotada sobre o HEAD da `main`, com os hashes abaixo.
>
> **O nome `v3.2.13` é o seguinte da sequência** (a última tag é `v3.2.12`, sobre
> `f2ff25d`); não há proposta de renome, e nenhum artefato anterior carrega esse
> nome. Se o proprietário preferir outro, a tag, o `README.md`, o
> `current_phase.json` e este registro mudam juntos; o SHA-256 do artefato e o
> conteúdo `b50dde2` não.
>
> Este registro **não substitui** o da v3.2.12: acrescenta a janela
> `9ca1fde..b50dde2`. `SELAGEM_V3_2_12.md` permanece como trilha (R2 §5), com o
> adendo de 2026-10-31 que fecha a selagem anterior.
>
> Este registro não declara fase concluída nem selada (CLAUDE.md §Limites de
> autonomia): `fase_corrente` segue 5.2 `SELADA`. Convenção de fonte: **"medição do
> orquestrador"** é número que ele mediu e que citei sem reexecutar; **"medido por
> mim"** é leitura de git desta escrita (`doc-writer`, HEAD `b50dde2`, branch
> `chore/selagem-v3.2.13`, árvore limpa). Não rodei suíte, pipeline nem build.

## Dois hashes, e não o mesmo

- **Conteúdo da v3.2.13**: `b50dde29f364ab26f53736696ee5c2b66fdf872f` — a `develop`
  depois do merge do PR #118 (`docs: D-1/D-2/D-7 em design-decisions`), sobre
  `a29d3bd` (merge do PR #117, a demanda 026). O PR #118 é doc-only; **só o #117
  toca produto**, e o numstat canônico em `b50dde2` é o da release. Onde este
  registro diz "SHA final", leia `b50dde2`. O PR de selagem (README, este registro,
  `current_phase.json`, `pins.json`) é doc-only, como os anteriores.
- **Tag**: `v3.2.13` aponta para o merge do PR de selagem na `develop`, que depois
  vai à `main` por fast-forward. Esse hash só existe depois da mescla; fica na
  própria tag anotada e no commit de `main`, e **não é escrito aqui** para não ser
  inventado (é o padrão `merge`/`conteúdo` de `current_phase.json`).
- **O link da tag e da Release** no `README.md` resolve a partir do push da tag e da
  criação da Release, no mesmo ato de release.

## Desvio declarado: o produto segue mudando sob a fase 5.2 SELADA, sem o gate de abertura de fase

O desvio é o mesmo declarado em `SELAGEM_V3_2_11.md` e `SELAGEM_V3_2_12.md`; esta
selagem não o resolve, só o estende por mais uma demanda.

- A 5.2 foi selada no merge `07bc90b` (PR #8, 2026-08-24; a tag `v3.2.1` aponta
  para ele), que trouxe o commit de conteúdo `c1e3649`.
- Desde então o produto passou de v3.2.1 a v3.2.13 com `current_phase.json` em
  `fase_corrente` 5.2 `SELADA` e `proxima_fase` `NAO_ABERTA`, sem
  `specs/PHASE_X*.md` com hash registrado. O gate de abertura de fase da R4
  (`sdd.md`, "Gates de fase") não foi cumprido.
- O proprietário decidiu declarar o desvio e selar pela rota (a), em vez de abrir
  uma 5.3 retroativa (2026-10-19). Para esta release, o pedido de 2026-10-31
  (*"Sim, faça a release"*) pede release com tag; **não abre fase** — esta
  selagem segue a rota (a) das anteriores.

Medida **recomputada** em `c1e3649..b50dde2` (medido por mim, 2026-10-31), no mesmo
escopo `E` das selagens anteriores (`engine_v32.js`, `build_v32_html.py`, o HTML dev,
`ui_*.js`, `ui_*.css`), com o `USER_GUIDE.md` em linha própria:

| Medida | Valor | Comando |
|---|---|---|
| Arquivos de produto alterados | **20 · +12.213/−484** | `git diff --numstat c1e3649 b50dde2 -- E`, somando as colunas |
| `USER_GUIDE.md` (linha própria) | +114/−25 | `git diff --numstat c1e3649 b50dde2 -- USER_GUIDE.md` |
| HTML dev | +6.133/−264 | idem, `-- quickscan_secops_soccmm_v3_2_dev.html` |
| `engine_v32.js` | **0 linhas** | idem, `-- engine_v32.js` (saída vazia) |

A v3.2.12 media 20 arquivos · +10.973/−438. Somada à janela desta release
(+1.510/−316), dá +12.483/−754, mais do que a diferença líquida acima, porque a 026
reescreveu linhas que as demandas anteriores haviam escrito. O número de arquivos
não muda (20): a 026 só tocou arquivos que já estavam no desvio.

## O que mudou desde a v3.2.12 (`9ca1fde..b50dde2`)

Quatro merges first-parent entraram depois do conteúdo da v3.2.12; **só o #117
toca produto** (`git log --first-parent --format='%h %cI %s' 9ca1fde..b50dde2`,
medido por mim):

| PR | Merge | Mesclado (-03:00) | O que é |
|---|---|---|---|
| #115 | `f2ff25d` | 2026-10-30T23:19:29 | `chore/selagem-v3.2.12` — selagem anterior (doc-only; é o HEAD atual de `main`) |
| #116 | `9509e4b` | 2026-10-31T01:12:56 | `chore/pos-selagem-v3.2.12` — memórias de agentes parqueadas (doc-only) |
| #117 | `a29d3bd` | 2026-10-31T17:32:11 | `feature/026-decisao-unica-do-apoio` — contrato único de decisão de apoio |
| #118 | `b50dde2` | 2026-10-31T17:50:08 | `chore/026-design-decisions` — D-1, D-2 e D-7 promovidas a Confirmadas em `design-decisions.md` (doc-only) |

O #115 e o #116 entram na lista porque `9ca1fde` é anterior a eles; ambos são
doc-only. O diff de produto de `f2ff25d..b50dde2` (a `main` atual até a candidata) é
idêntico ao de `9ca1fde..b50dde2`: 5 arquivos, +1.510/−316 (medido por mim).

**Numstat canônico**, `git diff --numstat 9ca1fde..b50dde2 -- engine_v32.js
build_v32_html.py quickscan_secops_soccmm_v3_2_dev.html 'ui_*.js' 'ui_*.css'`
(medição do orquestrador, conferida por mim; 5 arquivos, **+1.510/−316**):

| Arquivo | + | − |
|---|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` (gerado) | 755 | 158 |
| `ui_curation_v32.js` | 337 | 52 |
| `ui_p52_support_v32.js` | 339 | 106 |
| `ui_p52_support_v32.css` | 71 | 0 |
| `ui_curation_edit_v32.js` | 8 | 0 |

`engine_v32.js`, `build_v32_html.py`, `USER_GUIDE.md`, `ui_v32.js`, `ui_session_v32.js`
e `ui_ux_v32.js`: **0 linhas** na janela (medido por mim). Fora de `E`, a janela traz
os gates `tests_026_contrato.js` (novo, +1.091), `tests_026_mutants.js` (novo, +324),
`tests_019_curadoria.js` (+11/−0) e `tests_022_mutants.js` (+16/−3), o diretório
`specs/026-decisao-unica-do-apoio/` e `CONTEXT.md` (+60/−0).

**O que a 026 corrige** (cito, não repito: `specs/026-decisao-unica-do-apoio/relatorio-final.md`,
§Objetivo cumprido). A auditoria externa de 2026-10-31 sobre a v3.2.12 mediu dois
defeitos: `QS-01` — os cards por produto contradiziam o motor contextual — e `QS-02`
— o PDF perdia os qualificadores que a tela mostrava. A causa era a derivação de "o
que o motor ofereceu" em dois módulos que nunca consultavam o motor (`EA-76`, aberto
desde 2026-09-29 e selado como "declarar e selar" nas v3.2.11 e v3.2.12). Agora a
decisão de apoio por linha de produto nasce **uma vez**, em `ui_curation_v32.js`, e a
tela, o editor e o papel a **consomem**: onde o motor tem voz, o card diz o que ele
resolveu e a linha vetada vira entrada no bloco «Não indicado nesta leitura»; onde o
motor se abstém, a oferta da Camada 1 passa inteira como hipótese condicionada, com
a condição e o tier visíveis; o papel copia do card o tier, a ação, a condição, a
variante, o escopo e os vetos. `EA-76` está `resolvido` no `.claude/BACKLOG.md`
(conferido por mim), com a ressalva escrita no próprio bloco: "resolvido" é *corrigido
e medido pela suíte `D026`*, não "entregue" — o deploy é do proprietário.

As D-1..D-9 foram ratificadas literalmente pelo proprietário no PR #117 (*«Ratifico
D-1 a D-9.»*); D-1, D-2 e D-7 entraram em `.claude/rules/design-decisions.md` (R13)
pelo PR #118. Não reportar como defeito: a ausência de card Fortinet em C2/C4, o
bloco de vetos, o tier de hipótese condicionada onde o motor se abstém e o título do
card nomeando a variante resolvida (`FortiEDR` sob `FortiEndpoint`). Lacunas que a
026 nomeou e deixou abertas: `EA-122` (`buildRecommendationContext()` não aplica
`suppressedByPlatform()` no ramo `CONTEXT_NOT_INFORMED`; é do engine, `frozen`) e
`EA-123` (`exclude` obsoleto sem sujeito no arquivo de sessão) — ambas `aberto` no
`BACKLOG.md` (conferido por mim).

**Efeito de usuário** que muda: tela e PDF passam a dizer a mesma coisa sobre cada
linha de produto, e deixam de oferecer, como "indicação prioritária", produto que o
motor contextual vetou. **O juiz é uma sessão real** com a tecnologia declarada nos
casos C1, C2/C4 e C7 da auditoria, comparando a tela com o PDF; **não foi executado
por mim.**

## Fronteira (R6)

- `frozen`: nenhuma mudança (`engine_v32.js` 0 linhas; Camada 1, harness M41 e
  snapshot sem toque). `generated`: o HTML dev muda só pelo builder; o stage `build`
  prova a identidade. `legacy`: sem mudança. `registry`: `pins.json` regenerado por
  `gen_pins.py` (649 entradas em `b50dde2`, medido por mim; `check_baseline` verde,
  medição do orquestrador).
- `build_v32_html.py`: 0 linhas na janela.
- Lista da §29.4 (`PROTECTED`, `tests_p50_core.js:82`): **nenhum** arquivo dela mudou
  em `9ca1fde..b50dde2` — `ui_v32.js`, `ui_session_v32.js` e `ui_ux_v32.js` têm 0
  linhas (medido por mim; a lista completa não foi reextraída nesta escrita).
  **Zero autorização nominal da §29.4 é necessária nesta release.** Os que a 025
  tocou foram tratados na selagem da v3.2.12.
- `current_phase.json`: `release_corrente` passa a v3.2.13; a v3.2.12 desce para o
  bloco `anterior_publicada` (é a que o serviço serve até o cutover e o rollback
  depois dele); `superada` (v3.2.11) fica como está; uma nota de medição por
  acréscimo.

## O que esta selagem consolida (`main` está atrás em `f2ff25d`)

`git rev-list --count f2ff25d..b50dde2` = 40 (3 merges); `git merge-base
--is-ancestor f2ff25d b50dde2` = verdadeiro, logo fast-forward (medido por mim);
`origin/main` = `f2ff25d8d50614ab44f4bdc529d8adbd8963cf57` (`git ls-remote origin
refs/heads/main`, medido por mim).

- **Identidade** (HTML dev `quickscan_secops_soccmm_v3_2_dev.html`):
  1.287.472 bytes, SHA-256
  `9d5fca714308e358223cc31c579a7c3a508d5d07ae0f7b4065f237702ffa52ce`.
  `git show b50dde2:quickscan_secops_soccmm_v3_2_dev.html | sha256sum` dá esse valor
  e `| wc -c` dá 1287472 (medido por mim). Cresceu 38.700 bytes sobre a v3.2.12
  (1.248.772 → 1.287.472; a conta confere).
- **Artefato de release**: `deploy/v3.2.13/quickscan_secops_soccmm_v3_2_13.html`,
  preparado por `python preparar_release.py v3.2.13` em `b50dde2` (medição do
  orquestrador); conferi o `sha256sum` do arquivo: `9d5fca71…52ce`, igual ao blob.
  `default.conf` (`7c9ecad4abf28cd6d8fa6a88dab22a84f74d66c4538df18dfc1ea8e74e16dbbe`)
  e o digest da imagem (`nginxinc/nginx-unprivileged@sha256:44e36330…dd49`) são os
  mesmos de v3.2.9 a v3.2.12. **Ressalva: `deploy/` mora fora do repositório
  (`EA-53`)**; o que o git permite conferir é o blob de `b50dde2`.
- **Engine e régua D2**: `engine_v32.js` SHA-256
  `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (0 linhas
  alteradas desde a 5.2; `git show b50dde2:engine_v32.js | sha256sum`, medido por
  mim). Payload M41, medição do orquestrador em 2026-10-31 com `--compare`
  (`SANIDADE: OK`, 9 cenários):
  `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b`, igual ao
  `pins.json → declared.m41_payload_sha256` (valor conferido por mim). Porta A/B não
  se aplica: nenhuma linha do engine mudou.
- **Tags**: a tag mais recente no remoto é `v3.2.12` (sobre `f2ff25d`); **a tag
  anotada `v3.2.13` nasce nesta selagem**, sobre o HEAD da `main` (conteúdo
  `b50dde2`; ver "Dois hashes").
- **Demandas**: 21 planning-states, todos `phase: done` (medido por mim); a 026 é o
  mais recente, fechada com o PR #117 aberto antes do merge, conforme a R4.
- **Backlog**: `EA-76` passa a `resolvido`; entram `EA-122` e `EA-123` (`aberto`). A
  contagem de achados `aberto` é a seção "achados abertos (N)" do
  `compliance-audit.sh --rule=backlog`; **não a reexecutei** e não escrevo N aqui.
- **Evidência (R11)**: nenhuma evidência binária nova entra nesta selagem.

## Estado de verificação no momento da selagem

Todos os números abaixo são **medição do orquestrador em 2026-10-31**, citada sem
reexecução minha.

- **Candidata verificada: `fca0e1c`** (árvore limpa), última verificação completa
  de produto; entre `fca0e1c` e `b50dde2` só mudaram documentos, pins e
  planning-state — o produto é byte-igual:
  - `bash .claude/verify/run.sh` (completo, 18 stages): **18 PASS · 0 FAIL**;
  - `bash .claude/verify/compliance-audit.sh`: **17 PASS · 0 FAIL · 0 WARN**.
- **Gates da 026**: `tests_026_contrato.js` **3 PASS · 0 FAIL**; campanhas de mutação
  d019 17, d022 13, d023 12, d025 23 e d026 **6 DETECTADO · 0 sobreviventes**.
- **CI da `develop`**: run `41240750371` em `b50dde2` — `verify`, `visual` e `fecho`
  success; run `41239357894` em `a29d3bd` — success.
- **Smoke sobre o ASSET da release** (`HTML_OVERRIDE` apontando para
  `deploy/v3.2.13/quickscan_secops_soccmm_v3_2_13.html`, o mesmo blob que o
  container serve): `d026` 3/3, `d019` 14/14, `d025` 16/16.
- **Fase de produto: 5.2 SELADA**. Esta selagem não abre nem fecha fase de produto;
  `fase_corrente` e `proxima_fase` ficam como estão.
- **Não executado**:
  - o `run.sh` completo, o `compliance-audit.sh` completo e o CI sobre o **commit
    final do PR de selagem** (doc-only; dependem do repin do orquestrador);
  - qualquer verificação por mim: não rodei suíte, pipeline nem build;
  - suítes visuais Chromium localmente (KI-3; a execução canônica é o job `visual`
    do CI, verde em `b50dde2` acima);
  - o **cutover** em `127.0.0.1:1337` (ato do proprietário; hoje serve a v3.2.12);
  - a **sessão real** que é o juiz da 026 (acima);
  - a reexecução, por mim, dos números do relatório final da 026 que não estão
    listados acima.

## Pendências que ATRAVESSAM a selagem (declaradas; nenhuma em ação)

Status pelo bloco do `.claude/BACKLOG.md` de `b50dde2`. **O que saiu desde a
v3.2.12**: `EA-76` está `resolvido` pela 026 (era o item 1 do registro anterior).

1. **`EA-122` e `EA-123`** (novos, `aberto`): lacunas que a 026 nomeou. A primeira é
   do engine (`frozen`): o conserto exige rito D2, Porta B. Em C3 (FortiSOC declarado
   só em `soc-platform`) a apresentação aplica a forma segura de D-3; a lacuna é do
   engine, não da apresentação.
2. **`EA-121` manifestou-se de novo** (`aberto`): `preparar_release.py` escolheu
   `v3.2.9` como "release anterior" por ordenação lexicográfica de `vN.N.N`. Efeito
   inócuo no artefato (`default.conf` e digest de imagem são idênticos de v3.2.9 a
   v3.2.13), mas o `docker stop quickscan-v329` impresso pelo script está errado: o
   container no ar é `quickscan-v3212`. O cabeçalho do `deploy/v3.2.13/compose.yaml`
   foi corrigido à mão pelo orquestrador, com nota. O defeito de raiz segue no script.
3. **`EA-88`, `EA-81`, `EA-84`, `EA-83`, `EA-85`, `EA-87`, `EA-90`, `EA-115`, `EA-116`,
   `EA-117`…`EA-120`** seguem como no registro da v3.2.12 (nenhum tocado pela 026
   ou por esta selagem; status não reconferido item a item nesta escrita).
4. **Porta A do rito D2**: pendente de ratificação do proprietário (Q3); todo toque
   no engine continua sendo Porta B.
5. **`EA-64` e `EA-104`** (a versão corrente nos docs): o `README.md` é corrigido à
   mão neste passe para a v3.2.13 — da mesma classe do `EA-64`, que **segue `aberto`**
   (o gate `V322-DOC3` confere a coerência interna do README, não o fato; o registro
   escrito por `preparar_release.py` não existe). O `EA-104` também segue `aberto`
   (status conferido por mim).
6. **Cutover pendente do proprietário.** A v3.2.13 está **preparada e conferida**
   (`deploy/v3.2.13/`), não publicada; o serviço segue na v3.2.12. O comando correto
   é o do registro de deploy, não o impresso pelo script:
   `docker stop quickscan-v3212` e `docker compose -f deploy/v3.2.13/compose.yaml up -d`,
   a partir da pasta `QuickScan-SOC-CMM` que contém `deploy/`, e a conferência byte a
   byte, `curl -s http://127.0.0.1:1337/ | sha256sum` devolvendo `9d5fca71…52ce`.
   Essa conferência é o item 1 do roteiro de aceite da auditoria. Rollback:
   `deploy/v3.2.12/`.
7. **Memórias de agentes** que nasceram nesta demanda e nesta selagem: por instrução
   do orquestrador, nenhuma entra neste PR (ele as parqueia). Sem conteúdo versionado
   aqui.

## O que vem depois da mescla do PR de selagem

Autorizado pelo proprietário no chat em 2026-10-31 (*"Sim, faça a release"*) e
executado pelo orquestrador depois que o PR de selagem for mesclado:

1. `main` por fast-forward, de `f2ff25d` ao merge do PR de selagem (sem squash);
2. tag anotada `v3.2.13` sobre esse merge, com os hashes deste registro (conteúdo
   `b50dde2`, SHA-256 do HTML, engine, payload M41, numstat, verificação);
3. push da `main` e da tag;
4. Release do GitHub `v3.2.13`, com o asset `quickscan_secops_soccmm_v3_2_13.html` e
   `quickscan_secops_soccmm_v3_2_13.html.sha256`, conferindo o digest que a API do
   GitHub reportar contra `9d5fca71…52ce`.

Nada disso está feito no momento da escrita deste registro. O **cutover** não faz
parte da lista: é o item 6 acima, do proprietário. O adendo que registrar o que de
fato aconteceu (hash do merge, objeto da tag, run do CI, URL da Release, cutover) é
posterior e só acrescenta (R2 §5).
