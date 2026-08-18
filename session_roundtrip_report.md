# Session Round-trip Report · Phase 4.8

## RELEASE ATUAL (fonte única de versão deste documento)
**toolVersion:** `3.4.0-dev.4.8.0.7` (de `package.json`) · **schemaVersion:** 1 ·
**engineSha256:** `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` (dos bytes reais de
`engine_v32.js`, byte-idêntico desde a 4.7) · **HTML SHA-256:** `8d0932e145d8a8f8d203095f509137aacba43b3242a3b53822ff76001fd85ddb`

As seções seguintes incluem **adenda históricos** de microfases anteriores (4.8.0.1 … 4.8.0.6). Eles descrevem o
estado **daquelas** rodadas e conservam os hashes de então: o leitor **não** deve inferir a versão corrente a
partir da última seção — a versão corrente é a declarada aqui, verificada pelo gate **S109**.

## Round-trip (S6–S14)
| cenário | inputs idênticos | derivados idênticos |
|---|---|---|
| U1 padrão suficiente + prioridades | PASS | PASS |
| U2 landscape rico (NONE/UNSET, arch, platform, signals) | PASS | PASS |
| U3 UNSET ≠ NONE | PASS | PASS |
| U4 insuficiente / n-d (sem estágio fabricado) | PASS | PASS |
| U5 target sparse (Current×Target recalculado) | PASS | PASS |
| U6 refinement 1/3 e 3/3 (score inalterado) | PASS | PASS |
| U7 top stage (sem sexto estágio) | PASS | PASS |
| U8 Unicode/emoji/CJK/combinantes/nota longa | PASS | PASS |
| U9 payload XSS inerte | PASS | PASS |

Derivados comparados como **modelos canônicos** (legacySnapshot, RecommendationContext, computeTargetProfile,
journeyModel, buildExecutiveNarrative, refinement snapshot) — não HTML.

## Importações negativas (S15–S28)
JSON malformado · > 1 MiB · format incorreto · schemaVersion ≠ 1 · engine SHA diferente (bloqueado, sem forçar) ·
toolVersion diferente + engine igual (aceito com aviso) · q id desconhecido · resposta inválida · prioridade
duplicada/inválida/> 3 · enum de presence inválido · alvo inválido · refinement inválido · campo derivado injetado ·
`__proto__` malicioso — **todos recusados explicitamente**. `({}).polluted === undefined` antes e depois.

## Atomicidade (S29)
Erro no **último** bloco validado: inputs canônicos e todos os derivados permanecem idênticos ao pré-tentativa.

## Rede / persistência (S33, S34, SE1)
Zero `localStorage`/`sessionStorage`/`indexedDB`/cookies no módulo e no HTML; medido no Chromium após um ciclo
completo export→import: `{ls:0, ss:0, ck:""}`. Zero requisição externa (`http/https/ws/wss`).

## Impressão (S37, S38, SE3)
Relatório após import **textualmente idêntico** ao da sessão original. Controles "Exportar sessão", "Importar
sessão" e "Nome da sessão" **ausentes** do PDF gerado pelo Chromium.

## E2E Chromium (SE1)
Sessão real por teclado → Results → export com download real → Nova sessão (estado vazio verificado) → import via
file chooser real → preview → confirmação → Results, com inputs, legacySnapshot e RecommendationContext idênticos.

## Suítes
Sessão S1–S40: **28 execuções, 28 PASS**. Visual/print completa (4.7 + novos gates): **57 passed / 0 failed /
27 skipped**. Suítes congeladas: **13 verdes**.

## Limitações conhecidas
Ver seção 10 de SESSION_SCHEMA_V32.md. Nenhum defeito de runtime preexistente encontrado nesta fase.

---
# Adendo · Phase 4.8.0.1 (schema estrito, fidelidade e atomicidade)

## Validação estrita (S43–S47)
Recusados antes de qualquer commit: `status:"BOGUS"` · `deployment:"TELEPORT"` · `coverage` não-string ·
`coveredCapabilities:["capability-inexistente"]`, string, `[null]`, `[{objeto}]` ·
`architectureContext.saasAllowed:"maybe"`, `environmentProfile:"marte"`, campo desconhecido ·
`signals.activeIncident` em `false`/`"true"`/`"false"`/`1`/`0`/`null`/`"yes"`/objeto/array · sinal desconhecido ·
`declaredPlatforms[0].platform:"invented"`, `bundle:"nope"`, `subscriptions:["fake"]`, subscriptions não-array,
`declaredPlatforms:[null]`, campo extra. Valores válidos continuam aceitos (controle positivo em cada gate).

