# `dispatch.log` — o instrumento que responde se o harness despacha os hooks

Achado **`EA-83`**: ninguém mediu se uma chamada real da ferramenta `Bash` invoca
o grupo `PreToolUse`/matcher `Bash` do `.claude/settings.json`. Os dois guardas da
**R11** vivem nesse grupo — `guard-data.sh` (sessão real, PDF novo, segredo,
binário grande) e `guard-add.sh` (`git add` de escopo amplo). Despacho é condição
**comum**: se o matcher não dispara, os dois estão inertes juntos.

## Por que não bastava "não houve bloqueio"

Porque **ausência de bloqueio não distingue** "despachou e aprovou" de "não
despachou" — é medir o defeito com o instrumento que ele acusa. O que o `EA-37`
provou, em 2026-09-13, foi a **lógica do script** (payload entregue por stdin:
5/5 barrou, 8/8 passou). Isso não toca a pergunta do despacho.

Por isso o instrumento é **evidência positiva de invocação**: cada guarda
registra a si mesmo em `dispatch.log` antes de qualquer saída antecipada
(`log_dispatch`, em `lib/common.sh`). **A linha existir é prova de despacho.**

## Forma do registro, e por que esta forma

- **Uma linha por (guarda, sessão)** — a pergunta é sim/não, logo a resolução
  certa é uma por sessão. Log que crescesse a cada chamada de `Bash` seria lixo.
- **Teto duro de 400 linhas** (rotaciona para as 200 últimas) — se a dedupe
  falhar, o arquivo ainda não cresce sem limite.
- **Zero processo novo** (sem python, sem jq): só `date` e `grep` sobre um arquivo
  de poucas linhas, para não pagar latência em toda chamada de `Bash`.
- **Registra em TODA invocação**, não só em `git commit` — registrar apenas no
  caminho de interesse tornaria "log vazio" ambíguo outra vez.
- **Caminho ignorado pelo git** (`*.log` no `.gitignore`) — R7 §3: verificação
  nunca escreve na árvore versionada.
- **Falha do registro não silencia o guarda**: tudo em subshell, saída em
  `/dev/null`, `|| true`. Medido: com o caminho do log inescrevível, o
  `guard-data` ainda devolve `exit 2` no conteúdo sensível e o `guard-add` ainda
  barra `git add -A`.

Campos (TSV): `timestamp UTC · guarda · sessão · script executado · cwd do hook`.
O **script executado** mostra qual cópia rodou (isto é, para onde
`$CLAUDE_PROJECT_DIR` resolveu); o **cwd** mostra qual repositório o guarda
inspecionaria.

## Protocolo de leitura — o que fazer para a pergunta ficar respondida

1. Confirmar que o caminho é gravável: `touch .claude/hooks/dispatch.log` e apagar
   em seguida. (Sem isto, "log vazio" voltaria a ser ambíguo.)
2. **Apagar** `dispatch.log`.
3. Abrir uma **sessão nova** do Claude Code neste repositório — hooks são
   carregados no início da sessão, então uma sessão já em curso não responde por
   registro feito depois.
4. Rodar **qualquer** comando pela ferramenta `Bash` (`git status` serve).
5. Ler o arquivo:
   - **linha presente** → o grupo despacha; a R11 tem metade mecânica viva;
   - **arquivo ausente/vazio** → o grupo **não** despacha; os dois guardas são
     prosa executável que nunca executa.

## O que este instrumento NÃO prova

- **Não prova enforcement.** Prova que o script foi invocado, não que o `exit 2`
  chega ao usuário e **aborta** a chamada. Despacho ≠ bloqueio efetivo. Medir isso
  exige um comando que o guarda barre e verificar que ele não produziu efeito.
- **Não prova que a decisão do guarda está correta** — isso é a bateria de
  invocação direta por stdin (`EA-37`).
- **Não prova cobertura do matcher**: fala só das chamadas que ocorreram.
- **Não vigia nada por si** — não é gate e **não entra no `pipeline.yaml`**: em CI
  não existe sessão de agente, então um stage sobre este log seria verde vazio ou
  vermelho permanente. A leitura é do proprietário, pelo protocolo acima.
- **Linha duplicada é possível** em chamadas paralelas (corrida entre `grep` e
  `>>`). Inofensivo: a prova é a existência, não a contagem.
