# Red da seção de integridade — 013 (T002 · W1)

> Fase 4 · dono: `qa-engineer` · artefato de red da tabela R3 do
> [plan.md](plan.md). Mede a árvore **como ela está** em `3e43a15`, antes de
> qualquer correção. Os critérios não nascem aqui: cada `IC-*` está definido em
> [spec.md](spec.md) §*Critérios de aceite → gates*; este arquivo registra
> **execução**.

## Como foi medido (e por que assim)

`check_mutation.py:39-44` recusa rodar com `git status` sujo — a serialização é
estrutural (plan.md §Disciplina 2). Enquanto a seção de integridade estava sendo
escrita, a árvore real estava suja **por construção**, e o stage abortaria antes
de chegar à seção. A medição foi feita numa **worktree efêmera** (T10) destacada
em `3e43a15`, com o novo `check_mutation.py` commitado **nela** — árvore limpa,
nada escrito na árvore real, worktree removida ao fim.

    git worktree add --detach <efêmera> HEAD   # + o novo check_mutation.py, commitado lá
    python .claude/verify/check_mutation.py    # exit 1

Nenhuma campanha foi disparada: nenhum alvo de harness mudou em relação à base
(`merge-base HEAD origin/develop` = `077282f`), então os quatro harnesses
imprimem *"nenhum alvo mudou — campanha não exigida"*. A seção de integridade
roda **antes** do laço de trigger e **independente** de `requires` (T7), que é
exatamente por isso que ela mede alguma coisa nesta máquina sem Chromium.

## Saída integral do red

```
---- integridade da campanha (013) ----
[OK]   IC-1: core/tests_core_mutants.js: 3 cmd, nenhum com prefixo POSIX de variável
[OK]   IC-1: core/tests_core_mutants.js: nenhum literal de interpretador em comando
[FAIL] IC-1: p50/tests_p50_mutants.js · 26 de 53 cmd de mutante começam com prefixo POSIX de variável (classe ^[A-Za-z_][A-Za-z0-9_]*=; prefixos: P50_ONLY=) — as variáveis têm de passar pela opção env do runner (T3) · mutantes: M25, M26, M27, M28, M29, M30, M31, M32, M33, M34, M35, M36, M37, M38, M39, M40, M41, M42, M43, M44, M45, M46, M47, M48, M49, M50
[FAIL] IC-1: p50/tests_p50_mutants.js:85 · interpretador por nome fixo em literal de comando — T1 exige MUTATION_PY ou o padrão por plataforma (win32 ? python : python3), com o caminho do script entre aspas (R10 §7) · function build() { execSync("python3 build_v32_html.py", { cwd: HERE, stdio: "pipe" }); }
[FAIL] IC-1: p51/tests_p51_mutants.js · 20 de 20 cmd de mutante começam com prefixo POSIX de variável (classe ^[A-Za-z_][A-Za-z0-9_]*=; prefixos: P50_NO_EVIDENCE=, P50_ONLY=) — as variáveis têm de passar pela opção env do runner (T3) · mutantes: M51-01, M51-02, M51-03, M51-04, M51-05, M51-06, M51-07, M51-08, M51-09, M51-10, M51-11, M51-12, M51-13, M51-14, M51-15, M51-16, M51-17, M51-18, M51-19, M51-20
[FAIL] IC-1: p51/tests_p51_mutants.js:200 · interpretador por nome fixo em literal de comando — … · run("python3 build_v32_html.py");
[FAIL] IC-1: p51/tests_p51_mutants.js:205 · interpretador por nome fixo em literal de comando — … · run("python3 build_v32_html.py");
[OK]   IC-1: p52/tests_p52_mutants.js: 107 cmd, nenhum com prefixo POSIX de variável
[FAIL] IC-1: p52/tests_p52_mutants.js:85 · interpretador por nome fixo em literal de comando — … · function build() { execSync("python3 build_v32_html.py", { cwd: HERE, stdio: "pipe" }); }
[NOTA] IC-1: total medido: 46 cmd com prefixo POSIX e 4 literal(is) de interpretador em 3 arquivo(s), sobre 4 harness(es) do mapa
[FAIL] IC-2: M-IC3 · have("python") · com MUTATION_PY=mutation-py-inexistente-013 (binário inexistente) o requisito "python" ainda foi dado por presente — requisito declarado que nunca reprova; a campanha exigida seguiria adiante com o interpretador ausente, e o DEFER/FAIL nomeado de check_mutation.py:69-75 é inalcançável para `python`
[NOTA] IC-4: core · sem preflight por decisão da spec (T8: é a referência do interpretador e fica fora das edições) — dívida declarada, não FAIL
[FAIL] IC-4: p50 · não declara "preflight": true no mutation_map.json (C2) — o contrato C1 não pode ser consumido e nenhuma âncora é provada antes de mutar
[FAIL] IC-4: p51 · não declara "preflight": true no mutation_map.json (C2) — …
[FAIL] IC-4: p52 · não declara "preflight": true no mutation_map.json (C2) — …
[FAIL] IC-6: p51.targets · alvo declarado que o harness não muta: ui_session_v32.js [oráculo: leitura estática do fonte (reserva — p51 não responde a C1)]
[FAIL] IC-6: p51.targets · alvo mutado ausente de targets: USER_GUIDE.md, ui_journey_v32.js, ui_p50_results_v32.js, ui_p50_shell_v32.js, ui_p50_v32.css [oráculo: leitura estática do fonte (reserva — p51 não responde a C1)]
[FAIL] IC-5: p51 · 20 mutante(s) do harness sem par na matriz (nem aposentado em dividas_declaradas): M51-01 … M51-20 [oráculo dos ids: leitura estática do fonte (reserva — p51 não responde a C1)]
[FAIL] IC-5: p51 · par na matriz que não corresponde a mutante declarado pelo harness: 'campanhas P51 (múltiplos)'
[OK]   IC-5: registro de 1 par(es) p51 resolve no disco
---- integridade: 14 problema(s) nomeado(s) ----
[OK]   core: nenhum alvo mudou desde a base — campanha não exigida
[OK]   p50: nenhum alvo mudou desde a base — campanha não exigida
[OK]   p51: nenhum alvo mudou desde a base — campanha não exigida
[OK]   p52: nenhum alvo mudou desde a base — campanha não exigida
----
mutation: 0 campanha(s) executada(s) · 14 problema(s)
```

