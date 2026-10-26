import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Log toutes les données reçues
    console.log('=== AJOUT PROJET ENTREPRISE ===');
    const allFields = {};
    for (let [key, value] of formData.entries()) {
      allFields[key] = value;
    }
    console.log('Toutes les données reçues:', allFields);
    
    const title = formData.get('title');
    const description = formData.get('description');
    const domain = formData.get('domain');
    const trl = formData.get('trl');
    const budgetMin = formData.get('budgetMin') ? parseFloat(formData.get('budgetMin')) : null;
    const budgetMax = formData.get('budgetMax') ? parseFloat(formData.get('budgetMax')) : null;
    const deliverables = formData.get('deliverables');
    const selectionCriteria = formData.get('selectionCriteria');
    const deadline = formData.get('deadline');
    const entrepriseId = parseInt(formData.get('entrepriseId'));
    
    console.log('Données extraites:', {
      title, description, domain, trl, budgetMin, budgetMax,
      deliverables, selectionCriteria, deadline, entrepriseId
    });
    
    let attachments = null;
    const file = formData.get('attachments');
    console.log('Fichier reçu:', file ? { name: file.name, size: file.size, type: file.type } : 'Aucun fichier');
    
    if (file && file.name) {
      // Générer un nom unique pour le fichier
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      attachments = fileName;
      console.log('Nom du fichier généré:', fileName);
      
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
    
    // Validation des champs obligatoires avec logs détaillés
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!domain) missingFields.push('domain');
    if (!trl) missingFields.push('trl');
    if (!deliverables) missingFields.push('deliverables');
    if (!selectionCriteria) missingFields.push('selectionCriteria');
    if (!deadline) missingFields.push('deadline');
    if (isNaN(entrepriseId)) missingFields.push('entrepriseId (invalide)');
    
    if (missingFields.length > 0) {
      console.log('❌ Champs manquants:', missingFields);
      return NextResponse.json({ 
        error: 'Tous les champs obligatoires doivent être remplis.',
        missingFields: missingFields
      }, { status: 400 });
    }
    
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      console.log('❌ Date de deadline invalide:', deadline);
      return NextResponse.json({ error: 'La date de deadline est invalide.' }, { status: 400 });
    }
    
    console.log('✅ Validation OK, création du projet...');
    
    const project = await prisma.project.create({
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
        attachments,
        entrepriseId
      }
    });
    
    console.log('✅ Projet créé avec succès:', project);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur lors de la création du projet entreprise:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const entrepriseId = searchParams.get('entrepriseId');
    
    let projects;
    if (entrepriseId) {
      projects = await prisma.project.findMany({
        where: { entrepriseId: parseInt(entrepriseId) },
        include: {
          entreprise: {
            select: {
              id: true,
              companyName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      projects = await prisma.project.findMany({
        include: {
          entreprise: {
            select: {
              id: true,
              companyName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}