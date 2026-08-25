const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector(".search__btn");
const filter = document.querySelector("#filter");
const searchHeading = document.querySelector('#search__results')

const key = "e7458bb4";
let movieData = [];

function showLoading() {
  const moviesElem = document.querySelector(".movies");

  moviesElem.innerHTML = `<div class="loading">
  <i class="fa-solid fa-spinner"></i></div>`;
}

async function getMovies(searchTerm) {
  showLoading();

  try {
    const movies = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${key}`,
    );

    const data = await movies.json();
    movieData = data.Search || [];
    if(movieData.length === 0) {
      const moviesElem = document.querySelector(".movies")

      moviesElem.innerHTML = `
        <div class="no__results">
          <i class="fa-solid fa-film"></i>
          <h3 class="no__results--header">No movies found</h3>
          <p class="no__results--para">Try searching for another movie or keyword.</p>
        </div>`;
      return;
    }

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
  catch (error) {
    console.error("Error fetching movies:", error);

    const moviesElem = document.querySelector(".movies")

    moviesElem.innerHTML = `
        <div class="no__results">
          <i class="fa-solid fa-film"></i>
          <h3 class="no__results--header">Something went wrong</h3>
          <p class="no__results--para">We couldn't load the movies. Please try again.</p>
        </div>`
  }
}

function displayMovies() {
  const moviesElem = document.querySelector(".movies");

  moviesElem.innerHTML = movieData
    .map(
      (movie) =>
        `<div class="movie">
        <div class="movie__top">
          <figure class="movie__img--wrapper">
            <img src="${movie.Poster}" alt="Movie poster for ${movie.Title}" class="movie__poster">
          </figure>
        </div>
        <div class="movie__bottom">
          <div class="movie__title">${movie.Title}</div>
          <div class="movie__release">${movie.Year}</div>
          <div class="movie__rating">
          <i class="fa-solid fa-star"></i>
          ${movie.imdbRating}
          </div>
        </div>
      </div>`,
    )
    .join("");
}

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return;

    localStorage.setItem("movieSearch", searchTerm);
    searchHeading.textContent = `Search results for: "${searchTerm}"`
    getMovies(searchTerm);
  }
});

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) return;

  localStorage.setItem("movieSearch", searchTerm);
  searchHeading.textContent = `Search results for: "${searchTerm}"`
  getMovies(searchTerm);
});

filter.addEventListener("change", () => {
  if (filter.value === "A-Z") {
    movieData.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter.value === "MOST_RECENT") {
    movieData.sort((a, b) => b.Year - a.Year);
  } else if (filter.value === "RATING") {
    movieData.sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating));
  }
  displayMovies();
});

const savedSearch = localStorage.getItem("movieSearch");
if (savedSearch) {
  searchInput.value = savedSearch;
  searchHeading.textContent = `Search results for: "${savedSearch}"`
  getMovies(savedSearch);
}
