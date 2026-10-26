import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('Récupération de l\'article ID:', id);

    const article = await prisma.article.findUnique({
      where: { id: id },
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

    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    console.log('Article trouvé:', article.title);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Erreur GET /api/articles/[id]:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    console.log('Suppression de l\'article ID:', id);

    const article = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: id }
    });

    console.log('Article supprimé avec succès');
    return NextResponse.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error('Erreur DELETE /api/articles/[id]:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
} 