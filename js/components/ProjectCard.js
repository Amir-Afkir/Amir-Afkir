const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function renderProjectCard(project) {
  const container = document.getElementById('project-container');
  if (!container) return;

  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('aria-labelledby', `project-title-${project.id}`);

  const statusBadge = !project.date
    ? '<span class="badge status ongoing">🟡 En cours</span>'
    : '';

  const title = escapeHtml(project.title);
  const description = escapeHtml(project.description);

  card.innerHTML = `
    <div class="project-image">
      <img
        src="${escapeHtml(project.image)}"
        alt="Aperçu du projet ${title}"
        width="300"
        height="300"
        loading="lazy"
        decoding="async"
      >
      ${statusBadge}
    </div>
    <div class="project-info">
      <h3 id="project-title-${escapeHtml(project.id)}">${title}</h3>
      <p>${description}</p>
      <ul>${project.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
      <div class="project-actions">
        ${project.demo ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer" class="btn-primary">Voir le site <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : ''}
        ${project.code ? `<a href="${escapeHtml(project.code)}" target="_blank" rel="noopener noreferrer" class="btn-outline"><i class="fa-solid fa-code" aria-hidden="true"></i> Code source</a>` : ''}
        <button class="project-btn btn-modal" aria-haspopup="dialog" aria-controls="project-modal" data-project="${escapeHtml(project.id)}">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i> Voir plus
        </button>
      </div>
    </div>
  `;

  container.appendChild(card);
}