Exit code **1**. As reticências acima abreviam **repetição literal** do mesmo
texto de causa; nenhuma linha foi omitida e nenhum alvo ficou sem nome.

## Estado gate a gate

| Gate | Veredito | O que o FAIL nomeia | Vira verde em |
|---|---|---|---|
| **IC-1** (prefixo) | **RED** | 46 `cmd` — 20/20 na `p51`, 26/53 na `p50`; `core` e `p52` **verdes** | T006 (20) · T011 (26) |
| **IC-1** (interpretador) | **RED** | 4 literais em 3 arquivos: `p50:85`, `p51:200`, `p51:205`, `p52:85` | T006 · T009 · T014 |
| **IC-2** | **RED** | `have("python")` dá o requisito por presente com `MUTATION_PY` apontando para binário inexistente — M-IC3 é o código de hoje (`:30-31`) | T004 |
| **IC-4** | **RED** | os **três** harnesses não declaram `preflight: true` — C1 não tem produtor, nenhuma âncora é provada antes de mutar | T006/T009/T014 declaram; o red **seguinte** (as quatro âncoras) nasce na T008 |
| **IC-5** | **RED** | 20 mutantes da `p51` sem par + 1 par (`campanhas P51 (múltiplos)`) que não é mutante nenhum | T024 |
| **IC-6** | **RED** | divergência nas **duas** direções: sobra `ui_session_v32.js`; faltam `USER_GUIDE.md`, `ui_journey_v32.js`, `ui_p50_results_v32.js`, `ui_p50_shell_v32.js`, `ui_p50_v32.css` | T006 (T11) |
| IC-3 | cenário (a) medido abaixo — **não** é asserção deste arquivo | — | T006/T009/T014 |
| IC-7 · IC-8 | fora da T002 (stage `baseline` · campanha no job `visual`) | — | — |

Os `[OK]` importam tanto quanto os `[FAIL]`: `core` e `p52` passam no eixo do
prefixo e o `registro` do par `p51` resolve no disco. Um gate que reprova tudo
não discrimina nada.

## Falsificação — o gate consegue ficar verde? (worktree efêmera, descartada)

Red que não falha é gate que não mede; gate que **nunca passa** também não.
Cada asserção foi levada ao verde e devolvida ao vermelho por um mutante, em
cópia efêmera. Nada disto voltou para a árvore real.

