**Não recomendo selar a candidata neste estado.** Há dois defeitos reproduzidos que alteram silenciosamente a curadoria do relatório, além de uma falha no agregador capaz de produzir falso verde. O engine congelado e a reprodução determinística do HTML permaneceram íntegros nas verificações executadas.

**Sumário executivo — 10 linhas**

1. Auditado o HEAD `ba771348fa48bb416166eed2584f73113b158017`, branch `chore/selagem-v3.2.11`; nenhuma alteração realizada.
2. **Alta:** selecionar um arquivo para importação já altera a curadoria; cancelar ou rejeitar a importação não restaura o estado anterior.
3. **Alta:** importar uma sessão sem curadoria ou iniciar “Nova sessão” preserva escolhas anteriores, modificando inclusive o relatório destinado à impressão.
4. **Alta:** o agregador de suítes aceita processos terminados com erro quando o resumo impresso contém as contagens esperadas.
5. **Alta:** o `guard-data` recomenda um comando composto cujo staging ocorre depois da inspeção; o parser também perde comandos com operadores colados.
6. **Média:** a verificação do build abre `ui_icons_v32.js` para escrita na árvore, contrariando R7.
7. **Média/baixa:** o README conserva instruções de distribuição incompatíveis com v3.2.11; três IDs citados não têm verbete no backlog.
8. Os números canônicos da selagem **conferem: 19 arquivos, +10.739/−422**, com zero alteração no engine.
9. Não confirmei XSS, telemetria automática, persistência de navegador ou segredo nas buscas realizadas; isso não equivale a certificação de ausência.
10. Seis suítes passaram em **103/103 testes**, mas os defeitos de curadoria coexistem com esses resultados verdes.

**Achados confirmados por execução**

As sondas abaixo trabalharam em memória. Quando houve instrumentação ou simulação, isso está explicitado.

