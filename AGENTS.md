# 🤖 AGENTS.md — Guia de Contexto e Padrões para IA do Projeto Kairós

## 🧠 Contexto Geral

O **Projeto Kairós** é uma aplicação **monolítica modular** que une:

- **Frontend** em **React + TypeScript (Vite + TailwindCSS)**
- **Backend** em **Spring Boot (Java 21)**

O sistema foi criado para gerenciar **inscrições em retiros**, **doações de benfeitores** e **comunicações do Movimento
Kairós**, ligado à Basílica de Nazaré (Belém/PA).

Este documento serve como **guia para ferramentas de IA (Copilot, ChatGPT, Codex, etc.)**, descrevendo o estilo,
arquitetura e decisões técnicas do projeto para que o código gerado mantenha **consistência, clareza e aderência à
arquitetura limpa (Clean Architecture)**.

---

## 🧱 Estrutura do Projeto

site-kairos/
├── kairos2.0/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/mov/kairos/kairos/
│   │       │   ├── aplicacao/ → controllers, configs, segurança
│   │       │   ├── dominio/ → entidades e casos de uso (core)
│   │       │   └── infraestrutura/ → repositórios e adapters
│   │       ├── javascript/ → frontend React + TypeScript
│   │       │   ├── componentes/
│   │       │   ├── paginas/
│   │       │   ├── hooks/
│   │       │   ├── dominio/ → serviços HTTP, entidades e DTOs
│   │       │   └── assets/
│   │       └── resources/
│   │           └── db/migration/ → scripts Flyway
│   ├── build.gradle.kts
│   └── settings.gradle.kts
└── AGENTS.md

mar

---

## 🧩 Arquitetura e Diretrizes

### 🔹 Estilo Arquitetural

- **Clean Architecture**
- **DDD (Domain-Driven Design)**
- **SOLID**
- **Separação rigorosa entre camadas**
- **Independência de frameworks**

### 🔹 Camadas do Backend

| Camada             | Responsabilidade                                                     | Observações                                                |
|--------------------|----------------------------------------------------------------------|------------------------------------------------------------|
| **dominio**        | Entidades, regras de negócio e casos de uso                          | Sem dependência de frameworks.                             |
| **infraestrutura** | Implementações concretas (repositórios, clientes externos, adapters) | Anotações Spring: `@Repository`, `@Service`, `@Component`. |
| **aplicacao**      | Controllers, configuração e orquestração de casos de uso             | Nunca conter lógica de negócio.                            |

---

## ⚙️ Diretrizes para a IA (Codex, Copilot, ChatGPT)

### 🎯 Geração de Código

- **Priorize clareza e legibilidade.**
- Sempre **separe responsabilidades** em camadas adequadas.
- Use **nomes significativos** (evitar variáveis de uma letra).
- Gere **código limpo e documentado** (usar Javadoc e comentários concisos).
- Prefira **records** para entidades simples de domínio.
- Não use frameworks no pacote `dominio`.

### 🧩 Backend (Spring Boot)

- Java 21.
- Spring Boot 3.5.x.
- Banco: PostgreSQL (produção) / H2 (testes).
- Migrations: Flyway.
- Testes:
    - Unidade → domínio.
    - Integração → infraestrutura e aplicação.
    - Usar `AssertJ` e `@SpringBootTest`.
- Entidades JPA com sufixo `JpaEntity`.
- Preferir `JpaRepository` em vez de `CrudRepository`.
- Implementar `equals`, `hashCode` e `toString` com `ObjectUtils`.
- Interfaces do domínio devem começar com **`I`** (ex: `IInscricaoRepositorio`).

### 🧠 Regras de Negócio

- Sempre centralizar no domínio (`br.jus...dominio...`).
- Nenhuma anotação Spring (`@Entity`, `@Service`) no domínio.
- Casos de uso nomeados com verbo no infinitivo:
    - `RealizarInscricao`
    - `ListarRetiros`
    - `CadastrarBenfeitor`

### 🧱 Infraestrutura

- Implementa interfaces do domínio.
- Nunca acessa `aplicacao`.
- Mapeia entidades JPA com nomes equivalentes às entidades do domínio.
- Repositórios ficam em `infraestrutura.repositorio`.
- Entidades JPA ficam em `infraestrutura.repositorio.jpa`.

### 🧩 Aplicação

- Controllers mapeiam endpoints e orquestram casos de uso.
- Requests e responses devem ser DTOs.
- Tratar exceções via `@ControllerAdvice`.
- Toda chamada REST deve conter headers padrão (ex: `"www-tjpa-usuario": "admin"` nos testes).

---

## 🖥️ Frontend (React + TypeScript)

### 🎯 Padrões Gerais

- Código em `kairos2.0/src/main/javascript`.
- Padrões de estilo:
    - Airbnb Style Guide.
    - ESLint + Prettier configurados.
- Cada `.tsx` deve ter um `.test.tsx` correspondente.
- Componentes nomeados em PascalCase.

### 📦 Estrutura

| Pasta            | Função                           |
|------------------|----------------------------------|
| **componentes/** | Componentes reutilizáveis        |
| **paginas/**     | Páginas principais               |
| **hooks/**       | Custom hooks                     |
| **dominio/**     | Serviços HTTP + entidades + DTOs |
| **assets/**      | Imagens e ícones                 |

### 🧠 Serviços HTTP

- Todos os serviços ficam em `src/main/javascript/dominio/servicos/`.
- Devem usar um módulo central `fetcher.ts` para requisições.
- Endpoints REST devem espelhar os controllers do backend.

### 🧪 Testes Frontend

- Usar Jest + React Testing Library.
- Estrutura de testes:
  ```ts
  import { render, screen } from "@testing-library/react";
  import MeuComponente from "./MeuComponente";

  test("deve renderizar corretamente", () => {
    render(<MeuComponente />);
    expect(screen.getByText("Kairós")).toBeInTheDocument();
  });

🔍 Testes e Validação
✅ Backend
Testes de unidade: domínio.

Testes de integração: repositórios e controllers.

Banco de testes: H2.

Profile: auth-desabilitado.

Todos os métodos de teste devem começar com deve....

✅ Frontend
Testes unitários de componentes.

Testes de integração de páginas.

Rodar npm run test antes de cada commit.

🧪 Regras de Arquitetura (ArchUnit)
Executar ./gradlew archTest para validar:

dominio_sem_dependencias_externas

aplicacao_somente_usecases_entidades_dominio_e_infra

aplicacao_nao_depende_de_dominio_exceto_usecases_entidades_e_repositorios

infraestrutura_nao_acessa_aplicacao

infraestrutura_nao_depende_de_dominio_concreto

infraestrutura_somente_repo_interfaces_do_dominio_ou_frameworks

jpa_repositories_nao_acessados_fora_da_infra

🚀 Execução
Frontend
cd kairos2.0/src/main/javascript
npm install
npm run dev
→ http://localhost:5173

Backend
cd kairos2.0
./gradlew bootRun
→ http://localhost:8080

🧩 Regras de Commit
Commits devem ser claros e descritivos, seguindo o formato:

#<numero_da_tarefa> descrição clara da mudança
Exemplo:

#12 adiciona caso de uso para listar inscrições do retiro
Antes de cada commit:

Rodar npm run build no frontend.

Rodar ./gradlew test e ./gradlew archTest no backend.

📜 Missão do Projeto
“Viver o tempo da Graça é permitir que Deus conduza cada instante.”

O sistema Kairós foi criado para servir a comunidade com tecnologia simples, eficiente e transparente.
