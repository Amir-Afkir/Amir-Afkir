// fichier : ./js/menu.js

/**
 * Active la classe "active" sur les liens de navigation
 * en fonction de la section visible à l'écran.
 */
export function setupActiveScrollNavigation() {
  const OFFSET = 150;
  const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = links.find(a => a.getAttribute('href') === `#${id}`);
          if (link) {
            link.classList.toggle('active', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: 0
      }
    );
    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback pour les navigateurs sans IntersectionObserver
    const setActive = () => {
      let currentId = null;
      sections.forEach(section => {
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= OFFSET && bottom >= OFFSET) {
          currentId = section.id;
        }
      });
      links.forEach(link => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
}
