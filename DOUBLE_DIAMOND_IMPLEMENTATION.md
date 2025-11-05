# 🔷 Double Diamond - Plano de Implementação

## ✅ Progresso Atual

### 1. Schema do Banco de Dados - **COMPLETO** ✅

**Arquivo**: `shared/schema.ts`

Tabela `double_diamond_projects` criada com:
- Campos de setup inicial (setor, case de sucesso, público-alvo)
- Fase 1: Discover (pain points, insights, needs, empathy map)
- Fase 2: Define (POV statements, HMW questions)
- Fase 3: Develop (ideas, cross-pollinated ideas)
- Fase 4: Deliver (MVP concept, logo, landing page, social media, test plan)
- Análise DFV (scores + análise completa)
- Tracking de progresso e custos de IA

### 2. Serviço de IA - **COMPLETO** ✅

**Arquivo**: `server/double-diamond-ai.ts`

Funções implementadas usando Google Gemini 2.0 Flash:

#### `generateDiscoverPhase()`
Gera automaticamente:
- 8-12 Pain Points categorizados (severidade 1-5)
- 6-10 Insights do setor/case
- 8-12 User Needs priorizados
- Empathy Map completo (Says, Thinks, Does, Feels)

#### `generateDefinePhase()`
Sintetiza dados do Discover em:
- 3-5 POV Statements (fórmula User + Need + Insight)
- 8-12 HMW Questions (How Might We)
- Categorização por foco (desirability, feasibility, viability)

#### `generateDevelopPhase()`
Brainstorming com IA:
- 15-20 Ideias regulares (categorias + inovation level)
- 5-8 Ideias Cross-Pollinated (combinação de domínios diferentes)

#### `generateDeliverPhase()`
Cria MVP completo:
- Conceito do MVP (nome, tagline, features, value proposition)
- 3-4 Sugestões de Logo (descrição, estilo, cores, simbolismo)
- Landing Page estruturada (headline, sections, CTA)
- Social Media Lines (Twitter, LinkedIn, Instagram)
- Plano de Testes básico

#### `analyzeDFV()`
Análise estratégica:
- Scores de Desirability, Feasibility, Viability (0-100)
- Análise detalhada por dimensão (strengths, concerns, reasoning)
- Overall assessment
- Recomendações acionáveis
- Next steps priorizados

### 3. Storage - **PARCIALMENTE IMPLEMENTADO** ⚠️

**Status**: Imports atualizados, métodos pendentes

**Próximos Passos**:

```typescript
// Adicionar à interface IStorage:

// Double Diamond
getDoubleDiamondProjects(userId: string): Promise<DoubleDiamondProject[]>;
getDoubleDiamondProject(id: string, userId: string): Promise<DoubleDiamondProject | undefined>;
createDoubleDiamondProject(project: InsertDoubleDiamondProject): Promise<DoubleDiamondProject>;
updateDoubleDiamondProject(id: string, userId: string, updates: Partial<InsertDoubleDiamondProject>): Promise<DoubleDiamondProject | undefined>;
deleteDoubleDiamondProject(id: string, userId: string): Promise<boolean>;
```

**Implementação**:

```typescript
// Na classe de storage, adicionar:

async getDoubleDiamondProjects(userId: string): Promise<DoubleDiamondProject[]> {
  return await db.select().from(doubleDiamondProjects)
    .where(eq(doubleDiamondProjects.userId, userId))
    .orderBy(desc(doubleDiamondProjects.createdAt));
}

async getDoubleDiamondProject(id: string, userId: string): Promise<DoubleDiamondProject | undefined> {
  const [project] = await db.select().from(doubleDiamondProjects)
    .where(and(
      eq(doubleDiamondProjects.id, id),
      eq(doubleDiamondProjects.userId, userId)
    ));
  return project;
}

async createDoubleDiamondProject(project: InsertDoubleDiamondProject): Promise<DoubleDiamondProject> {
  const [newProject] = await db.insert(doubleDiamondProjects)
    .values(project)
    .returning();
  return newProject;
}

async updateDoubleDiamondProject(
  id: string, 
  userId: string, 
  updates: Partial<InsertDoubleDiamondProject>
): Promise<DoubleDiamondProject | undefined> {
  const [updated] = await db.update(doubleDiamondProjects)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(
      eq(doubleDiamondProjects.id, id),
      eq(doubleDiamondProjects.userId, userId)
    ))
    .returning();
  return updated;
}

async deleteDoubleDiamondProject(id: string, userId: string): Promise<boolean> {
  const result = await db.delete(doubleDiamondProjects)
    .where(and(
      eq(doubleDiamondProjects.id, id),
      eq(doubleDiamondProjects.userId, userId)
    ));
  return (result.rowCount || 0) > 0;
}
```

