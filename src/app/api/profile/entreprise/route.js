import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

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
      console.log('❌ Entreprise non trouvée pour:', { email, id });
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }

    // Retourner les données sans le mot de passe
    const { password, ...entrepriseData } = entreprise;
    console.log('✅ Entreprise trouvée:', entrepriseData);
    return NextResponse.json(entrepriseData);
  } catch (error) {
    console.error('Erreur GET /api/profile/entreprise:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const email = formData.get('email');
    const companyName = formData.get('companyName');
    const position = formData.get('position');
    const phoneNumber = formData.get('phoneNumber');
    const department = formData.get('department');
    const location = formData.get('location');
    const description = formData.get('description');
    
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    console.log('=== DEBUG UPLOAD ENTREPRISE ===');
    console.log('Email:', email);
    console.log('FormData keys:', Array.from(formData.keys()));

    // Gérer l'upload de l'image de profil
    let profileImage = null;
    const profileImageFile = formData.get('profileImageFile');
    if (profileImageFile && profileImageFile.name) {
      console.log('Profile image file found:', profileImageFile.name);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${profileImageFile.name}`;
      profileImage = fileName;
      
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const bytes = await profileImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        console.log(`✅ Image de profil sauvegardée: ${filePath}`);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde de l\'image de profil:', error);
        profileImage = null;
      }
    } else {
      console.log('❌ Aucun fichier image de profil reçu');
    }

    // Gérer l'upload du média (image/vidéo)
    let media = null;
    const mediaFile = formData.get('mediaFile');
    if (mediaFile && mediaFile.name) {
      console.log('Media file found:', mediaFile.name);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${mediaFile.name}`;
      media = fileName;
      
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const bytes = await mediaFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        console.log(`✅ Média sauvegardé: ${filePath}`);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du média:', error);
        media = null;
      }
    } else {
      console.log('❌ Aucun fichier média reçu');
    }

    // Préparer les données de mise à jour
    const updateData = {
      companyName,
      position,
      phoneNumber,
      department,
      location,
      description,
    };

    // Ajouter les images seulement si elles ont été uploadées
    if (profileImage) {
      updateData.profileImage = profileImage;
    } else {
      // Si pas de nouvelle image, garder l'ancienne ou la supprimer
      const currentProfile = await prisma.entreprise.findUnique({ where: { email } });
      if (currentProfile && currentProfile.profileImage) {
        updateData.profileImage = currentProfile.profileImage;
      }
    }
    
    if (media) {
      updateData.media = media;
    } else {
      // Si pas de nouveau média, garder l'ancien ou le supprimer
      const currentProfile = await prisma.entreprise.findUnique({ where: { email } });
      if (currentProfile && currentProfile.media) {
        updateData.media = currentProfile.media;
      }
    }

    console.log('Données à mettre à jour:', updateData);

    const updated = await prisma.entreprise.update({
      where: { email },
      data: updateData,
    });
    
    console.log('✅ Profil mis à jour avec succès:', updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 