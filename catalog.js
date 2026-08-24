const searchInput = document.querySelector("#search-input");
const filter = document.querySelector("#filter");
console.log("searchInput", searchInput)

const key = "e7458bb4";
let movieData = [];

function showLoading() {
  const moviesElem = document.querySelector(".movies");

  moviesElem.innerHTML = `<div class="loading">
  <i class="fa-solid fa-spinner"></i></div>`
}

async function getMovies(searchTerm) {
  showLoading();

  const movies = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${key}`,
  );

  const data = await movies.json();
  movieData = data.Search;

  for (let i = 0; i < movieData.length; i++) {
    const movie = movieData[i];

    const response = await fetch(
      `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${key}`,
    );

    const details = await response.json();
    console.log(movie.Title, details);
    movie.imdbRating = details.imdbRating;
  }
  displayMovies();
}

function displayMovies() {
  const moviesElem = document.querySelector(".movies");

  moviesElem.innerHTML = movieData
    .map(
      (movie) =>
        `<div class="movie">
        <div class="movie__top">
          <figure class="movie__img--wrapper">
            <img src="${movie.Poster}" alt="" class="movie__poster">
          </figure>
        </div>
        <div class="movie__bottom">
          <div class="movie__title">${movie.Title}</div>
          <div class="movie__release">${movie.Year}</div>
          <div class="movie__rating">
          <i class="fa-solid fa-star";"></i>
          ${movie.imdbRating}
          </div>
        </div>
      </div>`,
    )
    .join("");
}

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim()
    
    if (!searchTerm) return;

    localStorage.setItem("movieSearch", searchTerm)
    getMovies(searchTerm)
  }
});



filter.addEventListener("change", () => {
  if (filter.value === "A-Z") {
    movieData.sort((a, b) => a.Title.localeCompare(b.Title));
    displayMovies();
  }
  if (filter.value === "MOST_RECENT") {
    movieData.sort((a, b) => b.Year - a.Year);
    displayMovies();
  } else if (filter.value === "RATING") {
    movieData.sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating));
  }
  displayMovies();
});

const savedSearch = localStorage.getItem("movieSearch");
if (savedSearch) {
  searchInput.value = savedSearch;
  getMovies(savedSearch)
}