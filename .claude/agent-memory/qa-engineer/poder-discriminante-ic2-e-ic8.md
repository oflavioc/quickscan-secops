---
name: poder-discriminante-ic2-e-ic8
description: IC-2 (013) só discrimina a direção NEGATIVA do requisito python; o dual (have→False incondicional) e a regra de plataforma de T1 sobrevivem a ele e só morrem no job visual, por IC-8
metadata:
  type: project
---

Medido em worktree efêmera na T004 da demanda 013 (2026-08-29), com o green de
IC-2 aplicado e três sondas de falsificação sobre `check_mutation.py`:

| sonda | o que muda em `have("python")` | IC-2 |
|---|---|---|
| **M-IC3** (o mutante da spec) | `return True` incondicional | **morto** |
| S1 — seam ignorado | resolve o padrão de plataforma e descarta `MUTATION_PY` | **morto** |
| S2 — regra de plataforma descartada | `MUTATION_PY or "python3"` fixo | **sobrevive** |
| S3 — o dual de M-IC3 | `return False` incondicional | **sobrevive** |

S2 sobrevive porque o vetor adversarial de IC-2 define `MUTATION_PY`, e o
override tem precedência — o ramo de plataforma nunca é exercitado. E ele morde
de verdade no Windows: `shutil.which("python3")` resolve para o *stub* de alias
da Microsoft Store em `WindowsApps`, que existe e passa no teste de acesso sem
ser um interpretador utilizável — o requisito voltaria a ser tautológico por
outra porta.

S3 sobrevive porque a asserção em processo só mede a direção negativa. Local ele
é invisível (nenhum alvo mudou ⇒ `have` nem é chamado) e, sob
`MUTATION_DEFER_MISSING=1` (job `verify`), vira quatro `[DEFER]` e **exit 0**.
Quem o mata é o job `visual`, que roda `check_mutation.py` **sem** essa env
(`.github/workflows/verify.yml`): ali toda campanha exigida vira
`[FAIL] … ambiente sem python`. É coerente com a §Nascimento de gate da spec —
IC-2 é declarado o caso **negativo** da família e IC-8 é o positivo.

**Why:** a pergunta "o gate tem dentes?" não se responde só com o mutante que a
spec previu. Aqui o par gate↔mutante fecha (M-IC3 morre), mas dois vizinhos
próximos passam — e um deles (S3) desligaria a campanha inteira em silêncio no
job que mais importa.

**How to apply:** ao redigir a seção `M-IC1`…`M-IC9` da
`matriz-gate-mutante.md` (T028), leve S2 e S3 como candidatos e diga
explicitamente **em que job** cada `M-IC*` morre — matar local e matar no
`visual` não são a mesma garantia. Não fortalecer IC-2 por conta própria numa
wave de implementação: redefinir critério é do `tech-lead`/`product-owner`.
Ver [[medir-red-do-proprio-julgador]] e [[trilha-e-ambiente-quickscan]].