## Fidelidade canônica
S41 — U2 real com NONE+PARTIAL+PRESENT, solução third-party e Fortinet, status/deployment/coverage/notes/
coveredCapabilities, arquitetura, plataforma com bundle e subscriptions, dois signals: inputs, legacySnapshot e
RecommendationContext equivalentes após roundtrip.
S42 — três solutions com combinações distintas de campos opcionais: ausência permanece ausência.

## Atomicidade (S29, S49, S50, S51)
`declaredPlatforms:[null]` sobre sessão rica ativa morre na validação; inputs canônicos, modelo derivado e a tela
permanecem idênticos. Normalização isolada não altera estado (S50). Capability inventada é recusada e o
Recommendation Context permanece byte-idêntico (S51).

## Rollback
Não há rollback explícito porque não há janela onde ele seja necessário: o candidato completo é construído antes
de qualquer escrita, e o commit contém apenas atribuições a owners existentes. Nenhum test hook inseguro foi
adicionado ao runtime para fabricar exceção.

## Gates Chromium adicionais
SE4 — arquivo real > 1 MiB (documento sintético com nota de 1 MiB): UI informa o limite, nenhum parse ou commit,
sessão ativa inalterada. SE5 — payloads hostis em label, nota, vendor, product, solution notes e declaredDriver:
`window.__pwned === undefined`, zero script node, zero handler `onerror/onload/onclick`, zero `svg[onload]`,
payload visível apenas como texto, console limpo — na tela e no relatório de impressão.

## Object URL
S52 (assíncrono real, aguardando o tick): `createObjectURL` = 1 e `revokeObjectURL` = 1.

## Execução final
Sessão S1–S52: **40 execuções, 40 PASS**. Visual/print Chromium: **61 passed / 0 failed / 31 skipped**.
Suítes congeladas: **13 verdes**. Engine `9a4a2e674389a115a56c…` · HTML `b17c73adf11bfec5ab37…`

---
# Adendo · Phase 4.8.0.2 (fidelidade canônica e commit atômico real)

## Bloqueio A · architectureContext (S53, S54)
O validador passou a derivar os valores de **`ARCH_FIELDS`** — a mesma constante que a UI usa para montar os
selects, exposta pela ponte `window.__V32UI`. A lista manual divergente foi eliminada. **S53 é exaustivo**:
percorre os 6 campos × todos os seus valores canônicos (22 combinações), fazendo set → export → new session →
import → comparação de valor, e falha se qualquer valor legítimo for rejeitado. **S54** recusa os valores que a
4.8.0.1 aceitava indevidamente: `best-of-breed`, `it`, `ot`, `local-only`, `no-restriction`.
Descoberta relacionada: a própria fixture `richLandscape` usava `no-restriction`; foi corrigida para
`no-constraint` — o validador correto expôs o erro do teste.

## Bloqueio B · declaredPlatforms (S55, S56, S47)
O contrato deixou de ser derivado de `BUNDLES[*].appliesTo` e passa a refletir o owner canônico:
`fortigate` (declarado pela UI) e **`fortisoc`** (preservado pelo runtime e coberto pelas suítes congeladas
3.3.3). `notes` entrou em `PLATFORM_KEYS` como optional field canônico. S55 cobre
`{platform:"fortisoc", bundle:null, subscriptions:[]}`; S56 cobre o mesmo com `notes:"piloto"` ao lado de uma
entrada FortiGate com bundle e subscriptions — inputs idênticos no roundtrip, `notes` preservado num e **ausente**
no outro. Correção adicional: a normalização descartava `notes`; agora copia por `PLATFORM_KEYS`.

## Bloqueio C · commit verdadeiramente atômico (S62, S63)
`uxNewSession({silent:true})` foi **removido do commit** — ele resetava e renderizava antes da aplicação
terminar, o que invalidava a alegação de atomicidade da 4.8.0.1. O commit agora: tira **snapshot** dos owners,
escreve dentro de `try`, faz **rollback completo** em qualquer exceção, e só então o `render()` acontece, fora da
janela de commit. **S62** injeta falha real durante o commit (hook exposto apenas em `__DEV`, nunca em produção),
prova `rolledBack:true`, inputs/derivados/tela idênticos ao anterior, e que o mesmo documento importa normalmente
depois. **S63** inspeciona o corpo de `commitCanonicalOwners` (sem `render`/`uxNewSession`/`uxModal`) e confirma
que a tela não muda durante um commit isolado.

