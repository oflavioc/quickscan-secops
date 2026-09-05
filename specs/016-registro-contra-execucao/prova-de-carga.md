# Prova de carga — 016-registro-contra-execucao (wave 5 · T032, T060, T061)

> Dono: `qa-engineer`. Registro das **execuções** que fixam
> `fecho.json → _meta.prova_de_carga` e a matriz `d016` (R2 §1: todo PASS cita
> execução; a **primeira** execução é registrada como saiu, com sobrevivente ou
> sem). Data das execuções: **2026-09-04**. Árvore: worktree da 016,
> `refs/remotes/origin/develop` = `921977c25e76` (idêntico ao remoto, conferido
> por `git ls-remote`), data do commit julgado (T4) `2026-09-04`. Nada aqui foi
> escrito na árvore versionada por gate ou campanha (R7 §3): toda mutação foi
> restaurada por bytes + SHA-256, com `git status --porcelain` limpo ao fim.

## 0. Sumário executável

| o quê | resultado | onde |
|---|---|---|
| Instrumentos (T032) | `check_fecho.py --sonda` **33 · 0** · `check_branch_protection.py --sonda` **9 · 0** · gate nu **0 problema(s)** em 1,2 s · `--pr` **FECHO PENDENTE (fase implement)** exit 1 · proteção ao vivo **DESPROTEGIDA** (faltam fecho, verify, visual, up-to-date) · varredura sem-rede **zero** | §1 |
| Campanha `d016`, 1ª execução | **30/30 DETECTADO** · controles **3 ok · 0 falho** · restauração byte a byte OK · porcelain limpo | §2 |
| Bateria negativa do **julgador do harness** | **0 detectados · 5 sobreviventes · 1 não executado** de 6 adversariais — nenhum no-op morre; réplica inválida é `NÃO EXECUTADO · rebuild falhou` | §3 |
| Stage `mutation` (`check_mutation.py`) sob árvore limpa, commit `e52e573` | `IC-4: d016: 30 âncora(s) com ocorrencias == 1` · `não-KILL: nenhum` · `mutation: 1 campanha(s) executada(s) · 0 problema(s)` | §4 |
| Bateria adversarial de I/O (C1 e · C6 d) | `origin/develop` ausente ⇒ **FAIL `NÃO DETERMINÁVEL`**, 11/11, exit 1 · `git` fora do PATH ⇒ FAIL nomeado · token inválido ⇒ **`[WARN]` local / `[FAIL]` sob `GITHUB_ACTIONS`** · repositório não identificado ⇒ `[WARN]` nomeado | §5 |
| Prova de carga fixada | **piso**: 6 merges / 5 branches · **exclusões**: 003 (2) · 009 (1) · 010 (1) · **fec1**: 015 por `#34` e nenhuma outra; piso vigente ⇒ `ANTERIOR AO PISO` — **lido (Fase 4) = medido (campanha)**, nada ajustado | §6 |
| Sobreviventes | **nenhum** | §7 |

## 1. T032 — medição da wave 3 (nada escrito), reexecutada nesta wave

### 1.1 (i) `python .claude/verify/check_fecho.py` — o stage, nu — exit 0 · `real 0m1.246s`

```text
[SONDA] fecho: 33 caso(s) · 0 divergência(s) (total pinado: 33)
[INFO]  população: ^feature/(\d{3})- ∩ planning-state (junção por `branch`) · piso 921977c2 (merge do PR #39 em develop, 2026-09-04T08:44-03) · origin/develop julgado: 921977c25e76 · data do commit julgado: 2026-09-04
[INFO]  merges first-parent após o piso: 0 · até o piso, inclusive: 39 (não julgados)
[OK]    003-marcador-duplicado: CONFORME (fase done) · oráculo: mensagem #13 · EXCLUÍDA R13 (relatorio-final.md, spec-validate.md) — fonte: fechada sob a Onda 2 (PR #13, 486f3ff, 2026-08-25), antes de existir Fase 6 com spec-validate; R13 'fases seladas sob o processo antigo'; P4 do portão da Fase 0 da 016
[OK]    007-migracao-evidencia: CONFORME (fase done) · oráculo: mensagem #20
[OK]    008-migracao-zips: CONFORME (fase done) · oráculo: mensagem #21
[OK]    009-leitura-do-relatorio: CONFORME (fase done) · oráculo: mensagem #24 · EXCLUÍDA R13 (spec-validate.md) — fonte: fecho retroativo 2026-09-04 (PR #37, chore/fecho-009-013) com conformance só no JSON; P4 do portão da Fase 0 da 016 — escrita retroativa opcional, fora da demanda; se acontecer, esta entrada sai no mesmo commit (C3 b)
[OK]    010-recomendacao-sem-vao: CONFORME (fase done) · oráculo: mensagem #31 · EXCLUÍDA R13 (spec-validate.md) — fonte: idem 009 (PR #37); P4 do portão da Fase 0 da 016
[OK]    011-numeracao-das-prioridades: CONFORME (fase done) · oráculo: mensagem #32
[OK]    012-status-backlog: CONFORME (fase done) · oráculo: mensagem #25
[OK]    013-integridade-da-campanha: CONFORME (fase done) · oráculo: mensagem #29
[OK]    014-gate-sem-poder-discriminante: CONFORME (fase done) · oráculo: mensagem #36
[OK]    015-superficies-de-apoio: CONFORME (fase done) · oráculo: mensagem #34
[OK]    016-registro-contra-execucao: EM VOO (fase implement) · não mesclada por nenhum oráculo — não julgada
----
fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)
```

Leitura: o verde da árvore é **por vácuo** em FEC1/FEC2/FEC4 (0 merges após o
piso; nenhuma válvula) e **por três exclusões que carregam** em FEC3 — como a
Fase 4 declarou. Os dentes estão em §2 (mutantes de árvore) e na sonda.

### 1.2 (ii) `GITHUB_HEAD_REF=feature/016-registro-contra-execucao GITHUB_BASE_REF=develop python .claude/verify/check_fecho.py --pr` — exit 1

```text
[SONDA] fecho: 33 caso(s) · 0 divergência(s) (total pinado: 33)
[FAIL]  FECHO PENDENTE da demanda 016-registro-contra-execucao (fase implement) — merge bloqueado até done
----
fecho --pr: FECHO PENDENTE · fase-nao-done
```

É o **red ao vivo local de `D016-PR1`** pela razão certa (C5 b); o red no CI é
o check `fecho` do PR (T041), até o `done` (T084).

### 1.3 (iii) `python .claude/verify/check_branch_protection.py` — ao vivo, token `gh auth token` — exit 1

```text
[INFO]  branch-protection LÊ O MUNDO: GET /repos/{repo}/rules/branches/{ref} + /repos/{repo}/branches/{ref} (R7 — único gate não-puro por construção) · modo: local
[SONDA] branch-protection: 9 caso(s) · 0 divergência(s) (total pinado: 9)
[INFO]  repo oflavioc/quickscan-secops (origem: git remote get-url origin) · token: gh auth token
[FAIL]  develop DESPROTEGIDA · faltam: fecho, verify, visual (checks obrigatórios), up-to-date · mecanismo lido: ruleset 21381133 (deletion, non_fast_forward) + classic enabled=false
        outras regras ativas: deletion · non_fast_forward
----
branch-protection: FAIL · DESPROTEGIDA
```

É o **red ao vivo de `D016-PROT1`** (C6 c, o estado medido em 2026-09-04): P2
(ato do proprietário, T050) **ainda não foi executada** nesta data. O gate está
vermelho por desenho, com dono e evento único de fecho (spec §Nascimento sem
vermelho crônico).

### 1.4 (iv) tempo do gate nu: `real 0m1.246s` (limiar do plan §Riscos: 2 s).

### 1.5 (v) varredura sem-rede — `grep -nwE "urllib|http|socket|ssl" .claude/verify/check_fecho.py .claude/verify/fecho.py` ⇒ **zero ocorrências** (exit 1 do grep). Palavra inteira, arquivo inteiro (ET4).

## 2. Campanha `d016` — PRIMEIRA execução (`node tests_016_mutants.js`), integral

Executada **antes** do commit T060 (harness e `mutation_map.json` ainda não
commitados; os nove arquivos que a campanha muta estavam limpos e byte-idênticos
a `HEAD` `612002e`). Exit 0.

