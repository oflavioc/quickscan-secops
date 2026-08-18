# Asset completeness decisions · Phase 4.6

Fonte oficial usada: **Fortinet-Icon-Library.zip** (biblioteca oficial de ícones Fortinet já presente no projeto — fonte de prioridade 1; 1.571 SVGs). Nenhuma fonte externa/terceira foi utilizada.

## fortigate
Entity: FortiGate product family (plataforma NGFW declarável no Technology Landscape).
Evidence: itemId `fortigate` em PLATFORM/registry; asset nominal `FortiGate.svg` na biblioteca oficial (variantes VM/Cloud/aaS existem separadamente, provando que este é o asset da família de produto — não logo corporativo, não Security Fabric, não FortiOS).
Official asset: FortiGate.svg · Source: Fortinet-Icon-Library.zip.
Decision: **OFFICIAL_ASSET_ACCEPTED** · Reason: correspondência nominal exata e inequívoca com a entidade.

## forticlient
Entity: FortiClient (produto/agente específico — distinto de FortiClient EMS, FortiEndpoint e FortiEDR, todos com assets próprios na biblioteca).
Official asset: FortiClient.svg · Source: Fortinet-Icon-Library.zip.
Decision: **OFFICIAL_ASSET_ACCEPTED** · Reason: nominal exato; a existência de assets separados para EMS/EDR elimina ambiguidade.

## fortisat
Entity: FortiSAT (Security Awareness Training, nomenclatura do Portfolio Registry congelado).
Evidence: NENHUM asset nominal `FortiSAT*` na biblioteca oficial. Existem `Security-Awareness-Training.svg` e `Phishing.svg`, mas o item G da spec proíbe assumir que ícones genéricos de training/awareness representem FortiSAT.
Decision: **FALLBACK_RETAINED_NO_ASSET** · Reason: sem vínculo nominal oficial; fallback determinístico permanece by design.

## fortimail-wss
Entity: FortiMail Workspace Security (≠ FortiMail tradicional, ≠ ICES isolado — semântica congelada na Rev1/3.3.3).
Official asset: `FortiMail-Workplace- Security.svg` (grafia e espaçamento **sic** do pack oficial; único asset da família FortiMail com qualificador de workspace security — FortiMail tradicional, Cloud e Cloud-SaaS possuem assets próprios e NÃO foram usados).
Source: Fortinet-Icon-Library.zip · Transformation: cópia byte-a-byte; filename normalizado (espaço removido), original registrado no provenance.
Decision: **OFFICIAL_ASSET_ACCEPTED** · Reason: correspondência inequívoca à entidade WSS; a divergência de grafia é característica do asset pack oficial e está documentada — nenhum retracing/edição de artwork.

## endpoint-family · fortimail-family · identity-family · soc-platform-family
Entity: famílias/abstrações de arquitetura (não produtos).
Decision (4×): **FALLBACK_RETAINED_ABSTRACTION** · Reason: mapear um produto específico (FortiEDR, FortiMail, FortiAuthenticator, FortiSIEM) transformaria abstração em produto — proibido pelo item B2. Nenhum asset oficial representa a família em si.

**Resultado: 8 → 5 fallbacks · 3 assets oficiais aceitos · 5 retidos (1 no-asset, 4 abstraction).**

---
## Source archive trace (Phase 4.6.0.1)
Source archive: Fortinet-Icon-Library.zip
Source archive SHA-256: 0224969b0d2473fdd0006428807e3ede5614e5cc81ec4d48de5fdcfa8ad03788
Source asset paths (raiz do archive): `FortiGate.svg` · `FortiClient.svg` · `FortiMail-Workplace- Security.svg`
Provenance por asset (sourceArchiveSha256/sourcePath/sourceSha256/publishedFilename/publishedSha256/
contentTransformation/packagingRename) registrada no manifest.

## Nota de nomenclatura (preservada)
Produto na UI: **FortiMail Workspace Security** (nome comercial correto — não renomear).
Asset do pack oficial: `FortiMail-Workplace- Security.svg` ("Workplace", sic). O iconKey reflete o filename
oficial do asset pack; o display name do produto permanece Workspace Security.
