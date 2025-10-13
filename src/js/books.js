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

// 🧩 Функція для видалення дублікатів за назвою
function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(book => {
    const key = book.title.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ДИНАМІКА
function getChunkSize() {
  if (window.innerWidth >= 768) return 24;
  return 10;
}
function getLoadStep() {
  return 4;
}

// FETCH BOOKS
async function fetchBooks() {
  try {
    const { data } = await axios.get(`${API_BASE}/top-books`);
    allBooks = data.flatMap(cat =>
      cat.books.map(b => ({ ...b, category: cat.list_name }))
    );
    allBooks = removeDuplicates(allBooks);
    filteredBooks = removeDuplicates([...allBooks]);

    const categories = [...new Set(data.map(c => c.list_name))];
    fillCategories(categories);
    visibleCount = 0;
    renderBooks(false);
  } catch (err) {
    console.error('Error loading books:', err);
  }
}

// FILL CATEGORIES
function fillCategories(categories) {
  customSelectOptions.innerHTML = `
    <li data-category="all">All categories</li>
    ${categories.map(c => `<li data-category="${c}">${c}</li>`).join('')}
  `;
  categoriesList.innerHTML = `
    <li data-category="all">All categories</li>
    ${categories.map(c => `<li data-category="${c}">${c}</li>`).join('')}
  `;
}

// RENDER BOOKS
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
  booksCount.textContent = `Showing ${visibleCount} of ${filteredBooks.length}`;
  showMoreBtn.style.display =
    visibleCount < filteredBooks.length ? 'block' : 'none';
  document.dispatchEvent(new CustomEvent('booksRendered'));
}

// ФІЛЬТРАЦІЯ
function filterByCategory(category) {
  visibleCount = 0;
  if (!category || category === 'all') {
    filteredBooks = removeDuplicates([...allBooks]);
    renderBooks(false);
    return;
  }
  fetchCategoryBooks(category);
}

async function fetchCategoryBooks(category) {
  try {
    const { data } = await axios.get(`${API_BASE}/category`, {
      params: { category },
    });
    filteredBooks = removeDuplicates(data);
    visibleCount = filteredBooks.length;

    booksList.innerHTML = filteredBooks
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

    booksCount.textContent = `Showing ${filteredBooks.length} of ${filteredBooks.length}`;
    showMoreBtn.style.display = 'none';
    document.dispatchEvent(new CustomEvent('booksRendered'));
  } catch (err) {
    console.error('Error loading category books:', err);
  }
}

// КНОПКА SHOW MORE
showMoreBtn.addEventListener('click', async () => {
  showMoreBtn.disabled = true;
  showMoreBtn.style.opacity = '0.6';
  showMoreBtn.style.cursor = 'not-allowed';

  await renderBooks(true);

  if (visibleCount < filteredBooks.length) {
    showMoreBtn.disabled = false;
    showMoreBtn.style.opacity = '';
    showMoreBtn.style.cursor = '';
  }
});

// CUSTOM SELECT
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

// DESKTOP LIST
categoriesList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selected = e.target.getAttribute('data-category');
    filterByCategory(selected);
    e.target.classList.add('pressed');
    setTimeout(() => e.target.classList.remove('pressed'), 150);
  }
});

// ІНІЦІАЛІЗАЦІЯ
fetchBooks();
