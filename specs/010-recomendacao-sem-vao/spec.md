# Spec — 010-recomendacao-sem-vao

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Eliminar o **vão de contexto parcial**: o relatório não pode ter estado em que
declarar contexto **subtrai** conteúdo, nem afirmar que preserva uma leitura que
ele mesmo oculta. A arbitragem de camada passa a perguntar *"há substituto?"*, o
card de prática-alvo passa a nomear **habilitador a validar** a partir do catálogo
congelado, e a leitura base sem contexto vira **bloco de ausência**.
Link: [refinement.md](refinement.md) — enquadramento, cadeia arquivo:linha→efeito
(A1–A6), rotas V1–V6 e casos de borda C1–C18 são vinculantes e **não** são
repetidos aqui. Vocabulário obrigatório em [CONTEXT.md](../../CONTEXT.md)
(verbetes *Habilitador*, *Habilitador a validar*, *Vão de contexto parcial*,
*Arbitragem de camada*, *Convergência no card*, *Bloco de ausência*).

## Autorização nominal §29.4 — registro (consumada)

**Trilha de auditoria.** `ui_v32.js` e `ui_target_v32.js` são protegidos por
`specs/PHASE_5_0_REV_B.md:1616` e pinados por quatro gates vivos (abaixo). A
autorização da 009 é explicitamente intransferível (`tests_p50_core.js:137-139`),
e o `refinement.md` parou nesse ponto (P11, ESCALAR).

| Campo | Registro |
|---|---|
| **O que foi autorizado** | Edição, **exclusivamente no escopo da demanda 010**, de `ui_v32.js` e `ui_target_v32.js` |
| **Quem autorizou** | O proprietário |
| **Quando** | 2026-08-30 |
| **Onde** | No chat, em resposta à escalação P11 do refinamento |
| **Precedente do rito** | As autorizações nominais já registradas no mapa `PROTECTED` (`tests_p50_core.js:82-141`), com trilha e "Identidade anterior" |
| **Consequência de identidade (R8)** | Os hashes inline de `PROTECTED` são repinados **depois** de os dois arquivos alcançarem o estado final, citando esta seção; o mapa é consumido por **quatro** gates: `P50-GOV1` (`tests_p50_core.js:397`), `P50-SUF0` (`:1314`), `P50-SUF8` (`:1965`) e `P50-IC4` (`:2707`, alínea (a), que pina `ui_v32.js`). O registry `.claude/verify/pins.json` é regenerado por `gen_pins.py` em **commit separado**, porque ele pina blobs de `HEAD` |

Esta autorização **não** amplia a boundary para outras demandas nem para outros
arquivos. **Qualquer outro arquivo da §29.4 exige nova frase do proprietário** — e
o desenho abaixo foi escolhido, entre as rotas possíveis, justamente por não
precisar de nenhum: nenhuma suíte congelada muda de asserção, nenhum CSS novo
nasce, e `ui_p52_workspace_v32.js` não é tocado.

## Restrições de desenho — o que torna esta rota livre de nova ratificação

Cada restrição abaixo existe porque a alternativa exigiria autorização nova ou
enfraqueceria gate alheio (R10 §1). Elas são vinculantes para o plano.

| # | Restrição | Por quê |
|---|---|---|
| **R-1** | `tgtEnablerState()` e `tgtAbsenceHTML()` (`ui_target_v32.js:199-248`) permanecem **byte-idênticos**, e o habilitador a validar **nunca** é emitido com a classe `.ux-tgt-en` | O oráculo da 009 deriva S1–S4 do payload do engine (`fixtures_009_leitura.js:110-125`), não do DOM. Preservando o estado e a classe, `D009-UNS1/UNS2/UNS3/UNS4/ABS1` continuam verdes **sem editar `tests_009_leitura.js`** — e os critérios C10/C14 da 009, ratificados pelo proprietário em 2026-08-27, não são reabertos |
| **R-2** | **Zero CSS novo.** Toda apresentação reusa classes já existentes (`.ux-tgt-en*`, `.ux-mut`, `.pr-mut`, `.v32-block`, `.v32-neutral`, `.section-title`/`.eyebrow`) | `ui_v32.css` e `ui_ux_v32.css` são §29.4 e **não** estão autorizados |
| **R-3** | Nenhum `window.__*` novo. A tabela de equivalência e o predicado de arbitragem são expostos **só** por `window.__DEV` (superfície de teste já registrada em `bridges.json`), pelo padrão que `ui_target_v32.js:378-381` já usa | Bridge novo exigiria entrada em `bridges.json` (R9 §2); `__V32UI` não pode crescer sem risco ao regex de `P50-IC4` (`tests_p50_core.js:2710`) |
| **R-4** | `ui_p52_workspace_v32.js` **não é tocado** | `P52-REC1` (`tests_p52_layout.js:538-539`) reprova qualquer `/Forti[A-Z]/` no owner de layout. O habilitador vive no card (`ui_target_v32.js`) e a arbitragem em `ui_v32.js` |
| **R-5** | `HIDE_EYEBROWS` (`ui_v32.js:109-110`) e a **regra** de varredura de `hideLegacyRecommendation` (`:164-194`) permanecem byte-idênticas: muda **só** o valor do argumento `hide` | `U15` (`tests_ui_m31.js:268`) mede o alcance da varredura; ampliar ou reduzir o alcance é outra demanda |
| **R-6** | `engine_v32.js` e `quickscan_secops_soccmm_v3_1_3.html` são **lidos**, nunca escritos | `frozen` em `boundary.json:9-14`; V6 recusada no portão |

## Errata de vacuidade — medida na Wave 1 (2026-08-30)

**Trilha de auditoria.** O `qa-engineer` provou as quatro fixtures **por execução**
na Wave 1 e mediu **quatro vacuidades**: alíneas que fechariam verdes sem medir
nada. Nenhuma é erro de implementação — não há implementação ainda. O que muda
aqui é **texto e fixture**, antes de o gate nascer: um gate que não pode falhar é
o que a demanda 013 passou inteira combatendo, e aqui dá para evitar de graça.
Três correções de fato sobre o source entram junto.

