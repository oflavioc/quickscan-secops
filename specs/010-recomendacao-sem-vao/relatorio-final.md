# Relatório final — 010-recomendação-sem-vão

> Fase 6 · dono: `doc-writer` · registro do que os gates decidiram, com os números
> que eles emitiram. **Este documento não decide PASS/FAIL** — quem decide é o
> gate citado em cada linha, e o dono de cada execução está nomeado. Fontes:
> `refinement.md`, `spec.md`, `plan.md`, `tasks.md` (todos em
> `specs/010-recomendacao-sem-vao/`), o planning-state
> (`.claude/project-memory/planning-state/010-recomendacao-sem-vao.json`), os
> registros canônicos `.claude/verify/expected_suites.json`,
> `.claude/verify/mutation-matrix.json`, `.claude/verify/mutation_map.json` e
> `.claude/verify/pins.json`, e o `git log` da branch
> `feature/010-recomendacao-sem-vao` (`develop` `c51e60f` … HEAD `47fee9b`).

## Objetivo cumprido

O **vão de contexto parcial** deixou de existir. O argumento de
`hideLegacyRecommendation` era a constante `true` no ramo não-legado: declarar
qualquer contexto desligava a recomendação da Camada 1 congelada **mesmo quando a
camada V3.2 não tinha substituto**, e o leitor ficava sem as duas — foi onde o
cliente caiu e recebeu zero recomendações (itens 4, 6 e 8 do feedback de
2026-08-27). O argumento passou a ser `hasSubstituteV32(ctxRes)`, predicado **puro**
sobre `lastCtx.contexts`: *há capability com apresentação `card`, com
candidato/serviço/nota e classificação ≠ `CONTEXT_NOT_INFORMED`?*

Três superfícies entraram junto:

- **habilitador a validar no card-alvo** (`tgtValidateHTML`, `ui_target_v32.js`),
  ancorado no **nível atual confirmado** e no catálogo congelado, publicado *se e
  somente se* prática em S2-contexto, resposta confirmada, `MAP[qid].lv[atual].c`
  não vazio e **gate de suficiência ABERTO** (INV-3, moeda UI-009A);
- **bloco de ausência** em `#v32base`/`#pr-sup-base`, hoje **partido por payload**
  (errata **E18**): a capability sem payload do engine vira nome no aviso único; a
  que tem serviço/nota/candidato **continua card**;
- **correção de uma violação viva de INV-7**: `baseCardHTML` imprimia *"Leitura
  V3.1.3 preservada"* enquanto a mesma tela ocultava a leitura citada. A frase
  passou a ser função do **mesmo** veredito da arbitragem, e no papel nunca é
  afirmada, porque a Camada 1 nunca é impressa.

Nenhum arquivo `frozen` foi escrito: `engine_v32.js` e a Camada 1 apenas lidos, com
`declared.m41_payload_sha256` inalterado nos **três** rebuilds — Porta B fechada.

## Cadeia da demanda

