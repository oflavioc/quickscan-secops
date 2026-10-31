---
name: sonda-de-viabilidade-antes-do-red
description: Antes de fixar a forma dos gates, rode uma sonda P0 de viabilidade das fixtures/oráculos no HTML real (worktree efêmera destacada, NODE_PATH da worktree) — ela pegou o botão do painel que ALTERNA em vez de abrir, o texto real do erro tardio e a necessidade de contexto para o checkbox arquitetural; e escreva as alíneas ACUMULANDO sintomas para a leitura do red
metadata:
  type: feedback
---

Regra: antes de escrever a suíte do red, rode uma sonda de viabilidade (P0) sobre o HTML
construído medindo cada fixture e cada oráculo que a spec cita — contagens de oferta,
seletores, textos de erro de hoje, estado do gate, alcance de funções globais — e só então
fixe a forma dos gates. Escreva cada alínea acumulando os sintomas (lista de `probs`) em
vez de parar no primeiro `must`: o red precisa mostrar o comportamento do produto de hoje,
não só "função ausente".

**Why:** na W1 da 025 (2026-10-27) a sonda P0 revelou três coisas que raciocínio não teria
visto: (1) o botão `[data-p53-abrir-curadoria]` guarda `aberto` entre renders e clicar de
novo FECHA o painel — sem ler `aria-expanded` antes de clicar, INV8(a)/UNS1 teriam falhado
por fixture, não por produto; (2) o erro de F-tardio é `Valor de aprofundamento inválido:
ref-hunting`, não "Resposta inválida" como a spec escreveu — a alínea ficou em
`/aprofundamento/`, nunca pinando o texto da spec; (3) `#v32arch-note` e o checkbox
arquitetural só existem com contexto declarado (`saasAllowed: yes` +
`unifiedPlatformPreference: unified`). E na primeira execução CAN1 mostrava só "`validate`
não existe" — a versão acumulada mostrou "import aceitou (ok:true); curadoria A não
permaneceu", que é o estado do mundo M3 que o mutante vai reproduzir.

**How to apply:** worktree efêmera `git worktree add --detach <scratchpad>/wt HEAD` +
`NODE_PATH=<worktree>/node_modules` (sem `update-ref`: worktrees compartilham refs);
scripts P0/P1/P2 no scratchpad, saída guardada em arquivo e transcrita como NÚMEROS em
`red-NNN.md §Protótipos`; remover a worktree (`git worktree remove` + `prune`) antes do
commit. Padrão de gate: `alineas(async A => { await A("a", ...) })` com `vac()` para
vacuidade e `probs.join("; ")` dentro de alíneas com vários sujeitos.