| Campo | Registro |
|---|---|
| **Quem decidiu** | O interlocutor, **sob a delegação do proprietário registrada em 2026-08-29**. **Não** ratificado pelo proprietário pessoalmente |
| **Quando** | 2026-08-30 |
| **Onde** | No chat, na devolutiva da Wave 1 — medição do `qa-engineer` sobre `fixtures_010_vao.js` |
| **Alcance** | Redação de **C6**, **C7**, **C8**, **C9**, **C10** e **C12**; a linha **D010-F3** e a linha **nova D010-F4** da tabela de fixtures; os §1 e §4 de "Comportamento especificado"; três mutantes novos (**M18**, **M19**, **M20**) sobre gates que já existem; e, na rodada 3, o **contrato do `d010AssertFixtureStates`** (E10) e a definição de **"publicar"** (E11). Nenhum gate nasce ou morre, nenhum id `D010-*` muda, nenhuma contagem de suíte congelada é afetada. `D010-F1`, `F1b` e `F2` permanecem byte-idênticas **no estado que aplicam** — a emenda de E10 é no helper de verificação, não no vetor, e não move censo nenhum |
| **O que NÃO é reaberto** | A seção "Autorização nominal §29.4 — registro (consumada)" permanece **exatamente** como está: nominal, restrita aos dois arquivos e a esta demanda. Nenhum critério `D009-*` é tocado — R-1 continua dura |
| **Por que não exige ratificação nova** | Nenhum item abaixo enfraquece asserção (R10 §1), amplia boundary ou muda veredito de gate alheio: os quatro remédios **fortalecem** o que os gates medem, e o estado novo que eles exigem vive em `fixtures_010_vao.js`, arquivo desta demanda |
| **Rodada 3 (mesmo dia, depois do red `4d2d49d`)** | O vermelho fechou **1 PASS · 12 FAIL de 13** — `D010-ARB2` nasceu verde, como critério de preservação; `D010-ARB3`(c) e `D010-CARD3` nasceram **vermelhos**, contra o meu palpite, e a medição do relatório prevalece sobre ele. O `qa-engineer` escalou dois bloqueios do green e um verde falso que ele mesmo fechou: viraram **E10** e **E11**. Ele **não** aplicou o remédio antes de perguntar, e agiu certo: fazê-lo hoje moveria os 12 FAIL do critério para o assert da fixture e destruiria o vermelho informativo |
| **Rodada 2 (mesmo dia)** | O remédio de fixture de **E3**/**E4** foi entregue pelo `qa-engineer` como **fixture nova `D010-F4`**, não como emenda de `D010-F2`, e a decisão foi tomada com medição: as duas respostas em nível 0 movem o vetor e, com ele, os censos (em `D010-F1`, `basePresented` 4 → 6 e `baseInV32Base` 2 → 4). Fixture nova custa uma linha de tabela; emendar `F2` custaria recalcular censo e reabrir asserção que já passa. **A errata acompanha `F4`.** A emenda de **E5** continua em `D010-F3`, pelo motivo escrito lá |

### E1 · A cláusula A5 do predicado não é load-bearing — fica, e sem mutante

| Campo | Registro |
|---|---|
| **O que estava escrito** | §1, terceiro bullet: a cláusula "classificação ≠ `CONTEXT_NOT_INFORMED`" existe porque serviços são anexados fora do `switch`, só por `hasGap` (achado A5) — "sem ela, um serviço sob `UNSET` desligaria a Camada 1 sem substituir nada" |
| **Fato medido** | Sonda de variantes do predicado (completo × sem-A5 × sem-payload × só-apresentação) sobre **6 sessões**, incluindo 15×0 e 15×1: **completo e sem-A5 devolvem o mesmo valor nas seis**. A cadeia explica por quê: `CONTEXT_NOT_INFORMED` ⇒ `supportMode = "LEGACY-LABELLED"` (`engine_v32.js:601-602`), e `presentationOf` (`ui_v32.js:624-634`) só promove a `card` o `VALIDATE` e o `DIRECT`/`CONTEXTUAL` **com** payload — `LEGACY-LABELLED` nunca. A capability com serviço sob `UNSET` cai em `base`/`maturity`, jamais em `card`: **a primeira conjunção do predicado já a exclui**. O **resultado** do desenho (`false`) estava certo; a **atribuição causal** estava errada. **Reconfirmado sobre `D010-F4`**: as **6** capabilities `CONTEXT_NOT_INFORMED` daquela sessão — inclusive as duas novas, **com serviço anexado** — têm **zero** apresentação `card` |
| **O que passa a valer** | A cláusula **permanece escrita e implementada** — é inofensiva e defende contra mudança futura no engine: se algum dia `presentationOf` promover `LEGACY-LABELLED`, é ela que impede um serviço sob `UNSET` de desligar a Camada 1 sem substituir nada. O texto para de lhe atribuir peso que ela não tem. Quem carrega peso hoje é a cláusula **"candidato/serviço/nota"**, e quem a torna load-bearing é a **fixture de gate fechado** (`D010-F3`: cards `VALIDATE` com payload vazio) |
| **Consequência para a campanha** | **Nenhum mutante desta demanda tem a cláusula A5 por alvo**, e o motivo fica escrito: removê-la é **equivalente por construção** — nenhum mutante que a remova pode morrer. A matriz registra o par como **equivalente declarado**, nunca como par vazio na coluna de mutantes. `M1` (predicado inteiro) e `M2` (supressão) continuam intactos e morrem |
| **Classe** | Atribuição causal errada em texto cujo resultado está certo; cláusula defensiva declarada como defensiva |

### E2 · "S2" tem duas leituras, e elas medem coisas diferentes

| Campo | Registro |
|---|---|
| **O que estava escrito** | C7 exige "prática-alvo em **S2** (contexto não declarado, landscape aplicável)"; C8(b) exige prática "cuja capability tem **apenas serviços** (nenhum candidato) e está em **S2**"; C12(a) fala do "mesmo conjunto que `D009-UNS1` mede" |
| **Fato medido** | `tgtEnablerState(qid, nItems)` (`ui_target_v32.js:199-208`) devolve **S1 assim que `nItems > 0`**, e serviço do engine **é** item (`tgtEnablersHTML`, `:253-255`). Sob essa leitura, capability **com serviço** é S1 e nunca S2 — e C8(b) ("apenas serviços … e está em S2") seria **impossível de satisfazer**: a mesma prática teria de estar em dois estados. É a mesma classe de contradição interna que a errata da 009 desfez em E1 |
| **O que passa a valer** | Dois nomes, e cada lugar da spec usa o certo. **S2-payload**: `tgtEnablerState(qid, nItems)` com o payload real — zero candidatos **e** zero serviços, capability única, `landscapeEnabled === true`, `presence === "UNSET"`. É o que decide o **aviso único** da 009 e o que `D009-UNS1`/`UNS3` medem (`tests_009_leitura.js:664-671`: o aviso nomeia S2 e **não** nomeia S1/S3/S4). **S2-contexto**: o predicado de contexto isolado, isto é `tgtEnablerState(qid, 0)` — capability única, `landscapeEnabled === true` e `presence === "UNSET"`, **independente do payload**. É a condição do **habilitador a validar** |
| **Relação entre os dois** | `S2-payload ⊂ S2-contexto`. A diferença é exatamente a prática que já exibe `.ux-tgt-en` por serviço do engine — e é ela que dá caso a C8(b) e a C10(c) |
| **Consequência de desenho** | O nó a validar **pode nascer no mesmo card que já traz a linha `.ux-tgt-en`**. Não fere R-1 (o nó é irmão, nunca a classe), não contradiz o aviso único (que continua nomeando só S2-payload) e é a leitura que C8 e C10 sempre pressupuseram |
| **Classe** | Um nome para dois predicados; sem a distinção o gate mede outra coisa |

### E3 · C8(b) não tinha caso — `D010-F4` traz o alvo em `vulnerability-management`

| Campo | Registro |
|---|---|
| **O que estava escrito** | C8(b), sobre `D010-F2`: "prática cuja capability tem **apenas serviços** (nenhum candidato) e está em S2 continua recebendo o nó a validar" |
| **Fato medido** | **Nenhuma** das 5 capabilities-alvo de `D010-F2` recebe serviço por `hasGap`. Cadeia: `security-automation`, `network-detection`, `external-exposure` e `security-analytics` não têm relação em `SERVICES`; `endpoint-detection` tem `fortiguard-mdr`, **inelegível** sob landscape 100% `UNSET` (`eligibilityRequires.baseOffering`, `engine_v32.js:477-484`). A alínea passava vacuosamente |
| **O que passa a valer** | A fixture **`D010-F4`** responde `vulnerability-management` em **nível 0** e põe alvo nesse qid; `D010-F2` fica byte-idêntica, e **C8(b) passa a medir sobre `F4`** enquanto (a) continua em `F2`. A capability `vulnerability-management` (`engine_v32.js:58`, `landscapeEnabled: true`) recebe o serviço `vulnerability-assessment` (`CR("vulnerability-management","primary")`, sem `requiredSignals` e sem `eligibilityRequires` ⇒ elegível, anexado por `hasGap`), tem **zero candidatos** (sob `CONTEXT_NOT_INFORMED` o `switch` não popula `candidates`) e `MAP["vulnerability-management"].lv[0].c` com dois itens. É **S1-payload e S2-contexto**: exatamente o caso que a alínea descreve |
| **Onde o gate passa a afirmar** | C8(b) declara a pré-condição: sem prática com serviço-sem-candidato em S2-contexto, o gate é **FAIL nomeado por vacuidade**, nunca verde |
| **Classe** | Critério sem caso na fixture — remédio de fixture, não de redação |

### E4 · C10(c) não tinha caso — a colisão só existe em `monitoring-coverage`, e são duas

| Campo | Registro |
|---|---|
| **O que estava escrito** | C10(c): "em nenhum card há dois `.ux-tgt-enabler` com o mesmo `data-eid` ou o mesmo nome" — sem fixture declarada para o critério |
| **Fato medido** | A colisão `SOCaaS` **só materializa com alvo em `monitoring-coverage`**, e nenhuma fixture tinha um. Cadeia: `SERVICES["fortiguard-socaas"].name === "FortiGuard SOCaaS"` e `PRODUCTS["SOCaaS"].n === "FortiGuard SOCaaS"` (`quickscan_…:269`); `fortiguard-socaas` é `primary` de `continuous-monitoring` e elegível (sem `eligibilityRequires`); `MAP["monitoring-coverage"].lv[0].c` e `.lv[1].c` trazem `SOCaaS`. `team-capacity` também traz `SOCaaS` no `MAP`, mas sua capability é `soc-staffing` (`landscapeEnabled:false`) ⇒ S4 ⇒ nunca produz o nó; `incident-response` não tem `SOCaaS` no `MAP`. Sobra `monitoring-coverage` |
| **O que passa a valer** | **`D010-F4`** responde `monitoring-coverage` em nível 0 e põe alvo nesse qid, e **C10 declara `D010-F4` como sua fixture**. A alínea (c) nomeia o par que a torna viva: `fortiguard-socaas` (serviço do engine, na linha `.ux-tgt-en`) × `SOCaaS` (item do `MAP`, no nó a validar) — mesmo id equivalente e mesmo nome de catálogo. Sem fusão, o card mostra "FortiGuard SOCaaS" duas vezes |
| **E o que ninguém tinha visto** | O `qa-engineer` mediu que o catálogo congelado tem **exatamente dois** pares homônimos — `fortiguard-socaas ≡ SOCaaS` e `fortiguard-mdr ≡ FortiGuard-MDR-Service`, mesmo nome renderizado e ids distintos — e que **os dois vivem no mesmo `MAP["monitoring-coverage"].lv[0].c`**. Um está anexado ao card e o outro não (`fortiguard-mdr` é inelegível sob 100% `UNSET`, mesma cadeia de E3). O card de `monitoring-coverage` dá, portanto, **as duas direções da fusão no mesmo cartão**: o que tem de sumir e o que tem de sobreviver. É um caso melhor que o pedido, e é o que sustenta **E9** |
| **Onde o gate passa a afirmar** | (c) vira (c1)+(c2) e declara a pré-condição: sem card que traga as **duas** fontes ao mesmo tempo, FAIL nomeado por vacuidade |
| **Classe** | Critério sem caso na fixture — remédio de fixture, não de redação |

### E5 · C9 sob gate fechado: (b) não tinha caso e (c) não tinha prova

| Campo | Registro |
|---|---|
| **O que estava escrito** | C9(b): **zero** `[data-ux-enablers="a-validar"]` na tela e no papel sob `D010-F3`. C9(c): "o oráculo prova que **alterar `dataSufficiency`** altera o veredito do card" |
| **Fato medido** | Sob `D010-F3`, **nenhum alvo legítimo do vetor** está em S2 com `MAP` não vazio: a ausência do nó era verdadeira **por estado, não por gate**. Cadeia do vetor `P50_F2`: `mandate`=1 e `governance`=2 ⇒ `soc-governance` (`landscapeEnabled:false`) ⇒ S4; `team-capacity`=0 ⇒ `soc-staffing` ⇒ S4; `logs`=3 ⇒ `MAP["logs"].lv[3]` sem `c`; `incident-response`="NA" ⇒ cai em C7(d). Não sobra ninguém. E (c) **não tem como ser provada** como estava escrita: `dataSufficiency` (`quickscan_…:512-514`) vive no arquivo `frozen` — alterá-la é Porta B, e reimplementá-la no oráculo o tornaria equivalente por construção |
| **O que passa a valer — (b)** | `D010-F3` passa a ser **o vetor de `P50_F2` acrescido de `vulnerability-management` = 0**, com alvo nesse qid. `confirmedCount()` vai a 5 e **5 < 10 ⇒ `dataSufficiency` continua FECHADO** (`quickscan_…:494` e `:512-514`); a fixture declara e prova as duas coisas. Esse alvo satisfaz **todas** as demais condições de C7 (S2-contexto, resposta confirmada, `MAP` não vazio) e só não publica **por causa do gate**: é o caso que faltava. Sem o par, (b) é FAIL nomeado por vacuidade |
| **O que passa a valer — (c)** | A alínea deixa de afirmar o improvável e passa a medir o **diferencial declarado entre fixtures**: o mesmo par (qid, nível confirmado) — `vulnerability-management` em nível 0 — **publica** o nó sob **`D010-F4`** (gate **ABERTO**) e **não publica** sob `D010-F3` (gate **FECHADO**), com todas as demais condições de C7 idênticas nas duas. A metade aberta **migrou de `F2` para `F4`** na rodada 2, porque é `F4` que traz o par; a metade fechada continua sendo `F3`, que é a única fixture de gate fechado. As duas fixtures declaram o veredito de suficiência em `d010AssertFixtureStates`, e o oráculo consome a decisão como **dado** — mesma disciplina de E2 da errata da 009. Par ausente = FAIL nomeado. *(Trilha: a redação final da alínea (c) é a do critério **C9**, emendada em 2026-08-31 pelo `product-owner` — o que o diferencial prova é que a publicação **acompanha o gate**; a **posse** da decisão é desenho conferível no diff, e não o que o diferencial mede. Este registro permanece como foi decidido em 2026-08-30.)* |
| **Por que a emenda fica em `D010-F3`, e não vira fixture nova** | A razão que blindou `F1`/`F2` na rodada 2 — censo de critério pendurado nelas — **não** vale para `F3`: dela só pendem `D010-ARB3`(c), cujo censo é da **Camada 1** (não muda por card V3.2 novo), e `D010-CARD3`. O acréscimo é medido e contido: `confirmedCount()` 4 → 5 com o gate **ainda FECHADO** (`5 < 10`), uma capability a mais em apresentação `base` (`CONTEXT_NOT_INFORMED` + serviço) e **zero** cards novos ⇒ "há substituto" continua `false`. Uma `F5` só para carregar um alvo custaria mais que a emenda, e `F3` nasceu nesta demanda (W1) — não é fixture herdada. Se a medição do `qa-engineer` mostrar efeito fora disso, **parar e reportar**, nunca ajustar o gate |
| **Classe** | (b) critério verdadeiro por estado e não por gate; (c) critério que afirmava o que não podia provar |

### E6 · `#v32base` não é o conjunto de apresentação `base`

| Campo | Registro |
|---|---|
| **O que estava escrito** | C6(b): o aviso nomeia "**exatamente** o conjunto de capabilities cuja apresentação é `base` no mesmo render" |
| **Fato medido** | Sob `D010-F1` — que a errata mantém **byte-idêntica**, e é justamente por isso que `D010-F4` nasceu em vez de emendá-la — são **4** capabilities com apresentação `base` e só **2** dentro de `#v32base`. Cadeia: `buildSupportHTML` monta `prioCaps` primeiro e define `rest` como o complemento (`ui_v32.js:655-658`); `baseIds` filtra **`rest`**, não o render inteiro (`:669`) — capability de prioridade com apresentação `base` é desviada para `#v32prio`, onde continua sendo `baseCardHTML` (`renderCap`, `:644-647`). O papel repete a mesma construção (`:1175`, `:1182`) |
| **O que passa a valer** | O conjunto nomeado pelo aviso é **`baseIds`** — apresentação `base` **e** fora de `prioCaps` —, na tela e no papel. Nomear as capabilities de prioridade seria declarar "contexto não informado" sobre cards que a mesma tela exibe duas seções acima, com contagem errada no mesmo parágrafo. É coerente com o §2, que já mandava não tocar `#v32prio` |
| **E a contagem** | Nenhum número entra na prosa do critério (R10 §3): o oráculo deriva `baseIds` de `V32.buildRecommendationContext()` mais a mesma partição de prioridades, nunca do DOM. `baseIds` vazio ⇒ o bloco não nasce e o gate declara vacuidade em vez de passar |
| **Classe** | A spec nomeava um conjunto pelo id do bloco que o exibe, e os dois não coincidem |

### E7 · `MAP`, `PRODUCTS`, `QS` e `ans` não existem em `window`

| Campo | Registro |
|---|---|
| **O que estava escrito** | C7(a) e C8(a) comparam contra `MAP[qid].lv[ans[k]].c`; C10(a) exige totalidade sobre "as 11 chaves distintas de `c.p` do `MAP`" — sem dizer por onde o oráculo chega ao `MAP` |
| **Fato medido** | `w.MAP` é `undefined`. `PRODUCTS` (`quickscan_…:262`), `QS` (`:296`), `MAP` (`:420`) e `ans` (`:475`) são `const` de **topo de script clássico**: vivem no escopo de script, que não é propriedade do objeto global. O acesso foi isolado na Wave 1 dentro de `fixtures_010_vao.js`, **sem criar bridge** |
| **O que passa a valer** | Todo oráculo desta suíte consome os quatro pelos **helpers declarados na fixture** — nunca por `w.MAP`, nunca por leitura do DOM. Onde a spec escreve `MAP`, `PRODUCTS`, `QS` ou `ans` como fonte de comparação, leia-se "pelo helper da fixture". Os nomes, expostos na rodada 2: **`d010MapKeys(w)`** para as chaves de produto do `MAP`, e **`d010EquivalenciaNome`** para a equivalência de nome, **re-derivada do catálogo congelado** e nunca escrita à mão no oráculo — é o que lhe dá poder discriminante, pelo mesmo motivo de E2 da errata da 009 |
| **Por que a rota não é reaberta** | Expor `MAP` em `window.__DEV` — ou em qualquer `window.__*` — exigiria editar `quickscan_secops_soccmm_v3_1_3.html`, que é `frozen` (`boundary.json:9-14`, R-6): Porta B, PARADA, ratificação que ninguém deu. **R-3 continua valendo por inteiro**, e é proibido crescer `__DEV` com o catálogo congelado para encurtar o oráculo |
| **Classe** | Correção de fato sobre o runtime; a rota escolhida é a que não pede autorização |

### E8 · Contagem em prosa: são 10, não 12 — e por que ela sai da prosa

| Campo | Registro |
|---|---|
| **O que estava escrito** | Sob `D010-F3`, "os **12** cards `NEEDS_VALIDATION`/`VALIDATE`" com payload vazio — afirmação que vive em `plan.md:401`, não nesta spec |
| **Fato medido** | São **10**, medidos por execução na Wave 1 |
| **O que passa a valer** | Fica escrita a **propriedade** de que o desenho depende — **todo** card `VALIDATE` do render tem 0 candidatos, 0 serviços e 0 notas, logo "há substituto" é `false` e a Camada 1 permanece visível —, não o número. Contagem pinada vive no registro canônico, nunca em prosa (R10 §3), e esta em particular muda outra vez quando `D010-F3` ganha `vulnerability-management` = 0 (E5). `D010-ARB3`(c) deriva o censo no render e a fixture declara o veredito |
| **Onde a correção foi aplicada** | `plan.md` (linha de risco de `D010-ARB3`(c) e o registro de EVIDÊNCIA da Fase 2) e `tasks.md` (T002, T019, T021) foram corrigidos **no mesmo dia**, na rodada 2, quando a delegação passou a incluí-los. O registro de EVIDÊNCIA da Fase 2 **não foi reescrito**: o número recebeu correção datada entre colchetes, para a trilha continuar legível |
| **Classe** | Erro de fato em prosa; o remédio estrutural é não pinar contagem em prosa |

### E9 · A fusão olha o que está anexado, não o domínio da tabela

| Campo | Registro |
|---|---|
| **O que estava escrito** | "Deduplicação por `data-eid`" — em C10(c) e no plano (§Restrições de implementação, item 2), sem dizer **contra o quê** o item do `MAP` é comparado |
| **Fato medido** | Os dois pares homônimos do catálogo vivem no **mesmo** `MAP["monitoring-coverage"].lv[0].c` (E4), e só um deles está anexado ao card. Uma implementação que remova do nó todo item do `MAP` **que tenha equivalente declarado na tabela** passa em (c1) e **apaga "FortiGuard MDR"** do relatório — perda silenciosa de conteúdo, no único lugar do produto onde ela seria invisível |
| **O que passa a valer** | A fusão é contra o **conjunto efetivamente anexado naquele card** — candidatos e serviços do engine no mesmo passe —, nunca contra o domínio da tabela de equivalência. Item do `MAP` cujo equivalente **não** está anexado **sobrevive**, com o nome do catálogo V3.2. A regra fica escrita no §4 ("Identidade"), medida por C10(c1)/(c2) e viaja no prompt de quem implementa |
| **Mutantes** | **M18** (não deduplicar) e **M19** (deduplicar pelo domínio da tabela) — as duas direções, mortas no mesmo card. São os únicos mutantes novos da errata; `M1`–`M17` seguem intactos |
| **Classe** | Requisito de implementação que faltava; o gate que o mede já existia e ganhou a segunda direção |

### E10 · O assert de fixture não vigia o produto — e a linha divisória é o diff

| Campo | Registro |
|---|---|
| **O que estava escrito** | `d010AssertFixtureStates` declara, entre outras coisas, `titulosCongelados[].oculto: true` (F1/F1b/F3/F4) e `habilitadores` por qid, conferidos por `d010TargetEnablers(d)`, que censa **todo** `.ux-tgt-enabler` dentro do `li` |
| **Fato medido** | As duas âncoras descrevem o comportamento **que esta demanda existe para mudar**: depois de V1 a Camada 1 fica **visível** nessas quatro fixtures (`oculto: false`), e os itens a-validar **são** `.ux-tgt-enabler` (`automation` sai de `[]` para `["fortisoar\|FortiSOAR\|a validar"]`). No green, o assert abortaria **antes de qualquer alínea** e converteria os 12 gates em falha de fixture. É âncora que apodrece por construção, não dado errado |
| **Decisão** | **Sai do assert o que a demanda escreve** — a segunda das três saídas, com uma condição: **nada é apenas removido**. Cada declaração **migra** para o gêmeo canônico, e quando não existir gêmeo, para a alínea do gate que já a mede. O assert de fixture existe para provar que **a fixture alcança o estado que declara** (não-vacuidade); vigiar o produto é trabalho do gate, e duplicá-lo na fixture cria um segundo oráculo, não versionado como gate, que morre no primeiro verde |
| **A linha divisória, para não virar gosto** | O assert só declara estado que **esta demanda não pode escrever**: o que é aplicado pelos owners canônicos (respostas, landscape, prioridades, alvos, contexto) e o que é derivado por `engine_v32.js`, pela Camada 1 congelada e pelo catálogo — todos `frozen` por R-6 e fora do diff. Tudo que sai de `ui_v32.js` ou `ui_target_v32.js` — **os dois arquivos que aparecem no diff desta demanda** — é objeto de gate, nunca de âncora de fixture. O critério é o diff, e por isso é verificável por quem revisa |
| **As duas migrações, item a item** | **(12) `titulosCongelados`**: mantém `texto` e **perde `oculto`**. A presença dos títulos é produzida pela Camada 1 congelada e continua sendo a guarda anti-vacuidade que o próprio comentário do item declara ("sem título presente, todo gate de arbitragem passa vacuosamente"); a **ocultação** é a saída de `ui_v32.js` e já é medida, de propósito, por `D010-ARB1`(b)/(d), `D010-ARB2`(a) e `D010-ARB3`(a)/(c). **(14) `habilitadores`**: a declaração passa a ser o **payload do engine por alvo** — **candidatos** de `V32.buildRecommendationContext()` por qid — **candidatos apenas**: os serviços já são declarados, por id e por alvo, no item 13, e duplicá-los faria a fixture ter duas fontes para o mesmo fato (**E12**) —, que é o `nItems` do discriminador S2-payload × S2-contexto de **E2** e é estável no green porque o engine é `frozen`. `d010TargetEnablers(d)` **permanece no arquivo como helper dos gates de C10**, com a guarda de agrupamento intacta; o que acaba é a comparação contra tabela declarada |
| **O que a emenda não pode fazer** | Mudar veredito do vermelho. Hoje o assert **passa** e os 12 FAIL acontecem no critério; depois da emenda tem de continuar assim. Se algum gate virar por causa dela, isso é achado — era gate que dependia do assert para falhar — e volta para decisão, não segue |
| **Por que não as outras duas saídas** | **Declarar o estado-alvo** transforma o assert num segundo oráculo do comportamento em construção e deixa a fixture vermelha por toda a janela de red: um defeito real de fixture (a vacuidade que E3/E4/E5 fecharam) ficaria indistinguível de "ainda não implementado", e o vermelho deixa de nomear o critério que falta. **Parametrizar por fase** é fixture com dois modos: o modo que não está rodando não é provado, e o assert deixa de ser fato para virar chave — mais estado, mais superfície para mentir |
| **Classe** | Contrato do helper de fixture, que a spec nunca tinha escrito; vale para toda demanda que conserte superfície observada por fixture |

### E11 · "Publicar" exige item — nó vazio não é publicação, é defeito

| Campo | Registro |
|---|---|
| **O que estava escrito** | As alíneas falam em "traz um nó `[data-ux-enablers="a-validar"]`", "≥1 habilitador a validar" e "não produz o nó", sem dizer se um nó **sem itens** conta |
| **Fato medido** | O `qa-engineer` fechou, **antes do commit do red**, um verde falso: um nó de habilitador **vazio** fazia um gate passar e teria satisfeito outras duas alíneas. Achado por sonda dele, não por revisão de texto |
| **O que passa a valer** | Definição única, válida para toda a spec: **publicar um habilitador a validar = emitir um nó `[data-ux-enablers="a-validar"]` com ao menos um `.ux-tgt-enabler` dentro**. Nó vazio **não é publicação** e não satisfaz alínea nenhuma. Nas alíneas **negativas** a exigência é mais forte e assimétrica de propósito: **nenhum nó**, vazio ou não — porque emitir nó vazio é, ele mesmo, defeito, e nenhuma superfície pode fazê-lo (§4) |
| **Por que a assimetria** | Se o positivo aceitasse nó vazio, um mutante que emitisse o contêiner sem conteúdo passaria; se o negativo só contasse itens, o mesmo mutante escaparia pelo outro lado. As duas leituras juntas fecham o par |
| **Classe** | Vocabulário de critério que admitia leitura vazia — o tipo de frouxidão que só aparece quando alguém tenta passar no gate sem fazer o trabalho |

### E12 · O item 14 declara candidatos, não candidatos + serviços

| | |
|---|---|
| **O que estava escrito** | §E10, "as duas migrações": o item 14 (`habilitadores`) passa a declarar "candidatos + serviços de `V32.buildRecommendationContext()` por qid" |
| **Fato medido** | Os serviços **já são declarados**, por id e por alvo, no **item 13** da mesma fixture. Escrever a soma no item 14 daria à fixture **duas fontes para o mesmo fato** — e fixture com duas fontes é fixture que pode discordar de si mesma, que é a forma exata do defeito que esta demanda persegue no produto |
| **O que passa a valer** | O item 14 declara **candidatos**. O `nItems` do discriminador S2-payload × S2-contexto (**E2**) continua sendo candidatos ∪ serviços, lidos de onde cada um é declarado — o item 14 para candidatos, o item 13 para serviços |
| **Classe** | Redação de spec que duplicaria declaração — corrigida na spec, **não** na fixture: a fixture nunca chegou a duplicar |

### E13 · C3 e C8 nomeavam menos fixtures do que o gate varre

| | |
|---|---|
| **O que estava escrito** | C3: "fixtures `D010-F1`, `D010-F2`, `D010-F3`. Confere, nas três". C8: "a alínea (c) vale nas duas" |
| **Fato medido** | `D010-F4` nasceu nas erratas **E3**/**E4**, depois da redação de C3, e a lista não foi estendida — a fixture não era exercitada por alínea de arbitragem alguma. E a guarda de agrupamento de `d010TargetEnablers` deixava de rodar sob `D010-F3` (2 chips, nenhum gate varrendo). Os dois foram fechados no gate **antes** do green: sob `F4` o censo é 3 nós, 3 ocultos, zero forasteiros — idêntico ao de `F1` —, e sob `F3` são 2 chips, 2 cards, zero duplicata; o veredito `1 PASS · 12 FAIL` não se moveu e as 12 razões vermelhas seguem byte-idênticas |
| **O que passa a valer** | A redação segue o gate: C3 varre as **quatro**; C8(c) vale nas **três**. Onde gate e prosa divergirem, o gate é o estrito e a prosa é emendada — nunca o contrário (R10 §1) |
| **Classe** | Spec desatualizada por errata anterior — a lista de fixtures não acompanhou a fixture que a própria errata criou |

