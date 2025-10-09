import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

new Swiper(".feedback-swiper", {
  modules: [Navigation, Pagination],
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
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