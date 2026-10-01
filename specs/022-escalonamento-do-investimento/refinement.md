# Refinamento — 022-escalonamento-do-investimento

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Aberta em 2026-09-27, por relato do proprietário após sessão real na v3.2.9.

## Necessidade

O relatório oferece produto para **toda** lacuna observada. Para o leitor, isso lê
como uma lista de compras que nenhuma organização de maturidade baixa consegue
executar — e é o oposto do que a curadoria existe para encenar. O facilitador
perde o argumento mais forte que tem: *por onde começar*.

Relato do proprietário:

> *"O mais importante agora é que as recomendações façam sentido, independente da
> possibilidade de curadoria. Temos que ajustar/melhorar agora o motor das
> recomendações, para fornecer soluções que façam sentido o investimento de acordo
> com o cenário alvo, já que não faz sentido somente fornecer produtos para todas
> as lacunas que forem observadas, essa não seria uma proposta realista."*

**Por que agora**: a demanda 021 levou a cobertura de 4 para 15 gaps. Ela resolveu
*todo gap tem caminho* e deixou exposto o que faltava — *quais primeiro, e por
quê*. Cobrir tudo sem encenar tornou o problema visível na primeira sessão real.

## Enquadramento de produto

**Invariantes tangenciadas (R1)**

- **INV-1** (engine byte-idêntico salvo rito D2) — **não tangenciada**, e isto foi
  medido, não suposto. Ver §Sistema real, item 4.
- **INV-4** (tecnologia isolada nunca aumenta o score) — reforçada: escalonar
  investimento não mexe em score, e o `TGT_DISCLAIMER` já diz isso ao cliente.
- **INV-5** (target é declarado, nunca deriva de produto) — **restrição direta**: a
  demanda LÊ o alvo declarado e nunca o infere a partir de produto recomendado.
- **INV-7** (narrativa determinística e derivada de evidência) — o critério de
  escalonamento é derivado de dado declarado (prioridades, alvo, maturidade), nunca
  de heurística opaca.

**Conflito com decisão registrada?** Nenhum. A candidata de `design-decisions.md`
sobre `SCORES`/`stageOf` (*"nível 1 uniforme lê como Managed, nunca Initial"*) é
**tocada de raspão**: o teto proposto usa `stageOf`, então herda essa característica.
Não a corrige nem depende de corrigi-la — mas fica **nomeada**, porque se o
proprietário um dia ratificar aquela candidata, o teto se move junto.

**Alternativa mais simples considerada**: deixar como está e resolver por curadoria
manual a cada sessão. **Não basta**, por decisão literal do proprietário —
*"independente da possibilidade de curadoria"* — e porque o defeito é do produto:
ele se repete em toda sessão, com todo facilitador.

## Sistema real

Verificado no código, não nos docs.

**1 · O motor classifica por capability, isoladamente.** `engine_v32.js:392`
`classify(capId)` cruza estado de maturidade (`maturityStateOf`, `:337`) com estado
de tecnologia (`deriveTechState`, `:363`) e devolve uma categoria;
`resolveCandidates` (`:436`) resolve produtos daquela capability. **Nenhuma etapa
olha o conjunto.** O motor responde *"o que serve aqui?"*, quinze vezes.

**2 · O cenário-alvo não entra no motor.** Varredura em `engine_v32.js`: **zero**
ocorrências de `target`. Ele nasceu declarado como *"camada prospectiva; engine
intocado"* (`ui_target_v32.js:1`) e cumpre à risca — projeta score, não recomendação.
Forma do dado: `TARGET_PROFILE.overrides[qid] = 0..3` (`:2`), nunca inferior ao
atual confirmado (`setTarget`, `:12`).

**3 · Prioridades declaradas afetam ORDEM, não SELEÇÃO.** `ui_v32.js:775`
`buildSupportHTML` monta `prioOrder` e emite as prioridades primeiro; o motor segue
oferecendo produto para todo o resto. Ordenar não é escalonar.

**4 · DIVERGÊNCIA DOC×CÓDIGO, e ela muda o custo da demanda.** A prosa desta base
— e duas afirmações minhas antes de medir — tratam *"mudar o que o motor recomenda"*
como Porta B por mover a régua D2. **Falso.** O payload congelado
(`v3_1_3_functional_snapshot.json`, 28.356 bytes) não contém conceito algum do
motor V3.2:

```
endpoint-detection         0 ocorrências
security-analytics         0
TECHNOLOGY_WHITESPACE      0
COVERAGE_GAP               0
supportMode                0
buildRecommendationContext 0
```

Os `tiers.t1/t2/t3` que o harness afirma vêm de `buildTiers(findings, validate)`,
função da **Camada 1 V3.1.3** (`harness_m41_v313.js:101`). A régua D2 mede o
comportamento **legado**, ao lado do qual o motor V3.2 foi construído.

Consequência: o custo depende só de **qual arquivo se edita**, não de "mexer em
recomendação".

| rota | arquivo | rito |
|---|---|---|
| camada de escalonamento acima do motor | arquivo novo | demanda normal, nenhum `frozen` |
| mudar `classify`/`resolveCandidates` | `engine_v32.js` (`frozen`) | R6/D2 — e a Porta A segue pendente de ratificação, logo Porta B |

