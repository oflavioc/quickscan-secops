# Spec — 017-semantica-do-gatilho

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> Árvore medida: worktree `phase5-014`, branch `feature/017-semantica-do-gatilho`,
> HEAD `abdddd0` (Fase 0 commitada sobre `9d617d0`). **Toda linha citada foi lida
> nesta árvore em 2026-09-06**, e — diferente da Fase 0 — o que se afirma sobre
> `arquivos_mutados` foi **executado**: `<cmd> --preflight` dos onze harnesses com
> preflight (exit 0 nos onze) e a expressão literal do `IC-6`
> (`check_mutation.py:400-403`) reproduzida sobre os onze, em Python, fora da
> árvore. Onde a medição diverge do que o orquestrador passou, está dito
> (§Correção de fato). A Fase 0 foi **aprovada em bloco** pelo usuário no chat em
> 2026-09-05: as treze recomendações da rodada 1 são resposta, e esta spec as
> formaliza sem reabri-las.

## Objetivo

Trocar, no stage `mutation`, a **identidade** entre gatilho e conjunto mutado
(hoje nominal à `p51`, `IC-6`) pela **inclusão com razão de classe legível por
máquina** — `targets ⊇ arquivos_mutados ∪ {harness}`, faltante FAIL sem exceção,
excedente sem razão é alvo fantasma e FAIL, excedente com razão de classe é
insumo de prova e passa, nomeado — para **todo** harness com preflight, sem
reprovar o oráculo que R3 §5 (`.claude/rules/tdd.md:17`) manda vigiar.
Link: [refinement.md](refinement.md) §Enquadramento de produto.

## Decisões técnicas fixadas (as três raias devolvidas pelo `product-owner`, e duas que só apareceram medindo)

