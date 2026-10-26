import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Test de la base de données...');
    
    // Test des chercheurs
    console.log('\n📊 Chercheurs dans la base :');
    const chercheurs = await prisma.chercheur.findMany();
    console.log(`Nombre de chercheurs : ${chercheurs.length}`);
    chercheurs.forEach(chercheur => {
      console.log(`- ${chercheur.fullName} (${chercheur.email}) - ${chercheur.position || 'Pas de position'}`);
    });
    
    // Test des entreprises
    console.log('\n📊 Entreprises dans la base :');
    const entreprises = await prisma.entreprise.findMany();
    console.log(`Nombre d'entreprises : ${entreprises.length}`);
    entreprises.forEach(entreprise => {
      console.log(`- ${entreprise.companyName} (${entreprise.email}) - ${entreprise.position || 'Pas de position'}`);
    });
    
    // Test des articles
    console.log('\n📊 Articles dans la base :');
    const articles = await prisma.article.findMany({
      include: { author: true }
    });
    console.log(`Nombre d'articles : ${articles.length}`);
    articles.forEach(article => {
      console.log(`- ${article.title} par ${article.author.fullName}`);
    });
    
    // Test des projets
    console.log('\n📊 Projets dans la base :');
    const projets = await prisma.project.findMany({
      include: { entreprise: true }
    });
    console.log(`Nombre de projets : ${projets.length}`);
    projets.forEach(projet => {
      console.log(`- ${projet.title} par ${projet.entreprise.companyName}`);
    });
    
    console.log('\n✅ Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 