## Bloqueio D · reachable state (S58, S59, S60)
Invariantes do editor reproduzidas: solutions só com PRESENT/PARTIAL; solution exige `vendor` **ou** `product`;
`UNSET` proíbe `declaredDriver`. Cada gate tem controle positivo e negativo.

## Bloqueio E · target (S61)
Paridade com a UI: alvo deve ser **estritamente superior** ao current confirmado (`target == current` agora é
recusado, como `revalidateTargets` faz); baseline `NA` mantém a semântica congelada.

## Bloqueio F · paridade de evidência (S64)
SE4 e SE5 passaram a **produzir screenshots reais** (`SE4-oversize-rejected-*`, `SE5-xss-inert-*`), empacotados em
`visual_print_evidence_48.zip`. S64 lê o próprio archive e exige artefato para cada SE declarado neste relatório.

## Self-import property (S57)
Nove fixtures canônicos (standard, rich, fortisoc, unset, none, insufficient, target, refinement, top stage):
o documento exportado pelo build é aceito pelo import do mesmo build, com `captureCanonicalInputs` idêntico.

## Execução final
Sessão S1–S64: **52 execuções, 52 PASS**. Chromium (4.7 + SE1–SE5): **61 passed / 0 failed / 31 skipped**.
Suítes congeladas: **13 verdes**. HTML `200768ebfea726d9e6d73be4457ca8d68a423881aadf1e5ca1ed434f42588997`

---
# Adendo · Phase 4.8.0.3 (self-containment, compatibilidade de plataforma e prova de rollback)

## platform × bundle (S65)
Regra derivada de `V32.BUNDLES[bundle].appliesTo`, a mesma que `validateConfigV32()` aplica no engine — nenhuma tabela manual. Matriz table-driven: **válidos** fortigate+atp/utp/ent/null (com e sem subscriptions), fortisoc+null, fortisoc+null+notes; **inválidos** `fortisoc+atp`, `fortisoc+utp`, `fortisoc+ent`, platform inexistente, bundle inexistente, subscription inexistente. O gate confirma que os três bundles atuais têm `appliesTo:"fortigate"`. Sobre subscriptions: o runtime não impõe relação subscription×bundle além da existência do ID (o badge de bundle é read-only e nunca grava), então nenhuma regra adicional foi inventada.

## Self-containment do documento (S66, S67, S72)
`normalizeSessionDocument` deixou de ler `V32.ARCHITECTURE_CONTEXT` — **nenhum valor vem da sessão aberta**. O schema v1 passou a exigir `architectureContext` **completo**; documento parcial ou ausente é recusado antes do commit, com a sessão anterior intacta (S67). S66/S72 importam **o mesmo documento D** sobre duas sessões prévias semanticamente diferentes (A com arquitetura oposta, B com defaults) e exigem `captureCanonicalInputs(A) === captureCanonicalInputs(B) === conteúdo de D`, além de `RecommendationContext` equivalente.

## Rollback após escrita parcial (S62+S68, S69)
O hook `__sesSetCommitHook` foi **removido do runtime**. A falha é injetada pelo harness via monkey-patch temporário de `Set.prototype.clear` — chamada que ocorre **depois** de `arq`, `ans` e `notes` já terem recebido valores do candidato. O teste captura o estado parcial no momento da exceção (prova de escrita prévia), restaura o patch em `finally`, e exige inputs, derivados e tela idênticos ao estado anterior, `rolledBack:true` e import limpo do mesmo documento em seguida. S69 é gate estrutural: todo owner escrito pelo commit existe no snapshot e na restauração.

## notes e declaredDriver estritos (S70, S71)
`notes`: string (vazia aceita, como o owner preserva); object/array/number/boolean/null recusados; ausência permanece ausência. `declaredDriver`: `null` e `{note:"texto"}` aceitos; `{}`, `{note:null}`, `{note:""}`, `{note:{}}`, `{note:"x",extra:true}` e string recusados — derivado de `L.declaredDriver = drv.value.trim() ? {note} : null`, que nunca produz `{note:""}`.

