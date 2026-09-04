---
name: fixture-que-pina-o-pre-fix
description: assert de estado declarado da fixture pina o comportamento ANTERIOR ao fix e aborta todo gate antes da primeira alínea — e a linha divisória que resolveu isso (o diff da demanda decide o que o assert pode declarar)
metadata:
  type: feedback
---

Antes de commitar um red, **simule o fix por sabotagem e veja se o assert de estado
da fixture sobrevive a ele**. Um `d0NNAssertFixtureStates` roda dentro de `R(fx)`,
ou seja ANTES de qualquer alínea: se ele declara um valor que a própria demanda
existe para mudar, todo gate morre com a mensagem da fixture e o vermelho para de
apontar para o critério.

**Why:** medido no red da 010 (T006, 2026-08-30). `fixtures_010_vao.js` — já
commitado e repinado na W1 — declara em `D010_DECLARED`:

- `titulosCongelados: [{…, oculto: true}]` em `D010-F1/F1b/F3/F4`. A wave 7 faz a
  Camada 1 ficar **visível** exatamente nessas quatro (não há substituto). Provado
  por sabotagem: `D010-F1: títulos congelados [{…,"oculto":false}] != declarados
  [{…,"oculto":true}]`;
- `habilitadores`, conferido por `d010TargetEnablers(d)`, que conta **todo**
  `.ux-tgt-enabler` dentro de `li.ux-tgt-ov`. Os itens a-validar da wave 4 **são**
  `.ux-tgt-enabler`, então o valor medido cresce: `habilitadores de automation
  ["fortisoar|FortiSOAR|a validar"] != declarados []`.

As duas classes: **(i) a fixture declara um veredito de comportamento** em vez de um
estado de entrada; **(ii) o acessor da fixture agrega duas fontes** que a demanda
vai separar.

**RESOLVIDO em T030 (2026-08-30), e a regra que ficou.** O proprietário decidiu a
saída 2 — *sai do assert o que a demanda escreve* — com a condição do `tech-lead`
de que **nada é apenas removido**: cada declaração migra para o gêmeo canônico, e
só some da fixture o que já é medido de propósito por um gate. A linha divisória
não depende de gosto e é **o diff da demanda**: o assert declara só estado aplicado
pelos owners canônicos e o derivado em código `frozen` (engine, catálogo,
suficiência, presença da Camada 1); saída dos módulos que aparecem no diff é objeto
de GATE. Concretamente: `titulosCongelados` manteve `texto` (presença = guarda
anti-vacuidade) e perdeu `oculto`; o censo de chips virou `candidatosPorAlvo` (o
payload do engine por alvo). As duas outras saídas foram recusadas por escrito —
*declarar o estado-alvo* faz do assert um segundo oráculo do que ainda não existe,
e *parametrizar por fase* é fixture com dois modos, um dos quais nunca é provado.

Três armadilhas da migração, todas medidas:
- **serviço já estava declarado** por outro item (`servicosPorGap`, por capability):
  migrar "candidatos + serviços" teria criado duas fontes para o mesmo fato. Antes
  de escrever a tabela nova, meça o que os itens vizinhos já cobrem;
- **campo declarado e não conferido é vacuidade silenciosa**: ao manter a forma
  `[{texto}]` em vez de `["texto"]`, exija que cada entrada tenha EXATAMENTE a
  chave medida — senão alguém readiciona `oculto` e ele é ignorado em silêncio;
- **amarra entre itens comparados contra runtime é inerte**: se A e B já são
  conferidos contra o runtime, `A + B == runtime` nunca vira o valor. Não escreva.

**How to apply:** ao herdar fixture de outra tarefa, separe o que ela declara em
*estado de entrada* (vetor, alvos, prioridades, presence — estável) e *veredito de
saída* (visibilidade, censo de chips — muda com o fix). O segundo grupo pertence aos
gates, não ao assert da fixture. Se já estiver lá, **não conserte no commit do red**:
aplicar o remédio hoje faz N gates falharem no assert em vez de nos critérios e
destrói o vermelho informativo. Escale a direção — na 010 a errata declarara
`F1/F1b/F2` "byte-idênticas", então mexer nelas é decisão do tech-lead. Ver
[[julgador-que-concorda-com-a-fixture]] e [[declaracao-opcional-some-em-silencio]].
