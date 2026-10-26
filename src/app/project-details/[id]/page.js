'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Navbar from '../../nav-bar/NavbarEntreprise';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Récupérer l'email de l'utilisateur connecté
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        setCurrentUserEmail(entrepriseEmail || chercheurEmail);

        // Récupérer le projet
        const projectRes = await fetch(`/api/projects-entreprise/${params.id}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
          
          // Récupérer les informations de l'entreprise
          const entrepriseRes = await fetch(`/api/profile/entreprise?email=${projectData.entrepriseEmail || ''}`);
          if (entrepriseRes.ok) {
            const entrepriseData = await entrepriseRes.json();
            setEntreprise(entrepriseData);
          }
        } else {
          console.error('Erreur lors du chargement du projet');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Projet non trouvé</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur connecté est l'auteur du projet
  const isAuthor = currentUserEmail === entreprise?.email;

  return (
    <div className="bg-[#0D102B] min-h-screen w-full text-white">
      <Navbar />
      
      {/* Header */}
      <div className="px-8 pt-12 pb-6">
        <button 
          onClick={() => router.back()}
          className="mb-6 text-blue-400 hover:text-blue-300"
        >
          ← Retour
        </button>
        
        <h1 className="text-4xl font-black mb-4 text-white">
          {project.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-300 mb-6">
          <span>Domaine: {project.domain}</span>
          <span>•</span>
          <span>TRL: {project.trl}</span>
          <span>•</span>
          <span>Deadline: {project.deadline && project.deadline.slice(0,10)}</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {project.attachments && project.attachments !== 'null' && project.attachments !== '' && (
              <div className="w-full h-64 bg-gray-800 rounded-2xl overflow-hidden">
                <img
                  src={`/uploads/${project.attachments}`}
                  alt={project.title}
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

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Livrables */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Livrables
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.deliverables}
              </p>
            </div>

            {/* Critères de sélection */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Critères de sélection
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.selectionCriteria}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations du projet */}
            <div className="bg-[#1F1F5A] p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                Informations du projet
              </h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <strong>Domaine:</strong> {project.domain}
                </div>
                <div>
                  <strong>TRL:</strong> {project.trl}
                </div>
                <div>
                  <strong>Budget:</strong> {project.budgetMin} - {project.budgetMax}
                </div>
                <div>
                  <strong>Deadline:</strong> {project.deadline && project.deadline.slice(0,10)}
                </div>
                <div>
                  <strong>Date de création:</strong> {project.createdAt && project.createdAt.slice(0,10)}
                </div>
              </div>
            </div>

            {/* À propos de l'entreprise (seulement si pas l'auteur) */}
            {!isAuthor && entreprise && (
              <div className="bg-[#1F1F5A] p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">
                  À propos de l'entreprise
                </h3>
                <div className="flex flex-col items-center space-y-4">
                  {/* Cercle avec image de profil */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {entreprise.profileImage ? (
                      <img
                        src={`/uploads/${entreprise.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`text-gray-400 text-2xl font-bold ${entreprise.profileImage ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      {entreprise.companyName ? entreprise.companyName.charAt(0).toUpperCase() : 'E'}
                    </div>
                  </div>
                  
                  {/* Nom de l'entreprise */}
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">{entreprise.companyName}</p>
                    <p className="text-gray-300 text-sm">{entreprise.position}</p>
                  </div>
                  
                  {/* Bouton View Profile */}
                  <Link 
                    href={`/profile-page-entreprise?email=${entreprise.email}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition block text-center"
                  >
                    View Profile
                  </Link>
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
                  Postuler au projet
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                  Contacter l'entreprise
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