| Sonda | Cenário | Resultado |
|---|---|---|
| P1 | `p51` sem os defeitos (stub que responde a C1, `targets` reconciliados, 20 pares na matriz, `have()` resolvendo de verdade) | `[OK]` em **IC-1, IC-2, IC-4, IC-5 (×2) e IC-6** |
| P2 | **M-IC5** — `ocorrencias: 2` em `M51-18` (a borda 4: `ui_v32.js:131` × `:1026`) | `[FAIL] IC-4: p51/M51-18 · âncora ambígua — ocorrencias=2` |
| P3 | `ocorrencias: 0` em `M51-20` | `[FAIL] IC-4: p51/M51-20 · âncora não encontrada — ocorrencias=0` |
| P4 | **M-IC9** (`ui_session_v32.js` de volta) + **M-IC8** (`USER_GUIDE.md` fora) | `[FAIL] IC-6` nas duas direções, com o oráculo `preflight (C1)` |
| P5 | **M-IC6** (um par removido) + **M-IC7** (`registro` inexistente) | `[FAIL] IC-5: … M51-07 sem par` + `[FAIL] IC-5: … registro não resolve` |
| P6 | `preflight: true` declarado num harness que **não** implementa `--preflight` | ver achado abaixo |

**M-IC1** e **M-IC2** não precisaram ser escritos: são o **estado de hoje** e o
gate já os nomeia (linhas de IC-1 acima). **M-IC3** idem, em IC-2. A campanha
formal `M-IC1`…`M-IC9` é da T028.

### Achado da sonda P6 — e a guarda que ele exigiu

Com `preflight: true` declarado num harness que ainda não lê `argv`, o consumidor
invocou `node tests_p51_mutants.js --preflight` e o harness **rodou a campanha
inteira dentro do stage `mutation`** (a saída começou em `NÃO DETECTADO M51-01`).
Um stage declarado `mutates: false` no `pipeline.yaml` passaria a mutar a árvore
porque alguém escreveu uma chave no JSON antes do modo existir.

A seção ganhou uma **pré-condição estática** antes de invocar: se nenhum fonte do
harness contém `--preflight`, o consumidor **recusa a invocação** e reprova
nomeando a causa. Re-medido: `0,8s`, nenhuma campanha, árvore limpa,
`[FAIL] IC-4: p51 · declara "preflight": true (C2) mas nenhum fonte do harness lê
--preflight — invocá-lo dispararia a campanha inteira dentro do stage; flag e
modo nascem no mesmo commit (D4)`.

É a decisão **D4** deixando de ser disciplina pedida ao autor e virando
pré-condição verificada. **Consequência para T006/T009/T014**: declarar a chave
sem o modo, ou o modo sem a chave, é FAIL nomeado — nunca uma campanha
acidental.

## Cenário IC-3(a) — as três harnesses de hoje, interpretador ausente

Worktree efêmera em `3e43a15` (harnesses **intocados**), `PATH` reduzido a
`nodejs` + `System32` (nem `python` nem `python3` resolvem — verificado),
`MUTATION_PY=py-inexistente-013` **ignorado pelas três** (o seam de C4 ainda não
existe), um mutante por harness (`MUT_ONLY` / `P52_MUT_ONLY`) para não disparar
campanha.

| Harness | Comando | O que imprimiu | Exit | `git status --porcelain` |
|---|---|---|---|---|
| `p51` | `MUT_ONLY=M51-01` | `NÃO DETECTADO M51-01 · …` + `MUTATION TESTING (Phase 5.1): 0/1 mutantes detectados pelo gate e motivo esperados` | 1 | vazio |
| `p50` | `MUT_ONLY=M25` | exceção **não capturada** em `build()` (`:85`, chamada de `main()` em `:766`) — stack trace cru | 1 | vazio |
| `p52` | `P52_MUT_ONLY=P52-M1` | `MUTATION P52: falha fatal — Error: Command failed: python3 build_v32_html.py` (`.catch` de `:1414`) | 1 | vazio |

**Divergência registrada contra o red previsto.** A previsão da W1 era "veredito
+ razão `D/T` impressos com interpretador ausente" nas **três**. Medido: só a
`p51` faz isso. A `p50` e a `p52` **abortam no build inicial**, antes de qualquer
mutação, com falha não classificada. As duas formas violam T4/T5 — nenhuma
produz `NÃO EXECUTADO · interpretador ausente` —, mas são defeitos **diferentes**
e a correção difere:

- `p51`: precisa **parar de afirmar** (hoje inventa veredito e razão sobre um
  gate que nunca rodou);
- `p50`/`p52`: precisam **passar a classificar** (hoje o crash é honesto por
  acidente — não mente porque nem chega a falar).

Nos três casos a árvore ficou limpa, porque o aborto precede a mutação. O
segundo cenário de IC-3, **(b)** âncora corrompida ⇒ `âncora não encontrada`
nomeando o mutante, **não** foi executado aqui: exige o vocabulário de T4, que
nasce em W3/W4/W5. Fica para T008/T013/T016.

