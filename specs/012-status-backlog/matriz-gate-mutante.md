# Matriz gate ↔ mutante — 012-status-backlog

> Wave 3 (T006) · executor: qa-engineer · modalidade manual (harness formal de
> mutação: pendência Onda 3/KI-2, como nas 007/008). Execução em **worktree
> efêmera** (`git worktree add --detach` em `c3c6e55`, no scratchpad da sessão —
> fora da árvore rastreada), 2026-08-28. Mutações de **script** (cópia do
> `compliance-audit.sh`) e de **arquivo** (cópia do `BACKLOG.md`) — **nada
> escrito na árvore real** (R7 §3); `git status --porcelain` da worktree vazio
> pós-reset de cada mutante e da árvore principal vazio ao final; **nenhuma
> mutação commitada**. Runner e log íntegros no scratchpad
> (`mut_campaign.sh` / `saida_mutantes_T006.txt`).

## Bloco 1 — Campanha M-BS1…M-BS4 (spec §Critérios de aceite)

Alvo sob teste: seção `backlog` do `.claude/verify/compliance-audit.sh`
(gate da 012, red provado em `13f4bb4`, green em `ebceb70`). Toda execução:
`bash .claude/verify/compliance-audit.sh --rule=backlog` dentro da worktree.

| Mutante | O que foi mutado (cópia efêmera) | Gate/caso que o mata | Comportamento obtido (literal) | Exit | Veredito |
|---|---|---|---|---|---|
| **M-BS1a** | script: corpo da listagem suprimido (`printf … "$CORPO" \| sed …` → `:` no ramo `OPEN`) | BS-1 — o caso positivo **assere a saída**, não só o exit | `[PASS] achados abertos (1), listados para revisão:` **sem** a linha `EA-1 — <título>` → asserção de listagem reprova | 0 | **MORTO** |
| **M-BS1b** | script: `if secao backlog` → `if secao backlog_removida` (seção fora do fluxo `secao()`) | BS-1 — seção presente e enumerada | `--rule=backlog` não emite nada: `compliance: 0 PASS · 0 FAIL` → ausência detectada | 0 | **MORTO** |
| **M-BS2a** | script: vocabulário do `RE_CANON` afrouxado — `(aberto\|resolvido\|refutado\|transferido)` → `(\w+)`; arquivo: linha canônica → `` **Status**: `abertto` `` | BS-2(b) — near-miss reprova, nunca silêncio | `[PASS] achados abertos: nenhum` — o typo `abertto` foi **aceito em silêncio** (cenário espera exit 1 com FAIL nomeado) | 0 | **MORTO** |
| **M-BS2b** | script: checagem de duplicata neutralizada (`len(cand) >= 2` → `>= 999`); arquivo: 2.ª linha canônica inserida no bloco EA-1 | BS-2(c) — duplicata reprova | `[PASS] achados abertos (1), listados para revisão:` + `EA-1 — …` — duplicata passou (cenário espera exit 1) | 0 | **MORTO** |
| **M-BS3** | arquivo: linha migrada revertida à prosa antiga `**Status: aberto.**` (script intacto) | BS-3 — o red é **reprodutível**, não acidente do estado | `EA-1: linha de status fora da forma/vocabulário: "**Status: aberto.**" — vocabulário: (…); dentro de bloco de achado, linha iniciando com **Status é reservada à gramática (…)` | 1 | **MORTO** |
| **M-BS4** | arquivo: exemplo do rito **desindentado e copiado para dentro do bloco EA-1** (2.ª candidata em coluna 0) | BS-4/T6-ii — auto-exclusão é **escopo de bloco**, não cegueira | `EA-1: linha de status duplicada — **Status em coluna 0 dentro de bloco é reservado; mova a prosa ou indente o exemplo (rito no cabeçalho)` | 1 | **MORTO** |

Reversão de todos: `git checkout` na worktree · porcelain vazio conferido.

## Bloco 2 — Sondas executáveis das camadas de auto-exclusão (T6)

Pergunta do orquestrador na delegação da T006: a indentação dos 4 exemplos do
rito é o que protege, ou o parser só não os pega por acidente de posição?
Resposta **por execução**, separando as duas camadas:

| Sonda | Mutação (cópia efêmera) | Resultado | O que prova |
|---|---|---|---|
| **SONDA-T6ii** | os 4 exemplos do cabeçalho **desindentados para coluna 0** (permanecendo antes do 1.º achado) | exit 0 · `achados abertos (1)` · `EA-1 — …` listado | Candidata só conta **dentro de bloco de achado**: para linhas de status no cabeçalho, a proteção real é o escopo de bloco (T6-ii) — não dependeria da indentação |
| **SONDA-T6iii** | heading-exemplo `## EA-99 — exemplo de heading do rito` inserido **em coluna 0** no cabeçalho | exit 1 · `EA-99: sem linha de status na posição canônica (primeira linha não vazia após o heading)` | Um heading de exemplo sem indentação **abriria bloco fantasma e reprova** — para exemplos de heading, a indentação (T6-iii) é sustentada por asserção: se faltar, o audit acusa; não é acaso nem cegueira |

Conclusão das sondas + M-BS4: as três camadas da T6 são executáveis e
independentes — (i) só `.claude/BACKLOG.md` é varrido; (ii) candidata fora de
bloco não conta (SONDA-T6ii); (iii) exemplo de heading em coluna 0 é detectado,
logo a disciplina de indentação do rito é verificada pelo próprio gate
(SONDA-T6iii); e dentro de bloco **nada escapa** (M-BS4).

## Bloco 3 — Evidência adversarial da T002 (consolidação, executada pré-red `13f4bb4`)

14 cenários em worktree efêmera própria da T002, **14/14 conformes**
(log íntegro no scratchpad da sessão da T002, `saida_adversarial_T002.txt`):

