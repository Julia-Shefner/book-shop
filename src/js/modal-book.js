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
document.addEventListener('DOMContentLoaded', () => {
  window.accordionInstance = new Accordion('.js-accordion', {
    duration: 380,     
    showMultiple: true, 
    collapse: true      
  });

  // забезпечуємо потрібні базові стилі для всіх панелей (щоб не конфліктувати з css)
  document.querySelectorAll('.js-accordion .ac-panel').forEach(p => {
    p.style.overflow = 'hidden';        
    p.style.boxSizing = 'border-box';  
  });

  
});


// ====== ЕЛЕМЕНТИ ======
const backdrop = document.getElementById('modal-backdrop');
const closeBtn = document.getElementById('close-modal');
const addToCartBtn = document.getElementById('add-to-cart');
const buyNowBtn = document.getElementById('buy-now');
const quantityInput = document.getElementById('quantity');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');

// ====== ВІДКРИТТЯ МОДАЛКИ ======
document.addEventListener('click', async e => {
  if (e.target.classList.contains('learn-more-btn')) {
    const bookCard = e.target.closest('.book-card');
    if (!bookCard) return;

    const img = bookCard.querySelector('.book-image')?.src || '';
    const title =
      bookCard.querySelector('.book-title')?.textContent || 'Untitled';
    const author =
      bookCard.querySelector('.book-author')?.textContent || 'Unknown';
    const price =
      bookCard.querySelector('.book-price')?.textContent || '$0.00';

    // Отримуємо id книги
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

    // Заповнюємо модалку
    document.getElementById('book-image').src = img;
    document.getElementById('book-title').textContent = title;
    document.getElementById('book-author').textContent = author;
    document.getElementById('book-price').textContent = price;
    document.getElementById('details').textContent = descriptionText;
    document.getElementById('shipping').textContent = 'We ship across the United States within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.';
    document.getElementById('returns').textContent = 'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.';

    // Відкриваємо модалку
    backdrop.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
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
function getUkrainianPluralForm(n, form1, form2, form5) {
  n = Math.abs(n);
  const n10 = n % 10;
  const n100 = n % 100;

  if (n100 >= 11 && n100 <= 19) {
    return form5; 
  }

  if (n10 === 1) {
    return form1; 
  }

  if (n10 >= 2 && n10 <= 4) {
    return form2; 
  }

  return form5; 
}

addToCartBtn.addEventListener('click', () => {
  const qty = Number(quantityInput.value); 
  const wordForm = getUkrainianPluralForm(qty, 'книгу', 'книги', 'книг'); 
  const message = `📚 Додано ${qty} ${wordForm} до кошика`; 

  iziToast.show({
    message: message,
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
