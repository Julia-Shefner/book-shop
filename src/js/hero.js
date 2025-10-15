import Swiper from 'swiper';
import { Navigation, Autoplay, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

let swiper;

function initSwiper() {
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

function updateButtons(swiper) {
  const prevBtn = document.querySelector('.slider-button.prev');
  const nextBtn = document.querySelector('.slider-button.next');

  prevBtn.disabled = swiper.isBeginning;
  nextBtn.disabled = swiper.isEnd;
}

window.addEventListener('load', initSwiper);

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initSwiper();
  }, 300);
});

const navButtons = document.querySelectorAll('.btn-arrow');

navButtons.forEach(btn => {
  btn.addEventListener('mouseup', () => btn.blur());
  btn.addEventListener('touchend', () => btn.blur());
});
