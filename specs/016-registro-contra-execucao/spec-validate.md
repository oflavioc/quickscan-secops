# Spec-validate — 016-registro-contra-execucao

> Fase 6 · T080 · `qa-engineer` · 2026-09-04 · **somente leitura**, iteração
> **1 de 2**. Valida a [spec.md](spec.md) aprovada — **com E1, E2 e E3
> incorporadas** (e as ET1–ET4 do `tasks.md`, que a E3 absorveu) — contra a
> implementação **real** (source + execução, R2), no HEAD `76fd9dc`, worktree
> `phase5-014`, branch `feature/016-registro-contra-execucao`, árvore limpa
> (`git status --porcelain` vazio antes e depois de toda execução).
> **Este registro não emite veredito de aceite**: cada linha cita o que foi
> executado ou lido. Gap de classe `spec-errada` é decisão do usuário (R4).
>
> **Duas coisas que o leitor precisa saber antes da tabela**, porque mudam o
> peso de tudo que diz "ao vivo":
>
> 1. **A branch nunca foi enviada ao remoto.** `git ls-remote --heads origin`
>    devolve só `develop` e `feature/007-…`; `gh pr list --head
>    feature/016-registro-contra-execucao --state all` ⇒ `[]`; `gh run list
>    --branch …` ⇒ `[]`; o planning-state não tem `pr_url`; `git status -sb`
>    ⇒ `[ahead 33]` sem upstream. As tarefas **T041** (push + PR + primeiro
>    run), **T043** (segundo run, medição do `GITHUB_TOKEN`) e **T063**
>    (campanha `d016` no CI) **não aconteceram**. Todo "vermelho ao vivo" deste
>    documento é **local**; o job `fecho` e a seção `branch-protection` **nunca
>    rodaram no CI** para esta branch.
> 2. **A pré-condição de T080 não está cumprida** (T050/P2: `branch-protection`
>    ⇒ `PROTEGIDA`). A `tasks.md` manda PARAR; prossegui **por instrução
>    explícita do orquestrador** ("dois vermelhos são esperados e corretos"),
>    e registro a consequência: este documento **não fecha a Fase 6** — ele
>    mede o que é mensurável hoje e nomeia o que só P2 e o PR podem fechar.

## Os dois vermelhos — lidos pela razão, não pela cor

Lição da trilha do commit `541771a`: a seção `branch-protection` já nasceu uma
vez vermelha **pela razão errada** (`JSONDecodeError` incondicional, heredoc ×
pipe) e passaria por vermelho certo. Por isso cada vermelho abaixo tem a razão
obtida, a razão parecida que seria defeito, e a classe.

| vermelho | onde medi | razão obtida (literal) | razões parecidas que seriam DEFEITO — nenhuma ocorreu | classe |
|---|---|---|---|---|
| `compliance-audit.sh` → seção `branch-protection` | `bash .claude/verify/compliance-audit.sh` (15 PASS · **1 FAIL** · 0 WARN, exit 1); `--rule=branch-protection` (0 · 1 · 0); gate ao vivo `check_branch_protection.py` com `token: gh auth token` | `develop DESPROTEGIDA · faltam: fecho, verify, visual (checks obrigatórios), up-to-date · mecanismo lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false`; sonda **9 · 0**; `outras regras ativas: deletion · non_fast_forward` | `JSONDecodeError`/"não devolveu JSON válido" (a forma de `541771a`) · `sonda D016-PROT1 não bateu` (C7) · `NÃO DETERMINÁVEL` com token válido (rede/permissão/repo) · `severidade fora do vocabulário` · saída inesperada do parser | **desenho** (spec §Nascimento): dono = proprietário, evento único = P2 (T050), fecha antes do merge. Seria defeito se qualquer coluna anterior aparecesse |
| job `fecho` (check pré-merge) | **local**: `GITHUB_HEAD_REF=feature/016-registro-contra-execucao GITHUB_BASE_REF=develop python .claude/verify/check_fecho.py --pr` (worktree e clone), exit 1. **No CI: não medido — não há PR nem run** | `[FAIL] FECHO PENDENTE da demanda 016-registro-contra-execucao (fase implement) — merge bloqueado até done` · `fecho --pr: FECHO PENDENTE · fase-nao-done`; sonda **33 · 0** | código `demanda-fora-da-maquina` (junção por `branch` quebrada) · `artefato-ausente` (fase ignorada) · sonda divergindo (instrumento) · `NÃO JULGADO` (população/base errada) · exit 0 | **desenho** (borda 6, C5 b): é o gate medindo a própria demanda antes do `done`. Seria defeito se o código fosse outro ou se `chore/x` também saísse vermelho (mediu `NÃO JULGADO`, abaixo) |

## Método

- **Exigências extraídas da `spec.md`**: C1–C10 alínea por alínea (tabela
  §Critérios), as decisões T1–T10, as Superfícies 1–5, os Contratos, as três
  erratas, §Nascimento, §Não mensurável, os negativos de §Fora de escopo e o
  cross-check R6/R7/R9/R10.
