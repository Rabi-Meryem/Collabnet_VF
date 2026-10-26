import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    let entreprise;

    if (id) {
      entreprise = await prisma.entreprise.findUnique({
        where: { id: parseInt(id) }
      });
    } else if (email) {
      entreprise = await prisma.entreprise.findUnique({
        where: { email: email }
      });
    } else {
      return NextResponse.json({ error: "Email ou ID requis" }, { status: 400 });
    }

    if (!entreprise) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }

    return NextResponse.json(entreprise);
  } catch (error) {
    console.error('Erreur GET /api/profile/entreprise-public:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 