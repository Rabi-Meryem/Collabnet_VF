import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { currentUserId, currentUserType, targetUserId, targetUserType } = await req.json();
    
    if (!currentUserId || !currentUserType || !targetUserId || !targetUserType) {
      return NextResponse.json({ error: 'Tous les paramètres sont requis' }, { status: 400 });
    }

    // Déterminer les IDs pour chercheur et entreprise
    let chercheurId, entrepriseId;
    
    if (currentUserType === 'chercheur') {
      chercheurId = currentUserId;
      entrepriseId = targetUserType === 'entreprise' ? targetUserId : null;
    } else {
      entrepriseId = currentUserId;
      chercheurId = targetUserType === 'chercheur' ? targetUserId : null;
    }

    // Vérifier si une conversation existe déjà
    let existingConversation;
    
    if (chercheurId && entrepriseId) {
      existingConversation = await prisma.conversation.findFirst({
        where: {
          chercheurId: chercheurId,
          entrepriseId: entrepriseId
        }
      });
    } else if (chercheurId) {
      existingConversation = await prisma.conversation.findFirst({
        where: {
          chercheurId: chercheurId,
          entrepriseId: null
        }
      });
    } else if (entrepriseId) {
      existingConversation = await prisma.conversation.findFirst({
        where: {
          chercheurId: null,
          entrepriseId: entrepriseId
        }
      });
    }

    if (existingConversation) {
      return NextResponse.json({ 
        conversationId: existingConversation.id
      });
    }

    // Créer une nouvelle conversation
    const conversationData = {};
    if (chercheurId) conversationData.chercheurId = chercheurId;
    if (entrepriseId) conversationData.entrepriseId = entrepriseId;
    
    const conversation = await prisma.conversation.create({
      data: conversationData
    });

    return NextResponse.json({ 
      conversationId: conversation.id
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création/redirection de conversation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 