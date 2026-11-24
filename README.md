# Nautea Piscine - Site vitrine

Site vitrine en HTML (Tailwind CSS compilé, JavaScript vanilla), servi par un petit serveur Node/Express
hébergé sur **Railway**. Le serveur sert directement les fichiers (le CSS compilé est versionné).

## Structure

```
├── index.html            # Accueil
├── prestations.html      # Nos Prestations
├── contact.html          # Contact + formulaires Particulier / Revendeur
├── revendeurs.html       # Liste des revendeurs
├── revendeur.html        # Fiche revendeur (/revendeur#identifiant, non indexée)
├── mentions-legales.html # Mentions légales (infos [entre crochets] à fournir par le client)
├── confidentialite.html  # Politique de confidentialité (idem)
├── 404.html              # Page introuvable (vraie erreur 404)
├── robots.txt, sitemap.xml
├── css/source.css        # Styles : source Tailwind + styles personnalisés
├── css/nautea.css        # CSS compilé (généré, ne pas modifier à la main)
├── tailwind.config.js    # Couleurs et police de la charte
├── fonts/                # Police DM Sans (hébergée sur le site)
├── js/site.js            # Menu mobile, modales, envoi des formulaires
├── js/revendeurs.js      # Affichage des pages revendeurs
├── js/revendeurs-data.js # Liste des revendeurs (seul fichier à modifier pour en ajouter)
├── images/               # Photos (WebP + JPG d’origine) et logos
├── assets/originaux/     # Photos non utilisées (non publiées)
├── api/contact.js        # Envoi des formulaires par email (Resend)
└── server.js             # Serveur Express (pages, adresses propres, /api/contact, redirections)
```

Seuls les pages, `css/`, `js/`, `images/`, `fonts/`, les icônes, `robots.txt` et `sitemap.xml` sont publiés : le reste du projet n'est pas accessible en ligne.

## Lancer le site en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

Sans `RESEND_API_KEY`, les formulaires répondent « L'envoi n'est pas encore configuré » (rien n'est envoyé).

## Styles (Tailwind)

Après tout ajout ou changement de classes Tailwind dans les pages ou les scripts, regénérer le CSS puis le committer :

```bash
npm run build:css
```

Nouvelle page : l’ajouter dans `server.js` (`PAGES` et redirection `.html`) et dans `sitemap.xml`.

## Formulaires

| Formulaire | Destinataire |
|---|---|
| Contact : Particulier | `CONTACT_EMAIL` |
| Contact : Revendeur | `CONTACT_EMAIL` |
| Fiche revendeur : Demande de devis | email du revendeur, `CONTACT_EMAIL` en copie cachée |

## Déploiement (Railway)

Railway déploie automatiquement à chaque push sur `main` (commande `npm start`, port 8080 sur le domaine).
Vérification de santé conseillée dans Railway (Settings > Deploy > Healthcheck Path) : `/health`.

Variables d'environnement du service :

| Variable | Obligatoire | Valeur |
|---|---|---|
| `RESEND_API_KEY` | oui | clé Resend « Sending access » limitée à `nautea-piscine.fr` |
| `CONTACT_EMAIL` | non | défaut : `contact@nautea-piscine.fr` |
| `FROM_EMAIL` | non | défaut : `Nautea Piscine <formulaire@nautea-piscine.fr>` |

Le serveur redirige `nautea-piscine.fr` vers `https://www.nautea-piscine.fr`. Vérification de santé : `/health`.
