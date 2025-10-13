# 🚨 DEPLOY URGENTE - Correção de Segurança

## ⚠️ PROBLEMA CRÍTICO IDENTIFICADO

**Vulnerabilidade:** Senhas não estavam sendo hashadas no signup!
- ❌ Senhas eram salvas em **texto plano** no banco
- ❌ Login falhava com erro 401
- ✅ **CORREÇÃO JÁ APLICADA no código Replit**

---

## 📋 O QUE PRECISA SER FEITO AGORA

### ✅ Código Corrigido (server/routes.ts linha 1113)
```javascript
// CRITICAL: Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);
```

### ⚠️ PROBLEMA: Correção só está no Replit, NÃO em Produção!

**Status atual:**
- ✅ **Replit (dev):** Correção aplicada, login funciona
- ❌ **Render.com (produção):** Código antigo, login falha

---

## 🚀 PASSO A PASSO PARA DEPLOY

### Opção 1: Deploy Manual via Render Dashboard (RECOMENDADO)

1. **Acesse Render Dashboard**
   - URL: https://dashboard.render.com
   - Faça login com sua conta

2. **Encontre o Serviço**
   - Procure por "DTTools" ou "designthinkingtools"
   - Clique no serviço

3. **Fazer Deploy Manual**
   - Clique no botão **"Manual Deploy"**
   - Selecione **"Deploy latest commit"**
   - Aguarde 2-3 minutos para build completar

4. **Verificar Deploy**
   - Acesse: https://www.designthinkingtools.com
   - Tente criar uma conta nova
   - Teste o login

---

### Opção 2: Deploy via Git Push (se tiver terminal com git configurado)

```bash
# Certifique-se que está no diretório do projeto
cd /caminho/do/projeto

# Adicionar mudanças
git add server/routes.ts

# Commit
git commit -m "CRITICAL: Fix password hashing on signup - security vulnerability"

# Push para Render (deploy automático)
git push origin main
```

---

## 🧪 TESTE APÓS DEPLOY

### 1. Testar Signup (criar conta)
```bash
curl -X POST https://www.designthinkingtools.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

**Resposta esperada:** Código 201 com dados do usuário

### 2. Testar Login
```bash
curl -X POST https://www.designthinkingtools.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

**Resposta esperada:** Código 200 com dados do usuário

---

## ✅ APÓS DEPLOY BEM-SUCEDIDO

### Para os Testadores:
1. **Envie este link:** https://www.designthinkingtools.com
2. **Instruções:**
   - Criar conta nova (signup)
   - Fazer login com credenciais criadas
   - Testar funcionalidades

### Para Contas Antigas (se existirem):
⚠️ **Contas criadas ANTES da correção terão senhas em texto plano!**

**Solução:** Resetar senhas no banco de produção
```sql
-- Conectar no banco de produção via Render dashboard
UPDATE users 
SET password = crypt('NovaSenha123!@', gen_salt('bf', 10))
WHERE email = 'email@usuario.com';
```

---

## 🔍 PROBLEMAS CONHECIDOS E SOLUÇÕES

### Problema: Deploy Falha
**Solução:**
1. Verificar logs no Render
2. Verificar que `bcrypt` está em `package.json`
3. Tentar rebuild completo

### Problema: Login ainda falha após deploy
**Solução:**
1. Verificar que deploy completou (checar Render logs)
2. Limpar cache do navegador
3. Criar conta NOVA (não usar conta antiga)

---

## 📞 SUPORTE

**Se deploy não funcionar:**
1. Capture screenshot dos logs do Render
2. Verifique mensagem de erro específica
3. Entre em contato com suporte técnico

---

**Última atualização:** 13 de Outubro de 2025, 21:28  
**Status:** Aguardando deploy em produção  
**Prioridade:** 🚨 CRÍTICA
