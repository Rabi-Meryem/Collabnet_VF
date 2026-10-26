import fetch from 'node-fetch';

async function testHTTPAPI() {
  try {
    console.log('🔍 Test des API HTTP...');
    
    const baseURL = 'http://localhost:3000';
    
    // Test API profil entreprise
    console.log('\n📊 Test API profil entreprise...');
    const emailEntreprise = 'DataNova@gamil.com';
    const responseEntreprise = await fetch(`${baseURL}/api/profile/entreprise?email=${encodeURIComponent(emailEntreprise)}`);
    
    console.log('Status:', responseEntreprise.status);
    console.log('Headers:', responseEntreprise.headers);
    
    if (responseEntreprise.ok) {
      const dataEntreprise = await responseEntreprise.json();
      console.log('✅ Données entreprise:', dataEntreprise);
    } else {
      const errorEntreprise = await responseEntreprise.text();
      console.log('❌ Erreur entreprise:', errorEntreprise);
    }
    
    // Test API profil chercheur
    console.log('\n📊 Test API profil chercheur...');
    const emailChercheur = 'mouniahamdaoui@gmail.com';
    const responseChercheur = await fetch(`${baseURL}/api/profile/chercheur?email=${encodeURIComponent(emailChercheur)}`);
    
    console.log('Status:', responseChercheur.status);
    console.log('Headers:', responseChercheur.headers);
    
    if (responseChercheur.ok) {
      const dataChercheur = await responseChercheur.json();
      console.log('✅ Données chercheur:', dataChercheur);
    } else {
      const errorChercheur = await responseChercheur.text();
      console.log('❌ Erreur chercheur:', errorChercheur);
    }
    
    console.log('\n✅ Test HTTP terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test HTTP :', error);
  }
}

testHTTPAPI(); 