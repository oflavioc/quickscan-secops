# BACKLOG_PRODUCTION_HARDENING_VAULT.md
## Production Hardening / Assessment Vault — riscos aceitos e trabalho adiado

**Aberto em:** 2026-08-20 · **Origem:** *Diretriz do proprietário — prioridade funcional e aceitação
de risco local* (2026-08-20).
**Natureza:** registro de backlog. **Não é especificação** e não introduz requisito na Phase 5.0.
Nenhum item deste arquivo é blocker de microfase da Phase 5.0.

---

## 1 · Contexto de destino que sustenta a aceitação

```text
deployment alvo      single-user · local/private · host sob controle exclusivo do proprietário
NÃO é               SaaS público · multiusuário · exposto à Internet · serviço compartilhado
                    · plataforma com usuários não confiáveis · repositório corporativo central
```

## 2 · Ordem normativa de prioridade (diretriz §2)

```text
1. correção metodológica do assessment
2. assertividade, completude e consistência do relatório
3. preservação e isolamento dos dados de clientes
4. funcionalidade do fluxo de assessment
5. qualidade da interface e da informação apresentada
6. regressão e reprodutibilidade
7. hardening de segurança para cenários hostis ou multiusuário   ← este backlog
```

Correção metodológica, integridade de dados e completude de relatório **não** são sacrificadas por
controles irrelevantes ao ambiente local single-user.

## 3 · Itens aceitos como risco e adiados

| # | item | estado |
|---|---|---|
| PHV-01 | autenticação na aplicação local | risco aceito · adiado |
| PHV-02 | RBAC | risco aceito · adiado |
| PHV-03 | isolamento multi-tenant | risco aceito · adiado |
| PHV-04 | CSP completa | risco aceito · adiado |
| PHV-05 | threat model formal | risco aceito · adiado |
| PHV-06 | pen test | risco aceito · adiado |
| PHV-07 | assinatura digital / attestation externa | risco aceito · adiado |
| PHV-08 | criptografia application-level no host controlado | risco aceito · adiado |
| PHV-09 | auditoria imutável | risco aceito · adiado |
| PHV-10 | secret manager | risco aceito · adiado |
| PHV-11 | container hardening | risco aceito · adiado |
| PHV-12 | scanners de dependência / supply-chain assurance | risco aceito · adiado |
| PHV-13 | proteção contra operador local malicioso | risco aceito · adiado |
| PHV-14 | mecanismos voltados a exposição pública | risco aceito · adiado |
| PHV-15 | alta disponibilidade | risco aceito · adiado |
| PHV-16 | backend remoto | risco aceito · adiado |
| PHV-17 | controles empresariais de identidade | risco aceito · adiado |
| PHV-18 | assurance adversarial completa em superfícies ainda inexistentes | risco aceito · adiado |

**Regra de honestidade (diretriz §5.7):** nenhum item acima pode ser representado como *resolvido*.
Todos estão **aceitos como risco**, que é estado distinto de mitigado.

## 4 · Itens originados na Phase 5.0 (rastreabilidade por microfase)

| # | item | origem | por que não bloqueia |
|---|---|---|---|
| PHV-19 | **P50-UX12 / UI-049 — assurance adversarial de escaping** (payloads `<script>`, `<img onerror>`, `<svg/onload>`, aspas, `<`/`>`, Unicode hostil) e fixtures **P50-F8** e **P50-F10** | microfase 5.0.1 · adiado por decisão do proprietário (errata §3.4) e reafirmado pela diretriz §9 | a 5.0.1 **não renderiza texto livre novo**. O shell emite apenas conteúdo canônico (`DOMS`, `QS[k].lbl`, `opts[].t/d`) e o faz exclusivamente por `textContent`/`setAttribute` — **zero `innerHTML` em código executável**, verificado. `&`, `<`, `>` e Unicode são tratados corretamente por construção no conteúdo que existe hoje. O gate normativo será implementado quando existirem campos reais de evidência/rationale (microfase 5.0.2) |
| PHV-20 | **Chromium canônico da §25.6** — a spec nomeia `141.0.7390.37`; o ambiente resolve `151.0.7922.34` pela rota congelada (`CHROME_PATH` indefinido → `/opt/google/chrome/chrome` ausente → Chromium gerenciado) | microfase 5.0.1 · desvio D2 do relatório | é divergência de **versão nominal**, não de rota. O gate rodou em Chromium real e passou, sem SKIP. Afeta reprodutibilidade (prioridade 6), não correção metodológica nem integridade de dados. Decisão pendente do proprietário: fixar a versão, atualizar a §25.6 ou instalar o Chrome canônico |

## 5 · Salvaguardas funcionais que NÃO entram neste backlog

Os controles abaixo protegem diretamente o resultado do assessment ou os dados do proprietário e
permanecem **obrigatórios** (diretriz §4). Não são negociáveis por aceitação de risco:

```text
respostas canônicas preservadas · distinção null / "NA" / 0 · ausência de scores fabricados
suficiência calculada corretamente · recomendações rastreáveis · isolamento entre assessments
import/export sem corrupção · rollback em importação inválida
ausência de mutação canônica causada apenas por navegação/apresentação
relatórios HTML/PDF materialmente completos
tratamento correto de Unicode, pontuação, aspas, & , < e >
determinismo do build · engine e M41 preservados · regressões congeladas aplicáveis
ausência de afirmação falsa de salvamento ou persistência
nenhum acesso público ou publicação automática sem autorização
nenhuma operação que apague ou sobrescreva silenciosamente dados de clientes
```

## 6 · Condição de reabertura

Esta aceitação de risco **cessa** antes de qualquer um destes atos, cada um exigindo fase própria de
segurança e deployment:

```text
abrir a aplicação à Internet pública · compartilhar credenciais · permitir acesso de terceiros
oferecer o produto como serviço · adotar backend compartilhado · adotar armazenamento multi-tenant
```

## 7 · Estado

```text
itens registrados     20 (PHV-01 .. PHV-20)
blockers da Phase 5.0  0
fase de hardening      NÃO ABERTA · exige autorização própria do proprietário
```
