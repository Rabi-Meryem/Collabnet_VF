# Système de Messagerie en Temps Réel

Ce système de messagerie utilise Socket.io, Next.js, PostgreSQL et Prisma pour créer une expérience de chat en temps réel similaire à WhatsApp Web.

## 🚀 Fonctionnalités

- **Messagerie en temps réel** avec Socket.io
- **Interface WhatsApp-like** avec sidebar et chat box
- **Indicateur de frappe** ("En train d'écrire...")
- **Messages non lus** avec compteur
- **Support multi-utilisateurs** (Chercheurs et Entreprises)
- **Persistance des données** avec PostgreSQL
- **Design responsive** avec Tailwind CSS

## 📁 Structure des fichiers

```
src/
├── app/
│   ├── api/
│   │   ├── conversations/[userId]/route.js    # API conversations
│   │   └── messages/[conversationId]/route.js # API messages
│   ├── components/
│   │   ├── ChatSidebar.js                     # Sidebar des conversations
│   │   └── ChatBox.js                         # Zone de chat
│   └── messages/[userId]/page.js              # Page principale des messages
├── lib/
│   └── socket.js                              # Configuration Socket.io
└── pages/
    └── api/
        └── socket.js                          # API Socket.io
```

## 🗄️ Base de données

### Table Message
```sql
CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "senderId" INTEGER NOT NULL,
  "receiverId" INTEGER NOT NULL,
  "senderType" TEXT NOT NULL,    -- "chercheur" ou "entreprise"
  "receiverType" TEXT NOT NULL,  -- "chercheur" ou "entreprise"
  "read" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

## 🔧 Installation

1. **Installer les dépendances**
```bash
npm install socket.io socket.io-client
```

2. **Mettre à jour la base de données**
```bash
npx prisma db push
```

3. **Démarrer le serveur**
```bash
npm run dev
```

## 📱 Utilisation

### Navigation vers les messages
- Cliquer sur le bouton "Contact" sur un profil utilisateur
- URL: `/messages/[userId]`

### Interface
- **Sidebar gauche** : Liste des conversations
- **Zone droite** : Chat actif avec l'utilisateur sélectionné
- **Indicateurs** : Messages non lus, frappe en cours

### Fonctionnalités
- ✅ Envoi de messages en temps réel
- ✅ Réception instantanée
- ✅ Indicateur de frappe
- ✅ Compteur de messages non lus
- ✅ Historique des conversations
- ✅ Support chercheurs/entreprises

## 🔌 API Endpoints

### GET `/api/conversations/[userId]`
Récupère toutes les conversations d'un utilisateur.

### GET `/api/messages/conversation?userId1=X&userId2=Y`
Récupère tous les messages entre deux utilisateurs.

### WebSocket Events
- `join-user` : Rejoindre une room utilisateur
- `send-message` : Envoyer un message
- `typing` : Indicateur de frappe
- `new-message` : Nouveau message reçu
- `user-typing` : Autre utilisateur en train de taper

## 🎨 Design

Le design utilise Tailwind CSS avec :
- **Layout WhatsApp-like** : Sidebar + Chat box
- **Couleurs** : Bleu pour les messages envoyés, gris pour reçus
- **Responsive** : Adaptation mobile/desktop
- **Animations** : Transitions fluides

## 🔒 Sécurité

- Validation des utilisateurs connectés
- Vérification des permissions
- Protection contre les injections SQL (Prisma)
- CORS configuré pour Socket.io

## 🚀 Déploiement

1. **Variables d'environnement**
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://votre-app.com"
```

2. **Build et déploiement**
```bash
npm run build
npm start
```

## 🐛 Dépannage

### Socket.io ne se connecte pas
- Vérifier que l'API `/api/socket` est accessible
- Contrôler les logs du serveur

### Messages non envoyés
- Vérifier la connexion à la base de données
- Contrôler les logs Prisma

### Interface ne se charge pas
- Vérifier les permissions utilisateur
- Contrôler les erreurs JavaScript

## 📈 Améliorations futures

- [ ] Notifications push
- [ ] Envoi de fichiers/images
- [ ] Messages vocaux
- [ ] Statut en ligne/hors ligne
- [ ] Recherche dans les messages
- [ ] Messages éphémères
- [ ] Chiffrement end-to-end 