| Cenário | Mutação da cópia | Esperado | Obtido |
|---|---|---|---|
| BS-2(a) | linha de status removida do bloco | exit 1, FAIL de posição | `EA-1: sem linha de status na posição canônica (…)` · exit 1 |
| BS-2(b) ×4 | `` `abertto` `` · `` `pendente` `` · `` `Aberto` `` · prosa antiga | exit 1, FAIL de forma citando a linha | FAIL (b) literal citando cada linha · exit 1 ×4 |
| PO-4b | asserção sobre a mensagem de (b) | cita vocabulário E prefixo reservado | ambos presentes na mensagem |
| BS-2(c) | 2.ª candidata no bloco | exit 1, FAIL de duplicata | `EA-1: linha de status duplicada (…)` · exit 1 |
| BS-2(d) | `BACKLOG.md` removido | exit 1, FAIL de arquivo | `BACKLOG.md ausente — arquivo pinado, pré-condição da R12` · exit 1 |
| PO-3 | EA-1 riscado + `` `refutado` `` | exit 0 e saída asserida | `[PASS] achados abertos: nenhum` · exit 0 |
| PO-1 | `` `resolvido` `` | exit 0, não listado | `[PASS] achados abertos: nenhum` · exit 0 |
| PO-2 | `` `transferido` `` | exit 0, não listado | `[PASS] achados abertos: nenhum` · exit 0 |
| PO-4a | canônica deslocada (prosa é a 1.ª linha não vazia) | exit 1, FAIL de posição | FAIL (a) nomeando EA-1 · exit 1 |
| Extra (pré-green) | `` `aberto` `` canônico na posição | exit 0, listado | `achados abertos (1)` + `EA-1 — As três listas de proteção nunca foram reconciliadas` · exit 0 |

Com PO-1/PO-2 + a contraprova do refutado + o green real (`aberto`), os **4
estados do vocabulário têm aceitação provada** — nenhum ramo do `fullmatch`
ficou morto.

## Regressão (obrigação da T006)

- Audit **completo** na árvore real pós-campanha: **13 PASS · 0 FAIL · exit 0**
  (8 seções), EA-1 listado.
- As 12 linhas de saída das **7 seções irmãs byte-idênticas** ao baseline
  pré-012 registrado na T002 (`diff` vazio contra a transcrição da execução de
  referência).
- Mecânica do exit code inalterada (= contagem de FAIL, última linha do script).
- Stage `baseline`: **PASS** — 199/199 pins · 0 divergentes · 0 sem pin
  (executado nesta sessão via `run.sh --stage=baseline`).

## Registro honesto — 1.ª execução do M-BS2a inválida (R2 §1/§3)

Na primeira rodada da campanha o runner injetou `(\\w+)` na raw string do
`RE_CANON` — a regex mutada virou `\\w+` (barra invertida **literal** + `w`),
que não casa token nenhum; o cenário `abertto` continuou reprovando por
near-miss e o runner acusou "SOBREVIVENTE". Diagnóstico de causa antes de
culpa: **defeito de escape no runner, não do gate** — o mutante pretendido
(vocabulário frouxo) não chegou a existir naquela execução. Corrigida a
injeção para `(\w+)`, a campanha foi **re-executada integralmente**: M-BS2a
morto (tabela acima). Nenhum gate foi alterado ou enfraquecido em nenhum
momento; as duas execuções estão no log do scratchpad.

## Observação fora de escopo — falso positivo na seção `waivers` (candidato EA-2)

**Não é mutante sobrevivente nem defeito da seção `backlog`** — nasceu da
evidência colateral da T002 e foi confirmado pelo orquestrador e re-executado
nesta T006. Cadeia arquivo:linha→efeito:

- `.claude/verify/compliance-audit.sh:126` — `grep -l "tdd_waiver"` sobre
  `planning-state/*.json` casa **substring**, sem fronteira de chave JSON;
- `.claude/project-memory/planning-state/012-status-backlog.json:5` — o campo
  `brief` contém `tdd_waivers` **em prosa**;
- efeito: a seção lista o planning-state da 012 como "waiver TDD ativo" sem
  existir chave `tdd_waiver` — a listagem de revisão engana o leitor. Não
  altera PASS/FAIL (a seção emite `ok` em ambos os ramos).

Confirmação por execução (2026-08-28): `grep -c "tdd_waiver"` → `012…json: 1`
(a prosa); `003…json`/`007…json`/`008…json`: `0`. Encaminhamento: registrar
como achado **EA-2** no `.claude/BACKLOG.md` **após o fechamento desta
demanda**, já na gramática nova — a correção (ex.: casar a chave
`"tdd_waiver"` com aspas) é do dono do script via `fix-finding`, fora desta
matriz.

## Placar e fecho

**Resultado: 6/6 mutantes MORTOS + 2/2 sondas conformes (8/8 execuções).
Nenhum sobrevivente. Nenhum gate enfraquecido ou alterado.**

```text
$ git status --porcelain (worktree, pós-reset de cada mutante)  → (vazio)
$ git worktree remove --force <efêmera>                          → removida
$ git status --porcelain (árvore real)                           → (vazio)
$ git rev-parse HEAD                                             → c3c6e55 (green + repin R4)
```

## `mutation_map.json` — decisão registrada

Nenhuma entrada nova: o arquivo mapeia **harnesses de suítes `tests_*.js`**, e
o `compliance-audit.sh` não é suíte (T9 — também fora de
`expected_suites.json`). Rastro canônico desta campanha é esta matriz;
**re-execução manual obrigatória** quando a seção `backlog` do audit ou a
gramática do `BACKLOG.md` mudarem (R3 §5), até o harness scriptado da Onda 3
(KI-2).
