import test from "node:test";
import assert from "node:assert/strict";
import { listMovies, getMovie } from "../lib/movies.js";
function live(t, handler) {
  const oldToken = process.env.TMDB_READ_ACCESS_TOKEN,
    oldDemo = process.env.CINESCOPE_DEMO;
  process.env.TMDB_READ_ACCESS_TOKEN = "test-only-placeholder";
  process.env.CINESCOPE_DEMO = "false";
  t.mock.method(globalThis, "fetch", handler);
  t.after(() => {
    if (oldToken === undefined) delete process.env.TMDB_READ_ACCESS_TOKEN;
    else process.env.TMDB_READ_ACCESS_TOKEN = oldToken;
    if (oldDemo === undefined) delete process.env.CINESCOPE_DEMO;
    else process.env.CINESCOPE_DEMO = oldDemo;
  });
}
const json = (data) => new Response(JSON.stringify(data), { status: 200 });
test("live adapter bounds keyword IDs and discovers movies with honest pagination", async (t) => {
  const calls = [];
  live(t, async (address) => {
    const url = new URL(address);
    calls.push(url);
    if (url.pathname.endsWith("/search/movie"))
      return json({ results: [{ id: 1, title: "Space" }], total_pages: 1 });
    if (url.pathname.endsWith("/search/keyword"))
      return json({
        results: [
          { id: 4, name: "space" },
          { id: 2, name: "space travel" },
          { id: 3, name: "outer space" },
          { id: 1, name: "space station" },
        ],
      });
    assert.equal(url.pathname, "/3/discover/movie");
    assert.equal(url.searchParams.get("with_keywords"), "4|1|2");
    return json({
      results: [
        { id: 1, title: "Space" },
        { id: 2, title: "Orbit" },
      ],
      total_pages: 4,
    });
  });
  const result = await listMovies({ q: "space", page: 2, sort: "relevance" });
  assert.equal(calls.length, 3);
  assert.deepEqual(
    result.movies.map((m) => m.id),
    ["1", "2"],
  );
  assert.equal(result.hasNext, true);
  assert.match(result.note, /repeat across pages/);
});
test("unknown keywords avoid discovery and rate limits propagate", async (t) => {
  live(t, async () => json({ results: [], total_pages: 0 }));
  assert.equal(
    (await listMovies({ q: "unknown", page: 1, sort: "relevance" })).movies
      .length,
    0,
  );
  assert.equal(globalThis.fetch.mock.callCount(), 2);
  globalThis.fetch.mock.mockImplementation(
    async () => new Response("", { status: 429 }),
  );
  await assert.rejects(
    () => listMovies({ q: "space", page: 1, sort: "relevance" }),
    /temporarily unavailable/,
  );
});
test("details preserve billing order, deduplicate recommendations and fallback trailers", async (t) => {
  live(t, async (address) => {
    const url = new URL(address);
    if (url.pathname.endsWith("/videos")) {
      assert.equal(url.searchParams.get("language"), "fr");
      return json({
        results: [{ site: "Vimeo", key: "123456", type: "Trailer" }],
      });
    }
    assert.match(
      url.searchParams.get("append_to_response"),
      /credits,videos,recommendations/,
    );
    return json({
      id: 4,
      title: "Test movie",
      original_language: "fr",
      credits: {
        cast: [
          { id: 2, name: "Second", order: 2 },
          { id: 1, name: "First", order: 1 },
        ],
      },
      recommendations: {
        results: [
          { id: 4 },
          { id: 5, title: "Other" },
          { id: 5, title: "Other" },
        ],
      },
    });
  });
  const movie = await getMovie("4");
  assert.equal(movie.cast[0].name, "First");
  assert.equal(movie.recommendations.length, 1);
  assert.equal(movie.trailer.site, "Vimeo");
  assert.equal(movie.score, null);
});
test("invalid IDs do not fetch and unknown provider IDs return null", async (t) => {
  live(t, async () => new Response("", { status: 404 }));
  assert.equal(await getMovie("../bad"), null);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
  assert.equal(await getMovie("998"), null);
});
