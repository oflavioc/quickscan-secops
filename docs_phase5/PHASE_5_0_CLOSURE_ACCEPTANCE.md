# PHASE 5.0 — REGISTRO DE ACEITE E ENCERRAMENTO

Registro único de aceite da **Microfase 5.0.5 — Accessibility, Responsive & Visual Closure** e do
fechamento da **Phase 5.0**, por ato do proprietário. Este documento **não reescreve a história**:
os relatórios de microfase e os pareceres permanecem como estão, e nada aqui altera bytes de runtime.

Data do ato: 2026-08-21 · Proprietário/auditor do projeto: Flávio Costa

---

## 1 · Identidades seladas

### Governança normativa

```text
spec normativa            specs/PHASE_5_0_REV_B.md
spec SHA-256              4f1583c733df62a9452aa7b218d962e40d781bb8d30dfc3179ad6e1ef004619b
promovida em              2026-08-19 · docs_phase5/REV_B_PROMOTION_RECORD.md
Phase 5.0 aberta em       2026-08-19 · docs_phase5/REV_B_PHASE_OPENING_RECORD.md
```

### Candidata

```text
baseline de ENTRADA da 5.0.5 (HTML)   d7c532097ac00548212085579c434e4dab69d14b7ed51ad86ab68377fd6cdb8c
HTML candidato FINAL                  c40d97358beaf52f286209b93143f74f4665011a1229f65015c2e6561efce09f
HTML candidato FINAL (bytes)          698.613
engine_v32.js                         9a4a2e674389a115a56c0bce9785ad0f90651546e31d264a947998e2bb5d247a
payload funcional M41                 9794b267e4225d8fa14f0f0d84aed0e2979658bfa2565b459788ef3b3ed4365b
relatório da microfase 5.0.5          f440ba36d8722d1b4b47f9bfb1d6b319ca5a4144cb1a36f0ed650d25a0d29211
package.json                          1c8d844d972ccb4a691d8c5b3c3d544d5b514bef68eb5187dbe60121164304c7
package-lock.json                     abe535af33ccd636a022c014af038cb5aa20294a23328595722246b1ca24f75f
```

O **engine** e o **payload funcional M41** permanecem byte-idênticos ao core congelado 4.8.0.7:
a Phase 5.0 inteira transcorreu sem tocá-los.

### Pareceres independentes importados

```text
docs_phase5/AUDITORIA_INDEPENDENTE_FECHAMENTO_PHASE_5_0.md
SHA-256   a69207287c7bfb0a37227aa254ecb4119a3086009e7ba8e1fb8f5fa98c97c1e6
28.855 bytes · 501 linhas · UTF-8 sem BOM · zero CRLF
veredito  PASS COM RESSALVAS NÃO BLOQUEANTES

docs_phase5/REVALIDACAO_INDEPENDENTE_PROVENIENCIA_PHASE_5_0.md
SHA-256   ba0e723ff35832af47acedfd93a242dc95974338f2faa2995d50c8047af9f95d
28.838 bytes · 455 linhas · UTF-8 sem BOM · zero CRLF
veredito  PASS COM RESSALVAS NÃO BLOQUEANTES — R1 ENCERRADA
```

Ambos os pareceres foram importados **byte a byte**, sem edição, e conferidos por `cmp` contra a
origem externa.

**R1 — ENCERRADA.** A ressalva de proveniência levantada no primeiro parecer (o parecer técnico fora
produzido pela mesma sessão que implementou a candidata) foi resolvida por **revalidação
verdadeiramente independente**, que reexecutou oráculos próprios, cenários próprios e mutações
próprias — distintas das do primeiro parecer — e confirmou o veredito.

---

## 2 · Decisão do proprietário

> Aprovo a candidata da Microfase 5.0.5 e o fechamento da Phase 5.0, com as ressalvas não bloqueantes
> registradas nos pareceres a6920728… e ba0e723f…. Considero R1 encerrada pela revalidação
> independente. Autorizo a selagem da candidata, commit, push, PR e merge controlado em main. Não
> autorizo ainda tag, release, publicação ou deployment.

---

