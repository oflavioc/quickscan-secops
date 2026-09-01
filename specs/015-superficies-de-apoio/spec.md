# Spec — 015-superficies-de-apoio

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.

Rotas aprovadas no portão de 2026-08-31: **S3** (retitular o bloco V3.2 pela
função, nas duas superfícies) · **T3** (declarar a relação entre as curadorias) ·
~~**P14** (fechar o resíduo `C × I` que a 010 declarou e nunca escreveu)~~ —
**P14 derrubado pela errata E1**, ver abaixo. Duas ratificações do proprietário
governam tudo: **nada é removido** e **o sufixo "· contexto V3.2" fica**.

## Objetivo

Fazer cada superfície de apoio do relatório dizer o que entrega e de onde vem, sem
remover um byte de conteúdo — atacando a *redundância de promessa* entre os dois
títulos adjacentes e a divergência silenciosa entre as três *curadorias de
habilitadores*.

---

## Errata E1 — 2026-08-31 · o C4 caiu

**Decisão:** o critério **C4** (declarar o resíduo `C × I` na tela) e o gate
`D015-RES1` **saem do escopo**. Decidido pelo orquestrador sob a delegação do
proprietário, sobre a recomendação que esta própria spec pôs na mesa em
§"Superfície 5 · `#v32panel`".

**A razão, que é o que tem valor para quem ler depois.** C4 acrescentaria texto a
uma tela que o cliente já chamou de carregada — no item cuja ressalva literal é
*"a não ser que isso torne a tela muito poluída"* — e o faria numa seção (Contexto
tecnológico) que passaria a falar de outras duas (Cenário-alvo e Formas de apoio).
Arquitetura de informação fraca, adotada só porque era a única superfície de tela
que `ui_v32.js` possui: o host **certo** — dentro das duas superfícies que
efetivamente duplicam — está fora de alcance, porque uma é `ui_target_v32.js`
(não autorizado) e a outra é a Camada 1 (`frozen`). Pagar poluição por um remédio
no lugar errado é pior do que declarar o resíduo e esperar o host certo.

**O C4 não é apagado.** Foi escrito, medido e derrubado por razão de produto; o
texto original permanece citável abaixo, marcado **DERRUBADO (E1)**. É a R2 §5
aplicada a critério e não a achado: decisão registrada permanece.

**Consequências mecânicas — medidas pelo `tech-lead`, registradas aqui para que o
`spec-validate` não classifique o C4 como "faltando":**

1. **`renderBlocks` fica intocada.** Os dois ramos (`ui_v32.js:236-243` e
   `:294-304`) não recebem nó novo; o veredito `haSubstituto` (`:253`) segue
   servindo só à arbitragem e à frase do card base, como a 010 o deixou.
2. **Restam CINCO critérios**: C1, C2, C3, C5, C6. A numeração **não é
   reaproveitada** — não existe "novo C4".
3. **`M11`, `M12` e `M13` são aposentados, sem reuso de id** (R12: id citado nunca
   renumera). Inclui `M13`, cuja marca **"não sei"** na guarda de tautologia deixa
   de existir junto com a alínea que ele atacava — a dúvida não migra para outro
   critério nem vira dívida órfã.
4. **O resíduo `C × I` volta a ficar aberto e declarado**, e continua no backlog,
   que é onde pertence. Não é dívida desta demanda: é achado com host conhecido e
   bloqueado por boundary.
5. **Nenhum outro critério muda por causa do C4** — C1, C2, C3, C5 e C6 não
   dependiam dele.

