// Ederra Piscine - Pages "Nos revendeurs" (liste) et "revendeur" (fiche), générées depuis js/revendeurs-data.js
(() => {
  const REVENDEURS = window.EDERRA_REVENDEURS || [];

  const DEPARTEMENTS = {
    '09': 'Ariège', '11': 'Aude', '12': 'Aveyron', '16': 'Charente', '17': 'Charente-Maritime',
    '19': 'Corrèze', '24': 'Dordogne', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde',
    '40': 'Landes', '46': 'Lot', '47': 'Lot-et-Garonne', '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées', '79': 'Deux-Sèvres', '81': 'Tarn', '82': 'Tarn-et-Garonne', '87': 'Haute-Vienne',
  };

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const departement = (r) => {
    const code = String(r.codePostal || '').slice(0, 2);
    return code ? `${code}${DEPARTEMENTS[code] ? ' · ' + DEPARTEMENTS[code] : ''}` : '';
  };
  const villeComplete = (r) => [r.codePostal, r.ville].filter(Boolean).join(' ');
  const adresseComplete = (r) => [r.adresse, villeComplete(r), 'France'].filter(Boolean).join(', ');
  const telHref = (t) => 'tel:' + String(t).replace(/[^\d+]/g, '');
  const siteHref = (s) => (/^https?:\/\//.test(s) ? s : 'https://' + s);
  const ficheUrl = (r) => `revendeur.html#${encodeURIComponent(r.slug)}`;

  const ICONS = {
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/><path d="M10 21v-5h4v5"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  };
  const icon = (name, cls = 'w-5 h-5') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls} shrink-0" aria-hidden="true">${ICONS[name]}</svg>`;

  // Photo de la devanture, ou visuel turquoise par défaut
  const visuel = (r, cls) => r.photo
    ? `<img src="${esc(r.photo)}" alt="Devanture de ${esc(r.nom)} à ${esc(r.ville)}" class="${cls} object-cover">`
    : `<div class="${cls} bg-water flex flex-col items-center justify-center gap-2 text-white/85">${icon('store', 'w-12 h-12')}<span class="text-sm font-medium tracking-wide">Photo de la devanture à venir</span></div>`;

  const badgeExemple = (r) => r.exemple
    ? '<span class="bg-ederra-deep text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">Exemple</span>'
    : '';

  // ---------- Liste ----------
  function carte(r) {
    const dep = departement(r);
    return `
      <a href="${ficheUrl(r)}" class="group flex flex-col bg-white rounded overflow-hidden shadow-xl shadow-ederra-deep/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-ederra-teal">
        <div class="relative aspect-[4/3] overflow-hidden">
          ${visuel(r, 'w-full h-full group-hover:scale-105 transition-transform duration-300')}
          <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            ${dep ? `<span class="bg-white/95 text-ederra-deep text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">${esc(dep)}</span>` : '<span></span>'}
            ${badgeExemple(r)}
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <p class="text-ederra-teal text-sm font-semibold uppercase tracking-wide">${esc(r.ville)}</p>
          <h2 class="text-xl font-bold text-ederra-deep mt-1 mb-4">${esc(r.nom)}</h2>
          <ul class="space-y-2 text-sm text-ederra-deep/80 mb-6">
            <li class="flex items-start gap-2 text-ederra-teal">${icon('pin', 'w-4 h-4 mt-0.5')}<span class="text-ederra-deep/80">${r.adresse ? esc(r.adresse) + '<br>' : ''}${esc(villeComplete(r))}</span></li>
            ${r.telephone ? `<li class="flex items-center gap-2 text-ederra-teal">${icon('phone', 'w-4 h-4')}<span class="text-ederra-deep/80">${esc(r.telephone)}</span></li>` : ''}
          </ul>
          <span class="mt-auto inline-flex items-center gap-2 text-ederra-teal font-semibold group-hover:gap-3 transition-all">Voir la fiche <span aria-hidden="true">→</span></span>
        </div>
      </a>`;
  }

  function initListe(root) {
    root.querySelector('[data-grille]').innerHTML = REVENDEURS.map(carte).join('');
    root.querySelector('[data-compteur]').textContent = `${REVENDEURS.length} revendeur${REVENDEURS.length > 1 ? 's' : ''}`;
  }

  // ---------- Fiche ----------
  function ligne(ic, label, contenu) {
    return `
      <li class="flex items-start gap-4">
        <span class="w-10 h-10 rounded-full bg-ederra-aqua text-ederra-lagoon flex items-center justify-center">${icon(ic)}</span>
        <div><p class="text-xs font-semibold uppercase tracking-wider text-ederra-teal">${label}</p><div class="text-ederra-deep mt-0.5">${contenu}</div></div>
      </li>`;
  }

  function initFiche(root) {
    const slug = decodeURIComponent(location.hash.slice(1));
    const r = REVENDEURS.find((x) => x.slug === slug);
    if (!r) {
      root.querySelector('[data-introuvable]').classList.remove('hidden');
      return;
    }
    const adresse = adresseComplete(r);
    const mapsQuery = encodeURIComponent(adresse);
    document.title = `${r.nom} - ${r.ville} | Revendeur Ederra Piscine`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${r.nom}, revendeur Ederra Piscine à ${r.ville} : adresse, plan d'accès et contact.`);

    const aCompleter = (champ) => `<span class="italic text-ederra-deep/60">${champ} à compléter</span>`;
    const coords = [
      ligne('pin', 'Adresse', `${r.adresse ? esc(r.adresse) : aCompleter('Adresse')}<br>${esc(villeComplete(r))}`),
      ligne('phone', 'Téléphone', r.telephone ? `<a href="${telHref(r.telephone)}" class="hover:text-ederra-teal transition-colors">${esc(r.telephone)}</a>` : aCompleter('Téléphone')),
      ligne('mail', 'Email', r.email ? `<a href="mailto:${esc(r.email)}" class="hover:text-ederra-teal transition-colors break-all">${esc(r.email)}</a>` : aCompleter('Email')),
      r.site && ligne('globe', 'Site web', `<a href="${esc(siteHref(r.site))}" target="_blank" rel="noopener noreferrer" class="hover:text-ederra-teal transition-colors break-all">${esc(r.site.replace(/^https?:\/\//, ''))}</a>`),
      r.horaires && ligne('clock', 'Horaires', esc(r.horaires).replace(/\n/g, '<br>')),
    ].filter(Boolean).join('');

    // Modale "Demande Particulier" de la fiche : indique le revendeur concerné
    const nomRevendeur = `${r.nom} – ${r.ville}`;
    const champRevendeur = document.querySelector('#modal-particulier [name="revendeur"]');
    if (champRevendeur) champRevendeur.value = nomRevendeur;
    const mention = document.querySelector('#modal-particulier [data-modal-revendeur]');
    if (mention) mention.textContent = r.ville;

    root.querySelector('[data-fiche]').innerHTML = `
      <section class="pt-20 md:pt-28 bg-water">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-white">
          <a href="revendeurs.html" class="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">← Tous les revendeurs</a>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="text-white/90 text-sm font-semibold uppercase tracking-widest">${esc(departement(r))}</span>
            ${badgeExemple(r)}
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mt-2 text-shadow-hero">${esc(r.nom)}</h1>
          <p class="text-xl md:text-2xl text-white/90 font-light mt-2">${esc(r.ville)}</p>
        </div>
      </section>

      <section class="py-12 md:py-16 bg-gradient-to-b from-ederra-aqua to-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-start">
          <div class="rounded overflow-hidden shadow-xl shadow-ederra-deep/15">
            ${visuel(r, 'w-full aspect-[4/3]')}
          </div>
          <div class="bg-white rounded shadow-xl shadow-ederra-deep/10 border-t-4 border-ederra-teal p-6 md:p-8">
            <h2 class="text-2xl font-bold text-ederra-deep mb-4">Coordonnées</h2>
            ${r.situation ? `<p class="text-ederra-deep/80 leading-relaxed mb-6 pl-4 border-l-4 border-ederra-aqua">${esc(r.situation)}</p>` : ''}
            <ul class="space-y-5">${coords}</ul>
            <div class="mt-8 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              ${r.telephone ? `<a href="${telHref(r.telephone)}" class="flex-1 inline-flex items-center justify-center gap-2 bg-ederra-lagoon hover:bg-ederra-deep text-white font-semibold px-5 py-3 rounded transition-colors">${icon('phone', 'w-4 h-4')} Appeler</a>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 border-2 border-ederra-teal text-ederra-lagoon hover:bg-ederra-aqua font-semibold px-5 py-3 rounded transition-colors">${icon('route', 'w-4 h-4')} Itinéraire</a>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl md:text-4xl font-bold text-ederra-teal mb-6">Plan d'accès</h2>
          <div class="rounded overflow-hidden shadow-xl shadow-ederra-deep/15 border-4 border-white">
            <iframe src="https://www.google.com/maps?q=${mapsQuery}&output=embed" title="Plan d'accès - ${esc(r.nom)}, ${esc(r.ville)}" class="w-full h-[320px] md:h-[440px] block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div class="mt-12 bg-water rounded p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p class="text-2xl md:text-3xl font-bold text-white text-shadow-hero">Un projet piscine ?</p>
              <p class="text-white/90 text-lg mt-1">Demandez votre devis, nous vous mettons en relation avec ce revendeur.</p>
            </div>
            <button type="button" data-modal-open="modal-particulier" class="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-ederra-aqua text-ederra-deep font-semibold px-8 py-4 rounded shadow-lg shadow-ederra-deep/30 hover:-translate-y-0.5 transition-all">Demander un devis →</button>
          </div>
        </div>
      </section>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const liste = document.querySelector('[data-page-revendeurs]');
    const fiche = document.querySelector('[data-page-revendeur]');
    if (liste) initListe(liste);
    if (fiche) { initFiche(fiche); window.addEventListener('hashchange', () => location.reload()); }
  });
})();