```text
D016 MUTATION · 30 mutante(s) · 3 controle(s) · interpretador python (padrão) resolvido em <PATH do interpretador> · data do commit julgado (T4): 2026-09-04
baseline: fecho.py ff913440b7d1 · branch_protection.py d54c1d05a77f · check_fecho.py f5068c3f37c4 · fecho.json fb923998966c · 015-superficies-de-apoio.json 40c5a7762362 · 016-registro-contra-execucao.json 7923ef8ac012 · F5.json 1a5a78e093de · check_branch_protection.py 154d04818252 · sem_fecho.json 4472b74c82b9

CONTROLE  C0-fecho · baseline verde do gate nu: sonda 33/33 ok, 0 problema(s), exit 0
              resultado: OK · sonda 33/33 · 11 demanda(s) · 0 problema(s) · exit 0 · origin/develop 921977c25e76 · data do commit 2026-09-04

CONTROLE  C0-protecao · baseline verde da sonda de proteção: 9/9 ok, exit 0
              resultado: OK · sonda 9/9 · falhas 0 · exit 0

DETECTADO  D016-M1 · consultar SÓ a ancestralidade — o oráculo de mensagem cala (T1 invertido)
              gate esperado: D016-FEC1 · divergentes: F1,F4,F5,F6,F7,F8,F9,F15,F16,F17,F19,F23 (12/33)

DETECTADO  D016-M2 · piso invertido — só o que é anterior ao piso é julgado
              gate esperado: D016-FEC1 · divergentes: F1,F4,F6,F7,F8,F19 (6/33)

DETECTADO  D016-M3 · feature/NNN sem planning-state tratada como FORA DA POPULAÇÃO
              gate esperado: D016-FEC2 · divergentes: F11 (1/33)

DETECTADO  D016-M4 · merge em develop fora de PR após o piso é engolido (sem código, sem problema)
              gate esperado: D016-FEC2 · divergentes: F13 (1/33)

DETECTADO  D016-M5 · só relatorio-final.md é exigido — spec-validate.md deixa de contar (pós e pré-merge)
              gate esperado: D016-FEC3 · divergentes: F15,F16,F23,P8 (4/33)

DETECTADO  D016-M6 · exclusão obsoleta (artefato nomeado existe) não reprova
              gate esperado: D016-FEC3 · divergentes: F17 (1/33)

DETECTADO  D016-M7 · válvula sem dono/prazo é aceita — campo ausente não invalida
              gate esperado: D016-FEC4 · divergentes: F8 (1/33)

DETECTADO  D016-M8 · prazo não é comparado com a data do commit — válvula vencida passa (T4)
              gate esperado: D016-FEC4 · divergentes: F7 (1/33)

DETECTADO  D016-M9 · validate aceito como fecho pré-merge — a fase deixa de bloquear
              gate esperado: D016-PR1 · divergentes: P2 (1/33)

DETECTADO  D016-M10 · válvula honrada pré-merge — o check deixa de recusá-la (T5)
              gate esperado: D016-PR1 · divergentes: P7,P10 (2/33)

DETECTADO  D016-M11 · planning-state ausente libera o merge
              gate esperado: D016-PR1 · divergentes: P3 (1/33)

DETECTADO  D016-M12 · NÃO DETERMINÁVEL relatado como PROTEGIDA
              gate esperado: D016-PROT1 · divergentes: http_403,sem_rede (2/9)

DETECTADO  D016-M13 · strict ignorado — up-to-date desligado deixa de faltar
              gate esperado: D016-PROT1 · divergentes: strict_false (1/9)

DETECTADO  D016-M14 · um contexto basta — cobertura parcial zera o que falta
              gate esperado: D016-PROT1 · divergentes: sem_visual,sem_fecho (2/9)

DETECTADO  D016-M15 · protected: true basta — a armadilha do enabled=false/enforcement off
              gate esperado: D016-PROT1 · divergentes: hoje,sem_visual,sem_fecho,classic_off,http_403 (5/9)

DETECTADO  D016-M16 · laço da sonda esvaziado em check_fecho.py — 0 casos executados contra o total pinado
              gate esperado: D016-FEC1 D016-FEC2 D016-FEC3 D016-FEC4 D016-PR1 (C7) · total 0 ≠ pinado 33 · guarda: executados 0 ≠ total pinado 33 — a sonda não rodou inteira (C7)

DETECTADO  D016-M17 · dois dos três contextos bastam — `fecho` sai da exigência (errata E1)
              gate esperado: D016-PROT1 · divergentes: hoje,sem_fecho,classic_off (3/9)

DETECTADO  D016-M18 · árvore: piso recuado para 6dad53d E 015 em validate — a prova de carga de C1(a) (E2)
              gate esperado: D016-FEC1 · 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO · mensagem #34 (fase validate)

DETECTADO  D016-M19 · árvore: piso zero (raiz e5ccd429) — a prova de carga do piso: 6 merges / 5 branches de Onda sem planning-state
              gate esperado: D016-FEC2 · 6 problema(s) · acusados: 6dad53d3423b20c768690d0b0005ef88025b9f35: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #15; 775d8f41cbf8cad45f85c551d5cc90dcd8fe86f1: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #14; c300ed0393a90024ce16169fc84f9881b9ee518f: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #12; 7d843ccde2fc0b4cdce755903565a3052fb5ef09: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #11; 5f673c104b80ed1eba2b9e25449ece7a48399b3a: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #10; d943a5e2ab25527da20e3fd5ab15fcd0ab7b7c38: MESCLADA SEM FECH

DETECTADO  D016-M20 · árvore: as três exclusões R13 retiradas — a prova de carga das exclusões: 003 (2 artefatos), 009 (1), 010 (1)
              gate esperado: D016-FEC3 · 3 problema(s) · acusados: 003-marcador-duplicado: MESCLADA SEM FECHO [artefato-ausente] · mensagem #13 (fase done); 009-leitura-do-relatorio: MESCLADA SEM FECHO [artefato-ausente] · mensagem #24 (fase done); 010-recomendacao-sem-vao: MESCLADA SEM FECHO [artefato-ausente] · mensagem #31 (fase done)

DETECTADO  D016-M21 · árvore: válvula VÁLIDA escrita na 016 (em voo) — válvula antes do vencimento (T5, C4 d); ver ciclo de vida no cabeçalho
              gate esperado: D016-FEC4 · 1 problema(s) · acusados: 016-registro-contra-execucao: EM VOO [fecho_pendente-prematura] (fase implement)

DETECTADO  D016-M22 · árvore: fixture F5.json removida — a guarda de contagem nomeia o caso e a árvore não é julgada
              gate esperado: D016-FEC1 D016-FEC2 D016-FEC3 D016-FEC4 D016-PR1 (C7) · F5 → FIXTURE AUSENTE · árvore julgada: false · guarda: caso sem fixture: F5 | contagem: 32 fixture(s) · 33 caso(s) · total pinado 33

DETECTADO  D016-M23 · árvore: chave `branch` removida de um planning-state done (015) — FAIL de forma, C1(f)
              gate esperado: D016-FEC1 · 1 problema(s) · acusados: 015-superficies-de-apoio: NÃO DETERMINÁVEL [registro-sem-branch] (fase done)

DETECTADO  D016-M24 · árvore: sobre o cenário de M18, válvula em 015 com prazo 2026-01-01 — vencida contra a data do commit (T4)
              gate esperado: D016-FEC4 · 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO [fecho_pendente-vencida] · mensagem #34 (fase validate)

DETECTADO  D016-M25 · árvore: piso malformado no fecho.json real (SHA curto) — global piso-invalido, toda demanda NÃO DETERMINÁVEL (C2 d)
              gate esperado: D016-FEC2 · 1 problema(s) · acusados: 003-marcador-duplicado: NÃO DETERMINÁVEL [piso-invalido] (fase done); 007-migracao-evidencia: NÃO DETERMINÁVEL [piso-invalido] (fase done); 008-migracao-zips: NÃO DETERMINÁVEL [piso-invalido] (fase done); 009-leitura-do-relatorio: NÃO DETERMINÁVEL [piso-invalido] (fase done); 010-recomendacao-sem-vao: NÃO DETERMINÁVEL [piso-invalido] (fase done); 011-numeracao-das-prioridades: NÃO DETERMINÁVEL [piso-invalido] (fase done); 012-status-backlog: NÃO DETERMINÁVEL [piso-invalido] (fase done); 013-integridade-da-campanha: NÃO DETERMINÁVEL [piso-invalido] (fase done); 014-gat

DETECTADO  D016-M26 · árvore: exclusão R13 para 011, cujo artefato existe em disco — exclusão obsoleta (C3 b)
              gate esperado: D016-FEC3 · 1 problema(s) · acusados: 011-numeracao-das-prioridades: CONFORME [exclusao-obsoleta] · mensagem #32 (fase done)

DETECTADO  D016-M27 · árvore: `fonte` vazia na exclusão da 009 — a exclusão NÃO exclui (global exclusao-malformada) e a 009 cai em artefato-ausente (C3 c)
              gate esperado: D016-FEC3 · 2 problema(s) · acusados: 009-leitura-do-relatorio: MESCLADA SEM FECHO [artefato-ausente] · mensagem #24 (fase done) · globais: exclusao-malformada

DETECTADO  D016-M28 · árvore: válvula na 015 (done, mesclada) com o piso vigente — válvula obsoleta (C4 c), carrasco permanente
              gate esperado: D016-FEC4 · 1 problema(s) · acusados: 015-superficies-de-apoio: CONFORME [fecho_pendente-obsoleta] · mensagem #34 (fase done)

DETECTADO  D016-M29 · laço da sonda esvaziado em check_branch_protection.py — 0 casos executados contra o total pinado
              gate esperado: D016-PROT1 (C7) · total 0 ≠ pinado 9 · guarda: executados 0 ≠ total pinado 9 — a sonda não rodou inteira (C7)

DETECTADO  D016-M30 · árvore: fixture sem_fecho.json removida — a guarda de contagem do gate de proteção nomeia o caso
              gate esperado: D016-PROT1 (C7) · sem_fecho → FIXTURE AUSENTE · guarda: caso sem fixture: sem_fecho | contagem: 8 fixture(s) · 9 caso(s) · total pinado 9

CONTROLE  D016-M24/positivo · válvula VÁLIDA sobre o cenário de M18 (prazo == data do commit): FECHO PENDENTE DECLARADO, exit 0 — FEC4 alcança o verde e T4 lê a data do commit
              resultado: OK · 015-superficies-de-apoio: FECHO PENDENTE DECLARADO · mensagem #34 · dono qa-engineer · prazo 2026-09-04 · motivo: MUTANTE D016-M24/positivo — válvula escrita pela campanha d016 · válvulas 1 · problemas 0 · exit 0

restauração: arquivos mutados byte a byte OK · porcelain dos alvos limpo

D016 MUTATION [tests_016_mutants.js]: 30/30 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)
```

