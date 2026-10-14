// Liste des revendeurs Ederra Piscine — seul fichier à modifier pour ajouter / changer un revendeur.
//
// Pour ajouter un revendeur : copier un bloc { ... }, puis remplir les champs.
//   slug       identifiant unique utilisé dans l'adresse de sa page (minuscules, tirets, sans accents)
//              ex. 'piscines-dupont-bayonne' -> revendeur.html#piscines-dupont-bayonne
//   photo      photo de la devanture, à déposer dans images/revendeurs/ (laisser '' = visuel par défaut)
//   situation  court paragraphe affiché dans les coordonnées (ex. 'Le magasin se situe à l'entrée de la zone…')
//   telephone, email : laisser '' si inconnu (affiché "à compléter")
//   site, horaires : laisser '' si inconnu, la ligne n'est alors pas affichée
//   exemple    true = fiche de démonstration (badge "Exemple") — à supprimer pour les vrais revendeurs
window.EDERRA_REVENDEURS = [
  {
    slug: 'exemple-bayonne',
    nom: 'Revendeur exemple',
    adresse: '',
    codePostal: '64100',
    ville: 'Bayonne',
    telephone: '',
    email: '',
    site: '',
    horaires: '',
    situation: 'Le magasin se situe … (à compléter : quartier, repère proche, stationnement).',
    photo: '',
    exemple: true,
  },
  {
    slug: 'exemple-pau',
    nom: 'Revendeur exemple',
    adresse: '',
    codePostal: '64000',
    ville: 'Pau',
    telephone: '',
    email: '',
    site: '',
    horaires: '',
    situation: 'Le magasin se situe … (à compléter : quartier, repère proche, stationnement).',
    photo: '',
    exemple: true,
  },
  {
    slug: 'exemple-mont-de-marsan',
    nom: 'Revendeur exemple',
    adresse: '',
    codePostal: '40000',
    ville: 'Mont-de-Marsan',
    telephone: '',
    email: '',
    site: '',
    horaires: '',
    situation: 'Le magasin se situe … (à compléter : quartier, repère proche, stationnement).',
    photo: '',
    exemple: true,
  },
];
