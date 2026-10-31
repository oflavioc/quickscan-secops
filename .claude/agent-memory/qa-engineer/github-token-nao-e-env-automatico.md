---
name: github-token-nao-e-env-automatico
description: Gate cuja cadeia de token começa em GITHUB_TOKEN roda ANÔNIMO no CI se o passo não exportar `env: GITHUB_TOKEN: ${{ github.token }}`; a leitura pública funciona e esconde a falta (limite 60/h por IP)
metadata:
  type: project
---

`GITHUB_TOKEN` não é variável de ambiente automática do GitHub Actions: só
existe num `run:` se o passo (ou o job) a exportar. `gh auth token` num runner
sem `GH_TOKEN` falha. Logo a cadeia `GITHUB_TOKEN → gh auth token → nenhum` do
`branch_protection.py:_token` termina em `nenhum (anônimo)` no CI enquanto
`verify.yml` não tiver o `env:` no passo do `compliance-audit.sh`.

**Why:** demanda 016, run 33927191969: o ruleset de `develop` foi lido com 200
(repositório público) e o log não denuncia — o audit só imprime `token: …` na
linha de PASS. A medição prometida em §Não mensurável 1 da spec (permissão do
token de Actions em `/rules/branches`) nunca aconteceu, e o CI ficou exposto
ao limite anônimo de 60 chamadas/h por IP compartilhado ⇒ `NÃO DETERMINÁVEL
(permissão 403)` ⇒ `[FAIL]` sem diff. Gap G6 (implementação-divergente) da
iteração 2 do spec-validate.

**How to apply:** ao validar qualquer gate que leia a API do GitHub no CI,
confira no workflow se o passo exporta o token e, no log, a fonte impressa —
"leu com sucesso" não prova "leu com GITHUB_TOKEN". Medição de permissão de
token só vale com `token: GITHUB_TOKEN` impresso no run citado.
