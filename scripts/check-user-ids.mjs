import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserIds() {
  try {
    console.log('🔍 Vérification des IDs utilisateurs...\n');

    // Vérifier les chercheurs
    const chercheurs = await prisma.chercheur.findMany({
      select: { id: true, email: true, fullName: true }
    });
    
    console.log('👨‍🔬 CHERCHEURS:');
    chercheurs.forEach(c => {
      console.log(`  ID: ${c.id}, Email: ${c.email}, Nom: ${c.fullName}`);
    });

    // Vérifier les entreprises
    const entreprises = await prisma.entreprise.findMany({
      select: { id: true, email: true, companyName: true }
    });
    
    console.log('\n🏢 ENTREPRISES:');
    entreprises.forEach(e => {
      console.log(`  ID: ${e.id}, Email: ${e.email}, Nom: ${e.companyName}`);
    });

    // Vérifier s'il y a des conflits d'ID
    const chercheurIds = chercheurs.map(c => c.id);
    const entrepriseIds = entreprises.map(e => e.id);
    
    const conflicts = chercheurIds.filter(id => entrepriseIds.includes(id));
    
    if (conflicts.length > 0) {
      console.log('\n❌ CONFLITS D\'ID DÉTECTÉS:');
      conflicts.forEach(id => {
        const chercheur = chercheurs.find(c => c.id === id);
        const entreprise = entreprises.find(e => e.id === id);
        console.log(`  ID ${id}:`);
        console.log(`    Chercheur: ${chercheur.email} (${chercheur.fullName})`);
        console.log(`    Entreprise: ${entreprise.email} (${entreprise.companyName})`);
      });
    } else {
      console.log('\n✅ Aucun conflit d\'ID détecté');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserIds(); 