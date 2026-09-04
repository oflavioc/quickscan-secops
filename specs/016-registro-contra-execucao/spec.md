# Spec — 016-registro-contra-execucao

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md) e as [medições da Fase 0](medicoes-fase0.md),
> não os repete.

## Objetivo

Fazer o **merge em `develop` cobrar as duas promessas** que hoje ninguém cobra —
o `planning-state` que promete fechar a Fase 6 antes do merge (**P16.a**) e o
`[DEFER]` que promete que o job `visual` executa a campanha (**P16.b**) — e
tornar **dado, não prosa**, a proteção de branch que é o credor de ambas.

Link: [refinement.md](refinement.md). As **nove decisões do portão da Fase 0**
(`.claude/project-memory/planning-state/016-registro-contra-execucao.json →
portao_fase0`, aprovadas pelo usuário no chat em 2026-09-04) são o contrato
desta spec e **não se reabrem aqui**. Em particular:

- **P1 — a rota da borda 8 é a proteção de branch**, não R-b1 (levar Chromium ao
  `verify`) nem R-b2 (recibo + reconcile). A medição do `build-engineer`
  derrubou R-b1 pelo custo (campanhas 42–55 min contra 28–35 s de instalação;
  `medicoes-fase0.md` §Medição 1) e revelou o credor real: **`develop` não tem
  check obrigatório nenhum** (§Medição 2). O `[DEFER]` **permanece**; quem o
  cobra é o merge esperar o job `visual`.
- **P2** — o usuário configura `verify` e `visual` como checks obrigatórios em
  `develop`, mais *require branches to be up to date*. Ato dele, fora do
  repositório. **(E1)** No portão da Fase 1 o próprio usuário estendeu P2 a
  **três** checks — `verify`, `visual` e **`fecho`** (ver §Errata, E1).

**O problema que esta spec existe para resolver, e que a Fase 0 não tinha**: a
rota escolhida põe a cobrança **fora do repositório**. Este repositório nasceu
do achado E2 (*a §29.4 em prosa não impediu edição de protegidos*) e a R6
responde *"boundary é dado, não prosa"*. Uma proteção que só existe no painel do
GitHub é a prosa que a R6 proíbe: pode ser desfeita em silêncio e o `EA-33`
volta sem que ninguém saiba. Por isso o gate central desta demanda é
**`D016-PROT1` — o que verifica a própria proteção de branch** — e todo o resto
(P16.a) é o que dá ao check obrigatório algo para cobrar.

**Nenhum byte de produto muda.** Engine, Camada 1, HTML gerado, módulos `ui_*`,
suítes congeladas: byte-intactos. INV-1 não é acionada. **P16 é propriedade de
processo, não de produto**: fica **fora** de `.claude/verify/invariants.json`
(decisão registrada no planning-state, `refinement.propriedade`) — aquele
arquivo é "invariantes de produto" e o `compliance-audit` afirma "10/10"
(`compliance-audit.sh:76`); inflar a lista confundiria a régua.

**Proveniência**: portão da Fase 0 aprovado pelo **usuário no chat**
(2026-09-04, por `AskUserQuestion`, duas respostas literais registradas no
planning-state). As decisões técnicas desta Fase 1 (T1–T10) são do `tech-lead`
sob a delegação vigente e vão ao portão da Fase 1 para aprovação literal.

---

## Decisões técnicas fixadas nesta Fase 1

O refinamento delegou à Fase 1 a mecânica. Cada decisão abaixo tem justificativa
curta; o que exige medição futura está marcado.

| id | Decisão | Justificativa |
|---|---|---|
| **T1** | **Oráculo primário de "branch mesclada" = mensagem do commit de merge em `--first-parent origin/develop`** (`Merge pull request #N from <owner>/<branch>`, casando `<branch>` com `planning-state.branch`). **Secundário = ancestralidade** (`git merge-base --is-ancestor <red.commit> origin/develop`), consultado quando o primário cala. O gate **imprime qual respondeu** (`oráculo: mensagem #N` · `oráculo: ancestralidade <sha12>`). | Medido pelo `build-engineer`: 37/39 merges seguem o formato e **100% das branches de demanda/Onda** (§Medição 3). O primário serve às **duas** direções com uma só enumeração (a direção git→registro precisa dela de qualquer forma), cobre demanda com `tdd_waiver` e sem `red.commit`, e não depende de SHA curto (três planning-states registram 7 hex). A ancestralidade fica como confirmação e como rede para merge com mensagem não-GitHub. |
| **T2** | **Piso (P9) = `921977c25e76fe0ed19dae74e17921d37c711ff0`** — merge do PR #39 em `develop` (2026-09-04T08:44-03), HEAD de `origin/develop` e merge-base desta branch no momento desta spec. Todo merge first-parent **posterior** a ele — o desta demanda inclusive — é julgado; todo anterior é contado como "anterior ao piso" e não julgado. Gravado em `.claude/verify/fecho.json → piso` como SHA de 40 hex. | P9 diz "SHA do merge desta demanda". O SHA literal do merge da 016 **só existe depois do merge**, e escrevê-lo exigiria commit posterior em `develop` — que R14 proíbe fora de PR — ou um segundo PR só para o pin. R10 §5 exige âncora **imutável, conhecida agora**. O merge-base é o último commit de `develop` anterior a esta demanda e produz **o mesmo julgamento** que P9 pretende: as seis mescladas com `phase != done` no commit do merge (009, 010, 011, 013, 014, 015) e as cinco branches de Onda sem planning-state (000, 001, 002, 004, 005) ficam **todas** aquém do piso (§Medição 3). É interpretação de P9, não reabertura; declarada para poder ser contestada no portão. |
| **T3** | **Julgador puro + sonda em toda execução, com contagem pinada.** A função que decide (`julgar(estados, merges, existe, data_do_commit, piso, exclusoes) → vereditos`) **não lê git, disco, rede nem relógio**; a leitura é separada. Toda execução do gate roda antes uma **bateria sintética** (fixtures em arquivo próprio, veredito esperado por caso em `fecho.json → sonda.casos`) e reprova se qualquer caso divergir **ou se o total de casos ≠ pinado**. Mesmo desenho para `D016-PROT1` (respostas de API enlatadas). | Padrão da casa (IC-9.4/IC-10 da 013; `D014-DISC1` da 014): é o que torna o red **provável localmente**, dá aos mutantes um carrasco executável, e impede que o julgador fique mudo em silêncio (a contagem pinada é o censo da E6 da 014 aplicado à sonda). A sonda prova o **mecanismo**; a árvore real prova o **estado** — as duas rodam no mesmo stage, e a distinção fica escrita para ninguém citar uma como a outra. |
| **T4** | **Prazo do `fecho_pendente` comparado à data do commit julgado** (`git log -1 --format=%cI HEAD`, dia ISO), **não ao relógio**. Vencido ⇔ `prazo < data_do_commit`. | R7 §6: relógio não entra em artefato verificado. Comparar ao relógio produziria um vermelho que aparece numa terça sem diff nenhum e some ao re-executar commit antigo — veredito não reprodutível. Comparar ao commit torna o veredito **função pura do repositório**: o próximo commit posterior ao prazo paga a dívida, e re-executar qualquer commit dá sempre o mesmo resultado. Alternativa por evento (como `evento_de_remocao` da 014) foi considerada: o evento natural (Fase 6 completa) é a própria resolução, não um prazo — não impede a exceção permanente, que é o que P3 quer impedir. |
| **T5** | **A válvula só vale depois do merge.** `fecho_pendente` é aceito (impresso, sem reprovar) **somente** em demanda **mesclada** com `phase != done`. Em demanda `done` → FAIL (obsoleta). Em demanda **não mesclada** → FAIL ("válvula antes do vencimento"). **O check pré-merge não a honra**: pré-merge, só `done` passa. | É a letra do glossário (P6: *"exceção nominal gravada no planning-state de uma demanda **mesclada** sem fecho"*; `_Evitar_: done provisório, exceção de merge`). Se o pré-merge honrasse a válvula, ela viraria licença para mesclar sem fecho — o "done provisório" que a 013 combateu. Sem circularidade: a válvula é escrita **depois** da violação, por PR próprio (`chore/*`, fora da população), e a partir daí a direção pós-merge a lista em vez de reprovar. |
| **T6** | **`D016-PROT1` lê dois endpoints e classifica em três vereditos.** Fontes: `GET /repos/{o}/{r}/rules/branches/{ref}` (rulesets ativos **agregados** para o ref) e `GET /repos/{o}/{r}/branches/{ref}` (`protection` da proteção clássica). Veredito **`PROTEGIDA`** sse os contextos `verify`, `visual` **e** `fecho` (E1) são obrigatórios por pelo menos um dos mecanismos **e** *up to date* está ligado (`strict_required_status_checks_policy: true` no ruleset); **`DESPROTEGIDA`** (FAIL em qualquer ambiente, nomeando o que falta) quando determinável e não cumprido; **`NÃO DETERMINÁVEL (<causa>)`** quando rede/permissão/identificação do repositório impedem a leitura. Token: `GITHUB_TOKEN` (CI) → `gh auth token` (rito local) → sem token (repositório público) — **a fonte do token é impressa, o token nunca**. Repositório: `GITHUB_REPOSITORY` ou `git remote get-url origin`. Expectativa em **dado**: `.claude/verify/branch_protection.json`. | Medido pelo `tech-lead` em 2026-09-04 (`gh api`, token de usuário): `/rules/branches/develop` devolve **exatamente** `[deletion, non_fast_forward]` do ruleset 21381133; `/branches/develop` devolve `protected: true` com `protection.enabled: false` e `enforcement_level: "off"` — a armadilha do `protected: true` que só o par de campos desfaz (mutante `D016-M15`). O endpoint agregado é o que o `GITHUB_TOKEN` alcança com `metadata: read` (permissão que todo token de Actions tem) — **a confirmar por execução no primeiro run do PR** (§Não mensurável 1); o clássico é legível sem autenticação em repositório público, como a §Medição 2 já mostrou. Os nomes dos contextos são os **nomes dos jobs** (`verify`, `visual`), conferidos no run 33869337902; `fecho` é o id do job novo, sem `name:`, logo o contexto é o id (E1). |
| **T7** | **Política de não-determinabilidade de `D016-PROT1`: local → `[WARN]` nomeado com a causa e a instrução; CI (`GITHUB_ACTIONS`) → `[FAIL]`.** Exceção única e permanente, declarada: sob proteção **clássica**, `strict` só é legível com `administration: read` (que o token de Actions não tem) — o gate imprime `up-to-date: não determinável (classic)` como `[WARN]` em qualquer ambiente e a linha de PASS diz o que mediu e o que não. | R10 §2: SKIP silencioso é FAIL; WARN **nomeado** não é SKIP. Precedente literal: política EB-5 do `check_evidence_bridge.py:32-36` (rede inalcançável → WARN local / FAIL no CI; 404 e adulteração → FAIL em todo lugar). O CI é onde a cobrança tem de ser determinável — se o token não lê, o remédio é `permissions:` no workflow ou um secret decidido pelo proprietário, nunca um WARN que vira permissão. A exceção do `strict` clássico é limitação do **mecanismo** do GitHub, não do ambiente; declará-la é mais honesto do que reprovar para sempre (E5) ou fingir que mediu. O proprietário **já usa ruleset** (`MyRuleSet`); a recomendação é configurar P2 **no ruleset**, onde tudo é legível. |
| **T8** | **Onde cada coisa vive**: (a) direção pós-merge (C1–C4) → **stage novo `fecho`** em `pipeline.yaml`, `parallel: true`, `heavy: false`, `mutates: false` — roda no `run.sh`, no hook Stop (`--light`) e nos dois jobs do CI; (b) check pré-merge (C5) → **job próprio `fecho`** em `verify.yml` (E1 — a spec propunha passo no job `verify`; o usuário decidiu job próprio no portão da Fase 1), sem `needs:` e sem `if:` (o script nomeia o contexto e sai 0 fora de PR — passa, não pula); (c) `D016-PROT1` (C6) → **seção `branch-protection` do `compliance-audit.sh`**, não stage — roda no CI e no rito manual, **não** no hook Stop a cada turno. | (a) R10 §9: checagem nova entra no pipeline; um stage próprio mantém `check_state.py`/`check_tdd.py` byte-idênticos (um módulo por delegação) e dá ao veredito nome próprio na saída do `run.sh`. (b) O refinamento fixa que o pré-merge **não pode viver em `run.sh`** (o QA precisa do pipeline verde para escrever o `spec-validate`, que precede o `done`). **(E1)** Job próprio, pela razão que decidiu: um `verify` vermelho durante toda a demanda **ensina que vermelho é normal**, e vermelho normal deixa de ser lido — o mecanismo exato do `E5`; um check `fecho` vermelho diz algo verdadeiro e útil (*a demanda ainda não fechou*) e o `verify` continua significando *o código está são* — conflatar os dois destrói os dois sinais. P2 passa a três checks (o usuário tomou a decisão que a redação original dizia não tomada). O custo aceito: entre a abertura do PR e o commit do `done`, o check **`fecho`** do PR fica vermelho **por desenho e com nome** (borda 6); o `verify` fica verde. (c) Chamada de rede a cada turno seria custo sem valor; o `compliance-audit` já é o lugar que "audita a própria configuração" (cabeçalho do script), e é executado em todo run do CI (`verify.yml:43-44`). |
| **T9** | **Nada muda em `check_state.py`, `check_tdd.py`, `check_mutation.py`, `verify.yml:42` (`MUTATION_DEFER_MISSING`) nem na spec 013.** A cláusula C4 da 013 (*"`MUTATION_DEFER_MISSING` permanece com a semântica atual, intocada"*) **continua literalmente verdadeira**. A dívida "Borda 8" de `mutation-matrix.json → dividas_declaradas` ganha **desfecho anexado** (R2 §5: o registro permanece, com a razão), nunca é apagada. | Sob a rota P1 a promessa continua existindo; o que muda é que o credor (job `visual` obrigatório no merge) passa a existir e a ser **auditado** por `D016-PROT1`. Não há errata na 013: T7/C4/borda 8 eram **restrições de escopo** dela, e a própria spec devolveu o fechamento como "demanda própria" (Risco 4) — esta é essa demanda. Menos arquivos pinados tocados, menos repin, nenhuma campanha existente disparada (nenhum arquivo editado é `target` de harness algum). |
| **T10** | **Vocabulário fechado de vereditos, impresso por demanda/merge**: `CONFORME` · `MESCLADA SEM FECHO` · `FECHO PENDENTE DECLARADO` · `EM VOO` · `ANTERIOR AO PISO` · `FORA DA POPULAÇÃO` · `NÃO DETERMINÁVEL`; pré-merge: `LIBERADO` · `FECHO PENDENTE` · `NÃO JULGADO (<motivo>)`; proteção: `PROTEGIDA` · `DESPROTEGIDA` · `NÃO DETERMINÁVEL (<causa>)`. Todo `NÃO DETERMINÁVEL` e todo `NÃO JULGADO` carregam causa/motivo não vazio. | Conjunto fechado + escape nomeado é o padrão de T4 da 013 (três estados da campanha): impede que uma causa nova volte como rótulo ambíguo, e dá à sonda um enum para comparar em vez de regex sobre prosa PT-BR (R10 §6). |

