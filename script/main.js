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

const treiler = document.getElementById('trailer');




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
    // getTestData = async () => {
    //     return await this.getData('test.json');
    // };
    getTestData = () => {
        return this.getData('test.json');
    };
    getTestCard = () => {
        return  this.getData('card.json');
    };
    // GET запросы
    getSearchResult = (query) => {
        // console.log(this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`));
        return  this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    };

    getTvShow = id => {
        return this.getData(`${SERVER}tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    };

    getVideo = id => {
        return this.getData(`${SERVER}tv/${id}/videos?api_key=${API_KEY}&language=ru-RU`);
    };

    getPopular = () => {
        return this.getData(`${SERVER}movie/popular?api_key=${API_KEY}&language=ru-RU`);
    };
    getTopRated = () => {
        return this.getData(`${SERVER}movie/top_rated?api_key=${API_KEY}&language=ru-RU`);
    };

}

// создание карточек фильмов
const renderCard =  (response) => {
    tvShowList.textContent = '';
    response.results.forEach( ({ 
        backdrop_path: backdrop, 
        name: title ,
        title: name, 
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

        const nameTitle = name == undefined ?  name = title : title = name;
    

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = ` 
            <a href="#" id="${id}" class="tv-card">
                ${voitValue}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${nameTitle}">
                <h4 class="tv-card__head">${nameTitle}</h4>
            </a>
        `;
        loading.classList.remove('loading'); // удаляем блок загрузки чтобы дальше загрузить карточки
        tvShowList.insertAdjacentElement('afterbegin', card);
        // или
        // tvShowList.append(card);
        
    } );
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    switch(value) {
        case '': // ошибка и главная страница
            const block = searchFormInput.closest('.search__form-block');
            block.style.border = '2px solid tomato';
            setTimeout( () => {
                block.style.border = '';
                alert('Поле должно быть заполнено');
              }, 150);
            break;
        case (value): //  или вывод информации по поиску
            tvShows.append(loading);
            new DBService().getSearchResult(value).then(renderCard);
            // console.log('++');
            break;
    }
// очищаем поле ввода
    searchFormInput.value = '';
});

//Типа главная страница
{   
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}

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
    if (target.closest('#popular')) {
        new DBService().getPopular().then(renderCard);
        // console.log(new DBService().getPopular().then( data => renderCard(data)));
        console.log(new DBService().getPopular());
        console.log(new DBService().getPopular(renderCard));
    }
    if (target.closest('#top-rated')) {
        new DBService().getTopRated().then(renderCard);
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
    // после открытия и закрытия модального окна скролл летит вверх => исправляем
    event.preventDefault();
    
        const target = event.target;
        const card = target.closest('.tv-card');
        if(card) {
            // прелоадер для медленного интернета
            loading.classList.add('loading');
            new DBService().getTvShow(card.id).then((data) => {
                // console.log(data);
                loading.classList.remove('loading');
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
                
                const backdrop = data.backdrop_path;
                // console.log(backdrop);       
                if(backdrop === null){
                    document.body.style.overflow = '';
                    modal.classList.add('hide');
                    // alert('Для данного фильма не существует модального окна');   
                    // console.log('++');
                } else {
                    if (!data.poster_path){
                        tvCardImg.src = IMG_URL + data.backdrop_path;
                    }
                    document.body.style.overflow = 'hidden';
                    modal.classList.remove('hide');
                    // console.log('--');
                }
                // console.log(data.id);
                return card.id
            })
            .then(new DBService().getVideo)
            .then( data => {
                // console.log(data);
                // console.log(data.results.keys);
                
                trailer.textContent = '';
                data.results.forEach( (item) => {
                    const trailerItem = document.createElement('li');

                    trailerItem.innerHTML = `
                    <iframe 
                        width="400" height="300" 
                        src="https://www.youtube.com/embed/${item.key}" 
                        frameborder="0" allow="accelerometer; autoplay; 
                        encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                    `;
                    trailer.append(trailerItem);
                });
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