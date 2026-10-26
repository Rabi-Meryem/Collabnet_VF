import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    
    // Utiliser l'ID tel quel - la logique simplifiée s'en chargera
    let actualUserId = parseInt(userId);
    
    console.log('🔍 Récupération des conversations pour userId:', actualUserId);
    
    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await prisma.message.groupBy({
      by: ['senderId', 'receiverId', 'senderType', 'receiverType'],
      where: {
        OR: [
          { senderId: actualUserId },
          { receiverId: actualUserId }
        ]
      },
      _count: {
        id: true
      },
      _max: {
        createdAt: true
      }
    });

    console.log('🔍 Conversations trouvées:', conversations.length);

    // Récupérer les détails des utilisateurs pour chaque conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.senderId === actualUserId 
          ? conv.receiverId 
          : conv.senderId;
        
        const otherUserType = conv.senderId === actualUserId
          ? conv.receiverType
          : conv.senderType;

        console.log('🔍 Conversation debug:', {
          userId: parseInt(userId),
          conv,
          otherUserId,
          otherUserType
        });

        let otherUser = null;
        if (otherUserType === 'chercheur') {
          otherUser = await prisma.chercheur.findUnique({
            where: { id: otherUserId },
            select: {
              id: true,
              fullName: true,
              profileImage: true,
              email: true
            }
          });
        } else if (otherUserType === 'entreprise') {
          otherUser = await prisma.entreprise.findUnique({
            where: { id: otherUserId },
            select: {
              id: true,
              companyName: true,
              profileImage: true,
              email: true
            }
          });
        }

        // Récupérer le dernier message
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: actualUserId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: actualUserId }
            ]
          },
          orderBy: { createdAt: 'desc' }
        });

        // Récupérer les informations de l'expéditeur du dernier message
        let senderInfo = null;
        if (lastMessage) {
          if (lastMessage.senderType === 'chercheur') {
            senderInfo = await prisma.chercheur.findUnique({
              where: { id: lastMessage.senderId },
              select: {
                id: true,
                fullName: true,
                profileImage: true
              }
            });
          } else if (lastMessage.senderType === 'entreprise') {
            senderInfo = await prisma.entreprise.findUnique({
              where: { id: lastMessage.senderId },
              select: {
                id: true,
                companyName: true,
                profileImage: true
              }
            });
          }
        }

        return {
          otherUser,
          lastMessage: lastMessage ? {
            ...lastMessage,
            sender: senderInfo
          } : null,
          unreadCount: await prisma.message.count({
            where: {
              senderId: otherUserId,
              receiverId: actualUserId,
              read: false
            }
          })
        };
      })
    );

    console.log('✅ Conversations avec utilisateurs:', conversationsWithUsers.length);
    console.log('📋 Détails des conversations:', conversationsWithUsers.map(c => ({
      otherUser: c.otherUser?.fullName || c.otherUser?.companyName,
      lastMessage: c.lastMessage?.content,
      unreadCount: c.unreadCount
    })));

    return NextResponse.json(conversationsWithUsers);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
} 