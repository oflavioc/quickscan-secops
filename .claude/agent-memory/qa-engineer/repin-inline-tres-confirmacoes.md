---
name: repin-inline-tres-confirmacoes
description: Repin inline em suíte selada (R8 §2) — as três confirmações antes de escrever (a entrada é só identidade? a boundary é dado, não prosa; qual forma de trilha já está no arquivo), o mapa FROZEN_VISUAL_AUTHORITY que já fora repinado SEM trilha na 5.1, o registry regenerado por outrem como testemunha independente do valor, e `run.sh --light` que pula `suites`
metadata:
  type: project
---

Rito executado em 2026-09-05 (fecho da 016, EA-38): `P50-COR4` reprovou
`playwright.config.js alterado (3eacc465… != 9661deed…)` porque a correção
do EA-38 (`captureGitInfo: { commit: false, diff: false }`) tocou um arquivo
que o mapa `FROZEN_VISUAL_AUTHORITY` de `tests_p50_core.js` pina por hash
inline. O gate fez o trabalho dele; o remédio é o repin com trilha, nunca
reverter a correção nem tirar a entrada.

**As três confirmações, com o instrumento de cada uma:**

1. *É só identidade?* `grep -n "<arquivo>" <suíte>` tem de devolver só a
   linha do mapa; leia QUAL alínea do gate itera o mapa (em `P50-COR4` só a
   (a); (b)-(e) leem outros arquivos). Depois `grep -rn "<arquivo>\|<hash>"
   --include=*.js .` (fora `node_modules`) para achar um segundo pin em outra
   suíte — não havia; só comentários de `resolveBrowser` e o `require` de
   `RESOLVED_BROWSER` em `tests_visual/fixtures.js`. Confira também que o
   diff não moveu a "autoridade" que o pin guarda (no config: `BP`,
   `launchOptions`, `RESOLVED_BROWSER`, `projects`, reporter).
2. *A suíte é editável?* R6 diz "boundary é dado, não prosa": olhe
   `boundary.json` (4 classes), `permissions.deny` e `guard-boundary.sh` (só
   bloqueia paths do manifesto). `tests_p50_core.js` não está em nenhum; quem
   a protege é `pins.json` (rito: `gen_pins.py` no mesmo PR). A prosa que
   parece colidir — R6 §4 "freeze acumulativo" e a §29.4 "todas as suítes
   congeladas" — está resolvida por `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`
   Disposição §2 e pelo EA-1 (resolvido): o freeze parte do estado REAL pinado.
   R8 §2 nomeia `P50-GOV1` (deste arquivo) como exemplo do rito, e a suíte
   tem seis repins inline sob a estrutura nova (009 ×3, 010 ×2, 015).
3. *Qual forma?* Duas coexistem no arquivo: a curta `[Onda-0 · data] REPIN
   autorizado (…): motivo. Identidade anterior: <hash>` (N47 e as entradas
   Onda-0/Onda-4) e a longa `DEMANDA NNN · slug · REPIN (motivo, data)` +
   `ISTO É ASSERÇÃO DE PIN, NÃO DE COMPORTAMENTO` + `MOTIVO` + `CONFERIDO
   ANTES DE REPINAR` + `Identidade anterior: <64 hex>` como última linha
   (009/010/015, as mais recentes). Bloco imediatamente acima da entrada,
   dentro do literal do objeto. Escolhi a longa: é a do mapa que a R8 §2
   cita e carrega a distinção pin × comportamento, que é a pergunta 1.

**Armadilhas que só a medição pegou:**

- "Primeiro repin deste mapa" era FALSO: `git log -S<hash> -- <suíte>` por
  entrada e `git log -L<linhas>:<suíte>` no bloco mostraram que
  `tests_visual/screen.spec.js` foi repinado em `4aa1f12` (selagem 5.1) sem
  trilha — processo antigo, R13. A trilha diz "primeiro COM trilha" e nomeia
  o anterior. Nunca afirme "primeiro" sem `-S` em todas as entradas.
- "CONFERIDO ANTES DE REPINAR" é medir TODAS as entradas do mapa contra
  disco, `git show HEAD:` e `pins.json → files` numa tabela; só a divergente
  é repinada (repinar por simetria é repin sem motivo — precedente 015).
- Separação de poderes (o "desvio de dono" registrado em `351de95`): quem
  valida o gate não deveria produzir o hash que ele consome. Mitigação que
  vale registrar na trilha: o valor NÃO nasce no repin — é copiado do
  registry regenerado por outro agente (`8ec429a`), e as três fontes têm de
  concordar. Se o registry ainda não foi regenerado, o repin inline não tem
  testemunha independente: peça o `gen_pins` antes, ou declare.
- `bash .claude/verify/run.sh --light` **pula `suites`, `suites-heavy`,
  `mutation` e `evidence-bridge`** — "light verde" (12 PASS) não prova
  contagem alguma. O veredito canônico do repin é `check_suites.py`
  (`--stage=suites`), que lê o DISCO (`subprocess.run(cmd, shell=True)` na
  raiz); o `baseline` lê HEAD e por isso continua verde com a edição não
  commitada — e ficará VERMELHO depois do commit até o `gen_pins.py` (R8 §1).
- Arquivo de tooling pinado por gate de produto: o cabeçalho do mapa diz
  "arquivos que a §29.4 declara protegidos", mas a §29.4 (`:1613-1620`) não
  nomeia `playwright.config.js`. A inclusão tem desenho (viewports e
  resolução de browser parametrizam V4+V5), então não é "lista errada" — mas
  toda mudança só-de-tooling nesse arquivo custará um repin inline em suíte
  selada. Reporte como observação com a cadeia, não como conserto.
  *Desfecho:* virou o achado EA-40 e foi fechado em 2026-09-05 por fix-finding
  (rota 1: só a justificativa do cabeçalho mudou — agora diz "os da §29.4 e
  `playwright.config.js`, que a §29.4 NÃO nomeia, pinado desde a 5.0.5 §7.11";
  lista e hashes intactos; a trilha do EA-38 desceu para `:2740-2771`). Rito e
  provas em [[doc-only-em-suite-pinada]].

**Why:** R10 §1 — o gate acusou uma mudança real numa superfície que guarda;
enfraquecê-lo, removê-lo da lista ou reverter a correção provada (o primeiro
`pull_request` com `visual` verde) seriam as três saídas erradas. E R2 §4:
cada frase da trilha é uma alegação checável — a única que eu não medi antes
de escrever ("primeiro repin") era falsa.

**How to apply:** ao receber "gate X reprovou por hash inline depois de
mudança legítima": reproduza o vermelho, faça as três confirmações com os
instrumentos acima, meça a tabela completa do mapa, escreva a trilha na forma
mais recente do arquivo com só o que foi medido, e feche com a suíte (64/0) E
o stage `suites`, não com o `--light`. Ver [[baseline-so-ve-o-commit]],
[[fortalecimento-ratificado-exige-errata]], [[trilha-e-ambiente-quickscan]].
