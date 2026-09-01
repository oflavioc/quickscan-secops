# Tarefas — 014-gate-sem-poder-discriminante

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Consome o [plan.md](plan.md). O tech-lead **propõe**; quem delega é o orquestrador.

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | product-owner | doc | | **Errata E1–E6** na `spec.md` (plan.md §Erratas): E1 partição `d014`/`d014vis` em §Contratos · E2 carrasco da `KI-4` é IC-9.2/IC-9.3 em C7 · E3 âncora entra em C1 (`find`/`repl`) em C2 · E4 parser jsdom + especificidade interna em §Comportamento · E5 alínea **(e)** de C1 (prefixo não-vácuo) + mutante `D014-M9` · E6 censo de parse pinado em C2. Amenda a célula, preserva o id do critério | — |
| T002 | 0 | build-engineer | chore | | `gen_pins.py` — **repin R3** (fecha o commit de `plan.md`+`tasks.md`) | stage `baseline` |
| T003 | 0 | build-engineer | chore | | `gen_pins.py` — **repin R4** (fecha o commit da errata) | stage `baseline` |
| T004 | 0 | build-engineer | chore | [P] | `planning-state/014-*.json` → fases `plan`/`tasks` aprovadas, com a data. Excluído do registry: **não pede repin** | stage `state` |
| T010 | 1 | qa-engineer | feature | [P] | `fixtures_014_regra_morta.js` — folhas **sintéticas** (strings, nunca arquivos `.css`: não podem entrar na árvore varrida nem no builder): (a) morta por especificidade · (b) morta por ordem com especificidade empatada · (c) viva por especificidade menor na camada posterior · (d) viva por `!important` em camada anterior · **(e) viva por prefixo NÃO-vácuo** (E5) · (f) **indecidível sintético** — guarda obrigatória de não-vacuidade de C6 | `D014-CASC1`, `D014-IND1` |
| T011 | 1 | qa-engineer | feature | [P] | `.claude/verify/regra_morta.json` — esqueleto legível por máquina: `exclusoes[]` (`harness`·`mutante`·`motivo` do vocabulário fechado `oraculo-de-fonte`\|`fallback-declarado`·`propriedade_afirmada`·`arquivos_lidos`), com as duas exclusões reais (`p50/M8` → `P50-COR1`; `d009/D009-M5` → `D009-DOM1`, registrando a cegueira medida: `.jn-dom` só ocorre em `ui_ux_v32.css:249-271`); `indecidiveis.contagem` e `censo[]` **a fixar por execução** em T070 | `D014-EXC1` |
| T012 | 1 | build-engineer | chore | | `gen_pins.py` — **repin R5** | stage `baseline` |
| T020 | 2 | qa-engineer | feature | | `tests_014_regra_morta.js` — os gates: `D014-CASC1` (alíneas a–e) · `D014-VARR1` (árvore real, população do preflight, 0 mortas + lista de avaliados e excluídos) · `D014-EXC1` (a–d, incl. exclusão órfã reprovando por preflight) · `D014-COB1` (folhas e **ordem** derivadas de `build_v32_html.py`; subsequência conferida contra `PHASE_5_0_REV_B.md:1606`) · `D014-IND1` (indecidíveis nomeados e contados) · **`D014-CEN1`** (censo de parse por folha; divergência reprova — E6). Consome o normalizador pela API de `regra_morta.js`; **proibido** reimplementar a comparação na suíte | todos os `D014-*` |
| T021 | 2 | qa-engineer | chore | | `expected_suites.json` — entrada nova para `tests_014_regra_morta.js`. Contagem **declarada** agora e **fixada por execução** em T070; **nunca rebaixada** durante o vermelho (R10 §1, precedente d009/d010/d011) | stage `suites` |
| T022 | 2 | qa-engineer | chore | | Executar a suíte e **COMMITAR o FAIL** (R3 §4 — red não commitado é red inauditável). Registrar `red.status: proven` + referência do commit no `planning-state` | stage `tdd` |
| T023 | 2 | build-engineer | chore | | `gen_pins.py` — **repin R6** | stage `baseline` |
| T030 | 3 | qa-engineer | feature | [P] | `tests_009_mutants.js` — estende o preflight (C1) com `find`/`repl` para os **2** mutantes de CSS (`D009-M5`, `D009-M17`). Aditivo: `check_mutation.py` valida só as chaves obrigatórias | `IC-4`, `D014-VARR1` |
| T031 | 3 | qa-engineer | feature | [P] | `tests_011_mutants.js` — idem, **5** mutantes (`D011-M10/M12/M13/M19/M20`) | `IC-4`, `D014-VARR1` |
| T032 | 3 | qa-engineer | feature | [P] | `tests_p50_mutants.js` — idem, **4** (`M8`, `M51`, `M52`, `M53`). **Dispara a campanha p50 (chromium) → job `visual`** | `IC-4`, `D014-VARR1` |
| T033 | 3 | qa-engineer | feature | [P] | `tests_p51_mutants.js` — idem, **2** (`M51-01`, `M51-08`). **Dispara p51 (chromium) → job `visual`** | `IC-4`, `D014-VARR1` |
| T034 | 3 | qa-engineer | feature | [P] | `tests_p52_mutants.js` — idem, **36**. **Dispara p52 (chromium) → job `visual`** | `IC-4`, `D014-VARR1` |
| T035 | 3 | build-engineer | chore | | `gen_pins.py` — **repin R7** | stage `baseline` |
| T040 | 4 | build-engineer | feature | | `.claude/verify/regra_morta.js` — o instrumento: parse por **CSSOM do jsdom** (dependência declarada) · normalizador de seletor (6 regras do plan) · especificidade **interna** sobre a gramática aceita · **prefixo vácuo** (`html`/`body`/`:root` e só) · contexto de mídia (identidade + contenção por tipo; resto indecidível) · vencedora por importância→especificidade→ordem · folha mutada **em memória** (`find`→`repl`, nunca em disco — R7 §3) e **diff** de declarações · relatório de avaliados, excluídos, indecidíveis e censo. Orçamento ~490 linhas; passando de 600, dividir em `regra_morta_seletor.js` + `regra_morta.js`, com o motivo no commit | `D014-CASC1`, `D014-VARR1`, `D014-COB1`, `D014-IND1`, `D014-CEN1` |
| T041 | 4 | build-engineer | chore | | `pipeline.yaml` — stage `regra-morta` (`run: node tests_014_regra_morta.js`, `parallel: true`, `mutates: false`, **`heavy: false`**, sem Chromium), **após `lint-arch`**. Checagem nova entra aqui, nunca no prompt de um agente (R10 §9) | `run.sh` |
| T042 | 4 | build-engineer | chore | | `gen_pins.py` — **repin R8** | stage `baseline` |
| T050 | 5 | qa-engineer | fix | | **COMMIT ATÔMICO — os três juntos, nunca em dois PRs** (C7): (1) aposenta `M51-01` de `tests_p51_mutants.js`; (2) `mutation-matrix.json` — razão da aposentadoria + **substituição nominal apontando `D014-M10`**, e `P51-VIS1` para `dividas_declaradas` como **dívida declarada com causa** (a propriedade é medida pelo par `D014-M10`/`P52-LAY2`; `P51-VIS1` permanece como segunda medição independente — linguagem do precedente `D011-IDEM1(d)`); (3) **remove a `KI-4`** de `known_issues.json`. Dívida declarada **nunca** vira mutante sintético | `IC-9.2`, `IC-9.3`, `D014-VARR1` |
| T051 | 5 | build-engineer | chore | | `gen_pins.py` — **repin R9** | stage `baseline` |
| T060 | 6 | qa-engineer | feature | | `tests_014_mutants.js` (D014-M1…M9) **+** entrada `d014` no `mutation_map.json` com `"preflight": true` **no mesmo commit** em que o harness lê `--preflight` em argv (D4 da 013 — a chave sem o modo derruba `IC-4` e o stage inteiro, mesmo com a campanha verde). Alvos: as 5 folhas CSS + `build_v32_html.py` + `tests_014_regra_morta.js` + `tests_014_mutants.js`; `requires: [node, python]`. Emitir o vocabulário de três estados | `IC-1`, `IC-4` |
| T061 | 6 | qa-engineer | feature | | `tests_014_mutants_visual.js` (`D014-M10`: `ui_p52_workspace_v32.css:77` → `minmax(0, 1fr)`) **+** entrada `d014vis` (`requires: [node, python, chromium]`, `preflight: true` no mesmo commit). Muta → **rebuild** (`build_v32_html.py`, caminho entre aspas — R10 §7) → `node tests_p52_chromium.js` → restaura folha **e** artefato. `tests_p52_chromium.js` é **invocado, nunca editado**. **Sequencial a T060** (ambos tocam `mutation_map.json`) | `P52-LAY2` |
| T062 | 6 | qa-engineer | chore | | `mutation-matrix.json` — pares `D014-M1…M10`. `check_tdd.py:49` exige `harness` + `gate` + `ultima_prova.resultado` em **todos**: o par de `D014-M10` nasce com `resultado: "NÃO EXECUTADO"` e causa `ambiente sem chromium`, fechado em T081 | stage `tdd` |
| T063 | 6 | build-engineer | chore | | `gen_pins.py` — **repin R10** | stage `baseline` |
| T070 | 7 | qa-engineer | chore | | **Fixar POR EXECUÇÃO** (nunca pelo total declarado): contagem da suíte em `expected_suites.json`; `indecidiveis.contagem`; `censo[]` por folha. **Não-vacuidade de C6**: se a contagem de indecidíveis da árvore real for **zero**, declarar a vacuidade da alínea **no registro, com a razão** — o caso sintético (f) carrega o critério, e nada é apagado (R2 §5) | `D014-IND1`, `D014-CEN1`, stage `suites` |
| T071 | 7 | qa-engineer | chore | | Campanha `d014` local sob protocolo de árvore limpa: `D014-M1…M9` **9/9 DETECTADO**. Primeira execução com FAIL é registrada, nunca escondida (R2 §1) | stage `mutation` |
| T072 | 7 | build-engineer | chore | | `gen_pins.py` — **repin R11a** | stage `baseline` |
| T080 | 8 | qa-engineer | chore | | `bash .claude/verify/run.sh` completo e `MUTATION_DEFER_MISSING=1 bash .claude/verify/run.sh` — as campanhas `p50`/`p51`/`p52`/`d014vis` saem **nomeadas como delegadas**, jamais em silêncio (R10 §2) | pipeline |
| T081 | 8 | qa-engineer | chore | | **Job `visual` do CI** (única superfície com Chromium): campanhas `p50`/`p51`/`p52`/`d014vis`. Fechar o par `D014-M10` × `P52-LAY2` em `mutation-matrix.json` com o resultado e a referência da execução. Se o job não rodar antes do merge, a pendência vira **dívida declarada com prazo** no relatório — nunca omissão | `P52-LAY2`, `IC-5` |
| T082 | 8 | qa-engineer | chore | | Skill `spec-validate` — conformidade critério a critério contra a spec **já com as erratas E1–E6** | — |
| T083 | 8 | product-owner | doc | | Aceite de intenção (Fase 6): a demanda entrega **exposição permanente vigiada**, não saneamento. Conferir que `KI-4` sumiu **e** que há carrasco novo — `IC-9.3` reprova nas duas direções | — |
| T084 | 8 | doc-writer | doc | | `relatorio-final.md` (template R12) + **dois achados de backlog com id permanente**: (1) divergência `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md` × `boundary.json` (a proteção real é de **identidade**, não de proibição — nunca editar spec selada); (2) as **três provas de discriminância vencidas** (decisão P5 do refinamento), id alocado contra a `develop` | — |
| T085 | 8 | build-engineer | chore | | `gen_pins.py` — **repin R11b** (fecha o relatório final) | stage `baseline` |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Notas de execução que o orquestrador precisa

- **T060 e T061 não são `[P]`**: ambos escrevem em `.claude/verify/mutation_map.json`.
  Mesmo dono, mesma wave, arquivo comum → sequenciais.
- **T030–T034 são `[P]`**: cinco arquivos distintos, mesmo dono, sem interseção.
- **Red antes de tudo**: nenhuma tarefa de wave ≥ 3 sai antes de T022 estar
  commitada. O julgador nasce antes do julgado.
- **A wave 5 é indivisível.** Aposentar `M51-01` sem remover a `KI-4` reprova
  (`IC-9.2`); remover a `KI-4` sem aposentar reprova (o sobrevivente fica sem
  perdão). Um commit, três arquivos, um dono.
- **Repin é sempre commit próprio e posterior** — `gen_pins.py` lê blobs de
  `HEAD`. Wave com dois commits de conteúdo vira R\<n\>a/R\<n\>b.
