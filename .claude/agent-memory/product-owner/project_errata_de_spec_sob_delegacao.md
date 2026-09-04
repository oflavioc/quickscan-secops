---
name: errata-de-spec-sob-delegacao
description: Como escrever errata de spec de demanda neste repositório sob o regime de delegação (fórmula literal, subsunção escrita, id pelo gap do spec-validate, inline + seção única) — nascida no fecho da 013 (2026-09-04)
metadata:
  type: project
---

Errata de `spec.md` para gap de classe `spec-errada` é do `product-owner` (+
`tech-lead` para redação técnica) e, sob o regime de delegação de 2026-08-29,
carrega **a fórmula literal** "DECIDIDO SOB DELEGAÇÃO DO PROPRIETÁRIO de
2026-08-29, não aprovado por ele pessoalmente" **e** o registro de que a
delegação é geral ("tome as decisões por mim") e **não enumera "errata"** — a
subsunção é do orquestrador e fica escrita para poder ser contestada.

Regras de forma que se provaram no fecho da 013:
- identificar pelo **id do gap do spec-validate** (G1, G2…), nunca `E<n>`: em
  várias specs `E1..E4` são **entregas** (013) ou erratas de outra demanda (010);
- **nota inline curta em cada ponto tocado** (quem lê a célula isolada não pode
  ser enganado) **mais** uma seção única com o texto completo — repetir a razão
  em cinco notas é drift; célula reescrita cita a redação anterior, item de
  lista sai riscado (R2 §5);
- quando o gate se contradiz com outra cláusula da mesma spec, a errata escreve
  a **regra de composição** (qual mecanismo decide o exit) e explica **por que
  as duas lentes coexistiram** — senão a contradição volta;
- separar por autorização: o que foi ratificado nominalmente pelo proprietário
  (registrar, nunca reabrir) do que foi decisão do orquestrador sob delegação
  (dizer que não houve ratificação pessoal). Nunca promover a delegação a
  autorização mais forte.

**Why:** no fecho da 013 dois gaps `spec-errada` ficaram sem texto por 6 dias
porque cada decisão nasceu depois da spec pinada (addendum na Fase 4/5; extensão
de escopo na W6b) e "voltar ao texto" não tinha dono — os reds declararam a
divergência, o aceite a carregou como pendência, e só a errata fechou.

**How to apply:** ao dar aceite de intenção (Fase 6), cobrar a errata como
condição nomeada quando houver decisão posterior à spec com trilha própria;
a spec é pinada — repin no mesmo PR entra em DEPENDÊNCIAS; a 014 e outras
demandas em worktree paralelo não são legíveis daqui (ver
[[ids-ea-entre-branches]]) — não citar a forma delas como se tivesse sido lida.
