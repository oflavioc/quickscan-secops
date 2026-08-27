# Plano — 008-migracao-zips

> Fase 2 · dono: tech-lead · consome a spec aprovada (portão de 2026-08-26,
> commit `9f05d03`). Referencia [spec.md](spec.md) (gates ZB-1…ZB-7, decisões
> T1–T6) e [refinement.md](refinement.md). As 4 observações do parecer do PO da
> Fase 1 (**O1–O4**) são incorporadas aqui, nomeadas onde decidem algo.

## Desenho

Camada e superfície: **processo de verificação + evidence store + suíte de
sessão** — nenhuma camada de produto é tocada (nenhum byte de HTML/engine/módulo
muda). Nenhuma peça nasce; seis arquivos existentes mudam, cada um com dono único:

| Peça | Arquivo | Dono único | Mudança |
|---|---|---|---|
| Ferramenta de geração | `.claude/verify/gen_evidence_bridge.py` | `build-engineer` | generaliza para `tipo: "arquivo"` (T3): sem tar — o "pacote" é o próprio blob extraído da âncora para diretório efêmero; embute a **conferência TRIPLA** (O2, abaixo). Continua rodando fora do pipeline (uma execução por migração) |
| Manifesto-ponte | `.claude/verify/evidence_bridge.json` | `doc-writer` (registro R11 §2) | regenerado com a MESMA âncora `62590b5…` (T2): as 4 entradas da 007 textualmente inalteradas + 3 acervos-arquivo `evidence-47/48/487` (`release_tag: "evidence-v32"`) |
| Gate contínuo | `.claude/verify/check_evidence_bridge.py` (stage `evidence-bridge`) | `qa-engineer` | shape T3 (tipo default `"diretorio"`, coerência `sha256_pacote == arquivos[path]` para arquivo), EB-1 sobre 409 entradas, EB-6 generalizado (T4: `check-ignore` direto no path, entrada literal), parte online sobre release compartilhado |
| Oráculos de sessão | `tests_session_m48.js` (S64, S74+S75, S113) | `core-engineer` (**O3** — implementador ≠ QA) | fonte dos bytes: âncora → tmp → `unzip` (técnica O4 abaixo); asserções byte-equivalentes em semântica (régua INV-8) |
| Env-doctor | `.claude/verify/env_doctor.py` | `build-engineer` | +checagem `unzip` (ZB-6, política T6: WARN nomeado) |
| Índice/ignore | `.gitignore` + `git rm --cached` ×3 | `build-engineer` | 3 entradas literais; desindexação com contraprova ZB-4 |

**Owner do estado (R9 §5 adaptado — não há estado de runtime):** o dado novo são
as 3 entradas acervo-arquivo do manifesto-ponte. Dono do arquivo: `doc-writer`
(quem registra); produtor: a ferramenta do `build-engineer`; consumidores agora
são **dois** — `check_evidence_bridge.py` (valida tudo) e os oráculos de sessão,
que leem **exclusivamente `_meta.commit_ancora`** (T5): nenhum parse do bloco
`acervos` nos testes — acoplamento mínimo, e a validade do campo continua sendo
provada pelo gate, não pelos testes (leitura de dado, não spawn de suíte nem
regex de stdout — R10 §6).

### Técnica de extração binária nos oráculos (O4 — declarada aqui)

O maior ZIP tem ~28 MB; `execSync` com encoding implícito e `maxBuffer` padrão
corromperia ou estouraria. Técnica fixada:

1. Âncora lida uma vez de `evidence_bridge.json → _meta.commit_ancora` (T5) e
   validada 40-hex antes do uso; inválida/ausente → `throw` nomeando a causa
   (FAIL, nunca SKIP — paridade com o padrão de clone raso de
   `check_evidence_bridge.py:202-203`).
2. Bytes do blob: `spawnSync("git", ["show", ancora + ":" + zipName],
   {maxBuffer: 64 * 1024 * 1024})` — argumentos em **array** (sem shell, imune a
   espaço no path), stdout como **Buffer** (nunca string/encoding implícito —
   binário-seguro por construção), `maxBuffer` explícito de 64 MB (folga >2×
   sobre o maior ZIP). `status !== 0` ou stdout vazio → `throw` nomeando o blob.
3. Escrita em `fs.mkdtempSync(path.join(os.tmpdir(), "qs008-"))` — tmp do SO,
   nunca a árvore (R7 §3, R10 §8); `unzip` invocado sobre esse caminho **entre
   aspas** (família P2.1-16/I11/S64 preservada); remoção do diretório em
   `finally` (`fs.rmSync(..., {recursive: true, force: true})`).
