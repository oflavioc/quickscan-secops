# Red da exceção nominal — 013 · IC-9 (addendum de 2026-08-30)

> Fase 4 · dono: `qa-engineer`. Irmão de [red-integridade.md](red-integridade.md),
> mesmo rito, mesma mecânica de medição. Mede a árvore **como ela está** em
> `67be2ad`, antes do mecanismo existir. Este arquivo registra **execução** — o
> critério está enunciado abaixo porque é comportamento **novo** de gate,
> autorizado nominalmente pelo proprietário, e ainda **não** tem linha na
> `spec.md` (divergência declarada em §Pendências).

## O que foi autorizado, e por quem

O proprietário autorizou **nominalmente, no chat de 2026-08-30** — *"Autorizo,
sigo com suas recomendações"*, em resposta à pergunta direta — que o stage
`mutation` passe a honrar **exceção nominal** do `known_issues.json`, com o
`M51-01` como a primeira e prazo amarrado ao merge da demanda **014**. Não é
delegação genérica: **muda o que o gate exige**, e por isso precisou de
ratificação pessoal.

As quatro cláusulas duras, nas palavras dele, viram as quatro sub-asserções:

| Cláusula | Vira | Onde é medida |
|---|---|---|
| **Nominal, nunca abrangente** — nomeia harness + id do mutante + gate; nada de curinga, nada de "tolerar sobreviventes da p51" | **IC-9.1** (forma) + **IC-9.4** cenários iii/iv | local |
| **Prazo obrigatório** (`remocao_prevista`) — exceção sem prazo vira permissão permanente (`_meta` do próprio `known_issues`) | **IC-9.1** | local |
| **Impressa, nunca silenciosa** — o stage diz que está aplicando, com id e razão | **IC-9.4** cenário i (`aplicadas`) | local |
| **⚠️ Exceção obsoleta REPROVA** — se o mutante nomeado deixar de sobreviver, a exceção perdeu o motivo | **IC-9.3** (pelo registro) + **IC-9.4** cenário ii (pela execução) | local |

A cláusula ⚠️ tem **duas direções**, e foi deliberadamente medida nas duas: o
mutante pode "deixar de sobreviver" no **registro** (`mutation-matrix.json`
volta a dizer `KILL` quando a 014 reconstruir o poder discriminante) ou na
**execução** (o bloco do mutante volta a `DETECTADO` na saída da campanha). Uma
só das duas deixaria metade da cláusula sem gate.

## O critério, enunciado (IC-9)

> **IC-9 — Exceção nominal de mutante sobrevivente: nominal, com prazo,
> impressa, e que morre com a própria razão.** Toda entrada
> `lint == "mutation-sobrevivente"` do `known_issues.json` nomeia **um** harness,
> **um** id de mutante e **um** gate, sem curinga, com `motivo` e
> `remocao_prevista` não vazios (**IC-9.1**); o harness existe no
> `mutation_map.json` e **declara** aquele mutante (**IC-9.2**); o par existe em
> `mutation-matrix.json`, o gate declarado é o do par, e `ultima_prova.resultado`
> **não é `KILL`** (**IC-9.3**); e o mecanismo de perdão do laço de campanha
> **discrimina** — perdoa o nomeado, reprova o vizinho, reprova o harness alheio,
> não perdoa `NÃO EXECUTADO`, não perdoa campanha vazia, reprova quando o
> nomeado volta a `DETECTADO`, e **imprime** o que perdoou (**IC-9.4**).

Namespace: `IC-*` é da **demanda 013** — `IC-9` continua a numeração da própria
demanda, não de fase alheia (R10 §"Nascimento de um gate"). O bloco é
**aditivo**: a seção de integridade (`IC-1`…`IC-6`) não foi tocada, e o seu fecho
canônico segue medindo o que sempre mediu.

## Contrato C5 — o seam que o mecanismo tem de expor