### E14 · O alcance da equivalência — a tabela permanece `chave → id`, e a razão é medida

| | |
|---|---|
| **O que estava em aberto** | A tabela de equivalência é `chave do MAP → id do V3.2 \| sem equivalente`. Ela sabe responder "o meu equivalente está anexado neste card?"; **não** sabe responder "algum **irmão ou pai** do meu equivalente está anexado?". T004 mediu, **no engine**, um estado em que `fortirecon [atende]` e `endpoint-family [oferta a definir]` saem juntos e `FortiEndpoint` sobrevive do `MAP` ao lado do placeholder — mesmo assunto, dois nomes |
| **A rota decidida** | **B** — a tabela permanece `chave → id`. A fusão continua sendo contra o **conjunto efetivamente anexado no card** (**E9**), e item cujo equivalente não está anexado **sobrevive**, inclusive quando um irmão ou o pai da família está. Não é esquecimento: é escolha, e a razão de produto é que as duas frases têm **remédios distintos** — "a validar" se resolve validando aderência (gap + catálogo congelado), "oferta a definir no aprofundamento" se resolve **declarando arquitetura** (`engine_v32.js:449-452`, `:464`). Fundir colapsaria duas pendências numa só, e a que se perderia é a acionável. Some-se que a rota alternativa (`chave → id[]`, fundir por família) só sabe **subtrair nome**, dentro da demanda cujo enunciado é "declarar contexto nunca subtrai conteúdo" — e subtrairia justamente o `FortiEndpoint`, que é um dos produtos que o **item 4 do cliente** nomeou como ausente |
| **Por que `chave → id` basta — o lado do engine é sempre plano** | `SERVICE_FAMILIES` existe (`fortiguard-labs-advisory`, `engine_v32.js:242-250`) mas **`buildRecommendationContext` nunca a alcança**: os únicos leitores são `validateConfigV32` (`:746`, `:749`) e o export (`:811`). Todo `serviceId` anexado é chave plana de `SERVICES` — 7 medidos. E o nó de família de **candidato** (`ndr-family`, `endpoint-family`) nasce só em `resolveCandidates` (`:449-467`), sob `TECHNOLOGY_WHITESPACE` (`:570-572`), que exige presence **declarada** |
| **O card do achado não é alcançável — com o qualificador, sem o qual a frase é FALSA** | "`presence UNSET` ⇒ zero candidatos" é **falso** como universal: varredura adversarial de 2.294 sessões / 12.748 observações capability×combo sob UNSET achou **788 contraexemplos**. Todos `UNASSESSED_CAPABILITY`, todos `itemKind: "offering"`, todos em capability com `assessmentCoverage: "none"` e **zero `questionIds`** — logo **nunca dona de card-alvo**. Contraexemplos em capability que pode ser dona de card (1 dona + `landscapeEnabled`): **0**. O enunciado verdadeiro traz o qualificador: *nenhuma capability que pode ser dona de card-alvo tem candidato sob `presence UNSET`* |
| **E a rota de escape está fechada por invariante de máquina, não por sorte de catálogo** | `engine_v32.js:696` — `if (c.assessmentCoverage==="none" && c.questionIds.length) err(…)` — e `validateConfigV32()` devolve **0 erros**, asserido por gates vivos de `tests_m42_m86.js`. As 12 capabilities `coverage: none` que carregam os 788 candidatos têm `questionIds: 0` **porque um gate congelado não deixa ser diferente**. É este par que torna a cadeia durável; sem ele, "capability sem `questionIds`" lê como fato contingente |
| **Correção sobre `D010-F4`** | O estado que T004 mediu está a **duas** saídas de `D010-F4`, não uma: exige `presence: "NONE"` **e** `saasAllowed: "unknown"`. A fixture declara `saasAllowed: "yes"`, e sob a arquitetura dela, mesmo em whitespace, `vulnerability-management` devolve `fortiendpoint [atende]` + `fortirecon [atende]` — **dois ids planos**, onde `chave → id` bastaria igualmente. O nó de família nasce de `archSatisfied === "unknown"`, não de whitespace. A ratificação das 11 linhas **não muda**; a justificativa muda |
| **Medido, não derivado** | Sobre as **cinco** fixtures: **18** cards satisfazem o predicado *sse* de C7 (publicam), e **zero** deles tem candidato do engine anexado. O único alvo com candidato na suíte inteira é `D010-F2/logs` — `TECHNOLOGY_WHITESPACE`, 3 candidatos DIRECT —, que é **S3**-contexto e por isso não publica. A medição é sobre **payload**, e este é o caminho certo: os quatro termos de C7 são fatos de payload, nenhum é propriedade da tela |
| **A alínea que NÃO nasceu** | Propôs-se uma alínea (d) para C8 · `D010-CARD2`: "nenhum card traz, ao mesmo tempo, `.ux-tgt-enabler` de origem candidato e nó a validar". Ela **não nasce**. Censo: o universo de (d) e o de (a) são **idênticos** e têm **um** elemento (`D010-F2/logs`); nenhum mutante em `ui_target_v32.js` pode alargá-lo, porque candidato é saída de arquivo `frozen`. E (d) é estritamente **mais fraca**: pede uma conjunção (chip **e** nó) onde (a) pede um termo — um mutante que publicasse o nó em `logs` **suprimindo** a linha do engine passaria por (d) e morreria em (a). Alínea implicada por outra, sobre universo de um, que erra num caso que a existente pega: é exatamente **E1**. A propriedade fica só nesta errata |
| **Classe** | Alcance de contrato subespecificado, decidido por intenção de produto e fechado por medição — não por conveniência de implementação. Nenhuma invariante nova (R1 é do auditor humano): **comportamento declarado da 010** |

