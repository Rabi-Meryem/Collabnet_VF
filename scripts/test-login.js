import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('🧪 Test de l\'API de login...');
    
    const response = await fetch('http://localhost:3000/api/login/chercheur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@test.com',
        password: 'test123'
      })
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const data = await response.text();
    console.log('📡 Réponse:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testLogin(); 

async function testLogin() {
  try {
    console.log('🧪 Test de l\'API de login...');
    
    const response = await fetch('http://localhost:3000/api/login/chercheur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@test.com',
        password: 'test123'
      })
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const data = await response.text();
    console.log('📡 Réponse:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testLogin(); 