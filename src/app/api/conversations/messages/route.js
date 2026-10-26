import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId requis" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId)
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erreur GET /api/conversations/messages:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { conversationId, senderId, senderType, content } = await req.json();

    if (!conversationId || !senderId || !senderType || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Créer le message avec le nouveau schéma
    const messageData = {
      conversationId: parseInt(conversationId),
      content: content
    };

    // Ajouter l'ID du sender selon le type
    if (senderType === 'chercheur') {
      messageData.chercheurId = parseInt(senderId);
    } else if (senderType === 'entreprise') {
      messageData.entrepriseId = parseInt(senderId);
    }

    const newMessage = await prisma.message.create({
      data: messageData
    });

    // Mettre à jour la conversation avec la date de dernier message
    await prisma.conversation.update({
      where: { id: parseInt(conversationId) },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/conversations/messages:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 