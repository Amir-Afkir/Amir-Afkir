export function setupModalListeners() {
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