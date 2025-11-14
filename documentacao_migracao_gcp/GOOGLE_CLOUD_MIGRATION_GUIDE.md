# 🚀 Guia de Migração para Google Cloud - DTTools

**Data:** 14 de Novembro de 2025  
**Versão:** 1.0.0  
**Objetivo:** Guia prático passo a passo para migrar DTTools para Google Cloud Platform

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Documento de Avaliação do Projeto Atual** lido e compreendido
- ✅ **Conta Google** (gmail ou workspace)
- ✅ **Cartão de crédito** para billing do Google Cloud
- ✅ **Acesso ao repositório Git** do DTTools
- ✅ **Credenciais atuais:**
  - Render.com (para backup)
  - Neon Database (para export)
  - Stripe (API keys)
  - Gemini AI (API key)
  - Google OAuth (client ID/secret)

---

## 🎯 Visão Geral da Migração

### Arquitetura Final

```
Render.com (atual)  →  Google Cloud Platform (novo)
    ↓                        ↓
PostgreSQL (Neon)   →  Cloud SQL (PostgreSQL)
    ↓                        ↓
Express + React     →  Cloud Run (Container)
    ↓                        ↓
Assets no servidor  →  Cloud Storage + CDN
```

### Tempo Estimado Total: **7-10 dias**

---

## 📅 Etapa 1: Setup Google Cloud (Dia 1-2)

### 1.1 Criar Conta Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Faça login com conta Google
3. Clique em "Ativar conta gratuita"
4. Preencha dados de billing (cartão de crédito)
5. **Bônus:** Você ganha $300 de crédito grátis por 90 dias!

### 1.2 Instalar Google Cloud SDK

**Linux/Mac:**
```bash
# Baixar e instalar
curl https://sdk.cloud.google.com | bash

# Reiniciar terminal
exec -l $SHELL

# Inicializar
gcloud init
```

**Windows:**
- Baixar: https://cloud.google.com/sdk/docs/install
- Executar instalador
- Abrir Google Cloud SDK Shell
- Executar: `gcloud init`

### 1.3 Criar Projeto GCP

```bash
# Definir variáveis
PROJECT_ID="dttools-production"
REGION="southamerica-east1"  # São Paulo

# Criar projeto
gcloud projects create $PROJECT_ID --name="DTTools Production"

# Definir como projeto ativo
gcloud config set project $PROJECT_ID

# Habilitar billing (via console web)
# https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID
```

### 1.4 Habilitar APIs Necessárias

```bash
# Habilitar todas as APIs de uma vez
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  compute.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com

# Verificar APIs habilitadas
gcloud services list --enabled
```

---

## 📦 Etapa 2: Configurar Cloud SQL (Dia 2)

### 2.1 Criar Instância PostgreSQL

```bash
# Variáveis
INSTANCE_NAME="dttools-db"
DB_NAME="dttools"
DB_USER="dttools_user"
DB_PASSWORD="[GERAR_SENHA_FORTE]"  # Exemplo: openssl rand -base64 32

# Criar instância Cloud SQL
gcloud sql instances create $INSTANCE_NAME \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=$REGION \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04 \
  --database-flags=max_connections=200

# Criar database
gcloud sql databases create $DB_NAME \
  --instance=$INSTANCE_NAME

# Criar usuário
gcloud sql users create $DB_USER \
  --instance=$INSTANCE_NAME \
  --password=$DB_PASSWORD
```

### 2.2 Conectar localmente (para testes)

```bash
# Instalar Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.0.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Obter connection name
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe $INSTANCE_NAME --format='value(connectionName)')
echo "Connection Name: $INSTANCE_CONNECTION_NAME"

# Iniciar proxy (em outro terminal)
./cloud-sql-proxy $INSTANCE_CONNECTION_NAME &

# Testar conexão
psql "host=127.0.0.1 port=5432 user=$DB_USER dbname=$DB_NAME"
```

### 2.3 Migrar Dados do Neon

