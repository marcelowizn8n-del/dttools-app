#!/bin/bash

# Production startup script for Replit deployment
echo "🚀 Starting DTTools in production mode..."

# Set production environment
export NODE_ENV=production

# Ensure dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist/ directory not found. Run 'npm run build' first."
  exit 1
fi

# Ensure dist/index.js exists
if [ ! -f "dist/index.js" ]; then
  echo "❌ Error: dist/index.js not found. Build may have failed."
  exit 1
fi

# Start the server
echo "✅ Starting server on port ${PORT:-5000}..."
exec node dist/index.js
