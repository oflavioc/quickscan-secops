# AUDITORIA INDEPENDENTE · MICROFASE 5.0.2

**Quickscan SecOps SOC-CMM V3.2 · Phase 5.0**  
**Microfase:** 5.0.2 — Evidence Capture & Progress UX  
**Data:** 2026-08-20  
**Modalidade:** auditoria independente somente leitura, pós-implementação e pré-commit  
**Resultado:** **FAIL — CORREÇÃO ESTREITA E REAUDITORIA OBRIGATÓRIAS**

---

## 1. Conclusão executiva

A candidata demonstra preservação da boundary, integração correta do owner canônico de notas,
renderização inerte do conteúdo livre, build determinístico, manifesto íntegro e regressão declarada
em contagens coerentes. A direção arquitetural de AMB-2.1 — observar os retornos reais de
`downloadSession()` e `importSessionDocument()` por wrappers externos — é tecnicamente adequada e
pode ser ratificada sob as condições deste parecer.

Entretanto, a candidata atual **não está apta a commit/push**. Foram comprovados dois blockers reais:

1. o status visível de sessão fica materialmente stale quando o usuário digita evidência depois de
   um export: o owner canônico fica dirty, mas a interface continua afirmando `Sessão exportada`;
2. `P50-SESUX1B` não executa a matriz normativa literal e não prova equivalência completa entre o
   estado real e o texto acessível para dirty/falha.

Esses defeitos atingem justamente a promessa funcional central da microfase: captura de evidência e
mensagem honesta de portabilidade. Portanto, não são ressalvas cosméticas.

Não é necessária uma nova revisão de arquitetura nem uma reimplementação ampla. O fechamento é
cirúrgico: corrigir a atualização do status, completar o gate Chromium, fortalecer o assurance dos
wrappers, corrigir o relatório/evidência e executar reauditoria estreita.

---

## 2. Identidades e estado observados

| item | observado | resultado |
|---|---:|---|
| branch | `feat/phase5-5-0-2` | correto |
| HEAD/base | `701db0c8d9bf9d93a3632fb94fa0403267c21807` | correto |
| commits da 5.0.2 | 0 | correto |
| worktree | candidata não commitada | correto |
| HTML de entrada | `61e8877ee1f798b3a42c2c7232657e065cf7955750e365820e9128a67506c69d` | confere com a 5.0.1 integrada |
| HTML candidato | `866954935e2d03f9c4fa40a6cc15ed44c47c723c9963497d9939c737ba6c0245` | confere |
| engine | `9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a` | preservado |
| manifesto P50 | 23 entradas verificadas, 0 divergências | PASS |
| tags | nenhuma | correto |

O diff material contém **15 arquivos rastreados modificados e 4 arquivos novos**, não apenas 7
alterados e 4 adicionados. Os 15 rastreados são: 7 arquivos funcionais/testes/HTML, o manifesto e 7
evidências cumulativas da 5.0.1 regeneradas. O relatório divulga narrativamente a regeneração dessas
7 evidências, mas a tabela e o handoff não apresentam o inventário completo.

---

## 3. Verificações que passaram

### 3.1 Boundary

- `engine_v32.js` preservado;
- Camada 1 e módulos 4.x protegidos preservados;
- `ui_session_v32.js` preservado;
- `build_v32_html.py`, `package.json` e `package-lock.json` preservados;
- spec REV B, `CLAUDE.md` e registros normativos preservados;
- `ui_p50_suff_v32.js` e `ui_p50_results_v32.js` ausentes;
- nenhuma antecipação material de UI-009A ou UI-012/012A/012B foi encontrada.

### 3.2 Owner de evidência e safe rendering

- o atalho P50 abre o campo congelado `#notetxt`;
- a escrita efetiva continua no handler congelado e chega a `notes[k]`;
- o documento exportado usa `inputs.assessment.notes[qid]`;
- não foi encontrado segundo store de evidência;
- os previews P50 usam `textContent`, não `innerHTML`;
- os payloads adversariais aparecem como texto literal nas evidências, sem nó executável aparente;
- os chips são derivados de dados reais disponíveis no runtime;
- a cue usa a descrição da opção selecionada renderizada pelo runtime.

### 3.3 Gates executados pelo auditor

`tests_p50_core.js` foi reexecutado contra a candidata:

```text
P50 CORE: 23 PASS · 0 FAIL de 23
exit code: 0
```

O resultado é real, mas não detecta o blocker B-502-1 porque `P50-SESUX2` altera uma resposta por API
e força `window.__uxDecor()`. Ele não digita no campo principal de evidência, cujo handler congelado
não chama `render()`.

### 3.4 Evidências visuais

- F8 mostra chips, cue e preview de nota rica;
- F10 mostra os payloads como texto literal;
- não foi observado overflow horizontal nas evidências inspecionadas;
- a superfície permanece visualmente utilizável;
- há redundância visual entre chip, bloco de evidência, botão P50 e toggle congelado, mas isso pode
  ser tratado na 5.0.5 e não é blocker desta auditoria.

---

