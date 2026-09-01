---
name: compliance-audit-fora-do-pipeline
description: compliance-audit.sh NÃO é stage do pipeline.yaml — só o CI (verify.yml) o roda; `run.sh --light` verde não diz nada sobre ele, e mudança nele se mede invocando o script à mão
metadata:
  type: project
---

`.claude/verify/compliance-audit.sh` **não aparece em `pipeline.yaml` nem em
`run.sh`** (medido 2026-09-01: `grep -c compliance .claude/verify/run.sh` → `0`).
O único lugar que o executa é `.github/workflows/verify.yml:44`, como passo próprio
do job `verify`.

**Why:** ele audita a *configuração agêntica* (hooks, deny, invariantes, exceções,
waivers, backlog), não artefatos — por isso nasceu fora do `run.sh`, que verifica
artefatos. A consequência é assimétrica e fácil de errar: `run.sh --light`
**11 PASS · 0 FAIL continua verde** com o auditor completamente quebrado, e o
`post-turn-verify` (que usa `--light`) também não o alcança. Quem mexe nele e mede
só o pipeline não mediu nada.

**How to apply:** ao tocar `compliance-audit.sh`, a evidência é `bash
.claude/verify/compliance-audit.sh` (total) **e** `--rule=<seção>` (isolada), com os
dois números antes/depois — nunca o `run.sh`. Rodar o pipeline mesmo assim, mas
como não-regressão, não como prova da mudança. Tensão registrada com R10 §9
("checagem nova entra no pipeline.yaml"): checagem nova *dentro* deste script fica
fora do pipeline local por herança de desenho — se alguém quiser fechar isso, é
decisão de stage novo (desc/parallel/mutates/heavy), não conserto de passagem.

Duas fontes de exceção nominal convivem na casa: `known_issues.json` (`issues[]`,
id `KI-N`) e `regra_morta.json` (`exclusoes[]`, identidade pelo par
harness×mutante). Ver [[stage-build-contra-head]] para o efeito colateral de editar
este script sem commitar: ele é pinado, e `baseline` fica **verde** mesmo assim.
