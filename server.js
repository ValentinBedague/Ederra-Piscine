// Nautea Piscine - Serveur du site (Railway)
//
// - Sert uniquement les fichiers publics du site (pages, css, js, images, icônes)
// - Adresses propres : /prestations sert prestations.html, /prestations.html redirige vers /prestations
// - /api/contact : envoi des formulaires par email (api/contact.js, via Resend)
// - Redirige nautea-piscine.fr vers www.nautea-piscine.fr, et http vers https
//
// Variables d'environnement : PORT (fourni par Railway), RESEND_API_KEY, CONTACT_EMAIL, FROM_EMAIL

const path = require('path');
const express = require('express');
const contact = require('./api/contact.js');

const app = express();
const ROOT = __dirname;
const DOMAINE = 'nautea-piscine.fr';
const PAGES = ['prestations', 'contact', 'revendeurs', 'revendeur'];
const FICHIERS_RACINE = ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'];

app.disable('x-powered-by');
app.set('trust proxy', true); // Railway passe par un proxy : protocole et domaine d'origine dans X-Forwarded-*

// Vérification de santé Railway (appel interne direct, avant toute redirection)
app.get('/health', (req, res) => res.status(200).send('ok'));

// https + www (en ligne seulement : le proxy Railway indique le protocole d'origine)
app.use((req, res, next) => {
  const viaHttp = req.get('x-forwarded-proto') === 'http';
  if (req.hostname === DOMAINE || viaHttp) {
    const hote = req.hostname === DOMAINE ? `www.${DOMAINE}` : req.hostname;
    return res.redirect(301, `https://${hote}${req.originalUrl}`);
  }
  next();
});

// Formulaires
app.post('/api/contact', express.json({ limit: '20kb' }), contact);
app.all('/api/contact', contact); // autres méthodes -> 405 renvoyé par le gestionnaire

// Adresses propres : /index.html -> /, /prestations.html -> /prestations (la query string est conservée)
app.get(/^\/(index|prestations|contact|revendeurs|revendeur)\.html$/, (req, res) => {
  const page = req.params[0] === 'index' ? '/' : `/${req.params[0]}`;
  const query = req.originalUrl.slice(req.path.length);
  res.redirect(301, page + query);
});

// Pages
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
for (const page of PAGES) {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(ROOT, `${page}.html`)));
}

// Fichiers statiques publics (rien d'autre du projet n'est exposé)
const statique = { maxAge: '1d', fallthrough: true, index: false };
for (const dossier of ['css', 'js', 'images']) {
  app.use(`/${dossier}`, express.static(path.join(ROOT, dossier), statique));
}
for (const fichier of FICHIERS_RACINE) {
  app.get(`/${fichier}`, (req, res) => res.sendFile(path.join(ROOT, fichier), { maxAge: '7d' }));
}

// Introuvable : fichier (image, script…) -> 404, adresse de page -> retour à l'accueil
app.use((req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Fichier introuvable');
  res.redirect(302, '/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Nautea Piscine : http://localhost:${port}`));
