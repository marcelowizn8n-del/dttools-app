#!/bin/bash

# Script para migrar código para o novo repositório
# dttools-completo

echo "🚀 Iniciando migração para dttools-completo..."

# Remover remote temporário se existir
git remote remove new-origin 2>/dev/null

# Adicionar novo repositório
echo "📌 Adicionando novo repositório..."
git remote add dttools-completo https://github.com/marcelowizn8n-del/dttools-completo.git

# Fazer push de todas as branches
echo "📤 Fazendo push de todas as branches..."
git push dttools-completo --all

# Fazer push de todas as tags
echo "🏷️  Fazendo push de todas as tags..."
git push dttools-completo --tags

# Definir o novo repositório como origin principal
echo "🔄 Atualizando origin principal..."
git remote rename origin old-origin
git remote rename dttools-completo origin

echo ""
echo "✅ Migração concluída!"
echo ""
echo "📊 Repositórios configurados:"
git remote -v

echo ""
echo "✨ Próximos passos:"
echo "1. Verificar: https://github.com/marcelowizn8n-del/dttools-completo"
echo "2. Fazer novos commits neste repositório"
echo "3. Push futuro: git push origin [branch-name]"
