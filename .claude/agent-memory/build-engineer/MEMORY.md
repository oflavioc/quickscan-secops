# MEMORY

- [013 · E1 nas harnesses de mutação](project_013_e1_harnesses.md) — E1 é minha, uma wave por harness; `tests_p51_mutants.js` tem dois donos, nunca na mesma wave
- [013 · rito de medição pré-commit](project_013_rito_de_medicao.md) — o julgador aborta em árvore suja; medir em worktree efêmera com commit descartável
- [targets de trigger × arquivos mutados](project_targets_trigger_vs_mutados.md) — d009 declara 2 alvos que não muta; o "precedente p52" é falso; IC-6 genérico (EA-3) vai reprovar
- [013 · sonda de fiação](project_013_sonda_de_fiacao.md) — sonda em processo mede a função, não o laço; green de fiação exige harness sintético em efêmera
- [Escopo de scanner nos dois sentidos](feedback_escopo_de_scanner_nos_dois_sentidos.md) — alvo de menos = gate por vácuo; alvo demais = vermelho alheio; prove em efêmera
- [Stage build compara contra HEAD](project_stage_build_contra_head.md) — rebuild sem commit = FAIL por desenho; e a armadilha inversa: `baseline` verde com pinado editado na árvore
- [Job visual: suítes num só `run` sob `bash -e`](project_job_visual_bash_e.md) — ordem é precedência; a última só roda se as legadas passarem, e vermelho pula restauração e campanha
- [Wave fora de ordem dá verde vácuo](project_wave_fora_de_ordem_da_verde_vacuo.md) — consumidor sem o contrato responde "zero" com sinceridade; sempre listar quem ficou sem insumo
- [Byte de controle em fonte versionado](project_byte_de_controle_em_fonte_versionado.md) — separador literal NUL/U+0001 roda e faz o git tratar o `.js` como binário; escrever como escape
- [compliance-audit não é stage](project_compliance_audit_fora_do_pipeline.md) — só o CI o roda; `run.sh --light` verde não diz nada sobre ele, e a casa tem DUAS fontes de exceção nominal
