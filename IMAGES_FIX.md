# ✅ Correction des images pour la production

## Problème résolu

Les images ne s'affichaient pas en ligne car elles utilisaient des chemins relatifs (`../assets/` ou `assets/`) qui ne fonctionnent pas correctement en production.

## Solutions appliquées

### 1. ✅ Textes traduits en français
- "Wedding Celebration" → "Célébration de Mariage"
- "CAPTURE STORIES" → "CAPTURER DES INSTANTS"
- "that last a lifetime" → "qui durent toute une vie"

### 2. ✅ Chemins d'images corrigés
Tous les chemins d'images ont été changés de :
- `../assets/image.jpg` → `/assets/image.jpg`
- `assets/image.jpg` → `/assets/image.jpg`

### 3. ✅ Dossier public/assets créé
Pour que les images fonctionnent en production sur Vercel, elles doivent être dans le dossier `public/`. J'ai créé `public/assets/` et copié toutes les images.

## Structure actuelle

```
projet/
├── assets/          (original - gardé pour référence)
├── public/
│   └── assets/      (copie pour production - utilisé par Vite/Vercel)
│       ├── principale.jpg
│       ├── perso_olive.jpeg
│       ├── guy_morel.jpeg
│       └── ... (toutes les autres images)
```

## Comment ça fonctionne

Avec Vite :
- Les fichiers dans `public/` sont servis à la racine du site
- `/assets/image.jpg` pointe vers `public/assets/image.jpg`
- Cela fonctionne en développement ET en production

## Vérification

Toutes les images utilisent maintenant le chemin `/assets/` :
- ✅ `components/Hero.tsx`
- ✅ `components/PersonalizedInvitationCard.tsx`
- ✅ `App.tsx` (toutes les images)

## Déploiement

Lorsque vous déployez sur Vercel :
1. Le dossier `public/assets/` sera automatiquement inclus
2. Les images seront accessibles via `/assets/...`
3. Tout fonctionnera correctement ! 🎉

## Note importante

Le dossier `assets/` original est toujours là. Le dossier `public/assets/` est une copie pour la production. Vous pouvez continuer à travailler avec `assets/` localement, mais en production, Vercel utilisera `public/assets/`.

