#!/usr/bin/env node

/**
 * GERADOR AUTOMÁTICO DE SCREENSHOTS - DTTOOLS
 * 
 * Captura screenshots do sistema em múltiplas resoluções
 * para submissão em App Stores (Apple + Google)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  // URL base do site
  baseUrl: process.env.SITE_URL || 'https://www.designthinkingtools.com',
  
  // Credenciais para páginas protegidas (MUDE AQUI!)
  credentials: {
    email: process.env.DEMO_EMAIL || 'demo@dttools.app',
    password: process.env.DEMO_PASSWORD || 'Demo2024!'
  },
  
  // Resoluções para captura
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
    
    // Resoluções específicas para App Stores
    'iphone-6.7': { width: 1290, height: 2796 },
    'ipad-12.9': { width: 2048, height: 2732 },
    'android-phone': { width: 1080, height: 1920 }
  },
  
  // Diretório de saída
  outputDir: './screenshots',
  
  // Páginas para capturar
  pages: [
    // Públicas (não precisa login)
    {
      name: 'landing',
      url: '/',
      waitFor: 'section',
      protected: false,
      description: 'Landing page com hero e features'
    },
    {
      name: 'pricing',
      url: '/pricing',
      waitFor: '.pricing-card, [data-testid*="card"]',
      protected: false,
      description: 'Página de planos e preços'
    },
    {
      name: 'login',
      url: '/login',
      waitFor: 'form',
      protected: false,
      description: 'Tela de login'
    },
    {
      name: 'signup',
      url: '/signup',
      waitFor: 'form',
      protected: false,
      description: 'Tela de cadastro'
    },
    
    // Protegidas (precisa login)
    {
      name: 'dashboard',
      url: '/dashboard',
      waitFor: '[data-testid*="phase"], .phase-card',
      protected: true,
      description: 'Dashboard com 5 fases do DT'
    },
    {
      name: 'projects',
      url: '/projects',
      waitFor: '[data-testid*="project"], .project-card',
      protected: true,
      description: 'Lista de projetos'
    },
    {
      name: 'empathy-map',
      url: '/projects/1', // Assumindo que projeto 1 existe
      waitFor: '.empathy-map, [data-testid*="empathy"]',
      protected: true,
      description: 'Mapa de Empatia (Fase 1)'
    },
    {
      name: 'ideation-canvas',
      url: '/projects/1?tab=idear', // Forçar aba Idear
      waitFor: '.idea-card, [data-testid*="idea"]',
      protected: true,
      description: 'Canvas de Ideação com Matriz DVF (Fase 3)'
    },
    {
      name: 'prototype-canvas',
      url: '/projects/1?tab=prototipar',
      waitFor: 'canvas, [data-testid*="canvas"]',
      protected: true,
      description: 'Canvas de Prototipagem (Fase 4)'
    },
    {
      name: 'benchmarking',
      url: '/benchmarking',
      waitFor: '.benchmark-chart, [data-testid*="benchmark"]',
      protected: true,
      description: 'Análise de maturidade com IA'
    }
  ]
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function createDirectories() {
  const dirs = [
    CONFIG.outputDir,
    ...Object.keys(CONFIG.viewports).map(v => path.join(CONFIG.outputDir, v))
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Criado diretório: ${dir}`);
    }
  });
}

async function login(page) {
  console.log('🔐 Fazendo login...');
  
  try {
    await page.goto(`${CONFIG.baseUrl}/login`, { waitUntil: 'networkidle2' });
    
    // Preencher formulário de login
    await page.type('input[type="email"], input[name="email"]', CONFIG.credentials.email);
    await page.type('input[type="password"], input[name="password"]', CONFIG.credentials.password);
    
    // Clicar no botão de login
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ Login realizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return false;
  }
}

async function captureScreenshot(page, pageConfig, viewport, viewportName) {
  const filename = `${pageConfig.name}-${viewportName}.png`;
  const filepath = path.join(CONFIG.outputDir, viewportName, filename);
  
  console.log(`📸 Capturando: ${pageConfig.description} (${viewportName})...`);
  
  try {
    // Configurar viewport
    await page.setViewport(viewport);
    
    // Navegar para página
    await page.goto(`${CONFIG.baseUrl}${pageConfig.url}`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Aguardar elemento específico aparecer
    if (pageConfig.waitFor) {
      await page.waitForSelector(pageConfig.waitFor, { timeout: 10000 }).catch(() => {
        console.warn(`⚠️  Elemento ${pageConfig.waitFor} não encontrado, continuando...`);
      });
    }
    
    // Aguardar um pouco para animações/carregamento
    await page.waitForTimeout(2000);
    
    // Capturar screenshot em alta qualidade
    await page.screenshot({
      path: filepath,
      fullPage: true,
      type: 'png',
      captureBeyondViewport: true
    });
    
    console.log(`✅ Salvo: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao capturar ${filename}:`, error.message);
    return false;
  }
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 GERADOR AUTOMÁTICO DE SCREENSHOTS - DTTOOLS\n');
  console.log(`📍 Site: ${CONFIG.baseUrl}`);
  console.log(`📁 Destino: ${CONFIG.outputDir}\n`);
  
  // Criar diretórios
  createDirectories();
  
  // Iniciar navegador
  console.log('🌐 Iniciando navegador...\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Configurar User-Agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    // Separar páginas públicas e protegidas
    const publicPages = CONFIG.pages.filter(p => !p.protected);
    const protectedPages = CONFIG.pages.filter(p => p.protected);
    
    // === CAPTURAR PÁGINAS PÚBLICAS ===
    console.log('📄 CAPTURANDO PÁGINAS PÚBLICAS\n');
    for (const pageConfig of publicPages) {
      for (const [viewportName, viewport] of Object.entries(CONFIG.viewports)) {
        await captureScreenshot(page, pageConfig, viewport, viewportName);
      }
      console.log(''); // linha em branco
    }
    
    // === LOGIN E CAPTURAR PÁGINAS PROTEGIDAS ===
    if (protectedPages.length > 0) {
      console.log('🔒 CAPTURANDO PÁGINAS PROTEGIDAS\n');
      
      const loginSuccess = await login(page);
      
      if (loginSuccess) {
        for (const pageConfig of protectedPages) {
          for (const [viewportName, viewport] of Object.entries(CONFIG.viewports)) {
            await captureScreenshot(page, pageConfig, viewport, viewportName);
          }
          console.log(''); // linha em branco
        }
      } else {
        console.error('❌ Não foi possível fazer login. Páginas protegidas não foram capturadas.');
      }
    }
    
    // === RESUMO ===
    console.log('\n✅ CAPTURA CONCLUÍDA!\n');
    console.log('📊 RESUMO:');
    console.log(`   Páginas: ${CONFIG.pages.length}`);
    console.log(`   Resoluções: ${Object.keys(CONFIG.viewports).length}`);
    console.log(`   Total de screenshots: ${CONFIG.pages.length * Object.keys(CONFIG.viewports).length}`);
    console.log(`\n📁 Screenshots salvos em: ${CONFIG.outputDir}/\n`);
    
    // Listar arquivos criados por resolução
    for (const viewportName of Object.keys(CONFIG.viewports)) {
      const dir = path.join(CONFIG.outputDir, viewportName);
      const files = fs.readdirSync(dir);
      console.log(`   ${viewportName}/ (${files.length} arquivos)`);
    }
    
  } catch (error) {
    console.error('\n❌ ERRO GERAL:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Processo finalizado!');
  }
}

// ============================================
// CLI
// ============================================

// Verificar argumentos de linha de comando
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📸 GERADOR AUTOMÁTICO DE SCREENSHOTS - DTTOOLS

USO:
  node generate-screenshots.js [opções]

OPÇÕES:
  --help, -h              Mostra esta ajuda
  --url <url>             URL do site (padrão: ${CONFIG.baseUrl})
  --email <email>         Email para login (padrão: ${CONFIG.credentials.email})
  --password <pass>       Senha para login
  --output <dir>          Diretório de saída (padrão: ${CONFIG.outputDir})
  --pages <names>         Capturar apenas páginas específicas (separadas por vírgula)
  --viewports <names>     Capturar apenas resoluções específicas (separadas por vírgula)

EXEMPLOS:
  # Capturar tudo (padrão)
  node generate-screenshots.js

  # Capturar apenas dashboard e pricing
  node generate-screenshots.js --pages dashboard,pricing

  # Capturar apenas mobile e tablet
  node generate-screenshots.js --viewports mobile,tablet

  # Usar credenciais diferentes
  node generate-screenshots.js --email user@example.com --password mypass

  # Usar variáveis de ambiente
  SITE_URL=https://mysite.com DEMO_EMAIL=user@test.com node generate-screenshots.js

VARIÁVEIS DE AMBIENTE:
  SITE_URL               URL base do site
  DEMO_EMAIL             Email para login
  DEMO_PASSWORD          Senha para login
  `);
  process.exit(0);
}

// Parse argumentos customizados
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--url':
      CONFIG.baseUrl = args[++i];
      break;
    case '--email':
      CONFIG.credentials.email = args[++i];
      break;
    case '--password':
      CONFIG.credentials.password = args[++i];
      break;
    case '--output':
      CONFIG.outputDir = args[++i];
      break;
    case '--pages':
      const pageNames = args[++i].split(',');
      CONFIG.pages = CONFIG.pages.filter(p => pageNames.includes(p.name));
      break;
    case '--viewports':
      const viewportNames = args[++i].split(',');
      const filteredViewports = {};
      for (const name of viewportNames) {
        if (CONFIG.viewports[name]) {
          filteredViewports[name] = CONFIG.viewports[name];
        }
      }
      CONFIG.viewports = filteredViewports;
      break;
  }
}

// Executar
main().catch(console.error);
