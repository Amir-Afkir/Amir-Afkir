export function setupModalListeners() {
  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.project;
      const modal = document.getElementById(`modal-${id}`);
      modal.style.display = 'flex';

      // Focus accessibilité
      const title = modal.querySelector('h3');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus();
      }
    });
  });

  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Accessibilité clavier : fermer avec "Escape"
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
}