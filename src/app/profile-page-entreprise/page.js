"use client";
import Navbar from "../nav-bar/NavbarEntreprise";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Footer from "../components/Footer";
import Link from "next/link";

export default function ProfilePageEntreprise() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const email = localStorage.getItem('entrepriseEmail');
        if (!email) {
          router.push('/login-entreprise');
          return;
        }
        const profileRes = await fetch(`/api/profile/entreprise?email=${email}`);
        const profile = await profileRes.json();
        setProfileData(profile);
        setForm(profile);
        if (profile.profileImage) setProfileImage(profile.profileImage);
        // Charger les projets de l'entreprise
        if (profile?.id) {
          const projectsRes = await fetch(`/api/projects-entreprise?entrepriseId=${profile.id}`);
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadData();
  }, []);

  // Recharger les projets quand le formulaire est fermé
  useEffect(() => {
    if (!showAddProjectForm && profileData?.id) {
      const reloadProjects = async () => {
        try {
          const res = await fetch(`/api/projects-entreprise?entrepriseId=${profileData.id}`);
          const data = await res.json();
          setProjects(data);
        } catch (err) {
          console.error("Erreur rechargement projets:", err);
        }
      };
      reloadProjects();
    }
  }, [showAddProjectForm, profileData]);

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
      formData.append('companyName', form.companyName);
      formData.append('position', form.position);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('department', form.department);
      formData.append('description', form.description);

      if (form.profileImageFile) {
        formData.append('profileImage', form.profileImageFile);
      }
      if (form.mediaFile) {
        formData.append('media', form.mediaFile);
      }

      const res = await fetch('/api/profile/entreprise', {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfileData(updatedProfile);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      setProjects(prev => [...prev, newProject]);
      setShowAddProjectForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`/api/projects-entreprise/${projectId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setProjects(prev => prev.filter(project => project.id !== projectId));
          alert('Project deleted successfully!');
        } else {
          alert('Error deleting project');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting project');
      }
    }
  };

  if (!profileData) return <div>Loading...</div>;

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
            {profileData.position || "Company"}
          </h2>
          {profileData.description && (
            <p className="mt-4 font-light" style={{ color: '#000000' }}>{profileData.description}</p>
          )}
          <div className="mt-6 flex items-center gap-4">
            <button
              className="bg-[#2E2A85] text-white px-6 py-2 rounded-full"
              onClick={() => setShowAddProjectForm(true)}
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
            onChange={handleProfileImageChange}
            className="hidden"
          />
          <label
            htmlFor="profileImageInput"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-white text-sm">Change Photo</span>
          </label>
        </div>
      </section>

      {/* About us section */}
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
              <h3 className="text-2xl font-light mb-4" style={{ color: '#252566' }}>About us</h3>
              <div className="space-y-2">
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Company Name :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.companyName}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Position :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.position || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Department :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.department || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Email :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.email}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Phone number :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.phoneNumber || 'Non spécifié'}</span></div>
                <div className="flex items-baseline"><span className="font-semibold" style={{ color: '#252566' }}>Description :</span><span className="ml-2 font-light" style={{ color: '#252566' }}>{profileData.description || 'Non spécifié'}</span></div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-2xl font-bold text-[#2E2A85] mb-4">Edit Profile</h3>
              <input
                type="text"
                name="companyName"
                value={form.companyName || ""}
                onChange={handleChange}
                placeholder="Company Name"
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
                type="text"
                name="department"
                value={form.department || ""}
                onChange={handleChange}
                placeholder="Department"
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
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#2E2A85] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>



      {/* Edit Form */}
      {isEditing && (
        <section className="px-8 pb-10">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#252566' }}>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={form.position || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={form.department || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media (Image/Video)</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Projects section */}
      <section className="px-8 pb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black" style={{ color: '#252566' }}>My projects</h2>
        </div>

        {showAddProjectForm && (
          <div className="mb-8">
            {/* Add Project Form Component would go here */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#252566' }}>Add New Project</h3>
              <p className="text-gray-600">Project form component would be integrated here</p>
              <button
                onClick={() => setShowAddProjectForm(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!Array.isArray(projects) || projects.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500">No projects published</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow-md flex flex-col justify-between cursor-pointer p-6"
                style={{ width: '307px', height: '480px', borderRadius: '40px' }}
              >
                {/* Image at top */}
                <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  {project.attachments ? (
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
                  <div className={`text-gray-500 ${project.attachments ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                    No image
                  </div>
                </div>

                {/* Project info */}
                <div className="text-gray-800 text-sm space-y-2 mb-4 w-full">
                  <div className="truncate block max-w-full font-semibold" style={{ color: '#252566' }}>{project.title}</div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    {project.description && project.description.length > 80 ? 
                      project.description.substring(0, 80) + '...' : 
                      project.description
                    }
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Domain: {project.domain}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    TRL: {project.trl}
                  </div>
                  <div className="truncate block max-w-full font-light" style={{ color: '#252566' }}>
                    Budget: {project.budgetMin} - {project.budgetMax}
                  </div>
                </div>

                {/* View Details and Contact buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link 
                    href={`/project-details-other/${project.id}`}
                    className="w-1/2 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                  >
                    View Details
                  </Link>
                  <div className="w-1/2 flex gap-1">
                  <button
                      onClick={() => {
                      setEditingProject(project);
                      setShowAddProjectForm(true);
                    }}
                      className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                      <FaEdit className="mx-auto" />
                  </button>
                  <button
                      onClick={() => handleDeleteProject(project.id)}
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