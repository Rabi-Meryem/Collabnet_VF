import fs from 'fs';
import path from 'path';

function fixImports() {
  console.log('🔧 Correction des chemins d\'import...');
  
  const apiDir = 'src/app/api';
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file === 'route.js') {
        fixFileImports(filePath);
      }
    });
  }
  
  function fixFileImports(filePath) {
    console.log(`📝 Traitement de: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remplacer les anciens chemins d'import
    const oldPatterns = [
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib\/prisma['"]/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/lib\/prisma['"]/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/lib\/prisma['"]/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/lib\/prisma['"]/g
    ];
    
    const newImport = 'import { prisma } from \'../../../../../src/lib/prisma\';';
    
    oldPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, newImport);
        modified = true;
        console.log(`  ✅ Corrigé: ${filePath}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  processDirectory(apiDir);
  console.log('✅ Correction terminée !');
}

fixImports(); 