---

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (R3 §1). Namespace **`D016-*`**.
Scripts: `.claude/verify/check_fecho.py` (C1–C5, C7) e
`.claude/verify/check_branch_protection.py` (C6, C7). Harness de mutação:
`tests_016_mutants.js` (**`d016`**, `requires: [node, python]` — fecha
**localmente**, sem Chromium). Registro de dados: `.claude/verify/fecho.json`
(dono `qa-engineer`) e `.claude/verify/branch_protection.json` (dono
`build-engineer`).

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | **Direção registro→git (R-a1).** Toda demanda com `phase != done` cuja branch está mesclada em `origin/develop` **depois do piso** e sem `fecho_pendente` válido reprova, nomeando demanda, fase, **oráculo que respondeu** (T1) e o SHA de `origin/develop` julgado | `D016-FEC1` · `check_fecho.py` · stage `fecho` · (a) mesclada por **mensagem** `#N` + `phase != done` + sem válvula ⇒ `MESCLADA SEM FECHO`, FAIL; (b) mesclada só por **ancestralidade** (merge com mensagem não-GitHub) ⇒ idem, com `oráculo: ancestralidade`; (c) não mesclada por nenhum ⇒ `EM VOO`, não julgada, contada; (d) mesclada **antes** do piso ⇒ `ANTERIOR AO PISO`, contada; (e) `origin/develop` ausente ou `git` ausente ⇒ FAIL `NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin develop)`, nunca SKIP; (f) planning-state sem `branch` ⇒ FAIL de forma ("registro sem chave de junção") | `D016-M1` — consultar **só** a ancestralidade → o caso sintético "`tdd_waiver` sem `red.commit`, mesclada por `#N`" vira `EM VOO` · `D016-M2` — aplicar o piso invertido (julgar só o que é anterior) → os casos "anterior ao piso" e "posterior ao piso" trocam de veredito na sonda |
| **C2** | **Direção git→registro com piso (R-a2, P9).** Todo merge first-parent em `origin/develop` **posterior ao piso** cuja mensagem nomeia `feature/NNN-*` tem planning-state `NNN` existente e em `done` (ou `fecho_pendente` válido). Branches fora do padrão (`chore/*`, `fix/*`, `hotfix/*`, `feat/*` históricas) e integrações de `main` são `FORA DA POPULAÇÃO`; o critério de população é **impresso uma vez** por execução; "N merges anteriores ao piso" é impresso | `D016-FEC2` · `check_fecho.py` · stage `fecho` · (a) `feature/NNN-*` após o piso **sem** planning-state `NNN` ⇒ FAIL ("demanda fora da máquina", R4 §Violação); (b) com planning-state `!= done` ⇒ cai em C1 (mesmo veredito, não duplicado); (c) merge após o piso **sem** o formato `Merge pull request #N from …` e que **não** seja integração de `main` (`Merge remote-tracking branch 'origin/main' into develop` / `Merge branch 'main' into develop` / mensagem iniciada por `merge: integra`) ⇒ FAIL nomeado ("merge em `develop` fora de PR após o piso", R14); (d) piso ausente do `fecho.json` ou não é SHA de 40 hex existente no repositório (`git cat-file -e`) ⇒ FAIL | `D016-M3` — tratar `feature/*` sem planning-state como `FORA DA POPULAÇÃO` → o caso sintético "feature/017 sem estado" passa · `D016-M4` — engolir merge sem formato de PR após o piso → o caso "merge manual após o piso" passa |
| **C3** | **`done` ⇒ artefatos em disco (R-a4, P4), com exclusão nominal R13 que é carga.** Toda demanda `done` tem `spec_dir/relatorio-final.md` **e** `spec_dir/spec-validate.md`; **003** (ambos), **009** e **010** (`spec-validate.md`) ficam excluídas por `fecho.json → excluidas_por_r13`, cada uma com `artefatos_ausentes` nomeados e `fonte` citada, **impressas** a cada execução, sem prazo (P4) | `D016-FEC3` · `check_fecho.py` · stage `fecho` · (a) `done` sem um dos dois artefatos e sem exclusão ⇒ FAIL nomeando o artefato; (b) exclusão que nomeia artefato **que existe** ⇒ FAIL ("exclusão obsoleta — remova a entrada"; direção do IC-9.3/KI-4); (c) exclusão sem `fonte` ou com `artefatos_ausentes` vazio/curinga ⇒ FAIL (não exclui); (d) **prova de carga registrada** em `fecho.json → _meta.prova_de_carga`: com as três exclusões retiradas, a varredura acusa **003 (2 artefatos), 009 (1), 010 (1)** — medida por execução na Fase 4, como a 014 fez com `achado-aberto` | `D016-M5` — conferir só `relatorio-final.md` → o caso "done com relatório e sem spec-validate" passa · `D016-M6` — exclusão obsoleta não reprova → o caso "excluída cujo artefato existe" passa |
| **C4** | **Válvula `fecho_pendente {motivo, dono, prazo}` (R-a5, P3).** Válida sse os três campos são não vazios, `prazo` é dia ISO `AAAA-MM-DD` e `prazo ≥ data_do_commit` (T4), **e** a demanda está mesclada com `phase != done` (T5). Válida ⇒ `FECHO PENDENTE DECLARADO`, impressa com dono e prazo, não reprova; listada pelo `compliance-audit` (seção `waivers`) ao lado dos `tdd_waiver` | `D016-FEC4` · `check_fecho.py` · stage `fecho` · (a) campo ausente/vazio ⇒ FAIL; (b) `prazo < data_do_commit` ⇒ FAIL ("vencida"); (c) em demanda `done` ⇒ FAIL ("obsoleta"); (d) em demanda **não mesclada** ⇒ FAIL ("válvula antes do vencimento"); (e) `prazo` fora do formato ⇒ FAIL (não é data, não é válvula) | `D016-M7` — aceitar sem `prazo` (ou sem `dono`) → o caso "válvula sem prazo" passa · `D016-M8` — não comparar `prazo` com a data do commit → o caso "válvula vencida" passa |
| **C5** | **Check pré-merge (R-a3).** Em contexto de PR para `develop` cuja `GITHUB_HEAD_REF` casa `feature/NNN-*`: planning-state `NNN` existe, está em `done`, os dois artefatos de C3 existem (ou a demanda está em `excluidas_por_r13`) e **não** há `fecho_pendente` (T5). Fora desse contexto: `NÃO JULGADO (<motivo>)`, exit 0, motivo impresso | `D016-PR1` · `check_fecho.py --pr` (parâmetros `--head`/`--base` só na sonda; ao vivo lê `GITHUB_HEAD_REF`/`GITHUB_BASE_REF`) · job próprio **`fecho`** em `verify.yml` (T8 b, E1) · (a) `done` + artefatos ⇒ `LIBERADO`; (b) `phase != done` ⇒ FAIL `FECHO PENDENTE da demanda NNN (fase X) — merge bloqueado até done`; (c) planning-state ausente ⇒ FAIL ("demanda fora da máquina"); (d) `done` **com** `fecho_pendente` ⇒ FAIL; (e) head fora do padrão ⇒ `NÃO JULGADO (fora da população)`; (f) base ≠ `develop` ⇒ `NÃO JULGADO (release/main, R14)`; (g) sem base (push/dispatch) ⇒ `NÃO JULGADO (evento sem base)` | `D016-M9` — aceitar `validate` como fecho → o caso "PR em validate" libera · `D016-M10` — honrar a válvula pré-merge → o caso "done com fecho_pendente" libera · `D016-M11` — planning-state ausente libera |
| **C6** | **A proteção de branch é dado, não prosa (P16.b).** `develop` exige, por ruleset ou proteção clássica ativa, os checks **`verify`, `visual` e `fecho`** (E1) e *up to date*; a expectativa vive em `branch_protection.json`; a configuração ao vivo é lida da API a cada auditoria e a divergência reprova | `D016-PROT1` · `check_branch_protection.py` · seção **`branch-protection`** do `compliance-audit.sh` · (a) determinável e conforme ⇒ `PROTEGIDA`, PASS, imprimindo mecanismo (`ruleset <id>` / `classic`), contextos e `strict`; (b) determinável e faltando contexto ou `strict` ⇒ `DESPROTEGIDA`, FAIL em **qualquer** ambiente, nomeando o que falta; (c) `protected: true` com `protection.enabled: false` ou `enforcement_level: "off"` e ruleset sem `required_status_checks` ⇒ `DESPROTEGIDA` (é o estado **de hoje**, medido); (d) `NÃO DETERMINÁVEL (rede | permissão <status> | repositório não identificado)` ⇒ local `[WARN]` nomeado com instrução, CI `[FAIL]` (T7); (e) `strict` sob classic ⇒ `[WARN]` permanente declarado (T7); (f) as demais regras encontradas (`deletion`, `non_fast_forward`, `pull_request.allowed_merge_methods`, `required_linear_history`) são **impressas**, não julgadas | `D016-M12` — tratar `NÃO DETERMINÁVEL` como `PROTEGIDA` → a fixture `http_403` passa · `D016-M13` — ignorar `strict` → a fixture `strict_false` passa · `D016-M14` — um contexto basta → a fixture `sem_visual` passa · (E1) mutante que aceite **dois** dos três contextos → a fixture `sem_fecho` passa (id alocado pelo `qa-engineer` na Fase 4, nunca reutilizando `M1`–`M16`) · `D016-M15` — `protected: true` basta → a fixture `hoje` (a resposta real de 2026-09-04) passa |
| **C7** | **O julgador não pode ficar mudo.** Toda execução de `check_fecho.py` e de `check_branch_protection.py` roda a sonda sintética antes da árvore real; o total de casos executados é comparado ao **pinado** (`fecho.json → sonda.total`, `branch_protection.json → sonda.total`) e cada veredito ao esperado; divergência ou total diferente ⇒ FAIL nomeando o caso | `D016-FEC1`…`D016-PROT1` (alínea comum, sem gate próprio — é a pré-condição de não-vacuidade dos seis) · `--sonda` emite **JSON em stdout** `{casos:[{id, esperado, obtido, ok}], total, falhas}`; texto humano em stderr | `D016-M16` — desligar a sonda (laço vazio) → `total: 0 ≠ pinado`, acusado pelo stage **e** pelo harness, que pina o censo de casos |
| **C8** | **Frase da skill e da R4 (P7).** `done` deixa de exigir "CI verde": passa a exigir **Fase 6 completa (1 e 2 da skill, com `spec-validate.md` e `relatorio-final.md` em disco) + PR aberto**; "CI verde" vira condição do **merge**, cobrada pela proteção de branch; `sdd.md` ganha a linha "o merge em `develop` espera o `done`" | **Sem gate executável** — critério de documento, conferido por leitura no `spec-validate` (`.claude/skills/new-demand/SKILL.md:66`; `.claude/rules/sdd.md`, tabela Fase 6 e §Gates de fase). **O que o torna verdade por máquina são C5 e C6** — a frase descreve o que os gates cobram, não o contrário | — (prosa) |
| **C9** | **Glossário (P6).** Os três termos de `refinement.md` §Vocabulário — *Fecho de demanda*, *Demanda mesclada sem fecho*, *Fecho pendente declarado* — entram em `CONTEXT.md` §Estrutura (processo) no mesmo PR; *promessa de execução* e *deferimento vencido* **não** entram | **Sem gate** — leitura no `spec-validate`. Ajuste de redação permitido ao `product-owner`: "vencida" passa a significar "prazo anterior à data do commit julgado" (T4) | — |
| **C10** | **Registros com desfecho, nunca apagados.** (a) `mutation-matrix.json → dividas_declaradas` "Borda 8" recebe desfecho anexado (credor = proteção de branch auditada por `D016-PROT1`; a promessa continua, a cobrança existe); (b) `EA-33` → `resolvido` no fecho da Fase 6, pela gramática da 012; (c) `EA-14` **permanece `aberto`** com nota (§O que este gate NÃO mede, item 9); (d) `design-decisions.md`: linha KI-3 atualizada ("em calibração" → calibrado na Onda 4, check obrigatório desde a 016) e **nova linha confirmada** "cobrança no merge vive na proteção de branch, auditada" com a fonte (portão da Fase 0 da 016) | **Sem gate novo** — a forma de (b) já é vigiada pela seção `backlog` do `compliance-audit` (spec 012, T1–T9); (a)/(c)/(d) por leitura | — |

