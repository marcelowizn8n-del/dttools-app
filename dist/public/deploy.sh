#!/bin/bash
echo "🚀 DTTools Deploy Script v3.3.0"
echo "================================"
echo "✅ Arquivos encontrados:"
ls -la | head -10
echo ""
echo "📦 Arquivo ZIP já criado:"
ls -lh dttools-deploy.zip
echo ""
echo "🌐 OPÇÕES DE DEPLOY:"
echo "1. Vercel: https://vercel.com/new (arraste o ZIP)"
echo "2. Netlify: https://app.netlify.com/drop (arraste o ZIP)"
echo "3. Surge: npx surge . dttools-app.surge.sh"
echo ""
echo "🔐 CREDENCIAIS DE TESTE:"
echo "Email: dttools.app@gmail.com"
echo "Senha: Gulex0519!@"
echo ""
echo "✅ Deploy preparado com sucesso!"
