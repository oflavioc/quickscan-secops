---
name: copia-mutada-e-alvo-do-gatilho
description: Doc mutado em CÓPIA (tmp, via *_DOC_OVERRIDE) ainda é `arquivos_mutados` do contrato C1 e por isso tem de estar em `targets` (D017-REL1); mutante de reancoragem se prova por DUAS suítes (gate novo + alínea da suíte congelada sob *_HTML_OVERRIDE); registros byte-estáveis sob json.dumps(indent=2) aceitam load→dump; stage que recusa árvore suja mede-se num WIP commit consolidado por reset --soft
metadata:
  type: feedback
---

Quatro regras de harness aprendidas na W8 da 025 (T084, 2026-10-30):

1. **Cópia mutada é arquivo mutado.** M21 muta uma cópia de `SESSION_SCHEMA_V32.md` em
   `os.tmpdir` (apontada por `D025_DOC_OVERRIDE`) — o doc rastreado nunca é escrito (R7 §3).
   Mesmo assim o contrato C1 (`--preflight`) o declara em `arquivos_mutados`, e
   `check_mutation.py` (D017-REL1) exige `targets ⊇ arquivos_mutados ∪ {harness}`: o
   `tasks.md` listava sete alvos; o harness precisa de oito (nove com ele próprio). A
   semântica está certa — editar o doc pode apodrecer a âncora e tem de re-disparar a
   campanha. Declare a divergência do tasks.md na `_trilha`, não omita o alvo.
2. **Mutante de reancoragem, duas suítes.** M6/M11/M12/M16 atacam propriedades medidas num
   gate novo E numa alínea reancorada da suíte congelada; o runner roda as duas (a m48 lendo
   o HTML mutado por `M48_HTML_OVERRIDE`, heap do `test:session`) e só conta DETECTADO se
   ambas reprovam pelo `reason` nominal. Custo medido: m48 80–101 s por mutante; 23 mutantes
   em 534 s. Provar a reancoragem uma vez num relatório é a família EA-28.
3. **Registros byte-estáveis.** `mutation_map.json`, `expected_suites.json` e
   `mutation-matrix.json` reproduzem-se byte a byte por `json.dumps(obj, ensure_ascii=False,
   indent=2) + "\n"` (medido antes de editar). Load→modifica→dump é seguro ali; a inserção
   textual continua necessária só quando o arquivo NÃO é estável — teste primeiro.
4. **Stage que recusa porcelain sujo e precisa dos próprios números no registro.**
   `check_mutation.py` exige árvore limpa, mas o `_meta.execucao_*` da matriz tem de conter
   o resultado dele: WIP commit com os registros → stage → `registra_2` → `git reset --soft
   HEAD~1` → commit único com a mensagem final. A história fica com UM commit (D4 da 013).

**Why:** sem (1) o stage reprovaria o harness recém-nascido por REL1 com a campanha 23/23
verde; sem (2) S30(b)/S31-S32/S69(b) ficariam sem carrasco executável (a tautologia que a
014 expôs); (3) evitou 61 edições textuais nos pares de core/d009/d010/d015 ao re-datar a
reexecução; (4) é a única forma de o commit único carregar os números do próprio stage.

**How to apply:** ao escrever `tests_0NN_mutants.js`: liste os alvos a partir de
`arquivos_mutados` do seu próprio preflight (não do tasks.md); para cada reancoragem em suíte
congelada, dê ao mutante `suites: [gateNovo, alíneaCongelada]`; antes de editar um registro,
meça a estabilidade da re-serialização; e nunca escreva na árvore (nem memória do agente)
enquanto o stage `mutation` roda — ele acusa "campanha sujou a árvore" no fim.