### Guarda de tautologia, alínea por alínea

Exigência do portão da 014, mantida: para cada alínea, **existe estado alcançável
em que ela falha?** Onde a resposta vem da sonda e não da árvore, está escrito —
a árvore de hoje é **conforme** por construção (os dez planning-states estão em
`done`; é a razão de "por que agora" do refinamento), logo o que dá dentes aos
gates hoje são **as exclusões que carregam peso**, a **sonda** e o **vermelho
real de `D016-PROT1`**.

| alínea | estado alcançável de falha | como sei |
|---|---|---|
| C1 (a) | demanda mesclada por PR com fase parada | **é o `EA-33`**: 6 de 10 merges de demanda entraram assim (§Medição 3). Hoje não há instância viva; a sonda carrega o caso, e a **prova de carga** da Fase 4 põe uma cópia de `015` em `validate` numa worktree efêmera **com o piso recuado para `6dad53d`** (merge da Onda 4, §Medição 3) e mede a acusação (`oráculo: mensagem #34`) — **(E2)** sem recuar o piso a cópia responde `ANTERIOR AO PISO` (o merge da 015, `222edd5`, é anterior a `921977c`); com o piso vigente e 0 merges após ele, C1(a) é **verde por vácuo na árvore**, como C4 |
| C1 (b) | merge verdadeiro com mensagem manual | dois existem antes do piso (`3542f9f`, `9fdb2b9`), ambos integração de `main` — o caso sintético usa a mesma forma com branch de demanda |
| C1 (c)/(d) | contagem "em voo"/"anterior ao piso" errada | a sonda pina o veredito **por caso**, não só o FAIL: um julgador que reprovasse "anterior ao piso" seria acusado tanto quanto um que perdoasse "posterior" (`D016-M2`) |
| C1 (e) | `origin/develop` ausente | reprodutível: `git update-ref -d refs/remotes/origin/develop` numa cópia efêmera; **não** é caso da sonda (é I/O), é caso da bateria adversarial da Fase 4 |
| C1 (f) | planning-state sem `branch` | hoje 11/11 têm (verificado por leitura nesta fase); o schema passa a exigir; caso sintético |
| C2 (a) | `feature/017-*` mesclada sem planning-state | é a única cláusula que apanha demanda feita **fora** da máquina; **dentes do piso, medidos por leitura**: sem o piso, a árvore real acusaria **6 merges / 5 branches** (`feature/000` #9, `001` #10 e #11, `002` #12, `004` #14, `005` #15 — Ondas sem planning-state). A Fase 4 mede por execução e registra em `fecho.json → _meta.prova_de_carga.piso` |
| C2 (c) | merge em `develop` fora de PR após o piso | violação de R14 que nenhum gate vê hoje; caso sintético; a árvore real tem zero após o piso |
| C3 (a) | `done` sem artefato | **hoje falha em 3 demandas / 4 artefatos** sem a exclusão — é a prova de carga de C3(d), no mesmo molde da `_trilha` do `d014` ("retirada a exceção, a varredura volta a acusar 1 morta") |
| C3 (b) | alguém escreve `spec-validate.md` retroativo da 009 (P4 deixa opcional) e esquece a entrada | é o padrão da KI-4 na 014: exceção cujo objeto sumiu vira permissão a fantasma |
| C4 (a)–(e) | válvula malformada, vencida, obsoleta, prematura | **nenhuma válvula existe hoje** — C4 nasce verde **por vácuo na árvore**, e a não-vacuidade vem **só da sonda** (F6–F10 de §Contratos). Declarado, não disfarçado |
| C5 (b) | PR desta própria demanda antes do `done` | **é o estado do PR da 016 até o commit do `done`** (borda 6) — o red ao vivo do pré-merge é o próprio PR |
| C5 (d) | `done` com válvula | sintético; é T5 aplicada ao pré-merge |
| C6 (b)/(c) | `develop` desprotegida | **é o estado de hoje**, medido duas vezes (`build-engineer`, §Medição 2; `tech-lead`, T6) — `D016-PROT1` nasce **vermelho ao vivo** e só fecha pelo ato P2 do proprietário. Ver §Nascimento sem vermelho crônico |
| C6 (d) | sem rede / 403 | reprodutível: `GITHUB_TOKEN=invalido` e rede cortada; fixtures `http_403` e `sem_rede` na sonda |
| C7 | sonda desligada | `D016-M16`; total pinado |

---

## Comportamento especificado

### Superfície 1 — stage `fecho` (`check_fecho.py`, direção pós-merge)

**Entrada**: os planning-states de `.claude/project-memory/planning-state/*.json`;
`git log --first-parent --format=%H%x00%P%x00%cI%x00%s origin/develop` — a
cadeia first-parent **inteira**, sem `--merges`; o piso é localizado nela (pode
ser commit não-merge) e **sujeito é só quem tem ≥ 2 pais** (**E3**);
`git merge-base --is-ancestor <red.commit> origin/develop` para cada estado
`!= done` que o oráculo de mensagem não resolveu e que tem `red.commit`;
`fecho.json` (piso, exclusões, sonda); existência de `spec_dir/relatorio-final.md`
e `spec_dir/spec-validate.md`; `git log -1 --format=%cI HEAD` (T4). **Nunca
usa `pr_url` nem rede** (o `pr_url` da 003 aponta para outro repositório).

**Saída** (stdout, uma linha por sujeito, vocabulário de T10), na ordem:

```
[SONDA] fecho: 26 caso(s) · 0 divergência(s) (total pinado: 26)
[INFO]  população: feature/NNN-* ∩ planning-state · piso 921977c2 (merge do PR #39, 2026-09-04) · origin/develop julgado: <sha12>
[INFO]  merges first-parent após o piso: N · anteriores ao piso: M (não julgados)
[OK]    003-marcador-duplicado: CONFORME · oráculo: mensagem #13 · EXCLUÍDA R13 (relatorio-final.md, spec-validate.md) — fonte: <…>
[OK]    009-leitura-do-relatorio: CONFORME · oráculo: mensagem #24 · EXCLUÍDA R13 (spec-validate.md) — fonte: <…>
[FAIL]  0NN-<slug>: MESCLADA SEM FECHO (fase validate) · oráculo: mensagem #NN · sem fecho_pendente
[VÁLV]  0NN-<slug>: FECHO PENDENTE DECLARADO · dono <…> · prazo AAAA-MM-DD · motivo: <…>
[OK]    016-registro-contra-execucao: EM VOO (fase specify) — não julgada
----
fecho: D demanda(s) · V válvula(s) · F problema(s)
```

Exit `1` sse `F > 0`. Um FAIL de forma (`branch` ausente, piso inválido,
`origin/develop` ausente, exclusão malformada) conta como problema **e** aborta
apenas o sujeito que o produziu — os demais são julgados (falha de um não cala
os outros). O stage **não escreve nada** (R7 §3).

### Superfície 2 — job `fecho`, o check pré-merge (`check_fecho.py --pr`) — E1

Job **próprio** em `verify.yml` (E1): sem `needs:` (um `verify` vermelho não o
pula), sem `if:` (roda em todo evento do workflow e responde `NÃO JULGADO` fora
de PR — passa, não pula), sem `npm ci`; **checkout raso basta** — o julgador
pré-merge lê só a árvore e o ambiente, nunca histórico nem `origin/develop`:

```yaml
  fecho:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Fecho da demanda antes do merge (D016-PR1 — P16.a)
        run: python .claude/verify/check_fecho.py --pr
```

O contexto que a proteção de branch exige chama-se **`fecho`** (id do job, sem
`name:` — como `verify` e `visual`).

Lê `GITHUB_BASE_REF`/`GITHUB_HEAD_REF`. Imprime uma linha e sai:

- `LIBERADO · feature/016-registro-contra-execucao → develop · 016 em done · artefatos presentes` (exit 0);
- `FECHO PENDENTE da demanda 016 (fase validate) — merge bloqueado até done (R4 Fase 6; skill new-demand)` (exit 1);
- `NÃO JULGADO (evento sem base — push/workflow_dispatch)` · `NÃO JULGADO (fora da população: chore/fecho-009-013)` · `NÃO JULGADO (base main: release, R14)` (exit 0).

A sonda (`--sonda`) exercita o mesmo julgador com `--head`/`--base` injetados;
ao vivo, esses parâmetros **não são aceitos** (evita "liberar" um PR por
argumento errado).

**Consequência aceita e declarada (borda 6)**: entre a abertura do PR e o push
do commit que grava `done`, o check **`fecho`** do PR fica **vermelho**, com o
nome do check dizendo por quê (E1). O check `verify` (pipeline `run.sh` +
`compliance-audit`) e o local do QA continuam verdes. Depois de P2, esse vermelho **impede o merge** —
é o único mecanismo desta demanda que **previne** em vez de acusar.

### Superfície 3 — seção `branch-protection` do `compliance-audit.sh`

```
[PASS] branch-protection: develop PROTEGIDA · ruleset 21381133 · checks obrigatórios: verify, visual, fecho · up-to-date: sim · token: GITHUB_TOKEN
       outras regras ativas: deletion · non_fast_forward · pull_request.allowed_merge_methods=[merge, squash, rebase]
[FAIL] branch-protection: develop DESPROTEGIDA · faltam: visual, fecho (checks obrigatórios), up-to-date · mecanismo lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false
[WARN] branch-protection: NÃO DETERMINÁVEL (rede inalcançável: <causa>) — rito: gh auth login && bash .claude/verify/compliance-audit.sh --rule=branch-protection
```

A última forma é `[FAIL]` sob `GITHUB_ACTIONS` (T7). O script ganha `aviso()`
(`[WARN]`, contador próprio) e a linha final passa a
`compliance: N PASS · N FAIL · N WARN`; o exit continua sendo o número de FAIL
(nenhum consumidor parseia a linha — verificado por `grep` nesta fase: só o
próprio script a emite). `check_branch_protection.py` **não escreve nada**, lê no
máximo dois endpoints por execução (limite anônimo de 60/h é folga), e imprime
**a fonte do token, nunca o token**.

A seção **`known-issues`** passa a listar `fecho.json → excluidas_por_r13` como
**terceira fonte** de exceção nominal (estrutural, sem prazo, `fonte`
obrigatória — a classe dos motivos `ESTRUTURAIS` do `regra_morta.json`); a seção
**`waivers`** passa a listar `fecho_pendente` ao lado de `tdd_waiver`, casando a
**chave JSON**, nunca substring (lição do `EA-2`, já aplicada em
`compliance-audit.sh:216-228`).

### Superfície 4 — planning-state e schema

`planning-state.schema.json`: `branch` passa a `required` (chave de junção, borda
11); nova propriedade `fecho_pendente` (§Contratos). `check_state.py` **não
muda** (não valida por biblioteca; a forma de `fecho_pendente` é julgada no stage
`fecho`, seu dono). A chave irmã `validacao`/`implementacao` (010, 015, 011)
**não** é proibida nesta demanda — §Fora de escopo.

### Superfície 5 — skill, R4, glossário, registros (C8–C10)

Redações propostas, para o `doc-writer`/`product-owner` ajustarem sem mudar o
sentido:

- `SKILL.md:66` → *"merge é do usuário, **e só depois do `done`** (check
  pré-merge **`fecho`**, `D016-PR1`, obrigatório na proteção de `develop` — E1). Planning-state
  `done` com a Fase 6 completa (1 e 2 acima, com `spec-validate.md` e
  `relatorio-final.md` em disco) e o PR aberto. **CI verde é condição do merge**,
  cobrada pela proteção de branch (`D016-PROT1`) — não do `done`."*
