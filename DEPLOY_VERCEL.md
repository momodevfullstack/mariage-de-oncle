# 🚀 Déploiement sur Vercel - Guide Rapide

## ✅ Base de données nettoyée !

Toutes les données de test ont été supprimées. Vous pouvez maintenant déployer.

## 📋 Étapes pour déployer sur Vercel

### 1. Préparer le repository GitHub

```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Prêt pour déploiement"
git push
```

### 2. Déployer le Frontend sur Vercel

#### Via le site web (Recommandé) :

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"**
4. Sélectionnez votre repository `mariage-de-oncle`
5. Configuration :
   - **Framework Preset** : `Vite` (détecté automatiquement)
   - **Root Directory** : `.` (racine)
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `dist` (automatique)
6. **Variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez : `VITE_API_URL` = `https://votre-backend-url.railway.app/api`
   - (Vous ajouterez l'URL du backend après l'avoir déployé)
7. Cliquez sur **"Deploy"**

### 3. Déployer le Backend (Railway - Gratuit)

Vercel n'est pas idéal pour les backends Node.js. Utilisez **Railway** (gratuit) :

1. Allez sur [railway.app](https://railway.app)
2. Créez un compte (avec GitHub)
3. Cliquez sur **"New Project"** → **"Deploy from GitHub repo"**
4. Sélectionnez votre repository
5. Configuration :
   - **Root Directory** : `server`
   - **Start Command** : `npm start`
6. **Variables d'environnement** (Settings → Variables) :
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://mrdevs:Momo11794591%40@clustermariage.wwrfmom.mongodb.net/wedding-db?retryWrites=true&w=majority
   JWT_SECRET=wedding_secret_jwt_2025_guy_olive_mariage_secure_key
   ADMIN_EMAIL=admin@mariage.com
   ADMIN_PASSWORD=admin123
   ```
7. Railway génère automatiquement une URL (ex: `https://votre-app.railway.app`)
8. Copiez cette URL et mettez à jour `VITE_API_URL` dans Vercel

### 4. Mettre à jour l'URL du backend dans Vercel

1. Retournez sur Vercel
2. Allez dans **Settings** → **Environment Variables**
3. Modifiez `VITE_API_URL` avec l'URL Railway : `https://votre-app.railway.app/api`
4. Redéployez (automatique ou manuel)

## 🎯 Résumé rapide

1. ✅ Base de données nettoyée
2. 📤 Push sur GitHub
3. 🚀 Déployer frontend sur Vercel
4. 🚂 Déployer backend sur Railway
5. 🔗 Connecter les deux avec `VITE_API_URL`

## ⚡ Commandes utiles

```bash
# Tester le build localement
npm run build

# Voir le résultat
npm run preview

# Nettoyer la base de données (si besoin)
cd server
node scripts/clearDatabase.js
```

## 📝 Notes importantes

- **MongoDB Atlas** : Déjà configuré et fonctionnel
- **CORS** : Déjà configuré dans le backend
- **Variables d'environnement** : N'oubliez pas de les configurer dans Railway ET Vercel
- **HTTPS** : Les deux plateformes fournissent HTTPS automatiquement

## 🆘 En cas de problème

- Vérifiez les logs dans Railway (onglet "Deployments")
- Vérifiez les logs dans Vercel (onglet "Deployments")
- Testez l'API directement : `https://votre-backend.railway.app/api`

Bon déploiement ! 🎉

