"use client";
export const dynamic = "force-dynamic";

import Navbar from "../nav-bar/NavbarChercheur";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddArticleForm from "../formulaire-article-chercheur/page";
import Footer from "../components/Footer";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({});

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const email = localStorage.getItem('chercheurEmail');
        if (!email) {
          router.push('/login-chercheur');
          return;
        }
        // Charger le profil
        const profileRes = await fetch(`/api/profile/chercheur?email=${email}`);
        const profile = await profileRes.json();
        setProfileData(profile);
        setForm(profile);
        if (profile.profileImage) setProfileImage(profile.profileImage);

        // Charger les articles
        if (profile?.id) {
          const articlesRes = await fetch(`/api/articles?authorId=${profile.id}`);
          const articlesData = await articlesRes.json();
          setArticles(articlesData);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    loadData();
  }, []);

  // Recharger les articles quand le formulaire est fermé
  useEffect(() => {
    if (!showAddArticleForm && profileData?.id) {
      const reloadArticles = async () => {
        try {
          const res = await fetch(`/api/articles?authorId=${profileData.id}`);
          const data = await res.json();
          setArticles(data);
        } catch (err) {
          console.error("Erreur rechargement articles:", err);
        }
      };
      reloadArticles();
    }
  }, [showAddArticleForm, profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('✅ Fichier image de profil sélectionné:', file.name, file.type);
      setProfileImage(URL.createObjectURL(file));
      setForm(prev => ({ ...prev, profileImageFile: file }));
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('✅ Fichier média sélectionné:', file.name, file.type);
      setMedia(URL.createObjectURL(file));
      setMediaType(file.type.startsWith("video") ? "video" : "image");
      setForm(prev => ({ ...prev, mediaFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('fullName', form.fullName);
      formData.append('universityORreaserchLAB', form.universityORreaserchLAB);
      formData.append('position', form.position);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('department', form.department);
      formData.append('cv', form.cv);
      formData.append('spokenLanguages', form.spokenLanguages);
      formData.append('description', form.description);
      formData.append('keySkills', form.keySkills);
      
      // Ajouter les fichiers s'ils existent
      if (form.profileImageFile) {
        formData.append('profileImageFile', form.profileImageFile);
        console.log('✅ Fichier image de profil ajouté au FormData:', form.profileImageFile.name);
      }
      if (form.mediaFile) {
        formData.append('mediaFile', form.mediaFile);
        console.log('✅ Fichier média ajouté au FormData:', form.mediaFile.name);
      }
      
      console.log('Envoi des données chercheur:', {
        email: form.email,
        name: form.name,
        hasProfileImage: !!form.profileImageFile,
        hasMedia: !!form.mediaFile
      });

      const res = await fetch("/api/profile/chercheur", {
        method: "PUT",
        body: formData,
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Erreur lors de la mise à jour");

      console.log('Profil chercheur mis à jour:', updated);
      setProfileData(updated);
      setIsEditing(false);
      
      // Recharger les données du profil
      const email = localStorage.getItem('chercheurEmail');
      if (email) {
        const profileRes = await fetch(`/api/profile/chercheur?email=${email}`);
        const profile = await profileRes.json();
        console.log('Profil rechargé:', profile);
        setProfileData(profile);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert(err.message);
    }
  };

  const handleAddArticle = async (newArticle) => {
    console.log('✅ Article ajouté, rechargement des articles...');
    // Recharger les articles depuis le serveur
    await loadArticles();
  };

  const handleDeleteArticle = async (articleId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('✅ Article supprimé avec succès !');
          await loadArticles(); // Recharger la liste
        } else {
          const errorData = await res.json();
          alert(`❌ Erreur: ${errorData.error || 'Erreur lors de la suppression'}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression de l\'article');
      }
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const loadArticles = async () => {
    try {
      const chercheurEmail = localStorage.getItem('chercheurEmail');
      if (!chercheurEmail) {
        console.log('❌ Pas d\'email chercheur trouvé');
        return;
      }

      console.log('🔄 Chargement des articles pour:', chercheurEmail);
      const res = await fetch(`/api/profile/chercheur?email=${chercheurEmail}`);
      if (res.ok) {
        const profileData = await res.json();
        const authorId = profileData.id;
        console.log('📝 ID du chercheur:', authorId);
        
        const articlesRes = await fetch(`/api/articles?authorId=${authorId}`);
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          console.log('📄 Articles chargés:', articlesData.length);
          setArticles(articlesData);
        } else {
          console.error('❌ Erreur lors du chargement des articles');
        }
      } else {
        console.error('❌ Erreur lors du chargement du profil');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des articles:', error);
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar />
      {showAddArticleForm && (
        <AddArticleForm
          onAdd={handleAddArticle}
          onClose={() => setShowAddArticleForm(false)}
          editingArticle={editingArticle}
          onArticleSaved={() => {
            setShowAddArticleForm(false);
            setEditingArticle(null);
            loadArticles();
          }}
        />
      )}
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-center px-8 pt-12 pb-6">
        <div className="md:w-1/2">
          <p className="text-sm font-extralight mb-1" style={{ color: '#252566' }}>Welcome to my world</p>
          <h1 className="text-4xl font-black" style={{ color: '#252566' }}>
            Hi, I'm <span className="font-black" style={{ color: '#3994BA' }}>{profileData.fullName}</span>
          </h1>
          <h2 className="text-2xl font-semibold text-[#2E2A85] mt-2">
            {profileData.position || "Chercheur"}
          </h2>
          {profileData.description && (
            <p className="mt-4 font-light" style={{ color: '#000000' }}>{profileData.description}</p>
          )}
          <div className="mt-6 flex items-center gap-4">
            <button
              className="bg-[#2E2A85] text-white px-6 py-2 rounded-full"
              onClick={() => {
                setShowAddArticleForm(true);
                setEditingArticle(null);
              }}
            >
              ADD
            </button>
            <button
              className="bg-[#2E2A85] text-white px-6 py-2 rounded-full ml-4 flex items-center"
              onClick={() => setIsEditing(true)}
              >
              Edit
            </button>
          </div>
        </div>
        <div className="md:w-[300px] h-[400px] border-4 border-gray-100 p-2 relative">
          {profileData.profileImage ? (
            <Image
              src={`/uploads/${profileData.profileImage}`}
              alt="Profile"
              width={300}
              height={400}
              className="object-cover"
              onError={(e) => {
                console.log('❌ Erreur chargement image profil:', profileData.profileImage);
                e.target.src = "/profile-placeholder.svg";
              }}
            />
          ) : (
          <Image
              src="/profile-placeholder.svg"
            alt="Profile"
            width={300}
            height={400}
            className="object-cover"
          />
          )}
          <input
            type="file"
            accept="image/*"
            id="profileImageInput"
            className="hidden"
            onChange={handleProfileImageChange}
          />
          <button
            onClick={() => document.getElementById("profileImageInput").click()}
            className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold"
            title="Upload Profile Image"
          >
            +
          </button>
        </div>
      </section>
      {/* About me section */}
      <section className="px-8 py-10 flex gap-10">
        <div className="w-[300px] h-[400px] border-4 border-gray-100 flex items-center justify-center relative">
          {profileData.media ? (
            profileData.media.includes('.mp4') || profileData.media.includes('.avi') || profileData.media.includes('.mov') ? (
              <video controls className="w-full h-full object-cover">
                <source src={`/uploads/${profileData.media}`} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={`/uploads/${profileData.media}`} 
                alt="Uploaded Media" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('❌ Erreur chargement média:', profileData.media);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            )
          ) : null}
          <label className={`cursor-pointer text-center text-gray-500 ${profileData.media ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
              Upload image/video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaChange}
              />
            </label>
        </div>
        <div className="flex-1">
          {!isEditing ? (
            <>
              <h3 className="text-2xl font-light mb-4" style={{ color: '#252566' }}>About me</h3>
              <div className="space-y-2">
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Full Name :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.fullName}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>University/Lab :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.universityORreaserchLAB || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Position :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.position || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Email :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.email}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Phone number :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.phoneNumber || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Department :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.department || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>CV :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.cv || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Languages :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.spokenLanguages || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Key Skills :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.keySkills || 'Non spécifié'}</span></div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-2xl font-bold text-[#2E2A85] mb-4">Edit Profile</h3>
              <input
                type="text"
                name="fullName"
                value={form.fullName || ""}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="universityORreaserchLAB"
                value={form.universityORreaserchLAB || ""}
                onChange={handleChange}
                placeholder="University OR Research Lab"
                className="w-full p-2 border rounded"
                required
                  />
              <input
                type="text"
                name="position"
                value={form.position || ""}
                onChange={handleChange}
                placeholder="Position"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
                disabled
              />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="department"
                value={form.department || ""}
                onChange={handleChange}
                placeholder="Department"
                className="w-full p-2 border rounded"
                required
                  />
              <input
                type="text"
                name="cv"
                value={form.cv || ""}
                onChange={handleChange}
                placeholder="CV (lien ou nom de fichier)"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="spokenLanguages"
                value={form.spokenLanguages || ""}
                onChange={handleChange}
                placeholder="Spoken Languages"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="keySkills"
                value={form.keySkills || ""}
                onChange={handleChange}
                placeholder="Key Skills"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows="3"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#2E2A85] text-white px-6 py-2 rounded-full"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setForm(profileData);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      {/* Articles section */}
      <section className="px-8 pb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black" style={{ color: '#3994BA' }}>My articles</h2>
        </div>

        {showAddArticleForm && (
          <div className="mb-8">
            <AddArticleForm
              onArticleAdded={handleAddArticle}
              onClose={() => setShowAddArticleForm(false)}
              editingArticle={editingArticle}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!Array.isArray(articles) || articles.length === 0 ? (
            <p className="text-center col-span-3 text-gray-400">No articles published</p>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
                className="bg-white shadow-md flex flex-col justify-between cursor-pointer p-6"
                style={{ width: '307px', height: '480px', borderRadius: '40px' }}
            >
                {/* Image at top */}
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
                    No image
              </div>
                </div>

                {/* Article info */}
                <div className="text-gray-800 text-sm space-y-2 mb-4 w-full">
                  <div className="truncate block max-w-full font-semibold" style={{ color: '#252566' }}>{article.title}</div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    {article.summary && article.summary.length > 80 ? 
                      article.summary.substring(0, 80) + '...' : 
                      article.summary
                    }
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Domain: {article.researchDomain}
                </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Concepts: {article.keyConcepts && article.keyConcepts.length > 50 ? 
                      article.keyConcepts.substring(0, 50) + '...' : 
                      article.keyConcepts
                    }
                </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Year: {article.publicationYear}
                  </div>
              </div>

                {/* View Details and Contact buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link 
                    href={`/article-details-other/${article.id}`}
                    className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                  >
                    View Details
                  </Link>
                  <div className="w-1/2 flex gap-1">
                <button
                      onClick={() => {
                    setEditingArticle(article);
                    setShowAddArticleForm(true);
                  }}
                      className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                      <FaEdit className="mx-auto" />
                </button>
                <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="flex-1 border border-red-300 rounded-full py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                    >
                      <FaTrash className="mx-auto" />
                </button>
                  </div>
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
