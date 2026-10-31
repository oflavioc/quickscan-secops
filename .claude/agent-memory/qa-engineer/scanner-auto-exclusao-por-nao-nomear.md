---
name: scanner-auto-exclusao-por-nao-nomear
description: Scanner de padrão proibido que acusa o próprio gate (R10 §10) — a auto-exclusão mais forte é os arquivos varridos NÃO nomearem o padrão; restringir o scanner a "linhas de import" é afrouxamento medido (5 evasões); meça a tabela adversarial antes de escolher a forma
metadata:
  type: feedback
---

Quando um scanner de padrão proibido (grep por nomes de biblioteca, literal de
comando, prefixo de env) acusa o próprio gate porque o gate CITA o padrão em
prosa, há três saídas e só uma não abre furo: **o arquivo varrido deixa de
nomear o padrão**, e a lista nominal vive só onde o scanner é definido (a célula
da tarefa, o registro), fora do conjunto varrido. Excluir por path (013, IC-1) é
a forma para quando o arquivo PRECISA carregar os literais; excluir por marcador
ou por linha é furo; **restringir o scanner à forma sintática "boa"** (`^\s*
(import|from)\s`) é afrouxamento e a R10 §1 proíbe.

**Why:** na 016 (2026-09-04, `check_fecho.py:23` × T032(v)) medi 16 casos
adversariais com o grep real, três formas: prescrita (arquivo inteiro), "só
linhas de import", palavra inteira (`-w`). A forma só-import deixou vivos
`x = 1; import urllib`, `__import__("socket")`, `importlib.import_module(
"http.client")`, `exec("import ssl")` e `nome = "urllib"; __import__(nome)` —
cinco evasões que a prescrita mata. E a prescrita tinha dois cegos próprios:
`from http import client` e `import http` escapam de `http\.` — o padrão pinava
o PONTO, a propriedade ratificada nomeia a BIBLIOTECA. A forma `-w` dominou as
duas: mata tudo que a prescrita mata, fecha os dois cegos e para de acusar
substring (`sslcontext`, "sockets"). O core-engineer já tinha resolvido o lado
dele não nomeando (`fecho.py:13-15`), o que confirmou a forma.

**How to apply:** ao receber "o scanner acusa o gate", NÃO escolha por
elegância: escreva o corpus (positivo canônico, import no meio da linha,
`__import__`, `importlib`, `exec`, nome em string, prosa, comentário em linha de
import, substring em identificador, controle limpo) e rode cada forma candidata
sobre ele; a forma que perde um positivo que a atual mata é afrouxamento, ponto.
Se o padrão prescrito tiver cego contra a propriedade ratificada (ponto × nome),
alinhar o formato à propriedade não é "fortalecer por conta própria" — mas só
depois de medir que dá zero nos arquivos reais, e declarado em errata com a
tabela. Declare o que nenhuma forma pega (nome montado em runtime): scanner não
é sandbox; a garantia é estrutural (stage sem rede), o scanner é a cobrança
barata. Ver [[excecao-que-morre-com-a-razao]] (a forma por path da 013) e
[[sobrevivente-por-lacuna-x-equivalente-por-spec]] (a régua propriedade × formato).