## Evidência SE4 (S74/S75)
A screenshot passou a ser capturada **com o modal aberto**, mostrando "Arquivo maior que o limite de 1 MiB": `SE4-oversize-modal-1366.png` e `SE4-oversize-modal-390.png`. As capturas pós-fechamento foram renomeadas para `SE4-oversize-state-preserved-*`, que é o que de fato provam. S74/S75 valida existência, tamanho > 0, extensão e presença específica dos artefatos do modal.

## Self-import expandido (S73)
FortiGate com bundle+subscriptions, FortiSOC sem bundle, FortiSOC com notes, arquitetura completa não-default e declaredDriver válido: cada documento exportado é aceito pelo próprio build com inputs idênticos.

## Execução final
Sessão S1–S75: **60 execuções, 60 PASS**. Chromium: **61 passed / 0 failed / 31 skipped**. Suítes congeladas: 13. HTML `e64e92537a37118ce1e1b8987347ea97c003455552b28862cd0837febbdf53dc`

---
# Adendo · Phase 4.8.0.4 (declaredDriver e consistência documental)

## Bloqueio de runtime · declaredDriver obrigatório (S76, S77, S78, S71)
`declaredDriver` passou a ser **propriedade obrigatória** de cada capability no documento: ausência é recusada na
validação, **antes** da normalização e do commit — a normalização não converte mais ausência em `null`
(missing ≠ null). S76 cobre ausente (REJECT), `null` (PASS) e `{note:"texto"}` (PASS); S77 prova que um
documento sem o campo, importado sobre sessão rica ativa, deixa inputs, derivados e tela idênticos; S78 verifica
que todo capability exportado inclui a propriedade. **Correção do gate anterior:** S71 afirmava
`mk(undefined)===true`, ou seja, o próprio teste legitimava a ausência — agora exige `false`.

## Consistência documental (S79, S80, S81, S82)
Quatro gates passam a verificar o schema contra o runtime a cada
execução: **S79** faz parse de todos os blocos JSON do `SESSION_SCHEMA_V32.md` e submete os documentos de sessão
ao `validateSessionDocument` real — o exemplo inline anterior tinha `architectureContext` parcial e foi
substituído pelo `exemplo-minimo.json` íntegro, gerado pelo build; **S80** exige o texto de target como
*estritamente superior* e a referência ao gate **S61** (o texto stale "nunca inferior" e a citação a S48 foram
removidos); **S81** exige que a documentação declare o recompute/render **fora da transação** e proíbe a
afirmação não qualificada "qualquer falha deixa a sessão intacta"; **S82** verifica que toda tabela de contratos
tem número de células consistente e cobre declaredDriver, architectureContext, declaredPlatforms, notes, signals,
solutions e target. A antiga §8.1 duplicava a tabela normativa com formato divergente — foi unificada na §11,
eliminando a segunda fonte de verdade.

## Execução final
Sessão S1–S82: **67 execuções, 67 PASS**. Chromium: **61 passed / 0 failed / 31 skipped**.
Suítes congeladas: 13. HTML `ed1f383dfc11a88224482e0f138be0a8b2c68b4046fd59791b1907bc8d9e4eaa`

---
# Adendo · Phase 4.8.0.5 (domínio do owner de Landscape e strictness de plain object)

## Blocker A · domínio das keys de Landscape (S83, S84, S85, S89)
O helper único `capIds()` misturava dois contratos. Agora existem `landscapeIds()` (`Object.keys(V32.TECH_LANDSCAPE)`, 22 IDs) para as **chaves** de `technologyLandscape.capabilities`, e `capabilityIds()` (`Object.keys(V32.CAPABILITIES)`, 25 IDs) para `solutions[].coveredCapabilities`. `soc-governance`, `soc-staffing` e `soc-skills` (todos com `landscapeEnabled:false`) passam a ser recusados como entries de Landscape, com mensagem específica — a mesma invariante que `validateConfigV32()` aplica no engine (L789). S83 é positivo e exaustivo: percorre os 22 IDs do owner e exige aceitação em shape canônico, além de provar que toda key exportada pertence ao owner. S84+S89 recusam os três IDs em validação e import, com a sessão rica ativa intacta. **S85 prova a separação**: `coveredCapabilities:["soc-governance"]` é aceito ao mesmo tempo em que `capabilities["soc-governance"]` é recusado.

