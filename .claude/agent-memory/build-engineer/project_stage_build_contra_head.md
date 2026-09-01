---
name: stage-build-contra-head
description: Rebuild não commitado deixa o stage `build` VERMELHO por desenho (compara contra o blob de HEAD) — a contraprova é sha(árvore) == sha(rebuild efêmero), não mexer no stage
metadata:
  type: project
---

`check_build.py` constrói em diretório efêmero e compara com **`git show HEAD:<artefato>`**.
Logo, quando o proprietário diz "rebuilde mas NÃO commite", o stage `build` fecha
**FAIL** e o `run.sh --light` cai de 10 PASS · 0 FAIL para **9 PASS · 1 FAIL** —
o único FAIL sendo `build`, com a mensagem `rebuild <X>… ≠ publicado em HEAD <Y>…`.

**Why:** o gate mede identidade *publicada*, não identidade *local*; é o que impede
alguém editar o gerado à mão e chamar de build. O vermelho é a ausência do commit,
não divergência de conteúdo. Aconteceu na wave 4 da demanda 011 (2026-08-31), e
volta em toda wave de rebuild em que o commit é do usuário.

**How to apply:** não ajustar o stage, não commitar por conta própria. Publicar a
contraprova de que o vermelho é só o commit faltando:

1. `sha256` do arquivo na árvore == o `<X>` que o stage reporta do rebuild efêmero;
2. `<Y>` == `git show HEAD:<artefato> | sha256` (o estado antigo);
3. rodar o builder 2× para saída em tmp e mostrar o mesmo byte (R7 §3: nunca gravar
   sobre versionado ao provar).

Relatar no contrato como "FAIL esperado, resolve no commit do usuário + repin",
nomeando os pinados que o repin alcança. Ver [[targets-de-trigger-vs-mutados]] para
o padrão irmão: vermelho que é de escopo/estado, não de produto.

## A armadilha inversa: `baseline` também lê HEAD

`check_baseline.py` compara `pins.json` contra **blobs de HEAD**, não contra a
árvore (é o que o torna à prova de CRLF, R8/R2 §2). Consequência prática: editar
um arquivo **pinado** sem commitar deixa o stage `baseline` **VERDE** — medido em
2026-08-31 na 011, `281/281 pins conferem · 0 divergentes` com `verify.yml` e
`mutation_map.json` já modificados na árvore. O vermelho só nasce no commit.

**Como publicar a prova** em vez de dizer "vai divergir": `sha256` do arquivo na
árvore × o pin correspondente em `pins.json → files`, os dois lado a lado. Isso
transforma a obrigação de repin (R8 §1, mesmo PR, commit próprio, motivo) em
número verificável — e evita que um `baseline` verde seja lido como "não precisa
repin".