- `sdd.md`, §Gates de fase, novo item: *"**Fecho**: `done` exige Fase 6 completa
  + PR aberto, sempre **antes** do merge; o merge em `develop` espera o `done`
  (check `fecho`, `check_fecho.py --pr` — E1) e o CI verde (checks obrigatórios
  `verify`/`visual`/`fecho`, auditados por `D016-PROT1`). Demanda mesclada sem fecho é
  violação (R4 §Violação): fecho retroativo ou fecho pendente declarado."*
- `CONTEXT.md`: os três verbetes do refinamento §Vocabulário, com o ajuste de T4.
- `design-decisions.md`: linha KI-3 e nova linha confirmada (C10-d).

### Onde fecha, e o que dispara

Nenhum arquivo editado ou criado é `target` de harness existente
(`mutation_map.json`, lido nesta fase): **nenhuma campanha atual dispara**. A
única campanha desta demanda é `d016` (`node`+`python`), que fecha **nesta
máquina**. O único fecho que depende do CI é a **medição** de T6 (permissão do
`GITHUB_TOKEN`), não um veredito. A tabela completa arquivo → campanha →
ambiente → onde fecha é artefato do `plan.md`.

### Nascimento sem vermelho crônico — a prova, gate a gate

Restrição dura do portão (`E5`: o MANIFEST sempre vermelho, logo nunca
rodado). Estado no commit desta spec, verificado por leitura e `git`:

| gate | hoje | dentes (o que acusaria sem a válvula) |
|---|---|---|
| `D016-FEC1` | verde — 10/10 `done`; **0 merges após o piso** (vácuo na árvore, declarado — E2) | prova de carga em cópia (015 → `validate`, **piso recuado para `6dad53d`** — E2) na Fase 4 |
| `D016-FEC2` | verde — **0 merges após o piso** (`origin/develop` == piso) | sem o piso: 6 merges de Onda / 5 branches sem planning-state |
| `D016-FEC3` | verde — 3 exclusões | sem exclusões: 003 (2), 009 (1), 010 (1) |
| `D016-FEC4` | verde por vácuo | 5 casos da sonda |
| `D016-PR1` | **vermelho no PR da 016 até o `done`** — no check **`fecho`** (E1), por desenho, com nome, e é o **red ao vivo** desta demanda; o check `verify` fica verde | — |
| `D016-PROT1` | **vermelho ao vivo** (`DESPROTEGIDA`, medido em 2026-09-04) | fecha por **um** ato, do proprietário (P2, três contextos — E1), **antes do merge deste PR** |

`D016-PROT1` vermelho não é `E5`: tem **dono** (proprietário), **evento único
de fecho** (P2), **prazo** (antes do merge desta demanda — sem P2 o PR não deve
ser mesclado, e o `relatorio-final.md` registra o run em que ficou verde) e é
**exatamente o que o gate existe para acusar**. O que seria `E5` é o oposto:
um gate que nascesse verde sobre uma `develop` desprotegida.

---

## Casos de borda do refinamento — tratamento nesta spec

