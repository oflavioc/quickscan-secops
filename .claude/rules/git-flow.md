# R14 — Git flow

Severidade: **processo**. Gitflow completo, confirmado pelo usuário em 2026-08-25.

## Modelo

| Branch | Papel |
|---|---|
| `main` | **Só estados selados/auditados.** Recebe código exclusivamente via release da selagem (`develop → main`, sob pedido explícito), com **tag anotada** carregando os hashes do registro de aceitação. Nunca commit direto. A main é o baseline congelado navegável. |
| `develop` | **Integração da fase em curso.** O CI builda e verifica daqui. |
| `feature/NNN-slug` | **Uma por demanda/onda.** Nasce de `develop` atualizada, volta por **PR**. `NNN-slug` casa com `specs/NNN-slug/` quando há spec. |

```
main ────●───────────────────────●────  selados/auditados · tag por selagem
          \                     ↗ release (selagem, sob pedido)
develop ───●───●───●───●──────●───────  fase em curso · CI daqui
            \       ↗ PR
feature/NNN ─●─────                     uma por demanda · worktree se simultânea
```

## Regras de commit e merge

- **1 microfase/errata = 1 commit próprio**; commit de selagem é doc-only e
  separado da candidata; **proibido squash** em branch de fase (E3: selagem
  squashed é inauditável).
- **O commit RED do TDD entra no histórico** e é referenciado no PR (R3).
- Alterou arquivo pinado → `gen_pins.py` **no mesmo PR** (R8).
- Merge do PR é **do usuário**, no GitHub. Push de `feature/*` e abertura de PR
  são livres.
- Release `develop → main` **só quando o usuário pedir** ("release", "selar",
  "promover"), nunca automático.

## Worktrees — conversas/demandas simultâneas

Branch isola o **histórico**, não o **disco**. Uma conversa por pasta → só branch.
Duas ou mais simultâneas → uma worktree por demanda:

```bash
git worktree add ../<repo>-NNN feature/NNN-slug
git worktree remove ../<repo>-NNN     # ao terminar
```

O pipeline usa worktrees **efêmeras** para suítes que precisem de árvore
descartável. `.claude/worktrees/` é ignorado pelo git.

## Autonomia

| Ação | Autonomia |
|---|---|
| Criar/trocar branch, criar worktree, push de `feature/*`, abrir PR | **Livre** |
| Merge de PR em `develop` | **Do usuário** |
| Release `develop → main` + tag | **Pedido explícito do usuário** |
| Commit direto em `main`/`develop` | **Não** (exceção única: consertar a própria criação da develop) |
