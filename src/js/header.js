const burgerBtn = document.querySelector('.burger-js');
const menu = document.querySelector('.header-menu');
const body = document.body;
const closeBtn = document.querySelector('.close-js');
const navList = document.querySelectorAll('.header-nav-link');

burgerBtn.addEventListener('click', clickBurgerBtn);
function clickBurgerBtn() {
  menu.classList.add('active');
  body.classList.add('menu-open');
}

closeBtn.addEventListener('click', clickCloseBtn);
function clickCloseBtn() {
  menu.classList.remove('active');
  body.classList.remove('menu-open');
}
navList.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    body.classList.remove('menu-open');
  });
});
