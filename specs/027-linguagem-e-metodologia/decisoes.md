# Decisões — 027-linguagem-e-metodologia (microfase 02)

> Documento de decisão · dono: product-owner · lente PO + core, **somente leitura**.
> **Este documento propõe; o proprietário decide no chat.** Nenhuma linha aqui
> registra decisão tomada — cada seção termina numa pergunta fechada.
>
> **Quem escreveu**: o `product-owner`, executado pelo modelo **Fable 5.1**
> (`claude-fable-5-1`), em 2026-11-02, sob delegação do orquestrador, no HEAD de
> `develop @ a964498` (v3.2.13 selada, PR #119). *Lido* = conferido por mim no
> source. *Executado* = medido por sonda jsdom read-only sobre
> `quickscan_secops_soccmm_v3_2_dev.html` (boot igual a
> `tests_022_escalonamento.js:89-130`; scripts e saídas em
> `C:/Users/usuario/AppData/Local/Temp/claude/C--Projetos-QuickScan-SOC-CMM/ed12b417-535d-4d8a-94c5-4194158e2cc2/scratchpad/m02/`:
> `sonda-m02.js` → `saida-experimentos.txt`; `sonda-trilha.js` → `saida-trilha.txt`).
>
> **Origem**: auditoria externa de 2026-10-31 (`QS-03..QS-06`, §5, §9) e o plano
> de correção do proprietário, §3 *"Decisões a fechar na microfase 02"*.
> **Fonte dos trechos da auditoria e do plano**: os dois arquivos
> (`Downloads/Auditoria_QuickScan_SecOps_SOC-CMM_2026-10-31.md`,
> `Downloads/Plano_de_correcao_e_prompt_QuickScan_2026-10-31.md`) **não
> estavam mais em disco** quando este documento foi escrito (busca por nome em
> `Downloads/`, `Desktop/`, `Documents/`, `OneDrive/` e no projeto,
> 2026-11-02) — foram removidos depois que o orquestrador os leu. A primeira
> versão seguiu o enunciado do §3 relatado no prompt; a **reconciliação** (mesmo
> dia) foi feita a partir dos **trechos literais citados pelo orquestrador**
> (plano §3 — tabela de decisões e a frase sobre manter as 15 perguntas;
> auditoria `QS-03`, `QS-04`, `QS-05`, `QS-06`, §5.1, §5.3, §5.4), que aparecem
> entre aspas nas seções. Os dois experimentos numéricos foram **reproduzidos
> por execução** e batem com `QS-05` (§9). O que não foi citado pelo
> orquestrador continua não lido.
>
> **Regras aplicadas**: `CLAUDE.md`; `product-invariants.md` (INV-1..10);
> `boundary.md` (`engine_v32.js` e `quickscan_secops_soccmm_v3_1_3.html` são
> `frozen` → rito D2, hoje só Porta B: spec + auditoria humana —
> `boundary.json → classes.frozen`); `design-decisions.md` (candidatas já
> listadas); `documentation.md`; glossário `CONTEXT.md`. Diretrizes do
> proprietário: *rota mais barata sempre*, *produto antes de instrumento*,
> *menos cerimônia*.

## 0 · Como ler

Cada decisão traz: **(a)** o que o produto faz hoje, com `arquivo:linha`;
**(b)** opções, cada uma com a classe de proteção tocada (`frozen` → Porta B;
módulo de produto → demanda normal; só rótulo/copy → fix-finding ou doc), os
gates existentes que o literal toca e o impacto no PDF; **(c)** uma
recomendação em duas frases; **(d)** a pergunta fechada.

Fatos transversais, lidos uma vez e reusados:

- A matemática mora toda na Camada 1 congelada: `SCORES = [0, 1.7, 3.3, 5]`
  (`quickscan_secops_soccmm_v3_1_3.html:294`), `stageOf` (`:485-492`),
  `confirmedCount` (`:494`), `domStat` (`:496-509`), `dataSufficiency`
  (`:511-513`), `renderResults` (`:812-819`). `SCORES` e `stageOf` estão
  também pinados na spec imutável `specs/PHASE_5_0_REV_B.md:212`, `:358`,
  `:1077`, e o gate `P51-RPT3` exige `stageOf()` **byte-idêntica** no HTML
  construído (`tests_p50_core.js:3287-3288`).
- Os módulos **não recalculam**: lêem `domStat`/`stageOf` (`ui_v32.js:1409`,
  `:1439`, `:1062`; `ui_journey_v32.js:3-8`, `:42`; `ui_target_v32.js:23-35`;
  `ui_p50_suff_v32.js:53-70`; `ui_ondas_v32.js:17-20`, `:44`). A régua
  `window.__QS_STAGE_RULER` é derivada por varredura de `stageOf`
  (`ui_v32.js:1028-1043`).
- O PDF nasce em `buildPrintReport()` (`ui_v32.js:1406`): KPIs em `:1436-1444`,
  régua em `:1445`, rodapé `.pr-foot` em `:1580-1581`; a Camada P52 o embrulha
  e aplica `P52_COPY` ao HTML devolvido (`ui_p52_workspace_v32.js:3292-3309`,
  mapa em `:128`).
- Copy de apresentação que um gate usa como observável **cega o gate**
  (memória *copy-de-apresentacao-cega-gate*): antes de mexer num literal,
  grep em `tests_*.js`. As contagens abaixo são desse grep (2026-11-02).
- Os arquivos originais da auditoria e do plano **não estavam mais em disco**;
  a reconciliação de cada decisão com o texto deles usou os trechos citados
  pelo orquestrador (cabeçalho). Onde uma recomendação minha diverge da
  recomendação literal da auditoria, a divergência está dita na seção.
- A escala de severidade (`[2,1,0,0]` por nível, candidata em
  `design-decisions.md:29-30`) é *"distância de um padrão de implementação
  escolhido. Não calcula probabilidade de incidente"* (auditoria §5.4) — nenhuma
  decisão abaixo a toca.

## 1 · Nome do resultado — Índice QuickScan próprio ou bandas próprias

**(a) Hoje.** O número é chamado de *score*: tela `.score-big` `"5.0 / 5.0"`
sob o eyebrow *"Resultado indicativo"* (`…v3_1_3.html:948-950`); PDF KPI
*"Score geral indicativo"* (`ui_v32.js:1438`) e leitura da régua
`"5.0 / 5 · Em otimização"` (`:1062`); capa *"Quickscan SecOps · SOC-CMM"* /
*"Relatório indicativo de maturidade de operações de segurança"*
(`:1111-1112`); README diz *"produz score de 0 a 5, estágio de maturidade"*
(`README.md:6-8`). A legenda da escala usa os nomes CMMI/SOC-CMM em inglês
(`:972`). Nada no produto chama o número de "Índice QuickScan".

O que a auditoria pede (`QS-03`): *"posicionar o resultado como Índice
QuickScan, próprio, baseado em práticas selecionadas e inspirado nos domínios
SOC-CMM"*; e avisa que *"mudar apenas de 0–5 para 0–100 não resolve a
validade"* — por isso nenhuma opção abaixo troca a escala numérica.

**(b) Opções.**

| Opção | O que muda | Classe | Gates tocados | PDF |
|---|---|---|---|---|
| **1-A · "Índice QuickScan (0–5)"** como nome do número, com a qualificação da auditoria (*"baseado em práticas selecionadas, inspirado nos domínios SOC-CMM"*) no `pr-howto` | Só copy: eyebrow/`.score-big` via `P52_COPY`, KPI `:1438`, leitura da régua `:1062`, README/USER_GUIDE | módulo de produto (copy) → **fix-finding** ou demanda pequena | `/(\d\.\d) \/ 5/` em `tests_ux_m41.js:330` e `tests_p50_core.js:1703`, `:1999` lêem o **número**, não o nome — passam. `"Score geral"` não é literal de gate (0 ocorrências) | KPI renomeado; número e régua iguais |
| **1-B · bandas qualitativas próprias** | **É a opção 2-B** — mesma mudança, decidida na decisão 2 (as bandas são o mecanismo da equivalência, não o nome do número) | ver 2-B | ver 2-B | ver 2-B |
| **1-C · manter "score"** | nada | — | — | — |

**(c) Recomendação: 1-A.** Renomear o número é o que o cliente precisa para
não ler "5.0" como um score SOC-CMM, e custa copy. O que fazer com as bandas é
a decisão 2 — as duas andam juntas, mas a pergunta aqui é só o nome.

**(d) Pergunta.** Nome do número: **1-A** (Índice QuickScan 0–5) · **1-C**
(manter "score")? (Bandas: decisão 2.)

## 2 · Equivalência automática a estágio SOC-CMM

**(a) Hoje.** `stageOf(overall)` converte a média em um nome de estágio
(`:485-492`) e o produto **afirma** a equivalência: tela *"posiciona a
operação, de forma indicativa, no estágio Optimizing"* (`:978`), `.stage-tag`
`"Optimizing · Em otimização"` (`:951`), por domínio `"5.0 — Optimizing"`
(`:963`); PDF KPI *"Estágio indicativo"* (`ui_v32.js:1439`), régua *"Você está
aqui"* (`:1057-1058`), jornada por estágio (`ui_journey_v32.js:3-8`). A
candidata já registrada em `design-decisions.md:31-32` — *"`SCORES` combinado
às bandas de `stageOf` faz nível 1 uniforme ler como Managed, nunca
Initial"* — é o mesmo problema visto do outro lado. Medido (experimento ii):
10 respostas de nível 3 e 5 *NA* → `"Em otimização"` em tela e papel.

O que a auditoria pede (`QS-03`): *"O problema é a equivalência comunicada,
não a capacidade de calcular a média. [...] o screening oficial não atribui
níveis de maturidade. [...] Retirar a equivalência automática com estágios
oficiais até haver revisão de âncoras e validação apropriada. Bandas
qualitativas próprias são uma alternativa"*; plano §3: *"Não apresentar
equivalência automática sem revisão/calibração"*. A *revisão de âncoras* é
trabalho metodológico sobre `SCORES`/`stageOf` (`frozen`, Porta B) e **não é
objeto desta microfase**; o que se decide aqui é o que o cliente lê até lá.

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **2-A · nota de não-equivalência, nomes mantidos**: os nomes ficam como *faixa de leitura inspirada na escala SOC-CMM*, com a frase *"faixa de leitura do QuickScan — não é estágio SOC-CMM aferido; equivalência pendente de revisão de âncoras"* no `pr-howto` (`ui_v32.js:1263-1272`); trocar *"no estágio"* por *"na faixa"* (`:978`, KPI `:1439`). **Atende só em parte**: o vocabulário oficial (*Optimizing*, *Managed*…) continua nas superfícies do cliente | copy + 1 item em "Como interpretar" | módulo (copy) → **fix-finding** | nomes continuam existindo → os 13 sítios abaixo **passam**; `tests_p52_chromium.js:1544-1550` exige rodapé da **tela** idêntico ao baseline além da nota de neutralidade → a frase vai ao PDF/`pr-howto`, não ao rodapé da tela | +1 linha; KPI relabel |
| **2-B · bandas qualitativas próprias, `stageOf` intacta**: uma tabela de **rótulos** do QuickScan (6 nomes próprios, PT, sem os nomes oficiais) indexada pelo **índice da banda** de `__QS_STAGE_RULER.bands()` — o mesmo mecanismo que `ui_ondas_v32.js:17-20,44` já usa para o teto —, aplicada em `.stage-tag`/valor por domínio (via `P52_COPY` ou decorador P50), KPI `:1439`, régua `:1050-1051,1062` e jornada (`ui_journey_v32.js:3-8`). Não é segunda fonte de limiar (R9): o índice vem de `stageOf`, só o rótulo é próprio. **Atende a auditoria** (retira a equivalência comunicada; bandas próprias) | tabela de 6 rótulos + 5 sítios de render | módulo → **demanda** (comportamento novo: vocabulário do resultado) | nomes EN pinados em 6 sítios (`tests_p50_core.js:1321`, `:1704`, `:2000`; `tests_p50_chromium.js:331`; `tests_p52_chromium.js:2511`; `tests_p50_mutants.js:589`) e PT em 7 (`tests_journey_m45.js:82`, `tests_ux_m41.js:331`, `tests_p52_layout.js:697`, `tests_target_m431.js:80`, `tests_ui_m332.js:172`, `tests_unset_ug.js:276`, `tests_p52_chromium.js:3958`) — reancorados nos rótulos novos na mesma demanda; `P51-RPT3` (`tests_p50_core.js:3267-3290`) continua verde porque `stageOf` e `bands()` não mudam | régua, KPI e jornada com rótulos próprios; a frase da 2-A entra também |
| **2-C · retirar os nomes de estágio** (só número e faixa numérica) | remove `.stage-tag`, KPI nominal, régua nominal, jornada | supressão por módulo (como P50 sob gate fechado, `ui_p50_results_v32.js:237-254`) → demanda; jornada (`#pr-journey`) perde o objeto | 13 sítios + `tests_ui_m332.js:54-55` (exige `#pr-journey`) | régua perde rótulos; jornada sai |
| **2-D · manter** | — | — | — | — |

**(c) Recomendação: 2-B, com 2-A como primeiro degrau se o proprietário quiser
zero gate reescrito agora.** A auditoria e o plano pedem retirar a equivalência
*comunicada*, e manter *Optimizing* na tela comunica equivalência mesmo com nota;
rótulos próprios indexados pela banda derivada fazem isso sem tocar `frozen` e sem
segunda régua. O custo real é reancorar 13 gates — trabalho de uma demanda, não
Porta B.

**(d) Pergunta.** **2-B** (bandas próprias por rótulo, `stageOf` intacta) ·
**2-A** (só a nota, nomes oficiais ficam) · **2-C** (sem nomes) · **2-D**
(manter)?

## 3 · "Confiança" — completude, origem, base disponível e consistência

**(a) Hoje.** `domStat` (`:496-509`) deriva `conf` de **dois** fatos
misturados: `n` confirmadas e a **dispersão** `disp = max − min` dos scores
(`:503`): `n===3 && disp<=1.7 → "alta"` (*"leitura consistente"*), `n===3 →
"média"` (*"respostas divergentes entre si"*), `n===2 → "média"`, `n===1 →
"baixa"` (`:504-508`). A tela imprime `"Confiança <conf> — <basis>"` (`:970`);
P50 esconde `.conf` sob gate fechado (`ui_p50_results_v32.js:237-241`) e o
substitui por *"N de 3 respostas confirmadas · diagnóstico parcial"* (`:251-254`).
**O PDF não imprime confiança** (medido: `papel contém 'Confiança'? false`).
`conf` é serializado em `legacySnapshot` (`ui_v32.js:134`, invariante M43),
usado como oráculo de igualdade pré/pós em 16 suítes (ex.
`tests_ui_m31.js:95-104`) — comparam a função consigo mesma, logo não
dependem do valor. Origem (declarada na sessão) só aparece no rodapé
(`:242` *"percepção declarada na sessão"*). Nenhum gate pina `"Confiança"`,
`"leitura consistente"` ou `"requer validação"` (0 ocorrências nos três).

O que a auditoria pede (`QS-04`): *"Três respostas autodeclaradas iguais podem
receber confiança alta. Três respostas verdadeiras, apoiadas em evidência, podem
receber média simplesmente porque práticas diferentes estão em níveis
diferentes."* Propõe **quatro dimensões**: **Completude** (*"3 de 3 práticas
respondidas"*), **Origem** (*"Situação declarada na conversa"*), **Base
disponível** (*"Evidência citada / amostra examinada / a validar"*) e
**Consistência** (*"Possível contradição a revisar, quando houver fundamento"*);
e o rótulo: *"'Resposta registrada' ou 'situação declarada' é mais preciso do
que 'resposta confirmada'"*.

O que existe hoje para cada dimensão: **Completude** = `domStat().n` (`:499`);
**Origem** = sempre declarada — não há outro canal de entrada; **Base
disponível** = só dois estados: *NA* (`"a validar"`, `:506-508`) e a nota livre
por pergunta (`notes[]`, `:476`, `:666`, impressa no anexo do PDF como
*"Observações da sessão"*, `ui_v32.js:1577-1578`) — não existe o dado
*"evidência citada / amostra examinada"*; **Consistência** = a regra de
dispersão (`:503`), que é o que a auditoria manda não usar como veracidade.
Rótulo: *"confirmada"* é o termo do glossário (`CONTEXT.md:58-60`, *Resposta
confirmada*) e da INV-3, e aparece em **22 suítes / 111 ocorrências** de
`tests_*.js`/`fixtures_*.js` — ex. `tests_ux_m41.js:335` exige
`/1[45] de 15 respostas confirmadas/` na tela; `ui_p50_suff_v32.js:113-132`
e `ui_p50_shell_v32.js:318-411` o renderizam.

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **3-A · quatro dimensões com o dado que existe, sem "Confiança"**: por domínio *"N de 3 práticas respondidas · M a validar"* (completude + base disponível no limite do dado atual) e, por pergunta no anexo, *"observação registrada"* quando `notes[k]` não é vazio; **Origem** dita uma vez (*"situação declarada na conversa"*) no `pr-howto` e no rodapé do PDF; **Consistência** **sai** da apresentação — sem o dado de base não há *"fundamento"* para dizer contradição, e a dispersão não é fundamento (`QS-04`). Os 4 literais `"Confiança alta — …"`, `"Confiança média — …"` (×2), `"Confiança baixa — …"` entram no `P52_COPY` (`ui_p52_workspace_v32.js:128`) → zero toque em `frozen` | 4 pares de copy + 2 linhas | módulo (copy) → **fix-finding** | nenhum literal pinado; `tests_p50_core.js:1704`/`:2000` só reclamam de estágio/score | hoje o PDF não traz a linha por domínio; 3-A acrescenta 1 linha opcional na tabela `.pr-doms` (`ui_v32.js:1446-1447`) |
| **3-A-R · rótulo "resposta registrada / situação declarada"** nas superfícies do cliente, no lugar de *"confirmada"* (o termo interno do glossário e da INV-3 pode ficar, como nome de código) | copy em tela, P50, P52 e PDF | módulo (copy), mas **22 suítes/111 ocorrências** a reancorar → **demanda**, não fix-finding; verbete novo no `CONTEXT.md` | `tests_ux_m41.js:335` e as demais 21 suítes | todos os "N de 15 respostas confirmadas" |
| **3-B · Base disponível como dado por pergunta** (`declarada` / `evidência citada` / `amostra examinada` / `a validar`), que é o que permite a quarta dimensão *"quando houver fundamento"* | input novo no editor, serializado como input canônico | módulo + **schema de sessão** (`SESSION_SCHEMA_V32.md:229`, INV-8 — owner do estado: `core-engineer`/`data-engineer`) → **demanda** | `tests_session_m48.js` (round-trip), novos | anexo e linha por domínio ganham a base |
| **3-C · reescrever `domStat` sem dispersão** (`conf` passa a ser só `n`) | `:503-508` | `frozen` → **Porta B**; muda `v3_1_3_functional_snapshot.json` | `tests_p50_mutants.js`/`tests_p51_mutants.js` ancoram em `domStat` (29 ocorrências em 8 arquivos) | idem 3-A |
| **3-D · manter** | — | — | — | — |

Glossário: `CONTEXT.md:79-82` manda **evitar "completude" e "cobertura"**
como sinônimos de *Suficiência*. Se 3-A for adotada, as quatro dimensões
precisam de verbete próprio que não colida (sugestão: *Práticas respondidas* =
N de 3; *Pendência de validação* = NA; *Origem* = situação declarada; *Base
disponível* = reservado para 3-B) — e *Resposta confirmada* (`:58-60`) só é
renomeada se 3-A-R for escolhida.

**(c) Recomendação: 3-A agora; 3-A-R e 3-B como demanda seguinte, se o
proprietário quiser as quatro dimensões completas.** A palavra "confiança" e o
adjetivo de dispersão são o que induz a ler veracidade, e saem por copy; a
quarta dimensão (consistência) só volta quando houver base por pergunta (3-B),
porque sem ela qualquer "contradição" seria de novo a dispersão. O rótulo
*"registrada"* é mais preciso, mas custa 22 suítes — é demanda, não passagem.

**(d) Pergunta.** **3-A** (copy: dimensões com o dado atual, sem "Confiança"
nem consistência) · **3-A + 3-A-R** (idem + rótulo "registrada", demanda) ·
**3-A + 3-B** (idem + base por pergunta, demanda) · **3-C** (Porta B em
`domStat`) · **3-D** (manter)?

## 4 · Respostas desconhecidas (NA)

**(a) Hoje.** *NA* já está **fora da média**: `domStat` filtra
`ans[k]!=="NA"` (`:498`), `confirmedCount` idem (`:494`); INV-2 garante que
não vira zero. O que o produto mostra: tela `"10 de 15 respostas confirmadas
na sessão · 5 marcadas para validação"` (`:953`), por domínio `"2 de 3
respostas confirmadas · 1 requer validação"` (`:506`); PDF KPI `"10 de 15 ·
Respostas confirmadas"` (`ui_v32.js:1443`) — **sem** a contagem de *a
validar*; P50 publica o contrato por domínio (`ui_p50_suff_v32.js:53-70`) e
P52 o resume em *"Base de evidência da sessão"* (`ui_p52_workspace_v32.js:2787-2795`).
O gate de suficiência (INV-3, `:511-513`) abre com 10 confirmadas e 2 por
domínio — por isso o experimento ii dá `suff = true`, `overall = 5`,
`"Em otimização"`, com 5 pendências. Isso é desenho, não defeito
(`design-decisions.md:28-30` já lista o limiar como candidata).

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **4-A · pendências ao lado do número, nas duas superfícies**: KPI do PDF passa a `"10 de 15 confirmadas · 5 a validar"` (dado já calculado: `ans.filter(v=>v==="NA").length`, `:820`); tela mantém `:953` | 1 KPI + copy | módulo → **fix-finding** | `tests_ux_m41.js:335` exige `/1[45] de 15 respostas confirmadas/` na **tela** — tela não muda; `tests_ui_m332.js`, `tests_p52_chromium.js:1885` lêem `.pr-foot`, não o KPI | KPI ganha o segundo número |
| **4-B · apertar a suficiência** (ex. ≥12 ou ≥3/domínio) | INV-3 + `:511-513` | **invariante + `frozen`** → Porta B e ratificação de invariante pelo auditor humano | P50-SUF* (`tests_p50_core.js`), `tests_unset_ug.js`, `fixtures_p50.js:333` (1024 vetores) | muda o que é publicável |
| **4-C · manter** | — | — | — | — |

**(c) Recomendação: 4-A.** A exclusão da média já existe; o que falta é o
leitor do PDF ver *quantas* pendências sustentam um 5.0, e esse número já é
calculado. Mexer no limiar é mudar a invariante do produto por um sintoma
que um rótulo resolve.

**(d) Pergunta.** **4-A** (pendências ao lado do KPI) · **4-B** (apertar
INV-3) · **4-C** (manter)?

## 5 · Bug decimal — `5 − 3.3 = 1.7000000000000002`

**(a) Hoje.** `disp<=1.7` em `:503-504` compara ponto flutuante. Medido na
função real (`domStat(0)`, 64 combinações, §9-i): `5-3.3 →
1.7000000000000002` (> 1.7 → **"média"**), `3.3-1.7 → 1.5999999999999999`
(→ "alta"), `1.7-0 → 1.7` (→ "alta"). Resultado: as 6 combinações só de
níveis 2 e 3 (`223 232 233 322 323 332`) recebem *"Confiança média —
respostas divergentes entre si"*, enquanto as 6 de níveis 0/1 e as 6 de
níveis 1/2 — mesma distância de **um nível** — recebem *"alta — leitura
consistente"*. Tally: 16 alta / 48 média. É assimetria pura de representação,
não de método. Observável só na tela (`:970`); o PDF não imprime `conf`.
**Bate com `QS-05`**: as seis assimétricas da auditoria (`223, 232, 233, 322,
323, 332`) são exatamente as seis medidas. O plano §3 condiciona: *"Corrigir a
comparação se a regra continuar existindo; testar as 64 combinações"* — logo
a decisão 5 depende da 3: se a regra sai da apresentação (3-A), a correção na
fonte é adiada; se a regra continua visível (3-D), a correção é devida.

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **5-A · tornar inobservável pela 3-A e registrar**: com os 4 literais trocados pelo `P52_COPY`, o adjetivo some da tela; `conf` continua calculado errado em `domStat` e em `legacySnapshot`, e a entrada vai para `design-decisions.md` como *"defeito conhecido em `frozen`, inobservável por decisão, corrigir no próximo rito D2"* | só registro (+3-A) | nenhuma | — | nenhum |
| **5-B · corrigir na fonte agora**: comparar por **índice de nível** (`max(ans)−min(ans) <= 1`) ou arredondar `disp`; **gate das 64 combinações** nasce junto (a sonda `sonda-m02.js` é o esboço: chama `domStat(0)` real e espera 16 "alta" / 48 "média" **simétricas por distância de nível**) | `:503-504` + 1 gate novo | `frozen` → **Porta B** (spec + auditoria humana); snapshot funcional muda | âncoras de mutantes em `domStat` (8 suítes) a reconferir; gate novo com mutante (R3) | nenhum |
| **5-C · recalcular num módulo e sobrescrever o texto** | nova função paralela | módulo, mas viola R9 (owner do estado) e cria segunda régua | — | — |

Em qualquer rota, as 64 combinações ficam **testadas**: em 5-A como sonda
read-only arquivada com a entrada de `design-decisions.md` (prova de que o
defeito é conhecido e delimitado); em 5-B como gate.

**(c) Recomendação: 5-A se a decisão 3 sair como 3-A; 5-B se a regra de
dispersão continuar visível (3-D).** É exatamente a condicional do plano
(*"se a regra continuar existindo"*): sem a palavra na tela não há o que o
cliente veja, e abrir Porta B para uma comparação de ponto flutuante contraria
*rota mais barata*. Registrar como conhecido impede que volte como achado.

**(d) Pergunta.** **5-A** (inobservável + registro + sonda arquivada, Porta B
depois) · **5-B** (Porta B agora, com gate das 64) · **5-C** (módulo paralelo)?

## 6 · Relação com os 27 aspectos do SOC-CMM

**(a) Hoje.** Não existe camada *aspecto* no modelo: `assessment → DOMS (5) →
QS (15, 3 por domínio)` (`:286-293`, `:296…`; já registrado em
`docs_phase5/AUDITORIA_REV_A.md:455-460`). A única menção a *"27 aspectos"*
é copy comercial da trilha de aprofundamento (`:840`), renderizada no bloco
`.next` (`:1013-1017`) — que a P52 **remove** (`ui_p52_workspace_v32.js:863`,
`P52-RES4`). Medido com `arq=2` e suficiência: `tela contém '27 aspectos'?
false` · `papel … false` (`saida-trilha.txt`). README/USER_GUIDE/CONTEXT não
mencionam aspectos (grep: 0). Ou seja: **o produto hoje não afirma "15 de
27" em lugar algum alcançável** — mas também não diz o que as 15 práticas
tocam do modelo.

O que a auditoria diz (§5.1): *"O QuickScan preserva os cinco domínios, mas
usa 15 práticas próprias. Algumas agregam aspectos; outras são recortes ou
extensões. Portanto, não é apropriado dizer que ele cobre '15 de 27
aspectos'."* E propõe (§5.3) um crosswalk prática → *relação metodológica
provável*, com a ressalva: *"A matriz definitiva deve ser validada e versionada
por responsável metodológico. Não foram atribuídos IDs da planilha oficial."*
As 15 linhas estão no **Anexo A**, como proposta não validada; os rótulos das
práticas batem um a um com `QS[].lbl` (`saida-qs.txt`). Dois pontos que o
anexo já expõe: *Resposta a incidentes* está em Processos (`QS[6].dom = 2`)
enquanto o modelo a relaciona a Serviços — é adaptação, não erro; e
*Superfície externa* é extensão, não aspecto.

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **6-A · crosswalk parcial e versionado como documento** (`docs/crosswalk-soc-cmm-2.4.md`: `q.id` → relação metodológica, tipo *agrega / recorte / extensão / realocação*, sem IDs oficiais até validação, com versão do SOC-CMM, data e responsável metodológico; **ponto de partida = Anexo A**) + **uma** linha em "Como interpretar" (`ui_v32.js:1263-1272`): *"as 15 práticas são próprias, inspiradas nos domínios do SOC-CMM 2.4; agregam, recortam ou estendem aspectos e não cobrem o modelo"* | doc + 1 `<li>` | doc + módulo (copy) → **fix-finding** | `#pr-howto` só é exigido presente (`tests_ui_m332.js:54`); 0 gates em `"27 aspect"` | +1 linha |
| **6-B · nada no produto; só o doc** | doc | doc | — | — |
| **6-C · rótulo de aspecto por pergunta no anexo do PDF** | `pr-annex` (`ui_v32.js:1576-1579`) + tabela no runtime | módulo (dado novo) → **demanda** | `tests_p52_chromium.js` censo do anexo | anexo cresce |

**(c) Recomendação: 6-A.** O que a auditoria pede é não deixar o leitor
inferir cobertura; um documento versionado responde à pergunta sem pôr dado
novo no runtime. A linha única no PDF é o que impede a inferência.

**(d) Pergunta.** **6-A** (doc + 1 linha) · **6-B** (só doc) · **6-C** (no
anexo do PDF)?

## 7 · Licença e autoria

**(a) Hoje.** `LICENSE:1-10` — *"Todos os direitos reservados"*, sem permissão
de uso/cópia/modificação (commit `36d2170`); `README.md:258-262` repete. A
Camada 1 afirma no rodapé da **tela**: *"Baseado no SOC-CMM 2.4 (Rob van Os ·
soc-cmm.com), licença CC BY-SA 4.0 — material adaptado"* (`:240`), seguido do
contato `fcosta@fortinet.com` (`:243`). O **PDF não traz atribuição**: o
`.pr-foot` diz só *"Quickscan SecOps · SOC-CMM · Fortinet — relatório
contextual V3.2"* (`ui_v32.js:1580`); medido: `contém 'CC BY'? false ·
'Rob van Os'? false · 'SOC-CMM 2.4'? false`. Gates: `P52-HOME3` exige os
itens do rodapé da tela (`tests_p52_layout.js:913-916`: `SOC-CMM 2.4`,
`CC BY-SA 4.0`, `Rob van Os`, *aberto e neutro*); `tests_p52_chromium.js:1544-1550`
exige o rodapé da tela idêntico ao baseline além da nota; `tests_ui_m332.js:48-57`
exige `.pr-foot` com *"contexto tecnológico não informado"* em modo legado;
`tests_p52_chromium.js:1848`, `:1885` capturam `.pr-foot` como decorador do censo.

O que a auditoria diz (`QS-06`): *"O rodapé web identifica SOC-CMM 2.4, Rob
van Os, fonte e CC BY-SA 4.0. Essas referências não aparecem no HTML produzido
para impressão/PDF [...] É necessário delimitar conteúdo efetivamente adaptado,
código autoral e marcas/ativos de terceiros; preservar crédito, versão,
indicação de adaptação e licença aplicável nos formatos distribuídos. [...]
Isso não significa que todo o código autoral deva automaticamente receber a
mesma licença."* Plano §3: *"Delimitar conteúdo adaptado, código autoral e
marcas; restaurar atribuição no PDF."*

São **três objetos** distintos, e hoje nenhum arquivo os separa:

| Objeto | Onde vive no artefato | O que o `LICENSE` diz hoje |
|---|---|---|
| **Conteúdo adaptado do SOC-CMM 2.4** — os cinco domínios (`DOMS`, `:286-292`), o vocabulário das seis faixas (`stageOf`, `:485-492`) e, possivelmente, o texto das 15 práticas e dos níveis (`QS[].opts`, `:296…`) — o que é adaptação e o que é redação própria é a delimitação pendente | Camada 1 (`frozen`) | nada — só o rodapé da tela diz *"material adaptado"* (`:240`) |
| **Código autoral** — `engine_v32.js`, os módulos `ui_*_v32.js`, builder, gates | repositório | *"todos os direitos reservados"* (`LICENSE:1-10`) |
| **Marcas e ativos de terceiros** — logo Fortinet (`:226-227`), nomes de produto em `PRODUCTS` (`:259-275`) e `MAP`, ícones (`ui_icons_v32.js`, `icons_v32_source/`), a própria marca *SOC-CMM* no título (`:6`, `:228`) | Camada 1 + gerados | nada |

O PO aponta a tensão sem opinar juridicamente: *BY* pede crédito em toda
cópia distribuída — o PDF é a cópia que o cliente leva; *SA* alcança a
**adaptação** do material licenciado, não automaticamente o código autoral
(é o que a auditoria também diz). **Delimitar os três objetos é decisão do
proprietário**, se quiser com leitura jurídica; este documento não a escreve.

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **7-A · restaurar a atribuição no PDF** com os quatro elementos da auditoria — **crédito** (Rob van Os · soc-cmm.com), **versão** (SOC-CMM 2.4), **indicação de adaptação** (*"material adaptado"*) e **licença aplicável** (CC BY-SA 4.0) — acrescentando ao `.pr-foot` (`ui_v32.js:1580`) a frase do rodapé da tela (`:240`), por **append**, para `tests_ui_m332.js:57` continuar casando | 1 linha | módulo → **fix-finding** | `tests_p52_chromium.js:1848/:1885` lêem o texto do próprio relatório (não string fixa) → passam; `tests_ui_m332.js:57` regex de contém → passa | rodapé ganha crédito, versão, adaptação e licença |
| **7-B · 7-A + delimitar os três objetos** em `LICENSE`/README (e, se o proprietário quiser, uma linha no `pr-howto`): o que é conteúdo adaptado do SOC-CMM (CC BY-SA 4.0), o que é código autoral (reservado), o que é marca/ativo de terceiro (Fortinet, SOC-CMM) | doc | doc — **decisão do proprietário** | — | opcional +1 linha |
| **7-C · manter** | — | — | — | — |

**(c) Recomendação: 7-A agora; 7-B é do proprietário.** A atribuição com os
quatro elementos é a obrigação mais clara e custa uma linha num módulo. A
delimitação dos três objetos não é decisão de produto e não deve ser escrita
por mim — só registrada aqui como pendente.

**(d) Pergunta.** **7-A** (atribuição completa no PDF) · **7-B** (7-A +
delimitar os três objetos no `LICENSE`/README) · **7-C** (manter)?

## 8 · Neutralidade — modelo de referência × camada comercial

**(a) Hoje.** As duas camadas convivem sem nome: logo Fortinet no cabeçalho
(`:226-227`) ao lado de *"Quickscan SecOps · SOC-CMM"* (`:228`); abertura
*"usando uma régua aberta e neutra"* (`:613`) e o disclaimer *"framework
aberto e neutro de fabricante"* (`:623`), que a P52 move para o rodapé
(`ui_p52_workspace_v32.js:2623-2630`); rodapé *"As perguntas avaliam práticas
operacionais — não produtos ou fabricantes"* (`:242`); seções *"Como a
Fortinet pode apoiar…"* (`:988`, `:994`); catálogo `PRODUCTS` (`:259-275`) e
`MAP` por pergunta (`:449` etc.). PDF: capa *"Quickscan SecOps · SOC-CMM"*
(`ui_v32.js:1111`), `.pr-foot` *"… · SOC-CMM · Fortinet — relatório
contextual V3.2"* (`:1580`), *"Como interpretar"* já diz *"o contexto
tecnológico não altera a nota"* (`:1268`). INV-4 (tecnologia nunca eleva
score) é a garantia de método; o que falta é a **rotulagem** das camadas.
Gates: `tests_p50_core.js:3307` (título da capa), `tests_p52_layout.js:913-916`,
`tests_p52_chromium.js:1544` (nota de neutralidade), `"Fortinet"` em 14
suítes/70 ocorrências (quase todas nomes de produto, não a frase).

**(b) Opções.**

| Opção | O que muda | Classe | Gates | PDF |
|---|---|---|---|---|
| **8-A · nomear as duas camadas**: capa/sub do PDF *"Modelo de referência: SOC-CMM 2.4 (independente, Rob van Os)"* e *"Apoio comercial: Fortinet"* como duas linhas de metadado (`qsCoverHTML`, `ui_v32.js:1105-1112`); eyebrows das seções de apoio ganham o prefixo *"Camada comercial · "* via `P52_COPY`; `.pr-foot` separa *"Quickscan SecOps · SOC-CMM"* de *"Fortinet"* | copy em 3 pontos | módulo (copy) → **fix-finding**/demanda pequena | `:3307` exige `/Quickscan SecOps · SOC-CMM/` no `.pr-cover-title` → manter o título, mudar só o sub/metadados; `tests_ui_m332.js:57` append-safe | capa e rodapé mais claros |
| **8-B · modo neutro** (toggle que oculta as seções Fortinet e o logo) | estado novo + render condicional | módulo → **demanda** com gates próprios; logo é Camada 1 (`frozen`) → ocultar por CSS, não remover | censo do PDF (`tests_p52_chromium.js`), `tests_015_apoio.js`, `tests_026_contrato.js` | duas variantes de PDF |
| **8-C · manter** | — | — | — | — |

**(c) Recomendação: 8-A.** O método já é neutro por invariante; o que a
auditoria viu foi um PDF que não diz onde termina o modelo e onde começa a
oferta. Dois metadados na capa e um prefixo nas seções fazem isso sem
estado novo.

**(d) Pergunta.** **8-A** (nomear as camadas) · **8-B** (modo neutro) ·
**8-C** (manter)?

## 9 · Experimentos reproduzidos por execução

Sonda `sonda-m02.js` (jsdom, boot de `tests_022_escalonamento.js:89-130`,
`window.__DEV` de `ui_v32.js:1694-1717`), saída literal em
`saida-experimentos.txt`.

**(i) 64 combinações de três respostas, `domStat(0)` real (perguntas
`mandate, governance, policies`):**

```text
SCORES = [0,1.7,3.3,5]
disp bruto 5-3.3 = 1.7000000000000002 ; 3.3-1.7 = 1.5999999999999999 ; 1.7-0 = 1.7 ; 5-1.7 = 3.3
tally conf: {"alta":16,"média":48}
disp=0 (4): 000→alta 111→alta 222→alta 333→alta
disp=1.5999999999999999 (6): 112→alta 121→alta 122→alta 211→alta 212→alta 221→alta
disp=1.7 (6): 001→alta 010→alta 011→alta 100→alta 101→alta 110→alta
disp=1.7000000000000002 (6): 223→média 232→média 233→média 322→média 323→média 332→média
disp=3.3 (24): … →média   disp=5 (18): … →média
223 → disp=1.7000000000000002 conf=média score=3.9
232 → disp=1.7000000000000002 conf=média score=3.9
233 → disp=1.7000000000000002 conf=média score=4.4
322 → disp=1.7000000000000002 conf=média score=3.9
323 → disp=1.7000000000000002 conf=média score=4.4
332 → disp=1.7000000000000002 conf=média score=4.4
```

Limiar: `disp<=1.7` (`:504`). As 6 assimétricas são exatamente as de níveis
{2,3}; as 12 de {0,1} e {1,2} passam como "alta". **Confere com `QS-05`**: a
auditoria lista `223, 232, 233, 322, 323, 332` — o mesmo conjunto, na mesma
ordem, medido aqui na função real do artefato construído.

**(ii) Dez respostas de nível 3 e cinco *NA*, uma por domínio
(`mandate, team-capacity, incident-response, logs, monitoring-coverage`):**

```text
confirmedCount() = 10
legacySnapshot.domains = [{"score":5,"conf":"média","n":2,"nNA":1} ×5]
legacySnapshot.suff = true ; overall = 5
stageOf(overall) = {"en":"Optimizing","pt":"Em otimização"}
tela .score-big = 5.0 / 5.0
tela .stage-tag = Optimizing · Em otimização
tela .arq-tag  = … 10 de 15 respostas confirmadas na sessão · 5 marcadas para validação.
tela .conf (por domínio) = ["Confiança média — 2 de 3 respostas confirmadas · 1 requer validação" ×5]
tela .dom .lbl span (valor) = ["5.0 — Optimizing" ×5]
P50 #p50-suff [data-p50=suff-global] confirmed = 10 ; déficits = 0
preparePrint → {"legacy":true,"blocked":false}
papel .pr-kpi = ["5.0 / 5Score geral indicativo","Em otimizaçãoEstágio indicativo","10 de 15Respostas confirmadas","Sem operação formalArquétipo declarado"]
papel [data-rl-read] = 5.0 / 5 · Em otimização
papel .pr-doms = NegócioPessoasProcessosTecnologiaServiços 5.05.05.05.05.0
papel #pr-nopub presente? false
papel .pr-foot = Quickscan SecOps · SOC-CMM · Fortinet — relatório contextual V3.2 · contexto tecnológico não informado nesta sessão
papel contém 'Confiança'? false ; contém 'CC BY'? false ; contém 'Rob van Os'? false ; contém 'SOC-CMM 2.4'? false
```

Confirma a auditoria: overall 5, *Em otimização*, suficiência liberada,
confiança "média" em todos os domínios — e acrescenta que o PDF não leva nem
a confiança nem a atribuição.

**O que não pôde medir**: o texto da auditoria e do plano (arquivos
ausentes); PDF real em Chromium (só jsdom — o `beforeprint` foi disparado
pelo `preparePrint()`, suficiente para o conteúdo, não para a paginação).

## 10 · Síntese

| # | Decisão | Recomendação | Classe de proteção | Pergunta |
|---|---|---|---|---|
| 1 | Nome do resultado | **1-A** Índice QuickScan (0–5), *"baseado em práticas selecionadas, inspirado nos domínios SOC-CMM"* | módulo (copy) → fix-finding | 1-A · 1-C? |
| 2 | Equivalência a estágio SOC-CMM | **2-B** bandas qualitativas próprias por tabela de rótulos indexada pela banda de `__QS_STAGE_RULER` (`stageOf` intacta); **2-A** (só a nota) como primeiro degrau | módulo → demanda (13 gates reancorados) | 2-B · 2-A · 2-C · 2-D? |
| 3 | "Confiança" | **3-A** quatro dimensões da `QS-04` com o dado atual, sem a palavra nem consistência (4 pares em `P52_COPY`) + verbetes; **3-A-R** (rótulo "registrada") e **3-B** (base por pergunta) como demanda seguinte | módulo (copy) → fix-finding; 3-A-R/3-B → demanda | 3-A · 3-A+3-A-R · 3-A+3-B · 3-C · 3-D? |
| 4 | Respostas desconhecidas | **4-A** exclusão da média preservada; pendências ao lado do KPI do PDF; INV-3 intacta | módulo → fix-finding | 4-A · 4-B · 4-C? |
| 5 | Bug decimal | **5-A** se 3-A (inobservável + registro + sonda das 64 arquivada; Porta B no próximo rito D2); **5-B** se a regra continuar visível | registro (depois `frozen`/Porta B) | 5-A · 5-B · 5-C? |
| 6 | 27 aspectos | **6-A** crosswalk parcial versionado em `docs/` (ponto de partida: Anexo A, não validado) + 1 linha em "Como interpretar"; nunca "15 de 27" | doc + módulo (copy) → fix-finding | 6-A · 6-B · 6-C? |
| 7 | Licença e autoria | **7-A** atribuição no PDF com crédito, versão, adaptação e licença (append em `.pr-foot`); **7-B** delimitar conteúdo adaptado / código autoral / marcas de terceiros é do proprietário | módulo → fix-finding; `LICENSE` = proprietário | 7-A · 7-B · 7-C? |
| 8 | Neutralidade | **8-A** nomear modelo de referência (SOC-CMM 2.4, independente) e camada comercial (Fortinet) na capa, rodapé e eyebrows | módulo (copy) → fix-finding | 8-A · 8-B · 8-C? |

Dependências entre decisões: **5 depende de 3** (5-A só vale com 3-A; com 3-D
a correção é devida, 5-B); **1 e 2 andam juntas** (renomear o número sem
retirar a equivalência deixa a frase `:978` contraditória); a nota de 2-A e a
atribuição de 7-A vão ao PDF/`pr-howto`, nunca ao rodapé da **tela**, que
`tests_p52_chromium.js:1544-1550` exige idêntico ao baseline; **6 depende da
validação metodológica** do Anexo A (responsável a nomear pelo proprietário)
antes de o crosswalk ganhar versão.

Empacotamento sugerido (proprietário decide): **nenhuma recomendação toca
`frozen`**. O que é copy (1-A, 2-A, 3-A, 4-A, 6-A, 7-A, 8-A) cabe numa demanda
027 única de módulos (`P52_COPY`, `qsCoverHTML`, `qsHowToReadHTML`, KPIs e
`.pr-foot` de `buildPrintReport`) + doc (crosswalk) + entrada em
`design-decisions.md` (bug decimal) + verbetes no `CONTEXT.md`. O que é
comportamento novo (2-B, 3-A-R, 3-B) é demanda própria, com os gates
reancorados nela — nenhum contornado. Plano §3: *"Manter as 15 perguntas é
compatível com o propósito comercial. Não é necessário transformar o QuickScan
em assessment completo para comunicar seus limites com precisão."*

## 11 · O que NÃO muda

- As **15 perguntas** (`QS`, `:296…`), seus textos e níveis (`opts`).
- Os **pesos**: `SCORES = [0, 1.7, 3.3, 5]` (`:294`; REV B `:212`, `:358`) e
  a severidade `[2,1,0,0]` por nível (candidata em `design-decisions.md:29-30`).
- A **suficiência** (INV-3): ≥10 confirmadas e ≥2 por domínio (`:511-513`);
  a UI continua sem ser dona da decisão.
- O **significado dos níveis** e das seis faixas de `stageOf` (`:485-492`),
  byte-idênticas (`P51-RPT3`); a régua `__QS_STAGE_RULER` e seu consumo por
  `ui_ondas_v32.js`.
- INV-2 (NA/null nunca é zero), INV-4 (tecnologia não eleva score), INV-8
  (`legacySnapshot` continua serializando `conf`, mesmo que a tela não o
  mostre).
- `engine_v32.js` e `quickscan_secops_soccmm_v3_1_3.html`: **zero bytes** em
  todas as recomendações; a única mudança em `frozen` proposta (5-B) fica
  enfileirada para um rito D2 futuro.
- A **severidade** como *distância de um padrão de implementação escolhido*,
  nunca probabilidade de incidente (auditoria §5.4) — e nenhuma decisão a
  reinterpreta.
- O **tamanho da entrevista**: *"Manter as 15 perguntas é compatível com o
  propósito comercial"* (plano §3) — nenhuma opção transforma o QuickScan em
  assessment completo; o crosswalk (6-A) comunica limites, não os amplia.

## Anexo A · Crosswalk proposto pela auditoria (§5.3), ponto de partida

**Proposta não validada.** Copiada dos trechos da auditoria citados pelo
orquestrador, como insumo da decisão 6; a auditoria mesma ressalva: *"A matriz
definitiva deve ser validada e versionada por responsável metodológico. Não
foram atribuídos IDs da planilha oficial."* A coluna `q.id` é minha, pelo
rótulo `QS[].lbl` do runtime (`saida-qs.txt`, 15/15 batem); a coluna *tipo* é
leitura minha das palavras da auditoria (§5.1: *agregam / recortes / extensões*)
e vale como hipótese a confirmar, não como classificação.

| # | `q.id` | Prática (`QS[].lbl`) | Domínio (`DOMS`) | Relação metodológica provável (auditoria §5.3) | Tipo (hipótese) |
|---|---|---|---|---|---|
| 1 | `mandate` | Mandato e objetivos | Negócio | Direcionadores do negócio e mandato do SOC | agrega |
| 2 | `governance` | Governança | Negócio | Governança | recorte |
| 3 | `policies` | Políticas e privacidade | Negócio | Privacidade e políticas | agrega |
| 4 | `team-capacity` | Capacidade do time | Pessoas | Equipe, gestão de pessoas, papéis e hierarquia | agrega |
| 5 | `training` | Capacitação | Pessoas | Treinamento e educação | recorte |
| 6 | `knowledge` | Conhecimento operacional | Pessoas | Gestão do conhecimento | recorte |
| 7 | `incident-response` | Resposta a incidentes | Processos | Gestão de incidentes de segurança — *realocação para Processos é adaptação; o modelo a relaciona a Serviços* | realocação |
| 8 | `detection-lifecycle` | Casos de uso de detecção | Processos | Gestão de casos de uso; engenharia e validação de detecção | agrega |
| 9 | `automation` | Automação | Processos | Engenharia de automação e automação SecOps | agrega |
| 10 | `logs` | Centralização de logs | Tecnologia | Monitoramento e gestão de logs | recorte |
| 11 | `endpoint` | Proteção de endpoint | Tecnologia | Monitoramento de endpoint | recorte |
| 12 | `network-visibility` | Visibilidade de rede | Tecnologia | Monitoramento de rede | recorte |
| 13 | `monitoring-coverage` | Cobertura de monitoramento | Serviços | Monitoramento de segurança | recorte |
| 14 | `external-surface` | Superfície externa | Serviços | Extensão EASM/risco digital, com interfaces parciais com inteligência e vulnerabilidades | extensão |
| 15 | `vulnerability-management` | Gestão de vulnerabilidades | Serviços | Gestão de vulnerabilidades | recorte |

Para virar `docs/crosswalk-soc-cmm-2.4.md` (6-A) falta: responsável
metodológico nomeado pelo proprietário; IDs da planilha oficial do SOC-CMM
2.4 (não atribuídos pela auditoria); confirmação do *tipo* linha a linha;
versão e data no cabeçalho. Até lá, a única frase publicável no produto é a
da 6-A — *próprias, inspiradas, não cobrem o modelo* — nunca "15 de 27".