## Blocker B/C · arrays em containers de mapa (S86, S87, S88)
`typeof [] === "object"` fazia `answers: []` e `notes: []` passarem no gate de shape (e, sem chaves enumeráveis, os loops seguintes também não recusavam). Ambos passaram a exigir `!Array.isArray(...)`. S86 recusa `[]`, `[1,2,3]`, string, `null`, número e boolean, aceitando o mapa real; S87 faz o mesmo em `notes`, preservando `{}` e a semântica **sparse** (ausente continua válido).

## Auditoria de containers (item 12, S88)
Varredura do `ui_session_v32.js` encontrou **exatamente dois** casos de `typeof x !== "object"` sem guard de array — os dois já reportados (`answers`, `notes`). As outras duas ocorrências estão nos walkers recursivos (`hasForbiddenKeys`, `hasReservedDerived`), onde arrays **devem** ser percorridos; exceção declarada e excluída pelo gate. S88 fecha o ciclo empiricamente: injeta `[]` em oito containers de mapa do documento e exige recusa em todos, além de exigir zero checagens sem guard no source.

## Execução final
Sessão S1–S89: **73 execuções, 73 PASS**. Chromium: **61 passed / 0 failed / 31 skipped**. Suítes congeladas: 13. HTML `7aea50f227d839dce7088be8a1335b7f57d2433470cf0617d22ac15357a364c5`

---
# Adendo · Phase 4.8.0.6 (owner completeness, semântica de coveredCapabilities e paridade de editor)

## Falso positivo encontrado em S41/S85 (e também em S44)
A auditoria adversarial da 4.8.0.5 apontou que o fixture rico `richLandscape()` declarava
`coveredCapabilities:["network-detection"]` numa solution de **`network-detection`**, e que **S85** exercitava o
campo na mesma posição. Esse estado **não é produzível pela UI**: `solRow()` só renderiza os checkboxes de
cobertura quando `capId==="soc-platform" && !/fortisoc/i.test(s.product||"")`, e `readDraftFromDom()` só grava ou
apaga o campo sob a mesma condição. A suíte, portanto, havia passado a **legitimar comportamento incorreto** —
mesma classe do episódio histórico em que S71 legitimava `declaredDriver` ausente.

Durante a correção verificou-se que **S44 também usava a posição inválida** (`network-detection`), fato não
citado na especificação; está registrado aqui por transparência e foi corrigido junto, dentro da mesma boundary.

A confirmação não foi textual: ao fechar o contrato, **S57 (self-import property) falhou** com
`export rejeitado pelo próprio import · coveredCapabilities declarado em network-detection`, provando
empiricamente que o fixture — e não o validador — estava errado. Fixtures corrigidos: o campo passou a viver numa
solution **third-party de `soc-platform`** (`Plataforma Z`, `["security-automation","soc-governance"]`), e
`network-detection` conservou o resto do estado rico. **S103** trava a regressão: a posição antiga volta a ser
recusada e nenhuma capability diferente de `soc-platform` carrega o campo no fixture atual.

## Blocker A · contexto canônico de `coveredCapabilities` (S90, S91, S92, S93, S103)
A validação era ampla demais: checava o **domínio do ID**, nunca a **posição**. Agora o campo só é aceito em
`capabilities["soc-platform"]` e apenas em solution não-FortiSOC, com domínio
`Object.keys(V32.CAPABILITIES).filter(id => id !== "soc-platform")` — literalmente a expressão que monta a grade
de checkboxes. Array vazio, duplicatas, auto-cobertura (`["soc-platform"]`) e IDs inexistentes são recusados; a
representação de "nenhuma cobertura declarada" é a **ausência** do campo, como em `delete s.coveredCapabilities`.
Nenhum ID individual foi redigitado — apenas o sentinel `soc-platform`, já usado pelo runtime como âncora.

**S90 usa oracle independente**: lê `ui_v32.js` e `engine_v32.js` e exige que os predicados congelados continuem
presentes, de modo que uma divergência futura quebre o gate em vez de silenciá-lo. **S93** é o gate derivado:
importa o documento e observa `suppressedByPlatform().caps` — com a declaração explícita, a supressão é
exatamente `security-automation,soc-governance`; removida a declaração, **nada** é inferido para plataforma de
terceiro. O engine não foi tocado.

