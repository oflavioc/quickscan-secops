# Relatório final — 009-leitura-do-relatorio

> Fase 6 · dono: `doc-writer` · **escrito retroativamente em 2026-09-01**, sobre
> trabalho de 2026-08-27–30. **Este documento não decide PASS/FAIL** — quem
> decidiu foi o gate citado em cada linha, e o dono de cada execução está
> nomeado. Todo número aqui vem de execução citável ou de registro canônico; o
> que não foi executado (por mim, agora) está declarado como tal — nada é
> remedido nesta escrita (R2 §1, §4).

## Por que este relatório nasce depois do merge

A demanda foi **mesclada em `develop` pelo PR #24** (commit de merge `4092463`,
2026-08-30T07:49Z, sob a delegação do proprietário de 2026-08-29) com o
planning-state em `phase: validate`, `validate.status: awaiting_approval` —
**sem** este artefato. O orquestrador mesclou sem fechar a Fase 6.

É o mesmo padrão da demanda **013**: mesclada (PR #29) com a Fase 6
incompleta, fechada depois por aceite retroativo do `product-owner`
("não encontrei objeção", commit `2898030`, 2026-09-01), com a fase mantida em
`validate` de propósito porque falta o `spec-validate.md` dela — caso
**diferente** do da 009, tratado à parte e **não mexido aqui**.

O orquestrador citou, para este mesmo padrão, o id **`EA-33`**, dizendo que já
está alocado numa branch da demanda 014 (PR #36) ainda não mesclada. **Conferido
nesta escrita e não encontrado**: nem heading `## EA-33` nem reserva em prosa
aparecem em `origin/feature/014-gate-sem-poder-discriminante` (`5cf7c82`, único
PR aberto no momento desta escrita, `gh pr list --state open`), nem em
`develop` (que para em `EA-31`, PR #34 mesclado), nem em nenhum arquivo desta
árvore. Registro o fato como é: **não posso confirmar `EA-33` como já
gravado** — pode ainda não ter sido commitado, ou viver em local que esta
leitura não alcançou. Não decido pela existência do id (não é meu ofício
arbitrar `EA-*` de outra sessão); devolvo a discrepância em DEPENDÊNCIAS. O
fecho da 009 abaixo não depende dele.

## Objetivo cumprido

Entregou os itens **2, 3, 5, 7 e 9** dos nove do feedback do cliente
(2026-08-27), mais a **regra de bloco de ausência** como regra de produto
(verbete em `CONTEXT.md`) e o **defeito de `ui_target_v32.js:166`**
(conflação UNSET/NONE na superfície de leitura). Itens 4, 6 e 8 foram para a
010; o item 1, para a 011 — divisão decidida no portão da Fase 0 (P1) e já
consumida pelas duas demandas seguintes.

Cinco superfícies mudaram, um dono por arquivo:

| Item | O que mudou | Onde |
|---|---|---|
| 7 · ordem | 9 seções em ordem narrativa (variantes de gate aberto/fechado), com `P52-TGT1` reancorado em `iT > iE` **e** `iC === iT+1` | `ui_p52_workspace_v32.js` |
| 3a · cor | domínio da leitura executiva marcado por `[data-dom]` + canal não-cromático (`font-weight`) | `ui_journey_v32.js` + `ui_ux_v32.css` |
| 3b · próximos passos | P3 aponta para "Para avançar" em vez de reenumerar os temas em prosa | `ui_journey_v32.js` |
| 2 · legenda | `.jn-note` sai da régua de 78ch, sozinha | `ui_p52_workspace_v32.css` |
| defeito 166 | 4 estados (S1 habilitadores · S2 não informado · S3 informado sem aderência · S4 landscape não aplicável) + bloco de ausência `[data-ux-absence="target-enablers"]` | `ui_target_v32.js` |
| 5 · glossário | uma frase por capability declarada, na tela e no papel, via `capHelpLine` novo no bridge `__P52` | `ui_v32.js` |
| 9 | nenhuma mudança de comportamento — decisão registrada de **manter** o disclosure como está (P13) | — |

**Cinco ratificações nominais do proprietário**, todas registradas na
`spec.md` com quem ratificou, quando e a frase literal: troca de âncora
(substitui a §8 da diretriz da 5.2, 2026-08-27, "5º — trocar a regra selada"),
ampliação C13 (2026-08-27, "Aprova a spec com C13"), autorização nominal
§29.4 (2026-08-28, "Autorizo nominalmente a edição dos quatro arquivos para a
009"), errata de fidelidade (2026-08-28, "Autorizo, peça a errata") e o
rótulo derivado aceito como não medido (2026-08-28, "Aceita como não medido e
abre o PR").

Nenhum arquivo `frozen` foi tocado: `engine_v32.js` e a Camada 1 apenas
lidos; `declared.m41_payload_sha256` (`9794b267…`) permaneceu inalterado em
todos os rebuilds — Porta B nunca se abriu.

## Cadeia da demanda

| Fase/passo | Commits | Registro |
|---|---|---|
| 0 Refinamento | `f256bb0` | Portão: "Sigo as recomendações" (2026-08-27) |
| 1 Spec | `f256bb0`…`3a1960f` | Portão: "Aprova a spec com C13" |
| 2 Plano | `feef28c`, `870969b` | Portão: "Aprovo" |
| 3 Tarefas | `b41625a`, `c6092e2` | Portão: "Aprovo" — 23 tarefas, 9 waves |
| 4 Red | `3950288` (T007) | **15 gates `D009-*` + oráculos 5.2 reancorados**, commitado antes da implementação |
| 5 Implementação | `8cef8c2` `30c730e` `a466ac3` `37e099f` `bc10b96` `4f92b36` | T008–T013, um módulo por delegação (todos `ui-engineer`) |
| 5 Docs | `cc58c41` `133e91e` `fc89e60` | `USER_GUIDE.md` §8.1, comentário de `fixtures_p52.js`, **README corrigido** (três afirmações falsas que a 009 introduziu, achado do próprio `doc-writer`, deriva-em-doc-irmã) |
| 5 Rebuild | `5ad2211` (T016) | `build_v32_html.py` — pré-condição do verde |
| 6 Verde + campanha (rodada 1) | `b9c8a5b` | `d009` fixada em 15/0; campanha `d009` 18 KILL/18 |
| 6 Correção do contraste (achado da 5.2 acumulada) | `caf59c7` `a981885` `9f8b425` | Auditoria de acessibilidade reprovou `.jn-dom` (contraste 4,21:1 contra o AA 4,5:1); corrigido com `--dom-accent-text` por `color-mix`; `D009-M5` reancorado no literal novo — o discriminante não mudou |
| 6 Aceite de intenção — achado do PO | `e77b7b5` (fix), `d48b906` (red endurecido antes), `6670dc3` (reancora M16), `7882ae9` (matriz final, 19 KILL/19) | Achado: `tgtAbsenceHTML` afirmava escopo de SESSÃO mesmo no caso PARCIAL — contradizia a própria seção de contexto, que lista as declaradas logo abaixo. Corrigido com ramo de escopo; rótulo do botão passou a vir de `#v32cta` (aceito como não medido) |
| 6 Fecho declarado (então) | `8f69250` (repin final), `284673b` (repin pós-iteração), `d3c3ec1` (planning-state → validate, `pr_url`) | **Faltou o `relatorio-final.md`** — é o que esta escrita supre |
| Integração com demandas vizinhas | 3 merges de `develop` (`f0aa031`/`f20a073`, `e45ce65`/`ad76fa7`, `6c44d0d`/`0422a8b`, `4f9ff35`/`233a31d`) + `0d4a329` (preflight `d009` exigido pela 013, achado do `build-engineer` corrigido no mesmo commit: dois nomes de interpretador Python para o mesmo `requires`) | Cada merge com repin próprio, no mesmo PR (R8 §1) |
| Merge | `4092463` (PR #24, 2026-08-30T07:49Z) | "CI verde nos dois jobs" — conferido abaixo, não presumido |

## Números — o que cada gate emitiu, e quem executou

| Medição | Resultado | Onde vive / quem executou |
|---|---|---|
| `d009` (`tests_009_leitura.js`) | **15 PASS · 0 FAIL de 15**, fixada por execução em T017 (`qa-engineer`, 2026-08-28) | `.claude/verify/expected_suites.json → suites.d009` |
| `p52layout` | **45 PASS · 0 FAIL de 45** — censo de ids idêntico ao de `HEAD`, nenhum gate nasce ou morre; só `P52-TGT1` consome as constantes reancoradas | `expected_suites.json → suites.p52layout`, conferido nesta escrita |
| `p50core` | **64 PASS · 0 FAIL de 64** — inclui os quatro gates do mapa `PROTECTED` repinados pela autorização §29.4 (`P50-GOV1`, `P50-SUF0`, `P50-SUF8`, `P50-IC4`) | `expected_suites.json → suites.p50core`, conferido nesta escrita |
| Campanha `d009` | **19 KILL de 19** (`D009-M1, M2, M4…M20` — `M3` da spec permanece `P52-M3`, no harness `p52`) | `.claude/verify/mutation-matrix.json → pares`, conferido nesta escrita: todos os 19 pares com `ultima_prova.resultado` iniciando por `KILL` |
| Campanha `core` | **3 KILL de 3** | T019 (`qa-engineer`) |
| Red | **15 gates `D009-*` + `P52-TGT1` reancorado**, commitado em `3950288` (T007); reforço de `D009-UNS3` commitado em `d48b906` (achado do PO, rodada 2) | R3 §4 |
| `spec-validate` | **15/17 (88%)** — zero gaps de implementação; as 2 não-conformidades eram de **redação** e fecharam na rodada 2 (`61c646b`) | `.claude/project-memory/planning-state/009-leitura-do-relatorio.json → validate.conformance` |
| Identidade do engine | `declared.m41_payload_sha256` = `9794b267…` **inalterado** em todos os rebuilds | `pins.json → declared`, conferido nesta escrita |
| Verbetes novos | `Habilitador`, `Bloco de ausência`, `Ordem canônica de leitura`, `Base de evidência da sessão`, `Tecla de atalho (priorização)` | `CONTEXT.md`, conferido nesta escrita (linhas 70–100) |

## O ponto do deferimento fechou — no CI do próprio PR #24

O planning-state registra, para o commit de fecho: *"pipeline 13 PASS/1 FAIL —
o único FAIL sendo `mutation` nomeando p51/p52 por ausência de Chromium (KI-3,
agendamento, fecha no job `visual` do PR)"*. Antes de registrar isso como
"agendamento por desenho" (o que a R10 §2 proíbe fazer sem prova), fui conferir
**qual passo do workflow** executa o gate e **em qual run** ele aparece no log
(precedente da 011, onde o mesmo padrão escondeu dois gates que nenhum runner
invocava).

**Conferido por leitura de log, run `33298658338`** (head `b285afca07b4…`,
exatamente o `headRefOid` do PR #24 no merge — `gh pr view 24`):

| Job | Resultado | O que executou |
|---|---|---|
| `verify` (`gh run view 33298658338 --job 99222591904`) | **success** — `verify: 14 PASS · 0 FAIL` de stage, `compliance: 13 PASS · 0 FAIL` | roda com `MUTATION_DEFER_MISSING=1`: o stage `mutation` **PASSA aqui sem medir** `p51`/`p52` — é o defer, não a prova |
| `visual` (`gh run view 33298658338 --job 99222591809`) | **success** | `p50chromium + p51`: **27 PASS · 0 FAIL de 27**; `p52chromium`: **55 PASS · 0 FAIL de 55**; depois, `check_mutation.py` roda com Chromium disponível: `D009 MUTATION: 19 KILL · 0 escaparam de 19`, `CORE MUTATION: 3 KILL · 0 escaparam de 3`, `p51: 19/20 mutantes detectados` (o único não-KILL é a **exceção nominal KI-4**, `p51/M51-01`, achado `EA-7` — pré-existente, **alheio a esta demanda**), `p52: 107/107 mutantes detectados pelo gate e motivo esperados`. Fecho do stage: **`mutation: 4 campanha(s) executada(s) · 0 problema(s)`** |

**O deferimento fechou favoravelmente, no próprio PR, antes do merge** — não é
pendência que sobrou para depois. A frase do planning-state ("pipeline 13/1
localmente, fecha no job visual") está correta para o ambiente **local** onde
foi escrita (sem Chromium); no CI do mesmo PR o número real é **14 PASS · 0
FAIL** de stages e a campanha completa (`d009`, `core`, `p51`, `p52`) fechou
sem problema novo. O único item não-KILL (`M51-01`) é dívida de **outra**
demanda (5.1), com prazo amarrado ao merge da 014 — não entra no saldo da 009.

## Aceite de intenção do `product-owner`

Registrado no planning-state (`validate.notes`, escrito em 2026-08-28, commit
`d3c3ec1`): **"não encontrei objeção"**, depois da iteração. O achado que ele
levantou no próprio aceite — `tgtAbsenceHTML` montava a frase de ausência
**sem ramo de escopo**, afirmando "contexto não foi informado nesta sessão"
mesmo no caso **parcial** (uma capability declarada, outra UNSET), quando a
seção "Contexto tecnológico" lista a declarada bem abaixo — foi corrigido em
`e77b7b5`, com o gate `D009-UNS3` **endurecido antes** da correção (red em
`d48b906`, precedendo o fix) e o mutante `D009-M20` provando o discriminante
(KILL, rodada 2). Segunda frente do mesmo commit, aceita **sem gate**: o
rótulo do botão do aviso passa a vir de `#v32cta`; dívida declarada em
`mutation-matrix.json`, não corrigida por não ter critério.

Este é registro em planning-state, não "registro de aceitação" formal (R4/D3)
— coerente com o rito: nenhum agente escreve nesse registro; agente reprova
ou declara que não encontrou objeção.

## O que fica aberto — nomeado, não diluído

1. **Buraco na numeração visível das seções.** `data-p52-order` usa o índice
   na ordem **completa**, não a posição entre as renderizadas
   (`ui_p52_workspace_v32.js:2214-2221`) — pré-existente desde SUFF-REV-A; a
   ordem nova **move** o vão de "seção 4" para "seção 8", não o cria. Devolvido
   ao `product-owner` em `plan.md`/`tasks.md` (T023), **não absorvido** e
   **sem id permanente** até esta escrita. **Censo feito agora** (as três
   frentes da R12: headings de `.claude/BACKLOG.md` na `develop` — para em
   `EA-31` — e no único PR aberto, `#36`/`feature/014-…` — para em `EA-20` —,
   e reserva em prosa via `git grep -E "EA-3[2-9]"` em `specs/` de ambas as
   árvores: nenhuma ocorrência): **proponho `EA-32`** para este achado, cadeia
   `ui_p52_workspace_v32.js:2214-2221` → efeito "leitor vê 1,2,3,5,6,7,8,9,
   nunca 4". **Proposta, não escrita em `BACKLOG.md`** — id só é permanente
   quando o heading existir (R12; `.claude/BACKLOG.md` é pinado, repin no
   mesmo PR de quem escrever).
2. **Discrepância prosa×código em B4**, achado do próprio `tech-lead` na
   Fase 2 (`plan.md` DEPENDÊNCIAS item 6): a spec §5 diz "sem cenário-alvo não
   há seção e não há aviso", mas `ui_target_v32.js:96-101` renderiza
   `#ux-target` **sempre** (o que não nasce sem override é só o card
   `#ux-tgt-cmp`). Nenhum gate `D009-*` exercita B4 — `C10` exige ≥1
   prática-alvo — então nenhum gate muda e a spec aprovada não foi alterada
   por decisão de agente. **Sem id proposto nesta escrita**: dado que o
   próprio id livre seguinte (`EA-33`) está em disputa (ver acima), atribuir
   um número aqui arriscaria colisão real quando o PR #36 mesclar. Registro a
   cadeia e devolvo a numeração ao orquestrador junto com a discrepância do
   `EA-33`.
3. **Distinguir S3 de S4 por texto próprio** — não é defeito, é fronteira de
   escopo confirmada (`spec.md` §Fora de escopo): "a spec mantém a mesma
   frase para os dois estados; separá-los é ampliação que precisa nascer no
   refinamento". Não é achado; registrado aqui só para não reaparecer como se
   fosse.
4. **Dívida do harness `d009`** (achada pelo `build-engineer` em `0d4a329`,
   ao integrar o preflight exigido pela 013): o harness ainda emite
   `KILL`/`ESCAPOU`/`FALHA DO HARNESS` em vez do vocabulário fechado que o
   `mut_ler()` da 013 exige — por isso o stage relata "não-KILL: NÃO NOMEADOS
   em `d009`" (o veredito agregado vale; o relato por mutante individual não).
   Já declarada como dívida no próprio commit; dono é `qa-engineer`/`build-engineer`
   numa demanda com gate — não é escopo desta escrita.

## Dependências deixadas para outros

| Para | O quê |
|---|---|
| orquestrador | **Discrepância do `EA-33`**: citado como já alocado numa branch da 014 para o padrão "merge sem fecho de Fase 6", **não encontrado** nesta escrita em `origin/feature/014-gate-sem-poder-discriminante` (`5cf7c82`, PR #36 aberto), em `develop` (`EA-31` é o topo) nem em arquivo algum desta árvore (`grep -rni "EA-33"` vazio). Decidir se o id nasce quando o PR #36 mesclar ou se a referência era prematura — antes de qualquer relatório citar `EA-33` como fato consumado |
| orquestrador / quem cura o backlog | Alocação de `EA-32` (buraco na numeração, proposto acima) e da B4 (sem número, por causa da disputa do `EA-33`) |
| `qa-engineer` | Confirmar por execução o achado `EA-4` já registrado no `BACKLOG.md` (âncora de mutante apodrece) contra os dois casos `D009-M16`/`D009-M5` desta demanda — ambos já **corrigidos** (`6670dc3`, `a981885`); e resolver a dívida de vocabulário do harness `d009` (`0d4a329`) quando abrir demanda própria |
| `product-owner` | Nenhuma pendência de aceite — "não encontrei objeção" está registrado e o achado dele foi corrigido antes do merge. Fica com ele decidir se os itens 1 e 2 de "O que fica aberto" viram demanda |
| Demanda **010** (já mesclada) | Herdou o patch de `tgtEnablersHTML`, os quatro estados de §5 e os gates `D009-UNS1..4`/`D009-ABS1` como piso — conferido: a 010 fechou com `d009` 15/0 preservado e campanha `d009` 19/19 (`99d6de9`, já em `develop`) |

## Fontes citadas

`specs/009-leitura-do-relatorio/{refinement,spec,plan,tasks}.md`;
`.claude/project-memory/planning-state/009-leitura-do-relatorio.json`;
`.claude/verify/{expected_suites,mutation-matrix,pins}.json`; `CONTEXT.md`
(linhas 70–100); `.claude/BACKLOG.md` em `develop` (`EA-1`…`EA-31`) e em
`origin/feature/014-gate-sem-poder-discriminante` (`5cf7c82`, `EA-1`…`EA-20`);
`.claude/agent-memory/product-owner/project_013_fecho_retroativo.md`
(precedente do padrão "merge sem fecho de Fase 6").

Commits da demanda: `f256bb0`…`3950288` (fases 0–4), `8cef8c2` `30c730e`
`a466ac3` `37e099f` `bc10b96` `4f92b36` (implementação, wave 3–4), `cc58c41`
`133e91e` `fc89e60` (docs), `5ad2211` (rebuild), `b9c8a5b` (verde + campanha
rodada 1), `caf59c7` `a981885` `9f8b425` (correção de contraste), `d48b906`
`e77b7b5` `6670dc3` `7882ae9` (aceite do PO e correção), `8f69250` `284673b`
`d3c3ec1` (fecho declarado então), `0d4a329` (preflight exigido pela 013),
`4092463` (merge, PR #24).

CI: `gh pr view 24`, `gh run list --commit b285afca07b49a46d14f3c0d2a1f9c88e033b682`,
`gh run view 33298658338 --log --job 99222591904` (job `verify`), `gh run view
33298658338 --log --job 99222591809` (job `visual`) — todos conferidos nesta
escrita, 2026-09-01.

---

ARQUIVOS_TOCADOS: specs/009-leitura-do-relatorio/relatorio-final.md (criado)
RESUMO: Relatório final retroativo da Fase 6 da 009, escrito em 2026-09-01 sobre trabalho de 2026-08-27–30 (PR #24, mesclado sem este artefato — mesmo padrão da 013, citado como EA-33 pelo orquestrador). Registra o objetivo cumprido, as 5 ratificações nominais, a cadeia de commits e os números medidos ENTÃO (d009 15/0, p52layout 45/0, p50core 64/0, campanha d009 19/19, core 3/3, spec-validate 15/17). Ponto central verificado nesta escrita, não presumido: o deferimento de p51/p52 ao job `visual` FECHOU no próprio PR #24 antes do merge — log do run 33298658338 confere p52chromium 55/0, p50chromium+p51 27/0 e a campanha de mutação com Chromium (d009 19/19, core 3/3, p51 19/20 com KI-4 alheia, p52 107/107, "4 campanhas · 0 problemas"). Registrada a discrepância do EA-33: censado em develop, no único PR aberto (#36) e em toda a árvore local — não encontrado em lugar nenhum, então não posso confirmar a alocação citada pelo orquestrador. Proposto EA-32 (não escrito em BACKLOG.md) para o achado do buraco na numeração visível das seções; a discrepância prosa×código de B4 fica sem número por causa da disputa do EA-33.
EVIDÊNCIA: leitura de refinement.md/spec.md/plan.md/tasks.md (íntegra), planning-state 009 (íntegra), git log f256bb0..4092463 (68 commits datados), expected_suites.json (d009/p52layout/p50core conferidos por execução de leitura nesta escrita), mutation-matrix.json (19 pares D009-M* conferidos, todos KILL), pins.json (declared.m41_payload_sha256 inalterado), CONTEXT.md (5 verbetes confirmados). Execução própria nesta escrita: `gh pr view 24`, `gh run list --commit b285afc...`, `gh run view 33298658338 --log --job 99222591904` e `--job 99222591809` (logs completos lidos, achados citados por linha/timestamp). Censo EA-32/EA-33: `git for-each-ref` + `git show <ref>:.claude/BACKLOG.md` + `git grep -ni EA-33` em develop, no único PR aberto (#36, head 5cf7c82) e na árvore local — zero ocorrências nas três frentes.
DEPENDÊNCIAS: (1) orquestrador — resolver a discrepância do EA-33 (citado como já alocado, não encontrado) antes de qualquer relatório futuro repetir a citação como fato; decidir a alocação de EA-32 (proposto) e da achado B4 (sem número). (2) qa-engineer — dívida de vocabulário do harness d009 (0d4a329) e confirmação do achado EA-4 (já registrado) contra os casos D009-M16/D009-M5 (já corrigidos). (3) Nenhuma pendência de aceite do product-owner — já registrado. (4) planning-state desta demanda atualizado a seguir (phase → done), no mesmo commit deste relatório.
