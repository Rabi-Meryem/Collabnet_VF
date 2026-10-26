import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    console.log('🔧 API entreprises - Prisma disponible:', !!prisma);
    console.log('🔧 DATABASE_URL dans API:', process.env.DATABASE_URL);
    
    const entreprises = await prisma.entreprise.findMany({
      select: {
        id: true,
        companyName: true,
        email: true,
        position: true,
        phoneNumber: true,
        department: true,
        location: true,
        description: true,
        profileImage: true,
        media: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Entreprises récupérées:', entreprises.length);
    return NextResponse.json(entreprises);
  } catch (error) {
    console.error('❌ Erreur GET /api/entreprises:', error);
    console.error('❌ Stack trace:', error.stack);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 