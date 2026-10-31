# Custo de estender a identidade curável — lente data-engineer (somente leitura)

Demanda em abertura: 026 — contrato único de decisão de apoio. Base: `develop @ 9509e4b`.
Sondas (read-only, jsdom): `scratchpad/data-engineer/pareamento.js`, `probe-identidade.js`,
`probe-identidade-2.js`. Nenhum arquivo do repositório foi tocado.

## 0 · O fato que organiza tudo

Há **dois catálogos** com **duas famílias de chave** para o mesmo produto, e a curadoria aceita só uma:

| catálogo | onde | chave | exemplo |
|---|---|---|---|
| Camada 1 `PRODUCTS` (congelado V3.1.3) | `quickscan_secops_soccmm_v3_1_3.html:262-275` | PascalCase, 13 chaves | `"FortiEndpoint"`, `"SOCaaS"`, `"FortiGuard-MDR-Service"` |
| motor `V32.OFFERINGS` / `V32.SERVICES` (classe `frozen`) | `engine_v32.js:86-200`, `:200-215` | minúsculas, 29 offerings + 16 services | `"fortiedr"`, `"fortindr-onprem"`, `"fortiguard-socaas"` |

Pareamento medido por **nome exibido** (`PRODUCTS[k].n === OFFERINGS[id].name`), `pareamento.js`:

- **com par** (9 offerings + 2 services): `fortianalyzer→FortiAnalyzer`, `fortisiem→FortiSIEM`, `fortisoar→FortiSOAR`,
  `fortiendpoint→FortiEndpoint`, `fortixdr→FortiXDR`, `fortirecon→FortiRecon`, `fortideceptor→FortiDeceptor`,
  `fortidlp→FortiDLP`, `fortiai-assist→FortiAI-Assist`, `ndr-family→FortiNDR` (a **família**, não a variante),
  `fortiguard-socaas→SOCaaS`, `fortiguard-mdr→FortiGuard-MDR-Service`;
- **sem par** e que o motor **decide** nos cenários da auditoria: `fortiedr` (C1), `fortindr-onprem` (C6),
  `fortisiem-cloud` (C10), `fortindr-cloud`, `fortisoc` (C3, plataforma declarada);
- **sem par** e habilitados por sinal: `fortiaigate`, `fortisat`, `fortiauthenticator`, `fortipam`, `fortimail*`;
- **sem par** estrutural: 5 famílias, `forticlient`, `fortisandbox`, `fortigate` (âncora, `never-direct`), 14 serviços de assessment/IR;
- Camada 1 sem par no motor: `FortiGuard-Service-Bundle` (`n:"Serviços FortiGuard"`).
- 9 colisões case-insensitive de id (`FortiAnalyzer` ~ `fortianalyzer` …): a mesma coisa com duas grafias.

Ampliar `PRODUCTS` é **Porta B** (`specs/019-curadoria-do-relatorio/spec.md:215-218`, medido na Fase 0 da 019:
altera o payload M41). Logo nenhuma alternativa abaixo pode "só acrescentar `FortiEDR` ao catálogo da Camada 1".

## 1 · Onde a chave do item curável é validada, serializada, importada e comparada

### 1.1 Definição e validação (owner: `ui_curation_v32.js`)

| o quê | arquivo:linha | regra |
|---|---|---|
| catálogo curável | `ui_curation_v32.js:88-91` `catalogo()` | `Object.keys(PRODUCTS)` — **só** Camada 1 |
| validação de id+valor | `:154-159` `valido(id, valor)` | `catalogo().indexOf(id) < 0 → "id fora do catálogo: " + id`; enum `:83` |
| escrita | `:276-281` `set`, `:290-295` `unset` (passa `ENUM[0]` só para que o id possa reprovar) | lança `"curadoria: id fora do catálogo: <id>"` |
| validação pura do bloco | `:218-247` `validar(obj)`; por chave de `decisions` em `:238-241` | acumula `"decisions: id fora do catálogo: <id>"` |
| aplicação | `:253-263` `daSessao(obj)` | substitui o estado inteiro; `undefined` limpa |
| oferta (por GAP) | `:96-109` | `MAP[f.id].lv[f.lvl].c[].p` — chaves de `PRODUCTS` (`v3_1_3.html:420+`) |
| oferta (por SINAL) | `:122-146` | traduz `OFFERINGS[cd.itemId].name` → chave de `PRODUCTS` por `n`; **`:142 if (!chave) return;`** — item do motor sem par é **silenciosamente não ofertado** |
| decisão efetiva | `:162-165` `decidir` | ausente ⇒ `include` se ofertado, senão `exclude` |
| publicados | `:170-179` | ofertados não excluídos + `include` que esteja em `catalogo()` (`:176`) |
| escolha do operador / sem lastro | `:183-185`, `:189-193` | `include && !ofertado` — o **mesmo** conjunto |
| contrato de leitura | `:306-314` `contract()` | `published/offered/architectureNote/operatorChoices/suppressed` |

