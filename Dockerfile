FROM python:3.12-slim

#Diretório de trabalho
WORKDIR /app

#Configuração do Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependências
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Criar usuário sem privilégios administrativos
RUN groupadd --system app && \
    useradd --system --gid app app

# Copiar aplicação
COPY --chown=app:app app/ ./app/

# Copiar testes automatizados
COPY --chown=app:app tests/ ./tests/

# Executar como usuário não privilegiado
USER app

# Porta da API
EXPOSE 8000

# Inicializar aplicação
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
