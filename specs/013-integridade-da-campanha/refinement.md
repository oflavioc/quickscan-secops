# Refinamento — 013-integridade-da-campanha

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interrogação do sistema real por Read/Grep no worktree `phase5-013`
> (branch `feature/013-integridade-da-campanha`, nascida de `origin/develop` em
> `077282f`); nada suposto de memória, nada re-lido de documentação como se fosse
> fonte. Não executei comando algum — medições de campanha são do `qa-engineer`
> (ver DEPENDÊNCIAS do relatório de entrega). Origem: o PR #24 (demanda 009) está
> bloqueado pelo job `visual`; os quatro defeitos são pré-existentes e a 009 só
> foi a primeira a tocar `ui_v32.js` e acionar o gatilho da campanha `p51`.

## Necessidade

O prejudicado não é o leitor do relatório — é **quem confia no verde da campanha
de mutação**: o auditor humano na selagem de fase (R4), o proprietário no rito de
Porta A/B do engine (INV-1), o orquestrador que lê "campanha p51: 15/20" como
prova de que os gates ainda discriminam, e o `qa-engineer`, que é obrigado a
produzir essa prova (R3 §5) com um instrumento que hoje mente de três maneiras
diferentes. A R1 abre dizendo que **"invariante sem gate é prosa"**. Esta demanda
persegue o corolário: **gate sem mutante vivo é gate sem prova de poder
discriminante — e a invariante volta a ser prosa por outro caminho**, sem que
nada fique vermelho.

O dano chega ao leitor do relatório em segunda ordem, e por um caminho concreto:
dos quatro mutantes podres, `M51-18` é o guarda do regresso do blocker B1 (o
agregado do relatório sem arredondamento, `ui_v32.js:1026`) e `M51-20` é o guarda
da paridade entre o manual e a ordem real do relatório. Enquanto suas âncoras não
casam, `P51-RPT6` e `P51-DOC13` continuam verdes sem que ninguém tenha provado,
desde a Fase 5.2, que ainda são capazes de reprovar o defeito que os fez nascer.
Se um deles tiver perdido o poder discriminante, o próximo regresso chega ao PDF
do cliente com o pipeline inteiro verde.

Por que agora: o gatilho por path da Onda 3 acabou de acionar a `p51` pela
primeira vez e revelou o acúmulo. Enquanto a campanha não disser a verdade,
nenhuma demanda que toque `ui_v32.js` fecha — a 009 é a primeira, não a última.

## Enquadramento de produto

- **Nenhum byte de produto muda.** Engine, Camada 1
  (`quickscan_secops_soccmm_v3_1_3.html`), HTML gerado e módulos de UI ficam
  intocados; **INV-1 não é acionada** (nem Porta A nem Porta B). Os arquivos a
  tocar são instrumento de prova, não produto.
- **Invariantes tangenciadas — pela prova, não pelo comportamento.** Os quatro
  mutantes podres sustentam gates que carregam: `P51-PDF1` (régua só marca
  posição sob suficiência — vizinhança direta de INV-2 e INV-3), `P51-RPT6`
  (coerência entre KPI, régua, jornada e leitura executiva — INV-7),
  `P51-DOC13` (o manual descreve o score como o produto o produz — INV-10 e
  metodologia) e `P51-UX2` (ajuda contextual por `qid` canônico — INV-7,
  narrativa derivada de evidência). A entrega não muda o que essas invariantes
  afirmam; devolve a elas a prova executável de que os gates as defendem.
- **R10 §2 violada dentro do próprio harness de mutação.** "SKIP silencioso é
  FAIL" nasceu do E6 (23 gates visuais pulando com exit 0). O `run()` de
  `tests_p51_mutants.js:186-187` engole a exceção, `linhaFail` fica vazia
  (`:202`) e o mutante é rotulado `NÃO DETECTADO` (`:209`) — **mutante que nunca
  rodou fica indistinguível de mutante que sobreviveu**. É a mesma doença que a
  INV-2 combate no produto (UNSET renderizando como zero): três estados
  colapsados em um rótulo. A campanha precisa de três saídas distintas, como o
  eixo de resposta tem três.
