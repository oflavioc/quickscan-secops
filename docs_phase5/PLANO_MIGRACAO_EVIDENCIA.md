# Plano de migração da evidência binária (~103 MB) — desenho (Onda 4)

> Status: **DESENHADO, não executado** — a execução depende da decisão Q1
> (destino do acervo), que é do usuário/proprietário. Achado de origem: E10
> (333 PNG/PDF/ZIP rastreados, pack de ~133 MiB crescendo a cada fase, com os
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

Recomendação técnica: **B** — o acervo é por natureza um artefato de release
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
