'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatSidebarEntreprise from '../../components/ChatSidebarEntreprise';
import ChatBoxEntreprise from '../../components/ChatBoxEntreprise';
import { getCurrentEntrepriseInfo } from '../../utils/messaging-entreprise';

export default function MessagesEntreprisePage({ params }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Debug: Afficher le contenu du localStorage
        console.log('🔍 MessagesEntreprisePage: Debug localStorage:');
        console.log('entrepriseEmail:', localStorage.getItem('entrepriseEmail'));
        console.log('chercheurEmail:', localStorage.getItem('chercheurEmail'));
        
        // Récupérer l'ID de l'utilisateur actuel
        const userInfo = await getCurrentEntrepriseInfo();
        console.log('🔍 MessagesEntreprisePage: userInfo reçu:', userInfo);
        
        if (userInfo && userInfo.id) {
          setCurrentUserId(userInfo.id);
          console.log('🔍 MessagesEntreprisePage: Utilisateur actuel:', userInfo.id);
        } else {
          console.error('❌ MessagesEntreprisePage: Impossible de récupérer l\'utilisateur actuel');
          console.error('❌ MessagesEntreprisePage: userInfo:', userInfo);
          
          // Vérifier si l'utilisateur est connecté en tant que chercheur
          const chercheurEmail = localStorage.getItem('chercheurEmail');
          if (chercheurEmail) {
            alert('Vous êtes connecté en tant que chercheur. Veuillez vous connecter en tant qu\'entreprise pour accéder à cette page.');
            window.location.href = '/login-entreprise';
            return;
          } else {
            alert('Erreur: Impossible de récupérer vos informations. Veuillez vous reconnecter.');
            window.location.href = '/login-entreprise';
            return;
          }
        }

        // Récupérer les paramètres de l'URL
        const resolvedParams = await params;
        const targetUserId = resolvedParams.userId;
        const targetUserType = searchParams.get('type');

        if (targetUserId && targetUserType) {
          setSelectedUserId(targetUserId);
          setSelectedUserType(targetUserType);
          console.log('🔍 MessagesEntreprisePage: Utilisateur sélectionné:', {
            userId: targetUserId,
            type: targetUserType
          });

          // Récupérer les informations de l'utilisateur sélectionné
          try {
            console.log('🔍 MessagesEntreprisePage: Récupération des informations utilisateur...');
            const userResponse = await fetch(`/api/profile/${targetUserType}?id=${targetUserId}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setSelectedUser(userData);
              console.log('✅ MessagesEntreprisePage: Informations utilisateur récupérées:', userData);
            } else {
              console.error('❌ MessagesEntreprisePage: Erreur lors de la récupération des informations utilisateur');
            }
          } catch (error) {
            console.error('❌ MessagesEntreprisePage: Erreur lors de la récupération des informations utilisateur:', error);
          }

          // Créer automatiquement une conversation si elle n'existe pas
          try {
            console.log('🔍 MessagesEntreprisePage: Création automatique de conversation...');
            const conversationResponse = await fetch('/api/conversations/start-entreprise', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                currentUserId: userInfo.id,
                currentUserType: 'entreprise',
                targetUserId: parseInt(targetUserId),
                targetUserType: targetUserType
              })
            });

            if (conversationResponse.ok) {
              const conversationData = await conversationResponse.json();
              console.log('✅ MessagesEntreprisePage: Conversation créée/récupérée:', conversationData);
            } else {
              console.error('❌ MessagesEntreprisePage: Erreur lors de la création de conversation');
            }
          } catch (error) {
            console.error('❌ MessagesEntreprisePage: Erreur lors de la création de conversation:', error);
          }
        }
      } catch (error) {
        console.error('❌ MessagesEntreprisePage: Erreur lors de l\'initialisation:', error);
        alert('Erreur lors du chargement de la page. Veuillez réessayer.');
      }
    };

    initializePage();
  }, [params, searchParams]);

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <ChatSidebarEntreprise
          currentUserId={currentUserId}
          onUserSelect={(userId, userType) => {
            setSelectedUserId(userId);
            setSelectedUserType(userType);
          }}
          selectedUserId={selectedUserId}
        />
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col">
        {selectedUserId && selectedUserType ? (
          <ChatBoxEntreprise
            currentUserId={currentUserId}
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez un utilisateur dans la liste pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 