## 4. Blockers

## B-502-1 — Status visível fica falso ao digitar evidência depois do export

**Severidade:** blocker  
**Cláusulas:** UI-010A · UI-011 · P50-SESUX1B · P50-SESUX2

Foi executada uma sonda independente sobre o HTML real da candidata:

1. carregar o build;
2. realizar export pelo controle congelado;
3. retornar à pergunta sem alterar o conteúdo canônico;
4. abrir `#notetxt` pelo botão P50;
5. digitar evidência e disparar o evento real `input`.

Antes da digitação:

```json
{
  "state": "exported",
  "dirty": "false",
  "text": "Sessão exportada. Guarde o arquivo JSON para retomar posteriormente."
}
```

Depois da digitação, o DOM permaneceu exatamente igual:

```json
{
  "state": "exported",
  "dirty": "false",
  "text": "Sessão exportada. Guarde o arquivo JSON para retomar posteriormente."
}
```

Mas o diagnóstico do próprio produto passou a informar:

```json
{
  "sessionState": "exported",
  "sessionEffectiveState": "default",
  "sessionDirty": true
}
```

A causa é direta: o handler congelado de `#notetxt` atualiza `notes[k]` sem chamar `render()`, enquanto
o componente P50 só se reconcilia durante render/decoração ou após export/import. O estado interno
está correto, porém a afirmação ao usuário fica incorreta.

### Correção exigida

- acrescentar observação **aditiva** do evento real de nota, sem substituir o handler congelado;
- executar a atualização P50 somente depois de `notes[k]` ter sido atualizado;
- nunca escrever diretamente em `notes[k]` a partir do módulo P50;
- provar o fluxo real `export → abrir #notetxt → input → status default/dirty=true`;
- provar também `import → editar nota → status default/dirty=true`;
- incluir mutante que remova/neutralize essa reconciliação e exigir detecção por SESUX.

---

## B-502-2 — P50-SESUX1B não corresponde à matriz normativa e o texto acessível omite estado material

**Severidade:** blocker  
**Cláusula:** P50-SESUX1B (§25.5)

A REV B exige literalmente:

```text
fresh assessment
modified but not exported
export success
import success
post-import modification
export failure
```

A suíte candidata executa `post-export modification` no lugar de `post-import modification`. O fluxo
adicional de pós-export é útil, mas não substitui a fixture normativa de pós-import.

Além disso, o componente usa `aria-label` contendo somente as duas linhas canônicas. Os detalhes
visíveis de dirty e de falha são descendentes do elemento, mas não entram no texto acessível registrado:

```text
estado real: export-failed + dirty=true
texto visível: inclui “A última exportação não foi concluída” e alteração pendente
texto acessível: apenas “Sessão não salva automaticamente. Exporte o arquivo...”
```

Isso não satisfaz a exigência de que o texto visível **e** o texto acessível/computed correspondam ao
estado real.

### Correção exigida

- adicionar a fixture normativa `post-import modification`;
- manter `post-export modification` como cobertura adicional, se desejado;
- fazer o texto acessível comunicar dirty e falha quando esses estados forem materialmente exibidos;
- comparar no gate o estado completo, não apenas as duas linhas-base;
- incluir o fluxo de nota digitada, não somente alteração de resposta por API;
- garantir que falha de export nunca seja anunciada apenas como estado default genérico.

---

## 5. Achado alto — assurance de AMB-2.1 incompleto

## H-502-1 — A direção do wrapper é aceitável, mas as “12 condições” não estão demonstradas

O código atual possui propriedades positivas:

- captura o predecessor antes da substituição;
- usa `.apply(this, arguments)`;
- invoca o predecessor antes do observador;
- repassa o mesmo retorno;
- deixa exceções do predecessor propagarem;
- isola a atualização P50 com `try/catch`;
- não escreve em owner canônico;
- `ui_session_v32.js` permanece byte-idêntico;
- o guard `window.__P50.__installed` evita reinstalação normal do módulo.

Porém, os gates não provam materialmente o contrato do wrapper de sessão. `sessionWrapCount` é apenas
exposto em `diag()` e não é asserido. Não há prova dedicada de:

- exatamente uma captura por função;
- uma invocação do predecessor por chamada;
- preservação de `this` e argumentos;
- identidade do objeto retornado;
- propagação intacta de exceção do predecessor;
- isolamento de falha do observador;
- ausência de dupla instalação/reinjeção;
- sucesso/falha lidos do retorno real para ambas as funções;
- mutante que remova o wrapper ou inverta `r.ok`.

### Decisão recomendada para AMB-2.1

**RATIFICAR A DIREÇÃO ARQUITETURAL**, limitada aos dois wrappers observacionais e condicionada a:

1. nenhuma edição de `ui_session_v32.js`;
2. nenhuma duplicação de validação/import/export;
3. preservação estrita de predecessor, `this`, argumentos, retorno e exceções;
4. instalação única;
5. gates e mutantes discriminantes sobre o contrato acima;
6. correção dos blockers B-502-1 e B-502-2.

