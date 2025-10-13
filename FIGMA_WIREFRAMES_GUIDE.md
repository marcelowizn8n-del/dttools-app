# 🎨 WIREFRAMES FIGMA - DTTOOLS

## 📋 COMO USAR ESTE GUIA

Como o DTTools foi desenvolvido diretamente em código, **não existe arquivo Figma original**.

Este guia fornece:
1. ✅ **Estrutura detalhada** de cada tela principal
2. ✅ **Componentes e medidas** exatas
3. ✅ **Cores e estilos** do sistema
4. ✅ **Layout responsivo** para cada breakpoint

---

## 🎯 WIREFRAMES DAS 5 TELAS PRINCIPAIS

### 1. 📱 DASHBOARD - VISÃO GERAL

#### Layout Desktop (1920 x 1080)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (altura: 64px)                                        │
│ ┌────────┐ [Meus Projetos] [Biblioteca] [Ajuda]   👤 User  │
│ │  LOGO  │                                                   │
│ └────────┘                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  BEM-VINDO AO DTTOOLS                                        │
│  [Título: 3rem, Bold] "Olá, [Nome do Usuário]!"             │
│  [Subtítulo: 1.25rem] "Continue seu projeto ou crie novo"   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CARD: Projeto Atual (se existir)                    │   │
│  │ Padding: 24px | Border-radius: 12px                 │   │
│  │                                                       │   │
│  │ 📊 "App de Delivery Sustentável"                    │   │
│  │ Fase atual: Idear (3/5)                             │   │
│  │ Progress Bar: 60% [████████░░░░░░] Verde           │   │
│  │                                                       │   │
│  │ [Botão: Continuar Projeto] →                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  AS 5 FASES DO DESIGN THINKING                              │
│  [Grid: 5 colunas, gap: 24px]                               │
│                                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │   🎯   │ │   📋   │ │   💡   │ │   🎨   │ │   ✅   │  │
│  │        │ │        │ │        │ │        │ │        │  │
│  │ EMPAT  │ │ DEFINIR│ │ IDEAR  │ │ PROTOT │ │ TESTAR │  │
│  │  IZAR  │ │        │ │        │ │  IPAR  │ │        │  │
│  │        │ │        │ │        │ │        │ │        │  │
│  │ 3 itens│ │ 2 itens│ │ 5 itens│ │ 1 item │ │ 0 itens│  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                               │
│  ESTATÍSTICAS RÁPIDAS                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 🚀 12    │ │ 👥 45    │ │ ⭐ 87    │ │ 📊 64%   │      │
│  │ Projetos │ │ Personas │ │ Ideias   │ │ Progresso│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Responsivo Tablet (768 x 1024)
- Grid de fases: 2 colunas (3 cards na primeira linha, 2 na segunda)
- Cards empilhados verticalmente
- Estatísticas: 2x2 grid

#### Responsivo Mobile (375 x 812)
- Grid de fases: 1 coluna (scroll vertical)
- Cards full-width
- Estatísticas: scroll horizontal

---

### 2. 🎯 FASE 1 - MAPA DE EMPATIA

#### Layout Desktop (1920 x 1080)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER + BREADCRUMB                                          │
│ Home > Projetos > App Delivery > Empatizar                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  MAPA DE EMPATIA                                             │
│  [Título: 2.25rem] + [Botão: + Nova Persona]               │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        QUADRANTE INTERATIVO (800 x 800px)           │   │
│  │                                                       │   │
│  │  ┌──────────────┐                                    │   │
│  │  │    🗣️ DIZ    │                                    │   │
│  │  │              │                                    │   │
│  │  │ • "Quero..."│                                    │   │
│  │  │ • "Preciso" │                                    │   │
│  │  └──────────────┘                                    │   │
│  │                                                       │   │
│  │  ┌────────┐              ┌────────┐                 │   │
│  │  │ 💭     │    👤        │    👁️  │                 │   │
│  │  │ PENSA  │   PERSONA    │   VÊ   │                 │   │
│  │  │        │              │        │                 │   │
│  │  └────────┘              └────────┘                 │   │
│  │                                                       │   │
│  │  ┌──────────────┐                                    │   │
│  │  │   🚶 FAZ     │                                    │   │
│  │  │              │                                    │   │
│  │  │ • Ações...   │                                    │   │
│  │  └──────────────┘                                    │   │
│  │                                                       │   │
│  │  ┌──────────────┐                                    │   │
│  │  │   ❤️ SENTE   │                                    │   │
│  │  │              │                                    │   │
│  │  │ • Emoções... │                                    │   │
│  │  └──────────────┘                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  PERSONAS CRIADAS                                            │
│  [Grid: 3 colunas]                                          │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  👤       │ │  👤       │ │  👤       │                    │
│  │  Marina   │ │  Carlos   │ │  Ana      │                    │
│  │  32 anos  │ │  45 anos  │ │  28 anos  │                    │
│  │  [Editar] │ │  [Editar] │ │  [Editar] │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Componentes-chave
- **Quadrantes**: 4 áreas editáveis com textarea
- **Centro**: Avatar/foto da persona
- **Cards de personas**: Grid responsivo abaixo
- **Cores**: Background branco, bordas cinza claro #e2e8f0

