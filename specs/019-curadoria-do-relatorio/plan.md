# Plano — 019-curadoria-do-relatorio

> Fase 2 · dono: tech-lead · consome a [spec](spec.md) aprovada em 2026-09-17.
>
> **Quem escreveu**: o orquestrador, **no contrato do `tech-lead`** — agentes de
> papel indisponíveis como subagentes nesta sessão (precedente da 018).

## Desenho

### A decisão central: transformar, não ocultar

A spec exige a visão por solução (C6/C7) **sem** derrubar `P52-REC1g`, que mede
a geometria de `#p52-sec-support > .apoio-block` e reprova *"cards de apoio em
coluna única no desktop"*.

A saída óbvia — construir 9 cards novos e ocultar os 15 legados — **derruba o
gate**: `getBoundingClientRect()` de elemento oculto zera, e o gate lê coluna
única.

**O desenho é outro: os `.apoio-block` são REAGRUPADOS, não substituídos.** Cada
bloco deixa de ser uma capability e passa a ser um **produto**; os nós internos
migram entre blocos. O gate continua com exatamente o mesmo sujeito — blocos
reais, visíveis, em grade — e o conteúdo é o mesmo conjunto, reorganizado.

**Medido, e é o que torna isso possível**: na sessão de referência cada produto
tem **exatamente um** `.prod` completo (com descrição e link) e *N−1*
`.prod-mini`. A descrição existe uma vez; o que se repete são as menções. Logo a
transformação é **movimento de nós**, sem reescrever texto — a mesma disciplina
de `p52ProdBullets()` e `p52SplitBanner()`.

### Módulos

| módulo | responsabilidade | dono | R9 |
|---|---|---|---|
| `ui_curation_v32.js` **(novo)** | **owner do estado** `reportCuration`; bridge `__CURATION` | `core-engineer` | §5 — estado canônico nunca nasce em decorador |
| `ui_curation_edit_v32.js` **(novo)** | o editor de curadoria (tela) | `ui-engineer` | §7 — uma responsabilidade por módulo |
| `ui_p52_support_v32.js` **(novo)** | a visão por solução na seção de apoio | `ui-engineer` | §7 — o workspace já passa de 1.900 linhas; não cresce mais |
| `ui_session_v32.js` | captura/restauro da sexta chave | `data-engineer` | **§29.4 · autorizado 2026-09-17** |
| `ui_v32.js` | proveniência no papel, em `buildPrintReport()` | `ui-engineer` | **§29.4 · autorizado 2026-09-17** |
| `tests_session_m48.js` | reancoragem da lista do `S4-S5` | `qa-engineer` | **§29.4 · autorizado 2026-09-17** |

> **Por que três módulos novos e não um**: estado, edição e apresentação são três
> responsabilidades. Juntá-las repetiria o `ui_p52_workspace_v32.js`, que é o
> contraexemplo citado na própria R9 §7.

### Owner do estado

`reportCuration` nasce em `ui_curation_v32.js`, exposto **só** por getters e
setters de bridge. Nenhum módulo de renderização escreve nele — eles consomem.
É a R9 §5 ao pé da letra, e é o que sustenta o gate `D019-CUR1`.

## Contratos e registros

### Bridge novo — `.claude/verify/bridges.json`

```
"__CURATION": {
  "owner": "ui_curation_v32.js",
  "nota": "estado de curadoria do relatório (seleção por offering); getters/setters e contrato de leitura"
}
```

**Um bridge por módulo** (R9 §2): os dois módulos de apresentação **consomem**
`__CURATION` e não registram bridge próprio.

### Patch-points

**Nenhum monkey-patch.** A integração com o papel usa o mesmo padrão já existente
de hook de impressão (`__uxTargetPrintHTML`, `__uxRefinementPrintHTML`) —
extensão por API de registro, R9 §4.

### Ordem de injeção no builder

`build_v32_html.py` injeta por ordem declarada. Os três novos entram **depois**
de `ui_v32.js` e **antes** de `ui_p52_workspace_v32.js`, porque a camada 5.2
consome `__CURATION` na recomposição da seção de apoio.

### Pins que mudarão

`ui_session_v32.js` · `ui_v32.js` · `tests_session_m48.js` · os três módulos
novos · `bridges.json` · `expected_suites.json` · `pipeline.yaml` (harness novo)
· o HTML gerado. **`gen_pins` no mesmo PR** (R8 §1).

