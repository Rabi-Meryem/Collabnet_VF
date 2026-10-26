import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');

     console.log('Paramètres reçus:', { authorId });
    // Validation du authorId si présent
     const parsedAuthorId = authorId ? parseInt(authorId) : null;
    if (authorId && isNaN(parsedAuthorId)) {
      return NextResponse.json(
        { error: "authorId doit être un nombre valide" },
        { status: 400 }
      );
    }

    const articles = await prisma.article.findMany({
      where: parsedAuthorId ? { 
        authorId:  parsedAuthorId 
      } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
console.log('Articles trouvés:', articles);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Erreur GET /api/articles:', error);
    return NextResponse.json(
      { 
        //error: error.message || 'Erreur lors de la récupération des articles',
        //details: error
         error: "Erreur serveur",
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('=== DÉBUT POST /api/articles ===');
    
    const formData = await request.formData();
    
    // Extraction des champs avec des valeurs par défaut
    const title = formData.get("title") || "";
    const summary = formData.get("summary") || "";
    const researchDomain = formData.get("researchDomain") || "";
    const keyConcepts = formData.get("keyConcepts") || "";
    const content = formData.get("content") || "";
    const imageFile = formData.get("image");
    const authorIdStr = formData.get("authorId");
    
    console.log('Données reçues:', {
      title,
      summary,
      researchDomain,
      authorId: authorIdStr,
      hasImage: !!imageFile
    });

    // Validation des champs obligatoires
    if (!title || !summary || !researchDomain) {
      console.log('❌ Validation échouée: champs obligatoires manquants');
      return NextResponse.json(
        { error: "Titre, résumé et domaine de recherche sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation de l'authorId
    if (!authorIdStr) {
      console.log('❌ Validation échouée: authorId manquant');
      return NextResponse.json(
        { error: "authorId est obligatoire" },
        { status: 400 }
      );
    }

    const authorId = parseInt(authorIdStr);
    if (isNaN(authorId)) {
      console.log('❌ Validation échouée: authorId invalide:', authorIdStr);
      return NextResponse.json(
        { error: "authorId doit être un nombre valide" },
        { status: 400 }
      );
    }

    console.log('✅ authorId validé:', authorId);

    // Vérifier que le chercheur existe
    const chercheur = await prisma.chercheur.findUnique({
      where: { id: authorId }
    });

    if (!chercheur) {
      console.log('❌ Chercheur non trouvé avec ID:', authorId);
      return NextResponse.json(
        { error: "Chercheur non trouvé" },
        { status: 404 }
      );
    }

    console.log('✅ Chercheur trouvé:', chercheur.fullName);

    // Gestion de l'image
    let imagePath = null;
    if (imageFile && imageFile.name) {
      console.log('📸 Traitement de l\'image:', imageFile.name);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
      console.log('✅ Image sauvegardée:', imagePath);
    }

    // Création de l'article
    console.log('📝 Création de l\'article...');
    const newArticle = await prisma.article.create({
      data: {
        title,
        summary,
        researchDomain,
        keyConcepts,
        content,
        image: imagePath,
        authorId: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            department: true
          }
        }
      }
    });

    console.log('✅ Article créé avec succès:', newArticle);
    console.log('=== FIN POST /api/articles ===');
    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur POST /api/articles:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}