---

### 3. 💡 FASE 3 - CANVAS DE IDEIAS

#### Layout Desktop (1920 x 1080)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER + BREADCRUMB                                          │
│ Home > Projetos > App Delivery > Idear                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  CANVAS DE IDEAÇÃO                                          │
│  [Título: 2.25rem] + [Botão: + Adicionar Ideia]            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ FILTROS                                              │   │
│  │ [All] [Love it ❤️] [Change it 🔄] [Leave it 👎]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  MATRIZ DVF (Desejabilidade, Viabilidade, Exequibilidade)   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │   ALTA DESEJABILIDADE                                │   │
│  │   ┌─────────┐  ┌─────────┐                          │   │
│  │   │ 💚 Idea │  │ 💚 Idea │                          │   │
│  │   │ DVF: 85%│  │ DVF: 92%│                          │   │
│  │   │ Love it │  │ Love it │                          │   │
│  │   └─────────┘  └─────────┘                          │   │
│  │                                                       │   │
│  │   MÉDIA                                              │   │
│  │   ┌─────────┐  ┌─────────┐                          │   │
│  │   │ 🔄 Idea │  │ 🔄 Idea │                          │   │
│  │   │ DVF: 65%│  │ DVF: 58%│                          │   │
│  │   │ Change  │  │ Change  │                          │   │
│  │   └─────────┘  └─────────┘                          │   │
│  │                                                       │   │
│  │   BAIXA                                              │   │
│  │   ┌─────────┐                                        │   │
│  │   │ 👎 Idea │                                        │   │
│  │   │ DVF: 35%│                                        │   │
│  │   │ Leave   │                                        │   │
│  │   └─────────┘                                        │   │
│  │                                                       │   │
│  │   ← BAIXA      VIABILIDADE      ALTA →              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Componentes-chave
- **Cards de ideias**: Draggable, com 3 estados (Love/Change/Leave)
- **Matriz DVF**: Gráfico scatter plot
- **Score visual**: Progress bar + percentual
- **Cores**: Verde (Love), Amarelo (Change), Vermelho (Leave)

---

### 4. 🎨 FASE 4 - CANVAS DE PROTÓTIPO

#### Layout Desktop (1920 x 1080)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER + BREADCRUMB                                          │
│ Home > Projetos > App Delivery > Prototipar                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  CANVAS INTERATIVO DE PROTOTIPAGEM                          │
│  [Título: 2.25rem]                                          │
│                                                               │
│  ┌──────────────┐                                           │
│  │ FERRAMENTAS  │                                           │
│  │              │                                           │
│  │ 🖌️ Pincel    │                                           │
│  │ 📐 Linha     │                                           │
│  │ ⭕ Círculo    │                                           │
│  │ ⬜ Retângulo │                                           │
│  │ 📝 Texto     │                                           │
│  │ 🖼️ Imagem    │                                           │
│  │ 🗑️ Apagar    │                                           │
│  │              │                                           │
│  │ Cor: [⚫️]   │                                           │
│  │ Espessura: 3 │                                           │
│  │              │                                           │
│  │ [💾 Salvar]  │                                           │
│  │ [↩️ Desfazer]│                                           │
│  │ [🔄 Refazer] │                                           │
│  └──────────────┘                                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │          ÁREA DE DESENHO (Canvas 1400 x 700)        │   │
│  │                                                       │   │
│  │     [Espaço livre para desenhar protótipos]         │   │
│  │                                                       │   │
│  │     Suporta:                                         │   │
│  │     - Desenho livre à mão                            │   │
│  │     - Formas geométricas                             │   │
│  │     - Upload de wireframes                           │   │
│  │     - Anotações de texto                             │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  VERSÕES ANTERIORES                                          │
│  [v1] [v2] [v3 - atual] [+ Nova Versão]                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Componentes-chave
- **Toolbar**: Sidebar esquerda com ferramentas
- **Canvas**: Área de desenho com Konva.js
- **Versionamento**: Tabs na parte inferior
- **Export**: Botão para baixar PNG/PDF

