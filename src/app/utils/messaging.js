export function getCurrentUserInfo() {
  const chercheurEmail = localStorage.getItem('chercheurEmail');
  const entrepriseEmail = localStorage.getItem('entrepriseEmail');
  
  console.log('🔍 getCurrentUserInfo: Emails trouvés:', { chercheurEmail, entrepriseEmail });
  
  // Si les deux emails sont présents, prioriser l'entreprise
  if (entrepriseEmail) {
    return {
      email: entrepriseEmail,
      type: 'entreprise'
    };
  } else if (chercheurEmail) {
    return {
      email: chercheurEmail,
      type: 'chercheur'
    };
  }
  
  return null;
}

export async function startConversation(currentUserId, currentUserType, targetUserId, targetUserType) {
  try {
    console.log('🔍 startConversation: Début avec params:', {
      currentUserId,
      currentUserType,
      targetUserId,
      targetUserType
    });

    const requestBody = {
      currentUserId,
      currentUserType,
      targetUserId,
      targetUserType
    };
    
    console.log('🔍 startConversation: Corps de la requête:', requestBody);

    const response = await fetch('/api/conversations/start-with-redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('🔍 startConversation: Réponse reçue:', response.status, response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ startConversation: Succès:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ startConversation: Erreur HTTP:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ startConversation: Erreur réseau:', error);
    return null;
  }
}

export const debugLocalStorage = () => {
  console.log('🔍 Contenu localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
}; 