## Blocker B · owners completos × owners sparse (S94–S99, S104)
O exporter sempre serializa completos `assessment.answers`, `technologyLandscape.capabilities`,
`architectureContext`, `declaredPlatforms`, `signals` e `operationalRefinement.answers`, mas o import aceitava
ausência parcial e a normalização reconstruía defaults (`null`, `UNSET`, `"unset"`, `[]`) — reabrindo a classe
`missing → silently defaulted` já fechada para `declaredDriver`. A validação passou a exigir os conjuntos
completos, e `normalizeSessionDocument()` deixou de fabricar qualquer default: `requireComplete()` lança exceção,
e `importSessionDocument()` devolve erro **sem tocar em nenhum owner global**. Os owners genuinamente sparse
(`assessment.notes`, `targetProfile.overrides`, campos opcionais de solution, `declaredPlatforms[].notes`)
permanecem sparse — provado em **S99**.

**S104** cobre os dois lados: o candidato de um documento íntegro é completo (22 capabilities, todos os
`SIGNAL_IDS`, 15 respostas) e cada remoção individual morre tanto na normalização quanto na validação.

## Blocker C · paridade de strings com `readDraftFromDom()` (S100, S101, S102)
O import aceitava representações que o editor converteria de imediato. Agora `vendor`/`product` devem ser iguais
ao próprio `trim()` (vazio segue válido em **um** dos dois — S58 preservado); `coverage`/`notes` devem ser
trimados e não vazios, com "não informado" representado pela **ausência**; `status` perdeu `""` do domínio do
import (a opção visual do select em `STATUS_LABELS` **não** foi alterada); `declaredDriver.note` passou a exigir
igualdade com o próprio trim. **Não há trim silencioso na importação** — a representação não canônica é
recusada. `assessment.notes` e `declaredPlatforms[].notes` não foram tocados: contratos distintos e já
congelados.

## Sensibilidade dos gates (mutation testing)
Para descartar gates que apenas repetem a implementação, três mutantes foram injetados e revertidos:
desativar a checagem de posição de `coveredCapabilities` → **S90 e S103 falham**; reintroduzir o default
fabricado em `normalizeSessionDocument()` → **S104 falha**; reintroduzir `""` no domínio de `status` →
**S101 falha**. O source foi restaurado byte-idêntico após cada mutante.

## Alterações metodológicas
**Nenhuma.** Engine byte-idêntico, M41 inalterado, scoring/perguntas/portfolio/UI intocados.

## Execução final · 4.8.0.6
Sessão S1–S104: **88 execuções, 88 PASS**. Chromium (Chromium 141.0.7390.37, resolvido por
`/opt/google/chrome/chrome` via a rota portável da Phase 4.7): **61 passed / 0 failed / 31 skipped** — mesma
contagem do baseline 4.8.0.5. Suítes congeladas: engine 105/105, UI 19+25+11+23+26, UX 56, TARGET 30, REF 28,
JOURNEY 31, ICONS 12. M41: comparação PASS, payload canonicalizado
`9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b` (inalterado).
Clean-room a partir do audit package publicado: `sha256sum -c MANIFEST.sha256` 73/73 OK ·
`npm ci --engine-strict` (Node v22.22.2, npm 10.9.7, 0 vulnerabilities) · `npm run test:all` exit 0 ·
canonical Chromium run. Build determinístico: rebuilds consecutivos reproduzem
`ae425added18006552375e24f1b5412f93b04e597b4c2637d93af3813580c4c3`.
Engine byte-idêntico: `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a`.

---
# Adendo · Phase 4.8.0.7 (self-import closure, limites em escalares Unicode e coerência de evidência)

## Blocker A · a propriedade de self-import era falsa no mesmo build (S106, S107, S112, SE6–SE8)
`downloadSession()` serializava e baixava **sem preflight**: o documento não era validado pelo validador do
import e o limite de 1 MiB só existia do lado da importação. Dois estados de UI reais foram reproduzidos:

1. nota de avaliação com 10.001 escalares → o `.json` emitido era **recusado pelo próprio build**;
2. landscape com textos no limite → serialização de **1.263.070 bytes**, acima do 1 MiB que o import aplica.

