// fichier : ./js/utils/dom.js
export function adjustForBottomNav() {
  const nav     = document.querySelector('.bottom-nav');
  const wrapper = document.querySelector('main') || document.querySelector('.main-container');
  if (!nav || !wrapper) return;
  wrapper.style.paddingBottom = `${nav.offsetHeight}px`;
}
