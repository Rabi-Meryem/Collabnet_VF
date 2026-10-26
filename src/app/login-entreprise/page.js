'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginEntreprise() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '', // email ou téléphone
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/login/entreprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // Nettoyer le localStorage chercheur pour éviter les conflits
        localStorage.removeItem('chercheurEmail');
        // Stocker l'email dans le localStorage pour le Navbar
        if (formData.identifier.includes('@')) {
          localStorage.setItem('entrepriseEmail', formData.identifier);
        } else if (data.entrepriseEmail) {
          localStorage.setItem('entrepriseEmail', data.entrepriseEmail);
        }
        router.push('/home-page-En');
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      setError('Erreur de communication avec le serveur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D102B] text-white px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0D102B] rounded-xl p-8">
        {/* Form */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Login Entreprise</h1>
          <p className="text-gray-300">Pas encore de compte ? <a href="/signup-entreprise" className="underline">Créer un compte</a></p>
          <div className="grid grid-cols-1 gap-4">
            <input name="identifier" onChange={handleChange} className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" placeholder="Email ou numéro de téléphone" />
            <input name="password" type="password" onChange={handleChange} className="p-3 rounded-md bg-[#1F1F5A] placeholder-gray-400" placeholder="Mot de passe" />
          </div>
          {error && <div className="text-red-400">{error}</div>}
          <button 
            onClick={handleLogin}
            className="w-full bg-[#45B4D0] text-white font-semibold py-3 rounded-md hover:bg-[#3aa0b9] transition"
          >
            Se connecter
          </button>
        </div>
        {/* Image */}
        <div className="hidden md:block">
          <img
            src="/img cherch2.jpg"
            alt="Entreprise"
            className="rounded-xl object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
} 