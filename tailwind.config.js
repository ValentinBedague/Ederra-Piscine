// Nautea Piscine - Configuration Tailwind (génère css/nautea.css : npm run build:css)
// À relancer après tout ajout ou changement de classes dans les pages ou les scripts.
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'nautea-white': '#FFFFFF',
        'nautea-teal': '#0399A6',   // turquoise vif (titres, accents)
        'nautea-lagoon': '#0A7F8C', // turquoise foncé (boutons texte blanc)
        'nautea-cyan': '#4FD1DB',   // cyan lumineux (accents sur fond sombre)
        'nautea-deep': '#03354A',   // bleu pétrole (texte, footer)
        'nautea-aqua': '#D4EDED',   // aqua clair (fonds)
      },
      fontFamily: { sans: ['DM Sans', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