### E15 · O prefixo `map:` é normativo — o critério alcança o que o plano já dizia

| | |
|---|---|
| **O que estava escrito** | C10 (b): item sem equivalência é exibido "com `PRODUCTS[c.p].n` e `data-eid` **estável**". O `plan.md:197`, aprovado, é mais específico: `data-eid="map:FortiGuard-Service-Bundle"`, "prefixo que **não pode colidir** com id do engine e mantém o `data-eid` estável" |
| **O que o QA mediu, e por que recusou pinar** | Um mutante que emitisse a **chave crua** como `data-eid` sobrevive. E ele recusou fechá-lo por conta própria, com razão: a chave crua **também** é estável, própria e não colidente (nenhum dos 45 ids do engine contém `:`), logo satisfaz C10 (b) como escrito. Pinar o prefixo seria o gate exigindo mais que o critério ratificado — e gate que exige o que o critério não pede é a mesma patologia, de sinal trocado, dos gates que esta demanda vem desfazendo |
| **O que passa a valer** | O prefixo `map:` é **normativo**, e C10 (b) passa a exigi-lo: item sem equivalência V3.2 tem `data-eid` da forma `map:<chave do MAP>`. Duas razões, ambas de produto: (i) o prefixo torna a **proveniência visível no próprio DOM** — este item vem do `MAP` congelado, não do catálogo V3.2 —, e essa distinção é exatamente a que a demanda inteira existe para manter legível; (ii) a não-colisão hoje é **contingência medida**, não invariante checada — `validateConfigV32` não proíbe `:` em id (achado registrado em T004) —, e o namespace é o que a preserva se o catálogo crescer |
| **Por que não ficou como dívida** | Esta é a **única rota alcançável no produto inteiro** que exercita o ramo sem equivalência (`incident-response@lv0`; as outras 8 ocorrências da chave estão em capabilities `landscapeEnabled: false`, S4 por construção). Propriedade com uma rota só e nenhum gate é propriedade que apodrece sem ruído — e foi preciso uma fixture nova só para chegar até ela |
| **Classe** | Plano mais específico que o critério, com o gate obedecendo ao critério. A direção do conserto é sempre esta: o critério alcança o plano, e só então o gate pina. Nunca o gate pinando por conta própria — foi o que o QA se recusou a fazer, e a recusa estava certa |

### E16 · Prova manual apodrece — o que couber em mutação de fonte vira mutante de fonte

| | |
|---|---|
| **O que estava escrito** | A spec declara **20** mutantes (`D010-M1..M20`), dos quais **18** executados. Os cinco pares nascidos de **E15** (`data-eid` do ramo sem equivalência: chave crua, `map-<chave>`, `map:<chave errada>`, `MAP:<chave>`, `map:` sem chave) entraram na matriz como série própria, com `harness: "manual (simulação da saída no DOM)"` |
| **O problema com prova manual** | Ela vale no dia em que é feita e **não é re-executada pela campanha**. Um par provado à mão não distingue, seis meses depois, "a propriedade continua guardada" de "a âncora apodreceu e ninguém viu" — que é exatamente o defeito que a demanda **013** achou depois de meses: mutantes nascidos podres, somados às sobrevivências como se fossem a mesma coisa. Aceitar prova manual onde mutação de fonte é possível é comprar a mesma dívida de novo, com o mesmo desconto |
| **O que passa a valer** | Propriedade derivada de **E15** ganha **mutante de fonte** sempre que a mutação for exprimível como **mudança de uma linha numa âncora real do produto**. O que exigir andaime sintético permanece **par declarado manual, com a razão escrita** — nunca omitido, e nunca convertido em mutante sintético (proibido por R3 §5 e pelo próprio §"Achados" desta spec). Quem julga o que é exprimível é o `qa-engineer`, na âncora, não em prosa |
| **Consequência de contagem** | O número de mutantes **declarados** e o de **executados** se movem conforme o julgamento acima, e os novos recebem ids na série `D010-M*`, em ordem, após `M20`. `plan.md` §Waves e o cabeçalho do harness acompanham. **Contagem não é sagrada** — ids são (R12): nenhum id existente renumera |
| **O caso que motivou** | O `M-SE9` — `data-eid="map:FortiSIEM"`, prefixo certo e **chave errada** — era sobrevivente antes de E15. Sem forma normativa o gate não distinguia "veio do `MAP`" de "veio do `MAP`, mas de outra chave". É propriedade de produto, medida, e por isso merece guarda que a campanha re-execute |
| **Classe** | Rito de prova mais fraco que o disponível. A regra geral: **a prova mais forte que couber é a devida** — e o que não couber se declara, com a causa |

### E17 · C8 (a) é verdadeira por construção — e o critério passa a dizer o que mede

| | |
|---|---|
| **O que estava escrito** | C8: "Capability com candidato do engine **nunca** recebe item do `MAP`", com a alínea (a) sobre `logs` em `D010-F2` — redigida como se fosse asserção do gate |
| **Fato medido, em duas camadas** | **Estática**: das 25 capabilities, **13 têm `questionIds` e nenhuma delas é `coverage: "none"`**; as 12 sem `questionIds` são **todas** `coverage: "none"`. As 10 candidatas a S2-contexto (dona única + `landscapeEnabled`) são todas `coverage: "direct"`. **Dinâmica**: varredura adversarial de 900 sessões com landscape todo UNSET — **9.000 observações (dona de qid × UNSET), 0 contraexemplos** —, e as classificações observadas nessa classe são apenas `CONTEXT_NOT_INFORMED`, `null` e `NEEDS_VALIDATION`: **`UNASSESSED_CAPABILITY` não aparece**, e ela é a única rota que carrega candidato sob UNSET |
| **O que isso implica** | `temCandidato` é **sempre falso** onde `tgtValidateHTML` chega: capability com candidato nunca está em S2-contexto. A ausência do nó em `logs` é explicada pelo **S3**, e por nada mais. C8 (a) é verdadeira **por estado**, não por **gate** |
| **`D010-M11` — desfecho** | **Equivalente por construção.** Sai da campanha e entra em `dividas_declaradas` pela causa certa: **"inalcançável, provado"** — nunca "falta fixture". A distinção é a que separa dívida pagável de dívida impossível: a fixture proposta **não pode existir**, e escrever "falta fixture" mandaria alguém tentar pagá-la. O id **não é reusado** (R12) |
| **A cláusula fica** | O `if (temCandidato) return "";` permanece no predicado como **defesa**, sem mutante — desfecho de **E1**/A5. Ela não é alcançável hoje; é barata, e só pode deixar o produto mais conservador |
| **O que C8 mede, e passa a dizer** | Quem mede C8 é a alínea **(b)**: capability com **apenas serviços** e em S2-contexto **continua** recebendo o nó — isto é, serviço do engine **não bloqueia** o `MAP`. Viva, com caso em `D010-F4` (três qids). A alínea (a) permanece no gate como **regressão de estado**, declarada como tal: ela guarda que a propriedade continue verdadeira se o catálogo mudar, e não prova a precedência |
| **`D010-M26`** | (b) ficava sem mutante, e critério vivo sem mutante é critério sem prova de poder. Nasce `D010-M26` — mutação de **uma linha** na âncora de serviços (`forEach` que empurra `serviceId` passa a marcar `temCandidato`), atacando exatamente "serviço não bloqueia o `MAP`". Declarados **25 → 26** |
| **A terceira vez** | Esta é a **terceira** vez nesta demanda que um critério se revela verdadeiro **por estado e não por gate** — depois de **E5** (`D010-CARD3` (b)) e de **E1** (a cláusula A5). O padrão merece o nome: *alínea cuja pré-condição nunca falha* é indistinguível de alínea que mede, até alguém escrever o mutante e ele sobreviver. **A campanha é o único instrumento que separa as duas** — e só quando distingue SOBREVIVENTE de NÃO EXECUTADO, que é o que a demanda 013 construiu |
| **Classe** | Critério que promete asserção e entrega tautologia. Corrigido na redação, com o mutante nascendo onde a medição de fato mora |

### E18 · O card base nunca foi vazio — V3 subtraía conteúdo dentro da demanda que existe para não subtrair

| | |
|---|---|
| **O que estava escrito** | C6: o bloco de ausência substitui os N `baseCardHTML`, e (a) exige **zero** `.v32-card` em `#v32base`. A premissa, do refinamento: *"N cards cujo único conteúdo possível é dizer que não houve declaração"* |
| **Fato medido — a premissa é falsa** | Sob `CONTEXT_NOT_INFORMED`, a apresentação `base` é atribuída por gap **ou** flag de prioridade **ou** `(c.services\|\|[]).length` (`ui_v32.js:650-653`): **serviço anexado é, sozinho, motivo para a capability estar no bloco base**. E o card que existia ali renderizava **`Serviços`**, o estado de maturidade e o `why` (`:630`, `:642-643`). O bloco novo usa **só os nomes** — `ctxs` entra na assinatura de `baseAbsenceHTML` e **não é lido** (`:694-702`). A premissa é verdadeira para o card **vazio** — que é o que o cliente viu, porque as quatro capabilities dele não têm serviço — e **falsa** para o card com serviço |
| **Tamanho, na sessão que importa** | Não é borda. No cenário inicial típico de um assessment — editor de contexto **salvo**, tudo UNSET — o engine anexa **7 serviços** por `hasGap` (fora do `switch`, achado A5), `baseIds` tem **10** entradas e **3** têm serviço: **5 nomes de serviço somem da tela**. No papel, `#pr-support` foi de **8944 para 2645 chars — 31% do papel**, com todas as outras seções byte-idênticas. A perda é cirúrgica |
| **E é a mesma raiz do vermelho do CI** | `P52-TGT4` reprovou nos dois sentidos — caso B "nome de estágio publicado no bloco", caso C "alvo 2.8 ausente do papel". **Uma causa, dois sintomas opostos.** O gate fatia o texto do `pdftotext` **por posição no fluxo de palavras de UMA página**, entre dois marcadores (`tests_p52_chromium.js:3993-4002`), e o terminador é o `TGT_DISCLAIMER` (`ui_target_v32.js:465`). Encolher `#pr-sup-base` em **2842** (B) e **5603** (C) chars — seção que vem **antes** de `#pr-target` na ordem canônica — puxa o bloco de comparação para cima, cerca de **uma página inteira** em B, e ele passa a cavalgar outra quebra. `#pr-target` **não muda um byte** nos dois casos: com contexto declarado as práticas ficam em S3 e `tgtValidateHTML` devolve `""` |
| **O que passa a valer** | `baseIds` é **partido por payload**. Capability com payload do engine — serviço anexado — **continua card**; o aviso único absorve só aquelas cujo card não acrescentaria nada além da não-informação. **C6 (a)** passa de "zero `.v32-card`" para **"zero card SEM payload"**, com pré-condição de não-vacuidade. **C6 (b) move junto**: o aviso nomeia exatamente `baseIds` **sem payload** — senão ela reprova, porque o aviso nomearia 7 e `baseIds` continuaria 10 |
| **A alternativa recusada** | Fazer `baseAbsenceHTML` ler o `ctxs` que já recebe e anexar os nomes é mais barato e **não fecha o defeito**: recupera nomes, perde `why` e maturidade, e **deixa a frase falsa de pé** — continuaria dizendo *"a interpretação V3.2 não é produzida para elas"* numa lista que inclui capabilities cujos serviços ela acabou de imprimir. Disfarce, não conserto |
| **O que V3 continua subtraindo, de propósito** | Dos 6777 chars que `#pr-sup-base` tinha no pior caso, **2863 (42%)** são de cards **sem** payload. Esses o aviso único absorve, e a premissa do refinamento permanece **intacta para eles**. O que se recupera são os **3914 (58%)** dos cards com conteúdo |
| **Achado registrado, não corrigido** | O recorte do `P52-TGT4` — `slice(ini, fim > ini ? fim : undefined)` — **alarga o sujeito da asserção em silêncio** quando o terminador sai da página: o bloco engole o vizinho e a falha aparece como "publicou o que não devia". É suíte congelada (§29.4) e **não foi tocada**. Se o vermelho persistir depois desta correção, o achado passa a ser o recorte, e aí é frase nova do proprietário |
| **Classe** | Premissa generalizada do card **vazio** para o card **com conteúdo** — dentro da demanda cujo enunciado é "declarar contexto nunca subtrai conteúdo". O `product-owner` reprovou o aceite, nomeou a própria autoria da premissa, e a objeção foi **falsificada por execução** antes de virar correção |

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Suíte nova: `tests_010_vao.js`, namespace exclusivo `D010-*` (R10 §1), jsdom, sem
Chromium. Registro em `.claude/verify/expected_suites.json` no MESMO PR (R10 §3),
com a contagem fixada pelo `qa-engineer` no verde. Campanha nova:
`tests_010_mutants.js`, harness `d010` em `.claude/verify/mutation_map.json`
(`requires: [node, python]`; alvos: `ui_v32.js`, `ui_target_v32.js`,
`tests_010_vao.js`, `fixtures_010_vao.js`, `tests_010_mutants.js`).

