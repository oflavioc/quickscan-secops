# Matriz gate ↔ mutante — 007-migracao-evidencia

> Fase 6 (T013) · executor: qa-engineer · modalidade manual autorizada pela spec
> (§Critérios — matriz M1–M6; harness formal de mutação para stage python não
> existe: KI-2/Onda 3). Execução em **worktree efêmera** (`git worktree add
> --detach` em `d82c89d`, Temp da sessão) — exceto a borda 5 de EB-7, executada
> na árvore principal com renomeio temporário e restauração provada. Rede
> bloqueada por proxy inalcançável (`http[s]_proxy=http://127.0.0.1:1`) nos
> mutantes offline, para isolar a parte offline sem SKIP; rede real nos online.
> Árvore principal intacta antes×depois de CADA mutante (`git status
> --porcelain` vazio; nenhuma mutação commitada).

| Mutante | O que foi mutado (diff) | Gate/caso que o mata | FAIL esperado | FAIL obtido (literal) | Exit | Reversão |
|---|---|---|---|---|---|---|
| **M1** | 1º hex do hash de `docs_phase5/evidence_unset/UG-geometry.json` no manifesto: `7e41…` → `0e41…` | EB-1 (parte offline) | FAIL nomeando o arquivo | `EB-1: hash divergente: docs_phase5/evidence_unset/UG-geometry.json (manifesto 0e41b1d8… ≠ blob 7e41b1d8…)` | 1 | `git checkout` · porcelain vazio |
| **M2** | `sha256_pacote` de `evidence-unset`: `1230…d522` → `0230…d522` (asset real íntegro; diff 1 linha) | EB-2/EB-4 (online, rede real) | FAIL por divergência nomeando o pacote | `pacote ADULTERADO: evidence_unset.tar esperado 023097e6… obtido 123097e6…` (demais 3 pacotes: `sha256 confere`) | 1 | idem |
| **M3** | `pacote` de `evidence-unset` → `evidence_unset_inexistente.tar` (asset inexistente; diff 1 linha) | EB-3 (online, 404 real) | FAIL "pacote AUSENTE" | `pacote AUSENTE: evidence_unset_inexistente.tar @ evidence-unset (HTTP 404)` | 1 | idem |
| **M4** | `sha256_pacote` de `evidence-unset` ← hash REAL de `evidence_p51.tar` (`e903d925…`) — conteúdo divergente do registrado, mesmo nome de asset | EB-4 (online, rede real) | FAIL nomeando pacote e ambos os hashes | `pacote ADULTERADO: evidence_unset.tar esperado e903d925… obtido 123097e6…` | 1 | idem |
| **M5a** | no GATE: `warn(texto)` → `pass` (SKIP silencioso; diff 1 linha em `check_evidence_bridge.py`) | caso adversarial EB-5 (local, rede bloqueada) | o caso DEVE reprovar: exit 0 **sem** o WARN nomeado | gate mutado: exit 0 · `0 FAIL · 0 WARN` · **0 ocorrências** de `NÃO EXECUTADO` com 4 pacotes não verificados → caso reprova (referência não-mutada: exit 0 · `0 FAIL · 1 WARN` com os 4 pacotes nomeados) | 0 (o desvio É a detecção) | idem |
| **M5b** | no GATE: `MODO_CI = "GITHUB_ACTIONS" in os.environ` → `MODO_CI = False` (detecção de CI cega) | caso CI-simulado EB-5 (`GITHUB_ACTIONS=1`, rede bloqueada) | o caso DEVE reprovar: exit 0 onde o canônico dá exit 1 | gate mutado: exit 0 · `0 FAIL · 1 WARN` (referência não-mutada: exit 1 · `1 FAIL … CI exige a parte online (política EB-5)`) → caso reprova | 0 (idem) | idem |
| **M6a** | **alvo real**: `git show 62590b5:docs_phase5/evidence_p50/P50-5.0.1-default-collapsed-1440.png` regravado + `git add -f` (re-add forçado de acervo migrado) | EB-6 (parte offline) | FAIL "índice: N arquivo(s)" | `EB-6: índice: 1 arquivo(s) ainda rastreado(s) em docs_phase5/evidence_p50` | 1 | `git rm --cached` + rm · porcelain vazio |
| **M6b** | **alvo real**: linha `docs_phase5/evidence_p50/` removida do `.gitignore` (bloco das linhas 14–17; diff 1 deleção) | EB-6 (parte offline) | FAIL ".gitignore sem entrada" | `EB-6: .gitignore sem entrada para docs_phase5/evidence_p50/` + `EB-6: git check-ignore não confirma docs_phase5/evidence_p50/ como ignorado` (2 FAIL) | 1 | `git checkout` · porcelain vazio |

