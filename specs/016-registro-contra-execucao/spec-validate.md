# Spec-validate — 016-registro-contra-execucao

> Fase 6 · T080 · `qa-engineer` · 2026-09-04 · **somente leitura**, iteração
> **2 de 2**. Valida a [spec.md](spec.md) aprovada — com **E1, E2, E3 e E4**
> incorporadas (e as ET1–ET4 do `tasks.md`, que a E3 absorveu) — contra a
> implementação **real** (source + execução, R2), no HEAD
> **`643daa4ca60b293635c461640351bf8e7d97a6fe`** (2026-09-04T20:22-03), worktree
> `phase5-014`, branch `feature/016-registro-contra-execucao`.
> A iteração 1 (HEAD `76fd9dc`, 63/66, gaps G1–G3) está preservada no blob
> `d130a04:specs/016-registro-contra-execucao/spec-validate.md`; este documento
> a **substitui** e cita o que dela foi fechado, com a execução que fechou.
> **Este registro não emite veredito de aceite**: cada linha cita o que foi
> executado ou lido. Gap de classe `spec-errada` é decisão do usuário (R4).
>
> **Três coisas que o leitor precisa saber antes da tabela:**
>
> 1. **O PR #40 existe e o CI rodou uma vez** — run
>    [`33927191969`](https://github.com/oflavioc/quickscan-secops/actions/runs/33927191969)
>    (`pull_request`, head **`ebe0b22`**, 2026-09-04T22:50Z). Os **três** jobs
>    fecharam `FAILURE`: `fecho` e `verify` **pela razão que a spec prevê**
>    (tabela abaixo); `visual` por uma razão que **ninguém previu e que não
>    está diagnosticada** — a campanha `d016`, reexecutada por aquele job,
>    encontrou o gate nu vermelho como baseline e deixou **13 de 33** mutantes
>    `NÃO EXECUTADO` (achado **A1**, §abaixo). Sob P2, `visual` é check
>    obrigatório: **enquanto A1 durar, o PR não mescla**.
> 2. **O remoto está em `ebe0b22`; o HEAD local está quatro commits à frente**
>    (`ed2f9d0` fase `validate`; `b4b458a`/`8a2be5a`/`643daa4` = T082). O que
>    difere entre `ebe0b22` e HEAD são **quatro arquivos, nenhum gate nem
>    instrumento** (planning-state da 016, `BACKLOG.md`, `orchestration.md`,
>    `relatorio-final.md`) — toda evidência do CI sobre os gates vale para HEAD.
>    Os três arquivos da T082 estão **sem repin** (R8 §1): o stage `baseline`
>    reprova em HEAD até o repin do orquestrador — não é defeito, é o
>    mecanismo (`448/450 pins conferem · 2 divergentes · 1 sem pin`).
> 3. **A árvore é compartilhada com agentes em voo**: durante a primeira execução
>    completa do pipeline desta iteração a T082 estava escrevendo, o stage
>    `mutation` recusou a árvore suja e o `run.sh` truncou a razão (EA-15).
>    O número que vale é o do stage isolado com árvore limpa e o do clone
>    efêmero — ambos **33/33**. Está tudo na EVIDÊNCIA; nada foi omitido.

## Os três vermelhos do run `33927191969` — lidos pela razão, não pela cor

Mesma disciplina da iteração 1 (trilha do `541771a`): cada vermelho com a razão
obtida, as razões parecidas que seriam defeito, e a classe.

| job (id) | razão obtida (literal do log) | razões parecidas que seriam DEFEITO — nenhuma ocorreu | classe |
|---|---|---|---|
| **`fecho`** (`101198164054`, 22:50:54→22:51:00, `fetch-depth: 1`, sem `npm`) | `[SONDA] fecho: 35 caso(s) · 0 divergência(s) (total pinado: 35)` · `[FAIL] FECHO PENDENTE da demanda 016-registro-contra-execucao (fase implement) — merge bloqueado até done` · `fecho --pr: FECHO PENDENTE · fase-nao-done` · exit 1 | `demanda-fora-da-maquina` (junção quebrada) · `artefato-ausente` (fase ignorada) · sonda divergindo · `NÃO JULGADO` · exit 0 | **desenho** (C5 b, borda 6): o red ao vivo de `D016-PR1`, no check com nome próprio (E1). A fase impressa é `implement` porque o head do PR é `ebe0b22`; em HEAD o mesmo gate imprime `(fase validate)` (executado hoje, exit 1, código `fase-nao-done`) |
| **`verify`** (`101198164047`) | `verify: 16 PASS · 0 FAIL` (pipeline, 22:56:55) e, no passo seguinte, `[FAIL] branch-protection: develop DESPROTEGIDA · faltam: fecho, up-to-date, verify, visual · mecanismo lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false` · `compliance: 15 PASS · 1 FAIL · 0 WARN` · exit 1 | `JSONDecodeError` (forma do `541771a`) · `NÃO DETERMINÁVEL` no CI (rede/permissão) · sonda `D016-PROT1` divergindo · qualquer stage do pipeline vermelho | **desenho** para o gate (§Nascimento: dono = proprietário, evento = P2) — **e gap de spec** para a frase *"o `verify` fica verde"* (E1 iv, §Superfície 2): ver **G5**. O token usado foi **anônimo**, não `GITHUB_TOKEN` (ver **G6**) |
| **`visual`** (`101198163861`) | suítes: playwright ✓ · `P50 CHROMIUM + P51: 27 PASS · 0 FAIL` · `P52 CHROMIUM: 55 PASS · 0 FAIL` · `D011 CHROMIUM: 1 PASS`; passo "Campanhas de mutação com Chromium": `IC-4: d016: 33 âncora(s)` · `[RUN] d016` · **13 × `NÃO EXECUTADO · causa: gate não pôde ser executado · baseline do gate nu VERMELHO — kill não atribuível ao mutante`** (M18–M28, M32, M33 — exatamente os de modo `ARVORE`) · `não-KILL: 13 de 33 · 20 KILL ficam na contagem` · `mutation: 1 campanha(s) executada(s) · 1 problema(s)` · exit 1 | — | **achado A1, não diagnosticado** (R2 §3: causa antes de conclusão). O que está isolado e o que não está, em §A1 |

## Método

- **Exigências extraídas da `spec.md`**: as mesmas 70 linhas da iteração 1
  (C1–C10 alínea por alínea, T1–T10, Superfícies 1–5, Contratos, erratas,
  §Nascimento, §Não mensurável, §Fora de escopo, cross-check), **mais duas**
  que a execução do CI tornou mensuráveis e que a iteração 1 não isolou:
  **71** (E1 iv / §Superfície 2: *"o `verify` fica verde"*) e **72** (T6 /
  §Superfície 3: *"token: `GITHUB_TOKEN`"* no CI).
- **Execuções desta iteração** (2026-09-04; HEAD `643daa4`, salvo indicação):
  - `MUTATION_DEFER_MISSING=1 bash .claude/verify/run.sh` **completo, duas
    vezes**: (1) em `ed2f9d0`, **15 PASS · 1 FAIL** — `[FAIL] mutation`, razão
    **truncada** pelo `run.sh` (30 linhas, EA-15); reproduzido em seguida com o
    stage isolado: `[FAIL] árvore suja` era a causa (T082 editando `BACKLOG.md`,
    `orchestration.md`, `relatorio-final.md` na mesma worktree); (2) em
    `643daa4`, árvore limpa, **15 PASS · 1 FAIL** — `[FAIL] baseline`: `pin
    diverge: .claude/BACKLOG.md` · `pin diverge: .claude/rules/orchestration.md`
    · `rastreado sem pin: specs/016-registro-contra-execucao/relatorio-final.md`
    · `448/450 pins conferem · 2 divergentes · 0 ausentes · 1 sem pin` (R8 §1,
    repin pendente do orquestrador — o `relatorio-final.md` já o declara); **os
    outros 15 stages PASS**: `env-doctor` · `boundary` · `marker-lint` ·
    `icons-check` · `build` · `lint-arch` · `regra-morta` · `state` · `tdd` ·
    **`fecho`** · **`mutation`** · `m41` · `suites` · `suites-heavy` ·
    `evidence-bridge`. Porcelain vazio ao fim das duas.
  - **Stage `mutation` isolado** (`check_mutation.py`, worktree, árvore limpa):
    `IC-4: d016: 33 âncora(s) com ocorrencias == 1` · `integridade: 0
    problema(s)` · dez campanhas "nenhum alvo mudou" · `[RUN] d016` →
    `restauração: arquivos mutados byte a byte OK · criados removidos OK ·
    porcelain dos alvos limpo` · **`D016 MUTATION: 33/33 mutantes detectados
    pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)`** · `não-KILL:
    nenhum` · **`mutation: 1 campanha(s) executada(s) · 0 problema(s)`**, exit
    0. **Idem no clone efêmero** (mesmo texto, exit 0, porcelain vazio).
  - **Gate nu** `check_fecho.py`: `[SONDA] fecho: 35 caso(s) · 0 divergência(s)
    (total pinado: 35)` · `merges first-parent após o piso: 0 · até o piso,
    inclusive: 39 (não julgados) · censo pinado: 39 (ok)` · dez `CONFORME` (três
    com `EXCLUÍDA R13 … — fonte: …`) · `016: EM VOO (fase validate) — não
    julgada` · `fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)`, exit 0;
    `--json`: `censo {pinado 39, lido 39, ok}`, `origin_develop {presente, sha
    921977c…, piso_na_cadeia}`, acusados `[]`, globais `[]`.
  - `check_fecho.py --pr` com `GITHUB_HEAD_REF`/`GITHUB_BASE_REF`: `[FAIL] FECHO
    PENDENTE da demanda 016-registro-contra-execucao (fase validate) — merge
    bloqueado até done` · `fase-nao-done`, exit 1.
  - `check_branch_protection.py` ao vivo: `[SONDA] branch-protection: 9 caso(s)
    · 0 divergência(s)` · `repo oflavioc/quickscan-secops (origem: git remote
    get-url origin) · token: gh auth token` · `[FAIL] develop DESPROTEGIDA ·
    faltam: fecho, verify, visual (checks obrigatórios), up-to-date · mecanismo
    lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false`
    · `outras regras ativas: deletion · non_fast_forward`, exit 1.
  - `compliance-audit.sh`: **15 PASS · 1 FAIL · 0 WARN**, exit 1 (só
    `branch-protection`); `fecho.json/excluidas_por_r13: 3 …, todas com fonte`;
    `waivers (tdd_waiver + fecho_pendente): nenhum ativo`; `--rule=backlog`:
    `achados abertos (30)` — **EA-36** e **EA-37** novos, **EA-33 fora da lista**.
  - **Clone efêmero** (scratchpad; `git clone` local; HEAD `ed2f9d0` — gates,
    instrumentos, registros, fixtures e harness **byte-idênticos** aos de HEAD;
    `refs/remotes/origin/develop` fixado em `921977c`; nada tocou a worktree;
    porcelain vazio antes, entre e depois): controles `sonda 35/35`, `gate nu 0
    problema(s), censo 39/39 ok`, `sonda proteção 9/9`; **M31 à mão** ⇒
    divergentes **`['F24']`**, `F24 → FECHO PENDENTE DECLARADO · mensagem ·
    codigo None · problemas 0`, exit 1 (1/35 — o único carrasco); **N9 noop**
    (só comentário na cláusula) ⇒ 35 · 0 (F24 não diverge: o kill é da cláusula,
    não do toque no arquivo); **M31 + registro de `76fd9dc`** (33 casos, sem
    `F24.json`/`P11.json`) ⇒ **33 · 0, exit 0** — a direção "sem F24, sobreviveria";
    **M33 (leitor mudo) sob o gate NOVO** ⇒ exit 1 · `problemas 0` · censo
    `divergente` (lido 0 × pinado 39) · acusados `[]`; **M33 sob o gate ANTIGO
    (`76fd9dc:check_fecho.py`)** ⇒ **exit 0 · problemas 0 · merges_ate_piso 0**
    (verde por vácuo — a direção "sem a guarda"); leitor intacto ⇒ censo ok;
    **M32 à mão** (`999-sintetica-d016.json`, `implement`, válvula com `prazo` =
    dia do commit) ⇒ exit 1 · `problemas 1` · acusados `[(999-sintetica-d016, EM
    VOO, fecho_pendente-prematura)]`; **N8** (mesmo 999 **sem** válvula) ⇒ exit
    0 · 0 problemas; arquivo removido; harness
    `D016_MUT_ONLY=D016-M31,D016-M32,D016-M33` ⇒ **3/3 DETECTADO · controles 2
    ok** (`C0-fecho … censo da leitura 39/39 (ok)`; `C0-protecao 9/9`) ·
    `restauração … OK · criados removidos OK · porcelain dos alvos limpo`, exit
    0; **C1(e)** `update-ref -d refs/remotes/origin/develop` ⇒ `[FAIL] NÃO
    DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin
    develop)` + 11 sujeitos `NÃO DETERMINÁVEL`, `censo pinado: 39
    (nao_aplicado)`, exit 1; ref restaurado ⇒ 0 problemas.
  - **Schema, por oráculo independente** (python sobre os 11 planning-states):
    `required = [demanda, phase, spec_dir, branch]`; **0** estados sem
    `required`; `additionalProperties: false` reprovaria **5/11** (010, 011,
    014, 015, 016); chave irmã `validacao`/`implementacao` em **3/11** (010,
    011, 015) — **reproduz a medição do `data-engineer`** (5/11 · 3/11).
  - **API do GitHub sem token** (desta máquina, `urllib`): `GET
    /repos/oflavioc/quickscan-secops/rules/branches/develop` ⇒ **200**,
    `[deletion, non_fast_forward]`, `X-RateLimit-Limit: 60`; `GET
    …/branches/develop` ⇒ 200, `protected: true`. Repositório `PUBLIC` (`gh repo
    view`).
  - **Logs do CI** (`gh run view --job --log`, os três jobs, 1.381 linhas lidas).
- **Leituras**: `git diff 76fd9dc..HEAD` (22 arquivos) — schema,
  `design-decisions.md`, ADR 0001, `fecho.json`, `check_fecho.py`, harness,
  `mutation-matrix.json` (33 pares `D016-*`, todos `KILL`; dívida nova),
  `mutation_map.json` (**54** targets), `pipeline.yaml` (35 casos + censo),
  `spec.md` (E4: sete pontos `EA-5`→`E5`), `prova-de-carga.md` §9,
  `trilha-do-commit-541771a.md`, `relatorio-final.md`, `BACKLOG.md` (EA-33
  `resolvido` :1879; nota em EA-14 :1052; EA-36 :2213; EA-37 :2267),
  `orchestration.md:71-73` em HEAD; `verify.yml`; `compliance-audit.sh:63-135`;
  `branch_protection.py:_token`; `tests_016_mutants.js` (laço principal,
  `runJson`, `julgaControle`); `check_mutation.py:56-60` e `:1304-1311`;
  script boundary × `git diff --name-only 921977c..HEAD` (**77** arquivos).
- **Não executado, com motivo**: verde ao vivo de `D016-PROT1` (P2 não
  executada — `DESPROTEGIDA` no CI e local); flip `LIBERADO` do check `fecho`
  (o `done` ainda não foi gravado — T084); permissão do **`GITHUB_TOKEN`** em
  `/rules/branches` (o passo do CI **não o oferece** — G6); campanha `d016` no
  job `visual` (**não reproduzível aqui**: sem Chromium para reproduzir a
  sequência do job, e a linha do controle não está no log — A1); suítes
  Chromium (KI-3, `env-doctor` nomeou a ausência); `PATH=""` (C1 e, metade
  `git` ausente) não refeito — `fecho.py` é byte-idêntico ao medido na
  iteração 1.

## Itens — veredito um a um

Legenda: **conforme** · **GAP** (classificado em §Gaps) · **pendente** (o
próprio desenho da spec o coloca no fecho, ainda não ocorrido — não pontua) ·
**declarado** (não é exigência pontuável). Onde a prova é a mesma da iteração 1
e o instrumento não mudou, isso está escrito; onde há execução de hoje, ela é
citada.

| # | Exigência (spec) | Verificação (iteração 2) | Veredito |
|---|---|---|---|
| 1 | **C1(a)** mesclada por mensagem `#N` + `phase != done` + sem válvula ⇒ `MESCLADA SEM FECHO`, FAIL | sonda F1/F19 (35 · 0 hoje, stage e clone); M18 DETECTADO hoje (`015 · #34 · 1 problema`, isolamento asserido); merge `#99` simulado na iteração 1 (instrumento `fecho.py` byte-idêntico) | **conforme** |
| 2 | **C1(b)** só por ancestralidade ⇒ idem, `oráculo: ancestralidade` | F2 (hoje); M1 DETECTADO hoje; merge manual da iteração 1 | **conforme** |
| 3 | **C1(c)/(d)** `EM VOO` / `ANTERIOR AO PISO` contados, não julgados | F3/F4 (hoje); árvore: `016: EM VOO (fase validate)`; M2 DETECTADO hoje | **conforme** |
| 4 | **C1(e)** `origin/develop` ou `git` ausente ⇒ FAIL `NÃO DETERMINÁVEL`, nunca SKIP | clone hoje: `update-ref -d` ⇒ global + 11/11, `censo pinado: 39 (nao_aplicado)`, exit 1; F22 (hoje); `PATH=""` da iteração 1 (instrumento idêntico) | **conforme** (O6 mantida) |
| 5 | **C1(f)** planning-state sem `branch` ⇒ FAIL de forma, só esse sujeito | F18 (hoje); M23 DETECTADO hoje; o schema agora **exige** `branch` (item 54) | **conforme** |
| 6 | **C1** relato nomeia demanda, fase, oráculo e SHA julgado | gate nu hoje: `origin/develop julgado: 921977c25e76 · data do commit julgado: 2026-09-04`; `CONFORME (fase done) · oráculo: mensagem #NN` | **conforme** |
| 7 | **C2(a)** `feature/NNN-*` após o piso sem estado ⇒ `demanda-fora-da-maquina` | F11; M19 DETECTADO hoje (6 problemas / 5 branches, censo movido para 0) | **conforme** |
| 8 | **C2(b)** merge de demanda com estado não duplica | `_julga_merges` (leitura, idêntico); clone `#99` da iteração 1 | **conforme** |
| 9 | **C2(c)** merge fora de PR após o piso ⇒ FAIL R14; integrações ⇒ `FORA DA POPULAÇÃO` | F13/F14; M4 DETECTADO hoje | **conforme** |
| 10 | **C2(d)** piso ausente/malformado/fora da cadeia ⇒ FAIL | F20/F21; M25 DETECTADO hoje | **conforme** |
| 11 | **C2** critério de população e "N merges anteriores" impressos | gate nu hoje: `população: ^feature/(\d{3})- ∩ planning-state (junção por branch) · piso 921977c2 …` · `até o piso, inclusive: 39 (não julgados)` | **conforme** |
| 12 | **C3(a)** `done` sem artefato e sem exclusão ⇒ FAIL nomeando | F15; M20 DETECTADO hoje (3 problemas / 4 artefatos) | **conforme** |
| 13 | **C3(b)** exclusão obsoleta ⇒ FAIL | F17; M26 DETECTADO hoje | **conforme** |
| 14 | **C3(c)** exclusão sem `fonte` / curinga ⇒ FAIL | F23; M27 DETECTADO hoje | **conforme** |
| 15 | **C3(d)** prova de carga registrada e exclusões impressas; 3ª fonte no audit | M20 = `_meta.prova_de_carga` (hoje); gate imprime as três `EXCLUÍDA R13 … — fonte:`; audit local **e no CI**: `[PASS] fecho.json/excluidas_por_r13: 3 …, todas com fonte` | **conforme** |
| 16 | **C4** válvula válida ⇒ `FECHO PENDENTE DECLARADO`, listada pelo audit | F6; controle `M24/positivo` OK hoje (`censo 15/15`); audit `waivers (tdd_waiver + fecho_pendente)` local e CI | **conforme** |
| 17 | **C4(a)** campo ausente ⇒ FAIL | F8; M7 DETECTADO hoje | **conforme** |
| 18 | **C4(b)** vencida (T4) ⇒ FAIL | F7; M8 e M24 DETECTADOS hoje | **conforme** |
| 19 | **C4(c)** em `done` ⇒ obsoleta | F9; M28 DETECTADO hoje (carrasco permanente) | **conforme** |
| 20 | **C4(d)** não mesclada ⇒ prematura | F10; M21 DETECTADO hoje (`EM VOO [fecho_pendente-prematura] (fase validate)`) **e agora M32** (sujeito sintético 999, à mão e na campanha) — a perda nomeada em J4 tem carrasco permanente | **conforme** (O3 fechada) |
| 21 | **C4(e)** `prazo` fora do formato ⇒ FAIL | **G3 fechado com execução nas duas direções**: F24 (`30/09/2026`) ⇒ `MESCLADA SEM FECHO · mensagem · fecho_pendente-invalida · 1` (sonda hoje); M31 ⇒ **só F24 diverge** (1/35), para `FECHO PENDENTE DECLARADO` — cai em "aceita", não em "vencida" (prazo lexicograficamente maior que a data do commit); **sem F24** (registro de `76fd9dc`) a mesma mutação dá 33 · 0; noop ⇒ 35 · 0 | **conforme** |
| 22 | **C5(a)** `done` + artefatos (ou exclusão) ⇒ `LIBERADO` | P1/P9 (hoje); P11 sob M9 ⇒ `LIBERADO` (a letra da spec, hoje) | **conforme** |
| 23 | **C5(b)** `phase != done` ⇒ FAIL `FECHO PENDENTE … — merge bloqueado até done` | P2/**P11** (hoje); **CI: run `33927191969`, job `fecho`** ⇒ `[FAIL] FECHO PENDENTE da demanda 016-registro-contra-execucao (fase implement) …` · `fase-nao-done` · exit 1; local em HEAD ⇒ `(fase validate)`, exit 1 | **conforme — medido no CI** |
| 24 | **C5(c)** estado ausente ⇒ "demanda fora da máquina" | P3 (hoje); M11 DETECTADO hoje | **conforme** |
| 25 | **C5(d)** `done` com válvula ⇒ FAIL (T5) | P7/P10; M10 DETECTADO hoje | **conforme** |
| 26 | **C5(e)/(f)/(g)** ⇒ `NÃO JULGADO (<motivo>)`, exit 0 | P4/P5/P6 (hoje); clone da iteração 1 (instrumento idêntico) | **conforme** |
| 27 | **C5** ao vivo não aceita `--head`/`--base` | iteração 1 (`exit 2`), gate `check_fecho.py` alterado só na guarda de censo (diff lido) | **conforme** |
| 28 | **C5 lugar** (E1): job próprio `fecho`, sem `needs:`/`if:`, checkout raso, python 3.12, um passo; `verify`/`visual`/`:42` intocados | `git diff 921977c..HEAD -- verify.yml` = só o bloco `fecho:` (14 linhas `+`); **CI: o job `fecho` existe como check próprio**, começou junto dos outros (22:50:54), `fetch-depth: 1`, sem `npm`, fechou em 6 s com a sonda e o FAIL | **conforme — executado no CI** |
| 29 | **C6(a)** conforme ⇒ `PROTEGIDA`, PASS, mecanismo/contextos/`strict` | fixture `esperado_ruleset` (sonda 9 · 0 hoje); **ao vivo pendente de P2** (`DESPROTEGIDA` local e CI) | **conforme por fixture**; verde ao vivo pendente |
| 30 | **C6(b)/(c)** ⇒ `DESPROTEGIDA` nomeando | ao vivo hoje (local) e no CI (tabela); fixtures; M13/M14/M15/M17 DETECTADOS hoje | **conforme** |
| 31 | **C6(d)** `NÃO DETERMINÁVEL` ⇒ `[WARN]` local / `[FAIL]` CI | fixtures `http_403`/`sem_rede` (hoje); M12 DETECTADO hoje; 401 e repo divergente da iteração 1 (instrumento idêntico) | **conforme** |
| 32 | **C6(e)** `strict` sob classic ⇒ `[WARN]` permanente | fixture `classic_on` (hoje) | **conforme** |
| 33 | **C6(f)** demais regras impressas, não julgadas | `outras regras ativas: deletion · non_fast_forward` (local hoje; CI) | **conforme** |
| 34 | **C6** expectativa em dado (`branch_protection.json`) | leitura; arquivo fora do diff desde `76fd9dc` | **conforme** |
| 35 | **C6 lugar** (T8 c): seção do `compliance-audit.sh`, `aviso()`, linha final, exit = FAIL | local `15 · 1 · 0`, exit 1; **CI `compliance: 15 PASS · 1 FAIL · 0 WARN`**, exit 1 | **conforme** (O5) |
| 36 | **C7** sonda antes da árvore; total pinado; `--sonda` em JSON | 35/35 e 9/9 hoje; M16/M22/M29/M30 DETECTADOS hoje (M22 imprime `contagem: 34 fixture(s) · 35 caso(s) · total pinado 35`); **no CI** `[SONDA] fecho: 35 caso(s) … (total pinado: 35)` | **conforme** (a contagem vive no registro — R10 §3; ver G4 para a errata) |
| 37 | **C8** `SKILL.md`/`sdd.md` (P7) | fora do diff desde `76fd9dc`; leitura da iteração 1 | **conforme** |
| 38 | **C9** glossário | `CONTEXT.md` fora do diff; iteração 1 | **conforme** |
| 39 | **C10(a)** dívida "Borda 8" com desfecho anexado | intacta; matriz ganhou a dívida `D016-FEC1/FEC2 · LEITOR QUE PERDE MERGES POSTERIORES AO PISO` (aditiva) | **conforme** |
| 40 | **C10(b)** `EA-33` → `resolvido` | `b4b458a`; `BACKLOG.md:1879` **`resolvido`**; `--rule=backlog` ⇒ 30 abertos, EA-33 fora da lista | **conforme** (era pendente) |
| 41 | **C10(c)** `EA-14` aberto **com nota** | `BACKLOG.md:1052` "Nota do desfecho (demanda 016) — permanece `aberto`" | **conforme** (era pendente) |
| 42 | **C10(d)** `design-decisions.md`: KI-3 atualizada e **nova linha** confirmada com a fonte | `d130a04`: linha KI-3 com a redação original preservada + "Decisão original — registrada aqui e superada —" (o padrão da casa), dizendo que a cobrança do merge "vive na proteção de branch, dado auditável", cita P2, `branch_protection.json → checks_obrigatorios`, `D016-PROT1` e o ADR; ADR 0001 escrito com decisores e portões. A "linha nova" **não é linha própria**: foi dobrada na linha KI-3, e a fonte literal ("portão da Fase 0 da 016, 2026-09-04") está no ADR, não na tabela | **conforme com desvio de forma** (O11) |
| 43 | **T1** oráculos e impressão de qual respondeu | M1 hoje; gate nu hoje (`oráculo: mensagem #NN`) | **conforme** |
| 44 | **T2** piso 40 hex em `fecho.json` | idem; `origin/develop` remoto == piso (`ls-remote` hoje) | **conforme** |
| 45 | **T3** julgador puro + sonda pinada | leitura; item 36; **a guarda de censo estende o desenho ao leitor** (ver G4) | **conforme** |
| 46 | **T4** prazo × data do commit | M8/M24 e `M24/positivo` hoje | **conforme** |
| 47 | **T5** válvula só pós-merge | F10/P7/P10; M10/M21/M28/M32 hoje | **conforme** |
| 48 | **T6** dois endpoints, três vereditos, cadeia de token com fonte impressa | local hoje: `token: gh auth token`; sonda 9 · 0; instrumento fora do diff. **A cadeia está implementada como especificada**; o que o CI lhe oferece é outro item (72) | **conforme** |
| 49 | **T7** política de não-determinabilidade | itens 31/32 | **conforme** |
| 50 | **T8(a)** stage `fecho` no `pipeline.yaml` | `desc` diz **35 casos** e nomeia a guarda de censo; `run.sh` completo 16 stages (`fecho` PASS nas duas execuções) | **conforme** |
| 51 | **T9** intocados | script hoje sobre 77 arquivos: intocados presentes ⇒ **nenhum**; produto ⇒ **nenhum**; spec 013 ⇒ nenhum; `expected_suites.json` sem `d016` (por desenho) | **conforme** |
| 52 | **T10** vocabulário fechado | guardas do gate (leitura); sonda hoje | **conforme** |
| 53 | **§Superfície 1** ordem sonda → leitura → julgamento → relato; **exit 1 sse F > 0**; FAIL de forma aborta só o sujeito; nada escreve | ordem e isolamento ✔ (M23/M27 hoje; porcelain vazio). **"Exit 1 sse F > 0" é falso em HEAD, por desenho ratificado**: sob M33 o gate sai `exit 1` com **`0 problema(s)`** (`fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s) · guarda de censo da leitura: FAIL`) — medido hoje no clone e asserido pelo próprio harness | **GAP G4** (spec-errada) |
| 54 | **§Superfície 4** schema: `branch` em `required`; `fecho_pendente {motivo, dono, prazo, declarado_em?}` com `pattern` | `d130a04`: `required` = `[demanda, phase, spec_dir, branch]`; `fecho_pendente` com `required [motivo, dono, prazo]`, `minLength`, `pattern ^\d{4}-\d{2}-\d{2}$` em `prazo`/`declarado_em`; 11/11 estados passam no `required` (oráculo independente). A "terceira parte" (proibir a chave irmã) **não é exigência**: a spec a exclui em letra (§Superfície 4 e §Fora de escopo) — ver J6 | **conforme** (G1 fechado) |
| 55 | **§Contratos** `fecho_pendente` | idem iteração 1 + schema | **conforme** |
| 56 | **§Contratos** `fecho.json` | todas as chaves da amostra presentes; **aditivos**: `sonda.total: 35` (F24, P11 — regra da Fase 4 reaplicada e declarada em `_meta.acrescimos_da_fase6`), `piso.merges_ate_piso: 39` e `_meta.censo_de_leitura` (a guarda). Nada da amostra foi removido ou mudou de semântica | **conforme** (desvio aditivo declarado; entra na errata de G4 — J7) |
| 57 | **§Contratos** `branch_protection.json` | fora do diff; sonda 9 · 0 | **conforme** |
| 58 | **§Contratos** CLI | itens 27/36 | **conforme** |
| 59 | **§Contratos** harness `d016` | `mutation_map → d016`: **54** targets (+`F24.json`, +`P11.json`, +`999-sintetica-d016.json` — declarado na `_trilha`), `requires [node, python]`, preflight; **33 pares** `D016-*` na matriz, todos `ultima_prova.resultado: KILL`; mecanismo `criar` (âncora = ausência) medido hoje (N8/N11 do §9.5 e M32 à mão) | **conforme** (O2) |
| 60 | **§Arquivos rastreados que mudam** | ✔ todos, inclusive schema, `design-decisions.md`, ADR, `BACKLOG.md`; **repin pendente** para os três da T082 (R8 §1) | agregado — não pontua |
| 61 | **E1** job próprio; três checks; sonda 9; mutante do terceiro contexto | itens 28/34/57; M17 DETECTADO hoje | **conforme** |
| 62 | **E2** prova de carga de C1(a) com piso recuado | M18 hoje (censo movido junto, 15 = 15) | **conforme** |
| 63 | **E3** cadeia first-parent inteira | M19 hoje; `merges_ate_piso` 39 pinado e lido | **conforme** |
| 64 | **§Nascimento sem vermelho crônico** | PROT1 vermelho **local e no CI** pela razão certa; PR1 vermelho **local e no CI** (`fecho`) pela razão certa; nenhum gate nasceu verde sobre `develop` desprotegida. Flips (PROTEGIDA após P2; `LIBERADO` após o `done`) **pendentes** | **conforme ao desenho**; flips pendentes |
| 65 | **§Não mensurável** (1–6) | 1 **segue não medido, e por causa nova**: o passo do CI não oferece `GITHUB_TOKEN` (item 72); 2 medida; 3 **medida no CI** (run citado); 4 pendente de P2; 5 não prometido; 6 feita | **declarado** — não pontua |
| 66 | **§Fora de escopo** (negativos) | item 51; nenhum `reconcile`/recibo; `state-eval.sh` intocado; chave irmã intocada (3/11 medidos) | **conforme** |
| 67 | **Cross-check R6** | 77 arquivos × `boundary.json`: única colisão `pins.json` (`registry`), só por `gen_pins — repin R1a…R7` | **conforme** |
| 68 | **R10 §7/§8/§9/§10** | `subprocess.run(["git", *args])` (`fecho.py:443-446`); porcelain vazio após pipeline, stage e campanha; stage no pipeline; varredura ET4 da iteração 1 (arquivos idênticos) | **conforme** |
| 69 | **R7** | gate puro + `LÊ O MUNDO` na primeira linha (hoje) | **conforme** |
| 70 | **R9** | 562 · 536 · 344 · 314 linhas | **conforme** |
| **71** | **E1 (iv) / §Superfície 2 (borda 6)**: *"o vermelho até o `done` vive no check `fecho`; o `verify` fica verde"*; *"O check `verify` (pipeline `run.sh` + `compliance-audit`) … continuam verdes"* | **Falsificado por execução**: run `33927191969`, job `verify` = `FAILURE` com `verify: 16 PASS · 0 FAIL` no pipeline e `[FAIL] branch-protection` no `compliance-audit` — que a própria spec põe dentro do job `verify` (T8 c, `verify.yml:43-44`) e declara vermelho até P2 (§Nascimento). As duas frases da spec são **conjuntamente insatisfazíveis até P2** | **GAP G5** (spec-errada) |
| **72** | **T6 / §Superfície 3 / §Não mensurável 1**: no CI o gate lê com **`GITHUB_TOKEN`** (amostra de PASS: `· token: GITHUB_TOKEN`); a permissão dele é medida no primeiro run | `verify.yml` **não exporta `GITHUB_TOKEN`** ao passo da auditoria (nenhum `env:` no passo nem no job; `GITHUB_TOKEN` não é variável automática do Actions) e `gh auth token` num runner sem `GH_TOKEN` falha ⇒ a cadeia cai em **`nenhum (anônimo)`** (`branch_protection.py:257-268`). O run leu o ruleset **anonimamente** (repositório público; medido daqui: 200 sem token, limite **60/h por IP**). Consequências: a medição prometida nunca acontece por esta via; o CI fica exposto ao limite anônimo compartilhado pelos runners ⇒ `NÃO DETERMINÁVEL (permissão 403)` ⇒ `[FAIL]` (T7) sem diff — um vermelho inexplicado, que **é** o mecanismo do `E5` | **GAP G6** (implementação-divergente) |

## Score

- Itens pontuáveis: **70** (72 linhas − 2 agregados/declarações [60, 65]; os
  dois pendentes da iteração 1 [40, 41] fecharam e pontuam).
- **Conformes: 67 · Gaps: 3** — **G4** e **G5** `spec-errada`, **G6**
  `implementação-divergente`; nenhum `faltando`.
- **Score: 67 / 70 = 95,7 %.** G1, G2 e G3 estão **fechados com execução**; os
  três gaps desta iteração são **novos**, e dois deles só a execução do CI
  tornou visíveis.
- **Consequência pelo procedimento** (skill `spec-validate`): esta é a **2ª de
  2** iterações e o score é < 100 % ⇒ **escala ao usuário com o quadro
  completo** — o que coincide com o dono natural das decisões: G4 e G5 são
  erratas de spec (R4), G6 é uma linha de workflow do `build-engineer` mais um
  run.
- O que o score **não** diz e este documento diz: (i) o achado **A1** (campanha
  `d016` 20/33 no job `visual`) não é item da spec — a spec situa a campanha
  "nesta máquina" e no job `verify`, onde ela é 33/33 — mas **bloqueia o merge
  sob P2** e precisa de diagnóstico antes de qualquer `done`; (ii) o `baseline`
  reprova em HEAD até o repin dos três arquivos da T082; (iii) P2 continua não
  feita.

## Gaps desta iteração — classificados, com a direção que recomendo

### G4 · **spec-errada** — §Superfície 1 diz "exit 1 sse F > 0"; a guarda de censo, ratificada, sai exit 1 com F = 0

A iteração 1 (J1) mediu que um leitor mudo deixava a árvore verde por vácuo e
levou o censo pinado como **candidata** — "R10 §1 ao contrário: fortalecer por
conta própria é tão errado quanto afrouxar". A iteração de correção a
implementou (`9fe57f0`: `fecho.json → piso.merges_ate_piso = 39`,
`check_fecho.py:censo_da_leitura`, `D016-M33`), e o `product-owner` a
**ratificou** no aceite ("dá dentes ao gate nu por si — além do que J1 pedia").
Hoje medi as duas direções: sob M33, gate novo ⇒ `exit 1 · 0 problema(s) ·
censo divergente`; gate de `76fd9dc` ⇒ `exit 0 · 0 problema(s)`. A guarda é
correta e fica. **O que ficou errado é a spec**: §Superfície 1 promete `Exit 1
sse F > 0` e uma saída sem a linha de censo; §Contratos descreve `piso {sha,
descricao}` e `sonda.total: 26`; T3 diz que o desenho "sonda + contagem pinada"
vale para o julgador — o leitor não é mencionado. Um leitor da spec que veja
`fecho: … 0 problema(s) · guarda de censo da leitura: FAIL` com exit 1 acha a
spec contradizendo o gate: é a divergência que "engana o leitor da spec".

**Direção**: errata **aditiva**, doc-only, aprovada pelo usuário — (a)
§Superfície 1: exit 1 sse `F > 0` **ou** censo da leitura divergente/não
pinado; linha `[INFO] … · censo pinado: N (estado)` e `[FAIL] guarda de censo
da leitura: …`; (b) §Contratos `fecho.json`: `piso.merges_ate_piso` (censo
imutável, medido por dois oráculos, pinado e nunca calibrado) e
`_meta.censo_de_leitura`; `sonda.total` passa a citar o registro como fonte
(R10 §3) e a regra "aditivo, ids permanentes" vale também para iterações da
Fase 6 (F24, P11); (c) T3/C7: a contagem pinada aplica-se ao **leitor** via
censo, com o limite declarado (merges posteriores ao piso — dívida na matriz);
(d) §Contratos harness: famílias `criar` (M32) e "leitor" (M33). **Nunca** a
alternativa de remover a guarda para devolver o "sse" — seria R10 §1.

### G5 · **spec-errada** — "o `verify` fica verde" é falso até P2, e a própria spec o torna falso

O orquestrador decidiu **não expandir escopo** e registrar a conflação como
achado (**EA-36**, `b4b458a`). **A decisão sobre o código está certa**: mover
`D016-PROT1` para outro job é desenho de CI, não remendo de Fase 6; e o vermelho
de PROT1 é transiente (dono, evento único, prazo) — não é o `E5`. **Mas a spec
continua afirmando uma frase que o run falsificou**: E1 (iv) *"o `verify` fica
verde"* e §Superfície 2 *"O check `verify` (pipeline `run.sh` +
`compliance-audit`) … continuam verdes"* — escritas com o `compliance-audit`
**dentro** da frase — enquanto T8 (c) põe PROT1 no `compliance-audit` do job
`verify` e §Nascimento o declara vermelho até P2. No intervalo pré-P2 as duas
exigências são conjuntamente insatisfazíveis; no run `33927191969` o `verify`
saiu `FAILURE` com o pipeline `16 PASS · 0 FAIL`. "Transiente" descreve o
código; não licencia a spec a manter a frase. **Classe: spec-errada** — a
exigência foi formulada sem considerar T8 (c) × §Nascimento.

**Direção**: errata doc-only, aprovada pelo usuário — E1 (iv) e §Superfície 2
passam a: *"até P2, o check `verify` fica vermelho pelo `compliance-audit`
(`D016-PROT1`, §Nascimento) — custo de nascimento, único, lido pela razão;
depois de P2, `verify` volta a significar 'o código está são'"*, com remissão
a **EA-36** para a separação estrutural. Nenhum código muda; nenhum escopo se
expande. Recomendação ao `tech-lead`, fora desta demanda: a forma barata da
separação é mover a seção `branch-protection` para o job **`fecho`** (que já
significa "promessas do processo", não "código são").

### G6 · **implementação-divergente** — o CI nunca oferece `GITHUB_TOKEN` ao gate; a leitura foi anônima

T6 fixa a cadeia `GITHUB_TOKEN (CI) → gh auth token (rito local) → sem token` e
§Não mensurável 1 promete medir a permissão do token de Actions "no primeiro
run do PR". O primeiro run aconteceu e **não mediu nada**: `GITHUB_TOKEN` não é
variável de ambiente automática do Actions — só existe se o passo a exportar
(`env: GITHUB_TOKEN: ${{ github.token }}`) — e `verify.yml` não o faz (passo
`compliance-audit.sh`, sem `env:`; a tabela de arquivos da spec até diz "job
`verify` intocado"). `gh auth token` num runner sem `GH_TOKEN` falha; a cadeia
termina em `nenhum (anônimo)` e o ruleset foi lido porque o repositório é
público (medido daqui: 200 sem token, `X-RateLimit-Limit: 60`). A saída do
audit não imprime a fonte do token no FAIL (só na linha de PASS), então o log
não denuncia. Duas consequências reais: a medição de T6 fica impossível por
esta via; e o CI passa a depender do limite anônimo de **60 chamadas/h por
IP**, compartilhado entre runners do GitHub — um 403 vira `NÃO DETERMINÁVEL
(permissão 403)` ⇒ `[FAIL]` (T7) sem diff nenhum, o vermelho inexplicado que a
spec cita como `E5`.

**Direção**: `build-engineer` — `env: GITHUB_TOKEN: ${{ github.token }}` no
passo da auditoria em `verify.yml` (uma linha; a errata de G4/G5 acrescenta à
tabela de arquivos "passo do audit ganha `env`" para que "job `verify`
intocado" continue verdadeiro no que importa); no run seguinte, ler
`token: GITHUB_TOKEN` e o veredito — **isso** é a medição de §Não mensurável 1,
citada por número no `relatorio-final.md` (T043). Observação (O12): o
`compliance-audit` deveria imprimir a fonte do token também no FAIL/WARN — hoje
só a linha de PASS a carrega.

### Uma nota sobre a numeração da errata

A próxima errata da spec seria "E5" — o **mesmo id** do achado histórico `E5`
que a E4 acabou de desambiguar de `EA-5`. Quem escrever a errata decide a forma;
recomendo que o título diga a que namespace pertence (errata da spec 016), para
a confusão não renascer no arquivo que a corrigiu.

**Forma adotada (2026-09-04)**: prefixo da demanda, na forma dos ids `D016-*` —
**`E016-5`** (G4), **`E016-6`** (G5) e **`E016-7`** (T9 · eco do controle, A1);
E1–E4 mantêm os ids com que já foram citadas.

## Achado A1 — a campanha `d016` no job `visual`: 20/33, baseline do gate nu vermelho, causa não isolada

**O fato** (log do job `101198163861`): depois de todas as suítes visuais
passarem, o passo pré-existente "Campanhas de mutação com Chromium"
(`check_mutation.py` sem `MUTATION_DEFER_MISSING`, `verify.yml`) reexecutou a
`d016` — a campanha é exigida porque seus targets mudaram, e o passo roda toda
campanha exigida cujo ambiente exista, com ou sem Chromium. O harness emitiu
**13 × `NÃO EXECUTADO · baseline do gate nu VERMELHO`**: exatamente os
mutantes de modo `ARVORE` (M18–M28, M32, M33); os 20 de sonda (M1–M17, M29–M31)
foram `DETECTADO`.

**O que isso isola** (pelo código do harness, `tests_016_mutants.js`, laço
principal): só os mutantes `ARVORE` são gateados pelo controle `C0-fecho`, que
roda `check_fecho.py --json` **antes** de qualquer mutação e exige `rc 0 · exit
0 · sonda ok · 0 problema(s) · censo ok`. Os mutantes de sonda **não têm** gate
de baseline e mataram cada um pelo seu caso — ~~logo a **sonda** estava sã naquele
ambiente; o que falhou foi a **metade de árvore** do gate nu (problemas ≠ 0, ou
censo ≠ ok, ou exit ≠ 0, ou erro de leitura)~~.

> **[REFUTADO por medição — 2026-09-04, R2 §5: riscado, não apagado.]** A
> inferência é **falsa**. `julgaSonda` (`tests_016_mutants.js`, julgadores do
> KILL) exige que os casos nomeados em `espera.divergem` divirjam e que
> `ok === false`; **não pina isolamento** — não exige que os demais casos
> estejam verdes nem que a `guarda` da sonda esteja vazia (só `julgaArvore`
> pina isolamento). Medido em clone efêmero de `9a460f5` (`origin/develop` =
> `921977c`) com uma fixture extra, `F99.json`, que derruba a **sonda** por
> guarda ("fixture sem caso no registro"): `C0-fecho` **FALHOU** com
> `vivo: null` — e **`D016-M1` saiu DETECTADO** (`divergentes: F1,F4,F5,…
> (13/35)`). Logo 20 KILL de sonda sob C0 vermelho **não provam** que a sonda
> estava sã: a falha do run pode estar em **qualquer das duas metades** — sonda
> (fixture, registro, instrumento) ou árvore (problemas ≠ 0, censo ≠ ok,
> exit ≠ 0, erro de leitura). O que localiza a metade é a **nota do controle**,
> que o instrumento passou a carregar no mesmo dia (spec, errata **E016-7**;
> `prova-de-carga.md` §10).

**O que está descartado**: (a) o código em HEAD — o mesmo commit fecha 33/33 na
worktree (stage isolado, árvore limpa) e no clone efêmero, **ambos lidos na
saída**; ~~e 33/33 no job `verify` (stage `mutation` dentro do `run.sh`, `16
PASS`)~~ **[CORRIGIDO 2026-09-04: no job `verify` é DEDUÇÃO, não leitura]** — o
log daquele job mostra **só** `[PASS] mutation` (`run.sh` ecoa o stdout de um
stage apenas no FAIL, `run.sh:66-69`); nenhuma linha `[RUN] d016`, `33/33` ou
`controles: 3 ok` está no log. A cadeia que sustenta a dedução, cada elo
verificável no código: `[PASS]` ⇒ `check_mutation.py` saiu 0 ⇒ `fails == 0` ⇒
nenhuma campanha executada com exit ≠ 0 sem perdão vivo (`known_issues.issues`
está vazio); a `d016` **foi** executada nesse job — mesmo merge-base e mesmos
targets mudados que fizeram o job `visual` imprimir `[RUN] d016`, `requires
[node, python]` presentes no job `verify`, logo nem `[OK] nenhum alvo mudou`
nem `[DEFER]` —; e o harness só sai 0 com `D === SELECTED.length && CFALHOU
=== 0` (`tests_016_mutants.js`, `fechar()`), isto é, 33/33 **e** 3 controles
OK. Dedução válida; **dita como dedução**, porque nenhuma linha do log a
mostra; (b) as suítes escreverem nas
entradas do gate — toda escrita das suítes Chromium vai para `os.tmpdir()`,
para `docs_phase5/evidence_*` (ignorados ou restaurados por `git checkout --
docs_phase5/`) ou para `visual_evidence/`/`print_evidence/`/`test-results/`
(ignorados); nenhuma toca `specs/`, `.claude/project-memory/` nem
`.claude/verify/`; (c) `999-sintetica-d016.json` pré-existente — o preflight de
M32 deu `ocorrencias == 1` (o arquivo **não** existia); (d) árvore suja — o
`check_mutation.py` recusa árvore suja antes do `[RUN]`, e o `[RUN]` aconteceu.

**O que NÃO está isolado, e por quê**: a razão exata. O harness a imprime
(`CONTROLE C0-fecho … resultado: FALHOU · …`), mas `check_mutation.py` captura
o stdout e ecoa só as **duas últimas linhas** mais o bloco de não-KILL — e a
`nota` dos não-KILL por baseline é uma **string constante** ("baseline do gate
nu VERMELHO — kill não atribuível ao mutante"), que não carrega o motivo. É a
lição E13 da 014 outra vez, agora no controle e não no mutante. Candidatas que
o log não permite distinguir: falha transitória de `git` naquele runner após
oito minutos de Chromium (o `protegido()` do gate converteria em
`erro_de_leitura` ⇒ `contagens` vazio ⇒ baseline vermelho), ou um estado de
árvore que eu não vejo daqui. Não atribuo causa sem a linha (R2 §3).

**Direção** (nada disto é desta validação, que é somente leitura):

1. **Instrumento primeiro** — `qa-engineer` (dono do harness): a `nota` do
   `NÃO EXECUTADO` por baseline passa a carregar o `resultado:` do controle
   (`exit`, `problemas`, `censo`, `erro_de_leitura`, primeira linha do stderr).
   O bloco de não-KILL do `check_mutation.py` — ~~intocado, T9~~ — já repete a
   `nota` "nas palavras do harness": é o único canal que sobrevive à truncagem,
   e foi desenhado para isso. **[FEITO em 2026-09-04 — errata E016-7]**: a nota
   passou a carregar `controle <id> · resultado: FALHOU · <nota>` (metade que
   falhou nomeada, sem `undefined`), **e** o `check_mutation.py` passou a ecoar
   os próprios blocos `CONTROLE … resultado:` (T9 emendado; relato, não
   veredito). Prova em `prova-de-carga.md` §10.
2. **Reexecução** — `build-engineer`: push do HEAD e novo run; se o vermelho se
   repetir, o log passa a dizer por quê. Alternativa mais barata para um único
   run diagnóstico: um passo `python .claude/verify/check_fecho.py` (prosa)
   imediatamente antes do passo das campanhas no job `visual`.
3. **Até lá**: o registro não pode dizer "campanha `d016` 33/33 no CI" — diz
   33/33 no job `verify` e **20/33 no job `visual`**, como o `relatorio-final.md`
   já diz. Sob P2, o merge espera o `visual` verde: A1 é **condição do merge**.

## Julgamentos pedidos pelo orquestrador — com a execução, não com o argumento

### J6 · A recusa do `data-engineer` (terceira parte de G1) **fecha o gap; não o converte em outra classe**

Três razões, todas verificadas: (1) **a spec não pede** a proibição — §Superfície
4: *"A chave irmã `validacao`/`implementacao` (010, 015, 011) **não** é proibida
nesta demanda — §Fora de escopo"*; §Fora de escopo: *"não ganha gate aqui para
a spec não prometer duas coisas"*. G1 pedia as duas partes que a spec pede, e
elas estão em `d130a04`. (2) **A medição é reprodutível**: refiz por script —
`additionalProperties: false` reprovaria 5/11 (010, 011, 014, 015, **016** — o
próprio planning-state desta demanda, por `portao_fase0`/`achado_real`/
`autorizacao`/`ideia_para_a_spec`); a forma nominal reprovaria 3/11 (010, 011,
015). A ressalva do PO ("a medição não está em arquivo nenhum") está atendida:
o `relatorio-final.md:156` a registra, e este documento a reproduz. (3)
**Schema sem leitor** é fato declarado pela própria spec (`check_state.py` não
valida por biblioteca); proibir ali criaria um registro que promete e ninguém
cobra — a família que esta demanda combate. O caminho honesto já está nomeado
na spec: `chore` do `data-engineer` que normaliza os três estados **e** fecha o
schema no mesmo commit, com leitor. **Item 54: conforme.** O que fica como
observação (O13): as novas cláusulas do schema (`required: branch`, `pattern`
do prazo) são **contrato sem executor** — quem as cobra em runtime é
`check_fecho.py` (C1 f, C4 e), exatamente como a spec desenhou.

### J7 · Itens 36/56/59 — errata aditiva, **sim**, mas não pela contagem

A contagem (33 → 35) e os targets (51 → 54) são **conformes sem errata** pelas
mesmas razões de J2 da iteração 1: a spec põe a contagem no registro (R10 §3),
autoriza o acréscimo sem renumerar, e `fecho.json → _meta.acrescimos_da_fase6`
declara a regra reaplicada. O que **exige** errata é o que veio junto: a
**guarda de censo** muda uma frase normativa de §Superfície 1 ("exit 1 sse F >
0") e acrescenta ao contrato de `fecho.json` uma chave com semântica nova
(`piso.merges_ate_piso`, pinado e asserido). Isso é **G4** — e a errata de G4
é o lugar para registrar também 35/F24/P11 e 54/`criar`, de uma vez, para que
a amostra da spec pare de ser "prosa histórica" em três lugares ao mesmo
tempo. Uma errata, aditiva, nada enfraquece.

### J8 · A decisão sobre `PROT1` dentro do `verify`: **conformidade da implementação, gap da spec** (G5)

Já dito em G5; aqui só o que o orquestrador perguntou em forma de sim/não:
*conformidade ou gap?* — **as duas coisas, em objetos diferentes**. A
implementação está conforme a T8 (c) e ao §Nascimento (PROT1 vive no audit, o
audit vive no `verify`, PROT1 é vermelho até P2). A **spec** está em gap
consigo mesma: E1 (iv) e §Superfície 2 prometem o que T8 (c) × §Nascimento
impedem no intervalo pré-P2, e o run mediu. Classe **spec-errada**; remédio
doc-only; **EA-36** (já aberto) é o encaminhamento estrutural, e concordo que
não seja escopo desta demanda. O que **não** aceito é a frase ficar como está
com o run citado ao lado: registro que a execução contradiz.

### J9 · O que só o CI fecha — e o que o run de hoje já fechou

| item | o que o CI já mediu (run `33927191969`) | o que ainda depende de run |
|---|---|---|
| 23 (C5 b) | red do check `fecho` com `fase-nao-done` | — |
| 28 (C5 lugar) | job próprio, raso, sem `npm`, sem `needs:`/`if:` (rodou junto e primeiro) | — |
| 64 (§Nascimento) | PR1 e PROT1 vermelhos no CI pela razão certa | os **flips**: `LIBERADO` após o `done` (T084) e `PROTEGIDA` após P2, cada um num run citado por número (condições 1 e 2 do aceite do PO) |
| 29 (C6 a) | — | `PROTEGIDA` ao vivo: **só P2** produz o estado; nenhum run o antecipa |
| 72 (G6) / §Não mensurável 1 | leitura **anônima** do ruleset (200) | `token: GITHUB_TOKEN` + veredito, depois da linha `env:` (T043) |
| A1 | 20/33 no `visual` | reexecução com o instrumento dizendo a razão |
| 35 (audit no CI) | `compliance: 15 PASS · 1 FAIL · 0 WARN` | `15 PASS · 0 FAIL` só depois de P2 |

## Observações — o que não virou gap, e por quê

- **O1–O10** da iteração 1: mantidas, exceto **O3** (M21 perde C4 d) e **O4**
  (M9 mata pelo código) — **fechadas** por M32 e P11, medidos hoje; **O7** (ADR
  sem decisão) — fechada: ADR 0001 entregue.
- **O11** · C10(d): a "nova linha confirmada" foi dobrada na linha KI-3 no padrão
  "Decisão original — registrada aqui e superada"; a substância (cobrança na
  proteção de branch, auditada por `D016-PROT1`, P2, ADR) está lá; a fonte
  literal do portão está no ADR. R13 é servido por `grep`; é menos servido pela
  coluna "Tema". Recomendação opcional ao `doc-writer`: partir em duas linhas
  no próximo commit que já exija repin (há um pendente) — não bloqueia.
- **O12** · O `compliance-audit` imprime a fonte do token só na linha de PASS
  (`compliance-audit.sh:95-125`); no FAIL/WARN o log do CI não diz com que
  credencial leu. Cosmético até G6; depois de G6, é o que prova a medição.
- **O13** · Schema com cláusulas novas e sem executor — J6; declarado pela
  spec; a cobrança em runtime é do stage `fecho`.
- **O14** · `run.sh` truncou a razão do `[FAIL] mutation` (30 linhas, EA-15) e o
  `check_mutation.py` descarta a linha do controle (E13): duas truncagens, uma
  em cada camada, e nas duas o remédio foi reexecutar isoladamente. A1 é o custo
  concreto da segunda.
- **O15** · O HEAD do CI imprime `(fase implement)` e o HEAD local `(fase
  validate)`: mesma alínea, mesmo código; o registro diz a verdade em HEAD e
  ainda não foi enviado.
- **O16** · Agentes em paralelo na mesma worktree: a T082 gravou três arquivos
  durante minha primeira execução completa; o stage `mutation` recusou a árvore
  e o pipeline saiu 15/1 sem dizer por quê. A regra nova de `orchestration.md`
  (§Anti-patterns, `8a2be5a`) trata do `git add -A`; o efeito colateral sobre
  quem **verifica** na mesma árvore fica registrado aqui.

## Estado da Fase 6, hoje

| condição do `done`/merge | estado | quem fecha |
|---|---|---|
| Pipeline completo em HEAD | **15 PASS · 1 FAIL** — só `baseline` (repin dos três arquivos da T082, R8 §1); em `ebe0b22` o CI deu **16 PASS · 0 FAIL** | orquestrador (`gen_pins.py`) |
| Campanha `d016` | **33/33 · 3 controles** (stage isolado, clone, job `verify`); **20/33 no job `visual`** (A1) | `qa-engineer` (nota do harness) + `build-engineer` (run) |
| Regressão congelada | 19 suítes + session no canônico (`suites`/`suites-heavy` PASS nas duas execuções) | — |
| `spec-validate.md` | **este arquivo — iteração 2, 67/70, 3 gaps (2 spec-errada, 1 implementação-divergente)** | usuário (erratas G4/G5) · `build-engineer` (G6) |
| `relatorio-final.md` + `BACKLOG.md` | **existem** (`643daa4`, `b4b458a`): EA-33 `resolvido`, nota em EA-14, EA-36/EA-37 abertos; runs citados; A1 registrado sem diagnóstico | atualizar após os runs (flips, token) |
| Regra da trilha em `orchestration.md` | **entrou** (`8a2be5a`, §Anti-patterns) — condição 5 do aceite do PO | — |
| PR #40 | **aberto**, head `ebe0b22`; HEAD local 4 commits à frente, não enviado | `build-engineer` (push após repin) |
| **P2** (ruleset: `verify`, `visual`, `fecho` + up-to-date) | **não feita** — `DESPROTEGIDA` local e no CI | **usuário** (T050) |
| `GITHUB_TOKEN` no passo do audit | **ausente** (G6) | `build-engineer` |
| Aceite de intenção | "não encontrei objeção", **condicionado** a cinco condições: 3 e 5 cumpridas; 1, 2 e 4 dependem de P2/run/`done` | `product-owner` revalida quando as condições fecharem |

Pela spec (§Nascimento), **sem P2 o PR não deve ser mesclado**; sob P2, **sem
`visual` verde ele não pode** (A1). A ordem que fecha: repin → push → run com o
instrumento de A1 dizendo a razão → G6 (uma linha) → erratas G4/G5 (usuário) →
P2 → `done` → runs dos flips → `relatorio-final` atualizado → aceite.

## Encaminhamento

1. **Ao usuário** (escalada da skill, 2ª iteração < 100 %): aprovar ou negar a
   errata aditiva de **G4** (guarda de censo, `merges_ate_piso`, 35 casos,
   `criar`/leitor) e a errata doc-only de **G5** ("verify verde" ⇒ "até P2,
   vermelho por PROT1; EA-36"); executar **P2** no ruleset.
2. **`build-engineer`**: `env: GITHUB_TOKEN: ${{ github.token }}` no passo do
   audit (G6); repin dos três arquivos da T082 (rótulo novo — a colisão de "R7"
   está na §Série de repins do relatório); push; ler no run seguinte `token:
   GITHUB_TOKEN`, o veredito de PROT1 e o `visual`.
3. **`qa-engineer`** (fora desta validação, commit próprio): a `nota` do
   `NÃO EXECUTADO` por baseline carrega o `resultado:` do controle (A1, passo 1);
   depois do run, o diagnóstico de A1 com a linha em mãos.
4. **`doc-writer`** (opcional, com o repin pendente): O11 — partir a linha de
   C10(d) em duas; **O12** ao `qa-engineer` como fix-finding do audit.
5. **`tech-lead`** (fora da demanda): EA-36 — a forma barata é `branch-protection`
   no job `fecho`; J5 da iteração 1 (visibilidade local do audit) segue como
   candidata.
6. Reler este documento quando existirem os runs dos flips: itens 29 e 64 mudam
   de prova, 72 fecha com a fonte do token impressa, e A1 ganha causa.
