# 🔧 Correction Configuration Railway

## ❌ Problème détecté

Les logs montrent que Caddy démarre au lieu de Node.js. Cela signifie que Railway ne trouve pas votre dossier `server/` ou le `package.json`.

## ✅ Solution : Vérifier la configuration

### Étape 1 : Vérifier le Root Directory

1. Dans Railway, allez dans **"Settings"** (Paramètres)
2. Cherchez la section **"Source"** ou **"Build"**
3. Vérifiez le champ **"Root Directory"** ou **"Répertoire racine"**
4. Il doit contenir : `server`
5. Si c'est vide ou contient autre chose, modifiez-le et mettez : `server`
6. **Sauvegardez**

### Étape 2 : Vérifier le Start Command

1. Toujours dans **"Settings"**
2. Cherchez **"Start Command"** ou **"Commande de démarrage"**
3. Il doit contenir : `npm start`
4. Si c'est vide, ajoutez : `npm start`
5. **Sauvegardez**

### Étape 3 : Vérifier que le dossier server/ existe bien

Dans votre projet GitHub, assurez-vous que le dossier `server/` contient bien :
- ✅ `server.js`
- ✅ `package.json`
- ✅ `models/`
- ✅ `routes/`
- ✅ `config/`

### Étape 4 : Redéployer

1. Après avoir modifié les paramètres, Railway devrait redéployer automatiquement
2. Sinon, allez dans **"Deployments"** → cliquez sur **"Redeploy"** ou **"Deploy"**

### Étape 5 : Vérifier les nouveaux logs

Dans les logs, vous devriez maintenant voir :
```
npm install
...
npm start
> wedding-backend@1.0.0 start
> node server.js
🚀 Serveur démarré sur le port 8080
```

Au lieu des logs Caddy.

## 🔍 Si ça ne fonctionne toujours pas

### Option A : Vérifier la structure GitHub

Assurez-vous que dans votre repository GitHub, le dossier `server/` est bien présent à la racine :
```
mariage-de-oncle/
├── server/
│   ├── server.js
│   ├── package.json
│   └── ...
├── components/
├── App.tsx
└── ...
```

### Option B : Créer un nouveau service Railway

Si le problème persiste :
1. Créez un **nouveau service** dans Railway
2. Connectez-le au même repository GitHub
3. **Immédiatement** configurez :
   - Root Directory : `server`
   - Start Command : `npm start`
4. Ajoutez les variables d'environnement
5. Déployez

## 📝 Checklist de configuration Railway

- [ ] Root Directory = `server`
- [ ] Start Command = `npm start`
- [ ] Variables d'environnement ajoutées (MONGODB_URI, JWT_SECRET, etc.)
- [ ] MongoDB Atlas Network Access configuré (0.0.0.0/0)
- [ ] Logs montrent "npm start" et "node server.js"

Une fois ces étapes faites, votre backend devrait démarrer correctement ! 🚀

