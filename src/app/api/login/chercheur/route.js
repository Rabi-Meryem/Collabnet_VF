import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('=== LOGIN CHERCHEUR ===');
    console.log('Données reçues:', data);
    
    const { identifier, password } = data;
    
    if (!identifier || !password) {
      console.log('❌ Champs manquants:', { identifier: !!identifier, password: !!password });
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }
    
    console.log('✅ Validation OK, recherche du chercheur...');
    
    // Recherche par email uniquement
    const chercheur = await prisma.chercheur.findUnique({
      where: {
        email: identifier
      }
    });
    
    console.log('Chercheur trouvé:', chercheur ? { id: chercheur.id, email: chercheur.email } : 'Aucun');
    
    if (!chercheur || chercheur.password !== password) {
      console.log('❌ Identifiants invalides');
      return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
    }
    
    console.log('✅ Connexion réussie pour:', chercheur.email);
    
    // Création d'un cookie de session simple
    const response = NextResponse.json({ 
      message: 'Connexion réussie', 
      chercheurId: chercheur.id,
      chercheurEmail: chercheur.email
    });
    response.cookies.set('chercheur_session', String(chercheur.id), { path: '/', httpOnly: true });
    return response;
  } catch (error) {
    console.error('❌ Erreur lors du login chercheur:', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
} 