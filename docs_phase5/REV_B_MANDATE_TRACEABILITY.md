# REV_B_MANDATE_TRACEABILITY.md
## Artefato de assurance · Rastreabilidade Mandato (RB-*) → PHASE 5.0 REV B

**Natureza:** artefato de assurance **derivado** da especificação candidata. Não é especificação, não
é normativo por si e **não introduz nenhum requisito novo**: reproduz, para verificação independente,
a tabela de rastreabilidade da §36 da spec identificada abaixo. Em divergência, vence a spec.

**Especificação de origem (identidade):**

```text
arquivo:   PHASE_5_0_REV_B.md
tamanho:   99.006 bytes
linhas:    1.850
SHA-256:   0f31900e8ad608c8a5825d9d5fa9e2d7a4fd3d68f8efbf23c7fc937a16950925
status:    CANDIDATA · NÃO NORMATIVA · Phase 5.0 NÃO ABERTA
```

**Mandato rastreado:** `MINUTA_REV_B_MANDATO.md` (rev. 3) · SHA-256
`6aa129d4743dc9a542807936e9fe8da80d5bfbc2f644eebb23391e85982c95bb` · 42.514 bytes.

---

## Mapeamento completo (reprodução literal da §36 da spec)

Colunas: **(1)** cláusula final da REV B · **(2)** item `RB-*` · **(3)** achado/decisão/fonte de
origem · **(4)** gate que demonstra a cláusula · **(5)** evidência exigida · **(6)** critério de
fechamento.

