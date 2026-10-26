import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { currentUserId, targetUserId } = resolvedParams;
    
    console.log('🔍 API messages entreprise: Récupération messages:', {
      currentUserId,
      targetUserId
    });

    if (!currentUserId || !targetUserId) {
      return NextResponse.json(
        { error: 'currentUserId et targetUserId sont requis' },
        { status: 400 }
      );
    }

    // Récupérer la conversation entre ces deux utilisateurs
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            chercheurId: parseInt(currentUserId),
            entrepriseId: parseInt(targetUserId)
          },
          {
            chercheurId: parseInt(targetUserId),
            entrepriseId: parseInt(currentUserId)
          }
        ]
      }
    });

    if (!conversation) {
      console.log('✅ API messages entreprise: Aucune conversation trouvée');
      return NextResponse.json([]);
    }

    // Récupérer tous les messages de cette conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log('✅ API messages entreprise: Messages récupérés:', messages.length);

    return NextResponse.json(messages);

  } catch (error) {
    console.error('❌ API messages entreprise: Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
} 