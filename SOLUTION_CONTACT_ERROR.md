# Solution pour l'erreur "Erreur lors du contact"

## Problème identifié

L'erreur "Erreur lors du contact" qui apparaît lors du clic sur le bouton de contact des articles de chercheurs est causée par plusieurs problèmes :

1. **Configuration de base de données manquante** : Pas de fichier `.env` avec `DATABASE_URL`
2. **Gestion d'erreurs insuffisante** : Messages d'erreur génériques
3. **Validation des données manquante** : Pas de vérification des paramètres requis
4. **Base de données vide** : Aucune donnée de test pour tester les fonctionnalités

## Solutions appliquées

### 1. Amélioration de la gestion des erreurs

**Fichier modifié** : `src/app/components/ContactButton.js`

- ✅ Ajout de vérifications des paramètres requis
- ✅ Messages d'erreur plus spécifiques
- ✅ Gestion des erreurs réseau
- ✅ Logs de debugging détaillés

### 2. Amélioration de l'API de conversation

**Fichier modifié** : `src/app/api/conversations/start-with-redirect/route.js`

- ✅ Validation des IDs utilisateur
- ✅ Vérification de l'existence des utilisateurs
- ✅ Gestion des erreurs de base de données
- ✅ Messages d'erreur spécifiques

### 3. Amélioration des utilitaires de messaging

**Fichier modifié** : `src/app/utils/messaging.js`

- ✅ Logs de debugging détaillés
- ✅ Meilleure gestion des erreurs HTTP
- ✅ Validation des réponses API

### 4. Initialisation de la base de données

**Fichier créé** : `scripts/init-db.js`

- ✅ Script d'initialisation avec données de test
- ✅ Comptes de test pour entreprises et chercheurs
- ✅ Articles et projets de test

## Comment tester la solution

### 1. Initialiser la base de données

```bash
npm run db:init
```

### 2. Se connecter avec un compte de test

**Comptes entreprise disponibles :**
- Email: `contact@techcorp.com` / Mot de passe: `password123`
- Email: `info@innovlab.com` / Mot de passe: `password123`

**Comptes chercheur disponibles :**
- Email: `marie.dupont@university.fr` / Mot de passe: `password123`
- Email: `jean.martin@research.fr` / Mot de passe: `password123`

### 3. Tester le bouton de contact

1. Connectez-vous en tant qu'entreprise
2. Allez sur la page d'accueil (`/home-page-En`)
3. Cliquez sur le bouton "Contact" d'un article de chercheur
4. Vérifiez que vous êtes redirigé vers la page de messages

### 4. Utiliser les outils de diagnostic

**Page de diagnostic** : `/diagnostic-contact`
- Lance le diagnostic complet du système de contact
- Affiche les erreurs détaillées
- Teste toutes les APIs

**Page de test** : `/test-contact`
- Test simple du bouton de contact
- Affichage des informations de debug

## Fichiers de configuration nécessaires

### Créer le fichier `.env` à la racine du projet :

```env
# Configuration de la base de données
DATABASE_URL="file:./dev.db"

# Configuration Next.js
NODE_ENV=development

# Configuration des variables d'environnement pour le développement
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Vérification du bon fonctionnement

### 1. Vérifier la base de données

```bash
npm run db:test
```

### 2. Vérifier les logs

Ouvrez la console du navigateur (F12) et regardez les logs :
- 🔍 ContactButton: Début du processus de contact
- ✅ ContactButton: Conversation créée, redirection vers: /messages/X

### 3. Tester l'API directement

```bash
curl -X POST http://localhost:3000/api/conversations/start-with-redirect \
  -H "Content-Type: application/json" \
  -d '{
    "currentUserId": 1,
    "currentUserType": "entreprise",
    "targetUserId": 1,
    "targetUserType": "chercheur"
  }'
```

## Problèmes courants et solutions

### 1. "Aucun utilisateur connecté"
- **Cause** : Pas de session active
- **Solution** : Se reconnecter

### 2. "Utilisateur référencé non trouvé"
- **Cause** : ID utilisateur invalide
- **Solution** : Vérifier que l'utilisateur existe en base

### 3. "Erreur de connexion au serveur"
- **Cause** : Problème réseau ou serveur arrêté
- **Solution** : Vérifier la connexion et redémarrer le serveur

### 4. "Types d'utilisateurs non compatibles"
- **Cause** : Tentative de contact entre même type d'utilisateur
- **Solution** : Normal, seuls les contacts entreprise-chercheur sont autorisés

## Maintenance

### Mise à jour de la base de données

```bash
npx prisma db push
```

### Régénération du client Prisma

```bash
npx prisma generate
```

### Réinitialisation complète

```bash
npm run db:init
```

## Support

Si le problème persiste après avoir appliqué ces solutions :

1. Vérifiez les logs dans la console du navigateur
2. Utilisez la page de diagnostic `/diagnostic-contact`
3. Vérifiez que la base de données contient des données
4. Testez avec les comptes de test fournis 