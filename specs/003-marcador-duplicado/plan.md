# Plano — 003-marcador-duplicado

> Fase 2 · dono: tech-lead · consome a spec aprovada (com a emenda G2 do portão
> da Fase 1). Referencia [spec.md](spec.md) e [refinement.md](refinement.md).

## Desenho

Camada e superfície: **toolchain de build + registros de verificação** — nenhuma
camada de produto é tocada. A correção vive na string `inject` do builder; o HTML
muda apenas como derivado regenerado; os demais arquivos são registros de
governança (exceção nominal, decisão registrada, pins).

Módulos tocados — **um dono por arquivo, nunca dois donos no mesmo arquivo**
(R5 §waves; nenhum arquivo aparece em duas waves com donos distintos):

| Arquivo | Mudança | Dono único | Classe (boundary) |
|---|---|---|---|
| `.claude/verify/known_issues.json` | remoção da entrada KI-1 (KI-2/KI-3 byte-idênticas) | `qa-engineer` — é o ato que produz o red (G1) | produto/registro editável |
| `.claude/rules/design-decisions.md` | remoção da linha "Marcador `V32_UI_END` duplicado no HTML" da tabela de confirmadas | `doc-writer` | doc editável (pinada) |
| `build_v32_html.py` | remoção do segundo `+ "\n/* V32_UI_END */\n"` terminal da `inject` (linha ~70; diff exato na spec, §Comportamento) | `build-engineer` | editável |
| `quickscan_secops_soccmm_v3_2_dev.html` | **NUNCA editado à mão**: regenerado via `python build_v32_html.py` | `build-engineer` (via rebuild) | `generated` |
| `.claude/verify/pins.json` | regenerado via `gen_pins.py` (4 pins mudam; `declared.*` intactos) | `build-engineer` (via gen_pins) | `registry` |

**Owner do estado: N/A** — nenhum dado novo nasce nesta demanda (R9 §5 sem objeto).

## Contratos e registros

- **Bridges:** nenhum — nenhuma entrada nova/alterada em `bridges.json`.
- **Patch-points:** nenhum — registro de patch-points desta demanda é vazio.
- **Ordem de injeção no builder:** relevante e **inalterada** — engine → adapter →
  icons → ui → ux → target → ref → build_meta → journey → session → p50_shell →
  p50_suff → p50_results → p52_workspace → anchor; CSS (linha 76) intocado.
  A mudança remove uma emissão espúria, não reordena nada.
- **Pins (R8):** 4 arquivos pinados mudam (tabela acima + spec §Contratos).
  Regeneração via `gen_pins.py` no MESMO PR, **uma única vez**, na Wave 3
  (justificativa na seção Waves), com motivo no commit e trilha
  "Identidade anterior: `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79`"
  para o HTML. `declared.m41_payload_sha256` NÃO muda (G4 é a régua; mudar seria
  Porta B, não autorizada).
- **Detalhe operacional do repin:** `gen_pins.py` lê **blobs de HEAD** (R8) — o
  repin só captura o que já está commitado. A Wave 3 portanto commita
  correção+HTML primeiro e o `pins.json` regenerado em seguida (ou amend),
  garantindo que o **head do PR** esteja com stage `baseline` verde.

## Boundary

Classe mais alta tocada: **`generated` + `registry` — ambas pelo rito correto**:

- `generated` (HTML dev): muda SÓ via rebuild pelo builder; o stage `build` prova
  a identidade (G3). Nenhuma edição manual em nenhuma wave.
- `registry` (pins.json): muda SÓ via `gen_pins.py`, no mesmo PR, com motivo no
  commit (G/stage `baseline`).
- **Nada `frozen` tocado** (engine, Camada 1, harness M41, snapshot funcional) e
  nada `legacy` (MANIFEST.sha256, spec REV A). **Nenhum ponto de PARADA por rito
  D2** — o plano não requer autorização de Porta A/B.

## Checklist R9 (módulo novo)

