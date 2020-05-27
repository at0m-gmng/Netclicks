const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const leftMenu = document.querySelector('.left-menu');
const burger  = document.querySelector('.hamburger');
const tvShowList =  document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

// загрузка из DB
const DBService = class  {
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok){
            return res.json();
        } else {
            throw new Error(`Не удалось получить запрос по адресу ${url}`);
        }
    };
    getTestData = async () => {
        return await this.getData('test.json');
    };
}
// создание карточек фильмов
const renderCard =  (response) => {
    response.results.forEach( ({ 
        backdrop_path: backdrop, 
        name: title, 
        poster_path: poster, 
        vote_average: vote
    }) => {

        // если нет постера, добавляем img  "нет постера"
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        // если нет backdrop, то ничего не выводим
        const backdropIMG = backdrop ? IMG_URL + backdrop : ''; 
        // если нет рейтинша, не выводим tv-card__vote
        const voitValue = vote ? `<span class="tv-card__vote">${vote}</span>` :  '';
    

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = ` 
            <a href="#" class="tv-card">
                ${voitValue}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        tvShowList.insertAdjacentElement('afterbegin', card);
        // или
        // tvShowList.append(card);

    } );
};

new DBService().getTestData().then(renderCard);

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