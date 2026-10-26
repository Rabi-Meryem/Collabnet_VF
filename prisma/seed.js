import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer des chercheurs
  const chercheur1 = await prisma.chercheur.upsert({
    where: { email: 'chercheur1@example.com' },
    update: {},
    create: {
      fullName: 'Dr. Marie Dupont',
      email: 'chercheur1@example.com',
      password: await bcrypt.hash('password123', 10),
      position: 'Chercheur Senior',
      department: 'Informatique',
      phoneNumber: '+33123456789',
      description: 'Spécialiste en intelligence artificielle et machine learning'
    }
  });

  const chercheur2 = await prisma.chercheur.upsert({
    where: { email: 'chercheur2@example.com' },
    update: {},
    create: {
      fullName: 'Dr. Jean Martin',
      email: 'chercheur2@example.com',
      password: await bcrypt.hash('password123', 10),
      position: 'Chercheur',
      department: 'Biologie',
      phoneNumber: '+33987654321',
      description: 'Expert en biotechnologie et génétique'
    }
  });

  // Créer des entreprises
  const entreprise1 = await prisma.entreprise.upsert({
    where: { email: 'entreprise1@example.com' },
    update: {},
    create: {
      companyName: 'TechCorp Solutions',
      email: 'entreprise1@example.com',
      password: await bcrypt.hash('password123', 10),
      position: 'Directeur R&D',
      description: 'Entreprise spécialisée dans les solutions technologiques innovantes'
    }
  });

  const entreprise2 = await prisma.entreprise.upsert({
    where: { email: 'entreprise2@example.com' },
    update: {},
    create: {
      companyName: 'BioInnov Labs',
      email: 'entreprise2@example.com',
      password: await bcrypt.hash('password123', 10),
      position: 'Chef de Projet',
      description: 'Laboratoire de recherche en biotechnologie'
    }
  });

  // Créer des articles
  const article1 = await prisma.article.upsert({
    where: { id: 'article1' },
    update: {},
    create: {
      id: 'article1',
      title: 'Avancées en Intelligence Artificielle',
      summary: 'Nouvelles méthodes d\'apprentissage automatique pour la reconnaissance d\'images',
      researchDomain: 'Intelligence Artificielle',
      keyConcepts: 'Machine Learning, Computer Vision, Deep Learning',
      content: 'Cet article présente les dernières avancées en matière d\'intelligence artificielle...',
      publicationYear: 2024,
      authorId: chercheur1.id
    }
  });

  const article2 = await prisma.article.upsert({
    where: { id: 'article2' },
    update: {},
    create: {
      id: 'article2',
      title: 'Biotechnologie et Génétique Moderne',
      summary: 'Nouvelles techniques de modification génétique',
      researchDomain: 'Biotechnologie',
      keyConcepts: 'CRISPR, Génétique, Biologie Moléculaire',
      content: 'Les avancées en biotechnologie ouvrent de nouvelles perspectives...',
      publicationYear: 2024,
      authorId: chercheur2.id
    }
  });

  // Créer des projets
  const projet1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Développement d\'une IA pour la Détection de Cancer',
      description: 'Création d\'un système d\'intelligence artificielle pour la détection précoce du cancer',
      domain: 'Santé',
      trl: 'TRL 6',
      budgetMin: 50000,
      budgetMax: 150000,
      deadline: new Date('2024-12-31'),
      deliverables: 'Prototype fonctionnel, Documentation technique, Tests cliniques',
      selectionCriteria: 'Expertise en IA, Expérience en santé, Publications pertinentes',
      entrepriseId: entreprise1.id
    }
  });

  const projet2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Optimisation de Processus Biotechnologiques',
      description: 'Amélioration des processus de production en biotechnologie',
      domain: 'Biotechnologie',
      trl: 'TRL 7',
      budgetMin: 30000,
      budgetMax: 100000,
      deadline: new Date('2024-10-15'),
      deliverables: 'Processus optimisé, Rapport d\'analyse, Protocoles de production',
      selectionCriteria: 'Expertise en biotechnologie, Expérience industrielle',
      entrepriseId: entreprise2.id
    }
  });

  // Créer une conversation
  const conversation = await prisma.conversation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      chercheurId: chercheur1.id,
      entrepriseId: entreprise1.id
    }
  });

  // Créer des messages
  await prisma.message.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: 'Bonjour, je suis intéressé par votre projet sur l\'IA pour la détection de cancer.',
      senderType: 'chercheur',
      senderId: chercheur1.id,
      conversationId: conversation.id
    }
  });

  await prisma.message.upsert({
    where: { id: 2 },
    update: {},
    create: {
      content: 'Merci pour votre intérêt ! Pouvez-vous nous en dire plus sur votre expertise ?',
      senderType: 'entreprise',
      senderId: entreprise1.id,
      conversationId: conversation.id
    }
  });

  console.log('✅ Seeding terminé avec succès !');
  console.log(`📊 Données créées :`);
  console.log(`   - ${2} chercheurs`);
  console.log(`   - ${2} entreprises`);
  console.log(`   - ${2} articles`);
  console.log(`   - ${2} projets`);
  console.log(`   - ${1} conversation avec ${2} messages`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 