```bash
# No seu ambiente atual (Render/local)
# Fazer backup do Neon Database
pg_dump $DATABASE_URL > dttools_backup.sql

# Copiar para Cloud Storage temporariamente
gsutil mb -l $REGION gs://dttools-temp-backup/
gsutil cp dttools_backup.sql gs://dttools-temp-backup/

# Importar para Cloud SQL
gcloud sql import sql $INSTANCE_NAME \
  gs://dttools-temp-backup/dttools_backup.sql \
  --database=$DB_NAME

# Limpar bucket temporário
gsutil rm -r gs://dttools-temp-backup/
```

### 2.4 Obter Database URL

```bash
# Obter IP público
DB_HOST=$(gcloud sql instances describe $INSTANCE_NAME --format='value(ipAddresses[0].ipAddress)')

# Criar DATABASE_URL
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME?sslmode=require"
echo "DATABASE_URL=$DATABASE_URL"

# Salvar para usar depois
echo $DATABASE_URL > .gcp_database_url
```

---

## 🔐 Etapa 3: Configurar Secret Manager (Dia 2)

### 3.1 Criar Secrets

```bash
# Criar secrets (um por um)

# 1. Database URL
echo -n "$DATABASE_URL" | gcloud secrets create database-url \
  --data-file=- \
  --replication-policy="automatic"

# 2. Session Secret
SESSION_SECRET=$(openssl rand -base64 64)
echo -n "$SESSION_SECRET" | gcloud secrets create session-secret \
  --data-file=- \
  --replication-policy="automatic"

# 3. Gemini API Key (do seu .env atual)
echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# 4. Stripe Secret Key
echo -n "$STRIPE_SECRET_KEY" | gcloud secrets create stripe-secret-key \
  --data-file=- \
  --replication-policy="automatic"

# 5. Stripe Webhook Secret
echo -n "$STRIPE_WEBHOOK_SECRET" | gcloud secrets create stripe-webhook-secret \
  --data-file=- \
  --replication-policy="automatic"

# 6. Google OAuth Client ID
echo -n "$GOOGLE_CLIENT_ID" | gcloud secrets create google-client-id \
  --data-file=- \
  --replication-policy="automatic"

# 7. Google OAuth Client Secret
echo -n "$GOOGLE_CLIENT_SECRET" | gcloud secrets create google-client-secret \
  --data-file=- \
  --replication-policy="automatic"
```

### 3.2 Verificar Secrets

```bash
# Listar todos os secrets
gcloud secrets list

# Ver valor de um secret (para testar)
gcloud secrets versions access latest --secret="database-url"
```

---

## 🐳 Etapa 4: Dockerizar a Aplicação (Dia 3)

### 4.1 Criar Dockerfile

Criar arquivo `/workspace/Dockerfile`:

```dockerfile
# Multi-stage build para otimização

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
COPY drizzle.config.ts ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/
COPY migrations/ ./migrations/

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários
COPY migrations/ ./migrations/
COPY shared/ ./shared/

# Criar diretório para uploads
RUN mkdir -p /app/public/uploads

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8080

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/auth/me', (r) => {process.exit(r.statusCode === 200 || r.statusCode === 401 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "dist/index.js"]
```

### 4.2 Criar .dockerignore

Criar arquivo `/workspace/.dockerignore`:

```
node_modules/
dist/
client/dist/
.git/
.env
.env.*
*.log
.DS_Store
coverage/
.vscode/
.idea/
*.md
docs/
marketing/
attached_assets/
wireframes/
```

### 4.3 Testar Build Local

```bash
# No diretório do projeto
cd /workspace

# Build da imagem
docker build -t dttools:test .

# Testar localmente (com variáveis de ambiente)
docker run -p 8080:8080 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e SESSION_SECRET="test-secret" \
  -e NODE_ENV="production" \
  dttools:test

# Testar no browser: http://localhost:8080
```

### 4.4 Push para Artifact Registry

