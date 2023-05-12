const API_KEY = 'k_3921up66';

function main() {
  console.log('RUNNING MAIN');
  const formEl = document.getElementById('searchForm');
  formEl.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const searchValue = document.getElementById('searchInput').value;
    if (searchValue === '') return;

    try {
      const res = await fetch(`https://imdb-api.com/en/api/searchmovie/${API_KEY}/${searchValue}`);
      if (res.status !== 200) {
        console.error('bad status ', res.status);
        return;
      }

      const data = await res.json();

      if (data.results.length === 0) {
        console.log('NO RESULTS');
        return;
      }

      const movieID = data.results[0].id;

      const movieInfoRes = await fetch(`https://imdb-api.com/en/api/title/${API_KEY}/${movieID}`);
      if (movieInfoRes.status !== 200) {
        console.error('bad status ', res.status);
        return;
      }

      const movieInfoData = await movieInfoRes.json();

      document.getElementById('movieTitle').innerText = movieInfoData.title;
      document.getElementById('movieYearLength').innerText = `${movieInfoData.year} . ${movieInfoData.runtimeStr}`;
      document.getElementById('movieRating').innerText = movieInfoData.imDbRating;
      document.getElementById('movieDesc').innerText = movieInfoData.plot;
      document.getElementById('movieDirector').innerText = movieInfoData.directorList[0].name;
      document.getElementById('movieWriter').innerText = movieInfoData.writerList[0].name;
      document.getElementById('movieStars').innerText = movieInfoData.stars;
      document.getElementById('movieImage').setAttribute('src', movieInfoData.image);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

window.onload = main;
