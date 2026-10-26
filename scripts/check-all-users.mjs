import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllUsers() {
  try {
    console.log('🔍 Vérification complète des utilisateurs...\n');

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

    // Vérifier les messages
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n📨 DERNIERS MESSAGES (5):');
    messages.forEach(msg => {
      console.log(`  ID: ${msg.id}, Contenu: "${msg.content}"`);
      console.log(`    De: ${msg.senderId} (${msg.senderType})`);
      console.log(`    À: ${msg.receiverId} (${msg.receiverType})`);
      console.log(`    Date: ${msg.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllUsers(); 