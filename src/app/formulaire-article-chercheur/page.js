'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

const AddArticleForm = ({ initialData = null, onAdd = () => {}, onClose = () => {} }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    researchDomain: initialData?.researchDomain || "",
    keyConcepts: initialData?.keyConcepts || "",
    content: initialData?.content || "",
    publicationYear: initialData?.publicationYear || "",
    image: null,
    imagePreview: initialData?.imagePreview || null,
    authorId: null,
  });

  // Récupérer l'ID du chercheur connecté
  useEffect(() => {
    const getAuthorId = async () => {
      try {
        const chercheurEmail = localStorage.getItem('chercheurEmail');
        if (chercheurEmail) {
          const res = await fetch(`/api/profile/chercheur?email=${chercheurEmail}`);
          if (res.ok) {
            const profileData = await res.json();
            setForm(prev => ({ ...prev, authorId: profileData.id }));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du chercheur:', error);
      }
    };

    getAuthorId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.authorId) {
      alert("❌ Erreur: Impossible de récupérer l'ID du chercheur");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("researchDomain", form.researchDomain);
    formData.append("keyConcepts", form.keyConcepts);
    formData.append("content", form.content);
    formData.append("publicationYear", form.publicationYear);
    formData.append("authorId", form.authorId);
    if (form.image) formData.append("image", form.image);

    try {
      console.log('Envoi de l\'article avec authorId:', form.authorId);
      const res = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Échec de l'ajout");
      }

      const newArticle = await res.json();
      console.log('Article créé avec succès:', newArticle);
      onAdd(newArticle); // Envoie le nouvel article au parent
      alert("✅ Article ajouté avec succès !");
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      alert(`❌ Erreur: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-[#0F172A] text-white w-full max-w-lg p-8 rounded-xl space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">
          {initialData ? "Modifier l'article" : "Ajouter un article"}
        </h2>

        {/* Champs du formulaire (inchangés) */}
        <input type="text" name="title" placeholder="Titre" value={form.title} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" required />
        <textarea name="summary" placeholder="Résumé" value={form.summary} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" required />
        <input type="text" name="researchDomain" placeholder="Domaine de recherche" value={form.researchDomain} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" required />
        <input type="text" name="keyConcepts" placeholder="Concepts clés (séparés par des virgules)" value={form.keyConcepts} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" />
        <textarea name="content" placeholder="Contenu détaillé" value={form.content} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" />
        <input type="number" name="publicationYear" placeholder="Année de publication" value={form.publicationYear} onChange={handleChange} className="w-full p-3 rounded-md bg-[#252566] placeholder-gray-300" />
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />

        {form.imagePreview && (
          <img src={form.imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md" />
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold">
          {initialData ? "Enregistrer" : "Ajouter"}
        </button>
        <button type="button" onClick={onClose} className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-full">
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddArticleForm;