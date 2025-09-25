# Manual do Administrador - DTTools
## Guia Completo de Administração da Plataforma

### Sumário
1. [Visão Geral da Administração](#visão-geral)
2. [Gerenciamento de Usuários](#usuarios)
3. [Gerenciamento de Artigos](#artigos)
4. [Análise e Relatórios](#analytics)
5. [Configurações da Plataforma](#configurações)
6. [Manutenção e Suporte](#manutenção)
7. [Segurança e Backup](#segurança)

---

## 1. Visão Geral da Administração {#visão-geral}

### 1.1 Acesso ao Painel Administrativo
O painel de administração é acessível apenas para usuários com role de "admin".

**Login de Administrador:**
- URL: dttools.app/admin
- Credenciais fornecidas separadamente
- Autenticação de dois fatores habilitada

### 1.2 Dashboard Principal
O dashboard administrativo apresenta:
- **Métricas em tempo real:** Usuários ativos, projetos criados, sessões
- **Estatísticas do sistema:** Performance, uso de recursos, erros
- **Alertas importantes:** Problemas críticos, manutenções programadas
- **Ações rápidas:** Links para funcionalidades mais usadas

### 1.3 Estrutura de Navegação
- **📊 Dashboard:** Visão geral e métricas
- **👥 Usuários:** Gerenciamento completo de contas
- **📚 Artigos:** Biblioteca de conteúdo educacional  
- **🏢 Projetos:** Monitoramento de atividade dos projetos
- **⚙️ Configurações:** Ajustes da plataforma
- **🔧 Ferramentas:** Utilitários administrativos

---

## 2. Gerenciamento de Usuários {#usuarios}

### 2.1 Lista de Usuários
A tela principal mostra todos os usuários com:
- **Informações básicas:** Nome, email, data de cadastro
- **Status da conta:** Ativo, inativo, suspenso
- **Plano atual:** Free, Pro, Enterprise
- **Última atividade:** Data/hora do último acesso
- **Ações rápidas:** Editar, desativar, excluir

### 2.2 Criando Novos Usuários
**Processo manual:**
1. Clique em "Novo Usuário"
2. Preencha dados obrigatórios:
   - Nome completo
   - Email válido
   - Senha temporária
   - Role (user/admin)
3. Defina plano inicial
4. Envie convite por email

**Importação em lote:**
- Suporta arquivos CSV/Excel
- Template disponível para download
- Validação automática de dados
- Relatório de importação com erros

### 2.3 Editando Usuários Existentes
Dados editáveis:
- **Informações pessoais:** Nome, email, telefone
- **Configurações da conta:** Plano, status, role
- **Preferências:** Idioma, timezone, notificações
- **Histórico:** Log completo de atividades

### 2.4 Gerenciamento de Planos
**Planos disponíveis:**
- **Free:** 3 projetos, recursos básicos
- **Pro:** Projetos ilimitados, análise IA, exportação premium
- **Enterprise:** Tudo do Pro + suporte dedicado, customização

**Alteração de planos:**
1. Selecione usuário na lista
2. Clique em "Alterar Plano"
3. Escolha novo plano
4. Defina data de validade (se aplicável)
5. Confirme alteração

### 2.5 Suspensão e Exclusão
**Suspender conta:**
- Usuário não consegue fazer login
- Dados preservados
- Reversível a qualquer momento
- Notificação automática por email

**Excluir conta:**
- ⚠️ **ATENÇÃO:** Ação irreversível
- Remove todos os dados do usuário
- Projetos compartilhados permanecem
- Backup automático antes da exclusão

---

## 3. Gerenciamento de Artigos {#artigos}

### 3.1 Biblioteca de Artigos
A biblioteca contém recursos educacionais sobre Design Thinking:
- Artigos técnicos
- Tutoriais passo-a-passo
- Cases de sucesso
- Templates e frameworks

### 3.2 Criando Artigos
**Editor rico disponível com:**
- Formatação de texto completa
- Inserção de imagens e vídeos
- Tabelas e listas
- Sintaxe Markdown
- Preview em tempo real

**Campos obrigatórios:**
- Título do artigo
- Autor
- Categoria (Empatizar, Definir, Idear, Prototipar, Testar, Design Thinking, Criatividade, UX/UI)
- Conteúdo principal
- Tags (separadas por vírgula)

**Campos opcionais:**
- Descrição/resumo
- Imagem destacada
- Data de publicação personalizada
- SEO metadata

### 3.3 Categoria Personalizada
Além das categorias padrão, é possível:
1. Selecionar "📝 Categoria Personalizada"
2. Digite nova categoria no campo que aparece
3. A categoria será criada automaticamente
4. Aparecerá nas próximas criações de artigo

### 3.4 Sistema de Publicação
**Estados do artigo:**
- **Rascunho:** Visível apenas para admins
- **Revisão:** Aguardando aprovação
- **Publicado:** Visível para todos os usuários
- **Arquivado:** Não visível, mas preservado

**Controles de publicação:**
- Toggle simples Publicado/Não publicado
- Programação de publicação futura
- Controle de acesso por plano de usuário

### 3.5 Análise de Engajamento
Para cada artigo, visualize:
- Número de visualizações
- Tempo médio de leitura
- Taxa de conclusão
- Comentários e feedback
- Artigos relacionados mais acessados

---

## 4. Análise e Relatórios {#analytics}

### 4.1 Métricas de Usuários
**Crescimento:**
- Novos cadastros por período
- Taxa de ativação (primeiro projeto criado)
- Usuários ativos (diário, semanal, mensal)
- Churn rate por plano

**Engajamento:**
- Sessões por usuário
- Tempo médio na plataforma
- Funcionalidades mais utilizadas
- Taxa de conclusão de projetos

### 4.2 Métricas de Uso
**Projetos:**
- Total de projetos criados
- Média de projetos por usuário
- Fases mais utilizadas
- Taxa de abandono por fase

**Conteúdo:**
- Artigos mais lidos
- Downloads de templates
- Feedback positivo/negativo
- Sugestões de novos conteúdos

### 4.3 Relatórios Financeiros
**Receita:**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Revenue por usuário (ARPU)
- Previsão de crescimento

**Conversão:**
- Free → Pro conversion rate
- Pro → Enterprise upgrade rate
- Seasonal patterns
- Retention by cohort

### 4.4 Relatórios Técnicos
**Performance:**
- Tempo de resposta das APIs
- Uptime da aplicação
- Erros por funcionalidade
- Uso de recursos (CPU, memória, storage)

**Segurança:**
- Tentativas de login maliciosas
- Vulnerabilidades detectadas
- Backups realizados
- Compliance audit trail

---

## 5. Configurações da Plataforma {#configurações}

### 5.1 Configurações Gerais
**Branding:**
- Logo da plataforma
- Cores principais e secundárias
- Fontes personalizadas
- Favicon e ícones

**Funcionalidades:**
- Habilitar/desabilitar análise IA
- Limites por plano de usuário
- Recursos experimentais (beta features)
- Integrações externas

### 5.2 Configurações de Email
**SMTP Settings:**
- Servidor de email
- Porta e segurança
- Usuário e senha
- Templates de email personalizados

**Notificações automáticas:**
- Welcome emails para novos usuários
- Password reset
- Alertas de cobrança
- Newsletters e updates

### 5.3 Configurações de Segurança
**Autenticação:**
- Política de senhas
- Tempo de sessão
- Two-factor authentication obrigatório
- Single Sign-On (SSO) integrations

**Privacidade:**
- GDPR compliance settings
- Data retention policies
- Audit log retention
- User consent management

### 5.4 Integrações
**APIs disponíveis:**
- OpenAI para análise de texto
- Storage services (AWS S3, Google Cloud)
- Payment gateways (Stripe)
- Analytics (Google Analytics, Mixpanel)

**Webhooks:**
- Novos usuários registrados
- Projetos criados/concluídos
- Pagamentos processados
- Erros críticos do sistema

---

## 6. Manutenção e Suporte {#manutenção}

### 6.1 Monitoramento do Sistema
**Health Checks automáticos:**
- Database connectivity
- API response times
- File storage availability
- External service status

**Alertas configuráveis:**
- Email/SMS para admins
- Thresholds personalizáveis
- Escalation procedures
- Integration com Slack/Teams

### 6.2 Backup e Restore
**Backup automático:**
- Database backup diário
- Files backup semanal
- Configuration backup
- Cross-region replication

**Restore procedures:**
- Point-in-time recovery
- Selective data restore
- User data export
- Disaster recovery plan

### 6.3 Manutenções Programadas
**Planejamento:**
- Janela de manutenção definida
- Comunicação prévia aos usuários
- Rollback plan preparado
- Monitoring intensivo pós-deploy

**Durante manutenção:**
- Status page atualizada
- Progress communication
- Issue escalation process
- Post-maintenance validation

### 6.4 Suporte ao Usuário
**Tickets de suporte:**
- Sistema integrado de ticketing
- Categorização automática
- SLA por tipo de problema
- Knowledge base integration

**Live chat:**
- Business hours availability
- Canned responses
- File sharing capability
- Escalation to technical team

---

## 7. Segurança e Backup {#segurança}

### 7.1 Políticas de Segurança
**Acesso administrativo:**
- Princípio do menor privilégio
- Regular access reviews
- Mandatory 2FA para admins
- Session timeout policies

**Proteção de dados:**
- Encryption at rest and in transit
- PCI DSS compliance
- SOC 2 Type II certification
- Regular security audits

### 7.2 Incident Response
**Classificação de incidentes:**
- **Crítico:** Sistema indisponível
- **Alto:** Funcionalidade principal afetada
- **Médio:** Recursos secundários impactados
- **Baixo:** Problemas cosméticos

**Response procedures:**
- Immediate notification protocol
- Technical team escalation
- Customer communication plan
- Post-incident review process

### 7.3 Compliance e Auditoria
**Frameworks seguidos:**
- GDPR (European users)
- SOC 2 (Security)
- ISO 27001 (Information Security)
- WCAG 2.1 (Accessibility)

**Audit trail:**
- Admin actions logged
- User data access tracked
- System changes recorded
- Compliance reports generated

---

## Comandos e Atalhos Úteis

### Atalhos de Teclado
- `Ctrl + S` - Salvar configurações
- `Ctrl + F` - Buscar na página atual
- `Ctrl + Shift + U` - Ir para gerenciamento de usuários
- `Ctrl + Shift + A` - Ir para gerenciamento de artigos
- `Esc` - Fechar modais/popups

### URLs Diretas
- `/admin/users` - Lista de usuários
- `/admin/articles` - Gerenciamento de artigos
- `/admin/analytics` - Dashboard de analytics
- `/admin/settings` - Configurações gerais
- `/admin/logs` - Logs do sistema

---

## Solução de Problemas Comuns

### "Usuário não consegue fazer login"
1. Verificar status da conta
2. Confirmar email não está em spam
3. Reset manual de senha
4. Verificar configurações de 2FA
5. Checar logs de autenticação

### "Artigo não aparece para usuários"
1. Confirmar status "Publicado"
2. Verificar permissões por plano
3. Limpar cache da aplicação
4. Verificar categoria e tags
5. Testar em modo incógnito

### "Relatórios não carregam"
1. Verificar conectividade com analytics DB
2. Confirmar permissões de acesso
3. Checar logs de erro
4. Regenerar relatório manualmente
5. Verificar timeout configurations

---

## Contatos de Emergência

**Suporte Técnico 24/7:**
- Email: admin@dttools.app
- Telefone: +55 11 9999-9999
- Slack: #dttools-admin

**Infraestrutura:**
- AWS Support: Case priority "Business"
- Database Support: PostgreSQL team
- CDN Issues: Cloudflare support

---

*Manual administrativo atualizado em setembro de 2025 - Versão 1.0*
*Próxima revisão programada para dezembro de 2025*