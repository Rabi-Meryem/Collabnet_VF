'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Navbar from '../../nav-bar/NavbarChercheur';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import ContactButton from '../../components/ContactButton';

export default function ProjectDetailsOther() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get connected user email
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        setCurrentUserEmail(entrepriseEmail || chercheurEmail);

        // Get project
        const projectRes = await fetch(`/api/projects-entreprise/${params.id}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
          
          // Get company information
          if (projectData.entrepriseId) {
            const entrepriseRes = await fetch(`/api/profile/entreprise?id=${projectData.entrepriseId}`);
            if (entrepriseRes.ok) {
              const entrepriseData = await entrepriseRes.json();
              setEntreprise(entrepriseData);
            }
          }
        } else {
          console.error('Error loading project');
        }
      } catch (error) {
        console.error('Error:', error);
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
          <p className="text-gray-300">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Project not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if connected user is project author
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
          ← Back
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-black mb-4" style={{ color: '#3994BA' }}>
              {project.title}
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              {project.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Domain</h3>
                <p className="text-gray-300">{project.domain}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>TRL Level</h3>
                <p className="text-gray-300">{project.trl}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Budget Range</h3>
                <p className="text-gray-300">{project.budgetMin} - {project.budgetMax}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Deadline</h3>
                <p className="text-gray-300">{project.deadline && project.deadline.slice(0,10)}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Deliverables</h3>
              <p className="text-gray-300">{project.deliverables}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Selection Criteria</h3>
              <p className="text-gray-300">{project.selectionCriteria}</p>
            </div>

            {project.attachments && project.attachments !== 'null' && project.attachments !== '' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Attachments</h3>
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <img
                    src={`/uploads/${project.attachments}`}
                    alt="Project attachment"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="text-gray-500 hidden">No image available</div>
                </div>
              </div>
            )}
          </div>

          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#3994BA' }}>Company Information</h3>
              
              {entreprise && (
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                      {entreprise.profileImage ? (
                        <img
                          src={`/uploads/${entreprise.profileImage}`}
                          alt="Company profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {entreprise.companyName ? entreprise.companyName.charAt(0).toUpperCase() : 'C'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{entreprise.companyName}</h4>
                      <p className="text-gray-300 text-sm">{entreprise.position}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{entreprise.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">{entreprise.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white ml-2">{entreprise.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href={`/profile-entreprise-public?email=${entreprise?.email}`}
                  className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition block text-center"
                >
                  View Profile
                </Link>
                
                {!isAuthor && entreprise && (
                  <ContactButton 
                    targetUserId={entreprise.id}
                    targetUserType="entreprise"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition block text-center"
                  >
                    Contact Company
                  </ContactButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 