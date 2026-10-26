'use client';
import { useState } from 'react';
import ContactButton from '../components/ContactButton';
import { getCurrentUserInfo, debugLocalStorage } from '../utils/messaging';

export default function TestContactPage() {
  const [debugInfo, setDebugInfo] = useState({});

  const runDebug = () => {
      const currentUser = getCurrentUserInfo();
      debugLocalStorage();
      
    setDebugInfo({
      currentUser,
      localStorage: {
        chercheurEmail: localStorage.getItem('chercheurEmail'),
        entrepriseEmail: localStorage.getItem('entrepriseEmail')
      }
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Contact</h1>
      
      <div className="mb-4">
        <button 
          onClick={runDebug}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Debug Info
        </button>
      </div>

      {debugInfo.currentUser && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Utilisateur connecté:</h2>
          <pre>{JSON.stringify(debugInfo.currentUser, null, 2)}</pre>
            </div>
      )}

      {debugInfo.localStorage && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">LocalStorage:</h2>
          <pre>{JSON.stringify(debugInfo.localStorage, null, 2)}</pre>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-bold mb-2">Test Contact Button:</h2>
        <ContactButton 
          targetUserId={1}
          targetUserType="chercheur"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Tester Contact
        </ContactButton>
      </div>
    </div>
  );
} 