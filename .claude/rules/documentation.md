# R12 — Documentação

Severidade: **processo**; itens marcados são auditados por máquina.

## Idioma e nomes

Documentação, relatórios e comentários em **PT-BR**. Nomes de código, funções,
IDs, enums e mensagens de commit seguem o artefato (INV-10). Arquivos de doc em
inglês-minúsculas-hífen quando o nome é identificador consumido por script.

## Templates obrigatórios

Artefatos de demanda usam `.claude/templates/`: `refinement.md`, `spec.md`,
`plan.md`, `tasks.md`. Relatório sem template vira o pântano de 43 formatos que
`docs_phase5/` é hoje. Índices são **gerados**, nunca editados à mão.

## Glossário — `CONTEXT.md`

Vocabulário canônico do domínio, na raiz. Só glossário; formato por termo:

```md
**Termo**:
Definição em uma ou duas frases — o que o conceito É.
_Evitar_: sinônimo-a, sinônimo-b
```

Mantido pelo `product-owner` na Fase 0. Termo novo, vago ou em conflito é
resolvido ANTES do portão do refinamento. Doc, spec e prompt novos usam o termo do
glossário. Termo que falta lá é sinal: linguagem inventada (reconsiderar) ou
lacuna real (registrar).

**Verbete define por CRITÉRIO, nunca por lista** (`EA-47`, 2026-09-14). Definição
que enumera casos envelhece em silêncio: quando a fonte ganha um item, a lista do
glossário fica errada sem que nada mude nela. O verbete diz **o que faz um caso
pertencer**; a lista canônica vive na fonte executável e é **referenciada**, não
copiada. Instância que pagou: o verbete *Insumo de prova* copiou cinco das seis
razões de classe da 017, contra a decisão escrita no refinamento dela, e ficou sem
a sexta.

**Item em `§Não mudam` não se certifica por diff vazio** (`EA-47`). `git diff`
vazio prova que o arquivo **não mudou** — nunca que ele **continua certo**. Na
Fase 6, item declarado imutável exige releitura do conteúdo contra a decisão de
origem; foi assim que o `spec-validate` da 017 certificou como conforme um verbete
que a própria demanda tinha tornado obsoleto.

## Achados e backlog

Achados vão ao backlog com **id permanente** (números citados nunca renumeram;
inserção tardia ganha sufixo de letra). Cada achado cita a cadeia
arquivo:linha→efeito que o produz — achado sem cadeia é palpite. Refutado fica
riscado com a razão (R2 §5). Decisão confirmada vai para
[`design-decisions.md`](design-decisions.md).

## ADRs

Decisão **difícil de reverter** + **surpreendente sem contexto** + **fruto de
trade-off real** → `docs/adr/NNNN-slug.md` (template em `.claude/templates/adr.md`).
Faltando qualquer um dos três, não é ADR. A regra diz "não reporte"; o ADR diz
"por que se escolheu assim" — quando coincidem, a regra aponta para o ADR.

## O que é gerado e não se edita à mão

| Arquivo | Gerado por |
|---|---|
| `quickscan_secops_soccmm_v3_2_dev.html` | `build_v32_html.py` |
| `ui_icons_v32.js` | `generate_icons_v32.py` |
| `.claude/verify/pins.json` | `gen_pins.py` |

Alterar a lógica no script, nunca a saída.