---

### 5. 📊 BENCHMARKING COM IA

#### Layout Desktop (1920 x 1080)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER + BREADCRUMB                                          │
│ Home > Benchmarking                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ANÁLISE DE MATURIDADE EM DESIGN THINKING                   │
│  [Título: 2.25rem] + Badge: "Powered by Google Gemini AI"  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ FORMULÁRIO DE ASSESSMENT                             │   │
│  │                                                       │   │
│  │ Setor da empresa:                                    │   │
│  │ [Dropdown: Tecnologia, Saúde, Varejo, etc]          │   │
│  │                                                       │   │
│  │ Tamanho:                                             │   │
│  │ [Dropdown: Startup, PME, Grande empresa]            │   │
│  │                                                       │   │
│  │ Fase atual predominante:                             │   │
│  │ [Dropdown: Empatizar, Definir, Idear, etc]          │   │
│  │                                                       │   │
│  │ [Botão: 🤖 Gerar Análise com IA]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  RESULTADOS DA ANÁLISE                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  RADAR CHART (5 eixos)                              │   │
│  │                                                       │   │
│  │         Empatizar (85%)                              │   │
│  │              /|\                                     │   │
│  │             / | \                                    │   │
│  │   Testar   /  |  \   Definir                        │   │
│  │   (75%)   ────┼────  (90%)                          │   │
│  │            \  |  /                                   │   │
│  │             \ | /                                    │   │
│  │     Prototipar  Idear                               │   │
│  │       (65%)    (80%)                                 │   │
│  │                                                       │   │
│  │  Linha Azul: Sua empresa                            │   │
│  │  Linha Cinza: Média do setor                        │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  🤖 RECOMENDAÇÕES DA IA                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  1. 🎯 Foco em Prototipagem (Score: 65%)            │   │
│  │     Sua empresa está abaixo da média em...          │   │
│  │                                                       │   │
│  │  2. ⭐ Destaque em Definir (Score: 90%)              │   │
│  │     Continue investindo em...                        │   │
│  │                                                       │   │
│  │  3. 📈 Próximos Passos                               │   │
│  │     - Workshop de prototipagem rápida                │   │
│  │     - Treinamento em ferramentas de wireframe        │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Componentes-chave
- **Form**: Inputs controlados com validação
- **Radar Chart**: Recharts library
- **IA Response**: Cards com recomendações do Gemini
- **Comparação**: Overlay de 2 datasets no gráfico

---

## 🎨 SISTEMA DE DESIGN

### Paleta de Cores
```css
/* Cores Principais */
--primary-blue: #2563eb
--primary-blue-light: #3b82f6
--primary-blue-dark: #1d4ed8

/* Backgrounds */
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-tertiary: #f1f5f9

/* Borders */
--border-light: #e2e8f0
--border-medium: #cbd5e1
--border-dark: #94a3b8

/* Status Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6

/* Text */
--text-primary: #1e293b
--text-secondary: #64748b
--text-muted: #94a3b8
```

### Tipografia
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Tamanhos */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */

/* Pesos */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Espaçamentos
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

### Border Radius
```css
--radius-sm: 0.25rem   /* 4px */
--radius-md: 0.5rem    /* 8px */
--radius-lg: 0.75rem   /* 12px */
--radius-xl: 1rem      /* 16px */
--radius-2xl: 1.5rem   /* 24px */
--radius-full: 9999px  /* Pill shape */
```

### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 📐 COMPONENTES BASE

### Button (Botão)
```
Variantes:
- Primary: bg-blue-600, text-white, hover:bg-blue-700
- Secondary: bg-gray-100, text-gray-900, hover:bg-gray-200
- Outline: border-2 border-gray-300, bg-transparent
- Ghost: bg-transparent, hover:bg-gray-100
- Destructive: bg-red-600, text-white

Tamanhos:
- sm: height 32px, padding 8px 12px, text-sm
- md: height 40px, padding 10px 16px, text-base
- lg: height 48px, padding 12px 24px, text-lg

Border-radius: 8px
Transition: all 200ms
```

### Card
```
Background: white
Border: 1px solid #e2e8f0
Border-radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover state:
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Transform: translateY(-2px)
- Transition: 200ms
```

### Input (Campo de texto)
```
Height: 40px
Padding: 8px 12px
Border: 1px solid #cbd5e1
Border-radius: 8px
Font-size: 16px

Focus state:
- Border: 2px solid #2563eb
- Outline: none
- Ring: 0 0 0 3px rgba(37, 99, 235, 0.1)

Error state:
- Border: 1px solid #ef4444
```

