# 🚀 Guia de Deployment: Vercel + Railway

Este guia mostra como fazer o deploy do DTTools usando Vercel (frontend) + Railway (backend + PostgreSQL).

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Conta no [Railway](https://railway.app) (trial $5 grátis)
3. Código no GitHub (ou outro repositório git)

---

## 🎯 Parte 1: Deploy do Backend no Railway

### Passo 1: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione o repositório **dt-tools**
5. Aguarde o deploy automático

### Passo 2: Adicionar PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Escolha **"Database" → "PostgreSQL"**
3. Aguarde a criação do banco de dados
4. O Railway conectará automaticamente via `DATABASE_URL`

### Passo 3: Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```
NODE_ENV=production
SESSION_SECRET=<gere-uma-chave-aleatoria-aqui>
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=5000
```

**Gerar SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### Passo 4: Configurar Domínio (Opcional)

1. No Railway, vá em **Settings**
2. Em **Networking**, clique em **Generate Domain**
3. Copie a URL gerada (ex: `dttools-backend.up.railway.app`)
4. **IMPORTANTE:** Salve essa URL para usar no Vercel

### Passo 5: Forçar Redeploy (se necessário)

Se o deploy falhar:
1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Escolha **"Redeploy"**

---

## 🎨 Parte 2: Deploy do Frontend no Vercel

### Passo 1: Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..." → "Project"**
3. Escolha **"Import Git Repository"**
4. Selecione o repositório **dt-tools**

### Passo 2: Configurar Build Settings

O Vercel detectará o `vercel.json` automaticamente. Verifique:

- **Build Command:** `vite build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

### Passo 3: Configurar Variáveis de Ambiente

Em **Environment Variables**, adicione:

```
VITE_API_URL=https://SEU-BACKEND.up.railway.app
```

**IMPORTANTE:** Use a URL do Railway que você copiou no Passo 1.4!

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (1-2 minutos)
3. Acesse a URL gerada pelo Vercel

### Passo 5: Configurar Domínio dttools.app

1. No Vercel, vá em **Settings → Domains**
2. Adicione `dttools.app` e `www.dttools.app`
3. Configure os DNS no seu provedor:
   - **A Record:** `76.76.21.21`
   - **CNAME www:** `cname.vercel-dns.com`

---

## ✅ Parte 3: Verificação Final

### Checklist:

- [ ] Backend Railway funcionando (acesse `/api/health`)
- [ ] PostgreSQL conectado e migrations rodadas
- [ ] Frontend Vercel carregando
- [ ] Login funcionando
- [ ] Criar projeto funcionando
- [ ] Admin dashboard funcionando
- [ ] Domínio dttools.app apontando corretamente

### Testar o App:

1. Acesse `https://seu-app.vercel.app`
2. Faça login com: `dttools.app@gmail.com`
3. Crie um novo projeto
4. Verifique se os dados estão salvando

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se `VITE_API_URL` está correto no Vercel
- Confirme que o backend Railway está online

### Erro: "Database connection failed"
- Verifique se o PostgreSQL está rodando no Railway
- Confirme que `DATABASE_URL` está configurada

### Erro: "Session not working"
- Gere um novo `SESSION_SECRET`
- Redeploy o backend Railway

### CORS Errors
- O código já está configurado para aceitar requisições do Vercel
- Se persistir, adicione o domínio Vercel na lista de origins permitidas

---

## 💰 Custos Estimados

- **Vercel:** GRATUITO (100GB bandwidth/mês)
- **Railway:** 
  - Trial: $5 grátis
  - Depois: ~$5-10/mês (PostgreSQL + Backend)
- **Total mensal:** ~$5-10/mês

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Railway e Vercel
2. Consulte a documentação oficial:
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)

---

**✨ Pronto! Seu DTTools está no ar! ✨**
