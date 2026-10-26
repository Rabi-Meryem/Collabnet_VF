'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Navbar from '../../nav-bar/NavbarEntreprise';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';

export default function ProjectDetailsOwn() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects-entreprise/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
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
      fetchProject();
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
        
        <h1 className="text-4xl font-black mb-4 text-white">
          {project.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-300 mb-6">
          <span>Domain: {project.domain}</span>
          <span>•</span>
          <span>TRL: {project.trl}</span>
          <span>•</span>
          <span>Deadline: {project.deadline && project.deadline.slice(0,10)}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
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
                  No image
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

            {/* Deliverables */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Deliverables
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.deliverables}
              </p>
            </div>

            {/* Selection criteria */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Selection Criteria
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.selectionCriteria}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project information */}
            <div className="bg-[#1F1F5A] p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                Project Information
              </h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <strong>Domain:</strong> {project.domain}
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
                  <strong>Creation date:</strong> {project.createdAt && project.createdAt.slice(0,10)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#1F1F5A] p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/message-page"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition block text-center"
                >
                  Contact Candidates
                </Link>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                  Share
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