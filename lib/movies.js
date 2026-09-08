import "server-only";
import { cache } from "react";
import { fixtures } from "./fixtures.js";
import {
  normalize,
  rankMovies,
  sortMovies,
  trailer,
  validId,
} from "./movie-mappers.js";
export const isDemo = () =>
  process.env.CINESCOPE_DEMO === "true" || !process.env.TMDB_READ_ACCESS_TOKEN;
async function api(path, params = {}) {
  const response = await fetch(
    `https://api.themoviedb.org/3${path}?${new URLSearchParams({ language: "en-US", ...params })}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(12000),
    },
  );
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(
      "Movie provider temporarily unavailable. Please try again.",
    );
  return response.json();
}
export async function listMovies(state, catalog = false) {
  const { q, page, sort } = state;
  if (isDemo()) {
    const matching = catalog
      ? fixtures
      : fixtures.filter(
          (m) =>
            m.title.toLowerCase().includes(q.toLowerCase()) ||
            m.keywords.some((k) => k.includes(q.toLowerCase())),
        );
    return {
      movies: sortMovies(matching.slice((page - 1) * 10, page * 10), sort),
      hasNext: page * 10 < matching.length,
      note: "Demo collection · fictional films and sample scores.",
    };
  }
  if (catalog) {
    const data = await api("/movie/popular", { page: String(page) });
    return {
      movies: sortMovies(data.results.map(normalize), sort),
      hasNext: page < Math.min(data.total_pages, 500),
      note: "Popular films from TMDb.",
    };
  }
  const [titleData, keywordData] = await Promise.all([
    api("/search/movie", {
      query: q,
      page: String(page),
      include_adult: "false",
    }),
    api("/search/keyword", { query: q }),
  ]);
  const ids = (keywordData.results || [])
    .sort(
      (a, b) =>
        Number(b.name.toLowerCase() === q.toLowerCase()) -
          Number(a.name.toLowerCase() === q.toLowerCase()) || a.id - b.id,
    )
    .slice(0, 3)
    .map((k) => k.id);
  const discovery = ids.length
    ? await api("/discover/movie", {
        with_keywords: ids.join("|"),
        page: String(page),
        include_adult: "false",
        include_video: "false",
        sort_by: "popularity.desc",
      })
    : { results: [], total_pages: 0 };
  return {
    movies: sortMovies(
      rankMovies(
        titleData.results.map(normalize),
        discovery.results.map(normalize),
        q,
      ),
      sort,
    ),
    hasNext:
      page <
      Math.min(500, Math.max(titleData.total_pages, discovery.total_pages)),
    note: "Each page combines title results and discovery using up to 3 matching keywords. Duplicates are removed within the page; films can repeat across pages. Exact titles rank first. Keyword matching is not semantic search.",
  };
}
export const getMovie = cache(async (id) => {
  if (!validId(id)) return null;
  if (isDemo()) {
    const movie = fixtures.find((m) => m.id === id);
    return movie
      ? {
          ...movie,
          recommendations: fixtures.filter((m) => m.id !== id).slice(0, 5),
        }
      : null;
  }
  const movie = await api(`/movie/${id}`, {
    append_to_response: "credits,videos,recommendations,release_dates",
  });
  if (!movie) return null;
  let selectedTrailer = trailer(movie.videos?.results);
  if (
    !selectedTrailer &&
    movie.original_language &&
    movie.original_language !== "en"
  ) {
    try {
      const fallback = await api(`/movie/${id}/videos`, {
        language: movie.original_language,
      });
      selectedTrailer = trailer(fallback?.results);
    } catch {
      // An optional trailer outage should not hide available movie details.
    }
  }
  return {
    ...normalize(movie),
    runtime: movie.runtime || null,
    status: movie.status,
    language: movie.spoken_languages?.map((l) => l.english_name).join(", "),
    director: movie.credits?.crew
      ?.filter((c) => c.job === "Director")
      .map((c) => c.name)
      .join(", "),
    certification:
      movie.release_dates?.results
        ?.find((r) => r.iso_3166_1 === "US")
        ?.release_dates?.find((r) => r.certification)?.certification || null,
    budget: movie.budget || null,
    revenue: movie.revenue || null,
    production: movie.production_companies?.map((c) => c.name).join(", "),
    cast: (movie.credits?.cast || [])
      .sort((a, b) => a.order - b.order)
      .map((c) => ({
        id: String(c.id),
        name: c.name,
        character: c.character || "",
        portrait: c.profile_path || null,
      })),
    trailer: selectedTrailer,
    recommendations: [
      ...new Map(
        (movie.recommendations?.results || [])
          .filter((m) => String(m.id) !== id)
          .map((m) => [m.id, normalize(m)]),
      ).values(),
    ].slice(0, 10),
  };
});
