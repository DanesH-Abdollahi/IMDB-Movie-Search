const DEFAULT_API_KEY = 'k_l3ur76g9';

function main() {
    let isDark = true;
    const formEl = document.getElementById('searchForm');
    searchMovie("Interstellar", DEFAULT_API_KEY);
    formEl.addEventListener('submit', handleSubmit);

    const toggleThemeButton = document.getElementById('toggleThemeButton');
    updateToggleThemeButtonText(toggleThemeButton, isDark);
    toggleThemeButton.addEventListener('click', () => {
        isDark = !isDark;
        toggleTheme(isDark, toggleThemeButton);
    });
}

function handleSubmit(ev) {
    ev.preventDefault();
    const searchValue = document.getElementById('searchInput').value;
    const apiKeyValue = document.getElementById('apiInput').value;
    searchMovie(searchValue, apiKeyValue);
}

function toggleTheme(isDark, toggleThemeButton) {
    const bodyEl = document.querySelector('body');
    if (isDark) {
        bodyEl.classList.add('dark');
    } else {
        bodyEl.classList.remove('dark');
    }
    updateToggleThemeButtonText(toggleThemeButton, isDark);
}

function updateToggleThemeButtonText(toggleThemeButton, isDark) {
    toggleThemeButton.innerText = isDark ? 'Light Theme' : 'Dark Theme';
}

async function searchMovie(movieName, apiKey) {
    if (movieName === '') return;

    try {
        const res = await fetch(`https://imdb-api.com/en/api/searchmovie/${apiKey}/${movieName}`);
        if (res.status !== 200) {
            console.error('bad status', res.status);
            return;
        }

        const data = await res.json();

        if (data.results.length === 0) {
            console.log('NO RESULTS');
            return;
        }

        const movieID = data.results[0].id;
        const movieInfoRes = await fetch(`https://imdb-api.com/en/api/title/${apiKey}/${movieID}`);

        if (movieInfoRes.status !== 200) {
            console.error('bad status', res.status);
            return;
        }

        const movieInfoData = await movieInfoRes.json();
        updateMovieInfo(movieInfoData);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function updateMovieInfo(movieInfoData) {
    document.getElementById('movieTitle').innerText = movieInfoData.title;
    document.getElementById('movieYearLength').innerText = `${movieInfoData.year} . ${movieInfoData.runtimeStr}`;
    document.getElementById('movieRating').innerText = movieInfoData.imDbRating;
    document.getElementById('movieDesc').innerText = movieInfoData.plot;
    document.getElementById('movieDirector').innerText = movieInfoData.directorList[0].name;
    document.getElementById('movieWriter').innerText = movieInfoData.writerList[0].name;
    document.getElementById('movieStars').innerText = movieInfoData.stars;
    document.getElementById('movieImage').setAttribute('src', movieInfoData.image);

    const awardsEl = document.getElementById('awards');
    if (movieInfoData.awards) {
        const [awardsLeft, awardsRight] = movieInfoData.awards.split('|').map(p => p.trim());
        document.getElementById('awardsLeft').innerText = awardsLeft;
        document.getElementById('awardsRight').innerText = awardsRight;
        awardsEl.style.display = 'flex';
    } else {
        awardsEl.style.display = 'none';
    }

    const genreList = movieInfoData.genreList;
    if (genreList && genreList.length > 0) {
        const tagsListEl = document.getElementById('movieTags');
        tagsListEl.innerHTML = '';
        genreList.forEach(item => {
            const tagItem = document.createElement('div');
            tagItem.classList.add('tag');
            tagItem.innerText = item.value;
            tagsListEl.appendChild(tagItem);
        });

        const similarCards = movieInfoData.similars && movieInfoData.similars.length > 0 ?
            movieInfoData.similars.slice(0, 4) : [];

        const similarCardsEl = document.getElementById('similarCards');
        similarCardsEl.innerHTML = '';
        similarCards.forEach(item => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('card');

            const imageEl = document.createElement('img');
            imageEl.setAttribute('src', item.image);
            imageEl.classList.add('card__image');

            const titleEl = document.createElement('div');
            titleEl.classList.add('card__title');
            titleEl.innerText = item.title;

            const ratingEl = document.createElement('div');
            ratingEl.innerText = item.imDbRating;

            cardEl.appendChild(imageEl);
            cardEl.appendChild(ratingEl);
            cardEl.appendChild(titleEl);

            similarCardsEl.appendChild(cardEl);
        });
    }
}

window.onload = main;