# Spec — 009-leitura-do-relatorio

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Trocar a ordem de construção pela ordem narrativa no resultado, tirar a repetição
em prosa dos próximos passos, levar a explicação de capability ao leitor do
relatório, soltar a legenda da jornada da régua de corpo de texto e separar
"contexto não informado" de "contexto informado e nada se aplica" no card de
prática-alvo — estabelecendo, no caminho, a regra de **bloco de ausência**.
Link: [refinement.md](refinement.md) — escopo vinculante em "Escopo desta demanda
— decidido no portão"; vocabulário obrigatório em [CONTEXT.md](../../CONTEXT.md)
(verbetes *Habilitador*, *Bloco de ausência*, *Ordem canônica de leitura*, *Base
de evidência da sessão*, *Tecla de atalho*).

## Âncora normativa: a ordem canônica de leitura

Esta seção **é** a âncora normativa da P52-RES2 §7 daqui para frente. Nenhum
oráculo pode ler a ordem de `ui_p52_workspace_v32.js` — seria equivalente por
construção e perderia poder discriminante (refinement, "Conflito com decisão
registrada"). As três listas abaixo são copiadas **literalmente** para os
oráculos; o produto é conferido contra elas, nunca o contrário.

**Ordem canônica declarada (9 seções, chaves do runtime):**

| # | Chave | Título |
|---|---|---|
| 1 | `exec` | Visão executiva |
| 2 | `priorities` | Prioridades do negócio |
| 3 | `detail` | Domínios e heat map |
| 4 | `gaps` | Gaps observados |
| 5 | `target` | Cenário-alvo |
| 6 | `context` | Contexto tecnológico |
| 7 | `support` | Formas de apoio |
| 8 | `evidence` | Evidência e suficiência |
| 9 | `actions` | Relatório e sessão |

**Variante de gate ABERTO** (SUFF-REV-A: com o resultado liberado a suficiência
deixa de ser seção e vira a *base de evidência da sessão* dentro de `actions`):

```
exec > priorities > detail > gaps > target > context > support > actions
```

**Variante de gate FECHADO** (exceção declarada, mantida — resultado bloqueado
não pode parecer liberado):

```
exec > evidence > priorities > detail > gaps > target > context > support > actions
```

Duas cláusulas duras valem nas **duas** variantes: o cenário-alvo vem
imediatamente **antes** do contexto tecnológico, e a ordem relativa de todo o
resto é a declarada acima. Seção sem conteúdo continua não renderizando
(`ui_p52_workspace_v32.js:2212`), e a subsequência das que sobram continua
estrita.

## Troca de âncora — registro da ratificação (consumada)

**Isto é trilha de auditoria, não pendência.** A §8 continua citável como
histórico; ela não é apagada, é **substituída**.

| Campo | Registro |
|---|---|
| **O que foi substituído** | A cláusula **§8** da diretriz da Phase 5.2 — *"o cenário-alvo vem imediatamente depois da visão executiva"* —, registrada em `docs_phase5/PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md:91-107` e §1.4, e implementada na forma forte pelo gate `P52-TGT1` (`tests_p52_layout.js:229-241`: `iT === iE+1` com gate aberto, `iE+2` com gate fechado) |
| **O que passa a ser a âncora** | A seção "Âncora normativa: a ordem canônica de leitura" **desta spec**. Todo oráculo de ordem é reescrito a partir dela |
| **Quem ratificou** | O proprietário |
| **Quando** | 2026-08-27 |
| **Onde** | No chat, em pergunta explícita com as duas ordens lado a lado; opção selecionada: *"5º — trocar a regra selada"* |
| **Rota** | **A — substituir a §8.** As rotas B (preservar a §8, devolvendo `target` à 2ª posição) e C (híbrido) foram descartadas na mesma decisão |

Por que a troca precisou ser explícita: o refinamento levou ao portão apenas a
forma **fraca** de P52-TGT1 ("alvo antes do contexto"), que a ordem nova preserva;
a forma **forte**, que a ordem nova quebra, não tinha sido apresentada. R10 §1
proíbe enfraquecer gate para passar — reancorar a asserção só é legítimo como
troca de âncora ratificada, nunca como edição de conveniência no teste. Com a
ratificação registrada acima, C1 e C2 estão **destravados** e P52-TGT1 é
reancorado conforme C3.

## Ampliação de escopo — registro da ratificação (C13)

**Trilha de auditoria.** O critério **C13** foi marcado nesta spec como
*ampliação sinalizada*: ele não nasceu no `refinement.md` e, pela R4, ampliação
não refinada não entra por decisão de agente.

| Campo | Registro |
|---|---|
| **O que amplia** | As 3 capabilities com `landscapeEnabled: false` — `soc-governance`, `soc-staffing`, `soc-skills` — que cobrem 5 das 15 perguntas (`mandate`, `governance`, `policies`, `team-capacity`, `training`). Hoje elas caem na mesma frase genérica de "nenhum habilitador identificado pelo contexto atual", como se fosse contexto por preencher — quando não há landscape a informar |
| **Efeito na demanda** | O defeito de `ui_target_v32.js:166` passa a ter **4** estados especificados (S1 habilitadores · S2 não informado · S3 informado sem aderência · S4 landscape não aplicável) em vez de 3 |
| **Quem ratificou** | O proprietário |
| **Quando** | 2026-08-27 |
| **Onde** | No chat, no portão da Fase 1, com a frase literal *"Aprova a spec com C13"* |

Consequência declarada: `D009-UNS4` e o mutante **M15** entram no escopo desta
demanda; o `refinement.md` não é reescrito retroativamente — a ampliação vive
aqui, com a ratificação que a autoriza.

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Suíte nova: `tests_009_leitura.js`, namespace exclusivo `D009-*` (R10 §1 — não
continua numeração de fase alheia e não vive em arquivo de outra fase), jsdom,
sem dependência de Chromium. Registro em `.claude/verify/expected_suites.json` no
MESMO PR (R10 §3), com a contagem fixada pelo `qa-engineer` no verde. Campanha de
mutação nova: `tests_009_mutants.js`, registrada em
`.claude/verify/mutation_map.json` com `requires: [node, python]`.

**Fixtures.** C1 usa `P52_F1`; C2 usa `P52_F3`; C10 e C13 usam `P52_F2` (landscape
UNSET com quatro alvos, dos quais três em capability sem landscape — `mandate`,
`governance`, `team-capacity` — e um em capability com landscape aplicável —
`logs`/`security-analytics`), que é o par S2×S4 já pronto. **Nenhuma das cinco
fixtures 5.2 alcança S3 nem B9**: `P52_F5` declara contexto mas sem alvos, e com
gap suficiente cai em S1. C11 e C12 exigem **duas fixtures novas**, locais à suíte
da demanda (não se altera `fixtures_p52.js`, que é artefato de outra fase):
uma com prática-alvo sobre capability **sem gap** e contexto declarado (S3) e uma
com contexto **parcial** — uma capability declarada e outra UNSET, com alvo em
ambas (B9). Ambas montadas pelos owners canônicos (`p50ApplyPresence`,
`p50ApplyTargets`), nunca por escrita direta de derivado.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| C1 | **Ordem nova com gate ABERTO.** As 8 seções presentes aparecem exatamente na variante de gate aberto declarada acima, e o trilho anuncia a MESMA sequência | `D009-ORD1` · `tests_009_leitura.js` · fixture `fixtures_p52.js` · `P52_F1` (tela cheia, gate aberto). A lista esperada é **literal na suíte**, copiada da âncora desta spec; é proibido derivá-la de `window.__P52.sections()`, de `P52_SECTIONS` ou de qualquer constante das suítes 5.2 (comentário normativo no topo do gate). Confere: (a) `#p52-flow > .p52-sec[data-p52-sec]` igual, item a item, a `["exec","priorities","detail","gaps","target","context","support","actions"]`; (b) `.p52-rail-link[data-p52-rail]` na mesma sequência do fluxo; (c) `target` imediatamente antes de `context`; (d) toda seção presente pertence ao namespace canônico (nenhuma chave estranha) | **M1**: em `ui_p52_workspace_v32.js`, mover o **par** `{ key: "target" }` + `{ key: "context" }` de volta para a 2ª/3ª posição de `P52_SECTIONS` (restaurar a ordem selada da 5.2) → `D009-ORD1` DEVE falhar nomeando a sequência observada. Mutante escolhido de propósito: ele **passa** em `P52-TGT1` reancorado (o alvo continua depois de `exec` e colado em `context`) — é a prova de que a ordem completa precisa de gate próprio, e não pode ser deduzida da cláusula de adjacência |
| C2 | **Exceção de gate FECHADO preservada.** Com suficiência fechada, "Evidência e suficiência" é a 2ª seção, o resto segue a ordem nova e o alvo cai na 6ª posição, ainda imediatamente antes do contexto | `D009-ORD2` · `tests_009_leitura.js` · fixture `fixtures_p52.js` · `P52_F3` (gate fechado). Confere: (a) `#p52-workspace[data-p52-gate="blocked"]` e `[data-p52-order="gate-blocked"]`; (b) sequência igual a `["exec","evidence","priorities","detail","gaps","target","context","support","actions"]`, literal na suíte; (c) `evidence` no índice 1; (d) `target` no índice 5 e `context` no índice 6; (e) trilho idêntico ao fluxo; (f) o ponteiro `[data-p52="gate-jump"]` continua existindo só neste estado e apontando para `#p52-sec-evidence` | **M2**: `p52OrderFor()` devolver `P52_SECTIONS` para qualquer gate (remover a exceção) → `D009-ORD2` DEVE falhar em (b) e (c), com a suficiência caindo para a 8ª posição |
| C3 | **Oráculos da 5.2 reancorados nesta spec, e P52-TGT1 reancorado.** As constantes de ordem de `tests_p52_layout.js` (`P52_CANONICAL_ORDER`, `P52_RELEASED_ORDER`, `P52_BLOCKED_ORDER`) e de `tests_p52_chromium.js` (`CANON` de P52-LAY3 · `BLOCKED` de P52-GATE1v) passam a ser as desta spec, com o comentário citando **este arquivo** e a data da ratificação como âncora. `P52-TGT1` troca a asserção de posição absoluta (`iT === iE+1` / `iE+2`) por: **`iT > iE`** (o alvo vem depois da visão executiva) **e `iC === iT + 1`** (o alvo é imediatamente anterior ao contexto tecnológico) — nas duas variantes; a cláusula de gate fechado que ele já verificava (`evidence === iE + 1`) permanece intacta, e as asserções de `[data-p52="target-lead"]` e de `TARGET.overrides` não mudam | stage `suites` · `.claude/verify/check_suites.py` · `p52layout` 45 PASS · 0 FAIL; job `visual` · `p52chromium` 55 PASS · 0 FAIL (contagens de `expected_suites.json` inalteradas — nenhum gate 5.2 nasce ou morre) | **M3 · substituto de `P52-M3`**: a mutação **permanece a mesma** — trocar de lugar as duas linhas `{ key: "target" }` / `{ key: "context" }` —, porque na ordem nova elas continuam **adjacentes** e o `find` textual do mutante segue casando byte a byte; ela mata a asserção nova pelo ramo `iC === iT + 1`. O que **é reescrito** no registro do mutante: (a) o `reason` perde a alternativa `alvo não é imediatamente posterior`, que morre junto com a asserção antiga, e fica só `/contexto \(\d+\) antes do alvo/`; (b) o `desc` deixa de falar em "empilhar depois" e passa a nomear a quebra de adjacência. Consequência declarada: a cláusula que P52-TGT1 **deixa** de cobrir (posição absoluta do alvo) não fica órfã — passa a ser coberta por `D009-ORD1`/`D009-ORD2`, cujo mutante **M1** é justamente o que P52-TGT1 não pega |
| C4 | **Domínio colorido na leitura executiva, com canal não-cromático.** Todo nome canônico de domínio no texto da narrativa carrega a identidade do domínio; a cor nunca é o único portador | `D009-DOM1` · `tests_009_leitura.js` · para cada `DOMS[i].pt` que ocorra na `.jn-narrative` (match exato, sensível a maiúsculas, palavra inteira), existe `.jn-dom[data-dom="i"]` com `textContent` idêntico ao nome; `i` conferido contra `DOMS` do runtime congelado (oráculo independente); a regra CSS de `.jn-dom` declara ao menos uma propriedade **não-cromática** (`font-weight`); `ui_journey_v32.js` não contém hex de domínio | **M4**: emitir `data-dom` com índice deslocado (`i+1`) → FAIL. **M5**: remover `font-weight` da regra `.jn-dom`, deixando só `color` → FAIL ("canal não-cromático ausente") |
| C5 | **A narrativa continua string pura (INV-7).** Colorir não injeta markup no pipeline determinístico nem altera o texto | `D009-DOM2` · `tests_009_leitura.js` · `window.__DEV.buildExecutiveNarrative(snap).paragraphs` não contém `<` nem `>`; `trace.length === paragraphs.length`; e a concatenação de `textContent` de cada `<p>` da `.jn-narrative` é **byte a byte** igual ao `paragraphs[k]` correspondente | **M6**: injetar `<span>` na string de P1 (ramo dos extremos de domínio) → FAIL |
| C6 | **Fim da repetição em prosa dos próximos passos.** O P3 aponta para a lista "Para avançar" e não a reenumera; a lista continua sendo a única enumeração | `D009-NXT1` · `tests_009_leitura.js` · com suficiência aberta e ≥1 tema: nenhuma `phrase` de `window.__DEV.evolutionThemes(snap)` — nem a forma minúscula sem ponto final que o P3 usava — ocorre em `paragraphs[2]`; a `<ul>` de `.jn-themes` tem exatamente N itens com as N frases; `paragraphs[2]` cita o rótulo canônico "Para avançar"; `trace[2].sources` **continua** contendo `evolution.themes` | **M7**: restaurar `themes.map(...).join("; ")` no P3 → FAIL (tema enumerado em prosa) |
| C7 | **Sem tema não há ponteiro; o ramo insuficiente é preservado.** A narrativa nunca aponta para uma lista que não existe | `D009-NXT2` · `tests_009_leitura.js` · (a) `evolutionThemes` vazio → não existe `.jn-themes`, `paragraphs[2]` não cita "Para avançar" e mantém a frase de sustentação/otimização; (b) suficiência fechada → `paragraphs[2]` mantém "completar e validar as evidências" (regressão de `tests_journey_m45.js` N13-N14) | **M8**: emitir o ponteiro incondicionalmente → FAIL no caso (a) |
| C8 | **Explicação de uma frase por capability declarada, na tela.** Reuso de `P52_CAP_HELP`, neutro e sem produto; sem verbete, sem texto | `D009-GLO1` · `tests_009_leitura.js` · para cada capId com `V32.TECH_LANDSCAPE[id].presence !== "UNSET"` **e** verbete em `P52_CAP_HELP`, a `.v32-decl-row` correspondente traz um `.v32-caphelp` cujo texto é **a primeira frase** do verbete canônico (transformação declarada e pública — precedente `__P52.copyMap()`); declarada sem verbete → nenhum `.v32-caphelp`; capability UNSET → nenhum `.v32-caphelp`; o texto não casa `/Forti[A-Z]/`; a contagem de `.v32-decl-row` (consumida por `p52ContextSummary`) não muda. Lista de declaradas derivada de `V32.TECH_LANDSCAPE`, nunca do DOM | **M9**: `capHelpLine()` devolver o verbete inteiro → FAIL (mais de uma frase). **M10**: emitir a frase para capability UNSET → FAIL |
| C9 | **A mesma explicação no relatório impresso** (P14: glossário acompanha o papel; a ordem do papel, não) | `D009-GLO2` · `tests_009_leitura.js` · em `#pr-landscape`, cada `.pr-card` de capability declarada com verbete traz a MESMA frase de C8; sem verbete → nada; a ordem das seções do relatório impresso permanece a pinada por `tests_p50_core.js:3692-3706` | **M11**: remover a emissão no `buildPrintReport` → FAIL |
| C10 | **UNSET não fala como NONE, e o bloco de ausência não renderiza.** Sob contexto não informado o relatório não conclui nada sobre processo/pessoas/governança | `D009-UNS1` · `tests_009_leitura.js` · landscape 100% UNSET com ≥1 prática-alvo de capability com landscape aplicável: zero `.ux-tgt-en` com a frase de NONE; existe **exatamente um** `[data-ux-absence="target-enablers"]`; seu texto declara que o contexto **não foi informado**, não contém "processo, pessoas, governança" e não afirma ausência de tecnologia; a lista que ele nomeia é subconjunto das práticas renderizadas em `.ux-tgt-ovs` no MESMO passe (B5) | **M12**: devolver a frase única antiga para o ramo UNSET → FAIL (frase de NONE sob UNSET) |
| C11 | **Contexto informado e nada se aplica mantém a frase substantiva, sem aviso** | `D009-UNS2` · `tests_009_leitura.js` · capability da prática com `presence !== "UNSET"` e sem candidatos nem serviços: a linha `.ux-tgt-en` existe com a frase de NONE; `[data-ux-absence]` **não** existe | **M13**: usar a frase de UNSET para o estado informado → FAIL |
| C12 | **Contexto parcialmente informado (B9): o aviso nomeia exatamente quem ficou de fora** | `D009-UNS3` · `tests_009_leitura.js` · com uma capability informada e outra UNSET, o aviso lista só a prática da UNSET e a prática informada mantém sua linha | **M14**: listar todas as práticas-alvo no aviso → FAIL |
| C13 · *ampliação sinalizada* | **Landscape não aplicável nunca vira "não informado".** As 5 práticas de capability com `landscapeEnabled: false` não têm o que informar | `D009-UNS4` · `tests_009_leitura.js` · prática cuja capability tem `landscapeEnabled === false` (`mandate`, `governance`, `policies`, `team-capacity`, `training`) nunca aparece no aviso único, em nenhum estado de landscape; conferido contra `V32.CAPABILITIES` | **M15**: incluir capability sem landscape na lista do aviso → FAIL |
| C14 | **O aviso é único, acionável e nomeia o que ficou de fora** (verbete *Bloco de ausência*) | `D009-ABS1` · `tests_009_leitura.js` · exatamente 1 nó de aviso por render e o mesmo censo após dois renders consecutivos (idempotência); na TELA há caminho explícito para o editor de contexto; no PAPEL a mesma frase sem controle; o texto nomeia a contagem **e** a lista | **M16**: emitir o aviso sem a lista → FAIL |
| C15 | **A nota da jornada sai da régua de 78ch** — e só ela | `D009-LEG1` · `tests_009_leitura.js` · extraindo de `ui_p52_workspace_v32.css` os seletores cuja declaração traz `max-width` em `ch`, nenhum casa (`Element.matches`) o nó real `.p52-sec .jn-note`; um `.ux-micro` irmão dentro de `.p52-sec` continua casando ≥1; `.jn-note` mantém a classe `ux-micro`; a alteração permanece dentro do `@media screen` da camada | **M17**: devolver `.jn-note` à lista de seletores da régua → FAIL |
| C16 | **A base de evidência muda de posição, não de comportamento** (P13) | `D009-EVB1` · `tests_009_leitura.js` · gate ABERTO: `#p52-evbase` é `<details>` **sem** `open`, filho de `#p52-sec-actions`, e `actions` é a última seção da ordem nova; gate FECHADO: `#p52-evbase` não existe e `#p50-suff` está em `#p52-sec-evidence`, 2ª seção | **M18**: nascer com `open` → FAIL. **M19**: anexar o `evbase` a `exec` → FAIL |
| C17 | **Regressão congelada e identidade do derivado** | stages `suites` + `suites-heavy` (contagens de `expected_suites.json`, com a suíte nova registrada no mesmo PR), `build` (rebuild byte-idêntico), `m41` (payload == pin declarado), `baseline` (repin coerente), `boundary` (nenhum protegido tocado), `lint-arch`; job `visual` | — (oráculos independentes já existentes; qualquer toque no engine faria `m41` falhar, e isso é PARADA por Porta B) |

Gate sem mutante previsto não está pronto: C3 e C17 apoiam-se em oráculos
independentes já existentes e por isso não recebem mutante próprio — C3 herda o
`P52-M3` reescrito.

## Comportamento especificado

### 1 · Tela de resultados — ordem (itens 7 e 9)

Entrada: `p52OrderFor(gate)` sobre os baldes de `p52Classify`.
Saída: a variante aberta ou fechada da âncora. Nada mais muda no roteamento de
nós: `#v32panel` continua no balde `context`, `#p50-suff` no `evidence`,
`#p50-results` no `detail` (refinement, "Item 7").

**Onde o alvo cai em cada variante** (cláusula reancorada — ver "Troca de âncora"):
com o gate **ABERTO** o cenário-alvo é a **5ª** seção renderizada e o contexto
tecnológico a 6ª; com o gate **FECHADO** o alvo é a **6ª** e o contexto a 7ª,
porque "Evidência e suficiência" se interpõe na 2ª posição. Em ambas, a única
cláusula dura sobre o alvo é a adjacência: `context` vem imediatamente depois de
`target`, e `target` vem depois de `exec`. A posição absoluta deixa de ser
cláusula de P52-TGT1 e passa a ser garantida pela sequência completa (C1/C2).

- **Suficiência FECHADA (B2)**: evidência sobe para a 2ª posição; o ponteiro
  "Ver o que falta para liberar o resultado" continua existindo só nesse estado;
  score segue `n/d`, nunca zero.
- **Seção sem conteúdo (B3, B4)**: não renderiza; a subsequência das presentes
  continua estrita. "Prioridades do negócio" vazia simplesmente some — e a
  leitura executiva continua sendo o único lugar que diz "Nenhuma prioridade
  específica foi declarada".
- **Tier T3 / evidência positiva (B14)**: vive em `#p50-results` → seção 3; a
  ordem nova a mantém antes dos gaps e longe de "Relatório e sessão".

#### Inventário completo do que depende da ordem — levantado nesta spec

Varredura de `indexOfSec`/`sectionKeys` em `tests_p52_layout.js`, das constantes
de `tests_p52_chromium.js`, das fixtures `P52_F1..F5` e das ferramentas de
evidência. **Um único gate dependia da posição ABSOLUTA do alvo**; todo o resto
depende da sequência completa, do índice da evidência ou da paridade trilho×fluxo
— e é resolvido pela reancoragem das cinco constantes (C3).

| Consumidor | Do que depende | Efeito da ordem nova |
|---|---|---|
| `P52-TGT1` (`tests_p52_layout.js:229-241`) | **posição absoluta do alvo** (`iT === iE+1` / `iE+2`) | **Único** que quebra. Reancorado em C3 |
| `P52-LAY3` (`:119-147`, via `expectedOrder`) | sequência completa | Verde com as constantes reancoradas |
| `P52-GATE1` (`:590-604`) | `evidence` no índice 1 + paridade trilho×fluxo | Inalterado — a exceção é preservada |
| `P52-SUFF1` (`:691-712`) | `evidence` no índice 1 (fechado) / ausente (aberto) | Inalterado |
| `P52-NAV0` (`:560-588`) | paridade item-a-item trilho×fluxo, ids estáveis | Inalterado — os ids de seção não mudam, só a ordem |
| `P52-LAY5` (`:174-206`) | `sectionKeys().join(",")` no censo de idempotência | Verde: compara o render consigo mesmo, não com lista fixa |
| `P52-LAY3` chromium (`tests_p52_chromium.js:239`, `CANON`) | sequência completa + ordem geométrica top-a-top | Reancorado em C3 |
| `P52-GATE1v` chromium (`:298`, `BLOCKED`) | sequência da variante fechada + `evTop` no primeiro viewport | Reancorado em C3; a evidência continua 2ª, logo a medida de viewport não muda |
| `P52-PR1` / `P52-PDF*` chromium | relatório impresso, montado por `buildPrintReport` | **Independentes** da ordem de tela (P14) |
| `P52-DOC1` (`tests_p52_layout.js:1141`) | temas obrigatórios no `USER_GUIDE.md`, por regex | Não depende da ordem, mas **depende do texto**: a reescrita de §8.1 precisa preservar os temas ("navegação da tela de resultados", "Base de evidência", "cenário-alvo") |
| `fixtures_p52.js` `P52_F1..F5` | nada de ordem — só vetor, prioridades, alvos e `presence` | Nenhum efeito funcional |
| `fixtures_p52.js:16-22` (comentário de `P52-F1`) | enumera a ordem **antiga** em prosa e diz "todas as nove seções" | Comentário a atualizar. Deriva **pré-existente** (desde SUFF-REV-A são 8 com gate aberto), agravada aqui; não é gate |
| `fixtures_p52.js:34-38` (comentário de `P52-F2`) | "Target continua antes de Contexto" | Continua verdadeiro; nada a fazer |
| `tools_p52_shots.js:123,153,236` | `scrollTo("#p52-sec-support"/"#p52-sec-detail")` | Ids estáveis: o script continua funcionando. Muda o **enquadramento** das capturas — a evidência visual da Fase 6 é remedida, não comparada com a antiga |

### 2 · Leitura executiva — cor por domínio (item 3a)

Entrada: `narrativeHTML(snap, forPrint)` — o parágrafo já escapado.
Saída: cada ocorrência **exata, sensível a maiúsculas e de palavra inteira** de
`DOMS[i].pt` ("Negócio", "Pessoas", "Processos", "Tecnologia", "Serviços") vira
`<span class="jn-dom" data-dom="i">…</span>`. A sensibilidade a maiúsculas é
material: "serviços" e "tecnológico" em minúscula aparecem no mesmo texto com
outro sentido e **não** podem ser marcados.

- A marcação acontece no **renderizador** (`ui_journey_v32.js`), nunca em
  `buildExecutiveNarrative` — `paragraphs` e `trace` permanecem strings puras
  (INV-7). O `textContent` do parágrafo é idêntico ao de antes da marcação.
- Cor por `[data-dom] → --dom-accent` (mapa único de `ui_ux_v32.css:68-72`);
  **nenhum hex em JavaScript** (precedente do owner de layout,
  `tests_p52_layout.js:676`).
- Canal não-cromático obrigatório: `font-weight` na regra `.jn-dom`. Como
  `narrativeHTML` serve tela **e** papel, a marcação chega ao PDF pela mesma
  função; no papel a cor é dispensável e o peso sozinho preserva o significado.

### 3 · Leitura executiva — próximos passos (item 3b)

Entrada: `evolutionThemes(snap)`.
Saída: a `<ul>` "Para avançar" continua sendo a **única** enumeração. O P3 passa
a apontar para ela:

- `themes.length > 0` e suficiência aberta → o P3 declara que os próximos passos
  estão em "Para avançar", **sem** reenumerar; `trace[2].sources` continua com
  `evolution.themes` (a frase existe porque os temas existem — a rastreabilidade
  não pode sumir junto com a enumeração).
- `themes.length > 0` e suficiência fechada → o P3 mantém "completar e validar as
  evidências pendentes" e o ponteiro entra como "em paralelo".
- `themes.length === 0` → não há `.jn-themes` e **não há ponteiro**; vale a frase
  de sustentação/otimização já existente.
- Nenhuma terceira lista é criada, em nenhuma superfície.

### 4 · Contexto tecnológico — glossário no resultado (item 5)

Entrada: `V32.TECH_LANDSCAPE` (quem foi declarado) × `P52_CAP_HELP` (quem tem
verbete).
Saída: **uma frase** por capability declarada, na tela (`#v32decl`) e no papel
(`#pr-landscape`).

- A frase é o **primeiro período** do verbete canônico (prefixo até o primeiro
  `. `, ponto incluído). Os outros dois períodos são instrução ao facilitador e
  ressalva de método — pertencem ao editor, não ao relatório.
- `presence === "UNSET"` → nada. Capability sem verbete (B13) → nada; nada é
  inventado, regra já escrita em `ui_p52_workspace_v32.js:201-202`.
- O texto é neutro e sem produto por construção (o verbete já é); o gate verifica
  assim mesmo.
- O popover do editor não é tocado.

### 5 · Card de prática-alvo — quatro estados (defeito de `ui_target_v32.js:166`)

`tgtEnablersHTML(qid)` hoje cobre com **uma** frase estados que não são o mesmo.
`validateConfigV32` garante que um `qid` pertence a no máximo uma capability, e
os 15 `qid` do assessment estão cobertos — logo o estado é sempre determinado:

| Estado | Condição | Saída |
|---|---|---|
| **S1 · habilitadores** | `items.length > 0` | linha atual, inalterada |
| **S2 · não informado** | `items` vazio · capability com `landscapeEnabled: true` · `TECH_LANDSCAPE[cap].presence === "UNSET"` | **bloco de ausência**: a linha por prática NÃO renderiza; a prática entra no aviso único |
| **S3 · informado, nada se aplica** | `items` vazio · `presence !== "UNSET"` | mantém a frase de hoje ("Nenhum habilitador tecnológico específico foi identificado pelo contexto atual…") — que a partir daqui cobre **só** este estado |
| **S4 · landscape não se aplica** | `items` vazio · capability com `landscapeEnabled: false` (`mandate`, `governance`, `policies`, `team-capacity`, `training`) | mantém a frase de S3 e **nunca** entra no aviso — não há contexto a informar para esta prática |

- **Aviso único (S2)**: um nó por render, dentro do card de comparação, antes da
  lista de práticas-alvo, declarando (a) que o contexto tecnológico não foi
  informado nesta sessão, (b) **quantas** e **quais** práticas-alvo ficaram sem
  refino, (c) o caminho para informar — na tela, o controle canônico "Editar
  contexto tecnológico"; no papel, a mesma frase sem controle. Nunca afirma
  ausência de tecnologia e nunca conclui sobre processo, pessoas ou governança.
- **NA / "a validar" (B10)**: não altera este eixo — o estado é decidido por
  `presence`. Nenhum produto é exibido, e a prática com baseline não validado
  segue com "Baseline atual não validado — delta local n/d".
- **B4/B5**: sem cenário-alvo não há seção e não há aviso; a lista do aviso é
  derivada no MESMO passe que a lista de práticas, então não sobra órfã quando
  `revalidateTargets` remove um alvo.
- **Superfícies**: tela (`ui_target_v32.js:134`) e papel (`:267`) recebem o mesmo
  tratamento, com o mesmo texto.
- **Fronteira com a 010**: a 009 **não** decide a fonte do habilitador, não lê o
  `MAP` congelado e não cria aviso global no topo do relatório. O aviso desta
  spec é local ao card e nasce do defeito da linha 166.

### 6 · Nota da jornada — régua de leitura (item 2)

`JOURNEY_NEXT_NOTE` (+ `JOURNEY_TGT_NOTE` quando há alvo) é **legenda de card
full-bleed**, não corpo de texto: `.jn-note` sai da régua de 78ch
(`ui_p52_workspace_v32.css:51-54`), e **apenas ela** — `.p52-sec p`,
`.p52-sec .arq-tag`, `.p52-sec .banner-ok` e o restante de `.ux-micro` continuam
sob o teto. Forma de implementação exigida por testabilidade: a nota sai da
**lista de seletores** da regra; um override posterior (`max-width: none`)
deixaria duas declarações contraditórias vivas e cegaria o oráculo. A régua vive
em `@media screen` — nada disso alcança o papel.

### 7 · Base de evidência da sessão (item 9)

Nenhuma mudança de comportamento: continua `<details>` sem `open`, continua
existindo só com o gate ABERTO, continua anexada à última seção. O que muda é a
**posição da seção** pela ordem nova. Registro obrigatório de **B15**: o
`beforeprint` da Camada 1 congelada expande todos os `<details>`
(`quickscan_secops_soccmm_v3_1_3.html:1065`) — "colapsado" é decisão de tela e
**não protege o PDF**. A decisão selada SUFF-REV-A §9 não é reaberta.

### Casos de borda do refinamento — onde cada um é tratado

| Caso | Tratamento nesta spec |
|---|---|
| B1 UNSET × NONE | §5 (S2 × S3) · C10, C11 |
| B2 suficiência fechada | §1 · C2, C16 |
| B3 sem prioridades | §1 (seção vazia não renderiza) · C1 |
| B4 sem cenário-alvo | §5 · C10 (sem seção, sem aviso) |
| B5 target == current | §5 (lista do aviso derivada no mesmo passe) · C10 |
| B6 alvo no mesmo estágio | §1 — a frase continua no P3, no mesmo bloco do gráfico |
| B7/B8 zero gaps com/sem suficiência | Fora do escopo: o aviso da 009 conta **práticas-alvo sem refino**, não capabilities com gap. O aviso global por gap sob UNSET é da 010 |
| B9 contexto parcial | §5 · C12 |
| B10 resposta NA | §5 · C10/C11 (o eixo é `presence`, não a maturidade) |
| B11 gap moderado | Fora do escopo (é decisão de FONTE de habilitador — 010) |
| B12 mais de 9 findings | Fora do escopo (011) |
| B13 capability sem verbete | §4 · C8 |
| B14 tier T3 | §1 · C1 |
| B15 impressão expande `<details>` | §7 — registrado como decisão, sem gate próprio (comportamento de superfície congelada) |

## Contratos

**Nenhum módulo novo**: R9 §1 (IIFE) e §7 (orçamento de ~600 linhas) não são
acionados. **Nenhum bridge novo**: `.claude/verify/bridges.json` não muda —
`__P52` (owner `ui_p52_workspace_v32.js`, já registrado) ganha **um método**.

| Contrato | Shape | Owner do estado (R9 §5) | Consumidores |
|---|---|---|---|
| `window.__P52.capHelpLine(capId)` | `string` — primeiro período do verbete de `P52_CAP_HELP`, ou `""` quando não há verbete. Sem efeito colateral, sem DOM | `ui_p52_workspace_v32.js` — `P52_CAP_HELP` continua sendo a **única** fonte do texto, e o identificador tem de permanecer nesse arquivo (`tests_p52_layout.js:678` o usa como âncora de varredura) | `ui_v32.js`, em `renderBlocks` (tela) e `buildPrintReport` (papel), sempre com guarda `typeof` e silêncio na ausência |
| `.jn-dom[data-dom="i"]` | atributo publicado no DOM; `i` é índice em `DOMS` | `ui_journey_v32.js` (renderizador da narrativa) | CSS de `ui_ux_v32.css` e o gate `D009-DOM1` |
| `[data-ux-absence="target-enablers"]` | nó único por render, com contagem e lista | `ui_target_v32.js` | gates `D009-UNS*`/`D009-ABS1`; a 010 herda este nó ao mexer em `tgtEnablersHTML` |

**Acoplamento declarado — direção da dependência.** `ui_v32.js` (Camada 3) passa
a consumir um bridge publicado por camada posterior. O precedente exato já existe
e é o do próprio relatório impresso: `ui_v32.js:1160-1162` consome
`__uxJourneyPrintHTML` / `__uxRefinementPrintHTML` / `__uxTargetPrintHTML`,
publicados pelas camadas 4.x, sempre sob guarda `typeof`. A chamada é de runtime
— a ordem de injeção do builder não muda e não precisa mudar.

**Restrição de forma no literal `P52_SECTIONS`.** A campanha de mutação ancora em
**texto literal**: o `find` de `P52-M3` casa as duas linhas de `target` e `context`
byte a byte, com o alinhamento de colunas do arquivo. Ao reordenar o array, o
alinhamento das linhas de `{ key: … , title: … }` deve ser preservado — reformatá-lo
faz o mutante deixar de aplicar e o gate perder o mutante sem que ninguém veja
(o `check_mutation.py` reporta o mutante não aplicado, mas o custo é uma rodada).

**Acoplamento declarado — 009 × 010.** O patch de `tgtEnablersHTML` desta demanda
vive na **mesma função** que a 010 altera para os itens 4 e 8. A 010 nasce depois
da 009 mergeada em `develop`, ou herda explicitamente este patch: os quatro
estados de §5, o nó `[data-ux-absence]` e os gates `D009-UNS1..4`/`D009-ABS1` são
o piso que a 010 não pode apagar sem substituir por gate equivalente.

**Identidade de artefatos.** Todos os arquivos abaixo são **pinados**: mudança
exige `gen_pins.py` no MESMO PR, com motivo no commit (R8 §1, classe `registry`).

| Arquivo | Natureza da mudança |
|---|---|
| `ui_p52_workspace_v32.js` | ordem canônica + método no bridge |
| `ui_p52_workspace_v32.css` | `.jn-note` fora da régua de 78ch |
| `ui_journey_v32.js` | ponteiro no P3 + marcação de domínio no renderizador |
| `ui_ux_v32.css` | regra `.jn-dom` (cor + peso) |
| `ui_target_v32.js` | quatro estados + aviso único (tela e papel) |
| `ui_v32.js` | frase de glossário em `#v32decl` e `#pr-landscape` |
| `quickscan_secops_soccmm_v3_2_dev.html` | classe `generated` — **só** por rebuild do builder; stage `build` prova a identidade |
| `tests_p52_layout.js`, `tests_p52_chromium.js` | reancoragem dos oráculos de ordem nesta spec (C3) |
| `tests_p52_mutants.js` | `P52-M3` reescrito para a ordem nova |
| `tests_009_leitura.js`, `tests_009_mutants.js` | arquivos novos — pin obrigatório (arquivo novo sem pin = FAIL no `baseline`) |
| `.claude/verify/expected_suites.json` | registro da suíte nova, no mesmo PR (R10 §3) |
| `.claude/verify/mutation_map.json` | harness `d009` com alvos e `requires` |
| `USER_GUIDE.md` | §8.1 lista a ordem de leitura antiga (linhas 274-284) — sai junto, ou a demanda entrega divergência doc×código |

Pin declarativo `declared.m41_payload_sha256` **não muda**. Se mudar, a demanda
PARA: virou Porta B, que esta spec não autoriza.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.**
  **INV-7** (a mais tangenciada): a narrativa continua determinística e pura — a
  cor entra no renderizador, nunca em `buildExecutiveNarrative`; o `trace` mantém
  `evolution.themes` mesmo sem a enumeração em prosa (C5, C6).
  **INV-2**: o defeito corrigido é exatamente uma conflação UNSET/NONE na
  superfície de leitura (C10, C11) — a spec a desfaz em quatro estados.
  **INV-3**: a exceção de gate fechado é preservada e virou critério (C2); nenhum
  limiar, contagem ou veredito nasce fora do owner de suficiência.
  **INV-5**: nada aqui deriva alvo de produto — a 009 não toca a fonte do
  habilitador. **INV-8**: nada novo é serializado; ordem, frase de glossário e
  aviso são recomputados a cada render. **INV-10**: PT-BR nos docs; nomes de
  código, ids e enums exatamente como no source (*Habilitador* é termo de doc; as
  strings congeladas da UI permanecem). **INV-1/INV-9**: nenhum arquivo `frozen`
  é tocado; `m41` e `boundary` provam.
- [x] **design-decisions.md — nenhum conflito.** A assimetria
  `setTarget`/`revalidateTargets` continua candidata pendente e **não** é
  reapresentada como defeito (R13); a spec apenas se protege dela em B5. A
  decisão "fases 5.0–5.2 seladas sob o processo antigo" é o que torna a §8 uma
  cláusula selada — e é por isso que substituí-la exigiu ratificação do
  proprietário, e não uma decisão de desenho do `tech-lead`.
- [x] **Specs validadas anteriores — contradição encontrada e RESOLVIDA por troca
  de âncora ratificada.** A ordem aprovada em P8 contradizia a **§8** da diretriz
  da Phase 5.2 ("cenário-alvo imediatamente depois da visão executiva"),
  implementada em `P52-TGT1`. O proprietário ratificou a rota A em 2026-08-27, no
  chat: a §8 é substituída por esta spec como âncora e P52-TGT1 é reancorado (C3).
  Registro completo em "Troca de âncora — registro da ratificação". Nenhuma outra
  contradição:
  `P52-RES2 §7` é substituída pela âncora desta spec, que é o rito previsto;
  `SUFF-REV-A §9` não é reaberta (P13); `§UAT-07`/`QIDS_AUTORIZADOS`
  (`tests_p50_core.js:3179`) **não é tocada** — governa a tabela curada
  `QS_GAP_SUPPORT` do relatório impresso, que esta demanda não amplia;
  `P52-REC1` (`tests_p52_layout.js:526`) segue verde — nenhum nome de produto
  entra no owner de layout, e o verbete de `P52_CAP_HELP` é neutro por
  construção; a ordem das seções do relatório impresso
  (`tests_p50_core.js:3692-3706`) permanece byte a byte.
- [x] **Boundary (R6) — nada `frozen` tocado.** `engine_v32.js` e
  `quickscan_secops_soccmm_v3_1_3.html` são apenas **lidos**; o `.why` sempre
  visível do `apoioBlock` congelado não é suprimido (P7). `generated`
  (`quickscan_secops_soccmm_v3_2_dev.html`) muda só por rebuild. `registry`
  (`pins.json`) só por `gen_pins.py`, no mesmo PR. **Nenhuma PARADA por
  boundary** — a única substituição desta spec é normativa (a §8, já ratificada
  em 2026-08-27), não de classe de proteção. Nenhum rito de Porta A/B é aberto.

## Fora de escopo

Herdado integralmente do refinamento ("Fora de escopo (explícito)", 10 itens) —
com destaque para: nenhuma alteração no `engine_v32.js` ou na Camada 1; nenhum
número de score, suficiência, limiar, tier ou alvo; nenhuma recomendação a partir
de ausência não declarada; FortiNAC e o vínculo FortiSIEM↔`network-visibility`;
itens 4, 6 e 8 (demanda 010); item 1 (demanda 011); editor de contexto;
reordenação do relatório impresso; mudança de invariante.

Acrescentado por esta spec:

- **Fonte do habilitador.** A 009 não lê o `MAP` congelado, não soma candidatos e
  não altera o que o card publica quando **há** habilitador (S1 intocado).
- **Aviso global no topo do relatório.** O aviso desta spec é local ao card de
  prática-alvo e conta práticas-alvo sem refino. O aviso global por *capability
  com gap sob UNSET* (item 4 · rota R4) é da 010.
- **O que o card publica sob gate FECHADO.** O refinamento (B2) afirma que sob
  gate fechado nenhum habilitador deveria ser publicado; o código publica quando
  há serviço ou candidato contextual (`engine_v32.js:653-664`, laço de `SERVICES`
  dependente só de `hasGap`). É achado real, **fora** desta demanda — é decisão
  sobre a fonte, que a 010 detém. A 009 não altera esse comportamento.
- **Numeração visível das seções.** `data-p52-order` e o número impresso no
  título usam o índice na ordem **completa**, não a posição entre as seções
  renderizadas — com qualquer seção ausente o leitor vê um buraco na contagem
  (hoje 1,2,3,5,6,…; com a ordem nova, buraco no 8). Achado adjacente, sem gate
  hoje; reportado ao `product-owner`, não corrigido de passagem (R13).
- **Distinguir S3 de S4 por texto próprio.** A spec mantém a mesma frase para os
  dois estados; separá-los é ampliação que precisa nascer no refinamento.
- **Nenhuma suíte Chromium nova.** Todos os gates `D009-*` são jsdom; a
  confirmação geométrica de C15 fica com o rito visual do proprietário e com a
  evidência da Fase 6.

---

ARQUIVOS_TOCADOS: specs/009-leitura-do-relatorio/spec.md (criado — único artefato desta fase)
RESUMO: Spec da Fase 1 pelo template, referenciando o refinamento aprovado. Declara a ordem canônica nova como âncora normativa (variantes de gate aberto e fechado) para que o oráculo nasça da spec, nunca do módulo. 17 critérios viram gates `D009-*` numa suíte nova (`tests_009_leitura.js`), cada um com mutante previsto e campanha própria (`tests_009_mutants.js`). Contratos: método novo no bridge `__P52` já registrado (sem bridge novo), `.jn-dom[data-dom]` e `[data-ux-absence]` com owner nomeado; acoplamentos 009×010 e Camada 3→5.2 declarados. Troca de âncora **consumada**: o proprietário ratificou a rota A no chat em 2026-08-27 (opção "5º — trocar a regra selada"); a §8 da diretriz da Phase 5.2 é substituída por esta spec, C1 e C2 estão destravados e `P52-TGT1` é reancorado em "alvo depois da visão executiva **e** imediatamente antes do contexto".
EVIDÊNCIA: nenhum gate executado — Fase 1 não executa suíte, e `node_modules` não está instalado nesta worktree (a sondagem de jsdom falhou com MODULE_NOT_FOUND; por isso o oráculo de C15 foi desenhado sobre `Element.matches`, que não depende de cascata de CSS em jsdom). Varredura de dependência de ordem (item 5 do pedido do orquestrador): `grep -n "indexOfSec\|sectionKeys" tests_p52_layout.js` → 11 ocorrências, das quais **só** `P52-TGT1` (`:229-241`) depende da posição absoluta do alvo; `P52-LAY3`, `P52-GATE1`, `P52-SUFF1`, `P52-NAV0` e `P52-LAY5` dependem de sequência completa, do índice da evidência ou de paridade trilho×fluxo. Constantes em `tests_p52_chromium.js:239` (`CANON`) e `:298` (`BLOCKED`). Fixtures `P52_F1..F5` (`fixtures_p52.js:23-108`) não codificam ordem alguma — só comentários de prosa (`:16-22` desatualizado, `:34-38` ainda verdadeiro). `tools_p52_shots.js:123,153,236` usa ids de seção, que não mudam. Demais leituras: refinement.md (íntegra), template spec.md, R1/R3/R5/R6/R9/R10/R13, CONTEXT.md (verbetes 64-95), boundary.json, bridges.json, pins.json, expected_suites.json, mutation_map.json, pipeline.yaml, known_issues.json, USER_GUIDE.md:270-290, docs_phase5/PHASE_5_2_DESKTOP_WORKSPACE_REPORT.md:70-130, specs/003-marcador-duplicado/spec.md e o source de ui_p52_workspace_v32.js, ui_journey_v32.js, ui_ux_v32.js/css, ui_target_v32.js, ui_v32.js, engine_v32.js, tests_p52_layout.js, tests_p52_chromium.js, tests_p52_mutants.js, tests_journey_m45.js, tests_p50_core.js.
DEPENDÊNCIAS: (1) `product-owner` — decidir sobre o buraco na numeração visível das seções e sobre distinguir S3 de S4 por texto próprio (ambos fora do escopo até refinamento). (2) `qa-engineer` — escreve `tests_009_leitura.js`/`tests_009_mutants.js` com as duas fixtures novas (S3 e B9), reancora as cinco constantes de ordem e a asserção de `P52-TGT1`, reescreve o registro de `P52-M3`, prova e commita o red antes de qualquer implementação e registra a suíte em `expected_suites.json` no mesmo PR. (3) `ui-engineer` — dono natural dos 6 módulos tocados (delegações separadas, um módulo por vez); preservar o alinhamento do literal `P52_SECTIONS` ao reordenar. (4) `build-engineer` — rebuild do HTML gerado e `gen_pins.py` no mesmo PR. (5) `doc-writer` — §8.1 do USER_GUIDE.md (mantendo os temas que `P52-DOC1` exige) e o comentário de `fixtures_p52.js:16-22`. (6) demanda 010 herda o patch de `tgtEnablersHTML` e os gates `D009-UNS*`. (7) Nota de trilha: esta execução rodou em Opus, não no modelo pinado (`fable`), por indisponibilidade de créditos.
