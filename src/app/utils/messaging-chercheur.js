export async function getCurrentChercheurInfo() {
  const chercheurEmail = localStorage.getItem('chercheurEmail');
  
  console.log('🔍 getCurrentChercheurInfo: Email chercheur trouvé:', chercheurEmail);
  
  if (!chercheurEmail) {
    console.error('❌ getCurrentChercheurInfo: Aucun email chercheur trouvé');
    return null;
  }

  try {
    // Récupérer les informations complètes de l'utilisateur depuis l'API
    const response = await fetch(`/api/profile/chercheur?email=${encodeURIComponent(chercheurEmail)}`);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ getCurrentChercheurInfo: Données utilisateur récupérées:', userData);
      return {
        id: userData.id,
        email: chercheurEmail,
        type: 'chercheur',
        ...userData
      };
    } else {
      console.error('❌ getCurrentChercheurInfo: Erreur API:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ getCurrentChercheurInfo: Erreur réseau:', error);
    return null;
  }
}

export async function startChercheurConversation(currentUserId, targetUserId, targetUserType) {
  try {
    console.log('🔍 startChercheurConversation: Début avec params:', {
      currentUserId,
      targetUserId,
      targetUserType
    });

    const requestBody = {
      currentUserId,
      currentUserType: 'chercheur',
      targetUserId,
      targetUserType
    };
    
    console.log('🔍 startChercheurConversation: Corps de la requête:', requestBody);

    const response = await fetch('/api/conversations/start-chercheur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('🔍 startChercheurConversation: Réponse reçue:', response.status, response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ startChercheurConversation: Succès:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ startChercheurConversation: Erreur HTTP:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ startChercheurConversation: Erreur réseau:', error);
    return null;
  }
}

export async function getChercheurConversations(userId) {
  try {
    console.log('🔍 getChercheurConversations: Récupération pour userId:', userId);
    
    const response = await fetch(`/api/conversations/chercheur/${userId}`);
    
    if (response.ok) {
      const conversations = await response.json();
      console.log('✅ getChercheurConversations: Succès:', conversations);
      return conversations;
    } else {
      console.error('❌ getChercheurConversations: Erreur HTTP:', response.status);
      return [];
    }
  } catch (error) {
    console.error('❌ getChercheurConversations: Erreur réseau:', error);
    return [];
  }
}

export async function sendChercheurMessage(conversationId, senderId, content, receiverId, receiverType) {
  try {
    console.log('🔍 sendChercheurMessage: Envoi message:', { conversationId, senderId, content, receiverId, receiverType });
    
    const response = await fetch('/api/messages/send-chercheur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        senderId,
        senderType: 'chercheur',
        content,
        receiverId,
        receiverType
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ sendChercheurMessage: Succès:', result);
      return result;
    } else {
      console.error('❌ sendChercheurMessage: Erreur HTTP:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ sendChercheurMessage: Erreur réseau:', error);
    return null;
  }
}

export const debugChercheurLocalStorage = () => {
  console.log('🔍 Contenu localStorage Chercheur:');
  const chercheurEmail = localStorage.getItem('chercheurEmail');
  console.log(`chercheurEmail: ${chercheurEmail}`);
}; 