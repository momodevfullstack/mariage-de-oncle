# ✅ Configuration finale - Déploiement

## 🎉 Backend déployé sur Railway !

**URL du backend :** `https://servermariage-production.up.railway.app`

## 📋 Configuration Vercel (Frontend)

### 1. Variables d'environnement dans Vercel

1. Allez sur votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez cette variable :

```
VITE_API_URL = https://servermariage-production.up.railway.app/api
```

4. Sélectionnez **Production**, **Preview**, et **Development**
5. Cliquez sur **Save**
6. **Redéployez** votre application (ou attendez le prochain déploiement)

### 2. Test de l'API

Testez que votre backend fonctionne :
- Ouvrez : `https://servermariage-production.up.railway.app/api`
- Vous devriez voir : `{"message":"API Wedding - Backend opérationnel! 🎉","version":"1.0.0"}`

### 3. Vérification finale

Une fois Vercel redéployé avec la variable d'environnement :

1. ✅ Testez le formulaire RSVP sur votre site Vercel
2. ✅ Vérifiez que les données sont sauvegardées dans MongoDB Atlas
3. ✅ Testez la connexion admin
4. ✅ Vérifiez le dashboard admin

## 🔗 URLs importantes

- **Frontend (Vercel)** : `https://votre-projet.vercel.app`
- **Backend (Railway)** : `https://servermariage-production.up.railway.app`
- **API Endpoint** : `https://servermariage-production.up.railway.app/api`

## 🎯 Checklist finale

- [x] Backend déployé sur Railway
- [ ] Frontend déployé sur Vercel
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Test du formulaire RSVP
- [ ] Test de la connexion admin
- [ ] Vérification des données dans MongoDB Atlas

## 🆘 En cas de problème

### Erreur CORS
Si vous avez des erreurs CORS, vérifiez que dans `server/server.js`, CORS est bien configuré :
```javascript
app.use(cors()); // Devrait accepter toutes les origines
```

### L'API ne répond pas
- Vérifiez les logs dans Railway (onglet "Deployments" → "View logs")
- Vérifiez que le port est bien configuré (Railway utilise automatiquement le PORT de l'environnement)

### Les données ne se sauvegardent pas
- Vérifiez que `MONGODB_URI` est bien configuré dans Railway
- Vérifiez les logs pour voir les erreurs de connexion MongoDB

Bon déploiement ! 🚀

