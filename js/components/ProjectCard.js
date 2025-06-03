export function renderProjectCard(project) {
  const container = document.getElementById('project-container');
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('aria-labelledby', `project-title-${project.id}`);
  card.innerHTML = `
    <img src="${project.image}" alt="Aperçu du projet ${project.title}">
    <div class="project-info">
      <h3 id="project-title-${project.id}">${project.title}</h3>
      <p>${project.description}</p>
      <ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <div class="project-actions">
        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn-primary">Voir le site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
        ${project.code ? `<a href="${project.code}" target="_blank" class="btn-outline"><i class="fa-solid fa-code"></i> Code source</a>` : ''}
        <button class="project-btn btn-modal" aria-haspopup="dialog" aria-controls="modal-${project.id}" data-project="${project.id}">
          <i class="fa-solid fa-circle-info"></i> Voir plus
        </button>
      </div>
    </div>
  `;
  container.appendChild(card);
}
