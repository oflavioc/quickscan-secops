# Spec — 007-migracao-evidencia

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Migrar os quatro acervos de evidência legados (`docs_phase5/evidence_p50`,
`evidence_p51`, `evidence_p52`, `evidence_unset` — 406 arquivos rastreados,
~103 MB) para GitHub Releases nominais neste repositório (decisão Q1 = Opção B,
não reaberta), preservando a verificabilidade por um manifesto-ponte pinado em
`.claude/verify/` e por um gate contínuo `evidence-bridge` — com `evidence_v322`,
os 3 ZIPs da raiz e o histórico git intactos. Link: [refinement.md](refinement.md).

## Inventário congelado por esta spec

Contagens medidas por `git ls-files` em HEAD (`107e2c2`), a serem re-medidas no
**commit-âncora** real da Fase 5 (o último commit em que os acervos ainda estão
no índice — SHA imutável registrado no próprio manifesto-ponte, R10 §5):

| Acervo | Arquivos rastreados | Release nominal | Pacote |
|---|---|---|---|
| `docs_phase5/evidence_p50/` | 82 | `evidence-p50` | `evidence_p50.tar` |
| `docs_phase5/evidence_p51/` | 20 | `evidence-p51` | `evidence_p51.tar` |
| `docs_phase5/evidence_p52/` | 300 | `evidence-p52` | `evidence_p52.tar` |
| `docs_phase5/evidence_unset/` | 4 | `evidence-unset` | `evidence_unset.tar` |

Total: **406 arquivos**. `docs_phase5/evidence_v322/` (54 arquivos rastreados em
HEAD) **fica** — não entra no inventário. Repositório-alvo dos releases:
`oflavioc/quickscan-secops` (este; público — token é robustez, não requisito).
A contagem canônica de arquivos migrados **vive no manifesto-ponte** (registro
canônico deste dado, pinado pelo registry), nunca hardcodeada no corpo do gate
(R10 §3); o oráculo de completude é independente do manifesto (ver EB-1).

## Artefatos novos definidos aqui

| Artefato | Caminho | Natureza |
|---|---|---|
| Manifesto-ponte | `.claude/verify/evidence_bridge.json` | dado canônico, rastreado e **pinado** (entra em `pins.json` via `gen_pins.py` no mesmo PR — R8 §1) |
| Gate contínuo | `.claude/verify/check_evidence_bridge.py` | oráculo do stage novo; rastreado e pinado |
| Stage novo | `evidence-bridge` em `.claude/verify/pipeline.yaml` | checagem nova entra no pipeline, nunca em prompt (R10 §9); `heavy: true` (a parte online baixa ~103 MB) |

Os pacotes `.tar` **nunca são commitados**: são gerados em diretório
ignorado/efêmero (R11 §1) e vivem exclusivamente como assets dos releases —
nenhum binário novo entra no repo (`guard-data` não tem o que excepcionar).

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
O gate novo tem **duas partes** no mesmo stage `evidence-bridge`:

- **Parte offline** (roda sempre, local e CI, sem rede): manifesto ↔ blobs do
  commit-âncora, índice git e `.gitignore`. FAIL é FAIL em qualquer ambiente.
