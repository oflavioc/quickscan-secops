# Spec — 008-migracao-zips

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Migrar os 3 ZIPs de evidência da raiz (`visual_print_evidence_47.zip`, `_48.zip`,
`_487.zip` — pacotes de auditoria da era V3.2) para um release único
`evidence-v32` com 3 assets diretos (sem tar), refatorando os oráculos vivos
S64/S74+S75/S113 para lerem o blob do commit-âncora (`git show` → tmp → `unzip`)
com asserções intactas e contagem 97 preservada, e estendendo o manifesto-ponte
(`evidence_bridge.json`) + gate `evidence-bridge` para acervo-arquivo.
Link: [refinement.md](refinement.md).

## Inventário congelado por esta spec

Os 3 acervos-arquivo, todos rastreados no commit-âncora reutilizado da 007
(`62590b5927496a61ab31dd476d46b03624546560` — ver Decisão T2):

| Acervo (chave no manifesto) | Path rastreado (raiz) | Asset (direto, sem tar) | SHA-256 de conferência cruzada (`MANIFEST.sha256`, classe legacy) |
|---|---|---|---|
| `evidence-47` | `visual_print_evidence_47.zip` | `visual_print_evidence_47.zip` | `b89ea12a0c69…` (linha 39) |
| `evidence-48` | `visual_print_evidence_48.zip` | `visual_print_evidence_48.zip` | `24736aeec12f…` (linha 40) |
| `evidence-487` | `visual_print_evidence_487.zip` | `visual_print_evidence_487.zip` | `4f822d213c38…` (linha 87) |

Release único: **`evidence-v32`** em `oflavioc/quickscan-secops` (Decisão T1).
Tamanhos informados (~28 MB, ~6 MB, ~8 MB) são estimativa do refinamento;
**conferência byte a byte na geração é dependência do `build-engineer`**, e o
registro canônico do hash é o manifesto-ponte (R10 §3) — o `MANIFEST.sha256`
permanece byte-intacto e serve só de conferência cruzada na geração (os ZIPs são
binários: SHA-256 do blob == SHA-256 do arquivo, imune a eol). `_47.zip` não tem
gate vivo (interrogação do refinamento) — migra sem refatoração de oráculo.

## Decisões técnicas fixadas (delegadas pelo refinamento à Fase 1)

