# Parecer do Product Owner — cross-check da Fase 1 · demanda 003-marcador-duplicado

> Registro de processo (orquestrador). Parecer emitido pelo `product-owner` em
> 2026-08-25, segunda perna da Fase 1 (R4). O PO verificou a spec **contra o
> sistema real**, não contra as citações dos documentos.

## Veredito

**Nenhum bloqueante. Nenhuma objeção de invariante (INV-1/INV-9) nem conflito com
decisão registrada (R13 — a demanda é o cumprimento da remoção prevista da KI-1).**
Aprovação é do usuário; recomendação do PO: aprovar com o ajuste de G2.

## Fidelidade ao refinement aprovado

6/6 casos de borda rastreados na spec (tabela de rastreabilidade conferida item a
item); diff pretendido confere com o source (`build_v32_html.py:70`); strings de
asserção dos gates conferem caractere a caractere com os scripts reais
(`check_markers.py:33,46` · `check_build.py:39,46` · `check_m41.py:28,36`);
pins e linhas citadas conferem com `pins.json` (l.13, 32, 72, 88, 127);
`V32_UI_END` no HTML publicado = 2 hits (l.6270, 11974).

## Achados

| Classe | Achado | Encaminhamento |
|---|---|---|
| **Ajuste** | G2: pinar a linha `marker-lint: 34 marcadores distintos · 0 problema(s)` — mecaniza a cláusula "mesmo conjunto de marcadores distintos", hoje dependente de leitura humana. Não cria nem altera gate; pina saída que o lint já emite. | Emenda aplicada pelo tech-lead antes do portão |
| Observação 1 | M1 (mutante manual) é acréscimo da spec, declarado honestamente; fortalece a verificação e respeita a KI-2 (harness formal na Onda 3). Não é escopo inventado. | Registro histórico |
| Observação 2 | Caso de borda 5 (remoção da linha em `design-decisions.md`) não tem gate de conteúdo — o `baseline` prova repin, não a linha certa. | O PO confere manualmente no aceite de intenção (Fase 6) |
