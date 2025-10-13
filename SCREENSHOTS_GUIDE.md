# 📸 GUIA DE SCREENSHOTS - DTTOOLS

## 🎯 TODAS AS TELAS DO SISTEMA

### 📱 RESOLUÇÃO DOS SCREENSHOTS

#### Desktop (1920 x 1080)
- Navegador Chrome em tela cheia
- Simula uso em computadores/laptops

#### Tablet (768 x 1024)
- Simula iPad e tablets Android
- Layout responsivo intermediário

#### Mobile (375 x 812)
- Simula iPhone 13/14/15
- Layout mobile otimizado

---

## 📋 LISTA COMPLETA DE TELAS

### 🌐 PÁGINAS PÚBLICAS (Sem Login)

#### 1. Landing Page
- **URL**: `/`
- **Descrição**: Página inicial com apresentação do DTTools
- **Destaque**: Hero section, features, call-to-action
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 2. Pricing (Planos)
- **URL**: `/pricing`
- **Descrição**: Página de planos e preços
- **Destaque**: Cards dos 3 planos (Free, Pro, Enterprise)
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 3. Library (Biblioteca)
- **URL**: `/library`
- **Descrição**: Biblioteca de artigos sobre Design Thinking
- **Destaque**: Cards de artigos, categorias
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 4. Login
- **URL**: `/login`
- **Descrição**: Tela de login
- **Destaque**: Formulário email + senha
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 5. Signup (Cadastro)
- **URL**: `/signup`
- **Descrição**: Tela de registro
- **Destaque**: Form com nome, email, confirmação, senha, força
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 6. Help Center (Ajuda)
- **URL**: `/help`
- **Descrição**: Central de ajuda com FAQs
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 7. Privacy Policy
- **URL**: `/privacy-policy`
- **Descrição**: Política de privacidade LGPD
- **Screenshot**: ✅ Desktop apenas

#### 8. Terms of Use
- **URL**: `/terms`
- **Descrição**: Termos de uso
- **Screenshot**: ✅ Desktop apenas

#### 9. Support
- **URL**: `/support`
- **Descrição**: Central de suporte
- **Screenshot**: ✅ Desktop, Tablet, Mobile

---

### 🔒 PÁGINAS PROTEGIDAS (Requer Login)

#### 10. Dashboard
- **URL**: `/dashboard`
- **Descrição**: Dashboard principal com 5 fases do Design Thinking
- **Destaque**: Cards das fases, progresso, estatísticas
- **Screenshot**: ✅ Desktop, Tablet, Mobile
- **PRINCIPAL - USAR NA APP STORE**

#### 11. Projects List
- **URL**: `/projects`
- **Descrição**: Lista de todos os projetos do usuário
- **Destaque**: Grid de cards, botão criar projeto
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 12. Project Detail - Fase 1 (Empatizar)
- **URL**: `/projects/:id` (aba Empatizar)
- **Descrição**: Ferramentas de empatia (Mapa, Personas, Entrevistas)
- **Destaque**: Mapa de Empatia interativo
- **Screenshot**: ✅ Desktop, Tablet, Mobile
- **PRINCIPAL - USAR NA APP STORE**

#### 13. Project Detail - Fase 2 (Definir)
- **URL**: `/projects/:id` (aba Definir)
- **Descrição**: POV Statements e How Might We
- **Destaque**: Formulários estruturados
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 14. Project Detail - Fase 3 (Idear)
- **URL**: `/projects/:id` (aba Idear)
- **Descrição**: Canvas de ideias, Matriz DVF
- **Destaque**: Sistema Love it/Leave it/Change it
- **Screenshot**: ✅ Desktop, Tablet, Mobile
- **PRINCIPAL - USAR NA APP STORE**