### 1.2 Serialização (owner: `ui_session_v32.js`)

- `ui_curation_v32.js:199-204` `paraSessao()` — chave **omitida** quando nada declarado (`missing ≠ {}`).
- `ui_session_v32.js:69-77` `captureCanonicalInputs` → `out.reportCuration = __CURATION.toSession()`.
- `:594-600` snapshot do 11º owner; `:677` `sessionHasContent()` conta curadoria declarada.
- Documento: `SESSION_SCHEMA_V32.md:221-222` (opcional), `:238` (linha de owner — pinada por `D025-DOC1 (a)` e mutante `D025-M21`), `:444-451` (§9: *"id de produto fora do catálogo"* recusado; ausência legítima e substitutiva).
- Exemplo publicado: `synthetic_session_examples/exemplo-completo.json:229-234` — `decisions: {"FortiAnalyzer":"exclude"}` (lido por `D025-INV8 (d)`).

### 1.3 Importação (owner: `ui_session_v32.js`)

| etapa | linha | efeito sobre a chave |
|---|---|---|
| chaves permitidas em `inputs` | `:229` | `reportCuration` na lista fechada |
| derivados reservados | `:34-37` `RESERVED_DERIVED` + `:150-155` `hasReservedDerived` | varre **toda chave em qualquer profundidade** de `inputs` — inclusive as chaves de `decisions`. Hoje nenhum id colide; um id futuro do motor chamado `services`, `offerings`, `commercial`, `gaps`… seria recusado como derivado. Constraint a registrar para qualquer alternativa que leve id do motor ao arquivo |
| validação delegada | `:239-244` | `__CURATION.validate(I.reportCuration)` → `err("Curadoria inválida: " + …)` |
| normalização | `:543`, `:548` | `cand.curadoria` = cópia profunda ou `undefined` |
| commit / rollback | `:637`, `:619-620` | `fromSession(cand.curadoria)` dentro da transação; `fromSession(snap.curadoria)` no restore |
| compatibilidade | `SESSION_SCHEMA_V32.md:244-247` (§6) | só `format`/`schemaVersion`/`engineSha256`; **o conjunto de ids válidos não participa** — alargar o catálogo não muda `engineSha256` nem `schemaVersion` |

### 1.4 Comparação (consumidores)

| consumidor | linha | como compara |
|---|---|---|
| `ui_p52_support_v32.js` `idDoNome(nome)` | `:116-123` | nome exibido → chave `PRODUCTS` (único ponto de tradução; falha para `null`) |
| `decisaoDe(nome)` / `ehEscolhaDoOperador(nome)` | `:136-141`, `:146-151` | `idDoNome` nulo ⇒ `"include"` / `false` — **item sem par é sempre publicado e nunca curável** |
| `ofertaDoMotor()` | `:247-346` | laço GAP chaveia por id Camada 1 (`:258`); laço SINAL chaveia por **nome** (`:325-327`) e guarda `porId[pid]` com id do **motor** (`:327`) — duas chaves no mesmo registro |
| `acrescimos(jaPresentes)` | `:570-583` | `PRODUCTS[id]` ausente ⇒ **descarta em silêncio** (`:577-578`) |
| `cardAcrescentado(id)` / `corpoDoCatalogo(id)` | `:517-546`, `:553-568` | texto, link e `productIcon(id)` (`v3_1_3.html:257`, `ICONS` chaveado por Camada 1) |
| `PORTFOLIO` | `:66-80` | chaveado por id Camada 1; fora dele ⇒ `nao-classificado` (`:81`) |
| `papelHTML()` | `:794-834` | copia atributos do card (`data-p53-sol-produto` = **nome**) — nenhuma chave viaja ao papel |
| `ui_curation_edit_v32.js` `nomeDe(id)` | `:72-75` | `PRODUCTS[id].n \|\| id` — id do motor sairia **cru** na tela |
| `linhaProduto` / extras | `:78-107`, `:200-208` | `data-p53-cur-item` = nome; extras = `catalog()` − `offered()` |
| `rotuloGrupo` | `:108-112` | `__P53SOL.grupoDe(nome)` → `idDoNome` → `PORTFOLIO` |
| `ui_v32.js` `temProdutoPublicadoV32` | `:729-745` | `published().length > 0` (chave opaca) |
| `ui_v32.js` `v32CuradoriaPublica` | `:156-161` | só `architectureNote` |

