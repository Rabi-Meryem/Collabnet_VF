import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType');
    
    if (!userId || !userType) {
      return NextResponse.json({ error: 'userId et userType requis' }, { status: 400 });
    }
    
    let conversations;
    
    if (userType === 'chercheur') {
      conversations = await prisma.conversation.findMany({
        where: { chercheurId: parseInt(userId) },
        include: {
          entreprise: {
            select: {
              id: true,
              companyName: true,
              email: true
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else if (userType === 'entreprise') {
      conversations = await prisma.conversation.findMany({
        where: { entrepriseId: parseInt(userId) },
        include: {
          chercheur: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      return NextResponse.json({ error: 'Type d\'utilisateur invalide' }, { status: 400 });
    }
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { chercheurId, entrepriseId } = await req.json();

    if (!chercheurId || !entrepriseId) {
      return NextResponse.json({ error: "chercheurId et entrepriseId requis" }, { status: 400 });
    }

    // Vérifier si la conversation existe déjà
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        chercheurId: parseInt(chercheurId),
        entrepriseId: parseInt(entrepriseId)
      }
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Créer une nouvelle conversation
    const newConversation = await prisma.conversation.create({
      data: {
        chercheurId: parseInt(chercheurId),
        entrepriseId: parseInt(entrepriseId)
      }
    });

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/conversations:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 