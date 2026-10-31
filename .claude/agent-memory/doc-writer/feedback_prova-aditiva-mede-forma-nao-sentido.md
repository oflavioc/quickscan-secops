---
name: prova-aditiva-mede-forma-nao-sentido
description: aditiva_013.py (e scripts do mesmo molde) provam que a errata só ACRESCENTA — nunca que o conteúdo acrescentado está certo
metadata:
  type: feedback
---

Um script "aditiva" (ex.: `aditiva_013.py`, `specs/017-semantica-do-gatilho/tasks.md`
§Prova mecânica) mede **estrutura**: cada linha do blob base reaparece idêntica,
ou reaparece como ela mesma + **exatamente uma** inserção que casa a forma
`*(Errata <ID> · demanda <NNN>: …)*`. Isso prova aditividade (nada removido),
**nunca** que o texto dentro da nota é semanticamente correto. No G1 da 017
(2026-09-08), a errata C1 da 013 dizia **o oposto** da decisão D1 que a
motivou ("não há nova obrigação de quem escreve o preflight" — quando D1 *é*
essa obrigação nova) e o script deu `0 removida(s)`, exit 0, porque o defeito
caiu exatamente no ponto cego que o `tasks.md` já declarava.

**Por quê**: erratas aditivas protegem a redação de outra demanda já validada
(R2 §5) contra apagamento silencioso — mas isso é uma garantia de forma, não
de verdade. Releitura de errata exige comparar contra a **decisão-fonte** da
demanda nova (D1..D5, C1..C9 do spec.md que criou a errata), não só rodar o
script.

**Como aplicar**: ao escrever ou revisar uma nota de errata aditiva,
(1) rodar o script para confirmar `0 removida(s)` e a forma correta — condição
necessária; (2) reler a nota citando a decisão técnica de origem lado a lado
e perguntar "isto afirma o que a decisão decidiu, ou o oposto?" — condição
suficiente que o script não cobre. Um efeito colateral útil: como o "trecho
inserido" é tratado pelo script como um bloco único e contíguo, **reescrever
o CONTEÚDO de uma nota já inserida por uma demanda anterior da mesma família
é permitido livre** (não conta como remoção) desde que a nota inteira
continue casando a forma `*(Errata <ID> · demanda <NNN>: …)*` de ponta a
ponta, sem tocar o texto original ao redor. Uma seção inteiramente NOVA
(ex.: `## Erratas da demanda NNN`) não tem essa restrição de forma alguma —
é "linha nova", livre para reescrever quantas vezes for preciso antes do
commit.

Ligado a: [[feedback_deriva-em-doc-irma]] (mesma disciplina de "corrigir tudo
que a mesma causa contaminou, no mesmo passe").
