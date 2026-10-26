import fetch from 'node-fetch';

async function debugTest() {
  try {
    console.log('🔍 Test de débogage détaillé...');
    
    const baseURL = 'http://localhost:3000';
    
    // Test 1: Page d'accueil
    console.log('\n📊 Test 1: Page d\'accueil');
    const homeResponse = await fetch(baseURL);
    console.log('Status page d\'accueil:', homeResponse.status);
    
    // Test 2: API de profil entreprise avec plus de détails
    console.log('\n📊 Test 2: API profil entreprise (détaillé)');
    const emailEntreprise = 'DataNova@gamil.com';
    const profileResponse = await fetch(`${baseURL}/api/profile/entreprise?email=${encodeURIComponent(emailEntreprise)}`);
    console.log('Status API profil:', profileResponse.status);
    console.log('Headers:', Object.fromEntries(profileResponse.headers.entries()));
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Données profil:', profileData);
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Erreur API profil:', errorText);
    }
    
    // Test 3: API de profil chercheur avec plus de détails
    console.log('\n📊 Test 3: API profil chercheur (détaillé)');
    const emailChercheur = 'mouniahamdaoui@gmail.com';
    const chercheurResponse = await fetch(`${baseURL}/api/profile/chercheur?email=${encodeURIComponent(emailChercheur)}`);
    console.log('Status API chercheur:', chercheurResponse.status);
    console.log('Headers:', Object.fromEntries(chercheurResponse.headers.entries()));
    
    if (chercheurResponse.ok) {
      const chercheurData = await chercheurResponse.json();
      console.log('✅ Données chercheur:', chercheurData);
    } else {
      const errorText = await chercheurResponse.text();
      console.log('❌ Erreur API chercheur:', errorText);
    }
    
    // Test 4: Test direct de la base de données
    console.log('\n📊 Test 4: Test direct de la base de données');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      const entreprise = await prisma.entreprise.findUnique({
        where: { email: emailEntreprise }
      });
      console.log('✅ Entreprise dans DB:', entreprise ? 'Trouvée' : 'Non trouvée');
      
      const chercheur = await prisma.chercheur.findUnique({
        where: { email: emailChercheur }
      });
      console.log('✅ Chercheur dans DB:', chercheur ? 'Trouvée' : 'Non trouvée');
    } catch (dbError) {
      console.log('❌ Erreur DB:', dbError.message);
    } finally {
      await prisma.$disconnect();
    }
    
    console.log('\n🎉 Test de débogage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test de débogage :', error.message);
  }
}

debugTest(); 