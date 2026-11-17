# 🚀 DevStock — API de Gerenciamento de Produtos

<p align="center">
  <strong>Uma API REST construída com Python, FastAPI, PostgreSQL, Redis e Docker.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-API-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Pytest-Testing-0A9EDC?logo=pytest&logoColor=white" />
</p>

---

## 📌 Sobre o projeto

O **DevStock** é um projeto de desenvolvimento de uma API REST para gerenciamento de produtos e controle de estoque.

A aplicação foi construída utilizando Python e FastAPI, com PostgreSQL para persistência dos dados e Redis para armazenamento temporário em cache.

Toda a infraestrutura é executada com Docker Compose, permitindo iniciar os serviços de maneira organizada e reproduzível.

O projeto também faz parte de uma jornada prática de aprendizado sobre desenvolvimento backend, containers, persistência de dados, cache e testes automatizados.

### 🎯 Objetivos

- Desenvolver uma API REST utilizando FastAPI.
- Implementar operações CRUD para gerenciamento de produtos.
- Integrar uma aplicação Python com PostgreSQL.
- Utilizar Redis para melhorar o acesso aos dados por meio de cache.
- Orquestrar múltiplos serviços com Docker Compose.
- Aplicar boas práticas de organização e segurança.
- Desenvolver testes automatizados com Pytest.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| Python 3.12 | Linguagem principal |
| FastAPI | Construção da API REST |
| Uvicorn | Servidor ASGI |
| PostgreSQL 17 | Banco de dados relacional |
| Redis 7 | Cache de dados |
| Psycopg | Conexão com PostgreSQL |
| Docker | Containerização |
| Docker Compose | Orquestração dos serviços |
| Pytest | Testes automatizados |

---

## 🏗️ Arquitetura do projeto

A aplicação é composta por três serviços principais:

```text
                 CLIENTE HTTP
                      |
                      v
              +---------------+
              |   FastAPI     |
              |   Python      |
              +---------------+
                 |         |
          +------+         +------+
          |                       |
          v                       v
   +-------------+         +-------------+
   | PostgreSQL  |         |    Redis    |
   | Persistência|         |    Cache    |
   +-------------+         +-------------+
```

### Serviços

**FastAPI**

Responsável por receber as requisições HTTP, validar os dados e executar as operações da aplicação.

**PostgreSQL**

Armazena permanentemente os produtos e seus respectivos dados.

**Redis**

Armazena temporariamente a listagem de produtos, utilizando expiração de 30 segundos para o cache.

Quando um produto é criado, atualizado ou excluído, o cache da listagem é invalidado para evitar a apresentação de dados desatualizados.

---

## 📂 Estrutura do projeto

```text
devstock/
│
├── app/
│   ├── database/
│   │   ├── __init__.py
│   │   └── connection.py
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   └── products.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── product.py
│   │
│   ├── __init__.py
│   └── main.py
│
├── tests/
│   ├── __init__.py
│   └── test_main.py
│
├── .dockerignore
├── .env.example
├── .gitignore
├── compose.yaml
├── Dockerfile
└── requirements.txt
```

> A estrutura poderá evoluir conforme novos módulos e testes forem implementados.

---

## ⚙️ Funcionalidades implementadas

### 📦 Gerenciamento de produtos

A API disponibiliza operações CRUD:

- Cadastro de produtos.
- Listagem de produtos.
- Consulta de produto por identificador.
- Atualização de produtos.
- Exclusão de produtos.

### 🧾 Validação de dados

Os schemas utilizam Pydantic para validar as informações recebidas.

Exemplos de validações:

- Nome com tamanho mínimo e máximo.
- Descrição limitada a 500 caracteres.
- Preço não negativo.
- Quantidade não negativa.
- Categoria obrigatória.

### ⚡ Cache com Redis

A listagem de produtos utiliza Redis para armazenar temporariamente os resultados.

Características:

- Chave de cache: `products`.
- Tempo de expiração: 30 segundos.
- Invalidação após criação, atualização e exclusão de produtos.

### 🐳 Infraestrutura Docker

O Docker Compose gerencia os serviços da aplicação:

- API Python.
- PostgreSQL.
- Redis.