Essa ratificação não converte a candidata atual em PASS.

---

## 6. Achados médios e baixos

### M-502-1 — Inventário factual incompleto

O relatório lista 7 arquivos alterados e 4 adicionados. O diff real contém 15 rastreados modificados e
4 adicionados. A narrativa menciona as 7 evidências da 5.0.1 regeneradas, porém:

- elas não entram na tabela de alterados;
- o próprio `MANIFEST_PHASE5_P50.sha256` modificado não entra na tabela;
- o handoff repete a contagem reduzida.

Corrigir o inventário e as contagens finais. Isso é documentação, não boundary violation.

### M-502-2 — Relatório atribui indicador de evidência à sidebar sem implementação correspondente

O relatório declara `chip presente/ausente + estado por pergunta na sidebar`. O código da sidebar
renderiza apenas o estado da resposta (`unset`, `NA`, confirmado); não renderiza presença de nota.

A REV B não obriga especificamente o indicador na sidebar. Portanto, há duas opções aceitáveis:

- remover a alegação do relatório; ou
- implementar e testar o indicador, se desejado sem ampliar o owner.

Não manter a alegação sem evidência.

### M-502-3 — Screenshot de export não mostra o status que pretende evidenciar

`P50-5.0.2-session-exported-1440.png` possui 1440×900 e captura o topo dos resultados. O componente de
status não aparece na imagem inspecionada. Recapturar com scroll/locator/element screenshot, mostrando
claramente `Sessão exportada` e o estado dirty=false.

### L-502-1 — Wording de dirty antes do primeiro export

No estado modificado antes de qualquer export, a UI mostra `Há alterações desde a última exportação.`
Não houve export anterior. Preferir uma formulação factual aplicável aos dois casos, por exemplo:

```text
Há alterações ainda não exportadas.
```

### L-502-2 — Nomes de evidência da 5.0.1 regenerados pela 5.0.2

O Git preserva os bytes históricos, e a regeneração foi divulgada; portanto não é blocker. Ainda
assim, arquivos com nome `P50-5.0.1-*` agora representam o build 5.0.2. Para reduzir ambiguidade nas
próximas microfases, registrar explicitamente que são evidências cumulativas do build corrente ou
adotar nomes versionados por candidata sem sobrescrever as evidências auditadas anteriores.

---

## 7. Evidências de mutation testing

O JSON entregue registra 17/17 mutantes detectados. O conjunto é útil, especialmente M12–M17, mas não
exercita o defeito descoberto nesta auditoria. M16 altera a função de estado e o gate força uma
redecoração manual; ele não prova que o evento real de nota reconcilia a interface.

O fechamento deve acrescentar, no mínimo:

- mutante que remova a reconciliação no evento real de evidência;
- mutante que faça pós-import permanecer `imported` após edição;
- mutante que omita dirty/falha do texto acessível;
- mutante de supressão/inversão do observador `r.ok` em export/import.

Os IDs de gates continuam os normativos existentes; não criar namespace novo. Os novos mutantes podem
estender a sequência M18+.

---

## 8. Escopo da correção e reauditoria

Não é necessário reabrir a spec, a 5.0.1 ou a arquitetura de Session Portability.

Arquivos esperados na correção:

```text
ui_p50_shell_v32.js
tests_p50_core.js
tests_p50_chromium.js
tests_p50_mutants.js
ui_p50_v32.css                  somente se o ajuste visual exigir
quickscan_secops_soccmm_v3_2_dev.html
docs_phase5/MICROFASE_5_0_2_REPORT.md
docs_phase5/evidence_p50/*
docs_phase5/MANIFEST_PHASE5_P50.sha256
```

Reexecução mínima antes da reauditoria:

```text
P50 CORE integral
P50 Chromium integral, Chromium real, sem SKIP
mutation testing integral com os novos mutantes
SESSION 4.8 — 97/97
test:visual — 67/0/37
UG13 em Chromium real
M41
dois builds independentes
manifesto regenerado por último
```

As demais contagens congeladas podem ser referenciadas da execução já concluída se os arquivos
protegidos permanecerem byte-idênticos; não é necessário repetir uma auditoria integral de toda a
Phase 5.0.

---

## 9. Veredito

```text
Boundary                                    PASS
Manifesto 23/23                            PASS
Engine/M41 preservados                     PASS
Owner canônico de evidência                PASS
Safe rendering                             PASS
Build determinístico declarado             PASS
AMB-2.1 — direção arquitetural              RATIFICÁVEL COM CONDIÇÕES
Status honesto após digitação de evidência FAIL — BLOCKER
P50-SESUX1B normativo/acessível             FAIL — BLOCKER
Inventário/evidência documental            CORREÇÃO NECESSÁRIA

RESULTADO FINAL: FAIL
AUTORIZAÇÃO PARA COMMIT/PUSH: NÃO
REMEDIAÇÃO: CORREÇÃO ESTREITA + REAUDITORIA INDEPENDENTE
```

A microfase 5.0.3 permanece não iniciada. Nenhum freeze, release ou deployment é autorizado por este
parecer.