4. **Uma extração por ZIP por execução da suíte**: helper memoizado no topo do
   arquivo — S64 e S74+S75 compartilham a extração do `_48.zip`; S113 extrai o
   `_487.zip`. A dependência cruzada de S113 sobre o `_48` vira
   `git cat-file -s <ancora>:visual_print_evidence_48.zip` > 0 — equivalente
   semântico exato de `fs.existsSync(prev) && fs.statSync(prev).size>0`
   (presença + não-vazio), sem custo de segunda extração e **sem fortalecer nem
   afrouxar a asserção** (a integridade byte a byte é trabalho transferido ao
   evidence-bridge — O1 abaixo).

### Conferência TRIPLA de identidade na geração (O2 — tarefa do build-engineer)

Antes de o manifesto ganhar os 3 acervos, a ferramenta prova que os três
retratos do mesmo byte coincidem, por ZIP:

```
SHA-256(blob 62590b5:<zip>)  ==  SHA-256(blob HEAD:<zip>, pré-remoção)  ==  MANIFEST.sha256 (linhas 39/40/87)
```

Qualquer divergência → a ferramenta **PARA com FAIL nomeando o ZIP e os três
hashes** — não se migra byte cuja identidade não é provada. Os ZIPs são binários
(`-text` irrelevante: hash de blob == hash de arquivo). O `MANIFEST.sha256` é
**lido, nunca editado** (classe `legacy`). A conferência roda na execução da
geração (W2) e o resultado entra no registro da wave.

### Desenho da matriz de mutantes (O1 — transferência declarada)

A matriz da 008 (`matriz-gate-mutante.md` da demanda, Fase 6) tem **três blocos**:

1. **M-ZB1…M-ZB6** (novos, spec §Critérios) — modalidade manual em cópias
   efêmeras, como na 007.
2. **Re-execução integral de M1–M6 da 007** — obrigação R3 §5 registrada no
   relatório da 007: os alvos (`check_evidence_bridge.py`,
   `gen_evidence_bridge.py`, `evidence_bridge.json`, `.gitignore`) mudam nesta
   demanda.
3. **Registro da transferência de garantia (O1)**: a asserção viva de S113
   "o arquivo de evidência anterior permanece **publicado** e íntegro"
   (`tests_session_m48.js:1352-1353`) tinha duas metades — *presença local* e
   *publicação*. Pós-migração, a metade "publicado" **transfere-se, declarada e
   nomeada, para a parte online do `evidence-bridge`** (ZB-3/EB-2/EB-4 sobre os
   assets de `evidence-v32`, política EB-5); S113 retém a metade blob-local
   (presença + não-vazio na âncora). A matriz registra a linha "garantia
   `permanece publicado` de S113 → ZB-3" com o mutante que a cobre (M-ZB3:
   asset ausente → FAIL do stage). É **transferência declarada, não
   afrouxamento** — nenhuma verificação deixa de existir; ela muda de gate, com
   rastro.

### Sem mudança no stage do pipeline

O stage `evidence-bridge` permanece com o MESMO `run`/`heavy: true`; a desc em
`pipeline.yaml` ganha a menção aos 7 acervos (mudança de 1 linha, repin junto —
a spec deixou opcional; decido **fazer**, para a desc não mentir sobre o domínio).
Nenhum stage novo (R10 §9 satisfeita pelos stages existentes).

## Contratos e registros

- **Bridges**: nenhum — nenhuma entrada em `bridges.json` (não há módulo de produto).
- **Patch-points**: nenhum; registro de patch-points desta demanda é vazio.
- **Ordem de injeção no builder**: N/A — builder não é tocado.
- **Shape do manifesto**: spec §Contratos (T3). Compatibilidade: `tipo` ausente ⇒
  `"diretorio"` — as 4 entradas da 007 não mudam nem de texto nem de semântica.
- **Pins (R8 §1)** — **`gen_pins.py` ÚNICO na W6, mesmo PR** (padrão 007: uma
  transição de identidade, janela de `baseline` vermelho única e declarada):
  `gen_evidence_bridge.py` (W1) · `evidence_bridge.json` (W2) ·
  `check_evidence_bridge.py` (W3) · `tests_session_m48.js` (W5a) ·
  `env_doctor.py` (W5b) · `design-decisions.md` + `evidence-intake.md` (W5c) ·
  `.gitignore` + `pipeline.yaml` (W6) · `specs/008-migracao-zips/*.md` (todas).
  A W6 commita a desindexação primeiro e o `pins.json` em seguida — o **head do
  PR** fecha com `baseline` verde.
