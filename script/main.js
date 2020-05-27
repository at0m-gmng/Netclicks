const leftMenu = document.querySelector('.left-menu');
const burger  = document.querySelector('.hamburger');
const tvShowList =  document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
// const cross = document.querySelector('.cross');


//открытие закрытие меню
burger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    burger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if(!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        burger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active'); 
        leftMenu.classList.add('openMenu');
        burger.classList.add('open');
    }
});


//Смена img карточек при наведении
const changeImage = (event) => {
    //ищем среди tvShowList карточки
    const card = event.target.closest('.tv-shows__item'); 
    if(card){
        //получаем картинку и создаём 3ю переменную для манипуляций
        const img = card.querySelector('.tv-card__img');
        const dataBackdrop = img.dataset.backdrop;
        //используя 3ю переменную меняем src и backdrop
        if(dataBackdrop) {
            img.dataset.backdrop = img.src
            img.src = dataBackdrop;
        }
        // 2ОЙ ВАРИАНТ РЕАЛИЗАЦИИ
        // if(img.dataset.backdrop){
        //     [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src] 
        // }
    }     
};  
    tvShowList.addEventListener('mouseover', changeImage);
    tvShowList.addEventListener('mouseout', changeImage);

//открытие и закрытие модального окна
tvShowList.addEventListener('click', (event) => {
    //после открытия и закрытия модального окна скролл летит вверх => исправляем
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    if(card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

modal.addEventListener('click', (event) => {
    const target = event.target;
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});