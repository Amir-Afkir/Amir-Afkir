// fichier : ./js/filtres.js (version ES Module optimisée)

// ———————————————————————————————
// Constantes et références DOM partagées
// ———————————————————————————————

const ICONS = {
  CMS: 'fas fa-database',
  'Front-end': 'fas fa-paint-brush',
  'Back-end': 'fas fa-cogs',
  SEO: 'fas fa-search',
  Jeux: 'fas fa-gamepad',
  default: 'fas fa-globe',
};

const getFilterButton = category => {
  const li = document.createElement('li');
  li.dataset.filter = category.toLowerCase();
  li.innerHTML = `<i class="${ICONS[category] || ICONS.default}"></i><span>${category}</span>`;
  return li;
};

const syncActiveFilter = (from, to) => {
  const active = from.querySelector('li.active');
  if (active) {
    to.querySelector('li.active')?.classList.remove('active');
    to.querySelector(`li[data-filter="${active.dataset.filter}"]`)?.classList.add('active');
  }
};

const sortByDate = (a, b) => {
  if (!a.date && b.date) return -1;
  if (a.date && !b.date) return 1;
  return b.date?.localeCompare(a.date || '') || 0;
};

export function generateCategoryFilters(projects) {
  projects.sort(sortByDate);
  const filterList = document.querySelector('.project-filters');
  const categories = [...new Set(projects.map(p => p.category))];

  filterList.innerHTML = '';
  const allBtn = getFilterButton('Tous');
  allBtn.classList.add('active');
  allBtn.dataset.filter = 'all';
  filterList.appendChild(allBtn);

  categories.forEach(cat => filterList.appendChild(getFilterButton(cat)));
}

export function setupCategoryFilterListeners(projects, renderCard, renderModal, setupModals) {
  const container = document.getElementById('project-container');

  const applyFilter = category => {
    container.innerHTML = '';
    const filtered = (category === 'all' ? projects : projects.filter(p => p.category.toLowerCase() === category)).sort(sortByDate);
    filtered.forEach(p => {
      renderCard(p);
      renderModal(p);
    });
    setupModals();
  };

  document.querySelectorAll('.project-filters li').forEach(btn =>
    btn.addEventListener('click', () => {
      document.querySelector('.project-filters li.active')?.classList.remove('active');
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    })
  );
}

export function initMobileFilterSheet() {
  const fab = document.getElementById('fab-filter');
  const sheet = document.getElementById('filter-sheet');
  const backdrop = document.getElementById('filter-backdrop');
  const closeBtn = document.getElementById('filter-close');
  const sidebar = document.querySelector('.project-sidebar .project-filters');
  const sheetList = document.querySelector('.sheet-filters');
  const projetsSec = document.getElementById('projets');

  if (![fab, sheet, backdrop, closeBtn, sidebar, sheetList, projetsSec].every(Boolean)) return;

  sheetList.innerHTML = sidebar.innerHTML;

  new IntersectionObserver(([entry]) => {
    fab.classList.toggle('show', entry.isIntersecting);
  }, { rootMargin: '-100px' }).observe(projetsSec);

  const lockBody = () => document.body.classList.add('no-scroll');
  const unlockBody = () => document.body.classList.remove('no-scroll');

  const closeSheet = () => {
    unlockBody();
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
    sheet.addEventListener('transitionend', () => {
      sheet.hidden = true;
      backdrop.classList.remove('show');
      document.removeEventListener('click', outsideClickHandler);
      fab.classList.add('show');
    }, { once: true });
  };

  const openSheet = () => {
    lockBody();
    backdrop.classList.add('show');
    fab.classList.remove('show');
    sheet.hidden = false;
    requestAnimationFrame(() => {
      sheet.classList.add('show');
      sheet.setAttribute('aria-hidden', 'false');
    });
    syncActiveFilter(sidebar, sheetList);
    document.addEventListener('click', outsideClickHandler);
    if (closeBtn.offsetParent !== null) closeBtn.focus();
  };

  const outsideClickHandler = e => {
    if (!sheet.contains(e.target) && !fab.contains(e.target)) closeSheet();
  };

  fab.addEventListener('click', () => (sheet.hidden || !sheet.classList.contains('show') ? openSheet() : closeSheet()));
  closeBtn.addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => e.key === 'Escape' && !sheet.hidden && closeSheet());

  sheetList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', e => {
      e.stopPropagation();
      sheetList.querySelector('li.active')?.classList.remove('active');
      li.classList.add('active');
      document.removeEventListener('click', outsideClickHandler);
      document.querySelector(`.project-filters li[data-filter="${li.dataset.filter}"]`)?.click();
      setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);
    });
  });
}