### 1.5 Gates e mutantes que leem a chave

- **Usam `catalog()[0]` como alvo**: `D019-CUR1 :155`, `S4-S5 :143-146`, `S30 (b) :314`, `D025-PRV1 :723`.
- **Usam `catalog() − offered()` como "fora da oferta"**: `D019-CUR2 (e) :203`, `D019-PROV1 :274`, `D019-CARD1 :685`, `S69 (b) :852`, `fixtures() da 025 :240-243` (`semL`, e exige `off.length ≥ 9`).
- **Exigem a recusa por id desconhecido**: `D019-INV8 :240-241` (`/fora do catálogo/`), `D025-VAL2 :335` (prefixo `"decisions: id fora do catálogo: "`), `D025-UNS1 :762` (`"curadoria: id fora do catálogo"`), `F.invId :252`.
- **Resolvem nome por `PRODUCTS[id].n`** (quebram com id sem entrada): `D019-PROV1 :282`, `D019-SOL1 :380`, `D019-SOL3 :490`, `D019-CTX1 :559-560`, `tests_025 nomeDe :159`.
- **Oráculo por `MAP`+`PRODUCTS`**: `D019-SOL1 :372-380` (par produto×capability) — a 026 vai ter de reancorá-lo de qualquer forma (o Plano §2 proíbe o MAP como único oráculo).
- **Banimento de 13 nomes derivados na sessão** (`S4-S5 :129-130`; inclui `"offerings"` e `"services"` com aspas).
- **Mutantes ancorados em literal dentro de `ui_curation_v32.js`**: `D019-M1` em `:157`, `D019-M2` em `:164`, `D025-M2` em `:255-256`, `D025-M3` em `:219`, `D025-M23` em `:227`, `D025-M5` em `:254`, `D025-M9` em `:257`. Qualquer reescrita de `valido`/`decidir`/`validar`/`daSessao` que altere esses literais deixa a campanha em "âncora não encontrada" (memória: *rename apodrece âncora de mutante*).
- Consumidores opacos à forma da chave (só `offered()/set/published()`): `tests_010_vao.js:231-236`, `tests_ui_m31.js:60-72`, `tests_023_leitura.js:199-217`, `tests_p52_chromium.js:3737-3744`.

## 2 · O que quebra se `catalogo()` passar a incluir `V32.OFFERINGS` + `V32.SERVICES`

Medido **em memória** (reinstalando o módulo só na janela jsdom, `probe-identidade.js` §(2), cenário C1):

```
catalog().length = 58      offered() = ["FortiEndpoint"]          (ofertados() não muda: :142 continua descartando)
set("fortiedr","include")  → aceito · isOperatorChoice = true · published() = ["FortiEndpoint","fortiedr"]
TELA  = [FortiEndpoint]    PAPEL = [FortiEndpoint]                 ← "fortiedr" PUBLICADO e INVISÍVEL
export reportCuration = {"decisions":{"fortiedr":"include"}}        S4-S5: nenhum banido presente
editor "Acrescentar" = 57 itens; homônimos lado a lado: "FortiAnalyzer" e "fortianalyzer" (cru, "Sem categoria")
set("fortianalyzer","include") + set("FortiAnalyzer","exclude") → published() tem fortianalyzer; TELA sem Analyzer
import do mesmo arquivo numa janela sem o alargamento → "Curadoria inválida: decisions: id fora do catálogo: fortiedr"
```

Leitura, por camada:

