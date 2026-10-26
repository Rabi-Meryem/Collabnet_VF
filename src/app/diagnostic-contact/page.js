'use client';
import { useState, useEffect } from 'react';
import { getCurrentUserInfo } from '../utils/messaging';

export default function DiagnosticContactPage() {
  const [diagnostic, setDiagnostic] = useState({});
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results = {};

    try {
      // 1. Vérifier l'utilisateur connecté
      console.log('🔍 Diagnostic: Vérification utilisateur connecté');
      const currentUser = getCurrentUserInfo();
      results.currentUser = currentUser;
      console.log('✅ Diagnostic: Utilisateur:', currentUser);

      if (!currentUser) {
        results.error = 'Aucun utilisateur connecté';
        setDiagnostic(results);
        setLoading(false);
        return;
      }

      // 2. Tester l'API de profil
      console.log('🔍 Diagnostic: Test API profil');
      const profileRes = await fetch(`/api/profile/${currentUser.type}?email=${currentUser.email}`);
      results.profileApi = {
        status: profileRes.status,
        ok: profileRes.ok
      };
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        results.profileData = profileData;
        console.log('✅ Diagnostic: Profil récupéré:', profileData);
      } else {
        const errorText = await profileRes.text();
        results.profileError = errorText;
        console.error('❌ Diagnostic: Erreur profil:', errorText);
      }

      // 3. Tester l'API de base de données
      console.log('🔍 Diagnostic: Test API DB');
      const dbRes = await fetch('/api/test-db');
      results.dbApi = {
        status: dbRes.status,
        ok: dbRes.ok
      };
      
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        results.dbData = dbData;
        console.log('✅ Diagnostic: DB OK:', dbData);
      } else {
        const errorText = await dbRes.text();
        results.dbError = errorText;
        console.error('❌ Diagnostic: Erreur DB:', errorText);
      }

      // 4. Tester l'API de conversation avec des données de test
      if (results.profileData && results.dbData?.exemples?.chercheurs?.length > 0) {
        console.log('🔍 Diagnostic: Test API conversation');
        const testChercheur = results.dbData.exemples.chercheurs[0];
        const testEntreprise = results.dbData.exemples.entreprises[0];
        
        if (testChercheur && testEntreprise) {
          const conversationRes = await fetch('/api/conversations/start-with-redirect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentUserId: results.profileData.id,
              currentUserType: currentUser.type,
              targetUserId: currentUser.type === 'chercheur' ? testEntreprise.id : testChercheur.id,
              targetUserType: currentUser.type === 'chercheur' ? 'entreprise' : 'chercheur'
            })
          });
          
          results.conversationApi = {
            status: conversationRes.status,
            ok: conversationRes.ok
          };
          
          if (conversationRes.ok) {
            const conversationData = await conversationRes.json();
            results.conversationData = conversationData;
            console.log('✅ Diagnostic: Conversation créée:', conversationData);
          } else {
            const errorText = await conversationRes.text();
            results.conversationError = errorText;
            console.error('❌ Diagnostic: Erreur conversation:', errorText);
          }
        }
      }

    } catch (error) {
      console.error('❌ Diagnostic: Erreur générale:', error);
      results.generalError = error.message;
    }

    setDiagnostic(results);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Diagnostic Contact</h1>
      
      <button 
        onClick={runDiagnostic}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-6 disabled:opacity-50"
      >
        {loading ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
      </button>

      {Object.keys(diagnostic).length > 0 && (
        <div className="space-y-6">
          {diagnostic.error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <h2 className="font-bold text-red-800">Erreur principale:</h2>
              <p className="text-red-700">{diagnostic.error}</p>
            </div>
          )}

          {diagnostic.currentUser && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <h2 className="font-bold text-green-800">Utilisateur connecté:</h2>
              <pre className="text-sm">{JSON.stringify(diagnostic.currentUser, null, 2)}</pre>
            </div>
          )}

          {diagnostic.profileApi && (
            <div className={`p-4 border rounded ${diagnostic.profileApi.ok ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
              <h2 className="font-bold">API Profil:</h2>
              <p>Status: {diagnostic.profileApi.status}</p>
              {diagnostic.profileData && (
                <pre className="text-sm mt-2">{JSON.stringify(diagnostic.profileData, null, 2)}</pre>
              )}
              {diagnostic.profileError && (
                <p className="text-red-700">{diagnostic.profileError}</p>
              )}
            </div>
          )}

          {diagnostic.dbApi && (
            <div className={`p-4 border rounded ${diagnostic.dbApi.ok ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
              <h2 className="font-bold">API Base de données:</h2>
              <p>Status: {diagnostic.dbApi.status}</p>
              {diagnostic.dbData && (
                <pre className="text-sm mt-2">{JSON.stringify(diagnostic.dbData, null, 2)}</pre>
              )}
              {diagnostic.dbError && (
                <p className="text-red-700">{diagnostic.dbError}</p>
              )}
            </div>
          )}

          {diagnostic.conversationApi && (
            <div className={`p-4 border rounded ${diagnostic.conversationApi.ok ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
              <h2 className="font-bold">API Conversation:</h2>
              <p>Status: {diagnostic.conversationApi.status}</p>
              {diagnostic.conversationData && (
                <pre className="text-sm mt-2">{JSON.stringify(diagnostic.conversationData, null, 2)}</pre>
              )}
              {diagnostic.conversationError && (
                <p className="text-red-700">{diagnostic.conversationError}</p>
              )}
            </div>
          )}

          {diagnostic.generalError && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <h2 className="font-bold text-red-800">Erreur générale:</h2>
              <p className="text-red-700">{diagnostic.generalError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 