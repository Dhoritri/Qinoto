/* Contact form — mirrors submitContactForm mock behaviour.
   Backend to be wired in later (replace the mock submit). */
(function () {
  var form = document.getElementById("contactForm");
  var btn = document.getElementById("contactSubmit");
  if (!form) return;

  // Mock submit (returns success). Replace with a real fetch when backend is ready.
  function submitContactForm(data) {
    console.log("Mocking contact submission:", data);
    return Promise.resolve({ success: true });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "SENDING...";

    var data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value
    };

    submitContactForm(data)
      .then(function (result) {
        if (result.success) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Failed to send message. Please try again.");
        }
      })
      .catch(function () {
        alert("An error occurred. Please try again.");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "SUBMIT";
      });
  });
})();
