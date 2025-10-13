import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

new Swiper('.feedback-swiper', {
  modules: [Navigation, Pagination, Keyboard],
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-nex',
    prevEl: '.swiper-button-pre',
  },
  keyboard: {
    enabled: true, // Увімкнути керування з клавіатури
    onlyInViewport: true, // Працює лише коли слайдер у полі зору
  },
  // autoHeight: false,       // змушує всі слайди мати однакову висоту (найвищу серед них).
  grabCursor: true,
  breakpoints: {
    375: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
});

const navButtons = document.querySelectorAll('.btn-arrow');

navButtons.forEach(btn => {
  btn.addEventListener('mouseup', () => btn.blur());
  btn.addEventListener('touchend', () => btn.blur());
});
