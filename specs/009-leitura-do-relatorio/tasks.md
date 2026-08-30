# Tarefas — 009-leitura-do-relatorio

> Fase 3 · dono: tech-lead · ids [TNNN] são permanentes; wave final é sempre validação.
> Derivadas de [plan.md](plan.md) (camadas, donos, ordem e restrições já resolvidos
> lá) e julgadas pelos critérios de [spec.md](spec.md). Nenhum conteúdo dos dois é
> repetido aqui (R12). Eu proponho; a execução das waves é do orquestrador (R5).

| Id | Wave | Dono (agente) | Tipo | [P] | Descrição | Gate associado |
|---|---|---|---|---|---|---|
| T001 | 0 | `build-engineer` | chore | | `npm ci --no-audit` na raiz. Habilita jsdom — sem isso **nenhuma suíte executa** (`tests_p52_layout.js:20`) e nenhum red é provável. `node_modules/` está no `.gitignore`: a árvore permanece limpa, pré-condição de `check_mutation.py:41-46`. Nenhum arquivo versionado muda; `npm ci` não reescreve `package-lock.json` | nenhum — habilita todos |
| T002 | 1 | `qa-engineer` | chore | | `fixtures_009_leitura.js` (**novo**): fixture **S3** (prática-alvo em capability sem gap, com contexto declarado) e fixture **B9** (uma capability declarada, outra UNSET, alvo em ambas). Montadas pelos owners canônicos (`p50ApplyPresence`, `p50ApplyTargets`), no padrão de `fixtures_p52.js`. **`fixtures_p52.js` não é alterado.** Provar por execução que cada fixture alcança o estado pretendido | pré-requisito de `D009-UNS2`, `D009-UNS3` |
| T003 | 2 | `qa-engineer` | feature | [P] | `tests_009_leitura.js` (**novo**) com os 15 gates **+** entrada `d009` em `.claude/verify/expected_suites.json` **no mesmo commit** (`check_suites.py:53-56` falha com `tests_*.js` fora do registro). As listas de ordem são **literais na suíte**, copiadas da âncora da spec — proibido derivá-las de `__P52.sections()`, de `P52_SECTIONS` ou de constante das suítes 5.2. Em `D009-LEG1`, seletor não suportado pelo `Element.matches` **propaga exceção como FAIL**, nunca é engolido como "não casou" | `D009-ORD1` `ORD2` `DOM1` `DOM2` `NXT1` `NXT2` `GLO1` `GLO2` `UNS1` `UNS2` `UNS3` `UNS4` `ABS1` `LEG1` `EVB1` |
| T004 | 2 | `qa-engineer` | refactor | [P] | `tests_p52_layout.js`: reancorar `P52_CANONICAL_ORDER` / `P52_RELEASED_ORDER` / `P52_BLOCKED_ORDER` (56-64) e trocar a asserção de `P52-TGT1` (236-240) por `iT > iE` **e** `iC === iT + 1`, preservando intacta a cláusula `evidence === iE + 1` do gate fechado e as asserções de `[data-p52="target-lead"]` e `TARGET.overrides`. Comentário cita **esta spec** e a data da ratificação. Nenhum gate nasce ou morre — `p52layout` continua 45 PASS · 0 FAIL | `P52-TGT1` `P52-LAY3` `P52-GATE1` `P52-SUFF1` `P52-NAV0` `P52-LAY5` |
| T005 | 2 | `qa-engineer` | refactor | [P] | `tests_p52_chromium.js`: reancorar `CANON` (:239) e `BLOCKED` (:298). `p52chromium` continua 55 PASS · 0 FAIL; a evidência segue 2ª no gate fechado, então a medida de viewport de `P52-GATE1v` não muda | `P52-LAY3` (chromium), `P52-GATE1v` |
| T006 | 2 | `qa-engineer` | refactor | [P] | `tests_p52_mutants.js`: reescrever **só** `desc` e `reason` de `P52-M3` (123-131) — `reason` perde a alternativa que morre com a asserção antiga e fica `/contexto \(\d+\) antes do alvo/`; `desc` passa a nomear a quebra de adjacência. **`find` e `repl` permanecem byte-idênticos** | `P52-M3` — mata `P52-TGT1` reancorado |
| T007 | 2 | `qa-engineer` | chore | | **Prova de red.** Executar as suítes, **nomear o FAIL de cada gate** (o não executado é declarado como não executado, com motivo), commitar o vermelho e registrar `red.status: proven`, `red.commit` e `red.gates` no planning-state. `check_tdd.py:29-35` confere que o commit existe no repositório. Mensagem: `test(009): red — D009-ORD1..EVB1 (15 gates) e oráculos 5.2 reancorados` | stage `tdd` |
| T008 | 3 | `ui-engineer` | feature | [P] | `ui_p52_workspace_v32.js` — **uma só tarefa para as duas mudanças** (mesmo arquivo, R5 §3): (a) ordem nova no literal `P52_SECTIONS` (550-559) **com o alinhamento de colunas preservado** — reformatá-lo faz `P52-M3` deixar de aplicar; (b) `capHelpLine(capId)` no bridge `__P52`, definida **depois** do literal `P52_CAP_HELP` — antes dele encolheria o prefixo de varredura de `P52-HOME1` (`tests_p52_layout.js:678`) e enfraqueceria o gate. Não tocar `p52OrderFor`, `p52Classify` nem `data-p52-order` | `D009-ORD1` `D009-ORD2` `D009-EVB1` · regressão `P52-TGT1` `P52-LAY3` |
| T009 | 3 | `ui-engineer` | feature | [P] | `ui_journey_v32.js` — **uma só tarefa** (mesmo arquivo): (a) marcação `.jn-dom[data-dom="i"]` em `narrativeHTML` (214-218), aplicada **depois** do `esc32` e apenas em ocorrência exata, sensível a maiúsculas e de palavra inteira; (b) o P3 (138-142) aponta para "Para avançar" e deixa de reenumerar. `buildExecutiveNarrative` continua devolvendo string pura (INV-7), `trace[2].sources` mantém `evolution.themes`, `.jn-note` mantém a classe `ux-micro`, nenhum hex de domínio entra em JS | `D009-DOM1` `D009-DOM2` `D009-NXT1` `D009-NXT2` |
| T010 | 3 | `ui-engineer` | feature | [P] | `ui_ux_v32.css` — regra `.jn-dom` com cor por `var(--dom-accent)` **e** `font-weight` (o canal não-cromático é obrigatório: no papel a cor é dispensável e o peso sozinho preserva o significado). O mapa `[data-dom] → --dom-accent` (68-72) é **lido**, não alterado. **Nenhuma outra regra entra neste arquivo nesta demanda** | `D009-DOM1` (ramo do canal não-cromático) |
| T011 | 3 | `ui-engineer` | fix | [P] | `ui_p52_workspace_v32.css` — estreitar **a linha 52** para `.p52-sec .ux-micro:not(.jn-note)`. `.jn-note` nunca esteve nomeada na régua: ela era alcançada por `.ux-micro`. **Proibido** resolver por `max-width: none` em override posterior — duas declarações contraditórias vivas cegam o oráculo. Permanece dentro do `@media screen` | `D009-LEG1` |
| T012 | 3 | `ui-engineer` | fix | [P] | `ui_target_v32.js` — `tgtEnablersHTML(qid)` (166) passa de 1 para 4 estados, e nasce o nó único `[data-ux-absence="target-enablers"]` no card de comparação, na tela (134) e no papel (267), com contagem e lista derivadas **no mesmo passe** da lista de práticas (B5). S1 intocado; capability com `landscapeEnabled: false` nunca entra no aviso. **Nenhum arquivo `.css` nesta tarefa** — ver "Restrição de CSS" | `D009-UNS1` `UNS2` `UNS3` `UNS4` `ABS1` |
| T013 | 4 | `ui-engineer` | feature | [P] | `ui_v32.js` — `.v32-caphelp` dentro da `.v32-decl-row` (217, tela) e do `.pr-card` de `#pr-landscape` (1112, papel), sempre sob guarda `typeof` (precedente vivo em 1160-1162). A lista de declaradas continua derivada de `V32.TECH_LANDSCAPE`, nunca do DOM; a **contagem** de `.v32-decl-row` não muda. **Nenhum arquivo `.css`.** Depende de T008, que publica o método | `D009-GLO1` `D009-GLO2` |
| T014 | 4 | `doc-writer` | doc | [P] | `USER_GUIDE.md` §8.1 (267-286) — a ordem nova, nas duas variantes. Preservar os temas que `P52-DOC1` exige por regex: ver "Temas sob risco". Não citar `ui_p52_workspace_v32.js/css` (vira documentação de implementação = FAIL) e nenhuma promessa de resultado | `P52-DOC1` (regressão) |
| T015 | 4 | `doc-writer` | doc | [P] | `fixtures_p52.js` — **só o comentário** de `P52-F1` (16-22), que enumera a ordem antiga em prosa e diz "todas as nove seções" (deriva pré-existente desde SUFF-REV-A, agravada aqui). Nenhuma mudança funcional na fixture; o comentário de `P52-F2` (34-38) continua verdadeiro e não é tocado | `p52layout` 45/0 inalterado |
| T016 | 5 | `build-engineer` | chore | | `python build_v32_html.py` — rebuild de `quickscan_secops_soccmm_v3_2_dev.html` (classe `generated`, **nunca editado à mão**). **Pré-condição do verde, não acabamento:** as suítes jsdom bootam o HTML gerado (`tests_p52_layout.js:25-26`), não os módulos-fonte | stage `build` |
| T017 | 6 | `qa-engineer` | chore | [P] | Executar `tests_009_leitura.js` e as suítes 5.2; **fixar a contagem verde de `d009`** em `expected_suites.json`. Conferir `p52layout` 45/0 — contagem diferente significa que a reancoragem virou reescrita: parar e reabrir a análise | stage `suites` |
| T018 | 6 | `qa-engineer` | chore | [P] | `tests_009_mutants.js` (**novo**, 18 mutantes: `D009-M1`, `D009-M2`, `D009-M4`…`D009-M19` — o `M3` da spec **não** é mutante `d009`, permanece `P52-M3` no harness `p52`) **+** harness `d009` em `mutation_map.json` (`requires: [node, python]`; alvos = os 6 módulos de produto + o próprio harness) **no mesmo commit**. Os `find` só podem ser escritos agora: ancoram no código que as waves 3-4 produziram | R3 §5 |
| T019 | 6 | `qa-engineer` | chore | | Executar a campanha `d009` (e `core`, que é node+python) com **árvore limpa** (`check_mutation.py:41-46`) e registrar os pares em `mutation-matrix.json` com `harness`, `gate` e `ultima_prova.resultado` — `check_tdd.py:47-52` exige os três. Depende de T017 e T018 já commitados | stage `mutation` · stage `tdd` |
| T020 | 7 | `build-engineer` | chore | | `gen_pins.py` **uma única vez**, com fonte, testes, fixtures, registros, docs e HTML gerado já commitados — `gen_pins.py` lê blobs de HEAD (R8), então repin antecipado não capturaria a wave 6. Motivo no commit. Conferir que `declared.m41_payload_sha256` continua `9794b267…`; se mudar, **PARAR** (Porta B, não autorizada) | stage `baseline` |
| T021 | 8 | `qa-engineer` | chore | [P] | Pipeline completo local (`.claude/verify/run.sh`): `env-doctor`, `baseline`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`, `state`, `tdd`, `m41`, `suites`, `suites-heavy`, `evidence-bridge` e `mutation` com os harnesses disponíveis. Depois, `spec-validate` | todos os stages locais |
| T022 | 8 | `build-engineer` | chore | [P] | Job `visual` no CI: `p52chromium` 55/0 **e** as campanhas `p51`/`p52`, disparadas por `ui_v32.js` (T013) e pelos outros cinco módulos. Não há Chromium nesta worktree e `known_issues.json` está com `issues: []` — é **agendamento, não dispensa**; o resultado volta para `mutation-matrix.json` | job `visual` · stage `mutation` (p51/p52) |
| T023 | 8 | `product-owner` | chore | | Aceite de intenção, conferindo os dois achados **devolvidos e não absorvidos** (buraco na numeração visível; distinguir S3 de S4 por texto próprio) e o achado novo da Fase 2 (a prosa de B4 na spec §5 × `ui_target_v32.js:96-101`) | aceite |

Tipos (R3): `feature`/`fix` exigem red provado; `refactor`/`doc`/`chore` não.
Um módulo por delegação — dois donos nunca no mesmo arquivo na mesma wave.
`[P]` = paralelizável dentro da wave (delegações na mesma mensagem).

## Tipagem — as escolhas que não são óbvias

- **T003 é `feature`** porque carrega o tipo da demanda e é a tarefa que **produz**
  o red; o red dela é o commit de T007. É o mesmo par da 003 (tarefa que escreve o
  gate + commit que prova o vermelho), não uma auto-referência.
- **T004/T005/T006 são `refactor`** porque nenhum gate nasce ou morre e nenhum
  comportamento de produto muda: são oráculos existentes **reancorados** por uma
  ratificação do proprietário já registrada. As contagens (45/0 e 55/0) são a prova
  mecânica de que não houve reescrita. Se alguma contagem mudar, a tipagem estava
  errada e a tarefa vira outra conversa.
- **T011 e T012 são `fix`**, não `feature`: a nota presa na régua e a frase única do
  `tgtEnablersHTML` são defeitos de leitura descritos como defeito na spec — o
  segundo é literalmente "o defeito de `ui_target_v32.js:166`".
- **T018 é `chore`, não `feature`.** Campanha de mutação é instrumento de
  verificação, não comportamento de produto: sua prova não é um red, é o **KILL**
  registrado em T019. Tipá-la `feature` exigiria um `red.commit` que não existe
  semanticamente para ela — seria burocracia, não auditoria.
- **Nenhum `tdd_waiver` é previsto.** Se alguém precisar de um, é sinal de tipagem
  errada e a conversa acontece sobre o dado (R3, válvula 2).

## Colisão de arquivo — as decisões, com o motivo

- **T008 é uma tarefa, não duas.** A ordem de `P52_SECTIONS` e o `capHelpLine`
  vivem no mesmo `ui_p52_workspace_v32.js`. Separá-las em duas tarefas `[P]`
  violaria R5 §3; separá-las em duas waves custaria uma wave por nada, já que as
  duas mudanças são pequenas, independentes entre si e conferidas pelos mesmos
  stages. **Uma delegação, um dono, um diff.**
- **T009 é uma tarefa, não duas**, pela mesma razão: `.jn-dom` e o ponteiro do P3
  são ambos em `ui_journey_v32.js`.
- **T008 (`.js`) e T011 (`.css`) são arquivos distintos com o mesmo prefixo.** São
  `[P]` legitimamente, mas é a confusão mais fácil de cometer: o prompt de cada
  delegação **nomeia a extensão** e proíbe explicitamente tocar o par.
- **T009 e T010 são `[P]` apesar de compartilharem o contrato `.jn-dom`** porque
  ambos codificam contra o contrato **declarado na spec**, não um contra o outro:
  o nome da classe e o atributo `data-dom` já estão fixados por escrito. Nenhum
  precisa ler o diff do outro.
- **T013 (`ui_v32.js`) está sozinho na wave 4** e nunca é `[P]` com outra tarefa no
  mesmo arquivo. Seus vizinhos `[P]` são docs, de outro agente, em outros arquivos.
  Ele é também o módulo que dispara mais campanhas (`core`, `p51`, `p52`), o que é
  mais uma razão para o diff dele ser isolado e auditável.
- **`fixtures_p52.js`** é tocado **só** por T015 (comentário), na wave 4. T002 cria
  arquivo novo e a spec proíbe alterar a fixture da outra fase — não há segundo
  dono em wave alguma.
- **`expected_suites.json`** aparece em T003 (wave 2, registro) e T017 (wave 6,
  contagem verde): **waves diferentes, nunca `[P]` entre si**. `mutation_map.json`
  aparece só em T018.

## Wave 2 — o red, explicitamente

Produzem o FAIL commitado: **T003** (os 15 gates `D009-*` falham contra o produto
atual) e **T004/T005** (os oráculos 5.2 reancorados passam a exigir a ordem nova,
que ainda não existe). **T006** não produz FAIL por si: reescreve texto de registro
de mutante, e sua prova é a campanha da wave 6.

**T007** é o ato que o regime cobra: executa, nomeia cada FAIL, commita o vermelho
com a mensagem `test(009): red — D009-ORD1..EVB1 (15 gates) e oráculos 5.2
reancorados` e grava `red.status: proven` + `red.commit` + `red.gates` no
planning-state. É isso que o `guard-tdd` e o stage `tdd` conferem — o stage lê o
planning-state e verifica por `git cat-file` que o commit existe.

Consequência declarada, para ninguém "consertar": a partir de T003 o stage `suites`
fica **vermelho por definição** (a suíte nova está registrada e ainda falha) e o
stage `baseline` fica vermelho até T020. É **uma janela só**, declarada, e o head
do PR é verde — R8 exige mesmo PR, não mesmo commit.

## Registros no mesmo PR — tarefa e wave de cada um

| Registro | Tarefa | Wave | Por que ali |
|---|---|---|---|
| `expected_suites.json` — entrada `d009` | T003 | 2 | mesmo commit da criação de `tests_009_leitura.js`: `check_suites.py` falha com `tests_*.js` fora do registro |
| `expected_suites.json` — contagem verde | T017 | 6 | a contagem só existe depois do verde |
| `mutation_map.json` — harness `d009` | T018 | 6 | mesmo commit da criação de `tests_009_mutants.js`, pelo mesmo motivo de cobertura |
| `mutation-matrix.json` — pares `D009-M*` | T019 | 6 | o par exige `ultima_prova.resultado`, que só existe após a campanha |
| `pins.json` | T020 | 7 | repin único, após tudo commitado |
| `bridges.json` | — | — | **não muda**: `__P52` já registrado ganha método, nenhum nome `window.__*` novo |

## Temas sob risco em T014 (`P52-DOC1`)

Dos temas que o gate exige por regex, três correm risco real, e só um está dentro
do §8.1:

- **"navegação da tela de resultados"** — a regex casa **apenas** nas linhas 267 e
  269, as duas dentro do bloco a reescrever. Se o título deixar de dizer "navegar a
  tela de resultados", o gate cai.
- **"suficiência de evidência"** (linha 306) e **"Base de evidência"** (linha 312) —
  **ocorrência única no arquivo inteiro**, e ambas no raio adjacente que a ordem
  nova obriga a revisar (a base de evidência muda de seção).
- "cenário-alvo" tem 10 ocorrências: não corre risco.

## Restrição de CSS — e onde ela vira escalada

O plano aprovado autoriza **dois** toques em CSS: a regra `.jn-dom` (T010) e o
estreitamento da régua (T011). Nada mais.

`.v32-caphelp` (T013) e `[data-ux-absence]` (T012) nascem **sem CSS próprio** e
reusam classes já estilizadas (`ux-mut`, `ux-tgt-en` e equivalentes). Nenhum gate
`D009-*` mede geometria — todos são jsdom.

Achado que sustenta a restrição: `.v32-decl-row` **é** estilizada, e em
`ui_v32.css:8` (`display:flex; flex-wrap:wrap; align-items:baseline`) — arquivo que
**não** está na lista de pinados da spec. Logo a frase de glossário entrará como
item de flex na mesma linha, quebrando para baixo por `flex-wrap`. Isso é aceitável
para todos os gates desta demanda, mas é uma decisão visual que ninguém ratificou.

**Se o rito visual da Fase 6 julgar a colocação inadequada, isso é ampliação — não
edição de passagem.** O caminho é `DEPENDÊNCIAS` de volta ao tech-lead e, se for o
caso, ratificação do proprietário; nenhum agente abre `ui_v32.css` por conta
própria. Tocá-lo hoje adicionaria um 7º arquivo de produto ao PR sem spec.

## O que viaja no prompt de cada delegação (R3 §3)

Toda tarefa de implementação (T008-T013) recebe, pronto e sem reescrever:

1. o **id do gate** que a julga (coluna "Gate associado") — quem implementa não
   escreve o próprio critério de aceite;
2. `specs/009-leitura-do-relatorio/spec.md` → §"Critérios de aceite → gates" e
   §"Comportamento especificado", por caminho;
3. `specs/009-leitura-do-relatorio/plan.md` → §"Restrições de implementação que só
   o source revela" (as quatro armadilhas) e a linha da tabela de módulos com **o
   que explicitamente não muda**;
4. o commit do red (T007), para que o implementador veja o vermelho que precisa
   virar verde.

---

ARQUIVOS_TOCADOS: specs/009-leitura-do-relatorio/tasks.md (criado — único artefato desta fase)
RESUMO: 23 tarefas [T001-T023] derivadas do plan.md aprovado, nas 9 waves já ratificadas, cada uma com wave, dono entre os 8 agentes, tipo auditável e `[P]`. Tipagem honesta e justificada: T008-T013 são `feature`/`fix` e exigem o red provado em T007; T004-T006 são `refactor` porque reancoram oráculos existentes sem que nenhum gate nasça ou morra (45/0 e 55/0 são a prova mecânica); T018 é `chore` porque campanha de mutação é instrumento de verificação e sua prova é o KILL de T019, não um red. Colisão de arquivo resolvida por decisão nomeada: T008 e T009 viram tarefa única (duas mudanças no mesmo arquivo), `expected_suites.json` aparece em waves diferentes (T003 registro, T017 contagem), e `ui_v32.js` fica sozinho na wave 4 — é o módulo que dispara mais campanhas. Wave 2 explicitada como o red, com a mensagem de commit que o stage `tdd` cobra. Registros no mesmo PR tabelados por tarefa e wave.
EVIDÊNCIA: nenhum gate executado — Fase 3 é desenho. Verificações só-leitura desta fase: `git log` (portão da Fase 2 em `feef28c`, repin em `870969b`, árvore limpa), planning-state em `phase: tasks` com `plan.status: approved`, `.claude/templates/tasks.md`. Uma verificação nova de source, feita para decidir a fronteira de uma tarefa: `grep -rn "v32-decl-row" --include=*.css` → **`ui_v32.css:8`** (`display:flex; flex-wrap:wrap; align-items:baseline`), arquivo **ausente** da lista de pinados da spec; e `grep -rn "v32-caphelp|ux-absence"` → zero ocorrências (nomes livres); `ui_ux_v32.css:147` confirma `.ux-tgt-en` já estilizada, o que sustenta reusar classe em vez de criar CSS. Demais fatos (linhas de `P52_SECTIONS`, `P52-HOME1:678`, `data-p52-order`, `#ux-target` sempre renderizado, temas de `P52-DOC1` por linha) foram verificados na Fase 2 e estão registrados no plan.md; o coordenador confirmou os três achados no source antes de subir.
DEPENDÊNCIAS: (1) **Portão da Fase 3 com o usuário** antes de qualquer delegação; a execução das waves é do orquestrador — eu proponho e não delego. (2) **Ponto de escalada declarado, não ampliado**: `.v32-decl-row` é `display:flex` em `ui_v32.css:8`, arquivo que a spec aprovada **não** lista. A frase de glossário de T013 entrará como item de flex, quebrando por `flex-wrap`. Nenhum gate `D009-*` mede geometria, então isso não bloqueia nada — mas **não criei tarefa para `ui_v32.css`**, porque seria um 7º arquivo de produto sem spec. Se o rito visual da Fase 6 recusar a colocação, volta para mim como ampliação, com ratificação do proprietário se for o caso. (3) **`qa-engineer`** detém T002-T007 e T017-T019; nenhuma tarefa de `ui-engineer` toca arquivo `tests_*` ou `fixtures_*`, e a reancoragem dos oráculos 5.2 é dele. (4) **`ui-engineer`** recebe T008-T013 com o gate e as quatro armadilhas do plano no prompt; **nenhuma delas abre arquivo `.css` além de T010 e T011**. (5) **`doc-writer`** recebe T014 com os três temas sob risco nomeados por linha, e T015 restrito ao comentário. (6) **`build-engineer`** detém T001, T016, T020, T022; T016 é bloqueante para o verde e T022 é o único caminho para as campanhas `p51`/`p52`, que exigem Chromium ausente nesta worktree. (7) **`product-owner`** em T023 recebe os três achados devolvidos. (8) **Nota de trilha**: esta execução rodou em **Opus**, não no modelo pinado (`fable`), por indisponibilidade de créditos — mesmo desvio das Fases 0, 1 e 2.
