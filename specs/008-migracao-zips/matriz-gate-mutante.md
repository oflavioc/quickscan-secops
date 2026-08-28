# Matriz gate ↔ mutante — 008-migracao-zips

> Fase 6 (T013) · executor: qa-engineer · modalidade manual (harness formal de
> mutação: pendência Onda 3/KI-2, como na 007). Execução em **worktree efêmera**
> (`git worktree add --detach` em `9b7c6dd`, `.claude/worktrees/qs008-mut`) —
> checkout pós-migração, **sem os 3 ZIPs no disco** (prova adicional de ZB-4/ZB-5).
> Rede bloqueada por proxy inalcançável (`http[s]_proxy=http://127.0.0.1:1`) nos
> mutantes offline; rede real nos online (M2–M4). Árvore principal e worktree
> intactas antes×depois de CADA mutante (`git status --porcelain` vazio;
> **nenhuma mutação commitada**). Suíte de sessão na worktree via `NODE_PATH`
> apontando o `node_modules` da árvore principal (dependências fora do índice).

## Bloco 1 — M-ZB1…M-ZB6 (novos, spec §Critérios)

| Mutante | O que foi mutado (cópia efêmera) | Gate/caso que o mata | FAIL obtido (literal) | Exit | Reversão |
|---|---|---|---|---|---|
| **M-ZB1a** | 1º hex do hash do `_48.zip` no manifesto (coerente: `sha256_pacote` E `arquivos[path]`, `24736aee…` → `f4736aee…`) | EB-1 (offline) | `EB-1: hash divergente: visual_print_evidence_48.zip (manifesto f4736aee… ≠ blob 24736aee…)` | 1 | `git checkout` · porcelain vazio |
| **M-ZB1b** | entrada `evidence-487` apagada do manifesto | shape + EB-1 + online | `shape: acervos esperados [7] , encontrados [6]` + `EB-1: arquivo a menos no manifesto: visual_print_evidence_487.zip` + `pacote NÃO VERIFICÁVEL: acervo evidence-487` (3 FAIL) | 1 | idem |
| **M-ZB2a** | acervo espúrio `evidence-espurio` acrescentado | shape (domínio fixo) | `shape: acervos esperados [7], encontrados [8: …evidence-espurio…]` | 1 | idem |
| **M-ZB2b** | `sha256_pacote` de `evidence-487` ≠ `arquivos[path]` (incoerência interna) | shape (coerência T3) | `shape: evidence-487: sha256_pacote ≠ arquivos['visual_print_evidence_487.zip'] (incoerência interna do acervo-arquivo)` + 2 FAIL derivados | 1 | idem |
| **M-ZB3** | `pacote` de `evidence-48` → `visual_print_evidence_48_inexistente.zip` | shape (`pacote` == basename) + online | `shape: evidence-48: pacote 'visual_print_evidence_48_inexistente.zip' ≠ basename do path` + `pacote NÃO VERIFICÁVEL` (3 FAIL). **Nota**: para acervo-arquivo todo desvio de ponteiro morre PRIMEIRO no shape (campos travados no domínio) — o 404 real contra `evidence-v32` está provado pelo **red commitado `5bafacd`** (`pacote AUSENTE ×3, HTTP 404 real`, pré-publicação), que é a execução canônica deste mutante | 1 | idem |
| **M-ZB4a** | `git add -f` do `_48.zip` (materializado do blob da âncora) na worktree | EB-6 generalizado (T4) | `EB-6: índice: 1 arquivo(s) ainda rastreado(s) em visual_print_evidence_48.zip` + `check-ignore não confirma` (2 FAIL) | 1 | `git rm --cached` + rm · porcelain vazio |
| **M-ZB4b** | entrada literal `visual_print_evidence_487.zip` removida do `.gitignore` | EB-6 generalizado (T4) | `EB-6: .gitignore sem entrada LITERAL para visual_print_evidence_487.zip (nome exato de arquivo, nunca glob)` + `check-ignore não confirma` (2 FAIL) | 1 | `git checkout` · porcelain vazio |
| **M-ZB5·i** (**forma canônica** — ver veredito abaixo) | `_meta.commit_ancora` → SHA 40-hex **inalcançável** (`0123456789abcdef…4567`; `git cat-file -t` = fatal) | S64 · S74+S75 · S113 (suíte `heavy.session`) | `FAIL S64/S74+S75 [blob do archive inacessivel no commit-ancora: 0123…4567:visual_print_evidence_48.zip [fatal: path … does not exist …]]` · `FAIL S113 […:visual_print_evidence_487.zip…]` → **94 PASS · 3 FAIL de 97** (throw nomeado, nunca SKIP) | — | `git checkout` · porcelain vazio |
| **M-ZB5·ii** (complementar) | campo `_meta.commit_ancora` adulterado (39 hex — validação T5) | idem | `FAIL ×3 [commit-ancora invalido no manifesto-ponte (_meta.commit_ancora): 62590b5…656]` → **94 PASS · 3 FAIL de 97** | — | idem |
| **M-ZB5·iii** | ZIP **truncado a 50%** (3 271 684 de 6 543 368 bytes do blob real) entregue ao tmp — reprodução exata do caminho do helper (`spawnSync` Buffer → `writeFileSync` → `unzip -Z1 "…"`) | asserções de S64/S74+S75 via `execSync`/`unzip` | `unzip` exit **9** → `execSync` lança (`Command failed: unzip -Z1 "…"`) → `T()` registra FAIL. Prova em nível de mecanismo (mesmos comandos do helper), sem criar objeto git | — | tmp removido em `finally` · porcelain vazio |
| **M-ZB6a** | env-doctor executado com **PATH efêmero sem `unzip`** (python+git+node presentes) | ZB-6 (política T6) | `[WARN] unzip ausente do PATH — S64/S74+S75/S113 (suíte heavy.session) reprovam sem ele; instale unzip…` · exit 0 (WARN nomeado, nunca FAIL do stage, nunca silêncio) | 0 (o WARN É a detecção) | ambiente efêmero descartado |
| **M-ZB6b** | cópia efêmera de `env_doctor.py` **sem o bloco da checagem** de unzip | caso adversarial (grep na saída) | gate mutado: **0 ocorrências** de `unzip` na saída (referência não-mutada: 1 — `[OK] unzip presente`) → caso reprova o mutante | 0 (o silêncio É a detecção) | cópia em tmp removida |