| ID | Severidade | Arquivo:linha — cadeia de evidência | Descrição | Como reproduzir/verificar | Recomendação |
|---|---|---|---|---|---|
| **CX-01** | **alta** | [ui_session_v32.js:693](ui_session_v32.js:693) → [ui_session_v32.js:240](ui_session_v32.js:240) → [ui_curation_v32.js:188](ui_curation_v32.js:188); cancelamento em [ui_ux_v32.js:42](ui_ux_v32.js:42). | **A validação da importação modifica o estado ativo antes da confirmação.** `validateSessionDocument()` chama `fromSession()`, que limpa e preenche a curadoria. A prévia vem depois. Cancelar apenas fecha o modal. Erro posterior de validação ou incompatibilidade de engine também deixa a alteração aplicada. O snapshot de rollback, em `ui_session_v32.js:607`, é posterior à corrupção. | Excluir FortiAnalyzer na sessão atual; selecionar JSON que o inclua. **Com a prévia ainda aberta, o estado já mudou para `include`; Cancelar mantém a mudança.** Repeti com `assessment` ausente e com SHA de engine incompatível: ambos rejeitados, ambos alterando a curadoria. Fluxo do picker e botão Cancelar executado em jsdom. | Separar validação pura de aplicação; transportar curadoria no candidato isolado; escrever somente no commit confirmado, coberto por rollback. Testar cancelamento, validação tardia, incompatibilidade e falha durante commit. |
| **CX-02** | **alta** | [ui_session_v32.js:237](ui_session_v32.js:237), candidato em `:533` e commit em `:606`; [ui_ux_v32.js:23](ui_ux_v32.js:23); publicação em [ui_curation_v32.js:141](ui_curation_v32.js:141) e [ui_p52_support_v32.js:754](ui_p52_support_v32.js:754). | **Curadoria atravessa sessões e contamina o relatório seguinte.** Campo ausente não é aplicado ao owner; candidato e commit omitem curadoria. “Nova sessão” também não a limpa. Assim, o documento importado deixa de ser suficiente para reconstruir o resultado — violação concreta do contrato de INV-8, com consequência para INV-7. | Importei **o mesmo JSON**, com 15 respostas em nível 0 e sem `reportCuration`, em dois DOMs: um com exclusão anterior de FortiAnalyzer e outro novo. Ambos retornaram sucesso. Resultado: **0 versus 1 card na tela e 0 versus 1 no DOM de impressão**, após `beforeprint`. “Nova sessão”, pelo botão e confirmação, preservou e reexportou a exclusão. | Integrar curadoria a todo o ciclo de substituição/reset dos owners. Ausência no arquivo deve resultar em ausência de decisão declarada, sem herdar a sessão anterior. Comparar importação do mesmo arquivo sobre estados prévios diferentes, incluindo tela e papel. |
| **CX-03** | **alta** | [.claude/verify/check_suites.py:26](.claude/verify/check_suites.py:26), julgamento em `:28–41`, saída em `:60`; execução no CI em [.github/workflows/verify.yml:39](.github/workflows/verify.yml:39). | **O agregador ignora o código de saída do processo.** Só examina a última linha de stdout e as contagens. Uma suíte que imprime o resumo esperado e depois termina por erro pode ser aprovada. Alcança `suites` e `suites-heavy`. | Executei o agregador original com `subprocess.run` substituído em memória: **23 processos simulados com `returncode=87`, stderr `FATAL` e contagens corretas → stage exit 0, “0 problema(s)”**. Controle com contagens incorretas → exit 1, 23 problemas. Não estou afirmando que 23 suítes reais falharam nesta revisão. | Exigir simultaneamente código de saída zero e contagens válidas; apresentar stderr quando o processo falhar. Acrescentar contraprova específica ao agregador. |
| **CX-05** | **média** | [.claude/verify/check_build.py:25](.claude/verify/check_build.py:25) → [build_v32_html.py:36](build_v32_html.py:36) → [generate_icons_v32.py:36](generate_icons_v32.py:36); proibição em [.claude/rules/determinism.md:14](.claude/rules/determinism.md:14). | **A verificação do build escreve em arquivo versionado.** O HTML recebe destino temporário, mas o subprocesso do gerador continua abrindo `ui_icons_v32.js` na árvore com modo `w`. Comparar `git status` depois não transforma uma regravação em operação somente leitura. | Executei builder e gerador com aberturas de escrita interceptadas por buffers: foram capturadas **duas aberturas `w`**, uma para o HTML solicitado e outra para `ui_icons_v32.js` na raiz. Nenhum arquivo foi gravado. | Na verificação, usar o gerador em modo `--check` ou produzir todos os derivados fora da árvore. Manter a geração efetiva como operação explícita de build. |
| **CX-07** | **baixa** | [.claude/BACKLOG.md:5880](.claude/BACKLOG.md:5880), `:5998`, `:6723`; referências de produto em [ui_p52_workspace_v32.js:143](ui_p52_workspace_v32.js:143), `:665`, `:2428`; exigência em [.claude/rules/documentation.md:48](.claude/rules/documentation.md:48). | **EA-59, EA-60 e EA-63 são citados, mas não têm verbete no backlog.** Faltam descrição, status e cadeia no registro canônico. Isso é lacuna de rastreabilidade; não prova que as mudanças tenham sido feitas sem autorização. | Censo dos headings: **87 verbetes**, com lacunas exatamente **59, 60 e 63** entre EA-1 e EA-90. As referências existem tanto no backlog quanto no produto. O parser de status percorre os verbetes existentes e não resolve referências ausentes. | Registrar os três IDs já utilizados, preservando a numeração e documentando origem/disposição. Conferir referências EA-* sem destino. |

**Achados lidos — fluxo completo não executado**

