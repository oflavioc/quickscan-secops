# Relatório final — 018-cobertura-declarada-de-mutacao

> Fase 6 · dono: doc-writer · demanda aberta e entregue em 2026-09-11.
>
> **Nota de condução**, herdada e repetida porque é a maior fragilidade desta
> demanda: os agentes de papel existem em `.claude/agents/` mas **não estão
> disponíveis como subagentes nesta sessão**. Todas as fases foram executadas pelo
> orquestrador nos contratos dos donos nomeados. A separação da **R3 §2** foi
> mantida pela **ordem dos commits** — julgador e red antes de qualquer dívida
> existir —, não por processo distinto. Dito, nunca simulado.

## O que foi entregue

O stage `mutation` passou a ter, ao lado, um stage que **nomeia o que não está
sendo checado**. Três artefatos novos e uma linha no pipeline:

| artefato | papel |
|---|---|
| `.claude/verify/mutation_population.json` | a **população declarada** — regra, exceções e dívidas |
| `.claude/verify/check_mutation_coverage.py` | o julgador, com os 7 gates `D018-*` |
| `tests_018_mutants.js` + harness `d018` | os 7 mutantes que provam que o julgador não mente |
| `.claude/verify/pipeline.yaml` | stage `mutation-coverage`, `parallel`, não `heavy` |

**Medição final na árvore real:**

```
mutation-coverage: 14 na população · 0 órfão(s) · 1 não medido(s) · 11 dívida(s) · 0 problema(s)
```

**Campanha `d018`:** preflight 7/7 âncoras casando 1× · **7 DETECTADO · 0
SOBREVIVENTE · 0 NÃO EXECUTADO** · gate rastreado intacto (`0ee0ff0190d6` antes e
depois, conferido pelo próprio harness).

## O red, que é o achado

`2e5c4e2` — a primeira execução do julgador, antes de qualquer dívida existir:

```
mutation-coverage: 13 na população · 11 órfão(s) · 1 não medido(s) · 0 dívida(s) · 12 problema(s)
```

Os onze nomeados: `check_baseline` · `check_boundary` · `check_build` ·
`check_evidence_bridge` · `check_lint_arch` · `check_m41` · `check_markers` ·
`check_mutation` · `check_state` · `check_suites` · `check_tdd`.

É o `EA-3` como **linha vermelha com nome de arquivo**, em vez de silêncio — a
prova que a R3 §4 exige e a evidência que o achado nunca teve em um ano de vida.

## O `EA-3` NÃO fecha, e esta é a conclusão mais importante

A decisão **P5** falava em *"os seis órfãos conhecidos"*. Medido ao implementar:
**dos seis que o `EA-3` nomeia, apenas um** (`check_evidence_bridge.py`) **cai na
população que a P4 declarou**. Os outros cinco —`gen_evidence_bridge.py`,
`evidence_bridge.json`, `tests_session_m48.js`, `compliance-audit.sh` e o próprio
`.claude/BACKLOG.md` — estão **fora dela**, e este instrumento ainda não os
enxerga.

Em troca, a população trouxe **dez órfãos que o `EA-3` nunca nomeou um a um**.

**Consequência**: a demanda entrega o instrumento e cobre os julgadores do
pipeline. O `EA-3` fecha quando a população se estender e os cinco restantes forem
nomeados ou adotados — demanda própria, já prevista no §Fora de escopo.

A justificativa que eu havia escrito na P4 do refinamento — *"são 14 arquivos, é
onde os seis órfãos nomeados vivem"* — **é falsa e foi emendada**. É o segundo
caso, no mesmo dia, de afirmação minha que não sobreviveu à medição.

## Erratas e limites, todos declarados

