#!/bin/bash
set -e

echo "🔨 Building DTTools for production..."

# Step 1: Build frontend with Vite (output to client/dist)
echo "📦 Step 1: Building frontend with Vite..."
vite build

# Step 2: Verify frontend build
if [ ! -f "client/dist/index.html" ]; then
  echo "❌ ERROR: Frontend build failed - client/dist/index.html not found"
  exit 1
fi
echo "✅ Frontend built successfully"

# Step 3: Copy frontend build to dist/public
echo "📋 Step 2: Copying frontend to dist/public..."
rm -rf dist/public
mkdir -p dist
cp -r client/dist dist/public

# Step 4: Verify copy
if [ ! -f "dist/public/index.html" ]; then
  echo "❌ ERROR: Copy failed - dist/public/index.html not found"
  exit 1
fi
echo "✅ Frontend copied to dist/public"

# Step 5: Build backend
echo "⚙️  Step 3: Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Step 6: Verify backend build
if [ ! -f "dist/index.js" ]; then
  echo "❌ ERROR: Backend build failed - dist/index.js not found"
  exit 1
fi

echo ""
echo "✅ Production build complete!"
echo "📂 Frontend: dist/public/index.html"
echo "📂 Backend: dist/index.js"
ls -lh dist/public/index.html dist/index.js