Notas de leitura:

- **Preflight** (`node tests_016_mutants.js --preflight`, exit 0): 30/30 âncoras
  com `ocorrencias == 1`; M18 e M24 são multi-arquivo (`fecho.json` +
  planning-state 015) e reportam 1 sse **toda** âncora é única; M22/M30 têm
  como âncora a existência da fixture.
- A linha `M19` e a linha `M25` estão **truncadas pelo harness** (teto de 600
  caracteres na nota) — a lista inteira dos seis merges está em §6 e nos pares
  da matriz; sob M25 as 11 demandas saem `NÃO DETERMINÁVEL [piso-invalido]` e
  nenhum sujeito `merge` é julgado (o julgador do harness confere as 11, não a
  linha).
- `M21` mede hoje **C4(d)** (`EM VOO [fecho_pendente-prematura]`, fase
  `implement`). O julgador do harness aceita **só** três combinações acopladas
  à fase/posição (fase ≠ done ⇒ prematura; done sem merge ⇒ `EM VOO` +
  obsoleta; done mesclada ⇒ `CONFORME` + obsoleta) — uma válvula na 016 nunca é
  legítima, então o mutante morre em qualquer ponto do ciclo **sem
  reancoragem**. Sem esse acoplamento o par sairia SOBREVIVENTE no CI no push
  do `done` (T084), dentro desta própria demanda. `M28` (015, done e mesclada)
  é o carrasco **permanente** de C4(c).
- `M9`: P2 (validate, sem artefatos) escorrega da cláusula de fase para a de
  artefatos — o código muda de `fase-nao-done` para `artefato-ausente`. É o
  que a sonda vê; a spec previa "libera", mas a fixture P2 não tem artefatos
  (se tivesse, liberaria). Pinado o código obtido, não o veredito.

## 3. O próprio julgador do harness discrimina? — bateria negativa (instrumento de desenho)

Um 30/30 de primeira só vale se o julgador **não** for constante-DETECTADO.
Gerada uma cópia efêmera do harness com a lista `MUTANTS` trocada por seis
adversariais (arquivo apagado logo depois; nada commitado; porcelain limpo).
Exit 1 — o esperado.

```text
SOBREVIVENTE  N1-noop-instrumento · NEGATIVO: edição sem efeito em fecho.py — o julgador NÃO pode matar
              gate esperado: D016-FEC3 · sonda não reprovou (exit 0, ok=true)
SOBREVIVENTE  N2-noop-arvore · NEGATIVO: edição sem efeito no fecho.json — o gate nu segue verde
              gate esperado: D016-FEC1 · exit 0/0 (esperado 1) | problemas: esperado 1 · obtido 0 | sujeito 015-superficies-de-apoio: não casou · real: 015-superficies-de-apoio: CONFORME · mensagem #34 (fase done) ‖ 0 problema(s) · acusados: nenhum
SOBREVIVENTE  N3-contagem-errada · NEGATIVO: cenário de M18 com problemas esperado = 2 (real: 1)
              gate esperado: D016-FEC1 · problemas: esperado 2 · obtido 1 ‖ 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO · mensagem #34 (fase validate)
SOBREVIVENTE  N4-isolamento · NEGATIVO: cenário de M18 declarando nenhum sujeito — a 015 acusada tem de contar como acusação a mais
              gate esperado: D016-FEC1 · acusação a MAIS (1): 015-superficies-de-apoio: MESCLADA SEM FECHO · mensagem #34 ‖ 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO · mensagem #34 (fase validate)
NÃO EXECUTADO  N5-replica-invalida · NEGATIVO: import de módulo inexistente em fecho.py — instrumento ausente sob a mutação
              gate esperado: D016-FEC1 · causa: rebuild falhou · instrumento não importou sob o mutante: INSTRUMENTO AUSENTE: import falhou (ModuleNotFoundError: No module named 'modulo_inexistente_d016')
SOBREVIVENTE  N6-valor-errado · NEGATIVO: a mutação de M1 com a expectativa F19 → CONFORME (real: EM VOO)
              gate esperado: D016-FEC1 · F19.veredito: esperado "CONFORME" · obtido "EM VOO"
CAMPANHA NÃO CONCLUÍDA [tests_016_mutants.js]: 0 detectados · 5 sobreviventes · 1 não executados (de 6) · controles: 3 ok · 0 falho(s)
```

Leitura: no-op de instrumento e de árvore **sobrevivem**; contagem errada,
isolamento violado e valor errado no campo certo **sobrevivem com o motivo
nomeado**; réplica que não importa é **`NÃO EXECUTADO · rebuild falhou`**,
nunca kill por crash. Os três estados são alcançáveis e a razão é dita.

## 4. Stage `mutation` — `python .claude/verify/check_mutation.py` sob árvore limpa (commit `e52e573`) — exit 0

Excertos (grep) do log integral, que é longo porque o stage roda os preflights
de todos os harnesses e os blocos IC-1…IC-10 da 013:

```text
[OK]   IC-1: d016/tests_016_mutants.js: 0 cmd, nenhum com prefixo POSIX de variável
[OK]   IC-1: d016/tests_016_mutants.js: nenhum literal de interpretador em comando
[OK]   IC-4: d016: 30 âncora(s) com ocorrencias == 1 (preflight, C1)
---- integridade: 0 problema(s) nomeado(s) ----
[RUN]  d016: node tests_016_mutants.js
       restauração: arquivos mutados byte a byte OK · porcelain dos alvos limpo
       D016 MUTATION [tests_016_mutants.js]: 30/30 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)
       não-KILL: nenhum — os 30 mutante(s) lidos estão DETECTADO
----
mutation: 1 campanha(s) executada(s) · 0 problema(s)
```

Só `d016` foi exigida pelo trigger (nenhum arquivo desta demanda é alvo de outro
harness); `git status --porcelain` vazio ao fim.

## 5. Bateria adversarial de I/O — C1(e) e C6(d), fora da sonda

### 5.1 C1(e) — em **clone efêmero** (não worktree: refs remotas são compartilhadas entre worktrees, e `update-ref -d` numa delas apagaria `origin/develop` para todas)

Clone local de `HEAD` `612002e` com `refs/remotes/origin/develop` fixado em
`921977c` (o `develop` local estava atrás do remoto). Controle: gate nu
`fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)`, exit 0.

`git update-ref -d refs/remotes/origin/develop` → `python .claude/verify/check_fecho.py` — exit 1:

```text
[SONDA] fecho: 33 caso(s) · 0 divergência(s) (total pinado: 33)
[INFO]  população: ^feature/(\d{3})- ∩ planning-state (junção por `branch`) · piso 921977c2 (merge do PR #39 em develop, 2026-09-04T08:44-03) · origin/develop julgado: ausente · data do commit julgado: 2026-09-04
[INFO]  merges first-parent após o piso: 0 · até o piso, inclusive: 0 (não julgados)
[FAIL]  NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin develop)
[FAIL]  003-marcador-duplicado: NÃO DETERMINÁVEL (fase done) · não julgada — NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin develop)
… (idem para 007, 008, 009, 010, 011, 012, 013, 014, 015)
[FAIL]  016-registro-contra-execucao: NÃO DETERMINÁVEL (fase implement) · não julgada — NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin develop)
----
fecho: 11 demanda(s) · 0 válvula(s) · 1 problema(s)
```

`--json`: `globais: ['origin-develop-ausente'] · problemas 1 · demandas NÃO
DETERMINÁVEL 11/11 · exit 1`. **Nunca SKIP.**

`git` fora do PATH (`PATH=""`, interpretador por caminho absoluto) — exit 1:

```text
[SONDA] fecho: 33 caso(s) · 0 divergência(s) (total pinado: 33)
[FAIL]  NÃO DETERMINÁVEL (leitura do mundo falhou: FileNotFoundError: [WinError 2] O sistema não pode encontrar o arquivo especificado)
----
fecho: leitura falhou · 1 problema(s)
```

Observação (não é defeito do gate; vai em DEPENDÊNCIAS ao `core-engineer`,
baixa prioridade): quem nomeou foi o `protegido()` do gate, não a causa `git
ausente no PATH` do instrumento — `ler_merges`/`ler_ancestralidade` a
classificam, `ler_data_commit` não (estoura `FileNotFoundError`). O veredito e o
exit são os exigidos por C1(e); só a mensagem é menos específica.

`--pr` no clone **sem** `origin/develop` (checkout raso não precisa do ref):
`fecho --pr: FECHO PENDENTE · fase-nao-done`, exit 1 — o pré-merge lê só a
árvore, como o plan §Job promete.

E2, metade "restaurado o piso": 015 em `validate` **com o piso vigente**
`921977c` ⇒

```text
[OK]    015-superficies-de-apoio: ANTERIOR AO PISO (fase validate) · oráculo: mensagem #34 · mesclada até o piso, inclusive — fora do alcance do julgamento (R13)
fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)
```

### 5.2 C6(d) — `check_branch_protection.py` ao vivo (na worktree; nada escrito)

`GITHUB_TOKEN=invalido` (modo local) — exit 0, **`[WARN]` nomeado**:

```text
[INFO]  repo oflavioc/quickscan-secops (origem: git remote get-url origin) · token: GITHUB_TOKEN
[WARN]  branch-protection: NÃO DETERMINÁVEL (permissão 401: Bad credentials) — rito: gh auth login && bash .claude/verify/compliance-audit.sh --rule=branch-protection
----
branch-protection: WARN · NÃO DETERMINÁVEL
```

`GITHUB_ACTIONS=1 GITHUB_TOKEN=invalido` — exit 1, **`[FAIL]`** (T7):

```text
[FAIL]  branch-protection: NÃO DETERMINÁVEL (permissão 401: Bad credentials) — rito: gh auth login && bash .claude/verify/compliance-audit.sh --rule=branch-protection
----
branch-protection: FAIL · NÃO DETERMINÁVEL
```

`GITHUB_REPOSITORY=outro/repositorio` — exit 0, `[WARN]  branch-protection: NÃO
DETERMINÁVEL (repositório não identificado: esperado oflavioc/quickscan-secops,
remote outro/repositorio)` — nenhuma chamada de rede feita (`ler_api` compara o
repositório antes).

## 6. Prova de carga fixada — lido (Fase 4) × medido (campanha)

| prova | lido na Fase 4 (git/disco, sem instrumento) | medido pela campanha (D016-M*) | divergência |
|---|---|---|---|
| **piso** (M19, piso zero `e5ccd429`) | 6 merges / 5 branches: `#15` 005, `#14` 004, `#12` 002, `#11` e `#10` 001, `#9` 000; 0 fora de PR | **6 problema(s)**: `6dad53d` #15 · `775d8f4` #14 · `c300ed0` #12 · `7d843cc` #11 · `5f673c1` #10 · `d943a5e` #9 — todos `MESCLADA SEM FECHO [demanda-fora-da-maquina]`; as 10 done `CONFORME`; 016 `EM VOO` | **nenhuma** |
| **exclusões** (M20) | 003 sem `relatorio-final.md` e `spec-validate.md`; 009 e 010 sem `spec-validate.md` — 3 demandas / 4 artefatos | **3 problema(s)**: 003 `#13` (relatorio-final.md, spec-validate.md) · 009 `#24` (spec-validate.md) · 010 `#31` (spec-validate.md), todas `[artefato-ausente]` | **nenhuma** |
| **fec1** (M18, piso `6dad53d` + 015 `validate`) | E2: acusa 015 por `#34` e nada mais; piso restaurado ⇒ `ANTERIOR AO PISO` | **1 problema(s)**: `015: MESCLADA SEM FECHO · mensagem #34 (fase validate)`, nenhuma outra; piso vigente (clone) ⇒ `ANTERIOR AO PISO`, 0 problema(s) | **nenhuma** |

Nada foi ajustado: os números de `fecho.json → _meta.prova_de_carga` são os da
campanha, e coincidem com `_meta.prova_de_carga_leitura_fase4`.

## 7. Sobreviventes e não executados

- **Sobreviventes: nenhum** (30/30 na 1ª execução e no stage).
- **Não executados: nenhum** (todas as âncoras únicas; interpretador
  resolvido; baseline verde).
- **O que não foi medido nesta wave, declarado**: (a) o verde ao vivo de
  `D016-PROT1` — depende de P2 (T050), não executada em 2026-09-04; (b) a
  campanha `d016` **no CI** (T063, job `verify` — `MUTATION_DEFER_MISSING=1`
  não a defere: exige só node e python); (c) `run.sh --light`: executado na
  entrega, com o stage `baseline` **vermelho por desenho** até os repins
  R5a/R5b do build-engineer (arquivos pinados alterados: `spec.md`,
  `mutation_map.json`, `mutation-matrix.json`, `fecho.json`; novo sem pin:
  `tests_016_mutants.js`) — R8 §1; contagem citada na EVIDÊNCIA da entrega.

## 8. Divergências de registro encontradas (não ajustadas em silêncio)

1. `tasks.md` T060 fala em **35 fixtures e 42 targets**: foi escrito antes dos
   sete acréscimos da Fase 4 (F20–F23, P8–P10). `git ls-files
   .claude/verify/fixtures_016/` devolve **42**; a entrada `d016` tem **51**
   targets (42 fixtures + 4 scripts + 2 registros + harness + os 2
   planning-states que a campanha muta — estes últimos são desvio declarado que
   **endurece** o trigger, precedente d009/d010/d014). Registrado na `_trilha`
   do `d016`; os números do `tasks.md` ficam como prosa histórica.
2. `spec.md` §Superfície 1 prescrevia `--merges` — corrigido pela **E3**
   (commit `50b97cd`), classe spec-errada, sob delegação (fórmula literal na
   própria errata).
3. `ler_data_commit` não classifica `git` ausente (§5.1) — observação ao
   `core-engineer`; o gate cumpre C1(e) mesmo assim.

## 9. Fase 6 — iteração de correção do `spec-validate` (G3, J1, J3, J4) · 2026-09-04

> `qa-engineer`. Árvore de partida: HEAD `d130a04` (nos arquivos julgados —
> `fecho.py`, `check_fecho.py`, `fecho.json`, harness, matriz — byte-idêntico a
> `76fd9dc`, o HEAD do `spec-validate`; `d130a04` só toca prosa e os artefatos de
> G1/G2). Commit de código desta iteração: **`9fe57f0`**. Nada escrito na árvore
> por gate ou campanha; toda mutação restaurada por bytes + SHA-256 (e o arquivo
> criado por M32, removido — conferido), porcelain limpo ao fim.

### 9.0 Sumário executável

