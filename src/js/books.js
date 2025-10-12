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

// Динамічні налаштування
function getChunkSize() {
  if (window.innerWidth >= 768) return 24;
  return 10;
}
function getLoadStep() {
  return 4;
}

// Отримати всі книги
async function fetchBooks() {
  try {
    const { data } = await axios.get(`${API_BASE}/top-books`);

    allBooks = data.flatMap(cat =>
      cat.books.map(b => ({ ...b, category: cat.list_name }))
    );
    filteredBooks = [...allBooks];

    const categories = [...new Set(data.map(c => c.list_name))];
    fillCategories(categories);
    visibleCount = 0;
    renderBooks();
  } catch (err) {
    console.error('Error loading books:', err);
  }
}

// Заповнення категорій
function fillCategories(categories) {
  // ✅ кастомний селект
  if (customSelectOptions) {
    customSelectOptions.innerHTML = `
      <li data-category="all">All categories</li>
      ${categories.map(c => `<li data-category="${c}">${c}</li>`).join('')}
    `;
  }

  // ✅ список для десктопу
  if (categoriesList) {
    categoriesList.innerHTML = `
      <li data-category="all">All categories</li>
      ${categories.map(c => `<li data-category="${c}">${c}</li>`).join('')}
    `;
  }
}

// Рендер книг
function renderBooks() {
  const chunk = getChunkSize();
  const step = getLoadStep();
  const end = visibleCount === 0 ? chunk : visibleCount + step;

  const booksToShow = filteredBooks.slice(0, end);

  booksList.innerHTML = booksToShow
    .map(
      b => `
      <li class="book-card">
        <img class="book-image" src="${b.book_image}" alt="${b.title}" />
        <div class="book-info">
          <div>
            <h3 class="book-title">${b.title}</h3>
            <p class="book-author">${b.author}</p>
          </div>
          <p class="book-price">$${(Math.random() * 90 + 10).toFixed(2)}</p>
        </div>
        <button class="learn-more-btn">Learn More</button>
      </li>`
    )
    .join('');

  visibleCount = booksToShow.length;
  booksCount.textContent = `Showing ${visibleCount} of ${filteredBooks.length}`;
  showMoreBtn.style.display =
    visibleCount < filteredBooks.length ? 'block' : 'none';
}

// Фільтрація
function filterByCategory(category) {
  visibleCount = 0;
  if (!category || category === 'all') {
    filteredBooks = [...allBooks];
    renderBooks();
    return;
  }
  fetchCategoryBooks(category);
}

async function fetchCategoryBooks(category) {
  try {
    const { data } = await axios.get(`${API_BASE}/category`, {
      params: { category },
    });
    filteredBooks = data;
    renderBooks();
  } catch (err) {
    console.error('Error loading category books:', err);
  }
}

// Обробники подій
// ✅ селект
customSelectBtn.addEventListener('click', () => {
  customSelect.classList.toggle('open');
});

customSelectOptions.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selected = e.target.getAttribute('data-category');
    customSelectText.textContent = e.target.textContent;
    customSelect.classList.remove('open');
    filterByCategory(selected);
  }
});

// ✅ список для десктопу
categoriesList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selected = e.target.getAttribute('data-category');
    document
      .querySelectorAll('.categories-list li')
      .forEach(li => li.classList.remove('active'));
    e.target.classList.add('active');
    filterByCategory(selected);
  }
});

// Показати більше
showMoreBtn.addEventListener('click', renderBooks);

// Ініціалізація
fetchBooks();
