import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 Building DTTools for production...\n');

try {
  // Step 1: Build frontend with Vite
  console.log('📦 Step 1: Building frontend with Vite...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Step 2: Verify frontend build
  if (!fs.existsSync('client/dist/index.html')) {
    throw new Error('Frontend build failed - client/dist/index.html not found');
  }
  console.log('✅ Frontend built successfully\n');
  
  // Step 3: Copy frontend to dist/public
  console.log('📋 Step 2: Copying frontend to dist/public...');
  if (fs.existsSync('dist/public')) {
    fs.rmSync('dist/public', { recursive: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.cpSync('client/dist', 'dist/public', { recursive: true });
  
  // Step 4: Verify copy
  if (!fs.existsSync('dist/public/index.html')) {
    throw new Error('Copy failed - dist/public/index.html not found');
  }
  console.log('✅ Frontend copied to dist/public\n');
  
  // Step 5: Build backend
  console.log('⚙️  Step 3: Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Step 6: Verify backend build
  if (!fs.existsSync('dist/index.js')) {
    throw new Error('Backend build failed - dist/index.js not found');
  }
  
  console.log('\n✅ Production build complete!');
  console.log('📂 Frontend: dist/public/index.html');
  console.log('📂 Backend: dist/index.js');
  
  const frontendStats = fs.statSync('dist/public/index.html');
  const backendStats = fs.statSync('dist/index.js');
  console.log(`   Frontend size: ${(frontendStats.size / 1024).toFixed(1)}K`);
  console.log(`   Backend size: ${(backendStats.size / 1024).toFixed(1)}K`);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