| id | Decisão | Justificativa (curta) |
|---|---|---|
| **T1** | **Tag do release: `evidence-v32`**, um release, 3 assets com os nomes originais dos ZIPs | Uma era = um release (rodada 1.2); nomes originais tornam `sha256_pacote` == SHA-256 do blob verificável ponta a ponta sem renomeio; família nominal `evidence-*` da 007 preservada |
| **T2** | **Âncora: reutilizar `62590b5927496a61ab31dd476d46b03624546560`** — o manifesto mantém UM `_meta.commit_ancora` | Os 3 ZIPs já estão rastreados nesse commit (verificado no refinamento); âncora própria da 008 não conteria os 4 acervos da 007 (já desindexados em qualquer commit novo), quebrando EB-1, e âncora-por-acervo é generalização de shape maior sem benefício. R10 §5 exige só SHA imutável — satisfeito |
| **T3** | **Generalização do shape: campo `tipo` por acervo, opcional, default `"diretorio"`**; acervos novos declaram `tipo: "arquivo"` com campo `path` explícito | As 4 entradas da 007 permanecem textualmente inalteradas dentro do arquivo (diff mínimo, comportamento EB-1…EB-6 byte-equivalente); o default codifica a semântica histórica. Para `tipo: "arquivo"`: `release_tag` pode diferir da chave (release compartilhado `evidence-v32`), `pacote` == basename do `path`, `arquivos` tem exatamente 1 entrada `{path: sha256}` e `sha256_pacote` == esse mesmo hash (coerência interna conferida pelo gate) |
| **T4** | **EB-6 generalizado para arquivo**: `git ls-files -- <path>` vazio + entrada **literal** (nome exato de arquivo, nunca glob) no `.gitignore` + `git check-ignore -q <path>` direto (sem `__sonda__`); contraprova `evidence_v322` herdada e mantida | Sonda de diretório não se aplica a arquivo; entrada literal evita ignorar futuro arquivo legítimo por padrão largo; a contraprova existente já prova que o ignore não vazou |
| **T5** | **Fonte da âncora para os oráculos node: `evidence_bridge.json → _meta.commit_ancora`** — nunca SHA hardcodeado no teste, nunca `HEAD`/branch | Registro canônico único e pinado (R8, R10 §§4-5); o mesmo dado que o gate `evidence-bridge` já valida como 40-hex de commit alcançável |
| **T6** | **`unzip` no env-doctor: WARN nomeado quando ausente** ("suíte de sessão (S64/S74+S75/S113) reprova sem ele"); quem reprova é o stage `suites-heavy` (contagem fixa 97, sem intervalo) | Espelha o precedente do Chromium (WARN + FAIL onde importa); FAIL do env-doctor aborta o pipeline inteiro e puniria `--light`, que nem roda a suíte heavy. Nunca silêncio (R10 §2, E6) |

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Namespace da demanda: **ZB-\*** (zip-bridge). Os ids EB-1…EB-6 continuam sendo
os oráculos internos do stage `evidence-bridge` (mesmo arquivo, agora
generalizados); ZB-\* são os critérios de aceite da 008 sobre eles e sobre os
demais arquivos tocados. Partes offline/online e política de ambiente **herdadas
da spec 007** (EB-5) sem mudança.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| ZB-1 | **Manifesto-ponte estendido e fiel para acervo-arquivo**: os 3 acervos `evidence-47/48/487` entram no `evidence_bridge.json` (shape T3) e o oráculo EB-1 generalizado confere cada blob `<âncora>:<path>` (via git, independente do manifesto) contra o hash registrado; entrada a mais/a menos/divergente = FAIL nomeando o path | `evidence-bridge` (offline) · `.claude/verify/check_evidence_bridge.py` · "manifesto-ponte: 409/409 arquivos conferidos contra o commit-âncora `62590b5…` · 0 divergência(s)" (406 da 007 + 3 ZIPs), exit 0 | **M-ZB1**: alterar 1 caractere hex do hash do `_48.zip` no manifesto → FAIL nomeando o path; apagar a entrada `evidence-487` → FAIL de shape/EB-1 |
| ZB-2 | **Generalização sem regressão 007**: `valida_shape` aceita `tipo: "arquivo"` e mantém domínio fixo (agora 7 acervos); os 4 acervos-diretório da 007 permanecem **byte-equivalentes em comportamento** (EB-1…EB-6 verdes com as mesmas asserções); chave fora do domínio, `tipo` desconhecido, `pacote` ≠ basename ou `sha256_pacote` ≠ `arquivos[path]` = FAIL | `evidence-bridge` (offline) · `check_evidence_bridge.py` · shape OK nomeando 7 acervos + EB-1/EB-6 verdes para os 4 da 007, exit 0 | **M-ZB2**: acrescentar acervo espúrio ao manifesto → FAIL de shape; `sha256_pacote` ≠ `arquivos[path]` num acervo-arquivo → FAIL. **Obrigação R3 §5**: re-execução integral da matriz **M1–M6 da 007** (alvos `check_evidence_bridge.py`/`gen_evidence_bridge.py`/`evidence_bridge.json`/`.gitignore` mudam — rastro em matriz própria da 008, modalidade manual, harness da Onda 3 ainda inexistente) |
| ZB-3 | **Release `evidence-v32` publicado com conferência**: os 3 assets diretos baixados e SHA-256 dos bytes recebidos == `sha256_pacote` (== blob original — verificação ponta a ponta em um passo); asset/release ausente → "pacote AUSENTE" FAIL; bytes divergentes → "pacote ADULTERADO" FAIL; sem rede local → WARN nomeado, CI → FAIL (política EB-5 herdada, inalterada) | `evidence-bridge` (online) · `check_evidence_bridge.py` · "pacote `visual_print_evidence_<n>.zip` @ release `evidence-v32`: sha256 confere" ×3, exit 0 no CI | **M-ZB3**: manifesto estendido commitado ANTES da publicação do release → "pacote AUSENTE" ×3 — **red natural da Fase 4 para o gate** (R3 §4); apontar `pacote` de um acervo para asset inexistente → FAIL |
| ZB-4 | **Desindexação dos 3 ZIPs com contraprova**: `git ls-files` vazio para os 3 paths; `.gitignore` com as 3 entradas literais; `git check-ignore -q` confirma cada uma; contraprova: `docs_phase5/evidence_v322/` permanece rastreado (herdada) e o working tree fica íntegro (bytes permanecem no disco, como na 007) | `evidence-bridge` (offline, EB-6 generalizado — T4) · `check_evidence_bridge.py` · "índice: 0 arquivo(s) rastreado(s) nos acervos migrados · ignore ativo 7/7 · evidence_v322 rastreado", exit 0 | **M-ZB4**: em worktree efêmera, `git add -f` de 1 ZIP → FAIL; remover 1 das 3 entradas novas do `.gitignore` → FAIL |
| ZB-5 | **Oráculos de sessão refatorados — fonte muda, asserção não** (régua INV-8): S64, S74+S75 e S113 obtêm os bytes do ZIP de `git show <âncora>:<path>` (binário-seguro) → arquivo em tmp do SO → `unzip` (caminho entre aspas — padrão P2.1-16/I11 preservado) → remoção do tmp ao final; âncora lida do manifesto (T5); asserções semanticamente idênticas: paridade de claims SE1–SE5 contra `session_roundtrip_report.md` (S64), artefatos não vazios + SE4 modal em 1366/390 (S74+S75), SE6/SE7/SE8+SE3 nos dois breakpoints com bytes > 0 e **dependência cruzada preservada** — S113 exige o blob do `_48.zip` presente e não vazio na âncora (antes: `fs.existsSync` na árvore); blob/âncora inacessível ou `git`/`unzip` falhando → **FAIL, nunca SKIP** (paridade com o `return false`/`throw` atuais) | `S64`, `S74+S75`, `S113` · `tests_session_m48.js` (suíte `heavy.session`) · 97 PASS / 0 FAIL com os 3 gates verdes lendo da âncora, inclusive em árvore SEM os ZIPs no disco | **M-ZB5**: (red natural da refatoração) executar a suíte atual em árvore sem os ZIPs (worktree efêmera/CI) → FAIL ×3 provado e commitado (R3 §4); pós-refatoração: `_meta.commit_ancora` trocado por SHA de commit sem os ZIPs (manifesto adulterado em cópia efêmera) → os 3 gates DEVEM reprovar; ZIP truncado/adulterado entregue ao tmp → asserções reprovam |
| ZB-6 | **`unzip` declarado no env-doctor** (sana a divergência R10 §7 achada na Fase 0): presente → `[OK] unzip`; ausente → WARN nomeado apontando os gates que reprovam sem ele (T6) — nunca silêncio | `env-doctor` · `.claude/verify/env_doctor.py` · linha nomeando `unzip` em qualquer dos dois estados, exit conforme política do stage | **M-ZB6**: executar o env-doctor com PATH sem `unzip` (simulado em ambiente efêmero) → a saída DEVE conter o WARN nomeado; mutante que remove a checagem → caso adversarial reprova |
| ZB-7 | **Contagem canônica preservada**: `expected_suites.json → heavy.session` permanece **97 fixo / 0 FAIL, byte-inalterado** (rota A da rodada 1.4 — suíte offline, sem intervalo, sem NÃO EXECUTADO); verde local em worktree efêmera sem os ZIPs e prova canônica no CI Linux (checkout pós-migração, `fetch-depth: 0` já vigente) | stage `suites-heavy` · `.claude/verify/check_suites.py --heavy` · execução real == `expected_suites.json`, exit 0 | — (gate e registro existentes; a régua INV-8 — mudar a fonte dos bytes, nunca a asserção — é provada por M-ZB5, e afrouxamento de contagem seria FAIL do próprio stage) |

