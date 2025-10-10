import { db } from '../server/db';
import { eq } from 'drizzle-orm';
import { 
  projects, 
  empathyMaps, 
  personas, 
  observations,
  povStatements, 
  hmwQuestions, 
  ideas, 
  prototypes, 
  testPlans 
} from '../shared/schema';

async function createPrenatalProject() {
  try {
    console.log('🏥 Criando projeto de Pré-Natal UBS...');

    // 1. Get admin user
    const adminUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'dttools.app@gmail.com')
    });

    if (!adminUser) {
      throw new Error('Admin user not found!');
    }

    console.log('✅ Admin user found:', adminUser.email);

    // 2. Create Project
    const [project] = await db.insert(projects).values({
      userId: adminUser.id,
      name: 'Acesso ao Pré-Natal na UBS - Zona Leste SP',
      description: 'Projeto de Design Thinking focado em melhorar a experiência de gestantes ao agendar e realizar consultas de pré-natal na UBS da Zona Leste de São Paulo. Baseado na jornada real de Manuela Oliveira, 26 anos, mãe de uma menina de 5 anos.',
      status: 'in_progress',
      currentPhase: 1,
      completionRate: 0
    }).returning();

    console.log('✅ Projeto criado:', project.id);

    // 3. FASE 1 - EMPATIZAR

    // 3.1 Mapa de Empatia - Manuela
    const [empathyMap] = await db.insert(empathyMaps).values({
      projectId: project.id,
      title: 'Mapa de Empatia - Manuela Oliveira (Gestante)',
      says: JSON.stringify([
        '"Preciso confirmar minha gravidez na UBS"',
        '"Não consigo ligar, a linha sempre dá ocupado"',
        '"Preciso começar o pré-natal logo"',
        '"A Ângela me ajudou muito com o agendamento"',
        '"Espero que tudo corra bem com o bebê"'
      ]),
      thinks: JSON.stringify([
        'Estou preocupada com a saúde do bebê',
        'Preciso me organizar melhor com o trabalho e a Gabriela',
        'Não sei se minhas vacinas estão em dia',
        'Como vou conseguir tempo para todas as consultas?',
        'Preciso preparar o quarto do bebê'
      ]),
      does: JSON.stringify([
        'Trabalha em loja de departamentos no shopping',
        'Cuida da filha Gabriela (5 anos)',
        'Tenta ligar para UBS várias vezes',
        'Recebe visita da ACS em casa',
        'Vai até a UBS para consulta'
      ]),
      feels: JSON.stringify([
        'Ansiosa pela confirmação da gravidez',
        'Aliviada quando a ACS a ajuda',
        'Acolhida pela recepcionista Daniela',
        'Confiante com orientações da enfermeira Adriana',
        'Esperançosa com a chegada do bebê'
      ])
    }).returning();

    console.log('✅ Mapa de Empatia criado');

    // 3.2 Persona - Manuela
    const [persona] = await db.insert(personas).values({
      projectId: project.id,
      name: 'Manuela Oliveira',
      age: 26,
      occupation: 'Vendedora em Loja de Departamentos',
      bio: 'Manuela tem 26 anos e mora na Zona Leste de São Paulo. Trabalha em uma loja de departamentos em shopping center e é mãe de Gabriela, de 5 anos. Descobriu recentemente que está grávida novamente e precisa acessar o pré-natal na UBS de seu bairro. É uma mulher trabalhadora, dedicada à família e que busca o melhor para seus filhos.',
      goals: JSON.stringify([
        'Confirmar gravidez e iniciar pré-natal o quanto antes',
        'Garantir saúde do bebê e gravidez tranquila',
        'Atualizar vacinas e seguir orientações médicas',
        'Conciliar trabalho, cuidados com Gabriela e consultas',
        'Preparar a chegada do novo bebê'
      ]),
      frustrations: JSON.stringify([
        'Dificuldade para agendar consulta na UBS (telefone sempre ocupado)',
        'Falta de tempo entre trabalho e cuidados com a filha',
        'Não saber se está tudo bem com a gravidez',
        'Informações confusas sobre documentos necessários',
        'Medo de perder vaga no pré-natal'
      ]),
      motivations: JSON.stringify([
        'Saúde e bem-estar do bebê',
        'Ser uma boa mãe para Gabriela e o novo filho',
        'Apoio da ACS Ângela que a orienta',
        'Atendimento humanizado da equipe da UBS',
        'Sonho de ter uma família saudável'
      ]),
      techSavviness: 'medium'
    }).returning();

    console.log('✅ Persona Manuela criada');

    // 3.3 Observação de Campo - UBS
    const [observation] = await db.insert(observations).values({
      projectId: project.id,
      location: 'UBS Zona Leste - São Paulo',
      context: 'Dia de consulta de pré-natal. Observação da chegada de Manuela, recepção, triagem e consulta com enfermeira.',
      behavior: 'Manuela chega pontualmente, se apresenta na recepção com timidez mas é recebida com carinho pela Daniela. Aguarda pacientemente na sala de espera. Durante triagem com auxiliar de enfermagem, demonstra ansiedade ao medir pressão. Na consulta com enfermeira Adriana, faz muitas perguntas sobre cuidados, vacinas e complementos. Sai da UBS mais tranquila e confiante.',
      insights: 'O acolhimento humanizado da equipe (Daniela, auxiliar, Adriana) é fundamental para tranquilizar a gestante. A ACS Ângela tem papel crucial na ponte entre comunidade e UBS. Gestantes de primeira viagem ou com filhos pequenos precisam de orientações claras e suporte para agendamento.',
      date: new Date('2025-10-08')
    }).returning();

    console.log('✅ Observação de Campo criada');

    // 4. FASE 2 - DEFINIR

    // 4.1 POV Statement
    const [pov] = await db.insert(povStatements).values({
      projectId: project.id,
      user: 'Gestante trabalhadora da Zona Leste de São Paulo, mãe de uma criança pequena',
      need: 'Agendar consulta de pré-natal de forma rápida e sem burocracia, conciliando com trabalho e cuidados com a filha',
      insight: 'O telefone da UBS raramente atende, mas o apoio presencial da Agente Comunitária de Saúde resolve o problema de forma humanizada',
      statement: 'Gestantes trabalhadoras da Zona Leste precisam de um sistema de agendamento acessível e apoio da ACS porque o telefone da UBS é insuficiente e elas têm pouco tempo disponível entre trabalho e família.',
      priority: 'high'
    }).returning();

    console.log('✅ POV Statement criado');

    // 4.2 How Might We
    const [hmw1] = await db.insert(hmwQuestions).values({
      projectId: project.id,
      question: 'Como podemos facilitar o agendamento de consultas de pré-natal sem depender apenas do telefone?',
      context: 'Gestantes como Manuela enfrentam dificuldade para agendar pois o telefone da UBS sempre dá ocupado',
      challenge: 'Sistema de agendamento atual inadequado para demanda',
      scope: 'service',
      priority: 'high',
      category: 'Acesso',
      votes: 8
    }).returning();

    const [hmw2] = await db.insert(hmwQuestions).values({
      projectId: project.id,
      question: 'Como podemos ampliar o papel das ACS no suporte às gestantes?',
      context: 'A ACS Ângela foi fundamental para ajudar Manuela a conseguir a consulta',
      challenge: 'Potencializar papel das agentes comunitárias como ponte entre comunidade e UBS',
      scope: 'service',
      priority: 'high',
      category: 'Suporte',
      votes: 6
    }).returning();

    const [hmw3] = await db.insert(hmwQuestions).values({
      projectId: project.id,
      question: 'Como podemos tornar a jornada do pré-natal mais clara e orientada para gestantes de primeira viagem?',
      context: 'Manuela tinha dúvidas sobre vacinas, documentos e etapas do pré-natal',
      challenge: 'Falta de informação estruturada sobre processo completo do pré-natal',
      scope: 'experience',
      priority: 'medium',
      category: 'Informação',
      votes: 5
    }).returning();

    console.log('✅ How Might We criados (3)');

    // 5. FASE 3 - IDEAR

    // 5.1 Ideia 1 - App de Agendamento
    const [idea1] = await db.insert(ideas).values({
      projectId: project.id,
      title: 'App/WhatsApp de Agendamento UBS',
      description: 'Aplicativo ou chatbot no WhatsApp para agendamento de consultas de pré-natal. Gestante escolhe data/hora disponível, recebe confirmação automática e lembretes. Integrado com sistema da UBS.',
      category: 'Digital',
      desirability: 5, // Gestantes adorariam agendar pelo celular
      viability: 4, // Viável com WhatsApp Business API
      feasibility: 3, // Precisa integração com sistema da UBS
      confidenceLevel: 4,
      dvfScore: 4.0,
      dvfAnalysis: 'Alta desejabilidade pois resolve dor principal (telefone ocupado). Viável via WhatsApp Business. Desafio técnico é integração com prontuário eletrônico da UBS.',
      actionDecision: 'love_it',
      priorityRank: 1,
      votes: 12
    }).returning();

    // 5.2 Ideia 2 - Capacitação ACS
    const [idea2] = await db.insert(ideas).values({
      projectId: project.id,
      title: 'Capacitação e Equipamento para ACS',
      description: 'Treinar e equipar Agentes Comunitárias de Saúde com tablets/celulares para agendamento durante visitas domiciliares. ACS vira ponte digital entre gestante e UBS.',
      category: 'Capacitação',
      desirability: 4, // Gestantes confiam nas ACS
      viability: 4, // Governo já investe em ACS
      feasibility: 4, // Treinamento + equipamento viável
      confidenceLevel: 4,
      dvfScore: 4.0,
      dvfAnalysis: 'Desejável pois ACS já tem relação de confiança. Viável com investimento em capacitação. Executável com tablets e sistema simplificado.',
      actionDecision: 'love_it',
      priorityRank: 2,
      votes: 10
    }).returning();

    // 5.3 Ideia 3 - Guia do Pré-Natal
    const [idea3] = await db.insert(ideas).values({
      projectId: project.id,
      title: 'Guia Digital do Pré-Natal',
      description: 'Plataforma/app com checklist completo do pré-natal: documentos necessários, vacinas, exames, complementos, consultas. Notificações personalizadas por semana de gestação.',
      category: 'Informação',
      desirability: 5, // Gestantes precisam de orientação clara
      viability: 5, // Baixo custo para criar conteúdo digital
      feasibility: 5, // Tecnicamente simples (PWA)
      confidenceLevel: 5,
      dvfScore: 5.0,
      dvfAnalysis: 'Altíssimo DVF. Desejável (reduz ansiedade), viável (conteúdo já existe), executável (PWA simples). Quick win!',
      actionDecision: 'love_it',
      priorityRank: 3,
      votes: 9
    }).returning();

    console.log('✅ Ideias criadas (3)');

    // 6. FASE 4 - PROTOTIPAR

    // 6.1 Protótipo - WhatsApp Bot
    const [prototype1] = await db.insert(prototypes).values({
      projectId: project.id,
      ideaId: idea1.id,
      name: 'Protótipo WhatsApp Bot - Agendamento Pré-Natal',
      type: 'digital',
      description: 'Fluxo de conversação no WhatsApp para agendamento de pré-natal. Bot cumprimenta gestante, solicita dados básicos (nome, SUS, semanas de gestação), mostra horários disponíveis, confirma agendamento e envia lembrete 1 dia antes.',
      materials: JSON.stringify([
        'WhatsApp Business API',
        'Plataforma de chatbot (Twilio/DialogFlow)',
        'Integração com agenda da UBS',
        'Base de dados de gestantes'
      ]),
      images: JSON.stringify([]),
      version: 1,
      feedback: 'Gestantes acharam muito mais fácil que ligar. Solicitaram também opção de reagendar pelo bot.'
    }).returning();

    // 6.2 Protótipo - Tablet ACS
    const [prototype2] = await db.insert(prototypes).values({
      projectId: project.id,
      ideaId: idea2.id,
      name: 'Protótipo Interface Tablet ACS',
      type: 'digital',
      description: 'Interface simplificada em tablet para ACS agendar consultas durante visita domiciliar. Tela com calendário visual, cadastro rápido de gestante, confirmação instantânea e impressão de comprovante.',
      materials: JSON.stringify([
        'Tablet Android',
        'App offline-first (sincroniza depois)',
        'Impressora térmica portátil',
        'Manual de treinamento para ACS'
      ]),
      images: JSON.stringify([]),
      version: 1,
      feedback: 'ACS Ângela testou e aprovou. Sugeriu adicionar campo para anotar observações da visita.'
    }).returning();

    console.log('✅ Protótipos criados (2)');

    // 7. FASE 5 - TESTAR

    // 7.1 Plano de Teste - WhatsApp Bot
    const [testPlan] = await db.insert(testPlans).values({
      projectId: project.id,
      prototypeId: prototype1.id,
      name: 'Teste de Usabilidade - WhatsApp Bot Agendamento',
      objective: 'Validar se gestantes conseguem agendar consulta de pré-natal de forma autônoma pelo WhatsApp, medindo taxa de sucesso, tempo de conclusão e satisfação.',
      methodology: 'Teste de usabilidade moderado com 10 gestantes da Zona Leste. Cenário: "Você descobriu que está grávida e precisa agendar primeira consulta de pré-natal. Use o WhatsApp da UBS."',
      participants: 10,
      duration: 15,
      tasks: JSON.stringify([
        'Iniciar conversa com bot da UBS',
        'Informar dados pessoais (nome, CPF, SUS)',
        'Escolher data e horário disponível',
        'Confirmar agendamento',
        'Verificar se recebeu confirmação'
      ]),
      metrics: JSON.stringify([
        'Taxa de conclusão (meta: >90%)',
        'Tempo médio de agendamento (meta: <3 min)',
        'Satisfação (NPS meta: >8)',
        'Número de erros/dúvidas',
        'Taxa de abandono'
      ]),
      status: 'completed'
    }).returning();

    console.log('✅ Plano de Teste criado');

    // Update project completion
    await db.update(projects)
      .set({ 
        currentPhase: 5, 
        completionRate: 100,
        status: 'completed'
      })
      .where(eq(projects.id, project.id));

    console.log('✅ Projeto atualizado - 100% completo!');

    console.log('\n🎉 PROJETO CRIADO COM SUCESSO!');
    console.log('\n📊 Resumo:');
    console.log('- Projeto:', project.name);
    console.log('- ID:', project.id);
    console.log('- Fase 1 (Empatizar): 1 mapa de empatia, 1 persona, 1 observação');
    console.log('- Fase 2 (Definir): 1 POV statement, 3 HMW questions');
    console.log('- Fase 3 (Idear): 3 ideias com análise DVF');
    console.log('- Fase 4 (Prototipar): 2 protótipos digitais');
    console.log('- Fase 5 (Testar): 1 plano de teste completo');
    console.log('\n✅ Projeto 100% completo e pronto para visualização no admin!');

  } catch (error) {
    console.error('❌ Erro ao criar projeto:', error);
    throw error;
  }
}

// Execute
createPrenatalProject()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
