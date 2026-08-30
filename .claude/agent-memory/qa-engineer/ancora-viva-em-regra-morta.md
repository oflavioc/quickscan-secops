---
name: ancora-viva-em-regra-morta
description: Terceira classe de não-KILL — âncora única, `reason` vivo, gate roda e PASSA porque uma camada posterior sobrepôs a regra ancorada; o preflight é cego a isso e quem responde é especificidade + ordem de inlining
metadata:
  type: project
---

Diagnosticada na E3 da demanda 013 (2026-08-29), em `p51/M51-01` / `P51-VIS1` —
virou o achado **EA-7** no `.claude/BACKLOG.md`.

## O quadro clínico

Tudo que os instrumentos da 013 sabem medir dá verde: `ocorrencias == 1` no
preflight, `reason` cujas três alternativas o gate ainda emite hoje, mutação
aplicada, gate executado. E o gate **passa**. O mutante mira uma regra CSS que
uma camada posterior sobrepôs — a declaração continua no arquivo, e não decide
mais nada.

Concretamente: a 5.1 governava `body[data-uxscreen="question"] .wrap` com duas
colunas; a Fase 5.2 (`c1e3649`) passou a governar a MESMA composição com
`html body[data-uxscreen="question"] .wrap` e colocações explícitas por filho. A
mutação troca declarações mortas.

## Os dois oráculos que respondem (nenhum é o gate, nenhum precisa de navegador)

1. **Especificidade**, com ferramenta e não a olho: `@bramus/specificity` já está
   em `node_modules`. `(0,2,2)` da 5.2 bate `(0,2,1)` da 5.1 — o `html` inicial
   é um seletor de tipo a mais, e é só isso que decide.
2. **Ordem de inlining**, quando a especificidade empata: `build_v32_html.py:76`
   concatena `ui_v32` → `ui_ux` → `ui_p50` → `ui_p52`. A 5.2 é a última, então
   ganha todo empate. As colocações por filho empatam em `(1,2,1)` e é por aqui
   que se decide.

Complemento barato: `git log -S '<texto da âncora>'` e `git log -S '<seletor
concorrente>'`. Se o commit que escreveu âncora+mutante é anterior ao que
escreveu o concorrente, o mutante **mordia** e deixou de morder — a data separa
"nasceu podre" de "apodreceu".

## A fronteira de escopo, e ela é dura

Isto é `gate sem poder discriminante` no vocabulário fechado da spec, e a
demanda **PARA**: o remédio é asserção NOVA sobre comportamento de produto —
outro trabalho, outro dono. Reancorar oportunamente no sítio da camada nova é
tentador e **é errado aqui**: move o par para outra fase e outra camada, o que é
decisão de desenho. O que cabe ao QA é classificar, registrar a dívida com a
razão no par e em `dividas_declaradas`, e abrir o achado.

**Why:** é a forma de mentira mais cara das três, porque nenhum instrumento a
denuncia — não há contagem errada, não há mensagem envelhecida, não há causa de
`NÃO EXECUTADO`. Só aparece quando alguém vai olhar um `19/20`.

**How to apply:** suspeite sempre que o alvo do mutante for `ui_p50_v32.css` ou
qualquer CSS de fase anterior à 5.2 — a 5.2 reescreveu composição declarada por
camadas anteriores, e os pares que mutam esse arquivo (`M51-08` na `p51`, todos
os de CSS na `p50`) estão sujeitos ao mesmo mecanismo e passariam pelo preflight
do mesmo jeito. Ver [[reason-podre-e-a-re-derivacao]] para a irmã dessa doença e
[[preflight-prova-unicidade-nao-sitio]] para o que o preflight já não responde.