**Fixtures.** Locais à demanda, em `fixtures_010_vao.js` — `fixtures_p52.js` e
`fixtures_p50.js` são artefatos de outra fase e não são alterados. Todo estado é
aplicado pelos **owners canônicos** (`__DEV.setAnswerById`, `__DEV.setPriorities`,
`__DEV.setTarget`, editor de contexto + `#v32save`), nunca por escrita direta de
derivado. Fixture que não alcança o estado declarado faz o gate morrer **vacuoso**
e por isso cada uma declara seus estados, no padrão `d009AssertFixtureStates`.
A errata de vacuidade acrescenta a contrapartida: **alínea que depende de um caso
declara ela mesma a pré-condição** e falha nomeando a vacuidade, em vez de fechar
verde por ausência de caso. E o assert declara **só o que esta demanda não pode
escrever** — o estado aplicado pelos owners canônicos e o derivado por
`engine_v32.js`, pela Camada 1 congelada e pelo catálogo. A saída de `ui_v32.js` e
`ui_target_v32.js` é objeto de **gate**, nunca âncora de fixture (**E10**).

**Vocabulário do critério (E11).** *Publicar um habilitador a validar* = emitir um
nó `[data-ux-enablers="a-validar"]` **com ao menos um `.ux-tgt-enabler` dentro**.
Nó vazio **não é publicação** e é **defeito**: onde a spec exige o nó, exige-o
**com item**; onde o proíbe, proíbe **o nó** — vazio ou não.

