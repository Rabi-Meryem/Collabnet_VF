import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log('Récupération du projet ID:', id);

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }

    console.log('Projet trouvé:', project.title);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur GET /api/projects-entreprise/[id]:', error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const domain = formData.get('domain');
    const trl = formData.get('trl');
    const budgetMin = formData.get('budgetMin') ? parseFloat(formData.get('budgetMin')) : null;
    const budgetMax = formData.get('budgetMax') ? parseFloat(formData.get('budgetMax')) : null;
    const deliverables = formData.get('deliverables');
    const selectionCriteria = formData.get('selectionCriteria');
    const deadline = formData.get('deadline');
    let attachments = null;
    const file = formData.get('attachments');
    if (file && file.name) {
      // Générer un nom unique pour le fichier
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      attachments = fileName;
      
      // Sauvegarder le fichier dans le dossier public/uploads
      const fs = require('fs');
      const path = require('path');
      
      try {
        // Créer le dossier uploads s'il n'existe pas
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Convertir le fichier en buffer et le sauvegarder
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        console.log(`Fichier sauvegardé: ${filePath}`);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du fichier:', error);
        attachments = null;
      }
    }
    
    // Validation des champs obligatoires
    if (!title || !description || !domain || !trl || !deliverables || !selectionCriteria || !deadline) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis.' }, { status: 400 });
    }
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ error: 'La date de deadline est invalide.' }, { status: 400 });
    }
    
    // Mise à jour avec l'API Prisma standard
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        domain,
        trl,
        budgetMin,
        budgetMax,
        deliverables,
        selectionCriteria,
        deadline: deadlineDate,
        attachments
      }
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur lors de la modification du projet:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    // Suppression avec l'API Prisma standard
    const deleted = await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 