
function populateGenreDropdown(genres) {
  const select = document.getElementById('genres');

  for (const genre of genres) {
    let option = document.createElement('option');
    option.value = genre.id;
    option.text = genre.name;
    select.appendChild(option);
  }
}

function getSelectedGenre() {
  const selectedGenre = document.getElementById('genres').value;
  return selectedGenre;
}

function showBtns() {
  const btnDiv = document.getElementById('likeOrDislikeBtns');
  btnDiv.removeAttribute('hidden');
}

function clearCurrentMovie() {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  moviePosterDiv.innerHTML = '';
  movieTextDiv.innerHTML = '';
}

function likeMovie() {
  clearCurrentMovie();
  showRandomMovie();
}

function dislikeMovie() {
  clearCurrentMovie();
  showRandomMovie();
}

function createMoviePoster(posterPath) {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;

  const posterImg = document.createElement('img');
  posterImg.setAttribute('src', moviePosterUrl);
  posterImg.setAttribute('id', 'moviePoster');

  return posterImg;
}

function createMovieTitle(title) {
  const titleHeader = document.createElement('h1');
  titleHeader.setAttribute('id', 'movieTitle');
  titleHeader.innerHTML = title;

  return titleHeader;
}

function createMovieOverview(overview) {
  const overviewParagraph = document.createElement('p');
  overviewParagraph.setAttribute('id', 'movieOverview');
  overviewParagraph.innerHTML = overview;

  return overviewParagraph;
}

function getRandomMovie(movies) {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  return randomMovie;
}

function displayMovie(movieInfo) {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.title);
  const overviewText = createMovieOverview(movieInfo.overview);

  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);

  showBtns();
  likeBtn.onclick = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
}

const tmdbKey = 'c22aa0f213207dbeadf7ec9f7e41ef84';
const tmdbBaseUrl = 'https://api.themoviedb.org/3/';
const playBtn = document.getElementById('playBtn');

function getGenres() {
  const genreRequestEndpoint = 'genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlToFetch, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonResponse = JSON.parse(xhr.responseText);
      populateGenreDropdown(jsonResponse.genres);
    }
  };
  xhr.send();
}

function getMovies() {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = 'discover/movie';
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  const urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlToFetch, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonResponse = JSON.parse(xhr.responseText);
      const movies = jsonResponse.results;
      const randomMovie = getRandomMovie(movies);
      getMovieInfo(randomMovie);
    }
  };
  xhr.send();
}

function getMovieInfo(movie) {
  const movieId = movie.id;
  const movieEndpoint = `movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlToFetch, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const movieInfo = JSON.parse(xhr.responseText);
      displayMovie(movieInfo);
    }
  };
  xhr.send();
}

function showRandomMovie() {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  }

  getMovies();
}

getGenres();
playBtn.onclick = showRandomMovie;