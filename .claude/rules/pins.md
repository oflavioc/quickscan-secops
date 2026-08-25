# R8 — Registry único de pins

Severidade: **bloqueante** (stage `baseline` + classe `registry` do boundary).

Identidade de artefato vive em UM lugar: `.claude/verify/pins.json`, gerado por
`gen_pins.py` a partir dos **blobs de HEAD** (à prova de CRLF/plataforma). Nasceu
do achado E8: hashes duplicados em 6+ lugares, com 11 repins manuais "Identidade
anterior" e duas falhas de processo — e do E5: o MANIFEST 74/74 nunca regenerado,
sempre vermelho, logo nunca rodado.

## Regras

1. **Alterar arquivo pinado exige regenerar o registry no MESMO PR**, com o motivo
   na mensagem de commit. O stage `baseline` falha em divergência e em arquivo
   rastreado sem pin — o esquecimento é impossível de silenciar.
2. **Repin em gate legado** (pins inline que ainda existem em suítes congeladas,
   ex.: N47, P50-GOV1): mudança acompanhada de comentário-trilha no padrão do
   repositório — motivo, data, "Identidade anterior: <hash>".
3. **Pins declarativos** (`declared`): `m41_payload_sha256` (a régua D2) e o SHA do
   core congelado. Mudá-los é ato de governança, nunca efeito colateral.
4. `MANIFEST.sha256` é **legado congelado** (classe `legacy`): não é fonte, não é
   editado, e a reconciliação histórica é a Onda 4.
5. O registry **não pina a si mesmo**; suas exclusões (docs_phase5/**, *.zip) estão
   declaradas no próprio arquivo, em `_meta.exclusoes`.