## 3 · Ressalvas aceitas

Aceitas como **não bloqueantes**. Nenhuma exige correção nesta integração; nenhuma altera runtime.

| # | ressalva | classificação |
|---|---|---|
| **R2 / N5** | contraste mínimo observado **4,582:1** (`--faint` sobre `--surface2`) é **conforme** ao limiar de 4,5:1, embora com margem estreita; ambos os tokens são congelados | conforme, margem estreita |
| **R3** | a linha global de suficiência é neutra quando lida isoladamente, mas o painel completo nomeia o déficit por domínio, o veredito é explícito e os gates impedem contradição entre tela e estado canônico | nuance de redação |
| **R4** | browser nominal do ambiente difere do histórico da §25.6, **sem regressão observada** | ambiental |
| **R5** | o custo de execução do `P50-VIS10` é **operacional**, não funcional: o gate reexecuta de fato a regressão de print em vez de ler contagens anteriores | operacional |
| **N1** | em pergunta já respondida, `Espaço` abre o controle de evidência; `Enter` é consumido pelo avanço da superfície **congelada** | superfície congelada |
| **N2** | recorte residual de **4 px** no anel de foco de controles legados em 390 px, **sem recorte da caixa** do controle, com melhora de **24 para 16** ocorrências em relação à baseline | superfície congelada, melhorada |
| **N3** | **18 achados de contraste** em superfície **congelada**, idênticos à baseline pré-5.0.5 — não introduzidos pela Phase 5.0 | pré-existente, idêntico à baseline |
| **N4** | a camada de **Target congelada** pode aceitar alvo igual ao current, ou produzir gap agregado negativo quando o current é `NA`; **não é regressão da Camada 5** | superfície congelada · ver §4 |
| **N6** | as limitações do host Windows da revalidação (ausência de poppler; `CRLF` do `Path.write_text` em `generate_icons_v32.py` congelado) foram **cobertas pela auditoria técnica Linux/WSL2 anterior**, que é o ambiente canônico | ambiental, coberto |

Permanecem também as ressalvas já aceitas em fases anteriores e fora do escopo da Phase 5.0
(dependência de Git do `P50-PR1`; comparação por prefixo do `UG8`), não reabertas.

---

## 4 · Orientação operacional para N4

Enquanto não houver fase corretiva autorizada da camada de Target congelada, vale a seguinte
orientação **de uso**, que não altera runtime e não transforma N4 em blocker:

> Antes de entregar relatório ao cliente, revise Current × Target e não aceite Target agregado
> inferior ao Current. Em perguntas com Current `NA`, evite selecionar nível de Target que reduza
> artificialmente o agregado do domínio. Se houver gap negativo não intencional, corrija a seleção
> antes da exportação do relatório.

---

## 5 · Estado

```text
Phase 5.0 implementation complete:        true
Phase 5.0 independently audited:          true
Phase 5.0 candidate sealed for integration: true
Phase 5.0 merged:                         pending até o ato do GitHub
release prepared:                         false
release published:                        false
deployment performed:                     false
runtime modified after audit:             false
```

Este registro **não** declara Final Release, **não** declara freeze de release e **não** declara
deployment. Nenhum desses atos foi autorizado ou executado.

---

## 6 · Escopo desta selagem

Os únicos conteúdos acrescentados à candidata auditada antes do commit são:

```text
docs_phase5/AUDITORIA_INDEPENDENTE_FECHAMENTO_PHASE_5_0.md      (cópia byte-idêntica)
docs_phase5/REVALIDACAO_INDEPENDENTE_PROVENIENCIA_PHASE_5_0.md  (cópia byte-idêntica)
docs_phase5/PHASE_5_0_CLOSURE_ACCEPTANCE.md                     (este registro)
docs_phase5/MANIFEST_PHASE5_P50.sha256                           (regenerado por último)
```

Nenhum byte executável mudou: HTML, engine, os quatro módulos da Camada 5, o CSS, as suítes, o
`package.json` e o `package-lock.json` permanecem exatamente como auditados. O HTML **não** foi
reconstruído; as evidências e os screenshots **não** foram regenerados.
