---
name: 024-errata-do-refinement
description: Lições do fecho da 024 (2026-10-19) — o refinement.md é selado com a demanda e precisa de errata aditiva quando a D2 do doc-writer o desmente; letra de opção do chat pertence à pergunta que a gerou, nunca à tabela de rotas de outro artefato; ids ERR-n em refinement
metadata:
  type: project
---

Na 024 o `doc-writer` executou a D2 contra o fonte e devolveu **cinco imprecisões
no meu refinement.md** — quatro de citação (nome de função, linhas de gate, aritmética
de contagem, "(pendente)" não fechado) e **uma de sentido**: li "Vamos de C" como a
terceira linha de uma tabela de rotas do `EA-79` (linha explicativa), quando a letra
respondia à rodada 4 do refinement da 023 ("paliativa / remover / estrutural") — C era
a estrutural, e ela foi feita (é a 023), por uma quarta rota TÉCNICA.

**Why:** duas enumerações que compartilhavam só "remover" foram fundidas por mim; o
resultado afirmava que a 023 NÃO executou o que o proprietário escolheu, quando
executou exatamente isso. É a família do `EA-31` dentro da demanda que existia para o
registro parar de mentir — e o refinement é selado junto com a demanda.

**How to apply:**
- **Letra de opção tem o escopo da pergunta que a gerou.** Antes de escrever "rota C",
  localizar a pergunta literal no artefato da rodada (`refinement.md` §Rodadas da
  demanda de origem) e citar a linha. Tabela de rotas de achado no backlog raramente
  tem letras — se eu estou atribuindo letra a ela, estou inventando.
- **"B" e "C" de demandas diferentes não se somam** ("B/quarta" era a `E1` da 023 +
  a rota técnica — duas respostas a duas perguntas).
- **Errata de refinement.md**: aditiva (R2 §5), nota inline curta em cada ponto +
  seção única `## Erratas`; id **`ERR-n`**, nunca `E<n>` (o refinement cita erratas
  de spec de outras demandas com esse nome). Registrar o modelo em que rodei, o HEAD
  informado e o que NÃO conferi (git, execução).
- **Remedir toda linha que outro agente mediu, inclusive as que ele acertou**: a
  nuance de extensão de `papelHTML` (`:794-834`, não `:794-802`) só apareceu porque
  reli até o fecho da função. Reproduziu o início, não a extensão — anotar, não parar.
- Ao citar aprovação do proprietário que não vi: `planning-state →
  validate.aprovacao_de_fase` (R2 §4), nunca "o chat".
- Quando o doc-writer **estreita** frase de errata anterior para que E19/E20 não se
  contradigam, a ponte tem de nomear o que ela pressupõe (ocultar ≠ consumir) — ver
  [[vocabulario-fechado-nao-e-congelado]] e [[homonimo-no-glossario]].
