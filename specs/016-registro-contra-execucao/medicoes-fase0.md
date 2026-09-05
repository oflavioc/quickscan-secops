# Medições — Fase 0 (016), 2026-09-04

> Dono: `build-engineer`. Números com fonte; execução própria declarada em cada
> item. O que não foi medido está dito como tal (R2 §1). Nenhuma spec, plano ou
> gate foi escrito aqui — só medição para o portão da Fase 0.

---

## Medição 1 — custo de levar Chromium para o job `verify`

Fonte: `gh run view <id> --json jobs` (runs 33834890154, 33848321849) +
`gh run view <id> --log --job=<job id>` para o detalhe por stage dentro do job
`verify` (linhas `[PASS] <stage>` impressas por `run.sh`).

| | run 33834890154 (`workflow_dispatch`, feature/014, commit anterior) | run 33848321849 (`pull_request`, feature/014, commit posterior) |
|---|---|---|
| job `verify` (total) | 8m29s (509s) | 10m01s (601s) |
| stage `mutation` dentro do `verify` (sem Chromium — as 4 campanhas ficam `[DEFER]`) | 2m28s (148s) | 2m46s (166s) |
| job `visual` (total) | 52m54s (3174s) | 1h06m58s (4018s) |
| passo "Instalar Chromium gerenciado do Playwright + ferramentas de PDF" | 35s | 28s |
| passo "Suítes visuais (playwright + chromium P50/P52/D011)" | 7m00s (420s) | 8m04s (484s) |
| passo "Restaurar árvore" | 1s | 0s |
| passo "Campanhas de mutação com Chromium" (mesmo `check_mutation.py`, agora COM Chromium — as 4 campanhas executam de verdade) | 45m04s (2704s) | 58m14s (3494s) |
| **Delta = custo de não deferir** (campanha-com-chromium menos campanha-sem-chromium, mesmo script, mesmo commit) | **42m36s** (2556s) | **55m28s** (3328s) |

