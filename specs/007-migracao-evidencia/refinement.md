# Refinamento — 007-migracao-evidencia

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Insumo principal: `docs_phase5/PLANO_MIGRACAO_EVIDENCIA.md` (desenho aprovado
> pela decisão Q1). A tentativa 006 foi aberta e ABORTADA sem efeito em
> 2026-08-25 — nada foi migrado; esta demanda começa do zero pela máquina.

## Necessidade

O repositório carrega ~103 MB de evidência binária herdada das fases 5.0–5.2
(achado E10: 333 PNG/PDF/ZIP rastreados, pack de ~133 MiB crescendo a cada fase).
Para o **proprietário/auditor**, a verificabilidade de cada selagem passa a ser
sustentada por um manifesto-ponte pinável + acervo publicado em GitHub Releases,
em vez de bytes dentro do clone. Para o **CI e para quem clona**, o índice do git
para de carregar o acervo histórico (o working tree emagrece; o pack, não — ver
borda #6). Para os **engenheiros**, os diretórios `evidence_*` legados convergem
para o regime da R11: diretório ignorado, entrada no repo só por promoção.
Por que agora: a decisão Q1 (destino) foi tomada em 2026-08-25 — **Opção B,
GitHub Releases** — e era o único bloqueio da execução da Onda 4 nesta frente.
Esta demanda **não re-decide Q1**.

## Enquadramento de produto

- **Invariantes de produto (R1)**: nenhuma das 10 é tocada — o produto (HTML,
  engine, Camada 1) não muda um byte. As invariantes tangenciadas são de
  **processo**:
  - **R2 §2 (verificabilidade por hash)**: cada artefato migrado mantém o hash
    original do manifesto de fase; o pacote ganha SHA-256 próprio, conferido
    após o upload e por gate contínuo (`evidence-bridge`). Hash sempre sobre
    bytes de blob de HEAD, nunca sobre working tree sujeito a CRLF.
  - **R11 (evidência por promoção)**: esta É "a migração desenhada da Onda 4"
    que a R11 nomeia. Ao final, os diretórios `evidence_*` migrados entram no
    `.gitignore` e o legado converge para o regime de evidência nova: o repo
    versiona o manifesto, não os bytes.
  - **R13 (decisões registradas)**: a linha "Evidência binária (~103 MB)
    versionada — permanece até a migração desenhada" é executada por esta
    demanda; ao final ela precisa ser atualizada (dependência do doc-writer).
    Os manifestos históricos de fase e o `MANIFEST.sha256` legado **não são
    tocados** (classe `legacy`, R6/R8 §4).
  - **R8 (registry)**: o manifesto-ponte é arquivo rastreado novo → ganha pin;
    como `pins.json → _meta.exclusoes` exclui `docs_phase5/**` e `*.zip`, o
    manifesto-ponte **tem de viver fora de `docs_phase5/`** para ser pinável.
    Toda alteração dele exige `gen_pins.py` no mesmo PR.
- **Conflito com decisão registrada?** Não — R13 prevê exatamente esta migração.
  Q1 já decidida (Opção B) não é reaberta.
- **Alternativa mais simples considerada**: Opção A (storage local
  `D:\QuickscanData\evidence`) seria mais barata, mas o CI não acessa e não há
  verificação contínua — rejeitada na própria Q1. Git LFS: custo/quota e setup
  em todo clone — rejeitado. Não migrar nada: o pack cresce a cada fase e o
  problema só encarece.
- **Destino consolidado (rodada 1, proprietário, 2026-08-25)**: releases no
  próprio repositório `oflavioc/quickscan-secops`, um por acervo —
  `evidence-p50`, `evidence-p51`, `evidence-p52`, `evidence-unset`. O gate no
  CI usa o `GITHUB_TOKEN` padrão do workflow, sem segredo novo.
  **Simplificação registrada**: o repositório é PÚBLICO desde 2026-08-25, então
  o acesso aos release assets nem exige token — o token padrão fica como
  robustez, não como requisito.

## Sistema real

Verificado por leitura (não executei nada — fora do meu domínio):

- **Gates que LEEM os 3 ZIPs da raiz** (restrição dura, fora de escopo):
  `tests_session_m48.js:629` (S64), `:763` (S74+S75) e `:1337` (S113) fazem
  `unzip` sobre `visual_print_evidence_48.zip` / `_487.zip`; S113 ainda exige em
  `:1352` que o zip anterior (`_48`) permaneça publicado e íntegro. Migrá-los
  exige refatorar oráculos — demanda própria, com red.
- **Gate que EXIGE `evidence_v322` no clone**: `tests_p52_layout.js:1688–1709`
  (V322-DOC3) valida que a imagem de abertura do README é um PNG local sob
  `docs_phase5/evidence_v322/`; `README.md:13` aponta para
  `docs_phase5/evidence_v322/V322-14-home-1920x1080.png`. Logo `evidence_v322`
  **FICA** (43 arquivos, acervo da rodada v3.2.2 promovida a produção).
- **Suítes ESCREVEM nos diretórios de evidência** como subproduto:
  `tools_p52_shots.js:16` (→ `evidence_p52`) e `:255` (→ `evidence_v322`, sob
  `V322_SHOTS=1`); `tests_p52_chromium.js:26,76–83` (→ `evidence_p52`, suprimido
  por `P52_NO_EVIDENCE=1`) e `:4126–4142` (→ `evidence_v322`, interruptor
  próprio); `tests_p50_chromium.js:35,41` (→ `evidence_p50`, `P50_NO_EVIDENCE`);
  `tests_p50_mutants.js:839–843`, `tests_p51_mutants.js:216–217` e
  `tests_p52_mutants.js:1406–1410` gravam os JSON de mutação nos respectivos
  `evidence_*`. Após a migração, essas escritas caem em diretório **ignorado** —
  exatamente o regime da R11 §1.
- **A guarda de mutação tolera diretório ausente**:
  `tests_p52_mutants.js:54–63` (`if (!fs.existsSync(dir)) return;`) — remover
  `evidence_p52` do working tree não quebra a campanha. (`tests_p50_mutants.js`
  tem guarda análoga sobre `evidence_p50`; confirmar em execução é do QA.)
- **Nenhum gate lê os manifestos históricos**: grep de `MANIFEST_PHASE5` sobre
  `*.{js,sh,yaml,yml,py,json}` → zero ocorrências. A verificabilidade histórica
  é documental (conferência humana), o que a migração precisa preservar por
  manifesto-ponte + gate novo.
- **`evidence_unset` existe e não tem gate**: 4 arquivos
  (`UG-screen-radar-unset.png`, `UG-screen-ruler-unset.png`,
  `UG-print-unset.pdf`, `UG-geometry.json`); única referência é
  `docs_phase5/MICROFASE_UNSET_REPORT.md:279` (§7, relatório histórico).
  Estava fora do inventário do plano — **decidido: migra junto** (rodada 1.1),
  como pacote/release próprio `evidence-unset`.
- **`.gitignore` hoje** ignora `visual_evidence/` e `print_evidence/` (evidência
  NOVA, R11), mas **não** os `docs_phase5/evidence_*` — a migração acrescenta.
- **Divergência doc×doc no próprio plano**: o passo 2 da mecânica nomeia
  `docs_phase5/MANIFEST_EVIDENCIA_MIGRADA.sha256`, mas o parágrafo da decisão Q1
  corrige para "manifesto-ponte preferencialmente FORA de `docs_phase5/`".
  Este refinamento resolve: **fora** — dentro de `docs_phase5/` ele seria
  não-pinável pelas exclusões do registry. Local decidido (rodada 1.3):
  **`.claude/verify/`**, pinado pelo registry via `gen_pins.py` no mesmo PR.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | `evidence_v322` | **Não migra.** V322-DOC3 (`tests_p52_layout.js:1688`) e `README.md:13` exigem o acervo no clone. Qualquer futura migração dele é demanda própria que refatore o gate. |
| 2 | 3 ZIPs da raiz (`visual_print_evidence_{47,48,487}.zip`, ~45 MB) | **Não migram.** Lidos por S64/S74+S75/S113 (`tests_session_m48.js`). Demanda posterior, com red provado (gate falhando com pacote ausente/adulterado). |
| 3 | `evidence_unset` | Sem gate que o leia; referenciado só por relatório histórico. **Decidido (rodada 1.1): migra** como pacote/release próprio (`evidence-unset`), com os 4 hashes no manifesto-ponte. |
| 4 | Suítes que escrevem em `evidence_p50/p51/p52` ao rodar | Continuam funcionando: `mkdirSync recursive` recria o diretório, agora ignorado. Arquivos recriados localmente (ex.: `P52-mutation.json` de um run novo) **não** são o acervo migrado — o acervo congela os bytes de HEAD no momento da migração. |
| 5 | Guarda de mutação sobre acervo ausente | `tests_p52_mutants.js:57` tolera diretório inexistente; QA confirma o equivalente em `tests_p50_mutants.js` na Fase 4/6. |
| 6 | Histórico git mantém os blobs | O emagrecimento do clone (pack) **NÃO é desta demanda**: `git rm -r --cached` remove do índice, não do histórico. Rewrite/fresh-start é decisão separada e exclusiva do proprietário. Comunicar isso no relatório final para não vender emagrecimento que não ocorre. |
| 7 | Manifesto-ponte pinável | Vive fora de `docs_phase5/`; entra no `pins.json` via `gen_pins.py` no mesmo PR (R8 §1). Alterações futuras carregam trilha. |
| 8 | Pacote adulterado/ausente no Release | Gate `evidence-bridge` FALHA (red da Fase 4 prova as duas condições). **Política decidida (rodada 1.5)**: execução local sem rede → WARN nomeado; CI → FAIL. Nunca SKIP silencioso (R7 §4, E6). |
| 9 | Manifestos históricos de fase e `MANIFEST.sha256` | Byte-intactos (classe `legacy`). O manifesto-ponte referencia os hashes deles; não os substitui nem os corrige. |
| 10 | `guard-data` (binário novo >200 KB, PDF novo) | A migração só REMOVE binários do índice — nenhum binário novo entra. O manifesto-ponte é texto; nada a excepcionar. |

## Vocabulário

Registrados no `CONTEXT.md` nesta Fase 0:

- **Acervo de evidência** — conjunto congelado de artefatos que sustenta uma selagem.
- **Evidence store** — destino externo ao clone (Q1: GitHub Releases); termo já usado por R11/CLAUDE.md sem definição.
- **Manifesto-ponte** — arquivo versionado e pinável que liga artefato migrado a hash original + pacote + destino.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 0 (pré-demanda) | Q1 — destino do acervo (A local / B GitHub Releases / C LFS)? | **Opção B — GitHub Releases** (usuário/proprietário no portão, 2026-08-25; registrada no plano). Não reabrir. |
| 1.1 | `evidence_unset` (fora do inventário do plano) entra na migração? | **SIM** — migra junto, como pacote próprio no mesmo ciclo, com os 4 hashes no manifesto-ponte (proprietário, 2026-08-25). |
| 1.2 | Granularidade dos releases: um por fase ou consolidado? | **Um release por fase**: `evidence-p50`, `evidence-p51`, `evidence-p52`, `evidence-unset` (proprietário, 2026-08-25). |
| 1.3 | Local exato do manifesto-ponte (fora de `docs_phase5/`)? | **`.claude/verify/`**, pinado pelo registry (proprietário, 2026-08-25). |
| 1.4 | Repositório-alvo dos releases e credencial do gate no CI? | **Este mesmo repositório** (`oflavioc/quickscan-secops`); gate no CI com o `GITHUB_TOKEN` padrão, sem segredo novo. **Simplificação registrada**: o repositório é PÚBLICO desde 2026-08-25 — o acesso aos release assets nem exige token (proprietário, 2026-08-25). |
| 1.5 | Política do gate `evidence-bridge` sem rede? | **WARN nomeado na execução local sem rede + FAIL no CI** — nunca SKIP silencioso (proprietário, 2026-08-25). |

## Fora de escopo (explícito)

- Os **3 ZIPs da raiz** e a refatoração dos oráculos S64/S74+S75/S113 — demanda
  posterior, com red próprio.
- **`evidence_v322`** — fica no clone (V322-DOC3 + README).
- **Emagrecimento do histórico/pack** — rewrite ou fresh-start é decisão separada
  do proprietário; esta demanda não mexe em histórico.
- **Manifestos históricos de fase** e reconciliação do `MANIFEST.sha256` legado
  (outra frente da Onda 4; classe `legacy` permanece congelada).
- **Qualquer byte de produto**: engine, Camada 1, HTML gerado, suítes existentes
  (a única suíte tocada é a NOVA, `evidence-bridge`; mudar S64/S74/S113 é a
  demanda posterior).
- **Evidência nova** — já governada pela R11; esta demanda só converge o legado
  para o mesmo regime.