| # (refinement) | Tratamento |
|---|---|
| 1 — `chore/*`, `fix/*`, Onda, `main→develop` sem planning-state | `FORA DA POPULAÇÃO` por construção (C2); critério impresso uma vez por execução |
| 2 — mesclada com fase `< done` sem válvula | `D016-FEC1` FAIL nomeado (demanda, fase, oráculo, SHA julgado); dói em todo PR seguinte até fecho ou válvula |
| 3 — válvula válida | `FECHO PENDENTE DECLARADO`, impressa, listada no `compliance-audit` (C4) |
| 4 — válvula vencida / incompleta | FAIL (C4 a/b/e); "vencida" é contra a data do commit (T4) |
| 5 — válvula em demanda `done` | FAIL obsoleta (C4 c) |
| 6 — o PR da própria demanda antes do `done` | pós-merge silencioso (merge não está em `origin/develop`); pré-merge **vermelho e nomeado** (C5 b); `run.sh` local verde |
| 7 — `done` sem artefato | `D016-FEC3` FAIL, exceto 003/009/010 por exclusão impressa com fonte (C3) |
| 8 — SHA curto ambíguo / `tdd_waiver` sem `red.commit` | oráculo de mensagem responde primeiro (T1); ancestralidade só se houver `red.commit` e `git cat-file -e` resolver **sem ambiguidade** (`git rev-parse --verify` falha em ambíguo ⇒ oráculo "não responde", impresso); se nenhum responde ⇒ `EM VOO`. A §Medição 4.2 mediu os três SHAs curtos atuais sem ambiguidade — mede a base de hoje, não promete |
| 9 — `origin/develop` desatualizado | veredito sobre SHA **declarado** na saída; CI tem `fetch-depth: 0` e `origin/develop` presente em `pull_request` (§Medição 4.1) |
| 10 — clone raso / `git` ausente | FAIL `NÃO DETERMINÁVEL`, nunca SKIP (C1 e) |
| 11 — planning-state sem `branch` | FAIL de forma (C1 f); schema exige |
| 12 — `feature/00X` antes do piso sem planning-state | `ANTERIOR AO PISO`, contadas (**6 merges / 5 branches**, censo da §Medição 3; `006` não existe) |
| 13 — demanda abandonada | **não é `EA-33`** (P8): fica `EM VOO`; candidata registrada para o `doc-writer` (§Fora de escopo) |
| 14 — merge em `main` (selagem) | não julgado (C5 f; `develop` é o único ref julgado) |
| 15–20 — (R-b1) | **não se aplicam**: R-b1 não é a rota (P1). `MUTATION_DEFER_MISSING`, o ramo `[DEFER]` e o job `visual` ficam como estão (T9) |
| 21 — (R-b2) | **não se aplica**: R-b2 não é a rota. Não há recibo, não há reconcile |
| 22 — o merge acontece **enquanto** o check roda (os 65 s) | **só a proteção de branch impede** — é P2, e `D016-PROT1` é o que garante que P2 continua valendo. Sem P2, `D016-FEC1` registra a violação **depois** |

Bordas **novas** desta rota, sem número no refinamento:

| caso | tratamento |
|---|---|
| `workflow_dispatch` sem `inputs.visual` (o job `visual` não roda) | irrelevante para o merge: check obrigatório que **não reportou** no head SHA do PR bloqueia o merge; o `pull_request` do PR sempre dispara os **três** jobs (E1) |
| push direto em `develop`/`main`, `workflow_dispatch`, PR de `chore/*`/`fix/*` (E1) | o job `fecho` **roda e passa** com `NÃO JULGADO (<motivo>)` impresso — nunca é pulado por `if:` nem por `needs:` (R10 §2): check que não reporta bloqueia; check que pula em silêncio não diz nada |
| P2 configurada por proteção **clássica** em vez de ruleset | contextos legíveis; `strict` **não** (T7 e) — `[WARN]` permanente; a spec recomenda ruleset |
| merge por admin com *bypass* | `D016-PROT1` não lê a lista de bypass nem o audit log (§NÃO mede, 2); `D016-FEC1` acusa **depois**; a válvula é a saída honesta |
| `GITHUB_TOKEN` sem permissão para `/rules/branches` no CI | `[FAIL]` no CI até o proprietário ajustar `permissions:`/secret — **medido no primeiro run do PR**, com plano B nomeado em §Não mensurável 1 |
| proprietário renomeia o repositório | `repo` em `branch_protection.json` diverge do `remote` ⇒ `NÃO DETERMINÁVEL (repositório não identificado: esperado X, remote Y)`; a correção é dado, não código |

---

## O que este gate NÃO mede

Escrito para que ninguém o cite como prova do que ele não prova — a 014 acabou de
pagar o custo de gate que promete mais do que entrega.

1. **A qualidade do fecho.** `D016-FEC3` mede que dois arquivos **existem** e que
   o registro diz `done` — não que o "não encontrei objeção" foi juízo e não
   carimbo, nem que o `spec-validate.md` mediu o que diz. Carimbo é defesa
   humana (D3).
2. **Que a proteção estava ativa no instante de cada merge, nem quem a
   contornou.** `D016-PROT1` lê a configuração **no instante da auditoria**. Não
   lê o audit log do GitHub, não lê `bypass_actors` do ruleset (endpoint
   diferente, `/rulesets/{id}`), e não impede que um administrador desative a
   regra, mescle e reative entre dois runs. O que ele garante é que uma
   desativação **que dure** aparece no próximo run — e que `D016-FEC1` acusa
   depois.
3. **Merge por squash ou rebase.** Os dois oráculos de T1 calam: o SHA do red não
   é ancestral e a mensagem do GitHub não nomeia a branch. A demanda aparece
   como `EM VOO` — **não** como violação. R14 proíbe; a única defesa por máquina
   é configuração: um ruleset com regra `pull_request` e
   `allowed_merge_methods: ["merge"]`. **Recomendação ao proprietário**, fora de
   P2, registrada aqui; `D016-PROT1` imprime o valor encontrado, não o julga.
4. **Promessas humanas.** *"DEFERIDO AO RITO DO PROPRIETÁRIO"* na matriz
   (`D011-M9`) e `ultima_prova` atrasada são território do `EA-30`.
5. **A campanha pós-merge na `develop`.** O gatilho cego pós-merge continua
   (dívida própria na matriz; a §Medição 1 mediu 2 s no push pós-merge). A
   prova do PR é a única, e é por isso que o vencimento é o merge.
6. **A reconciliação `[DEFER]` × campanha executada.** Sob a rota P1, ninguém
   compara a lista de `[DEFER]` do `verify` com o que o `visual` executou. O que
   a proteção garante é que o `visual` **rodou verde sobre o mesmo head SHA**;
   que ele exigiu as mesmas campanhas é **coincidência de código** (os dois
   derivam `changed` do mesmo merge-base), não cobrança. Se um dia divergirem,
   é R-b2 — demanda própria.
7. **`strict` sob proteção clássica** (T7 e): declarado como `[WARN]`
   permanente, nunca medido por este token.
8. **A história anterior ao piso** (`921977c2…`): por desenho (R13). Os seis
   merges do `EA-33` e as cinco Ondas ficam registrados em
   `medicoes-fase0.md`, não julgados.
9. **O diagnóstico do `EA-14`.** Com `visual` obrigatório, uma suíte vermelha
   naquele job **bloqueia o merge** — mas o sinal visível continua sendo o da
   suíte, e o passo das campanhas continua `skipped` sem dizer "campanha exigida
   não medida". A consequência para o merge some; o diagnóstico errado fica.
   `EA-14` **permanece aberto** (C10 c).
10. **Conteúdo** de `relatorio-final.md` e `spec-validate.md`. Só existência.
11. **Demanda abandonada** (P8): nunca mesclada, fase parada — `EM VOO` para
    sempre, sem sinal próprio.
12. **Runs de `workflow_dispatch`** e qualquer coisa fora do evento
    `pull_request` para `develop`: o pré-merge só julga PR; a proteção só cobra
    merge. O job `fecho` **roda** nesses eventos e responde
    `NÃO JULGADO (<motivo>)` (E1) — presença sem julgamento, nunca silêncio.

---

## Contratos

### `fecho_pendente` (planning-state; escrito pela skill/orquestrador, julgado pelo stage `fecho`)

```json
"fecho_pendente": {
  "motivo": "spec-validate.md e relatorio-final.md ainda não escritos; PO/QA recusaram done sem artefatos",
  "dono": "qa-engineer",
  "prazo": "2026-09-11",
  "declarado_em": "2026-09-04"
}
```

`motivo`, `dono`, `prazo` obrigatórios; `prazo` e `declarado_em` em `AAAA-MM-DD`;
`declarado_em` opcional (recomendado). Semântica: T4 e T5. **Owner do estado**
(R9 §5, aplicado a processo): o planning-state — quem escreve é a skill
`new-demand`/o orquestrador; quem **decide** com ele é só `check_fecho.py`;
`state-eval` e `compliance-audit` apenas **listam**.

### `.claude/verify/fecho.json` (dono `qa-engineer`; pinado)

```json
{
  "_meta": {
    "descricao": "Registro do stage fecho (demanda 016, P16.a): piso, exclusões R13 e sonda. Exceção aqui é ESTRUTURAL (sem prazo, fonte obrigatória) — listada pelo compliance-audit (known-issues).",
    "prova_de_carga": {
      "exclusoes": "<medido na Fase 4: sem as três entradas, FEC3 acusa 003 (2), 009 (1), 010 (1)>",
      "piso":      "<medido na Fase 4: sem o piso, FEC2 acusa 6 merges / 5 branches de Onda>"
    }
  },
  "piso": {
    "sha": "921977c25e76fe0ed19dae74e17921d37c711ff0",
    "descricao": "merge do PR #39 em develop, 2026-09-04T08:44-03 — último commit de develop anterior à 016 (T2, interpretação de P9)"
  },
  "excluidas_por_r13": {
    "003-marcador-duplicado":  { "artefatos_ausentes": ["relatorio-final.md", "spec-validate.md"], "fonte": "fechada sob a Onda 2 (PR #13, 486f3ff, 2026-08-25), antes de existir Fase 6 com spec-validate; R13; P4 do portão da 016" },
    "009-leitura-do-relatorio": { "artefatos_ausentes": ["spec-validate.md"], "fonte": "fecho retroativo 2026-09-04 (PR #37) com conformance só no JSON; P4 do portão da 016 — escrita retroativa opcional, fora" },
    "010-recomendacao-sem-vao": { "artefatos_ausentes": ["spec-validate.md"], "fonte": "idem 009; P4" }
  },
  "populacao": {
    "padrao_branch": "^feature/(\\d{3})-",
    "integracoes_de_main": ["^Merge remote-tracking branch 'origin/main' into develop", "^Merge branch 'main' into develop", "^merge: integra "]
  },
  "sonda": { "fixtures": ".claude/verify/fixtures_016/fecho/", "total": 26, "casos": [ { "id": "F1", "esperado": "MESCLADA SEM FECHO" } ] }
}
```

