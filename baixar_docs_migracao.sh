#!/bin/bash

# Script para facilitar download da documentação de migração GCP
# Criado em: 14/11/2025

echo "📚 Preparando documentação de migração para download..."
echo ""

# Criar pasta de destino
DEST_DIR="DTTools_Migracao_GCP_Docs"
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

# Copiar documentos principais
echo "📄 Copiando documentos..."
cp docs/AVALIACAO_PROJETO_ATUAL.md "$DEST_DIR/" 2>/dev/null
cp docs/GOOGLE_CLOUD_MIGRATION_GUIDE.md "$DEST_DIR/" 2>/dev/null
cp docs/RESUMO_EXECUTIVO_MIGRACAO.md "$DEST_DIR/" 2>/dev/null
cp docs/README_MIGRACAO_GCP.md "$DEST_DIR/" 2>/dev/null

# Criar README de índice
cat > "$DEST_DIR/COMECE_AQUI.txt" << 'EOF'
═══════════════════════════════════════════════════════
  DOCUMENTAÇÃO - MIGRAÇÃO DTTOOLS PARA GOOGLE CLOUD
═══════════════════════════════════════════════════════

📚 4 DOCUMENTOS PRINCIPAIS

1. COMECE POR ESTE! (Se você NÃO é desenvolvedor)
   📄 RESUMO_EXECUTIVO_MIGRACAO.md (9.4 KB)
   → Visão geral, custos, timeline, aprovação
   → Tempo de leitura: 15 minutos

2. Para Desenvolvedores (Visão Técnica)
   📄 AVALIACAO_PROJETO_ATUAL.md (43 KB)
   → Arquitetura completa, stack, banco de dados
   → Tempo de leitura: 30-45 minutos

3. Para Desenvolvedores (Implementação)
   📄 GOOGLE_CLOUD_MIGRATION_GUIDE.md (25 KB)
   → Passo a passo completo (11 etapas)
   → Comandos prontos para executar
   → Tempo de consulta: Durante a implementação

4. Índice e Navegação
   📄 README_MIGRACAO_GCP.md (8.4 KB)
   → Sumário de todos os documentos
   → Guia de leitura por perfil

═══════════════════════════════════════════════════════
  RESUMO RÁPIDO
═══════════════════════════════════════════════════════

Situação Atual:
- Render.com (free tier)
- Hibernação após 15min
- Recursos limitados

Solução Proposta:
- Google Cloud Platform
- Cloud Run + Cloud SQL
- Escalabilidade automática

Investimento:
- $80-145/mês
- $300 crédito grátis (90 dias)

Timeline:
- 7-10 dias úteis

═══════════════════════════════════════════════════════
  PRÓXIMOS PASSOS
═══════════════════════════════════════════════════════

1. Leia RESUMO_EXECUTIVO_MIGRACAO.md
2. Aprove o plano de migração
3. Crie conta Google Cloud
4. Siga GOOGLE_CLOUD_MIGRATION_GUIDE.md

═══════════════════════════════════════════════════════

Data: 14/11/2025
Email: dttools.app@gmail.com

🚀 Transformando o DTTools em uma plataforma de classe mundial!
EOF

# Criar arquivo ZIP
echo "📦 Criando arquivo ZIP..."
zip -r "${DEST_DIR}.zip" "$DEST_DIR" > /dev/null 2>&1

# Estatísticas
echo ""
echo "✅ Documentação preparada com sucesso!"
echo ""
echo "📊 ESTATÍSTICAS:"
echo "   • 4 documentos Markdown"
echo "   • Total: 85.8 KB de documentação"
echo "   • ZIP: $(du -h "${DEST_DIR}.zip" | cut -f1)"
echo ""
echo "📁 LOCALIZAÇÕES:"
echo "   • Pasta: ./${DEST_DIR}/"
echo "   • ZIP:   ./${DEST_DIR}.zip"
echo ""
echo "💡 COMO BAIXAR:"
echo "   1. No Cursor: Botão direito no arquivo → Download"
echo "   2. Ou copie a pasta/ZIP para seu computador"
echo ""
echo "📚 COMECE POR:"
echo "   → RESUMO_EXECUTIVO_MIGRACAO.md (15 min de leitura)"
echo ""
