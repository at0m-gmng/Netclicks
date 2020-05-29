const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '4455db9965c14ed8fa35bc53bc483bde';
const SERVER = 'https://api.themoviedb.org/3/';

const leftMenu = document.querySelector('.left-menu');
const burger  = document.querySelector('.hamburger');
const tvShowList =  document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');




// Создание загрузочного блока при низкой скорости загрузки страницы 
const loading = document.createElement('div');
loading.classList.add('loading');

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
    getTestCard = () => {
        return  this.getData('card.json');
    };
    // GET запросы
    getSearchResult = (query) => {
        return  this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    };

    getTvShow = id => {
        return this.getData(`${SERVER}tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    };

}
console.log(new DBService().getSearchResult('Няня'));

// создание карточек фильмов
const renderCard =  (response) => {
    tvShowList.textContent = '';
    response.results.forEach( ({ 
        backdrop_path: backdrop, 
        name: title, 
        poster_path: poster, 
        vote_average: vote,
        id
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
            <a href="#" id="${id}" class="tv-card">
                ${voitValue}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        loading.remove(); // удаляем блок загрузки чтобы дальше загрузить карточки
        tvShowList.insertAdjacentElement('afterbegin', card);
        // или
        // tvShowList.append(card);
        
    } );
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if(value){
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

// {   
//     tvShows.append(loading);
//     new DBService().getTestData().then(renderCard);
// }
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
    event.preventDefault();
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
        new DBService().getTvShow(card.id).then((data) => {
            console.log(data);
            tvCardImg.src = IMG_URL + data.poster_path;
            modalTitle.textContent = data.name;
            // genresList.innerHTML = data.genres.reduce((acc, item) => {
            //    return `${acc} <li>${item.name}</li>`
            // }, '');
            //  ИЛИ
            genresList.textContent = '';
            // for (const item of data.genres) {
            //     genresList.innerHTML += `<li>${item.name}</li>`;
            // }
            // ИЛИ
            data.genres.forEach( item => {
                genresList.innerHTML += `<li>${item.name}</li>`;
            });
            rating.textContent = data.vote_average;
            description.textContent = data.overview;
            modalLink.href = data.homepage;

        })
        .then( () => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        });
    }
});

modal.addEventListener('click', (event) => {
    const target = event.target;
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});