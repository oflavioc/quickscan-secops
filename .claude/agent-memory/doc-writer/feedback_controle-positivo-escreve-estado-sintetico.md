---
name: controle-positivo-escreve-estado-sintetico
description: Log de campanha de mutação (modo ARVORE) pode imprimir dado que parece estado real (válvula, prazo, id de demanda) — conferir no harness se é controle escrevendo e restaurando, antes de tratar como pendência real
metadata:
  type: feedback
---

Uma linha de log de campanha `tests_0NN_mutants.js` que cita um artefato real
do repositório (ex.: `.claude/project-memory/planning-state/<slug>.json`) com
um valor que parece urgente (prazo == data de hoje, id de demanda real) pode
ser **o controle positivo escrevendo e restaurando** — não o estado real da
árvore.

**Why:** no fecho do `EA-38` (2026-09-05), o log do run `33952207595` trazia
`controle: D016-M24/positivo · … 015-superficies-de-apoio: FECHO PENDENTE
DECLARADO · … prazo 2026-09-05` — prazo == hoje, no dia exato do fechamento.
O orquestrador pediu para confirmar antes de registrar como nota inofensiva.
Ler `tests_016_mutants.js:513-516` mostrou que o par `D016-M24/positivo`
(modo `ARVORE`) escreve `valvulaApos(BRANCH_015, id, ctx => ctx.dataCommit)`
no arquivo mutável `F.ps015`, onde `dataCommit = git log -1 --format=%cI
HEAD` (a data do commit julgado, não uma configuração fixa) — e o harness
**restaura os bytes originais** (`BASE_BYTES`) ao fim da campanha. O arquivo
real do planning-state de 015, lido em HEAD, não tem campo de válvula/prazo
nenhum (fase `"done"`). Sem essa checagem, uma nota "é só o controle"
poderia ter escondido uma válvula de verdade vencendo no mesmo dia — ou,
pior, uma válvula sintética poderia ter sido registrada como achado real.

**How to apply:** quando um log de campanha citar um artefato versionado com
um valor específico (prazo, id, contagem), antes de classificar como
"controle" ou "achado": (1) achar o par no harness pelo id impresso
(`grep -n "<id>" tests_0NN_mutants.js`); (2) ler `modo` (ARVORE = edita e
restaura arquivo real; SONDA_* = não toca a árvore) e a função geradora do
valor (constante fixa vs. `ctx.dataCommit`/derivado do ambiente); (3) ler o
arquivo real em HEAD e confirmar que o campo citado **não existe** fora da
execução do controle. Só então registrar "é o desenho do controle,
confirmado no fonte" — nunca por inferência do nome do par. Ver
[[status-do-achado-contra-o-fonte]] (mesma disciplina: conferir no fonte,
não no texto do log/relatório).
