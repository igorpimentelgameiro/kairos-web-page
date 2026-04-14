# Projeto: Kairos Pay - Integracao de Pagamentos e Inscricoes em Tempo Real

## Ideia Central

Evoluir o projeto Kairos (inscricao para retiros) de um fluxo manual para um sistema automatizado, onde o backend em Java 21 processa o pagamento via cartao de credito e o Firebase atualiza o status da vaga instantaneamente para o usuario no frontend React.

## Prompt Para Iniciar O Desenvolvimento

> Atue como um Desenvolvedor Full Stack Senior. Preciso implementar uma funcionalidade de pagamento de inscricoes para o projeto Kairos. A arquitetura deve ser: Frontend em React + TypeScript (Vite), Backend em Java 21 + Spring Boot 3 e Banco de dados de tempo real Firebase.
>
> Requisitos:
> Criar um formulario no React para captura de dados de pagamento (Simulando integracao com Stripe ou Mercado Pago).
> Criar uma API no Spring Boot com um endpoint POST /pagamentos que utilize Records (Java 21) para o DTO.
> Implementar a logica no Java para que, apos o "sucesso" do pagamento, ele atualize um no no Firebase Realtime Database via Admin SDK.
> Garantir que o Frontend tenha um listener no Firebase para mudar o status da tela de "Processando" para "Confirmado" sem refresh.
> Fornecer o arquivo Dockerfile para o deploy do backend.
>
> Por favor, forneca os passos de implementacao comecando pela estrutura do Backend.

## Passos De Implementacao Sugeridos

### 1. Backend: O Coracao Do Pagamento (Spring Boot)

- Configuracao: Adicionar as dependencias `spring-boot-starter-web` e `firebase-admin`.
- Seguranca: Utilizar as facilidades do Java 21 para criar um servico de pagamento resiliente.
- Integracao: Criar o servico que recebe os dados do cartao e "conversa" com o Firebase para atualizar o status da inscricao.

### 2. Infraestrutura: Dockerizacao

- Dockerfile: Criar um arquivo para transformar seu codigo Java em uma imagem. Isso e essencial para subir o projeto na Oracle Cloud ou Render.
- Beneficio: Isso valida seu conhecimento em DevOps que voce ja vem desenvolvendo.

### 3. Frontend: Experiencia Do Usuario (React + TypeScript)

- Checkout: Criar a interface de pagamento utilizando os componentes que voce ja domina no ecossistema Vite.
- Tempo Real: Implementar o hook do Firebase para escutar a resposta que o seu Backend enviou.

### 4. Deploy E DNS

- Subdominio: Configurar o `api.kairosmov.com.br` para apontar para o seu novo servidor backend.
- CORS: Configurar o Spring Boot para aceitar requisicoes vindas do seu dominio principal no GitHub Pages.