- **Registros que NÃO mudam**: `expected_suites.json` (**byte-idêntico** — ZB-7,
  rota A), `pins.json → declared`, `bridges.json`, `boundary.json`,
  `mutation_map.json` (campanha manual; entrada permanente segue pendência da
  Onda 3/KI-2, como registrado pela 007), `.github/workflows/verify.yml`
  (`fetch-depth: 0` já sustenta a rota blob-da-âncora), `MANIFEST.sha256`,
  `session_roundtrip_report.md`, manifestos históricos, releases da 007.

## Boundary

Classe mais alta tocada: **`registry`** (`pins.json` via `gen_pins.py`, mesmo PR,
motivo no commit — rito cumprido na W6). Nada `frozen`, nada `generated`, nada
`legacy` (`MANIFEST.sha256` é lido na conferência tripla, nunca editado).
`tests_session_m48.js` é pinado mas **não pertence a classe do boundary**
(verificado no refinamento) — edição com repin, sem rito. Os 3 ZIPs não são
pinados (`_meta.exclusoes: *.zip`). **Nenhuma expansão de boundary. Nenhum ponto
de PARADA por rito D2.**

## Checklist R9 (módulo novo)

**N/A — nenhum módulo de produto nasce ou muda.** Os alvos são scripts python de
verificação, uma suíte node e dotfiles: IIFE/bridge/CSS/`innerHTML=` N/A. Espírito
do orçamento: o helper de extração em `tests_session_m48.js` é **um** helper
(memoizado, ~30 linhas) — não nasce infraestrutura paralela; `lint-arch`
permanece verde por vacuidade.

## Waves

| Wave | Tarefas (resumo) | Dono | Depende de |
|---|---|---|---|
| 1 — ferramenta | Generalizar `gen_evidence_bridge.py` (`tipo: "arquivo"`, sem tar) com a conferência TRIPLA embutida (O2). Commit. | `build-engineer` | portão da Fase 3 |
| 2 — manifesto | Executar a ferramenta com a âncora `62590b5…` (T2); conferência TRIPLA verde ×3 registrada; commitar `evidence_bridge.json` (+3 acervos, entradas 007 intactas — registro R11 §2). Cópias dos blobs ficam no diretório efêmero, prontas para a W4 — nunca commitadas. | `doc-writer` (execução instrumentada pela ferramenta da W1) | W1 |
| 3 — **RED** (Fase 4) | (a) `check_evidence_bridge.py` generalizado commitado; execução: **ZB-3 "pacote AUSENTE" ×3** (release `evidence-v32` inexistente — 404 real) + **EB-6/ZB-4 FAIL** (3 ZIPs no índice, `.gitignore` sem as entradas); shape/EB-1 já verdes (409/409). (b) **M-ZB5 red**: worktree efêmera sem os 3 ZIPs no disco → suíte de sessão **FAIL ×3** (S64/S74+S75 `false`, S113 `throw`), execução registrada. (c) **M-ZB6 red**: grep `unzip` em `env_doctor.py` = 0 + execução mostrando o silêncio atual. **Red commitado** (`test(008): red — …`); planning-state `red.status: proven` + `red.commit`. | `qa-engineer` | W2 |
| 4 — publicação | Criar release **`evidence-v32`** com os 3 assets diretos (nomes originais); **conferência pós-upload**: download de volta, SHA-256 == manifesto ×3, antes de declarar publicado. Nenhum arquivo da árvore muda. | `build-engineer` | W3 (red provado ANTES de existir o release — preserva M-ZB3) |
| 5a — oráculos `[P]` | Refatorar S64/S74+S75/S113 em `tests_session_m48.js`: helper memoizado + técnica O4 + `cat-file -s` para a dependência cruzada; asserções intactas (gate ZB-5 no prompt). Prova local: suíte **97/0** com árvore normal E em worktree efêmera sem os ZIPs. | `core-engineer` (**O3**: implementador ≠ QA do red/mutante) | W2 (âncora no manifesto); paralela a W4 |
| 5b — env-doctor `[P]` | Checagem `unzip` em `env_doctor.py` (WARN nomeado — T6, gate ZB-6 no prompt). | `build-engineer` | W3; paralela a 5a/5c (arquivos disjuntos) |
| 5c — docs pinadas `[P]` | `design-decisions.md` (linha dos 3 ZIPs — migração executada pela 008) e `evidence-intake.md` (abertura R11). Sem repin nesta wave (consolidado na W6). | `doc-writer` | W3; paralela |
| 6 — **GREEN** | `git rm --cached` dos 3 ZIPs + 3 entradas literais no `.gitignore` + desc do stage em `pipeline.yaml`; commit. **`gen_pins.py` ÚNICO** capturando W1/W2/W3/W5a/W5b/W5c/W6; commit do `pins.json` com motivo (R8 §1 — ponto exato do repin). Rodar local: `evidence-bridge` verde (shape 7 acervos, EB-1 409/409, ignore 7/7, online 7/7 ou WARN nomeado), `suites-heavy` **97/0**. | `build-engineer` | W4, W5a, W5b, W5c |
| 7 — validação (Fase 6) | Pipeline completo (`run.sh`) + CI (prova canônica: checkout sem os ZIPs, `fetch-depth: 0`, 97/0 e evidence-bridge verde). Campanha de mutantes: **M-ZB1…M-ZB6 + re-execução M1–M6** (cópias efêmeras, nunca commitadas) + matriz da 008 com a **linha de transferência O1**. `spec-validate`. Relatório final (avisos herdados: pack não emagrece; imutabilidade dos releases é convenção+gate). **Aceite de intenção do PO.** | `qa-engineer` → `doc-writer` → PO | W6 |