| Passo | Registro |
|---|---|
| Autorização nominal §29.4 (`ui_v32.js`, `ui_target_v32.js`) | Concedida **pessoalmente pelo proprietário** no chat em 2026-08-30 ("Autorizo"), restrita a estes dois arquivos e a esta demanda; registrada em `spec.md` §"Autorização nominal §29.4". Os portões 0–3 foram **decididos sob a delegação de 2026-08-29**, não aprovados por ele pessoalmente |
| Fases 0–3 | `3ddf3c2` (refinamento), `686f559` (spec), `b74dab0` (plano), `354854b` (tarefas) — 29 tarefas em 12 waves, dono único por arquivo, julgador antes do julgado |
| Fixtures provadas por execução (W1) | `0aa3778` (T002), `101630b` (`D010-F4`), `a4f2118` (emenda de `D010-F3`) — a **errata de vacuidade** (`a43d6f4`) nasceu daqui: quatro alíneas fechariam verdes sem medir nada |
| **Red commitado** (R3 §4) | `4d2d49d` — **1 PASS · 12 FAIL de 13**; `D010-ARB2` nasce verde por ser critério de **preservação**. Reprovado e reexecutado após a emenda de cobertura (`57a5d6f`, `1ac6157`): veredito inalterado, razões byte-idênticas contra o juiz de `HEAD` |
| W4 · `ui_target_v32.js` | `8c6c426` (T008, +96/−3): `tgtEnablerState`/`tgtEnablersHTML`/`tgtAbsenceHTML`/`TGT_DISCLAIMER`/`gateNote` **byte-idênticos** (prova por `diff -U0`) — R-1 preservada. Rebuild `ca4fb8c` |
| Medição isolada (T012) | 8/8 suítes exatas contra o canônico; campanha `d009` **19 KILL de 19**, protocolo de árvore limpa com as 10 identidades conferidas **por fora** do harness |
| W7 · `ui_v32.js` | `b86bbac` (T013, +91/−12): `hasSubstituteV32`, `baseAbsenceHTML` como helper único das duas superfícies, 4º parâmetro `afirmaPreservacao` com **default falsy de propósito**. `HIDE_EYEBROWS` e a regra da varredura (`:164-194`, inclusive a interrupção `hiding=false` que `U15` mede) byte-idênticas. Rebuild `ede533c` → **13 PASS · 0 FAIL de 13**, medido pós-rebuild |
| Erratas E14–E17 | `aecc6fc` (alcance da equivalência, rota `chave → id`), `536e437` (prefixo `map:` **normativo**), `a8cf0e8` (prova manual apodrece), `091324a` (`D010-M11` equivalente por construção), `760883b` (`D010-M26` + repin inline de `PROTECTED`) |
| **Reprovação do PO e correção** | `c44441f` (errata **E18**) → `fdb3320` (**red da partição: 12 PASS · 1 FAIL de 13**) → `5597e0a` (partição por payload) → rebuild `ab6f70b` → `8e843bd` (papel medido por gate, âncora reancorada, dois defeitos do instrumento) |
| Repins | Série R1–R16, **um por commit de conteúdo que toca pinado** (R8 §1), com o motivo na mensagem — o `tasks.md` previa a série e a regra de autocorreção: commit extra herda o próximo número em vez de a contagem virar dogma |
| Registro da suíte | `d010` em `expected_suites.json` no MESMO PR (R10 §3), com a janela vermelha **declarada** entre T006 e T016 e encerrada por execução em T017 |

## Números — o que cada gate emitiu

Nenhuma execução abaixo é minha. Cada linha nomeia quem executou e o registro onde
o número vive; o que confirmei nesta escrita foi o **registro**, por leitura.

