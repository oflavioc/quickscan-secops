---
name: preflight-prova-unicidade-nao-sitio
description: IC-4 (ocorrencias == 1) prova que a âncora é única no arquivo, não que ela caiu no sítio certo — âncora única no lugar errado mata pelo motivo errado, e isso conta como SOBREVIVENTE
metadata:
  type: project
---

O `--preflight` dos harnesses conta ocorrências da âncora no arquivo-alvo. Verde
significa **uma** ocorrência — não significa que a mutação vai cair onde a
propriedade mora. Quando o arquivo tem cálculos quase-duplicados, as duas coisas
divergem, e o preflight fica verde num sítio errado.

Caso real medido (T017 da 013, 2026-08-29): a linha do agregado
`const overall = … Math.round(…)` é **byte-idêntica** em `ui_v32.js:131`
(`legacySnapshot`, invariante M43) e `:1026` (`buildPrintReport`). `M51-18`
defende só a segunda. Com a mutação em `:131`, `P51-RPT6` **reprova** — mas por
`"agregado da tela X != Y"` (`tests_p50_core.js:3075-3076`), mensagem que **não
casa** o `reason` do mutante. Pelo cabeçalho do harness
(`tests_p51_mutants.js:9`), reprovar por motivo diferente do esperado é
**SOBREVIVENTE**, não detectado. Âncora única + sítio errado = mutante que parece
saudável e não mede nada.

O complemento é barato e responde o que o preflight não responde: em cópia
efêmera, aplicar `src.replace(find, repl)` e imprimir a **primeira linha
divergente**. Duas medições, duas perguntas — contagem e posição.

**Why:** é a tese da própria demanda 013 um nível abaixo — instrumento que
reporta número sem ter medido a coisa certa. Um preflight verde sobre âncora
mal posicionada é exatamente a forma de mentira que IC-4 existe para matar.

**How to apply:** em toda triagem/reancoragem de âncora podre (T019 e as quatro
não triadas de `p50`/`p52`), exigir **as duas** provas antes de propor recorte.
Suspeitar sempre que o alvo for `ui_v32.js`: o mesmo agregado é recalculado em
`legacySnapshot`, `renderResults`, `computeTargetProfile` e
`buildNarrativeSnapshot`. Quando a unicidade precisar ser **construída**, prefira
o contexto que **documenta a propriedade** (o comentário `ERRATA B1` em
`:1022-1024`) ao contexto meramente adjacente — o adjacente é "casa e passa" com
outro nome, e apodrece pelo mesmo motivo que já apodreceu antes.
Ver [[medir-red-do-proprio-julgador]] e [[poder-discriminante-ic2-e-ic8]].

**Limite descoberto (W6b, 2026-08-29).** O oráculo de linha divergente responde
"onde caiu", mas quando a asserção que mata é **varredura do arquivo inteiro** ele
não basta: os dois sítios morrem com a mesma frase e a escolha tem de vir de fora
do gate. Ver [[triagem-de-ancora-ambigua]].

**Desfecho (T019, 2026-08-29).** As quatro âncoras da `p51` foram reancoradas e o
critério se sustentou sob execução: o recorte de `M51-18` ancorado no comentário
`ERRATA B1` levou a mutação a `:1026` (oráculo de linha divergente) e o gate
matou por `"0.5: KPI diz 'Inexistente' e o canônico é 'Inicial'"` — **não** por
`"agregado da tela"`, que seria a assinatura do sítio errado. `IC-4` foi de
`4 FAIL` na `p51` para `1 OK (20 âncoras)`; total do check de 10 para 6
problemas. Duas sondas de falsificação confirmaram que o verde não é tautologia:
um caractere a mais na `find` do harness ⇒ `ocorrencias=0`; a linha duplicada no
**alvo** ⇒ `ocorrencias=2`. Ver [[prova-c-em-camadas]] para a segunda via
independente de confirmação de sítio.


**E o preflight tambem nao prova ALCANCE.** `ocorrencias == 1` diz que a linha
existe e e unica; nao diz que **alguma fixture executa aquela linha**. Medido na
010 T021 (2026-08-30): `D010-M11` ataca a clausula de precedencia
`if (temCandidato) return ""`, com ancora perfeita no preflight — e **0 de 22**
praticas-alvo das cinco fixtures alcancam a linha, porque ela so e atingida em
S2-de-CONTEXTO (presence UNSET) e a unica capability com candidatos do acervo
esta em S3, de modo que a funcao retorna antes. O mutante saiu SOBREVIVENTE com
o gate PASSANDO — e o achado nao e o mutante: e que a alinea `D010-CARD2` (a)
passava por **estado**, nao por **gate** (a ausencia do no era explicada pelo S3,
nunca pela precedencia). Mesma classe da errata E5 da propria demanda, um
criterio adiante.