| o quê | resultado |
|---|---|
| **RED de HEAD** (clone efêmero, mutações à mão) | M31 (cláusula de formato removida) ⇒ sonda **33 · 0, exit 0** — sobreviveria (o G3) · leitor mudo (`ler_merges` → `[]`) ⇒ gate nu **exit 0, 0 problema(s), `merges_ate_piso` 0** (o J1) · M9 ⇒ **só P2** diverge, por `artefato-ausente` (o J3) · planning-state sintético 999 com válvula ⇒ o gate **já acusa** (`EM VOO [fecho_pendente-prematura]`, 12 demanda(s) · 1 problema(s)) — faltava o carrasco permanente (o J4) |
| Sonda | **35 · 0** (F24 e P11 entram; ids permanentes) |
| Gate nu | `0 problema(s)` · `até o piso, inclusive: 39 (não julgados) · censo pinado: 39 (ok)` · exit 0 |
| Preflight `d016` | **33/33** âncoras com `ocorrencias == 1` (M18/M19/M24 agora com duas âncoras no `fecho.json`; M32 com a âncora "ausência" do arquivo) |
| Campanha `d016` | **33/33 DETECTADO · controles 3 ok** — sobre a árvore de trabalho e reexecutada sobre `9fe57f0` (porcelain limpo) |
| Stage `mutation` (árvore limpa, `9fe57f0`) | `IC-4: d016: 33 âncora(s) com ocorrencias == 1` · `não-KILL: nenhum — os 33 mutante(s) lidos estão DETECTADO` · `mutation: 1 campanha(s) executada(s) · 0 problema(s)` |
| Bateria negativa dos julgadores **novos** | **0 detectados · 4 sobreviventes · 1 não executado** (de 5) |
| `run.sh --light` | **11 PASS · 1 FAIL** — o FAIL é `baseline` (pins até o repin, R8 §1; ver 9.6) |
| `check_tdd` | `11 demanda(s) · 0 waiver(s) · 0 problema(s)` · pares completos |

### 9.1 RED de HEAD — o que a árvore de partida fazia (clone efêmero de `d130a04`, `origin/develop` = `921977c`)

Controle do clone: sonda `33 · 0`; gate nu `11 demanda(s) · 0 válvula(s) · 0 problema(s)`.

**M31 à mão** (`if not _dia_valido(prazo):` → `if False and …`), sem F24:

```text
[SONDA] fecho: 33 caso(s) · 0 divergência(s) (total pinado: 33)
exit=0 · ok True · falhas 0 · divergentes []
```

Alínea C4(e) com instrumento e sem carrasco — o G3. **Leitor mudo à mão**
(`return {"merges": merges, …}` → `return {"merges": [], …}`, `od` intacto):

```text
[INFO]  merges first-parent após o piso: 0 · até o piso, inclusive: 0 (não julgados)
fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)
exit 0 · problemas 0 · merges_ate_piso 0 · falhas [] · oráculos [None, 'ancestralidade']
```

O gate verde por vácuo com a leitura vazia — o J1. **M9 à mão** ⇒
`divergentes ['P2']` com `{'veredito': 'FECHO PENDENTE', 'codigo': 'artefato-ausente'}` — morria pelo código,
não por "libera" (J3). **Planning-state 999 sintético com válvula válida** ⇒
`[FAIL] 999-sintetica-d016: EM VOO (fase implement) · fecho_pendente em demanda não mesclada — a válvula é pós-merge (C4 d, T5)` ·
`fecho: 12 demanda(s) · 0 válvula(s) · 1 problema(s)` — o estado existe e o gate o acusa; o que não existia era o carrasco
**permanente** na campanha (J4).

### 9.2 O que mudou (commit `9fe57f0`)

- **Sonda 33 → 35**: `F24` (C4 e — `prazo: "30/09/2026"`, dia/mês/ano ⇒ `MESCLADA SEM FECHO · mensagem · fecho_pendente-invalida · 1`) e
  `P11` (C5 b — `validate` **com** os dois artefatos e sem válvula ⇒ `FECHO PENDENTE · fase-nao-done`; isola a cláusula de fase).
  O prazo de F24 é lexicograficamente **maior** que a data do commit: sob M31 o caso cai em "aceita", não em "vencida" — o kill é pela (e).
- **Guarda de censo da leitura** (`check_fecho.py`): `fecho.json → piso.merges_ate_piso = 39` — censo **imutável** de merges first-parent até o
  piso, inclusive; medido por dois oráculos (`git rev-list --count --merges --first-parent 921977c…` = 39 = `ler_merges`) e **pinado, não
  calibrado**. O gate o compara a `contagens.merges_ate_piso` da árvore real: divergência ⇒ `[FAIL] guarda de censo da leitura: …`, exit 1,
  mesmo com 0 problema(s) de julgamento. Só se aplica com `origin/develop` presente e piso na cadeia; pin ausente/inválido é FAIL. Não é
  veredito: é `total_pinado` aplicado ao leitor (C7).
- **Harness 30 → 33**: `D016-M31` (formato do prazo, morre em F24), `D016-M32` (árvore: **cria** `999-sintetica-d016.json` com válvula válida —
  âncora = ausência do arquivo, restauração = unlink — carrasco permanente de C4 d) e `D016-M33` (leitor mudo — morre na guarda de censo, com
  a exigência de **0 problema(s) de julgamento**). `M9` passa a esperar `P11 → LIBERADO` (letra da spec) com P2 como segunda divergência.
  `M18/M19/M24` e o controle positivo movem **piso e censo juntos** (6dad53d = 15; raiz = 0). `C0-fecho` passa a exigir censo ok.
- `mutation_map → d016.targets` 51 → 54 (+F24, +P11, +999 — para que um commit que crie o arquivo redispare a campanha); `pipeline.yaml`
  `desc` do stage `fecho` (35 casos, censo).

### 9.3 Greens — sonda, gate nu, preflight (árvore de trabalho e `9fe57f0`)

```text
[SONDA] fecho: 35 caso(s) · 0 divergência(s) (total pinado: 35)
[INFO]  merges first-parent após o piso: 0 · até o piso, inclusive: 39 (não julgados) · censo pinado: 39 (ok)
fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s)
--json → censo: {"pinado": 39, "lido": 39, "estado": "ok", "detalhe": "merges first-parent até o piso, inclusive: lidos 39 = censo pinado 39", "falha": false} · exit 0
PREFLIGHT d016 · 33 mutante(s) · 3 controle(s) · interpretador python (padrão): resolvido
  ok            D016-M18 · ocorrencias=1 em fecho.json+fecho.json+015-superficies-de-apoio.json
  ok            D016-M19 · ocorrencias=1 em fecho.json+fecho.json
  ok            D016-M31 · ocorrencias=1 em fecho.py
  ok            D016-M32 · ocorrencias=1 em 999-sintetica-d016.json
  ok            D016-M33 · ocorrencias=1 em fecho.py
todas as âncoras com ocorrencias == 1
```

### 9.4 Campanha `d016` — 33/33 (linhas novas e as que mudaram; reexecução sobre `9fe57f0`)

```text
CONTROLE  C0-fecho · baseline verde do gate nu: sonda 35/35 ok, censo da leitura ok (39 = 39), 0 problema(s), exit 0
              resultado: OK · sonda 35/35 · 11 demanda(s) · 0 problema(s) · censo da leitura 39/39 (ok) · exit 0 · origin/develop 921977c25e76 · data do commit 2026-09-04
DETECTADO  D016-M31 · prazo fora de AAAA-MM-DD é aceito — a cláusula de formato de _valvula é desligada (C4 e)
              gate esperado: D016-FEC4 · divergentes: F24 (1/35)
DETECTADO  D016-M9 · validate aceito como fecho pré-merge — a fase deixa de bloquear
              gate esperado: D016-PR1 · divergentes: P2,P11 (2/35)
DETECTADO  D016-M18 · árvore: piso recuado para 6dad53d E 015 em validate — a prova de carga de C1(a) (E2)
              gate esperado: D016-FEC1 · 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO · mensagem #34 (fase validate)
DETECTADO  D016-M19 · árvore: piso zero (raiz e5ccd429) — a prova de carga do piso: 6 merges / 5 branches de Onda sem planning-state
              gate esperado: D016-FEC2 · 6 problema(s) · acusados: 6dad53d…: MESCLADA SEM FECHO [demanda-fora-da-maquina] · mensagem #15; 775d8f4…: #14; c300ed0…: #12; 7d843cc…: #11; 5f673c1…: #10; d943a5e…: #9
DETECTADO  D016-M24 · árvore: sobre o cenário de M18, válvula em 015 com prazo 2026-01-01 — vencida contra a data do commit (T4)
              gate esperado: D016-FEC4 · 1 problema(s) · acusados: 015-superficies-de-apoio: MESCLADA SEM FECHO [fecho_pendente-vencida] · mensagem #34 (fase validate)
DETECTADO  D016-M32 · árvore: planning-state SINTÉTICO 999 criado (implement, nunca mesclada) com válvula VÁLIDA — carrasco permanente de C4(d), independente do ciclo de vida da 016
              gate esperado: D016-FEC4 · 1 problema(s) · acusados: 999-sintetica-d016: EM VOO [fecho_pendente-prematura] (fase implement)
DETECTADO  D016-M33 · leitor: fecho.py:ler_merges devolve lista VAZIA com metadados sãos — sem a guarda de censo (piso.merges_ate_piso = 39) a árvore ficava verde por vácuo (spec-validate J1)
              gate esperado: D016-FEC1 D016-FEC2 (guarda de censo da leitura — C7 aplicada ao leitor) · censo lido 0 × pinado 39 (divergente) · 0 problema(s) de julgamento · exit 1
CONTROLE  D016-M24/positivo · válvula VÁLIDA sobre o cenário de M18 (prazo == data do commit): FECHO PENDENTE DECLARADO, exit 0 — FEC4 alcança o verde, T4 lê a data do commit e a guarda de censo honra o censo movido (15 = 15)
              resultado: OK · 015-superficies-de-apoio: FECHO PENDENTE DECLARADO · mensagem #34 · dono qa-engineer · prazo 2026-09-04 · … · válvulas 1 · problemas 0 · censo da leitura 15/15 (ok) · exit 0
restauração: arquivos mutados byte a byte OK · criados removidos OK · porcelain dos alvos limpo

D016 MUTATION [tests_016_mutants.js]: 33/33 mutantes detectados pelo gate e motivo esperados · controles: 3 ok · 0 falho(s)
```