| Medição | Resultado | Onde vive / quem executou |
|---|---|---|
| Suíte `d010` (`tests_010_vao.js`) | **13 PASS · 0 FAIL de 13** | `.claude/verify/expected_suites.json` → `suites.d010` (`pass: 13`, `fail: 0`), fixado **por execução** em T017 (`qa-engineer`, commit `5bdef07`), não pelo total declarado na spec — a coincidência com C1..C13 foi conferida, não presumida |
| Campanha `d010` | **24 DETECTADO · 0 SOBREVIVENTE · 0 NÃO EXECUTADO** — 27 declarados, 24 executados, **3 em dívida com causa** | T021 (`qa-engineer`); `mutation-matrix.json` traz 25 pares `d010` (24 `KILL` datados de 2026-08-31 + `D010-M11` marcado *equivalente por construção*) e as 3 dívidas em `dividas_declaradas` |
| Dívidas da campanha | `D010-M3`/`D010-M4` — **sem caso nas fixtures** (matáveis, falta cenário); `D010-M11` — **equivalente por construção, provado** (nunca "falta fixture", que mandaria alguém pagar dívida impossível) | `mutation-matrix.json → dividas_declaradas`; cadeia em `spec.md` §E17 |
| Campanha `d009` (regressão da demanda vizinha) | **19 KILL de 19** | T012 e T021 (`qa-engineer`) |
| Campanha `core` | **3 KILL de 3** | T021 (`qa-engineer`) |
| Campanhas `p51`/`p52` | **FAIL nomeado** — exigidas e ambiente sem Chromium (KI-3). Declarado, nunca SKIP (R10 §2); fecham no job `visual` do CI | T021 (`qa-engineer`) |
| `p50core` | **64 PASS · 0 FAIL** após o repin inline de `PROTECTED` (T023) — eram 60/4, e os 4 eram **de pin, não de regressão**: dois hashes (`ui_v32.js` lido por `P50-GOV1`/`P50-IC4`; `ui_target_v32.js` por `P50-SUF0`/`P50-SUF8`) | `expected_suites.json` → `suites.p50core`; comentários-trilha R8 §2 com motivo, data e "Identidade anterior" |
| Suítes congeladas | **14 verdes no canônico**: `ui31` 19/0 · `ui32` 25/0 · `ui33` 11/0 · `ui332` 23/0 · `ui333` 26/0 · `ux41` 56/0 · `target` 30/0 · `ref` 28/0 · `journey` 31/0 · `icons46` 12/0 · `engine` 105/0 · `p52layout` 45/0 · `d009` 15/0 · `unset` 12/0 (+1 não executado, `UG13` exige Chromium — dentro do intervalo declarado). `U1`, `U2`, `U7`, `U15`, `V10`, `V15`–`V17` e `P1` verdes | T017 (`qa-engineer`) |
| Identidade do engine | `declared.m41_payload_sha256` = `9794b267e4225d8f…4365b` **inalterado** nos três rebuilds (`ca4fb8c`, `ede533c`, `ab6f70b`) — Porta B fechada | `pins.json → declared` (conferido nesta escrita); stage `m41` |
| Pipeline completo (T026) | **13 PASS · 1 FAIL de 14 stages** — o FAIL é o stage `mutation` com `p51`/`p52` exigidas e sem Chromium, previsto e declarado | `qa-engineer` |
| `spec-validate` | **13 de 14 conformes**; um gap real de classe *spec-errada* (a linha normativa de C8 não acompanhava a errata **E17**), corrigido. Dois dos três flags do extrator foram descartados pelo próprio QA como artefato dele, em vez de virarem "gaps" | `qa-engineer` |

## Pontos com nome próprio

### 1 · O `product-owner` reprovou o aceite, e a reprovação estava certa

O primeiro veredito de T029 foi **REPROVADO**. A objeção: V3 subtraía conteúdo
dentro da demanda cujo enunciado é *"declarar contexto nunca subtrai conteúdo"*.
Sob `CONTEXT_NOT_INFORMED` a apresentação `base` é atribuída **também** por
`(c.services||[]).length` (`ui_v32.js:650-653`), e o card que existia ali
renderizava **Serviços**, o estado de maturidade e o `why`. A premissa que gerou V3
— *"N cards cujo único conteúdo possível é dizer que não houve declaração"* — é
**do próprio PO**, do refinamento, e ele **nomeou a própria autoria** ao reprovar:
é verdadeira para o card **vazio** e falsa para o card **com serviço**.

A objeção **não foi aceita por autoridade: foi falsificada por execução** antes de
virar correção — e o medido é maior que o alegado. Na sessão inicial típica de um
assessment (editor de contexto salvo, tudo `UNSET`), o engine anexa **7 serviços**
por `hasGap`, `baseIds` tem **10** entradas e **3** têm serviço: **5 nomes de
serviço somem da tela**. No papel, `#pr-support` foi de **8944 para 2645 chars —
31%**, com todas as demais seções byte-idênticas. A perda era cirúrgica e invisível.

O remédio é a errata **E18** e a **partição de `baseIds` por payload**: `C6 (a)`
virou **igualdade de conjunto** e `C6 (b)` moveu junto. De 5 nomes ausentes para 0.
Os **42%** de cards **sem** payload continuam colapsados no aviso — a premissa do
refinamento permanece intacta **para eles**, que é exatamente o alcance em que ela
é verdadeira.

