import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

let eventsSwiper;

function swiperInit() {
  if (window.innerWidth < 1440) {
    eventsSwiper = new Swiper('.events-swiper', {
      modules: [Navigation, Pagination, Keyboard],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        375: { slidesPerView: 1 },
        768: { slidesPerView: 2, spaceBetween: 24 },
      },
    });
  } else {
    eventsSwiper.destroy(true, true);
    eventsSwiper = null;
  }
}

swiperInit();
