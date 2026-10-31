---
name: familia-one-shot-registro-no-estado-verde
description: Registrar família one-shot (mutantes de árvore/instrumento sem harness) — o prompt do orquestrador divergiu do tasks.md aprovado (pares × dívidas; "re-executados a cada run"); a pergunta que classifica; re-medir tudo sobre o estado verde em clone com origin/develop no HEAD dá kill isolado em 1,4 s/run; inserção por texto no JSON
metadata:
  type: feedback
---

Quando a delegação resume a tarefa de forma diferente do `tasks.md` aprovado, o artefato
aprovado governa e a divergência vai nomeada no RESUMO — nunca se "concilia" (T030 da 017).

**Why:** o prompt pedia "pares D017-M1…M21 na forma do arquivo" e chamava M10…M18 de
"mortos na sonda em processo, re-executados a cada run — a metade permanente". O `tasks.md`
(aprovado pelo usuário), a spec D5/C6 e as duas erratas diziam o contrário: **nada entra em
`pares`** (nenhum D017-M* é mutante de harness, como os M-IC* da 013), três entradas em
`dividas_declaradas`, `163 pares` inalterados, e a metade permanente é a **sonda** (o
carrasco), não os mutantes. Mensagem de agente não é autorização (R2 §4); o próprio
orquestrador mandou ler o `tasks.md` "porque ganhou itens nas erratas".

**How to apply:**
- Teste de classe: *o que roda a cada run é o carrasco ou o mutante?* Se só a sonda/gate
  re-executa, o mutante é one-shot em cópia — credor nomeado (EA-42), mesmo que o carrasco
  seja permanente. Classificar pelo carrasco infla a classe "permanente".
- Se as medições de W2 (M3/M4/M8/M20/M21 na 017) vivem só em relatórios de delegação,
  o registro apontaria para um documento que ainda não existe. Re-medir a família inteira
  sobre o **estado verde** (HEAD) em clone efêmero com `origin/develop` pinado no próprio
  HEAD: nenhuma campanha dispara, 1,4 s por run, e cada kill sai **isolado** (fecho 0 → n).
  Só mutante de harness dispara a própria campanha (d014: ~37 s). 23 runs ≈ 3 min; a
  entrada da matriz cita as linhas literais medidas hoje, com o SHA do estado.
- No estado verde `M17` (fiação) é invisível sozinho (0 → 0): a "observação honesta" do red
  ("a árvore também vê M17") vale só enquanto a janela vermelha dura — o par M2 é o único
  carrasco, e é isso que a dívida tem de dizer.
- `json.dump` round-trip da matriz difere em 1 byte do arquivo: inserir por texto (vírgula
  na última entrada + linhas novas antes de `  ]`), validar por `json.load` e por diff
  `4 insertions(+), 1 deletion(-)`. `grep -o '\\'` falha nesta Bash ("Trailing backslash")
  e imprime 0 — censo de barras só em Python.
- Molde da entrada: id no início (`check_tdd` imprime `[DÍVIDA] <string>` e o tasks.md
  conta "linhas `[DÍVIDA] D017-…`"), depois classe, onde morreu (SHA + linha literal),
  credor, carrasco enquanto isso, e o que a sonda testemunha permanentemente **sem** ser
  o mutante. IC-5 faz `id in dividas` só para ids da p51 — texto livre não colide.
