# Backend Kairos Pay

Modulo Spring Boot 3 com Java 21 para processar pagamentos e publicar o status no Firebase Realtime Database.

## Escopo inicial

- endpoint `POST /pagamentos`
- DTO com `record`
- atualizacao do status da inscricao no Firebase
- processamento assincrono com Virtual Threads
- CORS liberado para `http://localhost:5173` e `https://kairosmov.com.br`
- Dockerfile multi-stage

## Variaveis necessarias

- `KAIROS_FIREBASE_PROJECT_ID`
- `KAIROS_FIREBASE_DATABASE_URL`
- `KAIROS_FIREBASE_CREDENTIALS_PATH` ou credenciais do Google por ADC
- `KAIROS_CORS_ALLOWED_ORIGINS`

## Exemplo de payload

```json
{
  "inscricaoId": "-OVabc123",
  "valor": 150.00,
  "tokenPagamento": "tok_demo_123"
}
```

## Fluxo atual

1. A API recebe a requisicao.
2. O status inicial `PROCESSANDO` e salvo no Firebase em `inscricoes/{inscricaoId}`.
3. Uma tarefa em Virtual Thread simula o gateway.
4. Em caso de sucesso, o status muda para `PAGO`.
5. Em caso de falha, o status muda para `ERRO`.
