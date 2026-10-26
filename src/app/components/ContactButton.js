'use client';
import { useState } from 'react';
import { getCurrentUserInfo } from '../utils/messaging';

export default function ContactButton({ 
  targetUserId, 
  targetUserType, 
  className = "w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center",
  children = "Contact"
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContact = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 ContactButton: Début du processus de contact');
      
      // Vérifier que les paramètres requis sont présents
      if (!targetUserId || !targetUserType) {
        console.error('❌ ContactButton: Paramètres manquants:', { targetUserId, targetUserType });
        alert('Erreur: Informations de contact manquantes');
        return;
      }
      
      const currentUser = getCurrentUserInfo();
      console.log('🔍 ContactButton: Utilisateur actuel:', currentUser);
      
      if (!currentUser) {
        console.error('❌ ContactButton: Aucun utilisateur connecté');
        alert('Veuillez vous connecter pour contacter cette personne');
        return;
      }

      // Debug: Afficher les informations de localStorage dans la console
      console.log('🔍 ContactButton: Debug localStorage:');
      console.log('Chercheur Email:', localStorage.getItem('chercheurEmail'));
      console.log('Entreprise Email:', localStorage.getItem('entrepriseEmail'));
      console.log('Type détecté:', currentUser.type);

      // Récupérer les informations de l'utilisateur actuel
      console.log('🔍 ContactButton: Récupération du profil utilisateur...');
      
      // Vérifier d'abord si l'utilisateur existe dans la bonne table
      let userRes = await fetch(`/api/profile/${currentUser.type}?email=${currentUser.email}`);
      console.log('🔍 ContactButton: Réponse API profil:', userRes.status, userRes.ok);
      
      if (!userRes.ok) {
        // Si ça ne marche pas, essayer l'autre type
        const otherType = currentUser.type === 'chercheur' ? 'entreprise' : 'chercheur';
        console.log('🔍 ContactButton: Essai avec l\'autre type:', otherType);
        userRes = await fetch(`/api/profile/${otherType}?email=${currentUser.email}`);
        
        if (!userRes.ok) {
          const errorText = await userRes.text();
          console.error('❌ ContactButton: Erreur lors de la récupération du profil:', errorText);
          alert('Erreur lors de la récupération de votre profil. Veuillez vous reconnecter.');
          return;
        }
        
        // Mettre à jour le type d'utilisateur
        currentUser.type = otherType;
        console.log('🔍 ContactButton: Type d\'utilisateur corrigé:', currentUser.type);
      }
      
      const currentUserData = await userRes.json();
      console.log('🔍 ContactButton: Données utilisateur récupérées:', currentUserData);

      // Vérifier que l'utilisateur a un ID valide
      if (!currentUserData.id) {
        console.error('❌ ContactButton: ID utilisateur manquant');
        alert('Erreur: Impossible de récupérer votre identifiant');
        return;
      }

      console.log('🔍 ContactButton Debug:', {
        currentUserData,
        targetUserId,
        targetUserType,
        currentUserType: currentUser.type
      });

      // Vérifier que l'utilisateur ne contacte pas lui-même
      console.log('🔍 Vérification auto-contact:', {
        currentUserId: currentUserData.id,
        targetUserId: targetUserId,
        currentUserType: currentUser.type,
        targetUserType: targetUserType,
        currentUserIdType: typeof currentUserData.id,
        targetUserIdType: typeof targetUserId,
        areEqual: parseInt(currentUserData.id) === parseInt(targetUserId)
      });
      
      // Vérification plus robuste de l'auto-contact
      const currentUserId = parseInt(currentUserData.id);
      const targetUserIdInt = parseInt(targetUserId);
      
      // Seulement bloquer si c'est exactement le même utilisateur (même ID et même type)
      if (currentUserId === targetUserIdInt && currentUser.type === targetUserType) {
        console.log('❌ ContactButton: Tentative de contact avec soi-même');
        alert('Vous ne pouvez pas vous contacter vous-même');
        return;
      }

      // Déterminer la page de redirection selon le type d'utilisateur
      let redirectUrl;
      if (currentUser.type === 'entreprise') {
        redirectUrl = `/messages-entreprise/${targetUserId}?type=${targetUserType}`;
      } else if (currentUser.type === 'chercheur') {
        redirectUrl = `/messages-chercheur/${targetUserId}?type=${targetUserType}`;
      } else {
        // Fallback: essayer de déterminer le type basé sur l'email
        console.log('🔍 ContactButton: Type non déterminé, tentative de détection...');
        if (localStorage.getItem('entrepriseEmail')) {
          redirectUrl = `/messages-entreprise/${targetUserId}?type=${targetUserType}`;
        } else if (localStorage.getItem('chercheurEmail')) {
          redirectUrl = `/messages-chercheur/${targetUserId}?type=${targetUserType}`;
        } else {
          console.error('❌ ContactButton: Impossible de déterminer le type d\'utilisateur');
          alert('Erreur: Impossible de déterminer votre type d\'utilisateur. Veuillez vous reconnecter.');
          return;
        }
      }

      console.log('🔍 ContactButton - Redirection vers:', redirectUrl);
      window.location.href = redirectUrl;
      return; // Exit early since we're redirecting
    } catch (error) {
      console.error('❌ ContactButton: Erreur complète:', error);
      
      // Message d'erreur plus spécifique selon le type d'erreur
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      } else {
        alert('Erreur lors du contact. Veuillez réessayer plus tard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Chargement...' : children}
    </button>
  );
} 