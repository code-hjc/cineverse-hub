// ==========================================================
// CineVerse Hub - Live Movies/Series loader (TMDB API)
// ==========================================================
// STEP 1: Apni free TMDB API key yaha daalein
// (https://www.themoviedb.org/settings/api se lein)
const TMDB_API_KEY = "a271e0475a66f52223a2a29335071dd8";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// Har page apna "type" set karega (movies.html me MODE = "movies", series.html me "series", Trending.html me "trending")
async function loadContent(mode) {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  grid.innerHTML = `<p style="color:#ffcc00;">Loading...</p>`;

  let url = "";

  if (mode === "movies") {
    // Abhi releases / now playing movies
    url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
  } else if (mode === "series") {
    // Popular TV series
    url = `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
  } else if (mode === "trending") {
    // Trending movies + series (day)
    url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      grid.innerHTML = `<p>Koi data nahi mila.</p>`;
      return;
    }

    grid.innerHTML = ""; // purana loading text hatao

    data.results.slice(0, 20).forEach((item) => {
      const title = item.title || item.name || "Untitled";
      const poster = item.poster_path
        ? IMG_BASE + item.poster_path
        : "https://via.placeholder.com/200x250?text=No+Image";
      const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${poster}" alt="${title}" loading="lazy"
             onerror="this.onerror=null;this.src='https://via.placeholder.com/200x250/333333/ffffff?text=No+Image';">
        <p>${title} ⭐ ${rating}</p>
        <button>${mode === "movies" ? "Download" : "Watch"}</button>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p>Data load nahi ho paya. API key check karein.</p>`;
    console.error(err);
  }
}
