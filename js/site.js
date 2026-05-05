// Ederra Piscine - Site interactivity
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
    if (!openBtn || !modal) return;

    const backdrop = modal.querySelector('[data-modal-backdrop]');
    const card = modal.querySelector('[onclick]');

    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      backdrop?.classList.add('modal-backdrop-enter');
      card?.classList.add('modal-card-enter');
      setTimeout(() => {
        backdrop?.classList.remove('modal-backdrop-enter');
        card?.classList.remove('modal-card-enter');
      }, 260);
      document.body.style.overflow = 'hidden';
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

  // Form submissions (prevent default, close modal)
  document.querySelectorAll('[data-modal-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = form.closest('[id^="modal-"]');
      const backdrop = modal?.querySelector('[data-modal-backdrop]');
      const card = modal?.querySelector('[onclick]');
      backdrop?.classList.add('modal-backdrop-leave');
      card?.classList.add('modal-card-leave');
      setTimeout(() => {
        modal?.classList.add('hidden');
        backdrop?.classList.remove('modal-backdrop-leave');
        card?.classList.remove('modal-card-leave');
        document.body.style.overflow = '';
      }, 200);
    });
  });
});
