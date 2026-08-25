# Baseline de `P52-PR1` / `P52-ACC1` — RED e GREEN

## Defeito (resolução pelo `HEAD` móvel)

`baselineFile()` lia `git show HEAD:quickscan_secops_soccmm_v3_2_dev.html`. `HEAD` é móvel: com a
v3.2.1 publicada e o merge no branch, passou a carregar o HTML da release e não o da entrada da
Phase 5.2.

| | SHA-256 | bytes |
|---|---|---|
| obtido de `HEAD` (v3.2.1) | `fb906462484ff3d32e4442314869aee3511ce52d2944c32a3330f13821f79a79` | 963.373 |
| esperado (entrada da Phase 5.2) | `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9` | 744.179 |

## RED — candidata v3.2.2 (antes da correção)

```
FAIL  P52-PR1  — isolamento de print [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
FAIL  P52-ACC1 — acessibilidade automatizada das superfícies novas [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
P52 CHROMIUM (Phase 5.2): 0 PASS · 2 FAIL de 2   (exit 1)
```

## RED — release v3.2.1 PUBLICADA, worktree limpo da própria tag

`git worktree add --detach <tmp> v3.2.1` · `HEAD` do worktree
`07bc90b3fbf6f033a56c490f3bff1951c58316b7` · HTML `fb906462…` · harness da própria release:

```
FAIL  P52-PR1  — isolamento de print [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
FAIL  P52-ACC1 — acessibilidade automatizada das superfícies novas [baseline indisponível: baseline em HEAD com SHA fb906462484ff3d3]
P52 CHROMIUM (Phase 5.2): 0 PASS · 2 FAIL de 2
```

Prova de que o defeito é do HARNESS e PRÉ-EXISTENTE — não foi introduzido pelo patch v3.2.2.
O worktree foi removido (`git worktree remove --force` + `git worktree prune`).

## Baseline normativo consumido após a correção

- commit: `d3886812718e7ad9c5024880067133fbddf2fc4d`
- caminho: `quickscan_secops_soccmm_v3_2_dev.html`
- SHA-256: `12bb950f58f203c56cf6621973663be1ac71b4e026d618a910ebb0f3eebbf9d9`
- bytes: `744179`

Verificado por SHA-256 **e** por tamanho antes do uso; falha fechada, com diagnóstico que nomeia o
observado e o esperado; sem rede, sem branch, sem tag móvel, sem working tree, sem `HEAD`.

## GREEN

```
PASS  P52-PR1  — print isolado: workspace fora do papel, nenhuma seção perdida, fatos do anexo intactos e proibições da REV B respeitadas
PASS  P52-ACC1 — zero critical/serious de axe nas superfícies novas e zero NOVO problema de contraste na tela
```

Execução integral: nenhum SKIP, nenhum bypass, nenhum downgrade para aviso, nenhum controle
positivo removido.

## Não vacuidade (mutantes)

| mutante | mutação | detectado por | motivo |
|---|---|---|---|
| `V322-M13` | commit imutável → commit da v3.2.1 (`HEAD`) | `P52-PR1` | `baseline … com 963373 bytes; esperado 744179` |
| `V322-M14` | um dígito do SHA-256 esperado | `P52-ACC1` | `identidade do baseline diverge … observado 12bb950f…, esperado 12bb950f…d8` |

Ambos rejeitados **antes** de qualquer comparação entre produto e baseline.
