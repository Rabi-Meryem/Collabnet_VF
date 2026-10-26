import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📥 Corps de la requête reçu:', body);
    
    const { content, senderId, receiverId, senderType, receiverType } = body;

    if (!content || !senderId || !receiverId || !senderType || !receiverType) {
      console.log('❌ Champs manquants:', { content, senderId, receiverId, senderType, receiverType });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    console.log('📤 Création d\'un nouveau message:', { content, senderId, receiverId, senderType, receiverType });

    // Vérifier que les IDs sont valides
    const senderIdInt = parseInt(senderId);
    const receiverIdInt = parseInt(receiverId);
    
    if (isNaN(senderIdInt) || isNaN(receiverIdInt)) {
      console.log('❌ IDs invalides:', { senderId, receiverId });
      return NextResponse.json({ error: "IDs d'utilisateurs invalides" }, { status: 400 });
    }

    // Vérifier que les IDs sont différents OU que les types sont différents
    if (senderIdInt === receiverIdInt) {
      console.log('⚠️ IDs identiques détectés:', { senderId, receiverId, senderType, receiverType });
      console.log('🔍 Debug des IDs:', { 
        senderId, 
        receiverId, 
        senderIdInt, 
        receiverIdInt,
        senderType,
        receiverType
      });
      
      // Si les types sont différents, on peut continuer (entreprise vs chercheur avec même ID)
      if (senderType !== receiverType) {
        console.log('✅ IDs identiques mais types différents - continuation autorisée');
      } else {
        // Si les types sont identiques ET les IDs sont identiques, c'est une erreur
        return NextResponse.json({ error: "L'expéditeur et le destinataire ne peuvent pas être identiques" }, { status: 400 });
      }
    }

    // Déterminer les IDs pour la conversation - LOGIQUE SIMPLIFIÉE
    let chercheurId, entrepriseId;
    
    // Toujours utiliser le plus petit ID comme chercheurId et le plus grand comme entrepriseId
    if (senderIdInt <= receiverIdInt) {
      chercheurId = senderIdInt;
      entrepriseId = receiverIdInt;
    } else {
      chercheurId = receiverIdInt;
      entrepriseId = senderIdInt;
    }
    
    console.log('🔍 IDs simplifiés pour envoi:', { chercheurId, entrepriseId, senderIdInt, receiverIdInt });

    console.log('🔍 Recherche de conversation:', { chercheurId, entrepriseId });

    // Trouver ou créer la conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        chercheurId: chercheurId,
        entrepriseId: entrepriseId
      }
    });

    if (!conversation) {
      console.log('🆕 Création d\'une nouvelle conversation');
      conversation = await prisma.conversation.create({
        data: {
          chercheurId: chercheurId,
          entrepriseId: entrepriseId
        }
      });
      console.log('✅ Conversation créée:', conversation.id);
    } else {
      console.log('✅ Conversation existante trouvée:', conversation.id);
    }
    
    // Lister toutes les conversations pour debug
    const allConversations = await prisma.conversation.findMany();
    console.log('📋 Toutes les conversations après création/recherche:', allConversations);

    // Sauvegarder le message dans la base de données
    console.log('💾 Sauvegarde du message...');
    const message = await prisma.message.create({
      data: {
        content,
        senderId: senderIdInt,
        receiverId: receiverIdInt,
        senderType,
        receiverType,
        conversationId: conversation.id,
        read: false
      }
    });

    console.log('✅ Message créé avec succès:', message.id);

    return NextResponse.json(message);

  } catch (error) {
    console.error('❌ Erreur détaillée lors de la création du message:', error);
    console.error('❌ Stack trace:', error.stack);
    return NextResponse.json({ 
      error: "Erreur lors de la création du message",
      details: error.message 
    }, { status: 500 });
  }
} 