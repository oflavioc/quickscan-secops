---
name: autorizacao-nominal-29-4-por-demanda
description: Editar ui_v32.js / ui_target_v32.js exige autorização nominal do proprietário POR DEMANDA — a da 009 é explicitamente intransferível, e quem cobra é o gate P50-GOV1
metadata:
  type: project
---

Os arquivos `ui_v32.js`, `ui_ux_v32.js`, `ui_target_v32.js`, `ui_journey_v32.js`,
`ui_v32.css`, `ui_ux_v32.css` estão na §29.4 de `specs/PHASE_5_0_REV_B.md:1613-1620`
("edição proibida nesta fase") e **não** estão em `.claude/verify/boundary.json`. Um
cross-check só contra o boundary.json devolve falso negativo.

Quem cobra na prática é o gate vivo **`P50-GOV1`**: o mapa `PROTECTED` em
`tests_p50_core.js:82` pina o SHA-256 de cada um (`ui_v32.js` em `:158`,
`ui_target_v32.js` em `:256`). Editar sem repin = FAIL.

**O ponto que se perde entre demandas:** a autorização da 009 está registrada em
`tests_p50_core.js:132-141` e diz, textualmente, que é **NOMINAL, por arquivo, e vale
"só para a 009": "não amplia a boundary para outra demanda nem para outro arquivo"**.
Frase literal do proprietário no chat em 2026-08-28: "Autorizo nominalmente a edição
dos quatro arquivos para a 009".

**Why:** na Fase 0 da 010 (2026-08-30) a rota recomendada tocava os dois arquivos e o
proprietário estava ausente, com decisões delegadas. Delegação cobre decisão de
PRODUTO; conceder boundary é ato de outra natureza — e o precedente registrado já
restringe o alcance por escrito. Prosseguir sem isso levaria a demanda até a Fase 5
para morrer no `P50-GOV1`.

**How to apply:** em qualquer demanda cuja rota toque um arquivo da §29.4, tratar a
autorização nominal como **portão da Fase 1**, não como detalhe de implementação —
levantar na Fase 0, com a citação `tests_p50_core.js:<linha do pin>`, e recomendar
PARAR e escalar ao proprietário se ele não estiver presente. Ver
[[project-gates-ancora-normativa]].

**§29.6 · print/render — RESPONDIDO pelo proprietário em 2026-08-31: a autorização
nominal por ARQUIVO cobre o caminho de impressão dentro dele.** Escolhido entre
três opções, com o precedente da 010 (que mudou `#pr-sup-base` e `prCards` sob
autorização de `ui_v32.js`). Não reabrir esta pergunta a cada demanda; o alcance é
por arquivo autorizado, não uma licença geral de print. Registro em
`specs/015-superficies-de-apoio/spec.md` §"§29.6".

**E a lição de processo que veio junto:** eu carreguei essa pendência por **quatro
relatórios** — ela já estava respondida, em mensagem de commit e prompt de
delegação, canais que não passam por mim. Citar como aberta estava certo *de onde
eu olhava*. Mas ao repetir uma pendência pela terceira vez, **perguntar "isto já
foi respondido em algum canal?"** em vez de só repetir — e, quando a resposta
chegar, **gravá-la no artefato** para deixar de ser memória de conversa.

**A autorização pode vir MAIS ESTREITA que a rota aprovada — e isso é desenho, não
descuido.** Na 015 (2026-08-31) o proprietário autorizou `ui_v32.js` **e só ela**,
com a razão dita: "autorização mais larga que o necessário é o que faz a boundary
erodir" (lição da 011). Consequência: metade de uma rota já aprovada (declarar a
ancoragem também no card-alvo) ficou **inalcançável**. O certo é escrever isso na
spec como **resíduo declarado** e deixar a demanda entregar a metade que alcança —
não é falha de escopo.

**E há uma tentação técnica real a recusar aqui:** `ui_target_v32.js` **não é
IIFE** (declara `TARGET_PROFILE`, `tgtHasOverrides` etc. no topo, escopo global),
enquanto `ui_v32.js` é IIFE mas resolve globais livremente. Logo é *possível* ler
o estado do módulo não autorizado de dentro do autorizado, sem tocar nele. Isso é
acoplamento inter-módulo fora de bridge (R9 §3) para dentro do arquivo proibido —
**contrabando de boundary**. Recusar e resolver por fraseado condicional, que não
consulta estado alheio.

**Antes de pedir a autorização, procurar a rota de fuga — a própria spec selada tem
uma.** UI-004 (`specs/PHASE_5_0_REV_B.md:385-388`) autoriza nominalmente
"superfície nova da Camada 5 e/ou **decoração pós-render** a partir de **módulo
novo da fase**", proibindo só reescrever markup da Camada 1. Ou seja: quase toda
mudança de apresentação que *parece* exigir editar um `ui_*_v32.js` da §29.4 pode
nascer em módulo novo, que não é protegido — troca-se um ato de boundary do
proprietário por um patch-point aprovado pelo TL (R9 §4). Foi assim que a 011
(2026-08-31) evitou gastar autorização. Duas ressalvas medidas na mesma leitura:
o escopo autorizado da 009 **nunca incluiu `ui_ux_v32.js`** (só `.css`), e a cadeia
`__uxDecor`/`__P50.registerDecor` **só é invocada na tela de resultados** — módulo
novo em outra tela precisa de patch-point próprio.
