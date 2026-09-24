# Spec — 021-cobertura-do-apoio

> Fase 1 · donos: product-owner + tech-lead · referencia o
> [refinement.md](refinement.md), não o repete.
>
> **Quem escreveu**: o orquestrador, **nos contratos do `product-owner` e do
> `tech-lead`** — os agentes de papel existem em `.claude/agents/` mas não estão
> disponíveis como subagentes nesta sessão (precedente da 018 e da 019).

## Objetivo

Fazer o relatório dizer **por onde começar** nos 11 gaps sobre os quais ele hoje
observa e cala — lendo o que a Camada 1 congelada **já declara**, sem inventar
conteúdo e sem tocar em arquivo `frozen`.

Desenho aprovado no portão da Fase 0 (**C**): a tabela escrita à mão vira
**exceção curada**; o `MAP` é o **padrão**.

## Critérios de aceite → gates

Namespace `D021-*`. Suíte nova `tests_021_cobertura.js`; mutantes em
`tests_021_mutants.js`. Contagem declarada entra em `expected_suites.json` **no
mesmo PR**, na wave de fecho, depois do green (errata E2 da 019, ratificada).

| # | Critério | Gate · asserção | Mutante previsto |
|---|---|---|---|
| C1 | **Zero regressão nos curados.** Os 4 qids da tabela renderizam exatamente o de hoje | `D021-CUR1` · para cada qid de `QS_GAP_SUPPORT`, o bloco lista **todas** as opções da tabela e **nenhuma** a mais; oráculo é a tabela | **M1**: a derivação passa na frente da tabela ⇒ CUR1 vermelho |
| C2 | **Cobertura completa.** Gap cujo qid tem candidato no `MAP` no nível respondido **recebe** bloco | `D021-COB1` · sessão com os 15 em nível 0 produz **15** blocos; nenhum gap com candidato fica mudo | **M2**: manter o `return ""` para quem não está na tabela ⇒ COB1 vermelho |
| C3 | **Silêncio só quando não há o que dizer.** Sem candidato ⇒ **sem bloco**, nunca bloco vazio | `D021-VAZ1` · com `lv[n].c` vazio, zero `[data-pr-gap-support]` para aquele qid — e a alínea (b) prova que a ausência é **daquele** qid, não da seção | **M3**: emitir bloco com lista vazia ⇒ VAZ1 vermelho |
| C4 | **A justificativa vem do `MAP`, não é inventada.** | `D021-FON1` · para cada opção derivada, o texto do "porquê" **é** o `c[].w` do `MAP`; nenhuma redação própria | **M4**: substituir o `w` por texto fixo ⇒ FON1 vermelho |
| C5 | **Nível respondido, nunca nível fixo.** | `D021-NIV1` · sessão com níveis **diferentes** por qid produz, em cada bloco, os candidatos do nível **daquele** qid | **M5**: ler sempre `lv[0]` ⇒ NIV1 vermelho |
| C6 | **Ancoragem declarada por bloco.** Bloco da tabela e bloco derivado partem de fontes diferentes e **dizem qual** | `D021-ANC1` · todo bloco tem `data-pr-gap-ancora` ∈ {`capability`,`nivel`}; o texto visível casa com o atributo; bloco derivado **não** repete o aviso de divergência da tabela | **M6**: marcar todo bloco como `capability` ⇒ ANC1 vermelho |
| C7 | **Tela e papel publicam o mesmo apoio.** | `D021-PAR1` · o conjunto de qids com bloco é **igual** na tela e em `#v32-print-report`, medido **após `beforeprint`** | **M7**: derivar só na tela ⇒ PAR1 vermelho |
| C8 | **Contexto não declarado continua "validar aderência".** | `D021-CTX1` · sem contexto, todo bloco — curado ou derivado — traz a ressalva; com contexto, traz o estado declarado | **M8**: recomendar sem contexto no ramo derivado ⇒ CTX1 vermelho |
| C9 | **A âncora normativa deixa de ser lista de nomes.** | `P51-REC1` emendado · `QIDS_AUTORIZADOS` passa a ser **derivado da fonte congelada** (os qids do `MAP` com candidato), não quatro literais | **M9**: reintroduzir a lista de quatro ⇒ P51-REC1 vermelho na cobertura nova |

> **C1 é o critério mais duro desta demanda.** O desenho **B** foi descartado no
> portão exatamente por violá-lo: derivar tudo estreitaria `detection-lifecycle`
> de quatro produtos para um. Se a implementação estreitar qualquer um dos
> quatro, ela **parou de ser o desenho aprovado**.

## Comportamento especificado

