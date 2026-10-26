# 🚀 Démarrage Rapide - Configuration Base de Données

## Étapes pour configurer votre base de données PostgreSQL

### 1. Vérifier PostgreSQL
Assurez-vous que PostgreSQL est installé et démarré sur votre machine.

### 2. Créer la base de données
```bash
npm run db:create
```

### 3. Tester la connexion
```bash
npm run db:test
```

### 4. Initialiser les tables
```bash
npm run db:init
```

### 5. Ajouter des données de test
```bash
npm run db:seed
```

### 6. Vérifier dans pgAdmin
Ouvrez pgAdmin et vérifiez que vous voyez :
- Base de données `collabnet_db`
- Tables : `Chercheur`, `Entreprise`, `Article`, `Project`, `Conversation`, `Message`
- Données de test dans chaque table

## 🔧 Si vous rencontrez des problèmes

### Erreur de connexion
1. Vérifiez que PostgreSQL est démarré
2. Modifiez le mot de passe dans `scripts/create-database.js` ligne 8
3. Modifiez le fichier `.env` avec le bon mot de passe

### Erreur d'authentification
1. Connectez-vous à PostgreSQL : `psql -U postgres`
2. Changez le mot de passe : `ALTER USER postgres PASSWORD 'nouveau_mot_de_passe';`
3. Mettez à jour les fichiers de configuration

### Création manuelle de la base
Dans pgAdmin :
1. Clic droit sur "Databases"
2. "Create" → "Database"
3. Nommez-la `collabnet_db`

## 📊 Données créées

Après le seeding, vous aurez :
- **2 chercheurs** avec profils complets
- **2 entreprises** avec descriptions
- **2 articles** de recherche
- **2 projets** d'entreprise
- **1 conversation** avec messages

## 🎯 Prochaines étapes

Une fois la base configurée :
1. Lancez l'application : `npm run dev`
2. Testez les fonctionnalités
3. Consultez les guides détaillés si nécessaire

## 📚 Guides détaillés

- `POSTGRESQL_SETUP.md` - Configuration complète PostgreSQL
- `DATABASE_SETUP.md` - Guide de la base de données 