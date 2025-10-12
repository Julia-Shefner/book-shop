// "import 'swiper/css';" потрібно додатково додати в файл js після "import Swiper from 'swiper';"
// або
// "import 'swiper/css'; import 'swiper/css/navigation';
//  import 'swiper/css/pagination';"
// потрібно додатково додати в файл js після "import Swiper from 'swiper'; import { Navigation, Pagination } from 'swiper/modules';"
// потрібно читати документацію, який саме варіант потрібен

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const swiper = new Swiper('.hero-slider', {
    modules: [Navigation],
    slidesPerView: 1,
    allowTouchMove: true,
    loop: false,
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


function updateButtons(swiper) {
    const prevBtn = document.querySelector('.slider-button.prev');
    const nextBtn = document.querySelector('.slider-button.next');

    if (swiper.isBeginning) {
        prevBtn.disabled = true;
        prevBtn.classList.add('slider-button--disabled');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('slider-button--disabled');
    }

    if (swiper.isEnd) {
        nextBtn.disabled = true;
        nextBtn.classList.add('slider-button--disabled');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('slider-button--disabled');
    }
}
