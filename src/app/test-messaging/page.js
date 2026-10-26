"use client";
import { useState } from 'react';
import { startConversation, getCurrentUserInfo, debugLocalStorage } from '../utils/messaging';

export default function TestMessaging() {
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState('');

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStep1 = () => {
    addLog('=== TEST ÉTAPE 1: Vérification localStorage ===');
    debugLocalStorage();
    addLog('localStorage vérifié');
  };

  const testStep2 = () => {
    addLog('=== TEST ÉTAPE 2: Récupération utilisateur connecté ===');
    const user = getCurrentUserInfo();
    if (user) {
      addLog(`Utilisateur trouvé: ${user.type} - ${user.email}`);
    } else {
      addLog('Aucun utilisateur connecté');
    }
  };

  const testStep3 = async () => {
    addLog('=== TEST ÉTAPE 3: Récupération profil utilisateur ===');
    const user = getCurrentUserInfo();
    if (!user) {
      addLog('❌ Pas d\'utilisateur connecté');
      return;
    }

    try {
      const res = await fetch(`/api/profile/${user.type}?email=${user.email}`);
      if (res.ok) {
        const data = await res.json();
        addLog(`✅ Profil récupéré: ID=${data.id}, Type=${user.type}`);
        return data;
      } else {
        addLog(`❌ Erreur récupération profil: ${res.status}`);
        return null;
      }
    } catch (error) {
      addLog(`❌ Erreur: ${error.message}`);
      return null;
    }
  };

  const testStep4 = async () => {
    addLog('=== TEST ÉTAPE 4: Test API start-with-redirect ===');
    const user = getCurrentUserInfo();
    if (!user) {
      addLog('❌ Pas d\'utilisateur connecté');
      return;
    }

    const userData = await testStep3();
    if (!userData) {
      addLog('❌ Impossible de récupérer les données utilisateur');
      return;
    }

    // Récupérer une entreprise de test directement depuis la base
    addLog('Récupération d\'une entreprise de test...');
    try {
      const entreprisesRes = await fetch('/api/entreprises');
      if (!entreprisesRes.ok) {
        addLog(`❌ Erreur récupération entreprises: ${entreprisesRes.status}`);
        return;
      }
      const entreprises = await entreprisesRes.json();
      if (!entreprises || entreprises.length === 0) {
        addLog('❌ Aucune entreprise trouvée');
        return;
      }
      const testEntreprise = entreprises[0];
      addLog(`✅ Entreprise de test trouvée: ID=${testEntreprise.id}`);
    } catch (error) {
      addLog(`❌ Erreur lors de la récupération des entreprises: ${error.message}`);
      return;
    }

    // Test avec une vraie entreprise
    try {
      const response = await fetch('/api/conversations/start-with-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: testEntreprise.id,
          targetUserType: 'entreprise'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ API start-with-redirect réussie: ${JSON.stringify(data)}`);
        setTestResult(JSON.stringify(data, null, 2));
      } else {
        const errorData = await response.json();
        addLog(`❌ Erreur API start-with-redirect: ${JSON.stringify(errorData)}`);
        setTestResult(JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      addLog(`❌ Erreur lors de l'appel API: ${error.message}`);
      setTestResult(`Erreur: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResult('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Système de Messagerie</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testStep1}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test 1: localStorage
        </button>
        
        <button 
          onClick={testStep2}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Test 2: Utilisateur
        </button>
        
        <button 
          onClick={testStep3}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          Test 3: Profil
        </button>
        
        <button 
          onClick={testStep4}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
        >
          Test 4: API
        </button>
        
        <button 
          onClick={clearLogs}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Effacer
        </button>
      </div>
      
      {logs.length > 0 && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Logs:</h2>
          <div className="max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">{log}</div>
            ))}
          </div>
        </div>
      )}
      
      {testResult && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Résultat:</h2>
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
    </div>
  );
} 