import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { userId } = resolvedParams;
    
    console.log('🔍 API conversations chercheur: Récupération pour userId:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'userId est requis' },
        { status: 400 }
      );
    }

    // Récupérer toutes les conversations du chercheur de manière optimisée
    const conversations = await prisma.message.groupBy({
      by: ['senderId', 'receiverId', 'senderType', 'receiverType'],
      where: {
        OR: [
          {
            senderId: parseInt(userId),
            senderType: 'chercheur'
          },
          {
            receiverId: parseInt(userId),
            receiverType: 'chercheur'
          }
        ]
      },
      _count: {
        id: true
      },
      _max: {
        createdAt: true
      }
    });

    // Récupérer tous les IDs d'utilisateurs uniques pour optimiser les requêtes
    const uniqueUserIds = [...new Set(
      conversations.map(conv => {
        const otherUserId = conv.senderId === parseInt(userId) ? conv.receiverId : conv.senderId;
        return otherUserId;
      })
    )];

    // Récupérer tous les utilisateurs en une seule requête
    const [chercheurs, entreprises] = await Promise.all([
      prisma.chercheur.findMany({
        where: { id: { in: uniqueUserIds } },
        select: { id: true, fullName: true, email: true }
      }),
      prisma.entreprise.findMany({
        where: { id: { in: uniqueUserIds } },
        select: { id: true, companyName: true, email: true }
      })
    ]);

    // Créer des maps pour un accès rapide
    const chercheurMap = new Map(chercheurs.map(c => [c.id, c]));
    const entrepriseMap = new Map(entreprises.map(e => [e.id, e]));

    // Récupérer tous les derniers messages en une seule requête
    const lastMessages = await prisma.message.findMany({
      where: {
        OR: conversations.map(conv => {
          const otherUserId = conv.senderId === parseInt(userId) ? conv.receiverId : conv.senderId;
          const otherUserType = conv.senderId === parseInt(userId) ? conv.receiverType : conv.senderType;
          
          return [
            {
              senderId: parseInt(userId),
              receiverId: otherUserId,
              senderType: 'chercheur',
              receiverType: otherUserType
            },
            {
              senderId: otherUserId,
              receiverId: parseInt(userId),
              senderType: otherUserType,
              receiverType: 'chercheur'
            }
          ];
        }).flat()
      },
      orderBy: {
        createdAt: 'desc'
      },
      distinct: ['senderId', 'receiverId', 'senderType', 'receiverType']
    });

    // Créer un map des derniers messages
    const lastMessageMap = new Map();
    lastMessages.forEach(msg => {
      const key = `${msg.senderId}-${msg.receiverId}-${msg.senderType}-${msg.receiverType}`;
      const reverseKey = `${msg.receiverId}-${msg.senderId}-${msg.receiverType}-${msg.senderType}`;
      
      if (!lastMessageMap.has(key) && !lastMessageMap.has(reverseKey)) {
        lastMessageMap.set(key, msg);
      }
    });

    // Enrichir les conversations
    const enrichedConversations = conversations.map((conv) => {
      const otherUserId = conv.senderId === parseInt(userId) ? conv.receiverId : conv.senderId;
      const otherUserType = conv.senderId === parseInt(userId) ? conv.receiverType : conv.senderType;
      
      // Récupérer les informations de l'autre utilisateur
      let otherUser = null;
      if (otherUserType === 'chercheur') {
        otherUser = chercheurMap.get(otherUserId);
      } else {
        otherUser = entrepriseMap.get(otherUserId);
      }

      // Récupérer le dernier message
      const key = `${parseInt(userId)}-${otherUserId}-chercheur-${otherUserType}`;
      const reverseKey = `${otherUserId}-${parseInt(userId)}-${otherUserType}-chercheur`;
      const lastMessage = lastMessageMap.get(key) || lastMessageMap.get(reverseKey);

      return {
        id: otherUserId,
        type: otherUserType,
        name: otherUser?.fullName || otherUser?.companyName || 'Utilisateur inconnu',
        email: otherUser?.email,
        lastMessage: lastMessage?.content || 'Aucun message',
        lastMessageTime: lastMessage?.createdAt,
        messageCount: conv._count.id
      };
    });

    console.log('✅ API conversations chercheur: Conversations récupérées:', enrichedConversations.length);

    return NextResponse.json(enrichedConversations);

  } catch (error) {
    console.error('❌ API conversations chercheur: Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
} 