**N/A — nenhum módulo novo é criado nesta demanda.** Declarado item a item:
IIFE/`__installed` N/A · bridge registrado N/A · CSS por prefixo N/A ·
zero `innerHTML=` N/A · orçamento de linhas N/A (o builder DIMINUI) ·
helper único de invariante N/A. O stage `lint-arch` roda de qualquer forma no
pipeline e deve permanecer verde (nenhum módulo 5.x muda).

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| 1 — **red** (qa-engineer) | Remover KI-1 de `known_issues.json`; rodar stage `marker-lint`; registrar o FAIL esperado (`[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1`, exit ≠ 0); **commitar o red** (mensagem `test(003): red — ...`); registrar `red.commit` e `red.status: proven` no planning-state (R3 §4). | portão da Fase 3 (tasks.md aprovado) |
| 2 — **doc** (doc-writer) | Remover a linha do marcador duplicado da tabela de `design-decisions.md` (tipo `doc`, sem red — R3). Nenhum repin nesta wave (consolidado na Wave 3). | Wave 1 (para o histórico contar a ordem certa: red provado antes de qualquer outra mudança) |
| 3 — **green** (build-engineer) | Corrigir o builder (diff exato da spec); `python build_v32_html.py` — **a regravação do HTML é a ENTREGA, não efeito colateral**; commitar correção+HTML; executar `gen_pins.py` (captura de uma vez os 4 pins: known_issues da W1, design-decisions da W2, builder e HTML da W3) e commitar `pins.json` com motivo + trilha "Identidade anterior fb906462…". Rodar marker-lint local (G2: linha final `marker-lint: 34 marcadores distintos · 0 problema(s)`). | Waves 1 e 2 |
| 4 — **validação** (qa-engineer; depois PO) | Executar G2–G5 + pipeline completo (`run.sh`: baseline, boundary, marker-lint, build, m41, suites, suites-heavy, lint-arch, state…); executar **M1 manualmente** (reintroduzir a emissão em cópia efêmera/stash, provar o FAIL do marker-lint sobre o rebuild mutado, reverter, registrar resultado no relatório da fase); spec-validate; então **aceite de intenção do PO** — incluindo a conferência da linha removida de design-decisions.md (observação 2 do parecer). | Wave 3 |

**Decisão de ordenação (doc ANTES do green) — justificada:** o coordenador deixou
a escolha entre W3-doc-depois (segundo `gen_pins.py`) e doc-antes (repin único).
Escolho **doc antes do green** porque: (a) `design-decisions.md` é pinada — editar
depois do repin da correção exigiria **segunda** regeneração do registry, ou seja,
duas transições de identidade no mesmo PR para a mesma demanda (mais trilha, mais
ruído de auditoria, zero ganho); (b) com repin único, a janela em que o stage
`baseline` fica vermelho (pins divergindo dos arquivos já commitados) é **uma só e
declarada** — abre no commit red da Wave 1 e fecha no commit de pins da Wave 3;
(c) a edição é tipo `doc`, independente do fix, e o "estado intermediário" em que
a linha já saiu mas o bug ainda existe está integralmente documentado pelo próprio
red commitado da Wave 1 + planning-state da demanda — não há divergência
doc×código inauditável em nenhum commit do PR. Custo aceito e declarado:
commits intermediários do PR têm stages vermelhos **esperados e nomeados**
(marker-lint a partir da W1; baseline até o repin da W3); o **head do PR** é
integralmente verde — R8 exige "mesmo PR", não "mesmo commit".

Paralelismo: nenhuma wave roda em paralelo com outra (dependência real em cadeia);
dentro de cada wave há um único dono, então não há colisão de arquivo possível.

## Riscos e rollback