- **Parte online** (exige rede): existência e integridade dos 4 assets nos
  releases. Política decidida na rodada 1.5: **local sem rede → WARN nomeado
  (exit 0, cada pacote não verificado NOMEADO no relatório); CI
  (`GITHUB_ACTIONS` presente) → FAIL**. Nunca SKIP silencioso (R10 §2, E6).

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| EB-1 | **Manifesto-ponte completo e fiel**: todo arquivo dos 4 acervos rastreado no commit-âncora aparece no manifesto com SHA-256 idêntico ao do blob original — oráculo independente: a lista vem de `git ls-tree -r <commit-âncora>` (SHA imutável lido do `_meta` do manifesto, nunca `HEAD:`/branch — R10 §5) e os hashes de `git show <commit-âncora>:<path>` (R2 §2); arquivo a mais, a menos ou com hash divergente = FAIL nomeando o path | `evidence-bridge` (parte offline) · `.claude/verify/check_evidence_bridge.py` · "manifesto-ponte: N/N arquivos conferidos contra o commit-âncora `<sha>` · 0 divergência(s)", exit 0 | **M1**: alterar 1 caractere hex de um hash de arquivo no manifesto (ou apagar 1 entrada) → stage DEVE falhar nomeando o arquivo |
| EB-2 | **Pacote por acervo com SHA-256 registrado e conferível**: cada um dos 4 acervos tem `sha256_pacote` no manifesto; o gate baixa o asset do release nominal e confere SHA-256 sobre os bytes recebidos == registrado | `evidence-bridge` (parte online) · `check_evidence_bridge.py` · "pacote `evidence_<x>.tar` @ release `evidence-<x>`: sha256 confere", 4/4, exit 0 no CI | **M2**: adulterar o `sha256_pacote` de um acervo no manifesto (asset real íntegro) → FAIL por divergência nomeando o pacote |
| EB-3 | **Pacote ausente → FAIL**: asset inexistente/renomeado ou release ausente faz o gate falhar nomeando o pacote (no CI; localmente sem rede cai na política EB-5) | `evidence-bridge` (parte online) · `check_evidence_bridge.py` · exit ≠ 0 com "pacote AUSENTE: `<nome>` @ `<release>`" | **M3**: apontar `pacote` de um acervo no manifesto para nome de asset inexistente → FAIL "pacote ausente". É também o **red natural da Fase 4**: gate + manifesto commitados ANTES da publicação dos releases → FAIL provado e commitado (R3 §4) |
| EB-4 | **Pacote adulterado → FAIL**: asset com bytes ≠ dos registrados (mesmo nome) → divergência de SHA-256 → FAIL nomeando o pacote e ambos os hashes | `evidence-bridge` (parte online) · `check_evidence_bridge.py` · exit ≠ 0 com "pacote ADULTERADO: `<nome>` esperado `<hash>` obtido `<hash>`" | **M4**: servir/simular asset com 1 byte alterado (adversarial da Fase 4 — pode ser provado apontando o manifesto para um asset de conteúdo diverso) → FAIL |
| EB-5 | **Política de ambiente**: local sem rede → exit 0 **com WARN nomeado** listando cada pacote não verificado ("NÃO EXECUTADO — sem rede: evidence-p50, …"); mesmo estado com `GITHUB_ACTIONS` presente → exit ≠ 0. A ausência do texto do WARN quando há pacote não verificado é, ela própria, FAIL do caso de teste | `evidence-bridge` · `check_evidence_bridge.py` · caso adversarial da Fase 4 executa o gate nos dois modos (env simulado) e assere exit code + presença literal do WARN nomeado | **M5**: mutar o gate para retornar exit 0 sem emitir o WARN (SKIP silencioso) → o caso adversarial DEVE reprovar; mutar a detecção de CI para ignorar `GITHUB_ACTIONS` → o caso CI-simulado DEVE reprovar |
| EB-6 | **Fora do índice e no `.gitignore`**: `git ls-files` dos 4 diretórios == vazio; `.gitignore` contém as 4 entradas e `git check-ignore` confirma cada uma; **contraprova**: `docs_phase5/evidence_v322/` permanece rastreado (ls-files não-vazio) | `evidence-bridge` (parte offline) · `check_evidence_bridge.py` · "índice: 0 arquivo(s) rastreado(s) nos acervos migrados · ignore ativo 4/4 · evidence_v322 rastreado", exit 0 | **M6**: em árvore efêmera, `git add -f` de 1 arquivo de acervo migrado → FAIL; remover 1 das 4 linhas do `.gitignore` → FAIL |
| EB-7 | **Regressão congelada intacta com os diretórios fora do índice**: todas as suítes node com contagens canônicas de `expected_suites.json` inalteradas — inclusive em árvore SEM os acervos no disco (CI/clone novo é a prova canônica; as guardas de mutação toleram diretório ausente — QA confirma `tests_p50_mutants.js` por execução, borda 5 do refinement) | stages `suites` + `suites-heavy` existentes · `.claude/verify/check_suites.py` (e `--heavy`) · execução real == `expected_suites.json`, exit 0 — **no CI**, cujo checkout pós-migração já não materializa os acervos | — (gates existentes; o registro canônico não muda nesta demanda — `evidence-bridge` é stage python do pipeline, não suíte node, logo `expected_suites.json` permanece byte-idêntico) |

Complementares (rodam de qualquer forma no pipeline): stage `baseline` prova os
pins novos coerentes (arquivo rastreado sem pin = FAIL — o esquecimento do
`gen_pins.py` é impossível de silenciar); stage `boundary` prova que nenhum
protegido foi tocado fora do rito.