Os outros 26 mutantes reproduzem as linhas de §2 (M22 agora imprime `contagem: 34 fixture(s) · 35 caso(s) · total pinado 35`).
Na 1ª execução, sobre a árvore de trabalho ainda não commitada, o fecho dizia `porcelain dos alvos SUJO → M
.claude/verify/check_fecho.py` (o gate em edição — a campanha exige alvos limpos, e por isso o número que vale é o da reexecução).

### 9.5 Bateria negativa dos julgadores novos (cópia efêmera do harness, `MUTANTS` trocado; apagada; nada commitado)

```text
SOBREVIVENTE  N7-noop-leitor · NEGATIVO: ler_merges intacto (só comentário) — a guarda de censo NÃO pode acusar
              gate esperado: D016-FEC1 D016-FEC2 (guarda de censo) · exit 0/0 (esperado 1) | censo.estado: esperado divergente · obtido ok | censo.lido: esperado 0 · obtido 39 ‖ censo lido 39 × pinado 39 (ok) · 0 problema(s) de julgamento · exit 0
SOBREVIVENTE  N8-criacao-sem-valvula · NEGATIVO: planning-state sintético 999 SEM válvula — EM VOO legítimo, 0 problema(s); o julgador NÃO pode matar
              gate esperado: D016-FEC4 · exit 0/0 (esperado 1) | problemas: esperado 1 · obtido 0 | sujeito 999-sintetica-d016: não casou · real: 999-sintetica-d016: EM VOO (fase implement) ‖ 0 problema(s) · acusados: nenhum
SOBREVIVENTE  N9-noop-formato · NEGATIVO: cláusula de formato intacta (só comentário) — F24 NÃO pode divergir
              gate esperado: D016-FEC4 · sonda não reprovou (exit 0, ok=true)
SOBREVIVENTE  N10-censo-valor-errado · NEGATIVO: a mutação de M33 com expectativa lido = 1 (real: 0) — valor errado no campo certo
              gate esperado: D016-FEC1 D016-FEC2 (guarda de censo) · censo.lido: esperado 1 · obtido 0 ‖ censo lido 0 × pinado 39 (divergente) · 0 problema(s) de julgamento · exit 1
NÃO EXECUTADO  N11-criacao-sobre-existente · NEGATIVO: `criar` apontando para arquivo que EXISTE (planning-state 016) — tem de sair NÃO EXECUTADO, nunca escrever por cima
              gate esperado: D016-FEC4 · causa: âncora não encontrada · 016-registro-contra-execucao.json=0
CAMPANHA NÃO CONCLUÍDA [tests_016_mutants.js]: 0 detectados · 4 sobreviventes · 1 não executados (de 5) · controles: 3 ok · 0 falho(s)
```

O planning-state 016 ficou byte-idêntico (sha256 antes = depois) e `999-sintetica-d016.json` não existe ao fim.

### 9.6 Stage `mutation` e `run.sh --light` (sobre `9fe57f0`)

`check_mutation.py`, árvore limpa: `IC-4: d016: 33 âncora(s) com ocorrencias == 1 (preflight, C1)` · `integridade: 0 problema(s)` ·
as outras dez campanhas "nenhum alvo mudou" · `[RUN] d016` → `33/33 … controles: 3 ok` · `não-KILL: nenhum — os 33 mutante(s)
lidos estão DETECTADO` · **`mutation: 1 campanha(s) executada(s) · 0 problema(s)`**, exit 0, porcelain vazio.

`bash .claude/verify/run.sh --light`: **11 PASS · 1 FAIL** — `env-doctor`, `boundary`, `marker-lint`, `icons-check`, `build`, `lint-arch`,
`regra-morta`, `state`, `tdd`, **`fecho`**, `m41` PASS; **`baseline` FAIL** por desenho até o repin (R8 §1): pins divergentes em
`check_fecho.py`, `fecho.json`, `mutation_map.json`, `pipeline.yaml`, `tests_016_mutants.js` e sem pin em `F24.json`/`P11.json` (esta
iteração) — e também em `design-decisions.md`, `planning-state.schema.json`, `plan.md`, `refinement.md`, `spec.md`, `docs/adr/0001-…` e
`spec-validate.md`, que entraram por `d130a04` ("errata E4"), não por esta iteração. O repin é do orquestrador/`build-engineer`.

### 9.7 O que a guarda de censo NÃO cobre, e o que não foi medido

- **Leitor que perde merges POSTERIORES ao piso**: o censo pós-piso é variável (0 hoje) e não se pina; na árvore de hoje esse leitor é
  indistinguível de "0 merges após o piso" por qualquer asserção do stage. Carrasco **só na campanha** (M18/M19 sobrevivem sob esse leitor).
  Registrado em `mutation-matrix.json → dividas_declaradas`, com a razão medida.
- **CI**: nada disto rodou no CI — a branch continua sem push e sem PR (T041). `run.sh` completo (com `suites`/`suites-heavy`/`evidence-bridge`)
  não foi reexecutado nesta iteração: nenhum arquivo de suíte ou de produto mudou; a regressão congelada é a de §4 do `spec-validate`.

## 10. Fase 6 — A1 do `spec-validate`: o eco do controle (2026-09-04, errata E016-7)

Clone efêmero de `9a460f5` no scratchpad, `refs/remotes/origin/develop` posto em `921977c` (o SHA do remoto), `node_modules` por junction;
nada tocado na worktree. Os quatro vermelhos são formas de C0-fecho FALHOU que a nota tem de distinguir.

### 10.1 RED — harness e stage de HEAD

| cenário | C0-fecho · nota emitida por HEAD | mutante(s) | o que falta |
|---|---|---|---|
| S0 controle (campanha inteira) | `OK · sonda 35/35 · 11 demanda(s) · 0 problema(s) · censo da leitura 39/39 (ok) · exit 0 · origin/develop 921977c25e76 · data do commit 2026-09-04` | 33/33 · 3 controles ok · 22 s | — |
| S2 `F99.json` extra (metade da SONDA) | `FALHOU · sonda 35/35 · undefined demanda(s) · undefined problema(s) · censo da leitura undefined/undefined (undefined) · exit 1 · origin/develop ? · data do commit undefined` | M18 `NÃO EXECUTADO` · nota constante; **M1 `DETECTADO`** (divergentes 13/35) | `undefined` ×5; a metade não é nomeada; `julgaSonda` não pina isolamento — um C0 vermelho não localiza a falha numa metade |
| S1 `origin/develop` apagado só no clone (metade da ÁRVORE) | `FALHOU · sonda 35/35 · 11 demanda(s) · 1 problema(s) · censo da leitura 0/39 (nao_aplicado) · exit 1 · origin/develop ? · data do commit 2026-09-04` | M18 `NÃO EXECUTADO` · nota constante | o global (`origin-develop-ausente`) não é nomeado |
| S3 `check_fecho.py` quebrado (JSON ausente) | `FALHOU · stdout não é o JSON do gate (Unexpected end of JSON input)` | idem | sem exit, sem stderr |
| S4 `origin/develop` = `6dad53d` (piso fora da cadeia) | `FALHOU · sonda 35/35 · 11 demanda(s) · 1 problema(s) · censo da leitura 0/39 (nao_aplicado) · exit 1 · origin/develop 6dad53d3423b · data do commit 2026-09-04` | idem | o global (`piso-invalido`) não é nomeado |