### Badge
```
Padding: 4px 12px
Border-radius: 9999px (pill)
Font-size: 12px
Font-weight: 500

Variantes:
- Default: bg-gray-100, text-gray-900
- Success: bg-green-100, text-green-900
- Warning: bg-yellow-100, text-yellow-900
- Error: bg-red-100, text-red-900
- Info: bg-blue-100, text-blue-900
```

---

## 📱 BREAKPOINTS RESPONSIVOS

```css
/* Mobile First Approach */

/* Extra Small (Mobile) */
@media (min-width: 0px) {
  /* Base styles */
  .container { max-width: 100%; padding: 16px; }
  .grid { grid-template-columns: 1fr; }
}

/* Small (Large Mobile / Small Tablet) */
@media (min-width: 640px) {
  .container { max-width: 640px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Medium (Tablet) */
@media (min-width: 768px) {
  .container { max-width: 768px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large (Desktop) */
@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 24px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
}

/* Extra Large (Wide Desktop) */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
  .grid { grid-template-columns: repeat(5, 1fr); }
}
```

---

## 🔧 COMO CRIAR NO FIGMA

### Passo 1: Configurar Artboards
1. Criar 3 frames:
   - Desktop: 1920 x 1080px
   - Tablet: 768 x 1024px
   - Mobile: 375 x 812px

### Passo 2: Criar Componentes Base
1. Importar fonte Inter (Google Fonts)
2. Criar color styles (cores acima)
3. Criar text styles (tipografia acima)
4. Criar componentes: Button, Card, Input, Badge

### Passo 3: Montar Layouts
1. Use os wireframes ASCII acima como referência
2. Copie medidas exatas dos componentes
3. Aplique grid system (12 colunas)

### Passo 4: Adicionar Interatividade
1. Prototype: Link entre telas
2. Smart Animate: Transições suaves
3. Variants: Estados (hover, focus, active)

---

## 📥 EXPORTAR DO FIGMA

### Para Desenvolvimento
```
Formato: PNG (2x para retina)
Naming: component-name-state.png
Exemplo: button-primary-hover@2x.png
```

### Para App Stores
```
iPhone 6.7": 1290 x 2796px (PNG)
iPad 12.9": 2048 x 2732px (PNG)
Android Phone: 1080 x 1920px (PNG)
Feature Graphic: 1024 x 500px (PNG/JPG)
```

---

## 🎯 TELAS ADICIONAIS (SECUNDÁRIAS)

### 6. Login Page
- Form centrado: 400px width
- Logo no topo
- 2 inputs (email, password)
- Botão primário full-width
- Link "Esqueceu senha?" e "Criar conta"

### 7. Signup Page
- Similar ao login, porém 5 campos:
  - Nome de exibição
  - Email
  - Confirmar email
  - Senha (com indicador de força)
  - Confirmar senha

### 8. Pricing Page
- 3 cards horizontais (Free, Pro, Enterprise)
- Tabela de comparação abaixo
- Toggle Mensal/Anual

### 9. Profile Page
- Avatar à esquerda
- Dados do usuário à direita
- Seção de plano atual
- Botão "Gerenciar assinatura Stripe"

### 10. Library Page
- Grid de cards 3 colunas
- Cada card: imagem, título, categoria, CTA

---

## ✅ CHECKLIST PARA FIGMA

- [ ] Criar file "DTTools Wireframes"
- [ ] Configurar 3 artboards (Desktop, Tablet, Mobile)
- [ ] Importar fonte Inter
- [ ] Criar color palette (20 cores)
- [ ] Criar text styles (10 estilos)
- [ ] Criar componentes base (Button, Card, Input, Badge)
- [ ] Wireframe: Dashboard
- [ ] Wireframe: Mapa de Empatia
- [ ] Wireframe: Canvas de Ideias
- [ ] Wireframe: Canvas de Protótipo
- [ ] Wireframe: Benchmarking
- [ ] Adicionar prototyping/links
- [ ] Exportar assets para dev
- [ ] Exportar screenshots para stores

---

## 🚀 ALTERNATIVA: IMPORTAR CÓDIGO PARA FIGMA

### Ferramentas Recomendadas:

1. **html.to.design** (https://html.to.design)
   - Cole URL do DTTools
   - Ferramenta converte para Figma
   - $30-40/mês

2. **Anima** (https://animaapp.com)
   - Plugin Figma oficial
   - Converte React → Figma
   - $31/mês

3. **Figma Import (manual)**
   - Screenshot das telas
   - Importar no Figma
   - Redesenhar components
   - GRÁTIS mas trabalhoso

---

**Última atualização:** 13 de Outubro de 2025
**Status:** Guia completo para criação de wireframes Figma