`IC-9.4` sonda **em processo**, exatamente como `IC-2` sonda `have("python")` com
env adversarial. Para isso o laço de campanha precisa expor uma **função pura**:

    mut_perdao(harness, blocos, excecoes) -> dict          sem I/O, sem efeito
      harness  — nome do harness no mutation_map.json
      blocos   — a lista `todos` de mut_ler(): {estado, id, desc, gate, resto}
      excecoes — as entradas `lint == "mutation-sobrevivente"` do known_issues
      devolve  {"perdoados":     [id…],   # SOBREVIVENTE coberto por exceção viva
                "obsoletas":     [id…],   # nomeado pela exceção e DETECTADO agora
                "remanescentes": [id…],   # não-KILL que exceção nenhuma cobre
                "aplicadas":     [linha…],   # o que o stage IMPRIME
                "perdoa_o_exit": bool}       # o veredito único que o laço consome

`perdoa_o_exit` é `True` **sse** houve ao menos um perdão, nenhuma obsoleta e
nenhum remanescente. `excecoes` entra por **parâmetro**, e não por leitura de
arquivo, por uma razão adversarial: a sonda alimenta o mecanismo com dados
**sintéticos**, de modo que o poder discriminante continue medido **depois** que
a última exceção real for cumprida — que é justamente o dia em que ninguém olha.

**C5 é proposta do `qa-engineer`, não decisão de desenho ratificada.** Renomear
a função ou trocar a forma do retorno é prerrogativa do `tech-lead`; o gate muda
junto, em uma string. O que **não** é negociável sem voltar ao proprietário é o
conjunto de cenários que ele tem de discriminar.

## Como foi medido (e por que assim)

`check_mutation.py` recusa rodar com `git status` sujo, então o red de uma
mudança **no próprio julgador** só se mede em worktree efêmera com o gate
commitado **lá** (rito da T002, [red-integridade.md](red-integridade.md)
§*Como foi medido*):

    git worktree add --detach <efêmera> 67be2ad   # + o novo check_mutation.py, commitado lá
    MUTATION_DEFER_MISSING=1 python .claude/verify/check_mutation.py    # exit 1

`MUTATION_DEFER_MISSING=1` é o rito local de D3: **não há Chromium nesta
máquina** e, ao contrário do red da T002, hoje os três harnesses **são exigidos**
(`tests_p5*_mutants.js` mudaram em relação à base `acc9c21`). Sem a env, a
ausência de ambiente vira três `[FAIL]` que se somam ao da asserção e embaralham
a leitura. As **duas** execuções estão registradas abaixo; nenhuma foi omitida.

## Saída do red — o bloco novo, integral

```
---- integridade: 0 problema(s) nomeado(s) ----
---- exceção nominal de mutante sobrevivente (013 · IC-9) ----
[OK]   IC-9: nenhuma exceção `mutation-sobrevivente` declarada em known_issues.json — nada a honrar (o mecanismo continua medido abaixo, com dados sintéticos)
[FAIL] IC-9: check_mutation.py · o julgador não expõe `mut_perdao(harness, blocos, excecoes)` (contrato C5) — a exceção nominal do known_issues.json não é honrada por mecanismo nenhum: um SOBREVIVENTE conhecido e classificado segue indistinguível de um novo, e uma exceção que já perdeu a razão não tem por onde reprovar
---- exceção nominal: 1 problema(s) nomeado(s) ----
[OK]   core: nenhum alvo mudou desde a base — campanha não exigida
[DEFER] p50: exigida (alvo mudou) — delegada ao job com chromium (job visual)
[DEFER] p51: exigida (alvo mudou) — delegada ao job com chromium (job visual)
[DEFER] p52: exigida (alvo mudou) — delegada ao job com chromium (job visual)
----
mutation: 0 campanha(s) executada(s) · 1 problema(s)
```

Exit **1**. A mesma execução **sem** `MUTATION_DEFER_MISSING`:

```
[FAIL] p50: campanha EXIGIDA (alvo mudou) mas ambiente sem chromium — execute onde o requisito exista (job visual do CI / rito do proprietário) e registre
[FAIL] p51: campanha EXIGIDA (alvo mudou) mas ambiente sem chromium — …
[FAIL] p52: campanha EXIGIDA (alvo mudou) mas ambiente sem chromium — …
----
mutation: 0 campanha(s) executada(s) · 4 problema(s)
```

Exit **1**. O seam `DEFER`/`FAIL` de `check_mutation.py` está **intacto** — a
regressão nomeada da T004 continua valendo com o bloco novo em cima.

### O que os `[OK]` provam, e importam tanto quanto o `[FAIL]`

- `---- integridade: 0 problema(s) ----` **byte-idêntico** ao de antes: o bloco
  novo tem contador próprio e **não** contamina a contagem canônica de IC-1…IC-6.
  O limite "não mexa na seção de integridade" foi respeitado por construção.
- `nenhuma exceção … — nada a honrar`: o gate **não** exige que exista exceção.
  Quando a 014 mesclar e a `KI-4` for removida, esta linha volta sozinha ao verde
  — uma exceção cumprida não pode virar dependência do gate.

## Estado asserção a asserção

| Asserção | Veredito | O que nomeia | Vira verde quando |
|---|---|---|---|
| **IC-9.1** (forma: nominal + prazo) | **vazia hoje** — `issues: []` | — | entra com a `KI-4`; falsificada por M-IC14/M-IC17 |
| **IC-9.2** (objeto vivo) | **vazia hoje** | — | idem; falsificada por M-IC15 |
| **IC-9.3** (não obsoleta, pelo registro) | **vazia hoje** | — | idem; falsificada por **M-IC12** e M-IC18 |
| **IC-9.4** (mecanismo com dentes) | **RED** | `mut_perdao` (C5) não existe — a exceção do `known_issues` não é honrada por mecanismo nenhum | quando o green expuser C5 |

