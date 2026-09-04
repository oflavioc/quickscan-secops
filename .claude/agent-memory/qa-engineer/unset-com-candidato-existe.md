---
name: unset-com-candidato-existe
description: "presence UNSET ⇒ zero candidatos" é FALSO no engine (788 contraexemplos via UNASSESSED_CAPABILITY); só vale com o qualificador de capability dona de qid
metadata:
  type: project
---

No `engine_v32.js`, a frase "capability com `presence: UNSET` nunca recebe
candidato" é **falsa** como enunciado geral. Varredura adversarial de 2294
sessões (landscape UNSET, vetores/sinais/arquitetura/plataforma variados) achou
**788 contraexemplos** em 12.748 observações — todos `UNASSESSED_CAPABILITY`
pela rota "aderente por sinal" (`fortimail`, `fortidlp`, `fortiauthenticator`,
`fortipam`, `fortiaigate`…), que é o único ramo que aceita UNSET explicitamente.
O enunciado **verdadeiro** carrega o qualificador: *capability que pode ser dona
de um qid-alvo* (1 dona + `landscapeEnabled: true`) nunca tem candidato sob
UNSET — 0 contraexemplos.

**Why:** o separador entre os dois conjuntos não é sorte de catálogo, é
invariante de configuração com gate vivo: `validateConfigV32` erra em
`assessmentCoverage === "none" && questionIds.length`, devolve 0 erros hoje, e
`tests_m42_m86.js` assere `=== 0` em vários gates. Capability `coverage: none`
(as 12 que carregam os candidatos por sinal) tem **zero** `questionIds`, logo
nunca entra no `caps` de um card de prática-alvo. Sob UNSET as classificações
observadas são só quatro — `NEEDS_VALIDATION`, `CONTEXT_NOT_INFORMED`,
`UNASSESSED_CAPABILITY` e `null` — e apenas a terceira carrega candidato.

**How to apply:** ao escrever ou revisar errata/spec que dependa dessa
propriedade, exija o qualificador — sem ele o texto é refutável por medição e
alguém vai refutá-lo. O nó de FAMÍLIA (`endpoint-family`, `itemKind: "family"`,
com `variants`) — o que quebraria uma tabela `chave → id` — só nasce em
`resolveCandidates`, e precisa de **duas** condições: `presence: "NONE"`
(whitespace) **e** `saasAllowed: "unknown"`. Com `saasAllowed: "yes"` (a
arquitetura de todas as fixtures da 010) o mesmo estado devolve ids planos.
Quem disser "medi sob a fixture X" e citar nó de família, confira as duas.
Relacionado: [[julgador-que-concorda-com-a-fixture]].

**Eu mesmo derrubei o qualificador, seis dias depois de escrever este aviso.**
No relato de T021 da 010 (2026-08-30) citei esta memoria como "ha precedente de
UNSET com candidato" para concluir que faltava FIXTURE ao mutante `D010-M11` — e
propus cria-la. O coordenador reconciliou: com o qualificador, a fixture **nao
pode existir**. Re-medido: catalogo com 13 capabilities donas de qid, **zero**
com `coverage: "none"`; varredura adversarial de 900 sessoes / 9000 observacoes
(dona de qid x UNSET) com **0 contraexemplos**, e `UNASSESSED_CAPABILITY` sequer
aparece nessa classe. O mutante era **equivalente por construcao**.

**A diferenca entre os dois rotulos nao e semantica, e operacional:** "sem caso
nas fixtures" e divida que alguem tenta pagar e nao consegue; "equivalente por
construcao" e divida que se fecha escrevendo a razao. Rotular errado custa o
trabalho de quem vier depois.

**How to apply (reforcado):** ao CITAR esta memoria — nao so ao escrever spec —
copie o qualificador junto. E quando a conclusao for "falta fixture", teste a
negativa antes de propo-la: descreva o estado que a fixture precisaria alcancar
e prove que ele e alcancavel, com varredura, ANTES de dizer que falta. Proposta
de fixture impossivel e pior que silencio.
