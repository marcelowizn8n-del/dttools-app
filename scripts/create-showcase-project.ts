import { db } from '../server/db';
import { 
  projects, empathyMaps, personas, interviews, observations,
  povStatements, hmwQuestions, ideas, prototypes, testPlans, testResults
} from '../shared/schema';

async function createShowcaseProject() {
  try {
    // Get marcelowiz user ID
    const users = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.email, 'marcelowiz@gmail.com')
    });
    
    if (users.length === 0) {
      console.error('User marcelowiz@gmail.com not found');
      return;
    }
    
    const userId = users[0].id;
    console.log('Creating showcase project for user:', userId);

    // 1. Create Project
    const [project] = await db.insert(projects).values({
      userId,
      name: 'EcoDelivery - Delivery Sustentável',
      description: 'Plataforma de delivery que conecta restaurantes sustentáveis com consumidores conscientes, usando embalagens 100% biodegradáveis e entregas com bicicletas elétricas',
      status: 'in_progress',
      currentPhase: 3,
      completionRate: 65
    }).returning();
    
    console.log('✅ Project created:', project.id);

    // 2. FASE 1 - EMPATIZAR
    
    // Empathy Map
    const [empathyMap] = await db.insert(empathyMaps).values({
      projectId: project.id,
      title: 'Mapa de Empatia - Consumidora Consciente',
      says: JSON.stringify([
        'Quero pedir comida sem culpa ambiental',
        'As embalagens plásticas me incomodam muito',
        'Prefiro apoiar negócios sustentáveis'
      ]),
      thinks: JSON.stringify([
        'Será que meu pedido vai gerar muito lixo?',
        'Gostaria de saber o impacto ambiental',
        'Preciso de opções mais verdes'
      ]),
      does: JSON.stringify([
        'Pesquisa restaurantes sustentáveis',
        'Reutiliza embalagens quando possível',
        'Compartilha iniciativas ecológicas nas redes sociais'
      ]),
      feels: JSON.stringify([
        'Preocupada com o meio ambiente',
        'Frustrada com falta de opções',
        'Esperançosa por mudanças'
      ])
    }).returning();
    
    console.log('✅ Empathy map created');

    // Persona
    const [persona] = await db.insert(personas).values({
      projectId: project.id,
      name: 'Marina Silva',
      age: 32,
      occupation: 'Designer UX',
      bio: 'Profissional urbana, vegana, ativista ambiental. Busca conveniência sem comprometer seus valores ecológicos. Pede delivery 3-4x por semana.',
      goals: JSON.stringify([
        'Reduzir pegada de carbono no dia a dia',
        'Apoiar negócios sustentáveis',
        'Facilitar escolhas conscientes'
      ]),
      frustrations: JSON.stringify([
        'Excesso de embalagens plásticas nos deliveries',
        'Falta de informação sobre sustentabilidade dos restaurantes',
        'Emissão de carbono das entregas de moto'
      ]),
      motivations: JSON.stringify([
        'Fazer diferença no meio ambiente',
        'Ser exemplo para a comunidade',
        'Viver de forma coerente com seus valores'
      ]),
      techSavviness: 'high'
    }).returning();
    
    console.log('✅ Persona created');

    // Interview
    const [interview] = await db.insert(interviews).values({
      projectId: project.id,
      participantName: 'Carlos Mendes - Dono de Restaurante Vegano',
      date: new Date('2024-09-15'),
      duration: 45,
      questions: JSON.stringify([
        'Como seus clientes reagem às embalagens?',
        'Qual o maior desafio de ser sustentável?'
      ]),
      responses: JSON.stringify([
        'Cobram coerência até na entrega',
        'Custo e falta de opções de delivery eco-friendly'
      ]),
      insights: 'Clientes cobram coerência ambiental até na entrega. Custo de embalagens eco-friendly é 30% maior. Entregas de moto poluem e vão contra valores do negócio. Existe disposição de pagar mais por delivery sustentável.'
    }).returning();
    
    console.log('✅ Interview created');

    // Observation
    const [observation] = await db.insert(observations).values({
      projectId: project.id,
      location: 'Praça de alimentação - Bairro Sustentável',
      date: new Date('2024-09-20'),
      context: 'Observação de comportamento de consumidores conscientes ao pedir delivery',
      behavior: '70% perguntam sobre embalagens antes de pedir. Frustração visível ao receber excesso de plástico. Compartilham fotos de embalagens sustentáveis nas redes. Dispostos a esperar mais por entrega ecológica.',
      insights: 'Embalagem é fator decisivo de compra. Comunidade valoriza transparência ambiental. Tempo de entrega é menos importante que sustentabilidade.'
    }).returning();
    
    console.log('✅ Observation created');

    // 3. FASE 2 - DEFINIR
    
    // POV Statement
    const [pov] = await db.insert(povStatements).values({
      projectId: project.id,
      user: 'Consumidores urbanos conscientes',
      need: 'precisam de uma forma conveniente de pedir comida que não comprometa seus valores ambientais',
      insight: 'porque sentem culpa ao gerar lixo plástico e emissões desnecessárias, mas não querem abrir mão da praticidade do delivery',
      statement: 'Como podemos criar uma experiência de delivery que seja tão conveniente quanto as opções tradicionais, mas completamente alinhada com práticas sustentáveis?'
    }).returning();
    
    console.log('✅ POV statement created');

    // HMW Questions
    await db.insert(hmwQuestions).values([
      {
        projectId: project.id,
        question: 'Como podemos eliminar completamente o plástico descartável dos deliveries?',
        category: 'product'
      },
      {
        projectId: project.id,
        question: 'Como podemos tornar entregas de bicicleta tão rápidas quanto motos?',
        category: 'logistics'
      },
      {
        projectId: project.id,
        question: 'Como podemos mostrar o impacto ambiental positivo de cada pedido?',
        category: 'experience'
      }
    ]);
    
    console.log('✅ HMW questions created');

    // 4. FASE 3 - IDEAR
    
    await db.insert(ideas).values([
      {
        projectId: project.id,
        title: 'Sistema de Embalagens Retornáveis',
        description: 'Embalagens de vidro/metal que voltam ao restaurante. Cliente paga caução, recebe de volta ao devolver.',
        category: 'solution',
        status: 'selected',
        votes: 24
      },
      {
        projectId: project.id,
        title: 'Frota de Bicicletas Elétricas',
        description: 'Entregas 100% com bikes elétricas em raio de 5km. Para distâncias maiores, carros elétricos.',
        category: 'solution',
        status: 'selected',
        votes: 31
      },
      {
        projectId: project.id,
        title: 'Impacto Ambiental em Tempo Real',
        description: 'Dashboard mostrando CO2 economizado, plástico evitado, árvores salvas a cada pedido.',
        category: 'feature',
        status: 'selected',
        votes: 18
      },
      {
        projectId: project.id,
        title: 'Certificação Verde para Restaurantes',
        description: 'Selo de verificação para restaurantes que usam ingredientes locais e práticas sustentáveis.',
        category: 'feature',
        status: 'brainstorming',
        votes: 12
      },
      {
        projectId: project.id,
        title: 'Programa de Fidelidade Ecológico',
        description: 'Pontos por cada pedido sustentável, troque por árvores plantadas ou descontos.',
        category: 'marketing',
        status: 'brainstorming',
        votes: 15
      }
    ]);
    
    console.log('✅ Ideas created');

    // 5. FASE 4 - PROTOTIPAR
    
    const [prototype] = await db.insert(prototypes).values({
      projectId: project.id,
      name: 'App EcoDelivery MVP',
      type: 'digital',
      description: 'Protótipo funcional do aplicativo com: busca de restaurantes sustentáveis, rastreamento de entrega eco-friendly, contador de impacto ambiental.',
      materials: JSON.stringify([
        'Figma para design',
        'React Native para desenvolvimento',
        'Google Maps API para rotas',
        'Sistema de embalagens retornáveis piloto'
      ]),
      images: JSON.stringify([]),
      version: 2,
      feedback: 'Interface intuitiva e clean. Contador de impacto muito engajador. Falta opção de agendamento de coleta de embalagens. Usuários adoram ver CO2 economizado.'
    }).returning();
    
    console.log('✅ Prototype created');

    // 6. FASE 5 - TESTAR
    
    const [testPlan] = await db.insert(testPlans).values({
      projectId: project.id,
      prototypeId: prototype.id,
      name: 'Teste Beta EcoDelivery',
      objective: 'Validar aceitação do modelo de embalagens retornáveis e experiência de entrega sustentável',
      methodology: 'Teste Beta com 50 usuários em 3 bairros de São Paulo por 2 semanas',
      participants: 50,
      duration: 20160, // 2 semanas em minutos
      tasks: JSON.stringify([
        'Fazer 3 pedidos usando embalagens retornáveis',
        'Devolver embalagens nos pontos de coleta',
        'Avaliar tempo de entrega',
        'Compartilhar impacto ambiental nas redes'
      ]),
      metrics: JSON.stringify([
        'Taxa de devolução de embalagens',
        'NPS (Net Promoter Score)',
        'Tempo médio de entrega vs delivery tradicional',
        'Satisfação com impacto ambiental'
      ])
    }).returning();
    
    console.log('✅ Test plan created');

    // Test Results
    await db.insert(testResults).values([
      {
        testPlanId: testPlan.id,
        participantId: 'P001',
        taskResults: JSON.stringify([
          { task: 'Fazer pedidos', completed: true, time: 15 },
          { task: 'Devolver embalagens', completed: true, time: 5 },
          { task: 'Avaliar entrega', completed: true, rating: 4.5 }
        ]),
        feedback: 'Sistema de embalagens retornáveis funciona perfeitamente! Contador de impacto é muito motivador.',
        successRate: 0.94,
        completionTime: 25,
        insights: 'Taxa de devolução de 94% - excelente adesão! Sistema de caução funciona bem.'
      },
      {
        testPlanId: testPlan.id,
        participantId: 'P002',
        taskResults: JSON.stringify([
          { task: 'Fazer pedidos', completed: true, time: 12 },
          { task: 'Devolver embalagens', completed: true, time: 3 },
          { task: 'Compartilhar nas redes', completed: true, engagement: 'alto' }
        ]),
        feedback: 'Adorei poder ver o CO2 economizado! Muito fácil devolver as embalagens.',
        successRate: 0.92,
        completionTime: 20,
        insights: 'NPS de 78 - muito acima da média do setor (40-50). Usuários promovem ativamente o serviço.'
      },
      {
        testPlanId: testPlan.id,
        participantId: 'P003',
        taskResults: JSON.stringify([
          { task: 'Fazer pedidos', completed: true, time: 35 },
          { task: 'Avaliar tempo', completed: true, acceptable: true }
        ]),
        feedback: 'Entrega levou 4 min a mais que normal, mas vale a pena pela sustentabilidade.',
        successRate: 0.89,
        completionTime: 35,
        insights: 'Tempo médio 32 min vs 28 min tradicional. 89% dos usuários aceitam o tempo maior.'
      }
    ]);
    
    console.log('✅ Test results created');

    console.log('\n🎉 SHOWCASE PROJECT CREATED SUCCESSFULLY!');
    console.log('Project ID:', project.id);
    console.log('Project Name:', project.name);
    console.log('Phases completed: 1-5 (Design Thinking completo)');
    
  } catch (error) {
    console.error('Error creating showcase project:', error);
    throw error;
  }
}

createShowcaseProject()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
