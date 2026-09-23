import { setupActiveScrollNavigation } from './menu.js';
import {
  generateCategoryFilters,
  setupCategoryFilterListeners,
  initMobileFilterSheet
} from './filtres.js';
import { renderProjectCard } from './components/ProjectCard.js';
import { setupModalListeners } from './components/ModalListeners.js';
import { setupContactFormValidation } from './components/FormValidation.js';

document.addEventListener('DOMContentLoaded', async () => {
  setupActiveScrollNavigation();
  setupContactFormValidation();

  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const projects = await response.json();

    generateCategoryFilters(projects);
    setupCategoryFilterListeners(projects, renderProjectCard);
    initMobileFilterSheet();
    setupModalListeners(projects);

    projects.forEach(renderProjectCard);
  } catch (error) {
    console.error('Erreur de chargement des projets :', error);
    const container = document.getElementById('project-container');
    if (container) {
      container.innerHTML =
        '<p class="error" role="alert">Impossible de charger les projets. Veuillez réessayer plus tard.</p>';
    }
  }
});
