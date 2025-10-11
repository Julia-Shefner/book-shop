// "import "accordion-js/dist/accordion.min.css";" потрібно додатково додати в файл js після "import Accordion from "accordion-js";"
// ====== ІМПОРТИ ======
import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  position: 'topRight',
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
});

// ====== ІНІЦІАЛІЗАЦІЯ АКОРДЕОНУ ======
new Accordion('.js-accordion', { duration: 300 });

// ====== ЕЛЕМЕНТИ ======
const backdrop = document.getElementById('modal-backdrop');
const closeBtn = document.getElementById('close-modal');
const addToCartBtn = document.getElementById('add-to-cart');
const buyNowBtn = document.getElementById('buy-now');
const quantityInput = document.getElementById('quantity');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');

// ====== ВІДКРИТТЯ МОДАЛКИ ======
document.addEventListener('click', e => {
  if (e.target.classList.contains('learn-more-btn')) {
    const bookCard = e.target.closest('.book-card');

    if (bookCard) {
      const img = bookCard.querySelector('.book-image')?.src || '';
      const title =
        bookCard.querySelector('.book-title')?.textContent || 'Untitled';
      const author =
        bookCard.querySelector('.book-author')?.textContent || 'Unknown';
      const price =
        bookCard.querySelector('.book-price')?.textContent || '$0.00';

      // заповнюємо модалку
      document.getElementById('book-image').src = img;
      document.getElementById('book-title').textContent = title;
      document.getElementById('book-author').textContent = author;
      document.getElementById('book-price').textContent = price;
      document.getElementById('details').textContent =
        'This is a placeholder description for the book.';
      document.getElementById('shipping').textContent = 'Ships in 2–3 days.';
      document.getElementById('returns').textContent = '30-day return policy.';

      // відкриваємо модалку
      backdrop.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';
    }
  }
});

// ====== ЗАКРИТТЯ ======
function closeModal() {
  backdrop.classList.add('is-hidden');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ====== КІЛЬКІСТЬ ======
if (increase && decrease && quantityInput) {
  increase.addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  decrease.addEventListener('click', () => {
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  });
}

// ====== TOAST-ПОВІДОМЛЕННЯ ======
addToCartBtn.addEventListener('click', () => {
  const qty = quantityInput.value;
  iziToast.show({
    message: `📚 Додано ${qty} книг у кошик`,
    backgroundColor: '#fff9e6',
    messageColor: '#000',
  });
});

buyNowBtn.addEventListener('click', e => {
  e.preventDefault();
  iziToast.show({
    message: '📖 Дякуємо за покупку!',
    backgroundColor: '#fff9e6',
    messageColor: '#000',
  });
});
