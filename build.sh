#!/bin/bash
set -e

echo "🔨 Building DTTools..."

# Run the build
npm run build

# Copy frontend assets to dist/public
echo "📦 Copying frontend assets to dist/public..."
rm -rf dist/public
mkdir -p dist/public
cp -r client/dist/* dist/public/

echo "✅ Build complete! Frontend assets copied to dist/public"
ls -la dist/public