| Fixture | Estado declarado |
|---|---|
| **D010-F1 · vão canônico** | 15 respostas confirmadas (suficiência **ABERTA**), nível 0 em `automation`, `endpoint`, `network-visibility`, `external-surface`; landscape **100% UNSET**; **única** declaração de contexto: `#v32-arch-saasAllowed = "yes"` (tira do legado sem anexar serviço nem candidato — `engine_v32.js:305-311`); prioridades `["automation","endpoint"]`; alvos nos quatro qids. Reproduz o estado do relatório do cliente (P10) |
| **D010-F1b · vão sem prioridades** | D010-F1 sem `setPriorities` — exercita o ramo `!hasPrio` (`quickscan_…:991-996`) |
| **D010-F2 · substituto presente** | D010-F1 + `security-analytics` declarada `NONE` **com `logs` no nível 0** (⇒ `TECHNOLOGY_WHITESPACE`, candidatos DIRECT: `fortianalyzer`, `fortisiem`, `fortisiem-cloud`) + alvo em `logs`. É o par de C8(a). **A errata de vacuidade não a altera**: as duas capabilities novas vivem em `D010-F4`, porque acrescentá-las aqui moveria o vetor e, com ele, os censos que os critérios medem — o `qa-engineer` mediu o efeito em `D010-F1` (`basePresented` 4 → 6, `baseInV32Base` 2 → 4) e o mesmo risco vale aqui. `D010-F1`, `F1b` e `F2` permanecem **byte-idênticos**. *(Errata de 2026-08-30, achada por sonda do `tech-lead` na Fase 2: a redação original não fixava o nível de `logs`. Com `logs` em 2, o estado é `POSSIBLE_CONTEXT_DIVERGENCE`/`VALIDATE` com **zero** candidatos — `D010-CARD2`(a) ficaria vacuoso e `D010-ARB2`(b) falharia. Medido no engine, não inferido.)* |
| **D010-F3 · gate fechado** | Vetor de `fixtures_p50.js · P50_F2` **acrescido de `vulnerability-management` = 0** (5 confirmadas + 1 "NA" ⇒ `confirmedCount() = 5 < 10` ⇒ suficiência **FECHADA**, `quickscan_…:494`/`:512-514`) + `saasAllowed="yes"` + **alvo em `vulnerability-management`**, que satisfaz todas as demais condições de C7 (S2-contexto, resposta confirmada, `MAP[…].lv[0].c` não vazio) e só não publica por causa do gate. É a **única** fixture de gate fechado, e por isso a emenda fica aqui: nenhum censo de critério pende dela (só `D010-ARB3`(c) e `D010-CARD3`), e a metade ABERTA do diferencial de `D010-CARD3`(c) é `D010-F4`, que traz **o mesmo par** (`vulnerability-management`, nível 0). *(Errata de vacuidade, E5: com o vetor original nenhum alvo legítimo estava em S2 com `MAP` não vazio — `mandate`/`governance`/`team-capacity` são S4, `logs` em nível 3 tem `MAP` vazio e `incident-response` é "NA" —, então `D010-CARD3`(b) era verdadeiro **por estado, não por gate**.)* |
| **D010-F4 · fontes que se cruzam no card** *(nova — errata de vacuidade, E3/E4)* | Suficiência **ABERTA** (declarada e provada pela fixture); landscape **100% UNSET**; `saasAllowed="yes"`; **`vulnerability-management` e `monitoring-coverage` respondidos em nível 0**, com **alvo nos dois**. Estados que ela existe para alcançar, todos medidos pelo `qa-engineer` na W1: (i) `vulnerability-management` ⇒ capability homônima com **zero candidatos** e **um serviço real** (`vulnerability-assessment`, `primary`, sem `requiredSignals`/`eligibilityRequires`, anexado por `hasGap`) ⇒ **S1-payload e S2-contexto** ⇒ é o par de `D010-CARD2`(b) e a metade de gate ABERTO do diferencial de `D010-CARD3`(c); (ii) `monitoring-coverage` ⇒ `continuous-monitoring` recebe `fortiguard-socaas` e `MAP["monitoring-coverage"].lv[0].c` traz **os dois** homônimos do catálogo — `SOCaaS ≡ fortiguard-socaas`, **anexado** (colide, tem de fundir) e `FortiGuard-MDR-Service ≡ fortiguard-mdr`, **não anexado** porque inelegível sob 100% UNSET (**controle, tem de sobreviver**) ⇒ é o par de `D010-CARD4`(c) **nas duas direções**; (iii) **não-interferência** medida: o contexto de cada uma das duas capabilities é idêntico sozinha e acompanhada. Fixture nova, e não emenda de `F1`/`F2`, porque as duas respostas movem o vetor e com ele os censos de C6/C7/C12 — decidido com medição, não por gosto |

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto |
|---|---|---|---|
| C1 | **O vão deixa de existir.** Sem substituto da camada V3.2, a recomendação congelada permanece **visível**: declarar contexto nunca subtrai conteúdo | `D010-ARB1` · `tests_010_vao.js` · fixture `D010-F1`. Confere: (a) `V32.isLegacyModeV32() === false` (pré-condição da fixture, senão gate vacuoso); (b) nenhum `.section-title` cujo `.eyebrow` esteja em `HIDE_EYEBROWS` carrega `.v32-hidden`; (c) os `.apoio-block` e `.t-list` contíguos a eles também não; (d) o censo de nós visíveis da Camada 1 é **item a item idêntico** ao de um segundo render da MESMA sessão em modo legado (oráculo por comparação, montado pela suíte — não lê o predicado do produto) | **M1**: em `ui_v32.js`, devolver o argumento de `hideLegacyRecommendation` ao predicado antigo (`V32.isLegacyModeV32()` ⇒ `true` no ramo não-legado) → `D010-ARB1` DEVE falhar em (b), nomeando os títulos ocultos |
| C2 | **Com substituto, a supressão vigente é preservada.** Quando a camada V3.2 tem o que pôr no lugar, a leitura congelada é ocultada como hoje | `D010-ARB2` · `tests_010_vao.js` · fixture `D010-F2`. Confere: (a) os títulos de `HIDE_EYEBROWS` **presentes** estão todos com `.v32-hidden`; (b) `#v32support` traz ≥1 `.v32-card` com candidato ou serviço; (c) nenhum outro `.section-title` da tela ficou oculto (sem transbordo) | **M2**: o predicado devolver sempre `false` (nunca ocultar) → `D010-ARB2` DEVE falhar em (a). Mutante escolhido de propósito: ele **passa** em `D010-ARB1`, provando que fechar o vão e preservar a supressão são propriedades distintas e precisam de gates distintos |
| C3 | **A arbitragem é tudo-ou-nada, com alcance inalterado.** O conjunto visível da Camada 1 é ou o do modo legado, ou vazio — nunca um terceiro; e nenhum nó fora dos três títulos e de seus blocos contíguos é atingido | `D010-ARB3` · `tests_010_vao.js` · fixtures `D010-F1`, `D010-F2`, `D010-F3` e `D010-F4` (**E13**). Confere, nas quatro: (a) o conjunto de nós com `.v32-hidden` na seção de apoio é ∅ **ou** exatamente {três títulos presentes} ∪ {`.apoio-block`/`.t-list`/`.t-details` contíguos}; (b) `#review`, `#restart`, "Capabilities a validar" e o `<details>` de "demais gaps altos" **nunca** recebem `.v32-hidden`; (c) sob `D010-F3` (gate FECHADO) o conjunto visível é **idêntico** ao do modo legado — V1 nunca amplia a exposição da Camada 1 | **M20**: arbitrar o título e **parar** — não arrastar os blocos contíguos (`.apoio-block`/`.t-list`/`.t-details`) → sob `D010-F2` o conjunto oculto vira um **terceiro** conjunto ⇒ FAIL em (a). É o mutante que guarda o "tudo-ou-nada" do enunciado; a fixture declara o conjunto contíguo **não vazio** antes, senão ele também é sem caso. **M3** (remover a interrupção `hiding=false` no nó não-permitido, `ui_v32.js:193`) e **M4** (acrescentar `banner-ok` aos permitidos): **dívida declarada, nunca par vazio** — medidos na W1 e **sem caso nas fixtures**, porque sob o workspace da 5.2 a varredura não alcança o nó que eles atacam, e sabotar as duas formas não mudou veredito nenhum. Disposição em **uma** execução: sabotar e rodar `ui31`, dono do alcance da varredura por R-5 (`U15`, `tests_ui_m31.js:268`) — se `U15` morrer, a propriedade é medida fora do `d010` e a dívida fica com dono nomeado; se **sobreviver também**, o guarda de contiguidade não é medido em lugar nenhum e isso é **achado `EA-*`**, não dívida silenciosa. Mutante sintético é proibido |
| C4 | **Os dois ramos seguem a mesma arbitragem.** Sessão sem prioridades declaradas ("Como a Fortinet pode apoiar agora") não fica de fora | `D010-ARB4` · `tests_010_vao.js` · fixture `D010-F1b`. Confere: (a) o título "Como a Fortinet pode apoiar agora" está presente e **visível**; (b) o `apoioAgora` contíguo está visível; (c) a mesma sessão com prioridades (`D010-F1`) dá o mesmo veredito de arbitragem | **M5**: arbitrar apenas quando `hasPrio` (condicionar o argumento à existência de prioridades) → FAIL em (a) |
| C5 | **INV-7 · nenhuma superfície afirma preservação de leitura oculta.** A frase de `ui_v32.js:615` só pode ser impressa quando a leitura que ela cita está de fato visível — e no papel, onde a Camada 1 nunca é impressa, ela nunca aparece | `D010-INV7` · `tests_010_vao.js` · (a) sob `D010-F2` (congelado oculto): **nenhum** nó da tela casa `/Leitura V3\.1\.3 preservada/`; (b) sob `D010-F1` (congelado visível): se a afirmação existir, os blocos citados estão visíveis no MESMO render; (c) em `#v32-print-report`, sob **qualquer** fixture, a afirmação **nunca** ocorre; (d) regressão da frase pinada por `V10` (`tests_ui_m32.js:150`): o card de prioridade continua trazendo "nenhum produto é inferido sem contexto" e nenhum `/Forti[A-Z]/` | **M6**: emitir a afirmação de preservação incondicionalmente em `baseCardHTML` → FAIL em (a) e (c) |
| C6 | **Leitura base vira bloco de ausência** (V3, verbete canônico), **partido por payload** (**E18**): a capability de `baseIds` **sem** payload do engine deixa de ter card e é absorvida por um aviso único, com contagem e **lista nominal**; a capability **com** payload — serviço, nota ou candidato anexado — **continua card**, nas duas superfícies | `D010-ABS1` · `tests_010_vao.js` · fixtures `D010-F1` **e** `D010-F4` nas alíneas (a) e (b) — `F4` é a única com os dois conjuntos não vazios, e `F1` é o controle em que a partição não muda nada —, e `D010-F1` em (c)–(f). Confere: (a) o conjunto dos `.v32-card` de `#v32base` é **exatamente** o dos `baseIds` **com** payload — **igualdade de conjunto** por `data-cap`, e não duas desigualdades soltas: nenhum card sem payload sobrevive, nenhum card com payload some, nada de fora entra —, e o número de nós `[data-v32-absence="base-context"]` é **1 quando há capability sem payload e 0 quando não há**: a condicionalidade é do produto e é de propósito, porque aviso sobre ninguém seria falso, e o estado "todo `baseIds` com payload" é **alcançável** (medido em 2026-08-31 — `incident-response` em 0 e as demais em 3); a alínea declara **não-vacuidade nas duas direções**, sobre o conjunto dos renders varridos: sem nenhuma capability COM payload a metade "o card com payload permanece" seria verdadeira por estado e não por gate, e sem nenhuma SEM payload a metade "zero card sem payload" não teria o que suprimir; (b) o texto declara que o contexto **não foi informado**, traz a contagem dos **sem** payload e nomeia **exatamente** esse conjunto — e **nenhuma** capability com payload, sobre a qual a frase "a interpretação V3.2 não é produzida para elas" seria **falsa**, porque o engine produziu (**E18**) —, sempre dentro de `baseIds`: apresentação `base` **e** fora de `prioCaps`, porque a capability de prioridade é desviada para `#v32prio` e lá continua sendo card (`ui_v32.js:744-766`; no papel, `:1271-1282` — citações reancoradas ao estado pós-**E18**), conjuntos derivados pelo oráculo a partir de `V32.buildRecommendationContext()` mais a mesma partição de prioridades, nunca do DOM e nunca por número escrito neste critério (**E6** da errata); `baseIds` vazio ⇒ o bloco não nasce e o gate declara vacuidade em vez de passar; (c) não afirma ausência de tecnologia (`/(ausência de\|não (há\|possui\|existe\|tem))\s+(tecnologia\|ferramenta)/i`) e não conclui sobre processo/pessoas/governança; (d) o mesmo censo após dois renders consecutivos (idempotência); (e) no papel, `#pr-sup-base` traz o mesmo aviso, sem controle — e a **mesma partição** da tela, medida por igualdade de conjunto em `D010-PAPEL1`(b) (**E18**); (f) o bloco de prioridades (`#v32prio`) **não** é alterado | **M7**: emitir o aviso sem a lista nominal → FAIL em (b). **M8**: a partição **não acontece** — manter todos os cards e apenas somar o aviso → FAIL em (a), nomeando os cards SEM payload que sobreviveram. **M27** (nascido com **E18**; âncora escrita pela implementação, `ui_v32.js:766`): a direção oposta — colapsar **todos** os `baseIds` no aviso, com ou sem payload, que é o comportamento pré-correção → FAIL em (a), nomeando os cards COM payload que sumiram sob `D010-F4` |
| C7 | **Habilitador a validar no card, ancorado no nível ATUAL confirmado.** Existe **se e somente se**: prática-alvo em **S2-contexto** (`tgtEnablerState(qid, 0) === "S2"` — capability única, `landscapeEnabled: true` e `presence === "UNSET"`, **independente do payload do engine**; **E2** da errata), resposta atual **confirmada** (0..3), `MAP[qid].lv[atual].c` não vazio e gate de suficiência ABERTO | `D010-CARD1` · `tests_010_vao.js` · fixture `D010-F1`. Confere, por prática-alvo: (a) **toda** prática-alvo em S2-contexto com resposta confirmada e `MAP[qid].lv[ans[k]].c` não vazio — sob `D010-F1`, as quatro práticas, que ali também são S2-payload — **publica** — nó `[data-ux-enablers="a-validar"]` **com ≥1 item** (**E11**) — cujos itens são **exatamente** `MAP[qid].lv[ans[k]].c` (lido pelo helper da fixture — `MAP` e `ans` não existem em `window`, **E7**), na ordem do catálogo; o conjunto é derivado pelo oráculo, e **conjunto vazio = FAIL nomeado por vacuidade**; (b) o rótulo de cada item é "a validar" (`.ux-tgt-mode`) e o nó traz a fórmula de §UAT-07 "validar aderência" (`ui_v32.js:994`), sem "apoio direto"; (c) o nó nomeia a origem (gap + catálogo da sessão) e **não** afirma que o item foi identificado pelo contexto declarado; (d) prática com resposta `null`/`"NA"` **não** produz o nó — **nenhum nó, nem vazio** (**E11**); (e) prática em **S3-contexto** (capability com `presence !== "UNSET"`) ou em **S4** (`landscapeEnabled: false`) **não** produz o nó, pela mesma regra; (f) serviço e produto-a-validar não são apresentados como o mesmo tipo de item (C17 do refinamento) | **M9**: ler `MAP[qid].lv[TARGET_PROFILE.overrides[qid]]` (nível-alvo) → FAIL em (a), com os itens do nível errado nomeados (**INV-5**). **M10**: emitir o nó quando `ans[k]` é `null`/`"NA"` → FAIL em (d) |
| C8 | **Precedência de fonte: a fonte com contexto ganha.** Capability com candidato do engine **nunca** recebe item do `MAP`; serviço do engine não bloqueia o `MAP` | `D010-CARD2` · `tests_010_vao.js` · fixtures `D010-F2` — alínea (a) — e `D010-F4` — alínea (b); a alínea (c) vale nas **três** — `D010-F2`, `D010-F3` e `D010-F4` (**E13**). Confere: (a) a prática `logs` (capability com candidatos DIRECT) traz **só** a linha `.ux-tgt-en` do engine, sem `[data-ux-enablers="a-validar"]`, ainda que `MAP["logs"].lv[0].c` seja não vazio; (b) prática cuja capability tem **apenas serviços** (nenhum candidato) e está em **S2-contexto** — em `D010-F4`, `vulnerability-management`, que por causa do serviço é **S1-payload** e já exibe a linha `.ux-tgt-en` — continua recebendo o nó a validar, **ao lado** da linha do engine e no mesmo card (**E2**/**E3** da errata); nenhuma prática com essa forma na fixture = FAIL nomeado por vacuidade; (c) nenhum nome de produto aparece duas vezes no mesmo card | ~~**M11**: concatenar `MAP` aos candidatos do engine sem a precedência → FAIL em (a) e (c)~~ — **equivalente por construção**, provado por **E17**: capability com candidato nunca está em S2-contexto, logo `temCandidato` é sempre falso onde o código chega. Fora da campanha, em `dividas_declaradas` com a causa *inalcançável, provado* — nunca *falta fixture*, que mandaria alguém tentar pagar uma dívida impossível. Id não reusado. **O mutante que guarda C8 é o `D010-M26`**: marcar `temCandidato` no laço que anexa `serviceId` — uma linha, `ui_target_v32.js:340` —, atacando exatamente *serviço do engine não bloqueia o `MAP`* → FAIL em **(b)**, que é a alínea que de fato mede este critério. A alínea (a) permanece no gate como **regressão de estado**, declarada como tal |
| C9 | **INV-3 não é importada mais fraca.** Sob gate de suficiência **FECHADO** nenhum habilitador a validar é publicado, em nenhuma superfície — mesmo que a Camada 1 nomeie produto nesse estado (`quickscan_…:933`) | `D010-CARD3` · `tests_010_vao.js` · fixture `D010-F3`; e `D010-F4` **apenas** como metade de gate ABERTO do diferencial da alínea (c). Confere: (a) `tgtComparisonPublishable(tgtCurrentProfile()) === false` (pré-condição declarada); (b) **zero** `[data-ux-enablers="a-validar"]` na tela e em `#v32-print-report` — **zero nós, não "zero itens"** (**E11**) —, com **pré-condição de não-vacuidade**: a fixture declara ao menos um alvo que satisfaz **todas** as demais condições de C7 (S2-contexto, resposta confirmada, `MAP` não vazio) e que só não publica por causa do gate — na fixture, `vulnerability-management` em nível 0. Sem esse alvo a alínea é verdadeira **por estado, não por gate**, e o gate é FAIL nomeado por vacuidade (**E5** da errata); (c) a publicação **acompanha o gate canônico**, e é isso que o diferencial prova: o mesmo par (qid, nível confirmado) — `vulnerability-management` em nível 0 — **publica** sob `D010-F4` (gate ABERTO) e **não publica** sob `D010-F3` (gate FECHADO), com todas as demais condições de C7 idênticas nas duas e o veredito de suficiência declarado por `d010AssertFixtureStates` em ambas. A **posse** da decisão (moeda UI-009A / INV-3) é desenho, conferível no diff — `tgtValidateHTML(qid, cmpPub)` recebe o veredito pronto e não o recalcula —, e **não** é o que o diferencial mede: uma reimplementação que concordasse nas duas fixtures passaria igual. O oráculo não altera nem reimplementa `dataSufficiency`, que vive no arquivo `frozen`. Par ausente = FAIL nomeado; (d) o `gateNote` de `ui_target_v32.js:129` permanece | **M12**: publicar o habilitador a validar ignorando o gate → FAIL em (b) |
| C10 | **Um habilitador, uma vez, um nome, um ícone.** A equivalência `PRODUCTS` (chave por nome) ↔ `OFFERINGS`/`SERVICES` (id minúsculo) é **declarada**, total sobre as 11 chaves de produto do `MAP`, e nunca derivada por heurística sobre o nome | `D010-CARD4` · `tests_010_vao.js` · fixture `D010-F4` (declarada pela errata, **E4**). Confere: (a) a tabela, lida como **dado** por `window.__DEV`, cobre as 11 chaves distintas de `c.p` do `MAP` — as chaves vêm de **`d010MapKeys(w)`**, o helper da fixture, nunca de `w.MAP`, que não existe (**E7**) —, cada uma com um id de `OFFERINGS`/`SERVICES` **ou** o valor explícito de "sem equivalente V3.2"; chave nova sem entrada = FAIL nomeando a órfã; (b) todo item com equivalência é exibido com o **nome do catálogo V3.2** e `data-eid` igual ao id equivalente; sem equivalência, com `PRODUCTS[c.p].n` e `data-eid` da forma **`map:<chave do MAP>`** — prefixo **normativo** por **E15**, não só "estável"; (c) **as duas direções da fusão, no mesmo card**: sob `D010-F4`, `monitoring-coverage` traz os dois homônimos do catálogo, e o gate exige os dois desfechos — **(c1)** `SOCaaS`, cujo equivalente `fortiguard-socaas` **está anexado** pelo engine, não aparece duas vezes: em nenhum card há dois `.ux-tgt-enabler` com o mesmo `data-eid` ou o mesmo nome renderizado; **(c2)** `FortiGuard-MDR-Service`, cujo equivalente `fortiguard-mdr` **não está anexado** (inelegível sob 100% UNSET), **sobrevive** no nó a validar, com o nome do catálogo V3.2 — é o **controle** que prova que a fusão olha o **conjunto efetivamente anexado no card**, não o domínio da tabela de equivalência (**E9**). Nomes homônimos derivados do catálogo por **`d010EquivalenciaNome`**, nunca escritos à mão no oráculo. Sem card que traga as **duas** fontes ao mesmo tempo, FAIL nomeado por vacuidade (**E4**); (d) o markup de ícone de um item a validar é **idêntico** ao do mesmo item vindo do engine (regressão viva de `N46+K`, `tests_journey_m45.js:280`); (e) o código não casa nenhuma normalização de nome (`toLowerCase()`/`replace` sobre `c.p`) como fonte de equivalência | **M13**: remover uma entrada da tabela → FAIL em (a). **M14**: emitir o item com `data-eid = c.p` cru quando há equivalência → FAIL em (b)/(d). **M18**: **não** deduplicar — concatenar o `MAP` sobre o que o engine já anexou → FAIL em (c1), nomeando o nome repetido. **M19**: deduplicar pelo **domínio da tabela** — remover do nó todo item do `MAP` que tenha equivalente declarado, sem olhar o que está anexado → FAIL em (c2): "FortiGuard MDR" desaparece do card (**E9**) |
| C11 | **INV-4 na leitura.** O `TGT_DISCLAIMER` permanece na **mesma superfície** que os habilitadores, e o habilitador nunca é apresentado como o caminho para o delta | `D010-CARD5` · `tests_010_vao.js` · fixtures `D010-F1` e papel. Confere: (a) na tela, `.ux-tgt-disc` existe **dentro** do mesmo `#ux-tgt-cmp` que contém os `.ux-tgt-enabler`, e **depois** da lista de práticas; (b) no papel, o `.pr-card` com o disclaimer existe dentro de `#pr-target`, depois de `ovs`; (c) o texto do disclaimer é byte-idêntico a `TGT_DISCLAIMER` (`ui_target_v32.js:4`); (d) o nó do habilitador a validar **não** cita nível, score, delta nem estágio | **M15**: mover o disclaimer para fora do bloco de comparação (ou suprimi-lo quando há habilitador) → FAIL em (a)/(b) |
| C12 | **Coexistência com o aviso único da 009: sem órfão e sem contradição.** A prática em S2 continua nomeada no aviso e passa a exibir a linha a validar | `D010-CARD6` · `tests_010_vao.js` · fixture `D010-F1`. Confere: (a) existe **exatamente 1** `[data-ux-absence="target-enablers"]` e ele nomeia **exatamente** as práticas em **S2-payload** — mesmo conjunto que `D009-UNS1` mede, isto é `tgtEnablerState` com o payload real (**E2** da errata); (b) essas mesmas práticas **publicam** `[data-ux-enablers="a-validar"]` — com item, **E11** — e **nenhuma** `.ux-tgt-en` (R-1); prática em **S2-contexto mas S1-payload** — a que tem serviço do engine — fica **fora** do aviso e **pode** exibir os dois nós no mesmo card, o que não contradiz esta alínea e é o que C8(b) e C10(c) medem; (c) o texto do aviso é byte-idêntico ao produzido antes desta demanda para a mesma sessão (`tgtAbsenceHTML` intocada); (d) o nó a validar não contém "identificados", e o aviso não contém "validar aderência" — cada um diz a sua coisa | **M16**: emitir o nó a validar com a classe `.ux-tgt-en` → FAIL em (b), e também em `D009-UNS1` (prova cruzada de que o gate da 009 continua com poder discriminante) |
| C13 | **O papel fecha o vão por V2 + V3, e isso está escrito.** A arbitragem de camada é de **tela** por construção: `body.v32-print-mode .wrap{display:none}` (`ui_v32.css:77`) e `window.addEventListener("beforeprint", preparePrint)` (`ui_v32.js:1273`) fazem o papel ser sempre `#v32-print-report`, onde a Camada 1 nunca entra | `D010-PAPEL1` · `tests_010_vao.js` · fixture `D010-F1`, sobre `preparePrint()`. Confere: (a) `#pr-target` **publica** ≥1 habilitador a validar — nó **com item**, nunca contêiner vazio (**E11**) —, com o mesmo conjunto de itens da tela; (b) `#pr-sup-base` **repete a partição da tela** (**E18**): os `.v32-card` são **exatamente** os `baseIds` com payload (igualdade de conjunto por `data-cap`) e o aviso único de C6 — condicional ao subconjunto sem payload — nomeia exatamente esses, nunca um com payload; medido no papel: 0 cards + 1 aviso sob `D010-F1`, 3 cards + 1 aviso sob `D010-F4`. Sem a partição do sítio do papel, esta alínea e `D010-ABS1`(e) fechariam verdes **por estado** — varriam só `D010-F1`, onde o conjunto com payload é vazio; (c) a ordem pinada do relatório impresso por `P51-DOC13` (`tests_p50_core.js:3857-3868`) permanece; (d) `#pr-support` continua ausente em modo legado (regressão de `P1`, `tests_ui_m332.js:60`) | **M17**: emitir o habilitador a validar só na tela (retorno vazio no ramo de papel) → FAIL em (a) |
| C14 | **Regressão congelada e fronteira intactas** | stages `suites` (`ui31` 19/0 · `ui32` 25/0 · `ui332` 23/0 · `ui333` 26/0 · `ux41` 56/0 · `target` 30/0 · `journey` 31/0 · `icons46` 12/0 · `engine` 105/0 · `p52layout` 45/0 · `d009` 15/0 · `p50core` 64/0 **após o repin**), `build` (rebuild byte-idêntico), `m41` (payload == pin declarado), `baseline` (repin coerente), `boundary`, `lint-arch`, `state`; campanha `d009` re-executada por gatilho de path (19 KILL / 19) | — (oráculos independentes já existentes; qualquer toque em `engine_v32.js` faria `m41` falhar, e isso é PARADA por Porta B) |

Gate sem mutante previsto não está pronto: **C14** apoia-se em oráculos
independentes já existentes e por isso não recebe mutante próprio. A cláusula
**A5** do predicado de arbitragem (§1) também não recebe: removê-la é
**equivalente por construção** e nenhum mutante que a remova pode morrer — o
motivo está em **E1** da errata, e a matriz registra o par como *equivalente
declarado*, nunca como par vazio. **M3** e **M4** são caso diferente e não podem
ser confundidos com ele: não são equivalentes por construção, são **sem caso nas
fixtures declaradas** — entram como **dívida declarada com causa** e com a
execução que a dispõe (célula de C3), e `D010-ARB3` continua com mutante vivo
(**M20**), como R3 §5 exige.

## Comportamento especificado

### 1 · Arbitragem de camada — `ui_v32.js` (tela)

Entrada: `lastCtx = V32.buildRecommendationContext()` no ramo não-legado de
`renderBlocks` (`ui_v32.js:245`).
Saída: o argumento `hide` de `hideLegacyRecommendation` (`:277`) deixa de ser a
constante `true` e passa a ser **"há substituto?"** — predicado derivado, puro,
sobre `lastCtx.contexts`:

> **Há substituto** quando existe ao menos uma capability cuja apresentação é
> `card` (`presentationOf` ⇒ `"card"`, `ui_v32.js:624-634`) **e** cujo contexto
> traz ao menos um candidato, serviço ou nota, **e** cuja classificação **não** é
> `CONTEXT_NOT_INFORMED`.

- O ramo legado (`:237`) permanece intocado: `hide = false`, como hoje.
- A cláusula "classificação ≠ `CONTEXT_NOT_INFORMED`" (achado A5: serviços são
  anexados fora do `switch`, só por `hasGap` — `engine_v32.js:652-665`) é
  **defensiva, não load-bearing**. `CONTEXT_NOT_INFORMED` ⇒
  `supportMode = "LEGACY-LABELLED"` (`engine_v32.js:601-602`), que `presentationOf`
  **nunca** promove a `card`: a primeira conjunção já exclui o caso. Medido por
  sonda de variantes em seis sessões, incluindo 15×0 e 15×1 — predicado completo e
  predicado sem-A5 dão o mesmo valor nas seis. Ela **fica**, porque é o que
  impediria o serviço sob `UNSET` de desligar a Camada 1 se `presentationOf` um dia
  mudar; e **nenhum mutante a tem por alvo**, porque removê-la é equivalente por
  construção (**E1** da errata).
- A cláusula "candidato/serviço/nota" **é a que carrega o peso** e existe porque
  `presentationOf` devolve `card` incondicionalmente para
  `supportMode === "VALIDATE"` (`:626`): uma capability em `NEEDS_VALIDATION` por
  resposta "não sei" produz card vazio, que não é substituto de recomendação
  nenhuma. Quem a torna load-bearing é a fixture de gate fechado (`D010-F3`), onde
  **todo** card `VALIDATE` tem 0 candidatos, 0 serviços e 0 notas (**E8**).
- **Resíduo declarado (C3 do refinamento).** O predicado é de **sessão**: numa
  sessão assimétrica (capability A com `NONE` + whitespace, capability B `UNSET`),
  há substituto, o congelado é ocultado e **B volta a ficar muda na seção de
  apoio**. O resíduo é fechado no card-alvo (C7) **quando há alvo declarado em B
  e o gate de suficiência está ABERTO** — as duas condições do *sse* de C7, e não
  uma consequência automática da arbitragem. **Sem alvo** (ou com o gate fechado),
  B não ganha card-alvo: ela perde o congelado e fica com o **nome no aviso único**
  (C6) se não tiver payload do engine, ou conserva o **card base** com o que o
  engine lhe anexou, se tiver (**E18**). O resíduo fica **escrito aqui**, com o
  qualificador, não escondido.
- Nada é serializado (INV-8) e nenhum estado novo nasce: o predicado é função da
  mesma estrutura que a tela já consome no mesmo passe.

### 2 · Bloco de ausência do contexto — `ui_v32.js` (tela e papel)

Entrada: `baseIds` em `buildSupportHTML` (`:669-672`) e em `buildPrintReport`
(`:1183`).
Saída: `baseIds` é **partido pelo payload do engine** (**E18**). A parte **sem**
payload deixa de ter card e passa a **um** aviso
(`[data-v32-absence="base-context"]`) com a contagem e a lista nominal **dessas**
capabilities; a parte **com** payload — serviço, nota ou candidato anexado —
continua `baseCardHTML`, no mesmo bloco (`ui_v32.js:762-766`; no papel,
`:1281-1282`). Todo `baseIds` com payload ⇒ o aviso **não nasce**, porque aviso
sobre ninguém seria falso; `baseIds` vazio ⇒ o bloco inteiro não nasce.

- O bloco de prioridades (`#v32prio`, `:661-662`) **não muda**: prioridade nunca
  desaparece (`V10`/`V15`, `tests_ui_m32.js:142`/`:197`), e o card de prioridade
  continua sendo `baseCardHTML`.
- O bloco `#v32maturity` (`landscapeEnabled: false`) **não muda**: não há contexto
  a informar, logo não é bloco de ausência (`V16`/`V17`).
- O aviso declara **não-informação**; nunca ausência de tecnologia (INV-2).

### 3 · A frase do card base — `ui_v32.js` (INV-7)

Entrada: `baseCardHTML(id, c, "base")` (`:611-622`).
Saída: o trecho que hoje afirma *"Leitura V3.1.3 preservada"* passa a ser função
do **mesmo** veredito da arbitragem, no mesmo render:

- congelado **visível** (não há substituto) → o texto pode afirmar a preservação e
  apontar para ela; é verdade, e é o que distingue as duas leituras coexistentes
  na tela;
- congelado **oculto** (há substituto) → o texto **não** afirma preservação;
- **papel** → nunca afirma preservação, porque a Camada 1 nunca é impressa (C13).

A segunda oração — "nenhum produto é inferido sem contexto" — é preservada em
todas as variantes: ela é a promessa que o produto faz ao leitor e está pinada por
`V10`.

**A escolha do card base restaurado por E18 — declarada no registro, sem tocar
código.** Depois da partição, `buildSupportHTML` chama `baseCardHTML` para os
cards **com** payload de `#v32base` **sem** o 4º argumento (`ui_v32.js:766`),
enquanto `#v32prio` o repassa (`:750`, via `renderCap`, `:732`). Não é falso e não
fere C5(b) — o default é falsy de propósito (`:618-628`) —, mas a escolha é
**implícita**, e o próprio arquivo declara o padrão contrário para o gêmeo do
papel (`:830-832`: *"o parâmetro existe para que essa escolha seja explícita no
contrato, e não implícita no esquecimento"*). A escolha, escrita: o **papel** nunca
afirma preservação porque a Camada 1 não é impressa (C13); a **tela** só afirma
onde o card aponta para a leitura **no mesmo bloco visual**. Registro, não mudança:
nenhuma linha de `ui_v32.js` muda por esta declaração.

### 4 · Habilitador a validar — `ui_target_v32.js` (tela e papel)

Entrada: `tgtEnablersHTML(qid, semCtx)` (`:249-263`), o mesmo passe único que
deriva `semCtx` (`:133`) e que o papel repete (`:362-364`).
Saída: quando — e **somente** quando — a prática está em **S2-contexto**
(`tgtEnablerState(qid, 0) === "S2"`, independente do payload do engine — **E2** da
errata), a resposta atual é confirmada, `MAP[qid].lv[ans[k]].c` é não vazio e a
suficiência está ABERTA, nasce um nó irmão `[data-ux-enablers="a-validar"]`, com
os itens do catálogo congelado rotulados **a validar**. `MAP`, `PRODUCTS`, `QS` e
`ans` são `const` de topo de script clássico e **não** existem em `window`: o
produto os lê no próprio escopo e o oráculo os consome pelo helper da fixture,
sem bridge novo (**E7**, R-3 preservada). O nó **só existe com ao menos um item**:
lista vazia ⇒ **nenhum nó**, em nenhuma superfície. Contêiner vazio é defeito, não
publicação (**E11**).

- **Ancoragem**: nível **ATUAL confirmado**, nunca o alvo (INV-5, P4 da 009).
- **Precedência**: capability com candidato do engine não recebe item do `MAP`
  (C4/P6 do refinamento) — a sessão mais bem informada nunca produz mais ruído
  que a menos informada. Serviços não bloqueiam a **prática**; bloqueiam o **item
  equivalente**, quando ele está de fato anexado (serviço `fortiguard-socaas` ×
  `SOCaaS` do `MAP`, mesmo nome de catálogo). Medido por C10(c) (**E4**/**E9**).
