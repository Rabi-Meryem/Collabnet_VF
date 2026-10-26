import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const userId1 = searchParams.get('userId1');
    const userId2 = searchParams.get('userId2');

    if (!userId1 || !userId2) {
      return NextResponse.json(
        { error: 'Missing user IDs' },
        { status: 400 }
      );
    }

    // Récupérer tous les messages entre les deux utilisateurs
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(userId1),
            receiverId: parseInt(userId2)
          },
          {
            senderId: parseInt(userId2),
            receiverId: parseInt(userId1)
          }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // Enrichir les messages avec les informations des utilisateurs
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        let senderInfo = null;
        let receiverInfo = null;

        // Récupérer les informations de l'expéditeur
        if (message.senderType === 'chercheur') {
          senderInfo = await prisma.chercheur.findUnique({
            where: { id: message.senderId },
            select: {
              id: true,
              fullName: true,
              profileImage: true,
              email: true
            }
          });
        } else if (message.senderType === 'entreprise') {
          senderInfo = await prisma.entreprise.findUnique({
            where: { id: message.senderId },
            select: {
              id: true,
              companyName: true,
              profileImage: true,
              email: true
            }
          });
        }

        // Récupérer les informations du destinataire
        if (message.receiverType === 'chercheur') {
          receiverInfo = await prisma.chercheur.findUnique({
            where: { id: message.receiverId },
            select: {
              id: true,
              fullName: true,
              profileImage: true,
              email: true
            }
          });
        } else if (message.receiverType === 'entreprise') {
          receiverInfo = await prisma.entreprise.findUnique({
            where: { id: message.receiverId },
            select: {
              id: true,
              companyName: true,
              profileImage: true,
              email: true
            }
          });
        }

        return {
          ...message,
          sender: senderInfo,
          receiver: receiverInfo
        };
      })
    );

    return NextResponse.json(messagesWithUsers);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 