```bash
# Criar repositório
gcloud artifacts repositories create dttools-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="DTTools Docker images"

# Configurar Docker para usar gcloud
gcloud auth configure-docker $REGION-docker.pkg.dev

# Tag da imagem
IMAGE_URL="$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:latest"
docker tag dttools:test $IMAGE_URL

# Push
docker push $IMAGE_URL
```

---

## 🚢 Etapa 5: Deploy no Cloud Run (Dia 4)

### 5.1 Criar Service Account

```bash
# Criar service account
SA_NAME="dttools-cloudrun-sa"
gcloud iam service-accounts create $SA_NAME \
  --display-name="DTTools Cloud Run Service Account"

# Obter email do SA
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Dar permissões necessárias
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/storage.objectAdmin"
```

### 5.2 Deploy Inicial

```bash
# Variáveis
SERVICE_NAME="dttools-app"
IMAGE_URL="$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:latest"

# Deploy
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_URL \
  --region=$REGION \
  --platform=managed \
  --service-account=$SA_EMAIL \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=100 \
  --port=8080 \
  --timeout=300 \
  --concurrency=80 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --set-secrets="DATABASE_URL=database-url:latest,SESSION_SECRET=session-secret:latest,GEMINI_API_KEY=gemini-api-key:latest,STRIPE_SECRET_KEY=stripe-secret-key:latest,STRIPE_WEBHOOK_SECRET=stripe-webhook-secret:latest,GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest" \
  --add-cloudsql-instances=$INSTANCE_CONNECTION_NAME

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
echo "Serviço deployado em: $SERVICE_URL"
```

### 5.3 Testar Deploy

```bash
# Health check
curl $SERVICE_URL/api/auth/me

# Abrir no browser
echo "Abra no navegador: $SERVICE_URL"
```

---

## 🔄 Etapa 6: Configurar CI/CD com Cloud Build (Dia 4-5)

### 6.1 Criar cloudbuild.yaml

Criar arquivo `/workspace/cloudbuild.yaml`:

```yaml
steps:
  # Step 1: Build da imagem Docker
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:$COMMIT_SHA'
      - '-t'
      - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:latest'
      - '.'
    id: 'build-image'

  # Step 2: Push da imagem
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:$COMMIT_SHA'
    id: 'push-image'

  # Step 3: Push tag latest
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:latest'
    id: 'push-latest'

  # Step 4: Deploy no Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'dttools-app'
      - '--image=$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:$COMMIT_SHA'
      - '--region=$REGION'
      - '--platform=managed'
    id: 'deploy-cloudrun'

images:
  - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:$COMMIT_SHA'
  - '$REGION-docker.pkg.dev/$PROJECT_ID/dttools-repo/dttools:latest'

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

substitutions:
  _REGION: 'southamerica-east1'
```

### 6.2 Conectar ao GitHub

```bash
# Via Console Web:
# 1. Acesse: https://console.cloud.google.com/cloud-build/triggers
# 2. Clique em "Conectar repositório"
# 3. Selecione GitHub
# 4. Autorize o Google Cloud
# 5. Selecione seu repositório DTTools

# Criar trigger via CLI (alternativa)
gcloud builds triggers create github \
  --name="dttools-main-trigger" \
  --repo-name="dttools-app" \
  --repo-owner="[SEU_GITHUB_USERNAME]" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml"
```

### 6.3 Testar CI/CD

```bash
# Fazer um commit de teste
cd /workspace
git add cloudbuild.yaml
git commit -m "feat: Add Cloud Build CI/CD"
git push origin main

# Acompanhar build
gcloud builds list --limit=1
gcloud builds log [BUILD_ID] --stream
```

---

## 🌐 Etapa 7: Configurar Domínio Customizado (Dia 5)

### 7.1 Mapear Domínio no Cloud Run

```bash
# Adicionar domínio
gcloud run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=www.designthinkingtools.com \
  --region=$REGION

# Obter registros DNS necessários
gcloud run domain-mappings describe \
  --domain=www.designthinkingtools.com \
  --region=$REGION
```

