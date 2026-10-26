import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSignup() {
  try {
    console.log('🔍 Test d\'inscription et vérification...');
    
    const baseURL = 'http://localhost:3000';
    
    // Test inscription chercheur
    console.log('\n📊 Test inscription chercheur...');
    const chercheurData = {
      fullName: 'Test Chercheur',
      email: 'test.chercheur@example.com',
      password: 'password123',
      position: 'Chercheur Test',
      department: 'Informatique',
      phoneNumber: '+33123456789',
      description: 'Description de test pour le chercheur'
    };
    
    const responseChercheur = await fetch(`${baseURL}/api/signup/chercheur`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chercheurData)
    });
    
    console.log('Status inscription chercheur:', responseChercheur.status);
    
    if (responseChercheur.ok) {
      const newChercheur = await responseChercheur.json();
      console.log('✅ Chercheur inscrit:', newChercheur);
      
      // Vérifier dans la base de données
      const chercheurInDB = await prisma.chercheur.findUnique({
        where: { email: chercheurData.email }
      });
      
      if (chercheurInDB) {
        console.log('✅ Chercheur trouvé dans la base:', {
          id: chercheurInDB.id,
          fullName: chercheurInDB.fullName,
          email: chercheurInDB.email,
          position: chercheurInDB.position
        });
      } else {
        console.log('❌ Chercheur non trouvé dans la base');
      }
    } else {
      const errorChercheur = await responseChercheur.text();
      console.log('❌ Erreur inscription chercheur:', errorChercheur);
    }
    
    // Test inscription entreprise
    console.log('\n📊 Test inscription entreprise...');
    const entrepriseData = {
      companyName: 'Test Entreprise',
      email: 'test.entreprise@example.com',
      password: 'password123',
      position: 'Directeur Test',
      description: 'Description de test pour l\'entreprise'
    };
    
    const responseEntreprise = await fetch(`${baseURL}/api/signup/entreprise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entrepriseData)
    });
    
    console.log('Status inscription entreprise:', responseEntreprise.status);
    
    if (responseEntreprise.ok) {
      const newEntreprise = await responseEntreprise.json();
      console.log('✅ Entreprise inscrite:', newEntreprise);
      
      // Vérifier dans la base de données
      const entrepriseInDB = await prisma.entreprise.findUnique({
        where: { email: entrepriseData.email }
      });
      
      if (entrepriseInDB) {
        console.log('✅ Entreprise trouvée dans la base:', {
          id: entrepriseInDB.id,
          companyName: entrepriseInDB.companyName,
          email: entrepriseInDB.email,
          position: entrepriseInDB.position
        });
      } else {
        console.log('❌ Entreprise non trouvée dans la base');
      }
    } else {
      const errorEntreprise = await responseEntreprise.text();
      console.log('❌ Erreur inscription entreprise:', errorEntreprise);
    }
    
    console.log('\n✅ Test d\'inscription terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'inscription :', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup(); 