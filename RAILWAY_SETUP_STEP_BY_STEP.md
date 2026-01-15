# 🚂 Configuration Railway - Guide Pas à Pas

## 📋 Étape 1 : Root Directory (Répertoire racine)

Dans les paramètres Railway que vous voyez :

1. **Cherchez la section "Source"** (que vous voyez actuellement)
2. **Cliquez sur le lien** : "Ajouter le répertoire racine" (Add root directory)
3. **Dans le champ qui apparaît**, tapez : `server`
4. **Sauvegardez**

Cela indique à Railway d'utiliser uniquement le dossier `server/` et pas tout le projet.

---

## 📋 Étape 2 : Variables d'environnement

1. **Cliquez sur l'onglet "Variables"** (à côté de "Paramètres")
2. **Ajoutez ces variables une par une** :

### Variable 1 : MONGODB_URI
- **Key** : `MONGODB_URI`
- **Value** : `mongodb+srv://mrdevs:Momo11794591%40@clustermariage.wwrfmom.mongodb.net/wedding-db?retryWrites=true&w=majority`
- Cliquez sur **"Add"**

### Variable 2 : JWT_SECRET
- **Key** : `JWT_SECRET`
- **Value** : `wedding_secret_jwt_2025_guy_olive_mariage_secure_key`
- Cliquez sur **"Add"**

### Variable 3 : ADMIN_EMAIL
- **Key** : `ADMIN_EMAIL`
- **Value** : `admin@mariage.com`
- Cliquez sur **"Add"**

### Variable 4 : ADMIN_PASSWORD
- **Key** : `ADMIN_PASSWORD`
- **Value** : `admin123`
- Cliquez sur **"Add"**

### Variable 5 : PORT (optionnel)
- **Key** : `PORT`
- **Value** : `5000`
- Cliquez sur **"Add"**
- ⚠️ Note : Railway assigne automatiquement un port, mais c'est bien de le mettre quand même

---

## 📋 Étape 3 : Start Command (Commande de démarrage)

1. **Dans les paramètres**, cherchez la section **"Build"** ou **"Déployer"**
2. **Start Command** : `npm start`
   - Ou laissez Railway détecter automatiquement (il devrait trouver `npm start` dans `server/package.json`)

---

## 📋 Étape 4 : Vérifier le déploiement

1. **Retournez sur l'onglet "Déploiements"**
2. **Vérifiez les logs** :
   - Vous devriez voir : `🚀 Serveur démarré sur le port 8080` (ou un autre port)
   - Si vous voyez encore l'erreur MongoDB, passez à l'étape 5

---

## 📋 Étape 5 : Autoriser MongoDB Atlas

1. Allez sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Network Access** → **Add IP Address**
3. Cliquez sur **"Allow Access from Anywhere"**
4. Cliquez sur **"Confirm"**
5. Attendez 1-2 minutes
6. **Retournez sur Railway** → **Restart** le service

---

## ✅ Vérification finale

Dans les logs Railway, vous devriez voir :
```
✅ MongoDB connecté : ac-3qvtr2l-shard-00-01.wwrfmom.mongodb.net
🚀 Serveur démarré sur le port 8080
```

Si vous voyez ça, c'est bon ! 🎉

