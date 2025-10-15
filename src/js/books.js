import axios from 'axios';

const API_BASE = 'https://books-backend.p.goit.global/books';
const booksList = document.getElementById('booksList');
const showMoreBtn = document.getElementById('showMoreBtn');
const booksCount = document.getElementById('booksCount');
const categoriesList = document.getElementById('categoriesList');
const customSelect = document.getElementById('customSelect');
const customSelectBtn = document.getElementById('customSelectBtn');
const customSelectText = document.querySelector('.custom-select-text');
const customSelectOptions = document.getElementById('customSelectOptions');

let allBooks = [];
let filteredBooks = [];
let visibleCount = 0;

// ЛОАДЕР
const booksSection = document.querySelector('.books-section');
const loaderOverlay = document.createElement('div');
loaderOverlay.classList.add('books-loader-overlay');
loaderOverlay.innerHTML = `<div class="books-loader"></div>`;
booksSection.appendChild(loaderOverlay);

function showLoader() {
  loaderOverlay.classList.add('active');
}
function hideLoader() {
  loaderOverlay.classList.remove('active');
}

// 🧩 Видаляємо дублікати за назвою
function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(book => {
    const key = book.title.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getChunkSize() {
  return window.innerWidth >= 768 ? 24 : 10;
}
function getLoadStep() {
  return 4;
}

// 📚 Отримуємо 120 книжок
async function fetchBooks() {
  try {
    showLoader();
    const { data } = await axios.get(`${API_BASE}/top-books`);
    allBooks = data.flatMap(cat =>
      cat.books.map(b => ({ ...b, category: cat.list_name }))
    );

    allBooks = removeDuplicates(allBooks).slice(0, 120);
    filteredBooks = [...allBooks];

    const categories = [...new Set(data.map(c => c.list_name))];
    fillCategories(categories);

    visibleCount = 0;
    renderBooks(false);
  } catch (err) {
    console.error('Error loading books:', err);
  } finally {
    hideLoader();
  }
}

// 🏷 Заповнення категорій
function fillCategories(categories) {
  const items = categories
    .map(c => `<li data-category="${c}">${c}</li>`)
    .join('');
  customSelectOptions.innerHTML = `<li data-category="all">All categories</li>${items}`;
  categoriesList.innerHTML = `<li data-category="all">All categories</li>${items}`;
}

// 🖼 Рендер книжок
function renderBooks(append = false) {
  const chunk = getChunkSize();
  const step = getLoadStep();
  const end = visibleCount === 0 ? chunk : visibleCount + step;
  const booksToShow = filteredBooks.slice(visibleCount, end);

  const markup = booksToShow
    .map(
      b => `
      <li class="book-card" data-id="${b._id}">
        <img class="book-image" src="${b.book_image}" alt="${b.title}" />
        <div class="book-info">
          <div>
            <h3 class="book-title">${b.title}</h3>
            <p class="book-author">${b.author}</p>
          </div>
          <p class="book-price">$${(Math.random() * 90 + 10).toFixed(2)}</p>
        </div>
        <button class="learn-more-btn" data-id="${b._id}">Learn More</button>
      </li>`
    )
    .join('');

  if (!append) booksList.innerHTML = '';
  booksList.insertAdjacentHTML('beforeend', markup);

  visibleCount = end;
  booksCount.textContent = `Showing ${Math.min(
    visibleCount,
    filteredBooks.length
  )} of ${filteredBooks.length}`;
  showMoreBtn.style.display =
    visibleCount < filteredBooks.length ? 'block' : 'none';
}

// 🔍 Фільтрація
async function filterByCategory(category) {
  visibleCount = 0;
  showLoader();
  try {
    if (!category || category === 'all') {
      await new Promise(r => setTimeout(r, 300));
      filteredBooks = [...allBooks];
      renderBooks(false);
    } else {
      await fetchCategoryBooks(category);
    }
  } catch (err) {
    console.error('Error filtering category:', err);
  } finally {
    hideLoader();
  }
}

// 🧾 Книги за конкретною категорією
async function fetchCategoryBooks(category) {
  try {
    showLoader();
    const { data } = await axios.get(`${API_BASE}/category`, {
      params: { category },
    });
    filteredBooks = removeDuplicates(data);
    visibleCount = 0;
    renderBooks(false);
  } catch (err) {
    console.error('Error loading category books:', err);
  } finally {
    hideLoader();
  }
}

// 📖 Кнопка Show More
showMoreBtn.addEventListener('click', async () => {
  showLoader();
  showMoreBtn.disabled = true;
  showMoreBtn.style.opacity = '0.6';
  try {
    await new Promise(r => setTimeout(r, 200));
    renderBooks(true);
  } finally {
    hideLoader();
    showMoreBtn.disabled = false;
    showMoreBtn.style.opacity = '1';
  }
});

// 🧭 Відкриття/закриття селекту
customSelectBtn.addEventListener('click', e => {
  e.stopPropagation();
  customSelect.classList.toggle('open');
});

// 📂 Вибір категорії в селекті
customSelectOptions.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selected = e.target.dataset.category;
    customSelectText.textContent = e.target.textContent;
    customSelect.classList.remove('open');
    filterByCategory(selected);
  }
});

// 🧱 Закриття селекту при кліку поза ним
document.addEventListener('click', e => {
  const isClickInside = customSelect.contains(e.target);
  if (!isClickInside) {
    customSelect.classList.remove('open');
  }
});

// 🖱 Клік по списку категорій
categoriesList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selected = e.target.dataset.category;
    filterByCategory(selected);
    e.target.classList.add('pressed');
    setTimeout(() => e.target.classList.remove('pressed'), 150);
  }
});

// 🚀 Старт
fetchBooks();

// 📚 ВІДКРИТТЯ МОДАЛКИ
document.addEventListener('click', async e => {
  const btn = e.target.closest('.learn-more-btn');
  if (!btn) return;

  const bookId = btn.dataset.id;

  showLoader();
  try {
    if (typeof openBookModal === 'function') {
      await openBookModal(bookId);
    } else {
      console.warn(
        'openBookModal() не знайдено — перевір підключення modal.js'
      );
    }
  } catch (err) {
    console.error('Помилка при відкритті модалки:', err);
  } finally {
    hideLoader();
  }
});