---

## 📋 Próximas Etapas (Ordem de Implementação)

### ETAPA 1: Completar Backend ⏳

#### 1.1. Finalizar Storage (`server/storage.ts`)
- [ ] Adicionar métodos do Double Diamond à interface IStorage
- [ ] Implementar os 5 métodos CRUD básicos
- [ ] Testar queries no banco

#### 1.2. Criar Rotas API (`server/routes.ts`)

```typescript
// GET /api/double-diamond - Lista projetos DD do usuário
app.get("/api/double-diamond", requireAuth, async (req, res) => {
  const projects = await storage.getDoubleDiamondProjects(req.user!.id);
  res.json(projects);
});

// GET /api/double-diamond/:id - Busca um projeto
app.get("/api/double-diamond/:id", requireAuth, async (req, res) => {
  const project = await storage.getDoubleDiamondProject(req.params.id, req.user!.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// POST /api/double-diamond - Cria novo projeto
app.post("/api/double-diamond", requireAuth, async (req, res) => {
  const validatedData = insertDoubleDiamondProjectSchema.parse(req.body);
  const project = await storage.createDoubleDiamondProject({
    ...validatedData,
    userId: req.user!.id
  });
  res.status(201).json(project);
});

// PATCH /api/double-diamond/:id - Atualiza projeto
app.patch("/api/double-diamond/:id", requireAuth, async (req, res) => {
  const updated = await storage.updateDoubleDiamondProject(
    req.params.id,
    req.user!.id,
    req.body
  );
  if (!updated) return res.status(404).json({ error: "Project not found" });
  res.json(updated);
});

// DELETE /api/double-diamond/:id - Deleta projeto
app.delete("/api/double-diamond/:id", requireAuth, async (req, res) => {
  const success = await storage.deleteDoubleDiamondProject(req.params.id, req.user!.id);
  if (!success) return res.status(404).json({ error: "Project not found" });
  res.json({ success: true });
});
```

#### 1.3. Criar Rotas de IA

```typescript
// POST /api/double-diamond/:id/generate/discover - Gera Fase 1
app.post("/api/double-diamond/:id/generate/discover", requireAuth, async (req, res) => {
  const project = await storage.getDoubleDiamondProject(req.params.id, req.user!.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  
  const result = await generateDiscoverPhase({
    sector: req.body.sector || project.sectorId || "General",
    successCase: req.body.successCase,
    targetAudience: project.targetAudience || "",
    problemStatement: project.problemStatement || ""
  });
  
  // Atualiza projeto com dados gerados
  const updated = await storage.updateDoubleDiamondProject(project.id, req.user!.id, {
    discoverPainPoints: result.painPoints,
    discoverInsights: result.insights,
    discoverUserNeeds: result.userNeeds,
    discoverEmpathyMap: result.empathyMap,
    discoverStatus: "completed",
    generationCount: (project.generationCount || 0) + 1
  });
  
  res.json(updated);
});

// POST /api/double-diamond/:id/generate/define - Gera Fase 2
// POST /api/double-diamond/:id/generate/develop - Gera Fase 3
// POST /api/double-diamond/:id/generate/deliver - Gera Fase 4
// POST /api/double-diamond/:id/generate/dfv - Gera análise DFV
```

---

### ETAPA 2: Frontend Básico 🎨

#### 2.1. Criar Página Principal (`client/src/pages/DoubleDiamond.tsx`)

Componentes necessários:
- Lista de projetos DD
- Botão "Novo Projeto"
- Cards com status de cada projeto

#### 2.2. Criar Wizard de Criação (`client/src/components/double-diamond/DoubleDiamondWizard.tsx`)

**Fluxo**:
1. **Setup Inicial** (Input Mínimo)
   - Nome do projeto
   - Descrição do problema
   - Seletor de setor (dropdown com setores pré-cadastrados)
   - Seletor de case de sucesso (dropdown: Airbnb, Uber, Netflix, etc.)
   - Descrição do público-alvo (1 parágrafo)
   
2. **Fase 1: Discover** (IA gera tudo)
   - Botão "Gerar com IA"
   - Mostrar pain points gerados
   - Usuário valida/marca os mais relevantes
   
3. **Fase 2: Define** (IA sintetiza)
   - Mostrar POVs gerados
   - Mostrar HMWs gerados
   - Usuário seleciona 1 POV e 1-3 HMWs
   
4. **Fase 3: Develop** (IA brainstorm)
   - Mostrar 20+ ideias geradas
   - Usuário seleciona 2-5 ideias favoritas
   
