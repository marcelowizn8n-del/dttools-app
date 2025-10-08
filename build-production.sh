#!/bin/bash
set -e

echo "🔨 Building DTTools for production..."

# Step 1: Build frontend with Vite
echo "📦 Step 1: Building frontend..."
vite build

# Step 2: Copy frontend build to dist/public
echo "📋 Step 2: Copying frontend to dist/public..."
rm -rf dist/public
mkdir -p dist
cp -r client/dist dist/public

# Step 3: Build backend
echo "⚙️  Step 3: Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Production build complete!"
echo "📂 Frontend: dist/public/"
echo "📂 Backend: dist/index.js"