### 7.2 Atualizar DNS

**Na sua plataforma de DNS (ex: Cloudflare, GoDaddy):**

1. Adicione registro CNAME:
   ```
   Nome: www
   Tipo: CNAME
   Valor: ghs.googlehosted.com
   TTL: 3600
   ```

2. Adicione registro A (para domínio raiz):
   ```
   Nome: @
   Tipo: A
   Valor: [IPs fornecidos pelo gcloud]
   TTL: 3600
   ```

### 7.3 Verificar SSL

```bash
# Aguardar certificado SSL (pode levar até 15 minutos)
watch -n 30 "gcloud run domain-mappings describe --domain=www.designthinkingtools.com --region=$REGION | grep -A5 certificate"

# Testar HTTPS
curl -I https://www.designthinkingtools.com
```

---

## 📦 Etapa 8: Configurar Cloud Storage (Dia 5)

### 8.1 Criar Buckets

```bash
# Bucket para uploads de usuários
gsutil mb -l $REGION -c STANDARD gs://dttools-uploads/
gsutil iam ch allUsers:objectViewer gs://dttools-uploads/

# Bucket para backups
gsutil mb -l $REGION -c STANDARD gs://dttools-backups/

# Configurar CORS para uploads
cat > cors.json << EOF
[
  {
    "origin": ["https://www.designthinkingtools.com"],
    "method": ["GET", "POST", "PUT"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://dttools-uploads/
```

### 8.2 Atualizar Código para Usar Cloud Storage

**Modificar `/workspace/server/routes.ts`:**

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'dttools-uploads';

// Exemplo: Upload de imagem
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(`${Date.now()}-${file.originalname}`);
  
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype
    }
  });
  
  blobStream.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
  
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    res.json({ url: publicUrl });
  });
  
  blobStream.end(file.buffer);
});
```

---

## 📊 Etapa 9: Configurar Monitoramento (Dia 6)

### 9.1 Criar Dashboard

```bash
# Via Console Web:
# 1. Acesse: https://console.cloud.google.com/monitoring
# 2. Clique em "Dashboards" → "Criar Dashboard"
# 3. Adicione gráficos:
#    - Request Count (Cloud Run)
#    - Request Latency (Cloud Run)
#    - Container CPU utilization
#    - Container Memory utilization
#    - Instance Count
```

### 9.2 Configurar Alertas

```bash
# Criar alerta de alta latência
gcloud alpha monitoring policies create \
  --notification-channels=[CHANNEL_ID] \
  --display-name="DTTools - High Latency" \
  --condition-display-name="Request latency > 2s" \
  --condition-threshold-value=2000 \
  --condition-threshold-duration=300s \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_latencies"'

# Criar alerta de erros
gcloud alpha monitoring policies create \
  --notification-channels=[CHANNEL_ID] \
  --display-name="DTTools - Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=60s \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.label.response_code_class="5xx"'
```

### 9.3 Configurar Logs Structurados

**Modificar código para usar Winston (opcional):**

```bash
npm install winston @google-cloud/logging-winston
```

```typescript
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const loggingWinston = new LoggingWinston();

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    loggingWinston,
  ],
});

// Uso
logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
```

---

## ✅ Etapa 10: Testes Finais (Dia 7-8)

### 10.1 Checklist de Testes Funcionais

```bash
# Criar script de testes
cat > test-production.sh << 'EOF'
#!/bin/bash

BASE_URL="https://www.designthinkingtools.com"

echo "🧪 Testando DTTools em produção..."

# 1. Health check
echo "1. Health check..."
curl -f $BASE_URL/api/auth/me || echo "❌ Health check failed"

# 2. Criar conta
echo "2. Criando conta de teste..."
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test-'$(date +%s)'","password":"TestPass123!"}' || echo "❌ Register failed"

# 3. Login
echo "3. Login..."
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"TestPass123!"}' -c cookies.txt || echo "❌ Login failed"

