# Relatório final — 012-status-backlog

> Fase 6 (T009) · dono: `doc-writer` · registro do que os gates decidiram, com
> os números que eles emitiram. **Este documento não decide PASS/FAIL** — quem
> decide é o gate citado em cada linha. Fontes: `refinement.md`, `spec.md`,
> `plan.md`, `tasks.md`, `spec-validate.md`, `matriz-gate-mutante.md` (todos em
> `specs/012-status-backlog/`), o planning-state
> (`.claude/project-memory/planning-state/012-status-backlog.json`),
> `.claude/BACKLOG.md`, `.claude/verify/compliance-audit.sh` e o `git log` da
> branch `feature/012-status-backlog` (portão da Fase 0 `97cd350` … HEAD
> `c65dba8`).

## Objetivo cumprido

O `.claude/BACKLOG.md` ganhou uma linha de status em **gramática fechada** (4
estados: `aberto` · `resolvido` · `refutado` · `transferido`); o achado `EA-1`
foi migrado para ela; e a seção **`backlog`** do `.claude/verify/compliance-audit.sh`
passou a **listar os achados abertos com `ok`** e a **reprovar só por violação
de forma** — com o rito de escrita documentado no próprio cabeçalho do arquivo,
como já fazia a seção `waivers` para `tdd_waiver`. Nenhum byte de produto muda;
a superfície única é o processo de auditoria.

## Cadeia da implementação

| Passo | Registro |
|---|---|
| Repin R1 (portão da Fase 2, `plan.md`) | commit `0246dfd` |
| Repin R2 (portão da Fase 3, `tasks.md`) | commit `502fbdb` |
| **Red provado e commitado** (R3 §4) — seção `backlog` reprova o `EA-1` em prosa, `.claude/BACKLOG.md` intocado (mecânica T8: sem fixture, sem tocar o arquivo) | commit `13f4bb4` — `bash .claude/verify/compliance-audit.sh --rule=backlog` → `[FAIL] EA-1: linha de status fora da forma/vocabulário: "**Status: aberto.**"` — **0 PASS · 1 FAIL, exit 1** |
| Repin R3 (commit red, `compliance-audit.sh`) | commit `3ca3320` |
| **Green** — rito no cabeçalho (gramática, vocabulário, eventos, prefixo reservado, exemplos indentados) + migração da linha 52 (`**Status: aberto.**` → ``**Status**: `aberto` ``), única linha alterada no bloco `EA-1` | commit `ebceb70` — mesmo comando → `[PASS] achados abertos (1), listados para revisão: EA-1 — …` — **1 PASS · 0 FAIL, exit 0** |
| Repin R4 (commit green, `.claude/BACKLOG.md`) | commit `c3c6e55` |
| Campanha de mutantes (M-BS1…M-BS4) + 2 sondas de auto-exclusão (T6) | **6/6 mutantes mortos + 2/2 sondas conformes** (`specs/012-status-backlog/matriz-gate-mutante.md`), em worktree efêmera, nenhuma mutação commitada; regressão das **7 seções irmãs byte-idêntica** ao baseline pré-012 |
| `spec-validate` (conformidade spec × implementação) | **22/22 itens conformes — 100%**, zero iterações de correção (`specs/012-status-backlog/spec-validate.md`, HEAD `c3c6e55`) |
| CI Linux (plataforma canônica) | run `33219366036` (`workflow_dispatch`, head `c3c6e55`) — job `verify` **success**: pipeline **14 PASS · 0 FAIL**, `compliance-audit` **13 PASS · 0 FAIL** com `[PASS] achados abertos (1)` — **primeira execução da seção `backlog` em Linux** |
| Aceite de intenção do PO (Fase 6, T008) | **"não encontrei objeção"** — as 4 decisões da rodada 1 do refinamento conferidas ponta a ponta; os 4 não-bloqueantes do parecer (PO-1…PO-4b) todos executados e verificados |
| Ajuste do PO fechado nesta mesma wave: recomendação de "data de abertura" (decisão 1.3) movida da spec para o rito do cabeçalho, onde o escritor de fato lê | commit `c65dba8` — só o cabeçalho tocado (`git diff` confere); `--rule=backlog` depois: `[PASS] achados abertos (1)…` — **1 PASS · 0 FAIL, exit 0** |

## Três aprendizados registrados (nomeados pelo PO, não diluídos)

1. **Gatilhos do `verify.yml`**: push de `feature/*` **não dispara** o
   workflow — os gatilhos são PR, push→`develop`/`main` e
   `workflow_dispatch`. A mecânica T8 do plano supunha o contrário (CI
   reprovando automaticamente no commit red). A premissa caiu, mas a R3 §4
   foi cumprida do mesmo jeito: red **commitado** (`13f4bb4`) com a saída
   registrada, e o mutante **M-BS3** prova que o red é reproduzível, não
   acidente de estado. **Spec futura não pode assumir CI automático em push
   de `feature/*`** — o desenho do gatilho é intencional (economia de minutos
   de CI em branch de trabalho), não defeito a corrigir.
