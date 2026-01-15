# 🔧 Correction "Failed to fetch" - Guide Pas à Pas

## ❌ Problème
L'erreur "Failed to fetch" signifie que le frontend Vercel ne peut pas communiquer avec le backend Railway.

## ✅ Solutions à vérifier

### Étape 1 : Vérifier l'URL du backend Railway

1. Allez sur **Railway** → votre service `mariage-de-oncle`
2. Cliquez sur l'onglet **"Settings"** (Paramètres)
3. Cherchez la section **"Networking"** ou **"Domains"**
4. Vous devriez voir une URL publique, par exemple :
   - `https://mariage-de-oncle-production.up.railway.app`
   - Ou `https://servermariage-production.up.railway.app`
5. **Copiez cette URL complète**

### Étape 2 : Configurer VITE_API_URL dans Vercel

1. Allez sur **Vercel** → votre projet `mon-mariage`
2. Cliquez sur **"Settings"** (Paramètres)
3. Cliquez sur **"Environment Variables"** (Variables d'environnement)
4. **Cherchez** `VITE_API_URL` dans la liste
5. **Si elle existe** :
   - Cliquez dessus pour la modifier
   - Vérifiez que la valeur est : `https://VOTRE-URL-RAILWAY/api`
   - Remplacez `VOTRE-URL-RAILWAY` par l'URL que vous avez copiée à l'étape 1
   - Assurez-vous que `/api` est à la fin
6. **Si elle n'existe pas** :
   - Cliquez sur **"Add New"**
   - Key : `VITE_API_URL`
   - Value : `https://VOTRE-URL-RAILWAY/api`
   - Environnements : Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **"Save"**

### Étape 3 : Redéployer Vercel

1. Après avoir modifié/sauvegardé la variable
2. Vercel devrait redéployer automatiquement
3. Sinon, allez dans **"Deployments"** → cliquez sur les trois points (⋮) → **"Redeploy"**

### Étape 4 : Tester l'API directement

Avant de tester le formulaire, testez l'API directement dans votre navigateur :

Ouvrez cette URL (remplacez par votre URL Railway) :
```
https://VOTRE-URL-RAILWAY/api
```

Vous devriez voir :
```json
{"message":"API Wedding - Backend opérationnel! 🎉","version":"1.0.0"}
```

Si ça fonctionne, l'API est accessible. Si ça ne fonctionne pas, il y a un problème avec Railway.

### Étape 5 : Vérifier CORS

Le backend a déjà `app.use(cors())` configuré, donc CORS devrait fonctionner. Mais si le problème persiste, on peut le rendre plus spécifique.

## 🔍 Vérifications supplémentaires

### Vérifier que Railway est bien exposé

1. Dans Railway → Settings → Networking
2. Vérifiez que le service est **"Exposed"** (Exposé)
3. Si ce n'est pas le cas, cliquez sur **"Generate Domain"** ou **"Expose"**

### Vérifier les logs Railway

1. Dans Railway → Deployments → Logs
2. Vérifiez qu'il n'y a pas d'erreurs
3. Le serveur doit être en cours d'exécution

## 📝 Format de l'URL

L'URL doit être exactement dans ce format :
```
https://mariage-de-oncle-production.up.railway.app/api
```

**Important** :
- ✅ Commence par `https://`
- ✅ Se termine par `/api`
- ✅ Pas d'espace avant ou après
- ✅ Pas de `/` à la fin après `/api`

## 🧪 Test final

Une fois tout configuré :
1. Attendez que Vercel redéploie (2-3 minutes)
2. Rafraîchissez votre site Vercel
3. Essayez à nouveau le formulaire
4. L'erreur "Failed to fetch" devrait disparaître

Si le problème persiste, dites-moi quelle URL vous avez dans Railway et je vous aiderai à la configurer correctement.

