"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ArticleDetails() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  let article = null;

  try {
    article = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
  } catch (e) {
    console.error("Erreur parsing article data", e);
  }

  if (!article) {
    return <div>Aucun article trouvé</div>;
  }

  return (
    <div style={{ backgroundColor: '#0e1626', color: 'white', padding: '2rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: '960px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{article.title}</h1>
      <p style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '2rem', maxWidth: '520px' }}>
        {article.summary}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        {article.imagePreview ? (
          <img
            src={article.imagePreview}
            alt={article.title}
            style={{ width: 600, height: 180, borderRadius: '50px', objectFit: 'cover' }}
          />
        ) : (
          <p>Pas d'image disponible</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
        <section style={{ flex: 1 }}>
          <h2 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1rem' }}>Domaine de recherche</h2>
          <p style={{ fontWeight: '300', lineHeight: '1.5', marginBottom: '1.5rem' }}>{article.researchDomain}</p>

          <h2 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1rem' }}>Contenu</h2>
          <p style={{ fontWeight: '300', marginBottom: '2rem' }}>{article.content}</p>

          <h2 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1rem' }}>Année de publication</h2>
          <p style={{ fontWeight: '300', marginBottom: '2rem' }}>{article.publicationYear}</p>
        </section>

        <section style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ marginTop: '2.5rem', fontWeight: '700', fontSize: '1.3rem' }}>
            Chercheur
          </div>
          <div
            aria-label="Chercheur Profile Picture Placeholder"
            style={{
              width: '96px',
              height: '96px',
              backgroundColor: 'white',
              borderRadius: '50%',
              margin: '1rem auto',
            }}
          />
          <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {/* Ici tu peux mettre le nom du chercheur, par ex si tu passes */}
            {article.chercheurName || "Nom du chercheur"}
          </div>

          <button
            style={{
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'block',
              margin: '0 auto',
              width: 'fit-content',
            }}
            type="button"
          >
            Voir Profil
          </button>
        </section>
      </div>
    </div>
  );
}
