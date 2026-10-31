---
name: limpeza-silenciosa-warn-ou-fail
description: Em gate pinado, resíduo de limpeza é WARN e não FAIL — a régua é o que o gate JULGA; e o WARN só vale com gatilho demonstrado e controle por cópia de HEAD (nunca git stash)
metadata:
  type: feedback
---

`shutil.rmtree(tmp, ignore_errors=True)` é a **forma canônica do silêncio**: no
Windows os objetos do git do repositório efêmero nascem somente-leitura (medido:
**12/12** arquivos sem `S_IWRITE`), o unlink devolve `PermissionError [WinError 5]`
e o `ignore_errors` engole — 5 órfãos viraram 11, e depois **32**, um por execução
do stage (EA-43, `check_eol_text.py`).

**A régua WARN × FAIL não é o gosto, é o que o gate JULGA.** A sonda já rodou
inteira, o veredito é sobre a **árvore**, e o resíduo vive em `%TEMP%`, fora dela:
reprovar ali *inventa* uma condição de falha que o gate não tem, deixa o Windows
cronicamente vermelho por lixo fora da árvore (EA-5) e — medível — **quebra o
carrasco**: o julgador de `tests_ea41_mutants.js` conta `falhas_instrumento != 0`
e exige **exatamente 1** linha `[FAIL]`, logo um FAIL de higiene viraria os 3
mutantes em `NÃO EXECUTADO`. R10 §2 se cumpre **nomeando** (`[WARN] <gate>
sonda/limpeza: …` com caminho + exceção), não reprovando. Limite a declarar: o
`run.sh` só ecoa stdout de stage que FALHA — WARN em stage verde só aparece
rodando o gate direto; tornar WARN visível no agregado é mudança de `run.sh`
(build-engineer), não do gate.

**Mecânica que funcionou** (guardar, é tudo medido):
- `onexc` (py>=3.12) / `onerror` (3.10-3.11) têm a **mesma aridade** — um handler
  serve aos dois, escolhido por `sys.version_info`; o branch legado se exercita
  passando o kwarg explicitamente, mesmo em 3.12/3.14.
- `os.chmod(path, os.stat(path).st_mode | stat.S_IWRITE)` — **acrescenta** o bit;
  `chmod(path, S_IWRITE)` seco derrubaria o `x` de diretório em POSIX. No Windows
  o `st_mode` **resultante** não mede isso (a plataforma sintetiza 0o444/0o666 de
  um único atributo): meça o **argumento**, interceptando `os.chmod`.
- O veredito de "sobrou" é `os.path.exists`, **não** a ausência de exceção:
  rmtree remove parcialmente sem reclamar.
- A limpeza vive no `finally`, que roda **depois** do `return`: para o aviso
  alcançar o relato, a lista é criada antes do `try`, entra no dict devolvido e o
  `finally` faz `extend` (nunca rebind).

**Gatilho demonstrado, senão é cláusula morta** ([[sentinela-nao-e-clausula-defensiva]]):
o WARN se prova com **handle aberto** no arquivo (`WinError 32`) — 1 aviso nomeando
caminho, exceção e achado; fechado o handle, a mesma função remove e **cala**.
Mais o controle de não-vacuidade (rmtree nu ⇒ `WinError 5`) e o no-op (caminho
ausente ⇒ zero aviso).

**Controle de "nenhum veredito mudou":** `git show HEAD:<path> > copia` e rodar a
cópia **da raiz do repo** — stdout byte-idêntico ao do gate emendado, e a cópia
ainda mede o comportamento PRÉ-fix (+1 órfão, zero WARN). **Nunca `git stash` para
isso**: num comando composto de medição ele engoliu a edição não commitada e a
saída do próprio comando escondeu o fato (recuperado por `stash pop`).

**Why:** foi o silêncio, não a falha, que deixou o lixo crescer por três medições
seguidas; e um FAIL "para garantir" teria matado a campanha que prova o gate.

**How to apply:** todo `fix-finding` de higiene em gate pinado — decida pelo que o
gate julga, nomeie a decisão no cabeçalho do gate, prove o gatilho do WARN, e
meça o stdout contra a cópia de HEAD. Ver [[verde-com-excecao-impressa]] e
[[bateria-negativa-do-julgador-do-harness]].
