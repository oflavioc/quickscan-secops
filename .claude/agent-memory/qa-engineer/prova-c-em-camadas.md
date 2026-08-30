---
name: prova-c-em-camadas
description: A prova (c) de um mutante (sobrevivência com a asserção neutralizada) só vale se neutralizar o BLOCO inteiro que a mutação trip a — neutralizar uma asserção por vez é o que expõe a redundância e evita o falso "morre de qualquer jeito"
metadata:
  type: project
---

Rito medido na T019 da demanda 013 (2026-08-29), nas três reancoragens
executáveis da `p51`. A prova (c) — "com a asserção do gate neutralizada, o
mutante SOBREVIVE" — é a que separa prova de teatro, e ela tem uma armadilha
própria: **os gates deste repo medem a mesma propriedade em várias superfícies**,
então neutralizar *uma* asserção devolve DETECTADO pela seguinte e o autor
conclui, errado, que a âncora é redundante ou que o gate "mata de qualquer jeito".

Fazer em **duas camadas**, sempre, e registrar as duas:

| camada | o que neutralizar | o que se aprende |
|---|---|---|
| **c1** | só a asserção que disparou na prova (b) | quantas superfícies redundantes existem, e qual é a **segunda** a disparar |
| **c2** | a faixa inteira da propriedade | o veredito: PASS ⇒ SOBREVIVENTE ⇒ a morte era atribuível ao gate |

Medições que fixam o padrão:

- `M51-18` / `P51-RPT6`: c1 (só `:3105-3106`, "KPI diz") ⇒ ainda **DETECTADO**,
  agora por "régua lê". Só neutralizando as **seis** comparações (`:3104-3120`,
  cinco superfícies + KPI de score) ele **sobrevive**.
- `M51-20` / `P51-DOC13`: c1 (só a asserção de R3, `:3729-3730`) ⇒ ainda
  **DETECTADO**, por contagem (`"§12 lista 12 seções para 10 emitidas"`). A faixa
  correta é a §12 inteira (`:3713-3731`, seis asserções).
- `M51-03` / `P51-UX2`: uma asserção só (`:2723-2724`) — c1 já é c2.

**Bônus que vale ouro: a prova (c) confirma o SÍTIO de graça.** Se o gate
**passa** com o bloco da propriedade neutralizado, nenhuma *outra* asserção do
mesmo gate foi tocada pela mutação. Em `M51-18` isso prova, por segunda via
independente do oráculo de linha divergente, que a mutação **não** caiu em
`ui_v32.js:131` (`legacySnapshot`) — se tivesse caído, `:3075-3076`
(`"agregado da tela X != Y"`) teria disparado e o gate reprovaria mesmo
neutralizado. Ver [[preflight-prova-unicidade-nao-sitio]].

**Why:** a contabilidade do harness (`tests_p51_mutants.js:9`) só aceita morte
pelo gate **e motivo** esperados; uma prova (c) rasa deixa passar âncora que mata
por asserção vizinha, que é a mesma classe de mentira que a demanda 013 existe
para matar.

**How to apply:** ferramenta que funcionou — trocar `throw new Error(` por
`void (` **por faixa de linhas**, sem apagar linha (mantém numeração e sintaxe,
e o diff é auditável); rodar em worktree efêmera com `git checkout -- <suíte>`
entre camadas. Ver [[medir-red-do-proprio-julgador]].
