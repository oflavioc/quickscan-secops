---
name: estado-congelado-fora-da-window
description: MAP, PRODUCTS, QS e ans são const de topo de script no HTML congelado — não existem em window; só window.eval os alcança
metadata:
  type: project
---

Medido em 2026-08-30 sobre `quickscan_secops_soccmm_v3_2_dev.html` em jsdom:
`typeof w.MAP === "undefined"` e `w.eval("typeof MAP") === "object"`. Vale
igualmente para `PRODUCTS`, `QS` e `ans`. São `const` de topo de script clássico:
vivem no registro declarativo global, que não é `window`.

Consequência prática: a restrição escrita em `tasks.md` da 010 para o gate
`D010-CARD4` — "deriva as 11 chaves de `w.MAP`" — **não é executável como
escrita**. O caminho real é `window.eval`, que é leitura e precisa ficar isolado
num helper único (em `fixtures_010_vao.js` é `d010Eval` / `d010MapKeys`), com
falha alta se o `typeof` não for `object`.

Censo medido pelo eval: **11 chaves distintas de `c.p`** — FortiAI-Assist,
FortiAnalyzer, FortiEndpoint, FortiGuard-MDR-Service, FortiGuard-Service-Bundle,
FortiNDR, FortiRecon, FortiSIEM, FortiSOAR, FortiXDR, SOCaaS.

**Why:** a restrição que viaja no prompt tem o peso de contrato, e esta cita uma
ponte que não existe. Quem aceitar sem executar escreve um gate que lê
`undefined` e passa vacuoso — ou perde uma rodada procurando um bridge novo, que
R-3 proíbe criar.

**How to apply:** antes de escrever oráculo que consome estado do HTML congelado,
confirme `typeof w.<nome>` **e** `w.eval("typeof <nome>")`. Se a restrição do
prompt divergir da execução, vale a execução e a divergência volta nomeada —
nunca se inventa bridge para fazer a restrição virar verdade. Ver
[[cenario-sem-mutante-e-cenario-nao-medido]] para o outro modo de o gate nascer
vazio.