**Por que a `KI-4` não entra neste commit.** A entrada e o mecanismo nascem
**juntos**, no green. Declarar no `known_issues.json` que `M51-01` está
dispensado enquanto nada honra a dispensa é escrever uma declaração decorativa —
que é literalmente o achado `EA-6` desta mesma demanda (*"requisito declarado que
não tem dentes"*) cometido de novo, um nível acima. A entrada validada está em
§*A entrada, pronta para o green*.

## Falsificação — o gate consegue ficar verde? E consegue voltar ao vermelho?

Red que não falha é gate que não mede; gate que **nunca passa** também não. Em
worktree efêmera, com uma implementação de **referência** de C5 (descartável,
escrita só para a sonda — **não** é a correção) e com a `KI-4` aplicada:

| Sonda | Cenário | Veredito de IC-9 |
|---|---|---|
| **P1** | referência sã de C5 + `KI-4` bem formada | **0 problemas · exit 0** |
| **P2** | referência sã de C5 + `issues: []` | **0 problemas · exit 0** |

Os dois verdes importam: o **P1** prova que a asserção é satisfazível; o **P2**
prova que ela não passa a exigir a existência da exceção.

### Matriz gate ↔ mutante — `M-IC10`…`M-IC19`

Cada mutante ataca **uma** cláusula. Todos foram aplicados sobre a referência sã
do **P1**, em cópia efêmera, e **nada disto voltou para a árvore real**.

| Mutante | O que muda | Cláusula atacada | Veredito | Morre em |
|---|---|---|---|---|
| **M-IC10** | perdão **abrangente**: perdoa qualquer `SOBREVIVENTE` do harness, ignorando o id | nominal, nunca abrangente | **morto** — IC-9.4 cenário iii: `perdoados` com 2 ids, `remanescentes` vazio, `perdoa_o_exit` True | local |
| **M-IC11** | remove a cláusula de **obsolescência em execução** (nunca devolve `obsoletas`) | ⚠️ obsoleta reprova | **morto** — IC-9.4 cenário ii: `obsoletas` = `[]`, esperado `['MUT-SONDA-A-013']` | local |
| **M-IC12** | `mutation-matrix.json` volta a `ultima_prova.resultado = "KILL"` para `p51/M51-01` | ⚠️ obsoleta reprova (registro) | **morto** — IC-9.3: `EXCEÇÃO OBSOLETA … o mutante voltou a morrer e a exceção perdeu o motivo` | local |
| **M-IC13** | perdão **silencioso**: perdoa sem preencher `aplicadas` | impressa, nunca silenciosa | **morto** — IC-9.4 cenário i: `perdoou sem aplicadas` | local |
| **M-IC14** | `KI-4` **sem** `remocao_prevista` | prazo obrigatório | **morto** — IC-9.1 | local |
| **M-IC15** | `KI-4` nomeia `M51-99` (mutante que não existe) | nominal a objeto vivo | **morto** — IC-9.2: `o harness p51 não declara o mutante 'M51-99' … a exceção nomeia um fantasma` | local |
| **M-IC16** | campanha **morta** perdoada: `perdoa_o_exit` deixa de exigir perdão efetivo | borda do exit code | **morto** — IC-9.4 cenário vi | local |
| **M-IC17** | `KI-4` com `mutante: "*"` | nada de curinga | **morto** — IC-9.1 | local |
| **M-IC18** | `KI-4` nomeia `P51-RPT6` (gate de outro par) | nominal ao gate | **morto** — IC-9.3: `gate declarado 'P51-RPT6' diverge do par na matriz` | local |
| **M-IC19** | `mut_perdao` **correto** mas o laço **nunca o consome** (`fails += 1` direto do returncode) | fiação do veredito | **SOBREVIVE a IC-9** — declarado abaixo | job `visual` |

Nenhuma morte foi **incidental**: cada `[FAIL]` cita a asserção e o cenário
correspondentes, e nenhum mutante derrubou uma sonda vizinha. A primeira versão
de **M-IC11** foi **descartada** por matar via `IndentationError` — crash não é
detecção (regra da casa, `tests_p51_mutants.js:9`); o mutante foi reescrito com
sintaxe válida e só então contou.

### M-IC19 — o mutante que sobrevive, e onde ele morre

`IC-9.4` mede a **função**, não a **fiação**. Um `mut_perdao` impecável que o
laço nunca chama (ou que o laço chama e ignora) passa por IC-9. É o mesmo
limite estrutural de `IC-2`, que mede `have("python")` em processo e sobrevive ao
dual `have → False` — e ali a casa resolveu do mesmo jeito: **nomear o job onde o
mutante morre**, em vez de fingir cobertura.

- Direção **inofensiva** (laço não chama): a campanha `p51` do job `visual`
  continua vermelha e ninguém confunde isso com verde.
- Direção **perigosa** (laço chama e perdoa demais): aparece no job `visual`
  como campanha `p51` **verde sem nenhuma linha `[EXCEÇÃO]` impressa** — que é
  precisamente o que a cláusula "impressa, nunca silenciosa" existe para tornar
  visível.

Uma asserção estrutural sobre o próprio fonte (`grep` por `mut_perdao(` no laço)
foi **considerada e recusada**: um comentário ou uma chamada morta a satisfazem,
e um verde que não mede é a doença desta demanda. Dívida declarada, não
cobertura fingida.

## A entrada, pronta para o green

Validada pela sonda **P1** (IC-9.1/9.2/9.3 verdes contra ela, com o oráculo dos
ids sendo o `preflight (C1)` da `p51`):

```json
{
  "id": "KI-4",
  "lint": "mutation-sobrevivente",
  "excecao": { "harness": "p51", "mutante": "M51-01", "gate": "P51-VIS1" },
  "motivo": "EA-7 (.claude/BACKLOG.md) — gate sem poder discriminante: a âncora é única (preflight C1, ocorrencias == 1), o `reason` segue emitido por tests_p50_chromium.js:3405/:3408/:3412, a mutação é aplicada e P51-VIS1 RODA E PASSA, porque desde c1e3649 a composição de duas colunas da tela de pergunta é governada por ui_p52_workspace_v32.css:70-83 (vence a regra 5.1 por especificidade e por ordem de inlining). A campanha p51 fecha 19/20 por esse par, e só por ele. Classificação registrada em mutation-matrix.json e narrativa em specs/013-integridade-da-campanha/matriz-gate-mutante.md §17.",
  "remocao_prevista": "Merge da demanda 014 na develop — a 014 reconstrói o poder discriminante do par; no dia em que a ultima_prova voltar a KILL, IC-9.3 REPROVA esta entrada e força a remoção"
}
```

O `remocao_prevista` é **auto-executável**, e é isso que o distingue de uma
promessa: quem cumprir a 014 e repuser o `KILL` na matriz **não consegue**
esquecer de remover a exceção — o stage reprova nomeando `EXCEÇÃO OBSOLETA`. Foi
esta a exigência que o proprietário fez do mecanismo, e é a que M-IC12 prova.

## Regressão — conferida, não presumida

- Seção de integridade `IC-1`…`IC-6`: **0 problemas**, saída byte-idêntica à de
  `67be2ad`. Nenhuma linha do bloco foi editada.
- Pré-condição de árvore limpa e pós-condição de restauração: **intactas**.
- `DEFER` sob `MUTATION_DEFER_MISSING=1` e `FAIL` sem a env: **intactos**, medidos
  nas duas execuções acima.
- `[DÍVIDA] core`, relato dos não-KILL (`mut_ler`/`mut_relata`), recibos: nenhuma
  linha tocada.
- Zero byte de produto. Nenhum arquivo `ui_*`, `engine_v32.js`, HTML ou
  `USER_GUIDE.md` no diff.

## Não executado (declarado, nunca omitido — R2 §1)

- **Campanha `p51` real** (`node tests_p51_mutants.js`): exige Chromium, ausente
  nesta máquina (`CHROME_PATH` vazia, cache do Playwright inexistente). Sem ela,
  a cláusula ⚠️ pela **execução** fica provada só em processo (cenário ii da
  sonda) e não ponta a ponta. Fecha no job `visual` do CI.
- **`M-IC19`**: sobrevive a IC-9 por construção; morre no job `visual`. Declarado
  acima, não contornado.
- **`gen_pins.py`**: **não executado** por instrução explícita do proprietário.
  `check_mutation.py` é pinado (`pins.json:74`) e este artefato é arquivo novo —
  o stage `baseline` fica vermelho por **pin desatualizado + rastreado sem pin**
  até o repin, que é commit `chore` de outro dono.

## Pendências que este red abre (para quem for fechar)

1. **`spec.md` não tem linha para IC-9.** O critério nasceu de ratificação do
   proprietário no chat, fora do ciclo de Fase 1. Classe do gap: **faltando**
   (não é spec errada nem implementação divergente). Dono: `product-owner` +
   `tech-lead` — o `qa-engineer` não escreve critério.
2. **C5 precisa de ratificação técnica** (nome e forma do retorno): `tech-lead`.
3. **`M-IC10`…`M-IC19` têm de ser absorvidos pela `matriz-gate-mutante.md`** na
   T028, junto com `M-IC1`…`M-IC9`. Ficaram aqui para não colidir com a wave 9,
   que ainda não escreveu aquela seção.
4. **Repin** (`gen_pins.py`) de `check_mutation.py` + este arquivo, em commit
   `chore` próprio: `build-engineer`.

## Aviso operacional (R14 — o vermelho é a entrega)

Entre este commit e o green, o stage `mutation` fica **legitimamente vermelho por
IC-9**, com **uma** linha nomeada. Esse vermelho **é** o red. O `run.sh --light`
segue sem tocar o stage (`heavy: true`), e a seção de integridade segue em
`0 problema(s)`.
