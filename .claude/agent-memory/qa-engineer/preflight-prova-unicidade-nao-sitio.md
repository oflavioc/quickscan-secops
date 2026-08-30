---
name: preflight-prova-unicidade-nao-sitio
description: IC-4 (ocorrencias == 1) prova que a âncora é única no arquivo, não que ela caiu no sítio certo — âncora única no lugar errado mata pelo motivo errado, e isso conta como SOBREVIVENTE
metadata:
  type: project
---

O `--preflight` dos harnesses conta ocorrências da âncora no arquivo-alvo. Verde
significa **uma** ocorrência — não significa que a mutação vai cair onde a
propriedade mora. Quando o arquivo tem cálculos quase-duplicados, as duas coisas
divergem, e o preflight fica verde num sítio errado.

Caso real medido (T017 da 013, 2026-08-29): a linha do agregado
`const overall = … Math.round(…)` é **byte-idêntica** em `ui_v32.js:131`
(`legacySnapshot`, invariante M43) e `:1026` (`buildPrintReport`). `M51-18`
defende só a segunda. Com a mutação em `:131`, `P51-RPT6` **reprova** — mas por
`"agregado da tela X != Y"` (`tests_p50_core.js:3075-3076`), mensagem que **não
casa** o `reason` do mutante. Pelo cabeçalho do harness
(`tests_p51_mutants.js:9`), reprovar por motivo diferente do esperado é
**SOBREVIVENTE**, não detectado. Âncora única + sítio errado = mutante que parece
saudável e não mede nada.

O complemento é barato e responde o que o preflight não responde: em cópia
efêmera, aplicar `src.replace(find, repl)` e imprimir a **primeira linha
divergente**. Duas medições, duas perguntas — contagem e posição.

**Why:** é a tese da própria demanda 013 um nível abaixo — instrumento que
reporta número sem ter medido a coisa certa. Um preflight verde sobre âncora
mal posicionada é exatamente a forma de mentira que IC-4 existe para matar.

**How to apply:** em toda triagem/reancoragem de âncora podre (T019 e as quatro
não triadas de `p50`/`p52`), exigir **as duas** provas antes de propor recorte.
Suspeitar sempre que o alvo for `ui_v32.js`: o mesmo agregado é recalculado em
`legacySnapshot`, `renderResults`, `computeTargetProfile` e
`buildNarrativeSnapshot`. Quando a unicidade precisar ser **construída**, prefira
o contexto que **documenta a propriedade** (o comentário `ERRATA B1` em
`:1022-1024`) ao contexto meramente adjacente — o adjacente é "casa e passa" com
outro nome, e apodrece pelo mesmo motivo que já apodreceu antes.
Ver [[medir-red-do-proprio-julgador]] e [[poder-discriminante-ic2-e-ic8]].

**Limite descoberto (W6b, 2026-08-29).** O oráculo de linha divergente responde
"onde caiu", mas quando a asserção que mata é **varredura do arquivo inteiro** ele
não basta: os dois sítios morrem com a mesma frase e a escolha tem de vir de fora
do gate. Ver [[triagem-de-ancora-ambigua]].

**Desfecho (T019, 2026-08-29).** As quatro âncoras da `p51` foram reancoradas e o
critério se sustentou sob execução: o recorte de `M51-18` ancorado no comentário
`ERRATA B1` levou a mutação a `:1026` (oráculo de linha divergente) e o gate
matou por `"0.5: KPI diz 'Inexistente' e o canônico é 'Inicial'"` — **não** por
`"agregado da tela"`, que seria a assinatura do sítio errado. `IC-4` foi de
`4 FAIL` na `p51` para `1 OK (20 âncoras)`; total do check de 10 para 6
problemas. Duas sondas de falsificação confirmaram que o verde não é tautologia:
um caractere a mais na `find` do harness ⇒ `ocorrencias=0`; a linha duplicada no
**alvo** ⇒ `ocorrencias=2`. Ver [[prova-c-em-camadas]] para a segunda via
independente de confirmação de sítio.