Complementares (rodam de qualquer forma): stage `baseline` prova o repin coerente
(arquivo pinado alterado sem `gen_pins.py` = FAIL); stage `boundary` prova que
nenhum protegido foi tocado fora de rito.

**Nascimento/alteração de gate (R10)**: positivo = ZB-1/ZB-3 verdes; negativo =
ZB-3 (ausente) e ZB-5 (blob inacessível); adversarial = M-ZB2/M-ZB4/M-ZB5;
regressão = ZB-2 (007 intacta) + ZB-7 (contagem congelada). Oráculo independente:
blobs do commit-âncora via git (nunca working tree — R2 §2) e SHA-256 sobre bytes
recebidos. Nenhuma asserção existente é enfraquecida (R10 §1).

## Comportamento especificado

Superfície única: o **processo de verificação** (pipeline + manifesto + evidence
store + suíte de sessão). Nenhuma superfície de produto é tocada — nenhum byte de
HTML, engine, Camada 1 ou sessão muda.

Sequência mecânica (ordem exata das waves é do plan.md/tasks.md):

1. **Estender a ferramenta e o manifesto**: `gen_evidence_bridge.py` generalizado
   para `tipo: "arquivo"` (sem tar: o pacote é o próprio blob extraído da âncora,
   gerado em diretório efêmero — nunca na árvore); manifesto regenerado com a
   MESMA âncora `62590b5…` (T2) ganhando os 3 acervos-arquivo (T3), com
   conferência cruzada dos hashes contra `MANIFEST.sha256` (leitura, nunca edição).
