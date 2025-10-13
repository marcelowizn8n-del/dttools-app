# 📸 COMO GERAR SCREENSHOTS DO DTTOOLS

## 🎯 3 OPÇÕES DISPONÍVEIS

Você tem **3 maneiras** de capturar screenshots profissionais do DTTools para submissão nas App Stores:

---

## ✅ OPÇÃO 1: Ferramenta Interna (MAIS FÁCIL) ⚡

**Quando usar:** Teste rápido, screenshots básicos

### Como:
1. Acesse: https://www.designthinkingtools.com/screenshots
2. Faça login
3. Navegue para página desejada
4. Clique em "Capturar Página Atual"
5. Screenshot baixa automaticamente!

**Vantagens:**
- Zero configuração
- Já funciona
- Alta qualidade

**Limitações:**
- Não escolhe resolução customizada
- Captura manual página por página

📖 **Guia completo:** Acesse `/screenshots` no site

---

## ✅ OPÇÃO 2: Extensão GoFullPage (MAIS PROFISSIONAL) ⭐

**Quando usar:** Screenshots para App Stores (Apple + Google)

### Como:
1. **Instale:** [GoFullPage Extension](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl)
2. **Configure resolução:** F12 → Ctrl+Shift+M → Digite resolução
3. **Capture:** Clique no ícone GoFullPage
4. **Salve:** Download automático em PNG

**Resoluções necessárias:**
- iPhone 6.7": **1290 x 2796** px
- Android: **1080 x 1920** px
- iPad 12.9": **2048 x 2732** px

**Vantagens:**
- ✅ Controle total de resolução
- ✅ Qualidade máxima
- ✅ Funciona em qualquer site
- ✅ GRÁTIS

📖 **Guia completo:** `GOFULLPAGE_EXTENSION_GUIDE.md`

---

## ✅ OPÇÃO 3: Script Automático (MAIS RÁPIDO) 🚀

**Quando usar:** Gerar muitos screenshots de uma vez

### Como:

#### 1. Instale Puppeteer:
```bash
npm install puppeteer --save-dev
```

#### 2. Configure credenciais:
Edite `scripts/generate-screenshots.js`:
```javascript
credentials: {
  email: 'seu-email@example.com',
  password: 'sua-senha'
}
```

#### 3. Execute:
```bash
# Gerar 5 telas principais em 3 resoluções
node scripts/generate-screenshots.js

# Ver todas as opções
node scripts/generate-screenshots.js --help
```

**O que faz:**
- ✅ Captura automaticamente 5 telas principais
- ✅ Gera em 6 resoluções diferentes
- ✅ Salva organizadamente em pastas
- ✅ Total: 30 screenshots em ~2 minutos

**Vantagens:**
- Totalmente automático
- Reproduzível
- Customizável
- Organizado

📖 **Guia completo:** `SCREENSHOTS_3_OPCOES_COMPLETO.md`

---

## 📱 5 TELAS PRINCIPAIS PARA APP STORES

Capture estas telas em **ordem de prioridade:**

1. **Dashboard** (`/dashboard`)
   - Visão geral das 5 fases do Design Thinking
   - Estatísticas e progresso

2. **Mapa de Empatia** (`/projects/1` → aba Empatizar)
   - Quadrantes interativos (Diz, Pensa, Faz, Sente)
   - Criação de personas

3. **Canvas de Ideias** (`/projects/1` → aba Idear)
   - Matriz DVF (Desejabilidade, Viabilidade, Exequibilidade)
   - Sistema Love it / Change it / Leave it

4. **Canvas de Protótipo** (`/projects/1` → aba Prototipar)
   - Área de desenho interativa
   - Ferramentas de prototipagem

5. **Benchmarking com IA** (`/benchmarking`)
   - Análise de maturidade com Google Gemini
   - Radar chart e recomendações

---

## 📊 COMPARAÇÃO RÁPIDA

| | Opção 1 (Site) | Opção 2 (GoFullPage) | Opção 3 (Script) |
|---|:---:|:---:|:---:|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Controle** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Velocidade** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Setup** | Zero | 1 min | 5 min |
| **App Stores** | ⚠️ Limitado | ✅ Perfeito | ✅ Perfeito |

---

## 🎯 RECOMENDAÇÃO

### Para App Stores (Apple + Google):
→ **Use OPÇÃO 2 (GoFullPage)**
- Controle exato de resolução
- Qualidade profissional máxima
- Fácil de refazer se necessário

### Para teste rápido:
→ **Use OPÇÃO 1 (Site)**
- Zero setup
- Ver resultado na hora

### Para gerar em escala:
→ **Use OPÇÃO 3 (Script)**
- Automático
- Gera tudo de uma vez

---

## 📂 ESTRUTURA DE PASTAS FINAL

```
screenshots/
├── app-stores/
│   ├── apple/
│   │   ├── iphone-6.7/
│   │   │   ├── 01-dashboard.png (1290x2796)
│   │   │   ├── 02-empathy-map.png
│   │   │   ├── 03-ideation-canvas.png
│   │   │   ├── 04-prototype-canvas.png
│   │   │   └── 05-benchmarking.png
│   │   └── ipad-12.9/
│   │       └── (mesmas telas em 2048x2732)
│   └── google/
│       └── smartphone/
│           └── (mesmas telas em 1080x1920)
├── desktop/ (1920x1080)
├── tablet/ (768x1024)
└── mobile/ (375x812)
```

---

## ✅ CHECKLIST RÁPIDO

### Antes de capturar:
- [ ] Conta criada e login feito
- [ ] Pelo menos 1 projeto criado
- [ ] Dados realistas (não "teste 123")
- [ ] Navegador em light mode
- [ ] Cache limpo

### Capturas necessárias:
- [ ] 5 telas em iPhone 6.7" (1290x2796) - APPLE
- [ ] 5 telas em Android (1080x1920) - GOOGLE
- [ ] 5 telas em iPad 12.9" (2048x2732) - APPLE (opcional)

### Após capturar:
- [ ] Verificar qualidade de cada screenshot
- [ ] Conferir resoluções corretas
- [ ] Organizar em pastas
- [ ] Seguir guia: `APP_STORE_SUBMISSION_GUIDE.md`

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **`SCREENSHOTS_3_OPCOES_COMPLETO.md`** - Guia mestre com as 3 opções
- **`GOFULLPAGE_EXTENSION_GUIDE.md`** - Tutorial detalhado da Opção 2
- **`APP_STORE_SUBMISSION_GUIDE.md`** - Como submeter nas lojas
- **`FIGMA_WIREFRAMES_GUIDE.md`** - Wireframes para design
- **`SCREENSHOTS_GUIDE.md`** - Lista completa de 20 telas

---

## 🚀 COMEÇAR AGORA

**Opção mais rápida para começar:**

1. Instale GoFullPage (1 minuto)
2. Abra https://www.designthinkingtools.com
3. Faça login
4. F12 → Ctrl+Shift+M → 1290 x 2796
5. Vá para `/dashboard`
6. Clique em GoFullPage
7. ✅ Primeiro screenshot pronto!

**Repita para as outras 4 telas principais.**

---

**Tempo total estimado:** 
- Opção 1: ~30 min (manual)
- Opção 2: ~50 min (5 telas x 3 resoluções)
- Opção 3: ~2 min (automático)

**Boa sorte!** 🎉