**A sonda e barata e vale antes da campanha**: para cada fixture, para cada
sujeito, imprima o predicado que **guarda a linha mutada** e conte quantos a
alcancam. Zero alcance = par sem caso, que se declara com causa (como M3/M4) em
vez de virar sobrevivencia inexplicada na primeira campanha.

**A mesma patologia dentro de um gate CONGELADO, e ninguem tinha preflight para
ela.** Na 010 (2026-08-31) o `P52-TGT4` escolhia a pagina do bloco assim:
`paginas.findIndex(p => /Perfil atual/.test(p.texto) && /Cenario-alvo/.test(p.texto))`
— **duas regex soltas**, sem exigir adjacencia nem a forma do titulo. Medido no
papel: sob gate ABERTO a regua de `#pr-journey` imprime "Perfil atual · Cenario-alvo"
e satisfaz as duas; ela fica IMEDIATAMENTE antes de `#pr-target` e carrega 5–6
nomes de estagio. Ou seja, o gate podia medir o SITIO ERRADO — e as duas
reprovacoes do CI cabiam nisso: falta o valor (a fatia comeca na regua e termina
no fim daquela pagina) e sobra estagio (os nomes da propria regua).
Sob gate FECHADO a regua nao publica "Cenario-alvo" e a ambiguidade some — que e
por que so um dos casos persistiu depois de a geometria ser restaurada.
Uma unica regex com a forma do titulo (`/Perfil atual\s*[×x]\s*Cenario-alvo/`)
casa **exatamente 1 vez** no papel inteiro, nas duas fixtures, e **nunca** a regua.

**Why:** ancora ambigua em MUTANTE o preflight pega (`ocorrencias == 1`). Ancora
ambigua em GATE nao tem preflight nenhum — e o custo aparece como vermelho
intermitente que todo mundo atribui a mudanca de conteudo.

**How to apply:** quando um gate seleciona um sitio por conteudo (`findIndex`,
`indexOf`, `querySelector` por texto), meça a **unicidade do seletor no
documento inteiro**, nas fixtures do proprio gate, antes de aceitar qualquer
diagnostico sobre o conteudo. Duas condicoes soltas ligadas por `&&` sao o cheiro:
elas casam qualquer regiao que mencione os dois termos por acaso. E desconfie
especialmente de legendas, reguas e sumarios — eles citam os nomes das secoes.

**Como se prova que o seletor novo nao ficou vacuoso, sem o navegador.** Corrigir
`findIndex` num gate de PDF tem um risco simetrico: seletor mais estrito que
nunca acha o sitio passa VACUOSAMENTE. A prova cabe em jsdom porque a **selecao
de sitio e funcao do TEXTO**, nao do layout:

1. renderize o papel real de **todas** as fixtures do gate (nao so as que
   falharam) e conte as ocorrencias do seletor novo no documento inteiro — na
   010 foi 1x em A/B/C e 0x em D, que nao tem a secao;
2. compare o desfecho **acha / nao acha** entre seletor velho e novo nas quatro:
   se algum caso mudar de "acha" para "-1", voce trocou um falso vermelho por um
   sensor cego;
3. **particione o texto em paginas sinteticas com o corte no PIOR lugar** (entre
   o sitio-impostor e o sitio-verdadeiro) e rode seletor+fatia+assercoes. Foi
   assim que ficou visivel que o velho selecionava p1 (a regua) e o novo p2 (o
   bloco);
4. rode a **sabotagem nas duas direcoes** sobre esse mesmo arranjo — apagar o
   valor que a assercao de presenca exige, injetar o termo que a assercao de
   ausencia proibe — e exija reprovacao nos dois.

A paginacao sintetica **nao** reproduz a real, e isso se declara: ela prova a
selecao de sitio e o poder discriminante, nao a geometria. A geometria fecha em
1 run de CI.

**E ao editar suite congelada sob autorizacao nominal restrita, prove o
NAO-TOCADO**: conte as ocorrencias dos sitios explicitamente excluidos em
`git show HEAD:<arquivo>` x arvore, e compare o corpo da funcao inteira com o
seletor e o comentario novo removidos dos dois lados. "So mexi no que podia" e
afirmacao; a contagem e evidencia.

**Quando a unicidade tem de ser CONSTRUÍDA porque o literal nasce em N ramos.**
Na 015 o nó de ancoragem é emitido com texto **idêntico** nos dois ramos de
`qsGapSupportHTML`: o texto sozinho casa `ocorrencias == 2` e nenhum mutante
podia usá-lo. O que separa os dois é a **INDENTAÇÃO** — 6 espaços num ramo, 4 no
outro —, então a âncora passa a carregar a quebra de linha e o recuo, e cada uma
volta a `ocorrencias == 1`. Dois ganhos, não um: a âncora fica legal *e* a
mutação passa a atingir **um ramo de cada vez**, que é teste mais forte, porque a
alínea é quantificada sobre TODOS os nós — violação parcial tem de reprovar, não
só a total. Antes de inventar contexto semântico, olhe se o gerador já
diferencia os sítios por forma.
