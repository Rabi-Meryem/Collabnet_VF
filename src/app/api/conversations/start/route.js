import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

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
    console.error('Erreur POST /api/conversations/start:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 