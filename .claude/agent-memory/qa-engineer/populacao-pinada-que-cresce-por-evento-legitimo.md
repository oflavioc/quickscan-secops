---
name: populacao-pinada-que-cresce-por-evento-legitimo
description: D016-M20 pina a população das exclusões R13 e ela cresce a cada demanda refutada (3→4 em 2026-09-24, 4→5 em 2026-10-19) — a falha é dupla (contagem E isolamento), o sujeito novo entra acoplado ao ciclo de vida (EM VOO · null | MESCLADA SEM FECHO · mensagem #PR), e derivar `esperado = len(lista)` não evita nada; o repin de 2026-09-24 não renovou a matriz
metadata:
  type: feedback
---

Quando um PR acrescenta uma entrada em `fecho.json → excluidas_por_r13`, espere o
`D016-M20` SOBREVIVENTE no stage `mutation` (fecho.json é target da d016) e trate
como **mutante obsoleto**, nunca como gate frouxo: o gate acusou N+1 e estava certo.
O conserto tem TRÊS partes, e só a primeira é "mover o número":

1. `problemas: N+1` com comentário-trilha (data, "valor anterior", quem entrou,
   precedente) — a asserção fica mais forte, não mais fraca (R10 §1).
2. **O sujeito novo entra em `sujeitos`** — medido em 2026-10-19: só a contagem em
   5, sem o 5º sujeito, segue SOBREVIVENTE por `acusação a MAIS (1)`. A lista de
   sujeitos é a asserção; a contagem é a metade de isolamento.
3. **Veredito acoplado ao ciclo de vida** quando a demanda nova ainda não foi
   mesclada (o PR dela é o que está aberto): `done` + PR aberto ⇒ `EM VOO · oráculo
   null`; mesclada ⇒ `MESCLADA SEM FECHO · mensagem #PR`. Forma de M21 (`regra` +
   `regra_texto`), código `artefato-ausente` nos dois ramos. Pinar o estado de hoje
   planta o próximo sobrevivente no primeiro PR pós-merge que tocar um alvo da d016.
   Os dois ramos se medem ANTES do commit: o primeiro na worktree, o segundo em clone
   efêmero com o merge simulado (`git clone <worktree principal>`; `update-ref
   refs/remotes/origin/develop <sha do GitHub>`; `merge --no-ff -m "Merge pull
   request #110 from oflavioc/feature/024-…"`; `update-ref` de novo) — gate nu
   0 problema(s) e campanha 35/35 em ~1 min, sem `node_modules`.

**Por que não derivar `esperado = len(excluidas_por_r13)` (forma b):** (i) não evita
o sobrevivente — o isolamento acusa o sujeito não listado de qualquer jeito; (ii) a
expectativa passaria a vir do arquivo que o mutante edita — oráculo que move com o
mutante, a classe que D017-INS1 recusa em `insumos`; (iii) não é tautológica, mas
seu único estado de falha é uma exclusão INERTE (slug sem planning-state ou demanda
não-done): o gate não a julga (fecho.py, decisão 6), o baseline fica verde, e sob o
mutante saem N acusações com len = N+1 — (b) chamaria de "gate sem poder" um
defeito do REGISTRO. Medido com `998-sem-planning-state` em cópia efêmera. Essa
exclusão inerte é ponto cego real do `check_fecho` (sem código para "exclusão sem
sujeito") — candidata a achado, não defeito do mutante.

**Why:** segunda vez que o mesmo pin envelheceu (23f8fa7, 2026-09-24, 3→4; PR #110,
2026-10-19, 4→5) — e o repin de setembro moveu o harness sem renovar `ultima_prova`
na matriz (ficou "3 problema(s)" até outubro). Classe de
[[reason-que-pina-contagem-codifica-estado]] e de
[[mutante-de-arvore-amarrado-ao-ciclo-de-vida]].

**How to apply:** repin de expectativa de harness = harness + `ultima_prova` da matriz
no MESMO commit, com a linha literal do CI, a reprodução local pré-fix
(`run.sh --stage=mutation` sob árvore limpa — a campanha direta `node
tests_016_mutants.js` tolera harness sujo e leva 51 s; só `check_mutation` recusa
árvore suja) e os dois ramos do ciclo medidos. Arquivos pinados: o repin do
`gen_pins.py` é de quem o orquestrador designar, nunca "de passagem".