## Bloco 2 — Re-execução integral M1–M6 da 007 (obrigação R3 §5)

Os alvos da matriz da 007 (`check_evidence_bridge.py`, `gen_evidence_bridge.py`,
`evidence_bridge.json`, `.gitignore`) **mudaram nesta demanda** — re-execução
obrigatória, mesma mecânica da matriz 007, agora sobre os artefatos generalizados
(domínio de 7 acervos):

| Mutante | Mutação (idêntica à 007, alvo atual) | Gate | FAIL obtido (literal) | Exit |
|---|---|---|---|---|
| **M1** | 1º hex do hash de `docs_phase5/evidence_unset/UG-geometry.json`: `7e41…` → `0e41…` | EB-1 (offline) | `EB-1: hash divergente: docs_phase5/evidence_unset/UG-geometry.json (manifesto 0e41b1d8… ≠ blob 7e41b1d8…)` | 1 |
| **M2** | `sha256_pacote` de `evidence-unset`: `1230…` → `0230…` | EB-2/EB-4 (online, rede real) | `pacote ADULTERADO: evidence_unset.tar esperado 023097e6… obtido 123097e6…` | 1 |
| **M3** | `pacote` de `evidence-unset` → `evidence_unset_inexistente.tar` | EB-3 (online, 404 real) | `pacote AUSENTE: evidence_unset_inexistente.tar @ evidence-unset (HTTP 404)` | 1 |
| **M4** | `sha256_pacote` de `evidence-unset` ← hash REAL de `evidence_p51.tar` (`e903d925…`) | EB-4 (online, rede real) | `pacote ADULTERADO: evidence_unset.tar esperado e903d925… obtido 123097e6…` | 1 |
| **M5a** | no GATE: `warn(texto)` → `pass` (SKIP silencioso) | caso adversarial EB-5 (rede bloqueada) | gate mutado: exit 0 · `0 FAIL · 0 WARN` · **0 ocorrências** de `NÃO EXECUTADO` com **7** pacotes não verificados → caso reprova (referência não-mutada: exit 0 · `0 FAIL · 1 WARN` nomeando os 7) | 0 (o desvio É a detecção) |
| **M5b** | no GATE: `MODO_CI = …` → `False` (detecção de CI cega) | caso CI-simulado EB-5 (`GITHUB_ACTIONS=1`, rede bloqueada) | gate mutado: exit 0 · `0 FAIL · 1 WARN` (referência não-mutada: exit **1** · `1 FAIL … CI exige a parte online (política EB-5)`) → caso reprova | 0 (idem) |
| **M6a** | re-add forçado de acervo migrado: blob de `evidence_p50/P50-5.0.1-default-collapsed-1440.png` regravado + `git add -f` | EB-6 (offline) | `EB-6: índice: 1 arquivo(s) ainda rastreado(s) em docs_phase5/evidence_p50` | 1 |
| **M6b** | linha `docs_phase5/evidence_p50/` removida do `.gitignore` | EB-6 (offline) | `EB-6: .gitignore sem entrada para docs_phase5/evidence_p50/` + `check-ignore não confirma` (2 FAIL) | 1 |

