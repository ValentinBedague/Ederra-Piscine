// Nautea Piscine - Site interactivity
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Modals
  function initModal(openBtnId, modalId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const backdrop = modal.querySelector('[data-modal-backdrop]');
    const card = modal.querySelector('[onclick]');

    const open = () => {
      // Après un envoi réussi, la modale rouvre sur un formulaire vierge
      modal.querySelectorAll('[data-form-succes]').forEach(el => el.remove());
      modal.querySelectorAll('[data-modal-form]').forEach(f => { f.hidden = false; });
      modal.classList.remove('hidden');
      backdrop?.classList.add('modal-backdrop-enter');
      card?.classList.add('modal-card-enter');
      setTimeout(() => {
        backdrop?.classList.remove('modal-backdrop-enter');
        card?.classList.remove('modal-card-enter');
      }, 260);
      document.body.style.overflow = 'hidden';
    };
    openBtn?.addEventListener('click', open);
    // Boutons ajoutés dynamiquement (ex. fiche revendeur) : data-modal-open="<id de la modale>"
    document.addEventListener('click', (e) => {
      if (e.target.closest(`[data-modal-open="${modalId}"]`)) open();
    });

    const close = () => {
      backdrop?.classList.add('modal-backdrop-leave');
      card?.classList.add('modal-card-leave');
      setTimeout(() => {
        modal.classList.add('hidden');
        backdrop?.classList.remove('modal-backdrop-leave');
        card?.classList.remove('modal-card-leave');
        document.body.style.overflow = '';
      }, 200);
    };

    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', close);
    });

    modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', close);
  }

  initModal('btn-particulier', 'modal-particulier');
  initModal('btn-revendeur', 'modal-revendeur');

  // /contact#revendeur (lien "Devenir revendeur") : ouvre directement le formulaire revendeur
  if (location.hash === '#revendeur') document.getElementById('btn-revendeur')?.click();

  // Envoi des formulaires vers api/contact.js (email via Resend)
  document.querySelectorAll('[data-modal-form]').forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    const libelle = submitBtn?.textContent;

    const afficherErreur = (message) => {
      form.querySelector('[data-form-erreur]')?.remove();
      const p = document.createElement('p');
      p.setAttribute('data-form-erreur', '');
      p.setAttribute('role', 'alert');
      p.className = 'text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3';
      p.innerHTML = `${message}<br>Vous pouvez aussi nous appeler au <a href="tel:0540073565" class="font-semibold underline">05 40 07 35 65</a>.`;
      submitBtn?.parentElement.before(p);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.envoi) return;
      form.dataset.envoi = '1';
      form.querySelector('[data-form-erreur]')?.remove();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

      try {
        const donnees = Object.fromEntries(new FormData(form));
        donnees.formulaire = form.dataset.formType;
        const r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donnees),
        });
        const reponse = await r.json().catch(() => ({}));
        if (!r.ok || !reponse.ok) throw new Error(r.status === 400 && reponse.erreur ? reponse.erreur : "Votre demande n'a pas pu être envoyée.");

        form.reset();
        form.hidden = true;
        const merci = document.createElement('div');
        merci.setAttribute('data-form-succes', '');
        merci.className = 'text-center py-8';
        merci.innerHTML = `
          <div class="mx-auto w-14 h-14 rounded-full bg-nautea-aqua text-nautea-lagoon flex items-center justify-center text-2xl">✓</div>
          <p class="text-xl font-bold text-nautea-deep mt-4">Merci, votre demande a bien été envoyée !</p>
          <p class="text-nautea-deep/80 mt-2">Nous revenons vers vous rapidement.</p>
          <button type="button" class="mt-6 bg-nautea-lagoon hover:bg-nautea-deep text-white font-semibold px-8 py-3 rounded transition-colors">Fermer</button>`;
        merci.querySelector('button').addEventListener('click', () => form.closest('[id^="modal-"]')?.querySelector('[data-modal-close]')?.click());
        form.after(merci);
      } catch (err) {
        afficherErreur(err.message || "Votre demande n'a pas pu être envoyée.");
      } finally {
        delete form.dataset.envoi;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = libelle; }
      }
    });
  });
});