Stage de HEAD sobre essas cinco saídas (funções `mut_ler`/`mut_relata` extraídas por AST de `HEAD:.claude/verify/check_mutation.py`):
**nenhuma linha `CONTROLE`/`resultado:` ecoada em nenhum cenário** — o tail de 2 linhas devolve `CAMPANHA NÃO CONCLUÍDA …` e a última entrada
`NÃO EXECUTADO … nota constante`. É o log do job `visual` do run `33927191969`.

### 10.2 O que mudou

- `tests_016_mutants.js`: `julgaControle` nomeia a metade que falhou (SONDA / ÁRVORE), cobre `vivo: null`, JSON ausente (exit + última linha
  do stderr), `erro_de_leitura`, globais e acusados, e nunca imprime `undefined`; `baseline[modo]` passa a `{ok, id, nota}`; `notaBaseline()`
  nos três pontos (mutantes `ARVORE`, mutantes `SONDA_BP`, controle positivo "não medido").
- `check_mutation.py`: `RE_CTRL_LINHA`/`RE_CTRL_RES`, `mut_controles()` (pura), `mut_relata_controles()` (eco + `LEITURA PARCIAL` contra
  `controles` do preflight + teto 15), chamada após o tail e antes de `mut_relata`. `fails` intocado.

### 10.3 GREEN

- S0: 33/33 · 3 controles ok (a nota do C0-fecho ganha `falhas 0`).
- S2: `FALHOU · metade que falhou: SONDA (árvore NÃO julgada, vivo: null) · sonda 35/35 · falhas 0 · guarda: fixture sem caso no registro: F99.json | contagem: 36 fixture(s) · 35 caso(s) · total pinado 35 · exit 1`
- S1: `FALHOU · metade que falhou: ÁRVORE · sonda 35/35 · falhas 0 · 11 demanda(s) · 1 problema(s) · globais: origin-develop-ausente · acusados: origin-develop-ausente: NÃO DETERMINÁVEL (refs/remotes/origin/develop ausente — git fetch origin develop) · censo da leitura 0/39 (nao_aplicado) · exit 1 · origin/develop ausente · data do commit 2026-09-04`
- S3: `FALHOU · stdout não é o JSON do gate (Unexpected end of JSON input) · exit 1 · stderr: SyntaxError: invalid syntax`
- S4: `FALHOU · metade que falhou: ÁRVORE · … · globais: piso-invalido · acusados: piso-invalido: NÃO DETERMINÁVEL (piso 921977c25e76 ausente da cadeia first-parent de refs/remotes/origin/develop — um SHA de outra branch não é piso) · censo da leitura 0/39 (nao_aplicado) · exit 1 · origin/develop 6dad53d3423b · …`
- Em todos, o `NÃO EXECUTADO` de M18 carrega `· controle C0-fecho · resultado: FALHOU · <a nota acima>` — na linha `gate esperado:` e na lista de fecho.
- **Bateria unitária do leitor: 29 verificações · 0 falhas** — 5 cenários reais × 4 (HEAD não ecoa; o novo ecoa cada bloco; C0-fecho lido
  como FALHOU com nota; `mut_ler` idêntico em HEAD e no emendado) + 9 sintéticos: `CONTROLE` sem `resultado:` na linha seguinte;
  `CONTROLE` na última linha; linha indentada / no meio do texto / bloco de mutante não casam; harness sem controles (p50) ⇒ nada; 1 bloco
  contra 3 declarados ⇒ `LEITURA PARCIAL` com os ids; 0 contra 3 ⇒ nomeado; preflight `None` ⇒ ecoa `FALHOU · razão`; 17 controles ⇒ 15
  + sobra nomeada; `resultado: TALVEZ` (fora do vocabulário) não é lido como OK nem FALHOU.
- **Stage `mutation` inteiro no clone, com `F99.json` commitada só lá** (árvore limpa): `IC-4: d016: 33 âncora(s)` · `[RUN] d016` →
  tail (2 linhas) → `controle: C0-fecho · FALHOU · metade que falhou: SONDA (…F99.json…)` · `controle: C0-protecao · OK · …` ·
  `controle: D016-M24/positivo · FALHOU · baseline vermelho — não medido · controle C0-fecho · resultado: FALHOU · …` →
  `não-KILL: 13 de 33 mutante(s) lido(s) · 20 KILL ficam na contagem` (M18–M28, M32, M33, cada um com a nota do controle) →
  `mutation: 1 campanha(s) executada(s) · 1 problema(s)`, exit 1. A forma exata do log do job `visual`, agora com a razão. Clone resetado
  (`git reset --hard 9a460f5`, porcelain vazio, `F99.json` inexistente).

### 10.4 O que NÃO foi medido

- ~~**A causa do run `33927191969`** continua desconhecida: este instrumento a dirá na próxima execução do job `visual`, se o vermelho se
  repetir. Nada aqui a atribui (R2 §3).~~ **[2026-09-05: o instrumento disse (runs `33933887655` e `33935247512`) e a causa foi
  isolada por execução — §11.]**
- O CI não rodou este HEAD; o pipeline completo local está registrado no relato do agente, não aqui.

## 11. A1 — causa isolada: o runner do Playwright torna o clone raso no piso, só sob `pull_request` (2026-09-05)

Pergunta do orquestrador: por que `ler_merges` devolve 0 sob checkout de `refs/pull/N/merge` com `origin/develop` presente e no SHA
certo — e, mais importante, por que devolve 0 **sem dizer que não conseguiu caminhar**. Método: réplicas do checkout do CI
(`git init` + `remote add` + o `fetch` literal da linha 101 do log + `checkout --progress --force refs/remotes/pull/40/merge`), uma
em Linux (WSL Ubuntu, git 2.53.0, python 3.14.4, node 22.23.2, `npm ci`, Chromium `1234` do cache do Playwright) e uma em
Windows (git 2.55.0.windows.4, python 3.14.7, node 24.19.0, `NODE_PATH` da worktree, Chrome local por `CHROME_PATH`, shim de
preload só para a `tests_011_chromium.js`). Nada tocado na worktree; as duas réplicas foram apagadas ao fim.

### 11.1 O que o CI já dizia, lido de novo com os pares certos

| run | evento | head | job `visual` — `C0-fecho` | job `verify` — stage `fecho` |
|---|---|---|---|---|
| `33927191969` | `pull_request` | `ebe0b22` | 13 `NÃO EXECUTADO`, nota constante (pré-E016-7) | `[PASS]` (16 PASS) |
| `33930617469` | `pull_request` | `a2f15b3` | 13 `NÃO EXECUTADO`, nota constante | — |
| `33933887655` | `pull_request` | `5df74c2` | `FALHOU · metade que falhou: ÁRVORE · sonda 35/35 · falhas 0 · 11 demanda(s) · 0 problema(s) · censo da leitura 0/39 (divergente) · exit 1 · origin/develop 921977c25e76 · data do commit 2026-09-05` | `[PASS] fecho` · `[PASS] mutation` |
| `33935247512` | `pull_request` | `0b774b3` | idem | `[PASS] fecho` · `[PASS] mutation` |
| `33933884597` | `workflow_dispatch` | `5df74c2` | `OK · … censo da leitura 39/39 (ok) · exit 0 · … data do commit 2026-09-04` | — |
| `33937833002` | `workflow_dispatch` | `0b774b3` | job `success` (nota não lida: `run.sh` não ecoa PASS) | `success` |

Constantes conferidas nos quatro jobs comparáveis (`visual`/`verify` de `33935247512`, `visual` de `33933887655` e de `33933884597`):
imagem `ubuntu-24.04 20260831.293.1`, `git version 2.55.0`; grupo de checkout do `visual` e do `verify` do mesmo run **idêntico**
linha a linha (salvo o nome do arquivo temporário de credenciais); `git version 2.55.0` impresso de novo pelo `check_mutation.py` às
01:17:04 (o `apt-get` do `visual` não trocou o git); saída das suítes idêntica PR × dispatch (67 passed/37 skipped, 27/27, 55/55, 1/1;
só a ordem dos workers difere). Conclusão de leitura: o checkout **não** é a causa (o `verify` lê a cadeia inteira 7 s depois dele);
a diferença está no que o `visual` executa entre `01:09:09` e `01:17:02` — o passo "Suítes visuais" — e é sensível a `pull_request`.

### 11.2 O vetor, no código instalado

