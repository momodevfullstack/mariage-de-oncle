# ✅ Configuration finale Vercel

## 🔗 URL Backend Railway
```
mariage-de-oncle-production.up.railway.app
```

## 📋 Configuration Vercel - Variable d'environnement

### Étape 1 : Aller dans Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet `mon-mariage`
3. Cliquez sur **"Settings"** (Paramètres)
4. Cliquez sur **"Environment Variables"** (Variables d'environnement)

### Étape 2 : Ajouter/Modifier VITE_API_URL

**Si la variable existe déjà :**
1. Cliquez sur `VITE_API_URL` pour la modifier
2. Changez la valeur par :

```
https://mariage-de-oncle-production.up.railway.app/api
```

**Si la variable n'existe pas :**
1. Cliquez sur **"Add New"** ou **"Add Variable"**
2. **Key** : `VITE_API_URL`
3. **Value** : `https://mariage-de-oncle-production.up.railway.app/api`
4. **Environments** : Cochez les trois cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquez sur **"Save"**

### Étape 3 : Redéployer

1. Vercel devrait redéployer automatiquement
2. Sinon, allez dans **"Deployments"**
3. Cliquez sur les trois points (⋮) du dernier déploiement
4. Sélectionnez **"Redeploy"**

### Étape 4 : Vérifier

1. Attendez 2-3 minutes que le déploiement se termine
2. Rafraîchissez votre site Vercel
3. Testez le formulaire RSVP
4. L'erreur "Failed to fetch" devrait disparaître ! ✅

## 🧪 Test de l'API

Vous pouvez tester directement l'API dans votre navigateur :
```
https://mariage-de-oncle-production.up.railway.app/api
```

Vous devriez voir :
```json
{
  "message": "API Wedding - Backend opérationnel! 🎉",
  "version": "1.0.0"
}
```

## ✅ Checklist

- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Valeur : `https://mariage-de-oncle-production.up.railway.app/api`
- [ ] Environnements : Production, Preview, Development cochés
- [ ] Vercel redéployé
- [ ] Formulaire testé et fonctionnel

Une fois ces étapes terminées, tout devrait fonctionner ! 🎉

