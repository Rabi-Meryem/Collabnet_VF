'use client';
import { useState, useEffect } from 'react';

export default function DebugUser() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        console.log('🔍 Emails trouvés:', { chercheurEmail, entrepriseEmail });
        
        if (chercheurEmail) {
          try {
            const response = await fetch(`/api/profile/chercheur?email=${chercheurEmail}`);
            if (response.ok) {
              const userData = await response.json();
              setUserInfo({ ...userData, type: 'chercheur' });
              console.log('✅ Utilisateur chercheur:', userData);
            } else {
              const errorData = await response.text();
              console.error('❌ Erreur lors de la récupération du profil chercheur:', response.status, errorData);
            }
          } catch (error) {
            console.error('❌ Erreur réseau pour chercheur:', error);
          }
        } else if (entrepriseEmail) {
          try {
            const response = await fetch(`/api/profile/entreprise?email=${entrepriseEmail}`);
            if (response.ok) {
              const userData = await response.json();
              setUserInfo({ ...userData, type: 'entreprise' });
              console.log('✅ Utilisateur entreprise:', userData);
            } else {
              const errorData = await response.text();
              console.error('❌ Erreur lors de la récupération du profil entreprise:', response.status, errorData);
            }
          } catch (error) {
            console.error('❌ Erreur réseau pour entreprise:', error);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Utilisateur</h1>
      
      {userInfo ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-bold">Utilisateur connecté:</h2>
          <p>Type: {userInfo.type}</p>
          <p>ID: {userInfo.id}</p>
          <p>Email: {userInfo.email}</p>
          <p>Nom: {userInfo.fullName || userInfo.companyName}</p>
          
          <div className="mt-4">
            <h3 className="font-bold">localStorage:</h3>
            <p>chercheurEmail: {localStorage.getItem('chercheurEmail') || 'null'}</p>
            <p>entrepriseEmail: {localStorage.getItem('entrepriseEmail') || 'null'}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold">URL actuelle:</h3>
            <p>{typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-bold">Aucun utilisateur connecté</h2>
          <p>Veuillez vous connecter d'abord</p>
        </div>
      )}
    </div>
  );
} 