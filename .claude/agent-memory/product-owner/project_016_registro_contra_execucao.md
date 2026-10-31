---
name: refinamento-016-registro-contra-execucao
description: Demanda 016 (EA-33 + borda 8, 2026-09-04) — recomendei retirar o DEFER; o portão escolheu proteção de branch auditada (D016-PROT1) e job próprio `fecho`; aceite de intenção gravado em 2026-09-04 (não encontrei objeção, CONDICIONADO a P2 + flips no CI + iteração 2 do spec-validate)
metadata:
  type: project
---

Refinamento escrito em 2026-09-04 (`specs/016-registro-contra-execucao/refinement.md`,
worktree `phase5-014`). Propriedade enunciada: **P16 — o merge é o vencimento de
toda promessa feita à verificação** (P16.a demanda × git; P16.b campanha ×
execução). Não é INV-11: processo (R4/R14/R10 §2), âncora em `sdd.md`, fora de
`invariants.json`.

Fatos que decidiram o desenho e que não estão escritos em lugar óbvio:

1. **O credor é a proteção de branch, fora do repositório.** Nenhum gate obriga o
   merge a esperar; sem check obrigatório tudo é conselho (o merge da 013 veio 65 s
   depois do job visual). Perguntar ao proprietário se existe é a P2 — e auditar
   por `gh api` pode exigir permissão que o `GITHUB_TOKEN` não tem.
2. **Check pré-merge que exija `done` NÃO pode morar em `run.sh`**: a `new-demand`
   (`SKILL.md:66`) diz "done só com PR aberto e CI verde" e o QA precisa do
   pipeline verde para escrever o spec-validate que precede o done — impasse. O
   check vive em job/check de PR; `done` passa a ser "Fase 6 completa + PR aberto".
3. **Pós-merge o gatilho da campanha fica cego** (diff vazio no push da develop —
   dívida na matriz): a execução do PR é a única que existirá. Por isso o
   vencimento é o merge, não `done` nem prazo em dias.
4. **`check_suites.py:25` só executa `suites`/`heavy`**; o bloco `visual` é censo
   (`:49`). Pôr Chromium no job `verify` acrescenta só as campanhas, não as suítes.
   Por isso recomendei **R-b1: retirar o deferimento** — refutado por medição
   (item 9).
5. **Duas espécies de deferimento**: o `[DEFER]` do CI (máquina→máquina) e o
   "DEFERIDO AO RITO DO PROPRIETÁRIO" da matriz (`D011-M9`, humano como credor).
   A 016 alcança só a primeira.
6. **`done ⇒ artefatos em disco` nasce vermelho em três**: 003, 009, 010 —
   exclusão nominal impressa com fonte (R13), não escrita retroativa.
7. **Oráculo offline de "branch mesclada"**: mensagem `Merge pull request #N from
   …/feature/NNN-*` (primário, 37/39 e 100% das demandas) + ancestralidade do
   `red.commit` (secundário); `pr_url` não serve (o da 003 aponta para outro repo).
8. **Squash não é "não determinável"**: o gate não distingue "não mesclada" de
   "mesclada por squash" — os dois calam os dois oráculos. A spec resolveu como
   `EM VOO` + recomendação de `allowed_merge_methods: ["merge"]` no ruleset (não
   julgado por PROT1, C6 f). Meu refinement dizia "nunca verde" — estava errado
   para esse caso; a única defesa é configuração.

9. **O que o portão decidiu diferente do que eu recomendei** (2026-09-04): a rota
   da borda 8 foi **proteção de branch** (nem R-b1 nem R-b2) — a medição do
   `build-engineer` derrubou R-b1 (campanhas 42–55 min vs 28–35 s de instalação)
   e mostrou que a `develop` não tinha check obrigatório nenhum. O `[DEFER]`
   permanece; o gate central virou `D016-PROT1` (audita a própria proteção). O
   check pré-merge ganhou job próprio `fecho` (E1, decisão do usuário: `verify`
   vermelho a demanda inteira ensinaria que vermelho é normal — `E5`).

10. **Glossário gravado na Fase 5, de novo, apesar de P6 explícito** — e a
    releitura contra o construído achou uma **colisão**: meu `_Evitar_` de
    *Demanda mesclada sem fecho* mandava evitar "demanda em voo", mas a demanda
    construiu `EM VOO` como veredito canônico (T10) para *outro* estado. Corrigido
    na forma UNSET/NONE: `em voo (é OUTRO estado: não mesclada)`.

11. **Aceite de intenção (T081), 2026-09-04 — "não encontrei objeção", condicionado.**
    Gravado em `planning-state → validate.aceite_po` com as seis respostas. O que
    eu achei e o relato do orquestrador não trazia: (a) o vermelho de PROT1 vive
    no `compliance-audit`, que roda no job **`verify`** (`verify.yml:43-44`) — o
    `verify` do PR fica vermelho até P2 apesar de E1 (custo de nascimento, uma vez;
    não contradiz E1, que trata do vermelho recorrente); (b) a regra operacional
    "commit por caminho nominal com delegação ativa" ficou **só na trilha da
    demanda** — nem `orchestration.md` nem a skill a carregam: prosa não vigia,
    pedi a linha em §Anti-patterns + achado para hook; (c) `spec-validate.md`
    continuava na **iteração 1 (95%)** enquanto o estado dizia "gaps fechados" —
    registro atrás da execução, a família da própria demanda; virou condição.
    Ratifiquei a recusa do `data-engineer` (chave irmã fora por spec; schema sem
    leitor = promessa sem credor) e a dívida "leitor perde posteriores" (carrasco
    na campanha por path; candidata: pinar o SHA do merge da 016 como segunda
    âncora, pós-merge). Condição dura: **P2 antes do merge** — sem ela o merge da
    016 seria uma promessa não cobrada, a demanda violando P16 ao entrar.

**Why:** cinco demandas mescladas antes do `done` sob delegação custaram um dia de
fecho retroativo. A lição do item 11 é que, sob delegação, o aceite do PO é o
único ponto em que alguém confere se o **registro da Fase 6** (spec-validate,
trilha, regra nova) acompanhou o que a execução já fez.

**How to apply:** no fecho da 016, cobrar as cinco condições de `aceite_po` antes
de qualquer `done`; a errata C6 (julgar `allowed_merge_methods`) é candidata que
eu levaria ao usuário na próxima demanda de processo. Ver
[[fecho-retroativo-da-013]], [[checklist-de-fase-6-do-po]] e
[[gate-verde-nao-e-protecao]].
