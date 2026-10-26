import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { currentUserId, targetUserId, currentUserType } = await request.json();
    
    console.log('🔍 API find-or-create-entreprise: Recherche conversation:', {
      currentUserId,
      targetUserId,
      currentUserType
    });

    if (!currentUserId || !targetUserId) {
      return NextResponse.json(
        { error: 'currentUserId et targetUserId sont requis' },
        { status: 400 }
      );
    }

    // Déterminer le type de l'utilisateur cible
    let targetUserType = 'chercheur'; // Par défaut, on suppose que l'entreprise contacte un chercheur
    
    // Vérifier si l'utilisateur cible est un chercheur ou une entreprise
    const chercheur = await prisma.chercheur.findUnique({
      where: { id: parseInt(targetUserId) }
    });
    
    if (chercheur) {
      targetUserType = 'chercheur';
    } else {
      const entreprise = await prisma.entreprise.findUnique({
        where: { id: parseInt(targetUserId) }
      });
      if (entreprise) {
        targetUserType = 'entreprise';
      }
    }

    // Chercher une conversation existante
    let conversation = await prisma.message.groupBy({
      by: ['senderId', 'receiverId', 'senderType', 'receiverType'],
      where: {
        OR: [
          {
            senderId: parseInt(currentUserId),
            receiverId: parseInt(targetUserId),
            senderType: currentUserType,
            receiverType: targetUserType
          },
          {
            senderId: parseInt(targetUserId),
            receiverId: parseInt(currentUserId),
            senderType: targetUserType,
            receiverType: currentUserType
          }
        ]
      },
      _count: {
        id: true
      }
    });

    if (conversation.length > 0) {
      // Conversation existante trouvée
      console.log('✅ API find-or-create-entreprise: Conversation existante trouvée');
      return NextResponse.json({
        id: conversation[0].senderId, // Utiliser l'ID comme identifiant de conversation
        exists: true
      });
    } else {
      // Créer une nouvelle conversation en envoyant un message initial
      console.log('🔍 API find-or-create-entreprise: Création d\'une nouvelle conversation');
      
      const newMessage = await prisma.message.create({
        data: {
          senderId: parseInt(currentUserId),
          receiverId: parseInt(targetUserId),
          senderType: currentUserType,
          receiverType: targetUserType,
          content: 'Début de la conversation',
          createdAt: new Date()
        }
      });

      console.log('✅ API find-or-create-entreprise: Nouvelle conversation créée:', newMessage.id);
      
      return NextResponse.json({
        id: newMessage.id,
        exists: false,
        message: newMessage
      });
    }

  } catch (error) {
    console.error('❌ API find-or-create-entreprise: Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création/recherche de conversation' },
      { status: 500 }
    );
  }
} 