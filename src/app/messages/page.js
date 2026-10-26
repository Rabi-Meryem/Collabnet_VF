'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from '../components/ChatSidebar';
import ChatBox from '../components/ChatBox';
  import Navbar from '../nav-bar/NavbarChercheur';
import NavbarEntreprise from '../nav-bar/NavbarEntreprise';
import { getCurrentUserInfo } from '../utils/messaging';

  export default function MessagesPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserType, setCurrentUserType] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Récupérer l'ID de l'utilisateur connecté
    const getCurrentUserId = async () => {
      try {
        // Forcer la détection de l'entreprise
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        if (entrepriseEmail) {
          console.log('🔍 Forcer la détection de l\'entreprise:', entrepriseEmail);
          
          const response = await fetch(`/api/profile/entreprise?email=${entrepriseEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
            setCurrentUserType('entreprise');
            console.log('✅ Entreprise détectée:', { id: userData.id, type: 'entreprise' });
          } else {
            console.error('Failed to fetch entreprise profile');
          }
        } else {
          // Fallback vers getCurrentUserInfo
          const currentUser = getCurrentUserInfo();
          
          if (!currentUser) {
            console.error('No user found in localStorage');
            return;
          }
          
          console.log('🔍 getCurrentUserId - currentUser:', currentUser);
          
          const response = await fetch(`/api/profile/${currentUser.type}?email=${currentUser.email}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
            setCurrentUserType(currentUser.type);
            console.log('✅ User detected:', { id: userData.id, type: currentUser.type });
          } else {
            console.error('Failed to fetch user profile');
          }
        }
        
        // Forcer l'ID entreprise si l'email entreprise existe
        if (entrepriseEmail) {
          console.log('🔄 Forcer l\'ID entreprise à 1001');
          setCurrentUserId(1001);
          setCurrentUserType('entreprise');
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserId();

    // Vérifier s'il y a un utilisateur sélectionné dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = window.location.pathname.split('/').pop();
    const userTypeFromUrl = urlParams.get('type');
    
    if (userIdFromUrl && userIdFromUrl !== 'messages') {
      setSelectedUserId(userIdFromUrl);
      loadSelectedUser(userIdFromUrl);
    }

    // Debug: Afficher les informations pour comprendre le problème
    console.log('🔍 Messages page debug:', {
      currentUserId,
      currentUserType,
      userIdFromUrl,
      userTypeFromUrl,
      localStorage: {
        chercheurEmail: localStorage.getItem('chercheurEmail'),
        entrepriseEmail: localStorage.getItem('entrepriseEmail')
      }
    });

    // Vérifier le localStorage
    const entrepriseEmail = localStorage.getItem('entrepriseEmail');
    const chercheurEmail = localStorage.getItem('chercheurEmail');
    
    console.log('🔍 localStorage actuel:', { entrepriseEmail, chercheurEmail });
    
    // Si l'email entreprise existe, supprimer l'email chercheur
    if (entrepriseEmail && chercheurEmail) {
      console.log('⚠️ Suppression de l\'email chercheur pour éviter les conflits');
      localStorage.removeItem('chercheurEmail');
    }
  }, []);

  const loadSelectedUser = async (userId) => {
    try {
      // Essayer de charger comme chercheur d'abord
      let response = await fetch(`/api/profile/chercheur?id=${userId}`);
      let userData = null;

      if (response.ok) {
        userData = await response.json();
      } else {
        // Si ce n'est pas un chercheur, essayer comme entreprise
        response = await fetch(`/api/profile/entreprise?id=${userId}`);
        if (response.ok) {
          userData = await response.json();
        }
      }

      if (userData) {
        setSelectedUser(userData);
      }
    } catch (error) {
      console.error('Error loading selected user:', error);
    }
  };

  const handleUserSelect = (userId, userType = null) => {
    setSelectedUserId(userId);
    loadSelectedUser(userId);
    // Mettre à jour l'URL sans recharger la page
    const url = userType ? `/messages/${userId}?type=${userType}` : `/messages/${userId}`;
    router.push(url, { scroll: false });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full">
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <Navbar />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Chargement...</p>
                  </div>
                </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="bg-white min-h-screen w-full">
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <Navbar />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Veuillez vous connecter pour accéder aux messages</p>
            </div>
          </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <Navbar />}
      
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
      </div>
      </div>
    );
  }