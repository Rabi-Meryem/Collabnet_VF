'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../nav-bar/NavbarChercheur';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function ArticleDetailsOwner() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          console.error('Erreur lors du chargement de l\'article');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Article non trouvé</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#0D102B] min-h-screen w-full text-white">
      <Navbar />
      
      {/* Header */}
      <div className="px-8 pt-12 pb-6">
        <button 
          onClick={() => window.history.back()}
          className="mb-6 text-blue-400 hover:text-blue-300"
        >
          ← Retour
        </button>
        
        <h1 className="text-4xl font-black mb-4 text-white">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-300 mb-6">
          <span>Par: {article.author?.fullName || 'Auteur inconnu'}</span>
          <span>•</span>
          <span>Année: {article.publicationYear}</span>
          <span>•</span>
          <span>Domaine: {article.researchDomain}</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {article.image && (
              <div className="w-full h-64 bg-gray-800 rounded-2xl overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              </div>
            )}

            {/* Résumé */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Résumé
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Contenu détaillé */}
            {article.content && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Contenu détaillé
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Concepts clés */}
            {article.keyConcepts && (
              <div className="bg-[#1F1F5A] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Concepts clés
                </h3>
                <div className="text-gray-300">
                  {article.keyConcepts}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-[#1F1F5A] p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  Modifier l'article
                </button>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
                  Supprimer l'article
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                  Télécharger PDF
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 