| ID | Severidade | Arquivo:linha — cadeia de evidência | Descrição | Como reproduzir/verificar | Recomendação |
|---|---|---|---|---|---|
| **CX-04** | **alta** | Registro `PreToolUse` em [.claude/settings.json:54](.claude/settings.json:54); parser em [.claude/hooks/guard-data.sh:90](.claude/hooks/guard-data.sh:90), recomendação em `:184`, inspeção em `:189–191`. | **O comando recomendado pelo guarda pode contornar a inspeção de dados.** Em `git add cliente.session.json && git commit -m x`, o hook lê o índice antes do `add`; se estiver vazio, libera. Há ainda falha de tokenização: operadores colados fazem o parser perder o segundo comando. | **Executei somente o parser original, em memória:** `git commit -am x` foi recusado; o composto nominal retornou `commit` sem recusa; `git add cliente.session.json&&git commit -am x` retornou `nao-commit`. A sequência posterior decorre da ordem `PreToolUse` → comando. **Não executei staging, commit nem despacho real do hook.** | Separar staging e commit em chamadas distintas; recusar composições que alterem o índice antes de commitar na mesma chamada. Preferir também uma proteção no momento efetivo do commit. Registrar o vetor composto no EA-82, hoje aberto. |
| **CX-06** | **média** | [README.md:19](README.md:19), `:35`, `:37`, `:73–74`; gate em [tests_p52_layout.js:1756](tests_p52_layout.js:1756). | **O caminho de distribuição contradiz a versão anunciada.** O README declara v3.2.11 corrente sem GitHub Release, manda usar “o artefato da release” como byte-idêntico ao em uso, e orienta baixar `releases/latest` com nome `quickscan_secops_soccmm_v3_2_7.html`. O gate compara declarações de versão, mas não essa instrução de obtenção. | Conferir as quatro passagens no mesmo README. A contradição é local e objetiva. **Não consultei o destino remoto de `releases/latest` nem o deployment**, portanto não atribuo um comportamento atual específico ao servidor. | Indicar caminho, nome e identidade verificável do artefato realmente distribuído. Cobrir essa correspondência no gate documental. É uma manifestação concreta da família EA-64, que permanece aberta. |

A fuga dos dois defeitos de produto tem uma explicação verificável: [tests_019_curadoria.js:219](tests_019_curadoria.js:219) anuncia curadoria “recomputada na importação”, mas o corpo até `:246` não importa nem faz roundtrip. Verifica exportação, setter e ausência de derivados. A suíte passou em **14/14**. O teste de atomicidade existente, [tests_session_m48.js:282](tests_session_m48.js:282), utiliza uma fixture sem curadoria. Não é uma acusação genérica de testes fracos: é a parte prometida e ausente que permitiu esses defeitos.

**Cobertura das invariantes e do produto**

| Invariantes | Resultado desta revisão |
|---|---|
| **INV-1** | Engine sem diferença contra `c1e3649`; pins conferidos; HTML reproduzido em memória; M41 com payload idêntico ao snapshot e ao pin declarado. |
| **INV-2 e INV-3** | M41 exercitou nove cenários, incluindo insuficiência, ausência de respostas confirmadas e limite exato de suficiência. Não encontrei violação nesses cenários; não equivale à execução integral de seus gates. |
| **INV-4** | Nenhuma violação nova demonstrada na leitura. A suíte completa de engine não foi executada porque contém chamada ao builder que regrava arquivos. |
| **INV-5 e INV-6** | Suítes de alvo e refinamento executadas: **30/30 e 28/28**. Não tratei a assimetria conhecida de `setTarget` como novo defeito, respeitando R13. |
| **INV-7 e INV-8** | **CX-02 demonstra dependência indevida do estado anterior:** o mesmo documento importado produz publicações diferentes. Não encontrei serialização de scores como fonte de verdade; o defeito é a substituição incompleta das entradas. |
| **INV-9** | Boundary declarado coerente em **9/9 caminhos**. Isso comprova coerência dos arquivos declarados, não enforcement de todas as ferramentas/harnesses. |
| **INV-10** | Nenhuma violação nova demonstrada na documentação e relatórios examinados. Não realizei certificação linguística de todos os documentos. |

Nos pontos de entrada de texto examinados, encontrei escape explícito, como [ui_v32.js:356](ui_v32.js:356) e [ui_session_v32.js:726](ui_session_v32.js:726). **Não confirmei XSS.** As buscas nas fontes de produto não localizaram chamadas de `fetch`, XHR, WebSocket, beacon ou APIs de armazenamento de navegador. Os links externos encontrados são links explícitos ao catálogo; não os classifiquei como telemetria automática.

A falha de CX-02 é **retenção de estado em memória entre sessões**, não uso de `localStorage` ou outra persistência de navegador. A evidência de impressão é o DOM preparado por `beforeprint`, não uma inspeção de PDF renderizado.

**Selagem e backlog**

O comando solicitado foi executado exatamente no intervalo e escopo indicados:

```text
git diff --numstat c1e3649 0bd677c -- engine_v32.js build_v32_html.py quickscan_secops_soccmm_v3_2_dev.html 'ui_*.js' 'ui_*.css'
```

