"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "../nav-bar/NavbarChercheur";
import Footer from "../components/Footer";
import ContactButton from "../components/ContactButton";
import Image from "next/image";
import Link from "next/link";

export default function ProfileEntreprisePublic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
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
        const profileRes = await fetch(`/api/profile/entreprise?email=${email}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
          
          // Charger les projets de l'entreprise
          const projectsRes = await fetch(`/api/projects-entreprise?entrepriseId=${data.id}`);
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setProjects(projectsData);
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

      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-center px-8 pt-12 pb-6">
        <div className="md:w-1/2">
          <p className="text-sm font-extralight mb-1" style={{ color: '#252566' }}>Welcome to my world</p>
          <h1 className="text-4xl font-black" style={{ color: '#252566' }}>
            Hi, I'm <span className="font-black" style={{ color: '#3994BA' }}>{profileData.companyName}</span>
          </h1>
          <h2 className="text-2xl font-semibold text-[#2E2A85] mt-2">
            {profileData.position || "Entreprise innovante"}
          </h2>
          <p className="mt-4 font-light" style={{ color: '#000000' }}>{profileData.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <ContactButton
              targetUserId={profileData.id}
              targetUserType="entreprise"
              className="bg-[#2E2A85] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Contact
            </ContactButton>
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
        </div>
      </section>

      {/* About me Section */}
      <section className="px-8 pb-10">
        <h2 className="text-center text-3xl font-black mb-8" style={{ color: '#252566' }}>About me</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 leading-relaxed">
            {profileData.description || "Aucune description disponible."}
          </p>
        </div>
      </section>

      {/* Media Section */}
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

      {/* Section projets */}
      <section className="px-8 pb-10">
        <h2 className="text-center text-3xl font-black mb-8" style={{ color: '#252566' }}>My projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!Array.isArray(projects) || projects.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500">Aucun projet publié</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow-md flex flex-col justify-between cursor-pointer p-6"
                style={{ width: '307px', height: '480px', borderRadius: '40px' }}
              >
                {/* Image en haut */}
                <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  {project.attachments && project.attachments !== 'null' && project.attachments !== '' ? (
                    <img
                      src={`/uploads/${project.attachments}`}
                      alt={project.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`text-gray-500 ${project.attachments && project.attachments !== 'null' && project.attachments !== '' ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                    Pas d'image
                  </div>
                </div>

                {/* Infos projet */}
                <div className="text-gray-800 text-sm space-y-2 mb-4 w-full">
                  <div className="truncate block max-w-full font-semibold" style={{ color: '#252566' }}>{project.title}</div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    {project.description && project.description.length > 80 ? 
                      project.description.substring(0, 80) + '...' : 
                      project.description
                    }
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Domaine: {project.domain}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    TRL: {project.trl}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Budget: {project.budgetMin} - {project.budgetMax}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Deadline: {project.deadline && project.deadline.slice(0,10)}
                  </div>
                </div>

                {/* Boutons View Details et Contact */}
                <div className="flex gap-2 mt-auto">
                  <Link 
                    href={`/project-details-other/${project.id}`}
                    className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                  >
                    View Details
                  </Link>
                  <ContactButton 
                    targetUserId={profileData.id}
                    targetUserType="entreprise"
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