# 4. Criar projeto
echo "4. Criando projeto..."
curl -X POST $BASE_URL/api/projects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Test Project","description":"Test"}' || echo "❌ Create project failed"

# 5. Testar IA
echo "5. Testando IA..."
curl -X POST $BASE_URL/api/ai/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"message":"Olá!","context":{}}' || echo "❌ AI chat failed"

echo "✅ Testes concluídos!"
EOF

chmod +x test-production.sh
./test-production.sh
```

### 10.2 Teste de Performance

```bash
# Instalar Apache Bench
sudo apt-get install apache2-utils

# Load test
ab -n 1000 -c 10 https://www.designthinkingtools.com/

# Ou usar k6
cat > load-test.js << EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let res = http.get('https://www.designthinkingtools.com/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
EOF

k6 run load-test.js
```

### 10.3 Teste de Segurança

```bash
# Verificar headers de segurança
curl -I https://www.designthinkingtools.com/ | grep -i "security\|x-frame\|content-security"

# Verificar SSL
openssl s_client -connect www.designthinkingtools.com:443 -servername www.designthinkingtools.com

# Scan de vulnerabilidades (opcional)
# nmap -p 443 www.designthinkingtools.com
```

---

## 🎉 Etapa 11: Cutover e Lançamento (Dia 9-10)

### 11.1 Preparação Final

```bash
# 1. Backup final do Render
pg_dump $OLD_DATABASE_URL > final_backup_$(date +%Y%m%d).sql

# 2. Sincronizar últimos dados (se necessário)
# ... migração incremental ...

# 3. Verificar que tudo funciona no GCP
./test-production.sh

# 4. Comunicar aos usuários (via email/blog)
```

### 11.2 Atualizar DNS para GCP

**Na sua plataforma de DNS:**

1. **Reduzir TTL para 300s** (5 minutos) - fazer 24h antes
2. **Atualizar registros CNAME/A** para apontar ao Cloud Run
3. **Aguardar propagação** (5-30 minutos)
4. **Verificar:**
   ```bash
   dig www.designthinkingtools.com
   nslookup www.designthinkingtools.com
   ```

### 11.3 Monitorar Transição

```bash
# Monitorar logs em tempo real
gcloud logging tail "resource.type=cloud_run_revision" --format=json

# Monitorar métricas
# Acessar: https://console.cloud.google.com/monitoring/dashboards

# Verificar erros
gcloud logging read "severity>=ERROR" --limit 50 --format json
```

### 11.4 Desativar Render (após confirmação)

⚠️ **Aguardar 24-48h antes de desativar!**

1. Verificar que 100% do tráfego está no GCP
2. Fazer backup final do Render
3. Pausar aplicação no Render (não deletar ainda)
4. Aguardar mais 7 dias de observação
5. Deletar recursos no Render

---

## 🎯 Configuração do Google Code Assist

### Instalação e Setup

#### 1. Instalar VS Code (se ainda não tiver)

```bash
# Linux (Debian/Ubuntu)
wget -O code.deb https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64
sudo dpkg -i code.deb

# Mac
brew install --cask visual-studio-code

# Windows
# Baixar de: https://code.visualstudio.com/
```

#### 2. Instalar Extensão Cloud Code

1. Abrir VS Code
2. Ir em Extensions (Ctrl+Shift+X)
3. Buscar "Cloud Code"
4. Instalar "Cloud Code" (by Google Cloud)

#### 3. Autenticar com Google Cloud

```bash
# No terminal
gcloud auth application-default login

# Ou dentro do VS Code:
# 1. Cmd/Ctrl + Shift + P
# 2. Digitar "Cloud Code: Sign In"
# 3. Selecionar conta Google
```

#### 4. Configurar Projeto

1. No VS Code, pressione Cmd/Ctrl + Shift + P
2. Digite "Cloud Code: Select Project"
3. Escolha `dttools-production`

#### 5. Usar Gemini Code Assist

1. Pressione Cmd/Ctrl + Shift + P
2. Digite "Gemini: Open Chat"
3. Ou use atalho: Cmd/Ctrl + Alt + G

**Exemplos de uso:**

- "Refatorar esta função para usar async/await"
- "Adicionar tratamento de erro neste endpoint"
- "Gerar testes unitários para este componente"
- "Explicar o que este código faz"

---

## 📊 Resumo de Custos

### Custos Mensais Estimados (após Free Tier)

| Serviço | Custo Mensal |
|---------|--------------|
| Cloud Run | $20-40 |
| Cloud SQL | $25-50 |
| Cloud Storage | $1-5 |
| Cloud CDN | $10-20 |
| Secret Manager | $1 |
| Monitoring/Logging | $5-10 |
| Load Balancer | $18 |
| **TOTAL** | **$80-144/mês** |

### Free Tier (primeiros 90 dias)
- ✅ $300 de crédito grátis
- ✅ Suficiente para ~2-6 meses de uso

---

## 🆘 Troubleshooting

### Problema: Deploy falhou

```bash
# Ver logs do Cloud Build
gcloud builds log [BUILD_ID]

# Ver logs do Cloud Run
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### Problema: Banco não conecta

```bash
# Verificar Cloud SQL Proxy
gcloud sql instances describe $INSTANCE_NAME

# Testar conexão
gcloud sql connect $INSTANCE_NAME --user=$DB_USER
```

### Problema: Secrets não funcionam

```bash
# Verificar permissões do Service Account
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:$SA_EMAIL"

# Dar permissão de accessor
gcloud secrets add-iam-policy-binding [SECRET_NAME] \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

### Problema: Cold start lento

```bash
# Aumentar min-instances
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --min-instances=2
```

---

## 📞 Suporte

### Documentação Google Cloud
- **Cloud Run:** https://cloud.google.com/run/docs
- **Cloud SQL:** https://cloud.google.com/sql/docs
- **Secret Manager:** https://cloud.google.com/secret-manager/docs
- **Cloud Build:** https://cloud.google.com/build/docs

### Comunidade
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/google-cloud-platform
- **Google Cloud Community:** https://www.googlecloudcommunity.com/

### Suporte Pago
- **Google Cloud Support:** https://cloud.google.com/support

---

## ✅ Checklist Final de Migração

- [ ] Conta Google Cloud criada e billing configurado
- [ ] Cloud SQL criado e dados migrados
- [ ] Secrets criados no Secret Manager
- [ ] Dockerfile criado e testado
- [ ] Deploy inicial no Cloud Run funcionando
- [ ] CI/CD configurado com Cloud Build
- [ ] Domínio customizado mapeado
- [ ] SSL funcionando
- [ ] Cloud Storage configurado
- [ ] Monitoramento e alertas ativos
- [ ] Testes funcionais passando
- [ ] Teste de performance satisfatório
- [ ] DNS atualizado para GCP
- [ ] Tráfego 100% no GCP
- [ ] Render desativado (após observação)

---

## 🎓 Próximos Passos Após Migração

1. **Otimização de Custos**
   - Revisar uso de recursos
   - Ajustar min/max instances
   - Configurar budgets e alertas

2. **Melhorias de Performance**
   - Implementar caching (Redis/Memorystore)
   - Otimizar queries do banco
   - Implementar CDN para mais assets

3. **Alta Disponibilidade**
   - Habilitar HA no Cloud SQL
   - Configurar multi-region no Cloud Run
   - Implementar disaster recovery

4. **Segurança Avançada**
   - Implementar Cloud Armor (WAF)
   - Configurar VPC Service Controls
   - Habilitar Cloud IAP

5. **Observabilidade Avançada**
   - Implementar distributed tracing
   - Configurar SLIs/SLOs
   - Criar runbooks de incidentes

---

**Última Atualização:** 14 de Novembro de 2025  
**Versão:** 1.0.0  
**Status:** Pronto para Execução

---

🚀 **Boa sorte com a migração! Você está transformando o DTTools em uma plataforma de classe mundial!**