**Emenda de instrumento, no mesmo passe (independente do C4).** A estimativa de
orçamento do `#pr-howto` que eu carregava (~540 chars) estava errada **por
métrica, não por conta**: o `tech-lead` mediu **585 crus** e **544 normalizados** —
duas medidas de duas suítes, e a que **reprova primeiro é a crua**. Folga real
para o 7º item: **~308 caracteres visíveis**, não ~360. `C3(b)` foi emendada para
nomear as duas métricas e as duas suítes. A alínea original ("`txt(#pr-howto).length
≤ 900`") media a métrica certa **por acaso** — `txt` é `textContent` puro, que é a
crua; o erro estava em eu comparar esse limite com uma estimativa normalizada.

**Restrições incorporadas no mesmo passe.** Três constatações do `tech-lead`
entraram como alíneas ou regressões nomeadas de C1 — **nenhuma contradiz critério
desta spec**; ver §"Restrições da Fase 2 incorporadas".

## Autorização nominal §29.4 — registro

O proprietário autorizou nominalmente, **no chat, em 2026-08-31**, a edição de
**`ui_v32.js`** para esta demanda. A autorização é **NOMINAL, por arquivo, e vale
só para a 015**: não amplia a boundary para outra demanda nem para outro arquivo.

**`ui_target_v32.js` NÃO está autorizado.** Consequência vinculante: nenhum
critério desta spec pode ser satisfeito por edição daquele arquivo, e `D015-GOV1`
existe para provar que ele não foi tocado. Se a Fase 2 concluir que ele é
necessário, o rito é **PARAR e devolver ao orquestrador**, que reabre a pergunta
com o proprietário — nunca assumir cobertura por analogia com a 009 ou a 010.

Consequência mecânica: `ui_v32.js` é pinado por **dois** gates —
`P50-GOV1` (mapa `PROTECTED`, `tests_p50_core.js:192`) e `P50-IC4` — e o registry
`.claude/verify/pins.json:300` carrega a mesma identidade
(`d594dafec00d11efa2c25d6fe3183f1d5177343f09c925dfcc7055b17df9bb85`, conferida
nesta escrita: as duas fontes em acordo). Toda entrega que altere o arquivo exige
**repin inline** com comentário-trilha (R8 §2: motivo, data, "Identidade
anterior") **e** `gen_pins.py` no mesmo PR (R8 §1).

---

## Errata E2 — 2026-08-31 · três divergências medidas no red

O `qa-engineer` mediu três divergências contra esta spec no red (`8396a4c`,
2 PASS · 3 FAIL de 5) e **as devolveu em vez de acomodar**. Em duas, **a spec
estava errada e é a spec que se emenda** (R10 §1); na terceira, a disciplina dele
vira precedente escrito. Nenhum gate foi afrouxado.

### E2.1 · `C1(h)` era meio-inerte, e uma frase minha era falsa

~~"**M18** acrescentar o eyebrow a `HIDE_EYEBROWS` ⇒ (h) morre, **e `U15` cai
junto**"~~ — **a segunda metade é FALSA.** Fica riscada com a razão, não apagada
(R2 §5). E a razão é dupla; a segunda metade é mais forte do que a medição que a
levantou:

1. **Runtime.** `hideLegacyRecommendation` varre **filhos diretos** do escopo e
   **retorna** ao encontrar `#v32panel` (`ui_v32.js:181`). O `.section-title` de
   `#v32prio` é neto (`#v32panel > #v32support > .section-title`), logo **nunca é
   visitado**. Pôr o eyebrow na lista não produz diferença observável — medido
   pelo `qa-engineer` no HTML construído.
2. **Oráculo.** `U15` **não lê a lista do produto**: usa uma **cópia hardcoded**
   (`tests_ui_m31.js:279-280`), e é dela que saem `inHideRendered` (`:282`) e
   `noOverreach` (`:285`). Ainda que o runtime mudasse, mutar o array do produto
   **não teria como alcançar `U15`**. Conferido por leitura nesta escrita.

**Direção: adoto a partição, com uma correção de classificação.**

- **`C1(h1)` — pertinência.** O texto do eyebrow não pertence a `HIDE_EYEBROWS`
  (`ui_v32.js:109-110`) nem às suas duas cópias. Asserção sobre o **fonte**, no
  precedente já aceito do `/Forti[A-Z]/` de `P52-REC1`. **É o que `M18` mata**, e
  é o único carrasco dele.
  *Por que vale a pena, já que hoje não custa nada:* o escopo da varredura **já
  foi alterado uma vez** — a 5.2 o moveu de `screen` para a seção de apoio
  (`ui_v32.js:171-177`). Um título dentro de `HIDE_EYEBROWS` é bomba armada para
  a próxima vez que alguém mexer no escopo. Sem esta justificativa escrita, um
  leitor futuro apaga a alínea por "não medir nada".
- **`C1(h2)` — runtime.** O nó nunca recebe `.v32-hidden` em E1–E8. **Mantida sem
  mutante.**

**Correção de classificação — não é a classe da 010.** O `qa-engineer` propôs
arquivar `(h2)` como *"cláusula defensiva inalcançável por construção"*, a classe
que a 010 registrou. **Recuso a etiqueta, mantendo a decisão.** A classe da 010
é para cláusula que **nenhuma mudança pode tornar falsa** — só pode deixar o
produto mais conservador. `(h2)` é falsificável, e o **gatilho tem nome**: mudar o
escopo da varredura. Chamo-a **cláusula sentinela**. A distinção não é cosmética —
a classe da 010 diz "não reporte"; sentinela diz "reavalie quando o gatilho
disparar". Arquivar uma como a outra faz a alínea morrer de abandono.

> **Candidato a verbete do `CONTEXT.md`** (não gravo: o portão da Fase 0 está
> fechado): *Cláusula sentinela — asserção que não pode falhar no estado atual do
> produto, mas cujo gatilho de falsificação é nomeado. Distinta da cláusula
> defensiva inalcançável por construção, que nenhuma mudança pode tornar falsa.*
> Decisão do usuário, na próxima demanda.

### E2.2 · `M15` mata `(b)`, não `(d)` — e eu afirmei sem ter medido

Escrevi "`M15` ⇒ (b) e (d) morrem". **Nunca medi.** O `qa-engineer` mediu: numa
entrega **aditiva**, o nó novo compensa o texto suprimido e `(d)` não dispara.

**Direção: adoto a forma ampla, e reatribuo.** `M15` passa a suprimir as opções
dos **quatro** qids — queda medida de **~1.100 chars** —, matando `(b)` **e**
`(d)`. Na forma estreita, `(d)` ficaria **sem carrasco**.

**E declaro o limite do instrumento, que é o achado real por trás disso.** A
alínea `(d)` é **rede, não guarda**: em entrega aditiva **não detecta subtração
menor que a própria adição**. É o espelho da E18 da 010 — lá a contagem de
caracteres *revelou* uma subtração de 31%; aqui ela pode *mascarar* uma. As
guardas de não-subtração são `(a)`, `(b)` e `(c)`, que comparam **conjuntos**;
`(d)` só apanha o grosseiro. Fica escrito na alínea, para que ninguém a cite como
prova de que nada sumiu.

### E2.3 · `M14` nascia SOBREVIVENTE — e a contenção do QA vira precedente

Nenhum dos sete estados tinha capability de prioridade em `presentationOf ===
null`. O `qa-engineer` varreu **120 combinações**, achou o caso e o acrescentou à
fixture — e **não declarou o conjunto no assert**, porque declará-lo
**preemptaria** a alínea `(a)`.

**Direção: endosso, e registro como precedente da demanda.** É a diferença entre
**fixture que estabelece estado** e **fixture que resolve o gate por antecipação**.
Se o assert declarasse o conjunto esperado, `(a)` conferiria a fixture contra a
própria declaração — equivalente por construção, exatamente o `E5` da 010
("verdadeira por estado, não por gate"). *Fixture declara estado; gate declara
expectativa. Quem escreve os dois no mesmo lugar não tem oráculo, tem eco.*

**Consequência: falta um estado, e a falta é minha.** O caso que ele encontrou é
a borda **C5** do meu refinamento — prioridade declarada **sem gap**, que cai em
`presentationOf → null` e rende `neutralPrioCardHTML`. Eu a levantei na Fase 0 e
**não a levei** para a tabela E1–E7. Entra como **E8**, creditada à varredura.

### E2.4 · `N41` não cobre o papel — `C1(g)` pesa mais do que eu escrevi

Eu deixei o escopo de `N41` como "a confirmar". **Confirmado: `N41` não impõe
restrição alguma ao `<h3>` novo**, e `N40` também não alcança o papel — o
relatório impresso é filho de `body` (`ui_v32.js:786-789`), fora de `#app`.

~~**Direção: a metade-papel de `C1(g)` deixa de ser redundância com o acervo e
vira obrigação nova — e por isso precisa de mutante próprio.** `M17` ataca a
metade de **tela**, onde `N40` também mataria: mutante que morre em dois lugares
é prova fraca do poder do gate novo. A metade de **papel não tinha carrasco
algum**.~~ Nasce **`M19`** — duplicar no papel o título de outra seção.

#### Emenda E3 — 2026-09-01 · a razão estava errada; a conclusão ficou mais forte

**A frase "`N40` também mataria [`M17`]" é FALSA, e fica riscada com a razão**
(R2 §5). Medido pelo `qa-engineer`, conferido por leitura nesta escrita: o cenário
de `N40` (`tests_journey_m45.js:220-224`) é `boot()` + `answerAll` +
`showResults()`, **sem salvar landscape** — logo `isLegacyModeV32()` é verdadeiro,
`renderBlocks` toma o ramo legado (`ui_v32.js:236-243`) e **`#v32prio` não nasce**.
`N40` não enxerga aquele eyebrow **em forma alguma**. Sob as **duas** formas do
mutante, `journey` fechou **31/0**.

**E `p52layout` também não o vê:** varre **filhos diretos**, e o nó é **neto**
(`#v32panel > #v32support > .section-title`) — exatamente a inalcançabilidade
estrutural que sustenta a cláusula sentinela `C1(h2)` (E2.1). Duas alíneas desta
spec, uma que assere e outra que se abstém, apoiam-se **no mesmo fato do DOM**.

**O que passa a valer:**

1. **As DUAS metades de `C1(g)` — tela e papel — são obrigação exclusiva de
   `D015-TIT1`, sem cobertura congelada.** Derivei `M19` julgando descoberta só a
   metade-papel; **as duas** estavam. A conclusão da E2.4 não cai: **fica mais
   forte**, e o gate novo é a única proteção de unicidade de título nas duas
   superfícies.
2. **`M17` é o carrasco da metade-tela pela razão certa** — não "apesar de `N40`",
   mas **porque nada mais alcança aquele nó**. A qualificação "prova fraca" sai:
   ela nascia de um carrasco concorrente que não existe.
3. **A forma literal que escrevi para o `M17` não isola.** Trocar o texto do
   eyebrow pelo de outro título **leva junto o sufixo ratificado**, e o gate
   reprova primeiro por `(b)`. **Detecção incidental não é kill**: o par morreria
   com a razão errada e `(g)` continuaria sem prova. A forma adotada ataca a mesma
   propriedade **emitindo o `section-title` duas vezes** — o literal fica intacto,
   `(b)` permanece satisfeita, e dispara **só** a alínea certa.
4. **`M19` permanece**, agora como carrasco da metade-**papel**, pela mesma regra
   de isolamento.

**A lição de método, porque é maior que o caso:** *um mutante só prova o poder de
uma alínea se aquela alínea for a que reprova primeiro.* Escrever a mutação sem
verificar qual alínea dispara produz par que morre pela razão errada e alínea que
segue sem carrasco — a família "gate verde que não pode reprovar" que esta jornada
já catalogou quatro vezes.

### O que E2 NÃO muda

`D015-NOSUB1` e `D015-GOV1` nasceram verdes por serem critérios de
**preservação**: no red a âncora e o HEAD são o mesmo blob, logo tautológicos
**naquele instante**, com o discriminante vindo dos mutantes. Está escrito na
linha deles desde a Fase 1 e **não é divergência** — nenhuma emenda.

---

## Critérios de aceite → gates

Namespace `tests_015_*.js`; ids `D015-*`. Todo gate abaixo é definido **aqui**,
antes do plano (R3 §1), e é escrito pelo `qa-engineer` — nunca pelo implementador.

| # | Critério | Gate (id · asserção) | Mutante previsto |
|---|---|---|---|
| **C1** | **O título do bloco de prioridades V3.2 deixa de prometer apoio e passa a nomear a leitura que entrega** — porque a promessa é falsa em 2 dos 4 estados do bloco (refinamento, M3). Vale nas **duas** superfícies, com a assimetria do sufixo declarada em C1(d) | **`D015-TIT1`** · (a) o eyebrow de `#v32prio` **não contém** `/apoi(o\|ar\|a)/i`; (b) **contém** a substring exata `· contexto V3.2`; (c) o `<h3>` que precede `#pr-sup-prio` no papel tem **oração principal idêntica** à do eyebrow após remover o sufixo; (d) o `<h3>` do papel **não** contém o sufixo; (e) o eyebrow ≠ e não é substring do título congelado `"Como a Fortinet pode apoiar nas prioridades declaradas"`; (f) **não-vacuidade**: `#v32prio` e `#pr-sup-prio` existem nas fixtures usadas, e a alínea nomeia o estado se não existirem; **(g) [E1] unicidade** — o texto trimado do eyebrow é **único** entre `#app .eyebrow, #app h3`, e o do `<h3>` do papel é único em `#v32-print-report`; **(h1) [E2 · partida] pertinência** — o texto do eyebrow não pertence a `HIDE_EYEBROWS` (`ui_v32.js:109-110`) nem às suas duas cópias; asserção sobre o **fonte**; **(h2) [E2 · cláusula sentinela, sem mutante]** — o nó **nunca** recebe `.v32-hidden` em E1–E8; gatilho de falsificação nomeado: mudança do escopo de varredura de `hideLegacyRecommendation` | **M1** restaurar o literal antigo do eyebrow ⇒ (a) morre · **M2** apagar o sufixo ⇒ (b) morre · **M3** editar só a tela ⇒ (c) morre · **M4** copiar o sufixo para o papel ⇒ (d) morre · **M17** [E1, corrigido em E3] **emitir o `section-title` da tela duas vezes** ⇒ (g) morre, e **só** (g) — a forma literal que eu havia escrito (trocar o texto pelo de outro título) ~~levaria junto o sufixo e reprovaria por (b)~~: detecção incidental não é kill. ~~*prova fraca: `N40` também mataria*~~ — **falso, ver E3** · **M18** [E1, reatribuído em E2] pôr o eyebrow em `HIDE_EYEBROWS` ⇒ **(h1)** morre — ~~e `U15` cai junto~~ **falso, ver E2.1** · **M19** [E2] duplicar **no papel** o título de outra seção ⇒ (g) morre — **único carrasco da metade sem cobertura congelada** |
| **C2** | **O bloco de apoio junto do gap declara a própria ancoragem** — que a lista parte da *capability* do gap, não do nível respondido. É a metade alcançável de T3 com `ui_v32.js` (a outra metade vive em arquivo não autorizado; ver "Resíduo declarado") | **`D015-ANC1`** · (a) todo `[data-pr-gap-support]` traz **exatamente 1** nó `[data-pr-gap-fonte]`, atributo **próprio** (nunca outro valor de `data-pr-gap-why`, que `P51-REC1` já mede); (b) o texto casa a **propriedade** — ancoragem por capability **e** negação explícita de ancoragem por nível — por duas expressões independentes, nunca pela frase inteira; (c) presente nos **dois** ramos de `qsGapSupportHTML` (contexto declarado e não declarado), medido em duas fixtures; (d) o nó **não** nomeia produto (`!/Forti[A-Z]/`) nem repete a lista; (e) **não-vacuidade**: o conjunto de `[data-pr-gap-support]` é não vazio e a contagem é a esperada em cada fixture, declarada no gate | **M5** emitir só no ramo "não declarado" ⇒ (c) morre · **M6** trocar o texto por afirmação de ancoragem por nível ⇒ (b) morre · **M7** reusar `data-pr-gap-why` em vez do atributo próprio ⇒ (a) morre |
| **C3** | **A regra geral entra na caixa "Como interpretar este relatório"** — um 7º item, **estático**, dizendo que o relatório pode apresentar mais de uma lista de possibilidades para o mesmo gap, que elas partem de catálogos e ancoragens diferentes, e que **não se somam** como recomendação | **`D015-HOWTO1`** · (a) `#pr-howto li` = **7**, dentro da faixa 5–8 que `P51-DOC12` (`tests_p50_core.js:3825-3826`) e o gate de PDF (`tests_p50_chromium.js:3595`) exigem; (b) **[emendada em E1]** as **duas** métricas sob o mesmo limite de 900, cada uma nomeada com a sua suíte: **crua** — `txt(#pr-howto).length`, que é `textContent` puro, medida por `P51-DOC12` (`tests_p50_core.js:3827-3828`), **hoje 585**, e é a que **reprova primeiro**; **normalizada** — `.replace(/\s+/g," ").trim().length`, medida pelo gate de PDF (`tests_p50_chromium.js:3570-3571`, `:3597`), **hoje 544**. Orçamento do 7º item: **≤ 308 caracteres visíveis**. As duas medidas ficam registradas no gate, antes e depois; (c) o novo item casa a propriedade (duas expressões: "mais de uma lista" + "não se somam"), nunca a frase; (d) a caixa continua **estática** — `outerHTML` idêntico entre duas sessões de dados diferentes; (e) os 6 conteúdos exigidos por `P51-DOC12:3831-3837` continuam casando | **M8** tornar o item função da sessão ⇒ (d) morre · **M9** remover o item ⇒ (a) e (c) morrem · **M10** escrever o item longo o bastante para estourar 900 ⇒ (b) morre |
| ~~**C4**~~ **DERRUBADO (E1)** | ~~**O resíduo `C × I` é declarado na tela, e só onde ele existe** — quando a leitura congelada da Camada 1 está visível, uma linha diz que o cenário-alvo pode listar os mesmos itens porque as duas partem do mesmo catálogo congelado, ancorados de formas diferentes~~ · **Razão da queda em E1**: acrescentaria texto à tela que o cliente chamou de carregada, num host que não é o certo | ~~**`D015-RES1`** · (a) com a Camada 1 **visível** (estados E1 e E2), `#v32panel` traz **exatamente 1** `[data-v32-relacao="catalogo-unico"]`; (b) com a Camada 1 **oculta** (estado E3), o nó **não existe**; (c) o texto é **condicional** e **não afirma** a existência do cenário-alvo; (d) o nó não nomeia produto e a contagem de `.v32-decl-row` fica inalterada; (e) **não-vacuidade**: em E1 e E2 a Camada 1 está de fato visível~~ · **gate não é escrito** | ~~**M11** · **M12** · **M13**~~ — **aposentados, ids não reusados** (R12) |
| **C5** | **Nada é removido** — a ratificação do proprietário, como asserção. É o instrumento que a 010 só construiu depois da reprovação (E18) | **`D015-NOSUB1`** · contra **âncora de commit imutável + SHA** (R10 §5, nunca `HEAD:`), nos estados E1–E8: (a) o conjunto de `data-cap` de `#v32prio` é **idêntico**; (b) o conjunto de nomes em `[data-pr-gap-opt]` é **idêntico**; (c) os conjuntos de `data-cap` de `#pr-sup-prio`, `#pr-sup-base` e `#pr-sup-maturity` são **idênticos**; (d) `txt(#pr-support).length` e `txt(#pr-findings).length` **não diminuem** — **[E2] esta alínea é REDE, não guarda**: em entrega aditiva não detecta subtração menor que a própria adição; as guardas são (a)(b)(c), que comparam **conjuntos**, e (d) não pode ser citada como prova de que nada sumiu; (e) **não-vacuidade**: cada conjunto comparado é não vazio em ao menos uma fixture, nomeada no gate | **M14** colapsar em aviso o card de prioridade sem payload (a rota S4, recusada) ⇒ (a) morre — **[E2] exige o estado E8**, sem ele nascia SOBREVIVENTE · **M15** [E2 · **forma ampla**] suprimir as opções dos **quatro** qids de `QS_GAP_SUPPORT` ⇒ (b) **e** (d) morrem, queda medida de **~1.100 chars**. ~~Forma estreita (só o qid que é prática-alvo) ⇒ (b) e (d)~~ — **falso em (d), ver E2.2**; na forma estreita (d) ficaria sem carrasco |
| **C6** | **A autorização não foi excedida** — `ui_target_v32.js` intocado, provado pelo **produto**, não só pelo hash | **`D015-GOV1`** · (a) `#pr-target` **byte-idêntico** entre a âncora imutável e HEAD, nos estados E1–E8 — inclui `.ux-tgt-en`, `[data-ux-enablers="a-validar"]` e `[data-ux-absence="target-enablers"]`; (b) o conjunto de `data-eid` do card-alvo é idêntico; (c) **não-vacuidade**: ao menos uma fixture com `#pr-target` presente e com `[data-ux-enablers]` não vazio, nomeada no gate; (d) o gate **nomeia** o estado E6 (sem cenário-alvo) como o caso em que `#pr-target` legitimamente não existe, e não o confunde com regressão | **M16** mover a declaração de C2 para o card-alvo ⇒ (a) morre — é o mutante que guarda a boundary, não o comportamento |

### Guarda de tautologia — por critério

O coordenador pediu, e a 010 pagou sete vezes por não ter: *existe estado
alcançável em que o critério falha?* Onde a resposta for "não" ou "não sei", está
escrito.

| Alínea | Existe estado alcançável de falha? | Consequência declarada |
|---|---|---|
| `D015-TIT1` (a)–(e) | **Não, por sessão.** O eyebrow e o `<h3>` são **literais constantes**: uma vez implementados, nenhuma sessão os faz variar | **Dívida declarada, não disfarçada:** o discriminante destas alíneas é **exclusivamente o mutante** (M1–M4), nunca a fixture. Rodar mais fixtures não aumenta o poder do gate. Registrar assim na matriz; contagem de fixtures aqui é ruído |
| `D015-TIT1` (f) | **Sim** — E5 (sem prioridades) não produz `#v32prio` | A alínea tem de **nomear o estado**, não fechar verde por ausência de sujeito (lição do `D010-INV7`, achado `EA-11`) |
| `D015-ANC1` (a)(b)(d) | **Não, por sessão** — texto constante nos dois ramos | Mesma dívida de C1: discriminante é M6/M7 |
| `D015-ANC1` (c) | **Sim** — os dois ramos dependem de `TECH_LANDSCAPE[cap].presence` | Discriminante real por fixture; M5 o prova |
| `D015-ANC1` (e) | **Sim** — E6/E7 e sessões sem gap nos 4 qids esvaziam o conjunto | É a guarda que impede (a)–(d) de fecharem verdes sobre conjunto vazio |
| `D015-HOWTO1` (a)(b)(c)(e) | **Não, por sessão** — a caixa é estática por exigência de `P51-DOC12` | Discriminante é M8–M10 |
| `D015-HOWTO1` (d) | **Sim** — basta o item passar a depender de `ans`/`suff` | Único ponto do C3 com discriminante de estado |
| `D015-TIT1` (g) · metade **tela** **[corrigido em E3]** | **Sim** — M17 o prova, **e é o único que o prova**: `N40` roda em modo legado, onde `#v32prio` **não nasce** (`tests_journey_m45.js:220-224`), e `p52layout` varre filhos diretos, sendo o nó **neto** | ~~Prova fraca~~ — **obrigação exclusiva deste gate**. Exige a forma de mutante que **isola** (emitir o título duas vezes), não a que troca o literal |
| `D015-TIT1` (g) · metade **papel** **[E2]** | **Sim** — M19 o prova, e é o **único** que o prova: `N40`/`N41` **não alcançam o papel** (o relatório é filho de `body`, fora de `#app`) | **Obrigação nova, não redundância com o acervo.** Sem M19, (g) seria gate verde sem poder de reprovar |
| `D015-TIT1` (h1) **[E2]** | **Sim** — M18 o prova, e é o único carrasco dele | Asserção sobre o **fonte**, no precedente do `/Forti[A-Z]/` de `P52-REC1` |
| `D015-TIT1` (h2) **[E2]** | **Não, no estado atual** — a varredura nunca visita o nó (`ui_v32.js:181`) | **Cláusula sentinela, sem mutante.** NÃO é a classe da 010 (inalcançável por construção): é falsificável, e o **gatilho tem nome** — mudança do escopo de varredura, que já ocorreu uma vez (`ui_v32.js:171-177`). Reavaliar quando o gatilho disparar; não arquivar como "não reporte" |
| ~~`D015-RES1` (a)(b)(e)~~ | ~~**Sim** — E1/E2 × E3 são estados distintos e alcançáveis~~ | **APOSENTADO (E1)** — o gate não é escrito |
| ~~`D015-RES1` (c)~~ | ~~**Não sei.** Regex de ausência sobre texto constante~~ | **APOSENTADO (E1).** A marca "não sei" **deixa de existir junto com a alínea**: não migra para outro critério nem vira dívida órfã. `M13` aposentado, id não reusado |
| `D015-NOSUB1` (a)–(d) | **Sim** — qualquer remoção reprova; M14/M15 são as duas remoções que o portão recusou | Discriminante real |
| `D015-NOSUB1` (e) | **Sim** — fixture mal escolhida esvazia o conjunto | Guarda contra a vacuidade que a 010 encontrou em 4 alíneas (errata `a43d6f4`) |
| `D015-GOV1` (a)(b) | **Sim** — M16 o prova, e qualquer edição de `ui_target_v32.js` reprova | Discriminante real |
| `D015-GOV1` (d) | **Não** — é uma cláusula defensiva sobre E6 | **Cláusula inalcançável por construção, declarada, sem mutante** — classe já registrada em `design-decisions.md` §Candidatas pela 010. Não reportar como código morto |

---

## Restrições da Fase 2 incorporadas — veredito **[E1]**

O `tech-lead` mediu três restrições que esta spec não podia conhecer. **Nenhuma
contradiz critério desta spec**; duas viraram alínea nova, uma virou regressão
nomeada. Conferidas por leitura nesta escrita, com `arquivo:linha`.

### R-1 · A substring `"Como a Fortinet pode apoiar"` é guardada por três asserções congeladas

| Gate | Arquivo:linha | O que exige |
|---|---|---|
| `U1` | `tests_ui_m31.js:38-39` | em modo legado, **existe** `.section-title .eyebrow` cujo texto **contém** a substring e **não** está oculto |
| `U2` | `tests_ui_m31.js:60-62` | com contexto declarado e substituto, **TODO** `.section-title` cujo texto contém a substring tem `.v32-hidden` |
| `U7` | `tests_ui_m31.js:137-139` | após "Limpar contexto tecnológico", **TODOS** eles voltam visíveis |

**Veredito: não contradiz — subsume parte de `C1(a)` e a estende.** A restrição é
por `.includes()` sobre **todo** `.section-title` do documento, não por igualdade
e não só sobre o eyebrow de `#v32prio`. É de fato **mais forte em escopo e em
consequência**: um eyebrow V3.2 que contivesse a substring nunca receberia
`.v32-hidden` — `hideLegacyRecommendation` pula `#v32panel` (`ui_v32.js:181`) — e
o `every()` de `U2` reprovaria **suíte congelada**, não o gate novo.

**`C1(a)` continua necessária e não vira redundante.** Ela proíbe a família
`/apoi(o|ar|a)/i`, que inclui o literal **atual** — `"Apoio nas prioridades
declaradas · contexto V3.2"` — e esse literal **não** contém a substring de R-1.
Sem `C1(a)`, `M1` (restaurar o literal antigo) sobreviveria. As duas se somam:
R-1 entra como **regressão nomeada** de C1 (`U1`/`U2`/`U7` verdes, sem edição),
não como alínea duplicada — oráculo repetido é ruído, não segurança.

### R-2 · Unicidade de título

`N40` (`tests_journey_m45.js:220-225`) exige **exatamente uma** `"Leitura
executiva"` entre `#app .eyebrow, #app h3`, por **igualdade de texto trimado**;
`N41` (`:226-231`) repete a propriedade no print.

**Veredito: não contradiz, mas acrescenta obrigação que eu não tinha escrito.**
Virou **`C1(g)`**, com o mutante **`M17`**. Nota de risco medida: o literal
candidato `"Leitura das prioridades declaradas · contexto V3.2"` **não** colide
com `"Leitura executiva"`, mas abre uma família de títulos começados por
"Leitura" — e a unicidade é por igualdade **exata**, não por prefixo. O par
tela/papel também não colide entre si, porque o `<h3>` do papel não leva o sufixo
(`C1(d)`) **e** vive em `#v32-print-report`, fora de `#app`.

**[E2] Pendência resolvida, e o resultado inverte o peso desta restrição.** O
escopo de `N41` foi medido pelo `qa-engineer`: **não impõe restrição alguma ao
`<h3>` novo**, e `N40` também não alcança o papel — o relatório impresso é filho
de `body` (`ui_v32.js:786-789`), fora de `#app`. Logo a unicidade de título **no
papel não tem cobertura congelada**: `C1(g)` não é redundância com o acervo, é a
**única proteção**. Foi o que obrigou a criar `M19` (E2.4).

**[E3] E a tela está igualmente descoberta.** `N40` roda em **modo legado**, onde
`#v32prio` não nasce, e `p52layout` não alcança um **neto**. Portanto **nenhuma**
das duas metades de `C1(g)` tem cobertura congelada — a restrição R-2, que entrou
nesta spec como "o acervo já guarda isso", é na verdade **um precedente de forma**
(como se assere unicidade), não uma cobertura. Reclassificada.

### R-3 · O eyebrow tem de continuar fora das listas de ocultação

São **três** cópias da mesma lista: o produto (`HIDE_EYEBROWS`,
`ui_v32.js:109-110`), o oráculo de `U15` (`tests_ui_m31.js:279-280`) e a fixture
da 010 (`FX.D010_HIDE_EYEBROWS`, consumida por `censoCamada1`,
`tests_010_vao.js:166`). E `U15` traz a cláusula `noOverreach`
(`tests_ui_m31.js:284-285`): **todo** `.section-title` com `.v32-hidden` tem de
estar na lista — ou seja, ocultar o bloco novo reprovaria por excesso.

**Veredito: não contradiz; reforça.** Virou `C1(h)`, com o mutante **`M18`** —
**partida em `(h1)`/`(h2)` pela errata E2**, ver E2.1.

**[E2] E o achado das três cópias deixou de ser lateral: é ele que torna `M18`
inerte contra `U15`.** O oráculo lê a **sua própria cópia hardcoded**
(`tests_ui_m31.js:279-280`), não a do produto — logo mutar o array de `ui_v32.js`
não pode alcançá-lo. A duplicação de dado sem dono único não é higiene: é a razão
pela qual um mutante parecia ter carrasco e não tinha. Segue para o backlog, com
esta cadeia.

### R-4 · O título entra no payload de evidência pinado

`P52-SUP3` coleta os textos dos `.section-title` de `#v32support` em `blocos` e os
grava em `P52-SUP3-cards.json` via `evidence(...)`
(`tests_p52_chromium.js:1593-1594`, `:1608`).

**Veredito: não é restrição de produto — é de operação.** Nenhum critério muda.
Mudar o eyebrow muda o payload de evidência, e isso exige o rito de promoção
(R11 §2) e/ou repin do artefato **no mesmo PR**. Entra em DEPENDÊNCIAS do
`build-engineer`/`qa-engineer`, não em critério de aceite.

---

## Comportamento especificado

### Estados de sessão exigidos pelas fixtures

Reuso de `D010-F1`…`F4` onde couber é decisão da Fase 2; o que a spec exige é
**cobertura de estado**, nomeada:

| Id | Estado | Por que existe |
|---|---|---|
| **E1** | Legado puro — nada declarado (`isLegacyModeV32()` verdadeiro) | Camada 1 visível, `#v32support` inexistente. É onde o resíduo `C × I` nasce e onde `#v32prio` **não tem sujeito** |
| **E2** | Vão de contexto parcial **sem** substituto | Camada 1 visível **e** `#v32prio` presente — o pior caso da redundância de promessa, e o estado do cliente pós-010 |
| **E3** | Vão **com** substituto | Camada 1 oculta. ~~Contraprova de `D015-RES1(b)`~~ **[E1]** — o motivo original caiu com o C4; **permanece obrigatório** por `C1(h)` (o eyebrow nunca recebe `.v32-hidden` justamente no estado em que a arbitragem oculta) e por `C5`/`C6` |
| **E4** | Contexto completo, prioridade com gap | `#v32prio` com card cheio: o estado em que o título tem de continuar verdadeiro |
| **E5** | Sem prioridades declaradas | `#v32prio` não nasce; a Camada 1 troca para "Como a Fortinet pode apoiar agora". Sujeito ausente, nomeado |
| **E6** | Sem cenário-alvo declarado | `#pr-target` não existe (`ui_target_v32.js:426`). Guarda de `D015-GOV1(d)` |
| **E7** | Suficiência **fechada** | Nenhuma decisão desta demanda pode ampliar publicação sob gate fechado (INV-3) |
| **E8** **[E2]** | Capability com **prioridade declarada e sem gap** — `presentationOf === null`, card `neutralPrioCardHTML` | **Faltava, e a falta era minha**: é a borda C5 do refinamento, levantada na Fase 0 e não levada para esta tabela. Sem ela, **`M14` nascia SOBREVIVENTE** — nenhum dos sete estados a exercitava. Encontrada por varredura de **120 combinações** do `qa-engineer` |

### Superfície 1 · `#v32prio` — tela (`ui_v32.js:749-750`)

**Entrada:** há ao menos uma capability com prioridade declarada e a sessão não é
legada. **Saída esperada:** o eyebrow nomeia a **leitura** que o bloco entrega, e
não o apoio que ele nem sempre entrega; o sufixo `· contexto V3.2` permanece,
porque é o único desambiguador em relação ao título congelado da 7ª seção.

Literal **candidato, não vinculante**: `Leitura das prioridades declaradas ·
contexto V3.2`. O gate assere **propriedades** (C1 a–e), nunca o literal — o
oráculo não pode ser equivalente por construção à spec. A escolha da redação é do
`ui-engineer`; o julgamento da redação é do `product-owner` na Fase 6.

Os quatro estados do bloco (refinamento, M3) permanecem **intactos**: card
completo, card com serviços, card de encaminhamento e card neutro de prioridade.
Nenhum é colapsado, nenhum muda de conteúdo — `D015-NOSUB1(a)` é a prova.

### Superfície 2 · `#pr-sup-prio` — papel (`ui_v32.js:1275`)

Mesma oração principal do eyebrow, **sem** o sufixo. A assimetria é **declarada,
não acidental**: o sufixo existe para desambiguar de um bloco que só existe na
tela — a Camada 1 nunca é impressa (`ui_v32.css:77`). Isso converte a divergência
tela×papel que o refinamento registrou em decisão escrita.

### Superfície 3 · `[data-pr-gap-support]` — papel (`ui_v32.js:1075-1099`)

**Entrada:** finding cujo qid está em `QS_GAP_SUPPORT` (4 de 15). **Saída
esperada:** além do que já existe, um nó `[data-pr-gap-fonte]` declarando que a
lista parte da **capability** do gap e **não** do nível respondido — a diferença
de ancoragem que produz as listas divergentes medidas no refinamento (M5, 3 de 7
combinações em que nenhuma lista contém a outra).

Restrições duras, todas vindas de `P51-REC1` (`tests_p50_core.js:3336-3437`), que
**não é editado** e é regressão obrigatória:

- o nó é **irmão** de `[data-pr-gap-why]`, com atributo próprio — herdar o
  atributo alheio quebraria o gate da 5.1 sem tocar em código dele;
- todas as opções de `QS_GAP_SUPPORT[qid].opts` continuam listadas (`:3380-3383`);
- o texto **termina em ponto final** — o scanner de FortiClient fatia
  `host.textContent` por `"."` (`:3418`), e uma frase sem ponto se funde à
  vizinha e pode arrastar "FortiClient" para fora do escopo de endpoint;
- o texto não introduz nenhuma das expressões de overclaim (`:3429`) sem negação
  nas 60 posições anteriores.

### Superfície 4 · `#pr-howto` — papel (`ui_v32.js:1110-1121`)

Um 7º item, **estático**, com a regra geral. É a superfície canônica de "como
ler" e já promete ao leitor que "as recomendações são possibilidades" — a regra
nova é a continuação natural, e entra sem criar bloco novo em nenhuma tela.

### ~~Superfície 5 · `#v32panel` — tela~~ · **DERRUBADA (E1)**

> Texto original preservado para trilha. **Não implementar.**
>
> ~~Uma linha, `[data-v32-relacao="catalogo-unico"]`, emitida **apenas quando a
> leitura congelada da Camada 1 está visível** — nos dois ramos de `renderBlocks`.
> Predicado: `legacy || !haSubstituto`, calculado uma vez por render, do mesmo
> veredito que a 010 já usa (`:253`). Sem estado novo, sem cache, sem leitura de
> DOM alheio.~~
>
> ~~**O trade-off, escrito porque o cliente o nomeou.** O item 8 termina com "a não
> ser que isso torne a tela muito poluída". Esta linha acrescenta texto a uma tela
> que o cliente já achou carregada, e o faz numa seção (Contexto tecnológico) que
> fala sobre outras duas — arquitetura de informação fraca, adotada porque é a
> única superfície de tela que `ui_v32.js` possui. O host certo seria dentro das
> duas superfícies que efetivamente duplicam, e as duas estão fora do alcance. Se
> o proprietário julgar a linha ruído, **C4 cai** e o resíduo volta a ficar aberto
> e declarado — o que é resultado legítimo, pela doutrina ratificada em P5 do
> refinamento.~~

**O que de fato aconteceu:** o trade-off acima foi decidido contra a linha, em
2026-08-31 (errata E1). `renderBlocks` fica **intocada** e a tela desta demanda
muda em **um único ponto** — o eyebrow de `#v32prio` (Superfície 1). Todo o resto
da entrega é papel.

---

## Contratos

**Nenhum bridge novo, nenhum `window.__*` novo, nenhum módulo novo, nenhum CSS
novo.** Tudo vive dentro do IIFE de `ui_v32.js` (`:8`).

| Item | Shape | Owner do estado (R9 §5) | Consumidores |
|---|---|---|---|
| `[data-pr-gap-fonte]` | nó de texto dentro de `[data-pr-gap-support]` | **nenhum estado novo** — função pura de `f.id` e do literal | `D015-ANC1`; leitor do PDF |
| ~~`[data-v32-relacao="catalogo-unico"]`~~ | ~~nó de texto dentro de `#v32panel`~~ | — | **APOSENTADO (E1)** — o atributo **não nasce**; `renderBlocks` fica intocada e nenhum nó novo entra na tela |
| 7º `<li>` de `#pr-howto` | literal estático | **nenhum** | `D015-HOWTO1`, `P51-DOC12` |

**Serialização (INV-8):** nada acima entra na sessão; tudo recomputa no import.

**Acoplamento recusado, com a razão — mantido como trilha após E1.** Condicionar a
linha do (hoje derrubado) C4 à existência de prática-alvo exigiria ler
`TARGET_PROFILE` ou chamar `tgtHasOverrides()` — símbolos de `ui_target_v32.js`,
que **não é IIFE** (`:1-11`) e portanto os expõe no escopo global, enquanto
`ui_v32.js` é IIFE (`:8`) mas resolve globais livremente. Ou seja: era
tecnicamente possível ler o estado do módulo **não autorizado** de dentro do
autorizado, sem tocar nele. **Recusado** — é acoplamento inter-módulo fora de
bridge (R9 §3) para dentro do arquivo vedado: contrabando de boundary.
A recusa vale para qualquer critério futuro desta demanda, não só para o C4, e é
por isso que fica escrita mesmo com o C4 fora.

---

## O que NÃO é mensurável por gate — declarado, não disfarçado

O coordenador pediu explicitamente: *"a asserção tem de ser sobre observável; se
não der para medir sem inspeção humana, declare"*.

| O que se quer | O que o gate mede | O que fica fora |
|---|---|---|
| Que a relação entre as curadorias foi **declarada** | Presença do nó, no estado certo, com atributo próprio, casando **duas expressões independentes** sobre a propriedade (ancoragem por capability × por nível), sem nomear produto e sem afirmar o que a sessão não sustenta | **Se o leitor entende.** Nenhum gate mede compreensão |
| Que os títulos deixaram de competir | Ausência do token de promessa no eyebrow, presença do sufixo, paridade de oração principal entre tela e papel, distinção do título congelado | **Se a redação escolhida é boa.** O gate impede o título falso; não produz o título bom |
| Que a tela não ficou poluída | Nada | **Integralmente humano.** É julgamento do proprietário sobre tela/PDF real — e é a ressalva que o próprio cliente escreveu. **Exercido em 2026-08-31**: foi exatamente este julgamento que derrubou o C4 (errata E1) — a prova de que a coluna "o que fica fora" não é decorativa |

**Consequência de processo:** a Fase 6 desta demanda **não fecha só com gate
verde**. O aceite de intenção precisa de leitura humana da redação e do PDF real.
Onde o `spec-validate` acusar "critério sem asserção", a resposta correta é esta
seção — não uma regex inventada para dar aparência de medida.

**Escolha de forma, com o custo.** As asserções de texto usam **atributo
declarado + duas expressões sobre a propriedade**, nunca a frase inteira. Custo
aceito: uma reescrita que preserve a propriedade passa no gate sem reexecução —
é o preço de não repetir o padrão "prova manual apodrece" (errata E16 da 010) e
de não pinar prosa PT-BR num oráculo (R10 §6).

---

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-7 é a governante e é o que a
  demanda serve: título e nó novos são funções determinísticas de estado já
  calculado, e nenhum afirma mais do que a sessão sustenta. INV-2 preservada — a
  oração "nenhum produto é inferido sem contexto" (`ui_v32.js:635-636`, pinada por
  `V10`) fica intacta, e nenhum texto novo converte "não informado" em "não tem".
  INV-3: nenhuma publicação nova sob gate fechado (estado E7 é fixture obrigatória).
  INV-1: `engine_v32.js` e a Camada 1 apenas **lidos**;
  `declared.m41_payload_sha256` (`pins.json:14`,
  `9794b267e4225d8f…4365b`) permanece inalterado — Porta B fechada.
  INV-8: nenhum derivado serializado. INV-10: PT-BR na doc, literais de código
  exatos.
- [x] **`design-decisions.md` — nenhum conflito.** O arquivo canônico é
  `.claude/rules/design-decisions.md` (na raiz **não existe** — resultado
  negativo, já registrado pela 010 e reconfirmado nesta escrita). A entrada
  "cláusula defensiva inalcançável por construção, declarada, sem mutante"
  cobre `D015-GOV1(d)`.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/009` (ordem
  canônica de leitura, ratificada 2026-08-27): **intocada**, esta demanda não
  altera chave nem ordem de seção. `specs/010`: esta spec **consome** a §"Fora de
  escopo" item 1 (item 6a adiado por desenho, "reavaliar com evidência de tela,
  depois de V1" — `spec.md:588-594`) e a fecha; e **fecha** o resíduo do caso C1
  do refinamento da 010 ("exige texto que a explique"), que nunca foi escrito.
  `specs/011`: outra superfície, sem interseção.

### Specs de fase seladas — por leitura, com resultado negativo

Fonte: `.claude/verify/current_phase.json:18-25` — **uma** entrada em
`specs_normativas`: `specs/PHASE_5_0_REV_B.md`, sha
`4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b`. Fase corrente
**5.2 SELADA**; `proxima_fase` `NAO_ABERTA`. Aberta e lida nesta escrita:

**Positivo — o que toca o escopo:**

- `specs/PHASE_5_0_REV_B.md:1613-1620` — §29.4 "Protegidos (lista nominal; edição
  proibida nesta fase)" nomeia **textualmente** `ui_v32.js` (`:1616`), junto de
  `engine_v32.js` e da Camada 1 (`:1615`), e inclui **"todas as suítes congeladas
  (`tests_*.js` existentes)"** (`:1618-1619`). Consequência direta:
  `tests_p50_core.js`, `tests_ui_m32.js`, `tests_ui_m332.js` e
  `tests_p50_chromium.js` — os quatro que esta spec cita como regressão — **não
  podem ser editados**; a única escrita permitida em `tests_p50_core.js` é o
  **repin inline** de `PROTECTED` pelo rito da R8 §2.
- `specs/PHASE_5_0_REV_B.md:1625-1629` — §29.5 encerra com **"Nenhuma superfície
  de print/PDF (protegidas; §23)"**. Três dos cinco alvos desta demanda são de
  papel.
- `specs/PHASE_5_0_REV_B.md:1631-1636` — §29.6: novas semânticas em PDF exigem
  "microfase explicitamente autorizada de Print/Render UX" e **"não recebe
  autorização implícita"**.
- `specs/PHASE_5_0_REV_B.md:1638-1641` — o rito: `STOP → classificar o requisito →
  abrir microfase dedicada → revisão independente`.

**Encaminhamento da §29.5/§29.6, sem assumir cobertura:** a autorização nominal de
2026-08-31 é **por arquivo** (`ui_v32.js`), e o caminho de print vive dentro dele
(`buildPrintReport`, `:1152`). As demandas **009** e **010** editaram o caminho de
print dos arquivos §29.4 sob autorização nominal de mesma natureza, e os dois
registros de aceitação a trataram como coberta. Registro o precedente **e o
limite**: se o proprietário entender que §29.6 exige palavra própria para o papel,
a Fase 4 **para** — isso está em DEPENDÊNCIAS como confirmação de uma linha, não
como suposição desta spec.

**Negativo — o que a leitura NÃO encontrou, e importa:**

- **Nada** em `specs/PHASE_5_0_REV_B.md` sobre **título de bloco de apoio,
  redundância entre superfícies, reconciliação de curadorias de habilitadores ou
  arquitetura de informação do resultado.** A spec selada governa *quais arquivos*
  e *quais superfícies visuais*; não governa *o que os títulos dizem*.
- **Nada** sobre `QS_GAP_SUPPORT`, `MAP`, `PRODUCTS`, `OFFERINGS` ou modo legado.
  A §UAT-07, que governa a tabela de 4 qids, **não é spec normativa**: não consta
  de `specs_normativas` e vive apenas como âncora citada dentro do oráculo
  (`tests_p50_core.js:3385-3390`). Registro o negativo porque ele delimita o que
  esta demanda pode fazer sem reabrir diretriz: **reusar a regra é livre; tocar a
  tabela, não**.
- **Nada** em `specs_normativas` sobre a propriedade "prioridade declarada nunca
  desaparece". Ela é real e vinculante, mas vive **só** nos gates
  (`V10`/`V15`/`V21`/`V22`/`P5`/`P7`/`D010-ABS1`) e em comentário de código
  (`ui_v32.js:722`, `:738`) — **invariante de fato sem âncora normativa escrita**.
  Vai para o backlog como achado (ver "Referenciado, não absorvido").

### Boundary (R6) — as três fontes cruzadas

| Ordem | Fonte | O que diz sobre `ui_v32.js` | O que diz sobre `ui_target_v32.js` |
|---|---|---|---|
| 1ª | `.claude/verify/boundary.json:6-36` (classes) | **Ausente.** `frozen` lista só `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `harness_m41_v313.js`, `v3_1_3_functional_snapshot.json` (`:9-14`) | **Ausente** |
| 2ª | `PROTECTED` / `frozenSuites` (`tests_p50_core.js:82`, `:192`, `:446-449`) | **Presente e pinado** — `d594dafe…9bb85`; guardado por `P50-GOV1` **e** `P50-IC4` | **Presente e pinado** — `81adcb21…c8f5c` (`:302`) |
| 3ª | `.claude/verify/pins.json:300` / `:296` | `d594dafe…9bb85` — **em acordo** com a 2ª | `81adcb21…c8f5c` — **em acordo** |
| — | `specs/PHASE_5_0_REV_B.md:1616` (§29.4) | **Protegido, nominal** | **Protegido, nominal** |

**Resultado negativo declarado:** um cross-check feito **só** contra
`boundary.json` devolveria "`ui_v32.js` é livre" — **falso negativo**, o mesmo que
a 009 cometeu e que só o gate vivo `P50-GOV1` pegou, já na implementação. A lista
legível por máquina é a **menor** das três. Precedência aplicada: onde a prosa
selada divergir do executável, vale o regime de pins (R8;
`docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md`, Disposição §2) — e aqui **não há
divergência**: as três fontes concordam que `ui_v32.js` é protegido e pinado.

**Rito nomeado, autorização PARADA aqui:**

- `ui_v32.js` — **protegido**; autorização nominal §29.4 concedida em 2026-08-31,
  registrada acima. Exige **repin inline** (R8 §2) + `gen_pins.py` no mesmo PR
  (R8 §1). `P50-GOV1` e `P50-IC4` vão reprovar até o repin, e essa janela vermelha
  é **declarada** no `tasks.md`, nunca silenciada.
- `ui_target_v32.js` — **protegido e NÃO autorizado**. Qualquer necessidade dele
  é `STOP` e devolução ao orquestrador.
- `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html` — **`frozen`**, apenas
  lidos. Porta B não é aberta.
- Suítes congeladas — **não editadas**; a única escrita é o repin inline.
- `.claude/verify/pins.json` — classe `registry`: só via `gen_pins.py`, no mesmo
  PR, com motivo no commit.

---

## Fora de escopo

Herdado do refinamento (itens 1–14) e, adicionalmente:

1. **Editar `ui_target_v32.js`** — não autorizado. Consequência aceita: a metade
   simétrica de T3 (o card-alvo declarando a própria ancoragem) **não é entregue**
   nesta demanda. Fica como resíduo declarado, não como omissão.
1-bis. **[E1] Declarar o resíduo `C × I` na tela** — critério C4, derrubado em
   2026-08-31. `renderBlocks` fica intocada e **nenhum nó novo entra na tela**; a
   única mudança de tela desta demanda é o eyebrow de `#v32prio`. O resíduo
   permanece **aberto e declarado no backlog**, com host conhecido e bloqueado por
   boundary.
2. **Editar qualquer suíte congelada** — inclusive `tests_p50_core.js`,
   `tests_ui_m32.js`, `tests_ui_m332.js` e `tests_p50_chromium.js`, que são
   regressão obrigatória e permanecem verdes **sem alteração**. Única escrita: o
   repin inline de `PROTECTED` (R8 §2).
3. **Remover o sufixo "· contexto V3.2"** — ratificação do proprietário. Se a
   implementação concluir que o título ficou intragável com ele, o rito é **parar
   e devolver**, não decidir.
4. **Renomear seção de `P52_SECTIONS`** — apodrece âncora de mutante em duas
   campanhas (`tests_009_mutants.js:127-135`, `tests_p52_mutants.js:244-245`).
5. **Alterar `QS_GAP_SUPPORT`, `QIDS_AUTORIZADOS` ou `MAP`** — a demanda reusa a
   regra e **não** toca tabela nem catálogo.
6. **Reconciliar as curadorias numa fonte única** — demanda própria (P9 do
   refinamento), exige decisão do proprietário sobre reabrir a §UAT-07.
7. **Reconciliar os nomes de capability** entre Camada 1 e engine — achado.
8. **Score, suficiência, tier, estágio, cenário-alvo** — nenhum número muda.
9. **CSS, bridge, módulo, `window.__*`** novos.
10. **Escrever em `.claude/BACKLOG.md`** — alocação de id `EA-*` é do `doc-writer`.

---

## Referenciado, não absorvido

Roteado pelo orquestrador; esta spec **não** os executa nem os transforma em
critério de aceite:

| Item | Dono | Onde vive |
|---|---|---|
| Os 5 itens de medição do `qa-engineer` (pin do literal do eyebrow; `P52-SUP3` pós-S3; contagem de cards sem payload em `#v32prio`; confirmação por execução dos achados **B** e **D**) | `qa-engineer` | `refinement.md` §"O que ficou por medir" |
| Evidência de tela do estado **C2**/E2, pós-E18 | `qa-engineer` | idem |
| Os 4 achados `EA-*` (curadorias divergentes · `P51-REC1` promete "sem duplicação" e não mede · dois nomes para a mesma capability · `neutralPrioCardHTML` sob capability madura) | `doc-writer`, **depois** de conferir a `develop` | `refinement.md` P13 |
| **Achado novo desta escrita:** "prioridade declarada nunca desaparece" é invariante de fato **sem âncora normativa escrita** — vive só em gates e comentário de código | `doc-writer` (id) · `product-owner` (redação) | esta spec, §Cross-check |
| **[E1] Resíduo `C × I`** — card-alvo e `apoio-block` lendo o mesmo `MAP` em duas seções da tela, sem texto que explique. Declarado pela 010 (caso C1 do refinamento dela), **não fechado** por ela nem por esta demanda. Host certo bloqueado: `ui_target_v32.js` (não autorizado) e Camada 1 (`frozen`) | `doc-writer` (id) | backlog — **aberto**, não é dívida desta demanda |
| **[E1, reforçado em E2] Achado:** `HIDE_EYEBROWS` existe em **três** cópias sem dono único — produto (`ui_v32.js:109-110`), oráculo de `U15` (`tests_ui_m31.js:279-280`) e fixture da 010 (`FX.D010_HIDE_EYEBROWS`). **Efeito medido, não hipotético:** mutar o array do produto **não alcança `U15`**, porque o oráculo lê a própria cópia — foi o que fez `M18` parecer ter dois carrascos e ter um só | `doc-writer` (id) · `qa-engineer` (confirmação) | backlog |
| **[E2] Precedente de método, para reuso:** *fixture declara estado; gate declara expectativa*. Declarar o conjunto esperado dentro da fixture preempta a alínea e produz oráculo equivalente por construção (o `E5` da 010) | `qa-engineer` | esta spec, §E2.3 |
