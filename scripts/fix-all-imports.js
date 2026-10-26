import fs from 'fs';
import path from 'path';

function fixAllImports() {
  console.log('🔧 Correction de tous les imports...');
  
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
    
    // Corriger les doubles points-virgules et les chemins incorrects
    const patterns = [
      // Double point-virgule avec chemin incorrect
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];;/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];;/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];;/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/src\/lib\/prisma['"];;/g,
      
      // Chemins incorrects sans double point-virgule
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/src\/lib\/prisma['"];/g,
      /import\s+\{\s*prisma\s*\}\s+from\s+['"]\.\.\/\.\.\/src\/lib\/prisma['"];/g
    ];
    
    // Déterminer le bon chemin selon la profondeur du fichier
    const relativePath = path.relative('src/app/api', filePath);
    const depth = relativePath.split(path.sep).length - 1;
    
    let correctPath;
    if (depth === 1) {
      correctPath = '../../../lib/prisma';
    } else if (depth === 2) {
      correctPath = '../../../../../lib/prisma';
    } else if (depth === 3) {
      correctPath = '../../../../../../lib/prisma';
    } else {
      correctPath = '../../../../../lib/prisma'; // Par défaut
    }
    
    const newImport = `import { prisma } from '${correctPath}';`;
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, newImport);
        modified = true;
        console.log(`  ✅ Corrigé: ${filePath} -> ${newImport}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  processDirectory(apiDir);
  console.log('✅ Correction terminée !');
}

fixAllImports(); 