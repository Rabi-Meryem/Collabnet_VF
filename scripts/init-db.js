import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Initialisation de la base de données...');

  try {
    // Nettoyer la base de données
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.article.deleteMany();
    await prisma.project.deleteMany();
    await prisma.chercheur.deleteMany();
    await prisma.entreprise.deleteMany();

    // Créer des entreprises de test
    console.log('🏢 Création des entreprises de test...');
    const entreprise1 = await prisma.entreprise.create({
      data: {
        companyName: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        password: 'password123',
        position: 'CEO',
        department: 'Direction',
        phoneNumber: '+33 1 23 45 67 89',
        description: 'Entreprise spécialisée dans les solutions technologiques innovantes',
        profileImage: null
      }
    });

    const entreprise2 = await prisma.entreprise.create({
      data: {
        companyName: 'InnovLab Research',
        email: 'info@innovlab.com',
        password: 'password123',
        position: 'Directeur R&D',
        department: 'Recherche et Développement',
        phoneNumber: '+33 1 98 76 54 32',
        description: 'Laboratoire de recherche en innovation technologique',
        profileImage: null
      }
    });

    // Créer des chercheurs de test
    console.log('👨‍🔬 Création des chercheurs de test...');
    const chercheur1 = await prisma.chercheur.create({
      data: {
        fullName: 'Dr. Marie Dupont',
        email: 'marie.dupont@university.fr',
        password: 'password123',
        position: 'Chercheur Senior',
        department: 'Informatique',
        phoneNumber: '+33 6 12 34 56 78',
        cv: 'CV_Marie_Dupont.pdf',
        spokenLanguages: 'Français, Anglais, Allemand',
        keySkills: 'Machine Learning, IA, Big Data',
        description: 'Spécialiste en intelligence artificielle et apprentissage automatique',
        universityORreaserchLAB: 'Université de Paris',
        profileImage: null
      }
    });

    const chercheur2 = await prisma.chercheur.create({
      data: {
        fullName: 'Dr. Jean Martin',
        email: 'jean.martin@research.fr',
        password: 'password123',
        position: 'Chercheur',
        department: 'Biotechnologie',
        phoneNumber: '+33 6 87 65 43 21',
        cv: 'CV_Jean_Martin.pdf',
        spokenLanguages: 'Français, Anglais',
        keySkills: 'Biotechnologie, Génétique, Bioinformatique',
        description: 'Expert en biotechnologie et génétique moléculaire',
        universityORreaserchLAB: 'Institut de Recherche en Biologie',
        profileImage: null
      }
    });

    // Créer des articles de test
    console.log('📄 Création des articles de test...');
    const article1 = await prisma.article.create({
      data: {
        title: 'Avancées en Intelligence Artificielle',
        summary: 'Nouvelles méthodes d\'apprentissage automatique pour l\'analyse de données complexes',
        researchDomain: 'Intelligence Artificielle',
        keyConcepts: 'Machine Learning, Deep Learning, Neural Networks',
        content: 'Cet article présente les dernières avancées en intelligence artificielle...',
        publicationYear: 2024,
        image: '/F2.webp',
        authorId: chercheur1.id
      }
    });

    const article2 = await prisma.article.create({
      data: {
        title: 'Innovations en Biotechnologie',
        summary: 'Nouvelles approches en génétique moléculaire pour le traitement des maladies',
        researchDomain: 'Biotechnologie',
        keyConcepts: 'Génétique, Thérapie génique, CRISPR',
        content: 'Cet article explore les innovations récentes en biotechnologie...',
        publicationYear: 2024,
        image: '/F2.webp',
        authorId: chercheur2.id
      }
    });

    // Créer des projets de test
    console.log('💼 Création des projets de test...');
    const project1 = await prisma.project.create({
      data: {
        title: 'Développement d\'une IA pour l\'analyse médicale',
        description: 'Création d\'un système d\'intelligence artificielle pour l\'analyse d\'images médicales',
        domain: 'Intelligence Artificielle',
        trl: 'TRL 6',
        budgetMin: 50000,
        budgetMax: 150000,
        deadline: new Date('2024-12-31'),
        deliverables: 'Prototype fonctionnel, Documentation technique',
        selectionCriteria: 'Expertise en IA, Expérience en imagerie médicale',
        attachments: null,
        entrepriseId: entreprise1.id
      }
    });

    const project2 = await prisma.project.create({
      data: {
        title: 'Recherche en thérapie génique',
        description: 'Développement de nouvelles thérapies géniques pour le traitement du cancer',
        domain: 'Biotechnologie',
        trl: 'TRL 4',
        budgetMin: 100000,
        budgetMax: 300000,
        deadline: new Date('2025-06-30'),
        deliverables: 'Étude de faisabilité, Protocoles expérimentaux',
        selectionCriteria: 'Expertise en génétique, Expérience en recherche clinique',
        attachments: null,
        entrepriseId: entreprise2.id
      }
    });

    console.log('✅ Base de données initialisée avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`- ${await prisma.entreprise.count()} entreprises créées`);
    console.log(`- ${await prisma.chercheur.count()} chercheurs créés`);
    console.log(`- ${await prisma.article.count()} articles créés`);
    console.log(`- ${await prisma.project.count()} projets créés`);

    console.log('\n🔑 Comptes de test:');
    console.log('Entreprises:');
    console.log('- contact@techcorp.com / password123');
    console.log('- info@innovlab.com / password123');
    console.log('\nChercheurs:');
    console.log('- marie.dupont@university.fr / password123');
    console.log('- jean.martin@research.fr / password123');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 