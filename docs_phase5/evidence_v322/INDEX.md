# Evidência visual · Patch V3.2.2 — contexto, rodapé e pendência de impressão

Acervo gerado por `tools_p52_shots.js` com `V322_SHOTS=1` sobre a candidata local.
Não é gate: não afirma PASS nem FAIL. As medidas que sustentam as asserções estão em
`V322-medidas.json` — bounding boxes, largura útil, fração ocupada, sobreposição,
overflow, estados `open`, contagem de mensagens por local e nomes acessíveis.
Screenshot não é o único oracle: os gates `V322-*` medem geometria e DOM.

| cena | viewport | arquivo | descrição |
|---|---|---|---|
| 01-contexto-home | 1440x900 | `V322-01-contexto-home.png` | Contexto tecnológico aberto pela entrada da home — duas regiões |
| 02-primeira-abertura-seis-recolhidos | 1440x900 | `V322-02-primeira-abertura-seis-recolhidos.png` | Primeira abertura limpa — os seis grupos principais recolhidos, inclusive SOC & Operations |
| 10-capability-ajuda-no-nome | 1440x900 | `V322-10-capability-ajuda-no-nome.png` | Capability aberta — ajuda (i) só no nome da capability; 'Situação declarada' sem controle |
| 11-plataformas-sem-ajuda-por-item | 1440x900 | `V322-11-plataformas-sem-ajuda-por-item.png` | Plataformas e licenciamento aberto — ajuda única no cabeçalho, zero controles por item |
| 01-contexto-resultados | 1440x900 | `V322-01-contexto-resultados.png` | Contexto tecnológico aberto pela entrada da resultados — duas regiões |
| 03-rodape-390 | 390x900 | `V322-03-rodape-390.png` | Rodapé da home em 390px — bloco legal na largura útil, autoria à direita |
| 03-rodape-768 | 768x900 | `V322-03-rodape-768.png` | Rodapé da home em 768px — bloco legal na largura útil, autoria à direita |
| 03-rodape-1440 | 1440x900 | `V322-03-rodape-1440.png` | Rodapé da home em 1440px — bloco legal na largura útil, autoria à direita |
| 03-rodape-1920 | 1920x900 | `V322-03-rodape-1920.png` | Rodapé da home em 1920px — bloco legal na largura útil, autoria à direita |
| 03-rodape-2560 | 2560x900 | `V322-03-rodape-2560.png` | Rodapé da home em 2560px — bloco legal na largura útil, autoria à direita |
| 03-rodape-3440 | 3440x900 | `V322-03-rodape-3440.png` | Rodapé da home em 3440px — bloco legal na largura útil, autoria à direita |
| 04-trilho-alteracoes-pendentes | 1440x900 | `V322-04-trilho-alteracoes-pendentes.png` | Trilho lateral com 'alterações pendentes' ANTES de qualquer tentativa de impressão |
| 05-mensagem-abaixo-do-pdf | 1440x900 | `V322-05-mensagem-abaixo-do-pdf.png` | Mensagem exata logo abaixo do grupo de ações que contém Imprimir / salvar em PDF |
| 06-mensagem-junto-a-salvar-cancelar | 1440x900 | `V322-06-mensagem-junto-a-salvar-cancelar.png` | Mensagem preservada junto a Salvar contexto / Cancelar |
| 07-trilho-apos-bloqueio | 1440x900 | `V322-07-trilho-apos-bloqueio.png` | Item Contexto tecnológico com ênfase de erro — o texto continua explicando a ação |
| 08-limpo-apos-salvar | 1440x900 | `V322-08-limpo-apos-salvar.png` | Estado limpo após Salvar contexto — nenhum dos três indicadores permanece |
| 09-limpo-apos-cancelar | 1440x900 | `V322-09-limpo-apos-cancelar.png` | Estado limpo após Cancelar — nenhum dos três indicadores permanece |
| 12-avanco-entre-perguntas | 1440x900 | `V322-12-avanco-entre-perguntas.png` | Pergunta seguinte logo após avançar — transição horizontal curta em curso |
| 13-retorno-entre-perguntas | 1440x900 | `V322-13-retorno-entre-perguntas.png` | Pergunta anterior logo após voltar — mesma transição, no sentido inverso |
| 14-home-1920x1080 | 1920x1080 | `V322-14-home-1920x1080.png` | Tela de abertura da candidata V3.2.2 — imagem usada pelo README |
| 15-questionario-1920x1080 | 1920x1080 | `V322-15-questionario-1920x1080.png` | Pergunta com o mapa do assessment, na candidata V3.2.2 |
| 16-resultados-1920x1080 | 1920x1080 | `V322-16-resultados-1920x1080.png` | Workspace de resultados da candidata V3.2.2 |

