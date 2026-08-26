# Plano — 007-migracao-evidencia

> Fase 2 · dono: tech-lead · consome a spec aprovada (portão de 2026-08-25, com a
> emenda A2 aplicada). Referencia [spec.md](spec.md), [refinement.md](refinement.md)
> e o [parecer do PO](parecer-po-fase1.md) — as Observações 1, 4 e 5 do parecer
> são incorporadas aqui, nomeadas onde decidem algo.

## Desenho

Camada e superfície: **processo de verificação + evidence store** — nenhuma
camada de produto é tocada (nenhum byte de HTML/engine/módulo muda). Três peças
novas, todas fora do produto:

| Peça | Arquivo | Dono único | Papel |
|---|---|---|---|
| Ferramenta de geração | `.claude/verify/gen_evidence_bridge.py` | `build-engineer` | gera pacotes `.tar` (em diretório efêmero/ignorado) e o manifesto-ponte a partir do commit-âncora. **Roda uma vez na migração; NUNCA entra no pipeline** (Observação 1 do parecer: a geração não é re-executada como verificação — o check é leitor independente) |
| Manifesto-ponte | `.claude/verify/evidence_bridge.json` | `doc-writer` | dado canônico (shape na spec §Contratos); registrado no fluxo R11 §2; congelado por pin |
| Gate contínuo | `.claude/verify/check_evidence_bridge.py` + stage `evidence-bridge` | `qa-engineer` | leitor independente do manifesto; oráculos EB-1…EB-6 |

**Owner do estado (R9 §5 adaptado — não há estado de runtime):** o dado novo é o
manifesto-ponte; dono do arquivo é o `doc-writer` (quem o registra), a ferramenta
que o produz é do `build-engineer`, e o consumidor único é o check do
`qa-engineer`. Alteração futura do manifesto = re-execução da ferramenta + repin
com trilha (nunca edição à mão — R12 §gerados).

### Desenho do gate `check_evidence_bridge.py` (stage `evidence-bridge`)

Padrão de referência para relatório e WARN nomeado: `env_doctor.py`
(listas `FAILS`/`WARNS`, `[FAIL]`/`[WARN]` por item, linha final
`evidence-bridge: N FAIL · N WARN`, exit 1 se `FAILS` não-vazio).

- **Detecção de ambiente**: modo CI quando `GITHUB_ACTIONS` está no ambiente;
  caso contrário, modo local. Nenhuma outra heurística.
- **Parte offline** (roda sempre; só stdlib + git de leitura):
  1. Shape do manifesto (4 acervos; `commit_ancora` = 40 hex — SHA-1 de commit
     git, conforme emenda A2).
  2. **EB-1**: lista autoritativa por `git ls-tree -r <ancora> -- <4 dirs>`;
     hash por blob (`git cat-file blob <ancora>:<path>` em streaming) comparado
     ao manifesto; a mais/a menos/divergente = FAIL nomeando o path.
  3. **EB-6**: `git ls-files` vazio nos 4 diretórios; as 4 entradas presentes no
     `.gitignore` + `git check-ignore` confirmando; contraprova `evidence_v322`
     rastreado.
- **Parte online** (existência/integridade dos assets — EB-2/3/4):
  - URL por asset: `https://github.com/oflavioc/quickscan-secops/releases/download/<release_tag>/<pacote>`.
  - Download via `urllib` (stdlib — **nenhuma dependência nova a declarar no
    env-doctor**), com timeout; `GITHUB_TOKEN` presente vira header de
    autorização (robustez opcional — repo público, nunca requisito).
  - Hash **em streaming, sem escrever em disco** — o gate não escreve nada na
    árvore nem fora dela (R7 §3, R10 §8).
  - Classificação: **rede inalcançável** (timeout/DNS/URLError) → local: WARN
    nomeado por pacote não verificado, exit 0; CI: FAIL. **HTTP 404/release
    ausente** → FAIL em qualquer ambiente ("pacote AUSENTE"). **Hash divergente**
    → FAIL em qualquer ambiente ("pacote ADULTERADO", esperado × obtido).
    Nunca SKIP silencioso: todo não-verificado aparece nomeado no relatório.