**Nascimento do gate (R10)**: caso positivo canônico = EB-1/EB-2 verdes;
negativo = EB-3; adversarial = EB-4/EB-5; regressão = EB-7 + a permanência do
próprio stage no pipeline. Oráculo independente da implementação = blobs do
commit-âncora via git (EB-1) e SHA-256 sobre bytes recebidos (EB-2/4). Namespace
`evidence-bridge`/`EB-*` é novo, não continua numeração de fase alheia.

## Comportamento especificado

Superfície única: o **processo de verificação** (pipeline + manifesto + evidence
store). Nenhuma superfície de produto (HTML, engine, Camada 1, sessão, UNSET/NA,
suficiência) é tocada — nenhum byte de produto muda.

Sequência mecânica (formaliza `docs_phase5/PLANO_MIGRACAO_EVIDENCIA.md` §Mecânica,
sem re-decidir):

1. **Congelar**: no commit-âncora (SHA imutável, registrado no manifesto), gerar
   os 4 pacotes `evidence_<acervo>.tar` com os bytes EXATOS dos blobs de HEAD
   desse commit, em diretório ignorado/efêmero (nunca na árvore rastreada —
   R7 §3, R11 §1). SHA-256 de cada pacote registrado no manifesto.
2. **Manifesto-ponte** `.claude/verify/evidence_bridge.json`: por acervo —
   release, pacote, `sha256_pacote`; por arquivo — path original e SHA-256 do
   blob original. Os manifestos históricos de fase NÃO são tocados (classe
   `legacy`; o manifesto-ponte os referencia por complementaridade, não os
   substitui). Fica fora de `docs_phase5/` exatamente para ser pinável
   (exclusões do registry) — decisão da rodada 1.3.
3. **Publicar**: 4 releases nominais (`evidence-p50`, `evidence-p51`,
   `evidence-p52`, `evidence-unset`) neste repositório, um asset `.tar` cada;
   conferir o SHA-256 do asset APÓS o upload (download de volta), antes de
   declarar publicado.
4. **Remover do índice**: `git rm -r --cached` dos 4 diretórios + as 4 entradas
   no `.gitignore` (que hoje só ignora `visual_evidence/` e `print_evidence/`).
   **O histórico git permanece intacto** — os blobs seguem alcançáveis (é isso
   que sustenta o oráculo EB-1, e o CI usa `fetch-depth: 0`); o emagrecimento do
   pack NÃO ocorre e NÃO é prometido (borda 6).
5. **Gate contínuo**: stage `evidence-bridge` no `pipeline.yaml`, rodando a
   parte offline sempre e a parte online sob a política EB-5.

### Casos de borda do refinamento — tratamento nesta spec

| Caso (refinement) | Tratamento |
|---|---|
| 1 — `evidence_v322` fica | Fora do inventário; EB-6 tem a **contraprova** (permanece rastreado); gate V322-DOC3 e `README.md:13` intocados |
| 2 — 3 ZIPs da raiz ficam | Fora de escopo; seguem rastreados (excluídos de pins por `*.zip`); S64/S74+S75/S113 intocados — EB-7 prova |
| 3 — `evidence_unset` migra | Incluído no inventário (4 arquivos, release `evidence-unset`) |
| 4 — suítes escrevem em `evidence_*` | Pós-migração as escritas caem em diretório **ignorado** (regime R11 §1); artefatos recriados localmente não são o acervo — o acervo é o congelado no commit-âncora. A linha `git checkout -- docs_phase5/` do job visual do CI torna-se inócua para os acervos migrados (paths não rastreados) e permanece válida para `evidence_v322` — o workflow não é tocado |
| 5 — guarda de mutação com diretório ausente | EB-7; QA confirma `tests_p50_mutants.js` por execução na Fase 4/6 |
| 6 — histórico mantém os blobs | Passo 4 acima; comunicar no relatório final que o pack não emagrece (dependência do doc-writer) |
| 7 — manifesto-ponte pinável | `.claude/verify/evidence_bridge.json` + `gen_pins.py` no mesmo PR (R8 §1) |
| 8 — pacote ausente/adulterado | EB-3/EB-4; política de ambiente EB-5 |
| 9 — manifestos históricos e `MANIFEST.sha256` | Byte-intactos (classe `legacy`); referenciados, nunca editados |
| 10 — `guard-data` | Nenhum binário novo entra (pacotes nunca commitados); manifesto é texto |

## Contratos

Nenhum bridge de runtime, payload de sessão ou estado de módulo (R9 §5 não se
aplica — não há dado novo no produto). O contrato desta demanda é o **shape do
manifesto-ponte** e a **identidade de artefatos de processo**:

