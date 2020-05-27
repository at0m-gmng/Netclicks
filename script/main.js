const leftMenu = document.querySelector('.left-menu');
const burger  = document.querySelector('.hamburger');
// const cardImg =  document.querySelector('.tv-card__img'); 
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
// let src ;
// cardImg.forEach(element) {
    // cardImg.addEventListener('mouseover', (event) => {
    //         const target = event.target;
    //         img = target.closest('img');
    //         src = img.getAttribute('src');
    //         dataBackdrop = img.getAttribute('data-backdrop');
    //         img.src = dataBackdrop;

    //         console.log(target);
    // });
    // cardImg.addEventListener('mouseout', (event) => {
    //         const target = event.target;
    //         img = target.closest('img');
    //         img.src = src;

    //         console.log(img.src);        
    // });
// }

//открытие модального окна
tvShowList.addEventListener('click', (event) => {
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