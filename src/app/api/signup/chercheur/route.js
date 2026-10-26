import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
  const data = await req.json();
    console.log('=== INSCRIPTION CHERCHEUR ===');
    console.log('Données reçues:', data);
    
  const {
    fullName,
    email,
    password,
    universityORreaserchLAB,
    position,
    department,
    phoneNumber,
    cv,
    spokenLanguages,
    keySkills,
    description
  } = data;

    // Validation des champs requis
    if (!fullName || !email || !password) {
      console.log('❌ Champs manquants');
      return NextResponse.json({ 
        message: 'Tous les champs obligatoires doivent être remplis',
        missingFields: {
          fullName: !fullName,
          email: !email,
          password: !password
        }
      }, { status: 400 });
    }

    console.log('✅ Validation OK, création du chercheur...');

    const chercheur = await prisma.chercheur.create({
      data: {
        fullName,
        email,
        password,
        universityORreaserchLAB: universityORreaserchLAB || null,
        position: position || null,
        department: department || null,
        phoneNumber: phoneNumber || null,
        cv: cv || null,
        spokenLanguages: spokenLanguages || null,
        keySkills: keySkills || null,
        description: description || null
      }
    });

    console.log('✅ Chercheur créé avec succès:', chercheur);
    return NextResponse.json(chercheur, { status: 201 });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Un compte avec cet email existe déjà' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      message: 'Erreur lors de l\'inscription du chercheur', 
      error: error.message 
    }, { status: 500 });
}
}
