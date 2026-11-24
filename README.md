# Nautea Piscine - Site vitrine

Site vitrine en HTML (Tailwind CSS via CDN, JavaScript vanilla), servi par un petit serveur Node/Express
hébergé sur **Railway**. Aucun build : le serveur sert directement les fichiers.

## Structure

```
├── index.html            # Accueil
├── prestations.html      # Nos Prestations
├── contact.html          # Contact + formulaires Particulier / Revendeur
├── revendeurs.html       # Liste des revendeurs
├── revendeur.html        # Fiche revendeur (revendeur.html#identifiant)
├── css/style.css         # Styles personnalisés
├── js/site.js            # Menu mobile, modales, envoi des formulaires
├── js/revendeurs.js      # Affichage des pages revendeurs
├── js/revendeurs-data.js # Liste des revendeurs (seul fichier à modifier pour en ajouter)
├── images/               # Photos et logos
├── api/contact.js        # Envoi des formulaires par email (Resend)
└── server.js             # Serveur Express (pages, adresses propres, /api/contact, redirections)
```

Seuls les pages, `css/`, `js/`, `images/` et les icônes sont publiés : le reste du projet n'est pas accessible en ligne.

## Lancer le site en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

Sans `RESEND_API_KEY`, les formulaires répondent « L'envoi n'est pas encore configuré » (rien n'est envoyé).

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
