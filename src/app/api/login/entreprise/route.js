import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('=== LOGIN ENTREPRISE ===');
    console.log('Données reçues:', data);
    
    const { identifier, password } = data;
    
  if (!identifier || !password) {
      console.log('❌ Champs manquants:', { identifier: !!identifier, password: !!password });
    return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
  }
    
    console.log('✅ Validation OK, recherche de l\'entreprise...');
    
  // Recherche par email uniquement
  const entreprise = await prisma.entreprise.findUnique({
    where: {
      email: identifier
    }
  });
    
    console.log('Entreprise trouvée:', entreprise ? { id: entreprise.id, email: entreprise.email } : 'Aucune');
    
  if (!entreprise || entreprise.password !== password) {
      console.log('❌ Identifiants invalides');
    return NextResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
  }
    
    console.log('✅ Connexion réussie pour:', entreprise.email);
    
  // Création d'un cookie de session simple
    const response = NextResponse.json({ 
      message: 'Connexion réussie', 
      entrepriseId: entreprise.id,
      entrepriseEmail: entreprise.email
    });
  response.cookies.set('entreprise_session', String(entreprise.id), { path: '/', httpOnly: true });
  return response;
  } catch (error) {
    console.error('❌ Erreur lors du login entreprise:', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
} 