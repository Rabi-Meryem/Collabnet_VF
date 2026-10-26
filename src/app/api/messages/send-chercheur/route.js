import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { conversationId, senderId, senderType, content, receiverId, receiverType } = await request.json();
    
    console.log('🔍 API send-chercheur: Envoi message:', {
      conversationId,
      senderId,
      senderType,
      content,
      receiverId,
      receiverType
    });

    // Vérifier que les paramètres requis sont présents
    if (!senderId || !content || !receiverId) {
      console.error('❌ API send-chercheur: Paramètres manquants');
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Vérifier que l'expéditeur est bien un chercheur
    if (senderType !== 'chercheur') {
      console.error('❌ API send-chercheur: Type d\'expéditeur invalide');
      return NextResponse.json(
        { error: 'Type d\'expéditeur invalide' },
        { status: 400 }
      );
    }

    // Créer ou récupérer la conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            chercheurId: parseInt(senderId),
            entrepriseId: parseInt(receiverId)
          },
          {
            chercheurId: parseInt(receiverId),
            entrepriseId: parseInt(senderId)
          }
        ]
      }
    });

    // Si la conversation n'existe pas, la créer
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          chercheurId: parseInt(senderId),
          entrepriseId: parseInt(receiverId)
        }
      });
    }

    // Créer le message avec conversationId
    const newMessage = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        senderType: senderType,
        receiverType: receiverType || 'entreprise', // Par défaut, un chercheur contacte une entreprise
        content: content,
        conversationId: conversation.id,
        createdAt: new Date()
      }
    });

    console.log('✅ API send-chercheur: Message envoyé avec succès:', newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage,
      id: newMessage.id
    });

  } catch (error) {
    console.error('❌ API send-chercheur: Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
} 