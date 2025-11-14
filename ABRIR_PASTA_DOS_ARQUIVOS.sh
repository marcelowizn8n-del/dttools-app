#!/bin/bash

echo "🔍 Abrindo a pasta com os documentos..."
echo ""

# Detectar sistema operacional e abrir pasta
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open /workspace
    echo "✅ Pasta aberta no Finder (Mac)"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open /workspace
        echo "✅ Pasta aberta no gerenciador de arquivos (Linux)"
    elif command -v nautilus &> /dev/null; then
        nautilus /workspace &
        echo "✅ Pasta aberta no Nautilus"
    else
        echo "⚠️  Execute manualmente:"
        echo "   cd /workspace"
        echo "   ls -la *.zip"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    explorer.exe /workspace
    echo "✅ Pasta aberta no Windows Explorer"
else
    echo "⚠️  Sistema não detectado. Abra manualmente:"
    echo "   Localização: /workspace"
fi

echo ""
echo "📦 ARQUIVOS PARA BAIXAR:"
echo ""
ls -lh /workspace/*.zip 2>/dev/null | awk '{print "   •", $9, "(" $5 ")"}'
echo ""
echo "📄 OU ACESSE OS ARQUIVOS ORIGINAIS EM:"
echo "   • /workspace/docs/AVALIACAO_PROJETO_ATUAL.md"
echo "   • /workspace/docs/GOOGLE_CLOUD_MIGRATION_GUIDE.md"
echo "   • /workspace/docs/RESUMO_EXECUTIVO_MIGRACAO.md"
echo "   • /workspace/docs/README_MIGRACAO_GCP.md"
echo ""
