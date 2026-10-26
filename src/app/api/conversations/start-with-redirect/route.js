import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req) {
  try {
    console.log('🔍 API start-with-redirect: Début de la requête');
    
    const body = await req.json();
    console.log('🔍 API start-with-redirect: Corps reçu:', body);
    
    const { currentUserId, currentUserType, targetUserId, targetUserType } = body;

    if (!currentUserId || !currentUserType || !targetUserId || !targetUserType) {
      console.error('❌ API start-with-redirect: Paramètres manquants:', {
        currentUserId, currentUserType, targetUserId, targetUserType
      });
      return NextResponse.json({ 
        error: "Tous les paramètres sont requis" 
      }, { status: 400 });
    }

    console.log('🔍 API start-with-redirect: Paramètres validés');

    // Vérifier que les IDs sont des nombres valides
    const currentUserIdNum = parseInt(currentUserId);
    const targetUserIdNum = parseInt(targetUserId);
    
    if (isNaN(currentUserIdNum) || isNaN(targetUserIdNum)) {
      console.error('❌ API start-with-redirect: IDs invalides:', { currentUserId, targetUserId });
      return NextResponse.json({ 
        error: "IDs utilisateur invalides" 
      }, { status: 400 });
    }

    // Déterminer les IDs pour la conversation
    let chercheurId, entrepriseId;
    
    if (currentUserType === 'chercheur' && targetUserType === 'entreprise') {
      chercheurId = currentUserIdNum;
      entrepriseId = targetUserIdNum;
    } else if (currentUserType === 'entreprise' && targetUserType === 'chercheur') {
      chercheurId = targetUserIdNum;
      entrepriseId = currentUserIdNum;
    } else if (currentUserType === 'chercheur' && targetUserType === 'chercheur') {
      // Conversation chercheur vers chercheur
      chercheurId = currentUserIdNum;
      entrepriseId = null;
    } else if (currentUserType === 'entreprise' && targetUserType === 'entreprise') {
      // Conversation entreprise vers entreprise
      chercheurId = null;
      entrepriseId = currentUserIdNum;
    } else {
      console.error('❌ API start-with-redirect: Types incompatibles:', {
        currentUserType, targetUserType
      });
      return NextResponse.json({ 
        error: "Types d'utilisateurs non compatibles" 
      }, { status: 400 });
    }

    console.log('🔍 API start-with-redirect: IDs déterminés:', { chercheurId, entrepriseId });

    // Vérifier que les utilisateurs existent selon le type de conversation
    let chercheur = null;
    let entreprise = null;
    
    if (chercheurId) {
      chercheur = await prisma.chercheur.findUnique({
        where: { id: chercheurId }
      });
    }
    
    if (entrepriseId) {
      entreprise = await prisma.entreprise.findUnique({
        where: { id: entrepriseId }
      });
    }

    // Vérifier selon le type de conversation
    if (currentUserType === 'chercheur' && targetUserType === 'entreprise') {
      if (!chercheur || !entreprise) {
        console.error('❌ API start-with-redirect: Utilisateurs non trouvés pour conversation chercheur-entreprise:', {
          chercheur: !!chercheur,
          entreprise: !!entreprise,
          chercheurId,
          entrepriseId
        });
        return NextResponse.json({ 
          error: "Un ou plusieurs utilisateurs non trouvés" 
        }, { status: 404 });
      }
    } else if (currentUserType === 'entreprise' && targetUserType === 'chercheur') {
      if (!chercheur || !entreprise) {
        console.error('❌ API start-with-redirect: Utilisateurs non trouvés pour conversation entreprise-chercheur:', {
          chercheur: !!chercheur,
          entreprise: !!entreprise,
          chercheurId,
          entrepriseId
        });
        return NextResponse.json({ 
          error: "Un ou plusieurs utilisateurs non trouvés" 
        }, { status: 404 });
      }
    } else if (currentUserType === 'chercheur' && targetUserType === 'chercheur') {
      if (!chercheur) {
        console.error('❌ API start-with-redirect: Chercheur non trouvé pour conversation chercheur-chercheur');
        return NextResponse.json({ 
          error: "Chercheur non trouvé" 
        }, { status: 404 });
      }
    } else if (currentUserType === 'entreprise' && targetUserType === 'entreprise') {
      if (!entreprise) {
        console.error('❌ API start-with-redirect: Entreprise non trouvée pour conversation entreprise-entreprise');
        return NextResponse.json({ 
          error: "Entreprise non trouvée" 
        }, { status: 404 });
      }
    }

    // Vérifier si la conversation existe déjà
    console.log('🔍 API start-with-redirect: Vérification conversation existante...');
    
    let existingConversation;
    if (currentUserType === 'chercheur' && targetUserType === 'entreprise') {
      existingConversation = await prisma.conversation.findFirst({
        where: {
          chercheurId: chercheurId,
          entrepriseId: entrepriseId
        }
      });
    } else if (currentUserType === 'entreprise' && targetUserType === 'chercheur') {
      existingConversation = await prisma.conversation.findFirst({
        where: {
          chercheurId: chercheurId,
          entrepriseId: entrepriseId
        }
      });
    } else if (currentUserType === 'chercheur' && targetUserType === 'chercheur') {
      // Pour les conversations chercheur-chercheur, on utilise une approche différente
      // ou on peut créer une table séparée pour les conversations chercheur-chercheur
      existingConversation = null; // Pour l'instant, on ne gère pas ce cas
    } else if (currentUserType === 'entreprise' && targetUserType === 'entreprise') {
      // Pour les conversations entreprise-entreprise, on utilise une approche différente
      existingConversation = null; // Pour l'instant, on ne gère pas ce cas
    }

    console.log('🔍 API start-with-redirect: Conversation existante:', existingConversation);

    let conversation;
    if (existingConversation) {
      conversation = existingConversation;
      console.log('✅ API start-with-redirect: Conversation existante trouvée');
    } else {
      // Créer une nouvelle conversation
      console.log('🔍 API start-with-redirect: Création nouvelle conversation...');
      try {
        if (currentUserType === 'chercheur' && targetUserType === 'entreprise') {
          conversation = await prisma.conversation.create({
            data: {
              chercheurId: chercheurId,
              entrepriseId: entrepriseId
            }
          });
        } else if (currentUserType === 'entreprise' && targetUserType === 'chercheur') {
          conversation = await prisma.conversation.create({
            data: {
              chercheurId: chercheurId,
              entrepriseId: entrepriseId
            }
          });
        } else {
          // Pour les autres types, on crée une conversation temporaire
          conversation = {
            id: Date.now(), // ID temporaire
            chercheurId: chercheurId,
            entrepriseId: entrepriseId
          };
        }
        console.log('✅ API start-with-redirect: Nouvelle conversation créée:', conversation);
      } catch (error) {
        console.error('❌ API start-with-redirect: Erreur création conversation:', error);
        return NextResponse.json({ 
          error: "Erreur lors de la création de la conversation" 
        }, { status: 500 });
      }
    }

    // Récupérer les informations de l'utilisateur cible
    console.log('🔍 API start-with-redirect: Récupération infos utilisateur cible...');
    let targetUser;
    if (targetUserType === 'chercheur') {
      targetUser = await prisma.chercheur.findUnique({
        where: { id: parseInt(targetUserId) },
        select: {
          id: true,
          fullName: true,
          profileImage: true,
          email: true
        }
      });
    } else if (targetUserType === 'entreprise') {
      targetUser = await prisma.entreprise.findUnique({
        where: { id: parseInt(targetUserId) },
        select: {
          id: true,
          companyName: true,
          profileImage: true,
          email: true
        }
      });
    }

    if (!targetUser) {
      console.error('❌ API start-with-redirect: Utilisateur cible non trouvé');
      return NextResponse.json({ 
        error: "Utilisateur cible non trouvé" 
      }, { status: 404 });
    }

    console.log('🔍 API start-with-redirect: Utilisateur cible récupéré:', targetUser);

    const response = {
      conversation,
      targetUser,
      redirectUrl: `/messages/${targetUserId}?type=${targetUserType}`
    };

    console.log('✅ API start-with-redirect: Réponse finale:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API start-with-redirect: Erreur complète:', error);
    
    // Message d'erreur plus spécifique
    let errorMessage = "Erreur serveur";
    if (error.code === 'P2002') {
      errorMessage = "Cette conversation existe déjà";
    } else if (error.code === 'P2003') {
      errorMessage = "Utilisateur référencé non trouvé";
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 });
  }
}