Entrada no `pipeline.yaml` (checagem nova entra LÁ — R10 §9):

```yaml
evidence-bridge:
  desc: "Manifesto-ponte fiel ao commit-âncora, acervos migrados fora do índice, assets dos releases íntegros (sem rede: WARN nomeado local, FAIL no CI)"
  run: python .claude/verify/check_evidence_bridge.py
  parallel: false
  mutates: false
  heavy: true
```

**Decisão da Observação 4 (granularidade do heavy)**: stage **único**,
`heavy: true`. Justificativa: as duas partes são caras (offline hasheia ~103 MB
de blobs; online baixa ~103 MB) — nenhuma pertence ao post-turn `--light`, que
existe para reagir a mudança de **produto**, coisa que nenhum arquivo vigiado
por este gate é. A cobertura contínua fica no `run.sh` completo e no CI (que
rodam tudo); dividir em dois stages dobraria entradas no pipeline para ganho
marginal. Se o custo offline incomodar no futuro, a divisão é mudança de
`pipeline.yaml` com trilha própria — não desta demanda.

### Desenho da ferramenta `gen_evidence_bridge.py`

- Entrada: SHA do commit-âncora (argumento obrigatório, 40 hex; a ferramenta
  recusa `HEAD`/nome de branch — R10 §5 por construção).
- Para cada acervo: coleta os blobs de `git ls-tree -r <ancora>`, monta
  `evidence_<acervo>.tar` em **diretório efêmero/ignorado** (nunca na árvore
  rastreada), calcula SHA-256 do pacote e de cada blob, e grava
  `evidence_bridge.json` (LF, UTF-8, `newline="\n"` — R7 §2).
- **Observação 5 do parecer, incorporada**: NÃO há requisito de tar
  determinístico/reproduzível. O hash registrado congela os bytes do pacote
  efetivamente publicado (re-conferido pós-upload); regeneração byte-idêntica
  não é oráculo de nenhum EB-*. A ferramenta não promete nem testa
  reprodutibilidade do empacotamento.
- **Observação 1, incorporada**: `_meta.gerado_em` (relógio) é aceitável porque
  a ferramenta roda **uma vez** e o manifesto congela por pin; a verificação
  contínua é do check, leitor independente, que confere o **conteúdo** contra os
  blobs do commit-âncora — nunca re-executa a geração.

### Commit-âncora

Fixado na Wave 2: o SHA do **commit da Wave 1** (já pushado, imutável, com os 4
acervos ainda intactos no índice). Registrado em `_meta.commit_ancora`. É
ancestral do head do PR, logo alcançável no CI (`fetch-depth: 0`, verificado)
e em qualquer clone completo.

## Contratos e registros

- **Bridges**: nenhum — nenhuma entrada em `bridges.json` (não há módulo de
  produto).
- **Patch-points**: nenhum — o registro de patch-points desta demanda é vazio.
- **Ordem de injeção no builder**: N/A — o builder não é tocado.
- **Shape do manifesto**: o da spec §Contratos, com `commit_ancora` = 40 hex
  (emenda A2). Consumidor único: `check_evidence_bridge.py`.
- **Pins (R8)** — arquivos rastreados que nascem/mudam, capturados por
  **`gen_pins.py` ÚNICO na Wave 6** (mesmo padrão da demanda 003: uma transição
  de identidade, janela de `baseline` vermelho única e declarada):
  `gen_evidence_bridge.py` (nasce, W1), `evidence_bridge.json` (nasce, W2),
  `check_evidence_bridge.py` + `pipeline.yaml` (W3),
  `design-decisions.md` + `evidence-intake.md` (W5), `.gitignore` (W6).
  `gen_pins.py` lê blobs de HEAD — a W6 commita a desindexação primeiro e o
  `pins.json` em seguida, deixando o **head do PR** com `baseline` verde.
