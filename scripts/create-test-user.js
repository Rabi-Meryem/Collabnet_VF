import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🧪 Création d\'un utilisateur de test...');
    
    // Créer un chercheur de test
    const chercheur = await prisma.chercheur.create({
      data: {
        fullName: 'Test Chercheur',
        email: 'test@test.com',
        password: 'test123',
        position: 'Chercheur',
        department: 'Informatique',
        phoneNumber: '0123456789',
        description: 'Chercheur de test'
      }
    });
    
    console.log('✅ Chercheur créé:', chercheur);
    
    // Créer une entreprise de test
    const entreprise = await prisma.entreprise.create({
      data: {
        companyName: 'Test Entreprise',
        email: 'entreprise@test.com',
        password: 'test123',
        position: 'Manager',
        department: 'R&D',
        phoneNumber: '0987654321',
        description: 'Entreprise de test'
      }
    });
    
    console.log('✅ Entreprise créée:', entreprise);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🧪 Création d\'un utilisateur de test...');
    
    // Créer un chercheur de test
    const chercheur = await prisma.chercheur.create({
      data: {
        fullName: 'Test Chercheur',
        email: 'test@test.com',
        password: 'test123',
        position: 'Chercheur',
        department: 'Informatique',
        phoneNumber: '0123456789',
        description: 'Chercheur de test'
      }
    });
    
    console.log('✅ Chercheur créé:', chercheur);
    
    // Créer une entreprise de test
    const entreprise = await prisma.entreprise.create({
      data: {
        companyName: 'Test Entreprise',
        email: 'entreprise@test.com',
        password: 'test123',
        position: 'Manager',
        department: 'R&D',
        phoneNumber: '0987654321',
        description: 'Entreprise de test'
      }
    });
    
    console.log('✅ Entreprise créée:', entreprise);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 