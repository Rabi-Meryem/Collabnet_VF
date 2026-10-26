'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../nav-bar/NavbarEntreprise";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaRegBookmark } from "react-icons/fa";
import Footer from "../components/Footer";
import ContactButton from "../components/ContactButton";
import { getCurrentUserInfo } from "../utils/messaging";

export default function HomePage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Charger les articles depuis ton API
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        if (chercheurEmail) {
          const response = await fetch(`/api/profile/chercheur?email=${chercheurEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
          }
        } else if (entrepriseEmail) {
          const response = await fetch(`/api/profile/entreprise?email=${entrepriseEmail}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUserId(userData.id);
          }
        }
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    };

    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        // S'assurer que data est un tableau
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des articles", error);
        setArticles([]);
      }
    };
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects-entreprise');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des projets", error);
        setProjects([]);
      }
    };
    
    getCurrentUserId();
    fetchArticles();
    fetchProjects();
  }, []);

  return (
    <div className="bg-white min-h-screen w-full">
      <Navbar />

      {/* Header avec image */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src="/homepic.jpg"
          alt="Header Image"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="animate-float"
        />
      </div>

      {/* Barre de recherche */}
      <div className="flex justify-center my-6">
        <div className="relative w-[80%] max-w-xl">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full px-4 py-2 border border-gray-300 bg-gray-100 pr-10"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* Articles dynamiques */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(articles) && articles.map((article) => {
          return (
          <div key={article.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden">
              <Image
                src={article.image || "/F2.webp"}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
              />
              <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                <FaRegBookmark className="text-gray-600" />
              </button>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-gray-800">{article.author?.fullName || "Auteur inconnu"}</p>
              <p className="text-gray-500">{article.researchDomain}</p>
            </div>
            <p className="text-gray-600">{article.summary}</p>
            <p className="text-gray-600 text-sm italic">{article.keyConcepts}</p>
            <p className="text-gray-600 text-sm">{article.publicationYear}</p>
            <div className="flex gap-3 mt-3">
              <Link 
                href={`/article-details-other/${article.id}`}
                className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
              >
                View Details
              </Link>
              <ContactButton 
                targetUserId={article.author?.id}
                targetUserType="chercheur"
              />
            </div>
          </div>
          );
        })}
        
        {/* Projets des entreprises */}
        {Array.isArray(projects) && projects.map((project) => (
          <div key={"project-"+project.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
            {/* Image du projet */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden">
              {project.attachments && project.attachments !== 'null' && project.attachments !== '' ? (
                <Image
                  src={`/uploads/${project.attachments}`}
                  alt={project.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${project.attachments && project.attachments !== 'null' && project.attachments !== '' ? 'hidden' : 'block'}`}>
                <p className="text-gray-500">Pas d'image</p>
              </div>
              <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                <FaRegBookmark className="text-gray-600" />
              </button>
            </div>
            
            {/* Infos du projet */}
            <div className="flex justify-between">
              <p className="font-semibold text-gray-800">{project.title}</p>
              <p className="text-gray-500">{project.domain}</p>
            </div>
            <p className="text-gray-600">{project.description && project.description.length > 100 ? 
              project.description.substring(0, 100) + '...' : 
              project.description
            }</p>
            <p className="text-gray-600 text-sm font-medium">Entreprise: {project.entrepriseName || 'Entreprise inconnue'}</p>
              
              <div className="flex gap-3 mt-3">
                <Link 
                  href={`/project-details-other/${project.id}`}
                  className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                >
                  View Details
                </Link>
                {project.entrepriseId && (
                  <ContactButton 
                    targetUserId={project.entrepriseId}
                    targetUserType="entreprise"
                  />
                )}
              </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
