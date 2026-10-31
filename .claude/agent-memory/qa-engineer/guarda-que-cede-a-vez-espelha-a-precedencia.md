---
name: guarda-que-cede-a-vez-espelha-a-precedencia
description: Guarda de gate que "cede a vez" ao global do julgador (um FAIL por causa) tem de espelhar a ORDEM de precedência do julgador ramo a ramo, ler o autorrelato do leitor por `is False` (ausente/null = não afirmado) e provar cada ramo numa bateria que inclua o od incoerente, os falsy que não são False e o controle verde — E016-8, 2026-09-05
metadata:
  type: feedback
---

Forma que funcionou em `check_fecho.py:censo_da_leitura` quando o julgador
ganhou um terceiro global impeditivo (`historico-raso`, entre `origin/develop`
ausente e piso fora da cadeia):

- **um ramo `nao_aplicado` por global, na mesma ordem de `_impedimento`**
  (`presente is not True` → `cadeia_integra is False` → `piso_na_cadeia is not
  True`), cada detalhe nomeando a QUAL global a guarda cede. O ramo combinado
  anterior ("ausente ou piso fora") escondia a pergunta "e se o od vier
  incoerente?" — com os ramos separados a resposta é a do julgador (ausente
  vence), e é isso que a regra de composição do PO exige: **um** FAIL nomeado,
  nunca dois pela mesma causa;
- **`is False`, não `is not True`**: o campo é o leitor **afirmando** o
  truncamento; ausente/`null`/`"false"`/`0` são "não afirmado" e caem no
  comportamento anterior (`divergente` se a contagem estiver errada — com a
  disjunção honesta "o leitor não nomeou causa: defeito do instrumento ou
  truncamento que ele não detecta"). A forma estrita rotularia um leitor que
  esqueceu o campo como "clone raso" e obrigaria a editar 24 fixtures;
- **bateria de 13 casos antes do commit** (script efêmero importando o gate por
  caminho): o `ok` (controle verde, [[controle-verde-na-bateria-negativa]]),
  os quatro "não afirmado" (ausente, `null`, `"false"`, `0`) ⇒ `divergente`,
  raso no piso e raso acima ⇒ `nao_aplicado` citando `historico-raso`, piso
  fora com cadeia íntegra e sem o campo ⇒ citando `piso-invalido`, ausente ⇒
  citando `origin-develop-ausente`, **ausente + `cadeia_integra false`**
  (incoerente) ⇒ ausente vence, e `nao_pinado` vence tudo. 13/13.

**Why:** a guarda nasceu como oráculo independente do instrumento
([[leitor-mudo-sobrevive-ao-gate-nu]]); ao passar a consumir um autorrelato do
leitor ela fica a um `is not True` de virar dependente dele — e a um ramo
combinado de dar dois FAIL para uma causa (foi exatamente o que a decisão do
PO proibiu). A ordem espelhada é o que mantém o registro e o julgador dizendo
a mesma coisa quando o mundo é incoerente.

**How to apply:** toda vez que um julgador ganhar um global novo, procure no
gate a guarda que "cede a vez" e (1) insira o ramo na posição da precedência,
(2) leia o campo novo pela forma que só casa a afirmação positiva do leitor,
(3) rode a bateria de ramos com o caso incoerente e os falsy — e registre o
resultado no red, não só no scratchpad ([[bateria-efemera-nao-e-registro]]).
