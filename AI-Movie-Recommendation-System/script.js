console.log("Script loaded");

const API_KEY = "7c6e85d2";

const movies = [
    { name: "RRR", genres: ["action", "drama", "historical"] },
    { name: "Pushpa", genres: ["action", "crime", "drama"] },
    { name: "Baahubali: The Beginning", genres: ["action", "fantasy", "adventure"] },
    { name: "Salaar", genres: ["action", "thriller"] },
    { name: "3 Idiots", genres: ["comedy", "drama", "education"] },
    { name: "Dangal", genres: ["sports", "drama"] },
    { name: "PK", genres: ["comedy", "drama"] },
    { name: "Jawan", genres: ["action", "drama"] },
    { name: "Pathaan", genres: ["action", "thriller"] },
    { name: "Sairat", genres: ["romance", "drama"] },
    { name: "Natsamrat", genres: ["drama"] },
    { name: "The Avengers", genres: ["action", "superhero", "adventure"] },
    { name: "Interstellar", genres: ["sci-fi", "drama"] }
];

// Generate Genre Checkboxes
const allGenres = [...new Set(movies.flatMap(movie => movie.genres))];

document.getElementById("genres").innerHTML =
    allGenres.map(genre =>
        `<label><input type="checkbox" value="${genre}"> ${genre}</label>`
    ).join("");

// Fetch Movie Data
async function getPoster(title) {

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`
        );

        const data = await response.json();

        return {
            poster:
                data.Poster && data.Poster !== "N/A"
                    ? data.Poster
                    : "https://via.placeholder.com/300x450?text=No+Poster",
            rating: data.imdbRating || "N/A",
            year: data.Year || "N/A",
            plot: data.Plot || "Plot not available."
        };

    } catch (error) {

        console.error(error);

        return {
            poster: "https://via.placeholder.com/300x450?text=No+Poster",
            rating: "N/A",
            year: "N/A",
            plot: "Plot not available."
        };
    }
}

// Search Movie Directly
async function searchMovie() {

    const movieName =
        document.getElementById("movieSearch")
        .value
        .trim();

    if (!movieName) return;

    const response = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${API_KEY}`
    );

    const data = await response.json();

    const results = document.getElementById("results");
    const topPick = document.getElementById("topPick");

    results.innerHTML = "";
    topPick.innerHTML = "";

    if (data.Response === "False") {
        results.innerHTML =
            "<h2 style='text-align:center'>Movie not found!</h2>";
        return;
    }

    results.innerHTML = `
        <div class="card">

            <img src="${data.Poster}" alt="${data.Title}" class="poster">

            <h3>${data.Title}</h3>

            <p>⭐ ${data.imdbRating} | 📅 ${data.Year}</p>

            <p class="plot">
                ${data.Plot}
            </p>

            <a
                href="https://www.youtube.com/results?search_query=${encodeURIComponent(data.Title + ' trailer')}"
                target="_blank"
                class="trailer-btn"
            >
                ▶ Watch Trailer
            </a>

        </div>
    `;
}

// Enter Key Search
function handleSearch(event) {

    if (event.key === "Enter") {
        searchMovie();
    }
}

// Genre Recommendation
async function recommendMovies() {

    const selectedGenres =
        [...document.querySelectorAll('#genres input:checked')]
            .map(cb => cb.value);

    const topPick = document.getElementById("topPick");
    const results = document.getElementById("results");

    results.innerHTML = "";
    topPick.innerHTML = "";

    if (selectedGenres.length === 0) {

        results.innerHTML =
            "<h2 style='text-align:center'>Please select at least one genre.</h2>";

        return;
    }

    const rankedMovies = movies
        .map(movie => ({
            ...movie,
            score: selectedGenres.filter(
                genre => movie.genres.includes(genre)
            ).length
        }))
        .filter(movie => movie.score > 0)
        .sort((a, b) => b.score - a.score);

    if (rankedMovies.length === 0) {

        results.innerHTML =
            "<h2 style='text-align:center'>No movies found.</h2>";

        return;
    }

    // Top Recommendation
    const bestMovie = rankedMovies[0];
    const bestMovieData = await getPoster(bestMovie.name);

    topPick.innerHTML = `
        <div class="featured">

            <img src="${bestMovieData.poster}" alt="${bestMovie.name}">

            <div class="featured-content">

                <h2>🏆 Top Recommendation</h2>

                <h1>${bestMovie.name}</h1>

                <p>⭐ IMDb: ${bestMovieData.rating}</p>

                <p>📅 Year: ${bestMovieData.year}</p>

                <p>🎯 Match Score: ${bestMovie.score}</p>

                <p>${bestMovie.genres.join(", ")}</p>

                <p style="margin-top:15px;line-height:1.6;">
                    ${bestMovieData.plot}
                </p>

                <a
                    href="https://www.youtube.com/results?search_query=${encodeURIComponent(bestMovie.name + ' trailer')}"
                    target="_blank"
                    class="trailer-btn"
                >
                    ▶ Watch Trailer
                </a>

            </div>

        </div>
    `;

    // Movie Cards
    for (const movie of rankedMovies) {

        const movieData = await getPoster(movie.name);

        results.innerHTML += `
            <div class="card">

                <img src="${movieData.poster}" alt="${movie.name}" class="poster">

                <h3>${movie.name}</h3>

                <p>⭐ ${movieData.rating} | 📅 ${movieData.year}</p>

                <p>${movie.genres.join(", ")}</p>

                <p class="plot">
                    ${movieData.plot}
                </p>

                <span class="score">
                    🎯 Match Score: ${movie.score}
                </span>

                <a
                    href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.name + ' trailer')}"
                    target="_blank"
                    class="trailer-btn"
                >
                    ▶ Watch Trailer
                </a>

            </div>
        `;
    }
}