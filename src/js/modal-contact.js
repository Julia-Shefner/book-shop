const form = document.querySelector('.contact-form');
// const eventsBtn = document.querySelector('.events-btn');
const btnList = document.querySelector('.events-list');
const modal = document.querySelector('.contact-modal-overlay');
const body = document.body;
const inputs = form.querySelectorAll('input');
const errorMessages = form.querySelectorAll('.error-message');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.querySelector('.modal-paragraph');

//  Backdrop click
function onBackdropClick(event) {
  if (event.target === modal) {
    closeContactModal();
  }
}
// Open window logic
btnList.addEventListener('click', openContactModal);
function openContactModal(event) {
  const eventsBtn = event.target.closest('.events-btn');
  if (!eventsBtn) {
    return;
  }
  inputs.forEach(input => input.classList.remove('error'));
  errorMessages.forEach(msg => {
    msg.textContent = '';
    msg.classList.remove('show');
  });
  const item = eventsBtn.closest('.events-list-item');
  const eventsTitle = item.querySelector('.events-subtitle').textContent;
  modalTitle.textContent = eventsTitle;
  modal.classList.add('is-open');
  body.classList.add('menu-open');
  window.addEventListener('keydown', onEscPress);

  modal.addEventListener('click', onBackdropClick);
}
// keyboard event
function onEscPress(event) {
  if (event.key === 'Escape' || event.code === 'Escape') {
    closeContactModal();
  }
}
// Close window logic
closeBtn.addEventListener('click', closeContactModal);
function closeContactModal() {
  inputs.forEach(input => {
    input.value = '';
  });
  modal.classList.remove('is-open');
  body.classList.remove('menu-open');
  window.removeEventListener('keydown', onEscPress);
  modal.removeEventListener('click', onBackdropClick);
}

// Submit logic
form.addEventListener('submit', handlerSubmit);
function handlerSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
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
