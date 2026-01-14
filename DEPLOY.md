# 🚀 Guide de déploiement sur Vercel

## Préparation

### 1. Nettoyer la base de données (optionnel)

Si vous voulez supprimer toutes les données de test :

```bash
cd server
node scripts/clearDatabase.js
```

### 2. Variables d'environnement pour le frontend

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=https://votre-backend-url.vercel.app/api
```

## Déploiement du Frontend sur Vercel

### Option 1 : Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Configurez :
   - **Framework Preset** : Vite
   - **Root Directory** : `.` (racine)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Ajoutez les variables d'environnement :
   - `VITE_API_URL` : URL de votre backend
6. Cliquez sur "Deploy"

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

## Déploiement du Backend

⚠️ **Important** : Vercel est principalement conçu pour le frontend. Pour le backend Node.js, vous avez plusieurs options :

### Option 1 : Vercel Serverless Functions (Recommandé)

Le backend peut être déployé sur Vercel en tant que fonctions serverless.

1. Créez un dossier `api` à la racine
2. Adaptez le code pour les fonctions serverless
3. Déployez avec le frontend

### Option 2 : Services dédiés (Recommandé pour MongoDB)

- **Railway** : [railway.app](https://railway.app) - Gratuit avec limitations
- **Render** : [render.com](https://render.com) - Gratuit avec limitations
- **Fly.io** : [fly.io](https://fly.io) - Gratuit avec limitations

### Configuration Railway (Exemple)

1. Créez un compte sur Railway
2. Créez un nouveau projet
3. Connectez votre repository
4. Configurez :
   - **Root Directory** : `server`
   - **Start Command** : `npm start`
5. Ajoutez les variables d'environnement :
   ```
   PORT=5000
   MONGODB_URI=votre_uri_mongodb_atlas
   JWT_SECRET=votre_secret
   ADMIN_EMAIL=admin@mariage.com
   ADMIN_PASSWORD=admin123
   ```

## Variables d'environnement nécessaires

### Frontend (.env)
```env
VITE_API_URL=https://votre-backend-url.railway.app/api
```

### Backend (Railway/Render/etc.)
```env
PORT=5000
MONGODB_URI=mongodb+srv://mrdevs:Momo11794591%40@clustermariage.wwrfmom.mongodb.net/wedding-db?retryWrites=true&w=majority
JWT_SECRET=wedding_secret_jwt_2025_guy_olive_mariage_secure_key
ADMIN_EMAIL=admin@mariage.com
ADMIN_PASSWORD=admin123
```

## Après le déploiement

1. Mettez à jour `VITE_API_URL` dans Vercel avec l'URL de votre backend
2. Testez le formulaire RSVP
3. Testez la connexion admin
4. Vérifiez que les données sont bien sauvegardées dans MongoDB Atlas

## Notes importantes

- MongoDB Atlas est déjà configuré et fonctionne
- Le backend doit être accessible publiquement pour que le frontend puisse l'appeler
- Assurez-vous que CORS est bien configuré dans le backend
- Les variables d'environnement doivent être configurées dans les deux plateformes (frontend et backend)

