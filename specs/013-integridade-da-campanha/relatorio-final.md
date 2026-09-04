# Relatório final — 013-integridade-da-campanha

> Fase 6 · T031 · dono: `doc-writer` · **escrito em 2026-09-04**.
> Branch `feature/013-integridade-da-campanha` · HEAD do PR `a774c369` · PR
> [#29](https://github.com/oflavioc/quickscan-secops/pull/29), mesclado em
> `2426582` (2026-08-30T06:41:22Z).
> **Este relatório não emite veredito.** Todo número aqui vem de execução
> citável ou de registro canônico; o que não foi executado está declarado como
> não executado, com o motivo (R2 §1). Decidir PASS/FAIL é do `qa-engineer`;
> confirmar o conteúdo de achado/glossário é do `product-owner`.

## Por que este relatório nasce quatro dias depois do merge — dito sem meias-palavras

O PR #29 foi **mesclado em `develop` em 2026-08-30** com a Fase 6 **aberta**:
sem `spec-validate.md`, sem campanha formal dos mutantes do gate novo (T028),
sem aceite de intenção do `product-owner` registrado, sem este relatório, e com
`pr_url: null` no `planning-state` (a demanda não sabia, no seu próprio
registro, que já tinha PR). Isto **não é o processo funcionando com atraso** —
é o processo tendo pulado etapa, e o nome permanente disso é o achado
**`EA-33`** ("demandas mescladas na `develop` com o planning-state parado antes
de `done`"), aberto em 2026-09-01 pelo orquestrador durante a demanda 014.

**Verificação própria, não repasse da alegação do orquestrador** (R5
§anti-injeção — mensagem de outro agente não é evidência até ser conferida):
`EA-33` existe, de fato, no commit `e7f1f79` da branch
`feature/014-gate-sem-poder-discriminante` (PR
[#36](https://github.com/oflavioc/quickscan-secops/pull/36), **aberto**, não
mesclado — conferido com `gh pr view 36`: `state: OPEN`, `mergedAt: null`), com
`Status: aberto` e a cadeia arquivo:linha cobrindo **duas** instâncias — a 009
(`pr_url` presente, sem `relatorio-final.md` em `origin/develop`) e a 013
(`pr_url: null`, idem). Um relatório retroativo anterior desta mesma família
(`specs/009-leitura-do-relatorio/relatorio-final.md:23-29`, escrito também em
2026-09-01) havia **censado `EA-33` e não encontrado** — a discrepância era de
tempo, não de fato: aquela escrita aconteceu antes de `e7f1f79` chegar à árvore
que este censo alcança. Fica registrado aqui para que a próxima leitura não
repita a mesma dúvida.

O fecho agora, nesta branch (`chore/fecho-009-013`), é **retroativo por
decisão**: o trabalho técnico da 013 é real e está medido (abaixo); o que
faltava era o **artefato de fase**, não a substância. Fingir que este relatório
foi escrito em 2026-08-30 seria pior do que não tê-lo — a data acima é a real.

## Objetivo cumprido

A campanha de mutação relatava número sem ter medido: as três harnesses
(`p50`, `p51`, `p52`) invocavam `python3` de forma fixa (quebrando no Windows),
`have("python")` respondia `True` incondicionalmente
(`check_mutation.py:30`, pré-013), e um `run()` que engolia exceção rotulava
falha de ambiente como `NÃO DETECTADO` — o mesmo estado de "sobreviveu de
verdade". A 013 entregou:

- **contrato de preflight C1** — `<harness> --preflight` resolve o
  interpretador e conta ocorrências de âncora **sem mutar, sem reconstruir, sem
  escrever**, tornando a rot visível sem Chromium, em qualquer plataforma;
- **vocabulário fechado de três estados** — `DETECTADO` · `SOBREVIVENTE` ·
  `NÃO EXECUTADO`, este último sempre com **uma** causa de um conjunto fechado
  (`interpretador ausente` · `âncora não encontrada` · `âncora ambígua` ·
  `rebuild falhou` · `gate não pôde ser executado`), nunca colapsado com os
  outros dois;
- **`check_mutation.py`** com os blocos **IC-9** (`mut_perdao` — exceção
  nominal de mutante sobrevivente, com prazo e perdão **impresso**) e **IC-10**
  (`mut_guarda_leitura` — guarda contra campanha truncada cujo único
  não-KILL é justamente o perdoado saindo verde por acidente);
- **8 reancoragens** — as 4 âncoras podres nominais da `p51`
  (`M51-03`, `M51-16`, `M51-18`, `M51-20`) mais 4 reveladas pelo próprio
  instrumento em `p50`/`p52` (`M13`, `M23`, `M35`, `V322-M3`), escopo estendido
  sob delegação do proprietário porque, sem elas, `IC-4` ficaria vermelho para
  sempre e o PR nunca mesclaria;
- **IC-4** — todo mutante exige `ocorrencias == 1` antes de mutar; hoje
  **257/257** âncoras nas 7 harnesses com preflight (180/180 no PR #29, com
  apenas 3 delas ativas).

**Alcance medido, não só a entrega do dia**: o contrato de preflight
**propagou** para harnesses nascidos depois — `d009`, `d010`, `d011`, `d014`,
`d014vis` — e foi ele que, na demanda 010, **pegou uma âncora podre antes da
campanha rodar** (`ocorrencias == 0`, exit 1). Uma demanda de instrumento se
mede pelo que ela impede depois, não só pelo que mediu no dia em que nasceu.

## As três peças do fecho — o que cada uma diz, com os números que emitiu

### 1 · `matriz-gate-mutante.md` §1–§13 (E1–E4, escrito na época) e §20–§23 (T028, escrito em 2026-09-04)

As 8 reancoragens (§3 e §10) seguem a mesma disciplina em todas: a propriedade
do `desc` está viva hoje, o gate faz a asserção correspondente e o `reason`
casa a mensagem atual, e o recorte escolhido é o **menor sítio único** que
carrega a propriedade — nunca "casa e passa". Caso notável: a unicidade de
`M51-18` foi **construída**, não restaurada — o texto natural do agregado é
idêntico em `ui_v32.js:131` (`legacySnapshot`, INV-fora) e no ponto do
relatório, e o recorte final ancora no comentário `ERRATA B1`, que **é** a
especificação da propriedade no ponto exato dela.

A campanha formal dos mutantes do gate novo (T028, exigida por R3 §5), que
antes da escrita de hoje vivia **dispersa** em três documentos de red, foi
**consolidada e re-executada** em worktree efêmera, sobre a implementação real:

| campanha | resultado |
|---|---|
| `M-IC1`…`M-IC9` | **9 de 9 mortos**, cada um pela linha do seu próprio gate (nenhuma morte incidental por outro `IC-n`) |
| `M-IC1`, `M-IC2`, `M-IC3` | deixam de ser "estado de hoje" e passam a ser mutantes **aplicados sobre o green** — a prova que o red sozinho não podia dar |
| `M-IC4` (o retorno do laço de dois estados) | morto pelos **dois** cenários de IC-3, medidos sobre as harnesses de hoje: (a) interpretador ausente — `p50` 53/53, `p51` 20/20, `p52` 107/107 `NÃO EXECUTADO`, razão `D/T` impressa 0 vezes; (b) âncora corrompida — `NÃO EXECUTADO` nomeado, `CAMPANHA NÃO CONCLUÍDA`, nada mutado |

`M-IC10`…`M-IC31` (addenda IC-9/IC-10) permanecem medidos nos seus próprios
reds (`red-excecao-nominal.md`, `red-guarda-leitura-parcial.md`); os três de
fiação (`M-IC19`/`M-IC29`/`M-IC31`) têm morte declarada fora das sondas, com a
fiação provada **viva** pelo próprio job `visual` do PR #29 (abaixo) — viva não
é o mesmo que morta, e o texto §23 diz isso explicitamente.

### 2 · `spec-validate.md` (escrito em 2026-09-04, retroativo, medido no HEAD `7bf1c30`)

**32 de 35 conformes — 91,4 %.** **Zero** gaps de classe
`implementação-divergente`: nada do que a 013 entregou diverge do que a spec
pede. Os três gaps:

| id | classe | o que é |
|---|---|---|
| **G1** | `spec-errada` | IC-2 promete "`[DEFER]` nomeado ⇒ exit 0" sob `MUTATION_DEFER_MISSING=1` com interpretador ausente; T6 e a tabela de cenários da **mesma** spec exigem exit ≠ 0 nesse caso. A implementação seguiu a cláusula mais forte (IC-4 reprova) — a spec é que se contradiz |
| **G2** | `spec-errada` | a lista "Não mudam" e o §Fora de escopo não acompanharam duas decisões ratificadas depois da spec: o addendum IC-9/IC-10 (nominal, 2026-08-30) e a E2 estendida a `p50`/`p52` (delegação de 2026-08-29) |
| **G3** | `faltando, declarado` | prova **(c)** de T9 (sobrevivência com a asserção neutralizada) não executada para `M51-16` e `V322-M3` — exige Chromium (KI-3) |

**G1 e G2 estão em errata, em escrita agora pelo `product-owner`, em paralelo a
este relatório.** Não toquei `spec.md` — é arquivo pinado e a errata é rito do
próprio PO + `tech-lead`, com aprovação do usuário. Não invento aqui o número
nem o texto da errata; quando existir, os dois gaps se resolvem por **emenda da
spec**, nunca por afrouxar o gate (a implementação já está do lado mais forte
nos dois casos). **G3 é dívida com dono** (`qa-engineer`), rota conhecida
(Chrome estável 152 via `CHROME_PATH`, controle já medido — `D011-CON1` deu
**8,82:1**, o mesmo número do run `33426062475`), não executada nesta escrita.

### 3 · Aceite de intenção do `product-owner` (registrado em `planning-state`, bloco `validate`, 2026-09-01)

*"Não encontrei objeção."* O PO conferiu as quatro entregas do refinamento
(E1–E4) contra o estado real da árvore pós-merge e as **8 reancoragens uma a
uma** na matriz — todas escolhidas pela propriedade do `desc`, nenhuma "casa e
passa", com a unicidade de `M51-18` construída do lado do comentário
`ERRATA B1`, que **é** a especificação da propriedade. Ele deixou **seis
pendências nomeadas como dependência, não como objeção de intenção** — entre
elas, este relatório (item 1) e a pergunta central sobre o job `visual`
(item 6), respondida abaixo.

## O ponto que fecha a dúvida central — apurado por log, não presumido

O `product-owner` registrou, no aceite: *"não há na árvore evidência de que o
job `visual` do PR #29 executou as campanhas delegadas."* A resposta é **sim**,
e não por confiança no que o `spec-validate.md` já dizia — **reconferido nesta
escrita, por execução própria**:

- `gh run view 33295007844` → `conclusion: success`, `headSha: a774c369…`
  (o head exato do PR #29), `createdAt: 2026-08-30T05:34:53Z`; job `verify`
  (`99213050930`) passou sob `MUTATION_DEFER_MISSING=1` — **é o defer**, sozinho
  não prova nada;
- log do job `visual` (`99213051082`), lido linha a linha
  (`gh run view --job 99213051082 --log`): às `2026-08-30T06:40:17.38Z` —
  `MUTATION TESTING (5.0.1+5.0.2+5.0.3): 53/53` · `MUTATION TESTING (Phase 5.1):
  19/20` com `SOBREVIVENTE M51-01 · gate P51-VIS1` seguido de
  `[EXCEÇÃO] KI-4: p51/M51-01 SOBREVIVENTE perdoado · gate P51-VIS1` (impresso,
  não silencioso) · `MUTATION TESTING (Phase 5.2): 107/107` · fechando
  `mutation: 3 campanha(s) executada(s) · 0 problema(s)`;
- `git show -s --format=%cI 2426582` → `2026-08-30T03:41:21-03:00` =
  `06:41:21Z` — o commit de merge, **65 segundos** depois do fecho do job
  `visual`.

O deferimento fechou **favoravelmente antes do merge**, no head exato do PR.
Não é presunção nem repasse do relato do QA: é o mesmo log, lido de novo, por
outra pessoa.

## O que **não** fechou — a borda 8, e a ironia que ela mesma prevê

Nada no `verify.yml` **vincula** o `[DEFER]` do job `verify` à execução
efetiva do job `visual` — um `[DEFER]` cujo job irmão falhasse, fosse pulado ou
não rodasse deixaria a campanha **sem execução e sem FAIL**. A própria 013
registrou isso como risco nomeado (`spec.md` §Riscos, item 4: "borda 8
(deferimento sem contrapartida)... fora do escopo desta spec; entra em
`dividas_declaradas`, para virar demanda própria") e a matriz o carrega em
`dividas_declaradas[11]`. A verificação acima — feita **à mão**, lendo o log do
GitHub — é exatamente o trabalho que a borda 8 diz que ninguém automatizou:
provei o deferimento fechou porque fui atrás do log, não porque algo no
pipeline teria acusado o contrário se ele não tivesse fechado.

## Números — o que rodou nesta escrita (2026-09-04)

| execução | resultado |
|---|---|
| `bash .claude/verify/run.sh --light`, HEAD `66ee17f` | `env-doctor` `[PASS]` · `baseline` `[PASS]` · `boundary` `[PASS]` · `marker-lint` `[PASS]` · `icons-check` `[PASS]` · `build` `[PASS]` · `lint-arch` `[PASS]` · `state` `[PASS]` · `tdd` `[PASS]` · `m41` `[PASS]` — **`verify: 10 PASS · 0 FAIL`**. `mutation`/`suites`/`suites-heavy`/`evidence-bridge` `[SKIP] (heavy, --light)`, declarado, não omitido |
| `git status --short` no início desta tarefa | limpo — o repin do `spec-validate.md`, da matriz (T028) e da trilha da 011 já haviam sido commitados por sessão anterior (`66ee17f`); nenhum `gen_pins.py` executado por mim |
| `gh run view 33295007844` / `--job 99213051082 --log` | reconferido nesta escrita (seção acima) |
| `git show c08acc98:.claude/BACKLOG.md` (branch `feature/014`, PR #36 aberto) | `EA-33` confirmado, `Status: aberto` (seção acima) |
| `git log --oneline --all --grep="(013)" \| grep gen_pins` | **20** commits `(013)` de `gen_pins.py` no total: **19** entre a aprovação da Fase 1 (`a052617`) e o head do PR (`a774c369`) — número que **bate exatamente** com o citado em `spec-validate.md` item 21/29 — mais **1** (`b6ee361`, "repin das memórias de agente do fecho retroativo") executado **hoje, nesta branch de fecho**, fora do ciclo de vida do PR #29 |

**Desvios da previsão de repins** (pedido nominal de T031, `tasks.md:41`): o
`plan.md` previa 10 repins nomeados R1–R10 (o último, R10, seria o fechamento —
nunca executado antes do merge, e é exatamente essa lacuna que este fecho
retroativo cobre). Medido: `R8` saiu em **dois** commits (`R8a` triagem,
`R8b` reancoragem) em vez de um; depois de `R9` (E3/E4), a série continuou com
repins **fora da tabela**, cada um nomeado em seu próprio commit — o mais
notável, `9c95b4f` "repin após sincronização com a develop (T023)", previsto
textualmente pelo próprio `tasks.md:33` como desvio a registrar aqui; e
`491d157` "repin da E2 estendida (fora da previsão R1-R10, registrado)",
cobrindo a extensão a `p50`/`p52`. Os cinco repins finais do addendum
IC-9/IC-10 (red/green de cada um, mais a classificação E3/EA-7) também ficam
fora da tabela original, por serem trabalho ratificado depois do plano
aprovado. **A linha de base de campanha pré-edição permanece não obtenível**,
como o `plan.md` §Riscos já registrava: o job `visual` roda sem `--all` e antes
da edição nenhum harness exigia campanha; local sem Chromium; rito manual do
proprietário, ausente. Nunca apresentada como medida.

## Achados que a demanda fechou, com id permanente

`EA-4` (âncora podre em silêncio), `EA-5` (harness que não rodou reporta
`NÃO DETECTADO`) e `EA-6` (pré-condição `python` decorativa, habilita `EA-5`)
— escritos juntos no commit `0c3f752` ("W8 — matriz verdadeira da P51 e os
achados EA-4, EA-5 e EA-6"), depois que `EA-3` chegou à `develop`, como o
`tasks.md`/T023 exigia para não colidir id. `EA-7` (gate verde que já não pode
reprovar — `M51-01`/`P51-VIS1`) nasceu na E3, commit `b566d9c`, e é o alvo do
perdão nominal `KI-4` que o job `visual` imprime a cada execução.

## Pendências — todas, nenhuma some

| # | item | estado | dono |
|---|---|---|---|
| 1 | **G1/G2** (`spec.md` contraditória em IC-2; lista "Não mudam" desatualizada) | errata **em escrita agora**, em paralelo a este relatório — não relatada aqui como resolvida, número/texto não inventados | `product-owner` + `tech-lead`, aprovação do usuário, repin |
| 2 | **G3** (prova (c) de T9 para `M51-16`/`V322-M3`) | dívida declarada, rota conhecida (Chrome estável via `CHROME_PATH`), não executada | `qa-engineer` |
| 3 | **Borda 8** (nada vincula `[DEFER]` à execução efetiva no job `visual`) | aberta; a própria 013 a registrou como demanda própria (spec §Riscos 4); esta escrita proveu a verificação manual que a borda existe para dispensar | orquestrador (abrir demanda) + `qa-engineer`/`build-engineer` (desenho) |
| 4 | **Fase permanece em `validate`** | o `qa-engineer` recusou movê-la no `spec-validate.md`, e o `product-owner` antes dele no aceite — fechar com metade da Fase 6 sem artefato seria exatamente o carimbo retroativo que a demanda 014/`EA-33` existe para impedir. `validate.conformance` já está preenchido (o campo que `check_tdd.py:37` cobra para `done`); a transição, quando autorizada, é a troca de um campo | **o usuário, no chat** (R4 §D3 — nenhum agente aprova fase) |
| 5 | **`EA-33`** | aberto, na branch `feature/014-gate-sem-poder-discriminante` (PR #36, não mesclado); esta demanda é uma das duas instâncias nomeadas nele | orquestrador + `qa-engineer` + `product-owner` (quando o PR #36 chegar à `develop`) |

## Fontes citadas

- `specs/013-integridade-da-campanha/`: `refinement.md`, `spec.md` (aprovada
  `a052617`, errata da Fase 2 `3888cc0`), `plan.md` (§Registro de repins,
  §Riscos), `tasks.md` (T023, T028, T030, T031), `matriz-gate-mutante.md`
  (§1–§13, §20–§23), `spec-validate.md`
- `.claude/project-memory/planning-state/013-integridade-da-campanha.json`
  (blocos `red`, `validate`, `validate.spec_validate`)
- `.claude/BACKLOG.md` local: `EA-4` (`:474`), `EA-5` (`:554`), `EA-6`
  (`:629`), `EA-7` (`:707`)
- `.claude/BACKLOG.md` em `feature/014-gate-sem-poder-discriminante`
  (commit `c08acc98`, via `git show`): `EA-33` (`:1355`)
- `gh run view 33295007844` / `--job 99213051082 --log`; `gh pr view 36`;
  `git show -s --format=%cI 2426582`
- `git log --oneline --all --grep="(013)"` (contagem de repins)

---

ARQUIVOS_TOCADOS: `specs/013-integridade-da-campanha/relatorio-final.md` (novo) → nenhum outro arquivo tocado
RESUMO: Relatório final retroativo da Fase 6 da 013, escrito em 2026-09-04 sobre trabalho de 2026-08-29–30 (PR #29, mesclado sem este artefato — o mesmo padrão nomeado `EA-33`, confirmado por execução própria como existente e aberto na branch `feature/014-gate-sem-poder-discriminante`, PR #36 ainda aberto). Registra o que a demanda entregou (contrato de preflight C1, três estados fechados, `check_mutation.py` com IC-9/IC-10, as 8 reancoragens com as três provas de T9, IC-4 em 257/257 âncoras), a leitura das três peças do fecho (`matriz-gate-mutante.md` §20–§23: campanha M-IC1..M-IC9 9/9 mortos; `spec-validate.md`: 32/35, zero gap de implementação-divergente, G1/G2 spec-errada em errata pelo PO agora, G3 dívida com dono; aceite do PO "não encontrei objeção"), e o ponto central reconferido por execução própria (não repassado): o job `visual` do PR #29 (run 33295007844, job 99213051082) fechou `mutation: 3 campanha(s) · 0 problema(s)` às 2026-08-30T06:40:17Z, 65 segundos antes do commit de merge `2426582` (06:41:21Z) — o deferimento fechou favoravelmente antes do merge. Registradas todas as pendências: G1/G2 em errata (não tocada), G3 com dono, a borda 8 ainda aberta (nada automatiza o vínculo `[DEFER]`↔execução — esta escrita só proveu a checagem manual que a borda pede para dispensar), e a fase permanecendo em `validate` porque a condição do PO (este relatório) só se completa agora e a transição para `done` é do usuário.
EVIDÊNCIA: `bash .claude/verify/run.sh --light` no HEAD `66ee17f` → **10 PASS · 0 FAIL** (env-doctor, baseline, boundary, marker-lint, icons-check, build, lint-arch, state, tdd, m41; mutation/suites/suites-heavy/evidence-bridge SKIP declarado, `--light`). `git status --short` limpo antes e depois — nenhum `gen_pins.py` executado por este agente (repin já estava feito por sessão anterior). Verificação própria (não presumida): `gh run view 33295007844` (success, head `a774c369`) e `gh run view --job 99213051082 --log` (linhas de `06:40:17Z` lidas literalmente) + `git show -s --format=%cI 2426582` (`06:41:21Z`) — confirmam o fecho do deferimento 65s antes do merge. `gh pr view 36` (`state: OPEN`, `mergedAt: null`) e `git show c08acc98:.claude/BACKLOG.md` (branch `feature/014`) confirmam `EA-33` existente e aberto — discrepância do relatório irmão da 009 (que não o encontrou) explicada por ordem temporal dos commits, registrada no corpo. `git log --oneline --all --grep="(013)" | grep gen_pins` → 20 commits, 19 no ciclo de vida do PR (bate com spec-validate.md) + 1 desta sessão de fecho. Fontes lidas na íntegra: `spec-validate.md` (211 linhas), `matriz-gate-mutante.md` §1–§13 e §20–§23, `planning-state` da 013, `spec.md` (Riscos, Contratos), `plan.md` (tabela de repins), `tasks.md` (T023/T028/T030/T031). Não executado nesta escrita, declarado: prova (c) de G3 (Chromium ausente — KI-3); qualquer suíte heavy (fora do escopo de `doc-writer`, que registra o que o QA decidiu).
DEPENDÊNCIAS: (1) `product-owner` + `tech-lead` — errata de G1/G2 na `spec.md`, com repin no mesmo commit; (2) `qa-engineer` — prova (c) de G3 para `M51-16`/`V322-M3` via `CHROME_PATH`; (3) orquestrador — decidir se/quando abrir a demanda da borda 8 (spec §Riscos 4, `dividas_declaradas[11]`); (4) o usuário, no chat — única autoridade para mover `013-integridade-da-campanha` de `validate` para `done` (R4 §D3); nenhuma condição técnica nova bloqueia essa decisão além das já nomeadas; (5) orquestrador/`qa-engineer`/`product-owner` — reconciliar `EA-33` (duas instâncias, 009 e 013) quando o PR #36 da demanda 014 mesclar em `develop`.
