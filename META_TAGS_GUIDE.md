# 📱 Configuration des métadonnées pour le partage social

## ✅ Ce qui a été fait

J'ai ajouté toutes les balises meta nécessaires dans `index.html` pour que votre site s'affiche correctement lorsqu'il est partagé sur :
- ✅ WhatsApp
- ✅ Instagram
- ✅ Facebook
- ✅ Twitter/X
- ✅ LinkedIn
- ✅ Telegram
- ✅ Et autres applications de messagerie

## 🔧 Action requise après déploiement

Une fois votre site déployé sur Vercel, vous devez **remplacer l'URL** dans `index.html` :

### À remplacer :
```html
https://votre-site.vercel.app
```

### Par votre URL Vercel réelle :
```html
https://mariage-guy-olive.vercel.app
```
(ou l'URL que Vercel vous donnera)

### Fichier à modifier : `index.html`

Remplacez dans ces lignes :
- Ligne 13 : `<meta property="og:url" content="...">`
- Ligne 16 : `<meta property="og:image" content="...">`
- Ligne 24 : `<meta name="twitter:url" content="...">`
- Ligne 27 : `<meta name="twitter:image" content="...">`

## 📸 Image de prévisualisation

L'image utilisée est : `/assets/principale.jpg`

**Recommandations pour l'image :**
- Taille idéale : 1200x630 pixels (ratio 1.91:1)
- Format : JPG ou PNG
- Taille fichier : < 1MB pour un chargement rapide
- L'image doit être accessible publiquement (dans le dossier `assets/`)

Si vous voulez utiliser une autre image, remplacez `principale.jpg` par le nom de votre image dans les balises meta.

## 🧪 Tester les métadonnées

### Avant le déploiement :
1. Testez localement avec : https://www.opengraph.xyz/
2. Ou utilisez : https://developers.facebook.com/tools/debug/

### Après le déploiement :
1. **Facebook Debugger** : https://developers.facebook.com/tools/debug/
   - Entrez votre URL
   - Cliquez sur "Scrape Again" pour rafraîchir le cache

2. **Twitter Card Validator** : https://cards-dev.twitter.com/validator
   - Entrez votre URL pour tester

3. **LinkedIn Post Inspector** : https://www.linkedin.com/post-inspector/
   - Entrez votre URL

4. **WhatsApp** : Partagez simplement le lien dans une conversation WhatsApp pour voir l'aperçu

## 📋 Ce qui s'affichera lors du partage

- **Titre** : "Mariage de Guy-Morel & Olive - 13 Février 2026"
- **Description** : "Venez célébrer avec nous notre union ! Le 13 Février 2026, Guy-Morel & Olive s'unissent pour l'éternité en Côte d'Ivoire. Confirmez votre présence."
- **Image** : La photo principale du couple
- **URL** : Votre lien Vercel

## ⚠️ Important

1. **Cache des réseaux sociaux** : Les réseaux sociaux mettent en cache les métadonnées. Si vous modifiez les meta tags après le premier partage, utilisez les outils de débogage pour forcer le rafraîchissement.

2. **HTTPS requis** : Assurez-vous que votre site utilise HTTPS (Vercel le fait automatiquement).

3. **Image accessible** : L'image doit être accessible via une URL absolue (pas relative).

## 🎯 Checklist finale

- [ ] Site déployé sur Vercel
- [ ] URL remplacée dans `index.html` (4 endroits)
- [ ] Image `/assets/principale.jpg` accessible
- [ ] Test avec Facebook Debugger
- [ ] Test avec un partage WhatsApp
- [ ] Vérification que tout s'affiche correctement

Une fois ces étapes terminées, votre site s'affichera magnifiquement lors du partage ! 🎉

