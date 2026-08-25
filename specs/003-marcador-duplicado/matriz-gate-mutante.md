# Matriz gate ↔ mutante — 003-marcador-duplicado

> Fase 6 (validate) · executor: qa-engineer · modalidade manual autorizada pela
> spec (§Fora de escopo: harness formal de mutação é Onda 3 — KI-2).
> Execução em cópia efêmera (`git worktree add --detach`), árvore principal
> intacta antes×depois.

| Mutante | Gate que o mata | Operação | Resultado |
|---|---|---|---|
| **M1** — reintroduzir `+ "\n/* V32_UI_END */\n"` na string `inject` do `build_v32_html.py` (entre `V32_P52_WORKSPACE_END` e `anchor` — o inverso exato do fix de `ea83d82`) | stage `marker-lint` · `.claude/verify/check_markers.py` | worktree efêmera em `Temp/qs-m1` (detached em `6bfbbb4`) → mutação aplicada (1 linha, diff `1 insertion(+), 1 deletion(-)`) → rebuild `build_v32_html.py` → `check_markers.py` sobre o artefato mutado | **MORTO** (FAIL, exit 1) |

## Saída literal do kill (2026-08-25)

Rebuild com o builder mutado concluiu (`build ok`, engine sha256 `9a4a2e674389a115…`
inalterado); `V32_UI_END` voltou a 2 ocorrências no HTML efêmero. Lint:

```text
$ python .claude/verify/check_markers.py
[FAIL] marcador V32_UI_END: 2 ocorrência(s), esperado 1
----
marker-lint: 34 marcadores distintos · 1 problema(s)
exit=1
```

O gate rearmado (KI-1 removida) tem, portanto, **poder discriminante provado**:
acusa exatamente o defeito que a demanda corrigiu, sem exceção nominal que o
silencie.

## Reversão provada

```text
$ git worktree remove --force "C:/Users/Thiago/AppData/Local/Temp/qs-m1"
$ ls .../Temp/qs-m1           → No such file or directory
$ git status --porcelain      → (vazio)
$ git rev-parse HEAD          → 6bfbbb4efa9ebd10370551dd7afb008e7016570b
```

A mutação nunca tocou a árvore principal (cópia efêmera destruída; working tree
limpa; HEAD inalterado).

## Referência cruzada

- G1 (red natural) reproduzido nesta fase contra os blobs de `214d3e4`
  (HTML 2×, `known_issues.json` sem KI-1): mesmo FAIL, exit 1 — o red commitado
  é reprodutível, não só narrado.
- G2 (green) no HEAD: `marker-lint: 34 marcadores distintos · 0 problema(s)`,
  exit 0; `grep -c "V32_UI_END"` no HTML publicado = 1 (linha 6270).
