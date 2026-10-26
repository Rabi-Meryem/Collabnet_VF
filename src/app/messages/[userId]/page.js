'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatSidebar from '../../components/ChatSidebar';
import ChatBox from '../../components/ChatBox';
import NavbarEntreprise from '../../nav-bar/NavbarEntreprise';
import NavbarChercheur from '../../nav-bar/NavbarChercheur';

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserType, setCurrentUserType] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversationCreated, setConversationCreated] = useState(false);

  // Déterminer l'utilisateur connecté
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        console.log('🔍 Emails trouvés:', { chercheurEmail, entrepriseEmail });
        
        if (chercheurEmail) {
          const response = await fetch(`/api/profile/chercheur?email=${chercheurEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
            setCurrentUserType('chercheur');
            console.log('✅ Utilisateur connecté (chercheur):', userData);
          } else {
            console.error('❌ Erreur lors de la récupération du profil chercheur');
          }
        } else if (entrepriseEmail) {
          const response = await fetch(`/api/profile/entreprise?email=${entrepriseEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
            setCurrentUserType('entreprise');
            console.log('✅ Utilisateur connecté (entreprise):', userData);
          } else {
            console.error('❌ Erreur lors de la récupération du profil entreprise');
          }
        } else {
          console.error('❌ Aucun utilisateur connecté trouvé');
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Charger l'utilisateur sélectionné quand l'URL change
  useEffect(() => {
    if (params.userId && currentUserId && currentUserType) {
      const targetUserId = parseInt(params.userId);
      setSelectedUserId(targetUserId);
      console.log('🎯 ID utilisateur sélectionné depuis l\'URL:', targetUserId);
      
      console.log('🎯 Chargement utilisateur sélectionné:', { 
        targetUserId, 
        currentUserId, 
        currentUserType 
      });

      const loadTargetUser = async () => {
        try {
          // Essayer de charger comme chercheur d'abord
          let response = await fetch(`/api/profile/chercheur?id=${targetUserId}`);
          let userData = null;
          let targetUserType = null;

          if (response.ok) {
            userData = await response.json();
            targetUserType = 'chercheur';
          } else {
            // Si ce n'est pas un chercheur, essayer comme entreprise
            response = await fetch(`/api/profile/entreprise?id=${targetUserId}`);
            if (response.ok) {
              userData = await response.json();
              targetUserType = 'entreprise';
            }
          }

          if (userData && targetUserType) {
            // Ajouter le type d'utilisateur aux données
            userData.userType = targetUserType;
            setSelectedUser(userData);
            console.log('👤 Utilisateur sélectionné chargé:', userData);
          }
        } catch (error) {
          console.error('Error loading target user:', error);
        }
      };

      loadTargetUser();
    }
  }, [params.userId, currentUserId, currentUserType]);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    router.push(`/messages/${userId}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full">
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="bg-white min-h-screen w-full">
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Veuillez vous connecter pour accéder aux messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
      
      {/* Chat Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <ChatSidebar
          currentUserId={currentUserId}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
        />
        
        {/* Chat Box */}
        <ChatBox
          currentUserId={currentUserId}
          selectedUserId={selectedUserId}
          selectedUser={selectedUser}
        />
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
            <div>Current User ID: {currentUserId}</div>
            <div>Selected User ID: {selectedUserId}</div>
            <div>Current User Type: {currentUserType}</div>
            <div>Selected User: {selectedUser?.fullName || selectedUser?.companyName}</div>
            <div>Selected User Type: {selectedUser?.userType}</div>
          </div>
        )}
        

      </div>
    </div>
  );
} 