const ICONS = {
  CMS: 'fas fa-database',
  'Front-end': 'fas fa-paint-brush',
  'Back-end': 'fas fa-cogs',
  'Full-stack': 'fas fa-code-branch',
  SEO: 'fas fa-search',
  Jeux: 'fas fa-gamepad',
  default: 'fas fa-globe',
};

const sortByDate = (a, b) => {
  if (!a.date && b.date) return -1;
  if (a.date && !b.date) return 1;
  return b.date?.localeCompare(a.date || '') || 0;
};

const createFilterItem = category => {
  const value = category === 'Tous' ? 'all' : category.toLowerCase();
  const item = document.createElement('li');
  item.dataset.filter = value;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'filter-button';
  button.dataset.filter = value;
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML =
    `<i class="${ICONS[category] || ICONS.default}" aria-hidden="true"></i><span>${category}</span>`;

  item.appendChild(button);
  return item;
};

const setActiveFilter = (list, category) => {
  list.querySelectorAll('li').forEach(item => {
    const active = item.dataset.filter === category;
    item.classList.toggle('active', active);
    item.querySelector('button')?.setAttribute('aria-pressed', String(active));
  });
};

const syncActiveFilter = (from, to) => {
  const active = from.querySelector('li.active')?.dataset.filter || 'all';
  setActiveFilter(to, active);
};

export function generateCategoryFilters(projects) {
  projects.sort(sortByDate);
  const filterList = document.querySelector('.project-filters');
  if (!filterList) return;

  const categories = [...new Set(projects.map(project => project.category))];
  filterList.replaceChildren();

  const all = createFilterItem('Tous');
  all.classList.add('active');
  all.querySelector('button')?.setAttribute('aria-pressed', 'true');
  filterList.appendChild(all);

  categories.forEach(category => filterList.appendChild(createFilterItem(category)));
}

export function setupCategoryFilterListeners(projects, renderCard) {
  const container = document.getElementById('project-container');
  const filterList = document.querySelector('.project-filters');
  if (!container || !filterList) return;

  const applyFilter = category => {
    const filtered = (category === 'all'
      ? projects
      : projects.filter(project => project.category.toLowerCase() === category)
    ).sort(sortByDate);

    container.replaceChildren();
    filtered.forEach(renderCard);
  };

  filterList.addEventListener('click', event => {
    const button = event.target.closest('.filter-button');
    if (!button) return;

    setActiveFilter(filterList, button.dataset.filter);
    applyFilter(button.dataset.filter);
  });
}

export function initMobileFilterSheet() {
  const fab = document.getElementById('fab-filter');
  const sheet = document.getElementById('filter-sheet');
  const backdrop = document.getElementById('filter-backdrop');
  const closeButton = document.getElementById('filter-close');
  const desktopList = document.querySelector('.project-sidebar .project-filters');
  const sheetList = document.querySelector('.sheet-filters');
  const projectsSection = document.getElementById('projets');

  if (![fab, sheet, backdrop, closeButton, desktopList, sheetList, projectsSection].every(Boolean)) return;

  fab.hidden = false;
  sheet.hidden = true;
  sheet.setAttribute('aria-hidden', 'true');
  sheetList.innerHTML = desktopList.innerHTML;

  const observer = new IntersectionObserver(([entry]) => {
    fab.classList.toggle('show', entry.isIntersecting && sheet.hidden);
  }, { rootMargin: '-100px' });
  observer.observe(projectsSection);

  const closeSheet = ({ restoreFocus = true } = {}) => {
    document.body.classList.remove('no-scroll');
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('show');
    sheet.hidden = true;
    fab.classList.add('show');
    if (restoreFocus) fab.focus();
  };

  const openSheet = () => {
    document.body.classList.add('no-scroll');
    backdrop.classList.add('show');
    fab.classList.remove('show');
    sheet.hidden = false;
    syncActiveFilter(desktopList, sheetList);

    requestAnimationFrame(() => {
      sheet.classList.add('show');
      sheet.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    });
  };

  fab.addEventListener('click', () => sheet.hidden ? openSheet() : closeSheet());
  closeButton.addEventListener('click', () => closeSheet());
  backdrop.addEventListener('click', () => closeSheet());

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !sheet.hidden) closeSheet();
  });

  sheetList.addEventListener('click', event => {
    const button = event.target.closest('.filter-button');
    if (!button) return;

    setActiveFilter(sheetList, button.dataset.filter);
    const desktopButton = desktopList.querySelector(
      `.filter-button[data-filter="${CSS.escape(button.dataset.filter)}"]`
    );
    desktopButton?.click();
    closeSheet({ restoreFocus: false });
  });
}
