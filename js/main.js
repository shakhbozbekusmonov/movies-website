// GET ELEMENTS
const elMoviesList = document.querySelector(".js-movies-list");
const elMoviesTemplate = document.querySelector(".js-movies-temp").content;
// const newMoviesFragment = document.createDocumentFragment();
const newMoviesFragment = new DocumentFragment();

const elSearchForm = document.querySelector(".js-search-form");
const elSearchFormInput = elSearchForm.querySelector(".js-search-form-input");

// MODAL
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
function getDuration(time){
    const hours = Math.floor(time / 60);
    const minuts = Math.floor(time % 60);
    return `${hours} hrs ${minuts} min`;
}

function renderMovies(movies){

    elMoviesList.innerHTML = null;

    movies.forEach((movie) => {
        const elCloneMovie = elMoviesTemplate.cloneNode(true);

        elCloneMovie.querySelector(".js-movies-img").src = `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`;
        elCloneMovie.querySelector(".js-movies-img").alt = movie.Title;
        elCloneMovie.querySelector(".js-movies-title").textContent = movie.Title;
        elCloneMovie.querySelector(".js-movies-rating").textContent = movie.imdb_rating;
        elCloneMovie.querySelector(".js-movies-year").textContent = movie.movie_year;
        elCloneMovie.querySelector(".js-movies-runtime").textContent = getDuration(movie.runtime);
        elCloneMovie.querySelector(".js-movies-categories").textContent = movie.Categories.split("|").join(", ");
        elCloneMovie.querySelector(".js-movies-btn").dataset.id = movie.imdb_id;

        newMoviesFragment.appendChild(elCloneMovie);
    });

    elMoviesList.appendChild(newMoviesFragment);
}

function renderModalInfo(findMovie){
    elModalTitle.textContent = findMovie.Title;
    elModalIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.ytid}`;
    elModalRating.textContent = findMovie.imdb_rating;
    elModalYear.textContent = findMovie.movie_year;
    elModalRuntime.textContent = getDuration(findMovie.runtime);
    elModalCategories.textContent = findMovie.Categories.split("|").join(", ");
    elModalSummary.textContent = findMovie.summary;
    elModalLink.href = `https://www.imdb.com/title/${findMovie.imdb_id}`;
}

// EVENT DELEGATION
elMoviesList.addEventListener("click", function(evt){
    const elmentTarget = evt.target;
    // console.log(elmentTarget);
    const btnId = elmentTarget.dataset.id;
    // console.log(btnId);
    if(elmentTarget.matches(".js-movies-btn")){
        const foundMovie = movies.find((movie) => movie.imdb_id === btnId);
        renderModalInfo(foundMovie);
        console.log(foundMovie);
    }
});

elModal.addEventListener("hide.bs.modal", function(){
    elModalIframe.src = null;
});


elSearchForm.addEventListener("submit", function(evt){
    evt.preventDefault();

    const searchQuery = new RegExp(elSearchFormInput.value, "gi");

    const foundMovies = movies.filter((movie) => String(movie.Title).match(searchQuery));

    if(foundMovies.length > 0){
        renderMovies(foundMovies);
    } else {
        elMoviesList.innerHTML = `<div class='text-white display-3'>"${elSearchFormInput.value}" movie  Not found🙄</div>`;
    }
});

renderMovies(movies.slice(0, 10));