// GET ELEMENTS FROM DOM
const elMoviesList = document.querySelector(".js-movies-list");
const elMoviesTemplate = document.querySelector(".js-movies-temp").content;
const newMoviesFragment = new DocumentFragment();
// ----------------------------------------------------------------
const elSearchForm = document.querySelector(".js-search-form");
const elSearchInput = elSearchForm.querySelector(".js-search-input");
const elGenresSelect = elSearchForm.querySelector(".js-select-genres");
const elFromYear = elSearchForm.querySelector(".js-from-year");
const elToYear = elSearchForm.querySelector(".js-to-year");
const elSortMovies = elSearchForm.querySelector(".js-movies-sort");

// NORMALIZE MOVIES
const normalizeMovies = movies.map((movie) => {
  return {
    movie_title: movie.Title,
    movie_full_title: movie.fullTitle,
    movie_year: movie.movie_year,
    movie_categories: movie.Categories,
    movie_summary: movie.summary,
    movie_image_url: movie.ImageURL,
    movie_imdb_id: movie.imdb_id,
    movie_imdb_rating: movie.imdb_rating,
    movie_runtime: movie.runtime,
    movie_language: movie.language,
    movie_ytid: movie.ytid,
  };
});

// GENERATE CATEGORIES
let genresFragment = new DocumentFragment();
const genres = [];
function generateCategories(movies) {
  movies.forEach((movie) => {
    movie.movie_categories.split("|").forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });
  genres.sort();
}

generateCategories(normalizeMovies);

genres.forEach((genre) => {
  let genreOption = document.createElement("option");
  genreOption.textContent = genre;
  genreOption.value = genre;

  genresFragment.append(genreOption);
});

elGenresSelect.appendChild(genresFragment);


// GET MODAL ELEMENTS FROM DOM
const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".modal-title");
const elModalIframe = elModal.querySelector(".modal-iframe");
const elModalRating = elModal.querySelector(".modal-rating");
const elModalYear = elModal.querySelector(".modal-year");
const elModalRuntime = elModal.querySelector(".modal-runtime");
const elModalCategories = elModal.querySelector(".modal-categories");
const elModalSummary = elModal.querySelector(".modal-description");
const elModalLink = elModal.querySelector(".modal-link");

// GET DURATION
function getDuration(time) {
  const hours = Math.floor(time / 60);
  const minuts = Math.floor(time % 60);
  return `${hours} hrs ${minuts} min`;
}

// RENDER FUNCTION
function renderMovies(movies) {
  elMoviesList.innerHTML = null;

  movies.forEach((movie) => {
    const elCloneMovie = elMoviesTemplate.cloneNode(true);

    elCloneMovie.querySelector(
      ".js-movies-img"
    ).src = `http://i3.ytimg.com/vi/${movie.movie_ytid}/hqdefault.jpg`;
    elCloneMovie.querySelector(".js-movies-img").alt = movie.movie_title;
    elCloneMovie.querySelector(".js-movies-title").textContent =
      movie.movie_title;
    elCloneMovie.querySelector(".js-movies-rating").textContent =
      movie.movie_imdb_rating;
    elCloneMovie.querySelector(".js-movies-year").textContent =
      movie.movie_year;
    elCloneMovie.querySelector(".js-movies-runtime").textContent = getDuration(
      movie.movie_runtime
    );
    elCloneMovie.querySelector(".js-movies-categories").textContent =
      movie.movie_categories.split("|").join(", ");
    elCloneMovie.querySelector(".js-movies-btn").dataset.id =
      movie.movie_imdb_id;

    newMoviesFragment.appendChild(elCloneMovie);
  });

  elMoviesList.appendChild(newMoviesFragment);
}

// RENDER MODAL INFO
function renderModalInfo(findMovie) {
  elModalTitle.textContent = findMovie.movie_title;
  elModalIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.movie_ytid}`;
  elModalRating.textContent = findMovie.movie_imdb_rating;
  elModalYear.textContent = findMovie.movie_year;
  elModalRuntime.textContent = getDuration(findMovie.movie_runtime);
  elModalCategories.textContent = findMovie.movie_categories
    .split("|")
    .join(", ");
  elModalSummary.textContent = findMovie.movie_summary;
  elModalLink.href = `https://www.imdb.com/title/${findMovie.movie_imdb_id}`;
}

// MODAL RENDER EVENT DELEGATION
elMoviesList.addEventListener("click", function (evt) {
  const elementTarget = evt.target;
  const btnId = elementTarget.dataset.id;

  if (elementTarget.matches(".js-movies-btn")) {
    const foundMovie = normalizeMovies.find((movie) => movie.movie_imdb_id === btnId);
    renderModalInfo(foundMovie);
  }
});

// MODAL RESET IFRAME SRC
elModal.addEventListener("hide.bs.modal", function () {
  elModalIframe.src = null;
});

// SEARCH MOVIES
function showSearchMovies(search){
  const filteredMovies = normalizeMovies.filter(
    (movie) => {
     const moreCriteries = String(movie.movie_title).match(search) &&
      (elGenresSelect.value == "all" ||
        movie.movie_categories.includes(elGenresSelect.value)) &&
      (elFromYear.value == "" ||
        (movie.movie_year >= Number(elFromYear.value) &&
          (elToYear.value == "" || movie.movie_year <= Number(elToYear.value))));
      return moreCriteries;
    });
  return filteredMovies;
}

// SORTED MOVIES
function sortMovies(movies, sortType){
  if(sortType == "a-z"){
    movies.sort((a, b) => {
      if (String(a.movie_title).toLowerCase() > String(b.movie_title).toLowerCase())
        return 1;
      else if (
        String(a.movie_title).toLowerCase() <
        String(b.movie_title).toLowerCase()
      )
        return -1;
      else return 0;
    })
  }

  if(sortType == "z-a"){
    movies.sort((a, b) => {
      if (
        String(a.movie_title).toLowerCase() >
        String(b.movie_title).toLowerCase()
      )
        return -1;
      else if (
        String(a.movie_title).toLowerCase() <
        String(b.movie_title).toLowerCase()
      )
        return 1;
      else return 0;
    });
  }

  if (sortType == "oldest-latest") {
    movies.sort((a, b) => a.movie_year - b.movie_year); 
  }

  if (sortType == "latest-oldest") {
    movies.sort((a, b) => b.movie_year - a.movie_year);
  }

  if (sortType == "low-rated") {
    movies.sort((a, b) => a.movie_imdb_rating - b.movie_imdb_rating);
  }

  if (sortType == "high-rated") {
    movies.sort((a, b) => b.movie_imdb_rating - a.movie_imdb_rating);
  }
}

// SEARCH EVENTS  
elSearchForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const searchQuery = new RegExp(elSearchInput.value, "gi");
  const searchMovies = showSearchMovies(searchQuery);
  if(searchMovies.length > 0){
    sortMovies(searchMovies, elSortMovies.value);
    renderMovies(searchMovies);
  } else {
    elMoviesList.innerHTML = `<div class='d-flex flex-column'>
      <p class="text-white display-3">"${elSearchInput.value}" movie  Not found🙄</p>
      <a class="text-white w-25 back-link text-decoration-underline">Back</a>
    </div>`;
  }
});
// BACK LOCATION EVENTS
elMoviesList.addEventListener("click", (evt) => {
  if(evt.target.matches(".back-link")){
    window.location.reload();
  }
});

// RENDER MOVIES
renderMovies(normalizeMovies.slice(0, 10));
