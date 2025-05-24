// fichier : ./js/main.js (point d’entrée global ES Module)

import { setupActiveScrollNavigation } from './menu.js';
import {
  generateCategoryFilters,
  setupCategoryFilterListeners,
  initMobileFilterSheet
} from './filtres.js';
import { renderProjectCard } from './components/ProjectCard.js';
import { renderProjectModal } from './components/ProjectModal.js';
import { setupModalListeners } from './components/ModalListeners.js';
import { setupContactFormValidation } from './components/FormValidation.js';
import { adjustForBottomNav } from './utils/dom.js';

// Réserve l’espace sous la nav mobile
window.addEventListener('DOMContentLoaded', adjustForBottomNav);
window.addEventListener('resize', adjustForBottomNav);

// Point d’entrée de l’application
document.addEventListener('DOMContentLoaded', () => {
  setupActiveScrollNavigation();
  setupContactFormValidation();

  fetch('./data/projects.json')
    .then(res => res.json())
    .then(projects => {
      generateCategoryFilters(projects);
      setupCategoryFilterListeners(
        projects,
        renderProjectCard,
        renderProjectModal,
        setupModalListeners
      );
      initMobileFilterSheet();

      projects.forEach(renderProjectCard);
      projects.forEach(renderProjectModal);
      setupModalListeners();
    })
    .catch(err => console.error("Erreur de chargement JSON :", err));
});
