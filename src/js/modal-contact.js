const form = document.querySelector('.contact-form');
const eventsBtn = document.querySelector('.events-btn');
const modal = document.querySelector('.contact-modal-overlay');
const body = document.body;
eventsBtn.addEventListener('click', openContactModal);
function openContactModal() {
  menu.classList.add('is-open');
  body.classList.add('menu-open');
  window.addEventListener('keydown', onEscPress);
}
form.addEventListener('submit', handlerSubmit);
function handlerSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const inputs = form.querySelectorAll('input');
  const errorMessages = form.querySelectorAll('.error-message');
  let hasError = false;
  inputs.forEach(input => input.classList.remove('error'));
  errorMessages.forEach(msg => {
    msg.textContent = '';
    msg.classList.remove('show');
  });

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.classList.add('error');
      const msg = input.nextElementSibling;
      if (msg) {
        msg.textContent = 'Error text';
        msg.classList.add('show');
      }
      hasError = true;
    }
  });

  if (hasError) return;

  const data = {
    name: name,
    email: email,
  };

  form.reset();
}