Terceira amostra, run **33869337902** (push em `develop`, merge do PR #39,
2026-09-04T11:44Z — **pós-merge**): passo de campanhas do `visual` levou **2s**
(11:53:23→11:53:25). Confirma, com número, a dívida declarada em
`mutation-matrix.json → dividas_declaradas` ("trigger por merge-base não
dispara em push na própria develop") — nada estava mudado em relação a
`origin/develop`, logo nenhuma campanha foi exigida.

**Resposta à pergunta**: as campanhas dominam, não a instalação. A instalação
do Chromium + poppler custa **28–35 segundos**; as 4 campanhas
(`p50`/`p51`/`p52`/`d014vis`) executadas de verdade custam **42–55 minutos** —
2 ordens de grandeza acima. Se o `verify` passasse a instalar Chromium e rodar
o stage `mutation` por inteiro (R-b1), ele cresceria de **~8–10 min hoje** para
**~52–67 min** nas duas amostras em que a diferença de código realmente
disparou as 4 campanhas — perto ou acima da duração atual do próprio `visual`
(53–67 min), porque o `verify` passaria a fazer quase tudo que o `visual` faz
hoje, exceto as 4 suítes Chromium em si (7–8 min, que **não** migram: `R-b1`
move só o stage `mutation`, e `check_suites.py` nunca lê o bloco `visual` de
`expected_suites.json` para execução — só para censo). Em push pós-merge
(diff vazio), o custo evaporou para segundos — mas essa amostra não serve de
referência para o custo em PR, que é o caso que importa.

**Isto tempera a recomendação do `product-owner`** (P1 do refinamento: "Custo:
minutos de CI… ainda não medida"): o texto da rodada 1·P1 lia como custo
provavelmente pequeno; medido, é o **componente dominante do pipeline inteiro**
— o `verify` passaria a ser 5–7× mais longo em PRs que tocam os alvos das 4
campanhas. Não invalida a recomendação (a promessa falsa continua sendo o
problema real, e "minutos de CI" tecnicamente ainda é verdade — só que são
40–55 deles), mas muda o que "barato" significa nesta decisão: a resposta que
o enunciado pediu é **"a rota fica cara"**.

## Medição 2 — proteção de branch em `develop`

Fonte: `gh api repos/oflavioc/quickscan-secops/branches/develop/protection` e
`gh api repos/oflavioc/quickscan-secops/rulesets` + `/rulesets/21381133`.
Token `gho_…` (conta `oflavioc`, escopos `gist, read:org, repo, workflow`) —
teve permissão suficiente: as respostas abaixo são conteúdo real, não erro de
autorização (nunca um 403).

- `GET /branches/develop/protection` → **404** `{"message":"Branch not
  protected", ...}`. Não há **branch protection clássica** em `develop`.
- `GET /branches/develop` → `protected: true`, mas
  `protection.enabled: false` e `protection.required_status_checks.
  enforcement_level: "off"` — o flag `protected` não implica regra ativa.
- `GET /repos/.../rulesets` → existe **um** ruleset ativo, `MyRuleSet` (id
  `21381133`, `enforcement: active`, criado 2026-08-25T02:40:32-03:00, mesmo
  dia da Onda 0), com `conditions.ref_name.include: ["refs/heads/develop"]`.
- `GET /rulesets/21381133` → `rules: [{"type":"deletion"}, {"type":
  "non_fast_forward"}]`. Só isso. **Nenhuma regra `required_status_checks` ou
  `pull_request`** no ruleset.

**Resposta**: hoje `develop` só está protegida contra **exclusão** e
**force-push**. **Nenhum check é obrigatório** para merge — nem `verify`, nem
`visual`, nem qualquer check pré-merge que a 016 venha a propor (R-a3). Isto
confirma, por dado e não por prosa, a frase do `product-owner`: *"sem proteção
de branch, todo gate desta demanda só decide cor"*. R-a3 (o único mecanismo de
P16.b/P16.a que **previne**, em vez de só acusar depois) não tem hoje onde se
apoiar — é ato do proprietário, fora do repositório (fora de escopo desta
demanda, confirmado).

## Medição 3 — censo de merges e de branches históricas

Fonte: `git log --oneline --merges --first-parent origin/develop` (39 merges
no total), `git branch -r`, `gh pr list --state merged --limit 100 --json
number,headRefName,baseRefName,mergedAt`, e `git show <sha-do-merge>:
.claude/project-memory/planning-state/<slug>.json` — **o commit do merge em
si** (a árvore do commit de merge já reflete o conteúdo trazido pelo PR),
não o primeiro pai.

**Branches `feature/NNN-*` que existiram** (por PR, ordenado por número de
PR): `000-estrutura-agentica` (#9), `001-onda1-enforcement` (#10 **e** #11 —
duas PRs da mesma branch, 9 min de diferença), `002-onda2-papeis-processo`
(#12), `003-marcador-duplicado` (#13), `004-onda3-tdd` (#14),
`005-onda4-reconciliacao` (#15), `007-migracao-evidencia` (#20),
`008-migracao-zips` (#21), `009-leitura-do-relatorio` (#24),
`010-recomendacao-sem-vao` (#31), `011-numeracao-das-prioridades` (#32),
`012-status-backlog` (#25), `013-integridade-da-campanha` (#29),
`014-gate-sem-poder-discriminante` (#36), `015-superficies-de-apoio` (#34).

**Não existe `006`** em lugar nenhum (`git log --all`, `git branch -r`, lista
de PRs merged) — não é lacuna a censar, é ausência confirmada. `001`, `002`,
`004`, `005` são as branches de Onda: **sem** `specs/NNN-slug/` e **sem**
planning-state — ficam fora da população por construção, exatamente como o
refinamento propõe (interseção branch-de-demanda ∩ planning-state).

**Formato da mensagem de merge**: das 39 entradas em
`--merges --first-parent`, **37** seguem `Merge pull request #N from
oflavioc/<branch>`; as **2** exceções são as integrações `main→develop`
(`3542f9f` "Merge remote-tracking branch 'origin/main' into develop" e
`9fdb2b9` "merge: integra v3.2.2 (main) na develop…") — caso de borda #14 do
refinamento, fora do julgamento de P16.a por desenho. O oráculo de mensagem
(§4, opção 2) é robusto a 100% nas branches de demanda/Onda.

**Fase no commit do merge**, para as 10 branches `feature/NNN-*` que **têm**
`specs/NNN-slug/`:

| demanda | commit do merge | phase | pr_url no momento | resultado |
|---|---|---|---|---|
| 003 | `486f3ff` | `done` | (aponta repo antigo, `.../pull/13`) | conforme |
| 007 | `590fd8b` | `done` | `.../pull/20` | conforme |
| 008 | `12a9f66` | `done` | `.../pull/21` | conforme |
| 009 | `4092463` | **`validate`** | `.../pull/24` | **mesclada sem fecho** |
| 010 | `86a4f1e` | **`validate`** | `null` | **mesclada sem fecho** |
| 011 | `4f7c140` | **`validate`** | `.../pull/32` | **mesclada sem fecho** |
| 012 | `5a8dd45` | `done` | `.../pull/25` | conforme |
| 013 | `2426582` | **`validate`** | `null` | **mesclada sem fecho** |
| 014 | `09f4342` | **`implement`** | `null` | **mesclada sem fecho** |
| 015 | `222edd5` | **`validate`** | `.../pull/34` | **mesclada sem fecho** |

**6 de 10** merges de demanda entraram com `phase != done` — exatamente as
seis citadas no refinamento (009, 010, 011, 013, 015 + "sexta" 014), agora com
o SHA do merge e o valor exato de `phase` no momento, não hoje. **Confirma,
sem ressalva, que a cláusula R-a2/R-a1 nasceria vermelha 6 vezes na história
sem o piso** — e confirma também que o **piso é indispensável**, não uma
cautela extra: sem ele, a cláusula "toda demanda mesclada tem planning-state
NNN" reprovaria adicionalmente em `001`, `002`, `004`, `005` (Ondas — merges
de `feature/NNN-*` sem *nenhum* planning-state, não apenas sem `done`).

O merge da 013 (PR #29) ocorreu em **2026-08-30T06:41:22Z**
(`gh pr list`) — bate com o "merge às 06:41:22Z" citado no refinamento
(run do job `visual` 33295007844, achado independentemente).

**Piso sugerido pelos dados** (não é decisão desta medição, é o que os números
permitem): qualquer commit **após** o merge da Onda 4
(`6dad53d`, PR #15, 2026-08-25T17:42:35Z) e **antes** do merge da 007
(`590fd8b`, 2026-08-26T00:15:31Z) exclui as cinco Ondas sem julgar nenhuma
demanda real — `003` já está conforme e cai fora do piso de qualquer forma
(mesclada às 15:35Z, antes da própria Onda 4), sem prejuízo.

## Medição 4 — quatro verificações menores

1. **`origin/develop` no checkout de `pull_request`**: **presente**. Log bruto
   do passo `actions/checkout@v7` no job `verify` do run 33848321849 (evento
   `pull_request`) mostra `git fetch --no-tags --prune --no-recurse-submodules
   origin +refs/heads/*:refs/remotes/origin/* +refs/tags/*:refs/tags/*
   +<sha>:refs/remotes/pull/36/merge`, seguido de `* [new branch] develop ->
   origin/develop` entre as ~20 branches trazidas. `fetch-depth: 0` traz
   **todos** os refs de heads, não só o do PR — confirmado por observação
   direta do log, não por inferência da flag.
2. **`git merge-base --is-ancestor` com os SHAs curtos** `5bf4731` (011),
   `71b4347` (014), `f084c02` (015): os três objetos existem
   (`git cat-file -e`) e os três comandos retornaram **exit 0** (são
   ancestrais de `origin/develop`, sem erro de ambiguidade) nesta árvore.
   O caso de borda "SHA curto ambíguo" citado no refinamento **não se
   materializou** para estes três — mas isto testa só a base atual; não prova
   que nunca haverá colisão de prefixo (esse risco é inerente a qualquer SHA
   abreviado, não específico destes três).
3. **Árvore limpa após as campanhas no `verify`**: `check_mutation.py:1354-1366`
   já tem uma guarda própria — restaura por nome cada `receipts` declarado
   (`mutation_map.json`, ex.: `docs_phase5/evidence_p50/P50-5.0.5-mutation.
   json`, `docs_phase5/evidence_p52/P52-mutation.json`) e, ao final, roda
   `git status --porcelain`; qualquer resíduo vira `[FAIL] campanha sujou a
   árvore`. Nos dois logs do `verify` inspecionados (runs 33834890154 e
   33848321849), **nenhuma linha** `recibo restaurado` nem `campanha sujou`
   apareceu — mas isso mede o stage `mutation` **sem Chromium**, com as 4
   campanhas em `[DEFER]` (nunca tocaram os arquivos). **Não medido**: se o
   `verify` chegasse a executar de fato a campanha `p50` com Chromium (R-b1),
   e o oráculo dessa campanha invocar `tests_p50_chromium.js` (a mesma suíte
   que a E9 documenta sujando `docs_phase5/evidence_p50/*.json` como efeito
   colateral, hoje limpa pelo passo dedicado "Restaurar árvore" do `visual`,
   que roda **antes** de `check_mutation.py` e que o `verify` não teria) —
   a guarda de `receipts` cobriria só o arquivo de mutação nomeado, não
   necessariamente todo `evidence_p50/*.json` sujado pela suíte em si. Motivo
   de não medir agora: exigiria rodar de fato o Chromium dentro do `verify`,
   o que é o próprio código da rota ainda não escrito — é a pendência 4 do
   refinamento, e continua pendência real, não resolvida por esta medição.

## Execução

Nenhuma suíte, stage ou build foi rodado localmente para esta medição — só
`git`, `gh api` e `gh run view --json/--log` contra o histórico e o CI real do
repositório `oflavioc/quickscan-secops`. Toda leitura de planning-state usou
`git show <sha>:<path>`, nunca o arquivo do working tree.
