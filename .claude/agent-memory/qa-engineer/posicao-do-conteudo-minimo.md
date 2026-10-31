---
name: posicao-do-conteudo-minimo
description: Iteração 3 da 017 (2026-09-09) — a correção do G5 pôs os três elementos que faltavam da Errata C1 na SEÇÃO (`:694-702`), não na nota inline (`:226`) que a tabela da spec ("Nota inline (conteúdo mínimo)") nomeia, enquanto a forma adotada por referência (013 §Convenção: inline curta + seção completa) contradiz o cabeçalho literal; julgue pelo critério que a validação aplicou desde a iteração 1 (presença na errata, inline OU seção) ⇒ ✓° com a posição registrada, dê o número das duas leituras (73/73 × 72/73) e entregue a escolha ao usuário — nunca mova a asserção depois da correção; "segunda edição … no lugar de" no BACKLOG se cumpre por nota irmã datada que substitui a afirmação e deixa a primeira byte-idêntica (prove com N+/0−)
metadata:
  type: feedback
---

Quando a correção de um gap de "conteúdo mínimo" entrega os elementos num
lugar diferente do que a tabela da spec nomeia (seção em vez de nota inline),
**o critério de julgamento é o que a validação já aplicava** — não o que a
leitura literal permitiria endurecer depois do fato. Classifique **✓°** com a
posição escrita, dê os dois números e deixe a escolha com o usuário.

**Why:** na 017 (iteração 3, 2026-09-09, HEAD `f1e9164`) o `doc-writer`
fechou o G5 (`75149b9`) pondo *"inclui criados/removidos"*, *"o exemplo
permanece válido — todos na raiz"* e *"`mutantes[].arquivo` não é alcançado"*
numa nota de segunda edição **dentro da seção** `## Erratas da demanda 017` da
013 (`:694-702`); a nota inline de `:226` ficou com 2/5 + *"ver §Erratas"*. A
tabela da 017 (`spec.md:372-377`) diz *"Nota inline (conteúdo mínimo)"*, mas a
sua "Forma" (`:364-365`) adota a convenção da própria 013 (`:483-495`): *"nota
inline **curta** em cada ponto tocado … **e** esta seção única com o texto
completo"*. A iteração 2 tinha escrito "três não existem **em lugar nenhum** da
013" e prescrito "dentro da nota `:226` **e/ou** de `:684-698`" — o critério
sempre foi presença na errata. Endurecer para "só inline" depois da correção
seria trocar a asserção depois do fato — o inverso do R10 §1, igualmente
proibido. Fechou **73/73 com dois ✓°** (6 e 51); a leitura literal daria 72/73
com correção de uma frase contígua em `:226` — os dois números foram escritos.
O G6 (`c8b91cd`) mostrou a forma da "segunda edição": título `###` irmão do
da primeira nota, dentro do bloco `EA-3`, frase de `:938` **verbatim**, a
primeira nota intacta (22+/0−) — "no lugar de" é substituição da afirmação,
não apagamento (R2 §5).

**How to apply:**
- Tabela por elemento: **elemento × onde vive (inline / seção) × fato
  medido**. A coluna "fato" é o que torna real o "confira o conteúdo, não a
  presença": para *criados/removidos*, o preflight da `d016` + `git ls-files`
  (`999-sintetica-d016.json` ausente = criado; `F5.json`/`sem_fecho.json`
  presentes = removidos pela campanha, `tests_016_mutants.js:150/:405/:472`);
  para *`mutantes[].arquivo`*, o sítio `check_mutation.py:370-374` (só mensagem
  de IC-4) e `grep edicoes` = 0; para *o exemplo*, `awk` sobre `:205-221` e
  `git ls-files` dos sete paths.
- Conte **depois** de ler e reconcilie: `aditiva_013.py` 74 → 90 → **104**
  (= 25+ − 11− do commit); `grep -c "Errata C1 · demanda 017"` vai de 1 a **2**
  porque a nota de segunda edição na seção casa a string — é a forma, não um
  ponto tocado a mais. Nomeie isso antes que alguém leia como duplicidade.
- Afirmação da classe "quem mentia" (O-2: `REL1`/`REL2`, não `FORM1`) se mede
  no **julgador real** — `exec` de `check_mutation.py:486-627`, `arquivos_mutados`
  trocado por basenames: `estado = fail`, `problemas` = {REL1: 1, REL2: 1},
  **FORM1 0**, faltantes 10 + 2 = 12; o campo `forma` do retorno é diagnóstico
  (C5), não gate. Nunca por raciocínio.
- Resíduo a nomear, não gap: quem para de ler na primeira nota leva a
  afirmação velha sem marca in-loco; a corretiva está adjacente. Riscar dentro
  da primeira seria "por cima".
- `check_baseline.py` lê blobs de HEAD: com o `spec-validate.md` editado só no
  working tree ainda dá `465/465` — o vermelho nasce no commit e dura até o
  repin (R15). Diga isso; não espere "1 divergente"
  ([[baseline-so-ve-o-commit]]).
- Companheiros: [[errata-aditiva-com-conteudo-invertido]] (a iteração 2 desta
  mesma demanda), [[red-nao-testemunha-conte-alineas]],
  [[doc-only-em-suite-pinada]].
