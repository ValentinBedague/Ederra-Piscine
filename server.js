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
const PAGES = ['prestations', 'contact', 'revendeurs', 'revendeur', 'mentions-legales', 'confidentialite'];
const FICHIERS_RACINE = ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml'];

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
app.get(/^\/(index|prestations|contact|revendeurs|revendeur|mentions-legales|confidentialite)\.html$/, (req, res) => {
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
// Police : fichier qui ne change jamais, mis en cache 1 an
app.use('/fonts', express.static(path.join(ROOT, 'fonts'), { ...statique, maxAge: '365d', immutable: true }));
for (const fichier of FICHIERS_RACINE) {
  app.get(`/${fichier}`, (req, res) => res.sendFile(path.join(ROOT, fichier), { maxAge: fichier.endsWith('.png') || fichier.endsWith('.svg') ? '7d' : '1d' }));
}

// Introuvable : vraie erreur 404 (pas de redirection vers l'accueil, que Google traiterait en « soft 404 »)
app.use((req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Fichier introuvable');
  res.status(404).sendFile(path.join(ROOT, '404.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Nautea Piscine : http://localhost:${port}`));
