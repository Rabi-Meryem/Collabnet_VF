'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import NavbarChercheur from '../../nav-bar/NavbarChercheur';
import NavbarEntreprise from '../../nav-bar/NavbarEntreprise';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import ContactButton from '../../components/ContactButton';

export default function ArticleDetailsOther() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserType, setCurrentUserType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get connected user email and type
        const entrepriseEmail = localStorage.getItem('entrepriseEmail');
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        
        if (entrepriseEmail) {
          setCurrentUserEmail(entrepriseEmail);
          setCurrentUserType('entreprise');
        } else if (chercheurEmail) {
          setCurrentUserEmail(chercheurEmail);
          setCurrentUserType('chercheur');
        }

        // Get article
        const articleRes = await fetch(`/api/articles/${params.id}`);
        if (articleRes.ok) {
          const articleData = await articleRes.json();
          setArticle(articleData);
          
          // Get author information
          if (articleData.authorId) {
            const authorRes = await fetch(`/api/profile/chercheur?id=${articleData.authorId}`);
            if (authorRes.ok) {
              const authorData = await authorRes.json();
              setAuthor(authorData);
            }
          }
        } else {
          console.error('Error loading article');
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
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#0D102B] min-h-screen w-full text-white">
        {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-300">Article not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if connected user is article author (case insensitive)
  const isAuthor = currentUserEmail?.toLowerCase() === author?.email?.toLowerCase();

  return (
    <div className="bg-[#0D102B] min-h-screen w-full text-white">
      {currentUserType === 'entreprise' ? <NavbarEntreprise /> : <NavbarChercheur />}
      
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
          {article.title}
        </h1>
            <p className="text-gray-300 text-lg mb-6">
              {article.summary}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Research Domain</h3>
                <p className="text-gray-300">{article.researchDomain}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Publication Year</h3>
                <p className="text-gray-300">{article.publicationYear}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Key Concepts</h3>
                <p className="text-gray-300">{article.keyConcepts}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Publication Date</h3>
                <p className="text-gray-300">{article.createdAt && article.createdAt.slice(0,10)}</p>
        </div>
      </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Abstract</h3>
              <p className="text-gray-300">{article.summary}</p>
            </div>

            {article.image && article.image !== 'null' && article.image !== '' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Article Image</h3>
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <img
                  src={article.image}
                    alt="Article image"
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

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3994BA' }}>Content</h3>
              <div className="text-gray-300 whitespace-pre-wrap">{article.content}</div>
            </div>
          </div>

          {/* Author Info Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-[#1A1F3A] rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#3994BA' }}>Author Information</h3>
              
              {author && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200">Name</h4>
                    <p className="text-gray-300">{author.fullName}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-200">Email</h4>
                    <p className="text-gray-300">{author.email}</p>
                  </div>
                  
                  {author.position && (
                    <div>
                      <h4 className="font-semibold text-gray-200">Position</h4>
                      <p className="text-gray-300">{author.position}</p>
                    </div>
                  )}
                  
                  {author.department && (
                    <div>
                      <h4 className="font-semibold text-gray-200">Department</h4>
                      <p className="text-gray-300">{author.department}</p>
                    </div>
                  )}
                  
                  {author.description && (
                    <div>
                      <h4 className="font-semibold text-gray-200">About</h4>
                      <p className="text-gray-300">{author.description}</p>
                    </div>
                  )}
                  
                  {/* Contact Button */}
                  {!isAuthor && author && (
                    <ContactButton
                      targetUserId={author.id}
                      targetUserType="chercheur"
                      className="w-full bg-[#3994BA] text-white py-3 px-6 rounded-lg hover:bg-[#2E7A9A] transition-colors font-semibold"
                    >
                      Contact Author
                    </ContactButton>
                  )}
                  
                  {isAuthor && (
                    <div className="text-center py-3 px-6 bg-gray-700 rounded-lg">
                      <p className="text-gray-300">This is your article</p>
                    </div>
                  )}
                  
                  {currentUserType === 'chercheur' && !isAuthor && (
                    <div className="text-center py-3 px-6 bg-gray-700 rounded-lg">
                      <p className="text-gray-300">Researchers can contact other researchers</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}