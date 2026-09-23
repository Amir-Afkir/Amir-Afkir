export function setupContactFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('input[required], textarea[required]');
  const status = form.querySelector('.form-success');
  const submitButton = form.querySelector('button[type="submit"]');

  const setFieldState = field => {
    const error = field.parentElement.querySelector('.form-error');
    const value = field.value.trim();
    let valid = Boolean(value);

    if (valid && field.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    field.setAttribute('aria-invalid', String(!valid));
    if (error) error.style.display = valid ? 'none' : 'block';
    return valid;
  };

  fields.forEach(field => {
    field.addEventListener('blur', () => setFieldState(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') setFieldState(field);
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();

    status.textContent = '';
    status.classList.remove('is-success', 'is-error');

    const valid = [...fields].every(setFieldState);
    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const originalButton = submitButton?.innerHTML;

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Envoi…';
      }

      const response = await fetch(form.action || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });

      if (!response.ok) {
        throw new Error(`Netlify Forms a répondu HTTP ${response.status}`);
      }

      status.textContent = '✅ Merci ! Votre message a bien été envoyé.';
      status.classList.add('is-success');
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    } catch (error) {
      console.error('Échec de l’envoi du formulaire :', error);
      status.textContent = '❌ L’envoi a échoué. Réessayez dans quelques instants.';
      status.classList.add('is-error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.innerHTML = originalButton;
      }
    }
  });
}
