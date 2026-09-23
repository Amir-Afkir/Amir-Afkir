import {
  ensureProjectModal,
  populateProjectModal,
  clearProjectModal
} from './ProjectModal.js';

const getFocusableElements = modal =>
  [...modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(element => !element.hidden && element.offsetParent !== null);

export function setupModalListeners(projects) {
  const container = document.getElementById('project-container');
  if (!container) return;

  const projectById = new Map(projects.map(project => [String(project.id), project]));
  const modal = ensureProjectModal();
  const closeButton = modal.querySelector('.close');
  let opener = null;

  const closeModal = () => {
    if (modal.hidden) return;

    modal.classList.remove('is-open');
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    clearProjectModal(modal);

    opener?.focus();
    opener = null;
  };

  const openModal = (project, trigger) => {
    opener = trigger;
    populateProjectModal(modal, project);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      closeButton?.focus();
    });
  };

  container.addEventListener('click', event => {
    const button = event.target.closest('.project-btn');
    if (!button) return;

    const project = projectById.get(String(button.dataset.project));
    if (project) openModal(project, button);
  });

  closeButton?.addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(modal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
