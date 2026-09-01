---
name: gatilho-de-campanha-e-cego
description: O trigger por path do stage mutation vigia o que a campanha MUTA, nunca o que decide o resultado — e por isso um mutante perde os dentes num commit que sua campanha não tem razão de olhar
metadata:
  type: project
---

Medido na Fase 0 da demanda 014 (2026-09-01), varrendo os **42 mutantes de CSS**
das campanhas `p50`/`p51`/`p52` (4 + 2 + 36 de 180 mutantes totais).

**O fato**: `mutation_map.json → harnesses.<h>.targets` lista os arquivos que o
harness **muta**. `ui_p52_workspace_v32.css` não está em `p50.targets` nem em
`p51.targets`. Quando `c1e3649` escreveu ali a regra que sobrepõe a regra que
`M51-01` ataca, o gatilho **não re-executou a p51** — o alvo declarado não mudou.
A camada CSS nova entra sempre DEPOIS de `ui_p50_v32.css` (`build_v32_html.py:80`,
não `:76` como EA-7 e o `known_issues.json` ainda citam) e nasce fora dos targets
das campanhas antigas. Exposição permanente, independente do número de casos.

**O tamanho, contra a expectativa**: 1 em 42, não uma família. 36 imunes por
estrutura (mutam a penúltima folha; a única posterior, `ui_d011_prioridade_v32.css`,
tem zero seletor alheio — li as 91 linhas), 1 imune por oráculo (`M8`/`P50-COR1` é
lint de **fonte**, cascata irrelevante), 4 vivos por cascata.

**O contraexemplo que custa caro esquecer**: a memória do `qa-engineer`
(`ancora-viva-em-regra-morta`) manda "suspeitar sempre que o alvo for
`ui_p50_v32.css`" e nomeia `M51-08`. Medido, `M51-08` está **vivo**: a 5.2 declara
as mesmas duas propriedades no mesmo elemento e **perde**, porque o seletor da 5.1
tem um id (1,1,2) e o da 5.2 não (0,1,2). Suspeita certa sobre o mecanismo, errada
sobre a instância.

**O erro que a Fase 1 corrigiu na minha própria recomendação**: eu havia
recomendado "asserção nova sobre comportamento de produto". É desnecessária —
`P52-LAY2` (`tests_p52_chromium.js:231`) **já afirma a mesma propriedade na camada
que a decide**, medindo caixas reais. O buraco não era gate ausente: era
**carrasco ausente sobre a linha que decide** (`ui_p52_workspace_v32.css:77` não
tem mutante nenhum; o único mutante daquele bloco ataca a cláusula do rodapé).
Regra: **antes de propor asserção nova, procure quem já afirma a propriedade na
camada vencedora** — gate novo sobre propriedade já guardada é segundo dono da
mesma medição.

**O erro que a errata da Fase 2 corrigiu, e que é o mesmo de novo**: citei
`IC-9.4` como carrasco da `KI-4` lendo o **comentário** de cabeçalho do
`check_mutation.py`. Lendo a **expressão**: `IC-9.4` é auto-prova do mecanismo com
sonda sintética, e `mut_perdao` itera os blocos da campanha — aposentado o
mutante, o id some e o cenário não dispara. Quem morde é `IC-9.2` (objeto da
exceção existe no harness) + `IC-9.3` (registro). **Comentário de gate descreve a
intenção; só a expressão diz o que reprova.**

**A classe que a primeira execução revelou, e que não estava no glossário**:
**mutante parcialmente inerte** — a mutação aplica, o gate reprova (KILL), e
*parte* dela não influencia veredito nenhum. `p52/P52-RA8` insere uma regra de
`SOCaaS` antes da que já existe em `ui_p52_workspace_v32.css:1357`; seletor e
especificidade idênticos, desempate por ordem, a inserida perde. O `desc` promete
dois assets e ataca um. Achado numa campanha que fechou **107/107** — KILL não
prova que o mutante inteiro morde. E a distinção que decide o dono: no `M51-01` a
regra morta está **na folha do produto**; aqui **quem a escreve é o mutante**.

**Why:** foi a terceira vez que uma leitura por nome (arquivo, id do mutante,
descrição) apontou um culpado que a medição inocentou — o mesmo padrão que a 015
cobrou. Aqui o custo evitado foi uma spec prometendo saneamento de uma família que
não existe.

**How to apply:** ao refinar qualquer demanda sobre campanha de mutação, comece
por dois filtros baratos que colapsam a população antes de qualquer análise fina:
(1) **existe camada posterior?** — se o alvo é a última folha do inlining, o
mecanismo é impossível; (2) **o oráculo do gate lê renderização ou fonte?** — lint
de fonte é imune à cascata. Só o resíduo merece medir especificidade. E a ordem
correta da cascata é **importância → especificidade → ordem de inlining**: citar
"a última folha vence" sem checar `!important` é errado por construção.
Ver [[gate-verde-nao-e-protecao]] para a irmã desta doença em expressão de gate.
