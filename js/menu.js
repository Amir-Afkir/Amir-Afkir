// ============================
// MENU BURGER : OUVERTURE / FERMETURE
// ============================

const menuBtn   = document.getElementById('menu-btn');
const closeBtn  = document.getElementById('menu-close');
const body      = document.body;

// Ouvrir le menu avec le bouton burger
menuBtn.addEventListener('click', () => {
  body.classList.toggle('nav-open');
});

/*
// Fermer le menu avec la croix
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    body.classList.remove('nav-open');
  });
}*/

// Fermer le menu en cliquant en dehors de la nav
document.addEventListener('click', (e) => {
  const nav = document.querySelector('nav ul');

  if (
    body.classList.contains('nav-open') &&
    !nav.contains(e.target) &&
    !menuBtn.contains(e.target) &&
    (!closeBtn || !closeBtn.contains(e.target))
  ) {
    body.classList.remove('nav-open');
  }
});


// ============================
// NAVIGATION ACTIVE SCROLL
// ============================

document.addEventListener('DOMContentLoaded', () => {
  const OFFSET   = 150;
  const links    = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id   = entry.target.getAttribute('id');
          const link = links.find(a => a.getAttribute('href') === `#${id}`);
          if (link) {
            link.classList.toggle('active', entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: 0,
      }
    );
    sections.forEach(sec => io.observe(sec));
  } else {
    // Fallback (ex: IE11)
    const setActive = () => {
      let currentId = null;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= OFFSET && rect.bottom >= OFFSET) {
          currentId = sec.id;
        }
      });
      links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`)
      );
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
});
