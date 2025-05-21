document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const fields = form.querySelectorAll("input[required], textarea[required]");
    const successMsg = form.querySelector(".form-success");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let formIsValid = true;
      successMsg.textContent = "";
  
      // Validation simple
      fields.forEach((field) => {
        const error = field.parentElement.querySelector(".form-error");
        error.style.display = "none";
        const value = field.value.trim();
  
        if (!value) {
          error.style.display = "block";
          formIsValid = false;
        } else if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error.textContent = "Veuillez saisir un email valide.";
            error.style.display = "block";
            formIsValid = false;
          }
        }
      });
  
      if (!formIsValid) return;
  
      // Envoi manuel à Netlify via fetch
      const formData = new FormData(form);
  
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });
  
        successMsg.textContent = "✅ Merci ! Votre message a bien été envoyé.";
        successMsg.style.color = "#0f9d58";
        form.reset();
      } catch (error) {
        successMsg.textContent = "❌ Une erreur est survenue. Veuillez réessayer.";
        successMsg.style.color = "#d32f2f";
      }
    });
  });
  