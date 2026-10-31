---
name: vermelho-de-controle-sem-nota-no-stage
description: Quando o stage `mutation` do CI fica vermelho com N `NÃO EXECUTADO · baseline do gate nu VERMELHO`, a razão está na linha `CONTROLE … resultado: FALHOU · <nota>` do harness, que check_mutation.py NÃO ecoa (só tail-2 + blocos de estado); reproduza em clone efêmero em refs/pull/N/merge (o CI faz checkout do merge sintético, não do head) com origin/develop pinado, e simule o C0 vermelho apagando a ref só no clone
metadata:
  type: feedback
---

Diagnóstico da 016 (2026-09-04, run 33927191969): mesma campanha `d016`, mesmo
commit, `verify` PASS e `visual` `1 problema`. O `1 problema` era o exit 1 do
harness com 13 `NÃO EXECUTADO · baseline do gate nu VERMELHO` (M18–M28, M32,
M33) — ou seja, o controle `C0-fecho` falhou. A NOTA do controle (sonda x/35,
problemas, censo, exit, `origin/develop ?`) foi impressa pelo harness e
descartada pelo stage: `mut_ler` só casa `DETECTADO|SOBREVIVENTE|NÃO EXECUTADO`
e o `tail` de 2 linhas pega as duas últimas entradas da lista de fecho, não a
linha `CAMPANHA NÃO CONCLUÍDA … controles: 1 ok · 2 falho(s)`.

Três coisas que só a medição mostrou:
- **O CI não roda no head do PR**: `actions/checkout` em `pull_request` faz
  checkout de `refs/pull/N/merge` (merge sintético `Merge <head> into <base>`);
  a data de T4 e o `merge-base` vêm dele. Clone efêmero: `git fetch origin
  +refs/pull/N/merge:refs/remotes/pull/N/merge` e `checkout --detach` nesse SHA.
- **Timestamps do log do GitHub são hora de flush**: check_mutation.py sai em
  bloco (pipe), então todas as linhas do stage têm o timestamp do exit — não
  servem para medir duração de nada dentro do stage.
- **`julgaSonda` não pina isolamento** (só `julgaArvore` pina): 20 KILL de
  mutantes de sonda não provam que a sonda estava verde na árvore limpa; quem
  prova é o C0, e se o C0 caiu, os 20 KILL não localizam a falha (sonda × vivo).
  Medido no clone: `F99.json` extra ⇒ sonda `ok=False` por guarda, C0-fecho
  FALHOU, e M1 sai DETECTADO mesmo assim. Nesse caso a nota do C0 imprime
  `undefined demanda(s) · undefined problema(s)` (vivo null) — qualquer eco da
  nota tem de cobrir as duas metades (sonda: `falhas`/`guarda`; vivo:
  `problemas`/`globais`/`erro_de_leitura`/`censo`) e o stderr quando não há JSON.

**Why:** R2 §3 — falha exige causa antes de conclusão; aqui a causa era
inobservável por construção do relato, e as quatro hipóteses óbvias (ambiente /
população / árvore / ordem) caíram todas por medição: `requires` sem chromium,
`[RUN]` só da d016 nos dois jobs, guarda de porcelain do próprio stage passou, e
todas as suítes anteriores verdes.

**How to apply:** ao ver esse vermelho, (1) não atribua ao ambiente sem ler a
linha `[RUN]`/`[DEFER]` de cada job; (2) reproduza o gate nu no clone efêmero
do merge sintético — se verde, a divergência é de runtime e o próximo passo é
re-run do job (desde `6678d31` o stage JÁ ecoa as linhas `CONTROLE` — E016-7);
(3) para ver a cara que o log teria sob um C0 vermelho, quatro formas em
clone efêmero, cada uma numa metade distinta: fixture extra em
`fixtures_016/fecho/` (SONDA, `vivo: null`), `update-ref -d
refs/remotes/origin/develop` (ÁRVORE, global `origin-develop-ausente`),
`check_fecho.py` quebrado (JSON ausente — a nota tem de trazer exit + stderr),
`origin/develop` movido para `6dad53d` (ÁRVORE, `piso-invalido`; atenção: move
também o merge-base do stage e torna mais campanhas devidas). Rode o harness
com `D016_MUT_ONLY=D016-M18` (segundos) e o stage inteiro só com a fixture
extra COMMITADA no clone (árvore limpa). Ver
[[core-colapsa-crash-em-sobrevivente]], [[red-ao-vivo-exige-remoto]],
[[clone-efemero-para-refs-remotas]] e [[deducao-nao-e-leitura-no-log-do-ci]].
