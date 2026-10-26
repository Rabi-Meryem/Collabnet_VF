# Configuration PostgreSQL et pgAdmin

## 1. Installation et Configuration PostgreSQL

### Vérifier l'installation PostgreSQL
```bash
# Vérifier si PostgreSQL est installé
psql --version
```

### Si PostgreSQL n'est pas installé :
1. Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/windows/
2. Installez avec les paramètres par défaut
3. Notez le mot de passe que vous définissez pour l'utilisateur `postgres`

### Configuration de l'utilisateur postgres
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, changer le mot de passe
ALTER USER postgres PASSWORD 'votre_nouveau_mot_de_passe';

# Quitter psql
\q
```

## 2. Créer la Base de Données

### Option 1 : Via psql
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE collabnet_db;

# Vérifier que la base existe
\l

# Quitter
\q
```

### Option 2 : Via pgAdmin
1. Ouvrez pgAdmin
2. Connectez-vous à votre serveur PostgreSQL
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nommez-la `collabnet_db`

## 3. Configurer le fichier .env

Modifiez le fichier `.env` avec vos paramètres :

```env
# Si vous utilisez le mot de passe par défaut 'postgres'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collabnet_db"

# Si vous avez changé le mot de passe
DATABASE_URL="postgresql://postgres:votre_mot_de_passe@localhost:5432/collabnet_db"

# Si vous utilisez un autre utilisateur
DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/collabnet_db"
```

## 4. Tester la Connexion

### Test simple avec psql
```bash
psql -U postgres -d collabnet_db
```

### Test avec Prisma
```bash
npx prisma db pull
```

## 5. Initialiser la Base de Données

Une fois la connexion établie :

```bash
# Initialiser la base de données
npm run db:init

# Ajouter des données de test
npm run db:seed
```

## 6. Vérifier dans pgAdmin

Après l'initialisation, vous devriez voir dans pgAdmin :

1. **Base de données** `collabnet_db`
2. **Tables** :
   - `Chercheur`
   - `Entreprise`
   - `Article`
   - `Project`
   - `Conversation`
   - `Message`

## Dépannage

### Erreur "Authentication failed"
- Vérifiez le mot de passe de l'utilisateur postgres
- Essayez de vous connecter avec psql pour tester
- Vérifiez que PostgreSQL est démarré

### Erreur "Database does not exist"
- Créez la base de données `collabnet_db`
- Vérifiez le nom dans l'URL de connexion

### Erreur "Connection refused"
- Vérifiez que PostgreSQL est démarré
- Vérifiez le port (5432 par défaut)
- Vérifiez l'adresse (localhost)

### Commandes utiles PostgreSQL
```bash
# Démarrer PostgreSQL (Windows)
net start postgresql-x64-15

# Arrêter PostgreSQL
net stop postgresql-x64-15

# Voir les services PostgreSQL
sc query postgresql*

# Se connecter à une base spécifique
psql -U postgres -d collabnet_db

# Lister les bases de données
psql -U postgres -c "\l"
```

## Configuration Alternative

Si vous préférez utiliser un autre utilisateur :

1. **Créer un nouvel utilisateur** :
```sql
CREATE USER collabnet_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE collabnet_db TO collabnet_user;
```

2. **Modifier le .env** :
```env
DATABASE_URL="postgresql://collabnet_user:votre_mot_de_passe@localhost:5432/collabnet_db"
``` 