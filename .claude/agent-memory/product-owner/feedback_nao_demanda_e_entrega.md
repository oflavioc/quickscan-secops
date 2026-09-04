---
name: feedback-nao-demanda-e-entrega
description: Concluir "este item não tem demanda" é resultado aceito no refinamento — e refutar recomendação própria de demanda anterior é esperado, com a razão registrada
metadata:
  type: feedback
---

No refinamento, **"o comportamento está certo e o que falta é explicar" é um
resultado legítimo** — o usuário pediu explicitamente para ouvi-lo em vez de
receber uma demanda fabricada. Ponha essa saída na tabela de rotas com nome
próprio (ex.: "nada + registro em `design-decisions.md`"), não como nota de
rodapé.

E **refutar uma recomendação minha de demanda anterior é esperado**, não
constrangedor: registre a refutação com a razão, no próprio refinamento (R2 §5 —
refutação registrada permanece), e nomeie a autoria em vez de apagá-la.

**Why:** na 010 a premissa errada do meu refinamento ("N cards cujo único
conteúdo possível é dizer que não houve declaração") custou uma reprovação no
aceite e a errata E18 — porque era verdadeira para o card vazio e falsa para o
card com serviço. O antídoto que funcionou foi o oposto de defender a premissa:
falsificá-la por medição. Na 015 a P8 da 010 ("remover só o sufixo de versão")
caiu pelo mesmo método.

**How to apply:** Fase 0 — abra os arquivos, conte e meça antes de aceitar a
formulação do cliente ou a minha própria da demanda anterior. Refinamento que
descreve o que o código faz vale mais que refinamento que descreve o que o
cliente disse. Cada pergunta ao usuário sai com uma recomendação
([[feedback-pergunta-sempre-com-recomendacao]]), inclusive a que recomenda **não
fazer**.
