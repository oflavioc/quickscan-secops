# Plano — 016-registro-contra-execucao

> Fase 2 · dono: tech-lead · consome a [spec.md](spec.md) aprovada no portão da
> Fase 1 (2026-09-04) **com a errata E1** (check pré-merge em job próprio
> `fecho`; três checks obrigatórios) e a **E2** (a prova de carga de C1(a) recua
> o piso). Propõe, não delega: a execução é do orquestrador. Tipagem das tarefas
> é da Fase 3.

## Desenho

### Camada e superfície

**Nenhum byte de produto muda.** A entrega inteira vive na camada de
**verificação e processo**: `.claude/verify/**`, `.github/workflows/verify.yml`,
`compliance-audit.sh`, o schema do planning-state e quatro documentos de processo
(skill, R4, glossário, decisões). Engine, Camada 1, HTML gerado, módulos `ui_*`,
suítes congeladas: byte-intactos (cross-check da spec; reconferido nesta fase por
`git diff --stat 921977c..HEAD` — só `specs/016-*`, o planning-state e o
`pins.json` regenerado pelos repins das Fases 0–1).

A propriedade P16 tem **três mecanismos**, e o desenho os separa pela
**necessidade de ambiente** — a tensão que o orquestrador nomeou: dois não
precisam de rede e um não vive sem ela.

| mecanismo | direção | onde roda | precisa de | rede |
|---|---|---|---|---|
| **stage `fecho`** — `check_fecho.py` | pós-merge (C1–C4): `origin/develop` × planning-states | `run.sh` local, hook Stop (`--light`), job `verify` do CI (o único que executa `run.sh`, `verify.yml:40`) | `git` de leitura, `refs/remotes/origin/develop`, planning-states, `fecho.json`, artefatos em `spec_dir`, `git log -1 --format=%cI HEAD` | **não** |
| **job `fecho`** — `check_fecho.py --pr` | pré-merge (C5): o PR × o planning-state da sua demanda | `verify.yml`, job próprio, **todo** evento do workflow | `GITHUB_HEAD_REF`/`GITHUB_BASE_REF` + árvore (planning-state, `spec_dir`, `fecho.json`); checkout raso | **não** |
| **seção `branch-protection`** — `check_branch_protection.py` | C6: a proteção de `develop` × `branch_protection.json` | `compliance-audit.sh` — job `verify` do CI e rito manual; **nunca** no hook Stop | API do GitHub + token (T6) | **sim** |

Consequência estrutural: `check_fecho.py` e `fecho.py` **não importam**
`urllib`, `http`, `socket` nem `ssl` (conferido na Fase 4 por leitura e
registrado na `_trilha` do `d016`); a rede vive **só** em `branch_protection.py`,
sob a política T7 (WARN local nomeado / FAIL no CI — precedente EB-5,
`check_evidence_bridge.py:32-36`). Nenhum stage do `pipeline.yaml` toca rede.

### Módulos — um dono por arquivo

O ponto que exigiu decisão: nesta demanda **o script é o gate**. Para manter
"autor do gate ≠ implementador" (R3 §2) **por arquivo** e não por seção de
arquivo, cada script se parte em **gate** (o que prova: sonda, leitura →
julgamento → relato, exit) e **instrumento** (o que decide e o que lê). É o
molde da 014 (`tests_014_regra_morta.js` do `qa-engineer` × `regra_morta.js` do
`build-engineer`), aplicado a python.

| módulo | papel | dono |
|---|---|---|
| `.claude/verify/check_fecho.py` | **gate** do stage e do check: CLI (`--pr`, `--sonda`, `--json`), sonda (C7) → leitura → julgamento → relato no vocabulário T10, exit | `qa-engineer` |
| `.claude/verify/fecho.py` | **instrumento**: `julgar_pos_merge()` e `julgar_pre_merge()` **puros** + leitores `ler_estados()`, `ler_merges()`, `ler_ancestralidade()`, `ler_data_commit()`, `ler_artefatos()`; enum `VEREDITOS` | `core-engineer` |
| `.claude/verify/check_branch_protection.py` | **gate** da seção: CLI (`--sonda`, `--fixture`, `--json`), sonda → leitura → classificação → relato; política T7 | `qa-engineer` |
| `.claude/verify/branch_protection.py` | **instrumento**: `classificar()` **puro** + `ler_api()` (urllib, timeout, fonte do token impressa, token nunca) | `build-engineer` |
| `.claude/verify/fecho.json` | registro: piso, `excluidas_por_r13`, `populacao`, `sonda` (26 esperados), `_meta.prova_de_carga` | `qa-engineer` |
| `.claude/verify/branch_protection.json` | expectativa (3 checks, `up_to_date`) + `sonda` (9 esperados) | autor na wave 1: `qa-engineer`; **owner do estado**: `build-engineer` (abaixo) |
| `.claude/verify/fixtures_016/fecho/*.json` (26) · `fixtures_016/protecao/*.json` (9) | fixtures da sonda — **dado, sem código** | `qa-engineer` |
| `tests_016_mutants.js` | harness `d016` | `qa-engineer` |
| `.claude/verify/pipeline.yaml` | stage `fecho` | `build-engineer` |
| `.github/workflows/verify.yml` | job `fecho` | `build-engineer` |
| `.claude/verify/compliance-audit.sh` | seção `branch-protection`, `aviso()`, 3ª fonte em `known-issues`, `fecho_pendente` em `waivers` | `build-engineer` |
| `.claude/templates/planning-state.schema.json` | `branch` em `required`; `fecho_pendente` | `data-engineer` |
| `.claude/verify/mutation_map.json` · `mutation-matrix.json` | `d016`; pares; desfecho anexado à dívida "Borda 8" | `qa-engineer` |
| `.claude/skills/new-demand/SKILL.md` · `.claude/rules/sdd.md` · `.claude/rules/design-decisions.md` · `.claude/BACKLOG.md` · `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md` | C8, C10, ADR | `doc-writer` |
| `CONTEXT.md` | C9 | `product-owner` |
| `.claude/project-memory/planning-state/016-registro-contra-execucao.json` | fases, `red.commit`, `pr_url` | orquestrador (skill) |
| `.claude/hooks/state-eval.sh` (opcional, R-a6) | distinguir "mesclada sem fecho" de "em voo" | `build-engineer` |

