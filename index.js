const apiKey = 'YOUR_OMDB_API_KEY';
const searchInput = document.getElementById('searchInput');
const movieList = document.getElementById('movieList');
const movieDetails = document.getElementById('movieDetails');

let timeout;

searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            movieList.innerHTML = '';
            movieDetails.innerHTML = '';
        }
    }, 500);
});

function searchMovies(query) {
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovieList(data.Search);
            } else {
                movieList.innerHTML = '<p>No movies found</p>';
            }
        });
}

function displayMovieList(movies) {
    movieList.innerHTML = movies.map(movie => `
        <div class="movie-item" data-id="${movie.imdbID}">
            ${movie.Title} (${movie.Year})
        </div>
    `).join('');

    document.querySelectorAll('.movie-item').forEach(item => {
        item.addEventListener('click', () => {
            const movieId = item.getAttribute('data-id');
            fetchMovieDetails(movieId);
        });
    });
}

function fetchMovieDetails(movieId) {
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovieDetails(data);
            }
        });
}

function displayMovieDetails(movie) {
    movieDetails.innerHTML = `
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <img src="${movie.Poster}" alt="${movie.Title} Poster">
    `;
}
