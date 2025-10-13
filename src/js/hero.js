// "import 'swiper/css';" потрібно додатково додати в файл js після "import Swiper from 'swiper';"
// або
// "import 'swiper/css'; import 'swiper/css/navigation';
//  import 'swiper/css/pagination';"
// потрібно додатково додати в файл js після "import Swiper from 'swiper'; import { Navigation, Pagination } from 'swiper/modules';"
// потрібно читати документацію, який саме варіант потрібен

import Swiper from 'swiper';
import { Navigation, Autoplay, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// ===== ініціалізація слайдера =====
let swiper;

function initSwiper() {
    // якщо вже існує екземпляр — знищуємо перед повторним створенням
    if (swiper) {
        swiper.destroy(true, true);
    }

    swiper = new Swiper('.hero-slider', {
        modules: [Navigation, Keyboard, Autoplay],
        slidesPerView: 1,
        allowTouchMove: true,
        loop: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        navigation: {
            nextEl: '.slider-button.next',
            prevEl: '.slider-button.prev',
            disabledClass: 'slider-button--disabled',
        },
        on: {
            init() {
                updateButtons(this);
            },
            slideChange() {
                updateButtons(this);
            },
        },
    });
}

// ===== функція оновлення стану кнопок =====
function updateButtons(swiper) {
    const prevBtn = document.querySelector('.slider-button.prev');
    const nextBtn = document.querySelector('.slider-button.next');

    prevBtn.disabled = swiper.isBeginning;
    nextBtn.disabled = swiper.isEnd;
}

// ===== запуск при завантаженні сторінки =====
window.addEventListener('load', initSwiper);

// ===== оновлення при зміні розміру вікна (debounce) =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initSwiper();
    }, 300);
});