### 2 · A raiz era única — e um remédio para os dois sintomas teria consertado metade

A mesma subtração que apagava cinco nomes de serviço do relatório era a que
derrubava o `P52-TGT4` no CI, **nos dois sentidos opostos**: caso B *"nome de
estágio publicado no bloco"* e caso C *"alvo 2.8 ausente do papel"*. O gate fatia o
texto do `pdftotext` **por posição no fluxo de palavras de uma página**, entre dois
marcadores (`tests_p52_chromium.js:3993-4002`), e o terminador é o `TGT_DISCLAIMER`
(`ui_target_v32.js:465`). Encolher `#pr-sup-base` em **2842** (B) e **5603** (C)
chars — seção que vem **antes** de `#pr-target` na ordem canônica — puxava o bloco
de comparação quase **uma página inteira** para cima, e ele passava a cavalgar outra
quebra. `#pr-target` **não muda um byte** nos dois casos.

Uma causa, dois sintomas. Tratar cada sintoma como defeito próprio teria produzido
dois remédios, e nenhum dos dois tocaria a causa.

### 3 · O padrão que a demanda encontrou seis vezes

*Alínea cuja pré-condição nunca falha é indistinguível de alínea que mede, até
alguém escrever o mutante e ele sobreviver.* A demanda topou com isso seis vezes:
**E1** (a cláusula A5 do predicado), **E5** (`D010-CARD3`(b), verdadeira por estado
e não por gate), **E17** (C8(a), tautologia por construção) e mais **três no ciclo
de correção** — a metade do **papel** que nenhuma alínea media (`D010-ABS1`(e) e
`D010-PAPEL1`(b) varriam só `D010-F1`, onde o conjunto com payload é vazio), o termo
do `data-eid` de `CARD1`(a) que nunca decidia, e o ramo *sem equivalência V3.2* que
fixture alguma percorria.

O instrumento que separa uma coisa da outra é a **campanha** — e só desde que a
demanda **013** a ensinou a distinguir **SOBREVIVENTE** de **NÃO EXECUTADO**. Antes
disso, os dois estados somavam no mesmo número, e um par que nunca rodou era
indistinguível de um par que rodou e não pegou nada.

### 4 · O preflight da 013 pagou-se aqui, nesta correção

A âncora do `D010-M8` **apodreceu na própria correção**: a partição reescreveu a
linha que o mutante ataca, e a âncora antiga foi a **zero ocorrências**. O
`--preflight` a pegou **antes da campanha** — `não_executável D010-M8 · ocorrencias=0
· âncora não encontrada`, exit 1, provado em cópia efêmera com a âncora antiga
restaurada. É a classe de defeito que a 013 existiu para caçar, e desta vez o
instrumento funcionou **no dia**, não seis meses depois.

Dois defeitos do próprio instrumento vieram junto e foram fechados: um **buraco no
array de mutantes** por vírgula dupla (o `forEach` pula buracos — por isso nenhuma
sonda o via —, mas `Array.from(new Set(map))` o materializa como `undefined` e
derruba o preflight) e uma **quebra de `reason` alheia por mudança de literal**,
desta vez por mensagens escritas **sem acento**, que quebrou a regex do `M7` e
violou R12 de quebra. A regex **não foi afrouxada** (R10 §1): a acentuação foi
corrigida em 18 tokens e as 24 regex reauditadas contra o fonte do oráculo.

## O que fica aberto — nomeado, não diluído

1. **A fixture do ramo sem aviso.** A alínea `D010-ABS1`(a) exigia *exatamente 1*
   aviso e teria **reprovado um estado legítimo**: todo `baseIds` com payload — um
   SOC maduro com uma prática fraca. O aviso passou a ser esperado
   **condicionalmente**; a fixture que exercita esse ramo fica em **dívida
   declarada, com rota medida** (`incident-response` em 0 e as demais em 3, medido
   em 2026-08-31). Não é o caso de `D010-M11`: lá o estado é inalcançável por
   invariante; aqui é só falta de fixture, e a fixture é barata.
