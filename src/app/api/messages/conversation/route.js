import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let userId1 = searchParams.get('userId1');
    let userId2 = searchParams.get('userId2');

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: "userId1 et userId2 requis" }, { status: 400 });
    }

    console.log('📨 Récupération des messages pour la conversation:', { userId1, userId2 });

    // Déterminer les types d'utilisateurs de manière optimisée
    const [user1Chercheur, user1Entreprise, user2Chercheur, user2Entreprise] = await Promise.all([
      prisma.chercheur.findUnique({ where: { id: parseInt(userId1) } }),
      prisma.entreprise.findUnique({ where: { id: parseInt(userId1) } }),
      prisma.chercheur.findUnique({ where: { id: parseInt(userId2) } }),
      prisma.entreprise.findUnique({ where: { id: parseInt(userId2) } })
    ]);

    const user1Type = user1Chercheur ? 'chercheur' : user1Entreprise ? 'entreprise' : null;
    const user2Type = user2Chercheur ? 'chercheur' : user2Entreprise ? 'entreprise' : null;

    if (!user1Type || !user2Type) {
      return NextResponse.json({ error: "Types d'utilisateurs non trouvés" }, { status: 400 });
    }

    // Déterminer les IDs pour la conversation - LOGIQUE SIMPLIFIÉE
    let chercheurId, entrepriseId;
    
    // Toujours utiliser le plus petit ID comme chercheurId et le plus grand comme entrepriseId
    const id1 = parseInt(userId1);
    const id2 = parseInt(userId2);
    
    if (id1 <= id2) {
      chercheurId = id1;
      entrepriseId = id2;
    } else {
      chercheurId = id2;
      entrepriseId = id1;
    }
    
    console.log('🔍 IDs simplifiés:', { chercheurId, entrepriseId, id1, id2 });

    // Trouver la conversation
    console.log('🔍 Recherche de conversation avec:', { chercheurId, entrepriseId });
    
    const conversation = await prisma.conversation.findFirst({
      where: {
        chercheurId: chercheurId,
        entrepriseId: entrepriseId
      }
    });

    if (!conversation) {
      console.log('❌ Aucune conversation trouvée avec ces IDs');
      return NextResponse.json([]);
    }
    
    console.log('✅ Conversation trouvée:', conversation.id);

    // Récupérer les messages de la conversation de manière optimisée
    console.log('🔍 Recherche de messages pour conversation:', conversation.id);
    
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        senderType: true,
        receiverType: true,
        conversationId: true,
        createdAt: true
      }
    });

    console.log('✅ Messages récupérés:', messages.length);
    
    return NextResponse.json(messages);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des messages:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 });
  }
} 