`prepareSessionExport()` passou a montar o documento exato, validá-lo com `validateSessionDocument()`,
serializá-lo e medir o **tamanho UTF-8 dos bytes que seriam emitidos** — tudo **antes** de qualquer Object URL.
Export recusado não cria Blob, não cria Object URL, não gera anchor e não altera a sessão; a UI mostra um erro
local explícito ("Não foi possível exportar"). **Nada é truncado silenciosamente.** Em Chromium real, SE7 e SE8
provam ausência de download, erro visível, `URL.createObjectURL` com contagem zero e estado inalterado; SE6 prova
o caminho aceito ponta a ponta (export → download real → nova sessão → file chooser → preview → Results).

## Defeito adicional encontrado pelo próprio preflight (não previsto na spec)
`buildSessionDocument()` truncava o label com `String(label).slice(0,200)`, que corta **code units**. Com
`"a" + 120 emojis`, o corte partia um par surrogate (último code unit `d83d`), produzindo um label malformado que
o próprio import recusaria — exatamente a classe de defeito do Blocker A. Corrigido com `sesLabel()`, que trunca
por escalares. Registrado aqui por não constar da especificação.

## Blocker B · o limite de 10.000 passou a contar escalares Unicode (S105, S108)
`strKey()` e as checagens de `assessment.notes`, `declaredDriver.note` e `declaredPlatforms[].notes` usavam JS
`.length` (code units UTF-16): um campo com 6.000 emojis era recusado apesar de estar muito abaixo do limite
normativo. Fonte única criada: `scalarLen()` + `isWellFormedUnicode()`, consumidas por `strFieldError()`.
10.000 escalares astrais são aceitos e atravessam o roundtrip **intactos**; 10.001 são recusados; sequências
combinantes contam pelos escalares constituintes (não por grapheme cluster); surrogate desemparelhado — alto ou
baixo — é recusado como Unicode não canônico, sem normalizar nem truncar. O contrato foi estendido a **toda**
string importada, incluindo `toolVersion`, `engineSha256` e `createdAt`. `label` recebeu o bound canônico
**estrito de 200 escalares**, provado pelo exporter em vez de arbitrado.

## Blocker C · coerência de release e proveniência (S109, S110)
Corrigidos: `description` do package (dizia 4.8.0.5), `toolVersion` dos dois exemplos sintéticos, linha de runtime
do schema e topo deste relatório — que agora abre com um bloco **RELEASE ATUAL** declarando a versão corrente e
avisando que as seções seguintes são adenda históricos. O bloco JSON inline do schema passou a ser **derivado do
arquivo publicado** `synthetic_session_examples/exemplo-minimo.json`, com igualdade profunda exigida por S110
(antes divergiam em `toolVersion`). A afirmação de proveniência "gerado pelo próprio build" era **falsa** —
`build_v32_html.py` não emite esses arquivos — e foi substituída pelo mecanismo real: exportado pelo runtime,
revalidado pelo import (S79) e conferido contra o build (S109). S110 verifica também que o builder não os gera.

## Item de auditoria adversarial D · disposição explícita: duplicatas NÃO são canônicas (S111)
Evidência no source congelado, não suposição:
- `subscriptions` é montada por `Object.keys(V32.SECURITY_SUBSCRIPTIONS).filter(checkbox)` — únicas por
  construção — e `deriveLicensedContext()` deduplica via `new Set()`, logo **nenhum contrato de runtime depende**
  de preservar repetição;
- `declaredPlatforms` é reconstruída como `others.filter(p => p.platform!=="fortigate").concat([entry])`, isto é,
  **no máximo uma entrada por plataforma**; nenhum caminho do runtime cria uma segunda.

Disposição: ambas as duplicatas são **recusadas antes do commit**, com gates negativos (platform repetida,
fortisoc repetida, subscription repetida) e positivo (entradas distintas com subscriptions únicas permanecem
válidas). S111 usa `ui_v32.js` e `engine_v32.js` como oracle independente.

## Alteração de infraestrutura declarada
A suíte de sessão passou a estourar o heap padrão do V8 (limite de 2.047 MB nesta máquina) pelo acúmulo de
janelas jsdom. Mitigações aplicadas: fechamento explícito das janelas nos gates novos e remoção de um render de
~1 MiB desnecessário em S107. Ainda assim foi preciso elevar o heap da suíte:
`"test:session": "node --max-old-space-size=3072 tests_session_m48.js"`. É mudança de **infraestrutura de
execução**, não de contrato — **nenhum gate foi enfraquecido para passar**.

## Alterações metodológicas
**Nenhuma.** Engine byte-idêntico, M41 inalterado, scoring/perguntas/portfolio/UI intocados.
