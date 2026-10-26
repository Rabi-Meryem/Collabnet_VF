import fetch from 'node-fetch';

async function quickTest() {
  try {
    console.log('🚀 Test rapide de l\'application...');
    
    const baseURL = 'http://localhost:3000';
    
    // Test 1: Page d'accueil
    console.log('\n📊 Test 1: Page d\'accueil');
    const homeResponse = await fetch(baseURL);
    console.log('Status page d\'accueil:', homeResponse.status);
    
    // Test 2: API de profil entreprise
    console.log('\n📊 Test 2: API profil entreprise');
    const emailEntreprise = 'DataNova@gamil.com';
    const profileResponse = await fetch(`${baseURL}/api/profile/entreprise?email=${encodeURIComponent(emailEntreprise)}`);
    console.log('Status API profil:', profileResponse.status);
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Données profil:', {
        companyName: profileData.companyName,
        email: profileData.email,
        position: profileData.position
      });
    } else {
      console.log('❌ Erreur API profil');
    }
    
    // Test 3: API de profil chercheur
    console.log('\n📊 Test 3: API profil chercheur');
    const emailChercheur = 'mouniahamdaoui@gmail.com';
    const chercheurResponse = await fetch(`${baseURL}/api/profile/chercheur?email=${encodeURIComponent(emailChercheur)}`);
    console.log('Status API chercheur:', chercheurResponse.status);
    
    if (chercheurResponse.ok) {
      const chercheurData = await chercheurResponse.json();
      console.log('✅ Données chercheur:', {
        fullName: chercheurData.fullName,
        email: chercheurData.email,
        position: chercheurData.position
      });
    } else {
      console.log('❌ Erreur API chercheur');
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error.message);
  }
}

quickTest(); 