- **R7 §4 violada.** "Dependência de ambiente é declarada, nunca implícita." A
  `p51` depende de `python3` no PATH (`:200`, `:205`) e de shell POSIX para o
  prefixo inline de variável (`P50_ONLY=X node …`, `:30-182`) — nenhuma das duas
  está declarada em lugar nenhum. Pior: o requisito que ela *declara*
  (`mutation_map.json:47`, `"python"`) é verificado por
  `check_mutation.py:30-31`, que **retorna `True` incondicionalmente** — é uma
  declaração que nunca reprova.
- **R10 §1 aplicada a mutante — o critério central desta demanda.** "Nunca
  enfraquecer o gate para passar." Reancorar um mutante em qualquer texto que
  case, sem entender que propriedade ele pretendia matar, é exatamente
  enfraquecer o gate: a campanha volta a 20/20 sem provar nada. Detalhado abaixo.
- **Conflito com decisão registrada?** Não. O R13 registra `docs_phase5/**` como
  histórico selado — esta demanda não retro-ajusta nada de lá; edita instrumentos
  vivos. A KI-3 ("suítes visuais fora do agregado local; execução canônica é o
  job `visual`") é *reforçada*, não contrariada: a demanda não pretende fazer as
  suítes Chromium rodarem no Windows — pretende que a **campanha diga por que não
  rodou** em vez de reportar um número.
- **Boundary e pins — verificado, sem surpresa.** Nenhum dos quatro harnesses de
  mutação está em `PROTECTED` (16 entradas, `tests_p50_core.js:82-229`) nem em
  `frozenSuites` (13 entradas, `:235-238`); nenhum está em `boundary.json`. Todos
  são **pinados** (`pins.json:177,183,184,187`), assim como `USER_GUIDE.md`
  (`:97`) — edição livre com repin no mesmo PR (R8 §1), sem rito de boundary. A
  prosa da §29.4 (`specs/PHASE_5_0_REV_B.md:1618-1619`, "todas as suítes
  congeladas (`tests_*.js` existentes)") é a tensão já registrada como **EA-1
  Face B**, com `fix-finding` encomendado — **não deve ser re-litigada aqui**
  (R13); registro-a por honestidade, não como obstáculo.
- **Alternativa mais simples considerada e por que não basta.** (i) *Reancorar as
  quatro e desbloquear a 009* — é o teatro nomeado no critério central: entrega
  20/20 sem entender o que se prova, e deixa o mecanismo de apodrecimento
  girando. (ii) *Só consertar a portabilidade* — não desbloqueia a 009, porque as
  quatro âncoras continuam podres no CI Linux. (iii) *`fix-finding`* — recusado
  pelo proprietário no chat (2026-08-29): o escopo estoura o limite de 1 módulo
  da skill. Confirmo a recusa por um segundo motivo: `fix-finding` pressupõe
  achado **registrado** com cadeia fechada, e a cadeia do achado estrutural (o
  EA-4) só fecha depois da investigação que esta demanda faz.

### Critério central — a triagem de três saídas

Toda âncora podre passa por três perguntas, **nesta ordem**, com a resposta
registrada por escrito antes de qualquer edição. Escolher a âncora nova pelo
critério "casa e passa" é proibido: escolhe-se pela **propriedade** que o `desc`
do mutante documenta, e verifica-se depois.

1. **A propriedade que o mutante ataca ainda existe no produto?**
   Não existe → **aposentadoria** (remoção com a razão registrada: qual decisão
   ou fase a retirou), e o gate que ficou sem mutante vira **dívida declarada**
   na `mutation-matrix.json` — nunca omissão silenciosa. Existe → pergunta 2.
2. **O gate ainda faz a asserção correspondente, e o `reason` ainda casa a
   mensagem que ele emite hoje?** Se o gate mudou de forma (foi o que aconteceu
   com `P51-UX2` na REV B: o exemplo migrou para o *placeholder*,
   `tests_p50_core.js:2709-2716`), reancorar não basta — o par
   (mutante, gate, `reason`) é **re-derivado da mensagem atual do gate** e
   re-registrado.
3. **A reancoragem produz a MESMA violação?** Obrigações de prova, cumulativas:
   (a) a âncora nova é **única no arquivo** (ver borda 4 — hoje o harness só
   reprova `n < 1`, `tests_p51_mutants.js:196-198`, e `String.replace` muta a
   primeira ocorrência); (b) o mutante é morto **pelo gate esperado e com o
   motivo esperado**, nunca por detecção incidental (o cabeçalho do harness já
   exclui manifesto, sintaxe e crash, `:9`); (c) o mutante **sobrevive** quando a
   asserção correspondente do gate é neutralizada — é o red/green do mutante, e é
   o que separa prova de coincidência.

Quem propõe a âncora nova e a justificativa é o `qa-engineer` (R3 §2: o
implementador nunca escreve o próprio critério). Quem confere a **intenção** — se
a propriedade defendida continua sendo a que o mutante documentava — é o
`product-owner`, na Fase 6.

## Sistema real

Tudo abaixo foi lido nesta sessão, no worktree `phase5-013`.

**Os quatro mutantes podres — confirmados, com a causa de cada apodrecimento.**
Todos com o gate ainda **vivo**: o que morreu foi a âncora, não a asserção.

| mutante | causa verificada do apodrecimento | propriedade ainda existe? |
|---|---|---|
| `M51-03` | REV B migrou o exemplo para o *placeholder* e reescreveu o texto do `mandate`: a âncora procura `"Ex.: charter aprovado pelo CISO…"`, e hoje `ui_p50_shell_v32.js:577` diz `"Ex.: direcionamento aprovado pelo CISO…"`. O gate `P51-UX2` (`tests_p50_core.js:2689`) continua reprovando MSSP fora de `monitoring-coverage` (`:2723-2724`), e o exemplo canônico de MSSP segue vivo em `:625` | **sim** |
| `M51-16` | a REV B §11.2 inseriu um bloco de comentário entre `let h = qsCoverHTML();` (`ui_v32.js:1036`) e o `h += …` seguinte, que também ganhou `data-pr-band="wide"` (`:1041`). A âncora exige as duas linhas coladas | **sim** (capa antes do cabeçalho, `P51-PDF1` vivo em `tests_p50_chromium.js:3500`) |
| `M51-18` | a errata externa B-01 inseriu comentário + `const pub = publishableStats(stats, suff);` (`ui_v32.js:1027-1029`) entre `const overall` e `const {findings, validate}`. A âncora exige as três linhas em sequência | **sim** (o arredondamento canônico está em `:1026`; `P51-RPT6` vivo em `tests_p50_core.js:3000`) |
| `M51-20` | a REV B renumerou e reescreveu a §12 do manual: a âncora procura "3. … — caixa curta…" seguido de "4. **Prioridades…**;", e hoje `USER_GUIDE.md:423-427` traz o item como **2**, com dois-pontos no lugar do travessão, e "Prioridades" como 4 com ", já na **página 2**" | **sim** (`P51-DOC13` vivo em `tests_p50_core.js:3648`; e `M51-19`, no mesmo gate, tem âncora **intacta** em `USER_GUIDE.md:291-293` — o contraste é a prova de que o defeito é da âncora, não do gate) |

**A campanha `p51` é Linux-only por construção e não declara** (R7 §4):
`tests_p51_mutants.js:200` e `:205` chamam `run("python3 build_v32_html.py")`; os
`cmd` de todos os 20 mutantes carregam prefixo POSIX de variável
(`P50_ONLY=…` / `P50_NO_EVIDENCE=…`). No Windows o rebuild nunca acontece e o
`cmd.exe` recusa o prefixo — os gates rodam contra HTML velho, ou nem rodam.

**O defeito não é exclusivo da `p51`** — e isso muda o corte da demanda:

- `tests_core_mutants.js:22` **já resolveu**:
  `const PY = process.platform === "win32" ? "python" : "python3";`, com o caminho
  entre aspas em `:67` (R10 §7). É a implementação de referência da casa, dentro
  da própria família.
- `tests_p50_mutants.js:85` e `tests_p52_mutants.js:85` repetem
  `execSync("python3 build_v32_html.py", …)` — mesmo defeito, com o mesmo efeito
  silencioso: no Windows o build não acontece e a campanha gateia contra HTML
  velho. Ambas, porém, já passam variáveis pela **opção `env`**
  (`tests_p50_mutants.js:99-101`, `tests_p52_mutants.js:87-89`), que é portável.
  A `p51` é a única que erra nas duas frentes.
- O pipeline já resolveu a portabilidade do nome do interpretador em outro nível:
  `run.sh:17` e `compliance-audit.sh:15` fazem
  `PYBIN=python3; command -v python3 … || PYBIN=python`. Não há mecanismo novo a
  inventar.

**O silêncio tem duas camadas.** No harness: `run()`
(`tests_p51_mutants.js:186-187`) devolve `code:-1` e segue; `linhaFail` fica
vazia; o rótulo impresso é `NÃO DETECTADO` (`:209`) e o agregado (`:214`) é um
número só. Diferença fina que importa: âncora podre **imprime `ERRO … alvo não
encontrado`** (`:197`) e entra no relatório com `why`, mas soma exatamente como
sobrevivente no total — e falha de ambiente não imprime nem isso. No runner:
`check_mutation.py:30-31` (`have("python") → True` sempre) faz o requisito
declarado nunca reprovar; `:69-75` distingue corretamente `DEFER` (CI, com
`MUTATION_DEFER_MISSING=1`, `verify.yml:42`) de `FAIL` nomeado (local) — essa
parte está certa e deve ser preservada.

**A declaração de alvos da `p51` está errada nas duas direções**
(`mutation_map.json:38-50`), e é a causa direta do apodrecimento de `M51-20`:

- `targets` declara `ui_session_v32.js` — **nenhum dos 20 mutantes o toca**
  (alvo fantasma);
- os arquivos que a `p51` realmente muta (`tests_p51_mutants.js:17-24`) incluem
  `ui_p50_v32.css`, `ui_p50_shell_v32.js`, `ui_journey_v32.js`,
  `ui_p50_results_v32.js` e `USER_GUIDE.md` — **nenhum deles está nos `targets`
  da `p51`**;
- `USER_GUIDE.md` **não está nos `targets` de harness nenhum** (conferido nas
  quatro entradas do mapa): é a instância concreta e viva do EA-3 — arquivo
  órfão. O manual mudou na REV B, campanha nenhuma re-executou, e a âncora de
  `M51-20` apodreceu em silêncio por isso.
- Conferido por contraste: `p50` e `p52` **não** têm essa divergência — os
  arquivos que seus harnesses mutam (`tests_p50_mutants.js:20-24`,
  `tests_p52_mutants.js:24-35`) casam com seus `targets`. A `p51` é a única
  desalinhada.

**O registro canônico não tem granularidade para receber o resultado.** A
`mutation-matrix.json:62-72` guarda **uma linha agregada** — `"campanhas P51
(múltiplos)"`, `ultima_prova: {data: "histórica (fase 5.1)", resultado: "KILL"}`.
É uma alegação congelada no tempo apresentada como estado corrente: exatamente a
mesma doença, um nível acima. E não há onde escrever "mutante X foi aposentado
porque Y". O `_meta` do próprio arquivo já dá a régua: *"Gate sem mutante na
matriz é dívida declarada, nunca omissão silenciosa."*

**O recibo da campanha caiu num caminho ignorado.** `tests_p51_mutants.js:216-218`
grava `docs_phase5/evidence_p51/P51-mutation.json`, e esse diretório é
**gitignorado desde a demanda 007** (`.gitignore:14-17`, migração para o evidence
store). Não há sujeira de árvore (o `check_mutation.py:92-96` não acusa), mas a
consequência é real: **o resultado da campanha não tem hoje registro durável** —
no CI ele evapora com o runner. O campo `receipts` do `mutation_map` (declarado
para `p50` e `p52`, não para a `p51`) virou vestigial pelo mesmo motivo.

**EA-3 e EA-4 não existem neste worktree.** `.claude/BACKLOG.md` contém apenas
EA-1 (`aberto`) e EA-2 (`resolvido`); `Grep` por `EA-3`/`EA-4` na árvore inteira
não retorna nada. A reserva do EA-4 e a citação do irmão vivem numa branch que
não vejo — o que é, por si só, um risco de alocação de id (ver rodada 1.6).

**Divergência doc×código encontrada.** O cabeçalho do `tests_p51_mutants.js:1-11`
promete cinco passos por mutante — "aplica a mutação; reconstrói o HTML; executa
o gate esperado; exige FAIL com motivo compatível; restaura e confere o SHA". No
Windows, o passo 2 não acontece e o passo 3 nem começa, e mesmo assim o harness
imprime um veredito por mutante e um agregado. O documento descreve um
instrumento que o código não entrega fora do Linux.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| 1 | Harness roda numa plataforma e não em outra (o caso `p51` no Windows) | A campanha **não emite veredito por mutante nem agregado**. Emite `NÃO EXECUTADO` nomeando o mutante e a causa (`python3 ausente`, `prefixo de env não suportado`) e sai com código de falha. Um número que não foi medido não é impresso — R10 §2. |
| 2 | Mutante cujo alvo mudou de arquivo (o comportamento migrou de módulo) | Não é apodrecimento: é **rebase do par**. A âncora acompanha o comportamento para o arquivo novo, `F.*` e os `targets` do `mutation_map` são atualizados juntos, e a triagem (§Critério central, passos 2-3) é cumprida integralmente. |
| 3 | Mutante cujo comportamento-alvo deixou de existir | **Aposentadoria** com a razão registrada (decisão/fase que o retirou). Se o gate correspondente também morreu, o par some junto; se o gate vive sem mutante, vira **dívida declarada** na `mutation-matrix.json`. Nunca reancorar "em qualquer linha do arquivo" para manter a contagem. |
| 4 | Âncora nova casa **mais de uma vez** no arquivo | **FAIL** do harness. Verificado como risco vivo: `tests_p51_mutants.js:196-198` só reprova `n < 1`, e o alvo natural de `M51-18` (`const overall = suff && scored.length ? Math.round(…)`) existe idêntico em `ui_v32.js:131` (`legacySnapshot`) **e** em `:1026` (relatório) — `String.replace` mutaria o `:131`, e o mutante seria morto por outro gate, por outro motivo, ou por ninguém. |
| 5 | Âncora casa e a mutação é aplicada, mas o gate mudou a **mensagem** e o `reason` não casa mais | Classificado como **rot semântica**, não como sobrevivente. É a hipótese mais econômica para o 1 não-detectado da `p51` e o 1 da `p52`, e tem de ser descartada por leitura antes de qualquer conclusão sobre poder discriminante. |
| 6 | Mutante detectado **incidentalmente** (crash, erro de sintaxe, manifesto) | Não conta como morto — regra já escrita em `tests_p51_mutants.js:9` e que a triagem preserva. Reancoragem que só produz crash é reancoragem reprovada. |
| 7 | Mutante roda, gate falha pelo motivo certo — mas o gate falharia de qualquer jeito | Reprovado: o passo 3(c) exige que o mutante **sobreviva** com a asserção neutralizada. Sem isso não há prova de que foi *aquela* asserção que o matou. |
| 8 | Campanha exigida sem ambiente, sob `MUTATION_DEFER_MISSING=1` | `DEFER` nomeado (`check_mutation.py:69-71`) — comportamento correto, **preservar**. Borda a fechar: o PR não pode ser considerado provado se o job `visual` (`verify.yml:46-50`) não tiver reportado a campanha deferida; deferimento sem contrapartida é o mesmo silêncio, distribuído entre dois jobs. |
| 9 | Requisito declarado que nunca reprova (`have("python") → True`, `check_mutation.py:30-31`) | Declaração sem verificação é declaração implícita (R7 §4). Ou passa a verificar de verdade o interpretador que o harness realmente invoca, ou o requisito sai do mapa. |
| 10 | Arquivo mutado por um harness e ausente dos `targets` dele (`USER_GUIDE.md`) | O `targets` de cada harness é **exatamente** o conjunto de arquivos que ele muta, mais o próprio harness. Nesta demanda, corrigido nominalmente para a `p51`; a checagem **genérica** de órfão em `check_mutation.py:58` é do EA-3, não daqui. |
| 11 | Portabilidade "consertada" movendo o prefixo para a opção `env` e perdendo `P50_NO_EVIDENCE=1` | Regressão: as suítes Chromium legadas regravam evidência (`verify.yml:74-78`) e `check_mutation.py:92-96` reprova "campanha sujou a árvore". A supressão de evidência é parte do contrato do `cmd`, não decoração. |
| 12 | Crash no meio da campanha, entre mutar e restaurar | Comportamento atual **preservado**: árvore suja é pré-condição do stage (`check_mutation.py:39-44`) e a restauração é conferida por SHA (`tests_p51_mutants.js:206-207`). A demanda não pode enfraquecer nenhuma das duas ao tocar o `run()`. |
| 13 | Campanha verde e nenhum registro durável do resultado (recibo em caminho gitignorado) | A prova desta demanda vive em `specs/013-.../matriz-gate-mutante.md` (precedente da 012) e na linha datada da `mutation-matrix.json`. **Não** reintroduzir bytes de evidência no índice (R11 / decisão Q1). |

## Vocabulário

Sete termos **propostos** para o `CONTEXT.md` (formato R12), na seção
*Estrutura (processo)*, junto de **Gate** — que já fala em "poder discriminante
provado por mutante" sem nomear nenhuma das peças. Não editei o arquivo, por
instrução do orquestrador; o registro precisa acontecer **antes do portão desta
fase** (R12), e os blocos abaixo estão prontos para colar.

```md
**Âncora de mutante**:
Trecho de texto exato que localiza, no arquivo-alvo, onde a mutação é aplicada.
Distinta do alvo (o arquivo) e da propriedade (o comportamento defendido).
_Evitar_: alvo, trecho, patch, find

**Âncora podre**:
Âncora que não casa mais nenhum texto do arquivo-alvo. O mutante não chega a ser
aplicado e a campanha o contabiliza como não detectado.
_Evitar_: mutante quebrado, teste falhando, âncora desatualizada

**Reancoragem**:
Reposicionar a âncora no texto atual PRESERVANDO a propriedade que o mutante
defende — só legítima quando o comportamento-alvo ainda existe e a mutação
continua produzindo a mesma violação, provada pelo gate e motivo esperados.
_Evitar_: atualizar o mutante, consertar o find

**Aposentadoria de mutante**:
Remoção de mutante cujo comportamento-alvo deixou de existir, com a razão
registrada na matriz; o gate que fica sem mutante vira dívida declarada.
_Evitar_: deletar mutante, remover teste, limpar campanha

**Mutante não executado**:
Mutante que não chegou a rodar (ambiente ausente, build que não aconteceu,
âncora podre). Terceiro estado, distinto de detectado e de sobrevivente — nunca
somado a nenhum dos dois.
_Evitar_: não detectado (ambíguo), pulado, falhou

**Mutante sobrevivente**:
Mutante aplicado, com o gate executado, e ainda assim não reprovado pelo gate e
motivo esperados — o gate não tem poder discriminante para aquela propriedade.
_Evitar_: mutante não detectado, falso negativo

**Alvo declarado de campanha**:
Conjunto de paths em `mutation_map.json → targets` que dispara a re-execução de
um harness por gatilho de path. Deve ser exatamente o conjunto de arquivos que o
harness muta, mais o próprio harness.
_Evitar_: arquivo do mutante, escopo da campanha
```

Um oitavo termo — **arquivo órfão de campanha** (arquivo que nenhum harness
declara como alvo) — pertence ao vocabulário do EA-3. Recomendo registrá-lo
quando aquele `fix-finding` chegar, para não fixar aqui a definição de um
conceito cuja correção é de outra pessoa.

## Rodadas de entrevista

Rodada 1 — oito perguntas, uma recomendação cada. Nenhuma respondida ainda.

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1.1 | **Os quatro defeitos são uma demanda ou deveriam ser duas?** Você está certo que (a) âncora e (b) portabilidade são naturezas diferentes — uma é julgamento de QA, a outra é engenharia de ambiente. **Recomendo mantê-los juntos, por dependência causal e não por conveniência**: hoje, no Windows, a `p51` reporta 0/20 e **toda** reancoragem seria inverificável localmente; sem (b), a demanda (a) teria de confiar cegamente no CI Linux — exatamente a postura sob auditoria. Além disso (a) e (b) compartilham um único critério de aceite ("a campanha reporta a verdade"), e critério de aceite compartilhado é o teste de que o corte está certo. O corte que eu **resistiria** é (a) sozinho. | — |
| 1.2 | **A entrega é um pacote de quatro peças ordenadas — confirma?** **Recomendo**: **E1 — harness honesto** (portabilidade + três estados distintos no relatório, com causa nomeada); **E2 — triagem das quatro âncoras** pelo critério de três saídas; **E3 — isolamento e *classificação*** dos dois não-detectados restantes; **E4 — declaração verdadeira** (`targets` da `p51` reconciliados + `mutation-matrix.json` da P51 expandida por par, com a prova datada desta demanda). A ordem é obrigatória: E1 é pré-condição de medir E2, e E2 é pré-condição de saber quantos sobreviventes realmente existem — com âncora podre no meio, a aritmética 15/20 não fecha. | — |
| 1.3 | **A investigação dos dois sobreviventes (defeito 4) entra?** **Recomendo: investigação DENTRO, correção FORA.** A classificação tem três saídas possíveis, e só uma delas é demanda nova: rot semântica (`reason` não casa a mensagem atual do gate — borda 5) conserta-se aqui, é a mesma família do defeito (a); mutante cuja propriedade morreu → aposentadoria, também aqui; **gate genuinamente sem poder discriminante → achado `EA-*` próprio e demanda/`fix-finding` separado**, porque o remédio é escrever asserção nova sobre comportamento de produto, que é outro tipo de trabalho e outro dono. Entregar esta demanda sem classificar seria entregar um verde que ninguém sabe explicar — o teatro que ela existe para matar. | — |
| 1.4 | **A portabilidade cobre só a `p51` ou a família?** Verifiquei: `tests_p50_mutants.js:85` e `tests_p52_mutants.js:85` têm a **linha idêntica** (`python3` fixo), e `tests_core_mutants.js:22` já é a implementação correta. **Recomendo declarar o critério de aceite como propriedade da família** — "nenhuma campanha reporta número sem ter executado; ambiente ausente é FAIL nomeado" — aplicada às três harnesses defeituosas, e **sem extrair runner compartilhado**: um módulo novo consumido por quatro harnesses pinados transforma reparo em refatoração (R9), com superfície de risco muito maior que o defeito. Três edições paralelas do mesmo *shape*, com o `core` como referência. Verificado que nenhuma delas está em `PROTECTED`/`frozenSuites`/`boundary.json` — só repin (R8 §1). | — |
| 1.5 | **A reconciliação dos `targets` da `p51` entra, ou é do EA-3?** Duas coisas distintas: a checagem **genérica** de órfão (`check_mutation.py:58` itera harnesses) é do EA-3; a **declaração errada da `p51`** é desta demanda. **Recomendo incluir**: é a causa direta e verificada do apodrecimento de `M51-20` (o `USER_GUIDE.md` não está nos `targets` de ninguém), está no mesmo arquivo-mapa que a demanda já toca, e sem ela a entrega conserta as âncoras de hoje deixando a máquina de apodrecer ligada. Não é "conserto de passagem" (R5): é o mecanismo do defeito que a demanda tem por objeto. | — |
| 1.6 | **EA-4 nasce nesta Fase 0 ou é tarefa da demanda — e quem escreve?** **Recomendo: tarefa da demanda, escrita pelo `doc-writer`** (mantenedor declarado, `BACKLOG.md:3`), **depois** que a branch do EA-3 chegar à `develop`. Três razões: (i) R12 exige a cadeia arquivo:linha→efeito fechada, e a cadeia do achado estrutural só fecha depois da classificação da E3 — pode existir uma quinta variante (rot semântica) que hoje eu só levanto como hipótese; (ii) **risco de colisão de id, verificado**: EA-3 e EA-4 não existem neste worktree, a reserva vive numa branch que não vejo, e duas branches escrevendo o mesmo arquivo com ids que "nunca renumeram" (R12) é conflito de merge no pior lugar possível; (iii) o achado não se perde no intervalo — este `refinement.md` já carrega a cadeia completa como insumo. Não escrevo o EA-4, conforme instruído. | — |
| 1.7 | **EA-4 nasce `aberto` ou já `resolvido`?** **Recomendo `aberto`**, migrando para `resolvido` no mesmo PR **apenas se** a entrega incluir a asserção que reprova âncora podre — decisão que a Fase 1 fecha ao definir os gates. E um ajuste de meia linha, que é do `doc-writer`: o rito do `BACKLOG.md:61-67` nomeia `fix-finding` §4 como o evento que escreve `resolvido` e **não prevê demanda** fechando achado; esta é a primeira vez que acontece. Recomendo incluir "demanda" entre os eventos, em vez de forçar a entrega a caber num vocabulário que não a contempla. | — |
| 1.8 | **Onde vive a razão de uma aposentadoria — e a prova desta campanha?** **Recomendo a `mutation-matrix.json`**: expandir a linha agregada `"campanhas P51 (múltiplos)"` (`:62-72`) em pares por mutante, com `ultima_prova` datada desta demanda; mutante aposentado sai dos pares e o gate órfão entra em `dividas_declaradas` — o `_meta` do próprio arquivo já manda ("dívida declarada, nunca omissão silenciosa"). A prova narrada vai para `specs/013-.../matriz-gate-mutante.md`, no precedente da 012. Motivo extra: o recibo `P51-mutation.json` cai em caminho **gitignorado** desde a 007 (`.gitignore:15`) — hoje a campanha não deixa registro durável nenhum, e a matriz é o único lugar que sobra. Não reintroduzir bytes de evidência no índice (R11 / Q1). | — |

Deste lado o refinamento está pronto para o portão assim que a rodada 1 for
respondida e o vocabulário registrado no `CONTEXT.md`; **quem aprova a fase é o
usuário, no chat** (D3/R4).

## Fora de escopo (explícito)

- **Corrigir gate sem poder discriminante.** Se a E3 classificar algum
  não-detectado como sobrevivente real, o remédio é achado `EA-*` + demanda ou
  `fix-finding` próprio. Esta demanda **classifica e registra**; não escreve
  asserção nova sobre comportamento de produto.
- **A checagem genérica de arquivo órfão** em `check_mutation.py:58` — é o EA-3,
  com dono e rito próprios. Daqui sai apenas a correção nominal dos `targets` da
  `p51`.
- **A tensão da §29.4 / EA-1** (prosa que declara `tests_*.js` congelados vs.
  `PROTECTED`/`frozenSuites`) — `fix-finding` já encomendado pelo proprietário;
  R13 proíbe re-litigar decisão registrada. Verificado que nenhum harness de
  mutação está nas listas executáveis, então a demanda não depende dessa
  resolução.
- **Fazer as suítes Chromium rodarem no Windows.** A KI-3 permanece: execução
  canônica é o job `visual` do CI e o rito manual do proprietário. O alvo é a
  **honestidade do relato**, não a paridade de execução.
- **Qualquer byte de produto** — `engine_v32.js`, Camada 1
  (`quickscan_secops_soccmm_v3_1_3.html`), HTML gerado, módulos `ui_*`,
  `USER_GUIDE.md`. As âncoras se movem para acompanhar o produto; o produto não
  se move para acomodar âncora. INV-1 não é acionada, e nenhum texto do manual
  muda para fazer `M51-19`/`M51-20` casarem.
- **Extrair runner compartilhado** entre os quatro harnesses de mutação — R9;
  vira demanda própria se a repetição incomodar depois.
- **Desbloquear o PR #24 por atalho.** A 009 destrava como *consequência* de a
  campanha passar a dizer a verdade; se a verdade for "há um gate sem poder
  discriminante", a 009 espera a decisão do proprietário — não o contrário.
- **Reintroduzir bytes de evidência no índice do git** (R11 / decisão Q1), nem
  reativar o campo `receipts` do `mutation_map` para caminhos hoje ignorados.
