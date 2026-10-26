"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { FiBell, FiMessageSquare } from "react-icons/fi"; // Icônes modernes
import { useState, useEffect } from "react";

const NavbarEntreprise = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (typeof window !== 'undefined') {
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        
        if (entrepriseEmail) {
          try {
            const res = await fetch(`/api/profile/entreprise?email=${entrepriseEmail}`);
            if (res.ok) {
              const data = await res.json();
              setProfileData(data);
            }
          } catch (error) {
            console.error('Erreur chargement profil entreprise:', error);
          }
        }
      }
    };

    loadProfileData();
  }, []);

  const handleViewProfil = () => {
    router.push('/profile-page-entreprise');
  }
  
  const handleMessage = () => {
    router.push('/messages')
  }

  const handleSignOut = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('chercheurEmail');
    localStorage.removeItem('entrepriseEmail');
    // Rediriger vers la page de connexion
    router.push('/login-entreprise');
  }

  const getProfileImage = () => {
    if (profileData?.profileImage) {
      return `/uploads/${profileData.profileImage}`;
    }
    return "/profile-placeholder.svg";
  };

  const getProfileInitial = () => {
    if (profileData?.companyName) {
      return profileData.companyName.charAt(0).toUpperCase();
    }
    return 'E';
  };

  return (
    <nav style={{ borderBottom: "1px solid #ccc", backgroundColor: "#fff" }}>
      {/* Ligne bleue épaisse */}
      <div
        style={{
          height: "25px", // plus gros
          backgroundColor: "#002D62",
          width: "100%",
        }}
      ></div>

      {/* Contenu principal */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        {/* Logo et titre */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="CollabNet Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#002D62" }}>
            CollabNet
          </span>
        </div>

        {/* Menu + actions */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {["/", "/department", "/researchers", "/companies", "/contact"].map(
            (path, i) => (
              <Link key={i} href={path}>
                <span
                  style={{
                    margin: "0 10px",
                    color: "#000",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </span>
              </Link>
            )
          )}

          <button
            onClick={handleSignOut}
            style={{
              margin: "0 10px",
              padding: "5px 10px",
              backgroundColor: "#002D62",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>

          {/* Profil */}
          <div
          onClick={handleViewProfil}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
              overflow: "hidden",
              marginRight: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            title="User Profile"
          >
            <img
              src={getProfileImage()}
              alt="User Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span style={{ 
              color: "#002D62", 
              fontWeight: "bold",
              display: getProfileImage() === "/profile-placeholder.svg" ? 'flex' : 'none'
            }}>
              {getProfileInitial()}
            </span>
          </div>

          {/* Icône Notification */}
          <FiBell
            size={24}
            style={{ color: "#002D62", marginRight: "15px", cursor: "pointer" }}
            title="Notifications"
          />

          {/* Icône Message */}
          <FiMessageSquare
          onClick={handleMessage}
            size={24}
            style={{ color: "#002D62", cursor: "pointer" }}
            title="Messages"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavbarEntreprise; 