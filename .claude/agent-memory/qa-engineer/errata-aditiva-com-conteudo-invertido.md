---
name: errata-aditiva-com-conteudo-invertido
description: A prova mecânica de "aditiva" (aditiva_013.py, 0 removidas, exit 0) passou com uma errata que dizia o CONTRÁRIO da spec ("não há nova obrigação de quem escreve o preflight" contra a forma canônica D1); no spec-validate, compare cada nota com a coluna "conteúdo mínimo" da tabela da spec, ponto a ponto — INTEIRA, não só o ponto que falhou (a iteração 2 achou três elementos de escopo ausentes desde sempre) — e confira números de cobertura contra o executável ("sete" × onze); na iteração 2, confira por git log cada edição que uma errata prescreveu a outro dono, e reexecute o script de contagem no HEAD (a mensagem de commit dizia 74, o HEAD dava 90)
metadata:
  type: feedback
---

No spec-validate, a errata de spec alheia se lê pelo **conteúdo mínimo** que a
spec da demanda fixou para cada ponto, nunca só pela prova mecânica de forma
(aditiva, grep das notas, seção única).

**Why:** na 017 (T040, 2026-09-08) a `aditiva_013.py` deu `4 alteradas · 74
novas · 0 removidas · 0 fora da forma`, os greps bateram (3 + 1 + 1) e ainda
assim a Errata C1 escrita na spec da 013 dizia *"a forma deste JSON não muda …
não há nova obrigação de quem escreve o preflight"* — o oposto da errata que a
017 §Contratos C1 mandava gravar (forma canônica de `arquivos_mutados`, a
obrigação que `d014`/`d016` tiveram de cumprir). A nota de `:232` omitiu a
frase que estende o C2 ("`targets` pode conter insumos com razão de classe") e
`:194`/a seção diziam "sete harnesses com preflight" quando o bloco corre em
onze (sete têm `insumos`). O próprio `tasks.md` avisava: *"prova estrutura, não
sentido — isso é C9 por leitura"*. Divergência pesa mais que ausência: um leitor
do C1 da 013 concluiria que basename segue válido — o defeito que a demanda
fechou.

**How to apply:**
- Para cada ponto tocado, ponha lado a lado a célula "conteúdo mínimo" da spec e
  a nota real — **todos os elementos, na iteração 1 e de novo na 2**; marque
  cada elemento ausente e, sobretudo, cada afirmação **contrária**. Uma frase
  que nega a exigência é `implementação-divergente` mesmo sendo doc. Ausência
  tem duas classes: **remissão ou nome** ausente (caminho da spec, nome de gate)
  é `✓°`; **elemento de escopo do contrato** ausente (o que o emissor tem de
  fazer, o que fica fora) é `faltando`. Na 017 a iteração 1 listou o conteúdo
  mínimo da Errata C1 na coluna "Exigência" e só julgou a inversão; a iteração
  2 (2026-09-09) achou três elementos de escopo ausentes **desde `5818b1c`**
  ("inclui criados/removidos", "o exemplo permanece válido — todos na raiz",
  "`mutantes[].arquivo` não é alcançado") — G5, o item ficou ✗ depois da
  correção do G1.
- **Errata que prescreve edição a outro dono "fora deste commit" cria uma
  obrigação sem executor**: para cada item prescrito, `git log <base>..HEAD --
  <arquivo>`. Na 017 a Errata `D3(i)` mandou o `doc-writer` reeditar a nota de
  `EA-3` no BACKLOG; ninguém a executou e a nota seguiu afirmando um retorno
  que o julgador não devolve (G6, `implementação-divergente`, registro que
  estava ✓ na iteração 1 e ficou para trás da spec).
- **Número de contagem em mensagem de commit se reexecuta no HEAD**: a mensagem
  de `0fe7e75` dizia "74 linhas novas, idêntico ao baseline pré-correção"; o
  script no HEAD dava **90** (74 + 16 líquidas do próprio commit). A
  propriedade (0 removidas) estava intacta; o número tinha sido medido antes
  da edição — a mesma classe de "sete" × onze. Mensagem de commit é imutável:
  o número certo vai para o spec-validate e o relatório final.
- Contagens de harness ("nove dos onze já emitiam", "oito … da raiz", "a ea41
  repo-relativo") se medem rodando os onze `--preflight` e contando paths com
  `/` (8 × 0, ea41 1, d014 2, d016 10) e presença em `git ls-files` — nunca
  pela lista do D1. Um "rascunho corrigido antes do commit" não é verificável;
  mede-se o texto commitado.
- Todo número de cobertura numa errata ("sete", "de um para sete") se confere
  contra a saída do executável (11 `[OK] D017`), não contra a tabela de
  migração (7 com `insumos`).
- A correção cabe **dentro** da nota `*(Errata … · demanda NNN: …)*`: reescrever
  o texto interno mantém a prova aditiva contra o blob pré-demanda (`aditiva
  <base> HEAD` continua `0 removidas`), sem tocar redação original.
- Companheiros nesta validação: a linha `mutation: N campanha(s)` vive no job
  `visual` (invoca `check_mutation.py` direto), nunca no `verify` (`run.sh` ecoa
  só no FAIL) — [[deducao-nao-e-leitura-no-log-do-ci]]; a família one-shot
  re-medida no HEAD com `origin/develop` no commit do mutante deu 11/11 em
  1,2 s/run — [[familia-one-shot-registro-no-estado-verde]]; a prosa de D3 ("o
  julgador devolve a classificação de cada path") descrevia retorno que o
  contrato C5 não define — spec-errada, decisão do usuário, nunca terceira
  edição do julgador.