**Resultado: 6/6 mutantes MORTOS** (M5 em duas formas, ambas detectadas).
Nenhum mutante sobreviveu; nenhum gate foi enfraquecido ou alterado.

## Política EB-5 — referência executada (baseline dos casos M5)

Gate NÃO-mutado, rede bloqueada:

```text
local:              exit 0 · evidence-bridge: 0 FAIL · 1 WARN
                    [WARN] NÃO EXECUTADO — sem rede: evidence-p50, evidence-p51,
                           evidence-p52, evidence-unset (…WinError 10061…)
GITHUB_ACTIONS=1:   exit 1 · evidence-bridge: 1 FAIL · 0 WARN
                    [FAIL] NÃO EXECUTADO — sem rede: … — CI exige a parte online
                           (política EB-5)
```

## EB-7 · borda 5 — guarda com acervo ausente (árvore principal)

```text
$ mv docs_phase5/evidence_p50 docs_phase5/evidence_p50__ausente
$ MUT_ONLY=M1 node tests_p50_mutants.js
  acervo sob guarda: 0 artefato(s) em evidence_p50/ (inclui 0 do prefixo corrente)
  CAMPANHA PARCIAL (verificação dirigida): M1
  … [PARCIAL]: 1/1 mutantes detectados pelo gate e motivo esperados
  acervo de evidência: 0/0 byte-idênticos … zero arquivo escrito durante a campanha
  restauração: ui_p50_shell_v32.js OK · ui_p50_v32.css OK · ui_p50_suff_v32.js OK ·
               ui_p50_results_v32.js OK · html OK
$ mv docs_phase5/evidence_p50__ausente docs_phase5/evidence_p50
$ ls docs_phase5/evidence_p50 | wc -l   → 82
$ git status --porcelain                → (vazio)
```

Exit 1 da campanha parcial diagnosticado (R2 §3): `tests_p50_mutants.js:846`
compara os detectados com o inventário completo (53) — semântica do modo
`MUT_ONLY`, **invariante à presença do acervo** (controle COM o diretório
presente: mesmo exit 1, mesma linha `1/1`; `acervo sob guarda: 82 artefato(s)`).
A prova canônica em clone limpo permanece sendo o **CI** (pendência do PR,
nomeada — nunca SKIP silencioso).

## Reversão provada (fecho da campanha)

```text
$ git worktree remove --force <Temp>/qs007-mut   → diretório inexistente após
$ git worktree list                              → só a árvore principal
$ git status --porcelain (árvore principal)      → (vazio)
$ git rev-parse HEAD                             → d82c89d59bbb14011c33e6333abe925ffe23c45e
```

Nenhuma mutação residual; `.gitignore` e arquivos pinados mutados só existiram
na worktree efêmera destruída (M6a/M6b/M5) ou foram revertidos por checkout
antes de qualquer commit.

## Decisão registrada — `mutation_map.json` (dependência FORA desta demanda)

**PROPOSTA: criar entrada permanente** para o gate `evidence-bridge` no
`mutation_map.json` — **não executada aqui** (o arquivo não foi editado; a
matriz desta demanda é manual, modalidade autorizada pela spec).

- Justificativa: sem entrada no mapa, edição futura de
  `check_evidence_bridge.py`, `evidence_bridge.json`, `gen_evidence_bridge.py`
  ou `.gitignore` **não re-dispara campanha nenhuma** — exatamente o padrão
  "campanha one-shot stale" que o mapa existe para matar (E7). Os mutantes
  M1–M6 desta matriz são o inventário natural do harness futuro.
- Pré-requisito real: um harness scriptado (`tests_evidence_bridge_mutants.py`
  ou equivalente) que aplique M1/M5/M6 em cópia efêmera sem rede (os online
  M2–M4 exigiriam fixture local ou ficariam como subcampanha `requires: rede`).
  Harness formal de mutação é Onda 3 (KI-2) — a criação é demanda/finding
  próprio, com red próprio, fora da 007.
- Até lá, o rastro canônico é esta matriz; re-execução manual obrigatória
  quando qualquer alvo acima mudar (R3 §5).
