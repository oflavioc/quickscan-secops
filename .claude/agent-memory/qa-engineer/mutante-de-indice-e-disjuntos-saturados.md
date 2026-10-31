---
name: mutante-de-indice-e-disjuntos-saturados
description: Sonda cujos casos disparam os DOIS lados de um OR não mede a perda de nenhum — só um mutante de árvore por disjunto mede; receita do mutante no BLOB DO ÍNDICE (hash-object -w --no-filters + update-index --cacheinfo) para gates que leem `git ls-files --eol`, a armadilha do sha inexistente (i/none), a restauração exata por cacheinfo e o stage medido em commit efêmero
metadata:
  type: feedback
---

**Regra:** quando o predicado do gate é um OR (`i == -text or w == -text` em
`check_eol_text.py`) e a sonda só tem casos que disparam os DOIS lados ao mesmo
tempo (S1: `i/-text w/-text`), a sonda não distingue a perda de um só disjunto —
apagar qualquer um deles a deixa verde. Quem mede cada disjunto é um mutante de
ÁRVORE por lado, em estado MISTO que só existe num repositório vivo: NUL só no
worktree (`i/lf w/-text`) e NUL só no blob do índice (`i/-text w/lf`). Antes de
fechar a matriz, pergunte a cada OR do julgador: "que caso dispara SÓ este lado?"

**Why:** EA-41 (2026-09-05). O pedido nomeava dois pares (a: NUL; b: CR no
índice); o censo dos disjuntos mostrou que M1 (worktree) deixava o lado `i` sem
testemunha — e o lado `i` era literalmente o estado em que o defeito viveu
(`i/-text w/lf`, o RED de 2a1fb7f). Nasceu EA41-M3, e a bateria negativa provou
que o julgador do harness separa os dois (M1 julgado com a expectativa de M3 ⇒
SOBREVIVENTE nomeando i, w e origem). É [[clausula-inerte-e-a-sonda-de-variantes]]
aplicada ao OR: medir COM e SEM cada disjunto.

**Como mutar o índice sem tocar o worktree** (medido em git 2.55, Windows, com o
gate real em `--repo` num repositório efêmero ANTES de escrever o harness):
`git hash-object -w --no-filters --stdin` com os bytes mutados +
`git update-index --cacheinfo <mode>,<sha>,<path>` ⇒ `git ls-files --eol` responde
`i/crlf w/lf` ou `i/-text w/lf`. Restauração exata: `--cacheinfo` com o sha
ORIGINAL + `ls-files -s` idêntico ⇒ `git status --porcelain` limpo (o stat é
zerado, o status re-hasheia e não acusa). **Armadilha:** `--cacheinfo` com sha
INEXISTENTE é aceito sem erro e o git passa a responder `i/none` — o gate não
acusa e o mutante sairia SOBREVIVENTE por defeito do andaime; o harness tem de
conferir o `i/` esperado depois do cacheinfo e sair `NÃO EXECUTADO · rebuild
falhou` se divergir (é o adversarial BN6 da bateria). `-w` deixa um objeto solto
no object store compartilhado pelas worktrees (inalcançável; o gc recolhe). CR só
no worktree NÃO reprova sob `text=auto eol=lf` — é o controle negativo
obrigatório de (b), e declarado como mutante de (b) tem de SOBREVIVER na bateria.
Sujeito: fixture dedicada e rastreada (`fixtures_ea41/sujeito.md`), única, com a
âncora computada em runtime (linha da 1ª ocorrência, nº de linhas) — nunca
número fixo.

**Stage sem commit real:** `check_mutation.py` recusa árvore suja; a contagem do
stage entrou na matriz medida num worktree efêmero no scratchpad com commit
efêmero de conteúdo idêntico (`git worktree add --detach`, `cp` dos arquivos,
`git add` nominal, commit, `NODE_PATH` apontando para o `node_modules` de outra
worktree para os preflights alheios, `worktree remove --force` + `prune`); o
commit real reproduziu (`[PASS] mutation`). Ver [[medir-red-do-proprio-julgador]].

**Vazamento do gate no Windows:** `shutil.rmtree(tmp, ignore_errors=True)` da
sonda do `check_eol_text.py` não remove os objetos git somente-leitura — 38
diretórios `eol-text-sonda-*` órfãos em `%TEMP%` medidos em 2026-09-05, mais um
por execução do gate (cada campanha ea41 roda o gate 5 vezes). Correção
candidata: `onerror` que limpa o bit somente-leitura. Reportado em DEPENDÊNCIAS,
não corrigido de passagem (gate pinado, fora do pedido).
