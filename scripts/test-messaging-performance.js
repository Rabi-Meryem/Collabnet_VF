const fetch = require('node-fetch');

async function testMessagingPerformance() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Test des performances de messagerie...\n');
  
  // Test 1: API conversations entreprise
  console.log('1️⃣ Test API conversations entreprise...');
  const startTime1 = Date.now();
  try {
    const response1 = await fetch(`${baseUrl}/api/conversations/entreprise/1001`);
    const data1 = await response1.json();
    const endTime1 = Date.now();
    console.log(`✅ Temps de réponse: ${endTime1 - startTime1}ms`);
    console.log(`📊 Conversations trouvées: ${data1.length}`);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  // Test 2: API conversations chercheur
  console.log('\n2️⃣ Test API conversations chercheur...');
  const startTime2 = Date.now();
  try {
    const response2 = await fetch(`${baseUrl}/api/conversations/chercheur/5`);
    const data2 = await response2.json();
    const endTime2 = Date.now();
    console.log(`✅ Temps de réponse: ${endTime2 - startTime2}ms`);
    console.log(`📊 Conversations trouvées: ${data2.length}`);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  // Test 3: API messages conversation
  console.log('\n3️⃣ Test API messages conversation...');
  const startTime3 = Date.now();
  try {
    const response3 = await fetch(`${baseUrl}/api/messages/conversation?userId1=1001&userId2=5`);
    const data3 = await response3.json();
    const endTime3 = Date.now();
    console.log(`✅ Temps de réponse: ${endTime3 - startTime3}ms`);
    console.log(`📊 Messages trouvés: ${data3.length}`);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  console.log('\n🎯 Tests terminés !');
}

testMessagingPerformance().catch(console.error); 