# Plano — 023-leitura-unica-do-apoio

> Fase 2 · dono: tech-lead · consome a [spec](spec.md) aprovada.

> **EMENDA DE 2026-10-02 (errata `E1`/`E3` da spec).** O desenho abaixo vale, e
> ganhou uma segunda metade: a Fase 4 mediu que o caso do relato é **modo
> legado**, onde o ramo legado de `renderBlocks` (`ui_v32.js:249`) passa a
> constante `false` e o predicado **não é consultado**. O proprietário escolheu
> estender a arbitragem ao modo legado (rota **B**, 2026-10-02). Então **duas**
> expressões mudam, não uma — as duas em `ui_v32.js`, sob a mesma autorização
> §29.4. E a W1 passa a incluir a emenda ao `D019-CTX1 (c)` (`T003a`), terceiro
> oráculo alheio tocado. Detalhe e custo medido: erratas `E1` e `E3` da spec.

## Desenho

**Uma função muda.** `hasSubstituteV32` (`ui_v32.js:702`) ganha uma segunda fonte:
além da capability com apresentação `card` e payload, passa a contar **produto
publicado na visão por produto**.

O contrato já existe e não precisa ser inventado — `__CURATION.published()`
(`ui_curation_v32.js:149`) devolve *ofertados menos excluídos, mais os incluídos
pelo operador*. É exatamente a definição de "publicado" que o `C3` exige, e é a
mesma que a seção usa para montar os cards. **Não há derivação nova**; há um
leitor novo de uma derivação existente.

```
substituto = (capability com card e payload)  OU  (published().length > 0)
```

### Por que o predicado consulta a curadoria, e o que isso custa

Hoje `hasSubstituteV32` é função do resultado do motor e de mais nada. Passar a
consultar a curadoria **acopla a decisão da 010 ao estado do operador** — e é
deliberado: o `C3` existe porque o operador *pode* desfazer o substituto, e o
produto tem de reagir a isso.

O custo é real e fica declarado: o predicado deixa de ser puro em relação ao
motor. O **`C5`** é o guarda — ele mede que o sujeito do `D010-ARB1` continua
alcançável, que é a única coisa que o acoplamento poderia destruir.

### Módulos

| módulo | dono | papel |
|---|---|---|
| `ui_v32.js` (**§29.4**) | `core-engineer` | o predicado |
| `fixtures_010_vao.js` | `qa-engineer` | fixture nova de *substituto suprimido* + oráculo `d010HasSubstitute` emendado |
| `tests_010_vao.js` | `qa-engineer` | `D010-ARB1` reancorado no sujeito novo |
| `specs/010-recomendacao-sem-vao/spec.md` | `product-owner` | errata do predicado da §1 |
| `tests_023_leitura.js` (**novo**) | `qa-engineer` | os 9 gates |
| `tests_023_mutants.js` (**novo**) | `qa-engineer` | a campanha |

**Owner do estado (R9 §5): ninguém novo.** A curadoria segue dona das decisões do
operador; o predicado é **leitor**.

## Contratos e registros

- **Bridges**: nenhum novo. `__CURATION` já é registrado; passa a ter um consumidor
  a mais, sob guarda de `typeof` — o módulo é injetado **depois** de `ui_v32.js`,
  e a chamada só acontece em tempo de render, quando os dois existem.
- **Patch-points**: nenhum. Sem monkey-patch.
- **Ordem de injeção**: inalterada.
- **Pins**: mudam `ui_v32.js`, `fixtures_010_vao.js`, `tests_010_vao.js`, o HTML
  gerado e os arquivos novos. Repin no mesmo PR (R8), e o **repin `§29.4`** de
  `ui_v32.js` em `tests_p50_core.js` com a autorização de 2026-10-01 no pin.

## Boundary

**Classe tocada mais alta: `produto`, com um protegido `§29.4` dentro.**

- `frozen`: **nenhum**. A Camada 1 não é editada — ela passa a ser **ocultada** em
  mais um cenário, pelo mecanismo que já existe e que já a nomeia.
- `generated`: o HTML muda via builder.
- `§29.4`: **`ui_v32.js`**, com **autorização nominal do proprietário de
  2026-10-01**, pedida no portão da spec e concedida com ela.

**E uma emenda a oráculo alheio**: a fixture e o gate da demanda 010.
**Ratificada pelo proprietário em 2026-10-01**, no mesmo portão — precedente da
errata `E19` da 015.

## Checklist R9 (módulo novo)

Não se aplica: **nenhum módulo de produto nasce nesta demanda**. Os dois arquivos
novos são suíte e campanha, governados pela R10 e pela R3.

## Waves

| Wave | Tarefas (resumo) | Depende de |
|---|---|---|
| **W0** | Red: `tests_023_leitura.js` com os 9 gates; FAIL commitado | — |
| **W1** | O predicado em `ui_v32.js` **e** a emenda da 010 (fixture, oráculo, `D010-ARB1`, errata da spec) | W0 |
| **W2** | Campanha `tests_023_mutants.js` + `mutation_map.json` + `expected_suites.json` | W1 |
| **W3** | Regressão, repin `§29.4`, `gen_pins` | W2 |
| **W4** | Validação: `spec-validate`, aceite de intenção, relatório | W3 |

**W1 é indivisível, e isso é decisão de desenho.** Trocar o predicado sem reancorar
o `D010-ARB1` deixa a árvore num estado em que um gate de outra demanda está
vermelho por motivo certo — e commitar assim seria publicar um vermelho que não é
achado. Os dois arquivos têm donos distintos e não colidem (R5 §3), mas entram
juntos.

**A campanha vem na W2, não na W0.** Mutante precisa de âncora em código real, e o
predicado novo só nasce na W1 — a lição que a 022 registrou depois de eu colocar a
campanha na wave do red por otimismo.

## Riscos e rollback

| risco | como se detecta | rollback |
|---|---|---|
| o `D010-ARB1` fica sem sujeito | **C5**, que é o gate escrito para isso | reverter W1; o predicado é uma expressão |
| a Camada 1 ser ocultada **parcialmente** | `D010-ARB3` (tudo-ou-nada) + **C4** | idem |
| curadoria vazia não devolver a congelada | **C3** — o vão da 010 de volta, que é o pior desfecho possível | idem |
| acoplamento com a curadoria quebrar sessão sem o módulo | guarda de `typeof`; sem `__CURATION` o predicado volta ao comportamento de hoje | — |
| âncora de mutante alheio apodrecer | `IC-4` no preflight | reancorar, como já foi preciso duas vezes nesta sessão |

**Rollback geral**: a mudança é uma expressão booleana e duas fixtures. Reverter W1
devolve o produto ao estado da v3.2.10.

## Protótipo

**Não é necessário.** A pergunta que só código responderia — *"sem substituto"
continua alcançável?* — já foi respondida por medição na Fase 1: curadoria que
exclui os 11 ofertados leva a visão por produto a zero card, com aviso de supressão
presente.
