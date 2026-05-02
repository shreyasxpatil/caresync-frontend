const fs = require('fs');
const path = require('path');

function checkCasing(filePath, importPath) {
  const resolvedPath = path.resolve(path.dirname(filePath), importPath);
  let ext = '';
  if (!fs.existsSync(resolvedPath)) {
    // try extensions
    if (fs.existsSync(resolvedPath + '.jsx')) ext = '.jsx';
    else if (fs.existsSync(resolvedPath + '.js')) ext = '.js';
    else if (fs.existsSync(resolvedPath + '.css')) ext = '.css';
    else if (fs.existsSync(path.join(resolvedPath, 'index.jsx'))) ext = '/index.jsx';
    else if (fs.existsSync(path.join(resolvedPath, 'index.js'))) ext = '/index.js';
    else return; // file doesn't exist at all, not a casing issue or it's a generic module
  }
  
  const fullPathToCheck = resolvedPath + ext;
  
  try {
    const actualCasePath = fs.realpathSync.native(fullPathToCheck);
    if (actualCasePath !== fullPathToCheck && actualCasePath.toLowerCase() === fullPathToCheck.toLowerCase()) {
      console.log('Mismatch in: ' + filePath);
      console.log('Import statement: ' + importPath);
      console.log('Actual file on disk: ' + actualCasePath);
      console.log('-----------------------------------');
    }
  } catch (e) {}
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"](\.[^'"]+)['"]/g;
      const lazyRegex = /import\(['"](\.[^'"]+)['"]\)/g;
      
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        checkCasing(fullPath, match[1]);
      }
      while ((match = lazyRegex.exec(content)) !== null) {
        checkCasing(fullPath, match[1]);
      }
    }
  }
}

console.log('Starting casing check...');
walk(path.join(process.cwd(), 'src'));
console.log('Done.');
