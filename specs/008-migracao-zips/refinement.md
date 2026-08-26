# Refinamento — 008-migracao-zips

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Continuação direta da 007 (`specs/007-migracao-evidencia/`): migra o que a 007
> deixou de fora POR CAUSA dos oráculos vivos. Interrogação do sistema real por
> Grep/Read (arquivo:linha abaixo); nada suposto de memória.

## Necessidade

O repositório ainda versiona 3 ZIPs binários na raiz
(`visual_print_evidence_47.zip` ~28 MB, `_48.zip` ~6 MB, `_487.zip` ~8 MB —
tamanhos informados pelo orquestrador; conferência byte a byte é dependência do
`build-engineer`). Para o **proprietário/auditor**, é o resto do achado E10: a
007 migrou os 4 acervos de `docs_phase5/` e registrou nominalmente que os ZIPs
ficariam para "demanda posterior com red próprio" (relatorio-final.md:86) — esta
é essa demanda. Para **quem clona e para o CI**, a raiz fica limpa e o índice
para de carregar ~42 MB de binário. Para os **engenheiros**, a última evidência
legada converge ao regime da R11 (repo versiona manifesto, não bytes).
Por que agora: a infraestrutura que faltava (manifesto-ponte pinado
`.claude/verify/evidence_bridge.json` + gate `evidence-bridge`) existe e está
verde desde o merge da 007 (PR #20, 2026-08-25) — o único bloqueio que restava
era o desenho da refatoração dos oráculos, objeto deste refinamento.

## Enquadramento de produto

- **Invariantes de produto (R1)**: nenhum byte de produto muda (HTML, engine,
  Camada 1, sessão). MAS há uma tangência real que a 007 não tinha: **INV-8 é
  guardada por `tests_session_m48.js`** (`.claude/verify/invariants.json`,
  entrada INV-8) — e esta demanda EDITA esse arquivo (oráculos S64, S74+S75,
  S113). A régua do refinamento: a refatoração muda **a fonte dos bytes** que o
  oráculo examina (raiz → acervo migrado), nunca **a asserção** (paridade de
  claims SE1–SE5, artefatos não vazios, dois breakpoints). Qualquer afrouxamento
  de asserção é violação de R10 §1; o mutante da Fase 4 precisa provar que o
  oráculo refatorado ainda reprova acervo incompleto/adulterado.
- Invariantes de **processo** tangenciadas: R2 §2 (hash sobre blob, nunca
  working tree), R7 §3 (extração em tmp, nunca na árvore), R8 (arquivos tocados
  são pinados → `gen_pins.py` no mesmo PR), R10 §§1,2,3,5,7 (sem enfraquecer,
  sem SKIP silencioso, contagem no registro canônico, âncora imutável,
  dependência externa declarada), R11 (evidência por promoção), R13 (a linha de
  design-decisions.md sobre os 3 ZIPs precisa ser atualizada ao final — mesma
  mecânica da 007).
- **Conflito com decisão registrada?** Não — ao contrário: `design-decisions.md`
  (linha "Evidência binária versionada") e `evidence-intake.md` (R11, abertura)
  registram os 3 ZIPs como "migração de escopo posterior". Esta demanda executa
  o previsto; ambas as linhas são atualizadas no mesmo PR (dependência do
  doc-writer). Q1 (destino = GitHub Releases) permanece decidida — não reabrir.
- **Alternativas mais simples consideradas**:
  - *Não migrar*: E10 fica encerrado pela metade e a raiz continua suja — é
    exatamente o resíduo que a demanda quer eliminar.
  - *Mover os ZIPs para `docs_phase5/`*: limpa a raiz mas não fecha E10 (binário
    segue no índice) e ainda exige tocar os oráculos (paths). Custo quase igual,
    benefício menor.
  - *Só refatorar os oráculos para lerem da história (`git show`) sem publicar
    releases*: tecnicamente possível (os blobs permanecem alcançáveis), mas
    deixa o acervo sem acesso humano fora de arqueologia git e quebra o padrão
    estabelecido pela 007 (evidence store = Releases + manifesto-ponte). O
    acesso publicado é parte da verificabilidade para o auditor.

## Sistema real

Verificado por leitura e Grep (não executei nada — fora do meu domínio):

- **Consumidores vivos dos ZIPs** — todos em `tests_session_m48.js` (suíte de
  97 gates, pinada em `expected_suites.json → heavy.session`, heap 4608 MB,
  stage `suites-heavy` do `pipeline.yaml:89-94`):
  - **S64** (`tests_session_m48.js:628-640`): `unzip -Z1` sobre
    `visual_print_evidence_48.zip` (linha 629); confere paridade de claims
    SE1–SE5 contra `session_roundtrip_report.md` (linha 637). ZIP ausente →
    `return false` (linha 630) = **FAIL, não SKIP**.
  - **S74+S75** (`tests_session_m48.js:762-773`): `unzip -Z1 -v` + `unzip -l`
    sobre o mesmo `_48.zip` (linhas 763-766); exige SE1–SE5 não vazios e os
    screenshots do modal SE4 em 1366 e 390. Ausente → `return false` (764).
  - **S113** (`tests_session_m48.js:1336-1354`): `unzip -l` sobre
    `visual_print_evidence_487.zip` (1337-1339); exige SE6/SE7/SE8 + SE3 nos
    dois breakpoints, com bytes > 0; e **exige também que o `_48.zip` anterior
    permaneça publicado e íntegro** (`fs.existsSync(prev) && size>0`,
    linhas 1352-1353) — dependência cruzada entre os dois acervos. Ausente →
    `throw` (1338).
- **`visual_print_evidence_47.zip` NÃO tem gate vivo.** Grep de
  `visual_print_evidence_47` no repo: só documentação histórica
  (`docs/VISUAL_GATES_V32.md:60`, `docs/CHANGELOG_v32.md:413,424,429`),
  `MANIFEST.sha256:39` (classe `legacy`, congelado) e registros de fase. A
  premissa do brief ("os 3 ZIPs são lidos por gates vivos") vale para `_48` e
  `_487`; o `_47` é o caso simples — migra sem refatoração de oráculo.
- **Aspas nos caminhos já corrigidas** (fix-finding Onda 1, PR #9 — comentário
  em `tests_session_m48.js:631-633`): a refatoração preserva o padrão (família
  P2.1-16/I11/S64, R10 §7).
- **`unzip` não está declarado no env-doctor**: grep de `unzip` em
  `.claude/verify/env_doctor.py` → zero ocorrências. Divergência real com
  R10 §7 ("dependência declarada no env-doctor") que já existe hoje e que a
  demanda deve sanar se o oráculo refatorado continuar invocando `unzip`.
- **A infraestrutura da 007 tem domínio FIXO — não aceita acervo novo sem
  mudança de código**:
  - `check_evidence_bridge.py:56-61`: tupla `ACERVOS` com os 4 acervos da 007;
    `valida_shape` (linhas 119-121) **falha se `acervos` do manifesto tiver
    chaves diferentes das 4 esperadas**; linhas 143-145 exigem que todo arquivo
    comece com `<dir>/` (acervo-diretório — um ZIP na raiz viola); `eb6`
    (linhas 247-275) assume diretório (`check-ignore` de `<dir>/__sonda__`).
  - `gen_evidence_bridge.py:47-48`: mesma tupla fixa; empacota em `.tar` por
    diretório (linhas 106-137).
  - `evidence_bridge.json → _meta.commit_ancora`: **um único âncora para o
    manifesto** (`62590b5927496a61ab31dd476d46b03624546560`). Os 3 ZIPs JÁ
    estavam rastreados nesse commit — reutilizá-lo é possível; registrar âncora
    própria da 008 também. Decisão de desenho para o plan.md (R10 §5 só exige
    SHA imutável).
  - Consequência: qualquer rota via manifesto-ponte implica editar
    `check_evidence_bridge.py`/`gen_evidence_bridge.py` (ou criar gate/tool
    paralelo) e **re-executar a campanha de mutantes** — o relatório da 007
    (§Proposta registrada) já obriga re-execução manual da matriz M1–M6 quando
    qualquer alvo mudar (R3 §5).
- **Identidades e proteções**:
  - `tests_session_m48.js` é **pinado** (`pins.json:174`) e é gate da INV-8;
    NÃO pertence a nenhuma classe do `boundary.json` — editável sem rito de
    boundary, mas com repin no mesmo PR (R8 §1) e sob a régua de R10 §1.
  - Os ZIPs **não são pinados** (`pins.json → _meta.exclusoes` inclui `*.zip`) —
    a remoção do índice não mexe no registry por si; os arquivos tocados, sim.
  - `declared.baseline_core_zip_sha256` (`pins.json:15`, `625079c4…`) **não é
    nenhum dos 3 ZIPs** (hashes em `MANIFEST.sha256:39,40,87`: `b89ea12a…`,
    `24736aee…`, `4f822d21…`) — é o core 4.8.0.7 de origem, externo. Sem
    conflito.
  - `MANIFEST.sha256` (legacy, congelado) lista os 3 ZIPs — permanece
    byte-intacto; os hashes dele servem de conferência cruzada na geração do
    manifesto (dependência de verificação, não edição).
- **Contagem canônica**: `expected_suites.json → heavy.session` pina **97 PASS /
  0 FAIL**. S64, S74+S75 e S113 são 3 dos 97 `T()`. Rota que introduza
  "NÃO EXECUTADO dependente de ambiente" exigiria virar `pass` em intervalo
  (ex.: `[94,97]`) no mesmo PR (R10 §§2-3, precedente `unset` `[12,13]`); rota
  offline mantém 97 fixo.
- **`.gitignore`** hoje tem as 4 entradas da 007 (linhas 14-17) e nada sobre os
  ZIPs — a migração acrescenta as 3 entradas de arquivo.
- **`session_roundtrip_report.md:135`** documenta em prosa que "S64 lê o próprio
  archive" — esse arquivo é lido pelo S64 (regex `SE1[–-]SE5`); mexer nele é
  risco desnecessário → fica byte-intacto (divergência de prosa histórica,
  tolerada e registrada aqui).
- **CI**: `verify.yml` usa `fetch-depth: 0` desde a 007 (sustenta EB-1 via
  `git show <âncora>:<path>`) — a rota de oráculo por blob da âncora herda essa
  garantia sem mudança de workflow.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | `_47.zip` sem gate vivo | Migra junto (encerramento pleno do E10); nenhuma refatoração de oráculo para ele; referências históricas (`docs/VISUAL_GATES_V32.md:60`, `docs/CHANGELOG_v32.md`, `MANIFEST.sha256:39`) permanecem byte-intactas — registro selado vale como selado (R13). |
| 2 | ZIP ausente na árvore, hoje | S64/S74+S75 `return false`, S113 `throw` — FAIL da suíte, nunca SKIP. O red da Fase 4 é natural: remover do índice antes da refatoração prova FAIL ×3. |
| 3 | Dependência cruzada S113→`_48` (`tests_session_m48.js:1352-1353`) | A semântica "o acervo anterior permanece publicado e íntegro" é preservada na refatoração — vira asserção sobre o acervo migrado (entrada no manifesto + bytes alcançáveis), não some. |
| 4 | Shape do gate `evidence-bridge` rejeita acervo novo | `check_evidence_bridge.py:119-121,143-145` e `eb6` precisam ser generalizados para acervo-arquivo (ZIP na raiz) OU nasce gate/manifesto irmão. Qualquer edição re-dispara a campanha de mutantes manual da 007 (R3 §5). |
| 5 | Contagem pinada 97 da suíte de sessão | Rota offline (recomendada): 97 intacto. Rota com rede: `pass` vira intervalo no `expected_suites.json` no MESMO PR, com NÃO EXECUTADO nomeado no relatório da suíte (R10 §§2-3). |
| 6 | Âncora | SHA imutável com os 3 ZIPs no índice (R10 §5). `62590b5…` da 007 já os contém; âncora própria da 008 também serve. Manifesto hoje só tem UM `_meta.commit_ancora` — suportar âncora por acervo é decisão do plan.md. |
| 7 | `unzip` como dependência externa | Hoje não declarado no env-doctor (divergência R10 §7 pré-existente). Se o oráculo refatorado seguir invocando `unzip`, declarar; caminho sempre entre aspas (fix da Onda 1 preservado). |
| 8 | Extração/download em disco | Sempre em tmp/diretório ignorado — nunca na árvore rastreada (R7 §3, R10 §8). O gate da 007 não escreve nada; o oráculo node pode precisar de arquivo temporário para `unzip` (que não lê de stdin) — tmp do SO, removido ao final. |
| 9 | Histórico não emagrece | Mesmo aviso da 007: `git rm --cached` não remove blobs; os ~42 MB seguem no pack. Rewrite é decisão separada e exclusiva do proprietário. O relatório final repete o aviso. |
| 10 | Clone raso | Rota blob-da-âncora exige histórico completo — mesma exigência que EB-1 já impôs (CI com `fetch-depth: 0`); clone raso falha NOMEANDO a causa (padrão `check_evidence_bridge.py:202-203`). |
| 11 | `guard-data` | Nenhum binário novo entra (só remoção + texto no manifesto); nada a excepcionar. |
| 12 | Repin | `tests_session_m48.js`, `evidence_bridge.json`, `check_evidence_bridge.py`, `gen_evidence_bridge.py`, `.gitignore`, `pipeline.yaml` (se a desc do stage mudar), regras R11/R13 atualizadas — todos pinados → `gen_pins.py` no mesmo PR com motivo (R8 §1). |

## Vocabulário

Registrados no `CONTEXT.md` nesta Fase 0 (formato R12):

- **Commit-âncora** — SHA imutável de onde oráculos leem blobs/listas; termo da
  007 usado em toda parte e até agora ausente do glossário.
- **Pacote de auditoria** — o que os 3 ZIPs da raiz SÃO (evidência empacotada
  das rodadas 4.7/4.8/4.8.0.7 da era V3.2); termo de `docs/VISUAL_GATES_V32.md`
  sem definição canônica.

(Reutilizados sem mudança: **Acervo de evidência**, **Evidence store**,
**Manifesto-ponte** — já registrados pela 007.)

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1.1 | **Escopo**: confirmado que os 3 ZIPs migram — inclusive `_47.zip`, que a interrogação do sistema mostrou NÃO ter gate vivo (só referências em docs históricos e no MANIFEST legado)? **Recomendo: sim, os 3** — é o encerramento pleno do E10 e da raiz; `_47` é o caso barato (sem refatoração de oráculo). | **SIM — os 3 migram**, inclusive `_47` ("Aceito todas as recomendações", usuário no chat, 2026-08-25). |
| 1.2 | **Granularidade do release**: a 007 fez um release por fase. Os 3 ZIPs são rodadas da MESMA linhagem (era V3.2: 4.7, 4.8, 4.8.0.7). Um release único (ex.: `evidence-v32`) com 3 assets, ou 3 releases (`evidence-47/48/487`)? **Recomendo: release único com 3 assets** — uma era = um release, menos superfície para gerir; o manifesto-ponte continua registrando hash por pacote. | **Release único com 3 assets** (usuário, 2026-08-25). Tag de trabalho: `evidence-v32` — aceita como exemplo; o nome exato se fixa na spec (sem nova rodada: qualquer tag nominal serve, o contrato é manifesto → tag → asset → hash). |
| 1.3 | **Empacotamento**: a 007 embrulhou diretórios em `.tar`. Aqui cada artefato JÁ é um arquivo único. Publicar cada ZIP como asset direto (SHA-256 do asset == SHA-256 do blob original — verificação ponta a ponta em um passo) ou embrulhar em `.tar` por simetria com a 007? **Recomendo: asset direto, sem tar** — camada a menos, identidade a mais. | **Asset direto, sem tar** (usuário, 2026-08-25). `sha256_pacote` == SHA-256 do blob original do commit-âncora. |
| 1.4 | **Rota do oráculo** (a decisão central): (A) S64/S74+S75/S113 extraem o ZIP do blob do commit-âncora (`git show` → tmp → `unzip`) — offline, determinístico, contagem 97 intacta, mesma dependência de histórico completo que EB-1 já criou; (B) baixam do release com cache local — rede entra na suíte node, contagem vira intervalo com NÃO EXECUTADO nomeado local / FAIL no CI (política EB-5); (C) asserções passam a ler uma listagem congelada no manifesto-ponte — offline e sem `unzip`, mas o oráculo deixa de tocar os bytes reais (integridade delegada ao gate `evidence-bridge`). **Recomendo: (A)** — preserva as asserções exatamente como são (R10 §1), mantém a suíte offline (R7) e o 97 fixo; a integridade do asset publicado continua coberta pelo `evidence-bridge`. | **Rota (A)** — blob do commit-âncora via `git show` → tmp → `unzip`; suíte offline, asserções intactas, **97 PASS permanece fixo** em `expected_suites.json` (usuário, 2026-08-25). |
| 1.5 | **Manifesto e gate**: estender `evidence_bridge.json` + `check_evidence_bridge.py`/`gen_evidence_bridge.py` para suportar acervo-arquivo (um manifesto-ponte único, custo: generalizar shape/EB-6 e re-executar a campanha de mutantes manual — obrigação já registrada pela 007), ou criar manifesto/gate irmão só para os ZIPs? **Recomendo: estender o existente** — um registry canônico por conceito; dois manifestos-ponte seria a duplicação que a R8 existe para impedir. | **Estender o existente** — manifesto-ponte único; generalização do shape/EB-6 para acervo-arquivo com re-execução da campanha de mutantes (usuário, 2026-08-25). |

**Consolidação (2026-08-25)**: as 5 decisões acima fecham a rodada 1 sem abrir
pergunta nova — o nome exato da tag (1.2) e o desenho da âncora/generalização
(bordas 4 e 6) são decisões técnicas da Fase 1/2 (spec/plan), não do
proprietário. Deste lado, o refinamento está pronto para o portão; **quem
aprova a fase é o usuário, no chat** (D3).

## Fora de escopo (explícito)

- **Emagrecimento do histórico/pack** — os blobs dos ZIPs permanecem no
  histórico; rewrite/fresh-start é decisão separada e exclusiva do proprietário
  (mesmo aviso da 007, repetido no relatório final).
- **`MANIFEST.sha256`**, **`docs/VISUAL_GATES_V32.md`**, **`docs/CHANGELOG_v32.md`**,
  **`session_roundtrip_report.md`**, manifestos históricos de fase — byte-intactos
  (legacy/registro selado); referências aos ZIPs neles são história, não defeito.
- **`docs_phase5/evidence_v322/`** — fica no clone (V322-DOC3 + `README.md:13`);
  já decidido na 007.
- **Os 4 acervos da 007** — nenhuma mudança de conteúdo, release ou hash;
  qualquer generalização do gate preserva EB-1…EB-6 byte-equivalentes em
  comportamento.
- **Qualquer byte de produto** — engine, Camada 1, HTML gerado, módulos de UI.
  Os únicos gates tocados são S64/S74+S75/S113 (fonte dos bytes, nunca a
  asserção) e o `evidence-bridge` (generalização).
- **Contagens das demais suítes** — só `heavy.session` pode mudar de forma
  (fixo → intervalo) e apenas se a rota escolhida na 1.4 for a (B).
- **Evidência nova** — já governada pela R11; esta demanda encerra o legado.