- **Registros que NÃO mudam**: `expected_suites.json` (stage python, não suíte
  node), `pins.json → declared`, `bridges.json`, `boundary.json`,
  `mutation_map.json` (mutantes M1–M6 são executados manualmente na validação,
  como o M1 da 003 — o harness de campanha por path é desenhado para módulos de
  produto; se o QA julgar que o gate merece trigger permanente, é proposta dele
  em DEPENDÊNCIAS da Fase 6, não desta), `.github/workflows/verify.yml`,
  manifestos históricos, `MANIFEST.sha256`.

## Boundary

Classe mais alta tocada: **`registry`** (pins.json via `gen_pins.py`, mesmo PR,
motivo no commit — rito cumprido na W6). Nada `frozen`, nada `generated`, nada
`legacy` (os manifestos históricos são referenciados, nunca editados). Os
acervos `evidence_*` não pertencem a classe de proteção — desindexá-los não
exige rito de boundary. **Nenhuma expansão de boundary** (spec + Observação 2 do
parecer: pin com trilha é a proteção do manifesto). **Nenhum ponto de PARADA por
rito D2.**

## Checklist R9 (módulo novo)

**N/A — nenhum módulo de produto nasce.** As peças novas são scripts python de
verificação/geração fora do HTML: IIFE/`__installed` N/A · bridge N/A · CSS N/A ·
`innerHTML=` N/A · helper de invariante N/A. Orçamento de linhas: aplico o
espírito — cada script com uma responsabilidade (gerar ≠ verificar, por
desenho da Observação 1) e ~600 linhas como teto informal. O stage `lint-arch`
permanece verde por vacuidade (nenhum módulo 5.x muda).

## Waves

| Wave | Tarefas (resumo) | Dono | Depende de |
|---|---|---|---|
| 1 — ferramenta | `gen_evidence_bridge.py` (geração de pacotes + manifesto; âncora por argumento 40 hex). Commit → o SHA deste commit é o **commit-âncora**. | `build-engineer` | portão da Fase 3 |
| 2 — manifesto | Executar a ferramenta com a âncora da W1; conferir e commitar `evidence_bridge.json` (registro R11 §2). Pacotes `.tar` ficam no diretório efêmero, prontos para a W4 — nunca commitados. | `doc-writer` | W1 |
| 3 — **RED** (Fase 4) | `check_evidence_bridge.py` + stage `evidence-bridge` no `pipeline.yaml`. Executar: parte offline com **EB-6 FAIL** (acervos ainda no índice, `.gitignore` sem as entradas) e parte online com **EB-3 FAIL** (releases inexistentes — 404 real). **Commitar o red** (`test(007): red — …`); planning-state `red.status: proven` + `red.commit`. EB-5 local também provada: execução sem rede simulada exibe WARN nomeado + exit 0 da parte online. | `qa-engineer` | W2 |
| 4 — publicação | Criar os 4 releases nominais (`evidence-p50/p51/p52/unset`) neste repo, um asset `.tar` cada; **conferência pós-upload**: baixar de volta e conferir SHA-256 == manifesto antes de declarar publicado. Nenhum arquivo da árvore muda (sem commit de código; registro da execução no relatório). | `build-engineer` | W3 (red provado ANTES de existir qualquer release — preserva EB-3) |
| 5 — docs pinadas `[P]` | Atualizar `design-decisions.md` (linha da evidência versionada — a migração ocorreu) e `evidence-intake.md` (parágrafo do legado); status do `PLANO_MIGRACAO_EVIDENCIA.md` (não pinado). Sem repin nesta wave (consolidado na W6). | `doc-writer` | W3 (pode rodar em paralelo com a W4 — donos e arquivos disjuntos) |
| 6 — **GREEN** | `git rm -r --cached` dos 4 diretórios + 4 entradas no `.gitignore`; commit. `gen_pins.py` **único** capturando W1/W2/W3/W5/W6; commit do `pins.json` com motivo. Rodar `evidence-bridge` local: EB-1/EB-6 verdes; parte online verde (rede) ou WARN nomeado. | `build-engineer` | W4 e W5 |
| 7 — validação (Fase 6) | Pipeline completo (`run.sh`) + EB-1…EB-7 no CI (prova canônica: clone limpo sem os acervos, contagens de `expected_suites.json` intactas — inclui a confirmação por execução da guarda de `tests_p50_mutants.js`, borda 5); executar **M1–M6 manualmente** (mutações em cópias efêmeras do manifesto/ambiente; nunca commitadas; resultado no relatório); `spec-validate`; relatório final do `doc-writer` (avisos: pack não emagrece; imutabilidade dos releases é convenção+gate — Observação 3); **aceite de intenção do PO**. | `qa-engineer` → `doc-writer` → PO | W6 |

