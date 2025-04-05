// Script to fix line endings across the entire codebase
const { execSync } = require('child_process');

console.log('Fixing line endings in all source files...');

try {
  // Fix typescript files
  execSync('npx prettier --write "src/**/*.ts" --end-of-line lf', {
    stdio: 'inherit',
  });
  console.log('✅ Fixed TypeScript files');

  // Fix JSON, YAML, and MD files
  execSync('npx prettier --write "**/*.{json,yaml,yml,md}" --end-of-line lf', {
    stdio: 'inherit',
  });
  console.log('✅ Fixed JSON, YAML, and MD files');

  // Fix JavaScript files
  execSync('npx prettier --write "**/*.js" --end-of-line lf', {
    stdio: 'inherit',
  });
  console.log('✅ Fixed JavaScript files');

  // Normalize Git line endings
  execSync('git add --renormalize .', { stdio: 'inherit' });
  console.log('✅ Renormalized Git line endings');

  console.log('✅ All line endings have been fixed to LF!');
} catch (error) {
  console.error('❌ Error fixing line endings:', error.message);
  process.exit(1);
}
