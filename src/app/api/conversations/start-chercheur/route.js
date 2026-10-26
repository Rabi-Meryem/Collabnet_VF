import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const { currentUserId, currentUserType, targetUserId, targetUserType } = await request.json();
    
    console.log('🔍 API start-chercheur: Début avec params:', {
      currentUserId,
      currentUserType,
      targetUserId,
      targetUserType
    });

    // Vérifier que les paramètres requis sont présents
    if (!currentUserId || !targetUserId) {
      console.error('❌ API start-chercheur: Paramètres manquants');
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur ne contacte pas lui-même
    if (currentUserId === targetUserId) {
      console.error('❌ API start-chercheur: Tentative de contact avec soi-même');
      return NextResponse.json(
        { error: 'Vous ne pouvez pas vous contacter vous-même' },
        { status: 400 }
      );
    }

    // Vérifier si une conversation existe déjà
    const existingConversation = await sql`
      SELECT * FROM conversations 
      WHERE (participant1_id = ${currentUserId} AND participant2_id = ${targetUserId})
         OR (participant1_id = ${targetUserId} AND participant2_id = ${currentUserId})
    `;

    if (existingConversation.rows.length > 0) {
      console.log('✅ API start-chercheur: Conversation existante trouvée');
      const conversation = existingConversation.rows[0];
      
      // Déterminer l'URL de redirection
      const redirectUrl = `/messages-chercheur/${targetUserId}?type=${targetUserType}`;
      
      return NextResponse.json({
        success: true,
        conversationId: conversation.id,
        redirectUrl: redirectUrl,
        message: 'Conversation existante'
      });
    }

    // Créer une nouvelle conversation
    const newConversation = await sql`
      INSERT INTO conversations (participant1_id, participant1_type, participant2_id, participant2_type, created_at)
      VALUES (${currentUserId}, ${currentUserType}, ${targetUserId}, ${targetUserType}, NOW())
      RETURNING *
    `;

    console.log('✅ API start-chercheur: Nouvelle conversation créée:', newConversation.rows[0]);

    // Déterminer l'URL de redirection
    const redirectUrl = `/messages-chercheur/${targetUserId}?type=${targetUserType}`;

    return NextResponse.json({
      success: true,
      conversationId: newConversation.rows[0].id,
      redirectUrl: redirectUrl,
      message: 'Nouvelle conversation créée'
    });

  } catch (error) {
    console.error('❌ API start-chercheur: Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la conversation' },
      { status: 500 }
    );
  }
} 