- **Execuções desta validação** (todas 2026-09-04, HEAD `76fd9dc`):
  - `MUTATION_DEFER_MISSING=1 bash .claude/verify/run.sh` **completo** →
    **16 PASS · 0 FAIL** (18:38–18:43; `.last_green` gravado). Stage a stage,
    reexecutado para capturar as contagens que o `run.sh` só imprime em FAIL:
    `env-doctor` 0 FAIL · 1 WARN (Chromium ausente, nomeado) · `baseline`
    **446/446 · 0 divergentes · 0 sem pin** · `boundary` 9/9 · `marker-lint`
    38 · 0 · `icons-check` OK (26 assets) · `build` byte-idêntico
    `5c6904edfe19c72e…` · `lint-arch` 0 (16 bridges) · `regra-morta` **7 PASS ·
    0 FAIL** · `state` 11 · 0 · `tdd` 11 demandas · 0 waivers · 0 problemas ·
    **`fecho`** 11 demandas · 0 válvulas · **0 problemas** (sonda 33 · 0) ·
    `m41` PASS + payload `9794b267e4225d8f…` == pin declarado · **`suites`**
    19/19 canônicas, 0 problemas — engine 105 · ui31 19 · ui32 25 · ui33 11 ·
    ui332 23 · ui333 26 · ux41 56 · target 30 · ref 28 · journey 31 · icons46
    12 · unset 12 · p50core 64 · p52layout 45 · d009 15 · d011 6 · d010 13 ·
    d014 7 · d015 5 (todas · 0 FAIL) · `suites-heavy` session **97 · 0** ·
    `evidence-bridge` 0 FAIL · 0 WARN.
  - **Stage `mutation`** (`check_mutation.py`, árvore limpa): integridade 0
    problema(s) (IC-1 e IC-4 verdes; `IC-4: d016: 30 âncora(s) com ocorrencias
    == 1`); só `d016` exigida (as outras dez: "nenhum alvo mudou"); **`D016
    MUTATION: 30/30 mutantes detectados pelo gate e motivo esperados ·
    controles: 3 ok · 0 falho(s)` · não-KILL: nenhum** · `mutation: 1
    campanha(s) executada(s) · 0 problema(s)`; `node tests_016_mutants.js
    --preflight` ⇒ todas as âncoras com `ocorrencias == 1`. Campanha integral
    também executada num **clone byte-idêntico** (mesmo HEAD): 30/30 ·
    3 controles ok; as linhas de M18 (`015 · MESCLADA SEM FECHO · #34 · 1
    problema`), M19 (`6 problema(s)`, #15/#14/#12/#11/#10/#9), M20
    (`3 problema(s)`: 003 #13 · 009 #24 · 010 #31, `artefato-ausente`) e M24
    (`fecho_pendente-vencida`) **reproduzem** `fecho.json →
    _meta.prova_de_carga` — nada ajustado.
  - `compliance-audit.sh`: **15 PASS · 1 FAIL · 0 WARN** (tabela acima);
    `known-issues` lista `fecho.json/excluidas_por_r13: 3 exceção(ões)
    estrutural(is), todas com fonte` (3ª fonte); `waivers (tdd_waiver +
    fecho_pendente): nenhum ativo`; `backlog`: 29 abertos, EA-33 e EA-14 entre
    eles.
  - **Bateria em clone efêmero** (scratchpad, `git clone` local, HEAD
    `76fd9dc`, `refs/remotes/origin/develop` fixado em `921977c`; nada tocou a
    worktree): controles verdes; C5(a)(a′)(c)(e)(f)(g) ao vivo por env; CLI
    (`--head` ⇒ exit 2; `--fixture` sob `GITHUB_ACTIONS` ⇒ exit 2); chaves do
    JSON de `--sonda`; varredura ET4 (`grep -nwE` ⇒ 0); C6(d) `GITHUB_TOKEN=
    invalido` ⇒ `[WARN] NÃO DETERMINÁVEL (permissão 401: Bad credentials)` local
    e `[FAIL]` sob `GITHUB_ACTIONS=1`, repositório não identificado ⇒ `[WARN]`
    sem chamada de rede; fixtures `hoje`/`esperado_ruleset`/`classic_on`;
    C1(e) `update-ref -d` ⇒ `[FAIL] NÃO DETERMINÁVEL (refs/remotes/origin/
    develop ausente — git fetch origin develop)` + 11/11, exit 1 (e `--pr`
    segue julgando sem o ref); `PATH=""` ⇒ FAIL nomeado; E2 metade restaurada
    (015 em `validate`, piso vigente ⇒ `ANTERIOR AO PISO`, 0 problemas);
    **simulação do merge real** — `merge --no-ff -m "Merge pull request #99
    from oflavioc/feature/016-…"` sobre o piso e `update-ref origin/develop`:
    016 em `implement` ⇒ **`MESCLADA SEM FECHO (fase implement) · oráculo:
    mensagem #99`**, `merges após o piso: 1`, 1 problema, exit 1 (o EA-33 com
    os leitores reais); `done` sem artefatos ⇒ `[artefato-ausente]`; `done` com
    os dois arquivos ⇒ `CONFORME · #99` e `--pr` ⇒ `LIBERADO` (o flip de T084);
    válvula `prazo == %cI` ⇒ `[VÁLV] FECHO PENDENTE DECLARADO`, 1 válvula, 0
    problemas; `2026-01-01` ⇒ vencida; `done`+válvula ⇒ obsoleta; prazo
    `04/09/2026` ⇒ `fora de AAAA-MM-DD — não é data, não é válvula`; **merge com
    mensagem manual** ⇒ `016: MESCLADA SEM FECHO · oráculo: ancestralidade
    d1ae3c76af73` **e** `FORA DA POPULAÇÃO · merge em develop fora de PR após o
    piso (R14)`, 2 problemas; M21 no mundo `done`+mesclada ⇒ DETECTADO
    `CONFORME [fecho_pendente-obsoleta] · #99`; **sonda de vacuidade**:
    `ler_merges` devolvendo `[]` com `piso_na_cadeia: true` ⇒ gate nu **exit 0,
    0 problemas** e `D016-M19` **SOBREVIVENTE** (ver J1).
- **Leituras**: `check_fecho.py`, `fecho.py`, `check_branch_protection.py`,
  `branch_protection.py`, `compliance-audit.sh`, `tests_016_mutants.js`,
  `fecho.json`, `branch_protection.json`, `mutation_map.json → d016`,
  `mutation-matrix.json → pares (30 D016) · dividas_declaradas`, `pipeline.yaml`,
  `verify.yml`, `SKILL.md`, `sdd.md`, `CONTEXT.md`, `design-decisions.md`,
  `planning-state.schema.json`, `BACKLOG.md`; `git diff --name-only
  921977c..HEAD` (68 arquivos) cruzado por script com `boundary.json` e com a
  lista de intocados de T9.
- **Não executado, com motivo**: job `fecho` e seção `branch-protection` **no
  CI** (sem push/PR — T041/T043); verde ao vivo de `D016-PROT1` (P2 não
  executada); permissão do `GITHUB_TOKEN` de Actions em `/rules/branches`
  (§Não mensurável 1 — só o run do PR mede); campanha `d016` no job `verify`
  (T063); suítes Chromium (KI-3, `env-doctor` nomeou a ausência).

## Itens — veredito um a um

Legenda: **conforme** · **GAP** (classificado em §Gaps) · **pendente** (o
próprio desenho da spec o coloca no fecho da Fase 6, ainda não ocorrido — não
pontua) · **declarado** (não é exigência pontuável).

| # | Exigência (spec) | Verificação | Veredito |
|---|---|---|---|
| 1 | **C1(a)** mesclada por mensagem `#N` + `phase != done` + sem válvula ⇒ `MESCLADA SEM FECHO`, FAIL | sonda F1/F19 (33 · 0); árvore: M18 DETECTADO (`015 · #34 · 1 problema`, nenhuma outra); clone: 016 mesclada por `#99` simulado ⇒ `MESCLADA SEM FECHO (fase implement) · mensagem #99`, exit 1 | **conforme** |
| 2 | **C1(b)** mesclada só por ancestralidade ⇒ idem, `oráculo: ancestralidade` | F2; clone (merge de mensagem manual): `oráculo: ancestralidade d1ae3c76af73` | **conforme** |
| 3 | **C1(c)/(d)** `EM VOO` e `ANTERIOR AO PISO` contados, não julgados | F3/F4; árvore: 016 `EM VOO (fase implement) · não julgada`; clone: 015 em `validate` + piso vigente ⇒ `ANTERIOR AO PISO … fora do alcance (R13)`, 0 problemas; M2 mata a inversão | **conforme** |
| 4 | **C1(e)** `origin/develop` ou `git` ausente ⇒ FAIL `NÃO DETERMINÁVEL (…)`, nunca SKIP | clone: `update-ref -d` ⇒ global `origin-develop-ausente` + 11/11 `NÃO DETERMINÁVEL`, exit 1; `PATH=""` ⇒ `[FAIL] NÃO DETERMINÁVEL (leitura do mundo falhou: FileNotFoundError …)`, exit 1; F22 (metade pura) | **conforme** (obs. O6: no caso `git` ausente a causa vem do `protegido()` do gate, menos específica) |
| 5 | **C1(f)** planning-state sem `branch` ⇒ FAIL de forma, só esse sujeito | F18; M23 (`015: NÃO DETERMINÁVEL [registro-sem-branch]`, 1 problema, demais julgadas) | **conforme** (a frase "o schema passa a exigir" da §Guarda depende de G1) |
| 6 | **C1** relato nomeia demanda, fase, oráculo e SHA de `origin/develop` julgado | `[INFO] … origin/develop julgado: 921977c25e76 · data do commit julgado: 2026-09-04`; `[FAIL] 016-…: MESCLADA SEM FECHO (fase implement) · oráculo: mensagem #99` | **conforme** |
| 7 | **C2(a)** `feature/NNN-*` após o piso sem planning-state ⇒ FAIL `demanda-fora-da-maquina` | F11; M19 hoje: **6 problema(s)** / 5 branches (#15 005, #14 004, #12 002, #11 e #10 001, #9 000) = `_meta.prova_de_carga.piso` | **conforme** |
| 8 | **C2(b)** merge de demanda com estado cai no sujeito dela (não duplica) | `fecho.py:_julga_merges` pula `branch in com_estado`; clone `#99`: 1 problema, um só sujeito (016), nenhum sujeito `merge` extra | **conforme** |
| 9 | **C2(c)** merge após o piso fora do formato de PR e não integração de `main` ⇒ FAIL nomeado (R14); integrações ⇒ `FORA DA POPULAÇÃO` | F13/F14; clone: `1618d688…: FORA DA POPULAÇÃO · merge em develop fora de PR após o piso (R14): merge manual da 016 sem PR`; M4 | **conforme** |
| 10 | **C2(d)** piso ausente / não 40 hex / inexistente na cadeia ⇒ FAIL | F20/F21; M25 (global `piso-invalido`, 11 demandas `NÃO DETERMINÁVEL`, 0 sujeitos `merge`) | **conforme** |
| 11 | **C2** critério de população impresso uma vez; "N merges anteriores" impresso | `[INFO] população: ^feature/(\d{3})- ∩ planning-state (junção por branch) · piso 921977c2 (…)`; `merges first-parent após o piso: 0 · até o piso, inclusive: 39 (não julgados)` | **conforme** (redação ≠ amostra da spec, mesma informação) |
| 12 | **C3(a)** `done` sem um dos dois artefatos e sem exclusão ⇒ FAIL nomeando o artefato | F15; M20; clone: `done sem relatorio-final.md, spec-validate.md em disco, sem exclusão R13 válida` | **conforme** |
| 13 | **C3(b)** exclusão cujo artefato existe ⇒ FAIL "obsoleta — remova a entrada" | F17; M26 (`011: CONFORME [exclusao-obsoleta] · #32`, exit 1) | **conforme** |
| 14 | **C3(c)** exclusão sem `fonte` / `artefatos_ausentes` vazio ou curinga ⇒ não exclui, FAIL | F23; M27 (global `exclusao-malformada` + `009: MESCLADA SEM FECHO [artefato-ausente]`, 2 problemas); `_classifica_exclusoes` cobre curinga `*`/`?` | **conforme** |
| 15 | **C3(d)** prova de carga em `_meta.prova_de_carga`: 003 (2) · 009 (1) · 010 (1); exclusões **impressas** a cada execução com `fonte`, sem prazo; 3ª fonte no `compliance-audit` | M20 hoje: 3 problemas / 4 artefatos = registro (`lido Fase 4 = medido wave 5 = medido hoje`); gate nu imprime as três com `EXCLUÍDA R13 (…) — fonte: …`; audit `[PASS] fecho.json/excluidas_por_r13: 3 …, todas com fonte` | **conforme** |
| 16 | **C4** válvula válida ⇒ `FECHO PENDENTE DECLARADO`, impressa com dono e prazo, não reprova; listada pelo audit (`waivers`) | F6; controle `M24/positivo` OK; clone (016 mesclada `#99`, `prazo == %cI`): `[VÁLV] … FECHO PENDENTE DECLARADO (fase implement) · mensagem #99 · dono qa-engineer · prazo 2026-09-04`, 1 válvula, 0 problemas, exit 0; audit lê `fecho_pendente` pela chave (nenhuma ativa hoje) | **conforme** |
| 17 | **C4(a)** campo ausente/vazio ⇒ FAIL | F8 (`fecho_pendente-invalida`, sem `dono`); M7 | **conforme** |
| 18 | **C4(b)** `prazo < data_do_commit` ⇒ FAIL "vencida" (T4) | F7; M8; M24 (árvore); clone `2026-01-01` ⇒ `fecho_pendente vencida: prazo 2026-01-01 anterior à data do commit julgado (2026-09-04)` | **conforme** |
| 19 | **C4(c)** em demanda `done` ⇒ FAIL "obsoleta" | F9; M28 (carrasco permanente, 015); clone `done`+artefatos+válvula ⇒ `CONFORME … válvula obsoleta, remova a entrada (C4 c)`, 1 problema | **conforme** |
| 20 | **C4(d)** em demanda não mesclada ⇒ FAIL "válvula antes do vencimento" | F10; M21 hoje (`016: EM VOO [fecho_pendente-prematura]`) | **conforme** (obs. O3: o carrasco de árvore de (d) expira no `done` — ver J4) |
| 21 | **C4(e)** `prazo` fora do formato ⇒ FAIL (não é data, não é válvula) | **Instrumento cumpre** (clone: `prazo '04/09/2026' fora de AAAA-MM-DD — não é data, não é válvula`, exit 1). **Mas nenhum caso da sonda tem prazo malformado** (censo das fixtures: 1× `2026-01-01`, 6× `2026-09-30`; F8 é "sem dono"), e **nenhum mutante** ataca `_dia_valido(prazo)`: com a cláusula removida a sonda segue **33 · 0, exit 0**. Alínea sem carrasco e sem dívida declarada | **GAP G3** (faltando: caso + mutante) |
| 22 | **C5(a)** `done` + artefatos (ou exclusão) ⇒ `LIBERADO` | P1/P9; clone: `feature/015-…` ⇒ `LIBERADO … com relatorio-final.md e spec-validate.md`; `feature/009-…` ⇒ `LIBERADO … EXCLUÍDA R13 (spec-validate.md)`; 016 `done`+artefatos ⇒ `LIBERADO` | **conforme** |
| 23 | **C5(b)** `phase != done` ⇒ FAIL `FECHO PENDENTE da demanda NNN (fase X) — merge bloqueado até done` | P2; ao vivo local (tabela dos vermelhos) — código `fase-nao-done` | **conforme** (local; **CI não medido** — sem PR) |
| 24 | **C5(c)** planning-state ausente ⇒ FAIL "demanda fora da máquina" | P3; clone `feature/017-inexistente` ⇒ `FECHO PENDENTE … nenhum planning-state casa a branch … (R4 §Violação)`, exit 1 | **conforme** |
| 25 | **C5(d)** `done` com `fecho_pendente` ⇒ FAIL (T5) | P7 (`fecho_pendente-obsoleta`); P10 (válvula em `validate` ⇒ `prematura`, não libera); M10 | **conforme** |
| 26 | **C5(e)/(f)/(g)** head fora do padrão / base ≠ `develop` / sem base ⇒ `NÃO JULGADO (<motivo>)`, exit 0 | P4/P5/P6; clone: `NÃO JULGADO (fora da população: chore/fecho-009-013 …)` · `NÃO JULGADO (base main ≠ develop (release/main, R14))` · `NÃO JULGADO (evento sem base (push, workflow_dispatch …))`, todos exit 0 | **conforme** |
| 27 | **C5** ao vivo não aceita `--head`/`--base` | `check_fecho.py --pr --head x` ⇒ `argumento não aceito ao vivo … exit 2` | **conforme** |
| 28 | **C5 lugar** (E1): job próprio `fecho` em `verify.yml`, sem `needs:`/`if:`, checkout raso, python 3.12, um passo `check_fecho.py --pr`; `verify`/`visual` e `:42` intocados | `git diff 921977c..HEAD -- .github/workflows/verify.yml` = **só** o bloco `fecho:` acrescentado (+15), idêntico ao da spec §Superfície 2; linha 42 `MUTATION_DEFER_MISSING: "1"` intacta | **conforme por leitura**; **não executado no CI** (sem push/PR — T041) |
| 29 | **C6(a)** determinável e conforme ⇒ `PROTEGIDA`, PASS, imprimindo mecanismo, contextos e `strict` | fixture `esperado_ruleset` (modo `--fixture`, declarado "NÃO é leitura do mundo"): `[PASS] develop PROTEGIDA · ruleset 21381133 + classic enabled=false · checks obrigatórios: fecho, verify, visual · up-to-date: sim` | **conforme** (por fixture; **ao vivo pendente de P2**) |
| 30 | **C6(b)/(c)** faltando contexto ou `strict` ⇒ `DESPROTEGIDA` nomeando; `protected: true` + `enabled: false`/`off` + ruleset sem rsc ⇒ `DESPROTEGIDA` | ao vivo hoje (tabela dos vermelhos); fixtures `hoje`/`classic_off`/`sem_visual`/`sem_fecho`/`strict_false`; M13/M14/M15/M17 | **conforme** |
| 31 | **C6(d)** `NÃO DETERMINÁVEL (rede \| permissão \| repositório)` ⇒ `[WARN]` local com instrução, `[FAIL]` no CI (T7) | clone: 401 ⇒ `[WARN] … (permissão 401: Bad credentials) — rito: gh auth login && …` exit 0 / `GITHUB_ACTIONS=1` ⇒ `[FAIL]` exit 1; repo divergente ⇒ `[WARN] … (repositório não identificado: esperado oflavioc/quickscan-secops, remote C:/…)` **sem chamada de rede**; fixtures `http_403`/`sem_rede`; M12 | **conforme** |
| 32 | **C6(e)** `strict` sob classic ⇒ `[WARN]` permanente declarado | fixture `classic_on`: `[WARN] develop PROTEGIDA · classic enabled=true · … · up-to-date: não determinável (classic)` + `aviso:` | **conforme** |
| 33 | **C6(f)** demais regras impressas, não julgadas | `outras regras ativas: deletion · non_fast_forward` (ao vivo) · `· pull_request` (fixture) | **conforme** |
| 34 | **C6** expectativa em dado: `branch_protection.json {repo, ref, checks_obrigatorios ×3, up_to_date}` | leitura; `esperado_de()` só lê essas quatro chaves | **conforme** |
| 35 | **C6 lugar** (T8 c): seção `branch-protection` do `compliance-audit.sh`, roteando pela `severidade` do JSON; `aviso()`; linha final `compliance: N PASS · N FAIL · N WARN`; exit = FAIL; `--rule=` | execução: `15 PASS · 1 FAIL · 0 WARN`, exit 1; `--rule=branch-protection` ⇒ `0 · 1 · 0`; `grep -rn "compliance:"` ⇒ só o próprio script emite a linha; JSON entra por variável de ambiente (`d7dbe58`) | **conforme** (obs. O5) |
| 36 | **C7** sonda em toda execução, antes da árvore; total pinado; divergência ou total ≠ ⇒ FAIL nomeando o caso; `--sonda` emite JSON `{casos:[{id, esperado, obtido, ok}], total, falhas}` em stdout, prosa em stderr | chaves medidas: `casos, divergentes, falhas, gate, guarda, instrumento, ok, total, total_pinado`; caso: `divergencias, esperado, id, modo, obtido, ok`; totais 33/33 e 9/9; M16/M29 (laço vazio ⇒ `executados 0 ≠ total pinado`), M22/M30 (fixture removida ⇒ `caso sem fixture` + árvore não julgada) | **conforme** |
| 37 | **C8** `SKILL.md:66` e `sdd.md` §Gates de fase (P7): `done` = Fase 6 completa + PR aberto; CI verde é condição do **merge**; "o merge em `develop` espera o `done`" | leitura (`146f2b4`): SKILL.md Fase 6 item 3 e nota da redação anterior; `sdd.md:39-45` item **Fecho** | **conforme** |
| 38 | **C9** `CONTEXT.md`: *Fecho de demanda*, *Demanda mesclada sem fecho*, *Fecho pendente declarado*; **não** *promessa de execução* nem *deferimento vencido*; "vencida" = prazo anterior à data do commit (T4) | leitura (`f9b79fc`): os três verbetes em `:256/:265/:275`, "vencida" com T4; `grep` dos dois vetados ⇒ 0; entrou também *Mutante parcialmente inerte* (`:202`, dívida da 014), declarado no cabeçalho como desvio | **conforme** (desvio aditivo declarado) |
| 39 | **C10(a)** dívida "Borda 8" com desfecho anexado, texto original preservado | `mutation-matrix.json → dividas_declaradas`: sufixo `· DESFECHO (016, 2026-09-04): credor = proteção de branch …`, original intacto; `check_tdd.py` imprime `[DÍVIDA] Borda 8 …` | **conforme** |
| 40 | **C10(b)** `EA-33` → `resolvido` no fecho da Fase 6 | `BACKLOG.md:1843` ⇒ `**Status**: \`aberto\``; é T082 (wave 7, `doc-writer`), ainda não executada | **pendente** (por desenho; condição do `done`) |
| 41 | **C10(c)** `EA-14` permanece `aberto` **com nota** | aberto ✔ (`:1027`); nota da 016 ausente — T082 | **pendente** (por desenho) |
| 42 | **C10(d)** `design-decisions.md`: linha KI-3 ("em calibração" → calibrado; check obrigatório desde a 016) e nova linha confirmada "cobrança no merge vive na proteção de branch, auditada" | `grep -c 'cobrança no merge\|D016-PROT1'` ⇒ **0**; linha KI-3 ainda diz "(em calibração)"; arquivo intocado desde `18284fd`; **T071 não executada** | **GAP G2** (faltando) |
| 43 | **T1** oráculo primário = mensagem de merge (`#N` × `branch`); secundário = ancestralidade quando a mensagem cala; o gate imprime qual respondeu | clone: `mensagem #99` no merge GitHub; `ancestralidade d1ae3c76af73` no merge manual; M1 (só ancestralidade ⇒ F19 vira `EM VOO`) | **conforme** |
| 44 | **T2** piso `921977c25e76fe0ed19dae74e17921d37c711ff0`, 40 hex, em `fecho.json → piso`; posterior julgado, até o piso `ANTERIOR AO PISO` | `fecho.json → piso.sha` idêntico; `origin/develop` remoto = piso (`git ls-remote`); E2 metade restaurada | **conforme** |
| 45 | **T3** julgador puro + sonda em toda execução com contagem pinada; mesmo desenho para PROT1 | `julgar_pos_merge`/`julgar_pre_merge`/`classificar` sem git/disco/rede/relógio (leitura); sonda executada antes da árvore em todo modo (`check_fecho.py:458`); item 36 | **conforme** |
| 46 | **T4** prazo comparado à data do commit (`%cI` de HEAD), nunca ao relógio | `fecho.py:_valvula` usa `data_do_commit`; `date` só como validador; clone: prazo `== %cI` aceita, `2026-01-01` vence; M24 + `M24/positivo` | **conforme** |
| 47 | **T5** válvula só depois do merge; `done` ⇒ obsoleta; não mesclada ⇒ prematura; pré-merge não a honra | F10/P7/P10; M10/M21/M28; clone (itens 16, 19, 20) | **conforme** |
| 48 | **T6** dois endpoints, três vereditos, `strict` no ruleset; token `GITHUB_TOKEN` → `gh auth token` → nenhum, **fonte impressa, token nunca**; repo por `GITHUB_REPOSITORY` → `git remote get-url origin` | `[INFO] repo oflavioc/quickscan-secops (origem: git remote get-url origin) · token: gh auth token`; `(origem: GITHUB_REPOSITORY) · token: GITHUB_TOKEN` no clone; `_token()` nunca devolve o valor para o relato; fixture `hoje` = respostas reais de 2026-09-04 | **conforme**; **permissão do `GITHUB_TOKEN` de Actions não medida** (sem run — §Não mensurável 1) |
| 49 | **T7** não determinável: local `[WARN]` nomeado com instrução, CI `[FAIL]`; `strict` clássico `[WARN]` permanente | item 31 e 32; sonda pina `severidade_local` **e** `severidade_ci` por caso | **conforme** |
| 50 | **T8(a)** stage `fecho` em `pipeline.yaml` depois de `tdd`, `parallel: true`, `heavy: false`, `mutates: false`; `--light` passa a 12 stages | `pipeline.yaml` (leitura, `desc` já diz "33 casos"); `run.sh` completo 16 stages; hook Stop `--light` = 12 (16 − 4 heavy) | **conforme** |
| 51 | **T9** intocados: `check_state.py`, `check_tdd.py`, `check_mutation.py`, `env_doctor.py`, `expected_suites.json`, `invariants.json`, `known_issues.json`, `current_phase.json`, `bridges.json`, `verify.yml:42`, spec 013; **nenhum byte de produto** | script sobre `git diff --name-only 921977c..HEAD` (68 arquivos): intocados presentes ⇒ **nenhum**; paths de produto ⇒ **nenhum**; spec 013 ⇒ nenhum; `state-eval.sh` também intocado | **conforme** |
| 52 | **T10** vocabulário fechado (10 vereditos; pré-merge 3; proteção 3); todo `NÃO DETERMINÁVEL`/`NÃO JULGADO` com causa | guardas do gate: `VEREDITOS do instrumento ≠ T10` e `NÃO DETERMINÁVEL sem detalhe (T10)` reprovam; `CODIGOS` (16) conferido contra `_meta.contrato_da_sonda.codigos` | **conforme** |
| 53 | **§Superfície 1** ordem sonda → leitura → julgamento → relato; exit 1 sse problemas; FAIL de forma aborta só o sujeito; nada escreve | M27 (global não impeditivo, demais julgadas), M23 (só o sujeito sem `branch`); porcelain vazio após pipeline e campanha; amostra literal `[SONDA] fecho: 26 caso(s)` é prosa histórica | **conforme** (obs. O1) |
| 54 | **§Superfície 4** `planning-state.schema.json`: `branch` em `required`; propriedade `fecho_pendente {motivo, dono, prazo, declarado_em?}` com `pattern` de dia | `required: ['demanda', 'phase', 'spec_dir']` (sem `branch`); `properties.fecho_pendente` ⇒ **ausente**; arquivo intocado desde `a41d241`; **T012 não executada** | **GAP G1** (faltando) |
| 55 | **§Contratos** `fecho_pendente {motivo, dono, prazo}` obrigatórios; `declarado_em` opcional; owner do estado = planning-state; só `check_fecho.py` decide | `fecho.py:CAMPOS_VALVULA`, `_dia_valido`; `state-eval` e audit apenas listam (leitura) | **conforme** |
| 56 | **§Contratos** `fecho.json`: piso, `excluidas_por_r13` com `artefatos_ausentes`+`fonte`, `populacao`, `sonda {fixtures, total, casos}`, `_meta.prova_de_carga` medida | leitura: todas as chaves; `sonda.total: 33` com 33 casos pinando veredito+oráculo+código+problemas (pós) e veredito+código (pré); `_meta.prova_de_carga` com `piso`/`exclusoes`/`fec1` **medidos** + `prova_de_carga_leitura_fase4` | **conforme** (obs. O1: `"total": 26` da amostra) |
| 57 | **§Contratos** `branch_protection.json`: repo, ref, 3 checks, `up_to_date`, sonda de 9 com `sem_fecho`, `hoje` real | leitura + sonda 9 · 0; `hoje` reproduz ao vivo o mesmo mecanismo lido | **conforme** |
| 58 | **§Contratos** CLI: `check_fecho.py [--pr] [--sonda] [--json]`, `check_branch_protection.py [--sonda] [--fixture] [--json]`; JSON em stdout, prosa em stderr; ao vivo nada substitui o ambiente | itens 27, 36; `--fixture` sob `GITHUB_ACTIONS` ⇒ exit 2; `--sonda 2>/dev/null` parseia como JSON | **conforme** |
| 59 | **§Contratos** harness `d016`: `requires [node, python]`; targets = 4 scripts + 2 registros + `fixtures_016/**` + harness; mutação in-place com SHA-256 e porcelain escopado; `MUTATION_PY`; `reason` por ids de caso; pares na matriz | `mutation_map.json → d016`: 51 targets (42 fixtures **um a um**, 4 scripts, 2 registros, harness, **+2 planning-states** que a campanha muta — desvio aditivo declarado na `_trilha`); preflight 30/30 únicas; 30 pares em `mutation-matrix.json` com `ultima_prova.resultado: KILL` (2026-09-04) | **conforme** (obs. O2) |
| 60 | **§Arquivos rastreados que mudam** (tabela) | ✔ `pipeline.yaml`, `verify.yml`, `compliance-audit.sh`, `mutation_map.json`, `mutation-matrix.json`, `SKILL.md`, `sdd.md`, `CONTEXT.md`, os novos; ✗ `planning-state.schema.json` (G1); ✗ `design-decisions.md` (G2); `BACKLOG.md` pendente (T082); ADR `docs/adr/0001-…` **não entregue** — proposto, opcional ("sem ele a spec não perde nada"), sem veto registrado | agregado — não pontua (ver G1, G2, pendentes, O7) |
| 61 | **E1** job próprio `fecho`; P2 = três checks; `branch_protection.json` com `fecho`; sonda 8 → 9 (`sem_fecho`); mutante do terceiro contexto | itens 28, 34, 57; **`D016-M17`** DETECTADO (`sem_fecho` vira `PROTEGIDA`, `hoje` perde `fecho` de `faltam`) | **conforme** |
| 62 | **E2** prova de carga de C1(a) com piso recuado para `6dad53d` + 015 em `validate` ⇒ 015 por `#34` e nada mais; restaurado ⇒ `ANTERIOR AO PISO`; registrada em `_meta.prova_de_carga.fec1` | M18 hoje (1 problema, isolamento asserido); clone: metade restaurada, 0 problemas; registro presente | **conforme** |
| 63 | **E3** `ler_merges` percorre a cadeia first-parent inteira (`%P`, sem `--merges`); sujeito só merge (≥ 2 pais) | `fecho.py:459-503`; M19 (piso zero = raiz, não-merge) executável e DETECTADO com 6 problemas; `merges_ate_piso` = 39 | **conforme** |
| 64 | **§Nascimento sem vermelho crônico**: PROT1 vermelho ao vivo com dono/evento/prazo; PR1 vermelho no PR até o `done`; nenhum gate nasce verde sobre `develop` desprotegida | PROT1 vermelho **local** pela razão certa; PR1 vermelho **local** pela razão certa; o "prazo" (antes do merge) e o "run em que ficou verde" dependem de **P2 e do PR**, nenhum existente | **conforme ao desenho**; flips **pendentes** de T041 + T050 |
| 65 | **§Não mensurável nesta fase** (1–6) | 1 permissão do token: **não medido** (sem run); 2 prova de carga: **medida**, lido = medido, nada ajustado; 3 red de PR1: local sim, PR não; 4 verde de PROT1: pendente P2; 5 janela dos 65 s: não prometido; 6 execução: feita agora | **declarado** — não pontua |
| 66 | **§Fora de escopo** (negativos): sem R-b1/R-b2 (recibo/reconcile/Chromium no `verify`); sem byte de produto; `state-eval.sh` intocado (R-a6 → candidata); chave irmã intocada; spec 013 intocada | item 51 + leitura do diff; nenhum `reconcile`/recibo no código; T073 não feita ⇒ candidata do relatório final, como a spec prevê | **conforme** |
| 67 | **Cross-check R6**: nenhum arquivo em classe protegida; `pins.json` só via `gen_pins.py` | script boundary × diff: única colisão `.claude/verify/pins.json` (classe `registry`), alterado exclusivamente por commits `gen_pins — repin` (R0…R6) | **conforme** |
| 68 | **R10 §7** git por lista de argumentos · **§8** teste não escreve · **§9** stage no pipeline · **§10** varredura sem-rede com auto-exclusão por não nomear (ET4) | `subprocess.run(["git", *args])` sem shell; porcelain vazio após tudo; stage `fecho`; `grep -nwE "urllib\|http\|socket\|ssl" check_fecho.py fecho.py` ⇒ **0** (a rede vive só em `branch_protection.py`, fora do conjunto varrido, por desenho do plan §Camada) | **conforme** |
| 69 | **R7** veredito de `fecho` função pura de árvore + histórico (T4); `check_branch_protection.py` declara que lê o mundo na primeira linha | `[INFO] branch-protection LÊ O MUNDO: GET … (R7 — único gate não-puro por construção) · modo: local`; item 46 | **conforme** |
| 70 | **R9** uma responsabilidade por arquivo; ≤ ~600 linhas | `fecho.py` 562 · `check_fecho.py` 482 · `check_branch_protection.py` 344 · `branch_protection.py` 314 | **conforme** |

## Score

- Itens pontuáveis: **66** (70 linhas − 2 agregados/declarações [60, 65] − 2
  pendentes por desenho da própria spec [40, 41]).
- **Conformes: 63 · Gaps: 3** (G1, G2, G3 — todos da classe **faltando**;
  nenhum `spec-errada`, nenhum `implementação-divergente`).
- **Score: 63 / 66 = 95 %.** < 100 % ⇒ classificar e devolver ao orquestrador
  para **uma** iteração (esta é a 1ª de 2).
- O que o score **não** diz e este documento diz: dois vermelhos por desenho
  (ambos pela razão certa, medidos localmente); quatro medições que só o CI e
  o ato P2 fecham (itens 23, 28, 29, 48, 64); duas pendências de wave 7 (40,
  41). Nada disso é conformidade — é estado.

## Gaps — classificados, com a direção que recomendo

### G1 · **faltando** — §Superfície 4: o schema do planning-state não mudou (T012)

`planning-state.schema.json` está intocado desde `a41d241`: `required` sem
`branch`, sem propriedade `fecho_pendente`. A spec promete os dois (§Superfície
4, §Contratos, tabela de arquivos), e a §Guarda C1(f) diz "o schema passa a
exigir". Efeito em runtime: **nenhum** (a spec mesma nota que `check_state.py`
não valida por biblioteca; a forma de `fecho_pendente` é julgada por
`check_fecho.py` — itens 5, 17, 21). É lacuna de **contrato declarado**, não de
gate. Direção: executar T012 como escrita (`data-engineer`, tipo `chore`, `required
= ["demanda","phase","spec_dir","branch"]`, `fecho_pendente` com `pattern`
`^\d{4}-\d{2}-\d{2}$` em `prazo`/`declarado_em`), repin R1b. **Não** fechar a
lacuna apagando a Superfície 4 da spec: o dado de junção (`branch`) é o que C1(f)
cobra e o schema é onde a casa declara forma.

### G2 · **faltando** — C10(d): `design-decisions.md` não foi tocado (T071)

A linha KI-3 ainda diz "(em calibração)" e não existe a linha confirmada
"cobrança no merge vive na proteção de branch, auditada por `D016-PROT1`" com a
fonte (portão da Fase 0 da 016). O próprio cross-check da spec já classifica a
letra atual como conflito superado pela decisão P2. Direção: T071
(`doc-writer`, `doc`), repin R6b. O **ADR** `docs/adr/0001-…` também não foi
entregue; a spec o declara opcional ("decisão do portão — sem ele a spec não
perde nada") e a `tasks.md` prevê veto: **não é gap**, mas o veto não está
registrado em lugar nenhum — o orquestrador decide e escreve (executar ou vetar
com uma linha no relatório final).

### G3 · **faltando** — C4(e) tem instrumento e não tem carrasco

O instrumento cumpre a alínea (medido no clone com prazo `04/09/2026`:
`fecho_pendente-invalida`, mensagem "não é data, não é válvula"). Mas nenhum caso
da sonda usa prazo malformado e nenhum mutante ataca `_dia_valido(prazo)` em
`_valvula`: com a cláusula removida, `--sonda` responde **33 · 0** e a campanha
não vê. Pelo R10 §Nascimento (negativo + mutante que o gate mata) e pelo censo da
Fase 4 ("um caso por alínea sem estado de reprovação"), (e) ficou de fora sem
dívida declarada — cenário sem carrasco. Direção **aditiva** (ids permanentes,
nunca renumerar): caso **F24** (`pos`, mesclada por mensagem, `validate`, válvula
com `prazo: "30/09/2026"` ⇒ `MESCLADA SEM FECHO` · `mensagem` ·
`fecho_pendente-invalida` · 1 problema) + mutante **D016-M31** (`if False and not
_dia_valido(prazo)` ⇒ F24 vira `FECHO PENDENTE DECLARADO`) + par na matriz +
`sonda.total` 33 → 34 + `desc` do stage — dono `qa-engineer` (arquivos meus),
repin. Alternativa honesta se o orquestrador preferir não mexer na sonda nesta
iteração: entrada em `dividas_declaradas` nomeando "C4(e) sem caso e sem
mutante". O que **não** pode acontecer é ficar como está: alínea que parece
medida e não é (`EA-20`).

## Julgamentos pedidos pelo orquestrador — com a execução, não com o argumento

### J1 · Os verdes por vácuo (FEC1/FEC2/FEC4) e por exclusão (FEC3): conformidade, com **um limite nomeado**

Não é `EA-20`. `EA-20` é gate que **não pode reprovar** sob estado alcançável
nenhum. Aqui, hoje, medi **sete** estados que o fazem reprovar, produzidos de
três formas independentes:

1. **Mutantes de árvore, reexecutados** (stage e clone): M18 (FEC1: 015 por
   `#34`, 1 problema, "nenhuma outra" asserido), M19 (FEC2: 6/5), M20 (FEC3: 3
   demandas / 4 artefatos), M21/M24/M28 (FEC4). Os números **coincidem** com
   `_meta.prova_de_carga` e com a leitura da Fase 4 — três medições, nada
   ajustado.
2. **A exclusão é carga**: sem as três entradas (M20) a árvore volta a acusar;
   com uma entrada obsoleta (M26) ou sem `fonte` (M27) o gate reprova. Verde
   com exceção impressa, não afrouxamento (R10 §1).
3. **O EA-33 real, com os leitores reais**: no clone, um commit de merge
   verdadeiro no formato do GitHub pôs a 016 em `develop` com `phase:
   implement` e o gate nu respondeu `MESCLADA SEM FECHO (fase implement) ·
   mensagem #99 · 1 problema · exit 1`; a mesma árvore com `done` sem artefatos
   deu `[artefato-ausente]`, com artefatos deu `CONFORME`, e o `--pr` virou
   `LIBERADO`. O verde também é alcançável (controles `C0-fecho`,
   `M24/positivo`, válvula válida aceita no clone) — não é gate
   constante-vermelho.

**O limite**, medido e não apenas raciocinado (sonda F): um leitor de merges que
devolva `[]` com `piso_na_cadeia: true` deixa o gate nu **verde** (exit 0, 0
problemas): as dez `done` saem `CONFORME` por **ancestralidade** (T1 secundário
cobre quem tem `red.commit`; a decisão 4 do instrumento julga `done` por C3 sem
olhar o piso), a 016 `EM VOO`, e a única marca é `merges … até o piso, inclusive:
0` — impresso, não asserido. Sob esse leitor, `D016-M19` **SOBREVIVE**. Ou
seja: a não-vacuidade do **julgador** é do gate (sonda, C7); a não-vacuidade da
**leitura** é da **campanha `d016`**, que roda por trigger de path — não a cada
execução do stage. Um leitor não se quebra sem editar `fecho.py` (alvo da
campanha), e clone raso/ref ausente já reprovam por nome; o que fica sem
asserção no stage é o censo. **Candidata, não decisão minha** (R10 §1 ao
contrário — fortalecer por conta própria é tão errado quanto afrouxar): pinar em
`fecho.json → piso` o censo **imutável** `merges_ate_piso = 39` (a história até o
piso não muda) e assertá-lo no gate — custo zero de manutenção, fecha o vão no
lugar certo. Levo ao `product-owner`/`tech-lead` em DEPENDÊNCIAS.

Veredito: **conformidade** — o argumento "os dentes estão na sonda e nos
mutantes" foi provado por kill medido hoje, e o EA-33 foi reproduzido com o
mecanismo inteiro; o limite (leitura sem censo no stage) fica **escrito**, com o
seu carrasco atual (campanha) e a candidata.

### J2 · Os números na prosa — classificação um a um

| divergência | classificação | por quê |
|---|---|---|
| spec: sonda de **26** casos (`§Superfície 1` amostra, `§Contratos "total": 26`, "Total 26") · medido **33** | **conforme sem errata** | a própria spec autoriza ("a Fase 4 pode acrescentar, nunca renumerar"); R10 §3 põe a contagem no registro canônico (`fecho.json → sonda.total: 33`), nunca na prosa; o desvio está aceito no planning-state (`red.desvios_aceitos_pelo_orquestrador (a)`) e o `desc` do stage já diz 33. Os sete casos novos (F20–F23, P8–P10) são cada um a única prova de uma alínea sem estado de reprovação. **Errata editorial opcional** (E4) só para as duas amostras literais — não bloqueia; se o usuário preferir, fica como prosa histórica, que é o que o planning-state já diz |
| `tasks.md` T060: "**35** fixtures / **42** entradas" · medido **42** fixtures / **51** targets | **conforme sem errata** (e fora do escopo do `spec-validate`, que extrai da `spec.md`) | número de plano copiado antes dos acréscimos da Fase 4; a lista real saiu de `git ls-files` (42) e a entrada tem 51 porque inclui os **2 planning-states** que a campanha muta — desvio **aditivo** que endurece o trigger (editar o estado da 015/016 dispara `d016`), declarado na `_trilha` e em `prova-de-carga.md` §8. A spec §Contratos não pina número: diz `fixtures_016/**`, e o mapa lista um a um porque `check_mutation.py:1287` casa por pertinência exata |
| sonda de proteção **8 → 9** (`sem_fecho`) | **conforme com errata** (E1) | já incorporada; item 61 |

Nenhuma delas é gap: onde o `spec-validate` leria divergência há convergência
medida (33 = 33 = 33; 42 = 42; 9 = 9).

### J3 · `D016-M9` morre pelo código `artefato-ausente`, não por "libera": letra da sonda, não gap de critério

Lido na fixture: `P2` é `validate` **com `artefatos: []`**. Sob M9 (`fase not in
("done", "validate")`) a cláusula de fase deixa de bloquear — exatamente a
propriedade atacada — e a cláusula seguinte (artefatos) reprova com outro
código; a sonda pina `codigo: fase-nao-done` e o par morre pelo campo certo. O
critério C5(b) está medido (item 23) e R3 §5 está satisfeito (mutante escrito
para o gate, morto). A divergência é da coluna **"mutante previsto"** — uma
previsão que supôs a fixture com artefatos — e a matriz registra o obtido, não
o previsto: é o registro honesto. **Não é gap**; é observação (O4). Direção que
recomendo, **aditiva e opcional**: caso **P11** (`validate` + os dois artefatos,
sem válvula ⇒ `FECHO PENDENTE · fase-nao-done`) e M9 passando a esperar `P11 →
LIBERADO` (P2 fica como segunda divergência) — isola a cláusula de fase e
devolve a letra da spec. Se a iteração de correção incluir G3, cabe no mesmo
commit (mesmos arquivos, mesmo dono).

### J4 · `D016-M21` acoplado ao ciclo de vida: ratifico o registro, contesto dois pontos

**Ratifico** o acoplamento como registro honesto e não-apodrecível — e agora
medido nas duas pontas: hoje DETECTADO com `EM VOO [fecho_pendente-prematura]`;
no clone, com a 016 `done` **e** mesclada por `#99`, DETECTADO com `CONFORME
[fecho_pendente-obsoleta] · #99 (fase done)` (a terceira combinação). A
`regra`, executada em node sobre dez combinações, aceita 3 e rejeita 7
(inclusive `FECHO PENDENTE DECLARADO` nas duas fases e `prematura` em `done`) —
não é tautologia. **Contesto**:

1. A frase do cabeçalho "se um dia sobreviver, é porque a árvore passou a
   ADMITIR a válvula" **não é alcançável como SOBREVIVENTE**: o mundo que a
   produziria (016 mesclada com fase aberta) já derruba o controle `C0-fecho`
   (1 problema) e M21 sai **`NÃO EXECUTADO · baseline vermelho`** — medido.
   O sinal existe (a campanha reprova), mas com outro nome; o texto deve
   dizer isso para ninguém procurar um SOBREVIVENTE que não vem.
2. **O custo real do acoplamento**: a partir do `done` (T084), M21 passa a medir
   **C4(c)** — a mesma alínea de M28 — e **C4(d)** (prematura) fica sem carrasco
   de árvore para sempre; sobra F10 na sonda. A matriz diz "C4 d hoje; C4 c
   depois do done/merge" e **não nomeia a perda**. Alternativa que a fecha sem
   reancoragem: mutante que **cria** um planning-state sintético nunca mesclado
   (`9NN-sintetica-d016.json`, `branch: feature/9NN-…`, `implement`, válvula
   válida; restauração = unlink) — sujeito estável para C4(d), como M28 é para
   C4(c). É o cenário definido pela alínea, não carrasco inventado.
   **Decisão do orquestrador/`tech-lead`**; não bloqueia esta validação, e a
   forma mínima aceitável é a dívida nomeada na matriz ("C4(d) sem carrasco de
   árvore após o done").

Uma terceira observação, de método: o negativo "instrumento que ignora válvula em
`done`" **não mede a regra do harness** — a sonda (F9) pega o instrumento antes
(C7) e o baseline fica vermelho. Para provar a `regra`, vale tabela-verdade ou
splice da expectativa; mutar o instrumento é pré-emptado por desenho.

### J5 · `compliance-audit.sh` não é stage: conforme ao desenho, com uma cegueira local a nomear

A spec **decide** isto explicitamente (T8 c): a seção vive no `compliance-audit`,
"não stage — roda no CI e no rito manual, não no hook Stop a cada turno", com a
razão (rede a cada turno é custo sem valor; o audit já é o lugar que "audita a
própria configuração" e roda em todo run do CI, `verify.yml:43-44`). A promessa
de C6 é "lida da API **a cada auditoria**", não "a cada verificação" — e a
auditoria roda em todo job `verify`, que é onde o merge é cobrado. A skill
`verify` também manda rodar o audit. Portanto: **conforme, não é promessa
quebrada**.

O que a spec não nomeia e eu nomeio: localmente, `run.sh` completo grava
`.last_green` e o `state-eval` injeta "idade do último verify verde" **sem** o
audit — hoje `.last_green` foi gravado com a `develop` `DESPROTEGIDA`. "Verify
verde" local ≠ "P16.b cobrada"; o `post-turn-verify` nunca vê a proteção. Como
o credor de P16.b é o merge (CI) e o CI roda o audit, o desenho segura. Duas
consequências para escrever: (a) o rito local de fecho da Fase 6 tem de citar o
audit à parte (fiz: 15 · 1 · 0); (b) **candidata** ao `tech-lead`: uma linha no
`state-eval`/skill `verify` com a data do último audit, ou o audit como stage
`heavy` (pula no `--light`, roda no completo) — decisão de desenho, não minha.

## Observações — o que não virou gap, e por quê

- **O1** · "26" nas amostras da spec (§Superfície 1, §Contratos) — prosa
  histórica; classificação em J2.
- **O2** · `tasks.md` 35/42 e os 51 targets — J2; os dois planning-states nos
  targets são desvio aditivo declarado.
- **O3** · M21 perde C4(d) após o `done` — J4; carrasco permanente de C4(c) é M28.
- **O4** · M9 mata pelo código, não pela liberação — J3; recomendação P11.
- **O5** · A linha `[FAIL] branch-protection:` do audit imprime `faltam: fecho,
  up-to-date, verify, visual` (lista crua do JSON), enquanto o gate imprime
  `faltam: fecho, verify, visual (checks obrigatórios), up-to-date` e a spec
  §Superfície 3 exemplifica a forma agrupada. Cosmético: a decisão vem da
  `severidade`, nunca da prosa (R10 §6).
- **O6** · Com `git` fora do PATH, quem nomeia é o `protegido()` do gate
  (`FileNotFoundError`), porque `ler_data_commit` não classifica a ausência como
  `ler_merges`/`ler_ancestralidade` fazem — veredito e exit corretos (C1 e);
  observação já levada ao `core-engineer` na wave 5, baixa prioridade.
- **O7** · ADR 0001 não entregue e sem veto registrado — G2 (decisão do
  orquestrador).
- **O8** · `CONTEXT.md` ganhou um quarto verbete (*Mutante parcialmente
  inerte*, dívida da 014) no mesmo commit de C9 — declarado no cabeçalho do
  glossário; não contraria P6 (que veta dois termos específicos).
- **O9** · Única colisão do diff com o boundary é `pins.json` (classe
  `registry`), todas por `gen_pins.py` — rito correto (R8 §1).
- **O10** · T073 (R-a6, `state-eval` distinguir "mesclada sem fecho" de "em
  voo") não coube na wave 6 — a spec já prevê: vira candidata no relatório
  final, sem gate.

## Estado da Fase 6, hoje

| condição do `done`/merge | estado | quem fecha |
|---|---|---|
| Pipeline completo verde | **16 PASS · 0 FAIL** | — |
| Campanha `d016` | **30/30 · 3 controles ok** (stage + standalone) | — |
| Regressão congelada | 19 suítes + session, todas no canônico | — |
| `spec-validate.md` em disco | este arquivo (iteração 1, **95 %**, 3 gaps `faltando`) | orquestrador → 1 iteração (T012 `data-engineer` · T071 `doc-writer` · G3 `qa-engineer`) |
| `relatorio-final.md` + `BACKLOG.md` (EA-33 `resolvido`, nota em EA-14) | não existem — T082 | `doc-writer` |
| **PR aberto** (`check_state.py:52` exige `pr_url` em `done`) | **não existe; branch não enviada** — T041 | `build-engineer` (push + `gh pr create --base develop`) |
| Contexto `fecho` reportado ao menos uma vez (pré-requisito de P2 pela ordem do plano) | nunca rodou | T041 |
| **P2** (ruleset: `verify`, `visual`, `fecho` + up-to-date) | não feita — `DESPROTEGIDA` | **usuário** (T050) |
| Medição do `GITHUB_TOKEN` em `/rules/branches` no CI | não medida | primeiro run (T043) |
| Aceite de intenção | — | `product-owner` (T081) |

Pela spec (§Nascimento), **sem P2 o PR não deve ser mesclado**; pela `tasks.md`,
T080 deveria ter parado antes disto. O que este documento entrega é a metade
mensurável hoje, com a ordem do que falta.

## Encaminhamento

1. **Iteração de correção (única, R4/skill)**: G1 → `data-engineer` (T012 como
   escrita; repin); G2 → `doc-writer` (T071; decidir/registrar o ADR; repin);
   G3 → `qa-engineer` (F24 + D016-M31 + par + `total` 34, ou dívida nomeada;
   repin). Opcional no mesmo commit de G3: P11/M9 (J3).
2. **Processo, antes do `done`**: T041 (push + PR — sem ele não há `pr_url`,
   não há red de PR1 no CI, não há contexto `fecho` para P2), T043 (medição do
   token), T050 (P2), T082, repins; depois T084.
3. **Candidatas** (sem gate, decisão de PO/TL): pin imutável `merges_ate_piso =
   39` (J1); carrasco permanente de C4(d) por planning-state sintético (J4);
   visibilidade local do audit (J5); R-a6 (O10).
4. Reler este documento quando o PR existir: os itens 23, 28, 29, 48 e 64
   mudam de prova ("local" → run citado por número), e a tabela dos vermelhos
   ganha a coluna do CI.
