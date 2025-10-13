# 📦 PACOTE COMPLETO DE WIREFRAMES - DTTOOLS

## ✅ O QUE VOCÊ RECEBEU

### 🎨 5 WIREFRAMES VISUAIS EM SVG
Wireframes completos e prontos para usar das telas principais:

1. **`wireframes/dashboard.svg`** - Dashboard com 5 fases do Design Thinking
2. **`wireframes/empathy-map.svg`** - Mapa de Empatia interativo (Fase 1)
3. **`wireframes/ideation-canvas.svg`** - Canvas de Ideias com Matriz DVF (Fase 3)
4. **`wireframes/prototype-canvas.svg`** - Canvas de Prototipagem (Fase 4)
5. **`wireframes/benchmarking.svg`** - Benchmarking com IA Gemini

### 📄 DOCUMENTAÇÃO COMPLETA

1. **`FIGMA_WIREFRAMES_GUIDE.md`** - Guia completo de wireframes
   - Estrutura detalhada de cada tela
   - Sistema de design (cores, tipografia, componentes)
   - Breakpoints responsivos
   - Como criar no Figma do zero

2. **`SCREENSHOTS_GUIDE.md`** - Guia de screenshots
   - Lista de todas as 20 telas do sistema
   - URLs e descrições
   - Prioridades para App Stores
   - Resoluções necessárias

3. **`APP_STORE_SUBMISSION_GUIDE.md`** - Guia de submissão
   - Passo a passo Apple App Store
   - Passo a passo Google Play Store
   - Textos de marketing prontos
   - Checklist completo

4. **`DESIGN_ALTERNATIVES.md`** - Alternativas ao Figma
   - Explicação sobre ausência de arquivo .fig
   - 4 opções disponíveis
   - Documentação de design atual

---

## 🎯 COMO USAR OS WIREFRAMES SVG

### OPÇÃO 1: Visualizar Direto no Navegador
```bash
# Abra qualquer arquivo .svg no navegador:
# wireframes/dashboard.svg
# wireframes/empathy-map.svg
# etc.
```

### OPÇÃO 2: Importar no Figma

