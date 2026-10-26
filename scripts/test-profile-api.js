import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProfileAPI() {
  try {
    console.log('🔍 Test des API de profil...');
    
    // Test avec l'email de l'entreprise qui pose problème
    const emailEntreprise = 'DataNova@gamil.com';
    console.log(`\n📊 Test profil entreprise avec email: ${emailEntreprise}`);
    
    const entreprise = await prisma.entreprise.findUnique({
      where: { email: emailEntreprise }
    });
    
    if (entreprise) {
      console.log('✅ Entreprise trouvée :', {
        id: entreprise.id,
        companyName: entreprise.companyName,
        email: entreprise.email,
        position: entreprise.position,
        description: entreprise.description
      });
    } else {
      console.log('❌ Entreprise non trouvée');
    }
    
    // Test avec l'email du chercheur
    const emailChercheur = 'mouniahamdaoui@gmail.com';
    console.log(`\n📊 Test profil chercheur avec email: ${emailChercheur}`);
    
    const chercheur = await prisma.chercheur.findUnique({
      where: { email: emailChercheur }
    });
    
    if (chercheur) {
      console.log('✅ Chercheur trouvé :', {
        id: chercheur.id,
        fullName: chercheur.fullName,
        email: chercheur.email,
        position: chercheur.position,
        department: chercheur.department,
        description: chercheur.description
      });
    } else {
      console.log('❌ Chercheur non trouvé');
    }
    
    console.log('\n✅ Test des API terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileAPI(); 