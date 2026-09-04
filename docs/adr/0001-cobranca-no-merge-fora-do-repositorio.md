# ADR 0001 — A cobrança do merge em `develop` vive na proteção de branch, fora do repositório; o check pré-merge é job próprio

> Critérios (R12): difícil de reverter + surpreendente sem contexto + trade-off
> real. Faltando qualquer um, não é ADR.

- **Status**: aceita
- **Data**: 2026-09-04
- **Decisores**: usuário/proprietário (portão da Fase 0 da demanda 016 — P1, P2;
  portão da Fase 1 — errata E1, todos 2026-09-04, no chat) · `tech-lead`
  (`specs/016-registro-contra-execucao/plan.md`, T8) · `build-engineer`
  (medição de custo, `medicoes-fase0.md` §Medição 1)

## Contexto

O merge em `develop` fazia duas promessas que nada cobrava: **P16.a** — o
`planning-state` promete fechar a Fase 6 (`done` + PR) antes do merge — e
**P16.b** — o `[DEFER]` do `check_mutation.py` promete que o job `visual` do CI
executa de fato as campanhas de mutação que exigem Chromium. Sem cobrança, as
duas já haviam sido quebradas em silêncio (`EA-33`: demandas mescladas com fase
`implement`/`validate`, nunca `done`). O credor de ambas é o mesmo: `develop`
não tinha nenhum check obrigatório (medido em `medicoes-fase0.md` §Medição 2,
confirmado ao vivo nesta validação — `DESPROTEGIDA`, sem `fecho`/`verify`/
`visual`). Este repositório nasceu do achado **E2** — a §29.4 em prosa não
impediu edição de superfície protegida — e a R6 responde "boundary é dado, não
prosa"; uma proteção que só existe como rito manual no painel do GitHub é
exatamente a prosa que a R6 proíbe.

Duas rotas concorrentes foram medidas e descartadas no portão da Fase 0 (P1):
levar o Chromium para o job `verify` (**R-b1**, retirando o deferimento) e
cobrar a promessa por recibo + job `reconcile` (**R-b2**). E uma terceira
questão, levantada só no portão da Fase 1 (**E1**): onde o check pré-merge de
`fecho` deveria viver dentro do `verify.yml` — como passo do job `verify`
existente (redação original da spec) ou como job próprio.

## Decisão

1. O check pré-merge que cobra P16.a vive em **job próprio `fecho`** em
   `.github/workflows/verify.yml`, sem `needs:` e sem `if:`, checkout raso, um
   único passo (`python .claude/verify/check_fecho.py --pr`). Fora de PR contra
   `develop`, ou em PR fora da população vigiada, o job roda e passa com
   `NÃO JULGADO (<motivo>)` — nunca é pulado em silêncio.
2. A cobrança de P16.b (o `visual` executar de fato) e do próprio `fecho`
   **vive na proteção de branch do GitHub** em `develop`, fora deste
   repositório: o proprietário configura três checks obrigatórios —
   `verify`, `visual`, `fecho` — mais *require branches to be up to date* (P2).
   O estado dessa proteção deixa de ser rito manual não verificável e passa a
   ser **dado auditado**: a seção `branch-protection` do
   `compliance-audit.sh` lê a API do GitHub e compara contra
   `.claude/verify/branch_protection.json → checks_obrigatorios`
   (gate `D016-PROT1`).

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| **R-b1** — retirar o `[DEFER]`, instalar Chromium e rodar as 4 campanhas de mutação dentro do job `verify` em todo PR | Custo medido pelo `build-engineer` (`medicoes-fase0.md` §Medição 1, mesmo script e commit, com/sem Chromium): instalação **28–35 s**, campanhas com Chromium **42m36s–55m28s** — duas ordens de grandeza de diferença por PR. Descartada no portão P1. |
| **R-b2** — o `visual` publica um recibo `{harness, head_sha, veredito}`; um terceiro job `reconcile` (`needs: [verify, visual]`, `if: always()`) reprova promessa sem recibo do mesmo SHA | Introduz vocabulário e infraestrutura próprios (recibo, "deferimento vencido"), três jobs calibrados, e o red só se prova rodando no PR — complexidade desproporcional a uma promessa que, sob R-b1, deixaria de existir. Reserva não acionada; descartada no portão P1. |
| **Passo do `fecho` dentro do job `verify` existente** (redação original da `spec.md`, antes de E1) | Um `verify` vermelho durante **toda a demanda**, do primeiro commit até o `done`, ensina que vermelho ali é normal — e vermelho normal deixa de ser lido. É o mesmo mecanismo do achado histórico **E5** (`.claude/rules/pins.md`: o MANIFEST sempre vermelho, por isso nunca regenerado, nunca rodado). Um check `fecho` **próprio**, vermelho, diz algo verdadeiro e útil ("a demanda ainda não fechou") sem contaminar o que o `verify` significa ("o código está são"). Superada pela decisão explícita do usuário no portão da Fase 1 (errata E1); custo aceito: entre a abertura do PR e o commit do `done`, o check `fecho` fica vermelho por desenho, com nome (borda 6). |

## Consequências

**Fica mais fácil**: distinguir, só pelo nome do check que está vermelho,
"a demanda não fechou" (`fecho`, esperado até o `done`) de "o código quebrou"
(`verify`, sempre anômalo); auditar se a proteção de `develop` está de fato
configurada, em vez de confiar em memória ou prosa (`D016-PROT1` compara contra
`branch_protection.json` a cada rodada do `compliance-audit`).

**Fica mais difícil**: reverter esta decisão sem sair do repositório. Remover
qualquer um dos três checks obrigatórios (ou os três) exige o proprietário
reconfigurar o *ruleset*/proteção clássica no painel do GitHub — uma ação que
não gera diff, não passa por PR e não é revisável pelo mesmo processo que
governa o resto do repositório. Enquanto essa configuração não é feita (medido
nesta validação, 2026-09-04: `develop` **DESPROTEGIDA**, faltam os três
contextos), o gate central desta demanda permanece vermelho ao vivo por
desenho — o próprio ato de fechar o círculo é um evento único, fora da máquina
de commits.

**Passa a ser proibido**: um check pré-merge de demanda viver como passo dentro
do job `verify` (conflataria os dois sinais que esta decisão separa); cobrar a
execução de uma promessa do CI (P16.b) por rito/prosa em vez de por
`branch_protection.json` auditado.

**Gates/regras que materializam**: job `fecho` em `verify.yml`;
`check_branch_protection.py` + seção `branch-protection` do
`compliance-audit.sh` (`D016-PROT1`); `.claude/verify/branch_protection.json →
checks_obrigatorios: ["verify","visual","fecho"]`; mutante do terceiro
contexto (`D016-M17`, sonda `sem_fecho` → `DESPROTEGIDA`).
