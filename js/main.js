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

document.addEventListener('DOMContentLoaded', async () => {
  // 1) Initialisations globales
  setupActiveScrollNavigation();
  setupContactFormValidation();

  // 2) Chargement des projets
  try {
    const res = await fetch('./data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    // 3) Génération des filtres et listeners
    generateCategoryFilters(projects);
    setupCategoryFilterListeners(
      projects,
      renderProjectCard,
      renderProjectModal,
      setupModalListeners
    );
    initMobileFilterSheet();

    // 4) Rendu initial (tous les projets)
    projects.forEach(renderProjectCard);
    projects.forEach(renderProjectModal);
    setupModalListeners();

  } catch (err) {
    console.error('Erreur de chargement JSON :', err);
    const container = document.getElementById('project-container');
    if (container) {
      container.innerHTML = '<p class="error">Impossible de charger les projets. Veuillez réessayer plus tard.</p>';
    }
  }
});