### `.claude/verify/evidence_bridge.json` (dado canônico novo)

```json
{
  "_meta": {
    "descricao": "...",
    "commit_ancora": "<SHA do commit (40 hex, SHA-1 do git), imutável, pré-remoção>",
    "repo": "oflavioc/quickscan-secops",
    "gerado_em": "AAAA-MM-DD"
  },
  "acervos": {
    "evidence-p50": {
      "release_tag": "evidence-p50",
      "pacote": "evidence_p50.tar",
      "sha256_pacote": "<64 hex>",
      "arquivos": { "docs_phase5/evidence_p50/<nome>": "<sha256 do blob original>" }
    }
  }
}
```

(4 chaves em `acervos`, uma por release nominal.) Consumidor único:
`check_evidence_bridge.py`. Manutenção: gerado por ferramenta (nunca editado à
mão — R12; a ferramenta de geração é decisão do plan.md), publicado no fluxo de
promoção da R11 §2 (`build-engineer` publica o store, `doc-writer` registra o
manifesto, `qa-engineer` é o dono do gate — papéis conforme o plano aprovado).
Toda alteração futura carrega repin com trilha (R8).

### Arquivos rastreados que mudam ou nascem (todos exigem `gen_pins.py` no MESMO PR)

| Arquivo | Mudança |
|---|---|
| `.claude/verify/evidence_bridge.json` | nasce (pin novo) |
| `.claude/verify/check_evidence_bridge.py` | nasce (pin novo) |
| `.claude/verify/pipeline.yaml` | ganha o stage `evidence-bridge` (repin) |
| `.gitignore` | +4 entradas `docs_phase5/evidence_{p50,p51,p52,unset}/` (repin) |
| `.claude/rules/design-decisions.md` | linha "Evidência binária (~103 MB) versionada" atualizada — a migração deixou de ser futura (repin) |
| `.claude/rules/evidence-intake.md` | parágrafo de abertura ("o legado fica onde está até a migração desenhada") atualizado — a migração ocorreu (repin) |
| `.claude/verify/pins.json` | regenerado (classe `registry`, rito R6/R8) |

**Não mudam**: `expected_suites.json` (nenhuma suíte node nova — R10 §3 sem novo
intervalo), `pins.json → declared` (nenhum ato de governança de identidade de
produto), `boundary.json` (ver cross-check), `.github/workflows/verify.yml`
(o CI consome o pipeline; nenhum segredo novo — `GITHUB_TOKEN` padrão é
robustez opcional, repo público), suítes existentes, manifestos históricos,
`MANIFEST.sha256`, qualquer byte de produto.

## Tipagem prevista das tarefas (R3 — a matriz final é do tasks.md)

| Trabalho | Tipo | Red? |
|---|---|---|
| Gate `evidence-bridge` (`check_evidence_bridge.py` + stage no `pipeline.yaml`) | **feature** | **Sim** — red natural: gate + manifesto commitados antes da publicação dos releases → FAIL EB-3 provado e commitado; `planning-state.red.status: proven` com o commit |
| Geração do manifesto-ponte + pacotes `.tar` | chore | Não (fidelidade provada por EB-1) |
| Publicação dos 4 releases + conferência pós-upload | chore | Não (green de EB-2/3/4 é a prova) |
| `git rm -r --cached` + `.gitignore` | chore | Não (provada por EB-6) |
| `gen_pins.py` no mesmo PR | chore | Não (rito R8; stage `baseline` prova) |
| Atualização `design-decisions.md`, `evidence-intake.md`, status do `PLANO_MIGRACAO_EVIDENCIA.md`, relatório final (incl. aviso de que o pack não emagrece) | doc | Não |

Separação de poderes (R3 §2): `qa-engineer` escreve o gate e prova o red;
`build-engineer` implementa a publicação e a remoção do índice; nunca o mesmo
autor para gate e implementação.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda: engine,
  Camada 1, HTML gerado, sessão, UNSET/NA, suficiência intocados. INV-9
  (boundary legível por máquina) permanece — nenhuma classe de proteção é
  tocada fora de rito. As regras tangenciadas são de processo (R2 §2, R8, R11),
  todas cumpridas por desenho (hash sobre blobs de HEAD do commit-âncora; pin
  no mesmo PR; promoção em vez de bytes no repo).