Janelas vermelhas **declaradas** (head do PR fecha ambas): `baseline` vermelho de
W1 até o repin da W6; `evidence-bridge` vermelho de W3 até W4 (AUSENTE) e até W6
(EB-6 dos ZIPs). A suíte de sessão **nunca fica vermelha na árvore do PR** (os
bytes permanecem no working tree até a W5a trocar a fonte; o red dela é provado
em worktree efêmera — W3b).

## Riscos e rollback

| Risco | Detecção (gate) | Resposta / rollback |
|---|---|---|
| Conferência tripla divergente (blob ≠ MANIFEST legado) | A própria ferramenta (O2) PARA nomeando ZIP + 3 hashes | **Parar e reportar ao usuário** — identidade em disputa é achado, não algo a resolver por conta (R2 §3) |
| Corrupção na extração binária (encoding/maxBuffer) | ZB-5: `unzip` falha ou asserções reprovam; mutante de ZIP truncado | Técnica O4 é o desenho preventivo (Buffer + maxBuffer 64 MB + array-args); regressão detectada = FAIL da suíte, nunca silêncio |
| Custo da extração por execução da suíte (~14 MB de blobs `_48`+`_487`) | Duração do stage `suites-heavy` | Helper memoizado (1 extração por ZIP); a suíte já é `heavy` por desenho; se custo incomodar, otimização futura com trilha própria |
| Asset corrompido no upload | Conferência pós-upload W4; EB-2/EB-4 no CI | Re-upload antes do green final (release ainda não é "publicado-imutável" até o aceite) |
| `git rm --cached` atingir path errado | Contraprova ZB-4 (v322 rastreado) + diff da W6 | Restaurar índice de HEAD~; nada se perde (working tree e histórico intactos) |
| Entrada de `.gitignore` mais larga que o literal (ex.: `*.zip`) | ZB-4 exige entrada literal; revisão do diff | Corrigir a linha; o gate reprova padrão não-literal por construção do check |
| Worktree efêmera do red contaminar a árvore real | `git status` porcelain antes×depois (padrão 007) | Worktrees em `.claude/worktrees/` (ignorado); remoção ao final |
| Rede indisponível no CI na validação | `evidence-bridge` FAIL (política EB-5) | Re-run do job; política é desenho, não flake — persistindo, investigar antes de tocar o gate (R10 §1) |
| Release criado e demanda abortada | — | `gh release delete evidence-v32` (decisão do proprietário); revert dos commits W6→W1; ZIPs voltam ao índice pelo revert da W6 |
| Mutantes sujarem a árvore | `git status` porcelain | Mutações só em cópias efêmeras; só o RELATÓRIO registra |

Rollback geral: cada wave é commit atômico reversível por `git revert`; os blobs
permanecem no histórico (borda 9 do refinement) e o release é deletável até o
aceite final.

## Protótipo

Nenhum — não há questão que só código responda **antes** do fluxo: a técnica O4
(spawnSync Buffer + maxBuffer) é comportamento documentado do node, e sua prova
real é o próprio green da W5a em worktree sem os ZIPs + o mutante de ZIP truncado
na W7 — dentro da demanda, com gate, melhor que um protótipo descartável.
