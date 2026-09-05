# Sujeito da campanha `ea41` — fixture de `tests_ea41_mutants.js`

Arquivo rastreado sob `* text=auto eol=lf` (`.gitattributes`): texto LF puro,
UTF-8, sem byte NUL e sem CR. É o ÚNICO arquivo que a campanha `ea41` muta e
restaura — no worktree (`EA41-M1` e o controle negativo) e no blob do ÍNDICE
(`EA41-M2` e `EA41-M3`, por `git hash-object -w --no-filters` +
`git update-index --cacheinfo`). Nenhum gate depende do conteúdo dele: existe
para ser o sujeito acusado por `check_eol_text.py` (stage `eol-text`), e só
ele — a campanha assere o isolamento (nenhum outro arquivo acusado) a cada kill.

Âncora de `EA41-M1` e `EA41-M3` (exatamente UMA ocorrência neste arquivo; o
mutante troca cada escape de seis caracteres pelo byte 0x00 — o EA-41 em
miniatura, `.claude/BACKLOG.md` antes da correção `c994fc0`):

    chave = ctxChave(d) + "\u0000" + d.seletor + "\u0000" + d.prop

Se um `[FAIL] EA41-EOL1` nomear este arquivo FORA de uma campanha em curso, uma
campanha anterior morreu sem restaurar. Remédio, por caminho nominal:
`git restore --staged .claude/verify/fixtures_ea41/sujeito.md` devolve o índice
(M2/M3); `git checkout -- .claude/verify/fixtures_ea41/sujeito.md` devolve o
worktree (M1/negativo). Não edite a linha da âncora: o preflight da campanha
(`node tests_ea41_mutants.js --preflight`) exige `ocorrencias == 1`.