2. **Generalizar o gate**: `check_evidence_bridge.py` — shape (T3), EB-1 sobre
   409 entradas, EB-6 generalizado (T4), parte online sobre o release
   compartilhado; comportamento 007 byte-equivalente (ZB-2).
3. **Red do gate**: manifesto + gate generalizados commitados antes da publicação
   → ZB-3 FAIL ×3 provado e commitado. **Red da refatoração dos oráculos**:
   suíte atual executada em árvore sem os ZIPs → FAIL ×3 (S64 `return false`,
   S74+S75 `return false`, S113 `throw`) registrado e commitado (M-ZB5).
4. **Publicar**: release `evidence-v32` com os 3 assets diretos; conferência
   pós-upload (download de volta × manifesto) antes de declarar publicado.
5. **Refatorar os oráculos** (ZB-5): fonte âncora→tmp→unzip; asserções intactas;
   extração binária-segura; tmp do SO removido ao final (R7 §3, R10 §8); os dois
   gates que leem o `_48.zip` (S64 e S74+S75) podem compartilhar uma única
   extração por execução (decisão de implementação do plan.md — a spec só exige
   as asserções e a fonte).
6. **Desindexar**: `git rm --cached` dos 3 ZIPs + 3 entradas literais no
   `.gitignore` (ZB-4). O histórico NÃO emagrece — os blobs seguem no pack (é o
   que sustenta ZB-1/ZB-5); aviso repetido no relatório final.
7. **`env_doctor.py`**: checagem de `unzip` (ZB-6, política T6).
8. **Repin** (`gen_pins.py`, mesmo PR) + atualização das linhas de
   `design-decisions.md` e `evidence-intake.md` + re-execução M1–M6 e matriz
   M-ZB\* registradas.