5. **Fase 4: Deliver** (IA gera MVP)
   - Mostrar conceito do MVP
   - Mostrar sugestões de logo
   - Mostrar landing page
   - Mostrar social media lines

#### 2.3. Criar Visualização do Diamante (`client/src/components/double-diamond/DiamondVisualization.tsx`)

Componente visual mostrando:
- 2 diamantes (Problema | Solução)
- 4 fases destacadas
- Indicador de fase atual
- Checkmarks em fases completas

#### 2.4. Criar Dashboard de Resultados (`client/src/components/double-diamond/DoubleDiamondResults.tsx`)

Exibir:
- Análise DFV com scores visuais (gauges)
- Recomendações da IA
- Botão de Export (PDF/PPTX)
- Sugestão de Premium (se aplicável)

---

### ETAPA 3: Migration e Testes 🗄️

```bash
# 1. Rodar migration
npm run db:push

# Se der aviso de data loss:
npm run db:push --force

# 2. Testar rotas API
# 3. Testar frontend
# 4. Testar geração de IA end-to-end
```

---

### ETAPA 4: Features Avançadas (Opcional) ⭐

- [ ] Export para PPTX (usar pptxgenjs)
- [ ] Integração com projetos DTTools existentes
- [ ] Sistema de templates (setores pré-configurados)
- [ ] Biblioteca de success cases expandida
- [ ] Geração visual de logos (integração com DALL-E)
- [ ] Análise competitiva automática

---

## 🎯 Fluxo do Usuário (User Journey)

```
1. Dashboard → "Criar Projeto Double Diamond"
2. Input Mínimo:
   - Nome: "App de Delivery Saudável"
   - Setor: "Food & Beverage"
   - Case: "Uber Eats"
   - Público: "Profissionais ocupados, 25-40 anos, conscientes da saúde"
   - Problema: "Falta de opções saudáveis e rápidas para almoço"
   
3. DISCOVER - IA gera:
   ✨ 12 Pain Points (ex: "Tempo limitado no almoço", "Opções saudáveis caras")
   ✨ 8 Insights do setor
   ✨ 10 User Needs
   ✨ Empathy Map completo
   👤 Usuário valida/marca os mais importantes
   
4. DEFINE - IA sintetiza:
   ✨ 4 POV Statements
   ✨ 10 HMW Questions
   👤 Usuário escolhe 1 POV + 2 HMWs
   
5. DEVELOP - IA brainstorm:
   ✨ 20 Ideias regulares
   ✨ 6 Ideias cross-pollinated (inovadoras)
   👤 Usuário seleciona top 3 ideias
   
6. DELIVER - IA cria MVP:
   ✨ Conceito do MVP: "HealthSnap - Refeições saudáveis em 15min"
   ✨ 3 Sugestões de logo
   ✨ Landing page completa (headline, sections, CTA)
   ✨ 12 linhas para redes sociais
   ✨ Plano de testes
   
7. ANÁLISE DFV:
   ✨ Desirability: 82/100
   ✨ Feasibility: 65/100
   ✨ Viability: 78/100
   ✨ Recomendações + Next Steps
   
8. EXPORT:
   📄 PDF completo
   📊 Apresentação PPTX para investidores
```

---

## 💡 Diferenciais da Implementação

1. **Input Mínimo → Output Máximo**
   - Usuário preenche apenas 5 campos iniciais
   - IA gera 90% do conteúdo automaticamente

2. **Espelhamento em Cases de Sucesso**
   - Aprende com Airbnb, Uber, Netflix, etc.
   - Adapta estratégias comprovadas ao contexto do usuário

3. **Cross-Pollination de Ideias**
   - IA combina conceitos de diferentes domínios
   - Gera inovações únicas e disruptivas

4. **MVP Pronto para Execução**
   - Logo, landing page, social media - tudo gerado
   - Pronto para validar no mercado imediatamente

5. **Análise DFV Estratégica**
   - Validação automática da viabilidade do negócio
   - Feedback acionável para próximos passos

---

## 📊 Estimativa de Custos de IA

- **Discover**: ~0.02 USD (1 call, prompt grande)
- **Define**: ~0.01 USD (1 call, síntese)
- **Develop**: ~0.03 USD (1 call, geração criativa)
- **Deliver**: ~0.04 USD (1 call, complexa)
- **DFV Analysis**: ~0.02 USD (1 call, análise)

**Total por projeto completo**: ~0.12 USD (custo para DTTools)

---

## 🚀 Status

- ✅ Schema completo
- ✅ Serviço de IA completo
- ⚠️ Storage parcialmente implementado
- ❌ Rotas API pendentes
- ❌ Frontend pendente
- ❌ Migration pendente

**Próximo passo**: Completar métodos do storage e criar rotas API básicas.
