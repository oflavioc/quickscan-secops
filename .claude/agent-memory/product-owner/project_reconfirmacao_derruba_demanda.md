---
name: reconfirmacao-derruba-demanda
description: Fase 0 da 024 — reconfirmar 7 achados contra o código derrubou 5; por que a linha de status atrasa demandas inteiras, por que o §Encaminhamento anuncia a demanda e não a rota técnica, e a inversão do EA-80 (rota mais barata desfaz a curadoria)
metadata:
  type: project
---

Na Fase 0 da demanda **024** (2026-10-19, corte de selagem do proprietário:
*"congelar o instrumento, limpar só o que o cliente vê, selar"*), a
reconfirmação dos sete candidatos contra o código derrubou **cinco**:
`EA-69`, `EA-73`, `EA-74` (corrigidos), `EA-75` (resolvido em forma emendada
pela 022) e `EA-79` (resolvido pela 023). Sobraram `EA-80` e `EA-81`, e
**nenhum dos dois é defeito no relatório entregue**.

**Why:** três mecanismos fazem o backlog mentir, e todos são estruturais —
não descuido de ninguém:

1. **O achado é fechado por demanda que não é dona dele.** `EA-75` caiu na
   022, `EA-79` na 023 — cada uma registrou o fecho na **própria** spec
   (errata) e no próprio relatório final, e a linha de status do achado ficou
   para trás. Quem fecha escreve no seu artefato; o bloco do achado fica órfão.
2. **O §Encaminhamento anuncia a DEMANDA, não a rota técnica que ela acabará
   executando.** O `EA-79` diz *"Vamos de C"* — e C era a **estrutural** da
   rodada 4 da 023 (paliativa / remover / estrutural), **não** a linha
   explicativa da tabela de rotas do achado (que não tem letras). A estrutural
   foi feita: é a própria 023, por uma **quarta rota técnica** (produto
   publicado conta como substituto; `D010-ARB1` reancorado, não esvaziado).
   Ler o encaminhamento e concluir "não foi feito" é erro garantido — e eu
   cometi o erro oposto no refinement da 024: li a letra na tabela errada e
   escrevi que a 023 "não executou pela C" (emendado em ERR-5; ver
   [[024-errata-do-refinement]]).
3. **A recontagem de fila corrige o item que se está olhando e não os vizinhos.**
   `BACKLOG.md:5732` recontou a fila do `EA-58` em **2026-10-16**, tirou o
   `EA-56` e manteve o `EA-69` como represado atrás de Porta B — quando os
   rótulos `(SIEM)`/`(NDR)` já estavam no produto por `P52_COPY`.

**A inversão do `EA-80`, que é raciocínio de produto e não de código:** a rota
que o achado chama de mais barata (*"não remover os `.apoio-block` quando
`cards.length === 0`"*) **re-exibe exatamente o que o operador excluiu** — o
bloco congelado é onde o produto mora (`prodLegadoDe` tira o `.prod` dele), e o
conjunto ofertado à curadoria contém aqueles produtos. A `C1` da 010 protege o
cliente contra **vão do software**; supressão pela curadoria é **decisão de quem
conduz a sessão**. Pergunta generalizável: **quando o remédio REPÕE conteúdo,
perguntar quem o retirou e por quê** — se foi o operador, repor é desfazer.

**Causa comum verdadeira dos dois que sobraram** (e vale para qualquer coisa
nesta superfície): dois donos decidem o destino da leitura congelada por
predicados independentes — `hasSubstituteV32()` **oculta** pelo que foi
*publicado*; `blocosLegados()`/`decorar()` **consome** (remove) pela
*visibilidade do nó*. Divergem só nas bordas, e **consertar um por código piora
o outro**. Regra única que fecharia os dois: *a Camada 1 é consumida se e
somente se há publicação que a substitua*.

**Também medido, e vale para a próxima demanda:**
`.claude/verify/current_phase.json` diz `5.2 SELADA` e
`proxima_fase: NAO_ABERTA` — **não há fase de produto aberta para selar**. As
demandas 019–023 rodaram sob a máquina SDD sem o gate de abertura da R4. "Selar"
precisa que o proprietário diga o quê: release `develop → main` com tag (R14) ou
abertura retroativa de uma 5.3.

**How to apply:** em toda Fase 0 que receba lista de achados, reconfirmar **contra
o código e contra o artefato construído** antes de qualquer enquadramento —
`fix-finding` §1 vale no refinamento. Procurar o fecho em `specs/*/spec.md`
(erratas) e `relatorio-final.md` das demandas **seguintes**, nunca só no bloco do
achado. E conferir o artefato (`quickscan_secops_soccmm_v3_2_dev.html`), não só o
módulo: é o artefato que o cliente recebe. Ver
[[refinamento-016-registro-contra-execucao]], [[fecho-retroativo-da-013]] e
[[checklist-de-fase-6-do-po]].