### Casos de borda do refinamento — tratamento nesta spec

| Caso (refinement) | Tratamento |
|---|---|
| 1 — `_47.zip` sem gate vivo | Migra nos ZB-1/3/4; nenhuma refatoração de oráculo; referências históricas byte-intactas (R13) |
| 2 — ZIP ausente hoje = FAIL | É o red natural M-ZB5 (FAIL ×3 em árvore sem os ZIPs) |
| 3 — dependência cruzada S113→`_48` | Preservada como asserção sobre o blob do `_48.zip` na âncora (ZB-5) |
| 4 — shape rejeita acervo novo | Generalização T3/T4 + ZB-2; re-execução M1–M6 obrigatória (M-ZB2) |
| 5 — contagem 97 | Rota A: fixa, byte-inalterada (ZB-7) |
| 6 — âncora | T2: reuso de `62590b5…`, âncora única no manifesto |
| 7 — `unzip` | ZB-6 (T6); caminhos entre aspas preservados (ZB-5) |
| 8 — extração em disco | tmp do SO, removido ao final; nunca na árvore (ZB-5) |
| 9 — histórico não emagrece | Passo 6; aviso obrigatório no relatório final (doc-writer) |
| 10 — clone raso | Mesma exigência que EB-1 já impôs; falha NOMEANDO a causa (padrão `check_evidence_bridge.py:202-203`, estendido aos oráculos node em ZB-5) |
| 11 — `guard-data` | Nenhum binário novo entra (só remoção + texto no manifesto) |
| 12 — repin | Tabela abaixo; `gen_pins.py` no mesmo PR (R8 §1) |

## Contratos

Nenhum bridge de runtime, payload de sessão ou estado de módulo (R9 §5 não se
aplica). O contrato é a **extensão do shape do manifesto-ponte** (T3):

```json
{
  "_meta": { "commit_ancora": "62590b5927496a61ab31dd476d46b03624546560", "repo": "oflavioc/quickscan-secops", "...": "..." },
  "acervos": {
    "evidence-p50": { "release_tag": "evidence-p50", "pacote": "evidence_p50.tar", "sha256_pacote": "<64 hex>", "arquivos": { "docs_phase5/evidence_p50/...": "<sha256>" } },
    "evidence-48": {
      "tipo": "arquivo",
      "path": "visual_print_evidence_48.zip",
      "release_tag": "evidence-v32",
      "pacote": "visual_print_evidence_48.zip",
      "sha256_pacote": "<64 hex — == arquivos[path], coerência conferida pelo gate>",
      "arquivos": { "visual_print_evidence_48.zip": "<sha256 do blob na âncora>" }
    }
  }
}
```

- `tipo` ausente ⇒ `"diretorio"` (entradas da 007 inalteradas). Consumidores:
  `check_evidence_bridge.py` (único de antes) **+ os oráculos S64/S74+S75/S113**,
  que passam a ler `_meta.commit_ancora` (T5) — leitura de dado, não spawn de
  suíte nem parse de stdout (R10 §6 respeitada).
- Manutenção inalterada: gerado por `gen_evidence_bridge.py`, nunca à mão (R12);
  pinado; alteração só com repin e trilha (R8).

### Arquivos rastreados que mudam (todos pinados → `gen_pins.py` no MESMO PR)