### A regra, em uma frase

> Para cada gap: **se o qid está em `QS_GAP_SUPPORT`, usa a tabela** (comportamento
> de hoje, intacto); **senão, deriva de `MAP[qid].lv[nível respondido].c`**;
> **se nem isso existir, não emite bloco.**

### Ancoragem — e por que ela precisa ser dita

O bloco da tabela parte da **capability**; o derivado parte do **nível
respondido**, que é a ancoragem **canônica** da sessão. Hoje o produto declara
essa divergência num aviso fixo (`EA-48`), escrito quando **todos** os blocos
eram da tabela.

Com duas origens, um aviso único mente para metade dos blocos. Cada bloco passa a
declarar a sua:

| origem | `data-pr-gap-ancora` | o que o bloco diz |
|---|---|---|
| tabela curada | `capability` | mantém o aviso de hoje — parte da capability, pode não coincidir, a canônica é a outra |
| derivado do `MAP` | `nivel` | **não** repete o aviso: ele **é** a ancoragem canônica |

Isto é `EA-48` aplicado com o cuidado que a mudança exige: **aviso que aparece em
tudo não distingue nada**, e aviso que diz a coisa errada é pior que aviso nenhum.

### O que NÃO muda

- **Nenhum arquivo `frozen`.** O `MAP` é lido; nunca escrito. Sem Porta B, sem
  repin de `declared.m41_payload_sha256`.
- **Score, estágio, suficiência, gaps e prioridades**: idênticos. Apoio é
  apresentação (INV-4 intacta).
- **As quatro entradas curadas**: texto, ordem e produtos como estão.
- **A ressalva de contexto não declarado**: *"validar aderência"* continua sendo
  a moldura quando o cliente não declarou ambiente.

## Contratos

### Superfície DOM

```
[data-pr-gap-support][data-pr-gap-qid="<qid>"][data-pr-gap-ancora="capability"|"nivel"]
  ├─ [data-pr-gap-cap]     capability canônica do motor (MAP[qid].cap) — inalterado
  ├─ [data-pr-gap-why]     por que apareceu — inalterado
  ├─ [data-pr-gap-fonte]   SÓ em ancora="capability" (o aviso do EA-48)
  └─ .pr-gapsup-list > [data-pr-gap-opt]  uma por candidato
```

O atributo `data-pr-gap-ancora` é **novo** e é o observável do `C6`. Nada mais na
superfície muda de nome.

### Fonte de dados

| origem | leitura | dono |
|---|---|---|
| tabela curada | `QS_GAP_SUPPORT[qid]` | `ui_v32.js` (§29.4 — autorização nominal) |
| derivada | `MAP[qid].lv[f.lvl].c` → `{p, w}` | Camada 1, **`frozen`, somente leitura** |

**Owner do estado (R9 §5)**: nenhum estado novo. Esta demanda não cria dado — ela
**lê** dois que já existem.

## Emenda da §UAT-07

Aprovada no portão da Fase 0 junto com o desenho C.

**Antes** — `tests_p50_core.js:3556`:

```js
const QIDS_AUTORIZADOS = ["detection-lifecycle", "logs", "automation", "vulnerability-management"];
```

**Depois** — a âncora deixa de ser uma lista de nomes e passa a ser a **fonte
congelada**: os qids do `MAP` que declaram candidato. O gate continua medindo as
**duas direções** — nada de apoio fora do autorizado, e nada do autorizado sem
apoio —, mas o conjunto autorizado deixa de apodrecer, porque ninguém o edita à
mão.

> **Isto não é afrouxamento (R10 §1).** A alínea que proibia apoio fora da lista
> continua existindo e continua reprovando; o que muda é **de onde vem a lista**.
> A prova de que não afrouxou é o `M9`: reintroduzir os quatro literais tem de
> deixar o gate **vermelho** na cobertura nova.

## Invariantes

**INV-7 reforçada** — o produto passa a derivar de evidência onde hoje silencia.
**INV-4, INV-1, INV-2, INV-3, INV-5, INV-6, INV-8, INV-9, INV-10**: não tocadas.

## Riscos declarados

1. **Estreitar um curado sem perceber** — é o `C1`, e o gate mede os quatro
   nominalmente.
2. **Duplicar produto entre bloco derivado e "pode fazer sentido"** — a lista
   secundária fica (decisão da 020). A redundância já é **decisão confirmada** em
   `design-decisions.md`; esta demanda não a agrava nem a resolve.
3. **Aviso de ancoragem errado** — é o `C6`, e o mutante `M6` mata a versão
   preguiçosa (marcar tudo como `capability`).