1. **Contrato `published() ↔ tela`** quebra: `acrescimos()` `:577` descarta id sem `PRODUCTS`; `cardAcrescentado` devolve `null`. O estado diz "publicado", a tela e o papel não. Hoje nenhum gate compara `published()` com os cards (PAR1 compara tela×papel) — a divergência seria **silenciosa**, a classe do `EA-76`.
2. **Identidade dupla**: o mesmo produto com duas chaves válidas e decisões **contraditórias** simultâneas, que o schema não consegue proibir. É exatamente o que a Auditoria §6.4 veta (*"uma única identidade por oferta"*, *"não usar nome como chave"*).
3. **Inversão semântica da proveniência**: `ofertados()` segue traduzindo por nome, então `fortiedr` — o candidato que o **motor** escolheu em C1 — nunca entra em `offered()`; curá-lo vira `isOperatorChoice = true` e o card nasceria com *"Incluído por decisão do engenheiro — não derivado da avaliação"*. O rótulo da C4 da 019 passaria a mentir no caso central da 026.
4. **Editor**: 57 linhas em "Acrescentar", ids crus (`nomeDe :74` cai no id), grupo *"Sem categoria"* para todos (`PORTFOLIO` por Camada 1). `D019-SOL2` não reprova (listar em `nao-classificado` é permitido), mas o produto fica inutilizável.
5. **Gates**: por contagem, nada cai hoje — `catalog()[0]` continua `"FortiAnalyzer"` e `catalog() − offered()` continua devolvendo uma chave da Camada 1 porque `PRODUCTS` vem primeiro no `concat` (sorte de ordenação, não propriedade). `D019-CARD1 (b)` ("todo card acrescentado tem ícone") e `D019-PROV1 (a)` ("o incluído chegou à tela") cairiam no dia em que a fixture escolhesse um id do motor. `D019-INV8` e `D025-VAL2` continuam verdes (`"ProdutoQueNaoExiste"` segue fora).
6. **Schema/doc**: `SESSION_SCHEMA_V32.md:447-448` (*"id de produto fora do catálogo"*) passaria a descrever outro catálogo — nenhuma regex do `D025-DOC1` pina essa frase, logo a doc ficaria **errada sem máquina acusar** (R12). §6 continua declarando "compatível" (mesmo engine) para um arquivo que a release anterior **recusa** na validação — recusa nomeada, não silenciosa, mas é mudança de contrato do schema v1 sem bump.
7. **Constraint nova**: `hasReservedDerived` (`:150-155`) varre as chaves de `decisions`; ids do motor passam a estar sujeitos ao `RESERVED_DERIVED` (`:34-37`). Nenhum colide hoje.
8. **Ícone**: `corpoDoCatalogo` usa `productIcon(id)` (`ICONS` por Camada 1) → id do motor cai em `fallbackIcon`; a V3.2 tem **outro** mapa, `ICON_MAP_V32` (`ui_icons_v32.js:3`, lido em `ui_v32.js:584`) — segunda fonte de ícone, a lição do `EA-67`/`D019-M14`.

Custo para fazer (2) **direito** (não só alargar a lista): reescrever `ofertados()` por id do motor; traduzir toda a sessão existente (`"FortiAnalyzer"` → `"fortianalyzer"`) com compat na validação — **duas grafias por estado**, o contrário do P1 da 025; `idDoNome`/`PORTFOLIO`/`acrescimos`/`cardAcrescentado`/`corpoDoCatalogo`/`nomeDe` lendo de `OFFERINGS` (que não tem `d` de descrição); 5 suítes com lookup `PRODUCTS[id].n`; schema §9 + exemplo publicado; 3 módulos de donos distintos (R9 §5: curadoria do core-engineer, apoio e editor do ui-engineer). É a rota mais cara e a que mais contradiz o que já está selado.

## 3 · Alternativa: chave da Camada 1 quando existe; id do motor só para item sem par — custo

Regra: `catalogo() = keys(PRODUCTS) ∪ { id ∈ OFFERINGS∪SERVICES : nenhum PRODUCTS[k].n === name }`, com o mesmo pareamento de `:132-141`.

O que ela compra: `fortiedr`, `fortindr-onprem`, `fortisiem-cloud`, `fortindr-cloud`, `fortisoc` ficam curáveis sob o id próprio.

Custo:

1. **O conjunto "sem par" é grande demais e precisa de critério** (R12: critério, não lista): sem filtro entram `fortigate` (`never-direct`), `forticlient` (componente), 5 famílias, 14 serviços de assessment. Critério estático possível: `entityType ∈ {offering, variant}` e `recommendationPolicy ≠ never-direct`, ∪ `SERVICES` com `engagementModel: subscription` — mas isso é **política de catálogo** nova, e o catálogo é `frozen`; a regra moraria na curadoria, longe do dado que descreve.
2. **Chave mista no mesmo arquivo**: `{"FortiEndpoint":"exclude","fortiedr":"include"}`. Duas convenções de nome num enum só; a doc do schema teria de explicar a regra de pareamento por **nome exibido** — que é precisamente o que a auditoria pede para **não** ser chave de negócio. Deriva de `PRODUCTS.n` ou de `OFFERINGS.name` (ambos congelados, mas `name` já divergiu: `"FortiNDR (On-Premises)"` vs `"FortiNDR"`) troca a chave de um item **sem que nada acuse**.
3. **Card e ícone para o sem-par**: `cardAcrescentado`/`corpoDoCatalogo` precisam de segunda fonte (`OFFERINGS[id].name/url`, sem descrição; `ICON_MAP_V32`); `PORTFOLIO` precisa de regra por família (`OFFERINGS[id].family → grupo`, 5 entradas) — tudo em `ui_p52_support_v32.js`.
4. **Regressão de supressão** (medida em §5): um arquivo com `"FortiEndpoint":"exclude"` deixa de suprimir o card de endpoint quando o motor, coerente, passa a ofertar `fortiedr` — o excluído **reaparece** com outro nome. Para (3) funcionar, a supressão teria de ser por família, o que já é a alternativa (4).
5. **Gates**: fixtures `[0]`/`semL` sobrevivem; novos gates para "item sem par: set, card, grupo, ícone, papel"; `D019-SOL1` reancorado (obrigatório na 026 de qualquer forma). Mutantes: âncoras `:157/:164/:219/:227/:254-257` intactas se `valido` só trocar `catalogo()`.
6. **Schema**: §9 ganha a definição da chave curável; §6 inalterado; exemplo inalterado; arquivos antigos continuam válidos; arquivos novos com id do motor são recusados pela release anterior com mensagem.

Veredito: custo **médio-alto**, concentrado em dois módulos de donos diferentes e numa regra de pareamento por nome que a auditoria recusa como identidade. Não é a rota mais barata.

## 4 · Alternativa: curadoria por chave da Camada 1; a VARIANTE é atributo do card — custo e alcance

Regra: o item curável continua sendo a **linha de produto** da Camada 1; o motor resolve a variante
(`fortiedr`, `fortisiem-cloud`, `fortindr-onprem`) e ela viaja como **atributo derivado** do card
(`data-p53-sol-item-id`, `data-p53-sol-variante`), nunca para a sessão.

Pareamento `itemId → chave Camada 1`, por **critério** em um helper só (R9 §8), exposto pelo bridge:

1. nome igual (`OFFERINGS[id].name === PRODUCTS[k].n`) — cobre 9 offerings + 2 services;
2. senão, cadeia `variantOf` até achar par: `fortisiem-cloud → fortisiem → "FortiSIEM"`; `fortindr-onprem/-cloud → ndr-family → "FortiNDR"`;
3. senão, família com representante declarado: `endpoint-family → "FortiEndpoint"` (cobre `fortiedr`; `fortixdr` já pareia por nome em 1);
4. senão, **não curável** — e hoje já não é.

Custo:

- `ui_curation_v32.js`: `ofertados()` passa a derivar de `buildRecommendationContext()` (candidatos + serviços) com o helper acima, no lugar do laço `MAP` (`:101-109`) e da tradução por nome (`:132-142`). `catalogo()`, `valido()`, `validar()`, `daSessao()`, `paraSessao()`: **zero linha**. Mutantes `:157/:164/:219/:227/:254-257`: intactos.
- `ui_session_v32.js`, `SESSION_SCHEMA_V32.md`, `exemplo-completo.json`, `tests_session_m48.js`, `tests_025_*`: **zero linha** (uma frase opcional no §9 dizendo que a chave é a linha de produto).
- `ui_p52_support_v32.js`: `ofertaDoMotor()` consome a mesma derivação (fecha o `EA-76`) e grava variante/tier/origem/escopo nos atributos; `papelHTML()` copia os atributos novos (resolve o `QS-02`). `PORTFOLIO` inalterado (chave Camada 1). Ícone: `productIcon(chaveCamada1)` continua válido; se a variante quiser ícone próprio, `ICON_MAP_V32[itemId]` já existe.
- `ui_curation_edit_v32.js`: zero ou uma linha (mostrar a variante resolvida como subtítulo, lida do bridge, nunca do DOM — R9 §3).
- Gates: `D019-SOL1` reancorado (obrigatório); gates novos C1–C4/C6/C7/C10 medindo `itemId` resolvido nos atributos de tela e papel.