## Não executado (declarado, nunca omitido — R2 §1)

| O quê | Por quê |
|---|---|
| Cenário ponta-a-ponta de IC-2 (`MUTATION_PY=<inexistente> python check_mutation.py --all`) | Com `--all` **todo** harness fica exigido e, como `have("python") → True` hoje, o `core` (`node`+`python`, sem `chromium`) teria o ambiente dado por presente e a **campanha `core` rodaria de verdade**. Esta delegação proíbe rodar campanha. A raiz é medida em processo pela asserção IC-2 acima; o ponta-a-ponta é prova da **T004**, onde `have()` já reprova e nenhuma campanha é disparada |
| Campanha de mutação de qualquer harness (IC-8) | Fora da W1; as três exigem `chromium`, ausente nesta máquina (D3). Canônica no job `visual` |
| `--preflight` real de qualquer harness (IC-4 com `ocorrencias`) | Não existe produtor de C1 ainda — é o próprio red de IC-4. O consumidor foi exercitado contra um stub em worktree efêmera (P1–P3, P6) |
| `gen_pins.py` (repin R3) | É a **T003**, do `build-engineer` |
| Campanha `M-IC1`…`M-IC9` formal | É a **T028** (W9); aqui só a falsificação P1–P6 |

## Limite conhecido do instrumento (declarado, não contornado)

A classe do eixo do interpretador é a **normativa da spec** — `"python3? `, isto
é, aspa + `python[3]` + espaço. Ela mata `execSync("python3 build_v32_html.py")`
(M-IC1) e **não** casa a referência da casa (`? "python" : "python3";`,
`tests_core_mutants.js:22`), que é resolução por plataforma. Ela **não** casaria
a forma `spawnSync("python3", [args])`, que nenhum harness do mapa usa hoje.
Ampliar a classe é mudança de **spec**, não do gate — registrado aqui em vez de
alargado em silêncio.

## Oráculos e auto-exclusão

- **Oráculo do contrato**: o JSON de C1 emitido pelo próprio harness, consumido
  por outro executável — nunca regex sobre stdout PT-BR (R10 §6).
- **Oráculo de reserva**: enquanto nenhum harness responde a C1, IC-5 e IC-6
  leriam "não medido" — e não medir em silêncio é FAIL (R10 §2). A reserva lê os
  ids e os arquivos mutados do **fonte** do harness e o relatório **nomeia** qual
  oráculo respondeu (`[oráculo: leitura estática do fonte (reserva…)]`). Quando o
  preflight existir, ele é o oráculo e a reserva sai de cena.
- **Auto-exclusão nominal (R10 §10)**: `.claude/verify/check_mutation.py` e
  `specs/013-integridade-da-campanha/` **inteiro** — `refinement.md`, `spec.md`,
  `plan.md`, `tasks.md` e este arquivo carregam os literais proibidos por
  necessidade de descrevê-los. Excluir só a `spec.md` faria o gate reprovar a si
  mesmo. Exclusão é sempre **impressa** (`[EXCLUÍDO] IC-1: …`), nunca silenciosa.
- **Varredura por propriedade**: os arquivos varridos saem do **`cmd` de cada
  harness do `mutation_map.json`** — harness novo entra na varredura sozinho, sem
  editar o gate. Nenhuma lista nominal de harness existe no código; a única lista
  nominal é a de **exclusões** e a das asserções que a spec fixou como nominais à
  `p51` (IC-5/IC-6, T11/borda 10).

## Regressão congelada (intacta neste commit)

`DEFER`/`FAIL` de `check_mutation.py:69-75`, pré-condição de árvore limpa
(`:39-44`), pós-condição (`:92-96`) e restauração de recibos (`:86-90`):
**nenhuma linha alterada**. O diff é bloco aditivo + **uma** linha de ligação —
`fails = 0` passa a `fails = IC_FAILS`, para que a linha final do stage
(`N problema(s)`) conte os FAIL nomeados da seção em vez de escondê-los. Nenhum
stage novo, nenhuma linha em `pipeline.yaml` (T7), nenhuma suíte nova em
`expected_suites.json` (a spec fixa que ele não muda).

## Aviso operacional (R14 — o vermelho é a entrega)

Deste commit até a **W6** o stage `mutation` fica **legitimamente vermelho**, e o
vermelho muda de razão a cada wave: hoje são 14 problemas nomeados; depois da W3
os prefixos caem para 26 e IC-4 passa a nomear as **quatro âncoras podres** —
esse FAIL é o red da W6, não uma quebra. `run.sh --light` segue verde (o stage é
`heavy`). Precedente 012/008.
