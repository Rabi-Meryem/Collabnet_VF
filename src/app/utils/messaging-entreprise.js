export async function getCurrentEntrepriseInfo() {
  const entrepriseEmail = localStorage.getItem('entrepriseEmail');
  
  console.log('🔍 getCurrentEntrepriseInfo: Email entreprise trouvé:', entrepriseEmail);
  
  if (!entrepriseEmail) {
    console.error('❌ getCurrentEntrepriseInfo: Aucun email entreprise trouvé');
    return null;
  }

  try {
    // Récupérer les informations complètes de l'utilisateur depuis l'API
    const response = await fetch(`/api/profile/entreprise?email=${encodeURIComponent(entrepriseEmail)}`);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ getCurrentEntrepriseInfo: Données utilisateur récupérées:', userData);
      return {
        id: userData.id,
        email: entrepriseEmail,
        type: 'entreprise',
        ...userData
      };
    } else {
      console.error('❌ getCurrentEntrepriseInfo: Erreur API:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ getCurrentEntrepriseInfo: Erreur réseau:', error);
    return null;
  }
}

export async function startEntrepriseConversation(currentUserId, targetUserId, targetUserType) {
  try {
    console.log('🔍 startEntrepriseConversation: Début avec params:', {
      currentUserId,
      targetUserId,
      targetUserType
    });

    const requestBody = {
      currentUserId,
      currentUserType: 'entreprise',
      targetUserId,
      targetUserType
    };
    
    console.log('🔍 startEntrepriseConversation: Corps de la requête:', requestBody);

    const response = await fetch('/api/conversations/start-entreprise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('🔍 startEntrepriseConversation: Réponse reçue:', response.status, response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ startEntrepriseConversation: Succès:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ startEntrepriseConversation: Erreur HTTP:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ startEntrepriseConversation: Erreur réseau:', error);
    return null;
  }
}

export async function getEntrepriseConversations(userId) {
  try {
    console.log('🔍 getEntrepriseConversations: Récupération pour userId:', userId);
    
    const response = await fetch(`/api/conversations/entreprise/${userId}`);
    
    if (response.ok) {
      const conversations = await response.json();
      console.log('✅ getEntrepriseConversations: Succès:', conversations);
      return conversations;
    } else {
      console.error('❌ getEntrepriseConversations: Erreur HTTP:', response.status);
      return [];
    }
  } catch (error) {
    console.error('❌ getEntrepriseConversations: Erreur réseau:', error);
    return [];
  }
}

export async function sendEntrepriseMessage(conversationId, senderId, content, receiverId, receiverType) {
  try {
    console.log('🔍 sendEntrepriseMessage: Envoi message:', { conversationId, senderId, content, receiverId, receiverType });
    
    const response = await fetch('/api/messages/send-entreprise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        senderId,
        senderType: 'entreprise',
        content,
        receiverId,
        receiverType
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ sendEntrepriseMessage: Succès:', result);
      return result;
    } else {
      console.error('❌ sendEntrepriseMessage: Erreur HTTP:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ sendEntrepriseMessage: Erreur réseau:', error);
    return null;
  }
}

export const debugEntrepriseLocalStorage = () => {
  console.log('🔍 Contenu localStorage Entreprise:');
  const entrepriseEmail = localStorage.getItem('entrepriseEmail');
  console.log(`entrepriseEmail: ${entrepriseEmail}`);
}; 