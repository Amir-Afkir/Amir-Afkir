// utils/dom.js (ou dans main.js)
export function setupMobileNavSpacer() {
  const nav = document.querySelector('.bottom-nav');
  const container = document.querySelector('main') || document.querySelector('.main-container');

  function updateSpacer() {
    const navHeight = nav.offsetHeight;
    // sur iOS, safe-area s'ajoute automatiquement avec env(), sinon 0
    const safeInset = parseInt(
      getComputedStyle(nav).getPropertyValue('padding-bottom'),
      10
    ) || 0;
    container.style.paddingBottom = `${navHeight + safeInset}px`;
  }

  window.addEventListener('resize', updateSpacer);
  document.addEventListener('DOMContentLoaded', updateSpacer);
}