**5 · A escala já contém a regra do teto.** `stageOf` (Camada 1, `:485`) usa as
fronteiras `0.5 / 1.5 / 2.5 / 3.5 / 4.5` — **exatamente as de `Math.round`**. O
índice do estágio É o `overall` arredondado. Modelo: 5 domínios × 3 perguntas = 15;
`SCORES = [0, 1.7, 3.3, 5]`.

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| B1 | `suff === false` ⇒ `overall === null` | Não há estágio, logo **não há teto e não há escalonamento**: só as prioridades declaradas, e a ausência é dita |
| B2 | Prioridades declaradas **acima** do teto (3 declaradas, estágio Gerenciado ⇒ teto 2) | A tensão é **nomeada**, nunca podada. Medido na sessão de origem: respostas no nível 1 ⇒ `overall 1,7` ⇒ teto 2 |
| B3 | Zero prioridades declaradas | Primeira onda = gaps `sev 2`, até o teto |
| B4 | Zero prioridades e zero gaps `sev 2` | Primeira onda = gaps `sev 1`, até o teto |
| B5 | Prática com alvo explícito **igual** ao atual | A organização declarou que **não vai subir**: fica fora do enquadramento de investimento, e a exclusão é **nomeada** |
| B6 | Cenário-alvo declarado em prática **não** priorizada | O alvo **não abre frente nova** nem aumenta o teto; refina profundidade dentro do que já está na onda |
| B7 | Gaps além do teto | **Permanecem no relatório**, como onda seguinte declarada, com o critério dito em uma linha |
| B8 | `overall` ≥ 4,5 (Em otimização) | Teto 5; na prática sem restrição, e a ausência de restrição é dita |

## Vocabulário

Termos a registrar no `CONTEXT.md` na Fase 1:

- **Frente de investimento** — uma capability para a qual o relatório propõe
  investimento na onda corrente. Unidade do teto.
- **Onda** — conjunto de frentes apresentado junto. A primeira é a que se ataca
  agora; as seguintes são declaradas, não escondidas.
- **Teto de frentes** — número máximo de frentes simultâneas, derivado do estágio
  de maturidade. Não se aplica a prioridade declarada pelo cliente.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| 1 | Abertura — qual o incômodo | *"não faz sentido somente fornecer produtos para todas as lacunas que forem observadas, essa não seria uma proposta realista"* |
| 1 | O escalonamento depende do cenário-alvo? | *"Tem que funcionar também sem ele."* |
| 2 | O teto sai de onde | *"O teto tem que sair da maturidade, me propõe uma regra"* |
| 3 | Ratificação do teto (D1–D4), do destino do resto (D5) e do papel do alvo (D6) | *"Sigo com as suas recomendações"* |

## Decisões desta fase

**D1 · O teto é o próprio estágio de maturidade.** `teto = max(1, Math.round(overall))`.
Nenhum número novo entra no produto: o teto É o estágio que o relatório já calcula
e já mostra. Explicável na linguagem que o cliente leu duas seções acima.

| estágio | overall | frentes |
|---|---|---|
| Inexistente · Inicial | < 1,5 | 1 |
| Gerenciado | 1,5–2,4 | 2 |
| Definido | 2,5–3,4 | 3 |
| Quantitativo | 3,5–4,4 | 4 |
| Em otimização | ≥ 4,5 | 5 |

**D2 · Prioridade declarada não é cortada pelo teto.** O teto governa o que o motor
acrescenta por conta própria.

**D3 · Prioridades acima do teto: nomear, nunca cortar em silêncio** (ver B2).

**D4 · Sem suficiência não há escalonamento** (ver B1).

**D5 · O que fica fora da primeira onda permanece no relatório**, como onda seguinte
declarada. Sair desfaria a cobertura que a 021 acabou de construir.

**D6 · O cenário-alvo refina, não substitui.** A prioridade **abre frente**; o alvo
**define profundidade**; o alvo nunca aumenta o teto; e prática com alvo igual ao
atual sai do enquadramento de investimento, nomeadamente (B5).

**D7 · Desenho escolhido: camada acima do motor.** Precedente exato do
`ui_target_v32.js` (*"camada prospectiva; engine intocado"*). Além do custo: um
motor que responde *"o que serve aqui?"* é útil e auditável sozinho; misturar nele
*"quanto cabe agora?"* junta duas perguntas com fontes de verdade diferentes — uma
vem do catálogo, a outra vem da capacidade de investimento da organização, que o
motor não conhece e não deveria fingir conhecer.

## Fora de escopo (explícito)

- **Não esconde gap.** Todo gap segue observado e nomeado (D5).
- **Não inventa preço, prazo ou esforço.** O produto não tem esses dados.
- **Não decide quanto a organização pode investir.** Deriva do que ela já declarou.
- **Não altera score, nota ou suficiência.** INV-4 e INV-6 intactas.
- **Não toca `engine_v32.js`** nem qualquer arquivo `frozen` (D7).
- **Itens 2 e 3 do lote `EA-58`** — catálogo (`FortiNAC`, `FortiClient EMS`,
  `FortiSOC`, `FortiSOAR`) e `SCORES` — ficam fora: são conteúdo novo e mudança de
  nota; esta demanda encena o que já existe.

## Escopo incorporado

O **`EA-75`** (contexto tecnológico indexado por produto) entra nesta demanda. A
unidade de decisão passa a ser o **investimento**, e o eixo da seção tem de ser o
mesmo. Medido: reestruturar `buildSupportHTML`/`renderCap` custa reancorar **55
asserções em 5 suítes** — uma `§29.4` protegida, outra selada por errata própria.
Fazer isso duas vezes, em demandas separadas, pagaria o custo duas vezes.
