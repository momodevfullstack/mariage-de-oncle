# 💒 Plateforme de Mariage - Guy-Morel & Olive

Plateforme web complète pour la gestion d'invitations de mariage avec backend Node.js et MongoDB.

## 🚀 Fonctionnalités

- ✅ Formulaire RSVP pour les invités
- ✅ Génération de cartes d'invitation personnalisées
- ✅ Téléchargement d'invitations en PNG
- ✅ Dashboard admin pour gérer les invités
- ✅ Authentification sécurisée (JWT)
- ✅ API REST complète avec MongoDB

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd mariage-de-oncle
```

### 2. Installer les dépendances du frontend
```bash
npm install
```

### 3. Installer les dépendances du backend
```bash
cd server
npm install
cd ..
```

### 4. Configurer MongoDB

Assurez-vous que MongoDB est en cours d'exécution. Si vous utilisez MongoDB Atlas, récupérez votre connection string.

### 5. Configurer les variables d'environnement

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedding-db
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=admin123
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Créer le compte admin
```bash
cd server
node scripts/initAdmin.js
cd ..
```

## ▶️ Démarrage

### Démarrer le backend (Terminal 1)
```bash
cd server
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### Démarrer le frontend (Terminal 2)
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite)

## 📚 Structure du projet

```
mariage-de-oncle/
├── server/                 # Backend Node.js
│   ├── config/            # Configuration MongoDB
│   ├── models/            # Modèles Mongoose (Guest, User)
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware (auth, etc.)
│   ├── scripts/           # Scripts utilitaires
│   └── server.js          # Point d'entrée du serveur
├── components/            # Composants React
├── services/              # Services API frontend
├── assets/                # Images et ressources
└── package.json           # Dépendances frontend
```

## 🔌 API Endpoints

### Invités (Guests)
- `POST /api/guests` - Créer un nouvel invité (RSVP)
- `GET /api/guests` - Liste tous les invités (Admin)
- `GET /api/guests/stats` - Statistiques (Admin)
- `GET /api/guests/:id` - Détails d'un invité (Admin)
- `PUT /api/guests/:id` - Mettre à jour un invité (Admin)
- `DELETE /api/guests/:id` - Supprimer un invité (Admin)

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/register` - Créer un compte admin
- `GET /api/auth/me` - Récupérer l'utilisateur connecté

## 🔐 Authentification

Les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

## 📝 Utilisation

1. **Pour les invités :** Accédez au site, remplissez le formulaire RSVP
2. **Pour l'admin :** Cliquez sur "Admin" dans la navbar, connectez-vous avec les identifiants configurés dans `.env`

## 🛠️ Technologies utilisées

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT pour l'authentification
- bcrypt pour le hashage des mots de passe

## 📄 Licence

ISC