**Passo a passo:**
1. Abra o Figma (https://figma.com)
2. Crie novo arquivo: "DTTools Wireframes"
3. **Arquivo → Importar → Escolha os arquivos .svg**
4. Os wireframes serão importados como vetores editáveis
5. Agrupe e organize em frames

**Vantagens:**
- ✅ Totalmente editável no Figma
- ✅ Mantém proporções exatas
- ✅ Texto e cores podem ser alterados
- ✅ Pode adicionar interatividade/prototyping

### OPÇÃO 3: Converter para PNG (Screenshots)

**Usando navegador:**
1. Abra o arquivo .svg no Chrome/Firefox
2. Clique direito → "Inspecionar elemento"
3. No console, digite:
```javascript
// Para screenshot 2x (retina)
document.querySelector('svg').setAttribute('width', '3840');
document.querySelector('svg').setAttribute('height', '2160');
```
4. Clique direito na página → "Salvar imagem como PNG"

**Usando ferramenta online:**
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/
- Faça upload do .svg e baixe em PNG

### OPÇÃO 4: Editar Código SVG

Os arquivos SVG são código XML editável:
```xml
<!-- Exemplo de como mudar cor no SVG -->
<rect fill="#2563eb"/>  <!-- Azul atual -->
<rect fill="#10b981"/>  <!-- Mude para verde -->
```

---

## 📱 CRIAR SCREENSHOTS PARA APP STORES

### Para Apple App Store (iPhone 6.7")

**Resolução necessária:** 1290 x 2796 pixels

**Como fazer:**
1. Abra wireframe no Figma
2. Crie frame: 1290 x 2796px
3. Cole o wireframe dentro
4. Ajuste e adicione mock data
5. Exportar como PNG @2x

**Principais telas:**
- Dashboard (wireframes/dashboard.svg)
- Mapa de Empatia (wireframes/empathy-map.svg)
- Canvas de Ideias (wireframes/ideation-canvas.svg)
- Canvas de Protótipo (wireframes/prototype-canvas.svg)
- Benchmarking (wireframes/benchmarking.svg)

### Para Google Play Store (Android)

**Resolução mínima:** 1080 x 1920 pixels

**Mesmas 5 telas principais**

---

## 🎨 PERSONALIZANDO NO FIGMA

### 1. Importar Wireframes
```
Figma → File → Import → Selecione todos os .svg
```

### 2. Configurar Design System

**Criar Color Styles:**
```
Primary Blue: #2563eb
Success Green: #10b981
Warning Yellow: #f59e0b
Error Red: #ef4444
Background: #f8fafc
```

**Criar Text Styles:**
```
Heading 1: Inter Bold 48px
Heading 2: Inter Bold 36px
Body: Inter Regular 16px
Small: Inter Regular 14px
```

### 3. Criar Componentes

**Button Component:**
- Variantes: Primary, Secondary, Outline
- Estados: Default, Hover, Disabled
- Auto-layout com padding 12px 24px

**Card Component:**
- Background: White
- Border: 1px solid #e2e8f0
- Border-radius: 12px
- Padding: 24px

### 4. Adicionar Interatividade

**Prototyping:**
1. Selecione elemento clicável
2. Prototype → Add interaction
3. On Click → Navigate to → [Tela destino]
4. Animation: Smart Animate, 300ms

---

## 📊 ESTRUTURA DE PASTAS RECOMENDADA

```
DTTools-Design/
├── Wireframes/
│   ├── 01-Dashboard.fig
│   ├── 02-Empathy-Map.fig
│   ├── 03-Ideation-Canvas.fig
│   ├── 04-Prototype-Canvas.fig
│   └── 05-Benchmarking.fig
├── Design-System/
│   ├── Colors.fig
│   ├── Typography.fig
│   └── Components.fig
├── App-Store-Assets/
│   ├── iPhone-Screenshots/
│   │   ├── 01-dashboard.png (1290x2796)
│   │   ├── 02-empathy-map.png
│   │   ├── 03-ideation-canvas.png
│   │   ├── 04-prototype-canvas.png
│   │   └── 05-benchmarking.png
│   ├── iPad-Screenshots/
│   │   └── (mesmas telas em 2048x2732)
│   └── Android-Screenshots/
│       └── (mesmas telas em 1080x1920)
└── Marketing/
    ├── Feature-Graphic.png (1024x500)
    └── App-Icon.png (1024x1024)
```

---

## 🚀 PRÓXIMOS PASSOS (RECOMENDADO)

### Fase 1: Design (1-2 dias)
- [ ] Importar wireframes SVG no Figma
- [ ] Configurar Design System (cores, textos)
- [ ] Criar componentes reutilizáveis
- [ ] Adicionar mock data realista

### Fase 2: Screenshots (1 dia)
- [ ] Criar frames nas resoluções corretas
- [ ] Popular com dados reais do sistema
- [ ] Exportar PNG para iPhone/iPad/Android
- [ ] Criar Feature Graphic (Google Play)

### Fase 3: Refinamento (1 dia)
- [ ] Adicionar prototyping/interações
- [ ] Criar variações de temas (se necessário)
- [ ] Documentar componentes
- [ ] Preparar handoff para dev

### Fase 4: Submissão (1 dia)
- [ ] Seguir `APP_STORE_SUBMISSION_GUIDE.md`
- [ ] Fazer upload de screenshots
- [ ] Preencher textos de marketing
- [ ] Submeter para revisão

---

## 🔧 FERRAMENTAS ÚTEIS

### Para Converter SVG → Figma
- **Figma Import nativo** (File → Import)
- **SVG to Figma Plugin** (grátis)
- **html.to.design** ($30/mês - converte código para Figma)

### Para Gerar Screenshots
- **Figma Export** (nativo)
- **Screenshot Generator** (já existe em `/screenshots` no app)
- **Shotsnapp** (mockups automáticos)

### Para Editar SVG
- **Figma** (melhor opção)
- **Illustrator** (Adobe)
- **Inkscape** (grátis)
- **VS Code** (editar código diretamente)

---

## 💡 DICAS PROFISSIONAIS

### 1. Mock Data Realista
Use dados que parecem reais, não "Lorem Ipsum":
```
❌ Ruim: "Usuário 1", "Projeto Teste", "Texto exemplo"
✅ Bom: "Marina Silva", "App de Delivery Sustentável", "Gamificação verde"
```

### 2. Consistência Visual
- Sempre use o mesmo estilo de ícones (ex: Lucide React)
- Mantenha espaçamentos consistentes (múltiplos de 8px)
- Use no máximo 3-4 cores principais

### 3. Screenshots para App Store
- Evite texto muito pequeno (mínimo 12px)
- Use contraste alto para legibilidade
- Destaque a feature principal em cada screenshot
- Adicione legendas curtas se necessário

### 4. Acessibilidade
- Contraste mínimo 4.5:1 para texto
- Não use apenas cor para transmitir informação
- Tamanho mínimo de tap target: 44x44px

---

## ❓ FAQ

### P: Por que não tem arquivo .fig original?
**R:** O DTTools foi desenvolvido diretamente em código (React + TypeScript), sem design prévio no Figma. Os wireframes SVG foram criados especialmente para você.

### P: Posso editar os wireframes?
**R:** Sim! Importe os .svg no Figma e edite livremente. São vetores totalmente editáveis.

### P: Qual resolução usar para screenshots?
**R:** 
- iPhone: 1290 x 2796px
- iPad: 2048 x 2732px
- Android: 1080 x 1920px (mínimo)

### P: Preciso criar todas as 20 telas?
**R:** Não. Foque nas 5 principais para as lojas:
1. Dashboard
2. Mapa de Empatia
3. Canvas de Ideias
4. Canvas de Protótipo
5. Benchmarking

### P: Como adiciono interatividade no Figma?
**R:** 
1. Selecione elemento
2. Aba "Prototype" (direita)
3. Clique no "+" azul
4. Arraste para tela destino
5. Configure animação

---

## 📞 SUPORTE

Se tiver dúvidas ou precisar de ajuda:
1. Consulte `FIGMA_WIREFRAMES_GUIDE.md` para detalhes técnicos
2. Consulte `APP_STORE_SUBMISSION_GUIDE.md` para submissão
3. Veja `SCREENSHOTS_GUIDE.md` para lista completa de telas

---

## ✅ CHECKLIST FINAL

### Wireframes
- [x] 5 wireframes SVG criados
- [x] Documentação completa
- [x] Guias de uso
- [ ] Importar no Figma (VOCÊ FAZ)
- [ ] Adicionar mock data (VOCÊ FAZ)
- [ ] Criar protótipos interativos (VOCÊ FAZ)

### Screenshots
- [ ] Exportar iPhone 6.7" (1290x2796)
- [ ] Exportar iPad 12.9" (2048x2732)
- [ ] Exportar Android (1080x1920)
- [ ] Criar Feature Graphic (1024x500)
- [ ] Criar ícone app (1024x1024)

### App Stores
- [ ] Conta Apple Developer ($99/ano)
- [ ] Conta Google Play Developer ($25 único)
- [ ] Screenshots aprovados
- [ ] Textos de marketing prontos
- [ ] Políticas linkadas
- [ ] App submetido para revisão

---

**Última atualização:** 13 de Outubro de 2025
**Status:** ✅ Pacote completo pronto para uso
**Arquivos incluídos:** 9 documentos + 5 wireframes SVG

## 🎉 ESTÁ TUDO PRONTO!

Você tem tudo que precisa para:
1. ✅ Criar designs no Figma
2. ✅ Gerar screenshots profissionais
3. ✅ Submeter para Apple e Google

**Boa sorte com a submissão!** 🚀
