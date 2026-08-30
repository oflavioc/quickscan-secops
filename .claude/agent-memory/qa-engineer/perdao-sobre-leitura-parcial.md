---
name: perdao-sobre-leitura-parcial
description: Todo mecanismo de perdão/tolerância em gate precisa saber sobre QUE leitura foi aplicado — o buraco que o IC-9 abriu e o IC-10 (contrato C6) fecha, com as duas classes de mutante de fiação
metadata:
  type: project
---

Demanda 013, 2026-08-30, um dia depois do green do `IC-9`. O mecanismo de perdão
nominal era impecável **e** deixava passar isto:

    preflight declara 3 · o harness emite 1 (o perdoado) e morre com exit 1
    → mutation: 1 campanha(s) executada(s) · 0 problema(s)   ← exit 0

Campanha que **não terminou** saindo verde. Contrafactual medido contra o commit
anterior ao green: a mesma campanha fechava `2 problema(s)`. Quem passou a engolir
o vermelho foi o perdão.

## A pergunta que eu não fiz, e que vale para qualquer tolerância

> *Sobre que leitura este perdão está sendo aplicado, e essa leitura é
> provadamente completa?*

Perdão nominal aplicado sobre leitura **parcial** perdoa o que leu e, sem querer,
**tudo o que não leu** — vira abrangente por acidente. Não se pode afirmar que o
perdoado é o único não-KILL sem ter lido todos. A mesma pergunta cabe em qualquer
`known_issues`, waiver, `expected_range` ou `skip` condicional que a casa venha a
ganhar.

O conserto é no **laço** (quem tem o oráculo de contagem, `IC_PREFLIGHT`), nunca na
função pura de perdão: `mut_perdao` não sabe — nem pode saber — quantos mutantes
deveriam ter aparecido. Contrato C6, `mut_guarda_leitura(harness, blocos,
esperados, perdao)`, com `esperados is None` contando como parcial (sem oráculo
não se afirma leitura completa; a direção segura é não perdoar, com a ausência
**dita** na linha).

Detalhe que o proprietário exigiu e que muda o desenho: **recusa impressa e
nomeada, com os números**. Recusa silenciosa trocaria um engolimento por outro. E
o relato `LEITURA PARCIAL` que já existia **não** foi substituído — ele é relato, a
guarda é veredito, e a coexistência virou asserção executada (a que `M-IC28` mata).

## As DUAS classes de mutante de fiação, e por que a segunda importa mais

Sonda em processo mede a função; a fiação some. Já sabia da classe "o laço nunca
chama" (`M-IC19`/`M-IC29`). A que faltava:

- **`M-IC31`** — o laço **chama** a guarda e a alimenta com `esperados =
  len(blocos lidos)`. A comparação vira o número consigo mesmo, `parcial` nunca é
  True, o defeito volta **inteiro** e o gate segue em `0 problema(s)`.

É o erro mais provável de quem implementa o green, e nenhuma sonda em processo o
alcança. Por isso o green só se declara depois da sonda de fiação em efêmera
([[sonda-de-fiacao-sem-chromium]]) — os três modos do harness sintético
(truncada · completa · truncada sem perdão) separam a guarda boa das duas ruins em
segundos, sem Chromium.

**Why:** o `IC-9` foi entregue com 10 mutantes mortos e a fiação conferida, e ainda
assim tinha este buraco — porque a pergunta certa não era "o perdão discrimina?"
e sim "sobre o que ele decide?". Gate novo em cima de mecanismo de tolerância pede
sempre a segunda pergunta.

**How to apply:** ao revisar (ou escrever) qualquer mecanismo que transforme
vermelho em verde, escreva primeiro o cenário da **entrada truncada** — é ele que
revela se a tolerância está apoiada em leitura completa. Ver
[[excecao-que-morre-com-a-razao]] para o desenho do IC-9 que este achado corrige e
[[defeito-de-mecanismo-x-clausula-nova]] para como o achado foi classificado.