Casos da sonda (ids permanentes; a Fase 4 pode acrescentar, nunca renumerar):
**F1** mesclada por mensagem, `validate`, sem válvula → `MESCLADA SEM FECHO`
(oráculo mensagem) · **F2** mesclada só por ancestralidade → idem (oráculo
ancestralidade) · **F3** não mesclada, `implement` → `EM VOO` · **F4** mesclada
antes do piso, `validate` → `ANTERIOR AO PISO` · **F5** mesclada, `done`,
artefatos → `CONFORME` · **F6** mesclada, `validate`, válvula válida → `FECHO
PENDENTE DECLARADO` · **F7** válvula vencida → FAIL · **F8** válvula sem `dono`
→ FAIL · **F9** `done` com válvula → FAIL · **F10** não mesclada com válvula →
FAIL · **F11** merge após piso de `feature/017-*` sem estado → FAIL · **F12**
`chore/x` após piso → `FORA DA POPULAÇÃO` · **F13** merge manual após piso →
FAIL · **F14** integração de `main` após piso → `FORA DA POPULAÇÃO` · **F15**
`done` sem `spec-validate.md`, sem exclusão → FAIL · **F16** `done` sem
artefatos, excluída com fonte → `CONFORME` (exclusão impressa) · **F17**
excluída cujo artefato existe → FAIL obsoleta · **F18** estado sem `branch` →
FAIL de forma · **F19** `tdd_waiver` sem `red.commit`, mesclada por mensagem →
`MESCLADA SEM FECHO` (mata `D016-M1`) · **P1** `--pr` `feature/NNN`→`develop`,
`done` + artefatos → `LIBERADO` · **P2** `validate` → `FECHO PENDENTE` · **P3**
sem estado → FAIL · **P4** `chore/x` → `NÃO JULGADO` · **P5** base `main` →
`NÃO JULGADO` · **P6** sem base → `NÃO JULGADO` · **P7** `done` com válvula →
FAIL. Total **26**. A fixture de cada caso declara estados, merges (com
`posicao_relativa_ao_piso`), artefatos existentes e `data_do_commit` — o
julgador recebe tudo por parâmetro (T3).

### `.claude/verify/branch_protection.json` (dono `build-engineer`; pinado)

```json
{
  "_meta": { "descricao": "Expectativa de proteção de develop (demanda 016, P16.b, decisão P2 do portão da Fase 0, estendida a três checks no portão da Fase 1 — errata E1). Dado, não prosa (R6): D016-PROT1 compara a API com isto a cada compliance-audit." },
  "repo": "oflavioc/quickscan-secops",
  "ref": "develop",
  "checks_obrigatorios": ["verify", "visual", "fecho"],
  "up_to_date": true,
  "sonda": { "fixtures": ".claude/verify/fixtures_016/protecao/", "total": 9, "casos": [ { "id": "hoje", "esperado": "DESPROTEGIDA" } ] }
}
```

Casos: **hoje** (as duas respostas reais de 2026-09-04) → `DESPROTEGIDA` ·
**esperado_ruleset** (`required_status_checks` com `verify`+`visual`+`fecho`,
`strict` true) → `PROTEGIDA` · **sem_visual** → `DESPROTEGIDA` · **sem_fecho**
(`verify`+`visual`, sem o terceiro — E1) → `DESPROTEGIDA` · **strict_false** →
`DESPROTEGIDA` · **classic_off** (`protected: true`, `enabled: false`) →
`DESPROTEGIDA` · **classic_on** (`enforcement_level: everyone`, contextos
certos, ruleset vazio) → `PROTEGIDA` + WARN `strict` · **http_403** →
`NÃO DETERMINÁVEL (permissão 403)` · **sem_rede** → `NÃO DETERMINÁVEL (rede)`.
Total **9** (E1: era 8; `sem_fecho` é o negativo do terceiro contexto).

### CLI dos dois scripts

`check_fecho.py [--pr] [--sonda] [--json]`; `check_branch_protection.py
[--sonda] [--fixture <dir>] [--json]`. `--sonda` e `--json` emitem **um objeto
JSON em stdout**; texto humano em stderr (R10 §6, precedente T6 da 013). Ao
vivo, nenhum dos dois aceita parâmetro que substitua o que lê do ambiente.

### Harness `d016` (`tests_016_mutants.js`; entrada em `mutation_map.json`)

`requires: ["node", "python"]`; `targets`: `.claude/verify/check_fecho.py`,
`.claude/verify/check_branch_protection.py`, `.claude/verify/fecho.json`,
`.claude/verify/branch_protection.json`, `.claude/verify/fixtures_016/**`,
`tests_016_mutants.js`. Mutação in-place com restauração por SHA-256 sob
`try/finally` e conferência de `git status --porcelain` escopada (forma de
`tests_014_mutants.js`); interpretador por `MUTATION_PY` (T1 da 013). Cada
mutante declara `gate` (id `D016-*`) e `reason` sobre os **ids de caso da sonda**
que têm de divergir (`F19` para `D016-M1`, `http_403` para `D016-M12`…), nunca
regex sobre prosa. Pares entram em `mutation-matrix.json → pares` no mesmo PR.

### Arquivos rastreados que mudam (pinados → `gen_pins.py` no MESMO PR, em commit separado por commit de conteúdo — R8 §1)

| Arquivo | Mudança |
|---|---|
| `.claude/verify/check_fecho.py` · `check_branch_protection.py` · `fecho.json` · `branch_protection.json` · `fixtures_016/**` · `tests_016_mutants.js` | **novos** |
| `.claude/verify/pipeline.yaml` | stage `fecho` (T8 a) |
| `.github/workflows/verify.yml` | job próprio **`fecho`** (T8 b, E1); jobs `verify`/`visual` e **`:42` intocados** |
| `.claude/verify/compliance-audit.sh` | seção `branch-protection`; `aviso()`; `known-issues` lista `excluidas_por_r13`; `waivers` lista `fecho_pendente` |
| `.claude/templates/planning-state.schema.json` | `branch` obrigatório; `fecho_pendente` |
| `.claude/verify/mutation_map.json` · `mutation-matrix.json` | harness `d016`; pares; desfecho da dívida "Borda 8" |
| `.claude/skills/new-demand/SKILL.md` · `.claude/rules/sdd.md` | C8 |
| `CONTEXT.md` | C9 |
| `.claude/rules/design-decisions.md` · `.claude/BACKLOG.md` | C10 |
| `docs/adr/0001-cobranca-no-merge-fora-do-repositorio.md` | **proposto** (ver abaixo) |

**Intocados, por decisão**: `check_state.py`, `check_tdd.py`,
`check_mutation.py`, `env_doctor.py`, `expected_suites.json` (nenhuma suíte nova
— o harness é registrado pelo `mutation_map.json`), `invariants.json`,
`known_issues.json`, `state-eval.sh` (R-a6 fica como candidata do `plan.md`,
tipo `chore`, se couber na wave), spec 013.

**ADR proposto** (R12: os três critérios coincidem): *difícil de reverter* — a
Fase 6 inteira passa a depender de configuração externa; *surpreendente sem
contexto* — um `compliance-audit` que chama a API do GitHub e um `[DEFER]` cujo
credor não está no repositório; *trade-off real* — 42–55 min por PR contra uma
configuração fora do repositório. Tipo `doc`, dono `doc-writer`; **decisão do
portão** — sem ele a spec não perde nada.

---

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** Nenhum byte de produto muda; INV-1
  não é acionada (nem Porta A nem Porta B). `invariants.json` fica
  **byte-idêntico** — P16 é processo e fica fora por decisão registrada
  (planning-state `refinement.propriedade`). INV-9 por reflexo: nenhum arquivo
  tocado é `frozen`, `generated`, `legacy` ou `registry` (este último só via
  `gen_pins.py`).
- [x] **`design-decisions.md` (R13) — um conflito de letra, já superado pela
  decisão do portão; nenhum de substância.** A linha KI-3 diz que o job `visual`
  está *"em calibração"*; `known_issues.json → _meta` diz "KI-3 cumprida na Onda
  4" e `verify.yml:47` diz "calibração fechada na 6ª rodada". A decisão **P2 do
  usuário** (tornar `visual` obrigatório) pressupõe o job calibrado e **supera**
  o parêntese; a **substância** da decisão (suítes visuais fora do agregado
  local; canônico no CI e no rito) é **reforçada**, não tocada. A correção da
  linha é tarefa `doc` deste PR (C10 d) — registrada em DEPENDÊNCIAS para o
  orquestrador vetar se discordar; **não é decisão tomada sozinho**. "Fases
  seladas sob o processo antigo" é o que sustenta o piso e as exclusões R13.
  "planning-state fora do registry" é honrada: `fecho.json` e
  `branch_protection.json` são registros de `.claude/verify/` (pinados), o
  planning-state continua fora dos pins. Nenhuma candidata é tangenciada.