2. **O resíduo de −1807 chars do caso C do `P52-TGT4`.** Na condição exata do gate,
   base do PR × hoje: caso B de **−2842 para −34** chars (1,2% do desvio, restaurado)
   e caso C de **−5604 para −1807** (68% recuperado); `#pr-target` em 0 nos dois. O
   que sobra é **por desenho** — são as capabilities sem payload, que a premissa do
   refinamento manda colapsar. **O risco do caso C não está eliminado, e só o PDF
   real decide**: quem declara é o `qa-engineer`, pelo job `visual` do CI.
3. **O recorte de `blocoTexto` do `P52-TGT4`.** `slice(ini, fim > ini ? fim :
   undefined)` **alarga o sujeito da asserção em silêncio** quando o terminador sai
   da página: o bloco engole o vizinho e a falha aparece como "publicou o que não
   devia". É **suíte congelada** (§29.4) e **não foi tocada**. Registrado como
   achado (abaixo), não corrigido. Se o vermelho persistir depois desta correção, o
   achado passa a ser o recorte — e aí é frase nova do proprietário.

## Achados devolvidos — ids `EA-*` propostos

**Conferência da `develop`, feita nesta escrita** (P13 do refinamento, `spec.md`
§"Achados a registrar"):

- `develop` (`acc9c21`) tem os headings **`EA-1`, `EA-2`, `EA-3`** em
  `.claude/BACKLOG.md`, e **reserva `EA-4` em prosa** (`:362`: *"será registrado
  como `EA-4` quando a 009 fechar"*);
- a branch `feature/013-integridade-da-campanha` — **ainda não mesclada** — já
  aloca **`EA-4`, `EA-5`, `EA-6` e `EA-7`** no mesmo arquivo. O risco de colisão de
  id entre branches já é conhecido e está registrado na memória do `product-owner`
  da 013;
- nenhuma outra branch carrega heading `EA-*`.

**Logo, a 010 começa em `EA-8`.** Nada foi escrito em `.claude/BACKLOG.md` — a
alocação abaixo é **proposta**, e o id só é permanente quando o heading existir.

| Id proposto | Achado | Cadeia | Disposição |
|---|---|---|---|
| **`EA-8`** | `data-eid` **não é chave global** no engine: `fortiai-assist` é id simultâneo em `OFFERINGS` e em `SOLUTION_AREAS` | medido na T004 pelo `data-engineer`, planning-state `t004_equivalencia.achados_registrados` | backlog, `aberto` |
| **`EA-9`** | `validateConfigV32` **não proíbe `:` em id**: a não-colisão do prefixo `map:` é **convenção medida** (0 ocorrências em 95 ids + 22 `SIGNAL_IDS`), não invariante checada | T004 + errata **E15** | backlog, `aberto` |
| **`EA-10`** | O recorte de `blocoTexto` do `P52-TGT4` alarga o sujeito da asserção em silêncio quando o terminador sai da página | `tests_p52_chromium.js:3993-4002`; suíte congelada, **não tocada** | backlog, `aberto` |
| **`EA-11`** | A guarda de não-vacuidade de `D010-INV7`(a)/(b) aponta para `d010BaseInV32Base` — o conjunto que **a própria V3 esvaziou**. As alíneas discriminam **hoje** (`D010-M6` morre em (a), medido), mas `baseIds` pode ser não vazio com `#v32prio` sem card base, e aí (a) fecharia verde **sem sujeito**, com a guarda satisfeita | achado do `ui-engineer` em T013, devolvido em W7 | backlog, `aberto` — o remédio de gate é do `qa-engineer` |

**Não vai para o backlog — vai para `design-decisions.md` §Candidatas**, na forma
dada pelo PO:

> **cláusula defensiva inalcançável por construção, declarada, sem mutante — não
> reportar como código morto.**

São três instâncias vivas nesta demanda, e é por isso que a entrada é de classe e
não de caso: a **cláusula A5** do predicado de arbitragem (**E1**), o
`if (temCandidato) return "";` de `tgtValidateHTML` (**E17**) e o **4º parâmetro de
`prCards`**, que nunca é passado truthy por desenho (C13). As três são baratas, só
podem deixar o produto mais conservador, e nenhum mutante que as remova pode morrer.
**Eu não escrevi em `.claude/rules/design-decisions.md`** — está fora dos arquivos
desta delegação (ver §Dependências).

**Vira demanda própria**: o **item 6a** — a seção *"Apoio nas prioridades declaradas
· contexto V3.2"* (`ui_v32.js:661`), remoção da seção **ou** do sufixo de versão do
título. Já estava em §Fora de escopo com a decisão *adiada por desenho*, e o PO
acrescentou um **dado novo**: depois de **E18**, `#v32base` tem cards **com
conteúdo** *e* um aviso, e não mais só cards mudos. A decisão de 6a deve, portanto,
ser tomada com **evidência de tela pós-E18** — não pós-V3, que é a tela que não
existe mais.

**Candidatos que li nos artefatos e que NÃO aloquei** (não constam da devolutiva que
me foi passada; se algum deles for um dos seis, o id sai daqui e a numeração acima
desloca): o asset `FortiGuard-Service-Bundle` inalcançável por `iconFor`; `SOCaaS`
como único asset do `ICON_MAP_V32` servido apenas pelo `ICONS` da Camada 1; **A3**
(`.prod-mini` órfão, acoplamento que permanece sob contexto declarado); **A6** (T3
oculto por contiguidade — cadeia corrigida para *efeito de tela apenas*, pendente de
confirmação por execução); a divergência inerte de `P52_CANONICAL_ORDER`
(`tests_p52_layout.js:63-64`). **A4** (frase falsa de INV-7) é achado **resolvido
por esta demanda**, medido por `D010-INV7`, e entra no backlog já como `resolvido` se
o orquestrador quiser o registro histórico.

## Emendas de redação de 2026-08-31 — o que mudou na `spec.md`

Todas doc-only, **zero byte** de produto, de gate ou de fixture. Origem: o
`product-owner`, que retirou a reprovação e declarou *"não encontrei objeção"*.

1. **Linha C6 da tabela de critérios** — (a) e (b) passam à semântica de **E18**:
   (a) vira **igualdade de conjunto** (os `.v32-card` de `#v32base` são exatamente
   os **com** payload, por `data-cap`) com o aviso **condicional** (1 se houver
   capability sem payload, 0 se não houver) e não-vacuidade nas **duas** direções;
   (b) nomeia exatamente os **sem** payload e **nenhum** com payload. Fixtures da
   linha: `D010-F1` **e** `D010-F4` em (a)/(b). Citações de `ui_v32.js` reancoradas
   ao estado pós-E18 (`:744-766` na tela, `:1271-1282` no papel). **Não é
   cosmético**: a linha antiga descrevia o que o produto, de propósito, deixou de
   fazer, e uma demanda futura poderia lê-la como critério ratificado e **restaurar
   o colapso**.
2. **Coluna de mutantes de C6** — `D010-M27` passa a constar (nascido com **E18**,
   âncora escrita pela implementação em `ui_v32.js:766`), como a direção oposta de
   `D010-M8`. O par já vive em `mutation-matrix.json` com `KILL` de 2026-08-31; a
   tabela é que não o registrava.
3. **Alínea (c) de C9** — substituída pelo **texto literal do PO**: troca de
   **atribuição de prova**, não de asserção. O diferencial prova que a publicação
   *acompanha o gate canônico*; a **posse** da decisão (UI-009A / INV-3) é desenho
   conferível no diff, e não o que o diferencial mede. Gate, fixture e mutante
   intactos.
4. **Resíduo de sessão assimétrica** (§1) — qualificado: o resíduo é fechado no
   card-alvo **quando há alvo declarado e a suficiência está aberta**; sem alvo, a
   capability perde o congelado e fica com o nome no aviso (ou conserva o card base,
   se tiver payload — **E18**).
5. **A escolha do `afirmaPreservacao` no card base restaurado** (§3) — declarada
   **no registro, sem tocar código**: `ui_v32.js:766` chama `baseCardHTML` **sem** o
   4º argumento, enquanto `#v32prio` o repassa (`:750`, via `renderCap`, `:732`).
   Não é falso e não fere C5(b) — o default é falsy de propósito (`:618-628`) —, mas
   a escolha era **implícita**, e o próprio arquivo declara o padrão contrário para o
   gêmeo do papel (`:830-832`). A escolha escrita: o papel nunca afirma porque a
   Camada 1 não é impressa; a tela só afirma onde o card aponta para a leitura **no
   mesmo bloco visual**.

**Deriva irmã corrigida no mesmo passe** (o mesmo arquivo carregava a afirmação que
E18 tornou falsa em mais três lugares): **§2 · Bloco de ausência** (dizia *"onde hoje
há N `baseCardHTML`, passa a haver um aviso"*), **C13(b)** (dizia *"`#pr-sup-base` é
o aviso único de C6"* — e é justamente a alínea cuja versão de gate fechava verde por
estado antes de o papel ser partido) e **C6(e)**, que agora aponta a partição do
papel. **E5 não foi reescrita**: é registro histórico do que se decidiu em
2026-08-30 e permanece como foi decidido, com um ponteiro de trilha para a redação
final de C9 (R2 §5 — refutação registrada permanece).

## Dependências deixadas para outros

- **`.claude/rules/design-decisions.md` §Candidatas** — a entrada *"cláusula
  defensiva inalcançável por construção"* **não foi escrita**: está fora dos
  arquivos desta delegação, o arquivo é pinado (repin no mesmo PR, R8 §1) e o
  conteúdo de §Candidatas é do `product-owner`. Texto pronto acima.
- **`.claude/BACKLOG.md`** — nada escrito; ids `EA-8`…`EA-11` são **proposta**.
- **`_trilha` do harness `d010` em `.claude/verify/mutation_map.json`** — ainda diz
  *"23 mutantes EXECUTADOS de 26 declarados"*. O harness tem **24** entradas e a
  matriz registra **27 declarados / 24 executados / 3 dívidas**: a prosa do registry
  não acompanhou `D010-M27`. Registry é do `build-engineer`/`qa-engineer` (R8) — não
  toquei.
- **`plan.md:81` e `tasks.md` (T013)** — descrevem a substituição dos *"N
  `baseCardHTML`"* sem a partição de E18. São artefatos do `tech-lead`; não os
  editei.
- **Job `visual` do CI** — as campanhas `p51`/`p52` e o veredito final do
  `P52-TGT4` (caso C) são do `qa-engineer`, sobre PDF real.

## Fontes citadas

`specs/010-recomendacao-sem-vao/{refinement,spec,plan,tasks}.md`;
`.claude/project-memory/planning-state/010-recomendacao-sem-vao.json`;
`.claude/verify/{expected_suites,mutation-matrix,mutation_map,pins}.json`;
`.claude/BACKLOG.md` em `develop` e em `feature/013-integridade-da-campanha`;
commits `3ddf3c2` · `686f559` · `b74dab0` · `354854b` (fases 0–3), `0aa3778` ·
`101630b` · `a43d6f4` · `a4f2118` (fixtures e errata de vacuidade), `4d2d49d`
(red), `8c6c426` · `ca4fb8c` (W4 + rebuild), `b86bbac` · `ede533c` (W7 + rebuild),
`aecc6fc` · `536e437` · `a8cf0e8` · `091324a` · `760883b` (erratas E14–E17 e repin
inline), `c44441f` · `fdb3320` · `5597e0a` · `ab6f70b` · `8e843bd` (E18 e o ciclo
de correção), `47fee9b` (planning-state; HEAD desta demanda no momento deste
relatório).