Os serviços possuem verificações de saúde para acompanhar a disponibilidade dos bancos de dados.

---

## 🔌 Endpoints da API

A documentação interativa é disponibilizada pelo Swagger UI.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Rota principal |
| GET | `/health` | Verificação de saúde |
| POST | `/products/` | Cadastrar produto |
| GET | `/products/` | Listar produtos |
| GET | `/products/{product_id}` | Consultar produto |
| PUT | `/products/{product_id}` | Atualizar produto |
| DELETE | `/products/{product_id}` | Excluir produto |

### Exemplo de cadastro

**POST** `/products/`

```json
{
  "name": "Notebook Dell",
  "description": "Notebook empresarial com 16GB RAM e SSD",
  "price": 3699.90,
  "quantity": 12,
  "category": "Informatica"
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "name": "Notebook Dell",
  "description": "Notebook empresarial com 16GB RAM e SSD",
  "price": "3699.90",
  "quantity": 12,
  "category": "Informatica"
}
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, tenha instalado:

- Docker Engine ou Docker Desktop.
- Docker Compose.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/lulavalenca/devstock.git
```

Entre na pasta:

```bash
cd devstock
```

### 2. Configurar as variáveis de ambiente

Crie seu arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Configure as variáveis:

```env
DB_HOST=db
DB_NAME=labdb
DB_USER=labuser
DB_PASSWORD=altere-esta-senha

REDIS_HOST=redis
```

**Importante:** utilize uma senha própria para seu ambiente. O arquivo `.env` não deve ser enviado ao GitHub.

### 3. Construir e iniciar os containers

```bash
docker compose up -d --build
```

### 4. Verificar os serviços

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

### 5. Acessar a documentação

Com a aplicação em execução:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Healthcheck:** http://localhost:8000/health

---

## 🧪 Testes automatizados

O projeto utiliza Pytest para validar o comportamento da aplicação.

Para executar os testes dentro do container:

```bash
docker exec -e DB_NAME=devstock_test python-api \
  pytest -v -p no:cacheprovider tests/
```

O ambiente possui um banco separado chamado `devstock_test`, evitando utilizar o banco principal durante a execução dos testes.

O teste inicial da rota principal já foi executado com sucesso.

A cobertura automatizada das operações CRUD está planejada para as próximas etapas.

---

## 🔐 Segurança e boas práticas

Algumas práticas adotadas no projeto:

- Utilização de variáveis de ambiente para configuração.
- Separação entre código e credenciais.
- Arquivo `.env` excluído do controle de versão.
- Container da API executado com usuário não privilegiado.
- Persistência de dados com volumes Docker.
- Banco de testes separado do banco principal.
- Validação de dados com Pydantic.

> Este projeto está em desenvolvimento e utiliza configurações voltadas ao ambiente de aprendizado. Antes de uma implantação em produção, são necessárias revisões adicionais de segurança, credenciais, autenticação, permissões e configuração do PostgreSQL.

---

## 🗺️ Roadmap

- [x] Estrutura inicial da aplicação FastAPI.
- [x] Containerização com Docker.
- [x] Integração com PostgreSQL.
- [x] Integração com Redis.
- [x] Implementação do CRUD de produtos.
- [x] Validação de dados com Pydantic.
- [x] Cache da listagem de produtos.
- [x] Invalidação de cache após alterações.
- [x] Banco de dados separado para testes.
- [x] Primeiro teste automatizado da rota principal.
- [ ] Organização completa da infraestrutura de testes.
- [ ] Testes automatizados de todas as operações CRUD.
- [ ] Testes de integração com Redis.
- [ ] Documentação de arquitetura aprimorada.
- [ ] Pipeline de integração contínua com GitHub Actions.
- [ ] Melhorias adicionais de segurança e configuração.

---

## 👨‍💻 Autor

Projeto desenvolvido como parte de uma jornada prática de estudos em desenvolvimento Backend, Python, Docker, bancos de dados e infraestrutura de aplicações.

**DevStock** — Aprendizado, prática e evolução contínua. 🚀

---

<p align="center">
  ⭐ Se este projeto despertou seu interesse, considere deixar uma estrela no repositório!
</p>