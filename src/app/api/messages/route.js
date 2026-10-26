import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId requis" }, { status: 400 });
    }

    console.log('📨 Récupération des messages pour la conversation:', conversationId);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId)
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log('✅ Messages récupérés:', messages.length);
    return NextResponse.json(messages);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des messages:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, conversationId, senderId, receiverId, senderType, receiverType } = body;

    if (!content || !conversationId || !senderId || !receiverId || !senderType || !receiverType) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    console.log('📤 Création d\'un nouveau message:', { content, conversationId, senderId, receiverId });

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: parseInt(conversationId),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        senderType,
        receiverType,
        read: false
      }
    });

    console.log('✅ Message créé:', message.id);

    // Émettre l'événement via WebSocket si disponible
    // (cela sera géré par le serveur WebSocket)

    return NextResponse.json(message);

  } catch (error) {
    console.error('❌ Erreur lors de la création du message:', error);
    return NextResponse.json({ error: "Erreur lors de la création du message" }, { status: 500 });
  }
} 