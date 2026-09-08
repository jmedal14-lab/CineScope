export const scalar = (value) => (typeof value === "string" ? value : "");
export function searchState(params = {}) {
  return {
    q: scalar(params.q).trim().slice(0, 150),
    page: Math.min(
      500,
      Math.max(1, Number.parseInt(scalar(params.page), 10) || 1),
    ),
    sort: ["az", "newest", "rating"].includes(params.sort)
      ? params.sort
      : "relevance",
  };
}
export const validId = (id) => /^[1-9]\d{0,8}$/.test(String(id));
export function normalize(movie) {
  return {
    id: String(movie.id),
    title: movie.title || "Untitled movie",
    year: movie.release_date?.slice(0, 4) || null,
    releaseDate: movie.release_date || null,
    poster: movie.poster_path || null,
    backdrop: movie.backdrop_path || null,
    overview: movie.overview || "",
    score:
      movie.vote_count > 0 && Number.isFinite(movie.vote_average)
        ? movie.vote_average
        : null,
    genres: movie.genres?.map((g) => g.name) || [],
  };
}
export function rankMovies(titles, keywords, q) {
  const unique = [
    ...new Map([...titles, ...keywords].map((m) => [String(m.id), m])).values(),
  ];
  const positions = new Map();
  [...titles, ...keywords].forEach((m, i) => {
    if (!positions.has(String(m.id))) positions.set(String(m.id), i);
  });
  return unique.sort(
    (a, b) =>
      Number(b.title.toLowerCase() === q.toLowerCase()) -
        Number(a.title.toLowerCase() === q.toLowerCase()) ||
      positions.get(a.id) - positions.get(b.id),
  );
}
export function sortMovies(movies, sort) {
  return [...movies].sort((a, b) =>
    sort === "az"
      ? a.title.localeCompare(b.title)
      : sort === "newest"
        ? (b.releaseDate || "").localeCompare(a.releaseDate || "")
        : sort === "rating"
          ? (b.score ?? -1) - (a.score ?? -1)
          : 0,
  );
}
export function trailer(videos = []) {
  return (
    videos
      .filter(
        (v) =>
          v.type === "Trailer" &&
          ((v.site === "YouTube" && /^[\w-]{11}$/.test(v.key)) ||
            (v.site === "Vimeo" && /^\d+$/.test(v.key))),
      )
      .sort(
        (a, b) =>
          Number(b.iso_639_1 === "en") * 2 +
          Number(b.official) -
          (Number(a.iso_639_1 === "en") * 2 + Number(a.official)),
      )[0] || null
  );
}
export function resultsUrl(state, catalog = false) {
  return `${catalog ? "/catalog" : "/search"}?${new URLSearchParams({ ...(catalog ? {} : { q: state.q }), page: String(state.page), sort: state.sort })}`;
}
export function safeBack(value) {
  return typeof value === "string" && /^\/(search|catalog)\?[^#]*$/.test(value)
    ? value
    : "/catalog";
}