O que o operador consegue excluir/incluir:

| item | curável? | o que a exclusão faz |
|---|---|---|
| endpoint (`fortiendpoint` **ou** `fortiedr`) | sim, como `"FortiEndpoint"` | retira o card qualquer que seja a variante que o motor resolveu — a supressão **sobrevive** à correção da 026 (ao contrário de (2)/(3)) |
| `fortixdr` (extensão contextual, C7) | sim, `"FortiXDR"` | retira só a extensão |
| SIEM (`fortisiem` + `fortisiem-cloud`, C10) | sim, `"FortiSIEM"` | retira as duas variantes juntas — não dá para excluir só a Cloud |
| NDR (`fortindr-onprem`/`-cloud`, C6) | sim, `"FortiNDR"` | idem |
| `fortiguard-socaas`, `fortiguard-mdr` (C7) | sim, `"SOCaaS"`, `"FortiGuard-MDR-Service"` | já pareiam por nome |
| `fortidlp` (C9) | sim, `"FortiDLP"` | já funciona hoje |
| `fortisoc` (C3, plataforma declarada) | **não** | o motor não o oferece como aquisição; em C3 a saída correta é "capacidade coberta / operacionalizar", sem card — nada a curar |
| `fortiaigate`, `fortisat`, `fortipam`, `fortiauthenticator`, `fortimail*` (por sinal) | **não** (status quo: `:142` já os descarta; a tela os publica incuráveis via `decisaoDe` nulo `:139`) | limitação a **declarar**; sair dela é Porta B (`PRODUCTS`) ou a alternativa (3) restrita a esse grupo, numa demanda própria |
| 14 serviços de assessment/IR | **não** (status quo) | idem |

Perda deliberada: não se cura **a variante**, só a presença da linha de produto. É coerente com a fronteira da 019
(*"o operador escolhe entre o que o motor ofereceu; nunca escreve o que o motor deveria ter dito"*,
`ui_curation_v32.js:9-10`): trocar FortiEDR por FortiEndpoint contra a arquitetura declarada seria
exatamente redigir a decisão do motor.

## 5 · `escolhaDoOperador` / `inclusoesSemLastro` / `acrescimos()` quando a oferta muda

Medido no produto de hoje (`probe-identidade.js` §(5), `probe-identidade-2.js`; sessão C5, oferta mudada
por resposta `logs` 1→2, sem código novo):

| estado declarado | a oferta… | resultado medido |
|---|---|---|
| `include` sobre ofertado | **sai** | `isOperatorChoice → true`; `unsupported() = ["FortiAnalyzer"]`; card vira **acrescentado**: `[PROV]`, `caps=0`, `tier=null`, montado do catálogo; papel idem; editor avisa *"não é oferecido pela avaliação atual"* (`ui_curation_edit_v32.js:133-144`) |
| `include` sobre ofertado | **volta** | rótulo some, caps voltam (`isOperatorChoice → false`) |
| `exclude` sobre ofertado | **sai** | decisão fica **inerte** no estado e **no export** (`{"FortiAnalyzer":"exclude"}`), fora de `suppressed`, invisível no editor (aparece desmarcado em "Acrescentar", indistinguível de "sem decisão"); só some marcando e desmarcando (`unset`, estado `{}`) |
| `include` sem lastro (FortiDeceptor) | qualquer | sempre `[PROV]`, `caps=0`, sinalizado (`data-p53-cur-sem-lastro`) |
| `set("fortiedr"/"fortindr-onprem"/"fortiguard-socaas", …)` | — | `"curadoria: id fora do catálogo: <id>"`; `validate` idem |

Consequências para a 026, independentes da rota:

- A correção **encolhe** a oferta nos cenários C2/C3/C4 (FortiEndpoint, FortiSOAR, FortiSIEM/FortiAnalyzer saem). Todo arquivo de sessão com `"<produto>":"include"` sobre esses itens passa a publicá-los com o selo *"Incluído por decisão do engenheiro"* — para uma confirmação feita antes da correção. Exposição real é pequena: desde a 025 o editor escreve só a divergência (`ui_curation_edit_v32.js:87-92`, toggle-back → `unset`), logo `include` sobre ofertado só nasce de arquivo pré-025 ou de bridge/teste. Vale uma linha no relatório da 026, não código.
- `exclude` obsoleto é resíduo de entrada, não derivado: INV-8 não é ferida. Mas o arquivo carrega decisão sem sujeito; a regra de **manter e sinalizar** (`:187-193`) só cobre `include`. Candidato a achado de backlog, não a bloqueio.
- `acrescimos()` (`:570-583`) é por chave da Camada 1 e **descarta em silêncio** o que não está em `PRODUCTS` (`:577`). Nas rotas (2)/(3) isso é o ponto de quebra `published() ≠ tela`; na rota (4) é irrelevante, porque a chave nunca sai da Camada 1.
- Supressão **sobrevive** só na rota (4): `"FortiEndpoint":"exclude"` continua retirando o card quando o motor passa a resolver `fortiedr`. Em (2)/(3) o excluído reaparece como `FortiEDR` sem que nenhuma máquina acuse.

## 6 · Recomendação — rota mais barata que preserva INV-8 e a importação substitutiva da 025

**Rota (4)**: chave curável = linha de produto da Camada 1; variante, tier, origem e escopo são **derivados**
que vivem nos atributos do card e no papel, nunca na sessão.

Por quê:

1. **INV-8 intacta por construção**: `decisions` continua `{ id Camada 1 → include|exclude }`; `validar`/`paraSessao`/`daSessao`/`captureCanonicalInputs`/snapshot/commit/rollback não mudam (`ui_curation_v32.js:199-263`, `ui_session_v32.js:69-77, :239-244, :548, :619-637`). `S4-S5`, `S50`, `S69`, `D025-*` (16) e `D019-INV8` continuam medindo o mesmo objeto.
2. **Importação substitutiva da 025 intacta**: `fromSession` não é tocado; arquivos existentes (inclusive `exemplo-completo.json`) seguem válidos e com o **mesmo significado** — a supressão declarada sobrevive à correção da oferta (§5), o que (2) e (3) não garantem.
3. **Uma identidade por oferta** (Auditoria §6.4) sem Porta B: a identidade estável que a auditoria pede fica no **id do motor** como derivado (`data-p53-sol-item-id`), e a chave de sessão fica na Camada 1 — que já é a única com descrição, ícone e grupo. Nenhuma chave nova no arquivo, nenhuma grafia dupla.
4. **Mata o `EA-76`** pela rota já apontada lá: a derivação "o que o motor ofereceu" passa a existir **uma** vez, em `ui_curation_v32.js` (owner do estado, core-engineer), consumida por `ofertaDoMotor()` via bridge. Resolve o `:142` (item do motor sem par deixava de ser ofertado) com critério, não com lista.
5. **Menor superfície**: 2 módulos de produto (`ui_curation_v32.js` — `ofertados()` + helper de pareamento; `ui_p52_support_v32.js` — consumir a derivação, gravar/imprimir qualificadores), 0 linha em sessão/schema/editor-estado, âncoras de mutante preservadas. Verificação proporcional (memória: *rota mais barata sempre*; *projeto interno, menos cerimônia*).

Residual a declarar na 026 (não a resolver nela):

- Itens sem chave na Camada 1 e sem representante de família (`fortisoc`, `fortiaigate`, `fortisat`, `fortipam`, `fortiauthenticator`, `fortimail*`, serviços de assessment/IR) continuam **publicáveis e incuráveis** — exatamente como hoje (`:142`, `:139`). Registrar como limitação; a saída é Porta B em `PRODUCTS` ou a alternativa (3) **restrita** a esse grupo, em demanda própria.
- `exclude` obsoleto permanece no arquivo sem sujeito (§5) — achado de backlog, com cadeia `ui_curation_v32.js:170-179 → :312`.
- Qualquer id novo que um dia entre em `decisions` (rotas 2/3) fica sujeito a `RESERVED_DERIVED` (`ui_session_v32.js:34-37`) — constraint de nomenclatura do motor, a registrar no schema se essa porta se abrir.

Dependências para outros agentes: `tech-lead` (contrato do item ofertado no bridge: `{ key, itemId, name, variant, tier, origin, scopeNote, signals, services }` e quem é dono da derivação única — a proposta acima coloca em `__CURATION`); `qa-engineer` (reancorar `D019-SOL1` fora do `MAP`; gates C1–C4/C6/C7/C10 por `itemId` nos atributos; gate `published() ≡ tela`); `product-owner` (ratificar que a curadoria é por linha de produto e que variante não é curável; limitação dos sem-par).
