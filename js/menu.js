// fichier : ./js/menu.js
  
  export function setupActiveScrollNavigation() {
    const OFFSET = 150;
    const links = [...document.querySelectorAll('nav a[href^="#"]')];
    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
  
    if (sections.length === 0) return;
  
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          const link = links.find(a => a.getAttribute('href') === `#${id}`);
          if (link) {
            link.classList.toggle('active', entry.isIntersecting);
          }
        });
      }, {
        root: null,
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: 0,
      });
  
      sections.forEach(sec => observer.observe(sec));
    } else {
      // Fallback pour anciens navigateurs
      const setActive = () => {
        let currentId = null;
        sections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= OFFSET && rect.bottom >= OFFSET) {
            currentId = sec.id;
          }
        });
  
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
      };
  
      window.addEventListener('scroll', setActive, { passive: true });
      setActive();
    }
  }
  