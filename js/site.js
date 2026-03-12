// Ederra Piscine - Site interactivity
document.addEventListener('DOMContentLoaded', () => {
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
    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const close = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', close);
    });

    modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', close);
  }

  initModal('btn-particulier', 'modal-particulier');
  initModal('btn-revendeur', 'modal-revendeur');

  // Form submissions (prevent default, close modal)
  document.querySelectorAll('[data-modal-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.closest('[id^="modal-"]')?.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });
});