## Bloco 3 — Transferência de garantia declarada (O1 do parecer do PO)

| Garantia viva | Onde vivia | Onde vive agora | Mutante que a cobre |
|---|---|---|---|
| "o arquivo de evidência anterior (`_48.zip`) permanece **publicado** e íntegro" — metade *publicação* da asserção de S113 (`tests_session_m48.js:1352-1353` pré-refatoração) | S113 (`fs.existsSync` + `statSync().size>0` na árvore) | **parte online do `evidence-bridge`** (ZB-3/EB-2/EB-4 sobre os assets de `evidence-v32`, política EB-5: sem rede local → WARN nomeado, CI → FAIL) | **M-ZB3** — asset ausente → FAIL do stage (`pacote AUSENTE`, executado no red `5bafacd`: 404 real ×3) e desvio de ponteiro → FAIL de shape (acima); adulteração → EB-4 (`pacote ADULTERADO`, mecânica provada por M2/M4 no release compartilhado) |
| metade *presença local* da mesma asserção | S113 idem | S113 retém: `git cat-file -s <âncora>:visual_print_evidence_48.zip > 0` (presença + não-vazio do blob) + `A.size>0` | **M-ZB5·i/ii** — âncora inalcançável/adulterada → S113 FAIL (throw nomeado) |

É **transferência declarada, não afrouxamento** (R10 §1): nenhuma verificação
deixou de existir; a metade "publicado" mudou de gate **com rastro** (esta linha)
e cobertura executada nos dois lados.

## Veredito do QA — forma canônica do M-ZB5 (registro obrigatório)

A redação da spec ("`_meta.commit_ancora` trocado por **SHA de commit sem os
ZIPs**") **não é construtível neste repositório**: os 3 ZIPs entram no commit
raiz `e5ccd42`, logo TODO commit alcançável os contém — âncora apontada para
qualquer commit real dá **97/0 por vacuidade** (mutante vivo porque o domínio
"commit sem os ZIPs" é vazio, não por falha do oráculo). Achado do
`core-engineer` na T007, confirmado por mim.

**Forma canônica registrada: M-ZB5·i — SHA 40-hex sintaticamente válido e
inalcançável.** Justificativa: preserva a intenção do mutante (âncora apontando
para onde os ZIPs não são recuperáveis) sendo construtível, e exercita o caminho
COMPLETO do oráculo (manifesto legível → validação 40-hex passa → resolução git
falha → throw nomeado → FAIL) — estritamente mais discriminante que a forma ii,
que morre na regex de validação. A forma ii fica registrada como complementar
(cobre a validação T5); a forma iii cobre a integridade do byte entregue. A spec
aprovada não é reescrita retroativamente (R13) — este veredito é o registro
canônico da divergência spec-vs-realizável, classe **spec-errada (formulação)**,
sem nenhum gate enfraquecido.

## Placar e fecho

**Resultado: 17/17 execuções de mutante MORTAS** (M-ZB1 em 2 formas, M-ZB2 em 2,
M-ZB4 em 2, M-ZB5 em 3, M-ZB6 em 2, M5 em 2, M6 em 2; M-ZB3, M1–M4 em 1).
**Nenhum sobrevivente. Nenhum gate enfraquecido ou alterado.**

```text
$ git worktree remove --force .claude/worktrees/qs008-mut   → removida
$ git worktree list        → árvore principal (9b7c6dd) [+ worktree da 009, alheia]
$ git status --porcelain   → (vazio)
$ git rev-parse HEAD       → 9b7c6dd55dcecec4fd75a31237606bbfbbcdc871
```

## `mutation_map.json` — decisão registrada (dependência FORA desta demanda)

**Mantida a PROPOSTA da 007** (não executada aqui; arquivo não editado): entrada
permanente para o gate `evidence-bridge` — agora com inventário ampliado
(M1–M6 ∪ M-ZB1…M-ZB6) e alvo adicional `tests_session_m48.js` (helper de
extração). Pré-requisito segue sendo o harness scriptado da Onda 3 (KI-2). Até
lá, o rastro canônico é esta matriz + a da 007; re-execução manual obrigatória
quando qualquer alvo mudar (R3 §5).
