// projects.js

fetch('./data/projects.json')
  .then(res => res.json())
  .then(projects => {
    projects.forEach(project => {
      renderProjectCard(project);
      renderProjectModal(project);
    });
    setupModalListeners();
  })
  .catch(err => console.error("Erreur de chargement JSON:", err));

function renderProjectCard(project) {
  const container = document.getElementById('project-container');
  const card = document.createElement('div');
  card.classList.add('project-card');
  card.innerHTML = `
    <img src="${project.image}" alt="${project.title}">
    <div class="project-info">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <ul>${project.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <div class="project-actions">
        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn-primary">Voir le site<i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
        <a href="${project.code}" target="_blank" class="btn-outline"><i class="fa-solid fa-code"></i>Code source</a>
        <button class="project-btn btn-modal" aria-haspopup="dialog" aria-controls="modal-1" data-project="${project.id}"><i class="fa-solid fa-circle-info"></i> Voir plus</button>
      </div>
    </div>
  `;
  container.appendChild(card);
}

function renderProjectModal(project) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.id = `modal-${project.id}`;
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
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
        <a href="${project.code}" class="btn-outline" target="_blank">Voir le code</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function setupModalListeners() {
  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.project;
      document.getElementById(`modal-${id}`).style.display = 'flex';
    });
  });

  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}