## Medidas

| arquivo | conteúdo |
|---|---|
| `V322-medidas.json` | geometria do rodapé nas seis larguras; estrutura do editor nas duas entradas; as três apresentações da pendência em cada etapa do ciclo; o censo de ajuda `(i)` por família de alvo (preservadas × removidas); e a medição de movimento com e sem `prefers-reduced-motion` |

---

## Errata final orientada a risco · REV C

Acervo NOMINAL desta rodada em `rev_c/`, gerado por scripts auxiliares de sessão — **não** por
`tools_p52_shots.js`, que permanece byte-idêntico e cujo acervo anterior não foi regenerado.

Como nas rodadas anteriores: **captura não é oracle**. O que decide são os JSON e os logs com exit
code; as imagens ilustram.

| arquivo | o que registra |
|---|---|
| `rev_c/RED_V322C.log` | primeira execução dos seis gates novos na candidata de ENTRADA (`332631223e40cfea…`) — 6/6 FAIL, exit 1 |
| `rev_c/GREEN_V322C.log` | os mesmos seis gates sobre a candidata corrigida (`913440adc157e850…`) — 6/6 PASS, exit 0 |
| `rev_c/V322C-mutacao-dirigida.log` · `.json` | campanha dirigida 29/29, com o diagnóstico das duas mutações no-op da primeira execução |
| `rev_c/V322C-test-all.log` | regressão integral, exit 0, contagens congeladas conferidas |
| `rev_c/V322C-test-visual.log` | 67 passed · 0 failed · 37 skipped |
| `rev_c/V322C-SMOKE-invariantes.json` | fluxo completo por mouse e por teclado + os invariantes canônicos (`UNSET ≠ NA ≠ 0`, tecnologia não altera score, Target sem Current, sessão só canônica) |
| `rev_c/V322C-01-home-1920x1080.png` | home dos bytes FINAIS — o CTA de contexto já na variante de preenchimento de 4,80:1 |
| `rev_c/V322C-02-enter-no-select-editor-vivo.png` | B-01 fechado: `Enter` no select "Situação declarada" **não** destrói o editor |
| `rev_c/V322C-03-enter-em-salvar-volta-a-home.png` | `Enter` em Salvar contexto grava e devolve à home, sem draft órfão |
| `rev_c/V322C-04-editor-390px-sem-corte.png` | M-01 fechado: plataformas e licenciamento inteiro dentro da tela a 390 px |
| `rev_c/V322C-05-erro-unico-junto-das-acoes.png` | M-02 fechado: a região de erro que o runtime resolve é a do editor, junto de Salvar/Cancelar |

Medições escritas pelos próprios gates, no primeiro nível deste diretório:
`V322C-KEY1-teclado.json` (matriz K1–K12 e a regra por alvo T1–T12, com o motivo do escudo por
classe de controle), `V322C-FOC1-foco.json`, `V322C-PRN1-impressao.json`, `V322C-RFL1-reflow.json`
e `V322C-CON1-contraste.json`.

> A imagem de abertura do `README.md` continua sendo `V322-14-home-1920x1080.png`, capturada antes
> da correção M-05: ela mostra o CTA de contexto no azul de marca (`#307FE2`) e não na variante de
> preenchimento (`#2B72CB`). A diferença é de um controle e de 10% de luminância no mesmo matiz.
> Registrada como ressalva não bloqueante `R-1` na §17.12 do relatório: a §3.1 autoriza editar o
> `README.md` apenas se o comportamento documentado mudar, e trocar uma captura não é isso.
> `rev_c/V322C-01-home-1920x1080.png` é a captura correspondente aos bytes finais.
