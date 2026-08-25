# Reconciliação retroativa — boundary real das fases 5.1 e 5.2

> Onda 4 da Estrutura Agêntica · 2026-08-25. Registro do achado E2 do exame de
> 2026-08-25: as fases 5.1 e 5.2 foram implementadas e seladas **sem spec
> normativa própria** e tocaram arquivos protegidos pela §29.4 da spec REV B.
> Este documento NÃO retro-ajusta as selagens (R13: valem como foram seladas);
> ele torna a boundary REAL legível, para que o freeze acumulativo da estrutura
> nova parta do estado verdadeiro, não do declarado.

## Fase 5.1 (merge `4aa1f12`, PR #7, squash)

Arquivos de código/teste tocados (fora `docs_phase5/` e evidência):

`README.md` · `USER_GUIDE.md` · `quickscan_secops_soccmm_v3_2_dev.html` (rebuild)
· `tests_journey_m45.js` · `tests_p50_chromium.js` · `tests_p50_core.js`
· `tests_p51_mutants.js` (novo) · `tests_session_m48.js` · `tests_visual/screen.spec.js`
· `ui_journey_v32.js` · `ui_p50_shell_v32.js` · `ui_p50_v32.css`
· **`ui_v32.css` (+98)** · **`ui_v32.js` (+286)** — ambos §29.4 (protegidos), sem
revisão de spec registrada em `specs/`.

## Fase 5.2 (merge `c1e3649`, PR #8, squash)

`README.md` · `USER_GUIDE.md` · **`build_v32_html.py`** (além da injeção nominal
da §29.3: módulos P52) · `fixtures_p52.js` (novo) · `package.json`
· `quickscan_secops_soccmm_v3_2_dev.html` (rebuild) · `tests_p50_chromium.js`
· `tests_p50_core.js` · `tests_p52_{chromium,layout,mutants}.js` (novos)
· **`tests_ui_m31.js` · `tests_ui_m332.js`** (suítes congeladas §29.4)
· `tests_unset_ug.js` · `tools_p52_{pdf_census,shots}.js` (novos)
· **`ui_journey_v32.js` · `ui_target_v32.js` · `ui_v32.js`** (§29.4)
· `ui_p50_results_v32.js` · `ui_p50_shell_v32.js`
· **`ui_p52_workspace_v32.{js,css}`** (novos — fora da lista fechada da §29.2).

## Disposição

1. **As selagens valem como foram seladas** (R13). Nenhum registro histórico de
   `docs_phase5/` é alterado; as contagens das suítes congeladas permaneceram
   exatas (verificado no exame: as edições trocaram asserções, não totais).
2. **O freeze acumulativo da estrutura parte do estado REAL**: a identidade
   vigente de todos esses arquivos está pinada em `.claude/verify/pins.json`
   e protegida por `boundary.json` + `guard-boundary` + stage `boundary`.
3. **A causa estrutural está fechada**: desde a Onda 1, expansão de boundary
   exige spec commitada ANTES do código (R6 §3) e o gate de abertura de fase
   (R4) bloqueia implementação sem `specs/PHASE_X*.md` com hash registrado em
   `.claude/verify/current_phase.json`.