2. **Repins × árvore limpa (2ª ocorrência)**: segurar `matriz-gate-mutante.md`
   e `spec-validate.md` fora do índice — decisão de desenho da T006, para
   preservar a previsão nominal de 5 repins do plano — fez o stage `mutation`
   reprovar por árvore suja (`check_mutation.py:40-44`, pré-condição de
   porcelain limpo; `??` no `git status`). Causa isolada por execução: no
   mesmo HEAD, em worktree efêmera limpa, `mutation` = 0 campanhas exigidas ·
   0 problemas · exit 0 (nenhum alvo do `mutation_map.json` mudou nesta
   demanda) — **FAIL verdadeiro, causa não é regressão**. É a **segunda vez**
   que a previsão de repins morde: a 008 previu 1 e executou 3 (virou
   ressalva em `design-decisions.md`). **Previsão de repins é estimativa,
   nunca contagem pinada.** Uma terceira ocorrência vira demanda de ajuste ao
   template de plano.
3. **Episódio do M-BS2a** (registro honesto, R2 §1/§3): na 1ª rodada da
   campanha de mutantes o runner injetou `(\\w+)` na raw string do
   `RE_CANON` — a regex mutada virou `\\w+` literal (barra invertida + `w`),
   que não casa token nenhum; o cenário `abertto` continuou reprovando por
   near-miss e o runner acusou "SOBREVIVENTE" por engano. Diagnóstico de
   causa antes de culpa: **defeito de escape no runner, não do gate** — o
   mutante pretendido (vocabulário frouxo) nunca chegou a existir naquela
   execução. Corrigida a injeção, a campanha foi **re-executada
   integralmente**; `M-BS2a` morto na segunda rodada (matriz). Nenhum gate
   foi alterado ou enfraquecido em nenhum momento; as duas execuções constam
   do log da matriz — o episódio é registrado, não silenciado.

## Encaminhamento nomeado — candidato `EA-2`

Achado colateral da campanha (T006), **não** um mutante sobrevivente nem
defeito da seção `backlog` nova: `.claude/verify/compliance-audit.sh:126`
(`grep -l "tdd_waiver"` sobre os planning-states) casa **substring sem
fronteira de chave JSON** — `.claude/project-memory/planning-state/012-status-backlog.json:5`
tem `tdd_waivers` **em prosa**, dentro do campo `brief`, e a seção `waivers`
lista o planning-state da 012 como "waiver TDD ativo" sem existir a chave
`tdd_waiver` de fato (confirmado na execução do audit completo desta wave:
seção `waivers` lista `.../012-status-backlog.json`). Não altera nenhum
PASS/FAIL (a seção emite `ok` nos dois ramos), mas engana o leitor da
listagem de revisão.

**Encaminhamento e dono**: registrar como achado **`EA-2`** no
`.claude/BACKLOG.md`, já na gramática nova, **depois do fechamento desta
demanda** — a correção (por exemplo, casar a chave `"tdd_waiver"` com aspas
em vez de substring livre) é do dono do script, por `fix-finding` próprio,
fora desta matriz. **Nota de guarda do PO, registrada com o mesmo peso**: a
correção **não** deve sanar o achado editando a prosa do `brief` (removendo a
palavra `tdd_waivers` de lá) — isso mascararia o caso de reprodução em vez de
corrigir o scanner. O scanner é a causa; a prosa do `brief` é o caso de teste
que a expôs.

## Pendência nomeada para o portão (T010, não silenciada)

No HEAD deste relatório (`c65dba8`), o stage `baseline` está **vermelho por
desenho, declarado**: `.claude/BACKLOG.md` diverge do registry (1 divergência
— o commit `c65dba8` alterou o arquivo pinado sem repin próprio, e
`matriz-gate-mutante.md`/`spec-validate.md`/este relatório seguem rastreados-
sem-pin, deliberadamente fora do índice até o fechamento). Isso é exatamente o
Repin R5 (= BS-5) previsto no `plan.md` §Pins: T010 (`build-engineer`) commita
os três artefatos finais (matriz, spec-validate, este relatório) e roda
`gen_pins.py` em commit chore próprio logo em seguida, cobrindo também
`.claude/BACKLOG.md` (Tarefa A) — fechando `baseline` em **0 divergências · 0
rastreado-sem-pin**, R1–R5, **desvio zero** em relação à previsão do plano.

## Fontes citadas

`specs/012-status-backlog/{refinement,spec,plan,tasks,spec-validate,matriz-gate-mutante}.md`;
`.claude/project-memory/planning-state/012-status-backlog.json`;
`.claude/BACKLOG.md`; `.claude/verify/compliance-audit.sh`; commits `0246dfd`
(R1), `502fbdb` (R2), `13f4bb4` (T002, red), `3ca3320` (R3), `ebceb70` (T004,
green), `c3c6e55` (R4), `c65dba8` (ajuste do rito, esta wave — HEAD desta
demanda no momento deste relatório).