Resultado: **19 arquivos, +10.739/−422**. A tabela em [SELAGEM_V3_2_11.md:56](docs_phase5/SELAGEM_V3_2_11.md:56) está correta. Também conferem:

- HTML dev: **+5.373/−210**; engine: **zero linhas alteradas**.
- `USER_GUIDE.md`, separado: **+108/−24**.
- Novos módulos: **5 JS e 3 CSS**.
- Entrada pela primeira linha de ancestralidade examinada: **87 merges e zero commits diretos**.
- `0bd677c..HEAD`: somente os cinco caminhos documentais/de registro declarados.
- Backlog: **29 abertos**, em 87 verbetes existentes.

O registro distingue resultados históricos da candidata e declara verificações finais não executadas em [SELAGEM_V3_2_11.md:213](docs_phase5/SELAGEM_V3_2_11.md:213). Não converti esses resultados históricos em prova deste HEAD.

Na revisão dirigida dos status, **não confirmei outro caso novo de “resolvido” ainda defeituoso ou “aberto” integralmente corrigido**. EA-68 possui resíduo explicitamente registrado em EA-76; EA-65 recebeu nota corretiva; EA-64 continua corretamente aberto. CX-01, CX-02, CX-03 e CX-05 precisam de registro próprio; CX-04 e CX-06 ampliam famílias já abertas.

Respeitei R13: não reportei como defeitos a supressão total com aviso, a convivência de listas sob insuficiência, a ausência de apoio Fortinet nas prioridades, o MANIFEST aposentado ou a evidência binária histórica autorizada.

**Segurança do repositório**

A busca por padrões de credenciais percorreu **625 arquivos textuais rastreados**, sem ocorrência das assinaturas pesquisadas. Os **27 binários identificados são PNGs** do acervo histórico autorizado; não encontrei executáveis, PDFs ou ZIPs rastreados no estado atual. Isso não substitui análise de todas as imagens nem varredura do histórico Git.

O lockfile contém **44 dependências**, todas com URL do registro npm e integridade declarada. O workflow usa `npm ci --engine-strict` e mantém jobs separados de verificação, visual e fecho. **Não foi realizada consulta atualizada de vulnerabilidades**, nem validação remota de proteção de branches ou permissões efetivas do Actions.

**O que não consegui verificar e por quê**

- **Pipeline completo e campanhas de mutação:** contêm geração de arquivos, logs, temporários ou restauração de evidências. Não os executei sob a restrição recebida.
- **Chromium, acessibilidade visual e PDF final:** não executei suítes que criam perfis, capturas ou PDFs. Não há parecer de conformidade visual completo.
- **Despacho/enforcement real dos hooks:** o hook completo grava log; a sonda de CX-04 limitou-se ao parser.
- **Produção, releases, CI deste HEAD e proteção remota de branches:** não foram consultados. O estado local não prova esses estados externos.
- **Autorizações históricas e todos os 53 achados resolvidos:** não tive os chats de autorização nem reexecutei individualmente todas as correções.
- **Ausência absoluta de XSS, segredos ou dados de cliente:** buscas estáticas e cenários dirigidos têm alcance limitado; não houve fuzzing exaustivo, OCR dos PNGs ou análise completa do histórico.

**Pontos fortes objetivos**

- Baseline: **520/520 pins**, zero divergência, ausência ou arquivo sem pin; boundary: **9/9**.
- Duas reconstruções em memória produziram o mesmo HTML de **1.242.046 bytes**, idêntico ao blob de HEAD, SHA-256 `4c45ce20fece3bf024dd4a85b99a9766185f48039805ead45d0fe71700bf5712`.
- M41: **22 asserções PASS, nove cenários**, comparação funcional idêntica e hash correspondente ao pin.
- Seis suítes: curadoria **14**, alvo **30**, refinamento **28**, cobertura **8**, escalonamento **14**, leitura única **9** — **103 PASS, zero FAIL**.
- Sintaxe: **17 arquivos JavaScript** e **22 Python** verificados sem erro; marker-lint: **50 marcadores**, zero problema.
- O Git permaneceu limpo ao final. Nenhum arquivo foi alterado ou criado por esta auditoria.