| Risco | Detecção (gate) | Resposta / rollback |
|---|---|---|
| Payload M41 muda após o rebuild (comentário afetou comportamento — não deveria) | stage `m41` (G4): `payload ≠ pin declarado` | **PARAR e reportar** — virou Porta B, que esta demanda não autoriza. Rollback: `git revert` dos commits da Wave 3; HTML antigo recuperável pelo hash `fb906462…` da trilha |
| Rebuild diverge entre plataformas (CRLF/ambiente) | stage `build` (G3) no CI; localmente `check_build.py` | O builder grava LF por construção, mas determinismo é comprovado APENAS em Linux (CLAUDE.md): o rebuild oficial da Wave 3 roda em WSL/Linux; o stage `build` do CI é o oráculo final. Divergência = investigar ambiente antes de qualquer novo commit |
| Rebuild altera mais do que a 2ª ocorrência (diff maior que o esperado) | inspeção do diff do HTML na Wave 3 + G2 (linha final `34 marcadores distintos · 0 problema(s)`) + G4 | Reverter o commit; conferir que SÓ o trecho terminal da linha 70 foi tocado |
| Alguma suíte quebra ou muda contagem (dependência não mapeada do marcador) | stages `suites`/`suites-heavy` (G5) vs `expected_suites.json` | Parar e reportar (contradiz o Grep do refinamento — reabrir análise); rollback por revert |
| Mutante M1 suja a árvore de trabalho ou vaza para commit | `git status` + o próprio `check_build.py` (porcelain antes×depois) | M1 roda em cópia efêmera/stash e é revertido antes de qualquer commit; execução e resultado só entram no RELATÓRIO |
| Janela de baseline vermelho entre W1 e W3 confunde auditoria | stage `baseline` nos commits intermediários | Janela é **declarada neste plano** e fecha no repin da W3; head do PR verde. Se o PR precisar ser abandonado no meio: revert em ordem inversa (W3→W2→W1) restaura pins, doc e KI-1 |
| Edição manual acidental do HTML | hook `guard-boundary` (classe `generated`) + stage `build` | O hook nega; se algo escapar, `check_build.py` acusa divergência rebuild×HEAD |

Rollback geral: cada wave é commit(s) atômico(s) e reversível(is) por
`git revert`; nenhuma mudança destrutiva — a identidade anterior do HTML
permanece recuperável pelo hash `fb906462…` registrado na trilha do repin.

## Protótipo

Nenhum — não há questão que só código responda: o defeito, o diff e os oráculos
estão integralmente determinados pela spec e verificados no refinement
(builder lido, lint lido, contagem 34 confirmada no HTML real).

---

ARQUIVOS_TOCADOS: specs/003-marcador-duplicado/plan.md (criado — único artefato desta fase)
RESUMO: Plano da Fase 2 pelo template. Desenho com dono único por arquivo (known_issues→qa; design-decisions→doc-writer; builder+HTML rebuilded+pins→build-engineer); owner do estado N/A; zero bridges/patch-points; ordem de injeção declarada inalterada. Boundary: classes mais altas tocadas são generated (HTML só via rebuild) e registry (pins só via gen_pins), ambas pelo rito — nada frozen, nenhuma parada D2. Waves: 1-red (KI-1 fora, FAIL commitado, red.status proven) → 2-doc (linha de design-decisions sai, sem repin) → 3-green (fix + rebuild como entrega + gen_pins ÚNICO consolidando os 4 pins, trilha fb906462…) → 4-validação (G2–G5 + M1 manual em cópia efêmera + pipeline + spec-validate + aceite do PO conferindo a linha removida). Ordenação doc-antes-do-green escolhida e justificada: repin único, janela de baseline vermelho única e declarada, sem segunda transição de identidade; R8 exige mesmo PR, não mesmo commit — head do PR verde. Riscos com gate de detecção e rollback por revert; R9 declarado N/A (nenhum módulo novo).
EVIDÊNCIA: lidos nesta fase — .claude/templates/plan.md:1-39, .claude/rules/modularity.md:1-33 (R9 §4-5 para patch-points/owner de estado); reutilizados da Fase 1 (já lidos integralmente nesta sessão): spec.md e refinement.md da demanda, rules/tdd.md (R3 §4 red commitado), rules/pins.md (R8 §1 "mesmo PR", gen_pins a partir de blobs de HEAD), rules/boundary.md (classes/ritos), rules/orchestration.md (waves/dono único), rules/gates.md, verify/check_markers.py, check_build.py (porcelain antes×depois), check_m41.py, known_issues.json, pipeline.yaml (nomes e ordem dos stages), pins.json (4 pins + declared), build_v32_html.py:60-79. Execuções só-leitura desta sessão: cat pipeline.yaml; grep pins.json; grep de marcadores no HTML (34 distintos confirmados). Nenhum gate executado (fase de desenho — nada a executar).
DEPENDÊNCIAS: portão da Fase 2 com o usuário; Fase 3 (tasks.md) por mim (tech-lead) após o portão — tipagem prevista: W1 `fix`-red/QA, W2 `doc`, W3 `fix`/build-engineer, W4 `chore`-validação/QA; execução das waves é do orquestrador (eu proponho, não delego); build-engineer deve confirmar ambiente WSL/Linux para o rebuild oficial da Wave 3 (risco de plataforma declarado).