| # | Decisão | Fundamento medido |
|---|---|---|
| **D1** | **Forma canônica do path: relativa à raiz do repositório, separador `/`, sem `./`, sem `..`, sem `/` inicial — a forma de `git diff --name-only`.** Vale para `targets`, `arquivos_mutados` e `insumos`. É **errata aditiva do C1 da 013** (`specs/013-integridade-da-campanha/spec.md:205-226` não fixa forma; o exemplo só tem arquivos da raiz) e **entra nesta demanda** como pré-condição de C1/C2 abaixo — sem ela o gate mente (§Correção de fato: 12 faltantes falsos). **Quem migra é o emissor**, e só onde o **valor** emitido viola a forma: `d014` (`tests_014_mutants.js:303`, 2 paths sob `.claude/verify/`) e `d016` (`tests_016_mutants.js:555`, 10 paths sob `.claude/`). Os outros oito que usam `path.basename(m.file)` (`tests_009_mutants.js:441`, `010:381`, `011:395`, `014_visual:237`, `015:294`, `p50:855`, `p51:321`, `p52:1512`) mutam **só arquivos da raiz**, onde basename ≡ path relativo — o valor já é canônico e eles **não são tocados**; a `ea41` já emite repo-relativo (`tests_ea41_mutants.js:114`, `:263`). O consumidor **não normaliza**: rejeita forma fora do contrato (C4), porque normalizar esconderia no Windows o `\` que o CI Linux nunca veria (R7 §5 — determinismo por construção, não por plataforma) | Preflight executado 11/11; `git diff --name-only` é a forma de `changed` (`check_mutation.py:471`) e do laço de trigger (`:1333`). Rito: os dois harnesses são **pinados** (`pins.json:425`, `:430`), **não** estão em `boundary.json`, `PROTECTED` (`tests_p50_core.js:82`) nem `frozenSuites` (`:473-476`); `requires: node, python` nos dois — a campanha que eles redisparam **fecha localmente** (§Contratos, tabela do gatilho). Nenhum harness com `requires: chromium` é tocado, como o §Fora de escopo do refinamento exige |
| **D2** | **A razão de classe mora numa chave irmã de `targets`: `insumos`, objeto `classe → [paths]`, com vocabulário fechado de quatro classes** (`oraculo`, `fixture`, `populacao`, `declaracao` — §Vocabulário fechado). Nem campo por arquivo (45 razões na `d016` que ninguém lê), nem uma razão por harness (rótulo), nem anotar `targets` (o laço de trigger lê lista plana, `:1333`; INV-10 e P1.13 mantêm a chave). A classe **é** o nome da relação: cada uma responde "o que muda na prova se este arquivo mudar?" de um jeito, e todo membro responde igual (borda 7). `"endurece o trigger"` não é classe — é efeito; classe fora do vocabulário reprova (C3). `insumos` ausente ≡ `{}` (identidade, borda 9 — `p50`/`p51`/`p52`/`d014vis` não mudam) | Os 58 excedentes semânticos de hoje cabem **58/58** nas quatro classes (§Correção de fato, última tabela). Precedente de forma: `preflight` e `receipts` são chaves irmãs de `targets` no mesmo objeto (`mutation_map.json:9`, `:71-73`), consumidas por `check_mutation.py` |
| **D3** | **A "declaração de população" do `EA-3` não entra** (voto do PO acompanhado). O que a 017 **deixa pronto** para ela: (i) a distinção **coberto** (∈ conjunto mutado de algum harness) × **vigiado** (∈ gatilho de algum harness) como **dado** — o julgador puro devolve, por harness, a classificação de cada path em `mutado` / `harness` / `insumo(classe)`; (ii) a forma canônica (D1), sem a qual a união entre harnesses não é comparável com `git ls-files`; (iii) `insumos` como o registro que impede o `EA-3` de contar oráculo como cobertura. A população em si, o órfão e o "11 de 14 / 17 de 35" (`BACKLOG.md:393` e a §Correção do próprio texto do achado) continuam do `EA-3` | Borda 12 do refinamento: a 017 torna o gatilho **verdadeiro**, não **completo** |
| **D4** | **O `IC-6` é substituído, não enfraquecido, e isto é o que o portão desta Fase ratifica.** O bloco nominal (`check_mutation.py:395-412`) sai; entram `D017-REL1`/`REL2`/`INS1`/`FORM1` sobre todo harness com preflight. Para a `p51` **hoje** (identidade, sem `insumos`) os dois predicados são **idênticos**; o único estado que era FAIL e passa a OK é "excedente com razão de classe válida" — a decisão de produto P1.1/P1.3, exigida por R3 §5. Os dois mutantes que fizeram o `IC-6` nascer (`M-IC8`, `M-IC9`, `spec.md:116` da 013) **continuam mortos**, re-executados contra o gate novo (`D017-M1`/`M2`). O id `IC-6` fica **reservado** (R12), a linha `[OK] IC-6` deixa de existir, e a 013 recebe **errata aditiva** (§Erratas a aplicar na 013). Manter o `IC-6` ao lado do gate novo não é opção: proibiria a `p51` de vigiar o próprio oráculo — a Necessidade do refinamento | `IC-6` foi aprovado **sob delegação** (`a052617`, cabeçalho de §Erratas da 013); a superação vem por **spec aprovada pelo usuário**, o rito mais forte. R10 §1 proíbe afrouxar *para passar*; aqui a regra muda por decisão registrada e os carrascos originais seguem vivos — é fortalecimento (o excedente passa a exigir razão estruturada onde antes bastava… nada, porque a asserção só existia para um harness) |
| **D5** | **Onde vive a prova de que o julgador não mente**: (a) **sonda em processo** com dados sintéticos e **contagem pinada em dado** (`mutation_map.json → _meta.sonda_relacao.total`, R10 §3 — a 013 pinou "7 cenários" só em prosa; a 016 pinou `sonda.total` em `fecho.json`, e é esse o precedente seguido), executada a cada run do stage — a metade **permanente**; (b) **mutantes de árvore** sobre o mapa e sobre cópia efêmera dos harnesses, mortos no red e registrados em `red-017.md` — a metade **one-shot**, cuja não re-execução tem credor nomeado: `EA-42` (`BACKLOG.md:3276`, "bateria efêmera de instrumento"). O `core` **não recebe** julgamento: sai como dívida com credor `EA-44` (`BACKLOG.md:3409`), P1.7 | Precedentes `IC-9.4` (`check_mutation.py:994-1090`) e `IC-10` (`:1150-1282`): julgador puro + cenários sintéticos + `len(...)` impresso; `M-IC19` como o mutante de **fiação** que a sonda não vê e a árvore mata |

## Correção de fato (medições desta Fase 1)

### Medição A — a relação, harness a harness, por execução

Conjunto mutado lido do JSON de `--preflight` (contrato C1); gatilho lido de
`mutation_map.json`; **semântico** = mesmo arquivo é o mesmo elemento
independentemente da forma; **literal** = a expressão de `:400-403` como está.

| Harness | `arquivos_mutados` (n) | ∪ harness | `targets` (n · linhas) | Excedente semântico | Faltante | **Literal** exc./falt. |
|---|---|---|---|---|---|---|
| `d010` | 2 | 3 | 5 · `:10-16` | 2 | 0 | 2 / 0 |
| `d009` | 6 | 7 | 9 · `:26-36` | 2 | 0 | 2 / 0 |
| `core` | — (sem preflight, `check_mutation.py:119`) | — | 4 · `:45-50` | **não medível** | — | — |
| `p50` | 4 | 5 | 5 · `:59-65` | 0 | 0 | 0 / 0 |
| `p51` | 6 | 7 | 7 · `:78-86` | 0 | 0 | 0 / 0 |
| `p52` | 8 (inclui `tests_p52_chromium.js`) | 9 | 9 · `:96-105` | 0 | 0 | 0 / 0 |
| `d014` | 5 (`regra_morta.js`, `regra_morta_seletor.js` em **basename**) | 6 | 10 · `:119-130` | 4 | 0 | **6 / 2** |
| `d011` | 3 | 4 | 5 · `:140-146` | 1 | 0 | 1 / 0 |
| `d014vis` | 1 | 2 | 2 · `:156-159` | 0 | 0 | 0 / 0 |
| `d015` | 1 | 2 | 4 · `:170-175` | 2 | 0 | 2 / 0 |
| `d016` | 10 (todos em **basename**; inclui `999-sintetica-d016.json` criado, `F5.json` e `sem_fecho.json` removidos) | 11 | 56 · `:184-241` | 45 | 0 | **55 / 10** |
| `ea41` | 1 (`.claude/verify/fixtures_ea41/sujeito.md`, **repo-relativo**) | 2 | 4 · `:251-256` | 2 | 0 | 2 / 0 |
| **Total** | | | | **58** | **0** | **70 / 12** · 7 de 11 vermelhos |

**Confirma** o refinamento (Medição 2) e o orquestrador em: 7 de 11 vermelhos
sob a identidade generalizada; **faltante semântico zero nos onze**; `d016` 45,
`d014` 4; `p52` muta `tests_p52_chromium.js`.

**Diverge** do que o orquestrador passou num ponto, e a divergência é de
localização, não de tese: a **`ea41` não produz faltante falso** — literal
2 / 0, porque ela já emite repo-relativo e o gatilho também (`:253`); os 12
faltantes falsos estão na **`d014` (2)** e na **`d016` (10)**, os dois harnesses
que emitem basename para arquivos sob `.claude/`. O "exc 3 + falt 1 da `ea41`"
do brief do planning-state não se reproduz nesta árvore. A tese ("a comparação
literal mente por forma de path, e a mensagem que mente é a mais grave") fica
de pé — só que o exemplo é `.claude/verify/regra_morta.js` × `regra_morta.js`.

### Medição B — as 58 razões cabem em quatro classes, sem resíduo

| Classe | Membros hoje (58) | Fonte da razão em prosa |
|---|---|---|
| `oraculo` (5) | `tests_010_vao.js` · `tests_009_leitura.js` · `tests_011_prioridade.js` · `tests_015_apoio.js` · `.claude/verify/check_eol_text.py` | `_trilha` `:21`, `:41`, `:151`, `:180`, `:261` |
| `fixture` (47) | `fixtures_010_vao.js` · `fixtures_009_leitura.js` · `fixtures_015_apoio.js` · **44** de `fixtures_016/**` (as 46 listadas em `:194-239` menos `F5.json` e `sem_fecho.json`, que são conjunto mutado) | `:21`, `:41`, `:180`, `:246` |
| `populacao` (4) | `ui_v32.css` · `ui_ux_v32.css` · `ui_p52_workspace_v32.css` · `ui_d011_prioridade_v32.css` (`d014`) | `:135` — a varredura **lê** as cinco folhas; uma é mutada |
| `declaracao` (2) | `.gitattributes` (`ea41`) · `.claude/verify/branch_protection.json` (`d016`) | `:261`; `specs/016-registro-contra-execucao/spec.md:90-91` (expectativa e `sonda.total` pinado vivem nele) |

Nenhum excedente precisou de quinta classe; nenhum membro precisaria de
resposta diferente da do seu grupo à pergunta da borda 7. É a primeira cobrança
do refinamento respondida antes do gate nascer: **nenhum harness de hoje
precisa escrever parágrafo de desvio** sob a regra nova.

### Medição C — o que a demanda edita dispara o quê

| Arquivo editado pela 017 | Campanha disparada (`targets`) | Ambiente | Onde fecha |
|---|---|---|---|
| `tests_014_mutants.js` | `d014` (9 mutantes) | node + python | **local** |
| `tests_016_mutants.js` | `d016` (35 mutantes + 3 controles; ~1 min segundo `:246`) | node + python | **local** |
| `.claude/verify/mutation_map.json` · `check_mutation.py` · `mutation-matrix.json` · `CONTEXT.md` · `.claude/BACKLOG.md` · `specs/**` | **nenhuma** (nenhum está em `targets` de harness algum — medido) | — | — |

A demanda **fecha inteira nesta máquina**; o job `visual` só executa as
asserções novas como parte do `check_mutation.py` que ele já roda.

## Vocabulário fechado (normativo)

Identificadores de instrumento (INV-10, ASCII, como `nao_executavel` do C1) —
**não** são termos de domínio e não vão ao `CONTEXT.md` (refinamento §Vocabulário,
"não registrados, de propósito"). Acréscimo de classe é **errata desta spec com
id**, nunca prosa em `_trilha`.

| Classe | Relação que nomeia (a resposta à pergunta da borda 7) | Não é |
|---|---|---|
| `oraculo` | o instrumento que **julga** o mutante — suíte de gate ou gate Python que a campanha executa; mudar nele muda **quem julga** | o harness (entra por si, sem razão) |
| `fixture` | o **caso** que o oráculo lê — estado sintético sob controle da prova; mudar nele muda **o que é julgado** sem mudar o produto | arquivo do produto |
| `populacao` | arquivo **real** que o oráculo **varre** como universo; mudar nele muda o resultado da varredura sem mudar o que a campanha muta | fixture (não é sintético) · conjunto mutado (a folha mutada da `d014` é `ui_p50_v32.css`, não estas) |
| `declaracao` | a **expectativa** ou **declaração** que a prova pressupõe e o gate compara — atributo de repositório, registro de estado esperado, contagem pinada; mudar nela muda **o que a campanha prova** | receipts (`mutation_map.json:71-73`, `:112-114` — borda 11, fora da relação) |

Vocabulário de **saída** do bloco (tokens normativos; a forma final da linha é
**extraída do executável** no `spec-validate`, nunca redigida antes — lição
`E016-5`): `conjunto mutado fora do gatilho` (REL1) · `alvo fantasma (sem razão
de classe)` (REL2) · causas fechadas de INS1: `classe fora do vocabulário`,
`classe sem membros`, `razão sem gatilho`, `insumo que é conjunto mutado`,
`path em duas classes` *(Errata `INS1(f)` · Fase 4: e a **sexta**, estrutural — `insumos malformado — não é objeto classe → [paths]: <tipo>`, sem `<classe> (<paths>)`; §Erratas da Fase 4)* · `path fora da forma canônica` (FORM1) *(Errata `INS1(f)` · Fase 4: também para elemento **não-string** — impresso por `repr` — ou **vazio**)* · `relação
gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)` (CORE1) ·
diagnóstico anexo `forma do path? mesmo basename nos dois lados: <nome>`.

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Namespace da demanda: **`D017-*`** (gates) e **`D017-M<n>`** (mutantes) — série
nova, sem colisão com `IC-*`/`EA-*`/`D016-*`/`EA41-*` (R10: nunca continuar
numeração alheia). Todos os gates são asserções do stage **`mutation`**
(`.claude/verify/check_mutation.py`, já em `pipeline.yaml:89-94`), num **bloco
aditivo** `---- semântica do gatilho (017) ----` com contador e fecho próprios,
somado a `fails` como `EX_FAILS`/`GP_FAILS` (`:1328`); roda depois de IC-4
(consome `IC_PREFLIGHT`) e no lugar do bloco IC-6 (`:395-412`); IC-5 fica
intacto. Nenhum stage novo, nenhuma suíte contada nova.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | **Conjunto mutado contido no gatilho — faltante é FAIL sem exceção** (P1.2, borda 6). Para todo harness com preflight: `(arquivos_mutados ∪ {fontes do cmd}) − targets = ∅`, comparação de strings **após** C4. O próprio harness fora do gatilho é faltante como qualquer outro | **`D017-REL1`** · `check_mutation.py` · por harness: `[FAIL] D017-REL1: <h> · conjunto mutado fora do gatilho: <paths>`; verde ⇒ contribui para a linha `[OK] D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>)`. Preflight que fracassou ⇒ `[NOTA] D017: <h> · não medida — IC-4 já o nomeou` (nunca FAIL duplicado, precedente IC-10.1 `:1195`) | **`D017-M1`** (= `M-IC8`, regressão): remover `USER_GUIDE.md` de `p51.targets` (`:79`) → FAIL nomeando `p51` e o path. **`D017-M3`**: remover `.claude/verify/regra_morta.js` de `d014.targets` (`:128`) → FAIL nomeando o path **aninhado** (pós-green: exige D1 aplicada). Sonda ii/viii. **Nasce verde 11/11** (Medição A) — os carrascos são os dois mutantes em cópia efêmera e a sonda, declarado na guarda de tautologia. *(Errata `D017-M19` · Fase 3: o ramo `[NOTA]` desta célula ganha carrasco próprio — `D017-M19`, mutante de fiação, morto em cópia sob o estado NOTA; §Erratas da Fase 3)* |
| **C2** | **Excedente sem razão de classe é alvo fantasma — FAIL nomeando o path** (P1.3, borda 5). `fantasma = targets − (arquivos_mutados ∪ {fontes}) − ⋃ insumos[classe válida]` = ∅. Excedente **com** razão passa e é **nomeado** por classe e contagem na linha `[OK]` | **`D017-REL2`** · `check_mutation.py` · `[FAIL] D017-REL2: <h> · alvo fantasma (sem razão de classe): <paths>`; verde ⇒ `[OK] D017: <h> · … · insumos: oraculo <k>, fixture <k>, …` | **`D017-M2`** (= `M-IC9`, regressão): devolver `ui_session_v32.js` a `p51.targets` → FAIL `alvo fantasma`. **`D017-M4`**: remover a classe `fixture` dos `insumos` da `d010` → `fixtures_010_vao.js` vira fantasma. Sonda iii. **Red natural: 7 de 11 vermelhos, 58 fantasmas**, até C7 |
| **C3** | **Razão de classe bem formada** (P1.4, bordas 1 e 7): (a) classe ∈ vocabulário fechado; (b) lista não vazia de strings; (c) todo path de `insumos` ∈ `targets` — razão sem gatilho é contradição; (d) nenhum path de `insumos` ∈ `arquivos_mutados ∪ {fontes}` — mutado **e** insumo é dupla classificação, e a mais forte vence sem declaração; (e) um path em uma só classe. Entradas inválidas ficam **fora** do cômputo de C2 (um FAIL por causa; os paths saem nomeados na causa de INS1, não repetidos como fantasma) *(Errata `INS1(f)` · Fase 4: **(f)** `insumos` **presente e não-objeto** — lista, string, número, booleano —, a pré-condição estrutural de (a)–(e): nomeado com o **tipo** e tratado como `{}` no resto do cômputo, de modo que os excedentes que a razão malformada cobriria **saem em REL2**; `null` ≡ ausente ≡ `{}` (borda 9), medido. As causas fechadas passam a **seis**. Carrasco `D017-M20` em cópia (T022), fora da sonda — §Erratas da Fase 4)* | **`D017-INS1`** · `check_mutation.py` · `[FAIL] D017-INS1: <h> · <causa fechada>: <classe> (<paths>)` *(Errata `INS1(f)` · Fase 4: para (f) a forma é `[FAIL] D017-INS1: <h> · insumos malformado — não é objeto classe → [paths]: <tipo>` — sem classe nem paths, porque não há objeto de onde tirá-los)* | **`D017-M5`**: classe `endurece_trigger` nos `insumos` da `d010` → (a). **`D017-M6`**: `ui_v32.js` declarado `populacao` em `d015.insumos` → (d). **`D017-M7`**: `tests_p50_core.js` declarado `oraculo` em `p51.insumos` **sem** entrar em `targets` → (c). Sonda v/vi/vii/xii/xiii. **Nasce verde por vácuo** (nenhum `insumos` existe hoje) — declarado. *(Errata `INS1(f)` · Fase 4: **`D017-M20`** — `d010.insumos` trocado por `[]` em cópia, no **estado C** (T022) → (f) `list` **e** REL2 com os dois paths que a razão cobria; medido no protótipo da errata)* |
| **C4** | **Forma canônica do path antes de comparar** (D1, borda 8): (a) todo elemento de `targets`, `arquivos_mutados` e `insumos` sem `\`, sem prefixo `./` ou `/`, sem segmento `..` — violação é FAIL nomeando o conjunto e o path; **nenhuma normalização** no consumidor; *(Errata `INS1(f)` · Fase 4: e **elemento não-string ou string vazia** — a pré-condição de "path" —, impresso por `repr` quando não-string e cru quando vazio (medido: a linha termina em `: ` sem sujeito — candidata **de forma** no relatório final, não conserto); `fontes` (o token do `cmd`, PP-9) segue **fora** de FORM1, como a lista dos três conjuntos diz. Carrasco `D017-M21` em cópia (T022))* (b) quando um faltante e um fantasma do mesmo harness compartilham basename, a mensagem de C1/C2 leva o diagnóstico `forma do path? mesmo basename nos dois lados: <nome> — C1 exige path relativo à raiz`; (c) `d014` e `d016` passam a emitir repo-relativo (`tests_014_mutants.js:303`, `tests_016_mutants.js:555`: `path.relative(HERE, f).split(path.sep).join("/")` ou equivalente) e C1 fecha verde neles **com** os paths aninhados | **`D017-FORM1`** · `check_mutation.py` · (a) `[FAIL] D017-FORM1: <h>/<conjunto> · path fora da forma canônica: <path>` com `<conjunto>` ∈ {`targets`, `arquivos_mutados`, `insumos`}; (b) diagnóstico anexo às linhas de REL1/REL2; (c) `--preflight` da `d014` contém `.claude/verify/regra_morta.js` e `.claude/verify/regra_morta_seletor.js`; o da `d016` contém os 10 paths com diretório, e REL1 = ∅ nos dois | **`D017-M8`**: reverter a emissão da `d014` para `path.basename(m.file)` em cópia efêmera → REL1 `regra_morta.js` + REL2 `.claude/verify/regra_morta.js` **com** o diagnóstico (b). **É o estado de hoje** — red natural medido: `d014` 6/2, `d016` 55/10. **`D017-M9`**: `.claude\verify\regra_morta.js` em `arquivos_mutados` da cópia → (a). Sonda xi/xiv. (a) nasce verde por vácuo — declarado. *(Errata `INS1(f)` · Fase 4: **`D017-M21`** — `7` e `""` acrescentados a `d010.targets` em cópia, no **estado C** (T022) → duas linhas FORM1 em `d010/targets`, **nenhum** `[OK] D017: d010`, **nenhum** REL2 da `d010`; medido)* |
| **C5** | **`core` sem preflight: dívida com credor, nunca `[OK]`, nunca silêncio** (P1.7, borda 4). Para todo nome em `IC_SEM_PREFLIGHT` (`:119`) a relação sai como não medida; a lista é fechada por construção — harness novo sem `preflight: true` já reprova IC-4 (`:283-287` → `:343`). `tests_core_mutants.js` **não é tocado** | **`D017-CORE1`** · `check_mutation.py` · `[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)`, impressa **no bloco da 017**; a linha `[DÍVIDA] core: sem preflight declarado …` de T8 (`:337-338`) permanece **byte-idêntica** no bloco da 013 — são duas consequências da mesma causa, em dois blocos, e a rota aditiva evita amendar um literal normativo da 013 (`spec.md:38`) que esta demanda não reabre; nenhuma linha `[OK] D017: core` | **`D017-M14`**: julgador devolve `ok` para conjunto mutado `None` → sonda ix. O estado da árvore **alcança** a linha (o `core` existe); o estado "core como OK" só é alcançável por mutante de instrumento — declarado |
| **C6** | **O julgador não mente — sonda em processo com contagem pinada em dado** (D5). `mut_relacao(...)` é função **pura** (sem I/O; recebe `targets`, `insumos`, `arquivos_mutados` ou `None`, fontes do harness; devolve `{estado, faltante, fantasma, insumos_ok, problemas, forma}`), exercitada sobre **15 cenários sintéticos** (§Comportamento) antes da árvore real; cada veredito comparado ao esperado; `len(cenários)` comparado a `mutation_map.json → _meta.sonda_relacao.total` | **`D017-SONDA1`** · `check_mutation.py` + `mutation_map.json` · `[OK] D017-SONDA1: mut_relacao discrimina nos 15 cenários da sonda (pinado: _meta.sonda_relacao.total)`; divergência ⇒ `[FAIL] D017-SONDA1: cenário <n> · esperado … · obtido …`; `total ≠ pinado` ⇒ FAIL nomeando as duas contagens | **`D017-M10`** ignora `insumos` → iv/xv · **`D017-M11`** fantasma vira nota → iii · **`D017-M12`** aceita qualquer string como classe → v · **`D017-M13`** compara por basename → xi · **`D017-M15`** não exige o harness no gatilho → viii · **`D017-M16`** não vê dupla classificação → vi · **`D017-M18`** sonda encurtada (um cenário a menos) → `14 ≠ 15`. **`D017-M17`** (fiação: julgador correto que o laço não consome / contador não sobe) **sobrevive à sonda** — declarado em `dividas_declaradas`, morre por `D017-M2` em cópia efêmera (precedente `M-IC19`). *(Errata `D017-M19` · Fase 3: `D017-M19` — o ramo `[NOTA]` da fiação — também sobrevive à sonda por desenho e morre em cópia sob o estado NOTA; mesma família de `M17` em `dividas_declaradas`)* |
| **C7** | **As 58 razões migram para `insumos` nesta demanda — o vermelho de C2 não nasce crônico** (P1.3; `EA-5` como custo a evitar). Sete harnesses recebem a chave (Medição B, tabela em §Contratos); `p50`/`p51`/`p52`/`d014vis` não recebem nada; as `_trilha`s **não são reescritas** (R2 §5) — `d009` (`:41`, "precedente p52" é falsa analogia) e `d016` (`:246`, `:1287` → `:1333`) ganham **nota datada** de uma linha | **`D017-REL2` verde nos 11**, **`D017-INS1` verde nos 11**, com a linha `[OK] D017: <h> · … · insumos: …` nomeando classe e contagem em 7 harnesses e sem sufixo nos 4 de identidade; `insumos` do `d016` com **44** `fixture` derivadas de `git ls-files .claude/verify/fixtures_016/` menos as duas mutadas (nunca digitadas — precedente T060 da 016) | **`D017-M4`** (acima) é o carrasco da migração: retirar uma classe migrada reacende C2. A segunda cobrança do refinamento (fantasma que passa) é `D017-M2` |
| **C8** | **`IC-6` substituído sem enfraquecimento** (D4): o bloco `:395-412` sai; `M-IC8`/`M-IC9` são re-executados contra o gate novo e morrem (`D017-M1`/`M2`); `IC-5` intacto (`:414-461`); cabeçalho `:64-67` e comentário `:376-379` atualizados; id `IC-6` reservado; nenhuma outra asserção de `check_mutation.py` muda de veredito | `red-017.md` (tabela dos dois, com saída) + regressão executada: `python .claude/verify/check_mutation.py` no HEAD final imprime `IC-1`, `IC-2`, `IC-4`, `IC-5`, `IC-9`, `IC-10` com os **mesmos vereditos** do HEAD `abdddd0` (0 problemas na seção de integridade) e **nenhuma** linha `IC-6` | `D017-M1`/`M2` **são** a prova — os mesmos dois estados que a 013 usou como red natural, agora contra `D017-REL1`/`REL2` |
| **C9** | **Erratas aditivas na spec da 013 e registros** (P1.12; R2 §5): errata `IC-6` (três pontos: `:116`, `:194`, `:231-232`) e errata `C1` (`:205-226`), na forma da §Erratas da própria 013 (`:462-495`: nota inline em cada ponto + seção única), **sem apagar redação original**; `BACKLOG.md`: nota datada em `EA-3` (o que a 017 deixou pronto) e em `EA-44` (credor nomeado pela linha do stage); achado novo para os dois pontos cegos de `ic_estatico` (`check_mutation.py:171-182`; refinamento §Divergências 4); correção da citação de `EA-44` (`spec.md:441-442` → `:440-441`, divergência 5) | `spec-validate` da Fase 6 — leitura: cada ponto tocado cita `(Errata IC-6 · demanda 017)` / `(Errata C1 · demanda 017)` e aponta para esta spec; `specs/013-…/spec.md` e `BACKLOG.md` são pinados (`pins.json:389`, `:18`) — `gen_pins.py` no mesmo PR, commit separado | — (tipo `doc`, R3; sem red) |

**Nascimento de gate (R10)**: **positivo** = C7 (11/11 verdes com insumos
nomeados) e sonda i/iv/x/xv; **negativo** = C2 no estado de hoje (58 fantasmas
em 7 harnesses), C4(b) no estado de hoje (`d014`/`d016`), `D017-M1`…`M7` *(e `D017-M19` sob o estado NOTA — Errata `D017-M19` · Fase 3)* *(e `D017-M20`/`M21` — Errata `INS1(f)` · Fase 4; `M21`, elemento vazio e não-string, é adversarial da mesma família de `M9`)*;
**adversarial** = `D017-M9` (barra invertida), sonda v (classe inventada), vi
(dupla classificação), vii (razão sem gatilho), xi (basename × repo-relativo);
**regressão** = `M-IC8`/`M-IC9` re-mortos (C8), IC-1/2/4/5/9/10 com vereditos
idênticos, laço de trigger `:1333` byte-idêntico, `DEFER`/`FAIL` de ambiente
intactos, `receipts` intactos. **Oráculo independente da implementação**: JSON
de C1 entre executáveis (R10 §6); mutantes de árvore rodam sobre **cópia**
(R7 §3); a sonda é pura e pinada em dado. **Nada é enfraquecido** (R10 §1) —
ver D4 e §Cross-check.

### Guarda de tautologia — por alínea

Exigência do portão (precedente 014 `spec.md:87`, 015 `:283`): existe estado
alcançável em que a alínea falha? Onde a resposta é "só por mutante", está escrito.

| Alínea | Nasce | Estado alcançável de falha? | Consequência declarada |
|---|---|---|---|
| `D017-REL1` | **verde 11/11** (semântico) | **Sim, em cópia**: `D017-M1` (hoje) e `D017-M3` (pós-green). E o estado real de `d014`/`d016` sob a comparação literal **é** um faltante — falso por forma, o que C4 diagnostica | Carrasco em cópia efêmera + sonda ii/viii; a árvore não tem faltante real — dito, não maquiado |
| `D017-REL2` | **vermelho 7/11** | Sim — é o red natural (58) | Fecha por C7, nunca por afrouxar |
| `D017-INS1` (a)–(e) *(Errata `INS1(f)` · Fase 4: (a)–**(f)**)* | **verde por vácuo** (nenhum `insumos` hoje) | Só por mutante: `M5`/`M6`/`M7` em cópia e sonda v/vi/vii/xii/xiii *(Errata `INS1(f)` · Fase 4: (f) só por `M20` em cópia, T022 — a sonda **não** a vê: cenário novo moveria o pin e seria segunda edição do julgador)* | Discriminante é **exclusivamente** sonda + mutantes; nenhum estado real de hoje a reprova — declarado *(idem para (f): carrasco `M20`, one-shot, credor `EA-42`)* |
| `D017-FORM1` (a) | verde por vácuo | Só por mutante: `M9`, sonda xiv *(Errata `INS1(f)` · Fase 4: + `M21` em cópia para elemento não-string/vazio, T022 — também fora da sonda)* | Idem; a razão de existir é o Windows (`path.relative` com `\`), que o CI nunca vê |
| `D017-FORM1` (b)(c) | **vermelho hoje** (`d014` 6/2, `d016` 55/10) | Sim — `D017-M8` é o estado atual | Fecha pela migração D1 |
| `D017-CORE1` | linha impressa hoje | A linha é alcançada pela árvore; a **falha** ("core como OK") só por mutante: `M14`, sonda ix | Lista fechada por construção (IC-4 `:283-287`, `:343`) — não há segundo harness sem preflight possível |
| `D017-SONDA1` | verde | Sim — qualquer `M10`…`M16`, `M18` | `M17` (fiação) declarado sobrevivente da sonda, morto por `M2` em cópia |
| C1 · ramo `[NOTA]` (preflight fracassou) *(Errata `D017-M19` · Fase 3)* | **não alcançado** na árvore (11/11 preflights válidos, Medição A) | **Sim** — por ambiente (`have("node")` falso, `check_mutation.py:288-289`, sem mutação alguma) e por estado em cópia (estado NOTA: stdout vazio no `--preflight`, causa `:310-312`, medido); a **falha** da alínea (linha ausente · `[OK]` falso · `[FAIL] D017-*` duplicado) só por mutante: `D017-M19` | Não é cláusula defensiva: dez retornos `None` em `ic_preflight` (`:285-325`) alcançam o ramo. Carrasco `M19` × estado NOTA em cópia, one-shot (credor `EA-42`); fora da sonda porque a distinção é do laço, não de `mut_relacao` |

## Comportamento especificado

### Superfície: o bloco `---- semântica do gatilho (017) ----` do stage `mutation`

**Entrada**: `MAP` (com `insumos` opcional por harness e `_meta.sonda_relacao`),
`IC_PREFLIGHT` (JSON de C1 por harness, ou `None`), `IC_SEM_PREFLIGHT`.
**Saída**: linhas por asserção, um contador `D017_FAILS`, fecho
`---- semântica do gatilho: <n> problema(s) nomeado(s) ----`, somado a `fails`.
Não escreve, não muta, não executa suíte (R7 §3, R10 §6); o único processo
externo continua sendo o `--preflight` que IC-4 já invocou.

| Cenário | Saída esperada |
|---|---|
| Harness em identidade (`p50`, `p51`, `p52`, `d014vis`) | `[OK] D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>)` — sem sufixo de insumos |
| Harness com insumos válidos (7 de hoje, após C7) | `[OK] D017: <h> · gatilho ⊇ conjunto mutado ∪ {harness} (<n>) · insumos: <classe> <k>[, …]` |
| Faltante | `[FAIL] D017-REL1: <h> · conjunto mutado fora do gatilho: <paths>` |
| Fantasma | `[FAIL] D017-REL2: <h> · alvo fantasma (sem razão de classe): <paths>` |
| Faltante e fantasma com mesmo basename | as duas linhas acima + ` [forma do path? mesmo basename nos dois lados: <nome> — C1 exige path relativo à raiz]` |
| `insumos` malformado | `[FAIL] D017-INS1: <h> · <causa fechada>: <classe> (<paths>)` — os paths dessa entrada **não** reaparecem em REL2 *(Errata `INS1(f)` · Fase 4: esta linha é a das causas (a)–(e); para **(f)** — `insumos` não-objeto — a linha é `[FAIL] D017-INS1: <h> · insumos malformado — não é objeto classe → [paths]: <tipo>` e os excedentes que a razão cobriria **reaparecem** em REL2, porque não há razão válida a subtrair)* |
| Path fora da forma | `[FAIL] D017-FORM1: <h>/<conjunto> · path fora da forma canônica: <path>` — o path **não** entra na comparação (evita cascata) |
| `core` | `[DÍVIDA] core: relação gatilho × conjunto mutado NÃO MEDIDA — sem preflight (credor: EA-44)` |
| Preflight fracassou (IC-4 já FAIL) | `[NOTA] D017: <h> · não medida — preflight fracassou e IC-4 já o nomeou` *(Errata `D017-M19` · Fase 3: carrasco `D017-M19`; o prefixo `[NOTA] D017: <h> · não medida` é o que a prova de morte mede)* |
| Sonda | `[OK] D017-SONDA1: mut_relacao discrimina nos 15 cenários …` ou `[FAIL] D017-SONDA1: cenário <n> · …` |

### Os 15 cenários da sonda (ids permanentes; acréscimo é errata com id, e move `_meta.sonda_relacao.total`)

| # | Entrada sintética | Veredito esperado |
|---|---|---|
| i | `targets` = mutados ∪ {harness}, sem `insumos` | `ok`, 0 problemas, `insumos_ok` vazio |
| ii | um mutado fora de `targets` | REL1, path nomeado |
| iii | um excedente sem `insumos` | REL2, path nomeado |
| iv | excedente coberto por `insumos.oraculo` | `ok`, `insumos_ok = {oraculo: [path]}` |
| v | classe `endurece_trigger` | INS1 `classe fora do vocabulário`; REL2 **vazio** (um FAIL por causa) |
| vi | path em `insumos` que também está em mutados | INS1 `insumo que é conjunto mutado` |
| vii | path em `insumos` ausente de `targets` | INS1 `razão sem gatilho` |
| viii | o próprio harness ausente de `targets` | REL1 nomeando o arquivo do harness |
| ix | mutados = `None` (sem preflight) | `estado: nao_medido`, `credor: EA-44`, 0 problemas |
| x | path inexistente no disco presente em mutados **e** em `targets` (criado/removido, bordas 2–3) | `ok` — existência não é exigida |
| xi | mutados `["regra_morta.js"]`, `targets` `[".claude/verify/regra_morta.js", harness]` | REL1 + REL2 + `forma: ["regra_morta.js"]` (diagnóstico) |
| xii | classe com lista vazia | INS1 `classe sem membros` |
| xiii | mesmo path em `oraculo` e `fixture` | INS1 `path em duas classes` |
| xiv | `\` num elemento de `arquivos_mutados`; `./x` num de `targets`; `../x` num de `insumos` | FORM1 três vezes, cada uma nomeando o conjunto; o path excluído da comparação |
| xv | `p51`: mutados reais, `targets` + `tests_p50_core.js`, `insumos.oraculo = [tests_p50_core.js]` | `ok`, `insumos_ok = {oraculo: [tests_p50_core.js]}` — **a Necessidade do refinamento, como caso da sonda** (P1.9: permitido, não exigido; a árvore real da `p51` não muda) |

### Casos de borda do refinamento — tratamento nesta spec

| # | Borda | Tratamento |
|---|---|---|
| 1 | mutado **e** insumo (`tests_p52_chromium.js`) | conjunto mutado; declará-lo em `insumos` é INS1(d). Sonda vi |
| 2 | criado (`999-sintetica-d016.json`) | conjunto mutado; nenhuma exigência de existência. Sonda x |
| 3 | removido (`F5.json`, `sem_fecho.json`) | idem; por isso **não** estão entre as 44 `fixture` da `d016` |
| 4 | `core` sem preflight | C5; `tests_core_mutants.js` intocado; `ic_estatico` **não** é usado como reserva (dois pontos cegos, `:171-182` — achado em C9) |
| 5 | fantasma | C2 |
| 6 | mutado fora | C1 |
| 7 | razão coletiva | D2/C3: uma classe, n membros |
| 8 | forma do path | D1/C4 |
| 9 | identidade | `insumos` ausente ≡ `{}`; nada muda para os quatro *(Errata `INS1(f)` · Fase 4: `null` ≡ ausente — medido; `[]`, `""`, número **não** são identidade — são (f), nomeados com o tipo)* |
| 10 | mutante de worktree efêmera sobre `PROTECTED` (`D011-M6`/`M8`, `D015-M16`) | fora do conjunto mutado e fora do gatilho; a raia é da matriz. Nenhum path protegido entra em `targets` por esta demanda |
| 11 | `receipts` | fora da relação; o bloco não os lê |
| 12 | gatilho incompleto (`build_v32_html.py` fora de `p50`…) | **fora** — `EA-3` (D3) |

### O que fica pronto para o `EA-3` (D3)

O retorno de `mut_relacao` classifica cada path do gatilho em exatamente uma de
três posições — `mutado`, `harness`, `insumo(<classe>)` — e cada path do conjunto
mutado como coberto. Um instrumento de população precisa só de: `⋃ mutados`
(coberto), `⋃ targets` (vigiado) e `git ls-files` da população declarada, todos
na forma canônica de D1. Nenhuma dessas três uniões é calculada aqui.

## Contratos

Nenhum bridge de runtime, payload de sessão ou estado de módulo de produto —
**R9 §5 não se aplica**. Contratos de **instrumento**:

### C1 (013) · errata aditiva — forma de `arquivos_mutados`

> `arquivos_mutados[]`: paths **relativos à raiz do repositório**, separador `/`,
> sem `./`, sem `..`, sem `/` inicial — a forma de `git diff --name-only` e de
> `targets`; inclui arquivos que a campanha **cria** ou **remove** (existência).
> O exemplo do C1 permanece válido (todos na raiz). `mutantes[].arquivo` e
> `edicoes[].arquivo` **não** são alcançados — consumidor humano (mensagens de
> IC-4); se um dia forem comparados por máquina, a errata é dessa demanda.

Dono: cada harness (escreve). Consumidor: `check_mutation.py` (C4, C1, C2).
Migração nesta demanda: `d014`, `d016` (D1).

### C2 (013) · extensão — `insumos` e `_meta.sonda_relacao` em `mutation_map.json`

```json
"d010": {
  "cmd": "node tests_010_mutants.js",
  "preflight": true,
  "targets": ["ui_v32.js", "ui_target_v32.js", "tests_010_vao.js",
              "fixtures_010_vao.js", "tests_010_mutants.js"],
  "insumos": {
    "oraculo": ["tests_010_vao.js"],
    "fixture": ["fixtures_010_vao.js"]
  },
  "requires": ["node", "python"],
  "_trilha": "…"
}
```

- `insumos`: objeto `classe → [paths]`; classes do §Vocabulário fechado; regras
  (a)–(e) de C3; ausente ≡ `{}`. Paths na forma de D1. *(Errata `INS1(f)` ·
  Fase 4: regras (a)–**(f)**; valor **presente** que não é objeto é (f), nomeado
  com o tipo, nunca coagido em silêncio; `null` ≡ ausente.)*
- `_meta.sonda_relacao`: `{ "total": 15, "descricao": "<o que pina e por quê; ids
  i–xv; acréscimo só por errata da 017>" }` — o pin da contagem de C6 (R10 §3:
  contagem em registro, não em prosa nem no corpo do gate).
- `_meta.descricao` ganha **uma frase** sobre `insumos` (como ganhou sobre
  `preflight` e `receipts`); a chave `targets` **não** é renomeada (P1.13).
- Dono: `build-engineer` (precedente C2 da 013 e T060 da 016 para o mapa);
  consumidor: `check_mutation.py`. Pinado (`pins.json:267`).
  *(Errata `_meta.sonda_relacao` · Fase 3: o dono acima vale para `insumos`, a
  frase em `_meta.descricao` e as notas em `_trilha` — W2. **`_meta.sonda_relacao`
  nasce no commit red, pelo `qa-engineer`**, no mesmo commit do gate que o lê
  (`D017-SONDA1`); um autor por wave. §Erratas da Fase 3.)*

Migração das razões (C7) — o conteúdo exato que entra:

| Harness | `insumos` |
|---|---|
| `d010` | `oraculo: [tests_010_vao.js]` · `fixture: [fixtures_010_vao.js]` |
| `d009` | `oraculo: [tests_009_leitura.js]` · `fixture: [fixtures_009_leitura.js]` |
| `d011` | `oraculo: [tests_011_prioridade.js]` |
| `d015` | `oraculo: [tests_015_apoio.js]` · `fixture: [fixtures_015_apoio.js]` |
| `d014` | `populacao: [ui_v32.css, ui_ux_v32.css, ui_p52_workspace_v32.css, ui_d011_prioridade_v32.css]` |
| `d016` | `fixture: [44 paths de git ls-files .claude/verify/fixtures_016/ − F5.json − sem_fecho.json]` · `declaracao: [.claude/verify/branch_protection.json]` |
| `ea41` | `oraculo: [.claude/verify/check_eol_text.py]` · `declaracao: [.gitattributes]` |
| `p50` · `p51` · `p52` · `d014vis` · `core` | sem chave |

### C5 (017) · retorno do julgador puro `mut_relacao`

`{ estado: "ok" | "fail" | "nao_medido", faltante: [paths], fantasma: [paths],
insumos_ok: {classe: [paths]}, problemas: [(gate, alvo, causa)], forma: [basenames
em diagnóstico], credor?: "EA-44" }`. Sem I/O; a fiação (imprimir, contar) é do
laço — é por isso que `D017-M17` existe e é declarado.

### Arquivos rastreados que mudam (pinados → `gen_pins.py` no MESMO PR, em commit separado após cada commit de conteúdo — R8 §1)

| Arquivo | Mudança | Pin | Campanha que dispara |
|---|---|---|---|
| `.claude/verify/check_mutation.py` | bloco D017 (C1–C6, C8); retirada de `:395-412`; cabeçalho `:64-67` e `:376-379` | `pins.json:204` | nenhuma |
| `.claude/verify/mutation_map.json` | `insumos` em 7 harnesses (C7); `_meta.sonda_relacao`; frase em `_meta.descricao`; notas datadas em `_trilha` `:41` e `:246` | `:267` | nenhuma |
| `tests_014_mutants.js` | `:303` → emissão repo-relativa (D1/C4 c) | `:425` | `d014` · local |
| `tests_016_mutants.js` | `:555` → emissão repo-relativa (D1/C4 c) | `:430` | `d016` · local |
| `specs/013-integridade-da-campanha/spec.md` | erratas `IC-6` e `C1` (C9) | `:389` | nenhuma |
| `.claude/BACKLOG.md` | notas `EA-3`/`EA-44`; achado `ic_estatico`; correção `:441-442` (C9) | `:18` | nenhuma |
| `.claude/verify/mutation-matrix.json` | `dividas_declaradas`: `D017-M17` (fiação, carrasco `D017-M2` em cópia) e a não re-execução da família de árvore (credor `EA-42`) *(Errata `D017-M19` · Fase 3: mais `D017-M19`, fiação, carrasco em cópia sob o estado NOTA — mesma família de `M17`)* *(Errata `INS1(f)` · Fase 4: a família one-shot de árvore ganha `D017-M20`/`M21`, mortos em cópia na W2 — T022)* | `:266` | nenhuma |
| `specs/017-semantica-do-gatilho/*` | esta spec, `plan.md`, `tasks.md`, `red-017.md`, `spec-validate.md`, `relatorio-final.md` | novos — arquivo rastreado sem pin é FAIL do `baseline` | nenhuma |

**Não mudam**: `tests_core_mutants.js` (T8, `EA-44`); os oito harnesses de raiz e
`tests_ea41_mutants.js` (D1); `expected_suites.json` — nenhuma suíte contada
nova, o bloco vive no stage `mutation` e `check_suites.py:50-51` cobre o `cmd`
de todo harness do mapa (R10 §3 não é acionada, e é dito); `pipeline.yaml`;
`CONTEXT.md` (verbetes já gravados na Fase 0 `:214-256`; as classes são
identificadores, não termos); `known_issues.json`; `invariants.json`;
`boundary.json`; `env_doctor.py`; `.gitattributes`.

## Tipagem prevista das tarefas (R3 — a matriz final é do `tasks.md`)

| Entrega | Tipo previsto | Dono previsto | Red? |
|---|---|---|---|
| Bloco D017 em `check_mutation.py` (C1–C6, C8) — o gate **é** o instrumento *(+ `_meta.sonda_relacao` no mesmo commit — Errata `_meta.sonda_relacao` · Fase 3)* | `feature` | `qa-engineer` (precedente T002 da 013: o julgador nasce no red) | **sim** — red natural: REL2 7/11, FORM1(b) em `d014`/`d016`; `D017-M1`/`M2`/`M5`–`M9` e a sonda em cópia, registrados em `red-017.md` |
| `insumos` + `_meta.sonda_relacao` + notas datadas no mapa (C7) *(Errata `_meta.sonda_relacao` · Fase 3: `_meta.sonda_relacao` sai desta linha e vai para a de cima — o pin nasce no red; `insumos` e notas ficam aqui, com o `build-engineer`, na W2)* | `fix` | `build-engineer` (C2 da 013; um arquivo, um dono) | verde de REL2/INS1 medido por quem não escreveu o gate |
| Emissão repo-relativa em `d014` e `d016` (D1/C4 c) | `fix` | `build-engineer` (precedente T006/T009/T011 da 013: o implementador de C1 nos harnesses) — **um harness por delegação** | verde de REL1/FORM1 nos dois, por execução do stage |
| Erratas na 013, notas no `BACKLOG`, achado novo (C9) | `doc` | `doc-writer` | não |
| `dividas_declaradas` na matriz | `chore` | `qa-engineer` | não |
| Repins | `chore` | `build-engineer`, um por commit de conteúdo | não |
| Validação: pipeline completo, regressão C8, `spec-validate`, aceite | `chore` | `qa-engineer` + `product-owner` | — |

## Erratas a aplicar na spec da 013 (C9) — texto normativo, escrita **depois** do portão

Forma: a da própria 013 (`spec.md:462-495`) — nota inline **em cada ponto
tocado** + seção única nova `## Erratas da demanda 017 (<data>)`, cabeçalho
dizendo **quem decidiu** (aprovação desta spec pelo usuário no portão da Fase 1
da 017 — nunca antes), **o que não é reaberto** (E1–E4, G1–G3, T1–T12, IC-1…
IC-5, IC-7…IC-10) e que **nenhuma redação original é apagada** (R2 §5).
Identificação pelo **objeto** amendado, no precedente da 013 ("id do gap, nunca
`E<n>`"): **Errata `IC-6`** e **Errata `C1`**.

| Errata | Ponto | Nota inline (conteúdo mínimo) |
|---|---|---|
| `IC-6` | `:116` (célula do critério) | *(Errata IC-6 · demanda 017: a identidade `≡` foi superada pela inclusão com razão de classe — `D017-REL1`/`REL2`/`INS1`/`FORM1`, `specs/017-semantica-do-gatilho/spec.md` §Critérios, para todo harness com preflight; a asserção nominal saiu de `check_mutation.py` em `<commit>`; `M-IC8`/`M-IC9` continuam mortos, re-executados como `D017-M1`/`M2` em `red-017.md`; o id `IC-6` fica reservado)* |
| `IC-6` | `:194` (borda 10) | *(Errata IC-6 · demanda 017: a checagem genérica nasceu na 017, não no `EA-3`, que fica com a população e o órfão)* |
| `IC-6` | `:231-232` (C2, "`targets` da `p51` reconciliados") | *(Errata IC-6 · demanda 017: permanecem como T11 os deixou; desde a 017 `targets` pode conter insumos de prova com razão de classe na chave `insumos` — C2 estendido em `specs/017-…/spec.md` §Contratos)* |
| `C1` | `:205-226` (bloco C1) | *(Errata C1 · demanda 017: forma canônica de `arquivos_mutados` = path relativo à raiz, POSIX, incluindo criados/removidos; o exemplo permanece válido porque todos estão na raiz; `d014`/`d016` migrados em `<commits>`; `mutantes[].arquivo` não é alcançado)* |

## Riscos nomeados

1. **Janela vermelha legítima** entre o commit red e o green: o stage `mutation`
   reprova por REL2 (7 harnesses) e FORM1(b)/REL1 (`d014`/`d016`). É o red
   declarado no PR (precedente T002 da 013). As waves do `tasks.md` devem
   encurtar a janela ao mínimo — vermelho prolongado no `verify` ensina que
   vermelho é normal (`EA-5`).
2. **Windows**: `path.relative` emite `\`; FORM1(a) reprova **localmente**, antes
   do CI — é o desenho (R7 §5). A migração usa `split(path.sep).join("/")`.
3. **Fixture nova na `d016`** (`F27`…): precisa entrar em `targets` **e** em
   `insumos.fixture`; esquecer o segundo é REL2 nomeando — o gate lembra;
   esquecer o primeiro é a borda 12 (completude), fora desta demanda.
4. **Harness futuro com relação fora das quatro classes**: errata desta spec com
   id, nunca parágrafo em `_trilha` — se acontecer parágrafo, a 017 falhou
   (cobrança 1 do refinamento).
5. **`ic_estatico` continua como reserva do IC-5** (`:171-182`, dois pontos
   cegos): não afeta D017 (que só consome C1) — achado em C9, não conserto aqui.
6. **Não re-execução da família de árvore** (`D017-M1`…`M9`): credor `EA-42`;
   a sonda (C6) é a metade que roda sempre. *(Errata `D017-M19` · Fase 3: vale
   também para `D017-M19` e para o estado NOTA que o alimenta — one-shot em cópia.)*
   *(Errata `INS1(f)` · Fase 4: e para `D017-M20`/`M21`, mortos em cópia na W2.)*

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda; INV-1
  não é acionada; `invariants.json` byte-idêntico. **INV-9** por analogia é
  **reforçada** (a relação vira dado legível por máquina); **INV-10** honrada:
  a chave `targets` permanece (P1.13), classes e ids são identificadores ASCII,
  nomes de código nunca traduzidos.
- [x] **`design-decisions.md` (R13) — nenhum conflito.** Nada sobre `IC-6`,
  `targets` ou campanha de mutação, confirmado por leitura. "Suítes visuais fora
  do agregado local" é **honrada e não tensionada**: nenhuma campanha com
  Chromium é disparada (Medição C). "planning-state fora do registry" segue —
  os dois planning-states em `d016.targets` são decisão da 016, intocada.
  "Cláusula defensiva inalcançável" não é tangenciada.
- [x] **Specs validadas anteriores — nenhuma contradição não tratada.**
  **013** (`done`): a identidade em `:116` e `:194` e o C2 `:231-232` são
  superados **por esta spec** e recebem errata aditiva (C9) — a rota que o
  refinamento §Conflito nomeia está **certa**: `IC-6` foi aprovado sob delegação
  e a superação vem por spec aprovada pelo usuário; nada é reescrito (R2 §5).
  **014**: a `_trilha` do `d014` (`:135`) é a fonte da classe `populacao`;
  `tests_014_mutants.js` é editado só na emissão (`:303`); nenhum `D014-*` muda
  de veredito. **015**: idem `d015` (`:180`); `ui_v32.js` **não** entra em
  `insumos` (sonda vi é exatamente esse erro). **016** (`done`):
  `spec.md:868` diz que `check_mutation.py` continua fora de todo `targets` —
  **continua**; `:516` (54) e `:528` (56) "targets enumerados um a um" —
  **inalterados** (56 medidos, `mutation_map.json:184-241`); a 017 acrescenta
  `insumos`, não mexe em `targets`. **Fix-finding EA-41**: `ea41`
  já cumpre D1 e recebe `insumos` sem edição do harness.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `specs/PHASE_5_0_REV_B.md` (normativa, SHA em `current_phase.json`): "mutante"
  aparece em `:58`, `:416-417`, `:835`, `:1287-1288`, `:1657`, `:1834` — todos
  sobre mutantes de gates de **produto** (`P50-UX13`, `UG`), **nada** sobre o
  mapa de campanha, `targets` ou `check_mutation.py`. `specs/PHASE_5_0_REV_A.md`
  (histórica, `legacy`): `:1681` "mutation/adversarial tests quando aplicável",
  genérico. `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`: **nada** sobre
  mutação ou harness. A §29.4 (`REV_B:1613-1621`, "todas as suítes congeladas —
  `tests_*.js` existentes") **não alcança** `tests_014_mutants.js` nem
  `tests_016_mutants.js`, nascidos em 2026-09 (demandas 014 e 016), depois da
  selagem; a tensão histórica é a `EA-1` Face B, disposta na Onda 4 (regime
  vigente: pins + repin) e fora de litígio (R13). Nenhuma spec selada é editada;
  `current_phase.json` não muda.
- [x] **Boundary (R6) — as três fontes cruzadas; nada protegido; nenhuma
  PARADA.** `boundary.json`: nenhum dos oito arquivos que mudam está em
  `frozen`/`generated`/`legacy`/`registry` (`pins.json` só via `gen_pins.py`,
  rito cumprido). `PROTECTED` (`tests_p50_core.js:82`): 16 chaves, nenhuma
  tocada — e a spec **proíbe** por desenho que path protegido entre em
  `targets` por esta demanda (borda 10). `frozenSuites` (`:473-476`): 13
  suítes, nenhuma tocada. `pins.json`: todos os arquivos editados são pinados
  (`:18`, `:204`, `:266`, `:267`, `:389`, `:425`, `:430`) → repin por commit de
  conteúdo. **Esta spec não pede ratificação de proprietário em ponto nenhum
  além do próprio portão**; a única decisão que o portão carrega de novo é D4.
- [x] **R10 — as 10 proibições.** §1 nada enfraquecido (D4: predicado mais
  forte, carrascos originais vivos); §2 zero SKIP silencioso — `core` é dívida
  com credor, preflight fracassado é `[NOTA]` remetendo ao FAIL de IC-4; §3
  contagem da sonda pinada em **dado** (`_meta.sonda_relacao.total`), nenhuma
  suíte contada nova; §4 nenhum pin inline; §5 nenhuma âncora em `HEAD:`; §6
  oráculo é JSON entre executáveis, nenhuma regex sobre stdout PT-BR; §7 nenhum
  processo externo novo; §8 nada escrito em arquivo versionado — mutantes de
  árvore em cópia; §9 a checagem entra no executável do stage existente; §10 o
  bloco não é scanner de padrão proibido — a auto-exclusão de IC-1 não muda.
- [x] **R3 / R2** — autor do gate ≠ implementador (tabela de tipagem); red
  commitado com `red-017.md`; mutante obrigatório por gate; toda medição desta
  spec foi executada (preflights, expressão literal) — o que não foi executado
  é o `run.sh` completo no HEAD final, que é da Fase 6.

## Fora de escopo

Herdado do refinamento (§Fora de escopo, integral): completude do gatilho
(borda 12, `EA-3`); órfão e declaração de população (`EA-3`, D3); detectores
do eixo C (`EA-28`, `EA-30`, `EA-42`); `EA-44` e `EA-45` (o `core` fica como T8
deixou, com credor); incluir o oráculo da `p51` no gatilho (P1.9 — permitido,
provado possível pela sonda xv, não exigido); reescrever `_trilha`s
(só notas datadas em `:41` e `:246`); renomear `targets` (P1.13); tocar harness
com `requires: chromium` (medido desnecessário — D1).

Acrescentado por esta spec:

- **`mutantes[].arquivo` e `edicoes[].arquivo` do C1** continuam em basename —
  consumidor humano; fora da errata C1.
- **Migrar a expressão `path.basename(m.file)` nos oito harnesses de raiz** —
  o valor emitido já é canônico; o dia em que um deles ganhar mutante em path
  aninhado, `D017-REL1`/`REL2` acusam com o diagnóstico de forma. Guardado por
  gate, não por prosa.
- **Consertar os pontos cegos de `ic_estatico`** (`:171-182`) — vira achado (C9).
- **Normalizar paths no consumidor** — recusado por desenho (D1, R7 §5).
- **Re-execução automática da família de mutantes de árvore** (`D017-M1`…`M9`) —
  `EA-42`.

## Erratas da Fase 3 (2026-09-06)

> Escritas pelo `tech-lead` na **W0**, antes do red, a partir de duas
> DEPENDÊNCIAS que o próprio [tasks.md](tasks.md) devolveu ao portão da Fase 3
> (§Vácuos declarados, item 2; §Onde o `spec-validate` vai olhar, item (a)).
> Nenhuma corrige código: nenhuma asserção `D017-*` muda, nenhum veredito de gate
> alheio muda, nenhuma boundary se move. A primeira **acrescenta** um carrasco
> (fortalece — R10 §1 na direção permitida); a segunda corrige **quem escreve um
> pin e quando** (processo). Linhas citadas na numeração do HEAD `f56d4fd` para
> esta spec, o `plan.md` e o `tasks.md`, e de `9d617d0` para `check_mutation.py`
> e `tests_p50_mutants.js` (byte-idênticos em `f56d4fd` — `git diff --stat`
> vazio, medido) — todas anteriores a esta seção existir.
>
> **Quem decidiu**: o orquestrador, no portão da Fase 3 — decisões (2) e (3) das
> cinco que acompanharam o `tasks.md` —, apresentadas ao usuário e cobertas pelo
> **"Prossiga"** de 2026-09-06 (aprovação literal, R4), conforme o registro em
> `planning-state → tasks.notes`. O `tech-lead` não leu o chat e não afirma mais
> do que o registro diz; se a leitura do proprietário for outra, reverter o
> commit desta seção é barato — **nenhuma redação original foi apagada** (R2 §5):
> cada ponto tocado leva nota inline `*(Errata … · Fase 3)*` e a redação anterior
> está citada abaixo.
>
> **O que não é reaberto**: D1–D5; as asserções de C1–C9 e os seis gates
> `D017-*`; os 15 cenários da sonda e `_meta.sonda_relacao.total = 15` (`D017-M19`
> não é cenário — abaixo); `IC-*`; as erratas a aplicar na 013 (C9); P1–P8 do
> plano; o portão da Fase 1 (D4). Identificação pelo **objeto** amendado
> (precedente da 013, `spec.md:492-493`): **Errata `D017-M19`** e **Errata
> `_meta.sonda_relacao`**.

### Errata `D017-M19` — o ramo `[NOTA]` de C1 ganha carrasco

**O que dizia.** A célula de C1 (`:136`) define o ramo *"Preflight que fracassou
⇒ `[NOTA] D017: <h> · não medida — IC-4 já o nomeou` (nunca FAIL duplicado,
precedente IC-10.1 `:1195`)"*, e §Comportamento (`:194`) o repete na forma mais
específica — mas **nenhum dos dezoito mutantes** `D017-M1`…`M18` (`:136-143`) o
exercita, §Guarda de tautologia (`:163-171`) não tem linha para ele, e a sonda
**não pode** vê-lo: `mut_relacao` recebe `None` tanto para o `core` quanto para
um preflight fracassado (C5, `:299-304`; cenário ix), e quem distingue os dois é
o **laço**, pela pertença a `IC_SEM_PREFLIGHT` (plano PP-7, `plan.md:189`). O
`tasks.md` (§Vácuos 2, `:152-158`) declarou o vácuo e propôs **observação sem
id** em `red-017.md`.

**Por que observação sem id foi recusada** (decisão do orquestrador, escrita aqui
para não voltar): `EA-28`, `EA-30` e `EA-42` são três achados abertos cujo
conteúdo inteiro é *prova que viveu só num relatório evaporou* — e observação sem
id num relatório de red tem exatamente essa forma. Um id custa uma linha agora;
depois do red custaria uma errata e uma explicação.

**Alcançabilidade — medida por execução, não raciocinada.** O ramo é alcançado
sempre que `ic_preflight` devolve `(None, causa)` para harness fora de
`IC_SEM_PREFLIGHT`: o laço grava `IC_PREFLIGHT[h] = None` **e** imprime `[FAIL]
IC-4` (`check_mutation.py:340-344`). Há **dez** retornos assim (`:285-325`):
`preflight` não declarado (`:285`); **`node` ausente** (`:288-289`); nenhum fonte
lê `--preflight` (`:295`); timeout (`:305`); exceção (`:307`); **stdout vazio**
(`:310-312`); stdout não-JSON (`:313-317`); JSON não-objeto (`:318`); chave de C1
ausente (`:320-323`); `mutantes`/`arquivos_mutados` não-lista (`:324-325`). Um
deles é **puramente ambiental** — `have("node")` é `shutil.which("node")`
(`:39-41`) — e alcança o ramo nos onze harnesses **sem mutação alguma**; a 013
já fixou que `MUTATION_DEFER_MISSING=1` não delega o preflight (Errata G1 da
013, `spec.md:525-529`). Conclusão: **há estado alcançável, o mutante morde, e o
ramo não é cláusula defensiva** — nem a classe da 010 (*inalcançável por
construção*, `design-decisions.md` §Candidatas) nem a sentinela da 015 (E2,
`spec.md:157-164`). É uma alínea comum que **hoje não é alcançada na árvore**
(11/11 preflights válidos, Medição A) — a situação de `INS1` e `FORM1(a)`, com o
mesmo tratamento: vácuo declarado + carrasco em cópia. O que se recusa é o par
vazio; a dívida com razão só seria a saída se a alcançabilidade tivesse dado
negativo, e deu positivo.

**Correção de fato ao enunciado do estado** (executado em clone efêmero de
`f56d4fd`, `MUTATION_DEFER_MISSING=1`, `origin/develop` pinado no HEAD do clone
para nenhuma campanha disparar). O `tasks.md` (T010, `:30`; §Vácuos 2) escreve
*"harness da cópia com `--preflight` saindo 1"*. **Não basta.** Duas variantes
sobre `tests_p50_mutants.js:896`:

| Variante | Edição em cópia | `[FAIL] IC-4: p50 · …` medido | `IC_PREFLIGHT["p50"]` | O bloco 017 |
|---|---|---|---|---|
| **A — estado NOTA** | `process.exit(preflight(selecionar().sel));` → `process.exit(1);` (nada vai a stdout: `:846`, `:878`) | `preflight não emitiu nada em stdout — C1 exige UM objeto JSON em stdout (texto humano vai para stderr)` · `---- integridade: 1 problema(s) nomeado(s) ----` · `0 campanha(s)` · exit 1 | **`None`** (`:310-312` → `:341`) | imprime `[NOTA]` — **é o estado** |
| **B — "saindo 1"** | `preflight(selecionar().sel); process.exit(1);` (JSON válido em stdout, exit 1) | `C1: exit 1 incoerente com o conteúdo — exit 0 sse interpretador resolvido e todo estado == 'ok'` **e, na linha seguinte,** `[OK]   IC-4: p50: 53 âncora(s) com ocorrencias == 1 (preflight, C1)` | **`dict`** (`:326` guarda o returncode e devolve os dados; a reprova vem de `:354-356`) | **mede** `p50` normalmente — o ramo `[NOTA]` **não** é alcançado |

O estado é *"`ic_preflight` devolve `None`"*, e a forma canônica de produzi-lo em
cópia é a variante **A**. O estado NOTA é um run à parte da regressão C8: com
ele, `---- integridade: 1 ----` (o IC-4 do `p50`) — C8 mede-se sem ele.

**O que passa a valer.**

| Campo | Registro |
|---|---|
| **Estado NOTA** (alimenta o mutante; **não é mutante** — sob ele o gate íntegro está certo ao imprimir `[NOTA]`) | Em cópia efêmera (R7 §3), num harness **em identidade no estado A**, para o fecho do bloco ser comparável — canônico **`p50`**, variante A acima. Outro harness em identidade (`p52`, `d014vis`) serve, registrado; `p51` evita-se por já carregar `M1`/`M2`. Não se escolhe harness vermelho no estado A (a sua linha `[FAIL] D017-REL2` sumiria e confundiria a contagem) |
| **`D017-M19`** — mutante de **fiação**, sobre o bloco 017 de `check_mutation.py`, em cópia | O laço perde a distinção *"valor `None` com nome presente"* (PP-7): o ramo `[NOTA]` sai e o harness segue para a comparação com conjunto mutado vazio — `IC_PREFLIGHT.get(nome) or []` ou equivalente. Forma alternativa, equivalente para o critério: ramo removido e `mut_relacao(None, …)` chamada, ficando a fiação a tratar `nao_medido` fora do `core` como estiver (silêncio; `[DÍVIDA]` com credor `EA-44`, que é do `core` e não de um preflight quebrado; ou `[OK]`). O QA escolhe uma forma e **registra qual** |
| **Alínea que o mata** | C1, ramo `[NOTA]`: *harness cujo preflight fracassou é **nomeado** como não medido, **uma** vez, e não recebe `[OK] D017` nem `[FAIL] D017-*` (FAIL duplicado)*. É R10 §2 (E6, SKIP silencioso) e o precedente IC-10.1 (`:1192-1197`) aplicados ao bloco |
| **Prova de morte** (cópia, estado A + estado NOTA, `MUTATION_DEFER_MISSING=1`) | Pré-condição do estado, **nos dois lados**: `grep -c '^\[FAIL\] IC-4: p50 ·'` = **1**. Gate íntegro: `grep -c '^\[NOTA\] D017: p50 · não medida'` = **1** · `grep -c '^\[OK\] *D017: p50'` = **0** · `grep -c '^\[FAIL\] D017-[A-Z0-9]*: p50'` = **0** · fecho `---- semântica do gatilho: <n> problema(s) nomeado(s) ----` com o **mesmo `<n>`** do estado A sem o estado NOTA (harness não medido contribui zero). Sob `M19`: `[NOTA]` = **0** e **pelo menos uma** forma proibida aparece — na forma `or []`, `[FAIL] D017-REL2: p50 · alvo fantasma (sem razão de classe): ui_p50_results_v32.js, ui_p50_shell_v32.js, ui_p50_suff_v32.js, ui_p50_v32.css` (os quatro `targets` que não são o harness — `arquivos_mutados` medido da `p50`) e `<n>` sobe; na forma alternativa, silêncio ou a linha errada. Qualquer uma das quatro é morte; a que apareceu vai à tabela de `red-017.md` **com a saída**. O grep usa o **prefixo comum** às duas redações da NOTA (`tasks.md` §Vácuos 3, defasagem (d)) — a forma final da linha segue sendo extraída do executável no `spec-validate` (E016-5) |
| **Onde vive** | `red-017.md`, tabela de mutantes, com id, como `M1`…`M18` (T010); `mutation-matrix.json → dividas_declaradas`, **família fiação, ao lado de `D017-M17`** (T030 (i)): sobrevive à sonda por desenho, morto one-shot em cópia, não re-executado por campanha — credor `EA-42` |
| **O que não é** | **Não é cenário da sonda**: `_meta.sonda_relacao.total` continua **15** — §Os 15 cenários (`:197`) diz que acréscimo de *cenário* move o total; `M19` é mutante, e não pode virar cenário porque `mut_relacao` não vê a pertença a `IC_SEM_PREFLIGHT` (C5). Não muda C5, PP-7, `ic_nota` (`:135-136`) nem a forma da linha |
| **Classe** | `spec-errada` por omissão (alínea sem carrasco nomeado) — fortalecimento; nenhuma asserção muda |

**Pontos tocados com nota inline**: célula de C1 (`:136`), célula de C6 (`:141`),
§Nascimento de gate (`:148`), §Guarda de tautologia (linha nova após `:171`),
§Comportamento (`:194`), §Arquivos rastreados — linha da matriz (`:316`), Risco 6
(`:373-374`).

**Efeito no `tasks.md`** — fora desta errata, registrado para o `spec-validate`
ler a verdade **na spec**: o TL só tocou o `tasks.md` no item (a) (instrução do
orquestrador nesta W0). Ficam por consolidar, por decisão do orquestrador
(DEPENDÊNCIAS): T010 *"Observação sem id"* → `D017-M19` com o estado NOTA na
variante A (stdout vazio, não "exit 1"); §Vácuos 2 → resolvido; T030 (i) → `M19`
ao lado de `M17`; T042 → perde a candidata *"ramo `[NOTA]` sem carrasco"*;
§O estado do mundo → linha do ramo `[NOTA]`; §O que cada tarefa deixa medível,
T010 → os greps acima.

### Errata `_meta.sonda_relacao` — o pin da sonda nasce no red, pelo `qa-engineer`

**O que dizia.** §Contratos C2 (`:283-284`): *"Dono: `build-engineer`
(precedente C2 da 013 e T060 da 016 para o mapa); consumidor:
`check_mutation.py`"* — para o `mutation_map.json` inteiro, `_meta.sonda_relacao`
incluído. §Tipagem prevista (`:332`): *"`insumos` + `_meta.sonda_relacao` +
notas datadas no mapa (C7) | `fix` | `build-engineer`"*. O plano (P2,
`plan.md:156`; §Owner do estado, `:51`; §Um dono por arquivo, `:32`) e o
`tasks.md` (T010, `:30`; TRAVA, `:100-107`) dão o pin ao `qa-engineer`, **no
commit red**; o `tasks.md` (`:251-256`) declarou a diferença como defasagem (a)
e propôs nota, não errata.

**O que passa a dizer.** `_meta.sonda_relacao` (`total` e `descricao`) **nasce
no commit red, pelo `qa-engineer`**, no mesmo commit do bloco 017 que o lê
(`D017-SONDA1`). `insumos`, a frase em `_meta.descricao` e as notas datadas em
`_trilha` continuam do **`build-engineer`**, na W2. O arquivo tem **um autor por
wave** (TRAVA do `tasks.md`; o precedente 016 — "um autor por wave" — está
citado em `plan.md:32` e `:156`). Depois do red, o `total` só se move por errata
desta spec com id de cenário (§Os 15 cenários) — inalterado.

**Por que é correção da spec, e não desvio do plano** — a razão do orquestrador,
conferida contra o texto:

1. **A contagem pinada tem de existir quando o gate nasce.** C6 (`:141`) manda
   comparar `len(cenários)` a `_meta.sonda_relacao.total` e fixa *"`total ≠
   pinado` ⇒ FAIL nomeando as duas contagens"*; a linha do red em §Janela do
   plano (`:138`) e o estado A do `tasks.md` (T010, `:30`) exigem `[OK]
   D017-SONDA1: … 15 cenários …` **no commit red**. Com o `build-engineer` como
   dono, o pin só existiria na W2: o red nasceria com `D017-SONDA1` **vermelho
   por pin ausente** — FAIL de instrumento, não o red da demanda (REL2/FORM1),
   que `red-017.md` teria de explicar. A spec era **internamente contraditória**:
   C6, D5 (`:35`) e o estado A pressupõem o pin no red; §Contratos C2 o entregava
   a quem só escreve depois. A errata resolve a contradição **a favor das
   cláusulas que a própria spec já fixava** — a forma da Errata G1 da 013
   (`spec.md:475-476`).
2. **R3 §2 é honrada, não contornada.** O pin é o **registro canônico da
   asserção do próprio gate** (R10 §3: contagem em registro, não em prosa nem no
   corpo do gate) — autoteste, não implementação. Se o `build-engineer`
   escrevesse o `15`, o implementador estaria fixando a contagem do autoteste do
   gate (P2). O precedente correto para **pin de sonda** é a 016: `fecho.json →
   sonda.total` e `branch_protection.json → sonda.total` nasceram pelo
   `qa-engineer`, na W1, tipo `feature`
   (`specs/016-registro-contra-execucao/tasks.md:13-14`; `fecho.json:3` declara
   `Owner: qa-engineer`). O precedente que o texto original citava — C2 da 013 e
   T060 da 016 — é sobre **entradas de harness** no mapa (`targets`,
   `preflight`, `requires`), que **continuam** do `build-engineer`; D5 já
   apontava a 016 como o precedente da contagem pinada.
3. **Nada de asserção muda.** `D017-SONDA1`, o valor `15`, a forma da chave
   (`{ "total": 15, "descricao": … }`) e o consumidor são os de C6 e §Contratos.

**Pontos tocados com nota inline**: §Contratos C2 (`:283-284`), §Tipagem
prevista (`:331` e `:332`).

**Efeito no `tasks.md`**: o item (a) de §Onde o `spec-validate` vai olhar
(`:251-256`) está **riscado com a razão** — não renumerado; (b)–(g) permanecem —
e a frase de §Tipagem auditável (`:79-82`) que o cita recebe a mesma nota.
Nenhuma tarefa, dono, tipo ou wave muda: o `tasks.md` já estava do lado certo.

**Classe**: `spec-errada` (um bullet e uma célula) — processo; nenhuma asserção muda.

## Erratas da Fase 4 (2026-09-06)

> Escrita pelo `tech-lead` **depois do red** — commit `adb883f` (`R2` em
> `985c386`, `red.status: proven` em `46a812d`) — a partir de uma candidata que o
> `qa-engineer` devolveu em [red-017.md](red-017.md) §4 itens 6–7 e nas
> DEPENDÊNCIAS de T010. Diferente das duas da Fase 3, **esta alcança um gate que
> já existe e está commitado**: não muda um byte de `check_mutation.py` nem de
> `mutation_map.json`; a spec alcança o que o red provou. Linhas citadas na
> numeração de `46a812d` para esta spec e o `tasks.md` (byte-idênticos desde
> `759752c` — `git diff --stat` vazio, medido) e de `adb883f` para
> `check_mutation.py` (idêntico em `46a812d`) — todas anteriores a esta seção
> existir. **Tudo o que se afirma sobre o instrumento foi executado**, em clone
> efêmero de `46a812d` com `origin/develop` pinado em `9d617d0` e
> `MUTATION_DEFER_MISSING=1`, um commit efêmero por estado, `git reset --hard`
> entre eles; o clone terminou limpo em `46a812d`.
>
> **Quem decidiu**: o orquestrador, na Fase 4, sob a autoridade delegada de
> 2026-08-29 — o `qa-engineer` ofereceu **duas rotas** (errata aditiva ou retirar a
> sexta causa do gate) e o orquestrador **escolheu a errata**; a razão está escrita
> abaixo para poder ser cobrada. O `tech-lead` não leu o chat e não afirma mais do
> que isso. **Esta errata não pede ratificação do proprietário** pelos quatro
> testes de sempre: nenhuma asserção enfraquece (uma causa a mais, um elemento a
> mais reprovado — só fortalece), nenhuma boundary se move, nenhum veredito de gate
> alheio muda, e o gate **não é tocado** — se a leitura do proprietário for outra,
> reverter o commit desta seção é barato: **nenhuma redação original foi apagada**
> (R2 §5); cada ponto tocado leva nota inline `*(Errata \`INS1(f)\` · Fase 4)*`.
>
> **O que não é reaberto**: D1–D5; C1, C2, C5–C9 e as asserções de REL1/REL2/
> CORE1/SONDA1; os 15 cenários da sonda e `_meta.sonda_relacao.total = 15`
> (`M20`/`M21` **não** são cenários — abaixo); `IC-*`; as erratas a aplicar na 013
> (C9); as duas Erratas da Fase 3; P1–P8 do plano; PP-1…PP-11; o commit red
> `adb883f` e o `red-017.md` (fechado e repinado — não se reabre; o que nasce
> aqui é registrado adiante, como `M3`/`M4`/`M8`). Identificação pelo **objeto**
> amendado: **Errata `INS1(f)`** — a sexta causa de `D017-INS1`, e, na mesma
> errata porque é a mesma família (pré-condição estrutural antes das causas
> fechadas), a extensão de `FORM1(a)`.

### Errata `INS1(f)` — a sexta causa de `D017-INS1` e a extensão de `FORM1(a)`

**O que dizia.** C3 (`:138`) fecha `D017-INS1` em **cinco** causas, (a)–(e), todas
pressupondo que `insumos` **é** um objeto `classe → [paths]`; §Vocabulário fechado
(`:116-118`) lista os cinco tokens de saída; §Contratos C2 (`:277-278`) diz
"objeto …; regras (a)–(e); ausente ≡ `{}`" e nada sobre valor presente que não é
objeto; §Comportamento (`:192`) dá uma só forma de linha para "`insumos`
malformado", com `<classe> (<paths>)`. C4(a) (`:139`) fecha `FORM1(a)` em quatro
violações de forma — `\`, `./`, `/` inicial, `..` — sobre "todo elemento", sem
dizer o que é um elemento que **não é string** ou é a **string vazia**.

**Fato medido — o gate que nasceu no red** (`check_mutation.py`, `adb883f`):
`mut_relacao` emite uma **sexta** causa em `:565-570` — `insumos malformado — não
é objeto classe → [paths]: <tipo>` — quando `insumos` está presente e não é
`dict`, e então o trata como `{}` (o comentário do próprio gate, `:566-567`,
declara-a "fora das cinco causas fechadas de C3"); `d017_forma_ok` (`:501-509`)
devolve `False` para não-string e para `""`, e `_canonicos` (`:548-556`) imprime
não-string por `repr` e string crua. `null` cai em `ins = {} if insumos is None`
(`:564`) — identidade. O `red-017.md` §4 itens 6–7 registrou os dois e ofereceu as
rotas. Executado em cópia (harness `d010`; estado A = 9 problemas, exit 1):

| Entrada em cópia | O que o instrumento imprimiu (linhas da `d010`/`p50`) | fecho 017 |
|---|---|---|
| A — referência | `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js, tests_010_vao.js` | 9 |
| `d010.insumos = []` | `[FAIL] D017-INS1: d010 · insumos malformado — não é objeto classe → [paths]: list` **e** a REL2 de A | 10 |
| `d010.insumos = "oraculo"` | idem, com `str` | 10 |
| `d010.insumos = null` | **igual a A** — identidade (borda 9) | 9 |
| `d010.targets + [7, ""]` | `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: 7` · `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: ` (vazio: **nada** após `: `) · a REL2 de A | 11 |
| `d010` com `insumos` válidos (C7 só nela — o estado C da `d010`) | `[OK]   D017: d010 · gatilho ⊇ conjunto mutado ∪ {harness} (3) · insumos: oraculo 1, fixture 1` | 8 |
| estado C da `d010` + `insumos = []` — **`D017-M20`** | INS1 `list` **e** `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js, tests_010_vao.js` — os dois paths que a razão cobria voltam a fantasma | 10 (= 8 + 2) |
| estado C da `d010` + `targets + [7, ""]` — **`D017-M21`** | as duas FORM1 acima; **nenhum** REL2; **nenhum** `[OK] D017: d010` | 10 (= 8 + 2) |
| `p50.insumos = []` (harness em **identidade**) + `d010.insumos = []` — gate íntegro | `[FAIL] D017-INS1: p50 · insumos malformado — não é objeto classe → [paths]: list` — nomeado | 11 |
| **contrafactual — a rota de remoção** (sexta causa retirada em cópia; não-objeto coagido a `{}` em silêncio) + os mesmos `[]` | `[OK]   D017: p50 · gatilho ⊇ conjunto mutado ∪ {harness} (5)` — **passa calado**; `d010`: só `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): …` — a razão **existe** e está malformada: **causa errada** | 9 (= A) |

**Por que errata, e não remoção** — a razão do orquestrador, conferida contra a
medição, para ser cobrada:

1. **Remover a sexta causa faria `insumos: []` passar calado, e silêncio é FAIL
   pela R10 §2.** Não é hipótese: a última linha da tabela é a rota de remoção
   executada — num harness em identidade (`p50`) o `[]` vira `[OK]`, e num
   harness com excedentes (`d010`) a linha que sai atribui a falha a "sem razão de
   classe" quando a razão foi escrita e está quebrada — o instrumento dizendo
   outra coisa do que aconteceu, a família de `E016-5`/`EA-31`, dentro da demanda
   que existe para instrumentar registro contra execução.
2. **Ajustar o gate para caber na spec seria ajustar o objeto à régua — o inverso
   do que a R10 §1 manda.** A régua é a spec; quando a spec descreve menos do que
   o gate corretamente mede, quem se corrige é a régua, por errata com id, e o
   gate fica. É a direção permitida de R10 §1 (fortalecer), a mesma das Erratas
   `D017-M19` e `_meta.sonda_relacao`.
3. **A alternativa "nem errata nem remoção"** — deixar a causa no gate e fora da
   spec — é a **observação sem id** que a Errata `D017-M19` já recusou: o
   `spec-validate` extrai exigências da spec (`SKILL.md` passo 1) e classificaria a
   sexta linha do executável como `implementação-divergente`, a classe mais cara
   ("divergência pesa mais que ausência", passo 4), sem que nada estivesse errado.

**O que passa a valer.**

| Campo | Registro |
|---|---|
| **C3 (f)** — sexta causa fechada de `D017-INS1` | `insumos` **presente e não-objeto** (lista, string, número, booleano): FAIL nomeando o **tipo** — `[FAIL] D017-INS1: <h> · insumos malformado — não é objeto classe → [paths]: <tipo>` — sem `<classe> (<paths>)`, porque não há objeto de onde tirá-los; no resto do cômputo o valor é `{}`, logo os excedentes que a razão cobriria **saem em REL2** (é o esperado: não há razão válida a subtrair). É a **pré-condição estrutural** de (a)–(e). As causas fechadas de INS1 são **seis**; os seis tokens estão em §Vocabulário fechado |
| **Identidade** (borda 9, C2) | `insumos` **ausente** ≡ `null` ≡ `{}` — medido; nenhum dos quatro harnesses de identidade muda. `[]`, `""`, `0`, `false` **não** são identidade: são (f) |
| **C4(a)** — extensão de `FORM1(a)` | Elemento **não-string** ou **string vazia** em `targets`, `arquivos_mutados` ou `insumos` é `path fora da forma canônica` — nomeado por `repr` quando não-string (`7`) e cru quando vazio — e fica **fora** da comparação como os quatro casos originais. `fontes` (o token do `cmd`, PP-9) continua **fora** de FORM1 — a spec sempre listou só os três conjuntos, e um `cmd` com `./` cairia em REL1+REL2 com o diagnóstico de basename (red §4 item 7). **Observação de forma, medida**: para `""` a linha termina em `: ` sem sujeito (`check_mutation.py:554`, `txt = p if isinstance(p, str) else repr(p)`). A alínea **reprova e nomeia o conjunto** — R10 §2 satisfeita —; a forma vai como **candidata** ao relatório final (T042), não como conserto: consertar seria a segunda edição do julgador (escalonamento 4 do `tasks.md`), fora desta errata |
| **`D017-M20`** — carrasco de (f) | Mutante de **árvore** sobre `mutation_map.json`, em cópia, no **estado C** (depois de T020): `d010.insumos` trocado por `[]`. **Morte** = presença de `[FAIL] D017-INS1: d010 · insumos malformado — não é objeto classe → [paths]: list` **e** de `[FAIL] D017-REL2: d010 · alvo fantasma (sem razão de classe): fixtures_010_vao.js, tests_010_vao.js`; fecho do bloco **+2** sobre o do estado C. Sob a rota de remoção só a REL2 apareceria — é exatamente o que o distingue |
| **`D017-M21`** — carrasco da extensão de FORM1(a) | Mutante de árvore, cópia, estado C: `7` e `""` acrescentados a `d010.targets`. **Morte** = `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: 7` **e** `[FAIL] D017-FORM1: d010/targets · path fora da forma canônica: ` (duas linhas, `grep -c '^\[FAIL\] D017-FORM1: d010/targets'` = 2), `grep -c '^\[OK\] *D017: d010'` = 0, **nenhuma** REL2 da `d010`; fecho **+2** |
| **Onde vivem** | **T022** (W2, `qa-engineer`, em cópia — a tarefa que já mata `M4` sobre o mapa), com a saída guardada para o **relatório final** (T042), como `M3`/`M4`/`M8`: `red-017.md` está fechado e repinado e não se reabre. `mutation-matrix.json → dividas_declaradas`, **família one-shot de árvore, ao lado de `M1…M9`** (T030 (ii)); credor `EA-42`. Ids **permanentes**, na série `D017-M<n>` |
| **O que não é** | **Não é cenário da sonda**: `_meta.sonda_relacao.total` continua **15** — um cenário xvi exigiria editar `D017_CENARIOS` e o pin, isto é, segunda edição do julgador com red próprio (escalonamento 4); se um dia entrar, é errata desta spec **com id de cenário**, movendo o pin no mesmo commit (§Os 15 cenários). **Não muda** `mut_relacao`, PP-1…PP-11, nenhuma linha de `check_mutation.py`, nenhuma forma de linha já fixada pelo red (§4 do `red-017.md`), nem a precedência (e) > (d) > (c) entre causas por path (red §4 item 8 — forma fixada pelo executável, não critério). **Não reabre** o `red-017.md` |
| **Classe** | `spec-errada` por **omissão** (a spec descrevia cinco causas onde o gate corretamente mede seis; "todo elemento" sem dizer o que é elemento) — **fortalecimento**; nenhuma asserção enfraquecida; o gate não muda |

**Pontos tocados com nota inline** (numeração de `46a812d`, anterior a esta
seção): §Vocabulário fechado (`:116-118`), célula de C3 — critério, gate e
mutante (`:138`), célula de C4 — critério e mutante (`:139`), §Nascimento de gate
(`:148`), §Guarda de tautologia — linhas de INS1 e FORM1(a) (`:167`, `:168`),
§Comportamento (`:192`), borda 9 (`:230`), §Contratos C2 (`:277-278`),
§Arquivos rastreados — linha da matriz (`:321`), Risco 6 (`:378-380`).

**Efeito no `tasks.md`** — **consolidado no mesmo commit** (não deixado "por
consolidar", lição da W0): T022 (`M20`/`M21` em cópia, estado C, com as linhas
esperadas), T030 (ii) (família one-shot `M1…M9, M20, M21`), T042 (candidata de
forma de `""`; saídas de `M20`/`M21`), §O estado do mundo (linhas de INS1 e
FORM1(a)), §Vácuos declarados 1, §O que cada tarefa deixa medível (T022), §Onde o
`spec-validate` vai olhar (linha C1–C6). Nada renumerado; nenhum dono, tipo ou
wave muda. Fora desta errata e no mesmo commit, o `tasks.md` recebe **T037/T038**
(docstring de `ex_ids_do_harness` — decisão do orquestrador, não errata desta
spec: não há critério que a docstring viole; é C8 (iv) que ganha um patch-point).
