import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { senderId, receiverId } = body;

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "senderId et receiverId requis" }, { status: 400 });
    }

    console.log('📖 Marquage des messages comme lus:', { senderId, receiverId });

    // Marquer tous les messages non lus comme lus
    const updatedMessages = await prisma.message.updateMany({
      where: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        read: false
      },
      data: {
        read: true
      }
    });

    console.log('✅ Messages marqués comme lus:', updatedMessages.count);

    return NextResponse.json({ success: true, count: updatedMessages.count });

  } catch (error) {
    console.error('❌ Erreur lors du marquage des messages:', error);
    return NextResponse.json({ 
      error: "Erreur lors du marquage des messages",
      details: error.message 
    }, { status: 500 });
  }
} 