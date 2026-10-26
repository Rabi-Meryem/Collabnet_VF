import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    console.log('🔍 Test DB: Début du test');
    
    // Test de connexion à la base de données
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Test DB: Connexion OK:', testConnection);
    
    // Compter les utilisateurs
    const chercheurCount = await prisma.chercheur.count();
    const entrepriseCount = await prisma.entreprise.count();
    const conversationCount = await prisma.conversation.count();
    
    console.log('📊 Test DB: Compteurs:', {
      chercheurCount,
      entrepriseCount,
      conversationCount
    });
    
    // Récupérer quelques exemples
    const chercheurs = await prisma.chercheur.findMany({
      take: 3,
      select: {
        id: true,
        fullName: true,
        email: true
      }
    });
    
    const entreprises = await prisma.entreprise.findMany({
      take: 3,
      select: {
        id: true,
        companyName: true,
        email: true
      }
    });
    
    const conversations = await prisma.conversation.findMany({
      take: 3,
      include: {
        chercheur: {
          select: {
            id: true,
            fullName: true
          }
        },
        entreprise: {
          select: {
            id: true,
            companyName: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      counts: {
        chercheurs: chercheurCount,
        entreprises: entrepriseCount,
        conversations: conversationCount
      },
      exemples: {
        chercheurs,
        entreprises,
        conversations
      }
    });
  } catch (error) {
    console.error('❌ Test DB: Erreur:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 