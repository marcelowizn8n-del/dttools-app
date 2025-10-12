import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 DTTools Production Diagnostics\n');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('');

const checkPath = (filepath) => {
  const exists = fs.existsSync(filepath);
  console.log(`${exists ? '✅' : '❌'} ${filepath}`);
  if (exists && fs.statSync(filepath).isDirectory()) {
    try {
      const files = fs.readdirSync(filepath);
      console.log(`   Contents (${files.length} items):`, files.slice(0, 5).join(', '));
    } catch (e) {
      console.log(`   Error reading: ${e.message}`);
    }
  }
};

console.log('Checking paths:');
checkPath('dist');
checkPath('dist/index.js');
checkPath('dist/public');
checkPath('dist/public/index.html');
checkPath('dist/public/assets');
checkPath('client/dist');
checkPath('client/dist/index.html');

console.log('\nEnvironment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
