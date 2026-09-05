# `guard-add` — a guarda mecânica, e a pergunta que ela deixou aberta

Hook `PreToolUse`/matcher `Bash` que barra `git add -A`, `git add .` e
`git add --all`. Nasceu do achado **`EA-37`**, que por sua vez nasceu de **duas**
ocorrências reais do orquestrador empacotando trabalho de agentes em voo
(`541771a`, `d130a04`) — a segunda **quatro horas depois** de a primeira estar
registrada, o que provou que registrar sozinho não bastava.

## Por que bloqueio incondicional

Medido, não suposto: **não existe sinal técnico confiável de "delegação ativa"**
— nem no payload do hook, nem em arquivo no disco. Um marcador escrito por hook
do `Task` teria corrida **exatamente** no cenário que causou o incidente: o `-A`
roda na mesma leva paralela que despacha os agentes, e a ordem entre hooks de
chamadas irmãs não é garantida.

Custo medido antes de decidir: `git grep` na árvore inteira **não achou nenhum
script ou pipeline** usando as formas barradas. O único uso histórico é o
bootstrap único da Fase 5, doc-only e no passado. Caminho nominal cobre 100% do
caso legítimo.

## Auto-exclusão nominal (R10 §10)

A detecção **tokeniza** o comando com `shlex` em vez de casar substring, e remove
corpo de heredoc antes de analisar. Assim, não são falsos positivos: mensagem de
commit citando a frase, `grep` da frase, heredoc escrevendo documentação com a
frase.

**Limite aceito e declarado**: heredoc canalizado para outro interpretador
(`bash <<'EOF' … EOF`) não é inspecionado. Padrão inexistente neste repositório
hoje.

## A pergunta que ficou aberta, e como respondê-la

Provado por **invocação direta** do script: 5/5 barrou, 8/8 passou.

**Não provado**: que o harness de fato invoca hooks de matcher `Bash`. Duas
observações, nenhuma conclusiva:

1. Numa sessão de **subagente**, `git add -A` completou sem bloqueio — e o
   `guard-data.sh`, que já existia e é bloqueante pela **R11**, também não
   barrou uma sondagem de segredo. Sessão de subagente pode não carregar hooks
   de projeto.
2. Na **conversa principal**, `git add -A` completou com `exit 0` — mas isso
   **não prova nada** sobre esta guarda: hooks são carregados no **início da
   sessão**, e o `guard-add` foi registrado com a sessão já em curso.

**Como responder, e por que importa**: numa sessão **nova** do Claude Code neste
repositório, rodar `git add -A` numa árvore com mudanças. Se a guarda barrar, o
mecanismo funciona. **Se não barrar, o achado é maior que o `EA-37`** — atinge o
`guard-data.sh`, que é a defesa da R11 contra commitar sessão real de cliente,
PDF, segredo ou binário grande. Uma guarda que ninguém viu barrando é promessa,
e este repositório tem nome para isso.

Os commits `e0850c0` e `b492939` (sondagem e reversão) ficam no histórico de
propósito: são o dado que gerou a pergunta acima. Efeito líquido zero na árvore.