| Arquivo | Mudança |
|---|---|
| `.claude/verify/evidence_bridge.json` | +3 acervos-arquivo (regenerado, mesma âncora) |
| `.claude/verify/gen_evidence_bridge.py` | generaliza para `tipo: "arquivo"` (sem tar) |
| `.claude/verify/check_evidence_bridge.py` | shape T3 + EB-1 409 entradas + EB-6 T4 + online no release compartilhado |
| `tests_session_m48.js` | S64/S74+S75/S113: fonte dos bytes âncora→tmp→unzip; asserções intactas (INV-8, pin `pins.json:174`) |
| `.claude/verify/env_doctor.py` | +checagem `unzip` (ZB-6) |
| `.gitignore` | +3 entradas literais dos ZIPs |
| `.claude/rules/design-decisions.md` | linha "Evidência binária versionada": os 3 ZIPs deixam de ser "migração de escopo posterior" — migrados pela 008 |
| `.claude/rules/evidence-intake.md` | abertura da R11: idem |
| `.claude/verify/pipeline.yaml` | **opcional** — só se a desc do stage `evidence-bridge` for atualizada para mencionar os 7 acervos (decisão do plan.md; tocou → repin) |
| `specs/008-migracao-zips/*.md` | artefatos da demanda (pinados no repin, precedente 007) |
| `.claude/verify/pins.json` | regenerado (classe `registry`, rito R6/R8) |

