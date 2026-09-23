const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function ensureProjectModal() {
  let modal = document.getElementById('project-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'project-modal';
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <article class="modal-content" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button type="button" class="close" aria-label="Fermer la fenêtre modale">&times;</button>
      <div class="modal-body"></div>
    </article>
  `;

  document.body.appendChild(modal);
  return modal;
}

export function populateProjectModal(modal, project) {
  const body = modal.querySelector('.modal-body');
  if (!body) return;

  const media = (project.gallery || []).map(item => {
    const source = escapeHtml(item);
    if (/\.(webm|mp4)$/i.test(item)) {
      return `<video src="${source}" controls muted playsinline preload="metadata"></video>`;
    }

    return `<img src="${source}" alt="Capture du projet ${escapeHtml(project.title)}" loading="lazy" decoding="async">`;
  }).join('');

  body.innerHTML = `
    <h3 id="project-modal-title">${escapeHtml(project.title)}</h3>
    <div class="carousel">${media}</div>
    <p>${escapeHtml(project.description)}</p>
    <ul>
      <li><strong>Objectif :</strong> ${escapeHtml(project.details?.objectif)}</li>
      <li><strong>Stack :</strong> ${escapeHtml(project.details?.stack)}</li>
      <li><strong>Challenges :</strong> ${escapeHtml(project.details?.challenges)}</li>
    </ul>
    <div class="project-actions">
      ${project.demo ? `<a href="${escapeHtml(project.demo)}" class="btn-primary" target="_blank" rel="noopener noreferrer">Voir le site</a>` : ''}
      ${project.code ? `<a href="${escapeHtml(project.code)}" class="btn-outline" target="_blank" rel="noopener noreferrer">Voir le code</a>` : ''}
    </div>
  `;
}

export function clearProjectModal(modal) {
  modal.querySelector('.modal-body')?.replaceChildren();
}
