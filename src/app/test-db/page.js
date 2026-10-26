"use client";
import { useState } from 'react';

export default function TestDB() {
  const [result, setResult] = useState('');

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Base de Données</h1>
      
      <button 
        onClick={testDatabase}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Tester la connexion DB
      </button>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Résultat:</h2>
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
} 