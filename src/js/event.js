import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

let eventsSwiper;

function swiperInit() {
  if (window.innerWidth < 1440 && !eventsSwiper) {
    eventsSwiper = new Swiper('.events-swiper', {
      modules: [Navigation, Pagination, Keyboard],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.events-button-next',
        prevEl: '.events-button-prev',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        375: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
      },
    });
  } else if (window.innerWidth >= 1440 && eventsSwiper) {
    eventsSwiper.destroy(true, true);
    eventsSwiper = null;
  }
}

swiperInit();
window.addEventListener('resize', swiperInit);

const navButtons = document.querySelectorAll('.btn-arrow');

navButtons.forEach(btn => {
  btn.addEventListener('mouseup', () => btn.blur());
  btn.addEventListener('touchend', () => btn.blur());
});
