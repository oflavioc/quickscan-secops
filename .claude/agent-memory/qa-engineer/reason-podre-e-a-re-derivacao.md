---
name: reason-podre-e-a-re-derivacao
description: Rot semântica é a irmã da âncora podre — âncora sã, mensagem envelhecida; e o `reason` novo se prova sem navegador extraindo o EMISSOR do próprio arquivo do gate e enumerando os `detail.push` da função
metadata:
  type: project
---

Medido na E3 da demanda 013 (2026-08-29), sobre `P50::M51` / `P50-PR1`.
`reprovou por motivo diferente do esperado` é **SOBREVIVENTE** com âncora
perfeita: `ocorrencias == 1`, mutação aplicada, gate executado **e reprovado**.
O que morreu foi o vocabulário.

## O sintoma tem uma causa quase sempre igual: o gate migrou de enunciado

`P50-PR1` mudou de DOCUMENTO por errata de auditoria externa (B-02/B-03): o papel
deixou de ser `.wrap`/`#app` e virou `#v32-print-report`. As cinco alternativas do
`reason` eram o vocabulário do enunciado **anterior** — quatro com **zero**
ocorrência no arquivo do gate e a quinta viva só dentro de `cmp`, **definido e
nunca invocado**. Antes de discutir poder discriminante, **conte as ocorrências
de cada alternativa no arquivo do gate e cheque se o sítio é código vivo**; é
grep, custa segundos, e responde sozinho se é rot.

Regra que saiu daí: **alternativa de `reason` sem sítio de emissão vivo é
armadilha de detecção incidental** — o par passa a poder morrer por vizinho.
Quando eu re-derivo, cada alternativa tem de vir com a linha que a emite E com a
asserção que garante que ela é alcançável. Deixei `.conf` de fora do `reason`
novo por isso: recebe a classe mutada, mas nenhuma asserção do gate obriga a
baseline a exibi-lo, então a alcançabilidade não estaria provada.

## Duas provas que dispensam o navegador (Chromium nunca está aqui)

1. **Formato da mensagem — extrair o emissor do próprio arquivo do gate.**
   `fs.readFileSync` + fatiar `PR1_STYLE_PROPS` / `PR1_STYLE_SELECTORS` /
   `pr1DiffStyles` + `new Function(...)`. Alimentar com o efeito da mutação e ler
   a string EXATA. Não é cópia digitada: se o gate mudar o template, a prova
   muda junto. Fecha (b) parcial e mata a pergunta "meu regex casa mesmo?".
   Vale rodar **controles negativos**: sem mutação, com a assinatura de cada
   mutante vizinho, e com o outro estado da fixture. Foram os controles que
   provaram que o `reason` novo **não** casa `M52`/`M53` — isto é, que `M51`
   morre pela propriedade dele, não pela do vizinho.
2. **Prova (c) por enumeração exaustiva.** Listar TODOS os `detail.push()` do
   corpo da função do gate (48, em `pr1()`) e confrontar cada um com o efeito da
   mutação. Se só um bloco pode disparar, então neutralizá-lo faz o mutante
   sobreviver — sem executar nada. É argumento estático e tem de ser rotulado
   como tal, mas responde a mesma pergunta que a (c) canônica de
   [[prova-c-em-camadas]] e ainda diz de graça se `c1` coincide com `c2`.

## O registro tem dentes — e isso se mede

`check_mutation.py` (IC-5) exige `classificacao` do vocabulário fechado quando
`ultima_prova.resultado != "KILL"`. Medido em worktree efêmera, variante sem
`classificacao` ⇒ `[FAIL] IC-5: p51/M51-01 · … veio None`; com ⇒ `0 problema(s)`.
Vale sempre fazer as duas passadas: é o red do próprio registro, e custa dois
commits descartáveis ([[medir-red-do-proprio-julgador]]).

**Why:** a demanda 013 existe para matar número que parece medição e não é. Um
`reason` que não pode casar é a mesma mentira que uma âncora que não pode casar —
só que o relatório dela é `SOBREVIVENTE`, que soa a defeito de produto e manda o
time procurar no lugar errado.

**How to apply:** ao triar qualquer não-KILL, leia a NOTA do harness primeiro —
`reprovou por motivo diferente do esperado` ⇒ suspeite de rot semântica e vá
contar ocorrências; `o gate esperado NÃO reprovou` ⇒ é outra doença, ver
[[ancora-viva-em-regra-morta]]. Ver também [[triagem-de-ancora-ambigua]] e
[[preflight-prova-unicidade-nao-sitio]].
