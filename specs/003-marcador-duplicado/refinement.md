# Refinamento — 003-marcador-duplicado

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

## Necessidade

O builder emite o marcador `/* V32_UI_END */` DUAS vezes no HTML gerado (bug real,
achado E11 da varredura, hoje tolerado pela exceção nominal KI-1 do marker-lint).
Os marcadores `V32_*` são a base da extração de blocos usada pelos gates de sync —
a garantia de produto é "cada bloco extraível exatamente 1×"; um marcador duplicado
quebra essa garantia e obriga o lint a carregar uma exceção com remoção prevista.
Exceção sem remoção executada vira permissão permanente (é o padrão que o próprio
`known_issues.json` declara combater). Por que agora: a KI-1 registra
explicitamente esta demanda como sua rota de remoção ("candidata pós-Onda 2, via
máquina SDD") — este refinamento é o cumprimento dessa dívida, no rito correto.

Quem usa: nenhum facilitador ou leitor de relatório percebe diferença funcional
(o marcador é comentário JS dentro do HTML). O beneficiário é a integridade do
pipeline de verificação: marker-lint sem exceções, extração de blocos confiável,
`known_issues.json` com uma dívida a menos.

## Enquadramento de produto

- **Invariantes tangenciadas (R1):**
  - **INV-1 (engine byte-idêntico)** — tangenciada, NÃO violada: a correção é na
    string `inject` do builder; `engine_v32.js` não é tocado. O payload M41
    canonicalizado **não deve mudar** (comentário HTML/JS não altera comportamento):
    o stage `m41` roda o harness contra o próprio `quickscan_secops_soccmm_v3_2_dev.html`
    rebuilded e deve continuar reportando o pin declarado
    `9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b`. Se o payload
    mudar, algo está errado além do escopo — PARAR (seria Porta B, que esta demanda
    não autoriza).
  - **INV-9 (boundary legível por máquina)** — cumprida pelo desenho: o HTML é
    classe `generated` (boundary.json) — nunca editado à mão, muda SÓ via rebuild
    pelo `build_v32_html.py`, que é editável. O `pins.json` é classe `registry` —
    repin só via `gen_pins.py`, no mesmo PR, com motivo no commit.
- **Conflito com decisão registrada?** Não — é o oposto: a entrada de
  `design-decisions.md` ("Marcador `V32_UI_END` duplicado no HTML") registra o bug
  como decisão *temporária* com remoção prevista via "demanda própria via máquina
  SDD". Esta demanda É a demanda prevista; executá-la é **cumprimento** da decisão,
  não conflito. O mesmo vale para `known_issues.json → KI-1.remocao_prevista`.
- **Alternativa mais simples considerada:** manter a exceção KI-1 para sempre
  (custo zero de código). Não basta: o próprio `_meta` do `known_issues.json`
  declara o princípio — "exceção sem prazo vira permissão permanente" — e a
  garantia "cada marcador 1×" é a premissa dos gates de extração de bloco.
  Outra alternativa descartada: afrouxar o marker-lint (aceitar 2× como regra
  geral) — enfraquecer gate para passar é vedado (CLAUDE.md, gates).

## Sistema real

Verificado no código, não suposto:

- **Defeito** — `build_v32_html.py:70` (a string `inject`, iniciada na linha 68):
  a concatenação emite o par correto do bloco UI
  (`"\n/* V32_UI_BEGIN */\n" + uijs + "\n/* V32_UI_END */\n"`) e, ao FINAL da mesma
  linha, imediatamente antes de recolocar a âncora, emite uma SEGUNDA ocorrência
  espúria: `... + "\n/* V32_P52_WORKSPACE_END */\n" + "\n/* V32_UI_END */\n" + anchor`.
  A correção esperada é remover esse segundo `"\n/* V32_UI_END */\n"` terminal.
- **Consequência observável** — `quickscan_secops_soccmm_v3_2_dev.html` contém
  2 ocorrências de `/* V32_UI_END */`: linhas **6270** e **11974** (contagem
  confirmada: 2). Todo marcador restante aparece 1×.
- **Tolerância atual** — `.claude/verify/check_markers.py:19-36` lê
  `known_issues.json`, monta `allowed` a partir das exceções com
  `lint == "marker-lint"` e aceita `ocorrencias_permitidas: 2` para `V32_UI_END`
  (KI-1, `known_issues.json:8-13`), imprimindo `[OK] ... exceção nominal KI-1`.
  Sem a exceção, o mesmo script falharia com
  `[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1`.
- **Verificação de identidade do derivado** — `.claude/verify/check_build.py`
  reconstrói em diretório efêmero e compara SHA-256 com o blob de HEAD do HTML
  publicado: a correção do builder EXIGE commit do HTML rebuilded no mesmo PR,
  senão o stage `build` fica vermelho.
- **Pins afetados** (`.claude/verify/pins.json → files`): `build_v32_html.py`
  (`beda6ecb…`), `quickscan_secops_soccmm_v3_2_dev.html` (`fb906462…`) e
  `.claude/verify/known_issues.json` (`004cff79…`) estão pinados — os três mudam
  nesta demanda → regenerar o registry via `gen_pins.py` no mesmo PR.
- **Divergência doc×código:** nenhuma encontrada — docstring do lint,
  `known_issues.json`, `design-decisions.md` e o código do builder contam a mesma
  história.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Rebuild muda o hash do HTML publicado | Repin no registry: `gen_pins.py` regenera `pins.json` no MESMO PR (classe `registry`), com motivo no commit e trilha "Identidade anterior" (`fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79`). O stage `build` prova identidade do rebuild contra o novo blob de HEAD. |
| 2 | Alguma suíte assere contagem/presença de `V32_UI_END`? | **Verificado por Grep — NENHUM `tests_*.js` referencia `V32_UI_END` ou `V32_UI_BEGIN`** (zero hits). Os únicos testes que extraem blocos por marcador usam OUTROS marcadores: `tests_m42_m86.js:598` e `tests_ui_m333.js:228` (bloco `V32_ENGINE_*`), `tests_p52_layout.js:88-94` (blocos `V32_P52_WORKSPACE_*` e `V32_P52CSS_*`). Nenhum deles é afetado pela correção. Hits repo-wide de `V32_UI_END` fora do builder/HTML são só documentação/registro: `known_issues.json:10-11`, `check_markers.py:7`, `design-decisions.md:11`, `planning-state/003-marcador-duplicado.json:5`. |
| 3 | Remoção da exceção KI-1 em `known_issues.json` ANTES da correção do builder | `check_markers.py` fica VERMELHO (`[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1`) — este é o **red natural** da demanda (Fase 4): remover a exceção, provar o FAIL commitado, depois corrigir builder + rebuild + repin para o green. Não é preciso escrever gate novo: o marker-lint já é o gate, e a remoção da exceção o rearma. |
| 4 | Payload M41 após o rebuild | DEVE permanecer `9794b267…` (pin `declared.m41_payload_sha256`). Comentário não altera comportamento; o stage `m41` roda contra o HTML rebuilded e é o oráculo dessa afirmação. Payload diferente = escopo estourado, PARAR e reportar. |
| 5 | Entrada correspondente em `design-decisions.md` | Após a correção, a linha "Marcador `V32_UI_END` duplicado no HTML" da tabela de decisões fica obsoleta (descreve um estado que deixou de existir). A demanda deve atualizá-la/removê-la para não reinstalar a divergência doc×código. |
| 6 | Contagens verdes do baseline | Suítes congeladas permanecem verdes e com as MESMAS contagens (nenhum teste depende do marcador duplicado — verificado no caso 2). Qualquer desvio de contagem = parar e reportar. |

## Vocabulário

Nenhum termo novo, vago ou conflitante — sem entrada nova no `CONTEXT.md`.
Os termos desta demanda já são canônicos e usados de forma consistente:
"Pin / repin", "Boundary", "Gate", "Red / green" (todos já no CONTEXT.md);
"exceção nominal" e "marcador" são usados uniformemente por
`known_issues.json`, `check_markers.py` e `design-decisions.md`.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| — | **Não há perguntas que exijam decisão humana nesta demanda.** O quê (remover a 2ª emissão), o como-governança (rebuild + repin + remoção da KI-1) e o red natural já estão integralmente prescritos por KI-1 (`remocao_prevista`), pela entrada de `design-decisions.md` e pela boundary. As aprovações de portão das Fases 1–3 e o aceite final seguem o rito normal da máquina SDD e não são perguntas de refinamento. | — |

## Fora de escopo (explícito)

- **Nenhum outro marcador** `V32_*` — a correção toca exclusivamente a segunda
  emissão de `V32_UI_END` na string `inject`; ordem de injeção e todos os demais
  pares BEGIN/END permanecem byte-idênticos.
- **Nenhuma outra exceção** de `known_issues.json` — KI-2 e KI-3 permanecem
  intocadas (remoções previstas próprias: Onda 3 e calibração do CI).
- **Nenhum módulo de produto** — engine, Camada 1, ui_*/ux_*/p50/p52, sessão,
  ícones, CSS: nada muda. Só builder (linha da `inject`), HTML regenerado,
  `known_issues.json` e o repin correspondente (+ ajuste da entrada obsoleta em
  `design-decisions.md`, caso de borda 5).
- **Nenhuma mudança no lint** `check_markers.py` — a regra "1× por marcador" já é
  o comportamento default; não se escreve gate novo nem se altera o existente.
- Print/PDF, superfícies 4.x, release v3.2.0: intocados (fora da change boundary).

---

ARQUIVOS_TOCADOS: specs/003-marcador-duplicado/refinement.md (criado — único artefato desta fase)
RESUMO: Refinamento da demanda 003 concluído. Defeito localizado com precisão (build_v32_html.py:70, segunda emissão de "\n/* V32_UI_END */\n" antes da âncora; HTML com 2 ocorrências, linhas 6270 e 11974). Enquadramento: cumprimento da remoção prevista da KI-1 (design-decisions.md prevê exatamente esta demanda — zero conflito); HTML muda via rebuild com repin (classe generated/registry); payload M41 não deve mudar; engine intocado. Red natural: remover KI-1 do known_issues.json deixa o marker-lint vermelho antes da correção. Nenhum teste depende do marcador duplicado (verificado por Grep). Sem perguntas pendentes ao usuário.
EVIDÊNCIA: lidos — build_v32_html.py:30-80 (defeito na linha 70), .claude/verify/check_markers.py:1-47 (tolerância via allowed), .claude/verify/known_issues.json:8-13 (KI-1), .claude/verify/boundary.json (classes generated/registry), .claude/verify/check_build.py (identidade do rebuild vs HEAD), .claude/verify/check_m41.py (payload vs pin declarado), .claude/verify/pins.json (pins de builder/HTML/known_issues; declared.m41_payload_sha256), .claude/rules/{sdd,product-invariants,design-decisions,boundary,orchestration}.md, .claude/templates/refinement.md, CONTEXT.md, .claude/project-memory/planning-state/003-marcador-duplicado.json. Greps: "/* V32_UI_END */" no HTML = 2 hits (linhas 6270, 11974); V32_UI_END em tests_*.js = 0 hits; extração de bloco por marcador em testes = tests_m42_m86.js:598, tests_ui_m333.js:228, tests_p52_layout.js:88-94 (nenhum usa V32_UI_*). Nenhuma execução (papel sem comandos).
DEPENDÊNCIAS: Fase 1 (spec) — PO + tech-lead, após alinhamento do entendimento com o usuário; a spec deve fixar os gates (marker-lint red→green, stage build, stage m41 com payload inalterado, repin via gen_pins.py) e o ajuste da entrada obsoleta em design-decisions.md. qa-engineer executa o red da Fase 4 (remoção da KI-1 + FAIL commitado). build-engineer é o dono natural da correção do builder + rebuild + repin na Fase 5.
