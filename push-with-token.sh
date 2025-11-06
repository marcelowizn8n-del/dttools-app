#!/bin/bash

# Script para fazer push usando token do GitHub
# Uso: ./push-with-token.sh SEU_TOKEN_AQUI

if [ -z "$1" ]; then
    echo "❌ Erro: Token não fornecido"
    echo ""
    echo "Uso: ./push-with-token.sh SEU_TOKEN_AQUI"
    echo ""
    echo "Exemplo:"
    echo "  ./push-with-token.sh ghp_xxxxxxxxxxxxxxxxxxxx"
    exit 1
fi

TOKEN=$1
REPO_URL="https://${TOKEN}@github.com/marcelowizn8n-del/dttools-app.git"

echo "🚀 Fazendo push para GitHub..."
echo ""

# Fazer push usando o token
git push $REPO_URL main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push realizado com sucesso!"
    echo ""
    echo "📊 Próximos passos:"
    echo "   1. O Render detectará o push automaticamente (1-2 min)"
    echo "   2. O deploy iniciará automaticamente (3-5 min)"
    echo "   3. Acesse https://dashboard.render.com para acompanhar"
    echo ""
else
    echo ""
    echo "❌ Erro ao fazer push. Verifique:"
    echo "   - Se o token está correto"
    echo "   - Se o token tem permissão 'repo'"
    echo "   - Se você tem acesso ao repositório"
    exit 1
fi

