import { Client } from 'pg';

async function createDatabase() {
  // Connexion à PostgreSQL sans spécifier de base de données
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres', // Changez selon votre configuration
    database: 'postgres' // Base par défaut
  });

  try {
    console.log('🔧 Création de la base de données...');
    
    await client.connect();
    console.log('✅ Connexion à PostgreSQL réussie');
    
    // Vérifier si la base existe déjà
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'collabnet_db'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('ℹ️ La base de données collabnet_db existe déjà');
    } else {
      // Créer la base de données
      await client.query('CREATE DATABASE collabnet_db');
      console.log('✅ Base de données collabnet_db créée avec succès');
    }
    
    console.log('\n🎉 Base de données prête !');
    console.log('Vous pouvez maintenant :');
    console.log('1. Exécuter "npm run db:test" pour tester la connexion');
    console.log('2. Exécuter "npm run db:init" pour initialiser les tables');
    console.log('3. Exécuter "npm run db:seed" pour ajouter des données de test');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base de données:', error.message);
    console.log('\n🔧 Solutions possibles :');
    console.log('1. Vérifiez que PostgreSQL est démarré');
    console.log('2. Vérifiez le mot de passe de l\'utilisateur postgres');
    console.log('3. Créez manuellement la base de données dans pgAdmin');
    console.log('4. Consultez POSTGRESQL_SETUP.md pour la configuration');
  } finally {
    await client.end();
  }
}

createDatabase(); 