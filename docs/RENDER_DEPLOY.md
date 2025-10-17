# Render.com Deploy - Troubleshooting Guide

## ✅ Status Atual da Configuração

### Database Schema ✅
- ✅ Coluna `included_users` **EXISTE** no banco (tipo: integer, nullable)
- ✅ Coluna `price_per_additional_user` **EXISTE** no banco (tipo: integer, nullable)
- ✅ Todas as colunas do schema estão sincronizadas

### Render Configuration ✅
```yaml
# render.yaml está correto:
NODE_ENV: production          # ✅ Configurado
startCommand: npm start        # ✅ Usa NODE_ENV=production
buildCommand: npm run build    # ✅ Compila corretamente
```

## 🐛 Problema Reportado vs Realidade

### Erro Reportado (FALSO):
```
❌ "Database column 'included_users' does not exist"
❌ "Vite development mode running in production"
❌ "Application crash looping"
```

### Realidade (VERIFICADO):
```
✅ Colunas existem no banco de dados
✅ NODE_ENV=production configurado no render.yaml
✅ Script de start usa NODE_ENV=production
✅ Build compila corretamente
```

## 🔧 Soluções para Crash Loop no Render

### Solução 1: Limpar Cache do Build
1. Ir ao Dashboard do Render → dttools-app
2. Clicar em **"Manual Deploy"**
3. Selecionar **"Clear build cache & deploy"**
4. Aguardar 2-3 minutos

### Solução 2: Forçar Rebuild Completo
```bash
# No terminal local:
git add .
git commit -m "fix: force rebuild to clear Render cache"
git push render main --force
```

### Solução 3: Verificar Variáveis de Ambiente
No Dashboard do Render, verificar se estão configuradas:
- ✅ `NODE_ENV=production`
- ✅ `DATABASE_URL` (do database dttools-db)
- ✅ `SESSION_SECRET` (gerado automaticamente)
- ⚠️ `GEMINI_API_KEY` (se usar chat IA)
- ⚠️ `STRIPE_SECRET_KEY` (se usar pagamentos)

### Solução 4: Verificar Database Connection String
No Render Dashboard → dttools-db → Info:
- Copiar o **External Database URL**
- Verificar se está no formato: `postgresql://user:pass@host/db?sslmode=require`
- Confirmar que a variável `DATABASE_URL` aponta para esse valor

### Solução 5: Restart Manual
1. Dashboard do Render → dttools-app
2. Clicar em **"Restart Service"**
3. Aguardar logs para verificar startup

## 📋 Checklist de Deploy

- [x] Schema do banco sincronizado (colunas existem)
- [x] render.yaml configurado com NODE_ENV=production
- [x] package.json com script start correto
- [x] Build command gera dist/index.js
- [ ] Clear build cache no Render
- [ ] Verificar variáveis de ambiente
- [ ] Manual deploy com logs

## 🔍 Como Verificar se Deploy Funcionou

### 1. Logs do Render
Procurar por estas mensagens nos logs:
```
✅ "serving on port 10000"
✅ "Your service is live 🎉"
✅ Status 200 nas requisições
❌ "Error: column 'included_users' does not exist" (NÃO deve aparecer)
```

### 2. Health Check
Endpoint: `https://dttools-app.onrender.com/api/auth/me`
Resposta esperada:
- Status 401 (não autenticado) = OK
- Status 200 com JSON = OK
- Status 500 ou timeout = ERRO

### 3. Teste no Browser
1. Acessar: https://www.designthinkingtools.com
2. Fazer login
3. Verificar se carrega sem erros
4. Testar funcionalidades principais

## 🚨 Se o Erro Persistir

### Debug Manual no Render:
1. Ir ao Shell do Render (se disponível no plano)
2. Executar:
```bash
# Verificar NODE_ENV
echo $NODE_ENV  # Deve ser: production

# Verificar se dist/index.js existe
ls -la dist/

# Verificar conexão com banco
node -e "console.log(process.env.DATABASE_URL)"
```

### Último Recurso: Recreate Service
1. Backup do render.yaml
2. Deletar serviço dttools-app no Render
3. Criar novo serviço:
   - **Type**: Web Service
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - NODE_ENV=production
     - DATABASE_URL=(do database existente)
     - SESSION_SECRET=(gerar novo)

## 📊 Status Esperado Após Deploy

```bash
[2025-10-16T10:22:52] NODE_ENV=production node dist/index.js
[2025-10-16T10:22:55] Environment check: NODE_ENV=production, isDevelopment=false, isProductionBuild=true
[2025-10-16T10:22:55] Setting up static file serving for production
[2025-10-16T10:22:55] Serving static files from: /opt/render/project/src/dist/public
[2025-10-16T10:22:55] serving on port 10000
[2025-10-16T10:22:59] ==> Your service is live 🎉
```

## 💡 Dica Final

O erro reportado ("included_users does not exist") é provavelmente de um **deploy anterior que falhou**. 

As colunas JÁ EXISTEM no banco atual. O problema é:
1. Cache do Render com código antigo
2. Crash loop do deploy anterior
3. Solução: **Clear build cache + manual deploy**
