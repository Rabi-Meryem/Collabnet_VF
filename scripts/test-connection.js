import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à PostgreSQL...');
    
    // Tester la connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie !');
    
    // Tester une requête simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Requête de test réussie:', result);
    
    console.log('\n📋 Informations de connexion :');
    console.log('- Base de données : collabnet_db');
    console.log('- Hôte : localhost');
    console.log('- Port : 5432');
    console.log('- Utilisateur : postgres');
    
    console.log('\n🎉 Votre base de données est prête !');
    console.log('Vous pouvez maintenant exécuter :');
    console.log('- npm run db:init (pour initialiser les tables)');
    console.log('- npm run db:seed (pour ajouter des données de test)');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n🔧 Solutions possibles :');
    console.log('1. Vérifiez que PostgreSQL est démarré');
    console.log('2. Vérifiez le mot de passe dans le fichier .env');
    console.log('3. Vérifiez que la base de données collabnet_db existe');
    console.log('4. Consultez POSTGRESQL_SETUP.md pour la configuration');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 