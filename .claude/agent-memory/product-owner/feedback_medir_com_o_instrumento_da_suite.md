---
name: feedback-medir-com-o-instrumento-da-suite
description: Nunca estimar orçamento/contagem que um gate mede — medir com o MESMO instrumento da suíte, e quando duas suítes medem a mesma propriedade, nomear a que reprova primeiro
metadata:
  type: feedback
---

Quando um critério de aceite cita um limite que uma suíte já mede (contagem de
itens, orçamento de caracteres, número de blocos), **não estimar** — medir com o
**mesmo instrumento da suíte** e escrever na spec qual é a métrica, qual é a
suíte e qual é o `arquivo:linha`.

**E quando duas suítes medem a mesma propriedade com métricas diferentes,
declarar qual reprova primeiro.** Caso real medido na 015 (2026-08-31), caixa
`#pr-howto`: `P51-DOC12` usa `txt(box).length` — `textContent` **cru** — e mediu
**585**; o gate de PDF usa `.replace(/\s+/g," ").trim().length` — **normalizado** —
e mediu **544**. Mesmo teto de 900 nas duas. A **crua é maior, logo reprova
primeiro**: a folga real era ~308 visíveis, não os ~360 que eu havia estimado
comparando o teto com uma estimativa normalizada. A alínea que escrevi media a
métrica certa por acaso; o erro estava na estimativa.

**A mesma regra vale para a atribuição mutante → alínea.** "Este mutante mata
aquela alínea" é afirmação **checável**, não intuição — e na 015 eu errei duas
numa spec só: `M15` na forma estreita não alcançava a alínea de contagem (numa
entrega **aditiva** o nó novo compensa o texto suprimido), e `M18` não derrubava
o gate herdado que eu citei. Se não medi, escrevo **"a confirmar pelo
`qa-engineer`"** ao lado — não escrevo a cadeia como se fosse fato.

**Corolário de produto que saiu daí:** em entrega aditiva, métrica de contagem
("o texto não diminuiu") é **rede, não guarda** — não detecta subtração menor que
a própria adição. As guardas são as igualdades de **conjunto**.

**E a forma mais afiada da mesma regra, medida na 015:** *um mutante só prova o
poder de uma alínea se aquela alínea for a que reprova **primeiro**.* Eu propus
mutar um título trocando o literal inteiro — mas isso levava junto um sufixo que
outra alínea protegia, e o gate reprovava por ela. **Detecção incidental não é
kill**: o par morre pela razão errada e a alínea visada segue sem carrasco. A
forma que isola muta **só** a propriedade visada (ali: emitir o mesmo nó duas
vezes, preservando o literal).

**Disciplina de escrita que evita um terceiro caso:** número que aparece em prosa
**tem de ser contável na tabela ao lado** — um id por linha. Na 015 uma célula
com dois ids (`P5`, `P7`) fez contagem-de-linhas ≠ contagem-de-ids, e três
artefatos passaram a afirmar números diferentes.

**Why:** a 010 pagou três vezes por medir com o instrumento errado. O custo aqui
seria o 7º item nascer com folga imaginária e a demanda descobrir na campanha —
uma errata e uma rodada, em vez de uma linha na Fase 1.

**How to apply:** na Fase 1, todo número que entra num critério vem de leitura do
oráculo que o cobra, com a métrica nomeada. Se eu não puder executar, a spec
**exige a medição antes/depois no gate** e nomeia o `qa-engineer` — nunca carrega
uma estimativa minha como se fosse dado. Ver
[[feedback-nao-demanda-e-entrega]] e [[project-gate-verde-nao-e-protecao]].