**Errata E1 — `D018-COB1` entregue `[NÃO MEDIDO]`.** O critério `C5` manda
comparar o arquivo contra o *conjunto mutado* de cada par, e essa comparação **não
tem fonte legível por máquina**: medidos os campos dos 171 pares da matriz,
nenhum diz qual arquivo o par muta — a informação vive em prosa. Recusadas com
razão escrita: medir por substring (**o método que produziu a premissa falsa
retificada no PR #57**) e spawnar o `--preflight` de cada harness (R10 §6 proíbe).
Adotada a terceira rota: declarar não medido, com credor e **gatilho de
reavaliação nomeado**. O gate imprime a causa e **não reprova** — reprovar por algo
que não se mede é inventar veredito.

**Limite da regra.** A população alcança quem é invocado por **stage do
`pipeline.yaml`**, como a P4 fixou. `check_branch_protection.py` é julgador de
verdade e roda por `compliance-audit.sh`, logo fica **fora**. Limite real,
registrado em `regra.limite_conhecido` — no dado, onde o próximo vai olhar — e
**candidato a achado do proprietário**.

**Prazo provisório.** As 11 dívidas nascem com `2026-12-31`. A **T002** escalou o
valor ao proprietário e a resposta não chegou antes da entrega; o valor é redondo
de propósito, sinal de placeholder. Trocar é uma edição no JSON mais um repin —
nenhum código depende dele.

## Verificação final (2026-09-12, árvore limpa)

| verificador | resultado |
|---|---|
| `bash .claude/verify/run.sh` (completo) | **18 PASS · 0 FAIL** — era 17 stages, o `mutation-coverage` é o 18º |
| `bash .claude/verify/compliance-audit.sh` | **17 PASS · 0 FAIL · 0 WARN** |
| `check_baseline.py` | **476/476 pins** |
| stage `mutation` | `1 campanha(s) executada(s) · 0 problema(s)` |
| campanha `d018` | **7 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO** |

## Quatro defeitos MEUS, todos achados por execução

Registrados porque são a melhor evidência que esta demanda produziu a favor da
própria tese: **nenhum dos quatro apareceu em leitura.**

| defeito | quem pegou |
|---|---|
| premissa falsa *"gatilho sem mutante"*, propagada 4× | medição ao desenhar a Fase 2 → retificada no PR #57 |
| `UnicodeEncodeError` no `→` sob cp1252 | o primeiro `run.sh` **completo** — minhas execuções manuais levavam `PYTHONIOENCODING` e nunca exerciam o caminho real |
| `KeyError` no julgador | o mutante `D018-M3`, que matava por *traceback* em vez do sinal declarado |
| alvo fantasma sem razão de classe | o `D017-REL2`, gate da demanda 017 |

O terceiro e o quarto viraram endurecimento permanente: **crash não conta como
kill**, e o `d018` declara `insumos.populacao`. Vale registrar que a classe
`populacao` **já existia no vocabulário fechado da 017** antes desta demanda — o
termo de que a 018 precisava tinha sido antecipado pela demanda que separou
gatilho de conjunto mutado.

## Três achados da própria campanha, nenhum do produto

1. **Encoding.** Quatro mutantes deram resultado errado na primeira execução.
   Causa única, diagnosticada antes de atribuir (R2 §3): Python emite cp1252 no
   Windows e os oráculos com acento não casavam. `PYTHONIOENCODING=utf-8` no
   ambiente do spawn, declarado como dependência de ambiente (R7 §4).
2. **`KeyError` no julgador**, achado pelo `D018-M3`: ele matava por *traceback*,
   não pelo sinal declarado. Endurecidos os dois — o julgador deixou de indexar
   `d['prazo']`, e o harness passou a exigir o **fecho presente** para contar kill.
   **Crash não é kill.**
3. **Ruído de órfão.** Depois do endurecimento o `M3` sobreviveu de novo, e não era
   fraqueza: o próprio julgador era órfão até a entrada `d018` existir, então
   sempre havia um `[FAIL] D018-ORF1` e o oráculo casava por acidente. Registrar o
   harness removeu o ruído. **O gate acusando a própria falta de cobertura estava
   certo o tempo todo.**

## Aceite

- **`qa-engineer`** — green + 7/7 mutantes mortos + regressão congelada intacta.
- **`product-owner`** — a intenção do `refinement.md` está entregue: o stage
  **sabe dizer o que não está checando**, e diz por nome. O que não foi entregue
  está nomeado, com credor e gatilho, em vez de omitido.
- **Auditoria independente humana** — não exigida: demanda comum, sem Porta B, sem
  selagem, sem empate PO×QA (R4 §Gates de fase).

**Merge é do proprietário.**
