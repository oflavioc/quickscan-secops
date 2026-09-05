# EA-39 — desenho do fix-finding: o leitor nomeia o histórico raso

> Nota de desenho (Fases 2+3 de um `fix-finding`, não demanda nova). Escrita pelo
> `tech-lead` em 2026-09-05 na branch `fix/ea39-leitor-mudo`, sob a delegação de
> 2026-08-29 — **nada aqui foi ratificado pelo proprietário no chat**. A forma
> (código novo `historico-raso`, veredito `NÃO DETERMINÁVEL`, precedência
> forma → ausente → **raso** → piso fora da cadeia, guarda de censo mantida) é a
> decisão do `product-owner` registrada em `.claude/BACKLOG.md` §EA-39 "Decisão de
> forma" e **não se reabre aqui**. Esta nota decide o que o PO deixou ao TL:
> detecção, campo, lugar, tipagem, errata — e a medição que o orquestrador exigiu
> antes do red. Propõe; quem roteia é o orquestrador (R5).

## 0. O que foi medido antes de desenhar (protótipo descartável, nunca produção)

Clones efêmeros no scratchpad (`git init` + `remote add` + `fetch --depth=N` de
`refs/remotes/origin/develop` desta worktree — o mesmo molde do checkout do CI e
da §11.3 de `prova-de-carga.md`), git 2.55.0, código de **hoje** (`e2d3892`).
`origin/develop` = `ec74d6f`, já **dois merges first-parent acima do piso**
`921977c` (PRs #40 e #41) — o que torna real, nesta árvore, o caso "raso acima do
piso" que o backlog só previa.

| # | cenário | `.git/shallow` · `is-shallow` | cadeia first-parent lida | `origin_develop` lido | gate nu hoje |
|---|---|---|---|---|---|
| A | `--depth=1` — raso **acima** do piso | 2 linhas · `true` | `[ec74d6f]`, `%P` vazio; `cat-file -p ec74d6f` tem **2 `parent`** | `presente true · piso_na_cadeia false · causa null` | `piso-invalido` com o detalhe **falso** *"um SHA de outra branch não é piso"* · censo `nao_aplicado` · 1 problema · exit 1 |
| B | `--depth=3` — cadeia termina **no** piso (assinatura do EA-38) | 3 · `true` | `[ec74d6f, 1f7d039, 921977c]`, o piso com `%P` vazio; objeto com 2 `parent` | `presente true · piso_na_cadeia true · causa null` | **leitor mudo**: `globais []` · `0 problema(s)` · `em_voo 10` · `merges_ate_piso 0` · guarda `divergente 0 ≠ 39` · exit 1 |
| C | clone **completo** + `git fetch --depth=1` de um commit alheio (fora da cadeia de `develop`) | 1 · **`true`** | 69 commits, termina na raiz `e5ccd42`; objeto **sem** `parent` | `presente true · piso_na_cadeia true` | **exit 0** · censo `39 = 39 (ok)` · 0 problemas — o julgamento é válido |
| D | `--pr` no clone A (`GITHUB_HEAD_REF=feature/016-…` e `=fix/ea39-…`, base `develop`) | 2 · `true` | — | **não lido**: `_leitura` tem só `base_ref, evento, head_ref` | `LIBERADO` (016) · `NÃO JULGADO · fora-da-populacao` (fix/ea39) · exit 0 |
| E | reparo no clone B: `git fetch` simples de `develop` | persiste (3) | 3 | — | — |
| F | CI, run `33946727326` (PR #41, `pull_request`, 2026-09-05) | `verify` e `visual`: `fetch-depth: 0`; **`fecho`: `fetch-depth: 1`, `--depth=1`** (por desenho, spec §Superfície 2) | — | — | `verify`: `[PASS] fecho` (exige censo ok); `fecho`: `fecho --pr: NÃO JULGADO · fora-da-populacao`; `visual`: **success** — primeiro `pull_request` verde depois do remédio do EA-38 (`8ec429a`), mas `mutation: 0 campanha(s)` (o diff do EA-37 não dispara `d016`) |

Três conclusões que decidem o desenho:

1. **`ler_merges` tem um único chamador vivo: `check_fecho.py:402` (`vivo_pos`).** O
   caminho `--pr` (`vivo_pre`, `:441-448`) lê só planning-state e disco — a linha
   D mede que sob `depth=1` ele responde o mesmo que num clone completo, e o job
   `fecho` do CI (raso por desenho) já roda assim. **O impedimento novo não pode
   alcançar o `--pr`**: não é decisão de código, é ausência de chamada. O "estrago"
   que o orquestrador temia não tem caminho de execução. A regressão fica pinada
   mesmo assim (T092/T095: `--pr --json` byte-idêntico em clone raso × completo).
2. **`is-shallow-repository` sozinho acusaria falso** — a linha C é um clone raso
   cuja cadeia de `develop` está íntegra e cujo julgamento é correto. Um
   impedimento disparado só pelo flag transformaria um exit 0 legítimo em
   `NÃO DETERMINÁVEL`: é o estrago na direção oposta. "Raso irrelevante para este
   julgamento" = C; "raso que invalida a leitura" = A e B. O que os separa é o
   **fim da cadeia caminhada**, não o flag.
3. **A comparação de pais sozinha não basta** pelo vocabulário que o PO fixou:
   `historico-raso` só é emitido quando o clone é de fato raso; graft/`refs/replace`
   produziriam a mesma assinatura com outro remédio (e `cat-file -p` honra
   `refs/replace` por padrão — nem detecta). Além disso custaria um processo a
   mais em toda execução íntegra, para nada.

Ressalva do protótipo: o `--unshallow` do clone B "restaurou" para
`origin/develop = acc9c21` (55 commits, piso fora) porque o `origin` do protótipo
era esta worktree, cujo branch **local** `develop` está atrás do remoto. A
§11.3 já mediu o `--unshallow` contra o GitHub (restaura, `39 (ok)`); a bateria
do QA (T095) usa `origin` = GitHub ou refspec pinada em
`refs/remotes/origin/develop`, nunca o branch local.

## 1. Detecção — as duas candidatas, em conjunção, cada uma com um papel

No **leitor** (`ler_merges`), depois de montar `cadeia` e localizar `indice`
(`fecho.py:479-489`) e **antes** do laço de `merges`:

- `fim` = último elemento de `cadeia` (a caminhada first-parent só termina onde o
  git não vê pai: raiz verdadeira **ou** commit raso — o git trata o commit em
  `.git/shallow` como raiz, `%P` vazio; medido nas linhas A e B).
- `git rev-parse --is-shallow-repository` — **condição necessária**, e o portão
  barato: `false` ⇒ `cadeia_integra = true` sem mais processo algum (é o caso de
  toda worktree completa e dos jobs `verify`/`visual`, `fetch-depth: 0`).
- Só se `true`: `git cat-file -p <fim.sha>` — **condição suficiente e específica
  desta cadeia**: `≥ 1` linha `parent ` no objeto com `%P` vazio na caminhada ⇒
  `cadeia_integra = false`. Sem `parent` ⇒ raiz verdadeira alcançada num clone
  raso por outra ref ⇒ `cadeia_integra = true` (linha C).
- Cobre o raso em **qualquer posição**: acima do piso (A: `fim` é a própria ponta,
  `piso_na_cadeia false`), no piso (B) e abaixo dele — onde a guarda de censo não
  alcança (acima) e onde alcança (no piso e abaixo, com contagem < 39).
- Não cobre, **declarado**: truncamento fora da cadeia first-parent (boundary raso
  num ramo lateral) — só afetaria o oráculo de ancestralidade quando a mensagem
  cala (T1), e não ganha código (R12: caso hipotético; C mostra que o flag não o
  distingue). Entra em `dividas_declaradas` na mesma linha de T096.

## 2. Campo(s) em `origin_develop`

Hoje `{presente, sha, causa, piso_na_cadeia}`. Passa a
`{presente, sha, causa, piso_na_cadeia, cadeia_integra, fim_da_cadeia, posicao_do_piso}`:

| campo | tipo | semântica | quem lê |
|---|---|---|---|
| `cadeia_integra` | `true` · `false` · `null` | `false` = **o leitor afirma** que a cadeia termina em commit cujo objeto tem pais que o clone não tem (raso). `true` = íntegra (raiz verdadeira, ou clone não raso). `null` = cadeia não lida (os três `return` antecipados, `:467/:470/:477`, onde `presente` já é `false`) | `_impedimento` (julgador) e `censo_da_leitura` (gate) |
| `fim_da_cadeia` | sha40 · `null` | SHA em que a caminhada terminou — o detalhe exigido pelo PO | detalhe do impedimento |
| `posicao_do_piso` | int · `null` | `indice` (0 = ponta); `null` = piso fora do trecho lido. `piso_na_cadeia` **permanece** (é o que F1–F24 e a guarda leem) e vale `posicao_do_piso is not None` | detalhe do impedimento |

**Leitura por `is False`, não por `is not True`** — nos dois consumidores. A
afirmação de truncamento é do leitor; ausente/`null` significa "não afirmado" e
cai no comportamento de hoje (sem regressão, F1–F24 intactas, errata realmente
aditiva). A forma estrita (`is not True`) rotularia um leitor que **esqueceu** o
campo como "clone raso" — exatamente o que o PO proibiu (só emitir quando o clone
é raso de fato) — e obrigaria a editar 24 fixtures. O leitor que esquece o campo
continua sendo pego onde já era: guarda de censo (no piso e abaixo) e
`piso-invalido` (acima) — nada piora; e o carrasco dele é a bateria de I/O (T095).

## 3. Onde mora — leitor popula, julgador julga, gate cede a vez

| arquivo | dono | mudança | condição dura |
|---|---|---|---|
| `fecho.py:ler_merges` (`:459-503`) | `core-engineer` | os três campos populados no `od` **entre `:489` e o laço de `merges`** — antes da linha `:503` | a linha `    return {"merges": merges, "origin_develop": od}` fica **byte-idêntica e única** (âncora de `D016-M33`, `tests_016_mutants.js:472`; o preflight exige `ocorrencias == 1`). Sob M33 o `od` sai íntegro (`cadeia_integra true` em árvore completa) ⇒ nenhum impedimento ⇒ a guarda continua sendo quem mata (`0 problema(s)`, `lido 0 ≠ 39`). A detecção lê `cadeia`, **nunca** `merges` |
| `fecho.py:_impedimento` (`:176-190`) | `core-engineer` | ramo novo **entre** o `presente` e o `piso_na_cadeia`: `if od.get("cadeia_integra") is False: return C_HISTORICO_RASO, detalhe` | detalhe (T10, não vazio), formato a **extrair** da implementação para a errata: `NÃO DETERMINÁVEL (histórico raso: a cadeia first-parent de refs/remotes/origin/develop termina em <fim12>, commit cujo objeto tem pais que o clone não tem; piso <piso12> na posição N \| fora do trecho lido — git fetch --unshallow origin; git fetch origin develop NÃO repara)` |
| `fecho.py` constantes + cabeçalho | `core-engineer` | `C_HISTORICO_RASO = "historico-raso"` em `CODIGOS` (17); decisão 2 do cabeçalho ganha o terceiro elo | `CODIGOS` tem de bater com `fecho.json → _meta.contrato_da_sonda.codigos` — a sonda reprova a divergência (é o red) |
| `check_fecho.py:censo_da_leitura` (`:374-397`) | `qa-engineer` | `nao_aplicado` também quando `od.get("cadeia_integra") is False` (detalhe: *"cadeia truncada nomeada pelo leitor — o global `historico-raso` já diz"*); a disjunção do `divergente` passa a *"o leitor não nomeou causa — defeito do instrumento ou truncamento que ele não detecta"* | sem isto o cenário B sairia com **dois** FAIL para uma causa (impedimento + censo) — a regra de composição do PO é **um** FAIL nomeado. Pode ir no commit red: o campo não existe ainda, `is False` nunca casa, nada muda até o green |
| `check_fecho.py` §CONTRATO | `qa-engineer` | "(16)" → "(17)"; "sob um global IMPEDITIVO (esses dois)" → três; shape de `origin_develop`; `ler_merges` cita os dois comandos novos | doc do gate — mesmo commit red |

Orçamento R9 §7: `fecho.py` 562 → ~590 linhas (abaixo de 600, mas no limite — o
próximo crescimento pede justificativa no plano); `check_fecho.py` 536 → ~545.
Boundary: nenhum arquivo é classe protegida (`boundary.json`); `pins.json` só via
`gen_pins.py`. R9 §1–§9 não se aplicam (instrumento Python, não módulo de UI).

## 4. Tipagem (R3)

**`fix`** — confirmado: muda o veredito emitido por um gate (`piso-invalido` →
`historico-raso` em A; `0 problema(s)` → `1` em B). Exige red **provado e
commitado** (T091) antes de `fecho.py` mudar (T093). Red local, sem CI: a sonda
reprova por dois caminhos independentes — `CODIGOS do instrumento ≠ … a menos:
['historico-raso']` e F25/F26 divergentes (`obtido EM VOO` / `obtido
piso-invalido`). Errata e registros são `doc`; harness e repin são `chore`.

## 5. Fixtures novas (para o QA não adivinhar) — ids sob a regra "aditivo, nunca renumerar"

Base comum: os estados/artefatos de F21/F22 (`038-primeira`, `039-segunda`, ambas
`done` com os dois artefatos); `sujeito` = `038-primeira`; `registro` sintético
igual; `data_do_commit` `2026-09-04`; **`ancestralidade` com `resposta: false`**
nas duas (é o que `merge-base --is-ancestor` responde sob cadeia truncada — §11.3
— e é o que faz um julgador sem o impedimento dizer `EM VOO` para demanda
mesclada: a afirmação falsa do EA-39).

| id | `_descricao` | `merges` | `origin_develop` | esperado pinado (`fecho.json → sonda.casos`) | mata |
|---|---|---|---|---|---|
| **F25** | clone raso com a cadeia truncada **no** piso (EA-38): leitor reporta raso, piso na posição 0 | `[]` | `presente true · sha 0d0d… · causa null · piso_na_cadeia true · cadeia_integra false · fim_da_cadeia a1a1… (o piso) · posicao_do_piso 0` | `NÃO DETERMINÁVEL · oraculo null · historico-raso · problemas 1` | **M34** — julgador ignora `cadeia_integra` (ramo removido) ⇒ F25 obtém `EM VOO · 0` |
| **F26** | clone raso com a cadeia truncada **acima** do piso (`depth=1` com `develop` avançada — cenário A): leitor reporta raso, piso fora do trecho lido | `[]` | `presente true · sha 0d0d… · causa null · piso_na_cadeia false · cadeia_integra false · fim_da_cadeia 0d0d… (a ponta) · posicao_do_piso null` | `NÃO DETERMINÁVEL · oraculo null · historico-raso · problemas 1` | **M35** — precedência trocada (`piso_na_cadeia` antes de `cadeia_integra`) ⇒ F26 obtém `piso-invalido`; F25 **não** vê M35 — por isso F26 existe |

`sonda.total` 35 → **37**; `_meta.acrescimos_ea39` (mesma regra de
`acrescimos_da_fase6`, com a razão de cada caso); `codigos` 16 → **17**;
`censo_de_leitura.quando_se_aplica` e `.carrasco` amendados (ver §7).

## 6. Mutantes e onde a campanha fecha

| arquivo editado | campanha disparada (`mutation_map.json → d016.targets`) | ambiente | onde fecha |
|---|---|---|---|
| `fecho.py`, `check_fecho.py`, `fecho.json`, `F25.json`/`F26.json` (entram em `targets`), `tests_016_mutants.js` | **`d016`** — única; nenhum outro harness tem esses alvos (spec §Onde fecha) | `node` + `python`, sem Chromium | **nesta máquina**; no CI roda no `verify` (não é deferida — `MUTATION_DEFER_MISSING` só converte campanha *sem ambiente*) **e** no `visual`. Números por execução: `node tests_016_mutants.js --preflight` (esperado 35 mutantes · 3 controles), nunca pela `_trilha` |

Pares novos: **`D016-M34`**, **`D016-M35`** (instrumento, mortos pela sonda —
§5). **Sem mutante de árvore para a metade do leitor**, por razão medida, não
por preguiça: o harness restaura por bytes + SHA-256 + `git status --porcelain`
escopado (R7 §3) e `.git/shallow` é invisível aos três; `git fetch --depth=1`
numa worktree muta o **`.git` compartilhado pelas nove worktrees** desta máquina
(§5.1 da prova de carga já pagou esse preço com `update-ref`), e `--unshallow`
exige o remoto e **falha** em repositório completo. Carrasco do leitor =
**bateria adversarial de I/O em clone efêmero** (T095), registrada como
`prova-de-carga.md` §12 e declarada em `mutation-matrix.json →
dividas_declaradas` com o nome do carrasco (T096) — a rota que o PO admitiu
("se for caro demais, dívida declarada"). `D016-M33` **não muda**.

## 7. Errata `E016-8` — o que precisa dizer e onde

Onde: `spec.md`, nova seção **"## Errata pós-fecho — fix-finding EA-39
(2026-09-05)"** logo após E016-7, com **`### E016-8`** (a série `E016-N`, como
o PO pediu). Cabeçalho de trilha no molde da §"Errata — portão da Fase 1":
**quem decidiu** (forma: `product-owner`, BACKLOG §EA-39; detecção/campo/lugar:
`tech-lead`, esta nota — **ambos sob a delegação de 2026-08-29, não ratificados
pelo proprietário**), quando, onde, alcance, e **o que NÃO é reaberto**: T10;
C1(e) para ref/`git` ausente (segue `origin-develop-ausente`); F1–F24 e seus
esperados; o piso e o censo 39; `D016-M33`; os dois primeiros elos da
precedência; a guarda de censo (fica — é o oráculo independente); o caminho
`--pr` (não lê histórico, medido). Célula por célula, com a marca `(E016-8)`:

1. **§Casos de borda, linha 10** — separar: *clone raso* ⇒ `NÃO DETERMINÁVEL`
   com código **`historico-raso`** (C1 g); *`git` ausente / ref ausente* ⇒ C1(e)
   como está. Classe **spec-errada**: a borda mandava o raso para C1(e), e a
   ref **está** presente (medido, linhas A/B).
2. **C1** — alínea nova **(g)**: cadeia first-parent de `origin/develop` truncada
   por clone raso ⇒ FAIL `NÃO DETERMINÁVEL`, código `historico-raso`, detalhe com
   o SHA em que a cadeia termina, a posição do piso (ou "fora do trecho lido") e
   o remédio `git fetch --unshallow origin` — nunca `git fetch origin develop`
   (não repara: §11.3, linha E). **C2(d)** ganha a ressalva: `piso-invalido` por
   "fora da cadeia" só com cadeia íntegra; truncada ⇒ `historico-raso`
   (precedência forma → ausente → raso → piso fora da cadeia).
3. **C7 / E016-5 (b)(c)** e `fecho.json → _meta.censo_de_leitura.quando_se_aplica`:
   *"só com `origin/develop` presente, piso na cadeia **e cadeia íntegra**
   (`cadeia_integra` ≠ `false`)"*; composição: leitor nomeia ⇒ global
   `historico-raso` + guarda `nao_aplicado` (**um** FAIL); leitor cala com
   contagem errada ⇒ guarda `divergente` com a disjunção honesta.
4. **§Superfície 1** — Entrada: `git rev-parse --is-shallow-repository` e, só se
   `true`, `git cat-file -p <fim da cadeia>`; Saída: a linha `[FAIL]` do
   impedimento, **extraída** de `fecho.py:_impedimento` depois do green (como a
   E016-5 fez com `relata_pos`), nunca redigida antes.
5. **§Contratos** — `origin_develop` com os três campos e a semântica `is False`
   (§2); F25/F26 (§5), total 37, `codigos` 17; harness `d016`: pares 33 → 35,
   targets 54 → 56, dívida "leitor sob clone raso" com carrasco nomeado.
6. **Tabela de arquivos pinados** — `fecho.py`, `check_fecho.py`, `fecho.json`,
   `F25.json`, `F26.json`, `tests_016_mutants.js`, `mutation_map.json`,
   `mutation-matrix.json`, `spec.md`, `plan.md`, `BACKLOG.md` ⇒ `gen_pins.py`
   em **commit separado após cada commit de conteúdo** (R8 §1; a 008 pagou três
   repins por prever um).
7. **`plan.md` ET3** — uma linha: impeditivos `piso-invalido | origin-develop-ausente
   | historico-raso (E016-8)`. `tasks.md` da 016 **não muda** (ids desta nota
   ficam fora do intervalo dela).

Classe do conjunto: **aditiva**, com o item 1 **spec-errada**. Nada enfraquece:
o cenário B passa de `exit 1 · 0 problema(s)` (guarda) para `exit 1 · 1
problema` nomeado; o A troca um detalhe falso por um verdadeiro; o C continua
`exit 0`. Nenhum id renumera; nenhuma boundary se amplia; nenhum veredito de
gate **alheio** muda.

## 8. Tarefas — waves pela dependência real

Ids permanentes fora do intervalo do `tasks.md` da 016 (que termina em T085).
Um módulo por delegação; `[P]` só quando os arquivos são disjuntos.

| Id | Wave | Dono | Tipo | [P] | Tarefa | Prova |
|---|---|---|---|---|---|---|
| T090 | 0 | qa-engineer (texto do TL: §7) | doc | | `E016-8` em `spec.md` (+ células C1/C2/C7/borda 10/§Contratos), linha ET3 em `plan.md`. **Antes do red**: o `spec-validate` extrai critérios da spec, e o QA precisa saber que escreve F25/F26 e M34/M35 antes de escrever o primeiro | leitura; commit próprio |
| T091 | 1 | qa-engineer | fix (red) | | `fecho.json` (`codigos` 17, F25/F26 em `sonda.casos`, `total` 37, `_meta.acrescimos_ea39`, `censo_de_leitura` amendado), `F25.json`/`F26.json` (§5), `check_fecho.py` (§CONTRATO + `censo_da_leitura` `is False` ⇒ `nao_aplicado` + disjunção honesta), `mutation_map.json → d016.targets` +2. **Executar e commitar o FAIL** (R3 §4) | `check_fecho.py --sonda` ⇒ guarda `CODIGOS … a menos: ['historico-raso']` + `✗ F25` (`obtido EM VOO`) + `✗ F26` (`obtido piso-invalido`), exit 1; stage `fecho` ⇒ *árvore não julgada*; sonda `37 caso(s)` |
| T092 | 1 | qa-engineer | chore | [P] | **Medição pré-fix em clone efêmero** (origin = GitHub ou refspec `refs/remotes/origin/develop`): cenários A, B, C, D e E de §0 com o código de HEAD — fixa o "antes" que T095 compara. Nada escrito na worktree | tabela em `prova-de-carga.md` §12.1 |
| T093 | 1 | build-engineer | chore | | **Repin R1** — fecha o commit red | stage `baseline` |
| T094 | 2 | core-engineer | fix (green) | | **Só `fecho.py`**: `C_HISTORICO_RASO` em `CODIGOS`; ramo em `_impedimento` na posição da precedência (§3); detecção em `ler_merges` populando `cadeia_integra`/`fim_da_cadeia`/`posicao_do_piso` **antes de `:503`**, âncora de M33 intacta e única; cabeçalho decisão 2 + docstring. Gate no prompt: `check_fecho.py --sonda` + `node tests_016_mutants.js --preflight` (M33 `ocorrencias=1`) | sonda `37 · 0`; gate nu `39 (ok) · 0 problema(s) · exit 0`; preflight sem âncora podre |
| T095 | 2 | build-engineer | chore | | **Repin R2** — fecha o commit de `fecho.py` | stage `baseline` |
| T096 | 3 | qa-engineer | chore | | `tests_016_mutants.js`: `D016-M34`/`D016-M35` (§5; comentários `:41` e `:680` citam o terceiro global); campanha `d016` integral; **bateria adversarial pós-fix** (A ⇒ `historico-raso` + `nao_aplicado` + 1 problema; B ⇒ idem, `em_voo 0`; **C ⇒ exit 0 · 39 ok, byte-idêntico ao pré-fix**; D ⇒ `--pr --json` byte-idêntico raso × completo; E ⇒ `--unshallow` restaura) ⇒ `prova-de-carga.md` §12.2; `mutation-matrix.json → dividas_declaradas` "leitor sob clone raso — carrasco: bateria §12, reexecutada a cada mudança de `ler_merges`" | `35/35 DETECTADO · 3 controles OK`; M33 kill inalterado (`censo divergente 39/0 · 0 problema(s)`) |
| T097 | 3 | build-engineer | chore | | **Repin R3** — fecha o commit do harness/registros | stage `baseline` |
| T098 | 4 | qa-engineer + doc-writer | doc | | Validação: `bash .claude/verify/run.sh` completo; `BACKLOG.md` §EA-39 ⇒ `resolvido` com **o que foi feito** (skill §4), §EA-38 ganha a prova do run `33946727326` (`visual` verde em `pull_request`) **e** a ressalva: `C0-fecho` sob `pull_request` só é exercido pelo PR **deste** fix (é o primeiro diff que dispara `d016` depois de `8ec429a`) — ler no primeiro run do PR, jobs `verify` e `visual`, a linha `controle: C0-fecho · OK · … 39/39` | contagens do `run.sh`; run do PR citado por id |
| T099 | 4 | build-engineer | chore | | **Repin R4** (se T098 tocar pinado) e PR `fix/ea39-leitor-mudo → develop`; merge é do usuário | `baseline` verde; três checks do PR |

Entre um commit de conteúdo e seu repin o stage `baseline` fica vermelho — por
isso cada repin segue **imediatamente** o commit que o exige, e nunca se junta a
outro conteúdo (R8 §1; memória da 009/008).

## 9. O que esta nota não decide

- Se o residual "truncamento fora da cadeia first-parent" merece código um dia:
  não hoje (R12), fica na dívida de T096 com o cenário C como testemunha.
- A linha `[INFO]` do `relata_pos` poderia imprimir `cadeia: íntegra | truncada
  em <sha12>` — cosmético, do QA, fora do mínimo deste fix.
- A prova viva de EA-38 sob `pull_request` **com** `d016` executada é o primeiro
  run do PR deste fix (T098) — não existe antes dele.
