// Меню
const menuBtn = document.querySelector('.nav__toggle');
const menuNav = document.querySelector('.nav');

if (menuBtn) {
  menuBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    menuNav.classList.toggle('nav--opened');
  });
}

// Модальное окно
const modalBtn = document.querySelectorAll('.button-order');
const modal = document.querySelector('.modal-container');
const modalClose = document.querySelector('.modal');

if (modalBtn) {
  modalBtn.forEach(function (item) {
    item.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (modal) {
        modal.classList.add('modal-container--opened')
      }
    });
  })
}

modal.addEventListener('click', (evt) => {
  if (evt.target === modal) {
    modal.classList.remove('modal-container--opened')
  }
})
