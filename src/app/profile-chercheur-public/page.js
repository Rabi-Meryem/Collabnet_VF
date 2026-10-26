
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../nav-bar/NavbarEntreprise";
import Footer from "../components/Footer";
import ContactButton from "../components/ContactButton";

export default function ProfileChercheurPublic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const email = searchParams.get('email');
        if (!email) {
          console.error('Email manquant');
          return;
        }

        // Charger les données du profil
        const profileRes = await fetch(`/api/profile/chercheur?email=${email}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
          
          // Charger les articles du chercheur
          const articlesRes = await fetch(`/api/articles?authorId=${data.id}`);
          if (articlesRes.ok) {
            const articlesData = await articlesRes.json();
            setArticles(articlesData);
          }
        } else {
          console.error('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white min-h-screen w-full">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Profil non trouvé</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar />

      {/* Header avec image de fond */}
      <div className="relative w-full h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Section profil */}
      <section className="px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Image de profil */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={`/uploads/${profileData.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`text-gray-500 text-4xl font-bold ${profileData.profileImage ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                  {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'C'}
                </div>
              </div>
            </div>

            {/* Informations du profil */}
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-2" style={{ color: '#252566' }}>
                Hi, I'm {profileData.fullName}
              </h1>
              {profileData.description && (
                <p className="text-gray-600 mb-4">{profileData.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Position</p>
                  <p className="font-semibold" style={{ color: '#252566' }}>{profileData.position}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Department</p>
                  <p className="font-semibold" style={{ color: '#252566' }}>{profileData.department}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold" style={{ color: '#252566' }}>{profileData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone Number</p>
                  <p className="font-semibold" style={{ color: '#252566' }}>{profileData.phoneNumber}</p>
                </div>
              </div>

              {/* Bouton Contact */}
              <ContactButton
                targetUserId={profileData.id}
                targetUserType="chercheur"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Contact
              </ContactButton>
            </div>
          </div>
        </div>
      </section>

      {/* Section About me */}
      <section className="px-8 pb-10">
        <h2 className="text-center text-3xl font-black mb-8" style={{ color: '#252566' }}>About me</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 leading-relaxed">
            {profileData.description || "Aucune description disponible."}
          </p>
        </div>
      </section>

      {/* Section Media */}
      <section className="px-8 pb-10">
        <h2 className="text-center text-3xl font-black mb-8" style={{ color: '#252566' }}>Media</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#252566' }}>Image</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={`/uploads/${profileData.profileImage}`}
                    alt="Media"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`text-gray-500 ${profileData.profileImage ? 'hidden' : 'flex'} items-center justify-center`}>
                  Pas d'image
                </div>
              </div>
            </div>

            {/* Video */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#252566' }}>Video</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                {profileData.media ? (
                  <video
                    src={`/uploads/${profileData.media}`}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-500">Pas de vidéo</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section articles */}
      <section className="px-8 pb-10">
        <h2 className="text-center text-3xl font-black mb-8" style={{ color: '#252566' }}>My articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!Array.isArray(articles) || articles.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500">Aucun article publié</p>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-white shadow-md flex flex-col justify-between cursor-pointer p-6"
                style={{ width: '307px', height: '480px', borderRadius: '40px' }}
              >
                {/* Image en haut */}
                <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`text-gray-500 ${article.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                    Pas d'image
                  </div>
                </div>

                {/* Infos article */}
                <div className="text-gray-800 text-sm space-y-2 mb-4 w-full">
                  <div className="truncate block max-w-full font-semibold" style={{ color: '#252566' }}>{article.title}</div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    {article.summary && article.summary.length > 80 ? 
                      article.summary.substring(0, 80) + '...' : 
                      article.summary
                    }
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Domaine: {article.researchDomain}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Concepts: {article.keyConcepts && article.keyConcepts.length > 50 ? 
                      article.keyConcepts.substring(0, 50) + '...' : 
                      article.keyConcepts
                    }
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Année: {article.publicationYear}
                  </div>
                </div>

                {/* Boutons View Details et Contact */}
                <div className="flex gap-2 mt-auto">
                  <Link 
                    href={`/article-details-other/${article.id}`}
                    className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                  >
                    View Details
                  </Link>
                  <ContactButton 
                    targetUserId={profileData.id}
                    targetUserType="chercheur"
                    className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    Contact
                  </ContactButton>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}