Regras do corte, para quem executa:

- O **gate nunca decide**: um `if` que produza veredito dentro de
  `check_fecho.py` é FAIL de revisão. Ele importa `VEREDITOS` e as funções do
  instrumento; compara enums, nunca strings que não importou.
- O **instrumento nunca relata**: sem `print`, sem `sys.exit`; devolve dados.
  Quando o implementador precisar de mudança no gate, volta por `DEPENDÊNCIAS`
  ao `qa-engineer` — o implementador **não edita** o gate (R3 §2).
- `julgar_*`/`classificar` recebem **tudo por parâmetro** (T3): a sonda e a
  árvore real chamam a mesma função; a sonda nunca chama leitor.

### Owner do estado (R9 §5, aplicado a processo) — e o que entra no registry

Três dados novos. O critério é o de `design-decisions.md` ("planning-state fora
do registry"): **estado de processo, que muda por fase ou evento e é validado
por stage próprio, fica fora dos pins; identidade e régua ficam dentro.**

| dado | owner do estado | quem escreve | quem decide com ele | pins |
|---|---|---|---|---|
| `fecho_pendente` (no planning-state) | o **planning-state** | skill `new-demand` / orquestrador, por PR `chore/*` **depois** do merge (T5) | só `check_fecho.py`; `compliance-audit` e `state-eval` apenas **listam** | **fora** — é estado por evento; `.claude/project-memory/**` já é exclusão do `gen_pins.py:29` |
| `fecho.json` | `qa-engineer` | `qa-engineer` (wave 1; `_meta.prova_de_carga` fixada na wave 5) | `check_fecho.py` | **dentro** — é régua: o piso é âncora de identidade (R10 §5), as exclusões são registro R13, os totais da sonda são contagem pinada (R10 §3). Análogos: `regra_morta.json`, `evidence_bridge.json` |
| `branch_protection.json` | `build-engineer` | wave 1: `qa-engineer` (os valores são a decisão do usuário, transcrita — não há juízo de engenharia); depois, só o `build-engineer`, quando a expectativa mudar | `check_branch_protection.py` | **dentro** — é **expectativa de identidade de configuração**, não estado: só muda por ato de governança (o proprietário acrescenta ou remove um check obrigatório), como os pins `declared`. Deixá-lo fora exigiria editar a lista de exclusões do `gen_pins.py` (ato de governança sobre o registry) e o deixaria sem validação alguma além do próprio consumidor; o planning-state fica fora porque o stage `state` o valida — este arquivo não tem esse segundo par de olhos |

Por que o owner de `branch_protection.json` é o `build-engineer` e não o
`qa-engineer` que o escreve na wave 1: o dado descreve **configuração de CI**
(domínio de build/pipeline); quem vai ao painel do GitHub conferir um contexto
novo e quem mede a permissão do token é ele. A sonda dentro dele é critério de
aceite (QA) — e como os dois blocos vivem no mesmo arquivo, a regra é **um autor
por wave**: QA na 1, `build-engineer` só se a expectativa mudar (nesta demanda,
não muda depois da wave 1).

## O job `fecho` (E1) — as cinco decisões

1. **Quando roda: em todo evento do workflow** (`pull_request` para
   `develop`/`main`, `push` para `develop`/`main`, `workflow_dispatch`), **sem
   `if:` e sem `needs:`**. Não é descuido: (a) R10 §2 — um job pulado por `if:`
   aparece como `skipped`, que não diz nada; um job que roda e imprime
   `NÃO JULGADO (evento sem base — push)` diz o que não julgou e por quê;
   (b) não dependemos da semântica que o GitHub dá a `skipped` em check
   obrigatório — o job **reporta sempre**; (c) sem `needs: [verify]`, um
   `verify` vermelho não arrasta o `fecho` para `skipped` — seria conflatar de
   novo os dois sinais que a E1 separou.
2. **O que o checkout precisa: nada além da árvore.** `actions/checkout@v7` com
   a profundidade padrão. O julgador pré-merge lê `GITHUB_HEAD_REF`,
   `GITHUB_BASE_REF`, o planning-state `NNN`, os dois artefatos em `spec_dir` e
   `fecho.json → excluidas_por_r13` — **nenhum histórico, nenhum
   `origin/develop`**. A medição do `build-engineer` (§Medição 4.1:
   `origin/develop` presente com `fetch-depth: 0`) serve ao **stage** `fecho`
   dentro do job `verify`, que já tem `fetch-depth: 0`; o job `fecho` não paga o
   histórico completo. Em `pull_request` a árvore é a do merge ref
   (`refs/pull/N/merge`), que contém o planning-state do PR — é o que se quer
   julgar.
3. **Toolchain: python, só.** `actions/setup-python@v7` com `3.12`, por paridade
   com o `verify`; sem node, sem `npm ci`, sem Chromium. Um passo. Custo
   estimado em dezenas de segundos — **a medir no primeiro run** (wave 4,
   `build-engineer`), nunca prometido.
4. **Comportamento por contexto** — sempre uma linha, sempre com motivo:

   | evento / head | saída | exit |
   |---|---|---|
   | `pull_request` de `feature/NNN-*` → `develop`, `NNN` em `done` + artefatos, sem válvula | `LIBERADO · feature/NNN-… → develop · NNN em done · artefatos presentes` | 0 |
   | idem, `phase != done` | `FECHO PENDENTE da demanda NNN (fase X) — merge bloqueado até done` | **1** |
   | idem, sem planning-state | FAIL `demanda fora da máquina` | **1** |
   | idem, `done` **com** `fecho_pendente` | FAIL (T5) | **1** |
   | `pull_request` de `chore/*`, `fix/*`, `hotfix/*` | `NÃO JULGADO (fora da população: chore/x)` | 0 |
   | `pull_request` → `main` (release) | `NÃO JULGADO (base main: release, R14)` | 0 |
   | `push`, `workflow_dispatch` | `NÃO JULGADO (evento sem base — push/workflow_dispatch)` | 0 |

5. **Nome = contexto.** Job id `fecho`, sem `name:` — como `verify` e `visual`
   (ids sem `name:`, contextos conferidos no run 33869337902). É o que
   `branch_protection.json → checks_obrigatorios` espera. O nome coincide com o
   do **stage** `fecho` de propósito: uma propriedade, duas direções; os dois
   cabeçalhos dizem isso.

```yaml
  fecho:
    # E1 da spec 016: check PRÓPRIO, não passo do `verify`. Um `verify` vermelho a
    # demanda inteira ensina que vermelho é normal (EA-5); este check vermelho diz
    # algo verdadeiro: "a demanda ainda não fechou". Sem `needs:` e sem `if:` —
    # fora de PR de demanda ele RODA e responde `NÃO JULGADO (<motivo>)` (R10 §2).
    # Direção pós-merge (stage `fecho` do pipeline.yaml) roda no job `verify`.
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Fecho da demanda antes do merge (D016-PR1 — P16.a)
        run: python .claude/verify/check_fecho.py --pr
```

`verify.yml:42` (`MUTATION_DEFER_MISSING`) e os jobs `verify`/`visual` ficam
byte-idênticos (T9). Nenhum bloco `permissions:` — o job não fala com a API.

**Sequência com P2.** O contexto `fecho` só existe para o GitHub depois do
primeiro run em que o job reportou. Logo: o proprietário configura P2 (ruleset,
três contextos, *strict*) **depois** do push da wave 4 e **antes** do
`relatorio-final.md` (wave 7), que cita o run em que `D016-PROT1` ficou verde.

## O stage `fecho` (T8-a) — local, paralelo, sem rede

```yaml
  fecho:
    desc: "P16.a pós-merge: demanda mesclada em origin/develop sem Fase 6 fechada (FEC1), feature/NNN mesclada após o piso sem planning-state ou fora de PR (FEC2), done sem artefatos salvo exclusão R13 impressa (FEC3), válvula fecho_pendente julgada contra a data do commit (FEC4) — sem rede; sonda de 26 casos pinada antes da árvore (C7). Direção pré-merge é o job `fecho` do CI"
    run: python .claude/verify/check_fecho.py
    parallel: true
    mutates: false
    heavy: false
```

Posição: **depois de `tdd`** — mesma família (`state` → `tdd` → `fecho`: o
planning-state é válido, o red é auditável, o merge cobrou o fecho). Entra no
`--light`: hoje 11 stages (15 declarados, 4 `heavy`), passa a **12**; o hook
Stop o executa a cada turno. Custo estimado abaixo de 1 s (um `git log --first-parent`
com `%P` *(ET2)*, no máximo 11 `git merge-base --is-ancestor`, 11 JSON, 26
fixtures) — fixado por execução na wave 5, não prometido.

Ordem interna, sempre: **sonda → leitura → julgamento → relato**. `--sonda` para
após a sonda e emite o JSON; `--json` emite o objeto completo; nos dois, o texto
humano vai a stderr (R10 §6; T6 da 013).

`origin/develop`: o stage julga **o ref local** `refs/remotes/origin/develop` e
imprime o SHA julgado (borda 9) — desatualizado localmente é responsabilidade do
operador (`git fetch origin develop`), nunca uma chamada de rede do gate. Ausente
⇒ `[FAIL] NÃO DETERMINÁVEL (…)` (C1 e), nunca SKIP. No CI: presente em
`pull_request` (§Medição 4.1); em `push` o mesmo `fetch-depth: 0` traz todos os
heads — **a confirmar no primeiro push pós-merge** (`build-engineer`, relatório
final). Se faltar, o vermelho é nomeado, não silencioso.

Duas nuances **declaradas** (não corrigidas, porque só apertam):

- Em `pull_request`, `HEAD` é o merge ref sintético e `%cI` é a hora em que o
  GitHub o criou — T4 lê essa data. Uma válvula "vence" no PR antes de vencer no
  commit real: **mais estrita no CI, nunca mais frouxa**; localmente e em `push`
  a data é a do commit.
- No PR da própria demanda, o stage vê a demanda `EM VOO` (o merge não está em
  `origin/develop`) — borda 6. Quem a julga é o job `fecho`.

## A sonda pinada — onde mora e como não vira o gate

**Onde.** Fixtures em `.claude/verify/fixtures_016/fecho/` (26 arquivos,
`F01.json`…`F19.json`, `P1.json`…`P7.json`) e
`.claude/verify/fixtures_016/protecao/` (9: `hoje`, `esperado_ruleset`,
`sem_visual`, `sem_fecho`, `strict_false`, `classic_off`, `classic_on`,
`http_403`, `sem_rede`). Cada fixture carrega **só entradas** (estados, merges
com `posicao_relativa_ao_piso`, ancestralidade pré-resolvida, artefatos
existentes, `data_do_commit`, `head_ref`/`base_ref`; para a proteção, as duas
respostas de API como `{status, body, erro}`). O **veredito esperado** vive em
`fecho.json → sonda.casos[{id, esperado}]` e `branch_protection.json →
sonda.casos` — pinados. Paths dentro das fixtures são relativos ao repositório
(a seção `paths` do `compliance-audit` varre `.claude/verify` por caminho
absoluto).

**Como não vira o gate** — cinco guardas, cada uma com quem a mata:

1. **Estrutural.** A sonda exercita **só** `fecho.julgar_*` /
   `branch_protection.classificar` (puros). O gate real exercita `ler_*` **e**
   `julgar_*`. O comando do `pipeline.yaml` é o **nu** (`check_fecho.py`), que
   faz os dois; `--sonda` é modo de diagnóstico e do harness.
2. **Três contagens que têm de coincidir**: número de arquivos na pasta ==
   `len(sonda.casos)` == `sonda.total`. Qualquer divergência ⇒ FAIL nomeando o
   id (caso sem fixture, fixture sem caso, total errado). `D016-M16` (laço vazio)
   morre aqui; um "apagar uma fixture" também.
3. **Dentes na árvore, não na sonda** — o que prova que a **leitura** funciona:
   (a) **prova de carga** medida por execução na wave 5 e gravada em
   `fecho.json → _meta.prova_de_carga`: sem o piso, FEC2 acusa **6 merges / 5
   branches** de Onda; sem as três exclusões, FEC3 acusa **003 (2), 009 (1),
   010 (1)** — reconferido em disco nesta fase (003 sem os dois artefatos; 009 e
   010 sem `spec-validate.md`; as outras sete com ambos); com o piso recuado para
   `6dad53d` e 015 em `validate`, FEC1 acusa **015** por `oráculo: mensagem #34`
   (E2). (b) **Mutante de árvore no harness** — candidato para o `qa-engineer`
   alocar (`≥ D016-M17`, sem reutilizar `M1`–`M16`): mutar **dois arquivos**
   in-place com restauração por SHA (`fecho.json → piso` para `6dad53d` e
   `015-superficies-de-apoio.json → phase: validate`) e exigir que o gate nu
   reprove nomeando 015 e o oráculo — é a prova de carga automatizada, no molde
   do `D014-M4` (que planta uma regra morta real). (c) **Bateria adversarial** da
   Fase 4, manual, em cópia efêmera: `git update-ref -d
   refs/remotes/origin/develop` ⇒ `NÃO DETERMINÁVEL`; `GITHUB_TOKEN=invalido` ⇒
   `NÃO DETERMINÁVEL (permissão 401)`.
4. **Red ao vivo, fora de qualquer sonda**: o check `fecho` do PR da 016
   vermelho até o `done` (`D016-PR1`); `D016-PROT1` `DESPROTEGIDA` até P2.
5. **Sem regex sobre prosa** (R10 §6): a sonda compara o enum `VEREDITOS`
   importado do instrumento; o harness lê o JSON de `--sonda` e compara ids de
   caso, nunca a saída PT-BR.

O que a sonda **prova**: o mecanismo de decisão. O que ela **não prova**: que a
leitura do mundo está certa (guarda 3) e que o estado do mundo é o desejado
(guarda 4). A spec já escreve essa distinção (T3); o plano dá a cada metade seu
carrasco.

## Contratos e registros

- **Bridges**: nenhum. `bridges.json` não muda. **Patch-points**: nenhum — nada
  é estendido por monkey-patch; `check_state.py`, `check_tdd.py`,
  `check_mutation.py`, `env_doctor.py` byte-idênticos (T9). **Ordem de injeção
  no builder**: não se aplica.
- **Assinaturas do instrumento `fecho.py`** (contrato gate ↔ instrumento e
  fixture ↔ julgador; o `qa-engineer` escreve as fixtures contra isto):

  ```
  VEREDITOS = {CONFORME, MESCLADA_SEM_FECHO, FECHO_PENDENTE_DECLARADO, EM_VOO,
               ANTERIOR_AO_PISO, FORA_DA_POPULACAO, NAO_DETERMINAVEL,
               LIBERADO, FECHO_PENDENTE, NAO_JULGADO}          # T10, fechado

  julgar_pos_merge(estados, merges, ancestralidade, artefatos, data_do_commit,
                   registro, origin_develop)
      -> {sujeitos: [{id, tipo, veredito, oraculo, oraculo_detalhe, fase, codigo, detalhe, falha}],
          globais, contagens, problemas}        # (ET3) globais: impeditivos + exclusao-malformada;
                                                #       shape completo no docstring do gate
     estados        dict slug -> conteúdo do planning-state
     merges         list first-parent de origin/develop, mais recente primeiro:
                    {sha, data, msg, posicao_relativa_ao_piso: anterior|piso|posterior}
     ancestralidade dict slug -> {resposta: true|false|null, causa, anterior_ao_piso}  (ET1;
                    T1 secundário,
                    pré-resolvido pelo leitor; null = "oráculo não responde", borda 8)
     artefatos      set de paths relativos existentes
     data_do_commit "AAAA-MM-DD" (T4)
     registro       fecho.json (piso, excluidas_por_r13, populacao)
     origin_develop {presente: bool, sha: str|null, causa}              (C1 e)

  julgar_pre_merge(head_ref, base_ref, estados, artefatos, registro)
      -> {veredito, motivo, demanda, fase}
  ```

  Leitores: `ler_estados()`, `ler_merges(piso)` *(ET2: cadeia inteira, `%P`)*,
  `ler_ancestralidade(estados, piso)` *(ET1)*
  (`git rev-parse --verify <sha>^{commit}` antes de `merge-base --is-ancestor`;
  ambíguo ⇒ `null` com causa), `ler_data_commit()`, `ler_artefatos(estados)`.
  `git` por lista de argumentos, sem shell (R10 §7). Nada escreve (R7 §3).
- **`branch_protection.py`**: `classificar(rules, branch, esperado, modo_ci) ->
  {veredito, faltam, mecanismo, contextos, strict, outras_regras, avisos,
  severidade}` com `rules`/`branch` = `{status, body, erro}`;
  `ler_api(repo, ref)` — dois GETs, timeout, redirect sem token (forma de
  `check_evidence_bridge.py`), `GITHUB_REPOSITORY` → `git remote get-url origin`,
  fonte do token impressa, token nunca.
- **Fixture da sonda `fecho`** (um JSON por caso): `{id, modo: "pos"|"pre",
  estados, merges, ancestralidade, artefatos, data_do_commit, registro,
  origin_develop, head_ref, base_ref}` — o esperado **não** fica na fixture.
- **`fecho.json`**: shape da spec §Contratos; `_meta.prova_de_carga` ganha três
  chaves (`piso`, `exclusoes`, `fec1`) preenchidas **por execução** na wave 5 —
  até lá, o literal `"a medir na Fase 4/5"`.
- **`branch_protection.json`**: `checks_obrigatorios: ["verify","visual","fecho"]`,
  `sonda.total: 9` (E1).
- **`mutation_map.json → d016`**: `cmd: "node tests_016_mutants.js"`,
  `preflight: true` **no mesmo commit** em que o harness lê `--preflight` (D4 da
  013), `requires: ["node","python"]`. **`targets` explícitos, arquivo a
  arquivo** — medido: `check_mutation.py:1287` decide por `t in changed`
  (pertinência exata num `set` de paths do `git diff --name-only`); a notação
  `fixtures_016/**` da spec **não casa nada**. Entram: os 4 scripts, os 2
  registros, os 35 arquivos de fixture, o harness. Desvio que **endurece** o
  gatilho (precedente d014).
- **`check_suites.py:50-51`** registra como suíte todo `cmd` de harness do
  `mutation_map.json` e reprova `tests_*.js` fora do registro (`:53-56`): o
  harness e a entrada `d016` **nascem no mesmo commit**. `expected_suites.json`
  não muda.
- **`compliance-audit.sh`**: `aviso()` com contador `WARN`; linha final
  `compliance: N PASS · N FAIL · N WARN`, exit continua `$FAIL` (reconferir na
  wave 4 que nenhum consumidor parseia a linha: `grep -rn "compliance:" .claude/
  .github/`); seção `branch-protection` chama `check_branch_protection.py --json`
  e classifica pela `severidade` do JSON (`PASS`/`FAIL`/`WARN`), nunca por regex
  sobre a prosa; `known-issues` ganha `fecho.json → excluidas_por_r13` como
  **terceira fonte** (estrutural: `fonte` obrigatória, sem prazo — a classe
  `ESTRUTURAIS` do bloco `regra-morta`); `waivers` lista `fecho_pendente` **pela
  chave JSON**, ao lado de `tdd_waiver`.
- **Schema**: `required: ["demanda","phase","spec_dir","branch"]`;
  `fecho_pendente` com `required: ["motivo","dono","prazo"]`, `pattern`
  `^\d{4}-\d{2}-\d{2}$` em `prazo`/`declarado_em`. `check_state.py` não valida
  por biblioteca e não muda; quem julga a forma é o stage `fecho`.
- **Pins**: todo arquivo criado/alterado é rastreado e pinado, exceto o
  planning-state. `gen_pins.py` pina blobs de **HEAD** ⇒ repin é sempre commit
  `chore` **posterior**, um por commit de conteúdo (série abaixo). Medido agora:
  `check_baseline` em `50f289d` responde `392/392 · 0 sem pin`; os dois commits
  desta entrega (errata, plano) deixam **1 divergente + 1 sem pin** até o R0.

## Arquivos de processo (P7) — rito e quem escreve

`SKILL.md:66` e `sdd.md` (§Gates de fase) mudam pela redação de C8. São arquivos
de **processo**, não de produto:

| pergunta | resposta |
|---|---|
| Classe de boundary? | **Nenhuma.** Não estão em `boundary.json`, em `permissions.deny`, em `PROTECTED`/`frozenSuites` (cross-check da spec, negativo explícito). `guard-boundary` não dispara |
| Quem decidiu a mudança? | O usuário, no portão da Fase 0 (**P7**), com a redação fixada na spec (C8) e aprovada no portão da Fase 1 |
| Quem escreve? | `doc-writer` — os dois arquivos num **só commit** `doc(016): C8 — done sem CI verde; CI verde é condição do merge (P7)`, com a redação da spec §Superfície 5 (ajuste de estilo permitido, sentido não). `product-owner` confere a intenção na Fase 6 (é regra de processo, e o aceite de intenção é dele) |
| Rito de máquina? | São **pinados** (`.claude/rules/*`, `.claude/skills/*`) ⇒ repin R6a. Nenhum hook nem seção do `compliance-audit` parseia a prosa deles; `spec-validate` confere C8 por leitura |
| Quando? | **Wave 6**, depois do green — o texto passa a descrever o que os gates já cobram (C8: "a frase descreve o que os gates cobram, não o contrário") e antes do `done` da própria 016, que já segue a frase nova |

Mesmo rito para `design-decisions.md` (C10-d: linha KI-3 e linha nova),
`CONTEXT.md` (C9, `product-owner`), `BACKLOG.md` (C10-b, gramática da 012 —
`EA-33 → resolvido` **na wave 7**, no fecho da Fase 6) e o ADR (decisão do
portão; se o orquestrador o vetar, nada mais muda).

## Boundary

**Classe tocada mais alta: nenhuma** (produto/verificação). Reconferido nesta
fase contra as três fontes: `boundary.json` (`frozen` 4 paths, `generated` 2,
`legacy` 2, `registry` 1 — nenhum arquivo desta demanda), `permissions.deny`
(espelho), `PROTECTED`/`frozenSuites` de `tests_p50_core.js` (zero ocorrências
dos arquivos tocados — cross-check da spec). `pins.json` só via `gen_pins.py`.

**Não há rito D2 e não há PARADA.** O rito é o comum: R3 (red commitado; autor
da sonda/fixtures/gates ≠ autor dos instrumentos), R8 §1 (repin no mesmo PR,
commit separado), R10 §3/§9 (harness no `mutation_map.json`, stage no
`pipeline.yaml`), R12 (ids permanentes). Um ponto verificado e liberado: o
harness `d016` muta `fecho.json` e um planning-state **in-place com
restauração** — nenhum dos dois é `PROTECTED`/`frozen`; precedentes `D014-M4`
(muta `ui_p50_v32.css` real) e `D011-M18` (muta `build_v32_html.py`).

## Checklist R9 (módulo novo)

Não há módulo de **produto**; `lint-arch` varre `ui_p5*`/`ui_d0*`. Aplicado por
disciplina aos scripts de processo:

- [x] IIFE + `__installed` — **N/A**
- [x] um bridge registrado — **N/A** (nenhum bridge)
- [x] CSS por prefixo — **N/A**
- [x] zero `innerHTML=` — **N/A** (python; vale para o harness node)
- [x] **≤600 linhas** — estimativas: `fecho.py` ~350, `check_fecho.py` ~200,
      `branch_protection.py` ~200, `check_branch_protection.py` ~150. Gatilho de
      divisão declarado: `fecho.py` acima de 600 separa os leitores em
      `fecho_leitura.py`; decisão do implementador, motivo no commit
- [x] **helper único por semântica**: o padrão de população
      (`^feature/(\d{3})-`), as mensagens de integração de `main` e o formato
      `Merge pull request #N from <owner>/<branch>` vivem **em dado**
      (`fecho.json → populacao`) e são compilados **uma vez** em `fecho.py`; o
      enum `VEREDITOS` existe uma vez e é importado pelo gate e lido pelo harness
      (via JSON). Comparação literal duplicada no gate é FAIL de revisão
- [x] `sys.stdout.reconfigure(encoding="utf-8")` nos quatro scripts (R7 §2,
      forma da casa); nenhum caminho absoluto (seção `paths` do audit)

## Medição de campanhas — o que dispara, e onde fecha

`check_mutation.py:466-471` calcula o diff contra `merge-base(HEAD,
origin/develop)` = `921977c`; `:1287` decide por pertinência exata em `targets`.
Censo feito nesta fase por script sobre `mutation_map.json`: **nenhum** arquivo
que a 016 cria ou edita é `target` de harness existente (o único harness com
alvos em `.claude/verify/` é o `d014`, com `regra_morta.js` e
`regra_morta_seletor.js`, intocados).

| arquivo que a demanda edita/cria | campanha disparada | ambiente | fecha onde |
|---|---|---|---|
| `check_fecho.py` · `fecho.py` · `check_branch_protection.py` · `branch_protection.py` · `fecho.json` · `branch_protection.json` · `fixtures_016/**` · `tests_016_mutants.js` | **`d016`** | node + python | **nesta máquina** |
| `pipeline.yaml` · `verify.yml` · `compliance-audit.sh` · `planning-state.schema.json` · `mutation_map.json` · `mutation-matrix.json` · `SKILL.md` · `sdd.md` · `CONTEXT.md` · `design-decisions.md` · `BACKLOG.md` · ADR · `specs/016-*/**` | nenhuma | — | — |

Consequências: o job `visual` deste PR roda só as suítes (7–8 min medidos na
Fase 0); o passo de campanhas responde `0 exigida(s)`; a lista de `[DEFER]` do
`verify` é **vazia**; nenhum par fica "deferido ao CI". O único fecho que depende
do CI é **medição** (permissão do token; duração do job `fecho`; `origin/develop`
em `push`), não veredito — declarado no relatório final com o número do run.

## Waves

Dependência real dita a ordem: **dado antes de quem o lê** (1 → 2), **gate antes
da implementação** (2 → 3), **instrumento antes do cabeamento** (3 → 4),
**registro de campanha depois do green** (5), **texto depois do que ele
descreve** (6), validação por último (7).

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **0** | Errata E1/E2 na spec (feita nesta entrega); planning-state → `plan`; repin **R0** (spec + `plan.md` + `tasks.md`) | — |
| **1** | **Dados e contratos** `[P]`: (a) `qa-engineer` — `fecho.json` (piso, exclusões, população, `sonda` 26 esperados, `_meta.prova_de_carga` a medir) + `fixtures_016/fecho/` (26) + `branch_protection.json` (3 checks, `sonda` 9) + `fixtures_016/protecao/` (9); (b) `data-engineer` — schema (`branch` obrigatório, `fecho_pendente`). Repins R1a/R1b | 0 |
| **2** | **RED** — `qa-engineer`: `check_fecho.py` e `check_branch_protection.py` (gates completos: CLI, sonda, leitura → julgamento → relato) importando `fecho`/`branch_protection` **que ainda não existem**; instrumento ausente ⇒ cada caso da sonda sai `obtido: INSTRUMENTO AUSENTE` ≠ esperado ⇒ **26 + 9 divergências nomeadas**, exit 1; `--pr` com `GITHUB_HEAD_REF=feature/016-…`/`GITHUB_BASE_REF=develop` ⇒ FAIL. Saída integral em `specs/016-registro-contra-execucao/red-016.md`; commit `test(016): red — sondas D016 (26 + 9 divergências; instrumentos ausentes)`; planning-state `red.status: proven`. **Nada entra no `pipeline.yaml` ainda** — o red se prova executando o gate, sem abrir janela vermelha no `--light` do hook Stop. Repin R2 | 1 |
| **3** | **Instrumentos** `[P]`: `core-engineer` — `fecho.py` (julgadores puros + leitores) até `check_fecho.py --sonda` responder 26/26 e a sonda de `--pr` 7/7; `build-engineer` — `branch_protection.py` (classificador puro + leitor HTTP, política T7) até `--sonda` 9/9. Nenhum dos dois edita o gate. Repins R3a/R3b | 2 |
| **4** | **Cabeamento** — `build-engineer`, sequencial: (a) `pipeline.yaml` stage `fecho` + `verify.yml` job `fecho` (um commit); (b) `compliance-audit.sh` (seção `branch-protection`, `aviso()`, 3ª fonte, `fecho_pendente`) — **por último**, porque liga o vermelho de `D016-PROT1` no `verify`. Push: primeiro run com o job `fecho` (vermelho: 016 não está `done` — **red ao vivo de `D016-PR1`**), `verify` vermelho em `branch-protection` (`DESPROTEGIDA` — **red ao vivo de `D016-PROT1`**); medir permissão do token, duração do job, `origin/develop`. Repins R4a/R4b | 3 |
| **P2** | **Ato do proprietário, fora do repositório**: ruleset de `develop` com `required_status_checks` = `verify`, `visual`, `fecho` + *strict*. Depois do primeiro run da wave 4 (o contexto `fecho` precisa existir), antes da wave 7 | 4 |
| **5** | **Campanha e prova de carga** — `qa-engineer`: (a) `tests_016_mutants.js` + entrada `d016` no `mutation_map.json` (**mesmo commit**; `preflight: true`; targets explícitos); campanha local `M1`–`M16` + candidatos (`sem_fecho`, mutante de árvore) KILL; (b) `mutation-matrix.json` (pares; desfecho anexado à "Borda 8", C10-a) + `fecho.json → _meta.prova_de_carga` **fixada por execução** (piso: 6 merges / 5 branches; exclusões: 003 2 · 009 1 · 010 1; fec1: 015 por `#34` com piso `6dad53d`) + bateria adversarial C1(e) em cópia efêmera, registrada. Repins R5a/R5b | 4 |
| **6** | **Documentos e registros** `[P]`: `doc-writer` — `SKILL.md` + `sdd.md` (C8, um commit); `design-decisions.md` (C10-d) + ADR 0001 (um commit); `product-owner` — `CONTEXT.md` (C9); opcional `build-engineer` — `state-eval.sh` (R-a6: lê `check_fecho.py --json` e imprime `mesclada sem fecho` em vez de `em voo`; **se não couber, candidata no relatório**). Repins R6a–R6c(d) | 5 |
| **7** | **Validação** — `qa-engineer`: pipeline completo (contagens citadas), campanha `d016` verde, regressão nomeada (`check_state.py`/`check_tdd.py`/`check_mutation.py`/`env_doctor.py`/`expected_suites.json`/`invariants.json` byte-idênticos por `git diff --stat 921977c..HEAD`), `spec-validate` → `spec-validate.md`; `product-owner` — aceite de intenção contra o `refinement.md`; `doc-writer` — `relatorio-final.md` (runs citados: o primeiro com `fecho` vermelho, o em que `D016-PROT1` ficou verde e o `ruleset_id` lido, a medição do token; série de repins e desvios) + `EA-33 → resolvido` no `BACKLOG.md`; orquestrador — PR aberto → planning-state **`done`** (Fase 6 completa + PR aberto, P7) → push → check `fecho` reexecuta → `LIBERADO`. Repin R7. **Merge é do usuário**, com `verify`, `visual` e `fecho` verdes | 6 + P2 |

Duas regras de colisão: `mutation_map.json` e `fecho.json` têm um só autor
(`qa-engineer`) e nunca entram em wave de outro; `verify.yml`, `pipeline.yaml` e
`compliance-audit.sh` são do `build-engineer` e ficam **fora** das waves 1–3.

## Série de repins

`gen_pins.py` pina blobs de **HEAD**: nenhum repin cabe no commit que altera o
arquivo. **Um `chore` de repin por commit de conteúdo**, dono `build-engineer`,
mensagem `chore(016): gen_pins — R<n> (<motivo>)`. Planning-state não pede repin.

| repin | fecha o commit de | wave |
|---|---|---|
| R0 | errata E1/E2 + `plan.md` + `tasks.md` (dívida medida: 1 divergente + 1 sem pin após esta entrega, +1 após o `tasks.md`) | 0 |
| R1a / R1b | registros + fixtures · schema | 1 |
| R2 | gates + `red-016.md` | 2 |
| R3a / R3b | `fecho.py` · `branch_protection.py` | 3 |
| R4a / R4b | stage + job · `compliance-audit.sh` | 4 |
| R5a / R5b | harness + `mutation_map.json` · matriz + prova de carga | 5 |
| R6a–R6d | C8 · C10-d + ADR · `CONTEXT.md` · (`state-eval.sh`) | 6 |
| R7 | `spec-validate.md` + `relatorio-final.md` + `BACKLOG.md` | 7 |

Repin fora desta previsão (ex.: merge de `develop` na feature) vai **registrado
no relatório final**, nunca silenciado.

## Riscos e rollback

| risco | como se detecta | rollback / remédio |
|---|---|---|
| `GITHUB_TOKEN` sem permissão em `/rules/branches` | `[FAIL] branch-protection: NÃO DETERMINÁVEL (permissão 403)` no `verify` do primeiro run da wave 4 | nenhum código muda: plano B da spec (§Não mensurável 1) — `permissions:` no workflow ou secret — **decisão do proprietário**, escalada com os dois lados |
| Proprietário adia P2 | `verify` vermelho em `branch-protection`, com dono e evento único | nenhum — é o que o gate existe para acusar; o relatório registra a espera; o PR não é mesclado sem P2 |
| `origin/develop` ausente no checkout de `push` | `[FAIL] fecho: NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente)` no run pós-merge | passo `git fetch origin develop` no job `verify` (uma linha, `build-engineer`) — nunca SKIP |
| GitHub muda o formato da mensagem de merge | FEC1 cai para a ancestralidade (T1); FEC2(c) reprova "merge fora de PR" — **vermelho visível** | ajustar `fecho.json → populacao` (dado), com repin; o julgador não muda |
| Fixture adicionada sem caso (ou vice-versa) | FAIL por contagem (guarda 2) | é o desenho; corrigir o registro |
| Harness antes da entrada no mapa | `check_suites.py` reprova "suíte fora do registro" | regra do mesmo commit (wave 5a) |
| Linha final do `compliance-audit` com `WARN` quebra consumidor | `grep -rn "compliance:"` na wave 4 (a spec já mediu: só o próprio script) | manter formato antigo e imprimir WARN em linha própria |
| Válvula escrita no PR da própria demanda | FAIL "válvula antes do vencimento" (T5) | intencional — a válvula é pós-merge, por PR `chore/*` |
| Custo do stage no hook Stop | medição da wave 5 (`time python .claude/verify/check_fecho.py`) | se > 2 s, `ler_ancestralidade` só para os estados que o oráculo de mensagem não resolveu (já é o desenho de T1) |
| Confusão de nomes stage `fecho` × job `fecho` | leitura | os dois cabeçalhos dizem "uma propriedade, duas direções"; o `desc` do stage e o comentário do job nomeiam o outro |
| `spec-validate` classificar E1/E2 como "faltando" | extração de critérios da Fase 6 | as células foram amendadas **com a marca**, não só a errata — o extrator lê o texto vigente |

## Protótipo

**Não haverá.** As três perguntas que "só código responderia" foram respondidas
por leitura e execução nesta fase: (1) `check_mutation.py:1287` casa `targets`
por pertinência exata — sem glob (logo, fixtures listadas uma a uma);
(2) `check_suites.py:50-51` registra os `cmd` dos harnesses do
`mutation_map.json` — logo, harness e entrada nascem juntos; (3) a prova de
carga de C1(a) não acusaria nada com o piso vigente — `222edd5` está antes de
`921977c` na first-parent de `origin/develop`, e `6dad53d` é o recuo que a torna
executável (E2). O que resta desconhecido — a permissão do token de Actions — só
se mede **no run do PR**, e a wave 4 é exatamente isso, com dono.

## Errata — wave 3 (2026-09-04)

Quatro pontos deste plano ficaram atrás do docstring de `check_fecho.py`
§CONTRATO DO INSTRUMENTO (que vence onde divergirem — precedência fixada pelo
orquestrador para a wave 3). Registro completo, com a razão **medida** de cada
um, em [`tasks.md`](tasks.md) §Errata; as células deste arquivo foram amendadas
com a marca `*(ETn)*`:

- **ET1** — `ler_ancestralidade(estados, piso)`: dois parâmetros; devolve
  `anterior_ao_piso` (F4 consome).
- **ET2** — `ler_merges(piso)` percorre a first-parent **inteira** com `%P`, não
  `--merges`: o piso zero `e5ccd429` é a raiz (0 pais) — `--merges` nunca o
  encontra (medido: 0 × 1). §Stage, "Custo estimado", amendado.
- **ET3** — o retorno de `julgar_pos_merge` tem `globais`, em duas classes:
  impeditivos (`piso-invalido` | `origin-develop-ausente`) e não impeditivo
  (`exclusao-malformada`) — único lugar que o relato imprime (C7; `D016-M27`).
  §Contratos amendado.
- **ET4** — a varredura sem-rede de T032(v) acusava o próprio gate (R10 §10):
  os dois arquivos varridos deixam de nomear as bibliotecas; a lista nominal
  vive só na célula de T032; forma `-w` (palavra inteira, arquivo inteiro),
  medida contra 16 casos adversariais — a forma "só linhas de import" é
  afrouxamento (5 evasões). Este §Camada continua citando a propriedade
  (não é arquivo varrido).
