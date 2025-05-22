export function renderProjectModal(project) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `modal-${project.id}`;
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" aria-label="Fermer">&times;</span>
        <h3>${project.title}</h3>
        <div class="carousel">
          ${project.gallery.map(item =>
            item.endsWith('.webm')
              ? `<video src="${item}" autoplay muted loop></video>`
              : `<img src="${item}" alt="${project.title}">`
          ).join('')}
        </div>
        <p>${project.description}</p>
        <ul>
          <li><strong>Objectif :</strong> ${project.details.objectif}</li>
          <li><strong>Stack :</strong> ${project.details.stack}</li>
          <li><strong>Challenges :</strong> ${project.details.challenges}</li>
        </ul>
        <div class="project-actions">
          ${project.demo ? `<a href="${project.demo}" class="btn-primary" target="_blank">Voir le site</a>` : ''}
          ${project.code ? `<a href="${project.code}" class="btn-outline" target="_blank">Voir le code</a>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }