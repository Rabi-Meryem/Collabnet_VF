# 🔧 Guide de Dépannage - Problèmes de Connexion PostgreSQL

## Problème : "Authentication failed" ou "authentification par mot de passe échouée"

### Solution 1 : Vérifier le mot de passe PostgreSQL

1. **Ouvrez pgAdmin**
2. **Connectez-vous à votre serveur PostgreSQL**
3. **Notez le mot de passe que vous utilisez**

### Solution 2 : Réinitialiser le mot de passe

#### Via pgAdmin :
1. Clic droit sur votre serveur PostgreSQL
2. "Properties" → "Connection"
3. Vérifiez le mot de passe

#### Via psql :
```bash
# Se connecter à PostgreSQL (sans mot de passe d'abord)
psql -U postgres

# Si ça ne marche pas, essayez :
psql -U postgres -h localhost
```

#### Via Windows Services :
1. Ouvrez "Services" (services.msc)
2. Trouvez le service PostgreSQL
3. Vérifiez qu'il est démarré

### Solution 3 : Modifier les fichiers de configuration

#### 1. Modifier le script de création
Ouvrez `scripts/create-database.js` et modifiez la ligne 8 :
```javascript
password: 'votre_vrai_mot_de_passe', // Remplacez par votre mot de passe
```

#### 2. Modifier le fichier .env
Ouvrez `.env` et modifiez :
```env
DATABASE_URL="postgresql://postgres:votre_vrai_mot_de_passe@localhost:5432/collabnet_db"
```

### Solution 4 : Créer la base manuellement

#### Dans pgAdmin :
1. Ouvrez pgAdmin
2. Connectez-vous à PostgreSQL
3. Clic droit sur "Databases"
4. "Create" → "Database"
5. Nommez-la `collabnet_db`

#### Via psql :
```bash
# Se connecter
psql -U postgres

# Créer la base
CREATE DATABASE collabnet_db;

# Vérifier
\l

# Quitter
\q
```

### Solution 5 : Vérifier l'installation PostgreSQL

#### Vérifier si PostgreSQL est installé :
```bash
psql --version
```

#### Vérifier les services Windows :
```bash
sc query postgresql*
```

#### Démarrer PostgreSQL :
```bash
net start postgresql-x64-15
```

## Problème : "Connection refused"

### Solutions :
1. **Vérifiez que PostgreSQL est démarré**
2. **Vérifiez le port (5432 par défaut)**
3. **Vérifiez l'adresse (localhost)**

## Problème : "Database does not exist"

### Solutions :
1. **Créez la base de données `collabnet_db`**
2. **Vérifiez le nom dans l'URL de connexion**

## Étapes de diagnostic

### 1. Test de connexion simple
```bash
psql -U postgres -d postgres
```

### 2. Lister les bases existantes
```bash
psql -U postgres -c "\l"
```

### 3. Tester avec Prisma
```bash
npx prisma db pull
```

## Configuration recommandée

### 1. Mot de passe simple
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Changer le mot de passe
ALTER USER postgres PASSWORD 'postgres';

# Quitter
\q
```

### 2. Fichier .env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collabnet_db"
```

### 3. Script de création
```javascript
password: 'postgres', // Mot de passe simple
```

## Commandes utiles

```bash
# Vérifier PostgreSQL
psql --version

# Se connecter
psql -U postgres

# Lister les bases
\l

# Créer une base
CREATE DATABASE collabnet_db;

# Se connecter à une base
\c collabnet_db

# Lister les tables
\dt

# Quitter
\q
```

## Support

Si les problèmes persistent :
1. Consultez `POSTGRESQL_SETUP.md`
2. Vérifiez la documentation PostgreSQL
3. Redémarrez PostgreSQL
4. Réinstallez PostgreSQL si nécessaire 