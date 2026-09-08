// Deliberately fictional records: no demo values are represented as real film facts.
export const fixtures = Array.from({ length: 26 }, (_, i) => ({
  id: String(90000001 + i),
  title:
    i === 0
      ? "Beyond the Quiet Stars"
      : i === 1
        ? "The Last Picture House"
        : i === 2
          ? "A Very Long Journey Through the Extraordinary Constellations of Home"
          : `Space: Expedition ${i + 1}`,
  year: String(2026 - (i % 8)),
  releaseDate: `${2026 - (i % 8)}-06-01`,
  poster: null,
  backdrop: null,
  score: i === 1 ? null : 7.2,
  genres: ["Science Fiction", "Adventure"],
  overview:
    "A fictional preview story about a small crew finding connection far from home. This record exists only to demonstrate CineScope.",
  runtime: i === 1 ? null : 112,
  status: "Demo record",
  language: "English",
  director: "Demo director",
  certification: null,
  cast:
    i === 1
      ? []
      : Array.from({ length: 15 }, (_, n) => ({
          id: String(n),
          name: `Demo performer ${n + 1}`,
          character: n === 2 ? "" : `Crew member ${n + 1}`,
          portrait: null,
        })),
  trailer:
    i === 1
      ? null
      : {
          site: "YouTube",
          key: "aqz-KE-bpKQ",
          name: "Big Buck Bunny — sample video, not a movie trailer",
        },
  keywords: ["space", "space travel", "adventure", "friendship"],
}));