- **Suficiência**: gate FECHADO ⇒ nada publicado (P7; B2 da 009).
- **Identidade**: um item, um nome, um ícone — pela tabela de equivalência
  declarada (C10). A fusão é feita contra o **conjunto efetivamente anexado
  naquele card** (candidatos e serviços do engine no mesmo passe), **nunca** contra
  o domínio da tabela: item do `MAP` cujo equivalente não está anexado **sobrevive**
  no nó a validar. `MAP["monitoring-coverage"].lv[0].c` traz os **dois** homônimos
  do catálogo — `SOCaaS ≡ fortiguard-socaas` (anexado, funde) e
  `FortiGuard-MDR-Service ≡ fortiguard-mdr` (não anexado, sobrevive) —, e deduplicar
  pela tabela apagaria "FortiGuard MDR" do relatório (**E9**, mutantes M18/M19).
- **S1 intocado**: a linha `.ux-tgt-en` de hoje não muda de forma, de texto nem de
  condição — inclusive quando o nó a validar nasce **ao lado dela**, no mesmo card,
  numa prática que é S1-payload por serviço do engine e S2-contexto por landscape
  (**E2**). O nó é irmão, nunca a classe (R-1). **S3 e S4 intocados**: sob contexto
  declarado a autoridade é o engine,
  e listar produto do catálogo congelado ali contradiria a leitura informada; onde
  não há landscape aplicável não há contexto a validar.
