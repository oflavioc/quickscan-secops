# Plano de migração da evidência binária (~103 MB) — desenho (Onda 4)

> Status: **em execução (demanda 007)** — a decisão Q1 (destino do acervo,
> Opção B/GitHub Releases) foi registrada pelo usuário/proprietário em
> 2026-08-25 e a execução corre pela máquina SDD em
> `specs/007-migracao-evidencia/` (spec aprovada na rodada 1). Artefatos já
> commitados nesta demanda: manifesto-ponte `.claude/verify/evidence_bridge.json`
> (406 arquivos, 4 pacotes, commit-âncora `62590b5927496a61ab31dd476d46b03624546560`)
> e o red provado do gate `evidence-bridge` (EB-3/EB-6). Releases nominais
> `evidence-p50`/`evidence-p51`/`evidence-p52`/`evidence-unset` estão em
> publicação em paralelo (T007 do `tasks.md` da demanda). Este documento **não
> afirma consumação** (publicação + desindexação + repin) — isso é registrado
> no relatório final da demanda 007 (T014). Achado de origem: E10 (333
> PNG/PDF/ZIP rastreados, pack de ~133 MiB crescendo a cada fase, com os
> manifestos de fase pinando cada PNG — sair do git sem projeto quebraria a
> verificabilidade).

## Inventário

| Origem | Volume | Verificabilidade hoje |
|---|---|---|
| `docs_phase5/evidence_p52/` | ~89 MB (incl. 265 PNG pinados por `MANIFEST_PHASE5_P52.sha256`) | manifesto de fase |
| `docs_phase5/evidence_p50/` | ~11 MB | `MANIFEST_PHASE5_P50.sha256` |
| `docs_phase5/evidence_p51/` | ~2,5 MB (6 PDFs) | manifesto/relatórios |
| Raiz: `visual_print_evidence_{47,48,487}.zip` | ~45 MB | pinados por gates de sessão (S64/S74/S113 leem os zips!) |

**Restrição dura**: os 3 ZIPs da raiz são LIDOS por gates vivos da suíte de
sessão (unzip nos oráculos S64/S74+S75/S113). Migrá-los exige mudar os gates —
demanda própria com red, NUNCA parte da migração mecânica.

## Opções de destino (decisão Q1 — do usuário/proprietário)

| Opção | Prós | Contras |
|---|---|---|
| A · `D:\QuickscanData\evidence` (storage local já usado p/ dados de cliente) | zero custo; mesmo perímetro dos assessments | não versionado; backup é responsabilidade local; CI não acessa |
| B · GitHub Releases (um release `evidence-faseX` por fase, assets = zips do acervo) | verificável por URL+hash; CI acessa; sem custo | assets ficam fora do clone; limite 2 GB/asset (ok) |
| C · Git LFS | transparente no clone | custo/quota; complexidade de setup p/ todos os clones |

**DECISÃO Q1 REGISTRADA (2026-08-25, usuário/Thiago no portão): Opção B — GitHub
Releases.** A execução segue pendente: abrir demanda via skill `new-demand`
(a tentativa 006 foi aberta e ABORTADA sem efeito em 2026-08-25 — nada foi
migrado; o próximo executor começa do zero pela máquina). Bordas já mapeadas
para o refinamento: `evidence_v322` FICA (README + gate V322-DOC3 exigem o
acervo da rodada); `evidence_unset` verificar referências; `tools_p52_shots.js`
escreve em `evidence_p52` (tratar o destino da escrita); manifesto-ponte
preferencialmente FORA de `docs_phase5/` para ser pinável pelo registry.

Recomendação técnica original: **B** — o acervo é por natureza um artefato de release
de fase (imutável após selagem), e a URL entra no manifesto.

## Mecânica (preserva a verificabilidade)

1. **Congelar**: para cada `evidence_*`, empacotar `evidence_<fase>.tar` com os
   bytes EXATOS de HEAD; SHA-256 do pacote registrado.
2. **Manifesto-ponte**: `docs_phase5/MANIFEST_EVIDENCIA_MIGRADA.sha256` — para
   cada arquivo migrado: hash original (idêntico ao manifesto de fase) + pacote
   + destino. Os manifestos históricos de fase NÃO são tocados (R13).
3. **Publicar** no destino escolhido; verificar o hash do pacote após upload.
4. **Remover do índice** (`git rm -r --cached docs_phase5/evidence_*`) + commit
   da migração + `.gitignore` para os diretórios. **Nota**: o histórico git
   mantém os blobs antigos — o emagrecimento do clone só vem com um eventual
   rewrite/fresh-start, decisão separada e do proprietário (nunca desta).
5. **Gate novo** (`evidence-bridge`): valida que todo hash do manifesto-ponte
   é alcançável (local: caminho; Releases: HEAD request no CI).
6. ZIPs da raiz: ficam até a demanda que refatorar os oráculos S64/S74/S113
   para o manifesto-ponte (red: gate deve falhar com pacote ausente/adulterado).

## Execução

Uma demanda via máquina SDD (`new-demand`) após a decisão Q1, com o
`build-engineer` como dono da publicação, o `qa-engineer` do gate-ponte e o
`doc-writer` do manifesto — nunca commit direto de migração sem os três.
