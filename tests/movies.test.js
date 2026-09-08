import test from "node:test";
import assert from "node:assert/strict";
import {
  searchState,
  validId,
  normalize,
  rankMovies,
  sortMovies,
  trailer,
  resultsUrl,
  safeBack,
} from "../lib/movie-mappers.js";
test("URL state is trimmed, bounded and safely encoded", () => {
  assert.deepEqual(
    searchState({ q: " space & stars ", page: "-1", sort: "bad" }),
    { q: "space & stars", page: 1, sort: "relevance" },
  );
  assert.equal(searchState({ page: "9999" }).page, 500);
  assert.match(
    resultsUrl({ q: "a&b", page: 2, sort: "rating" }),
    /q=a%26b&page=2&sort=rating/,
  );
  assert.equal(safeBack("https://evil.test"), "/catalog");
  assert.equal(safeBack("//evil.test"), "/catalog");
});
test("movie IDs and incomplete records are normalized", () => {
  assert.ok(validId("123"));
  assert.ok(!validId("../secret"));
  assert.ok(!validId("0"));
  const m = normalize({ id: 2 });
  assert.equal(m.poster, null);
  assert.equal(m.score, null);
  assert.equal(m.title, "Untitled movie");
});
test("combined relevance deduplicates IDs and puts exact titles first", () => {
  const a = { id: "1", title: "Space adventure" },
    b = { id: "2", title: "Space" };
  assert.deepEqual(
    rankMovies([a], [a, b], "space").map((m) => m.id),
    ["2", "1"],
  );
});
test("sort orders missing scores last and does not mutate input", () => {
  const movies = [
    { score: null, title: "B" },
    { score: 8, title: "A" },
  ];
  assert.equal(sortMovies(movies, "rating")[0].title, "A");
  assert.equal(movies[0].title, "B");
});
test("trailer selection validates provider keys and prefers official English", () => {
  const videos = [
    { site: "YouTube", key: "bad", type: "Trailer" },
    {
      site: "Vimeo",
      key: "123456",
      type: "Trailer",
      iso_639_1: "fr",
      official: true,
    },
    {
      site: "YouTube",
      key: "aqz-KE-bpKQ",
      type: "Trailer",
      iso_639_1: "en",
      official: true,
    },
  ];
  assert.equal(trailer(videos).key, "aqz-KE-bpKQ");
  assert.equal(trailer([]), null);
});
