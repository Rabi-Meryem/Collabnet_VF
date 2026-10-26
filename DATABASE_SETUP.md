# Configuration de la Base de Données PostgreSQL

## Prérequis

1. **PostgreSQL** installé sur votre machine
2. **pgAdmin** installé pour gérer la base de données
3. **Node.js** et **npm** installés

## Configuration

### 1. Créer la base de données dans pgAdmin

1. Ouvrez pgAdmin
2. Connectez-vous à votre serveur PostgreSQL
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nommez-la `collabnet_db`

### 2. Configurer les variables d'environnement

Le fichier `.env` a été créé avec la configuration suivante :
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/collabnet_db"
```

**Modifiez selon votre configuration :**
- `postgres` : nom d'utilisateur PostgreSQL
- `password` : mot de passe PostgreSQL
- `localhost:5432` : hôte et port PostgreSQL
- `collabnet_db` : nom de votre base de données

### 3. Initialiser la base de données

```bash
npm run db:init
```

Cette commande va :
- Vérifier la connexion à PostgreSQL
- Appliquer le schéma Prisma
- Générer le client Prisma

### 4. Ajouter des données de test

```bash
npm run db:seed
```

Cette commande va créer :
- 2 chercheurs avec leurs profils
- 2 entreprises avec leurs profils
- 2 articles de recherche
- 2 projets d'entreprise
- 1 conversation avec des messages

## Structure de la Base de Données

### Tables créées :

1. **Chercheur** - Profils des chercheurs
2. **Entreprise** - Profils des entreprises
3. **Article** - Articles de recherche
4. **Project** - Projets d'entreprise
5. **Conversation** - Conversations entre chercheurs et entreprises
6. **Message** - Messages dans les conversations

### Relations :

- Un chercheur peut avoir plusieurs articles
- Une entreprise peut avoir plusieurs projets
- Les conversations relient chercheurs et entreprises
- Les messages appartiennent à des conversations

## Vérification dans pgAdmin

Après l'initialisation, vous devriez voir dans pgAdmin :

1. **Tables** dans `collabnet_db` :
   - `Chercheur`
   - `Entreprise`
   - `Article`
   - `Project`
   - `Conversation`
   - `Message`

2. **Données de test** dans chaque table

## Commandes utiles

```bash
# Initialiser la base de données
npm run db:init

# Ajouter des données de test
npm run db:seed

# Voir le schéma Prisma
npx prisma studio

# Réinitialiser la base de données
npx prisma db push --force-reset
```

## Dépannage

### Erreur de connexion
- Vérifiez que PostgreSQL est démarré
- Vérifiez les paramètres de connexion dans `.env`
- Vérifiez que la base de données `collabnet_db` existe

### Erreur de permissions
- Vérifiez que votre utilisateur PostgreSQL a les droits sur la base de données
- Vérifiez que le mot de passe est correct

### Erreur de schéma
- Exécutez `npx prisma generate` pour régénérer le client
- Exécutez `npx prisma db push` pour appliquer le schéma 