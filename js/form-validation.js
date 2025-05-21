document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const fields = form.querySelectorAll("input[required], textarea[required]");
    const successMsg = form.querySelector(".form-success");
  
    form.addEventListener("submit", (e) => {
      let formIsValid = true;
      successMsg.textContent = ""; // Réinitialise le message de succès
  
      fields.forEach((field) => {
        const error = field.parentElement.querySelector(".form-error");
        error.style.display = "none"; // Réinitialise l'affichage
  
        const value = field.value.trim();
  
        if (!value) {
          e.preventDefault();
          error.style.display = "block";
          formIsValid = false;
        } else if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            e.preventDefault();
            error.textContent = "Veuillez saisir un email valide.";
            error.style.display = "block";
            formIsValid = false;
          }
        }
      });
  
      if (!formIsValid) {
        e.preventDefault(); // bloque uniquement si invalide
      } else {
        // Optionnel : feedback UX immédiat
        successMsg.textContent = "✅ Merci ! Votre message est en cours d'envoi...";
        successMsg.style.color = "#0f9d58";
        // Ne bloque pas le submit → Netlify prend le relais
      }
    });
  });
  