**Não mudam**: `expected_suites.json` (**byte-idêntico** — rota A, 97 fixo; nem
forma nem valor), `pins.json → declared` (o `baseline_core_zip_sha256` é o core
4.8.0.7 externo, não é nenhum dos 3 ZIPs — conferido no refinamento),
`boundary.json`, `.github/workflows/verify.yml` (`fetch-depth: 0` já vigente),
`MANIFEST.sha256`, `docs/VISUAL_GATES_V32.md`, `docs/CHANGELOG_v32.md`,
`session_roundtrip_report.md` (lido por S64 — byte-intacto; a prosa "S64 lê o
próprio archive" é divergência histórica tolerada e registrada no refinamento),
manifestos históricos de fase, qualquer byte de produto, os 4 acervos e releases
da 007.

## Tipagem prevista das tarefas (R3 — a matriz final é do tasks.md)

| Trabalho | Tipo | Red? |
|---|---|---|
| Generalização do gate `evidence-bridge` + shape (ZB-1/2/3/4) | **feature** | **Sim** — red natural M-ZB3 (manifesto antes do release → AUSENTE ×3) |
| Refatoração dos oráculos S64/S74+S75/S113 (ZB-5) | **refactor sob prova de red da demanda** — o FAIL ×3 em árvore sem os ZIPs (M-ZB5) é executado e commitado ANTES, e o mutante de âncora prova que a reprova sobrevive à refatoração | Sim (registrado como red da demanda) |
| Checagem `unzip` no env-doctor (ZB-6) | **feature** | **Sim** — M-ZB6 (PATH sem unzip nomeado) |
| Geração do manifesto estendido + publicação do release + conferência | chore | Não (provada por ZB-1/ZB-3) |
| Desindexação + `.gitignore` | chore | Não (provada por ZB-4) |
| `gen_pins.py` no mesmo PR | chore | Não (rito R8; stage `baseline` prova) |
| Re-execução M1–M6 + matriz M-ZB\* + relatório final (incl. aviso do pack) + linhas R11/R13 | doc/chore | Não |

Separação de poderes (R3 §2): `qa-engineer` escreve/generaliza gates e prova os
reds; `build-engineer` publica e desindexa; `core-engineer` ou `qa-engineer` —
**nunca o mesmo autor para gate e implementação** — a divisão exata é do tasks.md.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda. A única
  tangência é INV-8: seu gate (`tests_session_m48.js`) é EDITADO, sob a régua do
  refinamento — muda a FONTE dos bytes, nunca a asserção; a contagem 97 fica
  fixa em `expected_suites.json` (ZB-7) e M-ZB5 prova que o oráculo refatorado
  continua reprovando acervo ausente/adulterado. Qualquer afrouxamento seria
  violação de R10 §1 e reprova em ZB-2/ZB-7.
- [x] **design-decisions.md — nenhum conflito; uma decisão é SUPERADA por
  cumprimento.** A linha "Evidência binária versionada" registra os 3 ZIPs como
  "migração de escopo posterior" — esta demanda é essa migração, prevista e não
  contrariada; a linha é atualizada no MESMO PR (mesma mecânica da 007). Q1
  (destino = GitHub Releases) permanece decidida — não reaberta.
- [x] **Specs validadas anteriores — nenhuma contradição.** A spec 007 declarou
  os ZIPs explicitamente fora de escopo "demanda posterior, com red próprio" —
  esta é ela. Os releases da 007 e EB-1…EB-7 permanecem byte-equivalentes em
  comportamento (ZB-2); "nenhuma migração de conteúdo dos releases após
  publicados" (spec 007 §Fora de escopo) é respeitada — `evidence-v32` é release
  NOVO, nenhum asset da 007 muda. `PHASE_5_0_REV_B.md` normatiza superfícies de
  produto, não o local físico da evidência. Registros selados não são
  retro-ajustados (R13).
- [x] **Boundary (R6) — nada protegido tocado; nenhuma expansão; nenhuma
  PARADA.** `tests_session_m48.js` NÃO pertence a classe do `boundary.json`
  (verificado no refinamento) — editável com repin (R8 §1). `frozen`/`generated`
  intocados; `legacy` (`MANIFEST.sha256`, spec REV A) apenas lido; `registry` só
  via `gen_pins.py` no mesmo PR com motivo. Os ZIPs não são pinados
  (`_meta.exclusoes` inclui `*.zip`) — a desindexação não mexe no registry por si.
- [x] **R10 — as 10 proibições respeitadas por desenho.** §1 asserções intactas
  (régua INV-8 + M-ZB5); §2 sem SKIP silencioso (FAIL nos oráculos, WARN nomeado
  no env-doctor e na parte online local); §3 contagem no registro canônico, 97
  inalterado; §4 nenhum pin inline novo — hashes no manifesto pinado, âncora lida
  do manifesto (T5); §5 âncora = commit imutável + SHA `62590b5…`; §6 oráculo lê
  dado do manifesto, não spawna suíte nem parseia stdout; §7 `unzip` declarado
  (ZB-6) e caminhos entre aspas; §8 extração em tmp do SO, nada escrito em
  arquivo versionado; §9 nenhuma checagem nova fora do `pipeline.yaml` (os gates
  vivem em stages existentes); §10 não é scanner de padrão.

## Fora de escopo

Herdado integralmente do refinamento: emagrecimento do histórico/pack (rewrite é
decisão exclusiva do proprietário; aviso repetido no relatório final);
`MANIFEST.sha256`, `docs/VISUAL_GATES_V32.md`, `docs/CHANGELOG_v32.md`,
`session_roundtrip_report.md` e manifestos históricos — byte-intactos;
`docs_phase5/evidence_v322/` fica; os 4 acervos/releases da 007 — nenhuma mudança
de conteúdo, release ou hash; qualquer byte de produto; contagens das demais
suítes; evidência nova (R11 já governa).

Acrescentado pela spec:

- **`expected_suites.json` byte-idêntico** — rota A eliminou a única hipótese de
  mudança (intervalo da rota B).
- **Nenhuma âncora nova e nenhum suporte a âncora-por-acervo** (T2) — o manifesto
  mantém UM `_meta.commit_ancora`; multi-âncora seria demanda futura se um dia
  necessária.
- **Nenhum manifesto/gate irmão** — decisão 1.5 do refinamento (estender o
  existente) é executada, não revisitada.
- **Nenhuma alteração no workflow do CI** (`fetch-depth: 0` já sustenta a rota
  blob-da-âncora).
- **Release `evidence-v32` publicado é imutável por convenção** (mesma regra da
  007); correção futura seria demanda própria com repin e trilha.
- **Entrada permanente em `mutation_map.json`** — permanece pendência da Onda 3
  (KI-2), como registrado no relatório da 007; o rastro desta demanda é a matriz
  manual própria.
