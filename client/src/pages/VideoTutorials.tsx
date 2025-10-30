import { useState } from "react";
import { Video, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";

interface VideoScript {
  id: string;
  title: string;
  duration: string;
  description: string;
  scenes: {
    time: string;
    narration: string;
    visual: string;
  }[];
  keywords: string[];
}

const videoScripts: Record<string, VideoScript[]> = {
  phase1: [
    {
      id: "empathy-map",
      title: "Como criar um Mapa de Empatia",
      duration: "3-4 min",
      description: "Aprenda a capturar o que os usuários dizem, pensam, fazem e sentem",
      keywords: ["empathy map", "user research", "user interview", "design thinking"],
      scenes: [
        {
          time: "0:00-0:15",
          narration: "Olá! Neste tutorial você vai aprender a criar um Mapa de Empatia no DTTools. O Mapa de Empatia é uma ferramenta visual que ajuda a entender profundamente os usuários.",
          visual: "Tela inicial do DTTools com logo e interface limpa. Zoom suave no menu 'Empatizar'"
        },
        {
          time: "0:15-0:30",
          narration: "Para começar, acesse seu projeto e clique em 'Empatizar', depois em 'Mapa de Empatia'. Você verá quatro quadrantes: Diz, Pensa, Faz e Sente.",
          visual: "Navegação: Dashboard → Projeto → Fase Empatizar → Botão 'Criar Mapa de Empatia'. Interface mostrando os 4 quadrantes vazios"
        },
        {
          time: "0:30-1:00",
          narration: "O quadrante 'Diz' registra o que o usuário fala diretamente. Por exemplo: 'Eu não tenho tempo para organizar minhas finanças'. Use frases reais das entrevistas.",
          visual: "Close no quadrante 'Diz'. Animação de texto sendo digitado: 'Não tenho tempo para...'. Tooltip aparecendo com dica"
        },
        {
          time: "1:00-1:30",
          narration: "No quadrante 'Pensa', capture os pensamentos não verbalizados. O que o usuário pensa mas não diz? Por exemplo: 'Será que vou conseguir economizar dinheiro?'",
          visual: "Transição para quadrante 'Pensa'. Texto sendo digitado com exemplos. Ícone de lâmpada aparecendo"
        },
        {
          time: "1:30-2:00",
          narration: "O quadrante 'Faz' documenta ações observáveis. O que você viu o usuário fazer? Exemplo: 'Usa planilhas Excel para controle manual', 'Consulta o banco todo dia'.",
          visual: "Quadrante 'Faz' com ações sendo listadas. Ícone de checklist. Animação mostrando múltiplas ações"
        },
        {
          time: "2:00-2:30",
          narration: "Finalmente, 'Sente' captura emoções. Como o usuário se sente? 'Frustrado com o tempo perdido', 'Ansioso sobre o futuro financeiro'.",
          visual: "Quadrante 'Sente' sendo preenchido. Ícones de emoções (😟😰). Cores suaves indicando sentimentos"
        },
        {
          time: "2:30-3:00",
          narration: "Dica importante: Use informações REAIS de entrevistas. Não invente dados. Quanto mais autêntico, melhor será sua solução.",
          visual: "Banner de 'Melhores Práticas' destacado. Lista de dicas aparecendo. Ícone de alerta amigável"
        },
        {
          time: "3:00-3:30",
          narration: "Pronto! Seu Mapa de Empatia completo te dá uma visão 360° do usuário. Você pode criar múltiplos mapas para diferentes perfis de usuários.",
          visual: "Mapa de Empatia completo e preenchido. Zoom out mostrando vários mapas criados. Botão 'Salvar' sendo clicado"
        },
        {
          time: "3:30-3:45",
          narration: "Agora você está pronto para entender profundamente seus usuários. No próximo vídeo, vamos criar Personas baseadas nestes insights.",
          visual: "Tela de sucesso com check verde. Preview do próximo vídeo (Personas) aparecendo no canto"
        }
      ]
    },
    {
      id: "personas",
      title: "Como criar Personas eficazes",
      duration: "3-4 min",
      description: "Transforme dados de pesquisa em personas realistas e acionáveis",
      keywords: ["personas", "user profiles", "target audience", "design thinking"],
      scenes: [
        {
          time: "0:00-0:20",
          narration: "Personas são personagens fictícios que representam grupos de usuários reais. Neste tutorial, você vai criar personas baseadas nos seus Mapas de Empatia.",
          visual: "Tela mostrando cards de personas exemplo. Transição suave para interface de criação"
        },
        {
          time: "0:20-0:50",
          narration: "Primeiro, dê um nome e idade para sua persona. Por exemplo: 'Ana, 32 anos, gerente de marketing'. Adicione uma descrição breve que humanize o perfil.",
          visual: "Formulário de persona sendo preenchido. Campos: Nome, Idade, Descrição. Avatar placeholder. Digitação em tempo real"
        },
        {
          time: "0:50-1:30",
          narration: "Agora defina os OBJETIVOS. O que sua persona quer alcançar? Exemplo: 'Economizar 30% do salário', 'Planejar aposentadoria'. Use dados reais dos Mapas de Empatia.",
          visual: "Campo 'Objetivos' com tooltip aberto. Exemplos sendo digitados. Referência visual ao Mapa de Empatia anterior"
        },
        {
          time: "1:30-2:10",
          narration: "As FRUSTRAÇÕES são igualmente importantes. O que impede sua persona de alcançar seus objetivos? 'Falta de tempo', 'Aplicativos financeiros complexos', 'Medo de investir errado'.",
          visual: "Campo 'Frustrações' destacado. Lista sendo preenchida. Ícone de alerta. Conexão com quadrante 'Sente' do mapa"
        },
        {
          time: "2:10-2:50",
          narration: "Por último, as MOTIVAÇÕES. O que move sua persona? 'Segurança financeira para a família', 'Realizar sonho de viajar', 'Independência financeira'.",
          visual: "Campo 'Motivações' sendo preenchido. Ícone de foguete/estrela. Energia positiva na UI"
        },
        {
          time: "2:50-3:20",
          narration: "Dica PRO: Personas eficazes são específicas, não genéricas. Evite 'todo mundo' ou 'usuários em geral'. Quanto mais detalhada, mais útil será.",
          visual: "Banner de melhores práticas. Comparação lado a lado: Persona genérica ❌ vs Persona específica ✅"
        },
        {
          time: "3:20-3:45",
          narration: "Excelente! Sua persona está pronta. Use-a durante todo o projeto para tomar decisões centradas no usuário. No próximo vídeo: Declarações POV.",
          visual: "Persona completa sendo salva. Card da persona renderizado lindamente. Preview da fase 'Definir'"
        }
      ]
    }
  ],
  phase2: [
    {
      id: "pov-statement",
      title: "Como escrever Declarações POV poderosas",
      duration: "4-5 min",
      description: "Transforme insights em declarações acionáveis usando a fórmula POV",
      keywords: ["POV statement", "point of view", "problem definition", "design thinking"],
      scenes: [
        {
          time: "0:00-0:25",
          narration: "A Declaração de Ponto de Vista, ou POV, é a fundação do seu projeto. É aqui que você transforma insights em uma definição clara do problema a resolver.",
          visual: "Animação mostrando transição: Empatia → Definição. Fórmula POV aparecendo: Usuário + Necessidade + Insight"
        },
        {
          time: "0:25-1:00",
          narration: "A fórmula POV tem três partes: USUÁRIO, NECESSIDADE e INSIGHT. Primeiro, escolha uma persona. Exemplo: 'Ana, gerente de marketing de 32 anos'.",
          visual: "Formulário POV aberto. Campo 'Usuário' destacado. Dropdown de personas aparecendo. Seleção de 'Ana'"
        },
        {
          time: "1:00-1:45",
          narration: "Agora, qual é a NECESSIDADE real dessa pessoa? Não o que ela quer, mas o que ela PRECISA. Por exemplo: 'precisa de uma forma simples de controlar suas finanças diárias'.",
          visual: "Campo 'Necessidade' em foco. Tooltip explicando diferença entre 'quer' e 'precisa'. Exemplo sendo digitado"
        },
        {
          time: "1:45-2:30",
          narration: "O INSIGHT é a chave: uma descoberta surpreendente da fase de empatia. 'Porque acredita que apps financeiros atuais são feitos para especialistas, não para pessoas comuns'.",
          visual: "Campo 'Insight' com tooltip 'Por quê?' aberto. Exemplos de insights fortes vs fracos. Digitação do insight"
        },
        {
          time: "2:30-3:00",
          narration: "Veja os três exemplos completos na tela. Note como cada POV é específico, acionável e revela uma oportunidade clara de design.",
          visual: "Seção de exemplos expandida. 3 cards de POV exemplo animando na tela. Highlight nas partes: usuário, necessidade, insight"
        },
        {
          time: "3:00-3:40",
          narration: "Dica importante: Um bom POV não menciona soluções. Ele define o problema de forma que inspire múltiplas soluções criativas.",
          visual: "Banner de melhores práticas. Exemplo RUIM (com solução) ❌ vs Exemplo BOM (sem solução) ✅"
        },
        {
          time: "3:40-4:15",
          narration: "Dica extra: Crie vários POVs para o mesmo usuário. Cada POV pode levar a caminhos diferentes de solução.",
          visual: "Lista mostrando 3 POVs diferentes para a mesma persona Ana. Múltiplas oportunidades visualizadas"
        },
        {
          time: "4:15-4:30",
          narration: "Perfeito! Com seu POV definido, você está pronto para criar perguntas 'Como Poderíamos'. Esse é o próximo vídeo.",
          visual: "POV sendo salvo com animação de sucesso. Preview da ferramenta HMW aparecendo"
        }
      ]
    },
    {
      id: "hmw-questions",
      title: "Como criar perguntas Como Poderíamos (HMW)",
      duration: "3-4 min",
      description: "Transforme POVs em perguntas que inspiram soluções criativas",
      keywords: ["HMW", "how might we", "ideation", "creative questions", "design thinking"],
      scenes: [
        {
          time: "0:00-0:20",
          narration: "As perguntas 'Como Poderíamos' ou HMW transformam seu POV em oportunidades de solução. Elas são o trampolim para a fase de ideação.",
          visual: "Animação: POV → HMW Questions → Ideas. Transição visual entre fases do Design Thinking"
        },
        {
          time: "0:20-0:50",
          narration: "Toda pergunta HMW começa com 'Como poderíamos...'. Primeiro, selecione o POV Statement que você criou anteriormente.",
          visual: "Interface HMW. Dropdown de POV aberto. Seleção de um POV. Card do POV selecionado aparecendo como referência"
        },
        {
          time: "0:50-1:30",
          narration: "Agora formule a pergunta. Exemplo: 'Como poderíamos tornar o controle financeiro tão simples quanto enviar uma mensagem?'",
          visual: "Campo de pergunta HMW sendo preenchido. Texto digitado palavra por palavra. Contador de caracteres"
        },
        {
          time: "1:30-2:10",
          narration: "Dica 1: Evite perguntas muito AMPLAS como 'Como poderíamos melhorar finanças?'. Muito genérico. Seja específico ao problema do seu POV.",
          visual: "Banner de melhores práticas. Exemplo de pergunta ampla demais ❌. Ícone de alerta"
        },
        {
          time: "2:10-2:50",
          narration: "Dica 2: Evite perguntas muito RESTRITAS como 'Como poderíamos criar um app azul de finanças?'. Isso já pressupõe a solução. Foque no problema.",
          visual: "Exemplo de pergunta restritiva ❌. Highlight em 'app azul' mostrando o erro. Comparação com versão melhorada ✅"
        },
        {
          time: "2:50-3:20",
          narration: "Dica 3: Crie MÚLTIPLAS perguntas HMW para cada POV. Cada ângulo diferente pode revelar soluções únicas.",
          visual: "Lista de 4-5 HMWs diferentes para o mesmo POV. Cada um destacando um ângulo: simplicidade, tempo, confiança, acessibilidade"
        },
        {
          time: "3:20-3:45",
          narration: "Veja os três exemplos na tela. Note como cada um abre possibilidades sem limitar a criatividade da solução.",
          visual: "Seção de exemplos mostrando 3 HMWs fortes. Cada um com mini-ícone indicando o foco (💡 criatividade, ⚡ simplicidade, 🎯 especificidade)"
        },
        {
          time: "3:45-4:00",
          narration: "Ótimo trabalho! Com suas perguntas HMW prontas, você está preparado para a fase mais criativa: Ideação. Vamos lá!",
          visual: "HMWs salvos com sucesso. Transição para preview da Fase 3 - Ideação. Ícone de lâmpada animado"
        }
      ]
    }
  ],
  phase3: [
    {
      id: "ideation",
      title: "Como gerar e avaliar ideias com DVF",
      duration: "4-5 min",
      description: "Use o framework Desejabilidade-Viabilidade-Exequibilidade para priorizar ideias",
      keywords: ["ideation", "brainstorming", "DVF framework", "desirability viability feasibility", "design thinking"],
      scenes: [
        {
          time: "0:00-0:25",
          narration: "Bem-vindo à fase de Ideação! Aqui você vai transformar suas perguntas HMW em soluções concretas e avaliá-las usando o framework DVF.",
          visual: "Animação celebrando a fase criativa. Ícone de lâmpada brilhando. Interface de ideação vazia esperando ideias"
        },
        {
          time: "0:25-1:00",
          narration: "O framework DVF avalia três dimensões: Desejabilidade - Os usuários querem isso? Viabilidade - É um bom negócio? Exequibilidade - Conseguimos construir?",
          visual: "Diagrama DVF aparecendo: 3 círculos se sobrepondo. Centro destacado = 'Sweet Spot'. Animação mostrando intersecção"
        },
        {
          time: "1:00-1:40",
          narration: "Vamos criar uma ideia. Digite o título: 'App de finanças com controle por voz'. Descreva: 'Usuário fala gastos e o app registra automaticamente'.",
          visual: "Formulário de ideia aberto. Campo 'Título' e 'Descrição' sendo preenchidos. Cursor digitando em tempo real"
        },
        {
          time: "1:40-2:20",
          narration: "Agora avalie DESEJABILIDADE de 1 a 5. Pergunta-chave: Isso resolve um problema REAL dos usuários? 5 = problema crítico, 3 = útil, 1 = usuários não ligam.",
          visual: "Slider de Desejabilidade destacado. Tooltip explicativo aberto. Movimento do slider de 1 para 4. Explicação visual de cada nível"
        },
        {
          time: "2:20-3:00",
          narration: "VIABILIDADE: Isso pode se tornar um negócio sustentável? Considere modelo de receita, custo de aquisição, potencial de escala. Seja realista.",
          visual: "Slider de Viabilidade em foco. Tooltip com perguntas-guia. Ícone de cifrão. Slider sendo ajustado para 3"
        },
        {
          time: "3:00-3:40",
          narration: "EXEQUIBILIDADE: Temos capacidade técnica para construir isso? Tecnologia existe? Tempo necessário? Recursos disponíveis?",
          visual: "Slider de Exequibilidade destacado. Tooltip com critérios técnicos. Ícone de engrenagem. Slider ajustado para 4"
        },
        {
          time: "3:40-4:10",
          narration: "O sistema calcula automaticamente a pontuação total DVF. Ideias com scores balanceados e altos têm mais chance de sucesso.",
          visual: "Score total DVF calculando (4+3+4)/3 = 3.7. Gráfico radar mostrando os 3 eixos. Feedback visual (cor verde para score alto)"
        },
        {
          time: "4:10-4:40",
          narration: "Dica PRO: Gere MUITAS ideias primeiro sem julgar. Depois avalie com DVF. Quantidade gera qualidade na ideação.",
          visual: "Lista mostrando 10+ ideias geradas. Algumas com score alto, outras baixo. Sorting por score DVF"
        },
        {
          time: "4:40-5:00",
          narration: "Parabéns! Suas ideias estão priorizadas. Agora é hora de prototipar as melhores. Nos vemos na Fase 4!",
          visual: "Ideia salva com sucesso. Preview da Fase 4 - Prototipagem. Transição suave para próxima fase"
        }
      ]
    }
  ],
  phase4: [
    {
      id: "prototyping",
      title: "Como criar Protótipos eficazes",
      duration: "3-4 min",
      description: "Aprenda a documentar e versionar seus protótipos para testes",
      keywords: ["prototyping", "wireframes", "mockups", "MVP", "design thinking"],
      scenes: [
        {
          time: "0:00-0:20",
          narration: "Na fase de Prototipagem, você vai materializar suas ideias de forma rápida e barata para testar com usuários reais.",
          visual: "Animação: Ideia → Protótipo → Teste. Interface de protótipos mostrando diferentes tipos"
        },
        {
          time: "0:20-1:00",
          narration: "Escolha o tipo de protótipo. Digital para apps e sites, Físico para produtos tangíveis, ou Storyboard para visualizar a experiência do usuário.",
          visual: "Dropdown 'Tipo de Protótipo' aberto. 3 opções: Digital, Físico, Storyboard. Ícones ilustrativos para cada tipo"
        },
        {
          time: "1:00-1:40",
          narration: "Dê um nome descritivo: 'Tela de cadastro simplificado - v1'. Na descrição, explique o que este protótipo testa: 'Valida se cadastro em 3 passos reduz desistência'.",
          visual: "Campos sendo preenchidos. Ênfase em nomear com versão. Campo descrição destacando objetivo do teste"
        },
        {
          time: "1:40-2:20",
          narration: "Cole o link do seu protótipo. Pode ser Figma, Marvel, InVision, ou até fotos de sketches no Google Drive. O importante é estar acessível.",
          visual: "Campo URL sendo preenchido com link do Figma. Preview thumbnail aparecendo. Exemplos de diferentes ferramentas"
        },
        {
          time: "2:20-3:00",
          narration: "Dica importante: Comece com baixa fidelidade. Sketches em papel funcionam! Não perca tempo em detalhes visuais antes de validar a ideia.",
          visual: "Comparação: Sketch em papel ✅ (rápido, 1h) vs Design pixel-perfect ❌ (lento, 2 dias). Princípio 'fail fast'"
        },
        {
          time: "3:00-3:30",
          narration: "Use versões para iterar. v1, v2, v3. Cada ciclo de teste gera uma nova versão com melhorias baseadas em feedback real.",
          visual: "Timeline mostrando evolução: v1 (sketch) → v2 (wireframe) → v3 (mockup). Feedback de usuários entre versões"
        },
        {
          time: "3:30-3:50",
          narration: "Protótipo criado! Agora você está pronto para testá-lo com usuários. No próximo vídeo: Como planejar e executar testes.",
          visual: "Protótipo salvo. Card do protótipo renderizado. Transição para Fase 5 - Testes"
        }
      ]
    }
  ],
  phase5: [
    {
      id: "testing",
      title: "Como testar protótipos com usuários",
      duration: "4-5 min",
      description: "Planeje testes, colete feedback e gere insights acionáveis",
      keywords: ["user testing", "usability testing", "feedback", "insights", "design thinking"],
      scenes: [
        {
          time: "0:00-0:25",
          narration: "A fase de Teste é onde você valida (ou invalida) suas hipóteses. Vamos aprender a planejar testes estruturados e extrair insights valiosos.",
          visual: "Animação: Protótipo → Teste → Insights → Iteração. Ciclo de aprendizado contínuo visualizado"
        },
        {
          time: "0:25-1:10",
          narration: "Primeiro, defina o OBJETIVO do teste. O que você quer aprender? Exemplo: 'Validar se usuários conseguem completar cadastro em menos de 2 minutos sem ajuda'.",
          visual: "Formulário de teste aberto. Campo 'Objetivo' sendo preenchido. Destaque para objetivos mensuráveis (SMART)"
        },
        {
          time: "1:10-1:50",
          narration: "Defina os PARTICIPANTES. Quem deve testar? Use suas personas como guia. Exemplo: 'Adultos 25-40 anos, que usam apps financeiros, pelo menos ensino médio'.",
          visual: "Campo 'Participantes' com referência às personas criadas antes. Critérios de seleção listados"
        },
        {
          time: "1:50-2:30",
          narration: "Planeje as TAREFAS. O que você vai pedir para eles fazerem? Exemplo: 'Tarefa 1: Cadastre-se no app. Tarefa 2: Adicione seu primeiro gasto.'",
          visual: "Lista de tarefas sendo adicionada. Numeração clara (1, 2, 3). Cada tarefa específica e testável"
        },
        {
          time: "2:30-3:10",
          narration: "Durante o teste, registre os RESULTADOS. O que funcionou? O que confundiu? Anote TUDO: hesitações, comentários, expressões faciais.",
          visual: "Seção de resultados sendo preenchida. Notas em bullet points. Ícones: ✅ sucessos, ❌ problemas, 💡 insights"
        },
        {
          time: "3:10-3:50",
          narration: "Finalmente, extraia INSIGHTS. O que você aprendeu? Exemplo: '80% dos usuários não viram o botão Continuar (muito pequeno)' → Ação: Aumentar botão em 50%.",
          visual: "Campo 'Insights' com formato: Descoberta → Ação necessária. Conexão entre observação e próximo passo"
        },
        {
          time: "3:50-4:20",
          narration: "Dica PRO: Teste com 5 usuários por rodada. Estudos mostram que 5 pessoas revelam 85% dos problemas de usabilidade. Mais que isso traz retorno decrescente.",
          visual: "Gráfico mostrando curva: problemas descobertos x número de usuários testados. Sweet spot = 5 usuários destacado"
        },
        {
          time: "4:20-4:50",
          narration: "Lembre-se: Teste é aprendizado, não validação do seu ego. Feedback negativo é ouro! Significa que você descobriu problemas ANTES de lançar.",
          visual: "Mensagem motivacional. Antes vs Depois: descobrir problema no teste ✅ vs descobrir após lançamento ❌"
        },
        {
          time: "4:50-5:05",
          narration: "Parabéns! Você completou as 5 fases do Design Thinking. Agora você tem um processo completo para criar soluções centradas no usuário. Sucesso!",
          visual: "Celebração! Confetes. Todas as 5 fases iluminadas com check verde. CTA: 'Crie seu primeiro projeto'"
        }
      ]
    }
  ],
  overview: [
    {
      id: "design-thinking-intro",
      title: "Introdução ao Design Thinking no DTTools",
      duration: "3-4 min",
      description: "Visão geral das 5 fases e como usar a plataforma",
      keywords: ["design thinking", "introduction", "overview", "getting started", "dttools"],
      scenes: [
        {
          time: "0:00-0:20",
          narration: "Olá! Bem-vindo ao DTTools, sua plataforma completa para Design Thinking. Neste vídeo, você vai entender o que é Design Thinking e como usar esta ferramenta.",
          visual: "Logo DTTools animado. Transição para dashboard principal. Interface limpa e convidativa"
        },
        {
          time: "0:20-0:50",
          narration: "Design Thinking é uma metodologia para resolver problemas de forma criativa e centrada no usuário. São 5 fases: Empatizar, Definir, Idear, Prototipar e Testar.",
          visual: "Diagrama das 5 fases aparecendo uma a uma. Ícones representativos de cada fase. Movimento circular mostrando iteração"
        },
        {
          time: "0:50-1:20",
          narration: "Fase 1 - EMPATIZAR: Entenda profundamente seus usuários através de pesquisas, entrevistas e observação. É a base de tudo.",
          visual: "Fase 1 destacada. Screenshots de Mapa de Empatia e Personas. Pessoas sendo entrevistadas (ilustração)"
        },
        {
          time: "1:20-1:50",
          narration: "Fase 2 - DEFINIR: Transforme insights em uma definição clara do problema. Aqui você cria POV Statements e perguntas 'Como Poderíamos'.",
          visual: "Fase 2 iluminada. Exemplo de POV Statement aparecendo. Fórmula: Usuário + Necessidade + Insight"
        },
        {
          time: "1:50-2:20",
          narration: "Fase 3 - IDEAR: Gere MUITAS ideias de solução sem julgamento. Depois avalie usando o framework DVF: Desejabilidade, Viabilidade e Exequibilidade.",
          visual: "Fase 3 em destaque. Brainstorm de ideias. Diagrama DVF com 3 círculos. Priorização de ideias"
        },
        {
          time: "2:20-2:50",
          narration: "Fase 4 - PROTOTIPAR: Crie versões rápidas e baratas das suas ideias. Pode ser sketch, wireframe ou mockup. O importante é testar rápido.",
          visual: "Fase 4 destacada. Exemplos de protótipos: papel, Figma, storyboard. Evolução v1 → v2 → v3"
        },
        {
          time: "2:50-3:20",
          narration: "Fase 5 - TESTAR: Valide seus protótipos com usuários reais. Colete feedback, aprenda e itere. O ciclo continua até ter uma solução validada.",
          visual: "Fase 5 iluminada. Pessoas testando protótipos. Anotações de feedback. Ciclo: Teste → Aprenda → Melhore → Teste novamente"
        },
        {
          time: "3:20-3:50",
          narration: "O DTTools te guia em cada etapa com templates, tooltips e exemplos reais. Você nunca vai se sentir perdido. E nossa IA está aqui para ajudar!",
          visual: "Tour rápido: Tooltips aparecendo, Exemplos, NextStepCard com recomendação, Chat IA disponível"
        },
        {
          time: "3:50-4:05",
          narration: "Pronto para começar? Crie seu primeiro projeto e transforme problemas em soluções inovadoras. Vamos juntos nessa jornada!",
          visual: "Botão 'Criar Projeto' pulsando. Animação motivacional. Logo DTTools com tagline: 'Design centrado no usuário, feito simples'"
        }
      ]
    }
  ]
};

export default function VideoTutorials() {
  const { t } = useLanguage();
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const renderVideoScript = (script: VideoScript) => (
    <Card key={script.id} className="mb-4" data-testid={`video-script-${script.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-blue-600" />
              {script.title}
              <span className="text-sm font-normal text-muted-foreground">({script.duration})</span>
            </CardTitle>
            <CardDescription className="mt-2">{script.description}</CardDescription>
            <div className="flex flex-wrap gap-1 mt-3">
              {script.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
            data-testid={`toggle-script-${script.id}`}
          >
            {expandedScript === script.id ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {expandedScript === script.id && (
        <CardContent>
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Roteiro para Veo 3.1
              </h4>
              <p className="text-sm text-amber-800">
                Use este roteiro cena por cena para criar seu vídeo no Google Veo 3.1. 
                Cada cena inclui a narração (o que falar) e as instruções visuais (o que mostrar).
              </p>
            </div>

            {script.scenes.map((scene, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {scene.time}
                  </span>
                  <span className="text-xs text-muted-foreground">Cena {index + 1}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-1">🎙️ Narração:</h5>
                    <p className="text-sm text-gray-900 leading-relaxed italic">
                      "{scene.narration}"
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-1">🎬 Visual:</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {scene.visual}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-green-900 mb-2">✅ Checklist de Produção</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>☑️ Grave a narração com tom amigável e pausado</li>
                <li>☑️ Use transições suaves entre cenas (0.5-1s)</li>
                <li>☑️ Mantenha interface limpa e legível (UI escalável)</li>
                <li>☑️ Adicione música de fundo sutil (opcional)</li>
                <li>☑️ Teste o vídeo em tela pequena (mobile)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <Video className="h-10 w-10 text-blue-600" />
            Tutoriais em Vídeo
          </h1>
          <p className="text-lg text-gray-600">
            Roteiros completos passo a passo para criar vídeos educacionais no Veo 3.1
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full" data-testid="video-tutorials-tabs">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="phase1" data-testid="tab-phase1">Fase 1 - Empatizar</TabsTrigger>
            <TabsTrigger value="phase2" data-testid="tab-phase2">Fase 2 - Definir</TabsTrigger>
            <TabsTrigger value="phase3" data-testid="tab-phase3">Fase 3 - Idear</TabsTrigger>
            <TabsTrigger value="phase4" data-testid="tab-phase4">Fase 4 - Prototipar</TabsTrigger>
            <TabsTrigger value="phase5" data-testid="tab-phase5">Fase 5 - Testar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">📚 Sobre esta Seção</h3>
              <p className="text-blue-800 leading-relaxed mb-4">
                Estes roteiros foram criados especificamente para você gravar vídeos tutoriais usando o <strong>Google Veo 3.1</strong>.
                Cada roteiro inclui timing, narração completa e instruções visuais detalhadas.
              </p>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✅ <strong>Narração pronta:</strong> Textos otimizados para falar naturalmente</li>
                <li>✅ <strong>Instruções visuais:</strong> O que mostrar em cada cena</li>
                <li>✅ <strong>Timing preciso:</strong> Duração sugerida para cada segmento</li>
                <li>✅ <strong>Keywords SEO:</strong> Palavras-chave para indexação no YouTube</li>
              </ul>
            </div>
            {videoScripts.overview.map(renderVideoScript)}
          </TabsContent>

          <TabsContent value="phase1" className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-900 mb-2">Fase 1: Empatizar</h3>
              <p className="text-sm text-purple-800">
                Entenda profundamente seus usuários através de pesquisas e observações
              </p>
            </div>
            {videoScripts.phase1.map(renderVideoScript)}
          </TabsContent>

          <TabsContent value="phase2" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Fase 2: Definir</h3>
              <p className="text-sm text-blue-800">
                Transforme insights em declarações claras de problemas a resolver
              </p>
            </div>
            {videoScripts.phase2.map(renderVideoScript)}
          </TabsContent>

          <TabsContent value="phase3" className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Fase 3: Idear</h3>
              <p className="text-sm text-green-800">
                Gere múltiplas soluções criativas e priorize com o framework DVF
              </p>
            </div>
            {videoScripts.phase3.map(renderVideoScript)}
          </TabsContent>

          <TabsContent value="phase4" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">Fase 4: Prototipar</h3>
              <p className="text-sm text-amber-800">
                Materialize suas ideias de forma rápida e barata para validação
              </p>
            </div>
            {videoScripts.phase4.map(renderVideoScript)}
          </TabsContent>

          <TabsContent value="phase5" className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Fase 5: Testar</h3>
              <p className="text-sm text-red-800">
                Valide protótipos com usuários reais e aprenda continuamente
              </p>
            </div>
            {videoScripts.phase5.map(renderVideoScript)}
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Dicas para Gravar com Veo 3.1</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Antes de gravar:</h4>
              <ul className="space-y-1">
                <li>📱 Prepare screenshots da interface DTTools</li>
                <li>🎨 Use templates visuais consistentes</li>
                <li>📝 Pratique a narração em voz alta</li>
                <li>⏱️ Respeite o timing sugerido</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Durante a gravação:</h4>
              <ul className="space-y-1">
                <li>🎙️ Fale de forma clara e pausada</li>
                <li>😊 Mantenha tom amigável e encorajador</li>
                <li>🎬 Use transições suaves entre cenas</li>
                <li>✨ Destaque elementos importantes com zoom ou highlight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
