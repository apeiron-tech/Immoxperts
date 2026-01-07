# TarteAuCitron - Installation

## Téléchargement

Les fichiers nécessaires ont été téléchargés automatiquement :

1. ✅ `tarteaucitron.js` - Script principal
2. ✅ `css/tarteaucitron.css` - Styles CSS
3. ✅ `lang/tarteaucitron.fr.js` - Traduction française

### Structure des fichiers

```
src/main/webapp/content/tarteaucitron/
├── tarteaucitron.js          (script principal)
├── css/
│   └── tarteaucitron.css     (styles)
└── lang/
    └── tarteaucitron.fr.js   (traduction française)
```

### Mise à jour manuelle (si nécessaire)

Pour mettre à jour vers une version plus récente :

```bash
# Script principal
curl -o src/main/webapp/content/tarteaucitron/tarteaucitron.js https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@latest/tarteaucitron.js

# CSS
curl -o src/main/webapp/content/tarteaucitron/css/tarteaucitron.css https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@latest/css/tarteaucitron.css

# Langue française
curl -o src/main/webapp/content/tarteaucitron/lang/tarteaucitron.fr.js https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@latest/lang/tarteaucitron.fr.js
```

Les fichiers seront automatiquement copiés lors du build grâce à la configuration webpack.

## Configuration

La configuration est déjà intégrée dans `index.html` :

- Google Analytics bloqué par défaut (`highPrivacy: true`)
- Activation uniquement après consentement utilisateur
- Boutons "Accepter" et "Refuser" activés
- Orientation centrée

## Vérification

Après installation, vérifiez que :

1. Aucun cookie `_ga` n'est créé avant le consentement
2. Google Analytics ne se charge pas avant l'acceptation
3. Le bandeau de consentement s'affiche correctement