#### 15. Project Detail - Fase 4 (Prototipar)
- **URL**: `/projects/:id` (aba Prototipar)
- **Descrição**: Canvas interativo de desenho
- **Destaque**: Ferramentas de desenho, upload de imagens
- **Screenshot**: ✅ Desktop, Tablet, Mobile
- **PRINCIPAL - USAR NA APP STORE**

#### 16. Project Detail - Fase 5 (Testar)
- **URL**: `/projects/:id` (aba Testar)
- **Descrição**: Planos de teste e resultados
- **Destaque**: Formulários de feedback
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 17. Benchmarking
- **URL**: `/benchmarking`
- **Descrição**: Análise de maturidade com IA (Gemini)
- **Destaque**: Gráficos, recomendações, comparação com mercado
- **Screenshot**: ✅ Desktop, Tablet, Mobile
- **PRINCIPAL - USAR NA APP STORE**

#### 18. Chat IA
- **URL**: `/chat`
- **Descrição**: Chat com assistente IA para Design Thinking
- **Destaque**: Interface de conversa, sugestões
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 19. Profile (Perfil)
- **URL**: `/profile`
- **Descrição**: Perfil do usuário e configurações
- **Destaque**: Dados pessoais, plano, gerenciar assinatura
- **Screenshot**: ✅ Desktop, Tablet, Mobile

#### 20. Admin Panel
- **URL**: `/admin`
- **Descrição**: Painel administrativo (apenas admin)
- **Destaque**: Gerenciar artigos, usuários
- **Screenshot**: ✅ Desktop apenas

---

## 📸 SCREENSHOTS PRIORITÁRIAS PARA APP STORES

### Apple App Store (6.7" iPhone)
**Obrigatórias (mínimo 3):**
1. 📱 Dashboard - Visão geral das 5 fases
2. 🎨 Fase 1 - Mapa de Empatia
3. 💡 Fase 3 - Canvas de Ideias com Matriz DVF
4. 🎯 Fase 4 - Canvas de Protótipo
5. 📊 Benchmarking com IA

### Google Play Store (Smartphone)
**Obrigatórias (mínimo 2):**
1. 📱 Dashboard - Visão geral
2. 🎨 Mapa de Empatia
3. 💡 Canvas de Ideias
4. 🎯 Canvas de Protótipo
5. 📊 Benchmarking

---

## 🎨 DESIGN GUIDELINES PARA SCREENSHOTS

### Conteúdo de Exemplo
- Usar projeto demo: "App de Delivery Sustentável"
- Personas: "Marina, 32 anos, profissional consciente"
- Ideias: "Gamificação verde", "Embalagens biodegradáveis"
- Dados populados e realistas

### Qualidade
- Alta resolução (300 DPI)
- Cores vibrantes e contraste
- UI limpa sem erros
- Mock data profissional

### Orientação
- Desktop/Tablet: Landscape ou Portrait (conforme layout)
- Mobile: Portrait (vertical)

---

## 📦 ENTREGA FINAL

### Estrutura de Pastas
```
screenshots/
├── apple-app-store/
│   ├── iphone-6.7/
│   │   ├── 01-dashboard.png
│   │   ├── 02-empathy-map.png
│   │   ├── 03-ideation-canvas.png
│   │   ├── 04-prototype-canvas.png
│   │   └── 05-benchmarking.png
│   └── ipad-12.9/
│       └── (mesmas telas)
├── google-play/
│   ├── smartphone/
│   │   └── (5 screenshots principais)
│   └── tablet/
│       └── (opcional)
└── marketing/
    ├── desktop/
    ├── tablet/
    └── mobile/
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Mapear todas as telas (CONCLUÍDO)
2. 🔄 Criar mock data realista
3. 🔄 Gerar screenshots automatizados
4. 🔄 Revisar e ajustar qualidade
5. 🔄 Exportar nos formatos corretos
6. ✅ Entregar para você

---

**Última atualização:** 13 de Outubro de 2025
**Status:** Em progresso - Gerando screenshots
