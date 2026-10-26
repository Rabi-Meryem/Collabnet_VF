"use client";
import Navbar from "../nav-bar/NavbarChercheur";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaRegBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import ContactButton from "../components/ContactButton";

export default function HomePage() {
     const [projects, setProjects] = useState([]);

  const handleViewDetails = () => {
    // Ici tu pourrais aussi valider le formulaire avant
    // router.push('/details-page') // remplace par le bon chemin
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects-entreprise');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Erreur lors du chargement des projets", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    
    <div className="bg-white min-h-screen w-full">
    <Navbar /> {/* ✅ Navbar ajoutée ici */}

      {/* Header avec image en haut */}
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

      {/* Projets des entreprises */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
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
            <p className="text-gray-600 text-sm">TRL: {project.trl}</p>
            <p className="text-gray-600 text-sm">Budget: {project.budgetMin} - {project.budgetMax}</p>
            <p className="text-gray-600 text-sm">Deadline: {project.deadline && project.deadline.slice(0,10)}</p>
            <p className="text-gray-600 text-sm">Livrables: {project.deliverables && project.deliverables.length > 50 ? 
              project.deliverables.substring(0, 50) + '...' : 
              project.deliverables
            }</p>
            <p className="text-gray-600 text-sm">Critères: {project.selectionCriteria && project.selectionCriteria.length > 50 ? 
              project.selectionCriteria.substring(0, 50) + '...' : 
              project.selectionCriteria
            }</p>
              
              <div className="flex gap-3 mt-3">
                <Link 
                  href={`/project-details-other/${project.id}`}
                  className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                >
                  View Details
                </Link>
                <ContactButton 
                  targetUserId={project.entrepriseId}
                  targetUserType="entreprise"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">Aucun projet disponible pour le moment</p>
            <p className="text-gray-400 text-sm mt-2">Les entreprises publieront bientôt leurs projets ici</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