| cláusula final da REV B | RB-* | origem | gate demonstrador | evidência exigida | critério de fechamento |
|---|---|---|---|---|---|
| §0.A · §1 · §2 | RB-01 | B-5 · relatório da micro-fase UNSET | P50-GOV3 | bloco de baseline com hashes; mapa `REV_B_REANCHOR_MAP.md` verificado | baseline citado = hashes reais; nenhuma posição antiga como fonte normativa; limites do baseline de trabalho declarados |
| §0.A (localização/promoção) · §1 · §35 | RB-02 | B-6 · L-1 | P50-GOV2 | registro de promoção (data+SHA) + `CLAUDE.md` coerente | auditoria PASS antes da promoção; spec e `CLAUDE.md` com o mesmo SHA |
| UI-012A (arquitetura; única declaração nova) | RB-03.1 / RB-03.2 | B-1 · DL-1 (opção 1a) | P50-SUF7 · regressão M41 | payload M41 `9794b267…` byte-idêntico; lint de literais no renderer | `dataSufficiency()` intocada; limiares declarados uma única vez na Camada 5 |
| UI-012A (shape/consumo) | RB-03.3 | B-1 | P50-SUF7 (1024 vetores) | log do gate exaustivo campo a campo | todas as igualdades e razões/déficits corretos em 1024/1024 vetores |
| UI-012 · P50-SUF0..SUF6 | RB-03.4 | B-1 | P50-SUF0 · P50-SUF3 | render sob fixtures P50-F2/F3/F4 | renderer consome só o contrato; sem literais 10/2; mensagens = déficits exatos |
| UI-009 · UI-009A | RB-03.5 | A-1 | P50-SUF7 (casos de moeda) | casos `null`/`"NA"`/`0..3` no log do gate | moeda exibida = respostas confirmadas; `NA`/`null` não confirmam; `0` confirma |
| P50-SUF0 (escopo prospectivo) | RB-04.1 | B-2 | P50-SUF0 | inventário de superfícies novas/modificadas | nenhuma superfície da fase deriva suficiência própria |
| UI-012B | RB-04.2 | B-2 · TARGET 4.3.1 | P50-SUF8 (1024 vetores, 8 passos) | log de equivalência tripla por vetor | `computeTargetProfile(eff).suff === dataSufficiency(stats) === derived.sufficient` no mesmo estado; `ui_target_v32.js` intocado |
| §12.2 (quatro blocos) · UI-019 · §25.9 | RB-05.1..05.4 | B-3 · DL-2 · relatório da micro-fase | UG1–UG13 · P50-VIS8 · P50-COR3 | suíte UG integral; screenshots P50-VIS8; UG13 PASS em Chromium real | UG 13/13 sem enfraquecimento; encoding §12.2(b) byte-preservado; superfícies novas conforme (c)/(d); SKIP≠PASS |
| UI-002 · §12.2(a) · UI-014 | RB-05.5 | A-8 = opção (a) | P50-SUF2 · regressão N3/S9/T10/T11/P11 | render `n/d`+"Não avaliado"; contagens das suítes congeladas | token `n/d` preservado; rótulo aditivo presente; 5 gates congelados intactos |
| §25.1 · §25.8 · §26 | RB-06 | B-4 · L-2 | autoverificação de namespace | tabela de reserva; grep de colisões | zero gate novo fora de `P50-*`; `P50-IC1..4`/`P50-COR1..4` fixados; prefixo `MAP` ausente |
| P50-GOV1 · §29.1 | RB-07.1 | A-7 | P50-GOV1 | mapa tela×print por símbolo | nenhuma edição em símbolo protegido |
| §29.2 · §29.3 · §29.4 | RB-07.2 | A-6 | P50-GOV1 · manifesto | `MANIFEST_PHASE5_P50.sha256`; diff de `build_v32_html.py`/`package.json`/`package-lock.json` | somente as edições nominais listadas; core `MANIFEST.sha256` imutável |
| UI-001 · UI-015 · UI-028 · UI-030 | RB-08.2 | A-2 | P50-UX1 · P50-UX6 | render da hierarquia domínio→pergunta | nenhuma camada de "aspecto" criada |
| UI-002 · UI-016 · P50-F6/F7 | RB-08.3 | A-3 | P50-UX10 · P50-UX11 | DOM/labels/nomes acessíveis distintos nas fixtures | três estados de resposta distintos; UNSET×NONE no eixo de presence |
| UI-003 | RB-08.4 | A-4 | P50-UX1 | mapeamento card↔valor por pergunta | 4 opções canônicas + `NA`; nenhum valor criado/removido/reordenado |
| P50-UX9 | RB-08.5 | A-5 | P50-UX9 | comparação `captureCanonicalInputs()` antes/depois | igualdade estrita; oráculos proibidos ausentes do teste |
| UI-004 · UI-004A | RB-08.9 | A-9 · D1 | P50-UX2 · P50-UX13 · regressão V6/UX 4.1 | contagens integrais UX 4.1; mutante do predecessor detectado | markup da Camada 1 não reescrito; composição conforme UI-004A |
| UI-001 · UI-004 · §29.2 | RB-09.1 | D1 · DL-3 | P50-GOV1 | inventário de módulos novos | implementação inteira nos módulos P50 nominais |
| UI-012A | RB-09.2 | D2 (resolvida por DL-1) | P50-SUF7 | idem RB-03 | idem RB-03 |
| §12.2 · UI-002 | RB-09.3 | D3 (resolvida) + A-8 | P50-SUF2 · P50-VIS8 | idem RB-05 | idem RB-05 |
| §19 (UI-031/032/033) | RB-09.4 | D5 · DL-4 (custo registrado) | P50-COR1..4 | lint de hex; screenshots | BRANDING-01 encerrado; zero paleta nova; V4+V5 intactos |
| UI-010 (removida) · UI-010A · §32 · §33 | RB-09.5 | DL-5 | P50-SESUX5 | export sem estado efêmero | UI-010 fora do escopo; estado efêmero jamais serializado |
| §15 · §26 · §33 | RB-10 | D4 | — (remoção) | grep: ausência de cláusulas/gates MAP ativos | NIST/framework fora do escopo; princípios herdados em UX-P6/AP-04/AP-08 |
| UI-031 · §12.2(c) | RB-11 | COR-01 (backlog) | P50-COR1..P50-COR4 | lint + screenshots + regressão V4/V5 | tokens `--ftnt-*` como fonte única; `#DA291C` fora de dados; UNSET esmaecido na cor do domínio |
| UI-031A | RB-12 | ICON-01 (backlog) · N-1..N-3 | P50-IC1..P50-IC4 | render de asset e fallback; lint; ICONS 4.6 12/12 | `iconFor()` como fonte única; fallback by design preservado; PDF fora do escopo |
| UI-014 · UI-046A | RB-13.1 | M-1 (decisão do proprietário) | regressão P11 | contagem integral de print | status quo ratificado; nenhuma alteração de print na 5.0 |
| UI-049 | RB-13.2 | M-2 | P50-UX12 | payloads adversariais inertes | `escAttr`/`esc32` nomeados; `esc` da Camada 1 vetado para superfície nova |
| UI-006 | RB-13.3 | M-3 | P50-UX4 | roundtrip da nota por pergunta | binding exclusivo em `notes[k]`; STOP para segundo owner |
| UI-010A | RB-13.4 | M-4 | P50-SESUX1B · P50-SESUX5 | export inspecionado; fixtures de status | estado efêmero enumerado e excluído do documento canônico |
| UI-033A | RB-13.5 | M-5 | — (cláusula) | inspeção de strings novas | PT-BR na UI nova; denominações PT/EN congeladas preservadas |
| §13 (UI-017..019) | RB-13.6 | M-6 | P50-VIS9 · regressão TARGET/V9 | screenshots; contagens TARGET 30/30 | delta de apresentação; zero reimplementação de target |
| §31 · P50-VIS10 | RB-13.7 | M-7 | P50-VIS10 | contagens integrais de print + UG4/UG6/UG9 | DoD sem semântica nova de print; regressão de print integral |
| §25.6 · §25.7 · UI-040 | RB-13.8 | M-8 | P50-VIS1..9 · P50-ACC1..6 | screenshots/JSONs/relatórios axe | todos os gates VIS/ACC com definição executável completa (browser, viewports, seletores, tolerâncias, PASS/FAIL/SKIP) |
| §0.A (localização) | RB-14.1 | L-1 | P50-GOV2 | caminho do arquivo | spec em `specs/` com cabeçalho candidato; sem cadeia normativa ativa |
| §25.1 | RB-14.2 | L-2 | autoverificação | grep | prefixo `MAP` banido e ausente |
| UI-010 (removida) | RB-14.3 | L-3 · DL-5 | — (remoção) | grep | nenhum requisito de estimativa de tempo ativo |
| UI-028 | RB-14.4 | L-4 | P50-UX6 | render das tabs | sem tab Framework Mapping; heat map por pergunta |
| — (sem cláusula; corrigido na entrega da auditoria) | RB-14.5 | L-5 | — | registro da auditoria | n/a |
| §5 · §15 · §23 · §33 | RB-15 | consolidação de não-escopo | P50-GOV1 | inventário de escopo da fase | nenhum item de não-escopo implementado |

**Checklist da lista fechada da seção 8 da auditoria (11 itens):** 1→UI-012A/P50-SUF7 ✔ ·
2→P50-SUF0/UI-012B/P50-SUF8 ✔ · 3→§12.2 ✔ · 4→§25.1 ✔ · 5→§0.A/§1 ✔ · 6→§0.A/P50-GOV2 ✔ ·
7→A-1..A-9 conforme tabela acima ✔ · 8→§25.6/§25.7 ✔ · 9→D2/D3 resolvidas ✔ · 10→§15 ✔ ·
11→§19/UI-004 (D1, D5 com custo registrado) ✔.
