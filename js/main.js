// fichier : ./js/main.js (point d'entrée global ES Module)

import { setupActiveScrollNavigation } from './menu.js';
import { generateCategoryFilters, setupCategoryFilterListeners, initMobileFilterSheet } from './filtres.js';
import { renderProjectCard } from './components/ProjectCard.js';
import { renderProjectModal } from './components/ProjectModal.js';
import { setupModalListeners } from './components/ModalListeners.js';
import { setupContactFormValidation } from './components/FormValidation.js';

// /js/utils/dom.js (ou directement dans main.js)
export function adjustForBottomNav() {
  const nav    = document.querySelector('.bottom-nav');
  const wrapper = document.querySelector('main') || document.querySelector('.main-container');
  if (!nav || !wrapper) return;

  const height = nav.offsetHeight;
  wrapper.style.paddingBottom = `${height}px`;
}

// Appel au démarrage et au resize
window.addEventListener('DOMContentLoaded', adjustForBottomNav);
window.addEventListener('resize', adjustForBottomNav);


// Point d'entrée de l'application
document.addEventListener('DOMContentLoaded', () => { 
  setupActiveScrollNavigation();
  setupContactFormValidation(); 

  fetch('./data/projects.json')
    .then(res => res.json())
    .then(projects => {
      generateCategoryFilters(projects);
      setupCategoryFilterListeners(projects, renderProjectCard, renderProjectModal, setupModalListeners);
      initMobileFilterSheet();
      projects.forEach(renderProjectCard);
      projects.forEach(renderProjectModal);
      setupModalListeners();
    })
    .catch(err => console.error("Erreur de chargement JSON :", err));
});
