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
  
  // ———————————————————————————————
  // Utilitaires
  // ———————————————————————————————
  
  function getFilterButton(category) {
    const li = document.createElement('li');
    li.dataset.filter = category.toLowerCase();
    li.innerHTML = `<i class="${ICONS[category] || ICONS.default}"></i><span>${category}</span>`;
    return li;
  }
  
  function syncActiveFilter(fromList, toList) {
    const active = fromList.querySelector('li.active');
    if (!active) return;
    toList.querySelector('li.active')?.classList.remove('active');
    toList.querySelector(`li[data-filter="${active.dataset.filter}"]`)?.classList.add('active');
  }
  
  // ———————————————————————————————
  // Filtres desktop
  // ———————————————————————————————
  
  export function generateCategoryFilters(projects) {
    const filterList = document.querySelector('.project-filters');
    const categories = [...new Set(projects.map(p => p.category))];
  
    filterList.innerHTML = '';
    filterList.appendChild(getFilterButton('Tous'));
    filterList.querySelector('li').classList.add('active');
    filterList.querySelector('li').dataset.filter = 'all';
  
    categories.forEach(cat => {
      filterList.appendChild(getFilterButton(cat));
    });
  }
  
  export function setupCategoryFilterListeners(projects, renderCard, renderModal, setupModals) {
    const container = document.getElementById('project-container');
  
    function applyFilter(category) {
      container.innerHTML = '';
      const filtered = category === 'all'
        ? projects
        : projects.filter(p => p.category.toLowerCase() === category);
  
      filtered.forEach(p => {
        renderCard(p);
        renderModal(p);
      });
      setupModals();
    }
  
    document.querySelectorAll('.project-filters li').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.project-filters li.active')?.classList.remove('active');
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });
  }
  
  
  // ———————————————————————————————
  // Filtres mobile (FAB + Sheet)
  // ———————————————————————————————
  
  export function initMobileFilterSheet() {
    const fab = document.getElementById('fab-filter');
    const sheet = document.getElementById('filter-sheet');
    const backdrop = document.getElementById('filter-backdrop');
    const closeBtn = document.getElementById('filter-close');
    const sidebar = document.querySelector('.project-sidebar .project-filters');
    const sheetList = document.querySelector('.sheet-filters');
    const projetsSec = document.getElementById('projets');
  
    sheetList.innerHTML = sidebar.innerHTML;
  
    new IntersectionObserver(([entry]) => {
      fab.classList.toggle('show', entry.isIntersecting);
    }, { rootMargin: '-100px' }).observe(projetsSec);
  
    const lockBody = () => document.body.classList.add('no-scroll');
    const unlockBody = () => document.body.classList.remove('no-scroll');
  
    let isDragging = false;
  
    function outsideClickHandler(e) {
      if (!isDragging && !sheet.contains(e.target) && !fab.contains(e.target)) {
        closeSheet();
      }
    }
  
    function openSheet() {
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
      closeBtn.focus();
    }
  
    function closeSheet() {
      unlockBody();
      backdrop.classList.remove('show');
      sheet.classList.remove('show');
      sheet.setAttribute('aria-hidden', 'true');
  
      sheet.addEventListener('transitionend', () => {
        sheet.hidden = true;
        document.removeEventListener('click', outsideClickHandler);
        fab.classList.add('show');
      }, { once: true });
    }
  
    fab.addEventListener('click', () => {
      sheet.hidden || !sheet.classList.contains('show') ? openSheet() : closeSheet();
    });
  
    closeBtn.addEventListener('click', closeSheet);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !sheet.hidden) closeSheet();
    });
  
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
  
    let startY = 0, currentY = 0;
    const THRESHOLD = sheet.offsetHeight * 0.25;
    sheet.style.overscrollBehavior = 'contain';
  
    sheet.addEventListener('touchstart', e => {
      isDragging = true;
      startY = e.touches[0].clientY;
      sheet.style.transition = 'none';
      document.removeEventListener('click', outsideClickHandler);
    }, { passive: false });
  
    sheet.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      if (delta > 0 && sheet.scrollTop === 0) {
        e.preventDefault();
        sheet.style.transform = `translateY(${delta}px)`;
      }
    }, { passive: false });
  
    sheet.addEventListener('touchend', () => {
      sheet.style.transition = 'transform 0.3s ease';
      const delta = currentY - startY;
  
      if (delta > THRESHOLD) {
        closeSheet();
      } else {
        sheet.style.transform = '';
        sheet.addEventListener('transitionend', () => {
          if (!sheet.hidden) document.addEventListener('click', outsideClickHandler);
        }, { once: true });
      }
      isDragging = false;
    }, { passive: false });
  }