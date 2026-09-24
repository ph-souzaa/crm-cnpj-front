# crm-cnpj-front

## Portas locais (dev)

Portas de host de dev seguem um esquema único entre todos os projetos do time (registro mestre no Mac:
`~/Workspace/PORTAS.md`; checagem de conflito: `~/Workspace/portas-check.sh`):
**porta do host = bloco do projeto + sufixo do serviço** — `32` Postgres · `79` Redis · `80` API/backend ·
`30` front · `73` Vite · `72` RabbitMQ · `74` RabbitMQ management · `90/91` MinIO · `25/26` SMTP/webmail · `60` SIP.

Regras:
- Nunca publicar porta padrão no host (5432, 3000, 8000, 6379, 5173…) — colide com outro projeto e o erro aparece calado
  (conecta no banco errado, `password authentication failed`).
- Serviço novo = próximo sufixo livre do bloco deste projeto, registrado aqui e no `PORTAS.md`.
- Muda só a porta do HOST; a porta interna do container fica a padrão. Composes de prod/servidor/homolog não seguem este esquema.

Bloco(s) deste projeto: `260xx`.

### 260xx — crm-cnpj (mvppuc)
| Porta | Serviço | porta antiga |
|---|---|---|
| 26030 | front (nginx, container :80) | 3000 |
| 26073 | Vite dev server | 5173 |
| 26080 | API FastAPI (container :8000) | 8000 |