- [x] **design-decisions.md — nenhum conflito; uma decisão é SUPERADA por
  cumprimento.** A linha "**Evidência binária (~103 MB) versionada** — Herança
  das fases 5.0–5.2, pinada pelos manifestos de fase. Permanece até a migração
  desenhada (Onda 4/R11)" é DECISÃO CONFIRMADA que esta demanda executa: a
  migração desenhada é esta. A linha é atualizada no MESMO PR (senão reinstala
  divergência doc×realidade — mesmo padrão do caso de borda 5 da spec 003).
  A linha "MANIFEST.sha256 divergente" NÃO é tocada (reconciliação é outra
  frente da Onda 4). A linha "Suítes visuais fora do agregado local" (KI-3)
  não conflita — o job visual continua igual.
- [x] **Specs validadas anteriores — nenhuma contradição.** `PHASE_5_0_REV_B.md`
  normatiza superfícies de produto congeladas, não o local físico da evidência;
  `specs/003-marcador-duplicado/` não toca esta frente. Os registros de selagem
  em `docs_phase5/` não são retro-ajustados (R13 — "valem como foram selados");
  o manifesto-ponte adiciona uma camada de verificação, não reescreve nenhuma.
- [x] **Boundary (R6) — nada protegido tocado fora de rito; nenhuma expansão.**
  `frozen` (engine, Camada 1, M41, snapshot): intocados. `generated`: intocados.
  `legacy` (`MANIFEST.sha256`, spec REV A): intocados — o manifesto-ponte
  referencia, não edita. `registry` (`pins.json`): só via `gen_pins.py`, mesmo
  PR, motivo no commit — rito cumprido. Os acervos `evidence_*` NÃO pertencem a
  nenhuma classe de proteção do `boundary.json` (verificado por leitura) — a
  remoção do índice não exige rito de boundary. O manifesto-ponte novo NÃO entra
  no `boundary.json`: sua proteção é o pin do registry (alteração exige
  `gen_pins.py` com trilha — R8), suficiente e já mecanizada; expandir boundary
  exigiria spec dedicada (R6 §3) e não é necessário. **Nenhuma PARADA por
  autorização** — nenhum arquivo exige Porta A/B.
- [x] **R10 — as 10 proibições respeitadas por desenho.** Checagem nova no
  `pipeline.yaml` (§9); contagem canônica no manifesto-ponte pinado, com oráculo
  independente via git, não em prosa nem hardcode no gate (§3); WARN nomeado /
  FAIL, nunca SKIP silencioso (§2); nenhum pin inline novo — identidades no
  manifesto pinado pelo registry (§4); âncora por commit imutável + SHA, nunca
  HEAD/branch (§5); o gate não spawna suíte nem parseia stdout PT-BR de outra
  suíte (§6); invocações externas com caminho entre aspas e dependência
  declarada no env-doctor se houver (§7); o gate não escreve em arquivo
  versionado — downloads em tmp/ignorado (§8); auto-exclusão não se aplica (não
  é scanner de padrão) (§10); e nenhuma asserção existente é enfraquecida (§1).

## Fora de escopo

Herdado integralmente do refinamento:

- **3 ZIPs da raiz** (`visual_print_evidence_{47,48,487}.zip`) e a refatoração
  dos oráculos S64/S74+S75/S113 — demanda posterior, com red próprio.
- **`evidence_v322`** — fica no clone (V322-DOC3 + `README.md:13`).
- **Emagrecimento do histórico/pack** — `git rm --cached` não remove blobs do
  histórico; rewrite/fresh-start é decisão separada e exclusiva do proprietário.
  O relatório final declara isso explicitamente.
- **Manifestos históricos de fase** e reconciliação do `MANIFEST.sha256` legado
  (outra frente da Onda 4; classe `legacy` congelada).
- **Qualquer byte de produto** — engine, Camada 1, HTML, módulos, suítes
  existentes.
- **Evidência nova** — já governada pela R11; esta demanda só converge o legado
  para o mesmo regime.

Acrescentado pela spec:

- **Nenhuma alteração em `expected_suites.json`** — `evidence-bridge` é stage
  python do pipeline, não suíte node; as contagens canônicas não mudam.
- **Nenhuma alteração em `.github/workflows/verify.yml`** — o CI consome o
  `pipeline.yaml`; nenhum segredo novo (repo público; `GITHUB_TOKEN` padrão é
  robustez opcional).
- **Nenhuma expansão do `boundary.json`** — a proteção do manifesto-ponte é o
  pin do registry (R8), já mecanizada.
- **Nenhuma migração de conteúdo dos releases após publicados** — release
  nominal publicado é imutável por convenção do acervo; correção futura seria
  demanda própria com repin e trilha.