## Boundary

**Classe tocada mais alta: produto (§29.4 PROTEGIDO).**

| arquivo | classe | rito |
|---|---|---|
| `ui_session_v32.js` | §29.4 | autorização nominal do proprietário, **2026-09-17, no chat** |
| `ui_v32.js` | §29.4 | idem |
| `tests_session_m48.js` | §29.4 | idem |
| `quickscan_secops_soccmm_v3_1_3.html` · `engine_v32.js` | **`frozen`** | **NÃO TOCADOS.** O desenho evita `step`/`render()` por isso |

**Nenhum arquivo `frozen` é tocado**, e é critério de aceite: o `D019-MED1` exige
payload M41 byte-idêntico.

## Checklist R9 (módulos novos)

- [ ] IIFE + `__installed` nos três
- [ ] **um** bridge registrado (`__CURATION`), e só no módulo de estado
- [ ] CSS com prefixo próprio (`.cur-*`), sem seletor alheio
- [ ] **zero `innerHTML =`** — `textContent` e `setAttribute`
- [ ] ≤ 600 linhas por módulo, ou justificativa registrada aqui
- [ ] helper único da invariante de seleção, exposto por bridge

## Waves

| Wave | Tarefas | Depende de |
|---|---|---|
| **W1 · RED** | `qa-engineer` escreve os 10 gates `D019-*` + os 10 mutantes; executa, **registra o FAIL e commita o red** | — |
| **W2 · estado** | `ui_curation_v32.js` + bridge + registro em `bridges.json` `[core-engineer]` | W1 |
| **W3 · sessão** `[P]` | sexta chave em `captureCanonicalInputs()`, validação na importação, reancoragem do `S4-S5` `[data-engineer]` + `[qa-engineer]` | W2 |
| **W4 · apoio por solução** `[P]` | `ui_p52_support_v32.js`: reagrupamento por produto, agrupamento de portfólio, balde de serviços `[ui-engineer]` | W2 |
| **W5 · editor** | `ui_curation_edit_v32.js`: a tela, no padrão do editor de contexto `[ui-engineer]` | W2, W4 |
| **W6 · papel** | proveniência e seleção em `buildPrintReport()` `[ui-engineer]` | W2, W5 |
| **W7 · fecho** | `expected_suites.json`, `pipeline.yaml`, `gen_pins`, `spec-validate`, relatório final | todas |

**W3 e W4 são `[P]`** — módulos distintos, donos distintos, sem interseção de
arquivo. Vão na mesma mensagem (R5 §2).

## Riscos e rollback

| risco | como se detecta | como se reverte |
|---|---|---|
| **O reagrupamento quebra a geometria do apoio** | `P52-REC1g`, job `visual` do CI — **não roda nesta máquina** (KI-3) | reverter W4; as demais waves não dependem do agrupamento |
| **A sexta chave altera o payload M41** | `D019-MED1` + stage `m41`, **local** | desenho já a mantém fora do motor; se acontecer, a demanda **para** (C5) |
| **A reancoragem do `S4-S5` afrouxa a INV-8** | o próprio `S4-S5` + `S27` (recusa de campo derivado) | reverter a reancoragem; a chave é entrada, os 13 derivados seguem proibidos |
| **A proveniência some só no papel** | `D019-PROV1`, cujo mutante **M4** ataca exatamente isso | reverter W6 |
| **Cegar um gate por reescrita de apresentação** | `EA-62`: **antes de qualquer entrada nova de cópia, `grep` do literal em `tests_*.js`** | reverter a entrada |

> O risco de geometria é o único que **esta máquina não julga**. Ele é mitigado
> por desenho — transformar em vez de ocultar mantém o sujeito do gate — mas a
> confirmação é do CI, e a wave 4 não se declara pronta sem o `visual` verde.

## Protótipo

**Não necessário, e a razão está medida.** A pergunta que justificaria um
protótipo — *"dá para reorganizar por produto sem perder conteúdo?"* — já foi
respondida por medição na Fase 0: cada produto tem exatamente um `.prod` completo
e *N−1* menções curtas, então o reagrupamento é movimento de nós sobre um
inventário conhecido. O que resta incerto é **geometria**, e protótipo local não
a responde melhor que o CI, porque o juiz é Chromium (KI-3).
