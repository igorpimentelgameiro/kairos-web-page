# Oracle Cloud

## FASE 1: Desenvolvimento da Funcionalidade (Java 21 + Firebase)

Este prompt serve para criar a logica de pagamento e a ponte entre o backend e o Firebase.

### Copie e cole este prompt

> Atue como um Especialista em Java 21 e Spring Boot 3. Preciso implementar um servico de integracao de pagamento para o meu projeto "Kairos".
>
> Contexto: Tenho um frontend em React e quero que o backend em Java processe o pagamento e atualize o status no Firebase Realtime Database.
>
> Solicitacao Tecnica:
>
> Crie uma classe de configuracao para o Firebase Admin SDK em Java 21.
>
> Crie um Record chamado `PaymentRequest` para receber: `userId`, `retiroId`, `valor` e `tokenPagamento`.
>
> Implemente um `PaymentService` com um metodo que:
>
> Simule uma chamada a um gateway de pagamento.
>
> Em caso de sucesso, use o Firebase Admin SDK para atualizar o caminho `inscricoes/{retiroId}/{userId}/status` para `PAGO`.
>
> Use as novas Virtual Threads (Project Loom) do Java 21 para processar essa tarefa de forma assincrona e eficiente.
>
> Forneca o codigo do `RestController` com tratamento de excecoes global.
>
> Crie um `Dockerfile` multi-stage otimizado para Java 21 (utilizando Eclipse Temurin ou Wolfi) para reduzir o tamanho da imagem.

## FASE 2: Deploy na Oracle Cloud (Infraestrutura)

Este prompt serve para configurar o servidor na nuvem da Oracle de forma profissional, com custo zero dentro do plano gratuito.

### Copie e cole este prompt

> Atue como um Engenheiro DevOps. Acabei de criar uma conta na Oracle Cloud (Always Free) e quero subir minha aplicacao Java 21 em um container Docker.
>
> Necessito de um guia passo a passo para:
>
> Como criar uma Instancia Ampere (ARM A1 Flex) com Ubuntu 24.04, garantindo que eu use os recursos do nivel gratuito (OCPUs e RAM).
>
> Quais comandos executar no terminal da instancia para instalar o Docker e o Docker Compose.
>
> Como configurar as Ingress Rules (Firewall) no painel da Oracle e no `iptables` do Ubuntu para liberar as portas 80 (HTTP) e 443 (HTTPS).
>
> Como configurar um Nginx Reverse Proxy simples (pode ser via Docker) para apontar meu dominio `api.kairosmov.com.br` para o container do Java que estara na porta `8080`.
>
> Como gerar um certificado SSL gratuito com Certbot/Let's Encrypt dentro da instancia Oracle.
