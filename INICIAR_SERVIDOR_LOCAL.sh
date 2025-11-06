#!/bin/bash

# Script para iniciar o servidor local do DTTools
# Permite visualizar o site localmente antes da apresentação

echo "🚀 Iniciando servidor local do DTTools..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script dentro da pasta dttools-atual"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📋 Criando .env a partir do .env.example..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente antes de continuar."
    echo ""
    echo "⚠️  IMPORTANTE: Configure pelo menos:"
    echo "   - DATABASE_URL (PostgreSQL)"
    echo "   - SESSION_SECRET"
    echo ""
    read -p "Pressione Enter para continuar ou Ctrl+C para cancelar..."
fi

# Iniciar servidor de desenvolvimento
echo "🌐 Iniciando servidor de desenvolvimento..."
echo "📍 O site estará disponível em: http://localhost:5000"
echo ""
echo "Para parar o servidor, pressione Ctrl+C"
echo ""

npm run dev