- [x] **Specs validadas anteriores — nenhuma contradição.** **013**: T7
  ("nenhuma mudança em `verify.yml`") e borda 8 eram restrições **de escopo** e
  a própria spec (Risco 4) devolveu o fechamento como "demanda própria"; **C4 da
  013 continua literalmente verdadeira** (T9) — sem errata. **014**: o precedente
  da exclusão nominal com dentes (`_trilha` do `d014`, errata E14
  `prova_de_carga_e_red`) é seguido em C3(d); o par `D014-M10`/`P52-LAY2`
  deferido ao job `visual` fica **mais forte** (o job passa a ser obrigatório).
  **012**: a mudança de status do `EA-33` segue a gramática vigiada pela seção
  `backlog`. **007/008**: a política EB-5 (`check_evidence_bridge.py:32-36`) é
  reutilizada em T7. **003**: a spec da 003 não promete `spec-validate.md`
  (fechada sob a Onda 2) — a exclusão é coerente com o que ela prometeu.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json → specs_normativas` tem **uma**: `specs/PHASE_5_0_REV_B.md`
  (SHA `4f1583c7…4619b`). Busca por `merge`, `develop`, `planning`, `pull
  request`, `branch protection`, `proteção de branch`: **zero ocorrências**. A
  única menção a "CI" é `:1608` (`npm ci --engine-strict`), instalação, não
  integração contínua. `specs/PHASE_5_0_REV_A.md` (histórica, REPROVADA, classe
  `legacy`): mesma busca, **zero**. A spec selada normatiza superfícies de
  produto; **nada** sobre fluxo de merge. `current_phase.json` **não muda**.
  Spec selada **não é editada aqui**.
- [x] **Boundary (R6) — as três fontes cruzadas, com o negativo:**
  1. `.claude/verify/boundary.json` — `frozen`: `engine_v32.js`,
     `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`,
     `v3_1_3_functional_snapshot.json`; `generated`: HTML dev e `ui_icons_v32.js`;
     `legacy`: `MANIFEST.sha256`, REV A; `registry`: `pins.json`. **Nenhum
     arquivo desta demanda está em classe alguma.**
  2. `PROTECTED` (`tests_p50_core.js:82`) e `frozenSuites` (`:473`) — busca por
     `compliance-audit`, `pipeline.yaml`, `verify.yml`, `check_state`,
     `check_tdd`, `SKILL.md`, `CONTEXT.md`, `sdd.md`, `schema.json`,
     `state-eval`: **zero ocorrências**. Resultado negativo explícito.
  3. `.claude/verify/pins.json` — todos os arquivos editados são pinados
     (`.claude/rules/*` 14, `.claude/skills/*` 5, `.claude/templates/*` 6,
     `.github/workflows/verify.yml`, `CONTEXT.md`, `.claude/BACKLOG.md`,
     `compliance-audit.sh`, `pipeline.yaml`, `mutation_map.json`,
     `mutation-matrix.json` — conferidos por leitura do registry); os novos
     entram no repin (arquivo rastreado sem pin é FAIL no stage `baseline`).
     `.claude/project-memory/**` segue excluído (`_meta.exclusoes`).
  - **Rito, nomeado**: **não há rito D2 nem PARADA nesta demanda.** O rito é o
    comum — R3 (red commitado; autor da sonda/fixtures ≠ autor do julgador),
    R8 §1 (repin no mesmo PR, commit separado), R10 §3/§9 (harness no
    `mutation_map.json`, stage no `pipeline.yaml`). **Precedência** onde prosa
    selada divergir do executável: regime de pins (R8;
    `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2) — não há
    divergência a registrar nesta demanda.
- [x] **R4/R14 — coerência do fluxo, sem impasse.** P7 remove a circularidade:
  `done` ← Fase 6 + PR aberto (sem CI); merge ← `done` (C5) + CI verde (C6).
  O `done` é commitado no PR depois de aberto → push → o check `fecho`
  reexecuta → `LIBERADO` (E1). "Merge é do usuário" (R14) não muda — muda **quando** ele pode.
  "Proibido squash" (R14) ganha, no §NÃO mede 3, a recomendação de virar
  configuração.
- [x] **R10 — as dez proibições.** §1 nada enfraquecido (as exclusões são carga
  medida, C3 d); §2 zero SKIP silencioso — todo não-julgado e todo
  não-determinável é impresso com causa, e `[WARN]` local vira `[FAIL]` no CI
  (T7); §3 nenhuma contagem em prosa — os totais da sonda são pinados em dado;
  §4 nenhum pin inline; §5 piso = commit imutável + SHA de 40 hex (T2); §6 sonda
  compara **enum em JSON**, não regex sobre PT-BR; §7 `git` invocado por lista de
  argumentos, sem shell; rede declarada dentro do gate (precedente
  `evidence-bridge`, sem mudança no `env-doctor`); §8 nenhum gate escreve; §9
  stage `fecho` no `pipeline.yaml`; §10 não há scanner de padrão.
- [x] **R7 — determinismo.** Veredito de `fecho` é função pura de árvore +
  histórico (T4 troca o relógio pela data do commit); `check_branch_protection.py`
  é o único não-puro por construção (lê o mundo), e diz isso na primeira linha
  da saída. Nenhum dos dois escreve.
- [x] **R9 — modularidade, aplicada a script de processo.** Um responsabilidade
  por arquivo (fecho × proteção), julgador puro separado de I/O, orçamento de
  ~600 linhas por script como teto (justificativa no `plan.md` se estourar);
  "owner do estado" declarado para `fecho_pendente`, `fecho.json` e
  `branch_protection.json`.
- [x] **R12 — ids permanentes** (`D016-*`, `F*`/`P*`, casos da sonda),
  templates, PT-BR; ADR proposto com os três critérios argumentados.

---

## Não mensurável nesta fase — declarado, não omitido (R2 §1)

1. **Permissão do `GITHUB_TOKEN` de Actions para `GET /rules/branches/develop`.**
   Medi com token de **usuário** (`gh auth`, escopos `repo, workflow`): 200 com
   conteúdo. A documentação do GitHub associa o endpoint a `metadata: read`, que
   todo token de Actions tem — **não confio nisso como premissa**: é medição do
   **primeiro run do PR** desta demanda (`build-engineer`). Se der 403, o plano B
   já está nomeado: `permissions: { contents: read }` explícito no job (não
   resolve se o endpoint exigir mais) ou secret com PAT de leitura — **decisão do
   proprietário**, escalada com os dois lados. O oráculo clássico
   (`/branches/develop`) é legível sem autenticação (medido, §Medição 2 e T6).
2. **A prova de carga de C3(d) e do piso** — quantidades **lidas** (3
   demandas/4 artefatos; 6 merges/5 branches). A Fase 4 as fixa **por
   execução** e grava em `fecho.json → _meta.prova_de_carga`. Divergência entre
   lido e medido é achado, não ajuste silencioso.
3. **O red ao vivo de `D016-PR1`** só se prova no PR (contexto de
   `pull_request`); localmente, a sonda P2 é o red. O relatório final cita o run.
4. **O verde ao vivo de `D016-PROT1`** depende de P2 (ato do proprietário). Até
   lá o gate é vermelho por desenho (§Nascimento sem vermelho crônico). O
   relatório final cita o run em que ficou verde e o `ruleset_id` lido.
5. **Se a `up-to-date` do GitHub cobre o cenário dos 65 segundos por inteiro.**
   A proteção exige que o check tenha **reportado** no head SHA; o intervalo
   entre "job terminou" e "GitHub registrou" é do GitHub. Não medido; não
   prometido.
6. **Execução.** Não rodei suíte, stage novo nem harness — não existem ainda.
   Rodei `git log`/`git rev-parse`/`gh api` de **leitura** para T1, T2 e T6, e o
   `run.sh --light` da árvore atual ao fim desta fase (contagem em EVIDÊNCIA do
   relatório de entrega).

---

## Fora de escopo

Herdado do refinamento, mais o que esta spec exclui:

- **R-b1 e R-b2** (P1): não se constrói recibo, reconcile, nem Chromium no
  `verify`. Se a coincidência de código de §NÃO mede 6 quebrar, é demanda
  própria.
- **Configurar a proteção de branch** (P2) e **restringir métodos de merge**
  (recomendação de §NÃO mede 3): atos do proprietário, fora do repositório.
- **Estado terminal para demanda abandonada** (P8): candidata registrada para o
  `doc-writer`, cadeia `state-eval.sh:58-67`.
- **Escrita retroativa de `spec-validate.md`** de 009/010 (P4): opcional, fora;
  se acontecer, a entrada em `excluidas_por_r13` sai **no mesmo commit** (C3 b).
- **Chave irmã `validacao`/`implementacao`** nos planning-states de 010, 011 e
  015: drift de forma real, lido nesta fase; **não** é P16. Candidata a `chore`
  do `data-engineer` (normalizar para `validate`/`implement` e fechar o schema),
  registrada em DEPENDÊNCIAS — não ganha gate aqui para a spec não prometer duas
  coisas.
- **`EA-14`** (ordem dos passos no job `visual`) e **`EA-15`** (`run.sh` trunca
  em 30 linhas): outros achados; o primeiro fica aberto com nota (C10 c).
- **`EA-30` / promessas humanas** na matriz.
- **Gatilho cego pós-merge** na `develop`.
- **Distinguir "mesclada sem fecho" de "em voo" no `state-eval`** (R-a6): barata,
  informativa, **sem gate** — entra no `plan.md` como `chore` se couber, não é
  critério.
- **Qualquer byte de produto.**
- **Errata na spec 013**: não há o que emendar (T9).

---

## Errata — portão da Fase 1 (2026-09-04)

**Trilha de auditoria.** O portão da Fase 1 foi aprovado pelo usuário no chat em
2026-09-04 com **uma decisão que contraria a proposta T8-b** desta spec e três
que a confirmam (**T2** — piso no merge-base `921977c`, não o SHA do próprio
merge; **T4** — prazo contra a data do commit, não o relógio; **T7** — WARN
nomeado local / FAIL no CI, precedente EB-5). **E1** registra a decisão contrária.
**E2** é precisão de procedimento encontrada por leitura na Fase 2 (tech-lead,
sob a delegação vigente): não muda critério, não renumera id, e só torna
executável uma prova que a spec já prometia — não exige ratificação. Nenhuma
asserção enfraquece; nenhuma boundary se amplia; nenhum veredito de gate alheio
muda. **E3** (wave 5) corrige a §Superfície 1 "Entrada", que ainda prescrevia
`--merges` — classe **spec-errada** do `spec-validate` (a errata ET2 do
`tasks.md` já registrava a divergência e a devolvia para cá por DEPENDÊNCIAS);
não muda critério, id, contagem nem o conjunto de sujeitos julgados. As células
amendadas levam a marca `(E1)`/`(E2)`/`(E3)`; a redação original de cada uma
está preservada abaixo (R2 §5).

| Campo | Registro |
|---|---|
| **Quem decidiu** | E1: o usuário, no chat. E2: tech-lead, sob delegação, por leitura e execução (`git log --first-parent`). E3: `qa-engineer` — **DECIDIDO SOB DELEGAÇÃO DO PROPRIETÁRIO de 2026-08-29, não aprovado por ele pessoalmente**; a delegação é **geral** (*"tome as decisões por mim"*, registro em `.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`) e **não enumera "errata"** — a subsunção é do orquestrador; registrado assim para poder ser contestado |
| **Quando** | 2026-09-04 (E1, E2 e E3) |
| **Onde** | Portão da Fase 1 (E1); Fase 2, ao escrever o `plan.md` (E2); wave 5, ao escrever o harness `d016` e a prova de carga M19 (E3) |
| **Alcance** | E1: T8(b); P2 (estendida pelo próprio usuário); T6; C5 (lugar do gate); C6 (três contextos; sonda 8 → 9); §Superfície 2; amostras de §Superfície 3; redações de `SKILL.md`/`sdd.md` em §Superfície 5; §Nascimento (linhas `D016-PR1`/`D016-PROT1`); bordas novas; §NÃO mede 12; §Contratos `branch_protection.json`; tabela de arquivos; cross-check R4/R14. E2: §Guarda de tautologia C1(a) e §Nascimento linha `D016-FEC1`. E3: §Superfície 1, "Entrada" — só o comando de leitura dos merges |
| **O que NÃO é reaberto** | P1, P3–P9 do portão da Fase 0; T1–T5, T7, T9, T10; T8(a) (stage `fecho` no `pipeline.yaml`) e T8(c) (`D016-PROT1` no `compliance-audit`); C1–C4, C7–C10; as asserções de `D016-PR1` (só o **lugar** muda); todos os ids `D016-*`, `F*`, `P*`; o piso; a política EB-5. `E5` é citado como razão, não reaberto como achado. E3 não reabre T1/T2 nem o julgamento dos merges: o conjunto de sujeitos é **idêntico** nas duas formas (39 merges na árvore de hoje, medido) |

### E1 · T8(b) — o check pré-merge vive em job próprio `fecho`, e a `develop` passa a exigir três checks

| Campo | Registro |
|---|---|
| **O que estava escrito** | T8(b): *"check pré-merge (C5) → **passo próprio no job `verify`** de `verify.yml`, depois do `compliance-audit`, sem `if:` (o script nomeia o contexto e sai 0 fora de PR)"*, justificado por *"passo próprio torna o FAIL **distinguível** de falha de produto pelo nome do passo, e **não estende P2** — um job próprio exigiria um terceiro check obrigatório, decisão que o usuário não tomou. O custo aceito: entre a abertura do PR e o commit do `done`, o check `verify` do PR fica vermelho **por desenho e com nome** (borda 6)"*. P2: *"o usuário configura `verify` e `visual` como checks obrigatórios"*. T6: *"sse os contextos `verify` **e** `visual` são obrigatórios"*. C6: *"os checks **`verify` e `visual`** e *up to date*"*. §Superfície 2: *"No job `verify`, depois de `compliance-audit`"* + um passo `- name: Fecho da demanda antes do merge`. `branch_protection.json`: `"checks_obrigatorios": ["verify", "visual"]`, sonda `"total": 8` |
| **Por que mudou — o argumento que decide** | Um `verify` vermelho durante toda a demanda **ensina que vermelho é normal**, e vermelho normal deixa de ser lido. É o mecanismo exato do `E5` — o MANIFEST que estava sempre vermelho e por isso nunca era rodado. Um check chamado `fecho`, vermelho, diz algo **verdadeiro e útil**: *a demanda ainda não fechou*. O `verify` continua significando *o código está são*; conflatar os dois destrói os dois sinais. A redação original evitava um terceiro check para não tomar decisão que não era da spec — o usuário **tomou a decisão** no portão |
| **O que passa a valer** | (i) `verify.yml` ganha o job **`fecho`** (id = contexto), sem `needs:`, sem `if:`, checkout raso, um passo: `python .claude/verify/check_fecho.py --pr`. Em `push`, `workflow_dispatch` e PR fora da população o job **roda e passa** com `NÃO JULGADO (<motivo>)` — nunca pula em silêncio (R10 §2). (ii) P2 = **três** checks obrigatórios em `develop` — `verify`, `visual`, `fecho` — mais *up to date*. (iii) `branch_protection.json → checks_obrigatorios: ["verify","visual","fecho"]`; a sonda ganha o caso **`sem_fecho`** → `DESPROTEGIDA` (total **9**), o negativo do terceiro contexto: sem ele, um julgador que exigisse só dois contextos sobreviveria à sonda. O mutante correspondente ganha id alocado pelo `qa-engineer` na Fase 4 (≥ `D016-M17`, sem reutilizar). (iv) Borda 6: o vermelho até o `done` vive no check **`fecho`**; o `verify` fica verde. (v) O nome coincide com o do stage `fecho` do `pipeline.yaml` **de propósito**: uma propriedade (P16.a), duas direções — pós-merge no pipeline, pré-merge no check |
| **Custo aceito pelo usuário** | Três checks obrigatórios em vez de dois; um job a mais por run (sem `npm ci`, sem node — segundos, a medir no primeiro run); o check `fecho` do PR da 016 vermelho até o `done`, com nome |
| **Onde o gate já afirma isso** | Ainda em lugar nenhum (Fase 1 → 2). As asserções de `D016-PR1` são as mesmas — muda o **lugar**; `D016-PROT1` ganha um contexto na expectativa e um caso na sonda |
| **Classe** | Decisão do portão que contraria a proposta da spec; **fortalece** (mais um check obrigatório, mais um negativo na sonda); nenhum critério cai; nenhum id renumera |

### E2 · A prova de carga de C1(a) precisa recuar o piso — senão não acusa nada

| Campo | Registro |
|---|---|
| **O que estava escrito** | §Guarda de tautologia, C1(a): *"a **prova de carga** da Fase 4 põe uma cópia de `015` em `validate` numa worktree efêmera e mede a acusação (`oráculo: mensagem #34`)"*; §Nascimento, `D016-FEC1`: *"prova de carga em cópia (015 → `validate`) na Fase 4"* |
| **Fato medido** | O merge da 015 (`222edd5`, 2026-09-01) é **anterior ao piso** `921977c` (2026-09-04) na first-parent de `origin/develop` (posições 6 e 1). C1(d) manda contar merge anterior ao piso como `ANTERIOR AO PISO`, não julgado. Logo a cópia descrita responderia `ANTERIOR AO PISO` e a "prova de carga" não acusaria ninguém — uma prova que não pode falhar é carimbo, o que a 013 e a 014 combateram |
| **O que passa a valer** | A cópia efêmera recua **também** `fecho.json → piso` para `6dad53d` (merge da Onda 4, PR #15, posição 45 — o "piso sugerido pelos dados" da §Medição 3: posterior a toda Onda, anterior a toda demanda real) **e** põe 015 em `validate`: `D016-FEC1` acusa **015** por `oráculo: mensagem #34` e **nada mais** (as outras nove estão `done`); restaurado o piso, o mesmo estado responde `ANTERIOR AO PISO`. Registrado em `fecho.json → _meta.prova_de_carga.fec1`. Declarado: com o piso vigente e 0 merges após ele, C1(a) é **verde por vácuo na árvore** hoje — como C4 — e a não-vacuidade vem da sonda (F1, F2, F19) e desta prova |
| **Onde o gate já afirma isso** | Lugar nenhum ainda; o `plan.md` propõe automatizá-la no harness `d016` como mutante de árvore (dois arquivos mutados com restauração por SHA) |
| **Classe** | Precisão de procedimento; **fortalece**; sem mudança de critério, id ou contagem de gate |

### E3 · A leitura dos merges percorre a cadeia first-parent inteira — `--merges` tornaria a prova de carga M19 inexecutável

| Campo | Registro |
|---|---|
| **Proveniência** | **DECIDIDO SOB DELEGAÇÃO DO PROPRIETÁRIO de 2026-08-29, não aprovado por ele pessoalmente.** Decisão do `qa-engineer` na wave 5 (2026-09-04), autorizada pelo orquestrador sob a delegação **geral** do proprietário (*"tome as decisões por mim"*; o registro não enumera "errata" — a subsunção é do orquestrador). Escrito desta forma para que a decisão possa ser contestada como delegada, nunca lida como pessoal |
| **O que estava escrito** | §Superfície 1, "Entrada": *"`git log --format=%H%x00%cI%x00%s --merges --first-parent origin/develop`"* — o leitor enumeraria **só** os commits de merge e localizaria o piso nessa lista |
| **Fato medido** (git, 2026-09-04, `refs/remotes/origin/develop` = `921977c`) | O piso zero da prova de carga de C2(a) — `e5ccd429d0ed271ab3dd9ea948181e697f891af3`, a raiz do repositório — é commit **não-merge**, posição 67 de 67 na cadeia first-parent (39 merges). `git log --first-parent --merges … \| grep -c ^e5ccd429` ⇒ **0**; sem `--merges` ⇒ **1**. Com `--merges` o leitor devolveria `piso_na_cadeia: false`, o julgador abortaria em `piso-invalido` (forma de F21, C2 d) e a prova de carga de C2(a) — 6 merges / 5 branches de Onda sem planning-state, mutante de árvore `D016-M19` — seria **inexecutável**: um FAIL de forma no lugar da acusação que ela existe para produzir. O mesmo vale para qualquer piso legítimo que seja commit não-merge (falso positivo permanente) |
| **O que passa a valer** | `ler_merges(piso)` percorre `git log --first-parent --format=%H%x00%P%x00%cI%x00%s origin/develop` — a cadeia **inteira**, com `%P` —, localiza o piso nela e anota cada merge (**≥ 2 pais**) com a posição `anterior` / `piso` / `posterior`. **Sujeito continua sendo só o merge**: o julgamento é idêntico nas duas formas (`merges_ate_piso` = 39 na árvore de hoje, igual ao censo por `--merges`); muda apenas onde o piso pode estar. É a letra de ET2 (`tasks.md` §Errata), do docstring do gate (§CONTRATO, leitores) e de `fecho.json → piso.descricao`, agora também da spec |
| **Onde o gate já afirma isso** | `fecho.py:ler_merges` (T030, `d80c7ed`); sonda F20/F21 (piso fora de forma / fora da cadeia ⇒ `piso-invalido`); `D016-M19` e `D016-M25` no harness `d016` (wave 5) — o piso zero acusa 6 merges / 5 branches **só** porque a cadeia é lida inteira |
| **Classe** | **spec-errada** (skill `spec-validate` §3): a spec prescrevia um comando que o próprio critério dela (C2 d + prova de carga) torna incorreto; a implementação estava certa antes da spec. Nenhuma asserção enfraquece; nenhum id, contagem ou critério muda; nenhuma boundary se amplia |

---

## Errata E4 — a citação trocada entre `E5` e `EA-5`

**DECIDIDO SOB DELEGAÇÃO DO PROPRIETÁRIO de 2026-08-29, não aprovado por ele
pessoalmente.** O registro da delegação é
`.claude/agent-memory/doc-writer/project_delegacao-proprietario-2026-08-29.md`,
commitado; ela é geral ("tome as decisões por mim") e não enumera "errata" — a
subsunção é do orquestrador e fica escrita para poder ser contestada.

**O que dizia**: sete pontos desta spec, do `plan.md` e do `refinement.md`
citavam **`EA-5`** para o mecanismo *"o MANIFEST 74/74 sempre vermelho, logo
nunca rodado"*.

**O que passa a dizer**: **`E5`**.

**Por que**: são dois achados distintos, em **namespaces distintos**, e o
`.claude/BACKLOG.md` tem seção própria dizendo que `EA-*` **não** é a
continuação de `E*`.

| Id | Referente | Fonte |
|---|---|---|
| **`E5`** | o MANIFEST 74/74 nunca regenerado, sempre vermelho, logo nunca rodado | `.claude/rules/pins.md:8` |
| **`EA-5`** | harness que não rodou reporta `NÃO DETECTADO` — o número não distingue "não executei" de "executei e escapou" | `.claude/BACKLOG.md`, achado aberto |

A confusão é fácil porque **os dois são da mesma família** — número que ninguém
confronta com execução —, e foi exatamente por isso que passou por sete citações
sem ninguém tropeçar. Quem a pegou foi o `doc-writer`, ao escrever o ADR e ir
conferir a fonte antes de citar.

**Alcance maior que esta demanda, e declarado**: a troca também está em memórias
de agente e no `planning-state` da demanda 013 — anteriores a esta demanda e
fora do escopo desta errata. Registrado para o backlog, não corrigido aqui: um
`sed` cego sobre memórias de agente reescreveria o que outro agente aprendeu, e
o custo de citação apodrecida é justamente o que o `EA-31` nomeia.

**O que esta errata não muda**: nenhum argumento. Os dois achados dizem a mesma
coisa sobre vermelho crônico; o que estava errado era o **id**, não o
raciocínio. Registrar assim importa — errata que finge ter mudado a substância
esconde que o texto estava certo e a referência não.
