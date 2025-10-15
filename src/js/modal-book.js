import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  position: 'topRight',
  transitionIn: 'fadeInDown',
  transitionOut: 'fadeOutUp',
});

document.addEventListener('DOMContentLoaded', () => {
  window.accordionInstance = new Accordion('.js-accordion', {
    duration: 380,
    showMultiple: true,
    collapse: true,
  });

  document.querySelectorAll('.js-accordion .ac-panel').forEach(p => {
    p.style.overflow = 'hidden';
    p.style.boxSizing = 'border-box';
  });
});

const backdrop = document.getElementById('modal-backdrop');
const closeBtn = document.getElementById('close-modal');
const addToCartBtn = document.getElementById('add-to-cart');
const buyNowBtn = document.getElementById('buy-now');
const quantityInput = document.getElementById('quantity');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');

document.addEventListener('click', async e => {
  if (e.target.classList.contains('learn-more-btn')) {
    const bookCard = e.target.closest('.book-card');
    if (!bookCard) return;

    const img = bookCard.querySelector('.book-image')?.src || '';
    const title =
      bookCard.querySelector('.book-title')?.textContent || 'Untitled';
    const author =
      bookCard.querySelector('.book-author')?.textContent || 'Unknown';
    const price = bookCard.querySelector('.book-price')?.textContent || '$0.00';

    const bookId = bookCard.dataset.id;
    let descriptionText = 'Description not found';

    if (bookId) {
      try {
        const res = await fetch(
          `https://books-backend.p.goit.global/books/${bookId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.description && data.description.trim() !== '') {
            descriptionText = data.description;
          }
        }
      } catch (err) {
        console.error('Помилка при отриманні опису книги:', err);
      }
    }

    document.getElementById('book-image').src = img;
    document.getElementById('book-title').textContent = title;
    document.getElementById('book-author').textContent = author;
    document.getElementById('book-price').textContent = price;
    document.getElementById('details').textContent = descriptionText;
    document.getElementById('shipping').textContent =
      'We ship across the United States within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.';
    document.getElementById('returns').textContent =
      'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.';

    backdrop.classList.remove('is-hidden');
    document.body.style.overflowY = 'hidden';
  }
});

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

function getPluralForm(count, singular, plural) {
  return count === 1 ? singular : plural;
}

addToCartBtn.addEventListener('click', () => {
  const qty = Number(quantityInput.value);
  const wordForm = getPluralForm(qty, 'book', 'books');
  const message = `✔ ${qty} ${wordForm} added to cart`;

  iziToast.show({
    message: message,
    backgroundColor: '#f9decd',
    messageColor: '#0b0500',
    progressBar: false,
  });

  addToCartBtn.blur();
});

buyNowBtn.addEventListener('click', e => {
  e.preventDefault();
  iziToast.show({
    message: '❤︎ Thank you for your purchase!',
    backgroundColor: '#f9decd',
    messageColor: '#0b0500',
    progressBar: false,
  });
  buyNowBtn.blur();
});

window.openBookModal = async function (bookId) {
  try {
    const res = await fetch(
      `https://books-backend.p.goit.global/books/${bookId}`
    );
    if (!res.ok) throw new Error('Book not found');
    const data = await res.json();

    document.getElementById('book-image').src = data.book_image || '';
    document.getElementById('book-title').textContent =
      data.title || 'Untitled';
    document.getElementById('book-author').textContent =
      data.author || 'Unknown';
    document.getElementById('book-price').textContent = `$${(
      Math.random() * 90 +
      10
    ).toFixed(2)}`;
    document.getElementById('details').textContent =
      data.description || 'No description available';
    document.getElementById('shipping').textContent =
      'We ship within 2–5 business days across the U.S. Free standard shipping on orders over $50.';
    document.getElementById('returns').textContent =
      'You can return an item within 14 days if unused and in its original packaging.';

    backdrop.classList.remove('is-hidden');
    document.body.style.overflowY = 'hidden';
  } catch (err) {
    console.error('Помилка при відкритті модалки:', err);
  }
};