`node_modules/playwright/lib/runner/index.js` (`playwright` 1.62.1): `addGitCommitInfoPlugin` (`:641-642`, registrado em `:6606` e
`:6648`) → `gitCommitInfoPlugin` (`:652-676`): com `fullConfig.captureGitInfo?.diff === void 0 && ci` (`:669`) chama `gitDiff(configDir,
ci)`; `ciInfo()` (`:679-693`): sob `GITHUB_ACTIONS`, lê `GITHUB_EVENT_PATH` e devolve `prBaseHash: json.pull_request.base.sha` (só
existe se o evento tem `pull_request`); `gitDiff()` (`:759-763`):

```
await runGit(["fetch", "origin", ci.prBaseHash, "--depth=1", "--no-auto-maintenance", "--no-auto-gc", "--no-tags", "--no-recurse-submodules"], gitDir);
const diff3 = await runGit(["diff", ci.prBaseHash, "HEAD"], gitDir);
```

No PR #40, `pull_request.base.sha = 921977c25e76fe0ed19dae74e17921d37c711ff0` — **o piso**. `git fetch --depth=1` de um commit já
presente grava `.git/shallow` com ele: a cadeia first-parent de `origin/develop` passa a ser `[921977c]` sem pais. `%P` vazio ⇒
`len(pais) < 2` ⇒ o piso é achado na posição 0 (`piso_na_cadeia: true`) e nenhum merge é contado (`merges_ate_piso = 0`).

### 11.3 Réplica Linux — passo a passo

| passo | `.git/shallow` | `git log -1 --format=%P 921977c` | `rev-list --count --first-parent origin/develop` | gate nu |
|---|---|---|---|---|
| após o checkout do CI | ausente | `49388e1f… 452df467…` | 67 (39 merges até o piso) | `até o piso, inclusive: 39 · censo pinado: 39 (ok)` · `0 problema(s)` · exit 0 |
| `git checkout -- docs_phase5/` + `node tests_016_mutants.js` | ausente | 2 pais | 67 | `33/33 · controles: 3 ok · 0 falho(s)`; `C0-fecho · OK · 39/39` |
| `playwright test tests_visual/screen.spec.js -g "V3 zero console" --project=d1920` (1 teste, `1 passed`) sob `CI=true GITHUB_ACTIONS=true GITHUB_EVENT_NAME=pull_request GITHUB_EVENT_PATH=event.json GITHUB_SHA=3891999… GITHUB_REF=refs/pull/40/merge GITHUB_REPOSITORY=… GITHUB_SERVER_URL=… GITHUB_RUN_ID=1`, com `event.json = {"pull_request": {"number": 40, "base": {"sha": "921977c…"}, …}}` | **`921977c…`** (41 bytes; `git rev-parse --is-shallow-repository` ⇒ `true`; sem grafts, sem `refs/replace`) | **vazio** — e `git cat-file -p 921977c` segue com as duas linhas `parent` | **1** | `[INFO] merges first-parent após o piso: 0 · até o piso, inclusive: 0 (não julgados) · censo pinado: 39 (divergente)` · `[FAIL] guarda de censo da leitura: … lidos 0 ≠ censo pinado 39 … leitor mudo ou histórico incompleto` · `fecho: 11 demanda(s) · 0 válvula(s) · 0 problema(s) · guarda de censo da leitura: FAIL` · exit 1 |
| idem, `check_fecho.py --json` — **o red do leitor** | `921977c…` | vazio | 1 | `vivo._leitura.origin_develop = {"presente": true, "sha": "921977c…", "causa": null, "piso_na_cadeia": true}` · `contagens = {demandas 11, problemas 0, merges_apos_piso 0, merges_ate_piso 0, em_voo 11, …}` · `globais []` · `problemas []` · `exit 1` — as dez `done` mescladas saem `EM VOO` (a mensagem não acha merge e `merge-base --is-ancestor` responde `False` sobre a cadeia truncada), sem uma linha que diga por quê |
| idem, harness `D016_MUT_ONLY=D016-M18` | `921977c…` | vazio | 1 | `C0-fecho · resultado: FALHOU · metade que falhou: ÁRVORE · sonda 35/35 · falhas 0 · 11 demanda(s) · 0 problema(s) · censo da leitura 0/39 (divergente) · exit 1 · origin/develop 921977c25e76 · data do commit 2026-09-05` — **byte-idêntica à do CI**; M18 `NÃO EXECUTADO` com essa nota |
| reparo 1: `git fetch origin +refs/heads/develop:refs/remotes/origin/develop` (sem `--depth`) | **persiste** | vazio | 1 | — (um "fetch de novo" não conserta) |
| reparo 2: `git fetch --unshallow origin` | ausente (`is-shallow-repository: false`) | 2 pais | 67 | `39 (ok)` · `0 problema(s)` · exit 0 |
| direção do remédio: mesma execução do `playwright test` sob as mesmas variáveis, com `captureGitInfo: { commit: false, diff: false }` acrescentado a `playwright.config.js` (edição efêmera na réplica, restaurada: porcelain 0) | ausente | 2 pais | 67 | `39 (ok)` · `0 problema(s)` · exit 0 |

### 11.4 Réplica Windows — controle negativo e mecanismo sem Playwright

| passo | `.git/shallow` | gate nu |
|---|---|---|
| após o checkout do CI | ausente | `39 (ok)` · exit 0 |
| `playwright test` (60 passed · 1 failed · 37 skipped — ambiente não-canônico), **sem** variáveis do GitHub | nunca nasce | `39 (ok)` |
| `tests_p50_chromium.js` (24/3), `tests_p52_chromium.js` (50/5), `tests_011_chromium.js` via shim (1/0), `git checkout -- docs_phase5/` | nunca nasce | `39 (ok)` após cada uma |
| `python .claude/verify/check_mutation.py` (passo literal do CI) | nunca nasce | `[RUN] d016` · `C0-fecho · OK · … 39/39 (ok)` · `D016-M24/positivo · OK` · `não-KILL: nenhum — os 33 mutante(s) lidos estão DETECTADO` · `mutation: 1 campanha(s) executada(s) · 0 problema(s)` · exit 0 |
| à mão, o comando do Playwright: `git fetch origin 921977c… --depth=1 --no-auto-maintenance --no-auto-gc --no-tags --no-recurse-submodules` | `921977c…` (`is-shallow=true`; objeto cru com 2 pais; `%P` vazio; first-parent count 1) | leitor `{presente: true, causa: null, piso_na_cadeia: true}` · censo `divergente` lido 0 · `0 problema(s)` · exit 1 |
| `git fetch --unshallow origin` | ausente | `39 (ok)` · `0 problema(s)` · exit 0 |

Os FAIL das suítes no Windows são do ambiente não-canônico (Chrome 152 em vez do Chromium gerenciado; sem poppler) e não entram em
contagem alguma (KI-3): o que este experimento mede é o `.git`, e ele não mudou.

### 11.5 O que fica

- **EA-38** (vetor): o job `visual` deixa o `@playwright/test` mutar o `.git` entre o checkout e a campanha, e a guarda de "árvore
  limpa" do `check_mutation.py` (`git status --porcelain`) não vê `.git/shallow`. Remédio provado na linha "direção do remédio"
  de §11.3: `captureGitInfo: { commit: false, diff: false }` em `playwright.config.js` (pinado ⇒ repin no mesmo PR). Dono:
  `build-engineer`. Um passo `git fetch --unshallow` antes da campanha trataria o sintoma (e falha num repositório completo: exige
  guarda por `git rev-parse --is-shallow-repository`) — o remédio na configuração trata a causa.
- **EA-39** (o que importa mais): o leitor não distingue "não há merges" de "não consegui caminhar". Sob histórico raso,
  `ler_merges` (`fecho.py:459-503`) devolve `piso_na_cadeia: true`, `causa: null`, `merges: []`; `ler_ancestralidade`
  (`:516-543`) responde `False` para os dez `red.commit`; o julgador (`_impedimento`, `:176-190`) não tem impedimento para
  isso e julga com 0 problema(s); só a guarda de censo (`check_fecho.py:374-397`) reprova, com um detalhe **disjuntivo**. Este é
  o **red da metade de I/O** (as duas linhas "red do leitor"/"à mão" acima, nos dois SOs). O remédio muda veredito (impedimento
  novo, código do vocabulário fechado T10 ou `piso-invalido` com detalhe nomeado; fixture pura F25 como carrasco permanente, como
  F20–F22) — decisão de `product-owner`/`tech-lead`, implementação em `fecho.py` do `core-engineer`; o red da metade pura se
  escreve quando a forma estiver decidida.
- **O que não foi medido**: um run `pull_request` com `visual` verde — não existe antes do remédio de EA-38 e de um novo push.
