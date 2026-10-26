'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatSidebarEntreprise from '../components/ChatSidebarEntreprise';
import ChatBoxEntreprise from '../components/ChatBoxEntreprise';
import { getCurrentEntrepriseInfo } from '../utils/messaging-entreprise';

export default function MessagesEntreprise() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserType, setCurrentUserType] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Récupérer l'ID utilisateur depuis l'URL
  const userIdFromUrl = searchParams.get('userId');
  const userTypeFromUrl = searchParams.get('type');

  useEffect(() => {
          const getCurrentUserId = async () => {
        try {
          const currentUser = getCurrentEntrepriseInfo();
          if (currentUser) {
            console.log('🔍 Détection entreprise:', currentUser.email);
            const response = await fetch(`/api/profile/entreprise?email=${currentUser.email}`);
            if (response.ok) {
              const userData = await response.json();
              setCurrentUserId(userData.id);
              setCurrentUserType('entreprise');
              console.log('✅ Entreprise détectée:', { id: userData.id, type: 'entreprise' });
            } else {
              console.error('Failed to fetch entreprise profile');
            }
          } else {
            console.error('No entreprise email found in localStorage');
          }
        } catch (error) {
          console.error('Error getting current user:', error);
        }
      };

    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (userIdFromUrl && userTypeFromUrl) {
      setSelectedUserId(parseInt(userIdFromUrl));
      
      // Récupérer les informations de l'utilisateur sélectionné
      const fetchSelectedUser = async () => {
        try {
          const response = await fetch(`/api/profile/${userTypeFromUrl}?id=${userIdFromUrl}`);
          if (response.ok) {
            const userData = await response.json();
            setSelectedUser(userData);
          }
        } catch (error) {
          console.error('Error fetching selected user:', error);
        }
      };

      fetchSelectedUser();
    }
  }, [userIdFromUrl, userTypeFromUrl]);

  const handleUserSelect = (userId) => {
    console.log('🔍 Sélection utilisateur:', userId);
    setSelectedUserId(userId);
    
    // Déterminer le type d'utilisateur basé sur l'ID
    const userType = userId === 1001 ? 'entreprise' : 'chercheur';
    
    // Mettre à jour l'URL
    router.push(`/messages-entreprise/${userId}?type=${userType}`);
    
    // Récupérer les informations de l'utilisateur
    const fetchSelectedUser = async () => {
      try {
        const response = await fetch(`/api/profile/${userType}?id=${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setSelectedUser(userData);
        }
      } catch (error) {
        console.error('Error fetching selected user:', error);
      }
    };

    fetchSelectedUser();
  };

  // Debug info
  useEffect(() => {
    console.log('🔍 Debug Messages Entreprise:', {
      currentUserId,
      currentUserType,
      selectedUserId,
      selectedUser: selectedUser?.fullName || selectedUser?.companyName,
      entrepriseEmail: localStorage.getItem('entrepriseEmail')
    });
  }, [currentUserId, currentUserType, selectedUserId, selectedUser]);

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Accès non autorisé</h3>
          <p className="text-gray-500">Vous devez être connecté en tant qu'entreprise</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatSidebarEntreprise 
        currentUserId={currentUserId} 
        selectedUserId={selectedUserId} 
        onUserSelect={handleUserSelect}
      />
      
      {/* Chat Box */}
      <ChatBoxEntreprise 
        currentUserId={currentUserId} 
        selectedUserId={selectedUserId} 
        selectedUser={selectedUser}
      />
    </div>
  );
} 