- **Casos de borda já cobertos por construção**: nível atual 2 ou 3 ⇒ `lv[a].c`
  vazio ⇒ nada (C10 do refinamento, propriedade e não acaso); `revalidateTargets`
  remove a prática ⇒ o nó desaparece com ela, porque nasce no mesmo passe (C9).

### 5 · O que acontece no papel

O relatório impresso é **sempre** `#v32-print-report`: `preparePrint()` é chamado
em `beforeprint` (`ui_v32.js:1273`) e `body.v32-print-mode .wrap` é
`display:none !important` (`ui_v32.css:77`). Logo:

- a arbitragem de camada (V1) é decisão de **tela**, por construção;
- no papel, o vão é fechado por **V2** (`#pr-target`, via
  `__uxTargetPrintHTML`) e por **V3** (`#pr-sup-base`);
- os tiers T2/T3 da Camada 1 nunca foram impressos nesta build — `ui_v32.js` não
  os reproduz.

**Divergência com o refinamento, registrada e não corrigida em silêncio** (R2 §4):
o caso C15 do `refinement.md` afirma que "a supressão do vão vale também no
papel", com base em `quickscan_…:1065` + `ui_v32.css:2`. Isso descreve a Camada 1
isolada; na build V3.2 o `beforeprint` de `ui_v32.js` prevalece e a tela inteira
sai do papel. A consequência prática **fortalece** a demanda (sem V2/V3 o papel
não teria conserto algum) e corrige a cadeia do achado A6, que é de tela.

## Contratos

Nenhum estado canônico novo nasce nesta demanda; nada entra na sessão (INV-8).

| Dado novo | Forma | **Owner do estado** (R9 §5) | Consumidores |
|---|---|---|---|
| Predicado de arbitragem ("há substituto?") | Função **pura** de `lastCtx.contexts`; sem cache, sem campo, sem atributo DOM | `ui_v32.js` (mesmo módulo que já é dono de `renderBlocks` e de `buildSupportHTML`) | `hideLegacyRecommendation` (mesmo módulo) e, como **dado de teste**, `window.__DEV` |
| Veredito da arbitragem no card base | Parâmetro de chamada de `baseCardHTML`, calculado uma vez por render | `ui_v32.js` | `buildSupportHTML`, `prCards` |
| Tabela de equivalência `PRODUCTS` ↔ `OFFERINGS`/`SERVICES` | Constante declarada, total sobre as 11 chaves de produto do `MAP`, com valor explícito para "sem equivalente V3.2" | `ui_target_v32.js` (único consumidor) — **helper único** por semântica (R9 §8); é proibido replicá-la ou reimplementá-la por normalização de nome. A tabela dá a **identidade** do item; ela **não** é o critério de fusão — quem funde é o conjunto anexado no card (**E9**) | `tgtEnablersHTML` (tela e papel); o oráculo a lê por `window.__DEV` como **dado** e reimplementa a checagem |
| Conjunto de práticas com habilitador a validar | Derivado no **mesmo passe** de `semCtx` e da lista renderizada | `ui_target_v32.js` | o próprio card e o aviso único da 009 |

**Superfícies e marcadores.** `[data-v32-absence="base-context"]` (novo, dono
`ui_v32.js`) e `[data-ux-enablers="a-validar"]` (novo, dono `ui_target_v32.js`).
Nenhum bridge `window.__*` novo (R-3). Nenhuma classe CSS nova (R-2).

**Patch-points.** Nenhum: as duas mudanças são internas aos módulos autorizados,
sem monkey-patch e sem decorador (R9 §4). Ordem de injeção do builder inalterada.

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-7 é a **governante** e passa de
  violada (A4) a medida (C5). INV-2: o aviso e o rótulo declaram não-informação,
  nunca ausência (C6/C7). INV-3: C9 impede que a propriedade mais fraca da Camada
  1 (`computeFindings` sem `suff`, `quickscan_…:522-533`) seja importada para
  superfície nova. INV-4: no cálculo nada muda; na leitura, C11 mantém o
  `TGT_DISCLAIMER` na mesma superfície. INV-5: C7 ancora no nível atual. INV-8:
  nada serializado. INV-1/INV-9: `engine_v32.js` e a Camada 1 apenas lidos.
  INV-10: nomes de código citados exatamente como no source.
- [x] **design-decisions.md — nenhum conflito.** O arquivo **não existe** na raiz
  (verificado); o corpus normativo é `.claude/rules/design-decisions.md` (R13),
  que nada registra sobre recomendação, modo legado ou catálogo. Resultado
  negativo registrado para que ninguém cite arquivo inexistente.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/009-leitura-do-relatorio/spec.md`
  é a demanda adjacente e a única que toca estas superfícies: a âncora da ordem
  canônica de leitura (§"Âncora normativa") não é tocada — `support` permanece na
  7ª posição e `ui_p52_workspace_v32.js` não é editado (R-4); os quatro estados
  S1–S4 (§5) são **preservados byte a byte** (R-1); o aviso único (C14 da 009)
  ganha um vizinho, não um substituto (C12). Nenhum critério da 009 é reaberto —
  o que evita tocar decisão que o proprietário ratificou pessoalmente em
  2026-08-27. `specs/003`, `007`, `008`, `012`, `013`: sem interseção de escopo.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `.claude/verify/current_phase.json:18-25` declara **uma** entrada em
  `specs_normativas`: `specs/PHASE_5_0_REV_B.md`, sha `4f1583c7…04619b`
  (fase corrente 5.2 `SELADA`, `proxima_fase` `NAO_ABERTA`). Aberta e lida:
  - **positivo** — `specs/PHASE_5_0_REV_B.md:1613-1620` (§29.4) nomeia
    textualmente `ui_v32.js` e `ui_target_v32.js` como protegidos; `:1629` (§29.5)
    exclui superfícies de print/PDF; `:1638-1641` declara o rito
    `STOP → classificar → abrir microfase dedicada → revisão independente`;
  - **negativo, e é o que sustenta a demanda** — **nada** sobre recomendação,
    catálogo, `MAP`, `OFFERINGS`, habilitador, tier ou modo legado em
    `specs/PHASE_5_0_REV_B.md`. A §UAT-07 que governa `QS_GAP_SUPPORT` **não** é
    spec normativa: vive apenas como âncora citada dentro do oráculo
    (`tests_p50_core.js:3339-3344`). **Não há diretriz selada que arbitre as duas
    doutrinas de recomendação** — o vão não contraria spec alguma; ele existe
    porque nenhuma spec o cobriu. Spec selada não é editada aqui.
- [x] **Boundary (R6) — as três fontes cruzadas**, nesta ordem:
  1. `.claude/verify/boundary.json:9-14` — classe `frozen` contém **apenas**
     `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`
     e `v3_1_3_functional_snapshot.json`. `ui_v32.js` e `ui_target_v32.js`
     **não** estão lá; os quatro paths `frozen` são apenas **lidos** por esta
     demanda (R-6).
  2. `PROTECTED` + `frozenSuites` (`tests_p50_core.js:82` e `:400-403`) — o mapa
     pina `ui_v32.js` (`:158`) e `ui_target_v32.js` (`:256`); é este o portão que
     **decide na prática**, e ele é consumido por quatro gates (P50-GOV1,
     P50-SUF0, P50-SUF8, P50-IC4). `frozenSuites` exige a presença de
     `tests_ui_m31.js`, `tests_ui_m32.js`, `tests_journey_m45.js`,
     `tests_icons_m46.js`, `tests_target_m431.js` — todas **preservadas sem
     edição** pelo desenho (R-1 a R-6).
  3. `.claude/verify/pins.json:277,281` — identidade de HEAD (stage `baseline`)
     de `ui_target_v32.js` e `ui_v32.js`, coerente com o mapa `PROTECTED`.
  **Toca protegido? Sim — e a autorização está registrada acima** (§"Autorização
  nominal §29.4"), concedida pelo proprietário no chat em 2026-08-30, nominal e
  restrita a estes dois arquivos e a esta demanda. **Qualquer outro arquivo da
  §29.4 é PARADA**, com o rito de `:1638-1641`.
  **Precedência**: onde a prosa da spec selada divergir do executável, vale o
  regime de pins (R8; `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição
  §2 — "o freeze acumulativo parte do estado REAL"). É por essa precedência que o
  repin inline de `PROTECTED` é **manutenção de registry** (R8 §2, com
  comentário-trilha e "Identidade anterior"), não edição de superfície protegida —
  o precedente vivo são as erratas de 5.1, 5.2 e da 009 no próprio mapa. A
  divergência prosa×executável já é achado registrado (E2) e não é resolvida aqui.

## Achados a registrar — não corrigidos nesta demanda

Alocação de id da série `EA-*` é do `doc-writer`, **depois de conferir a
`develop`** (P13); a cadeia arquivo:linha→efeito de cada um está no
`refinement.md` e é o insumo suficiente.

| Achado | Cadeia | Estado após esta demanda |
|---|---|---|
| **A3 · `.prod-mini` órfão** | `quickscan_…:859`, `:868`, `:901-902`, `:909-911` — `renderedP` dá o card completo a quem renderiza primeiro (o bloco de prioridades) e deixa o `<details>` visível com um mini que remete a card não exibido | O dano prático **desaparece no vão** (com V1 os dois blocos ficam visíveis), mas o acoplamento **permanece** sob contexto declarado, quando o congelado é ocultado. Registrar assim |
| **A6 · T3 oculto por contiguidade** | `ui_v32.js:189-193` + `quickscan_…:1002-1007` — sem resposta "NA" o `<details>` T3 fica contíguo ao `.t-list` do T2 e é ocultado junto | **Correção da cadeia**: o efeito é **de tela apenas** — os tiers nunca são impressos nesta build (`ui_v32.js` não os reproduz e `.wrap` sai do papel). Continua exigindo **confirmação por execução** do `qa-engineer` antes de virar achado |
| **A5 · serviço anexado fora do `switch`** | `engine_v32.js:652-665` — serviços entram por `hasGap` ou por sinal, fora do `switch` de classificação, inclusive sob `CONTEXT_NOT_INFORMED` | **Correção da cadeia**: o fato é verdadeiro; o **efeito** que lhe foi atribuído ("um serviço sob `UNSET` desligaria a Camada 1") **não é alcançável** — `CONTEXT_NOT_INFORMED` ⇒ `LEGACY-LABELLED` (`:601-602`) e `presentationOf` nunca o promove a `card` (`ui_v32.js:624-634`). Registrar o achado com a cadeia sem esse efeito; medido por sonda de variantes em seis sessões, não inferido (**E1** da errata) |
| **A4 · frase falsa** | `ui_v32.js:615` × `hideLegacyRecommendation` | **Corrigido nesta demanda** (C5). Registrar como achado **resolvido pela 010**, com o gate que o mede |
| **Divergência doc×código inerte** | `tests_p52_layout.js:63-64` — `P52_CANONICAL_ORDER` tem `evidence` antes de `support`, ordem inversa à de `P52_SECTIONS`; o literal não é usado pelos gates | Insumo para o `qa-engineer`; fora do escopo |

## Fora de escopo

Herdado do `refinement.md` (seção "Fora de escopo (explícito)", itens 1–11) e,
adicionalmente:

1. **Item 6a** — "Apoio nas prioridades declaradas · contexto V3.2"
   (`ui_v32.js:661`): remoção da seção **ou** do sufixo de versão do título.
   Decisão **adiada por desenho**: com V1 as duas leituras passam a coexistir na
   tela e a premissa muda; decidir agora seria decidir sobre outra tela. O
   desconforto de leitura que a coexistência cria é atendido, nesta demanda, pela
   frase verdadeira de C5 — não por remoção. Reavaliar com evidência de tela,
   depois de V1.
2. **Estender o habilitador a validar aos estados S3 e S4.** Sob contexto
   declarado a autoridade é o engine; onde não há landscape aplicável não há
   contexto a validar.
3. **Alterar `tgtEnablerState`, `tgtAbsenceHTML` ou qualquer gate `D009-*`** (R-1).
4. **Qualquer edição em suíte congelada** — inclusive `tests_ui_m31.js` e
   `tests_ui_m32.js`, que observam a arbitragem (`U1`, `U2`, `U7`, `U15`, `V10`,
   `V15`–`V17`) e permanecem verdes **sem alteração**. A única escrita em suíte
   congelada é o **repin** de `PROTECTED`, pelo rito da R8 §2.
5. **CSS novo, bridge novo, módulo novo.** Módulo novo foi considerado e recusado:
   ele só poderia atuar por monkey-patch ou por leitura do DOM alheio como canal
   de decisão, os dois proibidos (R9 §3 e §4).
6. **FortiNAC** e o vínculo **FortiSIEM ↔ `network-visibility`** — inexistentes no
   catálogo em qualquer camada (P5 da 009).
7. **Escrever em `.claude/BACKLOG.md`** — a alocação de id `EA-*` é do
   `doc-writer`.