Janelas vermelhas **declaradas** (head do PR verde fecha ambas): `baseline`
vermelho de W1 até o repin da W6 (arquivos novos sem pin); `evidence-bridge`
vermelho de W3 até W4 (EB-3) e até W6 (EB-6) — é exatamente o red auditável da
Fase 4. R8 exige "mesmo PR", não "mesmo commit".

## Riscos e rollback

| Risco | Detecção (gate) | Resposta / rollback |
|---|---|---|
| Asset corrompido no upload | Conferência pós-upload da W4; EB-2/EB-4 no CI | Re-upload do asset ANTES do green final (até o encerramento da demanda o release ainda não é "publicado-imutável"); hash do manifesto não muda — quem se ajusta é o asset |
| Manifesto gerado de âncora errada (branch/HEAD) | A própria ferramenta recusa não-40-hex; EB-1 falha se o conteúdo divergir | Regenerar manifesto (nova execução da ferramenta) + novo commit; se já repinado, repin com trilha |
| `git rm --cached` atingir caminho errado (ex.: `evidence_v322`) | Contraprova de EB-6 (v322 rastreado) + revisão do diff da W6 | `git checkout` do índice a partir de HEAD~; nada é perdido (working tree intacto, histórico intacto) |
| Rede indisponível no CI durante validação | `evidence-bridge` FAIL (política EB-5) | Re-run do job; a política é desenho, não flake — se persistir, investigar antes de qualquer mudança no gate (R10 §1: nunca enfraquecer) |
| Releases criados e demanda abortada no meio | — | `gh release delete` dos 4 releases (decisão do proprietário); revert dos commits em ordem inversa W6→W1; acervos voltam ao índice pelo revert da W6 |
| Suíte quebra com acervo fora do índice (dependência não mapeada) | EB-7 (`suites`/`suites-heavy` no CI, clone limpo) | Parar e reportar — contradiz a análise do refinement (bordas 4/5); reabrir análise antes de tocar qualquer gate |
| Mutantes M1–M6 sujarem a árvore | `git status` porcelain antes×depois (padrão `check_build.py`) | Mutações rodam em cópia efêmera/stash; só o RELATÓRIO registra |
| Escrita das suítes em diretório agora ignorado confundir dev local | Nenhum gate (comportamento correto por desenho — borda 4) | Documentado no relatório final: artefato recriado localmente não é o acervo; o acervo é o congelado no commit-âncora |

Rollback geral: cada wave é commit atômico reversível por `git revert`; a
migração não destrói nada — os blobs permanecem no histórico (borda 6) e os
releases são deletáveis até o aceite final.

## Protótipo

Nenhum — não há questão que só código responda: mecânica de tar/upload/download
e oráculos por hash são operações determinadas; a única incerteza real
(alcançabilidade dos release assets em runtime) é exatamente o que o red da W3 e
a conferência da W4 provam dentro do próprio fluxo.
