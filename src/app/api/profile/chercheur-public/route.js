import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    let chercheur;

    if (id) {
      chercheur = await prisma.chercheur.findUnique({
        where: { id: parseInt(id) }
      });
    } else if (email) {
      chercheur = await prisma.chercheur.findUnique({
        where: { email: email }
      });
    } else {
      return NextResponse.json({ error: "Email ou ID requis" }, { status: 400 });
    }

    if (!chercheur) {
      return NextResponse.json({ error: "Chercheur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(chercheur);
  } catch (error) {
    console.error('Erreur GET /api/profile/chercheur-public:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 