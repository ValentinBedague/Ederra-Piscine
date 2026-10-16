// Nautea Piscine - Envoi des formulaires par email (fonction Vercel + API Resend)
//
// Variables d'environnement (Vercel > Settings > Environment Variables) :
//   RESEND_API_KEY  clé API Resend (obligatoire)
//   CONTACT_EMAIL   destinataire Nautea (défaut : contact@nautea-piscine.fr)
//   FROM_EMAIL      expéditeur, sur le domaine vérifié dans Resend
//
// Routage :
//   particulier      (page Contact)   -> CONTACT_EMAIL
//   revendeur        (page Contact)   -> CONTACT_EMAIL
//   devis-revendeur  (fiche revendeur) -> email du revendeur, CONTACT_EMAIL en copie cachée
// L'email du revendeur est lu ici, côté serveur, depuis js/revendeurs-data.js : le navigateur
// n'envoie que l'identifiant du revendeur, impossible donc de détourner le formulaire.

const REVENDEURS = require('../js/revendeurs-data.js');

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@nautea-piscine.fr';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Nautea Piscine <formulaire@nautea-piscine.fr>';

const FORMULAIRES = {
  particulier: {
    titre: 'Demande particulier',
    champs: { prenom: 'Prénom', nom: 'Nom', email: 'Email', telephone: 'Téléphone', departement: 'Département', 'type-projet': 'Type de projet', message: 'Message' },
    requis: ['prenom', 'nom', 'email', 'telephone', 'departement', 'type-projet', 'message'],
  },
  revendeur: {
    titre: 'Candidature revendeur',
    champs: { prenom: 'Prénom', nom: 'Nom', societe: 'Société', siret: 'N° SIRET', tva: 'N° TVA intracommunautaire', adresse: 'Adresse', codepostal: 'Code postal', email: 'Email professionnel', telephone: 'Téléphone', activite: 'Activité', message: 'Message' },
    requis: ['prenom', 'nom', 'societe', 'siret', 'adresse', 'codepostal', 'email', 'telephone', 'activite', 'message'],
  },
  'devis-revendeur': {
    titre: 'Demande de devis',
    champs: { prenom: 'Prénom', nom: 'Nom', email: 'Email', telephone: 'Téléphone', departement: 'Département', 'type-projet': 'Type de projet', message: 'Message' },
    requis: ['prenom', 'nom', 'email', 'telephone', 'departement', 'type-projet', 'message'],
  },
};

const TYPES_PROJET = { 'kit-autonome': 'Kit Autonome', 'kit-accompagne': 'Kit Accompagné', 'prete-a-plonger': 'Prête-à-Plonger' };
const MAX_LONGUEUR = { message: 5000 };
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const propre = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim(); // champ d'une ligne (pas d'injection d'en-têtes)

function construireEmail(type, def, data, revendeur) {
  const lignes = Object.entries(def.champs)
    .filter(([cle]) => data[cle])
    .map(([cle, label]) => [label, cle === 'type-projet' ? (TYPES_PROJET[data[cle]] || data[cle]) : data[cle]]);
  if (revendeur) lignes.unshift(['Revendeur', `${revendeur.nom} – ${revendeur.ville}`]);

  const qui = `${data.prenom} ${data.nom}`;
  const sujet = revendeur
    ? `${def.titre} – ${revendeur.ville} – ${qui}`
    : `${def.titre} – ${qui}${type === 'revendeur' ? ` (${data.societe})` : ''}`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#D4EDED;font-family:Arial,Helvetica,sans-serif;color:#03354A">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;border-top:4px solid #0399A6">
    <tr><td style="padding:24px 28px 8px">
      <p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#0399A6;font-weight:bold">Nautea Piscine · formulaire du site</p>
      <h1 style="margin:8px 0 0;font-size:22px">${esc(def.titre)}${revendeur ? ` – ${esc(revendeur.ville)}` : ''}</h1>
    </td></tr>
    <tr><td style="padding:16px 28px 8px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5">
        ${lignes.map(([label, val]) => `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#0A7F8C;font-weight:bold;white-space:nowrap">${esc(label)}</td><td style="padding:8px 0;vertical-align:top">${esc(val).replace(/\n/g, '<br>')}</td></tr>`).join('')}
      </table>
    </td></tr>
    <tr><td style="padding:8px 28px 24px;font-size:13px;color:#03354A99">Répondez directement à cet email pour contacter ${esc(qui)}.</td></tr>
  </table>
</body></html>`;
  const text = `${def.titre}${revendeur ? ` – ${revendeur.ville}` : ''}\n\n` + lignes.map(([l, v]) => `${l} : ${v}`).join('\n') + `\n\nRépondez directement à cet email pour contacter ${qui}.`;
  return { sujet, html, text };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, erreur: 'Méthode non autorisée' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, erreur: 'Requête invalide' });

  // Champ piège invisible : rempli = robot. On répond "ok" sans rien envoyer.
  if (body.site_web) return res.status(200).json({ ok: true });

  const type = body.formulaire;
  const def = FORMULAIRES[type];
  if (!def) return res.status(400).json({ ok: false, erreur: 'Formulaire inconnu' });

  const data = {};
  for (const cle of Object.keys(def.champs)) {
    const brut = String(body[cle] ?? '').trim();
    const max = MAX_LONGUEUR[cle] || 200;
    if (brut.length > max) return res.status(400).json({ ok: false, erreur: `Champ trop long : ${def.champs[cle]}` });
    data[cle] = cle === 'message' ? brut : propre(brut);
  }
  const manquants = def.requis.filter((cle) => !data[cle]);
  if (manquants.length) return res.status(400).json({ ok: false, erreur: `Champs manquants : ${manquants.map((c) => def.champs[c]).join(', ')}` });
  if (!EMAIL_RE.test(data.email)) return res.status(400).json({ ok: false, erreur: 'Adresse email invalide' });

  let revendeur = null;
  let destinataires = [CONTACT_EMAIL];
  let copieCachee;
  if (type === 'devis-revendeur') {
    revendeur = REVENDEURS.find((r) => r.slug === body.revendeur);
    if (!revendeur) return res.status(400).json({ ok: false, erreur: 'Revendeur inconnu' });
    if (revendeur.email) {
      destinataires = [revendeur.email];
      copieCachee = [CONTACT_EMAIL];
    } // sans email (ne devrait pas arriver) : la demande part quand même à Nautea
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY manquante');
    return res.status(500).json({ ok: false, erreur: "L'envoi n'est pas encore configuré" });
  }

  const { sujet, html, text } = construireEmail(type, def, data, revendeur);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: destinataires,
        ...(copieCachee ? { bcc: copieCachee } : {}),
        reply_to: data.email,
        subject: sujet,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error('Resend', r.status, await r.text());
      return res.status(502).json({ ok: false, erreur: "L'email n'a pas pu être envoyé" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Resend injoignable', e);
    return res.status(502).json({ ok: false, erreur: "L'email n'a pas pu être envoyé" });
  }
};
