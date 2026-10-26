import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUsers() {
  try {
    console.log('🔧 Vérification et correction des utilisateurs...\n');

    // Vérifier les chercheurs
    const chercheurs = await prisma.chercheur.findMany();
    console.log('👨‍🔬 CHERCHEURS (total:', chercheurs.length, '):');
    chercheurs.forEach(c => {
      console.log(`  ID: ${c.id}, Email: ${c.email}, Nom: ${c.fullName}`);
    });

    // Vérifier les entreprises
    const entreprises = await prisma.entreprise.findMany();
    console.log('\n🏢 ENTREPRISES (total:', entreprises.length, '):');
    entreprises.forEach(e => {
      console.log(`  ID: ${e.id}, Email: ${e.email}, Nom: ${e.companyName}`);
    });

    // Vérifier si l'entreprise ecoware9@gmail.Com existe
    const entreprise = await prisma.entreprise.findUnique({
      where: { email: 'ecoware9@gmail.Com' }
    });

    if (!entreprise) {
      console.log('\n❌ L\'entreprise ecoware9@gmail.Com n\'existe pas!');
      console.log('🔧 Création de l\'entreprise...');
      
      const newEntreprise = await prisma.entreprise.create({
        data: {
          email: 'ecoware9@gmail.Com',
          password: 'hashedpassword', // Vous devrez mettre le vrai mot de passe hashé
          companyName: 'EcoWare',
          position: 'CEO',
          phoneNumber: '+1234567890',
          department: 'Management',
          location: 'Casablanca',
          description: 'Entreprise de développement durable'
        }
      });
      
      console.log('✅ Entreprise créée:', newEntreprise);
    } else {
      console.log('\n✅ L\'entreprise ecoware9@gmail.Com existe déjà (ID:', entreprise.id, ')');
    }

    // Vérifier les conversations
    const conversations = await prisma.conversation.findMany({
      include: {
        chercheur: { select: { id: true, email: true, fullName: true } },
        entreprise: { select: { id: true, email: true, companyName: true } }
      }
    });
    
    console.log('\n💬 CONVERSATIONS (total:', conversations.length, '):');
    conversations.forEach(conv => {
      console.log(`  ID: ${conv.id}`);
      console.log(`    Chercheur: ${conv.chercheur?.email || 'N/A'} (ID: ${conv.chercheurId})`);
      console.log(`    Entreprise: ${conv.entreprise?.email || 'N/A'} (ID: ${conv.entrepriseId})`);
    });

    // Nettoyer les messages avec des IDs identiques
    const messages = await prisma.message.findMany({
      where: {
        senderId: 1,
        receiverId: 1
      }
    });
    
    if (messages.length > 0) {
      console.log('\n🧹 Nettoyage des messages avec IDs identiques...');
      console.log(`  Messages à supprimer: ${messages.length}`);
      
      for (const message of messages) {
        await prisma.message.delete({
          where: { id: message.id }
        });
        console.log(`  ✅ Message ${message.id} supprimé`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsers(); 