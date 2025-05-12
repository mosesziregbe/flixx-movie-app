const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'a417fc1e2fd93fac47f8b9160f3a38cc',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

console.log(global.currentPage);

// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)

//
//

// 1. Display 20 most popular movies

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<div class="card">
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${getDate(
                movie.release_date
              )}</small>
            </p>
          </div>`;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

//
//

// 2. Display 20 most popular TV shows

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  // console.log(results);
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<div class="card">
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${getDate(
                show.first_air_date
              )}</small>
            </p>
          </div>`;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

//

// 3. Display Movie Details

async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  // console.log(movieId);

  const movie = await fetchAPIData(`movie/${movieId}`);

  // console.log(movie);

  const { cast } = await fetchAPIData(`movie/${movieId}/credits`);

  const firstFiveCastNames = cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(', ');

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `<div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
            }
          
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${getDate(
              movie.release_date
            )}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <p><strong>Cast: </strong>${firstFiveCastNames}</p> 
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div><div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            <li><span class="text-secondary">Production ${
              movie.production_countries.length === 1 ? 'Country' : 'Countries'
            }:</span> ${movie.production_countries
    .map((country) => `<span>${country.name}</span>`)
    .join(', ')}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group"> ${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(', ')}</div>
        </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

// 4. Display Backdrop On Details Page

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;

  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// 5. Display Show Details

async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);
  // console.log(show);

  const { cast } = await fetchAPIData(`tv/${showId}/aggregate_credits`);

  const firstTenCastNames = cast
    .slice(0, 10)
    .map((actor) => actor.name)
    .join(', ');

  // console.log(firstTenCastNames);

  // Overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `<div class="details-top">
          <div> ${
            show.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            />`
              : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
            />`
          }
            </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${getDate(
              show.last_air_date
            )}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <p><strong>Cast: </strong>${firstTenCastNames}</p> 
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
		
		
 <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
            <li><span class="text-secondary">Production ${
              show.production_countries.length === 1 ? 'Country' : 'Countries'
            }:</span> ${show.production_countries
    .map((country) => `<span>${country.name}</span>`)
    .join(', ')}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(', ')}</div>
        </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// 6. Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
        `;
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

//

// 7. Swiper from Swiper Library

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      500: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//

// 8. Search Movies/Shows

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    // console.log(results);

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term');
  }
}

//
//

// 9. Display Search Results

function displaySearchResults(results) {
  // Clear Previous results

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<div class="card">
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === 'movie'
                  ? getDate(result.release_date)
                  : getDate(result.first_air_date)
              }</small>
            </p>
          </div>`;

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// 10. Create & Display Pagination for Search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        `;

  document.querySelector('#pagination').appendChild(div);

  // Disable preview button if on first page

  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// 11. Display Trending This Week

async function displayTrending() {
  const { results } = await fetchAPIData('trending/all/week');
  // console.log(results);

  results.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<div class="card">
          <a href="${
            item.media_type === 'movie' ? 'movie' : 'tv'
          }-details.html?id=${item.id}">
            ${
              item.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${item.poster_path}"
            class="card-img-top"
            alt="${item.title || item.name}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${item.title || item.name}"
        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${item.title || item.name}</h5>
            <p class="card-text">
              <small class="text-muted">${
                item.media_type === 'movie' ? 'Release' : 'Air Date'
              }: ${
      item.release_date
        ? getDate(item.release_date)
        : getDate(item.first_air_date)
    }</small>
            </p>
            <p class="card-text">
              <small class="text-muted"><strong>User Score</strong>: ${
                item.vote_average > 0
                  ? `${item.vote_average.toFixed(1) * 10}%`
                  : 'NR'
              }</small>
            </p>
          </div>`;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// 12. Display Trending Today

async function displayTrendingToday() {
  const { results } = await fetchAPIData('trending/all/day');
  // console.log(results);

  results.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<div class="card">
          <a href="${
            item.media_type === 'movie' ? 'movie' : 'tv'
          }-details.html?id=${item.id}">
            ${
              item.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${item.poster_path}"
            class="card-img-top"
            alt="${item.title || item.name}"
          />`
                : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${item.title || item.name}"
        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${item.title || item.name}</h5>
            <p class="card-text">
              <small class="text-muted">${
                item.media_type === 'movie' ? 'Release' : 'Air Date'
              }: ${
      item.release_date
        ? getDate(item.release_date)
        : getDate(item.first_air_date)
    }</small>
            </p>
            <p class="card-text">
              <small class="text-muted"><strong>User Score</strong>: ${
                item.vote_average > 0
                  ? `${item.vote_average.toFixed(1) * 10}%`
                  : 'NR'
              }</small>
            </p>
          </div>`;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Global Functions

// Fetch data from TMDB API

// Register your key at https://www.themoviedb.org/settings/api and
// enter here

// Only use this for development or very small projects.
// You should store your key and make requests from a server

async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

//

// Make Request to Search

async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Show spinner

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

// Hide Spinner

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') == global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Add Commas to Number

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get Date
function getDate(date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const release_date = new Date(date);
  return `${
    months[release_date.getMonth()]
  } ${release_date.getDate()}, ${release_date.getFullYear()}`;
}

// Show Alert
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(() => alertEl.remove(), 3000);
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      // console.log('Home');
      displaySlider();
      displayPopularMovies();
      break;

    case '/shows.html':
      // console.log('Shows');
      displayPopularShows();
      break;
    case '/movie-details.html':
      // console.log('Movie Details');
      displayMovieDetails();
      break;
    case '/tv-details.html':
      // console.log('TV Details');
      displayShowDetails();
      break;
    case '/trending.html':
      // console.log('Trending Movies/Shows');
      displayTrending();
      // console.log(getDate());
      break;
    case '/trending-today.html':
      // console.log('Trending Movies/Shows Today');
      displayTrendingToday();
      break;
    case '/search.html':
      // console.log('Search');
      search();
      break;
  }

  highlightActiveLink();
}

// document.addEventListener('DOMContentLoaded', init);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the app
  init();

  // Setup navigation
  setupNavigation();
});

// Navigation setup function
function setupNavigation() {
  const btn = document.getElementById('menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu-items');

  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    mobileMenu.classList.toggle('active');
  });

  // Scroll effect for navbar
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      navbar.classList.add('navbar-scroll');
    } else {
      navbar.classList.remove('navbar-scroll');
    }
  });
}
