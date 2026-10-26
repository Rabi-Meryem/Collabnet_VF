import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req) {
   try {
  const data = await req.json();
    console.log('=== INSCRIPTION ENTREPRISE ===');
    console.log('Données reçues:', data);
    
  const {
    companyName,
    position,
    email,
    password,
    phoneNumber,
    department,
    description
  } = data;

    console.log('Champs extraits:', { companyName, position, email, password, description });

    // Validation des champs obligatoires
    if (!companyName || !email || !password) {
      console.log('❌ Champs manquants');
      return NextResponse.json({ 
        message: 'Tous les champs obligatoires doivent être remplis',
        missingFields: {
          companyName: !companyName,
          email: !email,
          password: !password
        }
      }, { status: 400 });
    }

    console.log('✅ Validation OK, création de l\'entreprise...');
    
    const dataToCreate = {
      companyName,
      email,
      password,
      position: position || null,
      phoneNumber: phoneNumber || null,
      department: department || null,
      description: description || null
    };
    
    console.log('Données à créer:', dataToCreate);
  
    const entreprise = await prisma.entreprise.create({
      data: dataToCreate
    });

    console.log('✅ Entreprise créée avec succès:', entreprise);
    return NextResponse.json(entreprise, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription entreprise:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Un compte avec cet email existe déjà' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      message: 'Erreur lors de l\'inscription de l\'entreprise', 
      error: error.message 
    }, { status: 500 });
  }
}
